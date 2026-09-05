<script setup lang="ts">
import { reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import type { FormProps, SubmitContext } from "tdesign-vue-next"
import Icon from "@/components/Icon.vue"
import { settings, toggleTheme } from "@/settings"

const route = useRoute()
const router = useRouter()
const form = reactive({ email: "", password: "", remember: true })
const loading = ref(false)
const failed = ref(false)
const showPassword = ref(false)
const rules: FormProps["rules"] = {
  email: [{ required: true, message: "请输入邮箱", type: "error" }, { email: true, message: "邮箱格式不正确", type: "error" }],
  password: [{ required: true, message: "请输入密码", type: "error" }, { min: 6, message: "密码至少 6 位", type: "error" }],
}
const oauth = [
  { name: "Google", icon: "google" },
  { name: "GitHub", icon: "github" },
  { name: "微信", icon: "wechat" },
]
function onSubmit({ validateResult }: SubmitContext) {
  if (validateResult !== true) return
  loading.value = true
  failed.value = false
  setTimeout(() => {
    loading.value = false
    if (form.password === "wrong-password") failed.value = true
    else router.push({ path: "/", query: route.query })
  }, 900)
}
</script>

<template>
  <div class="ug-login">
    <t-button class="ug-login-theme" variant="text" shape="square" size="large" aria-label="切换主题" @click="toggleTheme"><Icon :name="settings.theme === 'dark' ? 'sun' : 'moon'" :size="18" /></t-button>
    <t-card class="ug-login-card" :bordered="true">
      <div class="ug-login-head">
        <span class="ug-logo">A</span>
        <t-typography-title level="h3" class="ug-login-title">登录 Acme Console</t-typography-title>
        <t-typography-paragraph class="ug-muted">使用工作邮箱登录，继续管理订单、团队与 AI 助手。</t-typography-paragraph>
      </div>
      <t-alert v-if="failed" theme="error" title="登录失败" message="邮箱或密码不正确，请重试。" close class="ug-login-alert" @close="failed = false" />
      <t-form :data="form" :rules="rules" label-align="top" :colon="false" @submit="onSubmit">
        <t-form-item label="邮箱" name="email">
          <t-input v-model="form.email" placeholder="you@company.com" size="large" clearable>
            <template #prefix-icon><Icon name="mail" /></template>
          </t-input>
        </t-form-item>
        <t-form-item label="密码" name="password">
          <t-input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="至少 6 位" size="large">
            <template #prefix-icon><Icon name="lock" /></template>
            <template #suffix-icon><span class="ug-eye" role="button" aria-label="切换密码可见" @click="showPassword = !showPassword"><Icon :name="showPassword ? 'eye-off' : 'eye'" /></span></template>
          </t-input>
        </t-form-item>
        <div class="ug-between ug-login-row">
          <t-checkbox v-model="form.remember">记住我</t-checkbox>
          <t-link theme="primary" hover="color" href="#forgot">忘记密码？</t-link>
        </div>
        <t-button type="submit" theme="primary" size="large" block :loading="loading">{{ loading ? "登录中…" : "登录" }}</t-button>
      </t-form>
      <t-divider class="ug-login-divider">或</t-divider>
      <div class="ug-oauth">
        <t-button v-for="o in oauth" :key="o.name" variant="outline" size="large" block><template #icon><Icon :name="o.icon" /></template>{{ o.name }}</t-button>
      </div>
      <t-typography-paragraph class="ug-login-foot ug-muted">还没有账号？ <t-link theme="primary" href="#register">注册</t-link></t-typography-paragraph>
    </t-card>
  </div>
</template>

<style>
.ug-login { position: relative; display: grid; place-items: center; min-height: 100vh; padding: 24px 16px; background: var(--td-bg-color-page); }
.ug-login-theme { position: absolute; top: 16px; right: 16px; }
.ug-login-card { width: 100%; max-width: 420px; }
.ug-login-head { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; margin-bottom: 16px; }
.ug-login-title { margin: 8px 0 0 !important; }
.ug-login-alert { margin-bottom: 16px; }
.ug-login-row { margin: -8px 0 16px; }
.ug-login-row .t-checkbox, .ug-login-row .t-link, .ug-login-foot .t-link { min-height: 40px; display: inline-flex; align-items: center; }
.ug-eye { cursor: pointer; display: inline-flex; align-items: center; justify-content: center; min-width: 40px; min-height: 40px; margin-right: -12px; }
.ug-login-divider { margin: 20px 0 !important; }
.ug-oauth { display: grid; gap: 8px; }
.ug-login-foot { text-align: center; margin: 20px 0 0 !important; }
@media (min-width: 480px) { .ug-oauth { grid-template-columns: repeat(3, 1fr); } }
</style>
