import * as bootstrap from "bootstrap"
import { icon, isIconName } from "./lib/icons"
import { avatar, each, esc } from "./lib/html"
import { nav, notifications } from "./lib/data"
import { href, type Route } from "./lib/router"
import { isDark, setTheme } from "./lib/settings"

const GROUPS: { label: string; keys: string[] }[] = [
  { label: "总览", keys: ["dashboard", "orders", "form", "chat"] },
  { label: "资源", keys: ["components", "landing"] },
  { label: "系统", keys: ["settings", "login"] },
]

const TITLES: Record<Route, string> = { "/": "仪表盘", "/orders": "订单", "/form": "新建项目", "/settings": "设置", "/components": "组件全集", "/chat": "AI 助手", "/login": "登录", "/landing": "落地页" }

function navItem(item: (typeof nav)[number], route: Route) {
  const active = item.path === route
  const ic = isIconName(item.icon) ? item.icon : "grid"
  return `<li class="nav-item">
    <a class="nav-link d-flex align-items-center gap-2 ${active ? "active" : "link-body-emphasis"}" href="${href(item.path)}" data-link="${item.path}" ${active ? 'aria-current="page"' : ""} title="${esc(item.label)}">
      ${icon(ic, "fs-5")}<span class="sidebar-label flex-grow-1">${esc(item.label)}</span>
      ${item.badge ? `<span class="sidebar-badge badge rounded-pill text-bg-primary">${item.badge}</span>` : ""}
    </a></li>`
}

function sidebarBody(route: Route, id: string) {
  return `<div class="d-flex flex-column h-100">
    <div class="d-flex align-items-center gap-2 px-3 py-3 border-bottom">
      <span class="d-inline-flex align-items-center justify-content-center rounded bg-primary text-white" style="width:32px;height:32px">${icon("boxes")}</span>
      <span class="sidebar-label fw-semibold fs-5 flex-grow-1">Acme Console</span>
      <button type="button" class="btn btn-sm btn-outline-secondary d-none d-lg-inline-flex" data-action="collapse-sidebar" aria-label="折叠侧边栏">${icon("chevron-left")}</button>
    </div>
    <nav class="flex-grow-1 overflow-auto px-2 py-2" aria-label="主导航">
      ${each(GROUPS, (g) => `<div class="sidebar-group text-uppercase text-body-secondary small fw-semibold px-3 pt-3 pb-1">${g.label}</div>
        <ul class="nav nav-pills flex-column gap-1">${each(nav.filter((n) => g.keys.includes(n.key)), (n) => navItem(n, route))}</ul>`)}
    </nav>
    <div class="border-top p-3">
      <div class="dropdown dropup">
        <button class="btn btn-link text-decoration-none link-body-emphasis d-flex align-items-center gap-2 w-100 p-0 text-start" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="${id}-user">
          ${avatar("林晓", 36)}
          <span class="sidebar-user-text min-w-0"><span class="d-block fw-semibold text-truncate">林晓</span><span class="d-block small text-body-secondary text-truncate">m0@acme.dev</span></span>
        </button>
        <ul class="dropdown-menu shadow-sm" aria-labelledby="${id}-user">
          <li><a class="dropdown-item" href="${href("/settings")}" data-link="/settings">${icon("user")} 个人资料</a></li>
          <li><a class="dropdown-item" href="${href("/login")}" data-link="/login">${icon("log-out")} 退出登录</a></li>
        </ul>
      </div>
    </div>
  </div>`
}

export function renderShell(route: Route, content: string): string {
  const unread = notifications.filter((n) => n.unread).length
  return `<div class="app-shell">
  <aside class="app-sidebar d-none d-lg-block border-end bg-body-tertiary position-sticky top-0 vh-100">${sidebarBody(route, "side")}</aside>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileSidebar" aria-label="导航抽屉" style="width:280px">
    <div class="offcanvas-body p-0 bg-body-tertiary">${sidebarBody(route, "drawer")}
    </div>
    <button type="button" class="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="offcanvas" aria-label="关闭"></button>
  </div>
  <div class="app-main d-flex flex-column">
    <header class="navbar navbar-expand bg-body border-bottom sticky-top px-3 py-2" style="z-index:1020">
      <div class="container-fluid p-0 gap-2 flex-nowrap">
        <button class="btn btn-outline-secondary d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar" aria-controls="mobileSidebar" aria-label="打开菜单">${icon("menu")}</button>
        <nav aria-label="breadcrumb" class="d-none d-md-block me-auto">
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item"><a href="${href("/")}" data-link="/" class="text-decoration-none">Acme Console</a></li>
            <li class="breadcrumb-item active" aria-current="page">${TITLES[route]}</li>
          </ol>
        </nav>
        <form class="d-none d-md-flex ms-auto" role="search" style="width:260px" onsubmit="return false">
          <div class="input-group input-group-sm">
            <span class="input-group-text">${icon("search")}</span>
            <input class="form-control" type="search" placeholder="搜索订单、客户、文档…" aria-label="全局搜索">
            <span class="input-group-text d-none d-xl-inline"><kbd>⌘K</kbd></span>
          </div>
        </form>
        <div class="d-flex align-items-center gap-1 ms-md-2 ms-auto">
          <button type="button" class="btn btn-outline-secondary position-relative" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-html="true" data-bs-title="通知" data-bs-custom-class="notify-popover"
            data-bs-content="${esc(`<ul class="list-group list-group-flush" style="min-width:260px">${each(notifications, (n) => `<li class="list-group-item px-0 d-flex gap-2 align-items-start"><span class="mt-2 rounded-circle flex-shrink-0 ${n.unread ? "bg-primary" : "bg-secondary-subtle"}" style="width:8px;height:8px"></span><span><span class="d-block ${n.unread ? "fw-semibold" : ""}">${esc(n.title)}</span><small class="text-body-secondary">${esc(n.time)}</small></span></li>`)}</ul>`)}" aria-label="通知">
            ${icon("bell")}
            ${unread ? `<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">${unread}<span class="visually-hidden">条未读通知</span></span>` : ""}
          </button>
          <button type="button" class="btn btn-outline-secondary" data-action="toggle-theme" aria-label="切换主题">${isDark() ? icon("sun") : icon("moon")}</button>
          <div class="dropdown">
            <button class="btn p-0 border-0 rounded-circle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="账户菜单">${avatar("林晓", 36)}</button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm">
              <li><h6 class="dropdown-header">林晓 · m0@acme.dev</h6></li>
              <li><a class="dropdown-item" href="${href("/settings")}" data-link="/settings">${icon("user")} 个人资料</a></li>
              <li><a class="dropdown-item" href="${href("/settings")}" data-link="/settings">${icon("credit-card")} 计费</a></li>
              <li><a class="dropdown-item" href="${href("/settings")}" data-link="/settings">${icon("settings")} 设置</a></li>
              <li><a class="dropdown-item" href="${href("/chat")}" data-link="/chat">${icon("circle-help")} 帮助中心</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="${href("/login")}" data-link="/login">${icon("log-out")} 退出登录</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
    <main class="flex-grow-1 p-3 p-lg-4">${content}</main>
  </div>
</div>`
}

export function mountShell(root: HTMLElement) {
  const shell = root.querySelector<HTMLElement>(".app-shell")!
  const onClick = (event: Event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]")
    if (!target) return
    if (target.dataset.action === "collapse-sidebar") {
      shell.classList.toggle("is-collapsed")
      target.innerHTML = shell.classList.contains("is-collapsed") ? icon("chevron-right") : icon("chevron-left")
    }
    if (target.dataset.action === "toggle-theme") {
      setTheme(isDark() ? "light" : "dark")
      target.innerHTML = isDark() ? icon("sun") : icon("moon")
    }
  }
  root.addEventListener("click", onClick)
  const offcanvas = root.querySelector<HTMLElement>("#mobileSidebar")
  const onNav = () => offcanvas && bootstrap.Offcanvas.getInstance(offcanvas)?.hide()
  offcanvas?.addEventListener("click", (e) => { if ((e.target as HTMLElement).closest("a[data-link]")) onNav() })
  return () => {
    root.removeEventListener("click", onClick)
    if (offcanvas) bootstrap.Offcanvas.getInstance(offcanvas)?.dispose()
  }
}
