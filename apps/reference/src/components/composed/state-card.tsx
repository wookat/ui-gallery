import * as React from "react"
import { cn } from "cn"
import { CircleAlertIcon } from "lucide-react"

import { Card } from "@/components/ui/card"

type StateCardProps = React.ComponentProps<typeof Card> & {
  kind: "empty" | "error"
  title: string
  body: string
  actions?: React.ReactNode
  help?: React.ReactNode
}

/** 空态插图：hifi .state-card .figure —— 令牌色几何图，无位图 */
function EmptyFigure() {
  return (
    <svg aria-hidden viewBox="0 0 128 128" className="mb-4 size-empty-figure">
      <circle cx="64" cy="64" r="56" className="fill-surface-muted" />
      <rect x="28" y="52" width="72" height="44" rx="6" className="fill-primary-soft" />
      <rect x="36" y="60" width="24" height="6" rx="3" className="fill-primary" />
      <rect x="36" y="72" width="56" height="6" rx="3" className="fill-surface" />
      <rect x="36" y="84" width="40" height="6" rx="3" className="fill-surface" />
      <path d="M40 40h48" className="stroke-border-strong" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" fill="none" />
    </svg>
  )
}

/** 空态 / 错误态卡：hifi .state-card —— 居中、heading 标题、fg-muted 正文、动作区 */
function StateCard({ kind, title, body, actions, help, className, ...props }: StateCardProps) {
  return (
    <Card
      data-slot="state-card"
      data-kind={kind}
      role={kind === "error" ? "alert" : undefined}
      className={cn("flex flex-col items-center gap-2 px-6 py-16 text-center", className)}
      {...props}
    >
      {kind === "empty" ? (
        <EmptyFigure />
      ) : (
        <span aria-hidden className="mb-4 grid size-control-lg place-items-center rounded-full bg-danger-soft text-danger">
          <CircleAlertIcon className="size-icon-md" />
        </span>
      )}
      <h2 className="text-role-heading">{title}</h2>
      <p className="max-w-[calc(var(--size-form-max)+var(--size-sidebar-rail))] text-fg-muted">{body}</p>
      {actions ? <div className="mt-4 flex flex-wrap justify-center gap-3">{actions}</div> : null}
      {help ? <div className="mt-2 flex flex-wrap items-center justify-center text-role-caption text-fg-muted">{help}</div> : null}
    </Card>
  )
}

export { StateCard, EmptyFigure, type StateCardProps }
