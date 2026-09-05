import { useRef, useState, type ReactNode } from "react"
import { Avatar, ChatBubble, LoadingBar, SupportPromptGroup } from "@cloudscape-design/chat-components"
import CodeView from "@cloudscape-design/code-view/code-view"
import ActionCard from "@cloudscape-design/components/action-card"
import Alert from "@cloudscape-design/components/alert"
import AnchorNavigation from "@cloudscape-design/components/anchor-navigation"
import AnnotationContext from "@cloudscape-design/components/annotation-context"
import AreaChart from "@cloudscape-design/components/area-chart"
import AttributeEditor from "@cloudscape-design/components/attribute-editor"
import Autosuggest from "@cloudscape-design/components/autosuggest"
import Badge from "@cloudscape-design/components/badge"
import BarChart from "@cloudscape-design/components/bar-chart"
import Box from "@cloudscape-design/components/box"
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group"
import Button from "@cloudscape-design/components/button"
import ButtonDropdown from "@cloudscape-design/components/button-dropdown"
import ButtonGroup from "@cloudscape-design/components/button-group"
import Calendar from "@cloudscape-design/components/calendar"
import Cards from "@cloudscape-design/components/cards"
import Checkbox from "@cloudscape-design/components/checkbox"
import CollectionPreferences from "@cloudscape-design/components/collection-preferences"
import ColumnLayout from "@cloudscape-design/components/column-layout"
import Container from "@cloudscape-design/components/container"
import ContentLayout from "@cloudscape-design/components/content-layout"
import CopyToClipboard from "@cloudscape-design/components/copy-to-clipboard"
import DateInput from "@cloudscape-design/components/date-input"
import DatePicker from "@cloudscape-design/components/date-picker"
import DateRangePicker, { type DateRangePickerProps } from "@cloudscape-design/components/date-range-picker"
import Divider from "@cloudscape-design/components/divider"
import Drawer from "@cloudscape-design/components/drawer"
import ErrorBoundary from "@cloudscape-design/components/error-boundary"
import ExpandableSection from "@cloudscape-design/components/expandable-section"
import FileDropzone from "@cloudscape-design/components/file-dropzone"
import FileInput from "@cloudscape-design/components/file-input"
import FileTokenGroup from "@cloudscape-design/components/file-token-group"
import FileUpload from "@cloudscape-design/components/file-upload"
import Flashbar from "@cloudscape-design/components/flashbar"
import Form from "@cloudscape-design/components/form"
import FormField from "@cloudscape-design/components/form-field"
import Grid from "@cloudscape-design/components/grid"
import Header from "@cloudscape-design/components/header"
import HelpPanel from "@cloudscape-design/components/help-panel"
import Hotspot from "@cloudscape-design/components/hotspot"
import Icon from "@cloudscape-design/components/icon"
import Input from "@cloudscape-design/components/input"
import ItemCard from "@cloudscape-design/components/item-card"
import KeyValuePairs from "@cloudscape-design/components/key-value-pairs"
import LineChart from "@cloudscape-design/components/line-chart"
import Link from "@cloudscape-design/components/link"
import List from "@cloudscape-design/components/list"
import LiveRegion from "@cloudscape-design/components/live-region"
import MixedLineBarChart from "@cloudscape-design/components/mixed-line-bar-chart"
import Modal from "@cloudscape-design/components/modal"
import Multiselect, { type MultiselectProps } from "@cloudscape-design/components/multiselect"
import NavigableGroup from "@cloudscape-design/components/navigable-group"
import Pagination from "@cloudscape-design/components/pagination"
import PanelLayout from "@cloudscape-design/components/panel-layout"
import PieChart from "@cloudscape-design/components/pie-chart"
import Popover from "@cloudscape-design/components/popover"
import ProgressBar from "@cloudscape-design/components/progress-bar"
import PromptInput from "@cloudscape-design/components/prompt-input"
import PropertyFilter, { type PropertyFilterProps } from "@cloudscape-design/components/property-filter"
import RadioButton from "@cloudscape-design/components/radio-button"
import RadioGroup from "@cloudscape-design/components/radio-group"
import S3ResourceSelector from "@cloudscape-design/components/s3-resource-selector"
import SegmentedControl from "@cloudscape-design/components/segmented-control"
import Select, { type SelectProps } from "@cloudscape-design/components/select"
import SideNavigation from "@cloudscape-design/components/side-navigation"
import Skeleton from "@cloudscape-design/components/skeleton"
import Slider from "@cloudscape-design/components/slider"
import SpaceBetween from "@cloudscape-design/components/space-between"
import Spinner from "@cloudscape-design/components/spinner"
import StatusIndicator, { type StatusIndicatorProps } from "@cloudscape-design/components/status-indicator"
import Steps from "@cloudscape-design/components/steps"
import Table from "@cloudscape-design/components/table"
import Tabs from "@cloudscape-design/components/tabs"
import TagEditor, { type TagEditorProps } from "@cloudscape-design/components/tag-editor"
import TextContent from "@cloudscape-design/components/text-content"
import TextFilter from "@cloudscape-design/components/text-filter"
import Textarea from "@cloudscape-design/components/textarea"
import Tiles from "@cloudscape-design/components/tiles"
import TimeInput from "@cloudscape-design/components/time-input"
import Toggle from "@cloudscape-design/components/toggle"
import ToggleButton from "@cloudscape-design/components/toggle-button"
import Token from "@cloudscape-design/components/token"
import TokenGroup from "@cloudscape-design/components/token-group"
import Tooltip from "@cloudscape-design/components/tooltip"
import TopNavigation from "@cloudscape-design/components/top-navigation"
import TreeView from "@cloudscape-design/components/tree-view"
import TruncatedText from "@cloudscape-design/components/truncated-text"
import TutorialPanel from "@cloudscape-design/components/tutorial-panel"
import Wizard from "@cloudscape-design/components/wizard"

import chat from "@ui-gallery/spec/mock/chat.json"
import nav from "@ui-gallery/spec/mock/nav.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import team from "@ui-gallery/spec/mock/team.json"

import contract from "@ui-gallery/spec/contract.json"

import { APP_TITLE } from "@/layouts/app-shell"
import { coverage } from "@/coverage"
import { AppIcon, iconFamily, iconProps } from "@/lib/icons"
import { label, money, OrderStatus, PersonAvatar } from "./shared"

type Order = (typeof orders)[number]
type Member = (typeof team)[number]
type NavItem = (typeof nav)[number]

const SIZES = ["normal", "primary", "link", "icon", "inline-icon", "inline-link"] as const
const STATUS_TYPES: StatusIndicatorProps.Type[] = ["success", "error", "warning", "info", "stopped", "pending", "in-progress", "loading", "not-started", "log"]
const ALERT_TYPES = ["success", "info", "warning", "error"] as const
const OPTIONS: SelectProps.Option[] = team.map((m) => ({ value: m.email, label: m.name, description: label(m.role) }))
const XS = series.months

const SECTIONS = [
  { id: "typography", title: "排版与文本", items: ["Box", "TextContent", "Header", "Link", "Divider", "TruncatedText", "CopyToClipboard", "CodeView", "LiveRegion"] },
  { id: "buttons", title: "按钮", items: ["Button", "ButtonDropdown", "ButtonGroup", "ToggleButton", "ActionCard"] },
  {
    id: "inputs",
    title: "表单控件",
    items: ["Input", "Textarea", "PromptInput", "Select", "Multiselect", "Autosuggest", "Checkbox", "RadioGroup", "RadioButton", "Tiles", "Toggle", "Slider", "DatePicker", "DateInput", "Calendar", "TimeInput", "DateRangePicker", "FileUpload", "FileInput", "FileDropzone", "FileTokenGroup", "TokenGroup", "Token", "TagEditor", "AttributeEditor", "PropertyFilter", "TextFilter", "S3ResourceSelector", "Form", "FormField"],
  },
  {
    id: "data",
    title: "数据展示",
    items: ["Table", "Cards", "ItemCard", "KeyValuePairs", "List", "TreeView", "Badge", "StatusIndicator", "Icon", "Popover", "Tooltip", "Avatar", "ChatBubble", "SupportPromptGroup", "LoadingBar", "LineChart", "BarChart", "AreaChart", "MixedLineBarChart", "PieChart"],
  },
  { id: "feedback", title: "反馈", items: ["Alert", "Flashbar", "Modal", "Drawer", "ProgressBar", "Skeleton", "Spinner", "Steps", "ErrorBoundary"] },
  { id: "navigation", title: "导航", items: ["TopNavigation", "SideNavigation", "BreadcrumbGroup", "Tabs", "SegmentedControl", "Pagination", "Wizard", "AnchorNavigation", "CollectionPreferences", "NavigableGroup"] },
  { id: "layout", title: "布局", items: ["AppLayout", "AppLayoutToolbar", "ContentLayout", "Container", "ExpandableSection", "Grid", "ColumnLayout", "SpaceBetween", "PanelLayout", "SplitPanel", "HelpPanel"] },
  { id: "misc", title: "其他", items: ["Hotspot", "AnnotationContext", "TutorialPanel", "IconProvider", "I18nProvider", "CodeEditor"] },
]

function Demo({ name, children, note }: { name: string; children?: ReactNode; note?: string }) {
  return (
    <div id={`c-${name}`} className="gallery-hidden-anchor">
      <SpaceBetween size="xs">
        <Header variant="h3" description={note}>
          {name}
        </Header>
        {children}
      </SpaceBetween>
    </div>
  )
}

function Row({ children }: { children: ReactNode }) {
  return (
    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
      {children}
    </SpaceBetween>
  )
}

function TooltipDemo() {
  const ref = useRef<HTMLSpanElement>(null)
  const [show, setShow] = useState(false)
  return (
    <span ref={ref} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onFocus={() => setShow(true)} onBlur={() => setShow(false)} tabIndex={0}>
      <Badge>悬停查看 Tooltip</Badge>
      {show && <Tooltip content="这是 Tooltip 内容" getTrack={() => ref.current} position="top" />}
    </span>
  )
}

function Boom(): ReactNode {
  throw new Error("演示错误")
}

export function ComponentsPage() {
  const [modal, setModal] = useState<"none" | "basic" | "confirm" | "max" | "scroll">("none")
  const [drawer, setDrawer] = useState<"start" | "end" | "top" | "bottom" | null>(null)
  const [pressed, setPressed] = useState(false)
  const [select, setSelect] = useState<SelectProps.Option | null>(OPTIONS[0])
  const [multi, setMulti] = useState<readonly MultiselectProps.Option[]>(OPTIONS.slice(0, 2))
  const [sugg, setSugg] = useState("")
  const [radio, setRadio] = useState<string | null>("a")
  const [tile, setTile] = useState<string | null>("web")
  const [slider, setSlider] = useState(40)
  const [date, setDate] = useState("2026-09-05")
  const [time, setTime] = useState("09:30")
  const [range, setRange] = useState<DateRangePickerProps.Value | null>({ type: "relative", amount: 7, unit: "day" })
  const [files, setFiles] = useState<File[]>([])
  const [tags, setTags] = useState<readonly TagEditorProps.Tag[]>([{ key: "env", value: "prod", existing: true }, { key: "team", value: "growth", existing: false }])
  const [attrs, setAttrs] = useState([{ key: "region", value: "cn-north-1" }, { key: "tier", value: "pro" }])
  const [query, setQuery] = useState<PropertyFilterProps.Query>({ tokens: [{ propertyKey: "status", operator: "=", value: "paid" }], operation: "and" })
  const [page, setPage] = useState(1)
  const [seg, setSeg] = useState("list")
  const [wizardStep, setWizardStep] = useState(0)
  const [expandedTree, setExpandedTree] = useState<string[]>([nav[0].path])
  const [display, setDisplay] = useState<"all" | "panel-only" | "main-only">("all")
  const [boom, setBoom] = useState(false)
  const [tutorial, setTutorial] = useState<null | { started: boolean }>(null)

  const tutorialDef = {
    title: "快速上手",
    description: "三步了解控制台",
    completedScreenDescription: "完成！",
    completed: false,
    tasks: [
      {
        title: "查看仪表盘",
        steps: [{ title: "统计卡", content: "这里显示关键指标", hotspotId: "hs-stats" }],
      },
    ],
  }

  return (
    <ContentLayout
      header={
        <Header variant="h1" description={`Cloudscape 全部导出组件 × 变体 × 尺寸 × 状态。当前图标集：${iconFamily}`}>
          组件全集
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Container header={<Header variant="h2" counter={`(${contract.components.length})`} description="contract.json 中每个组件在 Cloudscape 的覆盖状态">Contract 覆盖</Header>}>
          <SpaceBetween direction="horizontal" size="xs">
            {(contract.components as string[]).map((name) => (
              <Badge key={name} color={coverage[name] === "missing" ? "red" : coverage[name] === "composed" ? "blue" : "green"}>
                {name} · {coverage[name]}
              </Badge>
            ))}
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">索引</Header>}>
          <ColumnLayout columns={4} minColumnWidth={180}>
            {SECTIONS.map((s) => (
              <AnchorNavigation
                key={s.id}
                ariaLabelledby={s.id}
                anchors={[{ text: s.title, href: `#${s.id}`, level: 1 }, ...s.items.map((i) => ({ text: i, href: `#c-${i}`, level: 2 }))]}
                onFollow={(e) => {
                  e.preventDefault()
                  document.getElementById(e.detail.href.slice(1))?.scrollIntoView({ behavior: "smooth" })
                }}
              />
            ))}
          </ColumnLayout>
        </Container>

        {/* 排版 */}
        <div id="typography" className="gallery-hidden-anchor">
          <Container header={<Header variant="h2">排版与文本</Header>}>
            <SpaceBetween size="l">
              <Demo name="Box" note="variant h1–h5 / p / small / strong / code / pre / samp / awsui-key-label / awsui-value-large">
                {(["h1", "h2", "h3", "h4", "h5"] as const).map((v) => (
                  <Box key={v} variant={v}>
                    标题 {v.toUpperCase()}
                  </Box>
                ))}
                <Box variant="p">正文段落 body-m</Box>
                <Box variant="small">小字 body-s</Box>
                <Box variant="strong">加粗</Box>
                <Box variant="code">inline code</Box>
                <Box variant="pre">pre 预格式化文本</Box>
                <Box variant="samp">samp 示例输出</Box>
                <Box variant="awsui-key-label">key label</Box>
                <Box variant="awsui-value-large">{money(128430)}</Box>
                <Row>
                  {(["text-label", "text-body-secondary", "text-status-error", "text-status-success", "text-status-info", "text-status-inactive", "text-status-warning"] as const).map((c) => (
                    <Box key={c} color={c}>
                      {c}
                    </Box>
                  ))}
                </Row>
                <Row>
                  <Box visualAccent={{ color: "blue", borderRadius: "s" }} padding="xs">
                    visualAccent blue
                  </Box>
                  <Box visualAccent={{ color: "green", borderRadius: "full", aspectRatio: "equal" }} padding="xs">
                    green
                  </Box>
                </Row>
              </Demo>
              <Demo name="TextContent" note="原生 HTML 排版：h1–h5、p、ul/ol、blockquote、code、kbd">
                <TextContent>
                  <h1>H1 标题</h1>
                  <h2>H2 标题</h2>
                  <h3>H3 标题</h3>
                  <h4>H4 标题</h4>
                  <h5>H5 标题</h5>
                  <p>
                    正文包含 <a href="#typography">链接</a>、<code>code</code>、<kbd>Ctrl</kbd> + <kbd>K</kbd> 与 <strong>加粗</strong>。
                  </p>
                  <blockquote>引用：{chat.suggestions[0]}</blockquote>
                  <ul>
                    {nav.slice(0, 3).map((n) => (
                      <li key={n.path}>{n.label}</li>
                    ))}
                  </ul>
                  <ol>
                    {tasks.slice(0, 3).map((t) => (
                      <li key={t.title}>{t.title}</li>
                    ))}
                  </ol>
                </TextContent>
              </Demo>
              <Demo name="Header" note="variant h1 / h2 / h3，counter、description、info、actions">
                <Header variant="h1" counter="(12)" description="描述文字" info={<Link variant="info">信息</Link>} actions={<Button>操作</Button>}>
                  H1
                </Header>
                <Header variant="h2" counter="(5)">
                  H2
                </Header>
                <Header variant="h3">H3</Header>
              </Demo>
              <Demo name="Link" note="variant primary / secondary / info / awsui-value-large；external；fontSize">
                <Row>
                  <Link href="#typography">primary</Link>
                  <Link href="#typography" variant="secondary">
                    secondary
                  </Link>
                  <Link variant="info">info</Link>
                  <Link href="#typography" external>
                    external
                  </Link>
                  <Link href="#typography" fontSize="heading-m">
                    heading-m
                  </Link>
                  <Link href="#typography" variant="awsui-value-large">
                    12,345
                  </Link>
                </Row>
              </Demo>
              <Demo name="Divider" note="horizontal / vertical / 带内容">
                <Divider />
                <Divider>
                  <Box color="text-body-secondary">或</Box>
                </Divider>
                <Row>
                  <span>左</span>
                  <Divider orientation="vertical" />
                  <span>右</span>
                </Row>
              </Demo>
              <Demo name="TruncatedText">
                <div style={{ maxWidth: 220 }}>
                  <TruncatedText tooltipText={chat.messages[1].content.slice(0, 40)}>{chat.messages[1].content.slice(0, 40)}</TruncatedText>
                </div>
              </Demo>
              <Demo name="CopyToClipboard" note="variant button / icon / inline">
                <Row>
                  <CopyToClipboard copyButtonText="复制" copyErrorText="失败" copySuccessText="已复制" textToCopy={orders[0].id} />
                  <CopyToClipboard variant="icon" copyButtonAriaLabel="复制" copyErrorText="失败" copySuccessText="已复制" textToCopy={orders[0].id} />
                  <CopyToClipboard variant="inline" copyButtonAriaLabel="复制" copyErrorText="失败" copySuccessText="已复制" textToCopy={orders[0].id} />
                </Row>
              </Demo>
              <Demo name="CodeView" note="@cloudscape-design/code-view，行号与操作">
                <CodeView content={chat.messages[3].content.replace(/```sql\n|```/g, "")} lineNumbers actions={<CopyToClipboard variant="icon" copyButtonAriaLabel="复制" copyErrorText="失败" copySuccessText="已复制" textToCopy="sql" />} />
              </Demo>
              <Demo name="LiveRegion" note="屏幕阅读器播报区域（视觉隐藏）">
                <LiveRegion>已加载 {orders.length} 条订单</LiveRegion>
                <Box color="text-body-secondary">（LiveRegion 已渲染，仅对辅助技术可见）</Box>
              </Demo>
            </SpaceBetween>
          </Container>
        </div>

        {/* 按钮 */}
        <div id="buttons" className="gallery-hidden-anchor">
          <Container header={<Header variant="h2">按钮</Header>}>
            <SpaceBetween size="l">
              <Demo name="Button" note="variant × 状态（默认 / loading / disabled / disabledReason）× 图标 / fullWidth / href">
                {SIZES.map((v) => (
                  <Row key={v}>
                    <Box variant="awsui-key-label">{v}</Box>
                    <Button variant={v} {...(v.includes("icon") ? { ...iconProps("settings"), ariaLabel: v } : {})}>
                      {v.includes("icon") ? undefined : "默认"}
                    </Button>
                    <Button variant={v} loading {...(v.includes("icon") ? { ...iconProps("settings"), ariaLabel: v } : {})}>
                      {v.includes("icon") ? undefined : "加载中"}
                    </Button>
                    <Button variant={v} disabled disabledReason="无权限" {...(v.includes("icon") ? { ...iconProps("settings"), ariaLabel: v } : {})}>
                      {v.includes("icon") ? undefined : "禁用"}
                    </Button>
                    {!v.includes("icon") && (
                      <Button variant={v} {...iconProps("download")}>
                        带图标
                      </Button>
                    )}
                    {!v.includes("icon") && (
                      <Button variant={v} {...iconProps("arrow-right")} iconAlign="right">
                        右图标
                      </Button>
                    )}
                  </Row>
                ))}
                <Button fullWidth variant="primary">
                  fullWidth
                </Button>
                <Row>
                  <Button href="#buttons">链接按钮</Button>
                  <Button href="#buttons" external>
                    external
                  </Button>
                  <Button formAction="submit">submit</Button>
                  <Button wrapText={false}>不换行</Button>
                </Row>
              </Demo>
              <Demo name="ButtonDropdown" note="variant normal / primary / icon / inline-icon；分组、禁用、loading、mainAction">
                <Row>
                  <ButtonDropdown items={[{ id: "a", text: "编辑" }, { id: "b", text: "禁用项", disabled: true }, { id: "g", text: "更多", items: [{ id: "c", text: "复制" }, { id: "d", text: "删除" }] }]}>normal</ButtonDropdown>
                  <ButtonDropdown variant="primary" items={[{ id: "a", text: "新建订单" }, { id: "b", text: "导入" }]}>
                    primary
                  </ButtonDropdown>
                  <ButtonDropdown variant="icon" ariaLabel="icon" items={[{ id: "a", text: "A" }]} />
                  <ButtonDropdown variant="inline-icon" ariaLabel="inline-icon" items={[{ id: "a", text: "A" }]} />
                  <ButtonDropdown loading items={[{ id: "a", text: "A" }]}>
                    loading
                  </ButtonDropdown>
                  <ButtonDropdown disabled items={[{ id: "a", text: "A" }]}>
                    disabled
                  </ButtonDropdown>
                  <ButtonDropdown variant="primary" mainAction={{ text: "启动" }} items={[{ id: "a", text: "带参数启动" }]} />
                </Row>
              </Demo>
              <Demo name="ButtonGroup" note="variant icon：icon-button / icon-toggle-button / menu-dropdown / group">
                <ButtonGroup
                  variant="icon"
                  ariaLabel="操作组"
                  items={[
                    { type: "group", text: "反馈", items: [{ type: "icon-toggle-button", id: "like", text: "赞", iconName: "thumbs-up", pressedIconName: "thumbs-up-filled", pressed: pressed }, { type: "icon-button", id: "dislike", text: "踩", iconName: "thumbs-down" }] },
                    { type: "icon-button", id: "copy", text: "复制", ...iconProps("copy"), popoverFeedback: <StatusIndicator type="success">已复制</StatusIndicator> },
                    { type: "icon-button", id: "dis", text: "禁用", ...iconProps("trash"), disabled: true },
                    { type: "menu-dropdown", id: "more", text: "更多", items: [{ id: "a", text: "分享" }] },
                  ]}
                  onItemClick={({ detail }) => detail.id === "like" && setPressed((p) => !p)}
                />
              </Demo>
              <Demo name="ToggleButton" note="variant normal / icon × pressed × disabled">
                <Row>
                  <ToggleButton pressed={pressed} onChange={({ detail }) => setPressed(detail.pressed)} iconName="star" pressedIconName="star-filled">
                    收藏
                  </ToggleButton>
                  <ToggleButton variant="icon" pressed={pressed} onChange={({ detail }) => setPressed(detail.pressed)} iconName="heart" pressedIconName="heart-filled" ariaLabel="喜欢" />
                  <ToggleButton pressed disabled iconName="star-filled">
                    禁用
                  </ToggleButton>
                </Row>
              </Demo>
              <Demo name="ActionCard" note="variant default / embedded；带图标 / 禁用">
                <ColumnLayout columns={3}>
                  <ActionCard header="新建项目" description="从模板开始" icon={<AppIcon name={"plus"} size="big" />} onClick={(e) => e.preventDefault()} />
                  <ActionCard variant="embedded" header="导入数据" description="CSV / JSON" icon={<AppIcon name={"upload"} size="big" />} href="#buttons" />
                  <ActionCard header="禁用" description="无权限" disabled icon={<AppIcon name={"lock"} size="big" />} />
                </ColumnLayout>
              </Demo>
            </SpaceBetween>
          </Container>
        </div>

        {/* 表单控件 */}
        <div id="inputs" className="gallery-hidden-anchor">
          <Container header={<Header variant="h2">表单控件</Header>}>
            <SpaceBetween size="l">
              <Demo name="Input" note="type text / search / password / number / email / url；invalid / warning / disabled / readOnly；prefix / suffix；clearAriaLabel">
                <ColumnLayout columns={3}>
                  <Input value="默认" onChange={() => undefined} />
                  <Input type="search" value="搜索" onChange={() => undefined} clearAriaLabel="清除" />
                  <Input type="password" value="password" onChange={() => undefined} />
                  <Input type="number" value="42" onChange={() => undefined} />
                  <Input value="" placeholder="占位文本" onChange={() => undefined} />
                  <Input value="前后缀" prefix={<AppIcon name={"search"} />} suffix="元" onChange={() => undefined} />
                  <Input value="错误" invalid onChange={() => undefined} />
                  <Input value="警告" warning onChange={() => undefined} />
                  <Input value="禁用" disabled onChange={() => undefined} />
                  <Input value="只读" readOnly onChange={() => undefined} />
                </ColumnLayout>
              </Demo>
              <Demo name="Textarea" note="默认 / invalid / disabled / readOnly / autoComplete">
                <ColumnLayout columns={2}>
                  <Textarea value="多行文本" onChange={() => undefined} rows={2} />
                  <Textarea value="错误" invalid onChange={() => undefined} rows={2} />
                  <Textarea value="禁用" disabled onChange={() => undefined} rows={2} />
                  <Textarea value="只读" readOnly onChange={() => undefined} rows={2} />
                </ColumnLayout>
              </Demo>
              <Demo name="PromptInput" note="GenAI 输入框；secondaryActions / secondaryContent / disableActionButton">
                <PromptInput value="" onChange={() => undefined} placeholder="向助手提问…" actionButtonIconName="send" actionButtonAriaLabel="发送" ariaLabel="提示输入" secondaryActions={<Button variant="icon" {...iconProps("paperclip")} ariaLabel="附件" />} secondaryContent={<Box variant="small">Enter 发送</Box>} />
                <PromptInput value="禁用" onChange={() => undefined} disabled actionButtonIconName="send" actionButtonAriaLabel="发送" ariaLabel="禁用输入" />
              </Demo>
              <Demo name="Select" note="默认 / 分组 / 描述与标签 / filteringType / invalid / disabled / loading / error / empty">
                <ColumnLayout columns={3}>
                  <Select selectedOption={select} onChange={({ detail }) => setSelect(detail.selectedOption)} options={OPTIONS} />
                  <Select selectedOption={null} placeholder="分组 + 筛选" filteringType="auto" options={[{ label: "管理", options: OPTIONS.slice(0, 2) }, { label: "成员", options: OPTIONS.slice(2) }]} />
                  <Select selectedOption={OPTIONS[1]} triggerVariant="option" options={OPTIONS.map((o) => ({ ...o, labelTag: "tag", tags: ["t1"], iconName: "user-profile" }))} />
                  <Select selectedOption={null} invalid placeholder="invalid" options={OPTIONS} />
                  <Select selectedOption={select} disabled options={OPTIONS} />
                  <Select selectedOption={null} statusType="loading" loadingText="加载中" placeholder="loading" options={[]} />
                  <Select selectedOption={null} statusType="error" errorText="加载失败" recoveryText="重试" placeholder="error" options={[]} />
                  <Select selectedOption={null} empty="没有选项" placeholder="empty" options={[]} />
                  <Select selectedOption={select} readOnly options={OPTIONS} />
                </ColumnLayout>
              </Demo>
              <Demo name="Multiselect" note="默认 / inlineTokens / tokenLimit / hideTokens / invalid / disabled">
                <ColumnLayout columns={3}>
                  <Multiselect selectedOptions={multi} onChange={({ detail }) => setMulti(detail.selectedOptions)} options={OPTIONS} placeholder="选择成员" />
                  <Multiselect selectedOptions={multi} onChange={({ detail }) => setMulti(detail.selectedOptions)} options={OPTIONS} inlineTokens placeholder="inline" />
                  <Multiselect selectedOptions={multi} onChange={({ detail }) => setMulti(detail.selectedOptions)} options={OPTIONS} tokenLimit={1} placeholder="limit" />
                  <Multiselect selectedOptions={[]} invalid options={OPTIONS} placeholder="invalid" />
                  <Multiselect selectedOptions={multi} disabled options={OPTIONS} />
                  <Multiselect selectedOptions={multi} hideTokens options={OPTIONS} placeholder="hideTokens" />
                </ColumnLayout>
              </Demo>
              <Demo name="Autosuggest" note="Combobox / Autocomplete 对应：自由输入 + 建议列表；loading / error">
                <ColumnLayout columns={3}>
                  <Autosuggest value={sugg} onChange={({ detail }) => setSugg(detail.value)} options={OPTIONS} enteredTextLabel={(v) => `使用 “${v}”`} placeholder="输入姓名" ariaLabel="自动补全" />
                  <Autosuggest value="" statusType="loading" loadingText="加载中" options={[]} enteredTextLabel={(v) => v} placeholder="loading" ariaLabel="加载" />
                  <Autosuggest value="" invalid options={[]} enteredTextLabel={(v) => v} placeholder="invalid" ariaLabel="错误" />
                </ColumnLayout>
              </Demo>
              <Demo name="Checkbox" note="checked / indeterminate / disabled / readOnly / description">
                <Row>
                  <Checkbox checked onChange={() => undefined}>
                    已选
                  </Checkbox>
                  <Checkbox checked={false} onChange={() => undefined}>
                    未选
                  </Checkbox>
                  <Checkbox checked={false} indeterminate onChange={() => undefined}>
                    部分选中
                  </Checkbox>
                  <Checkbox checked disabled onChange={() => undefined}>
                    禁用
                  </Checkbox>
                  <Checkbox checked readOnly onChange={() => undefined} description="带描述">
                    只读
                  </Checkbox>
                </Row>
              </Demo>
              <Demo name="RadioGroup" note="带描述 / 禁用项 / readOnly">
                <RadioGroup value={radio} onChange={({ detail }) => setRadio(detail.value)} items={[{ value: "a", label: "选项 A", description: "描述" }, { value: "b", label: "选项 B" }, { value: "c", label: "禁用", disabled: true }]} />
                <RadioGroup value="a" readOnly items={[{ value: "a", label: "只读" }]} />
              </Demo>
              <Demo name="RadioButton" note="独立单选按钮">
                <Row>
                  <RadioButton name="rb" checked onSelect={() => undefined}>
                    选中
                  </RadioButton>
                  <RadioButton name="rb" checked={false} onSelect={() => undefined}>
                    未选
                  </RadioButton>
                  <RadioButton name="rb" checked={false} disabled>
                    禁用
                  </RadioButton>
                </Row>
              </Demo>
              <Demo name="Tiles" note="卡片式单选，含图片位 / 禁用">
                <Tiles value={tile} onChange={({ detail }) => setTile(detail.value)} columns={3} items={[{ value: "web", label: "Web", description: "浏览器渠道", image: <AppIcon name={"globe"} size="large" /> }, { value: "app", label: "App", description: "移动端", image: <AppIcon name={"grid"} size="large" /> }, { value: "api", label: "API", description: "禁用", disabled: true }]} />
              </Demo>
              <Demo name="Toggle" note="checked / disabled / readOnly / description">
                <Row>
                  <Toggle checked onChange={() => undefined}>
                    开
                  </Toggle>
                  <Toggle checked={false} onChange={() => undefined}>
                    关
                  </Toggle>
                  <Toggle checked disabled onChange={() => undefined}>
                    禁用
                  </Toggle>
                  <Toggle checked readOnly onChange={() => undefined} description="描述">
                    只读
                  </Toggle>
                </Row>
              </Demo>
              <Demo name="Slider" note="默认 / step / referenceValues / hideFillLine / invalid / disabled">
                <Slider value={slider} onChange={({ detail }) => setSlider(detail.value)} min={0} max={100} />
                <Slider value={slider} onChange={({ detail }) => setSlider(detail.value)} min={0} max={100} step={10} tickMarks referenceValues={[25, 50, 75]} />
                <Slider value={30} min={0} max={100} invalid />
                <Slider value={60} min={0} max={100} disabled hideFillLine />
              </Demo>
              <Demo name="DatePicker" note="day / month 粒度；invalid / disabled">
                <ColumnLayout columns={3}>
                  <DatePicker value={date} onChange={({ detail }) => setDate(detail.value)} openCalendarAriaLabel={() => "打开日历"} placeholder="YYYY/MM/DD" />
                  <DatePicker value="2026-09" granularity="month" onChange={() => undefined} openCalendarAriaLabel={() => "打开日历"} placeholder="YYYY/MM" />
                  <DatePicker value="" invalid onChange={() => undefined} openCalendarAriaLabel={() => "打开日历"} placeholder="invalid" />
                  <DatePicker value={date} disabled onChange={() => undefined} openCalendarAriaLabel={() => "打开日历"} />
                </ColumnLayout>
              </Demo>
              <Demo name="DateInput">
                <ColumnLayout columns={3}>
                  <DateInput value={date} onChange={({ detail }) => setDate(detail.value)} placeholder="YYYY/MM/DD" />
                  <DateInput value="" invalid onChange={() => undefined} placeholder="invalid" />
                  <DateInput value={date} disabled onChange={() => undefined} />
                </ColumnLayout>
              </Demo>
              <Demo name="Calendar" note="day / month 粒度，禁用日期">
                <ColumnLayout columns={2}>
                  <Calendar value={date} onChange={({ detail }) => setDate(detail.value)} locale="zh-CN" isDateEnabled={(d) => d.getDay() !== 0} dateDisabledReason={() => "周日不可选"} />
                  <Calendar value="2026-09" granularity="month" onChange={() => undefined} locale="zh-CN" />
                </ColumnLayout>
              </Demo>
              <Demo name="TimeInput" note="hh:mm / hh:mm:ss / 12 小时制；invalid / disabled">
                <ColumnLayout columns={4}>
                  <TimeInput value={time} onChange={({ detail }) => setTime(detail.value)} format="hh:mm" placeholder="hh:mm" />
                  <TimeInput value="09:30:00" format="hh:mm:ss" onChange={() => undefined} placeholder="hh:mm:ss" />
                  <TimeInput value={time} use24Hour={false} onChange={() => undefined} placeholder="hh:mm" />
                  <TimeInput value="" invalid onChange={() => undefined} placeholder="invalid" />
                </ColumnLayout>
              </Demo>
              <Demo name="DateRangePicker" note="absolute + relative；dateOnly；invalid / disabled">
                <ColumnLayout columns={2}>
                  <DateRangePicker value={range} onChange={({ detail }) => setRange(detail.value)} relativeOptions={[{ key: "7d", amount: 7, unit: "day", type: "relative" }, { key: "30d", amount: 30, unit: "day", type: "relative" }]} isValidRange={() => ({ valid: true })} placeholder="选择区间" />
                  <DateRangePicker value={null} dateOnly rangeSelectorMode="absolute-only" onChange={() => undefined} relativeOptions={[]} isValidRange={() => ({ valid: true })} placeholder="仅绝对日期" />
                  <DateRangePicker value={null} invalid onChange={() => undefined} relativeOptions={[]} isValidRange={() => ({ valid: true })} placeholder="invalid" />
                  <DateRangePicker value={range} disabled onChange={() => undefined} relativeOptions={[]} isValidRange={() => ({ valid: true })} />
                </ColumnLayout>
              </Demo>
              <Demo name="FileUpload" note="单 / 多文件、拖拽、约束与错误">
                <ColumnLayout columns={2}>
                  <FileUpload value={files} onChange={({ detail }) => setFiles(detail.value)} multiple showFileSize showFileLastModified constraintText="最多 3 个" tokenLimit={3} i18nStrings={{ uploadButtonText: (m) => (m ? "选择文件" : "选择文件"), dropzoneText: (m) => (m ? "拖拽多个文件" : "拖拽文件"), removeFileAriaLabel: (i) => `移除 ${i + 1}`, limitShowFewer: "收起", limitShowMore: "更多", errorIconAriaLabel: "错误" }} />
                  <FileUpload value={[]} onChange={() => undefined} errorText="文件过大" i18nStrings={{ uploadButtonText: () => "选择文件", dropzoneText: () => "拖拽文件", removeFileAriaLabel: () => "移除", limitShowFewer: "收起", limitShowMore: "更多", errorIconAriaLabel: "错误" }} />
                </ColumnLayout>
              </Demo>
              <Demo name="FileInput" note="variant button / icon">
                <Row>
                  <FileInput value={files} onChange={({ detail }) => setFiles(detail.value)} multiple>
                    选择文件
                  </FileInput>
                  <FileInput variant="icon" ariaLabel="选择文件" value={files} onChange={({ detail }) => setFiles(detail.value)} />
                </Row>
              </Demo>
              <Demo name="FileDropzone">
                <FileDropzone onChange={({ detail }) => setFiles(detail.value)}>
                  <Box textAlign="center" color="text-body-secondary">
                    <AppIcon name={"upload"} /> 拖拽文件到此处
                  </Box>
                </FileDropzone>
              </Demo>
              <Demo name="FileTokenGroup" note="horizontal / vertical；loading / error / warning">
                <FileTokenGroup
                  alignment="horizontal"
                  onDismiss={() => undefined}
                  showFileSize
                  items={[
                    { file: new File(["a"], "report.pdf", { type: "application/pdf" }) },
                    { file: new File(["b"], "uploading.csv"), loading: true },
                    { file: new File(["c"], "bad.png"), errorText: "格式不支持" },
                    { file: new File(["d"], "big.zip"), warningText: "文件较大" },
                  ]}
                  i18nStrings={{ removeFileAriaLabel: (i, n) => `移除 ${n} ${i}`, errorIconAriaLabel: "错误", warningIconAriaLabel: "警告" }}
                />
              </Demo>
              <Demo name="TokenGroup" note="horizontal / vertical；limit；禁用 / readOnly / 带图标">
                <TokenGroup items={[{ label: "paid", dismissLabel: "移除" }, { label: "pending", description: "描述", tags: ["tag"], dismissLabel: "移除" }, { label: "禁用", disabled: true }, { label: "图标", iconName: "status-positive" }]} onDismiss={() => undefined} />
                <TokenGroup alignment="vertical" limit={2} items={team.map((m) => ({ label: m.name, description: m.email, dismissLabel: "移除" }))} onDismiss={() => undefined} readOnly />
              </Demo>
              <Demo name="Token" note="variant normal / inline；disabled / readOnly">
                <Row>
                  <Token label="normal" dismissLabel="移除" onDismiss={() => undefined} />
                  <Token label="inline" variant="inline" dismissLabel="移除" onDismiss={() => undefined} />
                  <Token label="带描述" description="描述" tags={["tag"]} labelTag="tag" />
                  <Token label="禁用" disabled dismissLabel="移除" />
                  <Token label="只读" readOnly />
                  <Token label="图标" icon={<AppIcon name={"tag"} />} />
                </Row>
              </Demo>
              <Demo name="TagEditor" note="键值对标签编辑，含 undo 与限制">
                <TagEditor
                  tags={tags}
                  onChange={({ detail }) => setTags(detail.tags)}
                  tagLimit={5}
                  keysRequest={() => Promise.resolve(["env", "team", "owner"])}
                  valuesRequest={() => Promise.resolve(["prod", "staging"])}
                  i18nStrings={{
                    keyPlaceholder: "键",
                    valuePlaceholder: "值",
                    addButton: "添加标签",
                    removeButton: "移除",
                    undoButton: "撤销",
                    undoPrompt: "将在保存时移除",
                    loading: "加载中",
                    keyHeader: "键",
                    valueHeader: "值",
                    optional: "可选",
                    keySuggestion: "自定义键",
                    valueSuggestion: "自定义值",
                    emptyTags: "暂无标签",
                    tooManyKeysSuggestion: "键太多",
                    tooManyValuesSuggestion: "值太多",
                    keysSuggestionLoading: "加载键",
                    keysSuggestionError: "加载失败",
                    valuesSuggestionLoading: "加载值",
                    valuesSuggestionError: "加载失败",
                    emptyKeyError: "键不能为空",
                    maxKeyCharLengthError: "键过长",
                    maxValueCharLengthError: "值过长",
                    duplicateKeyError: "键重复",
                    invalidKeyError: "键无效",
                    invalidValueError: "值无效",
                    awsPrefixError: "不能以 aws: 开头",
                    tagLimit: (n) => `最多 ${n} 个标签`,
                    tagLimitReached: (n) => `已达 ${n} 个上限`,
                    tagLimitExceeded: (n) => `超过 ${n} 个上限`,
                    enteredKeyLabel: (k) => `使用 “${k}”`,
                    enteredValueLabel: (v) => `使用 “${v}”`,
                  }}
                />
              </Demo>
              <Demo name="AttributeEditor" note="动态键值行编辑（Transfer / Cascader 的替代组合）">
                <AttributeEditor
                  items={attrs}
                  onAddButtonClick={() => setAttrs((a) => [...a, { key: "", value: "" }])}
                  onRemoveButtonClick={({ detail }) => setAttrs((a) => a.filter((_, i) => i !== detail.itemIndex))}
                  addButtonText="添加属性"
                  removeButtonText="移除"
                  empty="暂无属性"
                  definition={[
                    { label: "键", control: (item, i) => <Input value={item.key} onChange={({ detail }) => setAttrs((a) => a.map((x, j) => (j === i ? { ...x, key: detail.value } : x)))} /> },
                    { label: "值", control: (item, i) => <Input value={item.value} onChange={({ detail }) => setAttrs((a) => a.map((x, j) => (j === i ? { ...x, value: detail.value } : x)))} />, errorText: (item) => (item.value ? undefined : "必填") },
                  ]}
                />
              </Demo>
              <Demo name="PropertyFilter" note="属性 + 操作符 + 值的结构化筛选">
                <PropertyFilter
                  query={query}
                  onChange={({ detail }) => setQuery(detail)}
                  countText={`${orders.length} 条匹配`}
                  filteringPlaceholder="按属性筛选订单"
                  filteringProperties={[
                    { key: "status", propertyLabel: "状态", groupValuesLabel: "状态值", operators: ["=", "!="] },
                    { key: "channel", propertyLabel: "渠道", groupValuesLabel: "渠道值", operators: ["=", "!=", ":"] },
                    { key: "amount", propertyLabel: "金额", groupValuesLabel: "金额值", operators: [">", "<", ">=", "<="] },
                  ]}
                  filteringOptions={[...new Set(orders.map((o) => o.status))].map((s) => ({ propertyKey: "status", value: s }))}
                  enableTokenGroups
                />
              </Demo>
              <Demo name="TextFilter" note="带计数 / 禁用">
                <ColumnLayout columns={2}>
                  <TextFilter filteringText="" filteringPlaceholder="搜索" filteringAriaLabel="搜索" countText="12 条匹配" />
                  <TextFilter filteringText="禁用" filteringAriaLabel="禁用" disabled />
                </ColumnLayout>
              </Demo>
              <Demo name="S3ResourceSelector" note="AWS 资源选择器，此处以 mock 存储桶数据演示（无网络请求）">
                <S3ResourceSelector
                  resource={{ uri: "" }}
                  selectableItemsTypes={["buckets", "objects"]}
                  fetchBuckets={() => Promise.resolve(team.map((m) => ({ Name: `bucket-${m.email.split("@")[0]}`, CreationDate: "2026-01-01T00:00:00Z", Region: "cn-north-1" })))}
                  fetchObjects={() => Promise.resolve(orders.slice(0, 3).map((o) => ({ Key: `${o.id}.json`, Size: o.amount, LastModified: `${o.date}T00:00:00Z` })))}
                  fetchVersions={() => Promise.resolve([])}
                  i18nStrings={{
                    inContextInputPlaceholder: "s3://bucket/prefix/object",
                    inContextSelectPlaceholder: "选择版本",
                    inContextBrowseButton: "浏览 S3",
                    inContextViewButton: "查看",
                    inContextViewButtonAriaLabel: "查看",
                    inContextLoadingText: "加载中",
                    inContextUriLabel: "S3 URI",
                    inContextVersionSelectLabel: "对象版本",
                    modalTitle: "选择资源",
                    modalCancelButton: "取消",
                    modalSubmitButton: "选择",
                    modalBreadcrumbRootItem: "S3 存储桶",
                    selectionBuckets: "存储桶",
                    selectionObjects: "对象",
                    selectionVersions: "版本",
                    selectionBucketsSearchPlaceholder: "搜索存储桶",
                    selectionObjectsSearchPlaceholder: "搜索对象",
                    selectionVersionsSearchPlaceholder: "搜索版本",
                    selectionBucketsLoading: "加载中",
                    selectionBucketsNoItems: "无存储桶",
                    selectionObjectsLoading: "加载中",
                    selectionObjectsNoItems: "无对象",
                    selectionVersionsLoading: "加载中",
                    selectionVersionsNoItems: "无版本",
                    filteringCounterText: (n) => `${n} 条匹配`,
                    filteringNoMatches: "无匹配",
                    filteringCantFindMatch: "找不到匹配项",
                    clearFilterButtonText: "清除",
                    columnBucketName: "名称",
                    columnBucketCreationDate: "创建日期",
                    columnBucketRegion: "区域",
                    columnObjectKey: "键",
                    columnObjectLastModified: "最后修改",
                    columnObjectSize: "大小",
                    columnVersionID: "版本 ID",
                    columnVersionLastModified: "最后修改",
                    columnVersionSize: "大小",
                    validationPathMustBegin: "路径须以 s3:// 开头",
                    validationBucketLowerCase: "须小写",
                    validationBucketMustNotContain: "不能包含大写",
                    validationBucketLength: "长度 3–63",
                    validationBucketMustComplyDns: "须符合 DNS",
                    labelSortedDescending: (c) => `${c} 降序`,
                    labelSortedAscending: (c) => `${c} 升序`,
                    labelNotSorted: (c) => `${c} 未排序`,
                    labelsPagination: { nextPageLabel: "下一页", previousPageLabel: "上一页", pageLabel: (n) => `第 ${n} 页` },
                    labelsBucketsSelection: { itemSelectionLabel: (_, i) => i.Name ?? "", selectionGroupLabel: "存储桶" },
                    labelsObjectsSelection: { itemSelectionLabel: (_, i) => i.Key ?? "", selectionGroupLabel: "对象" },
                    labelsVersionsSelection: { itemSelectionLabel: (_, i) => i.VersionId ?? "", selectionGroupLabel: "版本" },
                    labelFiltering: (t) => `筛选 ${t}`,
                    labelRefresh: "刷新",
                    labelModalDismiss: "关闭",
                    labelBreadcrumbs: "路径",
                  }}
                />
              </Demo>
              <Demo name="Form" note="Form + FormField（水平列 / 垂直 / 内联）、errorText / warningText / constraintText / info / secondaryControl / stretch">
                <Form header={<Header variant="h2" description="表单容器">垂直布局</Header>} actions={<Row><Button variant="link">取消</Button><Button variant="primary">提交</Button></Row>} errorText="表单级错误提示" secondaryActions={<Button>保存草稿</Button>}>
                  <SpaceBetween size="m">
                    <FormField label="必填字段" description="描述" constraintText="约束文案" info={<Link variant="info">帮助</Link>}>
                      <Input value="" onChange={() => undefined} />
                    </FormField>
                    <FormField label="错误字段" errorText="错误信息">
                      <Input value="x" invalid onChange={() => undefined} />
                    </FormField>
                    <FormField label="警告字段" warningText="警告信息" secondaryControl={<Button>验证</Button>}>
                      <Input value="y" warning onChange={() => undefined} />
                    </FormField>
                    <FormField label="拉伸" stretch>
                      <Input value="stretch" onChange={() => undefined} />
                    </FormField>
                  </SpaceBetween>
                </Form>
                <ColumnLayout columns={3}>
                  <FormField label="水平 1">
                    <Input value="" onChange={() => undefined} />
                  </FormField>
                  <FormField label="水平 2">
                    <Input value="" onChange={() => undefined} />
                  </FormField>
                  <FormField label="水平 3">
                    <Input value="" onChange={() => undefined} />
                  </FormField>
                </ColumnLayout>
                <Row>
                  <FormField label="内联">
                    <Input value="" onChange={() => undefined} />
                  </FormField>
                  <FormField label="&nbsp;">
                    <Button>提交</Button>
                  </FormField>
                </Row>
              </Demo>
            </SpaceBetween>
          </Container>
        </div>

        {/* 数据展示 */}
        <div id="data" className="gallery-hidden-anchor">
          <Container header={<Header variant="h2">数据展示</Header>}>
            <SpaceBetween size="l">
              <Demo name="Table" note="variant container / embedded / borderless / stacked；single / multi 选择；排序、可调列宽、striped、loading、empty、footer、expandable rows、sticky columns、inline edit">
                <Table<Order>
                  variant="embedded"
                  selectionType="multi"
                  selectedItems={[orders[0]]}
                  sortingColumn={{ sortingField: "amount" }}
                  sortingDescending
                  resizableColumns
                  stripedRows
                  stickyColumns={{ first: 1, last: 1 }}
                  items={orders.slice(0, 4)}
                  trackBy="id"
                  header={<Header counter="(4)">embedded + multi</Header>}
                  footer={<Box textAlign="center"><Link>查看全部</Link></Box>}
                  columnDefinitions={[
                    { id: "id", header: "订单", cell: (o) => o.id, sortingField: "id", isRowHeader: true },
                    { id: "customer", header: "客户", cell: (o) => o.customer, sortingField: "customer", editConfig: { ariaLabel: "编辑客户", editIconAriaLabel: "可编辑", editingCell: (o, { currentValue, setValue }) => <Input value={currentValue ?? o.customer} onChange={({ detail }) => setValue(detail.value)} /> } },
                    { id: "status", header: "状态", cell: (o) => <OrderStatus status={o.status} /> },
                    { id: "amount", header: <Box textAlign="right">金额</Box>, cell: (o) => <Box textAlign="right">{money(o.amount, o.currency)}</Box>, sortingField: "amount" },
                    { id: "actions", header: "操作", cell: () => <ButtonDropdown variant="inline-icon" ariaLabel="操作" items={[{ id: "a", text: "编辑" }]} /> },
                  ]}
                  submitEdit={() => undefined}
                  ariaLabels={{ selectionGroupLabel: "选择", allItemsSelectionLabel: () => "全选", itemSelectionLabel: (_, o) => o.id }}
                />
                <Table<Order>
                  variant="borderless"
                  selectionType="single"
                  selectedItems={[orders[1]]}
                  items={orders.slice(0, 3)}
                  trackBy="id"
                  expandableRows={{ getItemChildren: (o) => (o.id === orders[0].id ? orders.slice(4, 6) : []), isItemExpandable: (o) => o.id === orders[0].id, expandedItems: [orders[0]], onExpandableItemToggle: () => undefined }}
                  header={<Header>borderless + single + expandable</Header>}
                  columnDefinitions={[
                    { id: "id", header: "订单", cell: (o) => o.id },
                    { id: "product", header: "产品", cell: (o) => o.product },
                  ]}
                />
                <ColumnLayout columns={2}>
                  <Table<Order> variant="stacked" loading loadingText="加载中" items={[]} columnDefinitions={[{ id: "id", header: "订单", cell: (o) => o.id }]} header={<Header>loading</Header>} />
                  <Table<Order> variant="container" items={[]} empty={<Box textAlign="center" padding="m"><SpaceBetween size="xs"><b>没有数据</b><Button>新建</Button></SpaceBetween></Box>} columnDefinitions={[{ id: "id", header: "订单", cell: (o) => o.id }]} header={<Header>empty</Header>} />
                </ColumnLayout>
              </Demo>
              <Demo name="Cards" note="卡片集合：selection、cardsPerRow、loading / empty">
                <Cards<Member>
                  items={team.slice(0, 3)}
                  trackBy="email"
                  selectionType="multi"
                  selectedItems={[team[0]]}
                  cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 3 }]}
                  header={<Header counter="(3)">成员</Header>}
                  cardDefinition={{
                    header: (m) => (
                      <Row>
                        <PersonAvatar name={m.name} size="small" />
                        <span>{m.name}</span>
                      </Row>
                    ),
                    sections: [
                      { id: "role", header: "角色", content: (m) => label(m.role) },
                      { id: "email", header: "邮箱", content: (m) => m.email },
                    ],
                  }}
                  ariaLabels={{ selectionGroupLabel: "选择", itemSelectionLabel: (_, m) => m.name }}
                />
                <Cards<Member> items={[]} loading loadingText="加载中" cardDefinition={{ header: (m) => m.name }} />
                <Cards<Member> items={[]} empty="没有卡片" cardDefinition={{ header: (m) => m.name }} />
              </Demo>
              <Demo name="ItemCard" note="variant default / embedded；header / description / icon / actions / footer">
                <ColumnLayout columns={2}>
                  <ItemCard header={tasks[0].title} description={`负责人 ${tasks[0].owner}`} icon={<AppIcon name={"clipboard"} size="big" />} actions={<Button variant="inline-icon" {...iconProps("more-horizontal")} ariaLabel="更多" />} footer={<ProgressBar value={tasks[0].progress} variant="key-value" label="进度" />}>
                    卡片正文内容
                  </ItemCard>
                  <ItemCard variant="embedded" header="embedded" description="嵌入式变体">
                    正文
                  </ItemCard>
                </ColumnLayout>
              </Demo>
              <Demo name="KeyValuePairs" note="Descriptions / Statistic 对应；columns、group、info、minColumnWidth">
                <KeyValuePairs
                  columns={3}
                  items={[
                    { type: "group", title: "订单", items: [{ label: "编号", value: orders[0].id }, { label: "状态", value: <OrderStatus status={orders[0].status} /> }] },
                    { type: "group", title: "金额", items: [{ label: "总额", value: <Box variant="awsui-value-large">{money(orders[0].amount)}</Box>, info: <Link variant="info">说明</Link> }] },
                    { type: "group", title: "进度", items: [{ label: "完成度", value: <ProgressBar value={tasks[0].progress} variant="key-value" /> }] },
                  ]}
                />
              </Demo>
              <Demo name="List" note="ol / ul、icon、secondaryContent、actions、sortable（拖拽排序）">
                <List
                  ariaLabel="任务列表"
                  sortable
                  items={tasks}
                  renderItem={(t) => ({ id: t.title, content: t.title, secondaryContent: `${t.owner} · ${t.progress}%`, icon: <AppIcon name={"clipboard"} />, actions: <Button variant="inline-icon" {...iconProps("trash")} ariaLabel="删除" /> })}
                />
                <List tagOverride="ol" ariaLabel="有序" items={nav.slice(0, 3)} renderItem={(n) => ({ id: n.path, content: n.label })} disablePaddings />
              </Demo>
              <Demo name="TreeView" note="Tree 对应：可展开层级、connectorLines">
                <TreeView<NavItem>
                  ariaLabel="导航树"
                  items={nav.slice(0, 3)}
                  expandedItems={expandedTree}
                  onItemToggle={({ detail }) => setExpandedTree((e) => (detail.expanded ? [...e, detail.id] : e.filter((x) => x !== detail.id)))}
                  getItemId={(n) => n.path}
                  getItemChildren={(n) => (n.path === nav[0].path ? nav.slice(3, 6) : undefined)}
                  renderItem={(n) => ({ content: n.label, secondaryContent: n.path, icon: <AppIcon name={n.icon} /> })}
                  connectorLines="vertical"
                />
              </Demo>
              <Demo name="Badge" note="全部颜色，含 severity">
                <Row>
                  {(["blue", "grey", "green", "red", "severity-critical", "severity-high", "severity-medium", "severity-low", "severity-neutral"] as const).map((c) => (
                    <Badge key={c} color={c}>
                      {c}
                    </Badge>
                  ))}
                </Row>
              </Demo>
              <Demo name="StatusIndicator" note="全部 type；colorOverride；wrapText">
                <Row>
                  {STATUS_TYPES.map((t) => (
                    <StatusIndicator key={t} type={t}>
                      {t}
                    </StatusIndicator>
                  ))}
                  <StatusIndicator type="info" colorOverride="green">
                    colorOverride
                  </StatusIndicator>
                </Row>
              </Demo>
              <Demo name="Icon" note="size small / normal / medium / big / large × variant normal / disabled / error / inverted / link / subtle / success / warning；自定义 svg">
                <Row>
                  {(["small", "normal", "medium", "big", "large"] as const).map((s) => (
                    <Icon key={s} name="settings" size={s} />
                  ))}
                </Row>
                <Row>
                  {(["normal", "disabled", "error", "link", "subtle", "success", "warning"] as const).map((v) => (
                    <Icon key={v} name="status-positive" variant={v} />
                  ))}
                  <AppIcon name={"sparkles"} size="big" />
                </Row>
              </Demo>
              <Demo name="Popover" note="Popconfirm / Popover 对应：triggerType text / custom；size small / medium / large；position；dismissButton；header；renderWithPortal">
                <Row>
                  <Popover header="Popover 标题" content="内容" size="small">
                    text 触发
                  </Popover>
                  <Popover triggerType="custom" position="right" size="medium" dismissButton={false} content={<Row><Box>确认删除？</Box><Button variant="primary">确认</Button></Row>}>
                    <Button>Popconfirm（custom）</Button>
                  </Popover>
                  <Popover triggerType="custom" size="large" position="bottom" fixedWidth renderWithPortal content={<KeyValuePairs items={[{ label: "订单", value: orders[0].id }]} />}>
                    <Button variant="icon" {...iconProps("circle-help")} ariaLabel="帮助" />
                  </Popover>
                  <Popover content="状态说明" triggerType="custom" position="top">
                    <StatusIndicator type="success">status + popover</StatusIndicator>
                  </Popover>
                </Row>
              </Demo>
              <Demo name="Tooltip" note="悬停显示">
                <TooltipDemo />
              </Demo>
              <Demo name="Avatar" note="@cloudscape-design/chat-components：initials / icon / gen-ai / loading / width">
                <Row>
                  <Avatar ariaLabel="用户" initials="林" tooltipText={team[0].name} />
                  <Avatar ariaLabel="用户" iconName="user-profile" />
                  <Avatar ariaLabel="助手" color="gen-ai" iconName="gen-ai" />
                  <Avatar ariaLabel="加载" color="gen-ai" loading />
                  <Avatar ariaLabel="大" initials="AC" width={48} />
                  <span className="gallery-avatar-stack">
                    {team.slice(0, 4).map((m) => (
                      <PersonAvatar key={m.email} name={m.name} size="small" />
                    ))}
                  </span>
                </Row>
              </Demo>
              <Demo name="ChatBubble" note="incoming / outgoing；showLoadingBar；actions；hideAvatar">
                <ChatBubble type="outgoing" ariaLabel="用户消息" avatar={<PersonAvatar name={team[0].name} />}>
                  {chat.messages[0].content}
                </ChatBubble>
                <ChatBubble type="incoming" ariaLabel="助手消息" avatar={<Avatar color="gen-ai" iconName="gen-ai" ariaLabel="助手" />} actions={<ButtonGroup variant="icon" ariaLabel="操作" items={[{ type: "icon-button", id: "c", text: "复制", ...iconProps("copy") }]} />}>
                  {chat.messages[2].content}
                </ChatBubble>
                <ChatBubble type="incoming" ariaLabel="生成中" showLoadingBar avatar={<Avatar color="gen-ai" iconName="gen-ai" ariaLabel="助手" loading />}>
                  正在生成…
                </ChatBubble>
                <ChatBubble type="incoming" ariaLabel="无头像" hideAvatar avatar={null}>
                  hideAvatar
                </ChatBubble>
              </Demo>
              <Demo name="SupportPromptGroup" note="horizontal / vertical">
                <SupportPromptGroup ariaLabel="建议" alignment="horizontal" items={chat.suggestions.map((s, i) => ({ id: `p${i}`, text: s }))} onItemClick={() => undefined} />
              </Demo>
              <Demo name="LoadingBar" note="gen-ai / gen-ai-masked">
                <LoadingBar variant="gen-ai" />
                <LoadingBar variant="gen-ai-masked" />
              </Demo>
              <Demo name="LineChart" note="多序列 + threshold；loading / empty / error 状态">
                <LineChart height={200} hideFilter xScaleType="categorical" xDomain={XS} ariaLabel="收入" series={[{ title: "收入", type: "line", data: XS.map((m, i) => ({ x: m, y: series.revenue[i] })) }, { title: "订单", type: "line", data: XS.map((m, i) => ({ x: m, y: series.orders[i] })) }, { title: "目标", type: "threshold", y: 120 }]} />
                <ColumnLayout columns={3}>
                  <LineChart height={120} hideFilter hideLegend statusType="loading" loadingText="加载中" series={[]} ariaLabel="loading" />
                  <LineChart height={120} hideFilter hideLegend series={[]} empty={<Box textAlign="center">没有数据</Box>} ariaLabel="empty" />
                  <LineChart height={120} hideFilter hideLegend statusType="error" errorText="加载失败" recoveryText="重试" onRecoveryClick={() => undefined} series={[]} ariaLabel="error" />
                </ColumnLayout>
              </Demo>
              <Demo name="BarChart" note="stacked / horizontal">
                <ColumnLayout columns={2}>
                  <BarChart height={200} hideFilter xScaleType="categorical" xDomain={XS} stackedBars ariaLabel="堆叠柱" series={[{ title: "收入", type: "bar", data: XS.map((m, i) => ({ x: m, y: series.revenue[i] })) }, { title: "订单", type: "bar", data: XS.map((m, i) => ({ x: m, y: series.orders[i] })) }]} />
                  <BarChart height={200} hideFilter xScaleType="categorical" xDomain={XS.slice(0, 4)} horizontalBars ariaLabel="横向柱" series={[{ title: "订单", type: "bar", data: XS.slice(0, 4).map((m, i) => ({ x: m, y: series.orders[i] })) }]} />
                </ColumnLayout>
              </Demo>
              <Demo name="AreaChart">
                <AreaChart height={200} hideFilter xScaleType="categorical" xDomain={XS} ariaLabel="面积图" series={[{ title: "收入", type: "area", data: XS.map((m, i) => ({ x: m, y: series.revenue[i] })) }, { title: "订单", type: "area", data: XS.map((m, i) => ({ x: m, y: series.orders[i] })) }]} />
              </Demo>
              <Demo name="MixedLineBarChart">
                <MixedLineBarChart height={200} hideFilter xScaleType="categorical" xDomain={XS} ariaLabel="混合图" series={[{ title: "订单", type: "bar", data: XS.map((m, i) => ({ x: m, y: series.orders[i] })) }, { title: "收入", type: "line", data: XS.map((m, i) => ({ x: m, y: series.revenue[i] })) }]} />
              </Demo>
              <Demo name="PieChart" note="pie / donut × size small / medium / large；loading / empty">
                <ColumnLayout columns={3}>
                  <PieChart size="small" hideFilter hideLegend ariaLabel="pie" data={series.byChannel.map((c) => ({ title: c.name, value: c.value }))} />
                  <PieChart variant="donut" size="medium" hideFilter ariaLabel="donut" innerMetricValue="100%" innerMetricDescription="渠道" data={series.byChannel.map((c) => ({ title: c.name, value: c.value }))} />
                  <PieChart size="large" hideFilter hideLegend statusType="loading" loadingText="加载中" ariaLabel="loading" data={[]} />
                </ColumnLayout>
              </Demo>
            </SpaceBetween>
          </Container>
        </div>

        {/* 反馈 */}
        <div id="feedback" className="gallery-hidden-anchor">
          <Container header={<Header variant="h2">反馈</Header>}>
            <SpaceBetween size="l">
              <Demo name="Alert" note="4 级 × header / action / dismissible">
                {ALERT_TYPES.map((t) => (
                  <Alert key={t} type={t} header={`${t} 标题`} dismissible action={<Button>操作</Button>}>
                    {t} 内容说明。
                  </Alert>
                ))}
                <Alert>无 header 的 info</Alert>
              </Demo>
              <Demo name="Flashbar" note="Toast / Notification 对应：4 级 + in-progress loading + 带操作 + stackItems">
                <Flashbar
                  stackItems
                  items={[
                    { id: "1", type: "success", header: "已保存", content: "设置已更新", dismissible: true, dismissLabel: "关闭", onDismiss: () => undefined, action: <Button>查看</Button> },
                    { id: "2", type: "info", content: "新版本可用" },
                    { id: "3", type: "warning", content: "存储空间即将用尽" },
                    { id: "4", type: "error", header: "失败", content: "导出失败，请重试", action: <Button>重试</Button> },
                    { id: "5", type: "in-progress", loading: true, content: "正在导出…" },
                  ]}
                  i18nStrings={{ ariaLabel: "通知", notificationBarAriaLabel: "查看全部通知", notificationBarText: "通知", errorIconAriaLabel: "错误", warningIconAriaLabel: "警告", successIconAriaLabel: "成功", infoIconAriaLabel: "信息", inProgressIconAriaLabel: "进行中" }}
                />
              </Demo>
              <Demo name="Modal" note="Dialog 对应：basic / confirm / size max（全屏） / 可滚动">
                <Row>
                  <Button onClick={() => setModal("basic")}>普通</Button>
                  <Button onClick={() => setModal("confirm")}>确认</Button>
                  <Button onClick={() => setModal("max")}>全屏</Button>
                  <Button onClick={() => setModal("scroll")}>可滚动</Button>
                </Row>
                <Modal visible={modal === "basic"} onDismiss={() => setModal("none")} header="普通对话框" footer={<Box float="right"><Button variant="primary" onClick={() => setModal("none")}>确定</Button></Box>}>
                  内容
                </Modal>
                <Modal visible={modal === "confirm"} onDismiss={() => setModal("none")} header="确认操作" footer={<Box float="right"><Row><Button variant="link" onClick={() => setModal("none")}>取消</Button><Button variant="primary" onClick={() => setModal("none")}>删除</Button></Row></Box>}>
                  <Alert type="warning">此操作不可撤销。</Alert>
                </Modal>
                <Modal visible={modal === "max"} size="max" onDismiss={() => setModal("none")} header="全屏对话框">
                  <Box padding="xxl">内容占满可用宽度</Box>
                </Modal>
                <Modal visible={modal === "scroll"} size="medium" onDismiss={() => setModal("none")} header="可滚动内容">
                  <TextContent>
                    {Array.from({ length: 20 }, (_, i) => (
                      <p key={i}>
                        {i + 1}. {chat.suggestions[i % chat.suggestions.length]}
                      </p>
                    ))}
                  </TextContent>
                </Modal>
              </Demo>
              <Demo name="Drawer" note="4 方向（placement start / end / top / bottom）+ position fixed + backdrop；亦可作 AppLayout 抽屉">
                <Row>
                  {(["start", "end", "top", "bottom"] as const).map((p) => (
                    <Button key={p} onClick={() => setDrawer(p)}>
                      {p}
                    </Button>
                  ))}
                </Row>
                <Drawer position="fixed" placement={drawer ?? "end"} open={!!drawer} backdrop onClose={() => setDrawer(null)} header={<Header variant="h2">Drawer · {drawer}</Header>} ariaLabel="抽屉" closeAction={{ ariaLabel: "关闭" }} footer={<Button variant="primary" onClick={() => setDrawer(null)}>完成</Button>}>
                  <KeyValuePairs items={[{ label: "位置", value: drawer ?? "" }]} />
                </Drawer>
                <Drawer position="static" header={<Header variant="h2">静态 Drawer</Header>} loading={false}>
                  inline 展示
                </Drawer>
              </Demo>
              <Demo name="ProgressBar" note="standalone / flash / key-value × in-progress / success / error；resultButton">
                <ProgressBar value={tasks[0].progress} label="标准" description="描述" additionalInfo="附加信息" />
                <ProgressBar value={100} status="success" resultText="完成" resultButtonText="查看" label="成功" />
                <ProgressBar status="error" resultText="失败" label="错误" />
                <ProgressBar value={45} variant="key-value" label="key-value" />
                <Flashbar items={[{ id: "p", type: "in-progress", content: <ProgressBar value={60} variant="flash" label="flash 变体" /> }]} />
              </Demo>
              <Demo name="Skeleton" note="全部 variant；width / height；display">
                {(["text-body-s", "text-body-m", "text-heading-xs", "text-heading-s", "text-heading-m", "text-heading-l", "text-heading-xl", "text-display-l"] as const).map((v) => (
                  <Skeleton key={v} variant={v} width="60%" />
                ))}
                <Skeleton variant="dynamic" height="80px" />
                <Row>
                  <Skeleton display="inline-block" width="40px" height="40px" />
                  <Skeleton display="inline-block" width="120px" />
                </Row>
              </Demo>
              <Demo name="Spinner" note="size normal / big / large × variant normal / disabled / inverted">
                <Row>
                  <Spinner />
                  <Spinner size="big" />
                  <Spinner size="large" />
                  <Spinner variant="disabled" />
                  <Box padding="xs" visualAccent={{ color: "blue" }}>
                    <Spinner variant="inverted" />
                  </Box>
                </Row>
              </Demo>
              <Demo name="Steps" note="Timeline / Result / Steps 对应：vertical / horizontal，全部状态">
                <Steps ariaLabel="步骤" steps={[{ status: "success", header: "已创建", details: "2026-09-01" }, { status: "in-progress", header: "处理中", details: <ProgressBar value={40} variant="key-value" /> }, { status: "warning", header: "等待确认" }, { status: "error", header: "失败", details: <Link>重试</Link> }, { status: "stopped", header: "已停止" }, { status: "pending", header: "待开始" }, { status: "loading", header: "加载中" }, { status: "not-started", header: "未开始", annotation: "可选" }]} />
                <Steps ariaLabel="横向步骤" orientation="horizontal" steps={[{ status: "success", header: "基本信息" }, { status: "in-progress", header: "配置" }, { status: "not-started", header: "确认" }]} />
              </Demo>
              <Demo name="ErrorBoundary" note="捕获子树错误并展示 fallback">
                <Row>
                  <Button onClick={() => setBoom((b) => !b)}>{boom ? "恢复" : "触发错误"}</Button>
                </Row>
                <ErrorBoundary key={String(boom)} onError={() => undefined} i18nStrings={{ headerText: "出错了", descriptionText: "该区域渲染失败", refreshActionText: "刷新" }}>
                  {boom ? <Boom /> : <Alert type="success">子树正常渲染</Alert>}
                </ErrorBoundary>
              </Demo>
            </SpaceBetween>
          </Container>
        </div>

        {/* 导航 */}
        <div id="navigation" className="gallery-hidden-anchor">
          <Container header={<Header variant="h2">导航</Header>}>
            <SpaceBetween size="l">
              <Demo name="TopNavigation" note="Navbar / AppBar 对应：identity、search、utilities（button / menu-dropdown / primary-button / badge）">
                <TopNavigation
                  identity={{ href: "#navigation", title: APP_TITLE }}
                  search={<Input type="search" value="" placeholder="搜索" onChange={() => undefined} ariaLabel="搜索" />}
                  utilities={[
                    { type: "button", text: "文档", href: "#navigation", external: true },
                    { type: "button", ...iconProps("bell"), ariaLabel: "通知", badge: true },
                    { type: "button", variant: "primary-button", text: "新建" },
                    { type: "menu-dropdown", text: team[0].name, description: team[0].email, ...iconProps("user"), items: [{ id: "p", text: "个人资料" }, { id: "o", text: "退出" }] },
                  ]}
                  i18nStrings={{ overflowMenuTriggerText: "更多", overflowMenuTitleText: "全部" }}
                />
              </Demo>
              <Demo name="SideNavigation" note="Sidebar / Menu 对应：header、section、expandable-link-group、link-group、divider、badge/info、external">
                <div style={{ maxWidth: 320 }}>
                  <SideNavigation
                    header={{ href: "#navigation", text: APP_TITLE }}
                    activeHref="#c-SideNavigation"
                    onFollow={(e) => e.preventDefault()}
                    items={[
                      { type: "link", text: nav[0].label, href: "#c-SideNavigation", info: <Badge color="red">3</Badge> },
                      { type: "section", text: "分组", items: nav.slice(1, 3).map((n) => ({ type: "link", text: n.label, href: `#${n.path}` })) },
                      { type: "expandable-link-group", text: "可展开分组", href: "#eg", defaultExpanded: true, items: nav.slice(3, 5).map((n) => ({ type: "link", text: n.label, href: `#${n.path}` })) },
                      { type: "link-group", text: "链接组", href: "#lg", items: nav.slice(5, 7).map((n) => ({ type: "link", text: n.label, href: `#${n.path}` })) },
                      { type: "divider" },
                      { type: "link", text: "外部链接", href: "#ext", external: true },
                    ]}
                  />
                </div>
              </Demo>
              <Demo name="BreadcrumbGroup">
                <BreadcrumbGroup items={[{ text: APP_TITLE, href: "#" }, { text: nav[1].label, href: "#" }, { text: orders[0].id, href: "#" }]} onFollow={(e) => e.preventDefault()} ariaLabel="面包屑" />
              </Demo>
              <Demo name="Tabs" note="variant default / container / stacked；disabled tab；带 action / dismissible；fitHeight">
                <Tabs tabs={[{ id: "a", label: "默认", content: "内容 A" }, { id: "b", label: "带操作", content: "内容 B", action: <ButtonDropdown variant="icon" ariaLabel="操作" items={[{ id: "x", text: "重命名" }]} /> }, { id: "c", label: "可关闭", content: "内容 C", dismissible: true, dismissLabel: "关闭" }, { id: "d", label: "禁用", content: "", disabled: true, disabledReason: "无权限" }]} />
                <Tabs variant="container" tabs={[{ id: "a", label: "container", content: "在 Container 中" }, { id: "b", label: "第二项", content: "B" }]} />
                <Tabs variant="stacked" tabs={[{ id: "a", label: "stacked", content: "堆叠变体" }]} />
              </Demo>
              <Demo name="SegmentedControl" note="Segmented 对应：带图标 / 禁用项">
                <SegmentedControl selectedId={seg} onChange={({ detail }) => setSeg(detail.selectedId)} label="视图" options={[{ id: "list", text: "列表", ...iconProps("list") }, { id: "grid", text: "网格", ...iconProps("grid") }, { id: "map", text: "禁用", disabled: true }]} />
              </Demo>
              <Demo name="Pagination" note="默认 / openEnd / disabled">
                <Row>
                  <Pagination currentPageIndex={page} pagesCount={8} onChange={({ detail }) => setPage(detail.currentPageIndex)} />
                  <Pagination currentPageIndex={2} pagesCount={5} openEnd />
                  <Pagination currentPageIndex={1} pagesCount={3} disabled />
                </Row>
              </Demo>
              <Demo name="Wizard" note="多步向导（Stepper 对应）">
                <Wizard
                  i18nStrings={{ stepNumberLabel: (n) => `第 ${n} 步`, collapsedStepsLabel: (n, t) => `第 ${n} / ${t} 步`, cancelButton: "取消", previousButton: "上一步", nextButton: "下一步", submitButton: "提交", optional: "可选", navigationAriaLabel: "步骤" }}
                  activeStepIndex={wizardStep}
                  onNavigate={({ detail }) => setWizardStep(detail.requestedStepIndex)}
                  steps={[{ title: "基本信息", content: <Container>步骤 1</Container> }, { title: "配置", isOptional: true, content: <Container>步骤 2</Container> }, { title: "确认", content: <Container>步骤 3</Container> }]}
                />
              </Demo>
              <Demo name="AnchorNavigation" note="Anchor 对应：见页面顶部索引；此处为二级示例">
                <AnchorNavigation anchors={SECTIONS.map((s) => ({ text: s.title, href: `#${s.id}`, level: 1 }))} />
              </Demo>
              <Demo name="CollectionPreferences" note="表格偏好（分页 / 换行 / 斑马纹 / 列显示 / 粘性列 / 内容密度）">
                <CollectionPreferences
                  title="偏好"
                  confirmLabel="确认"
                  cancelLabel="取消"
                  preferences={{ pageSize: 10, wrapLines: true, stripedRows: false, contentDensity: "comfortable", stickyColumns: { first: 1, last: 0 } }}
                  pageSizePreference={{ title: "每页", options: [{ value: 10, label: "10" }, { value: 20, label: "20" }] }}
                  wrapLinesPreference={{ label: "换行", description: "" }}
                  stripedRowsPreference={{ label: "斑马纹", description: "" }}
                  contentDensityPreference={{ label: "密度", description: "" }}
                  stickyColumnsPreference={{ firstColumns: { title: "首列固定", description: "", options: [{ label: "无", value: 0 }, { label: "1 列", value: 1 }] }, lastColumns: { title: "末列固定", description: "", options: [{ label: "无", value: 0 }, { label: "1 列", value: 1 }] } }}
                  contentDisplayPreference={{ title: "列", options: [{ id: "id", label: "订单" }, { id: "customer", label: "客户" }] }}
                />
              </Demo>
              <Demo name="NavigableGroup" note="方向键在子元素间导航">
                <NavigableGroup getItemKey={(el) => el.textContent ?? ""} navigationDirection="horizontal">
                  <Row>
                    {nav.slice(0, 4).map((n) => (
                      <Button key={n.path}>{n.label}</Button>
                    ))}
                  </Row>
                </NavigableGroup>
              </Demo>
            </SpaceBetween>
          </Container>
        </div>

        {/* 布局 */}
        <div id="layout" className="gallery-hidden-anchor">
          <Container header={<Header variant="h2">布局</Header>}>
            <SpaceBetween size="l">
              <Demo name="AppLayout" note="本页面即由 AppLayout 渲染（导航 / 通知 / 面包屑 / 内容区）；AppLayoutToolbar 为工具栏变体，同属应用壳层，不在此嵌套。" />
              <Demo name="AppLayoutToolbar" note="见 AppLayout 说明。" />
              <Demo name="ContentLayout" note="本页外层容器；支持 header / defaultPadding / headerVariant high-contrast">
                <ContentLayout header={<Header variant="h2">嵌套 ContentLayout</Header>} defaultPadding headerVariant="high-contrast">
                  <Container>内容</Container>
                </ContentLayout>
              </Demo>
              <Demo name="Container" note="variant default / stacked；header / footer / media / fitHeight / disableContentPaddings">
                <Container header={<Header variant="h2">带媒体</Header>} media={{ content: <div className="gallery-aspect-video"><AppIcon name={"grid"} size="large" /></div>, position: "side", width: "30%" }} footer="页脚">
                  正文
                </Container>
                <Container variant="stacked" header={<Header variant="h3">stacked 1</Header>}>
                  A
                </Container>
                <Container variant="stacked" header={<Header variant="h3">stacked 2</Header>} disableContentPaddings>
                  <Box padding="s">无内边距</Box>
                </Container>
              </Demo>
              <Demo name="ExpandableSection" note="Collapse / Accordion 对应：default / footer / container / navigation / stacked / inline；headerActions / headerCounter / headerInfo">
                <ExpandableSection headerText="default" defaultExpanded>
                  内容
                </ExpandableSection>
                <ExpandableSection variant="footer" headerText="footer">
                  内容
                </ExpandableSection>
                <ExpandableSection variant="container" headerText="container" headerCounter="(3)" headerInfo={<Link variant="info">信息</Link>} headerActions={<Button>操作</Button>}>
                  内容
                </ExpandableSection>
                <ExpandableSection variant="navigation" headerText="navigation">
                  内容
                </ExpandableSection>
                <ExpandableSection variant="stacked" headerText="stacked 1">
                  内容
                </ExpandableSection>
                <ExpandableSection variant="stacked" headerText="stacked 2">
                  内容
                </ExpandableSection>
                <ExpandableSection variant="inline" headerText="inline">
                  内容
                </ExpandableSection>
              </Demo>
              <Demo name="Grid" note="12 栏响应式；colspan / offset / push / pull；disableGutters">
                <Grid gridDefinition={[{ colspan: { default: 12, s: 4 } }, { colspan: { default: 12, s: 4 } }, { colspan: { default: 12, s: 4 } }, { colspan: 6, offset: 3 }]}>
                  {[1, 2, 3, 4].map((n) => (
                    <Container key={n}>栅格 {n}</Container>
                  ))}
                </Grid>
              </Demo>
              <Demo name="ColumnLayout" note="columns 1–4；borders vertical / horizontal / all；variant text-grid；minColumnWidth">
                <ColumnLayout columns={4} borders="all">
                  {team.slice(0, 4).map((m) => (
                    <Box key={m.email}>{m.name}</Box>
                  ))}
                </ColumnLayout>
                <ColumnLayout columns={2} variant="text-grid" borders="vertical">
                  <div>
                    <Box variant="awsui-key-label">键</Box>
                    <div>值</div>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">键 2</Box>
                    <div>值 2</div>
                  </div>
                </ColumnLayout>
              </Demo>
              <Demo name="SpaceBetween" note="Stack / Flex / Space 对应：vertical / horizontal × size xxxs–xxl × alignItems">
                <SpaceBetween direction="horizontal" size="xxxs">
                  {["xxxs", "xxs", "xs", "s", "m", "l", "xl", "xxl"].map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </SpaceBetween>
                <SpaceBetween direction="horizontal" size="l" alignItems="end">
                  <Box variant="awsui-value-large">对齐</Box>
                  <Box>alignItems=end</Box>
                </SpaceBetween>
              </Demo>
              <Demo name="PanelLayout" note="Splitter / Resizable 对应：可拖拽分栏；display all / panel-only / main-only">
                <SegmentedControl selectedId={display} onChange={({ detail }) => setDisplay(detail.selectedId as typeof display)} label="显示" options={[{ id: "all", text: "全部" }, { id: "panel-only", text: "仅面板" }, { id: "main-only", text: "仅主区" }]} />
                <div style={{ height: 200 }}>
                  <PanelLayout panelPosition="side-start" resizable defaultPanelSize={240} minPanelSize={160} display={display} i18nStrings={{ resizeHandleAriaLabel: "调整宽度", resizeHandleTooltipText: "拖拽调整" }} panelContent={<Container fitHeight><Box>侧栏面板</Box></Container>} mainContent={<Container fitHeight><Box>主内容区</Box></Container>} />
                </div>
              </Demo>
              <Demo name="SplitPanel" note="需在 AppLayout 的 splitPanel 插槽渲染（底部 / 侧边可切换）；订单页抽屉与本页 Drawer 同属该体系，此处不重复嵌套。" />
              <Demo name="HelpPanel" note="AppLayout tools 面板内容；此处独立渲染">
                <HelpPanel header={<h2>帮助</h2>} footer={<Link external href="#layout">了解更多</Link>}>
                  <TextContent>
                    <p>{chat.suggestions[1]}</p>
                    <ul>
                      <li>{chat.suggestions[2]}</li>
                    </ul>
                  </TextContent>
                </HelpPanel>
              </Demo>
            </SpaceBetween>
          </Container>
        </div>

        {/* 其他 */}
        <div id="misc" className="gallery-hidden-anchor">
          <Container header={<Header variant="h2">其他</Header>}>
            <SpaceBetween size="l">
              <Demo name="AnnotationContext" note="Tour / Onboarding 对应：AnnotationContext + Hotspot + TutorialPanel 组合">
                <AnnotationContext
                  currentTutorial={tutorial?.started ? tutorialDef : null}
                  onStartTutorial={() => setTutorial({ started: true })}
                  onExitTutorial={() => setTutorial(null)}
                  onFinish={() => setTutorial(null)}
                  i18nStrings={{ stepCounterText: (s, t) => `第 ${s + 1} / ${t} 步`, taskTitle: (i, t) => `任务 ${i + 1}：${t}`, labelHotspot: (open) => (open ? "关闭提示" : "打开提示"), nextButtonText: "下一步", previousButtonText: "上一步", finishButtonText: "完成", labelDismissAnnotation: "关闭" }}
                >
                  <SpaceBetween size="m">
                    <Row>
                      <Button variant="primary" onClick={() => setTutorial({ started: true })}>
                        开始导览
                      </Button>
                      <Box id="c-Hotspot">
                        <Hotspot hotspotId="hs-stats" side="right">
                          <Badge color="blue">Hotspot 目标</Badge>
                        </Hotspot>
                      </Box>
                    </Row>
                    <div id="c-TutorialPanel">
                      <TutorialPanel
                        tutorials={[tutorialDef]}
                        onFeedbackClick={() => undefined}
                        i18nStrings={{
                          loadingText: "加载中",
                          tutorialListTitle: "教程",
                          tutorialListDescription: "选择一个教程开始",
                          tutorialListDownloadLinkText: "下载",
                          tutorialCompletedText: "已完成",
                          labelExitTutorial: "退出",
                          learnMoreLinkText: "了解更多",
                          startTutorialButtonText: "开始",
                          restartTutorialButtonText: "重新开始",
                          completionScreenTitle: "完成",
                          feedbackLinkText: "反馈",
                          dismissTutorialButtonText: "关闭",
                          taskTitle: (i, t) => `任务 ${i + 1}：${t}`,
                          stepTitle: (i, t) => `步骤 ${i + 1}：${t}`,
                          labelTotalSteps: (n) => `共 ${n} 步`,
                          labelLearnMoreExternalIcon: "外链",
                          labelTutorialListDownloadLink: "下载",
                          labelLearnMoreLink: "了解更多",
                          labelsTaskStatus: { pending: "待开始", "in-progress": "进行中", success: "已完成" },
                        }}
                      />
                    </div>
                  </SpaceBetween>
                </AnnotationContext>
              </Demo>
              <Demo name="IconProvider" note={`全局图标替换：当前 ?icons=${iconFamily}；非 native 时通过 IconProvider 将 Cloudscape 内建图标替换为 @ui-gallery/icons-react。`}>
                <Row>
                  {["search", "settings", "bell", "user", "download", "trash", "plus", "check", "x", "sparkles"].map((n) => (
                    <Icon key={n} {...iconProps(n)} size="medium" />
                  ))}
                </Row>
              </Demo>
              <Demo name="I18nProvider" note="全局 zh-CN 内置文案（Pagination / Table / DateRangePicker 等）；应用根已挂载。" />
              <Demo name="CodeEditor" note="CodeEditor 依赖 Ace 运行时（需额外加载 ace-builds，禁网构建下不引入）；本画廊以 CodeView 展示只读代码，故 CodeEditor 标记为 missing。">
                <CodeView content={JSON.stringify({ language: "json", theme: "dawn", wrapLines: true }, null, 2)} />
              </Demo>
            </SpaceBetween>
          </Container>
        </div>
      </SpaceBetween>
    </ContentLayout>
  )
}
