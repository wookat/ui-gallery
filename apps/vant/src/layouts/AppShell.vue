<script setup lang="ts">
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { showNotify } from "vant"
import AppIcon from "@/components/AppIcon.vue"
import { toggleTheme, urlSettings } from "@/url-settings"

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const drawer = ref(false)
const notificationsOpen = ref(false)
const profileOpen = ref(false)
const search = ref("")
const currentLabel = computed(() => nav.find((item) => item.path === route.path)?.label ?? "仪表盘")
const navigate = (path: string) => { drawer.value = false; void router.push(path) }
const doAction = (label: string) => { profileOpen.value = false; showNotify({ type: "primary", message: label }) }
</script>

<template>
  <div class="dashboard-shell">
    <aside class="dashboard-sidebar" :style="{ width: collapsed ? '72px' : '240px' }">
      <RouterLink class="brand" to="/">
        <span class="brand-mark"><AppIcon name="zap" :size="18" /></span>
        <span v-if="!collapsed">Acme Console</span>
      </RouterLink>
      <van-button class="desktop-only" plain block size="small" @click="collapsed = !collapsed">
        <AppIcon :name="collapsed ? 'chevron-right' : 'chevron-left'" />
        <span v-if="!collapsed">收起导航</span>
      </van-button>
      <nav class="side-nav">
        <RouterLink v-for="item in nav" :key="item.key" :to="item.path" :title="item.label">
          <AppIcon :name="item.icon" />
          <span v-if="!collapsed">{{ item.label }}</span>
          <van-badge v-if="!collapsed && item.badge" :content="item.badge" />
        </RouterLink>
      </nav>
      <van-cell v-if="!collapsed" class="shell-user" is-link @click="navigate('/settings')">
        <template #icon><span class="avatar-placeholder">林</span></template>
        <template #title>林晓</template>
        <template #label>admin@acme.dev</template>
      </van-cell>
    </aside>
    <section class="dashboard-main">
      <header class="shell-topbar">
        <van-button class="mobile-only" icon="bars" plain hairline @click="drawer = true"><AppIcon name="menu" /></van-button>
        <div class="inline muted">
          <RouterLink to="/">Acme Console</RouterLink>
          <AppIcon name="chevron-right" :size="14" />
          <span>{{ currentLabel }}</span>
        </div>
        <van-search v-model="search" class="desktop-search" shape="round" placeholder="搜索..." />
        <div class="top-actions">
          <van-popover v-model:show="notificationsOpen" placement="bottom-end">
            <div class="popover-list">
              <div v-for="item in notifications" :key="item.title" class="popover-item">
                <strong>{{ item.title }}</strong><small>{{ item.time }}</small>
              </div>
            </div>
            <template #reference><van-badge :content="notifications.filter((item) => item.unread).length"><van-button plain icon="bell"><AppIcon name="bell" /></van-button></van-badge></template>
          </van-popover>
          <van-button plain @click="toggleTheme"><AppIcon :name="urlSettings.theme === 'dark' ? 'sun' : 'moon'" /></van-button>
          <van-popover v-model:show="profileOpen" placement="bottom-end">
            <van-cell-group inset>
              <van-cell v-for="label in ['个人资料', '账户设置', '团队管理', '账单方案', '退出登录']" :key="label" :title="label" is-link @click="doAction(label)" />
            </van-cell-group>
            <template #reference><van-button class="avatar-button" plain round>林</van-button></template>
          </van-popover>
        </div>
      </header>
      <main class="shell-content"><RouterView /></main>
    </section>
    <van-popup v-model:show="drawer" position="left" :style="{ width: '78%', height: '100%' }">
      <div class="dashboard-sidebar" style="width: 100%">
        <RouterLink class="brand" to="/" @click="drawer = false"><span class="brand-mark"><AppIcon name="zap" /></span><span>Acme Console</span></RouterLink>
        <nav class="side-nav">
          <RouterLink v-for="item in nav" :key="item.key" :to="item.path" @click="drawer = false"><AppIcon :name="item.icon" /><span>{{ item.label }}</span></RouterLink>
        </nav>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
.desktop-search { max-width: 280px; flex: 1; }
.top-actions { display: flex; align-items: center; gap: 6px; margin-left: auto; }
.avatar-button { width: 34px; height: 34px; background: var(--van-primary-color); color: #fff; border: 0; }
.popover-list { width: 280px; padding: 8px; }
.popover-item { display: grid; gap: 3px; padding: 9px; border-bottom: 1px solid var(--van-border-color); }
.popover-item:last-child { border-bottom: 0; }
.popover-item small { color: var(--van-text-color-2); }
.side-nav :deep(.van-badge) { margin-left: auto; }
.avatar-placeholder { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: var(--van-primary-color); color: #fff; }
@media (max-width: 767px) { .desktop-search { display: none; } }
</style>
