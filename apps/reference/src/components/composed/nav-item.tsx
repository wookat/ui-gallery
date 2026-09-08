import * as React from "react"
import { cn } from "@/lib/cn"
import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { CountBadge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type NavItemProps = React.ComponentProps<"a"> & {
  icon: LucideIcon
  label: string
  active?: boolean
  /** 未实现路由：可聚焦、aria-disabled、hover 出 Tooltip（文案 shell.nav.disabled.tip） */
  disabledTip?: string
  count?: number
  /** 角标语义色（nav.json badgeTone）：库存预警为 warning-soft / warning */
  countTone?: "neutral" | "warning"
  /** 角标可访问名（nav.json badgeMeaning + 数值），如「库存预警 SKU 12」 */
  countLabel?: string
  /** 图标栏模式：只显示图标，label 进 Tooltip，角标退化为红点 */
  rail?: boolean
}

/** 侧栏导航项：hifi .nav-item —— size.hit 高、radius.md、当前项 primary-soft / on-primary-soft；有 href 且可用时走 react-router Link（尊重 basename） */
function NavItem({ icon: Icon, label, active, disabledTip, count = 0, countTone, countLabel, rail = false, className, onClick, href, ...props }: NavItemProps) {
  const disabled = Boolean(disabledTip)
  const shared = {
    ...props,
    "data-slot": "nav-item",
    "aria-current": active ? ("page" as const) : undefined,
    "aria-disabled": disabled || undefined,
    "aria-label": rail ? label : undefined,
    tabIndex: 0,
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) e.preventDefault()
      onClick?.(e)
    },
    className: cn(
      "relative flex h-hit items-center gap-3 rounded-md px-3 text-left text-role-label text-fg-muted no-underline transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted hover:text-fg hover:no-underline",
      active && "bg-primary-soft text-on-primary-soft [&>svg]:text-primary",
      disabled && "cursor-not-allowed hover:bg-transparent hover:text-fg-muted",
      rail && "w-hit justify-center px-0",
      className,
    ),
  }
  const inner = (
    <>
      <Icon aria-hidden className="size-icon-md shrink-0" />
      {rail ? (
        count > 0 ? <i aria-hidden className="absolute top-2 right-2 size-2 rounded-full bg-danger" /> : null
      ) : (
        <>
          <span className="flex-1 truncate">{label}</span>
          {count > 0 ? (
            <CountBadge tone={countTone} className="ml-auto">
              {countLabel ? (
                <>
                  <span aria-hidden>{count}</span>
                  <span className="sr-only">{countLabel}</span>
                </>
              ) : (
                count
              )}
            </CountBadge>
          ) : null}
        </>
      )}
    </>
  )
  const link =
    href && !disabled ? (
      <Link to={href} {...shared}>
        {inner}
      </Link>
    ) : (
      <a href={href} {...shared}>
        {inner}
      </a>
    )
  const tip = disabledTip ?? (rail ? label : undefined)
  if (!tip) return link
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side={rail ? "right" : "top"} align={rail ? "center" : "start"}>
        {rail && disabledTip ? `${label} · ${disabledTip}` : tip}
      </TooltipContent>
    </Tooltip>
  )
}

function NavGroupLabel({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="nav-group-label" className={cn("block px-3 pt-2 pb-1 text-role-caption font-medium text-fg-muted", className)} {...props} />
}

export { NavItem, NavGroupLabel, type NavItemProps }
