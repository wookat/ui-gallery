import { useMemo, useState } from "react"
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
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
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
  const [period, setPeriod] = useState<"day" | "week" | "month">("month")
  const [loading, setLoading] = useState(false)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const chart = useMemo(() => {
    const count = period === "day" ? 2 : period === "week" ? 4 : 7
    return {
      months: series.months.slice(-count),
      revenue: series.revenue.slice(-count),
      orders: series.orders.slice(-count),
    }
  }, [period])
  return (
    <Stack spacing={3}>
      <PageHeader
        title="仪表盘"
        description="欢迎回来，林晓。这里是今天的业务概况。"
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">加载状态</Typography>
            <Switch
              checked={loading}
              onChange={(event) => setLoading(event.target.checked)}
            />
            <Button variant="contained" startIcon={<Icon name="plus" />}>
              新建项目
            </Button>
          </Stack>
        }
      />
      {loading ? (
        <Stack spacing={2}>
          <Grid container spacing={2}>
            {stats.map((item) => (
              <Grid key={item.key} size={{ xs: 12, sm: 6, xl: 3 }}>
                <Skeleton variant="rounded" height={150} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rounded" height={360} />
        </Stack>
      ) : (
        <>
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
                <CardHeader
                  title="收入趋势"
                  subheader="过去 7 个月的收入与订单"
                  action={
                    <Tabs
                      value={period}
                      onChange={(_, value: typeof period) => setPeriod(value)}
                      sx={{ minHeight: 36 }}
                    >
                      <Tab value="day" label="日" sx={{ minHeight: 36 }} />
                      <Tab value="week" label="周" sx={{ minHeight: 36 }} />
                      <Tab value="month" label="月" sx={{ minHeight: 36 }} />
                    </Tabs>
                  }
                />
                <CardContent sx={{ minWidth: 0, width: "100%" }}>
                  <Box sx={{ width: "100%", overflow: "hidden" }}>
                    <LineChart
                      height={300}
                      series={[
                        {
                          data: chart.revenue,
                          label: "收入",
                          yAxisId: "revenue",
                        },
                        {
                          data: chart.orders,
                          label: "订单",
                          yAxisId: "orders",
                        },
                      ]}
                      xAxis={[{ data: chart.months, scaleType: "point" }]}
                      yAxis={[
                        { id: "revenue", position: "left" },
                        { id: "orders", position: "right" },
                      ]}
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
                <List
                  dense
                  disablePadding
                  sx={{ display: { xs: "block", sm: "none" }, px: 1 }}
                >
                  {orders.slice(0, 5).map((order) => (
                    <ListItem
                      key={order.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="操作"
                          onClick={(event) => setAnchor(event.currentTarget)}
                        >
                          <Icon name="more-horizontal" size={24} />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                          }}
                        >
                          {order.customer.slice(0, 1)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        slotProps={{ primary: { component: "div" } }}
                        primary={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <span>{order.customer}</span>
                            <StatusBadge value={order.status} />
                          </Stack>
                        }
                        secondary={`${order.id} · ¥${order.amount.toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
                <TableContainer
                  sx={{
                    overflowX: "auto",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>订单</TableCell>
                        <TableCell>客户</TableCell>
                        <TableCell>状态</TableCell>
                        <TableCell align="right">金额</TableCell>
                        <TableCell align="right">操作</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.slice(0, 5).map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Avatar
                                sx={{
                                  width: 28,
                                  height: 28,
                                  bgcolor: "primary.main",
                                  color: "primary.contrastText",
                                }}
                              >
                                {order.customer.slice(0, 1)}
                              </Avatar>
                              {order.customer}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <StatusBadge value={order.status} />
                          </TableCell>
                          <TableCell align="right">
                            ¥{order.amount.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              aria-label="操作"
                              onClick={(event) =>
                                setAnchor(event.currentTarget)
                              }
                            >
                              <Icon name="more-horizontal" size={24} />
                            </IconButton>
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
                  <Stack spacing={0}>
                    {activity.slice(0, 5).map((item, index) => (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        key={`${item.user}-${index}`}
                      >
                        <Stack alignItems="center" sx={{ width: 16 }}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                              mt: 0.75,
                            }}
                          />
                          {index < 4 ? (
                            <Box
                              sx={{
                                width: 1,
                                flex: 1,
                                bgcolor: "divider",
                                minHeight: 42,
                              }}
                            />
                          ) : null}
                        </Stack>
                        <Box sx={{ minWidth: 0, pb: 2 }}>
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
                      <LinearProgress
                        variant="determinate"
                        value={task.progress}
                      />
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        <MenuItem onClick={() => setAnchor(null)}>查看</MenuItem>
        <MenuItem onClick={() => setAnchor(null)}>删除</MenuItem>
      </Menu>
    </Stack>
  )
}
