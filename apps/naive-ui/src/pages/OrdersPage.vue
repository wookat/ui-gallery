<script setup lang="ts">
import { computed, h, ref } from "vue"
import { NCard, NInput, NSelect, NDatePicker, NButton, NDataTable, NPagination, NDrawer, NDrawerContent, NDescriptions, NDescriptionsItem, NTabs, NTabPane, NEmpty, NAlert, NSpin, NPopover, NCheckbox, NCheckboxGroup, NSpace, NFlex, NDropdown, NText, NAvatar, NRadioGroup, NRadioButton, NList, NListItem, NThing, useDialog, useMessage, type DataTableColumns, type DataTableRowKey } from "naive-ui"
import orders from "@ui-gallery/spec/mock/orders.json"
import PageHeader from "../components/PageHeader.vue"
import StatusTag from "../components/StatusTag.vue"
import { Icon, renderIcon } from "../icons"
import { formatMoney, useIsMobile } from "../composables"

type Order = (typeof orders)[number]
const dialog = useDialog()
const message = useMessage()
const isMobile = useIsMobile()
const query = ref("")
const status = ref<string | null>(null)
const range = ref<[number, number] | null>(null)
const channels = ref<string[]>([])
const visible = ref(["customer", "status", "date", "amount"])
const page = ref(1)
const pageSize = ref(5)
const selected = ref<Order | null>(null)
const checked = ref<DataTableRowKey[]>([])
const view = ref<"ok" | "loading" | "error">("ok")
const note = ref("")

const statusOptions = ["paid", "pending", "shipped", "refunded", "failed"].map((v) => ({ label: v, value: v }))
const channelOptions = ["web", "ios", "android", "api"].map((v) => ({ label: v, value: v }))
const columnOptions = [{ label: "客户", value: "customer" }, { label: "状态", value: "status" }, { label: "日期", value: "date" }, { label: "金额", value: "amount" }]

const filtered = computed(() => orders.filter((o) =>
  (o.id + o.customer + o.email).toLowerCase().includes(query.value.toLowerCase())
  && (!status.value || o.status === status.value)
  && (!channels.value.length || channels.value.includes(o.channel))
  && (!range.value || (new Date(o.date).getTime() >= range.value[0] && new Date(o.date).getTime() <= range.value[1] + 86400000)),
))
const paged = computed(() => filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))

function confirmDelete(order: Order) {
  dialog.warning({
    title: "确认删除订单？",
    content: `订单 ${order.id} 删除后无法恢复。`,
    positiveText: "确认删除",
    negativeText: "取消",
    onPositiveClick: () => { message.success(`订单 ${order.id} 已删除`); selected.value = null },
  })
}
const rowActions = (row: Order) => [{ key: "edit", label: "编辑", icon: renderIcon("pencil") }, { key: "delete", label: "删除", icon: renderIcon("trash"), props: { onClick: () => confirmDelete(row) } }]
const columns = computed<DataTableColumns<Order>>(() => [
  { type: "selection" },
  { title: "订单号", key: "id", sorter: "default", render: (row) => h(NText, { strong: true }, () => row.id) },
  ...(visible.value.includes("customer") ? [{ title: "客户", key: "customer", sorter: "default" as const, render: (row: Order) => h(NFlex, { align: "center", wrap: false }, () => [h(NAvatar, { round: true, size: "small" }, () => row.customer[0]), h("div", [h("div", row.customer), h(NText, { depth: 3, style: "font-size:12px" }, () => row.email)])]) }] : []),
  ...(visible.value.includes("status") ? [{ title: "状态", key: "status", render: (row: Order) => h(StatusTag, { value: row.status }) }] : []),
  ...(visible.value.includes("date") ? [{ title: "日期", key: "date", sorter: "default" as const }] : []),
  ...(visible.value.includes("amount") ? [{ title: "金额", key: "amount", align: "right" as const, sorter: (a: Order, b: Order) => a.amount - b.amount, render: (row: Order) => formatMoney(row.amount) }] : []),
  { title: "操作", key: "actions", width: 72, align: "right", render: (row) => h(NDropdown, { options: rowActions(row), trigger: "click" }, () => h(NButton, { quaternary: true, circle: true, size: "medium", "aria-label": "操作", onClick: (e: MouseEvent) => e.stopPropagation() }, { icon: renderIcon("more-horizontal", 16) })) },
])
const rowProps = (row: Order) => ({ style: "cursor: pointer", onClick: () => { selected.value = row } })
function reset() { query.value = ""; status.value = null; channels.value = []; range.value = null }
</script>

<template>
  <NSpace vertical :size="20">
    <PageHeader title="订单管理" description="搜索、筛选并查看全部订单。">
      <template #action>
        <NFlex>
          <NRadioGroup v-model:value="view" size="medium">
            <NRadioButton value="ok">正常</NRadioButton><NRadioButton value="loading">加载</NRadioButton><NRadioButton value="error">错误</NRadioButton>
          </NRadioGroup>
          <NButton secondary @click="message.info('已导出 CSV')"><template #icon><Icon name="download" /></template>导出</NButton>
        </NFlex>
      </template>
    </PageHeader>
    <NAlert v-if="view === 'error'" type="error" title="加载订单失败"><NFlex align="center" justify="space-between" :wrap="true">网络连接超时，请检查网络后重试。<NButton size="medium" secondary type="error" @click="view = 'ok'"><template #icon><Icon name="refresh" :size="14" /></template>重试</NButton></NFlex></NAlert>
    <NCard size="small">
      <NFlex :wrap="true" :size="8" style="margin-bottom: 12px">
        <NInput v-model:value="query" placeholder="搜索订单号 / 客户 / 邮箱" clearable :style="{ width: isMobile ? '100%' : '240px' }"><template #prefix><Icon name="search" :size="15" /></template></NInput>
        <NSelect v-model:value="status" :options="statusOptions" placeholder="状态" clearable :style="{ width: isMobile ? '100%' : '140px' }" />
        <NDatePicker v-model:value="range" type="daterange" clearable :style="{ width: isMobile ? '100%' : '280px' }" />
        <NSelect v-model:value="channels" :options="channelOptions" multiple placeholder="渠道（多选）" clearable :max-tag-count="2" :style="{ width: isMobile ? '100%' : '220px' }" />
        <NPopover trigger="click" placement="bottom-end">
          <template #trigger><NButton secondary><template #icon><Icon name="sliders" /></template>列</NButton></template>
          <NCheckboxGroup v-model:value="visible"><NSpace vertical><NCheckbox v-for="c in columnOptions" :key="c.value" :value="c.value" :label="c.label" /></NSpace></NCheckboxGroup>
        </NPopover>
      </NFlex>
      <NSpin :show="view === 'loading'">
        <template v-if="filtered.length">
          <NDataTable v-if="!isMobile" v-model:checked-row-keys="checked" :columns="columns" :data="paged" :row-key="(row: Order) => row.id" :row-props="rowProps" :scroll-x="820" :bordered="false" />
          <NList v-else hoverable clickable bordered>
            <NListItem v-for="o in paged" :key="o.id" @click="selected = o">
              <NThing :title="o.id" :description="o.customer + ' · ' + o.date"><template #header-extra><StatusTag :value="o.status" /></template><NText strong>{{ formatMoney(o.amount) }}</NText></NThing>
            </NListItem>
          </NList>
        </template>
        <NEmpty v-else description="没有找到匹配的订单" size="large" style="padding: 40px 0">
          <template #icon><Icon name="inbox" :size="40" /></template>
          <template #extra><NButton secondary @click="reset">清除筛选</NButton></template>
        </NEmpty>
      </NSpin>
      <NFlex justify="space-between" align="center" :wrap="true" style="margin-top: 12px">
        <NText depth="3" style="font-size: 12px">已选 {{ checked.length }} / 共 {{ filtered.length }} 条</NText>
        <NPagination v-model:page="page" v-model:page-size="pageSize" :item-count="filtered.length" :page-sizes="[5, 10, 20]" show-size-picker size="medium" :simple="isMobile" />
      </NFlex>
    </NCard>
    <NDrawer :show="!!selected" :width="isMobile ? '100%' : 420" placement="right" @update:show="(v: boolean) => !v && (selected = null)">
      <NDrawerContent v-if="selected" :title="selected.id" closable>
        <NTabs type="line" animated>
          <NTabPane name="detail" tab="详情">
            <NDescriptions label-placement="left" :column="1" bordered size="small">
              <NDescriptionsItem label="客户">{{ selected.customer }}</NDescriptionsItem>
              <NDescriptionsItem label="邮箱">{{ selected.email }}</NDescriptionsItem>
              <NDescriptionsItem label="商品">{{ selected.product }}</NDescriptionsItem>
              <NDescriptionsItem label="状态"><StatusTag :value="selected.status" /></NDescriptionsItem>
              <NDescriptionsItem label="渠道">{{ selected.channel }}</NDescriptionsItem>
              <NDescriptionsItem label="日期">{{ selected.date }}</NDescriptionsItem>
              <NDescriptionsItem label="金额">{{ formatMoney(selected.amount) }}</NDescriptionsItem>
            </NDescriptions>
          </NTabPane>
          <NTabPane name="note" tab="备注"><NInput v-model:value="note" type="textarea" placeholder="添加内部备注..." :autosize="{ minRows: 4 }" show-count maxlength="200" /></NTabPane>
        </NTabs>
        <template #footer>
          <NFlex justify="end"><NButton secondary @click="selected = null">关闭</NButton><NButton type="error" @click="confirmDelete(selected)"><template #icon><Icon name="trash" /></template>删除订单</NButton></NFlex>
        </template>
      </NDrawerContent>
    </NDrawer>
  </NSpace>
</template>
