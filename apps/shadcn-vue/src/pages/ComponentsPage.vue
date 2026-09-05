<script setup lang="ts">
import { ref } from 'vue'
import contract from '@ui-gallery/spec/contract.json'
import PageHeader from '@/components/PageHeader.vue'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { coverage } from '@/lib/coverage'
import ComponentDemo from './ComponentDemo.vue'
import RegistryExtras from './RegistryExtras.vue'

const names = contract.components as string[]
const implemented = names.filter(name => coverage[name] !== 'missing').length
const indexExpanded = ref(false)
const descriptions: Record<string, string> = {
  Typography: '标题层级、正文与辅助说明',
  Button: '变体、尺寸、图标、加载与禁用',
  ButtonGroup: '保存与取消按钮组合',
  IconButton: '新增与设置图标按钮',
  Input: '默认、禁用、无效与前缀',
  Textarea: '多行文本输入',
  NumberInput: '带步进控制的数字输入',
  Select: '基础选项选择器',
  MultiSelect: '多选标签状态',
  Combobox: '可搜索的组合选择器',
  Autocomplete: '自动完成组合选择器',
  Checkbox: '已选择复选框',
  Radio: '单选组选项',
  Switch: '启用状态切换',
  Slider: '数值滑块',
  Rating: '星级多选评分',
  DatePicker: '日历日期选择',
  TimePicker: '日期与时间选择',
  DateRangePicker: '日历日期范围选择',
  ColorPicker: 'shadcn-vue 无此组件 · 占位',
  Upload: '文件上传与拖拽提示',
  Cascader: '级联菜单选项',
  Transfer: 'shadcn-vue 无此组件 · 占位',
  Mention: 'shadcn-vue 无此组件 · 占位',
  PinInput: '四位验证码输入',
  Form: '字段标签、输入与帮助文案',
  Table: '订单状态数据表格',
  DataGrid: '订单状态数据表格',
  Descriptions: '状态与负责人描述列表',
  List: '订单状态列表表格',
  Card: '标题、说明与内容卡片',
  Avatar: '头像组与成员计数',
  AvatarGroup: '头像组与成员计数',
  Badge: '默认、次要、描边与危险',
  Tag: '标签状态变体',
  Statistic: '收入数值与同比 Badge',
  Timeline: '项目流程时间线',
  Tree: '组合示例：Tree 占位',
  Calendar: '单日期日历',
  Image: '图片比例占位',
  Carousel: '两张卡片轮播',
  Empty: '空状态图标与提示',
  Tooltip: '悬停显示辅助内容',
  Popover: '点击打开浮层内容',
  QRCode: 'shadcn-vue 无此组件 · 占位',
  Segmented: '日、周、月分段按钮',
  Alert: '默认、危险及图标提示',
  Toast: '成功与消息通知反馈',
  Notification: '成功与消息通知反馈',
  Dialog: '标题、说明与确认对话框',
  Drawer: '侧边抽屉与输入内容',
  Progress: '百分比进度条',
  Skeleton: '两行加载骨架',
  Spinner: '加载指示器',
  Result: '操作成功结果状态',
  Popconfirm: '编辑与删除菜单确认',
  Menu: '菜单项按钮列表',
  Dropdown: '编辑与删除下拉菜单',
  Breadcrumb: '首页与设置路径',
  Tabs: '默认与线性标签页',
  Pagination: '页码、上一页与下一页',
  Steps: '完成、进行中与待办步骤',
  Anchor: '返回索引与固定操作',
  BackTop: '返回索引与固定操作',
  Affix: '返回索引与固定操作',
  Navbar: '导航栏与操作按钮',
  Sidebar: '固定高度导航侧栏',
  CommandPalette: '可搜索命令面板',
  Grid: '三列网格占位',
  Stack: '三列堆叠占位',
  Layout: '三列布局占位',
  Container: '三列容器占位',
  AspectRatio: '16:9 比例容器',
  Resizable: '可调整左右面板',
  ScrollArea: '可滚动内容区域',
  Accordion: '可展开的内容项目',
  ThemeProvider: '主题管理状态提示',
  Watermark: 'shadcn-vue 无此组件 · 占位',
  Tour: 'shadcn-vue 无此组件 · 占位',
  FloatButton: '圆形新增浮动按钮',
  Kbd: '快捷键按键提示',
  Code: '等宽代码片段',
  Divider: '分隔线',
  Link: '链接组件示例',
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="组件全集" :description="`覆盖 ${implemented}/${names.length} 个规范组件，展示 shadcn-vue 的组合能力。`" />
    <Collapsible v-model:open="indexExpanded" class="rounded-lg border bg-muted/30 p-3">
      <nav id="component-index" class="flex max-h-24 flex-wrap gap-2 overflow-hidden" :class="indexExpanded ? 'max-h-none' : ''">
        <a v-for="name in names" :key="name" :href="`#component-${name}`" class="inline-flex min-h-10 items-center rounded-full border px-3 text-xs text-muted-foreground underline-offset-4 hover:bg-muted hover:underline">{{ name }}</a>
      </nav>
      <CollapsibleContent><span class="sr-only">全部组件已展开</span></CollapsibleContent>
      <CollapsibleTrigger as-child><button class="mt-2 min-h-10 text-sm underline">{{ indexExpanded ? '收起' : '展开全部' }}</button></CollapsibleTrigger>
    </Collapsible>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card v-for="(name, index) in names" :id="`component-${name}`" :key="name" class="scroll-mt-20">
        <CardHeader>
          <div class="flex items-center justify-between gap-2">
            <CardTitle class="text-base">{{ name }}</CardTitle>
            <Badge :variant="coverage[name] === 'missing' ? 'destructive' : coverage[name] === 'composed' ? 'secondary' : 'default'">{{ coverage[name] }}</Badge>
          </div>
          <CardDescription>{{ coverage[name] === 'missing' ? 'shadcn-vue 无此组件 · 占位' : descriptions[name] }}</CardDescription>
        </CardHeader>
        <CardContent><ComponentDemo :name="name" :index="index" /></CardContent>
      </Card>
    </div>
    <RegistryExtras />
  </div>
</template>
