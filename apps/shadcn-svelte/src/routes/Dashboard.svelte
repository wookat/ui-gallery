<script lang="ts">
  import { onMount } from "svelte"
  import { ArrowDownRight, ArrowUpRight, MoreHorizontal } from "@lucide/svelte"
  import stats from "@ui-gallery/spec/mock/stats.json"
  import series from "@ui-gallery/spec/mock/series.json"
  import orders from "@ui-gallery/spec/mock/orders.json"
  import activity from "@ui-gallery/spec/mock/activity.json"
  import tasks from "@ui-gallery/spec/mock/tasks.json"
  import * as Card from "$lib/components/ui/card"
  import * as Badge from "$lib/components/ui/badge"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as Progress from "$lib/components/ui/progress"
  import * as Skeleton from "$lib/components/ui/skeleton"
  import * as Tabs from "$lib/components/ui/tabs"
  import * as Dropdown from "$lib/components/ui/dropdown-menu"

  let loading = $state(new URLSearchParams(window.location.search).get("state") === "loading")
  let period = $state("周")
  const statsMap = Object.fromEntries(stats.map((stat) => [stat.key, stat])) as Record<
    string,
    { value: number; delta: number; trend: number[] }
  >
  onMount(() => {
    if (!loading) setTimeout(() => (loading = false), 600)
  })
  const cards = [
    { key: "revenue", label: "总收入", unit: "¥", format: (v: number) => v.toLocaleString() },
    { key: "orders", label: "订单数", unit: "", format: (v: number) => v.toLocaleString() },
    { key: "users", label: "活跃用户", unit: "", format: (v: number) => v.toLocaleString() },
    { key: "conversion", label: "转化率", unit: "", format: (v: number) => `${v}%` },
  ] as const
</script>

{#if loading}
  <div class="space-y-6">
    <div><Skeleton.Root class="h-8 w-40" /><Skeleton.Root class="mt-2 h-4 w-64" /></div>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {#each cards as _}<Skeleton.Root class="h-32 rounded-xl" />{/each}
    </div>
    <Skeleton.Root class="h-72 rounded-xl" />
  </div>
{:else}
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">仪表盘</h1>
      <p class="text-sm text-muted-foreground">查看业务指标和团队最新动态。</p>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {#each cards as card}
        {@const value = statsMap[card.key]}
        <Card.Root
          ><Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2"
            ><Card.Title class="text-sm font-medium">{card.label}</Card.Title><span
              class="text-xs text-muted-foreground">{card.key === "revenue" ? "本月" : "同比"}</span
            ></Card.Header
          ><Card.Content
            ><div class="text-2xl font-bold">{card.unit}{card.format(value.value)}</div>
            <div
              class="mt-1 flex items-center gap-1 text-xs {value.delta >= 0
                ? 'text-emerald-600'
                : 'text-destructive'}"
            >
              {#if value.delta >= 0}<ArrowUpRight class="size-3" />{:else}<ArrowDownRight
                  class="size-3"
                />{/if}{Math.abs(value.delta)}% <span class="text-muted-foreground">较上期</span>
            </div>
            <svg
              class="mt-3 h-8 w-full"
              viewBox="0 0 120 30"
              preserveAspectRatio="none"
              aria-label="趋势"
              ><polyline
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                points={value.trend
                  .map(
                    (point: number, i: number) =>
                      `${i * 20},${28 - (point / Math.max(...value.trend)) * 24}`
                  )
                  .join(" ")}
              /></svg
            ></Card.Content
          ></Card.Root
        >
      {/each}
    </div>
    <Tabs.Root bind:value={period} class="space-y-4">
      <Tabs.List
        ><Tabs.Trigger value="日">日</Tabs.Trigger><Tabs.Trigger value="周">周</Tabs.Trigger
        ><Tabs.Trigger value="月">月</Tabs.Trigger></Tabs.List
      >
      <Tabs.Content value={period}
        ><div class="grid gap-4 lg:grid-cols-3">
          <Card.Root class="lg:col-span-2"
            ><Card.Header
              ><Card.Title>收入趋势</Card.Title><Card.Description
                >近七个月的收入变化</Card.Description
              ></Card.Header
            ><Card.Content
              ><svg
                class="h-56 w-full overflow-visible"
                viewBox="0 0 700 220"
                preserveAspectRatio="none"
                ><polyline
                  fill="none"
                  stroke="hsl(var(--primary))"
                  stroke-width="3"
                  points={series.revenue.map((point, i) => `${i * 116},${210 - point}`).join(" ")}
                />{#each series.revenue as point, i}<circle
                    cx={i * 116}
                    cy={210 - point}
                    r="4"
                    fill="hsl(var(--primary))"
                  />{/each}</svg
              >
              <div class="flex justify-between text-xs text-muted-foreground">
                {#each series.months as month}<span>{month}</span>{/each}
              </div></Card.Content
            ></Card.Root
          >
          <Card.Root
            ><Card.Header
              ><Card.Title>渠道分布</Card.Title><Card.Description>订单来源占比</Card.Description
              ></Card.Header
            ><Card.Content class="flex items-center justify-center"
              ><div
                class="relative flex size-44 items-center justify-center rounded-full"
                style="background: conic-gradient(hsl(var(--primary)) 0 52%, hsl(var(--chart-2)) 52% 75%, hsl(var(--chart-3)) 75% 92%, hsl(var(--chart-4)) 92% 100%)"
              >
                <div
                  class="flex size-24 items-center justify-center rounded-full bg-background text-center text-xs text-muted-foreground"
                >
                  渠道<br />占比
                </div>
              </div></Card.Content
            ><Card.Footer class="grid grid-cols-2 gap-2 text-xs"
              >{#each series.byChannel as channel}<div class="flex justify-between">
                  <span>{channel.name}</span><span class="font-medium">{channel.value}%</span>
                </div>{/each}</Card.Footer
            ></Card.Root
          >
        </div></Tabs.Content
      >
    </Tabs.Root>
    <div class="grid gap-4 xl:grid-cols-3">
      <Card.Root class="xl:col-span-2"
        ><Card.Header><Card.Title>最近订单</Card.Title></Card.Header><Card.Content
          ><div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead
                ><tr class="border-b text-left text-muted-foreground"
                  ><th class="pb-3">客户</th><th class="pb-3">产品</th><th class="pb-3">状态</th><th
                    class="pb-3 text-right">金额</th
                  ><th></th></tr
                ></thead
              ><tbody
                >{#each orders.slice(0, 5) as order}<tr class="border-b last:border-0"
                    ><td class="py-3"
                      ><div class="flex items-center gap-2">
                        <Avatar.Root class="size-7"
                          ><Avatar.Fallback>{order.customer.slice(0, 1)}</Avatar.Fallback
                          ></Avatar.Root
                        ><span>{order.customer}</span>
                      </div></td
                    ><td>{order.product}</td><td
                      ><Badge.Root variant={order.status === "paid" ? "default" : "secondary"}
                        >{order.status}</Badge.Root
                      ></td
                    ><td class="text-right">{order.currency}{order.amount}</td><td
                      class="text-right"
                      ><Dropdown.Root
                        ><Dropdown.Trigger
                          ><button class="rounded p-1 hover:bg-muted" aria-label="订单操作"
                            ><MoreHorizontal class="size-4" /></button
                          ></Dropdown.Trigger
                        ><Dropdown.Content
                          ><Dropdown.Item>查看详情</Dropdown.Item><Dropdown.Item
                            >复制订单号</Dropdown.Item
                          ></Dropdown.Content
                        ></Dropdown.Root
                      ></td
                    ></tr
                  >{/each}</tbody
              >
            </table>
          </div></Card.Content
        ></Card.Root
      >
      <div class="space-y-4">
        <Card.Root
          ><Card.Header><Card.Title>团队动态</Card.Title></Card.Header><Card.Content
            ><div class="space-y-4">
              {#each activity as item}<div class="flex gap-3">
                  <span class="mt-1.5 size-2 shrink-0 rounded-full bg-primary"></span>
                  <div class="text-sm">
                    <p>{item.user} {item.action}</p>
                    <p class="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>{/each}
            </div></Card.Content
          ></Card.Root
        ><Card.Root
          ><Card.Header><Card.Title>任务进度</Card.Title></Card.Header><Card.Content
            class="space-y-4"
            >{#each tasks as task}<div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span>{task.title}</span><span class="text-muted-foreground"
                    >{task.progress}%</span
                  >
                </div>
                <Progress.Root value={task.progress} />
              </div>{/each}</Card.Content
          ></Card.Root
        >
      </div>
    </div>
  </div>
{/if}
