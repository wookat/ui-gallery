import { useState, type ReactNode } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Breadcrumbs, Button, Classes, Drawer, InputGroup, Menu, MenuDivider, MenuItem, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Popover, Tag, Tooltip } from "@blueprintjs/core"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { icon } from "@/lib/icons"
import { applyTheme, resolveDark, withParams } from "@/lib/settings"
import { Avatar } from "@/pages/shared"

function Brand({ collapsed }: { collapsed?: boolean }) {
  const navigate = useNavigate()
  return (
    <div className="row" style={{ padding: 12, cursor: "pointer" }} onClick={() => navigate(withParams("/"))}>
      <span className="avatar" style={{ borderRadius: 6 }}>A</span>
      {collapsed ? null : <strong className="shell-label">Acme Console</strong>}
    </div>
  )
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const go = (path: string) => { navigate(withParams(path)); onNavigate?.() }
  const groups = [
    { title: "工作区", keys: ["dashboard", "orders", "form", "chat"] },
    { title: "资源", keys: ["components", "landing", "settings", "login"] },
  ]
  return (
    <Menu className="shell-nav" large>
      {groups.map((group) => (
        <div key={group.title}>
          <MenuDivider title={<span className="shell-label">{group.title}</span>} />
          {nav.filter((item) => group.keys.includes(item.key)).map((item) => (
            <MenuItem key={item.key} icon={icon(item.icon)} text={<span className="shell-label">{item.label}</span>} active={location.pathname === item.path} onClick={() => go(item.path)} labelElement={item.badge ? <Tag round intent="primary" className="shell-label">{item.badge}</Tag> : undefined} />
          ))}
        </div>
      ))}
    </Menu>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(resolveDark)
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const unread = notifications.filter((n) => n.unread).length
  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    applyTheme(next)
    const params = new URLSearchParams(window.location.search)
    params.set("theme", next ? "dark" : "light")
    navigate(`${location.pathname}?${params.toString()}`)
  }
  const userMenu = (
    <Menu>
      <MenuDivider title="林晓 · lin@acme.dev" />
      <MenuItem icon={icon("user")} text="个人资料" onClick={() => navigate(withParams("/settings"))} />
      <MenuItem icon={icon("settings")} text="账户设置" onClick={() => navigate(withParams("/settings"))} />
      <MenuItem icon={icon("bell")} text="通知偏好" />
      <MenuItem icon={icon("circle-help")} text="帮助中心" />
      <MenuDivider />
      <MenuItem icon={icon("log-out")} text="退出登录" intent="danger" onClick={() => navigate(withParams("/login"))} />
    </Menu>
  )
  const notificationList = (
    <Menu style={{ width: 300 }}>
      <MenuDivider title={`通知（${unread} 条未读）`} />
      {notifications.map((n) => (
        <MenuItem key={n.title} icon={n.unread ? icon("bell") : icon("check")} text={n.title} label={n.time} intent={n.unread ? "primary" : "none"} />
      ))}
      <MenuDivider />
      <MenuItem text="查看全部" icon={icon("arrow-right")} />
    </Menu>
  )
  return (
    <div className="shell">
      <aside className={`shell-sidebar ${collapsed ? "collapsed" : ""}`}>
        <Brand collapsed={collapsed} />
        <Navigation />
        <div style={{ padding: 8 }}>
          <Button fill minimal icon={icon(collapsed ? "chevron-right" : "chevron-left")} onClick={() => setCollapsed(!collapsed)} aria-label="折叠侧边栏">{collapsed ? "" : "折叠"}</Button>
        </div>
        <div className="shell-user">
          <Avatar name="林晓" />
          <div className="shell-user-text min0">
            <div className="truncate"><strong>林晓</strong></div>
            <div className={`${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL} truncate`}>lin@acme.dev</div>
          </div>
        </div>
      </aside>
      <div className="shell-main">
        <div className="shell-header">
          <Navbar>
            <NavbarGroup align="left" style={{ minWidth: 0 }}>
              <Button className="mobile-only" minimal icon={icon("menu")} aria-label="打开导航" onClick={() => setMobileOpen(true)} />
              <NavbarHeading className="mobile-only" style={{ marginLeft: 4 }}>Acme</NavbarHeading>
              <span className="desktop-only"><Breadcrumbs items={[{ text: "Acme Console", onClick: () => navigate(withParams("/")) }, { text: current, current: true }]} /></span>
            </NavbarGroup>
            <NavbarGroup align="right">
              <span className="desktop-only"><InputGroup leftIcon={icon("search")} placeholder="搜索订单、客户…" round style={{ width: 240 }} rightElement={<Tag minimal>⌘K</Tag>} /></span>
              <NavbarDivider className="desktop-only" />
              <Popover content={notificationList} placement="bottom-end">
                <Tooltip content="通知"><Button minimal icon={icon("bell")} aria-label="通知">{unread ? <Tag round intent="danger" style={{ marginLeft: 2 }}>{unread}</Tag> : null}</Button></Tooltip>
              </Popover>
              <Tooltip content={dark ? "切换到亮色" : "切换到暗色"}><Button minimal icon={icon(dark ? "sun" : "moon")} onClick={toggleTheme} aria-label="切换主题" /></Tooltip>
              <Popover content={userMenu} placement="bottom-end">
                <Button minimal style={{ paddingLeft: 4, paddingRight: 4 }} aria-label="账户菜单"><Avatar name="林晓" /></Button>
              </Popover>
            </NavbarGroup>
          </Navbar>
          <div className="mobile-only shell-search-mobile" style={{ padding: "0 12px 8px" }}><InputGroup fill leftIcon={icon("search")} placeholder="搜索订单、客户…" round /></div>
        </div>
        <main className="shell-content">{children}</main>
      </div>
      <Drawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} position="left" size="280px" title="Acme Console" icon={icon("menu")}>
        <Navigation onNavigate={() => setMobileOpen(false)} />
        <div className="shell-user"><Avatar name="林晓" /><div><strong>林晓</strong><div className={Classes.TEXT_MUTED}>lin@acme.dev</div></div></div>
      </Drawer>
    </div>
  )
}
