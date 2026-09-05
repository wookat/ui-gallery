import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { Banner, Button, Checkbox, FormControl, Heading, IconButton, Text, TextInput } from "@primer/react"
import { iconFor } from "@/lib/icon"

export function LoginPage() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})
  const [loading, setLoading] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const next: typeof errors = {}
    if (!email.trim()) next.email = "请输入邮箱"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "邮箱格式不正确"
    if (!password) next.password = "请输入密码"
    else if (password.length < 8) next.password = "密码至少 8 位"
    if (Object.keys(next).length) { setErrors(next); return }
    setErrors({})
    setLoading(true)
    window.setTimeout(() => { setLoading(false); setErrors({ form: "邮箱或密码错误，请重试。" }) }, 900)
  }

  return (
    <div className="auth-page">
      <section className="card auth-card">
        <div className="stack-4">
          <Link className="brand flex items-center gap-2" to="/"><span className="brand-mark">A</span>Acme Console</Link>
          <div>
            <Heading as="h1" style={{ fontSize: 24 }}>欢迎回来</Heading>
            <Text as="p" className="muted" style={{ margin: "4px 0 0" }}>登录 Acme Console，继续你的工作。</Text>
          </div>
          {errors.form ? <Banner variant="critical" title="登录失败" description={errors.form} onDismiss={() => setErrors({})} /> : null}
          <form className="stack-4" noValidate onSubmit={submit}>
            <FormControl required>
              <FormControl.Label>邮箱</FormControl.Label>
              <TextInput type="email" autoComplete="email" placeholder="you@example.com" block leadingVisual={iconFor("mail")} value={email} onChange={(e) => setEmail(e.target.value)} validationStatus={errors.email ? "error" : undefined} />
              {errors.email ? <FormControl.Validation variant="error">{errors.email}</FormControl.Validation> : <FormControl.Caption>使用工作邮箱登录。</FormControl.Caption>}
            </FormControl>
            <FormControl required>
              <FormControl.Label>密码</FormControl.Label>
              <TextInput
                type={visible ? "text" : "password"}
                autoComplete="current-password"
                placeholder="至少 8 位"
                block
                leadingVisual={iconFor("lock")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                validationStatus={errors.password ? "error" : undefined}
                trailingAction={<TextInput.Action aria-label={visible ? "隐藏密码" : "显示密码"} icon={iconFor(visible ? "eye-off" : "eye")} onClick={() => setVisible((value) => !value)} />}
              />
              {errors.password ? <FormControl.Validation variant="error">{errors.password}</FormControl.Validation> : null}
            </FormControl>
            <div className="flex items-center justify-between gap-3">
              <FormControl><Checkbox defaultChecked /><FormControl.Label>记住我</FormControl.Label></FormControl>
              <Link to="#forgot">忘记密码？</Link>
            </div>
            <Button variant="primary" block type="submit" loading={loading}>登录</Button>
          </form>
          <div className="divider-text muted"><span />或<span /></div>
          <div className="grid grid-3 oauth-grid">
            <Button leadingVisual={iconFor("globe")}>Google</Button>
            <Button leadingVisual={iconFor("mark-github")}>GitHub</Button>
            <Button leadingVisual={iconFor("message-circle")}>微信</Button>
          </div>
          <Text as="p" className="muted" style={{ textAlign: "center", margin: 0 }}>还没有账户？ <Link to="#register">立即注册</Link></Text>
        </div>
      </section>
      <IconButton className="auth-help" size="large" aria-label="帮助" icon={iconFor("question")} />
    </div>
  )
}
