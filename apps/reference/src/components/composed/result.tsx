import * as React from "react"
import { cn } from "@/lib/cn"
import { CircleCheckIcon, CircleXIcon, InfoIcon, TriangleAlertIcon } from "lucide-react"

import { Card } from "@/components/ui/card"

type ResultProps = React.ComponentProps<typeof Card> & {
  status: "success" | "error" | "warning" | "info"
  title: string
  description?: React.ReactNode
  /** 摘要区（DescriptionList 等） */
  children?: React.ReactNode
  actions?: React.ReactNode
}

const ICONS = { success: CircleCheckIcon, error: CircleXIcon, warning: TriangleAlertIcon, info: InfoIcon }

/** 结果页：hifi .result —— 居中 control.lg 圆形语义底 + 图标、heading 标题、fg-muted 描述、摘要区、动作行（与 StateCard 同骨架，用于提交成功 / 失败） */
function Result({ status, title, description, children, actions, className, ...props }: ResultProps) {
  const Icon = ICONS[status]
  const titleId = React.useId()
  return (
    <Card
      data-slot="result"
      data-status={status}
      role={status === "error" ? "alert" : "status"}
      aria-labelledby={titleId}
      className={cn("flex flex-col items-center gap-2 px-6 py-12 text-center", className)}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "mb-4 grid size-control-lg place-items-center rounded-full [&_svg]:size-icon-lg",
          status === "success" && "bg-success-soft text-success",
          status === "error" && "bg-danger-soft text-danger",
          status === "warning" && "bg-warning-soft text-warning",
          status === "info" && "bg-primary-soft text-on-primary-soft",
        )}
      >
        <Icon />
      </span>
      <h2 id={titleId} className="text-role-heading">
        {title}
      </h2>
      {description ? <p className="max-w-prose-max text-fg-muted">{description}</p> : null}
      {children ? <div className="mt-4 w-full max-w-form-max text-left">{children}</div> : null}
      {actions ? <div className="mt-4 flex flex-wrap justify-center gap-3">{actions}</div> : null}
    </Card>
  )
}

export { Result, type ResultProps }
