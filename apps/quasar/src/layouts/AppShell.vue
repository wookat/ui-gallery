<script setup lang="ts">
import { computed, ref } from "vue"
import { Dark, useQuasar } from "quasar"
import { useRoute, useRouter } from "vue-router"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import AppIcon from "../icons/AppIcon.vue"

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const drawer = ref(false)
const mini = ref(false)
const search = ref("")
const current = computed(() => nav.find((item) => item.path === route.path)?.label ?? "仪表盘")
const isDark = computed(() => Dark.isActive)

function toggleTheme() {
  const next = isDark.value ? "light" : "dark"
  Dark.set(next === "dark")
  const params = new URLSearchParams(window.location.search)
  params.set("theme", next)
  void router.replace({ path: route.path, query: Object.fromEntries(params.entries()) })
}

function navigate(path: string) {
  drawer.value = false
  void router.push(path)
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="drawer"
      :mini="mini && !$q.screen.lt.md"
      :breakpoint="1024"
      :overlay="$q.screen.lt.md"
      :show-if-above="!$q.screen.lt.md"
      bordered
    >
      <q-scroll-area class="fit">
        <div class="q-pa-md">
          <router-link to="/" class="row items-center q-gutter-sm text-weight-bold text-no-wrap" style="text-decoration: none; color: inherit">
            <q-avatar color="primary" text-color="white" size="32px">A</q-avatar>
            <span v-if="!mini || $q.screen.lt.md">Acme Console</span>
          </router-link>
        </div>
        <q-list padding>
          <q-item-label header v-if="!mini || $q.screen.lt.md">工作区</q-item-label>
          <q-item
            v-for="item in nav"
            :key="item.key"
            clickable
            :active="route.path === item.path"
            active-class="text-primary"
            @click="navigate(item.path)"
          >
            <q-item-section avatar><AppIcon :name="item.icon" /></q-item-section>
            <q-item-section v-if="!mini || $q.screen.lt.md">{{ item.label }}</q-item-section>
            <q-item-section side v-if="item.badge && (!mini || $q.screen.lt.md)"><q-badge>{{ item.badge }}</q-badge></q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-item clickable class="absolute-bottom q-ma-sm rounded-borders" @click="navigate('/settings')">
        <q-item-section avatar><q-avatar size="32px" color="primary" text-color="white">林</q-avatar></q-item-section>
        <q-item-section v-if="!mini || $q.screen.lt.md"><q-item-label>林晓</q-item-label><q-item-label caption>管理员</q-item-label></q-item-section>
      </q-item>
      <q-btn
        style="position: absolute; right: -12px; top: 72px; z-index: 1"
        round
        dense
        size="sm"
        color="primary"
        @click="mini = !mini"
      ><AppIcon :name="mini ? 'chevron-right' : 'chevron-left'" /></q-btn>
    </q-drawer>

    <q-header bordered>
      <q-toolbar>
        <q-btn v-if="$q.screen.lt.md" flat round dense aria-label="打开导航" @click="drawer = !drawer"><AppIcon name="menu" /></q-btn>
        <q-breadcrumbs class="gt-sm">
          <q-breadcrumbs-el to="/"><span>Acme Console</span></q-breadcrumbs-el>
          <q-breadcrumbs-el :label="current" />
        </q-breadcrumbs>
        <q-space />
        <q-input v-model="search" class="gt-xs" dense outlined debounce="250" placeholder="搜索..." style="width: 220px">
          <template #prepend><AppIcon name="search" :size="16" /></template>
        </q-input>
        <q-btn flat round dense aria-label="通知">
          <AppIcon name="bell" />
          <q-badge floating rounded color="negative">3</q-badge>
          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width: 280px">
              <q-item-label header>通知</q-item-label>
              <q-item v-for="item in notifications" :key="item.title" clickable>
                <q-item-section><q-item-label>{{ item.title }}</q-item-label><q-item-label caption>{{ item.time }}</q-item-label></q-item-section>
                <q-item-section side v-if="item.unread"><q-badge rounded color="primary" /></q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn flat round dense :aria-label="isDark ? '切换亮色' : '切换暗色'" @click="toggleTheme"><AppIcon :name="isDark ? 'sun' : 'moon'" /></q-btn>
        <q-btn flat round dense aria-label="账户"><q-avatar size="32px" color="primary" text-color="white">林</q-avatar>
          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width: 180px">
              <q-item-label header>林晓</q-item-label>
              <q-item clickable v-close-popup @click="navigate('/settings')"><q-item-section avatar><AppIcon name="user" /></q-item-section><q-item-section>个人资料</q-item-section></q-item>
              <q-item clickable v-close-popup @click="navigate('/settings')"><q-item-section avatar><AppIcon name="settings" /></q-item-section><q-item-section>账户设置</q-item-section></q-item>
              <q-item clickable v-close-popup><q-item-section avatar><AppIcon name="shield" /></q-item-section><q-item-section>安全中心</q-item-section></q-item>
              <q-separator />
              <q-item clickable v-close-popup><q-item-section avatar><AppIcon name="log-out" /></q-item-section><q-item-section>退出登录</q-item-section></q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container class="page-content">
      <q-page class="q-pa-md q-pa-lg-lg"><router-view /></q-page>
    </q-page-container>
  </q-layout>
</template>
