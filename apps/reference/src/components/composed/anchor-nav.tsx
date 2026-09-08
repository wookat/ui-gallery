import * as React from "react"
import { cn } from "@/lib/cn"

type AnchorNavItem = {
  id: string
  label: string
  href?: string
  /** 演示态（components 页 data-demo 驱动 hover / focus 外观） */
  demo?: "hover" | "focus"
}

type AnchorNavProps = Omit<React.ComponentProps<"nav">, "children" | "onSelect"> & {
  "aria-label": string
  items: readonly AnchorNavItem[]
  activeId?: string
  onActivate?: (id: string) => void
}

/** 页内锚点导航：hifi .anchor-nav —— 左侧 focus 宽度竖线，当前项 primary 色竖线 + 文字，行高 ≥ size.hit */
function AnchorNav({ items, activeId, onActivate, className, ...props }: AnchorNavProps) {
  return (
    <nav data-slot="anchor-nav" className={cn("flex flex-col border-l-(length:--border-width-focus) border-border", className)} {...props}>
      {items.map((item) => {
        const active = item.id === activeId
        return (
          <a
            key={item.id}
            href={item.href ?? `#${item.id}`}
            aria-current={active ? "true" : undefined}
            data-demo={item.demo}
            onClick={onActivate ? () => onActivate(item.id) : undefined}
            className={cn(
              "-ml-focus flex min-h-hit items-center border-l-(length:--border-width-focus) border-transparent px-4 text-role-label text-fg-muted transition-colors duration-(--motion-fast) ease-std hover:text-fg",
              active && "border-primary text-primary hover:text-primary",
            )}
          >
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}

export { AnchorNav, type AnchorNavItem, type AnchorNavProps }
