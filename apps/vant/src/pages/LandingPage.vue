<script setup lang="ts">
import { ref } from "vue"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import AppIcon from "@/components/AppIcon.vue"

const menu = ref(false)
const yearly = ref(false)
const faq = ref<string[]>([])
const links = ["产品", "方案", "价格", "帮助中心", "关于我们"]
const logoCloud = landing.testimonials.map((item) => item.company)
</script>

<template>
  <div>
    <nav class="landing-nav"><RouterLink class="brand" to="/"><span class="brand-mark"><AppIcon name="zap" /></span>Acme Console</RouterLink><div class="desktop-only inline"><a v-for="link in links" :key="link" class="nav-link" href="#features">{{ link }}</a><van-button type="primary" to="/login">开始使用</van-button></div><van-button class="mobile-only" plain @click="menu = true"><AppIcon name="menu" /></van-button></nav>
    <van-popup v-model:show="menu" position="right" :style="{ width: '75%', height: '100%' }"><van-cell v-for="link in links" :key="link" :title="link" is-link /></van-popup>
    <section class="hero"><div class="stack"><div><van-tag type="primary">ACME CONSOLE</van-tag></div><h1>{{ landing.hero.title }}</h1><p class="muted">{{ landing.hero.subtitle }}</p><div class="inline hero-actions"><van-button type="primary" to="/login">{{ landing.hero.primary }}<AppIcon name="arrow-right" /></van-button><van-button plain>{{ landing.hero.secondary }}</van-button></div><div class="inline muted"><span v-for="name in ['林', '王', 'A', 'M']" :key="name" class="initial">{{ name }}</span>{{ landing.hero.social }}</div></div><div class="hero-shot"><van-skeleton-image /><div class="screenshot-grid"><span /><span /><span /><span /></div></div></section>
    <section class="landing-section logo-cloud"><div v-for="name in logoCloud" :key="name" class="logo-placeholder">{{ name }}</div></section>
    <section id="features" class="landing-section"><div class="section-intro"><h2>特性</h2><p class="muted">{{ landing.hero.subtitle }}</p></div><div class="grid grid-3"><div v-for="feature in landing.features" :key="feature.title" class="card"><AppIcon :name="feature.icon" :size="24" /><h3>{{ feature.title }}</h3><p class="muted">{{ feature.desc }}</p></div></div></section>
    <section class="landing-section product-splits"><div v-for="(feature, index) in landing.features.slice(0, 3)" :key="feature.title" class="split-row" :class="{ reverse: index % 2 }"><div><van-tag plain>0{{ index + 1 }}</van-tag><h2>{{ feature.title }}</h2><p class="muted">{{ feature.desc }}</p></div><div class="split-placeholder"><AppIcon :name="feature.icon" :size="42" /></div></div></section>
    <section class="numbers-band"><div v-for="item in landing.numbers" :key="item.label"><strong>{{ item.value }}</strong><span>{{ item.label }}</span></div></section>
    <section id="pricing" class="landing-section"><div class="section-intro between"><div><h2>选择方案</h2><p class="muted">简单透明</p></div><div class="inline billing-toggle">月 <van-switch v-model="yearly" aria-label="按年付费" /> 年</div></div><div class="grid grid-3"><div v-for="plan in plans" :key="plan.name" class="card price-card"><div class="between"><h3>{{ plan.name }}</h3><van-tag v-if="plan.recommended" type="success">推荐</van-tag></div><strong>{{ plan.price === null ? "定制" : plan.price === 0 ? "免费" : `¥${yearly ? plan.price * 10 : plan.price}` }}</strong><van-cell v-for="item in plan.features" :key="item" :title="item"><template #icon><AppIcon name="check" :size="14" /></template></van-cell><van-button block type="primary" plain>开始使用</van-button></div></div></section>
    <section class="landing-section"><div class="section-intro"><h2>用户评价</h2></div><van-swipe :loop="false" indicator-color="var(--van-primary-color)"><van-swipe-item v-for="item in landing.testimonials" :key="item.name"><div class="card testimonial"><p>“{{ item.quote }}”</p><strong>{{ item.name }}</strong><span class="muted">{{ item.company }}</span></div></van-swipe-item></van-swipe></section>
    <section class="landing-section"><h2>常见问题</h2><van-collapse v-model="faq"><van-collapse-item v-for="item in landing.faq" :key="item.q" :title="item.q" :name="item.q">{{ item.a }}</van-collapse-item></van-collapse></section>
    <section class="cta-banner"><h2>准备开始了吗？</h2><van-button type="primary" to="/login">免费开始</van-button></section>
    <footer class="landing-footer"><div><strong>Acme Console</strong><p class="muted">业务协同控制台</p></div><div v-for="column in ['产品', '资源', '公司']" :key="column" class="stack"><strong>{{ column }}</strong><a v-for="link in links.slice(0, 3)" :key="link" class="footer-link" href="#features">{{ link }}</a></div><div class="inline"><AppIcon name="globe" /><AppIcon name="link" /><AppIcon name="star" /></div><small class="muted">© 2026 Acme Console</small></footer>
  </div>
</template>

<style scoped>
.logo-cloud { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; border-top: 1px solid var(--van-border-color); border-bottom: 1px solid var(--van-border-color); }
.logo-placeholder { min-height: 48px; display: grid; place-items: center; color: var(--van-text-color-2); background: var(--van-background-2); border-radius: 8px; }
.initial { display: grid; place-items: center; width: 28px; height: 28px; margin-right: -4px; border: 2px solid var(--van-background); border-radius: 50%; background: var(--van-primary-color); color: white; font-size: 12px; }
.section-intro { margin-bottom: 24px; }
.hero-actions .van-button { height: 48px; padding: 0 22px; }
.landing-footer .stack { gap: 0; }
.landing-footer .stack > strong { margin-bottom: 4px; }
.section-intro h2, .product-splits h2 { margin: 0 0 8px; font-size: 30px; }
.split-row { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; padding: 44px 0; }
.split-row.reverse > :first-child { order: 2; }
.split-placeholder { min-height: 220px; display: grid; place-items: center; border: 1px solid var(--van-border-color); border-radius: 16px; }
.numbers-band { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 44px 24px; text-align: center; border-top: 1px solid var(--van-border-color); border-bottom: 1px solid var(--van-border-color); }
.numbers-band strong { display: block; font-size: 34px; }
.numbers-band span { color: var(--van-text-color-2); }
.price-card > strong { display: block; font-size: 32px; margin: 14px 0; }
.testimonial { margin: 0 6px 22px; min-height: 140px; }
.testimonial span { display: block; margin-top: 4px; }
.cta-banner { display: flex; align-items: center; justify-content: space-between; gap: 20px; max-width: 1120px; margin: 20px auto 56px; padding: 36px; border-radius: 16px; background: var(--van-primary-color-light); }
.landing-footer { display: grid; grid-template-columns: 2fr repeat(3, 1fr) 1fr; gap: 24px; padding: 40px 24px; border-top: 1px solid var(--van-border-color); }
@media (max-width: 767px) { .logo-cloud { grid-template-columns: repeat(2, 1fr); } .split-row { grid-template-columns: 1fr; gap: 20px; } .split-row.reverse > :first-child { order: initial; } .numbers-band { grid-template-columns: repeat(2, 1fr); } .cta-banner { margin: 20px 16px 40px; flex-direction: column; align-items: flex-start; } .landing-footer { grid-template-columns: repeat(2, 1fr); } }
</style>
