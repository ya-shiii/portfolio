import { ref, onMounted, onUnmounted } from 'vue'
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

  // Cached container reference — avoids getElementById + closest on every wheel tick.
  // Scroll properties (scrollTop/scrollHeight/clientHeight) are read live from this
  // reference in the wheel handler, which is fast (no layout reflow) because the
  // browser already has these values computed during scrolling.
  let activeContainer: Element | null = null

  const bindContainer = (idx: number) => {
    const id = SECTION_IDS[idx]
    if (!id) return

    // All SectionSlides are always in the DOM (position: fixed, translated off-screen)
    // so getElementById always succeeds immediately — no need to wait for transitions.
    const el = document.getElementById(id)
    if (!el) return

    const container = el.closest('.section-slide')
    if (!container) return

    activeContainer = container
    // Reset scroll so every section always starts from the top
    activeContainer.scrollTop = 0
  }

  // ── Scroll boundary check ─────────────────────────────────────────────────
  // Reads live from the cached container (no traversal, just property reads).
  // Returns {canScrollUp, canScrollDown} or false-false if no container.
  const getScrollBoundary = () => {
    if (!activeContainer) return { canScrollUp: false, canScrollDown: false }
    const scrollTop = activeContainer.scrollTop
    const scrollHeight = activeContainer.scrollHeight
    const clientHeight = activeContainer.clientHeight
    return {
      canScrollUp: scrollTop > 1,
      canScrollDown: scrollTop + clientHeight < scrollHeight - 1,
    }
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goTo = (targetIndex: number) => {
    if (isTransitioning.value) return
    if (targetIndex === activeIndex.value) return
    if (targetIndex < 0 || targetIndex >= SECTION_IDS.length) return

    direction.value = targetIndex > activeIndex.value ? 'down' : 'up'
    isTransitioning.value = true
    activeIndex.value = targetIndex

    // Bind immediately — all slides are always in the DOM so this is safe.
    // Doing it here ensures activeContainer is current before isTransitioning clears.
    bindContainer(targetIndex)

    setTimeout(() => {
      isTransitioning.value = false
    }, TRANSITION_DURATION)
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

  // ── Input Handlers ─────────────────────────────────────────────────────────

  const onWheel = (e: WheelEvent) => {
    if (isTransitioning.value) {
      e.preventDefault()
      return
    }

    // Read live from cached container — fast, no DOM traversal
    const { canScrollUp, canScrollDown } = getScrollBoundary()

    if (e.deltaY > 0) {
      if (canScrollDown) return          // native scroll handles it
      if (!debounceTimer) {
        e.preventDefault()
        next()
        debounceTimer = setTimeout(() => { debounceTimer = null }, DEBOUNCE_DURATION)
      }
    } else if (e.deltaY < 0) {
      if (canScrollUp) return            // native scroll handles it
      if (!debounceTimer) {
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
    if (isTransitioning.value) return

    const { canScrollUp, canScrollDown } = getScrollBoundary()

    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
      if (canScrollDown) return
      e.preventDefault()
      next()
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      if (canScrollUp) return
      e.preventDefault()
      prev()
    }
  }

  const onTouchStart = (e: TouchEvent) => {
    touchStartY = e.touches[0]?.clientY ?? 0
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (isTransitioning.value) return
    const delta = touchStartY - (e.changedTouches[0]?.clientY ?? 0)
    if (Math.abs(delta) < 40) return

    const { canScrollUp, canScrollDown } = getScrollBoundary()
    if (delta > 0) {
      if (canScrollDown) return
      next()
    } else {
      if (canScrollUp) return
      prev()
    }
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  onMounted(() => {
    // Small delay so DOM layout is settled before we start intercepting wheels.
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
