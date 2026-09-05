import { useEffect, useState } from "react"
import { ActionIcon, Avatar, Badge, Button, Card, Grid, Group, Menu, Progress, SegmentedControl, SimpleGrid, Skeleton, Stack, Table, Tabs, Text, Timeline, Title } from "@mantine/core"
import { BarChart, DonutChart, LineChart, Sparkline } from "@mantine/charts"
import { Icon } from "@ui-gallery/icons-react"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { muted, PageHeader, SectionCard, StatusBadge, money } from "./shared"

export function useFakeLoading(ms = 250) {
  const [loading, setLoading] = useState(() => new URLSearchParams(window.location.search).get("state") !== "ready")
  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), ms)
    return () => window.clearTimeout(id)
  }, [ms])
  return new URLSearchParams(window.location.search).get("state") === "loading" || loading
}

const chartData = series.months.map((month, i) => ({ month, 收入: series.revenue[i], 订单: series.orders[i] }))
const donut = series.byChannel.map((c, i) => ({ name: c.name, value: c.value, color: ["blue.6", "teal.6", "violet.6", "orange.6"][i] }))

function formatStat(stat: (typeof stats)[number]) {
  if (stat.unit === "CNY") return money(stat.value)
  if (stat.unit === "%") return `${stat.value}%`
  return stat.value.toLocaleString("zh-CN")
}

export function DashboardPage() {
  const loading = useFakeLoading()
  const [period, setPeriod] = useState("week")

  return (
    <Stack gap="lg">
      <PageHeader
        title="仪表盘"
        description="收入、订单与团队动态一览。"
        action={
          <Tabs value={period} onChange={(v) => setPeriod(v ?? "week")} variant="pills" radius="md">
            <Tabs.List>
              <Tabs.Tab value="day">日</Tabs.Tab>
              <Tabs.Tab value="week">周</Tabs.Tab>
              <Tabs.Tab value="month">月</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        }
      />

      <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }} spacing="md">
        {stats.map((stat) => (
          <Card key={stat.key} withBorder radius="md" padding="lg">
            {loading ? (
              <Stack gap="sm"><Skeleton height={12} width="40%" /><Skeleton height={28} width="60%" /><Skeleton height={40} /></Stack>
            ) : (
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" c={muted}>{stat.label}</Text>
                  <Badge variant="light" color={stat.delta >= 0 ? "teal" : "red"} leftSection={<Icon name={stat.delta >= 0 ? "arrow-up" : "arrow-down"} size={10} />}>
                    {Math.abs(stat.delta)}%
                  </Badge>
                </Group>
                <Title order={3}>{formatStat(stat)}</Title>
                <Sparkline h={40} data={stat.trend} curveType="monotone" color={stat.delta >= 0 ? "teal" : "red"} fillOpacity={0.3} strokeWidth={2} />
              </Stack>
            )}
          </Card>
        ))}
      </SimpleGrid>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <SectionCard title="收入趋势" description="近 7 个月收入（千元）与订单量" right={<SegmentedControl size="xs" data={["折线", "柱状"]} />}>
            {loading ? <Skeleton height={280} /> : (
              <Stack gap="lg">
                <LineChart h={200} data={chartData} dataKey="month" series={[{ name: "收入", color: "blue.6" }]} curveType="monotone" withLegend />
                <BarChart h={160} data={chartData} dataKey="month" series={[{ name: "订单", color: "teal.6" }]} />
              </Stack>
            )}
          </SectionCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <SectionCard title="渠道占比" description="按下单渠道">
            {loading ? <Skeleton height={280} /> : (
              <Stack align="center" gap="md">
                <DonutChart data={donut} withLabelsLine withLabels paddingAngle={4} size={180} thickness={28} chartLabel="渠道" />
                <Group gap="xs" justify="center">
                  {donut.map((d) => <Badge key={d.name} variant="dot" color={d.color}>{d.name} {d.value}%</Badge>)}
                </Group>
              </Stack>
            )}
          </SectionCard>
        </Grid.Col>
      </Grid>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <SectionCard title="最近订单" description="最近 5 笔订单" right={<Button variant="subtle" size="xs" rightSection={<Icon name="arrow-right" size={14} />}>查看全部</Button>}>
            {loading ? <Skeleton height={260} /> : (
              <Table.ScrollContainer minWidth={560}>
                <Table verticalSpacing="sm" highlightOnHover>
                  <Table.Thead>
                    <Table.Tr><Table.Th>订单</Table.Th><Table.Th>客户</Table.Th><Table.Th>状态</Table.Th><Table.Th ta="right">金额</Table.Th><Table.Th w={40} /></Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {orders.slice(0, 5).map((o) => (
                      <Table.Tr key={o.id}>
                        <Table.Td><Text size="sm" fw={500}>{o.id}</Text><Text size="xs" c={muted}>{o.date}</Text></Table.Td>
                        <Table.Td><Group gap="xs" wrap="nowrap"><Avatar size="sm" radius="xl" color="blue">{o.customer.slice(0, 1)}</Avatar><Text size="sm">{o.customer}</Text></Group></Table.Td>
                        <Table.Td><StatusBadge value={o.status} /></Table.Td>
                        <Table.Td ta="right"><Text size="sm" ff="monospace">{money(o.amount, o.currency)}</Text></Table.Td>
                        <Table.Td>
                          <Menu position="bottom-end">
                            <Menu.Target><ActionIcon size={40} variant="subtle" color="gray" aria-label="操作"><Icon name="more-horizontal" size={16} /></ActionIcon></Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item leftSection={<Icon name="pencil" size={14} />}>编辑</Menu.Item>
                              <Menu.Item leftSection={<Icon name="copy" size={14} />}>复制</Menu.Item>
                              <Menu.Item color="red" leftSection={<Icon name="trash" size={14} />}>删除</Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            )}
          </SectionCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Stack gap="md">
            <SectionCard title="团队动态">
              {loading ? <Skeleton height={200} /> : (
                <Timeline active={1} bulletSize={24} lineWidth={2}>
                  {activity.map((a) => (
                    <Timeline.Item key={a.action} bullet={<Avatar size={22} radius="xl" color="blue">{a.user.slice(0, 1)}</Avatar>} title={<Text size="sm" fw={500}>{a.user}</Text>}>
                      <Text size="sm" c={muted}>{a.action}</Text>
                      <Text size="xs" c={muted} mt={2}>{a.time}</Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              )}
            </SectionCard>
            <SectionCard title="任务进度">
              {loading ? <Skeleton height={140} /> : (
                <Stack gap="md">
                  {tasks.map((t) => (
                    <div key={t.title}>
                      <Group justify="space-between" mb={4}>
                        <Text size="sm" fw={500}>{t.title}</Text>
                        <Text size="xs" c={muted}>{t.owner} · {t.progress}%</Text>
                      </Group>
                      <Progress value={t.progress} size="sm" color={t.progress > 80 ? "teal" : t.progress < 30 ? "orange" : "blue"} />
                    </div>
                  ))}
                </Stack>
              )}
            </SectionCard>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
