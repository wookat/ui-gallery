import { useMemo, useState } from "react"
import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { DatePicker } from "@mui/x-date-pickers"
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
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  Skeleton,
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import orders from "@ui-gallery/spec/mock/orders.json"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"
import { PageHeader, STATUS_LABELS, StatusBadge } from "./shared"

type Order = (typeof orders)[number]
type DataState = "normal" | "loading" | "empty" | "error"

const CHANNEL_LABELS: Record<string, string> = {
  web: "Web",
  ios: "iOS",
  android: "Android",
  api: "API",
}
const channels = Array.from(new Set(orders.map((order) => order.channel)))

export function OrdersPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [channelFilter, setChannelFilter] = useState<string[]>([])
  const [rangeAnchor, setRangeAnchor] = useState<HTMLElement | null>(null)
  const [rangeStart, setRangeStart] = useState<Dayjs | null>(null)
  const [rangeEnd, setRangeEnd] = useState<Dayjs | null>(null)
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
          (status === "all" || order.status === status) &&
          (channelFilter.length === 0 ||
            channelFilter.includes(order.channel)) &&
          (!rangeStart || !dayjs(order.date).isBefore(rangeStart, "day")) &&
          (!rangeEnd || !dayjs(order.date).isAfter(rangeEnd, "day"))
      ),
    [empty, query, status, channelFilter, rangeStart, rangeEnd]
  )
  const rangeLabel =
    rangeStart || rangeEnd
      ? `${rangeStart?.format("MM-DD") ?? "…"} ~ ${rangeEnd?.format("MM-DD") ?? "…"}`
      : "日期范围"
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
          onClick={(event) => {
            setMenuOrder(row)
            setMenuAnchor(event.currentTarget)
          }}
        >
          <Icon name="more-horizontal" size={24} />
        </IconButton>
      ),
    },
  ]
  const dataState: DataState = error
    ? "error"
    : loading
      ? "loading"
      : empty
        ? "empty"
        : "normal"
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
            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel>渠道</InputLabel>
              <Select
                multiple
                value={channelFilter}
                input={<OutlinedInput label="渠道" />}
                onChange={(event) =>
                  setChannelFilter(
                    typeof event.target.value === "string"
                      ? event.target.value.split(",")
                      : event.target.value
                  )
                }
                renderValue={(selected) => (
                  <Stack direction="row" spacing={0.5}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        size="small"
                        label={CHANNEL_LABELS[value] ?? value}
                      />
                    ))}
                  </Stack>
                )}
              >
                {channels.map((channel) => (
                  <MenuItem key={channel} value={channel}>
                    <Checkbox
                      size="small"
                      checked={channelFilter.includes(channel)}
                    />
                    <ListItemText primary={CHANNEL_LABELS[channel] ?? channel} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<Icon name="calendar" />}
              onClick={(event) => setRangeAnchor(event.currentTarget)}
            >
              {rangeLabel}
            </Button>
            <Popover
              open={Boolean(rangeAnchor)}
              anchorEl={rangeAnchor}
              onClose={() => setRangeAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <Stack spacing={2} sx={{ p: 2, width: 280 }}>
                <DatePicker
                  label="开始日期"
                  value={rangeStart}
                  onChange={setRangeStart}
                  maxDate={rangeEnd ?? undefined}
                  slotProps={{
                    textField: { size: "small" },
                    openPickerButton: { sx: { width: 40, height: 40 } },
                  }}
                />
                <DatePicker
                  label="结束日期"
                  value={rangeEnd}
                  onChange={setRangeEnd}
                  minDate={rangeStart ?? undefined}
                  slotProps={{
                    textField: { size: "small" },
                    openPickerButton: { sx: { width: 40, height: 40 } },
                  }}
                />
                <Stack direction="row" justifyContent="space-between">
                  <Button
                    onClick={() => {
                      setRangeStart(null)
                      setRangeEnd(null)
                    }}
                  >
                    清除
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setRangeAnchor(null)}
                  >
                    确定
                  </Button>
                </Stack>
              </Stack>
            </Popover>
            <Button
              variant="outlined"
              onClick={() => setShowCustomer((value) => !value)}
              startIcon={<Icon name="sliders" />}
            >
              列
            </Button>
            <ToggleButtonGroup
              exclusive
              size="medium"
              color="primary"
              aria-label="数据状态"
              value={dataState}
              onChange={(_, value: DataState | null) => {
                if (!value) return
                setLoading(value === "loading")
                setEmpty(value === "empty")
                setError(value === "error")
              }}
              sx={{ "& .MuiToggleButton-root": { minWidth: 48, minHeight: 40 } }}
            >
              <ToggleButton value="normal">正常</ToggleButton>
              <ToggleButton value="loading">加载</ToggleButton>
              <ToggleButton value="empty">空</ToggleButton>
              <ToggleButton value="error">错误</ToggleButton>
            </ToggleButtonGroup>
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
        <Card>
          <CardContent>
            <Stack spacing={1.5}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} variant="rounded" height={44} />
              ))}
            </Stack>
          </CardContent>
        </Card>
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
