import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Checkbox, Divider, Form, Heading, Input, InputGroup, Message, Panel, PasswordInput, Schema, Text } from "rsuite"
import { Icon } from "@/components/icon"

export function LoginPage() {
  const [submitting, setSubmitting] = useState(false)
  const model = useMemo(() => Schema.Model({
    email: Schema.Types.StringType().isEmail("请输入有效邮箱").isRequired("请输入邮箱"),
    password: Schema.Types.StringType().minLength(6, "密码至少需要 6 位").isRequired("请输入密码"),
  }), [])
  return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16, background: "var(--rs-bg-well)" }}><Panel bordered style={{ width: "100%", maxWidth: 420 }} header={<Link to="/" style={{ textDecoration: "none", fontWeight: 700 }}><b className="brand-letter" style={{ width: 32, height: 32, borderRadius: 8, marginRight: 8 }}>A</b>Acme Console</Link>}>
    <Heading level={3}>欢迎回来</Heading><Text muted>登录 Acme Console，继续你的工作。</Text><Message type="error" showIcon style={{ margin: "20px 0" }}>密码错误时会在这里显示验证错误。</Message>
    <Form fluid model={model} onSubmit={() => { setSubmitting(true); window.setTimeout(() => setSubmitting(false), 600) }}><Form.Group controlId="email"><Form.ControlLabel>邮箱</Form.ControlLabel><InputGroup inside><InputGroup.Addon><Icon name="user" /></InputGroup.Addon><Form.Control name="email" accepter={Input} type="email" placeholder="you@example.com" /></InputGroup><Form.HelpText>使用工作邮箱登录。</Form.HelpText></Form.Group><Form.Group controlId="password"><Form.ControlLabel>密码</Form.ControlLabel><Form.Control name="password" accepter={PasswordInput} placeholder="请输入密码" /></Form.Group><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Checkbox>记住我</Checkbox><Link to="#forgot">忘记密码？</Link></div><Button appearance="primary" type="submit" block loading={submitting}>登录</Button></Form>
    <Divider>或</Divider><div className="demo-row"><Button appearance="default" block><Icon name="globe" /> Google</Button><Button appearance="default" block><Icon name="github" /> GitHub</Button><Button appearance="default" block><Icon name="message-circle" /> 微信</Button></div><Text muted style={{ display: "block", textAlign: "center", marginTop: 20 }}>还没有账户？ <Link to="#register">立即注册</Link></Text>
  </Panel></div>
}
