<script setup lang="ts">
import { computed, provide, ref, watchEffect } from "vue"
import { RouterView, useRoute } from "vue-router"
import { ConfigProvider, App as AntApp, theme } from "ant-design-vue"
import zhCN from "ant-design-vue/es/locale/zh_CN"
import dayjs from "dayjs"
import "dayjs/locale/zh-cn"
import AppShell from "./layouts/app-shell.vue"
import ThemeBody from "./theme-body.vue"
import router from "./router"
import { setIconSet } from "./icons"

const route = useRoute()
const params = new URLSearchParams(window.location.search)
const dark = ref(params.get("theme") === "dark" || (!params.get("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches))
provide("dark", dark)
dayjs.locale("zh-cn")
const queryValue = (key: string) => { const value = route.query[key]; return Array.isArray(value) ? value[0] ?? "" : value ?? "" }
const font = computed(() => queryValue("font") || "default")
const fontMap: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}
const isPublic = computed(() => route.path === "/login" || route.path === "/landing")
const configTheme = computed(() => ({
  algorithm: dark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    controlHeight: 40,
    ...(fontMap[font.value] ? { fontFamily: "var(--font-sans)" } : {}),
  },
}))
watchEffect(() => {
  const theme = queryValue("theme")
  if (theme === "dark" || theme === "light") dark.value = theme === "dark"
})
watchEffect(() => {
  document.documentElement.classList.toggle("dark", dark.value)
  document.documentElement.style.colorScheme = dark.value ? "dark" : "light"
  document.documentElement.style.setProperty("--font-sans", fontMap[font.value] ?? "inherit")
  setIconSet(queryValue("icons") || queryValue("icon"))
})
function toggleTheme() {
  dark.value = !dark.value
  const next = new URL(window.location.href)
  next.searchParams.set("theme", dark.value ? "dark" : "light")
  router.push(`${route.path}?${next.searchParams.toString()}`)
}
</script>

<template>
  <ConfigProvider :theme="configTheme" :locale="zhCN">
    <ThemeBody>
      <AntApp>
        <template v-if="isPublic">
          <RouterView />
        </template>
        <AppShell v-else :dark="dark" @toggle-theme="toggleTheme">
          <RouterView />
        </AppShell>
      </AntApp>
    </ThemeBody>
  </ConfigProvider>
</template>
