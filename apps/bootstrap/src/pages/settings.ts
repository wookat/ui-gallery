import * as bootstrap from "bootstrap"
import { icon } from "../lib/icons"
import { avatar, each, esc, money } from "../lib/html"
import { invoices, plans, sessions, team, ROLE_LABEL, STATUS_COLOR, STATUS_LABEL } from "../lib/data"
import type { PageResult } from "./types"

const TABS = [["profile", "个人资料", "user"], ["security", "账号安全", "shield"], ["notifications", "通知", "bell"], ["team", "团队", "users"], ["billing", "计费", "credit-card"]] as const

const profile = `<div class="card"><div class="card-header fw-semibold">个人资料</div><div class="card-body">
  <div class="d-flex align-items-center gap-3 mb-4">${avatar("林晓", 64)}<div><label for="avatarFile" class="btn btn-outline-secondary btn-sm">${icon("upload")} 上传头像</label><input type="file" id="avatarFile" class="d-none" accept="image/*"><div class="form-text">JPG/PNG，≤ 2 MB</div></div></div>
  <form class="row g-3" novalidate onsubmit="return false">
    <div class="col-md-6"><label for="sName" class="form-label">姓名</label><input class="form-control" id="sName" value="林晓"></div>
    <div class="col-md-6"><label for="sLang" class="form-label">语言</label><select class="form-select" id="sLang"><option>简体中文</option><option>English</option><option>日本語</option></select></div>
    <div class="col-12"><label for="sBio" class="form-label">简介</label><textarea class="form-control" id="sBio" rows="3">负责 Acme Console 的增长与运营。</textarea></div>
    <div class="col-md-6"><label for="sTz" class="form-label">时区</label><input class="form-control" list="sTzList" id="sTz" value="Asia/Shanghai" placeholder="搜索时区…"><datalist id="sTzList"><option value="Asia/Shanghai"><option value="Asia/Tokyo"><option value="Europe/London"><option value="America/Los_Angeles"></datalist></div>
    <div class="col-12 d-flex gap-2"><button type="submit" class="btn btn-primary">保存更改</button><button type="reset" class="btn btn-outline-secondary">重置</button></div>
  </form></div></div>`

const security = `<div class="card mb-3"><div class="card-header fw-semibold">修改密码</div><div class="card-body"><form class="row g-3" novalidate onsubmit="return false">
  <div class="col-12"><label for="pwOld" class="form-label">当前密码</label><input type="password" class="form-control" id="pwOld" autocomplete="current-password"></div>
  <div class="col-md-6"><label for="pwNew" class="form-label">新密码</label><input type="password" class="form-control" id="pwNew" autocomplete="new-password" minlength="8"><div class="form-text">至少 8 位，包含字母与数字</div></div>
  <div class="col-md-6"><label for="pwNew2" class="form-label">确认新密码</label><input type="password" class="form-control" id="pwNew2" autocomplete="new-password"></div>
  <div class="col-12"><button type="submit" class="btn btn-primary">更新密码</button></div></form></div></div>
<div class="card mb-3"><div class="card-header fw-semibold">两步验证</div><div class="card-body d-flex flex-column flex-md-row gap-3 align-items-md-center">
  <div class="flex-grow-1"><div class="form-check form-switch fs-5 mb-1"><input class="form-check-input" type="checkbox" role="switch" id="twoFactor" checked><label class="form-check-label fs-6" for="twoFactor">启用基于 App 的两步验证</label></div><p class="text-body-secondary small mb-0">使用 Authenticator 扫描右侧二维码完成绑定。</p></div>
  <div class="border rounded-3 d-flex align-items-center justify-content-center bg-body-tertiary text-body-tertiary" style="width:120px;height:120px" aria-label="二维码占位">${icon("grid", "fs-1")}</div></div></div>
<div class="card"><div class="card-header fw-semibold">活跃会话</div><ul class="list-group list-group-flush">${each(sessions, (s) => `<li class="list-group-item d-flex align-items-center gap-3"><span class="text-body-secondary fs-4">${icon("globe")}</span><div class="flex-grow-1 min-w-0"><div class="fw-medium text-truncate">${esc(s.device)} ${s.current ? `<span class="badge text-bg-success ms-1">当前</span>` : ""}</div><small class="text-body-secondary">${esc(s.location)} · ${esc(s.time)}</small></div>${s.current ? "" : `<button type="button" class="btn btn-outline-danger btn-sm">注销</button>`}</li>`)}</ul></div>`

const notifs = `<div class="card"><div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2"><span class="fw-semibold">通知偏好</span>
  <div class="btn-group btn-group-sm" role="group" aria-label="渠道">${each(["邮件", "推送", "站内"], (c, i) => `<input type="radio" class="btn-check" name="notifChannel" id="nc${i}" ${i === 0 ? "checked" : ""}><label class="btn btn-outline-primary" for="nc${i}">${c}</label>`)}</div></div>
  <ul class="list-group list-group-flush">${each([["订单", [["新订单", true], ["退款申请", true], ["支付失败", false]]], ["团队", [["成员加入", true], ["提及我", true]]], ["系统", [["维护通知", true], ["安全提醒", true], ["产品更新", false]]]] as [string, [string, boolean][]][], ([group, items]) => `<li class="list-group-item bg-body-tertiary small text-uppercase text-body-secondary fw-semibold">${group}</li>${each(items, ([label, on], i) => `<li class="list-group-item d-flex justify-content-between align-items-center"><span>${label}</span><div class="form-check form-switch mb-0"><input class="form-check-input" type="checkbox" role="switch" ${on ? "checked" : ""} aria-label="${label}" id="n-${group}-${i}"></div></li>`)}`)}</ul></div>`

const teamTab = `<div class="card"><div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"><span class="fw-semibold">团队成员 <span class="badge text-bg-secondary rounded-pill">${team.length}</span></span>
  <form class="d-flex gap-2" onsubmit="return false" style="max-width:360px"><input type="email" class="form-control form-control-sm" placeholder="输入邮箱邀请成员" aria-label="邀请邮箱"><button class="btn btn-primary btn-sm text-nowrap" type="submit">${icon("plus")} 邀请</button></form></div>
  <div class="table-responsive"><table class="table align-middle mb-0"><thead><tr><th>成员</th><th>角色</th><th class="d-none d-md-table-cell">最近活跃</th><th class="text-end"><span class="visually-hidden">操作</span></th></tr></thead>
  <tbody>${each(team, (m) => `<tr><td><div class="d-flex align-items-center gap-2">${avatar(m.name, 32)}<div class="min-w-0"><div class="text-nowrap">${esc(m.name)}</div><small class="text-body-secondary">${esc(m.email)}</small></div></div></td>
    <td><select class="form-select form-select-sm w-auto" aria-label="${esc(m.name)} 角色" ${m.role === "owner" ? "disabled" : ""}>${each(Object.entries(ROLE_LABEL), ([k, v]) => `<option value="${k}" ${k === m.role ? "selected" : ""}>${v}</option>`)}</select></td>
    <td class="d-none d-md-table-cell text-body-secondary text-nowrap">${esc(m.lastActive)}</td>
    <td class="text-end"><button type="button" class="btn btn-sm btn-outline-danger" ${m.role === "owner" ? "disabled" : ""} aria-label="移除 ${esc(m.name)}">${icon("trash")}</button></td></tr>`)}</tbody></table></div></div>`

const billing = `<div class="card mb-3"><div class="card-body d-flex flex-wrap justify-content-between align-items-center gap-3"><div><div class="text-body-secondary small">当前计划</div><div class="h4 mb-0">Pro <span class="badge text-bg-primary align-middle ms-1">年付</span></div><div class="text-body-secondary small">下次扣费 2026-10-01 · ${money(99)}/月</div></div><div class="d-flex gap-2"><button type="button" class="btn btn-outline-secondary">管理支付方式</button><button type="button" class="btn btn-primary">升级</button></div></div></div>
<div class="row g-3 mb-3">${each(plans, (p) => `<div class="col-md-4"><div class="card h-100 ${p.recommended ? "border-primary" : ""}"><div class="card-body d-flex flex-column">
  <div class="d-flex justify-content-between align-items-start"><h3 class="h5">${p.name}</h3>${p.recommended ? `<span class="badge text-bg-primary">推荐</span>` : ""}</div>
  <div class="display-6 fw-semibold mb-3">${p.price === null ? "联系我们" : p.price === 0 ? "免费" : `¥${p.price}<small class="fs-6 text-body-secondary fw-normal">/月</small>`}</div>
  <ul class="list-unstyled flex-grow-1 mb-3">${each(p.features, (f) => `<li class="d-flex align-items-center gap-2 mb-1"><span class="text-success">${icon("check")}</span>${esc(f)}</li>`)}</ul>
  <button type="button" class="btn ${p.recommended ? "btn-primary" : "btn-outline-primary"} w-100" ${p.name === "Pro" ? "disabled" : ""}>${p.name === "Pro" ? "当前计划" : p.price === null ? "联系销售" : "切换"}</button></div></div></div>`)}</div>
<div class="card"><div class="card-header fw-semibold">发票</div><div class="table-responsive"><table class="table align-middle mb-0"><thead><tr><th>编号</th><th>日期</th><th>状态</th><th class="text-end">金额</th><th class="text-end"><span class="visually-hidden">下载</span></th></tr></thead>
  <tbody>${each(invoices, (inv) => `<tr><td><code>${inv.id}</code></td><td class="text-nowrap">${inv.date}</td><td><span class="badge rounded-pill text-bg-${STATUS_COLOR[inv.status]}">${STATUS_LABEL[inv.status]}</span></td><td class="text-end">${money(inv.amount)}</td><td class="text-end"><button type="button" class="btn btn-sm btn-link" aria-label="下载 ${inv.id}">${icon("download")}</button></td></tr>`)}</tbody></table></div></div>`

const panels: Record<string, string> = { profile, security, notifications: notifs, team: teamTab, billing }

export function renderSettings(): PageResult {
  const html = `<div class="mb-3"><h1 class="h3 mb-0">设置</h1><p class="text-body-secondary mb-0">管理个人资料、安全、通知、团队与计费。</p></div>
  <div class="row g-3">
    <div class="col-lg-3">
      <ul class="nav nav-pills flex-lg-column nav-fill flex-nowrap overflow-auto gap-1" role="tablist" aria-label="设置分区">${each(TABS, ([key, label, ic], i) => `<li class="nav-item" role="presentation"><button class="nav-link text-nowrap text-lg-start d-flex align-items-center gap-2 ${i === 0 ? "active" : ""}" data-bs-toggle="pill" data-bs-target="#tab-${key}" type="button" role="tab" aria-controls="tab-${key}" aria-selected="${i === 0}">${icon(ic)}${label}</button></li>`)}</ul>
    </div>
    <div class="col-lg-9">
      <div class="tab-content">${each(TABS, ([key], i) => `<div class="tab-pane fade ${i === 0 ? "show active" : ""}" id="tab-${key}" role="tabpanel">${panels[key]}</div>`)}</div>
      <div class="card border-danger mt-4"><div class="card-header text-danger fw-semibold bg-danger-subtle">危险区</div><div class="card-body d-flex flex-wrap justify-content-between align-items-center gap-3"><div><div class="fw-medium">删除账号</div><div class="text-body-secondary small">删除后所有数据将永久清除，且无法恢复。</div></div><button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteAccount">删除账号</button></div></div>
    </div>
  </div>
  <div class="modal fade" id="deleteAccount" tabindex="-1" aria-labelledby="deleteAccountTitle" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content">
    <div class="modal-header"><h2 class="modal-title h5 text-danger" id="deleteAccountTitle">确认删除账号</h2><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="关闭"></button></div>
    <div class="modal-body"><p>此操作不可撤销。请输入 <code>DELETE</code> 以确认。</p><input type="text" class="form-control" id="deleteConfirm" placeholder="DELETE" aria-label="确认文字" autocomplete="off"></div>
    <div class="modal-footer"><button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button><button type="button" class="btn btn-danger" id="deleteAccountBtn" disabled>永久删除</button></div></div></div></div>
  <div class="toast-container position-fixed bottom-0 end-0 p-3"><div id="settingsToast" class="toast align-items-center text-bg-success border-0" role="status" aria-live="polite" aria-atomic="true"><div class="d-flex"><div class="toast-body">设置已保存</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="关闭"></button></div></div></div>`

  const mount = (root: HTMLElement) => {
    const confirm = root.querySelector<HTMLInputElement>("#deleteConfirm")!
    const btn = root.querySelector<HTMLButtonElement>("#deleteAccountBtn")!
    confirm.addEventListener("input", () => { btn.disabled = confirm.value !== "DELETE" })
    const toast = new bootstrap.Toast(root.querySelector("#settingsToast")!, { delay: 2000 })
    root.querySelectorAll("form").forEach((f) => f.addEventListener("submit", () => toast.show()))
    btn.addEventListener("click", () => { bootstrap.Modal.getInstance(root.querySelector("#deleteAccount")!)?.hide(); toast.show() })
    return () => { toast.dispose(); bootstrap.Modal.getInstance(root.querySelector("#deleteAccount")!)?.dispose() }
  }
  return { html, mount }
}
