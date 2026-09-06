<script setup lang="ts">
import { ref } from "vue"
import { RouterLink, useRouter } from "vue-router"
import Button from "primevue/button"
import Card from "primevue/card"
import Checkbox from "primevue/checkbox"
import Divider from "primevue/divider"
import IconField from "primevue/iconfield"
import InputIcon from "primevue/inputicon"
import InputText from "primevue/inputtext"
import Message from "primevue/message"
import Password from "primevue/password"
import AppIcon from "@/icons/AppIcon.vue"

const router = useRouter()
const email = ref("")
const password = ref("")
const remember = ref(true)
const loading = ref(false)
const errors = ref<{ email?: string; password?: string }>({})
const topError = ref("")

function validate() {
  const next: typeof errors.value = {}
  if (!email.value) next.email = "请输入邮箱"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) next.email = "邮箱格式不正确"
  if (!password.value) next.password = "请输入密码"
  else if (password.value.length < 8) next.password = "密码至少 8 位"
  errors.value = next
  return Object.keys(next).length === 0
}

function submit() {
  topError.value = ""
  if (!validate()) return
  loading.value = true
  setTimeout(() => {
    loading.value = false
    if (password.value === "wrongpass") {
      topError.value = "邮箱或密码错误，请重试"
      return
    }
    router.push("/")
  }, 900)
}
</script>

<template>
  <div class="login">
    <Card class="login__card">
      <template #title>
        <div class="col items-center gap-3 text-center">
          <span class="login__logo">A</span>
          <h1 class="text-xl font-semibold">登录 Acme Console</h1>
        </div>
      </template>
      <template #subtitle>
        <p class="text-center text-sm">使用你的工作邮箱继续</p>
      </template>
      <template #content>
        <form class="col gap-4 mt-2" novalidate @submit.prevent="submit">
          <Message v-if="topError" severity="error" :closable="true" @close="topError = ''"><template #icon="{ class: iconClass }"><AppIcon name="x-circle" :size="18" :class="iconClass" /></template>{{ topError }}</Message>

          <div class="col gap-1">
            <label for="email" class="text-sm font-medium">邮箱</label>
            <IconField>
              <InputIcon><AppIcon name="mail" /></InputIcon>
              <InputText id="email" v-model="email" type="email" placeholder="you@example.com" autocomplete="email" :invalid="!!errors.email" fluid />
            </IconField>
            <Message v-if="errors.email" severity="error" size="small" variant="simple">{{ errors.email }}</Message>
          </div>

          <div class="col gap-1">
            <div class="flex items-center justify-between">
              <label for="password" class="text-sm font-medium">密码</label>
              <a href="#" class="text-sm inline-link" @click.prevent>忘记密码？</a>
            </div>
            <Password id="password" v-model="password" toggle-mask :feedback="false" placeholder="至少 8 位" autocomplete="current-password" :invalid="!!errors.password" fluid input-class="w-full" />
            <Message v-if="errors.password" severity="error" size="small" variant="simple">{{ errors.password }}</Message>
          </div>

          <div class="flex items-center gap-2">
            <Checkbox v-model="remember" input-id="remember" binary />
            <label for="remember" class="text-sm">记住我</label>
          </div>

          <Button type="submit" label="登录" :loading="loading" fluid />

          <Divider align="center"><span class="text-xs muted">或</span></Divider>

          <div class="col gap-2">
            <Button severity="secondary" outlined fluid>
              <AppIcon name="chrome" :size="16" /><span>使用 Google 登录</span>
            </Button>
            <Button severity="secondary" outlined fluid>
              <AppIcon name="github" :size="16" /><span>使用 GitHub 登录</span>
            </Button>
            <Button severity="secondary" outlined fluid>
              <AppIcon name="message-square" :size="16" /><span>使用微信登录</span>
            </Button>
          </div>
        </form>
      </template>
      <template #footer>
        <p class="text-center text-sm muted">还没有账号？ <RouterLink to="/login" class="inline-link">注册</RouterLink></p>
      </template>
    </Card>
  </div>
</template>

<style>
.login { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px 16px; background: var(--p-surface-50); }
.dark .login { background: var(--p-surface-950); }
.login__card { width: 100%; max-width: 420px; }
.login .inline-link { display: inline-flex; align-items: center; justify-content: center; min-height: 40px; min-width: 40px; padding: 0 8px; margin: -10px 0; border-radius: var(--p-content-border-radius); font-weight: 500; }
.login__logo { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; background: var(--p-primary-color); color: var(--p-primary-contrast-color); font-weight: 700; font-size: 20px; }
@media (max-width: 767px) { .login { padding: 0; align-items: stretch; } .login__card { max-width: none; border-radius: 0; } }
</style>
