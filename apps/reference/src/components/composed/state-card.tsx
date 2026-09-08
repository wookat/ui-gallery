import * as React from "react"
import { cn } from "@/lib/cn"
import { TriangleAlertIcon } from "lucide-react"

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
      <rect x="28" y="72" width="16" height="28" rx="4" className="fill-primary-soft" />
      <rect x="52" y="56" width="16" height="44" rx="4" className="fill-primary-soft" />
      <rect x="76" y="40" width="16" height="60" rx="4" className="fill-primary" />
      <path d="M24 52 L44 44 L64 36 L84 24 L104 20" className="stroke-border-strong" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" fill="none" />
    </svg>
  )
}

/** 空态 / 错误态卡：hifi .state-card —— 居中、heading 标题、fg-muted 正文、动作区 */
function StateCard({ kind, title, body, actions, help, className, ...props }: StateCardProps) {
  const titleId = React.useId()
  return (
    <Card
      data-slot="state-card"
      data-kind={kind}
      role={kind === "error" ? "alert" : undefined}
      aria-labelledby={titleId}
      className={cn("flex flex-col items-center gap-2 px-6 py-16 text-center", className)}
      {...props}
    >
      {kind === "empty" ? (
        <EmptyFigure />
      ) : (
        <span aria-hidden className="mb-4 grid size-control-lg place-items-center rounded-full bg-danger-soft text-danger">
          <TriangleAlertIcon className="size-icon-md" />
        </span>
      )}
      <h2 id={titleId} className="text-role-heading">{title}</h2>
      <p className="max-w-[calc(var(--size-form-max)+var(--size-sidebar-rail))] text-fg-muted">{body}</p>
      {actions ? <div className="mt-4 flex flex-wrap justify-center gap-3">{actions}</div> : null}
      {help ? (
        <p className="mt-2 flex flex-wrap items-center justify-center text-role-caption text-fg-muted [&_a]:inline-flex [&_a]:min-h-hit [&_a]:items-center [&_a]:rounded-xs [&_a]:px-1 [&_a]:underline [&_a]:underline-offset-(--space-1) [&_a]:hover:text-primary-hover">
          {help}
        </p>
      ) : null}
    </Card>
  )
}

export { StateCard, EmptyFigure, type StateCardProps }
