<script setup lang="ts">
import { computed, ref } from "vue"
import stats from "@ui-gallery/spec/mock/stats.json"
import series from "@ui-gallery/spec/mock/series.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import EChart from "@/components/EChart.vue"
import Icon from "@/icons/Icon.vue"
import { useMobile } from "@/composables/useMobile"
const loading = ref(true)
const mobile = useMobile()
window.setTimeout(() => {
  loading.value = false
}, 600)
const money = (stat: (typeof stats)[number]) =>
  stat.unit === "CNY" ? `¥${stat.value.toLocaleString()}` : `${stat.value}${stat.unit ?? ""}`
const lineOption = computed(() => ({
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: series.months },
  yAxis: { type: "value" },
  series: [{ type: "line", smooth: true, data: series.revenue, areaStyle: {} }],
}))
const barOption = computed(() => ({
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: series.months },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: series.orders, barMaxWidth: 24 }],
}))
const pieOption = computed(() => ({
  tooltip: { trigger: "item" },
  series: [
    {
      type: "pie",
      radius: ["35%", "62%"],
      center: ["50%", "50%"],
      data: series.byChannel.map((item) => ({ name: item.name, value: item.value })),
    },
  ],
}))
const tagType = (status: string) =>
  (({ paid: "success", pending: "warning", refunded: "info", failed: "danger", shipped: "" })[status] ?? "info") as any
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">仪表盘</h1>
        <p class="page-subtitle">欢迎回来，林晓。这里是团队的最新概览。</p>
      </div>
      <el-button type="primary"><Icon name="download" />导出报告</el-button>
    </div>
    <el-skeleton v-if="loading" :rows="4" animated />
    <template v-else>
      <el-row :gutter="16"><el-col v-for="stat in stats" :key="stat.key" :xs="24" :sm="12" :lg="6"><el-card class="stat-card"><div class="stat-head">
                                                                                                                                <span class="muted">{{ stat.label }}</span><Icon
                                                                                                                                  :name="
                                                                                                                                    stat.key === 'revenue'
                                                                                                                                      ? 'bar-chart'
                                                                                                                                      : stat.key === 'orders'
                                                                                                                                        ? 'shopping-cart'
                                                                                                                                        : stat.key === 'users'
                                                                                                                                          ? 'users'
                                                                                                                                          : 'activity'
                                                                                                                                  "
                                                                                                                                />
                                                                                                                              </div>
        <strong>{{ money(stat) }}</strong>
        <div class="stat-foot">
          <el-tag :type="stat.delta >= 0 ? 'success' : 'danger'">{{ stat.delta >= 0 ? "+" : "" }}{{ stat.delta }}%</el-tag><span class="muted">较上月</span>
        </div>
        <svg class="sparkline" viewBox="0 0 120 30" preserveAspectRatio="none">
          <polyline
            :points="stat.trend.map((v, i) => `${i * 20},${30 - (v / Math.max(...stat.trend)) * 25}`).join(' ')"
            fill="none"
            stroke="var(--el-color-primary)"
            stroke-width="2"
          /></svg></el-card></el-col></el-row>
      <el-card class="chart-card"><template #header><div class="card-header">
        <span>业务趋势</span><el-tabs model-value="month"><el-tab-pane label="日" name="day" /><el-tab-pane label="周" name="week" /><el-tab-pane label="月" name="month" /></el-tabs></div></template><el-row :gutter="16"><el-col :xs="24" :lg="12"><h3>收入</h3>
        <EChart :option="lineOption" /></el-col><el-col :xs="24" :sm="12" :lg="6"><h3>订单</h3>
        <EChart :option="barOption" height="280px" /></el-col><el-col :xs="24" :sm="12" :lg="6"><h3>渠道</h3>
        <EChart :option="pieOption" height="280px" /></el-col></el-row></el-card>
      <el-row :gutter="16"><el-col :xs="24" :lg="14"><el-card><template #header><div class="card-header">
                                                                <span>最近订单</span><el-link type="primary" href="/apps/element-plus/orders">查看全部</el-link>
                                                              </div></template>
        <div v-if="mobile" class="recent-cards">
          <div v-for="row in orders.slice(0, 5)" :key="row.id" class="recent-card">
            <div>
              <strong>{{ row.id }}</strong><span class="muted">{{ row.customer }}</span>
            </div>
            <div>
              <strong>¥{{ row.amount.toLocaleString() }}</strong><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
            </div>
          </div>
        </div>
        <div v-else class="table-scroll" data-scroll-x>
          <el-table :data="orders.slice(0, 5)"><el-table-column prop="id" label="订单号" min-width="120" /><el-table-column label="客户" min-width="130"><template #default="{ row }"><el-avatar :size="24">{{ row.customer.slice(0, 1) }}</el-avatar> {{ row.customer }}</template></el-table-column><el-table-column prop="product" label="产品" min-width="130" /><el-table-column label="金额" min-width="110"><template #default="{ row }">¥{{ row.amount.toLocaleString() }}</template></el-table-column><el-table-column label="状态" min-width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column min-width="60"><template #default><el-dropdown><el-button text><Icon name="more-horizontal" /></el-button><template #dropdown><el-dropdown-menu><el-dropdown-item>查看</el-dropdown-item><el-dropdown-item>编辑</el-dropdown-item></el-dropdown-menu></template></el-dropdown></template></el-table-column></el-table>
        </div></el-card></el-col><el-col :xs="24" :lg="5"><el-card><template #header>团队动态</template><el-timeline><el-timeline-item v-for="item in activity.slice(0, 4)" :key="item.action" :timestamp="item.time">{{ item.user }}{{ item.action }}</el-timeline-item></el-timeline></el-card></el-col><el-col :xs="24" :lg="5"><el-card><template #header>任务进度</template>
        <div v-for="task in tasks" :key="task.title" class="task">
          <div>
            <span>{{ task.title }}</span><small>{{ task.owner }}</small>
          </div>
          <el-progress :percentage="task.progress" :stroke-width="8" /></div></el-card></el-col></el-row>
    </template>
  </div>
</template>

<style scoped>
.stat-card {
  position: relative;
  overflow: hidden;
}
.stat-head,
.stat-foot,
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.stat-card strong {
  display: block;
  margin: 12px 0;
  font-size: 28px;
}
.stat-foot {
  justify-content: flex-start;
}
.sparkline {
  position: absolute;
  right: 12px;
  bottom: 18px;
  width: 100px;
  height: 30px;
  opacity: 0.6;
}
.chart-card,
.stat-card {
  margin-bottom: 16px;
}
.chart-card :deep(.el-tabs__header) {
  margin: -12px 0;
}
.task {
  display: grid;
  gap: 5px;
  margin-bottom: 18px;
}
.task div {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
}
.task small {
  color: var(--el-text-color-secondary);
}
.recent-cards {
  display: grid;
  gap: 12px;
}
.recent-card {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.recent-card > div {
  display: grid;
  gap: 6px;
}
.recent-card > div:last-child {
  justify-items: end;
}
</style>
