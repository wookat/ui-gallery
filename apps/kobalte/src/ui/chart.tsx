/* eslint-disable no-unassigned-vars */
import { Chart, type ChartConfiguration } from "chart.js/auto"
import { onCleanup, onMount } from "solid-js"

export function ChartCanvas(props: { config: ChartConfiguration; class?: string }) {
  let canvas: HTMLCanvasElement | undefined
  onMount(() => {
    if (!canvas) return
    const chart = new Chart(canvas, props.config)
    onCleanup(() => chart.destroy())
  })
  return <canvas ref={canvas} class={`block max-w-full ${props.class ?? ""}`} />
}
