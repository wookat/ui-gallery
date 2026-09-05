<script setup lang="ts">
import { onMounted, ref } from "vue"
import { NGrid, NGi, NCard, NStatistic, NTag, NRadioGroup, NRadioButton, NDataTable, NAvatar, NTimeline, NTimelineItem, NProgress, NSkeleton, NFlex, NText, NButton, NDropdown, NSpace, type DataTableColumns } from "naive-ui"
import { h } from "vue"
import stats from "@ui-gallery/spec/mock/stats.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import PageHeader from "../components/PageHeader.vue"
import StatusTag from "../components/StatusTag.vue"
import ChartBlock from "../components/ChartBlock.vue"
import { Icon, renderIcon } from "../icons"
import { formatMoney } from "../composables"

const loading = ref(true)
onMounted(() => setTimeout(() => { loading.value = false }, 600))
const period = ref("week")
type Order = (typeof orders)[number]
const recent = orders.slice(0, 5)
const columns: DataTableColumns<Order> = [
  { title: "订单", key: "id", render: (row) => h(NFlex, { align: "center", wrap: false }, () => [h(NAvatar, { round: true, size: "small" }, () => row.customer[0]), h("div", [h("div", row.id), h(NText, { depth: 3, style: "font-size:12px" }, () => row.customer)])]) },
  { title: "状态", key: "status", render: (row) => h(StatusTag, { value: row.status }) },
  { title: "日期", key: "date" },
  { title: "金额", key: "amount", align: "right", render: (row) => formatMoney(row.amount) },
  { title: "", key: "actions", width: 56, render: () => h(NDropdown, { options: [{ key: "view", label: "查看", icon: renderIcon("eye") }, { key: "edit", label: "编辑", icon: renderIcon("pencil") }, { key: "delete", label: "删除", icon: renderIcon("trash") }], trigger: "click" }, () => h(NButton, { quaternary: true, circle: true, size: "small", "aria-label": "更多操作" }, { icon: renderIcon("more-horizontal", 16) })) },
]
function sparkline(trend: number[]) {
  const max = Math.max(...trend), min = Math.min(...trend)
  return trend.map((v, i) => `${(i / (trend.length - 1)) * 100},${100 - ((v - min) / (max - min || 1)) * 100}`).join(" ")
}
function formatValue(s: (typeof stats)[number]) {
  if (s.unit === "CNY") return formatMoney(s.value)
  if (s.unit === "%") return `${s.value}%`
  return s.value.toLocaleString("zh-CN")
}
</script>

<template>
  <NSpace vertical :size="20">
    <PageHeader title="仪表盘" description="业务概览、近期订单与团队动态。">
      <template #action>
        <NRadioGroup v-model:value="period" size="small">
          <NRadioButton value="day">日</NRadioButton><NRadioButton value="week">周</NRadioButton><NRadioButton value="month">月</NRadioButton>
        </NRadioGroup>
      </template>
    </PageHeader>
    <NGrid cols="1 s:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="s in stats" :key="s.key">
        <NCard size="small">
          <NSkeleton v-if="loading" text :repeat="2" />
          <template v-else>
            <NFlex justify="space-between" align="start" :wrap="false">
              <NStatistic :label="s.label"><span style="font-size: 22px; font-weight: 600">{{ formatValue(s) }}</span></NStatistic>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="72" height="32" aria-hidden="true"><polyline :points="sparkline(s.trend)" fill="none" :stroke="s.delta >= 0 ? '#18a058' : '#d03050'" stroke-width="4" vector-effect="non-scaling-stroke" /></svg>
            </NFlex>
            <NTag :type="s.delta >= 0 ? 'success' : 'error'" size="small" round :bordered="false" style="margin-top: 8px"><template #icon><Icon :name="s.delta >= 0 ? 'trending-up' : 'trending-down'" :size="12" /></template>{{ s.delta >= 0 ? "+" : "" }}{{ s.delta }}% 同比</NTag>
          </template>
        </NCard>
      </NGi>
    </NGrid>
    <NGrid cols="1 l:3" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi span="1 l:2"><NCard title="收入趋势" size="small"><NSkeleton v-if="loading" height="280px" :sharp="false" /><ChartBlock v-else kind="line" /></NCard></NGi>
      <NGi><NCard title="渠道占比" size="small"><NSkeleton v-if="loading" height="280px" :sharp="false" /><ChartBlock v-else kind="pie" /></NCard></NGi>
    </NGrid>
    <NGrid cols="1 l:3" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi span="1 l:2">
        <NCard title="最近订单" size="small" content-style="padding: 0 0 8px">
          <NDataTable :columns="columns" :data="recent" :loading="loading" :bordered="false" :scroll-x="560" size="small" />
        </NCard>
      </NGi>
      <NGi>
        <NSpace vertical :size="16">
          <NCard title="团队动态" size="small">
            <NTimeline>
              <NTimelineItem v-for="(a, i) in activity" :key="i" :type="i === 0 ? 'success' : 'default'" :title="a.user" :content="a.action" :time="a.time" />
            </NTimeline>
          </NCard>
          <NCard title="任务进度" size="small">
            <NSpace vertical :size="12">
              <div v-for="t in tasks" :key="t.title">
                <NFlex justify="space-between"><NText>{{ t.title }}</NText><NText depth="3" style="font-size: 12px">{{ t.owner }}</NText></NFlex>
                <NProgress type="line" :percentage="t.progress" :status="t.progress >= 90 ? 'success' : 'default'" :height="8" />
              </div>
            </NSpace>
          </NCard>
        </NSpace>
      </NGi>
    </NGrid>
    <NCard title="订单量" size="small"><NSkeleton v-if="loading" height="220px" :sharp="false" /><ChartBlock v-else kind="bar" :height="220" /></NCard>
  </NSpace>
</template>
