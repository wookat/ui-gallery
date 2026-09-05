import { createRouter, createWebHistory } from "vue-router"
import AppShell from "./layouts/AppShell.vue"
import DashboardPage from "./pages/DashboardPage.vue"
import FormPage from "./pages/FormPage.vue"
import SettingsPage from "./pages/SettingsPage.vue"
import LandingPage from "./pages/LandingPage.vue"
import ChatPage from "./pages/ChatPage.vue"
import ComponentsPage from "./pages/ComponentsPage.vue"
import LoginPage from "./pages/LoginPage.vue"
import OrdersPage from "./pages/OrdersPage.vue"
import StubPage from "./pages/StubPage.vue"

const shell = (component: typeof DashboardPage | typeof OrdersPage | typeof FormPage | typeof SettingsPage | typeof ChatPage | typeof StubPage) => ({ component: AppShell, children: [{ path: "", component }] })

export default createRouter({
  history: createWebHistory("/apps/quasar"),
  routes: [
    { path: "/login", component: LoginPage },
    { path: "/", ...shell(DashboardPage) },
    { path: "/orders", ...shell(OrdersPage) },
    { path: "/form", ...shell(FormPage) },
    { path: "/settings", ...shell(SettingsPage) },
    { path: "/components", ...shell(ComponentsPage) },
    { path: "/landing", component: LandingPage },
    { path: "/chat", ...shell(ChatPage) },
  ],
})
