import { useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts"
import { ActionList, ActionMenu, Avatar, Button, Heading, IconButton, Label, ProgressBar, SegmentedControl, SkeletonBox, Text, Timeline, UnderlineNav } from "@primer/react"
import { Table, SkeletonText } from "@primer/react/experimental"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import team from "@ui-gallery/spec/mock/team.json"
import { Icon, iconFor } from "@/lib/icon"
import { avatarFor } from "@/lib/avatar"
import { PageHeader, SectionCard, StatusBadge } from "./shared"

const periods = ["日", "周", "月"] as const
type Period = (typeof periods)[number]
const pieColors = ["var(--fgColor-accent)", "var(--fgColor-success)", "var(--fgColor-attention)", "var(--fgColor-done)"]

function formatStat(item: (typeof stats)[number]) {
  if (item.unit === "CNY") return `¥${item.value.toLocaleString()}`
  return `${item.value.toLocaleString()}${item.unit ?? ""}`
}

function seriesFor(period: Period) {
  const rows = series.months.map((month, index) => ({ month, revenue: series.revenue[index], orders: series.orders[index] }))
  if (period === "月") return rows
  const divisor = period === "周" ? 4 : 30
  return rows.map((row) => ({ ...row, revenue: Math.round(row.revenue / divisor), orders: Math.round(row.orders / divisor) }))
}

function LoadingState() {
  return (
    <div className="page-stack" aria-busy="true" aria-live="polite">
      <div className="grid grid-4">{stats.map((item) => <section className="card" key={item.key}><SkeletonText lines={1} maxWidth={120} /><SkeletonBox height={32} width="60%" style={{ marginTop: 8 }} /><SkeletonBox height={56} style={{ marginTop: 12 }} /></section>)}</div>
      <div className="split"><section className="card"><SkeletonText lines={2} /><SkeletonBox height={280} style={{ marginTop: 16 }} /></section><section className="card"><SkeletonText lines={2} /><SkeletonBox height={280} style={{ marginTop: 16 }} /></section></div>
      <div className="grid grid-2"><section className="card"><SkeletonText lines={6} /></section><section className="card"><SkeletonText lines={6} /></section></div>
    </div>
  )
}

export function DashboardPage() {
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState<Period>("月")
  const data = seriesFor(period)
  return (
    <div className="page-stack">
      <PageHeader
        title="仪表盘"
        description={`欢迎回来，${team[0].name}。这里是今天的业务概况。`}
        action={
          <div className="flex items-center gap-2 wrap">
            <SegmentedControl aria-label="数据状态" size="small" onChange={(index) => setLoading(index === 1)}>
              <SegmentedControl.Button selected={!loading}>数据</SegmentedControl.Button>
              <SegmentedControl.Button selected={loading}>加载中</SegmentedControl.Button>
            </SegmentedControl>
            <Button variant="primary" leadingVisual={iconFor("plus")}>新建项目</Button>
          </div>
        }
      />
      {loading ? <LoadingState /> : (
        <>
          <div className="grid grid-4">
            {stats.map((item) => (
              <section className="card" key={item.key}>
                <div className="flex items-center justify-between gap-2">
                  <Text className="muted">{item.label}</Text>
                  <Label variant={item.delta >= 0 ? "success" : "danger"}><Icon name={item.delta >= 0 ? "arrow-up" : "arrow-down"} size={12} />{`${Math.abs(item.delta)}%`}</Label>
                </div>
                <Heading as="h2" style={{ fontSize: 28, marginTop: 8 }}>{formatStat(item)}</Heading>
                <div className="chart" style={{ height: 56 }} aria-hidden="true">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={item.trend.map((value, index) => ({ value, index }))} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                      <Area dataKey="value" type="monotone" stroke="var(--fgColor-accent)" fill="var(--bgColor-accent-muted)" isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>
            ))}
          </div>

          <div className="split">
            <SectionCard title="收入趋势" description="收入（千元）与订单数量对比">
              <UnderlineNav aria-label="统计周期" className="period-tabs">
                {periods.map((p) => <UnderlineNav.Item key={p} href="#" aria-current={period === p ? "page" : undefined} onSelect={(event) => { event.preventDefault(); setPeriod(p) }}>{`按${p}`}</UnderlineNav.Item>)}
              </UnderlineNav>
              <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 16, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid stroke="var(--borderColor-muted)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--fgColor-muted)" tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--fgColor-muted)" tickLine={false} axisLine={false} />
                    <ChartTooltip contentStyle={{ background: "var(--overlay-bgColor)", border: "1px solid var(--borderColor-default)", borderRadius: 6, color: "var(--fgColor-default)" }} />
                    <Legend />
                    <Area name="收入" dataKey="revenue" type="monotone" fill="var(--bgColor-accent-muted)" stroke="var(--fgColor-accent)" isAnimationActive={false} />
                    <Area name="订单" dataKey="orders" type="monotone" fill="var(--bgColor-success-muted)" stroke="var(--fgColor-success)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
            <SectionCard title="渠道占比" description="按下单渠道分布">
              <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={series.byChannel} dataKey="value" nameKey="name" innerRadius={64} outerRadius={96} paddingAngle={3} isAnimationActive={false}>
                      {series.byChannel.map((entry, index) => <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />)}
                    </Pie>
                    <ChartTooltip contentStyle={{ background: "var(--overlay-bgColor)", border: "1px solid var(--borderColor-default)", borderRadius: 6, color: "var(--fgColor-default)" }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          <div className="split">
            <SectionCard title="月度订单" description="每月订单数量">
              <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 16, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid stroke="var(--borderColor-muted)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--fgColor-muted)" tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--fgColor-muted)" tickLine={false} axisLine={false} />
                    <ChartTooltip cursor={{ fill: "var(--bgColor-muted)" }} contentStyle={{ background: "var(--overlay-bgColor)", border: "1px solid var(--borderColor-default)", borderRadius: 6, color: "var(--fgColor-default)" }} />
                    <Bar name="订单" dataKey="orders" fill="var(--fgColor-accent)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
            <SectionCard title="任务进度" description="本周团队执行情况">
              <div className="stack-4">
                {tasks.map((task) => (
                  <div key={task.title}>
                    <div className="flex items-center justify-between gap-2" style={{ marginBottom: 6 }}>
                      <div className="flex items-center gap-2"><Avatar src={avatarFor(task.owner)} alt={task.owner} size={20} /><Text>{task.title}</Text></div>
                      <Text className="muted" size="small">{task.progress}%</Text>
                    </div>
                    <ProgressBar progress={task.progress} aria-label={`${task.title}进度`} bg={task.progress >= 80 ? "success.emphasis" : task.progress >= 40 ? "accent.emphasis" : "attention.emphasis"} />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="grid grid-2">
            <SectionCard title="最近订单" description="最新的业务交易">
              <div className="table-scroll">
                <Table aria-labelledby="recent-orders" gridTemplateColumns="minmax(160px, 1.4fr) minmax(110px, 1fr) auto auto auto">
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>客户</Table.Header>
                      <Table.Header>订单</Table.Header>
                      <Table.Header>状态</Table.Header>
                      <Table.Header align="end">金额</Table.Header>
                      <Table.Header><span className="sr-only">操作</span></Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {orders.slice(0, 5).map((order) => (
                      <Table.Row key={order.id}>
                        <Table.Cell>
                          <div className="flex items-center gap-2"><Avatar src={avatarFor(order.customer)} alt="" size={24} /><span>{order.customer}</span></div>
                        </Table.Cell>
                        <Table.Cell scope="row"><Text className="mono">{order.id}</Text></Table.Cell>
                        <Table.Cell><StatusBadge value={order.status} /></Table.Cell>
                        <Table.Cell align="end">¥{order.amount.toLocaleString()}</Table.Cell>
                        <Table.Cell>
                          <ActionMenu>
                            <ActionMenu.Anchor><IconButton size="small" variant="invisible" aria-label={`订单 ${order.id} 操作`} icon={iconFor("kebab-horizontal")} /></ActionMenu.Anchor>
                            <ActionMenu.Overlay align="end"><ActionList><ActionList.Item>查看详情</ActionList.Item><ActionList.Item>导出发票</ActionList.Item></ActionList></ActionMenu.Overlay>
                          </ActionMenu>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </SectionCard>
            <SectionCard title="团队动态" description="团队最近发生的事情">
              <Timeline clipSidebar>
                {activity.map((item, index) => (
                  <Timeline.Item key={`${item.user}-${index}`}>
                    <Timeline.Badge><Avatar src={avatarFor(item.user)} alt="" size={24} /></Timeline.Badge>
                    <Timeline.Body>
                      <Text><strong>{item.user}</strong> {item.action}</Text>
                      <Text as="p" className="muted" size="small" style={{ margin: 0 }}>{item.time}</Text>
                    </Timeline.Body>
                  </Timeline.Item>
                ))}
                <Timeline.Break />
              </Timeline>
            </SectionCard>
          </div>
        </>
      )}
    </div>
  )
}
