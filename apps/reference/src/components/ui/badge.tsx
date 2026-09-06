import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/** 语义色调（Tag / Delta / 通知图标共用） */
export type Tone = "info" | "warning" | "danger" | "success" | "neutral" | "muted"

/** 状态标签：hifi .tag —— 胶囊、caption medium、前置圆点表示语义色 */
const tagVariants = cva(
  "inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-role-caption font-medium whitespace-nowrap [&_svg]:size-icon-sm",
  {
    variants: {
      tone: {
        info: "bg-primary-soft text-on-primary-soft",
        warning: "bg-warning-soft text-warning",
        danger: "bg-danger-soft text-danger",
        success: "bg-success-soft text-success",
        neutral: "bg-neutral-soft text-on-neutral-soft",
        muted: "bg-transparent text-fg-muted shadow-[inset_0_0_0_var(--border-width-hairline)_var(--color-role-border)]",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
)

type TagProps = React.ComponentProps<"span"> & VariantProps<typeof tagVariants> & { dot?: boolean }

function Tag({ className, tone, dot = true, children, ...props }: TagProps) {
  return (
    <span data-slot="tag" data-tone={tone ?? "neutral"} className={cn(tagVariants({ tone }), className)} {...props}>
      {dot ? <i aria-hidden className="size-2 shrink-0 rounded-full bg-current" /> : null}
      {children}
    </span>
  )
}

/** 计数角标：hifi .count-badge —— 导航未读数 / 图标按钮红点 */
const countBadgeVariants = cva(
  "inline-flex h-badge min-w-badge items-center justify-center rounded-full px-1 text-role-caption font-medium tabular-nums",
  {
    variants: {
      tone: {
        neutral: "bg-neutral-soft text-on-neutral-soft",
        warning: "bg-warning-soft text-warning",
        alert: "bg-danger text-on-danger border-2 border-surface",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
)

function CountBadge({ className, tone, ...props }: React.ComponentProps<"span"> & VariantProps<typeof countBadgeVariants>) {
  return <span data-slot="count-badge" className={cn(countBadgeVariants({ tone }), className)} {...props} />
}

export { Tag, tagVariants, CountBadge, countBadgeVariants, type TagProps }
