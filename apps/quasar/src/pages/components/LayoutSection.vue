<script setup lang="ts">
import { ref } from "vue"
import AppIcon from "../../icons/AppIcon.vue"
import DemoBlock from "./DemoBlock.vue"

const names = ["Grid", "Stack", "QSpace", "QLayout", "Container", "QResponsive", "QSplitter", "QScrollArea", "QVirtualScroll", "QInfiniteScroll", "QIntersection", "QScrollObserver", "QParallax", "QNoSsr", "QVideo"]
const split = ref(50)
const splitVertical = ref(50)
const virtualItems = Array.from({ length: 1000 }, (_, index) => `订单 #${index + 1}`)
const infiniteItems = ref(["批次 1", "批次 2", "批次 3"])
const scrollPosition = ref(0)
const aliases: Record<string, string[]> = {
  QLayout: ["Layout", "Sidebar"],
  Container: ["Container"],
  QResponsive: ["AspectRatio"],
  QSplitter: ["Resizable"],
  QScrollArea: ["ScrollArea"],
}

function loadMore(index: number, done: () => void) {
  window.setTimeout(() => {
    infiniteItems.value.push(`批次 ${index + 1}`)
    done()
  }, 250)
}
</script>

<template>
  <DemoBlock v-for="name in names" :id="name" :ids="aliases[name]" :key="name" :title="name">
    <template v-if="name === 'Grid'">
      <div class="row q-col-gutter-md"><div v-for="index in 12" :key="index" class="col-6 col-sm-3"><q-card bordered class="q-pa-sm text-center">col {{ index }}</q-card></div></div>
    </template>
    <template v-else-if="name === 'Stack'">
      <div class="column q-gutter-sm"><q-card bordered class="q-pa-md">Column stack</q-card><q-card bordered class="q-pa-md"><div class="row items-center justify-between"><span>Row + justify-between</span><q-space /><q-btn flat label="操作" /></div></q-card></div>
    </template>
    <template v-else-if="name === 'QSpace'">
      <q-card bordered><div class="row items-center q-pa-md"><span>左侧</span><q-space /><span>右侧</span></div></q-card><div class="text-caption text-grey-7 q-mt-sm">q-gutter-* 和 QSpace 用于 Stack / Space 布局。</div>
    </template>
    <template v-else-if="name === 'QLayout'">
      <q-layout container view="hHh lpR fFf" style="height: 320px" class="bordered-layout"><q-header id="q-header" bordered><q-toolbar><q-toolbar-title>Layout container</q-toolbar-title></q-toolbar></q-header><q-drawer id="q-drawer" show-if-above bordered :width="100"><q-list dense><q-item>导航</q-item></q-list></q-drawer><q-page-container id="q-page-container"><q-page id="q-page" padding>QPageContainer / QPage</q-page></q-page-container><q-footer id="q-footer" bordered><q-toolbar><q-toolbar-title class="text-caption">Footer</q-toolbar-title></q-toolbar></q-footer></q-layout>
    </template>
    <template v-else-if="name === 'Container'">
      <div class="q-mx-auto bordered-layout q-pa-md" style="max-width: 960px">q-mx-auto max-width 960 container</div>
    </template>
    <template v-else-if="name === 'QResponsive'">
      <div class="row q-col-gutter-md"><q-responsive :ratio="16 / 9" class="col-12 col-sm-6 bg-primary text-white flex flex-center">16:9</q-responsive><q-responsive :ratio="1" class="col-12 col-sm-3 bg-secondary text-white flex flex-center">1:1</q-responsive><q-responsive :ratio="4 / 3" class="col-12 col-sm-3 bg-accent text-white flex flex-center">4:3</q-responsive></div>
    </template>
    <template v-else-if="name === 'QSplitter'">
      <q-splitter v-model="split" style="height: 180px" class="bordered-layout"><template #before><q-list padding><q-item>左侧内容</q-item><q-item>分割线</q-item></q-list></template><template #after><q-splitter v-model="splitVertical" horizontal><template #before><div class="q-pa-md">嵌套上方</div></template><template #after><div class="q-pa-md">嵌套下方</div></template></q-splitter></template><template #separator><q-avatar color="primary" text-color="white" size="28px"><AppIcon name="more-horizontal" /></q-avatar></template></q-splitter>
    </template>
    <template v-else-if="name === 'QScrollArea'">
      <q-scroll-area style="height: 150px" class="bordered-layout"><div v-for="index in 12" :key="index" class="q-pa-sm">ScrollArea row {{ index }}</div></q-scroll-area>
    </template>
    <template v-else-if="name === 'QVirtualScroll'">
      <q-virtual-scroll :items="virtualItems" virtual-scroll-item-size="32" style="height: 160px" class="bordered-layout"><template #default="props"><q-item :key="props.index" dense><q-item-section>{{ props.item }}</q-item-section></q-item></template></q-virtual-scroll>
    </template>
    <template v-else-if="name === 'QInfiniteScroll'">
      <q-infinite-scroll @load="loadMore" :offset="20" style="height: 150px" class="bordered-layout"><q-list separator><q-item v-for="item in infiniteItems" :key="item">{{ item }}</q-item></q-list><template #loading><div class="row justify-center q-pa-md"><q-spinner-dots /></div></template></q-infinite-scroll>
    </template>
    <template v-else-if="name === 'QIntersection'">
      <div class="bordered-layout" style="height: 160px; overflow-y: auto">
        <q-intersection v-for="i in 6" :key="i" once transition="fade" class="intersection-item" style="min-height: 56px">
          <q-item><q-item-section>懒渲染项 {{ i }}</q-item-section></q-item>
        </q-intersection>
      </div>
      <div class="text-caption text-grey-7 q-mt-sm">滚动容器内的项目进入视口后才渲染。</div>
    </template>
    <template v-else-if="name === 'QScrollObserver'">
      <q-scroll-observer @scroll="scrollPosition = $event.position.top" /><div class="text-caption">当前滚动位置：{{ scrollPosition }}px</div>
    </template>
    <template v-else-if="name === 'QParallax'">
      <q-parallax :height="180"><template #media><div class="full-width full-height bg-primary" /></template><div class="absolute text-white text-h5">CSS gradient media</div></q-parallax>
    </template>
    <template v-else-if="name === 'QVideo'">
      <q-video :ratio="16 / 9" src="about:blank" title="QVideo" />
      <div class="text-caption text-grey-7 q-mt-sm">QVideo 使用 about:blank，不请求网络视频。</div>
    </template>
    <template v-else>
      <q-no-ssr><span>QNoSsr 安全包装内容</span></q-no-ssr>
    </template>
  </DemoBlock>
</template>
