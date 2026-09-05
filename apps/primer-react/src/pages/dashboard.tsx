import { useState } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Avatar, Button, Heading, Label, ProgressBar, SegmentedControl, SkeletonBox, Text } from "@primer/react"
import { Table } from "@primer/react/experimental"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { Icon, iconFor } from "@/lib/icon"
import { avatarSrc } from "@/lib/avatar"
import { PageHeader, SectionCard, StatusBadge } from "./shared"

export function DashboardPage() {
  const [view, setView] = useState<"overview" | "loading">("overview")
  return (
    <div className="page-stack">
      <PageHeader title="仪表盘" description="欢迎回来，林晓。这里是今天的业务概况。" action={<Button leadingVisual={iconFor("plus")}>新建项目</Button>} />
      <SegmentedControl aria-label="仪表盘视图" onChange={(index) => setView(index === 0 ? "overview" : "loading")}>
        <SegmentedControl.Button selected={view === "overview"}>概览</SegmentedControl.Button>
        <SegmentedControl.Button selected={view === "loading"}>加载状态</SegmentedControl.Button>
      </SegmentedControl>
      {view === "loading" ? <SectionCard title="加载状态" description="Skeleton 和空状态示例"><div className="stack-3"><SkeletonBox height={24} /><SkeletonBox height={24} width="75%" /><SkeletonBox height={24} width="50%" /></div></SectionCard> : null}
      {view === "overview" ? <><div className="grid grid-4">
        {stats.map((item) => (
          <section className="card" key={item.key}>
            <div className="flex items-center justify-between gap-2"><Text className="muted">{item.label}</Text><Label>{`${item.delta > 0 ? "+" : ""}${item.delta}%`}</Label></div>
            <Heading as="h2" style={{ fontSize: 24, marginTop: 8 }}>{item.unit === "CNY" ? `¥${item.value.toLocaleString()}` : `${item.value}${item.unit ?? ""}`}</Heading>
            <div className="chart" style={{ height: 56 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={item.trend.map((value, index) => ({ value, index }))}><Area dataKey="value" stroke="var(--fgColor-accent)" fill="var(--bgColor-accent-muted)" /></AreaChart></ResponsiveContainer></div>
          </section>
        ))}
      </div>
      <div className="split">
        <SectionCard title="收入趋势" description="过去 7 个月的收入与订单">
          <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={series.months.map((month, index) => ({ month, revenue: series.revenue[index], orders: series.orders[index] }))}><CartesianGrid stroke="var(--borderColor-muted)" vertical={false} /><XAxis dataKey="month" stroke="var(--fgColor-muted)" /><YAxis stroke="var(--fgColor-muted)" /><Tooltip /><Area dataKey="revenue" type="monotone" fill="var(--bgColor-accent-muted)" stroke="var(--fgColor-accent)" /><Area dataKey="orders" type="monotone" fill="var(--bgColor-success-muted)" stroke="var(--fgColor-success)" /></AreaChart></ResponsiveContainer></div>
        </SectionCard>
        <SectionCard title="任务进度" description="本周团队执行情况">
          <div className="stack-4">{tasks.slice(0, 4).map((task) => <div key={task.title}><div className="flex justify-between"><Text>{task.title}</Text><Text className="muted">{task.progress}%</Text></div><ProgressBar progress={task.progress} aria-label={`${task.title}进度`} /></div>)}</div>
        </SectionCard>
      </div>
      <div className="grid grid-2">
        <SectionCard title="最近订单" description="最新的业务交易">
          <div className="table-scroll"><Table gridTemplateColumns="minmax(max-content, 1fr) minmax(120px, 1fr) auto auto"><Table.Head><Table.Row><Table.Header>订单</Table.Header><Table.Header>客户</Table.Header><Table.Header>状态</Table.Header><Table.Header align="end">金额</Table.Header></Table.Row></Table.Head><Table.Body>{orders.slice(0, 5).map((order) => <Table.Row key={order.id}><Table.Cell scope="row">{order.id}</Table.Cell><Table.Cell>{order.customer}</Table.Cell><Table.Cell><StatusBadge value={order.status} /></Table.Cell><Table.Cell align="end">¥{order.amount.toLocaleString()}</Table.Cell></Table.Row>)}</Table.Body></Table></div>
          </SectionCard>
        <SectionCard title="活动动态" description="团队最近发生的事情">
          <div className="stack-4">{activity.map((item, index) => <div className="flex items-center gap-3" key={`${item.user}-${index}`}><Avatar src={avatarSrc} alt={item.user} size={32} /><div><Text><strong>{item.user}</strong> {item.action}</Text><Text as="p" className="muted" style={{ margin: 0, fontSize: 12 }}>{item.time}</Text></div></div>)}</div>
        </SectionCard>
      </div>
      <SectionCard title="数据状态"><div className="flex items-center gap-3"><Icon name="check" /><Text>数据已从本地 mock JSON 加载。</Text></div><div className="stack-3" style={{ marginTop: 16 }}><SkeletonBox height={8} width="33%" /><SkeletonBox height={8} width="66%" /></div></SectionCard></> : null}
    </div>
  )
}
