<svelte:head><title>组件全集 · Acme Console</title></svelte:head>

<section>
  <p class="text-sm text-muted-foreground">Kitchen sink</p>
  <h1 class="text-2xl font-semibold tracking-tight">组件全集</h1>
  <p class="mt-2 text-muted-foreground">shadcn-svelte 官方组件与组合示例将在下一阶段补充。</p>
  <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each ["Button", "Input", "Card", "Dialog", "Popover", "Sidebar", "Tabs", "Table", "Accordion"] as item}<article
        class="rounded-xl border bg-card p-5"
      >
        <h2 class="font-medium">{item}</h2>
        <div class="mt-4 h-10 rounded-md bg-secondary"></div>
      </article>{/each}
  </div>
</section>
