import * as React from "react"
import { cn } from "cn"
import { Link, useNavigate } from "react-router-dom"
import { RotateCcwIcon } from "lucide-react"

import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckboxField } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { TextDivider } from "@/components/ui/separator"
import { toast } from "@/components/ui/sonner"
import { BrandMark } from "@/components/composed/brand"
import { t } from "@/data/content"
import { mock } from "@/data/mock"
import { useScreenState } from "@/data/screen-state"

/**
 * /login —— design/hifi/login/index.html 的实现。
 * URL：?state=default|invalid|loading|error|success；error 态另有 ?alert=invalid|locked|network（默认 invalid）。
 * 文案 content/login.md（t("login.*")），演示账号 mock/user.json（demoCredentials），装饰柱高 mock/stats.json 月 GMV 7 点趋势。
 */
const STATES = ["default", "invalid", "loading", "error", "success"] as const
type State = (typeof STATES)[number]

const ALERTS = ["invalid", "locked", "network"] as const
type AlertKind = (typeof ALERTS)[number]
const isAlertKind = (v: string | null): v is AlertKind => !!v && (ALERTS as readonly string[]).includes(v)

/** content/login.md「校验与反馈」：邮箱格式正则、密码最短长度 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN_LENGTH = 8
/** 模拟登录请求耗时（无真实后端，仅让 loading 态可见） */
const SUBMIT_DELAY_MS = 900

const credentials = mock.user.demoCredentials
/** 柱高 = mock/stats.json 月 GMV 7 点趋势按最大值等比（与 hifi .deco-chart 一致） */
const trend = mock.stats.byPeriod.month.gmv.trend
const trendMax = Math.max(...trend)

type Values = { email: string; password: string; remember: boolean }
type Errors = { email?: string; password?: string }

function initialValues(state: State, alert: AlertKind): Values {
  switch (state) {
    case "invalid":
      // hifi：少了顶级域的邮箱 + 6 位（不足 8 位）的密码
      return { email: credentials.email.replace(/\.[^.@]+$/, ""), password: credentials.passwordRule.slice(0, PASSWORD_MIN_LENGTH - 2), remember: false }
    case "loading":
    case "error":
    case "success":
      return { email: alert === "locked" ? credentials.lockedEmail : credentials.email, password: credentials.passwordRule, remember: true }
    default:
      return { email: "", password: "", remember: false }
  }
}

function validateEmail(v: string): string | undefined {
  if (!v.trim()) return "login.error.email.required"
  if (!EMAIL_RE.test(v)) return "login.error.email.format"
}
function validatePassword(v: string): string | undefined {
  if (!v) return "login.error.password.required"
  if (v.length < PASSWORD_MIN_LENGTH) return "login.error.password.short"
}

/** 不可达链接（content：`aria-disabled`，不 404）：保留 href 供语义，点击不跳转 */
const blockNav = (e: React.MouseEvent) => e.preventDefault()

/* 第三方登录单色图标：CC0 simple-icons 路径（brief §「零位图」允许；与 hifi 相同资产），fill=currentColor 取按钮图标色 */
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  )
}
function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}
function WeChatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
    </svg>
  )
}

const OAUTH = [
  { key: "login.oauth.google", Icon: GoogleIcon },
  { key: "login.oauth.github", Icon: GitHubIcon },
  { key: "login.oauth.wechat", Icon: WeChatIcon },
] as const

function Brand({ className }: { className?: string }) {
  return (
    <Link to="/login" aria-label={t("login.brand.name")} className={cn("inline-flex min-h-hit items-center gap-3 self-start rounded-sm text-fg", className)}>
      <BrandMark />
      <span className="text-role-title">{t("login.brand.name")}</span>
    </Link>
  )
}

function Footer({ className }: { className?: string }) {
  const link = "inline-flex min-h-hit items-center text-fg-muted transition-colors duration-(--motion-fast) ease-std hover:text-fg aria-disabled:cursor-not-allowed"
  return (
    <div data-slot="footer" className={cn("flex flex-wrap items-center gap-x-4 text-role-caption text-fg-muted", className)}>
      <a href="/terms" aria-disabled="true" onClick={blockNav} className={link}>
        {t("login.footer.terms")}
      </a>
      <a href="/privacy" aria-disabled="true" onClick={blockNav} className={link}>
        {t("login.footer.privacy")}
      </a>
      <span className="inline-flex min-h-hit items-center">{t("login.footer.copyright")}</span>
    </div>
  )
}

/** 品牌区装饰：抽象「概览卡」几何图，只用令牌色，无文字 */
function Deco() {
  return (
    <div aria-hidden className="grid max-w-form-max gap-4 rounded-lg border bg-bg p-5">
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="grid content-start gap-2 rounded-md border bg-surface p-3">
            <i className="block h-2 w-3/5 rounded-full bg-neutral-soft" />
            <i className="block h-3 w-17/20 rounded-full bg-border-strong opacity-(--opacity-skeleton-shine)" />
            <i className="block h-2 w-2/5 rounded-full bg-primary-soft" />
          </div>
        ))}
      </div>
      <div className="grid h-chart-trend-mobile grid-cols-7 items-end gap-2 rounded-md border bg-surface p-4">
        {trend.map((v, i) => (
          <i key={i} className="block rounded-t-xs bg-primary-soft last:bg-primary" style={{ height: `${Math.round((v / trendMax) * 100)}%` }} />
        ))}
      </div>
    </div>
  )
}

export default function Login() {
  const { state, alert: alertParam, set } = useScreenState(STATES)
  const navigate = useNavigate()
  const alertKind: AlertKind = isAlertKind(alertParam) ? alertParam : "invalid"

  const [values, setValues] = React.useState<Values>(() => initialValues(state, alertKind))
  const [errors, setErrors] = React.useState<Errors>(() =>
    state === "invalid" ? { email: "login.error.email.format", password: "login.error.password.short" } : {},
  )

  /** 真实提交只作组件内瞬态，不写进 URL；?state=loading 仅供截图矩阵复现 */
  const [submitting, setSubmitting] = React.useState(false)
  const busy = state === "loading" || submitting
  const locked = busy || state === "success"
  const showAlert = state === "error"

  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const alertRef = React.useRef<HTMLDivElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  React.useEffect(() => {
    if (showAlert) alertRef.current?.focus()
  }, [showAlert, alertKind])

  React.useEffect(() => {
    if (state !== "success") return
    const id = toast.success(t("login.toast.success", { name: mock.user.shortName }), { duration: Infinity })
    return () => {
      toast.dismiss(id)
    }
  }, [state])

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (key !== "remember") setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const submit = () => {
    const next: Errors = { email: validateEmail(values.email), password: validatePassword(values.password) }
    setErrors(next)
    if (next.email || next.password) {
      ;(next.email ? emailRef : passwordRef).current?.focus()
      return
    }
    setSubmitting(true)
    if (state !== "default") set({ state: null, alert: null })
    timer.current = setTimeout(() => {
      timer.current = null
      setSubmitting(false)
      if (!navigator.onLine) set({ state: "error", alert: "network" })
      else if (values.email === credentials.lockedEmail) set({ state: "error", alert: "locked" })
      else if (values.email === credentials.email) navigate("/?toast=login")
      else set({ state: "error", alert: "invalid" })
    }, SUBMIT_DELAY_MS)
  }

  return (
    <div className="grid min-h-dvh md:grid-cols-[5fr_7fr]">
      <aside aria-label={t("login.brand.name")} className="flex flex-col justify-between gap-12 border-r bg-surface px-12 py-10 max-md:hidden">
        <Brand />
        <div className="flex flex-col gap-8">
          <p className="max-w-[calc(var(--font-size-xl)*16)] text-balance text-role-display text-fg">{t("login.brand.tagline")}</p>
          <Deco />
        </div>
        <Footer />
      </aside>

      <main className="flex items-center justify-center px-6 py-10 max-md:block max-md:min-h-dvh max-md:px-4 max-md:pt-6 max-md:pb-8">
        {/* Card 自带 mobile:p-4（≤768，dashboard 稿）；login 稿 <768 为无卡片 p-0，用同变体叠加覆盖，768 整点仍取 p-8 */}
        <Card
          aria-labelledby="login-title"
          className="w-full max-w-form-max p-8 mobile:p-8 max-md:max-w-none max-md:rounded-none max-md:border-0 max-md:bg-transparent max-md:p-0 mobile:max-md:p-0 max-md:shadow-none"
        >
          <Brand className="mb-8 md:hidden" />

          <h1 id="login-title" className="text-role-heading text-fg">
            {t("login.title")}
          </h1>
          <p className="mt-1 text-fg-muted">{t("login.subtitle")}</p>

          {showAlert && (
            <Alert
              ref={alertRef}
              tabIndex={-1}
              variant={alertKind === "network" ? "warning" : "danger"}
              closeLabel={t("login.alert.close")}
              onClose={() => set({ state: "default", alert: null })}
              className="mt-6"
            >
              <AlertDescription>{t(`login.alert.${alertKind}`)}</AlertDescription>
              {alertKind === "network" && (
                <AlertAction onClick={submit}>
                  <RotateCcwIcon aria-hidden />
                  {t("login.alert.retry")}
                </AlertAction>
              )}
            </Alert>
          )}

          <form
            noValidate
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault()
              if (!locked) submit()
            }}
          >
            <Field>
              <FieldLabel htmlFor="email">{t("login.email.label")}</FieldLabel>
              <Input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                inputMode="email"
                spellCheck={false}
                autoFocus={state === "default"}
                placeholder={t("login.email.placeholder")}
                value={values.email}
                readOnly={locked}
                aria-invalid={!!errors.email || undefined}
                aria-describedby="email-err"
                onChange={(e) => update("email", e.target.value)}
                onBlur={() => setErrors((er) => ({ ...er, email: validateEmail(values.email) }))}
              />
              <FieldError id="email-err">{errors.email && t(errors.email)}</FieldError>
            </Field>

            <Field className="mt-4">
              <FieldLabel htmlFor="password">{t("login.password.label")}</FieldLabel>
              <PasswordInput
                ref={passwordRef}
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder={t("login.password.placeholder")}
                showLabel={t("login.password.show")}
                hideLabel={t("login.password.hide")}
                value={values.password}
                readOnly={locked}
                toggleDisabled={locked}
                aria-invalid={!!errors.password || undefined}
                aria-describedby="password-err"
                onChange={(e) => update("password", e.target.value)}
                onBlur={() => setErrors((er) => ({ ...er, password: validatePassword(values.password) }))}
              />
              <FieldError id="password-err">{errors.password && t(errors.password)}</FieldError>
            </Field>

            <div className="mt-2 flex items-center justify-between gap-2">
              <CheckboxField
                id="remember"
                name="remember"
                label={t("login.remember.label")}
                checked={values.remember}
                disabled={locked}
                onCheckedChange={(c) => update("remember", c === true)}
              />
              <Button variant="link" asChild className="-mr-1">
                <a href="/forgot-password" aria-disabled="true" onClick={blockNav}>
                  {t("login.forgot.link")}
                </a>
              </Button>
            </div>

            {/* 按下不抢焦点：否则邮箱 onBlur 先插入错误行使表单位移，touchend / mouseup 落点离开按钮，click 丢失 */}
            <Button type="submit" variant="primary" block loading={busy} disabled={locked} className="mt-4" onMouseDown={(e) => e.preventDefault()}>
              {busy ? t("login.submit.loading") : t("login.submit")}
            </Button>
          </form>

          <TextDivider className="mt-6 mb-4">{t("login.divider")}</TextDivider>
          <div className="grid gap-2">
            {OAUTH.map(({ key, Icon }) => (
              <Button key={key} type="button" variant="secondary" block disabled={locked}>
                <Icon />
                {t(key)}
              </Button>
            ))}
          </div>

          <p className="mt-4 flex items-center justify-center gap-1 text-fg-muted">
            <span>{t("login.signup.prompt")}</span>
            <Button variant="link" asChild className="whitespace-nowrap">
              <a href="/signup" aria-disabled="true" onClick={blockNav}>
                {t("login.signup.link")}
              </a>
            </Button>
          </p>

          <Footer className="mt-6 justify-center md:hidden" />
        </Card>
      </main>
    </div>
  )
}
