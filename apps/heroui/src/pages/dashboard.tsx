import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Avatar, Button, Card, Chip, Label, ProgressBar, ScrollShadow, Skeleton, Table, Tabs } from "@heroui/react"
import { Icon } from "@ui-gallery/icons-react"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { PageHeader, StatusBadge } from "./shared"

const trend = series.months.map((month, index) => ({ month, revenue: series.revenue[index], orders: series.orders[index] }))

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="仪表盘" description="欢迎回来，林晓。这里是今天的业务概况。" action={<Button><Icon name="plus" size={16} />新建项目</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.key}>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Description>{item.label}</Card.Description>
                <Chip size="sm" color={item.delta > 0 ? "success" : "default"}>{item.delta > 0 ? "+" : ""}{item.delta}%</Chip>
              </div>
              <Card.Title className="text-2xl">{item.unit === "CNY" ? `¥${item.value.toLocaleString()}` : `${item.value}${item.unit ?? ""}`}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="h-12 text-accent">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={item.trend.map((value, index) => ({ value, index }))}>
                    <Area dataKey="value" stroke="currentColor" fill="currentColor" fillOpacity={0.12} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <Card>
          <Card.Header><Card.Title>收入趋势</Card.Title><Card.Description>过去 7 个月的收入与订单</Card.Description></Card.Header>
          <Card.Content>
            <div className="h-72 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted)" tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} width={40} />
                  <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" }} />
                  <Area dataKey="revenue" name="收入" type="monotone" fill="var(--accent)" fillOpacity={0.2} stroke="var(--accent)" isAnimationActive={false} />
                  <Area dataKey="orders" name="订单" type="monotone" fill="var(--success)" fillOpacity={0.1} stroke="var(--success)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header><Card.Title>任务进度</Card.Title><Card.Description>本周团队执行情况</Card.Description></Card.Header>
          <Card.Content className="space-y-5">
            {tasks.slice(0, 4).map((task) => (
              <ProgressBar key={task.title} value={task.progress} size="sm">
                <Label>{task.title}</Label>
                <ProgressBar.Output />
                <ProgressBar.Track><ProgressBar.Fill /></ProgressBar.Track>
              </ProgressBar>
            ))}
          </Card.Content>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <Card.Header><Card.Title>最近订单</Card.Title><Card.Description>最新的业务交易</Card.Description></Card.Header>
          <Card.Content>
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="最近订单">
                  <Table.Header>
                    <Table.Column isRowHeader>订单</Table.Column>
                    <Table.Column>客户</Table.Column>
                    <Table.Column>状态</Table.Column>
                    <Table.Column className="text-right">金额</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {orders.slice(0, 5).map((order) => (
                      <Table.Row key={order.id}>
                        <Table.Cell className="font-medium">{order.id}</Table.Cell>
                        <Table.Cell>{order.customer}</Table.Cell>
                        <Table.Cell><StatusBadge value={order.status} /></Table.Cell>
                        <Table.Cell className="text-right">¥{order.amount.toLocaleString()}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header><Card.Title>活动动态</Card.Title><Card.Description>团队最近发生的事情</Card.Description></Card.Header>
          <Card.Content>
            <ScrollShadow className="h-64 pr-4">
              <div className="space-y-5">
                {activity.map((item, index) => (
                  <div className="flex gap-3" key={`${item.user}-${index}`}>
                    <Avatar size="sm"><Avatar.Fallback>{item.user.slice(0, 1)}</Avatar.Fallback></Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm"><span className="font-medium">{item.user}</span> {item.action}</p>
                      <p className="text-xs text-muted">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollShadow>
          </Card.Content>
        </Card>
      </div>
      <Tabs defaultSelectedKey="overview">
        <Tabs.ListContainer>
          <Tabs.List aria-label="仪表盘状态">
            <Tabs.Tab id="overview">概览<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="loading">加载状态<Tabs.Indicator /></Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel id="overview"><Card><Card.Content><p className="text-sm text-muted">数据已从本地 mock JSON 加载。</p></Card.Content></Card></Tabs.Panel>
        <Tabs.Panel id="loading"><Card><Card.Content className="space-y-3"><Skeleton className="h-4 w-1/3 rounded-lg" /><Skeleton className="h-4 w-2/3 rounded-lg" /><Skeleton className="h-4 w-1/2 rounded-lg" /></Card.Content></Card></Tabs.Panel>
      </Tabs>
    </div>
  )
}
