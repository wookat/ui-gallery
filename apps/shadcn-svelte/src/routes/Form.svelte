<svelte:head><title>新建项目 · Acme Console</title></svelte:head>

<section>
  <p class="text-sm text-muted-foreground">工作区</p>
  <h1 class="text-2xl font-semibold tracking-tight">新建项目</h1>
  <p class="mt-2 text-muted-foreground">使用分步表单创建一个新的工作项目。</p>
  <div class="mt-6 max-w-2xl rounded-xl border bg-card p-6">
    <div class="mb-6 grid grid-cols-3 gap-2 text-center text-sm">
      <span class="rounded-md bg-primary px-2 py-2 text-primary-foreground">基本信息</span><span
        class="rounded-md bg-secondary px-2 py-2">详细配置</span
      ><span class="rounded-md bg-secondary px-2 py-2">确认</span>
    </div>
    <div class="space-y-4">
      <label class="block text-sm font-medium"
        >项目名称<input
          class="mt-2 w-full rounded-md border bg-background px-3 py-2"
          placeholder="输入项目名称"
        /></label
      ><label class="block text-sm font-medium"
        >项目说明<textarea
          class="mt-2 min-h-28 w-full rounded-md border bg-background px-3 py-2"
          placeholder="输入项目说明"
        ></textarea></label
      ><button class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >下一步</button
      >
    </div>
  </div>
</section>
