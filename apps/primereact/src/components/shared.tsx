import type { ReactNode } from "react"
import { Badge } from "primereact/badge"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"
import { Tag } from "primereact/tag"
import { Icon } from "./icon"

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="flex flex-column sm:flex-row sm:align-items-end sm:justify-content-between gap-3"><div><p className="text-xs font-medium letter-spacing-1 muted m-0">ACME CONSOLE</p><h1 className="page-title">{title}</h1>{description ? <p className="page-subtitle">{description}</p> : null}</div>{action}</div>
}
export function SectionCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <Card title={title} subTitle={description}>{children}</Card>
}
export function StatusTag({ value }: { value: string }) {
  const severity = ["paid", "shipped", "active"].includes(value) ? "success" : ["pending", "due"].includes(value) ? "warning" : "danger"
  return <Tag value={value} severity={severity} />
}
export function EmptyState({ title = "暂无数据", description = "这里还没有内容。" }: { title?: string; description?: string }) {
  return <div className="text-center p-5"><Icon name="inbox" size={34} /><h3 className="mt-3 mb-2">{title}</h3><p className="muted mt-0">{description}</p></div>
}
export function SectionDivider({ label }: { label: string }) { return <Divider align="center"><span className="muted text-sm">{label}</span></Divider> }
export function Metric({ label, value, delta }: { label: string; value: string; delta: number }) { return <Card><div className="flex justify-content-between align-items-center"><span className="muted">{label}</span><Badge value={`${delta > 0 ? "+" : ""}${delta}%`} severity={delta > 0 ? "success" : "warning"} /></div><div className="text-2xl font-bold mt-2">{value}</div></Card> }
