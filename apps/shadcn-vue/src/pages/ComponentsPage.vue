<script setup lang="ts">
import contract from '@ui-gallery/spec/contract.json'
import PageHeader from '@/components/PageHeader.vue'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { coverage } from '@/lib/coverage'
import ComponentDemo from './ComponentDemo.vue'
import RegistryExtras from './RegistryExtras.vue'

const names = contract.components as string[]
const implemented = names.filter(name => coverage[name] !== 'missing').length
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="组件全集" :description="`覆盖 ${implemented}/${names.length} 个规范组件，展示 shadcn-vue 的组合能力。`" />
    <nav id="component-index" class="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-lg border bg-muted/30 p-3">
      <a v-for="name in names" :key="name" :href="`#component-${name}`" class="rounded-full border px-2.5 py-1 text-xs text-muted-foreground underline-offset-4 hover:bg-muted hover:underline">{{ name }}</a>
    </nav>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card v-for="(name, index) in names" :id="`component-${name}`" :key="name" class="scroll-mt-20">
        <CardHeader>
          <div class="flex items-center justify-between gap-2">
            <CardTitle class="text-base">{{ name }}</CardTitle>
            <Badge :variant="coverage[name] === 'missing' ? 'destructive' : coverage[name] === 'composed' ? 'secondary' : 'default'">{{ coverage[name] }}</Badge>
          </div>
          <CardDescription>default · disabled · hover · loading · error variants</CardDescription>
        </CardHeader>
        <CardContent><ComponentDemo :name="name" :index="index" /></CardContent>
      </Card>
    </div>
    <RegistryExtras />
  </div>
</template>
