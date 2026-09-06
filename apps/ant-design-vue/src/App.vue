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

const route = useRoute()
const params = new URLSearchParams(window.location.search)
const dark = ref(params.get("theme") === "dark" || (!params.get("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches))
provide("dark", dark)
dayjs.locale("zh-cn")
const font = params.get("font") ?? "default"
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
    ...(fontMap[font] ? { fontFamily: "var(--font-sans)" } : {}),
    colorTextDescription: dark.value ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)",
    colorTextTertiary: dark.value ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)",
    ...(dark.value ? { colorLink: "#3c89e8", colorLinkHover: "#65a9f3", colorLinkActive: "#1554ad" } : {}),
  },
  components: dark.value ? {} : { Tag: { colorSuccess: "#237804", colorWarning: "#ad4e00", colorError: "#a8071a", colorInfo: "#0958d9" } },
}))
watchEffect(() => {
  document.documentElement.classList.toggle("dark", dark.value)
  document.documentElement.style.colorScheme = dark.value ? "dark" : "light"
  document.documentElement.style.setProperty("--font-sans", fontMap[font] ?? "inherit")
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
