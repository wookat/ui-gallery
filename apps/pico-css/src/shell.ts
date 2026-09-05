import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import team from "@ui-gallery/spec/mock/team.json"
import { icon } from "./icons"

const user = team[0]

export function shell(page: string): string {
  const path = window.location.pathname.replace("/apps/pico-css", "") || "/"
  const links = nav.map((item) => `<a data-link href="${item.path}" aria-current="${item.path === path ? "page" : "false"}">${icon(item.icon)}<span class="nav-label">${item.label}</span>${item.badge ? `<small><mark>${item.badge}</mark></small>` : ""}</a>`).join("")
  const notices = notifications.map((notice) => `<li><strong>${notice.title}</strong><small>${notice.time}</small></li>`).join("")
  return `<div class="app-layout">
    <aside class="sidebar" id="sidebar">
      <a class="brand" data-link href="/"><span class="brand-mark">A</span><span class="brand-label">Acme Console</span></a>
      <section class="nav-section"><small>工作区</small><nav class="nav-list" aria-label="主导航">${links}</nav></section>
      <button class="outline contrast" id="collapse-sidebar" type="button">${icon("panel-left")}<span class="nav-label">折叠侧栏</span></button>
      <footer class="sidebar-footer"><a class="user-card" data-link href="/settings"><span class="avatar">${user.name.slice(0, 1)}</span><span class="user-info"><strong>${user.name}</strong><small>${user.email}</small></span></a></footer>
    </aside>
    <div class="drawer-backdrop" id="drawer-backdrop"></div>
    <section class="content-area">
      <header class="topbar"><div class="topbar-inner">
        <button class="outline mobile-menu" id="mobile-menu" type="button" aria-label="打开导航">${icon("menu")}</button>
        <nav class="breadcrumb" aria-label="breadcrumb"><a class="breadcrumb-home" data-link href="/">Acme Console</a><span aria-hidden="true">/</span><span>${nav.find((item) => item.path === path)?.label ?? "仪表盘"}</span></nav>
        <form role="search"><input type="search" placeholder="搜索..." aria-label="搜索" /></form>
        <details class="dropdown compact-dropdown"><summary aria-label="通知">${icon("bell")}<mark>2</mark></summary><ul>${notices}</ul></details>
        <button class="outline" id="theme-toggle" type="button" aria-label="切换主题">${icon(document.documentElement.dataset.theme === "dark" ? "sun" : "moon")}</button>
        <details class="dropdown compact-dropdown avatar-dropdown"><summary aria-label="用户菜单"><span class="avatar">${user.name.slice(0, 1)}</span></summary><ul><li><a data-link href="/settings">个人资料</a></li><li><a data-link href="/settings">设置</a></li><li><a data-link href="/settings">团队</a></li><li><a data-link href="/components">帮助</a></li><li><a data-link href="/login">退出登录</a></li></ul></details>
      </div></header>
      <main class="page-content">${page}</main>
    </section>
  </div>`
}

export function mountShell(root: HTMLElement): void {
  const sidebar = root.querySelector<HTMLElement>("#sidebar")
  const backdrop = root.querySelector<HTMLElement>("#drawer-backdrop")
  root.querySelector("#collapse-sidebar")?.addEventListener("click", () => sidebar?.classList.toggle("collapsed"))
  const close = () => { sidebar?.classList.remove("open"); backdrop?.classList.remove("open") }
  root.querySelector("#mobile-menu")?.addEventListener("click", () => { sidebar?.classList.add("open"); backdrop?.classList.add("open") })
  backdrop?.addEventListener("click", close)
  root.querySelectorAll(".nav-list a").forEach((link) => link.addEventListener("click", close))
  root.querySelector("#theme-toggle")?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = next
    const params = new URLSearchParams(window.location.search)
    params.set("theme", next)
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`)
    window.dispatchEvent(new Event("themechange"))
    const button = root.querySelector("#theme-toggle")
    if (button) button.innerHTML = icon(next === "dark" ? "sun" : "moon")
  })
}
