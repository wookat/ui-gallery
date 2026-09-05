import { useEffect, useMemo, useState, type ReactNode } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { CustomProvider } from "rsuite"
import { AppShell } from "@/layouts/app-shell"
import { ThemeContext } from "@/components/theme-context"
import { ChatPage } from "@/pages/chat"
import { ComponentsPage } from "@/pages/components"
import { DashboardPage } from "@/pages/dashboard"
import { FormPage } from "@/pages/form"
import { LandingPage } from "@/pages/landing"
import { LoginPage } from "@/pages/login"
import { OrdersPage } from "@/pages/orders"
import { SettingsPage } from "@/pages/settings"

function useUrlSettings() {
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    const explicit = params.get("theme")
    return explicit === "dark" || (!explicit && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"
  })
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.classList.toggle("light", theme === "light")
    const fonts: Record<string, string> = { inter: "'Inter Variable', sans-serif", geist: "'Geist Variable', sans-serif", "noto-sans-sc": "'Noto Sans SC Variable', sans-serif", "lxgw-wenkai": "'LXGW WenKai Screen', serif" }
    const font = fonts[params.get("font") ?? ""]
    if (font) document.documentElement.style.setProperty("--rs-font-family-base", font)
  }, [params, theme])
  return { theme, icons: params.get("icon") ?? params.get("icons"), setTheme: setThemeState }
}

const shell = (element: ReactNode) => <AppShell>{element}</AppShell>
const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> }, { path: "/", element: shell(<DashboardPage />) },
  { path: "/orders", element: shell(<OrdersPage />) }, { path: "/form", element: shell(<FormPage />) },
  { path: "/settings", element: shell(<SettingsPage />) }, { path: "/components", element: shell(<ComponentsPage />) },
  { path: "/landing", element: <LandingPage /> }, { path: "/chat", element: shell(<ChatPage />) },
], { basename: "/apps/rsuite" })

export default function App() {
  const settings = useUrlSettings()
  return <ThemeContext.Provider value={settings}><CustomProvider theme={settings.theme}><RouterProvider router={router} /></CustomProvider></ThemeContext.Provider>
}
