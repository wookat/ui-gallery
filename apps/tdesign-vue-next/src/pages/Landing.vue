<script setup lang="ts">
import { computed, ref } from "vue"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import team from "@ui-gallery/spec/mock/team.json"
import Icon from "@/components/Icon.vue"
import { settings, toggleTheme } from "@/settings"
import { initials } from "@/pages/shared"

const navLinks = [
  { label: "产品", href: "#features" },
  { label: "方案", href: "#split" },
  { label: "定价", href: "#pricing" },
  { label: "客户", href: "#testimonials" },
  { label: "帮助", href: "#faq" },
]
const drawer = ref(false)
const yearly = ref(false)
const lang = ref("zh-CN")
const priceOf = (p: (typeof plans)[number]) => (p.price === null ? "联系销售" : `¥${yearly.value ? Math.round(p.price * 10) : p.price}`)
const unit = computed(() => (yearly.value ? "/年" : "/月"))
const splits = [
  { title: "订单一屏掌握", desc: "筛选、批量操作、导出与详情抽屉，处理效率翻倍。", icon: "shopping-cart" },
  { title: "实时看板", desc: "收入、订单、转化等核心指标随时可见，支持日/周/月切换。", icon: "bar-chart" },
  { title: "AI 助手随叫随到", desc: "用自然语言查询业务数据，自动生成 SQL 与周报。", icon: "bot" },
]
const footerCols = [
  { title: "产品", links: ["功能", "定价", "更新日志", "路线图"] },
  { title: "资源", links: ["文档", "API", "状态页", "社区"] },
  { title: "公司", links: ["关于", "博客", "招聘", "联系我们"] },
  { title: "法律", links: ["隐私", "条款", "安全", "合规"] },
]
</script>

<template>
  <div class="ug-landing">
    <header class="ug-lnav">
      <div class="ug-lwrap ug-between">
        <RouterLink to="/landing" class="ug-brand"><span class="ug-brand-mark">A</span><span>Acme Console</span></RouterLink>
        <nav class="ug-lnav-links ug-desktop-only">
          <t-link v-for="l in navLinks" :key="l.href" :href="l.href" theme="default" hover="color">{{ l.label }}</t-link>
        </nav>
        <div class="ug-row ug-lnav-actions">
          <t-button variant="text" shape="square" :aria-label="settings.theme === 'dark' ? '切换亮色' : '切换暗色'" @click="toggleTheme"><Icon :name="settings.theme === 'dark' ? 'sun' : 'moon'" :size="18" /></t-button>
          <RouterLink to="/login" class="ug-desktop-only"><t-button variant="text">登录</t-button></RouterLink>
          <t-button theme="primary" class="ug-desktop-only">{{ landing.hero.primary }}</t-button>
          <t-button variant="text" shape="square" class="ug-mobile-only" aria-label="菜单" @click="drawer = true"><Icon name="menu" :size="20" /></t-button>
        </div>
      </div>
    </header>
    <t-drawer v-model:visible="drawer" placement="right" size="280px" header="菜单" :footer="false">
      <div class="ug-stack">
        <t-link v-for="l in navLinks" :key="l.href" :href="l.href" theme="default" size="large" @click="drawer = false">{{ l.label }}</t-link>
        <t-divider />
        <RouterLink to="/login"><t-button block variant="outline">登录</t-button></RouterLink>
        <t-button block theme="primary">{{ landing.hero.primary }}</t-button>
      </div>
    </t-drawer>

    <section class="ug-hero">
      <div class="ug-lwrap ug-hero-grid">
        <div class="ug-hero-copy">
          <t-tag theme="primary" variant="light" shape="round"><template #icon><Icon name="sparkles" :size="14" /></template>全新 AI 助手上线</t-tag>
          <h1 class="ug-h1">{{ landing.hero.title }}</h1>
          <p class="ug-lead">{{ landing.hero.subtitle }}</p>
          <div class="ug-row">
            <RouterLink to="/login"><t-button theme="primary" size="large">{{ landing.hero.primary }}<template #suffix><Icon name="arrow-right" /></template></t-button></RouterLink>
            <RouterLink to="/"><t-button variant="outline" size="large">{{ landing.hero.secondary }}</t-button></RouterLink>
          </div>
          <div class="ug-row ug-social">
            <t-avatar-group :max="5" size="small" cascading="left-up">
              <t-avatar v-for="m in team" :key="m.email">{{ initials(m.name) }}</t-avatar>
            </t-avatar-group>
            <span class="ug-muted">{{ landing.hero.social }}</span>
          </div>
        </div>
        <div class="ug-hero-shot">
          <div class="ug-shot-bar"><span /><span /><span /></div>
          <t-skeleton :row-col="[[{ width: '40%' }, { width: '20%' }], [{}, {}, {}], [{ height: '120px' }], [{}, {}]]" animation="none" />
        </div>
      </div>
    </section>

    <section class="ug-logos">
      <div class="ug-lwrap">
        <p class="ug-muted ug-center">受到各类团队信赖</p>
        <div class="ug-logo-grid">
          <div v-for="t in landing.testimonials" :key="t.company" class="ug-logo"><Icon name="boxes" :size="18" />{{ t.company }}</div>
        </div>
      </div>
    </section>

    <section id="features" class="ug-section">
      <div class="ug-lwrap">
        <h2 class="ug-h2 ug-center">一个控制台，覆盖团队日常</h2>
        <p class="ug-lead ug-center ug-muted">从订单到看板，从表单到 AI 助手。</p>
        <div class="ug-grid-3">
          <t-card v-for="f in landing.features" :key="f.title" :bordered="true" hover-shadow>
            <div class="ug-feature-icon"><Icon :name="f.icon" :size="20" /></div>
            <div class="ug-feature-title">{{ f.title }}</div>
            <p class="ug-muted">{{ f.desc }}</p>
          </t-card>
        </div>
      </div>
    </section>

    <section id="split" class="ug-section ug-section--alt">
      <div class="ug-lwrap ug-stack ug-splits">
        <div v-for="(s, i) in splits" :key="s.title" class="ug-split" :class="{ 'ug-split--rev': i % 2 === 1 }">
          <div class="ug-split-copy">
            <t-tag variant="light" theme="primary" shape="round"><template #icon><Icon :name="s.icon" :size="14" /></template>{{ s.title }}</t-tag>
            <h3 class="ug-h3">{{ s.title }}</h3>
            <p class="ug-lead ug-muted">{{ s.desc }}</p>
            <t-link theme="primary" hover="color">了解更多 <Icon name="arrow-right" :size="14" /></t-link>
          </div>
          <div class="ug-hero-shot ug-split-shot">
            <t-skeleton :row-col="[[{ width: '50%' }], [{}, {}], [{ height: '100px' }]]" animation="none" />
          </div>
        </div>
      </div>
    </section>

    <section class="ug-numbers">
      <div class="ug-lwrap ug-grid-4">
        <div v-for="n in landing.numbers" :key="n.label" class="ug-number">
          <t-statistic :title="n.label" :value="0" class="ug-number-stat"><template #extra><span class="ug-number-value">{{ n.value }}</span></template></t-statistic>
        </div>
      </div>
    </section>

    <section id="pricing" class="ug-section">
      <div class="ug-lwrap">
        <h2 class="ug-h2 ug-center">简单透明的定价</h2>
        <div class="ug-center ug-row ug-pricing-toggle"><span :class="{ 'ug-muted': yearly }">月付</span><t-switch v-model="yearly" /><span :class="{ 'ug-muted': !yearly }">年付 <t-tag size="small" theme="success" variant="light">省 2 个月</t-tag></span></div>
        <div class="ug-grid-3">
          <t-card v-for="p in plans" :key="p.name" :bordered="true" :class="{ 'ug-plan--rec': p.recommended }" :title="p.name">
            <template v-if="p.recommended" #actions><t-tag theme="primary" size="small">推荐</t-tag></template>
            <div class="ug-price">{{ priceOf(p) }}<span v-if="p.price !== null" class="ug-muted ug-small">{{ unit }}</span></div>
            <ul class="ug-features"><li v-for="f in p.features" :key="f" class="ug-row"><Icon name="check" class="ug-check" />{{ f }}</li></ul>
            <t-button block :theme="p.recommended ? 'primary' : 'default'" :variant="p.recommended ? 'base' : 'outline'">{{ p.price === null ? "联系我们" : p.price === 0 ? "免费开始" : "立即订阅" }}</t-button>
          </t-card>
        </div>
      </div>
    </section>

    <section id="testimonials" class="ug-section ug-section--alt">
      <div class="ug-lwrap">
        <h2 class="ug-h2 ug-center">用户怎么说</h2>
        <div class="ug-grid-3">
          <t-card v-for="t in landing.testimonials" :key="t.name" :bordered="true">
            <Icon name="quote" class="ug-quote-icon" />
            <p class="ug-quote">{{ t.quote }}</p>
            <div class="ug-row"><t-avatar size="small">{{ initials(t.name) }}</t-avatar><div><div>{{ t.name }}</div><div class="ug-muted ug-small">{{ t.company }}</div></div></div>
          </t-card>
        </div>
      </div>
    </section>

    <section id="faq" class="ug-section">
      <div class="ug-lwrap ug-faq">
        <h2 class="ug-h2 ug-center">常见问题</h2>
        <t-collapse :default-value="[0]" expand-icon-placement="right" borderless>
          <t-collapse-panel v-for="(f, i) in landing.faq" :key="f.q" :value="i" :header="f.q">{{ f.a }}</t-collapse-panel>
        </t-collapse>
      </div>
    </section>

    <section class="ug-section">
      <div class="ug-lwrap">
        <div class="ug-cta">
          <div><h2 class="ug-h2">准备好开始了吗？</h2><p class="ug-lead">{{ landing.hero.subtitle }}</p></div>
          <t-space><t-button size="large" theme="default" variant="base">{{ landing.hero.primary }}</t-button><t-button size="large" variant="outline" ghost>{{ landing.hero.secondary }}</t-button></t-space>
        </div>
      </div>
    </section>

    <footer class="ug-footer">
      <div class="ug-lwrap">
        <div class="ug-footer-grid">
          <div class="ug-footer-brand">
            <div class="ug-brand"><span class="ug-brand-mark">A</span><span>Acme Console</span></div>
            <p class="ug-muted ug-small">{{ landing.hero.subtitle }}</p>
            <t-space size="small">
              <t-button variant="text" shape="square" aria-label="GitHub"><Icon name="github" /></t-button>
              <t-button variant="text" shape="square" aria-label="Twitter"><Icon name="twitter" /></t-button>
              <t-button variant="text" shape="square" aria-label="微信"><Icon name="wechat" /></t-button>
            </t-space>
          </div>
          <div v-for="c in footerCols" :key="c.title" class="ug-footer-col">
            <div class="ug-footer-title">{{ c.title }}</div>
            <t-link v-for="l in c.links" :key="l" theme="default" hover="color" class="ug-footer-link">{{ l }}</t-link>
          </div>
        </div>
        <t-divider />
        <div class="ug-between">
          <span class="ug-muted ug-small">© 2026 Acme Console. 演示数据，非真实产品。</span>
          <t-select v-model="lang" :options="[{ label: '简体中文', value: 'zh-CN' }, { label: 'English', value: 'en-US' }]" size="small" style="width: 140px"><template #prefixIcon><Icon name="languages" :size="14" /></template></t-select>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
.ug-landing { min-height: 100vh; background: var(--td-bg-color-container); color: var(--td-text-color-primary); }
.ug-lwrap { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
.ug-lnav { position: sticky; top: 0; z-index: 20; height: 60px; display: flex; align-items: center; background: color-mix(in srgb, var(--td-bg-color-container) 85%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--td-component-stroke); }
.ug-lnav > .ug-lwrap { width: 100%; flex-wrap: nowrap; }
.ug-lnav-links { display: flex; gap: 24px; }
.ug-lnav-actions { flex-wrap: nowrap; }
.ug-brand { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; color: inherit; }
.ug-brand-mark { width: 28px; height: 28px; border-radius: 8px; background: var(--td-brand-color); color: #fff; display: inline-grid; place-items: center; font-weight: 700; }
.ug-hero { padding: 72px 0 48px; }
.ug-hero-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 40px; align-items: center; }
.ug-hero-copy { display: flex; flex-direction: column; gap: 20px; align-items: flex-start; }
.ug-h1 { font-size: 44px; line-height: 1.15; margin: 0; letter-spacing: -0.02em; }
.ug-h2 { font-size: 30px; line-height: 1.2; margin: 0 0 12px; }
.ug-h3 { font-size: 24px; margin: 12px 0; }
.ug-lead { font-size: 17px; line-height: 1.6; margin: 0; }
.ug-center { text-align: center; justify-content: center; }
.ug-hero-shot { border: 1px solid var(--td-component-stroke); border-radius: 12px; padding: 16px; background: var(--td-bg-color-page); box-shadow: var(--td-shadow-2); }
.ug-shot-bar { display: flex; gap: 6px; margin-bottom: 14px; }
.ug-shot-bar span { width: 10px; height: 10px; border-radius: 50%; background: var(--td-component-stroke); }
.ug-logos { padding: 24px 0 8px; }
.ug-logo-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; margin-top: 12px; }
.ug-logo { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px; border-radius: 8px; color: var(--td-text-color-placeholder); font-weight: 600; filter: grayscale(1); }
.ug-section { padding: 64px 0; }
.ug-section--alt { background: var(--td-bg-color-page); }
.ug-section .ug-lead.ug-center { margin-bottom: 32px; }
.ug-feature-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--td-brand-color-light); color: var(--td-brand-color); display: grid; place-items: center; margin-bottom: 12px; }
.ug-feature-title { font-weight: 600; margin-bottom: 4px; }
.ug-splits { gap: 56px; }
.ug-split { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
.ug-split--rev .ug-split-copy { order: 2; }
.ug-split-copy { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.ug-numbers { padding: 48px 0; background: var(--td-brand-color); color: #fff; }
.ug-grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.ug-number { text-align: center; }
.ug-number-stat .t-statistic-title { color: rgba(255, 255, 255, 0.8) !important; }
.ug-number-stat .t-statistic-content { display: none; }
.ug-number-value { font-size: 36px; font-weight: 700; }
.ug-pricing-toggle { margin: 8px 0 32px; }
.ug-quote-icon { color: var(--td-brand-color); margin-bottom: 8px; }
.ug-quote { margin: 0 0 16px; line-height: 1.6; }
.ug-faq { max-width: 760px; }
.ug-faq .ug-h2 { margin-bottom: 24px; }
.ug-cta { border-radius: 16px; background: var(--td-brand-color); color: #fff; padding: 40px; display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
.ug-cta .ug-h2 { margin-bottom: 4px; }
.ug-cta .t-button--variant-outline.t-button--ghost { color: #fff; border-color: rgba(255, 255, 255, 0.6); }
.ug-footer { padding: 48px 0 24px; border-top: 1px solid var(--td-component-stroke); }
.ug-footer-grid { display: grid; grid-template-columns: 2fr repeat(4, 1fr); gap: 24px; }
.ug-footer-brand { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.ug-footer-col { display: flex; flex-direction: column; gap: 8px; }
.ug-footer-title { font-weight: 600; margin-bottom: 4px; }
@media (max-width: 1023px) {
  .ug-footer-grid { grid-template-columns: repeat(2, 1fr); }
  .ug-footer-brand { grid-column: span 2; }
  .ug-logo-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 767px) {
  .ug-hero { padding: 40px 0 32px; }
  .ug-hero-grid, .ug-split { grid-template-columns: minmax(0, 1fr); }
  .ug-split--rev .ug-split-copy { order: 0; }
  .ug-h1 { font-size: 32px; }
  .ug-h2 { font-size: 24px; }
  .ug-grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ug-number-value { font-size: 28px; }
  .ug-section { padding: 40px 0; }
  .ug-cta { padding: 24px; }
}
</style>
