import type { ReactNode } from "react"
import Header from "@cloudscape-design/components/header"
import StatusIndicator, { type StatusIndicatorProps } from "@cloudscape-design/components/status-indicator"
import { Avatar } from "@cloudscape-design/chat-components"

export const STATUS_LABEL: Record<string, string> = {
  paid: "已支付",
  pending: "待处理",
  refunded: "已退款",
  failed: "失败",
  canceled: "已取消",
  cancelled: "已取消",
  shipped: "已发货",
  due: "待付款",
  owner: "所有者",
  admin: "管理员",
  member: "成员",
  viewer: "只读",
}

const STATUS_TYPE: Record<string, StatusIndicatorProps.Type> = {
  paid: "success",
  pending: "pending",
  refunded: "stopped",
  failed: "error",
  canceled: "stopped",
  cancelled: "stopped",
  shipped: "in-progress",
  due: "warning",
}

export function label(status: string) {
  return STATUS_LABEL[status] ?? status
}

export function OrderStatus({ status }: { status: string }) {
  return <StatusIndicator type={STATUS_TYPE[status] ?? "info"}>{label(status)}</StatusIndicator>
}

export function money(amount: number, currency = "CNY") {
  return new Intl.NumberFormat("zh-CN", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount)
}

export function PersonAvatar({ name, size }: { name: string; size?: "small" | "medium" | "large" }) {
  const initials = /^[A-Za-z]/.test(name)
    ? name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
    : name.slice(0, 1)
  return <Avatar ariaLabel={name} initials={initials} tooltipText={name} width={size === "small" ? 24 : size === "large" ? 40 : 28} />
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <Header variant="h1" description={description} actions={actions}>
      {title}
    </Header>
  )
}
