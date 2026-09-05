import { createRouter, createWebHistory } from "vue-router"
import DashboardPage from "./pages/dashboard.vue"
import OrdersPage from "./pages/orders.vue"
import FormPage from "./pages/form.vue"
import SettingsPage from "./pages/settings.vue"
import ComponentsPage from "./pages/components.vue"
import ChatPage from "./pages/chat.vue"
import LoginPage from "./pages/login.vue"
import LandingPage from "./pages/landing.vue"

const router = createRouter({
  history: createWebHistory("/apps/ant-design-vue"),
  routes: [
    { path: "/login", component: LoginPage },
    { path: "/", component: DashboardPage },
    { path: "/orders", component: OrdersPage },
    { path: "/form", component: FormPage },
    { path: "/settings", component: SettingsPage },
    { path: "/components", component: ComponentsPage },
    { path: "/landing", component: LandingPage },
    { path: "/chat", component: ChatPage },
  ],
})
export default router
