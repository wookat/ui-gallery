<script setup lang="ts">
import { computed } from "vue"
import { resolveIcon } from "@/icons"
import { settings } from "@/settings"

const props = withDefaults(defineProps<{ name: string; size?: number | string }>(), { size: 16 })
const component = computed(() => resolveIcon(props.name, settings.icons))
const px = computed(() => (typeof props.size === "number" ? `${props.size}px` : props.size))
</script>

<template>
  <component :is="component" class="ug-icon" :size="px" :style="{ width: px, height: px }" />
</template>

<style>
.ug-icon { display: inline-block; flex-shrink: 0; vertical-align: -0.15em; }
</style>
