<template>
  <section class="min-h-screen w-full flex flex-col justify-center px-6 md:px-24 py-24 relative z-10">
    <div class="max-w-5xl w-full mx-auto">
      <div class="flex items-center gap-4 mb-12 reveal-header" style="animation-delay: 0s">
        <span class="font-mono text-xs tracking-widest text-primary">02 / WHAT I BUILD</span>
        <div class="h-[1px] flex-grow bg-white/10"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div
          v-for="(cat, idx) in whatIBuild"
          :key="idx"
          class="split-reveal bg-surface/20 border border-white/5 p-6 md:p-8 rounded-lg hover:border-primary/20 transition-all group relative overflow-hidden"
          :style="{ animationDelay: `${0.08 + idx * 0.14}s`, '--dir': idx % 2 === 0 ? '-28px' : '28px' }"
        >
          <!-- Subtle layout glow -->
          <div class="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all"></div>

          <h3 class="font-sans text-lg font-bold text-white uppercase mb-3">{{ cat.title }}</h3>
          <p class="font-sans text-xs md:text-sm text-muted mb-6 leading-relaxed">{{ cat.description }}</p>

          <div class="flex flex-col gap-2">
            <div
              v-for="(detail, dIdx) in cat.details"
              :key="detail"
              class="detail-reveal flex items-center gap-2.5 font-mono text-[10px] text-white/50"
              :style="{ animationDelay: `${0.22 + idx * 0.14 + dIdx * 0.06}s` }"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
              <span>{{ detail }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePortfolioContent } from '~/composables/usePortfolioContent'

defineProps<{ isActive: boolean }>()

const { getPortfolio } = usePortfolioContent()
const { whatIBuild } = getPortfolio()
</script>

<style scoped>
.reveal-header {
  opacity: 0;
  transform: translateX(-20px);
  animation: fromLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Cards alternate: left card from left, right card from right */
.split-reveal {
  opacity: 0;
  transform: translateX(var(--dir, -28px)) translateY(16px);
  animation: splitIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Detail rows stagger up inside each card */
.detail-reveal {
  opacity: 0;
  transform: translateX(-8px);
  animation: detailIn 0.4s ease-out forwards;
}

@keyframes fromLeft {
  to { opacity: 1; transform: translateX(0); }
}

@keyframes splitIn {
  to { opacity: 1; transform: translateX(0) translateY(0); }
}

@keyframes detailIn {
  to { opacity: 1; transform: translateX(0); }
}
</style>
