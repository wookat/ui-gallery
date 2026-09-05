import { createRouter, createWebHistory } from "vue-router"

export const router = createRouter({
  history: createWebHistory("/apps/naive-ui/"),
  routes: [
    { path: "/login", component: () => import("./pages/LoginPage.vue"), meta: { shell: false } },
    { path: "/", component: () => import("./pages/DashboardPage.vue") },
    { path: "/orders", component: () => import("./pages/OrdersPage.vue") },
    { path: "/form", component: () => import("./pages/FormPage.vue") },
    { path: "/settings", component: () => import("./pages/SettingsPage.vue") },
    { path: "/components", component: () => import("./pages/ComponentsPage.vue") },
    { path: "/landing", component: () => import("./pages/LandingPage.vue"), meta: { shell: false } },
    { path: "/chat", component: () => import("./pages/ChatPage.vue") },
  ],
})
