<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  title: string
  id: string
  description?: string
}>()

const anchorId = computed(() => props.id.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase())
</script>

<template>
  <q-card :id="anchorId" bordered class="q-mb-md component-demo">
    <q-card-section class="q-pb-sm">
      <div class="row items-center justify-between q-gutter-sm">
        <div class="text-h6">{{ title }}</div>
        <q-badge outline color="primary">#{{ anchorId }}</q-badge>
      </div>
      <div v-if="description" class="text-caption text-grey-7 q-mt-xs">{{ description }}</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <slot />
    </q-card-section>
  </q-card>
</template>
