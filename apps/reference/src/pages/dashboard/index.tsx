import * as React from "react"
import { useSearchParams } from "react-router-dom"
import { cn } from "@/lib/cn"
import { BanIcon, ChevronRightIcon, EllipsisIcon, EyeIcon, PackageCheckIcon, PlugIcon, PrinterIcon, RefreshCwIcon, UploadIcon } from "lucide-react"

import { Avatar } from "@/components/composed/avatar"
import { DonutChart, TrendChart } from "@/components/composed/charts"
import { StatCard, StatCardSkeleton } from "@/components/composed/stat-card"
import { StateCard } from "@/components/composed/state-card"
import { TaskItem, type TaskStatus } from "@/components/composed/task-item"
import { Timeline, TimelineItem } from "@/components/composed/timeline"
import { Tag } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconButton } from "@/components/ui/icon-button"
import { Skeleton } from "@/components/ui/skeleton"
import { notYet, toast } from "@/components/ui/sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableWrap } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { orderStatus, t } from "@/data/content"
import { channelLabel, mock, periods, seriesFor, statFor, type Order, type Period } from "@/data/mock"
import { useScreenState } from "@/data/screen-state"
import { formatCompact, formatCurrency, formatCurrencyWhole, formatDateTime, formatInteger, formatMonthDay, formatPercent, formatTime, formatToday } from "@/lib/format"
import { tokenMs, useBelowWidth } from "@/lib/media"

import { AppShell } from "./shell"

export const path = "/"

const states = ["success", "loading", "empty", "error"] as const

type DeltaTone = NonNullable<React.ComponentProps<typeof StatCard>["delta"]>["tone"]

type StatDef = {
  key: string
  label: string
  format: string
  deltaFormat: string
  unit?: string
  deltaTone?: string
  invertDelta?: boolean
}
const statDefs: StatDef[] = mock.stats.cards

/** 值长度阈值：≥12 字符（如 ¥1,186,420,999）降级为 heading 字号（hifi .stat-value.is-long） */
const LONG_VALUE = 12

const team = new Map(mock.team.map((m) => [m.id, m]))

/** IA §3.2：待发货 = 查看/发货/打印/取消；待付款 = 查看/取消；其余仅查看 */
const canShip = (o: Order) => o.status === "pending_shipment"
const canCancel = (o: Order) => o.status === "pending_shipment" || o.status === "pending_payment"

/** 单据编号（SO-/PO-…）整体不折行 */
const refIdPattern = /\b([A-Z]{2,}-\d{6,}(?:-\d+)?)\b/g
function withRefIds(text: string) {
  const out: React.ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(refIdPattern)) {
    if (m.index > last) out.push(text.slice(last, m.index))
    out.push(
      <span key={m.index} className="tabular-nums whitespace-nowrap">
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function deltaOf(def: StatDef, delta: number) {
  if (delta === 0) return { tone: "neutral" as const, direction: "flat" as const, text: t("dashboard.delta.flat") }
  const up = delta > 0
  const good = def.invertDelta ? !up : up
  const tone: DeltaTone = def.deltaTone === "neutral" ? "neutral" : good ? "success" : "danger"
  const text =
    def.deltaFormat === "percent"
      ? t(up ? "dashboard.delta.up" : "dashboard.delta.down", { n: formatPercent(delta) })
      : t("dashboard.delta.count", { sign: up ? "+" : "−", n: formatInteger(Math.abs(delta)) })
  return { tone, direction: up ? ("up" as const) : ("down" as const), text }
}

function itemsText(o: Order) {
  const first = o.items[0]
  return (
    <>
      {first.name} ×{first.qty}
      {o.items.length > 1 ? <span className="text-fg-muted"> {t("dashboard.orders.moreItems", { n: o.items.length })}</span> : null}
    </>
  )
}

const orderAction = (key: string) => () => notYet(t(`dashboard.orders.action.${key}`))

/** 始终受控：open 只能是 boolean，受控 / 非受控切换会让 Radix 内部状态残留 open */
function OrderMenu({ order, open, onOpenChange }: { order: Order; open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <IconButton label={t("dashboard.orders.action.menu")} aria-haspopup="menu" data-order-menu={order.id}>
          <EllipsisIcon />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent compact aria-label={t("dashboard.orders.action.menu")}>
        <DropdownMenuItem onSelect={orderAction("view")}>
          <EyeIcon /> {t("dashboard.orders.action.view")}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!canShip(order)} onSelect={orderAction("ship")}>
          <PackageCheckIcon /> {t("dashboard.orders.action.ship")}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!canShip(order)} onSelect={orderAction("print")}>
          <PrinterIcon /> {t("dashboard.orders.action.print")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger" disabled={!canCancel(order)} onSelect={orderAction("cancel")}>
          <BanIcon /> {t("dashboard.orders.action.cancel")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** 「查看全部」：指向本轮不可达路径，保持可聚焦的 aria-disabled 链接（AGENTS fg-disabled 契约） */
function ViewAll({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button variant="ghost" size="sm" className="cursor-not-allowed" asChild>
      <a href={href} aria-disabled="true" onClick={(e) => e.preventDefault()}>
        {children}
        <ChevronRightIcon className="size-icon-sm" />
      </a>
    </Button>
  )
}

/** 表格容器可横向滚动时（如 768）显示滑动提示（hifi #tableHint） */
function useScrollable<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [scrollable, setScrollable] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setScrollable(el.scrollWidth > el.clientWidth + 1)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, scrollable] as const
}

function SuccessView({ period, menu, setMenu }: { period: Period; menu: string | null; setMenu: (id: string | null) => void }) {
  const [tableRef, tableScrollable] = useScrollable<HTMLDivElement>()
  const series = seriesFor(period)
  const periodLabel = mock.meta.periods[period].label
  const points = series.points
  const gmvSum = points.reduce((s, p) => s + p.gmv, 0)
  const ordersSum = points.reduce((s, p) => s + p.orders, 0)
  const peak = points.reduce((a, p) => (p.gmv > a.gmv ? p : a), points[0])
  const donut = series.channels.items.map((c) => ({ key: c.key, label: channelLabel(c.key), value: c.gmv, share: c.share }))
  const summaryId = "trend-summary"
  const orderMenu = (o: Order, suffix: string) => (
    <OrderMenu order={o} open={menu === `${o.id}${suffix}`} onOpenChange={(open) => setMenu(open ? `${o.id}${suffix}` : null)} />
  )

  return (
    <>
      <section aria-label={t("dashboard.stats.title")} className="grid grid-cols-4 gap-4 tablet:grid-cols-2 mobile:gap-3">
        {statDefs.map((c) => {
          const s = statFor(period, c.key as Parameters<typeof statFor>[1])
          const value = c.format === "currency" ? formatCurrencyWhole(s.value) : formatInteger(s.value)
          return (
            <StatCard
              key={c.key}
              aria-label={c.label}
              label={c.label}
              value={value}
              unit={c.unit}
              long={value.length >= LONG_VALUE}
              trend={s.trend}
              delta={deltaOf(c, s.delta)}
            />
          )
        })}
      </section>

      <section className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 tablet:grid-cols-1">
        <Card className="flex flex-col">
          <CardHeader className="mobile:flex-wrap">
            <div className="min-w-0">
              <CardTitle>{t("dashboard.chart.title")}</CardTitle>
              <CardDescription>{t("dashboard.chart.subtitle")}</CardDescription>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-role-caption whitespace-nowrap text-fg-muted">
              <span className="inline-flex items-center gap-2">
                <i aria-hidden className="h-1 w-3 rounded-full bg-chart-line" />
                {t("dashboard.chart.legend.gmv")}
              </span>
              <span className="inline-flex items-center gap-2">
                <i aria-hidden className="size-3 rounded-xs bg-neutral-soft shadow-[inset_0_0_0_var(--border-width-hairline)_var(--color-chart-bar)]" />
                {t("dashboard.chart.legend.orders")}
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <TrendChart
              title={t("dashboard.chart.aria")}
              describedBy={summaryId}
              data={points}
              labels={{ gmv: t("dashboard.chart.legend.gmv"), orders: t("dashboard.chart.legend.orders") }}
              formatGmv={formatCurrencyWhole}
              formatOrders={formatInteger}
              axes={{ gmv: formatCompact, orders: formatInteger }}
              className="flex-1"
            />
            <p id={summaryId} className="sr-only">
              {t("dashboard.chart.summary", {
                periodLabel,
                count: points.length,
                gmv: formatCurrencyWhole(gmvSum),
                orders: formatInteger(ordersSum),
                peakLabel: peak.label,
                peakGmv: formatCurrencyWhole(peak.gmv),
              })}
            </p>
            <div className="sr-only">
              <table>
                <caption>{t("dashboard.chart.table", { periodLabel })}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t("dashboard.chart.col.time")}</th>
                    <th scope="col">{t("dashboard.chart.legend.gmv")}</th>
                    <th scope="col">{t("dashboard.chart.legend.orders")}</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((p) => (
                    <tr key={p.label}>
                      <th scope="row">{p.label}</th>
                      <td>{formatCurrencyWhole(p.gmv)}</td>
                      <td>{formatInteger(p.orders)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <div className="min-w-0">
              <CardTitle>{t("dashboard.donut.title")}</CardTitle>
              <CardDescription>{t("dashboard.donut.subtitle", { periodLabel })}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DonutChart
              title={t("dashboard.donut.aria")}
              items={donut}
              total={formatCurrencyWhole(series.channels.total)}
              totalLabel={t("dashboard.donut.total")}
              formatValue={formatCurrencyWhole}
              formatShare={(n) => `${formatPercent(n)}%`}
              className="tablet:flex-row tablet:justify-center tablet:gap-10 tablet:[&>ul]:w-auto tablet:[&>ul]:flex-[0_1_var(--size-form-max)] mobile:flex-col mobile:gap-4 mobile:[&>ul]:w-full mobile:[&>ul]:flex-none"
            />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.orders.title")}</CardTitle>
          <CardAction className="mobile:-mr-2">
            <ViewAll href="/orders">{t("dashboard.orders.viewAll")}</ViewAll>
          </CardAction>
        </CardHeader>
        <CardContent>
          <TableWrap ref={tableRef} className="mobile:-mx-4 mobile:px-4 max-md:hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">{t("dashboard.orders.col.id")}</TableHead>
                  <TableHead scope="col">{t("dashboard.orders.col.customer")}</TableHead>
                  <TableHead scope="col">{t("dashboard.orders.col.items")}</TableHead>
                  <TableHead scope="col" className="text-right">
                    {t("dashboard.orders.col.amount")}
                  </TableHead>
                  <TableHead scope="col">{t("dashboard.orders.col.channel")}</TableHead>
                  <TableHead scope="col">{t("dashboard.orders.col.status")}</TableHead>
                  <TableHead scope="col">{t("dashboard.orders.col.time")}</TableHead>
                  <TableHead scope="col" className="w-hit text-right">
                    <span className="sr-only">{t("dashboard.orders.col.actions")}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mock.orders.map((o) => {
                  const st = orderStatus[o.status]
                  return (
                    <TableRow key={o.id}>
                      <TableCell>
                        <span className="font-mono text-sm">{o.id}</span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <Avatar size="sm" initial={o.customer.initial} hue={o.customer.avatarHue} name={o.customer.name} />
                          {o.customer.name}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[calc(var(--size-content-max)/5)] truncate">{itemsText(o)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(o.amount)}</TableCell>
                      <TableCell>{channelLabel(o.channel)}</TableCell>
                      <TableCell>
                        <Tag tone={st.tone}>{st.label}</Tag>
                      </TableCell>
                      <TableCell className="tabular-nums text-fg-muted">{formatDateTime(o.placedAt)}</TableCell>
                      <TableCell className="w-hit py-1 text-right">{orderMenu(o, "")}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableWrap>
          {tableScrollable ? (
            <p aria-hidden className="mt-3 text-role-caption text-fg-muted max-md:hidden">
              {t("dashboard.orders.mobileHint")}
            </p>
          ) : null}
          <div className="hidden flex-col gap-3 max-md:flex">
            {mock.orders.map((o) => {
              const st = orderStatus[o.status]
              return (
                <article key={o.id} aria-label={t("dashboard.orders.card.aria", { id: o.id })} className="flex flex-col gap-2 rounded-md border py-3 pr-3 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="flex-1 font-mono text-sm whitespace-nowrap">{o.id}</span>
                    <Tag tone={st.tone} className="shrink-0">
                      {st.label}
                    </Tag>
                  </div>
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar size="sm" initial={o.customer.initial} hue={o.customer.avatarHue} name={o.customer.name} />
                    <span className="min-w-0 truncate text-role-label">{o.customer.name}</span>
                    <span className="min-w-0 truncate text-fg-muted">{itemsText(o)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-role-title tabular-nums">{formatCurrency(o.amount)}</span>
                    <span className="ml-auto text-right text-role-caption whitespace-nowrap tabular-nums text-fg-muted">
                      {channelLabel(o.channel)} · {formatDateTime(o.placedAt)}
                    </span>
                    {orderMenu(o, "-card")}
                  </div>
                </article>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-2 gap-4 mobile:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.activity.title")}</CardTitle>
            <CardAction className="mobile:-mr-2">
              <ViewAll href="/activity">{t("dashboard.activity.viewAll")}</ViewAll>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Timeline>
              {mock.activity.map((a) => {
                const m = team.get(a.actor)
                return (
                  <TimelineItem
                    key={a.id}
                    actor={m ? { initial: m.initial, hue: m.avatarHue, name: m.name } : { initial: "", name: a.actorName, system: true }}
                    time={formatTime(a.at)}
                    detail={a.detail}
                  >
                    <strong className="font-medium">{a.actorName}</strong> {withRefIds(a.text)}
                  </TimelineItem>
                )
              })}
            </Timeline>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.tasks.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {mock.tasks.map((task) => {
                const m = team.get(task.owner)
                return (
                  <li key={task.id}>
                    <TaskItem
                      title={task.title}
                      status={task.status as TaskStatus}
                      percent={task.percent}
                      ariaLabel={t("dashboard.tasks.aria", { title: task.title, percent: task.percent })}
                      meta={
                        <>
                          <Avatar size="sm" initial={m?.initial ?? task.ownerName.slice(-1)} hue={m?.avatarHue} name={task.ownerName} />
                          <span>{task.ownerName}</span>
                          <span data-due="">{t("dashboard.tasks.due", { date: formatMonthDay(task.dueDate) })}</span>
                        </>
                      }
                      count={
                        <>
                          <b>{formatInteger(task.done)}</b>/{formatInteger(task.total)} {task.unit}
                        </>
                      }
                    />
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      </section>
    </>
  )
}

function SkeletonCard({ head, children, className }: { head: string; children: React.ReactNode; className?: string }) {
  return (
    <Card aria-hidden className={className}>
      <CardHeader>
        <Skeleton className={cn("h-4", head)} />
      </CardHeader>
      {children}
    </Card>
  )
}

/** hifi .sk-row 文本宽度序列：80% / 60% / 80% / 40% / 60% */
const skeletonRowWidths = ["w-4/5", "w-3/5", "w-4/5", "w-2/5", "w-3/5"]

function SkeletonRows({ rows, tail = true }: { rows: number; tail?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="grid grid-cols-[var(--size-avatar-sm)_1fr_auto] items-center gap-3">
          <Skeleton className="size-avatar-sm rounded-full" />
          <Skeleton className={cn("h-3", skeletonRowWidths[i % skeletonRowWidths.length])} />
          {tail ? <Skeleton className="h-3 w-12" /> : <span />}
        </div>
      ))}
    </div>
  )
}

function LoadingView() {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-6 mobile:gap-4">
      <span className="sr-only">{t("dashboard.loading.aria")}</span>
      <div aria-hidden className="grid grid-cols-4 gap-4 tablet:grid-cols-2 mobile:gap-3">
        {statDefs.map((c) => (
          <StatCardSkeleton key={c.key} />
        ))}
      </div>
      <div aria-hidden className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 tablet:grid-cols-1">
        <SkeletonCard head="w-1/4">
          <Skeleton className="h-chart-trend rounded-md mobile:h-chart-trend-mobile" />
        </SkeletonCard>
        <SkeletonCard head="w-2/5">
          <Skeleton className="mx-auto size-donut rounded-full" />
          <div className="mt-4 flex flex-col gap-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
        </SkeletonCard>
      </div>
      <SkeletonCard head="w-1/4">
        <SkeletonRows rows={5} />
      </SkeletonCard>
      <div aria-hidden className="grid grid-cols-2 gap-4 mobile:grid-cols-1">
        <SkeletonCard head="w-1/4">
          <SkeletonRows rows={4} />
        </SkeletonCard>
        <SkeletonCard head="w-1/4">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-3 w-full" />
          </div>
        </SkeletonCard>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { state, period, open, toast: toastQ, hold, set } = useScreenState(states)
  const [params] = useSearchParams()
  const sidebar = params.get("sidebar")
  const empty = state === "empty"
  /* 订单表格 ↔ 卡片切换用 max-md（< 768，hifi：768 仍为表格横向滚动），菜单目标须与 DOM 同一断点语义 */
  const cards = useBelowWidth("--breakpoint-md")
  const [menu, setMenu] = React.useState<string | null>(null)
  const retried = React.useRef(false)
  const tabsRef = React.useRef<HTMLDivElement>(null)

  const orderMenuQuery = open === "order-menu" && state === "success"
  const setMenuKey = (id: string | null) => {
    setMenu(id)
    if (!id && orderMenuQuery) set({ open: null })
  }

  /* ?open=order-menu：与 hifi 一致，先把首单的「更多」滚到视口中央再开菜单（表格隐藏时用卡片的） */
  React.useEffect(() => {
    if (!orderMenuQuery) return
    const key = `${mock.orders[0].id}${cards ? "-card" : ""}`
    const visible = Array.from(document.querySelectorAll<HTMLElement>(`[data-order-menu="${mock.orders[0].id}"]`)).find((el) => el.offsetParent)
    visible?.scrollIntoView({ block: "center" })
    const id = requestAnimationFrame(() => setMenu(key))
    return () => cancelAnimationFrame(id)
  }, [orderMenuQuery, cards])

  React.useEffect(() => {
    if (toastQ !== "login" || state !== "success") return
    const id = toast.success(t("login.toast.success", { name: mock.user.shortName }), {
      duration: hold ? Infinity : tokenMs("--timing-toast-stay"),
    })
    return () => {
      toast.dismiss(id)
    }
  }, [toastQ, hold, state])

  React.useEffect(() => {
    if (state !== "success" || !retried.current) return
    retried.current = false
    tabsRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus()
  }, [state])

  const retry = () => {
    retried.current = true
    set({ state: "loading" })
    window.setTimeout(() => set({ state: "success" }), tokenMs("--motion-skeleton"))
  }

  const help = t("dashboard.error.help")
  const statusLink = t("dashboard.error.statusLink")
  const helpAt = help.indexOf(statusLink)
  const [helpBefore, helpAfter] = helpAt >= 0 ? [help.slice(0, helpAt), help.slice(helpAt + statusLink.length)] : [help, ""]

  const head = (
    <section className="flex flex-wrap items-end justify-between gap-4 mobile:flex-col mobile:items-stretch">
        <div className="flex flex-col gap-1">
          <p className="text-role-display mobile:text-role-heading">{empty ? t("dashboard.empty.greeting") : t("dashboard.greeting")}</p>
          {empty ? null : (
            <p className="text-role-caption text-fg-muted">
              {t("dashboard.asOf", { time: `${formatToday()} ${formatTime(mock.meta.asOf)}` })}
            </p>
          )}
        </div>
        {state === "success" ? (
          <TabsList ref={tabsRef} aria-label={t("dashboard.period.aria")} className="mobile:flex mobile:w-full">
            {periods.map((p) => (
              <TabsTrigger key={p} value={p} className="mobile:min-w-0 mobile:flex-1">
                {t(`dashboard.period.${p}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        ) : null}
    </section>
  )

  return (
    <AppShell empty={empty} sidebar={sidebar} open={open} setOpen={(v) => set({ open: v })}>
      <h1 className="sr-only">{t("dashboard.title")}</h1>
      {state === "success" ? (
        <Tabs value={period} onValueChange={(v) => set({ period: v })} className="contents">
          {head}
          {/* 三个周期共用同一视图：当前周期渲染 SuccessView，其余 panel 保留占位以满足 aria-controls */}
          {periods.map((p) =>
            p === period ? (
              <TabsContent key={p} value={p} className="contents">
                <SuccessView period={period} menu={menu} setMenu={setMenuKey} />
              </TabsContent>
            ) : (
              <TabsContent key={p} value={p} forceMount hidden className="hidden" />
            ),
          )}
        </Tabs>
      ) : (
        head
      )}
      {state === "loading" ? <LoadingView /> : null}
      {state === "empty" ? (
        <StateCard
          kind="empty"
          title={t("dashboard.empty.title")}
          body={t("dashboard.empty.body")}
          className="mobile:px-4 mobile:py-12 mobile:[&>div:first-of-type]:w-full mobile:[&>div:first-of-type]:flex-col mobile:[&>div:first-of-type]:items-stretch"
          actions={
            <>
              <Button className="cursor-not-allowed" asChild>
                <a href="/channels/new" aria-disabled="true" onClick={(e) => e.preventDefault()}>
                  <PlugIcon className="size-icon-sm" />
                  {t("dashboard.empty.primary")}
                </a>
              </Button>
              <Button variant="secondary" className="cursor-not-allowed" asChild>
                <a href="/orders/import" aria-disabled="true" onClick={(e) => e.preventDefault()}>
                  <UploadIcon className="size-icon-sm" />
                  {t("dashboard.empty.secondary")}
                </a>
              </Button>
            </>
          }
        />
      ) : null}
      {state === "error" ? (
        <StateCard
          kind="error"
          title={t("dashboard.error.title")}
          body={t("dashboard.error.body")}
          className="mobile:px-4 mobile:py-12 mobile:[&>div:first-of-type]:w-full mobile:[&>div:first-of-type]:flex-col mobile:[&>div:first-of-type]:items-stretch"
          actions={
            <Button onClick={retry}>
              <RefreshCwIcon className="size-icon-sm" />
              {t("dashboard.error.retry")}
            </Button>
          }
          help={
            <>
              {helpBefore}
              <a href="/status" aria-disabled="true" className="cursor-not-allowed text-link underline underline-offset-2" onClick={(e) => e.preventDefault()}>
                {statusLink}
              </a>
              {helpAfter}
            </>
          }
        />
      ) : null}
    </AppShell>
  )
}
