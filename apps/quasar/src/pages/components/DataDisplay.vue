<script setup lang="ts">
import { ref } from "vue"
import orders from "@ui-gallery/spec/mock/orders.json"
import team from "@ui-gallery/spec/mock/team.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import landing from "@ui-gallery/spec/mock/landing.json"
import AppIcon from "../../icons/AppIcon.vue"
import DemoBlock from "./DemoBlock.vue"

const names = [
  "QTable", "QMarkupTable", "QList", "QCard", "QAvatar", "QBadge", "QChip", "Statistic", "QTimeline", "QTree", "Calendar", "QImg",
  "QCarousel", "Empty", "QTooltip", "QMenu", "QRCode",
]
const tableColumns = [
  { name: "id", label: "订单", field: "id", sortable: true },
  { name: "customer", label: "客户", field: "customer", sortable: true },
  { name: "amount", label: "金额", field: "amount", sortable: true },
  { name: "status", label: "状态", field: "status" },
]
const rows = orders.slice(0, 6)
const tablePagination = ref({ rowsPerPage: 4 })
const selected = ref([])
const treeSelected = ref("")
const treeExpanded = ref(["产品"])
const carousel = ref(0)
const dialog = ref(false)
const segmented = ref("one")
const dateValue = ref("2026/01/15")
const tree = [{ label: "产品", icon: "folder", children: [{ label: "订单" }, { label: "设置" }] }, { label: "团队", children: [{ label: "成员" }] }]
const previewSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'><rect width='640' height='360' fill='#1976d2'/><circle cx='320' cy='180' r='80' fill='#fff' opacity='.25'/></svg>")}`
const aliases: Record<string, string[]> = {
  QTable: ["Table", "DataGrid", "QTd", "QTh", "QTr"],
  QMarkupTable: ["Descriptions"],
  QList: ["List", "QItem", "QItemLabel", "QItemSection"],
  QCard: ["Card", "QCardSection", "QCardActions"],
  QAvatar: ["Avatar", "AvatarGroup"],
  QBadge: ["Badge"],
  QChip: ["Tag"],
  QMenu: ["Popover"],
  QImg: ["Image"],
  QCarousel: ["Carousel", "QCarouselSlide", "QCarouselControl"],
  QTimeline: ["Timeline", "QTimelineEntry"],
  QTree: ["Tree"],
  Empty: ["Empty"],
  QTooltip: ["Tooltip"],
}
const titles: Record<string, string> = {
  QList: "QList / QItem / QItemLabel / QItemSection",
  QCard: "QCard / QCardSection / QCardActions",
  QTimeline: "QTimeline / QTimelineEntry",
  QCarousel: "QCarousel / QCarouselSlide / QCarouselControl",
}
</script>

<template>
  <DemoBlock v-for="name in names" :id="name" :ids="aliases[name]" :key="name" :title="titles[name] ?? name">
    <template v-if="name === 'QTable'">
      <div class="table-scroll"><q-table v-model:selected="selected" selection="multiple" :rows="rows" :columns="tableColumns" row-key="id" v-model:pagination="tablePagination" dense bordered flat :rows-per-page-options="[2, 4, 6]" sticky-header class="component-table">
        <template #header="props"><q-tr :props="props"><q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th></q-tr></template>
        <template #body="props"><q-tr :props="props"><q-td v-for="col in props.cols" :key="col.name" :props="props"><q-chip v-if="col.name === 'status'" dense color="primary" text-color="white">{{ col.value }}</q-chip><template v-else>{{ col.value }}</template></q-td></q-tr></template>
      </q-table></div>
      <div class="text-caption text-grey-7 q-mt-sm">支持 dense、sticky header、多选、排序、分页和状态单元格。</div>
    </template>
    <template v-else-if="name === 'QMarkupTable'">
      <div class="table-scroll"><q-markup-table dense flat bordered separator="cell" wrap-cells><thead><tr><th>字段</th><th>值</th><th>说明</th></tr></thead><tbody><tr v-for="item in [['状态', '已完成', '订单状态'], ['客户', orders[0]?.customer ?? '客户', '来自 orders.json']]" :key="item[0]"><td>{{ item[0] }}</td><td>{{ item[1] }}</td><td>{{ item[2] }}</td></tr></tbody></q-markup-table></div>
    </template>
    <template v-else-if="name === 'QList'">
      <q-list bordered separator padding><q-item v-for="member in team.slice(0, 3)" :key="member.name" clickable active-class="text-primary"><q-item-section avatar><q-avatar color="primary" text-color="white">{{ member.name.slice(0, 1) }}</q-avatar></q-item-section><q-item-section><q-item-label overline>{{ member.role }}</q-item-label><q-item-label>{{ member.name }}</q-item-label><q-item-label caption>{{ member.email }}</q-item-label></q-item-section><q-item-section side><AppIcon name="chevron-right" /></q-item-section></q-item></q-list>
      <q-list dense class="q-mt-md"><q-item v-for="session in sessions.slice(0, 2)" :key="session.device"><q-item-section><q-item-label>{{ session.device }}</q-item-label><q-item-label caption>{{ session.location }}</q-item-label></q-item-section></q-item></q-list>
    </template>
    <template v-else-if="name === 'QCard'">
      <div class="row q-col-gutter-md"><div class="col-12 col-sm-6"><q-card bordered><q-card-section><div class="text-h6">卡片标题</div><div class="text-body2 text-grey-7">卡片内容和操作区域。</div></q-card-section><q-card-actions align="right"><q-btn flat color="primary" label="操作" /></q-card-actions></q-card></div><div class="col-12 col-sm-6"><q-card flat bordered horizontal><q-skeleton width="90px" height="90px" /><q-card-section>横向卡片</q-card-section></q-card></div></div>
    </template>
    <template v-else-if="name === 'QAvatar'">
      <div class="row q-gutter-md items-center"><q-avatar size="32px" color="primary" text-color="white">林</q-avatar><q-avatar size="48px" color="secondary" text-color="white" rounded>晓</q-avatar><q-avatar size="64px" color="accent" text-color="white" square><AppIcon name="user" /></q-avatar><q-avatar size="48px" color="primary" text-color="white">A<q-badge floating color="negative">3</q-badge></q-avatar></div>
      <div class="row q-gutter-none q-mt-md"><q-avatar v-for="member in team.slice(0, 4)" :key="member.name" size="32px" color="primary" text-color="white" class="avatar-overlap">{{ member.name.slice(0, 1) }}</q-avatar></div>
    </template>
    <template v-else-if="name === 'QBadge'">
      <div class="row q-gutter-sm items-center"><q-badge color="primary">Primary</q-badge><q-badge outline color="positive">Outline</q-badge><q-badge rounded color="negative">3</q-badge><q-btn color="primary" label="按钮"><q-badge floating color="negative">9</q-badge></q-btn></div>
    </template>
    <template v-else-if="name === 'QChip'">
      <div class="row q-gutter-sm items-center"><q-chip color="primary" text-color="white">默认</q-chip><q-chip outline color="secondary">Outline</q-chip><q-chip square removable color="positive" text-color="white">可移除</q-chip><q-chip clickable selected color="accent">Selected</q-chip><q-chip disable>Disable</q-chip></div>
    </template>
    <template v-else-if="name === 'Statistic'">
      <div class="row q-col-gutter-md"><div v-for="stat in stats.slice(0, 3)" :key="stat.label" class="col-12 col-sm-4"><q-card bordered><q-card-section><div class="text-caption text-grey-7">{{ stat.label }}</div><div class="text-h4">{{ stat.value }}</div><q-badge :color="stat.delta > 0 ? 'positive' : 'negative'">{{ stat.delta > 0 ? '+' : '' }}{{ stat.delta }}%</q-badge></q-card-section></q-card></div></div>
    </template>
    <template v-else-if="name === 'QTimeline'">
      <q-timeline color="primary" layout="comfortable"><q-timeline-entry v-for="item in activity.slice(0, 3)" :key="item.user + item.time" :title="item.action" :subtitle="item.time" icon="check"><div>{{ item.user }}</div></q-timeline-entry></q-timeline>
    </template>
    <template v-else-if="name === 'QTree'">
      <q-tree v-model:selected="treeSelected" v-model:expanded="treeExpanded" :nodes="tree" node-key="label" tick-strategy="leaf" selected-color="primary" default-expand-all />
    </template>
    <template v-else-if="name === 'Calendar'">
      <q-date v-model="dateValue" today-btn landscape />
    </template>
    <template v-else-if="name === 'QImg'">
      <div class="row q-col-gutter-md"><div class="col-12 col-sm-6" style="max-width: 320px"><q-img :src="previewSvg" :ratio="16 / 9" class="rounded-borders"><div class="absolute-bottom text-subtitle2 text-center">Caption overlay</div></q-img></div><div class="col-12 col-sm-6" style="max-width: 320px"><q-img :src="previewSvg" :ratio="1" fit="contain" class="rounded-borders" /></div></div>
      <q-btn outline color="primary" label="打开预览" class="q-mt-md" @click="dialog = true" />
      <q-dialog v-model="dialog"><q-card><q-img :src="previewSvg" style="width: 640px; max-width: 90vw" /></q-card></q-dialog>
    </template>
    <template v-else-if="name === 'QCarousel'">
      <q-carousel v-model="carousel" animated arrows navigation height="180px" class="bg-primary text-white"><q-carousel-slide v-for="(item, index) in landing.numbers.slice(0, 3)" :key="item.label" :name="index" class="column no-wrap flex-center"><div class="text-h4">{{ item.value }}</div><div>{{ item.label }}</div></q-carousel-slide><q-carousel-control position="bottom-right" :offset="[18, 18]"><q-btn round dense color="white" text-color="primary"><AppIcon name="plus" /></q-btn></q-carousel-control></q-carousel>
    </template>
    <template v-else-if="name === 'Empty'">
      <div class="column items-center q-pa-lg text-grey-7"><AppIcon name="inbox" size="40" /><div class="q-mt-sm">暂无数据</div><q-btn flat color="primary" label="刷新" class="q-mt-sm" /></div>
    </template>
    <template v-else-if="name === 'QTooltip'">
      <q-btn color="primary" label="悬停查看提示"><q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="bg-dark">这是一个 Tooltip</q-tooltip></q-btn>
    </template>
    <template v-else-if="name === 'QMenu'">
      <q-btn color="primary" label="打开菜单"><q-menu fit><q-list style="min-width: 160px"><q-item clickable v-close-popup><q-item-section>菜单项</q-item-section></q-item><q-item clickable v-close-popup><q-item-section>另一个菜单项</q-item-section></q-item></q-list></q-menu></q-btn>
    </template>
    <template v-else-if="name === 'QRCode'">
      <div class="qr-placeholder">QRCode：missing</div>
    </template>
    <template v-else>
      <q-btn-toggle v-model="segmented" spread dense outline color="primary" :options="[{ label: '第一项', value: 'one' }, { label: '第二项', value: 'two' }]" />
    </template>
  </DemoBlock>
</template>
