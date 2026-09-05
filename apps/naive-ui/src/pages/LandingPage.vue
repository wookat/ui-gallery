<script setup lang="ts">
import { ref } from "vue"
import { NButton, NCard, NFlex, NGrid, NGi, NH1, NH2, NText, NP, NTag, NAvatar, NCollapse, NCollapseItem, NSwitch, NSpace, NLayout, NLayoutHeader, NLayoutFooter, NDrawer, NDrawerContent, NMenu, NDivider, NStatistic, NIcon } from "naive-ui"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import { Icon, type IconName } from "../icons"
import { toggleTheme, isDark } from "../settings"
import { useIsMobile } from "../composables"

const isMobile = useIsMobile()
const menuOpen = ref(false)
const yearly = ref(false)
const navItems = ["功能", "价格", "常见问题"]
const logos = landing.testimonials.map((t) => t.company)
const menuOptions = navItems.map((n) => ({ label: n, key: n }))
const featureIcons = ["zap", "shield", "bar-chart", "bot", "globe", "plug", "sparkles"] as const
</script>

<template>
  <NLayout style="min-height: 100vh">
    <NLayoutHeader bordered position="absolute" style="height: 60px; z-index: 10; backdrop-filter: blur(8px)">
      <NFlex align="center" justify="space-between" style="height: 60px; max-width: 1120px; margin: 0 auto; padding: 0 20px">
        <NFlex align="center" :size="8"><NAvatar :size="28" color="#18a058" style="font-weight: 700">A</NAvatar><NText strong>Acme Console</NText></NFlex>
        <NFlex v-if="!isMobile" align="center" :size="8">
          <NButton v-for="n in navItems" :key="n" quaternary>{{ n }}</NButton>
          <NButton quaternary circle aria-label="切换主题" @click="toggleTheme()"><template #icon><Icon :name="isDark ? 'sun' : 'moon'" /></template></NButton>
          <NButton secondary tag="a" href="/apps/naive-ui/login">登录</NButton>
          <NButton type="primary" tag="a" href="/apps/naive-ui/">免费试用</NButton>
        </NFlex>
        <NButton v-else quaternary circle aria-label="菜单" @click="menuOpen = true"><template #icon><Icon name="menu" /></template></NButton>
      </NFlex>
    </NLayoutHeader>
    <NDrawer v-model:show="menuOpen" placement="right" width="260"><NDrawerContent title="菜单" closable><NMenu :options="menuOptions" /><NDivider /><NSpace vertical><NButton block secondary tag="a" href="/apps/naive-ui/login">登录</NButton><NButton block type="primary" tag="a" href="/apps/naive-ui/">免费试用</NButton><NButton block quaternary @click="toggleTheme()">切换{{ isDark ? "亮色" : "暗色" }}</NButton></NSpace></NDrawerContent></NDrawer>

    <div style="max-width: 1120px; margin: 0 auto; padding: 120px 20px 60px">
      <NFlex vertical align="center" style="text-align: center">
        <NTag round type="success" :bordered="false">{{ landing.hero.social }}</NTag>
        <NH1 style="font-size: clamp(32px, 6vw, 56px); line-height: 1.1; margin: 16px 0 8px; max-width: 800px">{{ landing.hero.title }}</NH1>
        <NP style="font-size: 18px; max-width: 620px; opacity: 0.8">{{ landing.hero.subtitle }}</NP>
        <NFlex justify="center" style="margin-top: 8px"><NButton type="primary" size="large" tag="a" href="/apps/naive-ui/">{{ landing.hero.primary }}<template #icon><Icon name="arrow-right" /></template></NButton><NButton secondary size="large">{{ landing.hero.secondary }}</NButton></NFlex>
      </NFlex>
      <NCard style="margin-top: 48px" content-style="padding: 0">
        <div style="aspect-ratio: 16/7; display: grid; place-items: center; background: linear-gradient(135deg, rgba(24,160,88,.18), rgba(24,160,88,.02))"><NText depth="3">产品界面预览</NText></div>
      </NCard>
      <NFlex justify="center" :wrap="true" :size="[32, 12]" style="margin: 40px 0">
        <NText v-for="l in logos" :key="l" strong depth="3" style="font-size: 18px; letter-spacing: .04em">{{ l }}</NText>
      </NFlex>
      <NGrid cols="2 s:4" responsive="screen" :x-gap="16" :y-gap="16" style="margin-bottom: 72px">
        <NGi v-for="s in landing.numbers" :key="s.label"><NCard size="small" style="text-align: center"><NStatistic :label="s.label" :value="s.value" /></NCard></NGi>
      </NGrid>

      <NH2 style="text-align: center">一切所需，开箱即用</NH2>
      <NGrid cols="1 s:2 m:3" responsive="screen" :x-gap="16" :y-gap="16" style="margin-bottom: 72px">
        <NGi v-for="f in landing.features" :key="f.title">
          <NCard hoverable size="small" style="height: 100%">
            <NFlex vertical :size="8"><NIcon :size="24" color="#18a058"><Icon :name="(featureIcons as readonly string[]).includes(f.icon) ? (f.icon as IconName) : 'sparkles'" :size="24" /></NIcon><NText strong style="font-size: 16px">{{ f.title }}</NText><NText depth="3">{{ f.desc }}</NText></NFlex>
          </NCard>
        </NGi>
      </NGrid>

      <NH2 style="text-align: center">简单透明的价格</NH2>
      <NFlex justify="center" align="center" style="margin-bottom: 24px"><NText>月付</NText><NSwitch v-model:value="yearly" /><NText>年付</NText><NTag size="small" type="success" round :bordered="false">省 20%</NTag></NFlex>
      <NGrid cols="1 m:3" responsive="screen" :x-gap="16" :y-gap="16" style="margin-bottom: 72px">
        <NGi v-for="p in plans" :key="p.name">
          <NCard :title="p.name" size="small" :style="{ height: '100%', borderColor: p.recommended ? '#18a058' : undefined }">
            <template #header-extra><NTag v-if="p.recommended" type="success" size="small" round :bordered="false">推荐</NTag></template>
            <NH2 style="margin: 0 0 12px">{{ p.price === null ? "定制" : p.price === 0 ? "$0" : `$${yearly ? Math.round(p.price * 12 * 0.8) : p.price}` }}<NText depth="3" style="font-size: 14px; font-weight: 400">{{ p.price ? (yearly ? " / 年" : " / 月") : "" }}</NText></NH2>
            <NSpace vertical :size="6"><NFlex v-for="f in p.features" :key="f" align="center" :size="6" :wrap="false"><Icon name="check" :size="14" /><NText>{{ f }}</NText></NFlex></NSpace>
            <template #footer><NButton block :type="p.recommended ? 'primary' : 'default'" :secondary="!p.recommended">{{ p.price === null ? "联系销售" : "开始使用" }}</NButton></template>
          </NCard>
        </NGi>
      </NGrid>

      <NH2 style="text-align: center">用户怎么说</NH2>
      <NGrid cols="1 m:3" responsive="screen" :x-gap="16" :y-gap="16" style="margin-bottom: 72px">
        <NGi v-for="t in landing.testimonials" :key="t.name">
          <NCard size="small" style="height: 100%"><NP style="margin-top: 0">“{{ t.quote }}”</NP><NFlex align="center"><NAvatar round size="small">{{ t.name[0] }}</NAvatar><div><NText strong>{{ t.name }}</NText><br /><NText depth="3" style="font-size: 12px">{{ t.company }}</NText></div></NFlex></NCard>
        </NGi>
      </NGrid>

      <NH2 style="text-align: center">常见问题</NH2>
      <NCollapse style="max-width: 760px; margin: 0 auto 72px" accordion default-expanded-names="0">
        <NCollapseItem v-for="(q, i) in landing.faq" :key="q.q" :title="q.q" :name="String(i)"><NText depth="2">{{ q.a }}</NText></NCollapseItem>
      </NCollapse>

      <NCard :bordered="false" style="background: #18a058; text-align: center" content-style="padding: 48px 24px">
        <NH2 style="color: #fff; margin-top: 0">{{ landing.hero.title }}</NH2>
        <NP style="color: rgba(255,255,255,.85)">{{ landing.hero.social }}</NP>
        <NButton size="large" color="#fff" text-color="#18a058" tag="a" href="/apps/naive-ui/">{{ landing.hero.primary }}</NButton>
      </NCard>
    </div>
    <NLayoutFooter bordered style="padding: 24px 20px">
      <NFlex justify="space-between" align="center" :wrap="true" style="max-width: 1120px; margin: 0 auto">
        <NText depth="3" style="font-size: 13px">© 2026 Acme Console</NText>
        <NFlex :size="16"><NText v-for="n in navItems" :key="n" depth="3" style="font-size: 13px">{{ n }}</NText></NFlex>
      </NFlex>
    </NLayoutFooter>
  </NLayout>
</template>
