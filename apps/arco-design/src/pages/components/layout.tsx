import { useState } from "react"
import { Button, Card, Collapse, ConfigProvider, Divider, Grid, Input, Layout, ResizeBox, Select, Space, Watermark } from "@arco-design/web-react"
import { Icon } from "@/components/icon"
import { useThemeContext } from "@/theme"
import type { DemoProps } from "./shared"
import { DemoSection } from "./shared"

export function LayoutDemo({ name }: DemoProps) {
  switch (name) {
    case "Grid": return <GridDemo />
    case "Stack": return <SpaceDemo />
    case "Layout": return <ArcoLayoutDemo />
    case "Container": return <Layout.Content style={{ maxWidth: 640, margin: "auto", padding: 16, background: "var(--color-fill-2)" }}>Container 内容</Layout.Content>
    case "AspectRatio": return <Space wrap><div className="aspect-box">16:9</div><div className="aspect-box aspect-4-3">4:3</div><div className="aspect-box aspect-1-1">1:1</div></Space>
    case "Resizable": return <ResizeBoxDemo />
    case "ScrollArea": return <div style={{ display: "flex", gap: 8 }}><div className="scroll-area-demo">垂直滚动内容<br />第二行<br />第三行<br />第四行<br />第五行</div><div className="scroll-area-demo" style={{ whiteSpace: "nowrap", overflowX: "auto", width: 180 }}>水平滚动内容 更多内容 更多内容</div></div>
    case "Accordion": return <Collapse accordion bordered expandIconPosition="right" destroyOnHide lazyload><Collapse.Item header="Accordion 项目" name="one">内容一</Collapse.Item><Collapse.Item header="禁用项目" name="two" disabled>内容二</Collapse.Item><Collapse.Item header="第三项" name="three">内容三</Collapse.Item></Collapse>
    case "ThemeProvider": return <ThemeProviderDemo />
    case "Watermark": return <Watermark content={["Acme Console", "内部资料"]} rotate={-20}><div style={{ height: 120, padding: 24 }}>文字水印、多行、旋转</div></Watermark>
    case "FloatButton": return <Space><Button className="float-demo" shape="circle" type="primary" icon={<Icon name="plus" />} /><Button shape="circle" icon={<Icon name="settings" />} /></Space>
    default: return null
  }
}

function GridDemo() {
  return <Grid.Row gutter={{ xs: 8, sm: 16, md: 24 }} justify="space-between" align="center"><Grid.Col xs={24} sm={12} md={6} span={6}><Card>一</Card></Grid.Col><Grid.Col span={6} offset={1} order={2}><Card>二</Card></Grid.Col><Grid.Col span={6} push={1}><Card>三</Card></Grid.Col><Grid.Col flex="1"><Card>flex</Card></Grid.Col></Grid.Row>
}

function SpaceDemo() {
  return <DemoSection><Space direction="horizontal" size="small" wrap split={<Divider type="vertical" />}><Button>横向</Button><Button>分隔</Button><Button>换行</Button></Space><Space direction="vertical" size="large"><Button>纵向</Button><Button>大间距</Button></Space></DemoSection>
}

function ArcoLayoutDemo() {
  const [collapsed, setCollapsed] = useState(false)
  return <Layout style={{ height: 240 }}><Layout.Sider collapsible breakpoint="xl" collapsed={collapsed} onCollapse={setCollapsed} trigger={<Icon name="menu" />}><div style={{ padding: 12 }}>Sider</div></Layout.Sider><Layout><Layout.Header style={{ padding: 12 }}>Header</Layout.Header><Layout.Content style={{ padding: 12 }}>Content</Layout.Content><Layout.Footer style={{ padding: 12 }}>Footer</Layout.Footer></Layout></Layout>
}

function ResizeBoxDemo() {
  return <Space direction="vertical" style={{ width: "100%" }}><ResizeBox width={240} directions={["right"]}>单向调整</ResizeBox><ResizeBox.Split direction="horizontal" size={0.5} panes={[<div key="left">水平左</div>, <div key="right">水平右</div>]} /><ResizeBox.Split direction="vertical" size={0.5} panes={[<div key="top">垂直上</div>, <div key="bottom">垂直下</div>]} /><ResizeBox.SplitGroup direction="horizontal" panes={[{ content: "分组一" }, { content: "分组二" }]} /></Space>
}

function ThemeProviderDemo() {
  const { theme, toggleTheme } = useThemeContext()
  return <ConfigProvider size="small"><Space wrap><Button onClick={toggleTheme}>当前主题：{theme}</Button><Button>按钮</Button><Input placeholder="Input" style={{ width: 120 }} /><Select defaultValue="one" options={[{ label: "Select", value: "one" }]} style={{ width: 120 }} /></Space></ConfigProvider>
}
