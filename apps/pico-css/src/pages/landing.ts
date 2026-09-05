import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import { icon } from "../icons"

export function render(): string {
  const splitFeatures = landing.features.slice(0, 3)
  return `<div class="landing-page">
    <nav class="landing-nav"><a class="brand" href="/apps/pico-css/"><span class="brand-mark">A</span>Acme Console</a><div class="landing-links"><a href="#features">产品</a><a href="#pricing">价格</a><a href="#faq">FAQ</a><a href="#stories">客户</a><a href="#contact">联系</a></div><a role="button" href="/apps/pico-css/login">开始使用</a><button class="outline landing-menu" id="landing-menu">${icon("menu")}</button></nav>
    <main>
      <section class="landing-hero"><div><p class="eyebrow">ACME CONSOLE</p><h1>${landing.hero.title}</h1><p class="lead">${landing.hero.subtitle}</p><div class="hero-actions"><a role="button" href="/apps/pico-css/login">${landing.hero.primary} ${icon("arrow-right")}</a><a role="button" class="outline" href="#features">${landing.hero.secondary}</a></div><p class="social-proof"><span class="avatar-group"><span class="avatar">林</span><span class="avatar">王</span><span class="avatar">A</span><span class="avatar">M</span></span>${landing.hero.social}</p></div><div class="product-placeholder"><div class="skeleton"></div><div class="placeholder-grid"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div></div></section>
      <section class="logo-cloud">${Array.from({ length: 6 }, () => "<span>Logo</span>").join("")}</section>
      <section id="features" class="landing-section"><header><h2>功能</h2></header><div class="feature-grid">${landing.features.map((f) => `<article><span class="feature-icon">${icon(f.icon, 22)}</span><h3>${f.title}</h3><p>${f.desc}</p></article>`).join("")}</div></section>
      <section class="split-sections">${splitFeatures.map((feature, i) => `<article class="${i % 2 ? "reverse" : ""}"><div><p class="eyebrow">0${i + 1}</p><h2>${feature.title}</h2><p>${feature.desc}</p><a href="#features">了解更多 ${icon("arrow-right")}</a></div><div class="product-placeholder"><div class="skeleton"></div></div></article>`).join("")}</section>
      <section class="stats-band">${landing.numbers.map((n) => `<div><strong>${n.value}</strong><span>${n.label}</span></div>`).join("")}</section>
      <section id="pricing" class="landing-section"><header><h2>方案</h2><div class="segmented" role="group"><button id="monthly">月</button><button id="yearly" class="outline">年</button></div></header><div class="pricing-grid">${plans.map((p) => `<article>${p.recommended ? "<mark>推荐</mark>" : ""}<h3>${p.name}</h3><strong class="price" data-month="${p.price ?? "custom"}">${p.price === null ? "联系我们" : p.price === 0 ? "免费" : `¥${p.price}`} </strong><small>${p.price ? "/ 月" : ""}</small><ul>${p.features.map((f) => `<li>${f}</li>`).join("")}</ul><a role="button" class="${p.recommended ? "" : "outline"}" href="/apps/pico-css/login">开始使用</a></article>`).join("")}</div></section>
      <section id="stories" class="landing-section"><header><h2>客户反馈</h2></header><div class="testimonial-grid">${landing.testimonials.map((t) => `<article><p>“${t.quote}”</p><footer><span class="avatar">${t.name.slice(0, 1)}</span><span><strong>${t.name}</strong><small>${t.company}</small></span></footer></article>`).join("")}</div></section>
      <section id="faq" class="landing-section"><header><h2>常见问题</h2></header>${landing.faq.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join("")}</section>
      <section id="contact" class="cta-banner"><h2>${landing.hero.title}</h2><p>${landing.hero.subtitle}</p><a role="button" href="/apps/pico-css/login">${landing.hero.primary}</a></section>
    </main>
    <footer class="landing-footer"><div><strong>Acme Console</strong><small>© 2026 Acme Console</small></div><div><strong>产品</strong><a href="#features">功能</a><a href="#pricing">价格</a></div><div><strong>资源</strong><a href="#faq">帮助中心</a><a href="/apps/pico-css/chat">AI 助手</a></div><div><strong>语言</strong><select><option>简体中文</option><option>English</option></select></div></footer>
  </div>`
}

export function mount(root: HTMLElement): void {
  root.querySelector("#landing-menu")?.addEventListener("click", () => root.querySelector(".landing-links")?.classList.toggle("open"))
  root.querySelector("#yearly")?.addEventListener("click", () => root.querySelectorAll<HTMLElement>(".price").forEach((price) => {
    const value = price.dataset.month
    if (value && value !== "custom" && value !== "0") price.textContent = `¥${Math.round(Number(value) * 10)}`
  }))
}
