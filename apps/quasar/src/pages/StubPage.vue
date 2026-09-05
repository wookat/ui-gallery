<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue"
defineProps<{ title: string }>()
</script>

<template>
  <div class="q-gutter-y-lg">
    <PageHeader :title="title" description="该页面将在下一阶段完善。" />
    <q-card flat bordered><q-card-section><div class="text-body1">Acme Console</div></q-card-section></q-card>
  </div>
</template>
