<script setup lang="ts">
import { computed, ref } from "vue"
import { showToast } from "vant"
import AppIcon from "@/components/AppIcon.vue"

const step = ref(0)
const formRef = ref<{ validate: () => Promise<void> } | null>(null)
const done = ref(false)
const name = ref("")
const email = ref("")
const phone = ref("")
const description = ref("")
const plan = ref("Pro")
const tags = ref<string[]>([])
const tagInput = ref("")
const agree = ref(false)
const datePopup = ref(false)
const rangePopup = ref(false)
const pickerPopup = ref(false)
const countryPopup = ref(false)
const multiPopup = ref(false)
const timePopup = ref(false)
const country = ref("+86")
const language = ref("中文")
const time = ref("09:30")
const selectedOptions = ref<string[]>([])
const notifications = ref(true)
const color = ref("#1989fa")
const suggestions = ["Pro", "Team", "Starter"]
const pickerColumns = [{ text: "+86", value: "+86" }, { text: "+1", value: "+1" }, { text: "+81", value: "+81" }, { text: "中文", value: "中文" }, { text: "English", value: "English" }]
const valid = computed(() => Boolean(name.value && email.value.includes("@")))
const addTag = () => { if (tagInput.value.trim()) { tags.value.push(tagInput.value.trim()); tagInput.value = "" } }
const submit = () => { if (valid.value && agree.value) { done.value = true; showToast("项目创建成功") } }
const nextStep = async (target: number) => {
  try {
    await formRef.value?.validate()
    step.value = target
  } catch {
    showToast("请完善必填字段")
  }
}
</script>

<template>
  <div class="page">
    <div class="page-title"><div><h1>创建项目</h1><p>完成三步配置</p></div></div>
    <van-steps :active="step"><van-step>基本信息</van-step><van-step>详细配置</van-step><van-step>确认提交</van-step></van-steps>
    <van-empty v-if="done" image="success" description="项目创建成功"><van-button type="primary" @click="done = false">继续创建</van-button></van-empty>
    <van-form v-else ref="formRef" @submit="submit">
      <div v-if="step === 0" class="card form-card"><van-cell-group inset><van-field v-model="name" label="项目名称" required placeholder="项目名称" :rules="[{ required: true, message: '请输入项目名称' }]" /><van-field v-model="email" label="邮箱" type="email" required placeholder="邮箱" :rules="[{ required: true, message: '请输入邮箱' }, { pattern: /.+@.+/, message: '邮箱格式不正确' }]" /><van-field v-model="phone" label="电话" type="tel" required placeholder="电话" :rules="[{ required: true, message: '请输入电话' }]"><template #left-icon><van-button size="small" plain class="country-button" @click="countryPopup = true">{{ country }}</van-button></template></van-field><van-field v-model="description" label="描述" type="textarea" maxlength="120" show-word-limit placeholder="项目描述" /><van-field label="人数" type="digit" placeholder="请输入人数" /><van-field name="plan" label="方案" required><template #input><van-radio-group v-model="plan" class="field-options"><van-cell title="Pro" clickable @click="plan = 'Pro'"><template #right-icon><van-radio name="Pro" /></template></van-cell><van-cell title="Team" clickable @click="plan = 'Team'"><template #right-icon><van-radio name="Team" /></template></van-cell></van-radio-group></template></van-field><van-field name="notify" label="通知方式"><template #input><van-checkbox-group v-model="selectedOptions" class="field-options"><van-cell title="邮件通知"><template #right-icon><van-checkbox name="email" /></template></van-cell><van-cell title="短信通知"><template #right-icon><van-checkbox name="sms" /></template></van-cell></van-checkbox-group></template></van-field><van-cell title="接收通知"><template #right-icon><van-switch v-model="notifications" /></template></van-cell></van-cell-group><div class="form-actions"><van-button type="primary" @click="nextStep(1)">下一步</van-button></div></div>
      <div v-else-if="step === 1" class="card form-card"><van-cell-group inset><van-field label="语言" readonly :model-value="language" is-link @click="pickerPopup = true" /><van-field label="多选标签" readonly :model-value="tags.join('、') || '选择标签'" is-link @click="multiPopup = true" /><van-field v-model="tagInput" label="添加标签" placeholder="回车添加" @keyup.enter="addTag"><template #button><van-button size="small" type="primary" @click="addTag">添加</van-button></template></van-field><div class="tag-list"><van-tag v-for="tag in tags" :key="tag" closeable type="primary" @close="tags = tags.filter((item) => item !== tag)">{{ tag }}</van-tag></div><van-field label="日期" required readonly model-value="选择日期" is-link @click="datePopup = true" /><van-field label="时间" required readonly :model-value="time" is-link @click="timePopup = true" /><van-cell title="区间滑块"><template #label><van-slider range :model-value="[20, 72]" /></template></van-cell><van-cell title="评分"><template #value><van-rate :model-value="4" /></template></van-cell><van-field label="颜色"><template #input><input v-model="color" type="color" aria-label="颜色选择器" /></template></van-field><van-uploader :max-count="3" multiple><template #preview-cover><span>文件</span></template></van-uploader><van-cell title="帮助"><template #value><van-popover placement="top" :actions="[{ text: '字段帮助' }]"><template #reference><AppIcon name="info" /></template></van-popover></template><template #label><span class="muted">字段帮助文本</span></template></van-cell></van-cell-group><div class="form-actions"><van-button plain @click="step = 0">上一步</van-button><van-button type="primary" @click="nextStep(2)">下一步</van-button></div></div>
      <div v-else class="card form-card"><van-cell-group inset><van-cell title="项目名称" :value="name || '未填写'" /><van-cell title="邮箱" :value="email || '未填写'" /><van-cell title="电话" :value="phone || '未填写'" /><van-cell title="描述" :value="description || '未填写'" /><van-cell title="方案" :value="plan" /><van-cell title="标签" :value="tags.join('、') || '未选择'" /><van-cell title="语言" :value="language" /><van-cell title="颜色" :value="color" /><van-cell title="通知" :value="notifications ? '已开启' : '已关闭'" /></van-cell-group><van-checkbox v-model="agree">我同意服务条款与隐私政策</van-checkbox><div class="form-actions"><van-button plain @click="step = 1">上一步</van-button><van-button type="primary" native-type="submit" :disabled="!agree">提交项目</van-button></div></div>
    </van-form>
    <van-popup v-model:show="countryPopup" position="bottom"><van-picker :columns="pickerColumns.slice(0, 3)" @confirm="(item) => { country = String(item.selectedValues[0]); countryPopup = false }" /></van-popup>
    <van-popup v-model:show="pickerPopup" position="bottom"><van-picker :columns="pickerColumns.slice(3)" @confirm="(item) => { language = String(item.selectedValues[0]); pickerPopup = false }" /></van-popup>
    <van-popup v-model:show="multiPopup" position="bottom"><van-checkbox-group v-model="tags" class="popup-options"><van-checkbox v-for="item in suggestions" :key="item" :name="item">{{ item }}</van-checkbox><van-button type="primary" block @click="multiPopup = false">完成</van-button></van-checkbox-group></van-popup>
    <van-popup v-model:show="datePopup" position="bottom"><van-date-picker @confirm="datePopup = false" /></van-popup>
    <van-popup v-model:show="timePopup" position="bottom"><van-time-picker @confirm="(item) => { time = item.selectedValues.join(':'); timePopup = false }" /></van-popup>
    <van-popup v-model:show="rangePopup" position="bottom"><van-calendar type="range" @confirm="rangePopup = false" /></van-popup>
  </div>
</template>

<style scoped>
.form-card { margin-top: 16px; }
.field-options { width: 100%; }
.field-options :deep(.van-cell) { padding-left: 0; padding-right: 0; }
.form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }
.tag-list { display: flex; gap: 6px; flex-wrap: wrap; padding: 8px 16px; }
.popup-options { display: grid; gap: 14px; padding: 24px; }
.popup-options .van-button { margin-top: 12px; }
</style>
