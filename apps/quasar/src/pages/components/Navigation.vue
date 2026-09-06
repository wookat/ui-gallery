<script setup lang="ts">
import { ref } from "vue"
import nav from "@ui-gallery/spec/mock/nav.json"
import landing from "@ui-gallery/spec/mock/landing.json"
import AppIcon from "../../icons/AppIcon.vue"
import DemoBlock from "./DemoBlock.vue"

const names = ["QListMenu", "QMenuDropdown", "QBar", "QToolbar", "QBreadcrumbs", "QTabs", "QTabPanels", "QPagination", "QPageScroller", "QPageSticky", "QExpansionItem", "Anchor", "CommandPalette"]
const tab = ref("one")
const page = ref(2)
const command = ref(false)
const commandSearch = ref("")
const drawer = ref(false)
const expanded = ref(true)
const aliases: Record<string, string[]> = {
  QListMenu: ["Menu"],
  QToolbar: ["Navbar", "QToolbarTitle"],
  QBreadcrumbs: ["Breadcrumb", "QBreadcrumbsEl"],
  QTabs: ["Tabs", "QTab"],
  QTabPanels: ["QTabPanel"],
  QPagination: ["Pagination"],
  QPageScroller: ["BackTop"],
  QPageSticky: ["Affix"],
  QExpansionItem: ["Accordion"],
}
const titles: Record<string, string> = {
  QToolbar: "QToolbar / QToolbarTitle",
  QBreadcrumbs: "QBreadcrumbs / QBreadcrumbsEl",
  QTabs: "QTabs / QTab",
  QTabPanels: "QTabPanels / QTabPanel",
}
</script>

<template>
  <DemoBlock v-for="name in names" :id="name" :ids="aliases[name]" :key="name" :title="titles[name] ?? name">
    <template v-if="name === 'QListMenu'">
      <div class="row q-gutter-lg">
        <q-list class="col-12 col-sm-5" bordered><q-item v-for="item in nav.slice(0, 4)" :key="item.key" clickable :to="item.path"><q-item-section avatar><AppIcon :name="item.icon" /></q-item-section><q-item-section>{{ item.label }}</q-item-section></q-item></q-list>
        <q-list class="col-12 col-sm-5" dense padding><q-item-label header>嵌套菜单</q-item-label><q-expansion-item label="工作区" icon="folder"><q-item clickable :inset-level="1"><q-item-section>项目</q-item-section></q-item><q-item clickable :inset-level="1"><q-item-section>成员</q-item-section></q-item></q-expansion-item></q-list>
      </div>
    </template>
    <template v-else-if="name === 'QMenuDropdown'">
      <q-btn-dropdown color="primary" label="下拉菜单"><q-list><q-item v-for="item in nav.slice(0, 3)" :key="item.key" clickable v-close-popup><q-item-section avatar><AppIcon :name="item.icon" /></q-item-section><q-item-section>{{ item.label }}</q-item-section></q-item></q-list></q-btn-dropdown>
    </template>
    <template v-else-if="name === 'QDrawer'">
      <q-btn color="primary" label="打开 Sidebar" @click="drawer = true" /><q-drawer v-if="drawer" v-model="drawer" overlay bordered><q-list padding><q-item-label header>导航抽屉</q-item-label><q-item clickable v-close-popup><q-item-section>抽屉项目</q-item-section></q-item></q-list></q-drawer>
    </template>
    <template v-else-if="name === 'QBar'">
      <q-bar dense class="bg-grey-2 text-dark"><span>iOS-style title bar</span><q-space /><q-btn flat round dense><AppIcon name="x" :size="16" /></q-btn></q-bar>
      <q-bar dark class="q-mt-sm"><span>Android-style title bar</span><q-space /><AppIcon name="more-horizontal" /></q-bar>
    </template>
    <template v-else-if="name === 'QToolbar'">
      <q-card bordered><q-toolbar class="bg-primary text-white"><q-toolbar-title>Acme Console</q-toolbar-title><q-btn flat round><AppIcon name="settings" /></q-btn></q-toolbar><q-card-section>Toolbar / ToolbarTitle 组合示例</q-card-section></q-card>
    </template>
    <template v-else-if="name === 'QBreadcrumbs'">
      <q-breadcrumbs gutter="md"><q-breadcrumbs-el to="/" label="Acme Console" /><q-breadcrumbs-el label="组件全集" /></q-breadcrumbs>
      <q-breadcrumbs class="q-mt-md" active-color="primary"><template #separator><AppIcon name="chevron-right" :size="16" /></template><q-breadcrumbs-el label="首页" /><q-breadcrumbs-el label="当前页" /></q-breadcrumbs>
    </template>
    <template v-else-if="name === 'QTabs'">
      <q-tabs v-model="tab" dense outside-arrows mobile-arrows inline-label align="justify" active-color="primary"><q-tab name="one" label="概览" icon="dashboard" /><q-tab name="two" label="订单" icon="shopping_cart" alert /><q-tab name="three" label="设置" icon="settings" /></q-tabs>
      <q-tabs v-model="tab" vertical dense align="left" class="q-mt-md" active-color="primary"><q-tab name="one" label="垂直概览" /><q-tab name="two" label="垂直订单" /><q-tab name="three" label="垂直设置" /></q-tabs>
    </template>
    <template v-else-if="name === 'QTabPanels'">
      <q-tab-panels v-model="tab" animated swipeable><q-tab-panel name="one">概览面板</q-tab-panel><q-tab-panel name="two">订单面板</q-tab-panel><q-tab-panel name="three">设置面板</q-tab-panel></q-tab-panels>
    </template>
    <template v-else-if="name === 'QPagination'">
      <q-pagination v-model="page" :max="10" direction-links boundary-links color="primary" active-design="outline" rounded /><q-pagination v-model="page" :max="10" input class="q-mt-md" color="secondary" />
    </template>
    <template v-else-if="name === 'QPageScroller'">
      <q-page-scroller position="bottom-right" :scroll-offset="100" :offset="[18, 18]"><q-btn fab-mini color="primary"><AppIcon name="chevron-up" /></q-btn></q-page-scroller><div class="text-caption text-grey-7">滚动页面超过 100px 后显示 BackTop。</div>
    </template>
    <template v-else-if="name === 'QPageSticky'">
      <q-layout container view="hHh lpR fFf" style="height: 220px" class="bordered-layout"><q-page-container><q-page padding><div v-for="index in 8" :key="index">滚动内容 {{ index }}</div></q-page></q-page-container><q-page-sticky position="top-right" :offset="[12, 12]"><q-btn round color="primary"><AppIcon name="plus" /></q-btn></q-page-sticky></q-layout>
    </template>
    <template v-else-if="name === 'QExpansionItem'">
      <q-list bordered><q-expansion-item v-for="item in landing.faq.slice(0, 3)" :key="item.q" v-model="expanded" group="faq-demo" :label="item.q" expand-separator><q-card><q-card-section>{{ item.a }}</q-card-section></q-card></q-expansion-item></q-list>
    </template>
    <template v-else-if="name === 'Anchor'">
      <div class="text-caption text-grey-7">Anchor 由 QList/QItem 组合，并通过 scrollIntoView 与滚动观察器同步当前项。</div><q-list bordered dense class="q-mt-sm"><q-item v-for="item in ['Typography', 'QBtn', 'QInput']" :key="item" clickable :href="`#${item.toLowerCase()}`"><q-item-section>{{ item }}</q-item-section></q-item></q-list>
    </template>
    <template v-else>
      <q-btn outline color="primary" label="⌘ K 打开命令面板" @click="command = true" /><q-dialog v-model="command"><q-card style="min-width: min(420px, 90vw)"><q-card-section><q-input v-model="commandSearch" autofocus label="搜索命令" /><q-list dense class="q-mt-sm"><q-item v-for="item in nav.slice(0, 4)" :key="item.key" clickable v-close-popup><q-item-section>{{ item.label }}</q-item-section><q-item-section side><span class="component-kbd">↵</span></q-item-section></q-item></q-list></q-card-section></q-card></q-dialog>
    </template>
  </DemoBlock>
</template>
