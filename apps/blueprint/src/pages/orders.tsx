import { zhCN } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react"
import { Alert, Button, ButtonGroup, Callout, Card, Checkbox, Classes, Drawer, DrawerSize, HTMLSelect, HTMLTable, InputGroup, Menu, MenuItem, NonIdealState, Popover, Spinner, Tab, Tabs, Tag, TextArea } from "@blueprintjs/core"
import { DateRangeInput, type DateRange } from "@blueprintjs/datetime"
import { MultiSelect } from "@blueprintjs/select"
import ordersData from "@ui-gallery/spec/mock/orders.json"
import { icon } from "@/lib/icons"
import { toast } from "@/lib/toaster"
import { Avatar, PageHeader, StatusTag, money } from "@/pages/shared"

type Order = (typeof ordersData)[number]
type SortKey = "id" | "customer" | "amount" | "date" | "status"
const PAGE_SIZE = 8
const CHANNELS = ["web", "ios", "android", "wechat"]
const COLUMNS: { key: keyof Order; label: string }[] = [
  { key: "customer", label: "客户" },
  { key: "product", label: "产品" },
  { key: "channel", label: "渠道" },
  { key: "status", label: "状态" },
  { key: "date", label: "日期" },
  { key: "amount", label: "金额" },
]

const fmt = (d: Date) => d.toISOString().slice(0, 10)
const parse = (s: string) => { const d = new Date(s); return Number.isNaN(d.getTime()) ? false : d }

export function OrdersPage() {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading")
  const [rows, setRows] = useState<Order[]>([])
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [range, setRange] = useState<DateRange>([null, null])
  const [channels, setChannels] = useState<string[]>([])
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "date", dir: -1 })
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [active, setActive] = useState<Order | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Order | null>(null)

  const load = (fail = false) => {
    setState("loading")
    window.setTimeout(() => {
      if (fail) { setState("error"); return }
      setRows(ordersData)
      setState("ready")
    }, 700)
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows
      .filter((o) => !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q))
      .filter((o) => status === "all" || o.status === status)
      .filter((o) => channels.length === 0 || channels.includes(o.channel))
      .filter((o) => (!range[0] || o.date >= fmt(range[0])) && (!range[1] || o.date <= fmt(range[1])))
      .sort((a, b) => {
        const av = a[sort.key]; const bv = b[sort.key]
        return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir
      })
  }, [rows, query, status, channels, range, sort])
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const allSelected = pageRows.length > 0 && pageRows.every((o) => selected.has(o.id))
  const someSelected = pageRows.some((o) => selected.has(o.id))

  const toggleSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }))
  const sortIcon = (key: SortKey) => (sort.key === key ? icon(sort.dir === 1 ? "chevron-up" : "chevron-down", 12) : null)
  const toggleAll = () => setSelected((s) => { const n = new Set(s); pageRows.forEach((o) => (allSelected ? n.delete(o.id) : n.add(o.id))); return n })
  const toggleOne = (id: string) => setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const confirmDelete = () => {
    if (!pendingDelete) return
    setRows((r) => r.filter((o) => o.id !== pendingDelete.id))
    void toast(`订单 ${pendingDelete.id} 已删除`, "success", { icon: icon("check") })
    setPendingDelete(null)
    setActive(null)
  }
  const show = (key: keyof Order) => !hidden.has(key)

  const filters = (
    <Card className="row" style={{ alignItems: "flex-end" }}>
      <InputGroup leftIcon={icon("search")} placeholder="搜索订单号 / 客户 / 邮箱" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} style={{ minWidth: 200 }} />
      <HTMLSelect value={status} onChange={(e) => { setStatus(e.currentTarget.value); setPage(1) }} options={[{ value: "all", label: "全部状态" }, { value: "paid", label: "已支付" }, { value: "pending", label: "待支付" }, { value: "shipped", label: "已发货" }, { value: "refunded", label: "已退款" }, { value: "cancelled", label: "已取消" }]} />
      <DateRangeInput locale={zhCN} value={range} onChange={(r) => { setRange(r); setPage(1) }} formatDate={fmt} parseDate={parse} allowSingleDayRange shortcuts={false} startInputProps={{ placeholder: "开始日期", style: { width: 130 } }} endInputProps={{ placeholder: "结束日期", style: { width: 130 } }} />
      <MultiSelect<string>
        items={CHANNELS}
        selectedItems={channels}
        itemRenderer={(item, { handleClick, modifiers }) => <MenuItem key={item} text={item} onClick={handleClick} active={modifiers.active} selected={channels.includes(item)} roleStructure="listoption" shouldDismissPopover={false} />}
        tagRenderer={(item) => item}
        onItemSelect={(item) => { setChannels((c) => (c.includes(item) ? c.filter((x) => x !== item) : [...c, item])); setPage(1) }}
        onRemove={(item) => setChannels((c) => c.filter((x) => x !== item))}
        placeholder="渠道"
        noResults={<MenuItem disabled text="无结果" />}
        popoverProps={{ minimal: true }}
        tagInputProps={{ leftIcon: icon("filter") }}
        resetOnSelect
      />
      <span style={{ flex: 1 }} />
      <Popover placement="bottom-end" content={
        <Menu>
          {COLUMNS.map((c) => <MenuItem key={c.key} shouldDismissPopover={false} text={c.label} icon={show(c.key) ? icon("check") : "blank"} onClick={() => setHidden((h) => { const n = new Set(h); if (n.has(c.key)) n.delete(c.key); else n.add(c.key); return n })} />)}
        </Menu>
      }>
        <Button icon={icon("sliders")} rightIcon={icon("chevron-down")}>列</Button>
      </Popover>
      <Button icon={icon("download")} intent="primary" onClick={() => void toast("已导出 CSV", "primary", { icon: icon("download") })}>导出</Button>
    </Card>
  )

  const actionMenu = (o: Order) => (
    <Popover placement="bottom-end" content={<Menu><MenuItem icon={icon("eye")} text="查看详情" onClick={() => setActive(o)} /><MenuItem icon={icon("edit")} text="编辑" /><MenuItem icon={icon("trash")} intent="danger" text="删除" onClick={() => setPendingDelete(o)} /></Menu>}>
      <Button minimal small icon={icon("more-horizontal")} aria-label="更多操作" onClick={(e) => e.stopPropagation()} />
    </Popover>
  )

  return (
    <>
      <PageHeader title="订单" description={`共 ${filtered.length} 笔订单，${selected.size} 已选`} action={
        <ButtonGroup>
          <Button icon={icon("refresh")} onClick={() => load()}>刷新</Button>
          <Button icon={icon("alert-circle")} onClick={() => load(true)}>模拟错误</Button>
          <Button icon={icon("inbox")} onClick={() => { setRows([]); setState("ready") }}>模拟空态</Button>
        </ButtonGroup>
      } />
      {filters}
      {state === "error" ? (
        <Callout intent="danger" icon={icon("alert-circle")} title="加载订单失败">
          <div className="row-between"><span>网络请求超时，请稍后重试。</span><Button intent="danger" outlined icon={icon("refresh")} onClick={() => load()}>重试</Button></div>
        </Callout>
      ) : state === "loading" ? (
        <Card style={{ minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner intent="primary" /></Card>
      ) : filtered.length === 0 ? (
        <Card style={{ padding: 40 }}>
          <NonIdealState icon={icon("inbox", 48)} title="暂无订单" description="没有符合筛选条件的订单，试试清除筛选或创建新订单。" action={<Button intent="primary" icon={icon("plus")} onClick={() => { setQuery(""); setStatus("all"); setChannels([]); setRange([null, null]); load() }}>创建订单</Button>} />
        </Card>
      ) : (
        <Card style={{ padding: 0 }}>
          <div className="scroll-x desktop-only">
            <HTMLTable interactive striped className="fill">
              <thead>
                <tr>
                  <th style={{ width: 36 }}><Checkbox checked={allSelected} indeterminate={!allSelected && someSelected} onChange={toggleAll} style={{ margin: 0 }} aria-label="全选" /></th>
                  <th onClick={() => toggleSort("id")} style={{ cursor: "pointer" }}>订单 {sortIcon("id")}</th>
                  {show("customer") ? <th onClick={() => toggleSort("customer")} style={{ cursor: "pointer" }}>客户 {sortIcon("customer")}</th> : null}
                  {show("product") ? <th>产品</th> : null}
                  {show("channel") ? <th>渠道</th> : null}
                  {show("status") ? <th onClick={() => toggleSort("status")} style={{ cursor: "pointer" }}>状态 {sortIcon("status")}</th> : null}
                  {show("date") ? <th onClick={() => toggleSort("date")} style={{ cursor: "pointer" }}>日期 {sortIcon("date")}</th> : null}
                  {show("amount") ? <th className="text-right" onClick={() => toggleSort("amount")} style={{ cursor: "pointer" }}>金额 {sortIcon("amount")}</th> : null}
                  <th />
                </tr>
              </thead>
              <tbody>
                {pageRows.map((o) => (
                  <tr key={o.id} onClick={() => setActive(o)} style={{ cursor: "pointer" }}>
                    <td onClick={(e) => e.stopPropagation()}><Checkbox checked={selected.has(o.id)} onChange={() => toggleOne(o.id)} style={{ margin: 0 }} aria-label={`选择 ${o.id}`} /></td>
                    <td><strong>{o.id}</strong></td>
                    {show("customer") ? <td><span className="row" style={{ flexWrap: "nowrap" }}><Avatar name={o.customer} size="sm" /><span><div>{o.customer}</div><div className={`${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL}`}>{o.email}</div></span></span></td> : null}
                    {show("product") ? <td>{o.product}</td> : null}
                    {show("channel") ? <td><Tag minimal>{o.channel}</Tag></td> : null}
                    {show("status") ? <td><StatusTag value={o.status} /></td> : null}
                    {show("date") ? <td className={Classes.TEXT_MUTED}>{o.date}</td> : null}
                    {show("amount") ? <td className="text-right">{money(o.amount)}</td> : null}
                    <td className="text-right">{actionMenu(o)}</td>
                  </tr>
                ))}
              </tbody>
            </HTMLTable>
          </div>
          <div className="mobile-cards" style={{ padding: 8 }}>
            {pageRows.map((o) => (
              <Card key={o.id} interactive onClick={() => setActive(o)} className="stack-sm" style={{ padding: 12 }}>
                <div className="row-between"><span className="row" style={{ flexWrap: "nowrap" }}><Checkbox checked={selected.has(o.id)} onChange={() => toggleOne(o.id)} onClick={(e) => e.stopPropagation()} style={{ margin: 0 }} /><strong>{o.id}</strong></span><StatusTag value={o.status} /></div>
                <div className="row-between"><span className="row" style={{ flexWrap: "nowrap" }}><Avatar name={o.customer} size="sm" />{o.customer}</span><strong>{money(o.amount)}</strong></div>
                <div className={`row-between ${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL}`}><span>{o.product} · {o.channel}</span><span>{o.date}</span></div>
              </Card>
            ))}
          </div>
          <div className="row-between" style={{ padding: 12, borderTop: "1px solid rgba(17,20,24,0.15)" }}>
            <span className={Classes.TEXT_MUTED}>第 {page} / {pages} 页 · 每页 {PAGE_SIZE} 条</span>
            <ButtonGroup>
              <Button icon={icon("chevron-left")} disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="上一页" />
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => <Button key={p} active={p === page} onClick={() => setPage(p)}>{p}</Button>)}
              <Button icon={icon("chevron-right")} disabled={page === pages} onClick={() => setPage(page + 1)} aria-label="下一页" />
            </ButtonGroup>
          </div>
        </Card>
      )}

      <Drawer isOpen={active !== null} onClose={() => setActive(null)} size={DrawerSize.SMALL} title={active?.id} icon={icon("shopping-cart")} className="order-drawer">
        {active ? (
          <div className={`${Classes.DRAWER_BODY} stack`} style={{ padding: 20 }}>
            <div className="row-between"><span className="row"><Avatar name={active.customer} /><span><div><strong>{active.customer}</strong></div><div className={Classes.TEXT_MUTED}>{active.email}</div></span></span><StatusTag value={active.status} /></div>
            <Tabs id="order-tabs" defaultSelectedTabId="detail" animate={false}>
              <Tab id="detail" title="详情" panel={
                <HTMLTable compact className="fill">
                  <tbody>
                    <tr><td className={Classes.TEXT_MUTED}>产品</td><td>{active.product}</td></tr>
                    <tr><td className={Classes.TEXT_MUTED}>金额</td><td>{money(active.amount)} {active.currency}</td></tr>
                    <tr><td className={Classes.TEXT_MUTED}>渠道</td><td>{active.channel}</td></tr>
                    <tr><td className={Classes.TEXT_MUTED}>日期</td><td>{active.date}</td></tr>
                  </tbody>
                </HTMLTable>
              } />
              <Tab id="timeline" title="时间线" panel={<ul className="timeline"><li>订单创建 · {active.date}</li><li>支付{active.status === "paid" ? "成功" : "处理中"}</li><li>等待发货</li></ul>} />
              <Tab id="notes" title="备注" panel={<TextArea fill placeholder="添加内部备注…" rows={4} />} />
            </Tabs>
            <div className="row" style={{ justifyContent: "flex-end" }}>
              <Button icon={icon("edit")}>编辑</Button>
              <Button intent="danger" icon={icon("trash")} onClick={() => setPendingDelete(active)}>删除</Button>
            </div>
          </div>
        ) : null}
      </Drawer>

      <Alert isOpen={pendingDelete !== null} intent="danger" icon={icon("trash", 40)} cancelButtonText="取消" confirmButtonText="删除" onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} canEscapeKeyCancel canOutsideClickCancel>
        <p>确定要删除订单 <strong>{pendingDelete?.id}</strong> 吗？此操作不可撤销。</p>
      </Alert>
    </>
  )
}
