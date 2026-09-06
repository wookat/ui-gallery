import { useState } from "react"
import { Link } from "react-router-dom"
import { Icon } from "@ui-gallery/icons-react"

export function LoginPage() {
  const [visible, setVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [invalid, setInvalid] = useState<string[]>([])
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const fields = Array.from(event.currentTarget.querySelectorAll<HTMLInputElement>("input[name]"))
    const failed = fields.filter((field) => !field.checkValidity()).map((field) => field.name)
    setInvalid(failed)
    if (failed.length) { fields.find((field) => field.name === failed[0])?.focus(); return }
    setSubmitting(true)
    window.setTimeout(() => setSubmitting(false), 1200)
  }
  return (
    <main className="grid min-h-svh place-items-center bg-base-200 p-4">
      <section className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body gap-5">
          <Link to="/" className="flex items-center gap-2 font-semibold"><span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-content">A</span>Acme Console</Link>
          <div><h1 className="text-2xl font-semibold">欢迎回来</h1><p className="mt-1 text-sm text-base-content/60">登录 Acme Console，继续你的工作。</p></div>
          <div className="alert alert-error"><Icon name="alert-circle" size={18} /><div><h2 className="font-medium">演示错误状态</h2><p className="text-xs">密码错误时会在这里显示验证错误。</p></div></div>
          <form className="space-y-4" onSubmit={submit} noValidate>
            <fieldset className="fieldset"><legend className="fieldset-legend">邮箱</legend><label className={`input validator w-full ${invalid.includes("email") ? "input-error" : ""}`}><Icon name="user" size={16} /><input name="email" aria-invalid={invalid.includes("email")} type="email" placeholder="you@example.com" required aria-label="邮箱" /></label><p className={`validator-hint ${invalid.includes("email") ? "visible" : ""}`}>请输入有效的工作邮箱。</p></fieldset>
            <fieldset className="fieldset"><legend className="fieldset-legend">密码</legend><div className="join w-full"><label className={`input validator join-item min-w-0 flex-1 ${invalid.includes("password") ? "input-error" : ""}`}><Icon name="lock" size={16} /><input name="password" aria-invalid={invalid.includes("password")} type={visible ? "text" : "password"} placeholder="••••••••" minLength={8} required aria-label="密码" /></label><button type="button" className="btn btn-square join-item" onClick={() => setVisible((current) => !current)} aria-label={visible ? "隐藏密码" : "显示密码"} aria-pressed={visible}><Icon name={visible ? "lock" : "user"} size={16} /></button></div><p className={`validator-hint ${invalid.includes("password") ? "visible" : ""}`}>密码至少 8 个字符。</p></fieldset>
            <div className="flex items-center justify-between gap-3 text-sm"><label className="label min-h-10 cursor-pointer gap-2"><input type="checkbox" className="checkbox" />记住我</label><a className="btn btn-link px-0" href="#forgot">忘记密码？</a></div>
            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>{submitting ? <span className="loading loading-spinner loading-sm" /> : null}登录</button>
          </form>
          <div className="divider">或</div>
          <div className="grid gap-2 sm:grid-cols-3"><button className="btn btn-outline"><Icon name="globe" size={16} />Google</button><button className="btn btn-outline"><Icon name="github" size={16} />GitHub</button><button className="btn btn-outline"><Icon name="message-circle" size={16} />微信</button></div>
          <p className="text-center text-sm text-base-content/60">还没有账户？ <a href="#register" className="btn btn-link px-1">立即注册</a></p>
        </div>
      </section>
    </main>
  )
}
