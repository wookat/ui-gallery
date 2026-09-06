<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import * as echarts from "echarts/core"
import { BarChart, LineChart, PieChart } from "echarts/charts"
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import type { EChartsCoreOption } from "echarts/core"
import { settings } from "@/settings"

echarts.use([BarChart, LineChart, PieChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

const props = withDefaults(defineProps<{ option: EChartsCoreOption; height?: number }>(), { height: 260 })
const el = ref<HTMLDivElement>()
let chart: echarts.ECharts | undefined
let observer: ResizeObserver | undefined

function render() {
  if (!el.value) return
  chart?.dispose()
  chart = echarts.init(el.value, settings.theme === "dark" ? "dark" : undefined, { renderer: "canvas" })
  chart.setOption({ backgroundColor: "transparent", ...props.option })
}
onMounted(() => {
  render()
  observer = new ResizeObserver(() => chart?.resize())
  if (el.value) observer.observe(el.value)
})
watch(() => [settings.theme, props.option], render, { deep: true })
onBeforeUnmount(() => {
  observer?.disconnect()
  chart?.dispose()
})
</script>

<template>
  <div ref="el" class="ug-chart" :style="{ height: `${height}px` }" />
</template>

<style>
.ug-chart { width: 100%; min-width: 0; }
</style>
