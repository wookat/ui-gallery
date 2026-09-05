<script setup lang="ts">
import { computed } from "vue"
import VChart from "vue-echarts"
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { LineChart, BarChart, PieChart } from "echarts/charts"
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { useThemeVars } from "naive-ui"
import series from "@ui-gallery/spec/mock/series.json"
import { isDark } from "../settings"

use([CanvasRenderer, LineChart, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent])
const props = defineProps<{ kind: "line" | "bar" | "pie"; height?: number }>()
const vars = useThemeVars()
const option = computed(() => {
  const text = { color: vars.value.textColor2 }
  const axis = { axisLine: { lineStyle: { color: vars.value.borderColor } }, axisLabel: text, splitLine: { lineStyle: { color: vars.value.dividerColor } } }
  if (props.kind === "pie") {
    return { color: [vars.value.primaryColor, vars.value.infoColor, vars.value.warningColor, vars.value.errorColor], tooltip: { trigger: "item" }, legend: { bottom: 0, textStyle: text }, series: [{ type: "pie", radius: ["45%", "70%"], center: ["50%", "42%"], data: series.byChannel, label: { color: vars.value.textColor2 } }] }
  }
  return {
    color: [vars.value.primaryColor, vars.value.infoColor],
    tooltip: { trigger: "axis" },
    grid: { left: 40, right: 16, top: 24, bottom: 28 },
    xAxis: { type: "category", data: series.months, ...axis },
    yAxis: { type: "value", ...axis },
    series: props.kind === "line"
      ? [{ name: "收入(千)", type: "line", smooth: true, areaStyle: { opacity: 0.12 }, data: series.revenue }]
      : [{ name: "订单", type: "bar", barMaxWidth: 28, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: series.orders }],
  }
})
</script>

<template>
  <VChart :option="option" :theme="isDark ? 'dark' : undefined" :init-options="{ renderer: 'canvas' }" autoresize :style="{ height: `${height ?? 280}px`, width: '100%', background: 'transparent' }" />
</template>
