<script setup lang="ts">
import { computed, ref } from "vue"
import Button from "primevue/button"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Drawer from "primevue/drawer"
import IconField from "primevue/iconfield"
import InputIcon from "primevue/inputicon"
import InputText from "primevue/inputtext"
import Menu from "primevue/menu"
import Message from "primevue/message"
import MultiSelect from "primevue/multiselect"
import DatePicker from "primevue/datepicker"
import Select from "primevue/select"
import SelectButton from "primevue/selectbutton"
import Skeleton from "primevue/skeleton"
import Tabs from "primevue/tabs"
import TabList from "primevue/tablist"
import Tab from "primevue/tab"
import TabPanels from "primevue/tabpanels"
import TabPanel from "primevue/tabpanel"
import Textarea from "primevue/textarea"
import Avatar from "primevue/avatar"
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import PageHeader from "@/components/PageHeader.vue"
import SectionCard from "@/components/SectionCard.vue"
import StatusTag from "@/components/StatusTag.vue"
import orders from "@ui-gallery/spec/mock/orders.json"

const confirm = useConfirm()
const toast = useToast()
const search = ref("")
const status = ref<string | null>(null)
const channels = ref<string[]>([])
const dateRange = ref<Date[] | null>(null)
const visibleColumns = ref(["id", "customer", "product", "status", "amount", "date"])
type Order = (typeof orders)[number]
type PopupApi = { toggle: (event: Event) => void }
const selected = ref<Order[]>([])
const selectedOrder = ref<Order | null>(null)
const drawerVisible = ref(false)
const note = ref("")
const menu = ref<PopupApi | null>(null)
const demoState = ref("normal")
const loading = ref(false)
const statuses = [...new Set(orders.map((order) => order.status))]
const channelOptions = [...new Set(orders.map((order) => order.channel))].map((value) => ({ label: value, value }))
const columns = [
  { field: "id", header: "订单号" }, { field: "customer", header: "客户" }, { field: "product", header: "商品" },
  { field: "status", header: "状态" }, { field: "amount", header: "金额" }, { field: "date", header: "日期" },
]
const menuItems = [
  { label: "编辑", icon: "pi pi-pencil" },
  { label: "删除", icon: "pi pi-trash", command: () => askDelete(selectedOrder.value) },
]
const filteredOrders = computed(() => orders.filter((order) => {
  const query = search.value.trim().toLowerCase()
  const matchesQuery = !query || [order.id, order.customer, order.email, order.product].some((value) => value.toLowerCase().includes(query))
  return matchesQuery && (!status.value || order.status === status.value) && (!channels.value.length || channels.value.includes(order.channel))
}))
const showingColumns = computed(() => columns.filter((column) => visibleColumns.value.includes(column.field)))

function openOrder(order: Order) { selectedOrder.value = order; drawerVisible.value = true; note.value = ""; }
function askDelete(order: Order | null) {
  if (!order) return
  confirm.require({ message: `确认删除订单 ${order.id}？`, header: "删除订单", icon: "pi pi-exclamation-triangle", acceptLabel: "删除", rejectLabel: "取消", accept: () => toast.add({ severity: "success", summary: "已删除", detail: order.id, life: 2400 }) })
}
function exportOrders() { toast.add({ severity: "info", summary: "导出已准备", detail: `${filteredOrders.value.length} 条订单`, life: 2400 }) }
function retry() { demoState.value = "normal"; loading.value = false }
</script>

<template>
  <div class="page">
    <PageHeader title="订单" description="管理订单、支付状态与渠道数据">
      <SelectButton v-model="demoState" :options="[{ label: '正常', value: 'normal' }, { label: '加载', value: 'loading' }, { label: '空', value: 'empty' }, { label: '错误', value: 'error' }]" option-label="label" option-value="value" />
    </PageHeader>
    <SectionCard>
      <div class="toolbar">
        <IconField class="grow"><InputIcon class="pi pi-search" /><InputText v-model="search" placeholder="搜索订单、客户或商品" fluid /></IconField>
        <Select v-model="status" :options="statuses" placeholder="全部状态" show-clear class="filter-control" />
        <DatePicker v-model="dateRange" selection-mode="range" date-format="yy-mm-dd" placeholder="日期范围" show-icon class="filter-control" />
        <MultiSelect v-model="channels" :options="channelOptions" option-label="label" option-value="value" placeholder="渠道" display="chip" :max-selected-labels="1" selected-items-label="已选 {0} 项" class="filter-control" />
        <Button label="导出" icon="pi pi-download" severity="secondary" outlined @click="exportOrders" />
        <MultiSelect v-model="visibleColumns" :options="columns" option-label="header" option-value="field" placeholder="列显示" display="chip" :max-selected-labels="1" selected-items-label="已选 {0} 项" class="filter-control" />
      </div>
    </SectionCard>
    <SectionCard title="订单列表" flush>
      <div v-if="demoState === 'loading'" class="col gap-3 p-4"><Skeleton v-for="n in 8" :key="n" height="2.75rem" /></div>
      <div v-else-if="demoState === 'empty'" class="empty-state"><i class="pi pi-inbox" style="font-size: 2rem" /><div>没有找到订单</div><Button label="清除筛选" size="small" outlined @click="search = ''; status = null; channels = []" /></div>
      <Message v-else-if="demoState === 'error'" severity="error" class="m-4">订单加载失败，请稍后重试 <Button label="重试" text size="small" @click="retry" /></Message>
      <div v-else class="table-scroll">
        <DataTable v-model:selection="selected" :value="filteredOrders" data-key="id" selection-mode="multiple" :meta-key-selection="false" paginator :rows="10" :rows-per-page-options="[10, 20, 50]" sort-mode="multiple" striped-rows removable-sort @row-click="openOrder($event.data)">
          <Column selection-mode="multiple" header-style="width: 3rem" />
          <Column v-for="column in showingColumns" :key="column.field" :field="column.field" :header="column.header" sortable>
            <template v-if="column.field === 'customer'" #body="{ data }"><div class="flex items-center gap-2"><Avatar :label="data.customer.slice(0, 1)" shape="circle" size="small" /><div class="min-w-0"><div>{{ data.customer }}</div><div class="text-xs muted truncate">{{ data.email }}</div></div></div></template>
            <template v-else-if="column.field === 'status'" #body="{ data }"><StatusTag :status="data.status" /></template>
            <template v-else-if="column.field === 'amount'" #body="{ data }"><span class="tabular">¥{{ data.amount.toLocaleString() }}</span></template>
          </Column>
          <Column header="" style="width: 3rem"><template #body="{ data }"><Button icon="pi pi-ellipsis-v" text rounded severity="secondary" aria-label="订单操作" @click.stop="selectedOrder = data; menu?.toggle($event)" /></template></Column>
        </DataTable>
        <Menu ref="menu" :model="menuItems" popup />
      </div>
    </SectionCard>

    <Drawer v-model:visible="drawerVisible" position="right" header="订单详情" class="order-drawer" :style="{ width: 'min(100vw, 480px)' }" :modal="true">
      <template v-if="selectedOrder">
        <dl class="details-list"><div><dt>订单号</dt><dd class="mono">{{ selectedOrder.id }}</dd></div><div><dt>客户</dt><dd>{{ selectedOrder.customer }}</dd></div><div><dt>邮箱</dt><dd>{{ selectedOrder.email }}</dd></div><div><dt>商品</dt><dd>{{ selectedOrder.product }}</dd></div><div><dt>金额</dt><dd class="tabular">¥{{ selectedOrder.amount.toLocaleString() }}</dd></div><div><dt>状态</dt><dd><StatusTag :status="selectedOrder.status" /></dd></div></dl>
        <Tabs value="0" class="mt-6"><TabList><Tab value="0">详情</Tab><Tab value="1">物流</Tab><Tab value="2">备注</Tab></TabList><TabPanels><TabPanel value="0"><p class="muted text-sm">订单来自 {{ selectedOrder.channel }} 渠道，创建于 {{ selectedOrder.date }}。</p></TabPanel><TabPanel value="1"><div class="empty-state p-3"><i class="pi pi-truck" /><span class="text-sm muted">物流信息将在发货后更新</span></div></TabPanel><TabPanel value="2"><Textarea v-model="note" rows="5" fluid placeholder="添加订单备注" /></TabPanel></TabPanels></Tabs>
        <div class="flex justify-end gap-2 mt-6"><Button label="删除订单" severity="danger" outlined @click="askDelete(selectedOrder)" /><Button label="编辑订单" @click="toast.add({ severity: 'info', summary: '编辑模式', life: 1800 })" /></div>
      </template>
    </Drawer>
  </div>
</template>

<style scoped>
.toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
.filter-control { min-width: 150px; max-width: 240px; }
.details-list { display: grid; grid-template-columns: 1fr; gap: 14px; margin: 0; }
.details-list > div { display: grid; grid-template-columns: 72px 1fr; gap: 10px; }
dt { color: var(--p-text-muted-color); } dd { margin: 0; overflow-wrap: anywhere; }
@media (max-width: 767px) { .filter-control { max-width: none; width: 100%; } .toolbar > .grow { flex-basis: 100%; } }
</style>
