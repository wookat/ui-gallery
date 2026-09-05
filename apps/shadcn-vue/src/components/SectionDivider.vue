<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
defineProps<{ label: string }>()
</script>
<template><div class="flex items-center gap-3 text-xs text-muted-foreground"><Separator class="flex-1" /><span>{{ label }}</span><Separator class="flex-1" /></div></template>
