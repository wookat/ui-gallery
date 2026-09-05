<svelte:head><title>设置 · Acme Console</title></svelte:head>

<section>
  <p class="text-sm text-muted-foreground">工作区</p>
  <h1 class="text-2xl font-semibold tracking-tight">设置</h1>
  <div class="mt-6 grid gap-6 md:grid-cols-[180px_1fr]">
    <nav class="space-y-1">
      {#each ["个人资料", "账号安全", "通知", "团队", "计费"] as item}<button
          class="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent">{item}</button
        >{/each}
    </nav>
    <article class="rounded-xl border bg-card p-6">
      <h2 class="text-lg font-semibold">个人资料</h2>
      <p class="mt-1 text-sm text-muted-foreground">管理你的公开资料与偏好设置。</p>
      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <label class="text-sm font-medium"
          >姓名<input
            class="mt-2 w-full rounded-md border bg-background px-3 py-2"
            value="林晓"
          /></label
        ><label class="text-sm font-medium"
          >语言<select class="mt-2 w-full rounded-md border bg-background px-3 py-2"
            ><option>简体中文</option><option>English</option></select
          ></label
        >
      </div>
      <button class="mt-6 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >保存更改</button
      >
    </article>
  </div>
</section>
