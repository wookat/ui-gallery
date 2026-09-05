<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { NCard, NForm, NFormItem, NInput, NButton, NCheckbox, NDivider, NAlert, NFlex, NText, NH2, NAvatar, NA, useThemeVars, type FormInst, type FormRules } from "naive-ui"
import { Icon } from "../icons"

const router = useRouter()
const themeVars = useThemeVars()
const formRef = ref<FormInst | null>(null)
const model = ref({ email: "", password: "", remember: true })
const loading = ref(false)
const error = ref("")
const rules: FormRules = {
  email: [{ required: true, message: "请输入邮箱", trigger: ["blur", "input"] }, { type: "email", message: "邮箱格式不正确", trigger: ["blur"] }],
  password: [{ required: true, message: "请输入密码", trigger: ["blur", "input"] }, { min: 8, message: "密码至少 8 位", trigger: ["blur"] }],
}
async function submit() {
  error.value = ""
  try { await formRef.value?.validate() } catch { error.value = "请修正表单中的错误后重试"; return }
  loading.value = true
  setTimeout(() => { loading.value = false; router.push("/") }, 800)
}
const oauth = [
  { key: "google", label: "Google", icon: "google" },
  { key: "github", label: "GitHub", icon: "github" },
  { key: "wechat", label: "微信", icon: "wechat" },
]
</script>

<template>
  <div class="login-page">
    <NCard class="login-card" :bordered="true">
      <NFlex vertical align="center" :size="4" style="margin-bottom: 20px">
        <NAvatar :size="44" :color="themeVars.primaryColor">A</NAvatar>
        <NH2 style="margin: 12px 0 0">登录 Acme Console</NH2>
        <NText depth="3">使用你的工作邮箱继续</NText>
      </NFlex>
      <NAlert v-if="error" type="error" closable title="登录失败" style="margin-bottom: 16px" @close="error = ''">{{ error }}</NAlert>
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="top" size="large" @submit.prevent="submit">
        <NFormItem label="邮箱" path="email">
          <NInput v-model:value="model.email" placeholder="name@company.com" :input-props="{ autocomplete: 'email' }"><template #prefix><Icon name="mail" :size="16" /></template></NInput>
        </NFormItem>
        <NFormItem label="密码" path="password">
          <NInput v-model:value="model.password" type="password" show-password-on="click" placeholder="至少 8 位"><template #prefix><Icon name="lock" :size="16" /></template></NInput>
        </NFormItem>
        <NFlex justify="space-between" align="center" style="margin-bottom: 16px">
          <NCheckbox v-model:checked="model.remember">记住我</NCheckbox>
          <NA href="#forgot">忘记密码？</NA>
        </NFlex>
        <NButton type="primary" block attr-type="submit" :loading="loading" size="large">登录</NButton>
      </NForm>
      <NDivider>或</NDivider>
      <NFlex vertical :size="8">
        <NButton v-for="item in oauth" :key="item.key" secondary block><template #icon><Icon :name="item.icon" :size="16" /></template>使用 {{ item.label }} 登录</NButton>
      </NFlex>
      <NFlex justify="center" style="margin-top: 20px"><NText depth="3">还没有账号？<NA href="#signup">注册</NA></NText></NFlex>
    </NCard>
  </div>
</template>

<style scoped>
.login-page { min-height: 100vh; display: grid; place-items: center; padding: 16px; }
.login-card { width: 100%; max-width: 420px; }
</style>
