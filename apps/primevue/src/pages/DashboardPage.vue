<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import Avatar from "primevue/avatar"
import Button from "primevue/button"
import Card from "primevue/card"
import Chart from "primevue/chart"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Menu from "primevue/menu"
import ProgressBar from "primevue/progressbar"
import SelectButton from "primevue/selectbutton"
import Skeleton from "primevue/skeleton"
import Tag from "primevue/tag"
import Timeline from "primevue/timeline"
import AppIcon from "@/icons/AppIcon.vue"
import PageHeader from "@/components/PageHeader.vue"
import SectionCard from "@/components/SectionCard.vue"
import StatusTag from "@/components/StatusTag.vue"
import stats from "@ui-gallery/spec/mock/stats.json"
import series from "@ui-gallery/spec/mock/series.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"

const loading = ref(true)
const chartPeriod = ref("month")
type Order = (typeof orders)[number]
type PopupApi = { toggle: (event: Event) => void }
const actionMenu = ref<PopupApi | null>(null)
const selectedOrder = ref<Order | null>(null)
const chartColors = ref({ primary: "#10b981", secondary: "#64748b", border: "#cbd5e1" })
const periods = ["day", "week", "month"]
const periodLabels: Record<string, string> = { day: "日", week: "周", month: "月" }

onMounted(() => {
  const styles = getComputedStyle(document.documentElement)
  chartColors.value = {
    primary: styles.getPropertyValue("--p-primary-color").trim() || "#10b981",
    secondary: styles.getPropertyValue("--p-surface-400").trim() || "#64748b",
    border: styles.getPropertyValue("--p-content-border-color").trim() || "#cbd5e1",
  }
  window.setTimeout(() => { loading.value = false }, 420)
})

const chartData = computed(() => {
  const factor = chartPeriod.value === "day" ? 0.72 : chartPeriod.value === "week" ? 0.88 : 1
  return {
    labels: series.months,
    datasets: [{
      label: "收入（万元）",
      data: series.revenue.map((value) => Math.round(value * factor)),
      borderColor: chartColors.value.primary,
      backgroundColor: `${chartColors.value.primary}22`,
      fill: true,
      tension: 0.35,
    }],
  }
})
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: chartColors.value.border } } },
}))
const channelData = computed(() => ({
  labels: series.byChannel.map((item) => item.name),
  datasets: [{ data: series.byChannel.map((item) => item.value), backgroundColor: [chartColors.value.primary, "#60a5fa", "#f59e0b", "#a78bfa"], borderWidth: 0 }],
}))
const channelOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
const recentOrders = orders.slice(0, 5)
const menuItems = [
  { label: "编辑", icon: "pi pi-pencil" },
  { label: "删除", icon: "pi pi-trash" },
]

function sparkline(values: number[]) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  return values.map((value, index) => `${(index / (values.length - 1)) * 100},${22 - ((value - min) / (max - min || 1)) * 18}`).join(" ")
}
function showSkeleton() {
  loading.value = true
  window.setTimeout(() => { loading.value = false }, 420)
}
function formatValue(item: (typeof stats)[number]) {
  if (item.unit === "CNY") return `¥${item.value.toLocaleString()}`
  return `${item.value.toLocaleString()}${item.unit ?? ""}`
}
</script>

<template>
  <div class="page">
    <PageHeader title="仪表盘" description="查看业务概览与团队进展">
      <Button label="显示骨架屏" icon="pi pi-eye" severity="secondary" outlined size="small" @click="showSkeleton" />
    </PageHeader>

    <div v-if="loading" class="grid grid-4">
      <Card v-for="item in stats" :key="item.key"><template #content><div class="col gap-3"><Skeleton width="45%" /><Skeleton width="65%" height="2rem" /><Skeleton width="100%" height="1.5rem" /></div></template></Card>
    </div>
    <div v-else class="grid grid-4">
      <Card v-for="item in stats" :key="item.key">
        <template #content>
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0"><div class="text-sm muted">{{ item.label }}</div><div class="text-xl font-bold tabular mt-1">{{ formatValue(item) }}</div></div>
            <Tag :value="`${item.delta > 0 ? '+' : ''}${item.delta}%`" :severity="item.delta >= 0 ? 'success' : 'danger'" />
          </div>
          <svg class="sparkline" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true"><polyline :points="sparkline(item.trend)" fill="none" stroke="var(--p-primary-color)" stroke-width="2" /></svg>
        </template>
      </Card>
    </div>

    <SectionCard title="收入趋势" description="按周期查看收入变化">
      <template #actions><SelectButton v-model="chartPeriod" :options="periods" :allow-empty="false"><template #option="{ option }">{{ periodLabels[option] }}</template></SelectButton></template>
      <div class="grid grid-3">
        <div class="chart-box span-2"><Chart type="line" :data="chartData" :options="chartOptions" /></div>
        <div class="chart-box"><Chart type="doughnut" :data="channelData" :options="channelOptions" /></div>
      </div>
    </SectionCard>

    <div class="grid grid-3">
      <SectionCard title="最近订单" class="span-2" flush>
        <div v-if="loading" class="col gap-3 p-4"><Skeleton v-for="n in 5" :key="n" height="2.5rem" /></div>
        <div v-else class="table-scroll">
          <DataTable :value="recentOrders" size="small" striped-rows>
            <Column field="id" header="订单号" />
            <Column header="客户">
              <template #body="{ data }"><div class="flex items-center gap-2"><Avatar :label="data.customer.slice(0, 1)" shape="circle" size="small" /><span>{{ data.customer }}</span></div></template>
            </Column>
            <Column field="status" header="状态"><template #body="{ data }"><StatusTag :status="data.status" /></template></Column>
            <Column field="amount" header="金额" body-class="text-right tabular"><template #body="{ data }">¥{{ data.amount.toLocaleString() }}</template></Column>
            <Column header="" style="width: 3rem"><template #body="{ data }"><Button icon="pi pi-ellipsis-v" text rounded severity="secondary" aria-label="订单操作" @click="selectedOrder = data; actionMenu?.toggle($event)" /></template></Column>
          </DataTable>
          <Menu ref="actionMenu" :model="menuItems" popup />
        </div>
      </SectionCard>
      <SectionCard title="任务进度">
        <div class="col gap-4">
          <div v-for="task in tasks" :key="task.title" class="col gap-1">
            <div class="flex justify-between gap-2 text-sm"><span class="truncate">{{ task.title }}</span><span class="muted tabular">{{ task.progress }}%</span></div>
            <ProgressBar :value="task.progress" :show-value="false" style="height: 6px" />
            <span class="text-xs muted">{{ task.owner }}</span>
          </div>
        </div>
      </SectionCard>
    </div>

    <SectionCard title="团队动态">
      <Timeline :value="activity" layout="vertical" align="left">
        <template #opposite="{ item }"><span class="text-xs muted">{{ item.time }}</span></template>
        <template #marker><span class="timeline-marker"><AppIcon name="check" :size="12" /></span></template>
        <template #content="{ item }"><span class="text-sm"><strong>{{ item.user }}</strong> {{ item.action }}</span></template>
      </Timeline>
    </SectionCard>
  </div>
</template>

<style scoped>
.sparkline { width: 100%; height: 28px; margin-top: 14px; overflow: visible; }
.chart-box { min-width: 0; height: 220px; }
.chart-box.span-2 { height: 260px; }
.chart-box :deep(.p-chart) { height: 100%; }
.chart-box :deep(canvas) { height: 100% !important; }
.timeline-marker { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: var(--p-primary-color); color: var(--p-primary-contrast-color); }
@media (max-width: 767px) { .chart-box, .chart-box.span-2 { height: 220px; } }
</style>
