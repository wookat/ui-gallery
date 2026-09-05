<script setup lang="ts">
import contract from "@ui-gallery/spec/contract.json"
import { coverage } from "../coverage"
import ComponentDemo from "./component-demo.vue"
</script>
<template>
  <div class="page">
    <a-typography-title :level="1">组件全集</a-typography-title>
    <p class="muted">Ant Design Vue 官方组件、全部 contract 覆盖与组合示例。</p>
    <div class="component-index"><a-tag v-for="name in contract.components" :key="name" color="blue"><a :href="`#component-${name}`">{{ name }}</a></a-tag></div>
    <div class="card-grid">
      <a-card v-for="name in contract.components" :id="`component-${name}`" :key="name" class="component-section">
        <template #title><span>{{ name }}</span><a-tag :color="coverage[name] === 'missing' ? 'error' : coverage[name] === 'composed' ? 'warning' : 'success'">{{ coverage[name] }}</a-tag></template>
        <template #extra><a-typography-text type="secondary">default · disabled · loading</a-typography-text></template>
        <ComponentDemo :name="name" />
      </a-card>
    </div>
  </div>
</template>
<style scoped>.component-section { scroll-margin-top: 90px; }</style>
