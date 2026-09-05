import { useState } from "react"
import {
  App,
  Avatar,
  Button,
  Card,
  Checkbox,
  Divider,
  Flex,
  Form,
  Input,
  Space,
  Typography,
} from "antd"
import { Icon } from "@/icons"

export function LoginPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()
  const submit = async () => {
    try {
      await form.validateFields()
      setLoading(true)
      window.setTimeout(() => {
        setLoading(false)
        message.success("登录成功")
      }, 1200)
    } catch {
      message.error("请检查邮箱和密码")
    }
  }
  return (
    <div className="public-page login-page">
      <Card style={{ width: "100%", maxWidth: 440 }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Avatar size={48} icon={<Icon name="sparkles" />} />
            <Typography.Title level={2}>Acme Console</Typography.Title>
            <Typography.Text type="secondary">登录你的工作空间</Typography.Text>
          </div>
          <div className="login-error">演示环境：请使用任意有效邮箱登录</div>
          <Form form={form} layout="vertical">
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: "请输入邮箱" },
                { type: "email", message: "请输入有效邮箱" },
              ]}
            >
              <Input
                prefix={<Icon name="user" />}
                placeholder="name@example.com"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password
                prefix={<Icon name="lock" />}
                iconRender={(visible) => (
                  <Icon name={visible ? "eye" : "eye-off"} />
                )}
              />
            </Form.Item>
            <Flex justify="space-between">
              <Checkbox>记住我</Checkbox>
              <Typography.Link>忘记密码？</Typography.Link>
            </Flex>
            <Button
              type="primary"
              block
              loading={loading}
              onClick={submit}
              style={{ marginTop: 16 }}
            >
              登录
            </Button>
          </Form>
          <Divider plain>或</Divider>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Button block icon={<Icon name="google" />}>
              使用 Google 登录
            </Button>
            <Button block icon={<Icon name="github" />}>
              使用 GitHub 登录
            </Button>
            <Button block icon={<Icon name="wechat" />}>
              使用微信登录
            </Button>
          </Space>
          <Typography.Text
            type="secondary"
            style={{ textAlign: "center", display: "block" }}
          >
            还没有账户？<Typography.Link>注册</Typography.Link>
          </Typography.Text>
        </Space>
      </Card>
    </div>
  )
}
