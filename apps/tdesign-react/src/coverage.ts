export type CoverageStatus = "implemented" | "composed" | "missing"

export const coverage: Record<string, CoverageStatus> = {
  Typography: "implemented", Button: "implemented", ButtonGroup: "composed", IconButton: "implemented",
  Input: "implemented", Textarea: "implemented", NumberInput: "implemented", Select: "implemented",
  MultiSelect: "composed", Combobox: "composed", Autocomplete: "implemented", Checkbox: "implemented",
  Radio: "implemented", Switch: "implemented", Slider: "implemented", Rating: "implemented",
  DatePicker: "implemented", TimePicker: "implemented", DateRangePicker: "implemented", ColorPicker: "implemented",
  Upload: "implemented", Cascader: "implemented", Transfer: "implemented", Mention: "composed", PinInput: "composed",
  Form: "implemented", Table: "implemented", DataGrid: "implemented", Descriptions: "implemented", List: "implemented",
  Card: "implemented", Avatar: "implemented", AvatarGroup: "implemented", Badge: "implemented", Tag: "implemented",
  Statistic: "implemented", Timeline: "implemented", Tree: "implemented", Calendar: "implemented", Image: "implemented",
  Carousel: "implemented", Empty: "implemented", Tooltip: "implemented", Popover: "implemented", QRCode: "implemented",
  Segmented: "composed", Alert: "implemented", Toast: "implemented", Notification: "implemented", Dialog: "implemented",
  Drawer: "implemented", Progress: "implemented", Skeleton: "implemented", Spinner: "implemented", Result: "composed",
  Popconfirm: "implemented", Menu: "implemented", Dropdown: "implemented", Breadcrumb: "implemented", Tabs: "implemented",
  Pagination: "implemented", Steps: "implemented", Anchor: "implemented", BackTop: "implemented", Affix: "implemented",
  Navbar: "implemented", Sidebar: "implemented", CommandPalette: "composed", Grid: "implemented", Stack: "implemented",
  Layout: "implemented", Container: "composed", AspectRatio: "composed", Resizable: "missing", ScrollArea: "composed",
  Accordion: "implemented", ThemeProvider: "implemented", Watermark: "implemented", Tour: "implemented", FloatButton: "composed",
  Kbd: "composed", Code: "composed", Divider: "implemented", Link: "implemented",
}
