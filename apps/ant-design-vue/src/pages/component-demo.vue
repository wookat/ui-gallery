<script setup lang="ts">
import { ref } from "vue"
import { message, notification } from "ant-design-vue"
import { Icon } from "./shared"
defineProps<{ name: string }>()
const open = ref(false)
</script>
<template>
  <template v-if="name === 'Typography'"><a-typography-title :level="4">标题与正文</a-typography-title><a-typography-paragraph>Ant Design Vue 官方默认排版。</a-typography-paragraph><a-typography-text code>const value = true</a-typography-text></template>
  <template v-else-if="name === 'Button'"><a-space wrap><a-button type="primary">主要按钮</a-button><a-button>默认按钮</a-button><a-button type="dashed">虚线</a-button><a-button type="text">文本</a-button><a-button type="link">链接</a-button><a-button danger>危险</a-button><a-button loading>加载中</a-button><a-button disabled>禁用</a-button></a-space></template>
  <template v-else-if="['Input', 'CommandPalette'].includes(name)"><a-space direction="vertical" block><a-input placeholder="前缀与清除" allow-clear><template #prefix><Icon name="search" /></template></a-input><a-input-password placeholder="密码" /><a-input-search placeholder="搜索" /></a-space></template>
  <template v-else-if="name === 'Textarea'"><a-textarea show-count :maxlength="100" :rows="3" placeholder="请输入内容" /></template>
  <template v-else-if="name === 'NumberInput'"><a-input-number style="width:100%" :min="0" :max="100" /></template>
  <template v-else-if="['Select', 'Combobox'].includes(name)"><a-select show-search style="width:100%" placeholder="请选择"><a-select-option value="one">选项一</a-select-option><a-select-option value="two">选项二</a-select-option></a-select></template>
  <template v-else-if="name === 'MultiSelect'"><a-select mode="multiple" style="width:100%" :default-value="['one']"><a-select-option value="one">选项一</a-select-option><a-select-option value="two">选项二</a-select-option></a-select></template>
  <template v-else-if="name === 'Autocomplete'"><a-auto-complete style="width:100%" placeholder="自动完成" /></template>
  <template v-else-if="name === 'Checkbox'"><a-space><a-checkbox checked>选中</a-checkbox><a-checkbox indeterminate>半选</a-checkbox><a-checkbox disabled>禁用</a-checkbox></a-space></template>
  <template v-else-if="name === 'Radio'"><a-radio-group default-value="a"><a-radio value="a">选项 A</a-radio><a-radio value="b">选项 B</a-radio></a-radio-group></template>
  <template v-else-if="name === 'Switch'"><a-switch checked /></template>
  <template v-else-if="name === 'Slider'"><a-slider range :default-value="[20, 80]" /></template>
  <template v-else-if="name === 'Rating'"><a-rate :default-value="3" /></template>
  <template v-else-if="name === 'DatePicker'"><a-date-picker /></template>
  <template v-else-if="name === 'TimePicker'"><a-time-picker /></template>
  <template v-else-if="name === 'DateRangePicker'"><a-range-picker /></template>
  <template v-else-if="name === 'ColorPicker'"><a-input type="color" aria-label="颜色选择器（composed）" /></template>
  <template v-else-if="name === 'Upload'"><a-upload-dragger><p>拖拽上传</p></a-upload-dragger></template>
  <template v-else-if="name === 'Cascader'"><a-cascader :options="[{ value: 'a', label: '选项 A', children: [{ value: 'b', label: '选项 B' }] }]" placeholder="级联选择" /></template>
  <template v-else-if="name === 'Transfer'"><a-transfer :data-source="[{ key: '1', title: '项目一' }, { key: '2', title: '项目二' }]" /></template>
  <template v-else-if="name === 'Mention'"><a-mentions placeholder="@ 提及成员" /></template>
  <template v-else-if="name === 'PinInput'"><a-space><a-input v-for="i in 6" :key="i" maxlength="1" style="width:38px" /></a-space></template>
  <template v-else-if="name === 'Form'"><a-form layout="inline"><a-form-item label="名称"><a-input /></a-form-item><a-button type="primary">提交</a-button></a-form></template>
  <template v-else-if="name === 'Table' || name === 'DataGrid'"><a-table :data-source="[{ key: 1, name: '林晓', status: '在线' }, { key: 2, name: '王子涵', status: '离线' }]" :pagination="false"><a-table-column title="姓名" data-index="name" /><a-table-column title="状态" data-index="status" /></a-table></template>
  <template v-else-if="name === 'Descriptions'"><a-descriptions bordered :column="1"><a-descriptions-item label="状态">正常</a-descriptions-item><a-descriptions-item label="更新时间">刚刚</a-descriptions-item></a-descriptions></template>
  <template v-else-if="name === 'List'"><a-list bordered :data-source="['项目一', '项目二']"><template #renderItem="{ item }"><a-list-item>{{ item }}</a-list-item></template></a-list></template>
  <template v-else-if="name === 'Card'"><a-card title="卡片标题">卡片内容</a-card></template>
  <template v-else-if="name === 'Avatar'"><a-avatar>林</a-avatar></template>
  <template v-else-if="name === 'AvatarGroup'"><a-avatar-group><a-avatar>林</a-avatar><a-avatar>王</a-avatar><a-avatar>+3</a-avatar></a-avatar-group></template>
  <template v-else-if="name === 'Badge'"><a-badge count="5"><a-avatar shape="square" /></a-badge></template>
  <template v-else-if="name === 'Tag'"><a-space wrap><a-tag>默认</a-tag><a-tag color="success">成功</a-tag><a-tag color="error">错误</a-tag></a-space></template>
  <template v-else-if="name === 'Statistic'"><a-statistic title="收入" prefix="¥" :value="128430" /></template>
  <template v-else-if="name === 'Timeline'"><a-timeline><a-timeline-item>项目创建</a-timeline-item><a-timeline-item>完成配置</a-timeline-item></a-timeline></template>
  <template v-else-if="name === 'Tree'"><a-tree :tree-data="[{ title: '工作区', key: '0', children: [{ title: '项目', key: '0-0' }] }]" /></template>
  <template v-else-if="name === 'Calendar'"><a-calendar :fullscreen="false" /></template>
  <template v-else-if="name === 'Image'"><a-image width="120" src="https://dummyimage.com/240x140/1677ff/fff&text=Image" /></template>
  <template v-else-if="name === 'Carousel'"><a-carousel autoplay><div v-for="i in 3" :key="i" class="carousel-slide">Slide {{ i }}</div></a-carousel></template>
  <template v-else-if="name === 'Empty'"><a-empty /></template>
  <template v-else-if="name === 'Tooltip'"><a-tooltip title="提示内容"><a-button>悬停查看</a-button></a-tooltip></template>
  <template v-else-if="name === 'Popover'"><a-popover title="标题" content="Popover 内容"><a-button>打开</a-button></a-popover></template>
  <template v-else-if="name === 'QRCode'"><a-qrcode value="https://acme.dev" /></template>
  <template v-else-if="name === 'Segmented'"><a-segmented :options="['日', '周', '月']" /></template>
  <template v-else-if="name === 'Alert'"><a-space direction="vertical" block><a-alert message="信息" type="info" /><a-alert message="成功" type="success" /><a-alert message="警告" type="warning" /><a-alert message="错误" type="error" /></a-space></template>
  <template v-else-if="name === 'Toast'"><a-button @click="message.success('操作成功')">触发 Toast</a-button></template>
  <template v-else-if="name === 'Notification'"><a-button @click="notification.info({ message: '通知', description: '有一条新通知' })">触发 Notification</a-button></template>
  <template v-else-if="name === 'Dialog'"><a-button @click="open = true">打开 Modal</a-button><a-modal v-model:open="open" title="对话框">内容</a-modal></template>
  <template v-else-if="name === 'Drawer'"><a-button @click="open = true">打开 Drawer</a-button><a-drawer v-model:open="open" title="抽屉">内容</a-drawer></template>
  <template v-else-if="name === 'Progress'"><a-space><a-progress :percent="68" /><a-progress type="circle" :percent="68" /><a-progress :percent="40" :steps="5" /></a-space></template>
  <template v-else-if="name === 'Skeleton'"><a-skeleton active /></template>
  <template v-else-if="name === 'Spinner'"><a-spin spinning /></template>
  <template v-else-if="name === 'Result'"><a-result status="success" title="完成" /></template>
  <template v-else-if="name === 'Popconfirm'"><a-popconfirm title="确定吗？"><a-button>删除</a-button></a-popconfirm></template>
  <template v-else-if="name === 'Menu'"><a-menu mode="horizontal" :selected-keys="['one']"><a-menu-item key="one">菜单一</a-menu-item><a-menu-item key="two">菜单二</a-menu-item></a-menu></template>
  <template v-else-if="name === 'Dropdown'"><a-dropdown><a-button>下拉菜单</a-button><template #overlay><a-menu><a-menu-item>编辑</a-menu-item></a-menu></template></a-dropdown></template>
  <template v-else-if="name === 'Breadcrumb'"><a-breadcrumb><a-breadcrumb-item>首页</a-breadcrumb-item><a-breadcrumb-item>组件</a-breadcrumb-item></a-breadcrumb></template>
  <template v-else-if="name === 'Tabs'"><a-tabs><a-tab-pane key="a" tab="概览">概览内容</a-tab-pane><a-tab-pane key="b" tab="详情">详情内容</a-tab-pane></a-tabs></template>
  <template v-else-if="name === 'Pagination'"><a-pagination :total="50" show-size-changer /></template>
  <template v-else-if="name === 'Steps'"><a-steps :current="1"><a-step title="完成" /><a-step title="进行中" /><a-step title="待办" /></a-steps></template>
  <template v-else-if="name === 'Anchor'"><a-anchor><a-anchor-link href="#anchor-one" title="锚点一" /><a-anchor-link href="#anchor-two" title="锚点二" /></a-anchor></template>
  <template v-else-if="name === 'BackTop'"><a-back-top /></template>
  <template v-else-if="name === 'Affix'"><a-affix :offset-top="10"><a-button>Affix</a-button></a-affix></template>
  <template v-else-if="name === 'Navbar'"><div class="nav-demo"><b>Navbar（composed）</b><a-button>操作</a-button></div></template>
  <template v-else-if="name === 'Sidebar'"><a-menu theme="dark"><a-menu-item key="one">侧栏</a-menu-item></a-menu></template>
  <template v-else-if="name === 'Grid'"><a-row :gutter="8"><a-col :span="8"><a-card>Grid</a-card></a-col><a-col :span="8"><a-card>Grid</a-card></a-col><a-col :span="8"><a-card>Grid</a-card></a-col></a-row></template>
  <template v-else-if="name === 'Stack'"><a-space direction="vertical"><a-tag>Stack</a-tag><a-tag>composed</a-tag></a-space></template>
  <template v-else-if="name === 'Layout'"><a-layout><a-layout-header>Header</a-layout-header><a-layout-content>Content</a-layout-content></a-layout></template>
  <template v-else-if="name === 'Container'"><div class="container-demo">Container（composed）</div></template>
  <template v-else-if="name === 'AspectRatio'"><div class="ratio-demo">16:9（composed）</div></template>
  <template v-else-if="name === 'Resizable'"><a-row><a-col :span="12"><a-card>左面板</a-card></a-col><a-col :span="12"><a-card>右面板</a-card></a-col></a-row></template>
  <template v-else-if="name === 'ScrollArea'"><div class="scroll-demo">ScrollArea（composed）<br />滚动查看更多内容<br />滚动查看更多内容</div></template>
  <template v-else-if="name === 'Accordion'"><a-collapse><a-collapse-panel key="1" header="Accordion 项目">内容</a-collapse-panel></a-collapse></template>
  <template v-else-if="name === 'ThemeProvider'"><a-tag>ConfigProvider 暗色主题示例</a-tag></template>
  <template v-else-if="name === 'Watermark'"><a-watermark content="Acme Console"><div class="placeholder">Watermark</div></a-watermark></template>
  <template v-else-if="name === 'Tour'"><a-button @click="message.info('Tour 已准备')">启动 Tour</a-button></template>
  <template v-else-if="name === 'FloatButton'"><a-float-button /></template>
  <template v-else-if="name === 'Kbd'"><kbd>⌘ K</kbd></template>
  <template v-else-if="name === 'Code'"><a-typography-text code>const code = true</a-typography-text></template>
  <template v-else-if="name === 'Divider'"><a-divider>Divider</a-divider></template>
  <template v-else-if="name === 'Link'"><a-typography-link href="#">链接组件</a-typography-link></template>
  <a-card v-else>组合示例：{{ name }}</a-card>
</template>
<style scoped>.carousel-slide { height: 80px; display:grid; place-items:center; background:var(--app-color-primary); color:var(--app-color-white); }.ratio-demo { aspect-ratio:16/9; display:grid; place-items:center; background:var(--app-color-fill-quaternary); }.container-demo { max-width:640px; margin:auto; padding:20px; border:1px dashed var(--app-color-border); }.scroll-demo { height:90px; overflow:auto; border:1px solid var(--app-color-border); padding:12px; }.nav-demo { display:flex; justify-content:space-between; padding:12px; border:1px solid var(--app-color-border); }kbd { padding:4px 8px; border:1px solid var(--app-color-border); border-radius:4px; }</style>
