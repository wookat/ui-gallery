<script setup lang="ts">
import { watchEffect } from "vue"
import { theme } from "ant-design-vue"

const { token } = theme.useToken()

watchEffect(() => {
  const current = token.value
  document.body.style.background = current.colorBgLayout
  const root = document.documentElement
  root.style.setProperty("--app-color-primary", current.colorPrimary)
  root.style.setProperty("--app-color-white", current.colorWhite)
  root.style.setProperty("--app-color-error", current.colorError)
  root.style.setProperty("--app-color-primary-bg", current.colorPrimaryBg)
  root.style.setProperty("--app-color-primary-text", current.colorPrimaryText)
  root.style.setProperty("--app-color-text", current.colorText)
  root.style.setProperty("--app-color-text-secondary", current.colorTextSecondary)
  root.style.setProperty("--app-color-bg-layout", current.colorBgLayout)
  root.style.setProperty("--app-color-bg-container", current.colorBgContainer)
  root.style.setProperty("--app-color-border", current.colorBorder)
  root.style.setProperty("--app-color-border-secondary", current.colorBorderSecondary)
  root.style.setProperty("--app-color-fill-quaternary", current.colorFillQuaternary)
})
</script>

<template>
  <slot />
</template>
