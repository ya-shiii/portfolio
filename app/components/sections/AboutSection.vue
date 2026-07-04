<template>
  <section class="min-h-screen w-full flex flex-col justify-center px-6 md:px-24 py-24 relative z-10">
    <div class="max-w-4xl w-full mx-auto">
      <div class="flex items-center gap-4 mb-12">
        <span class="font-mono text-xs tracking-widest text-primary">03 / ABOUT</span>
        <div class="h-[1px] flex-grow bg-white/10"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <!-- Text details -->
        <div class="col-span-12 md:col-span-8 flex flex-col gap-6">
          <h2 class="font-sans text-2xl md:text-3xl font-bold tracking-tight text-white uppercase leading-snug">
            BRIDGING INTERFACES AND BACKEND SYSTEMS.
          </h2>

          <div class="font-sans text-sm text-muted leading-relaxed flex flex-col gap-4 whitespace-pre-line">
            {{ about }}
          </div>
        </div>

        <!-- Visual Geometry Accent (spinning system ring structure) -->
        <div class="col-span-12 md:col-span-4 flex justify-center relative py-6 md:py-0">
          <div class="relative w-48 h-48 rounded-full border border-primary/20 flex items-center justify-center animate-spin [animation-duration:20s] select-none pointer-events-none">
            <div class="absolute w-36 h-36 rounded-full border border-dashed border-secondary/30"></div>
            <div class="absolute w-24 h-24 rounded-full border border-primary/40 flex items-center justify-center bg-background/50">
              <span class="font-mono text-xs text-primary font-bold animate-pulse">SYSTEM ACTIVE</span>
            </div>
            
            <!-- Floating nodes representing system interfaces -->
            <div class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_#A020F0]"></div>
            <div class="absolute bottom-[20px] left-[20px] w-2 h-2 rounded-full bg-secondary"></div>
            <div class="absolute bottom-[20px] right-[20px] w-2.5 h-2.5 rounded-full bg-white/70"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePortfolioContent } from '~/composables/usePortfolioContent'

const { getPortfolio } = usePortfolioContent()
const { about } = getPortfolio()
</script>
