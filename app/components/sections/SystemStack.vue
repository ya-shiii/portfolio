<template>
  <section class="min-h-screen w-full flex flex-col justify-center px-6 md:px-24 py-24 relative z-10">
    <div class="max-w-4xl w-full mx-auto">
      <div class="flex items-center gap-4 mb-12 reveal-header" style="animation-delay: 0s">
        <span class="font-mono text-xs tracking-widest text-primary">06 / SYSTEM STACK</span>
        <div class="h-[1px] flex-grow bg-white/10"></div>
      </div>

      <!-- Tech stack grid display -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(group, idx) in stack" 
          :key="idx"
          class="bg-surface/10 border border-white/5 p-6 rounded-lg relative reveal-item"
          :style="{ animationDelay: `${0.1 + idx * 0.15}s` }"
        >
          <!-- Corner styling node accents -->
          <div class="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20"></div>

          <h3 class="font-mono text-xs font-bold text-primary tracking-widest uppercase mb-6">
            {{ group.category }}
          </h3>

          <div class="flex flex-col gap-4">
            <div 
              v-for="item in group.items" 
              :key="item"
              class="group/item flex flex-col cursor-pointer"
              @mouseenter="hoveredTech = item"
              @mouseleave="hoveredTech = null"
            >
              <div class="flex items-center justify-between py-0.5">
                <span class="font-sans text-sm font-semibold text-white/80 group-hover/item:text-white transition-colors duration-200">
                  {{ item }}
                </span>
                <span class="w-1.5 h-1.5 rounded-full bg-white/10 group-hover/item:bg-primary transition-all duration-200"></span>
              </div>

              <!-- Smooth expand sub-content using max-height transition -->
              <div class="tech-sub-content" :class="{ 'tech-sub-content--visible': hoveredTech === item }">
                <div class="tech-sub-inner font-mono text-[9px] text-primary/80 pt-1 pb-1">
                  Mapped to &rarr; {{ getProjectsUsingTech(item).join(', ') || 'Global Env' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Spacer line to prevent grid displacement between cards -->
          <div class="mt-4 h-[1px] bg-white/[0.03]"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePortfolioContent } from '~/composables/usePortfolioContent'

defineProps<{ isActive: boolean }>()

const { getPortfolio, getProjects } = usePortfolioContent()
const { stack } = getPortfolio()
const projects = getProjects()

const hoveredTech = ref<string | null>(null)

// Dynamic verification of projects using standard tech identifier
const getProjectsUsingTech = (techName: string) => {
  return projects
    .filter(p => p.technologies.some(t => t.toLowerCase() === techName.toLowerCase()))
    .map(p => p.title)
}
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

/* Smooth expand container using max-height + opacity transition */
.tech-sub-content {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 0.28s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.22s ease;
}

.tech-sub-content--visible {
  grid-template-rows: 1fr;
  opacity: 1;
}

/* Inner wrapper needed for grid-template-rows trick (overflow: hidden on child) */
.tech-sub-inner {
  overflow: hidden;
}
</style>
