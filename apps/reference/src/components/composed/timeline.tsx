import * as React from "react"
import { cn } from "@/lib/cn"
import { RefreshCwIcon } from "lucide-react"

import { Avatar } from "@/components/composed/avatar"
import { Skeleton } from "@/components/ui/skeleton"

function Timeline({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="timeline" className={cn("m-0 flex list-none flex-col p-0", className)} {...props} />
}

type TimelineItemProps = React.ComponentProps<"li"> & {
  actor: { initial: string; hue?: number; name: string; system?: boolean }
  time: string
  detail?: string
}

/** 时间线项：hifi .timeline li —— avatar.sm（系统动作为 neutral-soft + refresh-cw 图标）+ 文本 + 右侧时间，节点间 hairline 竖线 */
function TimelineItem({ actor, time, detail, className, children, ...props }: TimelineItemProps) {
  return (
    <li
      data-slot="timeline-item"
      className={cn(
        "relative grid grid-cols-[var(--size-avatar-sm)_1fr_auto] gap-3 pb-4 last:pb-0 before:absolute before:top-avatar-sm before:bottom-0 before:left-[calc(var(--size-avatar-sm)/2)] before:border-l before:content-[''] last:before:hidden",
        className,
      )}
      {...props}
    >
      {actor.system ? (
        <span aria-hidden className="inline-flex size-avatar-sm shrink-0 items-center justify-center rounded-full bg-neutral-soft text-on-neutral-soft">
          <RefreshCwIcon className="size-icon-sm" />
        </span>
      ) : (
        <Avatar size="sm" initial={actor.initial} hue={actor.hue} name={actor.name} />
      )}
      <div className="min-w-0">
        <p className="text-fg [overflow-wrap:anywhere]">{children}</p>
        {detail ? <span className="mt-1 block text-role-caption text-fg-muted">{detail}</span> : null}
      </div>
      <time className="pt-1 text-role-caption tabular-nums text-fg-muted">{time}</time>
    </li>
  )
}

function TimelineSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div aria-hidden className="flex flex-col gap-4">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="grid grid-cols-[var(--size-avatar-sm)_1fr_auto] items-center gap-3">
          <Skeleton className="size-avatar-sm rounded-full" />
          <Skeleton className={cn("h-3", i % 2 ? "w-3/5" : "w-4/5")} />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  )
}

export { Timeline, TimelineItem, TimelineSkeleton }
