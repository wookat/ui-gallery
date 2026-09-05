import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Icon } from "@ui-gallery/icons-react"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader, StatusBadge } from "./shared"

const chartConfig = { revenue: { label: "收入", color: "var(--color-chart-1)" }, orders: { label: "订单", color: "var(--color-chart-2)" } } satisfies ChartConfig

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="仪表盘" description="欢迎回来，林晓。这里是今天的业务概况。" action={<Button><Icon name="plus" />新建项目</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => <Card key={item.key}><CardHeader className="pb-2"><div className="flex items-center justify-between text-sm text-muted-foreground"><CardDescription>{item.label}</CardDescription><Badge variant={item.delta > 0 ? "default" : "secondary"}>{item.delta > 0 ? "+" : ""}{item.delta}%</Badge></div><CardTitle className="text-2xl">{item.unit === "CNY" ? `¥${item.value.toLocaleString()}` : `${item.value}${item.unit ?? ""}`}</CardTitle></CardHeader><CardContent><div className="h-12"><ResponsiveContainer width="100%" height="100%"><AreaChart data={item.trend.map((value, index) => ({ value, index }))}><Area dataKey="value" stroke="currentColor" fill="currentColor" fillOpacity={0.12} /></AreaChart></ResponsiveContainer></div></CardContent></Card>)}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <Card><CardHeader><CardTitle>收入趋势</CardTitle><CardDescription>过去 7 个月的收入与订单</CardDescription></CardHeader><CardContent><ChartContainer config={chartConfig} className="h-72 w-full"><AreaChart data={series.months.map((month, index) => ({ month, revenue: series.revenue[index], orders: series.orders[index] }))}><CartesianGrid vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip content={<ChartTooltipContent />} /><Area dataKey="revenue" type="monotone" fill="var(--color-revenue)" fillOpacity={0.2} stroke="var(--color-revenue)" /><Area dataKey="orders" type="monotone" fill="var(--color-orders)" fillOpacity={0.1} stroke="var(--color-orders)" /></AreaChart></ChartContainer></CardContent></Card>
        <Card><CardHeader><CardTitle>任务进度</CardTitle><CardDescription>本周团队执行情况</CardDescription></CardHeader><CardContent className="space-y-5">{tasks.slice(0, 4).map((task) => <div key={task.title} className="space-y-2"><div className="flex justify-between text-sm"><span>{task.title}</span><span className="text-muted-foreground">{task.progress}%</span></div><Progress value={task.progress} /></div>)}</CardContent></Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card><CardHeader><CardTitle>最近订单</CardTitle><CardDescription>最新的业务交易</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>订单</TableHead><TableHead>客户</TableHead><TableHead>状态</TableHead><TableHead className="text-right">金额</TableHead></TableRow></TableHeader><TableBody>{orders.slice(0, 5).map((order) => <TableRow key={order.id}><TableCell className="font-medium">{order.id}</TableCell><TableCell>{order.customer}</TableCell><TableCell><StatusBadge value={order.status} /></TableCell><TableCell className="text-right">¥{order.amount.toLocaleString()}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        <Card><CardHeader><CardTitle>活动动态</CardTitle><CardDescription>团队最近发生的事情</CardDescription></CardHeader><CardContent><ScrollArea className="h-64 pr-4"><div className="space-y-5">{activity.map((item, index) => <div className="flex gap-3" key={`${item.user}-${index}`}><Avatar className="size-8"><AvatarFallback>{item.user.slice(0, 1)}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="text-sm"><span className="font-medium">{item.user}</span> {item.action}</p><p className="text-xs text-muted-foreground">{item.time}</p></div></div>)}</div></ScrollArea></CardContent></Card>
      </div>
      <Tabs defaultValue="overview"><TabsList><TabsTrigger value="overview">概览</TabsTrigger><TabsTrigger value="loading">加载状态</TabsTrigger></TabsList><TabsContent value="overview"><Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">数据已从本地 mock JSON 加载。</p></CardContent></Card></TabsContent><TabsContent value="loading"><Card><CardContent className="space-y-3 pt-6"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/2" /></CardContent></Card></TabsContent></Tabs>
    </div>
  )
}
