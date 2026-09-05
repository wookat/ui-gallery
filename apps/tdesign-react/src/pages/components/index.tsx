import { useState, type ReactNode } from "react"
import {
  Anchor,
  Button,
  Card,
  Divider,
  Dialog,
  Input,
  List,
  Link,
  Space,
  Tag,
  Typography,
} from "tdesign-react"
import contract from "@ui-gallery/spec/contract.json"
import { coverage } from "@/coverage"
import { DemoPanel } from "./types"
import { dataDemos } from "./data"
import { feedbackDemos } from "./feedback"
import { generalDemos } from "./general"
import { layoutDemos } from "./layout"
import { miscDemos, SupplementalDemo } from "./misc"
import { navigationDemos } from "./navigation"

const demos: Record<string, () => ReactNode> = {
  ...generalDemos,
  ...dataDemos,
  ...feedbackDemos,
  ...layoutDemos,
  ...miscDemos,
  ...navigationDemos,
  Divider: () => (
    <DemoPanel>
      <Divider>center</Divider>
      <Divider align="left" dashed>left dashed</Divider>
      <Divider align="right">right</Divider>
      <Divider layout="vertical" />
    </DemoPanel>
  ),
  Link: () => (
    <DemoPanel>
      <Space>
        <Link theme="primary" underline href="#component-Link">primary underline</Link>
        <Link theme="success" hover="color" href="#component-Link">success hover</Link>
        <Link disabled href="#component-Link">disabled</Link>
        <Link prefixIcon={<span>↗</span>} size="large" href="#component-Link">large</Link>
      </Space>
    </DemoPanel>
  ),
  Kbd: () => <Tag variant="outline">⌘ K</Tag>,
  Code: () => (
    <DemoPanel>
      <Typography.Text code>const acme = true</Typography.Text>
      <pre className="component-code"><code>const answer = 42{"\n"}console.log(answer)</code></pre>
    </DemoPanel>
  ),
  CommandPalette: () => <CommandPaletteDemo />,
  ThemeProvider: layoutDemos.ThemeProvider,
}

function CommandPaletteDemo() {
  const [visible, setVisible] = useState(false)
  const [query, setQuery] = useState("")
  const actions = ["打开仪表盘", "创建订单", "打开设置"].filter((item) => item.includes(query))
  return (
    <DemoPanel>
      <Button onClick={() => setVisible(true)}>打开命令面板 <Tag variant="outline">⌘K</Tag></Button>
      <Dialog visible={visible} header="Command Palette" onClose={() => setVisible(false)} footer={false}>
        <Input autofocus value={query} onChange={setQuery} placeholder="搜索命令" />
        <List>{actions.map((action) => <List.ListItem key={action}>{action}</List.ListItem>)}</List>
      </Dialog>
    </DemoPanel>
  )
}

function DemoFallback() {
  return (
    <DemoPanel>
      <Typography.Text>暂无演示</Typography.Text>
    </DemoPanel>
  )
}

function ComponentCard({ name }: { name: string }) {
  const Demo = demos[name] ?? DemoFallback
  const status = coverage[name]
  return (
    <section id={`component-${name}`} className="component-gallery-section">
      <Card
        title={
          <div className="inline component-card-title">
            <span>{name}</span>
            <Tag theme={status === "implemented" ? "success" : status === "composed" ? "warning" : "danger"}>{status}</Tag>
          </div>
        }
        bordered
      >
        <Demo />
      </Card>
    </section>
  )
}

const supplemental = [
  "Comment",
  "ImageViewer",
  "TagInput",
  "RangeInput",
  "SelectInput",
  "TreeSelect",
  "InputAdornment",
  "StickyTool",
  "TimeRangePicker",
  "DatePickerPanel",
  "DateRangePickerPanel",
  "TimePickerPanel",
  "Space",
  "Popup",
  "Guide",
  "Loading",
  "CheckTag",
  "DialogCard",
]

export function ComponentsPage() {
  return (
    <div className="stack components-page">
      <div className="page-heading">
        <div>
          <Typography.Title level="h2">组件全集</Typography.Title>
          <Typography.Paragraph>真实 TDesign React 组件、状态、尺寸和组合模式。</Typography.Paragraph>
        </div>
      </div>
      <Anchor className="components-anchor" size="small">
        {contract.components.map((name) => (
          <Anchor.AnchorItem key={name} href={`#component-${name}`}>{name}</Anchor.AnchorItem>
        ))}
      </Anchor>
      <div className="component-index">
        {contract.components.map((name) => <a href={`#component-${name}`} key={name}>{name}</a>)}
      </div>
      {contract.components.map((name) => <ComponentCard key={name} name={name} />)}
      <Card title="TDesign 补充">
        <div className="supplemental-grid">
          {supplemental.map((name) => (
            <div className="supplemental-card" key={name}>
              <Typography.Title level="h5">{name}</Typography.Title>
              <SupplementalDemo name={name} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
