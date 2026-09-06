import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Button,
  Card,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  Separator,
  Spinner,
  Text,
  TextField,
  Callout,
} from "@radix-ui/themes"
import { Icon } from "@/icons"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (!email || !password) return
    setLoading(true)
    window.setTimeout(() => setLoading(false), 1200)
  }
  return (
    <Flex align="center" justify="center" p="4" style={{ minHeight: "100vh" }}>
      <Card size="4" style={{ width: "100%", maxWidth: "400px" }}>
        <Flex direction="column" gap="5">
          <Flex direction="column" align="center" gap="3">
            <Button size="3">A</Button>
            <Heading size="7">Acme Console</Heading>
            <Text color="gray">登录以继续使用控制台</Text>
          </Flex>
          {submitted && (!email || !password) ? (
            <Callout.Root color="red">
              <Callout.Icon>
                <Icon name="alert-circle" />
              </Callout.Icon>
              <Callout.Text>邮箱或密码不正确</Callout.Text>
            </Callout.Root>
          ) : null}
          <form onSubmit={submit}>
            <Flex direction="column" gap="4">
              <label>
                <Text size="2" weight="medium">
                  邮箱
                </Text>
                <TextField.Root
                  mt="1"
                  size="3"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="user@example.com"
                >
                  <TextField.Slot>
                    <Icon name="user" size={16} />
                  </TextField.Slot>
                </TextField.Root>
                {submitted && !email ? (
                  <Text color="red" size="1">
                    请输入邮箱
                  </Text>
                ) : null}
              </label>
              <label>
                <Text size="2" weight="medium">
                  密码
                </Text>
                <TextField.Root
                  mt="1"
                  size="3"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                >
                  <TextField.Slot side="right" style={{ paddingRight: 0 }}>
                    <IconButton
                      size="3"
                      variant="ghost"
                      aria-label={show ? "隐藏密码" : "显示密码"}
                      type="button"
                      onClick={() => setShow((value) => !value)}
                      style={{ minHeight: "40px", minWidth: "40px" }}
                    >
                      <Icon name={show ? "eye-off" : "eye"} size={18} />
                    </IconButton>
                  </TextField.Slot>
                </TextField.Root>
                {submitted && !password ? (
                  <Text color="red" size="1">
                    请输入密码
                  </Text>
                ) : null}
              </label>
              <Flex align="center" justify="between">
                <Text as="label" size="2">
                  <Flex
                    align="center"
                    gap="2"
                    style={{
                      minHeight: "40px",
                      padding: "0 var(--space-2)",
                      cursor: "pointer",
                    }}
                  >
                    <Checkbox size="3" /> 记住我
                  </Flex>
                </Text>
                <Button
                  variant="ghost"
                  size="3"
                  asChild
                  style={{ minHeight: "40px" }}
                >
                  <Link to="#">忘记密码</Link>
                </Button>
              </Flex>
              <Button type="submit" size="3" loading={loading}>
                <Spinner loading={loading} />
                登录
              </Button>
            </Flex>
          </form>
          <Flex align="center" gap="3">
            <Separator size="4" />
            <Text size="1" color="gray">
              或
            </Text>
            <Separator size="4" />
          </Flex>
          <Flex direction="column" gap="2">
            <Button size="3" variant="outline">
              <Icon name="globe" />
              Google
            </Button>
            <Button size="3" variant="outline">
              <Icon name="link" />
              GitHub
            </Button>
            <Button size="3" variant="outline">
              <Icon name="message-circle" />
              微信
            </Button>
          </Flex>
          <Text align="center" size="2">
            还没有账号？{" "}
            <Button
              variant="ghost"
              size="3"
              asChild
              style={{ minHeight: "40px" }}
            >
              <Link to="#">注册</Link>
            </Button>
          </Text>
        </Flex>
      </Card>
    </Flex>
  )
}
