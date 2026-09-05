<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import VChart from "vue-echarts"
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { BarChart, LineChart, PieChart } from "echarts/charts"
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import PageHeader from "@/components/PageHeader.vue"
import StatusTag from "@/components/StatusTag.vue"
import { Icon } from "@/lib/icons"
import { theme } from "@/lib/settings"

use([CanvasRenderer, LineChart, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent])

const loading = ref(true)
const period = ref("week")
onMounted(() => {
  setTimeout(() => (loading.value = false), 300)
})

const recent = orders.slice(0, 5)
const textColor = computed(() => (theme.value === "dark" ? "#c5c5c5" : "#4e5969"))
const lineOption = computed(() => ({
  textStyle: { color: textColor.value },
  tooltip: { trigger: "axis" },
  grid: { left: 40, right: 16, top: 24, bottom: 28 },
  xAxis: { type: "category", data: series.months, axisLine: { lineStyle: { color: "#86909c" } } },
  yAxis: { type: "value", splitLine: { lineStyle: { color: theme.value === "dark" ? "#333" : "#e5e6eb" } } },
  series: [{ type: "line", smooth: true, data: series.revenue, areaStyle: { opacity: 0.12 }, color: "#165dff" }],
}))
const barOption = computed(() => ({
  textStyle: { color: textColor.value },
  tooltip: { trigger: "axis" },
  grid: { left: 40, right: 16, top: 24, bottom: 28 },
  xAxis: { type: "category", data: series.months },
  yAxis: { type: "value", splitLine: { lineStyle: { color: theme.value === "dark" ? "#333" : "#e5e6eb" } } },
  series: [{ type: "bar", data: series.orders, color: "#14c9c9", barMaxWidth: 28 }],
}))
const pieOption = computed(() => ({
  textStyle: { color: textColor.value },
  tooltip: { trigger: "item" },
  legend: { bottom: 0, textStyle: { color: textColor.value } },
  series: [{ type: "pie", radius: ["40%", "65%"], center: ["50%", "42%"], label: { show: false }, labelLine: { show: false }, data: series.byChannel, color: ["#165dff", "#14c9c9", "#f7ba1e", "#722ed1"] }],
}))

function sparkline(values: number[]) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  return values.map((value, index) => `${(index / (values.length - 1)) * 100},${32 - ((value - min) / span) * 28 - 2}`).join(" ")
}

const columns = [
  { title: "订单号", dataIndex: "id", slotName: "id" },
  { title: "客户", dataIndex: "customer", slotName: "customer" },
  { title: "状态", dataIndex: "status", slotName: "status" },
  { title: "金额", dataIndex: "amount", slotName: "amount", align: "right" as const },
  { title: "", dataIndex: "actions", slotName: "actions", width: 60 },
]
</script>

<template>
  <div class="page">
    <PageHeader title="仪表盘" description="团队本月的收入、订单与活跃情况一览。">
      <a-radio-group v-model="period" type="button">
        <a-radio value="day">日</a-radio>
        <a-radio value="week">周</a-radio>
        <a-radio value="month">月</a-radio>
      </a-radio-group>
    </PageHeader>

    <div v-if="loading" class="grid grid-4">
      <a-card v-for="n in 4" :key="n"><a-skeleton animation><a-skeleton-line :rows="2" :widths="['60%', '100%']" /></a-skeleton></a-card>
    </div>
    <div v-else class="grid grid-4">
      <a-card v-for="stat in stats" :key="stat.key" :bordered="true">
        <a-statistic :title="stat.label" :value="stat.value" show-group-separator :precision="stat.unit === '%' ? 1 : 0" :value-style="{ fontSize: '24px', fontWeight: 600 }">
          <template v-if="stat.unit === 'CNY'" #prefix>¥</template>
          <template v-if="stat.unit === '%'" #suffix>%</template>
          <template #extra>
            <div class="between" style="margin-top: 8px">
              <a-tag :color="stat.delta >= 0 ? 'green' : 'red'" size="small" bordered>
                <template #icon><Icon :name="stat.delta >= 0 ? 'arrow-up' : 'arrow-down'" :size="12" /></template>
                {{ stat.delta >= 0 ? "+" : "" }}{{ stat.delta }}%
              </a-tag>
              <svg viewBox="0 0 100 32" preserveAspectRatio="none" width="80" height="28" aria-hidden="true">
                <polyline :points="sparkline(stat.trend)" fill="none" :stroke="stat.delta >= 0 ? 'rgb(var(--green-6))' : 'rgb(var(--red-6))'" stroke-width="2" />
              </svg>
            </div>
          </template>
        </a-statistic>
      </a-card>
    </div>

    <div class="grid charts">
      <a-card title="收入趋势（千元）" :bordered="true">
        <template #extra><a-tag size="small">{{ period === "day" ? "按日" : period === "week" ? "按周" : "按月" }}</a-tag></template>
        <a-skeleton v-if="loading" animation><a-skeleton-shape shape="square" style="width: 100%; height: 240px" /></a-skeleton>
        <VChart v-else :option="lineOption" autoresize style="height: 240px" />
      </a-card>
      <a-card title="订单数" :bordered="true">
        <a-skeleton v-if="loading" animation><a-skeleton-shape shape="square" style="width: 100%; height: 240px" /></a-skeleton>
        <VChart v-else :option="barOption" autoresize style="height: 240px" />
      </a-card>
      <a-card title="渠道占比" :bordered="true">
        <a-skeleton v-if="loading" animation><a-skeleton-shape shape="circle" size="large" /></a-skeleton>
        <VChart v-else :option="pieOption" autoresize style="height: 240px" />
      </a-card>
    </div>

    <div class="grid dashboard-bottom">
      <a-card title="最近订单" :bordered="true">
        <template #extra><a-link href="orders">全部订单</a-link></template>
        <a-table :columns="columns" :data="recent" :pagination="false" :loading="loading" :scroll="{ x: 520 }" size="medium">
          <template #id="{ record }"><a-typography-text bold>{{ record.id }}</a-typography-text></template>
          <template #customer="{ record }">
            <a-space size="small">
              <a-avatar :size="24">{{ record.customer.slice(0, 1) }}</a-avatar>
              <span>{{ record.customer }}</span>
            </a-space>
          </template>
          <template #status="{ record }"><StatusTag :value="record.status" /></template>
          <template #amount="{ record }">¥{{ record.amount.toLocaleString() }}</template>
          <template #actions>
            <a-dropdown position="br">
              <a-button type="text" size="small"><template #icon><Icon name="more-horizontal" /></template></a-button>
              <template #content>
                <a-doption>查看详情</a-doption>
                <a-doption>发送发票</a-doption>
                <a-doption>退款</a-doption>
              </template>
            </a-dropdown>
          </template>
        </a-table>
      </a-card>
      <div class="stack" style="gap: 16px">
        <a-card title="团队动态" :bordered="true">
          <a-timeline>
            <a-timeline-item v-for="item in activity" :key="item.action" :label="item.time">
              <a-typography-text bold>{{ item.user }}</a-typography-text>
              <span> {{ item.action }}</span>
            </a-timeline-item>
          </a-timeline>
        </a-card>
        <a-card title="任务进度" :bordered="true">
          <a-tabs default-active-key="all" size="small">
            <a-tab-pane key="all" title="全部">
              <div class="stack">
                <div v-for="task in tasks" :key="task.title" class="stack" style="gap: 4px">
                  <div class="between small"><span>{{ task.title }}</span><span class="muted">{{ task.owner }}</span></div>
                  <a-progress :percent="task.progress / 100" :status="task.progress >= 90 ? 'success' : 'normal'" size="small" />
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="mine" title="我的">
              <a-empty description="暂无分配给我的任务" />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.charts {
  grid-template-columns: 2fr 1.4fr 1fr;
}

.dashboard-bottom {
  grid-template-columns: 1.6fr 1fr;
}

@media (max-width: 1023px) {
  .charts,
  .dashboard-bottom {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
