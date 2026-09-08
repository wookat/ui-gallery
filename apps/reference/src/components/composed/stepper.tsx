import * as React from "react"
import { cn } from "@/lib/cn"
import { CheckIcon } from "lucide-react"

type StepStatus = "done" | "current" | "todo" | "error"

type StepperProps = React.ComponentProps<"ol"> & {
  steps: readonly { key: string; label: string }[]
  current: number
  /** 各状态的视觉隐藏文字（content form.stepper.status.*） */
  statusLabels: Record<StepStatus, string>
  /** ≤768 折叠为「第 n 步，共 N 步」文字（content form.stepper.step） */
  compactLabel?: string
  errorAt?: number
}

/**
 * 步骤条：hifi .stepper / .step / .step-dot / .step-line —— size.step 圆点（done primary 实底 + 勾、current primary 描边、todo border）、
 * 连接线 border-width.focus 高（已完成段 primary）；≤768 隐藏标签、只显示点与 compactLabel。
 */
function Stepper({ steps, current, statusLabels, compactLabel, errorAt, className, ...props }: StepperProps) {
  const statusOf = (i: number): StepStatus => (i === errorAt ? "error" : i < current ? "done" : i === current ? "current" : "todo")
  return (
    <div data-slot="stepper" className={cn("flex w-full flex-col gap-2", className)}>
      <ol className="flex w-full items-center" {...props}>
        {steps.map((step, i) => {
          const status = statusOf(i)
          return (
            <li key={step.key} data-status={status} aria-current={status === "current" ? "step" : undefined} className={cn("flex min-w-0 items-center gap-3", i < steps.length - 1 && "flex-1")}>
              <span
                aria-hidden
                className={cn(
                  "grid size-step shrink-0 place-items-center rounded-full border text-role-caption font-medium tabular-nums transition-colors duration-(--motion-fast) ease-std [&_svg]:size-icon-sm",
                  status === "done" && "border-primary bg-primary text-on-primary",
                  status === "current" && "border-(length:--border-width-focus) border-primary text-primary",
                  status === "todo" && "border-border-strong text-fg-muted",
                  status === "error" && "border-danger bg-danger-soft text-danger",
                )}
              >
                {status === "done" ? <CheckIcon strokeWidth={3} /> : i + 1}
              </span>
              <span className={cn("truncate text-role-label mobile:sr-only", status === "todo" ? "text-fg-muted" : status === "error" ? "text-danger" : "text-fg")}>
                {step.label}
                <span className="sr-only">，{statusLabels[status]}</span>
              </span>
              {i < steps.length - 1 ? <span aria-hidden className={cn("mx-2 h-focus flex-1 rounded-full", i < current ? "bg-primary" : "bg-border")} /> : null}
            </li>
          )
        })}
      </ol>
      {compactLabel ? <p className="hidden text-role-caption text-fg-muted mobile:block">{compactLabel}</p> : null}
    </div>
  )
}

export { Stepper, type StepperProps, type StepStatus }
