<script setup lang="ts">
import { computed } from 'vue'
import { currentIconFamily } from '@/lib/url-params'
import { getIcon } from '@/lib/icons'

const props = withDefaults(defineProps<{
  name: string
  size?: number | string
  class?: string
  strokeWidth?: number
  weight?: string
  color?: string
}>(), { size: 16 })

const component = computed(() => getIcon(props.name, currentIconFamily()))
</script>

<template>
  <component :is="component" :size="props.size" :stroke-width="props.strokeWidth" :weight="props.weight" :color="props.color" :class="props.class" />
</template>
