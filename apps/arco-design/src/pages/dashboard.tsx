import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Avatar, Badge, Button, Card, Grid, List, Progress, Skeleton, Table, Tabs, Tag, Typography } from "@arco-design/web-react"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { Icon } from "@/components/icon"
import { PageHeader, StatusBadge } from "./shared"

export function DashboardPage() {
  return (
    <>
      <PageHeader title="仪表盘" description="欢迎回来，林晓。这里是今天的业务概况。" action={<Button type="primary" icon={<Icon name="plus" />}>新建项目</Button>} />
      <Grid.Row gutter={[16, 16]}>
        {stats.map((item) => <Grid.Col key={item.key} xs={24} sm={12} xl={6}><Card>
          <div className="between"><Typography.Text type="secondary">{item.label}</Typography.Text><Badge count={`${item.delta > 0 ? "+" : ""}${item.delta}%`} /></div>
          <Typography.Title heading={3}>{item.unit === "CNY" ? `¥${item.value.toLocaleString()}` : `${item.value}${item.unit ?? ""}`}</Typography.Title>
          <div style={{ height: 48 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={item.trend.map((value, index) => ({ value, index }))}><Area dataKey="value" stroke="rgb(var(--primary-6))" fill="rgb(var(--primary-6))" fillOpacity={0.12} /></AreaChart></ResponsiveContainer></div>
        </Card></Grid.Col>)}
      </Grid.Row>
      <Grid.Row gutter={[16, 16]}>
        <Grid.Col xs={24} xl={16}><Card title="收入趋势" extra={<Typography.Text type="secondary">过去 7 个月的收入与订单</Typography.Text>}>
          <div style={{ height: 280 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={series.months.map((month, index) => ({ month, revenue: series.revenue[index], orders: series.orders[index] }))}><CartesianGrid vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area dataKey="revenue" type="monotone" fill="rgb(var(--primary-6))" fillOpacity={0.16} stroke="rgb(var(--primary-6))" /><Area dataKey="orders" type="monotone" fill="rgb(var(--success-6))" fillOpacity={0.12} stroke="rgb(var(--success-6))" /></AreaChart></ResponsiveContainer></div>
        </Card></Grid.Col>
        <Grid.Col xs={24} xl={8}><Card title="任务进度" extra={<Typography.Text type="secondary">本周团队执行情况</Typography.Text>}>
          <div className="stack">{tasks.slice(0, 4).map((task) => <div key={task.title}><div className="between"><Typography.Text>{task.title}</Typography.Text><Typography.Text type="secondary">{task.progress}%</Typography.Text></div><Progress percent={task.progress} /></div>)}</div>
        </Card></Grid.Col>
      </Grid.Row>
      <Grid.Row gutter={[16, 16]}>
        <Grid.Col xs={24} xl={12}><Card title="最近订单" extra={<Typography.Text type="secondary">最新的业务交易</Typography.Text>}><div className="scroll-x"><Table rowKey="id" pagination={false} columns={[{ title: "订单", dataIndex: "id" }, { title: "客户", dataIndex: "customer" }, { title: "状态", dataIndex: "status", render: (value) => <StatusBadge value={String(value)} /> }, { title: "金额", dataIndex: "amount", render: (value) => `¥${Number(value).toLocaleString()}` }]} data={orders.slice(0, 5)} /></div></Card></Grid.Col>
        <Grid.Col xs={24} xl={12}><Card title="活动动态" extra={<Typography.Text type="secondary">团队最近发生的事情</Typography.Text>}><List bordered={false} dataSource={activity} render={(item) => <List.Item key={`${item.user}-${item.time}`}><List.Item.Meta avatar={<Avatar>{item.user.slice(0, 1)}</Avatar>} title={item.user} description={`${item.action} · ${item.time}`} /></List.Item>} /></Card></Grid.Col>
      </Grid.Row>
      <Tabs defaultActiveTab="overview">
        <Tabs.TabPane key="overview" title="概览"><Card><Typography.Text type="secondary">数据已从本地 mock JSON 加载。</Typography.Text></Card></Tabs.TabPane>
        <Tabs.TabPane key="loading" title="加载状态"><Card><Skeleton text={{ rows: 3 }} /></Card></Tabs.TabPane>
      </Tabs>
      <div className="row"><Tag color="green">系统正常</Tag><Typography.Text type="secondary">所有服务运行正常</Typography.Text></div>
    </>
  )
}
