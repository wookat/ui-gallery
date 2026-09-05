<script setup lang="ts">
import { ref } from "vue"
import { NCard, NSteps, NStep, NForm, NFormItem, NInput, NInputNumber, NSelect, NRadioGroup, NRadio, NCheckboxGroup, NCheckbox, NSwitch, NDatePicker, NTimePicker, NSlider, NRate, NColorPicker, NUpload, NUploadDragger, NDynamicTags, NTooltip, NButton, NFlex, NDescriptions, NDescriptionsItem, NResult, NSpace, NText, NAutoComplete, NInputGroup, NGrid, NFormItemGi, useThemeVars, type FormInst, type FormRules, type UploadFileInfo } from "naive-ui"
import PageHeader from "../components/PageHeader.vue"
import { Icon } from "../icons"
import { useIsMobile } from "../composables"

const isMobile = useIsMobile()
const themeVars = useThemeVars()
const current = ref(1)
const done = ref(false)
const form1 = ref<FormInst | null>(null)
const form2 = ref<FormInst | null>(null)
const form3 = ref<FormInst | null>(null)
const submitting = ref(false)

const basic = ref({ name: "", seats: 5 as number | null, email: "", country: "+86", phone: "", desc: "", type: "internal", modules: ["orders"], public: false })
const detail = ref({ region: null as string | null, tags: [] as string[], owner: "", start: null as number | null, time: null as number | null, window: null as [number, number] | null, budget: [20, 60] as [number, number], priority: 3, color: themeVars.value.primaryColor, files: [] as UploadFileInfo[], labels: ["v1"] })
const confirm = ref({ agree: false })

const basicRules: FormRules = {
  name: [{ required: true, message: "请输入项目名称", trigger: "blur" }, { min: 2, max: 20, message: "2–20 个字符", trigger: "blur" }],
  seats: [{ type: "number", required: true, min: 1, max: 500, message: "席位需在 1–500 之间", trigger: ["blur", "change"] }],
  email: [{ required: true, type: "email", message: "请输入有效邮箱", trigger: "blur" }],
  phone: [{ required: true, pattern: /^\d{6,15}$/, message: "请输入 6–15 位数字", trigger: "blur" }],
  desc: [{ required: true, message: "请填写项目描述", trigger: "blur" }],
  modules: [{ type: "array", min: 1, message: "至少选择一个模块", trigger: "change" }],
}
const detailRules: FormRules = {
  region: [{ required: true, message: "请选择区域", trigger: "change" }],
  tags: [{ type: "array", min: 1, message: "至少选择一个标签", trigger: "change" }],
  owner: [{ required: true, message: "请填写负责人", trigger: "blur" }],
  start: [{ type: "number", required: true, message: "请选择开始日期", trigger: "change" }],
  time: [{ type: "number", required: true, message: "请选择时间", trigger: "change" }],
}
const confirmRules: FormRules = { agree: [{ validator: (_r, v: boolean) => v, message: "请先同意服务条款", trigger: "change" }] }

const regions = ["中国大陆", "新加坡", "法兰克福"].map((v) => ({ label: v, value: v }))
const tagOptions = ["SaaS", "电商", "内部工具", "数据分析", "AI"].map((v) => ({ label: v, value: v }))
const owners = ["林晓", "王子涵", "Alex Chen", "Maria García", "陈思远", "Sophie Martin"]
const ownerOptions = (q: string) => owners.filter((o) => o.toLowerCase().includes(q.toLowerCase())).map((o) => ({ label: o, value: o }))
const countries = [{ label: "+86 中国", value: "+86" }, { label: "+1 美国", value: "+1" }, { label: "+81 日本", value: "+81" }, { label: "+65 新加坡", value: "+65" }]

async function next() {
  const form = current.value === 1 ? form1.value : current.value === 2 ? form2.value : form3.value
  try { await form?.validate() } catch { return }
  if (current.value < 3) { current.value += 1; return }
  submitting.value = true
  setTimeout(() => { submitting.value = false; done.value = true }, 900)
}
function fmt(ts: number | null) { return ts ? new Date(ts).toLocaleDateString("zh-CN") : "—" }
</script>

<template>
  <NSpace vertical :size="20">
    <PageHeader title="新建项目" description="三步完成项目创建，所有字段实时校验。" />
    <NCard size="small">
      <NSteps :current="current" :vertical="isMobile" size="small">
        <NStep title="基本信息" description="名称、联系方式与类型" />
        <NStep title="详细配置" description="区域、时间、预算与附件" />
        <NStep title="确认" description="核对摘要并提交" />
      </NSteps>
    </NCard>
    <NCard v-if="done" size="small">
      <NResult status="success" title="项目创建成功" description="我们已把配置同步到工作区，团队成员将收到邀请通知。">
        <template #footer><NFlex justify="center"><NButton type="primary" @click="done = false; current = 1">再创建一个</NButton><NButton secondary tag="a" href="/apps/naive-ui/">返回仪表盘</NButton></NFlex></template>
      </NResult>
    </NCard>
    <NCard v-else size="small">
      <NForm v-show="current === 1" ref="form1" :model="basic" :rules="basicRules" label-placement="top" require-mark-placement="left">
        <NGrid cols="1 m:2" responsive="screen" :x-gap="16">
          <NFormItemGi label="项目名称" path="name" :span="1"><NInput v-model:value="basic.name" placeholder="例如：数据看板 v2" clearable /></NFormItemGi>
          <NFormItemGi label="席位数" path="seats" :span="1"><template #label>席位数 <NTooltip><template #trigger><Icon name="circle-help" :size="14" /></template>可随时在计费页调整</NTooltip></template><NInputNumber v-model:value="basic.seats" :min="1" :max="500" style="width: 100%" /></NFormItemGi>
          <NFormItemGi label="联系邮箱" path="email"><NInput v-model:value="basic.email" placeholder="name@company.com" /></NFormItemGi>
          <NFormItemGi label="联系电话" path="phone" feedback="用于接收验证码与告警通知"><NInputGroup><NSelect v-model:value="basic.country" :options="countries" style="width: 130px" /><NInput v-model:value="basic.phone" placeholder="手机号" /></NInputGroup></NFormItemGi>
          <NFormItemGi label="项目描述" path="desc" :span="2"><NInput v-model:value="basic.desc" type="textarea" show-count :maxlength="200" :autosize="{ minRows: 3 }" placeholder="项目目标与背景" /></NFormItemGi>
          <NFormItemGi label="项目类型" path="type"><NRadioGroup v-model:value="basic.type"><NSpace><NRadio value="internal">内部</NRadio><NRadio value="client">客户</NRadio><NRadio value="oss">开源</NRadio></NSpace></NRadioGroup></NFormItemGi>
          <NFormItemGi label="启用模块" path="modules"><NCheckboxGroup v-model:value="basic.modules"><NSpace><NCheckbox value="orders" label="订单" /><NCheckbox value="chat" label="AI 助手" /><NCheckbox value="billing" label="计费" /></NSpace></NCheckboxGroup></NFormItemGi>
          <NFormItemGi label="公开项目" path="public" :span="2"><NSwitch v-model:value="basic.public" /><NText depth="3" style="margin-left: 12px">公开后团队外成员可只读访问</NText></NFormItemGi>
        </NGrid>
      </NForm>
      <NForm v-show="current === 2" ref="form2" :model="detail" :rules="detailRules" label-placement="top" require-mark-placement="left">
        <NGrid cols="1 m:2" responsive="screen" :x-gap="16">
          <NFormItemGi label="数据区域" path="region"><NSelect v-model:value="detail.region" :options="regions" placeholder="选择区域" /></NFormItemGi>
          <NFormItemGi label="行业标签（多选）" path="tags"><NSelect v-model:value="detail.tags" :options="tagOptions" multiple filterable placeholder="可搜索" /></NFormItemGi>
          <NFormItemGi label="负责人（自动补全）" path="owner"><NAutoComplete v-model:value="detail.owner" :options="ownerOptions(detail.owner)" placeholder="输入姓名" clearable /></NFormItemGi>
          <NFormItemGi label="开始日期" path="start"><NDatePicker v-model:value="detail.start" type="date" style="width: 100%" /></NFormItemGi>
          <NFormItemGi label="每日同步时间" path="time"><NTimePicker v-model:value="detail.time" format="HH:mm" style="width: 100%" /></NFormItemGi>
          <NFormItemGi label="维护窗口" path="window"><NDatePicker v-model:value="detail.window" type="daterange" style="width: 100%" /></NFormItemGi>
          <NFormItemGi label="预算区间（万元）" path="budget"><NSlider v-model:value="detail.budget" range :step="5" :marks="{ 0: '0', 50: '50', 100: '100' }" /></NFormItemGi>
          <NFormItemGi label="优先级" path="priority"><NRate v-model:value="detail.priority" allow-half /></NFormItemGi>
          <NFormItemGi label="主题色" path="color"><NColorPicker v-model:value="detail.color" :modes="['hex']" /></NFormItemGi>
          <NFormItemGi label="标签输入" path="labels"><NDynamicTags v-model:value="detail.labels" /></NFormItemGi>
          <NFormItemGi label="附件" path="files" :span="2">
            <NUpload v-model:file-list="detail.files" multiple :default-upload="false" list-type="text">
              <NUploadDragger><div style="margin-bottom: 8px"><Icon name="upload" :size="36" /></div><NText style="font-size: 15px">点击或拖拽文件到此区域上传</NText><br /><NText depth="3" style="font-size: 12px">支持 PDF / PNG / CSV，单文件 ≤ 10MB</NText></NUploadDragger>
            </NUpload>
          </NFormItemGi>
        </NGrid>
      </NForm>
      <NForm v-show="current === 3" ref="form3" :model="confirm" :rules="confirmRules">
        <NDescriptions bordered :column="isMobile ? 1 : 2" label-placement="left" size="small" title="项目摘要">
          <NDescriptionsItem label="名称">{{ basic.name || "—" }}</NDescriptionsItem>
          <NDescriptionsItem label="席位">{{ basic.seats }}</NDescriptionsItem>
          <NDescriptionsItem label="邮箱">{{ basic.email || "—" }}</NDescriptionsItem>
          <NDescriptionsItem label="电话">{{ basic.country }} {{ basic.phone || "—" }}</NDescriptionsItem>
          <NDescriptionsItem label="类型">{{ basic.type }}</NDescriptionsItem>
          <NDescriptionsItem label="模块">{{ basic.modules.join("、") }}</NDescriptionsItem>
          <NDescriptionsItem label="区域">{{ detail.region ?? "—" }}</NDescriptionsItem>
          <NDescriptionsItem label="标签">{{ detail.tags.join("、") || "—" }}</NDescriptionsItem>
          <NDescriptionsItem label="负责人">{{ detail.owner || "—" }}</NDescriptionsItem>
          <NDescriptionsItem label="开始">{{ fmt(detail.start) }}</NDescriptionsItem>
          <NDescriptionsItem label="预算">{{ detail.budget[0] }}–{{ detail.budget[1] }} 万</NDescriptionsItem>
          <NDescriptionsItem label="附件">{{ detail.files.length }} 个文件</NDescriptionsItem>
        </NDescriptions>
        <NFormItem path="agree" :show-label="false" style="margin-top: 16px"><NCheckbox v-model:checked="confirm.agree">我已阅读并同意服务条款与隐私政策</NCheckbox></NFormItem>
      </NForm>
      <NFlex justify="space-between" style="margin-top: 8px">
        <NButton secondary :disabled="current === 1" @click="current -= 1"><template #icon><Icon name="chevron-left" /></template>上一步</NButton>
        <NButton type="primary" :loading="submitting" @click="next">{{ current === 3 ? "提交" : "下一步" }}<template v-if="current < 3" #icon><Icon name="chevron-right" /></template></NButton>
      </NFlex>
    </NCard>
  </NSpace>
</template>
