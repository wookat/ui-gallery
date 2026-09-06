import * as React from "react"
import { cn } from "cn"
import { Area, Bar, CartesianGrid, Cell, ComposedChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

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
    <div data-slot="chart-tip" className="rounded-sm bg-bg-inverse px-3 py-2 text-role-caption whitespace-nowrap text-fg-inverse shadow-md">
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
}

/** 销售趋势：柱（订单数，neutral-soft，激活转 chart.bar）+ 面积折线（销售额，chart.line） */
function TrendChart({ data, labels, formatGmv, formatOrders, className, title }: TrendChartProps) {
  const [active, setActive] = React.useState<number | null>(null)
  return (
    <div data-slot="trend-chart" className={cn("relative h-chart-trend w-full min-w-0 md:h-chart-trend max-md:h-chart-trend-mobile", className)} role="img" aria-label={title}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
          onMouseMove={(s) => setActive(typeof s.activeTooltipIndex === "number" ? s.activeTooltipIndex : null)}
          onMouseLeave={() => setActive(null)}
        >
          <CartesianGrid vertical={false} stroke={color.grid} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: color.axis, className: "text-role-caption tabular-nums" }} interval="preserveStartEnd" minTickGap={24} />
          <YAxis yAxisId="gmv" hide domain={[0, "dataMax"]} />
          <YAxis yAxisId="orders" hide domain={[0, (max: number) => max * 2.5]} />
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
          <Bar yAxisId="orders" dataKey="orders" radius={[2, 2, 0, 0]} isAnimationActive={false} maxBarSize={24}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === active ? color.bar : color.barIdle} />
            ))}
          </Bar>
          <Area
            yAxisId="gmv"
            type="monotone"
            dataKey="gmv"
            stroke={color.line}
            strokeWidth={2}
            fill={color.lineFill}
            isAnimationActive={false}
            activeDot={{ r: 4, fill: color.line, stroke: color.surface, strokeWidth: 2 }}
            dot={false}
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
            <Pie
              data={items}
              dataKey="value"
              nameKey="label"
              innerRadius="76%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {items.map((it, i) => (
                <Cell key={it.key} fill={color.series[i % color.series.length]} opacity={active === null || active === i ? 1 : 0.55} />
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
