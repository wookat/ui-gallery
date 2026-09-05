import { useEffect, useMemo, useState } from "react"
import { Button, Comment, Input, InputTag, List, Layout, Menu, Modal, PageHeader, Portal, Space, TreeSelect, Trigger, Typography } from "@arco-design/web-react"
import { Icon } from "@/components/icon"
import type { DemoProps } from "./shared"
import { DemoSection, navItems } from "./shared"

export function ComposedDemo({ name }: DemoProps) {
  switch (name) {
    case "Navbar": return <NavbarDemo />
    case "Sidebar": return <SidebarDemo />
    case "CommandPalette": return <CommandPaletteDemo />
    case "Portal": return <PortalDemo />
    case "Comment": return <CommentDemo />
    case "PageHeader": return <PageHeaderDemo />
    case "InputTag": return <InputTag defaultValue={["设计"]} tokenSeparators={[","]} />
    case "TreeSelect": return <TreeSelect treeData={[{ key: "1", title: "工作区", children: [{ key: "2", title: "设计" }, { key: "3", title: "研发" }] }]} multiple treeCheckable treeCheckStrictly placeholder="选择团队" />
    case "Trigger": return <Trigger trigger="click" popup={() => <div style={{ padding: 12, background: "var(--color-bg-2)" }}>Trigger 弹层</div>}><Button>点击触发</Button></Trigger>
    case "Space": return <Space wrap><Button>Space</Button><Button>组件</Button><Button>演示</Button></Space>
    case "Icon": return <Space><Icon name="apps" size={16} /><Icon name="settings" size={24} spin /><Icon name="home" size={32} /></Space>
    default: return null
  }
}

function NavbarDemo() {
  return <DemoSection><Layout.Header><Menu mode="horizontal"><Menu.Item key="brand">ACME</Menu.Item><Menu.Item key="docs">文档</Menu.Item><Menu.Item key="pricing">价格</Menu.Item></Menu></Layout.Header><Layout.Header style={{ background: "var(--color-bg-5)" }}><Menu mode="horizontal" theme="dark"><Menu.Item key="brand">暗色导航</Menu.Item><Menu.Item key="docs">文档</Menu.Item></Menu></Layout.Header></DemoSection>
}

function SidebarDemo() {
  const [collapsed, setCollapsed] = useState(false)
  return <Space align="start"><Button onClick={() => setCollapsed((value) => !value)}>切换侧栏</Button><Layout.Sider collapsed={collapsed} style={{ height: 140 }}><Menu collapse={collapsed}><Menu.Item key="dashboard">仪表盘</Menu.Item><Menu.Item key="settings">设置</Menu.Item></Menu></Layout.Sider></Space>
}

function CommandPaletteDemo() {
  const [visible, setVisible] = useState(false)
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => navItems.filter((item) => item.label.includes(query)), [query])
  useEffect(() => {
    const listener = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setVisible(true) } }
    window.addEventListener("keydown", listener)
    return () => window.removeEventListener("keydown", listener)
  }, [])
  return <><Button type="primary" onClick={() => setVisible(true)}>打开命令面板（⌘K）</Button><Modal visible={visible} footer={null} onCancel={() => setVisible(false)} autoFocus title="命令面板"><Input.Search autoFocus value={query} onChange={setQuery} placeholder="搜索导航" /><List dataSource={filtered} render={(item) => <List.Item key={item.key} actions={[<Button key="open" type="text" onClick={() => setVisible(false)}>打开</Button>]}>{item.label}</List.Item>} /></Modal></>
}

function CommentDemo() {
  return <Comment author="林晓" avatar={<div>林</div>} datetime="刚刚" content="这是一条评论。" actions={[<span key="reply">回复</span>, <span key="like">点赞</span>]}><Comment author="王子涵" avatar={<div>王</div>} content="嵌套回复。" /></Comment>
}

function PageHeaderDemo() {
  return <PageHeader title="页面标题" subTitle="副标题" backIcon={<Icon name="arrow-left" />} onBack={() => {}} breadcrumb={{ routes: [{ path: "/", breadcrumbName: "首页" }, { path: "/components", breadcrumbName: "组件" }] }} extra={<Button type="primary">操作</Button>} />
}

function PortalDemo() {
  return <DemoSection><Portal><Typography.Text>Portal 内容</Typography.Text></Portal><Typography.Text type="secondary">内容渲染到 Portal 容器。</Typography.Text></DemoSection>
}
