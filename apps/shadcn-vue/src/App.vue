<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { RouterView } from 'vue-router'
import { useGalleryParams } from '@/lib/url-params'

useGalleryParams()
</script>

<template>
  <RouterView />
  <Toaster position="bottom-right" rich-colors />
</template>
