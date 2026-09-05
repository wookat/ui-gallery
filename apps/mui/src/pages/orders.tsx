import { useMemo, useState } from "react"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import orders from "@ui-gallery/spec/mock/orders.json"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"
import { PageHeader, StatusBadge } from "./shared"

type Order = (typeof orders)[number]

export function OrdersPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [selected, setSelected] = useState<Order | null>(null)
  const [showCustomer, setShowCustomer] = useState(true)
  const [empty, setEmpty] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const filtered = useMemo(
    () =>
      orders.filter(
        (order) =>
          !empty &&
          order.id.toLowerCase().includes(query.toLowerCase()) &&
          (status === "all" || order.status === status)
      ),
    [empty, query, status]
  )
  const columns: GridColDef<Order>[] = [
    { field: "id", headerName: "订单号", width: 130 },
    ...(showCustomer
      ? [
          {
            field: "customer",
            headerName: "客户",
            width: 140,
          } satisfies GridColDef<Order>,
        ]
      : []),
    {
      field: "status",
      headerName: "状态",
      width: 120,
      renderCell: ({ value }) => <StatusBadge value={String(value)} />,
    },
    { field: "date", headerName: "日期", width: 130 },
    {
      field: "amount",
      headerName: "金额",
      width: 130,
      align: "right",
      headerAlign: "right",
      valueFormatter: (value: number) => `¥${value.toLocaleString()}`,
    },
  ]
  return (
    <Stack spacing={3}>
      <PageHeader
        title="订单管理"
        description="搜索、筛选并查看全部订单。"
        action={
          <Button variant="outlined" startIcon={<Icon name="download" />}>
            导出
          </Button>
        }
      />
      <Alert severity="info" icon={<Icon name="info" />}>
        所有订单来自 packages/spec/mock/orders.json，无运行时网络请求。
      </Alert>
      <Card>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            useFlexGap
            flexWrap="wrap"
          >
            <TextField
              size="small"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索订单号..."
              sx={{ flex: 1, minWidth: 180 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>状态</InputLabel>
              <Select
                value={status}
                label="状态"
                onChange={(event) => setStatus(event.target.value)}
              >
                <MenuItem value="all">全部状态</MenuItem>
                {["paid", "pending", "shipped", "failed", "refunded"].map(
                  (value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<Icon name="calendar" />}>
              日期范围
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowCustomer((value) => !value)}
              startIcon={<Icon name="sliders" />}
            >
              列
            </Button>
            <Stack direction="row" spacing={0.5}>
              <Chip
                label="正常"
                color={!loading && !empty && !error ? "primary" : "default"}
                onClick={() => {
                  setLoading(false)
                  setEmpty(false)
                  setError(false)
                }}
              />
              <Chip label="加载" onClick={() => setLoading(true)} />
              <Chip
                label="空"
                onClick={() => {
                  setLoading(false)
                  setEmpty(true)
                  setError(false)
                }}
              />
              <Chip
                label="错误"
                onClick={() => {
                  setLoading(false)
                  setError(true)
                  setEmpty(false)
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      {error ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={() => setError(false)}>
              重试
            </Button>
          }
        >
          订单加载失败，请重试。
        </Alert>
      ) : loading ? (
        <Stack spacing={1}>
          {[1, 2, 3].map((item) => (
            <Box
              key={item}
              sx={{ height: 52, bgcolor: "action.hover", borderRadius: 1 }}
            />
          ))}
        </Stack>
      ) : empty ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <Icon name="inbox" size={42} color="disabled" />
            <Typography sx={{ mt: 1 }}>暂无数据</Typography>
            <Button sx={{ mt: 2 }} onClick={() => setEmpty(false)}>
              重试
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: "100%",
              minWidth: 0,
            }}
          >
            <DataGrid
              rows={filtered}
              columns={columns}
              getRowId={(row) => row.id}
              checkboxSelection
              disableRowSelectionOnClick
              sx={{ height: 520 }}
            />
          </Box>
          <TableContainer
            sx={{ display: { xs: "block", md: "none" }, overflowX: "auto" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>订单号</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell align="right">金额</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.slice(0, 10).map((order) => (
                  <TableRow
                    key={order.id}
                    onClick={() => setSelected(order)}
                    hover
                  >
                    <TableCell>{order.id}</TableCell>
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              {filtered.length} 条订单
            </Typography>
            <Pagination count={3} color="primary" />
          </Stack>
        </>
      )}
      <Drawer
        anchor="right"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      >
        <Box sx={{ width: { xs: "min(100vw, 380px)", sm: 380 }, p: 3 }}>
          <Typography variant="h6">{selected?.id ?? "订单详情"}</Typography>
          <Typography variant="body2" color="text.secondary">
            查看订单的完整信息与操作。
          </Typography>
          {selected ? (
            <Stack spacing={2.5} sx={{ mt: 3 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">客户</Typography>
                <Typography>{selected.customer}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">状态</Typography>
                <StatusBadge value={selected.status} />
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">金额</Typography>
                <Typography>¥{selected.amount.toLocaleString()}</Typography>
              </Stack>
              <Button
                color="error"
                variant="contained"
                onClick={() => setConfirm(true)}
                startIcon={<Icon name="trash" />}
              >
                删除订单
              </Button>
            </Stack>
          ) : null}
        </Box>
      </Drawer>
      <Dialog open={confirm} onClose={() => setConfirm(false)}>
        <DialogTitle>确认删除订单？</DialogTitle>
        <DialogContent>此操作无法撤销。</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(false)}>取消</Button>
          <Button
            color="error"
            onClick={() => {
              setConfirm(false)
              setSelected(null)
            }}
          >
            确认删除
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
