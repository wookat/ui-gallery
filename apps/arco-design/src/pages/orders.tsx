import { useMemo, useState } from "react"
import { Alert, Button, Card, DatePicker, Descriptions, Drawer, Dropdown, Empty, Input, Menu, Message, Popconfirm, Result, Select, Skeleton, Space, Table, Tabs, Timeline } from "@arco-design/web-react"
import orders from "@ui-gallery/spec/mock/orders.json"
import { Icon } from "@/components/icon"
import { useIsMobile } from "@/hooks/use-mobile"
import { PageHeader, StatusBadge } from "./shared"

type Order = (typeof orders)[number]

export function OrdersPage() {
  const isMobile = useIsMobile()
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
  const stateContent = mode === "loading" ? <Skeleton text={{ rows: 5 }} /> : mode === "empty" ? <Empty description="暂无订单" /> : mode === "error" ? <Result status="error" title="加载失败" subTitle="请稍后重试" /> : <div className="scroll-x"><Table rowKey="id" columns={columns} data={filtered} rowSelection={{}} scroll={{ x: 760 }} pagination={{ pageSize: 8, showTotal: true, showJumper: true }} onRow={(record) => ({ onClick: () => setSelected(record) })} /></div>
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
      <Drawer title="订单详情" visible={Boolean(selected)} onCancel={() => setSelected(null)} footer={null} width={isMobile ? "100%" : 420}>
        {selected ? <div className="stack"><Tabs defaultActiveTab="detail"><Tabs.TabPane key="detail" title="详情"><Descriptions column={1} data={[{ label: "订单号", value: selected.id }, { label: "客户", value: selected.customer }, { label: "邮箱", value: selected.email }, { label: "产品", value: selected.product }, { label: "金额", value: `¥${Number(selected.amount).toLocaleString()}` }, { label: "渠道", value: selected.channel }, { label: "状态", value: <StatusBadge value={selected.status} /> }]} /></Tabs.TabPane><Tabs.TabPane key="timeline" title="时间线"><Timeline><Timeline.Item>{`${selected.date} 创建订单`}</Timeline.Item><Timeline.Item>支付确认</Timeline.Item><Timeline.Item>{`状态：${selected.status}`}</Timeline.Item></Timeline></Tabs.TabPane><Tabs.TabPane key="notes" title="备注"><div className="stack"><Input.TextArea placeholder="添加备注..." /><Button type="primary" onClick={() => Message.success("备注已保存")}>保存备注</Button></div></Tabs.TabPane></Tabs><Popconfirm title="确定删除订单吗？" onOk={() => { setSelected(null); Message.success("订单已删除") }}><Button status="danger">删除订单</Button></Popconfirm></div> : null}
      </Drawer>
    </>
  )
}
