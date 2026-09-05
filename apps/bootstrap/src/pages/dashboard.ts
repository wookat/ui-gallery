import { Chart, LineController, BarController, DoughnutController, LineElement, PointElement, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, Filler } from "chart.js"
import { icon } from "../lib/icons"
import { avatar, each, esc, money } from "../lib/html"
import { activity, orders, series, stats, tasks, STATUS_COLOR, STATUS_LABEL } from "../lib/data"
import { href } from "../lib/router"
import { isDark, params } from "../lib/settings"
import type { PageResult } from "./types"

Chart.register(LineController, BarController, DoughnutController, LineElement, PointElement, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, Filler)

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

function sparkline(points: number[], positive: boolean) {
  const min = Math.min(...points), max = Math.max(...points)
  const w = 96, h = 32
  const coords = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / (max - min || 1)) * (h - 4) - 2}`).join(" ")
  return `<svg class="sparkline" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke="var(--bs-${positive ? "success" : "danger"})" stroke-width="2" points="${coords}"/></svg>`
}

function statValue(s: (typeof stats)[number]) {
  if (s.unit === "CNY") return money(s.value)
  if (s.unit === "%") return `${s.value}%`
  return s.value.toLocaleString("zh-CN")
}

function statCards() {
  return each(stats, (s) => {
    const up = s.delta >= 0
    return `<div class="col-12 col-sm-6 col-xl-3"><div class="card h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <span class="text-body-secondary small">${esc(s.label)}</span>
          <span class="badge rounded-pill ${up ? "text-bg-success" : "text-bg-danger"} d-inline-flex align-items-center gap-1">${icon(up ? "arrow-up" : "arrow-down")}${Math.abs(s.delta)}%</span>
        </div>
        <div class="fs-3 fw-semibold my-1">${statValue(s)}</div>
        <div class="d-flex align-items-center gap-2"><small class="text-body-secondary text-nowrap">较上月</small>${sparkline(s.trend, up)}</div>
      </div></div></div>`
  })
}

function skeletonCards() {
  return each([1, 2, 3, 4], () => `<div class="col-12 col-sm-6 col-xl-3"><div class="card h-100" aria-hidden="true"><div class="card-body placeholder-glow">
    <span class="placeholder col-5"></span><span class="placeholder col-8 placeholder-lg d-block my-2"></span><span class="placeholder col-12"></span></div></div></div>`)
}

function skeletonCard(rows = 5) {
  return `<div class="card h-100" aria-hidden="true"><div class="card-header placeholder-glow"><span class="placeholder col-4"></span></div><div class="card-body placeholder-glow">${each(Array.from({ length: rows }), () => `<span class="placeholder col-12 d-block mb-3"></span>`)}</div></div>`
}

function recentOrders() {
  return `<div class="card h-100">
    <div class="card-header d-flex justify-content-between align-items-center"><span class="fw-semibold">最近订单</span><a href="${href("/orders")}" data-link="/orders" class="small text-decoration-none">查看全部 ${icon("arrow-right")}</a></div>
    <div class="table-responsive"><table class="table table-hover align-middle mb-0">
      <thead><tr><th>订单</th><th>客户</th><th class="d-none d-sm-table-cell">状态</th><th class="text-end">金额</th><th class="text-end"><span class="visually-hidden">操作</span></th></tr></thead>
      <tbody>${each(orders.slice(0, 5), (o) => `<tr>
        <td class="text-nowrap"><code>${o.id}</code></td>
        <td><div class="d-flex align-items-center gap-2"><span class="d-none d-md-inline-flex">${avatar(o.customer, 28)}</span><span class="text-nowrap">${esc(o.customer)}</span></div></td>
        <td class="d-none d-sm-table-cell"><span class="badge rounded-pill text-bg-${STATUS_COLOR[o.status]}">${STATUS_LABEL[o.status]}</span></td>
        <td class="text-end text-nowrap">${money(o.amount, o.currency)}</td>
        <td class="text-end"><div class="dropdown"><button class="btn btn-link px-2" data-bs-toggle="dropdown" aria-label="操作">${icon("more-horizontal")}</button>
          <ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item" href="${href("/orders")}" data-link="/orders">查看</a></li><li><button class="dropdown-item" type="button">复制订单号</button></li><li><hr class="dropdown-divider"></li><li><button class="dropdown-item text-danger" type="button">删除</button></li></ul></div></td>
      </tr>`)}</tbody></table></div></div>`
}

function timeline() {
  return `<div class="card h-100"><div class="card-header fw-semibold">团队动态</div>
    <ul class="list-group list-group-flush">${each(activity, (a, i) => `<li class="list-group-item d-flex gap-3">
      <div class="d-flex flex-column align-items-center"><span class="rounded-circle bg-primary flex-shrink-0 mt-2" style="width:10px;height:10px"></span>${i < activity.length - 1 ? `<span class="flex-grow-1 border-start mt-1"></span>` : ""}</div>
      <div class="min-w-0"><div><span class="fw-semibold">${esc(a.user)}</span> <span class="text-body-secondary">${esc(a.action)}</span></div><small class="text-body-secondary">${esc(a.time)}</small></div></li>`)}</ul></div>`
}

function taskList() {
  return `<div class="card h-100"><div class="card-header fw-semibold">任务进度</div>
    <ul class="list-group list-group-flush">${each(tasks, (t) => `<li class="list-group-item">
      <div class="d-flex justify-content-between mb-1"><span class="fw-medium">${esc(t.title)}</span><small class="text-body-secondary">${esc(t.owner)} · ${t.progress}%</small></div>
      <div class="progress" role="progressbar" aria-label="${esc(t.title)}" aria-valuenow="${t.progress}" aria-valuemin="0" aria-valuemax="100" style="height:6px"><div class="progress-bar ${t.progress >= 90 ? "bg-success" : ""}" style="width:${t.progress}%"></div></div></li>`)}</ul></div>`
}

export function renderDashboard(): PageResult {
  const loading = params().get("state") === "loading"
  const body = loading
    ? `<div class="row g-3 mb-3">${skeletonCards()}</div><div class="row g-3 mb-3"><div class="col-12 col-xl-8">${skeletonCard(6)}</div><div class="col-12 col-xl-4">${skeletonCard(6)}</div></div><div class="row g-3"><div class="col-12 col-xl-6">${skeletonCard()}</div><div class="col-12 col-xl-3">${skeletonCard()}</div><div class="col-12 col-xl-3">${skeletonCard()}</div></div>`
    : `<div class="row g-3 mb-3">${statCards()}</div>
    <div class="row g-3 mb-3">
      <div class="col-12 col-xl-8"><div class="card h-100"><div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2"><span class="fw-semibold">收入与订单趋势</span>
        <ul class="nav nav-pills nav-sm gap-1" role="tablist" id="periodTabs">
          <li class="nav-item" role="presentation"><button class="nav-link py-1 px-2 small" data-period="day" type="button" role="tab" aria-selected="false">日</button></li>
          <li class="nav-item" role="presentation"><button class="nav-link py-1 px-2 small" data-period="week" type="button" role="tab" aria-selected="false">周</button></li>
          <li class="nav-item" role="presentation"><button class="nav-link py-1 px-2 small active" data-period="month" type="button" role="tab" aria-selected="true">月</button></li>
        </ul></div>
        <div class="card-body"><div style="height:280px"><canvas id="lineChart" role="img" aria-label="收入折线图"></canvas></div></div></div></div>
      <div class="col-12 col-xl-4"><div class="card h-100"><div class="card-header fw-semibold">渠道占比</div><div class="card-body d-flex flex-column"><div style="height:200px"><canvas id="donutChart" role="img" aria-label="渠道环形图"></canvas></div>
        <div class="mt-3" style="height:100px"><canvas id="barChart" role="img" aria-label="订单柱状图"></canvas></div></div></div></div>
    </div>
    <div class="row g-3">
      <div class="col-12 col-xl-6">${recentOrders()}</div>
      <div class="col-12 col-md-6 col-xl-3">${timeline()}</div>
      <div class="col-12 col-md-6 col-xl-3">${taskList()}</div>
    </div>`

  const html = `<div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
    <div><h1 class="h3 mb-0">仪表盘</h1><p class="text-body-secondary mb-0">欢迎回来，林晓。以下是 Acme Console 的今日概览。</p></div>
    <div class="d-flex gap-2"><button type="button" class="btn btn-outline-secondary" id="dashRefresh">${icon("refresh")} 刷新</button><a class="btn btn-primary" href="${href("/form")}" data-link="/form">${icon("plus")} 新建项目</a></div>
  </div><div id="dashBody">${body}</div>`

  const mount = (root: HTMLElement) => {
    const charts: Chart[] = []
    const draw = () => {
      const line = root.querySelector<HTMLCanvasElement>("#lineChart")
      if (!line) return
      const grid = isDark() ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.08)"
      const text = cssVar("--bs-secondary-color")
      const primary = cssVar("--bs-primary"), success = cssVar("--bs-success"), info = cssVar("--bs-info"), warning = cssVar("--bs-warning")
      const common = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: text } } } }
      charts.push(new Chart(line, { type: "line", data: { labels: series.months, datasets: [{ label: "收入（千元）", data: series.revenue, borderColor: primary, backgroundColor: `${primary}33`, fill: true, tension: 0.35 }, { label: "订单数（÷10）", data: series.orders.map((o) => o / 10), borderColor: success, tension: 0.35 }] }, options: { ...common, scales: { x: { grid: { color: grid }, ticks: { color: text } }, y: { grid: { color: grid }, ticks: { color: text } } } } }))
      charts.push(new Chart(root.querySelector<HTMLCanvasElement>("#donutChart")!, { type: "doughnut", data: { labels: series.byChannel.map((c) => c.name), datasets: [{ data: series.byChannel.map((c) => c.value), backgroundColor: [primary, success, info, warning], borderWidth: 0 }] }, options: { ...common, cutout: "70%", plugins: { legend: { position: "right", labels: { color: text, boxWidth: 12 } } } } }))
      charts.push(new Chart(root.querySelector<HTMLCanvasElement>("#barChart")!, { type: "bar", data: { labels: series.months, datasets: [{ label: "订单", data: series.orders, backgroundColor: primary, borderRadius: 4 }] }, options: { ...common, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } } }))
    }
    draw()
    const tabs = root.querySelector("#periodTabs")
    tabs?.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-period]")
      if (!btn) return
      tabs.querySelectorAll(".nav-link").forEach((n) => { n.classList.remove("active"); n.setAttribute("aria-selected", "false") })
      btn.classList.add("active"); btn.setAttribute("aria-selected", "true")
      const factor = btn.dataset.period === "day" ? 1 / 30 : btn.dataset.period === "week" ? 1 / 4 : 1
      const chart = charts[0]
      chart.data.datasets[0].data = series.revenue.map((v) => Math.round(v * factor * 10) / 10)
      chart.data.datasets[1].data = series.orders.map((v) => Math.round((v / 10) * factor * 10) / 10)
      chart.update()
    })
    root.querySelector("#dashRefresh")?.addEventListener("click", () => {
      const body = root.querySelector("#dashBody")!
      const content = body.innerHTML
      body.innerHTML = `<div class="row g-3 mb-3">${skeletonCards()}</div><div class="row g-3"><div class="col-12 col-xl-8">${skeletonCard(6)}</div><div class="col-12 col-xl-4">${skeletonCard(6)}</div></div>`
      window.setTimeout(() => { body.innerHTML = content; charts.splice(0).forEach((c) => c.destroy()); draw() }, 900)
    })
    return () => charts.forEach((c) => c.destroy())
  }
  return { html, mount }
}
