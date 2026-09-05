<script setup lang="ts">
import { ref } from "vue"
import team from "@ui-gallery/spec/mock/team.json"
import AppIcon from "../../icons/AppIcon.vue"
import DemoBlock from "./DemoBlock.vue"

const names = [
  "QInput", "QField", "QFile", "QSelect", "QOptionGroup", "QCheckbox", "QRadio", "QToggle",
  "QSlider", "QRange", "QRating", "QKnob", "QDate", "QTime", "QColor", "QUploader", "QEditor",
  "QPopupEdit", "QForm", "Cascader", "Transfer", "Mention", "PinInput",
]
const text = ref("")
const select = ref("one")
const multi = ref(["one"])
const radio = ref("a")
const checked = ref(["a"])
const toggled = ref(true)
const toggleGroup = ref<string[]>([])
const slider = ref(42)
const range = ref({ min: 20, max: 70 })
const rating = ref(4)
const knob = ref(62)
const date = ref("2026/01/15")
const time = ref("10:30")
const dateRange = ref({ from: "2026/01/01", to: "2026/01/15" })
const color = ref("#1976D2")
const editor = ref("<p>编辑器内容</p>")
const file = ref(null)
const form = ref()
const pin = ref(["", "", "", "", "", ""])
const province = ref("华东")
const city = ref("上海")
const district = ref("浦东")
const transfer = ref(team.slice(0, 2).map((member) => member.name))
const mention = ref("@")
const options = ["one", "two", "three"]
const aliases: Record<string, string[]> = {
  QInput: ["Input", "Textarea", "NumberInput"],
  QSelect: ["Select", "MultiSelect", "Combobox", "Autocomplete"],
  QDate: ["DatePicker", "DateRangePicker", "QPopupProxy"],
  QTime: ["TimePicker"],
  QColor: ["ColorPicker"],
  QUploader: ["Upload"],
  QCheckbox: ["Checkbox"],
  QRadio: ["Radio"],
  QToggle: ["Switch"],
  QSlider: ["Slider"],
  QRating: ["Rating"],
  QForm: ["Form"],
}

function validate() {
  void form.value?.validate()
}
</script>

<template>
  <DemoBlock v-for="name in names" :id="name" :ids="aliases[name]" :key="name" :title="name">
    <template v-if="name === 'QInput'">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6"><q-input v-model="text" label="默认输入" hint="请输入内容" counter maxlength="40" clearable /></div>
        <div class="col-12 col-sm-6"><q-input v-model="text" filled label="Filled" prefix="¥" suffix="元" /></div>
        <div class="col-12 col-sm-6"><q-input v-model="text" outlined rounded label="Outlined rounded" /><q-input v-model="text" dense outlined class="q-mt-sm" label="Dense" /></div>
        <div class="col-12 col-sm-6"><q-input model-value="只读内容" readonly label="Readonly" /><q-input model-value="禁用内容" disable label="Disable" class="q-mt-sm" /><q-input model-value="" error error-message="这里有一个错误" label="Error" class="q-mt-sm" /></div>
        <div class="col-12 col-sm-6"><q-input model-value="" loading label="Loading" /><q-input v-model="text" type="search" label="Search" class="q-mt-sm"><template #prepend><AppIcon name="search" /></template></q-input></div>
        <div class="col-12 col-sm-6"><q-input v-model="slider" type="number" label="Number" /><q-input v-model="text" type="password" label="Password"><template #append><AppIcon name="eye-off" /></template></q-input></div>
        <div class="col-12"><q-input v-model="text" type="textarea" autogrow label="Textarea autogrow" /><q-input v-model="text" mask="####-####" label="Mask ####-####" class="q-mt-sm" /></div>
      </div>
      <div class="text-caption text-grey-7 q-mt-sm">rules 示例会在提交表单时显示行内校验结果。</div>
    </template>
    <template v-else-if="name === 'QField'">
      <q-field outlined label="自定义字段" hint="QField 可包裹任意控制器"><template #control><div class="self-center full-width no-outline">自定义内容</div></template></q-field>
    </template>
    <template v-else-if="name === 'QFile'">
      <q-file v-model="file" outlined label="单文件" clearable />
      <q-file v-model="file" outlined multiple use-chips label="多文件 + chips" class="q-mt-md" />
    </template>
    <template v-else-if="name === 'QSelect'">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-4"><q-select v-model="select" outlined :options="options" label="Select" clearable /></div>
        <div class="col-12 col-sm-4"><q-select v-model="multi" outlined multiple use-chips :options="options" label="MultiSelect" /></div>
        <div class="col-12 col-sm-4"><q-select v-model="select" outlined use-input :options="options" label="Combobox / Autocomplete" /></div>
        <div class="col-12 col-sm-4"><q-select v-model="multi" outlined multiple use-chips new-value-mode="add-unique" use-input label="Tag input" /></div>
        <div class="col-12 col-sm-4"><q-select v-model="select" outlined :options="[{ label: '显示一', value: 'one' }]" emit-value map-options label="Map options" /></div>
        <div class="col-12 col-sm-4"><q-select model-value="禁用" outlined disable label="Disable" /></div>
        <div class="col-12 col-sm-4"><q-select model-value="错误" outlined error error-message="请选择有效选项" label="Error" /></div>
        <div class="col-12 col-sm-4"><q-select model-value="加载中" outlined loading label="Loading" /></div>
        <div class="col-12 col-sm-4"><q-select v-model="multi" outlined multiple use-chips options-dense :options="options" label="Options dense" /></div>
      </div>
    </template>
    <template v-else-if="name === 'QOptionGroup'">
      <q-option-group v-model="radio" :options="[{ label: '选项 A', value: 'a' }, { label: '选项 B', value: 'b' }]" type="radio" inline />
      <q-option-group v-model="checked" :options="[{ label: '选项 A', value: 'a' }, { label: '选项 B', value: 'b' }]" type="checkbox" inline left-label class="q-mt-md" />
      <q-option-group v-model="toggleGroup" :options="[{ label: '启用', value: 'enabled' }]" type="toggle" class="q-mt-md" />
    </template>
    <template v-else-if="name === 'QCheckbox'">
      <div class="row q-gutter-md items-center"><q-checkbox v-model="checked" val="a" label="默认" /><q-checkbox v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" :model-value="true" :size="size" :label="size" /><q-checkbox :model-value="true" keep-color color="positive" label="Keep color" /><q-checkbox :model-value="false" toggle-indeterminate indeterminate-value="maybe" label="Indeterminate" disable /></div>
    </template>
    <template v-else-if="name === 'QRadio'">
      <div class="row q-gutter-md"><q-radio v-model="radio" val="a" label="Primary" /><q-radio v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" v-model="radio" val="b" color="secondary" :size="size" :label="size" /><q-radio v-model="radio" val="c" disable label="Disable" /></div>
    </template>
    <template v-else-if="name === 'QToggle'">
      <div class="row q-gutter-md items-center"><q-toggle v-model="toggled" label="开关" /><q-toggle v-model="toggled" color="positive" checked-icon="check" unchecked-icon="close" label="带图标" /><q-toggle v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" :model-value="true" :size="size" :label="size" /></div>
    </template>
    <template v-else-if="name === 'QSlider'">
      <q-slider v-model="slider" label label-always markers :step="10" color="primary" /><q-slider v-model="slider" vertical reverse style="height: 110px" class="q-mt-md" color="secondary" />
    </template>
    <template v-else-if="name === 'QRange'">
      <q-range v-model="range" label label-always markers drag-range color="primary" /><q-range v-model="range" disable class="q-mt-lg" />
    </template>
    <template v-else-if="name === 'QRating'">
      <q-rating v-model="rating" size="2.5em" color="orange" icon="star_border" icon-selected="star" /><q-rating v-model="rating" :max="10" color="purple" icon="favorite_border" icon-selected="favorite" class="q-ml-lg" />
      <div class="text-caption text-grey-7 q-mt-sm">QRating 使用 Quasar 要求的 Material 字符串图标。</div>
    </template>
    <template v-else-if="name === 'QKnob'">
      <q-knob v-model="knob" size="72px" color="primary" track-color="grey-3" class="text-primary q-ma-md" />
      <q-knob v-model="knob" show-value size="72px" :thickness="0.22" color="primary" track-color="grey-3" class="text-primary q-ma-md"><span>{{ knob }}</span></q-knob>
      <q-knob v-model="knob" disable show-value size="72px" color="secondary" track-color="grey-3" class="q-ma-md" />
    </template>
    <template v-else-if="name === 'QDate'">
      <div class="row q-col-gutter-md"><div class="col-12 col-sm-6"><q-date v-model="date" mask="YYYY/MM/DD" today-btn minimal /></div><div class="col-12 col-sm-6"><q-date v-model="dateRange" range mask="YYYY/MM/DD" /></div></div>
      <q-input v-model="date" outlined label="QInput + QPopupProxy"><template #append><q-popup-proxy cover transition-show="scale" transition-hide="scale"><q-date v-model="date" mask="YYYY/MM/DD" /></q-popup-proxy></template></q-input>
      <q-btn outline color="primary" label="打开 QPopupProxy" class="q-mt-md"><q-popup-proxy><q-banner class="bg-primary text-white">QPopupProxy 内容</q-banner></q-popup-proxy></q-btn>
    </template>
    <template v-else-if="name === 'QTime'">
      <div class="row q-col-gutter-md"><div class="col-12 col-sm-6"><q-time v-model="time" format24h now-btn /></div><div class="col-12 col-sm-6"><q-time v-model="time" with-seconds landscape /></div></div>
    </template>
    <template v-else-if="name === 'QColor'">
      <div class="row items-center q-gutter-md"><q-color v-model="color" default-view="palette" /><q-input v-model="color" outlined label="Color value" style="max-width: 220px" /></div>
    </template>
    <template v-else-if="name === 'QUploader'">
      <q-uploader url="" multiple bordered hide-upload-btn label="拖拽或选择文件" color="primary" style="max-width: 360px"><template #list><q-list bordered><q-item><q-item-section><q-uploader-add-trigger id="q-uploader-add-trigger"><q-btn flat color="primary" label="添加文件" /></q-uploader-add-trigger></q-item-section></q-item></q-list></template></q-uploader>
    </template>
    <template v-else-if="name === 'QEditor'">
      <q-editor v-model="editor" min-height="6rem" toolbar-toggle-color="primary" dense /><div class="text-caption text-grey-7 q-mt-sm">支持工具栏、紧凑模式和自定义 min-height。</div>
    </template>
    <template v-else-if="name === 'QPopupEdit'">
      <q-markup-table flat bordered><tbody><tr><td>状态</td><td><q-popup-edit v-model="text" buttons v-slot="scope"><q-input v-model="scope.value" dense autofocus /></q-popup-edit>{{ text || "点击此处编辑" }}</td></tr></tbody></q-markup-table>
    </template>
    <template v-else-if="name === 'QForm'">
      <q-form ref="form" class="q-gutter-md" @submit.prevent="validate"><q-input v-model="text" outlined label="必填字段" :rules="[(value) => Boolean(value) || '请输入内容']" /><div class="row q-gutter-sm"><q-btn type="submit" color="primary" label="验证" /><q-btn type="reset" flat label="重置" /></div></q-form>
    </template>
    <template v-else-if="name === 'Cascader'">
      <div class="row q-col-gutter-sm"><q-select v-model="province" class="col" outlined label="省" :options="['华东', '华北']" /><q-select v-model="city" class="col" outlined label="市" :options="['上海', '北京']" /><q-select v-model="district" class="col" outlined label="区" :options="['浦东', '朝阳']" /></div>
    </template>
    <template v-else-if="name === 'Transfer'">
      <div class="row items-center justify-center q-col-gutter-md"><q-list bordered class="col-5"><q-item v-for="member in team.slice(0, 3)" :key="member.name"><q-item-section avatar><q-checkbox v-model="transfer" :val="member.name" /></q-item-section><q-item-section>{{ member.name }}</q-item-section></q-item></q-list><div class="column q-gutter-sm"><q-btn round outline icon="chevron_right" /><q-btn round outline icon="chevron_left" /></div><q-list bordered class="col-5"><q-item v-for="member in transfer" :key="member"><q-item-section>{{ member }}</q-item-section></q-item></q-list></div>
    </template>
    <template v-else-if="name === 'Mention'">
      <q-input v-model="mention" outlined label="Mention"><q-menu v-if="mention.endsWith('@')" fit><q-list><q-item v-for="member in team" :key="member.name" clickable @click="mention += member.name"><q-item-section>{{ member.name }}</q-item-section></q-item></q-list></q-menu></q-input>
    </template>
    <template v-else>
      <div class="row q-gutter-xs"><q-input v-for="(_, index) in pin" :key="index" v-model="pin[index]" dense outlined maxlength="1" style="width: 42px" /></div>
      <div class="text-caption text-grey-7 q-mt-sm">六位数字输入框会在真实实现中自动前进。</div>
    </template>
  </DemoBlock>
</template>
