<template>
  <div class="bg-background text-white min-h-screen">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { usePortfolioContent } from '~/composables/usePortfolioContent'

const { getPortfolio } = usePortfolioContent()
const { identity } = getPortfolio()

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | ${identity.fullName}` : `${identity.fullName} | ${identity.title}`
  }
})
</script>
