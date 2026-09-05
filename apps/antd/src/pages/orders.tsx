import { useMemo, useState } from "react"
import {
  App,
  Alert,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Descriptions,
  Drawer,
  Dropdown,
  Empty,
  Input,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd"
import type { TableColumnsType, TableProps } from "antd"
import orders from "@ui-gallery/spec/mock/orders.json"
import { Icon } from "@/icons"
import {
  PageHeader,
  avatar,
  statusColor,
  statusLabel,
  type Order,
} from "@/pages/shared"

export function OrdersPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [state, setState] = useState("normal")
  const [selected, setSelected] = useState<Order | null>(null)
  const [removed, setRemoved] = useState<string[]>([])
  const [visible, setVisible] = useState<Record<string, boolean>>({
    id: true,
    customer: true,
    status: true,
    date: true,
    amount: true,
    action: true,
  })
  const { message, modal } = App.useApp()
  const filtered = useMemo(
    () =>
      orders.filter(
        (order) =>
          !removed.includes(order.id) &&
          (!query ||
            `${order.id}${order.customer}`
              .toLowerCase()
              .includes(query.toLowerCase())) &&
          (status === "all" || order.status === status)
      ),
    [query, removed, status]
  )
  const remove = (record: Order) =>
    modal.confirm({
      title: "确认删除订单？",
      content: "此操作无法撤销。",
      okButtonProps: { danger: true },
      onOk: () => {
        setRemoved((current) => [...current, record.id])
        message.success("订单已删除")
      },
    })
  const columns: TableColumnsType<Order> = [
    {
      title: "订单号",
      dataIndex: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
      hidden: !visible.id,
    },
    {
      title: "客户",
      dataIndex: "customer",
      sorter: (a, b) => a.customer.localeCompare(b.customer),
      hidden: !visible.customer,
      render: (value) => (
        <Space>
          {avatar(value)}
          {value}
        </Space>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      hidden: !visible.status,
      render: (value) => (
        <Tag color={statusColor[value]}>{statusLabel[value]}</Tag>
      ),
    },
    {
      title: "日期",
      dataIndex: "date",
      sorter: (a, b) => a.date.localeCompare(b.date),
      hidden: !visible.date,
    },
    {
      title: "金额",
      dataIndex: "amount",
      sorter: (a, b) => a.amount - b.amount,
      align: "right",
      hidden: !visible.amount,
      render: (value) => `¥${value.toLocaleString()}`,
    },
    {
      title: "操作",
      key: "action",
      hidden: !visible.action,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: "edit", label: "编辑" },
              {
                key: "delete",
                label: "删除",
                danger: true,
                onClick: () => remove(record),
              },
            ],
          }}
        >
          <Button type="text" icon={<Icon name="more-horizontal" />} />
        </Dropdown>
      ),
    },
  ]
  const columnItems = Object.keys(visible).map((key) => ({
    key,
    label: (
      <Checkbox
        checked={visible[key]}
        onChange={(event) =>
          setVisible((current) => ({ ...current, [key]: event.target.checked }))
        }
      >
        {key}
      </Checkbox>
    ),
  }))
  const rowSelection: TableProps<Order>["rowSelection"] = {
    onChange: (keys) => message.info(`已选择 ${keys.length} 条订单`),
  }
  return (
    <>
      <PageHeader
        title="订单"
        description="管理和追踪所有订单。"
        extra={
          <Select
            value={state}
            onChange={setState}
            options={[
              { value: "normal", label: "状态演示：正常" },
              { value: "empty", label: "状态演示：空" },
              { value: "loading", label: "状态演示：加载" },
              { value: "error", label: "状态演示：错误" },
            ]}
          />
        }
      />
      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input.Search
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索订单或客户"
          />
          <Select
            value={status}
            onChange={setStatus}
            style={{ width: 130 }}
            options={[
              { value: "all", label: "全部状态" },
              ...Object.entries(statusLabel).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
          <DatePicker.RangePicker />
          <Select
            mode="multiple"
            placeholder="渠道"
            style={{ minWidth: 180 }}
            options={["web", "ios", "android", "api"].map((value) => ({
              value,
              label: value,
            }))}
          />
          <Button icon={<Icon name="download" />}>导出</Button>
          <Dropdown menu={{ items: columnItems }} trigger={["click"]}>
            <Button icon={<Icon name="sliders" />}>列显示</Button>
          </Dropdown>
        </Space>
        {state === "error" ? (
          <Alert
            type="error"
            message="订单数据加载失败"
            action={
              <Button size="small" onClick={() => setState("normal")}>
                重试
              </Button>
            }
          />
        ) : state === "empty" ? (
          <Empty description="暂无订单">
            <Button onClick={() => setState("normal")}>返回正常</Button>
          </Empty>
        ) : (
          <div className="wide-table">
            <Table
              rowKey="id"
              loading={state === "loading"}
              rowSelection={rowSelection}
              onRow={(record) => ({ onClick: () => setSelected(record) })}
              dataSource={filtered}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
              scroll={{ x: 800 }}
            />
          </div>
        )}
      </Card>
      <Drawer
        title="订单详情"
        placement="right"
        width={480}
        open={!!selected}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Descriptions
              column={1}
              bordered
              items={[
                { label: "订单号", children: selected.id },
                { label: "客户", children: selected.customer },
                {
                  label: "状态",
                  children: (
                    <Tag color={statusColor[selected.status]}>
                      {statusLabel[selected.status]}
                    </Tag>
                  ),
                },
                { label: "金额", children: `¥${selected.amount}` },
              ]}
            />
            <Tabs
              items={[
                {
                  key: "detail",
                  label: "详情",
                  children: (
                    <Typography.Paragraph>
                      {selected.product} · {selected.date} · {selected.channel}
                    </Typography.Paragraph>
                  ),
                },
                {
                  key: "note",
                  label: "备注",
                  children: <Input.TextArea rows={4} placeholder="添加备注" />,
                },
              ]}
            />
            <Button danger block onClick={() => remove(selected)}>
              删除订单
            </Button>
          </Space>
        ) : null}
      </Drawer>
    </>
  )
}
