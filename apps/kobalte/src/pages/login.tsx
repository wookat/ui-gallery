import { createSignal } from "solid-js"
import { A } from "@solidjs/router"
import { Alert } from "@/ui/alert"
import { Button } from "@/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/card"
import { Checkbox } from "@/ui/checkbox"
import { SectionDivider } from "./shared"
import { TextField } from "@/ui/text-field"
import { Icon } from "@/icons"

export function LoginPage() {
  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal("")
  const [submitted, setSubmitted] = createSignal(false)
  const validEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email())
  const submit = (event: SubmitEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (!validEmail() || !password()) return
    setLoading(true)
    setError("")
    window.setTimeout(() => { setLoading(false); setError("邮箱或密码不正确") }, 1200)
  }
 return <div class="grid min-h-screen place-items-center bg-zinc-50 p-4 dark:bg-zinc-950"><Card class="w-full max-w-md"><CardHeader class="space-y-4"><A href="/" class="flex items-center gap-2 font-semibold"><span class="grid size-8 place-items-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">A</span>Acme Console</A><div><CardTitle class="text-2xl">欢迎回来</CardTitle><CardDescription>登录 Acme Console，继续你的工作。</CardDescription></div></CardHeader><CardContent class="space-y-6">{error() ? <Alert level="error"><div class="flex gap-2"><Icon name="alert-circle" size={18} /><span>{error()}</span></div></Alert> : null}<form class="space-y-5" noValidate onSubmit={submit}><TextField label="邮箱" type="email" placeholder="you@example.com" value={email()} required error={submitted() && !validEmail() ? "请输入有效的邮箱地址" : undefined} onInput={(event) => setEmail(event.currentTarget.value)} prefix={<Icon name="mail" size={16} />} /><TextField label="密码" type="password" placeholder="请输入密码" value={password()} required error={submitted() && !password() ? "请输入密码" : undefined} onInput={(event) => setPassword(event.currentTarget.value)} prefix={<Icon name="lock" size={16} />} /><div class="flex items-center justify-between gap-4"><Checkbox label="记住我" /><A href="#forgot" class="inline-flex min-h-10 items-center px-1 text-sm text-blue-600 hover:underline dark:text-blue-400">忘记密码？</A></div><Button type="submit" class="w-full" loading={loading()}>登录</Button></form><SectionDivider label="或" /><div class="grid gap-2 sm:grid-cols-3"><Button variant="outline"><Icon name="globe" size={16} />Google</Button><Button variant="outline"><Icon name="github" size={16} />GitHub</Button><Button variant="outline"><Icon name="message-circle" size={16} />微信</Button></div></CardContent><CardFooter class="justify-center text-sm text-zinc-500">还没有账户？ <A href="#register" class="ml-1 inline-flex min-h-10 items-center px-1 text-zinc-900 underline dark:text-zinc-100">立即注册</A></CardFooter></Card></div>
}
