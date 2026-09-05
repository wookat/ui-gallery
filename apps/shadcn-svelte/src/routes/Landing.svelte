<svelte:head><title>Acme Console · shadcn-svelte</title></svelte:head>

<main class="min-h-screen">
  <nav class="flex h-16 items-center justify-between border-b px-4 sm:px-8">
    <a class="font-semibold no-underline" href="/apps/shadcn-svelte/">Acme Console</a>
    <div class="hidden gap-6 text-sm text-muted-foreground sm:flex">
      <a href="#features">特性</a><a href="#pricing">定价</a><a href="#faq">FAQ</a>
    </div>
    <a
      class="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground no-underline"
      href="/apps/shadcn-svelte/login">开始使用</a
    >
  </nav>
  <section class="mx-auto max-w-4xl px-4 py-24 text-center sm:py-32">
    <p class="text-sm font-medium text-muted-foreground">为现代团队打造</p>
    <h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">让工作流更简单。</h1>
    <p class="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
      一个清晰、快速、可扩展的工作区，帮助团队专注于真正重要的事情。
    </p>
    <div class="mt-8 flex justify-center gap-3">
      <a
        class="rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground no-underline"
        href="/apps/shadcn-svelte/login">免费开始</a
      ><a
        class="rounded-md border px-5 py-3 text-sm no-underline hover:bg-accent"
        href="/apps/shadcn-svelte/">查看演示</a
      >
    </div>
    <div id="features" class="mt-20 grid gap-4 text-left sm:grid-cols-3">
      {#each ["统一协作", "清晰洞察", "安全可靠"] as item}<article class="rounded-xl border p-5">
          <h2 class="font-medium">{item}</h2>
          <p class="mt-2 text-sm text-muted-foreground">从一个现代化工作区开始。</p>
        </article>{/each}
    </div>
  </section>
</main>
