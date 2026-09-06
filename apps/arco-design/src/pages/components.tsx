import type { ReactNode } from "react"
import contract from "@ui-gallery/spec/contract.json"
import { Anchor, Card, Empty, Grid, Tag, Typography } from "@arco-design/web-react"
import { arcoExtras, coverage } from "../coverage"
import { PageHeader } from "./shared"
import { GeneralDemo } from "./components/general"
import { DataEntryDemo } from "./components/data-entry"
import { DataDisplayDemo } from "./components/data-display"
import { FeedbackDemo } from "./components/feedback"
import { NavigationDemo } from "./components/navigation"
import { LayoutDemo } from "./components/layout"
import { ComposedDemo } from "./components/composed"

const largeDemos = new Set(["Table", "DataGrid", "Form", "Menu", "Layout", "Steps", "Tabs", "Calendar", "Transfer", "Descriptions", "Pagination"])

function Demo({ name }: { name: string }) {
  if (coverage[name] === "missing") return <Empty description="Arco Design 未提供该组件" />
  const demo = demos[name]
  return demo ? demo() : <Card><Typography.Text type="secondary">{name} 组合示例</Typography.Text></Card>
}

const demos: Record<string, () => ReactNode> = {
  Typography: () => <GeneralDemo name="Typography" />,
  Button: () => <GeneralDemo name="Button" />,
  ButtonGroup: () => <GeneralDemo name="ButtonGroup" />,
  IconButton: () => <GeneralDemo name="IconButton" />,
  Kbd: () => <GeneralDemo name="Kbd" />,
  Code: () => <GeneralDemo name="Code" />,
  Divider: () => <GeneralDemo name="Divider" />,
  Link: () => <GeneralDemo name="Link" />,
  Input: () => <DataEntryDemo name="Input" />,
  Textarea: () => <DataEntryDemo name="Textarea" />,
  NumberInput: () => <DataEntryDemo name="NumberInput" />,
  Select: () => <DataEntryDemo name="Select" />,
  MultiSelect: () => <DataEntryDemo name="MultiSelect" />,
  Combobox: () => <DataEntryDemo name="Combobox" />,
  Autocomplete: () => <DataEntryDemo name="Autocomplete" />,
  Checkbox: () => <DataEntryDemo name="Checkbox" />,
  Radio: () => <DataEntryDemo name="Radio" />,
  Switch: () => <DataEntryDemo name="Switch" />,
  Slider: () => <DataEntryDemo name="Slider" />,
  Rating: () => <DataEntryDemo name="Rating" />,
  DatePicker: () => <DataEntryDemo name="DatePicker" />,
  DateRangePicker: () => <DataEntryDemo name="DateRangePicker" />,
  TimePicker: () => <DataEntryDemo name="TimePicker" />,
  ColorPicker: () => <DataEntryDemo name="ColorPicker" />,
  Upload: () => <DataEntryDemo name="Upload" />,
  Cascader: () => <DataEntryDemo name="Cascader" />,
  Transfer: () => <DataEntryDemo name="Transfer" />,
  Mention: () => <DataEntryDemo name="Mention" />,
  PinInput: () => <DataEntryDemo name="PinInput" />,
  Form: () => <DataEntryDemo name="Form" />,
  Table: () => <DataDisplayDemo name="Table" />,
  DataGrid: () => <DataDisplayDemo name="DataGrid" />,
  Descriptions: () => <DataDisplayDemo name="Descriptions" />,
  List: () => <DataDisplayDemo name="List" />,
  Card: () => <DataDisplayDemo name="Card" />,
  Avatar: () => <DataDisplayDemo name="Avatar" />,
  AvatarGroup: () => <DataDisplayDemo name="AvatarGroup" />,
  Badge: () => <DataDisplayDemo name="Badge" />,
  Tag: () => <DataDisplayDemo name="Tag" />,
  Statistic: () => <DataDisplayDemo name="Statistic" />,
  Timeline: () => <DataDisplayDemo name="Timeline" />,
  Tree: () => <DataDisplayDemo name="Tree" />,
  Calendar: () => <DataDisplayDemo name="Calendar" />,
  Image: () => <DataDisplayDemo name="Image" />,
  Carousel: () => <DataDisplayDemo name="Carousel" />,
  Empty: () => <DataDisplayDemo name="Empty" />,
  Tooltip: () => <NavigationDemo name="Tooltip" />,
  Popover: () => <FeedbackDemo name="Popover" />,
  Segmented: () => <DataEntryDemo name="Segmented" />,
  Alert: () => <FeedbackDemo name="Alert" />,
  Toast: () => <FeedbackDemo name="Toast" />,
  Notification: () => <FeedbackDemo name="Notification" />,
  Dialog: () => <FeedbackDemo name="Dialog" />,
  Drawer: () => <FeedbackDemo name="Drawer" />,
  Progress: () => <FeedbackDemo name="Progress" />,
  Skeleton: () => <FeedbackDemo name="Skeleton" />,
  Spinner: () => <FeedbackDemo name="Spinner" />,
  Result: () => <FeedbackDemo name="Result" />,
  Popconfirm: () => <FeedbackDemo name="Popconfirm" />,
  Menu: () => <NavigationDemo name="Menu" />,
  Dropdown: () => <NavigationDemo name="Dropdown" />,
  Breadcrumb: () => <NavigationDemo name="Breadcrumb" />,
  Tabs: () => <NavigationDemo name="Tabs" />,
  Pagination: () => <NavigationDemo name="Pagination" />,
  Steps: () => <NavigationDemo name="Steps" />,
  Anchor: () => <NavigationDemo name="Anchor" />,
  BackTop: () => <NavigationDemo name="BackTop" />,
  Affix: () => <NavigationDemo name="Affix" />,
  Grid: () => <LayoutDemo name="Grid" />,
  Stack: () => <LayoutDemo name="Stack" />,
  Layout: () => <LayoutDemo name="Layout" />,
  Container: () => <LayoutDemo name="Container" />,
  AspectRatio: () => <LayoutDemo name="AspectRatio" />,
  Resizable: () => <LayoutDemo name="Resizable" />,
  ScrollArea: () => <LayoutDemo name="ScrollArea" />,
  Accordion: () => <LayoutDemo name="Accordion" />,
  ThemeProvider: () => <LayoutDemo name="ThemeProvider" />,
  Watermark: () => <LayoutDemo name="Watermark" />,
  FloatButton: () => <LayoutDemo name="FloatButton" />,
  Navbar: () => <ComposedDemo name="Navbar" />,
  Sidebar: () => <ComposedDemo name="Sidebar" />,
  CommandPalette: () => <ComposedDemo name="CommandPalette" />,
}

export function ComponentsPage() {
  const components = contract.components as string[]
  return <>
    <PageHeader title="组件全集" description="官方组件、contract 覆盖与组合示例。" action={<a href="#component-index">组件索引</a>} />
    <div className="components-layout">
      <aside className="desktop-only components-anchor"><Anchor><Anchor.Link href="#component-index" title="索引" />{components.map((name) => <Anchor.Link key={name} href={`#component-${name}`} title={name} />)}</Anchor></aside>
      <div className="components-content">
        <div id="component-index" className="component-index">{components.map((name) => <a href={`#component-${name}`} key={name}>{name}</a>)}</div>
        <Grid.Row gutter={[16, 16]}>{components.map((name) => {
          const content = <Card id={`component-${name}`} className="component-card" title={<div className="between"><Typography.Text bold>{name}</Typography.Text><Tag color={coverage[name] === "missing" ? "red" : coverage[name] === "composed" ? "orange" : "green"}>{coverage[name]}</Tag></div>}><Demo name={name} /></Card>
          return largeDemos.has(name) ? <Grid.Col span={24} key={name}>{content}</Grid.Col> : <Grid.Col xs={24} md={12} key={name}>{content}</Grid.Col>
        })}</Grid.Row>
        <Typography.Title heading={2}>Arco 补充</Typography.Title>
        <Grid.Row gutter={[16, 16]}>{arcoExtras.map((name) => <Grid.Col xs={24} md={12} key={name}><Card title={name}><ComposedDemo name={name} /></Card></Grid.Col>)}</Grid.Row>
      </div>
    </div>
  </>
}
