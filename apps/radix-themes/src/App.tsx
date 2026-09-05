import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AppShell } from "./layouts/app-shell"
import { ChatPage } from "./pages/chat"
import { ComponentsPage } from "./pages/components"
import { DashboardPage } from "./pages/dashboard"
import { FormPage } from "./pages/form"
import { LandingPage } from "./pages/landing"
import { LoginPage } from "./pages/login"
import { OrdersPage } from "./pages/orders"
import { SettingsPage } from "./pages/settings"

const shell = (element: React.ReactNode) => <AppShell>{element}</AppShell>
const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: shell(<DashboardPage />) },
  { path: "/orders", element: shell(<OrdersPage />) },
  { path: "/form", element: shell(<FormPage />) },
  { path: "/settings", element: shell(<SettingsPage />) },
  { path: "/components", element: shell(<ComponentsPage />) },
  { path: "/landing", element: <LandingPage /> },
  { path: "/chat", element: shell(<ChatPage />) },
], { basename: "/apps/radix-themes" })

export default function App() {
  return <RouterProvider router={router} />
}
