<template>
  <section class="min-h-screen w-full flex flex-col justify-center px-6 md:px-24 py-24 relative z-10">
    <div class="max-w-5xl w-full mx-auto">
      <div class="flex items-center gap-4 mb-12">
        <span class="font-mono text-xs tracking-widest text-primary">01 / SELECTED SYSTEMS</span>
        <div class="h-[1px] flex-grow bg-white/10"></div>
      </div>

      <!-- Spatial/Cluster Project Layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div 
          v-for="(project, index) in projects" 
          :key="project.slug"
          class="group relative bg-surface/30 hover:bg-surface/50 border border-white/5 hover:border-primary/40 rounded-lg p-6 md:p-8 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[300px]"
          @click="navigateToProject(project.slug)"
        >
          <!-- Background decorative node lines -->
          <div class="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-white/10 group-hover:border-primary/80 transition-colors"></div>
          <div class="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-white/10 group-hover:border-primary/80 transition-colors"></div>

          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-xs text-primary font-bold tracking-wider">
                {{ project.projectNumber }}
              </span>
              <span class="font-mono text-[10px] text-white/40 tracking-widest uppercase">
                {{ project.category }}
              </span>
            </div>

            <h3 class="font-sans text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors tracking-tight uppercase">
              {{ project.title }}
            </h3>

            <p class="font-sans text-xs md:text-sm text-muted mt-2 leading-relaxed max-w-sm">
              {{ project.summary }}
            </p>
          </div>

          <div class="mt-8">
            <div class="flex flex-wrap gap-1.5 mb-6">
              <span 
                v-for="tech in project.technologies" 
                :key="tech"
                class="font-mono text-[9px] bg-background/80 border border-white/5 px-2 py-0.5 rounded text-white/60 group-hover:text-white/90 group-hover:border-primary/30 transition-all"
              >
                {{ tech }}
              </span>
            </div>
            
            <div class="flex items-center gap-2 font-mono text-[10px] tracking-widest text-primary uppercase font-semibold">
              <span>EXPLORE SYSTEM</span>
              <span class="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePortfolioContent } from '~/composables/usePortfolioContent'

const { getProjects } = usePortfolioContent()
const projects = getProjects()

const navigateToProject = (slug: string) => {
  navigateTo(`/projects/${slug}`)
}
</script>
