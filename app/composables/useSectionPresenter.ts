import { ref, onMounted, onUnmounted } from 'vue'

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
  const activeIndex = ref(0)
  const direction = ref<SlideDirection>('down')
  const isTransitioning = ref(false)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let touchStartY = 0

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

  // Helper to check if current slide has scrollable overflow and is at boundaries
  const getActiveSlideScrollInfo = () => {
    const id = SECTION_IDS[activeIndex.value]
    if (!id) return { canScrollUp: false, canScrollDown: false }
    const el = document.getElementById(id)
    if (!el) return { canScrollUp: false, canScrollDown: false }

    // Find the scroll container (which is SectionSlide)
    const container = el.closest('.section-slide')
    if (!container) return { canScrollUp: false, canScrollDown: false }

    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight

    // Allow small 1px margin for sub-pixel calculations
    const canScrollUp = scrollTop > 1
    const canScrollDown = scrollTop + clientHeight < scrollHeight - 1

    return { canScrollUp, canScrollDown }
  }

  // ── Input Handlers ────────────────────────────────────────────────────────

  const onWheel = (e: WheelEvent) => {
    if (isTransitioning.value) {
      e.preventDefault()
      return
    }

    const { canScrollUp, canScrollDown } = getActiveSlideScrollInfo()

    if (e.deltaY > 0) {
      if (canScrollDown) {
        // Let native scrolling handle it
        return
      }
      e.preventDefault()
      if (debounceTimer) return
      next()
    } else if (e.deltaY < 0) {
      if (canScrollUp) {
        // Let native scrolling handle it
        return
      }
      e.preventDefault()
      if (debounceTimer) return
      prev()
    }

    debounceTimer = setTimeout(() => {
      debounceTimer = null
    }, DEBOUNCE_DURATION)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (isTransitioning.value) return

    const { canScrollUp, canScrollDown } = getActiveSlideScrollInfo()

    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
      if (canScrollDown) return // Let native key scrolling happen
      e.preventDefault()
      next()
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      if (canScrollUp) return // Let native key scrolling happen
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
    if (Math.abs(delta) < 40) return // ignore tiny swipes

    const { canScrollUp, canScrollDown } = getActiveSlideScrollInfo()

    if (delta > 0) {
      if (canScrollDown) return // Let native swipe scrolling happen
      next()
    } else {
      if (canScrollUp) return // Let native swipe scrolling happen
      prev()
    }
  }

  onMounted(() => {
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    // If loaded or redirected with a hash anchor link (e.g. #beyond-code), sync section index immediately
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace('#', '')
      const matchIdx = SECTION_IDS.indexOf(hashId)
      if (matchIdx !== -1) {
        activeIndex.value = matchIdx
      }
    }
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
