import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Alert, Button, Card, Checkbox, Divider, Form, Input, Space, Typography } from "tdesign-react"
import { Icon } from "@/components/icon"

export function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const formRef = useRef<{ validate: () => Promise<unknown> }>(null)
  const submit = async () => {
    setFailed(false)
    try {
      await formRef.current?.validate()
      setLoading(true)
      window.setTimeout(() => {
        setLoading(false)
        setFailed(true)
      }, 1200)
    } catch {
      setFailed(false)
    }
  }
  return (
    <div className="login-page">
      <Card className="login-card">
        <div className="logo-placeholder">A</div>
        <Typography.Title level="h3" style={{ textAlign: "center", margin: 0 }}>Acme Console</Typography.Title>
        <Typography.Paragraph style={{ textAlign: "center", color: "var(--td-text-color-secondary)" }}>登录以继续管理你的工作区</Typography.Paragraph>
        {failed && <Alert theme="error" message="邮箱或密码错误" closeBtn onClose={() => setFailed(false)} />}
        <Form ref={formRef as never} onSubmit={submit} colon={false} requiredMark>
          <Form.FormItem label="邮箱" name="email" rules={[{ required: true, message: "请输入邮箱" }, { email: true, message: "请输入有效邮箱" }]}>
            <Input prefixIcon={<Icon name="user" />} placeholder="you@example.com" />
          </Form.FormItem>
          <Form.FormItem label="密码" name="password" rules={[{ required: true, message: "请输入密码" }, { min: 6, message: "密码至少 6 位" }]}>
            <Input type={passwordVisible ? "text" : "password"} suffixIcon={<Button variant="text" shape="square" onClick={() => setPasswordVisible(!passwordVisible)}><Icon name={passwordVisible ? "eye-off" : "eye"} /></Button>} placeholder="请输入密码" />
          </Form.FormItem>
          <div className="inline" style={{ justifyContent: "space-between", marginBottom: 16 }}>
            <Checkbox>记住我</Checkbox>
            <Link to="/login">忘记密码</Link>
          </div>
          <Button block theme="primary" loading={loading} onClick={submit}>登录</Button>
        </Form>
        <Divider>或</Divider>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button block variant="outline" icon={<Icon name="globe" />}>使用 Google 登录</Button>
          <Button block variant="outline" icon={<Icon name="github" />}>使用 GitHub 登录</Button>
          <Button block variant="outline" icon={<Icon name="message-circle" />}>使用微信登录</Button>
        </Space>
        <Typography.Paragraph style={{ textAlign: "center", margin: "20px 0 0" }}>还没有账号？ <Link to="/login">注册</Link></Typography.Paragraph>
      </Card>
    </div>
  )
}
