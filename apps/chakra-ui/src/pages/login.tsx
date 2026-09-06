import { useState, type FormEvent } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Icon as GalleryIcon } from "@ui-gallery/icons-react"
import { Alert, Box, Button, Card, Checkbox, Field, Flex, IconButton, Input, InputGroup, Link, Separator, Stack, Text } from "@chakra-ui/react"
import { Logo, SectionDivider } from "./shared"

function Icon({ name, width, height, size }: { name: string; width?: string; height?: string; size?: string | number }) {
  return <GalleryIcon name={name} size={size ?? width ?? height} />
}

export function LoginPage() {
  const [visible, setVisible] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    setLoading(true)
    window.setTimeout(() => setLoading(false), 500)
  }
  return (
    <Flex minH="100vh" align="center" justify="center" bg="bg.subtle" p="4">
      <Card.Root width="full" maxW="md">
        <Card.Header gap="4"><RouterLink to="/"><Logo /></RouterLink><Box><Card.Title fontSize="2xl">欢迎回来</Card.Title><Card.Description>登录 Acme Console，继续你的工作。</Card.Description></Box></Card.Header>
        <Card.Body>
          <Stack gap="5">
            {submitted ? <Alert.Root status="error"><Alert.Indicator /><Alert.Content><Alert.Title>请检查输入</Alert.Title><Alert.Description>邮箱和密码不能为空。</Alert.Description></Alert.Content></Alert.Root> : null}
            <form onSubmit={submit}>
              <Stack gap="4">
                <Field.Root invalid={submitted}><Field.Label>邮箱</Field.Label><InputGroup startElement={<Icon name="user" width="16" height="16" />}><Input type="email" placeholder="you@example.com" /></InputGroup>{submitted ? <Field.ErrorText>请输入邮箱</Field.ErrorText> : <Field.HelperText>使用工作邮箱登录。</Field.HelperText>}</Field.Root>
                <Field.Root invalid={submitted}><Field.Label>密码</Field.Label><InputGroup endElement={<IconButton aria-label="切换密码可见性" variant="ghost" onClick={() => setVisible((value) => !value)}><Icon name={visible ? "eye-off" : "eye"} width="16" height="16" /></IconButton>}><Input type={visible ? "text" : "password"} placeholder="••••••••" /></InputGroup>{submitted ? <Field.ErrorText>请输入密码</Field.ErrorText> : null}</Field.Root>
                <Flex justify="space-between" align="center" gap="3"><Checkbox.Root><Checkbox.HiddenInput /><Checkbox.Control /><Checkbox.Label fontSize="sm">记住我</Checkbox.Label></Checkbox.Root><Link asChild fontSize="sm" minH="10" alignItems="center"><RouterLink to="#forgot">忘记密码？</RouterLink></Link></Flex>
                <Button type="submit" width="full" loading={loading} loadingText="登录中">登录</Button>
              </Stack>
            </form>
            <SectionDivider label="或" />
            <Flex gap="2" direction={{ base: "column", sm: "row" }}><Button variant="outline" flex={{ base: "0 0 auto", sm: "1" }} width={{ base: "full", sm: "auto" }}><Icon name="globe" width="16" height="16" />Google</Button><Button variant="outline" flex={{ base: "0 0 auto", sm: "1" }} width={{ base: "full", sm: "auto" }}><Icon name="github" width="16" height="16" />GitHub</Button><Button variant="outline" flex={{ base: "0 0 auto", sm: "1" }} width={{ base: "full", sm: "auto" }}><Icon name="message-circle" width="16" height="16" />微信</Button></Flex>
            <Separator />
            <Text textAlign="center" fontSize="sm" color="fg.muted">还没有账户？ <Link asChild color="fg" minH="10" alignItems="center"><RouterLink to="#register">立即注册</RouterLink></Link></Text>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Flex>
  )
}
