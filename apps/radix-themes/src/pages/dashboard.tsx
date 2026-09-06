import { useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Avatar,
  Badge,
  Box,
  Card,
  DropdownMenu,
  Flex,
  Grid,
  Heading,
  IconButton,
  Progress,
  Skeleton,
  Switch,
  Table,
  Tabs,
  Text,
} from "@radix-ui/themes"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { Icon } from "@/icons"
import { PageHeader, StatusBadge } from "./shared"

function OrderActions() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton
          size="3"
          variant="ghost"
          aria-label="订单操作"
          style={{ minHeight: "40px", minWidth: "40px" }}
        >
          <Icon name="more-horizontal" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>查看详情</DropdownMenu.Item>
        <DropdownMenu.Item>编辑</DropdownMenu.Item>
        <DropdownMenu.Item color="red">删除</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export function DashboardPage() {
  const [period, setPeriod] = useState("month")
  const [loading, setLoading] = useState(false)
  return (
    <Box className="rt-page">
      <PageHeader
        title="仪表盘"
        description="欢迎回来，林晓。这里是今天的业务概况。"
        action={
          <Flex align="center" gap="3">
            <Text as="label" size="2">
              <Flex gap="2" align="center">
                <Switch checked={loading} onCheckedChange={setLoading} />
                加载状态
              </Flex>
            </Text>
            <Badge size="2" variant="soft">
              <Icon name="activity" /> 实时数据
            </Badge>
          </Flex>
        }
      />
      <Grid columns={{ initial: "1", sm: "2", lg: "4" }} gap="4">
        {stats.map((item) => (
          <Card key={item.key}>
            <Skeleton loading={loading}>
              <Flex justify="between">
                <Text color="gray">{item.label}</Text>
                <Badge color={item.delta > 0 ? "green" : "red"}>
                  {item.delta > 0 ? "+" : ""}
                  {item.delta}%
                </Badge>
              </Flex>
              <Heading size="6" mt="3">
                {item.unit === "CNY"
                  ? `¥${item.value.toLocaleString()}`
                  : `${item.value}${item.unit ?? ""}`}
              </Heading>
              <Box height="48px" mt="3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={item.trend.map((value, index) => ({ value, index }))}
                  >
                    <Area
                      dataKey="value"
                      stroke="var(--accent-9)"
                      fill="var(--accent-5)"
                      fillOpacity={0.35}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Skeleton>
          </Card>
        ))}
      </Grid>
      <Grid columns={{ initial: "1", lg: "2" }} gap="4" mt="4">
        <Card>
          <Flex justify="between" align="center" mb="4">
            <div>
              <Heading size="4">收入与订单</Heading>
              <Text size="2" color="gray">
                过去 7 个月趋势
              </Text>
            </div>
            <Tabs.Root value={period} onValueChange={setPeriod}>
              <Tabs.List size="2">
                <Tabs.Trigger value="day">日</Tabs.Trigger>
                <Tabs.Trigger value="week">周</Tabs.Trigger>
                <Tabs.Trigger value="month">月</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </Flex>
          <Skeleton loading={loading}>
            <Box height="280px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={series.months.map((month, index) => ({
                    month,
                    revenue: series.revenue[index],
                    orders: series.orders[index],
                  }))}
                >
                  <CartesianGrid stroke="var(--gray-a5)" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: "var(--gray-12)" }}>{value}</span>
                    )}
                  />
                  <Line
                    dataKey="revenue"
                    stroke="var(--accent-9)"
                    strokeWidth={2}
                  />
                  <Line
                    dataKey="orders"
                    stroke="var(--accent-7)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Skeleton>
        </Card>
        <Card>
          <Heading size="4">渠道分布</Heading>
          <Text size="2" color="gray">
            订单来源占比
          </Text>
          <Flex align="center" justify="center" gap="5" wrap="wrap">
            <Box
              style={{
                width: "240px",
                height: "240px",
                minWidth: "240px",
                flex: "0 0 240px",
              }}
            >
              <ResponsiveContainer width="100%" height={240} minWidth={240}>
                <PieChart>
                  <Pie
                    data={series.byChannel}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    isAnimationActive={false}
                  >
                    {series.byChannel.map((channel, index) => (
                      <Cell
                        key={channel.name}
                        fill={
                          index % 2 === 0
                            ? "var(--accent-9)"
                            : "var(--accent-7)"
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Flex direction="column" gap="2" style={{ flexShrink: 0 }}>
              {series.byChannel.map((channel) => (
                <Flex key={channel.name} align="center" gap="2">
                  <Box
                    width="8px"
                    height="8px"
                    style={{
                      background: "var(--accent-9)",
                      borderRadius: "50%",
                    }}
                  />
                  <Text size="2">
                    {channel.name} {channel.value}%
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Card>
      </Grid>
      <Grid columns={{ initial: "1", lg: "2" }} gap="4" mt="4">
        <Card>
          <Heading size="4" mb="3">
            最近订单
          </Heading>
          <Box
            display={{ initial: "none", sm: "block" }}
            style={{ overflowX: "auto" }}
          >
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>订单</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>客户</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>状态</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="right">
                    金额
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="right">
                    操作
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {orders.slice(0, 5).map((order) => (
                  <Table.Row key={order.id}>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <Avatar
                          size="1"
                          fallback={order.customer.slice(0, 1)}
                        />
                        <Text>{order.id}</Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>{order.customer}</Table.Cell>
                    <Table.Cell>
                      <StatusBadge value={order.status} />
                    </Table.Cell>
                    <Table.Cell align="right">
                      ¥{order.amount.toLocaleString()}
                    </Table.Cell>
                    <Table.Cell align="right">
                      <OrderActions />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
          <Flex
            direction="column"
            gap="2"
            display={{ initial: "flex", sm: "none" }}
          >
            {orders.slice(0, 5).map((order) => (
              <Card key={order.id}>
                <Flex justify="between" align="center">
                  <Flex gap="2" align="center">
                    <Avatar size="1" fallback={order.customer.slice(0, 1)} />
                    <Box>
                      <Text weight="medium" as="div">
                        {order.id}
                      </Text>
                      <Text size="1" color="gray" as="div">
                        {order.customer}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex align="center" gap="2">
                    <Flex direction="column" align="end" gap="1">
                      <StatusBadge value={order.status} />
                      <Text size="2">¥{order.amount.toLocaleString()}</Text>
                    </Flex>
                    <OrderActions />
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Card>
        <Card>
          <Heading size="4" mb="4">
            团队动态
          </Heading>
          <Flex direction="column" gap="4">
            {activity.map((item) => (
              <Flex key={`${item.user}-${item.time}`} gap="3">
                <Box
                  mt="2"
                  width="8px"
                  height="8px"
                  style={{
                    background: "var(--accent-9)",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Text size="2">
                    <b>{item.user}</b> {item.action}
                  </Text>
                  <Text size="1" color="gray" as="div">
                    {item.time}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Card>
      </Grid>
      <Card mt="4">
        <Heading size="4" mb="4">
          任务进度
        </Heading>
        <Flex direction="column" gap="4">
          {tasks.map((task) => (
            <Box key={task.title}>
              <Flex justify="between">
                <Text size="2">{task.title}</Text>
                <Text size="2" color="gray">
                  {task.progress}% · {task.owner}
                </Text>
              </Flex>
              <Progress value={task.progress} mt="2" />
            </Box>
          ))}
        </Flex>
      </Card>
      <Tabs.Root defaultValue="ready" mt="4">
        <Tabs.List size="2">
          <Tabs.Trigger value="ready">概览</Tabs.Trigger>
          <Tabs.Trigger value="loading">加载状态</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="ready">
          <Text color="gray" size="2">
            数据已从本地 mock JSON 加载。
          </Text>
        </Tabs.Content>
        <Tabs.Content value="loading">
          <Grid columns="4" gap="4" mt="4">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item}>
                <Skeleton loading>
                  <Heading size="5">数据</Heading>
                </Skeleton>
                <Skeleton loading mt="3">
                  <Text>加载中</Text>
                </Skeleton>
              </Card>
            ))}
          </Grid>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  )
}
