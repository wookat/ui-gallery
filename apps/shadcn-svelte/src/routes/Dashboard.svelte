<svelte:head><title>仪表盘 · Acme Console</title></svelte:head>

<section>
  <div class="flex flex-wrap items-end justify-between gap-3">
    <div>
      <p class="text-sm text-muted-foreground">总览</p>
      <h1 class="text-2xl font-semibold tracking-tight">仪表盘</h1>
    </div>
    <button class="rounded-md border px-3 py-2 text-sm hover:bg-accent">导出报告</button>
  </div>
  <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {#each [["总收入", "¥128,430", "+12.5%"], ["订单数", "1,284", "+8.2%"], ["活跃用户", "8,549", "+18.1%"], ["转化率", "24.8%", "+4.6%"]] as card}
      <article class="rounded-xl border bg-card p-5">
        <p class="text-sm text-muted-foreground">{card[0]}</p>
        <strong class="mt-2 block text-2xl">{card[1]}</strong><span
          class="mt-2 inline-block text-xs text-emerald-600">{card[2]} 同比</span
        >
      </article>
    {/each}
  </div>
  <div class="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
    <article class="min-h-64 rounded-xl border bg-card p-5">
      <h2 class="font-semibold">收入趋势</h2>
      <div class="mt-8 grid h-40 grid-cols-12 items-end gap-2">
        {#each [40, 55, 45, 70, 62, 78, 68, 90, 75, 84, 72, 96] as height}<div
            class="rounded-t bg-primary/80"
            style={`height: ${height}%`}
          ></div>{/each}
      </div>
    </article>
    <article class="rounded-xl border bg-card p-5">
      <h2 class="font-semibold">任务进度</h2>
      <div class="mt-6 space-y-5">
        {#each [["设计系统", 82], ["移动端适配", 64], ["内容审核", 45]] as task}<div>
            <div class="mb-2 flex justify-between text-sm">
              <span>{task[0]}</span><span class="text-muted-foreground">{task[1]}%</span>
            </div>
            <div class="h-2 rounded-full bg-secondary">
              <div class="h-2 rounded-full bg-primary" style={`width: ${task[1]}%`}></div>
            </div>
          </div>{/each}
      </div>
    </article>
  </div>
</section>
