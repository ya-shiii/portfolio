import { ref, onMounted, onUnmounted } from 'vue'

export const useReducedMotion = () => {
  const prefersReduced = ref(false)

  let mediaQuery: MediaQueryList | null = null

  const onChange = (event: MediaQueryListEvent) => {
    prefersReduced.value = event.matches
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      prefersReduced.value = mediaQuery.matches
      mediaQuery.addEventListener('change', onChange)
    }
  })

  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', onChange)
    }
  })

  return {
    prefersReduced
  }
}
