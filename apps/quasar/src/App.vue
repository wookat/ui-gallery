<script setup lang="ts">
import { onMounted } from "vue"
import "@fontsource-variable/inter"
import "@fontsource-variable/geist"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/style.css"

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
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
