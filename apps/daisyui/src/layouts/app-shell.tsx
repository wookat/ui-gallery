import { useState, type ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { Icon } from "@ui-gallery/icons-react"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { useTheme } from "@/App"
import { Avatar, IconButton } from "@/pages/shared"

function Brand() {
  return <Link to="/" className="flex min-w-0 items-center gap-2 font-semibold"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-content">A</span><span className="truncate">Acme Console</span></Link>
}

function Navigation({ close }: { close?: () => void }) {
  const location = useLocation()
  return (
    <ul className="menu w-full gap-1 p-2">
      <li className="menu-title">工作区</li>
      {nav.map((item) => (
        <li key={item.key}>
          <Link className={location.pathname === item.path ? "menu-active" : ""} to={item.path} onClick={close}>
            <Icon name={item.icon} size={16} /><span>{item.label}</span>{item.badge ? <span className="badge badge-sm ml-auto">{item.badge}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function NotificationMenu() {
  const unread = notifications.filter((item) => item.unread).length
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="indicator btn btn-ghost btn-square" aria-label="通知">
        {unread ? <span className="badge badge-error badge-xs indicator-item">{unread}</span> : null}<Icon name="bell" size={17} />
      </div>
      <div tabIndex={0} className="dropdown-content card z-20 mt-3 w-80 max-w-[calc(100vw-2rem)] border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body p-3"><h3 className="font-semibold">通知</h3>{notifications.map((item) => <div className="flex gap-2 border-t border-base-300 py-3 text-sm" key={item.title}><span className={`mt-1 size-2 shrink-0 rounded-full ${item.unread ? "bg-primary" : "bg-base-300"}`} /><div className="min-w-0"><p>{item.title}</p><p className="text-xs text-base-content/60">{item.time}</p></div></div>)}</div>
      </div>
    </div>
  )
}

function UserMenu() {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle"><Avatar name="林晓" /></div>
      <ul tabIndex={0} className="dropdown-content menu z-20 mt-3 w-52 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl">
        <li className="menu-title">林晓</li><li><Link to="/settings"><Icon name="user" size={16} />个人资料</Link></li><li><Link to="/settings"><Icon name="settings" size={16} />账户设置</Link></li><li><a><Icon name="circle-help" size={16} />帮助中心</a></li><li><a><Icon name="globe" size={16} />切换工作区</a></li><li><a><Icon name="log-out" size={16} />退出登录</a></li>
      </ul>
    </div>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [drawer, setDrawer] = useState(false)
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")
  return (
    <div className="drawer lg:drawer-open">
      <input id="app-drawer" type="checkbox" className="drawer-toggle" checked={drawer} onChange={(event) => setDrawer(event.target.checked)} />
      <div className="drawer-content min-w-0 bg-base-200/40">
        <header className="navbar sticky top-0 z-10 border-b border-base-300 bg-base-100/95 px-4 backdrop-blur sm:px-6">
          <div className="flex-none lg:hidden"><label htmlFor="app-drawer" className="btn btn-ghost btn-square" aria-label="打开菜单"><Icon name="menu" /></label></div>
          <div className="breadcrumbs hidden text-sm sm:flex"><ul><li><Link to="/">Acme Console</Link></li><li>{current}</li></ul></div>
          <div className="ml-auto flex items-center gap-1">
            <label className="input input-sm hidden w-52 items-center gap-2 md:flex"><Icon name="search" size={15} /><input placeholder="搜索..." /></label>
            <NotificationMenu />
            <button className="swap swap-rotate btn btn-ghost btn-square" aria-label="切换主题" onClick={toggleTheme}><input type="checkbox" checked={theme === "dark"} readOnly /><Icon name="sun" className="swap-off" size={17} /><Icon name="moon" className="swap-on" size={17} /></button>
            <UserMenu />
          </div>
        </header>
        <main className="mx-auto min-w-0 max-w-[1600px] space-y-6 p-4 sm:p-6">{children}</main>
      </div>
      <div className="drawer-side z-20">
        <label htmlFor="app-drawer" aria-label="关闭菜单" className="drawer-overlay" />
        <aside className="flex min-h-full w-72 flex-col border-r border-base-300 bg-base-100">
          <div className="flex h-16 items-center justify-between border-b border-base-300 px-4"><Brand /><label htmlFor="app-drawer" className="btn btn-ghost btn-sm btn-square lg:hidden"><Icon name="x" size={16} /></label></div>
          <div className="flex-1"><Navigation close={() => setDrawer(false)} /></div>
          <div className="border-t border-base-300 p-3"><Link to="/settings" className="flex items-center gap-3 rounded-box p-2 hover:bg-base-200"><Avatar name="林晓" /><span className="min-w-0"><strong className="block text-sm">林晓</strong><small className="block truncate text-base-content/60">admin@acme.dev</small></span><IconButton name="chevron-down" label="用户菜单" /></Link></div>
        </aside>
      </div>
    </div>
  )
}
