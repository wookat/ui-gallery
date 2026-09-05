import { icon } from "../lib/icons"
import { each, esc } from "../lib/html"
import { team } from "../lib/data"
import { href } from "../lib/router"
import type { PageResult } from "./types"

const STEPS = ["基本信息", "详细配置", "确认"]
const req = `<span class="text-danger" aria-hidden="true">*</span>`
const tip = (text: string) => `<button type="button" class="btn btn-link p-0 ms-1 link-body-emphasis align-baseline" data-bs-toggle="tooltip" data-bs-title="${esc(text)}" aria-label="${esc(text)}">${icon("circle-help")}</button>`

function stepper(current: number, done: boolean) {
  return `<ol class="list-unstyled d-flex align-items-center gap-2 gap-md-3 mb-4" aria-label="步骤">${each(STEPS, (label, i) => {
    const state = done || i < current ? "done" : i === current ? "active" : "todo"
    const circle = state === "done" ? `<span class="badge rounded-circle text-bg-success d-inline-flex align-items-center justify-content-center" style="width:28px;height:28px">${icon("check")}</span>` : `<span class="badge rounded-circle ${state === "active" ? "text-bg-primary" : "text-bg-secondary bg-opacity-25 text-body"} d-inline-flex align-items-center justify-content-center" style="width:28px;height:28px">${i + 1}</span>`
    return `<li class="d-flex align-items-center gap-2 ${i < STEPS.length - 1 ? "flex-grow-1" : ""}" ${state === "active" ? 'aria-current="step"' : ""}>${circle}<span class="${state === "active" ? "fw-semibold" : "text-body-secondary"} text-nowrap small">${label}</span>${i < STEPS.length - 1 ? `<span class="flex-grow-1 border-top ${state === "done" ? "border-success" : ""}"></span>` : ""}</li>`
  })}</ol>`
}

const step1 = `<fieldset class="row g-3">
  <legend class="h5 mb-0">基本信息</legend>
  <div class="col-md-6"><label for="fName" class="form-label">项目名称 ${req}</label><input type="text" class="form-control" id="fName" name="name" required minlength="2" placeholder="例如：Q4 增长计划"><div class="invalid-feedback">请输入至少 2 个字符</div></div>
  <div class="col-md-6"><label for="fBudget" class="form-label">预算（元）${req}${tip("填写本项目的总预算，范围 1,000 – 1,000,000")}</label><input type="number" class="form-control" id="fBudget" name="budget" required min="1000" max="1000000" step="100" placeholder="50000"><div class="invalid-feedback">预算须在 1,000 到 1,000,000 之间</div></div>
  <div class="col-md-6"><label for="fEmail" class="form-label">负责人邮箱 ${req}</label><div class="input-group has-validation"><span class="input-group-text">${icon("mail")}</span><input type="email" class="form-control" id="fEmail" name="email" required placeholder="owner@acme.dev"><div class="invalid-feedback">邮箱格式不正确</div></div></div>
  <div class="col-md-6"><label for="fPhone" class="form-label">联系电话 ${req}</label><div class="input-group has-validation"><select class="form-select flex-grow-0 w-auto" aria-label="国家码" name="cc"><option>+86</option><option>+1</option><option>+44</option><option>+81</option></select><input type="tel" class="form-control" id="fPhone" name="phone" required pattern="[0-9]{6,15}" placeholder="13800000000"><div class="invalid-feedback">请输入 6–15 位数字</div></div><div class="form-text">仅用于紧急联络</div></div>
  <div class="col-12"><label for="fDesc" class="form-label">项目简介</label><textarea class="form-control" id="fDesc" name="desc" rows="3" maxlength="200" placeholder="一句话描述目标与范围"></textarea><div class="form-text text-end"><span data-count>0</span>/200</div></div>
  <div class="col-md-4"><div class="form-label">优先级 ${req}</div>${each(["低", "中", "高"], (p, i) => `<div class="form-check"><input class="form-check-input" type="radio" name="priority" id="fPri${i}" value="${p}" ${i === 1 ? "checked" : ""} required><label class="form-check-label" for="fPri${i}">${p}</label></div>`)}</div>
  <div class="col-md-4"><div class="form-label">涉及平台</div>${each(["Web", "iOS", "Android", "API"], (p, i) => `<div class="form-check"><input class="form-check-input" type="checkbox" name="platform" id="fPlat${i}" value="${p}" ${i === 0 ? "checked" : ""}><label class="form-check-label" for="fPlat${i}">${p}</label></div>`)}</div>
  <div class="col-md-4"><div class="form-label">选项</div><div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" id="fPublic" name="public" checked><label class="form-check-label" for="fPublic">对团队公开</label></div><div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" id="fNotify" name="notify"><label class="form-check-label" for="fNotify">里程碑通知</label></div></div>
</fieldset>`

const step2 = `<fieldset class="row g-3">
  <legend class="h5 mb-0">详细配置</legend>
  <div class="col-md-4"><label for="fRegion" class="form-label">数据区域 ${req}</label><select class="form-select" id="fRegion" name="region" required><option value="">请选择…</option><option>中国大陆</option><option>新加坡</option><option>法兰克福</option></select><div class="invalid-feedback">请选择数据区域</div></div>
  <div class="col-md-4"><label for="fMembers" class="form-label">成员（多选）${tip("按住 Ctrl / ⌘ 可多选")}</label><select class="form-select" id="fMembers" name="members" multiple size="3">${each(team, (m) => `<option>${esc(m.name)}</option>`)}</select></div>
  <div class="col-md-4"><label for="fTz" class="form-label">时区（可搜索）</label><input class="form-control" list="tzList" id="fTz" name="tz" placeholder="输入以搜索…" value="Asia/Shanghai"><datalist id="tzList"><option value="Asia/Shanghai"><option value="Asia/Tokyo"><option value="Asia/Singapore"><option value="Europe/Berlin"><option value="America/New_York"></datalist><div class="form-text">Combobox / Autocomplete 由原生 datalist 组合实现</div></div>
  <div class="col-md-4"><label for="fStart" class="form-label">开始日期 ${req}</label><input type="date" class="form-control" id="fStart" name="start" required><div class="invalid-feedback">请选择开始日期</div></div>
  <div class="col-md-4"><label for="fTime" class="form-label">每日同步时间</label><input type="time" class="form-control" id="fTime" name="time" value="09:30"></div>
  <div class="col-md-4"><label class="form-label" for="fRangeFrom">评审周期</label><div class="input-group"><input type="date" class="form-control" id="fRangeFrom" name="rangeFrom" aria-label="起"><span class="input-group-text">至</span><input type="date" class="form-control" name="rangeTo" aria-label="止"></div></div>
  <div class="col-md-6"><label for="fMin" class="form-label">告警阈值区间 <span class="text-body-secondary">(<span data-min>20</span>% – <span data-max>80</span>%)</span></label><input type="range" class="form-range" id="fMin" name="min" min="0" max="100" value="20"><input type="range" class="form-range" name="max" min="0" max="100" value="80" aria-label="上限"></div>
  <div class="col-md-3"><div class="form-label">重要程度</div><div class="d-flex gap-1 fs-4" role="radiogroup" aria-label="评分" data-rating>${each([1, 2, 3, 4, 5], (n) => `<input type="radio" class="btn-check" name="rating" id="fRate${n}" value="${n}" ${n === 4 ? "checked" : ""}><label class="btn btn-link p-0 ${n <= 4 ? "text-warning" : "text-body-tertiary"}" for="fRate${n}" aria-label="${n} 星">${icon("star-fill")}</label>`)}</div></div>
  <div class="col-md-3"><label for="fColor" class="form-label">标识色</label><input type="color" class="form-control form-control-color" id="fColor" name="color" value="#0d6efd" title="选择标识色"></div>
  <div class="col-md-6"><div class="form-label">附件</div><label for="fFile" class="d-block border border-2 border-dashed rounded-3 p-4 text-center text-body-secondary cursor-pointer" data-dropzone style="border-style:dashed!important"><div class="fs-3">${icon("upload")}</div>拖拽文件到此处，或 <span class="text-primary">点击选择</span><div class="small">支持 PDF / PNG，单个 ≤ 10 MB</div></label><input type="file" class="form-control d-none" id="fFile" name="file" multiple><ul class="list-group list-group-flush mt-2" data-files></ul></div>
  <div class="col-md-6"><label for="fTagInput" class="form-label">标签</label><div class="form-control d-flex flex-wrap gap-1 align-items-center" data-tagbox>${each(["增长", "Q4"], (t) => `<span class="badge text-bg-secondary d-inline-flex align-items-center gap-1" data-tag="${t}">${t}<button type="button" class="btn-close btn-close-white" style="font-size:.55em" aria-label="移除 ${t}"></button></span>`)}<input type="text" class="border-0 bg-transparent flex-grow-1 min-w-0 p-0 text-body" id="fTagInput" placeholder="输入后回车添加" style="outline:none;min-width:8rem"></div><div class="form-text">最多 8 个标签</div></div>
</fieldset>`

function summary(form: HTMLFormElement) {
  const fd = new FormData(form)
  const get = (k: string) => fd.getAll(k).map(String).filter(Boolean).join("、") || "—"
  const rows: [string, string][] = [["项目名称", get("name")], ["预算", get("budget") === "—" ? "—" : `¥${Number(get("budget")).toLocaleString("zh-CN")}`], ["负责人邮箱", get("email")], ["联系电话", `${get("cc")} ${get("phone")}`], ["优先级", get("priority")], ["平台", get("platform")], ["数据区域", get("region")], ["成员", get("members")], ["时区", get("tz")], ["开始日期", get("start")], ["同步时间", get("time")], ["阈值", `${get("min")}% – ${get("max")}%`], ["重要程度", `${get("rating")} / 5`], ["标签", [...form.querySelectorAll<HTMLElement>("[data-tag]")].map((t) => t.dataset.tag).join("、") || "—"]]
  return `<h2 class="h5">确认信息</h2><dl class="row mb-3">${each(rows, ([k, v]) => `<dt class="col-sm-4 col-lg-3 text-body-secondary fw-normal">${k}</dt><dd class="col-sm-8 col-lg-9">${esc(v)}</dd>`)}</dl>
  <div class="form-check"><input class="form-check-input" type="checkbox" id="fAgree" name="agree" required><label class="form-check-label" for="fAgree">我已阅读并同意 <a href="#">服务条款</a> 与 <a href="#">数据处理协议</a> ${req}</label><div class="invalid-feedback">提交前需同意条款</div></div>`
}

export function renderForm(): PageResult {
  const html = `<div class="mb-3"><h1 class="h3 mb-0">新建项目</h1><p class="text-body-secondary mb-0">三步完成配置，所有字段实时校验。</p></div>
  <div class="card" style="max-width:960px"><div class="card-body p-3 p-md-4">
    <div id="stepper">${stepper(0, false)}</div>
    <form id="projectForm" novalidate>
      <div data-step="0">${step1}</div>
      <div data-step="1" class="d-none">${step2}</div>
      <div data-step="2" class="d-none"></div>
      <div class="d-flex justify-content-between mt-4 pt-3 border-top">
        <button type="button" class="btn btn-outline-secondary" data-prev disabled>${icon("arrow-left")} 上一步</button>
        <button type="button" class="btn btn-primary" data-next>下一步 ${icon("arrow-right")}</button>
        <button type="submit" class="btn btn-success d-none" data-submit>${icon("check")} 提交</button>
      </div>
    </form>
    <div id="formResult" class="d-none text-center py-5">
      <div class="display-4 text-success mb-3">${icon("check-circle")}</div>
      <h2 class="h4">项目创建成功</h2><p class="text-body-secondary">团队成员将在几分钟内收到邀请邮件。</p>
      <div class="d-flex justify-content-center gap-2"><a class="btn btn-primary" href="${href("/")}" data-link="/">返回仪表盘</a><button type="button" class="btn btn-outline-secondary" data-again>再建一个</button></div>
    </div>
  </div></div>`

  const mount = (root: HTMLElement) => {
    const form = root.querySelector<HTMLFormElement>("#projectForm")!
    const steps = [...form.querySelectorAll<HTMLElement>("[data-step]")]
    const prev = form.querySelector<HTMLButtonElement>("[data-prev]")!
    const next = form.querySelector<HTMLButtonElement>("[data-next]")!
    const submit = form.querySelector<HTMLButtonElement>("[data-submit]")!
    let current = 0
    const show = (i: number) => {
      current = i
      steps.forEach((s, idx) => s.classList.toggle("d-none", idx !== i))
      if (i === 2) steps[2].innerHTML = summary(form)
      root.querySelector("#stepper")!.innerHTML = stepper(i, false)
      prev.disabled = i === 0
      next.classList.toggle("d-none", i === 2)
      submit.classList.toggle("d-none", i !== 2)
      form.classList.remove("was-validated")
    }
    const validateStep = () => {
      const fields = steps[current].querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select, textarea")
      let ok = true
      fields.forEach((f) => { f.classList.remove("is-invalid"); if (!f.checkValidity()) { f.classList.add("is-invalid"); ok = false } })
      return ok
    }
    next.addEventListener("click", () => { if (validateStep()) show(current + 1) })
    prev.addEventListener("click", () => show(current - 1))
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      if (!validateStep()) return
      submit.disabled = true
      submit.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>提交中…`
      window.setTimeout(() => { form.classList.add("d-none"); root.querySelector("#stepper")!.innerHTML = stepper(3, true); root.querySelector("#formResult")!.classList.remove("d-none") }, 900)
    })
    root.querySelector("[data-again]")?.addEventListener("click", () => { form.reset(); form.classList.remove("d-none"); root.querySelector("#formResult")!.classList.add("d-none"); submit.disabled = false; submit.innerHTML = `${icon("check")} 提交`; show(0) })
    form.addEventListener("input", (e) => {
      const t = e.target as HTMLInputElement
      if (t.id === "fDesc") root.querySelector("[data-count]")!.textContent = String(t.value.length)
      if (t.name === "min" || t.name === "max") {
        const min = form.querySelector<HTMLInputElement>('[name="min"]')!, max = form.querySelector<HTMLInputElement>('[name="max"]')!
        if (Number(min.value) > Number(max.value)) (t.name === "min" ? max : min).value = t.value
        root.querySelector("[data-min]")!.textContent = min.value; root.querySelector("[data-max]")!.textContent = max.value
      }
      if (t.classList.contains("is-invalid") && t.checkValidity()) t.classList.remove("is-invalid")
    })
    form.addEventListener("change", (e) => {
      const t = e.target as HTMLInputElement
      if (t.name === "rating") form.querySelectorAll<HTMLLabelElement>("[data-rating] label").forEach((l, i) => { l.classList.toggle("text-warning", i < Number(t.value)); l.classList.toggle("text-body-tertiary", i >= Number(t.value)) })
      if (t.id === "fFile") listFiles([...(t.files ?? [])].map((f) => f.name))
    })
    const listFiles = (names: string[]) => { form.querySelector("[data-files]")!.innerHTML = each(names, (n) => `<li class="list-group-item d-flex justify-content-between align-items-center px-0 py-1 small">${icon("paperclip")} <span class="flex-grow-1 ms-2 text-truncate">${esc(n)}</span><span class="badge text-bg-success">已上传</span></li>`) }
    const zone = form.querySelector<HTMLElement>("[data-dropzone]")!
    zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("border-primary", "bg-primary-subtle") })
    zone.addEventListener("dragleave", () => zone.classList.remove("border-primary", "bg-primary-subtle"))
    zone.addEventListener("drop", (e) => { e.preventDefault(); zone.classList.remove("border-primary", "bg-primary-subtle"); listFiles([...(e.dataTransfer?.files ?? [])].map((f) => f.name)) })
    const tagbox = form.querySelector<HTMLElement>("[data-tagbox]")!
    tagbox.addEventListener("keydown", (e) => {
      const input = e.target as HTMLInputElement
      if (e.key === "Enter" && input.value.trim() && tagbox.querySelectorAll("[data-tag]").length < 8) {
        e.preventDefault()
        const t = input.value.trim()
        input.insertAdjacentHTML("beforebegin", `<span class="badge text-bg-secondary d-inline-flex align-items-center gap-1" data-tag="${esc(t)}">${esc(t)}<button type="button" class="btn-close btn-close-white" style="font-size:.55em" aria-label="移除 ${esc(t)}"></button></span>`)
        input.value = ""
      }
    })
    tagbox.addEventListener("click", (e) => { const btn = (e.target as HTMLElement).closest(".btn-close"); btn?.closest("[data-tag]")?.remove() })
  }
  return { html, mount }
}
