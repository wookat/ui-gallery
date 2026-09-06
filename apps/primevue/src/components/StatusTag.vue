<script setup lang="ts">
import Tag from "primevue/tag"
import { computed } from "vue"

const props = defineProps<{ status: string }>()
const severity = computed(() => {
  if (["paid", "shipped", "active", "delivered", "done"].includes(props.status)) return "success"
  if (["pending", "due", "processing"].includes(props.status)) return "warn"
  if (["refunded", "info"].includes(props.status)) return "info"
  if (["failed", "cancelled", "canceled", "overdue"].includes(props.status)) return "danger"
  return "secondary"
})
</script>

<template>
  <Tag :severity="severity" :value="status" rounded />
</template>
