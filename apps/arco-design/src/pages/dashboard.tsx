import { useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Avatar, Badge, Button, Card, Dropdown, Grid, List, Menu, Progress, Skeleton, Table, Tabs, Tag, Typography } from "@arco-design/web-react"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { Icon } from "@/components/icon"
import { PageHeader, StatusBadge } from "./shared"

const periods = [{ key: "day", title: "日" }, { key: "week", title: "周" }, { key: "month", title: "月" }]
const periodSpan: Record<string, number> = { day: 3, week: 5, month: series.months.length }

export function DashboardPage() {
  const [period, setPeriod] = useState("month")
  const [loading, setLoading] = useState(false)
  const span = periodSpan[period] ?? series.months.length
  const months = series.months.slice(-span)
  const revenue = months.map((month, index) => ({ month, revenue: series.revenue.slice(-span)[index] }))
  const volume = months.map((month, index) => ({ month, orders: series.orders.slice(-span)[index] }))
  const changePeriod = (key: string) => {
    setPeriod(key)
    setLoading(true)
    window.setTimeout(() => setLoading(false), 350)
  }
  const rowMenu = <Menu><Menu.Item key="view">查看详情</Menu.Item><Menu.Item key="copy">复制订单号</Menu.Item></Menu>
  return (
    <>
      <PageHeader title="仪表盘" description="欢迎回来，林晓。这里是今天的业务概况。" action={<Button type="primary" size="large" className="hit-area" icon={<Icon name="plus" />}>新建项目</Button>} />
      <Tabs activeTab={period} onChange={changePeriod} type="capsule" size="large" className="period-tabs">
        {periods.map((item) => <Tabs.TabPane key={item.key} title={item.title} />)}
      </Tabs>
      <Grid.Row gutter={[16, 16]}>
        {stats.map((item) => <Grid.Col key={item.key} xs={24} sm={12} xl={6}><Card>
          <div className="between"><Typography.Text type="secondary">{item.label}</Typography.Text><Badge count={`${item.delta > 0 ? "+" : ""}${item.delta}%`} /></div>
          <Typography.Title heading={3}>{item.unit === "CNY" ? `¥${item.value.toLocaleString()}` : `${item.value}${item.unit ?? ""}`}</Typography.Title>
          <div style={{ height: 48 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={item.trend.map((value, index) => ({ value, index }))}><Area dataKey="value" isAnimationActive={false} stroke="rgb(var(--primary-6))" fill="rgb(var(--primary-6))" fillOpacity={0.12} /></AreaChart></ResponsiveContainer></div>
        </Card></Grid.Col>)}
      </Grid.Row>
      <Grid.Row gutter={[16, 16]}>
        <Grid.Col xs={24} xl={14}><Card title="收入趋势" extra={<Typography.Text type="secondary">{`近 ${months.length} 个周期的收入`}</Typography.Text>}>
          {loading ? <Skeleton animation text={{ rows: 6 }} /> : <div style={{ height: 280 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenue}><CartesianGrid vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area dataKey="revenue" type="monotone" isAnimationActive={false} fill="rgb(var(--primary-6))" fillOpacity={0.16} stroke="rgb(var(--primary-6))" /></AreaChart></ResponsiveContainer></div>}
        </Card></Grid.Col>
        <Grid.Col xs={24} xl={10}><Card title="订单量">
          {loading ? <Skeleton animation text={{ rows: 6 }} /> : <div style={{ height: 280 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={volume}><CartesianGrid vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="orders" isAnimationActive={false} fill="rgb(var(--primary-6))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>}
        </Card></Grid.Col>
      </Grid.Row>
      <Grid.Row gutter={[16, 16]}>
        <Grid.Col xs={24} xl={10}><Card title="最近订单" extra={<Typography.Text type="secondary">最新的业务交易</Typography.Text>}><div className="scroll-x recent-orders"><Table rowKey="id" pagination={false} scroll={{ x: 520 }} columns={[{ title: "订单", dataIndex: "id" }, { title: "客户", dataIndex: "customer", render: (value) => <div className="row"><Avatar size={24}>{String(value).slice(0, 1)}</Avatar>{String(value)}</div> }, { title: "状态", dataIndex: "status", render: (value) => <StatusBadge value={String(value)} /> }, { title: "金额", dataIndex: "amount", align: "right", render: (value) => `¥${Number(value).toLocaleString()}` }, { title: "", dataIndex: "actions", width: 56, render: () => <Dropdown droplist={rowMenu} position="br"><Button type="text" className="hit-area" icon={<Icon name="more-horizontal" />} aria-label="更多操作" /></Dropdown> }]} data={orders.slice(0, 5)} /></div></Card></Grid.Col>
        <Grid.Col xs={24} xl={7}><Card title="活动动态" extra={<Typography.Text type="secondary">团队最近发生的事情</Typography.Text>}><List bordered={false} dataSource={activity} render={(item) => <List.Item key={`${item.user}-${item.time}`}><List.Item.Meta avatar={<Avatar>{item.user.slice(0, 1)}</Avatar>} title={item.user} description={`${item.action} · ${item.time}`} /></List.Item>} /></Card></Grid.Col>
        <Grid.Col xs={24} xl={7}><Card title="任务进度" extra={<Typography.Text type="secondary">本周团队执行情况</Typography.Text>}>
          <div className="stack">{tasks.slice(0, 4).map((task) => <div key={task.title}><Typography.Text>{task.title}</Typography.Text><Progress percent={task.progress} /></div>)}</div>
        </Card></Grid.Col>
      </Grid.Row>
      <div className="row"><Tag color="green">系统正常</Tag><Typography.Text type="secondary">所有服务运行正常</Typography.Text></div>
    </>
  )
}
