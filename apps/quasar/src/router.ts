import { createRouter, createWebHistory } from "vue-router"
import AppShell from "./layouts/AppShell.vue"
import DashboardPage from "./pages/DashboardPage.vue"
import LoginPage from "./pages/LoginPage.vue"
import OrdersPage from "./pages/OrdersPage.vue"
import StubPage from "./pages/StubPage.vue"

const shell = (component: typeof DashboardPage | typeof OrdersPage | typeof StubPage, props?: Record<string, string>) => ({ component: AppShell, children: [{ path: "", component, props }] })

export default createRouter({
  history: createWebHistory("/apps/quasar"),
  routes: [
    { path: "/login", component: LoginPage },
    { path: "/", ...shell(DashboardPage) },
    { path: "/orders", ...shell(OrdersPage) },
    { path: "/form", ...shell(StubPage, { title: "新建项目" }) },
    { path: "/settings", ...shell(StubPage, { title: "设置" }) },
    { path: "/components", ...shell(StubPage, { title: "组件全集" }) },
    { path: "/landing", component: StubPage, props: { title: "落地页" } },
    { path: "/chat", ...shell(StubPage, { title: "AI 助手" }) },
  ],
})
