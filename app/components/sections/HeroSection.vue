<template>
  <section class="min-h-screen w-full flex flex-col justify-center px-6 md:px-24 py-20 relative z-10 select-none">
    <div class="max-w-4xl flex flex-col items-start gap-4">
      <span class="font-mono text-xs tracking-[0.3em] text-primary uppercase animate-pulse">
        // {{ hero.eyebrow }}
      </span>

      <h1 class="font-sans text-4xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] uppercase flex flex-col gap-2">
        <span 
          v-for="(line, idx) in hero.headlineLines" 
          :key="idx"
          class="hero-line block"
          :style="{ animationDelay: `${idx * 0.15}s` }"
        >
          {{ line }}
        </span>
      </h1>

      <p class="font-sans text-sm md:text-base text-muted max-w-lg mt-4 leading-relaxed">
        {{ hero.description }}
      </p>

      <div class="flex flex-wrap gap-4 mt-8">
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
import { usePortfolioContent } from '~/composables/usePortfolioContent'

defineEmits(['navigate'])

const { getPortfolio } = usePortfolioContent()
const { hero } = getPortfolio()
</script>

<style scoped>
.hero-line {
  opacity: 0;
  transform: translateY(20px);
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
