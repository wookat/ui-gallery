import contract from "@ui-gallery/spec/contract.json"

export type CoverageStatus = "implemented" | "composed" | "missing"
export const coverage: Record<string, CoverageStatus> = {
  Typography: "composed", Button: "implemented", ButtonGroup: "implemented", IconButton: "implemented", Input: "implemented",
  Textarea: "implemented", NumberInput: "implemented", Select: "implemented", MultiSelect: "implemented", Combobox: "implemented",
  Autocomplete: "implemented", Checkbox: "implemented", Radio: "implemented", Switch: "implemented", Slider: "implemented", Rating: "implemented",
  DatePicker: "implemented", TimePicker: "implemented", DateRangePicker: "implemented", ColorPicker: "implemented", Upload: "implemented",
  Cascader: "implemented", Transfer: "implemented", Mention: "implemented", PinInput: "composed", Form: "implemented", Table: "implemented",
  DataGrid: "implemented", Descriptions: "implemented", List: "composed", Card: "implemented", Avatar: "implemented", AvatarGroup: "composed",
  Badge: "implemented", Tag: "implemented", Statistic: "implemented", Timeline: "implemented", Tree: "implemented", Calendar: "implemented",
  Image: "implemented", Carousel: "implemented", Empty: "implemented", Tooltip: "implemented", Popover: "implemented", QRCode: "composed",
  Segmented: "implemented", Alert: "implemented", Toast: "implemented", Notification: "implemented", Dialog: "implemented", Drawer: "implemented",
  Progress: "implemented", Skeleton: "implemented", Spinner: "implemented", Result: "implemented", Popconfirm: "implemented", Menu: "implemented",
  Dropdown: "implemented", Breadcrumb: "implemented", Tabs: "implemented", Pagination: "implemented", Steps: "implemented", Anchor: "implemented",
  BackTop: "implemented", Affix: "implemented", Navbar: "composed", Sidebar: "composed", CommandPalette: "composed", Grid: "implemented",
  Stack: "implemented", Layout: "implemented", Container: "composed", AspectRatio: "composed", Resizable: "implemented", ScrollArea: "implemented",
  Accordion: "implemented", ThemeProvider: "implemented", Watermark: "implemented", Tour: "implemented", FloatButton: "composed", Kbd: "composed",
  Code: "composed", Divider: "implemented", Link: "implemented",
}
export const coverageKeys = (contract.components as string[]).map((key) => [key, coverage[key]] as const)
