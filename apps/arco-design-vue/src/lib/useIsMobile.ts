import { onMounted, onUnmounted, ref } from "vue"

export function useIsMobile() {
  const isMobile = ref(false)
  let mediaQuery: MediaQueryList | undefined

  const update = () => {
    isMobile.value = mediaQuery?.matches ?? false
  }

  onMounted(() => {
    mediaQuery = window.matchMedia("(max-width: 767px)")
    update()
    mediaQuery.addEventListener("change", update)
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener("change", update)
  })

  return isMobile
}
