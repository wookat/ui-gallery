<script setup lang="ts">
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useDisplay, useTheme } from "vuetify"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import Icon from "@/components/Icon.vue"
import type { IconName } from "@/icons"

const route = useRoute()
const router = useRouter()
const theme = useTheme()
const { mdAndUp } = useDisplay()

const drawer = ref(mdAndUp.value)
const rail = ref(false)
const isDark = computed(() => theme.global.current.value.dark)
const current = computed(() => nav.find((item) => item.path === route.path)?.label ?? "仪表盘")
const unread = computed(() => notifications.filter((n) => n.unread).length)
const workspaceNav = computed(() => nav.filter((item) => ["dashboard", "orders", "form", "chat"].includes(item.key)))
const moreNav = computed(() => nav.filter((item) => !["dashboard", "orders", "form", "chat"].includes(item.key)))

function toggleTheme() {
  const next = isDark.value ? "light" : "dark"
  theme.global.name.value = next
  router.replace({ path: route.path, query: { ...route.query, theme: next } })
}
function toggleNav() {
  if (mdAndUp.value) rail.value = !rail.value
  else drawer.value = !drawer.value
}
</script>

<template>
  <v-navigation-drawer v-model="drawer" :rail="rail && mdAndUp" :permanent="mdAndUp" :temporary="!mdAndUp" width="256">
    <v-list nav density="default">
      <v-list-item :to="{ path: '/', query: route.query }" title="Acme Console" subtitle="Vuetify">
        <template #prepend><v-avatar color="primary" size="32" rounded="lg">A</v-avatar></template>
      </v-list-item>
    </v-list>
    <v-divider />
    <v-list nav density="compact">
      <v-list-subheader v-if="!(rail && mdAndUp)">工作区</v-list-subheader>
      <v-list-item v-for="item in workspaceNav" :key="item.key" :to="{ path: item.path, query: route.query }" :title="item.label" :active="route.path === item.path" color="primary" rounded="lg" density="comfortable">
        <template #prepend><Icon :name="item.icon as IconName" size="20" /></template>
        <template v-if="item.badge" #append><v-badge :content="item.badge" color="primary" inline /></template>
      </v-list-item>
      <v-divider class="my-2" />
      <v-list-subheader v-if="!(rail && mdAndUp)">更多</v-list-subheader>
      <v-list-item v-for="item in moreNav" :key="item.key" :to="{ path: item.path, query: route.query }" :title="item.label" :active="route.path === item.path" color="primary" rounded="lg" density="comfortable">
        <template #prepend><Icon :name="item.icon as IconName" size="20" /></template>
        <template v-if="item.badge" #append><v-badge :content="item.badge" color="primary" inline /></template>
      </v-list-item>
    </v-list>
    <template #append>
      <v-divider />
      <v-list nav density="default">
        <v-list-item :to="{ path: '/settings', query: route.query }" title="林晓" subtitle="owner@acme.dev">
          <template #prepend><v-avatar color="secondary" size="28">林</v-avatar></template>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>

  <v-app-bar flat border="b" density="comfortable">
    <v-app-bar-nav-icon aria-label="切换导航" @click="toggleNav" />
    <v-breadcrumbs class="d-none d-sm-flex pl-0" :items="[{ title: 'Acme Console', to: { path: '/', query: route.query } }, { title: current }]" />
    <v-spacer />
    <v-text-field class="d-none d-md-flex mr-2" style="max-width: 240px" density="compact" variant="outlined" hide-details placeholder="搜索..." aria-label="全局搜索">
      <template #prepend-inner><Icon name="search" size="18" /></template>
    </v-text-field>
    <v-menu :close-on-content-click="false" location="bottom end" width="320">
      <template #activator="{ props }">
        <v-btn v-bind="props" icon aria-label="通知">
          <v-badge :content="unread" color="error" :model-value="unread > 0"><Icon name="bell" /></v-badge>
        </v-btn>
      </template>
      <v-card title="通知" subtitle="最近的更新">
        <v-list lines="two" density="compact">
          <v-list-item v-for="n in notifications" :key="n.title" :title="n.title" :subtitle="n.time">
            <template #prepend><v-badge dot :color="n.unread ? 'primary' : 'grey'" inline /></template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
    <v-tooltip text="切换主题" location="bottom">
      <template #activator="{ props }">
        <v-btn v-bind="props" icon aria-label="切换主题" @click="toggleTheme"><Icon :name="isDark ? 'sun' : 'moon'" /></v-btn>
      </template>
    </v-tooltip>
    <v-menu location="bottom end">
      <template #activator="{ props }">
        <v-btn v-bind="props" icon aria-label="账户菜单"><v-avatar color="secondary" size="32">林</v-avatar></v-btn>
      </template>
      <v-list density="compact" min-width="200">
        <v-list-item title="林晓" subtitle="owner@acme.dev" />
        <v-divider />
        <v-list-item :to="{ path: '/settings', query: route.query }" title="账户设置"><template #prepend><Icon name="settings" size="18" /></template></v-list-item>
        <v-list-item title="团队"><template #prepend><Icon name="users" size="18" /></template></v-list-item>
        <v-list-item title="帮助中心"><template #prepend><Icon name="circle-help" size="18" /></template></v-list-item>
        <v-list-item title="快捷键"><template #prepend><Icon name="terminal" size="18" /></template></v-list-item>
        <v-divider />
        <v-list-item :to="{ path: '/login', query: route.query }" title="退出登录"><template #prepend><Icon name="log-out" size="18" /></template></v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-main>
    <v-container fluid class="pa-4 pa-sm-6" style="min-width: 0">
      <router-view />
    </v-container>
  </v-main>
</template>
