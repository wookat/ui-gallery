import * as React from "react"
import { cn } from "cn"
import { Slot } from "radix-ui"

import { CountBadge } from "@/components/ui/badge"

type IconButtonProps = React.ComponentProps<"button"> & {
  /** 无可见文字，必填可访问名 */
  label: string
  /** 右上角计数（未读通知等），0 不显示 */
  count?: number
  asChild?: boolean
  shape?: "square" | "round"
}

/** 图标按钮：hifi .iconbtn —— size.hit 正方形热区、fg-muted、hover/expanded 转 surface-muted */
function IconButton({ className, label, count = 0, asChild, shape = "square", children, ...props }: IconButtonProps) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      type={asChild ? undefined : "button"}
      data-slot="icon-button"
      aria-label={label}
      className={cn(
        "relative inline-flex size-hit shrink-0 items-center justify-center text-fg-muted transition-colors duration-(--motion-fast) ease-std hover:not-disabled:bg-surface-muted hover:not-disabled:text-fg aria-expanded:bg-surface-muted aria-expanded:text-fg active:not-disabled:bg-neutral-soft disabled:disabled-look [&_svg]:size-icon-md [&_svg]:shrink-0",
        shape === "round" ? "rounded-full" : "rounded-md",
        className,
      )}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {children}
          {count > 0 ? <CountBadge tone="alert" className="absolute top-1 right-1">{count}</CountBadge> : null}
        </>
      )}
    </Comp>
  )
}

export { IconButton, type IconButtonProps }
