<script setup lang="ts">
import { ref } from 'vue'
import contract from '@ui-gallery/spec/contract.json'
import PageHeader from '@/components/PageHeader.vue'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { coverage } from '@/lib/coverage'
import ComponentDemo from './ComponentDemo.vue'
import RegistryExtras from './RegistryExtras.vue'

const names = contract.components as string[]
const implemented = names.filter(name => coverage[name] !== 'missing').length
const indexExpanded = ref(false)
const descriptions: Record<string, string> = {
  Input: 'default · disabled · invalid · 前后缀',
  Button: '变体、尺寸、图标、加载与禁用状态',
  Alert: '默认、危险及图标组合提示',
  Tabs: '默认与线性标签页变体',
  Statistic: '来自 stats.json 的收入指标与同比变化',
  Sidebar: '固定高度容器中的导航侧栏组合',
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="组件全集" :description="`覆盖 ${implemented}/${names.length} 个规范组件，展示 shadcn-vue 的组合能力。`" />
    <Collapsible v-model:open="indexExpanded" class="rounded-lg border bg-muted/30 p-3">
      <nav id="component-index" class="flex max-h-24 flex-wrap gap-2 overflow-hidden" :class="indexExpanded ? 'max-h-none' : ''">
        <a v-for="name in names" :key="name" :href="`#component-${name}`" class="inline-flex min-h-10 items-center rounded-full border px-3 text-xs text-muted-foreground underline-offset-4 hover:bg-muted hover:underline">{{ name }}</a>
      </nav>
      <CollapsibleContent><span class="sr-only">全部组件已展开</span></CollapsibleContent>
      <CollapsibleTrigger as-child><button class="mt-2 min-h-10 text-sm underline">{{ indexExpanded ? '收起' : '展开全部' }}</button></CollapsibleTrigger>
    </Collapsible>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card v-for="(name, index) in names" :id="`component-${name}`" :key="name" class="scroll-mt-20">
        <CardHeader>
          <div class="flex items-center justify-between gap-2">
            <CardTitle class="text-base">{{ name }}</CardTitle>
            <Badge :variant="coverage[name] === 'missing' ? 'destructive' : coverage[name] === 'composed' ? 'secondary' : 'default'">{{ coverage[name] }}</Badge>
          </div>
          <CardDescription>{{ descriptions[name] ?? '默认展示' }}</CardDescription>
        </CardHeader>
        <CardContent><ComponentDemo :name="name" :index="index" /></CardContent>
      </Card>
    </div>
    <RegistryExtras />
  </div>
</template>
