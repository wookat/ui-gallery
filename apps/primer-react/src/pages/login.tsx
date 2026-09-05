import { useState } from "react"
import { Link } from "react-router-dom"
import { Banner, Button, Checkbox, FormControl, Heading, IconButton, Text, TextInput } from "@primer/react"
import { iconFor } from "@/lib/icon"

export function LoginPage() {
  const [visible, setVisible] = useState(false)
  return (
    <div className="grid min-h-screen place-items-center" style={{ padding: 16, background: "var(--bgColor-muted)" }}>
      <section className="card" style={{ width: "100%", maxWidth: 448 }}>
        <div className="stack-4">
          <Link className="brand flex items-center gap-2" to="/"><span className="brand-mark">A</span>Acme Console</Link>
          <div>
            <Heading as="h1">欢迎回来</Heading>
            <Text as="p" className="muted">登录 Acme Console，继续你的工作。</Text>
          </div>
          <Banner variant="critical" title="演示错误状态" description="密码错误时会在这里显示验证错误。" />
          <form className="stack-4" onSubmit={(event) => event.preventDefault()}>
            <FormControl required>
              <FormControl.Label>邮箱</FormControl.Label>
              <TextInput type="email" placeholder="you@example.com" block />
              <FormControl.Caption>使用工作邮箱登录。</FormControl.Caption>
            </FormControl>
            <FormControl required>
              <FormControl.Label>密码</FormControl.Label>
              <TextInput type={visible ? "text" : "password"} placeholder="••••••••" block trailingVisual={
                <IconButton aria-label={visible ? "隐藏密码" : "显示密码"} icon={iconFor(visible ? "eye-off" : "eye")} unsafeDisableTooltip onClick={() => setVisible((value) => !value)} />
              } />
            </FormControl>
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2"><Checkbox />记住我</label>
              <Link to="#forgot">忘记密码？</Link>
            </div>
            <Button variant="primary" block type="submit">登录</Button>
          </form>
          <div className="flex items-center gap-3 muted"><span style={{ flex: 1, borderTop: "1px solid var(--borderColor-default)" }} />或<span style={{ flex: 1, borderTop: "1px solid var(--borderColor-default)" }} /></div>
          <div className="grid grid-3">
            <Button leadingVisual={iconFor("globe")}>Google</Button>
            <Button leadingVisual={iconFor("mark-github")}>GitHub</Button>
            <Button leadingVisual={iconFor("message-circle")}>微信</Button>
          </div>
          <Text as="p" className="muted" style={{ textAlign: "center" }}>还没有账户？ <Link to="#register">立即注册</Link></Text>
        </div>
      </section>
    </div>
  )
}
