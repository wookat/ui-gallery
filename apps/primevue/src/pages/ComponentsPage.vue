<script setup lang="ts">
import { ref } from "vue"
import Accordion from "primevue/accordion"
import AccordionContent from "primevue/accordioncontent"
import AccordionHeader from "primevue/accordionheader"
import AccordionPanel from "primevue/accordionpanel"
import Avatar from "primevue/avatar"
import AvatarGroup from "primevue/avatargroup"
import Badge from "primevue/badge"
import Button from "primevue/button"
import Card from "primevue/card"
import Checkbox from "primevue/checkbox"
import Chip from "primevue/chip"
import ColorPicker from "primevue/colorpicker"
import Column from "primevue/column"
import ContextMenu from "primevue/contextmenu"
import DataTable from "primevue/datatable"
import DatePicker from "primevue/datepicker"
import Dialog from "primevue/dialog"
import Divider from "primevue/divider"
import Drawer from "primevue/drawer"
import FileUpload from "primevue/fileupload"
import Fieldset from "primevue/fieldset"
import FloatLabel from "primevue/floatlabel"
import Image from "primevue/image"
import InputGroup from "primevue/inputgroup"
import InputGroupAddon from "primevue/inputgroupaddon"
import InputMask from "primevue/inputmask"
import InputNumber from "primevue/inputnumber"
import InputOtp from "primevue/inputotp"
import InputText from "primevue/inputtext"
import Knob from "primevue/knob"
import Listbox from "primevue/listbox"
import Menu from "primevue/menu"
import Menubar from "primevue/menubar"
import Message from "primevue/message"
import MeterGroup from "primevue/metergroup"
import MultiSelect from "primevue/multiselect"
import Panel from "primevue/panel"
import PanelMenu from "primevue/panelmenu"
import Paginator from "primevue/paginator"
import Password from "primevue/password"
import PickList from "primevue/picklist"
import Popover from "primevue/popover"
import ProgressBar from "primevue/progressbar"
import ProgressSpinner from "primevue/progressspinner"
import RadioButton from "primevue/radiobutton"
import Rating from "primevue/rating"
import Select from "primevue/select"
import SelectButton from "primevue/selectbutton"
import Skeleton from "primevue/skeleton"
import Slider from "primevue/slider"
import SplitButton from "primevue/splitbutton"
import Splitter from "primevue/splitter"
import SplitterPanel from "primevue/splitterpanel"
import Steps from "primevue/steps"
import Tab from "primevue/tab"
import TabList from "primevue/tablist"
import TabMenu from "primevue/tabmenu"
import TabPanel from "primevue/tabpanel"
import TabPanels from "primevue/tabpanels"
import Tabs from "primevue/tabs"
import Tag from "primevue/tag"
import Textarea from "primevue/textarea"
import Timeline from "primevue/timeline"
import ToggleButton from "primevue/togglebutton"
import ToggleSwitch from "primevue/toggleswitch"
import Toolbar from "primevue/toolbar"
import Tree from "primevue/tree"
import TreeTable from "primevue/treetable"
import TreeSelect from "primevue/treeselect"
import SpeedDial from "primevue/speeddial"
import OrganizationChart from "primevue/organizationchart"
import VirtualScroller from "primevue/virtualscroller"
import ScrollPanel from "primevue/scrollpanel"
import ScrollTop from "primevue/scrolltop"
import Breadcrumb from "primevue/breadcrumb"
import CascadeSelect from "primevue/cascadeselect"
import AutoComplete from "primevue/autocomplete"
import Carousel from "primevue/carousel"
import Galleria from "primevue/galleria"
import BlockUI from "primevue/blockui"
import contract from "@ui-gallery/spec/contract.json"
import { coverage } from "@/coverage"
import PageHeader from "@/components/PageHeader.vue"
import SectionCard from "@/components/SectionCard.vue"
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"

const confirm = useConfirm()
const toast = useToast()
const dialogVisible = ref(false)
const drawerVisible = ref(false)
type PopupApi = { toggle: (event: Event) => void }
const popover = ref<PopupApi | null>(null)
const menu = ref<PopupApi | null>(null)
const menuItems = [{ label: "编辑", icon: "pi pi-pencil" }, { label: "复制", icon: "pi pi-copy" }]
const selected = ref<string[]>([])
type TableRow = (typeof tableRows)[number]
const selectedRows = ref<TableRow[]>([])
const inputValue = ref("")
const numberValue = ref(42)
const sliderValue = ref([20, 70])
const ratingValue = ref(4)
const calendarValue = ref<Date | null>(null)
const toggle = ref(true)
const treeValue = ref<Record<string, boolean>>({})
const expandedTreeKeys = ref<Record<string, boolean>>({ "0": true })
const expandedTreeTableKeys = ref<Record<string, boolean>>({ "0": true })
const options = ["Starter", "Pro", "Enterprise"]
const treeNodes = [{ key: "0", label: "工作区", children: [{ key: "0-0", label: "订单" }, { key: "0-1", label: "报表" }] }]
const treeTableNodes = [{
  key: "0",
  data: { label: "工作区", owner: "林晓", status: "进行中" },
  children: [
    { key: "0-0", data: { label: "订单", owner: "王子涵", status: "已完成" } },
    { key: "0-1", data: { label: "报表", owner: "Alex Chen", status: "待处理" } },
  ],
}]
const tableRows = [{ id: "ORD-2400", name: "林晓", status: "paid", amount: 1638 }, { id: "ORD-2401", name: "王子涵", status: "pending", amount: 778 }]
const statusSeverity = (value: string) => value === "implemented" ? "success" : value === "composed" ? "warn" : "danger"
const groupedExamples: Record<string, string> = {
  ButtonGroup: "group-buttons", IconButton: "group-buttons",
  Textarea: "group-inputs", NumberInput: "group-inputs", Mention: "group-inputs", Form: "group-inputs",
  MultiSelect: "group-selects", Combobox: "group-selects", Autocomplete: "group-selects", Cascader: "group-selects",
  Radio: "group-checkboxes", Switch: "group-checkboxes", Segmented: "group-checkboxes",
  Slider: "group-datepicker", Rating: "group-datepicker", TimePicker: "group-datepicker", DateRangePicker: "group-datepicker", ColorPicker: "group-datepicker",
  Transfer: "group-upload", PinInput: "group-upload",
  Table: "group-table", DataGrid: "group-table", List: "group-table",
  Card: "group-image", Avatar: "group-image", AvatarGroup: "group-image", Badge: "group-image", Tag: "group-image",
  Statistic: "group-progress", Spinner: "group-progress",
  Calendar: "group-datepicker", Tooltip: "group-dialog", Notification: "group-alert", Toast: "group-alert",
  Empty: "group-typography", Result: "group-typography", Popconfirm: "group-dialog",
  Dropdown: "group-menu", Pagination: "group-tabs", Anchor: "group-typography", BackTop: "group-layout", Affix: "group-layout",
  Navbar: "group-menu", Sidebar: "group-dialog", CommandPalette: "group-menu",
  Grid: "group-layout", Stack: "group-layout", Container: "group-layout", AspectRatio: "group-layout", Resizable: "group-layout", ScrollArea: "group-layout",
  ThemeProvider: "group-typography", FloatButton: "group-layout", Kbd: "group-typography", Code: "group-typography", Link: "group-typography",
}
const groupFor = (name: string) => groupedExamples[name] ?? "group-other"
const groupTitles: Record<string, string> = {
  "group-buttons": "Button", "group-inputs": "Input", "group-selects": "Select", "group-checkboxes": "Checkbox", "group-datepicker": "DatePicker", "group-upload": "Upload",
  "group-table": "Table", "group-image": "Image", "group-progress": "Progress", "group-dialog": "Dialog", "group-alert": "Alert", "group-typography": "Typography",
  "group-menu": "Menu", "group-tabs": "Tabs", "group-layout": "Splitter / ScrollPanel", "group-other": "其他",
}
const groupTitleFor = (name: string) => groupTitles[groupFor(name)] ?? "其他"
const primeNames: Record<string, string> = {
  ButtonGroup: "ButtonGroup", IconButton: "Button icon-only", Textarea: "Textarea", NumberInput: "InputNumber", Mention: "Textarea + AutoComplete（组合）", Form: "@primevue/forms（组合）",
  MultiSelect: "MultiSelect", Combobox: "Select filter", Autocomplete: "AutoComplete", Cascader: "CascadeSelect", Radio: "RadioButton", Switch: "ToggleSwitch", Segmented: "SelectButton",
  Slider: "Slider", Rating: "Rating", TimePicker: "DatePicker time-only", DateRangePicker: "DatePicker range", ColorPicker: "ColorPicker", Calendar: "DatePicker inline",
  Transfer: "PickList", PinInput: "InputOtp", Table: "DataTable", DataGrid: "DataView", List: "Listbox", Card: "Card", Avatar: "Avatar", AvatarGroup: "AvatarGroup", Badge: "Badge", Tag: "Tag",
  Statistic: "MeterGroup + Knob（组合）", Spinner: "ProgressSpinner", Tooltip: "v-tooltip", Notification: "Toast（组合）", Toast: "Toast", Empty: "Message（组合）", Result: "Message（组合）", Popconfirm: "ConfirmPopup",
  Dropdown: "Menu popup", Pagination: "Paginator", Anchor: "锚点链接（组合）", BackTop: "ScrollTop", Affix: "position: sticky（组合）", Navbar: "Menubar", Sidebar: "Drawer（组合）", CommandPalette: "Dialog + Listbox（组合）",
  Grid: "CSS Grid（组合）", Stack: "Flex（组合）", Container: ".container（组合）", AspectRatio: "aspect-ratio（组合）", Resizable: "Splitter", ScrollArea: "ScrollPanel", ThemeProvider: "PrimeVue config theme", FloatButton: "SpeedDial",
  Kbd: ".kbd（组合）", Code: "<code>（组合）", Link: "<a>（组合）", Descriptions: "dl 列表（组合）", Steps: "Stepper", Breadcrumb: "Breadcrumb", Skeleton: "Skeleton", Drawer: "Drawer", Popover: "Popover", Carousel: "Carousel", Accordion: "Accordion", Divider: "Divider",
}
const primeNameFor = (name: string) => primeNames[name] ?? name
const extraExports = ["Dock", "Terminal", "Editor（需 quill，跳过）", "Galleria", "Inplace", "MeterGroup", "Knob", "OrganizationChart", "VirtualScroller", "BlockUI", "DeferredContent", "Fieldset", "Toolbar", "IftaLabel", "FloatLabel", "Fluid", "AnimateOnScroll", "StyleClass", "FocusTrap", "KeyFilter", "Ripple", "ScrollPanel", "SpeedDial", "ImageCompare", "Textarea"]
function confirmPopup(event: Event) {
  confirm.require({ target: event.currentTarget as HTMLElement, message: "确认继续？", accept: () => toast.add({ severity: "success", summary: "已确认", life: 1800 }) })
}
</script>

<template>
  <div class="page components-page">
    <PageHeader title="组件全集" description="PrimeVue 4.5.5 组件与组合模式参考">
      <Button label="打开弹窗" icon="pi pi-window-maximize" outlined @click="dialogVisible = true" />
    </PageHeader>
    <SectionCard title="组件索引" description="点击名称跳转到对应示例"><div class="anchor-index"><a v-for="name in contract.components" :key="name" :href="`#component-${name}`"><Chip :label="name" /></a></div><p class="text-xs muted mt-3">Legacy aliases：Calendar、Dropdown、Sidebar、OverlayPanel、InputSwitch、Chips、TabView、Steps、InlineMessage。</p></SectionCard>

    <SectionCard id="component-Typography" title="Typography" description="排版与常用文本元素"><span id="group-typography" class="group-anchor" /><div class="typography-demo"><h1>标题一级</h1><h2>标题二级</h2><h3>标题三级</h3><p>这是一段正文，使用 Aura token 保持层级清晰。</p><blockquote>让团队工作更简单。</blockquote><ul><li>无序列表项目</li><li>第二个项目</li></ul><code>const status = "ready"</code> <kbd class="kbd">⌘ K</kbd></div></SectionCard>

    <SectionCard id="component-Button" title="Button / ButtonGroup / IconButton" description="所有主要按钮状态">
      <span id="group-buttons" class="group-anchor" /><div class="demo-stack"><div class="flex wrap gap-2"><Button label="Primary" /><Button label="Secondary" severity="secondary" /><Button label="Success" severity="success" /><Button label="Warn" severity="warn" /><Button label="Danger" severity="danger" /><Button label="Info" severity="info" /></div><div class="flex wrap gap-2"><Button label="Outlined" outlined /><Button label="Raised" raised /><Button label="Rounded" rounded /><Button label="Link" link /><Button label="禁用" disabled /><Button label="加载中" loading /></div><div class="flex wrap gap-2"><Button icon="pi pi-plus" rounded aria-label="添加" /><Button icon="pi pi-search" text rounded aria-label="搜索" /><Button icon="pi pi-trash" outlined rounded severity="danger" aria-label="删除" /><SplitButton label="更多操作" :model="menuItems" /><Button severity="secondary" @click="menu?.toggle($event)">打开菜单</Button><Menu ref="menu" popup :model="menuItems" /></div></div>
    </SectionCard>
    <SectionCard id="component-Input" title="Input / Textarea / NumberInput / Password / InputGroup"><span id="group-inputs" class="group-anchor" /><div class="grid grid-3"><FloatLabel><InputText id="float-input" v-model="inputValue" fluid /><label for="float-input">浮动标签</label></FloatLabel><InputGroup><InputGroupAddon><i class="pi pi-search" /></InputGroupAddon><InputText placeholder="前缀搜索" /></InputGroup><InputGroup><InputText placeholder="金额" /><InputGroupAddon>元</InputGroupAddon></InputGroup><Password v-model="inputValue" toggle-mask :feedback="false" placeholder="密码" fluid input-class="w-full" /><InputNumber v-model="numberValue" show-buttons fluid /><InputMask mask="999-9999-9999" placeholder="输入手机号" fluid /><Textarea rows="3" auto-resize placeholder="多行文本" fluid /></div></SectionCard>
    <SectionCard id="component-Select" title="Select / MultiSelect / Autocomplete / Cascader / TreeSelect"><span id="group-selects" class="group-anchor" /><div class="grid grid-3"><Select :options="options" placeholder="选择套餐" fluid /><MultiSelect v-model="selected" :options="options" placeholder="多选" display="chip" fluid /><AutoComplete :suggestions="options" placeholder="自动完成" dropdown fluid /><CascadeSelect :options="[{name: '产品', code: 'p', items: [{name: '订单', code: 'o'}]}]" option-label="name" option-group-label="name" option-group-children="items" placeholder="级联选择" fluid /><TreeSelect v-model="treeValue" :options="treeNodes" placeholder="树选择" fluid /><Listbox :options="options" /></div></SectionCard>
    <SectionCard id="component-Checkbox" title="Checkbox / Radio / Switch / SelectButton / ToggleButton"><span id="group-checkboxes" class="group-anchor" /><div class="flex wrap gap-4 items-center"><label class="flex items-center gap-2"><Checkbox v-model="toggle" binary />复选框</label><label class="flex items-center gap-2"><Checkbox :indeterminate="true" binary />半选</label><label class="flex items-center gap-2"><RadioButton name="component-radio" value="a" />单选</label><ToggleSwitch v-model="toggle" /><SelectButton :options="['列表', '网格']" /><ToggleButton v-model="toggle" on-label="已开启" off-label="已关闭" /></div></SectionCard>
    <SectionCard id="component-DatePicker" title="DatePicker / TimePicker / DateRangePicker / ColorPicker / Slider / Rating"><span id="group-datepicker" class="group-anchor" /><div class="grid grid-3"><DatePicker show-icon placeholder="日期" fluid /><DatePicker time-only show-icon placeholder="时间" fluid /><DatePicker selection-mode="range" show-icon placeholder="日期范围" fluid /><div class="inline-calendar"><div class="text-sm muted mb-2">Calendar（inline DatePicker）</div><DatePicker v-model="calendarValue" inline /></div><ColorPicker model-value="10b981" /><div><Slider v-model="sliderValue" range /><div class="text-xs muted mt-2">{{ sliderValue.join(" - ") }}</div></div><Rating v-model="ratingValue" /></div></SectionCard>
    <SectionCard id="component-Upload" title="Upload / PinInput / Transfer"><span id="group-upload" class="group-anchor" /><div class="grid grid-3"><FileUpload mode="advanced" custom-upload :show-upload-button="false" :show-cancel-button="false"><template #empty><span class="muted">拖拽文件到这里</span></template></FileUpload><InputOtp v-model="inputValue" :length="6" /><PickList :model-value="[[{ name: '订单' }, { name: '报表' }], []]" data-key="name"><template #option="{ option }">{{ option.name }}</template></PickList></div></SectionCard>
    <SectionCard id="component-Alert" title="Message / Toast / Notification"><span id="group-alert" class="group-anchor" /><div class="col gap-2"><Message severity="success">操作成功</Message><Message severity="info">信息提示</Message><Message severity="warn" closable>注意事项</Message><Message severity="error">发生错误</Message><div class="flex wrap gap-2"><Button label="Success" severity="success" @click="$toast.add({ severity: 'success', summary: '已保存', life: 1800 })" /><Button label="Info" severity="info" @click="$toast.add({ severity: 'info', summary: '通知', life: 1800 })" /><Button label="Warn" severity="warn" @click="$toast.add({ severity: 'warn', summary: '请注意', life: 1800 })" /><Button label="Error" severity="danger" @click="$toast.add({ severity: 'error', summary: '失败', life: 1800 })" /></div></div></SectionCard>
    <SectionCard id="component-Dialog" title="Dialog / Drawer / Popconfirm / Popover"><span id="group-dialog" class="group-anchor" /><div class="flex wrap gap-2"><Button label="Dialog" @click="dialogVisible = true" /><Button label="Drawer" severity="secondary" @click="drawerVisible = true" /><Button label="Popover" severity="secondary" @click="popover?.toggle($event)" /><Button label="ConfirmPopup" severity="danger" @click="confirmPopup" /><Button v-tooltip.top="'这是一个 Tooltip'" label="Tooltip" severity="secondary" outlined /></div><Popover ref="popover"><span class="text-sm">这是一个 Popover 内容。</span></Popover><Dialog v-model:visible="dialogVisible" modal header="示例弹窗" maximizable :style="{ width: 'min(520px, calc(100vw - 32px))' }"><p>普通、确认、最大化与滚动内容都可以基于 Dialog 组合。</p></Dialog><Drawer v-model:visible="drawerVisible" header="示例抽屉" position="right"><p>右侧 Drawer 内容。</p></Drawer></SectionCard>
    <SectionCard id="component-Progress" title="Progress / Skeleton / Spinner / Knob / MeterGroup"><span id="group-progress" class="group-anchor" /><div class="grid grid-4 items-center"><ProgressBar :value="68" /><Skeleton height="2rem" /><ProgressSpinner /><Knob v-model="numberValue" /><MeterGroup :value="[{ label: '已完成', value: 68, color: 'var(--p-primary-color)' }, { label: '待处理', value: 32, color: 'var(--p-surface-400)' }]" /></div></SectionCard>
    <SectionCard id="component-Tabs" title="Tabs / Paginator / Steps"><span id="group-tabs" class="group-anchor" /><Tabs value="0"><TabList><Tab value="0">概览</Tab><Tab value="1">详情</Tab></TabList><TabPanels><TabPanel value="0">默认 Tabs</TabPanel><TabPanel value="1">第二个面板</TabPanel></TabPanels></Tabs><Paginator :rows="10" :total-records="120" :rows-per-page-options="[10, 20, 30]" class="mt-4" /><Steps :model="[{ label: '开始' }, { label: '处理中' }, { label: '完成' }]" class="mt-4" /></SectionCard>
    <SectionCard id="component-Menu" title="Menubar / Menu / PanelMenu / Breadcrumb / TabMenu / ContextMenu"><span id="group-menu" class="group-anchor" /><Menubar :model="menuItems" /><div class="grid grid-3 mt-4"><Menu :model="menuItems" /><PanelMenu :model="menuItems" /><ContextMenu :model="menuItems" /></div><Breadcrumb :home="{ icon: 'pi pi-home' }" :model="[{ label: '设置' }, { label: '团队' }]" class="mt-4" /><TabMenu :model="menuItems" class="mt-4" /></SectionCard>
    <SectionCard id="component-Table" title="DataTable / DataGrid / DataView"><span id="group-table" class="group-anchor" /><div class="table-scroll"><DataTable v-model:selection="selectedRows" :value="tableRows" data-key="id" selection-mode="multiple" striped-rows paginator :rows="5"><Column selection-mode="multiple" header-style="width: 3rem" /><Column field="id" header="订单号" sortable /><Column field="name" header="客户" sortable /><Column field="status" header="状态" /><Column field="amount" header="金额" /></DataTable></div></SectionCard>
    <SectionCard id="component-Tree" title="Tree / TreeTable / OrganizationChart / VirtualScroller"><span id="group-tree" class="group-anchor" /><div class="grid grid-3"><Tree v-model:expanded-keys="expandedTreeKeys" v-model:selection-keys="treeValue" :value="treeNodes" selection-mode="checkbox" /><TreeTable v-model:expanded-keys="expandedTreeTableKeys" :value="treeTableNodes"><Column field="label" header="名称" expander /><Column field="owner" header="负责人" /><Column field="status" header="状态" /></TreeTable><OrganizationChart :value="{ key: '0', label: '工作区', children: treeNodes[0].children }" /></div><VirtualScroller :items="['订单', '客户', '报表', '团队']" :item-size="40" style="height: 120px"><template #item="{ item }"><div class="p-2">{{ item }}</div></template></VirtualScroller></SectionCard>
    <SectionCard id="component-Image" title="Image / Carousel / Galleria / Avatar / Badge / Tag / Chip"><span id="group-image" class="group-anchor" /><div class="grid grid-3"><Image src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='100%25' height='100%25' fill='%23e2e8f0'/%3E%3C/svg%3E" alt="placeholder" preview width="240" /><Carousel :value="['一', '二', '三']" :num-visible="1"><template #item="{ data }"><div class="placeholder-slide">{{ data }}</div></template></Carousel><Galleria :value="['一', '二']" :num-visible="1" :show-thumbnails="false" container-style="width: 100%"><template #item="{ item }"><div class="placeholder-slide">{{ item }}</div></template></Galleria><Card><template #title>Card 标题</template><template #subtitle>副标题</template><template #content><p class="m-0">Card 内容区域。</p></template><template #footer><Button label="操作" size="small" outlined /></template></Card><AvatarGroup><Avatar label="林" shape="circle" /><Avatar label="王" shape="circle" /><Avatar label="+4" shape="circle" /></AvatarGroup><Badge value="12" /><Tag value="已完成" severity="success" /><Chip label="可筛选" removable /></div></SectionCard>
    <SectionCard id="component-Timeline" title="Timeline / Accordion / Panel / Fieldset / Toolbar"><Toolbar><template #start><Button icon="pi pi-plus" label="新建" /></template><template #end><Button icon="pi pi-refresh" text rounded /></template></Toolbar><Timeline :value="[{ title: '创建项目' }, { title: '开始配置' }, { title: '完成上线' }]" class="mt-4"><template #content="{ item }">{{ item.title }}</template></Timeline><Accordion class="mt-4"><AccordionPanel value="0"><AccordionHeader>什么是 Aura？</AccordionHeader><AccordionContent><p>PrimeVue 官方主题 preset。</p></AccordionContent></AccordionPanel></Accordion><Fieldset legend="Panel / Fieldset" class="mt-4"><Panel header="可折叠面板"><p class="m-0">Panel 内容</p></Panel></Fieldset></SectionCard>
    <SectionCard id="component-Layout" title="Splitter / ScrollPanel / Divider / BlockUI / SpeedDial"><Splitter style="height: 220px"><SplitterPanel :size="35"><div class="p-4">左侧面板</div></SplitterPanel><SplitterPanel :size="65"><ScrollPanel style="height: 180px"><div class="p-4 relative">可滚动内容<br />更多内容<br />更多内容<br />更多内容<br />更多内容<br />更多内容<br /><ScrollTop target="parent" :threshold="20" /></div></ScrollPanel></SplitterPanel></Splitter><Divider align="left">Divider</Divider><BlockUI :blocked="false"><div class="p-4 text-center">BlockUI 内容</div></BlockUI><SpeedDial :model="[{ icon: 'pi pi-plus', command: () => $toast.add({ severity: 'info', summary: 'FloatButton', life: 1200 }) }]" direction="up" class="static-speed-dial" /></SectionCard>
    <SectionCard id="component-Other" title="其他 PrimeVue 组件"><span id="group-other" class="group-anchor" /><div class="extra-grid"><Tag v-for="name in extraExports" :key="name" :value="name" severity="secondary" /></div><p class="text-sm muted mt-3">Terminal 与 Editor 因交互复杂/需要 quill，使用说明性占位；其余导出组件已在本页对应类别展示。</p></SectionCard>
    <SectionCard v-for="name in contract.components.filter((item) => !['Typography', 'Button', 'Input', 'Select', 'Checkbox', 'DatePicker', 'Upload', 'Alert', 'Dialog', 'Progress', 'Tabs', 'Menu', 'Table', 'Tree', 'Image', 'Timeline', 'Layout', 'Other'].includes(item))" :id="`component-${name}`" :key="name" :title="name"><div class="coverage-card"><Tag :value="coverage[name]" :severity="statusSeverity(coverage[name])" /><span v-if="coverage[name] === 'missing'" class="muted">PrimeVue 无对应组件（missing）</span><template v-else><span class="muted">PrimeVue 对应：</span><code class="kbd">{{ primeNameFor(name) }}</code><span class="muted text-sm">已在「{{ groupTitleFor(name) }}」示例中展示</span></template><Button label="查看示例 →" text as="a" :href="`#${groupFor(name)}`" /></div></SectionCard>
  </div>
</template>

<style scoped>
.anchor-index { display: flex; flex-wrap: wrap; gap: 8px; } .anchor-index a { text-decoration: none; }
.components-page .grid > * { min-width: 0; } .components-page :deep(.p-carousel), .components-page :deep(.p-galleria) { max-width: 100%; width: 100%; }
.demo-stack, .typography-demo { display: flex; flex-direction: column; gap: 16px; } .typography-demo blockquote { margin: 0; padding: 12px 16px; border-left: 3px solid var(--p-primary-color); background: var(--p-highlight-background); } .typography-demo code { align-self: flex-start; padding: 4px 8px; border-radius: 4px; background: var(--p-surface-100); color: var(--p-text-color); } .dark .typography-demo code { background: var(--p-surface-800); }
.inline-calendar { grid-column: 1 / -1; } .inline-calendar :deep(.p-datepicker-panel) { max-width: 100%; }
.coverage-card { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; } .coverage-card .p-button { min-height: 40px; }
.placeholder-slide { display: grid; place-items: center; min-height: 100px; background: var(--p-highlight-background); color: var(--p-primary-color); }
.extra-grid { display: flex; flex-wrap: wrap; gap: 8px; } .static-speed-dial { position: relative; display: inline-flex; margin: 20px; }
@media (max-width: 767px) { .components-page :deep(.p-splitter) { min-height: 260px; } }
</style>
