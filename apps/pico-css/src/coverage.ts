import contract from "@ui-gallery/spec/contract.json"

export type CoverageStatus = "implemented" | "composed" | "missing"
const implemented = new Set(["Typography", "Button", "ButtonGroup", "IconButton", "Input", "Textarea", "NumberInput", "Select", "MultiSelect", "Checkbox", "Radio", "Switch", "Slider", "DatePicker", "TimePicker", "ColorPicker", "Upload", "Form", "Table", "Card", "Tooltip", "Dialog", "Progress", "Spinner", "Dropdown", "Breadcrumb", "Accordion", "Grid", "Container", "ScrollArea", "Navbar", "ThemeProvider", "Kbd", "Code", "Divider", "Link"])
const missing = new Set(["Carousel", "QRCode"])
export const coverage: Record<string, CoverageStatus> = Object.fromEntries((contract.components as string[]).map((key) => [key, missing.has(key) ? "missing" : implemented.has(key) ? "implemented" : "composed"]))
