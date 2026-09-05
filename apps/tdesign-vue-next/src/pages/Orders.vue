<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { MessagePlugin, type DateRangeValue, type DropdownProps, type PrimaryTableCol, type TableRowData } from "tdesign-vue-next"
import allOrders from "@ui-gallery/spec/mock/orders.json"
import Icon from "@/components/Icon.vue"
import { initials, money, statusLabel, statusTheme, useIsMobile } from "@/pages/shared"

type Order = (typeof allOrders)[number]
type DropdownOption = Parameters<NonNullable<DropdownProps["onClick"]>>[0]
const route = useRoute()
const isMobile = useIsMobile()
const state = ref<"loading" | "empty" | "error" | "ready">((route.query.state as "loading" | "empty" | "error") ?? "loading")
const orders = ref<Order[]>([])
onMounted(() => {
  if (state.value === "loading") {
    orders.value = allOrders
    state.value = "ready"
  }
})
function retry() {
  state.value = "loading"
  setTimeout(() => {
    orders.value = allOrders
    state.value = "ready"
  }, 700)
}

const keyword = ref("")
const status = ref<string[]>([])
const channels = ref<string[]>([])
const range = ref<DateRangeValue>([])
const sort = ref<{ sortBy: string; descending: boolean } | undefined>()
const selected = ref<(string | number)[]>([])
const page = ref(1)
const pageSize = ref(10)
const visibleCols = ref(["customer", "product", "status", "amount", "date", "channel"])

const statusOptions = Object.entries(statusLabel).filter(([k]) => allOrders.some((o) => o.status === k)).map(([value, label]) => ({ value, label }))
const channelOptions = ["web", "ios", "android", "api"].map((c) => ({ value: c, label: c.toUpperCase() }))

const filtered = computed(() => {
  let list = orders.value.filter((o) => {
    const kw = keyword.value.trim().toLowerCase()
    if (kw && !`${o.id} ${o.customer} ${o.email} ${o.product}`.toLowerCase().includes(kw)) return false
    if (status.value.length && !status.value.includes(o.status)) return false
    if (channels.value.length && !channels.value.includes(o.channel)) return false
    const [from, to] = range.value as string[]
    if (from && o.date < from) return false
    if (to && o.date > to) return false
    return true
  })
  if (sort.value) {
    const { sortBy, descending } = sort.value
    list = [...list].sort((a, b) => {
      const av = a[sortBy as keyof Order] as string | number
      const bv = b[sortBy as keyof Order] as string | number
      return (av > bv ? 1 : av < bv ? -1 : 0) * (descending ? -1 : 1)
    })
  }
  return list
})
const paged = computed(() => filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))

const allColumns: PrimaryTableCol<TableRowData>[] = [
  { colKey: "row-select", type: "multiple", width: 48, fixed: "left" },
  { colKey: "id", title: "订单号", width: 120, sorter: true },
  { colKey: "customer", title: "客户", width: 220 },
  { colKey: "product", title: "商品", width: 130 },
  { colKey: "status", title: "状态", width: 110 },
  { colKey: "amount", title: "金额", align: "right", width: 140, sorter: true },
  { colKey: "date", title: "日期", width: 130, sorter: true },
  { colKey: "channel", title: "渠道", width: 100 },
  { colKey: "op", title: "操作", width: 120, fixed: "right" },
]
const columns = computed(() =>
  allColumns
    .filter((c) => ["row-select", "id", "op"].includes(c.colKey!) || visibleCols.value.includes(c.colKey!))
    .map((c) => (isMobile.value ? { ...c, fixed: undefined } : c)),
)
const columnOptions = allColumns.filter((c) => !["row-select", "id", "op"].includes(c.colKey!)).map((c) => ({ value: c.colKey!, label: String(c.title) }))

const detail = ref<Order | null>(null)
const detailTab = ref("info")
const note = ref("")
const deleting = ref<Order | null>(null)
function confirmDelete() {
  if (!deleting.value) return
  orders.value = orders.value.filter((o) => o.id !== deleting.value!.id)
  MessagePlugin.success(`订单 ${deleting.value.id} 已删除`)
  deleting.value = null
}
function onRowMenu(o: DropdownOption, row: Order) {
  if (o && typeof o === "object" && o.value === "delete") deleting.value = row
  else detail.value = row
}
function exportCsv() {
  MessagePlugin.success(`已导出 ${filtered.value.length} 条订单`)
}
</script>

<template>
  <div class="ug-page">
    <div class="ug-between">
      <div><t-typography-title level="h4" class="ug-title">订单</t-typography-title><span class="ug-muted">共 {{ filtered.length }} 条，已选 {{ selected.length }} 条。</span></div>
      <t-space size="small">
        <t-button variant="outline" size="large" @click="exportCsv"><template #icon><Icon name="download" /></template>导出</t-button>
        <t-button theme="primary" size="large"><template #icon><Icon name="plus" /></template>新建订单</t-button>
      </t-space>
    </div>

    <t-card :bordered="true">
      <div class="ug-toolbar">
        <t-input v-model="keyword" placeholder="搜索订单号 / 客户 / 邮箱" clearable class="ug-tb-search"><template #prefix-icon><Icon name="search" /></template></t-input>
        <t-select v-model="status" :options="statusOptions" placeholder="状态" multiple clearable class="ug-tb-item" :min-collapsed-num="1" />
        <t-date-range-picker v-model="range" clearable placeholder="日期范围" class="ug-tb-item" />
        <t-select v-model="channels" :options="channelOptions" placeholder="渠道（多选）" multiple clearable class="ug-tb-item" :min-collapsed-num="2" />
        <t-popup trigger="click" placement="bottom-right">
          <t-button variant="outline" size="large"><template #icon><Icon name="filter" /></template>列设置</t-button>
          <template #content>
            <t-checkbox-group v-model="visibleCols" :options="columnOptions" class="ug-col-picker" />
          </template>
        </t-popup>
      </div>
      <div v-if="status.length || channels.length" class="ug-row ug-active-filters">
        <t-tag v-for="s in status" :key="s" closable variant="light" theme="primary" @close="status = status.filter((x) => x !== s)">{{ statusLabel[s] }}</t-tag>
        <t-tag v-for="c in channels" :key="c" closable variant="light" @close="channels = channels.filter((x) => x !== c)">{{ c.toUpperCase() }}</t-tag>
      </div>

      <t-alert v-if="state === 'error'" theme="error" title="加载失败" message="订单服务暂时不可用，请稍后重试。" class="ug-alert">
        <template #operation><t-button size="large" variant="outline" @click="retry"><template #icon><Icon name="refresh" /></template>重试</t-button></template>
      </t-alert>
      <t-empty v-else-if="state === 'empty' || (state === 'ready' && filtered.length === 0)" title="暂无订单" description="没有匹配的订单。调整筛选条件或创建一个新订单。" class="ug-empty">
        <template #action><t-button theme="primary" size="large" @click="keyword = ''; status = []; channels = []; range = []"><template #icon><Icon name="refresh" /></template>清空筛选</t-button></template>
      </t-empty>
      <t-table
        v-else
        v-model:selected-row-keys="selected"
        v-model:sort="sort"
        row-key="id"
        :data="paged"
        :columns="columns"
        :loading="state === 'loading'"
        :pagination="{ current: page, pageSize, total: filtered.length, showJumper: true, pageSizeOptions: [5, 10, 20, 50] }"
        hover
        table-layout="fixed"
        :active-row-type="'single'"
        @page-change="(p: { current: number; pageSize: number }) => { page = p.current; pageSize = p.pageSize }"
        @row-click="({ row }: { row: TableRowData }) => (detail = row as Order)"
      >
        <template #customer="{ row }">
          <div class="ug-row"><t-avatar size="small">{{ initials(row.customer) }}</t-avatar><div class="ug-ellipsis"><div>{{ row.customer }}</div><div class="ug-muted ug-small">{{ row.email }}</div></div></div>
        </template>
        <template #status="{ row }"><t-tag :theme="statusTheme[row.status]" variant="light-outline" size="small">{{ statusLabel[row.status] }}</t-tag></template>
        <template #amount="{ row }"><span class="ug-mono">{{ money(row.amount, row.currency) }}</span></template>
        <template #channel="{ row }"><t-tag variant="outline" size="small">{{ row.channel.toUpperCase() }}</t-tag></template>
        <template #op="{ row }">
          <t-space size="4px" @click.stop>
            <t-button variant="text" size="large" shape="square" aria-label="编辑" @click="detail = row as Order"><Icon name="pencil" /></t-button>
            <t-dropdown :options="[{ content: '查看详情', value: 'view' }, { content: '删除', value: 'delete', theme: 'error' }]" @click="(o: DropdownOption) => onRowMenu(o, row as Order)">
              <t-button variant="text" size="large" shape="square" aria-label="更多"><Icon name="more-horizontal" /></t-button>
            </t-dropdown>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-drawer :visible="!!detail" :header="detail ? `订单 ${detail.id}` : ''" size="420px" :footer="false" @close="detail = null">
      <template v-if="detail">
        <t-tabs v-model="detailTab">
          <t-tab-panel value="info" label="详情">
            <t-descriptions :column="1" bordered size="small" class="ug-desc">
              <t-descriptions-item label="客户">{{ detail.customer }}</t-descriptions-item>
              <t-descriptions-item label="邮箱">{{ detail.email }}</t-descriptions-item>
              <t-descriptions-item label="商品">{{ detail.product }}</t-descriptions-item>
              <t-descriptions-item label="金额">{{ money(detail.amount, detail.currency) }}</t-descriptions-item>
              <t-descriptions-item label="状态"><t-tag :theme="statusTheme[detail.status]" variant="light" size="small">{{ statusLabel[detail.status] }}</t-tag></t-descriptions-item>
              <t-descriptions-item label="日期">{{ detail.date }}</t-descriptions-item>
              <t-descriptions-item label="渠道">{{ detail.channel.toUpperCase() }}</t-descriptions-item>
            </t-descriptions>
          </t-tab-panel>
          <t-tab-panel value="timeline" label="进度">
            <t-timeline class="ug-desc">
              <t-timeline-item label="创建订单" :content="detail.date" dot-color="primary" />
              <t-timeline-item label="支付完成" :content="statusLabel[detail.status]" dot-color="success" />
              <t-timeline-item label="发货" content="待处理" dot-color="default" />
            </t-timeline>
          </t-tab-panel>
          <t-tab-panel value="note" label="备注">
            <t-textarea v-model="note" placeholder="记录订单备注…" :autosize="{ minRows: 4 }" :maxlength="200" class="ug-desc" />
            <t-button theme="primary" size="large" @click="MessagePlugin.success('备注已保存')">保存备注</t-button>
          </t-tab-panel>
        </t-tabs>
      </template>
    </t-drawer>

    <t-dialog :visible="!!deleting" theme="warning" header="删除订单" :body="`确定删除订单 ${deleting?.id} 吗？此操作不可撤销。`" confirm-btn="删除" cancel-btn="取消" @confirm="confirmDelete" @close="deleting = null" />
  </div>
</template>

<style>
.ug-toolbar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.ug-tb-search { flex: 1 1 220px; min-width: 0; }
.ug-tb-item { flex: 1 1 160px; min-width: 0; max-width: 280px; }
.ug-col-picker { display: flex; flex-direction: column; gap: 6px; padding: 8px 12px; }
.ug-active-filters { margin-bottom: 12px; }
.ug-alert, .ug-empty { margin: 8px 0; }
.ug-desc { margin: 12px 0; }
@media (max-width: 767px) {
  .ug-tb-item { max-width: none; flex-basis: 100%; }
  .t-drawer__content-wrapper { max-width: 100vw; }
}
</style>
