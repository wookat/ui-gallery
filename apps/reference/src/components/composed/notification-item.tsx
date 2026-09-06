import * as React from "react"
import { cn } from "cn"
import { BoxIcon, type LucideIcon, PackageIcon, RefreshCwIcon, RotateCcwIcon, ShieldAlertIcon, UserPlusIcon } from "lucide-react"

import type { Tone } from "@/components/ui/badge"

/** 通知类型 → 图标 + 语义色（mock/notifications.json type 字段） */
const kinds: Record<string, { icon: LucideIcon; tone: Tone }> = {
  refund: { icon: RotateCcwIcon, tone: "danger" },
  inventory: { icon: BoxIcon, tone: "warning" },
  sync: { icon: RefreshCwIcon, tone: "info" },
  order: { icon: PackageIcon, tone: "success" },
  member: { icon: UserPlusIcon, tone: "neutral" },
  security: { icon: ShieldAlertIcon, tone: "danger" },
}

const toneClass: Record<Tone, string> = {
  info: "bg-primary-soft text-on-primary-soft",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  success: "bg-success-soft text-success",
  neutral: "bg-neutral-soft text-on-neutral-soft",
  muted: "bg-neutral-soft text-fg-muted",
}

type NotificationItemProps = React.ComponentProps<"button"> & {
  kind: string
  title: string
  time: string
  unread?: boolean
}

/** 通知项：hifi .notif-item —— 圆形语义图标 / 标题 + 时间 / 未读蓝点 */
function NotificationItem({ kind, title, time, unread, className, ...props }: NotificationItemProps) {
  const { icon: Icon, tone } = kinds[kind] ?? kinds.member
  return (
    <button
      type="button"
      data-slot="notification-item"
      data-unread={unread || undefined}
      className={cn(
        "grid min-h-hit w-full grid-cols-[var(--size-avatar-md)_1fr_auto] items-start gap-3 rounded-md p-3 text-left transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted",
        className,
      )}
      {...props}
    >
      <span aria-hidden className={cn("grid size-avatar-md place-items-center rounded-full", toneClass[tone])}>
        <Icon className="size-icon-sm" />
      </span>
      <span className="min-w-0">
        <span className={cn("block text-role-body text-fg", unread && "font-medium")}>{title}</span>
        <time className="mt-1 block text-role-caption text-fg-muted">{time}</time>
      </span>
      <i aria-hidden className={cn("mt-2 size-2 rounded-full bg-primary", !unread && "invisible")} />
    </button>
  )
}

export { NotificationItem, kinds as notificationKinds }
