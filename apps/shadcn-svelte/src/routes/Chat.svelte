<svelte:head><title>AI 助手 · Acme Console</title></svelte:head>

<section>
  <p class="text-sm text-muted-foreground">工作区</p>
  <h1 class="text-2xl font-semibold tracking-tight">AI 助手</h1>
  <div class="mt-6 grid min-h-[520px] place-items-center rounded-xl border bg-card p-6 text-center">
    <div>
      <div class="mx-auto grid size-12 place-items-center rounded-full bg-secondary">
        <span class="text-xl">✦</span>
      </div>
      <h2 class="mt-4 text-xl font-semibold">有什么可以帮你？</h2>
      <p class="mt-2 text-muted-foreground">向 AI 助手提问，开始探索你的工作区。</p>
      <div class="mt-6 flex flex-wrap justify-center gap-2">
        {#each ["总结本周订单", "分析收入趋势", "创建项目计划", "查看团队动态"] as prompt}<button
            class="rounded-full border px-3 py-2 text-sm hover:bg-accent">{prompt}</button
          >{/each}
      </div>
      <div class="mt-8 flex w-full max-w-lg gap-2">
        <input
          class="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="输入你的问题..."
        /><button class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          >发送</button
        >
      </div>
    </div>
  </div>
</section>
