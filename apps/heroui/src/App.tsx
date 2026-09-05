import { useEffect, type ReactNode } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Toast } from "@heroui/react"
import { AppShell } from "@/layouts/app-shell"
import { ComponentsPage } from "@/pages/components"
import { DashboardPage } from "@/pages/dashboard"
import { FormPage } from "@/pages/form"
import { LandingPage } from "@/pages/landing"
import { LoginPage } from "@/pages/login"
import { ChatPage } from "@/pages/chat"
import { OrdersPage } from "@/pages/orders"
import { SettingsPage } from "@/pages/settings"

const fonts: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

function useUrlSettings() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const explicit = params.get("theme")
    const dark = explicit === "dark" || (!explicit && window.matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.classList.toggle("dark", dark)
    document.documentElement.classList.toggle("light", !dark)
    document.documentElement.style.setProperty("--font-sans", fonts[params.get("font") ?? ""] ?? fonts.geist)
  }, [])
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
], { basename: "/apps/heroui" })

export default function App() {
  useUrlSettings()
  return (
    <>
      <RouterProvider router={router} />
      <Toast.Provider />
    </>
  )
}
