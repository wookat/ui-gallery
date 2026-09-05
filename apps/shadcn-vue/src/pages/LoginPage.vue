<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldLabel, FieldSeparator, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'

const visible = ref(false)
const loading = ref(false)
const error = ref(false)
const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
function submit() {
  emailError.value = !email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? '请输入有效的邮箱地址。' : ''
  passwordError.value = !password.value.trim() ? '请输入密码。' : ''
  if (emailError.value || passwordError.value) return
  loading.value = true
  window.setTimeout(() => { loading.value = false; error.value = true }, 800)
}
</script>

<template>
  <div class="grid min-h-svh place-items-center bg-muted/30 p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-4">
        <RouterLink class="flex items-center gap-2 font-semibold no-underline" to="/"><span class="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">A</span>Acme Console</RouterLink>
        <div><CardTitle class="text-2xl">欢迎回来</CardTitle><CardDescription>登录 Acme Console，继续你的工作。</CardDescription></div>
      </CardHeader>
      <CardContent class="space-y-6">
        <Alert v-if="error" variant="destructive"><Icon name="alert-circle" /><AlertTitle>邮箱或密码不正确</AlertTitle><AlertDescription>请检查登录信息后重试。</AlertDescription></Alert>
        <form class="space-y-5" @submit.prevent="submit">
          <FieldSet>
            <Field><FieldLabel for="email">邮箱</FieldLabel><FieldContent><Input id="email" v-model="email" class="h-10" type="email" placeholder="you@example.com" required :aria-invalid="!!emailError" /><p v-if="emailError" class="text-sm text-destructive">{{ emailError }}</p><FieldDescription>使用工作邮箱登录。</FieldDescription></FieldContent></Field>
            <Field><FieldLabel for="password">密码</FieldLabel><FieldContent><InputGroup><InputGroupAddon><Icon name="lock" :size="16" /></InputGroupAddon><InputGroupInput id="password" v-model="password" class="h-10" :type="visible ? 'text' : 'password'" placeholder="••••••••" required :aria-invalid="!!passwordError" /><InputGroupButton type="button" size="icon-sm" class="min-h-10 min-w-10" variant="ghost" @click="visible = !visible"><Icon :name="visible ? 'eye-off' : 'eye'" /></InputGroupButton></InputGroup><p v-if="passwordError" class="text-sm text-destructive">{{ passwordError }}</p></FieldContent></Field>
          </FieldSet>
          <div class="flex items-center justify-between gap-4"><label class="flex items-center gap-2 text-sm"><Checkbox />记住我</label><RouterLink class="text-sm underline" to="#forgot">忘记密码？</RouterLink></div>
          <Button size="lg" class="min-h-10 w-full" type="submit" :disabled="loading"><Icon v-if="loading" name="loader" class="animate-spin" />{{ loading ? '登录中...' : '登录' }}</Button>
        </form>
        <FieldSeparator>或</FieldSeparator>
        <div class="grid gap-2 sm:grid-cols-3"><Button variant="outline" class="min-h-10"><Icon name="globe" />Google</Button><Button variant="outline" class="min-h-10"><Icon name="github" />GitHub</Button><Button variant="outline" class="min-h-10"><Icon name="message-circle" />微信</Button></div>
      </CardContent>
      <CardFooter class="justify-center text-sm text-muted-foreground">还没有账户？ <RouterLink class="ml-1 text-foreground underline" to="#register">立即注册</RouterLink></CardFooter>
    </Card>
  </div>
</template>
