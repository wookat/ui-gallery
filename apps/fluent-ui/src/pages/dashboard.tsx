import { useEffect, useState } from "react"
import { DonutChart, LineChart, ResponsiveContainer, Sparkline, VerticalBarChart } from "@fluentui/react-charts"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import {
  Avatar,
  Badge,
  Body1,
  Button,
  Caption1,
  Card,
  CardHeader,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  ProgressBar,
  Skeleton,
  SkeletonItem,
  Tab,
  TabList,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Title3,
  makeStyles,
  tokens,
} from "@fluentui/react-components"
import { Icon } from "@/lib/icon"
import { Money, PageHeader, SectionCard, StatusBadge, useLayoutStyles } from "./shared"

const useStyles = makeStyles({
  statHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: tokens.spacingHorizontalS },
  charts: { display: "grid", gap: tokens.spacingHorizontalM, gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", "@media (max-width: 1023px)": { gridTemplateColumns: "minmax(0, 1fr)" } },
  timeline: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalM, position: "relative", paddingLeft: tokens.spacingHorizontalXS },
  timelineItem: { display: "flex", gap: tokens.spacingHorizontalS, alignItems: "flex-start" },
  timelineDot: { width: "8px", height: "8px", marginTop: "6px", borderRadius: "50%", backgroundColor: tokens.colorBrandBackground, flexShrink: 0 },
  task: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalXS },
  chartBox: { width: "100%", minWidth: 0, overflow: "hidden" },
})

const formatValue = (item: (typeof stats)[number]) => (item.unit === "CNY" ? `¥${item.value.toLocaleString()}` : `${item.value}${item.unit ?? ""}`)

export function DashboardPage() {
  const s = useStyles()
  const l = useLayoutStyles()
  const [period, setPeriod] = useState<string>("week")
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 600)
    return () => window.clearTimeout(timer)
  }, [period])

  const lineData = {
    chartTitle: "收入趋势",
    lineChartData: [
      { legend: "收入 (k¥)", color: tokens.colorBrandBackground, data: series.months.map((month, index) => ({ x: new Date(2026, index + 2, 1), y: series.revenue[index], xAxisCalloutData: month })) },
      { legend: "订单 (×10)", color: tokens.colorPaletteTealForeground2, data: series.months.map((month, index) => ({ x: new Date(2026, index + 2, 1), y: series.orders[index] / 10, xAxisCalloutData: month })) },
    ],
  }
  const barData = series.months.map((month, index) => ({ x: month, y: series.orders[index], legend: "订单", color: tokens.colorBrandBackground2 }))
  const donutData = { chartTitle: "渠道占比", chartData: series.byChannel.map((item, index) => ({ legend: item.name, data: item.value, color: [tokens.colorBrandBackground, tokens.colorPaletteTealForeground2, tokens.colorPaletteMarigoldForeground2, tokens.colorPalettePurpleForeground2][index] })) }

  return (
    <div className={l.stack}>
      <PageHeader title="仪表盘" description="欢迎回来，林晓。这里是今天的业务概况。" action={<Button appearance="primary" icon={<Icon name="plus" />}>新建项目</Button>} />
      <TabList selectedValue={period} onTabSelect={(_, data) => { setPeriod(String(data.value)); setLoading(true) }}>
        <Tab value="day">日</Tab>
        <Tab value="week">周</Tab>
        <Tab value="month">月</Tab>
      </TabList>
      <div className={l.grid4}>
        {stats.map((item) => (
          <Card key={item.key} className={l.card}>
            {loading ? (
              <Skeleton aria-label="加载中">
                <div className={l.stackS}><SkeletonItem size={12} style={{ width: "40%" }} /><SkeletonItem size={28} style={{ width: "70%" }} /><SkeletonItem size={24} /></div>
              </Skeleton>
            ) : (
              <>
                <div className={s.statHeader}>
                  <Caption1 className={l.muted}>{item.label}</Caption1>
                  <Badge appearance="tint" color={item.delta > 0 ? "success" : "danger"} icon={<Icon name={item.delta > 0 ? "trending-up" : "trending-down"} size={12} />}>{item.delta > 0 ? "+" : ""}{item.delta}%</Badge>
                </div>
                <Title3 as="p">{formatValue(item)}</Title3>
                <Sparkline data={{ chartTitle: item.label, lineChartData: [{ legend: item.label, color: item.delta > 0 ? tokens.colorPaletteGreenForeground1 : tokens.colorPaletteRedForeground1, data: item.trend.map((value, index) => ({ x: index, y: value })) }] }} width={160} height={28} showLegend={false} />
              </>
            )}
          </Card>
        ))}
      </div>
      <div className={s.charts}>
        <SectionCard title="收入趋势" description="过去 7 个月的收入与订单">
          <div className={s.chartBox}>
            {loading ? <Skeleton><SkeletonItem size={128} /></Skeleton> : <ResponsiveContainer height={260}><LineChart data={lineData} legendsOverflowText="更多" hideTickOverlap tickValues={series.months.map((_, index) => new Date(2026, index + 2, 1))} customDateTimeFormatter={(date) => series.months[date.getMonth() - 2] ?? ""} /></ResponsiveContainer>}
          </div>
        </SectionCard>
        <SectionCard title="渠道占比" description="按下单渠道">
          <div className={s.chartBox}>
            {loading ? <Skeleton><SkeletonItem size={128} /></Skeleton> : <ResponsiveContainer height={260}><DonutChart data={donutData} innerRadius={55} valueInsideDonut={`${series.byChannel.reduce((sum, item) => sum + item.value, 0)}%`} hideLabels /></ResponsiveContainer>}
          </div>
        </SectionCard>
      </div>
      <div className={s.charts}>
        <SectionCard title="月度订单" description="柱状图">
          <div className={s.chartBox}>
            {loading ? <Skeleton><SkeletonItem size={128} /></Skeleton> : <ResponsiveContainer height={220}><VerticalBarChart data={barData} hideLegend barWidth={24} hideTickOverlap /></ResponsiveContainer>}
          </div>
        </SectionCard>
        <SectionCard title="任务进度" description="本周团队执行情况">
          <div className={l.stackM}>
            {tasks.map((task) => (
              <div className={s.task} key={task.title}>
                <div className={l.rowBetween}><Body1>{task.title}</Body1><Caption1 className={l.muted}>{task.owner} · {task.progress}%</Caption1></div>
                <ProgressBar value={task.progress / 100} thickness="large" color={task.progress > 80 ? "success" : task.progress < 30 ? "warning" : "brand"} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <div className={l.grid2}>
        <SectionCard title="最近订单" description="最新的业务交易">
          <div className={l.scrollX}>
            <Table size="small" aria-label="最近订单">
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>订单</TableHeaderCell>
                  <TableHeaderCell>客户</TableHeaderCell>
                  <TableHeaderCell>状态</TableHeaderCell>
                  <TableHeaderCell style={{ textAlign: "right" }}>金额</TableHeaderCell>
                  <TableHeaderCell style={{ width: 48 }} />
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell><Text weight="semibold">{order.id}</Text></TableCell>
                    <TableCell><TableCellLayout media={<Avatar name={order.customer} color="colorful" size={24} />}>{order.customer}</TableCellLayout></TableCell>
                    <TableCell><StatusBadge value={order.status} /></TableCell>
                    <TableCell style={{ textAlign: "right" }}><Money value={order.amount} /></TableCell>
                    <TableCell>
                      <Menu>
                        <MenuTrigger disableButtonEnhancement><Button appearance="subtle" size="small" icon={<Icon name="more-horizontal" />} aria-label="操作" /></MenuTrigger>
                        <MenuPopover><MenuList><MenuItem icon={<Icon name="eye" />}>查看</MenuItem><MenuItem icon={<Icon name="pencil" />}>编辑</MenuItem><MenuItem icon={<Icon name="trash" />}>删除</MenuItem></MenuList></MenuPopover>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
        <SectionCard title="团队动态" description="团队最近发生的事情">
          <div className={s.timeline}>
            {activity.map((item, index) => (
              <div className={s.timelineItem} key={`${item.user}-${index}`}>
                <span className={s.timelineDot} />
                <Avatar name={item.user} color="colorful" size={28} />
                <div style={{ minWidth: 0 }}>
                  <Body1><Text weight="semibold">{item.user}</Text> {item.action}</Body1>
                  <Caption1 className={l.muted} block>{item.time}</Caption1>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <Card className={l.card}>
        <CardHeader header={<Text weight="semibold">数据来源</Text>} description={<Caption1 className={l.muted}>所有数据来自 @ui-gallery/spec mock JSON，无运行时网络请求。</Caption1>} />
      </Card>
    </div>
  )
}
