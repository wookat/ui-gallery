import { useState } from "react"
import { Link } from "react-router-dom"
import { Icon } from "@ui-gallery/icons-react"

export function LoginPage() {
  const [visible, setVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
          <form className="space-y-4" onSubmit={submit}>
            <fieldset className="fieldset"><legend className="fieldset-legend">邮箱</legend><label className="input validator w-full"><Icon name="user" size={16} /><input name="email" type="email" placeholder="you@example.com" required /><span className="sr-only">邮箱</span></label><p className="validator-hint">请输入有效的工作邮箱。</p></fieldset>
            <fieldset className="fieldset"><legend className="fieldset-legend">密码</legend><label className="input w-full"><Icon name="lock" size={16} /><input name="password" type={visible ? "text" : "password"} placeholder="••••••••" minLength={8} required /><button type="button" className="btn btn-ghost btn-xs" onClick={() => setVisible((current) => !current)} aria-label="切换密码可见性"><Icon name={visible ? "user" : "lock"} size={15} /></button></label><p className="fieldset-label">至少 8 个字符。</p></fieldset>
            <div className="flex items-center justify-between gap-3 text-sm"><label className="label cursor-pointer gap-2"><input type="checkbox" className="checkbox checkbox-sm" />记住我</label><a className="link link-primary" href="#forgot">忘记密码？</a></div>
            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>{submitting ? <span className="loading loading-spinner loading-sm" /> : null}登录</button>
          </form>
          <div className="divider">或</div>
          <div className="grid gap-2 sm:grid-cols-3"><button className="btn btn-outline"><Icon name="globe" size={16} />Google</button><button className="btn btn-outline"><Icon name="github" size={16} />GitHub</button><button className="btn btn-outline"><Icon name="message-circle" size={16} />微信</button></div>
          <p className="text-center text-sm text-base-content/60">还没有账户？ <a href="#register" className="link link-primary">立即注册</a></p>
        </div>
      </section>
    </main>
  )
}
