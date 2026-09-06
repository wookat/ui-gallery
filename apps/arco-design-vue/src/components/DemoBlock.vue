<script setup lang="ts">
import { coverage } from "@/coverage"

const props = defineProps<{ name: string; arco?: string }>()
const status = coverage[props.name] ?? "missing"
const color = status === "implemented" ? "green" : status === "composed" ? "orange" : "red"
</script>

<template>
  <a-card :id="name" class="demo" :bordered="true">
    <template #title>
      <a-space size="small">
        <span>{{ name }}</span>
        <a-tag :color="color" size="small">{{ status }}</a-tag>
        <a-typography-text v-if="arco" type="secondary" class="small">{{ arco }}</a-typography-text>
      </a-space>
    </template>
    <a-empty v-if="status === 'missing'" description="Arco Design Vue 未提供对应组件，已在 gallery.json 标记为 missing。" />
    <div v-else class="demo-body"><slot /></div>
  </a-card>
</template>

<style scoped>
.demo {
  scroll-margin-top: 76px;
}

.demo-body {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.demo-body > :deep(.block) {
  flex-basis: 100%;
  min-width: 0;
  max-width: 100%;
}
</style>
