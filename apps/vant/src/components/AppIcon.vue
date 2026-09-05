<script setup lang="ts">
import { computed } from "vue"
import { iconComponent, type IconName } from "@/icons"
import { urlSettings } from "@/url-settings"

const props = withDefaults(defineProps<{ name: IconName; size?: number | string }>(), { size: 18 })
const component = computed(() => iconComponent(urlSettings.iconSet, props.name))
</script>

<template>
  <component :is="component" v-if="component" :size="size" :width="size" :height="size" :aria-label="name" />
  <van-icon v-else :name="name" :size="size" :aria-label="name" />
</template>
