<script setup lang="ts">
import { computed } from "vue"
import { RouterView } from "vue-router"
import { urlSettings } from "@/url-settings"

const dark = computed(() => urlSettings.theme === "dark")
</script>

<template>
  <van-config-provider :theme="dark ? 'dark' : 'light'" theme-vars-scope="global">
    <router-view />
  </van-config-provider>
</template>
