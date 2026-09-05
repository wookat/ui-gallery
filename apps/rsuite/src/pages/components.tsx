import { useState, type ReactNode } from "react"
import {
  Accordion, Affix, Animation, AutoComplete, Avatar, AvatarGroup, Badge, Breadcrumb, Box, Button, ButtonGroup,
  ButtonToolbar, Calendar, Card, CardGroup, Cascader, Center, Checkbox, CheckboxGroup, CheckPicker,
  CheckTree, Container, Content, CustomProvider, DateInput, DatePicker, DateRangeInput,
  DateRangePicker, Divider, Drawer, Dropdown, Footer, Form, Grid, Heading, HeadingGroup, Highlight, IconButton,
  Header, Image, InlineEdit, Input, InputGroup, InputNumber, InputPicker, Kbd, Link, List, Loader, MaskedInput,
  Message, Modal, MultiCascader, Navbar, Nav, Notification, Panel, Pagination, PasswordInput,
  PasswordStrengthMeter, Placeholder, Popover, Progress, Radio, RadioGroup, RadioTile, Rate, RangeSlider,
  SelectPicker, SegmentedControl, Sidenav, Sidebar, Slider, Stack, Stat, Steps, Table, Tag, TagGroup, TagInput, Tabs, Text, Textarea,
  TimePicker, TimeRangePicker, Timeline, Toggle, Tree, TreePicker, Uploader, useBreakpointValue, useToaster,
  Tooltip, Whisper, Carousel,
} from "rsuite"
import { zhCN } from "rsuite/locales"
import { Icon } from "@/components/icon"
import { coverage } from "@/coverage"
import { useTheme } from "@/components/theme-context"
import { PageHeader } from "./shared"

const VStack = ({ children, spacing = 12 }: { children: ReactNode; spacing?: number }) => <Stack direction="column" alignItems="stretch" spacing={spacing}>{children}</Stack>
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
  if (name === "Empty") return <Stack direction="column" alignItems="center" spacing={8}><Placeholder.Graph active style={{ width: 120 }} /><Text muted>暂无数据</Text><Button appearance="primary">重新加载</Button></Stack>
  if (name === "Result") return <Stack direction="column" alignItems="center" spacing={8}><Icon name="check" size={28} /><Heading level={5}>操作成功</Heading><Text muted>请求已完成。</Text><Button appearance="primary">继续</Button></Stack>
  if (name === "Transfer") return <TransferDemo />
  if (name === "Descriptions") return <DescriptionsDemo />
  if (name === "Popconfirm") return <Whisper trigger="click" placement="top" speaker={<Popover title="确认删除"><p>此操作无法撤销。</p><ButtonGroup><Button size="sm">取消</Button><Button size="sm" appearance="primary">确认</Button></ButtonGroup></Popover>}><Button color="red">删除</Button></Whisper>
  if (name === "Anchor") return <Nav vertical appearance="subtle">{["Typography", "Button", "Table"].map((item) => <Nav.Item key={item} href={`#component-${item}`}>{item}</Nav.Item>)}</Nav>
  if (name === "BackTop") return <Affix top={600}><IconButton circle icon={<Icon name="arrow-up" />} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} /></Affix>
  if (name === "CommandPalette") return <><Button onClick={() => setOpen(true)}>打开命令面板</Button><Modal open={open} onClose={() => setOpen(false)} size="sm"><Modal.Header><Modal.Title>命令面板</Modal.Title></Modal.Header><Modal.Body><InputGroup inside><InputGroup.Addon><Icon name="search" /></InputGroup.Addon><Input placeholder="搜索命令" /></InputGroup><List hover><List.Item>创建项目</List.Item><List.Item>打开设置</List.Item><List.Item>查看订单</List.Item></List></Modal.Body></Modal></>
  if (name === "FloatButton") return <IconButton circle appearance="primary" icon={<Icon name="plus" />} style={{ position: "relative", float: "right" }} />
  return null
}

function DialogDemo() {
  const [variant, setVariant] = useState<"normal" | "confirm" | "full" | "scroll" | null>(null)
  const labels = { normal: "普通", confirm: "确认", full: "全屏", scroll: "可滚动" }
  return <><div className="demo-row">{(["normal", "confirm", "full", "scroll"] as const).map((item) => <Button key={item} onClick={() => setVariant(item)}>{labels[item]}</Button>)}</div><Modal open={!!variant} size={variant === "full" ? "full" : "sm"} overflow onClose={() => setVariant(null)}><Modal.Header><Modal.Title>{variant ? labels[variant] : ""}</Modal.Title></Modal.Header><Modal.Body>{variant === "confirm" ? "确认删除该记录？此操作无法撤销。" : variant === "scroll" ? Array.from({ length: 20 }, (_, index) => <p key={index}>这是可滚动内容。</p>) : "这是一个普通对话框。"}</Modal.Body><Modal.Footer><Button appearance="primary" color={variant === "confirm" ? "red" : undefined} onClick={() => setVariant(null)}>确认</Button><Button onClick={() => setVariant(null)}>取消</Button></Modal.Footer></Modal></>
}

function SidenavDemo() {
  return <><Sidenav defaultOpenKeys={["3"]} appearance="subtle"><Sidenav.Body><Nav activeKey="1"><Nav.Item eventKey="1" icon={<Icon name="home" />}>垂直菜单</Nav.Item><Nav.Item eventKey="2" disabled>禁用</Nav.Item><Nav.Menu eventKey="3" title="内嵌子菜单" icon={<Icon name="settings" />}><Nav.Item eventKey="3-1">子项 A</Nav.Item><Nav.Item eventKey="3-2">子项 B</Nav.Item></Nav.Menu></Nav></Sidenav.Body></Sidenav><Sidenav expanded={false} appearance="subtle" style={{ width: 56 }}><Sidenav.Body><Nav><Nav.Item icon={<Icon name="home" />}>折叠</Nav.Item><Nav.Item icon={<Icon name="settings" />}>折叠</Nav.Item></Nav></Sidenav.Body></Sidenav></>
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
  const { theme, setTheme } = useTheme()
  if (coverage[name] === "missing") return <MissingDemo name={name} />
  if (name === "Typography") return <VStack spacing={8}><HeadingGroup><Heading level={1}>Heading 1</Heading><Heading level={4}>Heading 4</Heading></HeadingGroup><Text size="lg" weight="bold">Text / <Highlight query="highlight">highlight</Highlight></Text><Text as="blockquote">blockquote</Text><Text as="code">const value = 42</Text><Kbd>⌘ K</Kbd></VStack>
  if (name === "Kbd") return <div className="demo-row"><Kbd>⌘</Kbd><Kbd>Shift</Kbd><Kbd>K</Kbd><Text muted>组合快捷键</Text><Kbd size="xs">Esc</Kbd></div>
  if (name === "Code") return <VStack><Text as="code">npm install rsuite</Text><pre style={{ margin: 0, padding: 12, background: "var(--rs-bg-well)", borderRadius: 6, overflow: "auto" }}><code style={{ display: "block", maxWidth: "100%", whiteSpace: "pre-wrap", overflowWrap: "anywhere", wordBreak: "break-word" }}>{"import { Button } from 'rsuite'\n<Button appearance=\"primary\">保存</Button>"}</code></pre></VStack>
  if (name === "Button") return <VStack spacing={8}><div className="demo-row">{(["default", "primary", "subtle", "ghost", "link"] as const).map((appearance) => <Button key={appearance} appearance={appearance}>{appearance}</Button>)}</div><div className="demo-row">{sizes.map((size) => <Button key={size} size={size}>{size}</Button>)}<Button loading>Loading</Button><Button disabled>Disabled</Button><Button block appearance="primary">Block with icon <Icon name="arrow-right" /></Button></div></VStack>
  if (name === "ButtonGroup") return <VStack><ButtonGroup>{colors.map((color) => <Button key={color} color={color}>{color}</Button>)}</ButtonGroup><ButtonToolbar><Button appearance="primary">保存</Button><Button appearance="default">取消</Button><IconButton circle icon={<Icon name="more-horizontal" />} /></ButtonToolbar></VStack>
  if (name === "IconButton") return <div className="demo-row">{sizes.map((size) => <IconButton key={size} size={size} circle icon={<Icon name="settings" />} />)}<IconButton appearance="primary" icon={<Icon name="plus" />} /><IconButton disabled icon={<Icon name="trash" />} /></div>
  if (name === "Input") return <VStack><div className="demo-row">{sizes.map((size) => <Input key={size} size={size} placeholder={size} />)}</div><div className="demo-row"><Input disabled placeholder="disabled" /><Input readOnly value="readOnly" /><Input plaintext value="plaintext" /></div><InputGroup><InputGroup.Addon><Icon name="search" /></InputGroup.Addon><Input placeholder="搜索订单" /><InputGroup.Button>搜索</InputGroup.Button></InputGroup><PasswordInput placeholder="密码可见切换" /></VStack>
  if (name === "Textarea") return <VStack><Textarea rows={3} placeholder="默认文本域" /><Textarea rows={3} disabled value="disabled" /><Text muted>错误状态：请输入描述。</Text></VStack>
  if (name === "NumberInput") return <InputNumber defaultValue={10} min={0} max={100} step={5} />
  if (["Select", "MultiSelect", "Combobox", "Autocomplete", "Cascader", "MultiCascader", "TreePicker", "CheckPicker", "TagPicker"].includes(name)) return <PickerDemo name={name} />
  if (name === "Checkbox") return <VStack><Checkbox>默认</Checkbox><Checkbox checked>Checked</Checkbox><Checkbox disabled>Disabled</Checkbox><Checkbox indeterminate>Indeterminate</Checkbox><CheckboxGroup inline><Checkbox value="a">A</Checkbox><Checkbox value="b">B</Checkbox></CheckboxGroup></VStack>
  if (name === "Radio") return <VStack><RadioGroup inline><Radio value="a">默认</Radio><Radio value="b">选项 B</Radio></RadioGroup><RadioTile value="tile">RadioTile</RadioTile></VStack>
  if (name === "Switch") return <div className="demo-row">{sizes.map((size) => <Toggle key={size} size={size} defaultChecked>{size}</Toggle>)}</div>
  if (name === "Slider") return <VStack spacing={24}><Slider defaultValue={35} graduated progress /><RangeSlider defaultValue={[20, 80]} graduated /></VStack>
  if (name === "Rating") return <VStack><Rate defaultValue={4.5} allowHalf size="lg" /><Rate defaultValue={3} readOnly color="yellow" /></VStack>
  if (name === "DatePicker") return <div className="demo-row">{sizes.map((size) => <DatePicker key={size} size={size} placeholder={size} />)}<DatePicker disabled placeholder="disabled" /></div>
  if (name === "TimePicker") return <div className="demo-row"><TimePicker format="HH:mm" /><DatePicker format="HH:mm" placeholder="DatePicker HH:mm" /></div>
  if (name === "DateRangePicker") return <div className="demo-row"><DateRangePicker /><DateRangePicker disabled /></div>
  if (name === "Upload") return <Uploader action="#" draggable autoUpload={false} fileListVisible><div style={{ padding: 24 }}>拖拽文件到这里上传（仅展示 UI）</div></Uploader>
  if (name === "PinInput") return <div className="demo-row">{Array.from({ length: 6 }).map((_, i) => <Input key={i} maxLength={1} style={{ width: 40, textAlign: "center" }} />)}</div>
  if (name === "Form") return <Form fluid layout="horizontal"><Form.Group><Form.ControlLabel>名称</Form.ControlLabel><Form.Control name="name" accepter={Input} /></Form.Group><Form.Group><Form.ControlLabel>类型</Form.ControlLabel><Form.Control name="type" accepter={SelectPicker} data={pickerData} /></Form.Group><Button appearance="primary">保存</Button></Form>
  if (name === "Table") return <div className="table-scroll"><Table data={rows} height={180} bordered cellBordered sortColumn="name" sortType="asc" onSortColumn={() => undefined}><Table.Column width={160} fixed="left"><Table.HeaderCell>名称 ↕</Table.HeaderCell><Table.Cell dataKey="name" /></Table.Column><Table.Column width={130}><Table.HeaderCell>状态</Table.HeaderCell><Table.Cell dataKey="status" /></Table.Column><Table.Column width={140}><Table.HeaderCell>金额</Table.HeaderCell><Table.Cell dataKey="amount" /></Table.Column><Table.Column width={120}><Table.HeaderCell>操作</Table.HeaderCell><Table.Cell><Button size="xs">编辑</Button></Table.Cell></Table.Column></Table></div>
  if (name === "DataGrid") return <div className="table-scroll"><Table data={rows} height={220} bordered cellBordered><Table.Column width={56} fixed><Table.HeaderCell><Checkbox /></Table.HeaderCell><Table.Cell><Checkbox /></Table.Cell></Table.Column><Table.Column width={160} sortable><Table.HeaderCell>名称</Table.HeaderCell><Table.Cell dataKey="name" /></Table.Column><Table.ColumnGroup header="订单信息"><Table.Column width={130}><Table.HeaderCell>状态</Table.HeaderCell><Table.Cell dataKey="status" /></Table.Column><Table.Column width={140}><Table.HeaderCell>金额</Table.HeaderCell><Table.Cell dataKey="amount" /></Table.Column></Table.ColumnGroup></Table></div>
  if (name === "List") return <List bordered hover sortable><List.Item>第一项</List.Item><List.Item>第二项</List.Item><List.Item>第三项</List.Item></List>
  if (name === "Card") return <Card bordered><Card.Header>Card</Card.Header><Card.Body>Card 内容</Card.Body><Card.Footer><Button appearance="link">查看详情</Button></Card.Footer></Card>
  if (name === "Avatar") return <div className="demo-row">{sizes.map((size) => <Avatar key={size} size={size} circle bordered>{size}</Avatar>)}<Avatar circle bordered><Icon name="user" /></Avatar></div>
  if (name === "AvatarGroup") return <div className="demo-row"><AvatarGroup stack><Avatar circle>A</Avatar><Avatar circle>B</Avatar><Avatar circle>C</Avatar><Avatar circle>D</Avatar></AvatarGroup><Badge content="+2" /></div>
  if (name === "Badge") return <div className="demo-row"><Badge content={12}><Button>消息</Button></Badge><Badge content="99+" maxCount={99}><IconButton circle icon={<Icon name="bell" />} /></Badge></div>
  if (name === "Tag") return <VStack><div className="demo-row">{colors.map((color) => <Tag key={color} color={color} closable>{color}</Tag>)}</div><TagGroup><Tag>default</Tag><TagInput /></TagGroup></VStack>
  if (name === "Statistic") return <Stat><Stat.Label>收入</Stat.Label><Stat.Value value={128430} /><Stat.HelpText>较上月增长</Stat.HelpText><Text color="green">+12.4%</Text></Stat>
  if (name === "Timeline") return <Timeline align="left"><Timeline.Item time="刚刚">订单已支付</Timeline.Item><Timeline.Item time="1 小时前">项目已更新</Timeline.Item></Timeline>
  if (name === "Tree") return <VStack><Tree data={treeData} showIndentLine /><CheckTree data={treeData} defaultValue={["orders"]} /></VStack>
  if (name === "Calendar") return <Calendar compact bordered />
  if (name === "Image") {
    const imageSrc = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200"><rect width="100%" height="100%" fill="#3498ff"/><circle cx="180" cy="100" r="60" fill="#fff" opacity=".6"/></svg>')
    return <Image src={imageSrc} bordered width={180} height={100} zoomed fit="cover" />
  }
  if (name === "Carousel") return <Carousel shape="bar" placement="bottom" style={{ height: 120 }}><div>Slide 1</div><div>Slide 2</div><div>Slide 3</div></Carousel>
  if (name === "Tooltip") return <div className="demo-row">{(["top", "right", "bottom", "left"] as const).map((placement) => <Whisper key={placement} placement={placement} speaker={<Tooltip>{placement} tooltip</Tooltip>}><Button>{placement}</Button></Whisper>)}</div>
  if (name === "Popover") return <div className="demo-row">{(["top", "right", "bottom", "left"] as const).map((placement) => <Whisper key={placement} trigger="click" placement={placement} speaker={<Popover title="Popover">组合内容</Popover>}><Button>{placement}</Button></Whisper>)}</div>
  if (name === "Segmented") return <div className="demo-row"><SegmentedControl data={["日", "周", "月"].map((label) => ({ label, value: label }))} /><SegmentedControl block data={["A", "B"].map((label) => ({ label, value: label }))} disabled /></div>
  if (name === "Alert") return <VStack><Message type="info" showIcon closable bordered>Info</Message><Message type="success" showIcon closable bordered>Success</Message><Message type="warning" showIcon>Warning</Message><Message type="error" showIcon>Error</Message></VStack>
  if (name === "Toast") return <Button onClick={() => toaster.push(<Message type="success" showIcon>Toast 已推送</Message>, { placement: "topEnd" })}>推送 Toast</Button>
  if (name === "Notification") return <Button onClick={() => toaster.push(<Notification type="success" header="已完成">Notification 已推送</Notification>, { placement: "topEnd" })}>推送 Notification</Button>
  if (name === "Dialog") return <DialogDemo />
  if (name === "Drawer") return <div className="demo-row">{(["left", "right", "top", "bottom"] as const).map((placement) => <Button key={placement} onClick={() => setOpen(true)}>{placement}</Button>)}<Drawer open={open} placement="right" onClose={() => setOpen(false)}><Drawer.Header><Drawer.Title>Drawer</Drawer.Title></Drawer.Header><Drawer.Body>四方向 Drawer 演示</Drawer.Body></Drawer></div>
  if (name === "Progress") return <VStack><Progress.Line percent={72} status="active" /><Progress.Line percent={45} status="success" /><Progress.Circle percent={66} status="active" /></VStack>
  if (name === "Skeleton") return <VStack><Placeholder.Paragraph rows={3} active /><Placeholder.Grid rows={2} columns={3} active /><Placeholder.Graph active /></VStack>
  if (name === "Spinner") return <VStack><div className="demo-row" style={{ gap: 24 }}><Loader size="xs" content="xs" /><Loader size="sm" content="sm" /><Loader size="md" content="md" /></div><div style={{ position: "relative", height: 80, marginTop: 12 }}><Loader backdrop center content="加载中" /></div></VStack>
  if (name === "Menu") return <VStack><Nav appearance="tabs" activeKey="a"><Nav.Item eventKey="a">水平</Nav.Item><Nav.Item eventKey="b">导航</Nav.Item><Nav.Menu title="更多"><Nav.Item>子项</Nav.Item></Nav.Menu></Nav><SidenavDemo /></VStack>
  if (name === "Dropdown") return <Dropdown title="Dropdown"><Dropdown.Item>编辑</Dropdown.Item><Dropdown.Item disabled>禁用</Dropdown.Item><Dropdown.Separator /><Dropdown.Menu title="更多"><Dropdown.Item>复制</Dropdown.Item><Dropdown.Item>归档</Dropdown.Item></Dropdown.Menu></Dropdown>
  if (name === "Breadcrumb") return <Breadcrumb separator="/"><Breadcrumb.Item href="#component-Button">首页</Breadcrumb.Item><Breadcrumb.Item href="#component-Table">设置</Breadcrumb.Item><Breadcrumb.Item active>当前</Breadcrumb.Item></Breadcrumb>
  if (name === "Tabs") return <Tabs defaultActiveKey="1" appearance="subtle"><Tabs.Tab eventKey="1" title="概览">概览内容</Tabs.Tab><Tabs.Tab eventKey="2" title="设置">设置内容</Tabs.Tab></Tabs>
  if (name === "Pagination") return <VStack><Pagination total={40} limit={10} size="sm" maxButtons={3} /><Pagination total={40} limit={10} maxButtons={3} layout={["total", "-", "pager"]} /><Pagination total={40} limit={10} size="xs" maxButtons={3} prev next first last ellipsis boundaryLinks /></VStack>
  if (name === "Steps") return <VStack><div className="table-scroll"><Steps current={1}><Steps.Item title="开始" /><Steps.Item title="进行中" /><Steps.Item title="完成" /></Steps></div><Steps vertical current={2} style={{ maxWidth: 260 }}><Steps.Item title="开始" /><Steps.Item title="进行中" /><Steps.Item title="完成" /></Steps></VStack>
  if (name === "Affix") return <Affix top={10}><Button appearance="primary">Affix 顶部</Button></Affix>
  if (name === "Navbar") return <Navbar><Navbar.Brand>Brand</Navbar.Brand><Nav><Nav.Item>首页</Nav.Item><Nav.Item>设置</Nav.Item></Nav></Navbar>
  if (name === "Sidebar") return <Container style={{ height: 160, border: "1px solid var(--rs-border-primary)" }}><Sidebar width={56}><Sidenav expanded={false} appearance="subtle"><Sidenav.Body><Nav><Nav.Item icon={<Icon name="home" />} /><Nav.Item icon={<Icon name="settings" />} /><Nav.Item icon={<Icon name="users" />} /></Nav></Sidenav.Body></Sidenav></Sidebar><Content style={{ padding: 12 }}><Text>Content</Text></Content></Container>
  if (name === "Grid") return <Grid fluid><div className="demo-row"><Panel bordered>A</Panel><Panel bordered>B</Panel><Panel bordered>C</Panel></div></Grid>
  if (name === "Stack") return <Stack spacing={12} wrap><Button>A</Button><Button>B</Button><Button>C</Button></Stack>
  if (name === "Layout" || name === "Container") return <Container style={{ border: "1px solid var(--rs-border-primary)" }}><Header><Panel bodyFill style={{ padding: 8 }}>Header</Panel></Header><Container><Sidebar width={80} style={{ padding: 8, borderRight: "1px solid var(--rs-border-primary)" }}>Sidebar</Sidebar><Content style={{ padding: 8 }}>Content</Content></Container><Footer style={{ padding: 8, borderTop: "1px solid var(--rs-border-primary)" }}>Footer</Footer></Container>
  if (name === "Accordion") return <Accordion bordered><Accordion.Panel header="常见问题">回答内容</Accordion.Panel><Accordion.Panel header="更多信息">更多内容</Accordion.Panel></Accordion>
  if (name === "ThemeProvider") return <CustomProvider locale={zhCN}><VStack><Text muted>当前主题：{theme}（CustomProvider theme="{theme}"）</Text><div className="demo-row"><Button appearance="primary" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>切换主题</Button><DatePicker placeholder="zhCN 本地化" /></div></VStack></CustomProvider>
  if (name === "Divider") return <VStack><Divider>横向分隔</Divider><div style={{ height: 40, display: "flex", alignItems: "center" }}><Text>左</Text><Divider vertical /><Text>右</Text></div></VStack>
  if (name === "Link") return <VStack><Link href="#component-Button">默认链接</Link><Link href="#component-Button" disabled>禁用链接</Link></VStack>
  if (name === "Navigation") return <Nav appearance="tabs"><Nav.Item>一</Nav.Item><Nav.Item>二</Nav.Item></Nav>
  if (name === "Animation") return <Animation.Fade in><Panel bordered>Fade animation</Panel></Animation.Fade>
  if (name === "Box") return <Box as="section" style={{ padding: 12, border: "1px dashed var(--rs-border-primary)" }}>Box as="section"</Box>
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
  if (coverage[name] === "composed") return <ComposedDemo name={name} open={open} setOpen={setOpen} />
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
