<template>
  <!-- prevent event bubbling to background WebGL canvas to stop interactive mouse lag during scrolling/dragging -->
  <div 
    class="w-full py-4 overflow-x-auto select-none scrollbar-thin relative z-30 translate-z-0 will-change-scroll overscroll-x-contain"
    @pointermove.stop
    @mousemove.stop
    @touchmove.stop
  >
    <div class="flex flex-row items-center justify-start gap-4 py-6 px-4 w-max transform-gpu">
      
      <div 
        v-for="(step, idx) in steps" 
        :key="idx"
        class="flex flex-row items-center gap-4 shrink-0"
      >
        <!-- Workflow Node Bubble -->
        <div class="bg-surface/60 border border-primary/30 rounded-lg px-5 py-4 flex flex-col items-center gap-1.5 shadow-[0_0_15px_rgba(160,32,240,0.1)] relative min-w-[130px] text-center">
          <span class="font-mono text-[8px] text-primary/70 tracking-widest uppercase">STEP {{ idx + 1 }}</span>
          <span class="font-sans text-[11px] font-bold text-white uppercase tracking-wider">{{ step.from }}</span>
          
          <div class="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse-slow"></div>
        </div>

        <!-- Connection Arrow with path label -->
        <div v-if="idx < steps.length - 1" class="flex flex-col items-center gap-1.5 shrink-0">
          <span class="font-mono text-[8px] text-white/40 tracking-widest uppercase px-2 text-center max-w-[100px] whitespace-normal">
            {{ step.label }}
          </span>
          <div class="flex items-center">
            <span class="w-10 h-[1px] bg-primary/30 block"></span>
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
