<script setup lang="ts">
import { computed, ref } from "vue"
import { useRoute } from "vue-router"
import stats from "@ui-gallery/spec/mock/stats.json"
import series from "@ui-gallery/spec/mock/series.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import Icon from "@/components/Icon.vue"

const route = useRoute()
const period = ref("月")
const state = computed(() => route.query.state)
const statusColor = (status: string) => ({ paid: "success", pending: "warning", refunded: "info", failed: "error", shipped: "primary" }[status] ?? "secondary")
const statusLabel = (status: string) => ({ paid: "已支付", pending: "处理中", refunded: "已退款", failed: "失败", shipped: "已发货" }[status] ?? status)
const money = (value: number) => new Intl.NumberFormat("zh-CN").format(value)
</script>

<template>
  <div>
    <template v-if="state === 'loading'">
      <v-skeleton-loader type="heading, paragraph, card@4, table" />
    </template>
    <template v-else-if="state === 'empty'">
      <v-empty-state icon="$vuetify" title="暂时没有仪表盘数据" text="稍后再回来查看最新业务概览。" />
    </template>
    <template v-else-if="state === 'error'">
      <v-alert type="error" variant="tonal" title="数据加载失败" text="请稍后重试。"><template #append><v-btn variant="outlined">重试</v-btn></template></v-alert>
    </template>
    <template v-else>
      <div class="d-flex align-start justify-space-between flex-wrap ga-3 mb-6">
        <div><h1 class="text-h5 text-sm-h4">仪表盘</h1><p class="text-body-2 text-medium-emphasis mt-1">欢迎回来，查看团队今天的业务表现。</p></div>
        <v-btn-toggle v-model="period" mandatory divided density="comfortable"><v-btn value="日">日</v-btn><v-btn value="周">周</v-btn><v-btn value="月">月</v-btn></v-btn-toggle>
      </div>
      <v-row>
        <v-col v-for="item in stats" :key="item.key" cols="12" sm="6" lg="3">
          <v-card height="100%" class="pa-4">
            <div class="d-flex justify-space-between align-start">
              <span class="text-body-2 text-medium-emphasis">{{ item.label }}</span>
              <v-chip size="small" :color="item.delta >= 0 ? 'success' : 'error'" variant="tonal">
                <Icon :name="item.delta >= 0 ? 'trending-up' : 'trending-down'" size="14" />{{ Math.abs(item.delta) }}%
              </v-chip>
            </div>
            <div class="text-h5 font-weight-bold mt-3">{{ item.unit === "CNY" ? "¥" : "" }}{{ money(item.value) }}{{ item.unit === "%" ? "%" : "" }}</div>
            <v-sparkline :model-value="item.trend" color="primary" height="42" smooth padding="4" line-width="2" class="mt-2" />
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-1">
        <v-col cols="12" md="7"><v-card title="收入趋势" subtitle="过去 7 个月"><v-card-text><v-sparkline :model-value="series.revenue" :labels="series.months" color="primary" height="220" smooth padding="8" line-width="3" fill /></v-card-text></v-card></v-col>
        <v-col cols="12" md="5"><v-card title="订单与渠道" subtitle="订单量及来源分布"><v-card-text><v-sparkline :model-value="series.orders" type="bar" color="secondary" height="100" padding="8" /><div class="d-flex justify-center mt-2"><v-pie :items="series.byChannel" :inner-cut="60" :size="150" /></div></v-card-text></v-card></v-col>
      </v-row>
      <v-row class="mt-1">
        <v-col cols="12" lg="8">
          <v-card title="最近订单">
            <v-data-table :headers="[{ title: '订单', key: 'id' }, { title: '客户', key: 'customer' }, { title: '金额', key: 'amount', align: 'end' }, { title: '状态', key: 'status' }, { title: '', key: 'actions', sortable: false }]" :items="orders.slice(0, 5)" hide-default-footer density="comfortable">
              <template #[`item.customer`]="{ item }"><div class="d-flex align-center ga-2"><v-avatar size="28" color="primary" variant="tonal">{{ item.customer.slice(0, 1) }}</v-avatar>{{ item.customer }}</div></template>
              <template #[`item.amount`]="{ item }"><span class="font-weight-medium">¥{{ money(item.amount) }}</span></template>
              <template #[`item.status`]="{ item }"><v-chip size="small" :color="statusColor(item.status)" variant="tonal">{{ statusLabel(item.status) }}</v-chip></template>
              <template #[`item.actions`]="{}"><v-menu><template #activator="{ props }"><v-btn v-bind="props" icon variant="text" size="small"><Icon name="ellipsis" /></v-btn></template><v-list density="compact"><v-list-item title="编辑" /><v-list-item title="删除" /></v-list></v-menu></template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="12" lg="4">
          <v-card title="团队动态"><v-timeline density="compact" side="end" class="pa-4"><v-timeline-item v-for="item in activity" :key="item.time" dot-color="primary" size="small"><div class="text-body-2"><strong>{{ item.user }}</strong> {{ item.action }}</div><div class="text-caption text-medium-emphasis">{{ item.time }}</div></v-timeline-item></v-timeline></v-card>
          <v-card title="任务进度" class="mt-4"><v-list density="compact"><v-list-item v-for="task in tasks" :key="task.title" :title="task.title" :subtitle="task.owner"><template #append><span class="text-caption">{{ task.progress }}%</span></template><v-progress-linear :model-value="task.progress" color="primary" rounded class="mt-2" /></v-list-item></v-list></v-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>
