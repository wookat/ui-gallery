<script setup lang="ts">
import { computed, ref } from "vue"
import { coverage } from "@/coverage"
import Icon from "@/components/Icon.vue"

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
const dialog = ref(false)
const drawer = ref(false)
const snackbar = ref(false)
const imagePlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='160' viewBox='0 0 400 160'%3E%3Crect width='400' height='160' fill='%236366f1'/%3E%3Ctext x='200' y='85' fill='white' text-anchor='middle' font-size='24'%3EAcme Console%3C/text%3E%3C/svg%3E"
const selectedTab = ref("one")
const transferLeft = ref(["设计稿", "数据字典", "会议记录"])
const transferRight = ref(["需求文档"])
const transfer = () => {
  const item = transferLeft.value.shift()
  if (item) transferRight.value.push(item)
}
const missing = new Set(["QRCode", "Resizable", "Watermark", "Tour"])
function backToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}
</script>

<template>
  <div>
    <div class="d-flex align-start justify-space-between flex-wrap ga-3 mb-5"><div><h1 class="text-h5 text-sm-h4">组件全集</h1><p class="text-body-2 text-medium-emphasis mt-1">Vuetify 组件与组合模式参考。</p></div><v-btn color="primary" @click="snackbar = true">触发提示</v-btn></div>
    <v-chip-group class="mb-6" selected-class="text-primary"><v-chip v-for="item in anchors" :key="item" :href="`#sec-${item}`" size="small" variant="outlined">{{ item }}</v-chip></v-chip-group>
    <section v-for="section in sections" :key="section.title" class="mb-8">
      <h2 class="text-h6 mb-3">{{ section.title }}</h2>
      <v-row>
        <v-col v-for="name in section.items" :id="`sec-${name}`" :key="name" cols="12" md="6" xl="4">
          <v-card :title="name" :subtitle="coverage[name as keyof typeof coverage]">
            <v-card-text>
              <v-alert v-if="missing.has(name)" type="info" variant="tonal" density="compact">Vuetify 无此组件，使用说明占位。</v-alert>
              <template v-else-if="name === 'Typography'"><h1 class="text-h4">标题一级</h1><h3 class="text-h6">标题三级</h3><p>正文内容与 <a href="#sec-Link">链接</a> 示例。</p><blockquote class="border-s-sm ps-4 text-medium-emphasis">这是引用文本示例。</blockquote></template>
              <template v-else-if="name === 'Button'"><div class="d-flex flex-wrap ga-2"><v-btn v-for="variant in ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain']" :key="variant" :variant="variant as 'elevated'">{{ variant }}</v-btn></div><div class="d-flex flex-wrap ga-2 mt-3"><v-btn size="x-small">x-small</v-btn><v-btn size="small">small</v-btn><v-btn size="large">large</v-btn><v-btn loading>loading</v-btn><v-btn disabled>disabled</v-btn></div></template>
              <template v-else-if="name === 'ButtonGroup'"><v-btn-group divided><v-btn>日报</v-btn><v-btn>周报</v-btn><v-btn>月报</v-btn></v-btn-group><v-btn-toggle v-model="selectedTab" class="mt-4" mandatory><v-btn value="one">一</v-btn><v-btn value="two">二</v-btn></v-btn-toggle></template>
              <template v-else-if="name === 'IconButton'"><div class="d-flex ga-2"><v-btn v-for="icon in ['plus', 'edit', 'trash', 'settings']" :key="icon" icon variant="tonal"><Icon :name="icon as 'plus'" /></v-btn></div></template>
              <template v-else-if="['Input', 'Textarea', 'NumberInput'].includes(name)"><v-text-field v-if="name === 'Input'" label="输入内容" prepend-inner-icon="mdi-magnify" append-inner-icon="mdi-eye-outline" clearable /><v-textarea v-else-if="name === 'Textarea'" label="多行文本" counter /><v-number-input v-else label="数字输入" control-variant="split" /></template>
              <template v-else-if="['Select', 'MultiSelect', 'Combobox', 'Autocomplete'].includes(name)"><v-select v-if="name === 'Select'" label="选择项目" :items="['选项 A', '选项 B', '选项 C']" /><v-select v-else-if="name === 'MultiSelect'" label="多选项目" :items="['Web', 'iOS', 'Android']" multiple chips /><v-combobox v-else-if="name === 'Combobox'" label="组合输入" :items="['团队', '项目']" /><v-autocomplete v-else label="自动完成" :items="['林晓', '王子涵', 'Alex Chen']" /></template>
              <template v-else-if="['Checkbox', 'Radio', 'Switch'].includes(name)"><v-checkbox v-if="name === 'Checkbox'" label="已启用" indeterminate /><v-radio-group v-else-if="name === 'Radio'" inline><v-radio label="选项 A" value="a" /><v-radio label="选项 B" value="b" /></v-radio-group><v-switch v-else label="启用通知" color="primary" /></template>
              <template v-else-if="['Slider', 'Rating'].includes(name)"><v-range-slider v-if="name === 'Slider'" :model-value="[20, 80]" thumb-label /><v-rating v-else model-value="4" hover /></template>
              <template v-else-if="['DatePicker', 'DateRangePicker', 'TimePicker', 'ColorPicker'].includes(name)"><v-date-picker v-if="name === 'DatePicker'" /><v-date-picker v-else-if="name === 'DateRangePicker'" multiple="range" /><v-time-picker v-else-if="name === 'TimePicker'" /><v-color-picker v-else /></template>
              <template v-else-if="name === 'Upload'"><v-file-upload title="拖拽上传文件" browse-text="选择文件" /></template>
              <template v-else-if="['Cascader', 'Mention'].includes(name)"><v-menu><template #activator="{ props }"><v-text-field v-bind="props" :label="name === 'Mention' ? '输入 @ 提及成员' : '选择层级'" /></template><v-list><v-list-item title="增长"><v-list-item-subtitle>分析 · 运营</v-list-item-subtitle></v-list-item><v-list-item title="产品" /></v-list></v-menu></template>
              <template v-else-if="name === 'Transfer'"><div class="d-flex align-center ga-2"><v-list density="compact" border class="flex-grow-1"><v-list-item v-for="item in transferLeft" :key="item" :title="item" /></v-list><v-btn icon variant="tonal" @click="transfer"><Icon name="arrow-right" /></v-btn><v-list density="compact" border class="flex-grow-1"><v-list-item v-for="item in transferRight" :key="item" :title="item" /></v-list></div></template>
              <template v-else-if="name === 'PinInput'"><v-otp-input length="6" /></template>
              <template v-else-if="name === 'Form'"><v-form><v-text-field label="水平表单字段" density="compact" /><v-btn color="primary">保存</v-btn></v-form></template>
              <template v-else-if="['Table', 'DataGrid'].includes(name)"><div style="overflow-x:auto"><v-table density="compact"><thead><tr><th>名称</th><th>状态</th><th>更新时间</th></tr></thead><tbody><tr><td>数据看板</td><td><v-chip size="x-small" color="success">正常</v-chip></td><td>刚刚</td></tr><tr><td>订单导入</td><td><v-chip size="x-small">处理中</v-chip></td><td>1 小时前</td></tr></tbody></v-table></div></template>
              <template v-else-if="name === 'Descriptions'"><v-list density="compact"><v-list-item title="创建人" subtitle="林晓" /><v-list-item title="创建时间" subtitle="2026-09-05" /></v-list></template>
              <template v-else-if="['List', 'Card'].includes(name)"><v-list v-if="name === 'List'" lines="two"><v-list-item title="通知标题" subtitle="这里是一条列表内容。" /></v-list><v-card v-else variant="tonal" title="嵌套卡片" text="卡片支持标题、内容和动作区域。" /></template>
              <template v-else-if="['Avatar', 'AvatarGroup', 'Badge', 'Tag'].includes(name)"><div class="d-flex align-center ga-5"><v-avatar color="primary">A</v-avatar><v-avatar-group v-if="name === 'AvatarGroup'"><v-avatar color="primary">A</v-avatar><v-avatar color="secondary">B</v-avatar><v-avatar color="success">C</v-avatar></v-avatar-group><v-badge v-if="name === 'Badge'" content="8" color="error"><v-icon>mdi-bell-outline</v-icon></v-badge><v-chip v-if="name === 'Tag'" color="primary">标签</v-chip></div></template>
              <template v-else-if="name === 'Statistic'"><div class="text-overline">本月收入</div><div class="text-h4">¥128,430</div><v-chip color="success" size="small">+12.4%</v-chip></template>
              <template v-else-if="name === 'Timeline'"><v-timeline density="compact"><v-timeline-item dot-color="primary">订单已支付</v-timeline-item><v-timeline-item dot-color="success">发货完成</v-timeline-item></v-timeline></template>
              <template v-else-if="name === 'Tree'"><v-treeview :items="[{ title: '工作区', children: [{ title: '项目' }, { title: '团队' }] }]" item-title="title" item-value="title" open-all /></template>
              <template v-else-if="name === 'Calendar'"><v-calendar type="month" /></template>
              <template v-else-if="name === 'Image'"><v-img :src="imagePlaceholder" height="120" cover @click="dialog = true" /></template>
              <template v-else-if="name === 'Carousel'"><v-carousel height="140" hide-delimiters><v-carousel-item><v-sheet color="primary" height="100%" class="d-flex align-center justify-center">轮播内容一</v-sheet></v-carousel-item><v-carousel-item><v-sheet color="secondary" height="100%" class="d-flex align-center justify-center">轮播内容二</v-sheet></v-carousel-item></v-carousel></template>
              <template v-else-if="name === 'Empty'"><v-empty-state icon="mdi-inbox-outline" title="暂无内容" text="这里还没有数据。" /></template>
              <template v-else-if="name === 'Tooltip'"><v-tooltip text="这是提示"><template #activator="{ props }"><v-btn v-bind="props">悬停查看</v-btn></template></v-tooltip></template>
              <template v-else-if="name === 'Popover'"><v-menu><template #activator="{ props }"><v-btn v-bind="props">打开菜单</v-btn></template><v-card title="Popover" text="组合菜单与卡片实现。" /></v-menu></template>
              <template v-else-if="name === 'Segmented'"><v-btn-toggle mandatory><v-btn>列表</v-btn><v-btn>网格</v-btn></v-btn-toggle></template>
              <template v-else-if="name === 'Alert'"><div class="d-flex flex-column ga-2"><v-alert v-for="type in ['info', 'success', 'warning', 'error']" :key="type" :type="type as 'info'" variant="tonal" density="compact">{{ type }} 提示</v-alert></div></template>
              <template v-else-if="['Toast', 'Notification'].includes(name)"><v-btn @click="snackbar = true">显示消息</v-btn></template>
              <template v-else-if="name === 'Dialog'"><v-btn @click="dialog = true">打开对话框</v-btn></template>
              <template v-else-if="name === 'Drawer'"><v-btn @click="drawer = true">打开抽屉</v-btn></template>
              <template v-else-if="['Progress', 'Spinner'].includes(name)"><v-progress-linear v-if="name === 'Progress'" :model-value="68" color="primary" /><v-progress-circular v-else indeterminate color="primary" /></template>
              <template v-else-if="['Result', 'Popconfirm'].includes(name)"><v-empty-state v-if="name === 'Result'" icon="mdi-check-circle-outline" title="操作完成" text="组合空态展示结果。" /><v-menu v-else><template #activator="{ props }"><v-btn v-bind="props" color="error">删除</v-btn></template><v-card class="pa-4" title="确认删除" text="此操作不可撤销。" /></v-menu></template>
              <template v-else-if="['Menu', 'Dropdown'].includes(name)"><v-menu><template #activator="{ props }"><v-btn v-bind="props">打开菜单</v-btn></template><v-list><v-list-item title="编辑" /><v-list-item title="归档" /></v-list></v-menu></template>
              <template v-else-if="name === 'Breadcrumb'"><v-breadcrumbs :items="['首页', '工作区', '项目']" /></template>
              <template v-else-if="name === 'Tabs'"><v-tabs v-model="selectedTab"><v-tab value="one">概览</v-tab><v-tab value="two">详情</v-tab></v-tabs></template>
              <template v-else-if="name === 'Pagination'"><v-pagination :length="4" /></template>
              <template v-else-if="name === 'Steps'"><v-stepper alt-labels><v-stepper-header><v-stepper-item title="准备" value="1" /><v-divider /><v-stepper-item title="完成" value="2" /></v-stepper-header></v-stepper></template>
              <template v-else-if="name === 'Anchor'"><div class="d-flex ga-2"><v-btn href="#sec-Button" variant="text">按钮</v-btn><v-btn href="#sec-Table" variant="text">表格</v-btn></div></template>
              <template v-else-if="name === 'BackTop'"><v-fab icon="mdi-arrow-up" size="small" @click="backToTop" /></template>
              <template v-else-if="name === 'Affix'"><v-sheet class="pa-3" border style="position: sticky; top: 8px">sticky 内容</v-sheet></template>
              <template v-else-if="['Navbar', 'Sidebar'].includes(name)"><v-app-bar v-if="name === 'Navbar'" position="static" flat border><v-app-bar-title>导航栏</v-app-bar-title></v-app-bar><v-layout v-else style="height: 120px"><v-navigation-drawer permanent width="140"><v-list-item title="侧边栏" /></v-navigation-drawer><v-main /></v-layout></template>
              <template v-else-if="name === 'CommandPalette'"><v-command-palette /></template>
              <template v-else-if="name === 'Grid'"><v-row><v-col v-for="n in 3" :key="n"><v-sheet border rounded class="pa-3">Col {{ n }}</v-sheet></v-col></v-row></template>
              <template v-else-if="name === 'Stack'"><div class="d-flex flex-column ga-2"><v-btn>垂直堆叠</v-btn><v-btn variant="tonal">间距 2</v-btn></div></template>
              <template v-else-if="name === 'Layout'"><v-layout style="height: 100px"><v-app-bar position="static" density="compact" title="Layout" /><v-main /></v-layout></template>
              <template v-else-if="name === 'Container'"><v-container class="bg-surface-variant">容器内容</v-container></template>
              <template v-else-if="name === 'AspectRatio'"><v-responsive aspect-ratio="16/9" class="bg-surface-variant d-flex align-center justify-center">16:9</v-responsive></template>
              <template v-else-if="name === 'ScrollArea'"><div style="height: 120px; overflow-y: auto"><p v-for="n in 8" :key="n">可滚动内容 {{ n }}</p></div></template>
              <template v-else-if="name === 'Accordion'"><v-expansion-panels><v-expansion-panel title="常见问题" text="展开后查看详情。" /></v-expansion-panels></template>
              <template v-else-if="name === 'ThemeProvider'"><v-theme-provider theme="dark"><v-sheet class="pa-4">暗色主题示例</v-sheet></v-theme-provider></template>
              <template v-else-if="name === 'FloatButton'"><v-fab icon="mdi-plus" size="small" color="primary" /></template>
              <template v-else><v-sheet border rounded class="pa-4 text-medium-emphasis">组件示例</v-sheet></template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </section>
    <v-dialog v-model="dialog" max-width="560"><v-card title="预览"><v-img :src="imagePlaceholder" /><v-card-actions><v-spacer /><v-btn @click="dialog = false">关闭</v-btn></v-card-actions></v-card></v-dialog>
    <v-navigation-drawer v-model="drawer" temporary location="end"><v-card title="抽屉示例" text="这是一个默认关闭的抽屉。"><v-card-actions><v-btn @click="drawer = false">关闭</v-btn></v-card-actions></v-card></v-navigation-drawer>
    <v-snackbar v-model="snackbar" color="success">操作成功</v-snackbar>
  </div>
</template>
