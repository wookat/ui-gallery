<script lang="ts">
  import Icon from "$lib/icons/Icon.svelte"
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
    submitted = false,
    emailError = "",
    passwordError = ""
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const initialError = new URLSearchParams(window.location.search).get("state") === "error"
  if (initialError) {
    submitted = true
    emailError = "请输入有效的邮箱地址"
    passwordError = "密码长度至少为 6 位"
  }
  async function submit() {
    emailError = emailPattern.test(email) ? "" : "请输入有效的邮箱地址"
    passwordError = password.length >= 6 ? "" : "密码长度至少为 6 位"
    if (emailError || passwordError) {
      submitted = false
      return
    }
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
        <Icon name="sparkles" size={24} />
      </div>
      <div>
        <Card.Title class="text-2xl">欢迎回来</Card.Title><Card.Description
          >登录 Acme Console 管理你的工作台</Card.Description
        >
      </div>
    </Card.Header>
    <Card.Content class="space-y-4">
      {#if emailError || passwordError}
        <Alert.Root variant="destructive"
          ><Alert.Title>请修正表单中的错误</Alert.Title><Alert.Description
            >请检查邮箱和密码后重试。</Alert.Description
          ></Alert.Root
        >
      {:else if submitted}
        <Alert.Root variant="destructive"
          ><Alert.Title>登录失败</Alert.Title><Alert.Description
            >邮箱或密码不正确，请检查后重试。</Alert.Description
          ></Alert.Root
        >
      {/if}
      <div class="space-y-2">
        <label for="login-email" class="text-sm font-medium">邮箱</label><InputGroup.Root
          ><InputGroup.Addon><Icon name="mail" size={16} /></InputGroup.Addon><InputGroup.Input
            id="login-email"
            type="email"
            bind:value={email}
            class="h-10"
            aria-invalid={!!emailError}
            placeholder="you@example.com"
          /></InputGroup.Root
        >{#if emailError}<p class="text-sm text-destructive">{emailError}</p>{/if}
      </div>
      <div class="space-y-2">
        <label for="login-password" class="text-sm font-medium">密码</label><InputGroup.Root
          ><InputGroup.Addon><Icon name="lock" size={16} /></InputGroup.Addon><InputGroup.Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            bind:value={password}
            class="h-10"
            aria-invalid={!!passwordError}
            placeholder="请输入密码"
          /><InputGroup.Button
            class="!size-10 !min-w-10 !p-0"
            data-qa="hit"
            aria-label="显示密码"
            onclick={() => (showPassword = !showPassword)}
            >{#if showPassword}<Icon name="eye-off" size={16} />{:else}<Icon
                name="eye"
                size={16}
              />{/if}</InputGroup.Button
          ></InputGroup.Root
        >
        {#if passwordError}<p class="text-sm text-destructive">{passwordError}</p>{/if}
      </div>
      <div class="flex items-center justify-between text-sm">
        <label class="flex items-center gap-2"
          ><Checkbox.Root bind:checked={remember} />记住我</label
        ><Button variant="link" class="h-10 px-2" href="#forgot" data-qa="hit">忘记密码？</Button>
      </div>
      <Button size="lg" class="h-10 w-full" disabled={loading} onclick={submit}
        >{#if loading}<Icon
            name="loader"
            size={16}
            class="mr-2 animate-spin"
          />登录中...{:else}登录{/if}</Button
      >
      <div class="flex items-center gap-3">
        <Separator.Root class="flex-1" /><span class="text-xs text-muted-foreground">或</span
        ><Separator.Root class="flex-1" />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <Button variant="outline" class="h-10">Google</Button><Button variant="outline" class="h-10"
          ><Icon name="git-branch" size={16} class="mr-1" />GitHub</Button
        ><Button variant="outline" class="h-10">微信</Button>
      </div>
    </Card.Content>
    <Card.Footer class="justify-center text-sm text-muted-foreground"
      >还没有账号？ <Link
        to="/form"
        class="ml-1 inline-flex h-10 items-center px-2 text-primary hover:underline"
        data-qa="hit">立即注册</Link
      ></Card.Footer
    >
  </Card.Root>
</main>
