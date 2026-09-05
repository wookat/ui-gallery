<script setup lang="ts">
import { NFlex, NH1, NText } from "naive-ui"
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <NFlex justify="space-between" align="end" :wrap="true">
    <div>
      <NText depth="3" style="font-size: 12px; letter-spacing: 0.2em">ACME CONSOLE</NText>
      <NH1 style="margin: 4px 0 0">{{ title }}</NH1>
      <NText v-if="description" depth="3">{{ description }}</NText>
    </div>
    <slot name="action" />
  </NFlex>
</template>
