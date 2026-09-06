<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { Dark } from "quasar"
import VChart from "vue-echarts"
import { use } from "echarts/core"
import { BarChart, LineChart, PieChart } from "echarts/charts"
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import AppIcon from "../icons/AppIcon.vue"
import PageHeader from "../components/PageHeader.vue"
import { statusColors } from "./shared"

use([BarChart, LineChart, PieChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])
const params = new URLSearchParams(window.location.search)
const loading = ref(params.get("state") === "loading")
const period = ref("日")
const isDark = computed(() => Dark.isActive)
const chartOption = computed(() => ({
  backgroundColor: "transparent",
  tooltip: { trigger: "axis" },
  legend: { data: ["收入", "订单"], top: 0 },
  grid: { left: 40, right: 24, top: 40, bottom: 32, containLabel: true },
  xAxis: { type: "category", data: series.months },
  yAxis: [{ type: "value" }, { type: "value" }],
  series: [
    { name: "收入", type: "line", smooth: true, data: series.revenue, areaStyle: {} },
    { name: "订单", type: "bar", yAxisIndex: 1, data: series.orders },
  ],
}))
const donutOption = computed(() => ({
  backgroundColor: "transparent",
  tooltip: { trigger: "item" },
  legend: { bottom: 0 },
  series: [{ type: "pie", center: ["50%", "42%"], radius: ["40%", "62%"], data: series.byChannel.map((item) => ({ name: item.name, value: item.value })) }],
}))

onMounted(() => {
  if (params.get("state") !== "loading") window.setTimeout(() => { loading.value = false }, 600)
})

function sparkline(values: number[]) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  return values.map((value, index) => `${(index / (values.length - 1)) * 100},${38 - ((value - min) / Math.max(max - min, 1)) * 30}`).join(" ")
}
</script>

<template>
  <div class="q-gutter-y-lg">
    <PageHeader title="仪表盘" description="欢迎回来，林晓。这里是今天的业务概况。">
      <template #action><q-btn color="primary"><AppIcon name="plus" :size="18" class="q-mr-sm" />新建项目</q-btn></template>
    </PageHeader>

    <template v-if="loading">
      <div class="row q-col-gutter-md">
        <div v-for="index in 4" :key="index" class="col-12 col-sm-6 col-xl-3"><q-card><q-card-section><q-skeleton type="text" /><q-skeleton type="text" width="60%" /><q-skeleton height="42px" /></q-card-section></q-card></div>
      </div>
      <div class="row q-col-gutter-md"><div class="col-12 col-lg-8"><q-skeleton height="320px" /></div><div class="col-12 col-lg-4"><q-skeleton height="320px" /></div></div>
    </template>
    <template v-else>
      <div class="row q-col-gutter-md">
        <div v-for="item in stats" :key="item.key" class="col-12 col-sm-6 col-xl-3">
          <q-card bordered>
            <q-card-section>
              <div class="row items-center justify-between text-body2 text-grey-7"><span>{{ item.label }}</span><q-badge :color="item.delta >= 0 ? 'positive' : 'negative'">{{ item.delta >= 0 ? "+" : "" }}{{ item.delta }}%</q-badge></div>
              <div class="text-h5 q-mt-sm">{{ item.unit === "CNY" ? `¥${item.value.toLocaleString()}` : `${item.value}${item.unit ?? ""}` }}</div>
              <svg class="sparkline q-mt-sm" viewBox="0 0 100 42" preserveAspectRatio="none"><polyline :points="sparkline(item.trend)" fill="none" stroke="currentColor" stroke-width="2" /></svg>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-card bordered>
        <q-card-section class="row items-center justify-between">
          <div><div class="text-h6">收入趋势</div><div class="text-caption text-grey-7">过去 7 个月的收入与订单</div></div>
          <q-tabs v-model="period" dense inline-label><q-tab name="日" label="日" /><q-tab name="周" label="周" /><q-tab name="月" label="月" /></q-tabs>
        </q-card-section>
        <q-card-section><v-chart class="full-width" style="height: 300px" :option="chartOption" :theme="isDark ? 'dark' : undefined" autoresize /></q-card-section>
      </q-card>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-lg-8">
          <q-card bordered><q-card-section><div class="text-h6">最近订单</div><div class="text-caption text-grey-7">最新的业务交易</div></q-card-section>
            <div class="table-scroll"><q-table flat :rows="orders.slice(0, 5)" :columns="[
              { name: 'id', label: '订单', field: 'id', align: 'left' },
              { name: 'customer', label: '客户', field: 'customer', align: 'left' },
              { name: 'status', label: '状态', field: 'status', align: 'left' },
              { name: 'amount', label: '金额', field: 'amount', align: 'right' },
              { name: 'actions', label: '', field: 'actions', align: 'right' },
            ]" row-key="id">
              <template #body-cell-customer="slot"><q-td :props="slot"><div class="row items-center no-wrap q-gutter-sm"><q-avatar size="28px" color="primary" text-color="white">{{ String(slot.value).slice(0, 1) }}</q-avatar><span>{{ slot.value }}</span></div></q-td></template>
              <template #body-cell-status="slot"><q-td :props="slot"><q-chip dense :color="statusColors[slot.value] ?? 'grey'" text-color="white">{{ slot.value }}</q-chip></q-td></template>
              <template #body-cell-amount="slot"><q-td :props="slot">¥{{ Number(slot.value).toLocaleString() }}</q-td></template>
              <template #body-cell-actions="slot"><q-td :props="slot"><q-btn flat round><AppIcon name="more-horizontal" /><q-menu><q-list><q-item clickable v-close-popup><q-item-section>查看详情</q-item-section></q-item></q-list></q-menu></q-btn></q-td></template>
            </q-table></div>
          </q-card>
        </div>
        <div class="col-12 col-lg-4"><q-card bordered><q-card-section><div class="text-h6">渠道分布</div></q-card-section><q-card-section><v-chart class="full-width" style="height: 270px" :option="donutOption" :theme="isDark ? 'dark' : undefined" autoresize /></q-card-section></q-card></div>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-lg-6"><q-card bordered><q-card-section><div class="text-h6">团队动态</div></q-card-section><q-card-section><q-timeline color="primary"><q-timeline-entry v-for="(item, index) in activity" :key="`${item.user}-${index}`" :title="item.action" :subtitle="`${item.user} · ${item.time}`" /></q-timeline></q-card-section></q-card></div>
        <div class="col-12 col-lg-6"><q-card bordered><q-card-section><div class="text-h6">任务进度</div><div class="text-caption text-grey-7">本周团队执行情况</div></q-card-section><q-card-section class="q-gutter-y-md"><div v-for="task in tasks" :key="task.title"><div class="row justify-between text-body2 q-mb-xs"><span>{{ task.title }}</span><span>{{ task.progress }}%</span></div><q-linear-progress rounded size="8px" :value="task.progress / 100" color="primary" /></div></q-card-section></q-card></div>
      </div>
    </template>
  </div>
</template>
