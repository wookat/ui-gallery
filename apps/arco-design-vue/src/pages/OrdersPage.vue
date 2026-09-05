<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { Message, type TableData } from "@arco-design/web-vue"
import orders from "@ui-gallery/spec/mock/orders.json"
import PageHeader from "@/components/PageHeader.vue"
import StatusTag from "@/components/StatusTag.vue"
import { Icon } from "@/lib/icons"

type Order = (typeof orders)[number]
type Status = Order["status"]

const STATUSES: Status[] = ["paid", "pending", "shipped", "refunded", "failed"]
const STATUS_LABEL: Record<Status, string> = {
  paid: "已支付",
  pending: "待处理",
  shipped: "已发货",
  refunded: "已退款",
  failed: "失败",
}

const loading = ref(true)
const errored = ref(false)
const keyword = ref("")
const status = ref<Status | "all">("all")
const channels = ref<string[]>([])
const range = ref<string[]>([])
const page = ref(1)
const pageSize = ref(10)
const selectedKeys = ref<string[]>([])
const visibleColumns = ref(["customer", "product", "amount", "status", "date", "channel"])
const detail = ref<Order | null>(null)
const pendingDelete = ref<Order | null>(null)

onMounted(() => setTimeout(() => (loading.value = false), 300))

const allChannels = [...new Set(orders.map((order) => order.channel))]

const filtered = computed(() =>
  orders.filter((order) => {
    if (status.value !== "all" && order.status !== status.value) return false
    if (channels.value.length && !channels.value.includes(order.channel)) return false
    if (range.value.length === 2 && (order.date < range.value[0]! || order.date > range.value[1]!)) return false
    const q = keyword.value.trim().toLowerCase()
    if (q && !`${order.id} ${order.customer} ${order.email}`.toLowerCase().includes(q)) return false
    return true
  }),
)

const paged = computed(() => filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))

const columnDefs = [
  { title: "订单号", dataIndex: "id", slotName: "id", width: 120, fixed: "left" as const },
  { title: "客户", dataIndex: "customer", slotName: "customer", width: 200 },
  { title: "产品", dataIndex: "product", width: 130 },
  { title: "金额", dataIndex: "amount", slotName: "amount", align: "right" as const, width: 130, sortable: { sortDirections: ["ascend", "descend"] as ("ascend" | "descend")[] } },
  { title: "状态", dataIndex: "status", slotName: "status", width: 110 },
  { title: "日期", dataIndex: "date", width: 130, sortable: { sortDirections: ["ascend", "descend"] as ("ascend" | "descend")[] } },
  { title: "渠道", dataIndex: "channel", slotName: "channel", width: 100 },
  { title: "操作", dataIndex: "actions", slotName: "actions", width: 90, fixed: "right" as const },
]
const columns = computed(() => columnDefs.filter((column) => ["id", "actions"].includes(column.dataIndex) || visibleColumns.value.includes(column.dataIndex)))

function reset() {
  keyword.value = ""
  status.value = "all"
  channels.value = []
  range.value = []
  page.value = 1
}

function reload() {
  errored.value = false
  loading.value = true
  setTimeout(() => (loading.value = false), 500)
}

function confirmDelete() {
  Message.success(`订单 ${pendingDelete.value?.id} 已删除`)
  pendingDelete.value = null
  detail.value = null
}
</script>

<template>
  <div class="page">
    <PageHeader title="订单" :description="`共 ${orders.length} 条订单，可按状态、渠道与日期筛选。`">
      <a-button @click="errored = !errored">{{ errored ? "恢复" : "模拟错误" }}</a-button>
      <a-button type="primary">
        <template #icon><Icon name="download" /></template>
        导出 CSV
      </a-button>
    </PageHeader>

    <a-card :bordered="true" class="orders-toolbar">
      <div class="row">
        <a-input-search v-model="keyword" placeholder="搜索订单号 / 客户 / 邮箱" allow-clear style="width: 260px; max-width: 100%" @input="page = 1" />
        <a-select v-model="status" style="width: 140px" @change="page = 1">
          <a-option value="all">全部状态</a-option>
          <a-option v-for="s in STATUSES" :key="s" :value="s">{{ STATUS_LABEL[s] }}</a-option>
        </a-select>
        <a-select v-model="channels" multiple placeholder="渠道" allow-clear style="min-width: 160px" :max-tag-count="2" @change="page = 1">
          <a-option v-for="channel in allChannels" :key="channel" :value="channel">{{ channel }}</a-option>
        </a-select>
        <a-range-picker v-model="range" style="width: 260px; max-width: 100%" @change="page = 1" />
        <a-popover trigger="click" position="bl">
          <a-button>
            <template #icon><Icon name="columns" /></template>
            列
          </a-button>
          <template #content>
            <a-checkbox-group v-model="visibleColumns" direction="vertical">
              <a-checkbox v-for="column in columnDefs.slice(1, -1)" :key="column.dataIndex" :value="column.dataIndex">{{ column.title }}</a-checkbox>
            </a-checkbox-group>
          </template>
        </a-popover>
        <a-button type="text" @click="reset">重置</a-button>
        <a-typography-text v-if="selectedKeys.length" type="secondary" class="small">已选 {{ selectedKeys.length }} 项</a-typography-text>
      </div>
    </a-card>

    <a-result v-if="errored" status="error" title="加载订单失败" subtitle="服务暂时不可用，请稍后重试。">
      <template #extra><a-button type="primary" @click="reload">重试</a-button></template>
    </a-result>

    <template v-else>
      <a-card :bordered="true" class="hide-mobile" :body-style="{ padding: 0 }">
        <a-table
          v-model:selected-keys="selectedKeys"
          row-key="id"
          :columns="columns"
          :data="paged"
          :loading="loading"
          :pagination="false"
          :row-selection="{ type: 'checkbox', showCheckedAll: true }"
          :scroll="{ x: 1000 }"
          @row-click="(record: TableData) => (detail = record as Order)"
        >
          <template #id="{ record }"><a-typography-text bold>{{ record.id }}</a-typography-text></template>
          <template #customer="{ record }">
            <a-space size="small">
              <a-avatar :size="28">{{ record.customer.slice(0, 1) }}</a-avatar>
              <div class="stack" style="gap: 0">
                <span>{{ record.customer }}</span>
                <span class="muted small">{{ record.email }}</span>
              </div>
            </a-space>
          </template>
          <template #amount="{ record }"><span style="font-variant-numeric: tabular-nums">¥{{ record.amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 }) }}</span></template>
          <template #status="{ record }"><StatusTag :value="record.status" /></template>
          <template #channel="{ record }"><a-tag size="small" bordered>{{ record.channel }}</a-tag></template>
          <template #actions="{ record }">
            <a-dropdown position="br" @click.stop>
              <a-button type="text" size="small" @click.stop><template #icon><Icon name="more-horizontal" /></template></a-button>
              <template #content>
                <a-doption @click="detail = record">查看详情</a-doption>
                <a-doption>复制订单号</a-doption>
                <a-doption style="color: rgb(var(--red-6))" @click="pendingDelete = record">删除</a-doption>
              </template>
            </a-dropdown>
          </template>
          <template #empty>
            <a-empty description="没有匹配的订单，试试调整筛选条件。" style="padding: 40px 0">
              <a-button size="small" @click="reset">清空筛选</a-button>
            </a-empty>
          </template>
        </a-table>
      </a-card>

      <div class="show-mobile" style="width: 100%; flex-direction: column; gap: 12px">
        <a-skeleton v-if="loading" animation><a-skeleton-line :rows="4" /></a-skeleton>
        <a-empty v-else-if="!paged.length" description="没有匹配的订单" />
        <a-card v-for="order in paged" v-else :key="order.id" :bordered="true" hoverable size="small" @click="detail = order">
          <div class="between">
            <a-typography-text bold>{{ order.id }}</a-typography-text>
            <StatusTag :value="order.status" />
          </div>
          <div class="between small" style="margin-top: 8px">
            <span>{{ order.customer }} · {{ order.product }}</span>
            <span>¥{{ order.amount.toLocaleString() }}</span>
          </div>
          <div class="muted small" style="margin-top: 4px">{{ order.date }} · {{ order.channel }}</div>
        </a-card>
      </div>

      <div class="between" style="flex-wrap: wrap; gap: 8px">
        <span class="muted small">第 {{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, filtered.length) }} 条，共 {{ filtered.length }} 条</span>
        <a-pagination v-model:current="page" v-model:page-size="pageSize" :total="filtered.length" show-page-size :page-size-options="[10, 20, 50]" simple />
      </div>
    </template>

    <a-drawer :visible="!!detail" :width="420" unmount-on-close @cancel="detail = null" @ok="detail = null">
      <template #title>订单 {{ detail?.id }}</template>
      <template v-if="detail">
        <a-descriptions :column="1" bordered size="medium" style="margin-bottom: 16px">
          <a-descriptions-item label="客户">{{ detail.customer }}</a-descriptions-item>
          <a-descriptions-item label="邮箱">{{ detail.email }}</a-descriptions-item>
          <a-descriptions-item label="产品">{{ detail.product }}</a-descriptions-item>
          <a-descriptions-item label="金额">¥{{ detail.amount.toLocaleString() }}</a-descriptions-item>
          <a-descriptions-item label="状态"><StatusTag :value="detail.status" /></a-descriptions-item>
          <a-descriptions-item label="日期">{{ detail.date }}</a-descriptions-item>
        </a-descriptions>
        <a-tabs default-active-key="timeline">
          <a-tab-pane key="timeline" title="时间线">
            <a-timeline>
              <a-timeline-item :label="detail.date">订单创建</a-timeline-item>
              <a-timeline-item :label="detail.date">支付 {{ STATUS_LABEL[detail.status] }}</a-timeline-item>
              <a-timeline-item dot-color="#86909c">等待后续更新</a-timeline-item>
            </a-timeline>
          </a-tab-pane>
          <a-tab-pane key="items" title="商品">
            <a-list size="small" :bordered="false">
              <a-list-item>{{ detail.product }} × 1<template #extra>¥{{ detail.amount.toLocaleString() }}</template></a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane key="notes" title="备注">
            <a-textarea placeholder="添加内部备注…" :auto-size="{ minRows: 3 }" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <template #footer>
        <a-space>
          <a-button status="danger" @click="pendingDelete = detail">删除订单</a-button>
          <a-button type="primary" @click="detail = null">关闭</a-button>
        </a-space>
      </template>
    </a-drawer>

    <a-modal :visible="!!pendingDelete" title="确认删除订单？" ok-text="删除" :ok-button-props="{ status: 'danger' }" @ok="confirmDelete" @cancel="pendingDelete = null">
      订单 <strong>{{ pendingDelete?.id }}</strong> 删除后不可恢复。
    </a-modal>
  </div>
</template>

<style scoped>
.orders-toolbar :deep(.arco-card-body) {
  padding: 12px 16px;
}
</style>
