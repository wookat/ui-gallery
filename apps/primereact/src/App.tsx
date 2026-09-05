import { useEffect, type ReactNode } from "react"
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom"
import { AppShell } from "@/layouts/app-shell"
import { ComponentsPage } from "@/pages/components"
import { DashboardPage } from "@/pages/dashboard"
import { FormPage } from "@/pages/form"
import { LandingPage } from "@/pages/landing"
import { LoginPage } from "@/pages/login"
import { ChatPage } from "@/pages/chat"
import { OrdersPage } from "@/pages/orders"
import { SettingsPage } from "@/pages/settings"

import lightTheme from "primereact/resources/themes/lara-light-blue/theme.css?url"
import darkTheme from "primereact/resources/themes/lara-dark-blue/theme.css?url"

export { lightTheme, darkTheme }
export function applySettings() {
  const params = new URLSearchParams(window.location.search)
  const explicit = params.get("theme")
  const dark = explicit === "dark" || (!explicit && window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", dark); document.documentElement.classList.toggle("light", !dark)
  document.documentElement.style.colorScheme = dark ? "dark" : "light"
  let link = document.getElementById("pr-theme") as HTMLLinkElement | null
  if (!link) { link = document.createElement("link"); link.id = "pr-theme"; link.rel = "stylesheet"; document.head.appendChild(link) }
  link.href = dark ? darkTheme : lightTheme
  const fonts: Record<string, string> = { inter: "'Inter Variable', sans-serif", geist: "'Geist Variable', sans-serif", "noto-sans-sc": "'Noto Sans SC Variable', sans-serif", "lxgw-wenkai": "'LXGW WenKai Screen', serif" }
  const font = fonts[params.get("font") ?? ""]
  if (font) document.documentElement.style.setProperty("--font-family", font)
}
function SettingsSync({ children }: { children: ReactNode }) {
  const { search } = useLocation()
  useEffect(() => { applySettings() }, [search])
  return children
}
const withSettings = (element: ReactNode) => <SettingsSync>{element}</SettingsSync>
const shell = (element: ReactNode) => <AppShell>{element}</AppShell>
const router = createBrowserRouter([
  { path: "/login", element: withSettings(<LoginPage />) }, { path: "/", element: withSettings(shell(<DashboardPage />)) }, { path: "/orders", element: withSettings(shell(<OrdersPage />)) },
  { path: "/form", element: withSettings(shell(<FormPage />)) }, { path: "/settings", element: withSettings(shell(<SettingsPage />)) }, { path: "/components", element: withSettings(shell(<ComponentsPage />)) },
  { path: "/landing", element: withSettings(<LandingPage />) }, { path: "/chat", element: withSettings(shell(<ChatPage />)) },
], { basename: "/apps/primereact" })
export default function App() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return <RouterProvider router={router} />
}
