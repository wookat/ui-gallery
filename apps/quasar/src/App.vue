<script setup lang="ts">
import { onMounted } from "vue"
import { Dark } from "quasar"
import "@fontsource-variable/inter"
import "@fontsource-variable/geist"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/style.css"

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const theme = params.get("theme")
  Dark.set(theme === "dark" ? true : theme === "light" ? false : "auto")
  const fonts: Record<string, string> = {
    inter: "'Inter Variable', sans-serif",
    geist: "'Geist Variable', sans-serif",
    "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
    "lxgw-wenkai": "'LXGW WenKai Screen', serif",
  }
  document.body.style.fontFamily = fonts[params.get("font") ?? ""] ?? ""
})
</script>

<template>
  <router-view />
</template>
