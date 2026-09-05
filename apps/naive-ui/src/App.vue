<script setup lang="ts">
import { useRoute } from "vue-router"
import { zhCN, dateZhCN, NConfigProvider, NGlobalStyle, NMessageProvider, NNotificationProvider, NDialogProvider, NLoadingBarProvider, NModalProvider } from "naive-ui"
import { naiveTheme, themeOverrides } from "./settings"
import AppShell from "./layouts/AppShell.vue"

const route = useRoute()
</script>

<template>
  <NConfigProvider :theme="naiveTheme" :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <NGlobalStyle />
    <NLoadingBarProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <NDialogProvider>
            <NModalProvider>
              <AppShell v-if="route.meta.shell !== false"><RouterView /></AppShell>
              <RouterView v-else />
            </NModalProvider>
          </NDialogProvider>
        </NMessageProvider>
      </NNotificationProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>
