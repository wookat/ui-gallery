import { mountShell, shell } from "./shell"
import * as dashboard from "./pages/dashboard"
import * as form from "./pages/form"
import * as login from "./pages/login"
import * as orders from "./pages/orders"
import * as settings from "./pages/settings"
import * as components from "./pages/components"
import * as landing from "./pages/landing"
import * as chat from "./pages/chat"

type Page = { render: () => string; mount: (root: HTMLElement) => void }
const pages: Record<string, Page> = { "/login": login, "/": dashboard, "/orders": orders, "/form": form, "/settings": settings, "/components": components, "/landing": landing, "/chat": chat }

function currentPath(): string {
  const base = "/apps/pico-css"
  const path = window.location.pathname.startsWith(base) ? window.location.pathname.slice(base.length) : window.location.pathname
  return path || "/"
}

export function startRouter(): void {
  const root = document.querySelector<HTMLElement>("#root")
  if (!root) return
  const renderRoute = () => {
    const path = currentPath()
    const page = pages[path]
    if (page) {
      root.innerHTML = path === "/login" || path === "/landing" ? page.render() : shell(page.render())
      if (path !== "/login" && path !== "/landing") mountShell(root)
      page.mount(root)
    } else {
      root.innerHTML = shell(`<div class="page-heading"><div><h1>页面</h1><p>Acme Console</p></div></div><article><p>页面内容正在准备中。</p></article>`)
      mountShell(root)
    }
    root.querySelectorAll<HTMLAnchorElement>("a[data-link]").forEach((link) => link.addEventListener("click", (event) => {
      event.preventDefault()
      const url = new URL(link.href)
      const params = new URLSearchParams(window.location.search)
      history.pushState({}, "", `${url.pathname}${params.toString() ? `?${params}` : ""}`)
      renderRoute()
    }))
  }
  window.addEventListener("popstate", renderRoute)
  renderRoute()
}
