import * as React from "react"
import { cn } from "@/lib/cn"

import { Select } from "@/components/ui/select"

type MemberRowProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** 头像（Avatar）或待接受邀请的邮件图标占位 */
  avatar: React.ReactNode
  /** 姓名（待接受邀请为邮箱）；pending 时 fg-muted */
  name: string
  /** 邮箱 / 邀请状态副文案 */
  meta: React.ReactNode
  roles: readonly { key: string; label: string }[]
  role: string
  /** 角色 Select 可访问名（content team.col.role + 姓名） */
  roleLabel: string
  onRoleChange?: (role: string) => void
  /** 本人 / 系统锁定：角色不可改 */
  roleDisabled?: boolean
  /** 第 4 列：「你」caption、最近活动 caption 或「待接受」Tag */
  status?: React.ReactNode
  /** 第 5 列 size.hit 位：移除 / 撤回 IconButton；缺省留空占位 */
  action?: React.ReactNode
  pending?: boolean
}

/**
 * 团队成员行：hifi .member-row —— grid「avatar.md | 1fr | Select(hit×3) | 状态 | hit」，行高 ≥ size.table-row，行间 hairline；
 * ≤768 折为「avatar | 1fr | hit」三列，Select 与状态换行占满第 2 列。
 */
function MemberRow({ avatar, name, meta, roles, role, roleLabel, onRoleChange, roleDisabled, status, action, pending, className, ...props }: MemberRowProps) {
  return (
    <div
      data-slot="member-row"
      data-pending={pending || undefined}
      className={cn(
        "grid min-h-table-row w-full grid-cols-[var(--size-avatar-md)_minmax(0,1fr)_auto_auto_var(--size-hit)] items-center gap-3 border-b py-2 last:border-b-0 mobile:grid-cols-[var(--size-avatar-md)_minmax(0,1fr)_var(--size-hit)]",
        className,
      )}
      {...props}
    >
      {avatar}
      <span className="flex min-w-0 flex-col">
        <strong className={cn("truncate text-role-label", pending ? "text-fg-muted" : "text-fg")}>{name}</strong>
        <span className="truncate text-role-caption text-fg-muted">{meta}</span>
      </span>
      <Select aria-label={roleLabel} value={role} onChange={(e) => onRoleChange?.(e.target.value)} disabled={roleDisabled} wrapClassName="w-[calc(var(--size-hit)*3)] mobile:col-start-2 mobile:w-full">
        {roles.map((r) => (
          <option key={r.key} value={r.key}>
            {r.label}
          </option>
        ))}
      </Select>
      <span className="flex min-w-0 items-center text-role-caption text-fg-muted mobile:col-start-2">{status}</span>
      <span className="flex size-hit items-center justify-center mobile:col-start-3 mobile:row-start-1">{action}</span>
    </div>
  )
}

export { MemberRow, type MemberRowProps }
