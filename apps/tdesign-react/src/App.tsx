import { useEffect, type ReactNode } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ConfigProvider } from "tdesign-react"
import zhCN from "tdesign-react/es/locale/zh_CN"
import { AppShell } from "@/layouts/app-shell"
import { ChatPage } from "@/pages/chat"
import { ComponentsPage } from "@/pages/components"
import { DashboardPage } from "@/pages/dashboard"
import { FormPage } from "@/pages/form"
import { LandingPage } from "@/pages/landing"
import { LoginPage } from "@/pages/login"
import { OrdersPage } from "@/pages/orders"
import { SettingsPage } from "@/pages/settings"
import { applyFont, applyTheme, readTheme } from "@/url-settings"

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
  { basename: "/apps/tdesign-react" }
)

export default function App() {
  useEffect(() => {
    applyTheme(readTheme())
    applyFont()
  }, [])
  return (
    <ConfigProvider globalConfig={zhCN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}
