export type CoverageStatus = "implemented" | "composed" | "missing"
// Contract component → Arco Design (@arco-design/web-react) mapping. Comments name the Arco export used.
export const coverage: Record<string, CoverageStatus> = {
  Typography: "implemented", // Typography.Title/Paragraph/Text
  Button: "implemented",
  ButtonGroup: "implemented", // Button.Group
  IconButton: "implemented", // Button icon shape=circle
  Input: "implemented", // Input / Input.Search / Input.Password
  Textarea: "implemented", // Input.TextArea
  NumberInput: "implemented", // InputNumber
  Select: "implemented",
  MultiSelect: "implemented", // Select mode=multiple
  Combobox: "composed", // Select showSearch allowCreate
  Autocomplete: "implemented", // AutoComplete
  Checkbox: "implemented", // incl. indeterminate
  Radio: "implemented",
  Switch: "implemented",
  Slider: "implemented", // range
  Rating: "implemented", // Rate
  DatePicker: "implemented",
  TimePicker: "implemented",
  DateRangePicker: "implemented", // DatePicker.RangePicker
  ColorPicker: "implemented",
  Upload: "implemented", // drag + list
  Cascader: "implemented",
  Transfer: "implemented",
  Mention: "implemented", // Mentions
  PinInput: "implemented", // VerificationCode
  Form: "implemented", // layout horizontal/vertical/inline
  Table: "implemented",
  DataGrid: "composed", // Table + sorter/filters/rowSelection/pagination
  Descriptions: "implemented",
  List: "implemented",
  Card: "implemented", // Card.Grid / Card.Meta
  Avatar: "implemented",
  AvatarGroup: "implemented", // Avatar.Group
  Badge: "implemented",
  Tag: "implemented",
  Statistic: "implemented",
  Timeline: "implemented",
  Tree: "implemented",
  Calendar: "implemented",
  Image: "implemented", // Image + Image.PreviewGroup
  Carousel: "implemented",
  Empty: "implemented",
  Tooltip: "implemented",
  Popover: "implemented",
  QRCode: "missing",
  Segmented: "composed", // Radio.Group type=button
  Alert: "implemented", // info/success/warning/error
  Toast: "implemented", // Message
  Notification: "implemented",
  Dialog: "implemented", // Modal + Modal.confirm
  Drawer: "implemented", // 4 placements
  Progress: "implemented", // line/circle/steps
  Skeleton: "implemented",
  Spinner: "implemented", // Spin
  Result: "implemented",
  Popconfirm: "implemented",
  Menu: "implemented", // horizontal/vertical/inline SubMenu/collapse
  Dropdown: "implemented",
  Breadcrumb: "implemented",
  Tabs: "implemented", // line/card/card-gutter/text/rounded/capsule
  Pagination: "implemented",
  Steps: "implemented",
  Anchor: "implemented",
  BackTop: "implemented",
  Affix: "implemented",
  Navbar: "composed", // Layout.Header + Menu mode=horizontal
  Sidebar: "composed", // Layout.Sider + Menu
  CommandPalette: "composed", // Modal + Input.Search + List
  Grid: "implemented", // Grid.Row / Grid.Col
  Stack: "implemented", // Space direction=vertical
  Layout: "implemented",
  Container: "composed", // Layout.Content + max-width
  AspectRatio: "composed", // CSS aspect-ratio
  Resizable: "implemented", // ResizeBox
  ScrollArea: "composed", // overflow container
  Accordion: "implemented", // Collapse accordion
  ThemeProvider: "implemented", // ConfigProvider + body[arco-theme=dark]
  Watermark: "implemented",
  Tour: "missing",
  FloatButton: "composed", // Button shape=circle fixed position
  Kbd: "composed", // Tag size=small
  Code: "implemented", // Typography.Text code
  Divider: "implemented",
  Link: "implemented",
}

// Arco exports that are not named in the contract; shown in the "Arco 补充" section of /components.
export const arcoExtras = ["Comment", "PageHeader", "InputTag", "TreeSelect", "Trigger", "Space", "Portal", "Icon"]
