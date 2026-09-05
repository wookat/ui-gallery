import { useRef, useState, type MouseEvent, type ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import team from "@ui-gallery/spec/mock/team.json"
import { ActionList, ActionMenu, Avatar, Button, CounterLabel, Dialog, Header, IconButton, NavList, PageLayout, Text, TextInput, Tooltip } from "@primer/react"
import { Icon, iconFor } from "@/lib/icon"
import { useColorMode } from "@/lib/color-mode"
import { avatarFor } from "@/lib/avatar"

const me = team[0]

function Brand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link className="brand flex items-center gap-2" to="/" aria-label="Acme Console 首页">
      <span className="brand-mark">A</span>
      {collapsed ? null : <span>Acme Console</span>}
    </Link>
  )
}

function Navigation({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <NavList aria-label="工作区">
      {collapsed ? null : <NavList.GroupHeading>工作区</NavList.GroupHeading>}
      {nav.map((item) => {
        const active = location.pathname === item.path
        const node = (
          <NavList.Item
            key={item.key}
            href={item.path}
            aria-current={active ? "page" : undefined}
            onClick={(event: MouseEvent) => { event.preventDefault(); navigate(item.path); onNavigate?.() }}
          >
            <NavList.LeadingVisual><Icon name={item.icon} /></NavList.LeadingVisual>
            {collapsed ? <span className="sr-only">{item.label}</span> : item.label}
            {item.badge && !collapsed ? <NavList.TrailingVisual><CounterLabel>{item.badge}</CounterLabel></NavList.TrailingVisual> : null}
          </NavList.Item>
        )
        return collapsed ? <Tooltip key={item.key} text={item.label} direction="e">{node}</Tooltip> : node
      })}
    </NavList>
  )
}

function Notifications() {
  const [items, setItems] = useState(notifications)
  const unread = items.filter((n) => n.unread).length
  return (
    <ActionMenu>
      <ActionMenu.Anchor>
        <span className="badge-anchor">
          <IconButton size="large" aria-label={`通知，${unread} 条未读`} icon={iconFor("bell")} />
          {unread > 0 ? <CounterLabel scheme="primary" className="badge-dot">{unread}</CounterLabel> : null}
        </span>
      </ActionMenu.Anchor>
      <ActionMenu.Overlay align="end" width="medium">
        <div className="flex items-center justify-between" style={{ padding: "8px 16px" }}>
          <Text weight="semibold">通知</Text>
          <Button size="small" variant="invisible" onClick={() => setItems(items.map((n) => ({ ...n, unread: false })))}>全部标为已读</Button>
        </div>
        <ActionList>
          {items.map((n) => (
            <ActionList.Item key={n.title} onSelect={() => setItems(items.map((x) => (x.title === n.title ? { ...x, unread: false } : x)))}>
              <ActionList.LeadingVisual><Icon name={n.unread ? "bell-fill" : "bell"} /></ActionList.LeadingVisual>
              <span style={{ fontWeight: n.unread ? 600 : 400 }}>{n.title}</span>
              <ActionList.Description variant="block">{n.time}</ActionList.Description>
            </ActionList.Item>
          ))}
          <ActionList.Divider />
          <ActionList.Item onSelect={() => undefined}>查看全部通知</ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { mode, setMode } = useColorMode()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const mobileButtonRef = useRef<HTMLButtonElement>(null)
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const toggleTheme = () => {
    const next = mode === "dark" ? "light" : "dark"
    setMode(next)
    const params = new URLSearchParams(window.location.search)
    params.set("theme", next)
    navigate(`${location.pathname}?${params.toString()}`)
  }
  const go = (path: string) => () => navigate(path)
  return (
    <PageLayout containerWidth="full" padding="none" columnGap="none" rowGap="none">
      <PageLayout.Pane position="start" className={collapsed ? "shell-sidebar collapsed" : "shell-sidebar"} aria-label="主导航" sticky padding="none" hidden={{ narrow: true, regular: false }} width={{ min: "64px", default: collapsed ? "64px" : "240px", max: "280px" }} divider="line">
        <div className="stack-4" style={{ padding: 16 }}>
          <div className="flex items-center justify-between gap-2">
            <Brand collapsed={collapsed} />
          </div>
          <Navigation collapsed={collapsed} />
          <div style={{ marginTop: "auto" }}>
            <IconButton size="large" aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"} aria-expanded={!collapsed} icon={iconFor(collapsed ? "sidebar-expand" : "sidebar-collapse")} onClick={() => setCollapsed(!collapsed)} />
          </div>
        </div>
      </PageLayout.Pane>
      <PageLayout.Content className="shell-main" width="full" padding="none">
        <Header className="shell-header" aria-label="页面导航">
          <Header.Item>
            <IconButton size="large" ref={mobileButtonRef} className="mobile-only" aria-label="打开导航菜单" icon={iconFor("menu")} onClick={() => setMobileOpen(true)} />
          </Header.Item>
          <Header.Item className="desktop-only">
            <nav aria-label="面包屑" className="muted">
              <span>Acme Console</span><span aria-hidden="true"> / </span><Text weight="semibold" style={{ color: "var(--fgColor-default)" }}>{current}</Text>
            </nav>
          </Header.Item>
          <Header.Item full />
          <Header.Item className="desktop-only">
            <TextInput className="shell-search" aria-label="搜索" placeholder="搜索订单、用户、文档..." leadingVisual={iconFor("search")} trailingVisual={() => <kbd className="kbd">⌘K</kbd>} />
          </Header.Item>
          <Header.Item><Notifications /></Header.Item>
          <Header.Item>
            <IconButton size="large" aria-label={mode === "dark" ? "切换为浅色模式" : "切换为深色模式"} icon={iconFor(mode === "dark" ? "sun" : "moon")} onClick={toggleTheme} />
          </Header.Item>
          <Header.Item>
            <ActionMenu>
              <ActionMenu.Anchor>
                <button type="button" className="avatar-button" aria-label="打开账户菜单">
                  <Avatar src={avatarFor(me.name)} alt={me.name} size={32} />
                </button>
              </ActionMenu.Anchor>
              <ActionMenu.Overlay align="end" width="small">
                <ActionList>
                  <ActionList.Item onSelect={go("/settings")}>
                    <ActionList.LeadingVisual><Avatar src={avatarFor(me.name)} alt="" size={20} /></ActionList.LeadingVisual>
                    {me.name}
                    <ActionList.Description variant="block">{me.email}</ActionList.Description>
                  </ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item onSelect={go("/settings")}><ActionList.LeadingVisual><Icon name="user" /></ActionList.LeadingVisual>个人资料</ActionList.Item>
                  <ActionList.Item onSelect={go("/settings")}><ActionList.LeadingVisual><Icon name="gear" /></ActionList.LeadingVisual>账户设置</ActionList.Item>
                  <ActionList.Item onSelect={go("/settings")}><ActionList.LeadingVisual><Icon name="credit-card" /></ActionList.LeadingVisual>订阅与账单</ActionList.Item>
                  <ActionList.Item onSelect={toggleTheme}><ActionList.LeadingVisual><Icon name={mode === "dark" ? "sun" : "moon"} /></ActionList.LeadingVisual>切换主题</ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item variant="danger" onSelect={go("/login")}><ActionList.LeadingVisual><Icon name="log-out" /></ActionList.LeadingVisual>退出登录</ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </Header.Item>
        </Header>
        <main className="page-content">{children}</main>
      </PageLayout.Content>
      {mobileOpen ? (
        <Dialog title="导航菜单" position="left" width="small" returnFocusRef={mobileButtonRef} onClose={() => setMobileOpen(false)}>
          <div style={{ marginBottom: 24 }}><Brand /></div>
          <Navigation onNavigate={() => setMobileOpen(false)} />
        </Dialog>
      ) : null}
    </PageLayout>
  )
}
