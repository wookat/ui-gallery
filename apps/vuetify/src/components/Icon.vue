<script setup lang="ts">
import { computed } from "vue"
import { resolveIcon, type IconName } from "@/icons"
import { useIconSet } from "@/composables/settings"

const props = withDefaults(defineProps<{ name: IconName; size?: number | string; color?: string }>(), { size: "default" })
const set = useIconSet()
const icon = computed(() => resolveIcon(props.name, set.value))
</script>

<template>
  <v-icon :icon="icon" :size="size" :color="color" aria-hidden="true" />
</template>
