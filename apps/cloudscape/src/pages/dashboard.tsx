import { useEffect, useState } from "react"
import Badge from "@cloudscape-design/components/badge"
import BarChart from "@cloudscape-design/components/bar-chart"
import Box from "@cloudscape-design/components/box"
import Button from "@cloudscape-design/components/button"
import ButtonDropdown from "@cloudscape-design/components/button-dropdown"
import ColumnLayout from "@cloudscape-design/components/column-layout"
import Container from "@cloudscape-design/components/container"
import ContentLayout from "@cloudscape-design/components/content-layout"
import Grid from "@cloudscape-design/components/grid"
import Header from "@cloudscape-design/components/header"
import LineChart from "@cloudscape-design/components/line-chart"
import PieChart from "@cloudscape-design/components/pie-chart"
import ProgressBar from "@cloudscape-design/components/progress-bar"
import SegmentedControl from "@cloudscape-design/components/segmented-control"
import Skeleton from "@cloudscape-design/components/skeleton"
import SpaceBetween from "@cloudscape-design/components/space-between"
import Steps from "@cloudscape-design/components/steps"
import Table from "@cloudscape-design/components/table"
import Tabs from "@cloudscape-design/components/tabs"

import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"

import { iconProps } from "@/lib/icons"
import { useAppNav } from "@/lib/nav"
import { money, OrderStatus, PageHeader, PersonAvatar } from "./shared"

type Order = (typeof orders)[number]
const PERIODS = [
  { id: "day", text: "日" },
  { id: "week", text: "周" },
  { id: "month", text: "月" },
]

function Sparkline({ points }: { points: number[] }) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const w = 120
  const h = 36
  const coords = points
    .map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / (max - min || 1)) * (h - 4) - 2}`)
    .join(" ")
  return (
    <svg className="gallery-sparkline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline points={coords} />
    </svg>
  )
}

function StatValue({ value, unit }: { value: number; unit?: string }) {
  if (unit === "CNY") return <>{money(value)}</>
  if (unit === "%") return <>{value}%</>
  return <>{value.toLocaleString("zh-CN")}</>
}

export function DashboardPage() {
  const { href, follow } = useAppNav()
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("month")
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 600)
    return () => window.clearTimeout(t)
  }, [])

  const recent = orders.slice(0, 5)
  const xDomain = series.months

  return (
    <ContentLayout
      header={
        <PageHeader
          title="仪表盘"
          description="业务概览与团队动态"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <SegmentedControl
                selectedId={period}
                onChange={({ detail }) => setPeriod(detail.selectedId)}
                label="统计周期"
                options={PERIODS}
              />
              <Button {...iconProps("download")}>导出</Button>
            </SpaceBetween>
          }
        />
      }
    >
      <SpaceBetween size="l">
        <Grid gridDefinition={stats.map(() => ({ colspan: { default: 12, xs: 6, m: 3 } }))}>
          {stats.map((stat) => (
            <Container key={stat.key}>
              {loading ? (
                <SpaceBetween size="xs">
                  <Skeleton width="40%" />
                  <Skeleton height="32px" width="70%" />
                  <Skeleton height="36px" />
                </SpaceBetween>
              ) : (
                <SpaceBetween size="xs">
                  <Box variant="awsui-key-label">{stat.label}</Box>
                  <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                    <Box variant="awsui-value-large">
                      <StatValue value={stat.value} unit={stat.unit} />
                    </Box>
                    <Badge color={stat.delta >= 0 ? "green" : "red"}>
                      {stat.delta >= 0 ? "+" : ""}
                      {stat.delta}%
                    </Badge>
                  </SpaceBetween>
                  <Sparkline points={stat.trend} />
                </SpaceBetween>
              )}
            </Container>
          ))}
        </Grid>

        <Grid gridDefinition={[{ colspan: { default: 12, m: 8 } }, { colspan: { default: 12, m: 4 } }]}>
          <Container header={<Header variant="h2">收入与订单趋势</Header>}>
            <Tabs
              tabs={[
                {
                  id: "line",
                  label: "收入折线",
                  content: (
                    <LineChart
                      height={220}
                      hideFilter
                      xScaleType="categorical"
                      xDomain={xDomain}
                      series={[
                        {
                          title: "收入（千元）",
                          type: "line",
                          data: series.months.map((m, i) => ({ x: m, y: series.revenue[i] })),
                        },
                      ]}
                      statusType={loading ? "loading" : "finished"}
                      loadingText="加载中"
                      ariaLabel="收入趋势"
                      i18nStrings={{ xTickFormatter: (x) => String(x) }}
                    />
                  ),
                },
                {
                  id: "bar",
                  label: "订单柱状",
                  content: (
                    <BarChart
                      height={220}
                      hideFilter
                      xScaleType="categorical"
                      xDomain={xDomain}
                      series={[
                        {
                          title: "订单数",
                          type: "bar",
                          data: series.months.map((m, i) => ({ x: m, y: series.orders[i] })),
                        },
                      ]}
                      statusType={loading ? "loading" : "finished"}
                      loadingText="加载中"
                      ariaLabel="订单趋势"
                    />
                  ),
                },
              ]}
            />
          </Container>
          <Container header={<Header variant="h2">渠道占比</Header>}>
            <PieChart
              variant="donut"
              size="medium"
              hideFilter
              data={series.byChannel.map((c) => ({ title: c.name, value: c.value }))}
              innerMetricValue={`${series.byChannel.reduce((s, c) => s + c.value, 0)}%`}
              innerMetricDescription="总计"
              detailPopoverContent={(d) => [{ key: "占比", value: `${d.value}%` }]}
              segmentDescription={(d) => `${d.value}%`}
              statusType={loading ? "loading" : "finished"}
              loadingText="加载中"
              ariaLabel="渠道占比"
            />
          </Container>
        </Grid>

        <Table<Order>
          variant="container"
          loading={loading}
          loadingText="加载订单"
          header={
            <Header
              variant="h2"
              counter={`(${recent.length})`}
              actions={
                <Button href={href("/orders")} onFollow={follow} variant="normal">
                  查看全部
                </Button>
              }
            >
              最近订单
            </Header>
          }
          items={recent}
          trackBy="id"
          columnDefinitions={[
            { id: "id", header: "订单号", cell: (o) => o.id, isRowHeader: true },
            {
              id: "customer",
              header: "客户",
              cell: (o) => (
                <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                  <PersonAvatar name={o.customer} size="small" />
                  <span>{o.customer}</span>
                </SpaceBetween>
              ),
            },
            { id: "product", header: "产品", cell: (o) => o.product },
            { id: "status", header: "状态", cell: (o) => <OrderStatus status={o.status} /> },
            { id: "amount", header: "金额", cell: (o) => <Box textAlign="right">{money(o.amount, o.currency)}</Box> },
            {
              id: "actions",
              header: "操作",
              cell: () => (
                <ButtonDropdown
                  variant="inline-icon"
                  ariaLabel="更多操作"
                  expandToViewport
                  items={[
                    { id: "view", text: "查看" },
                    { id: "edit", text: "编辑" },
                    { id: "delete", text: "删除" },
                  ]}
                />
              ),
            },
          ]}
        />

        <Grid gridDefinition={[{ colspan: { default: 12, m: 6 } }, { colspan: { default: 12, m: 6 } }]}>
          <Container header={<Header variant="h2">团队动态</Header>}>
            {loading ? (
              <SpaceBetween size="s">
                {activity.map((_, i) => (
                  <Skeleton key={i} />
                ))}
              </SpaceBetween>
            ) : (
              <Steps
                ariaLabel="团队动态"
                steps={activity.map((a, i) => ({
                  status: i === 0 ? "in-progress" : "success",
                  header: (
                    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                      <PersonAvatar name={a.user} size="small" />
                      <span>
                        <strong>{a.user}</strong> {a.action}
                      </span>
                    </SpaceBetween>
                  ),
                  details: (
                    <Box variant="small" color="text-body-secondary">
                      {a.time}
                    </Box>
                  ),
                }))}
              />
            )}
          </Container>
          <Container header={<Header variant="h2">任务进度</Header>}>
            <ColumnLayout columns={1} borders="horizontal">
              {tasks.map((task) => (
                <ProgressBar
                  key={task.title}
                  value={task.progress}
                  label={task.title}
                  description={`负责人：${task.owner}`}
                  additionalInfo={loading ? undefined : `${task.progress}% 完成`}
                  status={task.progress >= 100 ? "success" : "in-progress"}
                />
              ))}
            </ColumnLayout>
          </Container>
        </Grid>
      </SpaceBetween>
    </ContentLayout>
  )
}
