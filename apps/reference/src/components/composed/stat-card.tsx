import * as React from "react"
import { cn } from "@/lib/cn"
import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type DeltaTone = "success" | "danger" | "neutral"

/** 同比胶囊：hifi .delta */
function Delta({ tone, direction, children, className }: { tone: DeltaTone; direction: "up" | "down" | "flat"; children: React.ReactNode; className?: string }) {
  const Icon = direction === "up" ? TrendingUpIcon : direction === "down" ? TrendingDownIcon : MinusIcon
  return (
    <span
      data-slot="delta"
      data-tone={tone}
      className={cn(
        "inline-flex h-6 items-center gap-1 self-start rounded-full px-2 text-role-caption font-medium",
        tone === "success" && "bg-success-soft text-success",
        tone === "danger" && "bg-danger-soft text-danger",
        tone === "neutral" && "bg-neutral-soft text-on-neutral-soft",
        className,
      )}
    >
      <Icon aria-hidden className="size-icon-sm" />
      {children}
    </span>
  )
}

/** 迷你趋势线：hifi .sparkline —— 令牌 chart.line / chart.line-fill，末点实心 */
function Sparkline({ points, className }: { points: number[]; className?: string }) {
  const w = 80
  const h = 32
  const pad = 2
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1
  const xy = points.map((v, i) => [pad + (i * (w - pad * 2)) / (points.length - 1), pad + (1 - (v - min) / span) * (h - pad * 2)] as const)
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")
  const area = `${line} L${xy[xy.length - 1][0].toFixed(1)} ${h} L${xy[0][0].toFixed(1)} ${h} Z`
  const [lx, ly] = xy[xy.length - 1]
  return (
    <svg aria-hidden viewBox={`0 0 ${w} ${h}`} className={cn("-mt-1 h-sparkline w-sparkline-w shrink-0 overflow-visible mobile:w-[calc(var(--size-sparkline)*1.5)]", className)}>
      <path d={area} className="fill-chart-line-fill" />
      <path d={line} className="fill-none stroke-chart-line" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="2.5" className="fill-chart-line" />
    </svg>
  )
}

type StatCardProps = React.ComponentProps<typeof Card> & {
  label: string
  value: string
  unit?: string
  delta?: { tone: DeltaTone; direction: "up" | "down" | "flat"; text: string }
  trend?: number[]
  /** 值较长（如 ¥1,234,567.00）时降级为 heading 字号并允许换行 */
  long?: boolean
}

/** 统计卡：hifi .stat —— label / 大数字 + 单位 / 同比胶囊 / 迷你趋势 */
function StatCard({ label, value, unit, delta, trend, long, className, ...props }: StatCardProps) {
  return (
    <Card data-slot="stat-card" className={cn("flex flex-col gap-3 px-6 py-5 mobile:gap-2 mobile:p-4", className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0 pt-1 text-role-label text-fg-muted [overflow-wrap:anywhere]">{label}</span>
        {trend ? <Sparkline points={trend} /> : null}
      </div>
      <div className="flex min-h-sparkline items-start justify-between gap-3 mobile:min-h-0">
        <div className="-mt-2 flex min-w-0 items-baseline gap-1 mobile:mt-0">
          <strong className={cn("min-w-0 tabular-nums", long ? "text-role-heading mobile:text-role-title" : "text-role-display whitespace-nowrap mobile:text-role-heading")}>{value}</strong>
          {unit ? <span className="text-role-caption text-fg-muted">{unit}</span> : null}
        </div>
      </div>
      {delta ? (
        <Delta tone={delta.tone} direction={delta.direction}>
          {delta.text}
        </Delta>
      ) : null}
    </Card>
  )
}

/** 统计卡骨架（与成功态同布局） */
function StatCardSkeleton({ className, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card aria-hidden className={cn("flex flex-col gap-3 px-6 py-5", className)} {...props}>
      <Skeleton className="h-4 w-2/5" />
      <div className="flex min-h-sparkline items-start justify-between gap-3">
        <Skeleton className="h-8 w-3/5" />
        <Skeleton className="h-sparkline w-sparkline-w" />
      </div>
      <Skeleton className="h-6 w-1/4 rounded-full" />
    </Card>
  )
}

export { StatCard, StatCardSkeleton, Delta, Sparkline, type StatCardProps, type DeltaTone }
