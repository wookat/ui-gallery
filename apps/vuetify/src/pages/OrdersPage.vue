<script setup lang="ts">
import { computed, ref } from "vue"
import { useRoute } from "vue-router"
import orders from "@ui-gallery/spec/mock/orders.json"
import Icon from "@/components/Icon.vue"

const route = useRoute()
const search = ref("")
const status = ref("全部")
const channel = ref<string[]>([])
const selected = ref<unknown[]>([])
const drawer = ref(false)
const confirm = ref(false)
const snackbar = ref(false)
const selectedOrder = ref<(typeof orders)[number] | null>(null)
const columns = ref({ id: true, customer: true, amount: true, status: true, date: true, actions: true })
const states = ["全部", "paid", "pending", "refunded", "failed", "shipped"]
const channels = ["web", "ios", "android", "api"]
const headers = computed(() => [
  { title: "订单", key: "id", visible: columns.value.id },
  { title: "客户", key: "customer", visible: columns.value.customer },
  { title: "金额", key: "amount", align: "end" as const, visible: columns.value.amount },
  { title: "状态", key: "status", visible: columns.value.status },
  { title: "日期", key: "date", visible: columns.value.date },
  { title: "", key: "actions", sortable: false, visible: columns.value.actions },
].filter((item) => item.visible))
const filtered = computed(() => orders.filter((item) => (!search.value || `${item.id} ${item.customer} ${item.email}`.toLowerCase().includes(search.value.toLowerCase())) && (status.value === "全部" || item.status === status.value) && (!channel.value.length || channel.value.includes(item.channel))))
const statusColor = (value: string) => ({ paid: "success", pending: "warning", refunded: "info", failed: "error", shipped: "primary" }[value] ?? "secondary")
const statusLabel = (value: string) => ({ paid: "已支付", pending: "处理中", refunded: "已退款", failed: "失败", shipped: "已发货" }[value] ?? value)
const money = (value: number) => new Intl.NumberFormat("zh-CN").format(value)
function openOrder(_: Event, row: { item: (typeof orders)[number] }) {
  selectedOrder.value = row.item
  drawer.value = true
}
function removeOrder() {
  confirm.value = false
  snackbar.value = true
}
</script>

<template>
  <div>
    <template v-if="route.query.state === 'loading'"><v-skeleton-loader type="heading, paragraph, table" /></template>
    <template v-else-if="route.query.state === 'empty'"><v-empty-state icon="mdi-cart-outline" title="暂无订单" text="调整筛选条件或创建一笔新订单。" /></template>
    <template v-else-if="route.query.state === 'error'"><v-alert type="error" variant="tonal" title="订单加载失败">请检查网络后重试。<template #append><v-btn variant="outlined">重试</v-btn></template></v-alert></template>
    <template v-else>
      <div class="d-flex align-start justify-space-between flex-wrap ga-3 mb-5"><div><h1 class="text-h5 text-sm-h4">订单</h1><p class="text-body-2 text-medium-emphasis mt-1">管理订单、付款状态与履约信息。</p></div><v-btn variant="outlined"><template #prepend><Icon name="download" /></template>导出</v-btn></div>
      <v-card>
        <v-card-text class="d-flex flex-wrap ga-3">
          <v-text-field v-model="search" label="搜索订单或客户" prepend-inner-icon="mdi-magnify" density="compact" variant="outlined" hide-details class="filter-search" />
          <v-select v-model="status" :items="states" label="状态" density="compact" variant="outlined" hide-details class="filter-select" />
          <v-date-input label="日期范围" multiple="range" density="compact" variant="outlined" hide-details class="filter-date" />
          <v-select v-model="channel" :items="channels" label="渠道" multiple chips density="compact" variant="outlined" hide-details class="filter-select" />
          <v-menu :close-on-content-click="false"><template #activator="{ props }"><v-btn v-bind="props" variant="text"><Icon name="sliders" />列显示</v-btn></template><v-list density="compact"><v-list-item v-for="(_, key) in columns" :key="key"><template #prepend><v-checkbox-btn v-model="columns[key as keyof typeof columns]" /></template><v-list-item-title>{{ key }}</v-list-item-title></v-list-item></v-list></v-menu>
        </v-card-text>
        <div class="d-none d-sm-block">
          <v-data-table v-model="selected" :headers="headers" :items="filtered" item-value="id" show-select hover @click:row="openOrder">
            <template #[`item.customer`]="{ item }"><div class="d-flex align-center ga-2"><v-avatar size="30" color="primary" variant="tonal">{{ item.customer.slice(0, 1) }}</v-avatar><div><div>{{ item.customer }}</div><div class="text-caption text-medium-emphasis">{{ item.email }}</div></div></div></template>
            <template #[`item.amount`]="{ item }"><span class="font-weight-medium">¥{{ money(item.amount) }}</span></template>
            <template #[`item.status`]="{ item }"><v-chip size="small" :color="statusColor(item.status)" variant="tonal">{{ statusLabel(item.status) }}</v-chip></template>
            <template #[`item.actions`]="{}"><v-menu><template #activator="{ props }"><v-btn v-bind="props" icon variant="text" size="small" @click.stop><Icon name="ellipsis" /></v-btn></template><v-list density="compact"><v-list-item title="编辑" /><v-list-item title="删除" @click="confirm = true" /></v-list></v-menu></template>
          </v-data-table>
        </div>
        <div class="d-sm-none">
          <v-list lines="two">
            <v-list-item v-for="item in filtered" :key="item.id" :title="item.id" :subtitle="`${item.customer} · ${item.email}`" @click="openOrder($event, { item })">
              <template #prepend><v-avatar size="32" color="primary" variant="tonal">{{ item.customer.slice(0, 1) }}</v-avatar></template>
              <template #append><div class="text-right"><div class="font-weight-medium">¥{{ money(item.amount) }}</div><v-chip size="x-small" :color="statusColor(item.status)" variant="tonal">{{ statusLabel(item.status) }}</v-chip></div></template>
            </v-list-item>
          </v-list>
        </div>
      </v-card>
    </template>
    <v-navigation-drawer v-model="drawer" location="end" temporary :width="Math.min(420, 375)" class="order-drawer">
      <template v-if="selectedOrder">
        <v-card-title class="d-flex justify-space-between align-center">订单详情<v-btn icon variant="text" @click="drawer = false"><Icon name="x" /></v-btn></v-card-title>
        <v-divider /><v-card-text><v-table density="comfortable"><tbody><tr><td>订单号</td><td>{{ selectedOrder.id }}</td></tr><tr><td>客户</td><td>{{ selectedOrder.customer }}</td></tr><tr><td>商品</td><td>{{ selectedOrder.product }}</td></tr><tr><td>金额</td><td>¥{{ money(selectedOrder.amount) }}</td></tr><tr><td>日期</td><td>{{ selectedOrder.date }}</td></tr></tbody></v-table><v-tabs v-model="selectedOrder.status" class="mt-5"><v-tab value="detail">详情</v-tab><v-tab value="log">日志</v-tab><v-tab value="note">备注</v-tab></v-tabs><v-textarea label="备注" rows="4" class="mt-4" /></v-card-text>
      </template>
    </v-navigation-drawer>
    <v-dialog v-model="confirm" max-width="420"><v-card title="删除订单？" text="删除后无法恢复，请确认操作。"><v-card-actions><v-spacer /><v-btn variant="text" @click="confirm = false">取消</v-btn><v-btn color="error" variant="flat" @click="removeOrder">确认删除</v-btn></v-card-actions></v-card></v-dialog>
    <v-snackbar v-model="snackbar" color="success">订单已删除</v-snackbar>
  </div>
</template>

<style scoped>
.filter-search { min-width: 220px; flex: 1 1 220px; }
.filter-select { min-width: 130px; flex: 1 1 130px; }
.filter-date { min-width: 180px; flex: 1 1 180px; }
.order-drawer { max-width: 100vw; }
</style>
