import { useEffect, useState } from "react"
import {
  Button,
  Card,
  Col,
  Dropdown,
  Flex,
  List,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Timeline,
  Typography,
} from "antd"
import {
  LineChart as ReLineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts"
import stats from "@ui-gallery/spec/mock/stats.json"
import series from "@ui-gallery/spec/mock/series.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { Icon } from "@/icons"
import {
  PageHeader,
  avatar,
  statusColor,
  statusLabel,
  type Order,
} from "@/pages/shared"
import { Link } from "react-router-dom"
import { theme } from "antd"

function orderColumns(): Array<Record<string, unknown>> {
  return [
    {
      title: "订单号",
      dataIndex: "id",
      sorter: (a: Order, b: Order) => a.id.localeCompare(b.id),
    },
    {
      title: "客户",
      dataIndex: "customer",
      render: (value: string) => (
        <Space>
          {avatar(value)}
          {value}
        </Space>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (value: string) => (
        <Tag color={statusColor[value]}>{statusLabel[value]}</Tag>
      ),
    },
    {
      title: "金额",
      dataIndex: "amount",
      align: "right",
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 72,
      render: () => (
        <Dropdown
          menu={{
            items: [
              { key: "view", label: "查看详情" },
              { key: "edit", label: "编辑" },
            ],
          }}
        >
          <Button
            type="text"
            icon={<Icon name="more-horizontal" />}
            aria-label="更多操作"
          />
        </Dropdown>
      ),
    },
  ]
}

export function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("month")
  const { token } = theme.useToken()
  useEffect(() => {
    if (!loading) return
    const timer = window.setTimeout(() => setLoading(false), 600)
    return () => window.clearTimeout(timer)
  }, [loading])
  const periodTabs = (
    <Tabs
      size="small"
      activeKey={period}
      onChange={setPeriod}
      items={[
        { key: "day", label: "日" },
        { key: "week", label: "周" },
        { key: "month", label: "月" },
      ]}
    />
  )
  const header = (
    <PageHeader
      title="仪表盘"
      description="查看业务健康度与团队进展。"
      extra={
        <Space wrap>
          {periodTabs}
          <Button
            icon={<Icon name="refresh" />}
            loading={loading}
            onClick={() => setLoading(true)}
          >
            刷新
          </Button>
        </Space>
      }
    />
  )
  if (loading)
    return (
      <>
        {header}
        <Row gutter={[16, 16]}>
          {stats.map((stat) => (
            <Col xs={24} sm={12} xl={6} key={stat.key}>
              <Card>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
          ))}
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} xl={16}>
            <Card>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          </Col>
          <Col xs={24} xl={8}>
            <Card>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          </Col>
        </Row>
        <Card style={{ marginTop: 16 }}>
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      </>
    )
  const divisor = period === "day" ? 30 : period === "week" ? 4 : 1
  const lineData = series.months.map((month, index) => ({
    month,
    revenue: Math.round(series.revenue[index] / divisor),
    orders: Math.round(series.orders[index] / divisor),
  }))
  return (
    <>
      {header}
      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} xl={6} key={stat.key}>
            <Card>
              <Statistic
                title={stat.label}
                value={stat.value}
                suffix={stat.unit === "CNY" ? "元" : stat.unit}
              />
              <Tag
                color={stat.delta >= 0 ? "success" : "error"}
                icon={
                  <Icon name={stat.delta >= 0 ? "arrow-up" : "arrow-down"} />
                }
              >
                {Math.abs(stat.delta)}%
              </Tag>
              <div className="mini-chart">
                <ResponsiveContainer>
                  <ReLineChart
                    data={stat.trend.map((value, index) => ({ index, value }))}
                  >
                    <Line
                      dataKey="value"
                      stroke={
                        stat.delta >= 0 ? token.colorSuccess : token.colorError
                      }
                      dot={false}
                      isAnimationActive={false}
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} xl={16}>
          <Card title="业务趋势">
            <div className="chart">
              <ResponsiveContainer>
                <ReLineChart data={lineData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip />
                  <Line
                    dataKey="revenue"
                    stroke={token.colorPrimary}
                    strokeWidth={3}
                    isAnimationActive={false}
                  />
                  <Line
                    dataKey="orders"
                    stroke={token.colorSuccess}
                    isAnimationActive={false}
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card title="渠道分布">
            <div className="chart">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={series.byChannel}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                    isAnimationActive={false}
                  >
                    {series.byChannel.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          [
                            token.colorPrimary,
                            token.colorSuccess,
                            token.colorWarning,
                            token.colorError,
                          ][index]
                        }
                      />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
      <Card title="订单趋势" style={{ marginTop: 16 }}>
        <div className="chart">
          <ResponsiveContainer>
            <ReBarChart data={lineData}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip />
              <Bar
                dataKey="orders"
                fill={token.colorPrimary}
                isAnimationActive={false}
              />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} xl={15}>
          <Card title="最近订单" extra={<Link to="/orders">查看全部</Link>}>
            <Table
              rowKey="id"
              pagination={false}
              scroll={{ x: "max-content" }}
              dataSource={orders.slice(0, 5)}
              columns={orderColumns() as never}
            />
          </Card>
        </Col>
        <Col xs={24} xl={9}>
          <Card title="团队动态">
            <Timeline
              items={activity.slice(0, 5).map((item) => ({
                children: (
                  <>
                    <b>{item.user}</b> {item.action}
                    <Typography.Text
                      type="secondary"
                      style={{ display: "block" }}
                    >
                      {item.time}
                    </Typography.Text>
                  </>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>
      <Card title="任务进度" style={{ marginTop: 16 }}>
        <List
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item>
              <Flex vertical style={{ width: "100%" }}>
                <Flex justify="space-between">
                  <span>{task.title}</span>
                  <Typography.Text type="secondary">
                    {task.owner}
                  </Typography.Text>
                </Flex>
                <Progress percent={task.progress} />
              </Flex>
            </List.Item>
          )}
        />
      </Card>
    </>
  )
}
