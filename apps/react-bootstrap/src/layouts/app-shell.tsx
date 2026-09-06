import { useState, type ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Badge, Breadcrumb, Button, Card, Dropdown, Form, Nav, Navbar, Offcanvas } from "react-bootstrap"
import { Icon } from "@ui-gallery/icons-react"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { Brand } from "@/pages/shared"

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  return <Nav variant="pills" className="flex-column gap-1">{nav.map((item) => <Nav.Link as={Link} to={item.path} key={item.key} active={location.pathname === item.path} onClick={onNavigate} className="d-flex align-items-center gap-2 text-nowrap"><Icon name={item.icon} size={17} /><span>{item.label}</span>{item.badge ? <Badge bg="secondary" className="ms-auto">{item.badge}</Badge> : null}</Nav.Link>)}</Nav>
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [narrow, setNarrow] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState(document.documentElement.getAttribute("data-bs-theme") ?? "light")
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const unread = notifications.filter((item) => item.unread).length
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    document.documentElement.setAttribute("data-bs-theme", next)
    const params = new URLSearchParams(window.location.search)
    params.set("theme", next)
    navigate(`${location.pathname}?${params.toString()}`)
  }
  return <div className="app-shell">
    <aside className={`app-sidebar bg-body-tertiary border-end p-3 d-none d-lg-flex flex-column ${narrow ? "narrow" : ""}`}><Brand /><div className="small text-body-secondary text-uppercase mt-4 mb-2">{narrow ? "" : "工作区"}</div><Navigation /><Card className="mt-auto border-0 bg-body"><Card.Body className="p-2 d-flex align-items-center gap-2"><span className="rounded-circle bg-primary-subtle px-2 py-1">林</span>{!narrow && <span className="small text-truncate">林晓<br /><span className="text-body-secondary">管理员</span></span>}</Card.Body></Card><Button variant="outline-secondary" size="sm" className="mt-2" onClick={() => setNarrow(!narrow)}><Icon name={narrow ? "chevron-right" : "chevron-left"} /> {!narrow && "收起侧栏"}</Button></aside>
    <div className="app-main"><Navbar expand="lg" bg="body" className="border-bottom sticky-top px-3"><Button variant="outline-secondary" className="d-lg-none me-2" onClick={() => setMobileOpen(true)} aria-label="打开菜单"><Icon name="menu" /></Button><Breadcrumb className="mb-0 d-none d-md-flex"><Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Acme Console</Breadcrumb.Item><Breadcrumb.Item active>{current}</Breadcrumb.Item></Breadcrumb><Form.Control className="ms-auto d-none d-md-block" style={{ maxWidth: 240 }} placeholder="搜索..." /><div className="d-flex align-items-center gap-2 ms-auto ms-md-3"><Dropdown align="end"><Dropdown.Toggle variant="outline-secondary" aria-label="通知"><Icon name="bell" /><Badge bg="danger" pill className="ms-1">{unread}</Badge></Dropdown.Toggle><Dropdown.Menu><Dropdown.Header>通知</Dropdown.Header>{notifications.map((item) => <Dropdown.Item key={item.title}><strong className="d-block">{item.title}</strong><small className="text-body-secondary">{item.time}</small></Dropdown.Item>)}</Dropdown.Menu></Dropdown><Button variant="outline-secondary" onClick={toggleTheme} aria-label="切换主题"><Icon name={theme === "dark" ? "sun" : "moon"} /></Button><Dropdown align="end"><Dropdown.Toggle variant="outline-secondary" className="rounded-circle" aria-label="账户菜单">林</Dropdown.Toggle><Dropdown.Menu><Dropdown.Header>林晓</Dropdown.Header><Dropdown.Item as={Link} to="/settings">账户设置</Dropdown.Item><Dropdown.Item>帮助中心</Dropdown.Item><Dropdown.Item>退出登录</Dropdown.Item></Dropdown.Menu></Dropdown></div></Navbar><main><div className="d-lg-none"><Offcanvas show={mobileOpen} onHide={() => setMobileOpen(false)}><Offcanvas.Header closeButton><Offcanvas.Title><Brand /></Offcanvas.Title></Offcanvas.Header><Offcanvas.Body><Navigation onNavigate={() => setMobileOpen(false)} /></Offcanvas.Body></Offcanvas></div>{children}</main></div>
  </div>
}
