<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import stats from "@ui-gallery/spec/mock/stats.json"
import series from "@ui-gallery/spec/mock/series.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import EChart from "@/components/EChart.vue"
import Icon from "@/components/Icon.vue"
import { initials, money, statusLabel, statusTheme } from "@/pages/shared"

const route = useRoute()
const router = useRouter()
const loading = ref(route.query.state === "loading")
const period = ref("month")
onMounted(() => {
  if (route.query.state !== "loading") loading.value = false
})

const recent = orders.slice(0, 5)
const brand = "#0052d9"
const lineOption = computed(() => ({
  tooltip: { trigger: "axis" },
  grid: { left: 40, right: 16, top: 24, bottom: 28 },
  xAxis: { type: "category", data: series.months, boundaryGap: false },
  yAxis: { type: "value", splitLine: { lineStyle: { type: "dashed" } } },
  series: [{ name: "收入（千元）", type: "line", smooth: true, data: series.revenue, areaStyle: { opacity: 0.12 }, itemStyle: { color: brand } }],
}))
const barOption = computed(() => ({
  tooltip: { trigger: "axis" },
  grid: { left: 40, right: 16, top: 24, bottom: 28 },
  xAxis: { type: "category", data: series.months },
  yAxis: { type: "value" },
  series: [{ name: "订单", type: "bar", data: series.orders, itemStyle: { color: brand, borderRadius: [4, 4, 0, 0] } }],
}))
const pieOption = computed(() => ({
  tooltip: {},
  legend: { bottom: 0 },
  series: [{ type: "pie", radius: ["50%", "72%"], center: ["50%", "44%"], data: series.byChannel, label: { show: false } }],
}))
const sparkline = (data: number[]) => ({
  grid: { left: 0, right: 0, top: 2, bottom: 2 },
  xAxis: { type: "category", show: false, data: data.map((_, i) => i) },
  yAxis: { type: "value", show: false, min: "dataMin" },
  series: [{ type: "line", smooth: true, symbol: "none", data, lineStyle: { width: 2, color: brand }, areaStyle: { opacity: 0.15, color: brand } }],
})
const columns = [
  { colKey: "customer", title: "客户", width: 200 },
  { colKey: "product", title: "商品", width: 140 },
  { colKey: "status", title: "状态", width: 110 },
  { colKey: "amount", title: "金额", align: "right" as const, width: 130 },
  { colKey: "op", title: "", width: 64 },
]
const rowMenu = [
  { content: "查看详情", value: "view" },
  { content: "编辑", value: "edit" },
  { content: "删除", value: "delete", theme: "error" as const },
]
</script>

<template>
  <div class="ug-page">
    <div class="ug-between">
      <div>
        <t-typography-title level="h4" class="ug-title">概览</t-typography-title>
        <span class="ug-muted">欢迎回来，林晓。这是团队本周的关键指标。</span>
      </div>
      <t-radio-group v-model="period" variant="default-filled">
        <t-radio-button value="day">日</t-radio-button>
        <t-radio-button value="week">周</t-radio-button>
        <t-radio-button value="month">月</t-radio-button>
      </t-radio-group>
    </div>

    <div class="ug-grid ug-cols-4">
      <t-card v-for="s in stats" :key="s.key" :bordered="true">
        <t-skeleton :loading="loading" :row-col="[{ width: '40%' }, { width: '70%', height: '28px' }, { width: '100%', height: '40px' }]">
          <div class="ug-between">
            <span class="ug-muted">{{ s.label }}</span>
            <t-tag :theme="s.delta >= 0 ? 'success' : 'danger'" variant="light" size="small">
              <Icon :name="s.delta >= 0 ? 'arrow-up' : 'arrow-down'" :size="12" /> {{ Math.abs(s.delta) }}%
            </t-tag>
          </div>
          <t-statistic :value="s.value" :decimal-places="s.unit === '%' ? 1 : 0" :suffix="s.unit === '%' ? '%' : ''" :prefix="s.unit === 'CNY' ? '¥' : ''" />
          <EChart :option="sparkline(s.trend)" :height="44" />
        </t-skeleton>
      </t-card>
    </div>

    <div class="ug-grid ug-dash-charts">
      <t-card title="收入趋势" subtitle="单位：千元" :bordered="true">
        <template #actions><t-tag variant="light">{{ period === 'day' ? '近 7 日' : period === 'week' ? '近 7 周' : '近 7 月' }}</t-tag></template>
        <t-skeleton :loading="loading" :row-col="[{ height: '260px' }]"><EChart :option="lineOption" /></t-skeleton>
      </t-card>
      <t-card title="订单量" :bordered="true">
        <t-skeleton :loading="loading" :row-col="[{ height: '260px' }]"><EChart :option="barOption" /></t-skeleton>
      </t-card>
      <t-card title="渠道占比" :bordered="true">
        <t-skeleton :loading="loading" :row-col="[{ height: '260px' }]"><EChart :option="pieOption" /></t-skeleton>
      </t-card>
    </div>

    <div class="ug-grid ug-dash-bottom">
      <t-card title="最近订单" :bordered="true">
        <template #actions><t-link theme="primary" @click="router.push({ path: '/orders', query: route.query })">查看全部</t-link></template>
        <t-table row-key="id" :data="recent" :columns="columns" :loading="loading" size="medium" hover>
          <template #customer="{ row }">
            <div class="ug-row"><t-avatar size="small">{{ initials(row.customer) }}</t-avatar><div><div>{{ row.customer }}</div><div class="ug-muted ug-small">{{ row.id }}</div></div></div>
          </template>
          <template #status="{ row }"><t-tag :theme="statusTheme[row.status]" variant="light-outline" size="small">{{ statusLabel[row.status] }}</t-tag></template>
          <template #amount="{ row }"><span class="ug-mono">{{ money(row.amount, row.currency) }}</span></template>
          <template #op>
            <t-dropdown :options="rowMenu" placement="bottom-right"><t-button variant="text" shape="square" size="large" aria-label="更多"><Icon name="more-horizontal" /></t-button></t-dropdown>
          </template>
        </t-table>
      </t-card>
      <div class="ug-stack">
        <t-card title="团队动态" :bordered="true">
          <t-skeleton :loading="loading" :row-col="[1, 1, 1, 1]">
            <t-timeline mode="same" theme="dot">
              <t-timeline-item v-for="a in activity" :key="a.action" :label="a.time"><strong>{{ a.user }}</strong> {{ a.action }}</t-timeline-item>
            </t-timeline>
          </t-skeleton>
        </t-card>
        <t-card title="任务进度" :bordered="true">
          <t-skeleton :loading="loading" :row-col="[1, 1, 1, 1]">
            <div class="ug-stack">
              <div v-for="t in tasks" :key="t.title">
                <div class="ug-between ug-small"><span>{{ t.title }}</span><span class="ug-muted">{{ t.owner }}</span></div>
                <t-progress :percentage="t.progress" :status="t.progress >= 90 ? 'success' : 'active'" />
              </div>
            </div>
          </t-skeleton>
        </t-card>
      </div>
    </div>
  </div>
</template>

<style>
.ug-title { margin: 0 0 4px !important; }
.ug-small { font-size: 12px; }
.ug-mono { font-variant-numeric: tabular-nums; }
.ug-dash-charts { grid-template-columns: 2fr 1fr 1fr; }
.ug-dash-bottom { grid-template-columns: 3fr 2fr; }
@media (max-width: 1099px) { .ug-dash-charts, .ug-dash-bottom { grid-template-columns: minmax(0, 1fr); } }
.t-card .t-table { max-width: 100%; }
.t-table__content { overflow-x: auto; }
</style>
