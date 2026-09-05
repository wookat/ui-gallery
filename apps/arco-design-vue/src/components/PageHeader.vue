<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <div class="page-header">
    <div class="stack" style="gap: 4px">
      <a-typography-text type="secondary" class="small" style="letter-spacing: 0.2em">ACME CONSOLE</a-typography-text>
      <a-typography-title :heading="3" style="margin: 0">{{ title }}</a-typography-title>
      <a-typography-text v-if="description" type="secondary">{{ description }}</a-typography-text>
    </div>
    <div v-if="$slots.default" class="row"><slot /></div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}
</style>
