<template>
  <main class="min-h-screen w-full bg-background relative overflow-x-hidden text-white">
    
    <!-- Dynamic interactive network canvas -->
    <GlobalNetwork :mode="menuOpen ? 'menu' : 'normal'" />

    <!-- Top Left Identity Logo -->
    <SystemIdentity />

    <!-- Navigation Menu toggler -->
    <BurgerTrigger :is-open="menuOpen" @toggle="menuOpen = !menuOpen" />

    <!-- Navigation System Map Overlay -->
    <SystemMap :is-open="menuOpen" @close="menuOpen = false" @navigate="scrollToSection" />

    <!-- Indicators -->
    <SectionIndicator :active-section-id="activeSection" />
    <ScrollProgress :active-section-id="activeSection" @navigate="scrollToSection" />

    <!-- Main Content Container with section references -->
    <div class="relative z-10 w-full flex flex-col">
      <HeroSection id="hero" @navigate="scrollToSection" />
      <SelectedSystems id="selected-systems" />
      <WhatIBuild id="what-i-build" />
      <AboutSection id="about" />
      <ExperienceTimeline id="experience" />
      <BeyondCode id="beyond-code" />
      <SystemStack id="system-stack" />
      <ContactSection id="contact" />
    </div>

  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import GlobalNetwork from '~/components/global/GlobalNetwork.vue'
import SystemIdentity from '~/components/global/SystemIdentity.vue'
import BurgerTrigger from '~/components/global/BurgerTrigger.vue'
import SectionIndicator from '~/components/global/SectionIndicator.vue'
import ScrollProgress from '~/components/global/ScrollProgress.vue'
import SystemMap from '~/components/navigation/SystemMap.vue'

import HeroSection from '~/components/sections/HeroSection.vue'
import SelectedSystems from '~/components/sections/SelectedSystems.vue'
import WhatIBuild from '~/components/sections/WhatIBuild.vue'
import AboutSection from '~/components/sections/AboutSection.vue'
import ExperienceTimeline from '~/components/sections/ExperienceTimeline.vue'
import BeyondCode from '~/components/sections/BeyondCode.vue'
import SystemStack from '~/components/sections/SystemStack.vue'
import ContactSection from '~/components/sections/ContactSection.vue'

const menuOpen = ref(false)
const activeSection = ref('hero')

const sectionIds = [
  'hero',
  'selected-systems',
  'what-i-build',
  'about',
  'experience',
  'beyond-code',
  'system-stack',
  'contact'
]

// Smooth Scroll directly to targets
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeSection.value = id
  }
}

// Intersection Observer configuration to track scroll states
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof window !== 'undefined') {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    }, {
      rootMargin: '-50% 0px -50% 0px' // Trigger active state when section covers middle of viewport
    })

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el && observer) observer.observe(el)
    })
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>
