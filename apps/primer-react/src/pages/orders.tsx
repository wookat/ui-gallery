import { useMemo, useState } from "react"
import orders from "@ui-gallery/spec/mock/orders.json"
import { ActionMenu, Banner, Button, Checkbox, Dialog, FormControl, Select, Text, TextInput } from "@primer/react"
import { Table } from "@primer/react/experimental"
import { Icon, iconFor } from "@/lib/icon"
import { PageHeader, StatusBadge } from "./shared"

export function OrdersPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [selected, setSelected] = useState<(typeof orders)[number] | null>(null)
  const [showCustomer, setShowCustomer] = useState(true)
  const filtered = useMemo(() => orders.filter((order) => order.id.toLowerCase().includes(query.toLowerCase()) && (status === "all" || order.status === status)), [query, status])
  return (
    <div className="page-stack">
      <PageHeader title="订单管理" description="搜索、筛选并查看全部订单。" action={<Button leadingVisual={iconFor("download")}>导出</Button>} />
      <Banner title="本地数据集" description="所有订单来自 packages/spec/mock/orders.json，无运行时网络请求。" variant="info" />
      <section className="card stack-4">
        <div className="grid grid-2">
          <FormControl><FormControl.Label>搜索</FormControl.Label><TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索订单号..." block /></FormControl>
          <FormControl><FormControl.Label>状态</FormControl.Label><Select value={status} onChange={(event) => setStatus(event.target.value)} block><Select.Option value="all">全部状态</Select.Option>{["paid", "pending", "shipped", "failed", "refunded"].map((value) => <Select.Option key={value} value={value}>{value}</Select.Option>)}</Select></FormControl>
        </div>
        <div className="flex wrap items-center gap-2">
          <Button leadingVisual={iconFor("calendar")}>日期范围</Button>
          <ActionMenu><ActionMenu.Button leadingVisual={iconFor("sliders")}>列</ActionMenu.Button><ActionMenu.Overlay><Checkbox checked={showCustomer} onChange={(event) => setShowCustomer(event.target.checked)}>客户</Checkbox></ActionMenu.Overlay></ActionMenu>
          <label className="flex items-center gap-2"><Checkbox checked={showCustomer} onChange={(event) => setShowCustomer(event.target.checked)} />客户</label>
        </div>
        {filtered.length ? <div className="table-scroll"><Table gridTemplateColumns={showCustomer ? "auto auto minmax(120px, 1fr) auto auto auto auto" : "auto auto auto auto auto auto"}><Table.Head><Table.Row><Table.Header><Checkbox aria-label="全选订单" /></Table.Header><Table.Header>订单号</Table.Header>{showCustomer ? <Table.Header>客户</Table.Header> : null}<Table.Header>状态</Table.Header><Table.Header>日期</Table.Header><Table.Header align="end">金额</Table.Header><Table.Header align="end">操作</Table.Header></Table.Row></Table.Head><Table.Body>{filtered.map((order) => <Table.Row key={order.id}><Table.Cell><Checkbox aria-label={`选择 ${order.id}`} /></Table.Cell><Table.Cell scope="row">{order.id}</Table.Cell>{showCustomer ? <Table.Cell>{order.customer}</Table.Cell> : null}<Table.Cell><StatusBadge value={order.status} /></Table.Cell><Table.Cell>{order.date}</Table.Cell><Table.Cell align="end">¥{order.amount.toLocaleString()}</Table.Cell><Table.Cell align="end"><Button size="small" variant="invisible" onClick={() => setSelected(order)}>详情</Button></Table.Cell></Table.Row>)}</Table.Body></Table></div> : <div className="card muted" style={{ textAlign: "center" }}><Icon name="inbox" size={32} /><p>没有找到订单</p><Text>调整搜索或筛选条件后重试。</Text><div style={{ marginTop: 16 }}><Button onClick={() => { setQuery(""); setStatus("all") }}>清除筛选</Button></div></div>}
      </section>
      {selected ? <Dialog title={selected.id} subtitle="查看订单的完整信息与操作。" onClose={() => setSelected(null)}><div className="stack-4"><div className="flex justify-between"><Text className="muted">客户</Text><Text>{selected.customer}</Text></div><div className="flex justify-between"><Text className="muted">状态</Text><StatusBadge value={selected.status} /></div><div className="flex justify-between"><Text className="muted">金额</Text><Text>¥{selected.amount.toLocaleString()}</Text></div><Button variant="danger" block leadingVisual={iconFor("trash")} onClick={() => setSelected(null)}>删除订单</Button></div></Dialog> : null}
    </div>
  )
}
