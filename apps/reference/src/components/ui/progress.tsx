import * as React from "react"
import { cn } from "cn"
import { Progress as ProgressPrimitive } from "radix-ui"

/** 进度条：hifi .bar —— space.2 高、surface-muted 槽、primary 填充；at_risk=warning、done=success */
function Progress({
  className,
  value = 0,
  tone = "primary",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { tone?: "primary" | "warning" | "success" }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-tone={tone}
      value={value}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-muted", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full rounded-full transition-[width] duration-(--motion-slow) ease-std",
          tone === "primary" && "bg-primary",
          tone === "warning" && "bg-warning",
          tone === "success" && "bg-success",
        )}
        style={{ width: `${value ?? 0}%` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
