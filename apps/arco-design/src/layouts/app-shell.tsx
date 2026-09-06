import { useState, type ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Avatar, Badge, Breadcrumb, Button, Dropdown, Input, Layout, List, Menu, Drawer, Popover, Typography } from "@arco-design/web-react"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { Icon } from "@/components/icon"
import { useIsMobile } from "@/hooks/use-mobile"
import { useThemeContext } from "@/theme"

const { Header, Sider, Content } = Layout

function Brand() {
  return (
    <Link className="brand" to="/">
      <span className="brand-mark">A</span>
      <span>Acme Console</span>
    </Link>
  )
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  return (
    <Menu selectedKeys={[location.pathname]} onClickMenuItem={onNavigate} style={{ width: "100%" }}>
      {nav.map((item) => (
        <Menu.Item key={item.path}>
          <Link to={item.path} className="nav-link">
            <Icon name={item.icon} />
            <span className="nav-label">{item.label}</span>
            {item.badge ? <Badge count={item.badge} dot={false} className="nav-badge" /> : null}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { theme, toggleTheme } = useThemeContext()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"

  const themeToggle = () => {
    toggleTheme()
    const params = new URLSearchParams(window.location.search)
    params.set("theme", theme === "dark" ? "light" : "dark")
    navigate(`${location.pathname}?${params.toString()}`)
  }

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">个人资料</Menu.Item>
      <Menu.Item key="settings"><Link to="/settings">账户设置</Link></Menu.Item>
      <Menu.Item key="billing">账单与套餐</Menu.Item>
      <Menu.Item key="help">帮助中心</Menu.Item>
      <Menu.Item key="logout">退出登录</Menu.Item>
    </Menu>
  )

  const unread = notifications.filter((item) => item.unread).length
  const notificationList = (
    <List
      className="notification-list"
      size="small"
      header={<Typography.Text bold>通知</Typography.Text>}
      dataSource={notifications}
      render={(item) => (
        <List.Item key={item.title}>
          <List.Item.Meta title={item.title} description={item.time} />
          {item.unread ? <Badge status="processing" /> : null}
        </List.Item>
      )}
    />
  )

  return (
    <Layout className="app-layout">
      {!isMobile ? (
        <Sider className="app-sider" breakpoint="md" collapsible defaultCollapsed={false} width={240}>
          <div className="sider-brand"><Brand /></div>
          <Typography.Text className="sider-label">工作区</Typography.Text>
          <Navigation />
          <div className="sider-user">
            <Avatar size={32}>林</Avatar>
            <div><Typography.Text>林晓</Typography.Text><Typography.Text type="secondary">管理员</Typography.Text></div>
          </div>
        </Sider>
      ) : null}
      <Layout>
        <Header className="app-header">
          <div className="header-left">
            {isMobile ? <Button size="large" className="mobile-only hit-area" type="text" icon={<Icon name="menu" />} onClick={() => setDrawerOpen(true)} aria-label="打开导航" /> : null}
            <Breadcrumb>
              <Breadcrumb.Item><Link to="/">Acme Console</Link></Breadcrumb.Item>
              <Breadcrumb.Item>{current}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="header-actions">
            <Input.Search className="header-search" placeholder="搜索..." allowClear />
            <Button size="large" type="text" className="hit-area" icon={<Icon name={theme === "dark" ? "sun" : "moon"} />} onClick={themeToggle} aria-label="切换主题" />
            <Popover trigger="click" position="br" content={notificationList}>
              <Badge count={unread} offset={[-6, 6]}>
                <Button size="large" type="text" className="hit-area" icon={<Icon name="bell" />} aria-label="通知" />
              </Badge>
            </Popover>
            <Dropdown droplist={userMenu} position="br">
              <Button size="large" type="text" className="user-trigger hit-area"><Avatar size={30}>林</Avatar></Button>
            </Dropdown>
          </div>
        </Header>
        <Content className="app-content"><main className="page">{children}</main></Content>
      </Layout>
      <Drawer title={<Brand />} visible={drawerOpen} placement="left" width={280} onCancel={() => setDrawerOpen(false)} footer={null}>
        <Navigation onNavigate={() => setDrawerOpen(false)} />
      </Drawer>
    </Layout>
  )
}
