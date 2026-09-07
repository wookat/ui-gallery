import * as React from "react"
import { cn } from "@/lib/cn"
import { XIcon } from "lucide-react"
import { Dialog as SheetPrimitive } from "radix-ui"

import { IconButton } from "@/components/ui/icon-button"

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

/** 抽屉：hifi 移动端侧栏 —— overlay 令牌遮罩、surface 面板、宽 = size.sidebar.drawer */
function SheetContent({
  className,
  children,
  side = "left",
  title,
  description,
  closeLabel,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "left" | "right"
  title: string
  description?: string
  closeLabel: string
}) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay data-slot="sheet-overlay" className="fixed inset-0 z-30 bg-overlay" />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed inset-y-0 z-30 flex w-sidebar-drawer max-w-[calc(100vw-var(--size-hit))] flex-col bg-surface text-fg shadow-lg outline-none",
          side === "left" ? "left-0 border-r" : "right-0 border-l",
          className,
        )}
        {...props}
      >
        <SheetPrimitive.Title className="sr-only">{title}</SheetPrimitive.Title>
        {description ? <SheetPrimitive.Description className="sr-only">{description}</SheetPrimitive.Description> : null}
        {children}
        <SheetPrimitive.Close asChild>
          <IconButton label={closeLabel} className="absolute top-2 right-2">
            <XIcon />
          </IconButton>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}

export { Sheet, SheetTrigger, SheetClose, SheetContent }
