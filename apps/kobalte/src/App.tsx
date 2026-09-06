import { Route, Router } from "@solidjs/router"
import { AppShell } from "@/layouts/app-shell"
import { ChatPage } from "@/pages/chat"
import { ComponentsPage } from "@/pages/components"
import { DashboardPage } from "@/pages/dashboard"
import { FormPage } from "@/pages/form"
import { LandingPage } from "@/pages/landing"
import { LoginPage } from "@/pages/login"
import { OrdersPage } from "@/pages/orders"
import { SettingsPage } from "@/pages/settings"

const OrdersRoute = () => <AppShell><OrdersPage /></AppShell>
const DashboardRoute = () => <AppShell><DashboardPage /></AppShell>
const FormRoute = () => <AppShell><FormPage /></AppShell>
const SettingsRoute = () => <AppShell><SettingsPage /></AppShell>
const ComponentsRoute = () => <AppShell><ComponentsPage /></AppShell>
const ChatRoute = () => <AppShell><ChatPage /></AppShell>

export default function App() {
  return (
    <Router base="/apps/kobalte">
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={DashboardRoute} />
      <Route path="/orders" component={OrdersRoute} />
      <Route path="/form" component={FormRoute} />
      <Route path="/settings" component={SettingsRoute} />
      <Route path="/components" component={ComponentsRoute} />
      <Route path="/landing" component={LandingPage} />
      <Route path="/chat" component={ChatRoute} />
    </Router>
  )
}
