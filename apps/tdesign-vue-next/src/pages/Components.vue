<script setup lang="ts">
import { computed, ref } from "vue"
import { MessagePlugin, NotifyPlugin } from "tdesign-vue-next"
import contract from "@ui-gallery/spec/contract.json"
import team from "@ui-gallery/spec/mock/team.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import nav from "@ui-gallery/spec/mock/nav.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import Icon from "@/components/Icon.vue"
import { coverage } from "@/coverage"

const components = contract.components as string[]
const libraryExtras = [
  "Comment", "Guide", "ImageViewer", "InputAdornment", "InputGroup", "RangeInput", "SelectInput", "TagInput", "TreeSelect",
  "CheckTag", "Search", "TooltipLite", "HeadMenu", "StickyTool", "TimeRangePicker", "DialogCard", "PaginationMini", "Loading(attach)",
]
const statusTheme = (name: string) =>
  coverage[name] === "missing" ? "danger" : coverage[name] === "composed" ? "warning" : "primary"

const text = ref("")
const num = ref(3)
const select = ref("team")
const multi = ref(["orders", "dashboard"])
const auto = ref("")
const checks = ref(["a"])
const radio = ref("a")
const on = ref(true)
const slider = ref(40)
const range = ref([20, 60])
const rate = ref(4)
const date = ref("")
const dateRange = ref<string[]>([])
const time = ref("")
const color = ref("#0052d9")
const cascader = ref("")
const transfer = ref<(string | number)[]>(["1"])
const pin = ref(["", "", "", "", "", ""])
const dialog = ref(false)
const drawer = ref(false)
const palette = ref(false)
const paletteQuery = ref("")
const tour = ref(-1)
const tab = ref("a")
const page = ref(1)
const segment = ref("day")
const collapse = ref<(string | number)[]>([0])
const tree = ref<string[]>([])
const selectedRows = ref<(string | number)[]>([orders[0]!.id])
const sortBy = ref<{ sortBy: string; descending: boolean } | undefined>()

const options = [
  { label: "团队", value: "team" },
  { label: "订单", value: "orders" },
  { label: "仪表盘", value: "dashboard" },
  { label: "设置", value: "settings" },
]
const autoOptions = computed(() => team.map((m) => m.name).filter((n) => n.includes(auto.value)))
const cascaderOptions = [
  { label: "华东", value: "east", children: [{ label: "上海", value: "sh" }, { label: "杭州", value: "hz" }] },
  { label: "华南", value: "south", children: [{ label: "深圳", value: "sz" }, { label: "广州", value: "gz" }] },
]
const transferData = team.slice(0, 5).map((m, i) => ({ value: String(i), label: m.name }))
const treeData = nav.map((n) => ({ label: n.label, value: n.key, children: [{ label: `${n.label} · 子项`, value: `${n.key}-child` }] }))
const paletteItems = computed(() => nav.filter((n) => n.label.includes(paletteQuery.value) || n.key.includes(paletteQuery.value)))
const columns = [
  { colKey: "row-select", type: "multiple" as const, width: 48 },
  { colKey: "id", title: "订单号", width: 120 },
  { colKey: "customer", title: "客户" },
  { colKey: "amount", title: "金额", sorter: true, width: 120 },
  { colKey: "status", title: "状态", width: 100 },
]
const rows = orders.slice(0, 4)
const statusOf: Record<string, "success" | "warning" | "danger" | "default"> = { paid: "success", pending: "warning", failed: "danger", refunded: "default" }
const statusLabel: Record<string, string> = { paid: "已支付", pending: "待支付", failed: "失败", refunded: "已退款" }

const listItems = tasks.slice(0, 3)
const toast = () => MessagePlugin.success("操作成功")
const notify = () => NotifyPlugin.info({ title: "系统通知", content: "这是一条通知消息", duration: 3000 })
</script>

<template>
  <div class="ug-page">
    <div class="ug-between">
      <div><t-typography-title level="h4" class="ug-title">组件全集</t-typography-title><span class="ug-muted">TDesign Vue Next 官方组件、contract 覆盖与组合示例。</span></div>
      <t-button variant="outline" href="#component-index">组件索引</t-button>
    </div>

    <div id="component-index" class="ug-index">
      <a v-for="name in components" :key="name" class="ug-index-item" :href="`#component-${name}`">
        {{ name }}
      </a>
    </div>

    <t-space direction="vertical" size="small" style="width: 100%">
      <t-alert theme="info" message="每张卡片展示 default / disabled / loading / error 等状态；右上角标签为 contract 覆盖状态。" />
    </t-space>

    <div class="ug-components">
      <t-card
        v-for="name in components"
        :id="`component-${name}`"
        :key="name"
        class="ug-component-card"
        :bordered="true"
        :title="name"
        :subtitle="`覆盖：${coverage[name]}`"
      >
        <template #actions><t-tag :theme="statusTheme(name)" variant="light" size="small">{{ coverage[name] }}</t-tag></template>

        <!-- Typography -->
        <div v-if="name === 'Typography'" class="ug-stack">
          <t-typography-title level="h4">标题 Title</t-typography-title>
          <t-typography-paragraph>段落文本用于描述信息，<t-typography-text strong>强调</t-typography-text>、<t-typography-text mark>标记</t-typography-text>、<t-typography-text code>code</t-typography-text>、<t-typography-text delete>删除</t-typography-text>。</t-typography-paragraph>
          <t-typography-text theme="secondary">次要说明文字</t-typography-text>
        </div>

        <div v-else-if="name === 'Button'" class="ug-stack">
          <t-space break-line>
            <t-button theme="primary">主要</t-button>
            <t-button theme="default">默认</t-button>
            <t-button variant="outline">描边</t-button>
            <t-button variant="dashed">虚线</t-button>
            <t-button variant="text">文字</t-button>
            <t-button theme="danger">危险</t-button>
          </t-space>
          <t-space break-line>
            <t-button size="small">小号</t-button>
            <t-button size="medium">中号</t-button>
            <t-button size="large">大号</t-button>
            <t-button disabled>禁用</t-button>
            <t-button loading>加载</t-button>
            <t-button ghost theme="primary">幽灵</t-button>
          </t-space>
        </div>

        <t-space v-else-if="name === 'ButtonGroup'" :size="0" class="ug-btn-group">
          <t-button variant="outline">左</t-button>
          <t-button variant="outline">中</t-button>
          <t-button variant="outline">右</t-button>
        </t-space>

        <t-space v-else-if="name === 'IconButton'" break-line>
          <t-button shape="square" variant="outline"><template #icon><Icon name="search" /></template></t-button>
          <t-button shape="circle" theme="primary"><template #icon><Icon name="plus" /></template></t-button>
          <t-button shape="square" variant="text"><template #icon><Icon name="settings" /></template></t-button>
          <t-button shape="square" variant="outline" disabled><template #icon><Icon name="trash" /></template></t-button>
          <t-button shape="square" variant="outline" loading />
        </t-space>

        <div v-else-if="name === 'Input'" class="ug-stack">
          <t-input v-model="text" placeholder="默认输入" clearable><template #prefix-icon><Icon name="search" /></template></t-input>
          <t-input size="small" placeholder="小尺寸" />
          <t-input size="large" placeholder="大尺寸" />
          <t-input disabled placeholder="禁用状态" />
          <t-input status="error" tips="邮箱格式不正确" placeholder="错误状态" />
          <t-input type="password" placeholder="密码" />
        </div>

        <div v-else-if="name === 'Textarea'" class="ug-stack">
          <t-textarea placeholder="请输入描述" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="120" />
          <t-textarea disabled placeholder="禁用" />
          <t-textarea status="error" tips="内容不能为空" />
        </div>

        <t-space v-else-if="name === 'NumberInput'" break-line>
          <t-input-number v-model="num" :min="0" :max="10" />
          <t-input-number :default-value="3" theme="column" />
          <t-input-number :default-value="1" theme="normal" size="small" />
          <t-input-number :default-value="3" disabled />
          <t-input-number :default-value="99" status="error" tips="超出范围" />
        </t-space>

        <div v-else-if="name === 'Select'" class="ug-stack">
          <t-select v-model="select" :options="options" placeholder="请选择" />
          <t-select :options="options" size="small" placeholder="小尺寸" />
          <t-select :options="options" disabled placeholder="禁用" />
          <t-select :options="options" status="error" tips="请选择模块" />
          <t-select :options="options" loading placeholder="加载中" />
        </div>

        <div v-else-if="name === 'MultiSelect'" class="ug-stack">
          <t-select v-model="multi" :options="options" multiple placeholder="多选" :min-collapsed-num="2" />
          <t-select :options="options" multiple disabled :default-value="['team']" />
        </div>

        <div v-else-if="name === 'Combobox'" class="ug-stack">
          <t-select :options="options" filterable creatable placeholder="可搜索、可创建" />
          <t-select :options="options" filterable disabled placeholder="禁用" />
        </div>

        <div v-else-if="name === 'Autocomplete'" class="ug-stack">
          <t-auto-complete v-model="auto" :options="autoOptions" placeholder="输入成员姓名" highlight-keyword />
          <t-auto-complete :options="[]" disabled placeholder="禁用" />
        </div>

        <div v-else-if="name === 'Checkbox'" class="ug-stack">
          <t-checkbox-group v-model="checks" :options="[{ label: '选项 A', value: 'a' }, { label: '选项 B', value: 'b' }, { label: '禁用', value: 'c', disabled: true }]" />
          <t-checkbox indeterminate>半选</t-checkbox>
          <t-checkbox :checked="true" disabled>已选禁用</t-checkbox>
        </div>

        <div v-else-if="name === 'Radio'" class="ug-stack">
          <t-radio-group v-model="radio" :options="[{ label: '选项 A', value: 'a' }, { label: '选项 B', value: 'b' }, { label: '禁用', value: 'c', disabled: true }]" />
          <t-radio-group :default-value="'x'" variant="default-filled" :options="[{ label: '填充', value: 'x' }, { label: '按钮', value: 'y' }]" />
        </div>

        <t-space v-else-if="name === 'Switch'" break-line>
          <t-switch v-model="on" />
          <t-switch size="small" :default-value="true" />
          <t-switch size="large" :label="['开', '关']" />
          <t-switch disabled />
          <t-switch loading :default-value="true" />
        </t-space>

        <div v-else-if="name === 'Slider'" class="ug-stack">
          <t-slider v-model="slider" />
          <t-slider v-model="range" range :marks="{ 0: '0', 50: '50', 100: '100' }" />
          <t-slider :default-value="30" disabled />
        </div>

        <t-space v-else-if="name === 'Rating'" break-line>
          <t-rate v-model="rate" allow-half show-text />
          <t-rate :default-value="3" size="16px" disabled />
          <t-rate :default-value="4" :count="6" color="var(--td-warning-color)" />
        </t-space>

        <div v-else-if="name === 'DatePicker'" class="ug-stack">
          <t-date-picker v-model="date" clearable placeholder="选择日期" />
          <t-date-picker enable-time-picker placeholder="日期时间" />
          <t-date-picker disabled placeholder="禁用" />
          <t-date-picker status="error" tips="请选择日期" />
        </div>

        <div v-else-if="name === 'TimePicker'" class="ug-stack">
          <t-time-picker v-model="time" clearable placeholder="选择时间" />
          <t-time-picker format="HH:mm" :steps="[1, 15]" placeholder="15 分钟步进" />
          <t-time-picker disabled placeholder="禁用" />
        </div>

        <div v-else-if="name === 'DateRangePicker'" class="ug-stack">
          <t-date-range-picker v-model="dateRange" clearable />
          <t-date-range-picker disabled />
        </div>

        <t-space v-else-if="name === 'ColorPicker'" break-line align="center">
          <t-color-picker v-model="color" format="HEX" :color-modes="['monochrome']" />
          <t-color-picker :default-value="'#2ba471'" disabled />
          <t-color-picker-panel :default-value="color" :swatch-colors="[]" :color-modes="['monochrome']" style="width: 100%" />
        </t-space>

        <div v-else-if="name === 'Upload'" class="ug-stack">
          <t-upload theme="file" :auto-upload="false" tips="支持 PDF / PNG，最大 10MB" />
          <t-upload theme="image" :auto-upload="false" accept="image/*" />
          <t-upload theme="custom" draggable :auto-upload="false" />
          <t-upload disabled :auto-upload="false" />
        </div>

        <div v-else-if="name === 'Cascader'" class="ug-stack">
          <t-cascader v-model="cascader" :options="cascaderOptions" clearable placeholder="选择地区" />
          <t-cascader :options="cascaderOptions" disabled placeholder="禁用" />
        </div>

        <t-transfer v-else-if="name === 'Transfer'" v-model="transfer" :data="transferData" search :title="['可选成员', '已选成员']" />

        <div v-else-if="name === 'Mention'" class="ug-missing">
          <t-empty size="small" title="TDesign Vue Next 无 Mention 组件" description="已在 gallery.json.coverage 标记为 missing" />
        </div>

        <div v-else-if="name === 'PinInput'" class="ug-stack">
          <div class="ug-pin">
            <t-input v-for="(_, i) in pin" :key="i" v-model="pin[i]" :maxlength="1" align="center" />
          </div>
          <t-typography-text theme="secondary" class="ug-small">由 6 个 t-input 组合而成（composed）</t-typography-text>
        </div>

        <t-form v-else-if="name === 'Form'" label-align="top" :data="{}" :colon="true">
          <t-form-item label="项目名称" name="name" help="2-20 个字符" :required-mark="true">
            <t-input placeholder="请输入" />
          </t-form-item>
          <t-form-item label="邮箱" name="email" status="error" tips="邮箱格式不正确"><t-input status="error" /></t-form-item>
          <t-form-item label="禁用项"><t-input disabled placeholder="不可编辑" /></t-form-item>
          <t-form-item><t-space><t-button theme="primary">提交</t-button><t-button variant="outline">重置</t-button></t-space></t-form-item>
        </t-form>

        <div v-else-if="name === 'Table'" class="ug-stack">
          <t-base-table row-key="id" :data="rows" :columns="columns.slice(1)" size="small" stripe bordered />
          <t-base-table row-key="id" :data="[]" :columns="columns.slice(1)" size="small" />
          <t-base-table row-key="id" :data="rows.slice(0, 2)" :columns="columns.slice(1)" size="small" loading />
        </div>

        <div v-else-if="name === 'DataGrid'" class="ug-stack">
          <t-enhanced-table
            v-model:selected-row-keys="selectedRows"
            v-model:sort="sortBy"
            row-key="id"
            :data="rows"
            :columns="columns"
            size="small"
            hover
            resizable
            :pagination="{ total: orders.length, pageSize: 4, current: 1, showJumper: false, theme: 'simple' }"
          >
            <template #status="{ row }"><t-tag :theme="statusOf[row.status]" variant="light" size="small">{{ statusLabel[row.status] }}</t-tag></template>
          </t-enhanced-table>
        </div>

        <t-descriptions v-else-if="name === 'Descriptions'" :column="2" bordered size="small" item-layout="horizontal">
          <t-descriptions-item label="订单号">{{ rows[0]!.id }}</t-descriptions-item>
          <t-descriptions-item label="客户">{{ rows[0]!.customer }}</t-descriptions-item>
          <t-descriptions-item label="产品">{{ rows[0]!.product }}</t-descriptions-item>
          <t-descriptions-item label="金额">¥{{ rows[0]!.amount.toFixed(2) }}</t-descriptions-item>
        </t-descriptions>

        <t-list v-else-if="name === 'List'" size="small" split>
          <t-list-item v-for="t in listItems" :key="t.title">
            <t-list-item-meta :title="t.title" :description="`负责人 ${t.owner}`" />
            <template #action><t-tag size="small" variant="light">{{ t.progress }}%</t-tag></template>
          </t-list-item>
        </t-list>

        <div v-else-if="name === 'Card'" class="ug-stack">
          <t-card title="带标题的卡片" subtitle="副标题" bordered hover-shadow :header-bordered="true">
            <template #actions><t-link theme="primary" hover="color">更多</t-link></template>
            卡片内容区域，可承载任意内容。
            <template #footer><t-space><t-button size="small" variant="text">操作一</t-button><t-button size="small" variant="text">操作二</t-button></t-space></template>
          </t-card>
          <t-card :bordered="true" shadow size="small">紧凑卡片（small + shadow）</t-card>
        </div>

        <t-space v-else-if="name === 'Avatar'" break-line align="center">
          <t-avatar size="small">S</t-avatar>
          <t-avatar>{{ team[0]!.name.slice(0, 1) }}</t-avatar>
          <t-avatar size="large" shape="round"><template #icon><Icon name="user" /></template></t-avatar>
          <t-avatar size="large" shape="circle" style="background: var(--td-brand-color)">大</t-avatar>
        </t-space>

        <t-avatar-group v-else-if="name === 'AvatarGroup'" :max="3" cascading="right-up">
          <t-avatar v-for="m in team.slice(0, 5)" :key="m.email">{{ m.name.slice(0, 1) }}</t-avatar>
        </t-avatar-group>

        <t-space v-else-if="name === 'Badge'" break-line :size="24">
          <t-badge :count="5"><t-button variant="outline">消息</t-button></t-badge>
          <t-badge :count="120" :max-count="99"><t-button variant="outline">通知</t-button></t-badge>
          <t-badge dot><t-button variant="outline">更新</t-button></t-badge>
          <t-badge count="NEW" shape="round" color="var(--td-success-color)"><t-button variant="outline">功能</t-button></t-badge>
        </t-space>

        <div v-else-if="name === 'Tag'" class="ug-stack">
          <t-space break-line>
            <t-tag>默认</t-tag>
            <t-tag theme="primary">主要</t-tag>
            <t-tag theme="success" variant="light">成功</t-tag>
            <t-tag theme="warning" variant="outline">警告</t-tag>
            <t-tag theme="danger" variant="light-outline">危险</t-tag>
            <t-tag closable>可关闭</t-tag>
            <t-tag disabled>禁用</t-tag>
          </t-space>
          <t-space break-line>
            <t-tag size="small">小</t-tag>
            <t-tag size="medium" shape="round">圆角</t-tag>
            <t-tag size="large" shape="mark">标记</t-tag>
            <t-check-tag :default-checked="true">可选中</t-check-tag>
          </t-space>
        </div>

        <t-space v-else-if="name === 'Statistic'" break-line :size="32">
          <t-statistic title="总收入" :value="128430" prefix="¥" :decimal-places="0" trend="increase" />
          <t-statistic title="转化率" :value="3.2" unit="%" trend="decrease" color="red" />
          <t-statistic title="活跃用户" :value="9821" loading />
        </t-space>

        <t-timeline v-else-if="name === 'Timeline'" mode="same" theme="dot">
          <t-timeline-item label="09:00" dot-color="primary">订单创建</t-timeline-item>
          <t-timeline-item label="09:20" dot-color="success">支付成功</t-timeline-item>
          <t-timeline-item label="10:05" dot-color="warning">等待发货</t-timeline-item>
          <t-timeline-item label="—" dot-color="default">已签收</t-timeline-item>
        </t-timeline>

        <t-tree v-else-if="name === 'Tree'" v-model="tree" :data="treeData" checkable expand-all hover line activable />

        <t-calendar v-else-if="name === 'Calendar'" theme="card" :controller-config="{ mode: { visible: false }, weekend: { visible: false } }" />

        <t-space v-else-if="name === 'Image'" break-line>
          <t-image src="" :style="{ width: '96px', height: '96px' }" fit="cover" shape="round" :error="undefined">
            <template #error><Icon name="image" :size="24" /></template>
          </t-image>
          <t-image src="" :style="{ width: '96px', height: '96px' }" shape="circle" loading="lazy">
            <template #loading><t-loading size="small" /></template>
          </t-image>
          <t-image :src="undefined" :style="{ width: '96px', height: '96px' }" shape="square" :overlay-content="undefined" />
        </t-space>

        <t-swiper v-else-if="name === 'Carousel'" :duration="300" :interval="4000" navigation-position="bottom" :height="140">
          <t-swiper-item v-for="(t, i) in listItems" :key="i">
            <div class="ug-slide">{{ t.title }}</div>
          </t-swiper-item>
        </t-swiper>

        <t-empty v-else-if="name === 'Empty'" title="暂无数据" description="尝试调整筛选条件">
          <template #action><t-button size="small" theme="primary">新建</t-button></template>
        </t-empty>

        <t-space v-else-if="name === 'Tooltip'" break-line>
          <t-tooltip content="默认提示"><t-button variant="outline">悬停</t-button></t-tooltip>
          <t-tooltip content="浅色主题" theme="light" placement="bottom"><t-button variant="outline">浅色</t-button></t-tooltip>
          <t-tooltip content="始终显示" :visible="true" placement="right"><t-button variant="outline" size="small">常显</t-button></t-tooltip>
        </t-space>

        <t-popup v-else-if="name === 'Popover'" trigger="click" placement="bottom-left" show-arrow>
          <t-button variant="outline">点击打开 Popup</t-button>
          <template #content>
            <div class="ug-popover">
              <t-typography-title level="h6" class="ug-title">通知偏好</t-typography-title>
              <t-typography-text theme="secondary" class="ug-small">选择接收渠道</t-typography-text>
              <t-checkbox-group :default-value="['email']" :options="[{ label: '邮件', value: 'email' }, { label: '短信', value: 'sms' }]" />
            </div>
          </template>
        </t-popup>

        <t-space v-else-if="name === 'QRCode'" break-line align="center">
          <t-qrcode value="/apps/tdesign-vue-next" :size="96" />
          <t-qrcode value="/apps/tdesign-vue-next" :size="96" level="H" type="svg" status="loading" />
          <t-qrcode value="/apps/tdesign-vue-next" :size="96" status="expired" />
        </t-space>

        <div v-else-if="name === 'Segmented'" class="ug-stack">
          <t-radio-group v-model="segment" variant="default-filled" :options="[{ label: '日', value: 'day' }, { label: '周', value: 'week' }, { label: '月', value: 'month' }]" />
          <t-radio-group :default-value="'a'" variant="primary-filled" size="small" :options="[{ label: '列表', value: 'a' }, { label: '看板', value: 'b' }]" />
          <t-radio-group :default-value="'a'" variant="default-filled" disabled :options="[{ label: '禁用', value: 'a' }, { label: '状态', value: 'b' }]" />
        </div>

        <div v-else-if="name === 'Alert'" class="ug-stack">
          <t-alert theme="info" message="信息提示：数据每 5 分钟同步一次。" />
          <t-alert theme="success" title="成功" message="配置已保存。" close />
          <t-alert theme="warning" message="警告：存储空间即将用尽。" />
          <t-alert theme="error" title="错误" message="无法连接服务器，请稍后重试。"><template #operation><t-link theme="primary">重试</t-link></template></t-alert>
        </div>

        <t-space v-else-if="name === 'Toast'" break-line>
          <t-button variant="outline" @click="toast">触发 Message</t-button>
          <t-message theme="success" :close-btn="true">内联成功消息</t-message>
          <t-message theme="warning">内联警告</t-message>
          <t-message theme="loading">加载中</t-message>
        </t-space>

        <t-space v-else-if="name === 'Notification'" break-line>
          <t-button variant="outline" @click="notify">触发 Notification</t-button>
          <t-notification theme="info" title="内联通知" content="用于展示系统级消息。" :close-btn="true" />
        </t-space>

        <div v-else-if="name === 'Dialog'" class="ug-stack">
          <t-button variant="outline" @click="dialog = true">打开对话框</t-button>
          <t-dialog v-model:visible="dialog" header="确认删除" theme="warning" body="删除后无法恢复，确定继续吗？" confirm-btn="确认" cancel-btn="取消" @confirm="dialog = false" />
          <t-dialog-card header="内联 DialogCard" theme="info" body="用于在页面内嵌入对话框样式。" :cancel-btn="null" confirm-btn="知道了" />
        </div>

        <div v-else-if="name === 'Drawer'" class="ug-stack">
          <t-button variant="outline" @click="drawer = true">打开抽屉</t-button>
          <t-drawer v-model:visible="drawer" header="抽屉标题" size="360px" placement="right" :footer="true">
            <t-typography-paragraph>抽屉内容区域。</t-typography-paragraph>
          </t-drawer>
        </div>

        <div v-else-if="name === 'Progress'" class="ug-stack">
          <t-progress :percentage="30" />
          <t-progress :percentage="66" status="warning" theme="line" size="small" />
          <t-progress :percentage="100" status="success" />
          <t-progress :percentage="40" status="error" />
          <t-space><t-progress theme="circle" :percentage="72" size="small" /><t-progress theme="plump" :percentage="55" /></t-space>
        </div>

        <div v-else-if="name === 'Skeleton'" class="ug-stack">
          <t-skeleton theme="paragraph" animation="gradient" />
          <t-skeleton theme="avatar-text" animation="flashed" />
          <t-skeleton theme="tab" />
        </div>

        <t-space v-else-if="name === 'Spinner'" break-line align="center" :size="24">
          <t-loading size="small" />
          <t-loading size="medium" text="加载中..." />
          <t-loading size="large" />
          <t-loading :loading="true" text="内容加载中" style="width: 120px; height: 60px" show-overlay><div style="height: 60px" /></t-loading>
        </t-space>

        <div v-else-if="name === 'Result'" class="ug-stack">
          <div class="ug-result ug-result--success">
            <Icon name="check-circle" :size="32" />
            <t-typography-title level="h6" class="ug-title">提交成功</t-typography-title>
            <t-typography-text theme="secondary" class="ug-small">由 Icon + Typography + Button 组合（composed）</t-typography-text>
            <t-button size="small" theme="primary">返回首页</t-button>
          </div>
          <div class="ug-result ug-result--error">
            <Icon name="alert-circle" :size="32" />
            <t-typography-title level="h6" class="ug-title">提交失败</t-typography-title>
            <t-button size="small" variant="outline">重试</t-button>
          </div>
        </div>

        <t-space v-else-if="name === 'Popconfirm'" break-line>
          <t-popconfirm content="确定删除该记录？" theme="danger"><t-button theme="danger" variant="outline">删除</t-button></t-popconfirm>
          <t-popconfirm content="确定归档？" theme="warning"><t-button variant="outline">归档</t-button></t-popconfirm>
          <t-popconfirm content="确定发布？" theme="default"><t-button variant="outline">发布</t-button></t-popconfirm>
        </t-space>

        <t-menu v-else-if="name === 'Menu'" :default-value="nav[0]!.key" theme="light" width="100%" class="ug-menu-demo">
          <t-menu-item v-for="n in nav.slice(0, 3)" :key="n.key" :value="n.key"><template #icon><Icon :name="n.icon" /></template>{{ n.label }}</t-menu-item>
          <t-submenu value="more" title="更多">
            <template #icon><Icon name="more-horizontal" /></template>
            <t-menu-item v-for="n in nav.slice(3, 5)" :key="n.key" :value="n.key">{{ n.label }}</t-menu-item>
          </t-submenu>
          <t-menu-item value="disabled" disabled>禁用项</t-menu-item>
        </t-menu>

        <t-space v-else-if="name === 'Dropdown'" break-line>
          <t-dropdown :options="options.map((o) => ({ content: o.label, value: o.value }))" trigger="click">
            <t-button variant="outline">点击展开<template #suffix><Icon name="chevron-down" /></template></t-button>
          </t-dropdown>
          <t-dropdown :options="[{ content: '编辑', value: 1 }, { content: '删除', value: 2, theme: 'error' }, { content: '禁用', value: 3, disabled: true }]" trigger="hover">
            <t-button variant="text">悬停展开</t-button>
          </t-dropdown>
        </t-space>

        <t-breadcrumb v-else-if="name === 'Breadcrumb'" :max-item-width="'120px'">
          <t-breadcrumb-item><Icon name="home" /></t-breadcrumb-item>
          <t-breadcrumb-item>订单管理</t-breadcrumb-item>
          <t-breadcrumb-item disabled>禁用层级</t-breadcrumb-item>
          <t-breadcrumb-item>{{ rows[0]!.id }}</t-breadcrumb-item>
        </t-breadcrumb>

        <div v-else-if="name === 'Tabs'" class="ug-stack">
          <t-tabs v-model="tab" theme="normal">
            <t-tab-panel value="a" label="概览">概览内容</t-tab-panel>
            <t-tab-panel value="b" label="详情">详情内容</t-tab-panel>
            <t-tab-panel value="c" label="禁用" disabled>—</t-tab-panel>
          </t-tabs>
          <t-tabs :default-value="1" theme="card" size="medium" addable>
            <t-tab-panel :value="1" label="卡片式" removable>卡片式标签</t-tab-panel>
            <t-tab-panel :value="2" label="第二页" removable>第二页</t-tab-panel>
          </t-tabs>
        </div>

        <div v-else-if="name === 'Pagination'" class="ug-stack">
          <t-pagination v-model="page" :total="orders.length" :page-size="10" show-jumper :show-page-size="false" />
          <t-pagination :total="120" :page-size="10" size="small" theme="simple" />
          <t-pagination-mini />
          <t-pagination :total="50" :page-size="10" disabled />
        </div>

        <div v-else-if="name === 'Steps'" class="ug-stack">
          <t-steps :current="1">
            <t-step-item title="基本信息" content="已完成" />
            <t-step-item title="详细配置" content="进行中" />
            <t-step-item title="确认提交" content="待处理" />
          </t-steps>
          <t-steps :current="1" status="error" theme="dot" readonly>
            <t-step-item title="上传" />
            <t-step-item title="校验失败" />
            <t-step-item title="完成" />
          </t-steps>
        </div>

        <div v-else-if="name === 'Anchor'" class="ug-anchor-demo">
          <t-anchor :bounds="8" container="#component-Anchor" :affix-props="{ offsetTop: 0 }">
            <t-anchor-item href="#component-Typography" title="Typography" />
            <t-anchor-item href="#component-Button" title="Button" />
            <t-anchor-item href="#component-Table" title="Table" />
          </t-anchor>
        </div>

        <div v-else-if="name === 'BackTop'" class="ug-stack">
          <t-typography-text theme="secondary" class="ug-small">页面右下角为全局 BackTop；此处为静态展示。</t-typography-text>
          <t-space>
            <t-back-top theme="light" shape="square" :offset="['auto', 'auto']" container="#component-BackTop" style="position: static" />
            <t-back-top theme="primary" shape="circle" :offset="['auto', 'auto']" container="#component-BackTop" style="position: static" />
            <t-back-top theme="dark" size="small" :offset="['auto', 'auto']" container="#component-BackTop" style="position: static" />
          </t-space>
        </div>

        <div v-else-if="name === 'Affix'" class="ug-affix-demo">
          <t-affix :offset-top="0" container=".ug-affix-demo"><t-button size="small" theme="primary">滚动时固定</t-button></t-affix>
          <p v-for="i in 6" :key="i" class="ug-small ug-muted">滚动容器内容 {{ i }}</p>
        </div>

        <div v-else-if="name === 'Navbar'" class="ug-navbar-demo">
          <t-head-menu :default-value="nav[0]!.key" theme="light" height="56px">
            <template #logo><span class="ug-logo-text">UI Gallery</span></template>
            <t-menu-item v-for="n in nav.slice(0, 3)" :key="n.key" :value="n.key">{{ n.label }}</t-menu-item>
            <template #operations>
              <t-button variant="text" shape="square"><template #icon><Icon name="search" /></template></t-button>
              <t-button variant="text" shape="square"><template #icon><Icon name="bell" /></template></t-button>
            </template>
          </t-head-menu>
        </div>

        <div v-else-if="name === 'Sidebar'" class="ug-sidebar-demo">
          <t-menu :default-value="nav[1]!.key" theme="dark" width="180px" :collapsed="false">
            <template #logo><span class="ug-logo-text ug-logo-text--dark">Acme</span></template>
            <t-menu-item v-for="n in nav.slice(0, 4)" :key="n.key" :value="n.key"><template #icon><Icon :name="n.icon" /></template>{{ n.label }}</t-menu-item>
            <template #operations><t-button variant="text" shape="square"><template #icon><Icon name="menu" /></template></t-button></template>
          </t-menu>
          <t-menu :default-value="nav[1]!.key" theme="light" width="64px" collapsed>
            <t-menu-item v-for="n in nav.slice(0, 4)" :key="n.key" :value="n.key"><template #icon><Icon :name="n.icon" /></template>{{ n.label }}</t-menu-item>
          </t-menu>
        </div>

        <div v-else-if="name === 'CommandPalette'" class="ug-stack">
          <t-button variant="outline" @click="palette = true">打开命令面板 <kbd class="ug-kbd">⌘K</kbd></t-button>
          <t-dialog v-model:visible="palette" :header="false" :footer="false" width="520px" placement="top" :close-btn="false">
            <t-input v-model="paletteQuery" placeholder="搜索页面或命令…" autofocus><template #prefix-icon><Icon name="search" /></template></t-input>
            <t-list size="small" class="ug-palette-list">
              <t-list-item v-for="n in paletteItems" :key="n.key" @click="palette = false">
                <t-space align="center"><Icon :name="n.icon" /><span>{{ n.label }}</span></t-space>
                <template #action><kbd class="ug-kbd">↵</kbd></template>
              </t-list-item>
              <t-empty v-if="paletteItems.length === 0" size="small" description="无匹配结果" />
            </t-list>
          </t-dialog>
          <t-typography-text theme="secondary" class="ug-small">Dialog + Input + List 组合（composed）</t-typography-text>
        </div>

        <t-row v-else-if="name === 'Grid'" :gutter="[8, 8]">
          <t-col v-for="i in 6" :key="i" :span="4" :xs="6"><div class="ug-cell">col {{ i }}</div></t-col>
        </t-row>

        <div v-else-if="name === 'Stack'" class="ug-stack">
          <t-space :size="8" break-line><t-tag>横向</t-tag><t-tag>Space</t-tag><t-tag>间距 8</t-tag></t-space>
          <t-space direction="vertical" size="small" separator="—"><span>纵向</span><span>Space</span></t-space>
        </div>

        <t-layout v-else-if="name === 'Layout'" class="ug-layout-demo">
          <t-header class="ug-layout-block">Header</t-header>
          <t-layout>
            <t-aside width="80px" class="ug-layout-block ug-layout-block--aside">Aside</t-aside>
            <t-content class="ug-layout-block">Content</t-content>
          </t-layout>
          <t-footer class="ug-layout-block">Footer</t-footer>
        </t-layout>

        <div v-else-if="name === 'Container'" class="ug-container-demo">
          <div class="ug-container">max-width: 720px 居中容器（CSS composed）</div>
        </div>

        <div v-else-if="name === 'AspectRatio'" class="ug-aspect">
          <t-skeleton :row-col="[[{ width: '100%', height: '100%' }]]" animation="gradient" class="ug-aspect-inner" />
          <span class="ug-aspect-label">16 / 9（CSS aspect-ratio composed）</span>
        </div>

        <div v-else-if="name === 'Resizable'" class="ug-missing">
          <t-empty size="small" title="TDesign Vue Next 无 Resizable/Splitter 组件" description="已在 gallery.json.coverage 标记为 missing" />
        </div>

        <div v-else-if="name === 'ScrollArea'" class="ug-scroll-area">
          <p v-for="m in team" :key="m.email" class="ug-small">{{ m.name }} · {{ m.role }} · {{ m.lastActive }}</p>
        </div>

        <t-collapse v-else-if="name === 'Accordion'" v-model="collapse" expand-mutex expand-icon-placement="right">
          <t-collapse-panel header="什么是 UI Gallery？">在同一页面规格下比较多个组件库的参考应用。</t-collapse-panel>
          <t-collapse-panel header="如何切换主题？">通过 ?theme=dark 参数切换。</t-collapse-panel>
          <t-collapse-panel header="禁用面板" disabled>—</t-collapse-panel>
        </t-collapse>

        <div v-else-if="name === 'ThemeProvider'" class="ug-stack">
          <t-config-provider :global-config="{ classPrefix: 't' }">
            <t-space break-line align="center"><t-button theme="primary" size="small">ConfigProvider 内</t-button><t-tag theme="primary" variant="light">theme-mode: {{ 'light | dark' }}</t-tag></t-space>
          </t-config-provider>
          <t-typography-text theme="secondary" class="ug-small">暗色通过 html[theme-mode="dark"] 官方机制切换。</t-typography-text>
        </div>

        <t-watermark v-else-if="name === 'Watermark'" :watermark-content="{ text: 'UI Gallery', fontColor: 'var(--td-text-color-placeholder)' }" :y="60" :x="40" :height="24" :width="100" class="ug-watermark">
          <div style="height: 120px" />
        </t-watermark>

        <div v-else-if="name === 'Tour'" class="ug-stack">
          <t-space break-line>
            <t-button id="tour-step-1" variant="outline" @click="tour = 0">开始引导</t-button>
            <t-button id="tour-step-2" variant="outline">第二步目标</t-button>
          </t-space>
          <t-guide
            v-model="tour"
            :steps="[
              { element: '#tour-step-1', title: '欢迎使用', body: '这里是第一步引导。', placement: 'bottom' },
              { element: '#tour-step-2', title: '继续探索', body: '第二步指向另一个按钮。', placement: 'bottom' },
            ]"
          />
        </div>

        <div v-else-if="name === 'FloatButton'" class="ug-float-demo">
          <t-sticky-tool type="compact" placement="right-bottom" style="position: absolute">
            <t-sticky-item label="反馈"><template #icon><Icon name="message-square" /></template></t-sticky-item>
            <t-sticky-item label="帮助"><template #icon><Icon name="circle-help" /></template></t-sticky-item>
            <t-sticky-item label="顶部"><template #icon><Icon name="arrow-up" /></template></t-sticky-item>
          </t-sticky-tool>
        </div>

        <t-space v-else-if="name === 'Kbd'" break-line align="center">
          <kbd class="ug-kbd">⌘</kbd><kbd class="ug-kbd">Shift</kbd><kbd class="ug-kbd">K</kbd>
          <t-typography-text theme="secondary" class="ug-small">原生 kbd + TDesign 变量（composed）</t-typography-text>
        </t-space>

        <div v-else-if="name === 'Code'" class="ug-stack">
          <t-typography-text code>pnpm add tdesign-vue-next</t-typography-text>
          <pre class="ug-code"><code>import TDesign from "tdesign-vue-next"
app.use(TDesign)</code></pre>
        </div>

        <div v-else-if="name === 'Divider'" class="ug-stack">
          <t-divider />
          <t-divider align="left">左侧文字</t-divider>
          <t-divider dashed align="center">虚线</t-divider>
          <t-space align="center"><span>左</span><t-divider layout="vertical" /><span>右</span></t-space>
        </div>

        <t-space v-else-if="name === 'Link'" break-line>
          <t-link theme="primary" href="#component-Link">主要链接</t-link>
          <t-link theme="default" underline>下划线</t-link>
          <t-link theme="success" hover="color">悬停变色</t-link>
          <t-link theme="danger" size="small">小号危险</t-link>
          <t-link theme="primary" disabled>禁用</t-link>
          <t-link theme="primary"><template #suffix-icon><Icon name="external-link" /></template>外链</t-link>
        </t-space>
      </t-card>
    </div>

    <t-divider align="left">TDesign 额外组件（contract 之外）</t-divider>
    <div class="ug-components">
      <t-card v-for="name in libraryExtras" :key="name" :title="name" class="ug-component-card" :bordered="true">
        <div v-if="name === 'Comment'"><t-comment author="林晓" datetime="2 小时前" content="评论组件，支持头像、作者、时间与操作。"><template #avatar><t-avatar>林</t-avatar></template><template #actions><t-space><t-link size="small" theme="primary">回复</t-link><t-link size="small">点赞</t-link></t-space></template></t-comment></div>
        <div v-else-if="name === 'Guide'"><t-typography-text theme="secondary" class="ug-small">见上方 Tour 卡片（t-guide）。</t-typography-text></div>
        <div v-else-if="name === 'ImageViewer'"><t-image-viewer :images="['']"><template #trigger="{ open }"><t-button variant="outline" @click="open">打开图片预览</t-button></template></t-image-viewer></div>
        <div v-else-if="name === 'InputAdornment'" class="ug-stack"><t-input-adornment prepend="https://" append=".com"><t-input placeholder="域名" /></t-input-adornment><t-input-adornment prepend="¥"><t-input-number :default-value="99" theme="normal" /></t-input-adornment></div>
        <div v-else-if="name === 'InputGroup'"><t-input-group separate><t-input placeholder="省" /><t-input placeholder="市" /><t-input placeholder="区" /></t-input-group></div>
        <div v-else-if="name === 'RangeInput'" class="ug-stack"><t-range-input :default-value="['10', '100']" clearable /><t-range-input disabled /></div>
        <div v-else-if="name === 'SelectInput'"><t-select-input :value="{ label: '订单', value: 'orders' }" placeholder="请选择" :popup-props="{ overlayInnerStyle: { padding: '6px' } }"><template #panel><t-space direction="vertical" size="small"><t-radio-group :default-value="'orders'" :options="options" /></t-space></template></t-select-input></div>
        <div v-else-if="name === 'TagInput'" class="ug-stack"><t-tag-input :default-value="['前端', '设计']" clearable placeholder="输入后回车" /><t-tag-input :default-value="['禁用']" disabled /></div>
        <div v-else-if="name === 'TreeSelect'"><t-tree-select :data="treeData" placeholder="选择节点" clearable filterable /></div>
        <div v-else-if="name === 'CheckTag'"><t-check-tag-group :default-value="['a']" :options="[{ label: '前端', value: 'a' }, { label: '后端', value: 'b' }, { label: '设计', value: 'c' }]" multiple /></div>
        <div v-else-if="name === 'Search'"><t-search placeholder="搜索订单、成员…" clearable /></div>
        <div v-else-if="name === 'TooltipLite'"><t-tooltip-lite content="轻量提示"><t-button variant="outline" size="small">悬停</t-button></t-tooltip-lite></div>
        <div v-else-if="name === 'HeadMenu'"><t-typography-text theme="secondary" class="ug-small">见上方 Navbar 卡片（t-head-menu）。</t-typography-text></div>
        <div v-else-if="name === 'StickyTool'"><t-typography-text theme="secondary" class="ug-small">见上方 FloatButton 卡片（t-sticky-tool）。</t-typography-text></div>
        <div v-else-if="name === 'TimeRangePicker'"><t-time-range-picker clearable format="HH:mm" /></div>
        <div v-else-if="name === 'DialogCard'"><t-typography-text theme="secondary" class="ug-small">见上方 Dialog 卡片（t-dialog-card）。</t-typography-text></div>
        <div v-else-if="name === 'PaginationMini'"><t-pagination-mini size="small" layout="horizontal" /></div>
        <div v-else><t-loading size="small" text="局部加载" :loading="true" style="height: 64px; width: 100%" show-overlay><div style="height: 64px" /></t-loading></div>
      </t-card>
    </div>

    <t-back-top container="body" :visible-height="200" />
  </div>
</template>

<style scoped>
.ug-index { display: flex; flex-wrap: wrap; gap: 6px; }
.ug-index-item {
  font-size: 12px; padding: 2px 10px; border-radius: 999px; text-decoration: none;
  color: var(--td-text-color-secondary); border: 1px solid var(--td-component-stroke); background: var(--td-bg-color-container);
}
.ug-index-item:hover { color: var(--td-brand-color); border-color: var(--td-brand-color); }
.ug-components { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
@media (max-width: 1279px) { .ug-components { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 767px) { .ug-components { grid-template-columns: minmax(0, 1fr); } }
.ug-component-card { scroll-margin-top: 72px; min-width: 0; }
.ug-component-card :deep(.t-card__body) { overflow: hidden; }
.ug-stack { display: flex; flex-direction: column; gap: 12px; }
.ug-btn-group :deep(.t-button + .t-button) { margin-left: -1px; border-radius: 0; }
.ug-btn-group :deep(.t-button:first-child) { border-radius: var(--td-radius-default) 0 0 var(--td-radius-default); }
.ug-btn-group :deep(.t-button:last-child) { border-radius: 0 var(--td-radius-default) var(--td-radius-default) 0; }
.ug-pin { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; }
.ug-pin :deep(.t-input) { padding: 0 4px; }
.ug-missing { padding: 8px 0; }
.ug-slide { height: 140px; display: grid; place-items: center; background: var(--td-bg-color-secondarycontainer); color: var(--td-text-color-primary); border-radius: var(--td-radius-medium); }
.ug-popover { display: flex; flex-direction: column; gap: 8px; min-width: 200px; padding: 4px; }
.ug-result { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; padding: 12px; border-radius: var(--td-radius-medium); background: var(--td-bg-color-secondarycontainer); }
.ug-result--success { color: var(--td-success-color); }
.ug-result--error { color: var(--td-error-color); }
.ug-menu-demo { max-height: 260px; }
.ug-anchor-demo { position: relative; height: 120px; overflow: auto; }
.ug-affix-demo { height: 120px; overflow: auto; border: 1px dashed var(--td-component-stroke); padding: 8px; border-radius: var(--td-radius-medium); }
.ug-navbar-demo { border: 1px solid var(--td-component-stroke); border-radius: var(--td-radius-medium); overflow: hidden; }
.ug-navbar-demo :deep(.t-head-menu__inner) { padding: 0 12px; }
.ug-logo-text { font-weight: 600; color: var(--td-text-color-primary); }
.ug-logo-text--dark { color: #fff; padding-left: 16px; }
.ug-sidebar-demo { display: flex; gap: 12px; height: 260px; overflow: hidden; }
.ug-sidebar-demo :deep(.t-default-menu) { height: 100%; }
.ug-palette-list { margin-top: 8px; max-height: 240px; overflow: auto; }
.ug-palette-list :deep(.t-list-item) { cursor: pointer; }
.ug-palette-list :deep(.t-list-item:hover) { background: var(--td-bg-color-container-hover); }
.ug-kbd { font: 11px/1 var(--td-font-family); padding: 3px 6px; border-radius: 4px; border: 1px solid var(--td-component-stroke); background: var(--td-bg-color-secondarycontainer); color: var(--td-text-color-secondary); }
.ug-cell { padding: 10px 0; text-align: center; font-size: 12px; border-radius: var(--td-radius-default); background: var(--td-brand-color-light); color: var(--td-brand-color); }
.ug-layout-demo { border-radius: var(--td-radius-medium); overflow: hidden; }
.ug-layout-block { display: grid; place-items: center; font-size: 12px; min-height: 40px; background: var(--td-bg-color-secondarycontainer); color: var(--td-text-color-secondary); border: 1px dashed var(--td-component-stroke); }
.ug-layout-block--aside { min-height: 72px; }
.ug-container-demo { background: var(--td-bg-color-secondarycontainer); padding: 8px; border-radius: var(--td-radius-medium); }
.ug-container { max-width: 720px; margin: 0 auto; padding: 12px; text-align: center; font-size: 12px; background: var(--td-bg-color-container); border: 1px dashed var(--td-component-stroke); border-radius: var(--td-radius-default); }
.ug-aspect { position: relative; aspect-ratio: 16 / 9; width: 100%; overflow: hidden; border-radius: var(--td-radius-medium); }
.ug-aspect-inner { position: absolute; inset: 0; }
.ug-aspect-inner :deep(.t-skeleton__row), .ug-aspect-inner :deep(.t-skeleton__col) { height: 100%; }
.ug-aspect-label { position: absolute; inset: auto 8px 8px auto; font-size: 11px; color: var(--td-text-color-secondary); }
.ug-scroll-area { height: 120px; overflow: auto; padding: 8px 12px; border: 1px solid var(--td-component-stroke); border-radius: var(--td-radius-medium); }
.ug-scroll-area p { margin: 0 0 6px; }
.ug-watermark { border: 1px dashed var(--td-component-stroke); border-radius: var(--td-radius-medium); }
.ug-float-demo { position: relative; height: 200px; background: var(--td-bg-color-secondarycontainer); border-radius: var(--td-radius-medium); overflow: hidden; }
.ug-float-demo :deep(.t-sticky-tool) { position: absolute; right: 12px; bottom: 12px; }
.ug-code { margin: 0; padding: 12px; font-size: 12px; overflow: auto; border-radius: var(--td-radius-medium); background: var(--td-bg-color-secondarycontainer); color: var(--td-text-color-primary); }
</style>
