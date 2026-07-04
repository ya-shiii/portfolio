<template>
  <div
    class="section-slide"
    :class="[
      `slide-${state}`,
      `variant-${variant}`,
      `dir-${direction}`
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { SlideState, SlideDirection } from '~/composables/useSectionPresenter'

defineProps<{
  state: SlideState
  direction: SlideDirection
  /**
   * Animation variant per section:
   * hero           — scale-zoom exit + staggered headline fade-in
   * cards          — cards cascade up from bottom
   * split          — left panel slides in, right panel slides from right
   * portrait       — content slides in from left, decorative from right
   * timeline       — items stagger in from left with fade
   * scatter        — cards scatter in from different directions
   * stack          — columns drop in with stagger
   * contact        — headline bursts in from center scale, links fade stagger
   */
  variant: 'hero' | 'cards' | 'split' | 'portrait' | 'timeline' | 'scatter' | 'stack' | 'contact'
}>()
</script>

<style scoped>
/* ── Base layout: all sections stacked fullscreen ── */
.section-slide {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  will-change: transform, opacity;
  transition: transform 700ms cubic-bezier(0.76, 0, 0.24, 1),
              opacity  700ms cubic-bezier(0.76, 0, 0.24, 1);
  pointer-events: none;
  z-index: 5;
}

/* ── Active: fully visible ── */
.slide-active {
  transform: translateY(0) scale(1);
  opacity: 1;
  pointer-events: all;
  z-index: 10;
}

/* ── Before: already passed — exits upward ── */
.slide-before {
  transform: translateY(-100vh);
  opacity: 0;
  z-index: 5;
}

/* ── After: not yet reached — waiting below ── */
.slide-after {
  transform: translateY(100vh);
  opacity: 0;
  z-index: 5;
}

/* ════════════════════════════════════════════════════════════
   VARIANT: hero  — scales out on exit, massive presence on enter
   ════════════════════════════════════════════════════════════ */
.variant-hero.slide-active {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.variant-hero.slide-before {
  transform: translateY(-60px) scale(0.94);
  opacity: 0;
}
.variant-hero.slide-after {
  transform: translateY(60px) scale(0.96);
  opacity: 0;
}

/* ════════════════════════════════════════════════════════════
   VARIANT: cards  — rise up with slight perspective
   ════════════════════════════════════════════════════════════ */
.variant-cards.slide-active {
  transform: translateY(0) translateZ(0);
  opacity: 1;
}
.variant-cards.slide-before {
  transform: translateY(-80px) translateZ(-20px);
  opacity: 0;
}
.variant-cards.slide-after {
  transform: translateY(80px) translateZ(-20px);
  opacity: 0;
}

/* ════════════════════════════════════════════════════════════
   VARIANT: split  — gentle vertical + slight lateral shift
   ════════════════════════════════════════════════════════════ */
.variant-split.slide-active {
  transform: translateY(0) translateX(0);
  opacity: 1;
}
.variant-split.slide-before.dir-down,
.variant-split.slide-before.dir-up {
  transform: translateY(-70px) translateX(-12px);
  opacity: 0;
}
.variant-split.slide-after {
  transform: translateY(70px) translateX(12px);
  opacity: 0;
}

/* ════════════════════════════════════════════════════════════
   VARIANT: portrait  — left bias entry
   ════════════════════════════════════════════════════════════ */
.variant-portrait.slide-active {
  transform: translateY(0) translateX(0);
  opacity: 1;
}
.variant-portrait.slide-before {
  transform: translateY(-70px) translateX(-16px);
  opacity: 0;
}
.variant-portrait.slide-after {
  transform: translateY(70px) translateX(16px);
  opacity: 0;
}

/* ════════════════════════════════════════════════════════════
   VARIANT: timeline  — clean vertical with slight skew feel
   ════════════════════════════════════════════════════════════ */
.variant-timeline.slide-active {
  transform: translateY(0);
  opacity: 1;
}
.variant-timeline.slide-before {
  transform: translateY(-90px);
  opacity: 0;
}
.variant-timeline.slide-after {
  transform: translateY(90px);
  opacity: 0;
}

/* ════════════════════════════════════════════════════════════
   VARIANT: scatter  — rotated exit, bold entry
   ════════════════════════════════════════════════════════════ */
.variant-scatter.slide-active {
  transform: translateY(0) rotate(0deg);
  opacity: 1;
}
.variant-scatter.slide-before {
  transform: translateY(-60px) rotate(-0.4deg);
  opacity: 0;
}
.variant-scatter.slide-after {
  transform: translateY(60px) rotate(0.4deg);
  opacity: 0;
}

/* ════════════════════════════════════════════════════════════
   VARIANT: stack  — drops in from above with spring feel
   ════════════════════════════════════════════════════════════ */
.variant-stack.slide-active {
  transform: translateY(0);
  opacity: 1;
  transition: transform 750ms cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity  600ms ease-out;
}
.variant-stack.slide-before {
  transform: translateY(-100px);
  opacity: 0;
}
.variant-stack.slide-after {
  transform: translateY(100px);
  opacity: 0;
}

/* ════════════════════════════════════════════════════════════
   VARIANT: contact  — center convergence zoom
   ════════════════════════════════════════════════════════════ */
.variant-contact.slide-active {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.variant-contact.slide-before {
  transform: translateY(-50px) scale(0.97);
  opacity: 0;
}
.variant-contact.slide-after {
  transform: translateY(50px) scale(0.97);
  opacity: 0;
}
</style>
