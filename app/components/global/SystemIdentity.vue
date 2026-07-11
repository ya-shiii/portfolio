<template>
  <div class="fixed top-8 left-8 z-50 flex items-center gap-3 select-none">
    <NuxtLink to="/" @click="handleLogoClick" class="flex items-center gap-2 group cursor-pointer">
      <span class="font-mono text-xs tracking-widest text-primary border border-primary/30 px-1.5 py-0.5 rounded bg-background/50 backdrop-blur-sm group-hover:border-primary/80 transition-colors">
        {{ identity.initials }}
      </span>
      <span class="font-sans font-bold text-xs tracking-[0.25em] text-white uppercase opacity-80 group-hover:opacity-100 transition-opacity">
        / SYSTEMS
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { usePortfolioContent } from '~/composables/usePortfolioContent'
import { useSectionPresenter } from '~/composables/useSectionPresenter'

const route = useRoute()
const presenter = useSectionPresenter()
const { getPortfolio } = usePortfolioContent()
const { identity } = getPortfolio()

const handleLogoClick = (e: MouseEvent) => {
  if (route.path === '/') {
    e.preventDefault()
    presenter.goToById('hero')
  }
}
</script>
