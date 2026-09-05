<script setup lang="ts">
import contract from "@ui-gallery/spec/contract.json"
import { coverage } from "../coverage"
import ComponentDemo, { wideDemos } from "./component-demo.vue"
const tagColor: Record<string, string> = { implemented: "success", composed: "warning", missing: "error" }
</script>
<template>
  <div class="page">
    <a-typography-title :level="1">组件全集</a-typography-title>
    <p class="muted">Ant Design Vue 官方组件、全部 contract 覆盖与组合示例。</p>
    <div class="component-index"><a-tag v-for="name in contract.components" :key="name" color="blue"><a :href="`#component-${name}`">{{ name }}</a></a-tag></div>
    <div class="component-grid">
      <a-card v-for="name in contract.components" :id="`component-${name}`" :key="name" class="component-section" :class="{ 'span-2': wideDemos.includes(name) }" :title="name">
        <template #extra><a-tag :color="tagColor[coverage[name]]" :data-coverage="coverage[name]">{{ coverage[name] }}</a-tag></template>
        <ComponentDemo :name="name" />
      </a-card>
    </div>
  </div>
</template>
