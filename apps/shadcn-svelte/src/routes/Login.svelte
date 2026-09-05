<script lang="ts">
  import { Mail, Eye, EyeOff, GitBranch, LoaderCircle, Lock, Sparkles } from "@lucide/svelte"
  import { Button } from "$lib/components/ui/button"
  import * as Card from "$lib/components/ui/card"
  import * as Checkbox from "$lib/components/ui/checkbox"
  import * as InputGroup from "$lib/components/ui/input-group"
  import * as Alert from "$lib/components/ui/alert"
  import * as Separator from "$lib/components/ui/separator"
  import Link from "$lib/Link.svelte"
  let email = "",
    password = "",
    remember = true,
    showPassword = false,
    loading = false,
    submitted = false
  async function submit() {
    loading = true
    submitted = false
    await new Promise((resolve) => setTimeout(resolve, 1200))
    loading = false
    submitted = true
  }
</script>

<main class="flex min-h-screen items-center justify-center bg-muted/30 p-4">
  <Card.Root class="w-full max-w-md">
    <Card.Header class="space-y-4 text-center">
      <div
        class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
      >
        <Sparkles />
      </div>
      <div>
        <Card.Title class="text-2xl">欢迎回来</Card.Title><Card.Description
          >登录 Acme Console 管理你的工作台</Card.Description
        >
      </div>
    </Card.Header>
    <Card.Content class="space-y-4">
      {#if submitted}<Alert.Root variant="destructive"
          ><Alert.Title>登录失败</Alert.Title><Alert.Description
            >邮箱或密码不正确，请检查后重试。</Alert.Description
          ></Alert.Root
        >{/if}
      <div class="space-y-2">
        <label for="login-email" class="text-sm font-medium">邮箱</label><InputGroup.Root
          ><InputGroup.Addon><Mail class="size-4" /></InputGroup.Addon><InputGroup.Input
            id="login-email"
            type="email"
            bind:value={email}
            aria-invalid={submitted}
            placeholder="you@example.com"
          /></InputGroup.Root
        >{#if submitted}<p class="text-xs text-destructive">请输入有效的邮箱地址</p>{/if}
      </div>
      <div class="space-y-2">
        <label for="login-password" class="text-sm font-medium">密码</label><InputGroup.Root
          ><InputGroup.Addon><Lock class="size-4" /></InputGroup.Addon><InputGroup.Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            bind:value={password}
            placeholder="请输入密码"
          /><InputGroup.Button aria-label="显示密码" onclick={() => (showPassword = !showPassword)}
            >{#if showPassword}<EyeOff class="size-4" />{:else}<Eye
                class="size-4"
              />{/if}</InputGroup.Button
          ></InputGroup.Root
        >
      </div>
      <div class="flex items-center justify-between text-sm">
        <label class="flex items-center gap-2"
          ><Checkbox.Root bind:checked={remember} />记住我</label
        ><a href="#forgot" class="text-primary hover:underline">忘记密码？</a>
      </div>
      <Button class="w-full" disabled={loading} onclick={submit}
        >{#if loading}<LoaderCircle
            class="mr-2 size-4 animate-spin"
          />登录中...{:else}登录{/if}</Button
      >
      <div class="flex items-center gap-3">
        <Separator.Root class="flex-1" /><span class="text-xs text-muted-foreground">或</span
        ><Separator.Root class="flex-1" />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <Button variant="outline">Google</Button><Button variant="outline"
          ><GitBranch class="mr-1 size-4" />GitHub</Button
        ><Button variant="outline">微信</Button>
      </div>
    </Card.Content>
    <Card.Footer class="justify-center text-sm text-muted-foreground"
      >还没有账号？ <Link to="/form" class="ml-1 text-primary hover:underline">立即注册</Link
      ></Card.Footer
    >
  </Card.Root>
</main>
