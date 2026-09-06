<script setup lang="ts">
import { computed, ref } from "vue"
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { Icon } from "@/lib/icons"
import { theme, toggleTheme } from "@/lib/settings"

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const mobileOpen = ref(false)
const current = computed(() => nav.find((item) => item.path === route.path)?.label ?? "仪表盘")
const unread = notifications.filter((item) => item.unread).length
const groups = [
  { title: "工作区", keys: ["dashboard", "orders", "form", "chat"] },
  { title: "资源", keys: ["components", "landing", "settings", "login"] },
]

function go(key: string) {
  const target = nav.find((item) => item.key === key)
  if (target) router.push({ path: target.path, query: route.query })
  mobileOpen.value = false
}
</script>

<template>
  <a-layout class="shell">
    <a-layout-sider
      class="shell-sider hide-mobile"
      :collapsed="collapsed"
      collapsible
      hide-trigger
      :width="240"
      :collapsed-width="64"
      breakpoint="lg"
      @collapse="(value: boolean) => (collapsed = value)"
    >
      <div class="shell-brand">
        <a-avatar :size="32" shape="square" :style="{ backgroundColor: 'rgb(var(--primary-6))' }">A</a-avatar>
        <span v-if="!collapsed" class="shell-brand-text">Acme Console</span>
      </div>
      <a-menu :selected-keys="[nav.find((item) => item.path === route.path)?.key ?? 'dashboard']" :collapsed="collapsed" :default-open-keys="['g0', 'g1']" @menu-item-click="go">
        <a-sub-menu v-for="(group, index) in groups" :key="`g${index}`">
          <template #icon><Icon name="boxes" /></template>
          <template #title>{{ group.title }}</template>
          <a-menu-item v-for="key in group.keys" :key="key">
            <template #icon><Icon :name="nav.find((item) => item.key === key)?.icon ?? 'circle-help'" /></template>
            <span class="between">
              {{ nav.find((item) => item.key === key)?.label }}
              <a-badge v-if="nav.find((item) => item.key === key)?.badge" :count="nav.find((item) => item.key === key)?.badge" :offset="[0, 0]" :color="'rgb(var(--red-7))'" />
            </span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
      <div class="shell-sider-footer">
        <a-button type="text" size="small" @click="collapsed = !collapsed">
          <template #icon><Icon :name="collapsed ? 'chevron-right' : 'chevron-left'" /></template>
        </a-button>
        <RouterLink v-if="!collapsed" :to="{ path: '/settings', query: route.query }" class="shell-user">
          <a-avatar :size="28">林</a-avatar>
          <span class="stack" style="gap: 0">
            <span>林晓</span>
            <span class="muted small">owner · Acme</span>
          </span>
        </RouterLink>
      </div>
    </a-layout-sider>

    <a-drawer :visible="mobileOpen" placement="left" :width="280" :footer="false" title="Acme Console" unmount-on-close @cancel="mobileOpen = false">
      <a-menu :selected-keys="[nav.find((item) => item.path === route.path)?.key ?? 'dashboard']" :default-open-keys="['g0', 'g1']" @menu-item-click="go">
        <a-sub-menu v-for="(group, index) in groups" :key="`g${index}`">
          <template #title>{{ group.title }}</template>
          <a-menu-item v-for="key in group.keys" :key="key">
            <template #icon><Icon :name="nav.find((item) => item.key === key)?.icon ?? 'circle-help'" /></template>
            {{ nav.find((item) => item.key === key)?.label }}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-drawer>

    <a-layout class="shell-main">
      <a-layout-header class="shell-header">
        <a-button class="show-mobile" type="text" @click="mobileOpen = true">
          <template #icon><Icon name="menu" /></template>
        </a-button>
        <a-breadcrumb class="hide-mobile">
          <a-breadcrumb-item><RouterLink :to="{ path: '/', query: route.query }">Acme Console</RouterLink></a-breadcrumb-item>
          <a-breadcrumb-item>{{ current }}</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="shell-actions">
          <a-input-search class="hide-mobile shell-search" placeholder="全局搜索..." allow-clear />
          <a-popover trigger="click" position="br" title="通知">
            <a-badge :count="unread" dot>
              <a-button type="text" shape="circle">
                <template #icon><Icon name="bell" /></template>
              </a-button>
            </a-badge>
            <template #content>
              <a-list size="small" :bordered="false" style="width: 280px">
                <a-list-item v-for="item in notifications" :key="item.title">
                  <a-list-item-meta :title="item.title" :description="item.time">
                    <template #avatar><a-badge :count="item.unread ? 1 : 0" dot><a-avatar :size="24"><Icon name="bell" :size="12" /></a-avatar></a-badge></template>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </template>
          </a-popover>
          <a-tooltip content="切换主题">
            <a-button type="text" shape="circle" @click="toggleTheme()">
              <template #icon><Icon :name="theme === 'dark' ? 'sun' : 'moon'" /></template>
            </a-button>
          </a-tooltip>
          <a-dropdown position="br" @select="(value: unknown) => value === 'settings' && go('settings')">
            <a-avatar :size="32" style="cursor: pointer">林</a-avatar>
            <template #content>
              <a-doption value="profile"><template #icon><Icon name="user" /></template>个人资料</a-doption>
              <a-doption value="settings"><template #icon><Icon name="settings" /></template>账户设置</a-doption>
              <a-doption value="team"><template #icon><Icon name="users" /></template>切换团队</a-doption>
              <a-doption value="help"><template #icon><Icon name="circle-help" /></template>帮助中心</a-doption>
              <a-doption value="logout"><template #icon><Icon name="log-out" /></template>退出登录</a-doption>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="shell-content">
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.shell {
  min-height: 100vh;
}

.shell-sider {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: auto;
}

.shell-sider :deep(.arco-layout-sider-children) {
  display: flex;
  flex-direction: column;
}

.shell-sider :deep(.arco-menu) {
  flex: 1;
}

.shell-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  font-weight: 600;
}

.shell-brand-text {
  white-space: nowrap;
}

.shell-sider-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--color-border-2);
}

.shell-user {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  color: inherit;
  text-decoration: none;
  font-size: 13px;
}

.shell-header :deep(.arco-breadcrumb-item a) {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
}

.shell-main {
  min-width: 0;
}

.shell-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 60px;
  padding: 0 16px;
  background: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border-2);
}

.shell-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.shell-search {
  width: 220px;
}

.shell-content {
  padding: 24px;
  min-width: 0;
}

@media (max-width: 767px) {
  .shell-content {
    padding: 16px;
  }
}
</style>
