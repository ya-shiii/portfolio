<template>
  <main v-if="project" class="min-h-screen w-full bg-background relative overflow-x-hidden text-white py-24 px-6 md:px-24">
    
    <!-- Immersive space backdrop network -->
    <GlobalNetwork mode="project" />

    <!-- Top Left Identity Logo -->
    <SystemIdentity />

    <div class="max-w-4xl w-full mx-auto relative z-10">
      
      <!-- Back button -->
      <NuxtLink 
        to="/"
        class="inline-flex items-center gap-2 font-mono text-[10px] text-primary tracking-widest uppercase hover:text-white transition-colors mb-12"
      >
        <span>&larr; Return to Core System</span>
      </NuxtLink>

      <div class="flex flex-col gap-2 mb-12">
        <div class="flex flex-wrap items-center gap-4">
          <span class="font-mono text-xs text-primary font-bold">{{ project.projectNumber }}</span>
          <span class="w-1.5 h-[1px] bg-white/20"></span>
          <span class="font-mono text-[10px] text-white/40 tracking-widest uppercase">{{ project.category }}</span>
        </div>
        
        <h1 class="font-sans text-4xl md:text-6xl font-bold tracking-tight text-white uppercase mt-2">
          {{ project.title }}
        </h1>
        <p class="font-sans text-lg md:text-xl text-primary font-medium tracking-wide">
          {{ project.subtitle }}
        </p>
      </div>

      <!-- Metadata Matrix bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-white/10 mb-12">
        <div>
          <span class="font-mono text-[9px] text-white/30 tracking-widest uppercase block mb-1">CLIENT TYPE</span>
          <span class="font-sans text-xs text-white/80 font-semibold">{{ project.clientType }}</span>
        </div>
        <div>
          <span class="font-mono text-[9px] text-white/30 tracking-widest uppercase block mb-1">DURATION</span>
          <span class="font-sans text-xs text-white/80 font-semibold">{{ project.dateRange }}</span>
        </div>
        <div>
          <span class="font-mono text-[9px] text-white/30 tracking-widest uppercase block mb-1">ROLE / POSITION</span>
          <span class="font-sans text-xs text-white/80 font-semibold">{{ project.role }}</span>
        </div>
        <div>
          <span class="font-mono text-[9px] text-white/30 tracking-widest uppercase block mb-1">LINKS</span>
          <div class="flex items-center gap-3 mt-0.5">
            <a 
              v-if="project.githubLink"
              :href="project.githubLink"
              target="_blank"
              class="font-mono text-[10px] text-primary hover:underline uppercase"
            >
              Code base
            </a>
            <a 
              v-if="project.liveLink"
              :href="project.liveLink"
              target="_blank"
              class="font-mono text-[10px] text-primary hover:underline uppercase"
            >
              Demo URL
            </a>
          </div>
        </div>
      </div>

      <!-- Case study sections content blocks -->
      <div class="flex flex-col gap-12 font-sans text-sm md:text-base leading-relaxed text-muted">
        <div>
          <h3 class="font-mono text-[10px] text-primary tracking-widest uppercase mb-3">// OVERVIEW</h3>
          <p>{{ project.overview }}</p>
        </div>

        <div>
          <h3 class="font-mono text-[10px] text-primary tracking-widest uppercase mb-3">// THE PROBLEM</h3>
          <p>{{ project.problem }}</p>
        </div>

        <div>
          <h3 class="font-mono text-[10px] text-primary tracking-widest uppercase mb-3">// THE SOLUTION</h3>
          <p>{{ project.solution }}</p>
        </div>

        <!-- Workflow Component Visualizer -->
        <div v-if="project.workflow && project.workflow.length">
          <h3 class="font-mono text-[10px] text-primary tracking-widest uppercase mb-3">// DATA ROUTING PATHWAYS</h3>
          <ProjectWorkflow :steps="project.workflow" />
        </div>

        <div>
          <h3 class="font-mono text-[10px] text-primary tracking-widest uppercase mb-3">// CORE IMPLEMENTATIONS</h3>
          <ul class="list-disc pl-6 flex flex-col gap-2">
            <li v-for="feat in project.features" :key="feat">
              {{ feat }}
            </li>
          </ul>
        </div>

        <!-- Technical Decisions details table -->
        <div v-if="project.technicalDecisions && project.technicalDecisions.length">
          <h3 class="font-mono text-[10px] text-primary tracking-widest uppercase mb-6">// ARCHITECTURAL SELECTIONS</h3>
          <div class="flex flex-col border border-white/10 rounded overflow-hidden">
            <div class="grid grid-cols-3 bg-surface/30 px-4 py-2.5 border-b border-white/10 font-mono text-[9px] text-white/50 uppercase tracking-widest">
              <div>Domain</div>
              <div>Selection</div>
              <div>Rationale</div>
            </div>
            <div 
              v-for="(dec, idx) in project.technicalDecisions" 
              :key="idx"
              class="grid grid-cols-3 px-4 py-3 border-b border-white/5 last:border-0 font-sans text-xs text-white/80"
            >
              <div class="font-semibold text-primary/80 uppercase">{{ dec.area }}</div>
              <div class="font-mono text-white/95">{{ dec.tech }}</div>
              <div class="text-muted/80 leading-relaxed">{{ dec.reason }}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-mono text-[10px] text-primary tracking-widest uppercase mb-3">// IMPLEMENTATION CHALLENGES</h3>
          <p>{{ project.challenges }}</p>
        </div>

        <div>
          <h3 class="font-mono text-[10px] text-primary tracking-widest uppercase mb-3">// OUTCOMES & METRICS</h3>
          <p>{{ project.outcomes }}</p>
        </div>
      </div>

    </div>
  </main>
  
  <div v-else class="min-h-screen bg-background flex flex-col items-center justify-center font-mono text-xs text-primary">
    <span>RETRIEVING DATA STREAM...</span>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { usePortfolioContent } from '~/composables/usePortfolioContent'
import GlobalNetwork from '~/components/global/GlobalNetwork.vue'
import SystemIdentity from '~/components/global/SystemIdentity.vue'
import ProjectWorkflow from '~/components/projects/ProjectWorkflow.vue'

const route = useRoute()
const { getProjectBySlug } = usePortfolioContent()

const slug = computed(() => route.params.slug as string)
const project = computed(() => getProjectBySlug(slug.value))

// Dynamic head configuration for SEO validation
useHead({
  title: project.value ? `${project.value.title} | Systems Portfolio` : 'Systems Portfolio Project'
})
</script>
