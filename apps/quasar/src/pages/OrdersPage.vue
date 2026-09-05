<script setup lang="ts">
import { computed, ref } from "vue"
import { useQuasar } from "quasar"
import orders from "@ui-gallery/spec/mock/orders.json"
import AppIcon from "../icons/AppIcon.vue"
import PageHeader from "../components/PageHeader.vue"
import { statusColors } from "./shared"

type Order = (typeof orders)[number]
const $q = useQuasar()
const query = ref("")
const status = ref("all")
const channels = ref<string[]>([])
const dateRange = ref<{ from: string; to: string } | null>(null)
const dateLabel = computed(() => dateRange.value ? `${dateRange.value.from} - ${dateRange.value.to}` : "")
const selected = ref<Order | null>(null)
const deleting = ref(false)
const notes = ref("")
const state = new URLSearchParams(window.location.search).get("state") ?? ""
const loading = ref(state === "loading")
const error = ref(state === "error")
const visible = ref({ id: true, customer: true, status: true, date: true, amount: true, channel: true })
const pagination = ref({ page: 1, rowsPerPage: 10 })
const channelOptions = ["web", "ios", "android", "api"]
const filtered = computed(() => orders.filter((order) =>
  (!query.value || `${order.id} ${order.customer} ${order.product}`.toLowerCase().includes(query.value.toLowerCase())) &&
  (status.value === "all" || order.status === status.value) &&
  (!channels.value.length || channels.value.includes(order.channel)),
))
const columns = computed(() => [
  { name: "id", label: "订单号", field: "id", sortable: true, align: "left" as const, required: true },
  { name: "customer", label: "客户", field: "customer", sortable: true, align: "left" as const },
  { name: "status", label: "状态", field: "status", sortable: true, align: "left" as const },
  { name: "date", label: "日期", field: "date", sortable: true, align: "left" as const },
  { name: "amount", label: "金额", field: "amount", sortable: true, align: "right" as const },
  { name: "channel", label: "渠道", field: "channel", sortable: true, align: "left" as const },
  { name: "actions", label: "", field: "actions", align: "right" as const },
].filter((column) => column.name === "actions" || visible.value[column.name as keyof typeof visible.value]))

function clearFilters() {
  query.value = ""
  status.value = "all"
  channels.value = []
  dateRange.value = null
}

function choose(order: Order) {
  selected.value = order
  notes.value = ""
}

function confirmDelete(order: Order) {
  selected.value = order
  deleting.value = true
}

function remove() {
  deleting.value = false
  selected.value = null
  $q.notify({ type: "positive", message: "订单已删除" })
}

function retry() {
  error.value = false
  loading.value = false
}
</script>

<template>
  <div class="q-gutter-y-lg">
    <PageHeader title="订单管理" description="搜索、筛选并查看全部订单。">
      <template #action><q-btn outline color="primary"><AppIcon name="download" :size="18" class="q-mr-sm" />导出</q-btn></template>
    </PageHeader>
    <q-card bordered>
      <q-card-section class="q-gutter-y-md">
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-sm-4"><q-input v-model="query" dense outlined placeholder="搜索订单号、客户或产品"><template #prepend><AppIcon name="search" :size="16" /></template></q-input></div>
          <div class="col-6 col-sm-2"><q-select v-model="status" dense outlined emit-value map-options :options="[{ label: '全部状态', value: 'all' }, ...Object.keys(statusColors).map((value) => ({ label: value, value }))]" label="状态" /></div>
          <div class="col-6 col-sm-2"><q-input :model-value="dateLabel" dense outlined label="日期范围" readonly><template #append><AppIcon name="calendar" :size="18" /></template><q-popup-proxy cover transition-show="scale" transition-hide="scale"><q-date v-model="dateRange" range><div class="row items-center justify-end q-gutter-sm"><q-btn v-close-popup flat color="primary" label="确定" /></div></q-date></q-popup-proxy></q-input></div>
          <div class="col-12 col-sm-2"><q-select v-model="channels" dense outlined multiple use-chips :options="channelOptions" label="渠道" /></div>
          <div class="col-auto"><q-btn outline round dense><AppIcon name="sliders" /><q-menu><q-list style="min-width: 180px"><q-item-label header>显示列</q-item-label><q-item v-for="column in columns.filter((item) => item.name !== 'actions' && item.name !== 'id')" :key="column.name"><q-item-section>{{ column.label }}</q-item-section><q-item-section side><q-toggle v-model="visible[column.name as keyof typeof visible]" /></q-item-section></q-item></q-list></q-menu></q-btn></div>
        </div>
        <q-banner v-if="error" class="bg-negative text-white rounded-borders"><template #avatar><AppIcon name="alert-triangle" /></template>订单加载失败，请重试。<template #action><q-btn flat color="white" label="重试" @click="retry" /></template></q-banner>
        <div v-if="!loading && !error && !filtered.length" class="column items-center q-pa-xl text-center">
          <AppIcon name="inbox" :size="48" class="text-grey-6" /><div class="text-h6 q-mt-md">没有找到订单</div><div class="text-body2 text-grey-7 q-mt-sm">调整搜索或筛选条件后重试。</div><q-btn outline color="primary" label="清除筛选" class="q-mt-md" @click="clearFilters" />
        </div>
        <div v-else class="table-scroll">
          <q-table
            v-model:pagination="pagination"
            selection="multiple"
            row-key="id"
            :rows="filtered"
            :columns="columns"
            :loading="loading"
            :grid="$q.screen.lt.sm"
            binary-state-sort
            @row-click="(_, row) => choose(row)"
          >
            <template #loading><q-inner-loading showing><q-spinner color="primary" size="40px" /></q-inner-loading></template>
            <template #item="slot">
              <q-card flat bordered class="q-ma-xs full-width" @click="choose(slot.row)">
                <q-card-section class="row items-center justify-between"><div class="text-weight-medium">{{ slot.row.id }}</div><q-chip dense :color="statusColors[slot.row.status] ?? 'grey'" text-color="white">{{ slot.row.status }}</q-chip></q-card-section>
                <q-card-section class="row justify-between text-body2 text-grey-7"><span>{{ slot.row.customer }}</span><span>¥{{ slot.row.amount.toLocaleString() }}</span></q-card-section>
              </q-card>
            </template>
            <template #body-cell-status="slot"><q-td :props="slot"><q-chip dense :color="statusColors[slot.value] ?? 'grey'" text-color="white">{{ slot.value }}</q-chip></q-td></template>
            <template #body-cell-amount="slot"><q-td :props="slot">¥{{ Number(slot.value).toLocaleString() }}</q-td></template>
            <template #body-cell-actions="slot"><q-td :props="slot"><q-btn flat round dense @click.stop><AppIcon name="more-horizontal" /><q-menu><q-list><q-item clickable v-close-popup @click="choose(slot.row)"><q-item-section avatar><AppIcon name="edit" /></q-item-section><q-item-section>编辑</q-item-section></q-item><q-item clickable v-close-popup @click="confirmDelete(slot.row)"><q-item-section avatar><AppIcon name="trash" /></q-item-section><q-item-section>删除</q-item-section></q-item></q-list></q-menu></q-btn></q-td></template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>

    <q-drawer :model-value="!!selected" side="right" bordered overlay :width="360" @update:model-value="(open) => { if (!open) selected = null }">
      <div v-if="selected" class="q-pa-md">
        <div class="row items-center justify-between"><div class="text-h6">{{ selected.id }}</div><q-btn flat round dense @click="selected = null"><AppIcon name="x" /></q-btn></div>
        <q-list separator class="q-mt-md">
          <q-item><q-item-section><q-item-label caption>客户</q-item-label><q-item-label>{{ selected.customer }}</q-item-label></q-item-section></q-item>
          <q-item><q-item-section><q-item-label caption>邮箱</q-item-label><q-item-label>{{ selected.email }}</q-item-label></q-item-section></q-item>
          <q-item><q-item-section><q-item-label caption>产品</q-item-label><q-item-label>{{ selected.product }}</q-item-label></q-item-section></q-item>
          <q-item><q-item-section><q-item-label caption>金额</q-item-label><q-item-label>¥{{ selected.amount.toLocaleString() }}</q-item-label></q-item-section></q-item>
          <q-item><q-item-section><q-item-label caption>日期</q-item-label><q-item-label>{{ selected.date }}</q-item-label></q-item-section></q-item>
        </q-list>
        <q-tabs v-model="notes" dense class="q-mt-lg"><q-tab name="" label="详情" /><q-tab name="notes" label="备注" /></q-tabs>
        <q-input v-if="notes === 'notes'" v-model="notes" type="textarea" outlined label="备注" class="q-mt-md" />
        <q-btn color="negative" outline class="full-width q-mt-lg" label="删除订单" @click="deleting = true" />
      </div>
    </q-drawer>
    <q-dialog v-model="deleting"><q-card><q-card-section class="text-h6">确认删除订单？</q-card-section><q-card-section>此操作无法撤销。</q-card-section><q-card-actions align="right"><q-btn flat label="取消" v-close-popup /><q-btn color="negative" label="确认删除" @click="remove" /></q-card-actions></q-card></q-dialog>
  </div>
</template>
