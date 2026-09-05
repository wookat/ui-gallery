<script setup lang="ts">
import { h, ref } from "vue"
import {
  NCard, NTag, NFlex, NSpace, NText, NH1, NH2, NH3, NH4, NH5, NH6, NP, NBlockquote, NUl, NOl, NLi, NA, NGradientText, NButton, NButtonGroup, NInput, NInputGroup, NInputNumber, NSelect, NAutoComplete, NCheckbox, NCheckboxGroup, NRadio, NRadioGroup, NRadioButton, NSwitch, NSlider, NRate, NDatePicker, NTimePicker, NColorPicker, NUpload, NUploadDragger, NCascader, NTransfer, NMention, NInputOtp, NForm, NFormItem, NTable, NDataTable, NDescriptions, NDescriptionsItem, NList, NListItem, NThing, NAvatar, NAvatarGroup, NBadge, NStatistic, NTimeline, NTimelineItem, NTree, NCalendar, NImage, NImageGroup, NCarousel, NEmpty, NTooltip, NPopover, NQrCode, NTabs, NTab, NTabPane, NAlert, NModal, NDrawer, NDrawerContent, NProgress, NSkeleton, NSpin, NResult, NPopconfirm, NMenu, NDropdown, NBreadcrumb, NBreadcrumbItem, NPagination, NSteps, NStep, NAnchor, NAnchorLink, NBackTop, NAffix, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NLayoutFooter, NGrid, NGi, NSplit, NScrollbar, NCollapse, NCollapseItem, NConfigProvider, NWatermark, NFloatButton, NFloatButtonGroup, NCode, NDivider, NIcon, NEllipsis, NNumberAnimation, NCountdown, NTime, NDynamicTags, NDynamicInput, NTreeSelect, NPopselect, NMarquee, NLog, NHighlight,
  useMessage, useNotification, useDialog, useLoadingBar, darkTheme, type DataTableColumns, type TreeOption, type CascaderOption, type MenuOption, type UploadFileInfo,
} from "naive-ui"
import orders from "@ui-gallery/spec/mock/orders.json"
import team from "@ui-gallery/spec/mock/team.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import PageHeader from "../components/PageHeader.vue"
import StatusTag from "../components/StatusTag.vue"
import { Icon, renderIcon, type IconName } from "../icons"
import { componentNames, coverage, slug, type Coverage } from "./components-data"
import { formatMoney, useIsMobile } from "../composables"
import { isDark } from "../settings"

const isMobile = useIsMobile()
const message = useMessage()
const notification = useNotification()
const dialog = useDialog()
const loadingBar = useLoadingBar()

const coverageType: Record<Coverage, "success" | "warning" | "error"> = { implemented: "success", composed: "warning", missing: "error" }
const coverageLabel: Record<Coverage, string> = { implemented: "已实现", composed: "组合实现", missing: "缺失" }
const btnTypes = ["default", "primary", "info", "success", "warning", "error"] as const
const sizes = ["tiny", "small", "medium", "large"] as const
const sel = ["paid", "pending", "shipped", "refunded", "failed"].map((v) => ({ label: v, value: v }))
const members = team.map((m) => ({ label: m.name, value: m.email }))
const navItems = nav.slice(0, 5).map((n) => ({ label: n.label, key: n.path, icon: renderIcon(n.icon as IconName, 16) }))

const text = ref("")
const num = ref<number | null>(42)
const single = ref<string | null>("paid")
const multi = ref<string[]>(["paid", "shipped"])
const combo = ref<string | null>(null)
const auto = ref("")
const autoOptions = (q: string) => ["gmail.com", "outlook.com", "acme.dev"].map((d) => ({ label: `${q.split("@")[0] || "name"}@${d}`, value: `${q.split("@")[0] || "name"}@${d}` }))
const checks = ref(["a"])
const radio = ref("a")
const seg = ref("day")
const on = ref(true)
const slider = ref(35)
const sliderRange = ref<[number, number]>([20, 60])
const rate = ref(3.5)
const date = ref<number | null>(Date.now())
const time = ref<number | null>(null)
const range = ref<[number, number] | null>(null)
const color = ref("#18A058")
const files = ref<UploadFileInfo[]>([{ id: "1", name: "季度报表.pdf", status: "finished" }, { id: "2", name: "封面.png", status: "error" }, { id: "3", name: "上传中.csv", status: "uploading", percentage: 40 }])
const cascader = ref<string | null>(null)
const cascaderOptions: CascaderOption[] = [{ label: "亚太", value: "apac", children: [{ label: "中国大陆", value: "cn" }, { label: "新加坡", value: "sg" }] }, { label: "欧洲", value: "eu", children: [{ label: "法兰克福", value: "fra" }] }]
const transferValue = ref<string[]>([team[0]!.email])
const mention = ref("")
const otp = ref<string[]>([])
const form = ref({ name: "", agree: false })
const formRef = ref()
const treeData: TreeOption[] = [{ label: "工作区", key: "ws", children: [{ label: "订单", key: "orders", children: [{ label: "2026-09", key: "m9" }, { label: "2026-08", key: "m8" }] }, { label: "客户", key: "customers" }] }]
const calendarValue = ref(Date.now())
const showModal = ref(false)
const showDrawer = ref(false)
const showCmd = ref(false)
const cmdQuery = ref("")
const tab = ref("a")
const page = ref(1)
const step = ref(2)
const spinShow = ref(true)
const splitSize = ref(0.4)
const dynTags = ref(["vue", "naive-ui"])
const dynInputs = ref(["林晓", "王子涵"])
const treeSelect = ref<string | null>(null)
const popsel = ref<string | null>(null)
const themeInvert = ref(false)
const progress = ref(62)

type Order = (typeof orders)[number]
const columns: DataTableColumns<Order> = [
  { type: "selection" },
  { title: "订单", key: "id", sorter: "default" },
  { title: "客户", key: "customer" },
  { title: "状态", key: "status", filterOptions: sel, filter: (v, row) => row.status === v, render: (row) => h(StatusTag, { value: row.status }) },
  { title: "金额", key: "amount", align: "right", sorter: (a, b) => a.amount - b.amount, render: (row) => formatMoney(row.amount) },
]
const menuOptions: MenuOption[] = navItems
const dropdownOptions = [{ label: "编辑", key: "edit", icon: renderIcon("pencil") }, { label: "复制", key: "copy", icon: renderIcon("copy") }, { type: "divider", key: "d" }, { label: "删除", key: "delete", icon: renderIcon("trash") }]
const cmdItems = nav.map((n) => ({ label: n.label, href: n.path, icon: n.icon as IconName }))

function toast(type: "info" | "success" | "warning" | "error" | "loading") { message[type](`这是一条 ${type} 消息`) }
function notify(type: "info" | "success" | "warning" | "error") { const n = notifications[0]!; notification[type]({ title: n.title, content: activity[0]!.action, meta: n.time, duration: 3000 }) }
function openDialog() { dialog.warning({ title: "确认操作", content: "此操作将同步所有配置，是否继续？", positiveText: "继续", negativeText: "取消", onPositiveClick: () => message.success("已确认") }) }
function runLoadingBar() { loadingBar.start(); setTimeout(() => loadingBar.finish(), 1200) }
const svgImg = (c: string) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%' height='100%' fill='${c}'/></svg>`)}`
</script>

<template>
  <NSpace vertical :size="20">
    <PageHeader title="组件" :description="`contract.json 中共 ${componentNames.length} 个组件；标签表示 Naive UI 的覆盖情况。`">
      <template #action><NFlex :size="6"><NTag v-for="(l, k) in coverageLabel" :key="k" :type="coverageType[k]" size="small" round :bordered="false">{{ l }} {{ componentNames.filter((n) => coverage[n] === k).length }}</NTag></NFlex></template>
    </PageHeader>
    <NCard size="small" title="组件索引" id="index">
      <NFlex :size="6" :wrap="true">
        <NButton v-for="name in componentNames" :key="name" size="medium" secondary round tag="a" :href="`#${slug(name)}`" :type="coverage[name] === 'implemented' ? 'default' : coverageType[coverage[name]!]">{{ name }}</NButton>
      </NFlex>
    </NCard>

    <template v-for="name in componentNames" :key="name">
      <NCard :id="slug(name)" size="small" style="scroll-margin-top: 72px">
        <template #header><NFlex align="center" :size="8"><NText strong>{{ name }}</NText><NTag :type="coverageType[coverage[name]!]" size="small" round :bordered="false">{{ coverageLabel[coverage[name]!] }}</NTag></NFlex></template>
        <template #header-extra><NA href="#index" style="font-size: 12px">返回索引</NA></template>

        <NSpace v-if="name === 'Typography'" vertical>
          <NH1 style="margin: 0">标题 H1</NH1><NH2 style="margin: 0">标题 H2</NH2><NH3 style="margin: 0">标题 H3</NH3><NH4 style="margin: 0">标题 H4</NH4><NH5 style="margin: 0">标题 H5</NH5><NH6 style="margin: 0">标题 H6</NH6>
          <NP>正文段落：Naive UI 是一个 Vue 3 组件库，<NText strong>加粗</NText>、<NText italic>斜体</NText>、<NText underline>下划线</NText>、<NText delete>删除线</NText>、<NText code>code</NText>、<NText type="success">成功色</NText>、<NText depth="3">次要文本</NText>。</NP>
          <NGradientText type="success" :size="20">渐变文本 Gradient</NGradientText>
          <NBlockquote>引用：把团队的工作放进一个控制台。</NBlockquote>
          <NFlex><NUl><NLi>无序列表 A</NLi><NLi>无序列表 B</NLi></NUl><NOl><NLi>有序列表 1</NLi><NLi>有序列表 2</NLi></NOl></NFlex>
          <NEllipsis style="max-width: 240px">这是一段会被省略的很长很长的文本，超出后显示省略号并可悬停查看全文。</NEllipsis>
        </NSpace>

        <NSpace v-else-if="name === 'Button'" vertical>
          <NFlex v-for="s in sizes" :key="s" align="center" :wrap="true"><NButton v-for="t in btnTypes" :key="t" :type="t" :size="s">{{ t }}</NButton></NFlex>
          <NFlex :wrap="true"><NButton type="primary" secondary>secondary</NButton><NButton type="primary" tertiary>tertiary</NButton><NButton type="primary" quaternary>quaternary</NButton><NButton type="primary" dashed>dashed</NButton><NButton type="primary" ghost>ghost</NButton><NButton type="primary" text>text</NButton><NButton type="primary" round>round</NButton><NButton type="primary" loading>loading</NButton><NButton type="primary" disabled>disabled</NButton><NButton type="primary" block>block</NButton></NFlex>
        </NSpace>

        <NSpace v-else-if="name === 'ButtonGroup'" vertical>
          <NButtonGroup><NButton>左</NButton><NButton>中</NButton><NButton>右</NButton></NButtonGroup>
          <NButtonGroup vertical><NButton secondary>上</NButton><NButton secondary>中</NButton><NButton secondary>下</NButton></NButtonGroup>
          <NButtonGroup size="small"><NButton type="primary" ghost><template #icon><Icon name="chevron-left" /></template></NButton><NButton type="primary" ghost>1</NButton><NButton type="primary" ghost>2</NButton><NButton type="primary" ghost><template #icon><Icon name="chevron-right" /></template></NButton></NButtonGroup>
        </NSpace>

        <NFlex v-else-if="name === 'IconButton'" align="center" :wrap="true">
          <NButton v-for="s in sizes" :key="s" circle :size="s" aria-label="搜索"><template #icon><Icon name="search" /></template></NButton>
          <NButton circle type="primary" aria-label="添加"><template #icon><Icon name="plus" /></template></NButton>
          <NButton circle secondary type="error" aria-label="删除"><template #icon><Icon name="trash" /></template></NButton>
          <NButton quaternary circle aria-label="设置"><template #icon><Icon name="settings" /></template></NButton>
          <NButton circle disabled aria-label="禁用"><template #icon><Icon name="bell" /></template></NButton>
          <NButton circle loading aria-label="加载" />
        </NFlex>

        <NGrid v-else-if="name === 'Input'" cols="1 m:2" responsive="screen" :x-gap="12" :y-gap="12">
          <NGi v-for="s in sizes" :key="s"><NInput v-model:value="text" :size="s" :placeholder="`${s} 输入框`" clearable /></NGi>
          <NGi><NInput placeholder="带前缀/后缀"><template #prefix><Icon name="search" :size="15" /></template><template #suffix><Icon name="x" :size="15" /></template></NInput></NGi>
          <NGi><NInput type="password" show-password-on="click" placeholder="密码" /></NGi>
          <NGi><NInput status="error" placeholder="错误状态" value="invalid@" /></NGi>
          <NGi><NInput status="warning" placeholder="警告状态" /></NGi>
          <NGi><NInput disabled placeholder="禁用" /></NGi>
          <NGi><NInput readonly value="只读值" /></NGi>
          <NGi><NInput round placeholder="圆角" /></NGi>
          <NGi><NInputGroup><NInput placeholder="https://" /><NButton type="primary">前往</NButton></NInputGroup></NGi>
        </NGrid>

        <NGrid v-else-if="name === 'Textarea'" cols="1 m:2" responsive="screen" :x-gap="12" :y-gap="12">
          <NGi><NInput type="textarea" placeholder="默认" /></NGi>
          <NGi><NInput type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" placeholder="自适应高度" /></NGi>
          <NGi><NInput type="textarea" show-count :maxlength="100" placeholder="带计数" /></NGi>
          <NGi><NInput type="textarea" disabled placeholder="禁用" /></NGi>
        </NGrid>

        <NFlex v-else-if="name === 'NumberInput'" :wrap="true">
          <NInputNumber v-for="s in sizes" :key="s" v-model:value="num" :size="s" :min="0" :max="100" style="width: 160px" />
          <NInputNumber v-model:value="num" :step="5" button-placement="both" style="width: 160px" />
          <NInputNumber v-model:value="num" disabled style="width: 160px" />
          <NInputNumber v-model:value="num" :show-button="false" status="error" style="width: 160px"><template #prefix>¥</template></NInputNumber>
        </NFlex>

        <NFlex v-else-if="name === 'Select'" :wrap="true">
          <NSelect v-for="s in sizes" :key="s" v-model:value="single" :options="sel" :size="s" style="width: 160px" />
          <NSelect v-model:value="single" :options="sel" clearable placeholder="可清空" style="width: 160px" />
          <NSelect v-model:value="single" :options="sel" disabled style="width: 160px" />
          <NSelect v-model:value="single" :options="sel" status="error" style="width: 160px" />
          <NSelect :options="[]" placeholder="空选项" style="width: 160px" />
          <NSelect :options="sel" loading placeholder="加载中" style="width: 160px" />
        </NFlex>

        <NFlex v-else-if="name === 'MultiSelect'" :wrap="true">
          <NSelect v-model:value="multi" :options="sel" multiple style="width: 260px" />
          <NSelect v-model:value="multi" :options="sel" multiple :max-tag-count="1" style="width: 200px" />
          <NSelect v-model:value="multi" :options="sel" multiple filterable tag placeholder="可创建" style="width: 260px" />
          <NSelect v-model:value="multi" :options="sel" multiple disabled style="width: 200px" />
        </NFlex>

        <NFlex v-else-if="name === 'Combobox'" :wrap="true">
          <NSelect v-model:value="combo" :options="members" filterable placeholder="搜索成员" style="width: 220px" />
          <NSelect v-model:value="combo" :options="members" filterable clearable placeholder="可清空" style="width: 220px" />
          <NPopselect v-model:value="popsel" :options="sel" trigger="click"><NButton secondary>Popselect：{{ popsel ?? "选择状态" }}</NButton></NPopselect>
        </NFlex>

        <NFlex v-else-if="name === 'Autocomplete'" :wrap="true">
          <NAutoComplete v-model:value="auto" :options="autoOptions(auto)" placeholder="输入邮箱前缀" clearable style="width: 240px" />
          <NAutoComplete v-model:value="auto" :options="autoOptions(auto)" disabled placeholder="禁用" style="width: 200px" />
          <NAutoComplete v-model:value="auto" :options="autoOptions(auto)" size="large" placeholder="large" style="width: 240px" />
        </NFlex>

        <NSpace v-else-if="name === 'Checkbox'" vertical>
          <NCheckboxGroup v-model:value="checks"><NFlex><NCheckbox v-for="s in ['small', 'medium', 'large'] as const" :key="s" :value="s" :size="s" :label="s" /></NFlex></NCheckboxGroup>
          <NFlex><NCheckbox checked label="已选" /><NCheckbox label="未选" /><NCheckbox indeterminate label="部分选中" /><NCheckbox disabled label="禁用" /><NCheckbox checked disabled label="已选禁用" /><NCheckbox v-model:checked="form.agree" focusable label="可聚焦" /></NFlex>
        </NSpace>

        <NSpace v-else-if="name === 'Radio'" vertical>
          <NRadioGroup v-model:value="radio"><NFlex><NRadio v-for="s in ['small', 'medium', 'large'] as const" :key="s" :value="s" :size="s" :label="s" /></NFlex></NRadioGroup>
          <NFlex><NRadio checked label="已选" /><NRadio label="未选" /><NRadio disabled label="禁用" /><NRadio checked disabled label="已选禁用" /></NFlex>
          <NRadioGroup v-model:value="radio" size="small"><NRadioButton value="a">按钮 A</NRadioButton><NRadioButton value="b">按钮 B</NRadioButton><NRadioButton value="c" disabled>禁用</NRadioButton></NRadioGroup>
        </NSpace>

        <NFlex v-else-if="name === 'Switch'" align="center" :wrap="true">
          <NSwitch v-for="s in ['small', 'medium', 'large'] as const" :key="s" v-model:value="on" :size="s" />
          <NSwitch v-model:value="on"><template #checked>开启</template><template #unchecked>关闭</template></NSwitch>
          <NSwitch v-model:value="on" loading /><NSwitch v-model:value="on" disabled /><NSwitch :value="false" disabled /><NSwitch v-model:value="on" :round="false" /><NSwitch v-model:value="on"><template #checked-icon><Icon name="check" :size="12" /></template><template #unchecked-icon><Icon name="x" :size="12" /></template></NSwitch>
        </NFlex>

        <NSpace v-else-if="name === 'Slider'" vertical :size="24" style="padding: 0 8px">
          <NSlider v-model:value="slider" /><NSlider v-model:value="sliderRange" range :step="5" />
          <NSlider v-model:value="slider" :marks="{ 0: '0', 50: '50', 100: '100' }" :step="25" /><NSlider v-model:value="slider" disabled />
          <NFlex><NSlider v-model:value="slider" vertical style="height: 120px" /><NSlider v-model:value="slider" vertical reverse style="height: 120px" /></NFlex>
        </NSpace>

        <NFlex v-else-if="name === 'Rating'" align="center" :wrap="true">
          <NRate v-for="s in ['small', 'medium', 'large'] as const" :key="s" v-model:value="rate" :size="s" allow-half />
          <NRate :value="4" readonly /><NRate :value="2" :count="3" /><NRate :value="3" color="#18a058"><Icon name="heart" :size="18" /></NRate><NRate :value="1" clearable />
        </NFlex>

        <NFlex v-else-if="name === 'DatePicker'" :wrap="true">
          <NDatePicker v-model:value="date" type="date" /><NDatePicker v-model:value="date" type="datetime" /><NDatePicker v-model:value="date" type="month" /><NDatePicker v-model:value="date" type="year" /><NDatePicker v-model:value="date" type="date" size="small" /><NDatePicker v-model:value="date" type="date" size="large" /><NDatePicker v-model:value="date" type="date" disabled /><NDatePicker v-model:value="date" type="date" status="error" /><NDatePicker :value="null" type="date" placeholder="未选择" clearable />
        </NFlex>

        <NFlex v-else-if="name === 'TimePicker'" :wrap="true">
          <NTimePicker v-model:value="time" /><NTimePicker v-model:value="time" format="HH:mm" /><NTimePicker v-model:value="time" use-12-hours /><NTimePicker v-model:value="time" size="small" /><NTimePicker v-model:value="time" size="large" /><NTimePicker v-model:value="time" disabled />
        </NFlex>

        <NFlex v-else-if="name === 'DateRangePicker'" :wrap="true">
          <NDatePicker v-model:value="range" type="daterange" clearable /><NDatePicker v-model:value="range" type="datetimerange" /><NDatePicker v-model:value="range" type="monthrange" /><NDatePicker v-model:value="range" type="daterange" disabled />
        </NFlex>

        <NFlex v-else-if="name === 'ColorPicker'" :wrap="true" align="center">
          <NColorPicker v-model:value="color" style="width: 180px" /><NColorPicker v-model:value="color" :modes="['hex']" size="small" style="width: 140px" /><NColorPicker v-model:value="color" :show-alpha="false" :swatches="['#18A058', '#2080F0', '#F0A020', '#D03050']" size="large" style="width: 180px" /><NColorPicker v-model:value="color" disabled style="width: 140px" />
        </NFlex>

        <NGrid v-else-if="name === 'Upload'" cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
          <NGi><NUpload v-model:file-list="files" multiple :default-upload="false"><NButton secondary><template #icon><Icon name="upload" /></template>选择文件</NButton></NUpload></NGi>
          <NGi><NUpload :default-upload="false" directory-dnd><NUploadDragger><Icon name="upload" :size="32" /><NP style="margin: 8px 0 0">拖拽文件到此处</NP><NText depth="3" style="font-size: 12px">或点击选择</NText></NUploadDragger></NUpload></NGi>
          <NGi><NUpload list-type="image-card" :default-upload="false" /></NGi>
          <NGi><NUpload disabled><NButton disabled>禁用上传</NButton></NUpload></NGi>
        </NGrid>

        <NFlex v-else-if="name === 'Cascader'" :wrap="true">
          <NCascader v-model:value="cascader" :options="cascaderOptions" placeholder="选择区域" style="width: 220px" /><NCascader v-model:value="cascader" :options="cascaderOptions" filterable clearable placeholder="可搜索" style="width: 220px" /><NCascader :options="cascaderOptions" multiple placeholder="多选" style="width: 220px" /><NCascader :options="cascaderOptions" disabled style="width: 160px" />
        </NFlex>

        <NTransfer v-else-if="name === 'Transfer'" v-model:value="transferValue" :options="members" source-filterable :style="{ height: isMobile ? '360px' : undefined }" />

        <NFlex v-else-if="name === 'Mention'" :wrap="true">
          <NMention v-model:value="mention" :options="team.map((m) => ({ label: m.name, value: m.name }))" placeholder="输入 @ 提及成员" style="width: 280px" /><NMention :options="team.map((m) => ({ label: m.name, value: m.name }))" type="textarea" placeholder="多行 @" style="width: 280px" /><NMention :options="[]" disabled placeholder="禁用" style="width: 160px" />
        </NFlex>

        <NSpace v-else-if="name === 'PinInput'" vertical>
          <NInputOtp v-model:value="otp" /><NInputOtp :length="4" size="large" /><NInputOtp :length="6" mask size="small" /><NInputOtp :length="4" disabled /><NInputOtp :length="4" status="error" />
        </NSpace>

        <NForm v-else-if="name === 'Form'" ref="formRef" :model="form" :rules="{ name: { required: true, message: '必填', trigger: 'blur' } }" :label-placement="isMobile ? 'top' : 'left'" label-width="80" style="max-width: 520px">
          <NFormItem label="名称" path="name" feedback="2–20 字符"><NInput v-model:value="form.name" /></NFormItem>
          <NFormItem label="状态" path="status" validation-status="error" feedback="错误反馈示例"><NSelect :options="sel" /></NFormItem>
          <NFormItem label="通知" path="agree"><NCheckbox v-model:checked="form.agree">接收邮件</NCheckbox></NFormItem>
          <NFormItem :show-label="false"><NFlex><NButton type="primary" @click="formRef?.validate().catch(() => undefined)">校验</NButton><NButton secondary @click="formRef?.restoreValidation()">重置校验</NButton></NFlex></NFormItem>
        </NForm>

        <div v-else-if="name === 'Table'" style="overflow-x: auto">
          <NTable :bordered="false" :single-line="false" striped size="small">
            <thead><tr><th>订单</th><th>客户</th><th>状态</th><th style="text-align: right">金额</th></tr></thead>
            <tbody><tr v-for="o in orders.slice(0, 4)" :key="o.id"><td>{{ o.id }}</td><td>{{ o.customer }}</td><td><StatusTag :value="o.status" /></td><td style="text-align: right">{{ formatMoney(o.amount) }}</td></tr></tbody>
          </NTable>
        </div>

        <NSpace v-else-if="name === 'DataGrid'" vertical>
          <NDataTable :columns="columns" :data="orders.slice(0, 6)" :row-key="(r: Order) => r.id" :pagination="{ pageSize: 3 }" :scroll-x="560" size="small" striped />
          <NDataTable :columns="columns" :data="[]" :scroll-x="560" size="small" />
          <NDataTable :columns="columns" :data="orders.slice(0, 2)" :loading="true" :scroll-x="560" size="small" />
        </NSpace>

        <NSpace v-else-if="name === 'Descriptions'" vertical>
          <NDescriptions title="订单信息" :column="isMobile ? 1 : 3" label-placement="left"><NDescriptionsItem label="订单号">{{ orders[0]!.id }}</NDescriptionsItem><NDescriptionsItem label="客户">{{ orders[0]!.customer }}</NDescriptionsItem><NDescriptionsItem label="金额">{{ formatMoney(orders[0]!.amount) }}</NDescriptionsItem></NDescriptions>
          <NDescriptions bordered size="small" :column="isMobile ? 1 : 2" label-placement="top"><NDescriptionsItem label="邮箱">{{ orders[0]!.email }}</NDescriptionsItem><NDescriptionsItem label="状态"><StatusTag :value="orders[0]!.status" /></NDescriptionsItem></NDescriptions>
        </NSpace>

        <NGrid v-else-if="name === 'List'" cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
          <NGi><NList bordered hoverable clickable><NListItem v-for="a in activity.slice(0, 3)" :key="a.user + a.time"><NThing :title="a.user" :description="a.time">{{ a.action }}</NThing><template #prefix><NAvatar round size="small">{{ a.user[0] }}</NAvatar></template></NListItem></NList></NGi>
          <NGi><NList><template #header>带页眉</template><NListItem v-for="t in team.slice(0, 3)" :key="t.email">{{ t.name }}<template #suffix><NTag size="small" :bordered="false">{{ t.role }}</NTag></template></NListItem><template #footer>带页脚</template></NList></NGi>
        </NGrid>

        <NGrid v-else-if="name === 'Card'" cols="1 m:3" responsive="screen" :x-gap="16" :y-gap="16">
          <NGi><NCard title="默认卡片" size="small"><template #header-extra><Icon name="more-horizontal" :size="16" /></template>内容区域<template #footer>页脚</template><template #action>操作区</template></NCard></NGi>
          <NGi><NCard title="可悬停" hoverable size="small" :segmented="{ content: true, footer: 'soft' }">分段样式<template #footer>页脚</template></NCard></NGi>
          <NGi><NCard title="可关闭 / 内嵌" closable embedded size="small"><template #cover><div :style="{ height: '80px', background: 'linear-gradient(90deg, #18a058, #63e2b7)' }" /></template>带封面</NCard></NGi>
        </NGrid>

        <NFlex v-else-if="name === 'Avatar'" align="center" :wrap="true">
          <NAvatar v-for="s in ['small', 'medium', 'large'] as const" :key="s" :size="s" round>林</NAvatar><NAvatar :size="48">方</NAvatar><NAvatar round color="#18a058"><Icon name="user" /></NAvatar><NAvatar round :src="svgImg('#2080f0')" /><NAvatar round :src="'data:image/png;base64,AA=='">X</NAvatar><NBadge value="3"><NAvatar round>徽</NAvatar></NBadge>
        </NFlex>

        <NFlex v-else-if="name === 'AvatarGroup'" align="center" :wrap="true" :size="24">
          <NAvatarGroup :options="team.map((t) => ({ name: t.name, src: t.name }))" :size="36" :max="4"><template #avatar="{ option }"><NTooltip><template #trigger><NAvatar round>{{ option.src[0] }}</NAvatar></template>{{ option.src }}</NTooltip></template><template #rest="{ rest }"><NAvatar round>+{{ rest }}</NAvatar></template></NAvatarGroup>
          <NAvatarGroup :options="team.slice(0, 3).map((t) => ({ name: t.name, src: t.name }))" :size="28" expand-on-hover><template #avatar="{ option }"><NAvatar round size="small">{{ option.src[0] }}</NAvatar></template></NAvatarGroup>
        </NFlex>

        <NFlex v-else-if="name === 'Badge'" align="center" :wrap="true" :size="24">
          <NBadge :value="5"><NAvatar>A</NAvatar></NBadge><NBadge :value="120" :max="99"><NAvatar>B</NAvatar></NBadge><NBadge dot><NAvatar>C</NAvatar></NBadge><NBadge value="new" type="success"><NAvatar>D</NAvatar></NBadge><NBadge :value="3" type="warning" processing><NAvatar>E</NAvatar></NBadge><NBadge :value="3" type="info"><NAvatar>F</NAvatar></NBadge><NBadge :value="0" show-zero><NAvatar>G</NAvatar></NBadge><NBadge :value="8" :offset="[4, -4]"><NButton size="small">按钮</NButton></NBadge>
        </NFlex>

        <NSpace v-else-if="name === 'Tag'" vertical>
          <NFlex v-for="s in ['small', 'medium', 'large'] as const" :key="s" :wrap="true"><NTag v-for="t in btnTypes" :key="t" :type="t" :size="s">{{ t }}</NTag></NFlex>
          <NFlex :wrap="true"><NTag round>round</NTag><NTag :bordered="false" type="success">no border</NTag><NTag closable type="info">closable</NTag><NTag checkable checked>checkable</NTag><NTag disabled>disabled</NTag><NTag type="primary" strong>strong</NTag><NTag type="warning"><template #icon><Icon name="star" :size="14" /></template>icon</NTag><StatusTag v-for="s in ['paid', 'pending', 'failed']" :key="s" :value="s" /></NFlex>
          <NDynamicTags v-model:value="dynTags" />
        </NSpace>

        <NGrid v-else-if="name === 'Statistic'" cols="2 m:4" responsive="screen" :x-gap="16" :y-gap="16">
          <NGi v-for="s in stats" :key="s.label"><NStatistic :label="s.label" :value="s.value"><template #suffix><NText :type="s.delta >= 0 ? 'success' : 'error'" style="font-size: 12px">{{ s.delta >= 0 ? "+" : "" }}{{ s.delta }}%</NText></template></NStatistic></NGi>
          <NGi><NStatistic label="动画数字"><NNumberAnimation :from="0" :to="128430" show-separator /></NStatistic></NGi>
          <NGi><NStatistic label="倒计时"><NCountdown :duration="3600 * 1000" /></NStatistic></NGi>
          <NGi><NStatistic label="相对时间"><NTime :time="Date.now() - 3600 * 1000" :to="Date.now()" type="relative" /></NStatistic></NGi>
        </NGrid>

        <NGrid v-else-if="name === 'Timeline'" cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="16">
          <NGi><NTimeline><NTimelineItem v-for="(a, i) in activity.slice(0, 4)" :key="a.user + a.time" :type="(['success', 'info', 'warning', 'error'] as const)[i % 4]" :title="a.user" :content="a.action" :time="a.time" /></NTimeline></NGi>
          <NGi><NTimeline horizontal size="large"><NTimelineItem title="创建" content="订单已创建" /><NTimelineItem type="success" title="支付" content="支付完成" /><NTimelineItem type="info" title="发货" line-type="dashed"><template #icon><Icon name="rocket" :size="14" /></template></NTimelineItem><NTimelineItem title="待签收" /></NTimeline></NGi>
        </NGrid>

        <NGrid v-else-if="name === 'Tree'" cols="1 m:3" responsive="screen" :x-gap="16" :y-gap="16">
          <NGi><NTree :data="treeData" block-line default-expand-all selectable /></NGi>
          <NGi><NTree :data="treeData" checkable cascade default-expand-all :default-checked-keys="['m9']" /></NGi>
          <NGi><NTreeSelect v-model:value="treeSelect" :options="treeData" placeholder="TreeSelect" filterable default-expand-all /></NGi>
        </NGrid>

        <NCalendar v-else-if="name === 'Calendar'" v-model:value="calendarValue" style="height: 420px; overflow: auto"><template #default="{ date: d }"><NText v-if="d === 15" depth="3" style="font-size: 12px">发布日</NText></template></NCalendar>

        <NFlex v-else-if="name === 'Image'" :wrap="true" align="center">
          <NImageGroup><NImage v-for="c in ['#18a058', '#2080f0', '#f0a020']" :key="c" :src="svgImg(c)" width="120" height="80" object-fit="cover" alt="占位图" /></NImageGroup>
          <NImage :src="svgImg('#d03050')" width="120" height="80" preview-disabled alt="禁用预览" />
          <NImage :src="svgImg('#888')" width="120" height="80" lazy alt="懒加载" />
          <NImage src="data:image/png;base64,AA==" width="120" height="80" alt="加载失败"><template #error><NFlex align="center" justify="center" style="width: 120px; height: 80px; background: rgba(128,128,128,.12)"><Icon name="image" :size="24" /></NFlex></template></NImage>
        </NFlex>

        <NGrid v-else-if="name === 'Carousel'" cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="16">
          <NGi style="min-width: 0"><div style="min-width: 0; width: 100%"><NCarousel autoplay draggable show-arrow style="height: 200px; width: 100%"><img v-for="c in ['#18a058', '#2080f0', '#f0a020']" :key="c" :src="svgImg(c)" alt="" style="display: block; width: 100%; max-width: 100%; height: 200px; object-fit: cover" /></NCarousel></div></NGi>
          <NGi style="min-width: 0"><div style="min-width: 0; width: 100%"><NCarousel effect="card" dot-type="line" :slides-per-view="1" style="height: 200px; width: 100%"><img v-for="c in ['#d03050', '#18a058', '#2080f0']" :key="c" :src="svgImg(c)" alt="" style="display: block; width: 100%; max-width: 100%; height: 200px; object-fit: cover" /></NCarousel></div></NGi>
        </NGrid>

        <NGrid v-else-if="name === 'Empty'" cols="1 m:3" responsive="screen" :x-gap="16">
          <NGi><NEmpty description="暂无数据" size="small" /></NGi>
          <NGi><NEmpty description="没有找到订单"><template #icon><Icon name="inbox" :size="36" /></template><template #extra><NButton size="small" secondary>清除筛选</NButton></template></NEmpty></NGi>
          <NGi><NEmpty description="加载失败" size="large" show-description><template #icon><Icon name="alert-circle" :size="40" /></template></NEmpty></NGi>
        </NGrid>

        <NFlex v-else-if="name === 'Tooltip'" :wrap="true">
          <NTooltip v-for="p in ['top', 'bottom', 'left', 'right'] as const" :key="p" :placement="p"><template #trigger><NButton secondary>{{ p }}</NButton></template>提示：{{ p }}</NTooltip>
          <NTooltip trigger="click"><template #trigger><NButton secondary>点击触发</NButton></template>点击后显示</NTooltip>
          <NTooltip :show-arrow="false"><template #trigger><NButton secondary>无箭头</NButton></template>无箭头提示</NTooltip>
          <NTooltip><template #trigger><NButton quaternary circle aria-label="帮助"><template #icon><Icon name="circle-help" /></template></NButton></template>图标提示</NTooltip>
        </NFlex>

        <NFlex v-else-if="name === 'Popover'" :wrap="true">
          <NPopover trigger="hover"><template #trigger><NButton secondary>悬停</NButton></template><NText>悬停显示的内容</NText></NPopover>
          <NPopover trigger="click" title="标题" placement="bottom-start"><template #trigger><NButton secondary>点击（带标题）</NButton></template><NSpace vertical><NText>{{ notifications[0]!.title }}</NText><NButton size="small" type="primary">操作</NButton></NSpace></NPopover>
          <NPopover trigger="focus"><template #trigger><NInput placeholder="聚焦显示" style="width: 140px" /></template>聚焦时出现</NPopover>
          <NPopover raw :show-arrow="false" trigger="click"><template #trigger><NButton secondary>raw</NButton></template><NCard size="small" style="width: 220px">自定义卡片内容</NCard></NPopover>
        </NFlex>

        <NFlex v-else-if="name === 'QRCode'" :wrap="true" align="center">
          <NQrCode value="https://ui.example/apps/naive-ui" /><NQrCode value="https://ui.example/apps/naive-ui" :size="80" color="#18a058" /><NQrCode value="https://ui.example/apps/naive-ui" error-correction-level="H" :size="100" :bordered="false" background-color="rgba(24,160,88,.1)" /><NQrCode value="https://ui.example/apps/naive-ui" type="svg" :size="80" />
        </NFlex>

        <NSpace v-else-if="name === 'Segmented'" vertical>
          <NRadioGroup v-model:value="seg" size="small"><NRadioButton value="day">日</NRadioButton><NRadioButton value="week">周</NRadioButton><NRadioButton value="month">月</NRadioButton></NRadioGroup>
          <NRadioGroup v-model:value="seg"><NRadioButton value="day">日</NRadioButton><NRadioButton value="week">周</NRadioButton><NRadioButton value="month" disabled>月</NRadioButton></NRadioGroup>
          <NTabs type="segment" size="small" animated style="max-width: 320px"><NTab name="a">概览</NTab><NTab name="b">明细</NTab><NTab name="c">设置</NTab></NTabs>
        </NSpace>

        <NSpace v-else-if="name === 'Alert'" vertical>
          <NAlert v-for="t in ['default', 'info', 'success', 'warning', 'error'] as const" :key="t" :type="t" :title="`${t} 标题`" closable>这是一条 {{ t }} 类型的提醒内容。</NAlert>
          <NAlert type="info" :show-icon="false">无图标提醒</NAlert>
          <NAlert type="success" title="带操作"><NFlex align="center" justify="space-between">已同步 128 条记录<NButton size="small" text type="success">查看</NButton></NFlex></NAlert>
          <NAlert type="warning" :bordered="false">无边框</NAlert>
        </NSpace>

        <NFlex v-else-if="name === 'Toast'" :wrap="true">
          <NButton v-for="t in ['info', 'success', 'warning', 'error', 'loading'] as const" :key="t" secondary @click="toast(t)">{{ t }}</NButton>
          <NButton secondary @click="runLoadingBar">LoadingBar</NButton>
        </NFlex>

        <NFlex v-else-if="name === 'Notification'" :wrap="true">
          <NButton v-for="t in ['info', 'success', 'warning', 'error'] as const" :key="t" secondary @click="notify(t)">{{ t }}</NButton>
          <NButton secondary @click="notification.create({ title: notifications[1]!.title, description: activity[1]!.action, meta: notifications[1]!.time, action: () => h(NButton, { size: 'small', type: 'primary', text: true }, () => '查看') })">带操作</NButton>
        </NFlex>

        <NFlex v-else-if="name === 'Dialog'" :wrap="true">
          <NButton type="primary" @click="showModal = true">打开 Modal</NButton>
          <NButton secondary @click="openDialog">useDialog 确认框</NButton>
          <NButton secondary type="error" @click="dialog.error({ title: '删除失败', content: '订单已锁定，无法删除。', positiveText: '知道了' })">错误对话框</NButton>
          <NModal v-model:show="showModal" preset="card" title="编辑订单" style="width: 520px; max-width: calc(100vw - 32px)" :bordered="false" :segmented="{ content: true, footer: 'soft' }">
            <NForm label-placement="top"><NFormItem label="客户"><NInput :value="orders[0]!.customer" /></NFormItem><NFormItem label="状态"><NSelect :value="orders[0]!.status" :options="sel" /></NFormItem></NForm>
            <template #footer><NFlex justify="end"><NButton secondary @click="showModal = false">取消</NButton><NButton type="primary" @click="showModal = false; message.success('已保存')">保存</NButton></NFlex></template>
          </NModal>
        </NFlex>

        <NFlex v-else-if="name === 'Drawer'" :wrap="true">
          <NButton type="primary" @click="showDrawer = true">打开抽屉</NButton>
          <NDrawer v-model:show="showDrawer" :width="isMobile ? '100%' : 400" placement="right" resizable><NDrawerContent title="订单详情" closable :native-scrollbar="false"><NDescriptions :column="1" label-placement="left" bordered size="small"><NDescriptionsItem label="订单">{{ orders[1]!.id }}</NDescriptionsItem><NDescriptionsItem label="客户">{{ orders[1]!.customer }}</NDescriptionsItem><NDescriptionsItem label="金额">{{ formatMoney(orders[1]!.amount) }}</NDescriptionsItem></NDescriptions><template #footer><NButton secondary @click="showDrawer = false">关闭</NButton></template></NDrawerContent></NDrawer>
        </NFlex>

        <NSpace v-else-if="name === 'Progress'" vertical>
          <NProgress type="line" :percentage="progress" /><NProgress type="line" :percentage="progress" indicator-placement="inside" processing /><NProgress type="line" :percentage="100" status="success" /><NProgress type="line" :percentage="30" status="error" /><NProgress type="line" :percentage="70" status="warning" :height="12" :border-radius="2" />
          <NFlex :wrap="true"><NProgress type="circle" :percentage="progress" style="width: 100px" /><NProgress type="circle" :percentage="100" status="success" style="width: 100px" /><NProgress type="dashboard" :percentage="progress" :gap-degree="90" style="width: 100px" /><NProgress type="multiple-circle" :percentage="[40, 60, 80]" :stroke-width="6" :circle-gap="1" style="width: 100px" /></NFlex>
          <NFlex align="center"><NButton size="small" secondary @click="progress = Math.max(0, progress - 10)">-10</NButton><NButton size="small" secondary @click="progress = Math.min(100, progress + 10)">+10</NButton></NFlex>
        </NSpace>

        <NGrid v-else-if="name === 'Skeleton'" cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
          <NGi><NSpace vertical><NSkeleton text :repeat="3" /><NSkeleton text style="width: 60%" /></NSpace></NGi>
          <NGi><NFlex align="center"><NSkeleton circle width="48px" height="48px" /><NSpace vertical style="flex: 1"><NSkeleton height="16px" width="40%" /><NSkeleton height="12px" /></NSpace></NFlex></NGi>
          <NGi><NSkeleton height="120px" :sharp="false" /></NGi>
          <NGi><NFlex><NSkeleton height="34px" width="96px" :sharp="false" /><NSkeleton height="34px" width="96px" round /><NSkeleton height="34px" width="34px" circle /></NFlex></NGi>
        </NGrid>

        <NFlex v-else-if="name === 'Spinner'" align="center" :wrap="true" :size="24">
          <NSpin v-for="s in ['small', 'medium', 'large'] as const" :key="s" :size="s" /><NSpin :size="20" description="加载中…" /><NSpin :show="spinShow"><NCard size="small" style="width: 220px">被遮罩的内容<br /><NButton size="tiny" text @click="spinShow = !spinShow">切换</NButton></NCard></NSpin><NSpin :size="24" stroke="#18a058" :stroke-width="24" />
        </NFlex>

        <NGrid v-else-if="name === 'Result'" cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="16">
          <NGi><NResult status="success" title="操作成功" description="项目已创建" size="small"><template #footer><NButton size="small" type="primary">继续</NButton></template></NResult></NGi>
          <NGi><NResult status="error" title="提交失败" description="请检查网络后重试" size="small" /></NGi>
          <NGi><NResult status="404" title="404" description="页面不存在" size="small" /></NGi>
          <NGi><NResult status="warning" title="注意" description="配额即将用尽" size="small" /></NGi>
        </NGrid>

        <NFlex v-else-if="name === 'Popconfirm'" :wrap="true">
          <NPopconfirm @positive-click="message.success('已删除')"><template #trigger><NButton type="error" secondary>删除</NButton></template>确认删除该订单？</NPopconfirm>
          <NPopconfirm positive-text="确定" negative-text="取消" placement="bottom"><template #trigger><NButton secondary>自定义文案</NButton></template>确认操作？</NPopconfirm>
          <NPopconfirm :show-icon="false" :negative-text="null"><template #trigger><NButton secondary>无图标 / 单按钮</NButton></template>仅确认</NPopconfirm>
        </NFlex>

        <NGrid v-else-if="name === 'Menu'" cols="1 m:3" responsive="screen" :x-gap="16" :y-gap="16">
          <NGi><NMenu :options="menuOptions" default-value="/" /></NGi>
          <NGi><NMenu :options="menuOptions" default-value="/orders" collapsed :collapsed-width="56" :collapsed-icon-size="20" /></NGi>
          <NGi><NMenu :options="menuOptions" mode="horizontal" default-value="/form" responsive /></NGi>
        </NGrid>

        <NFlex v-else-if="name === 'Dropdown'" :wrap="true">
          <NDropdown :options="dropdownOptions" trigger="click" @select="(k: string) => message.info(k)"><NButton secondary>点击菜单<template #icon><Icon name="chevron-down" /></template></NButton></NDropdown>
          <NDropdown :options="dropdownOptions" trigger="hover" placement="bottom-start"><NButton secondary>悬停菜单</NButton></NDropdown>
          <NDropdown :options="[{ label: '分组', key: 'g', type: 'group', children: dropdownOptions.slice(0, 2) }, { label: '子菜单', key: 's', children: dropdownOptions.slice(0, 2) }]" trigger="click" size="large"><NButton secondary>分组 / 子菜单</NButton></NDropdown>
          <NDropdown :options="dropdownOptions" trigger="click" size="small"><NButton quaternary circle aria-label="更多"><template #icon><Icon name="more-horizontal" /></template></NButton></NDropdown>
        </NFlex>

        <NSpace v-else-if="name === 'Breadcrumb'" vertical>
          <NBreadcrumb><NBreadcrumbItem href="/apps/naive-ui/">首页</NBreadcrumbItem><NBreadcrumbItem href="/apps/naive-ui/orders">订单</NBreadcrumbItem><NBreadcrumbItem>{{ orders[0]!.id }}</NBreadcrumbItem></NBreadcrumb>
          <NBreadcrumb separator=">"><NBreadcrumbItem><NFlex align="center" :size="4"><Icon name="home" :size="14" />首页</NFlex></NBreadcrumbItem><NBreadcrumbItem>设置</NBreadcrumbItem><NBreadcrumbItem>计费</NBreadcrumbItem></NBreadcrumb>
        </NSpace>

        <NSpace v-else-if="name === 'Tabs'" vertical>
          <NTabs v-model:value="tab" type="line" animated><NTabPane name="a" tab="线条">线条型 Tabs</NTabPane><NTabPane name="b" tab="明细">明细内容</NTabPane><NTabPane name="c" tab="禁用" disabled>禁用内容</NTabPane></NTabs>
          <NTabs type="bar" size="small" default-value="a"><NTab name="a">bar</NTab><NTab name="b">小尺寸</NTab></NTabs>
          <NTabs type="card" closable default-value="a" style="max-width: 480px"><NTab name="a">卡片 A</NTab><NTab name="b">卡片 B</NTab></NTabs>
          <NTabs type="segment" size="large" default-value="a" style="max-width: 320px"><NTab name="a">分段</NTab><NTab name="b">large</NTab></NTabs>
        </NSpace>

        <NSpace v-else-if="name === 'Pagination'" vertical>
          <NPagination v-model:page="page" :page-count="20" /><NPagination v-model:page="page" :item-count="200" show-size-picker :page-sizes="[10, 20, 50]" show-quick-jumper size="small" /><NPagination v-model:page="page" :page-count="20" size="large" :page-slot="5" /><NPagination v-model:page="page" :page-count="20" simple /><NPagination :page="1" :page-count="5" disabled />
        </NSpace>

        <NSpace v-else-if="name === 'Steps'" vertical :size="24">
          <NSteps :current="step" :vertical="isMobile"><NStep title="基本信息" description="已完成" /><NStep title="详细配置" description="进行中" /><NStep title="确认" description="待处理" /></NSteps>
          <NSteps :current="2" status="error" size="small" :vertical="isMobile"><NStep title="上传" /><NStep title="校验失败" description="文件格式错误" /><NStep title="导入" /></NSteps>
          <NFlex><NButton size="small" secondary @click="step = Math.max(1, step - 1)">上一步</NButton><NButton size="small" secondary @click="step = Math.min(3, step + 1)">下一步</NButton></NFlex>
        </NSpace>

        <NFlex v-else-if="name === 'Anchor'" :wrap="true" :size="32">
          <NAnchor :bound="72" style="min-width: 160px"><NAnchorLink title="Button" href="#button" /><NAnchorLink title="表单" href="#input"><NAnchorLink title="Select" href="#select" /><NAnchorLink title="Checkbox" href="#checkbox" /></NAnchorLink><NAnchorLink title="Table" href="#table" /></NAnchor>
          <NAnchor type="block" :bound="72" style="min-width: 160px"><NAnchorLink title="Dialog" href="#dialog" /><NAnchorLink title="Drawer" href="#drawer" /></NAnchor>
        </NFlex>

        <NSpace v-else-if="name === 'BackTop'" vertical>
          <NText depth="3">向下滚动超过 300px 后，右下角出现返回顶部按钮；下面是内联渲染的示例。</NText>
          <NBackTop :right="isMobile ? 16 : 40" :bottom="isMobile ? 80 : 40" :visibility-height="300" />
          <div style="position: relative; height: 60px"><NBackTop :visibility-height="-1" :to="`#${slug('BackTop')}`" style="position: absolute; right: 0; bottom: 8px" /></div>
        </NSpace>

        <NSpace v-else-if="name === 'Affix'" vertical>
          <NText depth="3">页面滚动时，下方的组件会吸附在顶部（top 偏移 72px）。</NText>
          <NAffix :top="72" :trigger-top="72"><NTag type="success" size="large" :bordered="false">我会吸附在页面顶部</NTag></NAffix>
          <div style="height: 40px" />
        </NSpace>

        <NLayoutHeader v-else-if="name === 'Navbar'" bordered style="padding: 8px 16px">
          <NFlex align="center" justify="space-between" :wrap="false">
            <NFlex align="center" :size="8"><NAvatar :size="28" color="#18a058">A</NAvatar><NText strong>Acme</NText></NFlex>
            <NMenu v-if="!isMobile" mode="horizontal" :options="menuOptions" default-value="/" />
            <NFlex align="center" :size="4"><NButton quaternary circle aria-label="搜索"><template #icon><Icon name="search" /></template></NButton><NBadge :value="2" :offset="[-4, 4]"><NButton quaternary circle aria-label="通知"><template #icon><Icon name="bell" /></template></NButton></NBadge><NAvatar round size="small">林</NAvatar></NFlex>
          </NFlex>
        </NLayoutHeader>

        <NLayout v-else-if="name === 'Sidebar'" has-sider style="height: 260px; border: 1px solid rgba(128,128,128,.2); border-radius: 6px; overflow: hidden">
          <NLayoutSider bordered collapse-mode="width" :collapsed-width="56" :width="200" show-trigger :default-collapsed="isMobile" :native-scrollbar="false"><NMenu :options="menuOptions" default-value="/" :collapsed-width="56" :collapsed-icon-size="20" /></NLayoutSider>
          <NLayoutContent content-style="padding: 16px"><NText depth="3">点击边缘触发器可折叠侧边栏。</NText></NLayoutContent>
        </NLayout>

        <NSpace v-else-if="name === 'CommandPalette'" vertical>
          <NFlex align="center"><NButton secondary @click="showCmd = true"><template #icon><Icon name="search" /></template>打开命令面板 <span class="kbd">⌘</span><span class="kbd">K</span></NButton></NFlex>
          <NModal v-model:show="showCmd" preset="card" :bordered="false" style="width: 560px; max-width: calc(100vw - 32px); margin-top: 10vh" content-style="padding: 0" :show-icon="false" header-style="display: none">
            <NInput v-model:value="cmdQuery" size="large" placeholder="搜索页面或命令…" :bordered="false" autofocus><template #prefix><Icon name="search" /></template><template #suffix><span class="kbd">Esc</span></template></NInput>
            <NDivider style="margin: 0" />
            <NList hoverable clickable style="max-height: 320px; overflow: auto">
              <NListItem v-for="c in cmdItems.filter((i) => i.label.includes(cmdQuery))" :key="c.href" @click="showCmd = false; message.info(`前往 ${c.label}`)"><NFlex align="center" :size="10"><Icon :name="c.icon" :size="16" /><NText>{{ c.label }}</NText></NFlex><template #suffix><NText depth="3" style="font-size: 12px">{{ c.href }}</NText></template></NListItem>
              <NEmpty v-if="!cmdItems.some((i) => i.label.includes(cmdQuery))" description="无匹配结果" style="padding: 24px" />
            </NList>
          </NModal>
        </NSpace>

        <NSpace v-else-if="name === 'Grid'" vertical>
          <NGrid :cols="4" :x-gap="8" :y-gap="8"><NGi v-for="i in 8" :key="i"><div class="cell">{{ i }}</div></NGi></NGrid>
          <NGrid cols="1 s:2 m:3 l:4" responsive="screen" :x-gap="8" :y-gap="8"><NGi v-for="i in 4" :key="i"><div class="cell">响应式 {{ i }}</div></NGi></NGrid>
          <NGrid :cols="6" :x-gap="8"><NGi :span="2"><div class="cell">span 2</div></NGi><NGi :span="4"><div class="cell">span 4</div></NGi><NGi :offset="1" :span="4"><div class="cell" style="margin-top: 8px">offset 1</div></NGi></NGrid>
        </NSpace>

        <NSpace v-else-if="name === 'Stack'" vertical>
          <NSpace><div class="cell">A</div><div class="cell">B</div><div class="cell">C</div></NSpace>
          <NSpace vertical :size="4" style="width: 120px"><div class="cell">垂直 1</div><div class="cell">垂直 2</div></NSpace>
          <NFlex justify="space-between" align="center"><div class="cell">space-between</div><div class="cell">中</div><div class="cell">右</div></NFlex>
          <NSpace justify="center" :size="[24, 8]" :wrap="true"><div v-for="i in 8" :key="i" class="cell">wrap {{ i }}</div></NSpace>
        </NSpace>

        <NLayout v-else-if="name === 'Layout'" style="height: 240px; border: 1px solid rgba(128,128,128,.2); border-radius: 6px; overflow: hidden">
          <NLayoutHeader bordered style="height: 44px; padding: 10px 16px">Header</NLayoutHeader>
          <NLayout has-sider position="absolute" style="top: 44px; bottom: 40px"><NLayoutSider bordered width="120" content-style="padding: 12px">Sider</NLayoutSider><NLayoutContent content-style="padding: 12px">Content</NLayoutContent></NLayout>
          <NLayoutFooter bordered position="absolute" style="height: 40px; padding: 10px 16px">Footer</NLayoutFooter>
        </NLayout>

        <NSpace v-else-if="name === 'Container'" vertical>
          <div v-for="w in [480, 768, 1024]" :key="w" class="cell" :style="{ maxWidth: w + 'px', margin: '0 auto', width: '100%' }">max-width {{ w }}px（居中容器）</div>
        </NSpace>

        <NGrid v-else-if="name === 'AspectRatio'" cols="2 m:4" responsive="screen" :x-gap="12" :y-gap="12">
          <NGi v-for="r in ['16 / 9', '4 / 3', '1 / 1', '3 / 4']" :key="r"><div class="cell" :style="{ aspectRatio: r, display: 'grid', placeItems: 'center' }">{{ r }}</div></NGi>
        </NGrid>

        <NSpace v-else-if="name === 'Resizable'" vertical>
          <NSplit v-model:size="splitSize" direction="horizontal" style="height: 140px" :min="0.2" :max="0.8"><template #1><div class="cell" style="height: 100%">左侧 {{ Math.round(splitSize * 100) }}%</div></template><template #2><div class="cell" style="height: 100%">右侧</div></template></NSplit>
          <NSplit direction="vertical" style="height: 160px" :default-size="0.5"><template #1><div class="cell" style="height: 100%">上</div></template><template #2><div class="cell" style="height: 100%">下</div></template></NSplit>
        </NSpace>

        <NGrid v-else-if="name === 'ScrollArea'" cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
          <NGi><NScrollbar style="max-height: 160px"><NList><NListItem v-for="o in orders" :key="o.id">{{ o.id }} · {{ o.customer }}</NListItem></NList></NScrollbar></NGi>
          <NGi><NScrollbar x-scrollable trigger="none"><NFlex :wrap="false" style="width: 1200px"><div v-for="i in 12" :key="i" class="cell" style="width: 90px">横向 {{ i }}</div></NFlex></NScrollbar></NGi>
        </NGrid>

        <NGrid v-else-if="name === 'Accordion'" cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
          <NGi><NCollapse default-expanded-names="1" accordion><NCollapseItem title="可以免费试用吗？" name="1">Starter 计划永久免费。</NCollapseItem><NCollapseItem title="支持私有部署吗？" name="2">Enterprise 支持。</NCollapseItem><NCollapseItem title="禁用项" name="3" disabled>-</NCollapseItem></NCollapse></NGi>
          <NGi><NCollapse arrow-placement="right" :default-expanded-names="['1', '2']"><NCollapseItem title="多项展开 A" name="1"><template #header-extra><NTag size="tiny">extra</NTag></template>内容 A</NCollapseItem><NCollapseItem title="多项展开 B" name="2">内容 B</NCollapseItem></NCollapse></NGi>
        </NGrid>

        <NSpace v-else-if="name === 'ThemeProvider'" vertical>
          <NFlex align="center"><NText>局部反转主题</NText><NSwitch v-model:value="themeInvert" /><NText depth="3">当前全局：{{ isDark ? "dark" : "light" }}</NText></NFlex>
          <NConfigProvider :theme="themeInvert !== isDark ? darkTheme : null" :theme-overrides="{ common: { primaryColor: '#18a058' } }">
            <NCard size="small" title="嵌套 NConfigProvider"><NFlex :wrap="true"><NButton type="primary">Primary</NButton><NButton>Default</NButton><NInput placeholder="输入" style="width: 140px" /><NTag type="success">Tag</NTag><NSwitch :value="true" /></NFlex></NCard>
          </NConfigProvider>
        </NSpace>

        <NWatermark v-else-if="name === 'Watermark'" content="Acme Console · 内部资料" cross :fullscreen="false" :font-size="14" :line-height="16" :width="220" :height="140" :x-offset="12" :y-offset="40" :rotate="-15">
          <div style="height: 200px; padding: 16px"><NText depth="3">带水印的内容区域。</NText></div>
        </NWatermark>

        <NSpace v-else-if="name === 'Tour'" vertical>
          <NAlert type="warning" title="Naive UI 未提供 Tour 组件">contract 中的 Tour（分步引导）在 Naive UI 2.x 中不存在，未做替代实现，标记为 missing。</NAlert>
        </NSpace>

        <NSpace v-else-if="name === 'FloatButton'" vertical>
          <NText depth="3">页面右下角为全局悬浮按钮组；下方为内联示例。</NText>
          <div style="position: relative; height: 96px">
            <NFloatButton position="absolute" :right="8" :bottom="8" type="primary" shape="circle"><Icon name="plus" /></NFloatButton>
            <NFloatButton position="absolute" :right="64" :bottom="8" shape="square"><Icon name="message-circle" :size="16" /><template #description>反馈</template></NFloatButton>
            <NFloatButtonGroup position="absolute" :right="120" :bottom="8" shape="square"><NFloatButton><Icon name="arrow-up" /></NFloatButton><NFloatButton><Icon name="arrow-down" /></NFloatButton></NFloatButtonGroup>
          </div>
          <NFloatButtonGroup :right="isMobile ? 16 : 40" :bottom="isMobile ? 130 : 96" shape="circle"><NFloatButton menu-trigger="hover" type="primary"><Icon name="sparkles" /><template #menu><NFloatButton><Icon name="mail" /></NFloatButton><NFloatButton><Icon name="message-circle" /></NFloatButton></template></NFloatButton></NFloatButtonGroup>
        </NSpace>

        <NFlex v-else-if="name === 'Kbd'" align="center" :wrap="true">
          <NText>保存 <span class="kbd">⌘</span> + <span class="kbd">S</span></NText><NText>搜索 <span class="kbd">Ctrl</span> + <span class="kbd">K</span></NText><NText>退出 <span class="kbd">Esc</span></NText><NText>方向 <span class="kbd">↑</span><span class="kbd">↓</span></NText>
        </NFlex>

        <NSpace v-else-if="name === 'Code'" vertical>
          <NCode code="pnpm add naive-ui" inline /> <NText>行内代码：<NText code>createDiscreteApi()</NText></NText>
          <NCode :code="`import { createApp } from 'vue'\nimport naive from 'naive-ui'\n\ncreateApp(App).use(naive).mount('#app')`" language="ts" show-line-numbers />
          <NCode :code="JSON.stringify(orders[0], null, 2)" language="json" word-wrap />
          <NLog :log="activity.map((a) => `[${a.time}] ${a.user} ${a.action}`).join('\n')" :rows="5" />
          <NHighlight text="Naive UI 是一个 Vue 3 组件库，主题可定制。" :patterns="['Vue 3', '主题']" />
        </NSpace>

        <NSpace v-else-if="name === 'Divider'" vertical>
          <NText>上方文本</NText><NDivider /><NDivider title-placement="left">左标题</NDivider><NDivider>居中标题</NDivider><NDivider title-placement="right">右标题</NDivider><NDivider dashed>虚线</NDivider>
          <NFlex align="center">左<NDivider vertical />中<NDivider vertical />右</NFlex>
          <NMarquee><NText depth="3" style="padding-right: 48px">滚动公告：{{ notifications.map((n) => n.title).join(" · ") }}</NText></NMarquee>
        </NSpace>

        <NFlex v-else-if="name === 'Link'" align="center" :wrap="true">
          <NA href="#index">默认链接</NA><NA href="#index" style="text-decoration: underline">下划线链接</NA><NButton text tag="a" href="#index" type="primary">文本按钮链接</NButton><NButton text tag="a" href="#index" type="primary"><template #icon><Icon name="link" /></template>带图标</NButton><NText depth="3">禁用链接</NText><NA href="#index" target="_blank" rel="noreferrer">新窗口 <NIcon :size="12"><Icon name="arrow-right" :size="12" /></NIcon></NA>
        </NFlex>

        <NDynamicInput v-else v-model:value="dynInputs" placeholder="占位" />
      </NCard>
    </template>
  </NSpace>
</template>

<style scoped>
.cell { background: rgba(24, 160, 88, 0.12); border: 1px dashed rgba(24, 160, 88, 0.5); border-radius: 4px; padding: 8px 12px; text-align: center; font-size: 13px; }
.kbd { display: inline-block; font-family: v-mono, Menlo, Consolas, monospace; font-size: 12px; line-height: 1; padding: 3px 6px; border-radius: 4px; border: 1px solid rgba(128,128,128,.4); border-bottom-width: 2px; background: rgba(128,128,128,.1); margin: 0 2px; }
</style>
