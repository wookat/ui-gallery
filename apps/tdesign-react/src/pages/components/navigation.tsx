import { useState, type ReactNode } from "react"
import {
  Anchor,
  BackTop,
  Breadcrumb,
  Button,
  Dropdown,
  Menu,
  Pagination,
  Steps,
  Tabs,
  Typography,
} from "tdesign-react"
import { Icon } from "@/components/icon"
import { DemoPanel } from "./types"

function MenuDemo() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <DemoPanel>
      <Button onClick={() => setCollapsed((value) => !value)}>切换 collapsed</Button>
      <Menu collapsed={collapsed} value="dashboard" theme="light">
        <Menu.MenuItem value="dashboard" icon={<Icon name="layout-dashboard" />}>仪表盘</Menu.MenuItem>
        <Menu.MenuGroup title="工作区">
          <Menu.SubMenu value="products" title="产品">
            <Menu.MenuItem value="products-a">产品 A</Menu.MenuItem>
            <Menu.MenuItem value="products-b">产品 B</Menu.MenuItem>
          </Menu.SubMenu>
        </Menu.MenuGroup>
      </Menu>
      <Menu value="dark" theme="dark">
        <Menu.MenuItem value="dark">dark theme</Menu.MenuItem>
      </Menu>
    </DemoPanel>
  )
}

function NavbarDemo() {
  return (
    <DemoPanel>
      <Menu.HeadMenu theme="light" value="home">
        <Menu.MenuItem value="logo" disabled>Acme Console</Menu.MenuItem>
        <Menu.MenuItem value="home">首页</Menu.MenuItem>
        <Menu.MenuItem value="docs">文档</Menu.MenuItem>
        <Menu.MenuItem value="operation" disabled>操作区</Menu.MenuItem>
      </Menu.HeadMenu>
      <Menu.HeadMenu theme="dark" value="dark">
        <Menu.MenuItem value="dark">dark navbar</Menu.MenuItem>
      </Menu.HeadMenu>
    </DemoPanel>
  )
}

function DropdownDemo() {
  return (
    <DemoPanel>
      <Dropdown
        options={[
          { content: "编辑", value: "edit" },
          { content: "更多", value: "more", children: [{ content: "复制", value: "copy" }, { content: "移动", value: "move" }] },
          { content: "删除", value: "delete", theme: "error" },
          { content: "禁用", value: "disabled", disabled: true },
        ]}
        trigger="click"
        direction="right"
        maxColumnWidth={220}
      >
        <Button>click dropdown</Button>
      </Dropdown>
      <Dropdown options={[{ content: "hover item", value: "hover" }]} trigger="hover">
        <Button theme="danger">hover danger</Button>
      </Dropdown>
    </DemoPanel>
  )
}

function BreadcrumbDemo() {
  return (
    <DemoPanel>
      <Breadcrumb maxItemWidth="160px">
        <Breadcrumb.BreadcrumbItem href="/apps/tdesign-react/">首页</Breadcrumb.BreadcrumbItem>
        <Breadcrumb.BreadcrumbItem icon={<Icon name="boxes" />}>组件</Breadcrumb.BreadcrumbItem>
        <Breadcrumb.BreadcrumbItem disabled>当前页面</Breadcrumb.BreadcrumbItem>
      </Breadcrumb>
    </DemoPanel>
  )
}

function TabsDemo() {
  return (
    <DemoPanel>
      <Tabs theme="normal" placement="top" size="medium" addable>
        <Tabs.TabPanel label="首页" value="home">内容一</Tabs.TabPanel>
        <Tabs.TabPanel label="禁用" value="disabled" disabled>不可用</Tabs.TabPanel>
        <Tabs.TabPanel label="详情" value="detail">内容二</Tabs.TabPanel>
      </Tabs>
      <Tabs theme="card" placement="bottom">
        <Tabs.TabPanel label="底部" value="bottom">底部标签</Tabs.TabPanel>
        <Tabs.TabPanel label="左右" value="side">另一个内容</Tabs.TabPanel>
      </Tabs>
    </DemoPanel>
  )
}

function PaginationDemo() {
  return (
    <DemoPanel>
      <Pagination total={100} pageSize={10} showJumper pageSizeOptions={[10, 20, 50]} />
      <Pagination total={100} theme="simple" size="medium" totalContent="总计 {total} 条" />
      <Pagination total={20} disabled />
    </DemoPanel>
  )
}

function StepsDemo() {
  return (
    <DemoPanel>
      <Steps current={1} theme="default" readonly={false}>
        <Steps.StepItem title="完成" content="提交" />
        <Steps.StepItem title="处理中" content="审核" />
        <Steps.StepItem title="待完成" content="发布" />
      </Steps>
      <Steps current={2} theme="dot" layout="vertical" sequence="reverse">
        <Steps.StepItem title="完成" status="finish" />
        <Steps.StepItem title="出错" status="error" />
      </Steps>
    </DemoPanel>
  )
}

function AnchorDemo() {
  return (
    <DemoPanel>
      <div className="component-anchor-layout">
        <Anchor size="small">
          <Anchor.AnchorItem href="#anchor-one">第一节</Anchor.AnchorItem>
          <Anchor.AnchorItem href="#anchor-two">第二节</Anchor.AnchorItem>
          <Anchor.AnchorItem href="#anchor-three">第三节</Anchor.AnchorItem>
        </Anchor>
        <div>
          <div id="anchor-one"><Typography.Title level="h5">第一节</Typography.Title></div>
          <div className="anchor-spacer" />
          <div id="anchor-two"><Typography.Title level="h5">第二节</Typography.Title></div>
          <div className="anchor-spacer" />
          <div id="anchor-three"><Typography.Title level="h5">第三节</Typography.Title></div>
        </div>
      </div>
    </DemoPanel>
  )
}

function BackTopDemo() {
  return (
    <DemoPanel>
      <div className="scroll-demo" id="backtop-scroll">
        <Typography.Paragraph>{Array.from({ length: 8 }, (_, index) => `滚动内容 ${index + 1}。`)}</Typography.Paragraph>
        <BackTop container={() => document.querySelector("#backtop-scroll") as HTMLElement} shape="circle" size="small" theme="primary" />
      </div>
      <BackTop />
    </DemoPanel>
  )
}

export const navigationDemos = {
  Menu: MenuDemo,
  Navbar: NavbarDemo,
  Dropdown: DropdownDemo,
  Breadcrumb: BreadcrumbDemo,
  Tabs: TabsDemo,
  Pagination: PaginationDemo,
  Steps: StepsDemo,
  Anchor: AnchorDemo,
  BackTop: BackTopDemo,
} satisfies Record<string, () => ReactNode>
