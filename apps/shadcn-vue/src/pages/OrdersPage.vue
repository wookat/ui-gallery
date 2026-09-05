<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import orders from '@ui-gallery/spec/mock/orders.json'
import Icon from '@/components/Icon.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

const query = ref('')
const status = ref('all')
const selected = ref<typeof orders[number] | null>(null)
const state = ref<'ready' | 'empty' | 'error' | 'loading'>('ready')
const filtered = computed(() => orders.filter((item) => (!query.value || `${item.id} ${item.customer}`.toLowerCase().includes(query.value.toLowerCase())) && (status.value === 'all' || item.status === status.value)).slice(0, 8))
function remove() { selected.value = null; toast.success('订单已删除') }
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="订单" description="查看、筛选并管理全部订单。" />
    <Card>
      <CardHeader class="gap-4"><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><CardTitle>订单列表</CardTitle><div class="flex flex-wrap gap-2"><Input v-model="query" class="w-full sm:w-56" placeholder="搜索订单..." /><Select v-model="status"><SelectTrigger class="w-36"><SelectValue placeholder="状态" /></SelectTrigger><SelectContent><SelectItem value="all">全部状态</SelectItem><SelectItem value="paid">paid</SelectItem><SelectItem value="pending">pending</SelectItem><SelectItem value="failed">failed</SelectItem><SelectItem value="shipped">shipped</SelectItem></SelectContent></Select><Button variant="outline" @click="toast.success('导出任务已创建')"><Icon name="download" />导出</Button></div></div></CardHeader>
      <CardContent>
        <Alert v-if="state === 'error'" variant="destructive" class="mb-4"><Icon name="alert-circle" /><AlertTitle>加载失败</AlertTitle><AlertDescription>订单数据暂时无法加载。<Button variant="link" class="px-1" @click="state = 'ready'">重试</Button></AlertDescription></Alert>
        <div v-if="state === 'loading'" class="space-y-3"><Skeleton v-for="n in 5" :key="n" class="h-12" /></div>
        <div v-else-if="state === 'empty'" class="grid place-items-center gap-3 py-16 text-center"><Icon name="archive" :size="32" class="text-muted-foreground" /><p class="font-medium">暂无订单</p><p class="text-sm text-muted-foreground">调整筛选条件或创建一笔新订单。</p><Button @click="state = 'ready'">清除筛选</Button></div>
        <div v-else class="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>订单号</TableHead><TableHead>客户</TableHead><TableHead>状态</TableHead><TableHead>日期</TableHead><TableHead class="text-right">金额</TableHead><TableHead class="text-right">操作</TableHead></TableRow></TableHeader><TableBody><TableRow v-for="order in filtered" :key="order.id"><TableCell class="font-medium">{{ order.id }}</TableCell><TableCell>{{ order.customer }}</TableCell><TableCell><StatusBadge :value="order.status" /></TableCell><TableCell>{{ order.date }}</TableCell><TableCell class="text-right">¥{{ order.amount.toLocaleString() }}</TableCell><TableCell class="text-right"><Button size="sm" variant="ghost" @click="selected = order">详情</Button></TableCell></TableRow></TableBody></Table></div>
        <p v-if="!filtered.length && state === 'ready'" class="py-12 text-center text-sm text-muted-foreground">没有匹配的订单</p>
        <div class="mt-4 flex items-center justify-between text-sm text-muted-foreground"><span>显示 {{ filtered.length }} / {{ orders.length }} 条</span><div class="flex gap-1"><Button size="sm" variant="outline">上一页</Button><Button size="sm" variant="outline">下一页</Button></div></div>
      </CardContent>
    </Card>
    <Sheet :open="!!selected" @update:open="(value) => !value && (selected = null)"><SheetContent><SheetHeader><SheetTitle>{{ selected?.id ?? '订单详情' }}</SheetTitle><SheetDescription>查看订单的完整信息与备注。</SheetDescription></SheetHeader><div v-if="selected" class="space-y-5 p-4"><div class="grid gap-3 text-sm"><div class="flex justify-between"><span class="text-muted-foreground">客户</span><span>{{ selected.customer }}</span></div><div class="flex justify-between"><span class="text-muted-foreground">状态</span><StatusBadge :value="selected.status" /></div><div class="flex justify-between"><span class="text-muted-foreground">金额</span><span>¥{{ selected.amount.toLocaleString() }}</span></div></div><Textarea placeholder="添加备注..." /><Button variant="destructive" class="w-full" @click="remove"><Icon name="trash" />删除订单</Button></div></SheetContent></Sheet>
  </div>
</template>
