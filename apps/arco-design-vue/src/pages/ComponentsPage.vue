<script setup lang="ts">
import { computed, ref } from "vue"
import { Message, Notification, type TableColumnData, type TableData } from "@arco-design/web-vue"
import contract from "@ui-gallery/spec/contract.json"
import nav from "@ui-gallery/spec/mock/nav.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import team from "@ui-gallery/spec/mock/team.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import DemoBlock from "@/components/DemoBlock.vue"
import PageHeader from "@/components/PageHeader.vue"
import StatusTag from "@/components/StatusTag.vue"
import { coverage } from "@/coverage"
import { Icon } from "@/lib/icons"
import { theme } from "@/lib/settings"
import { useIsMobile } from "@/lib/useIsMobile"

const names = contract.components
const counts = computed(() => ({
  implemented: names.filter((name) => coverage[name] === "implemented").length,
  composed: names.filter((name) => coverage[name] === "composed").length,
  missing: names.filter((name) => coverage[name] === "missing").length,
}))

const sizes = ["mini", "small", "medium", "large"] as const
const dialog = ref(false)
const drawer = ref(false)
const palette = ref(false)
const paletteQuery = ref("")
const segmented = ref("day")
const switchOn = ref(true)
const rating = ref(3.5)
const slider = ref(30)
const rangeSlider = ref<[number, number]>([20, 60])
const color = ref("#165dff")
const progress = ref(0.45)
const treeSelected = ref(["0-0-1"])
const transferValue = ref(["1", "3"])
const mention = ref("")
const pin = ref("")
const cascader = ref("")
const autoValue = ref("")
const isMobile = useIsMobile()

const paletteItems = computed(() => nav.filter((item) => item.label.includes(paletteQuery.value) || item.key.includes(paletteQuery.value.toLowerCase())))

const treeData = [
  {
    title: "产品",
    key: "0-0",
    children: [
      { title: "订单中心", key: "0-0-0" },
      { title: "客户管理", key: "0-0-1", children: [{ title: "标签", key: "0-0-1-0" }] },
    ],
  },
  { title: "数据", key: "0-1", children: [{ title: "看板", key: "0-1-0" }] },
]
const cascaderOptions = [
  { value: "cn", label: "中国", children: [{ value: "sh", label: "上海", children: [{ value: "pd", label: "浦东" }] }, { value: "bj", label: "北京" }] },
  { value: "sg", label: "新加坡" },
]
const transferData = team.map((member, index) => ({ value: String(index), label: member.name, disabled: false }))
const tableColumns: TableColumnData[] = [
  { title: "订单号", dataIndex: "id" },
  { title: "客户", dataIndex: "customer" },
  { title: "金额", dataIndex: "amount", align: "right" as const, sortable: { sortDirections: ["ascend", "descend"] as ("ascend" | "descend")[] } },
  { title: "状态", dataIndex: "status", slotName: "status", filterable: { filters: ["paid", "pending", "failed"].map((value) => ({ text: value, value })), filter: (value: string[], record: TableData) => value.includes(record.status as string) } },
]
const gridColumns: TableColumnData[] = [
  { title: "订单号", dataIndex: "id", fixed: "left" as const, width: 110 },
  { title: "客户", dataIndex: "customer", width: 120 },
  { title: "邮箱", dataIndex: "email", width: 200 },
  { title: "产品", dataIndex: "product", width: 120 },
  { title: "渠道", dataIndex: "channel", width: 100 },
  { title: "日期", dataIndex: "date", width: 120 },
  { title: "金额", dataIndex: "amount", align: "right" as const, width: 110, fixed: "right" as const },
]

function toast(kind: "info" | "success" | "warning" | "error") {
  Message[kind](`这是一条 ${kind} 消息`)
}
function scrollToStatic() {
  document.getElementById("modal-static")?.scrollIntoView({ behavior: "smooth" })
}
function notify() {
  Notification.info({ title: "新订单", content: "ORD-2401 已支付，金额 ¥778.72", closable: true })
}
</script>

<template>
  <div class="page components-page">
    <PageHeader title="组件全集" description="按 contract.json 顺序展示 Arco Design Vue 的全部组件 × 变体 × 尺寸 × 状态。">
      <a-space size="small" wrap>
        <a-tag color="green">implemented {{ counts.implemented }}</a-tag>
        <a-tag color="orange">composed {{ counts.composed }}</a-tag>
        <a-tag color="red">missing {{ counts.missing }}</a-tag>
      </a-space>
    </PageHeader>

    <div class="components-layout">
      <div class="stack" style="gap: 16px; min-width: 0">
        <DemoBlock name="Typography" arco="a-typography">
          <a-typography class="block">
            <a-typography-title :heading="1">H1 标题</a-typography-title>
            <a-typography-title :heading="2">H2 标题</a-typography-title>
            <a-typography-title :heading="3">H3 标题</a-typography-title>
            <a-typography-title :heading="4">H4 标题</a-typography-title>
            <a-typography-paragraph>正文段落：Acme Console 让订单、客户、数据与 AI 助手在一个界面协同。</a-typography-paragraph>
            <a-space wrap>
              <a-typography-text>默认</a-typography-text>
              <a-typography-text type="secondary">次要</a-typography-text>
              <a-typography-text type="primary">主色</a-typography-text>
              <a-typography-text type="success">成功</a-typography-text>
              <a-typography-text type="warning">警告</a-typography-text>
              <a-typography-text type="danger">危险</a-typography-text>
              <a-typography-text bold>加粗</a-typography-text>
              <a-typography-text mark>标记</a-typography-text>
              <a-typography-text underline>下划线</a-typography-text>
              <a-typography-text delete>删除线</a-typography-text>
              <a-typography-text code>code</a-typography-text>
              <a-typography-text disabled>禁用</a-typography-text>
            </a-space>
            <a-typography-paragraph :ellipsis="{ rows: 1, showTooltip: true }" style="margin-top: 8px">省略段落：这是一段很长的文本，会在一行后省略并显示 Tooltip。这是一段很长的文本，会在一行后省略并显示 Tooltip。这是一段很长的文本。</a-typography-paragraph>
          </a-typography>
        </DemoBlock>

        <DemoBlock name="Button" arco="a-button">
          <div class="block row"><a-button type="primary">Primary</a-button><a-button type="secondary">Secondary</a-button><a-button type="dashed">Dashed</a-button><a-button type="outline">Outline</a-button><a-button type="text">Text</a-button></div>
          <div class="block row"><a-button type="primary" status="success">Success</a-button><a-button type="primary" status="warning">Warning</a-button><a-button type="primary" status="danger">Danger</a-button><a-button status="danger">Danger outline</a-button></div>
          <div class="block row"><a-button v-for="size in sizes" :key="size" type="primary" :size="size">{{ size }}</a-button></div>
          <div class="block row"><a-button type="primary" loading>Loading</a-button><a-button type="primary" disabled>Disabled</a-button><a-button shape="round">Round</a-button><a-button type="primary" long style="max-width: 200px">Long</a-button></div>
        </DemoBlock>

        <DemoBlock name="ButtonGroup" arco="a-button-group">
          <a-button-group><a-button type="primary">发布</a-button><a-button type="primary"><template #icon><Icon name="chevron-down" /></template></a-button></a-button-group>
          <a-button-group><a-button>左</a-button><a-button>中</a-button><a-button>右</a-button></a-button-group>
          <a-button-group size="small"><a-button type="outline">日</a-button><a-button type="outline">周</a-button><a-button type="outline">月</a-button></a-button-group>
        </DemoBlock>

        <DemoBlock name="IconButton" arco="a-button shape=circle/square">
          <a-button type="primary" shape="circle"><template #icon><Icon name="plus" /></template></a-button>
          <a-button type="secondary" shape="circle"><template #icon><Icon name="search" /></template></a-button>
          <a-button type="outline" shape="square"><template #icon><Icon name="settings" /></template></a-button>
          <a-button type="text" shape="circle"><template #icon><Icon name="more-horizontal" /></template></a-button>
          <a-button v-for="size in sizes" :key="size" type="primary" shape="circle" :size="size"><template #icon><Icon name="bell" /></template></a-button>
          <a-button type="primary" shape="circle" disabled><template #icon><Icon name="trash" /></template></a-button>
        </DemoBlock>

        <DemoBlock name="Input" arco="a-input">
          <div class="block grid grid-2 slider-demo">
            <a-input placeholder="默认" allow-clear />
            <a-input placeholder="带前后缀" allow-clear><template #prefix><Icon name="search" /></template><template #suffix><Icon name="info" /></template></a-input>
            <a-input placeholder="前置 / 后置标签"><template #prepend>https://</template><template #append>.acme.dev</template></a-input>
            <a-input-password placeholder="密码" />
            <a-input placeholder="错误状态" error />
            <a-input placeholder="禁用" disabled />
            <a-input placeholder="只读" readonly model-value="只读内容" />
            <a-input placeholder="字数限制" :max-length="20" show-word-limit />
          </div>
          <div class="block row"><a-input v-for="size in sizes" :key="size" :size="size" :placeholder="size" style="width: 120px" /></div>
        </DemoBlock>

        <DemoBlock name="Textarea" arco="a-textarea">
          <div class="block grid grid-2">
            <a-textarea placeholder="自动高度" :auto-size="{ minRows: 2, maxRows: 4 }" />
            <a-textarea placeholder="字数统计" :max-length="100" show-word-limit />
            <a-textarea placeholder="错误" error />
            <a-textarea placeholder="禁用" disabled />
          </div>
        </DemoBlock>

        <DemoBlock name="NumberInput" arco="a-input-number">
          <a-input-number :default-value="5" :min="0" :max="10" style="width: 140px" />
          <a-input-number :default-value="1000" mode="button" :step="100" style="width: 160px" />
          <a-input-number :default-value="9.9" :precision="2" :step="0.1" style="width: 140px"><template #prefix>¥</template></a-input-number>
          <a-input-number :default-value="3" disabled style="width: 120px" />
          <a-input-number v-for="size in sizes" :key="size" :size="size" :default-value="1" style="width: 100px" />
        </DemoBlock>

        <DemoBlock name="Select" arco="a-select">
          <a-select placeholder="请选择" style="width: 160px"><a-option>华东</a-option><a-option>华北</a-option><a-option disabled>华南（无库存）</a-option></a-select>
          <a-select placeholder="可搜索" allow-search allow-clear style="width: 160px"><a-option v-for="member in team" :key="member.email">{{ member.name }}</a-option></a-select>
          <a-select placeholder="分组" style="width: 160px"><a-optgroup label="国内"><a-option>上海</a-option><a-option>北京</a-option></a-optgroup><a-optgroup label="海外"><a-option>新加坡</a-option></a-optgroup></a-select>
          <a-select placeholder="加载中" loading style="width: 140px" />
          <a-select placeholder="错误" error style="width: 120px" />
          <a-select placeholder="禁用" disabled style="width: 120px" />
          <a-select v-for="size in sizes" :key="size" :size="size" :placeholder="size" style="width: 110px" />
        </DemoBlock>

        <DemoBlock name="MultiSelect" arco="a-select multiple">
          <a-select multiple placeholder="多选" :default-value="['林晓', 'Alex Chen']" style="width: 280px"><a-option v-for="member in team" :key="member.email">{{ member.name }}</a-option></a-select>
          <a-select multiple placeholder="折叠标签" :max-tag-count="2" :default-value="team.slice(0, 4).map((m) => m.name)" style="width: 280px"><a-option v-for="member in team" :key="member.email">{{ member.name }}</a-option></a-select>
          <a-tree-select :data="treeData" placeholder="树形多选" multiple tree-checkable style="width: 240px" />
        </DemoBlock>

        <DemoBlock name="Combobox" arco="a-select allow-search + allow-create">
          <a-select placeholder="搜索或创建选项" allow-search allow-create allow-clear style="width: 240px"><a-option v-for="task in tasks" :key="task.title">{{ task.title }}</a-option></a-select>
          <a-select placeholder="多选 + 创建" multiple allow-search allow-create style="width: 280px"><a-option v-for="task in tasks" :key="task.title">{{ task.title }}</a-option></a-select>
        </DemoBlock>

        <DemoBlock name="Autocomplete" arco="a-auto-complete">
          <a-auto-complete v-model="autoValue" :data="team.map((m) => m.email)" placeholder="输入邮箱前缀…" style="width: 240px" />
          <a-auto-complete :data="orders.slice(0, 8).map((o) => o.id)" placeholder="订单号" strict style="width: 200px" />
        </DemoBlock>

        <DemoBlock name="Checkbox" arco="a-checkbox">
          <a-checkbox>未选</a-checkbox>
          <a-checkbox :default-checked="true">已选</a-checkbox>
          <a-checkbox indeterminate>半选</a-checkbox>
          <a-checkbox disabled>禁用</a-checkbox>
          <a-checkbox :default-checked="true" disabled>禁用已选</a-checkbox>
          <a-checkbox-group :default-value="['a']" class="block"><a-checkbox value="a">选项 A</a-checkbox><a-checkbox value="b">选项 B</a-checkbox><a-checkbox value="c">选项 C</a-checkbox></a-checkbox-group>
        </DemoBlock>

        <DemoBlock name="Radio" arco="a-radio">
          <a-radio-group :default-value="1"><a-radio :value="1">选项一</a-radio><a-radio :value="2">选项二</a-radio><a-radio :value="3" disabled>禁用</a-radio></a-radio-group>
          <a-radio-group type="button" :default-value="'a'"><a-radio value="a">按钮 A</a-radio><a-radio value="b">按钮 B</a-radio><a-radio value="c">按钮 C</a-radio></a-radio-group>
          <a-radio-group v-for="size in sizes" :key="size" type="button" :size="size" :default-value="1"><a-radio :value="1">{{ size }}</a-radio><a-radio :value="2">B</a-radio></a-radio-group>
        </DemoBlock>

        <DemoBlock name="Switch" arco="a-switch">
          <a-switch v-model="switchOn" />
          <a-switch :default-checked="false" />
          <a-switch type="round" :default-checked="true" />
          <a-switch type="line" :default-checked="true" />
          <a-switch size="small" :default-checked="true" />
          <a-switch loading :default-checked="true" />
          <a-switch disabled />
          <a-switch :default-checked="true" checked-color="#14c9c9"><template #checked>开</template><template #unchecked>关</template></a-switch>
        </DemoBlock>

        <DemoBlock name="Slider" arco="a-slider">
          <div class="block grid grid-2">
            <a-slider v-model="slider" show-tooltip />
            <a-slider v-model="rangeSlider" range :marks="{ 0: '0', 50: '50', 100: '100' }" />
            <a-slider :default-value="40" :step="10" show-ticks show-input />
            <a-slider :default-value="60" disabled />
          </div>
          <a-slider :default-value="30" direction="vertical" style="height: 100px" />
        </DemoBlock>

        <DemoBlock name="Rating" arco="a-rate">
          <a-rate v-model="rating" allow-half />
          <a-rate :default-value="4" allow-clear />
          <a-rate :default-value="3" readonly />
          <a-rate :default-value="2" disabled />
          <a-rate :default-value="4" :count="10" grading />
          <a-rate :default-value="3" color="#f53f3f"><template #character><Icon name="heart" /></template></a-rate>
        </DemoBlock>

        <DemoBlock name="DatePicker" arco="a-date-picker">
          <a-date-picker style="width: 200px" />
          <a-date-picker show-time placeholder="日期 + 时间" style="width: 220px" />
          <a-month-picker style="width: 160px" />
          <a-year-picker style="width: 140px" />
          <a-week-picker style="width: 180px" />
          <a-date-picker disabled style="width: 160px" />
          <a-date-picker v-for="size in sizes" :key="size" :size="size" :placeholder="size" style="width: 140px" />
        </DemoBlock>

        <DemoBlock name="TimePicker" arco="a-time-picker">
          <a-time-picker style="width: 160px" />
          <a-time-picker format="HH:mm" placeholder="不含秒" style="width: 140px" />
          <a-time-picker type="time-range" style="width: 240px" />
          <a-time-picker disabled style="width: 140px" />
        </DemoBlock>

        <DemoBlock name="DateRangePicker" arco="a-range-picker">
          <a-range-picker style="width: 280px" />
          <a-range-picker show-time style="width: 340px" />
          <a-range-picker mode="month" style="width: 240px" />
          <a-range-picker disabled style="width: 240px" />
        </DemoBlock>

        <DemoBlock name="ColorPicker" arco="a-color-picker">
          <a-color-picker v-model="color" />
          <a-color-picker :default-value="'#14c9c9'" show-text />
          <a-color-picker :default-value="'rgba(114,46,209,0.6)'" format="rgb" show-text show-preset show-history />
          <a-color-picker :default-value="'#f53f3f'" size="small" />
          <a-color-picker :default-value="'#f53f3f'" size="large" />
          <a-color-picker :default-value="'#86909c'" disabled />
        </DemoBlock>

        <DemoBlock name="Upload" arco="a-upload">
          <div class="block grid grid-2">
            <a-upload action="/" :auto-upload="false" :default-file-list="[{ uid: '1', name: 'report.pdf', status: 'done' }, { uid: '2', name: 'photo.png', status: 'error' }, { uid: '3', name: 'big.zip', status: 'uploading', percent: 0.4 }]" />
            <a-upload action="/" :auto-upload="false" draggable tip="拖拽文件到此处或点击上传" />
            <a-upload action="/" :auto-upload="false" list-type="picture-card" :default-file-list="[{ uid: '1', name: 'a.png', url: 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22><rect width=%2280%22 height=%2280%22 fill=%22%23165dff%22/></svg>' }]" />
            <a-upload action="/" disabled />
          </div>
        </DemoBlock>

        <DemoBlock name="Cascader" arco="a-cascader">
          <a-cascader v-model="cascader" :options="cascaderOptions" placeholder="选择地区" style="width: 220px" />
          <a-cascader :options="cascaderOptions" placeholder="多选" multiple style="width: 260px" />
          <a-cascader :options="cascaderOptions" placeholder="可搜索" allow-search style="width: 200px" />
          <a-cascader :options="cascaderOptions" placeholder="禁用" disabled style="width: 160px" />
        </DemoBlock>

        <DemoBlock name="Transfer" arco="a-transfer">
          <a-transfer class="transfer-demo" v-model="transferValue" :data="transferData" :title="['候选成员', '已选成员']" show-search />
          <a-transfer class="transfer-demo" :data="transferData" :default-value="['0']" simple />
        </DemoBlock>

        <DemoBlock name="Mention" arco="a-mention">
          <a-mention v-model="mention" :data="team.map((m) => m.name)" placeholder="输入 @ 提及成员" style="width: 280px" />
          <a-mention type="textarea" :data="team.map((m) => m.name)" placeholder="多行提及" :prefix="['@', '#']" style="width: 280px" />
        </DemoBlock>

        <DemoBlock name="PinInput" arco="a-verification-code">
          <a-verification-code v-model="pin" :length="6" style="width: 300px" />
          <a-verification-code :length="4" size="large" masked style="width: 240px" />
          <a-verification-code :length="4" size="small" disabled style="width: 180px" />
          <a-verification-code :length="4" error style="width: 200px" />
        </DemoBlock>

        <DemoBlock name="Form" arco="a-form">
          <a-form :model="{ name: '', region: '' }" layout="horizontal" class="block" style="max-width: 520px">
            <a-form-item field="name" label="姓名" required validate-status="error" help="姓名不能为空"><a-input placeholder="请输入姓名" /></a-form-item>
            <a-form-item field="region" label="地区" tooltip="用于确定数据存储区域" validate-status="success" feedback><a-select placeholder="请选择"><a-option>华东</a-option></a-select></a-form-item>
            <a-form-item label="接收通知" extra="我们不会向你发送营销邮件。"><a-switch :default-checked="true" /></a-form-item>
            <a-form-item><a-space><a-button type="primary">提交</a-button><a-button>重置</a-button></a-space></a-form-item>
          </a-form>
          <a-form :model="{}" layout="inline" class="block"><a-form-item label="关键字"><a-input placeholder="行内表单" /></a-form-item><a-form-item><a-button type="primary">搜索</a-button></a-form-item></a-form>
        </DemoBlock>

        <DemoBlock name="Table" arco="a-table">
          <a-table class="block" :columns="tableColumns" :data="orders.slice(0, 5)" :pagination="false" :row-selection="{ type: 'checkbox' }" row-key="id" hoverable stripe :scroll="{ x: 560 }">
            <template #status="{ record }"><StatusTag :value="record.status" /></template>
          </a-table>
          <a-table class="block" :columns="tableColumns.slice(0, 3)" :data="[]" :pagination="false" size="small" />
          <a-table class="block" :columns="tableColumns.slice(0, 3)" :data="orders.slice(0, 2)" :pagination="false" size="mini" loading />
        </DemoBlock>

        <DemoBlock name="DataGrid" arco="a-table fixed/resizable/summary/expand">
          <a-table class="block" :columns="gridColumns" :data="orders.slice(0, 6)" :pagination="{ pageSize: 3 }" :scroll="{ x: 900, y: 240 }" row-key="id" column-resizable :bordered="{ cell: true }" :summary="true" :expandable="{ title: '', width: 40 }">
            <template #expand-row="{ record }">{{ record.customer }} 的订单 {{ record.id }}，金额 ¥{{ record.amount }}</template>
            <template #summary-cell="{ column }">{{ column.dataIndex === 'amount' ? `¥${orders.slice(0, 6).reduce((s, o) => s + o.amount, 0).toFixed(2)}` : column.dataIndex === 'id' ? '合计' : '' }}</template>
          </a-table>
        </DemoBlock>

        <DemoBlock name="Descriptions" arco="a-descriptions">
          <a-descriptions class="block" title="订单信息" :column="{ xs: 1, md: 3 }" bordered :data="[{ label: '订单号', value: orders[0]!.id }, { label: '客户', value: orders[0]!.customer }, { label: '金额', value: `¥${orders[0]!.amount}` }, { label: '状态', value: orders[0]!.status }, { label: '日期', value: orders[0]!.date }, { label: '渠道', value: orders[0]!.channel }]" />
          <a-descriptions class="block" layout="inline-vertical" size="small" :data="[{ label: '邮箱', value: team[0]!.email }, { label: '角色', value: team[0]!.role }]" />
        </DemoBlock>

        <DemoBlock name="List" arco="a-list">
          <a-list class="block" :max-height="220" hoverable>
            <template #header>团队成员</template>
            <a-list-item v-for="member in team" :key="member.email">
              <a-list-item-meta :title="member.name" :description="member.email"><template #avatar><a-avatar>{{ member.name.slice(0, 1) }}</a-avatar></template></a-list-item-meta>
              <template #actions><a-tag size="small">{{ member.role }}</a-tag></template>
            </a-list-item>
          </a-list>
          <a-list class="block" size="small" :bordered="false" :data="[]" />
        </DemoBlock>

        <DemoBlock name="Card" arco="a-card">
          <div class="block grid grid-3">
            <a-card title="默认卡片"><template #extra><a-link>更多</a-link></template>卡片内容，支持标题与操作区。</a-card>
            <a-card hoverable size="small" title="小尺寸 hoverable"><template #cover><div style="height: 80px; background: linear-gradient(135deg, rgb(var(--primary-6)), rgb(var(--purple-6)))" /></template>带封面。<template #actions><Icon name="heart" /><Icon name="share" /></template></a-card>
            <a-card :bordered="false" style="background: var(--color-fill-2)"><a-card-meta title="无边框" description="使用 a-card-meta 描述。" /></a-card>
          </div>
          <a-card class="block" :loading="true" title="加载中" />
        </DemoBlock>

        <DemoBlock name="Avatar" arco="a-avatar">
          <a-avatar :size="24">S</a-avatar>
          <a-avatar :size="32">M</a-avatar>
          <a-avatar :size="40">林</a-avatar>
          <a-avatar :size="64" shape="square">大</a-avatar>
          <a-avatar :style="{ backgroundColor: '#14c9c9' }"><Icon name="user" /></a-avatar>
          <a-avatar :style="{ backgroundColor: '#f7ba1e' }">Alex Chen</a-avatar>
          <a-avatar :style="{ backgroundColor: 'rgb(var(--primary-6))' }" trigger-type="mask">头像<template #trigger-icon><Icon name="camera" :size="14" /></template></a-avatar>
          <a-badge :count="3"><a-avatar shape="square">徽</a-avatar></a-badge>
        </DemoBlock>

        <DemoBlock name="AvatarGroup" arco="a-avatar-group">
          <a-avatar-group :size="32"><a-avatar v-for="member in team" :key="member.email">{{ member.name.slice(0, 1) }}</a-avatar></a-avatar-group>
          <a-avatar-group :size="40" :max-count="3"><a-avatar v-for="member in team" :key="member.email" :style="{ backgroundColor: 'rgb(var(--primary-6))' }">{{ member.name.slice(0, 1) }}</a-avatar></a-avatar-group>
          <a-avatar-group :size="28" shape="square" :max-count="4"><a-avatar v-for="member in team" :key="member.email">{{ member.name.slice(0, 1) }}</a-avatar></a-avatar-group>
        </DemoBlock>

        <DemoBlock name="Badge" arco="a-badge">
          <a-badge :count="5"><a-avatar shape="square" /></a-badge>
          <a-badge :count="120" :max-count="99"><a-avatar shape="square" /></a-badge>
          <a-badge dot><a-avatar shape="square" /></a-badge>
          <a-badge :count="0" show-zero><a-avatar shape="square" /></a-badge>
          <a-badge text="new"><a-avatar shape="square" /></a-badge>
          <a-badge status="success" text="Success" />
          <a-badge status="processing" text="Processing" />
          <a-badge status="warning" text="Warning" />
          <a-badge status="danger" text="Danger" />
          <a-badge :count="9" :dot-style="{ background: '#14c9c9' }" />
        </DemoBlock>

        <DemoBlock name="Tag" arco="a-tag">
          <a-tag>默认</a-tag>
          <a-tag v-for="c in ['red', 'orangered', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'arcoblue', 'purple', 'pinkpurple', 'magenta', 'gray']" :key="c" :color="c">{{ c }}</a-tag>
          <a-tag color="arcoblue" bordered>bordered</a-tag>
          <a-tag color="green" closable>closable</a-tag>
          <a-tag checkable :default-checked="true" color="purple">checkable</a-tag>
          <a-tag loading>loading</a-tag>
          <a-tag color="red"><template #icon><Icon name="alert-circle" :size="12" /></template>带图标</a-tag>
          <a-tag v-for="size in (['small', 'medium', 'large'] as const)" :key="size" :size="size" color="arcoblue">{{ size }}</a-tag>
        </DemoBlock>

        <DemoBlock name="Statistic" arco="a-statistic">
          <a-statistic title="本月收入" :value="128430" show-group-separator animation><template #prefix>¥</template></a-statistic>
          <a-statistic title="增长率" :value="12.4" :precision="1" :value-style="{ color: 'rgb(var(--green-6))' }"><template #prefix><Icon name="arrow-up" :size="16" /></template><template #suffix>%</template></a-statistic>
          <a-statistic title="流失率" :value="1" :value-style="{ color: 'rgb(var(--red-6))' }"><template #prefix><Icon name="arrow-down" :size="16" /></template><template #suffix>%</template></a-statistic>
          <a-statistic title="活跃用户" :value="8921" show-group-separator :value-style="{ fontSize: '20px' }" />
          <a-countdown title="倒计时" :value="Date.now() + 3600000" />
        </DemoBlock>

        <DemoBlock name="Timeline" arco="a-timeline">
          <a-timeline class="block">
            <a-timeline-item v-for="(item, index) in activity.slice(0, 4)" :key="item.action" :label="item.time" :dot-color="index === 0 ? 'rgb(var(--green-6))' : index === 3 ? 'rgb(var(--red-6))' : undefined" :line-type="index === 2 ? 'dashed' : 'solid'">{{ item.user }} {{ item.action }}</a-timeline-item>
          </a-timeline>
          <a-timeline class="block" direction="horizontal" mode="top" label-position="relative"><a-timeline-item v-for="item in activity.slice(0, 3)" :key="item.action" :label="item.time">{{ item.action }}</a-timeline-item></a-timeline>
        </DemoBlock>

        <DemoBlock name="Tree" arco="a-tree">
          <a-tree v-model:selected-keys="treeSelected" :data="treeData" default-expand-all block-node style="min-width: 220px" />
          <a-tree :data="treeData" checkable default-expand-all show-line style="min-width: 220px" />
          <a-tree :data="treeData" draggable :default-expanded-keys="['0-0']" style="min-width: 220px" />
        </DemoBlock>

        <DemoBlock name="Calendar" arco="a-calendar">
          <a-calendar class="block calendar-demo" :default-value="new Date(2026, 8, 5)" />
          <a-calendar class="block" panel :default-value="new Date(2026, 8, 5)" style="max-width: 320px" />
        </DemoBlock>

        <DemoBlock name="Image" arco="a-image">
          <a-image :width="160" :height="100" src="data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22100%22><rect width=%22160%22 height=%22100%22 fill=%22%23165dff%22/><circle cx=%2280%22 cy=%2250%22 r=%2230%22 fill=%22%2314c9c9%22/></svg>" title="预览图" description="支持点击放大预览" />
          <a-image :width="160" :height="100" src="data:image/png;base64,broken" alt="加载失败" />
          <a-image :width="160" :height="100" src="data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22100%22><rect width=%22160%22 height=%22100%22 fill=%22%23722ed1%22/></svg>" fit="cover" :preview="false" footer-position="outer" title="不可预览" />
          <a-image-preview-group infinite>
            <a-space><a-image :width="80" :height="60" src="data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2260%22><rect width=%2280%22 height=%2260%22 fill=%22%23f7ba1e%22/></svg>" /><a-image :width="80" :height="60" src="data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2260%22><rect width=%2280%22 height=%2260%22 fill=%22%23f53f3f%22/></svg>" /></a-space>
          </a-image-preview-group>
        </DemoBlock>

        <DemoBlock name="Carousel" arco="a-carousel">
          <a-carousel class="block" :style="{ height: '180px', maxWidth: '520px' }" indicator-type="dot" show-arrow="hover" auto-play>
            <a-carousel-item v-for="(item, index) in ['极速搭建', '企业级安全', '实时看板']" :key="item"><div style="height: 100%; display: grid; place-items: center; color: #fff; font-size: 20px" :style="{ background: ['rgb(var(--primary-6))', 'rgb(var(--green-6))', 'rgb(var(--purple-6))'][index] }">{{ item }}</div></a-carousel-item>
          </a-carousel>
          <a-carousel class="block" :style="{ height: '120px', maxWidth: '520px' }" animation-name="card" indicator-type="line" indicator-position="outer">
            <a-carousel-item v-for="n in 4" :key="n"><div style="height: 100%; display: grid; place-items: center; background: var(--color-fill-3); border-radius: 8px">卡片 {{ n }}</div></a-carousel-item>
          </a-carousel>
        </DemoBlock>

        <DemoBlock name="Empty" arco="a-empty">
          <a-empty />
          <a-empty description="暂无订单，先创建一个吧"><a-button type="primary" size="small">新建订单</a-button></a-empty>
          <a-empty description="自定义图标"><template #image><Icon name="inbox" :size="40" /></template></a-empty>
        </DemoBlock>

        <DemoBlock name="Tooltip" arco="a-tooltip">
          <a-tooltip content="顶部提示"><a-button>Top</a-button></a-tooltip>
          <a-tooltip content="底部提示" position="bottom"><a-button>Bottom</a-button></a-tooltip>
          <a-tooltip content="左侧" position="left"><a-button>Left</a-button></a-tooltip>
          <a-tooltip content="右侧" position="right"><a-button>Right</a-button></a-tooltip>
          <a-tooltip content="浅色背景" background-color="#fff" :content-style="{ color: '#1d2129' }" mini><a-button>Mini light</a-button></a-tooltip>
          <a-tooltip content="始终显示" :default-popup-visible="true" position="bl"><a-button type="primary">Always</a-button></a-tooltip>
        </DemoBlock>

        <DemoBlock name="Popover" arco="a-popover">
          <a-popover title="标题" content="这是一段 Popover 内容。"><a-button>Hover</a-button></a-popover>
          <a-popover title="点击触发" trigger="click"><a-button>Click</a-button><template #content><a-space direction="vertical"><span>可放任意内容</span><a-button size="small" type="primary">操作</a-button></a-space></template></a-popover>
          <a-popover title="底部" position="bottom" content="Position bottom"><a-button>Bottom</a-button></a-popover>
          <a-popover title="始终显示" content="用于截图展示" :default-popup-visible="true" position="rt"><a-button type="primary">Always</a-button></a-popover>
        </DemoBlock>

        <DemoBlock name="QRCode" />

        <DemoBlock name="Segmented" arco="a-radio-group type=button">
          <a-radio-group v-model="segmented" type="button"><a-radio value="day">日</a-radio><a-radio value="week">周</a-radio><a-radio value="month">月</a-radio><a-radio value="year" disabled>年</a-radio></a-radio-group>
          <a-radio-group type="button" :default-value="'list'"><a-radio value="list"><Icon name="list" :size="14" /></a-radio><a-radio value="grid"><Icon name="grid" :size="14" /></a-radio></a-radio-group>
          <a-radio-group v-for="size in sizes" :key="size" type="button" :size="size" :default-value="1"><a-radio :value="1">{{ size }}</a-radio><a-radio :value="2">B</a-radio></a-radio-group>
        </DemoBlock>

        <DemoBlock name="Alert" arco="a-alert">
          <div class="block stack">
            <a-alert type="info">这是一条信息提示。</a-alert>
            <a-alert type="success" title="成功" closable>操作已完成，数据已保存。</a-alert>
            <a-alert type="warning" title="警告" show-icon>存储空间即将用尽。</a-alert>
            <a-alert type="error" title="错误" banner>连接服务器失败，请稍后重试。<template #action><a-button size="mini" type="text">重试</a-button></template></a-alert>
            <a-alert type="normal" :show-icon="false" center>无图标居中提示</a-alert>
          </div>
        </DemoBlock>

        <DemoBlock name="Toast" arco="Message">
          <a-button @click="toast('info')">Info</a-button>
          <a-button status="success" @click="toast('success')">Success</a-button>
          <a-button status="warning" @click="toast('warning')">Warning</a-button>
          <a-button status="danger" @click="toast('error')">Error</a-button>
          <a-button @click="Message.loading({ content: '加载中…', duration: 1500 })">Loading</a-button>
          <div class="block stack" style="gap: 6px">
            <div class="arco-message arco-message-success" style="position: static; margin: 0; align-self: flex-start"><span class="arco-message-icon"><Icon name="check-circle" :size="16" /></span><span class="arco-message-content">静态预览：设置已保存</span></div>
            <div class="arco-message arco-message-error" style="position: static; margin: 0; align-self: flex-start"><span class="arco-message-icon"><Icon name="x-circle" :size="16" /></span><span class="arco-message-content">静态预览：保存失败</span></div>
          </div>
        </DemoBlock>

        <DemoBlock name="Notification" arco="Notification">
          <a-button type="primary" @click="notify">打开通知</a-button>
          <a-button @click="Notification.success({ title: '发布成功', content: '版本 v2.3 已上线。', duration: 2000 })">Success</a-button>
          <a-button @click="Notification.warning({ title: '额度预警', content: '本月 API 调用已用 90%。', position: 'bottomRight' })">Bottom right</a-button>
          <div class="block arco-notification arco-notification-info" style="position: static; margin: 0; max-width: 340px">
            <span class="arco-notification-left"><span class="arco-notification-icon"><Icon name="info" :size="20" /></span></span>
            <span class="arco-notification-right"><div class="arco-notification-title">静态预览：新订单</div><div class="arco-notification-content">ORD-2401 已支付，金额 ¥778.72</div></span>
          </div>
        </DemoBlock>

        <DemoBlock name="Dialog" arco="a-modal">
          <a-button type="primary" @click="dialog = true">打开对话框</a-button>
          <a-modal v-model:visible="dialog" title="确认发布" @ok="dialog = false" modal-class="demo-modal">
            <p>发布后所有成员都会收到通知，是否继续？</p>
            <a-alert type="warning" style="margin-top: 8px">该操作会触发 Webhook。</a-alert>
          </a-modal>
          <a-button @click="scrollToStatic">静态预览 ↓</a-button>
          <div id="modal-static" class="block" style="max-width: 420px">
            <div class="arco-modal" style="position: static; margin: 0; box-shadow: 0 0 0 1px var(--color-border-2)">
              <div class="arco-modal-header"><div class="arco-modal-title">静态对话框</div><span class="arco-modal-close-btn"><Icon name="x" :size="14" /></span></div>
              <div class="arco-modal-body">用于截图展示对话框的静态布局。</div>
              <div class="arco-modal-footer"><a-space><a-button>取消</a-button><a-button type="primary">确定</a-button></a-space></div>
            </div>
          </div>
        </DemoBlock>

        <DemoBlock name="Drawer" arco="a-drawer">
          <a-button type="primary" @click="drawer = true">打开抽屉</a-button>
          <a-drawer v-model:visible="drawer" title="订单详情" :width="360" unmount-on-close @ok="drawer = false">
            <a-descriptions :column="1" :data="[{ label: '订单号', value: orders[1]!.id }, { label: '客户', value: orders[1]!.customer }, { label: '金额', value: `¥${orders[1]!.amount}` }]" />
          </a-drawer>
          <div class="block" style="position: relative; height: 200px; overflow: hidden; border: 1px solid var(--color-border-2); border-radius: 6px; max-width: 480px">
            <a-drawer :visible="true" title="静态抽屉" :width="240" :mask="false" popup-container="#drawer-static" :footer="false">内嵌容器中的静态抽屉。</a-drawer>
            <div id="drawer-static" style="position: absolute; inset: 0" />
          </div>
        </DemoBlock>

        <DemoBlock name="Progress" arco="a-progress">
          <div class="block grid grid-2">
            <a-progress v-model:percent="progress" />
            <a-progress :percent="0.7" status="success" />
            <a-progress :percent="0.4" status="warning" />
            <a-progress :percent="0.2" status="danger" />
            <a-progress :percent="0.5" size="large" :show-text="false" />
            <a-progress :percent="0.5" size="mini" />
            <a-progress :percent="0.6" :steps="5" />
            <a-progress :percent="0.8" animation />
          </div>
          <a-progress type="circle" :percent="0.45" />
          <a-progress type="circle" :percent="1" status="success" />
          <a-progress type="circle" :percent="0.3" size="small" status="danger" />
          <a-progress type="circle" :percent="0.75" size="large" />
        </DemoBlock>

        <DemoBlock name="Skeleton" arco="a-skeleton">
          <a-skeleton class="block" animation>
            <a-space direction="vertical" fill>
              <a-space><a-skeleton-shape shape="circle" /><a-skeleton-line :rows="1" :widths="['160px']" /></a-space>
              <a-skeleton-line :rows="3" :widths="['100%', '80%', '60%']" />
              <a-skeleton-shape shape="square" style="width: 100%; height: 80px" />
            </a-space>
          </a-skeleton>
          <a-skeleton :animation="false"><a-skeleton-line :rows="2" /></a-skeleton>
        </DemoBlock>

        <DemoBlock name="Spinner" arco="a-spin">
          <a-spin />
          <a-spin :size="32" />
          <a-spin dot />
          <a-spin tip="加载中…" />
          <a-spin loading tip="加载中" class="block" style="max-width: 320px"><a-card title="被遮罩的内容">Spin 可包裹任意区域。</a-card></a-spin>
          <a-spin><template #icon><Icon name="loader" /></template></a-spin>
        </DemoBlock>

        <DemoBlock name="Result" arco="a-result">
          <div class="block grid grid-2">
            <a-result status="success" title="提交成功" subtitle="我们已收到你的申请。"><template #extra><a-button type="primary" size="small">返回</a-button></template></a-result>
            <a-result status="error" title="提交失败" subtitle="请检查网络后重试。" />
            <a-result status="warning" title="存在风险" subtitle="部分字段未通过校验。" />
            <a-result status="info" title="处理中" subtitle="预计 5 分钟后完成。" />
            <a-result status="403" subtitle="没有访问权限" />
            <a-result status="404" subtitle="页面不存在" />
            <a-result status="500" subtitle="服务器开小差了" />
            <a-result :status="null" title="自定义图标"><template #icon><Icon name="smile" :size="48" /></template></a-result>
          </div>
        </DemoBlock>

        <DemoBlock name="Popconfirm" arco="a-popconfirm">
          <a-popconfirm content="确定要删除这条订单吗？"><a-button status="danger">删除</a-button></a-popconfirm>
          <a-popconfirm content="确认发布到生产环境？" type="warning" ok-text="发布" cancel-text="再想想"><a-button type="primary">发布</a-button></a-popconfirm>
          <a-popconfirm content="操作成功后不可撤销" type="error" position="bottom"><a-button>Error</a-button></a-popconfirm>
          <a-popconfirm content="始终显示" type="success" :default-popup-visible="true" position="rt"><a-button>Always</a-button></a-popconfirm>
        </DemoBlock>

        <DemoBlock name="Menu" arco="a-menu">
          <a-menu class="block" mode="horizontal" :default-selected-keys="['1']" style="border-radius: 6px"><a-menu-item key="1">仪表盘</a-menu-item><a-menu-item key="2">订单</a-menu-item><a-sub-menu key="3" title="设置"><a-menu-item key="3-1">个人</a-menu-item><a-menu-item key="3-2">团队</a-menu-item></a-sub-menu><a-menu-item key="4" disabled>禁用</a-menu-item></a-menu>
          <a-menu :default-selected-keys="['orders']" :default-open-keys="['more']" style="width: 220px; border-radius: 6px">
            <a-menu-item v-for="item in nav.slice(0, 3)" :key="item.key"><template #icon><Icon :name="item.icon" /></template>{{ item.label }}</a-menu-item>
            <a-sub-menu key="more" title="更多"><template #icon><Icon name="more-horizontal" /></template><a-menu-item v-for="item in nav.slice(3)" :key="item.key">{{ item.label }}</a-menu-item></a-sub-menu>
          </a-menu>
          <a-menu :default-selected-keys="['orders']" collapsed style="border-radius: 6px"><a-menu-item v-for="item in nav" :key="item.key"><template #icon><Icon :name="item.icon" /></template>{{ item.label }}</a-menu-item></a-menu>
          <a-menu theme="dark" :default-selected-keys="['orders']" style="width: 200px; border-radius: 6px"><a-menu-item v-for="item in nav.slice(0, 4)" :key="item.key"><template #icon><Icon :name="item.icon" /></template>{{ item.label }}</a-menu-item></a-menu>
        </DemoBlock>

        <DemoBlock name="Dropdown" arco="a-dropdown">
          <a-dropdown><a-button>Hover <Icon name="chevron-down" :size="14" /></a-button><template #content><a-doption>查看</a-doption><a-doption>编辑</a-doption><a-doption disabled>禁用</a-doption><a-doption style="color: rgb(var(--red-6))">删除</a-doption></template></a-dropdown>
          <a-dropdown trigger="click" position="bottom"><a-button type="primary">Click</a-button><template #content><a-dgroup title="分组"><a-doption><template #icon><Icon name="user" /></template>个人资料</a-doption><a-doption><template #icon><Icon name="settings" /></template>设置</a-doption></a-dgroup><a-dsubmenu trigger="hover"><template #default>更多</template><template #content><a-doption>子项 A</a-doption><a-doption>子项 B</a-doption></template></a-dsubmenu></template></a-dropdown>
          <a-dropdown-button>操作<template #icon><Icon name="chevron-down" :size="14" /></template><template #content><a-doption>导出</a-doption><a-doption>归档</a-doption></template></a-dropdown-button>
          <a-dropdown :default-popup-visible="true" position="bl"><a-button>Always</a-button><template #content><a-doption>始终展开</a-doption><a-doption>用于截图</a-doption></template></a-dropdown>
        </DemoBlock>

        <DemoBlock name="Breadcrumb" arco="a-breadcrumb">
          <a-breadcrumb><a-breadcrumb-item><Icon name="home" :size="14" /></a-breadcrumb-item><a-breadcrumb-item>订单</a-breadcrumb-item><a-breadcrumb-item>ORD-2401</a-breadcrumb-item></a-breadcrumb>
          <a-breadcrumb separator="/"><a-breadcrumb-item>首页</a-breadcrumb-item><a-breadcrumb-item>设置</a-breadcrumb-item><a-breadcrumb-item>团队</a-breadcrumb-item></a-breadcrumb>
          <a-breadcrumb :max-count="3" :routes="[{ path: '/', label: '首页' }, { path: '/a', label: '一级' }, { path: '/b', label: '二级' }, { path: '/c', label: '三级' }, { path: '/d', label: '当前' }]" />
        </DemoBlock>

        <DemoBlock name="Tabs" arco="a-tabs">
          <a-tabs class="block" default-active-key="1"><a-tab-pane key="1" title="线型">线型 Tabs 内容</a-tab-pane><a-tab-pane key="2" title="订单">订单</a-tab-pane><a-tab-pane key="3" title="禁用" disabled>禁用</a-tab-pane></a-tabs>
          <a-tabs class="block" type="card" default-active-key="1" editable show-add-button><a-tab-pane key="1" title="卡片一">card</a-tab-pane><a-tab-pane key="2" title="卡片二">card 2</a-tab-pane></a-tabs>
          <a-tabs class="block" type="card-gutter" default-active-key="1"><a-tab-pane key="1" title="card-gutter">gutter</a-tab-pane><a-tab-pane key="2" title="二">2</a-tab-pane></a-tabs>
          <a-tabs class="block" type="rounded" default-active-key="1" size="small"><a-tab-pane key="1" title="rounded">rounded</a-tab-pane><a-tab-pane key="2" title="二">2</a-tab-pane></a-tabs>
          <a-tabs class="block" type="capsule" default-active-key="1" size="mini"><a-tab-pane key="1" title="capsule">capsule</a-tab-pane><a-tab-pane key="2" title="二">2</a-tab-pane></a-tabs>
          <a-tabs class="block" type="text" default-active-key="1" size="large"><a-tab-pane key="1" title="text large">text</a-tab-pane><a-tab-pane key="2" title="二">2</a-tab-pane></a-tabs>
          <a-tabs position="left" default-active-key="1" style="height: 120px"><a-tab-pane key="1" title="左侧">垂直 Tabs</a-tab-pane><a-tab-pane key="2" title="二">2</a-tab-pane></a-tabs>
        </DemoBlock>

        <DemoBlock name="Pagination" arco="a-pagination">
          <a-pagination class="block" :total="200" :simple="isMobile" :show-total="!isMobile" :show-jumper="!isMobile" :show-page-size="!isMobile" />
          <a-pagination class="block" :total="50" simple />
          <a-pagination class="block" :total="50" size="mini" />
          <a-pagination class="block" :total="50" size="small" />
          <a-pagination class="block" :total="50" size="large" />
          <a-pagination class="block" :total="50" disabled />
        </DemoBlock>

        <DemoBlock name="Steps" arco="a-steps">
          <a-steps class="block" :current="2" :direction="isMobile ? 'vertical' : 'horizontal'"><a-step description="填写基础信息">基础信息</a-step><a-step description="配置成员与预算">详细配置</a-step><a-step description="确认并提交">确认</a-step></a-steps>
          <a-steps class="block" :current="2" status="error" small><a-step>已完成</a-step><a-step>出错</a-step><a-step>等待</a-step></a-steps>
          <a-steps class="block" type="dot" :current="2"><a-step>Dot 一</a-step><a-step>Dot 二</a-step><a-step>Dot 三</a-step></a-steps>
          <a-steps class="block" type="arrow" :current="2" small><a-step>Arrow 一</a-step><a-step>Arrow 二</a-step><a-step>Arrow 三</a-step></a-steps>
          <a-steps type="navigation" :current="1" style="width: 100%; max-width: 480px"><a-step>Nav 一</a-step><a-step>Nav 二</a-step><a-step>Nav 三</a-step></a-steps>
          <a-steps direction="vertical" :current="2" style="height: 160px"><a-step description="垂直步骤">完成</a-step><a-step>进行中</a-step><a-step>等待</a-step></a-steps>
        </DemoBlock>

        <DemoBlock name="Anchor" arco="a-anchor">
          <a-anchor :change-hash="false" line-less style="min-width: 160px"><a-anchor-link href="#Button" title="Button" /><a-anchor-link href="#Table" title="Table"><a-anchor-link href="#DataGrid" title="DataGrid" /></a-anchor-link><a-anchor-link href="#Tabs" title="Tabs" /></a-anchor>
          <a-anchor :change-hash="false" direction="horizontal" style="min-width: 240px"><a-anchor-link href="#Input" title="Input" /><a-anchor-link href="#Select" title="Select" /><a-anchor-link href="#Form" title="Form" /></a-anchor>
        </DemoBlock>

        <DemoBlock name="BackTop" arco="a-back-top">
          <a-back-top :visible-height="300" target-container="html" :style="{ position: 'absolute', right: '24px', bottom: '80px' }" />
          <div class="block" style="position: relative; height: 140px; overflow: auto; border: 1px solid var(--color-border-2); border-radius: 6px" id="backtop-demo">
            <div style="height: 480px; padding: 12px">滚动此区域后右下角出现 BackTop。页面右下角也有全局 BackTop（滚动超过 300px 可见）。</div>
            <a-back-top target-container="#backtop-demo" :visible-height="40" :style="{ position: 'absolute', right: '12px', bottom: '12px' }"><a-button type="primary" shape="circle"><template #icon><Icon name="arrow-up" /></template></a-button></a-back-top>
          </div>
        </DemoBlock>

        <DemoBlock name="Affix" arco="a-affix">
          <div class="block" id="affix-demo" style="height: 160px; overflow: auto; border: 1px solid var(--color-border-2); border-radius: 6px; padding: 12px">
            <div style="height: 60px">向下滚动此容器，按钮将固定在顶部。</div>
            <a-affix target="#affix-demo" :offset-top="8"><a-button type="primary">Affix 固定按钮</a-button></a-affix>
            <div style="height: 320px" />
          </div>
        </DemoBlock>

        <DemoBlock name="Navbar" arco="a-layout-header + a-menu horizontal">
          <a-layout class="block" style="border: 1px solid var(--color-border-2); border-radius: 6px; overflow: hidden">
            <a-layout-header style="display: flex; align-items: center; gap: 12px; padding: 0 16px; height: 56px; background: var(--color-bg-2)">
              <a-avatar :size="28" shape="square" :style="{ backgroundColor: 'rgb(var(--primary-6))' }">A</a-avatar>
              <strong class="hide-mobile">Acme</strong>
              <a-menu mode="horizontal" :default-selected-keys="['dashboard']" style="flex: 1; background: transparent"><a-menu-item v-for="item in nav.slice(0, 4)" :key="item.key">{{ item.label }}</a-menu-item></a-menu>
              <a-input-search placeholder="搜索" size="small" style="width: 140px" class="hide-mobile" />
              <a-badge :count="3" dot><a-button type="text" shape="circle" size="small"><template #icon><Icon name="bell" /></template></a-button></a-badge>
              <a-avatar :size="28">林</a-avatar>
            </a-layout-header>
          </a-layout>
        </DemoBlock>

        <DemoBlock name="Sidebar" arco="a-layout-sider + a-menu">
          <a-layout class="block" style="height: 260px; border: 1px solid var(--color-border-2); border-radius: 6px; overflow: hidden">
            <a-layout-sider collapsible :width="200" breakpoint="xl" style="box-shadow: none; border-right: 1px solid var(--color-border-2)">
              <div style="padding: 12px 16px; font-weight: 600">Acme</div>
              <a-menu :default-selected-keys="['orders']"><a-menu-item v-for="item in nav" :key="item.key"><template #icon><Icon :name="item.icon" /></template>{{ item.label }}</a-menu-item></a-menu>
            </a-layout-sider>
            <a-layout-content style="padding: 16px; background: var(--color-fill-1)">内容区（可点击底部触发器折叠侧栏）</a-layout-content>
          </a-layout>
        </DemoBlock>

        <DemoBlock name="CommandPalette" arco="a-modal + a-input + a-list">
          <a-button @click="palette = true"><template #icon><Icon name="search" /></template>打开命令面板 <span class="kbd" style="margin-left: 6px">⌘K</span></a-button>
          <a-modal v-model:visible="palette" :footer="false" :closable="false" :width="520" top="15vh" :align-center="false" modal-class="palette-modal">
            <a-input v-model="paletteQuery" placeholder="搜索页面或命令…" size="large" allow-clear autofocus><template #prefix><Icon name="search" /></template></a-input>
            <a-list :bordered="false" size="small" style="margin-top: 8px; max-height: 300px; overflow: auto" hoverable>
              <a-list-item v-for="item in paletteItems" :key="item.key" style="cursor: pointer" @click="palette = false"><a-space><Icon :name="item.icon" :size="16" />{{ item.label }}</a-space><template #actions><span class="kbd">↵</span></template></a-list-item>
              <a-empty v-if="!paletteItems.length" description="没有匹配结果" />
            </a-list>
          </a-modal>
          <div class="block" style="max-width: 480px; border: 1px solid var(--color-border-2); border-radius: 8px; padding: 8px; background: var(--color-bg-2)">
            <a-input placeholder="静态预览：搜索页面或命令…" allow-clear><template #prefix><Icon name="search" /></template></a-input>
            <a-list :bordered="false" size="small" style="margin-top: 8px" hoverable><a-list-item v-for="item in nav.slice(0, 4)" :key="item.key"><a-space><Icon :name="item.icon" :size="16" />{{ item.label }}</a-space><template #actions><span class="kbd">↵</span></template></a-list-item></a-list>
          </div>
        </DemoBlock>

        <DemoBlock name="Grid" arco="a-row / a-col">
          <a-row class="block" :gutter="[12, 12]">
            <a-col v-for="span in [24, 12, 12, 8, 8, 8, 6, 6, 6, 6]" :key="`${span}-${Math.random()}`" :span="span"><div class="grid-cell">span {{ span }}</div></a-col>
          </a-row>
          <a-row class="block grid-offset-demo" :gutter="12"><a-col :xs="24" :sm="12" :md="8" :lg="6"><div class="grid-cell">响应式</div></a-col><a-col :xs="24" :sm="12" :md="8" :lg="6"><div class="grid-cell">xs/sm/md/lg</div></a-col><a-col :xs="24" :sm="12" :md="8" :lg="6" :offset="6"><div class="grid-cell">offset 6</div></a-col></a-row>
          <a-grid class="block" :cols="{ xs: 1, sm: 2, md: 3 }" :col-gap="12" :row-gap="12"><a-grid-item v-for="n in 3" :key="n"><div class="grid-cell">a-grid {{ n }}</div></a-grid-item></a-grid>
        </DemoBlock>

        <DemoBlock name="Stack" arco="a-space">
          <a-space><a-button>横向</a-button><a-button>间距</a-button><a-button>默认</a-button></a-space>
          <a-space size="large" direction="vertical"><a-button>纵向</a-button><a-button>large</a-button></a-space>
          <a-space size="mini" wrap><a-tag v-for="n in 8" :key="n">wrap {{ n }}</a-tag></a-space>
          <a-space align="end" :size="[8, 16]"><a-button size="mini">end</a-button><a-button size="large">对齐</a-button></a-space>
          <a-space split><span>分隔</span><span>Space</span><span>split</span></a-space>
        </DemoBlock>

        <DemoBlock name="Layout" arco="a-layout">
          <a-layout class="block" style="height: 200px; border: 1px solid var(--color-border-2); border-radius: 6px; overflow: hidden; text-align: center">
            <a-layout-header style="background: rgb(var(--primary-6)); color: #fff; padding: 8px">Header</a-layout-header>
            <a-layout>
              <a-layout-sider style="background: rgb(var(--primary-4)); color: #fff; padding: 8px; box-shadow: none; width: 80px">Sider</a-layout-sider>
              <a-layout-content style="background: rgb(var(--primary-2)); padding: 8px">Content</a-layout-content>
            </a-layout>
            <a-layout-footer style="background: rgb(var(--primary-6)); color: #fff; padding: 8px">Footer</a-layout-footer>
          </a-layout>
        </DemoBlock>

        <DemoBlock name="Container" arco="max-width wrapper">
          <div class="block" style="background: var(--color-fill-2); padding: 12px; border-radius: 6px">
            <div style="max-width: 640px; margin: 0 auto; padding: 12px; background: var(--color-bg-1); border: 1px dashed var(--color-border-3); border-radius: 6px; text-align: center">max-width: 640px 居中容器</div>
            <div style="max-width: 400px; margin: 12px auto 0; padding: 12px; background: var(--color-bg-1); border: 1px dashed var(--color-border-3); border-radius: 6px; text-align: center">max-width: 400px</div>
          </div>
        </DemoBlock>

        <DemoBlock name="AspectRatio" arco="CSS aspect-ratio">
          <div v-for="ratio in ['16 / 9', '4 / 3', '1 / 1']" :key="ratio" class="grid-cell" :style="{ aspectRatio: ratio, width: '160px', display: 'grid', placeItems: 'center' }">{{ ratio }}</div>
        </DemoBlock>

        <DemoBlock name="Resizable" arco="a-split / a-resize-box">
          <a-split :default-size="0.4" min="120px" max="80%" class="block" :style="{ height: '160px', border: '1px solid var(--color-border-2)', borderRadius: '6px' }">
            <template #first><div style="padding: 12px">左侧面板（拖动分隔线）</div></template>
            <template #second><a-split direction="vertical" :default-size="0.5" min="20%" max="80%" style="height: 100%"><template #first><div style="padding: 12px">右上</div></template><template #second><div style="padding: 12px">右下</div></template></a-split></template>
          </a-split>
          <a-resize-box :directions="['right', 'bottom']" :width="240" :height="100" style="border: 1px solid var(--color-border-2); border-radius: 6px; padding: 12px; background: var(--color-fill-1)">ResizeBox：拖动右/下边缘</a-resize-box>
        </DemoBlock>

        <DemoBlock name="ScrollArea" arco="a-scrollbar">
          <a-scrollbar style="height: 160px; overflow: auto; width: 100%; max-width: 480px" outer-class="block">
            <div style="padding: 0 12px"><p v-for="n in 12" :key="n" style="margin: 8px 0">滚动内容第 {{ n }} 行 — 自定义滚动条样式。</p></div>
          </a-scrollbar>
          <a-scrollbar style="width: 320px; overflow: auto" type="track"><div style="width: 900px; padding: 12px; background: var(--color-fill-1)">横向滚动内容（track 类型滚动条）</div></a-scrollbar>
        </DemoBlock>

        <DemoBlock name="Accordion" arco="a-collapse accordion">
          <a-collapse class="block" accordion :default-active-key="['1']">
            <a-collapse-item key="1" header="可以免费试用吗？">Starter 计划永久免费，无需信用卡。</a-collapse-item>
            <a-collapse-item key="2" header="支持私有部署吗？">Enterprise 计划支持私有云与本地部署。</a-collapse-item>
            <a-collapse-item key="3" header="禁用项" disabled>—</a-collapse-item>
          </a-collapse>
          <a-collapse class="block" :bordered="false" expand-icon-position="right" :default-active-key="['a']"><a-collapse-item key="a" header="无边框 / 图标在右"><template #extra><a-tag size="small">extra</a-tag></template>内容</a-collapse-item><a-collapse-item key="b" header="第二项">内容</a-collapse-item></a-collapse>
        </DemoBlock>

        <DemoBlock name="ThemeProvider" arco="a-config-provider">
          <a-config-provider size="large" :global="false">
            <a-space><a-button type="primary">Provider 统一 large</a-button><a-input placeholder="尺寸继承" style="width: 160px" /></a-space>
          </a-config-provider>
          <a-config-provider size="mini"><a-space><a-button type="primary">mini</a-button><a-select placeholder="mini" style="width: 120px" /></a-space></a-config-provider>
          <a-tag>当前主题：{{ theme }}（body[arco-theme]）</a-tag>
        </DemoBlock>

        <DemoBlock name="Watermark" arco="a-watermark">
          <a-watermark class="block" content="Acme Console" :gap="[40, 40]"><div style="height: 140px; padding: 12px; background: var(--color-fill-1); border-radius: 6px">文字水印覆盖区域</div></a-watermark>
          <a-watermark class="block" :content="['内部资料', '请勿外传']" :font="{ color: 'rgba(245,63,63,0.25)', fontSize: 14 }" :rotate="-30"><div style="height: 120px; padding: 12px; background: var(--color-fill-1); border-radius: 6px">多行水印</div></a-watermark>
        </DemoBlock>

        <DemoBlock name="Tour" />

        <DemoBlock name="FloatButton" arco="a-back-top 样式浮动按钮">
          <div class="block" style="position: relative; height: 140px; background: var(--color-fill-1); border-radius: 6px">
            <a-space direction="vertical" style="position: absolute; right: 16px; bottom: 16px">
              <a-tooltip content="帮助" position="left"><a-button type="secondary" shape="circle" size="large"><template #icon><Icon name="help-circle" /></template></a-button></a-tooltip>
              <a-badge :count="2"><a-button type="primary" shape="circle" size="large"><template #icon><Icon name="message-square" /></template></a-button></a-badge>
            </a-space>
          </div>
        </DemoBlock>

        <DemoBlock name="Kbd" arco="自定义 .kbd 样式">
          <span class="kbd">⌘</span><span class="kbd">K</span><span class="kbd">Shift</span><span class="kbd">Enter</span><span class="kbd">Esc</span>
          <a-space size="mini"><span class="kbd">Ctrl</span>+<span class="kbd">C</span></a-space>
        </DemoBlock>

        <DemoBlock name="Code" arco="a-typography-text code">
          <a-typography-text code>pnpm install @arco-design/web-vue</a-typography-text>
          <a-typography-paragraph class="block" code style="margin: 0"><pre style="margin: 0; white-space: pre-wrap">import ArcoVue from "@arco-design/web-vue"
import "@arco-design/web-vue/dist/arco.css"
createApp(App).use(ArcoVue).mount("#app")</pre></a-typography-paragraph>
          <a-typography-text copyable :copy-text="'createApp(App).use(ArcoVue)'">带复制按钮的代码</a-typography-text>
        </DemoBlock>

        <DemoBlock name="Divider" arco="a-divider">
          <div class="block"><span>上方</span><a-divider /><span>下方</span></div>
          <a-divider class="block" orientation="left">左标题</a-divider>
          <a-divider class="block" orientation="center" type="dashed">虚线居中</a-divider>
          <a-divider class="block" orientation="right" type="dotted">右标题（点线）</a-divider>
          <a-space><span>A</span><a-divider direction="vertical" /><span>B</span><a-divider direction="vertical" /><span>C</span></a-space>
        </DemoBlock>

        <DemoBlock name="Link" arco="a-link">
          <a-link>默认链接</a-link>
          <a-link status="success">Success</a-link>
          <a-link status="warning">Warning</a-link>
          <a-link status="danger">Danger</a-link>
          <a-link disabled>禁用</a-link>
          <a-link icon>带图标</a-link>
          <a-link :hoverable="false">无 hover 背景</a-link>
          <a-link href="https://arco.design" target="_blank" rel="noreferrer">外链<template #icon><Icon name="external-link" :size="14" /></template></a-link>
        </DemoBlock>
      </div>

      <aside class="components-anchor hide-mobile">
        <a-anchor :change-hash="false" line-less :boundary="80" smooth style="max-height: calc(100vh - 120px); overflow: auto">
          <a-anchor-link v-for="name in names" :key="name" :href="`#${name}`">
            <a-space size="mini"><span>{{ name }}</span><a-tag v-if="coverage[name] !== 'implemented'" :color="coverage[name] === 'composed' ? 'orange' : 'red'" size="small">{{ coverage[name] }}</a-tag></a-space>
          </a-anchor-link>
        </a-anchor>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.components-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 24px;
  align-items: start;
}

.components-layout > .stack {
  grid-template-columns: minmax(0, 1fr);
}

.components-layout > .stack > :deep(.demo) {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.components-anchor {
  position: sticky;
  top: 76px;
  min-width: 0;
  overflow: hidden;
}

.components-anchor :deep(.arco-anchor-link-item) {
  padding: 2px 0;
}

.components-anchor :deep(.arco-anchor-link) {
  font-size: 12px;
}

.grid-cell {
  background: rgb(var(--primary-2));
  color: rgb(var(--primary-7));
  border-radius: 4px;
  padding: 8px;
  text-align: center;
  font-size: 12px;
}

.slider-demo {
  min-width: 0;
}

.calendar-demo {
  width: 100%;
  max-width: 100%;
}

#modal-static {
  max-width: 100% !important;
}

#modal-static :deep(.arco-modal) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

:global(.kbd) {
  display: inline-block;
  min-width: 20px;
  padding: 1px 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: var(--color-text-2);
  background: var(--color-fill-2);
  border: 1px solid var(--color-border-3);
  border-bottom-width: 2px;
  border-radius: 4px;
}

@media (max-width: 1023px) {
  .components-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 767px) {
  :deep(.transfer-demo .arco-transfer-view) {
    width: calc(50% - 22px);
    min-width: 0;
  }

  :deep(.transfer-demo .arco-transfer-panel) {
    min-width: 0;
  }

  :deep(.arco-slider-with-marks) {
    box-sizing: border-box;
    width: 100%;
  }

  :deep(.arco-steps-label-vertical .arco-steps-item-content) {
    width: auto;
    min-width: 0;
  }

  :deep(.arco-steps-label-vertical .arco-steps-item) {
    min-width: 0;
    flex: 1;
  }

  :deep(.grid-offset-demo .arco-col-offset-6) {
    margin-left: 0;
  }

  :global(.demo-modal .arco-modal) {
    width: calc(100vw - 32px) !important;
    max-width: calc(100vw - 32px);
  }
}
</style>
