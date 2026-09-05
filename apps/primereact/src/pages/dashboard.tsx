import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Chart } from "primereact/chart"
import { Avatar } from "primereact/avatar"
import { Card } from "primereact/card"
import { ProgressBar } from "primereact/progressbar"
import { Skeleton } from "primereact/skeleton"
import { TabPanel, TabView } from "primereact/tabview"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Timeline } from "primereact/timeline"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { Button } from "primereact/button"
import { Tag } from "primereact/tag"
import { Icon } from "@/components/icon"
import { Metric, PageHeader, StatusTag } from "@/components/shared"

function readPalette() {
  const style = getComputedStyle(document.documentElement)
  const primary = style.getPropertyValue("--primary-color").trim()
  const value = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback
  return { ready: Boolean(primary), primary: primary || "#3B82F6", primary400: value("--primary-400", primary || "#3B82F6"), primary200: value("--primary-200", primary || "#3B82F6"), primary700: value("--primary-700", primary || "#3B82F6"), text: value("--text-color", "#334155"), textSecondary: value("--text-color-secondary", "#64748B"), surfaceBorder: value("--surface-border", "#CBD5E1"), surfaceCard: value("--surface-card", "#FFFFFF") }
}
function withAlpha(color: string) { return /^#[\da-f]{6}$/i.test(color) ? `${color}26` : color }
function usePalette() {
  const { search } = useLocation()
  const [palette, setPalette] = useState(readPalette)
  useEffect(() => {
    let frame = 0
    const refresh = () => { const next = readPalette(); setPalette(next); if (!next.ready && frame < 20) { frame += 1; requestAnimationFrame(refresh) } }
    const handle = () => { frame = 0; refresh() }
    window.addEventListener("pr-theme-change", handle); handle()
    return () => window.removeEventListener("pr-theme-change", handle)
  }, [search])
  return palette
}
export function DashboardPage() {
  const palette = usePalette()
  const chartData = { labels: series.months, datasets: [{ label: "收入", data: series.revenue, borderColor: palette.primary, backgroundColor: withAlpha(palette.primary), fill: true, tension: .35 }, { label: "订单", data: series.orders, borderColor: palette.primary700, fill: false, tension: .35 }] }
  const barData = { labels: series.months, datasets: [{ label: "订单", data: series.orders, backgroundColor: [palette.primary, palette.primary400, palette.primary200, palette.primary700] }] }
  const doughnut = { labels: series.byChannel.map((item) => item.name), datasets: [{ data: series.byChannel.map((item) => item.value), backgroundColor: [palette.primary, palette.primary400, palette.primary200, palette.primary700], borderColor: palette.surfaceCard }] }
  const options = { maintainAspectRatio: false, plugins: { legend: { labels: { color: palette.text } } }, scales: { x: { ticks: { color: palette.textSecondary }, grid: { color: palette.surfaceBorder } }, y: { ticks: { color: palette.textSecondary }, grid: { color: palette.surfaceBorder } } } }
  return <div className="flex flex-column gap-5"><PageHeader title="仪表盘" description="欢迎回来，林晓。这里是今天的业务概况。" action={<Button label="新建项目" icon={<Icon name="plus" />} />} /><div className="grid">{stats.map((item) => <div className="col-12 sm:col-6 xl:col-3" key={item.key}><Metric label={item.label} value={item.unit === "CNY" ? `¥${item.value.toLocaleString()}` : `${item.value}${item.unit ?? ""}`} delta={item.delta} /></div>)}</div><div className="grid"><div className="col-12 xl:col-8"><Card title="收入趋势" subTitle="过去 7 个月的收入与订单"><TabView><TabPanel header="趋势"><div style={{ height: 280 }}><Chart type="line" data={chartData} options={options} /></div></TabPanel><TabPanel header="订单"><div style={{ height: 280 }}><Chart type="bar" data={barData} options={options} /></div></TabPanel></TabView></Card></div><div className="col-12 xl:col-4"><Card title="渠道占比" subTitle="本月订单来源"><div style={{ height: 280 }}><Chart type="doughnut" data={doughnut} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: palette.text } } } }} /></div></Card></div></div><div className="grid"><div className="col-12 xl:col-7"><Card title="最近订单" subTitle="最新的业务交易"><DataTable value={orders.slice(0, 5)} size="small" responsiveLayout="scroll"><Column field="id" header="订单" /><Column field="customer" header="客户" body={(row) => <div className="flex align-items-center gap-2"><Avatar label={row.customer.slice(0, 1)} shape="circle" />{row.customer}</div>} /><Column field="status" header="状态" body={(row) => <StatusTag value={row.status} />} /><Column field="amount" header="金额" body={(row) => `¥${row.amount.toLocaleString()}`} /></DataTable></Card></div><div className="col-12 xl:col-5"><Card title="团队动态" subTitle="最近发生的事情"><Timeline value={activity} align="left" content={(item) => <div><strong>{item.user}</strong> {item.action}<small className="block muted mt-1">{item.time}</small></div>} marker={() => <Avatar icon="pi pi-user" shape="circle" />} /></Card></div></div><div className="grid"><div className="col-12 xl:col-7"><Card title="任务进度"><div className="flex flex-column gap-4">{tasks.map((task) => <div key={task.title}><div className="flex justify-content-between mb-2"><span>{task.title}</span><span className="muted">{task.progress}%</span></div><ProgressBar value={task.progress} /></div>)}</div></Card></div><div className="col-12 xl:col-5"><Card title="数据状态"><TabView><TabPanel header="日"><p className="muted">今日数据已同步。</p></TabPanel><TabPanel header="周"><p className="muted">本周收入较上周增长 12.4%。</p></TabPanel><TabPanel header="月"><div className="flex flex-column gap-2"><Skeleton /><Skeleton width="70%" /><Skeleton width="45%" /></div></TabPanel></TabView><Tag className="mt-3" severity="success" value="本地 mock JSON" /></Card></div></div></div>
}
