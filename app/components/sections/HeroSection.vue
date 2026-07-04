<template>
  <section class="min-h-screen w-full flex flex-col justify-center px-6 md:px-24 py-20 relative z-10 select-none">
    <div class="max-w-4xl flex flex-col items-start gap-4">
      <span
        class="reveal-item font-mono text-xs tracking-[0.3em] text-primary uppercase animate-pulse"
        :style="{ animationDelay: '0s' }"
      >
        // {{ hero.eyebrow }}
      </span>

      <h1 class="font-sans text-4xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] uppercase flex flex-col gap-2">
        <span
          v-for="(line, idx) in hero.headlineLines"
          :key="idx"
          class="hero-line block"
          :style="{ animationDelay: `${0.1 + idx * 0.14}s` }"
        >
          {{ line }}
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
import { watch } from 'vue'
import { usePortfolioContent } from '~/composables/usePortfolioContent'

const props = defineProps<{ isActive: boolean }>()
defineEmits(['navigate'])

const { getPortfolio } = usePortfolioContent()
const { hero } = getPortfolio()

// Re-trigger CSS animations each time section becomes active
watch(() => props.isActive, (active) => {
  if (!active) return
  // Force reflow: briefly remove and re-add animation classes by toggling a key
  // handled by animationKey in parent — nothing extra needed here
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

@keyframes heroSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
