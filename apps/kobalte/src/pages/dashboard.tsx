import { createSignal, For, onCleanup, onMount, Show } from "solid-js"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { Icon } from "@/icons"
import { Avatar } from "@/ui/avatar"
import { Badge } from "@/ui/badge"
import { Button } from "@/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"
import { ChartCanvas } from "@/ui/chart"
import { Progress } from "@/ui/progress"
import { Skeleton } from "@/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import { Tabs } from "@/ui/tabs"
import { PageHeader, StatusBadge } from "./shared"

const money = (value: number) => `¥${value.toLocaleString()}`

function sparkline(values: number[]) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  return values.map((value, index) => `${(index / (values.length - 1)) * 100},${40 - ((value - min) / Math.max(1, max - min)) * 34}`).join(" ")
}

function Sparkline(props: { values: number[] }) {
  return <svg viewBox="0 0 100 40" class="h-12 w-full text-blue-600" aria-hidden="true"><polyline points={sparkline(props.values)} fill="none" stroke="currentColor" stroke-width="2" /></svg>
}

export function DashboardPage() {
  const [ready, setReady] = createSignal(false)
  onMount(() => {
    if (new URLSearchParams(window.location.search).get("state") === "loading") return
    const timer = window.setTimeout(() => setReady(true), 600)
    onCleanup(() => window.clearTimeout(timer))
  })
  const lineConfig = { type: "line" as const, data: { labels: series.months, datasets: [{ label: "收入", data: series.revenue, borderColor: "#2563eb", backgroundColor: "#2563eb22", fill: true }, { label: "订单", data: series.orders, borderColor: "#10b981", backgroundColor: "#10b98122", fill: true }] }, options: { responsive: true, maintainAspectRatio: false } }
  const barConfig = { type: "bar" as const, data: { labels: series.months, datasets: [{ label: "订单", data: series.orders, backgroundColor: "#2563eb" }] }, options: { responsive: true, maintainAspectRatio: false } }
  const doughnutConfig = { type: "doughnut" as const, data: { labels: series.byChannel.map((item) => item.name), datasets: [{ data: series.byChannel.map((item) => item.value), backgroundColor: ["#2563eb", "#10b981", "#f59e0b", "#71717a"] }] }, options: { responsive: true, maintainAspectRatio: false } }
  return <div class="space-y-6">
    <PageHeader title="仪表盘" description="欢迎回来，林晓。这里是今天的业务概况。" action={<Button><Icon name="plus" />新建项目</Button>} />
    <Show when={ready()} fallback={<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><For each={[1, 2, 3, 4]}>{() => <Card><CardHeader><Skeleton class="h-4 w-24" /><Skeleton class="h-8 w-32" /></CardHeader><CardContent><Skeleton class="h-12 w-full" /></CardContent></Card>}</For></div>}>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><For each={stats}>{(item) => <Card><CardHeader class="pb-2"><div class="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400"><CardDescription>{item.label}</CardDescription><Badge variant={item.delta > 0 ? "default" : "destructive"}>{item.delta > 0 ? "↑" : "↓"} {Math.abs(item.delta)}%</Badge></div><CardTitle class="text-2xl">{item.unit === "CNY" ? money(item.value) : `${item.value}${item.unit ?? ""}`}</CardTitle></CardHeader><CardContent><Sparkline values={item.trend} /></CardContent></Card>}</For></div>
      <Tabs.Root defaultValue="month"><Tabs.List class="flex w-fit gap-1 rounded-md bg-zinc-100 p-1 dark:bg-zinc-800"><Tabs.Trigger value="day" class="h-10 min-w-10 rounded px-3 text-sm data-[selected]:bg-white dark:data-[selected]:bg-zinc-700">日</Tabs.Trigger><Tabs.Trigger value="week" class="h-10 min-w-10 rounded px-3 text-sm data-[selected]:bg-white dark:data-[selected]:bg-zinc-700">周</Tabs.Trigger><Tabs.Trigger value="month" class="h-10 min-w-10 rounded px-3 text-sm data-[selected]:bg-white dark:data-[selected]:bg-zinc-700">月</Tabs.Trigger></Tabs.List></Tabs.Root>
      <div class="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"><Card><CardHeader><CardTitle>收入趋势</CardTitle><CardDescription>过去 7 个月的收入与订单</CardDescription></CardHeader><CardContent><div class="h-64"><ChartCanvas config={lineConfig} /></div></CardContent></Card><Card><CardHeader><CardTitle>订单渠道</CardTitle><CardDescription>不同渠道的订单分布</CardDescription></CardHeader><CardContent><div class="h-64"><ChartCanvas config={doughnutConfig} /></div></CardContent></Card></div>
      <div class="grid gap-4 xl:grid-cols-3"><Card><CardHeader><CardTitle>订单趋势</CardTitle></CardHeader><CardContent><div class="h-56"><ChartCanvas config={barConfig} /></div></CardContent></Card><Card class="xl:col-span-2"><CardHeader><CardTitle>最近订单</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>订单</TableHead><TableHead>客户</TableHead><TableHead>产品</TableHead><TableHead>状态</TableHead><TableHead class="text-right">金额</TableHead></TableRow></TableHeader><TableBody><For each={orders.slice(0, 5)}>{(order) => <TableRow><TableCell>{order.id}</TableCell><TableCell><div class="flex items-center gap-2"><Avatar name={order.customer} />{order.customer}</div></TableCell><TableCell>{order.product}</TableCell><TableCell><StatusBadge value={order.status} /></TableCell><TableCell class="text-right tabular-nums">{money(order.amount)}</TableCell></TableRow>}</For></TableBody></Table></CardContent></Card></div>
      <div class="grid gap-4 xl:grid-cols-2"><Card><CardHeader><CardTitle>团队动态</CardTitle></CardHeader><CardContent class="grid gap-4"><For each={activity}>{(item) => <div class="flex gap-3"><Avatar name={item.user} /><div class="min-w-0 flex-1 text-sm"><p><strong>{item.user}</strong> {item.action}</p><p class="text-xs text-zinc-500 dark:text-zinc-400">{item.time}</p></div></div>}</For></CardContent></Card><Card><CardHeader><CardTitle>任务进度</CardTitle></CardHeader><CardContent class="grid gap-5"><For each={tasks}>{(task) => <Progress value={task.progress} label={task.title} />}</For></CardContent></Card></div>
    </Show>
  </div>
}
