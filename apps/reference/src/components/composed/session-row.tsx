import * as React from "react"
import { cn } from "@/lib/cn"

import { Avatar } from "@/components/composed/avatar"

type SessionRowProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** 设备图标（lucide Monitor / Smartphone），置于 system Avatar 内 */
  icon: React.ReactNode
  /** 设备名（mock security.sessions[].device） */
  device: string
  /** 设备名后 Tag（当前设备） */
  badge?: React.ReactNode
  /** 地点 · IP（· 时间） */
  meta: React.ReactNode
  /** 右列：当前设备显示相对时间 caption，其余为注销按钮 */
  trailing: React.ReactNode
}

/** 登录会话行：hifi .session-row —— grid「avatar.md | 1fr | auto」，行高 ≥ size.table-row，行间 hairline */
function SessionRow({ icon, device, badge, meta, trailing, className, ...props }: SessionRowProps) {
  return (
    <div
      data-slot="session-row"
      className={cn("grid min-h-table-row w-full grid-cols-[var(--size-avatar-md)_minmax(0,1fr)_auto] items-center gap-3 border-b py-2 last:border-b-0", className)}
      {...props}
    >
      <Avatar system initial="" aria-hidden>
        {icon}
      </Avatar>
      <span className="flex min-w-0 flex-col">
        <strong className="flex min-w-0 items-center gap-2 text-role-label text-fg">
          <span className="truncate">{device}</span>
          {badge}
        </strong>
        <span className="truncate text-role-caption text-fg-muted">{meta}</span>
      </span>
      <span className="flex items-center justify-end text-role-caption tabular-nums whitespace-nowrap text-fg-muted">{trailing}</span>
    </div>
  )
}

export { SessionRow, type SessionRowProps }
