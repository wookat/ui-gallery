import { lazy, Suspense, useEffect, type ReactNode } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Spinner, Toast } from "@heroui/react"
import { AppShell } from "@/layouts/app-shell"

const ComponentsPage = lazy(() => import("@/pages/components").then((m) => ({ default: m.ComponentsPage })))
const DashboardPage = lazy(() => import("@/pages/dashboard").then((m) => ({ default: m.DashboardPage })))
const FormPage = lazy(() => import("@/pages/form").then((m) => ({ default: m.FormPage })))
const LandingPage = lazy(() => import("@/pages/landing").then((m) => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import("@/pages/login").then((m) => ({ default: m.LoginPage })))
const ChatPage = lazy(() => import("@/pages/chat").then((m) => ({ default: m.ChatPage })))
const OrdersPage = lazy(() => import("@/pages/orders").then((m) => ({ default: m.OrdersPage })))
const SettingsPage = lazy(() => import("@/pages/settings").then((m) => ({ default: m.SettingsPage })))

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

const fallback = <div className="grid min-h-[50vh] place-items-center"><Spinner aria-label="页面加载中" /></div>
const page = (element: ReactNode) => <Suspense fallback={fallback}>{element}</Suspense>
const shell = (element: ReactNode) => <AppShell>{page(element)}</AppShell>
const router = createBrowserRouter([
  { path: "/login", element: page(<LoginPage />) },
  { path: "/", element: shell(<DashboardPage />) },
  { path: "/orders", element: shell(<OrdersPage />) },
  { path: "/form", element: shell(<FormPage />) },
  { path: "/settings", element: shell(<SettingsPage />) },
  { path: "/components", element: shell(<ComponentsPage />) },
  { path: "/landing", element: page(<LandingPage />) },
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
