import * as React from "react"
import { cn } from "@/lib/cn"

import { Progress } from "@/components/ui/progress"

type TaskStatus = "in_progress" | "at_risk" | "done"

type TaskItemProps = React.ComponentProps<"div"> & {
  title: string
  status: TaskStatus
  percent: number
  /** 右上角元信息（负责人、截止） */
  meta?: React.ReactNode
  /** 进度条右侧 {done}/{total} */
  count: React.ReactNode
  ariaLabel: string
}

const toneOf: Record<TaskStatus, "primary" | "warning" | "success"> = { in_progress: "primary", at_risk: "warning", done: "success" }

/** 任务进度项：hifi .task —— 标题 / 元信息 / 进度条 + 计数；at_risk 转 warning、done 转 success */
function TaskItem({ title, status, percent, meta, count, ariaLabel, className, ...props }: TaskItemProps) {
  return (
    <div data-slot="task-item" data-status={status} className={cn("grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1", className)} {...props}>
      <span className="truncate text-role-label">{title}</span>
      <span className={cn("flex items-center gap-2 text-role-caption text-fg-muted", status === "at_risk" && "[&_[data-due]]:text-warning")}>{meta}</span>
      <div className="col-span-full grid grid-cols-[1fr_auto] items-center gap-3">
        <Progress value={percent} tone={toneOf[status]} aria-label={ariaLabel} />
        <span className="text-role-caption tabular-nums whitespace-nowrap text-fg-muted [&_b]:font-medium [&_b]:text-fg">{count}</span>
      </div>
    </div>
  )
}

export { TaskItem, type TaskItemProps, type TaskStatus }
