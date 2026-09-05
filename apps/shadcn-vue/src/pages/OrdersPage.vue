<script setup lang="ts">
import { computed, ref } from 'vue'
import { CalendarDate, type DateValue } from '@internationalized/date'
import { toast } from 'vue-sonner'
import orders from '@ui-gallery/spec/mock/orders.json'
import Icon from '@/components/Icon.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

type Order = typeof orders[number]
type SortKey = 'id' | 'date' | 'amount'
const query = ref('')
const status = ref('all')
const page = ref(1)
const pageSize = ref('5')
const selected = ref<Order | null>(null)
const state = ref<'ready' | 'loading' | 'error'>('ready')
const orderList = ref<Order[]>([...orders])
const deleting = ref<Order | null>(null)
const deletingId = ref<string | null>(null)
const selectedIds = ref<string[]>([])
const channels = ref<string[]>(['web', 'ios', 'android', 'api'])
const range = ref<{ start: DateValue; end: DateValue }>()
const sortKey = ref<SortKey>('date')
const sortDirection = ref<'asc' | 'desc'>('desc')
const showCustomer = ref(true)
const showDate = ref(true)
const showChannel = ref(true)
const note = ref('')

const filtered = computed(() => orderList.value.filter((item) => {
  const term = query.value.toLowerCase()
  const matchesQuery = !term || `${item.id} ${item.customer} ${item.email} ${item.product}`.toLowerCase().includes(term)
  const matchesStatus = status.value === 'all' || item.status === status.value
  const matchesChannel = channels.value.includes(item.channel)
  const matchesRange = !range.value || (item.date >= range.value.start.toString() && item.date <= range.value.end.toString())
  return matchesQuery && matchesStatus && matchesChannel && matchesRange
}).sort((a, b) => {
  const left = sortKey.value === 'amount' ? a.amount : a[sortKey.value]
  const right = sortKey.value === 'amount' ? b.amount : b[sortKey.value]
  return (left < right ? -1 : left > right ? 1 : 0) * (sortDirection.value === 'asc' ? 1 : -1)
}))
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / Number(pageSize.value))))
const visibleOrders = computed(() => filtered.value.slice((page.value - 1) * Number(pageSize.value), page.value * Number(pageSize.value)))
const allVisibleSelected = computed(() => visibleOrders.value.length > 0 && visibleOrders.value.every((order) => selectedIds.value.includes(order.id)))
const someVisibleSelected = computed(() => visibleOrders.value.some((order) => selectedIds.value.includes(order.id)) && !allVisibleSelected.value)
const rangeLabel = computed(() => range.value ? `${range.value.start.toString()} – ${range.value.end.toString()}` : '日期范围')

function toggleSort(key: SortKey) {
  if (sortKey.value === key) sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = key; sortDirection.value = 'asc' }
}
function toggleAll(value: boolean | 'indeterminate') {
  if (value === true) selectedIds.value = [...new Set([...selectedIds.value, ...visibleOrders.value.map((order) => order.id)])]
  else selectedIds.value = selectedIds.value.filter((id) => !visibleOrders.value.some((order) => order.id === id))
}
function toggleOrder(id: string, value: boolean | 'indeterminate') {
  selectedIds.value = value === true ? [...new Set([...selectedIds.value, id])] : selectedIds.value.filter((item) => item !== id)
}
function toggleChannel(channel: string, value: boolean | 'indeterminate') {
  channels.value = value === true ? [...new Set([...channels.value, channel])] : channels.value.filter((item) => item !== channel)
}
function iconFor(key: SortKey) {
  return sortKey.value !== key ? 'chevrons-up-down' : sortDirection.value === 'asc' ? 'arrow-up' : 'arrow-down'
}
function requestDelete(order: Order) {
  deleting.value = order
  deletingId.value = order.id
}
function remove() {
  if (!deletingId.value) return
  orderList.value = orderList.value.filter((order) => order.id !== deletingId.value)
  toast.success('订单已删除')
  deleting.value = null
  deletingId.value = null
  selected.value = null
}
function refresh() {
  state.value = 'loading'
  window.setTimeout(() => { state.value = 'ready' }, 900)
}
function clearFilters() {
  query.value = ''
  status.value = 'all'
  channels.value = ['web', 'ios', 'android', 'api']
  range.value = undefined
  resetPage()
}
function saveNote() {
  toast.success('备注已保存')
}
function resetPage() {
  page.value = 1
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="订单管理" description="搜索、筛选并查看全部订单。" />
    <Alert><Icon name="info" /><AlertTitle>本地数据集</AlertTitle><AlertDescription>所有订单来自 mock/orders.json，无运行时网络请求。</AlertDescription></Alert>
    <Card>
      <CardHeader class="gap-4"><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><CardTitle>订单列表</CardTitle><div class="flex flex-wrap gap-2"><Button variant="outline" class="min-h-10" @click="refresh"><Icon name="refresh" />刷新</Button><DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline" class="min-h-10">演示状态</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem @click="state = 'ready'">正常</DropdownMenuItem><DropdownMenuItem @click="state = 'loading'">加载中</DropdownMenuItem><DropdownMenuItem @click="state = 'error'">加载失败</DropdownMenuItem></DropdownMenuContent></DropdownMenu><Button variant="outline" class="min-h-10" @click="toast.success('导出任务已创建')"><Icon name="download" />导出</Button></div></div></CardHeader>
      <CardContent class="space-y-4">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_160px_180px_auto_auto]">
          <Input v-model="query" class="min-h-10" placeholder="搜索订单号、客户..." @update:model-value="resetPage" />
          <Select v-model="status" @update:model-value="resetPage"><SelectTrigger class="min-h-10"><SelectValue placeholder="状态" /></SelectTrigger><SelectContent><SelectItem value="all">全部状态</SelectItem><SelectItem value="paid">paid</SelectItem><SelectItem value="pending">pending</SelectItem><SelectItem value="shipped">shipped</SelectItem><SelectItem value="failed">failed</SelectItem><SelectItem value="refunded">refunded</SelectItem></SelectContent></Select>
          <Popover><PopoverTrigger as-child><Button variant="outline" class="min-h-10 justify-start font-normal"><Icon name="calendar" />{{ rangeLabel }}</Button></PopoverTrigger><PopoverContent class="w-auto p-0"><RangeCalendar v-model="range" :placeholder="new CalendarDate(2026, 9, 1)" /></PopoverContent></Popover>
          <DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline" class="min-h-10"><Icon name="filter" />渠道</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuLabel>渠道筛选</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuCheckboxItem v-for="channel in ['web', 'ios', 'android', 'api']" :key="channel" :model-value="channels.includes(channel)" @update:model-value="toggleChannel(channel, $event)">{{ channel }}</DropdownMenuCheckboxItem></DropdownMenuContent></DropdownMenu>
          <DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline" class="min-h-10"><Icon name="sliders" />列</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuLabel>显示列</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuCheckboxItem v-model="showCustomer">客户</DropdownMenuCheckboxItem><DropdownMenuCheckboxItem v-model="showDate">日期</DropdownMenuCheckboxItem><DropdownMenuCheckboxItem v-model="showChannel">渠道</DropdownMenuCheckboxItem></DropdownMenuContent></DropdownMenu>
        </div>
        <Alert v-if="state === 'error'" variant="destructive" class="mb-4"><Icon name="alert-circle" /><AlertTitle>加载失败</AlertTitle><AlertDescription>订单数据暂时无法加载。<Button variant="link" class="min-h-10 px-1" @click="refresh">重试</Button></AlertDescription></Alert>
        <div v-if="state === 'loading'" class="space-y-3"><Skeleton v-for="n in 5" :key="n" class="h-12" /></div>
        <div v-else-if="!filtered.length" class="grid place-items-center gap-3 py-16 text-center"><Icon name="archive" :size="32" class="text-muted-foreground" /><p class="font-medium">暂无订单</p><Button class="min-h-10" @click="clearFilters">清除筛选</Button></div>
        <template v-else>
          <div v-if="filtered.length" class="hidden overflow-x-auto md:block">
            <Table><TableHeader><TableRow><TableHead class="w-10"><Checkbox :model-value="someVisibleSelected ? 'indeterminate' : allVisibleSelected" aria-label="全选订单" @update:model-value="toggleAll" /></TableHead><TableHead><button class="inline-flex min-h-10 items-center gap-1" @click="toggleSort('id')">订单号<Icon :name="iconFor('id')" :size="14" /></button></TableHead><TableHead v-if="showCustomer">客户</TableHead><TableHead>状态</TableHead><TableHead v-if="showDate"><button class="inline-flex min-h-10 items-center gap-1" @click="toggleSort('date')">日期<Icon :name="iconFor('date')" :size="14" /></button></TableHead><TableHead v-if="showChannel">渠道</TableHead><TableHead class="text-right"><button class="ml-auto inline-flex min-h-10 items-center gap-1" @click="toggleSort('amount')">金额<Icon :name="iconFor('amount')" :size="14" /></button></TableHead><TableHead class="text-right">操作</TableHead></TableRow></TableHeader><TableBody><TableRow v-for="order in visibleOrders" :key="order.id" class="cursor-pointer" @click="selected = order"><TableCell @click.stop><Checkbox :model-value="selectedIds.includes(order.id)" :aria-label="`选择 ${order.id}`" @update:model-value="(value) => toggleOrder(order.id, value)" /></TableCell><TableCell class="font-medium">{{ order.id }}</TableCell><TableCell v-if="showCustomer">{{ order.customer }}</TableCell><TableCell><StatusBadge :value="order.status" /></TableCell><TableCell v-if="showDate">{{ order.date }}</TableCell><TableCell v-if="showChannel">{{ order.channel }}</TableCell><TableCell class="text-right">¥{{ order.amount.toLocaleString() }}</TableCell><TableCell class="text-right" @click.stop><DropdownMenu><DropdownMenuTrigger as-child><Button size="icon" variant="ghost" class="min-h-10 min-w-10"><Icon name="ellipsis-horizontal" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem @click="selected = order">编辑</DropdownMenuItem><DropdownMenuItem @click="requestDelete(order)">删除</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow></TableBody></Table>
          </div>
          <div v-if="filtered.length" class="grid gap-3 md:hidden"><Card v-for="order in visibleOrders" :key="order.id" class="cursor-pointer" @click="selected = order"><CardHeader class="flex-row items-center justify-between space-y-0"><CardTitle class="text-base">{{ order.id }}</CardTitle><StatusBadge :value="order.status" /></CardHeader><CardContent class="space-y-2 text-sm"><div class="flex justify-between text-muted-foreground"><span>{{ order.customer }}</span><span>¥{{ order.amount.toLocaleString() }}</span></div><div class="flex items-center justify-between"><span>{{ order.date }} · {{ order.channel }}</span><Button variant="outline" class="min-h-10" @click.stop="selected = order">详情</Button></div></CardContent></Card>)</div>
          <p v-if="!filtered.length" class="py-12 text-center text-sm text-muted-foreground">没有匹配的订单</p>
        </template>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span class="text-sm text-muted-foreground">显示 {{ visibleOrders.length }} / {{ filtered.length }} 条</span><div class="flex items-center gap-3"><Select v-model="pageSize" @update:model-value="resetPage"><SelectTrigger class="min-h-10 w-24"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="5">5 条</SelectItem><SelectItem value="10">10 条</SelectItem><SelectItem value="20">20 条</SelectItem></SelectContent></Select><Pagination v-model:page="page" :total="filtered.length" :items-per-page="Number(pageSize)"><PaginationContent v-slot="{ items }"><PaginationPrevious class="min-h-10" /><template v-for="item in items" :key="item.type === 'page' ? item.value : item.type"><PaginationItem v-if="item.type === 'page'" :value="item.value"><PaginationLink class="min-h-10 min-w-10" :is-active="item.value === page">{{ item.value }}</PaginationLink></PaginationItem></template><PaginationNext class="min-h-10" /></PaginationContent></Pagination></div></div>
      </CardContent>
    </Card>
    <Sheet :open="!!selected" @update:open="(value) => !value && (selected = null)"><SheetContent><SheetHeader><SheetTitle>{{ selected?.id ?? '订单详情' }}</SheetTitle><SheetDescription>查看订单的完整信息与操作。</SheetDescription></SheetHeader><div v-if="selected" class="space-y-5 overflow-y-auto p-4"><Tabs default-value="details"><TabsList class="w-full"><TabsTrigger value="details" class="flex-1">详情</TabsTrigger><TabsTrigger value="timeline" class="flex-1">时间线</TabsTrigger><TabsTrigger value="notes" class="flex-1">备注</TabsTrigger></TabsList><TabsContent value="details" class="space-y-3 text-sm"><div v-for="item in [{ label: '客户', value: selected.customer }, { label: '邮箱', value: selected.email }, { label: '商品', value: selected.product }, { label: '渠道', value: selected.channel }, { label: '状态', value: selected.status }, { label: '日期', value: selected.date }, { label: '金额', value: `¥${selected.amount.toLocaleString()}` }]" :key="item.label" class="flex justify-between gap-4"><span class="text-muted-foreground">{{ item.label }}</span><span class="text-right">{{ item.value }}</span></div></TabsContent><TabsContent value="timeline" class="space-y-4"><div v-for="step in ['创建', '支付', selected.status === 'refunded' ? '退款' : '发货']" :key="step" class="flex items-center gap-3"><span class="grid size-7 place-items-center rounded-full bg-muted"><Icon name="check" :size="14" /></span><span>{{ step }}</span></div></TabsContent><TabsContent value="notes" class="space-y-3"><Textarea v-model="note" placeholder="添加备注..." /><Button class="min-h-10" @click="saveNote">保存</Button></TabsContent></Tabs><Button variant="destructive" class="min-h-10 w-full" @click="requestDelete(selected)"><Icon name="trash" />删除订单</Button></div></SheetContent></Sheet>
    <AlertDialog :open="!!deleting" @update:open="(value) => !value && (deleting = null)"><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>删除订单</AlertDialogTitle><AlertDialogDescription>确定删除订单 {{ deleting?.id }} 吗？此操作无法撤销。</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction @click="remove">确认删除</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>
</template>
