<script setup lang="ts">
import { computed, ref } from "vue"
import { theme } from "ant-design-vue"
import { RouterLink, useRoute } from "vue-router"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { Icon } from "../icons"

defineProps<{ dark: boolean }>()
const emit = defineEmits<{ "toggle-theme": [] }>()
const route = useRoute()
const collapsed = ref(false)
const mobileOpen = ref(false)
const { token } = theme.useToken()
const headerStyle = computed(() => ({
  background: token.value.colorBgContainer,
  borderBottom: `1px solid ${token.value.colorBorderSecondary}`,
}))
const current = computed(() => nav.find((item) => item.path === route.path)?.label ?? "仪表盘")
const selected = computed(() => [nav.find((item) => item.path === route.path)?.key ?? "dashboard"])
function navigate() { mobileOpen.value = false }
</script>

<template>
  <a-layout class="app-layout">
    <a-layout-sider v-model:collapsed="collapsed" collapsible :trigger="null" breakpoint="md" collapsed-width="0" class="desktop-sider">
      <RouterLink class="brand" to="/"><span class="brand-mark">A</span><span v-if="!collapsed">Acme Console</span></RouterLink>
      <a-menu mode="inline" :selected-keys="selected" theme="dark">
        <a-menu-item v-for="item in nav" :key="item.key"><RouterLink :to="item.path" class="nav-link"><Icon :name="item.icon" /><span>{{ item.label }}</span><a-badge v-if="item.badge" :count="item.badge" /></RouterLink></a-menu-item>
      </a-menu>
      <div class="sider-user"><a-avatar>林</a-avatar><span v-if="!collapsed">林晓<br><small>管理员</small></span></div>
    </a-layout-sider>
    <a-drawer v-model:open="mobileOpen" placement="left" :width="280" title="Acme Console">
      <a-menu mode="inline" :selected-keys="selected" @click="navigate">
        <a-menu-item v-for="item in nav" :key="item.key"><RouterLink :to="item.path" class="nav-link"><Icon :name="item.icon" /><span>{{ item.label }}</span></RouterLink></a-menu-item>
      </a-menu>
      <template #footer><div class="drawer-user"><a-avatar>林</a-avatar><span>林晓<br><small class="muted">管理员</small></span></div></template>
    </a-drawer>
    <a-layout>
      <a-layout-header class="app-header" :style="headerStyle">
        <a-button class="mobile-menu" type="text" @click="mobileOpen = true"><Icon name="menu" :size="20" /></a-button>
        <a-breadcrumb class="header-crumb"><a-breadcrumb-item class="crumb-root"><RouterLink to="/">Acme Console</RouterLink></a-breadcrumb-item><a-breadcrumb-item>{{ current }}</a-breadcrumb-item></a-breadcrumb>
        <div class="header-actions">
          <a-input-search class="global-search" placeholder="搜索..." />
          <a-popover title="通知" trigger="click">
            <template #content><a-list size="small" :data-source="notifications"><template #renderItem="{ item }"><a-list-item><a-badge v-if="item.unread" status="processing" /><span>{{ item.title }}<small class="muted">{{ item.time }}</small></span></a-list-item></template></a-list></template>
            <a-badge :count="notifications.filter((item) => item.unread).length"><a-button type="text" shape="circle"><Icon name="bell" /></a-button></a-badge>
          </a-popover>
          <a-button type="text" shape="circle" @click="emit('toggle-theme')"><Icon :name="dark ? 'sun' : 'moon'" /></a-button>
          <a-dropdown>
            <a-button type="text" class="user-trigger"><a-space size="small"><a-avatar size="small">林</a-avatar><span>林晓</span></a-space></a-button>
            <template #overlay><a-menu><a-menu-item key="profile">个人资料</a-menu-item><a-menu-item key="settings"><RouterLink to="/settings">账户设置</RouterLink></a-menu-item><a-menu-item key="billing">计费信息</a-menu-item><a-menu-divider /><a-menu-item key="logout">退出登录</a-menu-item></a-menu></template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="app-content"><slot /></a-layout-content>
    </a-layout>
  </a-layout>
</template>
