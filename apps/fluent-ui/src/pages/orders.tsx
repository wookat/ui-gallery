import { useEffect, useMemo, useState } from "react"
import ordersData from "@ui-gallery/spec/mock/orders.json"
import {
  Avatar,
  Badge,
  Body1,
  Button,
  Caption1,
  Checkbox,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  Field,

  Menu,
  MenuItem,
  MenuItemCheckbox,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Option,
  OverlayDrawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  SearchBox,
  Skeleton,
  SkeletonItem,
  Tab,
  TabList,
  TableCellLayout,
  Text,
  Textarea,
  Toast,
  ToastBody,
  ToastTitle,
  Tooltip,
  createTableColumn,
  makeStyles,
  tokens,
  useToastController,
  type TableColumnDefinition,
  type TableColumnId,
  type SortDirection,
} from "@fluentui/react-components"
import { DatePicker } from "@fluentui/react-datepicker-compat"
import { Icon } from "@/lib/icon"
import { Money, PageHeader, StatusBadge, useControlSize, useIsMobile, useLayoutStyles } from "./shared"

type Order = (typeof ordersData)[number]
const statuses = ["paid", "pending", "shipped", "refunded", "failed"] as const
const statusLabel: Record<string, string> = { paid: "已支付", pending: "待处理", shipped: "已发货", refunded: "已退款", failed: "失败" }
const channels = ["web", "ios", "android", "api"] as const
const PAGE_SIZE = 10

const useStyles = makeStyles({
  toolbar: { display: "flex", gap: tokens.spacingHorizontalS, flexWrap: "wrap", alignItems: "center" },
  grow: { flex: "1 1 200px", minWidth: 0 },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: tokens.spacingHorizontalS },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", gap: tokens.spacingVerticalS, padding: tokens.spacingVerticalXXXL, color: tokens.colorNeutralForeground3, textAlign: "center" },
  detail: { display: "grid", gridTemplateColumns: "auto 1fr", gap: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}` },
  mobileCard: { padding: tokens.spacingHorizontalM, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, display: "flex", flexDirection: "column", gap: tokens.spacingVerticalXS, backgroundColor: tokens.colorNeutralBackground1 },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, overflowX: "auto", backgroundColor: tokens.colorNeutralBackground1 },
})

export function OrdersPage() {
  const s = useStyles()
  const l = useLayoutStyles()
  const isMobile = useIsMobile()
  const ctl = useControlSize()
  const { dispatchToast } = useToastController("acme-toaster")
  const [state, setState] = useState<"loading" | "ready" | "error">("loading")
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<string[]>([])
  const [channel, setChannel] = useState<string[]>([])
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [visible, setVisible] = useState<string[]>(["customer", "product", "status", "amount", "date", "channel"])
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<{ column: TableColumnId; direction: SortDirection }>({ column: "date", direction: "descending" })
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [active, setActive] = useState<Order | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Order | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setState("ready"), 500)
    return () => window.clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ordersData
      .filter((o) => (!q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q)) && (status.length === 0 || status.includes(o.status)) && (channel.length === 0 || channel.includes(o.channel)) && (!date || o.date === date.toISOString().slice(0, 10)))
      .sort((a, b) => {
        const key = sort.column as keyof Order
        const av = a[key]
        const bv = b[key]
        const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv))
        return sort.direction === "ascending" ? cmp : -cmp
      })
  }, [query, status, channel, date, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  useEffect(() => setPage(1), [query, status, channel, date])

  const notify = (title: string, body?: string) => dispatchToast(<Toast><ToastTitle>{title}</ToastTitle>{body ? <ToastBody>{body}</ToastBody> : null}</Toast>, { intent: "success" })

  const columns: TableColumnDefinition<Order>[] = [
    createTableColumn<Order>({ columnId: "id", compare: (a, b) => a.id.localeCompare(b.id), renderHeaderCell: () => "订单号", renderCell: (o) => <Text weight="semibold">{o.id}</Text> }),
    createTableColumn<Order>({ columnId: "customer", compare: (a, b) => a.customer.localeCompare(b.customer), renderHeaderCell: () => "客户", renderCell: (o) => <TableCellLayout media={<Avatar name={o.customer} color="colorful" size={28} />} description={o.email} truncate>{o.customer}</TableCellLayout> }),
    createTableColumn<Order>({ columnId: "product", compare: (a, b) => a.product.localeCompare(b.product), renderHeaderCell: () => "产品", renderCell: (o) => o.product }),
    createTableColumn<Order>({ columnId: "status", compare: (a, b) => a.status.localeCompare(b.status), renderHeaderCell: () => "状态", renderCell: (o) => <StatusBadge value={o.status} /> }),
    createTableColumn<Order>({ columnId: "amount", compare: (a, b) => a.amount - b.amount, renderHeaderCell: () => "金额", renderCell: (o) => <Money value={o.amount} /> }),
    createTableColumn<Order>({ columnId: "date", compare: (a, b) => a.date.localeCompare(b.date), renderHeaderCell: () => "日期", renderCell: (o) => o.date }),
    createTableColumn<Order>({ columnId: "channel", compare: (a, b) => a.channel.localeCompare(b.channel), renderHeaderCell: () => "渠道", renderCell: (o) => <Badge appearance="outline">{o.channel}</Badge> }),
    createTableColumn<Order>({
      columnId: "actions",
      renderHeaderCell: () => "",
      renderCell: (o) => (
        <Menu>
          <MenuTrigger disableButtonEnhancement><Button appearance="subtle" size="small" icon={<Icon name="more-horizontal" />} aria-label={`${o.id} 操作`} /></MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem icon={<Icon name="eye" />} onClick={() => setActive(o)}>查看详情</MenuItem>
              <MenuItem icon={<Icon name="copy" />} onClick={() => notify("已复制", o.id)}>复制订单号</MenuItem>
              <MenuItem icon={<Icon name="trash" />} onClick={() => setPendingDelete(o)}>删除</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      ),
    }),
  ].filter((c) => c.columnId === "id" || c.columnId === "actions" || visible.includes(String(c.columnId)))

  const toolbar = (
    <div className={s.toolbar}>
      <SearchBox size={ctl} className={s.grow} placeholder="搜索订单号 / 客户 / 邮箱" value={query} onChange={(_, d) => setQuery(d.value)} />
      <Dropdown size={ctl} multiselect placeholder="状态" selectedOptions={status} onOptionSelect={(_, d) => setStatus(d.selectedOptions)} style={{ minWidth: 130 }}>
        {statuses.map((v) => <Option key={v} value={v}>{statusLabel[v]}</Option>)}
      </Dropdown>
      <Dropdown size={ctl} multiselect placeholder="渠道" selectedOptions={channel} onOptionSelect={(_, d) => setChannel(d.selectedOptions)} style={{ minWidth: 130 }}>
        {channels.map((v) => <Option key={v} value={v}>{v}</Option>)}
      </Dropdown>
      <DatePicker size={ctl} placeholder="日期" value={date} onSelectDate={(d) => setDate(d)} allowTextInput style={{ minWidth: 150 }} />
      <Menu>
        <MenuTrigger disableButtonEnhancement><Button size={ctl} icon={<Icon name="columns" />}>列</Button></MenuTrigger>
        <MenuPopover>
          <MenuList checkedValues={{ cols: visible }} onCheckedValueChange={(_, d) => setVisible(d.checkedItems)}>
            {["customer", "product", "status", "amount", "date", "channel"].map((c) => <MenuItemCheckbox key={c} name="cols" value={c}>{{ customer: "客户", product: "产品", status: "状态", amount: "金额", date: "日期", channel: "渠道" }[c]}</MenuItemCheckbox>)}
          </MenuList>
        </MenuPopover>
      </Menu>
      <Tooltip content="导出 CSV" relationship="label"><Button size={ctl} icon={<Icon name="download" />} onClick={() => notify("导出已开始", `${filtered.length} 条记录`)} /></Tooltip>
      <Tooltip content={state === "error" ? "恢复" : "模拟错误"} relationship="label"><Button size={ctl} icon={<Icon name="alert-triangle" />} onClick={() => setState(state === "error" ? "ready" : "error")} /></Tooltip>
    </div>
  )

  return (
    <div className={l.stack}>
      <PageHeader title="订单" description={`共 ${ordersData.length} 条订单，${filtered.length} 条匹配筛选。`} action={<Button appearance="primary" size={ctl} icon={<Icon name="plus" />}>新建订单</Button>} />
      {toolbar}
      {selected.size > 0 ? (
        <MessageBar intent="info">
          <MessageBarBody>已选择 {selected.size} 条订单</MessageBarBody>
          <MessageBarActions containerAction={<Button appearance="transparent" size="small" icon={<Icon name="x" />} aria-label="取消选择" onClick={() => setSelected(new Set())} />}>
            <Button size="small" onClick={() => notify("批量导出", `${selected.size} 条`)}>导出所选</Button>
            <Button size="small" onClick={() => { setSelected(new Set()); notify("已删除所选订单") }}>删除所选</Button>
          </MessageBarActions>
        </MessageBar>
      ) : null}
      {state === "error" ? (
        <MessageBar intent="error">
          <MessageBarBody><MessageBarTitle>加载失败</MessageBarTitle>无法获取订单数据，请稍后重试。</MessageBarBody>
          <MessageBarActions><Button size="small" icon={<Icon name="refresh" />} onClick={() => { setState("loading"); window.setTimeout(() => setState("ready"), 500) }}>重试</Button></MessageBarActions>
        </MessageBar>
      ) : state === "loading" ? (
        <Skeleton aria-label="加载订单"><div className={l.stackS}>{Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} size={40} />)}</div></Skeleton>
      ) : filtered.length === 0 ? (
        <div className={s.empty}>
          <Icon name="inbox" size={40} />
          <Body1>没有匹配的订单</Body1>
          <Caption1>尝试调整搜索或筛选条件</Caption1>
          <Button size={ctl} onClick={() => { setQuery(""); setStatus([]); setChannel([]); setDate(null) }}>清除筛选</Button>
        </div>
      ) : isMobile ? (
        <div className={l.stackS}>
          {rows.map((o) => (
            <div className={s.mobileCard} key={o.id} onClick={() => setActive(o)} role="button" tabIndex={0}>
              <div className={l.rowBetween}><Text weight="semibold">{o.id}</Text><StatusBadge value={o.status} /></div>
              <Caption1 className={l.muted}>{o.customer} · {o.product}</Caption1>
              <div className={l.rowBetween}><Caption1 className={l.muted}>{o.date}</Caption1><Money value={o.amount} /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className={s.tableWrap}>
          <DataGrid
            items={rows}
            columns={columns}
            sortable
            sortState={{ sortColumn: sort.column, sortDirection: sort.direction }}
            onSortChange={(_, d) => setSort({ column: d.sortColumn ?? "date", direction: d.sortDirection })}
            selectionMode="multiselect"
            selectedItems={selected}
            onSelectionChange={(_, d) => setSelected(new Set(Array.from(d.selectedItems).map(String)))}
            getRowId={(o) => o.id}
            resizableColumns
            columnSizingOptions={{ id: { minWidth: 100, defaultWidth: 110 }, customer: { minWidth: 180, defaultWidth: 220 }, amount: { minWidth: 110, defaultWidth: 120 }, actions: { minWidth: 56, defaultWidth: 56 } }}
            focusMode="composite"
            aria-label="订单表格"
          >
            <DataGridHeader>
              <DataGridRow selectionCell={{ checkboxIndicator: { "aria-label": "选择全部" } }}>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow>
            </DataGridHeader>
            <DataGridBody<Order>>
              {({ item, rowId }) => (
                <DataGridRow<Order> key={rowId} selectionCell={{ checkboxIndicator: { "aria-label": `选择 ${item.id}` } }}>
                  {({ renderCell, columnId }) => <DataGridCell onClick={columnId === "actions" ? undefined : () => setActive(item)}>{renderCell(item)}</DataGridCell>}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
        </div>
      )}
      <div className={s.footer}>
        <Caption1 className={l.muted}>第 {page} / {pageCount} 页 · 每页 {PAGE_SIZE} 条</Caption1>
        <div className={l.row}>
          <Button size={isMobile ? "large" : "small"} icon={<Icon name="chevron-left" />} disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</Button>
          {Array.from({ length: Math.min(pageCount, 5) }).map((_, i) => <Button key={i} size={isMobile ? "large" : "small"} appearance={page === i + 1 ? "primary" : "subtle"} onClick={() => setPage(i + 1)}>{i + 1}</Button>)}
          <Button size={isMobile ? "large" : "small"} iconPosition="after" icon={<Icon name="chevron-right" />} disabled={page >= pageCount} onClick={() => setPage(page + 1)}>下一页</Button>
        </div>
      </div>

      <OverlayDrawer open={active !== null} onOpenChange={(_, d) => !d.open && setActive(null)} position="end" size={isMobile ? "full" : "medium"}>
        <DrawerHeader>
          <DrawerHeaderTitle action={<Button appearance="subtle" size={ctl} aria-label="关闭" icon={<Icon name="x" />} onClick={() => setActive(null)} />}>订单 {active?.id}</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          {active ? (
            <div className={l.stackM}>
              <div className={l.row}><StatusBadge value={active.status} /><Badge appearance="outline">{active.channel}</Badge></div>
              <div className={s.detail}>
                <Caption1 className={l.muted}>客户</Caption1><Body1>{active.customer}</Body1>
                <Caption1 className={l.muted}>邮箱</Caption1><Body1>{active.email}</Body1>
                <Caption1 className={l.muted}>产品</Caption1><Body1>{active.product}</Body1>
                <Caption1 className={l.muted}>金额</Caption1><Body1><Money value={active.amount} /></Body1>
                <Caption1 className={l.muted}>日期</Caption1><Body1>{active.date}</Body1>
              </div>
              <TabList defaultSelectedValue="items" size={isMobile ? "large" : "small"}>
                <Tab value="items">商品</Tab><Tab value="timeline">时间线</Tab><Tab value="notes">备注</Tab>
              </TabList>
              <Field label="备注" hint="仅团队内可见"><Textarea placeholder="添加备注..." resize="vertical" /></Field>
              <Checkbox label="通知客户" />
              <div className={l.row}>
                <Button appearance="primary" size={ctl} onClick={() => { notify("备注已保存"); setActive(null) }}>保存</Button>
                <Button size={ctl} onClick={() => setActive(null)}>取消</Button>
                <Button appearance="subtle" size={ctl} icon={<Icon name="trash" />} onClick={() => setPendingDelete(active)}>删除</Button>
              </div>
            </div>
          ) : null}
        </DrawerBody>
      </OverlayDrawer>

      <Dialog open={pendingDelete !== null} onOpenChange={(_, d) => !d.open && setPendingDelete(null)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>删除订单 {pendingDelete?.id}？</DialogTitle>
            <DialogContent>此操作不可撤销，订单记录将从系统中永久移除。</DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement><Button appearance="secondary">取消</Button></DialogTrigger>
              <Button appearance="primary" onClick={() => { notify("订单已删除", pendingDelete?.id); setPendingDelete(null); setActive(null) }}>确认删除</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  )
}
