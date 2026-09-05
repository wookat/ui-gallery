import { useRef, useState, type ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { Avatar } from "primereact/avatar"
import { Badge } from "primereact/badge"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { Menu } from "primereact/menu"
import { OverlayPanel } from "primereact/overlaypanel"
import { PanelMenu } from "primereact/panelmenu"
import { Sidebar } from "primereact/sidebar"
import { BreadCrumb } from "primereact/breadcrumb"
import { Icon } from "@/components/icon"

function Brand() { return <Link to="/" className="flex align-items-center gap-2 no-underline font-semibold text-color"><span className="flex align-items-center justify-content-center border-round bg-primary text-primary-contrast" style={{ width: 32, height: 32 }}>A</span><span>Acme Console</span></Link> }
export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation(), navigate = useNavigate()
  const [drawer, setDrawer] = useState(false), [collapsed, setCollapsed] = useState(false)
  const notificationsRef = useRef<OverlayPanel>(null)
  const profileRef = useRef<Menu>(null)
  const themeParam = new URLSearchParams(location.search).get("theme")
  const theme = themeParam ?? (document.documentElement.classList.contains("dark") ? "dark" : "light")
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const themeToggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    const params = new URLSearchParams(window.location.search); params.set("theme", next)
    navigate(`${location.pathname}?${params.toString()}`)
  }
  const model = nav.map((item) => ({ label: item.label, icon: <Icon name={item.icon} />, badge: item.badge, template: () => <Link to={item.path} onClick={() => setDrawer(false)} className={`flex align-items-center gap-2 p-menuitem-link ${location.pathname === item.path ? "surface-200" : ""}`}><Icon name={item.icon} /><span>{item.label}</span>{item.badge ? <Badge value={item.badge} className="ml-auto" /> : null}</Link> }))
  const menu = [{ label: "账户设置", icon: <Icon name="settings" />, command: () => navigate("/settings") }, { label: "帮助中心", icon: <Icon name="circle-help" /> }, { separator: true }, { label: "退出登录", icon: <Icon name="log-out" /> }]
  const side = <div className="h-full flex flex-column p-3"><Brand /><div className="mt-4 flex-1"><p className="text-xs uppercase muted px-2">工作区</p><PanelMenu model={model} className="border-none" /></div><Link to="/settings" className="flex align-items-center gap-2 p-2 no-underline text-color"><Avatar label="林" shape="circle" /><span>林晓</span></Link></div>
  return <div className="flex min-h-screen"><aside className={`hidden md:block flex-shrink-0 surface-section border-right-1 surface-border transition-duration-200 ${collapsed ? "w-5rem" : "w-18rem"}`}>{collapsed ? <div className="p-3 flex flex-column align-items-center gap-4"><Button text icon={<Icon name="menu" />} onClick={() => setCollapsed(false)} /><Link to="/"><Avatar label="A" shape="circle" /></Link><PanelMenu model={model.map((x) => ({ ...x, template: () => <Link to={nav.find((n) => n.label === x.label)?.path ?? "/"} className="flex justify-content-center p-menuitem-link"><Icon name={nav.find((n) => n.label === x.label)?.icon ?? "grid"} /></Link> }))} /></div> : side}</aside><Sidebar visible={drawer} onHide={() => setDrawer(false)} position="left" className="w-18rem">{side}</Sidebar><div className="flex-1 min-w-0"><header className="sticky top-0 z-5 surface-card border-bottom-1 surface-border px-3 md:px-4 py-3 flex align-items-center gap-2"><Button text icon={<Icon name="menu" />} className="md:hidden" onClick={() => setDrawer(true)} /><BreadCrumb model={[{ label: current }]} home={{ template: () => <Link to="/" className="no-underline text-color bg-transparent">Acme Console</Link> }} className="hidden md:flex border-none p-0 bg-transparent" /><div className="ml-auto flex align-items-center gap-2"><span className="p-input-icon-left hidden md:inline-flex"><Icon name="search" /><InputText placeholder="搜索..." className="w-14rem" /></span><Button text rounded icon={<Icon name="bell" />} onClick={(e) => notificationsRef.current?.toggle(e)} badge="2" /><OverlayPanel ref={notificationsRef}><div style={{ width: 260 }}><strong>通知</strong>{notifications.map((item) => <div className="py-2 border-bottom-1 surface-border" key={item.title}><div className="text-sm">{item.title}</div><small className="muted">{item.time}</small></div>)}</div></OverlayPanel><Button text rounded icon={<Icon name={theme === "dark" ? "sun" : "moon"} />} onClick={themeToggle} /><Button text rounded icon={<Avatar label="林" shape="circle" />} onClick={(e) => profileRef.current?.toggle(e)} /><Menu ref={profileRef} popup model={menu} /></div></header><main className="page-main">{children}</main></div></div>
}
