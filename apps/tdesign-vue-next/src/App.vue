<script setup lang="ts">
import { ConfigProvider } from "tdesign-vue-next"
import { settings } from "@/settings"
</script>

<template>
  <ConfigProvider :global-config="{}" :key="settings.icons">
    <RouterView />
  </ConfigProvider>
</template>
