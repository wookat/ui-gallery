import { useEffect, useRef, useState, type ReactNode } from "react"
import { useSearchParams } from "react-router-dom"
import { Panel, SegmentedControl, Tag, Text } from "rsuite"

export function PageHeader({ title, description, action, actions }: { title: string; description?: string; action?: ReactNode; actions?: ReactNode }) {
  return <div className="page-header"><div><Text muted size="sm">ACME CONSOLE</Text><h1 style={{ margin: "4px 0", fontSize: 28 }}>{title}</h1>{description ? <Text muted>{description}</Text> : null}</div>{action || actions ? <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{action}{actions}</div> : null}</div>
}

export function StateSwitch() {
  const [params, setParams] = useSearchParams()
  const value = params.get("state") ?? "default"
  return <SegmentedControl size="sm" data={[{ label: "默认", value: "default" }, { label: "加载中", value: "loading" }, { label: "空数据", value: "empty" }, { label: "错误", value: "error" }]} value={value} onChange={(next) => { const updated = new URLSearchParams(params); if (next === "default") updated.delete("state"); else updated.set("state", String(next)); setParams(updated) }} />
}

export function SectionCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <Panel bordered header={<><strong>{title}</strong>{description ? <div><Text muted size="sm">{description}</Text></div> : null}</>} >{children}</Panel>
}

export function StatusBadge({ value }: { value: string }) {
  const color = ["paid", "shipped", "active"].includes(value) ? "green" : ["pending", "due"].includes(value) ? "orange" : "red"
  return <Tag color={color} size="sm">{value}</Tag>
}

export const orderFieldLabels: Record<string, string> = { id: "订单编号", customer: "客户", email: "邮箱", product: "产品", amount: "金额", currency: "货币", status: "状态", date: "日期", channel: "渠道" }

export function ScrollHint({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scrollable, setScrollable] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const update = () => {
      const row = node.querySelector<HTMLElement>(".rs-table-row")
      const hasScrollbar = Boolean(node.querySelector(".rs-table-scrollbar-horizontal"))
      setScrollable(hasScrollbar || Math.max(node.scrollWidth, row?.offsetWidth ?? 0) > node.clientWidth + 1)
    }
    update()
    const frame = window.requestAnimationFrame(update)
    const observer = new ResizeObserver(update)
    observer.observe(node)
    const mutations = new MutationObserver(update)
    mutations.observe(node, { childList: true, subtree: true })
    return () => { window.cancelAnimationFrame(frame); observer.disconnect(); mutations.disconnect() }
  }, [])
  return <div ref={ref} className="table-scroll" data-scrollable={scrollable}>{children}</div>
}
