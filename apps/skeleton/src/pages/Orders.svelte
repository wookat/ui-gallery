<script lang="ts">
  import { onMount } from "svelte"
  import { Avatar, Dialog, Menu, Pagination, Popover, Portal, SegmentedControl, Switch, Tabs } from "@skeletonlabs/skeleton-svelte"
  import ordersData from "@ui-gallery/spec/mock/orders.json"
  import Icon from "../lib/Icon.svelte"
  import StatusBadge from "../lib/StatusBadge.svelte"
  import { money, initials } from "../lib/format"
  import { toaster } from "../lib/toaster"

  type Order = (typeof ordersData)[number]
  type SortKey = "id" | "customer" | "amount" | "date" | "status"

  const statuses = [
    { value: "all", label: "全部状态" },
    { value: "paid", label: "已支付" },
    { value: "pending", label: "待处理" },
    { value: "shipped", label: "已发货" },
    { value: "refunded", label: "已退款" },
    { value: "failed", label: "失败" },
  ]
  const channels = [
    { value: "web", label: "Web" },
    { value: "ios", label: "iOS" },
    { value: "android", label: "Android" },
    { value: "api", label: "API" },
  ]
  const allColumns = [
    { key: "customer", label: "客户" },
    { key: "product", label: "产品" },
    { key: "channel", label: "渠道" },
    { key: "status", label: "状态" },
    { key: "date", label: "日期" },
    { key: "amount", label: "金额" },
  ] as const
  type ColumnKey = (typeof allColumns)[number]["key"]

  let orders = $state<Order[]>([...ordersData])
  let view = $state<"data" | "loading" | "empty" | "error">("loading")
  let query = $state("")
  let status = $state("all")
  let selectedChannels = $state<string[]>([])
  let dateFrom = $state("")
  let dateTo = $state("")
  let sortKey = $state<SortKey>("date")
  let sortDir = $state<"asc" | "desc">("desc")
  let page = $state(1)
  let pageSize = $state(10)
  let selected = $state<string[]>([])
  let hidden = $state<ColumnKey[]>([])
  let detail = $state<Order | null>(null)
  let pendingDelete = $state<Order | null>(null)
  let note = $state("")

  onMount(() => {
    const t = setTimeout(() => (view = "data"), 400)
    return () => clearTimeout(t)
  })

  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase()
    return orders
      .filter((o) => (status === "all" ? true : o.status === status))
      .filter((o) => (selectedChannels.length ? selectedChannels.includes(o.channel) : true))
      .filter((o) => (dateFrom ? o.date >= dateFrom : true))
      .filter((o) => (dateTo ? o.date <= dateTo : true))
      .filter((o) => (q ? [o.id, o.customer, o.email, o.product].some((v) => v.toLowerCase().includes(q)) : true))
      .sort((a, b) => {
        const av = a[sortKey]
        const bv = b[sortKey]
        const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv))
        return sortDir === "asc" ? cmp : -cmp
      })
  })
  const total = $derived(filtered.length)
  const pageCount = $derived(Math.max(1, Math.ceil(total / pageSize)))
  const rows = $derived(filtered.slice((page - 1) * pageSize, page * pageSize))
  const allOnPage = $derived(rows.length > 0 && rows.every((r) => selected.includes(r.id)))
  const visible = $derived(allColumns.filter((c) => !hidden.includes(c.key)))

  $effect(() => {
    if (page > pageCount) page = pageCount
  })

  function sortBy(key: SortKey) {
    if (sortKey === key) sortDir = sortDir === "asc" ? "desc" : "asc"
    else {
      sortKey = key
      sortDir = "asc"
    }
  }
  function toggleAll() {
    selected = allOnPage ? selected.filter((id) => !rows.some((r) => r.id === id)) : [...new Set([...selected, ...rows.map((r) => r.id)])]
  }
  function toggle(id: string) {
    selected = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]
  }
  function toggleColumn(key: ColumnKey) {
    hidden = hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key]
  }
  function toggleChannel(value: string) {
    selectedChannels = selectedChannels.includes(value) ? selectedChannels.filter((v) => v !== value) : [...selectedChannels, value]
    page = 1
  }
  function resetFilters() {
    query = ""
    status = "all"
    selectedChannels = []
    dateFrom = ""
    dateTo = ""
    page = 1
  }
  function exportCsv() {
    toaster.success({ title: "导出已开始", description: `正在导出 ${selected.length || total} 条订单` })
  }
  function confirmDelete() {
    if (!pendingDelete) return
    const id = pendingDelete.id
    orders = orders.filter((o) => o.id !== id)
    selected = selected.filter((x) => x !== id)
    if (detail?.id === id) detail = null
    pendingDelete = null
    toaster.success({ title: "订单已删除", description: `${id} 已从列表移除` })
  }
  function saveNote() {
    toaster.info({ title: "备注已保存", description: detail?.id })
    note = ""
  }
  function rowClick(event: MouseEvent, o: Order) {
    const target = event.target as HTMLElement
    if (target.closest("button, a, input, label, [role='menu']")) return
    detail = o
  }
  function channelLabel(v: string) {
    return channels.find((c) => c.value === v)?.label ?? v
  }
</script>

<header class="flex flex-wrap items-end justify-between gap-3">
  <div>
    <h1 class="h3">订单</h1>
    <p class="text-sm opacity-70">共 {orders.length} 条订单，已选 {selected.length} 条</p>
  </div>
  <div class="flex items-center gap-2">
    <SegmentedControl value={view} onValueChange={(d) => (view = d.value as typeof view)}>
      <SegmentedControl.Control>
        <SegmentedControl.Indicator />
        <SegmentedControl.Item value="data"><SegmentedControl.ItemText>数据</SegmentedControl.ItemText><SegmentedControl.ItemHiddenInput /></SegmentedControl.Item>
        <SegmentedControl.Item value="loading"><SegmentedControl.ItemText>加载</SegmentedControl.ItemText><SegmentedControl.ItemHiddenInput /></SegmentedControl.Item>
        <SegmentedControl.Item value="empty"><SegmentedControl.ItemText>空</SegmentedControl.ItemText><SegmentedControl.ItemHiddenInput /></SegmentedControl.Item>
        <SegmentedControl.Item value="error"><SegmentedControl.ItemText>错误</SegmentedControl.ItemText><SegmentedControl.ItemHiddenInput /></SegmentedControl.Item>
      </SegmentedControl.Control>
    </SegmentedControl>
    <button type="button" class="btn preset-filled-primary-500" onclick={exportCsv}><Icon name="download" /><span>导出</span></button>
  </div>
</header>

<section class="card bg-surface-50-950 border border-surface-200-800 p-3 flex flex-wrap items-center gap-2" aria-label="筛选">
  <label class="relative flex-1 min-w-48">
    <span class="sr-only">搜索订单</span>
    <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"><Icon name="search" /></span>
    <input class="input pl-9" type="search" placeholder="搜索订单号、客户、邮箱…" bind:value={query} oninput={() => (page = 1)} />
  </label>
  <select class="select w-36" bind:value={status} onchange={() => (page = 1)} aria-label="状态">
    {#each statuses as s (s.value)}<option value={s.value}>{s.label}</option>{/each}
  </select>
  <Popover positioning={{ placement: "bottom-start" }}>
    <Popover.Trigger class="btn preset-outlined-surface-500">
      <Icon name="filter" /><span>渠道</span>
      {#if selectedChannels.length}<span class="badge preset-filled-primary-500">{selectedChannels.length}</span>{/if}
    </Popover.Trigger>
    <Portal>
      <Popover.Positioner class="z-40">
        <Popover.Content class="card p-3 bg-surface-100-900 shadow-xl space-y-2 w-48">
          {#each channels as c (c.value)}
            <label class="flex min-h-10 items-center gap-2 text-sm">
              <input class="checkbox" type="checkbox" checked={selectedChannels.includes(c.value)} onchange={() => toggleChannel(c.value)} />
              <span>{c.label}</span>
            </label>
          {/each}
        </Popover.Content>
      </Popover.Positioner>
    </Portal>
  </Popover>
  <div class="flex items-center gap-1">
    <input class="input w-36" type="date" bind:value={dateFrom} aria-label="开始日期" />
    <span class="opacity-60">–</span>
    <input class="input w-36" type="date" bind:value={dateTo} aria-label="结束日期" />
  </div>
  <Popover positioning={{ placement: "bottom-end" }}>
    <Popover.Trigger class="btn preset-outlined-surface-500"><Icon name="sliders" /><span class="hidden sm:inline">列</span></Popover.Trigger>
    <Portal>
      <Popover.Positioner class="z-40">
        <Popover.Content class="card p-3 bg-surface-100-900 shadow-xl space-y-2 w-40">
          {#each allColumns as c (c.key)}
            <Switch checked={!hidden.includes(c.key)} onCheckedChange={() => toggleColumn(c.key)} class="flex items-center justify-between w-full py-3 text-sm">
              <Switch.Label>{c.label}</Switch.Label>
              <Switch.Control><Switch.Thumb /></Switch.Control>
              <Switch.HiddenInput />
            </Switch>
          {/each}
        </Popover.Content>
      </Popover.Positioner>
    </Portal>
  </Popover>
  <button type="button" class="btn min-w-10 hover:preset-tonal" onclick={resetFilters}><Icon name="refresh" /><span class="hidden sm:inline">重置</span></button>
</section>

{#if selected.length}
  <div class="card preset-tonal-primary p-2 px-3 flex items-center justify-between gap-2 text-sm">
    <span>已选择 {selected.length} 条</span>
    <div class="flex gap-2">
      <button type="button" class="btn btn-sm preset-filled" onclick={exportCsv}>导出所选</button>
      <button type="button" class="btn btn-sm preset-outlined" onclick={() => (selected = [])}>取消选择</button>
    </div>
  </div>
{/if}

<section class="card bg-surface-50-950 border border-surface-200-800 overflow-hidden">
  {#if view === "loading"}
    <div class="p-4 space-y-3" aria-busy="true">
      {#each { length: 8 }, i (i)}
        <div class="flex gap-3 items-center">
          <div class="placeholder animate-pulse size-4"></div>
          <div class="placeholder animate-pulse h-4 w-24"></div>
          <div class="placeholder animate-pulse h-4 flex-1"></div>
          <div class="placeholder animate-pulse h-4 w-16"></div>
        </div>
      {/each}
    </div>
  {:else if view === "error"}
    <div class="p-12 text-center space-y-3">
      <Icon name="triangle-alert" class="size-10 mx-auto text-error-500" />
      <h2 class="h5">加载失败</h2>
      <p class="text-sm opacity-70">无法获取订单数据，请稍后重试。</p>
      <button type="button" class="btn preset-filled" onclick={() => (view = "data")}><Icon name="refresh" /><span>重试</span></button>
    </div>
  {:else if view === "empty" || rows.length === 0}
    <div class="p-12 text-center space-y-3">
      <Icon name="inbox" class="size-10 mx-auto opacity-40" />
      <h2 class="h5">暂无订单</h2>
      <p class="text-sm opacity-70">没有符合条件的订单，尝试调整筛选条件。</p>
      <button type="button" class="btn preset-outlined-surface-500" onclick={() => { view = "data"; resetFilters() }}>清除筛选</button>
    </div>
  {:else}
    <div class="table-wrap hidden md:block">
      <table class="table">
        <thead>
          <tr>
            <th class="w-10"><label class="inline-grid place-items-center size-10 -m-2 cursor-pointer"><input class="checkbox" type="checkbox" checked={allOnPage} onchange={toggleAll} aria-label="选择本页" /></label></th>
            <th><button type="button" class="flex items-center gap-1 min-h-10" onclick={() => sortBy("id")}>订单号 <Icon name={sortKey === "id" ? (sortDir === "asc" ? "arrow-up" : "arrow-down") : "arrow-up-down"} class="size-3" /></button></th>
            {#each visible as c (c.key)}
              <th class={c.key === "amount" ? "text-right" : ""}>
                {#if c.key === "customer" || c.key === "amount" || c.key === "date" || c.key === "status"}
                  <button type="button" class="inline-flex items-center gap-1 min-h-10" onclick={() => sortBy(c.key)}>{c.label} <Icon name={sortKey === c.key ? (sortDir === "asc" ? "arrow-up" : "arrow-down") : "arrow-up-down"} class="size-3" /></button>
                {:else}{c.label}{/if}
              </th>
            {/each}
            <th class="w-12"><span class="sr-only">操作</span></th>
          </tr>
        </thead>
        <tbody class="[&>tr]:hover:preset-tonal-primary">
          {#each rows as o (o.id)}
            <tr class="cursor-pointer {selected.includes(o.id) ? 'preset-tonal-primary' : ''}" onclick={(e) => rowClick(e, o)}>
              <td><label class="inline-grid place-items-center size-10 -m-2 cursor-pointer"><input class="checkbox" type="checkbox" checked={selected.includes(o.id)} onchange={() => toggle(o.id)} aria-label={`选择 ${o.id}`} /></label></td>
              <td><button type="button" class="anchor font-mono text-xs inline-flex items-center min-h-10" onclick={() => (detail = o)}>{o.id}</button></td>
              {#each visible as c (c.key)}
                {#if c.key === "customer"}
                  <td>
                    <div class="flex items-center gap-2">
                      <Avatar class="size-7"><Avatar.Fallback class="preset-filled-secondary-500 text-[10px]">{initials(o.customer)}</Avatar.Fallback></Avatar>
                      <div class="min-w-0"><p class="truncate">{o.customer}</p><p class="text-xs opacity-60 truncate">{o.email}</p></div>
                    </div>
                  </td>
                {:else if c.key === "status"}<td><StatusBadge status={o.status} /></td>
                {:else if c.key === "amount"}<td class="text-right tabular-nums font-medium">{money(o.amount, o.currency)}</td>
                {:else if c.key === "channel"}<td><span class="chip preset-outlined-surface-500">{channelLabel(o.channel)}</span></td>
                {:else}<td>{o[c.key]}</td>{/if}
              {/each}
              <td>
                <Menu positioning={{ placement: "bottom-end" }}>
                  <Menu.Trigger class="btn-icon min-w-10 min-h-10 hover:preset-tonal" aria-label="操作"><Icon name="ellipsis-horizontal" /></Menu.Trigger>
                  <Portal>
                    <Menu.Positioner class="z-40">
                      <Menu.Content class="card p-1 bg-surface-100-900 shadow-xl min-w-36">
                        <Menu.Item value="view" onclick={() => (detail = o)}><Icon name="eye" /><Menu.ItemText>查看详情</Menu.ItemText></Menu.Item>
                        <Menu.Item value="copy" onclick={() => toaster.info({ title: "已复制", description: o.id })}><Icon name="copy" /><Menu.ItemText>复制订单号</Menu.ItemText></Menu.Item>
                        <Menu.Separator />
                        <Menu.Item value="delete" class="text-error-500" onclick={() => (pendingDelete = o)}><Icon name="trash" /><Menu.ItemText>删除</Menu.ItemText></Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <ul class="md:hidden divide-y divide-surface-200-800">
      {#each rows as o (o.id)}
        <li class="p-3 flex gap-3 items-start">
          <label class="inline-grid place-items-center size-10 -m-2 cursor-pointer"><input class="checkbox" type="checkbox" checked={selected.includes(o.id)} onchange={() => toggle(o.id)} aria-label={`选择 ${o.id}`} /></label>
          <button type="button" class="flex-1 min-w-0 text-left space-y-1" onclick={() => (detail = o)}>
            <div class="flex items-center justify-between gap-2">
              <span class="font-mono text-xs">{o.id}</span>
              <StatusBadge status={o.status} />
            </div>
            <p class="font-medium truncate">{o.customer}</p>
            <div class="flex items-center justify-between text-sm opacity-70">
              <span class="truncate">{o.product}</span>
              <span class="tabular-nums font-medium">{money(o.amount, o.currency)}</span>
            </div>
          </button>
        </li>
      {/each}
    </ul>

    <footer class="flex flex-wrap items-center justify-between gap-3 p-3 border-t border-surface-200-800">
      <div class="flex items-center gap-2 text-sm">
        <span class="opacity-70 hidden sm:inline">每页</span>
        <select class="select w-20" bind:value={pageSize} onchange={() => (page = 1)} aria-label="每页条数">
          <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option>
        </select>
        <span class="opacity-70">第 {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} / {total} 条</span>
      </div>
      <Pagination count={total} {pageSize} {page} onPageChange={(d) => (page = d.page)} siblingCount={1}>
        <Pagination.PrevTrigger class="btn-icon min-w-10 min-h-10 preset-outlined-surface-500" aria-label="上一页"><Icon name="chevron-left" /></Pagination.PrevTrigger>
        <Pagination.Context>
          {#snippet children(api)}
            {#each api().pages as p, i (i)}
              {#if p.type === "page"}
                <Pagination.Item {...p} class="btn-icon min-w-10 min-h-10 {p.value === page ? 'preset-filled-primary-500' : 'preset-outlined-surface-500'}">{p.value}</Pagination.Item>
              {:else}
                <Pagination.Ellipsis index={i} class="btn-icon min-w-10 min-h-10">…</Pagination.Ellipsis>
              {/if}
            {/each}
          {/snippet}
        </Pagination.Context>
        <Pagination.NextTrigger class="btn-icon min-w-10 min-h-10 preset-outlined-surface-500" aria-label="下一页"><Icon name="chevron-right" /></Pagination.NextTrigger>
      </Pagination>
    </footer>
  {/if}
</section>

<Dialog open={detail !== null} onOpenChange={(d) => { if (!d.open) detail = null }}>
  <Portal>
    <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
    <Dialog.Positioner class="fixed inset-0 z-50 flex justify-end">
      <Dialog.Content class="h-screen w-full max-w-md bg-surface-50-950 shadow-xl flex flex-col">
        {#if detail}
          <header class="flex items-start justify-between p-4 border-b border-surface-200-800">
            <div>
              <Dialog.Title class="h5">订单 {detail.id}</Dialog.Title>
              <Dialog.Description class="text-sm opacity-70">{detail.date} · {channelLabel(detail.channel)}</Dialog.Description>
            </div>
            <Dialog.CloseTrigger class="btn-icon min-w-10 min-h-10 hover:preset-tonal" aria-label="关闭"><Icon name="x" /></Dialog.CloseTrigger>
          </header>
          <div class="flex-1 overflow-y-auto p-4">
            <Tabs defaultValue="detail">
              <Tabs.List>
                <Tabs.Trigger value="detail">详情</Tabs.Trigger>
                <Tabs.Trigger value="timeline">时间线</Tabs.Trigger>
                <Tabs.Trigger value="notes">备注</Tabs.Trigger>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Content value="detail">
                <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                  <dt class="opacity-60">客户</dt><dd>{detail.customer}</dd>
                  <dt class="opacity-60">邮箱</dt><dd class="break-all">{detail.email}</dd>
                  <dt class="opacity-60">产品</dt><dd>{detail.product}</dd>
                  <dt class="opacity-60">金额</dt><dd class="font-medium tabular-nums">{money(detail.amount, detail.currency)}</dd>
                  <dt class="opacity-60">状态</dt><dd><StatusBadge status={detail.status} /></dd>
                </dl>
              </Tabs.Content>
              <Tabs.Content value="timeline">
                <ol class="relative border-s border-surface-200-800 ms-2 space-y-4 text-sm">
                  <li class="ms-4"><span class="absolute -start-1.5 mt-1.5 size-3 rounded-full bg-primary-500"></span>订单创建 <time class="block text-xs opacity-60">{detail.date}</time></li>
                  <li class="ms-4"><span class="absolute -start-1.5 mt-1.5 size-3 rounded-full bg-surface-300-700"></span>状态更新为「{detail.status}」</li>
                </ol>
              </Tabs.Content>
              <Tabs.Content value="notes">
                <label class="label">
                  <span class="label-text">内部备注</span>
                  <textarea class="textarea" rows="4" placeholder="记录跟进信息…" bind:value={note}></textarea>
                </label>
                <button type="button" class="btn preset-filled-primary-500 mt-3" onclick={saveNote} disabled={!note.trim()}>保存备注</button>
              </Tabs.Content>
            </Tabs>
          </div>
          <footer class="p-4 border-t border-surface-200-800 flex justify-between gap-2">
            <button type="button" class="btn preset-outlined-error-500" onclick={() => (pendingDelete = detail)}><Icon name="trash" /><span>删除</span></button>
            <button type="button" class="btn preset-filled-primary-500" onclick={() => toaster.success({ title: "已发送发票", description: detail?.email })}>发送发票</button>
          </footer>
        {/if}
      </Dialog.Content>
    </Dialog.Positioner>
  </Portal>
</Dialog>

<Dialog open={pendingDelete !== null} onOpenChange={(d) => { if (!d.open) pendingDelete = null }} role="alertdialog">
  <Portal>
    <Dialog.Backdrop class="fixed inset-0 z-[60] bg-surface-50-950/50" />
    <Dialog.Positioner class="fixed inset-0 z-[60] grid place-items-center p-4">
      <Dialog.Content class="card bg-surface-50-950 p-6 w-full max-w-sm space-y-4 shadow-xl">
        <Dialog.Title class="h5">删除订单？</Dialog.Title>
        <Dialog.Description class="text-sm opacity-70">订单 {pendingDelete?.id} 将被永久删除，此操作无法撤销。</Dialog.Description>
        <div class="flex justify-end gap-2">
          <Dialog.CloseTrigger class="btn preset-tonal">取消</Dialog.CloseTrigger>
          <button type="button" class="btn preset-filled-error-500" onclick={confirmDelete}>删除</button>
        </div>
      </Dialog.Content>
    </Dialog.Positioner>
  </Portal>
</Dialog>
