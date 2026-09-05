<script setup lang="ts">
import { computed, ref, watchEffect } from "vue"
import { RouterView, useRoute } from "vue-router"
import { ConfigProvider, App as AntApp, theme } from "ant-design-vue"
import AppShell from "./layouts/app-shell.vue"
import router from "./router"

const route = useRoute()
const params = new URLSearchParams(window.location.search)
const dark = ref(params.get("theme") === "dark" || (!params.get("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches))
const font = params.get("font") ?? "default"
const fontMap: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}
const isPublic = computed(() => route.path === "/login" || route.path === "/landing")
const configTheme = computed(() => ({ algorithm: dark.value ? theme.darkAlgorithm : theme.defaultAlgorithm, ...(fontMap[font] ? { token: { fontFamily: `var(--font-sans)` } } : {}) }))
watchEffect(() => {
  document.documentElement.classList.toggle("dark", dark.value)
  document.documentElement.style.colorScheme = dark.value ? "dark" : "light"
  document.documentElement.style.setProperty("--font-sans", fontMap[font] ?? "inherit")
  document.body.style.background = dark.value ? "#141414" : "#f5f5f5"
})
function toggleTheme() {
  dark.value = !dark.value
  const next = new URL(window.location.href)
  next.searchParams.set("theme", dark.value ? "dark" : "light")
  router.push(`${route.path}?${next.searchParams.toString()}`)
}
</script>

<template>
  <ConfigProvider :theme="configTheme">
    <AntApp>
      <template v-if="isPublic">
        <RouterView />
      </template>
      <AppShell v-else :dark="dark" @toggle-theme="toggleTheme">
        <RouterView />
      </AppShell>
    </AntApp>
  </ConfigProvider>
</template>
