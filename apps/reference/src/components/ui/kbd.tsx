import * as React from "react"
import { cn } from "@/lib/cn"

/** 快捷键：hifi .search kbd */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn("inline-flex items-center rounded-xs border bg-surface px-1 text-role-caption text-fg-muted", className)}
      {...props}
    />
  )
}

export { Kbd }
