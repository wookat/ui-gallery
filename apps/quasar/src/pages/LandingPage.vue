<script setup lang="ts">
import { computed, ref } from "vue"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import AppIcon from "../icons/AppIcon.vue"

const drawer = ref(false)
const yearly = ref(false)
const slide = ref(0)
const language = ref("简体中文")
const navLinks = ["产品", "解决方案", "定价", "资源", "公司"]
const currentPlans = computed(() => plans.map((plan) => ({ ...plan, displayPrice: plan.price === null ? "联系我们" : `¥${yearly.value ? plan.price * 10 : plan.price}` })))
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="landing-page">
    <q-header bordered>
      <q-toolbar class="landing-container">
        <router-link to="/" class="text-weight-bold text-h6" style="text-decoration: none; color: inherit">Acme Console</router-link>
        <q-space />
        <div class="row items-center q-gutter-xs gt-sm">
          <q-btn v-for="link in navLinks" :key="link" flat no-caps :label="link" />
          <q-btn color="primary" label="免费开始" to="/login" />
        </div>
        <q-btn class="lt-md" flat round dense aria-label="打开菜单" @click="drawer = true"><AppIcon name="menu" /></q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="drawer" side="right" overlay bordered class="lt-md">
      <q-list padding><q-item v-for="link in navLinks" :key="link" clickable v-close-popup @click="drawer = false"><q-item-section>{{ link }}</q-item-section></q-item><q-separator /><q-item clickable to="/login"><q-item-section>免费开始</q-item-section></q-item></q-list>
    </q-drawer>
    <q-page-container>
      <q-page>
        <section class="landing-container landing-hero q-py-xl">
          <div class="row items-center q-col-gutter-xl">
            <div class="col-12 col-md-6">
              <div class="text-overline text-primary">ACME CONSOLE</div>
              <h1 class="text-h2 text-weight-bold q-my-md">{{ landing.hero.title }}</h1>
              <p class="text-h6 text-grey-7">{{ landing.hero.subtitle }}</p>
              <div class="row q-gutter-sm q-mt-lg"><q-btn color="primary" size="lg" :label="landing.hero.primary" to="/login" /><q-btn outline size="lg" :label="landing.hero.secondary" /></div>
              <div class="row items-center q-gutter-sm q-mt-lg"><q-avatar v-for="item in landing.testimonials.slice(0, 5)" :key="item.name" size="28px" color="primary" text-color="white">{{ item.name.slice(0, 1) }}</q-avatar><span class="text-body2 text-grey-7">{{ landing.hero.social }}</span></div>
            </div>
            <div class="col-12 col-md-6"><div class="landing-screenshot"><q-skeleton height="100%" /></div></div>
          </div>
        </section>

        <section class="landing-container q-py-xl"><div class="row q-col-gutter-md"><div v-for="index in 6" :key="index" class="col-6 col-md-2"><div class="logo-placeholder">LOGO</div></div></div></section>

        <section class="landing-container q-py-xl"><div class="row q-col-gutter-md"><div v-for="feature in landing.features" :key="feature.title" class="col-12 col-sm-6 col-md-4"><q-card bordered class="full-height"><q-card-section><AppIcon :name="feature.icon" size="28" /><div class="text-h6 q-mt-md">{{ feature.title }}</div><div class="text-body2 text-grey-7 q-mt-sm">{{ feature.desc }}</div></q-card-section></q-card></div></div></section>

        <section v-for="(feature, index) in landing.features.slice(0, 3)" :key="`${feature.title}-split`" class="landing-container q-py-xl">
          <div class="row items-center q-col-gutter-xl" :class="{ reverse: index % 2 === 1 }"><div class="col-12 col-md-6"><div class="text-h4">{{ feature.title }}</div><p class="text-body1 text-grey-7 q-mt-md">{{ feature.desc }}</p></div><div class="col-12 col-md-6"><div class="landing-split-placeholder">IMAGE</div></div></div>
        </section>

        <section class="bg-primary text-white q-py-xl"><div class="landing-container row q-col-gutter-md text-center"><div v-for="number in landing.numbers" :key="number.label" class="col-6 col-md-3"><div class="text-h3 text-weight-bold">{{ number.value }}</div><div class="q-mt-sm">{{ number.label }}</div></div></div></section>

        <section class="landing-container q-py-xl"><div class="row items-center justify-between q-mb-lg"><div><div class="text-h4">灵活的方案</div><div class="text-body2 text-grey-7">选择适合团队的计划。</div></div><q-toggle v-model="yearly" label="年付（每年送两个月）" /></div><div class="row q-col-gutter-md"><div v-for="plan in currentPlans" :key="plan.name" class="col-12 col-md-4"><q-card bordered class="full-height"><q-card-section><div class="row items-center justify-between"><div class="text-h6">{{ plan.name }}</div><q-badge v-if="plan.recommended" color="primary">推荐</q-badge></div><div class="text-h3 q-mt-lg">{{ plan.displayPrice }}<span v-if="plan.price !== null" class="text-body2 text-grey-7"> / 月</span></div><q-list dense class="q-mt-lg"><q-item v-for="item in plan.features" :key="item"><q-item-section avatar><AppIcon name="check-circle" color="positive" /></q-item-section><q-item-section>{{ item }}</q-item-section></q-item></q-list><q-btn outline color="primary" class="full-width q-mt-md" label="选择方案" /></q-card-section></q-card></div></div></section>

        <section class="landing-container q-py-xl"><div class="text-h4 q-mb-lg">客户怎么说</div><q-carousel v-model="slide" animated arrows navigation height="230px" class="bg-transparent lt-md"><q-carousel-slide v-for="(item, index) in landing.testimonials" :key="item.name" :name="index"><q-card flat bordered class="q-pa-lg"><div class="text-h6">“{{ item.quote }}”</div><div class="text-body2 text-grey-7 q-mt-lg">{{ item.name }} · {{ item.company }}</div></q-card></q-carousel-slide></q-carousel><div class="row q-col-gutter-md gt-sm"><div v-for="item in landing.testimonials" :key="item.name" class="col-12 col-md-4"><q-card bordered class="full-height q-pa-md"><div>“{{ item.quote }}”</div><div class="text-caption text-grey-7 q-mt-md">{{ item.name }} · {{ item.company }}</div></q-card></div></div></section>

        <section class="landing-container q-py-xl"><div class="text-h4 q-mb-md">常见问题</div><q-list bordered separator><q-expansion-item v-for="item in landing.faq" :key="item.q" :label="item.q"><q-card><q-card-section>{{ item.a }}</q-card-section></q-card></q-expansion-item></q-list></section>

        <section class="landing-container q-py-xl"><q-card class="bg-primary text-white q-pa-xl"><div class="row items-center justify-between q-col-gutter-lg"><div class="col-12 col-md-8"><div class="text-h4">准备开始了吗？</div><div class="q-mt-sm">让团队的每一次决策都更清晰。</div></div><div class="col-12 col-md-auto"><q-btn color="white" text-color="primary" label="免费开始" to="/login" /></div></div></q-card></section>

        <footer class="landing-container q-py-xl"><div class="row q-col-gutter-lg"><div class="col-12 col-md-4"><div class="text-h6">Acme Console</div><div class="text-body2 text-grey-7 q-mt-sm">让业务协作更简单。</div><div class="row q-gutter-xs q-mt-md"><q-btn flat round dense><AppIcon name="github" /></q-btn><q-btn flat round dense><AppIcon name="globe" /></q-btn><q-btn flat round dense><AppIcon name="message-circle" /></q-btn></div></div><div v-for="group in [{ title: '产品', links: ['文档', '定价'] }, { title: '资源', links: ['博客', '帮助中心'] }, { title: '公司', links: ['关于', '联系我们'] }, { title: '法律', links: ['隐私', '条款'] }]" :key="group.title" class="col-6 col-md-2"><div class="text-weight-medium">{{ group.title }}</div><q-list dense class="q-mt-sm"><q-item v-for="link in group.links" :key="link" dense clickable><q-item-section>{{ link }}</q-item-section></q-item></q-list></div></div><q-separator class="q-my-lg" /><div class="row items-center justify-between"><div class="text-caption text-grey-7">© 2026 Acme Console</div><q-select v-model="language" dense borderless :options="['简体中文', 'English', '日本語']" style="width: 130px" /></div></footer>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
