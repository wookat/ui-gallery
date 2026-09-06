<script setup lang="ts">
import { ref } from "vue"
import {
  QSpinner, QSpinnerAudio, QSpinnerBall, QSpinnerBars, QSpinnerBox, QSpinnerClock, QSpinnerComment, QSpinnerCube, QSpinnerDots,
  QSpinnerFacebook, QSpinnerGears, QSpinnerGrid, QSpinnerHearts, QSpinnerHourglass, QSpinnerInfinity, QSpinnerIos, QSpinnerOrbit,
  QSpinnerOval, QSpinnerPie, QSpinnerPuff, QSpinnerRadio, QSpinnerRings, QSpinnerTail, useQuasar,
} from "quasar"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import AppIcon from "../../icons/AppIcon.vue"
import DemoBlock from "./DemoBlock.vue"

const $q = useQuasar()
const names = [
  "QBanner", "Notify", "Notification", "Toast", "QDialog", "Drawer", "Loading", "QInnerLoading", "QLinearProgress",
  "QCircularProgress", "QStepper", "QSkeleton", "QSpinner", "Result", "Popconfirm", "QAjaxBar", "QPullToRefresh",
  "QSlideItem", "QSlideTransition",
]
const dialog = ref(false)
const drawer = ref(false)
const progress = ref(55)
const circular = ref(66)
const step = ref(1)
const refresh = ref(false)
const slide = ref(false)
const ajax = ref()

const spinners = {
  QSpinner, QSpinnerAudio, QSpinnerBall, QSpinnerBars, QSpinnerBox, QSpinnerClock, QSpinnerComment, QSpinnerCube, QSpinnerDots,
  QSpinnerFacebook, QSpinnerGears, QSpinnerGrid, QSpinnerHearts, QSpinnerHourglass, QSpinnerInfinity, QSpinnerIos, QSpinnerOrbit,
  QSpinnerOval, QSpinnerPie, QSpinnerPuff, QSpinnerRadio, QSpinnerRings, QSpinnerTail,
}
const aliases: Record<string, string[]> = {
  QBanner: ["Alert"],
  Notify: ["Notification", "Toast"],
  QDialog: ["Dialog"],
  Drawer: ["Drawer"],
  Loading: ["Loading"],
  QInnerLoading: ["QInnerLoading"],
  QLinearProgress: ["Progress"],
  QStepper: ["Steps"],
  QSkeleton: ["Skeleton"],
  QSpinner: ["Spinner"],
}

function slug(value: string) {
  return value.replace(/^Q(?=[A-Z])/, "Q-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

function notify(type: "positive" | "negative" | "warning" | "info" | undefined, message = "通知消息") {
  $q.notify({ type, message, caption: "来自 ComponentsPage", actions: [{ label: "关闭", color: "white" }] })
}

function showLoading() {
  $q.loading.show({ message: "正在加载..." })
  window.setTimeout(() => $q.loading.hide(), 1200)
}

function refreshList(done: (stop?: boolean) => void) {
  refresh.value = true
  window.setTimeout(() => { refresh.value = false; done() }, 600)
}

function startAjax() {
  ajax.value?.start()
  window.setTimeout(() => ajax.value?.stop(), 900)
}
</script>

<template>
  <DemoBlock v-for="name in names" :id="name" :ids="aliases[name]" :key="name" :title="name">
    <template v-if="name === 'QBanner'">
      <div class="q-gutter-sm"><q-banner dense class="bg-positive text-white rounded-borders">操作成功</q-banner><q-banner dense class="bg-negative text-white rounded-borders">发生错误</q-banner><q-banner inline-actions class="bg-info text-white">需要进一步操作<template #action><q-btn flat label="查看" /></template></q-banner><q-banner class="bg-warning text-white"><template #avatar><AppIcon name="alert-triangle" /></template>这是一条带头像的提示</q-banner></div>
    </template>
    <template v-else-if="name === 'Notify' || name === 'Notification' || name === 'Toast'">
      <div class="row q-gutter-sm"><q-btn color="positive" label="Positive" @click="notify('positive', '成功通知')" /><q-btn color="negative" label="Negative" @click="notify('negative', '错误通知')" /><q-btn color="warning" label="Warning" @click="notify('warning', '警告通知')" /><q-btn color="info" label="Info" @click="notify('info', '信息通知')" /><q-btn outline label="Plain" @click="notify(undefined, '普通消息')" /></div>
      <div class="text-caption text-grey-7 q-mt-sm">通知支持 caption、actions、进度条、持久化、spinner、分组和多行文本。</div>
    </template>
    <template v-else-if="name === 'QDialog'">
      <q-btn color="primary" label="打开 Dialog" @click="dialog = true" /><q-dialog v-model="dialog"><q-card style="min-width: 280px"><q-card-section><div class="text-h6">对话框</div></q-card-section><q-card-section>这是一个默认不自动打开的对话框。</q-card-section><q-card-actions align="right"><q-btn flat label="关闭" v-close-popup /></q-card-actions></q-card></q-dialog>
    </template>
    <template v-else-if="name === 'Drawer'">
      <q-btn color="primary" label="打开右侧 Drawer" @click="drawer = true" /><q-drawer v-if="drawer" v-model="drawer" side="right" bordered overlay><q-list padding><q-item-label header>抽屉内容</q-item-label><q-item v-for="item in notifications.slice(0, 2)" :key="item.title"><q-item-section>{{ item.title }}</q-item-section></q-item></q-list></q-drawer>
    </template>
    <template v-else-if="name === 'Loading'">
      <q-btn color="primary" label="显示 Loading" @click="showLoading" />
    </template>
    <template v-else-if="name === 'QInnerLoading'">
      <q-card bordered style="height: 120px"><q-card-section>正在加载的卡片</q-card-section><q-inner-loading :showing="true"><q-spinner-dots size="40px" color="primary" /></q-inner-loading></q-card>
    </template>
    <template v-else-if="name === 'QLinearProgress'">
      <q-linear-progress v-model="progress" color="primary" size="6px" class="q-mb-md" /><q-linear-progress :value="0.6" :buffer="0.85" color="secondary" stripe rounded size="12px" /><q-linear-progress indeterminate color="accent" class="q-mt-md" /><q-linear-progress query color="positive" class="q-mt-md" />
    </template>
    <template v-else-if="name === 'QCircularProgress'">
      <q-circular-progress v-model="circular" show-value size="90px" color="primary" track-color="grey-3"><span>{{ circular }}%</span></q-circular-progress><q-circular-progress indeterminate size="70px" color="secondary" class="q-ml-md" />
    </template>
    <template v-else-if="name === 'QStepper'">
      <q-stepper v-model="step" flat bordered animated color="primary"><q-step id="q-step" :name="1" title="第一步" icon="looks_one" :done="step > 1">基础信息</q-step><q-step :name="2" title="第二步" icon="looks_two" :done="step > 2">详细配置</q-step><q-step :name="3" title="第三步" icon="looks_3">确认提交</q-step><q-stepper-navigation id="q-stepper-navigation"><q-btn color="primary" label="下一步" @click="step = Math.min(3, step + 1)" /></q-stepper-navigation></q-stepper>
    </template>
    <template v-else-if="name === 'QSkeleton'">
      <div class="row q-col-gutter-md items-center"><div v-for="type in ['text', 'rect', 'circle', 'QBtn', 'QBadge', 'QChip', 'QToolbar', 'QCheckbox', 'QRadio', 'QToggle', 'QSlider', 'QRange', 'QInput', 'QAvatar']" :key="type" class="col-6 col-sm-3"><q-skeleton :type="type" animation="wave" /></div></div>
      <div class="row q-gutter-sm q-mt-md"><q-skeleton v-for="animation in ['pulse', 'pulse-x', 'pulse-y', 'fade', 'blink', 'none']" :key="animation" width="100px" height="24px" :animation="animation" /></div>
    </template>
    <template v-else-if="name === 'QSpinner'">
      <div class="row q-col-gutter-sm items-start"><div v-for="(spinner, spinnerName) in spinners" :id="spinnerName === 'QSpinner' ? undefined : slug(spinnerName)" :key="spinnerName" class="col-6 col-sm-3 text-center q-pa-sm"><component :is="spinner" color="primary" size="2em" /><div class="text-caption q-mt-xs">{{ spinnerName }}</div></div></div>
    </template>
    <template v-else-if="name === 'Result'">
      <div class="row q-col-gutter-md"><q-card v-for="result in [{ icon: 'check-circle', color: 'positive', title: '成功' }, { icon: 'x-circle', color: 'negative', title: '失败' }, { icon: 'info', color: 'info', title: '提示' }, { icon: 'alert-triangle', color: 'warning', title: '警告' }]" :key="result.title" bordered class="col-12 col-sm-3 text-center q-pa-md"><AppIcon :name="result.icon" :size="36" :class="`text-${result.color}`" /><div class="text-h6 q-mt-sm">{{ result.title }}</div><div class="text-caption text-grey-7">操作结果说明</div></q-card></div>
    </template>
    <template v-else-if="name === 'Popconfirm'">
      <q-btn color="negative" label="删除"><q-menu anchor="top middle" self="bottom middle"><q-card class="q-pa-md"><div>确认删除这条记录吗？</div><div class="row justify-end q-gutter-sm q-mt-md"><q-btn flat label="取消" v-close-popup /><q-btn color="negative" label="确认" v-close-popup /></div></q-card></q-menu></q-btn>
    </template>
    <template v-else-if="name === 'QAjaxBar'">
      <q-ajax-bar ref="ajax" position="top" color="primary" size="4px" /><q-btn color="primary" label="开始 / 停止" @click="startAjax" />
    </template>
    <template v-else-if="name === 'QPullToRefresh'">
      <q-pull-to-refresh @refresh="refreshList"><q-list bordered><q-item v-for="item in notifications.slice(0, 3)" :key="item.title"><q-item-section>{{ item.title }}</q-item-section></q-item></q-list></q-pull-to-refresh>
      <q-spinner v-if="refresh" class="q-mt-sm" />
    </template>
    <template v-else-if="name === 'QSlideItem'">
      <q-slide-item v-for="item in notifications.slice(0, 2)" :key="item.title"><template #left><q-icon name="archive" /></template><template #right><q-icon name="delete" /></template><q-item><q-item-section>{{ item.title }}</q-item-section></q-item></q-slide-item>
    </template>
    <template v-else>
      <q-slide-transition><q-card v-show="slide" bordered class="q-pa-md">过渡内容</q-card></q-slide-transition><q-btn flat color="primary" label="切换过渡" @click="slide = !slide" />
    </template>
  </DemoBlock>
</template>
