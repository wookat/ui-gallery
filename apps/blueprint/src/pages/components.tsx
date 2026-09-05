import { zhCN } from "date-fns/locale"
import { useState, type ReactNode } from "react"
import { Alert, AnchorButton, Blockquote, Breadcrumbs, Button, ButtonGroup, Callout, Card, CardList, Checkbox, Classes, Code, Collapse, ControlGroup, Dialog, DialogBody, DialogFooter, DialogStep, Divider, Drawer, EditableText, EntityTitle, FileInput, FormGroup, H1, H2, H3, H4, H5, H6, HTMLSelect, HTMLTable, Icon, InputGroup, KeyComboTag, Menu, MenuDivider, MenuItem, MultistepDialog, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, NonIdealState, NumericInput, OL, Popover, Pre, ProgressBar, Radio, RadioGroup, RangeSlider, SegmentedControl, Slider, Spinner, Switch, Tab, Tabs, Tag, TagInput, Text, TextArea, Tooltip, Tree, UL, type TreeNodeInfo } from "@blueprintjs/core"
import { DateInput, DatePicker, DateRangeInput, DateRangePicker, TimePicker, type DateRange } from "@blueprintjs/datetime"
import { MultiSelect, Omnibar, Select, Suggest } from "@blueprintjs/select"
import { Cell, Column, Table2 } from "@blueprintjs/table"
import orders from "@ui-gallery/spec/mock/orders.json"
import team from "@ui-gallery/spec/mock/team.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import nav from "@ui-gallery/spec/mock/nav.json"
import { coverage, type CoverageStatus } from "@/coverage"
import { icon } from "@/lib/icons"
import { useContainerWidth } from "@/lib/layout"
import { toast } from "@/lib/toaster"
import { Avatar, PageHeader, StatusTag, money } from "@/pages/shared"

const INTENTS = ["none", "primary", "success", "warning", "danger"] as const
const FRUITS = ["Apple", "Banana", "Cherry", "Grape", "Mango", "Orange"]
const fmt = (d: Date) => d.toISOString().slice(0, 10)
const parse = (s: string) => { const d = new Date(s); return Number.isNaN(d.getTime()) ? false : d }
const STATUS_INTENT: Record<CoverageStatus, "success" | "primary" | "danger"> = { implemented: "success", composed: "primary", missing: "danger" }
const STATUS_LABEL: Record<CoverageStatus, string> = { implemented: "原生", composed: "组合", missing: "缺失" }

function Demo({ name, children, note }: { name: string; children?: ReactNode; note?: string }) {
  const status = coverage[name]
  return (
    <Card id={name} className="demo-block demo-section">
      <div className="row-between"><H5 style={{ margin: 0 }}>{name}</H5><Tag minimal round intent={STATUS_INTENT[status]}>{STATUS_LABEL[status]}</Tag></div>
      {note ? <div className={`${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL}`}>{note}</div> : null}
      {children ?? <NonIdealState icon={icon("alert-circle", 28)} title="Blueprint 无此组件" description="未使用第三方替代实现，标记为 missing。" layout="horizontal" />}
    </Card>
  )
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return <section className="stack"><H3 style={{ margin: "8px 0 0" }}>{title}</H3><div className="demo-grid">{children}</div></section>
}

function itemRenderer(selected: string[] | string | null) {
  return (item: string, { handleClick, modifiers }: { handleClick: React.MouseEventHandler<HTMLElement>; modifiers: { active: boolean } }) => <MenuItem key={item} text={item} onClick={handleClick} active={modifiers.active} selected={Array.isArray(selected) ? selected.includes(item) : selected === item} roleStructure="listoption" shouldDismissPopover={!Array.isArray(selected)} />
}

function Inputs() {
  const [sel, setSel] = useState<string | null>("Apple")
  const [multi, setMulti] = useState<string[]>(["Apple"])
  const [suggest, setSuggest] = useState<string | null>(null)
  const [omni, setOmni] = useState(false)
  const [slider, setSlider] = useState(40)
  const [range, setRange] = useState<[number, number]>([20, 60])
  const [rating, setRating] = useState(3)
  const [date, setDate] = useState<string | null>("2026-09-05")
  const [dateRange, setDateRange] = useState<DateRange>([new Date(2026, 8, 1), new Date(2026, 8, 7)])
  const [color, setColor] = useState("#2d72d2")
  const [pin, setPin] = useState(["1", "2", "", "", "", ""])
  const [left, setLeft] = useState(FRUITS.slice(0, 3))
  const [right, setRight] = useState(FRUITS.slice(3))
  return (
    <Group title="表单输入">
      <Demo name="Input">
        <InputGroup placeholder="默认" />
        <InputGroup placeholder="前置图标 + 后置按钮" leftIcon={icon("search")} rightElement={<Button minimal icon={icon("x")} />} />
        <InputGroup small placeholder="small" /><InputGroup large placeholder="large" />
        <InputGroup intent="danger" placeholder="错误状态" defaultValue="invalid" /><InputGroup intent="success" placeholder="成功状态" />
        <InputGroup disabled placeholder="禁用" /><InputGroup readOnly value="只读" /><InputGroup round placeholder="round" />
        <EditableText placeholder="EditableText：点击编辑" defaultValue="可内联编辑的文本" />
      </Demo>
      <Demo name="Textarea">
        <TextArea fill placeholder="默认" rows={2} /><TextArea fill autoResize placeholder="autoResize" /><TextArea fill intent="danger" defaultValue="错误状态" rows={2} /><TextArea fill disabled placeholder="禁用" rows={2} />
      </Demo>
      <Demo name="NumberInput">
        <NumericInput placeholder="默认" /><NumericInput leftIcon={icon("tag")} buttonPosition="left" defaultValue={10} /><NumericInput min={0} max={100} stepSize={5} majorStepSize={20} defaultValue={50} large /><NumericInput disabled placeholder="禁用" /><NumericInput intent="danger" defaultValue={-1} />
      </Demo>
      <Demo name="Select" note="HTMLSelect（原生）与 @blueprintjs/select 的 Select">
        <HTMLSelect options={FRUITS} /><HTMLSelect large options={FRUITS} /><HTMLSelect minimal options={FRUITS} /><HTMLSelect disabled options={FRUITS} />
        <Select<string> items={FRUITS} itemRenderer={itemRenderer(sel)} onItemSelect={setSel} filterable={false} popoverProps={{ minimal: true }}><Button text={sel ?? "选择水果"} rightIcon={icon("chevron-down")} /></Select>
      </Demo>
      <Demo name="MultiSelect">
        <MultiSelect<string> items={FRUITS} selectedItems={multi} itemRenderer={itemRenderer(multi)} tagRenderer={(i) => i} onItemSelect={(i) => setMulti((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]))} onRemove={(i) => setMulti((m) => m.filter((x) => x !== i))} placeholder="选择多个…" noResults={<MenuItem disabled text="无结果" />} popoverProps={{ minimal: true }} onClear={() => setMulti([])} />
        <MultiSelect<string> items={FRUITS} selectedItems={["Apple"]} itemRenderer={itemRenderer([])} tagRenderer={(i) => i} onItemSelect={() => undefined} disabled placeholder="禁用" />
      </Demo>
      <Demo name="Combobox" note="Suggest：可输入过滤的下拉选择">
        <Suggest<string> items={FRUITS} selectedItem={suggest} inputValueRenderer={(i) => i} itemPredicate={(q, i) => i.toLowerCase().includes(q.toLowerCase())} itemRenderer={itemRenderer(suggest)} onItemSelect={setSuggest} noResults={<MenuItem disabled text="无结果" />} popoverProps={{ minimal: true }} inputProps={{ placeholder: "输入过滤…" }} />
      </Demo>
      <Demo name="Autocomplete" note="Suggest（createNewItem）+ Omnibar">
        <Suggest<string> items={FRUITS} inputValueRenderer={(i) => i} itemPredicate={(q, i) => i.toLowerCase().includes(q.toLowerCase())} itemRenderer={itemRenderer(null)} onItemSelect={() => undefined} createNewItemFromQuery={(q) => q} createNewItemRenderer={(q, active, onClick) => <MenuItem icon={icon("plus")} text={`创建「${q}」`} active={active} onClick={onClick} shouldDismissPopover={false} />} noResults={<MenuItem disabled text="无结果" />} popoverProps={{ minimal: true }} inputProps={{ placeholder: "自动补全…", leftIcon: icon("search") }} />
        <Button icon={icon("search")} onClick={() => setOmni(true)}>打开 Omnibar</Button>
        <Omnibar<string> isOpen={omni} onClose={() => setOmni(false)} items={FRUITS} itemPredicate={(q, i) => i.toLowerCase().includes(q.toLowerCase())} itemRenderer={itemRenderer(null)} onItemSelect={() => setOmni(false)} noResults={<MenuItem disabled text="无结果" />} inputProps={{ placeholder: "搜索…" }} />
      </Demo>
      <Demo name="Checkbox">
        <Checkbox label="默认" /><Checkbox label="已选" defaultChecked /><Checkbox label="半选" indeterminate /><Checkbox label="禁用" disabled /><Checkbox label="禁用已选" disabled checked /><Checkbox label="large" large defaultChecked /><Checkbox label="inline 1" inline /><Checkbox label="inline 2" inline />
      </Demo>
      <Demo name="Radio">
        <RadioGroup label="尺寸" selectedValue="m" onChange={() => undefined}><Radio label="S" value="s" /><Radio label="M" value="m" /><Radio label="L" value="l" /><Radio label="禁用" value="x" disabled /></RadioGroup>
        <RadioGroup inline selectedValue="a" onChange={() => undefined} label="inline"><Radio label="A" value="a" /><Radio label="B" value="b" /></RadioGroup>
      </Demo>
      <Demo name="Switch">
        <Switch label="默认" /><Switch label="开启" defaultChecked /><Switch label="禁用" disabled /><Switch label="large" large defaultChecked /><Switch label="右对齐" alignIndicator="right" /><Switch innerLabel="off" innerLabelChecked="on" defaultChecked label="innerLabel" />
      </Demo>
      <Demo name="Slider">
        <Slider min={0} max={100} value={slider} onChange={setSlider} labelStepSize={25} />
        <Slider min={0} max={10} stepSize={0.5} value={2.5} onChange={() => undefined} labelStepSize={2.5} intent="success" />
        <Slider min={0} max={100} value={30} onChange={() => undefined} disabled labelStepSize={25} />
        <RangeSlider min={0} max={100} value={range} onChange={setRange} labelStepSize={25} />
      </Demo>
      <Demo name="Rating" note="由 Button + star/star-empty 图标组合">
        <span className="row" style={{ gap: 0 }}>{[1, 2, 3, 4, 5].map((n) => <Button key={n} minimal onClick={() => setRating(n)} icon={<Icon icon={n <= rating ? "star" : "star-empty"} intent={n <= rating ? "warning" : "none"} size={20} />} aria-label={`${n} 星`} />)}</span>
        <span className="row" style={{ gap: 0 }}>{[1, 2, 3, 4, 5].map((n) => <Icon key={n} icon={n <= 4 ? "star" : "star-empty"} className={Classes.TEXT_MUTED} />)}<span className={Classes.TEXT_MUTED} style={{ marginLeft: 6 }}>只读 4/5</span></span>
      </Demo>
      <Demo name="DatePicker">
        <DateInput locale={zhCN} value={date} onChange={setDate} formatDate={fmt} parseDate={parse} placeholder="YYYY-MM-DD" popoverProps={{ minimal: true }} showActionsBar />
        <DateInput locale={zhCN} value={null} onChange={() => undefined} formatDate={fmt} parseDate={parse} disabled placeholder="禁用" />
        <DateInput locale={zhCN} value={date} onChange={setDate} formatDate={fmt} parseDate={parse} timePrecision="minute" placeholder="含时间" popoverProps={{ minimal: true }} />
      </Demo>
      <Demo name="TimePicker">
        <TimePicker defaultValue={new Date(2026, 8, 5, 9, 30)} showArrowButtons /><TimePicker defaultValue={new Date(2026, 8, 5, 9, 30)} precision="second" useAmPm /><TimePicker disabled defaultValue={new Date(2026, 8, 5, 9, 30)} />
      </Demo>
      <Demo name="DateRangePicker">
        <DateRangeInput locale={zhCN} value={dateRange} onChange={setDateRange} formatDate={fmt} parseDate={parse} allowSingleDayRange shortcuts={false} popoverProps={{ minimal: true }} />
        <DateRangeInput locale={zhCN} value={[null, null]} onChange={() => undefined} formatDate={fmt} parseDate={parse} disabled />
      </Demo>
      <Demo name="ColorPicker" note="原生 color input + InputGroup 组合">
        <ControlGroup><input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="颜色" style={{ width: 40, height: 30, border: "none", background: "transparent", padding: 0 }} /><InputGroup value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 120 }} /></ControlGroup>
        <div className="row">{["#2d72d2", "#238551", "#c87619", "#cd4246", "#7961db"].map((c) => <Button key={c} onClick={() => setColor(c)} active={color === c} icon={<span style={{ width: 14, height: 14, background: c, borderRadius: 3, display: "inline-block" }} />} />)}</div>
      </Demo>
      <Demo name="Upload">
        <FileInput text="选择文件…" buttonText="浏览" /><FileInput text="已选：report.pdf" hasSelection fill /><FileInput text="禁用" disabled /><FileInput text="large" large />
        <Card className="dropzone stack-sm placeholder" style={{ alignItems: "center", padding: 20 }}><Icon icon="cloud-upload" size={24} />拖拽文件到此处</Card>
      </Demo>
      <Demo name="Cascader" note="MenuItem 嵌套子菜单组合">
        <Popover placement="bottom-start" content={<Menu><MenuItem text="华东"><MenuItem text="上海"><MenuItem text="浦东" /><MenuItem text="徐汇" /></MenuItem><MenuItem text="杭州" /></MenuItem><MenuItem text="华北"><MenuItem text="北京" /><MenuItem text="天津" /></MenuItem></Menu>}><Button rightIcon={icon("chevron-down")}>选择地区</Button></Popover>
      </Demo>
      <Demo name="Transfer" note="两个 CardList + ButtonGroup 组合">
        <div className="row" style={{ flexWrap: "nowrap", alignItems: "stretch" }}>
          <CardList compact style={{ flex: 1 }}>{left.map((i) => <Card key={i} interactive onClick={() => { setLeft((l) => l.filter((x) => x !== i)); setRight((r) => [...r, i]) }}>{i} <Icon icon="arrow-right" className={Classes.TEXT_MUTED} style={{ marginLeft: "auto" }} /></Card>)}</CardList>
          <CardList compact style={{ flex: 1 }}>{right.map((i) => <Card key={i} interactive onClick={() => { setRight((r) => r.filter((x) => x !== i)); setLeft((l) => [...l, i]) }}><Icon icon="arrow-left" className={Classes.TEXT_MUTED} style={{ marginRight: 8 }} />{i}</Card>)}</CardList>
        </div>
      </Demo>
      <Demo name="Mention" />
      <Demo name="PinInput" note="6 个 InputGroup 组合">
        <div className="row" style={{ flexWrap: "nowrap" }}>{pin.map((v, i) => <InputGroup key={i} value={v} maxLength={1} onChange={(e) => setPin((p) => p.map((x, j) => (j === i ? e.target.value.slice(-1) : x)))} inputClassName="text-center" style={{ width: 40, textAlign: "center" }} aria-label={`第 ${i + 1} 位`} />)}</div>
      </Demo>
      <Demo name="Form">
        <FormGroup label="用户名" labelInfo="(必填)" helperText="4–16 个字符" labelFor="f1"><InputGroup id="f1" placeholder="username" /></FormGroup>
        <FormGroup label="邮箱" intent="danger" helperText="邮箱格式不正确" labelFor="f2"><InputGroup id="f2" intent="danger" defaultValue="foo@" /></FormGroup>
        <FormGroup label="禁用" disabled labelFor="f3"><InputGroup id="f3" disabled /></FormGroup>
        <FormGroup inline label="inline"><Switch /></FormGroup>
        <ControlGroup fill><HTMLSelect options={["https://", "http://"]} /><InputGroup placeholder="ControlGroup" /><Button icon={icon("arrow-right")} /></ControlGroup>
      </Demo>
    </Group>
  )
}

const GRID_RATIOS = [0.28, 0.24, 0.26, 0.22]
const GRID_ROW_HEADER = 30

function DataGridDemo() {
  const { ref, width } = useContainerWidth<HTMLDivElement>()
  const inner = Math.max(width - GRID_ROW_HEADER - 2, 4 * 60)
  const columnWidths = GRID_RATIOS.map((r) => Math.floor(inner * r))
  return (
    <div ref={ref} style={{ height: 200, overflow: "hidden" }}>
      {width > 0 ? (
        <Table2 key={width} numRows={orders.length} enableColumnResizing enableRowHeader columnWidths={columnWidths}>
          <Column name="订单" cellRenderer={(r) => <Cell>{orders[r].id}</Cell>} />
          <Column name="客户" cellRenderer={(r) => <Cell>{orders[r].customer}</Cell>} />
          <Column name="产品" cellRenderer={(r) => <Cell>{orders[r].product}</Cell>} />
          <Column name="金额" cellRenderer={(r) => <Cell style={{ textAlign: "right" }}>{money(orders[r].amount)}</Cell>} />
        </Table2>
      ) : null}
    </div>
  )
}

function DataDisplay() {
  const [nodes, setNodes] = useState<TreeNodeInfo[]>([
    { id: 1, hasCaret: true, isExpanded: true, icon: "folder-open", label: "src", childNodes: [{ id: 2, icon: "document", label: "main.tsx" }, { id: 3, icon: "document", label: "App.tsx", isSelected: true }, { id: 4, hasCaret: true, icon: "folder-close", label: "pages", childNodes: [{ id: 5, icon: "document", label: "login.tsx" }] }] },
    { id: 6, icon: "document", label: "package.json", secondaryLabel: <Tag minimal>json</Tag> },
    { id: 7, icon: "lock", label: "受限", disabled: true },
  ])
  const toggle = (node: TreeNodeInfo, expanded: boolean) => setNodes((prev) => { const walk = (list: TreeNodeInfo[]): TreeNodeInfo[] => list.map((n) => (n.id === node.id ? { ...n, isExpanded: expanded } : { ...n, childNodes: n.childNodes ? walk(n.childNodes) : undefined })); return walk(prev) })
  const [slide, setSlide] = useState(0)
  const [imgFailed, setImgFailed] = useState(false)
  return (
    <Group title="数据展示">
      <Demo name="Table">
        <div className="scroll-x"><HTMLTable striped interactive bordered compact className="fill"><thead><tr><th>订单</th><th>客户</th><th>状态</th><th className="text-right">金额</th></tr></thead><tbody>{orders.slice(0, 4).map((o) => <tr key={o.id}><td>{o.id}</td><td>{o.customer}</td><td><StatusTag value={o.status} /></td><td className="text-right">{money(o.amount)}</td></tr>)}</tbody></HTMLTable></div>
      </Demo>
      <Demo name="DataGrid" note="@blueprintjs/table Table2：虚拟滚动、列宽拖拽、区域选择（列宽按容器自适应）">
        <DataGridDemo />
      </Demo>
      <Demo name="Descriptions" note="HTMLTable 组合">
        <HTMLTable compact className="fill"><tbody>{[["客户", orders[0].customer], ["邮箱", orders[0].email], ["产品", orders[0].product], ["金额", money(orders[0].amount)]].map(([k, v]) => <tr key={k}><td className={Classes.TEXT_MUTED} style={{ width: 90 }}>{k}</td><td>{v}</td></tr>)}</tbody></HTMLTable>
      </Demo>
      <Demo name="List">
        <CardList compact bordered>{team.slice(0, 3).map((m) => <Card key={m.email} interactive className="row-between"><span className="row"><Avatar name={m.name} size="sm" />{m.name}</span><Tag minimal>{m.role}</Tag></Card>)}</CardList>
        <UL><li>无序列表项</li><li>无序列表项</li></UL><OL><li>有序列表项</li><li>有序列表项</li></OL>
      </Demo>
      <Demo name="Card">
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>{[0, 1, 2, 3].map((e) => <Card key={e} elevation={e as 0 | 1 | 2 | 3}>elevation {e}</Card>)}</div>
        <Card interactive onClick={() => undefined}>interactive（hover 提升）</Card><Card compact>compact</Card><Card selected>selected</Card>
      </Demo>
      <Demo name="Avatar" note="span + Blueprint 主色组合"><div className="row"><Avatar name="林晓" size="sm" /><Avatar name="王子涵" /><Avatar name="Alex" size="lg" /><span className="avatar" style={{ background: "#238551" }}>{icon("user")}</span></div></Demo>
      <Demo name="AvatarGroup" note="重叠 Avatar 组合"><span className="avatar-group">{team.slice(0, 4).map((m) => <Avatar key={m.email} name={m.name} />)}<span className="avatar" style={{ background: "#5f6b7c" }}>+{team.length - 4}</span></span></Demo>
      <Demo name="Badge" note="Tag round 组合到按钮/图标上">
        <div className="row"><Button icon={icon("bell")} minimal style={{ position: "relative" }}><Tag round intent="danger" style={{ position: "absolute", top: -4, right: -4, minHeight: 16, fontSize: 10 }}>3</Tag></Button><Tag round intent="primary">12</Tag><Tag round minimal intent="success">新</Tag><span className="row" style={{ gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: "#238551", display: "inline-block" }} />在线</span></div>
      </Demo>
      <Demo name="Tag">
        <div className="row">{INTENTS.map((i) => <Tag key={i} intent={i}>{i}</Tag>)}</div>
        <div className="row">{INTENTS.map((i) => <Tag key={i} intent={i} minimal>{i}</Tag>)}</div>
        <div className="row"><Tag round>round</Tag><Tag large>large</Tag><Tag icon={icon("tag", 12)} rightIcon={icon("chevron-down", 12)}>icons</Tag><Tag interactive>interactive</Tag><Tag onRemove={() => undefined}>removable</Tag><Tag fill>fill</Tag></div>
        <TagInput values={["Blueprint", "React"]} onChange={() => undefined} placeholder="TagInput…" tagProps={{ minimal: true }} />
      </Demo>
      <Demo name="Statistic" note="Text + Tag 组合"><div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>{stats.slice(0, 2).map((s) => <div key={s.key}><div className={Classes.TEXT_MUTED}>{s.label}</div><div style={{ fontSize: 24, fontWeight: 600 }}>{s.unit === "CNY" ? money(s.value) : s.value}</div><Tag minimal intent={s.delta >= 0 ? "success" : "danger"} icon={icon(s.delta >= 0 ? "arrow-up" : "arrow-down", 12)}>{s.delta}%</Tag></div>)}</div></Demo>
      <Demo name="Timeline" note="列表 + CSS 组合"><ul className="timeline">{activity.slice(0, 3).map((a, i) => <li key={i}><strong>{a.user}</strong> {a.action}<div className={`${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL}`}>{a.time}</div></li>)}</ul></Demo>
      <Demo name="Tree"><Tree contents={nodes} onNodeExpand={(n) => toggle(n, true)} onNodeCollapse={(n) => toggle(n, false)} /></Demo>
      <Demo name="Calendar" note="DatePicker / DateRangePicker 内联"><div className="scroll-x"><DatePicker locale={zhCN} defaultValue={new Date(2026, 8, 5)} highlightCurrentDay /></div><div className="scroll-x"><DateRangePicker locale={zhCN} defaultValue={[new Date(2026, 8, 1), new Date(2026, 8, 7)]} singleMonthOnly shortcuts={false} /></div></Demo>
      <Demo name="Image" note="img + Skeleton/NonIdealState 回退组合">
        <div className="row"><div className={Classes.SKELETON} style={{ width: 96, height: 72 }} /><div className="placeholder" style={{ width: 96, height: 72 }}>{icon("grid")}</div>{imgFailed ? <div className="placeholder" style={{ width: 96, height: 72 }}><Icon icon="media" /></div> : <img src="/apps/blueprint/missing.png" alt="加载失败示例" width={96} height={72} onError={() => setImgFailed(true)} />}</div>
      </Demo>
      <Demo name="Carousel" note="Card + ButtonGroup 组合">
        <Card className="placeholder" style={{ height: 120 }}>幻灯片 {slide + 1} / 3</Card>
        <div className="row-between"><ButtonGroup><Button icon={icon("chevron-left")} onClick={() => setSlide((s) => (s + 2) % 3)} /><Button icon={icon("chevron-right")} onClick={() => setSlide((s) => (s + 1) % 3)} /></ButtonGroup><span className="row" style={{ gap: 4 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 8, height: 8, borderRadius: 4, background: i === slide ? "#2d72d2" : "rgba(95,107,124,0.4)" }} />)}</span></div>
      </Demo>
      <Demo name="Empty"><NonIdealState icon={icon("inbox", 40)} title="暂无数据" description="尝试调整筛选条件。" action={<Button intent="primary" icon={icon("plus")}>新建</Button>} layout="vertical" /></Demo>
      <Demo name="QRCode" />
      <Demo name="Typography">
        <H1 style={{ margin: 0 }}>H1</H1><H2 style={{ margin: 0 }}>H2</H2><H3 style={{ margin: 0 }}>H3</H3><H4 style={{ margin: 0 }}>H4</H4><H5 style={{ margin: 0 }}>H5</H5><H6 style={{ margin: 0 }}>H6</H6>
        <Text className={Classes.RUNNING_TEXT}>Running text 正文段落。</Text><Text className={Classes.TEXT_LARGE}>Large text</Text><Text className={Classes.TEXT_SMALL}>Small text</Text><Text className={Classes.TEXT_MUTED}>Muted text</Text><Text className={Classes.TEXT_DISABLED}>Disabled text</Text><Text ellipsize style={{ maxWidth: 200 }}>Ellipsize 很长很长很长很长很长很长的一段文字</Text><Text className={Classes.MONOSPACE_TEXT}>Monospace</Text>
        <Blockquote>Blockquote 引用文本。</Blockquote>
        <EntityTitle title="EntityTitle" subtitle="带副标题与标签" icon={icon("boxes")} tags={<Tag minimal intent="primary">新</Tag>} />
      </Demo>
    </Group>
  )
}

function Feedback() {
  const [dialog, setDialog] = useState<"basic" | "confirm" | "fullscreen" | "scroll" | null>(null)
  const [multistep, setMultistep] = useState(false)
  const [drawer, setDrawer] = useState<"left" | "right" | "top" | "bottom" | null>(null)
  const close = () => setDialog(null)
  const [popconfirm, setPopconfirm] = useState(false)
  return (
    <Group title="反馈与浮层">
      <Demo name="Tooltip"><div className="row">{INTENTS.map((i) => <Tooltip key={i} content={`intent=${i}`} intent={i}><Button minimal>{i}</Button></Tooltip>)}<Tooltip content="compact" compact><Button minimal>compact</Button></Tooltip><Tooltip content="默认打开" isOpen placement="bottom"><Tag>isOpen</Tag></Tooltip></div></Demo>
      <Demo name="Popover"><div className="row"><Popover content={<div style={{ padding: 16 }}><H5>Popover</H5><p>点击外部关闭。</p><Button className={Classes.POPOVER_DISMISS} small>关闭</Button></div>}><Button>click</Button></Popover><Popover interactionKind="hover" content={<div style={{ padding: 12 }}>hover 打开</div>}><Button>hover</Button></Popover><Popover minimal content={<Menu><MenuItem text="minimal" /></Menu>}><Button>minimal</Button></Popover><Popover disabled content={<div />}><Button disabled>disabled</Button></Popover></div></Demo>
      <Demo name="Alert" note="Callout（内联提示）">
        {INTENTS.map((i) => <Callout key={i} intent={i} title={`intent=${i}`}>Callout 内联提示文本。</Callout>)}
        <Callout compact icon={icon("alert-circle")} intent="primary">compact</Callout><Callout minimal intent="warning" title="minimal" />
      </Demo>
      <Demo name="Toast"><div className="row">{INTENTS.map((i) => <Button key={i} intent={i} small onClick={() => void toast(`Toast intent=${i}`, i, { icon: icon("check") })}>{i}</Button>)}<Button small onClick={() => void toast("带操作的 Toast", "primary", { action: { text: "撤销" } })}>action</Button></div></Demo>
      <Demo name="Notification" note="OverlayToaster + 标题/正文组合"><Button icon={icon("bell")} onClick={() => void toast("新订单 ORD-2401 已支付 · 2 分钟前", "none", { icon: icon("bell"), action: { text: "查看" } })}>发送通知</Button></Demo>
      <Demo name="Dialog">
        <div className="row"><Button onClick={() => setDialog("basic")}>普通</Button><Button onClick={() => setDialog("confirm")}>确认（Alert）</Button><Button onClick={() => setDialog("fullscreen")}>全屏</Button><Button onClick={() => setDialog("scroll")}>可滚动</Button><Button onClick={() => setMultistep(true)}>多步</Button></div>
        <Dialog isOpen={dialog === "basic"} onClose={close} title="对话框标题" icon={icon("boxes")}><DialogBody><p>对话框正文内容。</p><FormGroup label="名称"><InputGroup /></FormGroup></DialogBody><DialogFooter actions={<><Button onClick={close}>取消</Button><Button intent="primary" onClick={close}>确定</Button></>} /></Dialog>
        <Alert isOpen={dialog === "confirm"} intent="danger" icon={icon("trash", 40)} cancelButtonText="取消" confirmButtonText="删除" onCancel={close} onConfirm={close} canEscapeKeyCancel canOutsideClickCancel><p>确认删除该项？此操作不可撤销。</p></Alert>
        <Dialog isOpen={dialog === "fullscreen"} onClose={close} title="全屏对话框" icon={icon("grid")} style={{ width: "100vw", height: "100vh", margin: 0, borderRadius: 0, paddingBottom: 0 }}><DialogBody><p>占满整个视口的对话框。</p></DialogBody><DialogFooter actions={<Button intent="primary" onClick={close}>关闭</Button>} /></Dialog>
        <Dialog isOpen={dialog === "scroll"} onClose={close} title="可滚动对话框" icon={icon("clipboard")}><DialogBody useOverflowScrollContainer><div style={{ maxHeight: 240 }}>{orders.slice(0, 12).map((o) => <p key={o.id}>{o.id} · {o.customer} · {o.product} · {money(o.amount)}</p>)}</div></DialogBody><DialogFooter actions={<Button intent="primary" onClick={close}>关闭</Button>} /></Dialog>
        <MultistepDialog isOpen={multistep} onClose={() => setMultistep(false)} title="多步对话框" navigationPosition="top" finalButtonProps={{ text: "完成", onClick: () => setMultistep(false) }}><DialogStep id="a" title="选择" panel={<DialogBody><p>第一步</p></DialogBody>} /><DialogStep id="b" title="配置" panel={<DialogBody><p>第二步</p></DialogBody>} /><DialogStep id="c" title="确认" panel={<DialogBody><p>第三步</p></DialogBody>} /></MultistepDialog>
      </Demo>
      <Demo name="Drawer">
        <div className="row"><Button onClick={() => setDrawer("left")}>左侧</Button><Button onClick={() => setDrawer("right")}>右侧</Button><Button onClick={() => setDrawer("top")}>顶部</Button><Button onClick={() => setDrawer("bottom")}>底部</Button></div>
        <Drawer isOpen={drawer !== null} onClose={() => setDrawer(null)} position={drawer ?? "right"} size={drawer === "bottom" || drawer === "top" ? "40%" : "360px"} title="抽屉" icon={icon("menu")}><div className={Classes.DRAWER_BODY} style={{ padding: 20 }}>抽屉内容</div><div className={Classes.DRAWER_FOOTER}>底部</div></Drawer>
      </Demo>
      <Demo name="Progress">{INTENTS.map((i) => <ProgressBar key={i} intent={i} value={0.2 + INTENTS.indexOf(i) * 0.2} stripes={false} animate={false} />)}<ProgressBar intent="primary" value={0.6} /><ProgressBar intent="primary" /></Demo>
      <Demo name="Skeleton"><div className={Classes.SKELETON} style={{ height: 14, width: "60%" }} /><div className={Classes.SKELETON} style={{ height: 14 }} /><div className={Classes.SKELETON} style={{ height: 80 }} /><Button className={Classes.SKELETON}>按钮骨架</Button></Demo>
      <Demo name="Spinner"><div className="row"><Spinner size={16} /><Spinner size={30} /><Spinner size={50} intent="primary" /><Spinner size={30} intent="success" value={0.6} /><Spinner size={30} intent="danger" value={0.3} /></div></Demo>
      <Demo name="Result" note="NonIdealState"><NonIdealState icon={<Icon icon="tick-circle" intent="success" size={40} />} title="提交成功" description="我们已收到你的申请。" action={<Button intent="primary">返回</Button>} layout="vertical" /></Demo>
      <Demo name="Popconfirm" note="Popover + 确认按钮组合">
        <Popover isOpen={popconfirm} onInteraction={setPopconfirm} content={<div style={{ padding: 16 }} className="stack-sm"><span className="row"><Icon icon="warning-sign" intent="warning" />确定删除此项？</span><div className="row" style={{ justifyContent: "flex-end" }}><Button small onClick={() => setPopconfirm(false)}>取消</Button><Button small intent="danger" onClick={() => { setPopconfirm(false); void toast("已删除", "danger") }}>删除</Button></div></div>}><Button intent="danger" outlined icon={icon("trash")}>删除</Button></Popover>
      </Demo>
    </Group>
  )
}

function NavigationDemos() {
  const [tab, setTab] = useState("a")
  const [page, setPage] = useState(3)
  const [seg, setSeg] = useState("list")
  const [acc, setAcc] = useState<number | null>(0)
  return (
    <Group title="导航">
      <Demo name="Menu" note="垂直 / 内嵌子菜单 / 折叠（仅图标）/ 水平（Navbar + minimal Button 组合）">
        <Menu className={Classes.ELEVATION_1}><MenuDivider title="垂直" /><MenuItem icon={icon("home")} text="首页" /><MenuItem icon={icon("settings")} text="设置" label="⌘," /><MenuItem icon={icon("users")} text="团队（内嵌子菜单）"><MenuItem text="成员" /><MenuItem text="邀请" /></MenuItem><MenuItem icon={icon("lock")} text="禁用" disabled /><MenuItem text="active" active /><MenuItem text="selected" roleStructure="listoption" selected /><MenuDivider /><MenuItem icon={icon("trash")} text="删除" intent="danger" /></Menu>
        <Menu className={Classes.ELEVATION_1} style={{ minWidth: 0, width: 56, padding: 8 }}>{["home", "shopping-cart", "users", "settings"].map((k) => <Tooltip key={k} content={k} placement="right"><MenuItem icon={icon(k)} text="" aria-label={k} active={k === "home"} style={{ justifyContent: "center", minHeight: 40 }} /></Tooltip>)}</Menu>
        <Navbar style={{ boxShadow: "none", border: "1px solid rgba(17,20,24,0.15)" }}><NavbarGroup align="left"><Button minimal active icon={icon("home")}>首页</Button><Button minimal icon={icon("shopping-cart")}>订单</Button><Popover minimal placement="bottom-start" content={<Menu><MenuItem text="成员" /><MenuItem text="邀请" /></Menu>}><Button minimal icon={icon("users")} rightIcon={icon("chevron-down")}>团队</Button></Popover></NavbarGroup></Navbar>
      </Demo>
      <Demo name="Dropdown" note="Popover + Menu 组合"><div className="row"><Popover content={<Menu><MenuItem text="编辑" icon={icon("edit")} /><MenuItem text="复制" icon={icon("copy")} /><MenuDivider /><MenuItem text="删除" icon={icon("trash")} intent="danger" /></Menu>} placement="bottom-start"><Button rightIcon={icon("chevron-down")}>操作</Button></Popover><Popover content={<Menu><MenuItem text="选项" /></Menu>} disabled><Button rightIcon={icon("chevron-down")} disabled>禁用</Button></Popover></div></Demo>
      <Demo name="Breadcrumb"><Breadcrumbs items={[{ icon: icon("home"), text: "首页" }, { text: "订单" }, { text: "ORD-2400", current: true }]} /><Breadcrumbs items={[{ text: "一" }, { text: "二" }, { text: "三" }, { text: "四" }, { text: "当前", current: true }]} collapseFrom="start" minVisibleItems={1} /></Demo>
      <Demo name="Tabs">
        <Tabs id="t1" selectedTabId={tab} onChange={(i) => setTab(String(i))}><Tab id="a" title="标签 A" panel={<p>面板 A</p>} /><Tab id="b" title="标签 B" icon={icon("star")} panel={<p>面板 B</p>} /><Tab id="c" title="禁用" disabled /></Tabs>
        <Tabs id="t2" large defaultSelectedTabId="a"><Tab id="a" title="large" /><Tab id="b" title="tag" tagContent={3} /></Tabs>
        <Tabs id="t3" vertical defaultSelectedTabId="a"><Tab id="a" title="vertical" panel={<p>纵向</p>} /><Tab id="b" title="B" /></Tabs>
      </Demo>
      <Demo name="Pagination" note="ButtonGroup 组合"><ButtonGroup><Button icon={icon("chevron-left")} disabled={page === 1} onClick={() => setPage(page - 1)} />{[1, 2, 3, 4, 5].map((p) => <Button key={p} active={p === page} onClick={() => setPage(p)}>{p}</Button>)}<Button icon={icon("chevron-right")} disabled={page === 5} onClick={() => setPage(page + 1)} /></ButtonGroup><div className="row"><span className={Classes.TEXT_MUTED}>每页</span><HTMLSelect minimal options={["10", "20", "50"]} /></div></Demo>
      <Demo name="Steps" note="Tag + 连线组合（对话框内可用 MultistepDialog）"><div className="stepper">{["基本信息", "详细配置", "确认"].map((s, i) => <div key={s} className="step" style={{ flex: i < 2 ? 1 : "none" }}><Tag round intent={i < 1 ? "success" : i === 1 ? "primary" : "none"} minimal={i > 1} icon={i < 1 ? icon("check", 12) : undefined}>{i < 1 ? "" : i + 1}</Tag><span className={i > 1 ? Classes.TEXT_MUTED : ""}>{s}</span>{i < 2 ? <span className="line" /> : null}</div>)}</div></Demo>
      <Demo name="Anchor" note="AnchorButton + 页内锚点组合（页顶索引即为示例）"><div className="row">{["Button", "Input", "Table", "Dialog"].map((k) => <AnchorButton key={k} minimal small href={`#${k}`} intent="primary">{k}</AnchorButton>)}</div></Demo>
      <Demo name="BackTop" note="固定定位 Button 组合（页面右下角）"><Button icon={icon("arrow-up")} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>回到顶部</Button></Demo>
      <Demo name="Affix" note="position: sticky 组合（本页 Navbar 已固定）"><div style={{ position: "sticky", top: 60 }}><Tag intent="primary">sticky 元素</Tag></div></Demo>
      <Demo name="Navbar"><Navbar><NavbarGroup align="left"><NavbarHeading>Acme</NavbarHeading><NavbarDivider /><Button minimal icon={icon("home")}>首页</Button><Button minimal icon={icon("clipboard")}>文档</Button></NavbarGroup><NavbarGroup align="right"><Button minimal icon={icon("user")} /><Button minimal icon={icon("bell")} /></NavbarGroup></Navbar></Demo>
      <Demo name="Sidebar" note="Menu + MenuDivider 组合（应用左侧栏即为示例）"><Menu large className={Classes.ELEVATION_0} style={{ maxWidth: 240 }}><MenuDivider title="工作区" />{nav.slice(0, 4).map((n) => <MenuItem key={n.key} icon={icon(n.icon)} text={n.label} active={n.key === "dashboard"} labelElement={n.badge ? <Tag round intent="primary">{n.badge}</Tag> : undefined} />)}</Menu></Demo>
      <Demo name="CommandPalette" note="Omnibar（见 Autocomplete 演示按钮）"><div className="row"><InputGroup leftIcon={icon("search")} placeholder="Omnibar 输入样式" rightElement={<KeyComboTag combo="mod+k" minimal />} readOnly /></div></Demo>
      <Demo name="Segmented"><SegmentedControl value={seg} onValueChange={setSeg} options={[{ label: "列表", value: "list" }, { label: "网格", value: "grid" }, { label: "禁用", value: "x", disabled: true }]} /><SegmentedControl small intent="primary" defaultValue="a" options={[{ label: "small", value: "a" }, { label: "primary", value: "b" }]} /><SegmentedControl large fill defaultValue="a" options={[{ label: "large", value: "a" }, { label: "fill", value: "b" }]} /></Demo>
      <Demo name="Accordion" note="Button + Collapse 组合"><CardList bordered>{["第一项", "第二项", "第三项"].map((t, i) => <Card key={t} style={{ padding: 0, display: "block" }}><Button fill minimal alignText="left" rightIcon={icon(acc === i ? "chevron-up" : "chevron-down")} onClick={() => setAcc(acc === i ? null : i)}>{t}</Button><Collapse isOpen={acc === i}><div className={Classes.TEXT_MUTED} style={{ padding: "0 12px 12px" }}>{t}的展开内容。</div></Collapse></Card>)}</CardList></Demo>
    </Group>
  )
}

function Misc() {
  return (
    <Group title="布局与其他">
      <Demo name="Grid" /><Demo name="Stack" /><Demo name="Layout" /><Demo name="Container" /><Demo name="AspectRatio" /><Demo name="Resizable" /><Demo name="ScrollArea" />
      <Demo name="ThemeProvider" note="Classes.DARK（bp6-dark）+ BlueprintProvider"><div className="row"><Card className={Classes.DARK} style={{ background: "#2f343c", color: "#f6f7f9" }}>暗色作用域 <Button intent="primary" small>按钮</Button></Card><Card>亮色作用域 <Button intent="primary" small>按钮</Button></Card></div></Demo>
      <Demo name="Watermark" /><Demo name="Tour" />
      <Demo name="FloatButton" note="fixed 定位 Button 组合（右下角）"><div className="row"><Button large intent="primary" icon={icon("plus")} style={{ borderRadius: 24 }} /><Button large icon={icon("message-circle")} style={{ borderRadius: 24 }} /></div></Demo>
      <Demo name="Kbd"><div className="row"><KeyComboTag combo="mod+k" /><KeyComboTag combo="shift+enter" minimal /><KeyComboTag combo="esc" /></div></Demo>
      <Demo name="Code"><Code>inline code</Code><Pre>{"SELECT * FROM orders\nWHERE status = 'paid';"}</Pre></Demo>
      <Demo name="Divider"><div>上方<Divider />下方</div><ButtonGroup minimal><Button>A</Button><Divider /><Button>B</Button></ButtonGroup></Demo>
      <Demo name="Link"><div className="row"><a href="#Link">普通链接</a><AnchorButton minimal intent="primary" href="#Link" rightIcon={icon("arrow-right")}>AnchorButton</AnchorButton><AnchorButton minimal disabled href="#Link">禁用</AnchorButton></div></Demo>
    </Group>
  )
}

function Buttons() {
  return (
    <Group title="按钮">
      <Demo name="Button">
        <div className="row">{INTENTS.map((i) => <Button key={i} intent={i}>{i}</Button>)}</div>
        <div className="row">{INTENTS.map((i) => <Button key={i} intent={i} minimal>{i}</Button>)}</div>
        <div className="row">{INTENTS.map((i) => <Button key={i} intent={i} outlined>{i}</Button>)}</div>
        <div className="row"><Button small>small</Button><Button>default</Button><Button large>large</Button><Button icon={icon("plus")} rightIcon={icon("chevron-down")}>icons</Button></div>
        <div className="row"><Button disabled>disabled</Button><Button loading intent="primary">loading</Button><Button active>active</Button><Button fill intent="primary">fill</Button></div>
      </Demo>
      <Demo name="ButtonGroup"><ButtonGroup><Button icon={icon("arrow-left")}>上一页</Button><Button>1</Button><Button active>2</Button><Button rightIcon={icon("arrow-right")}>下一页</Button></ButtonGroup><ButtonGroup minimal><Button>minimal</Button><Button>group</Button></ButtonGroup><ButtonGroup vertical outlined><Button>vertical</Button><Button>outlined</Button></ButtonGroup><ButtonGroup fill large><Button intent="primary">fill</Button><Button>large</Button></ButtonGroup></Demo>
      <Demo name="IconButton" note="Button 仅 icon"><div className="row">{INTENTS.map((i) => <Button key={i} intent={i} icon={icon("star")} aria-label={i} />)}<Button minimal icon={icon("settings")} aria-label="minimal" /><Button outlined icon={icon("settings")} aria-label="outlined" /><Button small icon={icon("x")} aria-label="small" /><Button large icon={icon("plus")} aria-label="large" /><Button disabled icon={icon("lock")} aria-label="disabled" /><Button loading icon={icon("refresh")} aria-label="loading" /></div></Demo>
    </Group>
  )
}

export function ComponentsPage() {
  const names = Object.keys(coverage)
  const count = (s: CoverageStatus) => names.filter((n) => coverage[n] === s).length
  return (
    <>
      <PageHeader title="组件全览" description={`Blueprint 6 · ${names.length} 个契约组件：${count("implemented")} 原生 / ${count("composed")} 组合 / ${count("missing")} 缺失`} />
      <Card className="stack-sm" style={{ position: "sticky", top: 58, zIndex: 4 }}>
        <div className="row"><strong>索引</strong>{(["implemented", "composed", "missing"] as CoverageStatus[]).map((s) => <Tag key={s} minimal round intent={STATUS_INTENT[s]}>{STATUS_LABEL[s]} {count(s)}</Tag>)}</div>
        <div className="anchor-index">{names.map((n) => <AnchorButton key={n} minimal href={`#${n}`} intent={coverage[n] === "missing" ? "danger" : "none"}>{n}</AnchorButton>)}</div>
      </Card>
      <Buttons />
      <Inputs />
      <DataDisplay />
      <Feedback />
      <NavigationDemos />
      <Misc />
      <div className="floating"><Tooltip content="回到顶部" placement="left"><Button large icon={icon("arrow-up")} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="回到顶部" /></Tooltip></div>
    </>
  )
}
