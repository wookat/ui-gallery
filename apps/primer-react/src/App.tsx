import { useEffect, useState, type ReactNode } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { BaseStyles, ThemeProvider } from "@primer/react"
import { ColorModeContext, type ColorMode } from "@/lib/color-mode"
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

function initialMode(): ColorMode {
  const explicit = new URLSearchParams(window.location.search).get("theme")
  if (explicit === "dark" || explicit === "light") return explicit
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
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
  { basename: "/apps/primer-react" },
)

export default function App() {
  const [mode, setMode] = useState<ColorMode>(initialMode)
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-color-mode", mode)
    root.setAttribute("data-light-theme", "light")
    root.setAttribute("data-dark-theme", "dark")
    root.style.colorScheme = mode
    const font = fonts[new URLSearchParams(window.location.search).get("font") ?? ""]
    if (font) root.style.setProperty("--BaseStyles-fontFamily", font)
    else root.style.removeProperty("--BaseStyles-fontFamily")
  }, [mode])
  return (
    <ColorModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider colorMode={mode} dayScheme="light" nightScheme="dark">
        <BaseStyles className="app-root">
          <RouterProvider router={router} />
        </BaseStyles>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
