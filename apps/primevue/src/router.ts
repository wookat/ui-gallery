import { createRouter, createWebHistory } from "vue-router"

export const router = createRouter({
  history: createWebHistory("/apps/primevue"),
  routes: [
    { path: "/login", component: () => import("./pages/LoginPage.vue") },
    { path: "/landing", component: () => import("./pages/LandingPage.vue") },
    {
      path: "/",
      component: () => import("./layouts/AppShell.vue"),
      children: [
        { path: "", component: () => import("./pages/DashboardPage.vue") },
        { path: "orders", component: () => import("./pages/OrdersPage.vue") },
        { path: "form", component: () => import("./pages/FormPage.vue") },
        { path: "settings", component: () => import("./pages/SettingsPage.vue") },
        { path: "components", component: () => import("./pages/ComponentsPage.vue") },
        { path: "chat", component: () => import("./pages/ChatPage.vue") },
      ],
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
})
