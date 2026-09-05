<script setup lang="ts">
import { computed, ref } from "vue"
import contract from "@ui-gallery/spec/contract.json"
import chat from "@ui-gallery/spec/mock/chat.json"
import landing from "@ui-gallery/spec/mock/landing.json"
import team from "@ui-gallery/spec/mock/team.json"
import { showImagePreview, showNotify, showToast } from "vant"
import AppIcon from "@/components/AppIcon.vue"
import { coverage } from "@/coverage"

const componentNames = contract.components
const activeTab = ref(0)
const checked = ref(true)
const radio = ref("a")
const switchValue = ref(true)
const slider = ref(45)
const range = ref<[number, number]>([20, 70])
const rate = ref(4)
const selected = ref("a")
const showActionSheet = ref(false)
const showShareSheet = ref(false)
const showPopup = ref(false)
const showOverlay = ref(false)
const showDialog = ref(false)
const showFloatingPanel = ref(false)
const showCommand = ref(false)
const stickyContainer = ref<HTMLElement | null>(null)
const missing = new Set(
  Object.entries(coverage)
    .filter(([, status]) => status === "missing")
    .map(([name]) => name),
)

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

const statusType = (name: string) =>
  name === "missing" ? "danger" : name === "composed" ? "warning" : "success"
const contractStatus = (name: string) =>
  missing.has(name) ? "missing" : coverage[name] ?? "implemented"

const areaList = {
  province_list: { "110000": "省A", "120000": "省B" },
  city_list: { "110100": "市A", "120100": "市B" },
  county_list: { "110101": "区A", "120101": "区B" },
}
const addresses = [
  { id: "address-1", name: team[0].name, tel: "138****0000", address: "省A市A区A 示例地址" },
  { id: "address-2", name: team[1].name, tel: "139****0000", address: "省B市B区B 示例地址" },
]
const contacts = team.slice(0, 2).map((member, index) => ({
  id: `contact-${index}`,
  name: member.name,
  tel: `138****000${index}`,
}))
const couponDemo = {
  id: "coupon-1",
  name: "演示优惠券",
  condition: "满 ¥100 可用",
  description: "演示优惠券",
  value: 2000,
  valueDesc: "20",
  unitDesc: "元",
  startAt: Math.floor(Date.now() / 1000),
  endAt: Math.floor(Date.now() / 1000) + 86400,
  reason: "",
}
const disabledCoupon = { ...couponDemo, id: "coupon-disabled", name: "暂不可用优惠券" }
const imageSources = [
  `data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='240' height='160'><rect width='240' height='160' fill='#1989fa'/><text x='120' y='88' fill='white' text-anchor='middle'>Demo A</text></svg>")}`,
  `data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='240' height='160'><rect width='240' height='160' fill='#07c160'/><text x='120' y='88' fill='white' text-anchor='middle'>Demo B</text></svg>")}`,
]
const longText = landing.testimonials[0].quote + " " + landing.hero.subtitle + " 这是一段用于演示省略和展开交互的较长文本。"
const highlightSource = landing.hero.subtitle
const circleRate = ref(65)
const circleRate2 = ref(72)
const nestedDarkThemeVars = {
  background: "#000",
  background2: "#1c1c1e",
  textColor: "#f5f5f5",
  textColor2: "#707070",
  borderColor: "#3a3a3c",
}
const floatingAnchors = [100, 200]
const tooltipShown = ref(true)
const barrageList = ref(chat.conversations.slice(0, 4).map((item, index) => ({ id: index, text: item.title })))
const actionSheetActions = [{ name: "选项一" }, { name: "选项二" }, { name: "选项三" }]
const shareOptions = [
  { name: "微信", icon: "wechat" },
  { name: "微博", icon: "weibo" },
  { name: "复制链接", icon: "link" },
  { name: "邮件", icon: "envelop-o" },
]
const selectedValues = computed(() => [selected.value])
const previewImages = () => showImagePreview(imageSources)
</script>

<template>
  <div class="page components-page">
    <div class="page-title">
      <div><h1>组件全集</h1><p>Vant 组件与 contract 覆盖演示</p></div>
      <van-button type="primary" @click="showCommand = true">
        <template #icon><AppIcon name="search" /></template>组件搜索
      </van-button>
    </div>

    <div class="card component-index">
      <strong>Vant 导出</strong>
      <div class="inline component-index-links">
        <a v-for="name in vantExports" :key="`vant-${name}`" :href="`#vant-${name}`"><van-tag type="primary">{{ name }}</van-tag></a>
      </div>
      <strong>Contract 覆盖</strong>
      <div class="inline component-index-links">
        <a v-for="name in componentNames" :key="name" :href="`#${name}`"><van-tag :type="statusType(contractStatus(name))">{{ name }}</van-tag></a>
      </div>
      <div class="anchor-targets" aria-hidden="true">
        <span v-for="name in componentNames" :id="name" :key="`contract-${name}`" />
      </div>
    </div>

    <section id="category-typography" class="demo-category">
      <h2>排版</h2>
      <div class="component-grid">
        <article id="Typography" class="card component-demo"><h3>Typography</h3><h1>标题一</h1><h3>标题三</h3><p class="muted">正文与辅助文字</p><van-divider content-position="left">Divider</van-divider></article>
        <article id="Code" class="card component-demo"><h3>Code</h3><pre class="code-demo">const console = "Acme"</pre></article>
        <article id="Kbd" class="card component-demo"><h3>Kbd</h3><van-tag mark>⌘ K</van-tag><span class="muted"> 快捷键</span></article>
      </div>
    </section>

    <section id="category-buttons" class="demo-category">
      <h2>按钮</h2>
      <div class="component-grid">
        <article id="vant-Button" class="card component-demo">
          <span id="Button" class="anchor-target" />
          <h3>Button</h3>
          <div class="button-matrix">
            <van-button v-for="type in ['primary', 'success', 'warning', 'danger', 'default']" :key="type" :type="type as 'primary'" size="large">大按钮</van-button>
            <van-button v-for="size in ['normal', 'small', 'mini']" :key="size" type="primary" :size="size as 'normal'">尺寸</van-button>
            <van-button plain type="primary">plain</van-button><van-button hairline type="primary">hairline</van-button><van-button round type="primary">round</van-button><van-button square type="primary" icon="plus" />
            <van-button icon="plus" type="primary" /><van-button type="primary" loading loading-text="加载中" /><van-button disabled>disabled</van-button><van-button block type="primary">block</van-button>
            <van-button type="primary"><template #icon><AppIcon name="plus" /></template>AppIcon</van-button>
          </div>
        </article>
        <article id="ButtonGroup" class="card component-demo">
          <h3>ButtonGroup / ActionBar</h3>
          <van-space wrap><van-button type="primary">确认</van-button><van-button>取消</van-button></van-space>
          <van-action-bar class="inline-action-bar"><van-action-bar-icon icon="chat-o" text="客服" /><van-action-bar-button type="warning" text="加入购物车" /><van-action-bar-button type="danger" text="立即购买" /></van-action-bar>
        </article>
      </div>
    </section>

    <section id="category-form" class="demo-category">
      <h2>表单控件</h2>
      <div class="component-grid">
        <article id="Form" class="card component-demo">
          <h3>Field / Form</h3>
          <van-cell-group inset>
            <van-field label="姓名" placeholder="请输入姓名" clearable required />
            <van-field label="邮箱" placeholder="邮箱" left-icon="envelop-o" />
            <van-field label="密码" type="password" right-icon="eye-o" />
            <van-field label="搜索" readonly error error-message="示例错误" />
            <van-field label="描述" type="textarea" autosize maxlength="80" show-word-limit />
            <van-field label="数字" type="digit" />
          </van-cell-group>
          <van-stepper theme="round" button-size="28" />
          <van-stepper disabled />
        </article>
        <article id="Checkbox" class="card component-demo">
          <h3>Checkbox / CheckboxGroup</h3>
          <van-checkbox v-model="checked">已选</van-checkbox><van-checkbox shape="square">方形</van-checkbox><van-checkbox disabled>禁用</van-checkbox>
          <van-checkbox-group v-model="selectedValues" max="2"><van-checkbox name="a">选项 A</van-checkbox><van-checkbox name="b">选项 B</van-checkbox><van-checkbox name="c">选项 C</van-checkbox></van-checkbox-group>
        </article>
        <article id="Radio" class="card component-demo">
          <h3>Radio / RadioGroup</h3>
          <van-radio-group v-model="radio"><van-radio name="a">水平 A</van-radio><van-radio name="b">水平 B</van-radio><van-radio name="c" disabled>禁用</van-radio></van-radio-group>
        </article>
        <article id="Switch" class="card component-demo"><h3>Switch</h3><van-switch v-model="switchValue" /><van-switch size="18px" loading /><van-switch disabled /></article>
        <article id="Slider" class="card component-demo"><h3>Slider</h3><van-slider v-model="slider" step="5" /><van-slider v-model="range" range /><van-slider vertical :model-value="40" disabled class="vertical-slider" /></article>
        <article id="Rate" class="card component-demo"><h3>Rate</h3><van-rate v-model="rate" allow-half /><van-rate :model-value="3" readonly /><van-rate :model-value="2" :count="7" disabled /></article>
        <article id="Picker" class="card component-demo"><h3>Select / MultiSelect / Combobox / Autocomplete</h3><van-picker :columns="[{ text: '选项 A', value: 'a' }, { text: '选项 B', value: 'b' }]" /><van-checkbox-group><van-checkbox name="one">多选 A</van-checkbox><van-checkbox name="two">多选 B</van-checkbox></van-checkbox-group><van-search placeholder="输入以筛选建议" /></article>
        <article id="DatePicker" class="card component-demo"><h3>DatePicker / TimePicker / Calendar</h3><van-date-picker /><van-time-picker /><van-calendar :poppable="false" :show-confirm="false" :style="{ height: '480px' }" /></article>
        <article id="ColorPicker" class="card component-demo"><h3>ColorPicker</h3><van-field label="missing fallback"><template #input><input type="color" value="#1989fa" aria-label="color" /></template></van-field></article>
        <article id="Upload" class="card component-demo"><h3>Uploader</h3><van-uploader multiple preview-size="60" :max-count="3"><template #preview-cover="{ file }"><span>{{ file.name || "文件" }}</span></template></van-uploader><div class="upload-drop">拖拽文件到这里</div></article>
        <article id="Cascader" class="card component-demo"><h3>Cascader</h3><van-cascader :options="[{ text: '省A', value: 'a', children: [{ text: '市A', value: 'aa' }] }, { text: '省B', value: 'b', children: [{ text: '市B', value: 'bb' }] }]" /></article>
        <article id="PinInput" class="card component-demo"><h3>PasswordInput / NumberKeyboard</h3><van-password-input :value="'1234'" :gutter="8" /><div class="keyboard-box"><van-number-keyboard :show="true" /></div></article>
      </div>
    </section>

    <section id="category-data" class="demo-category">
      <h2>数据展示</h2>
      <div class="component-grid">
        <article id="Table" class="card component-demo"><h3>Table / Descriptions</h3><div class="data-table"><div>名称</div><div>状态</div><div>金额</div><div>项目 A</div><div><van-tag type="success">完成</van-tag></div><div>¥120</div><div>项目 B</div><div><van-tag type="warning">处理中</van-tag></div><div>¥80</div><div>项目 C</div><div><van-tag>草稿</van-tag></div><div>¥50</div></div><van-cell-group inset><van-cell title="描述" value="组合的 cell-group" /><van-cell title="负责人" value="团队成员" /></van-cell-group></article>
        <article id="List" class="card component-demo"><h3>List / Card</h3><van-list><van-cell title="列表项一" value="详情" /><van-cell title="列表项二" value="详情" /><van-cell title="列表项三" value="详情" /></van-list><van-card num="2" price="10.00" desc="示例描述" title="示例商品" tag="标签"><template #thumb><div class="thumb-placeholder">图片</div></template></van-card></article>
        <article id="Avatar" class="card component-demo"><h3>Avatar / AvatarGroup / Badge</h3><div class="avatar-group"><van-image v-for="member in team.slice(0, 3)" :key="member.email" round width="40" height="40" :src="`data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><circle cx='20' cy='20' r='20' fill='#1989fa'/><text x='20' y='25' text-anchor='middle' fill='white'>${member.name.slice(0, 1)}</text></svg>`)}`" /></div><van-badge content="5" /><van-badge dot /><van-badge content="99+" max="9" color="#07c160" /></article>
        <article id="Tag" class="card component-demo"><h3>Tag</h3><van-space wrap><van-tag v-for="type in ['primary', 'success', 'warning', 'danger']" :key="type" :type="type as 'primary'">{{ type }}</van-tag><van-tag plain round type="primary">plain round</van-tag><van-tag mark type="success">mark</van-tag><van-tag closeable>关闭</van-tag></van-space></article>
        <article id="Statistic" class="card component-demo"><h3>Statistic / CountDown / RollingText</h3><van-rolling-text :start-num="100" :target-num="128430" /><van-count-down time="3600000" format="HH:mm:ss" /></article>
        <article id="Timeline" class="card component-demo"><h3>Timeline / Steps</h3><van-steps direction="vertical" :active="2"><van-step>创建订单</van-step><van-step>审核通过</van-step><van-step>完成支付</van-step></van-steps></article>
        <article id="Tree" class="card component-demo"><h3>TreeSelect</h3><van-tree-select :items="[{ text: '分类一', children: [{ text: '项目一', id: 'one' }, { text: '项目二', id: 'two' }] }]" /></article>
        <article id="Image" class="card component-demo"><h3>Image / ImagePreview</h3><div class="inline"><van-image width="80" height="80" fit="cover" round loading="lazy" error-icon="photo-fail" :src="imageSources[0]" /><van-button size="small" @click="previewImages">预览</van-button></div></article>
        <article id="Carousel" class="card component-demo"><h3>Swipe</h3><van-swipe autoplay="2500" vertical indicator-color="white" :style="{ height: '100px' }"><van-swipe-item v-for="n in 3" :key="n"><div class="swipe-box">第 {{ n }} 页</div></van-swipe-item></van-swipe></article>
        <article id="Empty" class="card component-demo"><h3>Empty</h3><van-empty image="search" description="暂无内容"><van-button type="primary" size="small">刷新</van-button></van-empty></article>
        <article id="Tooltip" class="card component-demo"><h3>Tooltip / Popover</h3><div class="inline"><van-popover theme="dark" :actions="[{ text: '操作一' }, { text: '操作二' }]"><template #reference><van-button>打开 Popover</van-button></template></van-popover><van-popover v-model:show="tooltipShown" theme="dark" placement="right"><span class="tooltip-text">{{ landing.hero.social }}</span><template #reference><van-button plain>悬浮提示</van-button></template></van-popover></div></article>
        <article id="Segmented" class="card component-demo"><h3>Segmented</h3><van-tabs v-model:active="activeTab" type="card"><van-tab title="日"><p class="segment-body">{{ landing.hero.subtitle }}</p></van-tab><van-tab title="周"><p class="segment-body">{{ landing.testimonials[0].quote }}</p></van-tab><van-tab title="月"><p class="segment-body">{{ landing.hero.social }}</p></van-tab></van-tabs></article>
        <article id="Circle" class="card component-demo"><h3>Circle / Progress</h3><div class="inline"><van-circle v-model:current-rate="circleRate" :rate="65" :speed="100" text="65%" /><van-progress :percentage="65" pivot-text="65%" stroke-width="8" /></div><van-progress :percentage="65" inactive striped /></article>
        <article id="Skeleton" class="card component-demo"><h3>Skeleton</h3><van-skeleton title avatar :row="3" animate /><van-skeleton-title /><van-skeleton-avatar /><van-skeleton-paragraph /><van-skeleton-image /></article>
        <article id="Loading" class="card component-demo"><h3>Loading</h3><div class="inline"><van-loading /><van-loading type="spinner" size="24" /><van-loading vertical>加载中</van-loading></div></article>
        <article id="TextEllipsis" class="card component-demo"><h3>TextEllipsis</h3><van-text-ellipsis :content="longText" rows="2" expand-text="展开" collapse-text="收起" /></article>
        <article id="Highlight" class="card component-demo"><h3>Highlight</h3><van-highlight :keywords="['订单', 'AI 助手']" :source-string="highlightSource" /></article>
      </div>
    </section>

    <section id="category-feedback" class="demo-category">
      <h2>反馈</h2>
      <div class="component-grid">
        <article id="NoticeBar" class="card component-demo"><h3>NoticeBar</h3><van-notice-bar text="默认提示信息" /><van-notice-bar type="warning" text="注意信息" /><van-notice-bar type="danger" text="错误信息" /></article>
        <article id="Toast" class="card component-demo"><h3>Toast / Notify</h3><van-space wrap><van-button @click="showToast('文本')">文本</van-button><van-button @click="showToast({ type: 'success', message: '成功' })">成功</van-button><van-button @click="showToast({ type: 'fail', message: '失败' })">失败</van-button><van-button @click="showNotify({ type: 'success', message: '通知' })">通知</van-button></van-space></article>
        <article id="Dialog" class="card component-demo"><h3>Dialog / Popup / Overlay</h3><van-space wrap><van-button @click="showDialog = true">打开 Dialog</van-button><van-button @click="showPopup = true">Popup</van-button><van-button @click="showOverlay = true">Overlay</van-button></van-space></article>
        <article id="ActionSheet" class="card component-demo"><h3>ActionSheet / ShareSheet</h3><van-space wrap><van-button @click="showActionSheet = true">ActionSheet</van-button><van-button @click="showShareSheet = true">ShareSheet</van-button></van-space></article>
        <article id="Result" class="card component-demo"><h3>Result / Popconfirm</h3><van-empty description="操作成功"><template #bottom><van-button type="primary">继续</van-button></template></van-empty><van-popover><template #reference><van-button>Popconfirm</van-button></template><div class="popover-actions"><van-button size="small">取消</van-button><van-button size="small" type="primary">确认</van-button></div></van-popover></article>
      </div>
    </section>

    <section id="category-navigation" class="demo-category">
      <h2>导航</h2>
      <div class="component-grid">
        <article id="Navbar" class="card component-demo"><h3>NavBar</h3><van-nav-bar title="导航栏" left-text="返回" right-text="按钮" left-arrow /></article>
        <article id="Sidebar" class="card component-demo"><h3>Sidebar / Tabbar</h3><van-sidebar :model-value="0"><van-sidebar-item title="项目一" badge="12" /><van-sidebar-item title="项目二" disabled /></van-sidebar><van-tabbar :model-value="0" :fixed="false"><van-tabbar-item icon="home-o" dot>首页</van-tabbar-item><van-tabbar-item icon="setting-o" badge="3">设置</van-tabbar-item></van-tabbar></article>
        <article id="Tabs" class="card component-demo"><h3>Tabs</h3><span id="vant-Tab" class="anchor-target" /><van-tabs type="line" swipeable shrink><van-tab title="标签一">内容一</van-tab><van-tab title="标签二">内容二</van-tab><van-tab title="标签三">内容三</van-tab></van-tabs></article>
        <article id="Dropdown" class="card component-demo"><h3>DropdownMenu / Pagination</h3><span id="vant-DropdownItem" class="anchor-target" /><van-dropdown-menu><van-dropdown-item title="排序" :options="[{ text: '默认', value: 0 }, { text: '销量', value: 1 }]" /></van-dropdown-menu><van-pagination :model-value="1" :page-count="3" mode="simple" /></article>
        <article id="Steps" class="card component-demo"><h3>Steps</h3><span id="vant-Step" class="anchor-target" /><van-steps :active="1"><van-step>步骤一</van-step><van-step>步骤二</van-step><van-step>步骤三</van-step></van-steps></article>
        <article id="Anchor" class="card component-demo"><h3>IndexBar / Anchor</h3><span id="vant-IndexAnchor" class="anchor-target" /><div class="index-box"><van-index-bar><van-index-anchor index="A" /><van-cell title="Anchor" /><van-index-anchor index="B" /><van-cell title="BackTop" /></van-index-bar></div></article>
        <article id="BackTop" class="card component-demo"><h3>BackTop / Sticky</h3><van-sticky ref="stickyContainer" :container="stickyContainer ?? undefined" :offset-top="10"><van-button size="small">Sticky</van-button></van-sticky><van-back-top :offset="240" /></article>
        <article id="Breadcrumb" class="card component-demo"><h3>Breadcrumb / Menu</h3><div class="breadcrumb"><a href="#vant-Button">首页</a><AppIcon name="chevron-right" /><a href="#Form">表单</a></div><van-collapse><van-collapse-item title="Menu composed" name="menu"><van-tree-select :items="[{ text: '菜单', children: [{ text: '项目', id: 'menu-item' }] }]" /></van-collapse-item></van-collapse></article>
        <article id="CommandPalette" class="card component-demo"><h3>CommandPalette</h3><van-button @click="showCommand = true">打开命令面板</van-button></article>
      </div>
    </section>

    <section id="category-layout" class="demo-category">
      <h2>布局</h2>
      <div class="component-grid">
        <article id="Grid" class="card component-demo"><h3>Row / Col / Grid</h3><span id="vant-Row" class="anchor-target" /><span id="vant-Col" class="anchor-target" /><span id="vant-GridItem" class="anchor-target" /><van-row gutter="8"><van-col span="8"><div class="grid-cell">8</div></van-col><van-col span="8"><div class="grid-cell">8</div></van-col><van-col span="8"><div class="grid-cell">8</div></van-col><van-col span="18" offset="6"><div class="grid-cell">18 offset 6</div></van-col></van-row><van-grid :column-num="4" square border><van-grid-item text="一" /><van-grid-item text="二" /><van-grid-item text="三" /><van-grid-item text="四" /></van-grid></article>
        <article id="Stack" class="card component-demo"><h3>Space</h3><van-space direction="vertical" fill><van-button block>垂直</van-button><van-button block>间距</van-button></van-space></article>
        <article id="Divider" class="card component-demo"><h3>Divider</h3><van-divider content-position="left">左</van-divider><van-divider dashed>虚线</van-divider><van-divider content-position="right">右</van-divider></article>
        <article id="Accordion" class="card component-demo"><h3>Collapse</h3><span id="vant-CollapseItem" class="anchor-target" /><van-collapse accordion><van-collapse-item title="面板一" name="1">内容一</van-collapse-item><van-collapse-item title="面板二" name="2" disabled>内容二</van-collapse-item></van-collapse></article>
        <article id="Layout" class="card component-demo"><h3>Layout / Container / ScrollArea</h3><div class="layout-box"><header>Header</header><main>Container 内容</main><footer>Footer</footer></div><div class="scroll-box"><van-pull-refresh :model-value="false"><van-cell title="ScrollArea" /><van-cell title="PullRefresh" /></van-pull-refresh></div></article>
        <article id="AspectRatio" class="card component-demo"><h3>AspectRatio / Resizable</h3><div class="missing-box">contract missing fallback</div></article>
      </div>
    </section>

    <section id="category-business" class="demo-category">
      <h2>业务组件</h2>
      <div class="component-grid">
        <section id="vant-ActionBar" class="card component-demo"><h3>ActionBar</h3><span id="vant-ActionBarButton" class="anchor-target" /><span id="vant-ActionBarIcon" class="anchor-target" /><van-action-bar><van-action-bar-icon icon="chat-o" text="客服" /><van-action-bar-button text="购买" /></van-action-bar></section>
        <section id="vant-ActionSheet" class="card component-demo"><h3>ActionSheet</h3><van-button @click="showActionSheet = true">打开 ActionSheet</van-button></section>
        <section id="vant-AddressEdit" class="card component-demo"><h3>AddressEdit</h3><van-address-edit :area-list="areaList" show-postal show-set-default /></section>
        <section id="vant-AddressList" class="card component-demo"><h3>AddressList</h3><van-address-list v-model="selected" :list="addresses" :disabled-list="[{ id: 'disabled', name: team[2].name, tel: '136****0000', address: '示例地址' }]" /></section>
        <section id="vant-Area" class="card component-demo"><h3>Area</h3><van-area :area-list="areaList" :columns-placeholder="['省', '市', '区']" /></section>
        <section id="vant-Barrage" class="card component-demo"><h3>Barrage</h3><van-barrage v-model:list="barrageList" :rows="2" :duration="8000" class="barrage-box"><div class="barrage-stage muted">{{ landing.hero.social }}</div></van-barrage></section>
        <section id="vant-ContactCard" class="card component-demo"><h3>ContactCard</h3><van-contact-card type="add" add-text="添加联系人" /><van-contact-card type="edit" :tel="contacts[0].tel" :name="contacts[0].name" /></section>
        <section id="vant-ContactList" class="card component-demo"><h3>ContactList</h3><van-contact-list v-model="selected" :list="contacts" /></section>
        <section id="vant-ContactEdit" class="card component-demo"><h3>ContactEdit</h3><van-contact-edit is-edit :contact-info="contacts[0]" /></section>
        <section id="vant-CountDown" class="card component-demo"><h3>CountDown</h3><van-count-down time="3600000" format="DD 天 HH 时 mm 分 ss 秒" /></section>
        <section id="vant-Coupon" class="card component-demo"><h3>Coupon</h3><span id="vant-CouponCell" class="anchor-target" /><span id="vant-CouponList" class="anchor-target" /><van-coupon-cell title="优惠券" :coupons="[couponDemo]" :chosen-coupon="0" /><van-coupon-cell title="未选择" :coupons="[couponDemo]" /><van-coupon-list :coupons="[couponDemo]" :disabled-coupons="[disabledCoupon]" :show-exchange-bar="false" /></section>
        <section id="vant-FloatingPanel" class="card component-demo"><h3>FloatingPanel</h3><van-button @click="showFloatingPanel = true">打开 FloatingPanel</van-button><div v-if="showFloatingPanel" class="floating-panel-box"><van-floating-panel :anchors="floatingAnchors"><div class="floating-panel-content"><van-button size="small" @click="showFloatingPanel = false">关闭</van-button><p>浮层内容</p></div></van-floating-panel></div></section>
        <section id="vant-Highlight" class="card component-demo"><h3>Highlight</h3><van-highlight :keywords="['订单', 'AI 助手']" :source-string="highlightSource" /></section>
        <section id="vant-ImagePreview" class="card component-demo"><h3>ImagePreview</h3><van-button @click="previewImages">打开 ImagePreview</van-button></section>
        <section id="vant-NumberKeyboard" class="card component-demo"><h3>NumberKeyboard</h3><div class="keyboard-box"><van-number-keyboard :show="true" /></div></section>
        <section id="vant-PickerGroup" class="card component-demo"><h3>PickerGroup</h3><van-picker-group :tabs="['开始日期', '结束日期']"><van-date-picker /><van-date-picker /></van-picker-group></section>
        <section id="vant-ShareSheet" class="card component-demo"><h3>ShareSheet</h3><van-button @click="showShareSheet = true">打开 ShareSheet</van-button></section>
        <section id="vant-Signature" class="card component-demo"><h3>Signature</h3><van-signature tips="请签名" /></section>
        <section id="vant-SubmitBar" class="card component-demo submit-bar-box"><h3>SubmitBar</h3><van-submit-bar :price="3050" button-text="提交订单" /></section>
        <section id="vant-SwipeCell" class="card component-demo"><h3>SwipeCell</h3><van-swipe-cell><van-cell title="滑动操作" value="向左滑动" /><template #right><van-button square type="danger" text="删除" /></template></van-swipe-cell></section>
        <section id="vant-TextEllipsis" class="card component-demo"><h3>TextEllipsis</h3><van-text-ellipsis :content="longText" rows="2" expand-text="展开" collapse-text="收起" /></section>
        <section id="vant-Watermark" class="card component-demo"><h3>Watermark</h3><div class="watermark-box"><van-watermark content="Acme Console" :full-page="false" /></div></section>
        <section id="vant-Lazyload" class="card component-demo"><h3>Lazyload</h3><p class="muted">Lazyload 是插件能力，实际项目中通过 app.use(Lazyload) 配置。</p></section>
        <section id="vant-Locale" class="card component-demo"><h3>Locale</h3><p class="muted">Locale 是全局 i18n 配置能力，页面保留说明卡片。</p></section>
      </div>
    </section>

    <section id="category-other" class="demo-category">
      <h2>其他</h2>
      <div class="component-grid">
        <article id="ThemeProvider" class="card component-demo"><span id="vant-ConfigProvider" class="anchor-target" /><h3>ConfigProvider</h3><van-config-provider :theme-vars="nestedDarkThemeVars"><div class="nested-dark"><van-button type="primary">Dark Button</van-button><van-field label="Dark Field" /><van-cell title="Dark Cell" /></div></van-config-provider><van-config-provider :theme-vars="{ primaryColor: '#07c160' }"><van-button type="primary">主题变量</van-button></van-config-provider></article>
        <article id="FloatButton" class="card component-demo"><span id="vant-FloatingBubble" class="anchor-target" /><h3>FloatingBubble</h3><van-floating-bubble axis="xy" icon="plus" /></article>
        <article id="vant-Form" class="card component-demo"><h3>Form</h3><van-form><van-field label="表单字段" placeholder="示例" /><van-button block type="primary">提交</van-button></van-form></article>
        <article id="vant-Icon" class="card component-demo"><h3>Icon</h3><van-icon name="success" size="28" /><van-icon name="warning-o" size="28" /><van-icon name="fail" size="28" /></article>
        <article id="vant-List" class="card component-demo"><h3>List</h3><van-list><van-cell title="显式 List demo" /></van-list></article>
        <article id="vant-NavBar" class="card component-demo"><h3>NavBar</h3><van-nav-bar title="业务导航" left-arrow /></article>
        <article id="vant-PullRefresh" class="card component-demo"><h3>PullRefresh</h3><van-pull-refresh :model-value="false"><van-cell title="下拉刷新区域" /></van-pull-refresh></article>
        <article id="vant-Search" class="card component-demo"><h3>Search</h3><van-search placeholder="搜索组件" /></article>
        <article id="vant-Slider" class="card component-demo"><h3>Slider</h3><van-slider :model-value="slider" /></article>
        <article id="vant-Stepper" class="card component-demo"><h3>Stepper</h3><van-stepper /></article>
        <article id="vant-Switch" class="card component-demo"><h3>Switch</h3><van-switch v-model="switchValue" /></article>
        <article id="vant-Tag" class="card component-demo"><h3>Tag</h3><van-tag type="primary">显式 Tag</van-tag></article>
        <article id="vant-TreeSelect" class="card component-demo"><h3>TreeSelect</h3><van-tree-select :items="[{ text: '节点', children: [{ text: '子节点', id: 'child' }] }]" /></article>
        <article id="vant-Uploader" class="card component-demo"><h3>Uploader</h3><van-uploader /></article>
      </div>
    </section>

    <section id="category-mounted" class="demo-category">
      <h2>基础组件显式挂载</h2>
      <div class="component-grid">
        <section id="vant-BackTop" class="card component-demo"><h3>BackTop</h3><p class="muted">页面级 BackTop 已在导航演示中挂载。</p></section>
        <section id="vant-Badge" class="card component-demo"><h3>Badge</h3><van-badge content="8" /></section>
        <section id="vant-Calendar" class="card component-demo"><h3>Calendar</h3><van-calendar :poppable="false" :show-confirm="false" :style="{ height: '480px' }" /><h3 class="sub-heading">DateRangePicker（type="range"）</h3><van-calendar type="range" :poppable="false" :show-confirm="false" :style="{ height: '480px' }" /></section>
        <section id="vant-Card" class="card component-demo"><h3>Card</h3><van-card price="20.00" title="显式卡片" desc="卡片内容" /></section>
        <section id="vant-Cascader" class="card component-demo"><h3>Cascader</h3><van-cascader :options="[{ text: '选项一', value: 'one', children: [{ text: '子项', value: 'child' }] }]" /></section>
        <section id="vant-Cell" class="card component-demo"><h3>Cell</h3><van-cell title="显式 Cell" value="内容" is-link /></section>
        <section id="vant-CellGroup" class="card component-demo"><h3>CellGroup</h3><van-cell-group inset><van-cell title="CellGroup 内容" /></van-cell-group></section>
        <section id="vant-Checkbox" class="card component-demo"><h3>Checkbox</h3><van-checkbox :model-value="true">显式复选框</van-checkbox></section>
        <section id="vant-CheckboxGroup" class="card component-demo"><h3>CheckboxGroup</h3><van-checkbox-group><van-checkbox name="one">选项一</van-checkbox><van-checkbox name="two">选项二</van-checkbox></van-checkbox-group></section>
        <section id="vant-Circle" class="card component-demo"><h3>Circle</h3><van-circle v-model:current-rate="circleRate2" :rate="72" :speed="100" text="72%" /></section>
        <section id="vant-Collapse" class="card component-demo"><h3>Collapse</h3><van-collapse><van-collapse-item title="折叠面板" name="one">面板内容</van-collapse-item></van-collapse></section>
        <section id="vant-DatePicker" class="card component-demo"><h3>DatePicker</h3><van-date-picker /></section>
        <section id="vant-Dialog" class="card component-demo"><h3>Dialog</h3><van-button size="small" @click="showDialog = true">打开 Dialog</van-button></section>
        <section id="vant-Divider" class="card component-demo"><h3>Divider</h3><van-divider>分隔线</van-divider></section>
        <section id="vant-DropdownMenu" class="card component-demo"><h3>DropdownMenu</h3><van-dropdown-menu><van-dropdown-item title="选项" :options="[{ text: '一', value: 1 }, { text: '二', value: 2 }]" /></van-dropdown-menu></section>
        <section id="vant-Empty" class="card component-demo"><h3>Empty</h3><van-empty description="暂无内容" /></section>
        <section id="vant-Field" class="card component-demo"><h3>Field</h3><van-field label="字段" placeholder="请输入" /></section>
        <section id="vant-Grid" class="card component-demo"><h3>Grid</h3><van-grid :column-num="3"><van-grid-item text="一" /><van-grid-item text="二" /><van-grid-item text="三" /></van-grid></section>
        <section id="vant-Image" class="card component-demo"><h3>Image</h3><van-image width="80" height="60" :src="imageSources[0]" /></section>
        <section id="vant-IndexBar" class="card component-demo"><h3>IndexBar</h3><div class="index-box"><van-index-bar><van-index-anchor index="C" /><van-cell title="显式索引" /></van-index-bar></div></section>
        <section id="vant-Loading" class="card component-demo"><h3>Loading</h3><van-loading type="spinner" /></section>
        <section id="vant-NoticeBar" class="card component-demo"><h3>NoticeBar</h3><van-notice-bar text="显式通知栏" /></section>
        <section id="vant-Notify" class="card component-demo"><h3>Notify</h3><van-button size="small" @click="showNotify({ type: 'success', message: '通知' })">打开 Notify</van-button></section>
        <section id="vant-Overlay" class="card component-demo"><h3>Overlay</h3><van-button size="small" @click="showOverlay = true">打开 Overlay</van-button></section>
        <section id="vant-Pagination" class="card component-demo"><h3>Pagination</h3><van-pagination :model-value="1" :page-count="3" /></section>
        <section id="vant-PasswordInput" class="card component-demo"><h3>PasswordInput</h3><van-password-input :value="'1234'" /></section>
        <section id="vant-Picker" class="card component-demo"><h3>Picker</h3><van-picker :columns="[{ text: '一', value: 'one' }, { text: '二', value: 'two' }, { text: '三', value: 'three' }]" /></section>
        <section id="vant-Popover" class="card component-demo"><h3>Popover</h3><van-popover :actions="[{ text: '操作' }]"><template #reference><van-button size="small">打开 Popover</van-button></template></van-popover></section>
        <section id="vant-Popup" class="card component-demo"><h3>Popup</h3><van-button size="small" @click="showPopup = true">打开 Popup</van-button></section>
        <section id="vant-Progress" class="card component-demo"><h3>Progress</h3><van-progress :percentage="55" /></section>
        <section id="vant-Radio" class="card component-demo"><h3>Radio</h3><van-radio :model-value="true" name="one">显式单选</van-radio></section>
        <section id="vant-RadioGroup" class="card component-demo"><h3>RadioGroup</h3><van-radio-group model-value="one"><van-radio name="one">一</van-radio><van-radio name="two">二</van-radio></van-radio-group></section>
        <section id="vant-Rate" class="card component-demo"><h3>Rate</h3><van-rate :model-value="3" /></section>
        <section id="vant-RollingText" class="card component-demo"><h3>RollingText</h3><van-rolling-text :start-num="10" :target-num="88" /></section>
        <section id="vant-Sidebar" class="card component-demo"><h3>Sidebar</h3><van-sidebar :model-value="0"><van-sidebar-item title="显式侧栏" /></van-sidebar></section>
        <section id="vant-SidebarItem" class="card component-demo"><h3>SidebarItem</h3><van-sidebar :model-value="0"><van-sidebar-item title="子项" /></van-sidebar></section>
        <section id="vant-Skeleton" class="card component-demo"><h3>Skeleton</h3><van-skeleton title :row="2" /></section>
        <section id="vant-SkeletonAvatar" class="card component-demo"><h3>SkeletonAvatar</h3><van-skeleton-avatar /></section>
        <section id="vant-SkeletonImage" class="card component-demo"><h3>SkeletonImage</h3><van-skeleton-image /></section>
        <section id="vant-SkeletonParagraph" class="card component-demo"><h3>SkeletonParagraph</h3><van-skeleton-paragraph :row="2" /></section>
        <section id="vant-SkeletonTitle" class="card component-demo"><h3>SkeletonTitle</h3><van-skeleton-title /></section>
        <section id="vant-Space" class="card component-demo"><h3>Space</h3><van-space><van-button size="small">一</van-button><van-button size="small">二</van-button></van-space></section>
        <section id="vant-Steps" class="card component-demo"><h3>Steps</h3><van-steps :active="0"><van-step>显式步骤</van-step></van-steps></section>
        <section id="vant-Sticky" class="card component-demo"><h3>Sticky</h3><van-sticky><van-button size="small">显式 Sticky</van-button></van-sticky></section>
        <section id="vant-Swipe" class="card component-demo"><h3>Swipe</h3><van-swipe :autoplay="0" :style="{ height: '60px' }"><van-swipe-item><div class="swipe-box">显式 Swipe</div></van-swipe-item></van-swipe></section>
        <section id="vant-SwipeItem" class="card component-demo"><h3>SwipeItem</h3><van-swipe :autoplay="0" :style="{ height: '60px' }"><van-swipe-item><div class="swipe-box">子项</div></van-swipe-item></van-swipe></section>
        <section id="vant-Tabbar" class="card component-demo"><h3>Tabbar</h3><van-tabbar :fixed="false" :model-value="0"><van-tabbar-item>首页</van-tabbar-item><van-tabbar-item>设置</van-tabbar-item></van-tabbar></section>
        <section id="vant-TabbarItem" class="card component-demo"><h3>TabbarItem</h3><van-tabbar :fixed="false" :model-value="0"><van-tabbar-item dot>子项</van-tabbar-item></van-tabbar></section>
        <section id="vant-Tabs" class="card component-demo"><h3>Tabs</h3><van-tabs><van-tab title="显式标签">内容</van-tab></van-tabs></section>
        <section id="vant-TimePicker" class="card component-demo"><h3>TimePicker</h3><van-time-picker /></section>
        <section id="vant-Toast" class="card component-demo"><h3>Toast</h3><van-button size="small" @click="showToast('Toast')">打开 Toast</van-button></section>
        <section id="vant-Typography" class="card component-demo"><h3>Typography</h3><p>排版组合示例</p></section>
        <section id="vant-ButtonGroup" class="card component-demo"><h3>ButtonGroup</h3><van-space><van-button size="small">一</van-button><van-button size="small">二</van-button></van-space></section>
        <section id="vant-Input" class="card component-demo"><h3>Input</h3><van-field placeholder="Input 组合示例" /></section>
        <section id="vant-Result" class="card component-demo"><h3>Result</h3><van-empty description="完成" /></section>
        <section id="vant-Layout" class="card component-demo"><h3>Layout</h3><div class="layout-box"><main>布局组合示例</main></div></section>
        <section id="vant-Link" class="card component-demo"><h3>Link</h3><a href="#vant-Button">组合链接</a></section>
      </div>
    </section>

    <van-action-sheet v-model:show="showActionSheet" :actions="actionSheetActions" cancel-text="取消" close-on-click-action />
    <van-share-sheet v-model:show="showShareSheet" title="分享" :options="shareOptions" />
    <van-dialog v-model:show="showDialog" title="Dialog" show-cancel-button>确认操作？</van-dialog>
    <van-popup v-model:show="showPopup" position="bottom" round><van-calendar /></van-popup>
    <van-overlay :show="showOverlay" @click="showOverlay = false"><div class="overlay-content">Overlay</div></van-overlay>
    <van-popup v-model:show="showCommand" position="bottom" round><div class="command-palette"><van-search placeholder="搜索组件" /><van-cell v-for="name in componentNames.slice(0, 6)" :key="name" :title="name" is-link /></div></van-popup>
  </div>
</template>

<style scoped>
.components-page { min-width: 0; }
.component-index { display: grid; gap: 8px; position: sticky; top: 72px; z-index: 2; max-height: 40vh; overflow: auto; }
.component-index-links a { display: inline-flex; align-items: center; min-height: 40px; padding: 0 2px; }
.component-index-links { gap: 2px 6px; }
.barrage-box { background: var(--van-background); }
.barrage-stage { display: grid; place-items: center; height: 96px; }
.tooltip-text { display: block; padding: 8px 12px; font-size: 13px; }
.segment-body { margin: 12px 0 0; color: var(--van-text-color); }
.sub-heading { margin: 16px 0 12px; }
.component-index-links { min-width: 0; }
.anchor-target { display: inline-block; width: 0; height: 0; overflow: hidden; }
.anchor-targets { position: absolute; width: 0; height: 0; overflow: hidden; }
.demo-category { margin-top: 28px; min-width: 0; }
.demo-category > h2 { margin: 0 0 12px; }
.component-demo { min-width: 0; overflow: hidden; }
.component-demo h3 { margin: 0 0 12px; }
.button-matrix { display: flex; flex-wrap: wrap; gap: 8px; }
.inline-action-bar { position: static; margin-top: 16px; }
.upload-drop, .missing-box { margin-top: 12px; padding: 18px; border: 1px dashed var(--van-border-color); color: var(--van-text-color-2); }
.data-table { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; background: var(--van-border-color); }
.data-table > div { min-width: 0; padding: 8px; background: var(--van-background-2); }
.thumb-placeholder, .grid-cell, .swipe-box { display: grid; place-items: center; min-height: 56px; background: var(--van-background); color: var(--van-text-color-2); }
.avatar-group { display: flex; align-items: center; margin-bottom: 12px; }
.avatar-group .van-image { margin-right: -8px; border: 2px solid var(--van-background-2); }
.index-box { position: relative; height: 240px; overflow: auto; border: 1px solid var(--van-border-color); }
.index-box :deep(.van-index-bar__sidebar) { position: absolute; }
.keyboard-box { position: relative; min-height: 220px; overflow: hidden; }
.keyboard-box :deep(.van-number-keyboard) { position: static; }
.floating-panel-box { position: relative; height: 240px; overflow: hidden; margin-top: 12px; border: 1px solid var(--van-border-color); }
.floating-panel-content { padding: 16px; }
.submit-bar-box { position: relative; min-height: 140px; }
.submit-bar-box :deep(.van-submit-bar) { position: static; }
.watermark-box { position: relative; height: 120px; overflow: hidden; }
.nested-dark { padding: 12px; background: #1d1d1f; }
.overlay-content { display: grid; place-items: center; height: 100%; color: #fff; font-size: 24px; }
.command-palette { padding: 12px; }
.popover-actions { display: flex; gap: 8px; padding: 8px; }
pre.code-demo { overflow: auto; padding: 12px; background: var(--van-background); }
.vertical-slider { height: 100px; margin: 16px auto; }
@media (max-width: 767px) {
  .component-index { position: static; }
}
</style>
