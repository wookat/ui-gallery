<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{ value: string }>()
const color = computed(() => {
  if (["paid", "shipped", "active", "done"].includes(props.value)) return "green"
  if (["pending", "due", "processing"].includes(props.value)) return "orange"
  if (["refunded", "failed", "cancelled"].includes(props.value)) return "red"
  return "arcoblue"
})
</script>

<template>
  <a-tag :color="color" size="small">{{ value }}</a-tag>
</template>
