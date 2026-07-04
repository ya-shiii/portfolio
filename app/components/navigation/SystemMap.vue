<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col justify-center items-center p-6 overflow-y-auto">
      
      <!-- Spatial Constellation Container (Desktop) -->
      <div class="hidden md:flex relative w-[800px] h-[500px] justify-center items-center">
        <!-- SVG Connections Layer -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none z-0">
          <!-- Connect central position to all nodes -->
          <line 
            v-for="node in desktopNodes" 
            :key="'line-' + node.id"
            x1="400" 
            y1="250" 
            :x2="node.x" 
            :y2="node.y"
            stroke="rgba(160, 32, 240, 0.2)"
            stroke-width="1.5"
            :class="{ 'stroke-primary/70 stroke-[2px]': hoveredNodeId === node.id }"
            class="transition-all duration-300"
          />
        </svg>

        <!-- Central Node indicator representing Current Position -->
        <div class="absolute left-[380px] top-[230px] w-10 h-10 rounded-full border border-primary/40 flex flex-col items-center justify-center bg-background/80 z-10">
          <span class="text-[8px] font-mono tracking-widest text-primary">CORE</span>
        </div>

        <!-- Section Nodes -->
        <div 
          v-for="node in desktopNodes"
          :key="node.id"
          class="absolute z-20 group"
          :style="{ left: `${node.x - 75}px`, top: `${node.y - 30}px`, width: '150px', height: '60px' }"
        >
          <button 
            @click="selectNode(node.id)"
            @mouseenter="hoveredNodeId = node.id"
            @mouseleave="hoveredNodeId = null"
            class="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-transparent border-none outline-none"
          >
            <span class="font-mono text-[10px] text-primary/70 tracking-widest mb-1 group-hover:text-primary transition-colors">
              {{ node.number }}
            </span>
            <span class="font-sans text-xs font-medium tracking-widest text-white/80 group-hover:text-white uppercase transition-colors text-center">
              {{ node.label }}
            </span>
            <span class="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 group-hover:bg-primary group-hover:scale-150 transition-all"></span>
          </button>
        </div>
      </div>

      <!-- Simplified Vertical path (Mobile) -->
      <div class="md:hidden flex flex-col gap-8 w-full max-w-xs items-center py-12">
        <div 
          v-for="node in navigation" 
          :key="'mob-' + node.id"
          class="flex flex-col items-center gap-1.5"
        >
          <button 
            @click="selectNode(node.id)"
            class="flex flex-col items-center bg-transparent border-none text-center outline-none"
          >
            <span class="font-mono text-[9px] text-primary">{{ node.number }}</span>
            <span class="font-sans text-sm tracking-widest text-white/90 uppercase font-semibold mt-0.5">{{ node.label }}</span>
          </button>
          <div v-if="node.id !== navigation[navigation.length - 1].id" class="w-[1px] h-6 bg-primary/20"></div>
        </div>
      </div>

      <div class="absolute bottom-10 text-center select-none pointer-events-none">
        <p class="font-mono text-[10px] text-muted/40 tracking-[0.2em] uppercase">SYSTEM MAP NAVIGATION ACTIVE</p>
      </div>

    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePortfolioContent } from '~/composables/usePortfolioContent'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'navigate'])

const { getPortfolio } = usePortfolioContent()
const { navigation } = getPortfolio()

const hoveredNodeId = ref<string | null>(null)

// Desktop visual layout nodes configuration mapped onto coordinates inside the 800x500 constellation canvas
const desktopNodes = [
  { id: 'selected-systems', label: 'Selected Systems', number: '01', x: 400, y: 70 },
  { id: 'what-i-build', label: 'What I Build', number: '02', x: 180, y: 160 },
  { id: 'about', label: 'About', number: '03', x: 620, y: 160 },
  { id: 'experience', label: 'Experience', number: '04', x: 180, y: 340 },
  { id: 'beyond-code', label: 'Beyond the Code', number: '05', x: 620, y: 340 },
  { id: 'system-stack', label: 'System Stack', number: '06', x: 400, y: 430 },
  { id: 'contact', label: 'Contact', number: '07', x: 400, y: 250 + 100 } // reposition dynamically if overlapping
]

// Overwrite coordinates to avoid direct overlapping of contact node with core
desktopNodes[6] = { id: 'contact', label: 'Contact', number: '07', x: 400, y: 430 }
desktopNodes[5] = { id: 'system-stack', label: 'System Stack', number: '06', x: 260, y: 410 }
desktopNodes[4] = { id: 'beyond-code', label: 'Beyond the Code', number: '05', x: 540, y: 410 }
desktopNodes[3] = { id: 'experience', label: 'Experience', number: '04', x: 140, y: 280 }
desktopNodes[2] = { id: 'about', label: 'About', number: '03', x: 660, y: 280 }
desktopNodes[1] = { id: 'what-i-build', label: 'What I Build', number: '02', x: 220, y: 120 }
desktopNodes[0] = { id: 'selected-systems', label: 'Selected Systems', number: '01', x: 580, y: 120 }

const selectNode = (id: string) => {
  emit('navigate', id)
  emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>
