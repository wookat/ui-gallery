import type { ReactNode } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { I18nProvider } from "@cloudscape-design/components/i18n"
import messages from "@cloudscape-design/components/i18n/messages/all.zh-CN"

import { AppShell } from "@/layouts/app-shell"
import { GalleryIconProvider } from "@/lib/icons"
import { BASENAME } from "@/lib/nav"
import { ChatPage } from "@/pages/chat"
import { ComponentsPage } from "@/pages/components"
import { DashboardPage } from "@/pages/dashboard"
import { FormPage } from "@/pages/form"
import { LandingPage } from "@/pages/landing"
import { LoginPage } from "@/pages/login"
import { OrdersPage } from "@/pages/orders"
import { SettingsPage } from "@/pages/settings"

const shell = (page: ReactNode) => <AppShell>{page}</AppShell>

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
  { basename: BASENAME }
)

export default function App() {
  return (
    <I18nProvider locale="zh-CN" messages={[messages]}>
      <GalleryIconProvider>
        <RouterProvider router={router} />
      </GalleryIconProvider>
    </I18nProvider>
  )
}
