import { onBeforeUnmount, onMounted, ref } from "vue"

export function useMobile() {
  const mobile = ref(false)
  let media: MediaQueryList | undefined
  const update = () => { mobile.value = Boolean(media?.matches) }
  onMounted(() => {
    media = window.matchMedia("(max-width: 767px)")
    update()
    media.addEventListener("change", update)
  })
  onBeforeUnmount(() => media?.removeEventListener("change", update))
  return mobile
}
