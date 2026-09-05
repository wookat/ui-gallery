import { useState } from "react"
import { Link } from "react-router-dom"
import { Alert, Button, Card, Checkbox, Divider, Form, Input, Message, Space, Typography } from "@arco-design/web-react"
import { Icon } from "@/components/icon"

export function LoginPage() {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const submit = () => {
    setLoading(true)
    window.setTimeout(() => { setLoading(false); Message.success("登录成功") }, 600)
  }
  return (
    <div className="login-page">
      <Card className="login-card">
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          <Link className="brand" to="/"><span className="brand-mark">A</span>Acme Console</Link>
          <div>
            <Typography.Title heading={2}>欢迎回来</Typography.Title>
            <Typography.Text type="secondary">登录 Acme Console，继续你的工作。</Typography.Text>
          </div>
          <Alert type="error" title="演示错误状态" content="密码错误时会在这里显示验证错误。" />
          <Form layout="vertical" onSubmit={submit}>
            <Form.Item label="邮箱" field="email" rules={[{ required: true, message: "请输入邮箱" }, { type: "email", message: "邮箱格式不正确" }]}>
              <Input prefix={<Icon name="user" />} placeholder="you@example.com" />
            </Form.Item>
            <Form.Item label="密码" field="password" rules={[{ required: true, message: "请输入密码" }]}>
              <Input.Password prefix={<Icon name="lock" />} placeholder="••••••••" visibilityToggle={!visible} onVisibilityChange={setVisible} />
            </Form.Item>
            <div className="between"><Checkbox>记住我</Checkbox><Link to="#forgot">忘记密码？</Link></div>
            <Button htmlType="submit" type="primary" long loading={loading} style={{ marginTop: 16 }}>登录</Button>
          </Form>
          <Divider>或</Divider>
          <Space wrap style={{ width: "100%" }}>
            <Button type="secondary" icon={<Icon name="globe" />}>Google</Button>
            <Button type="secondary" icon={<Icon name="github" />}>GitHub</Button>
            <Button type="secondary" icon={<Icon name="message-circle" />}>微信</Button>
          </Space>
          <Typography.Text type="secondary" style={{ textAlign: "center", display: "block" }}>还没有账户？ <Link to="#register">立即注册</Link></Typography.Text>
        </Space>
      </Card>
    </div>
  )
}
