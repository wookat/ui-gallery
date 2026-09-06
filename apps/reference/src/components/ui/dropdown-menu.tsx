import * as React from "react"
import { cn } from "cn"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

/** 顶栏账号菜单默认非模态：不给页面其余部分加 aria-hidden、不锁滚动 */
function DropdownMenu({ modal = false, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" modal={modal} {...props} />
}

function DropdownMenuTrigger(props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

/** 菜单容器同 Popover（hifi .popover） */
function DropdownMenuContent({ className, align = "end", sideOffset = 8, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-40 min-w-(--radix-dropdown-menu-trigger-width) w-popover max-w-[calc(100vw-var(--space-1)*8)] rounded-lg border bg-surface-raised p-2 text-fg shadow-lg outline-none",
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
