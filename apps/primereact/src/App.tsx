import { useEffect, type ReactNode } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AppShell } from "@/layouts/app-shell"
import { ComponentsPage } from "@/pages/components"
import { DashboardPage } from "@/pages/dashboard"
import { FormPage } from "@/pages/form"
import { LandingPage } from "@/pages/landing"
import { LoginPage } from "@/pages/login"
import { ChatPage } from "@/pages/chat"
import { OrdersPage } from "@/pages/orders"
import { SettingsPage } from "@/pages/settings"

export const lightTheme = new URL("primereact/resources/themes/lara-light-blue/theme.css?url", import.meta.url).href
export const darkTheme = new URL("primereact/resources/themes/lara-dark-blue/theme.css?url", import.meta.url).href
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
function useSettings() { useEffect(() => { applySettings() }, []) }
const shell = (element: ReactNode) => <AppShell>{element}</AppShell>
const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> }, { path: "/", element: shell(<DashboardPage />) }, { path: "/orders", element: shell(<OrdersPage />) },
  { path: "/form", element: shell(<FormPage />) }, { path: "/settings", element: shell(<SettingsPage />) }, { path: "/components", element: shell(<ComponentsPage />) },
  { path: "/landing", element: <LandingPage /> }, { path: "/chat", element: shell(<ChatPage />) },
], { basename: "/apps/primereact" })
export default function App() {
  useSettings()
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return <RouterProvider router={router} />
}
