<script lang="ts">
  import Icon from "../lib/Icon.svelte"
  import { link, router } from "../lib/router.svelte"

  let email = $state("")
  let password = $state("")
  let remember = $state(true)
  let showPassword = $state(false)
  let loading = $state(false)
  let errors = $state<{ email?: string; password?: string }>({})
  let formError = $state("")
  let attempts = $state(0)

  function validate() {
    const next: typeof errors = {}
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = "请输入有效的邮箱地址"
    if (password.length < 6) next.password = "密码至少 6 位"
    errors = next
    return Object.keys(next).length === 0
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault()
    formError = ""
    if (!validate()) return
    loading = true
    await new Promise((r) => setTimeout(r, 900))
    loading = false
    attempts += 1
    if (attempts % 2 === 1) {
      formError = "邮箱或密码不正确，请重试。"
      return
    }
    router.navigate("/")
  }
</script>

<main class="min-h-screen grid place-items-center p-4 bg-surface-100-900">
  <div class="w-full max-w-md space-y-4">
    <div class="flex items-center justify-center gap-2">
      <span class="btn-icon preset-filled-primary-500 font-bold">A</span>
      <span class="text-xl font-bold">Acme Console</span>
    </div>

    {#if formError}
      <div class="card preset-tonal-error p-3 flex items-start gap-3" role="alert">
        <Icon name="alert-circle" class="size-5 shrink-0 mt-0.5" />
        <div class="flex-1 text-sm">
          <p class="font-bold">登录失败</p>
          <p>{formError}</p>
        </div>
        <button type="button" class="btn-icon min-w-10 min-h-10 hover:preset-tonal" aria-label="关闭" onclick={() => (formError = "")}><Icon name="x" /></button>
      </div>
    {/if}

    <form class="card bg-surface-50-950 border border-surface-200-800 p-6 md:p-8 space-y-5 shadow-lg" onsubmit={submit} novalidate>
      <header class="space-y-1">
        <h1 class="h3">欢迎回来</h1>
        <p class="text-sm opacity-70">登录到你的 Acme Console 账户</p>
      </header>

      <label class="label">
        <span class="label-text">邮箱</span>
        <span class="relative block">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none"><Icon name="mail" class="size-4" /></span>
          <input class="input pl-9" class:!border-error-500={errors.email} type="email" placeholder="you@example.com" bind:value={email} autocomplete="email" aria-invalid={!!errors.email} aria-describedby="email-error" />
        </span>
        {#if errors.email}<p id="email-error" class="text-error-500 text-xs">{errors.email}</p>{/if}
      </label>

      <label class="label">
        <span class="label-text flex items-center justify-between">
          <span>密码</span>
          <a class="anchor text-xs inline-flex items-center min-h-10 px-2 -mr-2" href={router.href("/login")} use:link>忘记密码？</a>
        </span>
        <div class="field-group grid-cols-[1fr_auto]">
          <input class="input" class:!border-error-500={errors.password} type={showPassword ? "text" : "password"} placeholder="••••••••" bind:value={password} autocomplete="current-password" aria-invalid={!!errors.password} />
          <button type="button" class="btn preset-tonal min-w-10 min-h-10" aria-label={showPassword ? "隐藏密码" : "显示密码"} onclick={() => (showPassword = !showPassword)}>
            <Icon name={showPassword ? "eye-off" : "eye"} />
          </button>
        </div>
        {#if errors.password}<p class="text-error-500 text-xs">{errors.password}</p>{/if}
      </label>

      <label class="inline-flex items-center gap-2 text-sm min-h-10 cursor-pointer">
        <input class="checkbox" type="checkbox" bind:checked={remember} />
        <span>记住我</span>
      </label>

      <button type="submit" class="btn preset-filled-primary-500 w-full" disabled={loading} aria-busy={loading}>
        {#if loading}
          <Icon name="loader" class="size-4 animate-spin" />
          <span>登录中…</span>
        {:else}
          <span>登录</span>
        {/if}
      </button>

      <div class="flex items-center gap-3 text-xs opacity-60">
        <hr class="hr flex-1" /><span>或</span><hr class="hr flex-1" />
      </div>

      <div class="grid grid-cols-3 gap-3">
        <button type="button" class="btn preset-outlined-surface-500"><Icon name="globe" /><span>Google</span></button>
        <button type="button" class="btn preset-outlined-surface-500"><Icon name="link" /><span>GitHub</span></button>
        <button type="button" class="btn preset-outlined-surface-500"><Icon name="message-circle" /><span>微信</span></button>
      </div>

      <p class="text-center text-sm opacity-70">
        还没有账户？<a class="anchor inline-flex items-center min-h-10 px-2" href={router.href("/login")} use:link>注册</a>
      </p>
    </form>
  </div>
</main>
