<script setup lang="ts">
import { NTag } from "naive-ui"
import { statusType } from "../composables"
defineProps<{ value: string; size?: "small" | "medium" | "large" }>()
</script>

<template>
  <NTag :type="statusType(value)" :size="size ?? 'small'" round :bordered="false">{{ value }}</NTag>
</template>
