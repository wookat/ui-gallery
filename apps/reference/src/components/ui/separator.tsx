import * as React from "react"
import { cn } from "cn"
import { Separator as SeparatorPrimitive } from "radix-ui"

function Separator({ className, orientation = "horizontal", decorative = true, ...props }: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn("shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", className)}
      {...props}
    />
  )
}

/** 带文字的分隔（hifi .divider：「或」） */
function TextDivider({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      data-slot="text-divider"
      className={cn("flex items-center gap-3 text-role-caption text-fg-muted before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Separator, TextDivider }
