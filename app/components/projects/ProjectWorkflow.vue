<template>
  <div class="w-full py-8 overflow-x-auto select-none">
    <div class="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 min-w-[600px] py-4">
      
      <div 
        v-for="(step, idx) in steps" 
        :key="idx"
        class="flex items-center gap-4"
      >
        <!-- Workflow Node Bubble -->
        <div class="bg-surface/40 border border-primary/30 rounded px-4 py-2.5 flex flex-col items-center gap-1 shadow-[0_0_10px_rgba(160,32,240,0.15)] relative">
          <span class="font-mono text-[8px] text-primary/70 tracking-widest uppercase">STEP {{ idx + 1 }}</span>
          <span class="font-sans text-[11px] font-bold text-white uppercase tracking-wider">{{ step.from }}</span>
          
          <div class="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse-slow"></div>
        </div>

        <!-- Connection Arrow with path label -->
        <div v-if="idx < steps.length - 1" class="flex flex-col items-center gap-1">
          <span class="font-mono text-[8px] text-white/30 tracking-widest uppercase px-2 text-center max-w-[80px]">
            {{ step.label }}
          </span>
          <div class="flex items-center">
            <span class="w-8 h-[1px] bg-primary/40 block"></span>
            <span class="text-primary text-[10px] ml-[-2px]">&rarr;</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { WorkflowStep } from '~/types/project'

defineProps({
  steps: {
    type: Array as PropType<WorkflowStep[]>,
    required: true
  }
})
</script>
