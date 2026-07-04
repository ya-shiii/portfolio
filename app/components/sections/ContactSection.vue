<template>
  <section class="min-h-screen w-full flex flex-col justify-center px-6 md:px-24 py-24 relative z-10">
    <div class="max-w-4xl w-full mx-auto flex flex-col items-center justify-center text-center">
      
      <div class="flex items-center gap-4 w-full mb-16">
        <div class="h-[1px] flex-grow bg-white/10"></div>
        <span class="font-mono text-xs tracking-widest text-primary">07 / CONTACT</span>
        <div class="h-[1px] flex-grow bg-white/10"></div>
      </div>

      <div class="flex flex-col items-center gap-4 max-w-2xl">
        <h2 class="font-sans text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight uppercase">
          LET'S BUILD<br>SOMETHING USEFUL.
        </h2>

        <p class="font-sans text-xs md:text-sm text-muted mt-4 leading-relaxed">
          I'm currently open to Full Stack Developer and software development opportunities, including remote roles and teams building practical products.
        </p>

        <!-- Dynamic Interaction Connections (Contact pathways) -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-12 max-w-xl">
          <a 
            :href="`mailto:${socialLinks.email}`"
            class="bg-surface/20 hover:bg-surface/50 border border-white/5 hover:border-primary/40 rounded p-4 flex flex-col items-center gap-2 group transition-all"
          >
            <span class="font-mono text-[9px] text-white/40 group-hover:text-primary tracking-widest uppercase">EMAIL</span>
            <span class="font-mono text-[10px] text-white font-medium group-hover:text-white transition-colors">INBOX</span>
          </a>

          <a 
            :href="socialLinks.linkedin"
            target="_blank"
            class="bg-surface/20 hover:bg-surface/50 border border-white/5 hover:border-primary/40 rounded p-4 flex flex-col items-center gap-2 group transition-all"
          >
            <span class="font-mono text-[9px] text-white/40 group-hover:text-primary tracking-widest uppercase">LINKEDIN</span>
            <span class="font-mono text-[10px] text-white font-medium group-hover:text-white transition-colors">CONNECT</span>
          </a>

          <a 
            :href="socialLinks.github"
            target="_blank"
            class="bg-surface/20 hover:bg-surface/50 border border-white/5 hover:border-primary/40 rounded p-4 flex flex-col items-center gap-2 group transition-all"
          >
            <span class="font-mono text-[9px] text-white/40 group-hover:text-primary tracking-widest uppercase">GITHUB</span>
            <span class="font-mono text-[10px] text-white font-medium group-hover:text-white transition-colors">CODEBASE</span>
          </a>

          <!-- Static Resume Trigger Path -->
          <a 
            :href="socialLinks.resume"
            target="_blank"
            class="bg-surface/20 hover:bg-surface/50 border border-white/5 hover:border-primary/40 rounded p-4 flex flex-col items-center gap-2 group transition-all"
          >
            <span class="font-mono text-[9px] text-white/40 group-hover:text-primary tracking-widest uppercase">RESUME</span>
            <span class="font-mono text-[10px] text-white font-medium group-hover:text-white transition-colors">PDF FILE</span>
          </a>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { usePortfolioContent } from '~/composables/usePortfolioContent'

const { getPortfolio } = usePortfolioContent()
const { socialLinks } = getPortfolio()
</script>
