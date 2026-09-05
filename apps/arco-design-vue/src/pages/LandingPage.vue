<script setup lang="ts">
import { ref } from "vue"
import { RouterLink, useRoute } from "vue-router"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import { Icon } from "@/lib/icons"
import { theme, toggleTheme } from "@/lib/settings"

const route = useRoute()
const menuOpen = ref(false)
const yearly = ref(false)
const sections = [
  { key: "features", label: "功能" },
  { key: "pricing", label: "价格" },
  { key: "numbers", label: "数据" },
  { key: "testimonials", label: "客户" },
  { key: "faq", label: "常见问题" },
]

function scrollTo(key: string) {
  document.getElementById(key)?.scrollIntoView({ behavior: "smooth" })
  menuOpen.value = false
}
</script>

<template>
  <div class="landing">
    <header class="landing-nav">
      <div class="landing-inner between">
        <a-space size="small">
          <a-avatar :size="32" shape="square" :style="{ backgroundColor: 'rgb(var(--primary-6))' }">A</a-avatar>
          <strong>Acme Console</strong>
        </a-space>
        <nav class="row hide-mobile" style="gap: 4px">
          <a-button v-for="section in sections" :key="section.key" type="text" @click="scrollTo(section.key)">{{ section.label }}</a-button>
        </nav>
        <a-space size="small">
          <a-button type="text" shape="circle" @click="toggleTheme()"><template #icon><Icon :name="theme === 'dark' ? 'sun' : 'moon'" /></template></a-button>
          <RouterLink :to="{ path: '/login', query: route.query }" class="hide-mobile"><a-button type="text">登录</a-button></RouterLink>
          <RouterLink :to="{ path: '/login', query: route.query }" class="hide-mobile"><a-button type="primary">{{ landing.hero.primary }}</a-button></RouterLink>
          <a-button class="show-mobile" type="text" shape="circle" @click="menuOpen = true"><template #icon><Icon name="menu" /></template></a-button>
        </a-space>
      </div>
      <a-drawer :visible="menuOpen" placement="top" :height="280" :footer="false" title="导航" @cancel="menuOpen = false">
        <a-menu mode="vertical" :selected-keys="[]" @menu-item-click="(key: string) => scrollTo(key)">
          <a-menu-item v-for="section in sections" :key="section.key">{{ section.label }}</a-menu-item>
        </a-menu>
        <RouterLink :to="{ path: '/login', query: route.query }"><a-button type="primary" long style="margin-top: 12px">{{ landing.hero.primary }}</a-button></RouterLink>
      </a-drawer>
    </header>

    <section class="landing-inner hero">
      <a-tag color="arcoblue" bordered style="margin-bottom: 16px">{{ landing.hero.social }}</a-tag>
      <h1 class="hero-title">{{ landing.hero.title }}</h1>
      <p class="hero-subtitle">{{ landing.hero.subtitle }}</p>
      <a-space wrap size="medium" style="justify-content: center">
        <RouterLink :to="{ path: '/login', query: route.query }"><a-button type="primary" size="large">{{ landing.hero.primary }}<template #icon><Icon name="arrow-right" /></template></a-button></RouterLink>
        <a-button size="large"><template #icon><Icon name="play" /></template>{{ landing.hero.secondary }}</a-button>
      </a-space>
      <a-card class="hero-preview" :bordered="true">
        <div class="grid grid-4">
          <a-statistic v-for="stat in stats" :key="stat.key" :title="stat.label" :value="stat.value" show-group-separator :precision="stat.unit === '%' ? 1 : 0">
            <template #suffix><span v-if="stat.unit === '%'">%</span></template>
          </a-statistic>
        </div>
        <a-divider />
        <div class="hero-bars">
          <div v-for="(value, index) in series.revenue" :key="index" class="hero-bar" :style="{ height: `${(value / Math.max(...series.revenue)) * 100}%` }">
            <a-tooltip :content="`${series.months[index]}：¥${value}k`"><span class="hero-bar-fill" /></a-tooltip>
          </div>
        </div>
      </a-card>
    </section>

    <section id="features" class="landing-inner section">
      <h2 class="section-title">为增长团队打造的每个细节</h2>
      <div class="grid grid-3">
        <a-card v-for="feature in landing.features" :key="feature.title" :bordered="true" hoverable>
          <a-avatar shape="square" :size="40" :style="{ backgroundColor: 'rgb(var(--primary-1))', color: 'rgb(var(--primary-6))' }"><Icon :name="feature.icon" /></a-avatar>
          <a-typography-title :heading="6" style="margin: 12px 0 4px">{{ feature.title }}</a-typography-title>
          <a-typography-text type="secondary">{{ feature.desc }}</a-typography-text>
        </a-card>
      </div>
    </section>

    <section class="landing-inner section">
      <div class="grid grid-2 product">
        <div class="stack">
          <a-tag size="small" color="green">实时看板</a-tag>
          <h3 class="section-subtitle">{{ landing.features[2]!.title }}</h3>
          <p class="muted">{{ landing.features[2]!.desc }}</p>
          <a-space direction="vertical">
            <div v-for="item in series.byChannel" :key="item.name" class="row"><Icon name="check" :size="16" style="color: rgb(var(--green-6))" />{{ item.name }} 渠道占比 {{ item.value }}%</div>
          </a-space>
        </div>
        <a-card :bordered="true">
          <a-space direction="vertical" fill>
            <div v-for="item in series.byChannel" :key="item.name" class="stack" style="gap: 4px">
              <div class="between small"><span>{{ item.name }}</span><span>{{ item.value }}%</span></div>
              <a-progress :percent="item.value / 100" :show-text="false" />
            </div>
          </a-space>
        </a-card>
      </div>
      <div class="grid grid-2 product product-reverse">
        <a-card :bordered="true">
          <a-timeline>
            <a-timeline-item v-for="(feature, index) in landing.features.slice(3)" :key="feature.title" :dot-color="index === 0 ? 'rgb(var(--primary-6))' : undefined">{{ feature.title }} — {{ feature.desc }}</a-timeline-item>
          </a-timeline>
        </a-card>
        <div class="stack">
          <a-tag size="small" color="purple">AI 助手</a-tag>
          <h3 class="section-subtitle">{{ landing.features[3]!.title }}</h3>
          <p class="muted">{{ landing.features[3]!.desc }}</p>
          <a-button type="outline" style="align-self: flex-start">了解更多<template #icon><Icon name="arrow-right" /></template></a-button>
        </div>
      </div>
      <div class="grid grid-2 product">
        <div class="stack">
          <a-tag size="small" color="arcoblue">{{ landing.features[5]!.title }}</a-tag>
          <h3 class="section-subtitle">{{ landing.features[5]!.title }}</h3>
          <p class="muted">{{ landing.features[5]!.desc }}</p>
          <a-space direction="vertical">
            <div v-for="feature in landing.features.slice(4, 6)" :key="feature.title" class="row">
              <Icon :name="feature.icon" :size="16" style="color: rgb(var(--primary-6))" />
              <span>{{ feature.title }}</span>
            </div>
          </a-space>
        </div>
        <a-card :bordered="true">
          <a-list :bordered="false">
            <a-list-item v-for="feature in landing.features.slice(4, 6)" :key="feature.title">
              <a-list-item-meta :title="feature.title" :description="feature.desc">
                <template #avatar>
                  <a-avatar shape="square" :style="{ backgroundColor: 'rgb(var(--primary-1))', color: 'rgb(var(--primary-6))' }"><Icon :name="feature.icon" /></a-avatar>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-card>
      </div>
    </section>

    <section id="numbers" class="numbers">
      <div class="landing-inner grid grid-4">
        <div v-for="item in landing.numbers" :key="item.label" class="stack" style="align-items: center; gap: 2px">
          <span class="number-value">{{ item.value }}</span>
          <span class="muted">{{ item.label }}</span>
        </div>
      </div>
    </section>

    <section id="pricing" class="landing-inner section">
      <h2 class="section-title">简单透明的定价</h2>
      <div class="row" style="justify-content: center; margin-bottom: 24px">
        <span :class="{ muted: yearly }">按月</span>
        <a-switch v-model="yearly" />
        <span :class="{ muted: !yearly }">按年 <a-tag size="small" color="green">省 20%</a-tag></span>
      </div>
      <div class="grid grid-3">
        <a-card v-for="plan in plans" :key="plan.name" :bordered="true" :class="{ 'plan-recommended': plan.recommended }" hoverable>
          <div class="between">
            <a-typography-title :heading="5" style="margin: 0">{{ plan.name }}</a-typography-title>
            <a-tag v-if="plan.recommended" color="arcoblue" size="small">推荐</a-tag>
          </div>
          <div style="margin: 12px 0">
            <span style="font-size: 32px; font-weight: 600">{{ plan.price === null ? "联系我们" : `¥${yearly ? Math.round(plan.price * 0.8) : plan.price}` }}</span>
            <span v-if="plan.price !== null" class="muted small"> / 月</span>
          </div>
          <div class="stack" style="gap: 8px; margin-bottom: 20px">
            <div v-for="feature in plan.features" :key="feature" class="row small" style="gap: 6px"><Icon name="check" :size="14" style="color: rgb(var(--green-6))" />{{ feature }}</div>
          </div>
          <a-button long :type="plan.recommended ? 'primary' : 'outline'">{{ plan.price === null ? "联系销售" : landing.hero.primary }}</a-button>
        </a-card>
      </div>
    </section>

    <section id="testimonials" class="landing-inner section">
      <h2 class="section-title">客户怎么说</h2>
      <div class="grid grid-3">
        <a-card v-for="item in landing.testimonials" :key="item.name" :bordered="true">
          <a-rate :default-value="5" readonly :size="14" />
          <p style="margin: 12px 0 16px">“{{ item.quote }}”</p>
          <a-space size="small">
            <a-avatar :size="32">{{ item.name.slice(0, 1) }}</a-avatar>
            <div class="stack" style="gap: 0"><strong class="small">{{ item.name }}</strong><span class="muted small">{{ item.company }}</span></div>
          </a-space>
        </a-card>
      </div>
    </section>

    <section id="faq" class="landing-inner section" style="max-width: 760px">
      <h2 class="section-title">常见问题</h2>
      <a-collapse :default-active-key="['0']" :bordered="false">
        <a-collapse-item v-for="(item, index) in landing.faq" :key="String(index)" :header="item.q">{{ item.a }}</a-collapse-item>
      </a-collapse>
    </section>

    <section class="landing-inner section">
      <a-card class="cta" :bordered="false">
        <h2 class="section-title" style="color: #fff; margin-bottom: 8px">{{ landing.hero.title }}</h2>
        <p style="color: rgba(255, 255, 255, 0.85); margin-bottom: 20px">{{ landing.hero.subtitle }}</p>
        <a-space wrap style="justify-content: center">
          <RouterLink :to="{ path: '/login', query: route.query }"><a-button size="large" style="background: #fff; color: rgb(var(--primary-6))">{{ landing.hero.primary }}</a-button></RouterLink>
          <a-button size="large" type="outline" style="border-color: #fff; color: #fff">{{ landing.hero.secondary }}</a-button>
        </a-space>
      </a-card>
    </section>

    <footer class="landing-footer">
      <div class="landing-inner grid grid-4">
        <div class="stack">
          <strong>Acme Console</strong>
          <span class="muted small">{{ landing.hero.subtitle }}</span>
        </div>
        <div class="stack small"><strong>产品</strong><a-link v-for="feature in landing.features.slice(0, 3)" :key="feature.title">{{ feature.title }}</a-link></div>
        <div class="stack small"><strong>方案</strong><a-link v-for="plan in plans" :key="plan.name">{{ plan.name }}</a-link></div>
        <div class="stack small"><strong>支持</strong><a-link v-for="section in sections" :key="section.key" @click="scrollTo(section.key)">{{ section.label }}</a-link></div>
      </div>
      <div class="landing-inner between small muted" style="padding-top: 24px; flex-wrap: wrap; gap: 8px">
        <span>© 2026 Acme Console</span>
        <a-space><a-link>隐私政策</a-link><a-link>服务条款</a-link></a-space>
      </div>
    </footer>
    <a-back-top :visible-height="400" />
  </div>
</template>

<style scoped>
.landing {
  background: var(--color-bg-1);
}

.landing-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 20px;
}

.landing-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 60px;
  display: flex;
  align-items: center;
  backdrop-filter: blur(8px);
  background: color-mix(in srgb, var(--color-bg-1) 80%, transparent);
  border-bottom: 1px solid var(--color-border-1);
}

.landing-nav .landing-inner {
  width: 100%;
}

.hero {
  padding: 72px 20px 40px;
  text-align: center;
}

.hero-title {
  font-size: clamp(32px, 5vw, 56px);
  line-height: 1.15;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--color-text-2);
  max-width: 640px;
  margin: 0 auto 28px;
}

.hero-preview {
  margin-top: 48px;
  text-align: left;
}

.hero-bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 120px;
}

.hero-bar {
  flex: 1;
  display: flex;
}

.hero-bar-fill {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 4px 4px 0 0;
  background: rgb(var(--primary-6));
  opacity: 0.85;
}

.section {
  padding: 56px 20px;
}

.section-title {
  text-align: center;
  font-size: clamp(24px, 3vw, 32px);
  margin: 0 0 32px;
}

.section-subtitle {
  font-size: 24px;
  margin: 0;
}

.product {
  align-items: center;
  padding: 24px 0;
}

.numbers {
  background: var(--color-fill-1);
  padding: 40px 0;
}

.number-value {
  font-size: 32px;
  font-weight: 600;
  color: rgb(var(--primary-6));
}

.plan-recommended {
  border-color: rgb(var(--primary-6));
  box-shadow: 0 8px 24px rgba(22, 93, 255, 0.12);
}

.cta {
  text-align: center;
  background: linear-gradient(135deg, rgb(var(--primary-6)), rgb(var(--purple-6)));
  padding: 24px 0;
}

.landing-footer {
  border-top: 1px solid var(--color-border-1);
  padding: 40px 0 24px;
}

.landing-footer .stack {
  gap: 6px;
  align-items: flex-start;
}

@media (max-width: 767px) {
  .product-reverse > :first-child {
    order: 2;
  }
}
</style>
