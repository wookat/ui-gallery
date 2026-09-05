import { useState } from "react"
import { LineChart, PieChart } from "@mui/x-charts"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  LinearProgress,
  Skeleton,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"
import { PageHeader, StatusBadge } from "./shared"

export function DashboardPage() {
  const [tab, setTab] = useState("overview")
  return (
    <Stack spacing={3}>
      <PageHeader
        title="仪表盘"
        description="欢迎回来，林晓。这里是今天的业务概况。"
        action={
          <Button variant="contained" startIcon={<Icon name="plus" />}>
            新建项目
          </Button>
        }
      />
      <Grid container spacing={2}>
        {stats.map((item) => (
          <Grid key={item.key} size={{ xs: 12, sm: 6, xl: 3 }}>
            <Card>
              <CardHeader
                title={
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${item.delta > 0 ? "+" : ""}${item.delta}%`}
                      color={item.delta > 0 ? "success" : "default"}
                    />
                  </Stack>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="h5">
                  {item.unit === "CNY"
                    ? `¥${item.value.toLocaleString()}`
                    : `${item.value}${item.unit ?? ""}`}
                </Typography>
                <LineChart
                  height={58}
                  series={[{ data: item.trend, showMark: false }]}
                  xAxis={[
                    {
                      data: item.trend.map((_, index) => index),
                      scaleType: "point",
                      position: "none",
                    },
                  ]}
                  yAxis={[{ position: "none" }]}
                  margin={{ top: 4, bottom: 4, left: 4, right: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, xl: 8 }}>
          <Card>
            <CardHeader title="收入趋势" subheader="过去 7 个月的收入与订单" />
            <CardContent sx={{ minWidth: 0, width: "100%" }}>
              <Box sx={{ width: "100%", overflow: "hidden" }}>
                <LineChart
                  height={300}
                  series={[
                    { data: series.revenue, label: "收入" },
                    { data: series.orders, label: "订单" },
                  ]}
                  xAxis={[{ data: series.months, scaleType: "point" }]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, xl: 4 }}>
          <Card>
            <CardHeader title="渠道分布" subheader="本月订单来源" />
            <CardContent>
              <PieChart
                height={300}
                series={[
                  {
                    data: series.byChannel.map((item, id) => ({
                      id,
                      value: item.value,
                      label: item.name,
                    })),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, xl: 7 }}>
          <Card>
            <CardHeader title="最近订单" subheader="最新的业务交易" />
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>订单</TableCell>
                    <TableCell>客户</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell align="right">金额</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.slice(0, 5).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <StatusBadge value={order.status} />
                      </TableCell>
                      <TableCell align="right">
                        ¥{order.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, xl: 5 }}>
          <Card>
            <CardHeader title="团队动态" subheader="团队最近发生的事情" />
            <CardContent>
              <Stack spacing={2}>
                {activity.slice(0, 5).map((item, index) => (
                  <Stack
                    direction="row"
                    spacing={1.5}
                    key={`${item.user}-${index}`}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {item.user.slice(0, 1)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2">
                        <b>{item.user}</b> {item.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.time}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card>
        <CardHeader title="任务进度" subheader="本周团队执行情况" />
        <CardContent>
          <Grid container spacing={2}>
            {tasks.map((task) => (
              <Grid size={{ xs: 12, sm: 6 }} key={task.title}>
                <Stack spacing={0.75}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{task.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task.progress}%
                    </Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={task.progress} />
                </Stack>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <Tabs value={tab} onChange={(_, value: string) => setTab(value)}>
          <Tab value="overview" label="概览" />
          <Tab value="loading" label="加载状态" />
        </Tabs>
        {tab === "overview" ? (
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              数据已从本地 mock JSON 加载。
            </Typography>
          </CardContent>
        ) : (
          <CardContent>
            <Stack spacing={1}>
              <Skeleton width="35%" />
              <Skeleton width="70%" />
              <Skeleton width="50%" />
            </Stack>
          </CardContent>
        )}
      </Card>
    </Stack>
  )
}
