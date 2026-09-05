import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Banner, Button, Card, Checkbox, Divider, Form, Typography } from "@douyinfe/semi-ui"
import { Icon } from "@/icons"
import { Brand } from "@/layouts/app-shell"

const { Title, Text } = Typography

export function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = (values: { email: string; password: string }) => {
    setError(null)
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      if (values.password === "wrong") setError("邮箱或密码不正确，请重试。")
      else navigate("/")
    }, 800)
  }

  return (
    <div className="acme-login">
      <Card style={{ width: "100%", maxWidth: 420 }} bodyStyle={{ padding: 28 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Brand compact /></div>
          <Title heading={3} style={{ margin: 0 }}>登录 Acme Console</Title>
          <Text type="tertiary">使用工作邮箱继续</Text>
        </div>
        {error ? <Banner type="danger" description={error} closeIcon={null} style={{ marginBottom: 12 }} /> : null}
        <Form<{ email: string; password: string }> layout="vertical" onSubmit={submit} initValues={{ email: "m0@acme.dev", password: "" }}>
          <Form.Input field="email" label="邮箱" placeholder="name@company.com" prefix={<Icon name="mail" />} rules={[{ required: true, message: "请输入邮箱" }, { type: "email", message: "邮箱格式不正确" }]} />
          <Form.Input field="password" label={{ text: "密码", extra: <Link to="#">忘记密码？</Link> }} mode="password" placeholder="至少 8 位" prefix={<Icon name="lock" />} rules={[{ required: true, message: "请输入密码" }, { min: 8, message: "密码至少 8 位（输入 wrong 可查看错误态）" }]} />
          <Checkbox defaultChecked style={{ margin: "4px 0 16px" }}>记住我</Checkbox>
          <Button htmlType="submit" theme="solid" type="primary" block size="large" loading={loading}>登录</Button>
        </Form>
        <Divider margin={20}><Text type="tertiary" size="small">或使用以下方式</Text></Divider>
        <div className="acme-grid-3" style={{ gap: 8 }}>
          <Button theme="light" type="tertiary" icon={<Icon name="chrome" />}>Google</Button>
          <Button theme="light" type="tertiary" icon={<Icon name="github" />}>GitHub</Button>
          <Button theme="light" type="tertiary" icon={<Icon name="message-circle" />}>微信</Button>
        </div>
        <Text type="tertiary" style={{ display: "block", textAlign: "center", marginTop: 20 }}>还没有账号？<Link to="#">注册</Link></Text>
      </Card>
    </div>
  )
}
