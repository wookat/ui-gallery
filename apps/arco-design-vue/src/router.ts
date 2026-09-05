import { createRouter, createWebHistory } from "vue-router"
import AppShell from "./layouts/AppShell.vue"
import LoginPage from "./pages/LoginPage.vue"
import DashboardPage from "./pages/DashboardPage.vue"
import OrdersPage from "./pages/OrdersPage.vue"
import FormPage from "./pages/FormPage.vue"
import SettingsPage from "./pages/SettingsPage.vue"
import ComponentsPage from "./pages/ComponentsPage.vue"
import LandingPage from "./pages/LandingPage.vue"
import ChatPage from "./pages/ChatPage.vue"

export const router = createRouter({
  history: createWebHistory("/apps/arco-design-vue"),
  routes: [
    { path: "/login", component: LoginPage },
    { path: "/landing", component: LandingPage },
    {
      path: "/",
      component: AppShell,
      children: [
        { path: "", component: DashboardPage },
        { path: "orders", component: OrdersPage },
        { path: "form", component: FormPage },
        { path: "settings", component: SettingsPage },
        { path: "components", component: ComponentsPage },
        { path: "chat", component: ChatPage },
      ],
    },
  ],
})
