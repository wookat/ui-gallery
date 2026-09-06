<script setup lang="ts">
import { computed, nextTick, ref } from "vue"
import contract from "@ui-gallery/spec/contract.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import chat from "@ui-gallery/spec/mock/chat.json"
import landing from "@ui-gallery/spec/mock/landing.json"
import nav from "@ui-gallery/spec/mock/nav.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import team from "@ui-gallery/spec/mock/team.json"
import { showConfirmDialog, showDialog as openDialog, showImagePreview, showLoadingToast, showNotify, showToast } from "vant"
import AppIcon from "@/components/AppIcon.vue"
import DemoCard from "@/components/DemoCard.vue"
import { coverage } from "@/coverage"

const componentNames = contract.components
const vantExports = [
  "ActionBar", "ActionBarButton", "ActionBarIcon", "ActionSheet", "AddressEdit", "AddressList", "Area", "BackTop", "Badge",
  "Barrage", "Button", "Calendar", "Card", "Cascader", "Cell", "CellGroup", "Checkbox", "CheckboxGroup", "Circle", "Col",
  "Collapse", "CollapseItem", "ConfigProvider", "ContactCard", "ContactEdit", "ContactList", "CountDown", "Coupon", "CouponCell",
  "CouponList", "DatePicker", "Dialog", "Divider", "DropdownItem", "DropdownMenu", "Empty", "Field", "FloatingBubble",
  "FloatingPanel", "Form", "Grid", "GridItem", "Highlight", "Icon", "Image", "ImagePreview", "IndexAnchor", "IndexBar",
  "Lazyload", "List", "Loading", "Locale", "NavBar", "NoticeBar", "Notify", "NumberKeyboard", "Overlay", "Pagination",
  "PasswordInput", "Picker", "PickerGroup", "Popover", "Popup", "Progress", "PullRefresh", "Radio", "RadioGroup", "Rate",
  "RollingText", "Row", "Search", "ShareSheet", "Sidebar", "SidebarItem", "Signature", "Skeleton", "SkeletonAvatar",
  "SkeletonImage", "SkeletonParagraph", "SkeletonTitle", "Slider", "Space", "Step", "Stepper", "Steps", "Sticky", "SubmitBar",
  "Swipe", "SwipeCell", "SwipeItem", "Switch", "Tab", "Tabbar", "TabbarItem", "Tabs", "Tag", "TextEllipsis", "TimePicker",
  "Toast", "TreeSelect", "Uploader", "Watermark",
] as const
const statusType = (name: string) => (coverage[name] === "missing" ? "danger" : coverage[name] === "composed" ? "warning" : "success")
const summary = computed(() => {
  const counts = { implemented: 0, composed: 0, missing: 0 }
  for (const name of componentNames) counts[coverage[name] ?? "missing"] += 1
  return counts
})

const activeTab = ref(0)
const checked = ref(true)
const indeterminate = ref(true)
const groupChecked = ref(["a"])
const radio = ref("a")
const switchValue = ref(true)
const slider = ref(45)
const range = ref<[number, number]>([20, 70])
const rate = ref(4)
const stepper = ref(2)
const selected = ref("a")
const search = ref("")
const multiSelected = ref<string[]>(["web"])
const pickerOpen = ref(false)
const pickerText = ref(chat.models[0])
const showActionSheet = ref(false)
const showShareSheet = ref(false)
const drawerPosition = ref<"left" | "right" | "top" | "bottom" | null>(null)
const showOverlay = ref(false)
const showFullscreen = ref(false)
const showScrollDialog = ref(false)
const showFloatingPanel = ref(false)
const showCommand = ref(false)
const commandQuery = ref("")
const commandResults = computed(() => componentNames.filter((name) => name.toLowerCase().includes(commandQuery.value.toLowerCase())).slice(0, 8))
const jumpTo = (name: string) => {
  showCommand.value = false
  void nextTick(() => document.getElementById(name)?.scrollIntoView({ behavior: "smooth" }))
}
const stickyContainer = ref<HTMLElement | null>(null)
const dialogStage = ref<HTMLElement | null>(null)
const drawerStage = ref<HTMLElement | null>(null)
const bubbleStage = ref<HTMLElement | null>(null)

const dropdownScope = ref(0)
const dropdownSort = ref("a")
const dropdownDisabled = ref(0)
const dropdownScopeOptions = [{ text: "全部商品", value: 0 }, { text: "新款商品", value: 1 }]
const dropdownSortOptions = [{ text: "默认排序", value: "a" }, { text: "好评排序", value: "b" }]
const dropdownDisabledOptions = [{ text: "禁用项", value: 0 }]
const modelColumns = chat.models.map((text) => ({ text, value: text }))
const suggestions = computed(() => chat.suggestions.filter((item) => item.includes(search.value)))
const areaList = {
  province_list: { "110000": "省A", "120000": "省B" },
  city_list: { "110100": "市A", "120100": "市B" },
  county_list: { "110101": "区A", "120101": "区B" },
}
const cascaderOptions = [{ text: "省A", value: "a", children: [{ text: "市A", value: "aa" }] }, { text: "省B", value: "b", children: [{ text: "市B", value: "bb" }] }]
const treeItems = nav.slice(0, 2).map((item, index) => ({ text: item.label, children: nav.slice(index * 3, index * 3 + 3).map((child) => ({ text: child.label, id: child.key })) }))
const addresses = [
  { id: "address-1", name: team[0].name, tel: "138****0000", address: "省A市A区A 示例地址" },
  { id: "address-2", name: team[1].name, tel: "139****0000", address: "省B市B区B 示例地址" },
]
const contacts = team.slice(0, 2).map((member, index) => ({ id: `contact-${index}`, name: member.name, tel: `138****000${index}` }))
const couponDemo = { id: "coupon-1", name: "演示优惠券", condition: "满 ¥100 可用", description: "演示优惠券", value: 2000, valueDesc: "20", unitDesc: "元", startAt: Math.floor(Date.now() / 1000), endAt: Math.floor(Date.now() / 1000) + 86400, reason: "" }
const disabledCoupon = { ...couponDemo, id: "coupon-disabled", name: "暂不可用优惠券" }
const svgImage = (fill: string, label: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='240' height='160'><rect width='240' height='160' fill='${fill}'/><text x='120' y='88' fill='white' text-anchor='middle'>${label}</text></svg>`)}`
const imageSources = [svgImage("#1989fa", "Demo A"), svgImage("#07c160", "Demo B")]
const avatar = (name: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><circle cx='20' cy='20' r='20' fill='#1989fa'/><text x='20' y='25' text-anchor='middle' fill='white'>${name.slice(0, 1)}</text></svg>`)}`
const longText = `${landing.testimonials[0].quote} ${landing.hero.subtitle} ${landing.hero.social}`
const circleRate = ref(65)
const floatingAnchors = [100, 200]
const tooltipShown = ref(true)
const barrageList = ref(chat.conversations.slice(0, 4).map((item, index) => ({ id: index, text: item.title })))
const actionSheetActions = [{ name: "选项一" }, { name: "选项二" }, { name: "选项三", disabled: true }]
const shareOptions = [{ name: "微信", icon: "wechat" }, { name: "微博", icon: "weibo" }, { name: "复制链接", icon: "link" }, { name: "邮件", icon: "envelop-o" }]
const previewImages = () => showImagePreview(imageSources)
const statusText: Record<string, string> = { paid: "已支付", pending: "待处理", refunded: "已退款", failed: "失败", shipped: "已发货" }
const tagType = (status: string) => (status === "paid" ? "success" : status === "failed" ? "danger" : status === "pending" ? "warning" : "primary")
const confirmModel = ({ selectedValues }: { selectedValues: string[] }) => { pickerText.value = selectedValues[0] ?? pickerText.value; pickerOpen.value = false }
const toastWithAction = () => showNotify({ type: "primary", message: "订单已归档 · 点击撤销", duration: 4000, onClick: () => showToast("已撤销") })
const loadingToast = () => showLoadingToast({ message: "加载中...", forbidClick: true, duration: 1200 })
const confirmDialog = () => showConfirmDialog({ title: "确认删除", message: "删除后无法恢复" }).catch(() => undefined)
const plainDialog = () => openDialog({ title: "提示", message: landing.hero.subtitle })
</script>

<template>
  <div class="page components-page">
    <div class="page-title">
      <div><h1>组件全集</h1><p>Vant {{ vantExports.length }} 个导出组件 + contract {{ componentNames.length }} 项覆盖（implemented {{ summary.implemented }} / composed {{ summary.composed }} / missing {{ summary.missing }}）</p></div>
      <van-button type="primary" @click="showCommand = true"><template #icon><AppIcon name="search" /></template>组件搜索</van-button>
    </div>

    <div class="card component-index">
      <strong>Contract 覆盖（绿 implemented / 黄 composed / 红 missing）</strong>
      <div class="inline component-index-links">
        <a v-for="name in componentNames" :key="name" :href="`#${name}`"><van-tag :type="statusType(name)">{{ name }}</van-tag></a>
      </div>
      <strong>Vant 导出</strong>
      <div class="inline component-index-links">
        <a v-for="name in vantExports" :key="`vant-${name}`" :href="`#vant-${name}`"><van-tag plain type="primary">{{ name }}</van-tag></a>
      </div>
    </div>

    <section class="demo-category">
      <h2>排版</h2>
      <div class="component-grid">
        <DemoCard name="Typography" vant="原生 HTML + Vant 字体/颜色 token"><h1 class="t-h1">标题 h1</h1><h2 class="t-h2">标题 h2</h2><h3 class="t-h3">标题 h3</h3><h4 class="t-h4">标题 h4</h4><h5 class="t-h5">标题 h5</h5><h6 class="t-h6">标题 h6</h6><p>{{ landing.hero.subtitle }}</p><blockquote class="quote">{{ landing.testimonials[0].quote }}</blockquote><ul class="list"><li v-for="item in landing.features.slice(0, 3)" :key="item.title">{{ item.title }}</li></ul></DemoCard>
        <DemoCard name="Code" vant="pre / code"><pre class="code-demo"><code>const app = createApp(App).use(Vant)</code></pre><p>行内 <code class="inline-code">van-button</code> 代码</p></DemoCard>
        <DemoCard name="Kbd" vant="van-tag mark"><van-space><van-tag mark>⌘</van-tag><van-tag mark>K</van-tag><span class="muted">打开命令面板</span></van-space></DemoCard>
        <DemoCard name="Link" vant="a + --van-primary-color"><van-space wrap><a class="text-link" href="#Button">默认链接</a><a class="text-link muted" href="#Button">次级链接</a><a class="text-link" href="#Button"><AppIcon name="external-link" :size="14" />外链</a></van-space></DemoCard>
        <DemoCard name="Divider" vant="van-divider" :also="['Divider']"><van-divider>默认</van-divider><van-divider content-position="left">左对齐</van-divider><van-divider content-position="right">右对齐</van-divider><van-divider dashed>虚线</van-divider><van-divider :hairline="false" /></DemoCard>
      </div>
    </section>

    <section class="demo-category">
      <h2>按钮</h2>
      <div class="component-grid">
        <DemoCard name="Button" vant="van-button" :also="['Button']" class="span-2">
          <div class="native-sizes">
            <p class="row-label">类型</p><div class="button-matrix"><van-button v-for="type in ['primary', 'success', 'warning', 'danger', 'default']" :key="type" :type="type as 'primary'">{{ type }}</van-button></div>
            <p class="row-label">plain / hairline / round / square</p><div class="button-matrix"><van-button plain type="primary">plain</van-button><van-button plain hairline type="primary">hairline</van-button><van-button round type="primary">round</van-button><van-button square type="primary">square</van-button><van-button plain type="danger">plain danger</van-button></div>
            <p class="row-label">尺寸 large / normal / small / mini</p><div class="button-matrix align-end"><van-button v-for="size in ['large', 'normal', 'small', 'mini']" :key="size" type="primary" :size="size as 'normal'">{{ size }}</van-button></div>
            <p class="row-label">状态 loading / disabled</p><div class="button-matrix"><van-button type="primary" loading loading-text="加载中" /><van-button type="primary" loading loading-type="spinner" /><van-button disabled>disabled</van-button><van-button type="primary" disabled>disabled</van-button></div>
            <p class="row-label">block</p><van-button block type="primary">block</van-button>
          </div>
        </DemoCard>
        <DemoCard name="IconButton" vant="van-button icon / #icon slot"><div class="button-matrix"><van-button type="primary" icon="plus" aria-label="新增" /><van-button plain type="primary" icon="search" aria-label="搜索" /><van-button round icon="like-o" aria-label="喜欢" /><van-button square type="danger" icon="delete-o" aria-label="删除" /><van-button type="primary" aria-label="设置"><template #icon><AppIcon name="settings" /></template></van-button><van-button icon="plus" disabled aria-label="禁用" /><van-button type="primary" loading aria-label="加载" /></div><div class="button-matrix"><van-button type="primary" icon="plus">带图标</van-button><van-button type="primary" icon-position="right" icon="arrow">右图标</van-button></div></DemoCard>
        <DemoCard name="ButtonGroup" vant="van-space + van-action-bar"><van-space><van-button type="primary">保存</van-button><van-button>取消</van-button><van-button plain type="danger">删除</van-button></van-space><van-action-bar class="inline-action-bar"><van-action-bar-icon icon="chat-o" text="客服" /><van-action-bar-icon icon="cart-o" text="购物车" badge="2" /><van-action-bar-button type="warning" text="加入购物车" /><van-action-bar-button type="danger" text="立即购买" /></van-action-bar></DemoCard>
      </div>
    </section>

    <section class="demo-category">
      <h2>表单控件</h2>
      <div class="component-grid">
        <DemoCard name="Input" vant="van-field" :also="['Field']"><van-cell-group inset><van-field label="姓名" placeholder="请输入姓名" clearable /><van-field label="邮箱" placeholder="name@acme.dev" left-icon="envelop-o" /><van-field label="密码" type="password" placeholder="密码" right-icon="eye-o" /><van-field label="搜索" placeholder="搜索" left-icon="search" clearable /><van-field label="前后缀" placeholder="金额"><template #button><van-button size="small" type="primary">发送</van-button></template></van-field><van-field label="错误" model-value="abc" error error-message="格式不正确" /><van-field label="禁用" model-value="只读内容" disabled /></van-cell-group></DemoCard>
        <DemoCard name="Textarea" vant="van-field type=textarea"><van-cell-group inset><van-field label="简介" type="textarea" placeholder="请输入简介" autosize rows="2" maxlength="120" show-word-limit /><van-field label="禁用" type="textarea" model-value="不可编辑" disabled rows="1" autosize /></van-cell-group></DemoCard>
        <DemoCard name="NumberInput" vant="van-stepper / van-field type=digit" :also="['Stepper']"><van-space direction="vertical" fill><van-stepper v-model="stepper" /><van-stepper v-model="stepper" theme="round" button-size="40" /><van-stepper :model-value="1" step="0.1" :decimal-length="1" /><van-stepper :model-value="3" disabled /></van-space><van-cell-group inset class="mt"><van-field label="数字" type="digit" placeholder="仅数字" /><van-field label="小数" type="number" placeholder="支持小数" /></van-cell-group></DemoCard>
        <DemoCard name="Select" vant="van-picker（弹层选择）" :also="['Picker']"><van-cell-group inset><van-field :model-value="pickerText" is-link readonly label="模型" placeholder="请选择" @click="pickerOpen = true" /></van-cell-group><van-picker :columns="modelColumns" class="mt inline-picker" /></DemoCard>
        <DemoCard name="MultiSelect" vant="van-dropdown-menu + van-checkbox-group"><van-dropdown-menu><van-dropdown-item title="渠道"><van-checkbox-group v-model="multiSelected" class="menu-checks"><van-checkbox name="web">Web</van-checkbox><van-checkbox name="api">API</van-checkbox><van-checkbox name="mobile">Mobile</van-checkbox></van-checkbox-group></van-dropdown-item></van-dropdown-menu><van-space wrap class="mt"><van-tag v-for="item in multiSelected" :key="item" type="primary" closeable @close="multiSelected = multiSelected.filter((value) => value !== item)">{{ item }}</van-tag></van-space></DemoCard>
        <DemoCard name="Combobox" vant="van-search + van-cell 列表" :also="['Search']"><van-search v-model="search" placeholder="输入以筛选建议" /><van-cell v-for="item in suggestions.slice(0, 3)" :key="item" :title="item" clickable @click="search = item" /></DemoCard>
        <DemoCard name="Autocomplete" vant="van-field + 建议列表"><van-cell-group inset><van-field v-model="search" label="成员" placeholder="输入姓名" clearable /></van-cell-group><van-cell v-for="member in team.filter((item) => item.name.includes(search)).slice(0, 3)" :key="member.email" :title="member.name" :label="member.email" clickable @click="search = member.name" /></DemoCard>
        <DemoCard name="Checkbox" vant="van-checkbox / van-checkbox-group" :also="['Checkbox', 'CheckboxGroup']"><van-space wrap><van-checkbox v-model="checked">已选</van-checkbox><van-checkbox v-model="indeterminate" :indeterminate="indeterminate">半选</van-checkbox><van-checkbox shape="square">方形</van-checkbox><van-checkbox disabled>禁用</van-checkbox><van-checkbox :model-value="true" disabled>禁用已选</van-checkbox></van-space><van-checkbox-group v-model="groupChecked" direction="horizontal" max="2" class="mt"><van-checkbox name="a">选项 A</van-checkbox><van-checkbox name="b">选项 B</van-checkbox><van-checkbox name="c">选项 C</van-checkbox></van-checkbox-group></DemoCard>
        <DemoCard name="Radio" vant="van-radio / van-radio-group" :also="['Radio', 'RadioGroup']"><van-radio-group v-model="radio" direction="horizontal"><van-radio name="a">选项 A</van-radio><van-radio name="b">选项 B</van-radio><van-radio name="c" disabled>禁用</van-radio></van-radio-group><van-radio-group v-model="radio" class="mt"><van-radio name="a" shape="square">方形 A</van-radio><van-radio name="b" shape="square">方形 B</van-radio></van-radio-group></DemoCard>
        <DemoCard name="Switch" vant="van-switch" :also="['Switch']"><van-space><van-switch v-model="switchValue" /><van-switch :model-value="false" /><van-switch loading /><van-switch disabled /><van-switch :model-value="true" size="20px" /></van-space></DemoCard>
        <DemoCard name="Slider" vant="van-slider" :also="['Slider']"><van-slider v-model="slider" step="5" /><van-slider v-model="range" range class="mt" /><van-slider :model-value="30" disabled class="mt" /><van-slider vertical :model-value="40" class="vertical-slider" /></DemoCard>
        <DemoCard name="Rating" vant="van-rate" :also="['Rate']"><van-space direction="vertical"><van-rate v-model="rate" allow-half /><van-rate :model-value="3" readonly /><van-rate :model-value="2" :count="7" disabled /><van-rate :model-value="4" icon="like" void-icon="like-o" /></van-space></DemoCard>
        <DemoCard name="DatePicker" vant="van-date-picker" :also="['DatePicker']"><van-date-picker title="选择日期" :columns-type="['year', 'month', 'day']" /></DemoCard>
        <DemoCard name="TimePicker" vant="van-time-picker" :also="['TimePicker']"><van-time-picker title="选择时间" :columns-type="['hour', 'minute', 'second']" /></DemoCard>
        <DemoCard name="DateRangePicker" vant="van-calendar type=range"><van-calendar type="range" :poppable="false" :show-confirm="false" :style="{ height: '420px' }" /></DemoCard>
        <DemoCard name="ColorPicker" vant="原生 input[type=color] 兜底"><van-cell-group inset><van-field label="主色"><template #input><input type="color" value="#1989fa" aria-label="主色" /></template></van-field></van-cell-group></DemoCard>
        <DemoCard name="Upload" vant="van-uploader" :also="['Uploader']"><van-uploader multiple preview-size="60" :max-count="3" /><van-uploader class="mt" disabled /><div class="upload-drop">拖拽文件到这里上传</div></DemoCard>
        <DemoCard name="Cascader" vant="van-cascader" :also="['Cascader']"><van-cascader title="请选择地区" :options="cascaderOptions" /></DemoCard>
        <DemoCard name="Transfer" vant="—" />
        <DemoCard name="Mention" vant="—" />
        <DemoCard name="PinInput" vant="van-password-input + van-number-keyboard" :also="['PasswordInput', 'NumberKeyboard']"><van-password-input :value="'1234'" :gutter="8" /><van-password-input :value="'12'" :mask="false" :length="4" class="mt" /><div class="keyboard-box"><van-number-keyboard :show="true" theme="custom" close-button-text="完成" extra-key="." /></div></DemoCard>
        <DemoCard name="Form" vant="van-form 垂直 / 水平 / 内联" :also="['Form']" class="span-2"><van-form><p class="row-label">水平</p><van-cell-group inset><van-field label="用户名" placeholder="必填" required :rules="[{ required: true }]" /><van-field label="邮箱" placeholder="name@acme.dev" required /></van-cell-group><p class="row-label">垂直</p><van-cell-group inset><van-field label="备注" label-align="top" type="textarea" rows="1" autosize placeholder="选填" /></van-cell-group><p class="row-label">内联</p><div class="inline"><van-field placeholder="关键字" class="inline-field" /><van-button type="primary" native-type="submit">查询</van-button></div></van-form></DemoCard>
      </div>
    </section>

    <section class="demo-category">
      <h2>数据展示</h2>
      <div class="component-grid">
        <DemoCard name="Table" vant="CSS grid + van-tag（Vant 无表格组件）" class="span-2"><div class="table-wrap"><div class="mini-table"><div class="mini-head">订单</div><div class="mini-head">客户</div><div class="mini-head">状态</div><div class="mini-head amount">金额</div><template v-for="order in orders.slice(0, 4)" :key="order.id"><div>{{ order.id }}</div><div>{{ order.customer }}</div><div><van-tag :type="tagType(order.status)">{{ statusText[order.status] ?? order.status }}</van-tag></div><div class="amount">¥{{ order.amount.toLocaleString() }}</div></template></div></div></DemoCard>
        <DemoCard name="DataGrid" vant="—" />
        <DemoCard name="Descriptions" vant="van-cell-group + van-cell" :also="['Cell', 'CellGroup']"><van-cell-group inset><van-cell title="客户" :value="orders[0].customer" /><van-cell title="产品" :value="orders[0].product" /><van-cell title="日期" :value="orders[0].date" /><van-cell title="金额" :value="`¥${orders[0].amount}`" /><van-cell title="链接" is-link value="详情" /></van-cell-group></DemoCard>
        <DemoCard name="List" vant="van-list" :also="['List']"><van-list :finished="true" finished-text="没有更多了"><van-cell v-for="item in activity.slice(0, 4)" :key="item.action" :title="item.user" :label="item.action" :value="item.time" /></van-list></DemoCard>
        <DemoCard name="Card" vant="van-card" :also="['Card']"><van-card num="2" price="10.00" desc="示例描述" title="示例商品" tag="标签"><template #thumb><div class="thumb-placeholder">图</div></template><template #footer><van-button size="mini">按钮</van-button></template></van-card><van-card class="mt" title="仅标题与描述" desc="纵向布局" /></DemoCard>
        <DemoCard name="Avatar" vant="van-image round"><van-space><van-image v-for="member in team.slice(0, 3)" :key="member.email" round width="40" height="40" :src="avatar(member.name)" /><van-image round width="40" height="40" src="" error-icon="user-o" /><span class="avatar-fallback">{{ team[3].name.slice(0, 1) }}</span></van-space></DemoCard>
        <DemoCard name="AvatarGroup" vant="van-image round 叠放"><div class="avatar-group"><van-image v-for="member in team.slice(0, 4)" :key="member.email" round width="36" height="36" :src="avatar(member.name)" /><span class="avatar-fallback small">+{{ team.length - 4 }}</span></div></DemoCard>
        <DemoCard name="Badge" vant="van-badge" :also="['Badge']"><van-space :size="20"><van-badge content="5"><div class="badge-box" /></van-badge><van-badge dot><div class="badge-box" /></van-badge><van-badge content="99+" max="99"><div class="badge-box" /></van-badge><van-badge content="new" color="#07c160"><div class="badge-box" /></van-badge><van-badge content="8" position="bottom-right"><div class="badge-box" /></van-badge></van-space></DemoCard>
        <DemoCard name="Tag" vant="van-tag" :also="['Tag']"><van-space wrap><van-tag v-for="type in ['primary', 'success', 'warning', 'danger', 'default']" :key="type" :type="type as 'primary'">{{ type }}</van-tag><van-tag plain type="primary">plain</van-tag><van-tag round type="primary">round</van-tag><van-tag mark type="success">mark</van-tag><van-tag size="medium" type="primary">medium</van-tag><van-tag size="large" type="primary">large</van-tag><van-tag closeable type="primary">closeable</van-tag></van-space></DemoCard>
        <DemoCard name="Statistic" vant="van-rolling-text + van-count-down" :also="['RollingText', 'CountDown']"><div class="stat-row"><div v-for="stat in stats.slice(0, 2)" :key="stat.label" class="stat"><small class="muted">{{ stat.label }}</small><van-rolling-text :start-num="0" :target-num="Math.round(Number(stat.value))" :duration="1.5" class="stat-number" /></div></div><van-count-down :time="3600000" format="HH:mm:ss" class="mt" /><van-count-down :time="3600000" millisecond format="mm:ss:SS" /></DemoCard>
        <DemoCard name="Timeline" vant="van-steps direction=vertical"><van-steps direction="vertical" :active="2"><van-step v-for="item in activity.slice(0, 4)" :key="item.action"><strong>{{ item.user }}</strong> {{ item.action }}<p class="muted step-time">{{ item.time }}</p></van-step></van-steps></DemoCard>
        <DemoCard name="Tree" vant="van-tree-select" :also="['TreeSelect']"><van-tree-select :items="treeItems" :main-active-index="0" :active-id="treeItems[0].children[0].id" :height="200" /></DemoCard>
        <DemoCard name="Calendar" vant="van-calendar" :also="['Calendar']"><van-calendar :poppable="false" :show-confirm="false" :style="{ height: '420px' }" /></DemoCard>
        <DemoCard name="Image" vant="van-image / showImagePreview" :also="['Image', 'ImagePreview']"><van-space wrap align="center"><van-image width="80" height="80" fit="cover" :src="imageSources[0]" /><van-image width="80" height="80" round fit="cover" :src="imageSources[1]" /><van-image width="80" height="80" src="" error-icon="photo-fail" /><van-image width="80" height="80" :src="imageSources[0]" :show-loading="true" /><van-button size="small" @click="previewImages">预览</van-button></van-space></DemoCard>
        <DemoCard name="Carousel" vant="van-swipe" :also="['Swipe', 'SwipeItem']"><van-swipe :autoplay="3000" indicator-color="white" :style="{ height: '110px' }"><van-swipe-item v-for="(item, index) in landing.features.slice(0, 3)" :key="item.title"><div class="swipe-box" :class="`swipe-${index}`">{{ item.title }}</div></van-swipe-item></van-swipe><van-swipe vertical :autoplay="0" :show-indicators="false" :style="{ height: '56px' }" class="mt"><van-swipe-item v-for="n in 2" :key="n"><div class="swipe-box">纵向 {{ n }}</div></van-swipe-item></van-swipe></DemoCard>
        <DemoCard name="Empty" vant="van-empty" :also="['Empty']"><van-empty image="search" image-size="72" description="没有找到结果"><van-button type="primary" size="small" round>刷新</van-button></van-empty></DemoCard>
        <DemoCard name="Tooltip" vant="van-popover theme=dark"><van-popover v-model:show="tooltipShown" theme="dark" placement="bottom-start" :offset="[0, 4]"><span class="tooltip-text">{{ landing.hero.social }}</span><template #reference><van-button plain size="small">悬浮提示</van-button></template></van-popover></DemoCard>
        <DemoCard name="Popover" vant="van-popover" :also="['Popover']"><van-space><van-popover :actions="[{ text: '编辑', icon: 'edit' }, { text: '删除', icon: 'delete-o' }]" placement="bottom-start"><template #reference><van-button size="small">浅色菜单</van-button></template></van-popover><van-popover theme="dark" :actions="[{ text: '操作一' }, { text: '操作二', disabled: true }]"><template #reference><van-button size="small" plain>深色菜单</van-button></template></van-popover></van-space></DemoCard>
        <DemoCard name="QRCode" vant="—" />
        <DemoCard name="Segmented" vant="van-tabs type=card"><van-tabs v-model:active="activeTab" type="card"><van-tab title="日"><p class="segment-body">{{ stats[0].label }} {{ stats[0].value }}</p></van-tab><van-tab title="周"><p class="segment-body">{{ stats[1].label }} {{ stats[1].value }}</p></van-tab><van-tab title="月"><p class="segment-body">{{ stats[2].label }} {{ stats[2].value }}</p></van-tab></van-tabs></DemoCard>
      </div>
    </section>

    <section class="demo-category">
      <h2>反馈</h2>
      <div class="component-grid">
        <DemoCard name="Alert" vant="van-notice-bar（3 级）+ 成功态用 van-notify 静态" :also="['NoticeBar']"><van-space direction="vertical" fill><van-notice-bar left-icon="info-o" :scrollable="false" text="信息：系统将于今晚维护。" /><div class="notify-static notify-static--success"><van-icon name="checked" /> 成功：设置已保存。</div><van-notice-bar type="warning" left-icon="warning-o" :scrollable="false" text="警告：配额即将用尽。" /><van-notice-bar type="danger" left-icon="fail" :scrollable="false" mode="closeable" text="错误：支付网关不可用。" /><van-notice-bar mode="link" left-icon="volume-o" text="带操作：查看更新日志" /></van-space></DemoCard>
        <DemoCard name="Toast" vant="showToast" :also="['Toast']"><van-space wrap><van-button size="small" @click="showToast('文本提示')">文本</van-button><van-button size="small" type="success" @click="showToast({ type: 'success', message: '成功' })">成功</van-button><van-button size="small" type="danger" @click="showToast({ type: 'fail', message: '失败' })">失败</van-button><van-button size="small" type="warning" @click="showToast({ type: 'text', message: '警告：请检查输入', position: 'top' })">警告</van-button><van-button size="small" @click="loadingToast">加载</van-button><van-button size="small" plain @click="toastWithAction">带操作（Notify）</van-button></van-space></DemoCard>
        <DemoCard name="Notification" vant="showNotify" :also="['Notify']"><van-space wrap><van-button v-for="type in ['primary', 'success', 'warning', 'danger']" :key="type" size="small" :type="type as 'primary'" @click="showNotify({ type: type as 'primary', message: `${type} 通知` })">{{ type }}</van-button><van-button size="small" plain @click="toastWithAction">带操作</van-button></van-space><div class="notify-static notify-static--success mt"><van-icon name="checked" /> 成功：文件已上传（静态样式）</div></DemoCard>
        <DemoCard name="Dialog" vant="showDialog / showConfirmDialog / van-popup 全屏 / 可滚动" :also="['Dialog']"><van-space wrap><van-button size="small" @click="plainDialog">普通</van-button><van-button size="small" @click="confirmDialog">确认</van-button><van-button size="small" @click="showFullscreen = true">全屏</van-button><van-button size="small" @click="showScrollDialog = true">可滚动</van-button></van-space><div ref="dialogStage" class="popup-stage mt"><van-dialog v-if="dialogStage" :show="true" :teleport="dialogStage" :lock-scroll="false" title="标题" show-cancel-button :overlay-style="{ position: 'absolute' }">{{ landing.hero.subtitle }}</van-dialog></div></DemoCard>
        <DemoCard name="Drawer" vant="van-popup position=left/right/top/bottom" :also="['Popup', 'Overlay']"><van-space wrap><van-button v-for="position in ['left', 'right', 'top', 'bottom']" :key="position" size="small" @click="drawerPosition = position as 'left'">{{ position }}</van-button><van-button size="small" plain @click="showOverlay = true">Overlay</van-button></van-space><div ref="drawerStage" class="popup-stage mt"><van-popup v-if="drawerStage" :show="true" :teleport="drawerStage" :lock-scroll="false" position="left" :style="{ width: '60%', height: '100%' }" :overlay-style="{ position: 'absolute' }"><van-cell v-for="item in nav.slice(0, 4)" :key="item.key" :title="item.label" /></van-popup></div></DemoCard>
        <DemoCard name="Progress" vant="van-progress / van-circle / van-steps" :also="['Progress', 'Circle']"><van-progress :percentage="tasks[0].progress" /><van-progress :percentage="tasks[1].progress" stroke-width="8" color="var(--van-success-color)" class="mt" /><van-progress :percentage="tasks[2].progress" inactive class="mt" /><div class="inline mt"><van-circle v-model:current-rate="circleRate" :rate="65" :speed="100" text="65%" size="88px" /><van-circle :current-rate="40" :rate="40" :speed="0" layer-color="var(--van-gray-3)" text="40%" size="88px" /></div><van-steps :active="1" class="mt"><van-step>创建</van-step><van-step>审核</van-step><van-step>完成</van-step></van-steps></DemoCard>
        <DemoCard name="Skeleton" vant="van-skeleton 系列" :also="['Skeleton', 'SkeletonTitle', 'SkeletonAvatar', 'SkeletonParagraph', 'SkeletonImage']"><van-skeleton title avatar :row="3" animate /><van-skeleton class="mt"><template #template><div class="inline"><van-skeleton-image /><div class="stack"><van-skeleton-title /><van-skeleton-paragraph row-width="60%" /><van-skeleton-paragraph /></div></div></template></van-skeleton></DemoCard>
        <DemoCard name="Spinner" vant="van-loading" :also="['Loading']"><van-space :size="20" align="center"><van-loading /><van-loading type="spinner" /><van-loading size="32" /><van-loading color="var(--van-primary-color)" /><van-loading vertical size="20">加载中</van-loading></van-space></DemoCard>
        <DemoCard name="Result" vant="van-empty + 按钮"><van-empty image="default" image-size="72" description="提交成功"><van-space><van-button type="primary" size="small">查看详情</van-button><van-button size="small">返回</van-button></van-space></van-empty></DemoCard>
        <DemoCard name="Popconfirm" vant="van-popover + 按钮"><van-popover placement="bottom-start"><div class="popover-actions"><span>确认删除？</span><van-button size="mini">取消</van-button><van-button size="mini" type="danger">删除</van-button></div><template #reference><van-button size="small" plain type="danger">删除</van-button></template></van-popover></DemoCard>
      </div>
    </section>

    <section class="demo-category">
      <h2>导航</h2>
      <div class="component-grid">
        <DemoCard name="Menu" vant="van-sidebar（垂直）/ van-tabs（水平）/ van-collapse（内嵌）"><van-tabs :active="0" shrink><van-tab v-for="item in nav.slice(0, 4)" :key="item.key" :title="item.label" /></van-tabs><div class="menu-row mt"><van-sidebar :model-value="0"><van-sidebar-item v-for="item in nav.slice(0, 3)" :key="item.key" :title="item.label" /></van-sidebar><van-collapse :model-value="['group']" class="menu-collapse"><van-collapse-item title="内嵌分组" name="group"><van-cell v-for="item in nav.slice(3, 6)" :key="item.key" :title="item.label" clickable /></van-collapse-item></van-collapse></div></DemoCard>
        <DemoCard name="Dropdown" vant="van-dropdown-menu" :also="['DropdownMenu', 'DropdownItem']"><van-dropdown-menu><van-dropdown-item v-model="dropdownScope" :options="dropdownScopeOptions" /><van-dropdown-item v-model="dropdownSort" :options="dropdownSortOptions" /></van-dropdown-menu><van-dropdown-menu direction="up" class="mt"><van-dropdown-item v-model="dropdownDisabled" disabled :options="dropdownDisabledOptions" /></van-dropdown-menu></DemoCard>
        <DemoCard name="Breadcrumb" vant="a + 分隔图标"><nav class="breadcrumb"><a href="#Button">首页</a><AppIcon name="chevron-right" :size="14" /><a href="#Form">订单</a><AppIcon name="chevron-right" :size="14" /><span>{{ orders[0].id }}</span></nav></DemoCard>
        <DemoCard name="Tabs" vant="van-tabs line / card / shrink / 徽标 / 禁用" :also="['Tabs', 'Tab']"><van-tabs :active="0"><van-tab title="line 一">内容一</van-tab><van-tab title="line 二" badge="3">内容二</van-tab><van-tab title="禁用" disabled>内容三</van-tab></van-tabs><van-tabs :active="1" type="card" class="mt"><van-tab v-for="n in 3" :key="n" :title="`card ${n}`" /></van-tabs><van-tabs :active="0" shrink animated swipeable class="mt"><van-tab v-for="item in nav.slice(0, 5)" :key="item.key" :title="item.label" dot /></van-tabs></DemoCard>
        <DemoCard name="Pagination" vant="van-pagination" :also="['Pagination']"><van-pagination :model-value="2" :total-items="orders.length" :items-per-page="5" /><van-pagination :model-value="1" :page-count="12" mode="simple" class="mt" /><van-pagination :model-value="3" :page-count="20" :show-page-size="5" force-ellipses class="mt" /></DemoCard>
        <DemoCard name="Steps" vant="van-steps" :also="['Steps', 'Step']"><van-steps :active="1"><van-step>基本信息</van-step><van-step>详细配置</van-step><van-step>确认</van-step></van-steps><van-steps :active="2" active-icon="success" inactive-icon="arrow" class="mt"><van-step>提交</van-step><van-step>审核</van-step><van-step>完成</van-step></van-steps></DemoCard>
        <DemoCard name="Anchor" vant="van-index-bar / van-index-anchor" :also="['IndexBar', 'IndexAnchor']"><div class="index-box"><van-index-bar :index-list="['A', 'B', 'C']" :sticky="false"><van-index-anchor index="A" /><van-cell title="Anchor" /><van-cell title="Avatar" /><van-index-anchor index="B" /><van-cell title="Badge" /><van-cell title="Button" /><van-index-anchor index="C" /><van-cell title="Card" /><van-cell title="Cascader" /></van-index-bar></div></DemoCard>
        <DemoCard name="BackTop" vant="van-back-top（页面右下角）" :also="['BackTop']"><p class="muted">滚动超过 240px 后页面右下角出现回到顶部按钮。</p><van-back-top :offset="240" :bottom="90" /></DemoCard>
        <DemoCard name="Affix" vant="van-sticky" :also="['Sticky']"><div ref="stickyContainer" class="sticky-box"><van-sticky :container="stickyContainer ?? undefined" :offset-top="72"><van-button size="small" type="primary">Sticky 吸顶</van-button></van-sticky><p class="muted">容器内滚动时按钮吸附在顶部。</p></div></DemoCard>
        <DemoCard name="Navbar" vant="van-nav-bar" :also="['NavBar']"><van-nav-bar title="标题" left-text="返回" right-text="按钮" left-arrow /><van-nav-bar title="自定义" left-arrow class="mt"><template #right><van-icon name="search" size="18" /></template></van-nav-bar></DemoCard>
        <DemoCard name="Sidebar" vant="van-sidebar / van-tabbar" :also="['Sidebar', 'SidebarItem', 'Tabbar', 'TabbarItem']"><van-sidebar :model-value="0"><van-sidebar-item title="项目一" badge="12" /><van-sidebar-item title="项目二" dot /><van-sidebar-item title="禁用" disabled /></van-sidebar><van-tabbar :model-value="0" :fixed="false" class="mt"><van-tabbar-item icon="home-o" dot>首页</van-tabbar-item><van-tabbar-item icon="search">搜索</van-tabbar-item><van-tabbar-item icon="setting-o" badge="3">设置</van-tabbar-item></van-tabbar></DemoCard>
        <DemoCard name="CommandPalette" vant="van-popup + van-search + van-cell"><van-button size="small" @click="showCommand = true"><template #icon><AppIcon name="search" :size="14" /></template>打开命令面板 ⌘K</van-button></DemoCard>
      </div>
    </section>

    <section class="demo-category">
      <h2>布局</h2>
      <div class="component-grid">
        <DemoCard name="Grid" vant="van-row / van-col / van-grid" :also="['Row', 'Col', 'Grid', 'GridItem']"><van-row gutter="8"><van-col v-for="n in 3" :key="n" span="8"><div class="grid-cell">span 8</div></van-col><van-col span="18" offset="6"><div class="grid-cell">18 offset 6</div></van-col></van-row><van-grid :column-num="4" square class="mt"><van-grid-item v-for="item in nav.slice(0, 4)" :key="item.key" icon="apps-o" :text="item.label" /></van-grid></DemoCard>
        <DemoCard name="Stack" vant="van-space" :also="['Space']"><van-space><van-button size="small">水平</van-button><van-button size="small">间距</van-button></van-space><van-space direction="vertical" fill class="mt"><van-button block size="small">垂直</van-button><van-button block size="small">间距</van-button></van-space></DemoCard>
        <DemoCard name="Layout" vant="CSS grid + van-nav-bar / van-tabbar"><div class="layout-box"><van-nav-bar title="Header" /><main>Content</main><van-tabbar :fixed="false" :model-value="0"><van-tabbar-item icon="home-o">首页</van-tabbar-item><van-tabbar-item icon="setting-o">设置</van-tabbar-item></van-tabbar></div></DemoCard>
        <DemoCard name="Container" vant="max-width 容器"><div class="container-box"><div class="container-inner">max-width: 320px 居中容器</div></div></DemoCard>
        <DemoCard name="AspectRatio" vant="—" />
        <DemoCard name="Resizable" vant="—" />
        <DemoCard name="ScrollArea" vant="van-pull-refresh + overflow 容器" :also="['PullRefresh']"><div class="scroll-box"><van-pull-refresh :model-value="false"><van-cell v-for="item in activity" :key="item.action" :title="item.user" :label="item.action" /></van-pull-refresh></div></DemoCard>
        <DemoCard name="Accordion" vant="van-collapse accordion" :also="['Collapse', 'CollapseItem']"><van-collapse :model-value="'1'" accordion><van-collapse-item v-for="(item, index) in landing.faq.slice(0, 3)" :key="item.q" :title="item.q" :name="String(index + 1)" :disabled="index === 2">{{ item.a }}</van-collapse-item></van-collapse></DemoCard>
      </div>
    </section>

    <section class="demo-category">
      <h2>其他</h2>
      <div class="component-grid">
        <DemoCard name="ThemeProvider" vant="van-config-provider theme-vars（全局 theme 由 ?theme= 控制）" :also="['ConfigProvider']"><van-config-provider :theme-vars="{ primaryColor: 'var(--van-danger-color)', cellBackground: 'var(--van-gray-1)' }" class="nested-theme"><van-cell-group inset><van-cell title="局部变量覆盖" value="theme-vars" /><van-field label="字段" placeholder="输入" /></van-cell-group><van-button type="primary" size="small">按钮</van-button></van-config-provider><van-config-provider :theme-vars="{ primaryColor: 'var(--van-success-color)' }" class="mt"><van-button type="primary" size="small">theme-vars 主色</van-button></van-config-provider></DemoCard>
        <DemoCard name="Watermark" vant="van-watermark" :also="['Watermark']"><div class="watermark-box"><van-watermark content="Acme Console" :full-page="false" :opacity="0.3" /></div></DemoCard>
        <DemoCard name="Tour" vant="—" />
        <DemoCard name="FloatButton" vant="van-floating-bubble（局部固定）" :also="['FloatingBubble']"><div ref="bubbleStage" class="bubble-stage"><van-floating-bubble v-if="bubbleStage" axis="xy" icon="chat" :teleport="bubbleStage" :gap="12" :offset="{ x: 12, y: 96 }" /><p class="muted">可拖拽悬浮按钮，限定在此区域内演示。</p></div></DemoCard>
      </div>
    </section>

    <section class="demo-category">
      <h2>Vant 业务与其他导出组件</h2>
      <div class="component-grid">
        <DemoCard name="ActionBar" :contract="false" :also="['ActionBarButton', 'ActionBarIcon']"><van-action-bar class="inline-action-bar"><van-action-bar-icon icon="chat-o" text="客服" /><van-action-bar-icon icon="shop-o" text="店铺" /><van-action-bar-button type="warning" text="加入购物车" /><van-action-bar-button type="danger" text="立即购买" /></van-action-bar></DemoCard>
        <DemoCard name="ActionSheet" :contract="false"><van-button size="small" @click="showActionSheet = true">打开 ActionSheet</van-button></DemoCard>
        <DemoCard name="ShareSheet" :contract="false"><van-button size="small" @click="showShareSheet = true">打开 ShareSheet</van-button></DemoCard>
        <DemoCard name="AddressEdit" :contract="false"><van-address-edit :area-list="areaList" show-postal show-set-default /></DemoCard>
        <DemoCard name="AddressList" :contract="false"><van-address-list v-model="selected" :list="addresses" :disabled-list="[{ id: 'disabled', name: team[2].name, tel: '136****0000', address: '示例地址' }]" /></DemoCard>
        <DemoCard name="Area" :contract="false"><van-area :area-list="areaList" title="选择地区" /></DemoCard>
        <DemoCard name="Barrage" :contract="false"><van-barrage v-model:list="barrageList" :rows="2" :duration="8000" class="barrage-box"><div class="barrage-stage muted">{{ landing.hero.social }}</div></van-barrage></DemoCard>
        <DemoCard name="ContactCard" :contract="false"><van-contact-card type="add" add-text="添加联系人" /><van-contact-card type="edit" :tel="contacts[0].tel" :name="contacts[0].name" /></DemoCard>
        <DemoCard name="ContactList" :contract="false"><van-contact-list v-model="selected" :list="contacts" /></DemoCard>
        <DemoCard name="ContactEdit" :contract="false"><van-contact-edit is-edit :contact-info="contacts[0]" /></DemoCard>
        <DemoCard name="Coupon" :contract="false" :also="['CouponCell', 'CouponList']"><van-coupon-cell title="优惠券" :coupons="[couponDemo]" :chosen-coupon="0" /><van-coupon-cell title="未选择" :coupons="[couponDemo]" /><div class="coupon-box"><van-coupon-list :coupons="[couponDemo]" :disabled-coupons="[disabledCoupon]" :show-exchange-bar="false" :show-close-button="false" /></div></DemoCard>
        <DemoCard name="FloatingPanel" :contract="false"><van-button size="small" @click="showFloatingPanel = !showFloatingPanel">{{ showFloatingPanel ? "关闭" : "打开" }} FloatingPanel</van-button><div v-if="showFloatingPanel" class="floating-panel-box"><van-floating-panel :anchors="floatingAnchors"><div class="floating-panel-content"><p>{{ landing.hero.subtitle }}</p></div></van-floating-panel></div></DemoCard>
        <DemoCard name="Highlight" :contract="false"><van-highlight :keywords="['订单', 'AI 助手']" :source-string="landing.hero.subtitle" /></DemoCard>
        <DemoCard name="Icon" :contract="false"><van-space :size="12"><van-icon name="success" size="24" /><van-icon name="warning-o" size="24" /><van-icon name="fail" size="24" /><van-icon name="chat-o" size="24" badge="9" /><van-icon name="star" size="24" color="var(--van-warning-color)" /></van-space></DemoCard>
        <DemoCard name="Lazyload" :contract="false"><p class="muted">Lazyload 是指令/插件能力（app.use(Lazyload)），此处以 van-image lazy-load 演示。</p><van-image width="80" height="60" lazy-load :src="imageSources[1]" /></DemoCard>
        <DemoCard name="Locale" :contract="false"><p class="muted">Locale 为全局 i18n 配置能力（Locale.use），当前语言 zh-CN。</p><van-calendar :poppable="false" :show-confirm="false" :show-title="false" :show-subtitle="false" :style="{ height: '120px' }" /></DemoCard>
        <DemoCard name="PickerGroup" :contract="false"><van-picker-group title="预约时间" :tabs="['开始日期', '结束日期']"><van-date-picker /><van-date-picker /></van-picker-group></DemoCard>
        <DemoCard name="Signature" :contract="false"><van-signature tips="请签名" /></DemoCard>
        <DemoCard name="SubmitBar" :contract="false" class="submit-bar-box"><van-submit-bar :price="orders[0].amount * 100" button-text="提交订单" tip="你的收货地址不支持配送" tip-icon="info-o" /></DemoCard>
        <DemoCard name="SwipeCell" :contract="false"><van-swipe-cell><van-cell title="左滑显示操作" value="向左滑动" /><template #right><van-button square type="danger" text="删除" class="swipe-action" /></template></van-swipe-cell></DemoCard>
        <DemoCard name="TextEllipsis" :contract="false"><van-text-ellipsis :content="longText" rows="2" expand-text="展开" collapse-text="收起" /></DemoCard>
      </div>
    </section>

    <van-action-sheet v-model:show="showActionSheet" :actions="actionSheetActions" cancel-text="取消" close-on-click-action />
    <van-share-sheet v-model:show="showShareSheet" title="分享" :options="shareOptions" />
    <van-popup :show="drawerPosition !== null" :position="drawerPosition ?? 'left'" :style="drawerPosition === 'top' || drawerPosition === 'bottom' ? { height: '40%' } : { width: '70%', height: '100%' }" @click-overlay="drawerPosition = null"><van-nav-bar :title="`${drawerPosition ?? ''} Drawer`" right-text="关闭" @click-right="drawerPosition = null" /><van-cell v-for="item in nav.slice(0, 4)" :key="item.key" :title="item.label" /></van-popup>
    <van-overlay :show="showOverlay" @click="showOverlay = false"><div class="overlay-content">Overlay</div></van-overlay>
    <van-popup v-model:show="showFullscreen" position="right" :style="{ width: '100%', height: '100%' }"><van-nav-bar title="全屏 Dialog" left-arrow @click-left="showFullscreen = false" /><div class="fullscreen-body"><p>{{ landing.hero.subtitle }}</p><van-button type="primary" @click="showFullscreen = false">关闭</van-button></div></van-popup>
    <van-dialog v-model:show="showScrollDialog" title="可滚动 Dialog" show-cancel-button><div class="scroll-dialog"><p v-for="item in landing.faq" :key="item.q"><strong>{{ item.q }}</strong><br />{{ item.a }}</p></div></van-dialog>
    <van-popup v-model:show="pickerOpen" position="bottom" round><van-picker :columns="modelColumns" @confirm="confirmModel" @cancel="pickerOpen = false" /></van-popup>
    <van-popup v-model:show="showCommand" position="bottom" round><div class="command-palette"><van-search v-model="commandQuery" placeholder="搜索组件" /><van-cell v-for="name in commandResults" :key="name" :title="name" is-link @click="jumpTo(name)" /><van-empty v-if="commandResults.length === 0" image-size="56" description="无匹配组件" /></div></van-popup>
  </div>
</template>

<style scoped>
.components-page { min-width: 0; }
.component-index { display: grid; gap: 8px; }
.component-index-links { gap: 2px 6px; min-width: 0; }
.component-index-links a { display: inline-flex; align-items: center; justify-content: center; min-width: 40px; min-height: 40px; padding: 0 2px; }
.demo-category { margin-top: 28px; min-width: 0; }
.demo-category > h2 { margin: 0 0 12px; }
.span-2 { grid-column: span 2; }
.mt { margin-top: 12px; }
.row-label { margin: 12px 0 6px; font-size: 12px; color: var(--van-text-color-2); }
.row-label:first-child { margin-top: 0; }
.button-matrix { display: flex; flex-wrap: wrap; gap: 8px; }
.button-matrix + .button-matrix { margin-top: 8px; }
.align-end { align-items: flex-end; }
.inline-action-bar { position: static; margin-top: 12px; }
.t-h1 { font-size: 32px; margin: 0 0 6px; } .t-h2 { font-size: 26px; margin: 0 0 6px; } .t-h3 { font-size: 22px; margin: 0 0 6px; } .t-h4 { font-size: 18px; margin: 0 0 6px; } .t-h5 { font-size: 16px; margin: 0 0 6px; } .t-h6 { font-size: 14px; margin: 0 0 6px; }
.quote { margin: 8px 0; padding: 4px 12px; border-left: 3px solid var(--van-primary-color); color: var(--van-text-color-2); }
.list { margin: 0; padding-left: 20px; }
pre.code-demo { margin: 0 0 8px; overflow: auto; padding: 12px; border-radius: 6px; background: var(--van-background); }
.inline-code { padding: 2px 6px; border-radius: 4px; background: var(--van-background); }
.inline-picker :deep(.van-picker__toolbar) { display: none; }
.menu-checks { padding: 12px; display: grid; gap: 8px; }
.inline-field { flex: 1; padding: 0 12px; border: 1px solid var(--van-border-color); border-radius: var(--van-radius-md); }
.upload-drop { margin-top: 12px; padding: 18px; border: 1px dashed var(--van-border-color); color: var(--van-text-color-2); text-align: center; }
.keyboard-box { position: relative; min-height: 220px; margin-top: 12px; overflow: hidden; }
.keyboard-box :deep(.van-number-keyboard) { position: static; }
.mini-table { display: grid; grid-template-columns: 1fr 1fr auto auto; gap: 1px; min-width: 320px; background: var(--van-border-color); }
.mini-table > div { min-width: 0; padding: 8px; background: var(--van-background-2); }
.mini-table .mini-head { font-size: 12px; color: var(--van-text-color-2); }
.mini-table .amount { text-align: right; }
.thumb-placeholder, .grid-cell, .swipe-box { display: grid; place-items: center; min-height: 56px; height: 100%; background: var(--van-background); color: var(--van-text-color-2); }
.swipe-0 { background: var(--van-primary-color); color: #fff; } .swipe-1 { background: var(--van-success-color); color: #fff; } .swipe-2 { background: var(--van-warning-color); color: #fff; }
.avatar-fallback { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: var(--van-primary-color-light, var(--van-blue-light)); color: var(--van-primary-color); }
.avatar-fallback.small { width: 36px; height: 36px; font-size: 12px; }
.avatar-group { display: flex; align-items: center; }
.avatar-group > * { margin-right: -8px; border: 2px solid var(--van-background-2); border-radius: 50%; }
.badge-box { width: 40px; height: 40px; border-radius: 4px; background: var(--van-gray-3); }
.stat-row { display: flex; gap: 24px; flex-wrap: wrap; }
.stat { display: grid; gap: 4px; }
.stat-number { --van-rolling-text-font-size: 24px; --van-rolling-text-item-width: 16px; font-weight: 600; }
.step-time { margin: 2px 0 0; font-size: 12px; }
.tooltip-text { display: block; padding: 8px 12px; font-size: 13px; }
.segment-body { margin: 12px 0 0; color: var(--van-text-color); }
.notify-static { display: flex; align-items: center; gap: 6px; padding: 10px 16px; font-size: 14px; color: var(--van-notify-text-color, #fff); }
.notify-static--success { background: var(--van-success-color); }
.popup-stage { position: relative; height: 220px; overflow: hidden; border: 1px solid var(--van-border-color); border-radius: var(--van-radius-md); background: var(--van-background); transform: translateZ(0); }
.popup-stage :deep(.van-popup), .popup-stage :deep(.van-overlay) { position: absolute; }
.popup-stage :deep(.van-dialog) { width: min(280px, 85%); }
.popover-actions { display: flex; align-items: center; gap: 8px; padding: 8px 12px; font-size: 13px; }
.menu-row { display: grid; grid-template-columns: 90px minmax(0, 1fr); gap: 12px; }
.menu-collapse { min-width: 0; }
.breadcrumb { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.breadcrumb a { display: inline-flex; align-items: center; min-height: 40px; padding: 0 6px; }
.index-box { position: relative; height: 220px; overflow: auto; border: 1px solid var(--van-border-color); }
.index-box :deep(.van-index-bar__sidebar) { position: absolute; }
.sticky-box { position: relative; height: 140px; overflow: auto; }
.sticky-box p { margin: 60px 0 120px; }
.layout-box { display: grid; grid-template-rows: auto 1fr auto; min-height: 180px; border: 1px solid var(--van-border-color); border-radius: var(--van-radius-md); overflow: hidden; }
.layout-box main { display: grid; place-items: center; color: var(--van-text-color-2); background: var(--van-background); }
.container-box { padding: 12px; background: var(--van-background); }
.container-inner { max-width: 320px; margin: 0 auto; padding: 16px; text-align: center; border: 1px dashed var(--van-border-color); }
.scroll-box { height: 200px; overflow: auto; border: 1px solid var(--van-border-color); }
.nested-theme { padding: 12px 0; border-radius: var(--van-radius-md); background: var(--van-background); }
.nested-theme .van-button { margin: 12px 16px 0; }
.watermark-box { position: relative; height: 120px; overflow: hidden; background: var(--van-background); }
.bubble-stage { position: relative; height: 160px; overflow: hidden; border: 1px dashed var(--van-border-color); border-radius: var(--van-radius-md); transform: translateZ(0); }
.bubble-stage { position: relative; overflow: hidden; }
.bubble-stage :deep(.van-floating-bubble) { position: absolute; }
.bubble-stage p { margin: 12px; }
.barrage-box { background: var(--van-background); }
.barrage-stage { display: grid; place-items: center; height: 96px; }
.coupon-box { height: 260px; margin-top: 12px; overflow: hidden; }
.coupon-box :deep(.van-coupon-list) { height: 100%; }
.floating-panel-box { position: relative; height: 240px; overflow: hidden; margin-top: 12px; border: 1px solid var(--van-border-color); }
.floating-panel-content { padding: 16px; }
.submit-bar-box { position: relative; }
.submit-bar-box :deep(.van-submit-bar) { position: static; }
.swipe-action { height: 100%; }
.overlay-content { display: grid; place-items: center; height: 100%; color: var(--van-white); font-size: 24px; }
.fullscreen-body { display: grid; gap: 16px; padding: 24px; }
.scroll-dialog { max-height: 260px; overflow: auto; padding: 0 20px 12px; }
.command-palette { padding: 12px; min-height: 320px; }
.vertical-slider { height: 100px; margin: 16px auto; }
@media (max-width: 767px) {
  .span-2 { grid-column: auto; }
  .menu-row { grid-template-columns: 1fr; }
}
</style>
