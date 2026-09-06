import { useState, type ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { Avatar, Badge, Breadcrumb, Button, Drawer, Dropdown, Input, Layout, Menu, Popup } from "tdesign-react"
import { Icon } from "@/components/icon"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { useIsMobile, useThemeMode } from "@/url-settings"

function Brand() {
  return <Link className="app-brand" to="/"><span className="app-brand-mark">A</span><span>Acme Console</span></Link>
}

function Navigation({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const location = useLocation()
  return (
    <Menu value={location.pathname} collapsed={collapsed} className="app-sider-menu" onChange={() => onNavigate?.()}>
      <Menu.MenuGroup title="工作区">
        {nav.slice(0, 5).map((item) => (
          <Menu.MenuItem key={item.path} value={item.path} icon={<Icon name={item.icon} />}>
            <Link to={item.path}>{item.label}{item.badge ? <Badge count={item.badge} /> : null}</Link>
          </Menu.MenuItem>
        ))}
      </Menu.MenuGroup>
      <Menu.MenuGroup title="管理">
        {nav.slice(5).map((item) => (
          <Menu.MenuItem key={item.path} value={item.path} icon={<Icon name={item.icon} />}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.MenuItem>
        ))}
      </Menu.MenuGroup>
    </Menu>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const location = useLocation()
  const { theme, toggle } = useThemeMode()
  const isMobile = useIsMobile()
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const notificationContent = <div style={{ width: 300 }}><div className="stack">{notifications.map((item) => <div key={item.title}><strong>{item.title}</strong><div style={{ color: "var(--td-text-color-secondary)" }}>{item.time}</div></div>)}</div></div>
  return (
    <Layout className="app-layout">
      <Layout.Aside className="app-aside" width={String(collapsed ? 64 : 240)}>
        <Brand />
        <Navigation collapsed={collapsed} />
        <div className="app-user"><Avatar size="32px">林</Avatar>{!collapsed && <span>林晓</span>}</div>
      </Layout.Aside>
      <Layout>
        <Layout.Header className="app-header">
          <Button variant="text" shape="square" size="large" onClick={() => setDrawer(true)} className="mobile-only"><Icon name="list" /></Button>
          <Breadcrumb><Breadcrumb.BreadcrumbItem><Link to="/">Acme Console</Link></Breadcrumb.BreadcrumbItem><Breadcrumb.BreadcrumbItem>{current}</Breadcrumb.BreadcrumbItem></Breadcrumb>
          <div className="app-header-spacer" />
          <Input className="desktop-search" prefixIcon={<Icon name="search" />} placeholder="搜索..." />
          <Popup trigger="click" content={notificationContent}><Badge count={3}><Button variant="text" shape="square" size="large"><Icon name="bell" /></Button></Badge></Popup>
          <Button variant="text" shape="square" size="large" onClick={toggle}><Icon name={theme === "dark" ? "sun" : "moon"} /></Button>
          <Dropdown options={[{ content: "个人资料", value: "profile" }, { content: "账户设置", value: "settings" }, { content: "偏好设置", value: "preferences" }, { content: "帮助中心", value: "help" }, { content: "退出登录", value: "logout" }]}><Avatar size="32px">林</Avatar></Dropdown>
          <Button variant="text" shape="square" size="large" onClick={() => setCollapsed(!collapsed)} className="desktop-only"><Icon name="menu" /></Button>
        </Layout.Header>
        <Layout.Content><main className="app-main">{children}</main></Layout.Content>
      </Layout>
      <Drawer visible={isMobile && drawer} placement="left" size="280px" footer={false} onClose={() => setDrawer(false)}><Brand /><Navigation onNavigate={() => setDrawer(false)} /></Drawer>
    </Layout>
  )
}
