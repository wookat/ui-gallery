import * as React from "react"
import { cn } from "@/lib/cn"

/** 输入框：hifi .input —— control.md 高、border-strong、hover 转 fg-muted、focus 转 primary、invalid 加粗 danger */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-control-md w-full min-w-0 rounded-md border border-border-strong bg-surface px-3 text-role-body text-fg transition-colors duration-(--motion-fast) ease-std placeholder:text-fg-muted hover:not-disabled:not-read-only:border-fg-muted focus-visible:border-primary aria-invalid:border-2 aria-invalid:border-danger aria-invalid:focus-visible:outline-danger read-only:bg-surface-muted read-only:text-fg-muted disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-muted",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
