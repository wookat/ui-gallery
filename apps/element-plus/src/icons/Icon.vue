<script setup lang="ts">
import { computed } from "vue"
import { getIcon } from "./maps"

const props = withDefaults(defineProps<{ name: string; size?: number | string }>(), { size: 16 })
const params = new URLSearchParams(window.location.search)
const family = params.get("icon") ?? params.get("icons") ?? "native"
const component = computed(() => getIcon(family, props.name))
</script>

<template>
  <el-icon :size="props.size"><component :is="component" /></el-icon>
</template>
