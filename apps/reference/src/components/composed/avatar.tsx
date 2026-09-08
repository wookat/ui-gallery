import * as React from "react"
import { cn } from "@/lib/cn"

type AvatarProps = React.ComponentProps<"span"> & {
  /** 姓名末字（mock *.initial） */
  initial: string
  /** 色相（mock *.avatarHue）；system 类头像不传 */
  hue?: number
  size?: "sm" | "md"
  /** 系统/机器人：neutral-soft */
  system?: boolean
  /** 完整姓名，供读屏 */
  name?: string
  /** 代替末字的图标（system 设备 / 邀请邮件头像） */
  children?: React.ReactNode
}

/** 头像：hifi .avatar —— 无图片，姓名末字 + hue 派生色；饱和/明度来自令牌 */
function Avatar({ initial, hue, size = "md", system = false, name, className, style, children, ...props }: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      role="img"
      aria-label={name ?? initial}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full select-none",
        size === "md" ? "size-avatar-md text-role-label" : "size-avatar-sm text-role-caption font-medium",
        system ? "bg-neutral-soft text-on-neutral-soft" : "avatar-tone",
        children ? "[&_svg]:size-icon-md" : undefined,
        className,
      )}
      style={system ? style : ({ ...style, "--avatar-hue": hue ?? 0 } as React.CSSProperties)}
      {...props}
    >
      {children ?? initial}
    </span>
  )
}

export { Avatar, type AvatarProps }
