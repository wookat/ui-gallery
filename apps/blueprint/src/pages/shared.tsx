import type { ReactNode } from "react"
import { Card, H1, H3, Intent, Tag } from "@blueprintjs/core"

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="row-between">
      <div>
        <div className="muted" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>Acme Console</div>
        <H1 style={{ margin: "4px 0" }}>{title}</H1>
        {description ? <p className="muted" style={{ margin: 0 }}>{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function SectionCard({ title, description, children, action, className, style }: { title: string; description?: string; children: ReactNode; action?: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <Card className={`stack ${className ?? ""}`} style={style}>
      <div className="row-between">
        <div className="min0">
          <H3 style={{ margin: 0 }}>{title}</H3>
          {description ? <p className="muted" style={{ margin: "4px 0 0" }}>{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </Card>
  )
}

const intents: Record<string, Intent> = { paid: Intent.SUCCESS, shipped: Intent.SUCCESS, active: Intent.SUCCESS, pending: Intent.WARNING, due: Intent.WARNING, refunded: Intent.DANGER, failed: Intent.DANGER, cancelled: Intent.NONE }
const labels: Record<string, string> = { paid: "已支付", pending: "待支付", refunded: "已退款", shipped: "已发货", cancelled: "已取消", failed: "失败", due: "待付", active: "活跃" }

export function StatusTag({ value }: { value: string }) {
  return <Tag intent={intents[value] ?? Intent.NONE} minimal round>{labels[value] ?? value}</Tag>
}

export function Avatar({ name, size }: { name: string; size?: "sm" | "lg" }) {
  return <span className={`avatar ${size ?? ""}`} aria-hidden="true">{name.trim().charAt(0).toUpperCase()}</span>
}

export const money = (n: number) => `¥${n.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
