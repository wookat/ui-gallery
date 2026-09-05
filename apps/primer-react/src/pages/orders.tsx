import { useEffect, useMemo, useRef, useState } from "react"
import { ActionList, ActionMenu, Avatar, Banner, Button, Checkbox, ConfirmationDialog, Dialog, FormControl, IconButton, Label, Pagination, Popover, Select, SelectPanel, SegmentedControl, Spinner, Text, TextInput, Textarea, type SelectPanelItemInput } from "@primer/react"
import { Blankslate, Table, UnderlinePanels } from "@primer/react/experimental"
import ordersData from "@ui-gallery/spec/mock/orders.json"
import { Icon, iconFor } from "@/lib/icon"
import { avatarFor } from "@/lib/avatar"
import { PageHeader, StatusBadge } from "./shared"

type Order = (typeof ordersData)[number]
type SortKey = "id" | "customer" | "amount" | "date" | "status"
type ViewState = "data" | "loading" | "empty" | "error"

const statuses = ["all", "paid", "pending", "refunded", "failed", "shipped"] as const
const statusLabel: Record<string, string> = { all: "全部状态", paid: "已支付", pending: "待处理", refunded: "已退款", failed: "失败", shipped: "已发货" }
const channelItems: SelectPanelItemInput[] = Array.from(new Set(ordersData.map((o) => o.channel))).map((c) => ({ id: c, text: c }))
const columns = [
  { key: "customer", label: "客户" },
  { key: "product", label: "产品" },
  { key: "channel", label: "渠道" },
  { key: "date", label: "日期" },
] as const
type ColumnKey = (typeof columns)[number]["key"]

function SortHeader({ label, active, direction, onClick }: { label: string; active: boolean; direction: "asc" | "desc"; onClick: () => void }) {
  return (
    <button type="button" className="sort-header" aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : "none"} onClick={onClick}>
      <span>{label}</span>
      <Icon name={active ? (direction === "asc" ? "sort-asc" : "sort-desc") : "triangle-down"} size={12} />
    </button>
  )
}

export function OrdersPage() {
  const [view, setView] = useState<ViewState>("data")
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [dateOpen, setDateOpen] = useState(false)
  const [channelOpen, setChannelOpen] = useState(false)
  const [channels, setChannels] = useState<SelectPanelItemInput[]>([])
  const [channelFilter, setChannelFilter] = useState("")
  const [visible, setVisible] = useState<Record<ColumnKey, boolean>>({ customer: true, product: true, channel: true, date: true })
  const [sortKey, setSortKey] = useState<SortKey>("date")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [rows, setRows] = useState<Order[]>(ordersData)
  const [detail, setDetail] = useState<Order | null>(null)
  const [editing, setEditing] = useState<Order | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Order[] | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const dateAnchor = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const selectedChannels = channels.map((c) => String(c.id))
    const list = rows.filter((o) => {
      if (q && !`${o.id} ${o.customer} ${o.email} ${o.product}`.toLowerCase().includes(q)) return false
      if (status !== "all" && o.status !== status) return false
      if (selectedChannels.length && !selectedChannels.includes(o.channel)) return false
      if (dateFrom && o.date < dateFrom) return false
      if (dateTo && o.date > dateTo) return false
      return true
    })
    const dir = sortDir === "asc" ? 1 : -1
    return [...list].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir
      return String(av).localeCompare(String(bv), "zh-Hans-CN") * dir
    })
  }, [rows, query, status, channels, dateFrom, dateTo, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => selectedIds.includes(r.id))
  const someOnPageSelected = pageRows.some((r) => selectedIds.includes(r.id))

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }
  const toggleRow = (id: string) => setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id])
  const togglePage = () => setSelectedIds(allOnPageSelected ? selectedIds.filter((id) => !pageRows.some((r) => r.id === id)) : Array.from(new Set([...selectedIds, ...pageRows.map((r) => r.id)])))
  const confirmDelete = (gesture: string) => {
    if (gesture === "confirm" && pendingDelete) {
      const ids = pendingDelete.map((o) => o.id)
      setRows(rows.filter((o) => !ids.includes(o.id)))
      setSelectedIds(selectedIds.filter((id) => !ids.includes(id)))
      if (detail && ids.includes(detail.id)) setDetail(null)
      setToast(`已删除 ${ids.length} 个订单：${ids.join("、")}`)
    }
    setPendingDelete(null)
  }
  const resetFilters = () => { setQuery(""); setStatus("all"); setChannels([]); setDateFrom(""); setDateTo(""); setPage(1) }
  const isFiltered = query || status !== "all" || channels.length || dateFrom || dateTo

  return (
    <div className="page-stack">
      <PageHeader
        title="订单"
        description={`共 ${rows.length} 个订单，可搜索、筛选、排序与批量操作。`}
        action={
          <div className="flex items-center gap-2 wrap">
            <SegmentedControl aria-label="页面状态" size="small" onChange={(index) => setView((["data", "loading", "empty", "error"] as ViewState[])[index])}>
              <SegmentedControl.Button selected={view === "data"}>数据</SegmentedControl.Button>
              <SegmentedControl.Button selected={view === "loading"}>加载</SegmentedControl.Button>
              <SegmentedControl.Button selected={view === "empty"}>空态</SegmentedControl.Button>
              <SegmentedControl.Button selected={view === "error"}>错误</SegmentedControl.Button>
            </SegmentedControl>
            <Button leadingVisual={iconFor("download")}>导出 CSV</Button>
            <Button variant="primary" leadingVisual={iconFor("plus")}>新建订单</Button>
          </div>
        }
      />

      <section className="card stack-4">
        <div className="toolbar">
          <TextInput className="toolbar-search" aria-label="搜索订单" placeholder="搜索订单号、客户、邮箱..." leadingVisual={iconFor("search")} value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} block />
          <Select aria-label="状态筛选" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
            {statuses.map((s) => <Select.Option key={s} value={s}>{statusLabel[s]}</Select.Option>)}
          </Select>
          <SelectPanel
            title="按渠道筛选"
            placeholder="搜索渠道"
            renderAnchor={({ children, ...anchorProps }) => <Button {...anchorProps} leadingVisual={iconFor("filter")} trailingAction={iconFor("triangle-down")}>{children || (channels.length ? `渠道 (${channels.length})` : "渠道")}</Button>}
            open={channelOpen}
            onOpenChange={setChannelOpen}
            items={channelItems.filter((c) => c.text?.toLowerCase().includes(channelFilter.toLowerCase()))}
            selected={channels}
            onSelectedChange={(next: SelectPanelItemInput[]) => { setChannels(next); setPage(1) }}
            filterValue={channelFilter}
            onFilterChange={setChannelFilter}
            overlayProps={{ width: "small", height: "xsmall" }}
          />
          <Button ref={dateAnchor} leadingVisual={iconFor("calendar")} trailingAction={iconFor("triangle-down")} onClick={() => setDateOpen(!dateOpen)} aria-expanded={dateOpen}>
            {dateFrom || dateTo ? `${dateFrom || "…"} ~ ${dateTo || "…"}` : "日期范围"}
          </Button>
          <div className="popover-anchor">
            <Popover open={dateOpen} caret="top-left">
              <Popover.Content className="stack-3" style={{ width: 300 }}>
                <FormControl><FormControl.Label>开始日期</FormControl.Label><TextInput type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} block /></FormControl>
                <FormControl><FormControl.Label>结束日期</FormControl.Label><TextInput type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} block /></FormControl>
                <div className="flex justify-between gap-2"><Button variant="invisible" onClick={() => { setDateFrom(""); setDateTo("") }}>清除</Button><Button variant="primary" onClick={() => { setDateOpen(false); setPage(1) }}>应用</Button></div>
              </Popover.Content>
            </Popover>
          </div>
          <ActionMenu>
            <ActionMenu.Button leadingVisual={iconFor("columns")}>列</ActionMenu.Button>
            <ActionMenu.Overlay align="end">
              <ActionList selectionVariant="multiple">
                {columns.map((c) => <ActionList.Item key={c.key} selected={visible[c.key]} onSelect={() => setVisible({ ...visible, [c.key]: !visible[c.key] })}>{c.label}</ActionList.Item>)}
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
          {selectedIds.length ? (
            <div className="flex items-center gap-2 bulk-bar">
              <Text size="small">已选 {selectedIds.length} 项</Text>
              <Button size="small" variant="danger" leadingVisual={iconFor("trash")} onClick={() => setPendingDelete(rows.filter((o) => selectedIds.includes(o.id)))}>批量删除</Button>
              <Button size="small" variant="invisible" onClick={() => setSelectedIds([])}>取消选择</Button>
            </div>
          ) : null}
        </div>

        {view === "loading" ? (
          <div className="state-box" role="status" aria-live="polite"><Spinner size="medium" /><Text className="muted">正在加载订单数据…</Text></div>
        ) : view === "error" ? (
          <Banner variant="critical" title="订单加载失败" description="服务暂时不可用，请稍后重试或联系管理员。" primaryAction={<Banner.PrimaryAction onClick={() => setView("data")}>重试</Banner.PrimaryAction>} secondaryAction={<Banner.SecondaryAction onClick={() => setView("empty")}>查看空态</Banner.SecondaryAction>} />
        ) : view === "empty" || filtered.length === 0 ? (
          <Blankslate border>
            <Blankslate.Visual><Icon name="inbox" size={24} /></Blankslate.Visual>
            <Blankslate.Heading>{isFiltered && view === "data" ? "没有匹配的订单" : "暂无订单"}</Blankslate.Heading>
            <Blankslate.Description>{isFiltered && view === "data" ? "试试调整搜索关键词或筛选条件。" : "当有新订单进入系统时，它们会显示在这里。"}</Blankslate.Description>
            <Button variant="primary" onClick={() => { resetFilters(); setView("data") }}>{isFiltered && view === "data" ? "清除筛选" : "新建订单"}</Button>
          </Blankslate>
        ) : (
          <>
            <div className="table-scroll desktop-only-block orders-table">
              <Table aria-label="订单列表" gridTemplateColumns={`40px minmax(120px, auto) ${visible.customer ? "minmax(180px, 1.4fr)" : ""} ${visible.product ? "minmax(120px, 1fr)" : ""} ${visible.channel ? "minmax(90px, auto)" : ""} minmax(100px, auto) ${visible.date ? "minmax(120px, auto)" : ""} minmax(110px, auto) 48px`}>
                <Table.Head>
                  <Table.Row>
                    <Table.Header><Checkbox aria-label="选择本页全部" checked={allOnPageSelected} indeterminate={!allOnPageSelected && someOnPageSelected} onChange={togglePage} /></Table.Header>
                    <Table.Header><SortHeader label="订单号" active={sortKey === "id"} direction={sortDir} onClick={() => toggleSort("id")} /></Table.Header>
                    {visible.customer ? <Table.Header><SortHeader label="客户" active={sortKey === "customer"} direction={sortDir} onClick={() => toggleSort("customer")} /></Table.Header> : null}
                    {visible.product ? <Table.Header>产品</Table.Header> : null}
                    {visible.channel ? <Table.Header>渠道</Table.Header> : null}
                    <Table.Header><SortHeader label="状态" active={sortKey === "status"} direction={sortDir} onClick={() => toggleSort("status")} /></Table.Header>
                    {visible.date ? <Table.Header><SortHeader label="日期" active={sortKey === "date"} direction={sortDir} onClick={() => toggleSort("date")} /></Table.Header> : null}
                    <Table.Header align="end"><SortHeader label="金额" active={sortKey === "amount"} direction={sortDir} onClick={() => toggleSort("amount")} /></Table.Header>
                    <Table.Header><span className="sr-only">操作</span></Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {pageRows.map((order) => (
                    <Table.Row key={order.id} className={selectedIds.includes(order.id) ? "row-selected" : undefined}>
                      <Table.Cell><Checkbox aria-label={`选择 ${order.id}`} checked={selectedIds.includes(order.id)} onChange={() => toggleRow(order.id)} /></Table.Cell>
                      <Table.Cell scope="row"><button type="button" className="link-button mono" onClick={() => setDetail(order)}>{order.id}</button></Table.Cell>
                      {visible.customer ? <Table.Cell><div className="flex items-center gap-2"><Avatar src={avatarFor(order.customer)} alt="" size={24} /><div className="min-w-0"><Text as="div" className="truncate">{order.customer}</Text><Text as="div" size="small" className="muted truncate">{order.email}</Text></div></div></Table.Cell> : null}
                      {visible.product ? <Table.Cell>{order.product}</Table.Cell> : null}
                      {visible.channel ? <Table.Cell><Label>{order.channel}</Label></Table.Cell> : null}
                      <Table.Cell><StatusBadge value={order.status} /></Table.Cell>
                      {visible.date ? <Table.Cell>{order.date}</Table.Cell> : null}
                      <Table.Cell align="end">¥{order.amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</Table.Cell>
                      <Table.Cell>
                        <ActionMenu>
                          <ActionMenu.Anchor><IconButton size="small" variant="invisible" aria-label={`${order.id} 更多操作`} icon={iconFor("kebab-horizontal")} /></ActionMenu.Anchor>
                          <ActionMenu.Overlay align="end">
                            <ActionList>
                              <ActionList.Item onSelect={() => setDetail(order)}><ActionList.LeadingVisual><Icon name="eye" /></ActionList.LeadingVisual>查看详情</ActionList.Item>
                              <ActionList.Item onSelect={() => setEditing(order)}><ActionList.LeadingVisual><Icon name="pencil" /></ActionList.LeadingVisual>编辑</ActionList.Item>
                              <ActionList.Item onSelect={() => setToast(`${order.id} 的发票已开始下载`)}><ActionList.LeadingVisual><Icon name="download" /></ActionList.LeadingVisual>下载发票</ActionList.Item>
                              <ActionList.Divider />
                              <ActionList.Item variant="danger" onSelect={() => setPendingDelete([order])}><ActionList.LeadingVisual><Icon name="trash" /></ActionList.LeadingVisual>删除</ActionList.Item>
                            </ActionList>
                          </ActionMenu.Overlay>
                        </ActionMenu>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            <ul className="order-cards mobile-only-block" aria-label="订单列表（移动端）">
              {pageRows.map((order) => (
                <li key={order.id} className="card order-card">
                  <div className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 check-row"><Checkbox aria-label={`选择 ${order.id}`} checked={selectedIds.includes(order.id)} onChange={() => toggleRow(order.id)} /><button type="button" className="link-button mono" onClick={() => setDetail(order)}>{order.id}</button></label>
                    <StatusBadge value={order.status} />
                  </div>
                  <div className="flex items-center gap-2"><Avatar src={avatarFor(order.customer)} alt="" size={24} /><Text>{order.customer}</Text><Text className="muted" size="small">· {order.product}</Text></div>
                  <div className="flex items-center justify-between gap-2"><Text className="muted" size="small">{order.date} · {order.channel}</Text><Text weight="semibold">¥{order.amount.toLocaleString()}</Text></div>
                </li>
              ))}
            </ul>

            <div className="pager">
              <div className="flex items-center gap-2 wrap">
                <Text size="small" className="muted">第 {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} 条，共 {filtered.length} 条</Text>
                <Select aria-label="每页条数" size="small" value={String(pageSize)} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}>
                  {[5, 10, 20].map((n) => <Select.Option key={n} value={String(n)}>{n} 条/页</Select.Option>)}
                </Select>
              </div>
              <Pagination pageCount={pageCount} currentPage={currentPage} onPageChange={(e, n) => { e.preventDefault(); setPage(n) }} showPages={{ narrow: false, regular: true }} />
            </div>
          </>
        )}
      </section>

      {detail ? (
        <Dialog title={`订单 ${detail.id}`} subtitle={`${detail.customer} · ${detail.date}`} position={{ narrow: "fullscreen", regular: "right" }} width="large" onClose={() => setDetail(null)}
          footerButtons={[{ buttonType: "danger", content: "删除订单", onClick: () => setPendingDelete([detail]) }, { buttonType: "default", content: "编辑", onClick: () => setEditing(detail) }, { buttonType: "primary", content: "保存备注", onClick: () => { setToast(`已保存 ${detail.id} 的备注`); setDetail(null) } }]}>
          <div className="stack-4">
            <div className="flex items-center gap-3">
              <Avatar src={avatarFor(detail.customer)} alt="" size={48} />
              <div><Text as="div" weight="semibold">{detail.customer}</Text><Text as="div" className="muted" size="small">{detail.email}</Text></div>
              <span className="ml-auto"><StatusBadge value={detail.status} /></span>
            </div>
            <dl className="descriptions">
              <div><dt>订单号</dt><dd className="mono">{detail.id}</dd></div>
              <div><dt>产品</dt><dd>{detail.product}</dd></div>
              <div><dt>金额</dt><dd>¥{detail.amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })} {detail.currency}</dd></div>
              <div><dt>渠道</dt><dd>{detail.channel}</dd></div>
              <div><dt>下单日期</dt><dd>{detail.date}</dd></div>
              <div><dt>状态</dt><dd><StatusBadge value={detail.status} /></dd></div>
            </dl>
            <UnderlinePanels aria-label="订单详情分组">
              <UnderlinePanels.Tab>时间线</UnderlinePanels.Tab>
              <UnderlinePanels.Tab>商品</UnderlinePanels.Tab>
              <UnderlinePanels.Tab>备注</UnderlinePanels.Tab>
              <UnderlinePanels.Panel>
                <ActionList>
                  <ActionList.Item><ActionList.LeadingVisual><Icon name="check-circle" /></ActionList.LeadingVisual>订单创建<ActionList.Description variant="block">{detail.date}</ActionList.Description></ActionList.Item>
                  <ActionList.Item><ActionList.LeadingVisual><Icon name="credit-card" /></ActionList.LeadingVisual>支付状态：{statusLabel[detail.status] ?? detail.status}<ActionList.Description variant="block">来自 {detail.channel} 渠道</ActionList.Description></ActionList.Item>
                </ActionList>
              </UnderlinePanels.Panel>
              <UnderlinePanels.Panel>
                <ActionList>
                  <ActionList.Item><ActionList.LeadingVisual><Icon name="package" /></ActionList.LeadingVisual>{detail.product}<ActionList.TrailingVisual>¥{detail.amount.toLocaleString()}</ActionList.TrailingVisual></ActionList.Item>
                </ActionList>
              </UnderlinePanels.Panel>
              <UnderlinePanels.Panel>
                <FormControl><FormControl.Label>内部备注</FormControl.Label><Textarea block rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="记录客服沟通、发货说明等" /><FormControl.Caption>备注仅团队内部可见。</FormControl.Caption></FormControl>
              </UnderlinePanels.Panel>
            </UnderlinePanels>
          </div>
        </Dialog>
      ) : null}

      {editing ? (
        <Dialog title={`编辑 ${editing.id}`} onClose={() => setEditing(null)} width="medium" footerButtons={[{ buttonType: "default", content: "取消", onClick: () => setEditing(null) }, { buttonType: "primary", content: "保存", onClick: () => { setToast(`${editing.id} 已更新`); setEditing(null) } }]}>
          <div className="stack-3">
            <FormControl><FormControl.Label>客户</FormControl.Label><TextInput block defaultValue={editing.customer} /></FormControl>
            <FormControl><FormControl.Label>产品</FormControl.Label><TextInput block defaultValue={editing.product} /></FormControl>
            <FormControl><FormControl.Label>状态</FormControl.Label><Select block defaultValue={editing.status}>{statuses.filter((s) => s !== "all").map((s) => <Select.Option key={s} value={s}>{statusLabel[s]}</Select.Option>)}</Select></FormControl>
          </div>
        </Dialog>
      ) : null}

      {pendingDelete ? (
        <ConfirmationDialog title={pendingDelete.length > 1 ? `删除 ${pendingDelete.length} 个订单？` : `删除订单 ${pendingDelete[0].id}？`} onClose={confirmDelete} confirmButtonType="danger" confirmButtonContent="确认删除" cancelButtonContent="取消">
          此操作不可撤销，订单记录与关联发票将被永久移除。
        </ConfirmationDialog>
      ) : null}

      {toast ? (
        <div className="toast" role="status" aria-live="polite">
          <Banner variant="success" title={toast} hideTitle={false} onDismiss={() => setToast(null)} />
        </div>
      ) : null}
    </div>
  )
}
