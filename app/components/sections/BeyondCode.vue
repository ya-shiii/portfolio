<template>
  <section class="min-h-screen w-full flex flex-col justify-center px-6 md:px-24 py-24 relative z-10">
    <div class="max-w-4xl w-full mx-auto">
      <div class="flex items-center gap-4 mb-12 reveal-header" style="animation-delay: 0s">
        <span class="font-mono text-xs tracking-widest text-primary">05 / BEYOND THE CODE</span>
        <div class="h-[1px] flex-grow bg-white/10"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          v-for="(talk, idx) in speaking" 
          :key="idx"
          class="bg-surface/20 border border-white/5 hover:border-primary/20 rounded-lg p-6 flex flex-col justify-between group transition-colors reveal-item"
          :style="{ animationDelay: `${0.1 + idx * 0.15}s` }"
        >
          <div>
            <div class="flex items-center justify-between gap-4 mb-3">
              <span class="font-mono text-[10px] text-primary tracking-widest uppercase">
                {{ talk.role }}
              </span>
              <span class="font-mono text-[9px] text-white/40 tracking-wider">
                {{ talk.date }}
              </span>
            </div>

            <h3 class="font-sans text-base font-bold text-white group-hover:text-primary transition-colors uppercase leading-snug">
              {{ talk.topic }}
            </h3>

            <p class="font-sans text-xs text-white/60 mt-1 font-medium">
              {{ talk.event }} &middot; {{ talk.location }}
            </p>

            <p class="font-sans text-xs text-muted mt-3 leading-relaxed">
              {{ talk.description }}
            </p>
          </div>

          <div v-if="talk.hasCertificate" class="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <span class="font-mono text-[9px] text-white/30 tracking-widest uppercase">VERIFIED CREDENTIAL</span>
            <NuxtLink 
              :to="'/credentials/' + talk.id"
              class="flex items-center gap-1 font-mono text-[9px] text-primary group-hover:underline cursor-pointer"
            >
              <span>VIEW RECORD</span>
              <span>↗</span>
            </NuxtLink>
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
const { speaking } = getPortfolio()
</script>

<style scoped>
.reveal-header {
  opacity: 0;
  transform: translateX(-20px);
  animation: fromLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.reveal-item {
  opacity: 0;
  transform: translateY(20px);
  animation: itemIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fromLeft {
  to { opacity: 1; transform: translateX(0); }
}

@keyframes itemIn {
  to { opacity: 1; transform: translateY(0); }
}
</style>
