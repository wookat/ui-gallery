import { useState } from "react"
import { Link } from "react-router-dom"
import { Icon } from "@ui-gallery/icons-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldLabel, FieldSeparator, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"

export function LoginPage() {
  const [visible, setVisible] = useState(false)
  return (
    <div className="grid min-h-svh place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <Link className="flex items-center gap-2 font-semibold no-underline" to="/"><span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">A</span>Acme Console</Link>
          <div><CardTitle className="text-2xl">欢迎回来</CardTitle><CardDescription>登录 Acme Console，继续你的工作。</CardDescription></div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive"><Icon name="alert-circle" /><AlertTitle>演示错误状态</AlertTitle><AlertDescription>密码错误时会在这里显示验证错误。</AlertDescription></Alert>
          <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
            <FieldSet>
              <Field><FieldLabel htmlFor="email">邮箱</FieldLabel><FieldContent><Input id="email" type="email" placeholder="you@example.com" required /><FieldDescription>使用工作邮箱登录。</FieldDescription></FieldContent></Field>
              <Field><FieldLabel htmlFor="password">密码</FieldLabel><FieldContent><InputGroup><InputGroupAddon><Icon name="lock" size={16} /></InputGroupAddon><InputGroupInput id="password" type={visible ? "text" : "password"} placeholder="••••••••" required /><InputGroupButton type="button" size="icon-sm" variant="ghost" onClick={() => setVisible((value) => !value)}><Icon name={visible ? "eye-off" : "eye"} /></InputGroupButton></InputGroup></FieldContent></Field>
            </FieldSet>
            <div className="flex items-center justify-between gap-4"><label className="flex items-center gap-2 text-sm"><Checkbox />记住我</label><Link className="text-sm underline" to="#forgot">忘记密码？</Link></div>
            <Button className="w-full" type="submit">登录</Button>
          </form>
          <FieldSeparator>或</FieldSeparator>
          <div className="grid gap-2 sm:grid-cols-3"><Button variant="outline"><Icon name="globe" />Google</Button><Button variant="outline"><Icon name="github" />GitHub</Button><Button variant="outline"><Icon name="message-circle" />微信</Button></div>
          <Separator />
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">还没有账户？ <Link className="ml-1 text-foreground underline" to="#register">立即注册</Link></CardFooter>
      </Card>
    </div>
  )
}
