import { useEffect, useState, type ReactNode } from "react"
import { App as AntApp, ConfigProvider, theme } from "antd"
import zhCN from "antd/locale/zh_CN"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AppShell } from "@/layouts/app-shell"
import { ThemeSettingsContext } from "@/pages/shared"
import { LoginPage } from "@/pages/login"
import { DashboardPage } from "@/pages/dashboard"
import { OrdersPage } from "@/pages/orders"
import { FormPage } from "@/pages/form"
import { SettingsPage } from "@/pages/settings"
import { ComponentsPage } from "@/pages/components"
import { LandingPage } from "@/pages/landing"
import { ChatPage } from "@/pages/chat"

function useUrlSettings() {
  const read = () => {
    const params = new URLSearchParams(window.location.search)
    return (
      params.get("theme") === "dark" ||
      (!params.get("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    )
  }
  const [dark, setDark] = useState(read)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fonts: Record<string, string> = {
      inter: "'Inter Variable', sans-serif",
      geist: "'Geist Variable', sans-serif",
      "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
      "lxgw-wenkai": "'LXGW WenKai Screen', serif",
    }
    const defaultFont = theme.getDesignToken().fontFamily
    document.documentElement.style.setProperty(
      "--font-sans",
      fonts[params.get("font") ?? ""] ?? defaultFont
    )
    document.documentElement.style.colorScheme = dark ? "dark" : "light"
  }, [dark])
  useEffect(() => {
    const sync = () => setDark(read())
    window.addEventListener("themechange", sync)
    return () => window.removeEventListener("themechange", sync)
  }, [])
  return { dark, setDark }
}

function BodyBackground() {
  const { token } = theme.useToken()
  useEffect(() => {
    document.body.style.background = token.colorBgLayout
    return () => {
      document.body.style.background = ""
    }
  }, [token.colorBgLayout])
  return null
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
  { basename: "/apps/antd" }
)

export default function App() {
  const { dark, setDark } = useUrlSettings()
  return (
    <ThemeSettingsContext.Provider value={{ dark, setDark }}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: { fontFamily: "var(--font-sans)" },
          cssVar: true as never,
        }}
      >
        <BodyBackground />
        <AntApp>
          <RouterProvider router={router} />
        </AntApp>
      </ConfigProvider>
    </ThemeSettingsContext.Provider>
  )
}
