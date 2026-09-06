<script setup lang="ts">
import { computed, ref } from "vue"
import Icon from "@/components/Icon.vue"
import { resolveIcon } from "@/icons"

const form = ref()
const step = ref(1)
const done = ref(false)
const agreed = ref(false)
const name = ref("")
const email = ref("")
const phone = ref("")
const country = ref("+86")
const description = ref("")
const category = ref("")
const tags = ref<string[]>([])
const color = ref("#6750A4")
const config = ref("标准")
const features = ref(["报表"])
const date = ref()
const range = ref()
const time = ref("09:00")
const score = ref(4)
const countries = ["+86", "+1", "+81"]
const required = (value: string) => Boolean(value) || "必填项"
const emailRule = (value: string) => /.+@.+\..+/.test(value) || "请输入有效邮箱"
const summary = computed(() => [{ label: "项目名称", value: name.value || "未填写" }, { label: "邮箱", value: email.value || "未填写" }, { label: "电话", value: `${country.value} ${phone.value}` }, { label: "分类", value: category.value || "未选择" }])
async function next() {
  const result = await form.value?.validate()
  if (!result?.valid) return
  if (step.value < 3) step.value += 1
}
function submit() {
  if (agreed.value) done.value = true
}
</script>

<template>
  <div>
    <div class="mb-6"><h1 class="text-h5 text-sm-h4">新建项目</h1><p class="text-body-2 text-medium-emphasis mt-1">分三步完成项目配置，所有字段都可以稍后修改。</p></div>
    <v-empty-state v-if="done" :icon="resolveIcon('check-circle')" title="提交成功" text="项目已创建，团队成员将收到通知。"><template #actions><v-btn color="primary" @click="done = false">创建另一个项目</v-btn></template></v-empty-state>
    <v-form v-else ref="form" @submit.prevent="step === 3 ? submit() : next()">
      <v-stepper v-model="step" alt-labels class="mb-5"><v-stepper-header><v-stepper-item :complete="step > 1" title="基本信息" :value="1" /><v-divider /><v-stepper-item :complete="step > 2" title="详细配置" :value="2" /><v-divider /><v-stepper-item title="确认" :value="3" /></v-stepper-header></v-stepper>
      <v-window v-model="step">
        <v-window-item :value="1"><v-card title="基本信息" subtitle="填写项目的基础资料"><v-card-text><v-row><v-col cols="12" md="6"><v-text-field v-model="name" label="项目名称 *" :rules="[required]" hint="给项目取一个容易识别的名字" persistent-hint /></v-col><v-col cols="12" md="6"><v-text-field v-model="email" label="联系邮箱 *" :rules="[required, emailRule]" /></v-col><v-col cols="12" md="6"><v-number-input label="预算（元）" :min="0" :max="1000000" control-variant="stacked" /></v-col><v-col cols="12" md="6"><div class="d-flex ga-2"><v-select v-model="country" :items="countries" label="国家码" style="max-width: 110px" /><v-text-field v-model="phone" label="联系电话" /></div></v-col><v-col cols="12"><v-textarea v-model="description" label="项目描述" counter="200" rows="3" /></v-col><v-col cols="12" md="6"><v-radio-group label="项目类型" inline><v-radio label="内部项目" value="internal" /><v-radio label="客户项目" value="client" /></v-radio-group></v-col><v-col cols="12" md="6"><div class="text-body-2 mb-1">关注模块</div><div class="d-flex flex-wrap ga-4"><v-checkbox v-model="features" label="报表" value="报表" hide-details /><v-checkbox v-model="features" label="通知" value="通知" hide-details /></div></v-col><v-col cols="12"><v-switch label="启用团队协作" color="primary" /></v-col></v-row></v-card-text></v-card></v-window-item>
        <v-window-item :value="2"><v-card title="详细配置" subtitle="选择项目运行参数"><v-card-text><v-row><v-col cols="12" md="6"><v-select v-model="category" :items="['增长分析', '客户成功', '运营管理']" label="项目分类 *" :rules="[required]" /></v-col><v-col cols="12" md="6"><v-select v-model="config" :items="['标准', '高级', '企业']" label="配置方案" /></v-col><v-col cols="12" md="6"><v-combobox label="负责人" :items="['林晓', '王子涵', 'Alex Chen', 'Maria García']" /></v-col><v-col cols="12" md="6"><v-autocomplete label="关联团队" :items="['增长团队', '产品团队', '客户团队']" /></v-col><v-col cols="12" md="6"><v-date-input v-model="date" label="开始日期" /></v-col><v-col cols="12" md="6"><v-menu><template #activator="{ props }"><v-text-field v-bind="props" v-model="time" label="开始时间" readonly /></template><v-time-picker v-model="time" /></v-menu></v-col><v-col cols="12" md="6"><v-date-input v-model="range" label="日期范围" multiple="range" /></v-col><v-col cols="12" md="6"><v-range-slider label="优先级区间" :model-value="[25, 75]" thumb-label /></v-col><v-col cols="12" md="6"><v-rating v-model="score" label="重要程度" hover /></v-col><v-col cols="12" md="6"><v-color-input v-model="color" label="项目颜色" mode="hex" /></v-col><v-col cols="12"><v-file-upload density="comfortable" clearable title="拖拽文件到这里，或点击上传" browse-text="选择文件" /></v-col><v-col cols="12"><v-combobox v-model="tags" label="标签" multiple chips closable-chips :items="['重点', '季度计划', '客户']" hint="输入后按 Enter 添加" persistent-hint /></v-col></v-row><v-tooltip text="字段会影响后续报表筛选"><template #activator="{ props }"><v-btn v-bind="props" icon variant="text"><Icon name="circle-help" /></v-btn></template></v-tooltip></v-card-text></v-card></v-window-item>
        <v-window-item :value="3"><v-card title="确认项目" subtitle="提交前请检查信息"><v-card-text><v-table><tbody><tr v-for="item in summary" :key="item.label"><th class="text-left">{{ item.label }}</th><td>{{ item.value }}</td></tr></tbody></v-table><v-checkbox v-model="agreed" label="我已阅读并同意项目服务条款" class="mt-4" /></v-card-text></v-card></v-window-item>
      </v-window>
      <div class="d-flex justify-space-between mt-5"><v-btn variant="text" :disabled="step === 1" @click="step -= 1">上一步</v-btn><v-btn color="primary" type="submit" :disabled="step === 3 && !agreed">{{ step === 3 ? "提交项目" : "下一步" }}</v-btn></div>
    </v-form>
  </div>
</template>
