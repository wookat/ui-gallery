import { useState, type ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Avatar, Badge, Breadcrumb, Button, Dropdown, Input, Layout, List, Nav, Popover, SideSheet, Tooltip, Typography } from "@douyinfe/semi-ui"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { Icon } from "@/icons"
import { useTheme } from "@/theme"

const { Sider, Header, Content } = Layout

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="acme-brand" to="/">
      <span className="acme-brand-mark">A</span>
      {compact ? null : <span>Acme Console</span>}
    </Link>
  )
}

function Navigation({ collapsed, onNavigate, onCollapse }: { collapsed: boolean; onNavigate?: () => void; onCollapse?: (value: boolean) => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const selected = nav.find((item) => item.path === location.pathname)?.key ?? "dashboard"
  return (
    <Nav
      style={{ height: "100%" }}
      isCollapsed={collapsed}
      onCollapseChange={onCollapse}
      selectedKeys={[selected]}
      onSelect={(data) => {
        const item = nav.find((entry) => entry.key === data.itemKey)
        if (item) navigate(item.path)
        onNavigate?.()
      }}
      header={{ logo: <span className="acme-brand-mark">A</span>, text: "Acme Console" }}
      footer={{ collapseButton: Boolean(onCollapse), children: collapsed ? null : <Link className="acme-brand" to="/settings"><Avatar size="small" color="light-blue">林</Avatar><span>林晓</span></Link> }}
    >
      <Nav.Sub itemKey="workspace" text="工作区" icon={<Icon name="grid" />}>
        {nav.slice(0, 4).map((item) => <Nav.Item key={item.key} itemKey={item.key} text={item.badge ? <span className="acme-between" style={{ width: "100%" }}>{item.label}<Badge count={item.badge} type="primary" /></span> : item.label} icon={<Icon name={item.icon} />} />)}
      </Nav.Sub>
      <Nav.Sub itemKey="system" text="系统" icon={<Icon name="settings" />}>
        {nav.slice(4).map((item) => <Nav.Item key={item.key} itemKey={item.key} text={item.label} icon={<Icon name={item.icon} />} />)}
      </Nav.Sub>
    </Nav>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const unread = notifications.filter((item) => item.unread).length
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider className="acme-shell-sider acme-desktop-only">
        <Navigation collapsed={collapsed} onCollapse={setCollapsed} />
      </Sider>
      <Layout style={{ minWidth: 0 }}>
        <Header className="acme-shell-header">
          <Button className="acme-mobile-only" theme="borderless" type="tertiary" icon={<Icon name="menu" size={20} />} aria-label="打开导航" onClick={() => setMobileOpen(true)} />
          <Breadcrumb className="acme-desktop-only">
            <Breadcrumb.Item onClick={() => navigate("/")}>Acme Console</Breadcrumb.Item>
            <Breadcrumb.Item>{current}</Breadcrumb.Item>
          </Breadcrumb>
          <Typography.Text className="acme-mobile-only" strong>{current}</Typography.Text>
          <div className="acme-row" style={{ marginLeft: "auto", flexWrap: "nowrap" }}>
            <Input className="acme-desktop-only" prefix={<Icon name="search" />} placeholder="搜索..." showClear style={{ width: 220 }} />
            <Popover trigger="click" position="bottomRight" content={<div style={{ width: 280, padding: 8 }}><List size="small" header={<Typography.Text strong>通知</Typography.Text>} dataSource={notifications} renderItem={(item) => <List.Item main={<div><Typography.Text strong={item.unread}>{item.title}</Typography.Text><br /><Typography.Text size="small" type="tertiary">{item.time}</Typography.Text></div>} />} /></div>}>
              <Badge count={unread} overflowCount={9}><Button theme="borderless" type="tertiary" icon={<Icon name="bell" size={20} />} aria-label="通知" /></Badge>
            </Popover>
            <Tooltip content="切换主题"><Button theme="borderless" type="tertiary" icon={<Icon name={theme === "dark" ? "sun" : "moon"} size={20} />} aria-label="切换主题" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} /></Tooltip>
            <Dropdown
              trigger="click"
              position="bottomRight"
              render={
                <Dropdown.Menu>
                  <Dropdown.Title>林晓 · m0@acme.dev</Dropdown.Title>
                  <Dropdown.Item icon={<Icon name="user" />} onClick={() => navigate("/settings")}>个人资料</Dropdown.Item>
                  <Dropdown.Item icon={<Icon name="settings" />} onClick={() => navigate("/settings")}>账户设置</Dropdown.Item>
                  <Dropdown.Item icon={<Icon name="users" />}>切换团队</Dropdown.Item>
                  <Dropdown.Item icon={<Icon name="circle-help" />}>帮助中心</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item icon={<Icon name="log-out" />} type="danger" onClick={() => navigate("/login")}>退出登录</Dropdown.Item>
                </Dropdown.Menu>
              }
            >
              <Avatar size="small" color="light-blue" style={{ cursor: "pointer" }}>林</Avatar>
            </Dropdown>
          </div>
        </Header>
        <Content className="acme-shell-main">{children}</Content>
      </Layout>
      <SideSheet placement="left" width={280} visible={mobileOpen} onCancel={() => setMobileOpen(false)} closable={false} bodyStyle={{ padding: 0 }} headerStyle={{ display: "none" }}>
        <Navigation collapsed={false} onNavigate={() => setMobileOpen(false)} />
      </SideSheet>
    </Layout>
  )
}
