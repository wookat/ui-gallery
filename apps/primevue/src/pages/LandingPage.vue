<script setup lang="ts">
import { ref } from "vue"
import Accordion from "primevue/accordion"
import AccordionPanel from "primevue/accordionpanel"
import AccordionHeader from "primevue/accordionheader"
import AccordionContent from "primevue/accordioncontent"
import Avatar from "primevue/avatar"
import AvatarGroup from "primevue/avatargroup"
import Button from "primevue/button"
import Card from "primevue/card"
import Drawer from "primevue/drawer"
import Select from "primevue/select"
import Tag from "primevue/tag"
import ToggleSwitch from "primevue/toggleswitch"
import AppIcon from "@/icons/AppIcon.vue"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import team from "@ui-gallery/spec/mock/team.json"
import type { IconName } from "@/icons/names"

const mobileOpen = ref(false)
const yearly = ref(false)
const links = landing.features.slice(0, 5).map((feature) => feature.title)
const heroAvatars = team.slice(0, 4).map((person) => person.name.slice(0, 1))
const logoCloud = landing.testimonials.map((item) => item.company)
const footerColumns = [
  { title: "功能", items: landing.features.slice(0, 3).map((feature) => feature.title), href: "#features" },
  { title: "定价", items: plans.map((plan) => plan.name), href: "#pricing" },
  { title: "用户声音", items: landing.testimonials.slice(0, 3).map((item) => item.company), href: "#testimonials" },
]
const featureSections = landing.features.slice(0, 3)
</script>

<template>
  <div class="landing">
    <header class="landing-nav container"><a href="#" class="landing-brand"><span class="landing-logo">A</span><strong>Acme Console</strong></a><nav class="landing-links desktop-only"><a v-for="link in links" :key="link" href="#features">{{ link }}</a></nav><div class="desktop-only"><Button label="免费开始" size="small" @click="$router.push('/login')" /></div><Button class="mobile-only" text rounded aria-label="打开菜单" @click="mobileOpen = true"><template #icon><AppIcon name="menu" :size="18" /></template></Button></header>
    <Drawer v-model:visible="mobileOpen" header="Acme Console" position="right"><nav class="landing-mobile-links"><a v-for="link in links" :key="link" href="#features" @click="mobileOpen = false">{{ link }}</a><Button label="免费开始" @click="$router.push('/login')" /></nav></Drawer>
    <main>
      <section class="hero container"><div class="hero-copy"><Tag value="Acme Console" severity="secondary" /><h1>{{ landing.hero.title }}</h1><p>{{ landing.hero.subtitle }}</p><div class="flex wrap gap-2"><Button :label="landing.hero.primary" @click="$router.push('/login')" /><Button :label="landing.hero.secondary" severity="secondary" outlined /></div><div class="flex items-center gap-3 mt-6"><AvatarGroup><Avatar v-for="name in heroAvatars" :key="name" :label="name" shape="circle" /></AvatarGroup><span class="text-sm muted">{{ landing.hero.social }}</span></div></div><div class="product-placeholder"><div class="placeholder-bar" /><div class="placeholder-grid"><div v-for="n in 6" :key="n" class="placeholder-card" /></div></div></section>
      <section class="logo-cloud container"><span v-for="company in logoCloud" :key="company">{{ company }}</span></section>
      <section id="features" class="landing-section container"><div class="section-intro"><Tag value="功能" /><h2>一个控制台，连接整个团队</h2></div><div class="grid grid-3"><Card v-for="feature in landing.features" :key="feature.title"><template #content><AppIcon :name="feature.icon as IconName" :size="24" /><h3 class="mt-4 font-semibold">{{ feature.title }}</h3><p class="text-sm muted mt-2">{{ feature.desc }}</p></template></Card></div></section>
      <section class="landing-section container split-sections"><div v-for="(feature, index) in featureSections" :key="feature.title" class="split-row" :class="{ reverse: index % 2 === 1 }"><div class="split-placeholder"><AppIcon :name="feature.icon as IconName" :size="40" /></div><div><Tag :value="`0${index + 1}`" severity="secondary" /><h2 class="mt-3">{{ feature.title }}</h2><p class="muted mt-2">{{ feature.desc }}</p><a href="#pricing" class="inline-flex items-center gap-2 mt-4">了解更多 <AppIcon name="arrow-right" :size="16" /></a></div></div></section>
      <section class="numbers-band"><div class="container grid grid-4"><div v-for="number in landing.numbers" :key="number.label" class="text-center"><strong>{{ number.value }}</strong><span>{{ number.label }}</span></div></div></section>
      <section id="pricing" class="landing-section container"><div class="section-intro"><Tag value="定价" /><h2>从今天开始使用</h2><div class="flex items-center justify-center gap-2 mt-4"><span>按月</span><ToggleSwitch v-model="yearly" /><span>按年</span></div></div><div class="grid grid-3"><Card v-for="plan in plans" :key="plan.name"><template #title><div class="flex items-center justify-between"><span>{{ plan.name }}</span><Tag v-if="plan.recommended" value="推荐" /></div></template><template #content><div class="text-2xl font-bold">{{ plan.price === null ? "联系销售" : `¥${yearly ? plan.price * 10 : plan.price}` }}<span v-if="plan.price !== null" class="text-sm muted"> / {{ yearly ? "年" : "月" }}</span></div><ul class="feature-list mt-4"><li v-for="feature in plan.features" :key="feature"><AppIcon name="check" :size="16" />{{ feature }}</li></ul><Button label="选择方案" :outlined="!plan.recommended" fluid /></template></Card></div></section>
      <section id="testimonials" class="landing-section container"><div class="section-intro"><Tag value="用户声音" /><h2>团队都在这样使用</h2></div><div class="grid grid-3"><Card v-for="item in landing.testimonials" :key="item.name"><template #content><p>“{{ item.quote }}”</p><div class="flex items-center gap-2 mt-5"><Avatar :label="item.name.slice(0, 1)" shape="circle" /><div><div class="font-medium">{{ item.name }}</div><div class="text-xs muted">{{ item.company }}</div></div></div></template></Card></div></section>
      <section class="landing-section container"><div class="section-intro"><Tag value="FAQ" /><h2>常见问题</h2></div><Accordion><AccordionPanel v-for="(item, index) in landing.faq" :key="item.q" :value="String(index)"><AccordionHeader>{{ item.q }}</AccordionHeader><AccordionContent><p>{{ item.a }}</p></AccordionContent></AccordionPanel></Accordion></section>
      <section class="cta container"><div><h2>准备好把工作放进一个控制台了吗？</h2><p>{{ landing.hero.subtitle }}</p></div><Button :label="landing.hero.primary" severity="contrast" @click="$router.push('/login')" /></section>
    </main>
    <footer class="landing-footer container"><div><a href="#" class="landing-brand"><span class="landing-logo">A</span><strong>Acme Console</strong></a><p class="text-sm muted mt-3">让团队工作更简单。</p></div><div v-for="column in footerColumns" :key="column.title" class="footer-col"><strong>{{ column.title }}</strong><a v-for="item in column.items" :key="item" :href="column.href">{{ item }}</a></div><div><strong>语言</strong><Select :options="['简体中文', 'English']" model-value="简体中文" class="mt-2" /></div></footer>
  </div>
</template>

<style scoped>
.landing { min-height: 100vh; overflow-x: hidden; }
.landing-nav { display: flex; align-items: center; justify-content: space-between; min-height: 72px; }
.landing-brand { display: inline-flex; align-items: center; gap: 10px; color: inherit; text-decoration: none; }
.landing-brand { display: inline-flex; align-items: center; gap: 10px; color: var(--p-text-color); text-decoration: none; }
.landing-logo { display: grid; place-items: center; width: 32px; height: 32px; flex: none; border-radius: 8px; background: var(--p-primary-color); color: var(--p-primary-contrast-color); font-weight: 700; }
.landing-links, .landing-mobile-links { display: flex; align-items: center; gap: 1.5rem; }
.landing-links a, .landing-mobile-links a, .footer-col a { display: inline-flex; align-items: center; min-height: 40px; padding: 0 6px; color: var(--p-text-muted-color); text-decoration: none; transition: color .15s ease; } .landing-links { gap: .75rem; }
.landing-links a:hover, .landing-mobile-links a:hover, .footer-col a:hover { color: var(--p-primary-color); }
.landing-mobile-links { flex-direction: column; align-items: stretch; gap: 1rem; }
.hero { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 64px; align-items: center; padding-top: 72px; padding-bottom: 96px; }
.hero h1 { font-size: clamp(38px, 5vw, 64px); line-height: 1.1; letter-spacing: -.04em; margin: 18px 0; max-width: 640px; }
.hero p { color: var(--p-text-muted-color); font-size: 18px; max-width: 540px; }
.product-placeholder { min-height: 360px; padding: 18px; border: 1px solid var(--p-content-border-color); border-radius: 18px; background: var(--p-highlight-background); box-shadow: 0 24px 60px color-mix(in srgb, var(--p-primary-color) 16%, transparent); transform: rotate(2deg); }
.placeholder-bar { height: 12px; width: 35%; border-radius: 8px; background: var(--p-primary-color); margin-bottom: 20px; }
.placeholder-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; } .placeholder-card { display: flex; flex-direction: column; gap: 10px; height: 100px; padding: 14px; border-radius: 10px; background: var(--p-content-background); border: 1px solid var(--p-content-border-color); } .placeholder-card::before, .placeholder-card::after { content: ""; display: block; border-radius: 6px; background: var(--p-surface-200); } .placeholder-card::before { width: 45%; height: 10px; } .placeholder-card::after { width: 70%; height: 22px; background: color-mix(in srgb, var(--p-primary-color) 28%, var(--p-content-background)); } .dark .placeholder-card::before { background: var(--p-surface-700); }
.logo-cloud { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; padding-bottom: 80px; } .logo-cloud span { padding: 10px 28px; border-radius: 8px; background: var(--p-surface-100); color: var(--p-text-color); font-weight: 600; letter-spacing: .04em; } .dark .logo-cloud span { background: var(--p-surface-800); }
.landing-section { padding-top: 80px; padding-bottom: 80px; } .section-intro { text-align: center; margin-bottom: 36px; } .section-intro h2, .split-row h2, .cta h2 { font-size: clamp(26px, 4vw, 40px); margin-top: 12px; letter-spacing: -.02em; }
.split-sections { display: flex; flex-direction: column; gap: 80px; } .split-row { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; } .split-row.reverse .split-placeholder { order: 2; } .split-placeholder { display: grid; place-items: center; min-height: 240px; border-radius: 16px; background: var(--p-highlight-background); color: var(--p-primary-color); }
.numbers-band { padding: 56px 0; background: var(--p-highlight-background); } .numbers-band strong { display: block; font-size: 36px; } .numbers-band span { color: var(--p-text-muted-color); }
.feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; } .feature-list i { color: var(--p-green-500); margin-right: 8px; }
.cta { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding-top: 48px; padding-bottom: 48px; border-radius: 16px; background: var(--p-primary-color); color: var(--p-primary-contrast-color); } .cta > div { min-width: 0; } .cta p { opacity: .85; margin-top: 8px; }
.landing-footer { display: grid; grid-template-columns: 2fr repeat(4, 1fr); gap: 32px; padding-top: 72px; padding-bottom: 40px; } .footer-col { display: flex; flex-direction: column; gap: 10px; } .footer-col strong { margin-bottom: 4px; }
@media (max-width: 767px) { .hero { grid-template-columns: 1fr; gap: 40px; padding-top: 40px; padding-bottom: 56px; } .product-placeholder { min-height: 240px; } .logo-cloud { justify-content: flex-start; padding-bottom: 24px; } .landing-section { padding-top: 56px; padding-bottom: 56px; } .split-row, .split-row.reverse { grid-template-columns: 1fr; gap: 24px; } .split-row.reverse .split-placeholder { order: 0; } .numbers-band .grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .numbers-band strong { font-size: 28px; } .cta { width: auto; margin: 0 16px; padding: 28px 20px; flex-direction: column; align-items: flex-start; } .landing-footer { grid-template-columns: repeat(2, minmax(0, 1fr)); padding-top: 48px; } .landing-footer > :first-child { grid-column: span 2; } }
</style>
