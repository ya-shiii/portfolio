<template>
  <Transition 
    :css="false"
    @enter="onEnter"
    @leave="onLeave"
  >
    <div v-show="isOpen" class="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col justify-center items-center p-6 overflow-y-auto select-none">
      
      <!-- Spatial Constellation Container (Desktop) -->
      <div 
        ref="constellationRef"
        class="hidden md:flex relative w-[1000px] h-[600px] justify-center items-center transition-transform duration-300 md:scale-[0.75] lg:scale-[0.9] xl:scale-[1.1] 2xl:scale-[1.3] origin-center"
      >
        <!-- SVG Connections Layer -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none z-0">
          <line 
            v-for="node in reactiveNodes" 
            :key="'line-' + node.id"
            :x1="CENTER_X" 
            :y1="CENTER_Y" 
            :x2="node.currentX" 
            :y2="node.dotY"
            stroke="rgba(160, 32, 240, 0.25)"
            stroke-width="1.5"
            :style="{ opacity: node.lineOpacity }"
            :class="{ 'stroke-primary stroke-[2.5px] line-bloom-glow': hoveredNodeId === node.id }"
            class="line-connector"
          />
        </svg>

        <!-- Central Node indicator representing Current Position (CORE) -->
        <div 
          class="absolute left-[480px] top-[280px] w-10 h-10 rounded-full border border-primary/50 flex flex-col items-center justify-center bg-background/90 z-10"
          :style="{ 
            transform: `scale(${coreState.scale})`,
            opacity: coreState.opacity,
            boxShadow: `0 0 ${15 + coreState.glow * 25}px rgba(160,32,240,${0.3 + coreState.glow * 0.7})`
          }"
        >
          <span class="text-[8px] font-mono tracking-widest text-primary font-bold">CORE</span>
        </div>

        <!-- Section Nodes -->
        <div 
          v-for="node in reactiveNodes"
          :key="node.id"
          class="absolute z-20 cursor-pointer"
          :style="{ 
            left: `${node.currentX}px`, 
            top: `${node.currentY}px`,
            width: '200px',
            height: '70px',
            transform: `translate(-50%, -50%) scale(${node.nodeScale})`,
            opacity: node.nodeOpacity
          }"
        >
          <button 
            @click="selectNode(node.id)"
            @mouseenter="hoveredNodeId = node.id"
            @mouseleave="hoveredNodeId = null"
            class="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-transparent border-none outline-none group"
          >
            <span 
              class="font-mono text-[11px] md:text-[12px] lg:text-[14px] tracking-widest mb-0.5 transition-colors duration-300"
              :class="hoveredNodeId === node.id ? 'text-primary' : 'text-primary/70'"
              :style="{ opacity: node.labelOpacity }"
            >
              {{ node.number }}
            </span>
            <span 
              class="font-sans text-[13px] md:text-[15px] lg:text-[18px] font-medium tracking-widest uppercase transition-colors duration-300 text-center"
              :class="hoveredNodeId === node.id ? 'text-white scale-105 drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]' : 'text-white/80'"
              :style="{ opacity: node.labelOpacity }"
            >
              {{ node.label }}
            </span>
            <!-- Glowing point indicator (connector endpoint target) -->
            <span 
              class="w-1.5 h-1.5 rounded-full mt-1.5 transition-all duration-300"
              :class="hoveredNodeId === node.id ? 'bg-primary scale-150 shadow-[0_0_10px_#A020F0]' : 'bg-white/20'"
            ></span>
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
          <div v-if="node.id !== navigation[navigation.length - 1]?.id" class="w-[1px] h-6 bg-primary/20"></div>
        </div>
      </div>

      <div class="absolute bottom-10 text-center select-none pointer-events-none">
        <p class="font-mono text-[10px] text-muted/40 tracking-[0.2em] uppercase">SYSTEM MAP NAVIGATION ACTIVE</p>
      </div>

    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { usePortfolioContent } from '~/composables/usePortfolioContent'
import { gsap } from 'gsap'

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
const constellationRef = ref<HTMLElement | null>(null)

// ─── LAYOUT CONSTANTS ───
const CENTER_X = 500
const CENTER_Y = 300
// Vertical offset from node div center to the glowing dot indicator center
const DOT_OFFSET = 26

// ─── TIME TRACKER ───
// Drives autonomous floating drift via multi-frequency sine waves
const time = ref(0)
let animationId: number

const updateTime = () => {
  time.value += 0.015
  animationId = requestAnimationFrame(updateTime)
}

onMounted(() => {
  updateTime()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  if (currentTimeline) {
    currentTimeline.kill()
    currentTimeline = null
  }
})

// ─── BASE NODE ANCHORS ───
// Desktop layout anchor positions for each navigation node
const baseNodes = [
  { id: 'selected-systems', label: 'Selected Systems', number: '01', x: 720, y: 120 },
  { id: 'what-i-build', label: 'What I Build', number: '02', x: 280, y: 120 },
  { id: 'about', label: 'About', number: '03', x: 820, y: 300 },
  { id: 'experience', label: 'Experience', number: '04', x: 180, y: 300 },
  { id: 'beyond-code', label: 'Beyond the Code', number: '05', x: 720, y: 480 },
  { id: 'system-stack', label: 'System Stack', number: '06', x: 280, y: 480 },
  { id: 'contact', label: 'Contact', number: '07', x: 500, y: 510 }
]

// ─── REACTIVE ANIMATION STATE ───
// GSAP tweens these reactive objects directly; Vue reactivity propagates
// changes to the computed positions which drive both node CSS and SVG lines.

const animState = reactive({
  phase: 'hidden' as 'hidden' | 'entering' | 'idle' | 'leaving',
  driftAmount: 0, // 0 = no drift, 1 = full autonomous floating
})

// CORE node visual state
const coreState = reactive({
  scale: 0,
  opacity: 0,
  glow: 0, // 0 = normal, 1 = max energy glow
})

// Per-node animation state
const nodeStates = reactive(
  baseNodes.map(() => ({
    progress: 0,      // 0 = at CORE center, 1 = at anchor position
    opacity: 0,       // overall node visibility
    scale: 0.15,      // node transform scale
    labelOpacity: 0,  // label and section number visibility
    lineOpacity: 0,   // connector line visibility
  }))
)

// Timeline reference for cleanup on rapid open/close
let currentTimeline: gsap.core.Timeline | null = null

// ─── UNIFIED POSITION COMPUTATION ───
// Single computed drives BOTH node CSS positioning AND SVG line endpoints,
// guaranteeing connectors are always attached to their dots at every frame.
const reactiveNodes = computed(() => {
  const t = time.value
  const drift = animState.driftAmount

  return baseNodes.map((node, i) => {
    const state = nodeStates[i]
    if (!state) {
      return {
        ...node,
        currentX: node.x,
        currentY: node.y,
        dotY: node.y + DOT_OFFSET,
        nodeScale: 0.15,
        nodeOpacity: 0,
        labelOpacity: 0,
        lineOpacity: 0,
      }
    }

    // Multi-frequency sine waves with different X/Y ratios create
    // Lissajous-like wandering paths (±35-42px effective amplitude)
    const driftX = (
      Math.sin(t * 0.7 + i * 1.5) * 22 +
      Math.sin(t * 0.35 + i * 3.7) * 13 +
      Math.cos(t * 0.2 + i * 5.1) * 7
    ) * drift

    const driftY = (
      Math.cos(t * 0.55 + i * 2.1) * 22 +
      Math.cos(t * 0.28 + i * 4.3) * 13 +
      Math.sin(t * 0.17 + i * 6.7) * 7
    ) * drift

    // Interpolate from CORE center toward anchor, plus additive drift.
    // progress=0 → at center. progress=1 → at anchor. back.out overshoots past 1.
    const currentX = CENTER_X + (node.x - CENTER_X) * state.progress + driftX
    const currentY = CENTER_Y + (node.y - CENTER_Y) * state.progress + driftY

    return {
      ...node,
      currentX,
      currentY,
      dotY: currentY + DOT_OFFSET, // SVG line endpoint tracks the dot indicator
      nodeScale: state.scale,
      nodeOpacity: state.opacity,
      labelOpacity: state.labelOpacity,
      lineOpacity: state.lineOpacity,
    }
  })
})

// ─── NAVIGATION ───
const selectNode = (id: string) => {
  emit('navigate', id)
  emit('close')
}

// ─── BLOOM ENTRANCE ───
// System rapidly blooms into a network from CORE.
// CORE pulses in → nodes explode outward with overshoot → lines grow naturally
// as endpoints track nodes → labels appear after nodes reach outer area → drift enables.
const onEnter = (el: Element, done: () => void) => {
  if (currentTimeline) currentTimeline.kill()
  animState.phase = 'entering'
  animState.driftAmount = 0

  // Reset all states to hidden-at-center
  coreState.scale = 0
  coreState.opacity = 0
  coreState.glow = 0
  nodeStates.forEach(s => {
    s.progress = 0
    s.opacity = 0
    s.scale = 0.15
    s.labelOpacity = 0
    s.lineOpacity = 0
  })

  // Backdrop starts invisible
  gsap.set(el, { opacity: 0 })

  const tl = gsap.timeline({
    onComplete: () => {
      animState.phase = 'idle'
      done()
    }
  })
  currentTimeline = tl

  // Backdrop fade in
  tl.to(el, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)

  // CORE materializes with an energetic pulse
  tl.to(coreState, {
    scale: 1.25, opacity: 1, glow: 0.7,
    duration: 0.35, ease: 'back.out(2.5)'
  }, 0.05)

  // CORE settles to resting size
  tl.to(coreState, {
    scale: 1, glow: 0,
    duration: 0.3, ease: 'power2.out'
  }, 0.4)

  // Nodes explode outward with stagger for organic momentum
  nodeStates.forEach((state, i) => {
    const delay = 0.15 + i * 0.045

    // Node flies outward, overshoots anchor, settles back
    tl.to(state, {
      progress: 1, scale: 1, opacity: 1,
      duration: 0.75, ease: 'back.out(1.7)',
    }, delay)

    // Connector line fades in as node moves outward
    tl.to(state, {
      lineOpacity: 1,
      duration: 0.45, ease: 'power2.out'
    }, delay + 0.08)

    // Labels appear only after node reaches the outer area
    tl.to(state, {
      labelOpacity: 1,
      duration: 0.3, ease: 'power2.out'
    }, delay + 0.4)
  })

  // Enable autonomous floating drift (smooth fade-in)
  tl.to(animState, {
    driftAmount: 1,
    duration: 0.8, ease: 'power1.out'
  }, 0.75)
}

// ─── IMPLOSION EXIT ───
// Network is absorbed back into CORE.
// Labels fade → drift stops → nodes accelerate inward → lines retract naturally
// as endpoints track imploding nodes → CORE compresses/glows → CORE vanishes.
const onLeave = (el: Element, done: () => void) => {
  if (currentTimeline) currentTimeline.kill()
  animState.phase = 'leaving'

  const tl = gsap.timeline({ onComplete: done })
  currentTimeline = tl

  // Smoothly stop floating drift
  tl.to(animState, { driftAmount: 0, duration: 0.25, ease: 'power2.in' }, 0)

  // Labels and section numbers fade out first
  nodeStates.forEach((state, i) => {
    tl.to(state, {
      labelOpacity: 0,
      duration: 0.15,
    }, i * 0.015)
  })

  // Nodes accelerate inward toward CORE (power3.in = slow start, fast finish)
  // Connector lines naturally retract because endpoints track moving nodes
  nodeStates.forEach((state, i) => {
    tl.to(state, {
      progress: 0, scale: 0.1,
      duration: 0.45, ease: 'power3.in',
    }, 0.12 + i * 0.025)

    tl.to(state, {
      opacity: 0, lineOpacity: 0,
      duration: 0.3, ease: 'power2.in',
    }, 0.18 + i * 0.025)
  })

  // CORE briefly compresses and glows from absorbed node energy
  tl.to(coreState, {
    scale: 1.5, glow: 1,
    duration: 0.15, ease: 'power2.out'
  }, 0.5)

  // CORE collapses and vanishes
  tl.to(coreState, {
    scale: 0, opacity: 0, glow: 0,
    duration: 0.25, ease: 'power3.in'
  }, 0.65)

  // Backdrop fades out after everything collapses
  tl.to(el, { opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.7)
}
</script>

<style scoped>
/* Neon glow effect for hovered connection lines */
.line-bloom-glow {
  filter: drop-shadow(0 0 4px #A020F0) drop-shadow(0 0 10px rgba(160, 32, 240, 0.6));
}

/* Smooth hover transitions for connector stroke/glow only.
   Position (x2/y2) and opacity are driven reactively per-frame — no CSS transition. */
.line-connector {
  transition: stroke 0.3s ease, stroke-width 0.3s ease, filter 0.3s ease;
}
</style>
