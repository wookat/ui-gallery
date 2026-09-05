import { createRouter, createWebHistory } from "vue-router"
import AppShell from "./layouts/AppShell.vue"
import Chat from "./pages/Chat.vue"
import Components from "./pages/Components.vue"
import Dashboard from "./pages/Dashboard.vue"
import Form from "./pages/Form.vue"
import Landing from "./pages/Landing.vue"
import Login from "./pages/Login.vue"
import Orders from "./pages/Orders.vue"
import Settings from "./pages/Settings.vue"

export const router = createRouter({
  history: createWebHistory("/apps/element-plus/"),
  routes: [
    { path: "/login", component: Login }, { path: "/landing", component: Landing },
    { path: "/", component: AppShell, children: [{ path: "", component: Dashboard }] },
    { path: "/orders", component: AppShell, children: [{ path: "", component: Orders }] },
    { path: "/form", component: AppShell, children: [{ path: "", component: Form }] },
    { path: "/settings", component: AppShell, children: [{ path: "", component: Settings }] },
    { path: "/components", component: AppShell, children: [{ path: "", component: Components }] },
    { path: "/chat", component: AppShell, children: [{ path: "", component: Chat }] },
  ],
})
