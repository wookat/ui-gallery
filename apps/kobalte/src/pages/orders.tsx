import { createMemo, createSignal, For, Show } from "solid-js"
import ordersData from "@ui-gallery/spec/mock/orders.json"
import { Icon } from "@/icons"
import { Alert } from "@/ui/alert"
import { Avatar } from "@/ui/avatar"
import { Button } from "@/ui/button"
import { Card, CardContent } from "@/ui/card"
import { Checkbox } from "@/ui/checkbox"
import { Dialog, Drawer } from "@/ui/dialog"
import { DropdownMenu } from "@/ui/dropdown-menu"
import { Pagination } from "@/ui/pagination"
import { Select } from "@/ui/select"
import { Skeleton } from "@/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import { Tabs } from "@/ui/tabs"
import { TextArea, TextField } from "@/ui/text-field"
import { toast } from "@/ui/toast"
import { PageHeader, StatusBadge } from "./shared"

type Order = (typeof ordersData)[number]
const compareAscending = (a: Order, b: Order) => a.amount - b.amount
const compareDescending = (a: Order, b: Order) => b.amount - a.amount

export function OrdersPage() {
  const [query, setQuery] = createSignal("")
  const [status, setStatus] = createSignal("all")
  const [channel, setChannel] = createSignal<string | string[]>("all")
  const [page, setPage] = createSignal(1)
  const [pageSize, setPageSize] = createSignal("10")
  const [selected, setSelected] = createSignal<Order | null>(null)
  const [checked, setChecked] = createSignal<string[]>([])
  const [ascending, setAscending] = createSignal(false)
  const [deleteOpen, setDeleteOpen] = createSignal(false)
  const [rows, setRows] = createSignal<Order[]>(ordersData)
  const state = () => new URLSearchParams(window.location.search).get("state")
  const filtered = createMemo(() => {
    const comparator = ascending() ? compareAscending : compareDescending
    return rows()
      .filter((order) => order.id.toLowerCase().includes(query().toLowerCase()) && (status() === "all" || order.status === status()) && (channel() === "all" || (Array.isArray(channel()) && channel().includes(order.channel))))
      .sort(comparator)
  })
  const visible = createMemo(() => filtered().slice((page() - 1) * Number(pageSize()), page() * Number(pageSize())))
  const remove = () => { if (selected()) setRows(rows().filter((row) => row.id !== selected()?.id)); setSelected(null); setDeleteOpen(false); toast.success("订单已删除") }
  return <div class="space-y-6">
    <PageHeader title="订单管理" description="搜索、筛选并查看全部订单。" action={<Button variant="outline"><Icon name="download" />导出</Button>} />
    <Card><CardContent class="space-y-4 pt-5">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_160px_160px_160px_160px_auto]"><TextField label="搜索订单" placeholder="搜索订单号或客户..." value={query()} onInput={(event) => setQuery(event.currentTarget.value)} /><Select label="状态" options={[{ value: "all", label: "全部状态" }, ...["paid", "pending", "shipped", "failed", "refunded"].map((value) => ({ value, label: value }))]} value={status()} onChange={(value) => setStatus(String(value ?? "all"))} /><TextField label="开始日期" type="date" /><TextField label="结束日期" type="date" /><Select label="渠道" options={[{ value: "all", label: "全部渠道" }, { value: "web", label: "Web" }, { value: "ios", label: "iOS" }, { value: "android", label: "Android" }, { value: "api", label: "API" }]} value={channel()} onChange={(value) => setChannel(value ?? "all")} /><DropdownMenu.Root><DropdownMenu.Trigger as={Button} variant="outline"><Icon name="sliders" />列显示</DropdownMenu.Trigger><DropdownMenu.Portal><DropdownMenu.Content class="z-50 rounded-md border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"><DropdownMenu.CheckboxItem checked class="px-3 py-2 text-sm">客户</DropdownMenu.CheckboxItem><DropdownMenu.CheckboxItem checked class="px-3 py-2 text-sm">金额</DropdownMenu.CheckboxItem></DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root></div>
      <Show when={state() === "error"}><Alert level="error"><div class="flex items-center justify-between"><span>订单加载失败，请重试。</span><Button size="sm" variant="outline" onClick={() => window.location.reload()}>重试</Button></div></Alert></Show>
      <Show when={state() !== "loading"} fallback={<div class="grid gap-3"><For each={[1, 2, 3, 4, 5, 6]}>{() => <Skeleton class="h-10 w-full" />}</For></div>}>
        <Show when={state() !== "empty" && visible().length > 0} fallback={<div class="grid place-items-center gap-3 py-16 text-center"><Icon name="inbox" size={36} class="text-zinc-400" /><p class="font-medium">没有找到订单</p><p class="text-sm text-zinc-500 dark:text-zinc-400">调整搜索或筛选条件后重试。</p><Button variant="outline" onClick={() => { setQuery(""); setStatus("all") }}>清除筛选</Button></div>}>
          <Table><TableHeader><TableRow><TableHead><Checkbox checked={checked().length === visible().length && visible().length > 0} indeterminate={checked().length > 0 && checked().length < visible().length} onChange={(value) => setChecked(value ? visible().map((item) => item.id) : [])} /></TableHead><TableHead>订单号</TableHead><TableHead>客户</TableHead><TableHead>产品</TableHead><TableHead>状态</TableHead><TableHead class="cursor-pointer text-right" onClick={() => setAscending((value) => !value)}>金额 {ascending() ? "↑" : "↓"}</TableHead><TableHead /></TableRow></TableHeader><TableBody><For each={visible()}>{(order) => <TableRow class="cursor-pointer" onClick={() => setSelected(order)}><TableCell onClick={(event) => event.stopPropagation()}><Checkbox checked={checked().includes(order.id)} onChange={(value) => setChecked((items) => value ? [...items, order.id] : items.filter((id) => id !== order.id))} /></TableCell><TableCell>{order.id}</TableCell><TableCell><div class="flex items-center gap-2"><Avatar name={order.customer} />{order.customer}</div></TableCell><TableCell>{order.product}</TableCell><TableCell><StatusBadge value={order.status} /></TableCell><TableCell class="text-right tabular-nums">¥{order.amount.toLocaleString()}</TableCell><TableCell onClick={(event) => event.stopPropagation()}><DropdownMenu.Root><DropdownMenu.Trigger as={Button} variant="ghost" size="icon" aria-label="订单操作">⋯</DropdownMenu.Trigger><DropdownMenu.Portal><DropdownMenu.Content class="z-50 rounded-md border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"><DropdownMenu.Item class="px-3 py-2 text-sm">编辑</DropdownMenu.Item><DropdownMenu.Item class="px-3 py-2 text-sm text-red-600" onSelect={() => { setSelected(order); setDeleteOpen(true) }}>删除</DropdownMenu.Item></DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root></TableCell></TableRow>}</For></TableBody></Table>
        </Show>
      </Show>
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><Pagination page={page()} count={filtered().length} pageSize={Number(pageSize())} onPageChange={setPage} /><div class="flex items-center gap-2"><span class="text-sm text-zinc-500 dark:text-zinc-400">每页</span><Select options={[{ value: "10", label: "10 / 页" }, { value: "20", label: "20 / 页" }]} value={pageSize()} onChange={(value) => setPageSize(String(value ?? "10"))} /></div></div>
    </CardContent></Card>
    <Drawer open={!!selected()} onOpenChange={(open) => !open && setSelected(null)} title={selected()?.id ?? "订单详情"} description="查看订单的完整信息与操作。"><Show when={selected()}>{(order) => <div class="space-y-6"><dl class="grid gap-3 text-sm sm:grid-cols-2"><div><dt class="text-zinc-500 dark:text-zinc-400">客户</dt><dd>{order().customer}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">邮箱</dt><dd>{order().email}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">状态</dt><dd><StatusBadge value={order().status} /></dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">金额</dt><dd>¥{order().amount.toLocaleString()}</dd></div></dl><Tabs.Root defaultValue="detail"><Tabs.List class="flex border-b border-zinc-200 dark:border-zinc-800"><Tabs.Trigger value="detail" class="px-3 py-2 text-sm data-[selected]:border-b-2 data-[selected]:border-blue-600">详情</Tabs.Trigger><Tabs.Trigger value="shipping" class="px-3 py-2 text-sm data-[selected]:border-b-2 data-[selected]:border-blue-600">物流</Tabs.Trigger><Tabs.Trigger value="notes" class="px-3 py-2 text-sm data-[selected]:border-b-2 data-[selected]:border-blue-600">备注</Tabs.Trigger></Tabs.List><Tabs.Content value="detail" class="pt-4 text-sm">产品：{order().product}<br />下单日期：{order().date}</Tabs.Content><Tabs.Content value="shipping" class="pt-4 text-sm">配送渠道：{order().channel}</Tabs.Content><Tabs.Content value="notes" class="pt-4"><TextArea label="订单备注" placeholder="添加备注..." /></Tabs.Content></Tabs.Root><Button variant="destructive" class="w-full" onClick={() => setDeleteOpen(true)}><Icon name="trash" />删除订单</Button></div>}</Show></Drawer>
    <Dialog.Root open={deleteOpen()} onOpenChange={setDeleteOpen}><Dialog.Portal><Dialog.Overlay class="fixed inset-0 z-50 bg-black/40" /><Dialog.Content class="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"><Dialog.Title class="text-lg font-semibold">确认删除订单？</Dialog.Title><Dialog.Description class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">此操作无法撤销。</Dialog.Description><div class="mt-5 flex justify-end gap-2"><Dialog.CloseButton class="rounded-md border px-3 py-2 text-sm">取消</Dialog.CloseButton><Button variant="destructive" onClick={remove}>确认删除</Button></div></Dialog.Content></Dialog.Portal></Dialog.Root>
  </div>
}
