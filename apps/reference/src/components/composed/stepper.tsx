import * as React from "react"
import { cn } from "@/lib/cn"
import { CheckIcon, CircleAlertIcon } from "lucide-react"

type StepStatus = "done" | "current" | "todo" | "error"

type StepperProps = React.ComponentProps<"ol"> & {
  steps: readonly { key: string; label: string; description?: string }[]
  current: number
  /** 各状态的视觉隐藏文字（content form.stepper.status.*） */
  statusLabels: Record<StepStatus, string>
  /** ≤768 折叠为「第 n 步，共 N 步」文字（content form.stepper.step） */
  compactLabel?: string
  errorAt?: number
  /** 传入后每步渲染为按钮（hifi form .step）：已到达过的步可直接跳转，未到达的禁用 */
  onStepChange?: (index: number) => void
  /** 已到达过的最大步下标（默认 = current） */
  reached?: number
  disabled?: boolean
}

/**
 * 步骤条：hifi .stepper / .step / .step-dot / .step-line —— size.step 圆点（done primary 实底 + 勾、current primary 描边、todo border）、
 * 连接线 border-width.focus 高（已完成段 primary）；≤768 隐藏标签、只显示点与 compactLabel。
 * 带 description / onStepChange 时为 form 稿的可点步骤（done primary-soft + 勾、current primary 实底、error danger-soft + 警示，space.10 短连接线）。
 */
function Stepper({ steps, current, statusLabels, compactLabel, errorAt, onStepChange, reached, disabled, className, ...props }: StepperProps) {
  const statusOf = (i: number): StepStatus => (i === errorAt ? "error" : i < current ? "done" : i === current ? "current" : "todo")
  const rich = steps.some((s) => s.description) || !!onStepChange
  const maxReached = Math.max(reached ?? current, current)
  return (
    <div data-slot="stepper" className={cn("flex w-full flex-col gap-2", className)}>
      <ol className={cn("flex w-full", rich ? "items-start gap-3 px-3" : "items-center")} {...props}>
        {steps.map((step, i) => {
          const status = statusOf(i)
          const dot = (
            <span
              aria-hidden
              className={cn(
                "grid size-step shrink-0 place-items-center rounded-full border text-role-caption font-medium tabular-nums transition-colors duration-(--motion-fast) ease-std [&_svg]:size-icon-sm",
                !rich && status === "done" && "border-primary bg-primary text-on-primary",
                !rich && status === "current" && "border-(length:--border-width-focus) border-primary text-primary",
                rich && status === "done" && "border-transparent bg-primary-soft text-on-primary-soft",
                rich && status === "current" && "border-primary bg-primary text-on-primary",
                status === "todo" && "border-border-strong text-fg-muted",
                status === "error" && "border-danger bg-danger-soft text-danger",
              )}
            >
              {status === "done" ? <CheckIcon strokeWidth={3} /> : status === "error" ? <CircleAlertIcon /> : i + 1}
            </span>
          )
          if (!rich) {
            return (
              <li key={step.key} data-status={status} aria-current={status === "current" ? "step" : undefined} className={cn("flex min-w-0 items-center gap-3", i < steps.length - 1 && "flex-1")}>
                {dot}
                <span className={cn("truncate text-role-label mobile:sr-only", status === "todo" ? "text-fg-muted" : status === "error" ? "text-danger" : "text-fg")}>
                  {step.label}
                  <span className="sr-only">，{statusLabels[status]}</span>
                </span>
                {i < steps.length - 1 ? <span aria-hidden className={cn("mx-2 h-focus flex-1 rounded-full", i < current ? "bg-primary" : "bg-border")} /> : null}
              </li>
            )
          }
          const body = (
            <>
              {dot}
              <span className="flex min-w-0 flex-col gap-1 text-left">
                <span className={cn("text-role-label", status === "todo" ? "text-fg-muted" : status === "error" ? "text-danger" : "text-fg")}>{step.label}</span>
                {step.description ? <span className="text-role-caption wrap-anywhere text-fg-muted">{step.description}</span> : null}
              </span>
              <span className="sr-only">，{statusLabels[status]}</span>
            </>
          )
          const itemClass = "-mx-3 flex w-full min-h-hit items-start gap-3 rounded-md px-3 py-2"
          return (
            <React.Fragment key={step.key}>
              <li data-status={status} aria-current={status === "current" ? "step" : undefined} className="min-w-0 flex-1">
                {onStepChange ? (
                  <button
                    type="button"
                    disabled={disabled || i > maxReached}
                    onClick={() => onStepChange(i)}
                    className={cn(itemClass, "transition-colors duration-(--motion-fast) ease-std hover:not-disabled:bg-surface-muted disabled:cursor-default")}
                  >
                    {body}
                  </button>
                ) : (
                  <div className={itemClass}>{body}</div>
                )}
              </li>
              {i < steps.length - 1 ? <li aria-hidden className={cn("mt-[calc(var(--space-2)+var(--size-step)/2)] h-hairline w-10 shrink-0", i < current ? "bg-primary" : "bg-border")} /> : null}
            </React.Fragment>
          )
        })}
      </ol>
      {compactLabel ? <p className="hidden text-role-caption text-fg-muted mobile:block">{compactLabel}</p> : null}
    </div>
  )
}

export { Stepper, type StepperProps, type StepStatus }
