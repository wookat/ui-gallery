import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Callout, Card, Checkbox, Classes, Divider, Elevation, FormGroup, H2, InputGroup, Tooltip } from "@blueprintjs/core"
import { icon } from "@/lib/icons"
import { withParams } from "@/lib/settings"

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emailError = submitted && !/^\S+@\S+\.\S+$/.test(email) ? "请输入有效的邮箱地址" : undefined
  const passwordError = submitted && password.length < 8 ? "密码至少 8 位" : undefined

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    setError(null)
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      if (password === "password") navigate(withParams("/"))
      else setError("邮箱或密码不正确，请重试。")
    }, 900)
  }

  return (
    <div className="login-page">
      <Card className="login-card stack" elevation={Elevation.TWO}>
        <div className="stack-sm" style={{ alignItems: "center", textAlign: "center" }}>
          <span className="avatar lg" style={{ borderRadius: 10 }}>A</span>
          <H2 style={{ margin: 0 }}>登录 Acme Console</H2>
          <p className={Classes.TEXT_MUTED} style={{ margin: 0 }}>使用工作邮箱登录以继续</p>
        </div>
        {error ? <Callout intent="danger" icon={icon("alert-circle")} title="登录失败">{error}</Callout> : null}
        <form className="stack" onSubmit={submit} noValidate>
          <FormGroup label="邮箱" labelFor="email" labelInfo="*" helperText={emailError} intent={emailError ? "danger" : "none"}>
            <InputGroup id="email" type="email" large leftIcon={icon("mail")} placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} intent={emailError ? "danger" : "none"} autoComplete="email" />
          </FormGroup>
          <FormGroup label="密码" labelFor="password" labelInfo="*" helperText={passwordError} intent={passwordError ? "danger" : "none"}>
            <InputGroup
              id="password"
              large
              leftIcon={icon("lock")}
              type={showPassword ? "text" : "password"}
              placeholder="至少 8 位"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              intent={passwordError ? "danger" : "none"}
              autoComplete="current-password"
              rightElement={<Tooltip content={showPassword ? "隐藏密码" : "显示密码"}><Button minimal icon={icon(showPassword ? "eye-off" : "eye")} onClick={() => setShowPassword(!showPassword)} aria-label="切换密码可见性" /></Tooltip>}
            />
          </FormGroup>
          <div className="row-between">
            <Checkbox checked={remember} onChange={(e) => setRemember(e.currentTarget.checked)} label="记住我" style={{ margin: 0 }} />
            <a href="#forgot" onClick={(e) => e.preventDefault()}>忘记密码？</a>
          </div>
          <Button type="submit" intent="primary" large fill loading={loading} icon={icon("log-in")}>登录</Button>
        </form>
        <div className="row" style={{ flexWrap: "nowrap" }}><Divider style={{ flex: 1 }} /><span className={Classes.TEXT_MUTED}>或</span><Divider style={{ flex: 1 }} /></div>
        <div className="stack-sm">
          <Button fill outlined icon={icon("globe")}>使用 Google 登录</Button>
          <Button fill outlined icon={icon("github")}>使用 GitHub 登录</Button>
          <Button fill outlined icon={icon("message-circle")}>使用微信登录</Button>
        </div>
        <p className={Classes.TEXT_MUTED} style={{ textAlign: "center", margin: 0 }}>还没有账号？<a href="#signup" onClick={(e) => e.preventDefault()}>立即注册</a></p>
      </Card>
    </div>
  )
}
