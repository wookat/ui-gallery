import { useEffect, useState, type ReactNode } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ConfigProvider } from "@douyinfe/semi-ui"
import zh_CN from "@douyinfe/semi-ui/lib/es/locale/source/zh_CN"
import { AppShell } from "@/layouts/app-shell"
import { ThemeContext, applyTheme, initialTheme, type ThemeMode } from "@/theme"
import { ChatPage } from "@/pages/chat"
import { ComponentsPage } from "@/pages/components"
import { DashboardPage } from "@/pages/dashboard"
import { FormPage } from "@/pages/form"
import { LandingPage } from "@/pages/landing"
import { LoginPage } from "@/pages/login"
import { OrdersPage } from "@/pages/orders"
import { SettingsPage } from "@/pages/settings"

const fonts: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

function useUrlFont() {
  useEffect(() => {
    const font = new URLSearchParams(window.location.search).get("font")
    if (font && fonts[font]) {
      document.documentElement.dataset.font = font
      document.documentElement.style.setProperty("--acme-font", fonts[font])
    } else {
      delete document.documentElement.dataset.font
      document.documentElement.style.removeProperty("--acme-font")
    }
  }, [])
}

const initialUrl = new URL(window.location.href)
if (initialUrl.searchParams.has("icon") && !initialUrl.searchParams.has("icons")) {
  initialUrl.searchParams.set("icons", initialUrl.searchParams.get("icon") ?? "")
  initialUrl.searchParams.delete("icon")
  window.history.replaceState(null, "", initialUrl)
}

const shell = (element: ReactNode) => <AppShell>{element}</AppShell>
const router = createBrowserRouter(
  [
    { path: "/login", element: <LoginPage /> },
    { path: "/", element: shell(<DashboardPage />) },
    { path: "/orders", element: shell(<OrdersPage />) },
    { path: "/form", element: shell(<FormPage />) },
    { path: "/settings", element: shell(<SettingsPage />) },
    { path: "/components", element: shell(<ComponentsPage />) },
    { path: "/landing", element: <LandingPage /> },
    { path: "/chat", element: shell(<ChatPage />) },
  ],
  { basename: "/apps/semi-design" },
)

export default function App() {
  const [theme, setThemeState] = useState<ThemeMode>(initialTheme)
  useUrlFont()
  useEffect(() => applyTheme(theme), [theme])
  const setTheme = (next: ThemeMode) => {
    setThemeState(next)
    const url = new URL(window.location.href)
    url.searchParams.set("theme", next)
    window.history.replaceState(null, "", url)
  }
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ConfigProvider locale={zh_CN}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}
