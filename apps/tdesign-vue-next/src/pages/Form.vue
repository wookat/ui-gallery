<script setup lang="ts">
import { reactive, ref, useTemplateRef } from "vue"
import { MessagePlugin, type FormInstanceFunctions, type FormRules, type UploadFile } from "tdesign-vue-next"
import Icon from "@/components/Icon.vue"

const step = ref(0)
const submitting = ref(false)

const basic = reactive({
  name: "",
  seats: 5,
  email: "",
  countryCode: "+86",
  phone: "",
  description: "",
  plan: "team",
  modules: ["orders", "dashboard"],
  notify: true,
})
const basicRules: FormRules<typeof basic> = {
  name: [{ required: true, message: "请输入项目名称" }, { min: 2, max: 30, message: "2-30 个字符" }],
  seats: [{ required: true, message: "请输入席位数" }, { validator: (v) => Number(v) >= 1 && Number(v) <= 500, message: "范围 1-500" }],
  email: [{ required: true, message: "请输入邮箱" }, { email: true, message: "邮箱格式不正确" }],
  phone: [{ required: true, message: "请输入手机号" }, { pattern: /^\d{6,15}$/, message: "仅数字，6-15 位" }],
  description: [{ max: 200, message: "最多 200 字" }],
  plan: [{ required: true, message: "请选择计划" }],
  modules: [{ validator: (v) => (v as string[]).length > 0, message: "至少选择一个模块" }],
}

const advanced = reactive({
  region: "",
  tags: [] as string[],
  owner: "",
  startDate: "",
  dailyTime: "",
  range: [] as string[],
  sampling: [20, 80],
  rating: 4,
  color: "#0052d9",
  files: [] as UploadFile[],
  labels: ["beta"] as string[],
})
const advancedRules: FormRules<typeof advanced> = {
  region: [{ required: true, message: "请选择部署区域" }],
  tags: [{ validator: (v) => (v as string[]).length > 0, message: "至少选择一个标签" }],
  owner: [{ required: true, message: "请输入负责人" }],
  startDate: [{ required: true, message: "请选择开始日期" }],
  dailyTime: [{ required: true, message: "请选择每日时间" }],
  range: [{ validator: (v) => (v as string[]).length === 2, message: "请选择日期范围" }],
  rating: [{ validator: (v) => Number(v) >= 1, message: "请评分" }],
}

const agreed = ref(false)
const agreedError = ref(false)

const regionOptions = [
  { label: "华东（上海）", value: "cn-east" },
  { label: "华北（北京）", value: "cn-north" },
  { label: "新加坡", value: "ap-sg" },
  { label: "法兰克福", value: "eu-fra" },
]
const tagOptions = ["生产", "预发", "测试", "内部"].map((t) => ({ label: t, value: t }))
const ownerOptions = ["林晓", "王子涵", "Alex Chen", "Maria García"].map((t) => ({ text: t }))
const countryOptions = [
  { label: "+86 中国", value: "+86" },
  { label: "+1 美国", value: "+1" },
  { label: "+44 英国", value: "+44" },
  { label: "+81 日本", value: "+81" },
]

const basicForm = useTemplateRef<FormInstanceFunctions>("basicForm")
const advancedForm = useTemplateRef<FormInstanceFunctions>("advancedForm")

async function next() {
  const form = step.value === 0 ? basicForm.value : advancedForm.value
  const result = await form?.validate()
  if (result === true) step.value += 1
  else MessagePlugin.warning("请先修正表单中的错误")
}
async function submit() {
  if (!agreed.value) {
    agreedError.value = true
    return
  }
  submitting.value = true
  await new Promise((r) => setTimeout(r, 900))
  submitting.value = false
  step.value = 3
  MessagePlugin.success("项目已创建")
}
function reset() {
  basicForm.value?.reset()
  advancedForm.value?.reset()
  agreed.value = false
  step.value = 0
}
</script>

<template>
  <div class="ug-page ug-form-page">
    <div>
      <t-typography-title level="h4" class="ug-title">创建项目</t-typography-title>
      <span class="ug-muted">三步完成一个新的工作区配置。</span>
    </div>

    <t-card :bordered="true">
      <t-steps :current="step" :layout="'horizontal'" readonly class="ug-steps">
        <t-step-item title="基本信息" content="名称、联系方式与计划" />
        <t-step-item title="详细配置" content="区域、时间与资源" />
        <t-step-item title="确认提交" content="核对并同意条款" />
      </t-steps>
    </t-card>

    <t-card v-show="step === 0" :bordered="true" title="基本信息" subtitle="带 * 的为必填项">
      <t-form ref="basicForm" :data="basic" :rules="basicRules" label-align="top" :required-mark="true" @submit.prevent>
        <div class="ug-grid-2">
          <t-form-item label="项目名称" name="name" help="用于在控制台中展示">
            <t-input v-model="basic.name" placeholder="例如：增长分析" clearable />
          </t-form-item>
          <t-form-item label="席位数" name="seats">
            <t-input-number v-model="basic.seats" :min="1" :max="500" theme="column" style="width: 100%" />
          </t-form-item>
          <t-form-item label="联系邮箱" name="email">
            <t-input v-model="basic.email" placeholder="name@company.com"><template #prefix-icon><Icon name="mail" /></template></t-input>
          </t-form-item>
          <t-form-item label="联系电话" name="phone">
            <t-input-adornment>
              <template #prepend>
                <t-select v-model="basic.countryCode" :options="countryOptions" auto-width borderless />
              </template>
              <t-input v-model="basic.phone" placeholder="手机号" />
            </t-input-adornment>
          </t-form-item>
        </div>
        <t-form-item label="项目描述" name="description" help="最多 200 个字符">
          <t-textarea v-model="basic.description" placeholder="描述项目目标…" :maxlength="200" :autosize="{ minRows: 3, maxRows: 6 }" />
        </t-form-item>
        <t-form-item label="计划" name="plan">
          <t-radio-group v-model="basic.plan" variant="default-filled">
            <t-radio-button value="pro">Pro · 小型团队</t-radio-button>
            <t-radio-button value="team">Team · 协作团队</t-radio-button>
            <t-radio-button value="enterprise">Enterprise</t-radio-button>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="启用模块" name="modules">
          <t-checkbox-group v-model="basic.modules">
            <t-checkbox value="dashboard">仪表盘</t-checkbox>
            <t-checkbox value="orders">订单</t-checkbox>
            <t-checkbox value="chat">AI 助手</t-checkbox>
            <t-checkbox value="billing" disabled>计费（即将推出）</t-checkbox>
          </t-checkbox-group>
        </t-form-item>
        <t-form-item label="活动通知" name="notify" help="接收项目活动提醒">
          <t-switch v-model="basic.notify" size="large" :label="['开', '关']" />
        </t-form-item>
        <div class="ug-form-actions">
          <span />
          <t-button theme="primary" @click="next">下一步<template #suffix><Icon name="arrow-right" /></template></t-button>
        </div>
      </t-form>
    </t-card>

    <t-card v-show="step === 1" :bordered="true" title="详细配置" subtitle="部署区域、时间窗口与资源">
      <t-form ref="advancedForm" :data="advanced" :rules="advancedRules" label-align="top" :required-mark="true" @submit.prevent>
        <div class="ug-grid-2">
          <t-form-item label="部署区域" name="region">
            <t-select v-model="advanced.region" :options="regionOptions" placeholder="选择区域" filterable clearable />
          </t-form-item>
          <t-form-item label="环境标签（多选）" name="tags">
            <t-select v-model="advanced.tags" :options="tagOptions" placeholder="选择标签" multiple clearable :min-collapsed-num="2" />
          </t-form-item>
          <t-form-item name="owner">
            <template #label>负责人 <t-tooltip content="支持输入时自动补全成员姓名"><Icon name="info" class="ug-help-icon" /></t-tooltip></template>
            <t-auto-complete v-model="advanced.owner" :options="ownerOptions" placeholder="输入姓名自动补全" highlight-keyword filterable clearable />
          </t-form-item>
          <t-form-item label="开始日期" name="startDate">
            <t-date-picker v-model="advanced.startDate" placeholder="选择日期" clearable style="width: 100%" />
          </t-form-item>
          <t-form-item label="每日汇报时间" name="dailyTime">
            <t-time-picker v-model="advanced.dailyTime" format="HH:mm" placeholder="选择时间" clearable style="width: 100%" />
          </t-form-item>
          <t-form-item label="有效期" name="range">
            <t-date-range-picker v-model="advanced.range" placeholder="开始 / 结束" clearable style="width: 100%" />
          </t-form-item>
          <t-form-item label="采样比例（%）" name="sampling" help="拖动两端设置区间">
            <t-slider v-model="advanced.sampling" range :marks="{ 0: '0', 50: '50', 100: '100' }" />
          </t-form-item>
          <t-form-item label="优先级评分" name="rating">
            <t-rate v-model="advanced.rating" allow-half show-text />
          </t-form-item>
          <t-form-item label="主题色" name="color">
            <t-color-picker v-model="advanced.color" format="HEX" :show-primary-color-preview="false" />
          </t-form-item>
          <t-form-item label="自定义标签" name="labels" help="回车添加">
            <t-tag-input v-model="advanced.labels" placeholder="输入后回车" clearable />
          </t-form-item>
        </div>
        <t-form-item label="附件" name="files" help="支持拖拽上传，单个不超过 5MB">
          <t-upload v-model="advanced.files" theme="file-flow" draggable multiple :auto-upload="false" :size-limit="{ size: 5, unit: 'MB' }" placeholder="拖拽文件到此处或点击上传" />
        </t-form-item>
        <div class="ug-form-actions">
          <t-button variant="outline" @click="step = 0"><template #icon><Icon name="arrow-left" /></template>上一步</t-button>
          <t-button theme="primary" @click="next">下一步<template #suffix><Icon name="arrow-right" /></template></t-button>
        </div>
      </t-form>
    </t-card>

    <t-card v-show="step === 2" :bordered="true" title="确认提交" subtitle="核对以下信息">
      <t-descriptions :column="2" bordered item-layout="horizontal" size="small">
        <t-descriptions-item label="项目名称">{{ basic.name || "—" }}</t-descriptions-item>
        <t-descriptions-item label="席位数">{{ basic.seats }}</t-descriptions-item>
        <t-descriptions-item label="联系邮箱">{{ basic.email || "—" }}</t-descriptions-item>
        <t-descriptions-item label="联系电话">{{ basic.countryCode }} {{ basic.phone || "—" }}</t-descriptions-item>
        <t-descriptions-item label="计划">{{ basic.plan }}</t-descriptions-item>
        <t-descriptions-item label="模块">{{ basic.modules.join("、") || "—" }}</t-descriptions-item>
        <t-descriptions-item label="部署区域">{{ regionOptions.find((r) => r.value === advanced.region)?.label || "—" }}</t-descriptions-item>
        <t-descriptions-item label="标签">{{ advanced.tags.join("、") || "—" }}</t-descriptions-item>
        <t-descriptions-item label="负责人">{{ advanced.owner || "—" }}</t-descriptions-item>
        <t-descriptions-item label="开始日期">{{ advanced.startDate || "—" }}</t-descriptions-item>
        <t-descriptions-item label="采样">{{ advanced.sampling.join(" – ") }}%</t-descriptions-item>
        <t-descriptions-item label="附件">{{ advanced.files.length }} 个文件</t-descriptions-item>
      </t-descriptions>
      <t-progress :percentage="agreed ? 100 : 82" :label="true" class="ug-progress" />
      <div class="ug-agree" :class="{ 'ug-agree--error': agreedError }">
        <t-checkbox v-model="agreed" @change="agreedError = false">我已阅读并同意服务条款与隐私政策</t-checkbox>
        <div v-if="agreedError" class="ug-error-text">提交前请先同意条款</div>
      </div>
      <div class="ug-form-actions">
        <t-button variant="outline" @click="step = 1"><template #icon><Icon name="arrow-left" /></template>上一步</t-button>
        <t-button theme="primary" :loading="submitting" @click="submit"><template #icon><Icon name="check" /></template>提交项目</t-button>
      </div>
    </t-card>

    <t-card v-show="step === 3" :bordered="true">
      <div class="ug-result">
        <div class="ug-result-icon"><Icon name="check-circle" :size="40" /></div>
        <t-typography-title level="h5" class="ug-title">项目创建成功</t-typography-title>
        <p class="ug-muted">工作区已准备就绪，可以邀请成员开始协作。</p>
        <t-space>
          <t-button theme="primary">进入项目</t-button>
          <t-button variant="outline" @click="reset">再创建一个</t-button>
        </t-space>
      </div>
    </t-card>
  </div>
</template>

<style>
.ug-form-page .t-form__item { margin-bottom: 20px; }
.ug-steps { overflow-x: auto; }
.ug-form-actions { display: flex; justify-content: space-between; gap: 8px; margin-top: 8px; }
.ug-help-icon { vertical-align: -2px; margin-left: 4px; color: var(--td-text-color-placeholder); }
.ug-progress { margin: 20px 0; }
.ug-agree { padding: 12px; border: 1px solid var(--td-component-stroke); border-radius: var(--td-radius-medium); }
.ug-agree--error { border-color: var(--td-error-color); }
.ug-result { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; padding: 32px 0; }
.ug-result-icon { color: var(--td-success-color); }
.ug-error-text { color: var(--td-error-color); font-size: 12px; margin-top: 4px; }
@media (max-width: 767px) {
  .ug-steps .t-steps { min-width: 520px; }
}
</style>
