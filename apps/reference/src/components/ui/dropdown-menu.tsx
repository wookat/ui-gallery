import * as React from "react"
import { cn } from "@/lib/cn"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { tokenPx, useMaxWidth } from "@/lib/media"

/** 顶栏账号菜单默认非模态：不给页面其余部分加 aria-hidden、不锁滚动 */
function DropdownMenu({ modal = false, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" modal={modal} {...props} />
}

function DropdownMenuTrigger(props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

type DropdownMenuContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  /** 行内「···」菜单（hifi .popover-fixed）：宽 = popover × 0.6，距触发器 space.1 */
  compact?: boolean
}

/**
 * 菜单容器同 Popover（hifi .popover）：surface-raised、radius.lg、shadow.lg、space.2 内距。
 * ≤768 时与 hifi 移动端 .popover 一致：顶栏下 space.2、左右 space.4 贴边通栏；compact 菜单左侧保留 space.1。
 */
function DropdownMenuContent({ className, align = "end", sideOffset, compact = false, ...props }: DropdownMenuContentProps) {
  const mobile = useMaxWidth("--breakpoint-md")
  const gap = compact ? tokenPx("--space-1") : tokenPx("--space-2")
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        align={align}
        sideOffset={sideOffset ?? (mobile && !compact ? tokenPx("--space-4") : gap)}
        collisionPadding={mobile ? { left: compact ? tokenPx("--space-1") : tokenPx("--space-4"), right: tokenPx("--space-4") } : undefined}
        className={cn(
          "z-40 rounded-lg border bg-surface-raised p-2 text-fg shadow-lg outline-none",
          compact
            ? "w-[calc(var(--size-content-max)/4*0.6)] mobile:w-[calc(100vw-var(--space-4)-var(--space-1))]"
            : "min-w-(--radix-dropdown-menu-trigger-width) w-popover max-w-[calc(100vw-var(--space-4)*2)] mobile:w-[calc(100vw-var(--space-4)*2)]",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

/** 菜单项：hifi .menu-item —— min-h size.hit、space.3 内距、hover surface-muted；danger 变体转 danger-soft */
function DropdownMenuItem({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { variant?: "default" | "danger" }) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        "flex min-h-hit w-full cursor-default items-center gap-3 rounded-md px-3 text-role-body text-fg outline-none select-none transition-colors duration-(--motion-fast) ease-std data-highlighted:bg-surface-muted data-disabled:disabled-look [&_svg]:size-icon-md [&_svg]:shrink-0 [&_svg]:text-fg-muted",
        variant === "danger" && "text-danger data-highlighted:bg-danger-soft [&_svg]:text-current",
        className,
      )}
      {...props}
    />
  )
}

/** 菜单头（hifi .menu-head）：头像 + 姓名/邮箱，下方 hairline 分隔 */
function DropdownMenuHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="group" data-slot="dropdown-menu-header" className={cn("mb-2 flex items-center gap-3 border-b px-3 pt-2 pb-3", className)} {...props} />
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      className={cn("px-3 py-2 text-role-caption text-fg-muted", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("my-2 h-px bg-border", className)} {...props} />
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuHeader, DropdownMenuLabel, DropdownMenuSeparator }
