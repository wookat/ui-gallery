import Chart from "chart.js/auto"
import activity from "@ui-gallery/spec/mock/activity.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import { icon } from "../icons"

const money = (value: number) => `¥${value.toLocaleString()}`
const statusLabels: Record<string, string> = { paid: "已支付", pending: "待处理", shipped: "已发货", failed: "失败", refunded: "已退款" }
const status = (value: string) => `<span class="status status-${value}">${statusLabels[value] ?? value}</span>`
const sparkline = (values: number[]) => {
  const max = Math.max(...values), min = Math.min(...values)
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${38 - ((value - min) / ((max - min) || 1)) * 32}`).join(" ")
  return `<svg class="sparkline" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><polyline points="${points}" fill="none" stroke="currentColor" stroke-width="2" /></svg>`
}

export function render(): string {
  const loading = new URLSearchParams(window.location.search).get("state") === "loading"
  if (loading) return `<div class="page-heading"><div><h1>仪表盘</h1><p>欢迎回来，林晓。这里是今天的业务概况。</p></div></div><div class="stats-grid">${[1, 2, 3, 4].map(() => `<article class="skeleton" aria-busy="true"></article>`).join("")}</div>`
  return `<div class="page-heading"><div><small>ACME CONSOLE</small><h1>仪表盘</h1><p>欢迎回来，林晓。这里是今天的业务概况。</p></div><a role="button" data-link href="/form">${icon("plus")}新建项目</a></div>
  <section class="stats-grid">${stats.map((item) => `<article><small>${item.label}</small><div class="stat-value">${item.unit === "CNY" ? money(item.value) : `${item.value}${item.unit ?? ""}`}</div><span class="${item.delta > 0 ? "delta-up" : "delta-down"}">${icon(item.delta > 0 ? "trending-up" : "trending-down", 14)} ${item.delta > 0 ? "+" : ""}${item.delta}%</span>${sparkline(item.trend)}</article>`).join("")}</section>
  <section class="dashboard-grid"><article><header><h2>业务趋势</h2><div role="tablist" class="tab-buttons"><button role="tab" aria-selected="true">日</button><button class="outline" role="tab" aria-selected="false">周</button><button class="outline" role="tab" aria-selected="false">月</button></div></header><div class="chart-grid"><div class="chart-box"><canvas id="revenue-chart"></canvas></div><div class="chart-box"><canvas id="channel-chart"></canvas></div></div></article>
  <article><header><h2>任务进度</h2></header><div>${tasks.map((task) => `<label>${task.title}<progress value="${task.progress}" max="100"></progress><small>${task.owner} · ${task.progress}%</small></label>`).join("")}</div></article></section>
  <section class="dashboard-grid"><article><header><h2>最近订单</h2></header><figure class="overflow-auto"><table class="striped"><thead><tr><th>订单号</th><th>客户</th><th>状态</th><th>金额</th><th>操作</th></tr></thead><tbody>${orders.slice(0, 5).map((order) => `<tr><td>${order.id}</td><td><span class="avatar">${order.customer.slice(0, 1)}</span> ${order.customer}</td><td>${status(order.status)}</td><td>${money(order.amount)}</td><td><details class="dropdown"><summary>${icon("ellipsis-horizontal")}</summary><ul><li><a href="/orders">查看详情</a></li></ul></details></td></tr>`).join("")}</tbody></table></figure></article>
  <article><header><h2>团队动态</h2></header><ul class="timeline">${activity.map((item) => `<li><div><strong>${item.user}</strong> ${item.action}<small>${item.time}</small></div></li>`).join("")}</ul></article></section>`
}

export function mount(root: HTMLElement): void {
  const color = getComputedStyle(document.documentElement).getPropertyValue("--pico-color").trim()
  const grid = getComputedStyle(document.documentElement).getPropertyValue("--pico-muted-border-color").trim()
  const primary = getComputedStyle(document.documentElement).getPropertyValue("--pico-primary").trim()
  let revenue: Chart | undefined
  let channel: Chart | undefined
  const draw = () => {
    revenue?.destroy(); channel?.destroy()
    const revenueCanvas = root.querySelector<HTMLCanvasElement>("#revenue-chart")
    const channelCanvas = root.querySelector<HTMLCanvasElement>("#channel-chart")
    if (revenueCanvas) revenue = new Chart(revenueCanvas, { type: "line", data: { labels: series.months, datasets: [{ label: "收入", data: series.revenue, borderColor: primary, backgroundColor: "transparent", pointBackgroundColor: primary, tension: .35 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { color }, grid: { color: grid } }, y: { ticks: { color }, grid: { color: grid } } } } })
    if (channelCanvas) channel = new Chart(channelCanvas, { type: "doughnut", data: { labels: series.byChannel.map((item) => item.name), datasets: [{ data: series.byChannel.map((item) => item.value), backgroundColor: ["#0172ad", "#8a4baf", "#d81b60", "#5a9216"] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color } } } } })
  }
  draw()
  window.addEventListener("themechange", draw)
}
