<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { statusVariant } from '@/pages/shared'
defineProps<{ value: string }>()
</script>
<template><Badge :variant="statusVariant(value)">{{ value }}</Badge></template>
