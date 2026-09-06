<script lang="ts">
export const wideDemos = ["Transfer", "Calendar", "Menu", "Table", "DataGrid", "Form", "Layout", "Navbar", "Steps", "Button", "Input", "Select", "Progress", "Tabs", "Pagination", "Descriptions", "Carousel", "Upload", "Alert", "Card", "Grid", "Resizable"]
</script>
<script setup lang="ts">
import { ref } from "vue"
import { message, notification, theme } from "ant-design-vue"
import { Icon } from "./shared"
defineProps<{ name: string }>()
const open = ref(false)
const drawerPlacement = ref<"top" | "right" | "bottom" | "left">("right")
const sizes = ["small", "middle", "large"] as const
const sizeLabel: Record<string, string> = { small: "小", middle: "中", large: "大" }
const buttonTypes = ["primary", "default", "dashed", "text", "link"] as const
const cascaderOptions = [{ value: "a", label: "选项 A", children: [{ value: "b", label: "选项 B" }] }]
const transferData = [{ key: "1", title: "项目一" }, { key: "2", title: "项目二" }, { key: "3", title: "项目三" }]
const transferKeys = ref(["2"])
const backTopBox = ref<HTMLElement>()
const imageSrc = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140"><rect width="240" height="140" rx="12" fill="#e6f4ff"/><circle cx="72" cy="58" r="22" fill="#1677ff"/><path d="M20 120l52-44 40 30 36-24 72 38z" fill="#91caff"/></svg>')}`
const { token } = theme.useToken()
function backTopTarget() { return backTopBox.value ?? window }
function openDrawer(placement: typeof drawerPlacement.value) { drawerPlacement.value = placement; open.value = true }
</script>
<template>
  <template v-if="name === 'Typography'"><a-typography-title :level="4">标题与正文</a-typography-title><a-typography-paragraph>Ant Design Vue 官方默认排版。</a-typography-paragraph><a-typography-paragraph><a-typography-text type="secondary">次要文本</a-typography-text> · <a-typography-text disabled>禁用文本</a-typography-text> · <a-typography-text mark>标记</a-typography-text> · <a-typography-text strong>加粗</a-typography-text></a-typography-paragraph><a-typography-text code>const value = true</a-typography-text></template>
  <template v-else-if="name === 'Button'"><div class="demo-stack"><div v-for="size in sizes" :key="size" class="demo-row"><a-button v-for="type in buttonTypes" :key="type" :type="type" :size="size">{{ sizeLabel[size] }}·{{ type }}</a-button><a-button :size="size" danger>危险</a-button><a-button :size="size" loading>加载中</a-button><a-button :size="size" disabled>禁用</a-button></div></div></template>
  <template v-else-if="name === 'ButtonGroup'"><div class="demo-stack"><a-button-group v-for="size in sizes" :key="size" :size="size"><a-button>左</a-button><a-button>中</a-button><a-button disabled>右</a-button></a-button-group></div></template>
  <template v-else-if="name === 'IconButton'"><div class="demo-row"><a-button v-for="size in sizes" :key="size" :size="size" shape="circle" type="primary"><template #icon><Icon name="plus" :size="16" /></template></a-button><a-button shape="circle"><template #icon><Icon name="search" :size="16" /></template></a-button><a-button shape="circle" loading /><a-button shape="circle" disabled><template #icon><Icon name="bell" :size="16" /></template></a-button></div></template>
  <template v-else-if="['Input', 'CommandPalette'].includes(name)"><div class="demo-stack"><a-input v-for="size in sizes" :key="size" :size="size" :placeholder="`${sizeLabel[size]}尺寸 · 前缀与清除`" allow-clear><template #prefix><Icon name="search" /></template></a-input><a-input-password placeholder="密码" /><a-input-search placeholder="搜索" enter-button /><a-input placeholder="禁用" disabled /><a-input placeholder="错误状态" status="error" /></div></template>
  <template v-else-if="name === 'Textarea'"><div class="demo-stack"><a-textarea show-count :maxlength="100" :rows="3" placeholder="请输入内容" /><a-textarea :rows="2" placeholder="禁用" disabled /><a-textarea :rows="2" placeholder="错误状态" status="error" /></div></template>
  <template v-else-if="name === 'NumberInput'"><div class="demo-stack"><a-input-number v-for="size in sizes" :key="size" :size="size" style="width:100%" :min="0" :max="100" :default-value="size.length" /><a-input-number style="width:100%" :default-value="8" disabled /><a-input-number style="width:100%" status="error" /></div></template>
  <template v-else-if="['Select', 'Combobox'].includes(name)"><div class="demo-stack"><a-select v-for="size in sizes" :key="size" :size="size" show-search style="width:100%" :placeholder="`${sizeLabel[size]}尺寸`"><a-select-option value="one">选项一</a-select-option><a-select-option value="two">选项二</a-select-option></a-select><a-select style="width:100%" default-value="one" disabled><a-select-option value="one">禁用</a-select-option></a-select><a-select style="width:100%" loading placeholder="加载中" /><a-select style="width:100%" status="error" placeholder="错误状态" /></div></template>
  <template v-else-if="name === 'MultiSelect'"><div class="demo-stack"><a-select mode="multiple" style="width:100%" :default-value="['one']"><a-select-option value="one">选项一</a-select-option><a-select-option value="two">选项二</a-select-option></a-select><a-select mode="tags" style="width:100%" placeholder="标签输入" /><a-select mode="multiple" style="width:100%" :default-value="['one']" disabled><a-select-option value="one">禁用</a-select-option></a-select></div></template>
  <template v-else-if="name === 'Autocomplete'"><div class="demo-stack"><a-auto-complete style="width:100%" placeholder="自动完成" :options="[{ value: 'acme.dev' }, { value: 'acme.io' }]" /><a-auto-complete style="width:100%" placeholder="禁用" disabled /></div></template>
  <template v-else-if="name === 'Checkbox'"><div class="demo-row"><a-checkbox>未选</a-checkbox><a-checkbox checked>选中</a-checkbox><a-checkbox indeterminate>半选</a-checkbox><a-checkbox disabled>禁用</a-checkbox><a-checkbox checked disabled>禁用选中</a-checkbox></div></template>
  <template v-else-if="name === 'Radio'"><div class="demo-stack"><a-radio-group default-value="a"><a-radio value="a">选项 A</a-radio><a-radio value="b">选项 B</a-radio><a-radio value="c" disabled>禁用</a-radio></a-radio-group><a-radio-group v-for="size in sizes" :key="size" :size="size" default-value="a" button-style="solid"><a-radio-button value="a">{{ sizeLabel[size] }}</a-radio-button><a-radio-button value="b">按钮</a-radio-button><a-radio-button value="c" disabled>禁用</a-radio-button></a-radio-group></div></template>
  <template v-else-if="name === 'Switch'"><div class="demo-row"><a-switch checked /><a-switch /><a-switch size="small" checked /><a-switch loading checked /><a-switch disabled /><a-switch checked-children="开" un-checked-children="关" /></div></template>
  <template v-else-if="name === 'Slider'"><div class="demo-stack"><a-slider :default-value="30" /><a-slider range :default-value="[20, 80]" /><a-slider :default-value="50" disabled /></div></template>
  <template v-else-if="name === 'Rating'"><div class="demo-stack"><a-rate :default-value="3" /><a-rate :default-value="2.5" allow-half /><a-rate :default-value="4" disabled /></div></template>
  <template v-else-if="name === 'DatePicker'"><div class="demo-stack"><a-date-picker v-for="size in sizes" :key="size" :size="size" style="width:100%" :placeholder="`${sizeLabel[size]}尺寸`" /><a-date-picker style="width:100%" disabled placeholder="禁用" /><a-date-picker style="width:100%" status="error" placeholder="错误状态" /></div></template>
  <template v-else-if="name === 'TimePicker'"><div class="demo-stack"><a-time-picker style="width:100%" /><a-time-picker style="width:100%" disabled placeholder="禁用" /></div></template>
  <template v-else-if="name === 'DateRangePicker'"><div class="demo-stack"><a-range-picker style="width:100%" /><a-range-picker style="width:100%" disabled /></div></template>
  <template v-else-if="name === 'ColorPicker'"><div class="demo-row"><a-input type="color" style="width:96px" aria-label="颜色选择器（composed）" /><a-input type="color" style="width:96px" disabled aria-label="颜色选择器（禁用）" /></div></template>
  <template v-else-if="name === 'Upload'"><div class="demo-stack"><a-upload-dragger class="upload-demo" :show-upload-list="false"><p>拖拽上传</p></a-upload-dragger><div class="demo-row"><a-upload :show-upload-list="false"><a-button><Icon name="upload" :size="16" />选择文件</a-button></a-upload><a-upload disabled :show-upload-list="false"><a-button disabled>禁用</a-button></a-upload></div></div></template>
  <template v-else-if="name === 'Cascader'"><div class="demo-stack"><a-cascader style="width:100%" :options="cascaderOptions" placeholder="级联选择" /><a-cascader style="width:100%" :options="cascaderOptions" placeholder="禁用" disabled /></div></template>
  <template v-else-if="name === 'Transfer'"><a-transfer v-model:target-keys="transferKeys" class="transfer-demo" :data-source="transferData" :render="(item: { title: string }) => item.title" :titles="['来源', '目标']" /></template>
  <template v-else-if="name === 'Mention'"><div class="demo-stack"><a-mentions placeholder="@ 提及成员" :options="[{ value: 'lin', label: '林晓' }, { value: 'wang', label: '王子涵' }]" /><a-mentions placeholder="禁用" disabled /></div></template>
  <template v-else-if="name === 'PinInput'"><div class="demo-stack"><div class="demo-row pin-row"><a-input v-for="i in 6" :key="i" maxlength="1" class="pin-cell" :aria-label="`验证码第 ${i} 位`" /></div><div class="demo-row pin-row"><a-input v-for="i in 6" :key="i" maxlength="1" class="pin-cell" disabled :aria-label="`禁用验证码第 ${i} 位`" /></div></div></template>
  <template v-else-if="name === 'Form'"><div class="demo-stack"><a-form layout="inline"><a-form-item label="内联"><a-input placeholder="名称" /></a-form-item><a-form-item><a-button type="primary">提交</a-button></a-form-item></a-form><a-form layout="horizontal" :label-col="{ span: 6 }"><a-form-item label="水平" required><a-input placeholder="必填" /></a-form-item><a-form-item label="校验" validate-status="error" help="请输入有效邮箱"><a-input placeholder="错误" /></a-form-item></a-form><a-form layout="vertical"><a-form-item label="垂直" help="字段级帮助文案"><a-input placeholder="名称" /></a-form-item></a-form></div></template>
  <template v-else-if="name === 'Table' || name === 'DataGrid'"><a-table :data-source="[{ key: 1, name: '林晓', status: '在线' }, { key: 2, name: '王子涵', status: '离线' }]" :pagination="false" :row-selection="{}" size="small"><a-table-column title="姓名" data-index="name" sorter /><a-table-column title="状态" data-index="status"><template #default="{ record }"><a-tag :color="record.status === '在线' ? 'success' : 'default'">{{ record.status }}</a-tag></template></a-table-column></a-table></template>
  <template v-else-if="name === 'Descriptions'"><a-descriptions bordered :column="1" size="small"><a-descriptions-item label="状态">正常</a-descriptions-item><a-descriptions-item label="更新时间">刚刚</a-descriptions-item></a-descriptions></template>
  <template v-else-if="name === 'List'"><a-list bordered size="small" :data-source="['项目一', '项目二']"><template #renderItem="{ item }"><a-list-item>{{ item }}</a-list-item></template></a-list></template>
  <template v-else-if="name === 'Card'"><div class="demo-stack"><a-card title="卡片标题" size="small">默认卡片</a-card><a-card size="small" hoverable :bordered="false">无边框 · hoverable</a-card><a-card size="small" loading>加载中</a-card></div></template>
  <template v-else-if="name === 'Avatar'"><div class="demo-row"><a-avatar size="small">林</a-avatar><a-avatar>林</a-avatar><a-avatar size="large">林</a-avatar><a-avatar shape="square">王</a-avatar><a-avatar><template #icon><Icon name="user" :size="18" /></template></a-avatar></div></template>
  <template v-else-if="name === 'AvatarGroup'"><a-avatar-group :max-count="3"><a-avatar>林</a-avatar><a-avatar>王</a-avatar><a-avatar>陈</a-avatar><a-avatar>M</a-avatar><a-avatar>A</a-avatar></a-avatar-group></template>
  <template v-else-if="name === 'Badge'"><div class="demo-row"><a-badge count="5"><a-avatar shape="square" /></a-badge><a-badge dot><a-avatar shape="square" /></a-badge><a-badge :count="120" :overflow-count="99"><a-avatar shape="square" /></a-badge><a-badge status="success" text="成功" /><a-badge status="processing" text="进行中" /><a-badge status="error" text="错误" /></div></template>
  <template v-else-if="name === 'Tag'"><div class="demo-row"><a-tag>默认</a-tag><a-tag color="success">成功</a-tag><a-tag color="processing">处理中</a-tag><a-tag color="warning">警告</a-tag><a-tag color="error">错误</a-tag><a-tag closable>可关闭</a-tag><a-tag color="processing" :bordered="false">无边框</a-tag><a-checkable-tag checked>可选</a-checkable-tag></div></template>
  <template v-else-if="name === 'Statistic'"><div class="demo-row"><a-statistic title="收入" prefix="¥" :value="128430" /><a-statistic title="增长" suffix="%" :value="12.5" :precision="1" /><a-statistic title="加载中" :value="0" loading /></div></template>
  <template v-else-if="name === 'Timeline'"><a-timeline><a-timeline-item>项目创建</a-timeline-item><a-timeline-item color="green">完成配置</a-timeline-item><a-timeline-item color="red">检测到错误</a-timeline-item><a-timeline-item pending>进行中…</a-timeline-item></a-timeline></template>
  <template v-else-if="name === 'Tree'"><a-tree checkable default-expand-all :tree-data="[{ title: '工作区', key: '0', children: [{ title: '项目', key: '0-0' }, { title: '禁用', key: '0-1', disabled: true }] }]" /></template>
  <template v-else-if="name === 'Calendar'"><a-calendar :fullscreen="false" class="calendar-demo" /></template>
  <template v-else-if="name === 'Image'"><div class="demo-row"><a-image :width="120" :src="imageSrc" alt="占位示意图（可预览）" /><a-image :width="120" :src="imageSrc" alt="占位示意图（不可预览）" :preview="false" /></div></template>
  <template v-else-if="name === 'Carousel'"><div class="carousel-wrap"><a-carousel :dots="true" autoplay effect="fade"><div v-for="i in 3" :key="i" class="carousel-slide">Slide {{ i }}</div></a-carousel></div></template>
  <template v-else-if="name === 'Empty'"><div class="demo-stack"><a-empty /><a-empty :image="undefined" description="简洁空态" :image-style="{ height: '40px' }" /></div></template>
  <template v-else-if="name === 'Tooltip'"><div class="demo-row"><a-tooltip title="提示内容"><a-button>悬停查看</a-button></a-tooltip><a-tooltip title="始终显示" :open="true" placement="right"><a-tag>open</a-tag></a-tooltip></div></template>
  <template v-else-if="name === 'Popover'"><a-popover title="标题" content="Popover 内容"><a-button>打开</a-button></a-popover></template>
  <template v-else-if="name === 'QRCode'"><div class="demo-row"><a-qrcode value="https://acme.dev" :size="96" :color="token.colorText" :bg-color="token.colorBgContainer" /><a-qrcode value="https://acme.dev" :size="96" status="loading" :color="token.colorText" :bg-color="token.colorBgContainer" /><a-qrcode value="https://acme.dev" :size="96" status="expired" :color="token.colorText" :bg-color="token.colorBgContainer" /></div></template>
  <template v-else-if="name === 'Segmented'"><div class="demo-stack"><a-segmented v-for="size in sizes" :key="size" :size="size" :options="['日', '周', '月']" /><a-segmented :options="['日', '周', '月']" disabled /></div></template>
  <template v-else-if="name === 'Alert'"><div class="demo-stack"><a-alert message="信息" description="信息描述文案。" type="info" show-icon /><a-alert message="成功" type="success" show-icon /><a-alert message="警告" type="warning" show-icon closable /><a-alert message="错误" type="error" show-icon><template #action><a-button size="small" danger>重试</a-button></template></a-alert></div></template>
  <template v-else-if="name === 'Toast'"><div class="demo-row"><a-button @click="message.success('操作成功')">成功</a-button><a-button @click="message.info('信息提示')">信息</a-button><a-button @click="message.warning('注意')">警告</a-button><a-button danger @click="message.error('操作失败')">错误</a-button><a-button @click="message.loading('加载中…', 1.5)">加载</a-button></div></template>
  <template v-else-if="name === 'Notification'"><div class="demo-row"><a-button @click="notification.info({ message: '通知', description: '有一条新通知' })">信息</a-button><a-button @click="notification.success({ message: '成功', description: '同步完成' })">成功</a-button><a-button @click="notification.warning({ message: '警告', description: '配额即将耗尽' })">警告</a-button><a-button danger @click="notification.error({ message: '错误', description: '同步失败' })">错误</a-button></div></template>
  <template v-else-if="name === 'Dialog'"><a-button @click="open = true">打开 Modal</a-button><a-modal v-model:open="open" title="对话框">内容</a-modal></template>
  <template v-else-if="name === 'Drawer'"><div class="demo-row"><a-button v-for="placement in ['top', 'right', 'bottom', 'left'] as const" :key="placement" @click="openDrawer(placement)">{{ placement }}</a-button></div><a-drawer v-model:open="open" :placement="drawerPlacement" title="抽屉">内容</a-drawer></template>
  <template v-else-if="name === 'Progress'"><div class="demo-stack"><a-progress :percent="68" /><a-progress :percent="100" /><a-progress :percent="45" status="exception" /><div class="demo-row"><a-progress type="circle" :percent="68" :size="72" /><a-progress type="dashboard" :percent="68" :size="72" /><a-progress :percent="40" :steps="5" /></div></div></template>
  <template v-else-if="name === 'Skeleton'"><div class="demo-stack"><a-skeleton active avatar /><a-skeleton-button active /><a-skeleton-input active /></div></template>
  <template v-else-if="name === 'Spinner'"><div class="demo-row"><a-spin size="small" /><a-spin /><a-spin size="large" /><a-spin tip="加载中…"><div class="spin-target" /></a-spin></div></template>
  <template v-else-if="name === 'Result'"><a-result status="success" title="完成" sub-title="操作已成功执行。" /></template>
  <template v-else-if="name === 'Popconfirm'"><div class="demo-row"><a-popconfirm title="确定吗？"><a-button>删除</a-button></a-popconfirm><a-popconfirm title="确定发布？" ok-text="发布"><a-button type="primary">发布</a-button></a-popconfirm></div></template>
  <template v-else-if="name === 'Menu'"><div class="demo-stack"><a-menu mode="horizontal" :selected-keys="['one']"><a-menu-item key="one">菜单一</a-menu-item><a-menu-item key="two">菜单二</a-menu-item><a-sub-menu key="more" title="更多"><a-menu-item key="three">菜单三</a-menu-item></a-sub-menu></a-menu><a-menu mode="inline" :selected-keys="['one']" :open-keys="['group']" class="inline-menu-demo"><a-sub-menu key="group" title="内嵌分组"><a-menu-item key="one">菜单一</a-menu-item><a-menu-item key="two" disabled>禁用项</a-menu-item></a-sub-menu></a-menu><a-menu mode="inline" inline-collapsed :selected-keys="['one']" class="collapsed-menu-demo"><a-menu-item key="one"><template #icon><Icon name="home" :size="16" /></template>折叠</a-menu-item></a-menu></div></template>
  <template v-else-if="name === 'Dropdown'"><div class="demo-row"><a-dropdown><a-button>下拉菜单</a-button><template #overlay><a-menu><a-menu-item>编辑</a-menu-item><a-menu-item danger>删除</a-menu-item></a-menu></template></a-dropdown><a-dropdown-button>操作<template #overlay><a-menu><a-menu-item>编辑</a-menu-item></a-menu></template></a-dropdown-button><a-dropdown disabled><a-button disabled>禁用</a-button><template #overlay><a-menu /></template></a-dropdown></div></template>
  <template v-else-if="name === 'Breadcrumb'"><a-breadcrumb><a-breadcrumb-item>首页</a-breadcrumb-item><a-breadcrumb-item>组件</a-breadcrumb-item><a-breadcrumb-item>面包屑</a-breadcrumb-item></a-breadcrumb></template>
  <template v-else-if="name === 'Tabs'"><div class="demo-stack"><a-tabs><a-tab-pane key="a" tab="概览">线型 Tabs</a-tab-pane><a-tab-pane key="b" tab="详情">详情内容</a-tab-pane><a-tab-pane key="c" tab="禁用" disabled /></a-tabs><a-tabs type="card" size="small"><a-tab-pane key="a" tab="卡片">卡片 Tabs</a-tab-pane><a-tab-pane key="b" tab="第二页">内容</a-tab-pane></a-tabs></div></template>
  <template v-else-if="name === 'Pagination'"><div class="demo-stack"><a-pagination :total="50" show-size-changer /><a-pagination :total="50" size="small" simple /><a-pagination :total="50" disabled /></div></template>
  <template v-else-if="name === 'Steps'"><div class="demo-stack"><a-steps :current="1" :items="[{ title: '完成' }, { title: '进行中' }, { title: '待办' }]" /><a-steps :current="1" size="small" status="error" :items="[{ title: '完成' }, { title: '出错' }, { title: '待办' }]" /></div></template>
  <template v-else-if="name === 'Anchor'"><a-anchor :affix="false"><a-anchor-link href="#component-Anchor" title="锚点一" /><a-anchor-link href="#component-BackTop" title="锚点二" /></a-anchor></template>
  <template v-else-if="name === 'BackTop'"><div class="demo-frame back-top-demo"><div ref="backTopBox" class="scroll-demo back-top-scroll">向下滚动此区域后显示回到顶部按钮。<br />第二行<br />第三行<br />第四行<br />第五行<br />第六行<br />第七行<br />第八行</div><a-back-top :target="backTopTarget" :visibility-height="0" :style="{ right: '16px', bottom: '16px' }" /></div></template>
  <template v-else-if="name === 'Affix'"><a-affix :offset-top="72"><a-button>Affix（吸顶）</a-button></a-affix></template>
  <template v-else-if="name === 'Navbar'"><div class="nav-demo"><b>Navbar（composed）</b><a-menu mode="horizontal" :selected-keys="['a']" class="nav-demo-menu"><a-menu-item key="a">首页</a-menu-item><a-menu-item key="b">产品</a-menu-item></a-menu><a-button type="primary">操作</a-button></div></template>
  <template v-else-if="name === 'Sidebar'"><a-menu theme="dark" mode="inline" :selected-keys="['one']"><a-menu-item key="one"><template #icon><Icon name="home" :size="16" /></template>侧栏</a-menu-item><a-menu-item key="two"><template #icon><Icon name="settings" :size="16" /></template>设置</a-menu-item></a-menu></template>
  <template v-else-if="name === 'Grid'"><a-row :gutter="[8, 8]"><a-col v-for="i in 3" :key="i" :xs="24" :sm="8"><a-card size="small">Col {{ i }}</a-card></a-col></a-row></template>
  <template v-else-if="name === 'Stack'"><a-space direction="vertical"><a-tag>Space（垂直）</a-tag><a-tag>composed</a-tag></a-space></template>
  <template v-else-if="name === 'Layout'"><a-layout class="layout-demo"><a-layout-header>Header</a-layout-header><a-layout><a-layout-sider width="80">Sider</a-layout-sider><a-layout-content>Content</a-layout-content></a-layout><a-layout-footer>Footer</a-layout-footer></a-layout></template>
  <template v-else-if="name === 'Container'"><div class="container-demo">Container（composed）</div></template>
  <template v-else-if="name === 'AspectRatio'"><div class="ratio-demo">16:9（composed）</div></template>
  <template v-else-if="name === 'Resizable'"><a-row><a-col :span="12"><a-card size="small">左面板</a-card></a-col><a-col :span="12"><a-card size="small">右面板</a-card></a-col></a-row></template>
  <template v-else-if="name === 'ScrollArea'"><div class="scroll-demo">ScrollArea（composed）<br />滚动查看更多内容<br />滚动查看更多内容<br />滚动查看更多内容<br />滚动查看更多内容</div></template>
  <template v-else-if="name === 'Accordion'"><a-collapse accordion :default-active-key="['1']"><a-collapse-panel key="1" header="Accordion 项目一">内容</a-collapse-panel><a-collapse-panel key="2" header="Accordion 项目二">内容</a-collapse-panel><a-collapse-panel key="3" header="禁用项" disabled>内容</a-collapse-panel></a-collapse></template>
  <template v-else-if="name === 'ThemeProvider'"><div class="demo-row"><a-tag color="processing">ConfigProvider · 当前主题</a-tag><a-config-provider :theme="{ token: { colorPrimary: '#722ed1' } }"><a-button type="primary">主色示例</a-button></a-config-provider></div></template>
  <template v-else-if="name === 'Watermark'"><a-watermark content="Acme Console"><div class="placeholder">Watermark</div></a-watermark></template>
  <template v-else-if="name === 'Tour'"><a-button @click="open = true">启动 Tour</a-button><a-tour :open="open" :steps="[{ title: '欢迎', description: 'Ant Design Vue Tour 引导示例。' }]" @close="open = false" /></template>
  <template v-else-if="name === 'FloatButton'"><div class="demo-frame"><a-float-button :style="{ right: '16px', bottom: '16px' }" /><a-float-button type="primary" :style="{ right: '72px', bottom: '16px' }"><template #icon><Icon name="plus" :size="18" /></template></a-float-button></div></template>
  <template v-else-if="name === 'Kbd'"><div class="demo-row"><kbd>⌘ K</kbd><kbd>Ctrl</kbd> + <kbd>S</kbd></div></template>
  <template v-else-if="name === 'Code'"><a-typography-text code>const code = true</a-typography-text></template>
  <template v-else-if="name === 'Divider'"><a-divider>Divider</a-divider><a-divider dashed /><span>左 <a-divider type="vertical" /> 右</span></template>
  <template v-else-if="name === 'Link'"><div class="demo-row"><a-typography-link href="#component-Link">链接组件</a-typography-link><a-typography-link disabled>禁用链接</a-typography-link></div></template>
  <a-card v-else size="small">组合示例：{{ name }}</a-card>
</template>
<style scoped>
.carousel-wrap { width: 100%; display: block; min-width: 0; overflow: hidden; }
.carousel-wrap :deep(.slick-list) { overflow: hidden; }
.carousel-wrap :deep(.slick-slide) { width: 100%; }
.carousel-slide { height: 80px; line-height: 80px; text-align: center; background: var(--app-color-primary); color: var(--app-color-white); }
.ratio-demo { aspect-ratio: 16/9; display: grid; place-items: center; background: var(--app-color-fill-quaternary); }
.container-demo { max-width: 640px; margin: auto; padding: 20px; border: 1px dashed var(--app-color-border); }
.scroll-demo { height: 90px; overflow: auto; border: 1px solid var(--app-color-border); padding: 12px; }
.back-top-demo { height: 120px; }
.back-top-scroll { height: 100%; border: 0; }
.nav-demo { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--app-color-border); }
.nav-demo-menu { flex: 1; min-width: 160px; border-bottom: 0; }
.layout-demo :deep(.ant-layout-header) { color: var(--app-color-white); text-align: center; }
.layout-demo :deep(.ant-layout-header) { height: 40px; line-height: 40px; }
.layout-demo :deep(.ant-layout-footer) { padding: 8px; }
.layout-demo :deep(.ant-layout-sider) { color: var(--app-color-white); text-align: center; line-height: 56px; }
.layout-demo :deep(.ant-layout-content) { padding: 16px; text-align: center; }
.inline-menu-demo, .collapsed-menu-demo { border-inline-end: 0 !important; }
.collapsed-menu-demo { width: 80px; }
.pin-row { flex-wrap: nowrap; }
.pin-cell { width: 40px; min-width: 0; padding-inline: 0; text-align: center; }
.upload-demo :deep(.ant-upload-drag) { height: auto; }
.upload-demo :deep(.ant-upload-btn) { padding: 12px 8px; }
.transfer-demo { flex-wrap: wrap; }
.transfer-demo :deep(.ant-transfer-list) { flex: 1 1 140px; min-width: 0; height: 200px; }
.calendar-demo { max-width: 100%; }
.spin-target { width: 96px; height: 48px; background: var(--app-color-fill-quaternary); border-radius: 8px; }
kbd { padding: 4px 8px; border: 1px solid var(--app-color-border); border-radius: 4px; }
</style>
