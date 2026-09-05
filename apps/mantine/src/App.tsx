import { useEffect, useMemo, useState, type ReactNode } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { DEFAULT_THEME, MantineProvider, createTheme, type MantineColorScheme } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"
import { DatesProvider } from "@mantine/dates"
import { AppShell } from "@/layouts/app-shell"
import { ThemeContext } from "@/theme"
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

// 官方默认主题；仅将字体族接到 CSS 变量以支持 ?font= 切换（默认值即 Mantine 默认字体栈）
const theme = createTheme({
  fontFamily: `var(--ug-font, ${DEFAULT_THEME.fontFamily})`,
  headings: { fontFamily: `var(--ug-font, ${DEFAULT_THEME.fontFamily})` },
  components: {
    CodeHighlightControl: { defaultProps: { size: 40 } },
  },
})

function readScheme(): MantineColorScheme {
  const value = new URLSearchParams(window.location.search).get("theme")
  return value === "dark" || value === "light" ? value : "auto"
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
  { basename: "/apps/mantine" },
)

export default function App() {
  const [scheme, setScheme] = useState<MantineColorScheme>(readScheme)
  useEffect(() => {
    const font = new URLSearchParams(window.location.search).get("font") ?? "default"
    document.documentElement.style.setProperty("--ug-font", fonts[font] ?? DEFAULT_THEME.fontFamily!)
  }, [])
  const ctx = useMemo(() => ({ scheme, setScheme }), [scheme])
  return (
    <ThemeContext.Provider value={ctx}>
      <MantineProvider theme={theme} defaultColorScheme="auto" forceColorScheme={scheme === "auto" ? undefined : scheme}>
        <DatesProvider settings={{ locale: "zh-cn" }}>
          <ModalsProvider>
            <Notifications position="top-right" />
            <RouterProvider router={router} />
          </ModalsProvider>
        </DatesProvider>
      </MantineProvider>
    </ThemeContext.Provider>
  )
}
