<script setup lang="ts">
import { computed } from "vue"
import { iconComponent, nativeIcon, type IconName } from "@/icons"
import { urlSettings } from "@/url-settings"

const props = withDefaults(defineProps<{ name: IconName; size?: number | string }>(), { size: 18 })
const component = computed(() => iconComponent(urlSettings.iconSet, props.name))
</script>

<template>
  <span class="app-icon" :aria-label="name">
    <component :is="component" v-if="component" :size="size" :width="size" :height="size" />
    <van-icon v-else :name="nativeIcon(name)" :size="size" />
  </span>
</template>
