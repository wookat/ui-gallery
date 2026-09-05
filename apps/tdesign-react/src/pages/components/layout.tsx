import { useRef, useState, type ReactNode } from "react"
import {
  Affix,
  Button,
  Card,
  Col,
  Collapse,
  ConfigProvider,
  Divider,
  Guide,
  Layout,
  Pagination,
  Row,
  Space,
  StickyTool,
  Tag,
  Typography,
} from "tdesign-react"
import { Icon } from "@/components/icon"
import { DemoPanel, demoImage } from "./types"

function AffixDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <DemoPanel>
      <div ref={containerRef} className="scroll-demo">
        <Affix
          container={() => containerRef.current ?? document.body}
          offsetTop={8}
        >
          <Tag theme="primary">真实 Affix</Tag>
        </Affix>
        <Typography.Paragraph>{Array.from({ length: 8 }, (_, index) => `可滚动内容 ${index + 1}。`)}</Typography.Paragraph>
      </div>
    </DemoPanel>
  )
}

function SidebarDemo() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <DemoPanel>
      <Layout className="mini-layout">
        <Layout.Aside width={collapsed ? "64px" : "160px"}>
          <Button onClick={() => setCollapsed((value) => !value)}>{collapsed ? "展开" : "收起"}</Button>
          <Typography.Paragraph>侧边导航</Typography.Paragraph>
        </Layout.Aside>
        <Layout.Content>内容区</Layout.Content>
      </Layout>
    </DemoPanel>
  )
}

function GridDemo() {
  return (
    <DemoPanel>
      <Row gutter={[16, 16]} justify="space-between" align="middle">
        <Col xs={12} sm={6} md={4} lg={3}><Card>xs/sm/md/lg</Card></Col>
        <Col xs={12} sm={6} md={4} lg={{ span: 3, offset: 1 }}><Card>offset</Card></Col>
        <Col xs={24} sm={12} md={8} lg={6}><Card>responsive</Card></Col>
      </Row>
    </DemoPanel>
  )
}

function StackDemo() {
  return (
    <DemoPanel>
      <Space direction="vertical" size="large" align="start" breakLine separator={<Divider layout="vertical" />}>
        <Button>vertical</Button>
        <Button>large gap</Button>
      </Space>
      <Space size="small" separator="|">
        <Button>inline</Button>
        <Button>separator</Button>
      </Space>
    </DemoPanel>
  )
}

function LayoutDemo() {
  return (
    <DemoPanel>
      <Layout className="mini-layout">
        <Layout.Header>Header</Layout.Header>
        <Layout>
          <Layout.Aside width="120px">Aside</Layout.Aside>
          <Layout.Content>Content</Layout.Content>
        </Layout>
        <Layout.Footer>Footer</Layout.Footer>
      </Layout>
    </DemoPanel>
  )
}

function ContainerDemo() {
  return (
    <DemoPanel>
      <Layout.Content style={{ maxWidth: 640, margin: "0 auto" }}>
        <Card>Container max-width wrapper</Card>
      </Layout.Content>
    </DemoPanel>
  )
}

function AspectRatioDemo() {
  return (
    <DemoPanel>
      <div className="aspect-demo">
        <img src={demoImage} alt="aspect ratio" />
      </div>
    </DemoPanel>
  )
}

function ResizableDemo() {
  return (
    <DemoPanel>
      <AlertMissing />
      <div className="resizable-placeholder">CSS resize: horizontal</div>
    </DemoPanel>
  )
}

function AlertMissing() {
  return <Typography.Text theme="warning">TDesign React 没有原生 Resizable，用 CSS resize 组合实现可拖拽宽度。</Typography.Text>
}

function ScrollAreaDemo() {
  return (
    <DemoPanel>
      <div className="scroll-area-demo">
        {Array.from({ length: 10 }, (_, index) => <Typography.Paragraph key={index}>滚动区域项目 {index + 1}</Typography.Paragraph>)}
      </div>
    </DemoPanel>
  )
}

function AccordionDemo() {
  return (
    <DemoPanel>
      <Collapse expandIconPlacement="left" expandMutex>
        <Collapse.Panel header="默认折叠" value="one">内容一</Collapse.Panel>
        <Collapse.Panel header="禁用面板" value="two" disabled>不可展开</Collapse.Panel>
        <Collapse.Panel header="点击整行展开" value="three">内容三</Collapse.Panel>
      </Collapse>
    </DemoPanel>
  )
}

function ThemeProviderDemo() {
  return (
    <DemoPanel>
      <div theme-mode="dark" className="theme-subtree">
        <Card title="dark subtree"><Button theme="primary">dark button</Button><input placeholder="dark input" /></Card>
      </div>
      <div style={{ "--td-brand-color": "var(--td-success-color)" } as React.CSSProperties}>
        <Button theme="primary">overridden brand variable</Button>
      </div>
      <ConfigProvider globalConfig={{ classPrefix: "t" }}>
        <Pagination total={20} />
      </ConfigProvider>
    </DemoPanel>
  )
}

function WatermarkDemo() {
  return (
    <DemoPanel>
      <div className="watermark-demo">
        <Typography.Paragraph>Acme Console</Typography.Paragraph>
        <Typography.Paragraph>多行水印示例</Typography.Paragraph>
      </div>
    </DemoPanel>
  )
}

function TourDemo() {
  const [current, setCurrent] = useState(-1)
  return (
    <DemoPanel>
      <div id="tour-target-one"><Button onClick={() => setCurrent(0)}>启动 Guide</Button></div>
      <div id="tour-target-two"><Tag>第二步目标</Tag></div>
      <GuideFallback current={current} onChange={setCurrent} />
    </DemoPanel>
  )
}

function GuideFallback({ current, onChange }: { current: number; onChange: (value: number) => void }) {
  return <Guide steps={[{ element: "#tour-target-one", title: "第一步", body: "点击这里" }, { element: "#tour-target-two", title: "第二步", body: "查看标签" }]} current={current} onChange={onChange} />
}

function FloatButtonDemo() {
  return (
    <DemoPanel>
      <StickyTool
        className="component-sticky-tool"
        placement="right-bottom"
        type="normal"
      >
        <StickyTool.StickyItem label="帮助" icon={<Icon name="help-circle" />} />
        <StickyTool.StickyItem label="设置" icon={<Icon name="settings" />} />
      </StickyTool>
    </DemoPanel>
  )
}

export const layoutDemos = {
  Affix: AffixDemo,
  Sidebar: SidebarDemo,
  Grid: GridDemo,
  Stack: StackDemo,
  Layout: LayoutDemo,
  Container: ContainerDemo,
  AspectRatio: AspectRatioDemo,
  Resizable: ResizableDemo,
  ScrollArea: ScrollAreaDemo,
  Accordion: AccordionDemo,
  ThemeProvider: ThemeProviderDemo,
  Watermark: WatermarkDemo,
  Tour: TourDemo,
  FloatButton: FloatButtonDemo,
} satisfies Record<string, () => ReactNode>
