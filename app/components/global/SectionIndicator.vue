<template>
  <div class="fixed bottom-8 left-8 z-50 select-none hidden md:flex items-center gap-4 font-mono text-[10px] tracking-[0.2em] text-muted/60">
    <span class="text-white/80 font-semibold">{{ currentNumber }}</span>
    <span class="w-8 h-[1px] bg-muted/20"></span>
    <span class="uppercase">{{ currentLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioContent } from '~/composables/usePortfolioContent'

const props = defineProps({
  activeSectionId: {
    type: String,
    default: 'hero'
  }
})

const { getPortfolio } = usePortfolioContent()
const { navigation } = getPortfolio()

const currentNumber = computed(() => {
  const node = navigation.find(n => n.id === props.activeSectionId)
  return node ? node.number : '00'
})

const currentLabel = computed(() => {
  const node = navigation.find(n => n.id === props.activeSectionId)
  return node ? node.label : 'SYSTEM INIT'
})
</script>
