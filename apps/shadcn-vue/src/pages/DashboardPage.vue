<script setup lang="ts">
import { computed, ref } from 'vue'
import { VisArea, VisAxis, VisXYContainer } from '@unovis/vue'
import activity from '@ui-gallery/spec/mock/activity.json'
import orders from '@ui-gallery/spec/mock/orders.json'
import series from '@ui-gallery/spec/mock/series.json'
import stats from '@ui-gallery/spec/mock/stats.json'
import tasks from '@ui-gallery/spec/mock/tasks.json'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const chartData = computed(() => series.months.map((month, index) => ({
  month,
  index,
  revenue: series.revenue[index],
  orders: series.orders[index],
})))
const period = ref('overview')
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="仪表盘" description="欢迎回来，林晓。这里是今天的业务概况。" />
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card v-for="item in stats" :key="item.key">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between text-sm text-muted-foreground">
            <CardDescription>{{ item.label }}</CardDescription>
            <Badge :variant="item.delta > 0 ? 'default' : 'secondary'">{{ item.delta > 0 ? '+' : '' }}{{ item.delta }}%</Badge>
          </div>
          <CardTitle class="text-2xl">{{ item.unit === 'CNY' ? `¥${item.value.toLocaleString()}` : `${item.value}${item.unit ?? ''}` }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-12">
            <svg viewBox="0 0 120 32" class="h-full w-full text-primary" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                :points="item.trend.map((value, index) => `${(index / (item.trend.length - 1)) * 120},${32 - (value / Math.max(...item.trend)) * 28}`).join(' ')"
              />
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
    <div class="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <Card>
        <CardHeader><CardTitle>收入趋势</CardTitle><CardDescription>过去 7 个月的收入与订单</CardDescription></CardHeader>
        <CardContent class="h-72">
          <ChartContainer :config="{ revenue: { label: '收入', color: 'var(--chart-1)' }, orders: { label: '订单', color: 'var(--chart-2)' } }" class="h-full w-full">
            <VisXYContainer :data="chartData" class="h-full" :height="260">
              <VisArea :x="(item: any) => item.index" :y="(item: any) => item.revenue" color="var(--chart-1)" opacity="0.2" />
              <VisArea :x="(item: any) => item.index" :y="(item: any) => item.orders" color="var(--chart-2)" opacity="0.12" />
              <VisAxis type="x" />
              <VisAxis type="y" />
            </VisXYContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>任务进度</CardTitle><CardDescription>本周团队执行情况</CardDescription></CardHeader>
        <CardContent class="space-y-5">
          <div v-for="task in tasks.slice(0, 4)" :key="task.title" class="space-y-2">
            <div class="flex justify-between text-sm"><span>{{ task.title }}</span><span class="text-muted-foreground">{{ task.progress }}%</span></div>
            <Progress :model-value="task.progress" />
          </div>
        </CardContent>
      </Card>
    </div>
    <div class="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>最近订单</CardTitle><CardDescription>最新的业务交易</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>订单</TableHead><TableHead>客户</TableHead><TableHead>状态</TableHead><TableHead class="text-right">金额</TableHead></TableRow></TableHeader>
            <TableBody>
              <TableRow v-for="order in orders.slice(0, 5)" :key="order.id">
                <TableCell class="font-medium">{{ order.id }}</TableCell><TableCell>{{ order.customer }}</TableCell><TableCell><StatusBadge :value="order.status" /></TableCell><TableCell class="text-right">¥{{ order.amount.toLocaleString() }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>活动动态</CardTitle><CardDescription>团队最近发生的事情</CardDescription></CardHeader>
        <CardContent>
          <ScrollArea class="h-64 pr-4">
            <div class="space-y-5">
              <div v-for="(item, index) in activity" :key="`${item.user}-${index}`" class="flex gap-3">
                <Avatar class="size-8"><AvatarFallback>{{ item.user.slice(0, 1) }}</AvatarFallback></Avatar>
                <div class="min-w-0 flex-1"><p class="text-sm"><span class="font-medium">{{ item.user }}</span> {{ item.action }}</p><p class="text-xs text-muted-foreground">{{ item.time }}</p></div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
    <Tabs v-model="period">
      <TabsList><TabsTrigger value="overview">概览</TabsTrigger><TabsTrigger value="loading">加载状态</TabsTrigger></TabsList>
      <TabsContent value="overview"><Card><CardContent class="pt-6"><p class="text-sm text-muted-foreground">数据已从本地 mock JSON 加载。</p></CardContent></Card></TabsContent>
      <TabsContent value="loading"><Card><CardContent class="space-y-3 pt-6"><Skeleton class="h-4 w-1/3" /><Skeleton class="h-4 w-2/3" /><Skeleton class="h-4 w-1/2" /></CardContent></Card></TabsContent>
    </Tabs>
  </div>
</template>
