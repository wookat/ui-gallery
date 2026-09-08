import * as React from "react"
import { useSearchParams } from "react-router-dom"
import { cn } from "@/lib/cn"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BanIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  Columns3Icon,
  CopyIcon,
  DownloadIcon,
  EllipsisIcon,
  EyeIcon,
  PackageCheckIcon,
  PlugIcon,
  PlusIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  Trash2Icon,
  WifiOffIcon,
  XIcon,
  ZapIcon,
  ZapOffIcon,
} from "lucide-react"

import { Avatar } from "@/components/composed/avatar"
import { StateCard } from "@/components/composed/state-card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tag } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DescriptionDetails, DescriptionList, DescriptionTerm } from "@/components/ui/description-list"
import { Drawer, DrawerBody, DrawerContent, DrawerFooter } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pagination } from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select } from "@/components/ui/select"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { orderStatus, t } from "@/data/content"
import { channelLabel, mock } from "@/data/mock"
import { useScreenState } from "@/data/screen-state"
import { formatCurrency, formatDateTime, formatInteger, formatTime, formatToday } from "@/lib/format"
import { tokenMs, useBelowWidth } from "@/lib/media"

import { AppShell } from "../dashboard/shell"

/* ---------- 数据 ---------- */

type OrderItem = { sku: string; name: string; qty: number; unitPrice: number }
type Remark = { by: string; byName: string; at: string; text: string }
type OrderRow = {
  id: string
  placedAt: string
  customer: { name: string; phoneMasked: string; initial: string; avatarHue: number }
  items: OrderItem[]
  amount: number
  channel: string
  status: string
  warehouse?: string
  paidAt?: string
  expiresAt?: string
  address?: string
  store?: string
  urgent?: boolean
  stockout?: boolean
  carrier?: string
  trackingNo?: string
  shippedAt?: string
  completedAt?: string
  cancelledAt?: string
  cancelReason?: string
  refundReason?: string
  logistics?: { at: string; text: string }[]
  remarks: Remark[]
}

const seed = mock.ordersAll as unknown as OrderRow[]
const SUM = mock.ordersSummary
const asOf = mock.meta.asOf

type DateKey = keyof typeof SUM.byRange
type Filters = { search: string; status: string; date: DateKey; channels: string[] }
const DATE_KEYS: DateKey[] = ["today", "week", "month"]
const STATUS_KEYS = Object.keys(SUM.byStatus) as (keyof typeof SUM.byStatus)[]
const defaultFilters: Filters = { search: "", status: "all", date: "week", channels: [] }
/** hifi ?state=empty-filtered 的预置筛选（关键词取样本外商品名，保证零匹配） */
const emptyFilters: Filters = { search: "羊毛地毯", status: "pending_payment", date: "today", channels: ["offline"] }

const hasFilter = (f: Filters) => !!(f.search || f.status !== "all" || f.date !== "week" || f.channels.length)
const filterCount = (f: Filters) => (f.search ? 1 : 0) + (f.status !== "all" ? 1 : 0) + (f.date !== "week" ? 1 : 0) + (f.channels.length ? 1 : 0)

function matchRows(rows: OrderRow[], f: Filters) {
  const kw = f.search.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return rows.filter((o) => {
    if (f.status !== "all" && o.status !== f.status) return false
    if (f.channels.length && !f.channels.includes(o.channel)) return false
    if (f.date === "today" && o.placedAt.slice(0, 10) !== asOf.slice(0, 10)) return false
    if (kw.length) {
      const hay = `${o.id} ${o.customer.name} ${o.items.map((i) => i.name).join(" ")}`.toLowerCase()
      if (!kw.every((k) => hay.includes(k))) return false
    }
    return true
  })
}

/** 服务端计数：按 summary 分组比例估算，且不小于样本匹配行数（hifi filteredTotal） */
function filteredTotal(rows: OrderRow[], f: Filters) {
  const total = SUM.byRange[f.date]
  let n = total
  if (f.status !== "all") n = (n * SUM.byStatus[f.status as keyof typeof SUM.byStatus]) / SUM.total
  if (f.channels.length) n = (n * f.channels.reduce((a, k) => a + (SUM.byChannel[k as keyof typeof SUM.byChannel] ?? 0), 0)) / SUM.total
  const m = matchRows(rows, f).length
  if (f.search) n = m ? Math.max(Math.round((n * m) / rows.length), m) : 0
  return Math.max(Math.round(n), m)
}

const countOf = (rows: OrderRow[], f: Filters) => (hasFilter(f) ? filteredTotal(rows, f) : SUM.byRange[f.date])

type SortKey = "id" | "amount" | "placedAt"
type SortDir = "asc" | "desc"
const isSortKey = (v: string | null): v is SortKey => v === "id" || v === "amount" || v === "placedAt"

function sortRows(rows: OrderRow[], key: SortKey, dir: SortDir) {
  return [...rows].sort((a, b) => {
    let r = key === "amount" ? a.amount - b.amount : String(a[key]).localeCompare(String(b[key]))
    if (r === 0) r = b.placedAt.localeCompare(a.placedAt)
    return dir === "asc" ? r : -r
  })
}

const canShip = (o: OrderRow) => o.status === "pending_shipment"
const canCancel = (o: OrderRow) => o.status === "pending_shipment" || o.status === "pending_payment"
const canDelete = (o: OrderRow) => o.status === "cancelled"

const fullTime = (iso: string) => `${iso.slice(0, 10)} ${formatTime(iso)}`
/** 与 hifi mdhm 一致：本年份 `09-06 17:27`，非本年份补年 */
const shortTime = (iso: string) => (iso.slice(0, 4) === asOf.slice(0, 4) ? formatDateTime(iso) : fullTime(iso))
const qtySum = (o: OrderRow) => o.items.reduce((a, i) => a + i.qty, 0)
/** hifi renderPager：样本可达页全列 + 下一页（不可达）+ 省略号 + 末页，如「1 2 3 4 … 37」 */
const pagerPages = (reach: number, totalPages: number): (number | "…")[] => {
  const items: (number | "…")[] = []
  for (let i = 1; i <= Math.min(reach, totalPages); i++) items.push(i)
  if (totalPages > reach) {
    items.push(reach + 1)
    if (totalPages > reach + 2) items.push("…")
    if (totalPages > reach + 1) items.push(totalPages)
  }
  return items
}
const rowLabel = (o: OrderRow) => t("orders.mobile.card.aria", { id: o.id, status: orderStatus[o.status]?.label ?? o.status, amount: formatCurrency(o.amount) })

const copyText = (s: string) => {
  navigator.clipboard?.writeText(s).catch(() => {})
  toast.success(t("orders.toast.copied"), { duration: tokenMs("--timing-toast-stay") })
}

/** hifi .chk / .rdo：视觉控件 icon.sm（16），热区仍由外层 size-hit 容器 / hit-area 保证 ≥ size.hit */
const ctl16 = "size-icon-sm"
/** hifi .rdo:checked：整圆 primary 实心 + on-primary 内点（而非共享 RadioGroupItem 的粗边空心） */
const rdo16 = cn(ctl16, "data-[state=checked]:border data-[state=checked]:bg-primary [&_[data-slot=radio-group-indicator]]:bg-on-primary")
/** hifi [disabled] 统一半透明（而非共享 Button secondary 的 surface-muted 实心） */
const disabledGhost = "disabled:bg-surface disabled:text-fg disabled:disabled-look"

const states = ["success", "loading", "empty-filtered", "empty-new", "error", "empty", "empty-filter"] as const
type State = "success" | "loading" | "empty-filtered" | "empty-new" | "error"

/* ---------- 小件 ---------- */

function OrderId({ id, className }: { id: string; className?: string }) {
  return <span className={cn("font-mono text-sm tracking-normal whitespace-nowrap", className)}>{id}</span>
}

function FlagTags({ o }: { o: OrderRow }) {
  return (
    <>
      {o.urgent ? (
        <Tag tone="danger" dot={false} className="h-5 rounded-xs">
          {t("orders.urgent")}
        </Tag>
      ) : null}
      {o.stockout ? (
        <Tag tone="warning" dot={false} className="h-5 rounded-xs">
          {t("orders.stockout")}
        </Tag>
      ) : null}
    </>
  )
}

function StatusTag({ status, className }: { status: string; className?: string }) {
  const s = orderStatus[status]
  return (
    <Tag tone={s?.tone ?? "neutral"} className={className}>
      {s?.label ?? status}
    </Tag>
  )
}

function ItemsText({ o }: { o: OrderRow }) {
  const first = o.items[0]
  return (
    <>
      {first.name}
      {o.items.length > 1 ? (
        <span className="text-fg-muted"> {t("orders.col.itemsMore", { n: qtySum(o) })}</span>
      ) : first.qty > 1 ? (
        <span className="text-fg-muted"> × {first.qty}</span>
      ) : null}
    </>
  )
}

/** 本轮不可达的主按钮：可聚焦 aria-disabled 链接 + Tooltip */
/** hifi ≤768 .dialog：仍居中（非底部上滑）、内距 space-5、按钮纵向铺满且主操作在上 */
const dialogMobile =
  "mobile:top-1/2 mobile:bottom-auto mobile:left-1/2 mobile:w-[calc(100vw-var(--space-4)*2)] mobile:-translate-1/2 mobile:rounded-xl mobile:p-5"
const dialogFootMobile = "mobile:flex-col-reverse mobile:flex-nowrap mobile:[&>*]:w-full"

function NotYetLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn("cursor-not-allowed border-transparent bg-primary-soft text-on-primary-soft hover:bg-primary-soft hover:border-transparent active:bg-primary-soft active:border-transparent", className)}
          asChild
        >
          <a href={href} role="link" aria-disabled="true" onClick={(e) => e.preventDefault()}>
            {children}
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{t("shell.nav.disabled.tip")}</TooltipContent>
    </Tooltip>
  )
}

/** hifi .check-row：整行可点、右侧计数 */
function CheckRow({
  id,
  label,
  count,
  disabled,
  children,
}: {
  id: string
  label: React.ReactNode
  count?: React.ReactNode
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={id}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex min-h-hit items-center gap-1 rounded-md pr-2 text-role-body select-none",
        disabled ? "cursor-not-allowed text-fg-muted" : "cursor-pointer hover:bg-surface-muted",
      )}
    >
      <span className="grid size-hit shrink-0 place-items-center">{children}</span>
      <span className="min-w-0 flex-1">{label}</span>
      {count !== undefined ? <span className="text-role-caption text-fg-muted tabular-nums">{count}</span> : null}
    </label>
  )
}

type MenuAction = "view" | "ship" | "urgent" | "unurgent" | "copy" | "cancel" | "delete"

function OrderMenu({
  order,
  open,
  onOpenChange,
  onAction,
  className,
  menuKey,
}: {
  order: OrderRow
  open: boolean
  onOpenChange: (o: boolean) => void
  onAction: (a: MenuAction) => void
  className?: string
  menuKey: string
}) {
  const label = t("orders.rowMenu.aria", { id: order.id })
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <IconButton label={label} aria-haspopup="menu" data-order-menu={menuKey} className={className} onClick={(e) => e.stopPropagation()}>
          <EllipsisIcon />
        </IconButton>
      </DropdownMenuTrigger>
      {/* hifi .popover-fixed：行内菜单各视口恒为 menu-w（192），不像 dashboard 那样在卡片化断点下通栏 */}
      <DropdownMenuContent compact aria-label={label} onClick={(e) => e.stopPropagation()} className="max-md:w-[calc(var(--size-content-max)/4*0.6)]">
        <DropdownMenuItem onSelect={() => onAction("view")}>
          <EyeIcon /> {t("orders.rowMenu.view")}
        </DropdownMenuItem>
        {canShip(order) ? (
          <DropdownMenuItem onSelect={() => onAction("ship")}>
            <PackageCheckIcon /> {t("orders.rowMenu.ship")}
          </DropdownMenuItem>
        ) : null}
        {canShip(order) ? (
          order.urgent ? (
            <DropdownMenuItem onSelect={() => onAction("unurgent")}>
              <ZapOffIcon /> {t("orders.rowMenu.unurgent")}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => onAction("urgent")}>
              <ZapIcon /> {t("orders.rowMenu.urgent")}
            </DropdownMenuItem>
          )
        ) : null}
        <DropdownMenuItem onSelect={() => onAction("copy")}>
          <CopyIcon /> {t("orders.rowMenu.copyId")}
        </DropdownMenuItem>
        {canCancel(order) || canDelete(order) ? <DropdownMenuSeparator /> : null}
        {canCancel(order) ? (
          <DropdownMenuItem variant="danger" onSelect={() => onAction("cancel")}>
            <BanIcon /> {t("orders.rowMenu.cancel")}
          </DropdownMenuItem>
        ) : null}
        {canDelete(order) ? (
          <DropdownMenuItem variant="danger" onSelect={() => onAction("delete")}>
            <Trash2Icon /> {t("orders.rowMenu.delete")}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ---------- 工具栏 ---------- */

type ToolbarProps = {
  filters: Filters
  onChange: (f: Filters) => void
  count: number
  total: number
  disabled: boolean
  pop: string | null
  setPop: (v: string | null) => void
  hidden: string[]
  setHidden: (v: string[]) => void
  onExport: () => void
  searchRef: React.RefObject<HTMLInputElement | null>
}

const COLS: { key: string; label: string; fixed?: boolean }[] = [
  { key: "id", label: "orders.col.id", fixed: true },
  { key: "customer", label: "orders.col.customer" },
  { key: "items", label: "orders.col.items" },
  { key: "channel", label: "orders.col.channel" },
  { key: "status", label: "orders.col.status", fixed: true },
  { key: "amount", label: "orders.col.amount" },
  { key: "placedAt", label: "orders.col.placedAt" },
]

function OrdersToolbar({ filters, onChange, count, total, disabled, pop, setPop, hidden, setHidden, onExport, searchRef }: ToolbarProps) {
  const [draft, setDraft] = React.useState(filters.search)
  React.useEffect(() => setDraft(filters.search), [filters.search])
  React.useEffect(() => {
    if (draft === filters.search) return
    const id = window.setTimeout(() => onChange({ ...filters, search: draft }), tokenMs("--timing-debounce"))
    return () => window.clearTimeout(id)
  }, [draft]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = hasFilter(filters)
  const n = filterCount(filters)
  const popProps = (key: string) => ({ open: pop === key, onOpenChange: (o: boolean) => setPop(o ? key : null) })

  return (
    <div role="search" aria-label={t("orders.filter.aria")} className="flex flex-wrap items-center gap-3 border-b px-6 py-4 mobile:gap-2 mobile:px-4 mobile:py-3">
      <div className="relative flex w-[calc(var(--size-sidebar-drawer)*0.8)] items-center xl:w-sidebar-drawer mobile:w-full">
        <SearchIcon aria-hidden className="pointer-events-none absolute left-3 size-icon-sm text-fg-muted" />
        <Input
          ref={searchRef}
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t("orders.search.placeholder")}
          aria-label={t("orders.search.aria")}
          autoComplete="off"
          className="border-border pr-10 pl-10 [&::-webkit-search-cancel-button]:hidden"
        />
        {draft ? (
          <IconButton
            label={t("orders.search.clear")}
            className="absolute right-0"
            onClick={() => {
              setDraft("")
              onChange({ ...filters, search: "" })
              searchRef.current?.focus()
            }}
          >
            <XIcon className="size-icon-sm" />
          </IconButton>
        ) : null}
      </div>

      <Select
        aria-label={t("orders.filter.status")}
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        wrapClassName="w-[calc(var(--size-sidebar-drawer)/2+var(--space-8))] mobile:hidden"
        leading={<span className="justify-self-start pl-3 text-role-body text-fg-muted whitespace-nowrap">{t("orders.filter.status")}：</span>}
        className="border-border pl-13 font-medium"
      >
        <option value="all">{t("orders.filter.status.all")}</option>
        {STATUS_KEYS.map((k) => (
          <option key={k} value={k}>
            {orderStatus[k]?.label ?? k}
          </option>
        ))}
      </Select>

      <Popover {...popProps("date")}>
        <PopoverTrigger asChild>
          <Button variant="secondary" className="w-[calc(var(--size-sidebar-drawer)/2+var(--space-16))] justify-start gap-2 px-3 font-regular mobile:hidden aria-expanded:border-primary" aria-haspopup="dialog">
            <CalendarIcon className="size-icon-sm text-fg-muted" />
            <span className="text-fg-muted">{t("orders.filter.dateRange")}：</span>
            <span className="truncate font-medium">{t(`orders.filter.dateRange.preset.${filters.date}`)}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" aria-label={t("orders.filter.dateRange")} className="w-[calc(var(--size-content-max)/4*0.75)]">
          <PopoverHeader>
            <h2 className="text-role-title">{t("orders.filter.dateRange")}</h2>
          </PopoverHeader>
          <RadioGroup aria-label={t("orders.filter.dateRange.presets")} value={filters.date} onValueChange={(v) => onChange({ ...filters, date: v as DateKey })} className="gap-0">
            {DATE_KEYS.map((k) => (
              <CheckRow key={k} id={`date-${k}`} label={t(`orders.filter.dateRange.preset.${k}`)} count={formatInteger(SUM.byRange[k])}>
                <RadioGroupItem id={`date-${k}`} value={k} className={rdo16} />
              </CheckRow>
            ))}
          </RadioGroup>
          <PopoverFooter>
            <Button variant="ghost" block onClick={() => toast.info(t("orders.toast.dateCustom"), { duration: tokenMs("--timing-toast-stay") })}>
              <CalendarIcon className="size-icon-sm" />
              {t("orders.filter.dateRange.placeholder")}
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>

      <Popover {...popProps("channels")}>
        <PopoverTrigger asChild>
          <Button variant="secondary" className="w-[calc(var(--size-sidebar-drawer)/2)] justify-between px-3 mobile:hidden aria-expanded:border-primary" aria-haspopup="dialog">
            <span className="truncate">{filters.channels.length ? t("orders.filter.channel.selected", { n: filters.channels.length }) : t("orders.filter.channel")}</span>
            <ChevronDownIcon className="size-icon-sm text-fg-muted" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" aria-label={t("orders.filter.channel")} className="w-[calc(var(--size-content-max)/4*0.75)]">
          <div role="group" aria-label={t("orders.filter.channel")}>
            {mock.meta.channels.map((c) => (
              <CheckRow key={c.key} id={`chan-${c.key}`} label={c.label} count={formatInteger(SUM.byChannel[c.key as keyof typeof SUM.byChannel])}>
                <Checkbox
                  id={`chan-${c.key}`}
                  className={ctl16}
                  checked={filters.channels.includes(c.key)}
                  onCheckedChange={(on) => onChange({ ...filters, channels: on ? [...filters.channels, c.key] : filters.channels.filter((k) => k !== c.key) })}
                />
              </CheckRow>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="secondary" className="hidden mobile:inline-flex" aria-haspopup="dialog" aria-expanded={pop === "filter-sheet"} onClick={() => setPop("filter-sheet")}>
        <SlidersHorizontalIcon className="size-icon-sm" />
        {n ? t("orders.mobile.filter.selected", { n }) : t("orders.mobile.filter")}
      </Button>

      {filtered ? (
        <Button variant="ghost" onClick={() => onChange(defaultFilters)}>
          {t("orders.filter.clear")}
        </Button>
      ) : null}

      {/* hifi .toolbar .spacer + .count：计数 flex-1 靠右（伸缩基准 0，不把自己挤到下一行，只有导出/列显示换行） */}
      <span aria-live="polite" className="flex-1 text-right text-fg-muted whitespace-nowrap tabular-nums [&_strong]:font-semibold [&_strong]:text-fg">
        {filtered ? (
          <>
            {t("orders.countFiltered", { n: "{{n}}", total: "{{n}}" })
              .split("{{n}}")
              .map((part, i) => (
                <React.Fragment key={i}>
                  {i > 0 ? <strong>{formatInteger(i === 1 ? count : total)}</strong> : null}
                  {part}
                </React.Fragment>
              ))}
          </>
        ) : (
          t("orders.count", { n: "{{n}}" }).split("{{n}}").map((part, i) => (
            <React.Fragment key={i}>
              {i > 0 ? <strong>{formatInteger(total)}</strong> : null}
              {part}
            </React.Fragment>
          ))
        )}
      </span>

      <Button variant="secondary" className={cn("mobile:hidden", disabledGhost)} disabled={disabled} onClick={onExport}>
        <DownloadIcon className="size-icon-sm" />
        {t("orders.export")}
      </Button>

      <Popover {...popProps("columns")}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <IconButton label={t("orders.columns")} aria-haspopup="dialog" disabled={disabled} className="border border-border-strong mobile:hidden aria-expanded:border-primary disabled:border-border">
                <Columns3Icon />
              </IconButton>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{t("orders.columns")}</TooltipContent>
        </Tooltip>
        <PopoverContent aria-label={t("orders.columns.title")} className="w-[calc(var(--size-content-max)/4*0.75)] mobile:hidden">
          <PopoverHeader>
            <h2 className="text-role-title">{t("orders.columns.title")}</h2>
          </PopoverHeader>
          <div role="group" aria-label={t("orders.columns.title")}>
            {COLS.map((c) => (
              <CheckRow key={c.key} id={`col-${c.key}`} label={t(c.label)} disabled={c.fixed} count={c.fixed ? t("orders.columns.fixed") : undefined}>
                <Checkbox
                  id={`col-${c.key}`}
                  className={ctl16}
                  disabled={c.fixed}
                  checked={!hidden.includes(c.key)}
                  onCheckedChange={(on) => setHidden(on ? hidden.filter((k) => k !== c.key) : [...hidden, c.key])}
                />
              </CheckRow>
            ))}
          </div>
          <PopoverFooter className="flex justify-end">
            <Button variant="ghost" disabled={!hidden.length} onClick={() => setHidden([])}>
              {t("orders.columns.reset")}
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </div>
  )
}

/* ---------- 骨架 ---------- */

const SK_W = ["w-3/5", "w-2/5", "w-4/5", "w-3/5", "w-3/5", "w-2/5", "w-4/5", "w-3/5", "w-3/5", "w-2/5"]
const skGrid = "grid grid-cols-[var(--size-hit)_2fr_2fr_3fr_1.4fr_1.2fr_1.4fr_1.4fr_var(--size-hit)] items-center gap-x-6 px-3"

function LoadingView() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">{t("orders.loading.aria")}</span>
      <Card aria-hidden className="flex flex-col overflow-hidden p-0 mobile:p-0">
        <div className="flex items-center gap-3 border-b px-6 py-4 mobile:flex-wrap mobile:px-4 mobile:py-3">
          <Skeleton className="h-control-md w-sidebar-drawer rounded-md mobile:w-full" />
          <Skeleton className="h-control-md w-[calc(var(--size-sidebar-drawer)/2)] rounded-md mobile:hidden" />
          <Skeleton className="h-control-md w-[calc(var(--size-sidebar-drawer)/2)] rounded-md mobile:hidden" />
          <Skeleton className="h-control-md w-[calc(var(--size-sidebar-drawer)/2)] rounded-md mobile:hidden" />
          <Skeleton className="hidden h-control-md w-20 rounded-md mobile:block" />
          <Skeleton className="ml-auto h-4 w-20 mobile:w-16" />
        </div>
        <div className={cn(skGrid, "h-table-header border-b bg-surface-muted max-md:hidden")}>
          <Skeleton className="size-icon-sm justify-self-center rounded-xs" />
          <Skeleton className="h-3 w-3/5" />
          <Skeleton className="h-3 w-2/5" />
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-2/5" />
          <Skeleton className="h-3 w-2/5" />
          <Skeleton className="h-3 w-2/5 justify-self-end" />
          <Skeleton className="h-3 w-3/5" />
          <span />
        </div>
        {SK_W.map((w, i) => (
          <div key={i} className={cn(skGrid, "h-table-row border-b last:border-b-0 max-md:hidden")}>
            <Skeleton className="size-icon-sm justify-self-center rounded-xs" />
            <Skeleton className="h-3 w-4/5" />
            <span className="flex items-center gap-2">
              <Skeleton className="size-avatar-sm rounded-full" />
              <Skeleton className="h-3 flex-1" />
            </span>
            <Skeleton className={cn("h-3", w)} />
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-3 w-3/5 justify-self-end" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="size-icon-sm rounded-xs" />
          </div>
        ))}
        {SK_W.slice(0, 6).map((w, i) => (
          <div key={i} className="hidden grid-cols-[var(--size-hit)_1fr_var(--size-hit)] items-start gap-2 border-b px-2 pt-3 pb-3 last:border-b-0 max-md:grid">
            <Skeleton className="size-icon-sm self-center justify-self-center rounded-xs" />
            <div className="flex flex-col gap-3 pt-1">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className={cn("h-3", w)} />
              <Skeleton className="h-4 w-2/5" />
            </div>
            <Skeleton className="size-avatar-sm self-center justify-self-center rounded-full" />
          </div>
        ))}
        <div className="flex min-h-[calc(var(--size-hit)+var(--space-6))] items-center gap-3 border-t px-6 py-3 mobile:px-4">
          <Skeleton className="h-4 w-40" />
          <div className="ml-auto flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className={cn("size-hit rounded-md", i >= 2 && "mobile:hidden")} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

/* ---------- 空态插图（hifi 几何图，令牌色） ---------- */

function FilteredFigure() {
  return (
    <svg aria-hidden viewBox="0 0 128 128" className="mb-4 size-empty-figure">
      <circle cx="64" cy="64" r="56" className="fill-surface-muted" />
      <rect x="36" y="28" width="48" height="64" rx="6" className="fill-surface stroke-border-strong" strokeWidth="2" strokeLinejoin="round" />
      <path d="M46 44h28M46 56h20M46 68h14" className="stroke-border-strong" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="82" cy="78" r="14" className="fill-surface stroke-primary" strokeWidth="3" />
      <path d="M92 88l12 12" className="stroke-primary" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function NewFigure() {
  return (
    <svg aria-hidden viewBox="0 0 128 128" className="mb-4 size-empty-figure">
      <circle cx="64" cy="64" r="56" className="fill-surface-muted" />
      <rect x="36" y="28" width="56" height="72" rx="6" className="fill-surface stroke-border-strong" strokeWidth="2" strokeLinejoin="round" />
      <path d="M48 48h32M48 62h32M48 76h20" className="stroke-border-strong" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" fill="none" />
      <rect x="48" y="86" width="32" height="6" rx="3" className="fill-primary-soft" />
      <circle cx="92" cy="36" r="10" className="fill-primary" />
      <path d="M88 36h8M92 32v8" className="stroke-on-primary" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/* ---------- 页面 ---------- */

export default function Orders() {
  const { state: rawState, open, toast: toastQ, hold, set } = useScreenState(states)
  const [params] = useSearchParams()
  const sidebar = params.get("sidebar")
  const state: State = rawState === "empty" || rawState === "empty-filter" ? "empty-filtered" : rawState
  const cards = useBelowWidth("--breakpoint-md")

  const [orders, setOrders] = React.useState<OrderRow[]>(() => seed.map((o) => ({ ...o, remarks: [...o.remarks] })))
  const [filters, setFilters] = React.useState<Filters>(() => (state === "empty-filtered" ? emptyFilters : defaultFilters))
  const [hidden, setHidden] = React.useState<string[]>([])
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set())
  const deleted = React.useRef<{ idx: number; order: OrderRow } | null>(null)
  const [reason, setReason] = React.useState("")
  const [reasonInvalid, setReasonInvalid] = React.useState(false)
  const [remark, setRemark] = React.useState("")
  const searchRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLElement>(null)
  const reasonRef = React.useRef<HTMLSelectElement>(null)
  const retried = React.useRef(false)

  const sortKey: SortKey = isSortKey(params.get("sort")) ? (params.get("sort") as SortKey) : "placedAt"
  const sortDir: SortDir = params.get("dir") === "asc" ? "asc" : "desc"
  const sizeParam = Number(params.get("size"))
  const size = SUM.pagination.pageSizes.includes(sizeParam) ? sizeParam : SUM.pagination.defaultPageSize
  const pageParam = Math.max(1, Number(params.get("page")) || 1)
  const orderParam = params.get("order")
  const tabParam = params.get("tab")
  const tab = tabParam === "logistics" || tabParam === "remarks" ? tabParam : "items"

  const byId = React.useMemo(() => new Map(orders.map((o) => [o.id, o])), [orders])
  const matched = React.useMemo(() => sortRows(matchRows(orders, filters), sortKey, sortDir), [orders, filters, sortKey, sortDir])
  const reach = Math.max(1, Math.ceil(matched.length / size))
  const page = Math.min(pageParam, reach)
  const total = countOf(orders, filters)
  const totalPages = Math.max(1, Math.ceil(total / size))
  const from = (page - 1) * size
  const rows = matched.slice(from, from + size)
  const filtered = hasFilter(filters)

  const view: State = state === "success" || state === "empty-filtered" ? (matched.length || !filtered ? "success" : "empty-filtered") : state
  const empty = view === "empty-new"

  /* ?selected=n：预选排序后的前 n 单 */
  React.useEffect(() => {
    const n = Number(params.get("selected")) || 0
    if (n > 0) setSelected(new Set(matched.slice(0, n).map((o) => o.id)))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const drawerId = open === "drawer" ? (orderParam && byId.has(orderParam) ? orderParam : "SO-20260905-0115") : null
  const drawerOrder = drawerId ? byId.get(drawerId) : undefined
  const dialogKind = open === "dialog-cancel" ? "cancel" : open === "dialog-delete" ? "delete" : null
  const dialogId = dialogKind ? (orderParam && byId.has(orderParam) ? orderParam : dialogKind === "cancel" ? "SO-20260906-0107" : "SO-20260906-0077") : null
  const dialogOrder = dialogId ? byId.get(dialogId) : undefined
  const menuId = open === "order-menu" ? (orderParam && byId.has(orderParam) ? orderParam : "SO-20260906-0108") : null

  const closeOverlay = () => set({ open: null, order: null, tab: null })
  const overlayId = drawerId ?? dialogId
  const lastOverlayId = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (overlayId) lastOverlayId.current = overlayId
  }, [overlayId])
  const returnFocusToRow = (e: Event) => {
    const row = document.querySelector<HTMLElement>(`[data-order-row="${lastOverlayId.current ?? ""}"]`)
    if (!row) return
    e.preventDefault()
    row.focus()
  }
  const openDrawer = (id: string, tabName?: string) => set({ open: "drawer", order: id, tab: tabName ?? null })
  const openDialog = (kind: "cancel" | "delete", id: string) => {
    setReason("")
    setReasonInvalid(false)
    set({ open: `dialog-${kind}`, order: id, tab: null })
  }

  React.useEffect(() => {
    if (!menuId || view !== "success") return
    const el = Array.from(document.querySelectorAll<HTMLElement>(`[data-order-menu="${menuId}"]`)).find((e) => e.offsetParent)
    el?.scrollIntoView({ block: "center" })
  }, [menuId, view])

  const stay = () => tokenMs("--timing-toast-stay")
  const update = (id: string, patch: Partial<OrderRow>) => setOrders((list) => list.map((o) => (o.id === id ? { ...o, ...patch } : o)))

  const applyFilters = (f: Filters) => {
    setFilters(f)
    set({ page: null })
    setSelected(new Set())
  }

  const undoDelete = () => {
    const d = deleted.current
    if (!d) return
    deleted.current = null
    setOrders((list) => [...list.slice(0, d.idx), d.order, ...list.slice(d.idx)])
  }

  const doAction = (a: MenuAction, id: string) => {
    const o = byId.get(id)
    if (!o) return
    if (a === "view") openDrawer(id)
    else if (a === "ship") {
      update(id, { status: "shipped", shippedAt: asOf })
      toast.success(t("orders.toast.shipped", { id }), { duration: stay() })
    } else if (a === "urgent") {
      update(id, { urgent: true })
      toast.success(t("orders.toast.urgent", { id }), { duration: stay() })
    } else if (a === "unurgent") {
      update(id, { urgent: false })
      toast.success(t("orders.toast.unurgent", { id }), { duration: stay() })
    } else if (a === "copy") copyText(id)
    else if (a === "cancel") openDialog("cancel", id)
    else if (a === "delete") openDialog("delete", id)
  }

  const confirmCancel = () => {
    if (!reason) {
      setReasonInvalid(true)
      reasonRef.current?.focus()
      return
    }
    if (dialogId) {
      update(dialogId, { status: "cancelled", cancelledAt: asOf, cancelReason: t(`orders.dialog.cancel.reason.${reason}`) })
      toast.success(t("orders.toast.cancelled", { id: dialogId }), { duration: stay() })
    }
    closeOverlay()
  }

  const confirmDelete = () => {
    if (dialogId) {
      const idx = orders.findIndex((o) => o.id === dialogId)
      if (idx >= 0) {
        deleted.current = { idx, order: orders[idx] }
        setOrders((list) => list.filter((o) => o.id !== dialogId))
        setSelected((s) => {
          const n = new Set(s)
          n.delete(dialogId)
          return n
        })
        toast.success(t("orders.toast.deleted", { id: dialogId }), { duration: stay(), action: { label: t("orders.toast.undo"), onClick: undoDelete } })
      }
    }
    closeOverlay()
  }

  const exportToast = (n: number) => toast.success(t("orders.toast.exportStarted", { n: formatInteger(n), email: mock.user.email }), { duration: stay() })

  const bulkShip = () => {
    const ids = [...selected].filter((id) => canShip(byId.get(id)!))
    setOrders((list) => list.map((o) => (ids.includes(o.id) ? { ...o, status: "shipped", shippedAt: asOf } : o)))
    setSelected(new Set())
    toast.success(ids.length === 1 ? t("orders.toast.shipped", { id: ids[0] }) : t("orders.toast.shippedMany", { n: ids.length }), { duration: stay() })
  }

  /* ?toast=…：与 hifi TOAST 表一致 */
  React.useEffect(() => {
    if (!toastQ || view !== "success") return
    const duration = hold ? Infinity : stay()
    const map: Record<string, () => string | number> = {
      cancelled: () => toast.success(t("orders.toast.cancelled", { id: "SO-20260906-0107" }), { duration }),
      deleted: () => toast.success(t("orders.toast.deleted", { id: "SO-20260906-0077" }), { duration, action: { label: t("orders.toast.undo"), onClick: () => {} } }),
      shipped: () => toast.success(t("orders.toast.shipped", { id: "SO-20260906-0108" }), { duration }),
      urgent: () => toast.success(t("orders.toast.urgent", { id: "SO-20260905-0115" }), { duration }),
      copied: () => toast.success(t("orders.toast.copied"), { duration }),
      export: () => toast.success(t("orders.toast.exportStarted", { n: formatInteger(SUM.byRange.week), email: mock.user.email }), { duration }),
      error: () => toast.error(t("orders.toast.error"), { duration }),
    }
    const show = map[toastQ]
    if (!show) return
    const id = show()
    return () => {
      toast.dismiss(id)
    }
  }, [toastQ, hold, view])

  React.useEffect(() => {
    if (view !== "success" || !retried.current) return
    retried.current = false
    searchRef.current?.focus()
  }, [view])

  const retry = () => {
    retried.current = true
    set({ state: "loading" })
    window.setTimeout(() => set({ state: "success" }), tokenMs("--motion-slow") * 3)
  }

  /* 选择 */
  const visibleIds = rows.map((o) => o.id)
  const visSel = visibleIds.filter((id) => selected.has(id)).length
  const allChecked = visibleIds.length > 0 && visSel === visibleIds.length
  const someChecked = visSel > 0 && visSel < visibleIds.length
  const toggle = (id: string, on: boolean) =>
    setSelected((s) => {
      const n = new Set(s)
      if (on) n.add(id)
      else n.delete(id)
      return n
    })
  const toggleAll = (on: boolean) =>
    setSelected((s) => {
      const n = new Set(s)
      visibleIds.forEach((id) => (on ? n.add(id) : n.delete(id)))
      return n
    })
  const anyShippable = [...selected].some((id) => canShip(byId.get(id)!))

  const setSort = (key: SortKey) => {
    if (sortKey !== key) set({ sort: key, dir: "desc", page: null })
    else if (sortDir === "desc") set({ sort: key, dir: "asc", page: null })
    else set({ sort: null, dir: null, page: null })
  }
  const sortHead = (key: SortKey, label: string, right = false) => {
    const on = sortKey === key
    const Icon = on ? (sortDir === "asc" ? ArrowUpIcon : ArrowDownIcon) : ChevronsUpDownIcon
    return (
      <TableHead aria-sort={on ? (sortDir === "asc" ? "ascending" : "descending") : "none"} data-col={key} className={cn("h-table-header bg-surface-muted py-0", right && "text-right", hidden.includes(key) && "hidden")}>
        <button
          type="button"
          onClick={() => setSort(key)}
          aria-label={`${label}，${t(on ? (sortDir === "asc" ? "orders.sort.asc" : "orders.sort.desc") : "orders.sort.none")}`}
          className={cn(
            "-mx-2 inline-flex min-h-hit items-center gap-1 rounded-sm px-2 whitespace-nowrap transition-colors duration-(--motion-fast) ease-std hover:bg-neutral-soft hover:text-fg [&_svg]:size-icon-sm",
            on ? "text-fg [&_svg]:text-primary" : "[&_svg]:text-fg-disabled",
            right && "flex-row-reverse",
          )}
        >
          {label}
          <Icon aria-hidden />
        </button>
      </TableHead>
    )
  }
  const col = (key: string) => cn(hidden.includes(key) && "hidden")

  const goPage = (p: number) => {
    set({ page: p === 1 ? null : String(p) })
    listRef.current?.scrollIntoView({ block: "start" })
  }

  const toolbar = (
    <OrdersToolbar
      filters={filters}
      onChange={applyFilters}
      count={total}
      total={SUM.byRange[filters.date]}
      disabled={view !== "success"}
      pop={open}
      setPop={(v) => set({ open: v })}
      hidden={hidden}
      setHidden={setHidden}
      onExport={() => exportToast(total)}
      searchRef={searchRef}
    />
  )

  const rangeText = rows.length
    ? t("orders.pagination.range", { from: formatInteger(from + 1), to: formatInteger(from + rows.length), total: formatInteger(total) })
    : t("orders.pagination.range", { from: 0, to: 0, total: formatInteger(total) })

  const head = (
    <section aria-label={t("shell.breadcrumb.root")} className="flex flex-wrap items-end justify-between gap-4 mobile:items-start">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-role-display mobile:text-role-heading">{t("orders.title")}</h1>
        <p className="text-role-caption text-fg-muted">
          {empty ? t("orders.subtitle", { time: "" }).replace(/，.*$/, "") : t("orders.subtitle", { time: `${formatToday()} ${formatTime(asOf)}` })}
        </p>
      </div>
      {empty ? null : (
        <div className="flex gap-3">
          <NotYetLink href="/orders/new" className="mobile:px-3">
            <PlusIcon className="size-icon-sm" />
            {t("orders.create")}
          </NotYetLink>
        </div>
      )}
    </section>
  )

  const drawerFootVisible = drawerOrder ? canShip(drawerOrder) || canCancel(drawerOrder) || canDelete(drawerOrder) : false

  return (
    <AppShell empty={empty} sidebar={sidebar} open={open} setOpen={(v) => set({ open: v })} current="orders" currentLabel={t("orders.title")} navOpenKey="nav" search={false}>
      {head}

      {view === "success" ? (
        <Card ref={listRef} aria-label={t("orders.table.aria")} className="flex flex-col overflow-hidden p-0 mobile:p-0">
          {toolbar}

          {selected.size > 0 ? (
            <div role="region" aria-label={t("orders.selection.aria")} className="flex items-center gap-2 border-b bg-primary-soft px-6 py-2 text-role-label text-on-primary-soft mobile:flex-wrap mobile:px-4">
              <span className="mr-2 whitespace-nowrap tabular-nums">{t("orders.selection.count", { n: selected.size })}</span>
              <Button disabled={!anyShippable} onClick={bulkShip}>
                <PackageCheckIcon className="size-icon-sm" />
                {t("orders.selection.ship")}
              </Button>
              <Button variant="secondary" onClick={() => exportToast(selected.size)}>
                <DownloadIcon className="size-icon-sm" />
                {t("orders.selection.export")}
              </Button>
              <span aria-hidden className="flex-1" />
              <Button variant="ghost" className="text-on-primary-soft hover:not-disabled:bg-surface" onClick={() => setSelected(new Set())}>
                {t("orders.selection.clear")}
              </Button>
            </div>
          ) : null}

          {/* 表格（≥768） */}
          <div className="relative overflow-x-auto max-md:hidden">
            <Table aria-label={t("orders.table.aria")} className="[&_td]:h-table-row [&_td]:py-0">
              <TableHeader>
                <TableRow className="hover:[&>td]:bg-transparent">
                  <TableHead className="h-table-header w-hit bg-surface-muted py-0 pr-0 first:pl-3 [&>span]:grid [&>span]:size-hit [&>span]:place-items-center">
                    <span>
                    <Checkbox
                      aria-label={someChecked ? t("orders.col.selectSome.tip") : allChecked ? t("orders.col.selectNone") : t("orders.col.selectAll")}
                      checked={allChecked ? true : someChecked ? "indeterminate" : false}
                      onCheckedChange={(v) => toggleAll(v === true)}
                      className={cn(ctl16, "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary [&[data-state=indeterminate]_svg]:hidden [&[data-state=indeterminate]]:after:h-[calc(var(--border-width-accent))] [&[data-state=indeterminate]]:after:w-2 [&[data-state=indeterminate]]:after:rounded-full [&[data-state=indeterminate]]:after:bg-current")}
                    />
                    </span>
                  </TableHead>
                  {sortHead("id", t("orders.col.id"))}
                  <TableHead data-col="customer" className={cn("h-table-header bg-surface-muted py-0", col("customer"))}>{t("orders.col.customer")}</TableHead>
                  <TableHead data-col="items" className={cn("h-table-header bg-surface-muted py-0", col("items"))}>{t("orders.col.items")}</TableHead>
                  <TableHead data-col="channel" className={cn("h-table-header bg-surface-muted py-0", col("channel"))}>{t("orders.col.channel")}</TableHead>
                  <TableHead data-col="status" className="h-table-header bg-surface-muted py-0">{t("orders.col.status")}</TableHead>
                  {sortHead("amount", t("orders.col.amount"), true)}
                  {sortHead("placedAt", t("orders.col.placedAt"))}
                  <TableHead className="h-table-header w-hit bg-surface-muted py-0 text-right last:pr-3">
                    <span className="sr-only">{t("orders.col.actions")}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((o) => {
                  const sel = selected.has(o.id)
                  return (
                    <TableRow
                      key={o.id}
                      tabIndex={0}
                      data-order-row={o.id}
                      aria-selected={sel}
                      aria-label={rowLabel(o)}
                      onClick={() => openDrawer(o.id)}
                      onKeyDown={(e) => {
                        if (e.target !== e.currentTarget) return
                        if (e.key === "Enter") {
                          e.preventDefault()
                          openDrawer(o.id)
                        } else if (e.key === " ") {
                          e.preventDefault()
                          toggle(o.id, !sel)
                        } else if (e.key === "ArrowDown") {
                          e.preventDefault()
                          ;(e.currentTarget.nextElementSibling as HTMLElement | null)?.focus()
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault()
                          ;(e.currentTarget.previousElementSibling as HTMLElement | null)?.focus()
                        }
                      }}
                      className={cn("cursor-pointer focus-visible:outline-(length:--border-width-focus) focus-visible:outline-focus-ring focus-visible:-outline-offset-(--border-width-focus)", sel && "[&>td]:bg-primary-soft hover:[&>td]:bg-primary-soft")}
                    >
                      <TableCell className="w-hit pr-0 first:pl-3" onClick={(e) => e.stopPropagation()}>
                        <span className="grid size-hit place-items-center">
                          <Checkbox className={ctl16} aria-label={t("orders.col.selectRow", { id: o.id })} checked={sel} onCheckedChange={(v) => toggle(o.id, v === true)} />
                        </span>
                      </TableCell>
                      <TableCell data-col="id">
                        <span className="inline-flex items-center gap-2">
                          <OrderId id={o.id} />
                          <FlagTags o={o} />
                        </span>
                      </TableCell>
                      <TableCell data-col="customer" className={col("customer")}>
                        <span className="flex items-center gap-2">
                          <Avatar size="sm" initial={o.customer.initial} hue={o.customer.avatarHue} name={o.customer.name} />
                          <span className="flex min-w-0 flex-col leading-tight">
                            <span className="truncate text-role-label">{o.customer.name}</span>
                            <span className="mt-1 text-role-caption text-fg-muted tabular-nums">{o.customer.phoneMasked}</span>
                          </span>
                        </span>
                      </TableCell>
                      <TableCell data-col="items" className={col("items")}>
                        <div className="max-w-[calc(var(--size-content-max)/5)] truncate tablet:max-w-[calc(var(--size-content-max)/5*0.75)]" title={o.items.map((i) => `${i.name} × ${i.qty}`).join("，")}>
                          <ItemsText o={o} />
                        </div>
                      </TableCell>
                      <TableCell data-col="channel" className={cn("text-fg-muted", col("channel"))}>
                        {channelLabel(o.channel)}
                      </TableCell>
                      <TableCell data-col="status">
                        <StatusTag status={o.status} />
                      </TableCell>
                      <TableCell data-col="amount" className={cn("text-right font-medium tabular-nums", col("amount"))}>
                        {formatCurrency(o.amount)}
                      </TableCell>
                      <TableCell data-col="placedAt" className={cn("text-fg-muted tabular-nums", col("placedAt"))}>
                        {shortTime(o.placedAt)}
                      </TableCell>
                      <TableCell className="w-hit text-right last:pr-3" onClick={(e) => e.stopPropagation()}>
                        <OrderMenu
                          order={o}
                          menuKey={o.id}
                          open={menuId === o.id && !cards}
                          onOpenChange={(on) => set({ open: on ? "order-menu" : null, order: on ? o.id : null })}
                          onAction={(a) => doAction(a, o.id)}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* 卡片（<768） */}
          <ul aria-label={t("orders.table.aria")} className="hidden flex-col max-md:flex">
            {rows.map((o) => {
              const sel = selected.has(o.id)
              return (
                <li
                  key={o.id}
                  data-selected={sel || undefined}
                  className={cn("grid grid-cols-[var(--size-hit)_1fr_var(--size-hit)] items-start border-b px-2 pt-2 pb-3 transition-colors duration-(--motion-fast) ease-std last:border-b-0", sel && "bg-primary-soft")}
                >
                  <span className="grid size-hit place-items-center">
                    <Checkbox className={ctl16} aria-label={t("orders.col.selectRow", { id: o.id })} checked={sel} onCheckedChange={(v) => toggle(o.id, v === true)} />
                  </span>
                  <button
                    type="button"
                    aria-label={`${rowLabel(o)}，${t("orders.mobile.card.view")}`}
                    data-order-row={o.id}
                    onClick={() => openDrawer(o.id)}
                    className="flex min-w-0 flex-col gap-1 rounded-md px-2 pt-2 text-left transition-colors duration-(--motion-fast) ease-std hover:bg-bg"
                  >
                    <span className="flex min-h-6 flex-wrap items-center gap-2">
                      <OrderId id={o.id} className="flex-none" />
                      <FlagTags o={o} />
                      <StatusTag status={o.status} className="ml-auto" />
                    </span>
                    <span className="flex min-w-0 items-center gap-2 text-fg-muted">
                      <span className="min-w-0 truncate text-role-label text-fg">{o.customer.name}</span>
                      <span className="flex-none text-role-caption tabular-nums">{o.customer.phoneMasked}</span>
                    </span>
                    <span className="min-w-0 truncate">
                      <ItemsText o={o} />
                    </span>
                    <span className="flex items-baseline gap-2">
                      <span className="text-role-title tabular-nums">{formatCurrency(o.amount)}</span>
                      <span className="ml-auto text-right text-role-caption text-fg-muted whitespace-nowrap tabular-nums">
                        {channelLabel(o.channel)} · {shortTime(o.placedAt)}
                      </span>
                    </span>
                  </button>
                  <OrderMenu
                    order={o}
                    menuKey={o.id}
                    className="mt-1"
                    open={menuId === o.id && cards}
                    onOpenChange={(on) => set({ open: on ? "order-menu" : null, order: on ? o.id : null })}
                    onAction={(a) => doAction(a, o.id)}
                  />
                </li>
              )
            })}
          </ul>

          {/* 分页 */}
          <nav aria-label={t("orders.pagination.aria")} className="flex flex-wrap items-center gap-3 border-t px-6 py-3 mobile:px-4">
            <span className="text-fg-muted whitespace-nowrap tabular-nums">{rangeText}</span>
            <span className="inline-flex items-center gap-2 text-fg-muted whitespace-nowrap mobile:hidden">
              {t("orders.pagination.pageSize", { n: "{{n}}" }).split("{{n}}")[0]}
              <Select
                aria-label={t("orders.pagination.pageSize", { n: "" }).trim()}
                value={String(size)}
                onChange={(e) => set({ size: e.target.value === String(SUM.pagination.defaultPageSize) ? null : e.target.value, page: null })}
                wrapClassName="w-[calc(var(--size-hit)*2+var(--space-2))]"
                className="border-border pr-8 pl-2 tabular-nums"
              >
                {SUM.pagination.pageSizes.map((n) => (
                  <option key={n} value={n}>
                    {t("orders.pagination.pageSize", { n }).replace(/^.*?(?=\d)/, "")}
                  </option>
                ))}
              </Select>
            </span>
            <Pagination
              page={page}
              pageCount={totalPages}
              onPageChange={goPage}
              labels={{
                prev: t("orders.pagination.prev"),
                next: t("orders.pagination.next"),
                page: (n) => (n === page ? t("orders.pagination.current", { n }) : n > reach ? `${t("orders.pagination.page", { n })}，${t("orders.pagination.sampleOnly", { n: reach })}` : t("orders.pagination.page", { n })),
              }}
              isPageDisabled={(n) => n > reach}
              pages={pagerPages(reach, totalPages)}
              className="ml-auto w-auto gap-1 mobile:[&>button[data-page]]:hidden mobile:[&>[data-slot=pagination-ellipsis]]:hidden"
            />
          </nav>
        </Card>
      ) : null}

      {view === "loading" ? <LoadingView /> : null}

      {view === "empty-filtered" ? (
        <Card aria-label={t("orders.table.aria.filtered")} className="flex flex-col overflow-hidden p-0 mobile:p-0">
          {toolbar}
          <div role="status" className="flex flex-col items-center gap-2 px-6 py-16 text-center mobile:px-4 mobile:py-12">
            <FilteredFigure />
            <h2 className="text-role-heading">{t("orders.empty.filtered.title")}</h2>
            <p className="max-w-form-max text-fg-muted">{t("orders.empty.filtered.description")}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3 mobile:w-full mobile:flex-col">
              <Button
                variant="secondary"
                onClick={() => {
                  applyFilters(defaultFilters)
                  searchRef.current?.focus()
                }}
              >
                {t("orders.empty.filtered.action")}
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      {view === "empty-new" ? (
        <StateCard
          kind="empty"
          title={t("orders.empty.new.title")}
          body={t("orders.empty.new.description")}
          className="mobile:px-4 mobile:py-20 mobile:[&>div]:w-full mobile:[&>div]:flex-col mobile:[&>div]:items-stretch"
          figure={<NewFigure />}
          actions={
            <NotYetLink href="/settings/channels" className="mobile:w-full">
              <PlugIcon className="size-icon-sm" />
              {t("orders.empty.new.action")}
            </NotYetLink>
          }
        />
      ) : null}

      {view === "error" ? (
        <Card aria-label={t("orders.table.aria.error")} className="flex flex-col overflow-hidden p-0 mobile:p-0">
          {toolbar}
          <div role="alert" className="flex flex-col items-center gap-2 px-6 py-16 text-center mobile:px-4 mobile:py-12">
            <span aria-hidden className="mb-4 grid size-control-lg place-items-center rounded-full bg-danger-soft text-danger">
              <WifiOffIcon className="size-icon-lg" />
            </span>
            <h2 className="text-role-heading">{t("orders.error.title")}</h2>
            <p className="max-w-form-max text-fg-muted">{t("orders.error.description")}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3 mobile:w-full mobile:flex-col">
              <Button onClick={retry}>
                <RefreshCwIcon className="size-icon-sm" />
                {t("orders.error.retry")}
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      {/* 详情 Drawer */}
      <Drawer open={!!drawerOrder} onOpenChange={(o) => (o ? undefined : closeOverlay())}>
        {drawerOrder ? (
          <DrawerContent
            aria-label={t("orders.drawer.aria")}
            closeLabel={t("orders.drawer.close")}
            title={t("orders.drawer.title", { id: "" }).trim()}
            headerExtra={
              <>
                <OrderId id={drawerOrder.id} className="text-md" />
                <span className="inline-flex flex-wrap items-center gap-2">
                  <StatusTag status={drawerOrder.status} />
                  <FlagTags o={drawerOrder} />
                </span>
              </>
            }
            onOpenAutoFocus={(e) => {
              e.preventDefault()
              ;(e.target as HTMLElement | null)?.focus({ preventScroll: true })
            }}
            onCloseAutoFocus={returnFocusToRow}
            className="bg-surface-raised [&>header>h2]:flex-none [&>header>button]:ml-auto [&>header]:gap-2 mobile:inset-y-auto mobile:top-auto mobile:bottom-0 mobile:max-h-[88vh] mobile:rounded-t-xl mobile:border-l-0 [&>header]:h-auto [&>header]:min-h-topbar [&>header]:flex-wrap [&>header]:py-3 [&>header]:pl-6 mobile:[&>header]:min-h-hit mobile:[&>header]:py-2 mobile:[&>header]:pr-3 mobile:[&>header]:pl-4"
          >
            <span aria-hidden className="hidden mobile:-order-1 mobile:mx-auto mobile:mt-2 mobile:block mobile:h-1 mobile:w-10 mobile:rounded-full mobile:bg-border-strong" />
            <DrawerBody className="gap-5 px-6 pb-6 mobile:px-4">
              <DescriptionList className="gap-y-3 mobile:gap-x-4 [&>dd]:min-h-0">
                <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.field.status")}</DescriptionTerm>
                <DescriptionDetails>{orderStatus[drawerOrder.status]?.label ?? drawerOrder.status}</DescriptionDetails>
                <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.field.channel")}</DescriptionTerm>
                <DescriptionDetails>{channelLabel(drawerOrder.channel)}</DescriptionDetails>
                <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.field.customer")}</DescriptionTerm>
                <DescriptionDetails>{drawerOrder.customer.name}</DescriptionDetails>
                <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.field.phone")}</DescriptionTerm>
                <DescriptionDetails className="tabular-nums">{drawerOrder.customer.phoneMasked}</DescriptionDetails>
                {drawerOrder.store ? (
                  <>
                    <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.field.store")}</DescriptionTerm>
                    <DescriptionDetails>{drawerOrder.store}</DescriptionDetails>
                  </>
                ) : (
                  <>
                    <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.field.address")}</DescriptionTerm>
                    <DescriptionDetails>{drawerOrder.address || "—"}</DescriptionDetails>
                  </>
                )}
                {drawerOrder.warehouse ? (
                  <>
                    <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.field.warehouse")}</DescriptionTerm>
                    <DescriptionDetails>{drawerOrder.warehouse}</DescriptionDetails>
                  </>
                ) : null}
                <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.field.placedAt")}</DescriptionTerm>
                <DescriptionDetails className="tabular-nums">{fullTime(drawerOrder.placedAt)}</DescriptionDetails>
                {drawerOrder.status === "pending_payment" && drawerOrder.expiresAt ? (
                  <>
                    <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.field.expiresAt")}</DescriptionTerm>
                    <DescriptionDetails className="tabular-nums">{fullTime(drawerOrder.expiresAt)}</DescriptionDetails>
                  </>
                ) : drawerOrder.paidAt ? (
                  <>
                    <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.field.paidAt")}</DescriptionTerm>
                    <DescriptionDetails className="tabular-nums">{fullTime(drawerOrder.paidAt)}</DescriptionDetails>
                  </>
                ) : null}
                {drawerOrder.shippedAt ? (
                  <>
                    <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.field.shippedAt")}</DescriptionTerm>
                    <DescriptionDetails className="tabular-nums">{fullTime(drawerOrder.shippedAt)}</DescriptionDetails>
                  </>
                ) : null}
                {drawerOrder.completedAt ? (
                  <>
                    <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.field.completedAt")}</DescriptionTerm>
                    <DescriptionDetails className="tabular-nums">{fullTime(drawerOrder.completedAt)}</DescriptionDetails>
                  </>
                ) : null}
                {drawerOrder.cancelledAt ? (
                  <>
                    <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.field.cancelledAt")}</DescriptionTerm>
                    <DescriptionDetails className="tabular-nums">{fullTime(drawerOrder.cancelledAt)}</DescriptionDetails>
                  </>
                ) : null}
                <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.field.amount")}</DescriptionTerm>
                <DescriptionDetails className="text-role-title tabular-nums">{formatCurrency(drawerOrder.amount)}</DescriptionDetails>
              </DescriptionList>

              <Tabs value={tab} onValueChange={(v) => set({ tab: v === "items" ? null : v })} className="gap-5">
                <TabsList aria-label={t("orders.drawer.tabs.aria")} className="w-full gap-1 rounded-none border-b bg-transparent p-0">
                  {(["items", "logistics", "remarks"] as const).map((k) => (
                    <TabsTrigger
                      key={k}
                      value={k}
                      className="relative min-w-0 rounded-t-sm rounded-b-none px-3 hover:bg-surface-muted data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-[calc(var(--border-width-accent))] data-[state=active]:after:rounded-full data-[state=active]:after:bg-primary"
                    >
                      {k === "remarks" && drawerOrder.remarks.length ? t("orders.drawer.remarks.count", { n: drawerOrder.remarks.length }) : t(`orders.drawer.tab.${k}`)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="items" tabIndex={-1} className="flex flex-col gap-3">
                  <ul className="flex flex-col">
                    {drawerOrder.items.map((i) => (
                      <li key={i.sku} className="flex items-start justify-between gap-4 border-b py-3">
                        <span className="flex min-w-0 flex-col gap-1">
                          <span>{i.name}</span>
                          <span className="text-role-caption text-fg-muted tabular-nums">
                            <span className="font-mono text-xs">{i.sku}</span> · {formatCurrency(i.unitPrice)} × {i.qty}
                          </span>
                        </span>
                        <span className="whitespace-nowrap tabular-nums">{formatCurrency(i.qty * i.unitPrice)}</span>
                      </li>
                    ))}
                    {drawerOrder.items.length > 1 ? (
                      <li className="flex items-start justify-between gap-4 border-b py-3">
                        <span>{t("orders.drawer.items.subtotal")}</span>
                        <span className="whitespace-nowrap tabular-nums">{formatCurrency(drawerOrder.items.reduce((a, i) => a + i.qty * i.unitPrice, 0))}</span>
                      </li>
                    ) : null}
                    <li className="flex items-start justify-between gap-4 pt-3">
                      <span className="text-role-label">{t("orders.drawer.items.total")}</span>
                      <span className="text-role-title whitespace-nowrap tabular-nums">{formatCurrency(drawerOrder.amount)}</span>
                    </li>
                  </ul>
                </TabsContent>

                <TabsContent value="logistics" tabIndex={-1} className="flex flex-col gap-3">
                  {drawerOrder.status === "refunding" && drawerOrder.refundReason ? (
                    <div className="flex items-start gap-2 rounded-md bg-danger-soft p-3 text-role-label text-danger">
                      <RotateCcwIcon aria-hidden className="mt-1 size-icon-sm shrink-0" />
                      <span>{t("orders.drawer.logistics.refund", { reason: drawerOrder.refundReason })}</span>
                    </div>
                  ) : null}
                  {drawerOrder.status === "cancelled" && drawerOrder.cancelReason ? (
                    <div className="flex items-start gap-2 rounded-md bg-neutral-soft p-3 text-role-label text-on-neutral-soft">
                      <BanIcon aria-hidden className="mt-1 size-icon-sm shrink-0" />
                      <span>{t("orders.drawer.logistics.cancel", { reason: drawerOrder.cancelReason })}</span>
                    </div>
                  ) : null}
                  {drawerOrder.carrier && drawerOrder.trackingNo ? (
                    <>
                      <DescriptionList className="gap-y-3 mobile:gap-x-4 [&>dd]:min-h-0">
                        <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.logistics.carrier")}</DescriptionTerm>
                        <DescriptionDetails>{drawerOrder.carrier}</DescriptionDetails>
                        <DescriptionTerm className="pt-0 text-role-body">{t("orders.drawer.logistics.tracking")}</DescriptionTerm>
                        <DescriptionDetails>
                          <span className="flex min-w-0 items-center gap-1">
                            <span className="font-mono text-sm tabular-nums">{drawerOrder.trackingNo}</span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <IconButton label={t("orders.drawer.logistics.copy")} onClick={() => copyText(drawerOrder.trackingNo!)}>
                                  <CopyIcon className="size-icon-sm" />
                                </IconButton>
                              </TooltipTrigger>
                              <TooltipContent>{t("orders.drawer.logistics.copy")}</TooltipContent>
                            </Tooltip>
                          </span>
                        </DescriptionDetails>
                      </DescriptionList>
                      {drawerOrder.logistics?.length ? (
                        <ul className="flex flex-col">
                          {[...drawerOrder.logistics].reverse().map((ev, i, arr) => (
                            <li key={ev.at} className="relative grid grid-cols-[var(--space-4)_1fr] gap-2 pb-4 last:pb-0">
                              <span aria-hidden className={cn("mx-auto mt-2 size-dot rounded-full", i === 0 ? "bg-primary" : "bg-border-strong")} />
                              {i < arr.length - 1 ? <span aria-hidden className="absolute top-[calc(var(--space-2)+var(--size-dot))] bottom-0 left-[calc(var(--space-2)-var(--border-width-hairline)/2)] border-l" /> : null}
                              <span>
                                {ev.text}
                                <span className="mt-1 block text-role-caption text-fg-muted tabular-nums">{shortTime(ev.at)}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </>
                  ) : (
                    <div className="rounded-md bg-surface-muted px-4 py-8 text-center text-fg-muted">
                      {drawerOrder.status === "shipped" || drawerOrder.status === "completed" ? t("orders.drawer.logistics.syncing") : t("orders.drawer.logistics.empty")}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="remarks" tabIndex={-1} className="flex flex-col gap-3">
                  {drawerOrder.remarks.length ? (
                    <div className="grid gap-3">
                      {drawerOrder.remarks.map((r) => (
                        <div key={r.at + r.by} className="flex flex-col gap-2 rounded-md bg-surface-muted p-3">
                          <div className="flex items-center gap-2">
                            <b className="text-role-label">{r.byName}</b>
                            <span className="ml-auto text-role-caption text-fg-muted tabular-nums">{shortTime(r.at)}</span>
                          </div>
                          <div>{r.text}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md bg-surface-muted px-4 py-8 text-center text-fg-muted">{t("orders.drawer.remarks.empty")}</div>
                  )}
                  <form
                    className="flex flex-col gap-2"
                    onSubmit={(e) => {
                      e.preventDefault()
                      const text = remark.trim()
                      if (!text) return
                      update(drawerOrder.id, { remarks: [...drawerOrder.remarks, { by: mock.user.id, byName: mock.user.name, at: asOf, text }] })
                      setRemark("")
                      toast.success(t("orders.toast.remarkAdded"), { duration: stay() })
                    }}
                  >
                    <Label htmlFor="remark-input" className="sr-only">
                      {t("orders.drawer.remarks.submit")}
                    </Label>
                    <Textarea id="remark-input" value={remark} onChange={(e) => setRemark(e.target.value)} placeholder={t("orders.drawer.remarks.placeholder")} maxLength={200} rows={3} className="min-h-[calc(var(--size-control-md)*2)]" />
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-role-caption text-fg-muted tabular-nums">{t("orders.drawer.remarks.counter", { max: 200, n: remark.length })}</span>
                      <Button type="submit" variant="secondary" className={disabledGhost} disabled={!remark.trim()}>
                        {t("orders.drawer.remarks.submit")}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </DrawerBody>
            {drawerFootVisible ? (
              <DrawerFooter className="justify-start bg-surface-raised px-6 py-4 mobile:px-4 mobile:pt-3 mobile:pb-4 mobile:[&>button]:flex-1">
                {canShip(drawerOrder) ? (
                  <>
                    <Button onClick={() => doAction("ship", drawerOrder.id)}>
                      <PackageCheckIcon className="size-icon-sm" />
                      {t("orders.drawer.action.ship")}
                    </Button>
                    <Button variant="secondary" onClick={() => doAction(drawerOrder.urgent ? "unurgent" : "urgent", drawerOrder.id)}>
                      {drawerOrder.urgent ? <ZapOffIcon className="size-icon-sm" /> : <ZapIcon className="size-icon-sm" />}
                      {drawerOrder.urgent ? t("orders.drawer.action.unurgent") : t("orders.drawer.action.urgent")}
                    </Button>
                  </>
                ) : null}
                <span aria-hidden className="flex-1 mobile:hidden" />
                {canCancel(drawerOrder) ? (
                  <Button variant="secondary" className="text-danger hover:not-disabled:border-danger hover:not-disabled:bg-danger-soft" onClick={() => openDialog("cancel", drawerOrder.id)}>
                    {t("orders.drawer.action.cancel")}
                  </Button>
                ) : null}
                {canDelete(drawerOrder) ? (
                  <Button variant="secondary" className="text-danger hover:not-disabled:border-danger hover:not-disabled:bg-danger-soft" onClick={() => openDialog("delete", drawerOrder.id)}>
                    {t("orders.drawer.action.delete")}
                  </Button>
                ) : null}
              </DrawerFooter>
            ) : null}
          </DrawerContent>
        ) : null}
      </Drawer>

      {/* 取消订单 */}
      <AlertDialog open={dialogKind === "cancel" && !!dialogOrder} onOpenChange={(o) => (o ? undefined : closeOverlay())}>
        {dialogKind === "cancel" && dialogOrder ? (
          <AlertDialogContent
            className={dialogMobile}
            onOpenAutoFocus={(e) => {
              e.preventDefault()
              reasonRef.current?.focus()
            }}
            onCloseAutoFocus={returnFocusToRow}
          >
            <span aria-hidden className="grid size-control-lg place-items-center rounded-full bg-danger-soft text-danger">
              <BanIcon className="size-icon-lg" />
            </span>
            <AlertDialogHeader className="gap-4">
              <AlertDialogTitle>
                {t("orders.dialog.cancel.title", { id: "{{id}}" })
                  .split("{{id}}")
                  .map((part, i) => (
                    <React.Fragment key={i}>
                      {i > 0 ? <OrderId id={dialogOrder.id} className="text-lg" /> : null}
                      {part}
                    </React.Fragment>
                  ))}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {dialogOrder.status === "pending_payment" ? t("orders.dialog.cancel.description.unpaid") : t("orders.dialog.cancel.description", { amount: formatCurrency(dialogOrder.amount).replace(/^¥/, "") })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cancel-reason">{t("orders.dialog.cancel.reason")}</Label>
              <Select
                id="cancel-reason"
                ref={reasonRef}
                required
                invalid={reasonInvalid}
                placeholder={t("orders.dialog.cancel.reason.placeholder")}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value)
                  setReasonInvalid(false)
                }}
              >
                {(["buyer", "stockout", "duplicate", "other"] as const).map((k) => (
                  <option key={k} value={k}>
                    {t(`orders.dialog.cancel.reason.${k}`)}
                  </option>
                ))}
              </Select>
            </div>
            <AlertDialogFooter className={dialogFootMobile}>
              <AlertDialogCancel>{t("orders.dialog.cancel.back")}</AlertDialogCancel>
              <Button variant="danger" onClick={confirmCancel}>
                {t("orders.dialog.cancel.confirm")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        ) : null}
      </AlertDialog>

      {/* 删除订单 */}
      <AlertDialog open={dialogKind === "delete" && !!dialogOrder} onOpenChange={(o) => (o ? undefined : closeOverlay())}>
        {dialogKind === "delete" && dialogOrder ? (
          <AlertDialogContent className={dialogMobile} onCloseAutoFocus={returnFocusToRow}>
            <span aria-hidden className="grid size-control-lg place-items-center rounded-full bg-danger-soft text-danger">
              <Trash2Icon className="size-icon-lg" />
            </span>
            <AlertDialogHeader className="gap-4">
              <AlertDialogTitle>
                {t("orders.dialog.delete.title", { id: "{{id}}" })
                  .split("{{id}}")
                  .map((part, i) => (
                    <React.Fragment key={i}>
                      {i > 0 ? <OrderId id={dialogOrder.id} className="text-lg" /> : null}
                      {part}
                    </React.Fragment>
                  ))}
              </AlertDialogTitle>
              <AlertDialogDescription>{t("orders.dialog.delete.description")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className={dialogFootMobile}>
              <AlertDialogCancel>{t("orders.dialog.delete.back")}</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>{t("orders.dialog.delete.confirm")}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        ) : null}
      </AlertDialog>

      {/* ≤768 筛选 Sheet */}
      <FilterSheet open={open === "filter-sheet"} onClose={() => set({ open: null })} filters={filters} orders={orders} onApply={applyFilters} />
    </AppShell>
  )
}

/* ---------- 筛选 Sheet（草稿态 + 预览计数） ---------- */

function FilterSheet({ open, onClose, filters, orders, onApply }: { open: boolean; onClose: () => void; filters: Filters; orders: OrderRow[]; onApply: (f: Filters) => void }) {
  const [draft, setDraft] = React.useState(filters)
  React.useEffect(() => {
    if (open) setDraft(filters)
  }, [open, filters])
  const preview = countOf(orders, draft)
  const group = "grid grid-cols-2 gap-x-2 gap-y-0"
  /** ref 里 .sheet-group .lbl 同时命中 .check-row .lbl：选项文案为 label 字体 + fg-muted + 左右 space-2 */
  const lbl = (s: React.ReactNode) => <span className="px-2 text-role-label text-fg-muted">{s}</span>
  return (
    <Sheet open={open} onOpenChange={(o) => (o ? undefined : onClose())}>
      <SheetContent
        side="bottom"
        title={t("orders.mobile.filter.title")}
        closeLabel={t("orders.mobile.filter.close")}
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          ;(e.target as HTMLElement | null)?.focus({ preventScroll: true })
        }}
        className="bg-surface-raised [&>button]:top-2 [&>button]:right-3"
      >
        <div className="flex min-h-hit shrink-0 items-center gap-2 border-b py-2 pr-hit pl-6">
          <h2 aria-hidden className="flex min-h-hit flex-1 items-center text-role-title">
            {t("orders.mobile.filter.title")}
          </h2>
        </div>
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pt-4 pb-6">
          <div className="flex flex-col gap-2">
            <span id="sheet-status" className="px-2 text-role-label text-fg-muted">
              {t("orders.filter.status")}
            </span>
            <RadioGroup aria-labelledby="sheet-status" value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v })} className={group}>
              <CheckRow id="sst-all" label={lbl(t("orders.filter.status.all"))}>
                <RadioGroupItem id="sst-all" value="all" className={rdo16} />
              </CheckRow>
              {STATUS_KEYS.map((k) => (
                <CheckRow key={k} id={`sst-${k}`} label={lbl(orderStatus[k]?.label ?? k)} count={formatInteger(SUM.byStatus[k])}>
                  <RadioGroupItem id={`sst-${k}`} value={k} className={rdo16} />
                </CheckRow>
              ))}
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2">
            <span id="sheet-date" className="px-2 text-role-label text-fg-muted">
              {t("orders.filter.dateRange")}
            </span>
            <RadioGroup aria-labelledby="sheet-date" value={draft.date} onValueChange={(v) => setDraft({ ...draft, date: v as DateKey })} className={group}>
              {DATE_KEYS.map((k) => (
                <CheckRow key={k} id={`sdt-${k}`} label={lbl(t(`orders.filter.dateRange.preset.${k}`))} count={formatInteger(SUM.byRange[k])}>
                  <RadioGroupItem id={`sdt-${k}`} value={k} className={rdo16} />
                </CheckRow>
              ))}
              <Button variant="ghost" className="col-span-full justify-start" onClick={() => toast.info(t("orders.toast.dateCustom"), { duration: tokenMs("--timing-toast-stay") })}>
                <CalendarIcon className="size-icon-sm" />
                {t("orders.filter.dateRange.placeholder")}
              </Button>
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2">
            <span id="sheet-channel" className="px-2 text-role-label text-fg-muted">
              {t("orders.filter.channel")}
            </span>
            <div role="group" aria-labelledby="sheet-channel" className={group}>
              {mock.meta.channels.map((c) => (
                <CheckRow key={c.key} id={`schan-${c.key}`} label={lbl(c.label)} count={formatInteger(SUM.byChannel[c.key as keyof typeof SUM.byChannel])}>
                  <Checkbox
                    id={`schan-${c.key}`}
                    className={ctl16}
                    checked={draft.channels.includes(c.key)}
                    onCheckedChange={(on) => setDraft({ ...draft, channels: on ? [...draft.channels, c.key] : draft.channels.filter((k) => k !== c.key) })}
                  />
                </CheckRow>
              ))}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 gap-3 border-t px-4 pt-3 pb-4">
          <Button
            variant="secondary"
            onClick={() => {
              onApply(defaultFilters)
              onClose()
            }}
          >
            {t("orders.filter.clear")}
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onApply({ ...draft, search: filters.search })
              onClose()
            }}
          >
            {t("orders.mobile.filter.apply", { n: formatInteger(preview) })}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
