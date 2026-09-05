import { useState, type FormEvent } from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import {
  Body1,
  Button,
  Card,
  Caption1,
  Checkbox,
  Divider,
  Field,
  Input,
  Link,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Title2,
  makeStyles,
  tokens,
} from "@fluentui/react-components"
import { Icon } from "@/lib/icon"
import { Brand } from "@/layouts/app-shell"

const useStyles = makeStyles({
  root: { minHeight: "100vh", display: "grid", placeItems: "center", padding: tokens.spacingHorizontalM, backgroundColor: tokens.colorNeutralBackground3 },
  card: { width: "100%", maxWidth: "420px", padding: tokens.spacingHorizontalXL, display: "flex", flexDirection: "column", gap: tokens.spacingVerticalL },
  form: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalM },
  between: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.spacingHorizontalM, flexWrap: "wrap" },
  oauth: { display: "grid", gap: tokens.spacingHorizontalS, gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" },
  center: { textAlign: "center", color: tokens.colorNeutralForeground3 },
})

export function LoginPage() {
  const s = useStyles()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  const emailError = submitted && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? "请输入有效的邮箱地址" : undefined
  const passwordError = submitted && password.length < 8 ? "密码至少 8 位" : undefined

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || password.length < 8) return
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      if (password === "password") {
        setFailed(true)
        return
      }
      navigate(`/${window.location.search}`)
    }, 900)
  }

  return (
    <div className={s.root}>
      <Card className={s.card}>
        <Brand />
        <div>
          <Title2 as="h1">欢迎回来</Title2>
          <Body1 style={{ color: tokens.colorNeutralForeground3, display: "block" }}>登录 Acme Console，继续你的工作。</Body1>
        </div>
        {failed ? (
          <MessageBar intent="error">
            <MessageBarBody>
              <MessageBarTitle>登录失败</MessageBarTitle>
              邮箱或密码不正确，请重试。
            </MessageBarBody>
          </MessageBar>
        ) : null}
        <form className={s.form} onSubmit={submit} noValidate>
          <Field label="邮箱" required validationMessage={emailError} validationState={emailError ? "error" : "none"}>
            <Input type="email" value={email} onChange={(_, data) => setEmail(data.value)} placeholder="you@example.com" contentBefore={<Icon name="mail" size={16} />} />
          </Field>
          <Field label="密码" required validationMessage={passwordError} validationState={passwordError ? "error" : "none"}>
            <Input
              type={visible ? "text" : "password"}
              value={password}
              onChange={(_, data) => setPassword(data.value)}
              placeholder="••••••••"
              contentBefore={<Icon name="lock" size={16} />}
              contentAfter={<Button appearance="transparent" size="small" type="button" aria-label={visible ? "隐藏密码" : "显示密码"} icon={<Icon name={visible ? "eye-off" : "eye"} size={16} />} onClick={() => setVisible((value) => !value)} />}
            />
          </Field>
          <div className={s.between}>
            <Checkbox label="记住我" />
            <Link href="#forgot">忘记密码？</Link>
          </div>
          <Button appearance="primary" type="submit" disabled={loading} icon={loading ? <Spinner size="tiny" /> : undefined}>
            {loading ? "登录中..." : "登录"}
          </Button>
        </form>
        <Divider>或</Divider>
        <div className={s.oauth}>
          <Button icon={<Icon name="globe" size={16} />}>Google</Button>
          <Button icon={<Icon name="github" size={16} />}>GitHub</Button>
          <Button icon={<Icon name="message-circle" size={16} />}>微信</Button>
        </div>
        <Caption1 className={s.center}>
          还没有账户？ <RouterLink to="#register">立即注册</RouterLink>
        </Caption1>
      </Card>
    </div>
  )
}
