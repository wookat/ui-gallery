<script setup lang="ts">
import { computed, h, ref } from "vue"
import { RouterLink, useRoute, useRouter } from "vue-router"
import { NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NMenu, NButton, NBreadcrumb, NBreadcrumbItem, NInput, NBadge, NPopover, NList, NListItem, NThing, NDropdown, NAvatar, NDrawer, NDrawerContent, NFlex, NText, NTooltip, NDivider, useThemeVars, type MenuOption, type DropdownOption } from "naive-ui"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { Icon, renderIcon } from "../icons"
import { isDark, toggleTheme } from "../settings"
import { useIsMobile } from "../composables"

const route = useRoute()
const router = useRouter()
const isMobile = useIsMobile()
const collapsed = ref(false)
const drawer = ref(false)
const search = ref("")
const themeVars = useThemeVars()

const menuOptions = computed<MenuOption[]>(() => [
  {
    type: "group",
    label: "工作区",
    key: "workspace",
    children: nav.map((item) => ({
      key: item.path,
      icon: renderIcon(item.icon),
      label: () => h(RouterLink, { to: item.path, onClick: () => { drawer.value = false } }, { default: () => item.label }),
      extra: item.badge ? () => h(NBadge, { value: item.badge, type: "info" }) : undefined,
    })),
  },
])
const current = computed(() => nav.find((item) => item.path === route.path)?.label ?? "仪表盘")
const unread = computed(() => notifications.filter((item) => item.unread).length)
const userMenu: DropdownOption[] = [
  { key: "profile", label: "个人资料", icon: renderIcon("user") },
  { key: "settings", label: "账户设置", icon: renderIcon("settings") },
  { key: "billing", label: "计费", icon: renderIcon("credit-card") },
  { key: "help", label: "帮助中心", icon: renderIcon("circle-help") },
  { type: "divider", key: "d1" },
  { key: "logout", label: "退出登录", icon: renderIcon("log-out") },
]
function onUserMenu(key: string) {
  if (key === "logout") router.push("/login")
  else if (key !== "help") router.push("/settings")
}
</script>

<template>
  <NLayout has-sider style="min-height: 100vh">
    <NLayoutSider v-if="!isMobile" bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed" :native-scrollbar="false" content-style="display:flex;flex-direction:column;height:100%">
        <div style="padding: 16px 20px; display: flex; align-items: center; gap: 10px">
        <NAvatar :size="28" :color="themeVars.primaryColor" style="flex-shrink: 0">A</NAvatar>
        <NText v-if="!collapsed" strong style="white-space: nowrap">Acme Console</NText>
      </div>
      <NMenu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="20" :options="menuOptions" :value="route.path" style="flex: 1" />
      <NDivider style="margin: 0" />
      <NButton quaternary circle size="large" :aria-label="collapsed ? '展开侧栏' : '折叠侧栏'" style="align-self: center; margin: 8px" @click="collapsed = !collapsed">
        <template #icon><Icon :name="collapsed ? 'chevron-right' : 'panel-left'" /></template>
      </NButton>
      <RouterLink to="/settings" style="text-decoration: none">
        <NFlex align="center" :wrap="false" style="padding: 12px 16px">
          <NAvatar round :size="32">林</NAvatar>
          <div v-if="!collapsed" style="min-width: 0">
            <NText strong style="display: block">林晓</NText>
            <NText depth="3" style="font-size: 12px">owner · acme.dev</NText>
          </div>
        </NFlex>
      </RouterLink>
    </NLayoutSider>
    <NLayout :native-scrollbar="false" content-style="min-height:100vh;display:flex;flex-direction:column">
      <NLayoutHeader bordered position="static" style="height: 64px; display: flex; align-items: center; gap: 12px; padding: 0 16px">
        <NButton v-if="isMobile" quaternary circle size="large" aria-label="打开导航" @click="drawer = true"><template #icon><Icon name="menu" /></template></NButton>
        <NBreadcrumb v-if="!isMobile">
          <NBreadcrumbItem><RouterLink to="/">Acme Console</RouterLink></NBreadcrumbItem>
          <NBreadcrumbItem>{{ current }}</NBreadcrumbItem>
        </NBreadcrumb>
        <NText v-else strong>{{ current }}</NText>
        <NFlex align="center" :wrap="false" style="margin-left: auto" :size="8">
          <NInput v-if="!isMobile" v-model:value="search" placeholder="全局搜索..." clearable style="width: 220px"><template #prefix><Icon name="search" :size="15" /></template></NInput>
          <NPopover trigger="click" placement="bottom-end" style="padding: 0; width: 300px">
            <template #trigger>
              <NBadge :value="unread" :offset="[-4, 4]">
                <NButton quaternary circle size="large" aria-label="通知"><template #icon><Icon name="bell" /></template></NButton>
              </NBadge>
            </template>
            <NList hoverable clickable>
              <NListItem v-for="item in notifications" :key="item.title">
                <NThing :title="item.title" :description="item.time"><template #header-extra><NBadge v-if="item.unread" dot type="info" /></template></NThing>
              </NListItem>
            </NList>
          </NPopover>
          <NTooltip><template #trigger><NButton quaternary circle size="large" aria-label="切换主题" @click="toggleTheme"><template #icon><Icon :name="isDark ? 'sun' : 'moon'" /></template></NButton></template>切换主题</NTooltip>
          <NDropdown :options="userMenu" trigger="click" placement="bottom-end" @select="onUserMenu">
            <NButton quaternary circle size="large" aria-label="用户菜单" style="padding: 0"><NAvatar round :size="32">林</NAvatar></NButton>
          </NDropdown>
        </NFlex>
      </NLayoutHeader>
      <NLayoutContent :content-style="isMobile ? 'padding: 16px 16px 32px' : 'padding: 24px 24px 40px'">
        <slot />
      </NLayoutContent>
    </NLayout>
  </NLayout>
  <NDrawer v-model:show="drawer" placement="left" :width="280">
    <NDrawerContent title="Acme Console" closable body-content-style="padding: 8px 0">
      <NMenu :options="menuOptions" :value="route.path" />
      <NDivider />
      <NFlex align="center" style="padding: 0 20px"><NAvatar round :size="32">林</NAvatar><NText strong>林晓</NText></NFlex>
    </NDrawerContent>
  </NDrawer>
</template>
