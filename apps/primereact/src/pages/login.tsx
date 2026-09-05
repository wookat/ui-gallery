import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Checkbox } from "primereact/checkbox"
import { Divider } from "primereact/divider"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { Message } from "primereact/message"
import { Password } from "primereact/password"
import { Icon } from "@/components/icon"

export function LoginPage() {
  const [submitted, setSubmitted] = useState(false), [loading, setLoading] = useState(false), [remember, setRemember] = useState(false)
  const submit = (event: React.FormEvent) => { event.preventDefault(); setSubmitted(true); setLoading(true); window.setTimeout(() => setLoading(false), 1200) }
  return <div className="min-h-screen flex align-items-center justify-content-center p-3"><Card className="w-full md:w-30rem" title={<Link to="/" className="hit flex align-items-center gap-2 no-underline text-color"><span className="flex align-items-center justify-content-center border-round bg-primary text-primary-contrast" style={{ width: 32, height: 32 }}>A</span>Acme Console</Link>} subTitle={<div className="mt-4"><h1 className="text-2xl m-0">欢迎回来</h1><p className="font-normal muted">登录 Acme Console，继续你的工作。</p></div>}><div className="flex flex-column gap-4"><Message severity="error" text="演示错误状态：提交空表单时会显示验证错误。" /><form className="flex flex-column gap-3" onSubmit={submit}><label>邮箱<IconField iconPosition="left" className="w-full mt-2"><InputIcon className="pi pi-envelope" /><InputText className={`w-full ${submitted ? "p-invalid" : ""}`} type="email" placeholder="you@example.com" /></IconField>{submitted ? <small className="p-error">请输入工作邮箱。</small> : null}</label><label>密码<Password className="w-full mt-2" inputClassName={`w-full ${submitted ? "p-invalid" : ""}`} toggleMask placeholder="••••••••" feedback={false} />{submitted ? <small className="p-error">请输入密码。</small> : null}</label><div className="flex align-items-center justify-content-between"><label className="hit flex align-items-center gap-2 text-sm"><Checkbox checked={remember} onChange={(e) => setRemember(Boolean(e.checked))} />记住我</label><a href="#forgot" className="hit text-sm">忘记密码？</a></div><Button type="submit" label="登录" loading={loading} /></form><Divider align="center">或</Divider><div className="grid"><Button outlined label="Google" icon={<Icon name="globe" />} className="col" /><Button outlined label="GitHub" icon={<Icon name="github" />} className="col" /><Button outlined label="微信" icon={<Icon name="message-circle" />} className="col" /></div><p className="text-center text-sm muted mb-0">还没有账户？ <a href="#register" className="hit">立即注册</a></p></div></Card></div>
}
