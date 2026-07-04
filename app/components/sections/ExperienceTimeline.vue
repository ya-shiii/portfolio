<template>
  <section class="min-h-screen w-full flex flex-col justify-center px-6 md:px-24 py-24 relative z-10">
    <div class="max-w-4xl w-full mx-auto">
      <div class="flex items-center gap-4 mb-12 reveal-header" style="animation-delay: 0s">
        <span class="font-mono text-xs tracking-widest text-primary">04 / EXPERIENCE</span>
        <div class="h-[1px] flex-grow bg-white/10"></div>
      </div>

      <!-- Vertical Timeline Path -->
      <div class="relative pl-6 md:pl-8 border-l border-white/10 flex flex-col gap-12">
        
        <div 
          v-for="(job, idx) in experience" 
          :key="idx"
          class="relative group reveal-job"
          :style="{ animationDelay: `${0.1 + idx * 0.15}s` }"
        >
          <!-- Core indicator node mapping -->
          <div class="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary group-hover:scale-125 transition-transform flex items-center justify-center">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          </div>

          <div class="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
            <div>
              <span class="font-mono text-xs text-primary font-bold">
                {{ job.period }}
              </span>
              <h3 class="font-sans text-lg font-bold text-white uppercase mt-0.5">
                {{ job.role }}
              </h3>
              <p class="font-mono text-xs text-white/50 tracking-wider">
                {{ job.organization }} &middot; {{ job.location }}
              </p>
            </div>
          </div>

          <p class="font-sans text-xs md:text-sm text-muted mb-4 max-w-2xl leading-relaxed">
            {{ job.summary }}
          </p>

          <!-- Progressive Disclosure for detailed highlights -->
          <div class="flex flex-col gap-2">
            <button 
              @click="toggleHighlight(idx)"
              class="w-fit flex items-center gap-2 font-mono text-[10px] text-primary hover:text-white transition-colors uppercase outline-none focus-visible:ring-1 focus-visible:ring-primary rounded px-1 py-0.5 cursor-pointer"
            >
              <span>{{ activeHighlightIdx === idx ? 'Hide Highlights' : 'Reveal Highlights' }}</span>
              <span class="text-[8px] transform" :class="{ 'rotate-180': activeHighlightIdx === idx }">▼</span>
            </button>
            
            <Transition name="slide">
              <ul 
                v-if="activeHighlightIdx === idx" 
                class="list-none pl-0 flex flex-col gap-2 mt-2 max-w-2xl border-l border-primary/20 pl-4 py-1"
              >
                <li 
                  v-for="(hl, hIdx) in job.highlights" 
                  :key="hIdx"
                  class="font-sans text-xs text-muted/80 leading-relaxed flex items-start gap-2"
                >
                  <span class="text-primary font-bold">&raquo;</span>
                  <span>{{ hl }}</span>
                </li>
              </ul>
            </Transition>
          </div>

          <div class="flex flex-wrap gap-1.5 mt-4">
            <span 
              v-for="tech in job.technologies" 
              :key="tech"
              class="font-mono text-[9px] bg-surface/40 border border-white/5 px-2 py-0.5 rounded text-white/50"
            >
              {{ tech }}
            </span>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePortfolioContent } from '~/composables/usePortfolioContent'

defineProps<{ isActive: boolean }>()

const { getPortfolio } = usePortfolioContent()
const { experience } = getPortfolio()

const activeHighlightIdx = ref<number | null>(null)

const toggleHighlight = (idx: number) => {
  if (activeHighlightIdx.value === idx) {
    activeHighlightIdx.value = null
  } else {
    activeHighlightIdx.value = idx
  }
}
</script>

<style scoped>
.reveal-header {
  opacity: 0;
  transform: translateX(-20px);
  animation: fromLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.reveal-job {
  opacity: 0;
  transform: translateY(20px);
  animation: jobIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fromLeft {
  to { opacity: 1; transform: translateX(0); }
}

@keyframes jobIn {
  to { opacity: 1; transform: translateY(0); }
}

.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease-out, opacity 0.2s ease-out;
  max-height: 200px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
