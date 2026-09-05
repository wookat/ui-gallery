<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import AppIcon from "../icons/AppIcon.vue"

const router = useRouter()
const email = ref("")
const password = ref("")
const remember = ref(false)
const visible = ref(false)
const loading = ref(false)
const error = ref(false)
const emailRules = [(value: string) => !!value || "请输入邮箱", (value: string) => /.+@.+\..+/.test(value) || "请输入有效邮箱"]
const passwordRules = [(value: string) => !!value || "请输入密码", (value: string) => value.length >= 6 || "密码至少 6 位"]

async function submit() {
  if (!email.value || !password.value || password.value.length < 6) {
    error.value = true
    return
  }
  loading.value = true
  error.value = false
  await new Promise((resolve) => window.setTimeout(resolve, 800))
  loading.value = false
  error.value = true
}
</script>

<template>
  <div class="login-page bg-grey-2">
    <q-card class="login-card" bordered>
      <q-card-section class="q-gutter-y-lg">
        <router-link to="/" class="row items-center q-gutter-sm text-weight-bold text-no-wrap text-dark">
          <q-avatar color="primary" text-color="white">A</q-avatar><span>Acme Console</span>
        </router-link>
        <div>
          <div class="text-h5 text-weight-medium">欢迎回来</div>
          <div class="text-body2 text-grey-7 q-mt-sm">登录 Acme Console，继续你的工作。</div>
        </div>
        <q-banner v-if="error" class="bg-negative text-white rounded-borders" rounded>
          <template #avatar><AppIcon name="alert-circle" /></template>
          登录失败，请检查邮箱和密码后重试。
        </q-banner>
        <q-form class="q-gutter-md" @submit.prevent="submit">
          <q-input v-model="email" label="邮箱" type="email" :rules="emailRules" lazy-rules>
            <template #prepend><AppIcon name="mail" /></template>
          </q-input>
          <q-input v-model="password" label="密码" :type="visible ? 'text' : 'password'" :rules="passwordRules" lazy-rules>
            <template #prepend><AppIcon name="lock" /></template>
            <template #append><q-btn flat round dense type="button" @click="visible = !visible"><AppIcon :name="visible ? 'eye-off' : 'eye'" /></q-btn></template>
          </q-input>
          <div class="row items-center justify-between">
            <q-checkbox v-model="remember" label="记住我" />
            <q-btn flat dense no-caps color="primary" label="忘记密码？" />
          </div>
          <q-btn class="full-width" color="primary" type="submit" label="登录" :loading="loading" />
        </q-form>
        <q-separator><span class="q-px-sm text-caption text-grey-7">或</span></q-separator>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-4"><q-btn outline class="full-width" label="Google" /></div>
          <div class="col-12 col-sm-4"><q-btn outline class="full-width" label="GitHub" /></div>
          <div class="col-12 col-sm-4"><q-btn outline class="full-width" label="微信" /></div>
        </div>
        <div class="text-center text-body2 text-grey-7">还没有账户？ <q-btn flat dense no-caps color="primary" label="立即注册" /></div>
        <q-btn flat dense no-caps class="full-width" color="primary" label="打开落地页" @click="router.push('/landing')" />
      </q-card-section>
    </q-card>
  </div>
</template>
