import { createRouter, createWebHistory } from "vue-router"

export const router = createRouter({
  history: createWebHistory("/apps/tdesign-vue-next/"),
  routes: [
    { path: "/login", component: () => import("@/pages/Login.vue") },
    { path: "/landing", component: () => import("@/pages/Landing.vue") },
    {
      path: "/",
      component: () => import("@/layouts/AppShell.vue"),
      children: [
        { path: "", component: () => import("@/pages/Dashboard.vue") },
        { path: "orders", component: () => import("@/pages/Orders.vue") },
        { path: "form", component: () => import("@/pages/Form.vue") },
        { path: "settings", component: () => import("@/pages/Settings.vue") },
        { path: "components", component: () => import("@/pages/Components.vue") },
        { path: "chat", component: () => import("@/pages/Chat.vue") },
      ],
    },
  ],
})
