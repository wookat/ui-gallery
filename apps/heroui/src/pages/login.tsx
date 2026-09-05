import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Button, Card, Checkbox, Description, Form, InputGroup, Label, Link, TextField } from "@heroui/react"
import { Icon } from "@/components/icon"
import { SectionDivider } from "./shared"

export function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (!String(data.get("email")).includes("@")) { setError("请输入有效的邮箱地址"); return }
    if (String(data.get("password")).length < 6) { setError("密码至少 6 位"); return }
    setError(null); setLoading(true)
    setTimeout(() => navigate("/"), 600)
  }

  return (
    <div className="grid min-h-svh bg-background text-foreground lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-surface-secondary p-10 lg:flex">
        <div className="flex items-center gap-2 font-semibold"><span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground">A</span>Acme Console</div>
        <blockquote className="space-y-2"><p className="text-lg">“把团队的工作放进一个控制台。”</p><footer className="text-sm text-muted">Acme Console · HeroUI 参考实现</footer></blockquote>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg lg:p-2">
          <Card.Header><Card.Title className="text-3xl font-semibold tracking-tight">欢迎回来</Card.Title><Card.Description>输入邮箱与密码进入控制台。</Card.Description></Card.Header>
          <Card.Content>
            <Form onSubmit={submit} className="space-y-4">
              {error ? <Alert status="danger"><Alert.Indicator /><Alert.Content><Alert.Title>登录失败</Alert.Title><Alert.Description>{error}</Alert.Description></Alert.Content></Alert> : null}
              <TextField name="email" type="email" isRequired defaultValue="m0@acme.dev">
                <Label>邮箱</Label>
                <InputGroup><InputGroup.Prefix><Icon name="mail" size={16} className="text-muted" /></InputGroup.Prefix><InputGroup.Input placeholder="you@acme.dev" /></InputGroup>
              </TextField>
              <TextField name="password" type={showPassword ? "text" : "password"} isRequired>
                <div className="flex items-center justify-between"><Label>密码</Label><Link href="#" className="text-xs">忘记密码？</Link></div>
                <InputGroup>
                  <InputGroup.Input placeholder="••••••" />
                  <InputGroup.Suffix className="pr-0"><Button isIconOnly variant="ghost" size="sm" className="size-10 min-h-10 min-w-10 text-muted" aria-label={showPassword ? "隐藏密码" : "显示密码"} aria-pressed={showPassword} onPress={() => setShowPassword((v) => !v)}><Icon name={showPassword ? "eye-off" : "eye"} size={18} /></Button></InputGroup.Suffix>
                </InputGroup>
                <Description>至少 6 位字符</Description>
              </TextField>
              <Checkbox defaultSelected name="remember"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>记住我</Checkbox.Content></Checkbox>
              <Button type="submit" fullWidth isPending={loading}>登录</Button>
              <SectionDivider label="或使用" />
              <div className="grid grid-cols-3 gap-2">
                <Button variant="secondary" onPress={() => navigate("/")}><Icon name="google" size={16} />Google</Button>
                <Button variant="secondary" onPress={() => navigate("/")}><Icon name="github" size={16} />GitHub</Button>
                <Button variant="secondary" onPress={() => navigate("/")}><Icon name="wechat" size={16} />微信</Button>
              </div>
            </Form>
          </Card.Content>
          <Card.Footer className="justify-center text-sm text-muted">还没有账号？<Link href="#" className="ml-1">申请试用</Link></Card.Footer>
        </Card>
      </div>
    </div>
  )
}
