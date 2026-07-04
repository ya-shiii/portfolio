<template>
  <div class="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-6 select-none">
    <div class="flex flex-col items-center gap-3">
      <button 
        v-for="(node, idx) in navigationList"
        :key="node.id"
        class="w-1.5 h-1.5 rounded-full border border-white/20 transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
        :class="{ 'bg-primary border-primary scale-125': node.id === activeSectionId, 'bg-transparent hover:bg-white/40': node.id !== activeSectionId }"
        @click="$emit('navigate', node.id)"
        :aria-label="`Navigate to ${node.label}`"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePortfolioContent } from '~/composables/usePortfolioContent'

defineProps({
  activeSectionId: {
    type: String,
    default: 'hero'
  }
})

defineEmits(['navigate'])

const { getPortfolio } = usePortfolioContent()
const { navigation } = getPortfolio()
const navigationList = navigation.filter(n => n.id !== 'hero') // filter out initial view node for side indicator
</script>
