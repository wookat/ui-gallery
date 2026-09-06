import { onBeforeUnmount, ref } from "vue"

export function useIsMobile(maxWidth = 767) {
  const query = window.matchMedia(`(max-width: ${maxWidth}px)`)
  const isMobile = ref(query.matches)
  const update = (e: MediaQueryListEvent) => (isMobile.value = e.matches)
  query.addEventListener("change", update)
  onBeforeUnmount(() => query.removeEventListener("change", update))
  return isMobile
}

export const statusTheme: Record<string, "success" | "warning" | "danger" | "default" | "primary"> = {
  paid: "success",
  pending: "warning",
  refunded: "danger",
  failed: "danger",
  shipped: "primary",
  cancelled: "default",
  due: "warning",
}
export const statusLabel: Record<string, string> = {
  paid: "已支付",
  pending: "待支付",
  refunded: "已退款",
  failed: "失败",
  shipped: "已发货",
  cancelled: "已取消",
  due: "待付款",
}
export const roleLabel: Record<string, string> = { owner: "所有者", admin: "管理员", member: "成员", viewer: "访客" }
export const money = (n: number, unit = "CNY") => new Intl.NumberFormat("zh-CN", { style: "currency", currency: unit, maximumFractionDigits: 2 }).format(n)
export const initials = (name: string) => (/^[A-Za-z]/.test(name) ? name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase() : name.slice(0, 1))
