import { useState } from "react"
import { Link } from "react-router-dom"
import { Alert, Anchor, Box, Button, Center, Checkbox, Container, Divider, Group, Paper, PasswordInput, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core"
import { Icon } from "@ui-gallery/icons-react"
import { Brand } from "@/layouts/app-shell"
import { muted } from "./shared"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emailError = submitted && !/^\S+@\S+\.\S+$/.test(email) ? "请输入有效的邮箱地址" : null
  const passwordError = submitted && password.length < 8 ? "密码至少 8 位" : null

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return
    setLoading(true)
    setError(null)
    window.setTimeout(() => {
      setLoading(false)
      setError("邮箱或密码不正确，请重试。")
    }, 1200)
  }

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Center mih="100vh" p={{ base: "md", sm: "xl" }}>
        <Container size={420} w="100%" p={0}>
          <Paper withBorder shadow="sm" radius="md" p={{ base: "lg", sm: "xl" }}>
            <Stack gap="lg">
              <Brand />
              <div>
                <Title order={2}>欢迎回来</Title>
                <Text c={muted} size="sm" mt={4}>登录 Acme Console，继续你的工作。</Text>
              </div>
              {error ? (
                <Alert color="red" variant="light" icon={<Icon name="alert-circle" size={16} />} title="登录失败" withCloseButton onClose={() => setError(null)}>
                  {error}
                </Alert>
              ) : null}
              <form onSubmit={submit} noValidate>
                <Stack gap="md">
                  <TextInput
                    label="邮箱"
                    placeholder="you@example.com"
                    type="email"
                    required
                    leftSection={<Icon name="user" size={16} />}
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    error={emailError}
                  />
                  <PasswordInput
                    label="密码"
                    placeholder="至少 8 位"
                    required
                    leftSection={<Icon name="lock" size={16} />}
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    error={passwordError}
                    rightSectionWidth={44}
                    vars={() => ({ root: { "--psi-button-size": "36px" } })}
                  />
                  <Group justify="space-between">
                    <Checkbox label="记住我" size="sm" />
                    <Anchor component={Link} to="#forgot" size="sm">忘记密码？</Anchor>
                  </Group>
                  <Button type="submit" fullWidth loading={loading}>登录</Button>
                </Stack>
              </form>
              <Divider label="或" labelPosition="center" />
              <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="xs">
                <Button variant="default" leftSection={<Icon name="globe" size={16} />}>Google</Button>
                <Button variant="default" leftSection={<Icon name="link" size={16} />}>GitHub</Button>
                <Button variant="default" leftSection={<Icon name="message-circle" size={16} />}>微信</Button>
              </SimpleGrid>
              <Text size="sm" c={muted} ta="center">
                还没有账户？ <Anchor component={Link} to="#register" size="sm">立即注册</Anchor>
              </Text>
            </Stack>
          </Paper>
        </Container>
      </Center>
    </Box>
  )
}
