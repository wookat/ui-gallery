import { Chart, type ChartConfiguration, type ChartType } from "chart.js/auto"

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function palette() {
  return {
    primary: cssVar("--color-primary-500"),
    secondary: cssVar("--color-secondary-500"),
    tertiary: cssVar("--color-tertiary-500"),
    success: cssVar("--color-success-500"),
    warning: cssVar("--color-warning-500"),
    text: cssVar("--color-surface-500"),
    grid: "color-mix(in oklab, " + cssVar("--color-surface-500") + " 20%, transparent)",
  }
}

// Svelte attachment/action: mounts a Chart.js chart on a canvas and disposes it on unmount.
export function chart<T extends ChartType>(canvas: HTMLCanvasElement, config: ChartConfiguration<T>) {
  const instance = new Chart(canvas, config)
  return {
    update(next: ChartConfiguration<T>) {
      instance.data = next.data
      instance.update()
    },
    destroy() {
      instance.destroy()
    },
  }
}
