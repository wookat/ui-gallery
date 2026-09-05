<script setup lang="ts">
import { computed, ref } from "vue"
import { useQuasar } from "quasar"
import AppIcon from "../icons/AppIcon.vue"
import PageHeader from "../components/PageHeader.vue"

const $q = useQuasar()
const step = ref(1)
const success = ref(new URLSearchParams(window.location.search).get("state") === "success")
const formOne = ref()
const formTwo = ref()
const name = ref("")
const amount = ref<number | null>(null)
const email = ref("")
const country = ref("+86")
const phone = ref("")
const description = ref("")
const category = ref("产品")
const permissions = ref<string[]>([])
const enabled = ref(true)
const plan = ref("Pro")
const tags = ref<string[]>([])
const autocomplete = ref("")
const date = ref("")
const time = ref("09:30")
const rangeDate = ref<{ from?: string; to?: string } | null>(null)
const range = ref({ min: 20, max: 80 })
const rating = ref(4)
const color = ref("#1976d2")
const files = ref<File[] | null>(null)
const agreed = ref(false)
const categories = ["产品", "营销", "运营"]
const permissionOptions = [
  { label: "阅读数据", value: "read" },
  { label: "编辑内容", value: "edit" },
  { label: "管理成员", value: "manage" },
]
const plans = ["Starter", "Pro", "Enterprise"]
const tagOptions = ["Vue", "Quasar", "数据"]
const dateLabel = computed(() => rangeDate.value ? `${rangeDate.value.from ?? ""} - ${rangeDate.value.to ?? ""}` : "")
const rules = {
  required: (value: unknown) => Boolean(value) || "此字段为必填项",
  email: (value: string) => /.+@.+\..+/.test(value) || "请输入有效邮箱",
  phone: (value: string) => /^\d{6,}$/.test(value) || "请输入有效手机号",
  amount: (value: number | null) => (value !== null && value >= 1) || "请输入大于 0 的数值",
  description: (value: string) => value.length <= 200 || "最多 200 个字符",
}

async function next() {
  const form = step.value === 1 ? formOne.value : formTwo.value
  if (form && !(await form.validate())) return
  step.value += 1
}

function back() {
  step.value -= 1
}

function submit() {
  if (!agreed.value) {
    $q.notify({ type: "warning", message: "请先同意服务条款" })
    return
  }
  success.value = true
}
</script>

<template>
  <div class="q-gutter-y-lg">
    <PageHeader title="新建项目" description="分三步完成项目配置。" />
    <q-card v-if="success" bordered class="q-pa-xl text-center">
      <AppIcon name="check-circle" color="positive" size="72px" />
      <div class="text-h5 q-mt-md">项目创建成功</div>
      <div class="text-body2 text-grey-7 q-mt-sm">你的项目已经准备就绪。</div>
      <div class="row justify-center q-gutter-sm q-mt-lg">
        <q-btn color="primary" label="查看项目" />
        <q-btn flat label="返回仪表盘" to="/" />
      </div>
    </q-card>
    <q-stepper v-else v-model="step" animated flat bordered :vertical="$q.screen.lt.sm">
      <q-step :name="1" title="基本信息" :done="step > 1">
        <q-form ref="formOne" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6"><q-input v-model="name" label="项目名称 *" hint="请输入项目名称" :rules="[rules.required]" lazy-rules /></div>
            <div class="col-12 col-sm-6"><q-input v-model="amount" label="预算 *" type="number" prefix="¥" :rules="[rules.amount]" lazy-rules /></div>
            <div class="col-12 col-sm-6"><q-input v-model="email" label="联系邮箱 *" type="email" :rules="[rules.required, rules.email]" lazy-rules /></div>
            <div class="col-12 col-sm-6">
              <q-input v-model="phone" label="手机号 *" :rules="[rules.required, rules.phone]" lazy-rules>
                <template #prepend><q-select v-model="country" dense borderless :options="['+86', '+1', '+81', '+44']" /></template>
              </q-input>
            </div>
            <div class="col-12"><q-input v-model="description" label="项目描述" type="textarea" counter maxlength="200" :rules="[rules.description]" hint="最多 200 个字符" /></div>
          </div>
          <q-option-group v-model="category" :options="categories.map((label) => ({ label, value: label }))" type="radio" label="项目类型" inline />
          <q-option-group v-model="permissions" :options="permissionOptions" type="checkbox" label="初始权限" inline />
          <q-toggle v-model="enabled" label="启用项目通知" />
        </q-form>
        <q-stepper-navigation><q-btn color="primary" label="下一步" @click="next" /></q-stepper-navigation>
      </q-step>

      <q-step :name="2" title="详细配置" :done="step > 2">
        <q-form ref="formTwo" class="q-gutter-md">
          <q-select v-model="plan" label="方案 *" :options="plans" :rules="[rules.required]" lazy-rules />
          <q-select v-model="tags" label="标签" multiple use-chips :options="tagOptions" />
          <q-select v-model="autocomplete" label="负责人" use-input :options="['林晓', '王子涵', 'Alex Chen']" @filter="() => undefined">
            <template #append><AppIcon name="search" /></template>
          </q-select>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input v-model="date" label="开始日期 *" :rules="[rules.required]" lazy-rules readonly>
                <template #append><q-btn flat round dense type="button"><AppIcon name="calendar" /><q-popup-proxy cover transition-show="scale" transition-hide="scale"><q-date v-model="date" mask="YYYY-MM-DD" /></q-popup-proxy></q-btn></template>
              </q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="time" label="开始时间" readonly>
                <template #append><q-btn flat round dense type="button"><AppIcon name="clock" /><q-popup-proxy cover transition-show="scale" transition-hide="scale"><q-time v-model="time" format24h /></q-popup-proxy></q-btn></template>
              </q-input>
            </div>
          </div>
          <q-input :model-value="dateLabel" label="日期范围" readonly>
            <template #append><q-btn flat round dense type="button"><AppIcon name="calendar" /><q-popup-proxy cover transition-show="scale" transition-hide="scale"><q-date v-model="rangeDate" range /></q-popup-proxy></q-btn></template>
          </q-input>
          <div>
            <div class="text-body2 q-mb-sm">预算区间 <span class="inline-help"><AppIcon name="circle-help" size="16" /><q-tooltip>设置项目预算区间</q-tooltip></span></div>
            <q-range v-model="range" :min="0" :max="100" label />
          </div>
          <div class="row items-center q-gutter-lg">
            <q-rating v-model="rating" size="2em" color="primary" />
            <q-input v-model="color" label="主题颜色" readonly style="max-width: 180px">
              <template #append><q-btn flat round dense type="button" :style="{ color }"><AppIcon name="edit" /><q-popup-proxy cover><q-color v-model="color" /></q-popup-proxy></q-btn></template>
            </q-input>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6"><q-uploader label="封面文件" hide-upload-btn flat bordered /></div>
            <div class="col-12 col-sm-6"><q-file v-model="files" label="附件列表" multiple use-chips /></div>
          </div>
          <q-select v-model="tags" label="添加标签" multiple use-input use-chips new-value-mode="add-unique" :options="tagOptions" />
        </q-form>
        <q-stepper-navigation class="q-gutter-sm"><q-btn color="primary" label="下一步" @click="next" /><q-btn flat label="上一步" @click="back" /></q-stepper-navigation>
      </q-step>

      <q-step :name="3" title="确认">
        <q-list bordered separator>
          <q-item><q-item-section><q-item-label>项目名称</q-item-label><q-item-label caption>{{ name || "未填写" }}</q-item-label></q-item-section></q-item>
          <q-item><q-item-section><q-item-label>联系邮箱</q-item-label><q-item-label caption>{{ email || "未填写" }}</q-item-label></q-item-section></q-item>
          <q-item><q-item-section><q-item-label>方案</q-item-label><q-item-label caption>{{ plan }}</q-item-label></q-item-section></q-item>
          <q-item><q-item-section><q-item-label>项目类型</q-item-label><q-item-label caption>{{ category }}</q-item-label></q-item-section></q-item>
          <q-item><q-item-section><q-item-label>权限</q-item-label><q-item-label caption>{{ permissions.join("、") || "未选择" }}</q-item-label></q-item-section></q-item>
        </q-list>
        <q-checkbox v-model="agreed" class="q-mt-md" label="我已阅读并同意服务条款" />
        <q-stepper-navigation class="q-gutter-sm"><q-btn color="primary" label="提交项目" @click="submit" /><q-btn flat label="上一步" @click="back" /></q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>
