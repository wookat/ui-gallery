<script setup lang="ts">
import { reactive, ref } from "vue"
import { ElMessage, type FormInstance } from "element-plus"
import Icon from "@/icons/Icon.vue"
const form = reactive({ email: "", password: "", remember: false })
const loading = ref(false)
const failed = ref(false)
const formRef = ref<FormInstance>()
const rules = {
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email" as const, message: "请输入有效邮箱", trigger: "blur" },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
}
const submit = () => {
  formRef.value?.validate((ok) => {
    if (!ok) return
    failed.value = true
    loading.value = true
    window.setTimeout(() => {
      loading.value = false
      ElMessage.success("演示登录已提交")
    }, 1200)
  })
}
</script>

<template>
  <main class="login-page">
    <el-alert v-if="failed" title="演示环境无法连接认证服务，请检查输入后重试。" type="error" closable show-icon class="login-alert" />
    <el-card class="login-card">
      <div class="login-brand">
        <span class="brand-mark">A</span>
        <h1>Acme Console</h1>
      </div>
      <p class="muted">登录控制台，管理你的团队工作。</p>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="login-form" @submit.prevent="submit">
        <el-form-item label="邮箱" prop="email"
          ><el-input v-model="form.email" placeholder="you@example.com"
            ><template #prefix><Icon name="user" /></template></el-input
        ></el-form-item>
        <el-form-item label="密码" prop="password"
          ><el-input v-model="form.password" type="password" show-password placeholder="请输入密码"
            ><template #prefix><Icon name="lock" /></template></el-input
        ></el-form-item>
        <div class="login-options">
          <el-checkbox v-model="form.remember">记住我</el-checkbox><el-link type="primary">忘记密码？</el-link>
        </div>
        <el-button type="primary" native-type="submit" class="full-width" :loading="loading">登录</el-button>
      </el-form>
      <el-divider>或</el-divider>
      <div class="oauth">
        <el-button plain><Icon name="google" /> Google</el-button><el-button plain><Icon name="github" /> GitHub</el-button
        ><el-button plain><Icon name="wechat" /> 微信</el-button>
      </div>
      <p class="register muted">还没有账号？<el-link type="primary">注册</el-link></p>
    </el-card>
  </main>
</template>

<style scoped>
.login-page {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 24px;
  background: var(--el-bg-color-page);
}
.login-card {
  width: min(100%, 420px);
}
.login-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.login-brand h1 {
  margin: 0;
  font-size: 24px;
}
.brand-mark {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 10px;
  background: var(--el-color-primary);
  color: #fff;
  font-weight: 700;
  font-size: 20px;
}
.login-form {
  margin-top: 22px;
}
.login-options,
.oauth {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.oauth {
  justify-content: center;
  flex-wrap: wrap;
}
.oauth :deep(.el-button > span) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.register {
  text-align: center;
  margin: 20px 0 0;
}
.login-alert {
  position: fixed;
  top: 20px;
  width: min(90%, 600px);
  z-index: 2;
}
.login-card :deep(.el-divider__text) {
  background-color: var(--el-card-bg-color);
}
</style>
