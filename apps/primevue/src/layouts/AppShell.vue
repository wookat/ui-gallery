<script setup lang="ts">
import { computed, ref } from "vue"
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router"
import Button from "primevue/button"
import Avatar from "primevue/avatar"
import Badge from "primevue/badge"
import OverlayBadge from "primevue/overlaybadge"
import Breadcrumb from "primevue/breadcrumb"
import Drawer from "primevue/drawer"
import IconField from "primevue/iconfield"
import InputIcon from "primevue/inputicon"
import InputText from "primevue/inputtext"
import Menu from "primevue/menu"
import Popover from "primevue/popover"
import Divider from "primevue/divider"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import AppIcon from "@/icons/AppIcon.vue"
import type { IconName } from "@/icons/names"
import { toggleTheme } from "@/settings"

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const mobileOpen = ref(false)
const dark = ref(document.documentElement.classList.contains("dark"))
const current = computed(() => nav.find((item) => item.path === route.path)?.label ?? "仪表盘")
const crumbs = computed(() => [{ label: current.value }])
const home = { label: "Acme Console", route: "/" }
const unread = notifications.filter((n) => n.unread).length

const userMenu = ref<InstanceType<typeof Menu> | null>(null)
const userItems = [
  { label: "个人资料", icon: "user", command: () => router.push("/settings") },
  { label: "账户设置", icon: "settings", command: () => router.push("/settings") },
  { label: "计费", icon: "credit-card", command: () => router.push("/settings") },
  { separator: true },
  { label: "退出登录", icon: "log-out", command: () => router.push("/login") },
]
const bell = ref<InstanceType<typeof Popover> | null>(null)

function onToggleTheme() {
  toggleTheme()
  dark.value = document.documentElement.classList.contains("dark")
}
</script>

<template>
  <div class="shell" :class="{ 'shell--collapsed': collapsed }">
    <aside class="shell__sidebar desktop-only">
      <RouterLink to="/" class="shell__brand">
        <span class="shell__logo">A</span>
        <span v-if="!collapsed" class="font-semibold">Acme Console</span>
      </RouterLink>
      <nav class="shell__nav">
        <div v-if="!collapsed" class="shell__group">工作区</div>
        <RouterLink
          v-for="item in nav"
          :key="item.key"
          :to="item.path"
          class="shell__link"
          :class="{ 'shell__link--active': route.path === item.path }"
          v-tooltip.right="collapsed ? item.label : undefined"
        >
          <AppIcon :name="item.icon as IconName" :size="18" />
          <span v-if="!collapsed" class="flex-1 truncate">{{ item.label }}</span>
          <Badge v-if="!collapsed && item.badge" :value="item.badge" severity="secondary" size="small" />
        </RouterLink>
      </nav>
      <div class="shell__footer">
        <Button
          text
          severity="secondary"
          :aria-label="collapsed ? '展开侧边栏' : '折叠侧边栏'"
          @click="collapsed = !collapsed"
        >
          <template #icon><AppIcon :name="collapsed ? 'chevrons-right' : 'chevrons-left'" /></template>
        </Button>
        <RouterLink to="/settings" class="shell__user">
          <Avatar label="林" shape="circle" />
          <div v-if="!collapsed" class="min-w-0">
            <div class="text-sm font-medium truncate">林晓</div>
            <div class="text-xs muted truncate">m0@acme.dev</div>
          </div>
        </RouterLink>
      </div>
    </aside>

    <Drawer v-model:visible="mobileOpen" header="导航菜单" class="shell__drawer" style="width: 288px">
      <template #header>
        <RouterLink to="/" class="shell__brand" @click="mobileOpen = false">
          <span class="shell__logo">A</span><span class="font-semibold">Acme Console</span>
        </RouterLink>
      </template>
      <nav class="shell__nav">
        <RouterLink
          v-for="item in nav"
          :key="item.key"
          :to="item.path"
          class="shell__link"
          :class="{ 'shell__link--active': route.path === item.path }"
          @click="mobileOpen = false"
        >
          <AppIcon :name="item.icon as IconName" :size="18" />
          <span class="flex-1">{{ item.label }}</span>
          <Badge v-if="item.badge" :value="item.badge" severity="secondary" size="small" />
        </RouterLink>
      </nav>
    </Drawer>

    <div class="shell__main">
      <header class="shell__topbar">
        <Button text severity="secondary" class="mobile-only" aria-label="打开菜单" @click="mobileOpen = true"><template #icon><AppIcon name="menu" :size="18" /></template></Button>
        <Breadcrumb :home="home" :model="crumbs" class="shell__crumbs desktop-only">
          <template #item="{ item, props }">
            <RouterLink v-if="item.route" :to="item.route" v-bind="props.action">{{ item.label }}</RouterLink>
            <span v-else class="font-medium">{{ item.label }}</span>
          </template>
        </Breadcrumb>
        <div class="flex items-center gap-2" style="margin-left: auto">
          <IconField class="desktop-only">
            <InputIcon><AppIcon name="search" /></InputIcon>
            <InputText placeholder="搜索..." size="small" style="width: 220px" />
          </IconField>
          <OverlayBadge :value="unread" severity="danger" size="small">
            <Button text severity="secondary" rounded aria-label="通知" @click="bell?.toggle($event)"><template #icon><AppIcon name="bell" :size="18" /></template></Button>
          </OverlayBadge>
          <Popover ref="bell">
            <div style="width: 300px">
              <div class="flex items-center justify-between mb-2">
                <span class="font-semibold">通知</span><span class="text-xs muted">{{ unread }} 条未读</span>
              </div>
              <template v-for="(n, i) in notifications" :key="n.title">
                <Divider v-if="i" class="p-0" style="margin: 8px 0" />
                <div class="flex items-start gap-2">
                  <span class="shell__dot" :class="{ 'shell__dot--unread': n.unread }" />
                  <div class="min-w-0"><div class="text-sm">{{ n.title }}</div><div class="text-xs muted">{{ n.time }}</div></div>
                </div>
              </template>
            </div>
          </Popover>
          <Button text severity="secondary" rounded aria-label="切换主题" v-tooltip.bottom="'切换主题'" @click="onToggleTheme"><template #icon><AppIcon :name="dark ? 'sun' : 'moon'" :size="18" /></template></Button>
          <Button text rounded severity="secondary" class="p-0" aria-label="用户菜单" aria-haspopup="true" @click="userMenu?.toggle($event)">
            <Avatar label="林" shape="circle" />
          </Button>
          <Menu ref="userMenu" :model="userItems" popup><template #itemicon="{ item, class: iconClass }"><AppIcon :name="item.icon as IconName" :class="iconClass" /></template></Menu>
        </div>
      </header>
      <main class="shell__content"><RouterView /></main>
    </div>
  </div>
</template>

<style>
.shell { display: flex; min-height: 100vh; }
.shell__sidebar {
  position: sticky; top: 0; height: 100vh; width: var(--shell-sidebar); flex: none;
  display: flex; flex-direction: column; border-right: 1px solid var(--p-content-border-color);
  background: var(--p-content-background); transition: width .2s;
}
.shell--collapsed .shell__sidebar { width: var(--shell-sidebar-collapsed); }
.shell__brand { display: flex; align-items: center; gap: 10px; padding: 16px; color: inherit; text-decoration: none !important; }
.shell__logo { display: grid; place-items: center; width: 32px; height: 32px; flex: none; border-radius: 8px; background: var(--p-primary-color); color: var(--p-primary-contrast-color); font-weight: 700; }
.shell__nav { display: flex; flex-direction: column; gap: 2px; padding: 8px; flex: 1; overflow-y: auto; }
.shell__group { font-size: 11px; color: var(--p-text-muted-color); padding: 8px 12px 4px; text-transform: uppercase; letter-spacing: .04em; }
.shell__link { display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 8px 12px; border-radius: var(--p-content-border-radius); color: var(--p-text-color); text-decoration: none !important; }
.shell--collapsed .shell__link { justify-content: center; padding: 10px 0; }
.shell__link:hover { background: var(--p-content-hover-background); }
.shell__link--active { background: var(--p-highlight-background); color: var(--p-highlight-color); font-weight: 500; }
.shell__footer { border-top: 1px solid var(--p-content-border-color); padding: 8px; display: flex; flex-direction: column; gap: 4px; }
.shell__user { display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 8px; border-radius: var(--p-content-border-radius); color: inherit; text-decoration: none !important; }
.shell--collapsed .shell__user { justify-content: center; }
.shell__user:hover { background: var(--p-content-hover-background); }
.shell__main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.shell__topbar {
  position: sticky; top: 0; z-index: 10; display: flex; align-items: center; gap: 8px; height: 64px; padding: 0 24px;
  border-bottom: 1px solid var(--p-content-border-color); background: color-mix(in srgb, var(--p-content-background) 92%, transparent); backdrop-filter: blur(8px);
}
.shell__crumbs.p-breadcrumb { background: transparent; border: 0; padding: 0; }
.shell__content { padding: 24px; min-width: 0; }
.shell__dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; flex: none; background: var(--p-surface-300); }
.shell__dot--unread { background: var(--p-primary-color); }
@media (max-width: 767px) {
  .shell__topbar { padding: 0 12px; height: 56px; }
  .shell__content { padding: 16px; }
}
</style>
