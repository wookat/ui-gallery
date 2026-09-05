<script lang="ts">
  import { onMount } from "svelte"
  import {
    ChevronDown,
    ChevronUp,
    Download,
    MoreHorizontal,
    RefreshCw,
    Search,
    Trash2,
  } from "@lucide/svelte"
  import orders from "@ui-gallery/spec/mock/orders.json"
  import { Button } from "$lib/components/ui/button"
  import * as Card from "$lib/components/ui/card"
  import * as Badge from "$lib/components/ui/badge"
  import * as Checkbox from "$lib/components/ui/checkbox"
  import * as Empty from "$lib/components/ui/empty"
  import * as Alert from "$lib/components/ui/alert"
  import * as Skeleton from "$lib/components/ui/skeleton"
  import * as Sheet from "$lib/components/ui/sheet"
  import * as Dropdown from "$lib/components/ui/dropdown-menu"
  import * as Dialog from "$lib/components/ui/alert-dialog"
  import * as Pagination from "$lib/components/ui/pagination"
  import * as Popover from "$lib/components/ui/popover"
  import * as RangeCalendar from "$lib/components/ui/range-calendar"
  import { toast } from "svelte-sonner"

  let query = $state("")
  let status = $state("all")
  let selected = $state<string[]>([])
  let open = $state(false)
  let deleteOpen = $state(false)
  let detail = $state<(typeof orders)[number] | null>(null)
  let sortAsc = $state(false)
  let loading = $state(new URLSearchParams(window.location.search).get("state") === "loading")
  let error = $state(new URLSearchParams(window.location.search).get("state") === "error")
  onMount(() => {
    if (!loading) loading = false
  })
  const filtered = $derived(
    orders
      .filter(
        (order) =>
          (!query ||
            `${order.id} ${order.customer} ${order.product}`
              .toLowerCase()
              .includes(query.toLowerCase())) &&
          (status === "all" || order.status === status)
      )
      .sort((a, b) => (sortAsc ? a.amount - b.amount : b.amount - a.amount))
      .slice(0, 10)
  )
  const allSelected = $derived(filtered.length > 0 && selected.length === filtered.length)
  function toggleAll() {
    selected = allSelected ? [] : filtered.map((order) => order.id)
  }
  function showOrder(order: (typeof orders)[number]) {
    detail = order
    open = true
  }
  function remove() {
    deleteOpen = false
    open = false
    toast.success("订单已删除")
  }
</script>

<div class="space-y-6">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1 class="text-2xl font-semibold">订单</h1>
      <p class="text-sm text-muted-foreground">管理和追踪所有订单。</p>
    </div>
    <Button variant="outline"><Download class="mr-2 size-4" />导出</Button>
  </div>
  {#if error}<Alert.Root variant="destructive"
      ><Alert.Title>订单加载失败</Alert.Title><Alert.Description
        class="flex items-center justify-between"
        >暂时无法读取订单列表。<Button variant="outline" size="sm" onclick={() => (error = false)}
          ><RefreshCw class="mr-2 size-4" />重试</Button
        ></Alert.Description
      ></Alert.Root
    >{/if}
  <Card.Root
    ><Card.Content class="flex flex-wrap gap-3 p-4"
      ><div class="relative min-w-48 flex-1">
        <Search class="absolute top-2.5 left-3 size-4 text-muted-foreground" /><input
          bind:value={query}
          class="h-9 w-full rounded-md border bg-background pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="搜索订单、客户或产品"
        />
      </div>
      <select bind:value={status} class="h-9 rounded-md border bg-background px-3 text-sm"
        ><option value="all">全部状态</option><option value="paid">已支付</option><option
          value="pending">待处理</option
        ><option value="shipped">已发货</option><option value="refunded">已退款</option><option
          value="failed">失败</option
        ></select
      ><Popover.Root
        ><Popover.Trigger><Button variant="outline">日期范围</Button></Popover.Trigger
        ><Popover.Content class="w-auto p-0"><RangeCalendar.RangeCalendar /></Popover.Content
        ></Popover.Root
      ><Dropdown.Root
        ><Dropdown.Trigger
          ><Button variant="outline">渠道 <ChevronDown class="ml-2 size-4" /></Button
          ></Dropdown.Trigger
        ><Dropdown.Content
          ><Dropdown.CheckboxItem checked>Web</Dropdown.CheckboxItem><Dropdown.CheckboxItem
            >iOS</Dropdown.CheckboxItem
          ><Dropdown.CheckboxItem>Android</Dropdown.CheckboxItem></Dropdown.Content
        ></Dropdown.Root
      ><select class="h-9 rounded-md border bg-background px-3 text-sm" aria-label="每页条数"
        ><option>10 条/页</option><option>20 条/页</option><option>50 条/页</option></select
      ><Dropdown.Root
        ><Dropdown.Trigger><Button variant="outline">列显示</Button></Dropdown.Trigger
        ><Dropdown.Content
          ><Dropdown.CheckboxItem checked>客户</Dropdown.CheckboxItem><Dropdown.CheckboxItem checked
            >产品</Dropdown.CheckboxItem
          ><Dropdown.CheckboxItem checked>状态</Dropdown.CheckboxItem></Dropdown.Content
        ></Dropdown.Root
      ></Card.Content
    ></Card.Root
  >
  {#if loading}<Card.Root class="space-y-3 p-6"
      >{#each Array(6) as _}<Skeleton.Root class="h-10 w-full" />{/each}</Card.Root
    >{:else if filtered.length === 0}<Card.Root
      ><Empty.Root
        ><Empty.Header
          ><Empty.Media variant="icon"><Search /></Empty.Media><Empty.Title
            >没有找到订单</Empty.Title
          ><Empty.Description>尝试调整搜索关键词或筛选条件。</Empty.Description></Empty.Header
        ></Empty.Root
      ></Card.Root
    >{:else}<Card.Root
      ><Card.Content class="p-0"
        ><div class="overflow-x-auto">
          <table class="w-full min-w-[720px] text-sm">
            <thead
              ><tr class="border-b text-left text-muted-foreground"
                ><th class="px-4 py-3"
                  ><Checkbox.Root
                    checked={allSelected}
                    indeterminate={selected.length > 0 && !allSelected}
                    onchange={toggleAll}
                  /></th
                ><th class="cursor-pointer px-4 py-3" onclick={() => (sortAsc = !sortAsc)}
                  >订单号 {#if sortAsc}<ChevronUp class="inline size-3" />{:else}<ChevronDown
                      class="inline size-3"
                    />{/if}</th
                ><th class="px-4 py-3">客户</th><th class="px-4 py-3">产品</th><th class="px-4 py-3"
                  >渠道</th
                ><th class="px-4 py-3">状态</th><th class="px-4 py-3 text-right">金额</th><th
                  class="px-4 py-3"
                ></th></tr
              ></thead
            ><tbody
              >{#each filtered as order (order.id)}<tr
                  class="cursor-pointer border-b last:border-0 hover:bg-muted/40"
                  onclick={() => showOrder(order)}
                  ><td class="px-4 py-3" onclick={(event) => event.stopPropagation()}
                    ><Checkbox.Root
                      checked={selected.includes(order.id)}
                      onchange={() =>
                        (selected = selected.includes(order.id)
                          ? selected.filter((id) => id !== order.id)
                          : [...selected, order.id])}
                    /></td
                  ><td class="px-4 py-3 font-medium">{order.id}</td><td class="px-4 py-3"
                    >{order.customer}
                    <div class="text-xs text-muted-foreground">{order.email}</div></td
                  ><td class="px-4 py-3">{order.product}</td><td class="px-4 py-3"
                    >{order.channel}</td
                  ><td class="px-4 py-3"
                    ><Badge.Root
                      variant={order.status === "paid"
                        ? "default"
                        : order.status === "failed"
                          ? "destructive"
                          : "secondary"}>{order.status}</Badge.Root
                    ></td
                  ><td class="px-4 py-3 text-right">{order.currency}{order.amount.toFixed(2)}</td
                  ><td class="px-4 py-3 text-right" onclick={(event) => event.stopPropagation()}
                    ><Dropdown.Root
                      ><Dropdown.Trigger
                        ><button class="rounded p-1 hover:bg-muted" aria-label="订单操作"
                          ><MoreHorizontal class="size-4" /></button
                        ></Dropdown.Trigger
                      ><Dropdown.Content
                        ><Dropdown.Item onclick={() => showOrder(order)}>编辑</Dropdown.Item
                        ><Dropdown.Item class="text-destructive" onclick={() => (deleteOpen = true)}
                          >删除</Dropdown.Item
                        ></Dropdown.Content
                      ></Dropdown.Root
                    ></td
                  ></tr
                >{/each}</tbody
            >
          </table>
        </div></Card.Content
      ><Card.Footer class="flex items-center justify-between border-t"
        ><span class="text-xs text-muted-foreground">显示 {filtered.length} 条订单</span
        ><Pagination.Root count={orders.length} perPage={10} /></Card.Footer
      ></Card.Root
    >{/if}
</div>

{#if detail}
  <Sheet.Root bind:open
    ><Sheet.Content side="right" class="w-full sm:max-w-lg"
      ><Sheet.Header
        ><Sheet.Title>{detail.id}</Sheet.Title><Sheet.Description
          >订单详情和处理记录</Sheet.Description
        ></Sheet.Header
      >
      <div class="space-y-6 p-4">
        <dl class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt class="text-muted-foreground">客户</dt>
            <dd class="font-medium">{detail.customer}</dd>
          </div>
          <div>
            <dt class="text-muted-foreground">日期</dt>
            <dd>{detail.date}</dd>
          </div>
          <div>
            <dt class="text-muted-foreground">产品</dt>
            <dd>{detail.product}</dd>
          </div>
          <div>
            <dt class="text-muted-foreground">渠道</dt>
            <dd>{detail.channel}</dd>
          </div>
        </dl>
        <div>
          <label for="note" class="text-sm font-medium">备注</label><textarea
            id="note"
            class="mt-2 min-h-24 w-full rounded-md border bg-background p-3 text-sm"
            placeholder="添加订单备注..."
          ></textarea>
        </div>
        <Button variant="destructive" onclick={() => (deleteOpen = true)}
          ><Trash2 class="mr-2 size-4" />删除订单</Button
        >
      </div></Sheet.Content
    ></Sheet.Root
  >
{/if}
<Dialog.Root bind:open={deleteOpen}
  ><Dialog.Content
    ><Dialog.Header
      ><Dialog.Title>确认删除订单？</Dialog.Title><Dialog.Description
        >此操作无法撤销，订单记录将被移除。</Dialog.Description
      ></Dialog.Header
    ><Dialog.Footer
      ><Dialog.Cancel>取消</Dialog.Cancel><Dialog.Action onclick={remove}>确认删除</Dialog.Action
      ></Dialog.Footer
    ></Dialog.Content
  ></Dialog.Root
>
