import * as React from "react"
import { cn } from "@/lib/cn"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

/** 分段控件：hifi .segmented —— 外框 hairline + radius.md，项之间 hairline 竖线；单选，选中 primary-soft */
function Segmented({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return <ToggleGroupPrimitive.Root data-slot="segmented" className={cn("inline-flex max-w-full overflow-hidden rounded-md border", className)} {...props} />
}

function SegmentedItem({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="segmented-item"
      className={cn(
        "relative inline-flex h-hit items-center gap-2 border-l px-4 text-role-label whitespace-nowrap text-fg-muted transition-colors duration-(--motion-fast) ease-std first:border-l-0 hover:not-disabled:bg-surface-muted hover:not-disabled:text-fg focus-visible:-outline-offset-(--border-width-focus) data-[state=on]:bg-primary-soft data-[state=on]:text-on-primary-soft disabled:disabled-look [&_svg]:size-icon-md [&_svg]:shrink-0 data-[icon]:w-hit data-[icon]:justify-center data-[icon]:px-0",
        className,
      )}
      {...props}
    />
  )
}

export { Segmented, SegmentedItem }
