import type { ReactNode } from "react"
import { Badge, Card, Tag, Typography } from "@arco-design/web-react"

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="page-header between">
      <div>
        <Typography.Text type="secondary" className="eyebrow">ACME CONSOLE</Typography.Text>
        <Typography.Title heading={1}>{title}</Typography.Title>
        {description ? <Typography.Paragraph type="secondary">{description}</Typography.Paragraph> : null}
      </div>
      {action}
    </div>
  )
}

export function SectionCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <Card title={title} extra={description ? <Typography.Text type="secondary">{description}</Typography.Text> : null}>{children}</Card>
}

export function StatusBadge({ value }: { value: string }) {
  const status: "success" | "warning" | "error" = ["paid", "shipped", "active"].includes(value) ? "success" : ["pending", "due"].includes(value) ? "warning" : "error"
  return <Tag icon={<Badge status={status} />}>{value}</Tag>
}
