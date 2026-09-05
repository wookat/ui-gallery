import { createRouter, createWebHistory } from "vue-router"
import AppShell from "@/layouts/AppShell.vue"

export const router = createRouter({
  history: createWebHistory("/apps/vuetify/"),
  routes: [
    { path: "/login", component: () => import("@/pages/LoginPage.vue") },
    { path: "/landing", component: () => import("@/pages/LandingPage.vue") },
    {
      path: "/",
      component: AppShell,
      children: [
        { path: "", component: () => import("@/pages/DashboardPage.vue") },
        { path: "orders", component: () => import("@/pages/OrdersPage.vue") },
        { path: "form", component: () => import("@/pages/FormPage.vue") },
        { path: "settings", component: () => import("@/pages/SettingsPage.vue") },
        { path: "components", component: () => import("@/pages/ComponentsPage.vue") },
        { path: "chat", component: () => import("@/pages/ChatPage.vue") },
      ],
    },
  ],
})

// Preserve ?theme/&icons/&font across in-app navigation.
router.beforeEach((to, from) => {
  if (Object.keys(to.query).length || !Object.keys(from.query).length) return true
  return { ...to, query: from.query }
})
