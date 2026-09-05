import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Card, Classes, H3, HTMLTable, Menu, MenuItem, Popover, ProgressBar, Tab, Tabs, Tag } from "@blueprintjs/core"
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { icon } from "@/lib/icons"
import { withParams } from "@/lib/settings"
import { Avatar, PageHeader, SectionCard, StatusTag, money } from "@/pages/shared"

const BLUE = "#2d72d2"
const PALETTE = ["#2d72d2", "#238551", "#c87619", "#cd4246", "#7961db"]

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${36 - ((v - min) / (max - min || 1)) * 30 - 3}`).join(" ")
  return <svg className="sparkline" viewBox="0 0 100 36" preserveAspectRatio="none"><polyline fill="none" stroke={BLUE} strokeWidth={2} points={points} /></svg>
}

function formatValue(stat: (typeof stats)[number]) {
  if (stat.unit === "CNY") return money(stat.value)
  if (stat.unit === "%") return `${stat.value}%`
  return stat.value.toLocaleString("zh-CN")
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState("week")
  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), 700)
    return () => window.clearTimeout(id)
  }, [])
  const skeleton = loading ? Classes.SKELETON : ""
  const lineData = series.months.map((m, i) => ({ month: m, revenue: series.revenue[i], orders: series.orders[i] }))

  return (
    <>
      <PageHeader title="仪表盘" description="今日概览：收入、订单与团队动态。" action={
        <Tabs id="range" selectedTabId={range} onChange={(id) => setRange(String(id))} animate={false}>
          <Tab id="day" title="日" />
          <Tab id="week" title="周" />
          <Tab id="month" title="月" />
        </Tabs>
      } />
      <div className="grid">
        {stats.map((stat) => (
          <Card key={stat.key} className="stack-sm">
            <div className={`row-between ${skeleton}`}>
              <span className="muted">{stat.label}</span>
              <Tag minimal round intent={stat.delta >= 0 ? "success" : "danger"} icon={icon(stat.delta >= 0 ? "arrow-up" : "arrow-down", 12)}>{Math.abs(stat.delta)}%</Tag>
            </div>
            <div className={skeleton} style={{ fontSize: 24, fontWeight: 600 }}>{formatValue(stat)}</div>
            <div className={skeleton}><Sparkline data={stat.trend} /></div>
          </Card>
        ))}
      </div>
      <div className="grid-2">
        <SectionCard title="收入趋势" description="近 6 个月收入（千元）与订单量">
          <div className={skeleton} style={{ height: 260 }}>
            {loading ? null : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(95,107,124,0.3)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} width={36} />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="revenue" name="收入" stroke={BLUE} strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="orders" name="订单" stroke="#238551" strokeWidth={2} dot={false} yAxisId={0} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>
        <SectionCard title="渠道分布" description="按渠道的订单占比">
          <div className={`grid-2 ${skeleton}`} style={{ height: 260, gridTemplateColumns: "1fr 1fr" }}>
            {loading ? null : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={series.byChannel} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                      {series.byChannel.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={series.byChannel}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <ChartTooltip />
                    <Bar dataKey="value" name="占比" fill={BLUE} radius={[3, 3, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
        </SectionCard>
      </div>
      <div className="grid-2" style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)" }}>
        <SectionCard title="最近订单" description="最新 5 笔订单" action={<Button minimal rightIcon={icon("arrow-right")} onClick={() => navigate(withParams("/orders"))}>查看全部</Button>}>
          <div className="scroll-x">
            <HTMLTable interactive striped className={`fill ${skeleton}`}>
              <thead><tr><th>订单</th><th>客户</th><th>产品</th><th>状态</th><th className="text-right">金额</th><th /></tr></thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.id}</strong></td>
                    <td><span className="row" style={{ flexWrap: "nowrap" }}><Avatar name={o.customer} size="sm" /><span className="truncate">{o.customer}</span></span></td>
                    <td>{o.product}</td>
                    <td><StatusTag value={o.status} /></td>
                    <td className="text-right">{money(o.amount)}</td>
                    <td className="text-right">
                      <Popover content={<Menu><MenuItem icon={icon("eye")} text="查看" /><MenuItem icon={icon("edit")} text="编辑" /><MenuItem icon={icon("trash")} text="删除" intent="danger" /></Menu>} placement="bottom-end">
                        <Button minimal icon={icon("more-horizontal")} aria-label="操作" className="row-action" />
                      </Popover>
                    </td>
                  </tr>
                ))}
              </tbody>
            </HTMLTable>
          </div>
        </SectionCard>
        <div className="stack">
          <SectionCard title="团队动态">
            <ul className={`timeline ${skeleton}`}>
              {activity.map((a, i) => (
                <li key={i}><div><strong>{a.user}</strong> {a.action}</div><div className={`${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL}`}>{a.time}</div></li>
              ))}
            </ul>
          </SectionCard>
          <Card className="stack-sm">
            <H3 style={{ margin: 0 }}>任务进度</H3>
            {tasks.map((t) => (
              <div key={t.title} className={`stack-sm ${skeleton}`} style={{ gap: 4 }}>
                <div className="row-between"><span>{t.title}</span><span className={Classes.TEXT_MUTED}>{t.owner} · {t.progress}%</span></div>
                <ProgressBar value={t.progress / 100} intent={t.progress >= 80 ? "success" : "primary"} stripes={false} animate={false} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  )
}
