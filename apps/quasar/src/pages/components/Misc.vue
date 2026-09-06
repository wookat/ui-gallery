<script setup lang="ts">
import { computed, ref } from "vue"
import { Dark, useQuasar } from "quasar"
import AppIcon from "../../icons/AppIcon.vue"
import DemoBlock from "./DemoBlock.vue"

const $q = useQuasar()
const names = ["QChatMessage", "QIconMisc", "ThemeProvider", "Watermark", "Tour", "FloatButton", "Directives", "Plugins"]
const dark = computed(() => Dark.isActive)
const gesture = ref("等待手势")
const morph = ref(false)
const directives = ref(0)
function toggleTheme() {
  Dark.set(!dark.value)
}
function showBottomSheet() {
  if ($q.bottomSheet) $q.bottomSheet({ title: "底部菜单", message: "选择一个操作", actions: [{ label: "查看详情" }, { label: "取消", color: "negative" }] })
}
function startPluginLoading() {
  $q.loading.show({ message: "Loading plugin" })
  window.setTimeout(() => $q.loading.hide(), 800)
}
</script>

<template>
  <DemoBlock v-for="name in names" :id="name" :key="name" :title="name">
    <template v-if="name === 'QChatMessage'">
      <q-chat-message name="用户" sent stamp="刚刚" bg-color="primary" text-color="white" label="发送消息" :text="['你好，这是一条发送消息。']" />
      <q-chat-message name="助手" stamp="刚刚" bg-color="grey-2" text-color="dark" label="接收消息"><template #avatar><q-avatar color="primary" text-color="white">A</q-avatar></template>这是 QChatMessage 的默认插槽内容。</q-chat-message>
    </template>
    <template v-else-if="name === 'QIconMisc'">
      <div class="row q-gutter-lg items-center"><AppIcon v-for="icon in ['home', 'search', 'settings', 'heart', 'sparkles', 'circle-help', 'check-circle', 'alert-triangle']" :key="icon" :name="icon" :size="26" /><span class="text-caption">Material + Lucide + Tabler + Phosphor + Heroicons</span></div>
    </template>
    <template v-else-if="name === 'ThemeProvider'">
      <div class="row items-center q-gutter-md"><q-toggle :model-value="dark" label="Dark plugin" @update:model-value="toggleTheme" /><span>当前：{{ dark ? "dark" : "light" }}</span></div><div class="row q-gutter-sm q-mt-md"><div v-for="color in ['primary', 'secondary', 'accent', 'positive', 'negative', 'warning', 'info', 'dark']" :key="color" :class="`bg-${color}`" style="width: 42px; height: 28px; border-radius: 4px" /></div>
    </template>
    <template v-else-if="name === 'Watermark'">
      <div class="bordered-layout q-pa-xl text-center text-grey-7">{{ name }}：missing</div>
    </template>
    <template v-else-if="name === 'Tour'">
      <div class="bordered-layout q-pa-xl text-center text-grey-7">{{ name }}：missing</div>
    </template>
    <template v-else-if="name === 'FloatButton'">
      <div class="relative-position" style="height: 130px"><q-fab color="primary" direction="up" class="absolute-bottom-right"><template #icon><AppIcon name="plus" /></template><q-fab-action color="secondary"><AppIcon name="edit" /></q-fab-action></q-fab></div>
    </template>
    <template v-else-if="name === 'Directives'">
      <q-card v-ripple class="q-pa-md cursor-pointer" @click="directives++">v-ripple / v-close-popup / v-touch-* / v-intersection / v-mutation / v-morph / v-scroll<br><span class="text-caption">点击次数：{{ directives }}</span></q-card><q-btn v-close-popup flat label="v-close-popup" class="q-mt-sm" /><q-card class="q-mt-md q-pa-md" @click="gesture = '点击 / swipe / pan 可扩展：' + gesture">最后手势：{{ gesture }}</q-card>
    </template>
    <template v-else>
      <div class="row q-gutter-sm"><q-btn color="positive" label="Notify" @click="$q.notify({ type: 'positive', message: 'Plugin Notify' })" /><q-btn color="primary" label="Dialog" @click="$q.dialog({ title: 'Dialog plugin', message: '插件演示' })" /><q-btn color="secondary" label="BottomSheet" @click="showBottomSheet" /><q-btn outline label="LoadingBar" @click="startPluginLoading" /></div><q-btn flat label="切换 morph" class="q-mt-sm" @click="morph = !morph" /><q-slide-transition><div v-show="morph" class="bg-primary text-white q-pa-md q-mt-sm">v-morph / transition block</div></q-slide-transition>
    </template>
  </DemoBlock>
</template>
