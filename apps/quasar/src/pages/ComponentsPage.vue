<script setup lang="ts">
import { computed } from "vue"
import PageHeader from "../components/PageHeader.vue"
import { coverage } from "../coverage"
import Buttons from "./components/Buttons.vue"
import DataDisplay from "./components/DataDisplay.vue"
import Feedback from "./components/Feedback.vue"
import FormControls from "./components/FormControls.vue"
import LayoutSection from "./components/LayoutSection.vue"
import Misc from "./components/Misc.vue"
import Navigation from "./components/Navigation.vue"
import Typography from "./components/Typography.vue"

const anchors = [
  "QAjaxBar", "QAvatar", "QBadge", "QBanner", "QBar", "QBreadcrumbs", "QBreadcrumbsEl", "QBtn", "QBtnDropdown", "QBtnGroup", "QBtnToggle",
  "QCard", "QCardSection", "QCardActions", "QCarousel", "QCarouselSlide", "QCarouselControl", "QChatMessage", "QCheckbox", "QChip",
  "QCircularProgress", "QColor", "QDate", "QDialog", "QDrawer", "QEditor", "QExpansionItem", "QFab", "QFabAction", "QField", "QFile",
  "QFooter", "QForm", "QHeader", "QIcon", "QImg", "QInfiniteScroll", "QInnerLoading", "QInput", "QIntersection", "QItem", "QItemLabel",
  "QItemSection", "QKnob", "QLayout", "QLinearProgress", "QList", "QMarkupTable", "QMenu", "QNoSsr", "QOptionGroup", "QPage", "QPageContainer",
  "QPageScroller", "QPageSticky", "QPagination", "QParallax", "QPopupEdit", "QPopupProxy", "QPullToRefresh", "QRadio", "QRange", "QRating",
  "QResponsive", "QRouteTab", "QScrollArea", "QScrollObserver", "QSelect", "QSeparator", "QSkeleton", "QSlideItem", "QSlideTransition", "QSlider",
  "QSpace", "QSpinner", "QSpinnerAudio", "QSpinnerBall", "QSpinnerBars", "QSpinnerBox", "QSpinnerClock", "QSpinnerComment", "QSpinnerCube",
  "QSpinnerDots", "QSpinnerFacebook", "QSpinnerGears", "QSpinnerGrid", "QSpinnerHearts", "QSpinnerHourglass", "QSpinnerInfinity", "QSpinnerIos",
  "QSpinnerOrbit", "QSpinnerOval", "QSpinnerPie", "QSpinnerPuff", "QSpinnerRadio", "QSpinnerRings", "QSpinnerTail", "QSplitter", "QStep",
  "QStepper", "QStepperNavigation", "QTab", "QTabPanel", "QTabPanels", "QTable", "QTd", "QTh", "QTr", "QTabs", "QTime", "QTimeline",
  "QTimelineEntry", "QToggle", "QToolbar", "QToolbarTitle", "QTooltip", "QTree", "QUploader", "QUploaderAddTrigger", "QVideo", "QVirtualScroll",
  "Typography", "Button", "ButtonGroup", "IconButton", "Input", "Textarea", "NumberInput", "Select", "MultiSelect", "Combobox", "Autocomplete",
  "Checkbox", "Radio", "Switch", "Slider", "Rating", "DatePicker", "TimePicker", "DateRangePicker", "ColorPicker", "Upload", "Cascader",
  "Transfer", "Mention", "PinInput", "Form", "Table", "DataGrid", "Descriptions", "List", "Card", "Avatar", "AvatarGroup", "Badge", "Tag",
  "Statistic", "Timeline", "Tree", "Calendar", "Image", "Carousel", "Empty", "Tooltip", "Popover", "QRCode", "Segmented", "Alert", "Toast",
  "Notification", "Dialog", "Drawer", "Progress", "Skeleton", "Spinner", "Result", "Popconfirm", "Menu", "Dropdown", "Breadcrumb", "Tabs",
  "Pagination", "Steps", "Anchor", "BackTop", "Affix", "Navbar", "Sidebar", "CommandPalette", "Grid", "Stack", "Layout", "Container",
  "AspectRatio", "Resizable", "ScrollArea", "Accordion", "ThemeProvider", "Watermark", "Tour", "FloatButton", "Kbd", "Code", "Divider", "Link",
  "Directives", "Plugins",
]

const missing = new Set(["QRCode", "Watermark", "Tour"])
const composed = new Set(["Cascader", "Transfer", "Mention", "PinInput", "Descriptions", "AvatarGroup", "Statistic", "Empty", "Result", "Popconfirm", "Anchor", "CommandPalette", "Kbd", "Code", "Link", "Directives", "Plugins"])
const sections = [
  { title: "Typography", component: Typography },
  { title: "Buttons", component: Buttons },
  { title: "Form controls", component: FormControls },
  { title: "Data display", component: DataDisplay },
  { title: "Feedback", component: Feedback },
  { title: "Navigation", component: Navigation },
  { title: "Layout", component: LayoutSection },
  { title: "Miscellaneous", component: Misc },
]
const rendered = new Set([
  "Typography", "QIcon", "QSeparator", "Kbd", "Code", "Divider", "Link",
  "QBtn", "QBtnGroup", "QBtnToggle", "QBtnDropdown", "QFab", "QFabAction", "QRouteTab",
  "QInput", "QField", "QFile", "QSelect", "QOptionGroup", "QCheckbox", "QRadio", "QToggle", "QSlider", "QRange", "QRating", "QKnob", "QDate", "QTime", "QColor", "QUploader", "QEditor", "QPopupEdit", "QForm", "Cascader", "Transfer", "Mention", "PinInput",
  "QTable", "QMarkupTable", "QList", "QItem", "QItemLabel", "QItemSection", "QCard", "QCardSection", "QCardActions", "QAvatar", "QBadge", "QChip", "Statistic", "QTimeline", "QTimelineEntry", "QTree", "Calendar", "QImg", "QCarousel", "QCarouselSlide", "QCarouselControl", "Empty", "QTooltip", "QMenu", "QRCode", "QBtnToggle",
  "QBanner", "Notify", "Notification", "Toast", "QDialog", "Drawer", "Loading", "QInnerLoading", "QLinearProgress", "QCircularProgress", "QStepper", "QSkeleton", "QSpinner", "Result", "Popconfirm", "QAjaxBar", "QPullToRefresh", "QSlideItem", "QSlideTransition",
  "QDrawer", "QHeader", "QFooter", "QToolbar", "QToolbarTitle", "QBreadcrumbs", "QBreadcrumbsEl", "QTabs", "QTab", "QTabPanels", "QTabPanel", "QPagination", "QPageScroller", "QPageSticky", "QExpansionItem", "Anchor", "CommandPalette",
  "Grid", "Stack", "QSpace", "QLayout", "Container", "QResponsive", "QSplitter", "QScrollArea", "QVirtualScroll", "QInfiniteScroll", "QIntersection", "QScrollObserver", "QParallax", "QNoSsr",
  "QChatMessage", "ThemeProvider", "Watermark", "Tour", "FloatButton", "Directives", "Plugins",
])
for (const name of [
  "QBar", "QPage", "QPageContainer", "QPopupProxy", "QSpinnerAudio", "QSpinnerBall", "QSpinnerBars", "QSpinnerBox", "QSpinnerClock",
  "QSpinnerComment", "QSpinnerCube", "QSpinnerDots", "QSpinnerFacebook", "QSpinnerGears", "QSpinnerGrid", "QSpinnerHearts",
  "QSpinnerHourglass", "QSpinnerInfinity", "QSpinnerIos", "QSpinnerOrbit", "QSpinnerOval", "QSpinnerPie", "QSpinnerPuff",
  "QSpinnerRadio", "QSpinnerRings", "QSpinnerTail", "QStep", "QStepperNavigation", "QTd", "QTh", "QTr", "QUploaderAddTrigger", "QVideo",
  "Button", "ButtonGroup", "IconButton", "Input", "Textarea", "NumberInput", "Select", "MultiSelect", "Combobox", "Autocomplete",
  "DatePicker", "TimePicker", "DateRangePicker", "ColorPicker", "Upload", "Table", "DataGrid", "Descriptions", "List", "Card",
  "Avatar", "AvatarGroup", "Badge", "Tag", "Tooltip", "Popover", "Segmented", "Alert", "Notification", "Toast", "Dialog",
  "Progress", "Skeleton", "Spinner", "Menu", "Dropdown", "Breadcrumb", "Tabs", "Pagination", "Steps", "BackTop", "Affix",
  "Navbar", "Sidebar", "Grid", "Stack", "Layout", "Container", "AspectRatio", "Resizable", "ScrollArea", "Accordion",
  "Checkbox", "Radio", "Switch", "Slider", "Rating", "Form", "Timeline", "Tree", "Image", "Carousel",
]) rendered.add(name)
const unrendered = anchors.filter((name) => !rendered.has(name))
if (import.meta.env.DEV && unrendered.length) console.warn("ComponentsPage anchors without demos:", unrendered)

function slug(value: string) {
  return value.replace(/^Q(?=[A-Z])/, "Q-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

function status(name: string) {
  if (missing.has(name)) return "missing"
  if (composed.has(name)) return "composed"
  return "implemented"
}

const contractCoverage = computed(() => Object.entries(coverage))
</script>

<template>
  <PageHeader title="组件全集" description="Quasar 组件、组合模式、指令与插件的交互式示例。" />
  <q-card bordered class="q-mb-lg">
    <q-card-section>
      <div class="text-subtitle1 text-weight-medium">组件索引</div>
      <div class="row q-gutter-xs q-mt-md">
        <q-chip v-for="name in anchors" :key="name" clickable dense tag="a" :href="`#${slug(name)}`" :color="status(name) === 'missing' ? 'grey-6' : status(name) === 'composed' ? 'warning' : undefined" :text-color="status(name) === 'implemented' ? undefined : 'white'">
          {{ name }}<q-tooltip>{{ status(name) }}</q-tooltip>
        </q-chip>
      </div>
      <div class="row q-gutter-md q-mt-md text-caption"><span><q-badge color="positive">implemented</q-badge></span><span><q-badge color="warning">composed</q-badge></span><span><q-badge color="grey-6">missing</q-badge></span></div>
    </q-card-section>
  </q-card>

  <q-card v-for="section in sections" :key="section.title" bordered class="q-mb-lg">
    <q-card-section><div class="text-h5">{{ section.title }}</div></q-card-section>
    <q-card-section><component :is="section.component" /></q-card-section>
  </q-card>

  <q-card id="coverage" bordered class="q-mb-lg">
    <q-card-section><div class="text-h5">Contract coverage</div><div class="text-caption text-grey-7">状态来自 src/coverage.ts，由 sync-gallery.mjs 同步。</div></q-card-section>
    <div class="table-scroll"><q-markup-table dense flat separator="cell"><thead><tr><th>组件</th><th>状态</th></tr></thead><tbody><tr v-for="[name, value] in contractCoverage" :key="name"><td>{{ name }}</td><td><q-badge :color="value === 'implemented' ? 'positive' : value === 'composed' ? 'warning' : 'grey-6'">{{ value }}</q-badge></td></tr></tbody></q-markup-table></div>
  </q-card>

</template>
