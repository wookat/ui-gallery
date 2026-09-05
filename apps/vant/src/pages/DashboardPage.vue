<script setup lang="ts">
import { computed, ref } from "vue"
import { BarChart, LineChart, PieChart } from "echarts/charts"
import { GridComponent, TitleComponent, TooltipComponent } from "echarts/components"
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import VChart from "vue-echarts"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import AppIcon from "@/components/AppIcon.vue"
import { urlSettings } from "@/url-settings"

use([CanvasRenderer, GridComponent, LineChart, BarChart, PieChart, TitleComponent, TooltipComponent])
const state = ref<"ready" | "loading">("ready")
const dark = computed(() => urlSettings.theme === "dark")
const chartOption = computed(() => ({
  textStyle: { color: dark.value ? "#f5f5f5" : "#323233" },
  tooltip: { trigger: "axis" },
  grid: { left: 32, right: 18, top: 20, bottom: 24 },
  xAxis: { type: "category", data: series.months },
  yAxis: { type: "value" },
  series: [
    { name: "收入", type: "line", smooth: true, data: series.revenue },
    { name: "订单", type: "bar", data: series.orders },
  ],
}))
const pieOption = computed(() => ({ tooltip: { trigger: "item" }, series: [{ type: "pie", radius: ["42%", "70%"], data: series.byChannel }] }))
const statusText: Record<string, string> = { paid: "已支付", pending: "待处理", refunded: "已退款", failed: "失败", shipped: "已发货" }
</script>

<template>
  <div class="page">
    <div class="page-title"><div><h1>仪表盘</h1><p>业务概况</p></div><van-button type="primary"><template #icon><AppIcon name="plus" /></template>新建项目</van-button></div>
    <van-tabs v-model:active="state" type="card" class="mb-4"><van-tab title="数据概览" name="ready" /><van-tab title="加载状态" name="loading" /></van-tabs>
    <van-skeleton v-if="state === 'loading'" title :row="8" />
    <template v-else>
      <div class="grid grid-4">
        <van-cell v-for="item in stats" :key="item.key" class="card" :title="item.label">
          <template #value><van-tag :type="item.delta > 0 ? 'success' : 'danger'">{{ item.delta > 0 ? "+" : "" }}{{ item.delta }}%</van-tag></template>
          <template #label><strong class="stat-value">{{ item.unit === "CNY" ? `¥${item.value.toLocaleString()}` : `${item.value}${item.unit ?? ""}` }}</strong><svg class="sparkline" viewBox="0 0 100 24" preserveAspectRatio="none"><polyline :points="item.trend.map((value, index) => `${index * 16},${24 - value / Math.max(...item.trend) * 20}`).join(' ')" fill="none" stroke="currentColor" stroke-width="2" /></svg></template>
        </van-cell>
      </div>
      <div class="grid grid-2 section-heading-grid">
        <div class="card"><h2>收入趋势</h2><VChart class="chart" :option="chartOption" :theme="dark ? 'dark' : undefined" autoresize /></div>
        <div class="card"><h2>渠道分布</h2><VChart class="chart" :option="pieOption" :theme="dark ? 'dark' : undefined" autoresize /></div>
      </div>
      <div class="grid grid-2">
        <div class="card"><div class="between"><h2>最近订单</h2><RouterLink to="/orders">查看全部</RouterLink></div><div class="data-row head"><span>订单</span><span>客户</span><span>状态</span><span>金额</span><span /></div><div v-for="order in orders.slice(0, 5)" :key="order.id" class="data-row"><strong>{{ order.id }}</strong><span>{{ order.customer }}</span><van-tag :type="order.status === 'paid' ? 'success' : order.status === 'failed' ? 'danger' : 'primary'">{{ statusText[order.status] }}</van-tag><span>¥{{ order.amount.toLocaleString() }}</span><van-popover placement="left"><van-cell title="编辑" /><van-cell title="删除" /><template #reference><van-button plain icon="ellipsis"><AppIcon name="more" /></van-button></template></van-popover></div></div>
        <div class="card"><h2>团队动态</h2><van-steps direction="vertical" :active="activity.length"><van-step v-for="item in activity" :key="`${item.user}-${item.time}`"><strong>{{ item.user }}</strong> {{ item.action }}<span class="muted">{{ item.time }}</span></van-step></van-steps><h2 class="section-heading">任务进度</h2><div v-for="task in tasks" :key="task.title" class="task-row"><div class="between"><span>{{ task.title }}</span><span class="muted">{{ task.progress }}%</span></div><van-progress :percentage="task.progress" /></div></div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.stat-value { display: block; font-size: 22px; color: var(--van-text-color); margin-top: 6px; }
.sparkline { width: 100%; height: 28px; color: var(--van-primary-color); margin-top: 8px; }
.section-heading-grid { margin: 16px 0; }
.task-row { display: grid; gap: 5px; margin: 14px 0; }
.van-step :deep(.van-step__circle) { background: var(--van-primary-color); }
.van-step .muted { display: block; font-size: 12px; margin-top: 4px; }
</style>
