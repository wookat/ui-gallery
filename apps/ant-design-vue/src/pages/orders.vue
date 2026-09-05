<script setup lang="ts">
import { computed, ref } from "vue"
import { Modal, message } from "ant-design-vue"
import orders from "@ui-gallery/spec/mock/orders.json"
import { PageHeader, statusColor, statusLabel, initials, useMobile } from "./shared"
const mobile = useMobile()
const search = ref("")
const status = ref("all")
const mode = ref("normal")
const selected = ref<any[]>([])
const drawer = ref(false)
const current = ref<any>()
const columns = ref(["id", "customer", "product", "status", "amount", "date", "action"])
const filtered = computed(() => orders.filter((item) => (!search.value || `${item.id}${item.customer}${item.product}`.toLowerCase().includes(search.value.toLowerCase())) && (status.value === "all" || item.status === status.value)))
function openRow(record: any) { current.value = record; drawer.value = true }
function remove(record: any) { Modal.confirm({ title: "删除订单", content: `确定删除 ${record.id} 吗？`, okType: "danger", onOk: () => message.success("订单已删除") }) }
function simulate() { if (mode.value === "error") message.error("订单加载失败，请重试") }
</script>
<template>
  <div class="page">
    <PageHeader title="订单" description="管理订单、筛选交易状态并查看详情。" />
    <a-card>
      <div class="toolbar"><a-input-search v-model:value="search" placeholder="搜索订单、客户或产品" style="max-width: 280px" /><a-select v-model:value="status" style="width: 130px"><a-select-option value="all">全部状态</a-select-option><a-select-option v-for="(label, key) in statusLabel" :key="key" :value="key">{{ label }}</a-select-option></a-select><a-range-picker /><a-select mode="multiple" placeholder="渠道" :max-tag-count="1" style="width: 180px"><a-select-option value="web">Web</a-select-option><a-select-option value="ios">iOS</a-select-option><a-select-option value="android">Android</a-select-option><a-select-option value="api">API</a-select-option></a-select><a-button><span>导出</span></a-button><a-select v-model:value="mode" style="width: 110px" @change="simulate"><a-select-option value="normal">正常</a-select-option><a-select-option value="loading">加载</a-select-option><a-select-option value="error">错误</a-select-option><a-select-option value="empty">空</a-select-option></a-select></div>
      <a-alert v-if="mode === 'error'" type="error" message="订单加载失败" show-icon closable><template #description><a-button type="link" @click="mode = 'normal'">重试</a-button></template></a-alert>
      <a-empty v-else-if="mode === 'empty' || !filtered.length" description="没有匹配的订单"><a-button @click="search = ''; status = 'all'; mode = 'normal'">清除筛选</a-button></a-empty>
      <a-list v-else-if="mobile" :data-source="filtered" :loading="mode === 'loading'" class="order-cards"><template #renderItem="{ item }"><a-card size="small" class="order-card" hoverable @click="openRow(item)"><div class="order-card-head"><strong>{{ item.id }}</strong><a-tag :color="statusColor[item.status]">{{ statusLabel[item.status] }}</a-tag></div><div class="order-card-body"><span><a-avatar size="small">{{ initials(item.customer) }}</a-avatar> {{ item.customer }}</span><strong>¥{{ item.amount.toLocaleString() }}</strong></div><div class="order-card-foot muted"><span>{{ item.product }} · {{ item.date }}</span><a-dropdown><a-button type="text" size="small" @click.stop><span>···</span></a-button><template #overlay><a-menu><a-menu-item key="edit">编辑</a-menu-item><a-menu-item key="delete" danger @click="remove(item)">删除</a-menu-item></a-menu></template></a-dropdown></div></a-card></template></a-list>
      <div v-else class="table-wrap"><a-table :data-source="filtered" :loading="mode === 'loading'" :row-selection="{ selectedRowKeys: selected.map((item) => item.id), onChange: (_keys: any, rows: any[]) => selected = rows }" row-key="id" :scroll="{ x: 900 }" @row-click="openRow"><a-table-column v-if="columns.includes('id')" title="订单" data-index="id" sorter /><a-table-column v-if="columns.includes('customer')" title="客户" data-index="customer"><template #default="{ record }"><a-avatar size="small">{{ initials(record.customer) }}</a-avatar> {{ record.customer }}</template></a-table-column><a-table-column v-if="columns.includes('product')" title="产品" data-index="product" /><a-table-column v-if="columns.includes('status')" title="状态"><template #default="{ record }"><a-tag :color="statusColor[record.status]">{{ statusLabel[record.status] }}</a-tag></template></a-table-column><a-table-column v-if="columns.includes('amount')" title="金额" data-index="amount" align="right" sorter><template #default="{ record }">¥{{ record.amount.toLocaleString() }}</template></a-table-column><a-table-column v-if="columns.includes('date')" title="日期" data-index="date" /><a-table-column title="操作" fixed="right"><template #default="{ record }"><a-dropdown><a-button type="text" @click.stop><span>···</span></a-button><template #overlay><a-menu><a-menu-item key="edit">编辑</a-menu-item><a-menu-item key="delete" danger @click="remove(record)">删除</a-menu-item></a-menu></template></a-dropdown></template></a-table-column></a-table></div>
      <a-pagination class="pagination" :total="filtered.length" :show-size-changer="!mobile" :show-quick-jumper="!mobile" :simple="mobile" />
    </a-card>
    <a-drawer v-model:open="drawer" title="订单详情" width="min(560px, 100vw)" placement="right"><a-descriptions v-if="current" bordered :column="1"><a-descriptions-item label="订单号">{{ current.id }}</a-descriptions-item><a-descriptions-item label="客户">{{ current.customer }}（{{ current.email }}）</a-descriptions-item><a-descriptions-item label="产品">{{ current.product }}</a-descriptions-item><a-descriptions-item label="金额">¥{{ current.amount.toLocaleString() }}</a-descriptions-item><a-descriptions-item label="状态"><a-tag :color="statusColor[current.status]">{{ statusLabel[current.status] }}</a-tag></a-descriptions-item></a-descriptions><a-tabs class="section"><a-tab-pane key="activity" tab="活动">订单已创建并进入处理流程。</a-tab-pane><a-tab-pane key="notes" tab="备注"><a-textarea :rows="5" placeholder="添加备注" /></a-tab-pane></a-tabs></a-drawer>
  </div>
</template>
<style scoped>.toolbar { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:18px; }.pagination { margin-top:18px; text-align:right; }.order-cards :deep(.ant-list-items) { display:grid; gap:12px; }.order-card { cursor:pointer; }.order-card-head, .order-card-body, .order-card-foot { display:flex; justify-content:space-between; align-items:center; gap:8px; }.order-card-body { margin:8px 0; }</style>
