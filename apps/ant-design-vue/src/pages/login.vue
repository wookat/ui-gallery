<script setup lang="ts">
import { ref } from "vue"
import { Icon } from "../icons"
const form = ref()
const loading = ref(false)
const failed = ref(false)
const model = ref({ email: "", password: "", remember: true })
const rules = { email: [{ required: true, message: "请输入邮箱" }, { type: "email", message: "请输入有效邮箱" }], password: [{ required: true, message: "请输入密码" }] }
async function submit() {
  failed.value = false
  try { await form.value.validate(); loading.value = true; await new Promise((resolve) => setTimeout(resolve, 1200)); failed.value = true } catch { /* inline form errors */ } finally { loading.value = false }
}
</script>
<template>
  <div class="login-page">
    <a-card class="login-card">
      <div class="login-brand"><span class="brand-mark">A</span><strong>Acme Console</strong></div>
      <h1>欢迎回来</h1><p class="muted">登录你的工作区，继续管理业务。</p>
      <a-alert v-if="failed" type="error" show-icon message="邮箱或密码错误" class="section" />
      <a-form ref="form" :model="model" :rules="rules" layout="vertical" @finish="submit">
        <a-form-item label="邮箱" name="email"><a-input v-model:value="model.email" size="large" placeholder="name@example.com"><template #prefix><Icon name="user" /></template></a-input></a-form-item>
        <a-form-item label="密码" name="password"><a-input-password v-model:value="model.password" size="large" placeholder="请输入密码"><template #prefix><Icon name="lock" /></template></a-input-password></a-form-item>
        <div class="form-row"><a-checkbox v-model:checked="model.remember">记住我</a-checkbox><a-typography-link href="#">忘记密码？</a-typography-link></div>
        <a-button type="primary" html-type="submit" size="large" block :loading="loading">登录</a-button>
      </a-form>
      <a-divider>或</a-divider>
      <a-space direction="vertical" block>
        <a-button block><template #icon><Icon name="globe" /></template>使用 Google 登录</a-button><a-button block><template #icon><Icon name="github" /></template>使用 GitHub 登录</a-button><a-button block><template #icon><Icon name="wechat" /></template>使用微信登录</a-button>
      </a-space>
      <p class="login-footer muted">还没有账户？ <a-typography-link href="#">立即注册</a-typography-link></p>
    </a-card>
  </div>
</template>
<style scoped>
.login-page { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: var(--app-color-bg-layout); }
.login-card { width: min(100%, 420px); }
.login-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
.login-card h1 { margin-bottom: 4px; }
.form-row { display: flex; justify-content: space-between; margin-bottom: 20px; }
.login-footer { text-align: center; margin: 24px 0 0; }
</style>
