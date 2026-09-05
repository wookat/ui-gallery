import * as bootstrap from "bootstrap"
import { icon } from "../lib/icons"
import { avatar, each, esc, money } from "../lib/html"
import { orders, STATUS_COLOR, STATUS_LABEL, type Order } from "../lib/data"
import { params } from "../lib/settings"
import type { PageResult } from "./types"

type SortKey = "id" | "customer" | "amount" | "date" | "status"
type State = { search: string; status: string; channels: Set<string>; from: string; to: string; sort: SortKey; dir: 1 | -1; page: number; size: number; selected: Set<string>; columns: Set<string>; mode: "ready" | "loading" | "empty" | "error"; data: Order[] }

const CHANNELS = ["web", "ios", "android", "api"]
const COLUMNS: { key: string; label: string }[] = [{ key: "customer", label: "客户" }, { key: "product", label: "商品" }, { key: "channel", label: "渠道" }, { key: "date", label: "日期" }]

function filtered(state: State) {
  const q = state.search.trim().toLowerCase()
  return state.data
    .filter((o) => !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q))
    .filter((o) => !state.status || o.status === state.status)
    .filter((o) => !state.channels.size || state.channels.has(o.channel))
    .filter((o) => (!state.from || o.date >= state.from) && (!state.to || o.date <= state.to))
    .sort((a, b) => {
      const av = a[state.sort], bv = b[state.sort]
      return (av < bv ? -1 : av > bv ? 1 : 0) * state.dir
    })
}

function th(state: State, key: SortKey, label: string, cls = "") {
  const active = state.sort === key
  return `<th scope="col" class="${cls}"><button type="button" class="btn btn-link btn-sm p-0 text-decoration-none link-body-emphasis fw-semibold d-inline-flex align-items-center gap-1" data-sort="${key}" aria-sort="${active ? (state.dir === 1 ? "ascending" : "descending") : "none"}">${label}${active ? icon(state.dir === 1 ? "chevron-up" : "chevron-down") : `<span class="text-body-tertiary">${icon("chevron-down")}</span>`}</button></th>`
}

function tableBody(state: State) {
  if (state.mode === "loading") return `<div class="p-3" aria-busy="true"><div class="placeholder-glow">${each(Array.from({ length: 8 }), () => `<span class="placeholder col-12 d-block mb-3" style="height:20px"></span>`)}</div><div class="text-center text-body-secondary small"><span class="spinner-border spinner-border-sm me-2" role="status"></span>正在加载订单…</div></div>`
  if (state.mode === "error") return `<div class="p-4"><div class="alert alert-danger d-flex align-items-center justify-content-between gap-3 mb-0" role="alert"><div class="d-flex align-items-center gap-2">${icon("alert-circle")}<span>加载订单失败：请求超时（504）。</span></div><button type="button" class="btn btn-sm btn-outline-danger text-nowrap" data-action="retry">${icon("refresh")} 重试</button></div></div>`
  const rows = filtered(state)
  if (state.mode === "empty" || !rows.length) return `<div class="text-center py-5 px-3"><div class="display-5 text-body-tertiary mb-2">${icon("inbox")}</div><h2 class="h5">暂无订单</h2><p class="text-body-secondary">调整筛选条件，或创建第一条订单。</p><button type="button" class="btn btn-primary" data-action="reset">${icon("plus")} 新建订单</button></div>`
  const start = (state.page - 1) * state.size
  const pageRows = rows.slice(start, start + state.size)
  const allSelected = pageRows.every((o) => state.selected.has(o.id))
  const someSelected = pageRows.some((o) => state.selected.has(o.id))
  const col = (k: string) => state.columns.has(k)
  return `<div class="table-responsive"><table class="table table-hover align-middle mb-0">
    <thead class="table-light"><tr>
      <th scope="col" style="width:40px"><input class="form-check-input" type="checkbox" id="selectAll" aria-label="全选" ${allSelected ? "checked" : ""} data-indeterminate="${!allSelected && someSelected}"></th>
      ${th(state, "id", "订单号")}${col("customer") ? th(state, "customer", "客户") : ""}${col("product") ? `<th scope="col">商品</th>` : ""}${th(state, "status", "状态")}${col("channel") ? `<th scope="col">渠道</th>` : ""}${col("date") ? th(state, "date", "日期") : ""}${th(state, "amount", "金额", "text-end")}<th scope="col" class="text-end"><span class="visually-hidden">操作</span></th>
    </tr></thead>
    <tbody>${each(pageRows, (o) => `<tr class="cursor-pointer ${state.selected.has(o.id) ? "table-active" : ""}" data-row="${o.id}">
      <td><input class="form-check-input" type="checkbox" data-select="${o.id}" aria-label="选择 ${o.id}" ${state.selected.has(o.id) ? "checked" : ""}></td>
      <td class="text-nowrap"><code>${o.id}</code></td>
      ${col("customer") ? `<td><div class="d-flex align-items-center gap-2">${avatar(o.customer, 28)}<div class="min-w-0"><div class="text-nowrap">${esc(o.customer)}</div><small class="text-body-secondary">${esc(o.email)}</small></div></div></td>` : ""}
      ${col("product") ? `<td class="text-nowrap">${esc(o.product)}</td>` : ""}
      <td><span class="badge rounded-pill text-bg-${STATUS_COLOR[o.status]}">${STATUS_LABEL[o.status]}</span></td>
      ${col("channel") ? `<td class="text-uppercase small text-body-secondary">${o.channel}</td>` : ""}
      ${col("date") ? `<td class="text-nowrap">${o.date}</td>` : ""}
      <td class="text-end text-nowrap fw-medium">${money(o.amount, o.currency)}</td>
      <td class="text-end"><div class="dropdown" data-stop><button class="btn btn-sm btn-link link-body-emphasis" data-bs-toggle="dropdown" aria-expanded="false" aria-label="操作 ${o.id}">${icon("more-horizontal")}</button>
        <ul class="dropdown-menu dropdown-menu-end"><li><button class="dropdown-item" type="button" data-action="open" data-id="${o.id}">${icon("pencil")} 编辑</button></li><li><button class="dropdown-item" type="button" data-action="copy" data-id="${o.id}">${icon("copy")} 复制订单号</button></li><li><hr class="dropdown-divider"></li><li><button class="dropdown-item text-danger" type="button" data-action="delete" data-id="${o.id}">${icon("trash")} 删除</button></li></ul></div></td>
    </tr>`)}</tbody></table></div>
    <div class="card-footer d-flex flex-wrap justify-content-between align-items-center gap-2">
      <div class="d-flex align-items-center gap-2 small text-body-secondary"><span>共 ${rows.length} 条${state.selected.size ? `，已选 ${state.selected.size}` : ""}</span>
        <select class="form-select form-select-sm w-auto" aria-label="每页条数" data-size>${each([10, 20, 50], (n) => `<option value="${n}" ${n === state.size ? "selected" : ""}>${n} 条/页</option>`)}</select></div>
      ${pagination(state.page, Math.max(1, Math.ceil(rows.length / state.size)))}
    </div>`
}

function pagination(page: number, total: number) {
  const pages = Array.from({ length: total }, (_, i) => i + 1).filter((p) => p === 1 || p === total || Math.abs(p - page) <= 1)
  let last = 0
  const items = pages.map((p) => { const gap = p - last > 1 ? `<li class="page-item disabled"><span class="page-link">…</span></li>` : ""; last = p; return `${gap}<li class="page-item ${p === page ? "active" : ""}"><button class="page-link" type="button" data-page="${p}" ${p === page ? 'aria-current="page"' : ""}>${p}</button></li>` }).join("")
  return `<nav aria-label="分页"><ul class="pagination pagination-sm mb-0"><li class="page-item ${page === 1 ? "disabled" : ""}"><button class="page-link" type="button" data-page="${page - 1}" aria-label="上一页">${icon("chevron-left")}</button></li>${items}<li class="page-item ${page === total ? "disabled" : ""}"><button class="page-link" type="button" data-page="${page + 1}" aria-label="下一页">${icon("chevron-right")}</button></li></ul></nav>`
}

function drawer(o: Order) {
  return `<div class="offcanvas-header border-bottom"><h2 class="offcanvas-title h5 d-flex align-items-center gap-2">订单 <code>${o.id}</code> <span class="badge rounded-pill text-bg-${STATUS_COLOR[o.status]}">${STATUS_LABEL[o.status]}</span></h2><button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="关闭"></button></div>
  <div class="offcanvas-body">
    <dl class="row mb-4">
      <dt class="col-4 text-body-secondary fw-normal">客户</dt><dd class="col-8 d-flex align-items-center gap-2">${avatar(o.customer, 24)}${esc(o.customer)}</dd>
      <dt class="col-4 text-body-secondary fw-normal">邮箱</dt><dd class="col-8 text-break">${esc(o.email)}</dd>
      <dt class="col-4 text-body-secondary fw-normal">商品</dt><dd class="col-8">${esc(o.product)}</dd>
      <dt class="col-4 text-body-secondary fw-normal">金额</dt><dd class="col-8 fw-semibold">${money(o.amount, o.currency)}</dd>
      <dt class="col-4 text-body-secondary fw-normal">渠道</dt><dd class="col-8 text-uppercase">${o.channel}</dd>
      <dt class="col-4 text-body-secondary fw-normal">日期</dt><dd class="col-8">${o.date}</dd>
    </dl>
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item" role="presentation"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#dTimeline" type="button" role="tab" aria-selected="true">时间线</button></li>
      <li class="nav-item" role="presentation"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#dItems" type="button" role="tab" aria-selected="false">明细</button></li>
      <li class="nav-item" role="presentation"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#dNotes" type="button" role="tab" aria-selected="false">备注</button></li>
    </ul>
    <div class="tab-content border border-top-0 rounded-bottom p-3">
      <div class="tab-pane fade show active" id="dTimeline" role="tabpanel"><ul class="list-unstyled mb-0"><li class="d-flex gap-2 mb-2"><span class="badge text-bg-success rounded-pill">1</span>订单创建 · ${o.date}</li><li class="d-flex gap-2 mb-2"><span class="badge text-bg-success rounded-pill">2</span>支付${o.status === "paid" || o.status === "shipped" ? "成功" : "处理中"}</li><li class="d-flex gap-2"><span class="badge text-bg-secondary rounded-pill">3</span>${o.status === "shipped" ? "已发货" : "等待发货"}</li></ul></div>
      <div class="tab-pane fade" id="dItems" role="tabpanel"><table class="table table-sm mb-0"><thead><tr><th>商品</th><th class="text-end">数量</th><th class="text-end">小计</th></tr></thead><tbody><tr><td>${esc(o.product)}</td><td class="text-end">1</td><td class="text-end">${money(o.amount, o.currency)}</td></tr></tbody></table></div>
      <div class="tab-pane fade" id="dNotes" role="tabpanel"><label for="orderNote" class="form-label">内部备注</label><textarea class="form-control" id="orderNote" rows="4" placeholder="记录与客户的沟通…"></textarea><div class="form-text">仅团队成员可见</div></div>
    </div>
  </div>
  <div class="offcanvas-header border-top justify-content-end gap-2"><button type="button" class="btn btn-outline-secondary" data-bs-dismiss="offcanvas">关闭</button><button type="button" class="btn btn-primary" data-action="save-note">保存</button></div>`
}

export function renderOrders(): PageResult {
  const initial = params().get("state")
  const state: State = { search: "", status: "", channels: new Set(), from: "", to: "", sort: "date", dir: -1, page: 1, size: 10, selected: new Set(), columns: new Set(COLUMNS.map((c) => c.key)), mode: initial === "loading" || initial === "empty" || initial === "error" ? initial : "ready", data: [...orders] }

  const html = `<div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
    <div><h1 class="h3 mb-0">订单</h1><p class="text-body-secondary mb-0">共 ${orders.length} 条订单，支持筛选、排序与批量操作。</p></div>
    <div class="btn-group" role="group" aria-label="演示状态"><button type="button" class="btn btn-outline-secondary btn-sm" data-mode="ready">正常</button><button type="button" class="btn btn-outline-secondary btn-sm" data-mode="loading">加载</button><button type="button" class="btn btn-outline-secondary btn-sm" data-mode="empty">空态</button><button type="button" class="btn btn-outline-secondary btn-sm" data-mode="error">错误</button></div>
  </div>
  <div class="card">
    <div class="card-header bg-body">
      <div class="row g-2 align-items-center">
        <div class="col-12 col-md-4 col-xl-3"><div class="input-group"><span class="input-group-text">${icon("search")}</span><input type="search" class="form-control" placeholder="搜索订单号 / 客户 / 邮箱" aria-label="搜索" data-search></div></div>
        <div class="col-6 col-md-3 col-xl-2"><select class="form-select" aria-label="状态" data-status><option value="">全部状态</option>${each(Object.keys(STATUS_LABEL).filter((s) => orders.some((o) => o.status === s)), (s) => `<option value="${s}">${STATUS_LABEL[s]}</option>`)}</select></div>
        <div class="col-6 col-md-5 col-xl-3"><div class="input-group"><input type="date" class="form-control" aria-label="开始日期" data-from><span class="input-group-text">–</span><input type="date" class="form-control" aria-label="结束日期" data-to></div></div>
        <div class="col-12 col-xl-4 d-flex gap-2 justify-content-xl-end flex-wrap">
          <div class="dropdown"><button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">${icon("filter")} 渠道 <span class="badge text-bg-primary rounded-pill ms-1 d-none" data-channel-count></span></button>
            <div class="dropdown-menu p-3" style="min-width:200px">${each(CHANNELS, (c) => `<div class="form-check"><input class="form-check-input" type="checkbox" id="ch-${c}" value="${c}" data-channel><label class="form-check-label text-uppercase" for="ch-${c}">${c}</label></div>`)}<div class="d-flex flex-wrap gap-1 mt-2" data-channel-tags></div></div></div>
          <div class="dropdown"><button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">${icon("sliders")} 列</button>
            <div class="dropdown-menu p-3">${each(COLUMNS, (c) => `<div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" id="col-${c.key}" value="${c.key}" checked data-column><label class="form-check-label" for="col-${c.key}">${c.label}</label></div>`)}</div></div>
          <button type="button" class="btn btn-primary" data-action="export">${icon("download")} 导出</button>
        </div>
      </div>
    </div>
    <div id="ordersTable">${tableBody(state)}</div>
  </div>
  <div class="offcanvas offcanvas-end" tabindex="-1" id="orderDrawer" aria-labelledby="orderDrawerTitle" style="width:min(480px,100vw)"><div id="orderDrawerBody"></div></div>
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalTitle" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content">
    <div class="modal-header"><h2 class="modal-title h5" id="deleteModalTitle">删除订单</h2><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="关闭"></button></div>
    <div class="modal-body">确定要删除订单 <code data-delete-id></code> 吗？此操作不可撤销。</div>
    <div class="modal-footer"><button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button><button type="button" class="btn btn-danger" data-action="confirm-delete">删除</button></div></div></div></div>
  <div class="toast-container position-fixed bottom-0 end-0 p-3"><div id="ordersToast" class="toast align-items-center text-bg-success border-0" role="status" aria-live="polite" aria-atomic="true"><div class="d-flex"><div class="toast-body d-flex align-items-center gap-2">${icon("check-circle")}<span data-toast-text>操作成功</span></div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="关闭"></button></div></div></div>`

  const mount = (root: HTMLElement) => {
    const table = root.querySelector<HTMLElement>("#ordersTable")!
    const drawerEl = root.querySelector<HTMLElement>("#orderDrawer")!
    const modalEl = root.querySelector<HTMLElement>("#deleteModal")!
    const toastEl = root.querySelector<HTMLElement>("#ordersToast")!
    const offcanvas = new bootstrap.Offcanvas(drawerEl)
    const modal = new bootstrap.Modal(modalEl)
    const toast = new bootstrap.Toast(toastEl, { delay: 2500 })
    let pendingDelete = ""
    const toastMsg = (text: string, kind = "success") => { toastEl.className = `toast align-items-center text-bg-${kind} border-0`; toastEl.querySelector("[data-toast-text]")!.textContent = text; toast.show() }
    const rerender = () => {
      table.innerHTML = tableBody(state)
      const all = table.querySelector<HTMLInputElement>("#selectAll")
      if (all) all.indeterminate = all.dataset.indeterminate === "true"
    }
    const setMode = (mode: State["mode"]) => {
      state.mode = mode
      root.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode))
      rerender()
    }
    setMode(state.mode)

    root.addEventListener("input", (e) => {
      const t = e.target as HTMLInputElement
      if (t.matches("[data-search]")) { state.search = t.value; state.page = 1; rerender() }
    })
    root.addEventListener("change", (e) => {
      const t = e.target as HTMLInputElement | HTMLSelectElement
      if (t.matches("[data-status]")) { state.status = t.value; state.page = 1; rerender() }
      else if (t.matches("[data-from]")) { state.from = t.value; state.page = 1; rerender() }
      else if (t.matches("[data-to]")) { state.to = t.value; state.page = 1; rerender() }
      else if (t.matches("[data-size]")) { state.size = Number(t.value); state.page = 1; rerender() }
      else if (t.matches("[data-channel]")) {
        if ((t as HTMLInputElement).checked) state.channels.add(t.value); else state.channels.delete(t.value)
        const count = root.querySelector<HTMLElement>("[data-channel-count]")!
        count.textContent = String(state.channels.size); count.classList.toggle("d-none", !state.channels.size)
        root.querySelector("[data-channel-tags]")!.innerHTML = each([...state.channels], (c) => `<span class="badge text-bg-secondary text-uppercase d-inline-flex align-items-center gap-1">${c}<button type="button" class="btn-close btn-close-white" style="font-size:.5em" data-remove-channel="${c}" aria-label="移除 ${c}"></button></span>`)
        state.page = 1; rerender()
      }
      else if (t.matches("[data-column]")) { if ((t as HTMLInputElement).checked) state.columns.add(t.value); else state.columns.delete(t.value); rerender() }
      else if (t.matches("#selectAll")) { filtered(state).slice((state.page - 1) * state.size, state.page * state.size).forEach((o) => ((t as HTMLInputElement).checked ? state.selected.add(o.id) : state.selected.delete(o.id))); rerender() }
      else if (t.matches("[data-select]")) { const id = (t as HTMLElement).dataset.select!; if ((t as HTMLInputElement).checked) state.selected.add(id); else state.selected.delete(id); rerender() }
    })
    root.addEventListener("click", (e) => {
      const el = e.target as HTMLElement
      const mode = el.closest<HTMLElement>("[data-mode]")
      if (mode) return setMode(mode.dataset.mode as State["mode"])
      const remove = el.closest<HTMLElement>("[data-remove-channel]")
      if (remove) { const box = root.querySelector<HTMLInputElement>(`#ch-${remove.dataset.removeChannel}`)!; box.checked = false; box.dispatchEvent(new Event("change", { bubbles: true })); return }
      const sort = el.closest<HTMLElement>("[data-sort]")
      if (sort) { const key = sort.dataset.sort as SortKey; if (state.sort === key) state.dir = state.dir === 1 ? -1 : 1; else { state.sort = key; state.dir = 1 } return rerender() }
      const pageBtn = el.closest<HTMLElement>("[data-page]")
      if (pageBtn) { state.page = Number(pageBtn.dataset.page); return rerender() }
      const action = el.closest<HTMLElement>("[data-action]")
      if (action) {
        const id = action.dataset.id ?? ""
        switch (action.dataset.action) {
          case "retry": setMode("loading"); window.setTimeout(() => setMode("ready"), 900); return
          case "reset": state.search = ""; state.status = ""; state.channels.clear(); state.from = ""; state.to = ""; root.querySelector<HTMLInputElement>("[data-search]")!.value = ""; root.querySelector<HTMLSelectElement>("[data-status]")!.value = ""; setMode("ready"); return
          case "export": toastMsg(`已导出 ${filtered(state).length} 条订单（CSV）`, "primary"); return
          case "copy": navigator.clipboard?.writeText(id).catch(() => undefined); toastMsg(`已复制 ${id}`); return
          case "open": { const o = state.data.find((x) => x.id === id); if (o) { root.querySelector("#orderDrawerBody")!.innerHTML = drawer(o); offcanvas.show() } return }
          case "delete": pendingDelete = id; modalEl.querySelector("[data-delete-id]")!.textContent = id; modal.show(); return
          case "confirm-delete": state.data = state.data.filter((o) => o.id !== pendingDelete); state.selected.delete(pendingDelete); modal.hide(); toastMsg(`订单 ${pendingDelete} 已删除`); rerender(); return
          case "save-note": offcanvas.hide(); toastMsg("备注已保存"); return
        }
      }
      if (el.closest("[data-stop], input, button, a")) return
      const row = el.closest<HTMLElement>("[data-row]")
      if (row) { const o = state.data.find((x) => x.id === row.dataset.row); if (o) { root.querySelector("#orderDrawerBody")!.innerHTML = drawer(o); offcanvas.show() } }
    })
    return () => { offcanvas.dispose(); modal.dispose(); toast.dispose() }
  }
  return { html, mount }
}
