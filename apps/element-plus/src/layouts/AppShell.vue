<script setup lang="ts">
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import Icon from "@/icons/Icon.vue"
import { useMobile } from "@/composables/useMobile"
import { setTheme } from "@/lib/url-settings"

const route = useRoute()
const router = useRouter()
const mobile = useMobile()
const drawer = ref(false)
const collapsed = ref(false)
const dark = ref(document.documentElement.classList.contains("dark"))
const current = computed(() => nav.find((item) => item.path === route.path)?.label ?? "仪表盘")
const navigate = (path: string) => {
  router.push(path)
  drawer.value = false
}
const toggleTheme = () => {
  dark.value = !dark.value
  setTheme(dark.value ? "dark" : "light")
  const params = new URLSearchParams(window.location.search)
  params.set("theme", dark.value ? "dark" : "light")
  router.replace({ path: route.path, query: Object.fromEntries(params.entries()) })
}
</script>

<template>
  <el-container class="shell">
    <el-aside v-if="!mobile" :width="collapsed ? '64px' : '240px'" class="sidebar">
      <div class="brand" @click="navigate('/')"><span class="brand-mark">A</span><span v-if="!collapsed">Acme Console</span></div>
      <el-menu :default-active="route.path" :collapse="collapsed" router>
        <el-menu-item v-for="item in nav" :key="item.key" :index="item.path">
          <Icon :name="item.icon" /><template #title>{{ item.label }}<el-badge v-if="item.badge" :value="item.badge" /></template>
        </el-menu-item>
      </el-menu>
      <div class="sidebar-user" @click="navigate('/settings')">
        <el-avatar size="small">林</el-avatar><span v-if="!collapsed">林晓</span>
      </div>
      <el-button class="collapse-button" text @click="collapsed = !collapsed"><Icon :name="collapsed ? 'arrow-right' : 'arrow-left'" /></el-button>
    </el-aside>
    <el-drawer v-else v-model="drawer" direction="ltr" size="270px" :with-header="false">
      <div class="brand"><span class="brand-mark">A</span><span>Acme Console</span></div>
      <el-menu :default-active="route.path" router @select="drawer = false">
        <el-menu-item v-for="item in nav" :key="item.key" :index="item.path"><Icon :name="item.icon" /><template #title>{{ item.label }}</template></el-menu-item>
      </el-menu>
    </el-drawer>
    <el-container>
      <el-header class="topbar">
        <el-button v-if="mobile" text class="icon-btn" aria-label="菜单" @click="drawer = true"><Icon name="menu" :size="20" /></el-button>
        <el-breadcrumb><el-breadcrumb-item v-if="!mobile"><router-link to="/">Acme Console</router-link></el-breadcrumb-item><el-breadcrumb-item>{{ current }}</el-breadcrumb-item></el-breadcrumb>
        <el-input class="global-search" placeholder="搜索..." :prefix-icon="undefined"><template #prefix><Icon name="search" /></template></el-input>
        <el-popover placement="bottom-end" width="300" trigger="click">
          <template #reference><el-badge :value="notifications.filter((n) => n.unread).length"><el-button text class="icon-btn" aria-label="通知"><Icon name="bell" :size="20" /></el-button></el-badge></template>
          <div v-for="note in notifications" :key="note.title" class="notification">
            <b>{{ note.title }}</b><span class="muted">{{ note.time }}</span>
          </div>
        </el-popover>
        <el-button text class="icon-btn" aria-label="切换主题" @click="toggleTheme"><Icon :name="dark ? 'sun' : 'moon'" :size="20" /></el-button>
        <el-dropdown>
          <span class="avatar-trigger" tabindex="0" role="button" aria-label="账户菜单"><el-avatar size="small">林</el-avatar></span>
          <template #dropdown><el-dropdown-menu><el-dropdown-item>个人资料</el-dropdown-item><el-dropdown-item>偏好设置</el-dropdown-item><el-dropdown-item divided>帮助中心</el-dropdown-item><el-dropdown-item>快捷键</el-dropdown-item><el-dropdown-item>退出登录</el-dropdown-item></el-dropdown-menu></template>
        </el-dropdown>
      </el-header>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.shell {
  min-height: 100vh;
}
.sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  transition: width 0.2s;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 64px;
  padding: 0 18px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}
.brand-mark {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 8px;
  background: var(--el-color-primary);
  color: #fff;
}
.sidebar :deep(.el-menu) {
  border-right: 0;
  flex: 1;
}
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px;
  border-top: 1px solid var(--el-border-color);
  cursor: pointer;
}
.collapse-button {
  position: absolute;
  right: 8px;
  bottom: 80px;
}
.topbar {
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
}
.global-search {
  width: 240px;
  margin-left: auto;
}
.avatar-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 50%;
}
.notification {
  display: grid;
  gap: 4px;
  padding: 10px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
@media (max-width: 767px) {
  .topbar {
    padding: 0 14px;
  }
  .global-search {
    display: none;
  }
  .topbar :deep(.el-breadcrumb) {
    flex: 1;
    white-space: nowrap;
  }
}
</style>
