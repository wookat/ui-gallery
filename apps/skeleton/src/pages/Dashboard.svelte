<script lang="ts">
  import { onMount } from "svelte"
  import { Avatar, Progress, Tabs } from "@skeletonlabs/skeleton-svelte"
  import stats from "@ui-gallery/spec/mock/stats.json"
  import series from "@ui-gallery/spec/mock/series.json"
  import orders from "@ui-gallery/spec/mock/orders.json"
  import activity from "@ui-gallery/spec/mock/activity.json"
  import tasks from "@ui-gallery/spec/mock/tasks.json"
  import Icon from "../lib/Icon.svelte"
  import StatusBadge from "../lib/StatusBadge.svelte"
  import { chart, palette } from "../lib/chart"
  import { money, number, initials } from "../lib/format"
  import { link, router } from "../lib/router.svelte"

  let loading = $state(true)
  let range = $state("7d")
  onMount(() => {
    const t = setTimeout(() => (loading = false), 400)
    return () => clearTimeout(t)
  })

  const recent = orders.slice(0, 6)

  function formatStat(s: { value: number; unit?: string }) {
    if (s.unit === "CNY") return money(s.value)
    if (s.unit === "%") return `${s.value}%`
    return number(s.value)
  }

  function sparkline(points: number[]) {
    const max = Math.max(...points)
    const min = Math.min(...points)
    const w = 96
    const h = 28
    return points
      .map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / (max - min || 1)) * (h - 4) - 2}`)
      .join(" ")
  }

  function lineChart(canvas: HTMLCanvasElement) {
    const c = palette()
    return chart(canvas, {
      type: "line",
      data: {
        labels: series.months,
        datasets: [
          { label: "收入（千元）", data: series.revenue, borderColor: c.primary, backgroundColor: c.primary + "33", fill: true, tension: 0.4 },
          { label: "订单", data: series.orders.map((v) => v / 10), borderColor: c.secondary, tension: 0.4 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.text } } },
        scales: { x: { ticks: { color: c.text }, grid: { color: c.grid } }, y: { ticks: { color: c.text }, grid: { color: c.grid } } },
      },
    })
  }

  function donutChart(canvas: HTMLCanvasElement) {
    const c = palette()
    return chart(canvas, {
      type: "doughnut",
      data: {
        labels: series.byChannel.map((x) => x.name),
        datasets: [{ data: series.byChannel.map((x) => x.value), backgroundColor: [c.primary, c.secondary, c.tertiary, c.success], borderWidth: 0 }],
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: "65%", plugins: { legend: { position: "bottom", labels: { color: c.text } } } },
    })
  }
</script>

<header class="flex flex-wrap items-end justify-between gap-3">
  <div>
    <h1 class="h3">仪表盘</h1>
    <p class="text-sm opacity-70">欢迎回来，这是你团队的最新概览。</p>
  </div>
  <div class="flex items-center gap-2">
    <select class="select w-32" bind:value={range} aria-label="时间范围">
      <option value="7d">近 7 天</option>
      <option value="30d">近 30 天</option>
      <option value="90d">近 90 天</option>
    </select>
    <button type="button" class="btn preset-outlined-surface-500"><Icon name="download" /><span class="hidden sm:inline">导出</span></button>
    <a class="btn preset-filled-primary-500" href={router.href("/form")} use:link><Icon name="plus" /><span>新建项目</span></a>
  </div>
</header>

<section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" aria-label="统计">
  {#each stats as s (s.key)}
    <article class="card bg-surface-50-950 border border-surface-200-800 p-4 space-y-2">
      {#if loading}
        <div class="placeholder animate-pulse h-4 w-20"></div>
        <div class="placeholder animate-pulse h-8 w-32"></div>
        <div class="placeholder animate-pulse h-4 w-full"></div>
      {:else}
        <div class="flex items-center justify-between text-sm opacity-70">
          <span>{s.label}</span>
          <span class="badge {s.delta >= 0 ? 'preset-tonal-success' : 'preset-tonal-error'}">
            <Icon name={s.delta >= 0 ? "arrow-up" : "arrow-down"} class="size-3" />
            {Math.abs(s.delta)}%
          </span>
        </div>
        <div class="flex items-end justify-between gap-2">
          <p class="text-2xl font-bold tabular-nums">{formatStat(s)}</p>
          <svg viewBox="0 0 96 28" class="w-24 h-7 shrink-0" aria-hidden="true">
            <polyline fill="none" stroke="currentColor" stroke-width="2" class={s.delta >= 0 ? "text-success-500" : "text-error-500"} points={sparkline(s.trend)} />
          </svg>
        </div>
      {/if}
    </article>
  {/each}
</section>

<section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
  <article class="card bg-surface-50-950 border border-surface-200-800 p-4 xl:col-span-2 space-y-3">
    <Tabs defaultValue="revenue">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="h5">收入趋势</h2>
        <Tabs.List>
          <Tabs.Trigger value="revenue">收入</Tabs.Trigger>
          <Tabs.Trigger value="orders">订单</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
      </div>
      <Tabs.Content value="revenue">
        <div class="h-64">
          {#if loading}<div class="placeholder animate-pulse h-full"></div>{:else}<canvas use:lineChart></canvas>{/if}
        </div>
      </Tabs.Content>
      <Tabs.Content value="orders">
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>月份</th><th class="text-right">订单</th><th class="text-right">收入（千元）</th></tr></thead>
            <tbody>
              {#each series.months as m, i (m)}
                <tr><td>{m}</td><td class="text-right tabular-nums">{number(series.orders[i])}</td><td class="text-right tabular-nums">{series.revenue[i]}</td></tr>
              {/each}
            </tbody>
          </table>
        </div>
      </Tabs.Content>
    </Tabs>
  </article>
  <article class="card bg-surface-50-950 border border-surface-200-800 p-4 space-y-3">
    <h2 class="h5">渠道占比</h2>
    <div class="h-64">
      {#if loading}<div class="placeholder-circle animate-pulse size-48 mx-auto"></div>{:else}<canvas use:donutChart></canvas>{/if}
    </div>
  </article>
</section>

<section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
  <article class="card bg-surface-50-950 border border-surface-200-800 xl:col-span-2 overflow-hidden">
    <header class="flex items-center justify-between p-4 border-b border-surface-200-800">
      <h2 class="h5">最近订单</h2>
      <a class="anchor text-sm" href={router.href("/orders")} use:link>查看全部</a>
    </header>
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr><th>订单号</th><th>客户</th><th class="hidden md:table-cell">产品</th><th>状态</th><th class="text-right">金额</th></tr>
        </thead>
        <tbody class="[&>tr]:hover:preset-tonal-primary">
          {#if loading}
            {#each { length: 5 }, i (i)}
              <tr>{#each { length: 5 }, j (j)}<td><div class="placeholder animate-pulse h-4"></div></td>{/each}</tr>
            {/each}
          {:else}
            {#each recent as o (o.id)}
              <tr>
                <td class="font-mono text-xs">{o.id}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <Avatar class="size-7"><Avatar.Fallback class="preset-filled-secondary-500 text-[10px]">{initials(o.customer)}</Avatar.Fallback></Avatar>
                    <span class="truncate">{o.customer}</span>
                  </div>
                </td>
                <td class="hidden md:table-cell">{o.product}</td>
                <td><StatusBadge status={o.status} /></td>
                <td class="text-right tabular-nums">{money(o.amount, o.currency)}</td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </article>

  <div class="space-y-4">
    <article class="card bg-surface-50-950 border border-surface-200-800 p-4 space-y-3">
      <h2 class="h5">任务进度</h2>
      {#each tasks as t (t.title)}
        <Progress value={t.progress} class="space-y-1">
          <div class="flex items-center justify-between text-sm">
            <Progress.Label>{t.title}</Progress.Label>
            <Progress.ValueText class="opacity-60" />
          </div>
          <Progress.Track class="h-2">
            <Progress.Range class={t.progress >= 80 ? "bg-success-500" : t.progress < 30 ? "bg-warning-500" : ""} />
          </Progress.Track>
          <p class="text-xs opacity-60">负责人：{t.owner}</p>
        </Progress>
      {/each}
    </article>

    <article class="card bg-surface-50-950 border border-surface-200-800 p-4 space-y-3">
      <h2 class="h5">团队动态</h2>
      <ol class="relative border-s border-surface-200-800 ms-3 space-y-4">
        {#each activity as a (a.action)}
          <li class="ms-4">
            <span class="absolute -start-1.5 mt-1.5 size-3 rounded-full bg-primary-500 ring-4 ring-surface-50-950"></span>
            <p class="text-sm"><span class="font-medium">{a.user}</span> {a.action}</p>
            <time class="text-xs opacity-60">{a.time}</time>
          </li>
        {/each}
      </ol>
    </article>
  </div>
</section>
