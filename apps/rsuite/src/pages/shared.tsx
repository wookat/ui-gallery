import type { ReactNode } from "react"
import { Badge, Panel, Text } from "rsuite"

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="page-header"><div><Text muted size="sm">ACME CONSOLE</Text><h1 style={{ margin: "4px 0", fontSize: 28 }}>{title}</h1>{description ? <Text muted>{description}</Text> : null}</div>{action}</div>
}

export function SectionCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <Panel bordered header={<><strong>{title}</strong>{description ? <div><Text muted size="sm">{description}</Text></div> : null}</>} >{children}</Panel>
}

export function StatusBadge({ value }: { value: string }) {
  const color = ["paid", "shipped", "active"].includes(value) ? "green" : ["pending", "due"].includes(value) ? "orange" : "red"
  return <Badge color={color}>{value}</Badge>
}
