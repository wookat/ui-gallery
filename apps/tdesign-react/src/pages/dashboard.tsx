import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts"
import { Avatar, Button, Card, Dropdown, Empty, Progress, Skeleton, Statistic, Table, Tabs, Tag, Timeline, Typography } from "tdesign-react"
import { Icon } from "@/components/icon"
import stats from "@ui-gallery/spec/mock/stats.json"
import series from "@ui-gallery/spec/mock/series.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"

const statusTheme: Record<string, "success" | "warning" | "danger" | "primary"> = { paid: "success", pending: "warning", failed: "danger", refunded: "danger", shipped: "primary" }
const statusLabel: Record<string, string> = { paid: "已支付", pending: "待处理", failed: "失败", refunded: "已退款", shipped: "已发货" }

function StatCard({ item }: { item: typeof stats[number] }) {
  const data = item.trend.map((value, index) => ({ index, value }))
  return <Card><Statistic title={item.label} value={item.value} unit={item.unit === "CNY" ? "元" : item.unit} trend={item.delta >= 0 ? "increase" : "decrease"} /><Typography.Text>{item.delta > 0 ? "+" : ""}{item.delta}%</Typography.Text><div className="chart-box" style={{ height: 48 }}><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><Line type="monotone" dataKey="value" stroke="var(--td-brand-color)" dot={false} strokeWidth={2} /></LineChart></ResponsiveContainer></div></Card>
}

export function DashboardPage() {
  const [ready, setReady] = useState(false)
  const [period, setPeriod] = useState("month")
  useEffect(() => { const timer = window.setTimeout(() => setReady(true), 600); return () => window.clearTimeout(timer) }, [])
  if (!ready) return <div className="stack"><Skeleton animation="gradient" rowCol={[{ type: "rect", width: "35%", height: "32px" }, { type: "rect", width: "100%", height: "120px" }, { type: "rect", width: "100%", height: "360px" }]} /></div>
  return (
    <div className="stack">
      <div className="page-heading"><div><Typography.Title level="h2">仪表盘</Typography.Title><Typography.Paragraph>欢迎回来，林晓。这里是今天的业务概览。</Typography.Paragraph></div><Tag theme="success">系统运行正常</Tag></div>
      <div className="grid-four">{stats.map((item) => <StatCard item={item} key={item.key} />)}</div>
      <div className="grid-two">
        <Card title="收入趋势" actions={<Tabs value={period} onChange={(value) => setPeriod(String(value))}><Tabs.TabPanel value="day" label="日" /><Tabs.TabPanel value="week" label="周" /><Tabs.TabPanel value="month" label="月" /></Tabs>}>
          <div className="chart-box"><ResponsiveContainer width="100%" height="100%"><LineChart data={series.months.map((month, index) => ({ month, revenue: series.revenue[index] }))}><CartesianGrid strokeDasharray="3 3" stroke="var(--td-component-stroke)" /><XAxis dataKey="month" /><YAxis /><ChartTooltip /><Line type="monotone" dataKey="revenue" stroke="var(--td-brand-color)" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
        </Card>
        <Card title="订单渠道">
          <div className="chart-box"><ResponsiveContainer width="100%" height="100%"><BarChart data={series.byChannel}><CartesianGrid strokeDasharray="3 3" stroke="var(--td-component-stroke)" /><XAxis dataKey="name" /><YAxis /><ChartTooltip /><Bar dataKey="value" fill="var(--td-brand-color)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Card>
      </div>
      <div className="grid-two">
        <Card title="最近订单">
          <div className="table-scroll">
            <Table
              rowKey="id"
              data={orders.slice(0, 5)}
              columns={[
                {
                  colKey: "customer",
                  title: "客户",
                  cell: ({ row }) => <div className="inline"><Avatar size="32px">{row.customer.slice(0, 1)}</Avatar><span>{row.customer}</span></div>,
                },
                { colKey: "product", title: "产品" },
                { colKey: "status", title: "状态", cell: ({ row }) => <Tag theme={statusTheme[row.status]}>{statusLabel[row.status]}</Tag> },
                { colKey: "amount", title: "金额", cell: ({ row }) => `¥${row.amount.toLocaleString()}` },
                {
                  colKey: "op",
                  title: "操作",
                  cell: () => (
                    <Dropdown options={[{ content: "查看", value: "view" }, { content: "编辑", value: "edit" }, { content: "删除", value: "delete" }]}>
                      <Button variant="text">操作</Button>
                    </Dropdown>
                  ),
                },
              ]}
            />
          </div>
        </Card>
        <Card title="团队动态"><Timeline>{activity.slice(0, 5).map((item) => <Timeline.Item key={`${item.user}-${item.time}`} label={item.time}><strong>{item.user}</strong> {item.action}</Timeline.Item>)}</Timeline></Card>
      </div>
      <Card title="任务进度"><div className="grid-four">{tasks.map((task) => <div className="stack" key={task.title}><div className="inline" style={{ justifyContent: "space-between" }}><span>{task.title}</span><span>{task.progress}%</span></div><Progress percentage={task.progress} /><small style={{ color: "var(--td-text-color-secondary)" }}><Icon name="user" /> {task.owner}</small></div>)}</div></Card>
      <Card><Empty description="更多数据将在此处展示" /></Card>
    </div>
  )
}
