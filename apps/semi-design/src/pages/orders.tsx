import { useMemo, useState } from "react"
import { Banner, Button, Checkbox, DatePicker, Descriptions, Dropdown, Empty, Input, Modal, Popover, Select, SideSheet, Table, Tabs, TextArea, Toast, Typography } from "@douyinfe/semi-ui"
import { IllustrationNoResult, IllustrationNoResultDark } from "@douyinfe/semi-illustrations"
import ordersData from "@ui-gallery/spec/mock/orders.json"
import { Icon } from "@/icons"
import { PageHeader, SectionCard, StatusTag, money } from "./shared"

type Order = (typeof ordersData)[number]
type Mode = "ready" | "loading" | "error" | "empty"
const { Text } = Typography
const allColumns = ["customer", "product", "channel", "date", "status", "amount"] as const

export function OrdersPage() {
  const [rows, setRows] = useState<Order[]>(ordersData)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [channels, setChannels] = useState<string[]>([])
  const [range, setRange] = useState<Date[] | null>(null)
  const [visible, setVisible] = useState<string[]>([...allColumns])
  const [mode, setMode] = useState<Mode>("ready")
  const [selected, setSelected] = useState<string[]>([])
  const [detail, setDetail] = useState<Order | null>(null)
  const [pending, setPending] = useState<Order | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [note, setNote] = useState("")

  const openDetail = (record: Order) => {
    setDetail(record)
    setNote("")
  }

  const filtered = useMemo(() => rows.filter((row) => {
    const text = `${row.id} ${row.customer} ${row.email} ${row.product}`.toLowerCase()
    if (query && !text.includes(query.toLowerCase())) return false
    if (status !== "all" && row.status !== status) return false
    if (channels.length && !channels.includes(row.channel)) return false
    if (range && range.length === 2) {
      const time = new Date(row.date).getTime()
      if (time < range[0].getTime() || time > range[1].getTime()) return false
    }
    return true
  }), [rows, query, status, channels, range])

  const columns = [
    { title: "订单号", dataIndex: "id", fixed: true as const, width: 120, sorter: (a?: Order, b?: Order) => (a?.id ?? "").localeCompare(b?.id ?? ""), render: (value: string) => <Text strong>{value}</Text> },
    { title: "客户", dataIndex: "customer", width: 180, render: (value: string, record: Order) => <div><Text>{value}</Text><br /><Text size="small" type="tertiary" ellipsis={{ showTooltip: true }} style={{ maxWidth: 160 }}>{record.email}</Text></div> },
    { title: "商品", dataIndex: "product" },
    { title: "渠道", dataIndex: "channel" },
    { title: "日期", dataIndex: "date", sorter: (a?: Order, b?: Order) => (a?.date ?? "").localeCompare(b?.date ?? "") },
    { title: "状态", dataIndex: "status", render: (value: string) => <StatusTag value={value} /> },
    { title: "金额", dataIndex: "amount", align: "right" as const, sorter: (a?: Order, b?: Order) => (a?.amount ?? 0) - (b?.amount ?? 0), render: (value: number) => <Text style={{ fontVariantNumeric: "tabular-nums" }}>{money(value)}</Text> },
    {
      title: "", dataIndex: "actions", width: 56, render: (_: unknown, record: Order) => (
        <span onClick={(event) => event.stopPropagation()}><Dropdown trigger="click" position="bottomRight" render={<Dropdown.Menu><Dropdown.Item onClick={() => openDetail(record)}>查看详情</Dropdown.Item><Dropdown.Item onClick={() => { void navigator.clipboard?.writeText(record.id); Toast.success("已复制订单号") }}>复制订单号</Dropdown.Item><Dropdown.Divider /><Dropdown.Item type="danger" onClick={() => setPending(record)}>删除</Dropdown.Item></Dropdown.Menu>}>
          <Button theme="borderless" type="tertiary" size="small" icon={<Icon name="ellipsis" />} aria-label="更多操作" />
        </Dropdown></span>
      ),
    },
  ].filter((column) => column.dataIndex === "id" || column.dataIndex === "actions" || visible.includes(column.dataIndex))

  const remove = () => {
    if (!pending) return
    setRows((current) => current.filter((row) => row.id !== pending.id))
    Toast.success(`订单 ${pending.id} 已删除`)
    setPending(null)
  }

  return (
    <div className="acme-page">
      <PageHeader title="订单" description={`共 ${filtered.length} 条记录${selected.length ? `，已选 ${selected.length} 条` : ""}`} action={<div className="acme-row"><Select value={mode} onChange={(value) => setMode(value as Mode)} size="small" optionList={[{ value: "ready", label: "状态：正常" }, { value: "loading", label: "状态：加载中" }, { value: "empty", label: "状态：空" }, { value: "error", label: "状态：错误" }]} aria-label="演示状态" /><Button theme="solid" icon={<Icon name="download" />} onClick={() => Toast.info("已开始导出 CSV")}>导出</Button></div>} />
      {mode === "error" ? <Banner type="danger" description="订单加载失败，请稍后重试。" closeIcon={null} /> : null}
      <SectionCard title="全部订单">
        <div className="acme-row" style={{ marginBottom: 12 }}>
          <Input prefix={<Icon name="search" />} placeholder="搜索订单号 / 客户 / 邮箱" value={query} onChange={setQuery} showClear style={{ width: 240, maxWidth: "100%" }} />
          <Select value={status} onChange={(value) => setStatus(String(value))} style={{ width: 130 }} optionList={[{ value: "all", label: "全部状态" }, { value: "paid", label: "paid" }, { value: "pending", label: "pending" }, { value: "shipped", label: "shipped" }, { value: "refunded", label: "refunded" }, { value: "failed", label: "failed" }]} />
          <Select multiple placeholder="渠道" value={channels} onChange={(value) => setChannels(value as string[])} style={{ width: 160 }} maxTagCount={1} optionList={["web", "ios", "android", "api"].map((value) => ({ value, label: value }))} />
          <DatePicker type="dateRange" placeholder={["开始", "结束"]} onChange={(value) => setRange(Array.isArray(value) ? (value as Date[]) : null)} style={{ width: 260, maxWidth: "100%" }} />
          <Popover trigger="click" content={<div style={{ padding: 12, display: "grid", gap: 6 }}>{allColumns.map((key) => <Checkbox key={key} checked={visible.includes(key)} onChange={(event) => setVisible(event.target.checked ? [...visible, key] : visible.filter((item) => item !== key))}>{key}</Checkbox>)}</div>}>
            <Button theme="light" type="tertiary" icon={<Icon name="columns" />}>列</Button>
          </Popover>
        </div>
        {mode === "empty" || (mode === "ready" && filtered.length === 0) ? (
          <Empty image={<IllustrationNoResult style={{ width: 150, height: 150 }} />} darkModeImage={<IllustrationNoResultDark style={{ width: 150, height: 150 }} />} title="没有匹配的订单" description="调整筛选条件或清除搜索后重试。"><Button onClick={() => { setQuery(""); setStatus("all"); setChannels([]); setRange(null); setMode("ready") }}>清除筛选</Button></Empty>
        ) : (
          <div className="acme-scroll-x">
            <Table
              rowKey="id"
              scroll={{ x: 760 }}
              size="small"
              loading={mode === "loading"}
              dataSource={mode === "error" ? [] : filtered}
              columns={columns}
              rowSelection={{ selectedRowKeys: selected, onChange: (keys) => setSelected((keys ?? []).map(String)) }}
              pagination={{ currentPage: page, pageSize, total: filtered.length, onPageChange: (p) => setPage(p ?? 1), showSizeChanger: true, pageSizeOpts: [8, 16, 32], onPageSizeChange: (size) => { setPageSize(size); setPage(1) } }}
              empty={mode === "error" ? <Empty title="加载失败" description="服务暂时不可用。"><Button onClick={() => setMode("ready")}>重试</Button></Empty> : undefined}
              onRow={(record) => ({ onClick: (event) => { if ((event.target as HTMLElement).closest(".semi-checkbox, .semi-table-column-selection")) return; if (record) openDetail(record) }, style: { cursor: "pointer" } })}
            />
          </div>
        )}
      </SectionCard>
      <SideSheet title={detail ? `订单 ${detail.id}` : ""} visible={Boolean(detail)} onCancel={() => setDetail(null)} width="min(480px, 100vw)" footer={<div className="acme-row" style={{ justifyContent: "flex-end" }}><Button onClick={() => setDetail(null)}>关闭</Button><Button theme="solid" onClick={() => Toast.success("已重新发送收据")}>重发收据</Button></div>}>
        {detail ? (
          <Tabs type="line">
            <Tabs.TabPane tab="详情" itemKey="detail"><Descriptions align="left" data={[
              { key: "客户", value: `${detail.customer} · ${detail.email}` },
              { key: "商品", value: detail.product },
              { key: "金额", value: money(detail.amount) },
              { key: "状态", value: <StatusTag value={detail.status} /> },
              { key: "渠道", value: detail.channel },
              { key: "日期", value: detail.date },
            ]} /></Tabs.TabPane>
            <Tabs.TabPane tab="备注" itemKey="note"><TextArea autosize={{ minRows: 4 }} maxCount={200} placeholder="添加内部备注…" value={note} onChange={setNote} /><div className="acme-row" style={{ justifyContent: "flex-end", marginTop: 12 }}><Button theme="solid" onClick={() => Toast.success("备注已保存")}>保存备注</Button></div></Tabs.TabPane>
          </Tabs>
        ) : null}
      </SideSheet>
      <Modal title="删除订单" visible={Boolean(pending)} onCancel={() => setPending(null)} onOk={remove} okText="删除" okType="danger" cancelText="取消" centered>
        确定删除订单 {pending?.id}？此操作不可撤销。
      </Modal>
    </div>
  )
}
