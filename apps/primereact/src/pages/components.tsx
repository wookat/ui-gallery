import { useRef, useState } from "react"
import contract from "@ui-gallery/spec/contract.json"
import { coverage } from "../coverage"
import { Accordion, AccordionTab } from "primereact/accordion"
import { Avatar } from "primereact/avatar"
import { AvatarGroup } from "primereact/avatargroup"
import { Badge } from "primereact/badge"
import { Button } from "primereact/button"
import { ButtonGroup } from "primereact/buttongroup"
import { Calendar } from "primereact/calendar"
import { Card } from "primereact/card"
import { Carousel } from "primereact/carousel"
import { Checkbox } from "primereact/checkbox"
import { ColorPicker } from "primereact/colorpicker"
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Divider } from "primereact/divider"
import { Dropdown } from "primereact/dropdown"
import { FileUpload } from "primereact/fileupload"
import { Image } from "primereact/image"
import { InputOtp } from "primereact/inputotp"
import { InputNumber } from "primereact/inputnumber"
import { InputSwitch } from "primereact/inputswitch"
import { InputTextarea } from "primereact/inputtextarea"
import { InputText } from "primereact/inputtext"
import { Knob } from "primereact/knob"
import { ListBox } from "primereact/listbox"
import { Menu } from "primereact/menu"
import { Message } from "primereact/message"
import { MultiSelect } from "primereact/multiselect"
import { OverlayPanel } from "primereact/overlaypanel"
import { Paginator } from "primereact/paginator"
import { Panel } from "primereact/panel"
import { PickList } from "primereact/picklist"
import { ProgressBar } from "primereact/progressbar"
import { ProgressSpinner } from "primereact/progressspinner"
import { Rating } from "primereact/rating"
import { RadioButton } from "primereact/radiobutton"
import { ScrollTop } from "primereact/scrolltop"
import { SelectButton } from "primereact/selectbutton"
import { Skeleton } from "primereact/skeleton"
import { Slider } from "primereact/slider"
import { SpeedDial } from "primereact/speeddial"
import { Splitter, SplitterPanel } from "primereact/splitter"
import { Steps } from "primereact/steps"
import { TabPanel, TabView } from "primereact/tabview"
import { Tag } from "primereact/tag"
import { Timeline } from "primereact/timeline"
import { Toast } from "primereact/toast"
import { Tree } from "primereact/tree"
import { TreeSelect } from "primereact/treeselect"
import { Icon } from "@/components/icon"
import { PageHeader } from "@/components/shared"

const extras = ["Fieldset", "Toolbar", "Inplace", "BlockUI", "Dock", "Chips", "ToggleButton", "MultiStateCheckbox", "OrderList", "OrganizationChart", "TreeTable", "TreeSelect", "DataScroller", "VirtualScroller", "Galleria", "DeferredContent", "Terminal", "SplitButton", "TieredMenu", "MegaMenu", "PanelMenu", "TabMenu", "Messages", "FloatLabel", "IconField", "Listbox", "Knob", "MeterGroup", "InputMask", "ScrollTop"]
const tree = [{ key: "0", label: "工作区", children: [{ key: "0-0", label: "项目" }, { key: "0-1", label: "团队" }] }]

function Demo({ name }: { name: string }) {
  const [value, setValue] = useState<unknown>(null)
  const toast = useRef<Toast>(null), overlay = useRef<OverlayPanel>(null)
  if (coverage[name] === "missing") return <Message severity="warn" text="PrimeReact 未提供此组件。" />
  if (name === "Typography" || name === "Code" || name === "Kbd") return <div><h1>标题文字</h1><h3>标题层级</h3><p className="muted">正文、辅助说明与 <code>const ui = "PrimeReact"</code>。</p><blockquote>组合排版示例。</blockquote><kbd>⌘ K</kbd></div>
  if (["Button", "IconButton", "ButtonGroup"].includes(name)) return <div className="flex flex-wrap gap-2"><Button label="默认" icon={<Icon name="check" />} /><Button outlined label="描边" /><Button text label="文本" /><Button severity="danger" label="危险" /><Button disabled label="禁用" /><Button loading label="加载" />{name === "ButtonGroup" ? <ButtonGroup><Button label="保存" /><Button outlined label="取消" /></ButtonGroup> : null}</div>
  if (["Input", "Autocomplete", "Mention"].includes(name)) return <InputText placeholder="输入内容..." value={value as string ?? ""} onChange={(e) => setValue(e.target.value)} />
  if (name === "Textarea") return <InputTextarea autoResize placeholder="多行文本..." />
  if (name === "NumberInput") return <InputNumber showButtons placeholder="数量" />
  if (["Select", "Combobox", "Dropdown"].includes(name)) return <Dropdown editable options={["选项一", "选项二", "选项三"]} placeholder="选择内容" className="w-full" />
  if (name === "MultiSelect") return <MultiSelect options={["Web", "iOS", "Android"]} placeholder="选择多个" className="w-full" />
  if (name === "Checkbox") return <div className="flex gap-3"><label><Checkbox checked={false} />默认</label><label><Checkbox checked />已选</label><label><Checkbox checked={false} disabled />禁用</label></div>
  if (name === "Radio") return <div className="flex gap-3"><label><RadioButton name="radio" value="a" /> A</label><label><RadioButton name="radio" value="b" /> B</label></div>
  if (name === "Switch") return <InputSwitch checked onChange={(e) => setValue(e.value)} />
  if (name === "Slider") return <Slider value={50} onChange={(e) => setValue(e.value)} className="w-full" />
  if (name === "Rating") return <Rating value={4} onChange={(e) => setValue(e.value)} />
  if (["DatePicker", "TimePicker", "DateRangePicker", "Calendar"].includes(name)) return <Calendar showIcon showTime={name === "TimePicker"} selectionMode={name === "DateRangePicker" ? "range" : "single"} />
  if (name === "ColorPicker") return <ColorPicker />
  if (name === "Upload") return <FileUpload mode="advanced" customUpload uploadHandler={() => undefined} />
  if (name === "Cascader") return <TreeSelect options={tree} placeholder="选择层级" className="w-full" />
  if (name === "Transfer") return <PickList dataKey="id" source={[{ id: "1", name: "项目一" }, { id: "2", name: "项目二" }]} target={[{ id: "3", name: "项目三" }]} onChange={() => undefined} itemTemplate={(item) => item.name} />
  if (name === "PinInput") return <InputOtp length={6} />
  if (name === "Form") return <div className="flex flex-column gap-2"><label>邮箱<InputText className="w-full p-invalid" /></label><small className="p-error">请输入有效邮箱。</small></div>
  if (["Table", "DataGrid"].includes(name)) return <DataTable value={[{ id: "ORD-2401", status: "paid" }, { id: "ORD-2402", status: "pending" }]} size="small"><Column field="id" header="编号" sortable /><Column field="status" header="状态" /></DataTable>
  if (name === "Descriptions") return <dl className="grid"><dt className="col-4 muted">状态</dt><dd className="col-8">已完成</dd><dt className="col-4 muted">负责人</dt><dd className="col-8">林晓</dd></dl>
  if (name === "List") return <ListBox options={["列表项一", "列表项二", "列表项三"]} className="w-full" />
  if (name === "Card") return <Card title="卡片标题">内容与操作区域。</Card>
  if (name === "Avatar" || name === "AvatarGroup") return <AvatarGroup><Avatar label="林" shape="circle" /><Avatar label="王" shape="circle" /><Avatar label="A" shape="circle" /></AvatarGroup>
  if (name === "Badge") return <><Badge value="12" /><Badge value="NEW" severity="success" className="ml-3" /></>
  if (name === "Tag") return <div className="flex gap-2"><Tag value="成功" severity="success" /><Tag value="警告" severity="warning" /><Tag value="危险" severity="danger" /></div>
  if (name === "Statistic") return <Card><span className="muted">本月收入</span><strong className="block text-2xl">¥128,430</strong><Tag value="+12.4%" severity="success" /></Card>
  if (name === "Timeline") return <Timeline value={["创建项目", "邀请成员", "完成配置"]} content={(item) => item} />
  if (name === "Tree") return <Tree value={tree} className="w-full" />
  if (name === "Image") return <Image src="https://placehold.co/500x260" alt="占位图片" preview width="100%" />
  if (name === "Carousel") return <Carousel value={["内容一", "内容二", "内容三"]} numVisible={1} itemTemplate={(item) => <Card>{item}</Card>} />
  if (name === "Empty") return <Message severity="info" text="暂无内容" />
  if (name === "Tooltip") return <Button label="悬停查看" tooltip="这是 Tooltip 内容" />
  if (name === "Popover") return <><Button label="打开 Popover" onClick={(e) => overlay.current?.toggle(e)} /><OverlayPanel ref={overlay}>Popover 内容</OverlayPanel></>
  if (name === "QRCode") return <Message severity="warn" text="PrimeReact 未提供 QRCode" />
  if (name === "Segmented") return <SelectButton options={["日", "周", "月"]} />
  if (name === "Alert" || name === "Notification") return <div className="flex flex-column gap-2"><Message severity="info" text="提示消息" /><Message severity="success" text="操作成功" /><Message severity="warn" text="注意事项" /><Message severity="error" text="错误信息" /></div>
  if (name === "Toast") return <><Toast ref={toast} /><Button label="显示 Toast" onClick={() => toast.current?.show({ severity: "success", summary: "完成", detail: "操作成功" })} /></>
  if (name === "Dialog") return <Button label="打开 Dialog" onClick={() => toast.current?.show({ severity: "info", summary: "Dialog", detail: "请使用页面交互示例" })} />
  if (name === "Drawer" || name === "Sidebar") return <><Button label="打开 Drawer" onClick={(e) => confirmPopup({ target: e.currentTarget, message: "Drawer / Sidebar 示例", accept: () => undefined })} /><ConfirmPopup /></>
  if (name === "Progress") return <div className="flex flex-column gap-3"><ProgressBar value={72} /><ProgressSpinner style={{ width: 40, height: 40 }} /><Knob value={64} /></div>
  if (name === "Skeleton") return <div className="flex flex-column gap-2"><Skeleton /><Skeleton width="70%" /><Skeleton width="40%" /></div>
  if (name === "Spinner") return <ProgressSpinner />
  if (name === "Result") return <Message severity="success" text="项目创建成功" />
  if (name === "Popconfirm") return <><Button label="删除" severity="danger" onClick={(e) => confirmPopup({ target: e.currentTarget, message: "确认删除？", accept: () => undefined })} /><ConfirmPopup /></>
  if (name === "Menu" || name === "Dropdown") return <Menu model={[{ label: "编辑", icon: <Icon name="pencil" /> }, { label: "复制", icon: <Icon name="copy" /> }]} />
  if (name === "Breadcrumb") return <span><a href="#component-index">首页</a> <Icon name="chevron-right" /> 当前页</span>
  if (name === "Tabs") return <TabView><TabPanel header="概览">内容一</TabPanel><TabPanel header="设置">内容二</TabPanel></TabView>
  if (name === "Pagination") return <Paginator first={0} rows={10} totalRecords={50} />
  if (name === "Steps") return <Steps model={[{ label: "开始" }, { label: "配置" }, { label: "完成" }]} />
  if (name === "Anchor") return <div className="flex gap-3"><a href="#component-Button">Button</a><a href="#component-Card">Card</a></div>
  if (name === "BackTop") return <ScrollTop />
  if (name === "Affix" || name === "Navbar") return <div className="surface-ground p-3 sticky top-0">Toolbar / Navbar</div>
  if (name === "CommandPalette") return <Button label="⌘ K 打开命令面板" outlined />
  if (["Grid", "Stack", "Layout", "Container"].includes(name)) return <div className="grid"><div className="col"><Card>一列</Card></div><div className="col"><Card>一列</Card></div></div>
  if (name === "AspectRatio") return <div className="surface-ground" style={{ aspectRatio: "16/7" }} />
  if (name === "Resizable") return <Splitter style={{ height: 120 }}><SplitterPanel>左侧</SplitterPanel><SplitterPanel>右侧</SplitterPanel></Splitter>
  if (name === "ScrollArea") return <div style={{ height: 100, overflow: "auto" }}><p>可滚动内容</p><p>更多内容</p><p>更多内容</p></div>
  if (name === "Accordion") return <Accordion><AccordionTab header="展开内容">Accordion 内容</AccordionTab></Accordion>
  if (name === "ThemeProvider") return <Message severity="info" text="PrimeReactProvider + Lara theme link" />
  if (name === "Watermark" || name === "Tour") return <Message severity="warn" text={`PrimeReact 未提供 ${name}`} />
  if (name === "FloatButton") return <SpeedDial model={[{ icon: <Icon name="plus" />, command: () => undefined }]} direction="up" />
  if (name === "Divider") return <><Divider>水平分隔线</Divider><Divider layout="vertical" /></>
  if (name === "Link") return <Button link label="链接按钮" />
  return <Panel header={name}>PrimeReact {name} 示例</Panel>
}

export function ComponentsPage() {
  return <div className="flex flex-column gap-5"><PageHeader title="组件全集" description="PrimeReact 官方组件、contract 覆盖与组合示例。" action={<Button outlined label="组件索引" icon={<Icon name="list" />} />} /><div id="component-index" className="flex flex-wrap gap-2">{(contract.components as string[]).map((name) => <a className="p-tag p-tag-secondary no-underline" href={`#component-${name}`} key={name}>{name}</a>)}</div><div className="grid">{(contract.components as string[]).map((name) => <div className="col-12 md:col-6 xl:col-4" id={`component-${name}`} key={name}><Card className="demo-card" title={<span className="flex justify-content-between align-items-center">{name}<Tag value={coverage[name]} severity={coverage[name] === "missing" ? "danger" : coverage[name] === "composed" ? "warning" : "success"} /></span>} subTitle="default · disabled · loading · error"><Demo name={name} /></Card></div>)}</div><div><h2>Extras</h2><div className="grid">{extras.map((name) => <div className="col-12 md:col-4" key={name}><Card title={name}><p className="muted m-0">PrimeReact 官方导出组件</p></Card></div>)}</div><Message severity="info" text="Editor 需要 Quill，按约定跳过。" /></div></div>
}
