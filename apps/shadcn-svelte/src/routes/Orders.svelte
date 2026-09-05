<script lang="ts">
  import { onMount } from "svelte"
  import orders from "@ui-gallery/spec/mock/orders.json"
  import Icon from "$lib/icons/Icon.svelte"
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { NativeSelect } from "$lib/components/ui/native-select"
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
  import * as Tabs from "$lib/components/ui/tabs"
  import activity from "@ui-gallery/spec/mock/activity.json"
  import { toast } from "svelte-sonner"

  let query = $state("")
  let status = $state("all")
  let selected = $state<string[]>([])
  let rows = $state([...orders])
  let open = $state(false)
  let deleteOpen = $state(false)
  let detail = $state<(typeof orders)[number] | null>(null)
  let deleteTarget = $state<(typeof orders)[number] | null>(null)
  let sortAsc = $state(false)
  const statusLabels: Record<string, string> = {
    paid: "已支付",
    pending: "待处理",
    shipped: "已发货",
    refunded: "已退款",
    failed: "失败",
  }
  let loading = $state(new URLSearchParams(window.location.search).get("state") === "loading")
  let error = $state(new URLSearchParams(window.location.search).get("state") === "error")
  onMount(() => {
    if (!loading) loading = false
  })
  const filtered = $derived(
    rows
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
    const detailId = deleteTarget?.id
    if (detailId) rows = rows.filter((order) => order.id !== detailId)
    if (detailId) selected = selected.filter((id) => id !== detailId)
    toast.success("订单已删除")
  }
</script>

<div class="space-y-6">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1 class="text-2xl font-semibold">订单</h1>
      <p class="text-sm text-muted-foreground">管理和追踪所有订单。</p>
    </div>
    <Button variant="outline" class="h-10"
      ><Icon name="download" size={16} class="mr-2" />导出</Button
    >
  </div>
  {#if error}<Alert.Root variant="destructive"
      ><Alert.Title>订单加载失败</Alert.Title><Alert.Description
        class="flex items-center justify-between"
        >暂时无法读取订单列表。<Button variant="outline" size="sm" onclick={() => (error = false)}
          ><Icon name="refresh" size={16} class="mr-2" />重试</Button
        ></Alert.Description
      ></Alert.Root
    >{/if}
  <Card.Root
    ><Card.Content class="flex flex-wrap gap-3 p-4"
      ><div class="relative min-w-48 flex-1">
        <Icon name="search" size={16} class="absolute top-3 left-3 text-muted-foreground" /><Input
          bind:value={query}
          class="h-10 w-full pr-3 pl-9"
          placeholder="搜索订单、客户或产品"
        />
      </div>
      <NativeSelect bind:value={status} class="[&>select]:h-10"
        ><option value="all">全部状态</option><option value="paid">已支付</option><option
          value="pending">待处理</option
        ><option value="shipped">已发货</option><option value="refunded">已退款</option><option
          value="failed">失败</option
        ></NativeSelect
      ><Popover.Root
        ><Popover.Trigger><Button variant="outline" class="h-10">日期范围</Button></Popover.Trigger
        ><Popover.Content class="w-auto p-0"><RangeCalendar.RangeCalendar /></Popover.Content
        ></Popover.Root
      ><Dropdown.Root
        ><Dropdown.Trigger
          ><Button variant="outline" class="h-10"
            >渠道 <Icon name="chevron-down" size={16} class="ml-2" /></Button
          ></Dropdown.Trigger
        ><Dropdown.Content
          ><Dropdown.CheckboxItem checked>Web</Dropdown.CheckboxItem><Dropdown.CheckboxItem
            >iOS</Dropdown.CheckboxItem
          ><Dropdown.CheckboxItem>Android</Dropdown.CheckboxItem></Dropdown.Content
        ></Dropdown.Root
      ><NativeSelect class="[&>select]:h-10" aria-label="每页条数"
        ><option>10 条/页</option><option>20 条/页</option><option>50 条/页</option></NativeSelect
      ><Dropdown.Root
        ><Dropdown.Trigger><Button variant="outline" class="h-10">列显示</Button></Dropdown.Trigger
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
          ><Empty.Media variant="icon"><Icon name="search" size={18} /></Empty.Media><Empty.Title
            >没有找到订单</Empty.Title
          ><Empty.Description>尝试调整搜索关键词或筛选条件。</Empty.Description></Empty.Header
        ></Empty.Root
      ></Card.Root
    >{:else}<Card.Root
      ><Card.Content class="p-0"
        ><div class="space-y-3 sm:hidden">
          {#each filtered as order (order.id)}
            <button class="w-full rounded-lg border p-4 text-left" onclick={() => showOrder(order)}>
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-medium">{order.id}</p>
                  <p class="text-sm text-muted-foreground">{order.customer}</p>
                </div>
                <Badge.Root
                  variant={order.status === "paid"
                    ? "default"
                    : order.status === "failed"
                      ? "destructive"
                      : "secondary"}>{statusLabels[order.status]}</Badge.Root
                >
              </div>
              <div class="mt-3 flex justify-between text-sm">
                <span>{order.product}</span><span>{order.currency}{order.amount.toFixed(2)}</span>
              </div>
            </button>
          {/each}
        </div>
        <div class="hidden overflow-x-auto sm:block">
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
                  >订单号 {#if sortAsc}<Icon
                      name="chevron-up"
                      size={12}
                      class="inline"
                    />{:else}<Icon name="chevron-down" size={12} class="inline" />{/if}</th
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
                          : "secondary"}>{statusLabels[order.status]}</Badge.Root
                    ></td
                  ><td class="px-4 py-3 text-right">{order.currency}{order.amount.toFixed(2)}</td
                  ><td class="px-4 py-3 text-right" onclick={(event) => event.stopPropagation()}
                    ><Dropdown.Root
                      ><Dropdown.Trigger
                        ><Button
                          variant="ghost"
                          size="icon"
                          class="size-10"
                          data-qa="hit"
                          aria-label="订单操作"><Icon name="more-horizontal" size={16} /></Button
                        ></Dropdown.Trigger
                      ><Dropdown.Content
                        ><Dropdown.Item onclick={() => showOrder(order)}>编辑</Dropdown.Item
                        ><Dropdown.Item
                          class="text-destructive"
                          onclick={() => {
                            deleteTarget = order
                            deleteOpen = true
                          }}>删除</Dropdown.Item
                        ></Dropdown.Content
                      ></Dropdown.Root
                    ></td
                  ></tr
                >{/each}</tbody
            >
          </table>
        </div></Card.Content
      ><Card.Footer class="flex items-center justify-between border-t"
        ><span class="text-xs text-muted-foreground">显示 {rows.length} 条订单</span
        ><Pagination.Root count={rows.length} perPage={10} /></Card.Footer
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
        <Tabs.Root value="detail">
          <Tabs.List
            ><Tabs.Trigger value="detail">详情</Tabs.Trigger><Tabs.Trigger value="activity"
              >处理记录</Tabs.Trigger
            ><Tabs.Trigger value="notes">备注</Tabs.Trigger></Tabs.List
          >
          <Tabs.Content value="detail">
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
          </Tabs.Content>
          <Tabs.Content value="activity">
            <ul class="space-y-3 text-sm">
              {#each activity.slice(0, 3) as item}<li class="border-b pb-3 last:border-0">
                  {item.user}
                  {item.action}<span class="block text-xs text-muted-foreground">{item.time}</span>
                </li>{/each}
            </ul>
          </Tabs.Content>
          <Tabs.Content value="notes">
            <div>
              <label for="note" class="text-sm font-medium">备注</label><textarea
                id="note"
                class="mt-2 min-h-24 w-full rounded-md border bg-background p-3 text-sm"
                placeholder="添加订单备注..."
              ></textarea>
            </div>
          </Tabs.Content>
        </Tabs.Root>
        <Button
          variant="destructive"
          onclick={() => {
            deleteTarget = detail
            deleteOpen = true
          }}><Icon name="trash" size={16} class="mr-2" />删除订单</Button
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
