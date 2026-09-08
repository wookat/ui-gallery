import * as React from "react"
import { cn } from "@/lib/cn"

/** 文本域：hifi .textarea —— 最小高 = control.md × 2.5、border、hover 转 fg-muted、focus 转 primary、invalid 加粗 danger；纵向可拉伸 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "block min-h-[calc(var(--size-control-md)*2.5)] w-full min-w-0 resize-y rounded-md border border-border-strong bg-surface px-3 py-2 text-role-body text-fg transition-colors duration-(--motion-fast) ease-std placeholder:text-fg-muted hover:not-disabled:not-read-only:border-fg-muted focus-visible:border-primary aria-invalid:border-(length:--border-width-accent) aria-invalid:border-danger aria-invalid:focus-visible:outline-danger read-only:bg-surface-muted read-only:text-fg-muted disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-muted",
        className,
      )}
      {...props}
    />
  )
}

/** 字数计数：hifi .counter —— 右对齐 caption，超限转 danger */
function CharCounter({ value, max, className, ...props }: React.ComponentProps<"span"> & { value: number; max: number }) {
  return (
    <span
      data-slot="char-counter"
      aria-live="polite"
      className={cn("text-right text-role-caption tabular-nums", value > max ? "text-danger" : "text-fg-muted", className)}
      {...props}
    >
      {value}/{max}
    </span>
  )
}

export { Textarea, CharCounter }
