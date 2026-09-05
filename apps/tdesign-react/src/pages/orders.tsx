import { useMemo, useState } from "react"
import { Alert, Button, Card, Checkbox, DateRangePicker, DialogPlugin, Drawer, Dropdown, Empty, Input, MessagePlugin, Pagination, Popup, Radio, Select, Table, Tag, Textarea, Typography } from "tdesign-react"
import { Icon } from "@/components/icon"
import { useIsMobile } from "@/url-settings"
import orders from "@ui-gallery/spec/mock/orders.json"

type Order = typeof orders[number]
const statuses = [{ label: "全部状态", value: "all" }, { label: "已支付", value: "paid" }, { label: "待处理", value: "pending" }, { label: "失败", value: "failed" }, { label: "已退款", value: "refunded" }, { label: "已发货", value: "shipped" }]
const statusTheme: Record<string, "success" | "warning" | "danger" | "primary"> = { paid: "success", pending: "warning", failed: "danger", refunded: "danger", shipped: "primary" }
const statusLabel: Record<string, string> = { paid: "已支付", pending: "待处理", failed: "失败", refunded: "已退款", shipped: "已发货" }

export function OrdersPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [state, setState] = useState("normal")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Order | null>(null)
  const [channels, setChannels] = useState<string[]>([])
  const isMobile = useIsMobile()
  const [visibleColumns, setVisibleColumns] = useState(["id", "customer", "product", "amount", "status", "date", "op"])
  const filtered = useMemo(() => orders.filter((item) => (status === "all" || item.status === status) && (!channels.length || channels.includes(item.channel)) && `${item.id}${item.customer}${item.product}`.toLowerCase().includes(query.toLowerCase())), [channels, query, status])
  const columns = [
    { colKey: "row-select", type: "multiple" as const, width: 48 },
    { colKey: "id", title: "订单号", sorter: true, width: 130 },
    { colKey: "customer", title: "客户", width: 150, cell: ({ row }: { row: Order }) => <div className="inline"><span className="avatar-small">{row.customer.slice(0, 1)}</span>{row.customer}</div> },
    { colKey: "product", title: "产品", width: 170 },
    { colKey: "amount", title: "金额", align: "right" as const, width: 120, cell: ({ row }: { row: Order }) => `¥${row.amount.toLocaleString()}` },
    { colKey: "status", title: "状态", width: 100, cell: ({ row }: { row: Order }) => <Tag theme={statusTheme[row.status]}>{statusLabel[row.status]}</Tag> },
    { colKey: "date", title: "日期", width: 120 },
    {
      colKey: "op",
      title: "操作",
      width: 180,
      cell: ({ row }: { row: Order }) => (
        <div className="inline">
          <Button variant="text" onClick={() => setSelected(row)}>查看</Button>
          <Dropdown
            options={[
              { content: "编辑", value: "edit" },
              { content: "删除", value: "delete", theme: "error" },
            ]}
            onClick={(data) => {
              if (data.value === "delete") {
                const dialog = DialogPlugin.confirm({
                  header: "删除订单",
                  body: `确认删除 ${row.id} 吗？`,
                  confirmBtn: "删除",
                  onConfirm: () => { MessagePlugin.success("已删除"); dialog.destroy() },
                })
              }
            }}
          >
            <Button variant="text">操作</Button>
          </Dropdown>
        </div>
      ),
    },
  ]
  const displayedColumns = columns.filter((column) => column.colKey === "row-select" || visibleColumns.includes(column.colKey))
  return (
    <div className="stack">
      <div className="page-heading"><div><Typography.Title level="h2">订单</Typography.Title><Typography.Paragraph>管理所有订单、状态与渠道。</Typography.Paragraph></div><Button icon={<Icon name="download" />}>导出</Button></div>
      <Card>
        <div className="inline">
          <Input value={query} onChange={setQuery} prefixIcon={<Icon name="search" />} placeholder="搜索订单、客户或产品" style={{ width: 240 }} />
          <Select value={status} options={statuses} onChange={(value) => setStatus(String(value))} style={{ width: 150 }} />
          <DateRangePicker style={{ width: 260 }} />
          <Select multiple value={channels} onChange={(value) => setChannels(value as string[])} options={[{ label: "Web", value: "web" }, { label: "iOS", value: "ios" }, { label: "Android", value: "android" }, { label: "API", value: "api" }]} placeholder="渠道" style={{ width: 160 }} />
          <Popup trigger="click" content={<Checkbox.Group value={visibleColumns} onChange={(value) => setVisibleColumns(value as string[])} options={columns.filter((column) => column.colKey !== "row-select").map((column) => ({ label: column.title, value: column.colKey }))} />}>
            <Button variant="outline">列显示</Button>
          </Popup>
          <Radio.Group variant="default-filled" value={state} onChange={(value) => setState(String(value))}><Radio value="normal">正常</Radio><Radio value="empty">空</Radio><Radio value="loading">加载</Radio><Radio value="error">错误</Radio></Radio.Group>
        </div>
      </Card>
      {state === "error" ? <Card><Alert theme="error" title="加载订单失败" message="请检查网络后重试。" operation={<Button size="small" variant="outline" onClick={() => setState("normal")}>重试</Button>} /></Card> : state === "empty" ? <Card><Empty description="暂无订单" action={<Button theme="primary" onClick={() => { setQuery(""); setStatus("all"); setChannels([]) }}>清除筛选</Button>} /></Card> : <Card><div className="table-scroll"><Table rowKey="id" data={filtered.slice((page - 1) * 10, page * 10)} columns={displayedColumns} loading={state === "loading"} bordered hover stripe onRowClick={({ row }) => setSelected(row)} /></div><div className="pagination-bar"><Pagination current={page} total={filtered.length} pageSize={10} theme={isMobile ? "simple" : "default"} showPageSize={!isMobile} showJumper={!isMobile} onChange={(next) => setPage(next.current)} /></div></Card>}
      <Drawer visible={Boolean(selected)} header={selected ? `订单详情 · ${selected.id}` : "订单详情"} placement="right" size="medium" onClose={() => setSelected(null)}>{selected && <div className="stack"><Typography.Title level="h4">{selected.product}</Typography.Title><Typography.Paragraph>{selected.customer} · {selected.email}</Typography.Paragraph><Typography.Paragraph>金额：¥{selected.amount.toLocaleString()} · {statusLabel[selected.status]}</Typography.Paragraph><Typography.Paragraph>日期：{selected.date} · 渠道：{selected.channel}</Typography.Paragraph><Textarea placeholder="添加订单备注" /></div>}</Drawer>
    </div>
  )
}
