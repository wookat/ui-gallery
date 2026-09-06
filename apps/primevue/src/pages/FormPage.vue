<script setup lang="ts">
import { computed, ref } from "vue"
import AutoComplete from "primevue/autocomplete"
import Button from "primevue/button"
import Card from "primevue/card"
import Checkbox from "primevue/checkbox"
import ColorPicker from "primevue/colorpicker"
import DatePicker from "primevue/datepicker"
import FileUpload from "primevue/fileupload"
import InputGroup from "primevue/inputgroup"
import InputMask from "primevue/inputmask"
import InputNumber from "primevue/inputnumber"
import InputText from "primevue/inputtext"
import Message from "primevue/message"
import RadioButton from "primevue/radiobutton"
import Rating from "primevue/rating"
import Select from "primevue/select"
import Slider from "primevue/slider"
import Stepper from "primevue/stepper"
import StepList from "primevue/steplist"
import Step from "primevue/step"
import StepPanels from "primevue/steppanels"
import StepPanel from "primevue/steppanel"
import Textarea from "primevue/textarea"
import ToggleSwitch from "primevue/toggleswitch"
import AppIcon from "@/icons/AppIcon.vue"
import PageHeader from "@/components/PageHeader.vue"
import team from "@ui-gallery/spec/mock/team.json"

const step = ref("1")
const submitted = ref(false)
const submitting = ref(false)
const attempted = ref(false)
const project = ref({ name: "", budget: null as number | null, email: "", country: "+86", phone: "", description: "", type: "web", features: [] as string[], active: true })
const config = ref({ plan: "Pro", tags: [] as string[], date: null as Date | null, time: null as Date | null, range: null as Date[] | null, slider: [20, 80], rating: 4, color: "10b981", files: [] as unknown[] })
const suggestions = ref<string[]>([])
const planOptions = ["Starter", "Pro", "Enterprise"]
const featureOptions = ["数据分析", "团队协作", "AI 助手", "自动化"]
const countryCodes = ["+86", "+1", "+81", "+44"]
const tagSuggestions = ["增长", "运营", "财务", "产品", "研发"]
const names = team.map((person) => person.name)
const validStepOne = computed(() => !!project.value.name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(project.value.email) && project.value.phone.length >= 10 && (project.value.budget ?? 0) >= 0)
const errors = computed(() => ({
  name: attempted.value && !project.value.name ? "请输入项目名称" : "",
  email: attempted.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(project.value.email) ? "请输入有效邮箱" : "",
  phone: attempted.value && project.value.phone.length < 10 ? "请输入完整手机号" : "",
  budget: attempted.value && (project.value.budget ?? 0) < 0 ? "预算不能小于 0" : "",
}))
function filterNames(event: { query: string }) { suggestions.value = names.filter((name) => name.toLowerCase().includes(event.query.toLowerCase())) }
function handleUpload(event: { files: File | File[] }) { config.value.files = Array.isArray(event.files) ? event.files : [event.files] }
function next() { attempted.value = true; if (step.value === "1" && !validStepOne.value) return; step.value = String(Math.min(3, Number(step.value) + 1)) }
function previous() { step.value = String(Math.max(1, Number(step.value) - 1)) }
function submit() { submitting.value = true; window.setTimeout(() => { submitting.value = false; submitted.value = true }, 800) }
function reset() { submitted.value = false; attempted.value = false; step.value = "1" }
</script>

<template>
  <div class="page">
    <PageHeader title="新建项目" description="用三步完成项目配置" />
    <Message severity="warn" icon="pi pi-info-circle">带 * 为必填项，完成基本信息后才能继续。</Message>
    <Card v-if="submitted"><template #content><div class="success-view"><i class="pi pi-check-circle" /><h2>项目创建成功</h2><p class="muted">你的项目已经准备就绪。</p><Button label="返回表单" outlined @click="reset" /></div></template></Card>
    <Stepper v-else v-model:value="step">
      <StepList><Step value="1">基本信息</Step><Step value="2">详细配置</Step><Step value="3">确认</Step></StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" value="1">
          <div class="form-grid">
            <div class="field"><label for="project-name">项目名称 <b>*</b></label><InputText id="project-name" v-model="project.name" :invalid="!!errors.name" fluid /><Message v-if="errors.name" severity="error" size="small" variant="simple">{{ errors.name }}</Message></div>
            <div class="field"><label for="budget">预算</label><InputNumber id="budget" v-model="project.budget" mode="currency" currency="CNY" locale="zh-CN" :invalid="!!errors.budget" fluid /><Message v-if="errors.budget" severity="error" size="small" variant="simple">{{ errors.budget }}</Message></div>
            <div class="field"><label for="form-email">邮箱 <b>*</b> <i v-tooltip.top="'用于接收项目通知'" class="pi pi-question-circle muted" /></label><InputText id="form-email" v-model="project.email" type="email" :invalid="!!errors.email" fluid /><Message v-if="errors.email" severity="error" size="small" variant="simple">{{ errors.email }}</Message><small class="muted">请输入工作邮箱。</small></div>
            <div class="field"><label for="form-phone">手机号 <b>*</b></label><InputGroup><Select v-model="project.country" :options="countryCodes" /><InputMask id="form-phone" v-model="project.phone" mask="999 9999 9999" placeholder="138 0000 0000" :invalid="!!errors.phone" fluid /></InputGroup><Message v-if="errors.phone" severity="error" size="small" variant="simple">{{ errors.phone }}</Message></div>
            <div class="field span-2"><label for="description">项目描述</label><Textarea id="description" v-model="project.description" maxlength="200" rows="4" auto-resize fluid /><div class="text-xs muted text-right">{{ project.description.length }}/200</div></div>
            <div class="field"><label>项目类型</label><div class="flex wrap gap-3 mt-1"><label v-for="item in ['web', 'mobile', 'api']" :key="item" class="flex items-center gap-2"><RadioButton v-model="project.type" :input-id="`type-${item}`" name="type" :value="item" /><span>{{ item.toUpperCase() }}</span></label></div></div>
            <div class="field"><label>能力模块</label><div class="flex wrap gap-3 mt-1"><label v-for="item in featureOptions" :key="item" class="flex items-center gap-2"><Checkbox v-model="project.features" :input-id="`feature-${item}`" :value="item" /><span>{{ item }}</span></label></div></div>
            <div class="field"><label class="flex items-center gap-2"><ToggleSwitch v-model="project.active" />立即启用项目</label></div>
          </div>
          <div class="flex justify-end mt-6"><Button label="下一步" icon="pi pi-arrow-right" icon-pos="right" @click="next(); activateCallback('2')" /></div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="2">
          <div class="form-grid">
            <div class="field"><label>套餐</label><Select v-model="config.plan" :options="planOptions" fluid /></div>
            <div class="field"><label>标签</label><AutoComplete v-model="config.tags" multiple :typeahead="false" :suggestions="tagSuggestions" fluid /></div>
            <div class="field"><label>负责人</label><AutoComplete v-model="suggestions" :suggestions="suggestions" dropdown @complete="filterNames" fluid /></div>
            <div class="field"><label>上线日期</label><DatePicker v-model="config.date" show-icon fluid /></div>
            <div class="field"><label>提醒时间</label><DatePicker v-model="config.time" time-only show-icon fluid /></div>
            <div class="field"><label>日期范围</label><DatePicker v-model="config.range" selection-mode="range" show-icon fluid /></div>
            <div class="field span-2"><label>预算区间</label><Slider v-model="config.slider" range class="mt-3" /><div class="flex justify-between text-xs muted mt-2"><span>¥{{ config.slider[0] }}k</span><span>¥{{ config.slider[1] }}k</span></div></div>
            <div class="field"><label>优先级</label><Rating v-model="config.rating" /></div>
            <div class="field"><label>主题颜色</label><ColorPicker v-model="config.color" /></div>
            <div class="field span-2"><label>附件</label><FileUpload mode="advanced" custom-upload :multiple="true" accept="image/*,.pdf" :show-upload-button="false" :show-cancel-button="false" @uploader="handleUpload"><template #empty><div class="upload-empty"><AppIcon name="upload" :size="20" />拖拽文件到这里，或点击选择</div></template></FileUpload></div>
          </div>
          <div class="flex justify-between mt-6"><Button label="上一步" severity="secondary" outlined @click="previous(); activateCallback('1')" /><Button label="下一步" icon="pi pi-arrow-right" icon-pos="right" @click="step = '3'; activateCallback('3')" /></div>
        </StepPanel>
        <StepPanel value="3">
          <div class="summary"><h2 class="text-lg font-semibold">确认项目配置</h2><dl><div><dt>项目名称</dt><dd>{{ project.name || "未填写" }}</dd></div><div><dt>邮箱</dt><dd>{{ project.email || "未填写" }}</dd></div><div><dt>套餐</dt><dd>{{ config.plan }}</dd></div><div><dt>上线日期</dt><dd>{{ config.date ? config.date.toLocaleDateString() : "未选择" }}</dd></div><div><dt>项目类型</dt><dd>{{ project.type.toUpperCase() }}</dd></div></dl></div>
          <div class="flex items-center gap-2 mt-6"><Checkbox v-model="project.active" input-id="agree" binary /><label for="agree">我同意服务条款与数据处理说明</label></div>
          <div class="flex justify-between mt-6"><Button label="上一步" severity="secondary" outlined @click="previous" /><Button label="提交项目" icon="pi pi-check" :loading="submitting" :disabled="!project.active" @click="submit" /></div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>

<style scoped>
.page :deep(.p-step-header) { min-height: 40px; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.field b { color: var(--p-red-500); }
.span-2 { grid-column: span 2; }
.upload-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px; color: var(--p-text-muted-color); }
.summary dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin: 20px 0 0; }
.summary dl > div { padding: 12px; border: 1px solid var(--p-content-border-color); border-radius: var(--p-content-border-radius); }
.summary dt { color: var(--p-text-muted-color); font-size: 12px; } .summary dd { margin: 4px 0 0; }
.success-view { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; padding: 48px 16px; }
.success-view > i { font-size: 3rem; color: var(--p-green-500); }
@media (max-width: 767px) { .form-grid, .summary dl { grid-template-columns: minmax(0, 1fr); } .span-2 { grid-column: auto; } }
</style>
