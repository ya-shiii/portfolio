<template>
  <section class="min-h-screen w-full flex flex-col justify-center px-6 md:px-24 py-20 relative z-10 select-none">
    <div class="max-w-4xl flex flex-col items-start gap-4">
      <span
        class="reveal-item font-mono text-xs tracking-[0.3em] text-primary uppercase animate-pulse"
        :style="{ animationDelay: '0s' }"
      >
        // {{ hero.eyebrow }}
      </span>

      <!-- Statically render first lines, type dynamically on the third line -->
      <h1 class="font-sans text-4xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] uppercase flex flex-col gap-2 min-h-[3.3em] md:min-h-[3.3em]">
        <span class="hero-line block" style="animation-delay: 0.1s">
          I BUILD SOFTWARE
        </span>
        <span class="hero-line block" style="animation-delay: 0.24s">
          THAT MAKES SYSTEMS
        </span>
        <span class="hero-line block text-primary relative" style="animation-delay: 0.38s">
          <span>{{ typedText }}</span>
          <span class="cursor-blink ml-1">|</span>
        </span>
      </h1>

      <p
        class="reveal-item font-sans text-sm md:text-base text-muted max-w-lg mt-4 leading-relaxed"
        :style="{ animationDelay: '0.55s' }"
      >
        {{ hero.description }}
      </p>

      <div
        class="reveal-item flex flex-wrap gap-4 mt-8"
        :style="{ animationDelay: '0.7s' }"
      >
        <button
          @click="$emit('navigate', 'selected-systems')"
          class="px-6 py-3 bg-primary text-white font-mono text-xs tracking-widest uppercase hover:bg-secondary transition-all rounded cursor-pointer border border-primary hover:border-secondary shadow-[0_0_15px_rgba(160,32,240,0.3)] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          {{ hero.primaryCtaText }}
        </button>
        <button
          @click="$emit('navigate', 'about')"
          class="px-6 py-3 bg-transparent text-white font-mono text-xs tracking-widest uppercase hover:bg-white/5 transition-all rounded cursor-pointer border border-white/20 hover:border-white/50 outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {{ hero.secondaryCtaText }} →
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { usePortfolioContent } from '~/composables/usePortfolioContent'

const props = defineProps<{ isActive: boolean }>()
defineEmits(['navigate'])

const { getPortfolio } = usePortfolioContent()
const { hero } = getPortfolio()

// Typist loop variables
const phraseOptions = ['WORK BETTER.', 'RUN FASTER.', 'SCALE EASILY.', 'STAY SECURE.']
const typedText = ref('')
let currentPhraseIndex = 0
let isDeleting = false
let typingTimeout: ReturnType<typeof setTimeout> | null = null

const startTypingLoop = () => {
  const currentPhrase = phraseOptions[currentPhraseIndex] || ''
  
  if (!isDeleting) {
    // Add character
    typedText.value = currentPhrase.substring(0, typedText.value.length + 1)
    
    // Check if fully typed
    if (typedText.value === currentPhrase) {
      isDeleting = true
      typingTimeout = setTimeout(startTypingLoop, 2000) // Pause when complete
      return
    }
    
    typingTimeout = setTimeout(startTypingLoop, 100) // Typing speed
  } else {
    // Remove character
    typedText.value = currentPhrase.substring(0, typedText.value.length - 1)
    
    // Check if fully deleted
    if (typedText.value === '') {
      isDeleting = false
      currentPhraseIndex = (currentPhraseIndex + 1) % phraseOptions.length
      typingTimeout = setTimeout(startTypingLoop, 300) // Small pause before typing next
      return
    }
    
    typingTimeout = setTimeout(startTypingLoop, 60) // Deleting speed
  }
}

watch(() => props.isActive, (active) => {
  if (active) {
    if (typingTimeout) clearTimeout(typingTimeout)
    typedText.value = ''
    currentPhraseIndex = 0
    isDeleting = false
    // Start typing after headline lines finish their initial slides
    typingTimeout = setTimeout(startTypingLoop, 600)
  } else {
    if (typingTimeout) {
      clearTimeout(typingTimeout)
      typingTimeout = null
    }
  }
}, { immediate: true })

onUnmounted(() => {
  if (typingTimeout) clearTimeout(typingTimeout)
})
</script>

<style scoped>
.hero-line {
  opacity: 0;
  transform: translateY(24px);
  animation: heroSlideUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.reveal-item {
  opacity: 0;
  transform: translateY(16px);
  animation: heroSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.cursor-blink {
  font-weight: 300;
  animation: blink 0.8s step-end infinite;
}

@keyframes heroSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}
</style>
