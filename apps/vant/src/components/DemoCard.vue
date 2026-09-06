<script setup lang="ts">
import { computed } from "vue"
import { coverage } from "@/coverage"

const props = withDefaults(defineProps<{ name: string; id?: string; vant?: string; also?: string[]; contract?: boolean }>(), { contract: true, also: () => [], id: undefined, vant: undefined })
const anchorId = computed(() => props.id ?? (props.contract ? props.name : `vant-${props.name}`))
const status = computed(() => (props.contract ? coverage[props.name] : undefined))
const statusType = computed(() => (status.value === "missing" ? "danger" : status.value === "composed" ? "warning" : "success"))
</script>

<template>
  <article :id="anchorId" class="card component-demo demo-card">
    <span v-for="alias in also" :id="`vant-${alias}`" :key="alias" class="anchor-target" />
    <header class="demo-head">
      <h3>{{ name }}</h3>
      <van-tag v-if="status" :type="statusType" plain>{{ status }}</van-tag>
      <small v-if="vant" class="muted demo-caption">{{ vant }}</small>
    </header>
    <van-empty v-if="status === 'missing'" image="error" image-size="56" description="Vant 无此组件（missing）" class="missing-empty" />
    <slot />
  </article>
</template>

<style scoped>
.demo-card { min-width: 0; overflow: hidden; }
.demo-head { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.demo-head h3 { margin: 0; font-size: 16px; }
.demo-caption { flex-basis: 100%; font-size: 12px; }
.anchor-target { display: block; width: 0; height: 0; overflow: hidden; }
.missing-empty { padding: 8px 0; }
</style>
