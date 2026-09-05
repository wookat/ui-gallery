import { useRef, useState } from "react"
import { Anchor, Affix, BackTop, Breadcrumb, Button, Dropdown, Menu, Pagination, Space, Steps, Tabs, Tooltip, Typography } from "@arco-design/web-react"
import { Icon } from "@/components/icon"
import { useIsMobile } from "@/hooks/use-mobile"
import type { DemoProps } from "./shared"
import { DemoSection, sizes } from "./shared"

export function NavigationDemo({ name }: DemoProps) {
  switch (name) {
    case "Tooltip": return <TooltipDemo />
    case "Menu": return <MenuDemo />
    case "Dropdown": return <DropdownDemo />
    case "Breadcrumb": return <BreadcrumbDemo />
    case "Tabs": return <TabsDemo />
    case "Pagination": return <PaginationDemo />
    case "Steps": return <StepsDemo />
    case "Anchor": return <AnchorDemo />
    case "BackTop": return <AnchorDemo backTop />
    case "Affix": return <AffixDemo />
    default: return null
  }
}

function TooltipDemo() {
  return <Space wrap>{["top", "bottom", "left", "right"].map((position) => <Tooltip key={position} position={position as "top" | "bottom" | "left" | "right"} mini color="arcoblue" content={`Tooltip ${position}`}><Button>{position}</Button></Tooltip>)}</Space>
}

function MenuDemo() {
  const [collapse, setCollapse] = useState(false)
  return <DemoSection><Menu mode="horizontal" theme="light" selectedKeys={["dashboard"]}><Menu.Item key="dashboard">首页</Menu.Item><Menu.Item key="docs">文档</Menu.Item></Menu><Space><Button onClick={() => setCollapse((value) => !value)}>切换折叠</Button><Menu style={{ width: collapse ? 72 : 220 }} collapse={collapse} theme="dark" defaultOpenKeys={["team"]}><Menu.Item key="one">菜单一</Menu.Item><Menu.SubMenu key="team" title="团队"><Menu.ItemGroup title="成员"><Menu.Item key="two">设计</Menu.Item><Menu.Item key="three">研发</Menu.Item></Menu.ItemGroup></Menu.SubMenu><Menu.SubMenu key="popup" title="弹出"><Menu.Item key="four">设置</Menu.Item></Menu.SubMenu></Menu></Space></DemoSection>
}

function DropdownDemo() {
  const menu = <Menu><Menu.Item key="edit">编辑</Menu.Item><Menu.Item key="disabled" disabled>禁用项</Menu.Item><Menu.Item key="delete">删除</Menu.Item></Menu>
  return <Space wrap><Dropdown droplist={menu} trigger="click" position="bottom"><Button>点击菜单</Button></Dropdown><Dropdown droplist={menu} trigger="hover" position="br"><Button>悬停菜单</Button></Dropdown><Dropdown.Button droplist={menu}>Dropdown.Button</Dropdown.Button></Space>
}

function BreadcrumbDemo() {
  const drop = <Menu><Menu.Item key="account">账户</Menu.Item><Menu.Item key="billing">账单</Menu.Item></Menu>
  return <Breadcrumb separator=">"><Breadcrumb.Item href="#"><Icon name="home" /> 首页</Breadcrumb.Item><Breadcrumb.Item droplist={drop}>设置</Breadcrumb.Item><Breadcrumb.Item>个人资料</Breadcrumb.Item></Breadcrumb>
}

function TabsDemo() {
  return <Space direction="vertical" style={{ width: "100%" }}>{(["line", "card", "card-gutter", "text", "rounded", "capsule"] as const).map((type) => <Tabs key={type} type={type} size="small" tabPosition="top" editable extra={<Button size="mini">操作</Button>} lazyload><Tabs.TabPane key="one" title={`概览 ${type}`}>概览内容</Tabs.TabPane><Tabs.TabPane key="two" title="详情">详情内容</Tabs.TabPane></Tabs>)}</Space>
}

function PaginationDemo() {
  const isMobile = useIsMobile()
  return <Space direction="vertical" style={{ width: "100%" }}>{sizes.map((size) => <Pagination key={size} size={size} total={80} showTotal={!isMobile} showJumper={!isMobile} sizeCanChange={!isMobile} simple={isMobile} />)}<Pagination total={1} hideOnSinglePage disabled simple /></Space>
}

function StepsDemo() {
  const isMobile = useIsMobile()
  const [current, setCurrent] = useState(1)
  return <DemoSection><Space direction="vertical" style={{ width: "100%" }}>{(["default", "arrow", "dot", "navigation"] as const).map((type) => <div key={type} className="scroll-x"><Typography.Text type="secondary">{type}</Typography.Text><Steps type={type} current={current} status={type === "navigation" ? "error" : undefined} direction={type === "dot" || (isMobile && type === "default") ? "vertical" : "horizontal"} size="small" labelPlacement={type === "navigation" ? "horizontal" : "vertical"} style={isMobile && (type === "arrow" || type === "navigation") ? { minWidth: 420 } : undefined}><Steps.Step title="步骤一" /><Steps.Step title="处理中" /><Steps.Step title="完成" /></Steps></div>)}<Button onClick={() => setCurrent((value) => (value + 1) % 3)}>下一步</Button></Space></DemoSection>
}

function AnchorDemo({ backTop = false }: { backTop?: boolean }) {
  const boxId = "component-anchor-scroll-box"
  const sections = ["基本信息", "详细配置", "确认提交"]
  return <div style={{ position: "relative" }}><div id={boxId} style={{ height: 200, overflow: "auto", border: "1px solid var(--color-neutral-3)", padding: 12, display: "flex", gap: 16 }}><Anchor scrollContainer={`#${boxId}`} affix={false} style={{ flex: "none" }}>{sections.map((title, index) => <Anchor.Link key={title} href={`#${boxId}-${index}`} title={title} />)}</Anchor><div style={{ flex: 1, minWidth: 0 }}>{sections.map((title, index) => <div id={`${boxId}-${index}`} key={title} style={{ minHeight: 160 }}><Typography.Title heading={6}>{title}</Typography.Title><Typography.Paragraph type="secondary">滚动容器时左侧锚点会同步高亮当前区块，点击锚点可直接跳转。</Typography.Paragraph></div>)}</div></div>{backTop && <BackTop target={() => document.getElementById(boxId) ?? window} visibleHeight={20} style={{ position: "absolute", right: 16, bottom: 16 }}><Button shape="circle" type="primary" className="hit-area" icon={<Icon name="arrow-up" />} aria-label="回到顶部" /></BackTop>}</div>
}

function AffixDemo() {
  const ref = useRef<HTMLDivElement>(null)
  return <div ref={ref} style={{ height: 160, overflow: "auto", border: "1px solid var(--color-neutral-3)" }}><div style={{ padding: 12 }}><Affix offsetTop={8} target={() => ref.current}><Button type="primary">固定在容器顶部</Button></Affix>{[1, 2, 3, 4].map((index) => <Typography.Paragraph key={index} type="secondary" style={{ marginTop: 12 }}>容器内的第 {index} 段内容，向下滚动时上方按钮保持固定。</Typography.Paragraph>)}</div></div>
}
