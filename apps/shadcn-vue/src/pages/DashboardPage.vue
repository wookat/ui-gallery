<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { VisArea, VisAxis, VisDonut, VisGroupedBar, VisLine, VisSingleContainer, VisXYContainer } from '@unovis/vue'
import activity from '@ui-gallery/spec/mock/activity.json'
import orders from '@ui-gallery/spec/mock/orders.json'
import series from '@ui-gallery/spec/mock/series.json'
import stats from '@ui-gallery/spec/mock/stats.json'
import tasks from '@ui-gallery/spec/mock/tasks.json'
import Icon from '@/components/Icon.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const router = useRouter()
const period = ref('month')
const chartData = computed(() => {
  const count = period.value === 'day' ? 2 : period.value === 'week' ? 4 : series.months.length
  return series.months.slice(-count).map((month, offset) => {
    const index = series.months.length - count + offset
    return { month, index: offset, revenue: series.revenue[index], orders: series.orders[index] }
  })
})
const channelData = computed(() => {
  const counts = new Map<string, number>()
  for (const order of orders) counts.set(order.channel, (counts.get(order.channel) ?? 0) + 1)
  return [...counts].map(([label, value]) => ({ label, value }))
})
const channelColors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="仪表盘" description="欢迎回来，林晓。这里是今天的业务概况。" />
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card v-for="item in stats" :key="item.key"><CardHeader class="pb-2"><div class="flex items-center justify-between text-sm text-muted-foreground"><CardDescription>{{ item.label }}</CardDescription><Badge :variant="item.delta > 0 ? 'default' : 'secondary'">{{ item.delta > 0 ? '+' : '' }}{{ item.delta }}%</Badge></div><CardTitle class="text-2xl">{{ item.unit === 'CNY' ? `¥${item.value.toLocaleString()}` : `${item.value}${item.unit ?? ''}` }}</CardTitle></CardHeader><CardContent><div class="h-12"><svg viewBox="0 0 120 32" class="h-full w-full text-primary" preserveAspectRatio="none"><polyline fill="none" stroke="currentColor" stroke-width="2" :points="item.trend.map((value, index) => `${(index / (item.trend.length - 1)) * 120},${32 - (value / Math.max(...item.trend)) * 28}`).join(' ')" /></svg></div></CardContent></Card>
    </div>
    <Tabs v-model="period"><TabsList class="group-data-horizontal/tabs:h-12"><TabsTrigger value="day" class="min-w-10 px-3">日</TabsTrigger><TabsTrigger value="week" class="min-w-10 px-3">周</TabsTrigger><TabsTrigger value="month" class="min-w-10 px-3">月</TabsTrigger></TabsList></Tabs>
    <div class="grid gap-4 lg:grid-cols-3">
      <Card class="lg:col-span-2"><CardHeader><CardTitle>收入趋势</CardTitle><CardDescription>收入与订单变化</CardDescription></CardHeader><CardContent class="h-72"><VisXYContainer :data="chartData" class="h-full" :height="260"><VisArea :x="(item: any) => item.index" :y="(item: any) => item.orders" color="var(--chart-2)" opacity="0.18" /><VisLine :x="(item: any) => item.index" :y="(item: any) => item.revenue" color="var(--chart-1)" /><VisAxis type="x" :tick-format="(index: number) => chartData[index]?.month ?? ''" /><VisAxis type="y" /></VisXYContainer></CardContent></Card>
      <Card><CardHeader><CardTitle>渠道占比</CardTitle><CardDescription>订单来源分布</CardDescription></CardHeader><CardContent><VisSingleContainer :height="180"><VisDonut :data="channelData" :value="(item: any) => item.value" :color="(item: any, index: number) => channelColors[index % channelColors.length]" :arc-width="28" /></VisSingleContainer><div class="mt-3 grid gap-2 text-sm"><div v-for="(item, index) in channelData" :key="item.label" class="flex items-center justify-between"><span class="flex items-center gap-2"><span class="size-2 rounded-full" :style="{ background: channelColors[index % channelColors.length] }" />{{ item.label }}</span><span class="text-muted-foreground">{{ item.value }}</span></div></div></CardContent></Card>
      <Card class="lg:col-span-2"><CardHeader><CardTitle>订单量柱状</CardTitle><CardDescription>各周期订单量</CardDescription></CardHeader><CardContent class="h-64"><VisXYContainer :data="chartData" class="h-full" :height="220"><VisGroupedBar :x="(item: any) => item.index" :y="(item: any) => item.orders" color="var(--chart-2)" :rounded-corners="true" /><VisAxis type="x" :tick-format="(index: number) => chartData[index]?.month ?? ''" /><VisAxis type="y" /></VisXYContainer></CardContent></Card>
      <Card><CardHeader><CardTitle>任务进度</CardTitle><CardDescription>本周团队执行情况</CardDescription></CardHeader><CardContent class="space-y-5"><div v-for="task in tasks.slice(0, 4)" :key="task.title" class="space-y-2"><div class="flex justify-between text-sm"><span>{{ task.title }}</span><span class="text-muted-foreground">{{ task.progress }}%</span></div><Progress :model-value="task.progress" /></div></CardContent></Card>
    </div>
    <Card><CardHeader><CardTitle>最近订单</CardTitle><CardDescription>最新的业务交易</CardDescription></CardHeader><CardContent><div class="w-full overflow-hidden"><Table class="table-fixed"><TableHeader><TableRow><TableHead class="w-24">订单</TableHead><TableHead>客户</TableHead><TableHead class="hidden sm:table-cell">日期</TableHead><TableHead>状态</TableHead><TableHead class="text-right">金额</TableHead><TableHead class="w-12" /></TableRow></TableHeader><TableBody><TableRow v-for="order in orders.slice(0, 5)" :key="order.id"><TableCell class="truncate font-medium">{{ order.id }}</TableCell><TableCell><div class="flex min-w-0 items-center gap-2"><Avatar class="size-8 shrink-0"><AvatarFallback>{{ order.customer.slice(0, 1) }}</AvatarFallback></Avatar><span class="truncate">{{ order.customer }}</span></div></TableCell><TableCell class="hidden truncate sm:table-cell">{{ order.date }}</TableCell><TableCell><StatusBadge :value="order.status" /></TableCell><TableCell class="text-right">¥{{ order.amount.toLocaleString() }}</TableCell><TableCell><DropdownMenu><DropdownMenuTrigger as-child><Button size="icon" variant="ghost" class="min-h-10 min-w-10"><Icon name="ellipsis-horizontal" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem @click="router.push('/orders')">查看</DropdownMenuItem><DropdownMenuItem @click="router.push('/orders')">编辑</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow></TableBody></Table></div></CardContent></Card>
    <Card><CardHeader><CardTitle>活动动态</CardTitle><CardDescription>团队最近发生的事情</CardDescription></CardHeader><CardContent><ScrollArea class="h-64 pr-4"><div class="space-y-5"><div v-for="(item, index) in activity" :key="`${item.user}-${index}`" class="flex gap-3"><Avatar class="size-8"><AvatarFallback>{{ item.user.slice(0, 1) }}</AvatarFallback></Avatar><div class="min-w-0 flex-1"><p class="text-sm"><span class="font-medium">{{ item.user }}</span> {{ item.action }}</p><p class="text-xs text-muted-foreground">{{ item.time }}</p></div></div></div></ScrollArea></CardContent></Card>
  </div>
</template>
