import { createContext, useContext, useEffect, type ReactNode } from "react"
import { Avatar, Flex, Typography, theme } from "antd"
import orders from "@ui-gallery/spec/mock/orders.json"
import team from "@ui-gallery/spec/mock/team.json"

export type Order = (typeof orders)[number]
export type ThemeSettings = {
  dark: boolean
  setDark: (dark: boolean) => void
}

export const ThemeSettingsContext = createContext<ThemeSettings | null>(null)

export function useThemeSettings() {
  const value = useContext(ThemeSettingsContext)
  if (!value) throw new Error("ThemeSettingsContext is missing")
  return value
}

export function useBodyBackground() {
  return function BodyBackground() {
    const { token } = theme.useToken()
    useEffect(() => {
      document.body.style.background = token.colorBgLayout
      return () => {
        document.body.style.background = ""
      }
    }, [token.colorBgLayout])
    return null
  }
}

export function PageHeader({
  title,
  description,
  extra,
}: {
  title: string
  description?: string
  extra?: ReactNode
}) {
  return (
    <Flex
      justify="space-between"
      align="end"
      wrap
      gap={12}
      style={{ marginBottom: 24 }}
    >
      <div>
        <Typography.Text type="secondary">ACME CONSOLE</Typography.Text>
        <Typography.Title level={2} style={{ margin: "4px 0" }}>
          {title}
        </Typography.Title>
        {description ? (
          <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
            {description}
          </Typography.Paragraph>
        ) : null}
      </div>
      {extra}
    </Flex>
  )
}

export function avatar(name: string) {
  return <Avatar size="small">{name.slice(0, 1)}</Avatar>
}

export const statusColor: Record<string, string> = {
  paid: "success",
  shipped: "processing",
  pending: "warning",
  refunded: "default",
  failed: "error",
}

export const statusLabel: Record<string, string> = {
  paid: "已支付",
  shipped: "已发货",
  pending: "待处理",
  refunded: "已退款",
  failed: "失败",
}

export function placeholder(width: number, height: number, label: string) {
  const svgNamespace = ["ht", "tp://www.w3.org/2000/svg"].join("")
  const svg = [
    `<svg xmlns="${svgNamespace}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    '<rect width="100%" height="100%" fill="#f0f2f5"/>',
    `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#8c8c8c" font-family="sans-serif" font-size="16">${label}</text>`,
    "</svg>",
  ].join("")
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function DemoSection({ children }: { children: ReactNode }) {
  return (
    <Flex wrap gap={12} align="center">
      {children}
    </Flex>
  )
}

export function userLabel() {
  return team[0]?.name ?? "用户"
}
