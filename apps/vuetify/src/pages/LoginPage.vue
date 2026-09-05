<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import Icon from "@/components/Icon.vue"

const route = useRoute()
const router = useRouter()
const form = ref()
const email = ref("")
const password = ref("")
const remember = ref(true)
const showPassword = ref(false)
const submitting = ref(false)
const error = ref(route.query.state === "error")
const rules = {
  required: (value: string) => Boolean(value) || "请输入此字段",
  email: (value: string) => /.+@.+\..+/.test(value) || "请输入有效邮箱",
}

async function submit() {
  const result = await form.value?.validate()
  if (!result?.valid) {
    error.value = true
    return
  }
  error.value = false
  submitting.value = true
  await new Promise((resolve) => window.setTimeout(resolve, 1500))
  await router.push("/")
}
</script>

<template>
  <v-main class="d-flex align-center justify-center pa-4 login-page">
    <v-card class="w-100 pa-4 pa-sm-8" max-width="420" elevation="4">
      <v-card-item class="text-center">
        <v-avatar color="primary" size="52" rounded="lg" class="mb-3">A</v-avatar>
        <v-card-title class="text-h5 px-0">Acme Console</v-card-title>
        <v-card-subtitle class="px-0">管理团队业务的统一控制台</v-card-subtitle>
      </v-card-item>
      <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="error = false">
        登录信息有误，请检查邮箱和密码后重试。
      </v-alert>
      <v-form ref="form" @submit.prevent="submit">
        <v-text-field v-model="email" label="邮箱" type="email" :rules="[rules.required, rules.email]" autocomplete="email">
          <template #prepend-inner><Icon name="mail" size="18" /></template>
        </v-text-field>
        <v-text-field
          v-model="password"
          label="密码"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required]"
          autocomplete="current-password"
        >
          <template #append-inner>
            <v-btn icon variant="text" size="small" :aria-label="showPassword ? '隐藏密码' : '显示密码'" @click="showPassword = !showPassword">
              <Icon :name="showPassword ? 'eye-off' : 'eye'" size="18" />
            </v-btn>
          </template>
        </v-text-field>
        <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-4">
          <v-checkbox v-model="remember" label="记住我" hide-details density="compact" />
          <v-btn variant="text" size="small">忘记密码？</v-btn>
        </div>
        <v-btn type="submit" color="primary" block size="large" :loading="submitting">登录</v-btn>
      </v-form>
      <div class="d-flex align-center ga-3 my-5">
        <v-divider /><span class="text-caption text-medium-emphasis">或</span><v-divider />
      </div>
      <div class="d-flex flex-column ga-2">
        <v-btn variant="outlined" block><template #prepend><Icon name="google" /></template>使用 Google 登录</v-btn>
        <v-btn variant="outlined" block><template #prepend><Icon name="github" /></template>使用 GitHub 登录</v-btn>
        <v-btn variant="outlined" block><template #prepend><Icon name="wechat" /></template>使用微信登录</v-btn>
      </div>
      <p class="text-center text-body-2 text-medium-emphasis mt-6 mb-0">没有账号？<v-btn variant="text" size="small" class="px-1">注册</v-btn></p>
    </v-card>
  </v-main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
}
</style>
