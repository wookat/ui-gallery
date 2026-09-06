<script setup lang="ts">
import { computed, ref } from "vue"
import { useTheme } from "vuetify"
import { coverage } from "@/coverage"
import Icon from "@/components/Icon.vue"
import { resolveIcon, type IconName } from "@/icons"
import { useIconSet } from "@/composables/settings"
import nav from "@ui-gallery/spec/mock/nav.json"
import landing from "@ui-gallery/spec/mock/landing.json"

type DrawerLocation = "start" | "end" | "top" | "bottom"
type PaletteItem = { title: string; subtitle?: string; to?: string }

const sections = [
  { title: "排版", items: ["Typography", "Kbd", "Code", "Divider", "Link"] },
  { title: "按钮", items: ["Button", "ButtonGroup", "IconButton"] },
  { title: "表单控件", items: ["Input", "Textarea", "NumberInput", "Select", "MultiSelect", "Combobox", "Autocomplete", "Checkbox", "Radio", "Switch", "Slider", "Rating", "DatePicker", "TimePicker", "DateRangePicker", "ColorPicker", "Upload", "Cascader", "Transfer", "Mention", "PinInput", "Form"] },
  { title: "数据展示", items: ["Table", "DataGrid", "Descriptions", "List", "Card", "Avatar", "AvatarGroup", "Badge", "Tag", "Statistic", "Timeline", "Tree", "Calendar", "Image", "Carousel", "Empty", "Tooltip", "Popover", "QRCode", "Segmented"] },
  { title: "反馈", items: ["Alert", "Toast", "Notification", "Dialog", "Drawer", "Progress", "Skeleton", "Spinner", "Result", "Popconfirm"] },
  { title: "导航", items: ["Menu", "Dropdown", "Breadcrumb", "Tabs", "Pagination", "Steps", "Anchor", "BackTop", "Affix", "Navbar", "Sidebar", "CommandPalette"] },
  { title: "布局", items: ["Grid", "Stack", "Layout", "Container", "AspectRatio", "Resizable", "ScrollArea", "Accordion"] },
  { title: "其他", items: ["ThemeProvider", "Watermark", "Tour", "FloatButton"] },
]
const anchors = computed(() => sections.flatMap((section) => section.items))
const theme = useTheme()
const iconSet = useIconSet()
const dialogBasic = ref(false)
const dialogConfirm = ref(false)
const dialogFullscreen = ref(false)
const dialogScrollable = ref(false)
const drawer = ref(false)
const drawerLocation = ref<DrawerLocation>("start")
const palette = ref(false)
const toastInfo = ref(false)
const toastSuccess = ref(false)
const toastWarning = ref(false)
const toastError = ref(false)
const notificationInfo = ref(false)
const notificationSuccess = ref(false)
const notificationWarning = ref(false)
const notificationError = ref(false)
const selectedTab = ref("one")
const imageSrc = `${import.meta.env.BASE_URL}preview.svg`
const paletteItems: PaletteItem[] = nav.map((item) => ({ title: item.label, subtitle: item.path, to: item.path }))
const successChipColor = computed(() => theme.global.current.value.dark ? "success" : "success-darken-2")
const emptyIcon = computed(() => resolveIcon("inbox", iconSet.value))
const resultIcon = computed(() => resolveIcon("check-circle", iconSet.value))
const transferLeft = ref(["设计稿", "数据字典", "会议记录"])
const transferRight = ref(["需求文档"])
const transfer = () => {
  const item = transferLeft.value.shift()
  if (item) transferRight.value.push(item)
}
const missing = new Set(["QRCode", "Resizable", "Watermark", "Tour"])
const faqAnswers = landing.faq.map((item) => item.a)
function backToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}
function openDrawer(location: DrawerLocation) {
  drawerLocation.value = location
  drawer.value = true
}
function closeToast(color: string) {
  if (color === "info") toastInfo.value = false
  if (color === "success") toastSuccess.value = false
  if (color === "warning") toastWarning.value = false
  if (color === "error") toastError.value = false
}
function closeNotification(color: string) {
  if (color === "info") notificationInfo.value = false
  if (color === "success") notificationSuccess.value = false
  if (color === "warning") notificationWarning.value = false
  if (color === "error") notificationError.value = false
}
</script>

<template>
  <div>
    <div class="d-flex align-start justify-space-between flex-wrap ga-3 mb-5">
      <div><h1 class="text-h5 text-sm-h4">组件全集</h1><p class="text-body-2 text-medium-emphasis mt-1">Vuetify 组件与组合模式参考。</p></div>
      <v-btn color="primary" @click="toastSuccess = true">触发提示</v-btn>
    </div>
    <nav class="d-flex flex-wrap ga-2 mb-6">
      <v-btn v-for="item in anchors" :key="item" :href="`#sec-${item}`" size="small" variant="outlined" rounded="pill">{{ item }}</v-btn>
    </nav>
    <section v-for="section in sections" :key="section.title" class="mb-8">
      <h2 class="text-h6 mb-3">{{ section.title }}</h2>
      <v-row>
        <v-col v-for="name in section.items" :id="`sec-${name}`" :key="name" cols="12" md="6" xl="4">
          <v-card :title="name" :subtitle="coverage[name as keyof typeof coverage]">
            <v-card-text>
              <v-alert v-if="missing.has(name)" type="info" variant="tonal" density="compact">Vuetify 无此组件，使用说明占位。</v-alert>
              <template v-else-if="name === 'Typography'"><h1 class="text-h4">标题一级</h1><h3 class="text-h6">标题三级</h3><p>正文内容与 <a href="#sec-Link">链接</a> 示例。</p><blockquote class="border-s-sm ps-4 text-medium-emphasis">这是引用文本示例。</blockquote></template>
              <template v-else-if="name === 'Kbd'"><p>按 <v-kbd>Ctrl</v-kbd> + <v-kbd>K</v-kbd> 打开搜索</p></template>
              <template v-else-if="name === 'Code'"><p>使用 <v-code>pnpm install</v-code> 安装依赖</p></template>
              <template v-else-if="name === 'Divider'"><v-divider class="my-3" /><v-divider class="my-3">或</v-divider><div class="d-flex" style="height:40px"><span>左</span><v-divider vertical class="mx-3" /><span>右</span></div></template>
              <template v-else-if="name === 'Link'"><p><a href="#sec-Button" class="text-primary">默认链接</a> · <a href="#sec-Table" class="text-primary text-decoration-underline">下划线链接</a> · <v-btn variant="text" href="#sec-Tabs" class="px-1">按钮式链接</v-btn></p></template>
              <template v-else-if="name === 'Button'">
                <div class="d-flex flex-wrap ga-2"><v-btn v-for="variant in ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain']" :key="variant" :variant="variant as 'elevated'">{{ variant }}</v-btn></div>
                <div class="text-caption text-medium-emphasis mt-4 mb-1">尺寸</div>
                <div class="d-flex flex-wrap ga-2"><v-btn size="x-small">x-small</v-btn><v-btn size="small">small</v-btn><v-btn>default</v-btn><v-btn size="large">large</v-btn><v-btn size="x-large">x-large</v-btn></div>
                <div class="text-caption text-medium-emphasis mt-4 mb-1">图标按钮</div>
                <div class="d-flex flex-wrap ga-2"><v-btn v-for="icon in ['plus', 'edit', 'trash', 'settings']" :key="icon" icon variant="tonal"><Icon :name="icon as IconName" /></v-btn></div>
                <div class="d-flex flex-wrap ga-2 mt-3"><v-btn loading>loading</v-btn><v-btn disabled>disabled</v-btn></div>
              </template>
              <template v-else-if="name === 'ButtonGroup'"><v-btn-group divided><v-btn>日报</v-btn><v-btn>周报</v-btn><v-btn>月报</v-btn></v-btn-group><v-btn-toggle v-model="selectedTab" class="mt-4" mandatory><v-btn value="one">一</v-btn><v-btn value="two">二</v-btn></v-btn-toggle></template>
              <template v-else-if="name === 'IconButton'"><div class="d-flex ga-2"><v-btn v-for="icon in ['plus', 'edit', 'trash', 'settings']" :key="icon" icon variant="tonal"><Icon :name="icon as IconName" /></v-btn></div></template>
              <template v-else-if="['Input', 'Textarea', 'NumberInput'].includes(name)"><v-text-field v-if="name === 'Input'" label="输入内容" :prepend-inner-icon="resolveIcon('search', iconSet)" :append-inner-icon="resolveIcon('eye', iconSet)" clearable /><v-textarea v-else-if="name === 'Textarea'" label="多行文本" counter /><v-number-input v-else label="数字输入" control-variant="split" /></template>
              <template v-else-if="['Select', 'MultiSelect', 'Combobox', 'Autocomplete'].includes(name)"><v-select v-if="name === 'Select'" label="选择项目" :items="['选项 A', '选项 B', '选项 C']" /><v-select v-else-if="name === 'MultiSelect'" label="多选项目" :items="['Web', 'iOS', 'Android']" multiple chips /><v-combobox v-else-if="name === 'Combobox'" label="组合输入" :items="['团队', '项目']" /><v-autocomplete v-else label="自动完成" :items="['林晓', '王子涵', 'Alex Chen']" /></template>
              <template v-else-if="['Checkbox', 'Radio', 'Switch'].includes(name)"><v-checkbox v-if="name === 'Checkbox'" label="已启用" indeterminate /><v-radio-group v-else-if="name === 'Radio'" inline><v-radio label="选项 A" value="a" /><v-radio label="选项 B" value="b" /></v-radio-group><v-switch v-else label="启用通知" color="primary" /></template>
              <template v-else-if="['Slider', 'Rating'].includes(name)"><v-range-slider v-if="name === 'Slider'" :model-value="[20, 80]" thumb-label /><v-rating v-else model-value="4" hover /></template>
              <template v-else-if="['DatePicker', 'DateRangePicker', 'TimePicker', 'ColorPicker'].includes(name)"><v-date-picker v-if="name === 'DatePicker'" /><v-date-picker v-else-if="name === 'DateRangePicker'" multiple="range" /><v-time-picker v-else-if="name === 'TimePicker'" /><v-color-picker v-else /></template>
              <template v-else-if="name === 'Upload'"><v-file-upload title="拖拽上传文件" browse-text="选择文件" /></template>
              <template v-else-if="['Cascader', 'Mention'].includes(name)"><v-menu><template #activator="{ props }"><v-text-field v-bind="props" :label="name === 'Mention' ? '输入 @ 提及成员' : '选择层级'" /></template><v-list><v-list-item title="增长"><v-list-item-subtitle>分析 · 运营</v-list-item-subtitle></v-list-item><v-list-item title="产品" /></v-list></v-menu></template>
              <template v-else-if="name === 'Transfer'"><div class="d-flex align-center ga-2"><v-list density="compact" border class="flex-grow-1"><v-list-item v-for="item in transferLeft" :key="item" :title="item" /></v-list><v-btn icon variant="tonal" @click="transfer"><Icon name="arrow-right" /></v-btn><v-list density="compact" border class="flex-grow-1"><v-list-item v-for="item in transferRight" :key="item" :title="item" /></v-list></div></template>
              <template v-else-if="name === 'PinInput'"><v-otp-input length="6" /></template>
              <template v-else-if="name === 'Form'"><v-form><v-text-field label="水平表单字段" density="compact" /><v-btn color="primary">保存</v-btn></v-form></template>
              <template v-else-if="['Table', 'DataGrid'].includes(name)"><div style="overflow-x:auto"><v-table density="compact"><thead><tr><th>名称</th><th>状态</th><th>更新时间</th></tr></thead><tbody><tr><td>数据看板</td><td><v-chip size="x-small" :color="successChipColor">正常</v-chip></td><td>刚刚</td></tr><tr><td>订单导入</td><td><v-chip size="x-small">处理中</v-chip></td><td>1 小时前</td></tr></tbody></v-table></div></template>
              <template v-else-if="name === 'Descriptions'"><v-list density="compact"><v-list-item title="创建人" subtitle="林晓" /><v-list-item title="创建时间" subtitle="2026-09-05" /></v-list></template>
              <template v-else-if="['List', 'Card'].includes(name)"><v-list v-if="name === 'List'" lines="two"><v-list-item title="通知标题" subtitle="这里是一条列表内容。" /></v-list><v-card v-else variant="tonal" title="嵌套卡片" text="卡片支持标题、内容和动作区域。" /></template>
              <template v-else-if="['Avatar', 'AvatarGroup', 'Badge', 'Tag'].includes(name)"><div class="d-flex align-center ga-5"><v-avatar color="primary">A</v-avatar><v-avatar-group v-if="name === 'AvatarGroup'"><v-avatar color="primary">A</v-avatar><v-avatar color="secondary">B</v-avatar><v-avatar color="success">C</v-avatar></v-avatar-group><v-badge v-if="name === 'Badge'" content="8" color="error"><v-icon :icon="resolveIcon('bell', iconSet)" /></v-badge><v-chip v-if="name === 'Tag'" color="primary">标签</v-chip></div></template>
              <template v-else-if="name === 'Statistic'"><div class="text-overline">本月收入</div><div class="text-h4">¥128,430</div><v-chip :color="successChipColor" size="small">+12.4%</v-chip></template>
              <template v-else-if="name === 'Timeline'"><v-timeline density="compact"><v-timeline-item dot-color="primary">订单已支付</v-timeline-item><v-timeline-item dot-color="success">发货完成</v-timeline-item></v-timeline></template>
              <template v-else-if="name === 'Tree'"><v-treeview :items="[{ title: '工作区', children: [{ title: '项目' }, { title: '团队' }] }]" item-title="title" item-value="title" open-all /></template>
              <template v-else-if="name === 'Calendar'"><v-calendar type="month" /></template>
              <template v-else-if="name === 'Image'"><v-img :src="imageSrc" height="120" cover eager @click="dialogBasic = true" /></template>
              <template v-else-if="name === 'Carousel'"><v-carousel height="140" hide-delimiters><v-carousel-item><v-sheet color="primary" height="100%" class="d-flex align-center justify-center">轮播内容一</v-sheet></v-carousel-item><v-carousel-item><v-sheet color="secondary" height="100%" class="d-flex align-center justify-center">轮播内容二</v-sheet></v-carousel-item></v-carousel></template>
              <template v-else-if="name === 'Empty'"><v-empty-state :icon="emptyIcon" title="暂无内容" text="这里还没有数据。" /></template>
              <template v-else-if="name === 'Tooltip'"><v-tooltip text="这是提示"><template #activator="{ props }"><v-btn v-bind="props">悬停查看</v-btn></template></v-tooltip></template>
              <template v-else-if="name === 'Popover'"><v-menu><template #activator="{ props }"><v-btn v-bind="props">打开菜单</v-btn></template><v-card title="Popover" text="组合菜单与卡片实现。" /></v-menu></template>
              <template v-else-if="name === 'Segmented'"><v-btn-toggle mandatory><v-btn>列表</v-btn><v-btn>网格</v-btn></v-btn-toggle></template>
              <template v-else-if="name === 'Alert'"><div class="d-flex flex-column ga-2"><v-alert v-for="type in ['info', 'success', 'warning', 'error']" :key="type" :type="type as 'info'" variant="tonal" density="compact">{{ type }} 提示</v-alert></div></template>
              <template v-else-if="name === 'Toast'"><div class="d-flex flex-wrap ga-2"><v-btn color="info" @click="toastInfo = true">info</v-btn><v-btn color="success" @click="toastSuccess = true">success</v-btn><v-btn color="warning" @click="toastWarning = true">warning</v-btn><v-btn color="error" @click="toastError = true">error</v-btn></div></template>
              <template v-else-if="name === 'Notification'"><div class="d-flex flex-wrap ga-2"><v-btn color="info" @click="notificationInfo = true">info</v-btn><v-btn color="success" @click="notificationSuccess = true">success</v-btn><v-btn color="warning" @click="notificationWarning = true">warning</v-btn><v-btn color="error" @click="notificationError = true">error</v-btn></div></template>
              <template v-else-if="name === 'Dialog'"><div class="d-flex flex-wrap ga-2"><v-btn @click="dialogBasic = true">普通</v-btn><v-btn @click="dialogConfirm = true">确认</v-btn><v-btn @click="dialogFullscreen = true">全屏</v-btn><v-btn @click="dialogScrollable = true">可滚动</v-btn></div></template>
              <template v-else-if="name === 'Drawer'"><div class="d-flex flex-wrap ga-2"><v-btn @click="openDrawer('start')">左</v-btn><v-btn @click="openDrawer('end')">右</v-btn><v-btn @click="openDrawer('top')">上</v-btn><v-btn @click="openDrawer('bottom')">下</v-btn></div></template>
              <template v-else-if="name === 'Skeleton'"><v-skeleton-loader type="list-item-avatar-two-line, image" /></template>
              <template v-else-if="name === 'Spinner'"><v-progress-circular indeterminate color="primary" /></template>
              <template v-else-if="name === 'Progress'"><div class="d-flex flex-column ga-4"><v-progress-linear :model-value="68" color="primary" /><v-progress-linear indeterminate color="secondary" /><v-progress-linear :model-value="68" color="primary" striped /><div class="d-flex align-center ga-5"><v-progress-circular :model-value="68" color="primary">68%</v-progress-circular><v-progress-circular indeterminate color="secondary" /></div><v-stepper alt-labels :model-value="2"><v-stepper-header><v-stepper-item title="准备" value="1" /><v-divider /><v-stepper-item title="处理中" value="2" /><v-divider /><v-stepper-item title="完成" value="3" /></v-stepper-header></v-stepper></div></template>
              <template v-else-if="['Result', 'Popconfirm'].includes(name)"><v-empty-state v-if="name === 'Result'" :icon="resultIcon" title="操作完成" text="组合空态展示结果。" /><v-menu v-else><template #activator="{ props }"><v-btn v-bind="props" color="error">删除</v-btn></template><v-card class="pa-4" title="确认删除" text="此操作不可撤销。" /></v-menu></template>
              <template v-else-if="name === 'Menu'"><div class="d-flex flex-column ga-3"><v-toolbar density="compact" border><v-btn variant="text">编辑</v-btn><v-btn variant="text">归档</v-btn><v-btn variant="text">复制</v-btn><v-btn variant="text">删除</v-btn></v-toolbar><v-list density="compact" border><v-list-item title="编辑" /><v-list-item title="归档" /><v-list-item title="删除" /><v-list-group value="更多"><template #activator="{ props }"><v-list-item v-bind="props" title="更多" /></template><v-list-item title="设置" /></v-list-group></v-list><v-list density="compact" border width="56"><v-list-item><template #prepend><Icon name="menu" /></template></v-list-item><v-list-item><template #prepend><Icon name="settings" /></template></v-list-item></v-list></div></template>
              <template v-else-if="name === 'Dropdown'"><v-menu><template #activator="{ props }"><v-btn v-bind="props">打开菜单</v-btn></template><v-list><v-list-item title="编辑" /><v-list-item title="归档" /></v-list></v-menu></template>
              <template v-else-if="name === 'Breadcrumb'"><v-breadcrumbs :items="['首页', '工作区', '项目']" /></template>
              <template v-else-if="name === 'Tabs'"><div class="d-flex flex-column ga-4"><v-tabs v-model="selectedTab"><v-tab value="one">默认</v-tab><v-tab value="two">详情</v-tab></v-tabs><v-tabs v-model="selectedTab" align-tabs="center"><v-tab value="one">居中</v-tab><v-tab value="two">详情</v-tab></v-tabs><v-tabs v-model="selectedTab" grow><v-tab value="one">等宽</v-tab><v-tab value="two">详情</v-tab></v-tabs><v-tabs v-model="selectedTab" fixed-tabs><v-tab value="one">固定</v-tab><v-tab value="two">详情</v-tab></v-tabs><v-tabs v-model="selectedTab" direction="vertical" height="112"><v-tab value="one">垂直</v-tab><v-tab value="two">详情</v-tab></v-tabs><v-tabs v-model="selectedTab" stacked><v-tab value="one"><Icon name="home" />首页</v-tab><v-tab value="two"><Icon name="settings" />设置</v-tab></v-tabs></div></template>
              <template v-else-if="name === 'Pagination'"><v-pagination :length="4" /></template>
              <template v-else-if="name === 'Steps'"><v-stepper alt-labels><v-stepper-header><v-stepper-item title="准备" value="1" /><v-divider /><v-stepper-item title="完成" value="2" /></v-stepper-header></v-stepper></template>
              <template v-else-if="name === 'Anchor'"><div class="d-flex ga-2"><v-btn href="#sec-Button" variant="text">按钮</v-btn><v-btn href="#sec-Table" variant="text">表格</v-btn></div></template>
              <template v-else-if="name === 'BackTop'"><v-fab size="small" @click="backToTop"><Icon name="arrow-up" /></v-fab></template>
              <template v-else-if="name === 'Affix'"><v-sheet class="pa-3" border style="position: sticky; top: 8px">sticky 内容</v-sheet></template>
              <template v-else-if="name === 'Navbar'"><v-toolbar flat border density="comfortable"><v-app-bar-nav-icon /><v-toolbar-title>导航栏</v-toolbar-title><v-spacer /><v-btn icon variant="text"><Icon name="settings" /></v-btn></v-toolbar></template>
              <template v-else-if="name === 'Sidebar'"><div class="d-flex" style="min-height: 148px"><v-sheet width="140" border class="pa-2"><v-list density="compact"><v-list-item v-for="item in [{ title: '仪表盘', icon: 'home' }, { title: '订单', icon: 'shopping-cart' }, { title: '设置', icon: 'settings' }]" :key="item.title" :title="item.title"><template #prepend><Icon :name="item.icon as IconName" size="16" /></template></v-list-item></v-list></v-sheet><v-sheet class="flex-grow-1 pa-3" border><v-skeleton-loader type="text@2" /></v-sheet></div></template>
              <template v-else-if="name === 'CommandPalette'"><v-btn variant="outlined" @click="palette = true"><v-kbd class="me-2">⌘K</v-kbd>打开命令面板</v-btn></template>
              <template v-else-if="name === 'Grid'"><v-row><v-col v-for="n in 3" :key="n"><v-sheet border rounded class="pa-3">Col {{ n }}</v-sheet></v-col></v-row></template>
              <template v-else-if="name === 'Stack'"><div class="d-flex flex-column ga-2"><v-btn>垂直堆叠</v-btn><v-btn variant="tonal">间距 2</v-btn></div></template>
              <template v-else-if="name === 'Layout'"><v-sheet border><v-sheet color="surface-variant" height="32" class="px-2 d-flex align-center text-caption">Header</v-sheet><div class="d-flex" style="height:96px"><v-sheet width="96" class="pa-2 text-caption">Sider</v-sheet><v-sheet class="flex-grow-1 pa-2 text-caption">Content</v-sheet></div></v-sheet></template>
              <template v-else-if="name === 'Container'"><v-sheet border class="pa-2" style="border-style:dashed !important"><v-container><v-row><v-col v-for="n in 3" :key="n"><v-sheet color="primary" height="48" rounded /></v-col></v-row></v-container></v-sheet></template>
              <template v-else-if="name === 'AspectRatio'"><v-responsive :aspect-ratio="16 / 9" class="bg-surface-variant d-flex align-center justify-center rounded" style="max-width:320px"><div class="text-subtitle-1">16:9</div></v-responsive></template>
              <template v-else-if="name === 'ScrollArea'"><div style="height: 120px; overflow-y: auto"><p v-for="n in 8" :key="n">可滚动内容 {{ n }}</p></div></template>
              <template v-else-if="name === 'Accordion'"><v-expansion-panels><v-expansion-panel title="常见问题" text="展开后查看详情。" /></v-expansion-panels></template>
              <template v-else-if="name === 'ThemeProvider'"><v-theme-provider theme="dark"><v-sheet class="pa-4">暗色主题示例</v-sheet></v-theme-provider></template>
              <template v-else-if="name === 'FloatButton'"><v-fab size="small" color="primary"><Icon name="plus" /></v-fab></template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </section>
    <v-dialog v-model="dialogBasic" max-width="560"><v-card title="普通对话框" text="这是一个对话框示例。"><v-card-actions><v-spacer /><v-btn @click="dialogBasic = false">关闭</v-btn></v-card-actions></v-card></v-dialog>
    <v-dialog v-model="dialogConfirm" max-width="420"><v-card title="确认操作" text="此操作不可撤销。"><v-card-actions><v-spacer /><v-btn variant="text" @click="dialogConfirm = false">取消</v-btn><v-btn color="primary" @click="dialogConfirm = false">确认</v-btn></v-card-actions></v-card></v-dialog>
    <v-dialog v-model="dialogFullscreen" fullscreen><v-card title="全屏对话框"><v-card-text>这是一个全屏对话框示例。</v-card-text><v-card-actions><v-spacer /><v-btn @click="dialogFullscreen = false">关闭</v-btn></v-card-actions></v-card></v-dialog>
    <v-dialog v-model="dialogScrollable" scrollable max-width="560"><v-card title="可滚动对话框"><v-card-text><p v-for="n in 20" :key="n" class="mb-4">{{ faqAnswers[(n - 1) % faqAnswers.length] }}</p></v-card-text><v-card-actions><v-spacer /><v-btn @click="dialogScrollable = false">关闭</v-btn></v-card-actions></v-card></v-dialog>
    <v-command-palette v-model="palette" placeholder="搜索页面或命令" :items="paletteItems" />
    <v-navigation-drawer v-model="drawer" temporary :location="drawerLocation" :height="drawerLocation === 'top' || drawerLocation === 'bottom' ? 260 : undefined" :width="drawerLocation === 'start' || drawerLocation === 'end' ? 320 : undefined"><v-card title="抽屉示例" text="这是一个默认关闭的抽屉。"><v-card-actions><v-btn @click="drawer = false">关闭</v-btn></v-card-actions></v-card></v-navigation-drawer>
    <v-snackbar v-model="toastInfo" color="info" location="bottom">操作成功<template #actions><v-btn variant="text" @click="closeToast('info')">关闭</v-btn></template></v-snackbar>
    <v-snackbar v-model="toastSuccess" color="success" location="bottom">操作成功<template #actions><v-btn variant="text" @click="closeToast('success')">关闭</v-btn></template></v-snackbar>
    <v-snackbar v-model="toastWarning" color="warning" location="bottom">操作成功<template #actions><v-btn variant="text" @click="closeToast('warning')">关闭</v-btn></template></v-snackbar>
    <v-snackbar v-model="toastError" color="error" location="bottom">操作成功<template #actions><v-btn variant="text" @click="closeToast('error')">关闭</v-btn></template></v-snackbar>
    <v-snackbar v-model="notificationInfo" color="info" location="top end">操作成功<template #actions><v-btn variant="text" @click="closeNotification('info')">关闭</v-btn></template></v-snackbar>
    <v-snackbar v-model="notificationSuccess" color="success" location="top end">操作成功<template #actions><v-btn variant="text" @click="closeNotification('success')">关闭</v-btn></template></v-snackbar>
    <v-snackbar v-model="notificationWarning" color="warning" location="top end">操作成功<template #actions><v-btn variant="text" @click="closeNotification('warning')">关闭</v-btn></template></v-snackbar>
    <v-snackbar v-model="notificationError" color="error" location="top end">操作成功<template #actions><v-btn variant="text" @click="closeNotification('error')">关闭</v-btn></template></v-snackbar>
  </div>
</template>
