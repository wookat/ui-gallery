import { useMemo, useState } from "react"
import { Alert, Button, Card, DatePicker, Drawer, Dropdown, Empty, Input, Menu, Message, Pagination, Popconfirm, Result, Select, Skeleton, Space, Table, Tabs, Typography } from "@arco-design/web-react"
import orders from "@ui-gallery/spec/mock/orders.json"
import { Icon } from "@/components/icon"
import { PageHeader, StatusBadge } from "./shared"

type Order = (typeof orders)[number]

export function OrdersPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [selected, setSelected] = useState<Order | null>(null)
  const [mode, setMode] = useState("all")
  const filtered = useMemo(() => orders.filter((order) => order.id.toLowerCase().includes(query.toLowerCase()) && (status === "all" || order.status === status)), [query, status])
  const columns = [
    { title: "订单", dataIndex: "id", sorter: true },
    { title: "客户", dataIndex: "customer" },
    { title: "产品", dataIndex: "product" },
    { title: "状态", dataIndex: "status", filters: ["paid", "pending", "refunded", "failed", "shipped"].map((value) => ({ text: value, value })), render: (value: unknown) => <StatusBadge value={String(value)} /> },
    { title: "金额", dataIndex: "amount", align: "right" as const, render: (value: unknown) => `¥${Number(value).toLocaleString()}` },
    { title: "操作", render: () => <Dropdown droplist={<Menu><Menu.Item key="edit">编辑</Menu.Item><Menu.Item key="copy">复制订单</Menu.Item><Menu.Item key="delete">删除</Menu.Item></Menu>}><Button type="text" icon={<Icon name="more-horizontal" />} /></Dropdown> },
  ]
  const stateContent = mode === "loading" ? <Skeleton text={{ rows: 5 }} /> : mode === "empty" ? <Empty description="暂无订单" /> : mode === "error" ? <Result status="error" title="加载失败" subTitle="请稍后重试" /> : <div className="scroll-x"><Table rowKey="id" columns={columns} data={filtered} rowSelection={{}} pagination={{ pageSize: 8, showTotal: true, showJumper: true }} onRow={(record) => ({ onClick: () => setSelected(record) })} /></div>
  return (
    <>
      <PageHeader title="订单管理" description="搜索、筛选并查看全部订单。" action={<Button icon={<Icon name="download" />}>导出</Button>} />
      <Alert type="info" title="本地数据集" content="所有订单来自 packages/spec/mock/orders.json，无运行时网络请求。" />
      <Card>
        <Space wrap>
          <Input.Search value={query} onChange={setQuery} placeholder="搜索订单号" allowClear />
          <Select value={status} onChange={setStatus} style={{ width: 140 }} options={[{ label: "全部状态", value: "all" }, ...["paid", "pending", "refunded", "failed", "shipped"].map((value) => ({ label: value, value }))]} />
          <DatePicker.RangePicker />
          <Button icon={<Icon name="filter" />}>更多筛选</Button>
          <Button>列显示</Button>
        </Space>
      </Card>
      <Tabs activeTab={mode} onChange={setMode}>
        <Tabs.TabPane key="all" title={`全部 (${filtered.length})`} />
        <Tabs.TabPane key="loading" title="加载中" />
        <Tabs.TabPane key="empty" title="空" />
        <Tabs.TabPane key="error" title="错误" />
      </Tabs>
      <Card>{stateContent}</Card>
      <Pagination total={filtered.length} showTotal showJumper pageSize={8} />
      <Drawer title="订单详情" visible={Boolean(selected)} onCancel={() => setSelected(null)} footer={null} width={420}>
        {selected ? <div className="stack"><Typography.Title heading={4}>{selected.id}</Typography.Title><Typography.Text>{selected.customer} · {selected.email}</Typography.Text><Typography.Text>{selected.product}</Typography.Text><StatusBadge value={selected.status} /><Typography.Title heading={5}>备注</Typography.Title><Input.TextArea placeholder="添加备注..." /><Button type="primary" onClick={() => Message.success("备注已保存")}>保存备注</Button><Popconfirm title="确定删除订单吗？" onOk={() => { setSelected(null); Message.success("订单已删除") }}><Button status="danger">删除订单</Button></Popconfirm></div> : null}
      </Drawer>
    </>
  )
}
