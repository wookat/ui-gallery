import { h } from "vue"
import { Tag } from "ant-design-vue"
import { Icon } from "../icons"

export const statusColor: Record<string, string> = { paid: "success", pending: "warning", refunded: "default", failed: "error", shipped: "processing", due: "warning" }
export const statusLabel: Record<string, string> = { paid: "已支付", pending: "处理中", refunded: "已退款", failed: "失败", shipped: "已发货", due: "待支付" }
export function statusTag(value: string) {
  return h(Tag, { color: statusColor[value] ?? "default" }, () => statusLabel[value] ?? value)
}
export function initials(value: string) { return value.split(/\s+/).map((part) => part[0]).join("").slice(0, 2) || value.slice(0, 1) }
export function PageHeader(props: { title: string; description?: string }) {
  return h("div", { class: "page-header" }, [
    h("div", [h("h1", props.title), props.description ? h("p", { class: "muted" }, props.description) : null]),
  ])
}
export function Sparkline(props: { values: number[] }) {
  const max = Math.max(...props.values)
  const min = Math.min(...props.values)
  const points = props.values.map((value, index) => `${index * (100 / (props.values.length - 1))},${40 - ((value - min) / Math.max(max - min, 1)) * 34}`).join(" ")
  return h("svg", { class: "sparkline", viewBox: "0 0 100 42", preserveAspectRatio: "none" }, [h("polyline", { points, fill: "none", stroke: "currentColor", "stroke-width": "2" })])
}
export { Icon }
