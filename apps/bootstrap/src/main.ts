import "./styles.css"
import * as bootstrap from "bootstrap"
import { applyUrlSettings } from "./lib/settings"
import { currentRoute, interceptLinks } from "./lib/router"
import { renderShell, mountShell } from "./shell"
import { renderLogin } from "./pages/login"
import { renderDashboard } from "./pages/dashboard"
import { renderOrders } from "./pages/orders"
import { renderForm } from "./pages/form"
import { renderSettings } from "./pages/settings"
import { renderComponents } from "./pages/components"
import { renderLanding } from "./pages/landing"
import { renderChat } from "./pages/chat"
import type { Page } from "./pages/types"

const root = document.getElementById("root")!
applyUrlSettings()
interceptLinks(root)

const pages: Record<string, { page: Page; shell: boolean }> = {
  "/login": { page: renderLogin, shell: false },
  "/": { page: renderDashboard, shell: true },
  "/orders": { page: renderOrders, shell: true },
  "/form": { page: renderForm, shell: true },
  "/settings": { page: renderSettings, shell: true },
  "/components": { page: renderComponents, shell: true },
  "/landing": { page: renderLanding, shell: false },
  "/chat": { page: renderChat, shell: true },
}

let dispose: (() => void) | undefined

function disposeBootstrap(scope: HTMLElement) {
  scope.querySelectorAll<HTMLElement>('[data-bs-toggle="tooltip"], [data-bs-toggle="popover"]').forEach((el) => {
    bootstrap.Tooltip.getInstance(el)?.dispose()
    bootstrap.Popover.getInstance(el)?.dispose()
  })
  document.querySelectorAll(".modal-backdrop, .offcanvas-backdrop").forEach((el) => el.remove())
  document.body.classList.remove("modal-open")
  document.body.style.removeProperty("overflow")
  document.body.style.removeProperty("padding-right")
}

function render() {
  dispose?.()
  disposeBootstrap(root)
  const route = currentRoute()
  const { page, shell } = pages[route]
  const { html, mount } = page()
  root.innerHTML = shell ? renderShell(route, html) : html
  root.querySelectorAll<HTMLElement>('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el))
  root.querySelectorAll<HTMLElement>('[data-bs-toggle="popover"]').forEach((el) => new bootstrap.Popover(el))
  const pageDispose = mount?.(root)
  const shellDispose = shell ? mountShell(root) : undefined
  dispose = () => {
    pageDispose?.()
    shellDispose?.()
  }
  window.scrollTo(0, 0)
}


window.addEventListener("popstate", render)
render()
