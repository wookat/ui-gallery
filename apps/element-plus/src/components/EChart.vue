<script setup lang="ts">
import * as echarts from "echarts"
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"

const props = defineProps<{ option: echarts.EChartsOption; height?: string }>()
const el = ref<HTMLElement>()
let chart: echarts.ECharts | undefined
let observer: ResizeObserver | undefined
const render = async () => {
  await nextTick()
  if (!el.value) return
  chart?.dispose()
  chart = echarts.init(el.value, document.documentElement.classList.contains("dark") ? "dark" : undefined)
  chart.setOption({ backgroundColor: "transparent", ...props.option })
}
onMounted(() => {
  render()
  observer = new ResizeObserver(() => chart?.resize())
  if (el.value) observer.observe(el.value)
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
})
watch(() => props.option, render, { deep: true })
onBeforeUnmount(() => { observer?.disconnect(); chart?.dispose() })
</script>

<template><div ref="el" class="echart" :style="{ height: props.height ?? '280px' }" /></template>
