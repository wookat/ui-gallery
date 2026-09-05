<script setup lang="ts">
import { ref } from "vue"
import contract from "@ui-gallery/spec/contract.json"
import { showNotify, showToast } from "vant"
import { coverage } from "@/coverage"

const componentNames = contract.components
const showPopup = ref(false)
const checked = ref(true)
const slider = ref(45)
const rate = ref(4)
const missing = new Set(Object.entries(coverage).filter(([, status]) => status === "missing").map(([name]) => name))
const trigger = (name: string) => { if (name === "Toast") showToast("Toast"); else if (name === "Notification") showNotify("Notification"); else if (name === "Dialog") showPopup.value = true; else if (name === "Menu") showToast("Menu") }
</script>

<template>
  <div class="page">
    <div class="page-title"><div><h1>组件全集</h1><p>Vant 组件与 contract 覆盖演示</p></div></div>
    <div class="card component-index"><div class="inline"><a v-for="name in componentNames" :key="name" :href="`#${name}`"><van-tag :type="missing.has(name) ? 'danger' : coverage[name] === 'composed' ? 'warning' : 'primary'">{{ name }}</van-tag></a></div></div>
    <div class="component-grid">
      <section v-for="name in componentNames" :id="name" :key="name" class="card component-demo">
        <div class="between"><h2>{{ name }}</h2><van-tag :type="missing.has(name) ? 'danger' : coverage[name] === 'composed' ? 'warning' : 'success'">{{ coverage[name] }}</van-tag></div>
        <div v-if="missing.has(name)" class="muted">Vant 未提供，按 contract 标记为 missing。</div>
        <div v-else-if="name === 'Typography'" class="stack"><h1>标题一</h1><h3>标题三</h3><p class="muted">正文与辅助文字</p></div>
        <div v-else-if="name === 'Button' || name === 'IconButton' || name === 'ButtonGroup'" class="inline"><van-button v-for="type in ['primary', 'success', 'warning', 'danger', 'default']" :key="type" :type="type as 'primary'">按钮</van-button><van-button loading /><van-button disabled>禁用</van-button></div>
        <div v-else-if="['Input', 'Textarea', 'NumberInput', 'Select', 'MultiSelect', 'Combobox', 'Autocomplete'].includes(name)" class="stack"><van-field :label="name" placeholder="输入内容" /><van-field v-if="name === 'Textarea'" type="textarea" placeholder="多行文本" /><van-cell title="选择项" is-link /></div>
        <div v-else-if="name === 'Checkbox'" class="stack"><van-checkbox v-model="checked">选项</van-checkbox><van-checkbox :model-value="false" disabled>禁用</van-checkbox></div>
        <div v-else-if="name === 'Radio'" class="stack"><van-radio-group model-value="a"><van-radio name="a">选项 A</van-radio><van-radio name="b">选项 B</van-radio></van-radio-group></div>
        <div v-else-if="name === 'Switch'" class="inline"><van-switch /><van-switch disabled /></div>
        <div v-else-if="name === 'Slider'" class="stack"><van-slider v-model="slider" /><van-slider range :model-value="[20, 70]" /></div>
        <div v-else-if="name === 'Rating'" class="inline"><van-rate v-model="rate" /></div>
        <div v-else-if="['DatePicker', 'TimePicker', 'DateRangePicker', 'Calendar'].includes(name)" class="inline"><van-button plain @click="showPopup = true">打开{{ name }}</van-button></div>
        <div v-else-if="name === 'Upload'" class="inline"><van-uploader /></div>
        <div v-else-if="name === 'Table' || name === 'DataGrid' || name === 'Descriptions'" class="stack"><div class="data-row head"><span>字段</span><span>值</span></div><div class="data-row"><span>订单</span><span>ORD-2400</span></div></div>
        <div v-else-if="name === 'Card'" class="card">Card content</div>
        <div v-else-if="name === 'Badge'" class="inline"><van-badge content="12" /><van-badge dot /></div>
        <div v-else-if="name === 'Tag'" class="inline"><van-tag type="primary">primary</van-tag><van-tag type="success">success</van-tag><van-tag type="danger">danger</van-tag></div>
        <div v-else-if="name === 'Alert'" class="stack"><van-notice-bar type="primary" text="提示信息" /><van-notice-bar type="warning" text="注意信息" /></div>
        <div v-else-if="['Toast', 'Notification', 'Dialog', 'Drawer', 'Menu', 'Dropdown', 'Popover', 'ActionSheet', 'ShareSheet'].includes(name)" class="inline"><van-button type="primary" @click="trigger(name)">触发{{ name }}</van-button></div>
        <div v-else-if="name === 'Progress'" class="stack"><van-progress :percentage="62" /><van-circle :rate="62" /></div>
        <div v-else-if="name === 'Skeleton'" class="stack"><van-skeleton title :row="2" /></div>
        <div v-else-if="name === 'Spinner'" class="inline"><van-loading /><van-loading type="spinner" /></div>
        <div v-else-if="name === 'Result' || name === 'Empty'" class="stack"><van-empty description="暂无内容" /></div>
        <div v-else-if="name === 'Tabs'" class="stack"><van-tabs><van-tab title="标签一">内容一</van-tab><van-tab title="标签二">内容二</van-tab></van-tabs></div>
        <div v-else-if="name === 'Pagination'" class="stack"><van-pagination :model-value="1" :page-count="3" mode="simple" /></div>
        <div v-else-if="name === 'Steps'" class="stack"><van-steps :active="1"><van-step>步骤一</van-step><van-step>步骤二</van-step></van-steps></div>
        <div v-else-if="name === 'Anchor'" class="inline"><a href="#Button">跳转到 Button</a></div>
        <div v-else-if="name === 'Navbar'" class="stack"><van-nav-bar title="导航栏" left-arrow /></div>
        <div v-else-if="name === 'Sidebar'" class="stack"><van-sidebar :model-value="0"><van-sidebar-item title="项目一" /><van-sidebar-item title="项目二" /></van-sidebar></div>
        <div v-else-if="name === 'Grid'" class="stack"><van-grid :column-num="3"><van-grid-item icon="home" text="首页" /><van-grid-item icon="setting" text="设置" /><van-grid-item icon="chat-o" text="消息" /></van-grid></div>
        <div v-else-if="name === 'Stack'" class="inline"><van-space><van-button>一</van-button><van-button>二</van-button></van-space></div>
        <div v-else-if="name === 'Accordion'" class="stack"><van-collapse><van-collapse-item title="折叠面板" name="1">面板内容</van-collapse-item></van-collapse></div>
        <div v-else-if="name === 'ThemeProvider'" class="stack"><van-config-provider theme="dark"><div class="card dark-demo">Dark ConfigProvider</div></van-config-provider></div>
        <div v-else-if="name === 'Watermark'" class="watermark-demo">Acme Console</div>
        <div v-else-if="name === 'FloatButton'" class="inline"><van-floating-bubble axis="xy" icon="plus" /></div>
        <div v-else-if="name === 'BackTop'" class="muted">滚动页面后显示返回顶部按钮</div>
        <div v-else-if="name === 'Affix'" class="muted">Sticky 内容区域</div>
        <div v-else-if="name === 'Code'" class="code-demo">const console = "Acme"</div>
        <div v-else-if="name === 'Divider'"><van-divider>分隔线</van-divider></div>
        <div v-else-if="name === 'Link'"><a href="#Typography">链接</a></div>
        <div v-else class="muted">Vant {{ name }} 演示</div>
      </section>
    </div>
    <van-popup v-model:show="showPopup" position="bottom"><van-calendar /></van-popup>
    <van-back-top />
  </div>
</template>

<style scoped>
.dark-demo { background: #1d1d1f; color: #fff; }
.watermark-demo { min-height: 80px; display: grid; place-items: center; color: var(--van-text-color-2); background-image: repeating-linear-gradient(-30deg, transparent 0 30px, color-mix(in srgb, var(--van-text-color-2) 20%, transparent) 31px 32px); }
.code-demo { padding: 12px; border-radius: 8px; background: var(--van-background); font-family: monospace; }
</style>
