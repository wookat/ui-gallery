import { useRef, useState } from "react"
import {
  App,
  Anchor,
  Alert,
  Affix,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Carousel,
  Cascader,
  Checkbox,
  Col,
  Collapse,
  ColorPicker,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Flex,
  FloatButton,
  Form,
  Image,
  Input,
  InputNumber,
  Layout,
  List,
  Menu,
  Mentions,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  QRCode,
  Radio,
  Rate,
  Result,
  Row,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Space,
  Spin,
  Splitter,
  Statistic,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  Timeline,
  TimePicker,
  Tooltip,
  Tour,
  Transfer,
  Tree,
  TreeSelect,
  Typography,
  Upload,
  Watermark,
  theme,
} from "antd"
import type { MenuProps, UploadFile } from "antd"
import contract from "@ui-gallery/spec/contract.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import team from "@ui-gallery/spec/mock/team.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import { Icon } from "@/icons"
import { PageHeader, DemoSection, avatar, placeholder } from "@/pages/shared"
import { coverage } from "@/coverage"

const demoOptions = ["选项一", "选项二", "选项三"].map((value) => ({
  value,
  label: value,
}))
const uploadFiles: UploadFile[] = [
  { uid: "1", name: "demo.pdf", status: "done" },
  { uid: "2", name: "image.png", status: "done" },
]
const treeData = [
  {
    title: "工作区",
    key: "0",
    children: [
      { title: "项目", key: "0-0" },
      { title: "文档", key: "0-1" },
    ],
  },
]
const countdownValue = 1893456000000
const categories: Array<{ label: string; names: string[] }> = [
  {
    label: "排版",
    names: ["Typography", "Kbd", "Code", "Divider", "Link"],
  },
  {
    label: "按钮",
    names: ["Button", "ButtonGroup", "IconButton", "FloatButton"],
  },
  {
    label: "表单控件",
    names: [
      "Input",
      "Textarea",
      "NumberInput",
      "Select",
      "MultiSelect",
      "Combobox",
      "Autocomplete",
      "Checkbox",
      "Radio",
      "Switch",
      "Slider",
      "Rating",
      "DatePicker",
      "TimePicker",
      "DateRangePicker",
      "ColorPicker",
      "Upload",
      "Cascader",
      "Transfer",
      "Mention",
      "PinInput",
      "Form",
    ],
  },
  {
    label: "数据展示",
    names: [
      "Table",
      "DataGrid",
      "Descriptions",
      "List",
      "Card",
      "Avatar",
      "AvatarGroup",
      "Badge",
      "Tag",
      "Statistic",
      "Timeline",
      "Tree",
      "Calendar",
      "Image",
      "Carousel",
      "Empty",
      "Tooltip",
      "Popover",
      "QRCode",
      "Segmented",
    ],
  },
  {
    label: "反馈",
    names: [
      "Alert",
      "Toast",
      "Notification",
      "Dialog",
      "Drawer",
      "Progress",
      "Skeleton",
      "Spinner",
      "Result",
      "Popconfirm",
    ],
  },
  {
    label: "导航",
    names: [
      "Menu",
      "Dropdown",
      "Breadcrumb",
      "Tabs",
      "Pagination",
      "Steps",
      "Anchor",
      "BackTop",
      "Affix",
      "Navbar",
      "Sidebar",
      "CommandPalette",
    ],
  },
  {
    label: "布局",
    names: [
      "Grid",
      "Stack",
      "Layout",
      "Container",
      "AspectRatio",
      "Resizable",
      "ScrollArea",
      "Accordion",
    ],
  },
  { label: "其他", names: ["ThemeProvider", "Watermark", "Tour"] },
]
const categorized = new Set(categories.flatMap((group) => group.names))
const indexGroups = [
  ...categories,
  {
    label: "未分类",
    names: contract.components.filter((name) => !categorized.has(name)),
  },
].filter((group) => group.names.length > 0)

export function ComponentsPage() {
  return (
    <>
      <PageHeader
        title="组件全集"
        description="Ant Design 组件、状态与组合模式参考。"
      />
      <Card size="small" style={{ marginBottom: 24 }} title="组件索引">
        <Anchor
          affix={false}
          direction="horizontal"
          targetOffset={80}
          items={indexGroups.map((group) => ({
            key: group.label,
            href: `#component-${group.names[0]}`,
            title: group.label,
          }))}
        />
        <Collapse
          ghost
          size="small"
          style={{ marginTop: 8 }}
          items={indexGroups.map((group) => ({
            key: group.label,
            label: `${group.label}（${group.names.length}）`,
            children: (
              <Flex gap={8} wrap>
                {group.names.map((name) => (
                  <Typography.Link key={name} href={`#component-${name}`}>
                    {name}
                  </Typography.Link>
                ))}
              </Flex>
            ),
          }))}
        />
      </Card>
      <div className="component-grid">
        {contract.components.map((name) => (
          <Card
            id={`component-${name}`}
            key={name}
            title={
              <Flex justify="space-between" wrap gap={8}>
                <span>{name}</span>
                <Badge
                  status={
                    coverage[name] === "implemented"
                      ? "success"
                      : coverage[name] === "composed"
                        ? "processing"
                        : "error"
                  }
                  text={coverage[name]}
                />
              </Flex>
            }
            style={{ scrollMarginTop: 80 }}
          >
            <Demo name={name} />
          </Card>
        ))}
      </div>
      <Card title="Ant Design 补充" style={{ marginTop: 24 }}>
        <DemoSection>
          <TreeSelectDemo />
          <Typography.Text copyable>可复制文本</Typography.Text>
          <Typography.Text editable>可编辑文本</Typography.Text>
          <AppInfoDemo />
          <Descriptions
            size="small"
            items={[
              { label: "locale", children: "zh-CN" },
              { label: "token", children: "cssVar" },
            ]}
          />
        </DemoSection>
      </Card>
    </>
  )
}

function Demo({ name }: { name: string }) {
  const { message, notification } = App.useApp()
  const [open, setOpen] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [command, setCommand] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)
  const targetA = useRef<HTMLButtonElement>(null)
  const targetB = useRef<HTMLButtonElement>(null)
  const targetC = useRef<HTMLButtonElement>(null)
  const { token } = theme.useToken()
  const notify = (type: "success" | "info" | "warning" | "error") =>
    notification[type]({ message: "通知", description: "这是一个通知示例。" })
  if (name === "Typography")
    return (
      <Space direction="vertical">
        <Typography.Title level={1}>标题一</Typography.Title>
        <Typography.Title level={2}>标题二</Typography.Title>
        <Typography.Title level={3}>标题三</Typography.Title>
        <Typography.Title level={4}>标题四</Typography.Title>
        <Typography.Title level={5}>标题五</Typography.Title>
        <Typography.Text type="secondary">secondary</Typography.Text>
        <Typography.Text type="success">success</Typography.Text>
        <Typography.Text type="warning">warning</Typography.Text>
        <Typography.Text type="danger">danger</Typography.Text>
        <Typography.Text disabled>disabled</Typography.Text>
        <Typography.Text mark strong italic underline delete>
          样式文本
        </Typography.Text>
        <Typography.Paragraph ellipsis={{ rows: 1, expandable: true }}>
          一段可以展开的长文本，用于演示省略状态。
        </Typography.Paragraph>
        <Typography.Paragraph copyable editable>
          可复制和可编辑段落
        </Typography.Paragraph>
        <Typography.Paragraph>
          <blockquote>引用文本</blockquote>
        </Typography.Paragraph>
        <Typography.Text>
          • 有序列表
          <br />
          1. 第一项
          <br />
          2. 第二项
        </Typography.Text>
      </Space>
    )
  if (name === "Button")
    return (
      <Space direction="vertical">
        <Space wrap>
          {(["primary", "default", "dashed", "text", "link"] as const).map(
            (type) => (
              <Button key={type} type={type}>
                {type}
              </Button>
            )
          )}
          <Button danger>危险</Button>
          <Button color="primary" variant="outlined">
            outlined
          </Button>
          <Button color="danger" variant="filled">
            filled
          </Button>
        </Space>
        <Space wrap>
          {(["small", "middle", "large"] as const).map((size) => (
            <Button key={size} size={size}>
              尺寸 {size}
            </Button>
          ))}
          <Button loading>加载中</Button>
          <Button disabled>禁用</Button>
          <Button shape="circle" icon={<Icon name="plus" />} />
        </Space>
        <Space.Compact>
          <Button>保存</Button>
          <Button type="primary">提交</Button>
          <Button danger>删除</Button>
        </Space.Compact>
      </Space>
    )
  if (name === "ButtonGroup")
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space.Compact>
          <Button>上一步</Button>
          <Button type="primary">保存</Button>
          <Button>下一步</Button>
        </Space.Compact>
        <Space.Compact direction="vertical" block>
          <Button>上一步</Button>
          <Button type="primary">保存</Button>
          <Button>下一步</Button>
        </Space.Compact>
        <Space.Compact block>
          <Button size="small">小</Button>
          <Button>中</Button>
          <Button size="large">大</Button>
        </Space.Compact>
        <Dropdown.Button
          menu={{
            items: [
              { key: "draft", label: "保存草稿" },
              { key: "copy", label: "另存副本" },
            ],
          }}
        >
          提交
        </Dropdown.Button>
        <Space.Compact>
          <Button icon={<Icon name="arrow-left" />} />
          <Button icon={<Icon name="edit" />} type="primary">
            编辑
          </Button>
          <Button icon={<Icon name="arrow-right" />} />
        </Space.Compact>
      </Space>
    )
  if (name === "IconButton")
    return (
      <Space>
        <Button size="small" shape="circle" icon={<Icon name="plus" />} />
        <Button shape="circle" icon={<Icon name="edit" />} />
        <Button size="large" shape="round" icon={<Icon name="settings" />} />
      </Space>
    )
  if (name === "Input")
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space wrap>
          <Input
            size="small"
            prefix={<Icon name="search" />}
            suffix={<Icon name="check" />}
            addonBefore="协议"
            addonAfter=".com"
            allowClear
            placeholder="输入内容"
          />
          <Input disabled placeholder="禁用" status="error" />
        </Space>
        <Input.Password
          iconRender={(visible) => <Icon name={visible ? "eye" : "eye-off"} />}
        />
        <Input.Search enterButton />
        <Input.TextArea showCount maxLength={100} />
      </Space>
    )
  if (name === "Textarea")
    return (
      <Input.TextArea
        showCount
        maxLength={100}
        rows={3}
        placeholder="多行文本"
      />
    )
  if (name === "NumberInput")
    return (
      <Space>
        <InputNumber addonBefore="¥" addonAfter="元" status="error" />
        <InputNumber disabled />
      </Space>
    )
  if (["Select", "MultiSelect", "Combobox"].includes(name))
    return (
      <Space wrap>
        <Select
          size="small"
          options={demoOptions}
          showSearch
          loading
          placeholder="单选"
          status="error"
        />
        <Select
          mode="multiple"
          options={demoOptions}
          defaultValue={["选项一"]}
        />
        <Select mode="tags" options={demoOptions} />
        <AutoCompleteDemo />
      </Space>
    )
  if (name === "Autocomplete") return <AutoCompleteDemo />
  if (name === "Checkbox")
    return (
      <Space direction="vertical">
        <Checkbox defaultChecked>已选中</Checkbox>
        <Checkbox indeterminate>半选</Checkbox>
        <Checkbox disabled>禁用</Checkbox>
        <Checkbox.Group options={["A", "B", "C"]} defaultValue={["A"]} />
      </Space>
    )
  if (name === "Radio")
    return (
      <Space direction="vertical">
        <Radio.Group options={demoOptions} defaultValue="选项一" />
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={demoOptions}
          defaultValue="选项一"
        />
        <Radio.Group size="large" options={demoOptions} />
      </Space>
    )
  if (name === "Switch")
    return (
      <Space>
        <Switch size="small" />
        <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" />
        <Switch loading />
        <Switch disabled />
      </Space>
    )
  if (name === "Slider")
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Slider defaultValue={45} />
        <Slider
          range
          marks={{ 0: "0", 50: "50", 100: "100" }}
          defaultValue={[20, 70]}
        />
        <Slider vertical style={{ height: 80 }} />
      </Space>
    )
  if (name === "Rating")
    return (
      <Space>
        <Rate allowHalf defaultValue={3.5} />
        <Rate character={<Icon name="heart" />} disabled defaultValue={4} />
      </Space>
    )
  if (name === "DatePicker")
    return (
      <Space wrap>
        <DatePicker />
        <DatePicker picker="week" />
        <DatePicker picker="month" status="error" />
        <DatePicker picker="year" />
      </Space>
    )
  if (name === "TimePicker")
    return (
      <Space>
        <TimePicker />
        <TimePicker.RangePicker />
      </Space>
    )
  if (name === "DateRangePicker") return <DatePicker.RangePicker showTime />
  if (name === "ColorPicker")
    return (
      <Space>
        <ColorPicker showText />
        <ColorPicker disabled defaultValue="#1677ff" />
      </Space>
    )
  if (name === "Upload")
    return (
      <Space direction="vertical">
        <Upload defaultFileList={uploadFiles} beforeUpload={() => false}>
          <Button icon={<Icon name="upload" />}>选择文件</Button>
        </Upload>
        <Upload.Dragger
          defaultFileList={uploadFiles}
          beforeUpload={() => false}
          showUploadList
        >
          <p>
            <Icon name="upload" size={28} />
          </p>
          <p>拖拽上传</p>
        </Upload.Dragger>
      </Space>
    )
  if (name === "Cascader")
    return (
      <Cascader
        options={[
          {
            value: "zhejiang",
            label: "浙江",
            children: [
              { value: "hangzhou", label: "杭州" },
              { value: "ningbo", label: "宁波" },
            ],
          },
          {
            value: "jiangsu",
            label: "江苏",
            children: [{ value: "nanjing", label: "南京" }],
          },
        ]}
        placeholder="选择地区"
      />
    )
  if (name === "Transfer")
    return (
      <Transfer
        dataSource={Array.from({ length: 6 }, (_, index) => ({
          key: String(index),
          title: `项目 ${index + 1}`,
        }))}
        render={(item) => item.title}
      />
    )
  if (name === "Mention")
    return (
      <Mentions
        options={team.map((member) => ({
          value: member.name,
          label: member.name,
        }))}
        rows={3}
      />
    )
  if (name === "PinInput") return <Input.OTP length={4} mask="•" />
  if (name === "Form")
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Form layout="horizontal">
          <Form.Item label="姓名">
            <Input />
          </Form.Item>
          <Form.Item label="邮箱" validateStatus="error" help="请输入邮箱">
            <Input />
          </Form.Item>
        </Form>
        <Form layout="vertical">
          <Form.Item label="姓名">
            <Input />
          </Form.Item>
          <Form.Item label="邮箱">
            <Input />
          </Form.Item>
        </Form>
        <Form layout="inline">
          <Form.Item label="搜索">
            <Input />
          </Form.Item>
          <Form.Item label="状态">
            <Select options={demoOptions} />
          </Form.Item>
        </Form>
      </Space>
    )
  if (name === "Table" || name === "DataGrid")
    return (
      <Table
        size="small"
        rowKey="id"
        rowSelection={{}}
        dataSource={orders.slice(0, 4)}
        scroll={{ x: "max-content" }}
        columns={[
          {
            title: "订单号",
            dataIndex: "id",
            fixed: "left",
            sorter: (a, b) => a.id.localeCompare(b.id),
            filters: [{ text: "订单", value: "ORD" }],
            onFilter: (value, record) => record.id.includes(String(value)),
          },
          { title: "客户", dataIndex: "customer" },
          { title: "状态", dataIndex: "status" },
          { title: "金额", dataIndex: "amount" },
        ]}
        summary={() =>
          name === "DataGrid" ? (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={3}>
                演示汇总
              </Table.Summary.Cell>
            </Table.Summary.Row>
          ) : null
        }
        pagination={false}
      />
    )
  if (name === "Descriptions")
    return (
      <Descriptions
        bordered
        size="small"
        items={[
          { label: "状态", children: "正常" },
          { label: "负责人", children: "林晓" },
          { label: "版本", children: "6.6.2" },
        ]}
      />
    )
  if (name === "List")
    return (
      <List
        size="small"
        dataSource={team.slice(0, 3)}
        renderItem={(member) => (
          <List.Item
            actions={[
              <Button key="view" type="link">
                查看
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={avatar(member.name)}
              title={member.name}
              description={member.email}
            />
          </List.Item>
        )}
      />
    )
  if (name === "Card")
    return (
      <Space>
        <Card size="small" title="小卡片">
          内容
        </Card>
        <Card
          hoverable
          title="可悬停卡片"
          cover={<img alt="placeholder" src={placeholder(320, 100, "Cover")} />}
          actions={[
            <Icon key="edit" name="edit" />,
            <Icon key="delete" name="trash" />,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>A</Avatar>}
            title="Card.Meta"
            description="描述"
          />
        </Card>
      </Space>
    )
  if (name === "Avatar" || name === "AvatarGroup")
    return (
      <Space>
        <Avatar size="small">A</Avatar>
        <Avatar>A</Avatar>
        <Avatar size="large" shape="square" icon={<Icon name="user" />} />
        <Avatar.Group max={{ count: 3 }}>
          {team.slice(0, 5).map((member) => (
            <Avatar key={member.email}>{member.name.slice(0, 1)}</Avatar>
          ))}
        </Avatar.Group>
      </Space>
    )
  if (name === "Badge")
    return (
      <Space>
        <Badge count={5}>
          <Avatar />
        </Badge>
        <Badge dot>
          <Avatar />
        </Badge>
        <Badge status="success" text="成功" />
        <Badge.Ribbon text="推荐">
          <Card size="small">Ribbon</Card>
        </Badge.Ribbon>
      </Space>
    )
  if (name === "Tag")
    return (
      <Space wrap>
        <Tag color="success">成功</Tag>
        <Tag color="processing" closable>
          处理中
        </Tag>
        <Tag.CheckableTag checked>可选标签</Tag.CheckableTag>
        <Tag icon={<Icon name="check" />} color="blue">
          带图标
        </Tag>
      </Space>
    )
  if (name === "Statistic")
    return (
      <Space>
        <Statistic
          title="收入"
          value={128430}
          prefix="¥"
          suffix="元"
          precision={2}
        />
        <Statistic.Countdown title="倒计时" value={countdownValue} />
      </Space>
    )
  if (name === "Timeline")
    return (
      <Timeline
        mode="alternate"
        pending="进行中"
        items={activity.slice(0, 4).map((item, index) => ({
          color: index % 2 ? "green" : "blue",
          children: `${item.user} ${item.action}`,
        }))}
      />
    )
  if (name === "Tree")
    return <Tree checkable showLine defaultExpandAll treeData={treeData} />
  if (name === "Calendar")
    return (
      <div style={{ width: 320 }}>
        <Calendar fullscreen={false} />
      </div>
    )
  if (name === "Image")
    return (
      <Image.PreviewGroup>
        <Space>
          <Image width={140} src={placeholder(280, 160, "Image A")} preview />
          <Image width={140} src={placeholder(280, 160, "Image B")} preview />
        </Space>
      </Image.PreviewGroup>
    )
  if (name === "Carousel") return <CarouselDemo />
  if (name === "Empty")
    return (
      <Space>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
        <Button>操作</Button>
      </Space>
    )
  if (name === "Tooltip")
    return (
      <Space>
        {(["top", "right", "bottom", "left"] as const).map((placement) => (
          <Tooltip key={placement} title={placement} placement={placement}>
            <Button>{placement}</Button>
          </Tooltip>
        ))}
      </Space>
    )
  if (name === "Popover")
    return (
      <Popover title="标题" content="点击后显示内容" trigger="click">
        <Button>打开 Popover</Button>
      </Popover>
    )
  if (name === "QRCode")
    return (
      <Space>
        <QRCode value="acme-console" size={100} />
        <QRCode value="loading" size={100} status="loading" />
      </Space>
    )
  if (name === "Segmented")
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Segmented block options={["日", "周", "月"]} />
        <Segmented size="small" options={["A", "B"]} disabled />
      </Space>
    )
  if (name === "Alert")
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        {(["success", "info", "warning", "error"] as const).map((type) => (
          <Alert
            key={type}
            type={type}
            showIcon
            closable
            banner
            message={`${type} Alert`}
            description="带有说明和操作的提示。"
            action={<Button size="small">操作</Button>}
          />
        ))}
      </Space>
    )
  if (name === "Toast")
    return (
      <Space wrap>
        {(["success", "info", "warning", "error"] as const).map((type) => (
          <Button key={type} onClick={() => message[type]("消息提示")}>
            {type}
          </Button>
        ))}
        <Button onClick={() => message.loading("加载中…")}>loading</Button>
      </Space>
    )
  if (name === "Notification")
    return (
      <Space wrap>
        {(["success", "info", "warning", "error"] as const).map((type) => (
          <Button key={type} onClick={() => notify(type)}>
            {type}
          </Button>
        ))}
        <Button
          onClick={() =>
            notification.info({
              message: "带操作的通知",
              btn: <Button size="small">查看</Button>,
            })
          }
        >
          操作
        </Button>
      </Space>
    )
  if (name === "Dialog")
    return (
      <Space wrap>
        <Button onClick={() => setOpen(true)}>普通 Modal</Button>
        <Button
          onClick={() =>
            Modal.confirm({ title: "确认操作", content: "请确认。" })
          }
        >
          Confirm
        </Button>
        <Button
          onClick={() =>
            Modal.info({
              title: "全屏 Modal",
              content: "全屏内容",
              width: "100vw",
              style: { top: 0, maxWidth: "100vw" },
              styles: { body: { height: "calc(100vh - 110px)" } },
            })
          }
        >
          全屏
        </Button>
        <Button
          onClick={() =>
            Modal.info({
              title: "可滚动",
              content: <div style={{ height: 500 }}>长内容</div>,
              styles: { body: { maxHeight: 320, overflow: "auto" } },
            })
          }
        >
          滚动
        </Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          onOk={() => setOpen(false)}
          title="普通 Modal"
        >
          内容
        </Modal>
      </Space>
    )
  if (name === "Drawer")
    return (
      <Space>
        <Radio.Group
          defaultValue="right"
          options={["top", "right", "bottom", "left"]}
        />
        <Button onClick={() => setDrawer(true)}>打开 Drawer</Button>
        <Drawer open={drawer} onClose={() => setDrawer(false)} title="Drawer">
          内容
        </Drawer>
      </Space>
    )
  if (name === "Progress")
    return (
      <Space wrap>
        <Progress percent={72} size="small" />
        <Progress type="circle" percent={80} />
        <Progress type="dashboard" percent={60} status="active" />
        <Progress steps={5} percent={60} status="exception" />
      </Space>
    )
  if (name === "Skeleton")
    return (
      <Space direction="vertical">
        <Skeleton active avatar />
        <Skeleton.Button active />
        <Skeleton.Input active />
        <Skeleton.Image active />
      </Space>
    )
  if (name === "Spinner")
    return (
      <Space direction="vertical">
        <Spin size="small" />
        <Spin />
        <Spin size="large" tip="加载中">
          <Card>内容</Card>
        </Spin>
      </Space>
    )
  if (name === "Result")
    return (
      <Space wrap>
        {(["success", "error", "warning", "404", "403", "500"] as const).map(
          (status) => (
            <Result
              key={status}
              status={status}
              title={status}
              style={{ width: 150 }}
            />
          )
        )}
      </Space>
    )
  if (name === "Popconfirm")
    return (
      <Popconfirm title="确认删除？" okType="danger">
        <Button danger>删除</Button>
      </Popconfirm>
    )
  if (name === "Menu")
    return (
      <Space>
        <Menu mode="horizontal" items={demoMenu} />
        <Menu mode="vertical" items={demoMenu} />
        <div style={{ width: 64 }}>
          <Menu inlineCollapsed mode="inline" items={demoMenu} />
        </div>
      </Space>
    )
  if (name === "Dropdown")
    return (
      <Space>
        <Dropdown menu={{ items: demoMenu }}>
          <Button>菜单</Button>
        </Dropdown>
        <Dropdown.Button menu={{ items: demoMenu }}>按钮</Dropdown.Button>
        <Dropdown menu={{ items: demoMenu }} trigger={["contextMenu"]}>
          <Card>右键菜单</Card>
        </Dropdown>
      </Space>
    )
  if (name === "Breadcrumb")
    return (
      <Breadcrumb
        items={[
          {
            title: (
              <>
                <Icon name="home" /> 首页
              </>
            ),
          },
          { title: <Dropdown menu={{ items: demoMenu }}>组件</Dropdown> },
          { title: "当前" },
        ]}
      />
    )
  if (name === "Tabs")
    return (
      <Tabs
        type="editable-card"
        items={[
          { key: "1", label: "标签一", children: "内容一" },
          { key: "2", label: "标签二", children: "内容二" },
        ]}
      />
    )
  if (name === "Pagination")
    return (
      <Space direction="vertical">
        <Pagination total={50} showSizeChanger showQuickJumper />
        <Pagination size="small" total={20} />
        <Pagination simple total={20} />
      </Space>
    )
  if (name === "Steps")
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Steps
          current={1}
          items={[{ title: "完成" }, { title: "进行中" }, { title: "待开始" }]}
        />
        <Steps
          size="small"
          status="error"
          items={[{ title: "错误" }, { title: "待处理" }]}
        />
        <Steps
          direction="vertical"
          type="dot"
          items={[{ title: "步骤一" }, { title: "步骤二" }]}
        />
      </Space>
    )
  if (name === "Anchor")
    return (
      <Anchor
        affix={false}
        direction="horizontal"
        items={categories.map((group) => ({
          key: group.label,
          href: `#component-${group.names[0]}`,
          title: group.label,
        }))}
      />
    )
  if (name === "BackTop") return <FloatButton.BackTop visibilityHeight={200} />
  if (name === "Affix")
    return (
      <div style={{ height: 160, overflow: "auto" }}>
        <div style={{ height: 220 }}>
          <Affix offsetTop={64}>
            <Button type="primary">固定按钮</Button>
          </Affix>
        </div>
      </div>
    )
  if (name === "Navbar")
    return (
      <Layout.Header>
        <Menu mode="horizontal" theme="dark" items={demoMenu} />
      </Layout.Header>
    )
  if (name === "Sidebar")
    return (
      <Layout.Sider width={120}>
        <Menu theme="dark" items={demoMenu} />
      </Layout.Sider>
    )
  if (name === "CommandPalette")
    return (
      <>
        <Button onClick={() => setCommand(true)}>打开命令面板 ⌘K</Button>
        <Modal
          open={command}
          onCancel={() => setCommand(false)}
          footer={null}
          title="命令面板"
        >
          <Input.Search autoFocus />
          <List
            dataSource={["打开仪表盘", "新建订单", "进入设置"]}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Modal>
      </>
    )
  if (name === "Grid")
    return (
      <Row gutter={[8, 8]}>
        {[12, 8, 6, 12, 8, 6].map((span, index) => (
          <Col key={index} xs={24} sm={span}>
            <Card size="small">Col {span}</Card>
          </Col>
        ))}
      </Row>
    )
  if (name === "Stack")
    return (
      <Flex vertical gap="small">
        <Space size="large" wrap>
          <Button>一</Button>
          <Button>二</Button>
          <Button>三</Button>
        </Space>
        <Flex gap="small" wrap>
          <Tag>wrap</Tag>
          <Tag>stack</Tag>
        </Flex>
      </Flex>
    )
  if (name === "Layout")
    return (
      <Layout style={{ minHeight: 180 }}>
        <Layout.Header>Header</Layout.Header>
        <Layout>
          <Layout.Sider width={80}>Sider</Layout.Sider>
          <Layout.Content style={{ padding: 16 }}>Content</Layout.Content>
        </Layout>
        <Layout.Footer>Footer</Layout.Footer>
      </Layout>
    )
  if (name === "Container")
    return (
      <Layout.Content
        style={{
          maxWidth: 520,
          margin: "auto",
          width: "100%",
          padding: 16,
          background: token.colorFillSecondary,
        }}
      >
        最大宽度容器
      </Layout.Content>
    )
  if (name === "AspectRatio")
    return (
      <div style={{ aspectRatio: "16/9", width: "100%", maxWidth: 320 }}>
        <img
          src={placeholder(640, 360, "16:9")}
          alt="aspect ratio"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    )
  if (name === "Resizable")
    return (
      <Splitter style={{ height: 120 }}>
        <Splitter.Panel defaultSize="50%">左侧</Splitter.Panel>
        <Splitter.Panel collapsible>右侧</Splitter.Panel>
      </Splitter>
    )
  if (name === "ScrollArea")
    return (
      <div style={{ height: 120, overflow: "auto" }}>
        <List
          dataSource={Array.from(
            { length: 10 },
            (_, index) => `滚动项目 ${index + 1}`
          )}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </div>
    )
  if (name === "Accordion")
    return (
      <Collapse
        accordion
        bordered
        ghost
        expandIconPosition="end"
        items={[
          { key: "1", label: "第一项", children: "面板内容" },
          { key: "2", label: "第二项", children: "更多内容" },
        ]}
      />
    )
  if (name === "ThemeProvider")
    return (
      <ConfigProvider
        theme={{ token: { colorPrimary: token.colorSuccess, borderRadius: 2 } }}
      >
        <Card>
          <Button type="primary">嵌套主题</Button>
          <Switch defaultChecked />
          <Tag>token</Tag>
        </Card>
      </ConfigProvider>
    )
  if (name === "Watermark")
    return (
      <Watermark content="Acme Console">
        <div style={{ height: 120, padding: 20 }}>水印区域</div>
      </Watermark>
    )
  if (name === "Tour")
    return (
      <>
        <Space>
          <Button ref={targetA}>第一步</Button>
          <Button ref={targetB}>第二步</Button>
          <Button ref={targetC}>第三步</Button>
          <Button type="primary" onClick={() => setTourOpen(true)}>
            开始 Tour
          </Button>
        </Space>
        <Tour
          open={tourOpen}
          onClose={() => setTourOpen(false)}
          steps={[
            {
              title: "第一步",
              description: "介绍按钮",
              target: () => targetA.current ?? document.body,
            },
            {
              title: "第二步",
              description: "继续操作",
              target: () => targetB.current ?? document.body,
            },
            {
              title: "第三步",
              description: "完成",
              target: () => targetC.current ?? document.body,
            },
          ]}
        />
      </>
    )
  if (name === "FloatButton")
    return (
      <FloatButton.Group
        shape="square"
        style={{
          position: "relative",
          insetInlineEnd: "auto",
          insetBlockEnd: "auto",
        }}
      >
        <FloatButton icon={<Icon name="plus" />} />
        <FloatButton icon={<Icon name="edit" />} />
        <FloatButton icon={<Icon name="settings" />} />
      </FloatButton.Group>
    )
  if (name === "Kbd") return <Typography.Text keyboard>⌘ K</Typography.Text>
  if (name === "Code")
    return (
      <Space direction="vertical">
        <Typography.Text code>const console = "Acme"</Typography.Text>
        <Typography.Paragraph code>npm run build</Typography.Paragraph>
      </Space>
    )
  if (name === "Divider")
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Divider>居中文本</Divider>
        <Divider titlePlacement="start" dashed>
          左侧虚线
        </Divider>
        <Divider titlePlacement="end">右侧</Divider>
        <Divider type="vertical" />
        普通文本
      </Space>
    )
  if (name === "Link")
    return (
      <Space>
        <Typography.Link>默认链接</Typography.Link>
        <Typography.Link disabled>禁用链接</Typography.Link>
        <Typography.Link underline>
          <Icon name="link" />{" "}
          带图标
        </Typography.Link>
      </Space>
    )
  return <Typography.Text>Ant Design {name} 示例</Typography.Text>
}

function AutoCompleteDemo() {
  return <Select showSearch options={demoOptions} placeholder="可搜索组合框" />
}

function CarouselDemo() {
  return (
    <div style={{ width: "100%" }}>
      <CarouselInner />
    </div>
  )
}

function CarouselInner() {
  return (
    <Carousel autoplay={false} dots>
      <div>
        <Card size="small">幻灯片一</Card>
      </div>
      <div>
        <Card size="small">幻灯片二</Card>
      </div>
      <div>
        <Card size="small">幻灯片三</Card>
      </div>
    </Carousel>
  )
}

function TreeSelectDemo() {
  return <TreeSelect treeData={treeData} placeholder="TreeSelect 补充示例" />
}

function AppInfoDemo() {
  return <Tag color="blue">App / Flex / Space</Tag>
}

const demoMenu: MenuProps["items"] = [
  { key: "1", label: "菜单一" },
  { key: "2", label: "菜单二", children: [{ key: "2-1", label: "子菜单" }] },
]
