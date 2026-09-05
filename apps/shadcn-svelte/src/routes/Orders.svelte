<svelte:head><title>订单 · Acme Console</title></svelte:head>

<section>
  <p class="text-sm text-muted-foreground">工作区</p>
  <h1 class="text-2xl font-semibold tracking-tight">订单</h1>
  <div class="mt-6 rounded-xl border bg-card">
    <div class="flex flex-wrap items-center gap-3 border-b p-4">
      <input
        class="min-w-48 flex-1 rounded-md border bg-background px-3 py-2 text-sm"
        placeholder="搜索订单..."
      /><button class="rounded-md border px-3 py-2 text-sm hover:bg-accent">筛选</button><button
        class="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">导出</button
      >
    </div>
    <div class="overflow-x-auto">
      <table class="w-full min-w-[620px] text-left text-sm">
        <thead
          ><tr class="border-b text-muted-foreground"
            ><th class="p-4">订单</th><th class="p-4">客户</th><th class="p-4">状态</th><th
              class="p-4 text-right">金额</th
            ></tr
          ></thead
        ><tbody
          >{#each [["ORD-2401", "Maria Chen", "已支付", "¥2,480"], ["ORD-2400", "张伟", "处理中", "¥1,280"], ["ORD-2399", "Oliver Smith", "已完成", "¥860"], ["ORD-2398", "李娜", "已支付", "¥3,240"], ["ORD-2397", "Noah Wilson", "已取消", "¥420"]] as order}<tr
              class="border-b last:border-0"
              ><td class="p-4 font-medium">{order[0]}</td><td class="p-4">{order[1]}</td><td
                class="p-4"
                ><span class="rounded-full bg-secondary px-2 py-1 text-xs">{order[2]}</span></td
              ><td class="p-4 text-right">{order[3]}</td></tr
            >{/each}</tbody
        >
      </table>
    </div>
  </div>
</section>
