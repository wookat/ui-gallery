import { lazy, Suspense, type ReactNode } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Flex, Spinner } from "@radix-ui/themes"
import { AppShell } from "./layouts/app-shell"

const ChatPage = lazy(() =>
  import("./pages/chat").then((m) => ({ default: m.ChatPage }))
)
const ComponentsPage = lazy(() =>
  import("./pages/components").then((m) => ({ default: m.ComponentsPage }))
)
const DashboardPage = lazy(() =>
  import("./pages/dashboard").then((m) => ({ default: m.DashboardPage }))
)
const FormPage = lazy(() =>
  import("./pages/form").then((m) => ({ default: m.FormPage }))
)
const LandingPage = lazy(() =>
  import("./pages/landing").then((m) => ({ default: m.LandingPage }))
)
const LoginPage = lazy(() =>
  import("./pages/login").then((m) => ({ default: m.LoginPage }))
)
const OrdersPage = lazy(() =>
  import("./pages/orders").then((m) => ({ default: m.OrdersPage }))
)
const SettingsPage = lazy(() =>
  import("./pages/settings").then((m) => ({ default: m.SettingsPage }))
)

const fallback = (
  <Flex align="center" justify="center" p="9">
    <Spinner size="3" />
  </Flex>
)
const page = (element: ReactNode) => (
  <Suspense fallback={fallback}>{element}</Suspense>
)
const shell = (element: ReactNode) => <AppShell>{page(element)}</AppShell>
const router = createBrowserRouter(
  [
    { path: "/login", element: page(<LoginPage />) },
    { path: "/", element: shell(<DashboardPage />) },
    { path: "/orders", element: shell(<OrdersPage />) },
    { path: "/form", element: shell(<FormPage />) },
    { path: "/settings", element: shell(<SettingsPage />) },
    { path: "/components", element: shell(<ComponentsPage />) },
    { path: "/landing", element: page(<LandingPage />) },
    { path: "/chat", element: shell(<ChatPage />) },
  ],
  { basename: "/apps/radix-themes" }
)

export default function App() {
  return <RouterProvider router={router} />
}
