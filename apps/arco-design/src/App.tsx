import type { ReactNode } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ConfigProvider } from "@arco-design/web-react"
import zhCN from "@arco-design/web-react/es/locale/zh-CN"
import { AppShell } from "@/layouts/app-shell"
import { ComponentsPage } from "@/pages/components"
import { DashboardPage } from "@/pages/dashboard"
import { FormPage } from "@/pages/form"
import { LandingPage } from "@/pages/landing"
import { LoginPage } from "@/pages/login"
import { ChatPage } from "@/pages/chat"
import { OrdersPage } from "@/pages/orders"
import { SettingsPage } from "@/pages/settings"
import { ThemeContext, useTheme } from "@/theme"

const shell = (element: ReactNode) => <AppShell>{element}</AppShell>
const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: shell(<DashboardPage />) },
  { path: "/orders", element: shell(<OrdersPage />) },
  { path: "/form", element: shell(<FormPage />) },
  { path: "/settings", element: shell(<SettingsPage />) },
  { path: "/components", element: shell(<ComponentsPage />) },
  { path: "/landing", element: <LandingPage /> },
  { path: "/chat", element: shell(<ChatPage />) },
], { basename: "/apps/arco-design" })

export default function App() {
  const themeState = useTheme()
  return (
    <ThemeContext.Provider value={themeState}>
      <ConfigProvider locale={zhCN}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}
