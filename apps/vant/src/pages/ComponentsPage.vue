<script setup lang="ts">
import { computed, ref, resolveComponent } from "vue"
import contract from "@ui-gallery/spec/contract.json"
import { showDialog, showNotify, showToast } from "vant"
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
const showPopup = ref(false)
const showOverlay = ref(false)
const showFloatingPanel = ref(false)
const showCommand = ref(false)
const missing = new Set(Object.entries(coverage).filter(([, status]) => status === "missing").map(([name]) => name))

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
const componentTag = (name: string) => `van-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, "")}`
const resolveVant = (name: string) => resolveComponent(componentTag(name))
const contractStatus = (name: string) => missing.has(name) ? "missing" : coverage[name] ?? "implemented"
const trigger = (name: string) => {
  if (name === "Toast") showToast("Toast")
  else if (name === "Notify") showNotify({ type: "success", message: "Notify" })
  else if (name === "ActionSheet" || name === "ShareSheet") showToast(name)
  else if (name === "Dialog") void showDialog({ title: "Dialog", message: "确认操作？" })
  else showPopup.value = true
}
const statusType = (name: string) => name === "missing" ? "danger" : name === "composed" ? "warning" : "success"
const selectedValues = computed(() => [selected.value])
const couponDemo = { id: "coupon-1", name: "演示优惠券", condition: "满 ¥100 可用", denominations: 20, originCondition: 100, value: 20, startAt: Date.now(), endAt: Date.now() + 86400000, reason: "" }
</script>

<template>
  <div class="page components-page">
    <div class="page-title">
      <div><h1>组件全集</h1><p>Vant 组件与 contract 覆盖演示</p></div>
      <van-button type="primary" @click="showCommand = true"><template #icon><AppIcon name="search" /></template>组件搜索</van-button>
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
    </div>

    <section id="category-typography" class="demo-category">
      <h2>排版</h2>
      <div class="component-grid">
        <article id="Typography" class="card component-demo"><div class="between"><h3>Typography</h3><van-tag type="warning">composed</van-tag></div><h1>标题一</h1><h3>标题三</h3><p class="muted">正文与辅助文字</p><van-divider content-position="left">Divider</van-divider></article>
        <article id="Code" class="card component-demo"><div class="between"><h3>Code</h3><van-tag>composed</van-tag></div><pre class="code-demo">const console = "Acme"</pre></article>
        <article id="Kbd" class="card component-demo"><div class="between"><h3>Kbd</h3><van-tag>composed</van-tag></div><van-tag mark>⌘ K</van-tag><span class="muted"> 快捷键</span></article>
      </div>
    </section>

    <section id="category-buttons" class="demo-category">
      <h2>按钮</h2>
      <div class="component-grid">
        <article id="Button" class="card component-demo">
          <div class="between"><h3>Button</h3><van-tag type="success">implemented</van-tag></div>
          <div class="button-matrix">
            <van-button v-for="type in ['primary', 'success', 'warning', 'danger', 'default']" :key="type" :type="type as 'primary'" size="large">大按钮</van-button>
            <van-button v-for="size in ['normal', 'small', 'mini']" :key="size" type="primary" :size="size as 'normal'">尺寸</van-button>
            <van-button plain type="primary">plain</van-button><van-button hairline type="primary">hairline</van-button><van-button round type="primary">round</van-button><van-button square type="primary" icon="plus" />
            <van-button icon="plus" type="primary" /><van-button type="primary" loading loading-text="加载中" /><van-button disabled>disabled</van-button><van-button block type="primary">block</van-button>
          </div>
        </article>
        <article id="ButtonGroup" class="card component-demo"><div class="between"><h3>ButtonGroup</h3><van-tag type="warning">composed</van-tag></div><van-space wrap><van-button type="primary">一</van-button><van-button type="success">二</van-button><van-button type="warning">三</van-button></van-space><van-action-bar class="inline-action-bar"><van-action-bar-icon icon="chat-o" text="客服" /><van-action-bar-button type="danger" text="立即购买" /></van-action-bar></article>
        <article id="IconButton" class="card component-demo"><div class="between"><h3>IconButton</h3><van-tag type="success">implemented</van-tag></div><div class="inline"><van-button icon="plus" type="primary" /><van-button type="primary"><template #icon><AppIcon name="bar-chart" /></template>图标</van-button></div></article>
      </div>
    </section>

    <section id="category-form" class="demo-category">
      <h2>表单控件</h2>
      <div class="component-grid">
        <article id="Input" class="card component-demo"><h3>Field variants</h3><van-field label="标签" placeholder="placeholder" clearable required /><van-field label="图标"><template #left-icon><AppIcon name="mail" /></template><template #right-icon><AppIcon name="eye" /></template></van-field><van-field label="搜索" error error-message="格式不正确" /><van-field label="多行" type="textarea" autosize show-word-limit maxlength="60" /><van-field label="数字" type="digit" /></article>
        <article id="Select" class="card component-demo"><h3>Select / MultiSelect / Combobox</h3><van-picker :columns="[{ text: '选项一', value: 'a' }, { text: '选项二', value: 'b' }]" /><van-checkbox-group v-model="selectedValues"><van-cell-group inset><van-cell title="选项一"><template #right-icon><van-checkbox name="a" /></template></van-cell><van-cell title="选项二"><template #right-icon><van-checkbox name="b" /></template></van-cell></van-cell-group></van-checkbox-group><van-search placeholder="Autocomplete" /></article>
        <article id="Checkbox" class="card component-demo"><h3>Checkbox / CheckboxGroup</h3><van-checkbox v-model="checked">checked</van-checkbox><van-checkbox shape="square">square</van-checkbox><van-checkbox disabled>disabled</van-checkbox><van-checkbox :indeterminate="true">indeterminate</van-checkbox><van-checkbox-group direction="horizontal" :max="2"><van-checkbox name="a">A</van-checkbox><van-checkbox name="b">B</van-checkbox><van-checkbox name="c">C</van-checkbox></van-checkbox-group></article>
        <article id="Radio" class="card component-demo"><h3>Radio / RadioGroup</h3><van-radio-group v-model="radio" direction="horizontal"><van-radio name="a">A</van-radio><van-radio name="b">B</van-radio></van-radio-group><van-radio-group v-model="radio"><van-radio name="c" disabled>disabled</van-radio></van-radio-group></article>
        <article id="Switch" class="card component-demo"><h3>Switch</h3><div class="inline"><van-switch v-model="switchValue" /><van-switch size="20px" /><van-switch loading /><van-switch disabled /></div></article>
        <article id="Slider" class="card component-demo"><h3>Slider / Rate</h3><van-slider v-model="slider" step="5" /><van-slider v-model="range" range /><van-slider vertical :style="{ height: '100px' }" /><van-rate v-model="rate" allow-half /><van-rate :model-value="3" readonly :count="6" /></article>
        <article id="DatePicker" class="card component-demo"><h3>DatePicker / TimePicker / Calendar</h3><van-date-picker title="日期" /><van-time-picker title="时间" /><van-calendar :poppable="false" :show-confirm="false" :style="{ height: '300px' }" /></article>
        <article id="ColorPicker" class="card component-demo"><h3>ColorPicker <van-tag type="danger">missing fallback</van-tag></h3><van-field label="missing fallback"><template #input><input type="color" value="#1989fa" /></template></van-field></article>
        <article id="Upload" class="card component-demo"><h3>Uploader</h3><van-uploader multiple preview-size="64" :max-count="3"><template #preview-cover><span>文件</span></template></van-uploader><div class="upload-drop">拖拽文件到这里或点击上传</div></article>
        <article id="Cascader" class="card component-demo"><h3>Cascader</h3><van-cascader title="级联选择" :options="[{ text: '浙江', value: 'zj', children: [{ text: '杭州', value: 'hz' }] }, { text: '江苏', value: 'js' }]" /></article>
        <article id="PinInput" class="card component-demo"><h3>PasswordInput / NumberKeyboard</h3><van-password-input :value="'1234'" :gutter="8" :focused="true" /><van-number-keyboard :show="true" /></article>
        <article id="Form" class="card component-demo"><h3>Form layouts</h3><van-form><van-cell-group inset><van-field label="左对齐" label-align="left" required /><van-field label="顶部" label-align="top" /><van-field label="右对齐" label-align="right" /></van-cell-group></van-form></article>
      </div>
    </section>

    <section id="category-data" class="demo-category">
      <h2>数据展示</h2>
      <div class="component-grid">
        <article id="Table" class="card component-demo"><h3>Table</h3><div class="data-row head"><span>订单</span><span>客户</span><span>状态</span><span>金额</span></div><div v-for="row in ['ORD-2400', 'ORD-2401', 'ORD-2402']" :key="row" class="data-row"><span>{{ row }}</span><span>林晓</span><van-tag type="success">已支付</van-tag><span>¥1,638</span></div></article>
        <article id="Descriptions" class="card component-demo"><h3>Descriptions</h3><van-cell-group inset><van-cell title="订单号" value="ORD-2400" /><van-cell title="客户" value="林晓" /><van-cell title="状态" value="已支付" /></van-cell-group></article>
        <article id="List" class="card component-demo"><h3>List</h3><van-list finished-text="没有更多了"><van-cell v-for="n in 3" :key="n" :title="`列表项 ${n}`" is-link /></van-list></article>
        <article id="Card" class="card component-demo"><h3>Card</h3><van-card num="2" price="268.00" desc="商品描述" title="商品标题" tag="标签"><template #thumb><div class="thumb-placeholder">图</div></template></van-card></article>
        <article id="Avatar" class="card component-demo"><h3>Avatar / AvatarGroup</h3><div class="avatar-group"><van-image v-for="name in ['林', '王', 'A', 'M']" :key="name" round width="38" height="38" :src="`data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='38' height='38'><rect width='38' height='38' fill='%231989fa'/><text x='19' y='24' text-anchor='middle' fill='white'>${name}</text></svg>`)}`" /></div></article>
        <article id="Badge" class="card component-demo"><h3>Badge</h3><div class="inline"><van-badge content="99+" /><van-badge dot color="#1989fa" /><van-badge content="5" max="3" /></div></article>
        <article id="Tag" class="card component-demo"><h3>Tag</h3><div class="inline"><van-tag v-for="type in ['primary', 'success', 'warning', 'danger']" :key="type" :type="type as 'primary'" plain round>{{ type }}</van-tag><van-tag closeable mark type="primary">close</van-tag></div></article>
        <article id="Statistic" class="card component-demo"><h3>Statistic</h3><van-rolling-text :start-num="1200" :target-num="128430" /><van-count-down :time="300000" /></article>
        <article id="Timeline" class="card component-demo"><h3>Timeline</h3><van-steps direction="vertical" :active="2"><van-step>创建订单</van-step><van-step>审核通过</van-step><van-step>完成支付</van-step></van-steps></article>
        <article id="Tree" class="card component-demo"><h3>TreeSelect</h3><van-tree-select :items="[{ text: '分类一', children: [{ text: '项目一', id: 'one' }, { text: '项目二', id: 'two' }] }]" /></article>
        <article id="Image" class="card component-demo"><h3>Image / ImagePreview</h3><div class="inline"><van-image width="80" height="80" fit="cover" round loading="lazy" error-icon="photo-fail" /><van-button size="small" @click="showToast('ImagePreview')">预览</van-button></div></article>
        <article id="Carousel" class="card component-demo"><h3>Swipe</h3><van-swipe autoplay="2500" vertical indicator-color="white" :style="{ height: '100px' }"><van-swipe-item v-for="n in 3" :key="n"><div class="swipe-box">第 {{ n }} 页</div></van-swipe-item></van-swipe></article>
        <article id="Empty" class="card component-demo"><h3>Empty</h3><van-empty image="search" description="暂无内容"><van-button type="primary" size="small">刷新</van-button></van-empty></article>
        <article id="Tooltip" class="card component-demo"><h3>Tooltip / Popover</h3><van-popover theme="dark" :actions="[{ text: '操作一' }, { text: '操作二' }]"><template #reference><van-button>打开 Popover</van-button></template></van-popover></article>
        <article id="Segmented" class="card component-demo"><h3>Segmented</h3><van-tabs v-model:active="activeTab" type="card"><van-tab title="日" /><van-tab title="周" /><van-tab title="月" /></van-tabs></article>
        <article id="Circle" class="card component-demo"><h3>Circle / Progress</h3><div class="inline"><van-circle :rate="65" /><van-progress :percentage="65" :pivot-text="'65%'" stroke-width="8" /></div><van-progress :percentage="65" inactive striped /></article>
        <article id="Skeleton" class="card component-demo"><h3>Skeleton</h3><van-skeleton title avatar :row="3" animate /><van-skeleton-title /><van-skeleton-avatar /><van-skeleton-paragraph /><van-skeleton-image /></article>
        <article id="Loading" class="card component-demo"><h3>Loading</h3><div class="inline"><van-loading /><van-loading type="spinner" size="24" /><van-loading vertical>加载中</van-loading></div></article>
      </div>
    </section>

    <section id="category-feedback" class="demo-category">
      <h2>反馈</h2>
      <div class="component-grid">
        <article id="NoticeBar" class="card component-demo"><h3>NoticeBar</h3><van-notice-bar text="默认提示信息" /><van-notice-bar type="warning" text="注意信息" /><van-notice-bar type="danger" text="错误信息" /></article>
        <article id="Toast" class="card component-demo"><h3>Toast / Notify</h3><van-space wrap><van-button @click="showToast('文本')">文本</van-button><van-button @click="showToast({ type: 'success', message: '成功' })">成功</van-button><van-button @click="showToast({ type: 'fail', message: '失败' })">失败</van-button><van-button @click="showNotify('通知')">通知</van-button></van-space></article>
        <article id="Dialog" class="card component-demo"><h3>Dialog / Popup</h3><van-space wrap><van-button @click="trigger('Dialog')">Alert</van-button><van-button @click="showPopup = true">Popup</van-button><van-button @click="showOverlay = true">Overlay</van-button></van-space></article>
        <article id="ActionSheet" class="card component-demo"><h3>ActionSheet / ShareSheet</h3><van-space><van-button @click="trigger('ActionSheet')">ActionSheet</van-button><van-button @click="trigger('ShareSheet')">ShareSheet</van-button></van-space></article>
        <article id="Result" class="card component-demo"><h3>Result / Popconfirm</h3><van-empty image="success" description="操作成功"><van-button type="primary">继续</van-button></van-empty><van-popover><template #reference><van-button>Popconfirm</van-button></template><div class="popover-actions"><van-button size="small">取消</van-button><van-button size="small" type="primary">确认</van-button></div></van-popover></article>
      </div>
    </section>

    <section id="category-navigation" class="demo-category">
      <h2>导航</h2>
      <div class="component-grid">
        <article id="Navbar" class="card component-demo"><h3>NavBar</h3><van-nav-bar title="导航栏" left-text="返回" right-text="按钮" left-arrow /></article>
        <article id="Sidebar" class="card component-demo"><h3>Sidebar / Tabbar</h3><van-sidebar :model-value="0"><van-sidebar-item title="项目一" badge="12" /><van-sidebar-item title="项目二" disabled /></van-sidebar><van-tabbar :model-value="0" :fixed="false"><van-tabbar-item icon="home-o" dot>首页</van-tabbar-item><van-tabbar-item icon="setting-o" badge="3">设置</van-tabbar-item></van-tabbar></article>
        <article id="Tabs" class="card component-demo"><h3>Tabs</h3><van-tabs type="line" swipeable shrink sticky><van-tab title="标签一">内容一</van-tab><van-tab title="标签二">内容二</van-tab><van-tab title="标签三">内容三</van-tab></van-tabs></article>
        <article id="Dropdown" class="card component-demo"><h3>DropdownMenu / Pagination</h3><van-dropdown-menu><van-dropdown-item title="排序" :options="[{ text: '默认', value: 0 }, { text: '销量', value: 1 }]" /></van-dropdown-menu><van-pagination :model-value="1" :page-count="3" mode="simple" /></article>
        <article id="Steps" class="card component-demo"><h3>Steps</h3><van-steps :active="1"><van-step>步骤一</van-step><van-step>步骤二</van-step><van-step>步骤三</van-step></van-steps></article>
        <article id="Anchor" class="card component-demo"><h3>IndexBar / Anchor</h3><div class="index-scroll"><van-index-bar><van-index-anchor index="A" /><van-cell title="Anchor" /><van-index-anchor index="B" /><van-cell title="BackTop" /></van-index-bar></div></article>
        <article id="BackTop" class="card component-demo"><h3>BackTop / Sticky</h3><van-sticky :offset-top="10"><van-button size="small">Sticky</van-button></van-sticky><van-back-top /></article>
        <article id="Breadcrumb" class="card component-demo"><h3>Breadcrumb / Menu</h3><div class="breadcrumb"><a href="#Button">首页</a><AppIcon name="chevron-right" /><a href="#Form">表单</a></div><van-collapse><van-collapse-item title="Menu composed" name="menu"><van-tree-select :items="[{ text: '菜单', children: [{ text: '项目', id: 'menu-item' }] }]" /></van-collapse-item></van-collapse></article>
        <article id="CommandPalette" class="card component-demo"><h3>CommandPalette</h3><van-button @click="showCommand = true">打开命令面板</van-button></article>
      </div>
    </section>

    <section id="category-layout" class="demo-category">
      <h2>布局</h2>
      <div class="component-grid">
        <article id="Grid" class="card component-demo"><h3>Row / Col / Grid</h3><van-row gutter="8"><van-col span="8"><div class="grid-cell">8</div></van-col><van-col span="8"><div class="grid-cell">8</div></van-col><van-col span="8"><div class="grid-cell">8</div></van-col><van-col span="18" offset="6"><div class="grid-cell">18 offset 6</div></van-col></van-row><van-grid :column-num="4" square border><van-grid-item text="一" /><van-grid-item text="二" /><van-grid-item text="三" /><van-grid-item text="四" /></van-grid></article>
        <article id="Stack" class="card component-demo"><h3>Space</h3><van-space direction="vertical" fill><van-button block>垂直</van-button><van-button block>间距</van-button></van-space></article>
        <article id="Divider" class="card component-demo"><h3>Divider</h3><van-divider content-position="left">左</van-divider><van-divider dashed>虚线</van-divider><van-divider content-position="right">右</van-divider></article>
        <article id="Accordion" class="card component-demo"><h3>Collapse</h3><van-collapse accordion><van-collapse-item title="面板一" name="1">内容一</van-collapse-item><van-collapse-item title="面板二" name="2" disabled>内容二</van-collapse-item></van-collapse></article>
        <article id="Layout" class="card component-demo"><h3>Layout / Container / ScrollArea</h3><div class="layout-box"><header>Header</header><main>Container 内容</main><footer>Footer</footer></div><div class="scroll-box"><van-pull-refresh :model-value="false"><van-cell title="ScrollArea" /><van-cell title="PullRefresh" /></van-pull-refresh></div></article>
        <article id="AspectRatio" class="card component-demo"><h3>AspectRatio / Resizable</h3><div class="missing-box">contract missing fallback</div></article>
      </div>
    </section>

    <section id="category-business" class="demo-category">
      <h2>业务组件</h2>
      <div class="component-grid">
        <section v-for="name in vantExports" :id="`vant-${name}`" :key="`demo-${name}`" class="card component-demo business-demo">
          <div class="between"><h3>{{ name }}</h3><van-tag :type="missing.has(name) ? 'danger' : 'primary'">{{ missing.has(name) ? "note" : "mounted" }}</van-tag></div>
          <component :is="resolveVant(name)" v-if="name !== 'Lazyload' && name !== 'Locale'" v-bind="name === 'FloatingBubble' ? { axis: 'xy', icon: 'plus' } : name === 'Watermark' ? { content: 'Acme', fullPage: false } : name === 'Coupon' ? { coupon: couponDemo } : name === 'CouponCell' || name === 'CouponList' ? { coupons: [couponDemo] } : undefined">
            <template v-if="name === 'ActionBar'"><van-action-bar-icon icon="chat-o" text="客服" /><van-action-bar-button text="购买" /></template>
            <template v-if="name === 'Collapse'"><van-collapse-item title="业务示例" name="1">内容</van-collapse-item></template>
            <template v-if="name === 'Steps'"><van-step>步骤</van-step></template>
            <template v-if="name === 'Tabs'"><van-tab title="标签">内容</van-tab></template>
            <template v-if="name === 'Swipe'"><van-swipe-item><div class="swipe-box">业务</div></van-swipe-item></template>
          </component>
          <p v-else class="muted">Lazyload / Locale 为插件与全局配置，详见页面实现说明。</p>
        </section>
      </div>
    </section>

    <section id="category-other" class="demo-category">
      <h2>其他</h2>
      <div class="component-grid">
        <article id="ThemeProvider" class="card component-demo"><h3>ConfigProvider</h3><van-config-provider theme="dark"><div class="nested-dark"><van-button type="primary">Dark Button</van-button><van-field label="Dark Field" /><van-cell title="Dark Cell" /></div></van-config-provider><van-config-provider :theme-vars="{ primaryColor: '#07c160' }"><van-button type="primary">主题变量</van-button></van-config-provider></article>
        <article id="Watermark" class="card component-demo"><h3>Watermark</h3><div class="watermark-box"><van-watermark content="Acme Console" :full-page="false" /></div></article>
        <article id="FloatButton" class="card component-demo"><h3>FloatingBubble / FloatingPanel</h3><van-floating-bubble axis="xy" icon="plus" /><van-button @click="showFloatingPanel = !showFloatingPanel">FloatingPanel</van-button><div v-if="showFloatingPanel" class="floating-note">FloatingPanel 需要全屏容器</div></article>
        <article id="Signature" class="card component-demo"><h3>Signature</h3><van-signature tips="请签名" /></article>
        <article id="Barrage" class="card component-demo"><h3>Barrage</h3><van-barrage :rows="2" /></article>
      </div>
    </section>

    <van-popup v-model:show="showPopup" position="bottom" round><van-calendar /></van-popup>
    <van-overlay :show="showOverlay" @click="showOverlay = false"><div class="overlay-content">Overlay</div></van-overlay>
    <van-popup v-model:show="showCommand" position="bottom" round><div class="command-palette"><van-search placeholder="搜索组件" /><van-cell v-for="name in componentNames.slice(0, 6)" :key="name" :title="name" is-link /></div></van-popup>
  </div>
</template>

<style scoped>
.components-page { min-width: 0; }
.component-index { display: grid; gap: 8px; position: sticky; top: 72px; z-index: 2; max-height: 180px; overflow: auto; }
.component-index-links { min-width: 0; }
.demo-category { margin-top: 28px; min-width: 0; }
.demo-category > h2 { margin: 0 0 12px; }
.component-demo { min-width: 0; overflow: hidden; }
.component-demo h3 { margin: 0 0 12px; }
.button-matrix { display: flex; flex-wrap: wrap; gap: 8px; }
.inline-action-bar { position: static; margin-top: 16px; }
.upload-drop, .missing-box, .floating-note { margin-top: 12px; padding: 18px; border: 1px dashed var(--van-border-color); color: var(--van-text-color-2); }
.data-row { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.thumb-placeholder, .grid-cell, .swipe-box { display: grid; place-items: center; min-height: 56px; background: var(--van-background); color: var(--van-text-color-2); }
.avatar-group { display: flex; align-items: center; }
.avatar-group .van-image { margin-right: -8px; border: 2px solid var(--van-background-2); }
.index-scroll, .scroll-box { height: 180px; overflow: auto; border: 1px solid var(--van-border-color); }
.breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.layout-box { border: 1px solid var(--van-border-color); }
.layout-box header, .layout-box main, .layout-box footer { padding: 8px; }
.layout-box header, .layout-box footer { background: var(--van-background); }
.watermark-box { position: relative; height: 120px; overflow: hidden; }
.nested-dark { padding: 12px; background: #1d1d1f; }
.overlay-content { display: grid; place-items: center; height: 100%; color: #fff; font-size: 24px; }
.command-palette { padding: 12px; }
pre.code-demo { overflow: auto; padding: 12px; background: var(--van-background); }
@media (max-width: 767px) {
  .component-index { position: static; }
}
</style>
