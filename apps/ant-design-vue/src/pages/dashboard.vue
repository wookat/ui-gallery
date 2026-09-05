<script setup lang="ts">
import { computed, ref } from "vue"
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { LineChart, BarChart, PieChart } from "echarts/charts"
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components"
import VChart from "vue-echarts"
import stats from "@ui-gallery/spec/mock/stats.json"
import series from "@ui-gallery/spec/mock/series.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { PageHeader, Sparkline, statusTag, initials } from "./shared"
use([CanvasRenderer, LineChart, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent])
const loading = ref(true)
setTimeout(() => { if (!new URLSearchParams(location.search).has("loading")) loading.value = false }, 600)
const lineOption = computed(() => ({ tooltip: { trigger: "axis" }, legend: { data: ["收入", "订单"] }, xAxis: { type: "category", data: series.months }, yAxis: { type: "value" }, series: [{ name: "收入", type: "line", data: series.revenue, smooth: true }, { name: "订单", type: "line", data: series.orders, smooth: true }] }))
const barOption = computed(() => ({ tooltip: {}, xAxis: { type: "category", data: series.months }, yAxis: { type: "value" }, series: [{ type: "bar", data: series.orders }] }))
const pieOption = computed(() => ({ tooltip: {}, legend: { bottom: 0 }, series: [{ type: "pie", radius: ["45%", "70%"], data: series.byChannel }] }))
</script>
<template>
  <div class="page">
    <PageHeader title="仪表盘" description="欢迎回来，林晓。这里是今天的业务概况。" />
    <a-skeleton v-if="loading" active :paragraph="{ rows: 8 }" />
    <template v-else>
      <div class="card-grid">
        <a-card v-for="item in stats" :key="item.key"><a-statistic :title="item.label" :value="item.value" :precision="item.unit === '%' ? 1 : 0" :prefix="item.unit === 'CNY' ? '¥' : undefined" :suffix="item.unit === '%' ? '%' : undefined" /><a-tag :color="item.delta > 0 ? 'success' : 'error'">{{ item.delta > 0 ? '↑' : '↓' }} {{ Math.abs(item.delta) }}%</a-tag><Sparkline :values="item.trend" /></a-card>
      </div>
      <div class="wide-grid section"><a-card title="收入趋势"><VChart :option="lineOption" autoresize style="height: 300px" /></a-card><a-card title="渠道分布"><VChart :option="pieOption" autoresize style="height: 300px" /></a-card></div>
      <div class="wide-grid section"><a-card title="订单趋势"><VChart :option="barOption" autoresize style="height: 280px" /></a-card><a-card title="任务进度"><div v-for="task in tasks" :key="task.title" class="task-row"><div><span>{{ task.title }}</span><span class="muted">{{ task.owner }}</span></div><a-progress :percent="task.progress" size="small" /></div></a-card></div>
      <div class="wide-grid section"><a-card title="最近订单"><div class="table-wrap"><a-table :data-source="orders.slice(0, 5)" :pagination="false" :scroll="{ x: 560 }" row-key="id"><a-table-column title="订单" data-index="id" /><a-table-column title="客户" data-index="customer"><template #default="{ record }"><a-avatar size="small">{{ initials(record.customer) }}</a-avatar> {{ record.customer }}</template></a-table-column><a-table-column title="状态"><template #default="{ record }">{{ statusTag(record.status) }}</template></a-table-column><a-table-column title="金额" data-index="amount" align="right"><template #default="{ record }">¥{{ record.amount.toLocaleString() }}</template></a-table-column></a-table></div></a-card><a-card title="团队动态"><a-timeline><a-timeline-item v-for="item in activity" :key="item.time"><strong>{{ item.user }}</strong> {{ item.action }}<div class="muted">{{ item.time }}</div></a-timeline-item></a-timeline></a-card></div>
      <a-card class="section"><a-tabs><a-tab-pane key="day" tab="日">今日数据已同步。</a-tab-pane><a-tab-pane key="week" tab="周">本周数据已同步。</a-tab-pane><a-tab-pane key="month" tab="月">本月数据已同步。</a-tab-pane></a-tabs></a-card>
    </template>
  </div>
</template>
<style scoped>.task-row { margin-bottom: 16px; }.task-row > div { display:flex; justify-content:space-between; margin-bottom: 6px; }</style>
