import type { ReactNode } from "react"
import { Card, Tag, Typography } from "@douyinfe/semi-ui"

const { Title, Text } = Typography

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="acme-between" style={{ alignItems: "flex-end" }}>
      <div>
        <Text size="small" type="tertiary" style={{ letterSpacing: "0.2em" }}>ACME CONSOLE</Text>
        <Title heading={2} style={{ margin: "4px 0" }}>{title}</Title>
        {description ? <Text type="secondary">{description}</Text> : null}
      </div>
      {action}
    </div>
  )
}

export function SectionCard({ title, description, children, extra, style }: { title: string; description?: string; children: ReactNode; extra?: ReactNode; style?: React.CSSProperties }) {
  return (
    <Card title={title} headerExtraContent={extra} style={{ minWidth: 0, ...style }} bodyStyle={{ minWidth: 0 }}>
      {description ? <Text type="tertiary" size="small" style={{ display: "block", marginBottom: 12 }}>{description}</Text> : null}
      {children}
    </Card>
  )
}

export const statusColor: Record<string, "green" | "orange" | "red" | "blue" | "grey"> = { paid: "green", shipped: "blue", active: "green", pending: "orange", due: "orange", refunded: "grey", failed: "red", cancelled: "grey" }

export function StatusTag({ value }: { value: string }) {
  return <Tag color={statusColor[value] ?? "grey"} type="light">{value}</Tag>
}

export const money = (value: number) => `¥${value.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
