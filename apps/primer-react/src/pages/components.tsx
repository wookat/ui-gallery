import { useRef, useState } from "react"
import contract from "@ui-gallery/spec/contract.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import {
  ActionList,
  ActionMenu,
  Autocomplete,
  Avatar,
  AvatarStack,
  Banner,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  CircleBadge,
  ConfirmationDialog,
  CounterLabel,
  Details,
  Dialog,
  FormControl,
  Heading,
  Header,
  IconButton,
  Label,
  LabelGroup,
  Link,
  LinkButton,
  NavList,
  Pagination,
  Popover,
  ProgressBar,
  Radio,
  RadioGroup,
  SegmentedControl,
  Select,
  SelectPanel,
  StateLabel,
  Spinner,
  Text,
  TextInput,
  TextInputWithTokens,
  Textarea,
  Timeline,
  ToggleSwitch,
  Token,
  Tooltip,
  TreeView,
  UnderlineNav,
  useDetails,
} from "@primer/react"
import {
  Blankslate,
  Card,
  DataTable,
  InlineMessage,
  KeybindingHint,
  ScrollableRegion,
  SkeletonAvatar,
  SkeletonBox,
  SkeletonText,
  Stack,
  Table,
  TopicTag,
} from "@primer/react/experimental"
import { Icon, iconFor } from "@/lib/icon"
import { useColorMode } from "@/lib/color-mode"
import { avatarFor, placeholderImage } from "@/lib/avatar"
import team from "@ui-gallery/spec/mock/team.json"
import landing from "@ui-gallery/spec/mock/landing.json"
import { coverage } from "../coverage"
import { PageHeader } from "./shared"

const missing = new Set(["Calendar", "Carousel", "QRCode", "Affix", "AspectRatio", "Watermark", "Tour"])
const buttonVariants = ["default", "primary", "danger", "invisible", "link"] as const
const buttonSizes = ["small", "medium", "large"] as const
const labelVariants = ["default", "primary", "secondary", "accent", "success", "attention", "severe", "danger", "done", "sponsors"] as const

type OrderRow = {
  id: string
  customer: string
  status: string
  amount: string
}

function LocalBlankslate({ name }: { name: string }) {
  return (
    <Blankslate border size="small">
      <Blankslate.Visual><Icon name="package" size={24} /></Blankslate.Visual>
      <Blankslate.Heading as="h3">{name}</Blankslate.Heading>
      <Blankslate.Description>Primer 未提供该组件</Blankslate.Description>
    </Blankslate>
  )
}

function TableDemo({ dataGrid = false }: { dataGrid?: boolean }) {
  const [page, setPage] = useState(1)
  const rows: OrderRow[] = orders.slice((page - 1) * 4, page * 4).map((order) => ({
    id: order.id,
    customer: order.customer,
    status: order.status,
    amount: `¥${order.amount.toLocaleString()}`,
  }))
  const columns = [
    { field: "id" as const, header: "订单号", rowHeader: true, sortBy: true },
    { field: "customer" as const, header: "客户", sortBy: true },
    { field: "status" as const, header: "状态" },
    { field: "amount" as const, header: "金额", align: "end" as const },
  ]
  if (dataGrid) {
    return (
      <div className="stack-3 demo-table">
        <div className="table-scroll"><DataTable aria-labelledby="datagrid-title" data={rows} columns={columns} initialSortColumn="id" initialSortDirection="ASC" /></div>
        <span id="datagrid-title" className="sr-only">订单 DataTable</span>
        <div className="pager-compact"><Pagination pageCount={3} currentPage={page} showPages={false} onPageChange={(e, n) => { e.preventDefault(); setPage(n) }} /></div>
      </div>
    )
  }
  return (
    <div className="stack-3 demo-table">
      {(["condensed", "normal"] as const).map((cellPadding) => (
        <div className="table-scroll" key={cellPadding}><Table.Container>
          <Table.Title as="h3" id={`table-title-${cellPadding}`}>订单表 · {cellPadding}</Table.Title>
          <Table cellPadding={cellPadding} aria-labelledby={`table-title-${cellPadding}`} gridTemplateColumns="minmax(96px, 1fr) minmax(72px, 1fr) auto">
          <Table.Head><Table.Row><Table.Header>订单号</Table.Header><Table.Header>客户</Table.Header><Table.Header>状态</Table.Header></Table.Row></Table.Head>
          <Table.Body>{rows.slice(0, 2).map((row) => <Table.Row key={`${cellPadding}-${row.id}`}><Table.Cell scope="row">{row.id}</Table.Cell><Table.Cell>{row.customer}</Table.Cell><Table.Cell><Label variant="success">{row.status}</Label></Table.Cell></Table.Row>)}</Table.Body>
        </Table></Table.Container></div>
      ))}
    </div>
  )
}

function AccordionItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const { getDetailsProps, open } = useDetails({ defaultOpen })
  return (
    <Details {...getDetailsProps()} className="faq-item">
      <Details.Summary className="faq-summary"><span>{q}</span><Icon name={open ? "chevron-up" : "chevron-down"} /></Details.Summary>
      <Text as="p" className="muted faq-answer">{a}</Text>
    </Details>
  )
}

function Demo({ name }: { name: string }) {
  const [multiSelected, setMultiSelected] = useState<{ text: string; id: string }[]>([])
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tokens, setTokens] = useState([{ id: "primer", text: "Primer" }, { id: "react", text: "React" }])
  const returnFocusRef = useRef<HTMLButtonElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const { mode, setMode } = useColorMode()

  if (name === "Typography") {
    return <Stack gap="normal"><Heading as="h3">标题文字</Heading><Text>正文、辅助说明和链接组成基础排版层级。</Text><Text className="muted">muted text · secondary information</Text></Stack>
  }
  if (name === "Button") {
    return <Stack direction="horizontal" gap="condensed" wrap="wrap">{buttonVariants.flatMap((variant) => buttonSizes.map((size) => <Button key={`${variant}-${size}`} variant={variant} size={size} disabled={variant === "danger"} leadingVisual={variant === "primary" ? iconFor("plus") : undefined} trailingVisual={variant === "link" ? iconFor("arrow-right") : undefined} count={variant === "default" ? 4 : undefined}>{variant} · {size}</Button>))}<Button loading>loading</Button></Stack>
  }
  if (name === "ButtonGroup") {
    return <ButtonGroup><Button>保存</Button><Button variant="primary">发布</Button><IconButton aria-label="更多操作" icon={iconFor("kebab-horizontal")} /></ButtonGroup>
  }
  if (name === "IconButton") {
    return <Stack direction="horizontal" gap="condensed" wrap="wrap">{buttonVariants.map((variant) => buttonSizes.map((size) => <IconButton key={`${variant}-${size}`} aria-label={`${variant} ${size}`} variant={variant} size={size} icon={iconFor("plus")} disabled={variant === "danger"} />))}</Stack>
  }
  if (name === "Input") {
    return <Stack gap="condensed"><Stack direction="horizontal" gap="condensed" wrap="wrap">{buttonSizes.map((size) => <TextInput key={size} size={size} placeholder={`${size} input`} leadingVisual={iconFor("search")} trailingVisual={iconFor("x")} />)}</Stack><TextInput placeholder="清除操作、成功、等宽、块级" trailingAction={<Button aria-label="清除" variant="invisible" size="small">清除</Button>} validationStatus="error" monospace block /><TextInput placeholder="成功状态" validationStatus="success" disabled /></Stack>
  }
  if (name === "Textarea") return <Stack gap="condensed"><Textarea resize="vertical" placeholder="可调整大小的文本区域" /><Textarea resize="none" disabled placeholder="disabled" validationStatus="error" /></Stack>
  if (name === "NumberInput") return <Stack direction="horizontal" gap="condensed"><TextInput type="number" size="small" defaultValue="1" aria-label="small number" /><TextInput type="number" defaultValue="24" aria-label="medium number" /><TextInput type="number" size="large" defaultValue="128" aria-label="large number" /></Stack>
  if (name === "Autocomplete" || name === "Combobox") {
    const items = name === "Autocomplete" ? ["Dashboard", "Orders", "Settings"] : ["React", "Primer", "TypeScript"]
    return <Autocomplete id={`autocomplete-${name}`}><Autocomplete.Input aria-label={name} placeholder={`搜索 ${name}`} openOnFocus /><Autocomplete.Overlay><Autocomplete.Menu items={items.map((text) => ({ text, id: text }))} selectedItemIds={[]} aria-labelledby={`autocomplete-${name}`} /></Autocomplete.Overlay></Autocomplete>
  }
  if (name === "MultiSelect") {
    const items = ["React", "Primer", "Octicons"].map((text) => ({ text, id: text }))
    return <SelectPanel variant="anchored" open={open} onOpenChange={setOpen} selected={multiSelected} onSelectedChange={((next: unknown) => { if (Array.isArray(next)) setMultiSelected(next as { text: string; id: string }[]) }) as never} items={items} title="选择技术栈" placeholder="选择技术栈" renderAnchor={(anchorProps) => <Button {...anchorProps}>已选择 {multiSelected.length}</Button>} onFilterChange={() => undefined} onCancel={() => setOpen(false)} />
  }
  if (name === "Cascader") return <ActionMenu><ActionMenu.Button>选择分类</ActionMenu.Button><ActionMenu.Overlay><ActionList><ActionList.Item><span className="flex items-center justify-between">设计<Icon name="chevron-right" /></span><ActionList><ActionList.Item>颜色</ActionList.Item><ActionList.Item>布局</ActionList.Item></ActionList></ActionList.Item><ActionList.Item>工程</ActionList.Item></ActionList></ActionMenu.Overlay></ActionMenu>
  if (name === "Transfer") return <Stack direction="horizontal" gap="condensed" align="center"><ActionList><ActionList.Item>可选项目 A</ActionList.Item><ActionList.Item>可选项目 B</ActionList.Item></ActionList><ButtonGroup><IconButton aria-label="移到右侧" icon={iconFor("arrow-right")} /><IconButton aria-label="移到左侧" icon={iconFor("arrow-left")} /></ButtonGroup><ActionList><ActionList.Item>已选项目</ActionList.Item></ActionList></Stack>
  if (name === "Mention") return <TextInputWithTokens aria-label="提及" tokens={tokens} onTokenRemove={(token) => setTokens(tokens.filter((item) => item.id !== token))} onChange={() => undefined} placeholder="输入提及..." />
  if (name === "PinInput") return <Stack direction="horizontal" gap="condensed">{Array.from({ length: 6 }, (_, index) => <TextInput key={index} size="small" maxLength={1} aria-label={`验证码第 ${index + 1} 位`} />)}</Stack>
  if (name === "Select") return <Stack gap="condensed">{buttonSizes.map((size) => <Select key={size} size={size} defaultValue="one" aria-label={`${size} select`}><Select.Option value="one">选项一</Select.Option><Select.Option value="two">选项二</Select.Option></Select>)}<Select disabled validationStatus="error" aria-label="disabled select"><Select.Option value="one">禁用且错误</Select.Option></Select></Stack>
  if (name === "Checkbox") return <CheckboxGroup><CheckboxGroup.Label>复选框状态</CheckboxGroup.Label><FormControl><Checkbox defaultChecked /><FormControl.Label>已选中</FormControl.Label></FormControl><FormControl><Checkbox indeterminate /><FormControl.Label>不确定</FormControl.Label></FormControl><FormControl disabled><Checkbox disabled /><FormControl.Label>已禁用</FormControl.Label></FormControl></CheckboxGroup>
  if (name === "Radio") return <RadioGroup name="component-radio"><RadioGroup.Label>单选框状态</RadioGroup.Label><FormControl><Radio value="one" defaultChecked /><FormControl.Label>选项一</FormControl.Label></FormControl><FormControl><Radio value="two" /><FormControl.Label>选项二</FormControl.Label></FormControl><FormControl disabled><Radio value="disabled" disabled /><FormControl.Label>禁用选项</FormControl.Label></FormControl></RadioGroup>
  if (name === "Switch") return <Stack gap="condensed">{(["small", "medium"] as const).map((size) => <div key={size}><ToggleSwitch size={size} defaultChecked={size === "medium"} loading={size === "small"} disabled={size === "small"} statusLabelPosition="end" aria-labelledby={`switch-${size}`} /><span id={`switch-${size}`} hidden>{size} switch</span></div>)}</Stack>
  if (name === "Rating") return <Stack direction="horizontal" gap="condensed">{Array.from({ length: 5 }, (_, index) => <IconButton key={index} size="large" aria-label={`${index + 1} 星`} variant="invisible" className={index < 4 ? "star active" : "star"} icon={iconFor(index < 4 ? "star-fill" : "star")} />)}</Stack>
  if (name === "DatePicker") return <TextInput type="date" aria-label="日期" />
  if (name === "TimePicker") return <TextInput type="time" aria-label="时间" />
  if (name === "DateRangePicker") return <Stack direction="horizontal" gap="condensed"><TextInput type="date" aria-label="开始日期" /><TextInput type="date" aria-label="结束日期" /></Stack>
  if (name === "ColorPicker") return <Stack direction="horizontal" gap="condensed" align="center"><input type="color" aria-label="颜色选择器" /><Text className="muted">Primer 未提供该组件</Text></Stack>
  if (name === "Upload") return <Stack gap="condensed"><Button leadingVisual={iconFor("upload")} onClick={() => uploadInputRef.current?.click()}>上传文件</Button><input ref={uploadInputRef} type="file" hidden aria-label="选择文件" /><ActionList><ActionList.Item><span className="flex items-center gap-2"><Icon name="file" />report.pdf</span></ActionList.Item><ActionList.Item><span className="flex items-center gap-2"><Icon name="file" />avatar.png</span></ActionList.Item></ActionList></Stack>
  if (name === "Form") return <Stack gap="condensed"><FormControl required><FormControl.Label>必填字段</FormControl.Label><TextInput placeholder="输入值" /><FormControl.Caption>Caption 辅助说明</FormControl.Caption><FormControl.Validation variant="error">请输入有效内容</FormControl.Validation></FormControl><FormControl disabled><FormControl.Label>成功字段</FormControl.Label><TextInput defaultValue="已验证" validationStatus="success" disabled /></FormControl></Stack>
  if (name === "Table") return <TableDemo />
  if (name === "DataGrid") return <TableDemo dataGrid />
  if (name === "Descriptions") return <dl className="grid grid-2"><dt className="muted">状态</dt><dd><Label variant="success">已完成</Label></dd><dt className="muted">负责人</dt><dd>林晓</dd><dt className="muted">更新时间</dt><dd>刚刚</dd></dl>
  if (name === "List") return <ActionList selectionVariant="single"><ActionList.GroupHeading as="h3">最近项目</ActionList.GroupHeading><ActionList.Item selected><span className="flex items-center gap-2"><Icon name="repo" />设计系统</span><ActionList.Description>组件与令牌</ActionList.Description></ActionList.Item><ActionList.Item><span className="flex items-center gap-2"><Icon name="repo" />控制台</span><ActionList.Description>管理工作区</ActionList.Description></ActionList.Item><ActionList.Divider /><ActionList.Item>新建项目</ActionList.Item></ActionList>
  if (name === "Card") return <Card as="section" padding="normal"><Card.Heading>Primer Card</Card.Heading><Card.Description>使用实验性 Card 组件呈现内容。</Card.Description><Card.Metadata><Label variant="accent">实验性</Label></Card.Metadata></Card>
  if (name === "Avatar") return <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">{[16, 24, 32, 48].map((size, i) => <Avatar key={size} src={avatarFor(team[i].name)} alt={team[i].name} size={size} />)}<Avatar src={avatarFor(team[4].name)} alt={team[4].name} size={48} square /></Stack>
  if (name === "AvatarGroup") return <Stack direction="horizontal" gap="normal" align="center" wrap="wrap"><AvatarStack size={32}>{team.slice(0, 4).map((m) => <Avatar key={m.email} src={avatarFor(m.name)} alt={m.name} />)}</AvatarStack><AvatarStack alignRight size={32}>{team.slice(2, 6).map((m) => <Avatar key={m.email} src={avatarFor(m.name)} alt={m.name} />)}</AvatarStack></Stack>
  if (name === "Badge") return <Stack direction="horizontal" gap="condensed" align="center"><CounterLabel>12</CounterLabel><CounterLabel variant="primary">24</CounterLabel><CircleBadge size={32}>3</CircleBadge></Stack>
  if (name === "Tag") return <Stack gap="condensed"><Stack direction="horizontal" gap="condensed" wrap="wrap">{labelVariants.map((variant) => <Label key={variant} variant={variant} size={variant === "default" ? "small" : "large"}>{variant}</Label>)}</Stack><LabelGroup><Label variant="accent">LabelGroup</Label><Token as="button" text="Token" onRemove={() => undefined} /><Label variant="danger">IssueLabel</Label><StateLabel status="open">StateLabel</StateLabel><TopicTag>TopicTag</TopicTag><Link href="#component-Tag">BranchName</Link></LabelGroup></Stack>
  if (name === "Statistic") return <Card><Card.Heading>¥128,430</Card.Heading><Card.Description>本月收入</Card.Description><Card.Metadata><Label variant="success">+12.4%</Label></Card.Metadata></Card>
  if (name === "Timeline") return <Timeline><Timeline.Item><Timeline.Badge variant="success"><Icon name="check" /></Timeline.Badge><Timeline.Body><strong>创建项目</strong><Text as="p">今天 09:30 完成</Text></Timeline.Body></Timeline.Item><Timeline.Item><Timeline.Badge variant="attention">2</Timeline.Badge><Timeline.Body><strong>邀请团队</strong><Text as="p">等待确认</Text></Timeline.Body></Timeline.Item><Timeline.Break>更多活动</Timeline.Break></Timeline>
  if (name === "Tree") return <TreeView aria-label="文件树"><TreeView.Item id="src" defaultExpanded><TreeView.LeadingVisual><TreeView.DirectoryIcon /></TreeView.LeadingVisual>src<TreeView.SubTree><TreeView.Item id="app"><TreeView.LeadingVisual><Icon name="file" /></TreeView.LeadingVisual>App.tsx</TreeView.Item><TreeView.Item id="index"><TreeView.LeadingVisual><Icon name="file" /></TreeView.LeadingVisual>index.css</TreeView.Item></TreeView.SubTree></TreeView.Item></TreeView>
  if (missing.has(name)) return <LocalBlankslate name={name} />
  if (name === "Grid") return <div className="grid grid-3" style={{ gap: "var(--base-size-16)" }}><Card>Grid 1</Card><Card>Grid 2</Card><Card>Grid 3</Card></div>
  if (name === "Image") return <figure className="stack-2" style={{ margin: 0 }}><img src={placeholderImage("16 : 9", 320, 180)} alt="图像占位" width={320} height={180} className="demo-image" /><figcaption className="muted">生成的 SVG 占位图（Primer 未提供 Image 组件）</figcaption></figure>
  if (name === "Empty" || name === "Result") return <Blankslate border><Blankslate.Visual><Icon name={name === "Result" ? "check-circle" : "inbox"} size={32} /></Blankslate.Visual><Blankslate.Heading as="h3">{name === "Result" ? "操作成功" : "暂无内容"}</Blankslate.Heading><Blankslate.Description>这里暂时没有可显示的内容。</Blankslate.Description><Blankslate.PrimaryAction>继续操作</Blankslate.PrimaryAction></Blankslate>
  if (name === "Tooltip") return <Stack direction="horizontal" gap="condensed" wrap="wrap">{(["n", "s", "e", "w"] as const).map((direction) => <Tooltip key={direction} direction={direction} text={`方向 ${direction}`}><Button>Tooltip {direction}</Button></Tooltip>)}<Tooltip text="图标标签" type="label"><IconButton aria-label="帮助" icon={iconFor("question")} /></Tooltip></Stack>
  if (name === "Popover") return <div><Button ref={returnFocusRef} onClick={() => setPopoverOpen(!popoverOpen)}>打开 Popover</Button>{popoverOpen ? <Popover open caret="top"><Popover.Content><Text>Popover 内容</Text><Button size="small" onClick={() => setPopoverOpen(false)}>关闭</Button></Popover.Content></Popover> : null}</div>
  if (name === "Segmented") return <Stack gap="condensed"><SegmentedControl size="small"><SegmentedControl.Button selected>概览</SegmentedControl.Button><SegmentedControl.Button>详情</SegmentedControl.Button></SegmentedControl><SegmentedControl fullWidth size="medium"><SegmentedControl.Button selected>全部</SegmentedControl.Button><SegmentedControl.Button>已完成</SegmentedControl.Button><SegmentedControl.IconButton aria-label="筛选" icon={<Icon name="filter" />} /></SegmentedControl></Stack>
  if (name === "Alert") return <Stack gap="condensed">{(["info", "warning", "critical", "success", "upsell"] as const).map((variant) => <Banner key={variant} variant={variant} title={`Banner ${variant}`} description="这是 Primer Banner 消息。" onDismiss={variant === "info" ? () => undefined : undefined} />)}<InlineMessage size="small" variant="critical">InlineMessage critical</InlineMessage><InlineMessage size="medium" variant="success">InlineMessage success</InlineMessage><InlineMessage variant="warning">InlineMessage warning</InlineMessage></Stack>
  if (name === "Toast" || name === "Notification") return <Stack gap="condensed"><Button onClick={() => setToastOpen(true)}>打开 {name}</Button>{toastOpen ? <Banner className="toast" variant="success" title="操作成功" description="通知已显示。" onDismiss={() => setToastOpen(false)} /> : null}</Stack>
  if (name === "Dialog") return <><Button onClick={() => setDialogOpen(true)}>打开 Dialog</Button>{dialogOpen ? <Dialog title="Dialog 标题" subtitle="这是一个 Primer Dialog。" width="medium" footerButtons={[{ content: "取消", onClick: () => setDialogOpen(false) }, { content: "确认", buttonType: "primary", onClick: () => setDialogOpen(false) }]} onClose={() => setDialogOpen(false)}>Dialog 内容</Dialog> : null}</>
  if (name === "Drawer") return <><Button onClick={() => setDrawerOpen(true)}>打开 Drawer</Button>{drawerOpen ? <Dialog title="Drawer" position="right" onClose={() => setDrawerOpen(false)} footerButtons={[{ content: "关闭", onClick: () => setDrawerOpen(false) }]}>右侧抽屉；移动端可作为底部工作表使用。</Dialog> : null}</>
  if (name === "Progress") return <Stack gap="condensed">{(["small", "default", "large"] as const).map((barSize) => <ProgressBar key={barSize} progress={65} barSize={barSize} aria-label={`${barSize} progress`} />)}<ProgressBar progress={65} animated aria-label="animated progress" /></Stack>
  if (name === "Skeleton") return <Stack gap="condensed"><SkeletonBox height={32} width="66%" /><SkeletonText lines={3} /><SkeletonAvatar size={32} /></Stack>
  if (name === "Spinner") return <Stack direction="horizontal" gap="condensed" align="center">{(["small", "medium", "large"] as const).map((size) => <Spinner key={size} size={size} aria-label={`${size} loading`} />)}</Stack>
  if (name === "Popconfirm") return <><Button variant="danger" onClick={() => setConfirmOpen(true)}>删除项目</Button>{confirmOpen ? <ConfirmationDialog title="确认删除项目？" confirmButtonType="danger" confirmButtonContent="删除" cancelButtonContent="取消" onClose={(gesture) => { if (gesture !== "escape") setConfirmOpen(false) }}>此操作不可撤销。</ConfirmationDialog> : null}</>
  if (name === "Menu") return <Stack direction="horizontal" gap="normal"><ActionList><ActionList.GroupHeading as="h3">工作区</ActionList.GroupHeading><ActionList.Item><span className="flex items-center justify-between">项目<Icon name="chevron-right" /></span></ActionList.Item><ActionList.Divider /><ActionList.Item>新建</ActionList.Item></ActionList><ActionList><ActionList.Item><span className="flex items-center gap-2"><Icon name="gear" />设置</span></ActionList.Item></ActionList></Stack>
  if (name === "Dropdown") return <ActionMenu><ActionMenu.Anchor><IconButton aria-label="打开下拉菜单" icon={iconFor("kebab-horizontal")} /></ActionMenu.Anchor><ActionMenu.Overlay><ActionList selectionVariant="single"><ActionList.Item selected>按日期排序</ActionList.Item><ActionList.Item>按名称排序</ActionList.Item></ActionList></ActionMenu.Overlay></ActionMenu>
  if (name === "Breadcrumb") return <Breadcrumbs><Breadcrumbs.Item href="#component-Breadcrumb">首页</Breadcrumbs.Item><Breadcrumbs.Item href="#component-Breadcrumb">设置</Breadcrumbs.Item><Breadcrumbs.Item selected>账户</Breadcrumbs.Item></Breadcrumbs>
  if (name === "Tabs") return <Stack gap="normal"><UnderlineNav aria-label="标签页"><UnderlineNav.Item aria-current="page" leadingVisual={<Icon name="home" />} counter="4">概览</UnderlineNav.Item><UnderlineNav.Item>详情</UnderlineNav.Item></UnderlineNav><SegmentedControl aria-label="面板标签"><SegmentedControl.Button selected>面板一</SegmentedControl.Button><SegmentedControl.Button>面板二</SegmentedControl.Button></SegmentedControl></Stack>
  if (name === "Pagination") return <Pagination pageCount={5} currentPage={2} showPages={false} onPageChange={() => undefined} />
  if (name === "Steps") return <Stack gap="condensed"><Stack direction="horizontal" gap="condensed" align="center"><CircleBadge size={24}>1</CircleBadge><ProgressBar progress={100} aria-label="步骤一" /><CircleBadge size={24}>2</CircleBadge><ProgressBar progress={40} aria-label="步骤二" /><CircleBadge size={24}>3</CircleBadge></Stack><Text className="muted">详情 → 配置 → 完成</Text></Stack>
  if (name === "Anchor") return <NavList aria-label="页内锚点">{(contract.components as string[]).slice(0, 4).map((item, i) => <NavList.Item key={item} href={`#component-${item}`} aria-current={i === 0 ? "location" : undefined}>{item}</NavList.Item>)}</NavList>
  if (name === "BackTop") return <IconButton size="large" aria-label="返回顶部" icon={iconFor("arrow-up")} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
  if (name === "Navbar") return <Header><Header.Item><Header.Link href="#component-Navbar">Acme Console</Header.Link></Header.Item><Header.Item full><Header.Link href="#component-Navbar">导航链接</Header.Link></Header.Item><Header.Item><Button size="small">操作</Button></Header.Item></Header>
  if (name === "Sidebar") return <div className="card"><ActionList><ActionList.GroupHeading as="h3">侧边栏</ActionList.GroupHeading><ActionList.Item selected>仪表盘</ActionList.Item><ActionList.Item>订单</ActionList.Item></ActionList></div>
  if (name === "CommandPalette") return <SelectPanel variant="modal" open={open} onOpenChange={(next) => setOpen(next)} selected={multiSelected[0]} onSelectedChange={((item: unknown) => { if (item && !Array.isArray(item)) setMultiSelected([item as { text: string; id: string }]) }) as never} items={["打开仪表盘", "新建订单", "打开设置"].map((text) => ({ text, id: text }))} title="命令面板" placeholder="搜索命令..." onFilterChange={() => undefined} renderAnchor={(anchorProps) => <Button {...anchorProps} leadingVisual={iconFor("search")}>搜索命令</Button>} onCancel={() => setOpen(false)} />
  if (name === "Stack") return <Stack direction="horizontal" gap="normal" align="center" wrap="wrap"><Card>横向 Stack</Card><Card>自动换行</Card><Card>间距 normal</Card></Stack>
  if (name === "Layout") return <div className="card" style={{ height: 120 }}><Stack direction="horizontal" gap="normal"><div style={{ width: 100 }}>Pane</div><div>Content</div></Stack></div>
  if (name === "Container") return <div className="card"><Text>PageLayout containerWidth="large" 的容器示例。</Text></div>
  if (name === "Resizable") return <div className="card" style={{ height: 120, display: "flex" }}><div style={{ width: "35%", resize: "horizontal", overflow: "auto", borderRight: "1px solid var(--borderColor-default)" }}>可调整 Pane</div><div style={{ padding: 12 }}>Content</div></div>
  if (name === "ScrollArea") return <ScrollableRegion className="scroll-demo" aria-label="可滚动的订单列表"><ActionList>{orders.slice(0, 12).map((o) => <ActionList.Item key={o.id}><span className="mono">{o.id}</span><ActionList.Description>{o.customer} · ¥{o.amount.toLocaleString()}</ActionList.Description></ActionList.Item>)}</ActionList></ScrollableRegion>
  if (name === "Accordion") return <div className="accordion">{landing.faq.slice(0, 3).map((item, i) => <AccordionItem key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />)}</div>
  if (name === "ThemeProvider") return <Button onClick={() => setMode(mode === "dark" ? "light" : "dark")}>切换主题（当前 {mode}）</Button>
  if (name === "FloatButton") return <Stack direction="horizontal" gap="condensed" align="center"><IconButton className="float-button" aria-label="创建项目" variant="primary" size="large" icon={iconFor("plus")} /><Text className="muted">固定在视口右下角（移动端内缩）</Text></Stack>
  if (name === "Kbd") return <Stack direction="horizontal" gap="condensed"><KeybindingHint keys="Mod+K" /><KeybindingHint keys="Shift+P" /></Stack>
  if (name === "Code") return <Stack gap="condensed"><Text as="code">const ui = "primer"</Text><Text as="code">git checkout main</Text></Stack>
  if (name === "Divider") return <Stack gap="condensed"><ActionList.Divider /><hr /><Text className="muted">PageLayout divider</Text></Stack>
  if (name === "Link") return <Stack direction="horizontal" gap="normal" wrap="wrap"><Link href="#component-Link">默认链接</Link><Link href="#component-Link" muted>muted 链接</Link><LinkButton href="#component-Link">LinkButton</LinkButton></Stack>
  return <LocalBlankslate name={name} />
}

export function ComponentsPage() {
  const components = contract.components as string[]
  return (
    <div className="page-stack">
      <PageHeader title="组件全集" description="官方 registry 组件、contract 覆盖与组合示例。" action={<Button as="a" href="#component-index">组件索引</Button>} />
      <nav id="component-index" className="flex wrap gap-2 anchor-index" aria-label="组件索引">{components.map((name) => <a href={`#component-${name}`} key={name} className="anchor-chip">{name}</a>)}</nav>
      <div className="grid grid-3 components-grid">{components.map((name) => <section className="card component-card" id={`component-${name}`} key={name}><div className="flex items-center justify-between gap-2"><Heading as="h2" className="card-title">{name}</Heading><Label variant={coverage[name] === "missing" ? "danger" : coverage[name] === "composed" ? "attention" : "success"}>{coverage[name]}</Label></div><Text as="p" className="muted">default · variants · sizes · states</Text><div style={{ marginTop: 16 }}><Demo name={name} /></div></section>)}</div>
    </div>
  )
}
