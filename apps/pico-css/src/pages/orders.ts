import orders from "@ui-gallery/spec/mock/orders.json"
import { icon } from "../icons"

type Order = (typeof orders)[number]
const money = (value: number) => `¥${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
const status = (value: string) => `<span class="status status-${value}">${value}</span>`

export function render(): string {
  const state = new URLSearchParams(window.location.search).get("state")
  if (state === "loading") return `<div class="page-heading"><div><h1>订单管理</h1><p>搜索、筛选并查看全部订单。</p></div></div><article aria-busy="true"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></article>`
  if (state === "error") return `<div class="page-heading"><div><h1>订单管理</h1><p>搜索、筛选并查看全部订单。</p></div></div><article class="alert-error" role="alert"><strong>加载订单失败</strong><p>请重试。</p><button id="retry-orders">重试</button></article>`
  return `<div class="page-heading"><div><small>ACME CONSOLE</small><h1>订单管理</h1><p>搜索、筛选并查看全部订单。</p></div><button class="outline" id="export-orders">${icon("download")}导出</button></div>
  <article><div class="toolbar orders-toolbar"><label class="grow"><span class="visually-hidden">搜索订单号或客户</span><input id="order-query" type="search" placeholder="搜索订单号或客户" aria-label="搜索订单号或客户" /></label><label><span class="visually-hidden">状态</span><select id="order-status" aria-label="状态"><option value="all">全部状态</option><option>paid</option><option>pending</option><option>shipped</option><option>failed</option><option>refunded</option></select></label><label><span class="visually-hidden">开始日期</span><input type="date" id="order-start" aria-label="开始日期" /></label><label><span class="visually-hidden">结束日期</span><input type="date" id="order-end" aria-label="结束日期" /></label><details class="dropdown"><summary role="button" class="outline">${icon("filter")}筛选</summary><ul><li><label><input type="checkbox" checked /> Web</label></li><li><label><input type="checkbox" checked /> iOS</label></li><li><label><input type="checkbox" checked /> Android</label></li></ul></details><details class="dropdown"><summary role="button" class="outline">${icon("sliders")}列</summary><ul><li><label><input type="checkbox" checked /> 客户</label></li><li><label><input type="checkbox" checked /> 金额</label></li></ul></details></div>
  <figure class="overflow-auto"><table class="striped" id="orders-table"><thead><tr><th><input id="select-all" type="checkbox" aria-label="全选" /></th><th><button class="outline sort-button" data-sort="id">订单号 ${icon("chevron-down")}</button></th><th>客户</th><th>状态</th><th><button class="outline sort-button" data-sort="date">日期 ${icon("chevron-down")}</button></th><th style="text-align:right"><button class="outline sort-button" data-sort="amount">金额 ${icon("chevron-down")}</button></th><th>操作</th></tr></thead><tbody id="orders-body"></tbody></table></figure>
  <footer class="grid"><button class="outline" disabled>上一页</button><button aria-current="page">1</button><button class="outline">2</button><button class="outline">下一页</button><label>每页<select><option>10</option><option>20</option></select></label></footer></article>
  <dialog id="delete-dialog"><article><h3>确认删除订单？</h3><p>此操作无法撤销。</p><footer><button class="outline" id="cancel-delete">取消</button><button id="confirm-delete">确认删除</button></footer></article></dialog>
  <dialog id="order-drawer" class="drawer"><button class="outline drawer-close" id="close-drawer" aria-label="关闭">×</button><h2 id="drawer-title">订单详情</h2><dl id="drawer-details"></dl><hr /><label>备注<textarea placeholder="添加备注"></textarea></label></dialog>`
}

export function mount(root: HTMLElement): void {
  const body = root.querySelector<HTMLTableSectionElement>("#orders-body")
  const query = root.querySelector<HTMLInputElement>("#order-query")
  const statusSelect = root.querySelector<HTMLSelectElement>("#order-status")
  const drawer = root.querySelector<HTMLDialogElement>("#order-drawer")
  const deleteDialog = root.querySelector<HTMLDialogElement>("#delete-dialog")
  let selected: Order | undefined
  let sortKey: keyof Order = "date"
  let ascending = false
  const renderRows = () => {
    if (!body) return
    const needle = query?.value.toLowerCase() ?? ""
    const selectedStatus = statusSelect?.value ?? "all"
    const rows = orders.filter((order) => `${order.id} ${order.customer}`.toLowerCase().includes(needle) && (selectedStatus === "all" || order.status === selectedStatus)).sort((a, b) => {
      const left = String(a[sortKey]), right = String(b[sortKey])
      return (left > right ? 1 : left < right ? -1 : 0) * (ascending ? 1 : -1)
    }).slice(0, 10)
    body.innerHTML = rows.map((order) => `<tr data-order="${order.id}"><td><input type="checkbox" aria-label="选择 ${order.id}" /></td><td><strong>${order.id}</strong></td><td><span class="avatar">${order.customer.slice(0, 1)}</span> ${order.customer}</td><td>${status(order.status)}</td><td>${order.date}</td><td style="text-align:right">${money(order.amount)}</td><td><details class="dropdown"><summary>${icon("ellipsis-horizontal")}</summary><ul><li><a href="#" data-edit="${order.id}">编辑</a></li><li><a href="#" data-delete="${order.id}">删除</a></li></ul></details></td></tr>`).join("")
    body.querySelectorAll("tr").forEach((row) => row.addEventListener("click", (event) => {
      if ((event.target as HTMLElement).closest("a,button,input,summary")) return
      selected = orders.find((order) => order.id === row.dataset.order)
      if (!selected || !drawer) return
      root.querySelector("#drawer-title")!.textContent = selected.id
      root.querySelector("#drawer-details")!.innerHTML = `<dt>客户</dt><dd>${selected.customer}</dd><dt>邮箱</dt><dd>${selected.email}</dd><dt>产品</dt><dd>${selected.product}</dd><dt>状态</dt><dd>${status(selected.status)}</dd><dt>金额</dt><dd>${money(selected.amount)}</dd>`
      drawer.showModal()
    }))
    body.querySelectorAll<HTMLElement>("[data-delete]").forEach((link) => link.addEventListener("click", (event) => {
      event.preventDefault(); selected = orders.find((order) => order.id === link.dataset.delete); deleteDialog?.showModal()
    }))
  }
  query?.addEventListener("input", renderRows); statusSelect?.addEventListener("change", renderRows)
  root.querySelectorAll<HTMLButtonElement>(".sort-button").forEach((button) => button.addEventListener("click", () => {
    const next = button.dataset.sort as keyof Order
    if (sortKey === next) ascending = !ascending; else { sortKey = next; ascending = true }
    renderRows()
  }))
  root.querySelector("#select-all")?.addEventListener("change", (event) => body?.querySelectorAll<HTMLInputElement>("input[type=checkbox]").forEach((input) => { input.checked = (event.target as HTMLInputElement).checked }))
  root.querySelector("#close-drawer")?.addEventListener("click", () => drawer?.close())
  root.querySelector("#cancel-delete")?.addEventListener("click", () => deleteDialog?.close())
  root.querySelector("#confirm-delete")?.addEventListener("click", () => { deleteDialog?.close(); const toast = document.createElement("article"); toast.className = "toast"; toast.setAttribute("aria-live", "polite"); toast.textContent = "订单已删除"; root.append(toast); window.setTimeout(() => toast.remove(), 3000) })
  root.querySelector("#export-orders")?.addEventListener("click", () => { const blob = new Blob([JSON.stringify(orders)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "orders.json"; link.click(); URL.revokeObjectURL(link.href) })
  root.querySelector("#retry-orders")?.addEventListener("click", () => window.location.reload())
  renderRows()
}
