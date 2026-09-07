import * as React from "react"
import { cn } from "@/lib/cn"
import { Popover as PopoverPrimitive } from "radix-ui"

import { tokenPx, useMaxWidth } from "@/lib/media"

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/**
 * 浮层：hifi .popover —— surface-raised、radius.lg、shadow.lg、space.2 内距、宽 = content-max/4；
 * ≤768 时改为左右 space.4 贴边、距顶栏 space.2（hifi 移动端 .popover fixed 规则）。
 */
function PopoverContent({ className, align = "end", sideOffset = 8, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const mobile = useMaxWidth("--breakpoint-md")
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={mobile ? tokenPx("--space-4") : sideOffset}
        collisionPadding={mobile ? tokenPx("--space-4") : undefined}
        className={cn(
          "z-40 w-popover max-w-[calc(100vw-var(--space-4)*2)] mobile:w-[calc(100vw-var(--space-4)*2)] rounded-lg border bg-surface-raised p-2 text-fg shadow-lg outline-none",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="popover-header" className={cn("flex items-center justify-between py-1 pr-2 pl-3", className)} {...props} />
}

function PopoverFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="popover-footer" className={cn("mt-2 border-t pt-2", className)} {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverFooter }
