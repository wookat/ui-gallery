<script setup lang="ts">
import { reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import type { FieldRule } from "@arco-design/web-vue"
import { Icon } from "@/lib/icons"
import { theme, toggleTheme } from "@/lib/settings"

const route = useRoute()
const router = useRouter()
const form = reactive({ email: "", password: "", remember: true })
const loading = ref(false)
const failed = ref(true)
const rules: Record<string, FieldRule[]> = {
  email: [
    { required: true, message: "请输入邮箱" },
    { type: "email", message: "邮箱格式不正确" },
  ],
  password: [
    { required: true, message: "请输入密码" },
    { minLength: 8, message: "密码至少 8 位" },
  ],
}

function submit() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1200)
}
</script>

<template>
  <div class="login">
    <a-button class="login-theme" type="text" shape="circle" @click="toggleTheme()">
      <template #icon><Icon :name="theme === 'dark' ? 'sun' : 'moon'" /></template>
    </a-button>
    <a-card class="login-card" :bordered="true">
      <div class="stack" style="text-align: center; gap: 6px; margin-bottom: 12px">
        <a-avatar :size="44" shape="square" :style="{ backgroundColor: 'rgb(var(--primary-6))', margin: '0 auto' }">A</a-avatar>
        <a-typography-title :heading="4" style="margin: 8px 0 0">登录 Acme Console</a-typography-title>
        <a-typography-text type="secondary">使用工作邮箱登录，继续管理订单、客户与 AI 助手。</a-typography-text>
      </div>
      <a-alert v-if="failed" type="error" closable style="margin-bottom: 12px" @close="failed = false">邮箱或密码不正确，请重试。</a-alert>
      <a-form :model="form" :rules="rules" layout="vertical" @submit-success="submit">
        <a-form-item field="email" label="邮箱" validate-trigger="blur" feedback>
          <a-input v-model="form.email" placeholder="you@acme.dev" allow-clear>
            <template #prefix><Icon name="mail" /></template>
          </a-input>
        </a-form-item>
        <a-form-item field="password" label="密码" validate-trigger="blur" feedback>
          <a-input-password v-model="form.password" placeholder="至少 8 位" allow-clear>
            <template #prefix><Icon name="lock" /></template>
          </a-input-password>
        </a-form-item>
        <div class="between" style="margin-bottom: 12px">
          <a-checkbox v-model="form.remember">记住我</a-checkbox>
          <a-link>忘记密码？</a-link>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">登录</a-button>
      </a-form>
      <a-divider orientation="center" style="margin: 12px 0"><span class="muted small">或</span></a-divider>
      <a-space direction="vertical" fill size="mini">
        <a-button long><template #icon><Icon name="google" /></template>使用 Google 登录</a-button>
        <a-button long><template #icon><Icon name="github" /></template>使用 GitHub 登录</a-button>
        <a-button long><template #icon><Icon name="wechat" /></template>使用微信登录</a-button>
      </a-space>
      <div style="text-align: center; margin-top: 12px">
        <a-typography-text type="secondary">还没有账号？</a-typography-text>
        <a-link @click="router.push({ path: '/', query: route.query })">注册</a-link>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.login {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 16px;
  box-sizing: border-box;
  background: var(--color-fill-1);
}

.login-theme {
  position: absolute;
  top: 16px;
  right: 16px;
}

.login-card {
  width: 100%;
  max-width: 400px;
}
</style>
