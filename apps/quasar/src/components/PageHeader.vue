<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <div class="row items-end justify-between q-col-gutter-md">
    <div class="col">
      <div class="text-overline text-primary">ACME CONSOLE</div>
      <h1 class="q-my-sm text-h4 text-weight-medium">{{ title }}</h1>
      <div v-if="description" class="text-body2 text-grey-7">{{ description }}</div>
    </div>
    <div class="col-auto">
      <slot name="action" />
    </div>
  </div>
</template>
