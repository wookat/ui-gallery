<svelte:head><title>登录 · Acme Console</title></svelte:head>

<main class="grid min-h-screen place-items-center bg-muted/30 p-4">
  <section class="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
    <div class="mb-6 text-center">
      <div
        class="mx-auto mb-4 grid size-10 place-items-center rounded-lg bg-primary font-semibold text-primary-foreground"
      >
        A
      </div>
      <h1 class="text-2xl font-semibold">欢迎回来</h1>
      <p class="mt-2 text-sm text-muted-foreground">登录 Acme Console 管理你的工作区。</p>
    </div>
    <form class="space-y-4">
      <label class="block text-sm font-medium"
        >邮箱<input
          class="mt-2 w-full rounded-md border bg-background px-3 py-2"
          type="email"
          placeholder="you@example.com"
        /></label
      >
      <label class="block text-sm font-medium"
        >密码<input
          class="mt-2 w-full rounded-md border bg-background px-3 py-2"
          type="password"
          placeholder="••••••••"
        /></label
      >
      <label class="flex items-center gap-2 text-sm"><input type="checkbox" />记住我</label>
      <button
        class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >登录</button
      >
    </form>
    <p class="mt-6 text-center text-sm text-muted-foreground">
      还没有账户？<a class="text-foreground underline" href="/apps/shadcn-svelte/">注册</a>
    </p>
  </section>
</main>
