import type { ReactNode } from "react"
import { Accordion, Alert, AlertDialog, Autocomplete, Avatar, Badge, Breadcrumbs, Button, ButtonGroup, Calendar, CalendarYearPicker, Card, Checkbox, CheckboxGroup, Chip, CloseButton, ColorArea, ColorField, ColorPicker, ColorSlider, ColorSwatch, ColorSwatchPicker, ComboBox, DateField, DatePicker, DateRangePicker, Description, Disclosure, DisclosureGroup, Drawer, Dropdown, EmptyState, ErrorMessage, FieldError, Fieldset, Form, Header, Input, InputGroup, InputOTP, Kbd, Label, Link, ListBox, Menu, Meter, Modal, NumberField, Pagination, Popover, ProgressBar, ProgressCircle, Radio, RadioGroup, RangeCalendar, ScrollShadow, SearchField, Select, Separator, Skeleton, Slider, Spinner, Surface, Switch, SwitchGroup, Table, Tabs, Tag, TagGroup, TextArea, TextField, TimeField, toast, ToggleButton, ToggleButtonGroup, Toolbar, Tooltip, Typography } from "@heroui/react"
import { Icon } from "@/components/icon"
import contract from "@ui-gallery/spec/contract.json"
import team from "@ui-gallery/spec/mock/team.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import { coverage } from "../coverage"
import { PageHeader, StatusBadge } from "./shared"

const nativeExtras = ["Chip", "CheckboxGroup", "SwitchGroup", "TagGroup", "Toolbar", "Disclosure", "DisclosureGroup", "Meter", "ProgressCircle", "RangeCalendar", "SearchField", "Surface", "ScrollShadow", "CloseButton", "Fieldset", "InputGroup", "ColorArea", "ColorSlider", "ColorSwatch", "ColorSwatchPicker", "ColorField", "CalendarYearPicker", "AlertDialog", "ListBox", "ToggleButton", "ToggleButtonGroup", "Header", "Description", "ErrorMessage", "FieldError"]
const nativeNotes: Record<string, string> = {
  Chip: "default/secondary Chip",
  CheckboxGroup: "secondary variant · two choices",
  SwitchGroup: "通知开关组",
  TagGroup: "可移除标签组",
  Toolbar: "ToggleButton 工具栏",
  Disclosure: "单项可展开内容",
  DisclosureGroup: "多项可展开内容",
  Meter: "64% Meter",
  ProgressCircle: "sm/md 圆形进度",
  RangeCalendar: "日期范围日历",
  SearchField: "搜索图标、输入与清除",
  Surface: "secondary/tertiary Surface",
  ScrollShadow: "可滚动成员列表",
  CloseButton: "关闭按钮",
  Fieldset: "Legend 与字段组",
  InputGroup: "前缀、输入、后缀",
  ColorArea: "HSB 饱和度/亮度区域",
  ColorSlider: "HSB 色相滑块",
  ColorSwatch: "三个颜色色块",
  ColorSwatchPicker: "三个可选颜色色块",
  ColorField: "颜色输入字段",
  CalendarYearPicker: "Calendar 年份触发器与年份网格",
  AlertDialog: "危险确认对话框",
  ListBox: "单选列表",
  ToggleButton: "未选中/已选中",
  ToggleButtonGroup: "多选切换组",
  Header: "分组标题",
  Description: "辅助说明文本",
  ErrorMessage: "错误提示文本",
  FieldError: "字段错误文本",
}
const items = [{ id: "one", label: "选项一" }, { id: "two", label: "选项二" }, { id: "three", label: "选项三" }]
const variantNotes: Record<string, string> = {
  Typography: "h1–h6、body、body-sm、Paragraph、Prose、caption、blockquote、ul/ol",
  Button: "primary/secondary/tertiary/outline/ghost/danger · sm/md/lg · pending · disabled · ButtonGroup",
  ButtonGroup: "primary 与 secondary · sm · 横向分组",
  IconButton: "primary/secondary/ghost/danger · sm · icon-only",
  Input: "default · disabled · invalid · FieldError",
  Textarea: "default 多行输入",
  NumberInput: "步进器 · minValue · 增减按钮",
  Select: "单选 · ListBox · 默认值",
  MultiSelect: "multiple · 双选项 · ListBox",
  Combobox: "可输入筛选 · 默认选项",
  Autocomplete: "搜索筛选 · 清除 · 弹出列表",
  Checkbox: "checked/unchecked/disabled · secondary",
  Radio: "selected/unselected/disabled · secondary",
  Switch: "selected/unselected/disabled",
  Slider: "range · 双 Thumb · 输出值",
  Rating: "组合 ToggleButtonGroup · 1–5 星",
  DatePicker: "日期输入 · Calendar 弹出层",
  TimePicker: "时间字段",
  DateRangePicker: "起止日期 · RangeCalendar",
  ColorPicker: "ColorArea · ColorSlider · ColorSwatch",
  Upload: "组合拖拽区 · 多文件列表",
  Cascader: "组合 Select · 层级选项",
  Transfer: "组合双 ListBox",
  Mention: "HeroUI 未提供，标记为 missing",
  PinInput: "InputOTP · 数字输入槽",
  Form: "字段校验 · FieldError · 提交状态",
  Table: "排序 · 多选 · mock orders 行",
  DataGrid: "由 Table 与 Tailwind 组合实现",
  Descriptions: "由 dl/dt/dd 与 Tailwind 组合实现",
  List: "ListBox · 分组与选中状态",
  Card: "secondary · Header/Content/Footer",
  Avatar: "sm/md/lg · fallback · Badge 状态点",
  AvatarGroup: "由 Avatar 与 Tailwind 组合实现",
  Badge: "danger/success/accent · sm · icon/avatar anchors",
  Tag: "TagGroup 可选/可移除 · Chip 多颜色/变体/尺寸",
  Statistic: "由 Card 与 Typography 组合实现",
  Timeline: "由列表与 Separator 组合实现",
  Tree: "HeroUI 未提供，标记为 missing",
  Calendar: "月份网格 · 前后导航",
  Image: "由 aspect-video 与 Tailwind 组合实现",
  Carousel: "由 ScrollShadow 与 Surface 组合实现",
  Empty: "EmptyState · 空结果",
  Tooltip: "默认提示 · 常开提示",
  Popover: "默认弹出层 · Dialog 内容",
  QRCode: "HeroUI 未提供，标记为 missing",
  Segmented: "ToggleButtonGroup · single selection",
  Alert: "default/accent/success/warning/danger · title/description",
  Toast: "default/success/warning/danger · 触发按钮",
  Notification: "toast.info · description",
  Dialog: "default · scrollable · fullscreen",
  Drawer: "left/right/top/bottom placements",
  Progress: "ProgressBar determinate/indeterminate · sizes · ProgressCircle · Steps",
  Skeleton: "圆形与文本骨架",
  Spinner: "sm/md/lg · accent",
  Result: "由 EmptyState 与 Button 组合实现",
  Popconfirm: "Popover · danger/secondary actions",
  Menu: "vertical · sections · multiple selection",
  Dropdown: "trigger · Menu · action items",
  Breadcrumb: "首页 · 订单 · 详情",
  Tabs: "primary 概览/分析/禁用 · secondary vertical",
  Pagination: "上一页/下一页 · active page",
  Steps: "由 ol、圆点与 Separator 组合实现",
  Anchor: "由 Link 与边框组合实现",
  BackTop: "由 Button 与滚动行为组合实现",
  Affix: "由 sticky 与滚动容器组合实现",
  Navbar: "由 Surface、Link、Button 组合实现",
  Sidebar: "由 Surface、ListBox 组合实现",
  CommandPalette: "由 Modal、Autocomplete、Kbd 组合实现",
  Grid: "由 CSS Grid 与 Surface 组合实现",
  Stack: "由 flex-col 与 Surface 组合实现",
  Layout: "由 CSS Grid 与 Surface 组合实现",
  Container: "由 Surface 与 max-width 组合实现",
  AspectRatio: "由 aspect-video 与 Surface 组合实现",
  Resizable: "HeroUI 未提供，标记为 missing",
  ScrollArea: "ScrollShadow · 长列表",
  Accordion: "展开/收起 · 两个项目",
  ThemeProvider: "由 light/dark 作用域组合实现",
  Watermark: "HeroUI 未提供，标记为 missing",
  Tour: "HeroUI 未提供，标记为 missing",
  FloatButton: "由 icon-only Button 与定位组合实现",
  Kbd: "command/shift/Esc 快捷键",
  Code: "由 code 与 Surface 组合实现",
  Divider: "水平/垂直 Separator",
  Link: "默认/禁用/外部链接",
}

const CalendarBody = () => (
  <>
    <Calendar.Header><Calendar.Heading /><Calendar.NavButton slot="previous" /><Calendar.NavButton slot="next" /></Calendar.Header>
    <Calendar.Grid>
      <Calendar.GridHeader>{(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}</Calendar.GridHeader>
      <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
    </Calendar.Grid>
  </>
)

function Options() {
  return <ListBox>{items.map((item) => <ListBox.Item key={item.id} id={item.id} textValue={item.label}>{item.label}<ListBox.ItemIndicator /></ListBox.Item>)}</ListBox>
}

function Buttons() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2"><Button>primary</Button><Button variant="secondary">secondary</Button><Button variant="tertiary">tertiary</Button><Button variant="outline">outline</Button><Button variant="ghost">ghost</Button><Button variant="danger">danger</Button><Button variant="danger-soft">danger-soft</Button></div>
      <div className="flex flex-wrap items-center gap-2"><Button size="sm">sm</Button><Button size="md">md</Button><Button size="lg">lg</Button><Button isDisabled>disabled</Button><Button isPending>pending</Button><Button fullWidth className="max-w-40">fullWidth</Button></div>
    </div>
  )
}

function Demo({ name }: { name: string }): ReactNode {
  switch (name) {
    case "Typography": return <div className="space-y-2"><div className="grid gap-1">{(["h1", "h2", "h3", "h4", "h5", "h6"] as const).map((type) => <Typography key={type} type={type}>{type} 标题</Typography>)}</div><Typography type="body">body 正文</Typography><Typography type="body-sm" className="text-muted">body-sm 辅助文本</Typography><Typography.Paragraph>Paragraph 段落</Typography.Paragraph><Typography.Prose><p>Prose 内容</p><ul><li>Prose 列表</li></ul></Typography.Prose><span className="text-xs text-muted">caption 注释</span><blockquote className="border-l-2 border-accent pl-3 text-sm text-muted">引用内容</blockquote><ul className="list-disc pl-5 text-sm"><li>无序列表</li><li>第二项</li></ul><ol className="list-decimal pl-5 text-sm"><li>有序列表</li><li>第二项</li></ol></div>
    case "Button": return <Buttons />
    case "ButtonGroup": return <div className="space-y-2"><ButtonGroup><Button>保存</Button><Button>另存为</Button><Button>取消</Button></ButtonGroup><ButtonGroup variant="secondary" size="sm"><Button>日</Button><Button>周</Button><Button>月</Button></ButtonGroup></div>
    case "IconButton": return <div className="flex gap-2"><Button isIconOnly aria-label="添加"><Icon name="plus" size={16} /></Button><Button isIconOnly variant="secondary" aria-label="编辑"><Icon name="pencil" size={16} /></Button><Button isIconOnly variant="ghost" size="sm" aria-label="更多"><Icon name="more-horizontal" size={16} /></Button><Button isIconOnly variant="danger" aria-label="删除"><Icon name="trash" size={16} /></Button></div>
    case "Input": return <div className="grid gap-3"><TextField><Label>默认</Label><Input placeholder="输入内容..." /></TextField><TextField isInvalid><Label>错误</Label><Input defaultValue="无效值" /><FieldError>请输入有效内容</FieldError></TextField><TextField isDisabled><Label>禁用</Label><Input placeholder="禁用" /></TextField></div>
    case "Textarea": return <TextField><Label>多行文本</Label><TextArea placeholder="多行文本..." /></TextField>
    case "NumberInput": return <NumberField defaultValue={12} minValue={0}><Label>数量</Label><NumberField.Group><NumberField.DecrementButton /><NumberField.Input /><NumberField.IncrementButton /></NumberField.Group></NumberField>
    case "Select": return <Select defaultValue="one"><Label>单选</Label><Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger><Select.Popover><Options /></Select.Popover></Select>
    case "MultiSelect": return <Select selectionMode="multiple" defaultValue={["one", "two"]}><Label>多选（Select selectionMode=multiple）</Label><Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger><Select.Popover><Options /></Select.Popover></Select>
    case "Combobox": return <ComboBox defaultItems={items}><Label>组合框</Label><ComboBox.InputGroup><Input placeholder="输入或选择" /><ComboBox.Trigger /></ComboBox.InputGroup><ComboBox.Popover><ListBox>{(item: (typeof items)[number]) => <ListBox.Item id={item.id} textValue={item.label}>{item.label}<ListBox.ItemIndicator /></ListBox.Item>}</ListBox></ComboBox.Popover></ComboBox>
    case "Autocomplete": return <Autocomplete><Label>自动补全</Label><Autocomplete.Trigger><Autocomplete.Value /><Autocomplete.ClearButton /><Autocomplete.Indicator /></Autocomplete.Trigger><Autocomplete.Popover><Autocomplete.Filter><SearchField aria-label="搜索"><SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder="搜索..." /></SearchField.Group></SearchField><Options /></Autocomplete.Filter></Autocomplete.Popover></Autocomplete>
    case "Checkbox": return <CheckboxGroup variant="secondary" defaultValue={["a"]}><Label>复选</Label><Checkbox value="a" variant="secondary"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>已选择</Checkbox.Content></Checkbox><Checkbox value="b" variant="secondary"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>未选择</Checkbox.Content></Checkbox><Checkbox value="c" variant="secondary" isDisabled><Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>禁用</Checkbox.Content></Checkbox></CheckboxGroup>
    case "Radio": return <RadioGroup variant="secondary" defaultValue="one"><Label>单选组</Label><Radio value="one"><Radio.Content><Radio.Control><Radio.Indicator /></Radio.Control>选项一</Radio.Content></Radio><Radio value="two"><Radio.Content><Radio.Control><Radio.Indicator /></Radio.Control>选项二</Radio.Content></Radio><Radio value="three" isDisabled><Radio.Content><Radio.Control><Radio.Indicator /></Radio.Control>禁用</Radio.Content></Radio></RadioGroup>
    case "Switch": return <div className="flex gap-4"><Switch defaultSelected aria-label="开"><Switch.Control><Switch.Thumb /></Switch.Control></Switch><Switch aria-label="关"><Switch.Control><Switch.Thumb /></Switch.Control></Switch><Switch isDisabled aria-label="禁用"><Switch.Control><Switch.Thumb /></Switch.Control></Switch><Switch size="sm" defaultSelected aria-label="小"><Switch.Control><Switch.Thumb /></Switch.Control></Switch></div>
    case "Slider": return <Slider defaultValue={[20, 70]} maxValue={100}><Label>范围</Label><Slider.Output /><Slider.Track>{({ state }) => <><Slider.Fill />{state.values.map((_, i) => <Slider.Thumb key={i} index={i} />)}</>}</Slider.Track></Slider>
    case "Rating": return <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={["1", "2", "3", "4"]} aria-label="评分">{["1", "2", "3", "4", "5"].map((v) => <ToggleButton key={v} id={v} isIconOnly aria-label={`${v} 星`}><Icon name="star" size={16} /></ToggleButton>)}</ToggleButtonGroup>
    case "DatePicker": return <DatePicker><Label>日期</Label><DateField.Group><DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input><DateField.Suffix><DatePicker.Trigger><DatePicker.TriggerIndicator /></DatePicker.Trigger></DateField.Suffix></DateField.Group><DatePicker.Popover><Calendar aria-label="日期"><CalendarBody /></Calendar></DatePicker.Popover></DatePicker>
    case "TimePicker": return <TimeField><Label>时间</Label><TimeField.Group><TimeField.Input>{(segment) => <TimeField.Segment segment={segment} />}</TimeField.Input></TimeField.Group></TimeField>
    case "DateRangePicker": return <DateRangePicker><Label>日期范围</Label><DateField.Group><DateField.InputContainer><DateField.Input slot="start">{(segment) => <DateField.Segment segment={segment} />}</DateField.Input><DateRangePicker.RangeSeparator /><DateField.Input slot="end">{(segment) => <DateField.Segment segment={segment} />}</DateField.Input></DateField.InputContainer><DateField.Suffix><DateRangePicker.Trigger><DateRangePicker.TriggerIndicator /></DateRangePicker.Trigger></DateField.Suffix></DateField.Group><DateRangePicker.Popover><RangeCalendar aria-label="范围"><RangeCalendar.Header><RangeCalendar.Heading /><RangeCalendar.NavButton slot="previous" /><RangeCalendar.NavButton slot="next" /></RangeCalendar.Header><RangeCalendar.Grid><RangeCalendar.GridHeader>{(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}</RangeCalendar.GridHeader><RangeCalendar.GridBody>{(date) => <RangeCalendar.Cell date={date} />}</RangeCalendar.GridBody></RangeCalendar.Grid></RangeCalendar></DateRangePicker.Popover></DateRangePicker>
    case "ColorPicker": return <ColorPicker defaultValue="#006fee"><ColorPicker.Trigger><ColorSwatch /><Label>选择颜色</Label></ColorPicker.Trigger><ColorPicker.Popover><ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness"><ColorArea.Thumb /></ColorArea><ColorSlider channel="hue" colorSpace="hsb"><ColorSlider.Track><ColorSlider.Thumb /></ColorSlider.Track></ColorSlider></ColorPicker.Popover></ColorPicker>
    case "Upload": return <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border p-6 text-sm text-muted hover:bg-surface-secondary"><Icon name="upload" /><span>拖拽或点击上传</span><input type="file" className="sr-only" /></label>
    case "Cascader": return <div className="flex gap-2"><Select defaultValue="one" aria-label="一级" className="flex-1"><Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger><Select.Popover><Options /></Select.Popover></Select><Select defaultValue="two" aria-label="二级" className="flex-1"><Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger><Select.Popover><Options /></Select.Popover></Select></div>
    case "Transfer": return <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"><ListBox aria-label="来源" selectionMode="multiple" className="rounded-lg border border-border p-1">{items.slice(0, 2).map((i) => <ListBox.Item key={i.id} id={i.id} textValue={i.label}>{i.label}<ListBox.ItemIndicator /></ListBox.Item>)}</ListBox><div className="grid gap-1"><Button isIconOnly size="sm" variant="secondary" aria-label="右移"><Icon name="chevron-right" size={14} /></Button><Button isIconOnly size="sm" variant="secondary" aria-label="左移"><Icon name="chevron-left" size={14} /></Button></div><ListBox aria-label="目标" selectionMode="multiple" className="rounded-lg border border-border p-1"><ListBox.Item id="three" textValue="选项三">选项三<ListBox.ItemIndicator /></ListBox.Item></ListBox></div>
    case "PinInput": return <InputOTP maxLength={4} aria-label="PIN"><InputOTP.Group>{[0, 1, 2, 3].map((i) => <InputOTP.Slot key={i} index={i} />)}</InputOTP.Group></InputOTP>
    case "Form": return <Form onSubmit={(e) => { e.preventDefault(); toast.success("表单已提交") }} className="space-y-3"><Fieldset><Fieldset.Legend>联系方式</Fieldset.Legend><Fieldset.Group><TextField name="email" type="email" isRequired><Label>邮箱</Label><Input placeholder="you@acme.dev" /><FieldError /></TextField></Fieldset.Group><Fieldset.Actions><Button type="submit" size="sm">提交</Button><Button type="reset" size="sm" variant="secondary">重置</Button></Fieldset.Actions></Fieldset></Form>
    case "Table": case "DataGrid": return <Table><Table.ScrollContainer><Table.Content aria-label={name} selectionMode={name === "DataGrid" ? "multiple" : "none"}><Table.Header><Table.Column isRowHeader allowsSorting>订单</Table.Column><Table.Column>客户</Table.Column><Table.Column>状态</Table.Column></Table.Header><Table.Body>{orders.slice(0, 3).map((o) => <Table.Row key={o.id} id={o.id}><Table.Cell>{o.id}</Table.Cell><Table.Cell>{o.customer}</Table.Cell><Table.Cell><StatusBadge value={o.status} /></Table.Cell></Table.Row>)}</Table.Body></Table.Content></Table.ScrollContainer></Table>
    case "Descriptions": return <dl className="grid grid-cols-2 gap-2 text-sm"><dt className="text-muted">负责人</dt><dd>{team[0].name}</dd><dt className="text-muted">角色</dt><dd>{team[0].role}</dd><dt className="text-muted">最近活跃</dt><dd>{team[0].lastActive}</dd></dl>
    case "List": return <ListBox aria-label="成员" selectionMode="single" defaultSelectedKeys={[team[0].email]}>{team.slice(0, 3).map((m) => <ListBox.Item key={m.email} id={m.email} textValue={m.name}><Label>{m.name}</Label><Description>{m.email}</Description><ListBox.ItemIndicator /></ListBox.Item>)}</ListBox>
    case "Card": return <Card variant="secondary"><Card.Header><Card.Title>卡片标题</Card.Title><Card.Description>Header / Content / Footer</Card.Description></Card.Header><Card.Content>HeroUI Card 组合结构。</Card.Content><Card.Footer><Button size="sm" variant="secondary">操作</Button></Card.Footer></Card>
    case "Avatar": return <div className="flex items-center gap-3"><Avatar size="sm"><Avatar.Fallback>林</Avatar.Fallback></Avatar><Avatar size="md"><Avatar.Fallback>王</Avatar.Fallback></Avatar><Avatar size="lg"><Avatar.Fallback>AC</Avatar.Fallback></Avatar><Badge.Anchor><Avatar><Avatar.Fallback>M</Avatar.Fallback></Avatar><Badge color="success" /></Badge.Anchor></div>
    case "AvatarGroup": return <div className="flex -space-x-2">{team.slice(0, 4).map((m) => <Avatar key={m.email} size="sm" className="ring-2 ring-background"><Avatar.Fallback>{m.name.slice(0, 1)}</Avatar.Fallback></Avatar>)}<Avatar size="sm" className="ring-2 ring-background"><Avatar.Fallback>+2</Avatar.Fallback></Avatar></div>
    case "Badge": return <div className="flex items-center gap-4"><Badge.Anchor><Button isIconOnly variant="secondary" aria-label="通知"><Icon name="bell" size={16} /></Button><Badge color="danger">5</Badge></Badge.Anchor><Badge.Anchor><Avatar><Avatar.Fallback>林</Avatar.Fallback></Avatar><Badge color="success" /></Badge.Anchor><Badge.Anchor><Avatar><Avatar.Fallback>王</Avatar.Fallback></Avatar><Badge color="accent" size="sm">new</Badge></Badge.Anchor></div>
    case "Tag": return <div className="space-y-2"><TagGroup aria-label="标签" selectionMode="multiple" defaultSelectedKeys={["a"]}><TagGroup.List><Tag id="a">默认</Tag><Tag id="b">可选</Tag><Tag id="c"><Tag.RemoveButton />可移除</Tag></TagGroup.List></TagGroup><div className="flex flex-wrap gap-2"><Chip>default</Chip><Chip color="accent">accent</Chip><Chip color="success">success</Chip><Chip color="warning">warning</Chip><Chip color="danger">danger</Chip><Chip variant="secondary">secondary</Chip><Chip variant="soft">soft</Chip><Chip size="sm">sm</Chip></div></div>
    case "Statistic": return <Card><Card.Header><Card.Description>本月收入</Card.Description><Card.Title className="text-2xl">¥{orders.reduce((s, o) => s + o.amount, 0).toLocaleString()}</Card.Title></Card.Header><Card.Content><Chip color="success" size="sm">+12.4%</Chip></Card.Content></Card>
    case "Timeline": return <ol className="relative space-y-4 border-l border-border pl-4 text-sm">{team.slice(0, 3).map((m) => <li key={m.email} className="relative"><span className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-accent" /><p className="font-medium">{m.name}</p><p className="text-xs text-muted">{m.lastActive}</p></li>)}</ol>
    case "Calendar": return <Calendar aria-label="日历"><CalendarBody /></Calendar>
    case "Image": return <figure className="overflow-hidden rounded-xl border border-border"><div className="aspect-video bg-[linear-gradient(135deg,var(--accent),var(--surface-secondary))]" /><figcaption className="p-2 text-xs text-muted">占位图（aspect-video + Tailwind）</figcaption></figure>
    case "Carousel": return <ScrollShadow orientation="horizontal" className="flex w-full max-w-full snap-x gap-3 overflow-x-auto">{[1, 2, 3, 4].map((i) => <Surface key={i} variant="secondary" className="w-40 shrink-0 snap-start rounded-xl p-4 text-sm">卡片 {i}</Surface>)}</ScrollShadow>
    case "Empty": return <EmptyState className="py-6"><div className="mx-auto grid size-10 place-items-center rounded-full bg-surface-secondary text-muted"><Icon name="inbox" size={18} /></div><p className="mt-3 font-medium">暂无数据</p><p className="text-xs text-muted">试试调整筛选条件。</p></EmptyState>
    case "Tooltip": return <div className="flex gap-2"><Tooltip><Button variant="secondary">悬停</Button><Tooltip.Content>提示内容</Tooltip.Content></Tooltip><Tooltip isOpen><Button variant="secondary">常开</Button><Tooltip.Content>始终显示</Tooltip.Content></Tooltip></div>
    case "Popover": return <Popover><Button variant="secondary">打开 Popover</Button><Popover.Content><Popover.Dialog><Popover.Heading>标题</Popover.Heading><p className="text-sm text-muted">Popover 内容。</p></Popover.Dialog></Popover.Content></Popover>
    case "Segmented": return <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={["week"]} aria-label="分段"><ToggleButton id="day">日</ToggleButton><ToggleButton id="week"><ToggleButtonGroup.Separator />周</ToggleButton><ToggleButton id="month"><ToggleButtonGroup.Separator />月</ToggleButton></ToggleButtonGroup>
    case "Alert": return <div className="grid gap-2">{(["default", "accent", "success", "warning", "danger"] as const).map((s) => <Alert key={s} status={s}><Alert.Indicator /><Alert.Content><Alert.Title>{s}</Alert.Title><Alert.Description>状态提示。</Alert.Description></Alert.Content></Alert>)}</div>
    case "Toast": return <div className="flex flex-wrap gap-2"><Button size="sm" onPress={() => toast("默认提示")}>default</Button><Button size="sm" variant="secondary" onPress={() => toast.success("操作成功")}>success</Button><Button size="sm" variant="secondary" onPress={() => toast.warning("注意")}>warning</Button><Button size="sm" variant="danger-soft" onPress={() => toast.danger("出错了")}>danger</Button></div>
    case "Notification": return <Button size="sm" variant="secondary" onPress={() => toast.info("新的订单已到达", { description: `${orders[0].customer} · ¥${orders[0].amount.toLocaleString()}` })}>发送通知（toast + description）</Button>
    case "Dialog": return <div className="flex flex-wrap gap-2"><Modal><Button variant="secondary">默认</Button><Modal.Backdrop><Modal.Container><Modal.Dialog><Modal.CloseTrigger /><Modal.Header><Modal.Heading>默认对话框</Modal.Heading></Modal.Header><Modal.Body>HeroUI Modal 内容。</Modal.Body><Modal.Footer><Button slot="close" variant="secondary">关闭</Button></Modal.Footer></Modal.Dialog></Modal.Container></Modal.Backdrop></Modal><Modal><Button variant="secondary">可滚动</Button><Modal.Backdrop><Modal.Container scroll="inside"><Modal.Dialog><Modal.Header><Modal.Heading>可滚动内容</Modal.Heading></Modal.Header><Modal.Body className="max-h-48 overflow-y-auto">{Array.from({ length: 8 }, (_, index) => <p key={index}>滚动内容 {index + 1}</p>)}</Modal.Body></Modal.Dialog></Modal.Container></Modal.Backdrop></Modal><Modal><Button variant="secondary">全屏</Button><Modal.Backdrop><Modal.Container size="full" className="h-screen w-screen max-w-none"><Modal.Dialog><Modal.CloseTrigger /><Modal.Header><Modal.Heading>全屏对话框</Modal.Heading></Modal.Header><Modal.Body>全屏内容</Modal.Body></Modal.Dialog></Modal.Container></Modal.Backdrop></Modal></div>
    case "Drawer": return <div className="flex flex-wrap gap-2">{(["left", "right", "top", "bottom"] as const).map((placement) => <Drawer key={placement}><Button variant="secondary">{placement} Drawer</Button><Drawer.Backdrop><Drawer.Content placement={placement}><Drawer.Dialog><Drawer.CloseTrigger /><Drawer.Header><Drawer.Heading>{placement} 抽屉</Drawer.Heading></Drawer.Header><Drawer.Body>HeroUI Drawer 内容。</Drawer.Body></Drawer.Dialog></Drawer.Content></Drawer.Backdrop></Drawer>)}</div>
    case "Progress": return <div className="space-y-4"><div className="space-y-3"><ProgressBar value={64} size="sm"><Label>小尺寸</Label><ProgressBar.Output /><ProgressBar.Track><ProgressBar.Fill /></ProgressBar.Track></ProgressBar><ProgressBar value={42} size="lg"><Label>确定进度</Label><ProgressBar.Output /><ProgressBar.Track><ProgressBar.Fill /></ProgressBar.Track></ProgressBar><ProgressBar isIndeterminate><Label>加载中</Label><ProgressBar.Track><ProgressBar.Fill /></ProgressBar.Track></ProgressBar></div><div className="flex items-center gap-4"><ProgressCircle value={64} aria-label="圆形进度"><ProgressCircle.Track><ProgressCircle.TrackCircle /><ProgressCircle.FillCircle /></ProgressCircle.Track></ProgressCircle><ol className="flex items-center gap-2 text-xs">{["信息", "配置", "确认"].map((s, i) => <li key={s} className="flex items-center gap-1"><span className="grid size-6 place-items-center rounded-full bg-accent text-accent-foreground">{i + 1}</span>{s}</li>)}</ol></div></div>
    case "Skeleton": return <div className="flex gap-3"><Skeleton className="size-10 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4 rounded-lg" /><Skeleton className="h-4 w-1/2 rounded-lg" /></div></div>
    case "Spinner": return <div className="flex items-center gap-4"><Spinner size="sm" /><Spinner /><Spinner size="lg" /><Spinner color="accent" /></div>
    case "Result": return <EmptyState className="py-6"><div className="mx-auto grid size-10 place-items-center rounded-full bg-success-soft text-success-soft-foreground"><Icon name="check" size={18} /></div><p className="mt-3 font-medium">提交成功</p><Button size="sm" className="mt-3">返回</Button></EmptyState>
    case "Popconfirm": return <Popover><Button variant="danger-soft" size="sm">删除</Button><Popover.Content><Popover.Dialog><Popover.Heading>确认删除？</Popover.Heading><div className="mt-3 flex gap-2"><Button slot="close" size="sm" variant="secondary">取消</Button><Button slot="close" size="sm" variant="danger">确认</Button></div></Popover.Dialog></Popover.Content></Popover>
    case "Menu": return <div className="space-y-3"><Menu aria-label="菜单" className="max-w-56 rounded-xl border border-border p-1"><Menu.Section><Menu.Item id="new"><Icon name="plus" size={16} /><Label>新建</Label></Menu.Item><Menu.Item id="copy"><Icon name="copy" size={16} /><Label>复制</Label></Menu.Item></Menu.Section><Menu.Section><Menu.Item id="delete" variant="danger"><Icon name="trash" size={16} /><Label>删除</Label></Menu.Item></Menu.Section></Menu><Menu aria-label="多选菜单" selectionMode="multiple" className="max-w-56 rounded-xl border border-border p-1"><Menu.Item id="a"><Label>选项一</Label><Menu.ItemIndicator /></Menu.Item><Menu.Item id="b"><Label>选项二</Label><Menu.ItemIndicator /></Menu.Item></Menu></div>
    case "Dropdown": return <Dropdown><Button variant="secondary">下拉菜单<Icon name="chevron-down" size={16} /></Button><Dropdown.Popover><Dropdown.Menu aria-label="操作"><Dropdown.Item id="edit"><Label>编辑</Label></Dropdown.Item><Dropdown.Item id="dup"><Label>复制</Label></Dropdown.Item><Dropdown.Item id="del"><Label>删除</Label></Dropdown.Item></Dropdown.Menu></Dropdown.Popover></Dropdown>
    case "Breadcrumb": return <Breadcrumbs><Breadcrumbs.Item href="#">首页</Breadcrumbs.Item><Breadcrumbs.Item href="#">订单</Breadcrumbs.Item><Breadcrumbs.Item>{orders[0].id}</Breadcrumbs.Item></Breadcrumbs>
    case "Tabs": return <div className="space-y-4"><Tabs variant="primary" defaultSelectedKey="a"><Tabs.ListContainer><Tabs.List aria-label="主选项"><Tabs.Tab id="a">概览<Tabs.Indicator /></Tabs.Tab><Tabs.Tab id="b">分析<Tabs.Indicator /></Tabs.Tab><Tabs.Tab id="c" isDisabled>禁用<Tabs.Indicator /></Tabs.Tab></Tabs.List></Tabs.ListContainer><Tabs.Panel id="a" className="text-sm text-muted">概览内容</Tabs.Panel><Tabs.Panel id="b" className="text-sm text-muted">分析内容</Tabs.Panel></Tabs><Tabs orientation="vertical" variant="secondary" defaultSelectedKey="a" className="min-h-20"><Tabs.ListContainer><Tabs.List aria-label="垂直选项"><Tabs.Tab id="a">概览<Tabs.Indicator /></Tabs.Tab><Tabs.Tab id="b">分析<Tabs.Indicator /></Tabs.Tab></Tabs.List></Tabs.ListContainer><Tabs.Panel id="a" className="text-sm text-muted">垂直内容</Tabs.Panel><Tabs.Panel id="b" className="text-sm text-muted">第二内容</Tabs.Panel></Tabs></div>
    case "Pagination": return <Pagination><Pagination.Content><Pagination.Item><Pagination.Previous><Pagination.PreviousIcon /></Pagination.Previous></Pagination.Item><Pagination.Item><Pagination.Link isActive>1</Pagination.Link></Pagination.Item><Pagination.Item><Pagination.Link>2</Pagination.Link></Pagination.Item><Pagination.Item><Pagination.Ellipsis /></Pagination.Item><Pagination.Item><Pagination.Link>9</Pagination.Link></Pagination.Item><Pagination.Item><Pagination.Next><Pagination.NextIcon /></Pagination.Next></Pagination.Item></Pagination.Content></Pagination>
    case "Steps": return <ol className="flex items-center gap-2 text-xs">{["信息", "配置", "确认"].map((s, i) => <li key={s} className="flex items-center gap-2"><span className={`grid size-6 place-items-center rounded-full ${i === 0 ? "bg-accent text-accent-foreground" : "bg-surface-secondary text-muted"}`}>{i + 1}</span><span>{s}</span>{i < 2 ? <Separator className="w-6" /> : null}</li>)}</ol>
    case "Anchor": return <nav className="space-y-1 border-l border-border pl-3 text-sm"><Link href="#component-Button" className="block">Button</Link><Link href="#component-Table" className="block text-muted">Table</Link><Link href="#component-Tabs" className="block text-muted">Tabs</Link></nav>
    case "BackTop": return <Button isIconOnly variant="secondary" aria-label="回到顶部" onPress={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Icon name="arrow-up" size={16} /></Button>
    case "Affix": return <div className="h-24 overflow-y-auto rounded-lg border border-border"><div className="sticky top-0 border-b border-border bg-surface px-3 py-1 text-xs">sticky 头部</div><div className="h-48 p-3 text-xs text-muted">滚动查看固定效果</div></div>
    case "Navbar": return <Surface variant="secondary" className="flex items-center justify-between rounded-xl px-3 py-2 text-sm"><span className="font-semibold">Acme</span><div className="hidden gap-3 sm:flex"><Link href="#">功能</Link><Link href="#">定价</Link></div><Button size="sm">登录</Button></Surface>
    case "Sidebar": return <Surface variant="secondary" className="w-44 rounded-xl p-2"><ListBox aria-label="侧边栏" selectionMode="single" defaultSelectedKeys={["orders"]}><ListBox.Item id="dashboard" textValue="仪表盘"><Icon name="layout-dashboard" size={16} /><Label>仪表盘</Label></ListBox.Item><ListBox.Item id="orders" textValue="订单"><Icon name="shopping-cart" size={16} /><Label>订单</Label></ListBox.Item></ListBox></Surface>
    case "CommandPalette": return <Modal><Button variant="secondary" className="w-full justify-between"><span className="text-muted">搜索命令...</span><Kbd><Kbd.Abbr keyValue="command" />K</Kbd></Button><Modal.Backdrop><Modal.Container><Modal.Dialog><Modal.Body className="p-2"><Autocomplete aria-label="命令"><Autocomplete.Trigger><Autocomplete.Value /><Autocomplete.Indicator /></Autocomplete.Trigger><Autocomplete.Popover><Autocomplete.Filter><SearchField aria-label="搜索命令" autoFocus><SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder="输入命令..." /></SearchField.Group></SearchField><Options /></Autocomplete.Filter></Autocomplete.Popover></Autocomplete></Modal.Body></Modal.Dialog></Modal.Container></Modal.Backdrop></Modal>
    case "Grid": return <div className="grid grid-cols-3 gap-2">{[1, 2, 3, 4, 5, 6].map((i) => <Surface key={i} variant="secondary" className="rounded-lg p-3 text-center text-xs">{i}</Surface>)}</div>
    case "Stack": return <div className="flex flex-col gap-2">{[1, 2, 3].map((i) => <Surface key={i} variant="secondary" className="rounded-lg p-2 text-xs">Stack {i}</Surface>)}</div>
    case "Layout": return <div className="grid grid-cols-[56px_1fr] grid-rows-[28px_1fr] gap-1 text-[10px]"><Surface variant="secondary" className="col-span-2 rounded p-1">Header</Surface><Surface variant="tertiary" className="rounded p-1">Side</Surface><Surface className="rounded border border-border p-1">Content</Surface></div>
    case "Container": return <Surface variant="secondary" className="rounded-lg p-2"><div className="mx-auto max-w-xs rounded bg-surface p-2 text-center text-xs">max-w-xs mx-auto</div></Surface>
    case "AspectRatio": return <div className="aspect-video rounded-lg bg-surface-secondary" />
    case "ScrollArea": return <ScrollShadow className="h-24 rounded-lg border border-border p-3 text-sm">{team.map((m) => <p key={m.email}>{m.name} · {m.email}</p>)}</ScrollShadow>
    case "Accordion": return <Accordion defaultExpandedKeys={["a"]}><Accordion.Item id="a"><Accordion.Heading><Accordion.Trigger>第一项<Accordion.Indicator /></Accordion.Trigger></Accordion.Heading><Accordion.Panel><Accordion.Body>展开内容。</Accordion.Body></Accordion.Panel></Accordion.Item><Accordion.Item id="b"><Accordion.Heading><Accordion.Trigger>第二项<Accordion.Indicator /></Accordion.Trigger></Accordion.Heading><Accordion.Panel><Accordion.Body>更多内容。</Accordion.Body></Accordion.Panel></Accordion.Item></Accordion>
    case "ThemeProvider": return <div className="flex gap-2"><div className="light rounded-lg border border-border bg-background p-3 text-xs text-foreground">.light 作用域</div><div className="dark rounded-lg border border-border bg-background p-3 text-xs text-foreground">.dark 作用域</div></div>
    case "FloatButton": return <div className="relative h-20 rounded-lg border border-dashed border-border"><Button isIconOnly className="absolute bottom-2 right-2 rounded-full shadow-lg" aria-label="悬浮按钮"><Icon name="plus" size={16} /></Button></div>
    case "Kbd": return <div className="flex gap-2"><Kbd><Kbd.Abbr keyValue="command" />K</Kbd><Kbd><Kbd.Abbr keyValue="shift" />Enter</Kbd><Kbd>Esc</Kbd></div>
    case "Code": return <code className="rounded-md bg-surface-secondary px-2 py-1 font-mono text-xs">pnpm add @heroui/react</code>
    case "Divider": return <div className="space-y-2 text-sm"><p>上方</p><Separator /><div className="flex h-5 items-center gap-2"><span>左</span><Separator orientation="vertical" /><span>右</span></div></div>
    case "Link": return <div className="flex flex-wrap gap-3 text-sm"><Link href="#">默认链接</Link><Link href="#" isDisabled>禁用</Link><Link href="https://example.com" target="_blank">外部 <Icon name="external-link" size={14} /></Link></div>
    default: return <EmptyState className="py-4"><Icon name="archive" className="mx-auto text-muted" /><p className="mt-2 text-sm font-medium">HeroUI 无此组件</p><p className="text-xs text-muted">该 contract 项目已明确标记为 missing。</p></EmptyState>
  }
}

function NativeDemo({ name }: { name: string }) {
  switch (name) {
    case "Chip": return <div className="flex flex-wrap gap-2"><Chip>默认</Chip><Chip variant="secondary">secondary</Chip></div>
    case "CheckboxGroup": return <CheckboxGroup variant="secondary" defaultValue={["one"]}><Label>选择项</Label><Checkbox value="one" variant="secondary"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control><Label>选项一</Label></Checkbox.Content></Checkbox><Checkbox value="two" variant="secondary"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control><Label>选项二</Label></Checkbox.Content></Checkbox></CheckboxGroup>
    case "SwitchGroup": return <SwitchGroup><Label>通知</Label><Switch defaultSelected aria-label="邮件"><Switch.Control><Switch.Thumb /></Switch.Control></Switch><Switch aria-label="推送"><Switch.Control><Switch.Thumb /></Switch.Control></Switch></SwitchGroup>
    case "TagGroup": return <TagGroup aria-label="标签"><TagGroup.List><Tag id="one" textValue="标签一">标签一<Tag.RemoveButton /></Tag><Tag id="two" textValue="标签二">标签二<Tag.RemoveButton /></Tag></TagGroup.List></TagGroup>
    case "Toolbar": return <Toolbar aria-label="格式" className="flex flex-wrap gap-1 rounded-xl border border-border p-1"><ToggleButton id="bold" aria-label="加粗"><Icon name="bold" size={16} /></ToggleButton><ToggleButton id="italic" aria-label="斜体"><Icon name="italic" size={16} /></ToggleButton><CloseButton aria-label="关闭" /></Toolbar>
    case "Disclosure": return <Disclosure><Disclosure.Heading><Disclosure.Trigger>Disclosure 折叠<Disclosure.Indicator /></Disclosure.Trigger></Disclosure.Heading><Disclosure.Content>单项折叠内容。</Disclosure.Content></Disclosure>
    case "DisclosureGroup": return <DisclosureGroup><Disclosure><Disclosure.Heading><Disclosure.Trigger>第一项<Disclosure.Indicator /></Disclosure.Trigger></Disclosure.Heading><Disclosure.Content>第一项内容。</Disclosure.Content></Disclosure><Disclosure><Disclosure.Heading><Disclosure.Trigger>第二项<Disclosure.Indicator /></Disclosure.Trigger></Disclosure.Heading><Disclosure.Content>第二项内容。</Disclosure.Content></Disclosure></DisclosureGroup>
    case "Meter": return <Meter value={64}><Label>存储</Label><Meter.Output /><Meter.Track><Meter.Fill /></Meter.Track></Meter>
    case "ProgressCircle": return <div className="flex gap-3"><ProgressCircle value={40} size="sm" aria-label="小进度"><ProgressCircle.Track><ProgressCircle.TrackCircle /><ProgressCircle.FillCircle /></ProgressCircle.Track></ProgressCircle><ProgressCircle value={80} aria-label="大进度"><ProgressCircle.Track><ProgressCircle.TrackCircle /><ProgressCircle.FillCircle /></ProgressCircle.Track></ProgressCircle></div>
    case "RangeCalendar": return <RangeCalendar aria-label="日期范围"><CalendarBody /></RangeCalendar>
    case "SearchField": return <SearchField aria-label="搜索"><SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder="输入搜索词" /><SearchField.ClearButton /></SearchField.Group></SearchField>
    case "Surface": return <div className="flex gap-2"><Surface variant="secondary" className="rounded-lg p-3 text-sm">secondary</Surface><Surface variant="tertiary" className="rounded-lg p-3 text-sm">tertiary</Surface></div>
    case "ScrollShadow": return <ScrollShadow className="h-20 rounded-lg border border-border p-3 text-sm">{team.map((member) => <p key={member.email}>{member.name}</p>)}</ScrollShadow>
    case "CloseButton": return <CloseButton aria-label="关闭" />
    case "Fieldset": return <Fieldset><Fieldset.Legend>联系信息</Fieldset.Legend><TextField><Label>邮箱</Label><Input placeholder="邮箱" /></TextField></Fieldset>
    case "InputGroup": return <InputGroup><InputGroup.Prefix>https://</InputGroup.Prefix><InputGroup.Input placeholder="地址" /><InputGroup.Suffix>.dev</InputGroup.Suffix></InputGroup>
    case "ColorArea": return <ColorArea defaultValue="#006fee" colorSpace="hsb" xChannel="saturation" yChannel="brightness" className="h-24 w-40"><ColorArea.Thumb /></ColorArea>
    case "ColorSlider": return <ColorSlider defaultValue="#006fee" channel="hue" colorSpace="hsb"><ColorSlider.Track><ColorSlider.Thumb /></ColorSlider.Track></ColorSlider>
    case "ColorSwatch": return <div className="flex gap-2"><ColorSwatch color="#006fee" /><ColorSwatch color="#17c964" /><ColorSwatch color="#f31260" /></div>
    case "ColorSwatchPicker": return <ColorSwatchPicker aria-label="颜色" defaultValue="#006fee" className="flex gap-2"><ColorSwatchPicker.Item color="#006fee"><ColorSwatchPicker.Swatch /><ColorSwatchPicker.Indicator>✓</ColorSwatchPicker.Indicator></ColorSwatchPicker.Item><ColorSwatchPicker.Item color="#17c964"><ColorSwatchPicker.Swatch /><ColorSwatchPicker.Indicator>✓</ColorSwatchPicker.Indicator></ColorSwatchPicker.Item><ColorSwatchPicker.Item color="#f31260"><ColorSwatchPicker.Swatch /><ColorSwatchPicker.Indicator>✓</ColorSwatchPicker.Indicator></ColorSwatchPicker.Item></ColorSwatchPicker>
    case "ColorField": return <ColorField aria-label="颜色"><ColorField.Group><ColorField.Input /></ColorField.Group></ColorField>
    case "CalendarYearPicker": return <Calendar aria-label="年份"><Calendar.Header><CalendarYearPicker.Trigger><CalendarYearPicker.TriggerHeading /><CalendarYearPicker.TriggerIndicator /></CalendarYearPicker.Trigger></Calendar.Header><CalendarYearPicker.Grid><CalendarYearPicker.GridBody>{({ year, formattedYear }) => <CalendarYearPicker.Cell year={year}>{formattedYear}</CalendarYearPicker.Cell>}</CalendarYearPicker.GridBody></CalendarYearPicker.Grid></Calendar>
    case "AlertDialog": return <AlertDialog><Button variant="danger-soft">打开确认框</Button><AlertDialog.Backdrop><AlertDialog.Container><AlertDialog.Dialog><AlertDialog.Header><AlertDialog.Icon status="danger" /><AlertDialog.Heading>确认操作</AlertDialog.Heading></AlertDialog.Header><AlertDialog.Body>此操作需要确认。</AlertDialog.Body><AlertDialog.Footer><Button slot="close" variant="secondary">取消</Button><Button slot="close" variant="danger">确认</Button></AlertDialog.Footer></AlertDialog.Dialog></AlertDialog.Container></AlertDialog.Backdrop></AlertDialog>
    case "ListBox": return <ListBox aria-label="列表" selectionMode="single" defaultSelectedKeys={["one"]}><ListBox.Item id="one" textValue="选项一">选项一<ListBox.ItemIndicator /></ListBox.Item><ListBox.Item id="two" textValue="选项二">选项二<ListBox.ItemIndicator /></ListBox.Item></ListBox>
    case "ToggleButton": return <div className="flex gap-2"><ToggleButton id="one">未选中</ToggleButton><ToggleButton id="two" isSelected>已选中</ToggleButton></div>
    case "ToggleButtonGroup": return <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={["one"]} aria-label="多选"><ToggleButton id="one">选项一</ToggleButton><ToggleButton id="two">选项二</ToggleButton></ToggleButtonGroup>
    case "Header": return <Header className="text-sm font-semibold">分组标题</Header>
    case "Description": return <Description>辅助说明文本。</Description>
    case "ErrorMessage": return <ErrorMessage>错误提示文本。</ErrorMessage>
    case "FieldError": return <FieldError>字段错误文本。</FieldError>
    default: return <EmptyState className="py-3"><p className="text-sm">未提供示例</p></EmptyState>
  }
}

function NativeExtras() {
  return (
    <Card>
      <Card.Header><Card.Title>HeroUI 独有组件</Card.Title><Card.Description>contract 之外、HeroUI v3 直接导出的组件。</Card.Description></Card.Header>
      <Card.Content className="grid min-w-0 gap-4 md:grid-cols-2">
        {nativeExtras.map((name) => <Card key={name} className="min-w-0"><Card.Header><Card.Title className="text-sm">{name}</Card.Title><Card.Description>{nativeNotes[name]}</Card.Description></Card.Header><Card.Content className="min-w-0 overflow-x-auto"><NativeDemo name={name} /></Card.Content></Card>)}
      </Card.Content>
    </Card>
  )
}

export function ComponentsPage() {
  const names = contract.components as string[]
  const counts = { implemented: 0, composed: 0, missing: 0 }
  names.forEach((n) => { counts[coverage[n]] += 1 })
  return (
    <div className="space-y-8">
      <PageHeader title="组件全集" description={`HeroUI v3 原生组件、contract 覆盖与组合示例 · implemented ${counts.implemented} / composed ${counts.composed} / missing ${counts.missing}`} action={<Button variant="secondary" onPress={() => document.getElementById("component-index")?.scrollIntoView({ behavior: "smooth" })}>组件索引</Button>} />
      <div id="component-index" className="flex flex-wrap gap-2">{names.map((name) => <a key={name} href={`#component-${name}`} className="rounded-full border border-border px-3 py-1 text-xs no-underline hover:bg-surface-secondary">{name}</a>)}</div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[repeat(2,minmax(0,1fr))] xl:grid-cols-[repeat(3,minmax(0,1fr))]">
        {names.map((name) => (
          <Card key={name} id={`component-${name}`} className="min-w-0 scroll-mt-20">
            <Card.Header>
              <div className="flex items-center justify-between gap-2"><Card.Title className="text-base">{name}</Card.Title><Chip size="sm" color={coverage[name] === "missing" ? "danger" : coverage[name] === "composed" ? "warning" : "success"}>{coverage[name]}</Chip></div>
              <Card.Description>{variantNotes[name] ?? (coverage[name] === "missing" ? "HeroUI 未提供，标记为 missing" : `由 ${name} 组合实现`)}</Card.Description>
            </Card.Header>
            <Card.Content className="min-w-0 max-w-full overflow-x-auto"><Demo name={name} /></Card.Content>
          </Card>
        ))}
      </div>
      <NativeExtras />
    </div>
  )
}
