import { useState, type ReactNode } from "react"
import orders from "@ui-gallery/spec/mock/orders.json"
import nav from "@ui-gallery/spec/mock/nav.json"
import { Badge, Button, Card, Space, Tag, Typography } from "@arco-design/web-react"

export type DemoProps = { name: string }
export const sizes = ["mini", "small", "default", "large"] as const
export const orderRows = orders.slice(0, 8)
export const navItems = nav
export const demoImage = `${import.meta.env.BASE_URL}image-placeholder.svg`

export function DemoSection({ title, children }: { title?: string; children: ReactNode }) {
  return <Space direction="vertical" style={{ width: "100%" }}>{title && <Typography.Text type="secondary">{title}</Typography.Text>}{children}</Space>
}

export function SizeRow({ children }: { children: (size: typeof sizes[number]) => ReactNode }) {
  return <Space wrap>{sizes.map((size) => <div key={size}><Typography.Text type="secondary">{size}</Typography.Text>{children(size)}</div>)}</Space>
}

export function ToggleDemo({ children }: { children: (visible: boolean, setVisible: (visible: boolean) => void) => ReactNode }) {
  const [visible, setVisible] = useState(false)
  return <>{children(visible, setVisible)}</>
}

export function DemoCard({ title, children }: { title: string; children: ReactNode }) {
  return <Card size="small" title={title}>{children}</Card>
}

export function ActionButtons({ labels = ["操作一", "操作二"] }: { labels?: string[] }) {
  return <Space wrap>{labels.map((label) => <Button key={label} type="text">{label}</Button>)}</Space>
}

export function StatusTag({ value }: { value: string }) {
  const status: "success" | "warning" | "error" = ["paid", "shipped", "active"].includes(value) ? "success" : ["pending", "due"].includes(value) ? "warning" : "error"
  return <Tag icon={<Badge status={status} />}>{value}</Tag>
}
