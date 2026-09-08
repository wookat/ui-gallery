import * as React from "react"
import { cn } from "@/lib/cn"
import { CheckIcon, XIcon } from "lucide-react"

type StepStatus = "done" | "current" | "todo" | "error"

type StepperProps = React.ComponentProps<"ol"> & {
  /** description：步名下方 caption 行（hifi .step-text span；供应商名 / 时间 / 错误原因） */
  steps: readonly { key: string; label: string; description?: string }[]
  current: number
  /** 各状态的视觉隐藏文字（content form.stepper.status.*） */
  statusLabels: Record<StepStatus, string>
  /** ≤768 折叠为「第 n 步，共 N 步」文字（content form.stepper.step） */
  compactLabel?: string
  errorAt?: number
  /** vertical：hifi .stepper.vertical —— 纵向堆叠、连接线竖向，标签不折叠 */
  orientation?: "horizontal" | "vertical"
}

/**
 * 步骤条：hifi .stepper / .step / .step-dot / .step-line —— size.step 圆点（done primary 实底 + 勾、current primary 描边、todo border、error danger-soft）、
 * 连接线 border-width.focus 粗（已完成段 primary）；horizontal ≤768 隐藏标签、只显示点与 compactLabel。
 */
function Stepper({ steps, current, statusLabels, compactLabel, errorAt, orientation = "horizontal", className, ...props }: StepperProps) {
  const vertical = orientation === "vertical"
  const statusOf = (i: number): StepStatus => (i === errorAt ? "error" : i < current ? "done" : i === current ? "current" : "todo")
  return (
    <div data-slot="stepper" data-orientation={orientation} className={cn("flex w-full flex-col gap-2", className)}>
      <ol className={cn("flex w-full", vertical ? "flex-col items-stretch gap-2" : "items-center")} {...props}>
        {steps.map((step, i) => {
          const status = statusOf(i)
          const last = i === steps.length - 1
          return (
            <li key={step.key} data-status={status} aria-current={status === "current" ? "step" : undefined} className={cn("flex min-w-0", vertical ? "flex-col" : "items-center gap-3", !vertical && !last && "flex-1")}>
              <span className={cn("flex min-w-0 items-center gap-3", vertical && "items-start")}>
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
                  {status === "done" ? <CheckIcon strokeWidth={3} /> : status === "error" && vertical ? <XIcon strokeWidth={3} /> : i + 1}
                </span>
                <span className={cn("flex min-w-0 flex-col", !vertical && "mobile:sr-only")}>
                  <span className={cn("truncate text-role-label", status === "todo" ? "text-fg-muted" : status === "error" ? "text-danger" : "text-fg")}>
                    {step.label}
                    <span className="sr-only">，{statusLabels[status]}</span>
                  </span>
                  {step.description ? <span className="truncate text-role-caption text-fg-muted">{step.description}</span> : null}
                </span>
              </span>
              {!last ? (
                <span
                  aria-hidden
                  className={cn("rounded-full", vertical ? "my-2 ml-[calc(var(--size-step)/2-var(--border-width-focus)/2)] h-6 w-focus" : "mx-2 h-focus flex-1", i < current ? "bg-primary" : "bg-border")}
                />
              ) : null}
            </li>
          )
        })}
      </ol>
      {compactLabel && !vertical ? <p className="hidden text-role-caption text-fg-muted mobile:block">{compactLabel}</p> : null}
    </div>
  )
}

export { Stepper, type StepperProps, type StepStatus }
