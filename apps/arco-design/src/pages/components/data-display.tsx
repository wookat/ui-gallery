import { useState } from "react"
import { Avatar, Badge, Button, Calendar, Card, Carousel, Descriptions, Empty, Image, List, Space, Statistic, Table, Tag, Timeline, Tree, Typography } from "@arco-design/web-react"
import { Icon } from "@/components/icon"
import type { DemoProps } from "./shared"
import { DemoSection, StatusTag, demoImage, orderRows, sizes } from "./shared"

export function DataDisplayDemo({ name }: DemoProps) {
  switch (name) {
    case "Table": return <TableDemo />
    case "DataGrid": return <DataGridDemo />
    case "Descriptions": return <DescriptionsDemo />
    case "List": return <ListDemo />
    case "Card": return <CardDemo />
    case "Avatar": return <SpaceAvatarDemo group={false} />
    case "AvatarGroup": return <SpaceAvatarDemo group />
    case "Badge": return <BadgeDemo />
    case "Tag": return <TagDemo />
    case "Statistic": return <StatisticDemo />
    case "Timeline": return <TimelineDemo />
    case "Tree": return <TreeDemo />
    case "Calendar": return <CalendarDemo />
    case "Image": return <ImageDemo />
    case "Carousel": return <CarouselDemo />
    case "Empty": return <EmptyDemo />
    default: return null
  }
}

const columns = [{ title: "订单号", dataIndex: "id" }, { title: "客户", dataIndex: "customer" }, { title: "金额", dataIndex: "amount", render: (value: number) => `¥${value.toFixed(2)}` }, { title: "状态", dataIndex: "status", render: (value: string) => <StatusTag value={value} /> }]

function TableDemo() {
  return <DemoSection><div className="scroll-x"><Table rowKey="id" data={orderRows.slice(0, 4)} columns={columns} pagination={false} size="small" /><Table rowKey="id" data={orderRows.slice(0, 2)} columns={columns} pagination={false} size="mini" border={{ wrapper: true, cell: true }} stripe style={{ marginTop: 16 }} /><Table rowKey="id" data={[]} columns={columns} pagination={false} loading style={{ marginTop: 16 }} /></div><Empty description="空表格状态" /></DemoSection>
}

function DataGridDemo() {
  return <div className="scroll-x"><Table rowKey="id" data={orderRows} columns={[{ ...columns[0], sorter: true }, { ...columns[1], filters: [{ text: "林晓", value: "林晓" }], onFilter: (value, row) => row.customer === value }, ...columns.slice(2)]} rowSelection={{}} pagination={{ pageSize: 5, showTotal: true }} expandedRowRender={(record) => <Typography.Text type="secondary">{record.product} · {record.channel} · {record.date}</Typography.Text>} /></div>
}

function DescriptionsDemo() {
  const data = [{ label: "状态", value: <Tag color="green">已完成</Tag> }, { label: "负责人", value: "林晓" }, { label: "邮箱", value: "user@example.com", span: 2 }]
  return <DemoSection><Descriptions data={data} border column={{ xs: 1, sm: 2, md: 3 }} size="small" /><Descriptions data={data} layout="vertical" style={{ marginTop: 16 }} /><Descriptions data={data} layout="inline-horizontal" style={{ marginTop: 16 }} /></DemoSection>
}

function ListDemo() {
  const items = ["创建项目", "邀请团队", "完成发布", "同步数据"]
  return <DemoSection><List size="small" bordered split hoverable dataSource={items} render={(item) => <List.Item key={item} actions={[<a key="view">查看</a>]}>{item}</List.Item>} pagination={{ pageSize: 2 }} /><List grid={{ gutter: 8, column: 2 }} dataSource={items} render={(item) => <List.Item key={item}><Card size="small">{item}</Card></List.Item>} loading style={{ marginTop: 16 }} /></DemoSection>
}

function CardDemo() {
  return <DemoSection><Card size="small" bordered={false} title="Card.Meta" extra={<a>更多</a>}><Card.Meta avatar={<Avatar>林</Avatar>} title="项目协作" description="团队正在协作中" /><Space><Button type="text">赞</Button><Button type="text">分享</Button></Space></Card><Card.Grid style={{ width: "50%" }}>Card.Grid 一</Card.Grid><Card.Grid style={{ width: "50%" }}>Card.Grid 二</Card.Grid><Card loading style={{ marginTop: 16 }} /></DemoSection>
}

function SpaceAvatarDemo({ group }: { group: boolean }) {
  if (group) return <Avatar.Group maxCount={2}><Avatar size={24}>林</Avatar><Avatar size={32}>王</Avatar><Avatar size={40}>陈</Avatar><Avatar size={48}>+3</Avatar></Avatar.Group>
  return <div><Avatar size={24}>小</Avatar><Avatar size={40} shape="square" style={{ marginLeft: 8 }}>方</Avatar><Avatar size={56} triggerIcon={<Icon name="edit" />} style={{ marginLeft: 8 }}>改</Avatar><Image width={40} height={40} src={demoImage} style={{ marginLeft: 8 }} /></div>
}

function BadgeDemo() {
  return <DemoSection><Badge count={123} maxCount={99} offset={[5, -3]}><Avatar>林</Avatar></Badge><Badge dot color="green" style={{ marginLeft: 20 }}><Icon name="bell" /></Badge><Badge status="success" text="成功" /><Badge status="processing" text="处理中" /><Badge status="warning" text="警告" /><Badge status="error" text="错误" /><Badge status="default" text="默认" /><Badge color="purple" text="自定义颜色" /><Badge count={0} dot>独立徽标</Badge></DemoSection>
}

function TagDemo() {
  return <DemoSection><div>{["red", "orangered", "orange", "gold", "lime", "green", "cyan", "arcoblue", "purple", "pinkpurple", "magenta", "gray"].map((color) => <Tag key={color} color={color} size="small">{color}</Tag>)}</div><div>{sizes.map((size) => <Tag key={size} size={size === "mini" ? "small" : size === "default" ? "medium" : size}>尺寸 {size}</Tag>)}</div><Tag closable icon={<Icon name="check" />}>可关闭</Tag><Tag checkable defaultChecked>可选</Tag><Tag bordered>边框</Tag></DemoSection>
}

function StatisticDemo() {
  const [deadline] = useState(() => Date.now() + 60000)
  return <DemoSection><Statistic title="收入" value={128430.12} precision={2} groupSeparator prefix="¥" suffix=" CNY" countUp /><Statistic.Countdown title="倒计时" value={deadline} format="HH:mm:ss" /></DemoSection>
}

function TimelineDemo() {
  return <DemoSection><Timeline mode="alternate" pending="等待下一步" direction="vertical"><Timeline.Item label="09:00" dotType="hollow">创建项目</Timeline.Item><Timeline.Item label="12:00" dot={<Icon name="check" />}>邀请团队</Timeline.Item><Timeline.Item label="18:00">完成发布</Timeline.Item></Timeline><Timeline direction="horizontal" labelPosition="same"><Timeline.Item label="周一">开始</Timeline.Item><Timeline.Item label="周五">完成</Timeline.Item></Timeline></DemoSection>
}

function TreeDemo() {
  return <Tree checkable multiple showLine draggable blockNode size="small" treeData={[{ key: "1", title: "工作区", children: [{ key: "2", title: "设计团队" }, { key: "3", title: "研发团队", disabled: true }] }]} />
}

function CalendarDemo() {
  return <DemoSection><Calendar /><Calendar panel style={{ marginTop: 16 }} /></DemoSection>
}

function ImageDemo() {
  return <Image.PreviewGroup infinite><Image width={180} height={100} src={demoImage} alt="预览图" loader error={<Empty description="图片加载失败" />} /><Image width={180} height={100} src={demoImage} alt="占位图 2" style={{ marginLeft: 12 }} error={<Empty description="图片加载失败" />} /></Image.PreviewGroup>
}

function CarouselDemo() {
  return <DemoSection><Carousel animation="slide" indicatorType="dot" showArrow="always" autoPlay style={{ height: 140 }}><div className="carousel-demo">slide / dot</div><div className="carousel-demo">第二张</div></Carousel><Carousel animation="card" indicatorType="line" indicatorPosition="outer" style={{ height: 140, marginTop: 16 }}><div className="carousel-demo">card / line</div><div className="carousel-demo">第二张</div></Carousel><Carousel animation="fade" indicatorType="slider" style={{ height: 140, marginTop: 16 }}><div className="carousel-demo">fade / slider</div><div className="carousel-demo">第二张</div></Carousel></DemoSection>
}

function EmptyDemo() {
  return <Space direction="vertical"><Empty /><Empty icon={<Icon name="inbox" size={40} />} description={<Space><Typography.Text>暂无内容</Typography.Text><Button type="primary" size="small">创建</Button></Space>} /></Space>
}
