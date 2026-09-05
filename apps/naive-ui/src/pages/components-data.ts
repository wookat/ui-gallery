import contract from "@ui-gallery/spec/contract.json"

export type Coverage = "implemented" | "composed" | "missing"

export const coverage: Record<string, Coverage> = {
  Typography: "implemented", Button: "implemented", ButtonGroup: "implemented", IconButton: "composed",
  Input: "implemented", Textarea: "implemented", NumberInput: "implemented", Select: "implemented",
  MultiSelect: "implemented", Combobox: "composed", Autocomplete: "implemented", Checkbox: "implemented",
  Radio: "implemented", Switch: "implemented", Slider: "implemented", Rating: "implemented",
  DatePicker: "implemented", TimePicker: "implemented", DateRangePicker: "implemented", ColorPicker: "implemented",
  Upload: "implemented", Cascader: "implemented", Transfer: "implemented", Mention: "implemented",
  PinInput: "implemented", Form: "implemented", Table: "implemented", DataGrid: "implemented",
  Descriptions: "implemented", List: "implemented", Card: "implemented", Avatar: "implemented",
  AvatarGroup: "implemented", Badge: "implemented", Tag: "implemented", Statistic: "implemented",
  Timeline: "implemented", Tree: "implemented", Calendar: "implemented", Image: "implemented",
  Carousel: "implemented", Empty: "implemented", Tooltip: "implemented", Popover: "implemented",
  QRCode: "implemented", Segmented: "composed", Alert: "implemented", Toast: "implemented",
  Notification: "implemented", Dialog: "implemented", Drawer: "implemented", Progress: "implemented",
  Skeleton: "implemented", Spinner: "implemented", Result: "implemented", Popconfirm: "implemented",
  Menu: "implemented", Dropdown: "implemented", Breadcrumb: "implemented", Tabs: "implemented",
  Pagination: "implemented", Steps: "implemented", Anchor: "implemented", BackTop: "implemented",
  Affix: "implemented", Navbar: "composed", Sidebar: "implemented", CommandPalette: "composed",
  Grid: "implemented", Stack: "implemented", Layout: "implemented", Container: "composed",
  AspectRatio: "composed", Resizable: "implemented", ScrollArea: "implemented", Accordion: "implemented",
  ThemeProvider: "implemented", Watermark: "implemented", Tour: "missing", FloatButton: "implemented",
  Kbd: "composed", Code: "implemented", Divider: "implemented", Link: "implemented",
}

export const componentNames: string[] = contract.components
for (const name of componentNames) if (!coverage[name]) throw new Error(`coverage missing for ${name}`)

export const slug = (name: string) => name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
