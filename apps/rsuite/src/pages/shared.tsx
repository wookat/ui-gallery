import type { ReactNode } from "react"
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
