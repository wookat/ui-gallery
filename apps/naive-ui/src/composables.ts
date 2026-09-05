import { onBeforeUnmount, ref } from "vue"

export function useIsMobile(breakpoint = 768) {
  const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
  const isMobile = ref(query.matches)
  const handler = (event: MediaQueryListEvent) => { isMobile.value = event.matches }
  query.addEventListener("change", handler)
  onBeforeUnmount(() => query.removeEventListener("change", handler))
  return isMobile
}

export function statusType(value: string): "success" | "warning" | "error" | "info" | "default" {
  if (["paid", "shipped", "active", "done"].includes(value)) return "success"
  if (["pending", "due"].includes(value)) return "warning"
  if (["failed", "refunded"].includes(value)) return "error"
  return "default"
}

export function formatMoney(value: number) {
  return `¥${value.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
