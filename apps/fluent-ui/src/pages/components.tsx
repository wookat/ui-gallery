import { useEffect, useRef, useState, type ReactNode } from "react"
import orders from "@ui-gallery/spec/mock/orders.json"
import team from "@ui-gallery/spec/mock/team.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import nav from "@ui-gallery/spec/mock/nav.json"
import landing from "@ui-gallery/spec/mock/landing.json"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AlphaSlider,
  Avatar,
  AvatarGroup,
  AvatarGroupItem,
  AvatarGroupPopover,
  Badge,
  Body1,
  Body1Strong,
  Body2,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  Caption1,
  Caption2,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  Carousel,
  CarouselCard,
  CarouselNav,
  CarouselNavButton,
  CarouselNavContainer,
  CarouselSlider,
  Checkbox,
  ColorArea,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  Combobox,
  CompoundButton,
  CounterBadge,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Display,
  Divider,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Dropdown,
  Field,
  FluentProvider,
  Image,
  InfoLabel,
  InlineDrawer,
  Input,
  InteractionTag,
  InteractionTagPrimary,
  InteractionTagSecondary,
  Label,
  LargeTitle,
  Link,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuGroupHeader,
  MenuItem,
  MenuItemCheckbox,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
  NavSectionHeader,
  Option,
  OverlayDrawer,
  Persona,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  PresenceBadge,
  ProgressBar,
  Radio,
  RadioGroup,
  Rating,
  RatingDisplay,
  SearchBox,
  Select,
  Skeleton,
  SkeletonItem,
  Slider,
  SpinButton,
  Spinner,
  SplitButton,
  Subtitle1,
  Subtitle2,
  SwatchPicker,
  Switch,
  Tab,
  TabList,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Tag,
  TagGroup,
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  TeachingPopover,
  TeachingPopoverBody,
  TeachingPopoverFooter,
  TeachingPopoverHeader,
  TeachingPopoverSurface,
  TeachingPopoverTitle,
  TeachingPopoverTrigger,
  Text,
  Textarea,
  Title1,
  Title2,
  Title3,
  Toast,
  ToastBody,
  ToastTitle,
  ToggleButton,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarRadioButton,
  ToolbarRadioGroup,
  ToolbarToggleButton,
  Tooltip,
  Tree,
  TreeItem,
  TreeItemLayout,
  createTableColumn,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
  useToastController,
  webDarkTheme,
  webLightTheme,
  type TableColumnDefinition,
} from "@fluentui/react-components"
import { Calendar } from "@fluentui/react-calendar-compat"
import { DatePicker } from "@fluentui/react-datepicker-compat"
import { TimePicker } from "@fluentui/react-timepicker-compat"
import { coverage, type CoverageStatus } from "@/coverage"
import { Icon } from "@/lib/icon"
import { Money, PageHeader, StatusBadge, useLayoutStyles } from "./shared"

type Order = (typeof orders)[number]

const useStyles = makeStyles({
  layout: { display: "grid", gap: tokens.spacingHorizontalL, gridTemplateColumns: "minmax(0, 1fr) 200px", "@media (max-width: 1023px)": { gridTemplateColumns: "minmax(0, 1fr)" } },
  toc: { position: "sticky", top: "72px", alignSelf: "start", maxHeight: "calc(100vh - 90px)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px", paddingLeft: tokens.spacingHorizontalS, borderLeft: `2px solid ${tokens.colorNeutralStroke2}`, "@media (max-width: 1023px)": { display: "none" } },
  tocLink: { fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3, textDecoration: "none", padding: "2px 0", ":hover": { color: tokens.colorBrandForeground1 } },
  demo: { scrollMarginTop: "80px", display: "flex", flexDirection: "column", gap: tokens.spacingVerticalM, padding: tokens.spacingHorizontalL, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusLarge, backgroundColor: tokens.colorNeutralBackground1, minWidth: 0 },
  demoHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.spacingHorizontalS, flexWrap: "wrap" },
  row: { display: "flex", alignItems: "center", gap: tokens.spacingHorizontalS, flexWrap: "wrap", minWidth: 0 },
  col: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalS, minWidth: 0 },
  swatch: { width: "56px", height: "56px", borderRadius: tokens.borderRadiusMedium, border: `1px solid ${tokens.colorNeutralStroke1}` },
  kbd: { display: "inline-block", padding: "1px 6px", fontFamily: tokens.fontFamilyMonospace, fontSize: tokens.fontSizeBase200, border: `1px solid ${tokens.colorNeutralStroke1}`, borderBottomWidth: "2px", borderRadius: tokens.borderRadiusSmall, backgroundColor: tokens.colorNeutralBackground3 },
  code: { fontFamily: tokens.fontFamilyMonospace, fontSize: tokens.fontSizeBase200, padding: "1px 6px", borderRadius: tokens.borderRadiusSmall, backgroundColor: tokens.colorNeutralBackground3 },
  pre: { fontFamily: tokens.fontFamilyMonospace, fontSize: tokens.fontSizeBase200, padding: tokens.spacingHorizontalM, borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackgroundInverted, color: tokens.colorNeutralForegroundInverted, overflowX: "auto", margin: 0 },
  desc: { display: "grid", gridTemplateColumns: "auto 1fr", gap: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalL}`, alignItems: "baseline" },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", gap: tokens.spacingVerticalS, padding: tokens.spacingVerticalXL, color: tokens.colorNeutralForeground3, textAlign: "center", border: `1px dashed ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium },
  gridDemo: { display: "grid", gap: tokens.spacingHorizontalS, gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))" },
  cell: { padding: tokens.spacingVerticalS, textAlign: "center", borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorBrandBackground2, color: tokens.colorBrandForeground2, fontSize: tokens.fontSizeBase200 },
  aspect: { aspectRatio: "16 / 9", width: "100%", maxWidth: "320px", borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground3, display: "grid", placeItems: "center", color: tokens.colorNeutralForeground3 },
  scroll: { maxHeight: "160px", overflowY: "auto", border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, padding: tokens.spacingHorizontalS },
  timeline: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalS, position: "relative", paddingLeft: "20px", "::before": { content: '""', position: "absolute", left: "5px", top: "6px", bottom: "6px", width: "2px", backgroundColor: tokens.colorNeutralStroke2 } },
  tItem: { position: "relative", "::before": { content: '""', position: "absolute", left: "-19px", top: "6px", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: tokens.colorBrandBackground } },
  steps: { display: "flex", alignItems: "center", gap: tokens.spacingHorizontalS, flexWrap: "wrap" },
  stepDot: { width: "24px", height: "24px", borderRadius: "50%", display: "grid", placeItems: "center", fontSize: tokens.fontSizeBase200, border: `1px solid ${tokens.colorNeutralStroke1}` },
  stepDone: { backgroundColor: tokens.colorBrandBackground, color: tokens.colorNeutralForegroundOnBrand, ...shorthands.borderColor(tokens.colorBrandBackground) },
  float: { position: "fixed", right: "20px", bottom: "20px", zIndex: 5, display: "flex", flexDirection: "column", gap: tokens.spacingVerticalS },
  carouselCard: { height: "120px", display: "grid", placeItems: "center", borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorBrandBackground2, color: tokens.colorBrandForeground2, margin: `0 ${tokens.spacingHorizontalXS}` },
  pin: { width: "40px", textAlign: "center", minWidth: "40px" },
  themeBox: { padding: tokens.spacingHorizontalM, borderRadius: tokens.borderRadiusMedium, display: "flex", gap: tokens.spacingHorizontalS, alignItems: "center", flexWrap: "wrap" },
  watermark: { position: "relative", minHeight: "120px", border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, display: "grid", placeItems: "center", overflow: "hidden" },
})

const statusColor: Record<CoverageStatus, "success" | "warning" | "danger"> = { implemented: "success", composed: "warning", missing: "danger" }
const statusLabel: Record<CoverageStatus, string> = { implemented: "原生", composed: "组合", missing: "缺失" }

function Demo({ name, note, children }: { name: string; note?: string; children?: ReactNode }) {
  const s = useStyles()
  const status = coverage[name]
  return (
    <section id={name} className={s.demo}>
      <div className={s.demoHead}>
        <div className={s.row}><Subtitle2 as="h2">{name}</Subtitle2><Badge appearance="tint" color={statusColor[status]} size="small">{statusLabel[status]}</Badge></div>
        {note ? <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>{note}</Caption1> : null}
      </div>
      {children}
    </section>
  )
}

const missingNote: Record<string, string> = {
  Cascader: "Fluent UI v9 无级联选择器；可用嵌套 Menu 或多个 Dropdown 组合，此处标为缺失。",
  Transfer: "Fluent UI v9 未提供穿梭框组件。",
  Mention: "Fluent UI v9 未提供 @ 提及输入组件。",
  QRCode: "Fluent UI v9 未提供二维码组件，需引入第三方库。",
  Resizable: "Fluent UI v9 未提供可拖拽分栏组件。",
  Watermark: "Fluent UI v9 未提供水印组件。",
}

function Missing({ name }: { name: string }) {
  const s = useStyles()
  return (
    <Demo name={name} note="未在 @fluentui/react-components 中导出">
      <div className={s.empty}><Icon name="alert-circle" size={24} /><Caption1>{missingNote[name]}</Caption1></div>
    </Demo>
  )
}

const sizes = ["small", "medium", "large"] as const
const appearances = ["primary", "secondary", "outline", "subtle", "transparent"] as const
const columns: TableColumnDefinition<Order>[] = [
  createTableColumn<Order>({ columnId: "id", compare: (a, b) => a.id.localeCompare(b.id), renderHeaderCell: () => "订单", renderCell: (o) => o.id }),
  createTableColumn<Order>({ columnId: "customer", compare: (a, b) => a.customer.localeCompare(b.customer), renderHeaderCell: () => "客户", renderCell: (o) => <TableCellLayout media={<Avatar name={o.customer} size={24} color="colorful" />}>{o.customer}</TableCellLayout> }),
  createTableColumn<Order>({ columnId: "status", compare: (a, b) => a.status.localeCompare(b.status), renderHeaderCell: () => "状态", renderCell: (o) => <StatusBadge value={o.status} /> }),
  createTableColumn<Order>({ columnId: "amount", compare: (a, b) => a.amount - b.amount, renderHeaderCell: () => "金额", renderCell: (o) => <Money value={o.amount} /> }),
]

export function ComponentsPage() {
  const s = useStyles()
  const l = useLayoutStyles()
  const { dispatchToast } = useToastController("acme-toaster")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [inlineOpen, setInlineOpen] = useState(true)
  const [color, setColor] = useState({ h: 210, s: 0.9, v: 0.75, a: 1 })
  const [pin, setPin] = useState(["", "", "", "", "", ""])
  const [tags, setTags] = useState<string[]>([team[0].name, team[1].name])
  const [page, setPage] = useState(2)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])
  const names = Object.keys(coverage)
  const counts = names.reduce((acc, n) => ({ ...acc, [coverage[n]]: (acc[coverage[n]] ?? 0) + 1 }), {} as Record<CoverageStatus, number>)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const hsvToCss = ({ h, s: sat, v, a }: { h: number; s: number; v: number; a?: number }) => {
    const f = (n: number) => { const k = (n + h / 60) % 6; return v - v * sat * Math.max(0, Math.min(k, 4 - k, 1)) }
    return `rgba(${Math.round(f(5) * 255)}, ${Math.round(f(3) * 255)}, ${Math.round(f(1) * 255)}, ${a ?? 1})`
  }

  return (
    <div className={l.stack}>
      <PageHeader title="组件总览" description={`contract.json 中 ${names.length} 个组件：${counts.implemented ?? 0} 原生 · ${counts.composed ?? 0} 组合 · ${counts.missing ?? 0} 缺失。`} />
      <div className={s.layout}>
        <div className={l.stack}>
          <Demo name="Typography" note="Fluent 排版预设">
            <Display>Display</Display><LargeTitle>LargeTitle</LargeTitle><Title1>Title1</Title1><Title2>Title2</Title2><Title3>Title3</Title3><Subtitle1>Subtitle1</Subtitle1><Subtitle2>Subtitle2</Subtitle2>
            <Body2>Body2 · {landing.hero.subtitle}</Body2><Body1>Body1 · {landing.hero.subtitle}</Body1><Body1Strong>Body1Strong</Body1Strong><Caption1>Caption1</Caption1><Caption2>Caption2</Caption2>
            <div className={s.row}><Text italic>italic</Text><Text underline>underline</Text><Text strikethrough>strikethrough</Text><Text font="monospace">monospace</Text><Text truncate wrap={false} style={{ maxWidth: 120 }}>truncate 很长的一段文本会被截断</Text></div>
          </Demo>

          <Demo name="Button">
            {sizes.map((size) => (
              <div className={s.row} key={size}>
                {appearances.map((a) => <Button key={a} size={size} appearance={a}>{a}</Button>)}
                <Button size={size} disabled>disabled</Button>
                <Button size={size} appearance="primary" disabledFocusable icon={<Spinner size="tiny" />}>loading</Button>
              </div>
            ))}
            <div className={s.row}><Button shape="circular">circular</Button><Button shape="square">square</Button><Button icon={<Icon name="plus" />}>带图标</Button><Button icon={<Icon name="arrow-right" />} iconPosition="after">图标在后</Button><ToggleButton defaultChecked icon={<Icon name="star" />}>Toggle</ToggleButton><CompoundButton secondaryContent="次要说明" icon={<Icon name="mail" />}>Compound</CompoundButton></div>
          </Demo>

          <Demo name="ButtonGroup" note="Toolbar / SplitButton 组合">
            <Toolbar aria-label="按钮组">
              <ToolbarButton icon={<Icon name="arrow-left" />}>上一步</ToolbarButton>
              <ToolbarButton icon={<Icon name="arrow-right" />}>下一步</ToolbarButton>
              <ToolbarDivider />
              <ToolbarToggleButton name="bold" value="bold" icon={<Icon name="star" />} aria-label="收藏" />
            </Toolbar>
            <div className={s.row}>
              <Menu positioning="below-end">
                <MenuTrigger disableButtonEnhancement>{(triggerProps) => <SplitButton menuButton={triggerProps} primaryActionButton={{ onClick: () => dispatchToast(<Toast><ToastTitle>主操作</ToastTitle></Toast>) }}>SplitButton</SplitButton>}</MenuTrigger>
                <MenuPopover><MenuList><MenuItem>选项 A</MenuItem><MenuItem>选项 B</MenuItem></MenuList></MenuPopover>
              </Menu>
            </div>
          </Demo>

          <Demo name="IconButton">
            <div className={s.row}>{sizes.map((size) => appearances.map((a) => <Button key={`${size}-${a}`} size={size} appearance={a} icon={<Icon name="settings" />} aria-label={`${a} ${size}`} />))}<Button icon={<Icon name="settings" />} disabled aria-label="禁用" /><Button icon={<Icon name="settings" />} shape="circular" aria-label="圆形" /></div>
          </Demo>

          <Demo name="Input">
            <div className={l.grid3}>
              {sizes.map((size) => <Field key={size} label={`size=${size}`}><Input size={size} placeholder="占位文本" /></Field>)}
              {(["outline", "underline", "filled-darker", "filled-lighter"] as const).map((a) => <Field key={a} label={a}><Input appearance={a} defaultValue={a} /></Field>)}
              <Field label="带图标"><Input contentBefore={<Icon name="search" size={16} />} contentAfter={<Text size={200}>.com</Text>} placeholder="搜索" /></Field>
              <Field label="禁用"><Input disabled value="不可编辑" /></Field>
              <Field label="错误" validationMessage="格式不正确"><Input defaultValue="abc" /></Field>
              <Field label="成功" validationState="success" validationMessage="可用"><Input defaultValue="acme" /></Field>
              <Field label="警告" validationState="warning" validationMessage="即将过期"><Input defaultValue="token" /></Field>
              <Field label="只读"><Input readOnly value="readonly" /></Field>
            </div>
          </Demo>

          <Demo name="Textarea">
            <div className={l.grid3}>
              {sizes.map((size) => <Field key={size} label={`size=${size}`}><Textarea size={size} placeholder="多行文本" /></Field>)}
              <Field label="filled-darker"><Textarea appearance="filled-darker" resize="vertical" /></Field>
              <Field label="禁用"><Textarea disabled value="disabled" /></Field>
              <Field label="错误" validationMessage="不能为空"><Textarea /></Field>
            </div>
          </Demo>

          <Demo name="NumberInput" note="SpinButton">
            <div className={l.grid3}>
              {sizes.filter((x) => x !== "large").map((size) => <Field key={size} label={`size=${size}`}><SpinButton size={size} defaultValue={10} min={0} max={100} step={5} /></Field>)}
              <Field label="禁用"><SpinButton disabled defaultValue={3} /></Field>
              <Field label="displayValue"><SpinButton defaultValue={99} displayValue="¥99" /></Field>
            </div>
          </Demo>

          <Demo name="Select" note="原生 Select 与 Dropdown">
            <div className={l.grid3}>
              {sizes.map((size) => <Field key={size} label={`Select ${size}`}><Select size={size}><option>Web</option><option>iOS</option><option>Android</option></Select></Field>)}
              {sizes.map((size) => <Field key={size} label={`Dropdown ${size}`}><Dropdown size={size} placeholder="选择渠道">{["web", "ios", "android", "api"].map((c) => <Option key={c}>{c}</Option>)}</Dropdown></Field>)}
              <Field label="禁用"><Dropdown disabled placeholder="disabled" /></Field>
              <Field label="underline"><Dropdown appearance="underline" placeholder="underline"><Option>A</Option></Dropdown></Field>
              <Field label="错误" validationMessage="必选"><Dropdown placeholder="请选择"><Option>A</Option></Dropdown></Field>
            </div>
          </Demo>

          <Demo name="MultiSelect" note="Dropdown multiselect">
            <div className={l.grid3}>
              <Field label="多选"><Dropdown multiselect placeholder="选择成员" defaultSelectedOptions={[team[0].name]}>{team.map((m) => <Option key={m.email}>{m.name}</Option>)}</Dropdown></Field>
              <Field label="禁用"><Dropdown multiselect disabled placeholder="disabled" /></Field>
            </div>
          </Demo>

          <Demo name="Combobox">
            <div className={l.grid3}>
              {sizes.map((size) => <Field key={size} label={`size=${size}`}><Combobox size={size} placeholder="搜索成员">{team.map((m) => <Option key={m.email}>{m.name}</Option>)}</Combobox></Field>)}
              <Field label="多选"><Combobox multiselect placeholder="多选">{team.map((m) => <Option key={m.email}>{m.name}</Option>)}</Combobox></Field>
              <Field label="禁用"><Combobox disabled placeholder="disabled" /></Field>
            </div>
          </Demo>

          <Demo name="Autocomplete" note="Combobox freeform + 过滤">
            <Field label="输入城市"><Combobox freeform placeholder="输入以联想">{["上海", "杭州", "北京", "深圳", "新加坡", "法兰克福"].map((c) => <Option key={c}>{c}</Option>)}</Combobox></Field>
          </Demo>

          <Demo name="Checkbox">
            <div className={s.row}><Checkbox label="默认" /><Checkbox label="选中" defaultChecked /><Checkbox label="部分选中" checked="mixed" /><Checkbox label="禁用" disabled /><Checkbox label="禁用选中" disabled defaultChecked /><Checkbox label="large" size="large" defaultChecked /><Checkbox label="circular" shape="circular" defaultChecked /><Checkbox label="required" required /><Checkbox labelPosition="before" label="标签在前" /></div>
          </Demo>

          <Demo name="Radio">
            <RadioGroup layout="horizontal" defaultValue="b"><Radio value="a" label="选项 A" /><Radio value="b" label="选项 B" /><Radio value="c" label="禁用" disabled /></RadioGroup>
            <RadioGroup layout="horizontal-stacked" defaultValue="x"><Radio value="x" label="堆叠 X" /><Radio value="y" label="堆叠 Y" /></RadioGroup>
            <RadioGroup layout="vertical" defaultValue="1" disabled><Radio value="1" label="整组禁用" /><Radio value="2" label="整组禁用" /></RadioGroup>
          </Demo>

          <Demo name="Switch">
            <div className={s.row}><Switch label="默认" /><Switch label="开" defaultChecked /><Switch label="禁用" disabled /><Switch label="禁用开" disabled defaultChecked /><Switch label="标签在前" labelPosition="before" /><Switch label="标签在上" labelPosition="above" /></div>
          </Demo>

          <Demo name="Slider">
            <div className={l.grid3}>
              <Field label="small"><Slider size="small" defaultValue={30} /></Field>
              <Field label="medium"><Slider defaultValue={60} step={10} /></Field>
              <Field label="禁用"><Slider disabled defaultValue={50} /></Field>
              <Field label="垂直"><Slider vertical defaultValue={40} style={{ height: 100 }} /></Field>
            </div>
          </Demo>

          <Demo name="Rating">
            <div className={s.row}><Rating defaultValue={3} /><Rating defaultValue={4} size="large" color="brand" /><Rating defaultValue={2.5} step={0.5} size="small" /><RatingDisplay value={3} /><RatingDisplay value={4.2} count={1024} /><RatingDisplay value={3.5} compact /></div>
          </Demo>

          <Demo name="DatePicker" note="@fluentui/react-datepicker-compat">
            <div className={l.grid3}>
              <Field label="默认"><DatePicker placeholder="选择日期" /></Field>
              <Field label="可输入"><DatePicker allowTextInput placeholder="输入或选择" /></Field>
              <Field label="禁用"><DatePicker disabled placeholder="disabled" /></Field>
              <Field label="underline"><DatePicker appearance="underline" placeholder="underline" /></Field>
            </div>
          </Demo>

          <Demo name="TimePicker" note="@fluentui/react-timepicker-compat">
            <div className={l.grid3}>
              <Field label="默认"><TimePicker placeholder="选择时间" /></Field>
              <Field label="12 小时制"><TimePicker hourCycle="h12" placeholder="12h" /></Field>
              <Field label="自由输入"><TimePicker freeform placeholder="freeform" /></Field>
              <Field label="禁用"><TimePicker disabled placeholder="disabled" /></Field>
            </div>
          </Demo>

          <Demo name="DateRangePicker" note="两个 DatePicker 组合">
            <div className={s.row}><DatePicker placeholder="开始" /><Icon name="arrow-right" size={16} /><DatePicker placeholder="结束" /></div>
          </Demo>

          <Demo name="ColorPicker" note="ColorPicker / ColorArea / ColorSlider / AlphaSlider / SwatchPicker">
            <div className={l.grid2}>
              <ColorPicker color={color} onColorChange={(_, d) => setColor({ ...d.color, a: d.color.a ?? 1 })}>
                <ColorArea inputX={{ "aria-label": "饱和度" }} inputY={{ "aria-label": "明度" }} />
                <ColorSlider aria-label="色相" />
                <AlphaSlider aria-label="透明度" />
              </ColorPicker>
              <div className={s.col}>
                <div className={s.row}><div className={s.swatch} style={{ backgroundColor: hsvToCss(color) }} /><Text font="monospace">{hsvToCss(color)}</Text></div>
                <SwatchPicker aria-label="预设色板" defaultSelectedValue="blue" layout="grid" style={{ maxWidth: 240 }}>
                  {[["blue", "#0F6CBD"], ["teal", "#038387"], ["green", "#107C10"], ["marigold", "#EAA300"], ["red", "#D13438"], ["purple", "#8764B8"], ["pink", "#E43BA6"], ["gray", "#69797E"]].map(([v, c]) => <ColorSwatch key={v} value={v} color={c} aria-label={v} />)}
                </SwatchPicker>
              </div>
            </div>
          </Demo>

          <Demo name="Upload" note="input[type=file] + 拖拽区组合">
            <label className={s.empty} style={{ cursor: "pointer" }}><Icon name="upload" size={28} /><Body1>拖拽或点击上传</Body1><Caption1>PNG / PDF · 最大 10MB</Caption1><input type="file" style={{ display: "none" }} /></label>
            <div className={s.col}><div className={l.rowBetween}><Caption1>report.pdf</Caption1><Caption1>72%</Caption1></div><ProgressBar value={0.72} /></div>
          </Demo>

          <Missing name="Cascader" />
          <Missing name="Transfer" />
          <Missing name="Mention" />

          <Demo name="PinInput" note="多个 Input 组合">
            <div className={s.row}>
              {pin.map((v, i) => (
                <Input key={i} className={s.pin} maxLength={1} value={v} aria-label={`第 ${i + 1} 位`} ref={(el) => { pinRefs.current[i] = el }} onChange={(_, d) => { const next = [...pin]; next[i] = d.value.slice(-1); setPin(next); if (d.value && i < 5) pinRefs.current[i + 1]?.focus() }} />
              ))}
            </div>
          </Demo>

          <Demo name="Form" note="Field 组合校验">
            <form className={l.grid2} onSubmit={(e) => e.preventDefault()}>
              <Field label="用户名" required hint="4-16 个字符"><Input /></Field>
              <Field label="邮箱" required validationMessage="邮箱格式不正确" validationState="error"><Input defaultValue="not-an-email" /></Field>
              <Field label={<InfoLabel info="将用于双因素验证">手机号</InfoLabel>} orientation="horizontal"><Input /></Field>
              <Field label="备注" hint="可选"><Textarea /></Field>
              <div className={s.row}><Button appearance="primary" type="submit">提交</Button><Button type="reset">重置</Button></div>
            </form>
          </Demo>

          <Demo name="Table">
            {(["extra-small", "small", "medium"] as const).map((size) => (
              <div className={l.scrollX} key={size}>
                <Table size={size} aria-label={`表格 ${size}`}>
                  <TableHeader><TableRow><TableHeaderCell>订单</TableHeaderCell><TableHeaderCell>客户</TableHeaderCell><TableHeaderCell>状态</TableHeaderCell><TableHeaderCell>金额</TableHeaderCell></TableRow></TableHeader>
                  <TableBody>{orders.slice(0, 3).map((o) => <TableRow key={o.id}><TableCell>{o.id}</TableCell><TableCell>{o.customer}</TableCell><TableCell><StatusBadge value={o.status} /></TableCell><TableCell><Money value={o.amount} /></TableCell></TableRow>)}</TableBody>
                </Table>
              </div>
            ))}
          </Demo>

          <Demo name="DataGrid" note="排序 / 多选 / 列宽">
            <div className={l.scrollX}>
              <DataGrid items={orders.slice(0, 5)} columns={columns} sortable selectionMode="multiselect" getRowId={(o) => o.id} resizableColumns defaultSortState={{ sortColumn: "amount", sortDirection: "descending" }} aria-label="DataGrid">
                <DataGridHeader><DataGridRow selectionCell={{ checkboxIndicator: { "aria-label": "全选" } }}>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow></DataGridHeader>
                <DataGridBody<Order>>{({ item, rowId }) => <DataGridRow<Order> key={rowId} selectionCell={{ checkboxIndicator: { "aria-label": "选择行" } }}>{({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}</DataGridRow>}</DataGridBody>
              </DataGrid>
            </div>
          </Demo>

          <Demo name="Descriptions" note="Grid + Text 组合">
            <div className={s.desc}>{[["订单号", orders[0].id], ["客户", orders[0].customer], ["产品", orders[0].product], ["渠道", orders[0].channel], ["日期", orders[0].date]].map(([k, v]) => <div key={k} style={{ display: "contents" }}><Caption1 style={{ color: tokens.colorNeutralForeground3 }}>{k}</Caption1><Body1>{v}</Body1></div>)}</div>
          </Demo>

          <Demo name="List">
            <List navigationMode="items" aria-label="团队">{team.slice(0, 4).map((m) => <ListItem key={m.email} aria-label={m.name}><Persona name={m.name} secondaryText={m.email} presence={{ status: "available" }} avatar={{ color: "colorful" }} /></ListItem>)}</List>
            <List selectionMode="multiselect" defaultSelectedItems={[team[0].email]} aria-label="可选列表">{team.slice(0, 3).map((m) => <ListItem key={m.email} value={m.email} aria-label={m.name} checkmark={{ "aria-label": m.name }}>{m.name}</ListItem>)}</List>
          </Demo>

          <Demo name="Card">
            <div className={l.grid3}>
              {(["filled", "filled-alternative", "outline", "subtle"] as const).map((a) => (
                <Card key={a} appearance={a}>
                  <CardHeader image={<Avatar name={team[0].name} color="colorful" />} header={<Text weight="semibold">{a}</Text>} description={<Caption1>{team[0].email}</Caption1>} action={<Button appearance="transparent" icon={<Icon name="more-horizontal" />} aria-label="更多" />} />
                  <CardPreview><div className={s.aspect} style={{ maxWidth: "100%", borderRadius: 0 }}><Icon name="image" size={28} /></div></CardPreview>
                  <Body1>{landing.features[0].desc}</Body1>
                  <CardFooter><Button size="small">查看</Button><Button size="small" appearance="subtle">分享</Button></CardFooter>
                </Card>
              ))}
              <Card selected size="small"><CardHeader header={<Text weight="semibold">selected · small</Text>} /></Card>
              <Card size="large" orientation="horizontal" style={{ alignItems: "center" }}><CardPreview style={{ width: 56, height: 56, flexShrink: 0 }}><Avatar name={team[1].name} size={56} color="brand" /></CardPreview><CardHeader header={<Text weight="semibold">horizontal · large</Text>} description={<Caption1>{team[1].email}</Caption1>} /></Card>
            </div>
          </Demo>

          <Demo name="Avatar">
            <div className={s.row}>{([16, 24, 32, 40, 56, 72, 96] as const).map((size) => <Avatar key={size} size={size} name={team[size % team.length].name} color="colorful" />)}</div>
            <div className={s.row}><Avatar name={team[0].name} badge={{ status: "available" }} /><Avatar name={team[1].name} badge={{ status: "busy" }} shape="square" /><Avatar icon={<Icon name="user" />} /><Avatar name={team[2].name} active="active" activeAppearance="ring-shadow" /><Avatar name={team[3].name} active="inactive" /><Avatar initials="AC" color="brand" /></div>
          </Demo>

          <Demo name="AvatarGroup">
            <div className={s.row}>
              {(["spread", "stack", "pie"] as const).map((layout) => (
                <AvatarGroup key={layout} layout={layout} size={32}>
                  {team.slice(0, 4).map((m) => <AvatarGroupItem key={m.email} name={m.name} color="colorful" />)}
                  <AvatarGroupPopover>{team.slice(4).map((m) => <AvatarGroupItem key={m.email} name={m.name} color="colorful" />)}</AvatarGroupPopover>
                </AvatarGroup>
              ))}
            </div>
          </Demo>

          <Demo name="Badge">
            {(["filled", "ghost", "outline", "tint"] as const).map((a) => a === "ghost" ? <div key={a} style={{ backgroundColor: tokens.colorNeutralBackgroundInverted, padding: tokens.spacingHorizontalS, borderRadius: tokens.borderRadiusMedium }}><div className={s.row}>{(["brand", "danger", "important", "informative", "severe", "subtle", "success", "warning"] as const).map((c) => <Badge key={c} appearance={a} color={c}>{c}</Badge>)}</div></div> : <div className={s.row} key={a}>{(["brand", "danger", "important", "informative", "severe", "subtle", "success", "warning"] as const).map((c) => <Badge key={c} appearance={a} color={c}>{c}</Badge>)}</div>)}
            <div className={s.row}>{(["tiny", "extra-small", "small", "medium", "large", "extra-large"] as const).map((size) => <Badge key={size} size={size} icon={<Icon name="check" size={10} />}>{size}</Badge>)}<Badge shape="square">square</Badge><Badge shape="rounded">rounded</Badge><CounterBadge count={5} /><CounterBadge count={120} overflowCount={99} color="danger" /><CounterBadge dot /><PresenceBadge status="available" /><PresenceBadge status="away" /><PresenceBadge status="do-not-disturb" /><PresenceBadge status="offline" /></div>
          </Demo>

          <Demo name="Tag">
            <TagGroup aria-label="标签" onDismiss={(_, d) => setTags(tags.filter((t) => t !== d.value))}>{tags.map((t) => <Tag key={t} value={t} dismissible dismissIcon={{ "aria-label": `移除 ${t}` }} media={<Avatar name={t} color="colorful" />}>{t}</Tag>)}</TagGroup>
            <div className={s.row}>{(["filled", "outline", "brand"] as const).map((a) => <Tag key={a} appearance={a}>{a}</Tag>)}{(["extra-small", "small", "medium"] as const).map((size) => <Tag key={size} size={size} icon={<Icon name="tag" size={12} />}>{size}</Tag>)}<Tag shape="circular">circular</Tag><Tag disabled>disabled</Tag><Tag selected>selected</Tag><InteractionTag><InteractionTagPrimary hasSecondaryAction>Interaction</InteractionTagPrimary><InteractionTagSecondary aria-label="移除" /></InteractionTag></div>
            <TagPicker selectedOptions={tags} onOptionSelect={(_, d) => setTags(d.selectedOptions)}>
              <TagPickerControl><TagPickerGroup aria-label="已选成员">{tags.map((t) => <Tag key={t} value={t} shape="rounded" media={<Avatar name={t} color="colorful" />}>{t}</Tag>)}</TagPickerGroup><TagPickerInput aria-label="选择成员" placeholder="TagPicker 选择成员" /></TagPickerControl>
              <TagPickerList>{team.filter((m) => !tags.includes(m.name)).map((m) => <TagPickerOption key={m.email} value={m.name} media={<Avatar name={m.name} color="colorful" />}>{m.name}</TagPickerOption>)}</TagPickerList>
            </TagPicker>
          </Demo>

          <Demo name="Statistic" note="Text 组合">
            <div className={l.grid4}>{stats.map((st) => <div key={st.key} className={s.col}><Caption1 style={{ color: tokens.colorNeutralForeground3 }}>{st.label}</Caption1><Title2>{st.unit === "CNY" ? `¥${st.value.toLocaleString()}` : `${st.value}${st.unit ?? ""}`}</Title2><Badge appearance="tint" color={st.delta > 0 ? "success" : "danger"} size="small">{st.delta > 0 ? "+" : ""}{st.delta}%</Badge></div>)}</div>
          </Demo>

          <Demo name="Timeline" note="CSS 组合">
            <div className={s.timeline}>{activity.slice(0, 4).map((a, i) => <div className={s.tItem} key={i}><Body1><Text weight="semibold">{a.user}</Text> {a.action}</Body1><Caption1 block style={{ color: tokens.colorNeutralForeground3 }}>{a.time}</Caption1></div>)}</div>
          </Demo>

          <Demo name="Tree">
            <Tree aria-label="导航树" defaultOpenItems={["nav"]}>
              <TreeItem itemType="branch" value="nav"><TreeItemLayout iconBefore={<Icon name="folder" size={16} />}>导航</TreeItemLayout>
                <Tree>{nav.slice(0, 4).map((n) => <TreeItem key={n.key} itemType="leaf"><TreeItemLayout iconBefore={<Icon name={n.icon} size={16} />} aside={<Badge size="small" appearance="tint">{n.key}</Badge>}>{n.label}</TreeItemLayout></TreeItem>)}</Tree>
              </TreeItem>
              <TreeItem itemType="branch" value="team"><TreeItemLayout iconBefore={<Icon name="users" size={16} />}>团队</TreeItemLayout>
                <Tree>{team.slice(0, 3).map((m) => <TreeItem key={m.email} itemType="leaf"><TreeItemLayout>{m.name}</TreeItemLayout></TreeItem>)}</Tree>
              </TreeItem>
              <Tree aria-label="选择树" selectionMode="multiselect" size="small"><TreeItem itemType="leaf" value="s1"><TreeItemLayout>可多选 · small</TreeItemLayout></TreeItem></Tree>
            </Tree>
          </Demo>

          <Demo name="Calendar" note="@fluentui/react-calendar-compat">
            <div className={s.row}><Calendar showGoToToday /><Calendar isMonthPickerVisible={false} showWeekNumbers /></div>
          </Demo>

          <Demo name="Image">
            <div className={s.row}>{(["square", "rounded", "circular"] as const).map((shape) => <Image key={shape} shape={shape} bordered shadow width={96} height={96} alt={shape} src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%230f6cbd'/%3E%3C/svg%3E" />)}<div style={{ display: "flex", alignItems: "center", border: `1px solid ${tokens.colorNeutralStroke1}` }}><Image fit="contain" width={120} height={64} alt="contain" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='64'%3E%3Crect width='120' height='64' fill='%23038387'/%3E%3C/svg%3E" /></div></div>
          </Demo>

          <Demo name="Carousel">
            <Carousel groupSize={1} circular announcement={(index, total) => `第 ${index + 1} / ${total} 张`}>
              <CarouselSlider>{landing.features.slice(0, 4).map((f, i) => <CarouselCard key={f.title} aria-label={`${i + 1} / 4`}><div className={s.carouselCard}><div className={s.col} style={{ alignItems: "center" }}><Icon name={f.icon} size={28} /><Text weight="semibold">{f.title}</Text></div></div></CarouselCard>)}</CarouselSlider>
              <CarouselNavContainer layout="inline" next={{ "aria-label": "下一张" }} prev={{ "aria-label": "上一张" }}><CarouselNav>{(index) => <CarouselNavButton aria-label={`第 ${index + 1} 张`} />}</CarouselNav></CarouselNavContainer>
            </Carousel>
          </Demo>

          <Demo name="Empty" note="图标 + 文本组合">
            <div className={s.empty}><Icon name="inbox" size={32} /><Body1>暂无数据</Body1><Caption1>创建第一条记录以开始</Caption1><Button size="small" appearance="primary">新建</Button></div>
          </Demo>

          <Demo name="Tooltip">
            <div className={s.row}>{(["above", "below", "before", "after"] as const).map((p) => <Tooltip key={p} content={`位置 ${p}`} relationship="label" positioning={p}><Button>{p}</Button></Tooltip>)}<Tooltip content="inverted" relationship="label" appearance="inverted"><Button>inverted</Button></Tooltip><Tooltip content="带箭头" relationship="label" withArrow><Button>withArrow</Button></Tooltip></div>
          </Demo>

          <Demo name="Popover">
            <div className={s.row}>
              {(["brand", "inverted"] as const).map((a) => <Popover key={a} appearance={a} withArrow><PopoverTrigger disableButtonEnhancement><Button>{a}</Button></PopoverTrigger><PopoverSurface><Text weight="semibold" block>Popover</Text><Caption1>{landing.features[1].desc}</Caption1></PopoverSurface></Popover>)}
              <Popover size="small"><PopoverTrigger disableButtonEnhancement><Button>small</Button></PopoverTrigger><PopoverSurface>small</PopoverSurface></Popover>
              <Popover openOnHover><PopoverTrigger disableButtonEnhancement><Button>hover</Button></PopoverTrigger><PopoverSurface>hover 打开</PopoverSurface></Popover>
            </div>
          </Demo>

          <Missing name="QRCode" />

          <Demo name="Segmented" note="ToolbarRadioGroup / TabList 组合">
            <Toolbar aria-label="分段" defaultCheckedValues={{ view: ["list"] }}><ToolbarRadioGroup><ToolbarRadioButton name="view" value="list" icon={<Icon name="list" />}>列表</ToolbarRadioButton><ToolbarRadioButton name="view" value="grid" icon={<Icon name="grid" />}>网格</ToolbarRadioButton><ToolbarRadioButton name="view" value="board" icon={<Icon name="columns" />} disabled>看板</ToolbarRadioButton></ToolbarRadioGroup></Toolbar>
            <TabList defaultSelectedValue="d" appearance="subtle" size="small"><Tab value="d">日</Tab><Tab value="w">周</Tab><Tab value="m">月</Tab></TabList>
          </Demo>

          <Demo name="Alert" note="MessageBar">
            {(["info", "success", "warning", "error"] as const).map((intent) => <MessageBar key={intent} intent={intent}><MessageBarBody><MessageBarTitle>{intent}</MessageBarTitle>{landing.faq[0].a}</MessageBarBody><MessageBarActions containerAction={<Button appearance="transparent" size="small" icon={<Icon name="x" />} aria-label="关闭" />}><Button size="small">操作</Button></MessageBarActions></MessageBar>)}
            <MessageBar layout="multiline" intent="info"><MessageBarBody><MessageBarTitle>multiline</MessageBarTitle>{landing.faq[1].a}</MessageBarBody><MessageBarActions><Button size="small">了解</Button></MessageBarActions></MessageBar>
          </Demo>

          <Demo name="Toast">
            <div className={s.row}>{(["success", "info", "warning", "error"] as const).map((intent) => <Button key={intent} onClick={() => dispatchToast(<Toast><ToastTitle>{intent}</ToastTitle><ToastBody>{landing.faq[2].a}</ToastBody></Toast>, { intent })}>{intent}</Button>)}</div>
          </Demo>

          <Demo name="Notification" note="Toast + 位置/操作组合">
            <div className={s.row}><Button onClick={() => dispatchToast(<Toast><ToastTitle action={<Link>撤销</Link>}>{activity[0].user} {activity[0].action}</ToastTitle><ToastBody subtitle={activity[0].time}>{landing.faq[3].a}</ToastBody></Toast>, { position: "top-end", timeout: 6000 })}>右上通知</Button><Button onClick={() => dispatchToast(<Toast><ToastTitle>底部通知</ToastTitle></Toast>, { position: "bottom" })}>底部通知</Button></div>
          </Demo>

          <Demo name="Dialog">
            <div className={s.row}>
              <Dialog><DialogTrigger disableButtonEnhancement><Button>modal</Button></DialogTrigger><DialogSurface><DialogBody><DialogTitle>对话框标题</DialogTitle><DialogContent>{landing.faq[4].a}</DialogContent><DialogActions><DialogTrigger disableButtonEnhancement><Button>取消</Button></DialogTrigger><Button appearance="primary">确定</Button></DialogActions></DialogBody></DialogSurface></Dialog>
              <Dialog modalType="non-modal"><DialogTrigger disableButtonEnhancement><Button>non-modal</Button></DialogTrigger><DialogSurface><DialogBody><DialogTitle action={<DialogTrigger action="close"><Button appearance="subtle" icon={<Icon name="x" />} aria-label="关闭" /></DialogTrigger>}>非模态</DialogTitle><DialogContent>可与页面其他部分交互。</DialogContent></DialogBody></DialogSurface></Dialog>
              <Dialog modalType="alert"><DialogTrigger disableButtonEnhancement><Button>alert</Button></DialogTrigger><DialogSurface><DialogBody><DialogTitle>警示</DialogTitle><DialogContent>必须做出选择才能关闭。</DialogContent><DialogActions><DialogTrigger disableButtonEnhancement><Button>取消</Button></DialogTrigger><Button appearance="primary">确认</Button></DialogActions></DialogBody></DialogSurface></Dialog>
            </div>
          </Demo>

          <Demo name="Drawer" note="OverlayDrawer / InlineDrawer">
            <div className={s.row}><Button onClick={() => setDrawerOpen(true)}>打开 OverlayDrawer</Button><Button onClick={() => setInlineOpen(!inlineOpen)}>切换 InlineDrawer</Button></div>
            <OverlayDrawer open={drawerOpen} onOpenChange={(_, d) => setDrawerOpen(d.open)} position="end" size="small"><DrawerHeader><DrawerHeaderTitle action={<Button appearance="subtle" icon={<Icon name="x" />} aria-label="关闭" onClick={() => setDrawerOpen(false)} />}>抽屉</DrawerHeaderTitle></DrawerHeader><DrawerBody><Body1>{landing.faq[5].a}</Body1></DrawerBody></OverlayDrawer>
            <div style={{ display: "flex", border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, overflow: "hidden", minHeight: 140 }}>
              <InlineDrawer open={inlineOpen} size="small"><DrawerHeader><DrawerHeaderTitle>Inline</DrawerHeaderTitle></DrawerHeader><DrawerBody><Caption1>内嵌抽屉内容</Caption1></DrawerBody></InlineDrawer>
              <div style={{ padding: tokens.spacingHorizontalM, flex: 1 }}><Body1>主内容区域</Body1></div>
            </div>
          </Demo>

          <Demo name="Progress">
            <div className={s.col}><ProgressBar value={0.3} /><ProgressBar value={0.6} thickness="large" color="success" /><ProgressBar value={0.8} color="warning" shape="square" /><ProgressBar value={0.9} color="error" /><ProgressBar aria-label="不确定进度" /></div>
          </Demo>

          <Demo name="Skeleton">
            <Skeleton aria-label="加载中"><div className={s.row}><SkeletonItem shape="circle" size={40} /><div className={s.col} style={{ flex: 1 }}><SkeletonItem size={12} style={{ width: "60%" }} /><SkeletonItem size={12} /></div></div></Skeleton>
            <Skeleton animation="pulse" appearance="translucent"><SkeletonItem shape="rectangle" size={64} /></Skeleton>
          </Demo>

          <Demo name="Spinner">
            <div className={s.row}>{(["extra-tiny", "tiny", "extra-small", "small", "medium", "large", "extra-large", "huge"] as const).map((size) => <Spinner key={size} size={size} label={size} labelPosition="below" />)}<div style={{ background: tokens.colorBrandBackground, padding: 8, borderRadius: 4 }}><Spinner appearance="inverted" size="small" /></div></div>
          </Demo>

          <Demo name="Result" note="图标 + 文本 + 操作组合">
            <div className={l.grid2}>
              <div className={s.empty} style={{ color: tokens.colorPaletteGreenForeground1 }}><Icon name="check-circle" size={40} /><Title3>操作成功</Title3><Caption1 style={{ color: tokens.colorNeutralForeground3 }}>订单已创建并发送确认邮件。</Caption1><Button appearance="primary" size="small">返回</Button></div>
              <div className={s.empty} style={{ color: tokens.colorPaletteRedForeground1 }}><Icon name="alert-circle" size={40} /><Title3>提交失败</Title3><Caption1 style={{ color: tokens.colorNeutralForeground3 }}>请检查网络后重试。</Caption1><Button size="small">重试</Button></div>
            </div>
          </Demo>

          <Demo name="Popconfirm" note="Popover 组合">
            <Popover withArrow><PopoverTrigger disableButtonEnhancement><Button icon={<Icon name="trash" />}>删除</Button></PopoverTrigger><PopoverSurface><div className={s.col}><Text weight="semibold">确定删除吗？</Text><Caption1>此操作不可撤销。</Caption1><div className={s.row}><Button size="small">取消</Button><Button size="small" appearance="primary">确定</Button></div></div></PopoverSurface></Popover>
          </Demo>

          <Demo name="Menu">
            <div className={s.row}>
              <Menu><MenuTrigger disableButtonEnhancement><MenuButton>菜单</MenuButton></MenuTrigger><MenuPopover><MenuList><MenuGroup><MenuGroupHeader>操作</MenuGroupHeader><MenuItem icon={<Icon name="pencil" />} secondaryContent="Ctrl+E">编辑</MenuItem><MenuItem icon={<Icon name="copy" />}>复制</MenuItem><MenuItem disabled>禁用</MenuItem></MenuGroup><MenuDivider /><Menu><MenuTrigger disableButtonEnhancement><MenuItem>子菜单</MenuItem></MenuTrigger><MenuPopover><MenuList><MenuItem>子项 1</MenuItem><MenuItem>子项 2</MenuItem></MenuList></MenuPopover></Menu></MenuList></MenuPopover></Menu>
              <Menu defaultCheckedValues={{ view: ["a"], opt: ["x"] }}><MenuTrigger disableButtonEnhancement><MenuButton appearance="primary">选择项</MenuButton></MenuTrigger><MenuPopover><MenuList><MenuItemRadio name="view" value="a">单选 A</MenuItemRadio><MenuItemRadio name="view" value="b">单选 B</MenuItemRadio><MenuDivider /><MenuItemCheckbox name="opt" value="x">复选 X</MenuItemCheckbox><MenuItemCheckbox name="opt" value="y">复选 Y</MenuItemCheckbox></MenuList></MenuPopover></Menu>
              <MenuButton size="small">small</MenuButton><MenuButton size="large" disabled>disabled</MenuButton>
            </div>
          </Demo>

          <Demo name="Dropdown" note="Menu 触发 + Dropdown 选择">
            <div className={s.row}><Menu><MenuTrigger disableButtonEnhancement><Button appearance="outline" icon={<Icon name="chevron-down" />} iconPosition="after">更多操作</Button></MenuTrigger><MenuPopover><MenuList><MenuItem>导出</MenuItem><MenuItem>归档</MenuItem></MenuList></MenuPopover></Menu><Dropdown placeholder="Dropdown 选择" style={{ minWidth: 160 }}>{team.slice(0, 3).map((m) => <Option key={m.email}>{m.name}</Option>)}</Dropdown></div>
          </Demo>

          <Demo name="Breadcrumb">
            {sizes.map((size) => <Breadcrumb key={size} size={size} aria-label={`面包屑 ${size}`}><BreadcrumbItem><BreadcrumbButton icon={<Icon name="home" size={16} />}>首页</BreadcrumbButton></BreadcrumbItem><BreadcrumbDivider /><BreadcrumbItem><BreadcrumbButton>订单</BreadcrumbButton></BreadcrumbItem><BreadcrumbDivider /><BreadcrumbItem><BreadcrumbButton current>{orders[0].id}</BreadcrumbButton></BreadcrumbItem></Breadcrumb>)}
          </Demo>

          <Demo name="Tabs">
            {(["transparent", "subtle", "subtle-circular", "filled-circular"] as const).map((a) => <TabList key={a} appearance={a} defaultSelectedValue="1"><Tab value="1" icon={<Icon name="home" size={16} />}>{a}</Tab><Tab value="2">订单</Tab><Tab value="3" disabled>禁用</Tab></TabList>)}
            <TabList size="small" defaultSelectedValue="1"><Tab value="1">small</Tab><Tab value="2">Tab</Tab></TabList>
            <TabList size="large" defaultSelectedValue="1"><Tab value="1">large</Tab><Tab value="2">Tab</Tab></TabList>
            <TabList vertical defaultSelectedValue="1"><Tab value="1">垂直 1</Tab><Tab value="2">垂直 2</Tab></TabList>
          </Demo>

          <Demo name="Pagination" note="Button 组合">
            <div className={s.row}><Button size="small" icon={<Icon name="chevron-left" />} disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="上一页" />{[1, 2, 3, 4, 5].map((p) => <Button key={p} size="small" appearance={p === page ? "primary" : "subtle"} onClick={() => setPage(p)}>{p}</Button>)}<Text>…</Text><Button size="small" appearance="subtle">12</Button><Button size="small" icon={<Icon name="chevron-right" />} disabled={page === 5} onClick={() => setPage(page + 1)} aria-label="下一页" /><Select size="small"><option>10 / 页</option><option>20 / 页</option></Select></div>
          </Demo>

          <Demo name="Steps" note="Badge + Divider 组合">
            <div className={s.steps}>{["基本信息", "偏好设置", "确认提交"].map((t, i) => <div key={t} className={s.row}><span className={mergeClasses(s.stepDot, i < 2 && s.stepDone)}>{i < 1 ? <Icon name="check" size={12} /> : i + 1}</span><Caption1>{t}</Caption1>{i < 2 ? <Divider style={{ width: 40 }} /> : null}</div>)}</div>
          </Demo>

          <Demo name="Anchor" note="本页右侧目录即锚点导航（Link 组合）">
            <div className={s.row}>{["Button", "Input", "Table", "Dialog"].map((n) => <Link key={n} href={`#${n}`}>#{n}</Link>)}</div>
          </Demo>

          <Demo name="BackTop" note="固定定位 Button 组合"><Caption1>向下滚动页面后右下角出现「回到顶部」按钮。</Caption1></Demo>

          <Demo name="Affix" note="position: sticky 组合"><Caption1>右侧目录与页头使用 sticky 固定。</Caption1></Demo>

          <Demo name="Navbar" note="Toolbar 组合">
            <Toolbar aria-label="导航栏" style={{ border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, justifyContent: "space-between", flexWrap: "wrap", minWidth: 0 }}><div className={s.row}><Text weight="semibold">Acme</Text>{nav.slice(0, 3).map((n) => <ToolbarButton key={n.key}>{n.label}</ToolbarButton>)}</div><div className={s.row}><SearchBox size="small" placeholder="搜索" style={{ minWidth: 0, width: 140 }} /><Avatar name={team[0].name} size={28} color="colorful" /></div></Toolbar>
          </Demo>

          <Demo name="Sidebar" note="NavDrawer">
            <div style={{ height: 300, display: "flex", border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, overflow: "hidden" }}>
              <NavDrawer open type="inline" defaultSelectedValue="orders" density="small"><NavDrawerHeader><Text weight="semibold" style={{ padding: `0 ${tokens.spacingHorizontalM}` }}>Acme Console</Text></NavDrawerHeader><NavDrawerBody><NavSectionHeader>工作台</NavSectionHeader>{nav.slice(0, 5).map((n) => <NavItem key={n.key} value={n.key} icon={<Icon name={n.icon} size={18} />}>{n.label}</NavItem>)}</NavDrawerBody></NavDrawer>
              <div style={{ padding: tokens.spacingHorizontalM }}><Caption1>内容区</Caption1></div>
            </div>
          </Demo>

          <Demo name="CommandPalette" note="Dialog + SearchBox + List 组合">
            <Button icon={<Icon name="command" />} onClick={() => setCmdOpen(true)}>打开命令面板 <span className={s.kbd}>⌘K</span></Button>
            <Dialog open={cmdOpen} onOpenChange={(_, d) => setCmdOpen(d.open)}><DialogSurface><DialogBody><DialogTitle>命令面板</DialogTitle><DialogContent><div className={s.col}><SearchBox autoFocus placeholder="输入命令或搜索页面..." /><List navigationMode="items" aria-label="命令">{nav.map((n) => <ListItem key={n.key} aria-label={n.label} onAction={() => setCmdOpen(false)}><div className={l.rowBetween} style={{ padding: 6, width: "100%" }}><span className={s.row}><Icon name={n.icon} size={16} />{n.label}</span><span className={s.kbd}>{n.path}</span></div></ListItem>)}</List></div></DialogContent></DialogBody></DialogSurface></Dialog>
          </Demo>

          <Demo name="Grid" note="CSS Grid (makeStyles)"><div className={s.gridDemo}>{Array.from({ length: 8 }).map((_, i) => <div key={i} className={s.cell}>col {i + 1}</div>)}</div></Demo>
          <Demo name="Stack" note="Flex (makeStyles)"><div className={s.row}><div className={s.cell}>水平 1</div><div className={s.cell}>水平 2</div></div><div className={s.col} style={{ maxWidth: 160 }}><div className={s.cell}>垂直 1</div><div className={s.cell}>垂直 2</div></div></Demo>
          <Demo name="Layout" note="Header / Sider / Content / Footer 组合"><div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gridTemplateRows: "32px 80px 32px", gap: 4 }}><div className={s.cell} style={{ gridColumn: "1 / -1" }}>Header</div><div className={s.cell}>Sider</div><div className={s.cell} style={{ backgroundColor: tokens.colorNeutralBackground3, color: tokens.colorNeutralForeground2 }}>Content</div><div className={s.cell} style={{ gridColumn: "1 / -1" }}>Footer</div></div></Demo>
          <Demo name="Container" note="max-width 居中组合"><div style={{ maxWidth: 480, margin: "0 auto", padding: 12, border: `1px dashed ${tokens.colorNeutralStroke1}`, textAlign: "center" }}><Caption1>max-width: 480px</Caption1></div></Demo>
          <Demo name="AspectRatio" note="CSS aspect-ratio"><div className={s.aspect}><Caption1>16 : 9</Caption1></div></Demo>
          <Missing name="Resizable" />
          <Demo name="ScrollArea" note="overflow: auto 组合"><div className={s.scroll}>{orders.slice(0, 12).map((o) => <Body1 key={o.id} block>{o.id} · {o.customer}</Body1>)}</div></Demo>

          <Demo name="Accordion">
            <Accordion multiple collapsible defaultOpenItems={["0"]}>{landing.faq.slice(0, 3).map((f, i) => <AccordionItem key={f.q} value={String(i)}><AccordionHeader size={i === 0 ? "large" : "medium"} expandIconPosition={i === 2 ? "end" : "start"}>{f.q}</AccordionHeader><AccordionPanel><Body1>{f.a}</Body1></AccordionPanel></AccordionItem>)}<AccordionItem value="d" disabled><AccordionHeader>禁用项</AccordionHeader><AccordionPanel>—</AccordionPanel></AccordionItem></Accordion>
          </Demo>

          <Demo name="ThemeProvider" note="FluentProvider 嵌套 webLightTheme / webDarkTheme">
            <div className={l.grid2}>
              <FluentProvider theme={webLightTheme} className={s.themeBox}><Text>webLightTheme</Text><Button appearance="primary">主按钮</Button><Badge>Badge</Badge><Switch defaultChecked /></FluentProvider>
              <FluentProvider theme={webDarkTheme} className={s.themeBox}><Text>webDarkTheme</Text><Button appearance="primary">主按钮</Button><Badge>Badge</Badge><Switch defaultChecked /></FluentProvider>
            </div>
          </Demo>

          <Missing name="Watermark" />

          <Demo name="Tour" note="TeachingPopover">
            <TeachingPopover withArrow><TeachingPopoverTrigger disableButtonEnhancement><Button appearance="primary" icon={<Icon name="sparkles" />}>开始引导</Button></TeachingPopoverTrigger><TeachingPopoverSurface><TeachingPopoverHeader>新功能</TeachingPopoverHeader><TeachingPopoverBody><TeachingPopoverTitle>{landing.features[3].title}</TeachingPopoverTitle><Body1>{landing.features[3].desc}</Body1></TeachingPopoverBody><TeachingPopoverFooter primary="知道了" secondary="下一步" /></TeachingPopoverSurface></TeachingPopover>
          </Demo>

          <Demo name="FloatButton" note="固定定位 Button 组合"><Caption1>右下角固定的「回到顶部 / 帮助」按钮。</Caption1></Demo>

          <Demo name="Kbd" note="样式化 span 组合"><div className={s.row}><span className={s.kbd}>Ctrl</span> + <span className={s.kbd}>K</span><span className={s.kbd}>⇧</span><span className={s.kbd}>Enter</span></div></Demo>

          <Demo name="Code" note="Text font=monospace 组合">
            <Body1>行内 <code className={s.code}>pnpm --filter fluent-ui build</code> 代码。</Body1>
            <pre className={s.pre}>{`SELECT date_trunc('month', created_at) AS m, sum(amount)\nFROM orders WHERE status = 'paid'\nGROUP BY 1;`}</pre>
          </Demo>

          <Demo name="Divider">
            <Divider /><Divider>居中文本</Divider><Divider alignContent="start">start</Divider><Divider alignContent="end" appearance="brand">brand</Divider><Divider appearance="strong">strong</Divider><Divider appearance="subtle" inset>subtle inset</Divider>
            <div className={s.row} style={{ height: 96 }}><Text>A</Text><Divider vertical /><Text>B</Text><Divider vertical appearance="brand">v</Divider><Text>C</Text></div>
          </Demo>

          <Demo name="Link">
            <div className={s.row}><Link href="#Link">默认链接</Link><Link href="#Link" appearance="subtle">subtle</Link><Link href="#Link" inline>inline</Link><Link disabled>disabled</Link><Link href="#Link" disabledFocusable>disabledFocusable</Link><Link as="button">as=button</Link><Body1>段落中的 <Link inline href="#Typography">内联链接</Link>。</Body1></div>
          </Demo>

          <Card className={l.card}>
            <CardHeader header={<Text weight="semibold">覆盖清单</Text>} description={<Caption1>与 gallery.json.coverage 一致</Caption1>} />
            <div className={s.row}>{names.map((n) => <Badge key={n} appearance="outline" color={statusColor[coverage[n]]} size="small">{n}</Badge>)}</div>
          </Card>
        </div>

        <nav className={s.toc} aria-label="组件目录">
          <Label size="small" weight="semibold">目录</Label>
          {names.map((n) => <a key={n} href={`#${n}`} className={s.tocLink}>{n}</a>)}
        </nav>
      </div>

      <div className={s.float}>
        <Tooltip content="帮助" relationship="label"><Button shape="circular" size="large" icon={<Icon name="help-circle" />} /></Tooltip>
        {showTop ? <Tooltip content="回到顶部" relationship="label"><Button shape="circular" size="large" appearance="primary" icon={<Icon name="arrow-up" />} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} /></Tooltip> : null}
      </div>
    </div>
  )
}
