import { useMemo, useState } from "react"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Snackbar,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material"
import orders from "@ui-gallery/spec/mock/orders.json"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"
import { PageHeader, STATUS_LABELS, StatusBadge } from "./shared"

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
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [menuOrder, setMenuOrder] = useState<Order | null>(null)
  const [drawerTab, setDrawerTab] = useState("details")
  const [note, setNote] = useState("")
  const [mobilePage, setMobilePage] = useState(0)
  const [mobileSelected, setMobileSelected] = useState<string[]>([])
  const [snack, setSnack] = useState(false)
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
    {
      field: "actions",
      headerName: "操作",
      width: 80,
      sortable: false,
      renderCell: ({ row }) => (
        <IconButton
          aria-label="操作"
          size="small"
          onClick={(event) => {
            setMenuOrder(row)
            setMenuAnchor(event.currentTarget)
          }}
        >
          <Icon name="more-horizontal" />
        </IconButton>
      ),
    },
  ]
  const mobileRows = filtered.slice(mobilePage * 10, mobilePage * 10 + 10)
  const allMobileSelected =
    mobileRows.length > 0 &&
    mobileRows.every((row) => mobileSelected.includes(row.id))
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
                {Object.entries(STATUS_LABELS)
                  .filter(([key]) =>
                    orders.some((order) => order.status === key)
                  )
                  .map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
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
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10, 25]}
              sx={{ height: 520 }}
            />
          </Box>
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <TableContainer sx={{ maxHeight: 480 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={allMobileSelected}
                        indeterminate={
                          mobileSelected.length > 0 && !allMobileSelected
                        }
                        onChange={(event) =>
                          setMobileSelected(
                            event.target.checked
                              ? Array.from(
                                  new Set([
                                    ...mobileSelected,
                                    ...mobileRows.map((row) => row.id),
                                  ])
                                )
                              : mobileSelected.filter(
                                  (id) =>
                                    !mobileRows.some((row) => row.id === id)
                                )
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>订单号</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell align="right">金额</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mobileRows.map((order) => (
                    <TableRow
                      key={order.id}
                      onClick={() => setSelected(order)}
                      hover
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={mobileSelected.includes(order.id)}
                          onClick={(event) => event.stopPropagation()}
                          onChange={(event) =>
                            setMobileSelected((current) =>
                              event.target.checked
                                ? [...current, order.id]
                                : current.filter((id) => id !== order.id)
                            )
                          }
                        />
                      </TableCell>
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
            <TablePagination
              component="div"
              count={filtered.length}
              page={mobilePage}
              onPageChange={(_, page) => setMobilePage(page)}
              rowsPerPage={10}
              rowsPerPageOptions={[10]}
            />
          </Box>
        </>
      )}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setSelected(menuOrder)
            setMenuAnchor(null)
          }}
        >
          编辑
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelected(menuOrder)
            setConfirm(true)
            setMenuAnchor(null)
          }}
        >
          删除
        </MenuItem>
      </Menu>
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
          <Tabs
            value={drawerTab}
            onChange={(_, value) => setDrawerTab(value)}
            sx={{ mt: 2 }}
          >
            <Tab value="details" label="详情" />
            <Tab value="notes" label="备注" />
          </Tabs>
          {selected && drawerTab === "details" ? (
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
          ) : (
            <TextField
              multiline
              minRows={8}
              fullWidth
              sx={{ mt: 3 }}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              label="备注"
            />
          )}
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
              setSnack(true)
            }}
          >
            确认删除
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snack}
        autoHideDuration={3000}
        onClose={() => setSnack(false)}
      >
        <Alert severity="success" onClose={() => setSnack(false)}>
          订单已删除
        </Alert>
      </Snackbar>
    </Stack>
  )
}
