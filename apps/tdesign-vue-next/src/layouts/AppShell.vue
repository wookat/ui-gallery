<script setup lang="ts">
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import type { DropdownProps } from "tdesign-vue-next"
type DropdownOption = Parameters<NonNullable<DropdownProps["onClick"]>>[0]
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import Icon from "@/components/Icon.vue"
import { settings, toggleTheme } from "@/settings"

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const drawer = ref(false)
const active = computed(() => route.path)
const current = computed(() => nav.find((n) => n.path === route.path)?.label ?? "仪表盘")
const unread = notifications.filter((n) => n.unread).length
const groups = [
  { label: "工作区", keys: ["dashboard", "orders", "form", "chat"] },
  { label: "资源", keys: ["components", "landing"] },
  { label: "账户", keys: ["settings", "login"] },
]
const userMenu = [
  { content: "个人资料", value: "/settings" },
  { content: "账号安全", value: "/settings" },
  { content: "通知设置", value: "/settings" },
  { content: "帮助中心", value: "/landing" },
  { content: "退出登录", value: "/login", theme: "error" as const },
]
function onUserMenu(item: DropdownOption) {
  if (item && typeof item === "object") go(String(item.value))
}
function go(path: string) {
  router.push({ path, query: route.query })
  drawer.value = false
}
</script>

<template>
  <t-layout class="ug-shell">
    <t-aside class="ug-aside ug-hide-mobile" :width="collapsed ? '64px' : '232px'">
      <t-menu :value="active" theme="light" :collapsed="collapsed" @change="(v: unknown) => go(String(v))">
        <template #logo>
          <RouterLink class="ug-brand" :to="{ path: '/', query: route.query }">
            <span class="ug-logo">A</span><span v-if="!collapsed">Acme Console</span>
          </RouterLink>
        </template>
        <template v-for="g in groups" :key="g.label">
          <t-menu-group :title="collapsed ? '' : g.label">
            <t-menu-item v-for="item in nav.filter((n) => g.keys.includes(n.key))" :key="item.key" :value="item.path">
              <template #icon><Icon :name="item.icon" :size="18" /></template>
              <span class="ug-nav-label">{{ item.label }}<t-badge v-if="item.badge && !collapsed" :count="item.badge" size="small" class="ug-nav-badge" /></span>
            </t-menu-item>
          </t-menu-group>
        </template>
        <template #operations>
          <div class="ug-aside-footer">
            <t-button variant="text" shape="square" size="large" @click="collapsed = !collapsed"><Icon name="panel-left" :size="18" /></t-button>
            <div v-if="!collapsed" class="ug-user-card">
              <t-avatar size="small">林</t-avatar>
              <div><div class="ug-user-name">林晓</div><div class="ug-muted ug-user-mail">m0@acme.dev</div></div>
            </div>
          </div>
        </template>
      </t-menu>
    </t-aside>
    <t-layout class="ug-main">
      <t-header class="ug-header">
        <div class="ug-header-inner">
          <t-button class="ug-only-mobile" variant="text" shape="square" size="large" aria-label="菜单" @click="drawer = true"><Icon name="menu" :size="20" /></t-button>
          <t-breadcrumb class="ug-hide-mobile">
            <t-breadcrumb-item @click="go('/')">Acme Console</t-breadcrumb-item>
            <t-breadcrumb-item>{{ current }}</t-breadcrumb-item>
          </t-breadcrumb>
          <span class="ug-only-mobile ug-mobile-title">{{ current }}</span>
          <div class="ug-header-actions">
            <t-input class="ug-search ug-hide-mobile" placeholder="搜索订单、成员、文档…" clearable>
              <template #prefix-icon><Icon name="search" /></template>
              <template #suffix><t-tag size="small" variant="light">⌘K</t-tag></template>
            </t-input>
            <t-popup trigger="click" placement="bottom-right">
              <t-badge :count="unread" size="small" :offset="[4, 4]">
                <t-button variant="text" shape="square" size="large" aria-label="通知"><Icon name="bell" :size="18" /></t-button>
              </t-badge>
              <template #content>
                <t-list class="ug-notify" size="small">
                  <t-list-item v-for="n in notifications" :key="n.title">
                    <t-list-item-meta :title="n.title" :description="n.time" />
                    <template #action><t-badge v-if="n.unread" dot /></template>
                  </t-list-item>
                </t-list>
              </template>
            </t-popup>
            <t-tooltip content="切换主题"><t-button variant="text" shape="square" size="large" aria-label="切换主题" @click="toggleTheme"><Icon :name="settings.theme === 'dark' ? 'sun' : 'moon'" :size="18" /></t-button></t-tooltip>
            <t-dropdown :options="userMenu" @click="onUserMenu">
              <t-button variant="text" shape="circle" size="large" aria-label="账户"><t-avatar size="small">林</t-avatar></t-button>
            </t-dropdown>
          </div>
        </div>
      </t-header>
      <t-content class="ug-content"><RouterView /></t-content>
    </t-layout>
    <t-drawer v-model:visible="drawer" placement="left" size="280px" :footer="false" :close-btn="true">
      <template #header><span class="ug-brand"><span class="ug-logo">A</span>Acme Console</span></template>
      <t-menu :value="active" theme="light" @change="(v: unknown) => go(String(v))">
        <template v-for="g in groups" :key="g.label">
          <t-menu-group :title="g.label">
            <t-menu-item v-for="item in nav.filter((n) => g.keys.includes(n.key))" :key="item.key" :value="item.path">
              <template #icon><Icon :name="item.icon" :size="18" /></template>{{ item.label }}
            </t-menu-item>
          </t-menu-group>
        </template>
      </t-menu>
    </t-drawer>
  </t-layout>
</template>

<style>
.ug-shell { min-height: 100vh; }
.ug-aside { position: sticky; top: 0; height: 100vh; transition: width 0.2s; flex-shrink: 0; }
.ug-aside .t-default-menu { height: 100%; }
.ug-brand { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; color: var(--td-text-color-primary); }
.ug-nav-label { display: inline-flex; align-items: center; gap: 8px; }
.ug-nav-badge .t-badge--circle, .ug-nav-badge .t-badge--round { position: static; transform: none; }
.ug-aside-footer { display: flex; flex-direction: column; gap: 8px; padding: 8px 0; }
.ug-user-card { display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: var(--td-radius-medium); background: var(--td-bg-color-secondarycontainer); }
.ug-user-name { font-weight: 500; font-size: 13px; }
.ug-user-mail { font-size: 12px; }
.ug-main { min-width: 0; }
.ug-header { position: sticky; top: 0; z-index: 10; height: 56px; border-bottom: 1px solid var(--td-component-stroke); background: var(--td-bg-color-container); }
.ug-header-inner { display: flex; align-items: center; gap: 12px; height: 56px; padding: 0 16px; }
.ug-header-actions { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.ug-search { width: 260px; }
.ug-notify { width: 300px; }
.ug-mobile-title { font-weight: 600; }
.ug-content { padding: 24px; min-width: 0; }
@media (max-width: 767px) { .ug-content { padding: 16px 12px; } }
</style>
