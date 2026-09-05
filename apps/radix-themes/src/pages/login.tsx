import { useState } from "react"
import { Link } from "react-router-dom"
import { Button, Card, Checkbox, Flex, Heading, IconButton, Separator, Spinner, Text, TextField, Callout } from "@radix-ui/themes"
import { EnvelopeClosedIcon } from "@radix-ui/react-icons"
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
  return <Flex align="center" justify="center" p="4" style={{ minHeight: "100vh" }}><Card size="4" style={{ width: "100%", maxWidth: "400px" }}><Flex direction="column" gap="5"><Flex direction="column" align="center" gap="3"><Button size="3">A</Button><Heading size="7">Acme Console</Heading><Text color="gray">登录以继续使用控制台</Text></Flex>{submitted && (!email || !password) ? <Callout.Root color="red"><Callout.Icon><Icon name="alert-triangle" /></Callout.Icon><Callout.Text>邮箱或密码不正确</Callout.Text></Callout.Root> : null}<form onSubmit={submit}><Flex direction="column" gap="4"><label><Text size="2" weight="medium">邮箱</Text><TextField.Root mt="1" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="user@example.com"><TextField.Slot><EnvelopeClosedIcon /></TextField.Slot></TextField.Root>{submitted && !email ? <Text color="red" size="1">请输入邮箱</Text> : null}</label><label><Text size="2" weight="medium">密码</Text><TextField.Root mt="1" type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)}><TextField.Slot side="right"><IconButton size="1" variant="ghost" type="button" onClick={() => setShow((value) => !value)}><Icon name={show ? "eye-off" : "eye"} size={15} /></IconButton></TextField.Slot></TextField.Root>{submitted && !password ? <Text color="red" size="1">请输入密码</Text> : null}</label><Flex align="center" justify="between"><Flex align="center" gap="2"><Checkbox /> <Text size="2">记住我</Text></Flex><Link to="#" >忘记密码</Link></Flex><Button type="submit" size="3" loading={loading}><Spinner loading={loading} />登录</Button></Flex></form><Flex align="center" gap="3"><Separator size="4" /><Text size="1" color="gray">或</Text><Separator size="4" /></Flex><Flex direction="column" gap="2"><Button variant="outline">Google</Button><Button variant="outline">GitHub</Button><Button variant="outline">微信</Button></Flex><Text align="center" size="2">还没有账号？ <Link to="#">注册</Link></Text></Flex></Card></Flex>
}
