import { forwardRef, useMemo, useState, type ComponentProps } from "react"
import { Link } from "react-router-dom"
import { Button, Checkbox, Divider, Form, Heading, Input, InputGroup, Message, Panel, Schema, Text } from "rsuite"
import { EyeClose, Visible } from "@rsuite/icons"
import { Icon } from "@/components/icon"

const PasswordField = forwardRef<HTMLInputElement, ComponentProps<typeof Input>>(function PasswordField(props, ref) {
  const [visible, setVisible] = useState(false)
  return <InputGroup size="lg"><Input {...props} ref={ref} size="lg" type={visible ? "text" : "password"} /><InputGroup.Button aria-label={visible ? "隐藏密码" : "显示密码"} onClick={() => setVisible((value) => !value)}>{visible ? <EyeClose /> : <Visible />}</InputGroup.Button></InputGroup>
})
export function LoginPage() {
  const [submitting, setSubmitting] = useState(false)
  const model = useMemo(() => Schema.Model({
    email: Schema.Types.StringType().isEmail("请输入有效邮箱").isRequired("请输入邮箱"),
    password: Schema.Types.StringType().minLength(6, "密码至少需要 6 位").isRequired("请输入密码"),
  }), [])
  return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16, background: "var(--rs-bg-well)" }}><Panel bordered style={{ width: "100%", maxWidth: 420 }} header={<Link to="/" style={{ textDecoration: "none", fontWeight: 700 }}><b className="brand-letter" style={{ width: 32, height: 32, borderRadius: 8, marginRight: 8 }}>A</b>Acme Console</Link>}>
    <Heading level={3}>欢迎回来</Heading><Text muted>登录 Acme Console，继续你的工作。</Text><Message type="error" showIcon style={{ margin: "20px 0" }}>密码错误时会在这里显示验证错误。</Message>
    <Form fluid model={model} onSubmit={() => { setSubmitting(true); window.setTimeout(() => setSubmitting(false), 600) }}><Form.Group controlId="email"><Form.ControlLabel>邮箱</Form.ControlLabel><Form.Control name="email" accepter={Input} size="lg" type="email" placeholder="you@example.com" /><Form.HelpText>使用工作邮箱登录。</Form.HelpText></Form.Group><Form.Group controlId="password"><Form.ControlLabel>密码</Form.ControlLabel><Form.Control name="password" accepter={PasswordField} placeholder="请输入密码" /></Form.Group><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 16 }}><Checkbox>记住我</Checkbox><Link to="#forgot">忘记密码？</Link></div><Button appearance="primary" size="lg" type="submit" block loading={submitting}>登录</Button></Form>
    <Divider>或</Divider><div className="page-stack" style={{ gap: 10 }}>{[{ icon: "globe", label: "Google" }, { icon: "github", label: "GitHub" }, { icon: "message-circle", label: "微信" }].map((item) => <Button key={item.label} appearance="ghost" size="lg" block startIcon={<Icon name={item.icon} />}>使用 {item.label} 登录</Button>)}</div><Text muted style={{ display: "block", textAlign: "center", marginTop: 20 }}>还没有账户？ <Link to="#register">立即注册</Link></Text>
  </Panel></div>
}
