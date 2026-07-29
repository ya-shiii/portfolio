import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

export type SlideDirection = 'down' | 'up'
export type SlideState = 'active' | 'before' | 'after' | 'entering' | 'exiting'

const SECTION_IDS = [
  'hero',
  'selected-systems',
  'what-i-build',
  'about',
  'experience',
  'beyond-code',
  'system-stack',
  'contact'
]

const TRANSITION_DURATION = 700 // ms
const DEBOUNCE_DURATION = 900   // ms

export const useSectionPresenter = () => {
  const route = useRoute()
  const hashId = route?.hash ? route.hash.replace('#', '') : ''
  const initialIndex = SECTION_IDS.indexOf(hashId)

  const activeIndex = ref(initialIndex !== -1 ? initialIndex : 0)
  const direction = ref<SlideDirection>('down')
  const isTransitioning = ref(false)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let touchStartY = 0

  // Cached reference to the active section's scroll container.
  // Updated via nextTick after navigation so we get the newly-keyed DOM element.
  let activeContainer: Element | null = null

  const bindContainer = (idx: number) => {
    const id = SECTION_IDS[idx]
    if (!id) return
    const el = document.getElementById(id)
    if (!el) return
    const container = el.closest('.section-slide')
    if (!container) return
    activeContainer = container
    activeContainer.scrollTop = 0
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goTo = (targetIndex: number) => {
    if (isTransitioning.value) return
    if (targetIndex === activeIndex.value) return
    if (targetIndex < 0 || targetIndex >= SECTION_IDS.length) return

    direction.value = targetIndex > activeIndex.value ? 'down' : 'up'
    isTransitioning.value = true
    activeIndex.value = targetIndex

    // nextTick: wait for Vue to re-render the new :key'd SectionSlide element
    // before caching it. The old element gets destroyed by the animationKeys watch.
    nextTick(() => bindContainer(targetIndex))

    setTimeout(() => { isTransitioning.value = false }, TRANSITION_DURATION)
  }

  const goToById = (id: string) => {
    const idx = SECTION_IDS.indexOf(id)
    if (idx !== -1) goTo(idx)
  }

  const next = () => goTo(activeIndex.value + 1)
  const prev = () => goTo(activeIndex.value - 1)

  const getState = (index: number): SlideState => {
    if (index === activeIndex.value) return 'active'
    if (index < activeIndex.value) return 'before'
    return 'after'
  }

  // ── Wheel handler ──────────────────────────────────────────────────────────
  //
  // Simple rule:
  //   • If the section still has content in the scroll direction → do nothing
  //     (browser scrolls it natively, no intervention needed)
  //   • If the section is at the boundary → navigate to the next/prev section
  //   • Never block native scroll; only preventDefault when actually navigating

  const onWheel = (e: WheelEvent) => {
    // If container isn't cached yet (nextTick gap) or isn't in the DOM,
    // let the browser handle it natively — no intervention.
    if (!activeContainer || !activeContainer.isConnected) return

    const { scrollTop, scrollHeight, clientHeight } = activeContainer
    const atTop    = scrollTop <= 1
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1

    if (e.deltaY > 0) {
      // Still content below → native scroll, don't touch it
      if (!atBottom) return
      // At the bottom → navigate (once per debounce, skip if still transitioning)
      if (!isTransitioning.value && !debounceTimer) {
        e.preventDefault()
        next()
        debounceTimer = setTimeout(() => { debounceTimer = null }, DEBOUNCE_DURATION)
      }
    } else if (e.deltaY < 0) {
      // Still content above → native scroll
      if (!atTop) return
      // At the top → navigate
      if (!isTransitioning.value && !debounceTimer) {
        e.preventDefault()
        prev()
        debounceTimer = setTimeout(() => { debounceTimer = null }, DEBOUNCE_DURATION)
      }
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLElement) {
      const tag = e.target.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea') return
    }
    if (isTransitioning.value || !activeContainer) return

    const { scrollTop, scrollHeight, clientHeight } = activeContainer
    const atTop    = scrollTop <= 1
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1

    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
      if (!atBottom) return
      e.preventDefault()
      next()
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      if (!atTop) return
      e.preventDefault()
      prev()
    }
  }

  const onTouchStart = (e: TouchEvent) => {
    touchStartY = e.touches[0]?.clientY ?? 0
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (isTransitioning.value || !activeContainer) return
    const delta = touchStartY - (e.changedTouches[0]?.clientY ?? 0)
    if (Math.abs(delta) < 40) return

    const { scrollTop, scrollHeight, clientHeight } = activeContainer
    const atTop    = scrollTop <= 1
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1

    if (delta > 0 && atBottom) next()
    else if (delta < 0 && atTop) prev()
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  onMounted(() => {
    // Small delay so DOM layout is fully settled before first boundary check
    setTimeout(() => {
      bindContainer(activeIndex.value)
      window.addEventListener('wheel', onWheel, { passive: false })
    }, 300)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchend', onTouchEnd)
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  return {
    activeIndex,
    direction,
    isTransitioning,
    sectionIds: SECTION_IDS,
    activeSectionId: { get value() { return SECTION_IDS[activeIndex.value] ?? '' } },
    goTo,
    goToById,
    next,
    prev,
    getState,
  }
}
