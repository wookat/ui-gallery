import { For, type JSX } from "solid-js"
import { Icon } from "@/icons"
import { Badge } from "@/ui/badge"
import { Button } from "@/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"

export const descriptions: Record<string, string> = {
  Typography: "Tailwind typography primitives",
  Button: "Kobalte Button · variants × sizes",
  ButtonGroup: "Button · attached group composition",
  IconButton: "Kobalte Button · icon-only variants",
  Input: "Kobalte TextField · states and adornments",
  Textarea: "Kobalte TextField.TextArea · counter",
  NumberInput: "Kobalte NumberField · numeric states",
  Select: "Kobalte Select · single value",
  MultiSelect: "Kobalte Select · multiple",
  Combobox: "Kobalte Combobox · filtering",
  Autocomplete: "Kobalte Combobox · custom value",
  Checkbox: "Kobalte Checkbox · checked states",
  Radio: "Kobalte RadioGroup · orientations",
  Switch: "Kobalte Switch · sizes and descriptions",
  Slider: "Kobalte Slider · single and range",
  Rating: "Kobalte Rating · stars",
  DatePicker: "composed · native date input",
  DateRangePicker: "composed · native date input",
  TimePicker: "Kobalte TimeField · segments",
  ColorPicker: "Kobalte ColorArea · hue and swatch",
  Upload: "Kobalte FileField · dropzone and list",
  Cascader: "Select · chained values",
  Transfer: "Kobalte Listbox · move controls",
  Mention: "Not available in Kobalte",
  PinInput: "TextField · six-character code",
  Form: "TextField · horizontal, vertical, inline",
  Table: "Semantic table · variants",
  DataGrid: "Table · sortable and selectable",
  Descriptions: "Semantic dl · bordered two-column",
  List: "Semantic list · avatars and actions",
  Card: "Card composition · image and footer",
  Avatar: "Kobalte Image · fallback and status",
  AvatarGroup: "Avatar · overlap composition",
  Badge: "Kobalte Badge · variants and counts",
  Tag: "Badge · closable tags",
  Statistic: "Typography · metric cards",
  Timeline: "CSS timeline · alternate layout",
  Tree: "Kobalte Collapsible · nested nodes",
  Calendar: "Date math · selectable month grid",
  Image: "Kobalte Image · preview dialog",
  Carousel: "Scroll snap · controls and dots",
  Empty: "Icon + action · empty state",
  Tooltip: "Kobalte Tooltip · placements",
  Popover: "Kobalte Popover · headed content",
  QRCode: "Not available in Kobalte",
  Segmented: "Kobalte SegmentedControl · three options",
  Alert: "Kobalte Alert · four levels",
  Toast: "Kobalte Toast · actions",
  Notification: "Kobalte Toast · title and description",
  Dialog: "Kobalte Dialog · normal and fullscreen",
  Drawer: "Kobalte Dialog · four sides",
  Progress: "Kobalte Progress + Meter · variants",
  Skeleton: "CSS skeleton · loading layouts",
  Spinner: "CSS animation · three sizes",
  Result: "Card · outcome actions",
  Popconfirm: "Popover · confirm and cancel",
  Menu: "Kobalte Menubar + NavigationMenu",
  Dropdown: "Kobalte DropdownMenu · nested items",
  Breadcrumb: "Kobalte Breadcrumbs · variants",
  Tabs: "Kobalte Tabs · orientations",
  Pagination: "Kobalte Pagination · page controls",
  Steps: "CSS stepper · horizontal and vertical",
  Anchor: "Link list · scroll spy",
  BackTop: "Fixed Button · scroll to top",
  Affix: "Sticky composition · scroll box",
  Navbar: "Kobalte NavigationMenu · navbar",
  Sidebar: "Sidebar composition · rail and expanded",
  CommandPalette: "Kobalte Search + Dialog · ⌘K",
  Grid: "Tailwind grid · responsive columns",
  Stack: "Flex stack · direction and gaps",
  Layout: "Header/sidebar/content/footer frame",
  Container: "Responsive max-width containers",
  AspectRatio: "CSS aspect-ratio · three ratios",
  Resizable: "Pointer divider · two panes",
  ScrollArea: "Overflow container · custom scrollbar",
  Accordion: "Kobalte Accordion · single and multiple",
  ThemeProvider: "Kobalte ColorModeProvider · current mode",
  Watermark: "CSS repeating watermark",
  Tour: "Popover · three anchored steps",
  FloatButton: "Fixed action group · relative demo",
  Kbd: "Keyboard shortcut styling",
  Code: "Inline and block code · copy",
  Divider: "Kobalte Separator · orientations",
  Link: "Anchor variants · external and disabled",
}

export const sectionNames = {
  typography: ["Typography", "Kbd", "Code", "Divider", "Link"],
  buttons: ["Button", "ButtonGroup", "IconButton"],
  forms: ["Input", "Textarea", "NumberInput", "Select", "MultiSelect", "Combobox", "Autocomplete", "Checkbox", "Radio", "Switch", "Slider", "Rating", "DatePicker", "DateRangePicker", "TimePicker", "ColorPicker", "Upload", "Cascader", "Transfer", "Mention", "PinInput", "Form"],
  data: ["Table", "DataGrid", "Descriptions", "List", "Card", "Avatar", "AvatarGroup", "Badge", "Tag", "Statistic", "Timeline", "Tree", "Calendar", "Image", "Carousel", "Empty", "Tooltip", "Popover", "Segmented"],
  feedback: ["Alert", "Toast", "Notification", "Dialog", "Drawer", "Progress", "Skeleton", "Spinner", "Result", "Popconfirm"],
  navigation: ["Menu", "Dropdown", "Breadcrumb", "Tabs", "Pagination", "Steps", "Anchor", "BackTop", "Affix", "Navbar", "Sidebar", "CommandPalette"],
  layout: ["Grid", "Stack", "Layout", "Container", "AspectRatio", "Resizable", "ScrollArea", "Accordion"],
  misc: ["ThemeProvider", "Watermark", "Tour", "FloatButton", "QRCode"],
  extras: ["QRCode"],
} as const

const primitiveExtras = new Set(["AlertDialog", "Collapsible", "ContextMenu", "HoverCard", "Listbox", "Menubar", "Meter", "NavigationMenu", "Search", "ToggleButton", "ToggleGroup", "ColorWheel", "ColorChannelField", "TimeField"])

export function DemoFrame(props: { children: JSX.Element; class?: string }) {
  return <div class={`min-w-0 overflow-x-auto rounded-lg bg-zinc-50 p-4 dark:bg-zinc-950 ${props.class ?? ""}`}>{props.children}</div>
}

export function DemoCard(props: { name: string; status: string; children: JSX.Element }) {
  return <Card id={primitiveExtras.has(props.name) ? undefined : `component-${props.name}`} class="w-full scroll-mt-6"><CardHeader><div class="flex flex-wrap items-start justify-between gap-3"><div><CardTitle>{props.name}</CardTitle><CardDescription>{descriptions[props.name]}</CardDescription></div><Badge variant={props.status === "missing" ? "destructive" : props.status === "composed" ? "secondary" : "default"}>{props.status}</Badge></div></CardHeader><CardContent>{props.children}</CardContent></Card>
}

export function DemoLabel(props: { children: JSX.Element }) {
  return <span class="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{props.children}</span>
}

export function IconButton(props: { name: string; label: string; size?: "sm" | "md" | "lg"; variant?: "primary" | "outline" | "ghost" }) {
  return <Button size={props.size ?? "md"} variant={props.variant ?? "outline"} aria-label={props.label}><Icon name={props.name} size={16} /></Button>
}

export function MiniTable(props: { rows?: string[][]; striped?: boolean }) {
  return <div class="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-700"><table class="min-w-[420px] w-full text-left text-sm"><thead class="bg-zinc-100 dark:bg-zinc-800"><tr><For each={["编号", "客户", "金额"]}>{(head) => <th class="px-3 py-2 font-medium">{head}</th>}</For></tr></thead><tbody><For each={props.rows ?? [["ORD-1001", "林晓", "¥12,480"], ["ORD-1002", "王子涵", "¥8,200"], ["ORD-1003", "Alex Chen", "¥5,760"]]}>{(row, index) => <tr class={`border-t border-zinc-200 dark:border-zinc-700 ${props.striped && index() % 2 ? "bg-zinc-50 dark:bg-zinc-900" : ""}`}><For each={row}>{(cell) => <td class="px-3 py-2">{cell}</td>}</For></tr>}</For></tbody></table></div>
}
