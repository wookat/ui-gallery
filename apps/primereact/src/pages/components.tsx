import { useEffect, useRef, useState } from "react"
import contract from "@ui-gallery/spec/contract.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import landing from "@ui-gallery/spec/mock/landing.json"
import nav from "@ui-gallery/spec/mock/nav.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import team from "@ui-gallery/spec/mock/team.json"
import { coverage } from "../coverage"
import { Accordion, AccordionTab } from "primereact/accordion"
import { AutoComplete } from "primereact/autocomplete"
import { Avatar } from "primereact/avatar"
import { AvatarGroup } from "primereact/avatargroup"
import { Badge } from "primereact/badge"
import { BlockUI } from "primereact/blockui"
import { BreadCrumb } from "primereact/breadcrumb"
import { Button } from "primereact/button"
import { ButtonGroup } from "primereact/buttongroup"
import { Calendar } from "primereact/calendar"
import { Card } from "primereact/card"
import { Carousel } from "primereact/carousel"
import { CascadeSelect } from "primereact/cascadeselect"
import { Checkbox } from "primereact/checkbox"
import { Chip } from "primereact/chip"
import { Chips } from "primereact/chips"
import { ColorPicker } from "primereact/colorpicker"
import { Column } from "primereact/column"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"
import { ContextMenu } from "primereact/contextmenu"
import { DataScroller } from "primereact/datascroller"
import { DataTable } from "primereact/datatable"
import { DeferredContent } from "primereact/deferredcontent"
import { Dialog } from "primereact/dialog"
import { Divider } from "primereact/divider"
import { Dock } from "primereact/dock"
import { Dropdown } from "primereact/dropdown"
import { Editor } from "primereact/editor"
import { Fieldset } from "primereact/fieldset"
import { FileUpload } from "primereact/fileupload"
import { FloatLabel } from "primereact/floatlabel"
import { Galleria } from "primereact/galleria"
import { IconField } from "primereact/iconfield"
import { Image } from "primereact/image"
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace"
import { InputIcon } from "primereact/inputicon"
import { InputMask } from "primereact/inputmask"
import { InputNumber } from "primereact/inputnumber"
import { InputOtp } from "primereact/inputotp"
import { InputSwitch } from "primereact/inputswitch"
import { InputTextarea } from "primereact/inputtextarea"
import { InputText } from "primereact/inputtext"
import { Knob } from "primereact/knob"
import { ListBox } from "primereact/listbox"
import { MegaMenu } from "primereact/megamenu"
import { Menu } from "primereact/menu"
import { Menubar } from "primereact/menubar"
import { Message } from "primereact/message"
import { Messages } from "primereact/messages"
import { Mention } from "primereact/mention"
import { MeterGroup } from "primereact/metergroup"
import { MultiSelect } from "primereact/multiselect"
import { MultiStateCheckbox } from "primereact/multistatecheckbox"
import { OrderList } from "primereact/orderlist"
import { OrganizationChart } from "primereact/organizationchart"
import { OverlayPanel } from "primereact/overlaypanel"
import { Panel } from "primereact/panel"
import { PanelMenu } from "primereact/panelmenu"
import { Paginator } from "primereact/paginator"
import { Password } from "primereact/password"
import { PickList } from "primereact/picklist"
import { ProgressBar } from "primereact/progressbar"
import { ProgressSpinner } from "primereact/progressspinner"
import { RadioButton } from "primereact/radiobutton"
import { Rating } from "primereact/rating"
import { ScrollPanel } from "primereact/scrollpanel"
import { ScrollTop } from "primereact/scrolltop"
import { SelectButton } from "primereact/selectbutton"
import { Sidebar } from "primereact/sidebar"
import { Skeleton } from "primereact/skeleton"
import { SlideMenu } from "primereact/slidemenu"
import { Slider } from "primereact/slider"
import { SpeedDial } from "primereact/speeddial"
import { SplitButton } from "primereact/splitbutton"
import { Splitter, SplitterPanel } from "primereact/splitter"
import { Steps } from "primereact/steps"
import { TabMenu } from "primereact/tabmenu"
import { TabPanel, TabView } from "primereact/tabview"
import { Tag } from "primereact/tag"
import { Terminal } from "primereact/terminal"
import { TieredMenu } from "primereact/tieredmenu"
import { Timeline } from "primereact/timeline"
import { Toast } from "primereact/toast"
import { ToggleButton } from "primereact/togglebutton"
import { Toolbar } from "primereact/toolbar"
import { Tree } from "primereact/tree"
import { TreeSelect } from "primereact/treeselect"
import { TreeTable } from "primereact/treetable"
import { TriStateCheckbox } from "primereact/tristatecheckbox"
import { Tooltip } from "primereact/tooltip"
import { VirtualScroller } from "primereact/virtualscroller"
import { Icon } from "@/components/icon"
import placeholder from "@/assets/placeholder.svg"
import { EmptyState, PageHeader } from "@/components/shared"
import "quill/dist/quill.snow.css"

const extras = [
  "Fieldset", "Toolbar", "Inplace", "BlockUI", "Dock", "Chips", "ToggleButton",
  "MultiStateCheckbox", "TriStateCheckbox", "OrderList", "OrganizationChart",
  "TreeTable", "TreeSelect", "DataScroller", "VirtualScroller", "Galleria",
  "DeferredContent", "Terminal", "SplitButton", "TieredMenu", "MegaMenu",
  "SlideMenu", "ContextMenu", "Menubar", "TabMenu", "Messages", "FloatLabel",
  "IconField", "Knob", "MeterGroup", "InputMask", "ScrollTop", "Chip", "Panel",
  "Password", "KeyFilter", "Editor",
]

const tree = [
  { key: "0", label: "工作区", children: [{ key: "0-0", label: "项目" }, { key: "0-1", label: "团队" }] },
]
const cascadeOptions = [
  { name: "华东", code: "east", states: [{ name: "江苏", cities: [{ cname: "南京" }, { cname: "苏州" }] }, { name: "浙江", cities: [{ cname: "杭州" }, { cname: "宁波" }] }] },
  { name: "华北", code: "north", states: [{ name: "北京", cities: [{ cname: "北京" }] }, { name: "河北", cities: [{ cname: "石家庄" }] }] },
  { name: "华南", code: "south", states: [{ name: "广东", cities: [{ cname: "广州" }, { cname: "深圳" }] }] },
]
const navModel = nav.map((item) => ({ label: item.label, icon: <Icon name={item.icon} />, url: item.path }))
const placeholderImages = [placeholder, placeholder, placeholder]
const virtualItems = Array.from({ length: 100 }, (_, index) => `团队成员 ${index + 1}`)
const wideComponents = new Set(["Button", "IconButton", "Input", "Table", "DataGrid", "Transfer", "Tree", "Calendar", "Carousel", "Menu", "Navbar", "Steps", "Tabs", "Pagination", "Resizable", "Timeline", "Upload", "Form", "Dialog", "Drawer", "Descriptions", "Grid", "Stack", "Layout", "Container"])

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])
  const items = nav.filter((item) => item.label.includes(query))
  return <><Button label="⌘K 命令面板" onClick={() => setOpen(true)} /><Dialog visible={open} onHide={() => setOpen(false)} header="命令面板"><InputText value={query} onChange={(event) => setQuery(event.target.value)} className="w-full mb-3" placeholder="搜索导航" /><ListBox options={items} optionLabel="label" className="w-full" onChange={() => setOpen(false)} /></Dialog></>
}

function Demo({ name }: { name: string }) {
  const [value, setValue] = useState<unknown>(null)
  const [visible, setVisible] = useState(false)
  const [sidebarPosition, setSidebarPosition] = useState<"left" | "right" | "top" | "bottom">("right")
  const [selectedItems, setSelectedItems] = useState([{ id: "1", name: "项目一" }, { id: "2", name: "项目二" }])
  const toast = useRef<Toast>(null)
  const overlay = useRef<OverlayPanel>(null)
  const messages = useRef<Messages>(null)
  const contextMenu = useRef<ContextMenu>(null)
  const [mentionSuggestions, setMentionSuggestions] = useState(team.map((member) => member.name))
  const [stepIndex, setStepIndex] = useState(0)
  const [dialogKind, setDialogKind] = useState<"normal" | "full" | "scroll" | null>(null)

  if (coverage[name] === "missing") return <Message severity="warn" text="PrimeReact 未提供此组件。" />
  if (name === "Typography") return <div className="flex flex-column gap-2"><h1>一级标题</h1><h2>二级标题</h2><h3>三级标题</h3><h4>四级标题</h4><h5>五级标题</h5><h6>六级标题</h6><p>正文与辅助说明。</p><blockquote>组合排版示例。</blockquote><a href="#component-index">锚点链接</a><ul><li>无序列表</li></ul><ol><li>有序列表</li></ol><Divider /></div>
  if (name === "Code") return <pre className="surface-ground p-3 border-round overflow-auto"><code>const ui = "PrimeReact"</code></pre>
  if (name === "Kbd") return <div className="flex align-items-center gap-2">打开命令面板 <kbd>⌘</kbd> <kbd>K</kbd></div>
  if (name === "Button") return <div className="flex flex-column gap-2"><div className="flex flex-wrap gap-2">{(["primary", "secondary", "success", "info", "warning", "help", "danger"] as const).map((severity) => <Button key={severity} label={severity === "primary" ? "默认" : severity} severity={severity === "primary" ? undefined : severity} />)}</div><div className="flex flex-wrap gap-2">{(["实心", "描边", "文本", "凸起", "圆角", "链接"] as const).map((label, index) => <Button key={label} label={label} outlined={index === 1} text={index === 2} raised={index === 3} rounded={index === 4} link={index === 5} />)}</div><div className="flex flex-wrap gap-2"><Button size="small" label="小" /><Button label="默认" /><Button size="large" label="大" /></div><div className="flex flex-wrap gap-2"><Button disabled label="禁用" /><Button loading label="加载" /><Button icon={<Icon name="check" />} label="图标与文字" /><Button icon={<Icon name="arrow-right" />} iconPos="right" label="右侧图标" /></div></div>
  if (name === "IconButton") return <div className="flex flex-column gap-2">{(["small", "normal", "large"] as const).map((size) => <div className="flex gap-2" key={size}><Button aria-label={`${size} 圆形`} rounded size={size === "normal" ? undefined : size} icon={<Icon name="plus" />} /><Button aria-label={`${size} 描边`} rounded outlined size={size === "normal" ? undefined : size} icon={<Icon name="plus" />} /><Button aria-label={`${size} 文本`} rounded text size={size === "normal" ? undefined : size} icon={<Icon name="plus" />} /></div>)}<div className="flex gap-2"><Button aria-label="禁用图标" rounded disabled icon={<Icon name="lock" />} /><Button aria-label="加载图标" rounded loading /></div></div>
  if (name === "ButtonGroup") return <div className="flex flex-wrap gap-3"><ButtonGroup><Button label="保存" /><Button label="发布" /><Button label="归档" /></ButtonGroup><SplitButton label="更多操作" model={[{ label: "复制" }, { label: "删除" }]} /></div>
  if (name === "Input") return <div className="grid"><div className="col-12 md:col-6 flex flex-column gap-2"><InputText placeholder="默认输入" /><IconField iconPosition="left"><InputIcon className="pi pi-search" /><InputText placeholder="前缀图标" /></IconField><IconField iconPosition="right"><InputText placeholder="后缀图标" /><InputIcon className="pi pi-check" /></IconField><IconField iconPosition="right"><InputText value={String(value ?? "可清除")} onChange={(event) => setValue(event.target.value)} /><Button text rounded icon={<Icon name="x" />} aria-label="清空输入" onClick={() => setValue("")} /></IconField><Password toggleMask placeholder="密码" feedback={false} /><InputText type="search" placeholder="搜索" /></div><div className="col-12 md:col-6 flex flex-column gap-2"><InputText disabled placeholder="禁用" /><InputText className="p-invalid" placeholder="无效输入" /><small className="p-error">请输入有效内容。</small><InputText variant="filled" placeholder="填充样式" /><InputText className="p-inputtext-sm" placeholder="小尺寸" /><InputText className="p-inputtext-lg" placeholder="大尺寸" /></div></div>
  if (name === "Textarea") return <div className="flex flex-column gap-2"><InputTextarea autoResize rows={3} value={String(value ?? "")} maxLength={200} onChange={(event) => setValue(event.target.value)} placeholder="多行文本" /><small className="muted">{String(value ?? "").length} / 200</small><InputTextarea disabled placeholder="禁用" /><InputTextarea className="p-invalid" placeholder="无效输入" /><small className="p-error">请输入描述。</small></div>
  if (name === "NumberInput") return <div className="flex flex-column gap-3"><InputNumber showButtons buttonLayout="horizontal" value={Number(value ?? 2)} onValueChange={(event) => setValue(event.value)} /><InputNumber mode="currency" currency="CNY" locale="zh-CN" value={128430} /><InputNumber disabled value={10} /></div>
  if (name === "Select") return <div className="flex flex-column gap-2"><Dropdown options={["选项一", "选项二", "选项三"]} placeholder="默认选择" /><Dropdown options={["选项一", "选项二", "选项三"]} filter placeholder="可筛选" /><Dropdown disabled options={["选项一"]} placeholder="禁用" /><Dropdown className="p-invalid" options={["选项一"]} placeholder="无效" /><Dropdown loading options={[]} placeholder="加载中" /></div>
  if (name === "Combobox") return <Dropdown editable options={["选项一", "选项二", "选项三"]} placeholder="可编辑组合框" />
  if (name === "Autocomplete") return <AutoComplete dropdown suggestions={mentionSuggestions} completeMethod={(event) => setMentionSuggestions(team.map((member) => member.name).filter((member) => member.includes(event.query)))} placeholder="搜索团队成员" />
  if (name === "Mention") return <Mention rows={3} suggestions={mentionSuggestions} onSearch={(event) => setMentionSuggestions(team.map((member) => member.name).filter((member) => member.includes(event.query)))} trigger="@" itemTemplate={(item) => <span>{item}</span>} placeholder="@ 提及团队成员" />
  if (name === "MultiSelect") return <div className="flex flex-column gap-2"><MultiSelect options={["Web", "iOS", "Android"]} placeholder="默认多选" /><MultiSelect display="chip" options={["Web", "iOS", "Android"]} placeholder="标签多选" /><MultiSelect disabled options={["Web"]} placeholder="禁用多选" /></div>
  if (name === "Checkbox") return <div className="flex flex-column gap-2"><label className="hit"><Checkbox checked={false} onChange={() => undefined} />未选</label><label className="hit"><Checkbox checked onChange={() => undefined} />已选</label><label className="hit"><TriStateCheckbox value={null} onChange={() => undefined} />半选（TriState）</label><label className="hit"><Checkbox disabled checked={false} />禁用</label><label className="hit"><Checkbox className="p-invalid" checked={false} />无效</label></div>
  if (name === "Radio") return <div className="flex gap-3 flex-wrap"><label className="hit"><RadioButton name="radio-demo" value="a" checked />选中</label><label className="hit"><RadioButton name="radio-demo" value="b" />未选</label><label className="hit"><RadioButton disabled name="radio-demo" value="c" />禁用</label></div>
  if (name === "Switch") return <div className="flex gap-3"><label className="flex align-items-center gap-2">关闭<InputSwitch checked={false} /></label><label className="flex align-items-center gap-2">开启<InputSwitch checked /></label><label className="flex align-items-center gap-2">禁用<InputSwitch disabled checked /></label></div>
  if (name === "Slider") return <div className="flex flex-column gap-3"><Slider value={50} onChange={() => undefined} /><Slider range value={[25, 75]} onChange={() => undefined} /><Slider disabled value={35} /><Slider orientation="vertical" value={60} style={{ height: "8rem" }} /></div>
  if (name === "Rating") return <div className="flex flex-column gap-2"><Rating value={4} onChange={() => undefined} /><Rating value={4} readOnly /><Rating value={3} disabled /><Rating value={3} cancel={false} /></div>
  if (name === "DatePicker") return <Calendar showIcon placeholder="选择日期" />
  if (name === "TimePicker") return <Calendar timeOnly showIcon placeholder="选择时间" />
  if (name === "DateRangePicker") return <Calendar selectionMode="range" readOnlyInput showIcon placeholder="选择日期范围" />
  if (name === "Calendar") return <Calendar inline />
  if (name === "ColorPicker") return <div className="flex gap-3 align-items-center"><ColorPicker /><ColorPicker inline /></div>
  if (name === "Upload") return <FileUpload mode="advanced" name="demo[]" chooseLabel="选择文件" uploadLabel="上传" cancelLabel="取消" customUpload uploadHandler={() => undefined} emptyTemplate={<p className="m-0">拖拽文件到此处</p>} />
  if (name === "Cascader") return <CascadeSelect options={cascadeOptions} optionLabel="name" optionGroupLabel="name" optionGroupChildren={["states", "cities"]} placeholder="选择地区、省、市" className="w-full" />
  if (name === "Transfer") return <PickList dataKey="id" source={selectedItems} target={[{ id: "3", name: "项目三" }]} onChange={(event) => setSelectedItems(event.source)} sourceStyle={{ height: "14rem", minWidth: 0 }} targetStyle={{ height: "14rem", minWidth: 0 }} itemTemplate={(item) => item.name} sourceHeader="待选项目" targetHeader="已选项目" />
  if (name === "PinInput") return <div className="flex flex-column gap-2"><InputOtp length={6} integerOnly /><InputOtp length={6} mask /></div>
  if (name === "Form") return <div className="flex flex-column gap-4"><label className="flex flex-column gap-2">垂直布局 <InputText className="p-invalid" /><small className="p-error">请输入邮箱。</small></label><div className="flex align-items-center gap-2"><label className="w-8rem">水平布局 <b className="p-error">*</b></label><InputText className="p-invalid flex-1" /></div><div className="flex align-items-center gap-2"><InputText className="p-invalid" placeholder="内联字段" /><small className="p-error">必填。</small></div></div>
  if (name === "Table") return <DataTable value={orders.slice(0, 5)} paginator rows={5} stripedRows><Column field="id" header="订单号" sortable /><Column field="customer" header="客户" /><Column field="status" header="状态" sortable /><Column field="amount" header="金额" sortable body={(row) => `¥${row.amount.toLocaleString()}`} /></DataTable>
  if (name === "DataGrid") return <DataTable value={orders.slice(0, 8)} filterDisplay="row" resizableColumns reorderableColumns scrollable scrollHeight="14rem"><Column field="id" header="订单号" filter sortable /><Column field="customer" header="客户" filter /><Column field="status" header="状态" filter /></DataTable>
  if (name === "Descriptions") return <div className="grid"><span className="col-4 muted">状态</span><span className="col-8">已完成</span><span className="col-4 muted">负责人</span><span className="col-8">林晓</span><span className="col-4 muted">地区</span><span className="col-8">上海</span><span className="col-4 muted">更新时间</span><span className="col-8">刚刚</span></div>
  if (name === "List") return <div className="flex flex-column gap-3"><ListBox options={team.map((member) => member.name)} filter /><DataTable value={team.slice(0, 3)}><Column field="name" header="成员" /><Column field="role" header="角色" /></DataTable></div>
  if (name === "Card") return <div className="flex flex-column gap-3"><Card header={<div className="surface-ground" style={{ height: "5rem" }} />} title="卡片标题" subTitle="卡片副标题" footer={<Button label="操作" />}>内容与操作区域。</Card><Card><div className="flex align-items-center gap-3"><Avatar label="林" /><span>横向卡片布局</span></div></Card></div>
  if (name === "Avatar") return <div className="flex flex-wrap align-items-center gap-3"><Avatar label="林" /><Avatar label="王" size="large" /><Avatar icon="pi pi-user" size="xlarge" shape="circle" /><Avatar label="A" shape="square" /><Badge value="在线" severity="success" /></div>
  if (name === "AvatarGroup") return <AvatarGroup className="flex-wrap"><Avatar label="林" size="large" shape="circle" /><Avatar label="王" size="large" shape="circle" /><Avatar label="A" size="large" shape="circle" /><Avatar label="M" size="large" shape="circle" /><Avatar label="+2" size="large" shape="circle" /></AvatarGroup>
  if (name === "Badge") return <div className="flex flex-wrap align-items-center gap-3"><Badge value="12" size="large" /><Badge value="NEW" severity="success" size="xlarge" /><Badge value="!" severity="danger" /><Button label="消息" badge="3" badgeClassName="p-badge-danger" /></div>
  if (name === "Tag") return <div className="flex flex-wrap gap-2"><Tag value="成功" severity="success" rounded icon="pi pi-check" /><Tag value="信息" severity="info" rounded /><Tag value="次要" severity="secondary" /><Tag value="警告" severity="warning" /><Tag value="危险" severity="danger" /></div>
  if (name === "Statistic") { const statistic = stats[0]; return <Card><span className="muted">{statistic.label}</span><strong className="block text-2xl">{statistic.unit === "CNY" ? `¥${statistic.value.toLocaleString()}` : `${statistic.value}${statistic.unit ?? ""}`}</strong><Tag value={`${statistic.delta > 0 ? "+" : ""}${statistic.delta}%`} severity={statistic.delta > 0 ? "success" : "warning"} /></Card> }
  if (name === "Timeline") return <Timeline value={activity.slice(0, 4)} content={(item) => <span>{item.user} {item.action}</span>} opposite={(item) => item.time} marker={(item) => <span className="flex align-items-center justify-content-center border-circle surface-primary text-primary" style={{ width: "2rem", height: "2rem" }}><Icon name={item.user === "林晓" ? "shopping-bag" : "user"} size={14} /></span>} />
  if (name === "Tree") return <Tree value={tree} selectionMode="checkbox" filter className="w-full" />
  if (name === "Image") return <Image src={placeholder} alt="占位图片" preview width="100%" />
  if (name === "Carousel") return <Carousel value={landing.testimonials} numVisible={1} circular itemTemplate={(item) => <Card><p>“{item.quote}”</p><strong>{item.company}</strong></Card>} />
  if (name === "Empty") return <div><EmptyState title="暂无内容" description="这里还没有可展示的项目。" /><Button label="创建项目" icon={<Icon name="plus" />} /></div>
  if (name === "Tooltip") return <div className="flex flex-wrap gap-2"><Tooltip target=".tooltip-demo" /><Button className="tooltip-demo" data-pr-tooltip="上方提示" tooltipOptions={{ position: "top" }} label="上方" /><Button className="tooltip-demo" data-pr-tooltip="下方提示" tooltipOptions={{ position: "bottom" }} label="下方" /><Button className="tooltip-demo" data-pr-tooltip="左侧提示" tooltipOptions={{ position: "left" }} label="左侧" /><Button className="tooltip-demo" data-pr-tooltip="右侧提示" tooltipOptions={{ position: "right" }} label="右侧" /></div>
  if (name === "Popover") return <><Button label="打开 Popover" onClick={(event) => overlay.current?.toggle(event)} /><OverlayPanel ref={overlay}><DataTable value={team.slice(0, 3)} size="small"><Column field="name" header="成员" /><Column field="role" header="角色" /></DataTable></OverlayPanel></>
  if (name === "QRCode") return <Message severity="warn" text="PrimeReact 未提供 QRCode。" />
  if (name === "Segmented") return <div className="flex flex-column gap-2"><SelectButton options={["日", "周", "月"]} /><SelectButton multiple options={["收入", "订单", "用户"]} /><SelectButton disabled options={["禁用"]} /><SelectButton options={["全部", "已完成"]} itemTemplate={(option) => <span><Icon name={option === "全部" ? "grid" : "check"} /> {option}</span>} /></div>
  if (name === "Alert") return <div className="flex flex-column gap-2"><Message severity="info" text="提示消息" /><Message severity="success" text="操作成功" /><Message severity="warn" text="注意事项" /><Message severity="error" text="错误信息" /><Message icon={<Icon name="sparkles" />} content={<span>自定义内容 <Button text size="small" label="关闭" /></span>} /></div>
  if (name === "Toast") return <><Toast ref={toast} /><div className="flex flex-wrap gap-2">{(["success", "info", "warn", "error"] as const).map((severity) => <Button key={severity} label={severity} onClick={() => toast.current?.show({ severity, summary: "通知", detail: "操作已完成" })} />)}<Button label="带操作" onClick={() => toast.current?.show({ severity: "info", content: () => <div><strong className="block">提示</strong><span className="block text-sm">有一项待处理</span><Button text size="small" label="撤销" /></div> })} /></div></>
  if (name === "Notification") return <><Toast ref={toast} position="top-right" /><Button label="显示通知" onClick={() => toast.current?.show({ sticky: true, severity: "info", content: () => <div><strong className="block">系统通知</strong><span className="block text-sm">你有新的团队动态。</span><Button text size="small" label="查看" /></div> })} /></>
  if (name === "Dialog") return <><ConfirmDialog /><div className="flex flex-wrap gap-2"><Button label="普通 Dialog" onClick={() => setDialogKind("normal")} /><Button label="确认" onClick={() => confirmDialog({ message: "确认继续此操作吗？", header: "请确认", accept: () => toast.current?.show({ severity: "success", summary: "已确认" }) })} /><Button label="全屏" onClick={() => setDialogKind("full")} /><Button label="可滚动" onClick={() => setDialogKind("scroll")} /></div><Dialog visible={dialogKind !== null} onHide={() => setDialogKind(null)} maximized={dialogKind === "full"} maximizable header="Dialog 示例" style={dialogKind === "scroll" ? { maxHeight: "60vh" } : undefined}><p>{dialogKind === "scroll" ? "长内容 ".repeat(80) : "这是 PrimeReact Dialog 内容。"}</p></Dialog></>
  if (name === "Drawer") return <><div className="flex flex-wrap gap-2"><Button label="左侧" onClick={() => { setSidebarPosition("left"); setVisible(true) }} /><Button label="右侧" onClick={() => { setSidebarPosition("right"); setVisible(true) }} /><Button label="顶部" onClick={() => { setSidebarPosition("top"); setVisible(true) }} /><Button label="底部" onClick={() => { setSidebarPosition("bottom"); setVisible(true) }} /></div><Sidebar visible={visible} position={sidebarPosition} onHide={() => setVisible(false)}><p>Drawer 内容。</p></Sidebar></>
  if (name === "Sidebar") return <><Button label="打开全屏导航" onClick={() => setVisible(true)} /><Sidebar visible={visible} fullScreen onHide={() => setVisible(false)}><PanelMenu model={navModel} /></Sidebar><PanelMenu model={navModel} /></>
  if (name === "Progress") return <div className="flex flex-column gap-3"><ProgressBar value={72} /><ProgressBar mode="indeterminate" showValue={false} /><ProgressSpinner /><Steps model={[{ label: "开始" }, { label: "配置" }, { label: "完成" }]} activeIndex={1} /></div>
  if (name === "Skeleton") return <div className="flex flex-column gap-3"><Skeleton /><Skeleton shape="circle" size="3rem" /><Skeleton width="70%" /><Skeleton width="40%" /></div>
  if (name === "Spinner") return <div className="flex align-items-center gap-3"><ProgressSpinner strokeWidth="2" /><ProgressSpinner strokeWidth="6" style={{ width: "2rem", height: "2rem" }} /><ProgressSpinner strokeWidth="10" style={{ width: "1.5rem", height: "1.5rem" }} /></div>
  if (name === "Result") return <div className="grid"><div className="col-12 md:col-6 text-center"><Icon name="check" size={42} /><h3>操作成功</h3><p className="muted">项目已经创建。</p><Button label="继续" /></div><div className="col-12 md:col-6 text-center"><Icon name="x" size={42} /><h3>操作失败</h3><p className="muted">请稍后重试。</p><Button outlined label="重试" /></div></div>
  if (name === "Popconfirm") return <><ConfirmPopup /><Button label="删除" severity="danger" onClick={(event) => confirmPopup({ target: event.currentTarget, message: "确认删除？", accept: () => undefined })} /></>
  if (name === "Menu") return <div className="flex flex-column gap-3"><Menubar model={navModel} /><Menu model={navModel} /><PanelMenu model={navModel} /><TieredMenu model={navModel} /></div>
  if (name === "Dropdown") return <><Button label="打开菜单" onClick={(event) => overlay.current?.toggle(event)} /><OverlayPanel ref={overlay}><Menu model={navModel} /></OverlayPanel><ContextMenu ref={contextMenu} model={navModel} /><div className="surface-ground p-3 mt-2" onContextMenu={(event) => { event.preventDefault(); contextMenu.current?.show(event) }}>右键此区域打开 ContextMenu</div></>
  if (name === "Breadcrumb") return <BreadCrumb home={{ label: "首页" }} model={[{ label: "组件" }, { label: "当前页" }]} />
  if (name === "Tabs") return <TabView scrollable><TabPanel header="概览" leftIcon="pi pi-home">内容一</TabPanel><TabPanel header="设置" closable>内容二</TabPanel><TabPanel header="禁用" disabled>不可用</TabPanel></TabView>
  if (name === "Pagination") return <Paginator first={0} rows={10} totalRecords={50} rowsPerPageOptions={[5, 10, 20]} template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="第 {first}–{last} 条，共 {totalRecords} 条" />
  if (name === "Steps") return <Steps model={[{ label: "开始" }, { label: "配置" }, { label: "完成" }]} activeIndex={stepIndex} readOnly={false} onSelect={(event) => setStepIndex(event.index)} />
  if (name === "Anchor") return <div className="flex gap-3 flex-wrap">{["Button", "Card", "Table"].map((item) => <a className="hit" href={`#component-${item}`} key={item}>{item}</a>)}</div>
  if (name === "BackTop") return <div><ScrollTop /><ScrollPanel style={{ height: "10rem" }} className="p-2"><p>{"可滚动内容。".repeat(80)}</p><ScrollTop target="parent" threshold={10} /></ScrollPanel></div>
  if (name === "Affix") return <Toolbar className="sticky top-0" start={<strong>固定工具栏</strong>} end={<Button label="操作" />} />
  if (name === "Navbar") return <div className="flex flex-column gap-2"><Toolbar start={<strong>Acme Console</strong>} center={<InputText placeholder="搜索..." />} end={<Button label="操作" />} /><Menubar model={navModel} end={<Avatar label="林" shape="circle" />} /></div>
  if (name === "CommandPalette") return <CommandPaletteDemo />
  if (name === "Grid") return <div className="grid">{["12", "6", "4", "3", "6", "12"].map((size, index) => <div className={`col-${size}`} key={`${size}-${index}`}><div className="surface-100 border-1 surface-border p-3 text-center">col-{size}</div></div>)}</div>
  if (name === "Stack") return <div className="flex flex-column gap-3"><div className="flex flex-column gap-2"><Tag value="纵向一" /><Tag value="纵向二" /></div><div className="flex gap-2"><Tag value="横向一" /><Tag value="横向二" /></div></div>
  if (name === "Layout") return <div className="flex flex-column" style={{ height: "12rem" }}><div className="surface-100 p-2">页头</div><div className="flex flex-1"><div className="surface-200 p-2 w-6rem">侧栏</div><div className="p-2 flex-1">内容</div></div><div className="surface-100 p-2">页脚</div></div>
  if (name === "Container") return <div className="surface-100 p-4 mx-auto w-full" style={{ maxWidth: "30rem" }}>居中的容器内容</div>
  if (name === "AspectRatio") return <div className="surface-100 border-1 surface-border border-round flex align-items-center justify-content-center" style={{ aspectRatio: "16/9" }}><Icon name="image" size={36} /></div>
  if (name === "Resizable") return <Splitter style={{ height: "12rem" }}><SplitterPanel><Splitter layout="vertical"><SplitterPanel>上方</SplitterPanel><SplitterPanel>下方</SplitterPanel></Splitter></SplitterPanel><SplitterPanel>右侧</SplitterPanel></Splitter>
  if (name === "ScrollArea") return <ScrollPanel style={{ height: "10rem" }}><p>{"长文本内容。".repeat(60)}</p></ScrollPanel>
  if (name === "Accordion") return <Accordion multiple activeIndex={[0]}><AccordionTab header="第一项">内容一</AccordionTab><AccordionTab header="第二项">内容二</AccordionTab><AccordionTab header="第三项">内容三</AccordionTab><AccordionTab header="禁用" disabled>不可用</AccordionTab></Accordion>
  if (name === "ThemeProvider") return <div className="flex flex-column gap-2"><Message severity="info" text="PrimeReactProvider + Lara 主题。" /><div className="flex gap-2"><Button label="浅色主题" onClick={() => { const params = new URLSearchParams(location.search); params.set("theme", "light"); location.search = params.toString() }} /><Button label="深色主题" onClick={() => { const params = new URLSearchParams(location.search); params.set("theme", "dark"); location.search = params.toString() }} /></div></div>
  if (name === "Watermark" || name === "Tour") return <Message severity="warn" text={`PrimeReact 未提供 ${name}。`} />
  if (name === "FloatButton") return <div className="flex gap-3"><SpeedDial model={[{ icon: <Icon name="plus" />, command: () => undefined }]} direction="up" /><Dock model={[{ label: "首页", icon: <Icon name="home" /> }, { label: "设置", icon: <Icon name="settings" /> }, { label: "消息", icon: <Icon name="mail" /> }, { label: "帮助", icon: <Icon name="circle-help" /> }]} /></div>
  if (name === "Divider") return <div><Divider /><Divider align="left">左对齐</Divider><Divider align="center">居中</Divider><Divider align="right">右对齐</Divider><Divider type="dashed">虚线</Divider><div className="flex align-items-center" style={{ height: "3rem" }}><Divider layout="vertical" /></div></div>
  if (name === "Link") return <div className="flex gap-3"><a className="hit" href="#component-index">普通链接</a><Button link label="链接按钮" /></div>
  if (name === "Fieldset") return <Fieldset legend="团队说明" toggleable>这是一个可折叠的 Fieldset。</Fieldset>
  if (name === "Toolbar") return <Toolbar start={<Button label="开始" />} center={<span>工具栏</span>} end={<Button outlined label="结束" />} />
  if (name === "Inplace") return <Inplace><InplaceDisplay>点击编辑</InplaceDisplay><InplaceContent><InputText autoFocus /></InplaceContent></Inplace>
  if (name === "BlockUI") return <BlockUI blocked><Panel header="被遮罩的面板">内容暂时不可用。</Panel></BlockUI>
  if (name === "Dock") return <Dock model={[{ label: "首页", icon: <Icon name="home" /> }, { label: "设置", icon: <Icon name="settings" /> }, { label: "帮助", icon: <Icon name="circle-help" /> }, { label: "邮件", icon: <Icon name="mail" /> }]} />
  if (name === "Chips") return <Chips value={["设计", "前端"]} onChange={() => undefined} />
  if (name === "ToggleButton") return <ToggleButton checked={Boolean(value)} onChange={(event) => setValue(event.value)} onLabel="已开启" offLabel="已关闭" />
  if (name === "MultiStateCheckbox") return <MultiStateCheckbox value={value as string | null} onChange={(event) => setValue(event.value)} options={[{ value: "on", icon: "pi pi-check" }, { value: "off", icon: "pi pi-times" }, { value: "maybe", icon: "pi pi-minus" }]} />
  if (name === "TriStateCheckbox") return <TriStateCheckbox value={value as boolean | null} onChange={(event) => setValue(event.value)} />
  if (name === "OrderList") return <OrderList dataKey="name" value={team.slice(0, 4)} onChange={(event) => setValue(event.value)} itemTemplate={(item) => item.name} />
  if (name === "OrganizationChart") return <OrganizationChart value={[{ label: "团队", expanded: true, children: team.slice(0, 3).map((member) => ({ label: member.name })) }]} />
  if (name === "TreeTable") return <TreeTable value={tree}><Column field="label" header="名称" expander /><Column header="类型" body={() => "节点"} /></TreeTable>
  if (name === "TreeSelect") return <TreeSelect options={tree} placeholder="选择树节点" className="w-full" />
  if (name === "DataScroller") return <DataScroller value={team} rows={3} inline itemTemplate={(item) => <div className="p-3 border-bottom-1 surface-border">{item.name} · {item.role}</div>} />
  if (name === "VirtualScroller") return <VirtualScroller items={virtualItems} itemSize={40} style={{ height: "8rem" }} itemTemplate={(item) => <div className="p-2 border-bottom-1 surface-border">{item}</div>} />
  if (name === "Galleria") return <Galleria value={placeholderImages} showThumbnails={false} showIndicators item={(item: string) => <img src={item} alt="占位图片" className="w-full" />} />
  if (name === "DeferredContent") return <DeferredContent onLoad={() => undefined}><Card title="延迟内容">滚动到此处后加载。</Card></DeferredContent>
  if (name === "Terminal") return <Terminal welcomeMessage="欢迎使用终端" prompt="acme $" />
  if (name === "SplitButton") return <SplitButton label="保存" model={[{ label: "另存为" }, { label: "导出" }]} />
  if (name === "TieredMenu") return <TieredMenu model={navModel} />
  if (name === "MegaMenu") return <MegaMenu model={navModel} />
  if (name === "SlideMenu") return <SlideMenu model={navModel} />
  if (name === "ContextMenu") return <><ContextMenu ref={contextMenu} model={navModel} /><div className="surface-ground p-3" onContextMenu={(event) => { event.preventDefault(); contextMenu.current?.show(event) }}>右键此区域</div></>
  if (name === "Menubar") return <Menubar model={navModel} end={<Button text label="账户" />} />
  if (name === "TabMenu") return <TabMenu model={navModel.slice(0, 4)} />
  if (name === "Messages") return <><Messages ref={messages} /><Button label="显示消息" onClick={() => messages.current?.show([{ severity: "info", summary: "提示", detail: "这是一条消息" }, { severity: "success", summary: "成功", detail: "操作已完成" }])} /></>
  if (name === "FloatLabel") return <FloatLabel><InputText id="float-label" /><label htmlFor="float-label">浮动标签</label></FloatLabel>
  if (name === "IconField") return <IconField iconPosition="left"><InputIcon className="pi pi-search" /><InputText placeholder="搜索" /></IconField>
  if (name === "Knob") return <Knob value={64} onChange={() => undefined} valueTemplate="{value}%" />
  if (name === "MeterGroup") return <MeterGroup values={[{ label: "收入", value: 40 }, { label: "订单", value: 30 }, { label: "用户", value: 30 }]} />
  if (name === "InputMask") return <InputMask mask="999 9999 9999" placeholder="手机号码" />
  if (name === "ScrollTop") return <><ScrollTop /><ScrollPanel style={{ height: "8rem" }}><p>{"滚动区域。".repeat(60)}</p><ScrollTop target="parent" /></ScrollPanel></>
  if (name === "Chip") return <div className="flex flex-wrap gap-2"><Chip label="普通 Chip" /><Chip label="带图标" icon="pi pi-check" /><Chip label="可移除" removable onRemove={() => true} /></div>
  if (name === "Panel") return <Panel header="可折叠面板" toggleable>面板内容</Panel>
  if (name === "Password") return <Password feedback toggleMask placeholder="输入密码" />
  if (name === "KeyFilter") return <InputText keyfilter="int" placeholder="只能输入整数" />
  if (name === "Editor") return <Editor value="<p>编辑器内容</p>" onTextChange={() => undefined} style={{ height: "10rem" }} />
  return <Panel header={name}>PrimeReact {name} 示例</Panel>
}

export function ComponentsPage() {
  return <div className="flex flex-column gap-5">
    <PageHeader title="组件全集" description="PrimeReact 官方组件、contract 覆盖与组合示例。" action={<Button outlined label="组件索引" icon={<Icon name="list" />} />} />
    <div id="component-index" className="flex flex-wrap gap-2">{(contract.components as string[]).map((name) => <a className="hit p-button p-button-outlined p-button-sm no-underline" href={`#component-${name}`} key={name}>{name}</a>)}</div>
    <div className="grid">{(contract.components as string[]).map((name) => <div className={`col-12 ${wideComponents.has(name) ? "" : "md:col-6 xl:col-4"}`} id={`component-${name}`} key={name}><Card className="demo-card" title={<span className="flex justify-content-between align-items-center">{name}<Tag value={coverage[name]} severity={coverage[name] === "missing" ? "danger" : coverage[name] === "composed" ? "warning" : "success"} /></span>}><Demo name={name} /></Card></div>)}</div>
    <div><h2>Extras</h2><div className="grid">{extras.map((name) => <div className="col-12 md:col-6 xl:col-4" key={name}><Card title={name}><Demo name={name} /></Card></div>)}</div></div>
  </div>
}
