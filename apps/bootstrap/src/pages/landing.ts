import { icon, isIconName } from "../lib/icons"
import { avatar, each, esc } from "../lib/html"
import { landing, plans } from "../lib/data"
import { href } from "../lib/router"
import { isDark, setTheme } from "../lib/settings"
import type { PageResult } from "./types"

const LINKS = ["产品", "解决方案", "定价", "文档", "博客"]
const FOOTER: [string, string[]][] = [["产品", ["功能", "定价", "更新日志", "路线图"]], ["资源", ["文档", "API", "状态页", "社区"]], ["公司", ["关于", "博客", "招聘", "联系"]], ["法律", ["隐私", "条款", "安全", "合规"]]]
const NAMES = ["林晓", "王子涵", "Alex Chen", "Maria García", "陈思远"]
const LOGOS = ["Northwind", "Contoso", "Fabrikam", "Globex", "Initech", "Umbrella"]

const shot = (label: string) => `<div class="landing-shot rounded-4 border bg-body-tertiary d-flex align-items-center justify-content-center text-body-tertiary shadow-sm"><div class="text-center"><div class="display-5">${icon("layout-dashboard")}</div><small>${label}</small></div></div>`

export function renderLanding(): PageResult {
  const { hero, features, numbers, testimonials, faq } = landing
  const html = `<nav class="navbar navbar-expand-lg bg-body border-bottom sticky-top"><div class="container">
    <a class="navbar-brand d-flex align-items-center gap-2 fw-semibold" href="${href("/landing")}" data-link="/landing"><span class="d-inline-flex align-items-center justify-content-center rounded bg-primary text-white" style="width:32px;height:32px">${icon("boxes")}</span>Acme Console</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#landingNav" aria-controls="landingNav" aria-expanded="false" aria-label="切换导航"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="landingNav">
      <ul class="navbar-nav mx-auto mb-2 mb-lg-0">${each(LINKS, (l) => `<li class="nav-item"><a class="nav-link" href="#">${l}</a></li>`)}</ul>
      <div class="d-flex gap-2 align-items-center"><button type="button" class="btn btn-outline-secondary" data-action="toggle-theme" aria-label="切换主题">${isDark() ? icon("sun") : icon("moon")}</button><a class="btn btn-outline-secondary" href="${href("/login")}" data-link="/login">登录</a><a class="btn btn-primary" href="${href("/")}" data-link="/">${hero.primary}</a></div>
    </div></div></nav>

  <header class="py-5 bg-body-tertiary"><div class="container py-lg-5">
    <div class="row align-items-center g-4 g-lg-5">
      <div class="col-lg-6 text-center text-lg-start">
        <span class="badge rounded-pill text-bg-primary bg-opacity-10 text-primary mb-3">${icon("sparkles")} 全新 AI 助手上线</span>
        <h1 class="display-4 fw-bold lh-sm mb-3">${esc(hero.title)}</h1>
        <p class="lead text-body-secondary mb-4">${esc(hero.subtitle)}</p>
        <div class="d-flex flex-column flex-sm-row gap-2 justify-content-center justify-content-lg-start mb-4"><a class="btn btn-primary btn-lg" href="${href("/")}" data-link="/">${hero.primary} ${icon("arrow-right")}</a><a class="btn btn-outline-secondary btn-lg" href="${href("/chat")}" data-link="/chat">${icon("play")} ${hero.secondary}</a></div>
        <div class="d-flex align-items-center gap-2 justify-content-center justify-content-lg-start"><div class="d-flex">${each(NAMES, (n, i) => `<span class="d-inline-flex" style="margin-left:${i ? -8 : 0}px">${avatar(n, 32, "border border-2 border-body")}</span>`)}</div><small class="text-body-secondary">${esc(hero.social)}</small></div>
      </div>
      <div class="col-lg-6">${shot("产品截图占位")}</div>
    </div></div></header>

  <section class="py-4 border-bottom"><div class="container"><p class="text-center text-body-secondary small text-uppercase mb-3">受到全球团队信任</p><div class="row g-3 justify-content-center">${each(LOGOS, (l) => `<div class="col-4 col-md-2 text-center"><div class="border rounded-3 py-2 text-body-tertiary fw-semibold small bg-body-tertiary" style="filter:grayscale(1)">${l}</div></div>`)}</div></div></section>

  <section class="py-5"><div class="container">
    <div class="text-center mb-5"><h2 class="fw-bold">一切所需，开箱即用</h2><p class="text-body-secondary">从订单到 AI 分析，六大能力覆盖团队日常。</p></div>
    <div class="row g-4">${each(features, (f) => `<div class="col-md-6 col-lg-4"><div class="card h-100 border-0 shadow-sm"><div class="card-body"><span class="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary fs-4 mb-3" style="width:48px;height:48px">${icon(isIconName(f.icon) ? f.icon : "zap")}</span><h3 class="h5">${esc(f.title)}</h3><p class="text-body-secondary mb-0">${esc(f.desc)}</p></div></div></div>`)}</div>
  </div></section>

  <section class="py-5 bg-body-tertiary"><div class="container">${each(features.slice(0, 3), (f, i) => `<div class="row align-items-center g-4 g-lg-5 ${i < 2 ? "mb-5" : ""}">
    <div class="col-lg-6 ${i % 2 ? "order-lg-2" : ""}">${shot(f.title)}</div>
    <div class="col-lg-6"><span class="badge text-bg-secondary mb-2">0${i + 1}</span><h3 class="fw-bold">${esc(f.title)}</h3><p class="text-body-secondary lead fs-6">${esc(f.desc)}</p><ul class="list-unstyled">${each(["无需代码即可配置", "支持团队协作与权限", "移动端同步可用"], (b) => `<li class="d-flex gap-2 mb-2"><span class="text-success">${icon("check-circle")}</span>${b}</li>`)}</ul><a href="#" class="text-decoration-none">了解更多 ${icon("arrow-right")}</a></div></div>`)}</div></section>

  <section class="py-5 bg-primary text-white"><div class="container"><div class="row g-4 text-center">${each(numbers, (n) => `<div class="col-6 col-lg-3"><div class="display-5 fw-bold">${esc(n.value)}</div><div class="opacity-75">${esc(n.label)}</div></div>`)}</div></div></section>

  <section class="py-5" id="pricing"><div class="container">
    <div class="text-center mb-4"><h2 class="fw-bold">简单透明的定价</h2><p class="text-body-secondary">随团队成长，随时升级或降级。</p>
      <div class="d-inline-flex align-items-center gap-2 form-check form-switch fs-5 ps-0"><span class="fs-6">月付</span><input class="form-check-input ms-0" type="checkbox" role="switch" id="yearly" aria-label="年付切换"><label class="form-check-label fs-6" for="yearly">年付 <span class="badge text-bg-success">省 20%</span></label></div></div>
    <div class="row g-4 justify-content-center">${each(plans, (p) => `<div class="col-md-6 col-lg-4"><div class="card h-100 ${p.recommended ? "border-primary shadow" : ""}"><div class="card-body d-flex flex-column p-4">
      <div class="d-flex justify-content-between align-items-start"><h3 class="h5">${p.name}</h3>${p.recommended ? `<span class="badge text-bg-primary">推荐</span>` : ""}</div>
      <div class="display-6 fw-semibold my-3">${p.price === null ? "联系我们" : p.price === 0 ? "免费" : `¥<span data-price="${p.price}">${p.price}</span><small class="fs-6 text-body-secondary fw-normal">/月</small>`}</div>
      <ul class="list-unstyled flex-grow-1 mb-4">${each(p.features, (f) => `<li class="d-flex align-items-center gap-2 mb-2"><span class="text-success">${icon("check")}</span>${esc(f)}</li>`)}</ul>
      <a href="${href("/login")}" data-link="/login" class="btn ${p.recommended ? "btn-primary" : "btn-outline-primary"} w-100">${p.price === null ? "联系销售" : "开始使用"}</a></div></div></div>`)}</div>
  </div></section>

  <section class="py-5 bg-body-tertiary"><div class="container">
    <h2 class="fw-bold text-center mb-4">用户怎么说</h2>
    <div class="row g-4">${each(testimonials, (t) => `<div class="col-md-6 col-lg-4"><figure class="card h-100 mb-0"><blockquote class="blockquote card-body mb-0 fs-6"><p class="mb-3">“${esc(t.quote)}”</p><figcaption class="d-flex align-items-center gap-2 blockquote-footer mb-0 mt-auto">${avatar(t.name, 36)}<span><span class="d-block text-body fw-medium">${esc(t.name)}</span><cite title="${esc(t.company)}">${esc(t.company)}</cite></span></figcaption></blockquote></figure></div>`)}</div>
  </div></section>

  <section class="py-5"><div class="container" style="max-width:800px">
    <h2 class="fw-bold text-center mb-4">常见问题</h2>
    <div class="accordion" id="faq">${each(faq, (f, i) => `<div class="accordion-item"><h3 class="accordion-header"><button class="accordion-button ${i ? "collapsed" : ""}" type="button" data-bs-toggle="collapse" data-bs-target="#faq${i}" aria-expanded="${i === 0}" aria-controls="faq${i}">${esc(f.q)}</button></h3><div id="faq${i}" class="accordion-collapse collapse ${i ? "" : "show"}" data-bs-parent="#faq"><div class="accordion-body text-body-secondary">${esc(f.a)}</div></div></div>`)}</div>
  </div></section>

  <section class="py-5"><div class="container"><div class="bg-primary text-white rounded-4 p-5 text-center"><h2 class="fw-bold">准备好把工作放进一个控制台了吗？</h2><p class="lead opacity-75 mb-4">${esc(hero.social)}，Starter 计划永久免费。</p><div class="d-flex flex-column flex-sm-row gap-2 justify-content-center"><a class="btn btn-light btn-lg" href="${href("/")}" data-link="/">${hero.primary}</a><a class="btn btn-outline-light btn-lg" href="${href("/chat")}" data-link="/chat">${hero.secondary}</a></div></div></div></section>

  <footer class="border-top py-5 bg-body-tertiary"><div class="container">
    <div class="row g-4">
      <div class="col-lg-4"><div class="d-flex align-items-center gap-2 fw-semibold mb-2"><span class="d-inline-flex align-items-center justify-content-center rounded bg-primary text-white" style="width:28px;height:28px">${icon("boxes")}</span>Acme Console</div><p class="text-body-secondary small">${esc(hero.subtitle)}</p><div class="d-flex gap-2">${each(["github", "globe", "message-circle", "mail"] as const, (n) => `<a href="#" class="btn btn-outline-secondary btn-sm" aria-label="${n}">${icon(n)}</a>`)}</div></div>
      ${each(FOOTER, ([title, links]) => `<div class="col-6 col-lg-2"><h4 class="h6 fw-semibold">${title}</h4><ul class="list-unstyled small">${each(links, (l) => `<li class="mb-1"><a href="#" class="link-body-emphasis link-underline-opacity-0 link-underline-opacity-75-hover">${l}</a></li>`)}</ul></div>`)}
    </div>
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 border-top mt-4 pt-4 small text-body-secondary"><span>© 2026 Acme Console. 保留所有权利。</span><select class="form-select form-select-sm w-auto" aria-label="语言"><option>简体中文</option><option>English</option><option>日本語</option></select></div>
  </div></footer>`

  const mount = (root: HTMLElement) => {
    root.querySelector("#yearly")?.addEventListener("change", (e) => {
      const yearly = (e.target as HTMLInputElement).checked
      root.querySelectorAll<HTMLElement>("[data-price]").forEach((el) => { el.textContent = String(yearly ? Math.round(Number(el.dataset.price) * 0.8) : el.dataset.price) })
    })
    root.querySelector('[data-action="toggle-theme"]')?.addEventListener("click", (e) => { setTheme(isDark() ? "light" : "dark"); (e.currentTarget as HTMLElement).innerHTML = isDark() ? icon("sun") : icon("moon") })
  }
  return { html, mount }
}
