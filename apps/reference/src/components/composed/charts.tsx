import * as React from "react"
import { cn } from "@/lib/cn"
import { Area, Bar, CartesianGrid, Cell, ComposedChart, Pie, PieChart, ResponsiveContainer, Sector, Text, Tooltip, XAxis, YAxis } from "recharts"
import type { PieSectorShapeProps } from "recharts/types/polar/Pie"

import { tokenPx, tokenValue, useElementWidth } from "@/lib/media"

/**
 * 图表基座：Recharts + 令牌。所有颜色以 `var(--color-…)` 字串传入 SVG 属性（tokens.css 定义，随 data-theme 切换），
 * 尺寸类由 theme.css 的 spacing 别名给出（h-chart-trend / size-donut）。
 */
const color = {
  line: "var(--color-chart-line)",
  lineFill: "var(--color-chart-line-fill)",
  bar: "var(--color-chart-bar)",
  barIdle: "var(--color-role-neutral-soft)",
  grid: "var(--color-chart-grid)",
  axis: "var(--color-role-fg-muted)",
  cursor: "var(--color-role-border-strong)",
  surface: "var(--color-role-surface)",
  track: "var(--color-role-surface-muted)",
  series: ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"],
}

/** 图表提示框：hifi .chart-tip —— 反色底、caption、shadow.md */
function ChartTip({ title, rows }: { title?: React.ReactNode; rows: { label: React.ReactNode; value: React.ReactNode }[] }) {
  return (
    <div data-slot="chart-tip" role="status" className="rounded-sm bg-bg-inverse px-3 py-2 text-role-caption whitespace-nowrap text-fg-inverse shadow-md">
      {title ? <strong className="mb-1 block font-semibold">{title}</strong> : null}
      {rows.map((r, i) => (
        <span key={i} className="block">
          {r.label}：{r.value}
        </span>
      ))}
    </div>
  )
}

type TrendPoint = { label: string; gmv: number; orders: number }

type TrendChartProps = {
  data: TrendPoint[]
  labels: { gmv: string; orders: string }
  formatGmv: (n: number) => string
  formatOrders: (n: number) => string
  className?: string
  /** 可访问名（title） */
  title: string
  /** 可视双 Y 轴（hifi 仪表盘：左销售额、右订单数）；不传则隐藏轴、柱子压低到下半区 */
  axes?: { gmv: (n: number) => string; orders: (n: number) => string }
  /** 视觉隐藏摘要的 id（aria-describedby） */
  describedBy?: string
}

const axisTick = { fill: color.axis, className: "text-role-caption tabular-nums" }

/** 用 canvas 按 typography.caption 量字宽（X 轴标签防重叠） */
let captionCtx: CanvasRenderingContext2D | null | undefined
const captionWidth = (text: string) => {
  if (captionCtx === undefined) {
    captionCtx = document.createElement("canvas").getContext("2d")
    if (captionCtx) captionCtx.font = tokenValue("--typography-caption")
  }
  return captionCtx ? captionCtx.measureText(text).width : text.length * tokenPx("--space-2")
}

/** hifi niceStep：把 max/4 归到 1/1.5/2/2.5/3/4/5/6/8/10 × 10^k，四等分刻度 */
const niceStep = (raw: number) => {
  if (raw <= 0) return 1
  const mag = 10 ** Math.floor(Math.log10(raw))
  const f = raw / mag
  const n = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((k) => k >= f) ?? 10
  return n * mag
}
const axisScale = (values: number[]) => {
  const step = niceStep(Math.max(0, ...values) / 4)
  return { top: step * 4, ticks: [0, 1, 2, 3, 4].map((t) => step * t) }
}

/** hifi 图表几何令牌（mL/mR/mT/mB、柱宽上限、标签间距），运行时读 :root */
const useTrendGeometry = () =>
  React.useMemo(
    () => ({
      mL: tokenPx("--space-12"),
      mR: tokenPx("--space-10"),
      mT: tokenPx("--space-3"),
      mB: tokenPx("--space-6"),
      barMax: tokenPx("--space-6"),
      barRadius: tokenPx("--radius-xs") / 2,
      labelSlot: tokenPx("--size-sparkline") * 2,
      dotR: tokenPx("--space-1"),
    }),
    [],
  )

/**
 * 销售趋势：柱（订单数，neutral-soft，激活转 chart.bar）+ 面积折线（销售额，chart.line）。
 * 键盘：Recharts accessibilityLayer —— SVG 可聚焦，←/→ 逐点、Enter 切换；提示框 role=status 朗读。
 */
function TrendChart({ data, labels, formatGmv, formatOrders, className, title, axes, describedBy }: TrendChartProps) {
  const [active, setActive] = React.useState<number | null>(null)
  const [wrapRef, width] = useElementWidth<HTMLDivElement>()
  const geo = useTrendGeometry()
  const n = data.length
  const gmv = React.useMemo(() => axisScale(data.map((p) => p.gmv)), [data])
  const orders = React.useMemo(() => axisScale(data.map((p) => p.orders)), [data])
  /* hifi：按内宽每 2×sparkline 放一个标签，末点必留（标签多于容量时末点右对齐）；再从右向左去掉与已留标签间距 < space.2 的 */
  const { xTicks, endAnchorLast } = React.useMemo(() => {
    const mL = axes ? geo.mL : 0
    const iw = Math.max(0, width - (axes ? geo.mL + geo.mR : 0))
    const maxLabels = Math.max(2, Math.floor(iw / geo.labelSlot))
    const every = Math.ceil((n - 1) / (maxLabels - 1))
    const endAnchorLast = n > maxLabels
    const step = n ? iw / n : 0
    const x = (i: number) => mL + step * (i + 0.5)
    const gap = tokenPx("--space-2")
    const kept: string[] = []
    let keptLeft = Infinity
    for (let i = n - 1; i >= 0; i--) {
      const last = i === n - 1
      if (!last && !(i % every === 0 && n - 1 - i >= every / 2)) continue
      const w = captionWidth(data[i].label)
      const left = last && endAnchorLast ? x(i) - w : x(i) - w / 2
      if (left + w + gap > keptLeft) continue
      keptLeft = left
      kept.unshift(data[i].label)
    }
    return { xTicks: kept, endAnchorLast }
  }, [data, n, width, axes, geo])
  const lastLabel = data[n - 1]?.label
  const xTick = React.useCallback(
    ({ payload, textAnchor, ...p }: React.ComponentProps<typeof Text> & { payload: { value: string } }) => (
      <Text {...p} {...axisTick} textAnchor={endAnchorLast && payload.value === lastLabel ? "end" : textAnchor}>
        {payload.value}
      </Text>
    ),
    [endAnchorLast, lastLabel],
  )
  return (
    <div ref={wrapRef} data-slot="trend-chart" className={cn("relative min-h-chart-trend w-full min-w-0 flex-1 mobile:min-h-chart-trend-mobile", className)}>
      <ResponsiveContainer width="100%" height="100%" className="absolute inset-0">
        <ComposedChart
          data={data}
          role="img"
          title={title}
          aria-describedby={describedBy}
          aria-keyshortcuts="ArrowLeft ArrowRight"
          className="[&_svg]:overflow-visible [&_svg]:rounded-sm"
          margin={{ top: geo.mT, right: 0, bottom: 0, left: 0 }}
          barCategoryGap="25%"
          onMouseMove={(s) => setActive(typeof s.activeTooltipIndex === "number" ? s.activeTooltipIndex : null)}
          onMouseLeave={() => setActive(null)}
        >
          <CartesianGrid vertical={false} stroke={color.grid} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={xTick} ticks={xTicks} interval={0} height={geo.mB} />
          {axes ? (
            <>
              <YAxis yAxisId="gmv" orientation="left" width={geo.mL} domain={[0, gmv.top]} ticks={gmv.ticks} tickLine={false} axisLine={false} tick={axisTick} tickFormatter={axes.gmv} />
              <YAxis yAxisId="orders" orientation="right" width={geo.mR} domain={[0, orders.top]} ticks={orders.ticks} tickLine={false} axisLine={false} tick={axisTick} tickFormatter={axes.orders} />
            </>
          ) : (
            <>
              <YAxis yAxisId="gmv" hide domain={[0, "dataMax"]} />
              <YAxis yAxisId="orders" hide domain={[0, (max: number) => max * 2.5]} />
            </>
          )}
          <Tooltip
            cursor={{ stroke: color.cursor, strokeDasharray: "3 3" }}
            content={({ active: isActive, payload }) => {
              const p = payload?.[0]?.payload as TrendPoint | undefined
              if (!isActive || !p) return null
              return (
                <ChartTip
                  title={p.label}
                  rows={[
                    { label: labels.gmv, value: formatGmv(p.gmv) },
                    { label: labels.orders, value: formatOrders(p.orders) },
                  ]}
                />
              )
            }}
          />
          <Bar yAxisId="orders" dataKey="orders" radius={[geo.barRadius, geo.barRadius, 0, 0]} isAnimationActive={false} maxBarSize={geo.barMax}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === active ? color.bar : color.barIdle} />
            ))}
          </Bar>
          <Area
            yAxisId="gmv"
            type="linear"
            dataKey="gmv"
            stroke={color.line}
            strokeWidth={2}
            fill={color.lineFill}
            isAnimationActive={false}
            activeDot={{ r: geo.dotR, fill: color.line, stroke: color.surface, strokeWidth: 2 }}
            dot={({ cx, cy, index }) =>
              index === n - 1 && active === null ? <circle key="last" cx={cx} cy={cy} r={geo.dotR} fill={color.line} stroke={color.surface} strokeWidth={2} /> : <g key={index} />
            }
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

type DonutItem = { key: string; label: string; value: number; share: number }

type DonutChartProps = {
  items: DonutItem[]
  total: React.ReactNode
  totalLabel: string
  formatValue: (n: number) => string
  formatShare: (n: number) => string
  className?: string
  title: string
}

/** 渠道占比：环形图 + 图例列表（hifi .donut / .donut-legend），颜色 chart.1–5 */
function DonutChart({ items, total, totalLabel, formatValue, formatShare, className, title }: DonutChartProps) {
  const [active, setActive] = React.useState<number | null>(null)
  return (
    <div data-slot="donut-chart" className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative size-donut shrink-0" role="img" aria-label={title}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* hifi：r=40 / stroke 12 于 viewBox 100 → 内 68% 外 92%；从 12 点起顺时针；底轨 surface-muted；激活段 stroke 14 */}
            <Pie data={[{ value: 1 }]} dataKey="value" innerRadius="68%" outerRadius="92%" startAngle={90} endAngle={-270} fill={color.track} stroke="none" isAnimationActive={false} />
            <Pie
              data={items}
              dataKey="value"
              nameKey="label"
              innerRadius="68%"
              outerRadius="92%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={0}
              stroke="none"
              isAnimationActive={false}
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
              shape={(p: PieSectorShapeProps, i: number) =>
                i === active ? <Sector {...p} innerRadius={p.innerRadius * (66 / 68)} outerRadius={p.outerRadius * (94 / 92)} /> : <Sector {...p} />
              }
            >
              {items.map((it, i) => (
                <Cell key={it.key} fill={color.series[i % color.series.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
          <span className="text-role-caption text-fg-muted">{totalLabel}</span>
          <strong className="text-role-title tabular-nums">{total}</strong>
        </div>
      </div>
      <ul className="m-0 flex w-full list-none flex-col p-0">
        {items.map((it, i) => (
          <li
            key={it.key}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={cn(
              "grid min-h-control-sm grid-cols-[calc(var(--space-1)*3)_1fr_auto_auto] items-center gap-3 rounded-sm px-2 transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted",
              active === i && "bg-surface-muted",
            )}
          >
            <i aria-hidden className="size-3 rounded-xs" style={{ background: color.series[i % color.series.length] }} />
            <span className="truncate text-fg">{it.label}</span>
            <span className="text-role-caption tabular-nums text-fg-muted">{formatValue(it.value)}</span>
            <span className="min-w-12 text-right text-role-label tabular-nums">{formatShare(it.share)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { TrendChart, DonutChart, ChartTip, color as chartColor, type TrendPoint, type DonutItem }
