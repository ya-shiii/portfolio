<template>
  <main class="min-h-screen w-full bg-background relative overflow-hidden text-white">
    
    <!-- Dynamic interactive network canvas -->
    <GlobalNetwork :mode="menuOpen ? 'menu' : 'normal'" :active-section-id="presenter.activeSectionId.value" />

    <!-- Top Left Identity Logo -->
    <SystemIdentity />

    <!-- Navigation Menu toggler -->
    <BurgerTrigger :is-open="menuOpen" @toggle="menuOpen = !menuOpen" />

    <!-- Navigation System Map Overlay -->
    <SystemMap :is-open="menuOpen" @close="menuOpen = false" @navigate="scrollToSection" />

    <!-- Indicators -->
    <SectionIndicator :active-section-id="presenter.activeSectionId.value" />
    <ScrollProgress :active-section-id="presenter.activeSectionId.value" @navigate="scrollToSection" />

    <!-- Main Content Container containing the isolated slides -->
    <div class="relative z-10 w-full h-screen overflow-hidden">
      
      <SectionSlide 
        :state="presenter.getState(0)" 
        :direction="presenter.direction.value"
        variant="hero"
        :key="`hero-${animationKeys[0]}`"
      >
        <HeroSection id="hero" :is-active="presenter.activeIndex.value === 0" @navigate="scrollToSection" />
      </SectionSlide>

      <SectionSlide 
        :state="presenter.getState(1)" 
        :direction="presenter.direction.value"
        variant="cards"
        :key="`selected-systems-${animationKeys[1]}`"
      >
        <SelectedSystems id="selected-systems" :is-active="presenter.activeIndex.value === 1" />
      </SectionSlide>

      <SectionSlide 
        :state="presenter.getState(2)" 
        :direction="presenter.direction.value"
        variant="split"
        :key="`what-i-build-${animationKeys[2]}`"
      >
        <WhatIBuild id="what-i-build" :is-active="presenter.activeIndex.value === 2" />
      </SectionSlide>

      <SectionSlide 
        :state="presenter.getState(3)" 
        :direction="presenter.direction.value"
        variant="portrait"
        :key="`about-${animationKeys[3]}`"
      >
        <AboutSection id="about" :is-active="presenter.activeIndex.value === 3" />
      </SectionSlide>

      <SectionSlide 
        :state="presenter.getState(4)" 
        :direction="presenter.direction.value"
        variant="timeline"
        :key="`experience-${animationKeys[4]}`"
      >
        <ExperienceTimeline id="experience" :is-active="presenter.activeIndex.value === 4" />
      </SectionSlide>

      <SectionSlide 
        :state="presenter.getState(5)" 
        :direction="presenter.direction.value"
        variant="scatter"
        :key="`beyond-code-${animationKeys[5]}`"
      >
        <BeyondCode id="beyond-code" :is-active="presenter.activeIndex.value === 5" />
      </SectionSlide>

      <SectionSlide 
        :state="presenter.getState(6)" 
        :direction="presenter.direction.value"
        variant="stack"
        :key="`system-stack-${animationKeys[6]}`"
      >
        <SystemStack id="system-stack" :is-active="presenter.activeIndex.value === 6" />
      </SectionSlide>

      <SectionSlide 
        :state="presenter.getState(7)" 
        :direction="presenter.direction.value"
        variant="contact"
        :key="`contact-${animationKeys[7]}`"
      >
        <ContactSection id="contact" :is-active="presenter.activeIndex.value === 7" />
      </SectionSlide>

    </div>

  </main>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import GlobalNetwork from '~/components/global/GlobalNetwork.vue'
import SystemIdentity from '~/components/global/SystemIdentity.vue'
import BurgerTrigger from '~/components/global/BurgerTrigger.vue'
import SectionIndicator from '~/components/global/SectionIndicator.vue'
import ScrollProgress from '~/components/global/ScrollProgress.vue'
import SystemMap from '~/components/navigation/SystemMap.vue'
import SectionSlide from '~/components/global/SectionSlide.vue'

import HeroSection from '~/components/sections/HeroSection.vue'
import SelectedSystems from '~/components/sections/SelectedSystems.vue'
import WhatIBuild from '~/components/sections/WhatIBuild.vue'
import AboutSection from '~/components/sections/AboutSection.vue'
import ExperienceTimeline from '~/components/sections/ExperienceTimeline.vue'
import BeyondCode from '~/components/sections/BeyondCode.vue'
import SystemStack from '~/components/sections/SystemStack.vue'
import ContactSection from '~/components/sections/ContactSection.vue'

import { useSectionPresenter } from '~/composables/useSectionPresenter'

const route = useRoute()
const menuOpen = ref(false)
const presenter = useSectionPresenter()

// Storing simple incrementing keys for each section slide to force CSS keyframe triggers upon activation
const animationKeys = ref(Array(8).fill(0))

watch(() => presenter.activeIndex.value, (newIdx) => {
  animationKeys.value[newIdx]++
})

// Listen for hash changes (like clicking the logo when already on the page)
// Notice there is NO immediate: true here, so it won't race with onMounted!
watch(() => route.hash, (newHash) => {
  if (newHash) {
    const hashId = newHash.replace('#', '')
    presenter.goToById(hashId)
  }
})

// On mount, read the URL hash once and jump to the matching section.
// nextTick ensures the presenter is fully set up before we navigate.
onMounted(() => {
  nextTick(() => {
    if (window.location.hash) {
      const hashId = window.location.hash.replace('#', '')
      presenter.goToById(hashId)
    }
  })
})

const scrollToSection = (id: string) => {
  presenter.goToById(id)
}
</script>
