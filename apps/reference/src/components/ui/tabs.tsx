import * as React from "react"
import { cn } from "@/lib/cn"
import { Tabs as TabsPrimitive } from "radix-ui"

type TabsVariant = "pill" | "line" | "vertical"

const TabsVariantContext = React.createContext<TabsVariant>("pill")

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root> & {
  /** pill：hifi .tabs（surface-muted 槽）；line：.tabs-line（底边 + primary 下划线）；vertical：.tabs-v（设置分区，primary-soft 选中） */
  variant?: TabsVariant
}

/** 标签页：hifi .tabs / .tabs-line / .tabs-v —— 三种外观共用 Radix Tabs，vertical 默认 orientation="vertical"（上下键切换） */
function Tabs({ className, variant = "pill", orientation, ...props }: TabsProps) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-variant={variant}
        orientation={orientation ?? (variant === "vertical" ? "vertical" : "horizontal")}
        className={cn("flex flex-col gap-6", variant === "vertical" && "flex-row items-start", className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  )
}

const listVariants: Record<TabsVariant, string> = {
  pill: "inline-flex w-fit gap-1 rounded-md bg-surface-muted p-1",
  line: "flex w-full max-w-full gap-2 border-b border-border",
  vertical: "flex w-settings-tabs max-w-full flex-col gap-1",
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  const variant = React.useContext(TabsVariantContext)
  return <TabsPrimitive.List data-slot="tabs-list" className={cn(listVariants[variant], className)} {...props} />
}

const triggerVariants: Record<TabsVariant, string> = {
  pill: "justify-center rounded-sm data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=active]:shadow-sm",
  line: "relative justify-center gap-2 rounded-none after:absolute after:inset-x-0 after:-bottom-hairline after:h-focus after:rounded-full data-[state=active]:text-fg data-[state=active]:after:bg-primary",
  vertical: "w-full justify-start gap-3 rounded-md text-left data-[state=active]:bg-primary-soft data-[state=active]:text-on-primary-soft",
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(TabsVariantContext)
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-hit min-w-16 shrink-0 items-center px-4 text-role-label whitespace-nowrap text-fg-muted transition-colors duration-(--motion-fast) ease-std hover:not-disabled:text-fg disabled:disabled-look [&_svg]:size-icon-md [&_svg]:shrink-0",
        triggerVariants[variant],
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent, type TabsProps, type TabsVariant }
