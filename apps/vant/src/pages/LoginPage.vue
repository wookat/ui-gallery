<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { showToast } from "vant"
import AppIcon from "@/components/AppIcon.vue"

const router = useRouter()
const email = ref("")
const password = ref("")
const remember = ref(true)
const passwordVisible = ref(false)
const loading = ref(false)
const error = ref("")
const submit = () => {
  error.value = ""
  if (!email.value || !email.value.includes("@")) { error.value = "请输入有效邮箱"; return }
  if (!password.value) { error.value = "请输入密码"; return }
  loading.value = true
  window.setTimeout(() => { loading.value = false; showToast("登录成功"); void router.push("/") }, 650)
}
</script>

<template>
  <main class="login-page">
    <div class="login-card card">
      <div class="login-brand"><span class="brand-mark"><AppIcon name="zap" /></span><strong>Acme Console</strong></div>
      <h1>登录</h1>
      <p class="muted">使用你的账户继续</p>
      <van-notice-bar v-if="error" type="danger" mode="closeable" :text="error" @close="error = ''" />
      <van-form @submit="submit">
        <van-cell-group inset>
          <van-field v-model="email" name="email" label="邮箱" placeholder="邮箱" required :rules="[{ required: true, message: '请输入邮箱' }, { pattern: /.+@.+/, message: '邮箱格式不正确' }]">
            <template #left-icon><AppIcon name="mail" /></template>
          </van-field>
          <van-field v-model="password" name="password" label="密码" :type="passwordVisible ? 'text' : 'password'" placeholder="密码" required :rules="[{ required: true, message: '请输入密码' }]">
            <template #left-icon><AppIcon name="lock" /></template>
            <template #right-icon><AppIcon :name="passwordVisible ? 'eye-off' : 'eye'" @click="passwordVisible = !passwordVisible" /></template>
          </van-field>
        </van-cell-group>
        <div class="login-options"><van-checkbox v-model="remember">记住我</van-checkbox><a href="#" @click.prevent="showToast('链接已发送')">忘记密码</a></div>
        <van-button block type="primary" native-type="submit" :loading="loading" loading-text="登录中">登录</van-button>
      </van-form>
      <van-divider>或</van-divider>
      <div class="oauth-list">
        <van-button v-for="label in ['Google', 'GitHub', '微信']" :key="label" plain block @click="showToast(`${label} 登录`)"><template #icon><AppIcon name="globe" /></template>{{ label }}</van-button>
      </div>
      <p class="login-footer muted">还没有账户？<a href="#" @click.prevent="showToast('注册')">注册</a></p>
    </div>
  </main>
</template>

<style scoped>
.login-page { display: grid; place-items: center; min-height: 100vh; padding: 20px; }
.login-card { width: min(100%, 420px); padding: 10px; }
.login-brand { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
.login-card h1 { margin: 0; font-size: 28px; }
.login-card p { margin: 8px 0 18px; }
.login-options { display: flex; justify-content: space-between; align-items: center; margin: 14px 4px 18px; font-size: 14px; }
.oauth-list { display: grid; gap: 10px; }
.login-footer { text-align: center; margin-bottom: 4px !important; }
</style>
