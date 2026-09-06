<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>
<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div class="space-y-1">
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">ACME CONSOLE</p>
      <h1 class="text-3xl font-semibold tracking-tight">{{ title }}</h1>
      <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>
