import { useEffect, type ReactNode } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { useTheme } from "next-themes"
import { AppShell } from "@/layouts/app-shell"
import { ChatPage } from "@/pages/chat"
import { ComponentsPage } from "@/pages/components"
import { DashboardPage } from "@/pages/dashboard"
import { FormPage } from "@/pages/form"
import { LandingPage } from "@/pages/landing"
import { LoginPage } from "@/pages/login"
import { OrdersPage } from "@/pages/orders"
import { SettingsPage } from "@/pages/settings"

const FONTS = ["inter", "geist", "noto-sans-sc", "lxgw-wenkai"]

function useUrlSettings() {
  const { setTheme } = useTheme()
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const theme = params.get("theme")
    if (theme === "dark" || theme === "light") setTheme(theme)
    const font = params.get("font") ?? ""
    if (FONTS.includes(font)) document.documentElement.dataset.font = font
    else delete document.documentElement.dataset.font
  }, [setTheme])
}

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
], { basename: "/apps/chakra-ui" })

export default function App() {
  useUrlSettings()
  return <RouterProvider router={router} />
}
