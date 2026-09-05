import { useState, type ReactNode } from "react"
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Calendar,
  Card,
  Cascader,
  Descriptions,
  Empty,
  List,
  Pagination,
  Statistic,
  Table,
  Tag,
  Timeline,
  Transfer,
  Tree,
  TreeSelect,
  Typography,
} from "tdesign-react"
import orders from "@ui-gallery/spec/mock/orders.json"
import team from "@ui-gallery/spec/mock/team.json"
import { Icon } from "@/components/icon"
import { useIsMobile } from "@/url-settings"
import { componentOptions, DemoPanel, DemoRow, demoImage, treeOptions } from "./types"

const statusTheme: Record<string, "success" | "warning" | "danger" | "primary"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  refunded: "danger",
  shipped: "primary",
}

const statusLabel: Record<string, string> = {
  paid: "已支付",
  pending: "待处理",
  failed: "失败",
  refunded: "已退款",
  shipped: "已发货",
}

function TableDemo({ dataGrid = false }: { dataGrid?: boolean }) {
  const [sort, setSort] = useState<unknown>({ sortBy: "id", descending: false })
  const columns = [
    { colKey: "row-select", type: "multiple" as const, width: 48 },
    { colKey: "id", title: "订单号", sorter: true, fixed: "left" as const },
    {
      colKey: "customer",
      title: "客户",
      cell: ({ row }: { row: (typeof orders)[number] }) => (
        <div className="component-demo-row">
          <Avatar size="small">{row.customer.slice(0, 1)}</Avatar>
          <span>{row.customer}</span>
        </div>
      ),
    },
    { colKey: "product", title: "产品" },
    {
      colKey: "amount",
      title: "金额",
      sorter: true,
      cell: ({ row }: { row: (typeof orders)[number] }) => `¥${row.amount.toLocaleString()}`,
    },
    {
      colKey: "status",
      title: "状态",
      cell: ({ row }: { row: (typeof orders)[number] }) => (
        <Tag theme={statusTheme[row.status]}>{statusLabel[row.status]}</Tag>
      ),
    },
    { colKey: "date", title: "日期" },
  ]
  return (
    <DemoPanel>
      <div className="component-table-scroll">
        <Table
          rowKey="id"
          data={orders.slice(0, 6)}
          columns={columns}
          bordered
          stripe={!dataGrid}
          hover
          size="small"
          maxHeight={dataGrid ? 280 : undefined}
          loading={dataGrid}
          selectedRowKeys={dataGrid ? ["ORD-2400"] : undefined}
          sort={sort as never}
          onSortChange={(value) => setSort(value)}
          lazyLoad
          expandOnRowClick
          expandedRow={({ row }) => <Typography.Text>{row.product} · {row.email}</Typography.Text>}
        />
      </div>
      <Pagination total={24} pageSize={6} showJumper pageSizeOptions={[6, 12, 24]} />
      {!dataGrid && (
        <DemoRow>
          <Table rowKey="id" data={[]} columns={columns} empty={<Empty description="暂无数据" />} />
          <Table rowKey="id" data={orders.slice(0, 3)} columns={columns} size="large" maxHeight={180} />
        </DemoRow>
      )}
    </DemoPanel>
  )
}

function DescriptionsDemo() {
  const isMobile = useIsMobile()
  return (
    <DemoPanel>
      <Descriptions bordered column={isMobile ? 1 : 3} size="small">
        <Descriptions.DescriptionsItem label="订单号">ORD-2400</Descriptions.DescriptionsItem>
        <Descriptions.DescriptionsItem label="客户">林晓</Descriptions.DescriptionsItem>
        <Descriptions.DescriptionsItem label="状态"><Tag theme="success">已支付</Tag></Descriptions.DescriptionsItem>
      </Descriptions>
      <Descriptions layout="vertical" column={isMobile ? 1 : 2}>
        <Descriptions.DescriptionsItem label="产品">Pro 年付</Descriptions.DescriptionsItem>
        <Descriptions.DescriptionsItem label="金额">¥1,638.45</Descriptions.DescriptionsItem>
      </Descriptions>
    </DemoPanel>
  )
}

function ListDemo() {
  return (
    <DemoPanel>
      <List size="small" split asyncLoading>
        {team.slice(0, 3).map((member) => (
          <List.ListItem key={member.email}>
            <List.ListItemMeta
              image={<Avatar>{member.name.slice(0, 1)}</Avatar>}
              title={member.name}
              description={`${member.email} · ${member.lastActive}`}
            />
          </List.ListItem>
        ))}
      </List>
      <List size="large" split={false}>
        <List.ListItem>带分割线与无分割线的列表</List.ListItem>
      </List>
    </DemoPanel>
  )
}

function CardDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <Card title="基础卡片" bordered>正文</Card>
        <Card title="操作卡片" shadow actions={<ButtonLink />}>正文</Card>
        <Card title="悬浮卡片" hoverShadow cover={<div className="demo-cover" />} footer="footer">正文</Card>
      </DemoRow>
      <DemoRow>
        <Card size="small" loading>small loading</Card>
        <Card size="medium">large</Card>
      </DemoRow>
    </DemoPanel>
  )
}

function ButtonLink() {
  return <a href="#component-Card">操作</a>
}

function AvatarDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <Avatar size="small">小</Avatar>
        <Avatar>中</Avatar>
        <Avatar size="large">大</Avatar>
        <Avatar size="48px" shape="round">自定义</Avatar>
        <Avatar shape="circle" image={demoImage} />
        <Avatar icon={<Icon name="user" />} />
      </DemoRow>
    </DemoPanel>
  )
}

function AvatarGroupDemo() {
  return (
    <DemoPanel>
      <AvatarGroup cascading="left-up" max={3}>
        <Avatar>林</Avatar>
        <Avatar>王</Avatar>
        <Avatar>陈</Avatar>
        <Avatar>Alex</Avatar>
      </AvatarGroup>
      <AvatarGroup cascading="right-up">
        <Avatar>一</Avatar>
        <Avatar>二</Avatar>
        <Avatar>三</Avatar>
      </AvatarGroup>
    </DemoPanel>
  )
}

function BadgeDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <Badge count={8}><Avatar>信</Avatar></Badge>
        <Badge dot><Avatar>点</Avatar></Badge>
        <Badge count={120} maxCount={99} shape="circle"><Avatar>99+</Avatar></Badge>
        <Badge count={3} color="green" size="small"><Avatar>小</Avatar></Badge>
        <Badge count={1} offset={[-4, 4]}><Avatar>位</Avatar></Badge>
      </DemoRow>
    </DemoPanel>
  )
}

function TagDemo() {
  const themes = ["default", "primary", "success", "warning", "danger"] as const
  return (
    <DemoPanel>
      {themes.map((theme) => (
        <DemoRow key={theme}>
          <Tag theme={theme} variant="dark">dark {theme}</Tag>
          <Tag theme={theme} variant="light">light {theme}</Tag>
          <Tag theme={theme} variant="outline">outline {theme}</Tag>
          <Tag theme={theme} variant="light-outline" closable icon={<Icon name="check" />}>closable</Tag>
        </DemoRow>
      ))}
      <DemoRow>
        <Tag size="small" shape="round">small</Tag>
        <Tag size="large" disabled>disabled</Tag>
        <Tag.CheckTag defaultChecked>checked</Tag.CheckTag>
        <Tag.CheckTag>unchecked</Tag.CheckTag>
      </DemoRow>
    </DemoPanel>
  )
}

function StatisticDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <Statistic title="收入" value={128430} unit="元" trend="increase" />
        <Statistic title="退款" value={12} trend="decrease" color="error" />
        <Statistic title="处理中" value={20} loading />
        <Statistic title="动画" value={9999} animation={{ duration: 800, valueFrom: 0 }} />
      </DemoRow>
    </DemoPanel>
  )
}

function TimelineDemo() {
  return (
    <DemoPanel>
      <Timeline mode="alternate">
        <Timeline.Item label="09:00" dot={<Icon name="check" />}>订单已支付</Timeline.Item>
        <Timeline.Item label="10:30">开始发货</Timeline.Item>
        <Timeline.Item label="11:20" dotColor="var(--td-error-color)">配送异常</Timeline.Item>
      </Timeline>
      <Timeline layout="horizontal" labelAlign="top">
        <Timeline.Item label="第一步">提交</Timeline.Item>
        <Timeline.Item label="第二步">审核</Timeline.Item>
      </Timeline>
    </DemoPanel>
  )
}

function TreeDemo() {
  return (
    <DemoPanel>
      <Tree data={treeOptions} checkable activable line expandAll filter={() => true} />
      <TreeSelect data={treeOptions} placeholder="TreeSelect supplemental" />
    </DemoPanel>
  )
}

function CalendarDemo() {
  const isMobile = useIsMobile()
  return (
    <DemoPanel>
      {isMobile ? null : <Calendar />}
      <Calendar theme="card" controllerConfig={{}} />
    </DemoPanel>
  )
}

function TransferDemo() {
  return (
    <DemoPanel>
      <Transfer
        data={componentOptions.concat([{ label: "选项四", value: "four" }])}
        search
        pagination={{ pageSize: 2 }}
        value={["two"]}
      />
    </DemoPanel>
  )
}

function CascaderDemo() {
  return (
    <DemoPanel>
      <Cascader options={treeOptions} placeholder="default" />
      <Cascader options={treeOptions} multiple filterable checkStrictly placeholder="multiple + filterable" />
    </DemoPanel>
  )
}

function EmptyDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <Empty />
        <Empty size="small" />
        <Empty size="large" />
        <Empty type="success" />
        <Empty type="fail" />
        <Empty type="network-error" />
        <Empty type="maintenance" />
      </DemoRow>
      <Button className="demo-action" theme="primary">重新加载</Button>
    </DemoPanel>
  )
}

function ImageDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <img src={demoImage} alt="placeholder" className="component-image" />
        <img src={demoImage} alt="cover" className="component-image component-image-cover" />
        <img src={demoImage} alt="circle" className="component-image component-image-circle" loading="lazy" />
      </DemoRow>
      <Typography.Text theme="secondary">ImageViewer 触发器见 TDesign 补充区。</Typography.Text>
    </DemoPanel>
  )
}

export const dataDemos = {
  Table: () => <TableDemo />,
  DataGrid: () => <TableDemo dataGrid />,
  Descriptions: DescriptionsDemo,
  List: ListDemo,
  Card: CardDemo,
  Avatar: AvatarDemo,
  AvatarGroup: AvatarGroupDemo,
  Badge: BadgeDemo,
  Tag: TagDemo,
  Statistic: StatisticDemo,
  Timeline: TimelineDemo,
  Tree: TreeDemo,
  Calendar: CalendarDemo,
  Cascader: CascaderDemo,
  Transfer: TransferDemo,
  Empty: EmptyDemo,
  Image: ImageDemo,
} satisfies Record<string, () => ReactNode>
