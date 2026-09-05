import { useState } from "react"
import {
  Accordion, Affix, Animation, AutoComplete, Avatar, AvatarGroup, Badge, Breadcrumb, Button, ButtonGroup,
  ButtonToolbar, Calendar, Card, CardGroup, Cascader, Center, Checkbox, CheckboxGroup, CheckPicker,
  CheckTree, Container, CustomProvider, DateInput, DatePicker, DateRangeInput,
  DateRangePicker, Divider, Drawer, Dropdown, Form, Grid, Heading, HeadingGroup, Highlight, IconButton,
  Image, InlineEdit, Input, InputGroup, InputNumber, InputPicker, Kbd, Link, List, Loader, MaskedInput,
  Message, Modal, MultiCascader, Navbar, Nav, Notification, Panel, Pagination, PasswordInput,
  PasswordStrengthMeter, Placeholder, Popover, Progress, Radio, RadioGroup, RadioTile, Rate, RangeSlider,
  SelectPicker, SegmentedControl, Slider, Stack, Stat, Steps, Table, Tag, TagGroup, TagInput, Tabs, Text, Textarea,
  TimePicker, TimeRangePicker, Timeline, Toggle, Tree, TreePicker, Uploader, useBreakpointValue, useToaster,
  Tooltip, Whisper, Carousel,
} from "rsuite"
import { Icon } from "@/components/icon"
import { coverage } from "@/coverage"
import { PageHeader } from "./shared"

const names = Object.keys(coverage)
const extras = ["Animation", "Box", "Center", "DateInput", "DateRangeInput", "MaskedInput", "PasswordInput", "PasswordStrengthMeter", "Highlight", "HeadingGroup", "InlineEdit", "RadioTile", "ButtonToolbar", "FormStack", "VisuallyHidden", "CascadeTree", "useBreakpointValue", "TimeRangePicker", "TagInput", "CardGroup"]
const colors = ["red", "orange", "yellow", "green", "cyan", "blue", "violet"] as const
const sizes = ["xs", "sm", "md", "lg"] as const
const pickerData = ["Starter", "Pro", "Enterprise"].map((label) => ({ label, value: label }))
const treeData = [{ label: "工作区", value: "workspace", children: [{ label: "订单", value: "orders" }, { label: "报表", value: "reports" }] }]
const rows = [{ id: 1, name: "林晓", status: "active", amount: "¥128,430" }, { id: 2, name: "王子涵", status: "pending", amount: "¥32,100" }, { id: 3, name: "Alex Chen", status: "paid", amount: "¥18,900" }]

function MissingDemo({ name }: { name: string }) {
  return <Message type="warning" showIcon>{name} 不是 React Suite 6.2.4 的组件。此处保留缺失说明，不伪造实现。{name === "ColorPicker" ? <InputGroup style={{ marginTop: 12 }}><InputGroup.Addon>原生回退</InputGroup.Addon><input type="color" defaultValue="#3498ff" /></InputGroup> : null}</Message>
}

function TransferDemo() {
  const [left, setLeft] = useState(["订单", "客户", "团队"])
  const [right, setRight] = useState(["收入"])
  const move = (from: string[], setFrom: (value: string[]) => void, to: string[], setTo: (value: string[]) => void) => {
    if (!from.length) return
    setFrom(from.slice(1))
    setTo([...to, from[0]])
  }
  return <div className="demo-row"><Stack spacing={4}><Text muted>可选</Text><List bordered style={{ width: 150 }}>{left.map((item) => <List.Item key={item}>{item}</List.Item>)}</List></Stack><ButtonGroup vertical><Button onClick={() => move(left, setLeft, right, setRight)}>→</Button><Button onClick={() => move(right, setRight, left, setLeft)}>←</Button></ButtonGroup><Stack spacing={4}><Text muted>已选</Text><List bordered style={{ width: 150 }}>{right.map((item) => <List.Item key={item}>{item}</List.Item>)}</List></Stack></div>
}

function DescriptionsDemo() {
  return <Grid fluid><div className="description-grid"><Text muted>订单编号</Text><Text>ORD-2400</Text><Text muted>客户</Text><Text>林晓</Text><Text muted>金额</Text><Text>¥128,430</Text><Text muted>状态</Text><Tag color="green">paid</Tag></div></Grid>
}

function ComposedDemo({ name, open, setOpen }: { name: string; open: boolean; setOpen: (value: boolean) => void }) {
  if (name === "ColorPicker") return <InputGroup><InputGroup.Addon>原生颜色选择</InputGroup.Addon><input type="color" defaultValue="#3498ff" /></InputGroup>
  if (name === "Empty") return <Stack alignItems="center"><Placeholder.Graph active style={{ width: 120 }} /><Text muted>暂无数据</Text><Button appearance="primary">重新加载</Button></Stack>
  if (name === "Result") return <Stack alignItems="center"><Icon name="check" size={28} /><Heading level={5}>操作成功</Heading><Text muted>请求已完成。</Text><Button appearance="primary">继续</Button></Stack>
  if (name === "Transfer") return <TransferDemo />
  if (name === "Descriptions") return <DescriptionsDemo />
  if (name === "Popconfirm") return <Whisper trigger="click" placement="top" speaker={<Popover title="确认删除"><p>此操作无法撤销。</p><ButtonGroup><Button size="sm">取消</Button><Button size="sm" appearance="primary">确认</Button></ButtonGroup></Popover>}><Button color="red">删除</Button></Whisper>
  if (name === "Anchor") return <Nav vertical appearance="subtle">{["Typography", "Button", "Table"].map((item) => <Nav.Item key={item} href={`#component-${item}`}>{item}</Nav.Item>)}</Nav>
  if (name === "BackTop") return <Affix top={600}><IconButton circle icon={<Icon name="arrow-up" />} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} /></Affix>
  if (name === "CommandPalette") return <><Button onClick={() => setOpen(true)}>打开命令面板</Button><Modal open={open} onClose={() => setOpen(false)} size="sm"><Modal.Header><Modal.Title>命令面板</Modal.Title></Modal.Header><Modal.Body><InputGroup inside><InputGroup.Addon><Icon name="search" /></InputGroup.Addon><Input placeholder="搜索命令" /></InputGroup><List hover><List.Item>创建项目</List.Item><List.Item>打开设置</List.Item><List.Item>查看订单</List.Item></List></Modal.Body></Modal></>
  if (name === "FloatButton") return <IconButton circle appearance="primary" icon={<Icon name="plus" />} style={{ position: "relative", float: "right" }} />
  return null
}

function PickerDemo({ name }: { name: string }) {
  if (name === "Select") return <SelectPicker data={pickerData} block />
  if (name === "MultiSelect") return <CheckPicker data={pickerData} block />
  if (name === "Combobox") return <InputPicker creatable data={pickerData} block />
  if (name === "Autocomplete") return <AutoComplete data={pickerData.map((item) => item.label)} block />
  if (name === "Cascader") return <Cascader data={treeData} block />
  if (name === "MultiCascader") return <MultiCascader data={treeData} block />
  if (name === "TreePicker") return <TreePicker data={treeData} block />
  if (name === "CheckPicker") return <CheckPicker data={pickerData} block />
  if (name === "TagPicker") return <TagInput placeholder="添加标签" />
  return null
}

function Demo({ name, open, setOpen }: { name: string; open: boolean; setOpen: (value: boolean) => void }) {
  const toaster = useToaster()
  const breakpoint = useBreakpointValue({ xs: "mobile", md: "desktop" })
  if (coverage[name] === "missing") return <MissingDemo name={name} />
  if (coverage[name] === "composed") return <ComposedDemo name={name} open={open} setOpen={setOpen} />
  if (name === "Typography") return <Stack spacing={8}><HeadingGroup><Heading level={1}>Heading 1</Heading><Heading level={4}>Heading 4</Heading></HeadingGroup><Text size="lg" weight="bold">Text / <Highlight query="highlight">highlight</Highlight></Text><Text as="blockquote">blockquote</Text><Text as="code">const value = 42</Text><Kbd>⌘ K</Kbd></Stack>
  if (name === "Button") return <Stack spacing={8}><div className="demo-row">{(["default", "primary", "subtle", "ghost", "link"] as const).map((appearance) => <Button key={appearance} appearance={appearance}>{appearance}</Button>)}</div><div className="demo-row">{sizes.map((size) => <Button key={size} size={size}>{size}</Button>)}<Button loading>Loading</Button><Button disabled>Disabled</Button><Button block appearance="primary">Block with icon <Icon name="arrow-right" /></Button></div></Stack>
  if (name === "ButtonGroup") return <Stack><ButtonGroup>{colors.map((color) => <Button key={color} color={color}>{color}</Button>)}</ButtonGroup><ButtonToolbar><Button appearance="primary">保存</Button><Button appearance="default">取消</Button><IconButton circle icon={<Icon name="more-horizontal" />} /></ButtonToolbar></Stack>
  if (name === "IconButton") return <div className="demo-row">{sizes.map((size) => <IconButton key={size} size={size} circle icon={<Icon name="settings" />} />)}<IconButton appearance="primary" icon={<Icon name="plus" />} /><IconButton disabled icon={<Icon name="trash" />} /></div>
  if (name === "Input") return <Stack><div className="demo-row">{sizes.map((size) => <Input key={size} size={size} placeholder={size} />)}</div><div className="demo-row"><Input disabled placeholder="disabled" /><Input readOnly value="readOnly" /><Input plaintext value="plaintext" /></div><InputGroup inside><InputGroup.Addon><Icon name="search" /></InputGroup.Addon><Input placeholder="前后缀 / 按钮" /><InputGroup.Button>搜索</InputGroup.Button></InputGroup><PasswordInput placeholder="密码可见切换" /></Stack>
  if (name === "Textarea") return <Stack><Textarea rows={3} placeholder="默认文本域" /><Textarea rows={3} disabled value="disabled" /><Text muted>错误状态：请输入描述。</Text></Stack>
  if (name === "NumberInput") return <InputNumber defaultValue={10} min={0} max={100} step={5} />
  if (["Select", "MultiSelect", "Combobox", "Autocomplete", "Cascader", "MultiCascader", "TreePicker", "CheckPicker", "TagPicker"].includes(name)) return <PickerDemo name={name} />
  if (name === "Checkbox") return <Stack><Checkbox>默认</Checkbox><Checkbox checked>Checked</Checkbox><Checkbox disabled>Disabled</Checkbox><Checkbox indeterminate>Indeterminate</Checkbox><CheckboxGroup inline><Checkbox value="a">A</Checkbox><Checkbox value="b">B</Checkbox></CheckboxGroup></Stack>
  if (name === "Radio") return <Stack><RadioGroup inline><Radio value="a">默认</Radio><Radio value="b">选项 B</Radio></RadioGroup><RadioTile value="tile">RadioTile</RadioTile></Stack>
  if (name === "Switch") return <div className="demo-row">{sizes.map((size) => <Toggle key={size} size={size} defaultChecked>{size}</Toggle>)}</div>
  if (name === "Slider") return <Stack><Slider defaultValue={35} graduated /><RangeSlider defaultValue={[20, 80]} graduated /></Stack>
  if (name === "Rating") return <Stack><Rate defaultValue={4.5} allowHalf size="lg" /><Rate defaultValue={3} readOnly color="yellow" /></Stack>
  if (name === "DatePicker") return <div className="demo-row">{sizes.map((size) => <DatePicker key={size} size={size} placeholder={size} />)}<DatePicker disabled placeholder="disabled" /></div>
  if (name === "TimePicker") return <div className="demo-row"><TimePicker format="HH:mm" /><DatePicker format="HH:mm" placeholder="DatePicker HH:mm" /></div>
  if (name === "DateRangePicker") return <div className="demo-row"><DateRangePicker /><DateRangePicker disabled /></div>
  if (name === "Upload") return <Uploader action="#" draggable autoUpload={false} fileListVisible><div style={{ padding: 24 }}>拖拽文件到这里上传（仅展示 UI）</div></Uploader>
  if (name === "PinInput") return <InputGroup><Input placeholder="PinInput fallback" /><InputGroup.Addon>6 位</InputGroup.Addon></InputGroup>
  if (name === "Form") return <Form fluid layout="horizontal"><Form.Group><Form.ControlLabel>名称</Form.ControlLabel><Form.Control name="name" accepter={Input} /></Form.Group><Form.Group><Form.ControlLabel>类型</Form.ControlLabel><Form.Control name="type" accepter={SelectPicker} data={pickerData} /></Form.Group><Button appearance="primary">保存</Button></Form>
  if (name === "Table" || name === "DataGrid") return <div className="table-scroll"><Table data={rows} height={180} bordered cellBordered affixHeader sortColumn="name" sortType="asc" onSortColumn={() => undefined}><Table.Column width={160} fixed="left"><Table.HeaderCell>名称 ↕</Table.HeaderCell><Table.Cell dataKey="name" /></Table.Column><Table.Column width={130}><Table.HeaderCell>状态</Table.HeaderCell><Table.Cell dataKey="status" /></Table.Column><Table.Column width={140}><Table.HeaderCell>金额</Table.HeaderCell><Table.Cell dataKey="amount" /></Table.Column><Table.Column width={120}><Table.HeaderCell>操作</Table.HeaderCell><Table.Cell><Button size="xs">编辑</Button></Table.Cell></Table.Column></Table></div>
  if (name === "List") return <List bordered hover sortable><List.Item>第一项</List.Item><List.Item>第二项</List.Item><List.Item>第三项</List.Item></List>
  if (name === "Card") return <Card bordered><Card.Header>Card</Card.Header><Card.Body>Card 内容</Card.Body><Card.Footer><Button appearance="link">查看详情</Button></Card.Footer></Card>
  if (name === "Avatar") return <div className="demo-row">{sizes.map((size) => <Avatar key={size} size={size} circle bordered>{size}</Avatar>)}<Avatar circle bordered><Icon name="user" /></Avatar></div>
  if (name === "AvatarGroup") return <div className="demo-row"><AvatarGroup stack><Avatar circle>A</Avatar><Avatar circle>B</Avatar><Avatar circle>C</Avatar><Avatar circle>D</Avatar></AvatarGroup><Badge content="+2" /></div>
  if (name === "Badge") return <div className="demo-row"><Badge content={12}><Button>消息</Button></Badge><Badge content="99+" maxCount={99}><IconButton circle icon={<Icon name="bell" />} /></Badge></div>
  if (name === "Tag") return <Stack><div className="demo-row">{colors.map((color) => <Tag key={color} color={color} closable>{color}</Tag>)}</div><TagGroup><Tag>default</Tag><TagInput /></TagGroup></Stack>
  if (name === "Statistic") return <Stat><Stat.Label>收入</Stat.Label><Stat.Value value={128430} /><Stat.HelpText>较上月增长</Stat.HelpText><Text color="green">+12.4%</Text></Stat>
  if (name === "Timeline") return <Timeline align="left"><Timeline.Item time="刚刚">订单已支付</Timeline.Item><Timeline.Item time="1 小时前">项目已更新</Timeline.Item></Timeline>
  if (name === "Tree") return <Stack><Tree data={treeData} showIndentLine /><CheckTree data={treeData} defaultValue={["orders"]} /></Stack>
  if (name === "Calendar") return <Calendar compact bordered />
  if (name === "Image") return <Image bordered width={180} height={100} placeholder={<Placeholder.Graph active />} zoomed />
  if (name === "Carousel") return <Carousel shape="bar" placement="bottom" style={{ height: 120 }}><div>Slide 1</div><div>Slide 2</div><div>Slide 3</div></Carousel>
  if (name === "Tooltip") return <div className="demo-row">{(["top", "right", "bottom", "left"] as const).map((placement) => <Whisper key={placement} placement={placement} speaker={<Tooltip>{placement} tooltip</Tooltip>}><Button>{placement}</Button></Whisper>)}</div>
  if (name === "Popover") return <div className="demo-row">{(["top", "right", "bottom", "left"] as const).map((placement) => <Whisper key={placement} trigger="click" placement={placement} speaker={<Popover title="Popover">组合内容</Popover>}><Button>{placement}</Button></Whisper>)}</div>
  if (name === "Segmented") return <div className="demo-row"><SegmentedControl data={["日", "周", "月"].map((label) => ({ label, value: label }))} /><SegmentedControl block data={["A", "B"].map((label) => ({ label, value: label }))} disabled /></div>
  if (name === "Alert") return <Stack><Message type="info" showIcon closable bordered>Info</Message><Message type="success" showIcon closable bordered>Success</Message><Message type="warning" showIcon>Warning</Message><Message type="error" showIcon>Error</Message></Stack>
  if (name === "Toast") return <Button onClick={() => toaster.push(<Message type="success" showIcon>Toast 已推送</Message>, { placement: "topEnd" })}>推送 Toast</Button>
  if (name === "Notification") return <Button onClick={() => toaster.push(<Notification type="success" header="已完成">Notification 已推送</Notification>, { placement: "topEnd" })}>推送 Notification</Button>
  if (name === "Dialog") return <div className="demo-row"><Button onClick={() => setOpen(true)}>normal</Button><Button onClick={() => setOpen(true)}>confirm</Button><Modal open={open} overflow onClose={() => setOpen(false)} size="sm"><Modal.Header><Modal.Title>Dialog</Modal.Title></Modal.Header><Modal.Body>Modal normal / confirm / overflow</Modal.Body><Modal.Footer><Button appearance="primary" onClick={() => setOpen(false)}>确认</Button></Modal.Footer></Modal></div>
  if (name === "Drawer") return <div className="demo-row">{(["left", "right", "top", "bottom"] as const).map((placement) => <Button key={placement} onClick={() => setOpen(true)}>{placement}</Button>)}<Drawer open={open} placement="right" onClose={() => setOpen(false)}><Drawer.Header><Drawer.Title>Drawer</Drawer.Title></Drawer.Header><Drawer.Body>四方向 Drawer 演示</Drawer.Body></Drawer></div>
  if (name === "Progress") return <Stack><Progress.Line percent={72} status="active" /><Progress.Line percent={45} status="success" /><Progress.Circle percent={66} status="active" /></Stack>
  if (name === "Skeleton") return <Stack><Placeholder.Paragraph rows={3} active /><Placeholder.Grid rows={2} columns={3} active /><Placeholder.Graph active /></Stack>
  if (name === "Spinner") return <div className="demo-row"><Loader size="xs" /><Loader size="sm" /><Loader size="md" /><Loader size="lg" inverse content="加载中" /></div>
  if (name === "Menu") return <Nav appearance="tabs" vertical><Nav.Item active>菜单项</Nav.Item><Nav.Item disabled>禁用</Nav.Item><Nav.Menu title="子菜单"><Nav.Item>子项 A</Nav.Item><Nav.Item>子项 B</Nav.Item></Nav.Menu></Nav>
  if (name === "Dropdown") return <Dropdown title="Dropdown"><Dropdown.Item>编辑</Dropdown.Item><Dropdown.Item disabled>禁用</Dropdown.Item><Dropdown.Separator /><Dropdown.Menu title="更多"><Dropdown.Item>复制</Dropdown.Item><Dropdown.Item>归档</Dropdown.Item></Dropdown.Menu></Dropdown>
  if (name === "Breadcrumb") return <Breadcrumb separator="/"><Breadcrumb.Item href="#component-Button">首页</Breadcrumb.Item><Breadcrumb.Item href="#component-Table">设置</Breadcrumb.Item><Breadcrumb.Item active>当前</Breadcrumb.Item></Breadcrumb>
  if (name === "Tabs") return <Tabs defaultActiveKey="1" appearance="subtle"><Tabs.Tab eventKey="1" title="概览">概览内容</Tabs.Tab><Tabs.Tab eventKey="2" title="设置">设置内容</Tabs.Tab></Tabs>
  if (name === "Pagination") return <div className="demo-row"><Pagination total={40} limit={10} size="sm" /><Pagination total={40} limit={10} size="lg" layout={["total", "-", "limit", "|", "pager", "skip"]} /></div>
  if (name === "Steps") return <Stack><Steps current={1}><Steps.Item title="开始" /><Steps.Item title="进行中" /><Steps.Item title="完成" /></Steps><Steps vertical current={2}><Steps.Item title="开始" /><Steps.Item title="进行中" /><Steps.Item title="完成" /></Steps></Stack>
  if (name === "Affix") return <Affix top={10}><Button appearance="primary">Affix 顶部</Button></Affix>
  if (name === "Navbar") return <Navbar><Navbar.Brand>Brand</Navbar.Brand><Nav><Nav.Item>首页</Nav.Item><Nav.Item>设置</Nav.Item></Nav></Navbar>
  if (name === "Sidebar") return <Container style={{ height: 150 }}><Container><Text>Content</Text></Container><Panel bordered style={{ width: 120 }}>Sidebar</Panel></Container>
  if (name === "Grid") return <Grid fluid><div className="demo-row"><Panel bordered>A</Panel><Panel bordered>B</Panel><Panel bordered>C</Panel></div></Grid>
  if (name === "Stack") return <Stack spacing={12} wrap><Button>A</Button><Button>B</Button><Button>C</Button></Stack>
  if (name === "Layout" || name === "Container") return <Container style={{ border: "1px solid var(--rs-border-primary)", padding: 12 }}><Text>Header / Content / Footer layout</Text></Container>
  if (name === "Accordion") return <Accordion bordered><Accordion.Panel header="常见问题">回答内容</Accordion.Panel><Accordion.Panel header="更多信息">更多内容</Accordion.Panel></Accordion>
  if (name === "ThemeProvider") return <CustomProvider theme="dark"><Panel bordered>CustomProvider dark theme</Panel></CustomProvider>
  if (name === "Divider") return <Stack><Divider>横向分隔</Divider><div style={{ height: 40, display: "flex", alignItems: "center" }}><Text>左</Text><Divider vertical /><Text>右</Text></div></Stack>
  if (name === "Link") return <Stack><Link href="#component-Button">默认链接</Link><Link href="#component-Button" disabled>禁用链接</Link></Stack>
  if (name === "Navigation") return <Nav appearance="tabs"><Nav.Item>一</Nav.Item><Nav.Item>二</Nav.Item></Nav>
  if (name === "Animation") return <Animation.Fade in><Panel bordered>Fade animation</Panel></Animation.Fade>
  if (name === "Box") return <Panel bordered>Box layout primitive</Panel>
  if (name === "Center") return <Center style={{ height: 80 }}><Button>Centered</Button></Center>
  if (name === "DateInput") return <DateInput />
  if (name === "DateRangeInput") return <DateRangeInput />
  if (name === "MaskedInput") return <MaskedInput mask={[/\\d/, /\\d/, /\\d/, /\\d/]} placeholder="0000" />
  if (name === "PasswordInput") return <PasswordInput />
  if (name === "PasswordStrengthMeter") return <PasswordStrengthMeter />
  if (name === "Highlight") return <Highlight query="suite">React Suite Highlight</Highlight>
  if (name === "HeadingGroup") return <HeadingGroup><Heading level={5}>Heading</Heading><Text muted>副标题</Text></HeadingGroup>
  if (name === "InlineEdit") return <InlineEdit defaultValue="点击编辑" />
  if (name === "RadioTile") return <RadioTile value="tile">Radio tile</RadioTile>
  if (name === "ButtonToolbar") return <ButtonToolbar><Button>保存</Button><Button>取消</Button></ButtonToolbar>
  if (name === "FormStack") return <Form fluid><Form.Group><Form.ControlLabel>字段</Form.ControlLabel><Input /></Form.Group></Form>
  if (name === "VisuallyHidden") return <Text>VisuallyHidden export available</Text>
  if (name === "CascadeTree") return <Tree data={treeData} />
  if (name === "useBreakpointValue") return <Text>当前响应式值：{breakpoint}</Text>
  if (name === "TimeRangePicker") return <TimeRangePicker />
  if (name === "TagInput") return <TagInput />
  if (name === "CardGroup") return <CardGroup><Card bordered><Card.Body>Card A</Card.Body></Card><Card bordered><Card.Body>Card B</Card.Body></Card></CardGroup>
  return <Text muted>{name} demo</Text>
}

function sectionFor(name: string) {
  if (["Typography", "Kbd", "Code", "Highlight", "HeadingGroup", "Divider", "Link"].includes(name)) return "Typography"
  if (["Button", "ButtonGroup", "IconButton", "ButtonToolbar", "RadioTile"].includes(name)) return "Buttons"
  if (["Input", "Textarea", "NumberInput", "Checkbox", "Radio", "Switch", "PinInput", "Form", "PasswordInput", "MaskedInput", "PasswordStrengthMeter", "InlineEdit", "FormStack"].includes(name)) return "Inputs"
  if (["Select", "MultiSelect", "Combobox", "Autocomplete", "DatePicker", "TimePicker", "DateRangePicker", "Cascader", "MultiCascader", "TreePicker", "CheckPicker", "TagPicker", "DateInput", "DateRangeInput", "TimeRangePicker", "TagInput"].includes(name)) return "Pickers"
  if (["Table", "DataGrid", "Descriptions", "List", "Card", "CardGroup", "Avatar", "AvatarGroup", "Badge", "Tag", "Statistic", "Timeline", "Tree", "Calendar", "Image", "Carousel"].includes(name)) return "Data Display"
  if (["Alert", "Toast", "Notification", "Progress", "Skeleton", "Spinner", "Empty", "Result"].includes(name)) return "Feedback"
  if (["Menu", "Dropdown", "Breadcrumb", "Tabs", "Pagination", "Steps", "Anchor", "Navbar", "Sidebar", "Affix", "BackTop", "Grid", "Stack", "Layout", "Container", "Accordion", "ThemeProvider", "useBreakpointValue", "Box", "Center", "CascadeTree"].includes(name)) return "Navigation & Layout"
  return "Overlay & Other"
}

export function ComponentsPage() {
  const [open, setOpen] = useState<string | null>(null)
  const all = [...names, ...extras]
  const sections = [...new Set(all.map(sectionFor))]
  return <div className="page-stack"><PageHeader title="组件全集" description="React Suite 6.2.4 组件、变体、状态与组合示例。" /><Panel bordered><div className="anchor-index">{all.map((name) => <a key={name} href={`#component-${name}`}>{name}</a>)}</div></Panel>{sections.map((section) => <section key={section}><Heading level={3}>{section}</Heading><div className="demo-grid">{all.filter((name) => sectionFor(name) === section).map((name) => { const status = coverage[name]; return <Panel bordered key={name} id={`component-${name}`} header={<span>{name} <Tag color={status === "missing" ? "orange" : status === "composed" ? "violet" : "green"}>{status ?? "extra"}</Tag></span>}><Demo name={name} open={open === name} setOpen={(value) => setOpen(value ? name : null)} /></Panel> })}</div></section>)}</div>
}
