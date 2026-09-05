import { useEffect, useState } from "react"
import { Avatar, Button, Card, Progress, Skeleton, Table, Tabs, Tag, Timeline, Typography } from "@douyinfe/semi-ui"
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { Icon } from "@/icons"
import { PageHeader, SectionCard, StatusTag, money } from "./shared"

const { Text, Title } = Typography
const palette = ["var(--semi-color-primary)", "var(--semi-color-secondary)", "var(--semi-color-tertiary)", "var(--semi-color-warning)"]
const trend = series.months.map((month, index) => ({ month, revenue: series.revenue[index], orders: series.orders[index] }))

function formatStat(stat: (typeof stats)[number]) {
  if (stat.unit === "CNY") return money(stat.value)
  if (stat.unit === "%") return `${stat.value}%`
  return stat.value.toLocaleString("zh-CN")
}

export function DashboardPage() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 250)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="acme-page">
      <PageHeader title="仪表盘" description="今天的经营概览与团队动态。" action={<Button theme="solid" icon={<Icon name="download" />}>导出报表</Button>} />
      <div className="acme-grid-4">
        {stats.map((stat) => (
          <Card key={stat.key} bodyStyle={{ padding: 16 }}>
            <Skeleton loading={loading} active placeholder={<><Skeleton.Title style={{ width: 120, marginBottom: 12 }} /><Skeleton.Paragraph rows={2} /></>}>
              <div className="acme-between"><Text type="tertiary">{stat.label}</Text><Tag color={stat.delta >= 0 ? "green" : "red"} type="light" size="small"><Icon name={stat.delta >= 0 ? "trending-up" : "trending-down"} size={12} /> {stat.delta > 0 ? "+" : ""}{stat.delta}%</Tag></div>
              <Title heading={3} style={{ margin: "6px 0 8px" }}>{formatStat(stat)}</Title>
              <div className="acme-sparkline">
                <ResponsiveContainer width="100%" height={36}><AreaChart data={stat.trend.map((value, index) => ({ index, value }))}><Area type="monotone" dataKey="value" stroke="var(--semi-color-primary)" fill="var(--semi-color-primary-light-default)" strokeWidth={2} isAnimationActive={false} /></AreaChart></ResponsiveContainer>
              </div>
            </Skeleton>
          </Card>
        ))}
      </div>
      <div className="acme-grid" style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)" }}>
        <SectionCard title="收入趋势" description="近 7 个月收入（千元）">
          <Tabs type="line" size="small">
            <Tabs.TabPane tab="收入" itemKey="revenue">
              <div style={{ height: 260 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend}><XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} /><YAxis width={32} tickLine={false} axisLine={false} fontSize={12} /><ChartTooltip /><Area type="monotone" dataKey="revenue" stroke="var(--semi-color-primary)" fill="var(--semi-color-primary-light-default)" strokeWidth={2} isAnimationActive={false} /></AreaChart></ResponsiveContainer></div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="订单" itemKey="orders">
              <div style={{ height: 260 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={trend}><XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} /><YAxis width={40} tickLine={false} axisLine={false} fontSize={12} /><ChartTooltip /><Bar dataKey="orders" fill="var(--semi-color-primary)" radius={[4, 4, 0, 0]} isAnimationActive={false} /></BarChart></ResponsiveContainer></div>
            </Tabs.TabPane>
          </Tabs>
        </SectionCard>
        <SectionCard title="渠道占比" description="按渠道的收入分布">
          <div style={{ height: 200 }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={series.byChannel} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3} isAnimationActive={false}>{series.byChannel.map((entry, index) => <Cell key={entry.name} fill={palette[index % palette.length]} />)}</Pie><ChartTooltip /></PieChart></ResponsiveContainer></div>
          <div className="acme-grid-2" style={{ gap: 6 }}>{series.byChannel.map((entry, index) => <Text key={entry.name} size="small" type="secondary"><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, background: palette[index % palette.length], marginRight: 6 }} />{entry.name} {entry.value}%</Text>)}</div>
        </SectionCard>
      </div>
      <div className="acme-grid" style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)" }}>
        <SectionCard title="最近订单" extra={<Button theme="borderless" size="small">查看全部</Button>}>
          <div className="acme-scroll-x">
            <Table scroll={{ x: 600 }}
              size="small"
              pagination={false}
              loading={loading}
              dataSource={orders.slice(0, 6)}
              rowKey="id"
              columns={[
                { title: "订单号", dataIndex: "id", render: (value: string) => <Text strong>{value}</Text> },
                { title: "客户", dataIndex: "customer", render: (value: string) => <span className="acme-row" style={{ flexWrap: "nowrap" }}><Avatar size="extra-small" color="light-blue">{value.slice(0, 1)}</Avatar>{value}</span> },
                { title: "状态", dataIndex: "status", render: (value: string) => <StatusTag value={value} /> },
                { title: "金额", dataIndex: "amount", align: "right", render: (value: number) => money(value) },
              ]}
            />
          </div>
        </SectionCard>
        <div className="acme-page" style={{ gap: 16 }}>
          <SectionCard title="活动">
            <Timeline>{activity.slice(0, 5).map((item) => <Timeline.Item key={item.action} time={item.time}><Text strong>{item.user}</Text> {item.action}</Timeline.Item>)}</Timeline>
          </SectionCard>
          <SectionCard title="项目进度">
            {tasks.map((task) => <div key={task.title} style={{ marginBottom: 12 }}><div className="acme-between"><Text>{task.title}</Text><Text type="tertiary" size="small">{task.owner} · {task.progress}%</Text></div><Progress percent={task.progress} aria-label={task.title} /></div>)}
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
