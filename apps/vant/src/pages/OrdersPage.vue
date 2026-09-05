<script setup lang="ts">
import { computed, ref } from "vue"
import { showConfirmDialog, showToast } from "vant"
import orders from "@ui-gallery/spec/mock/orders.json"
import AppIcon from "@/components/AppIcon.vue"

const query = ref("")
const status = ref("all")
const state = ref<"ready" | "loading" | "empty" | "error">("ready")
const selected = ref<(typeof orders)[number] | null>(null)
const calendar = ref(false)
const columns = ref(["customer", "status", "amount"])
const checked = ref<string[]>([])
const sortAsc = ref(false)
const page = ref(1)
const pageSize = ref(10)
const channels = ref<string[]>([])
const dateRange = ref<[Date, Date] | null>(null)
const sortKey = ref<"date" | "amount">("date")
const filtered = computed(() => {
  const rows = orders.filter((order) => `${order.id} ${order.customer}`.toLowerCase().includes(query.value.toLowerCase()) && (status.value === "all" || order.status === status.value))
  return [...rows].sort((a, b) => String(a[sortKey.value]).localeCompare(String(b[sortKey.value])) * (sortAsc.value ? 1 : -1)).slice(0, 10)
})
const selectAll = computed({ get: () => filtered.value.length > 0 && filtered.value.every((item) => checked.value.includes(item.id)), set: (value: boolean) => { checked.value = value ? filtered.value.map((item) => item.id) : [] } })
const remove = async (order: (typeof orders)[number]) => { await showConfirmDialog({ title: "删除订单", message: `${order.id} 将被删除` }); showToast("订单已删除") }
const sort = (key: "date" | "amount") => { if (sortKey.value === key) sortAsc.value = !sortAsc.value; else { sortKey.value = key; sortAsc.value = false } }
const dateText = computed(() => dateRange.value ? `${dateRange.value[0].toLocaleDateString()} - ${dateRange.value[1].toLocaleDateString()}` : "日期范围")
const confirmDate = ({ selectedValues }: { selectedValues: string[] }) => {
  const [start, end] = selectedValues.map((value) => new Date(value))
  if (start && end) dateRange.value = [start, end]
  calendar.value = false
}
</script>

<template>
  <div class="page">
    <div class="page-title"><div><h1>订单管理</h1><p>搜索、筛选并查看全部订单</p></div><van-button type="primary"><template #icon><AppIcon name="download" /></template>导出</van-button></div>
    <van-tabs v-model:active="state" type="card"><van-tab title="数据" name="ready" /><van-tab title="加载" name="loading" /><van-tab title="空状态" name="empty" /><van-tab title="错误" name="error" /></van-tabs>
    <van-notice-bar v-if="state === 'error'" type="danger" mode="closeable" text="数据加载失败" />
    <van-skeleton v-else-if="state === 'loading'" title :row="6" />
    <van-empty v-else-if="state === 'empty'" description="没有找到订单"><van-button type="primary" @click="state = 'ready'">重试</van-button></van-empty>
    <div v-else class="card order-card">
      <div class="toolbar"><van-search v-model="query" shape="round" placeholder="搜索订单号或客户" /><van-dropdown-menu><van-dropdown-item v-model="status" :options="[{ text: '全部状态', value: 'all' }, { text: '已支付', value: 'paid' }, { text: '待处理', value: 'pending' }, { text: '失败', value: 'failed' }]" /><van-dropdown-item title="渠道"><template #default><van-checkbox-group v-model="channels" class="column-menu"><van-checkbox name="web">Web</van-checkbox><van-checkbox name="api">API</van-checkbox><van-checkbox name="mobile">Mobile</van-checkbox></van-checkbox-group></template></van-dropdown-item></van-dropdown-menu><van-button plain @click="calendar = true"><AppIcon name="calendar" />{{ dateText }}</van-button><van-popover placement="bottom-end"><van-checkbox-group v-model="columns" class="column-menu"><van-checkbox name="customer">客户</van-checkbox><van-checkbox name="status">状态</van-checkbox><van-checkbox name="amount">金额</van-checkbox></van-checkbox-group><template #reference><van-button plain><AppIcon name="filter" />列</van-button></template></van-popover></div>
      <div class="table-wrap"><div class="data-table"><div class="data-row head"><van-checkbox v-model="selectAll" /><button type="button" @click="sort('date')">订单 / 日期</button><span v-if="columns.includes('customer')">客户</span><span v-if="columns.includes('status')">状态</span><button type="button" @click="sort('amount')">金额</button><span>操作</span></div><div v-for="order in filtered" :key="order.id" class="data-row" @click="selected = order"><van-checkbox v-model="checked" :name="order.id" @click.stop /><strong>{{ order.id }}<small>{{ order.date }}</small></strong><span v-if="columns.includes('customer')">{{ order.customer }}</span><van-tag v-if="columns.includes('status')" :type="order.status === 'paid' ? 'success' : order.status === 'failed' ? 'danger' : 'primary'">{{ order.status }}</van-tag><strong v-if="columns.includes('amount')" class="amount">¥{{ order.amount.toLocaleString() }}</strong><van-popover placement="left"><van-cell title="编辑" /><van-cell title="删除" @click="remove(order)" /><template #reference><van-button plain @click.stop><AppIcon name="more" /></van-button></template></van-popover></div></div></div>
      <div class="pagination-row"><van-pagination v-model="page" :page-count="Math.ceil(filtered.length / pageSize)" mode="simple" :total-items="orders.length" :items-per-page="pageSize" /><van-dropdown-menu><van-dropdown-item v-model="pageSize" :options="[{ text: '10 条/页', value: 10 }, { text: '20 条/页', value: 20 }, { text: '50 条/页', value: 50 }]" /></van-dropdown-menu><span class="muted">共 {{ filtered.length }} 条</span></div>
    </div>
    <van-popup v-model:show="calendar" position="bottom"><van-calendar type="range" @confirm="confirmDate" /></van-popup>
    <van-popup :show="selected !== null" position="right" :style="{ width: 'min(92%, 440px)', height: '100%' }" @click-overlay="selected = null"><template v-if="selected"><van-nav-bar :title="selected.id" left-arrow @click-left="selected = null" /><van-cell-group inset><van-cell title="客户" :value="selected.customer" /><van-cell title="产品" :value="selected.product" /><van-cell title="日期" :value="selected.date" /><van-cell title="金额" :value="`¥${selected.amount}`" /></van-cell-group><van-tabs><van-tab title="备注"><van-field type="textarea" rows="5" placeholder="备注" /></van-tab><van-tab title="活动"><van-empty description="暂无活动" /></van-tab></van-tabs></template></van-popup>
  </div>
</template>

<style scoped>
.toolbar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
.toolbar .van-search { flex: 1 1 240px; padding: 0; }
.column-menu { padding: 12px; display: grid; gap: 10px; }
.data-row small { display: block; color: var(--van-text-color-2); font-size: 12px; font-weight: 400; margin-top: 3px; }
.amount { text-align: right; }
.data-row > button { all: unset; cursor: pointer; }
.pagination-row { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
@media (max-width: 767px) { .order-card { padding: 12px; } }
</style>
