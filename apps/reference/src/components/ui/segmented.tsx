import * as React from "react"
import { cn } from "@/lib/cn"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

type SegmentedVariant = "outline" | "soft"
const SegmentedVariantContext = React.createContext<SegmentedVariant>("outline")

/**
 * 分段控件：单选。
 * outline（默认）：hifi components .segmented —— 外框 hairline + radius.md，项之间 hairline 竖线，选中 primary-soft。
 * soft：hifi settings .seg —— surface-muted 槽 + space.1 内距 / 间距，选中项 surface + shadow.sm + radius.sm（与 Tabs 同形）。
 */
function Segmented({ className, variant = "outline", ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & { variant?: SegmentedVariant }) {
  return (
    <SegmentedVariantContext.Provider value={variant}>
      <ToggleGroupPrimitive.Root
        data-slot="segmented"
        data-variant={variant}
        className={cn("inline-flex max-w-full", variant === "soft" ? "gap-1 rounded-md bg-surface-muted p-1" : "overflow-hidden rounded-md border", className)}
        {...props}
      />
    </SegmentedVariantContext.Provider>
  )
}

function SegmentedItem({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  const variant = React.useContext(SegmentedVariantContext)
  return (
    <ToggleGroupPrimitive.Item
      data-slot="segmented-item"
      className={cn(
        "relative inline-flex h-hit items-center gap-2 px-4 text-role-label whitespace-nowrap text-fg-muted transition-colors duration-(--motion-fast) ease-std disabled:disabled-look [&_svg]:size-icon-md [&_svg]:shrink-0 data-[icon]:w-hit data-[icon]:justify-center data-[icon]:px-0",
        variant === "soft"
          ? "min-w-16 justify-center rounded-sm hover:not-disabled:text-fg data-[state=on]:bg-surface data-[state=on]:text-fg data-[state=on]:shadow-sm"
          : "border-l first:border-l-0 hover:not-disabled:bg-surface-muted hover:not-disabled:text-fg focus-visible:-outline-offset-(--border-width-focus) data-[state=on]:bg-primary-soft data-[state=on]:text-on-primary-soft",
        className,
      )}
      {...props}
    />
  )
}

export { Segmented, SegmentedItem }
