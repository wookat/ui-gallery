import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { AppTheme } from "./theme"
import { AppShell } from "./layouts/app-shell"
import { LoginPage } from "./pages/login"
import { DashboardPage } from "./pages/dashboard"
import { OrdersPage } from "./pages/orders"
import { FormPage } from "./pages/form"
import { SettingsPage } from "./pages/settings"
import { ComponentsPage } from "./pages/components"
import { LandingPage } from "./pages/landing"
import { ChatPage } from "./pages/chat"

const router = createBrowserRouter(
  [
    { path: "/login", element: <LoginPage /> },
    { path: "/landing", element: <LandingPage /> },
    {
      element: <AppShell />,
      children: [
        { path: "/", element: <DashboardPage /> },
        { path: "/orders", element: <OrdersPage /> },
        { path: "/form", element: <FormPage /> },
        { path: "/settings", element: <SettingsPage /> },
        { path: "/components", element: <ComponentsPage /> },
        { path: "/chat", element: <ChatPage /> },
      ],
    },
  ],
  { basename: "/apps/mui" }
)

export default function App() {
  return (
    <AppTheme>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
      </LocalizationProvider>
    </AppTheme>
  )
}
