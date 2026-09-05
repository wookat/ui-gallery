<script setup lang="ts">
defineProps<{ title?: string; description?: string; flush?: boolean; id?: string }>()
</script>

<template>
  <section :id="id" class="section-card">
    <header v-if="title || $slots.actions" class="section-card__head">
      <div class="min-w-0">
        <h2 v-if="title" class="section-card__title">{{ title }}</h2>
        <p v-if="description" class="section-card__desc">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-2 shrink-0"><slot name="actions" /></div>
    </header>
    <div class="section-card__body" :class="{ 'section-card__body--flush': flush }"><slot /></div>
  </section>
</template>
