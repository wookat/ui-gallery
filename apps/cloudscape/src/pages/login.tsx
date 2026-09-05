import { useState } from "react"
import Alert from "@cloudscape-design/components/alert"
import Box from "@cloudscape-design/components/box"
import Button from "@cloudscape-design/components/button"
import Checkbox from "@cloudscape-design/components/checkbox"
import Container from "@cloudscape-design/components/container"
import Divider from "@cloudscape-design/components/divider"
import Form from "@cloudscape-design/components/form"
import FormField from "@cloudscape-design/components/form-field"
import Grid from "@cloudscape-design/components/grid"
import Header from "@cloudscape-design/components/header"
import Input from "@cloudscape-design/components/input"
import Link from "@cloudscape-design/components/link"
import SpaceBetween from "@cloudscape-design/components/space-between"

import landing from "@ui-gallery/spec/mock/landing.json"
import nav from "@ui-gallery/spec/mock/nav.json"

import { APP_TITLE } from "@/layouts/app-shell"
import { AppIcon, iconProps } from "@/lib/icons"
import { useAppNav } from "@/lib/nav"

const OAUTH = ["Google", "GitHub", "微信"]

export function LoginPage() {
  const { go, href, follow } = useAppNav()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emailError = touched && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? "请输入有效的邮箱地址" : undefined
  const passwordError = touched && password.length < 8 ? "密码至少 8 位" : undefined

  const submit = () => {
    setTouched(true)
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || password.length < 8) {
      setError("登录失败：请检查表单中的错误")
      return
    }
    setError(null)
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      go("/")
    }, 900)
  }

  return (
    <Box padding={{ vertical: "xxl", horizontal: "s" }}>
      <Grid gridDefinition={[{ colspan: { default: 12, xs: 8, s: 6, m: 4 }, offset: { xs: 2, s: 3, m: 4 } }]}>
        <Container
          header={
            <SpaceBetween size="xs">
              <AppIcon name="boxes" size="big" />
              <Header variant="h1" description={landing.hero.subtitle}>
                登录 {APP_TITLE}
              </Header>
            </SpaceBetween>
          }
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <Form
              actions={
                <Button variant="primary" loading={loading} fullWidth formAction="submit">
                  登录
                </Button>
              }
            >
              <SpaceBetween size="l">
                {error && (
                  <Alert type="error" dismissible onDismiss={() => setError(null)} header="无法登录">
                    {error}
                  </Alert>
                )}
                <FormField label="邮箱" errorText={emailError} stretch>
                  <Input
                    type="email"
                    value={email}
                    placeholder="you@example.com"
                    onChange={({ detail }) => setEmail(detail.value)}
                    prefix={<AppIcon name="user" />}
                    autoComplete="username"
                  />
                </FormField>
                <FormField
                  label="密码"
                  errorText={passwordError}
                  stretch
                >
                  <div className="gallery-input-row">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="至少 8 位"
                      onChange={({ detail }) => setPassword(detail.value)}
                      prefix={<AppIcon name="lock" />}
                      autoComplete="current-password"
                    />
                    <Button formAction="none" ariaLabel={showPassword ? "隐藏密码" : "显示密码"} onClick={() => setShowPassword((v) => !v)}>
                      {showPassword ? "隐藏" : "显示"}
                    </Button>
                  </div>
                </FormField>
                <SpaceBetween direction="horizontal" size="l" alignItems="center">
                  <Checkbox checked={remember} onChange={({ detail }) => setRemember(detail.checked)}>
                    记住我
                  </Checkbox>
                  <Link href="#" variant="secondary">
                    忘记密码？
                  </Link>
                </SpaceBetween>
              </SpaceBetween>
            </Form>
          </form>
          <Box margin={{ vertical: "l" }}>
            <Divider>
              <Box color="text-body-secondary">或</Box>
            </Divider>
          </Box>
          <SpaceBetween size="xs">
            {OAUTH.map((provider) => (
              <Button key={provider} fullWidth {...iconProps("globe")}>
                使用 {provider} 继续
              </Button>
            ))}
          </SpaceBetween>
          <Box textAlign="center" margin={{ top: "l" }} color="text-body-secondary">
            还没有账号？{" "}
            <Link href={href("/landing")} onFollow={follow}>
              注册
            </Link>
            {" · "}
            <Link href={href(nav[0].path)} onFollow={follow}>
              返回{nav[0].label}
            </Link>
          </Box>
        </Container>
      </Grid>
    </Box>
  )
}
