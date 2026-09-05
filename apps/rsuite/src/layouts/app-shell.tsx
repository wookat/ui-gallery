import { useState, type ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Avatar, Badge, Breadcrumb, Container, Content, Drawer, Dropdown, Header, IconButton, Input, InputGroup, Navbar, Nav, Popover, Sidenav, Sidebar, Whisper, useMediaQuery } from "rsuite"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import team from "@ui-gallery/spec/mock/team.json"
import { Icon } from "@/components/icon"
import { useTheme } from "@/components/theme-context"

function SideNav({ expanded, onToggle, onNavigate }: { expanded: boolean; onToggle: () => void; onNavigate?: () => void }) {
  const location = useLocation()
  const member = team[0]
  return <Sidenav expanded={expanded} appearance="default" activeKey={location.pathname} onSelect={() => onNavigate?.()}>
    <Sidenav.Header><div style={{ padding: 18, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden" }}><span className="avatar-letter" style={{ width: 28, height: 28, borderRadius: 7, marginRight: 8 }}>A</span>{expanded ? "Acme Console" : ""}</div></Sidenav.Header>
    <Sidenav.Body><Nav>{nav.map((item) => <Nav.Item key={item.key} eventKey={item.path} icon={<Icon name={item.icon} />} as={Link} to={item.path}>{expanded ? <span style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>{item.label}{item.badge ? <Badge content={item.badge} /> : null}</span> : null}</Nav.Item>)}</Nav></Sidenav.Body>
    <div style={{ borderTop: "1px solid var(--rs-border-primary)", padding: expanded ? 12 : 8, display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
      <Avatar circle size="sm">{member.name.slice(0, 1)}</Avatar>
      {expanded ? <span style={{ minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><b>{member.name}</b><small className="muted" style={{ display: "block" }}>{member.email}</small></span> : null}
    </div>
    <Sidenav.Toggle onToggle={onToggle} />
  </Sidenav>
}

function NotificationPopover({ ref }: { ref?: React.Ref<HTMLDivElement> }) {
  return <Popover ref={ref} title="通知"><div style={{ minWidth: 240 }}>{notifications.map((item) => <div key={item.title} style={{ padding: "8px 0", borderBottom: "1px solid var(--rs-border-primary)" }}><div>{item.unread ? "● " : ""}{item.title}</div><small className="muted">{item.time}</small></div>)}</div></Popover>
}

export function AppShell({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(true)
  const [drawer, setDrawer] = useState(false)
  const [isMobile] = useMediaQuery("(max-width: 767px)")
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const toggleTheme = () => { const next = theme === "dark" ? "light" : "dark"; setTheme(next); const url = new URL(window.location.href); url.searchParams.set("theme", next); navigate(`${location.pathname}?${url.searchParams.toString()}`) }
  return <Container>
    {!isMobile ? <Sidebar width={expanded ? 240 : 56} collapsible><SideNav expanded={expanded} onToggle={() => setExpanded((value) => !value)} /></Sidebar> : null}
    <Container>
      <Header><Navbar appearance="default"><Navbar.Brand as={Link} to="/" className="mobile-only">ACME</Navbar.Brand><Nav style={{ flex: 1 }}>{isMobile ? <IconButton className="mobile-only" icon={<Icon name="menu" />} onClick={() => setDrawer(true)} /> : null}<Breadcrumb className="desktop-only"><Breadcrumb.Item as={Link} to="/">首页</Breadcrumb.Item><Breadcrumb.Item active>{current}</Breadcrumb.Item></Breadcrumb></Nav><Nav pullRight><InputGroup inside className="desktop-only" style={{ width: 210, margin: "8px 12px" }}><InputGroup.Addon><Icon name="search" size={14} /></InputGroup.Addon><Input placeholder="搜索" /></InputGroup><Whisper trigger="click" placement="bottomEnd" speaker={<NotificationPopover />}><IconButton icon={<Badge content={notifications.filter((item) => item.unread).length}><Icon name="bell" /></Badge>} /></Whisper><IconButton icon={<Icon name={theme === "dark" ? "sun" : "moon"} />} onClick={toggleTheme} /><Dropdown placement="bottomEnd" renderToggle={(props, ref) => <IconButton {...props} ref={ref} icon={<Avatar circle size="sm">林</Avatar>} />}><Dropdown.Item>个人资料</Dropdown.Item><Dropdown.Item>账号设置</Dropdown.Item><Dropdown.Item>帮助中心</Dropdown.Item><Dropdown.Item divider /><Dropdown.Item>退出登录</Dropdown.Item></Dropdown></Nav></Navbar></Header>
      <Content className="app-content">{children}</Content>
    </Container>
    <Drawer open={drawer} placement="left" onClose={() => setDrawer(false)}><Drawer.Header><Drawer.Title>导航</Drawer.Title></Drawer.Header><Drawer.Body style={{ padding: 0 }}><SideNav expanded onToggle={() => undefined} onNavigate={() => setDrawer(false)} /></Drawer.Body></Drawer>
  </Container>
}
