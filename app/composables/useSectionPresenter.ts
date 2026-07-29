import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
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
const DEBOUNCE_DURATION = 900   // ms — slightly longer so transition finishes before next can fire

export const useSectionPresenter = () => {
  const route = useRoute()
  const hashId = route?.hash ? route.hash.replace('#', '') : ''
  const initialIndex = SECTION_IDS.indexOf(hashId)

  const activeIndex = ref(initialIndex !== -1 ? initialIndex : 0)
  const direction = ref<SlideDirection>('down')
  const isTransitioning = ref(false)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let touchStartY = 0

  // ── Cached scroll state (updated reactively, not on every wheel tick) ──────
  // Reading scrollTop/scrollHeight/clientHeight on every wheel event causes
  // layout thrashing. Instead we cache the container and boundary booleans,
  // refreshing them only when the section changes or the container scrolls.
  let activeContainer: Element | null = null
  let cachedCanScrollUp = false
  let cachedCanScrollDown = false

  const refreshScrollCache = () => {
    if (!activeContainer) {
      cachedCanScrollUp = false
      cachedCanScrollDown = false
      return
    }
    const scrollTop = activeContainer.scrollTop
    const scrollHeight = activeContainer.scrollHeight
    const clientHeight = activeContainer.clientHeight
    cachedCanScrollUp = scrollTop > 1
    cachedCanScrollDown = scrollTop + clientHeight < scrollHeight - 1
  }

  const onContainerScroll = () => refreshScrollCache()

  const bindContainer = (idx: number) => {
    // Remove listener from the old container
    if (activeContainer) {
      activeContainer.removeEventListener('scroll', onContainerScroll)
      activeContainer = null
    }

    const id = SECTION_IDS[idx]
    if (!id) return

    const el = document.getElementById(id)
    if (!el) return

    const container = el.closest('.section-slide')
    if (!container) return

    activeContainer = container
    // Reset scroll position so the section always starts from the top
    activeContainer.scrollTop = 0
    activeContainer.addEventListener('scroll', onContainerScroll, { passive: true })
    refreshScrollCache()
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goTo = (targetIndex: number) => {
    if (isTransitioning.value) return
    if (targetIndex === activeIndex.value) return
    if (targetIndex < 0 || targetIndex >= SECTION_IDS.length) return

    direction.value = targetIndex > activeIndex.value ? 'down' : 'up'
    isTransitioning.value = true
    activeIndex.value = targetIndex

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

    if (e.deltaY > 0) {
      // Container still has content below — let the browser scroll natively
      if (cachedCanScrollDown) return
      // At the bottom boundary: navigate to next section (once per debounce)
      if (!debounceTimer) {
        e.preventDefault()
        next()
        debounceTimer = setTimeout(() => { debounceTimer = null }, DEBOUNCE_DURATION)
      }
    } else if (e.deltaY < 0) {
      // Container still has content above — let the browser scroll natively
      if (cachedCanScrollUp) return
      // At the top boundary: navigate to previous section (once per debounce)
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

    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
      if (cachedCanScrollDown) return
      e.preventDefault()
      next()
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      if (cachedCanScrollUp) return
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

    if (delta > 0) {
      if (cachedCanScrollDown) return
      next()
    } else {
      if (cachedCanScrollUp) return
      prev()
    }
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  onMounted(() => {
    // Delay wheel listener slightly so DOM layout is fully settled on first load.
    // Without this, scrollHeight === clientHeight initially (layout not painted yet)
    // causing the boundary check to wrongly fire section navigation.
    setTimeout(() => {
      // Bind to the initial active section's container
      bindContainer(activeIndex.value)
      window.addEventListener('wheel', onWheel, { passive: false })
    }, 300)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
  })

  // Re-bind the scroll container whenever the active section changes,
  // and wait for the next tick so the new section's DOM is rendered.
  watch(activeIndex, (newIdx) => {
    nextTick(() => {
      // Give the slide transition a moment to render before binding
      setTimeout(() => bindContainer(newIdx), TRANSITION_DURATION)
    })
  })

  onUnmounted(() => {
    if (activeContainer) {
      activeContainer.removeEventListener('scroll', onContainerScroll)
    }
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
