import * as React from "react"
import {
  BellIcon,
  BoxIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  DownloadIcon,
  InfoIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  MoreHorizontalIcon,
  PackageIcon,
  ReceiptTextIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  Trash2Icon,
  TruckIcon,
  UserIcon,
  WarehouseIcon,
  XIcon,
  ZapIcon,
} from "lucide-react"

import { Avatar } from "@/components/composed/avatar"
import { BrandMark } from "@/components/composed/brand"
import { DonutChart, TrendChart } from "@/components/composed/charts"
import { NavGroupLabel, NavItem } from "@/components/composed/nav-item"
import { NotificationItem } from "@/components/composed/notification-item"
import { StatCard, StatCardSkeleton, Delta } from "@/components/composed/stat-card"
import { StateCard } from "@/components/composed/state-card"
import { TaskItem, type TaskStatus } from "@/components/composed/task-item"
import { Timeline, TimelineItem, TimelineSkeleton } from "@/components/composed/timeline"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CountBadge, Tag, type Tone } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox, CheckboxField } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuHeader, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { IconButton } from "@/components/ui/icon-button"
import { Input, InputControl } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { PasswordInput } from "@/components/ui/password-input"
import { Popover, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Separator, TextDivider } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { orderStatus, t } from "@/data/content"
import { channelLabel, mock, navBadge, navBadgeLabel, navBadgeTone, periods, seriesFor, statFor, type NavItem as NavItemDef } from "@/data/mock"
import { currencySymbol, formatAmount, formatCurrency, formatDateTime, formatFullDateTime, formatInteger, formatMonthDay, formatPercent, formatTime } from "@/lib/format"

import { Dash, demo, DemoBox, GRID_2, GRID_3, K, Matrix, MatrixWrap, Row, Stage, StageCol, STATES, TABLE_TOTAL, type MatrixRow, type OverlayProps, type State } from "./kit"
import { ListExtras, TableExtras } from "./round2"

/**
 * /components 各卡片的演示体（自 /kitchen-sink 迁入，文案前缀改为 components.*）。
 * 状态列固定为 default / hover / focus / disabled / loading / error（不适用的列标 —）。
 * hover / focus 通过 data-demo 属性驱动（见 theme.css @custom-variant），截图脚本无需真正移动鼠标。
 */
export { Dash, type OverlayProps } from "./kit"

/** 单变体 × 状态列（旧演示体兼容）：一行矩阵 */
function StateMatrix({ label, states = STATES, wide, render }: { label: string; states?: readonly State[]; wide?: boolean; render: (state: State) => React.ReactNode }) {
  return <Matrix caption={label} cols={states} wide={wide} rows={[{ label, render }]} />
}

const period = "month"
const user = mock.user
const series = seriesFor(period)
const gmv = statFor(period, "gmv")
const total = series.channels.total
const donut = series.channels.items.map((c) => ({ key: c.key, label: channelLabel(c.key), value: c.gmv, share: c.share }))

const BTN_STATES = ["default", "hover", "focus", "disabled", "loading"] as const
const BTN_VARIANTS = ["primary", "secondary", "ghost", "danger", "link"] as const
const BTN_SIZES = ["sm", "md", "lg"] as const
const SIZE_COLS = ["primary", "secondary", "withIcon", "block"] as const
const ICON_COLS = ["default", "hover", "focus", "disabled", "expanded", "badge"] as const

export function ButtonDemo() {
  const sizeLabel = (size: (typeof BTN_SIZES)[number], col: (typeof SIZE_COLS)[number]) =>
    size === "lg" ? (col === "primary" || col === "block" ? mock.landing.hero.primary : col === "secondary" ? mock.landing.hero.secondary : K("sample.button.export")) : col === "secondary" ? K("sample.button.secondary") : col === "withIcon" ? K("sample.button.export") : K("sample.button.primary")
  return (
    <>
      <Matrix
        caption={K("caption.button.matrix")}
        cols={BTN_STATES}
        rows={BTN_VARIANTS.map((variant) => ({
          label: variant,
          mono: `variant="${variant}"`,
          render: (s: (typeof BTN_STATES)[number]) =>
            s === "loading" && (variant === "ghost" || variant === "link") ? (
              <Dash />
            ) : (
              <Button variant={variant} data-demo={demo(s)} disabled={s === "disabled"} loading={s === "loading"}>
                {s === "loading" && variant !== "danger" ? K("sample.button.loading") : K(`sample.button.${variant}`)}
              </Button>
            ),
        }))}
      />
      <Matrix
        caption={K("caption.button.size")}
        head={K("matrix.size")}
        cols={SIZE_COLS}
        colLabel={(c) => (c === "withIcon" || c === "block" ? K(`matrix.${c}`) : c)}
        wide={(c) => c === "block"}
        rows={BTN_SIZES.map((size) => ({
          label: size,
          mono: `size="${size}" · control.${size}`,
          render: (c: (typeof SIZE_COLS)[number]) => (
            <Button size={size} variant={c === "secondary" || c === "withIcon" ? "secondary" : "primary"} block={c === "block"}>
              {c === "withIcon" ? <DownloadIcon /> : null}
              {sizeLabel(size, c)}
            </Button>
          ),
        }))}
      />
    </>
  )
}

export function IconButtonDemo() {
  return (
    <>
      <Matrix
        caption={K("caption.iconButton.matrix")}
        head={K("matrix.shape")}
        cols={ICON_COLS}
        colLabel={(c) => (c === "expanded" || c === "badge" ? K(`matrix.${c}`) : K(`state.${c}`))}
        rows={(["square", "round"] as const).map((shape) => ({
          label: shape,
          mono: `shape="${shape}"`,
          render: (c: (typeof ICON_COLS)[number]) =>
            c === "badge" ? (
              shape === "square" ? (
                <IconButton label={K("sample.icon.notifications")} count={mock.notifications.unreadCount}>
                  <BellIcon />
                </IconButton>
              ) : (
                <IconButton label={t("shell.account.aria")} shape="round">
                  <Avatar initial={user.initial} hue={user.avatarHue} name={user.name} />
                </IconButton>
              )
            ) : (
              <IconButton label={shape === "square" ? K("sample.icon.more") : K("sample.icon.notifications")} shape={shape} data-demo={demo(c === "expanded" ? "default" : c)} disabled={c === "disabled"} aria-expanded={c === "expanded" || undefined}>
                {shape === "square" ? <MoreHorizontalIcon /> : <BellIcon />}
              </IconButton>
            ),
        }))}
      />
    </>
  )
}

const INPUT_STATES = ["default", "hover", "focus", "error", "disabled", "readonly"] as const
type InputState = (typeof INPUT_STATES)[number]
const INPUT_SIZES = ["sm", "md", "lg"] as const
const INPUT_SIZE_COLS = ["Input", "SearchInput"] as const
const inputDemo = (s: InputState) => (s === "hover" || s === "focus" ? s : undefined)
const draftItem = mock.purchaseForm.draft.items[0]
const draftSubtotal = mock.purchaseForm.draft.items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0)
const searchOrderId = mock.ordersAll[0].id

/** hifi「类型 × 状态（size = md）」+「尺寸」两张矩阵；不适用的格标 —；只读 = readOnly、禁用 = disabled，无假加载 */
function InputMatrix() {
  const stateProps = (s: InputState) => ({ "data-demo": inputDemo(s), disabled: s === "disabled", readOnly: s === "readonly", "aria-invalid": s === "error" || undefined })
  const rows: MatrixRow<InputState>[] = [
    {
      label: "Input",
      mono: 'type="text"',
      render: (s) =>
        s === "readonly" ? (
          <Input aria-label={K("sample.workspaceId")} defaultValue={mock.settings.team.workspaceId} {...stateProps(s)} />
        ) : (
          <Input
            aria-label={K("sample.input.label")}
            placeholder={K("sample.input.placeholder")}
            defaultValue={s === "focus" || s === "disabled" ? K("sample.input.value") : undefined}
            aria-describedby={s === "error" ? "input-matrix-err" : undefined}
            {...stateProps(s)}
          />
        ),
    },
    {
      label: "PasswordInput",
      mono: 'type="password"',
      render: (s) =>
        s === "readonly" ? (
          <Dash />
        ) : (
          <PasswordInput aria-label={t("login.password.label")} defaultValue={user.demoCredentials.passwordRule} showLabel={t("login.password.show")} hideLabel={t("login.password.hide")} {...stateProps(s)} />
        ),
    },
    {
      label: "SearchInput",
      mono: 'type="search"',
      render: (s) =>
        s === "error" || s === "readonly" ? (
          <Dash />
        ) : (
          <InputControl leading={<SearchIcon />} trailing={s === "focus" ? <IconButton label={t("orders.selection.clear")}><XIcon /></IconButton> : undefined}>
            <Input type="search" aria-label={t("orders.search.aria")} placeholder={s === "focus" ? undefined : t("orders.search.placeholder")} defaultValue={s === "focus" ? searchOrderId : undefined} {...stateProps(s)} />
          </InputControl>
        ),
    },
    {
      label: "NumberInput",
      mono: 'inputMode="numeric"',
      render: (s) =>
        s === "readonly" ? (
          <Dash />
        ) : (
          <NumberInput value={s === "error" ? 0 : draftItem.qty} onChange={() => {}} min={1} max={999} decrementLabel={K("sample.number.dec")} incrementLabel={K("sample.number.inc")} aria-label={t("form.items.col.qty")} data-demo={inputDemo(s)} disabled={s === "disabled"} aria-invalid={s === "error" || undefined} />
        ),
    },
    {
      label: K("matrix.withPrefix"),
      mono: `prefix="${currencySymbol}"`,
      render: (s) => (
        <InputControl affix={currencySymbol}>
          <Input inputMode="decimal" aria-label={s === "readonly" ? t("form.items.col.subtotal") : t("form.items.col.unitPrice")} defaultValue={formatAmount(s === "readonly" ? draftSubtotal : s === "error" ? 0 : draftItem.unitPrice)} className="tabular-nums" {...stateProps(s)} />
        </InputControl>
      ),
    },
    {
      label: "Textarea",
      mono: "rows={3}",
      render: (s) =>
        s === "readonly" ? (
          <Dash />
        ) : (
          <Textarea aria-label={t("form.note.label")} placeholder={t("form.note.placeholder")} defaultValue={s === "default" || s === "hover" ? undefined : mock.purchaseForm.draft.note} rows={3} {...stateProps(s)} />
        ),
    },
  ]
  return (
    <>
      <Matrix caption={K("caption.input.matrix")} head={K("matrix.type")} cols={INPUT_STATES} wide rows={rows} />
      <span id="input-matrix-err" className="sr-only">
        {K("sample.input.error")}
      </span>
      <Matrix
        caption={K("matrix.size")}
        head={K("matrix.size")}
        cols={INPUT_SIZE_COLS}
        colLabel={(c) => c}
        wide
        rows={INPUT_SIZES.map((size) => ({
          label: size,
          mono: `control.${size}`,
          render: (c: (typeof INPUT_SIZE_COLS)[number]) =>
            c === "Input" ? (
              <InputControl hit={size === "sm"}>
                <Input size={size} aria-label={K("sample.input.label")} defaultValue={K("sample.input.value")} />
              </InputControl>
            ) : (
              <InputControl hit={size === "sm"} leading={<SearchIcon />}>
                <Input size={size} type="search" aria-label={t("orders.search.aria")} placeholder={t("orders.search.placeholder")} />
              </InputControl>
            ),
        }))}
      />
    </>
  )
}

export function InputDemo({ part }: { part: "input" | "field" | "divider" }) {
  return (
    <>
        {part === "input" && <InputMatrix />}
        {part === "field" && (
          <>
        <Row label="Field" cols={[K("state.default"), K("state.error"), K("state.disabled")]}>
          <Field>
            <FieldLabel htmlFor="f-default">{K("sample.input.label")}</FieldLabel>
            <Input id="f-default" placeholder={K("sample.input.placeholder")} />
            <FieldDescription>{K("sample.input.description")}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="f-error">{K("sample.input.label")}</FieldLabel>
            <Input id="f-error" aria-invalid aria-describedby="f-error-msg" />
            <FieldError id="f-error-msg">{K("sample.input.error")}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="f-disabled">{K("sample.input.label")}</FieldLabel>
            <Input id="f-disabled" disabled defaultValue={K("sample.input.value")} />
          </Field>
        </Row>
          </>
        )}
        {part === "divider" && (
          <>
        <Row label="TextDivider">
          <TextDivider className="w-full">{t("login.divider")}</TextDivider>
        </Row>
          </>
        )}
      
    </>
  )
}

export function CheckboxDemo() {
  return (
    <>
        <StateMatrix
          label="Checkbox"
          states={["default", "hover", "focus", "disabled", "error"]}
          render={(s) => (
            <CheckboxField id={`cb-${s}`} label={K("sample.checkbox.label")} data-demo={demo(s)} disabled={s === "disabled"} aria-invalid={s === "error" || undefined} />
          )}
        />
        <Row label={K("state.checked")} cols={[K("state.checked"), `${K("state.checked")} · ${K("state.disabled")}`, t("login.remember.label")]}>
          <Checkbox defaultChecked aria-label={K("sample.checkbox.label")} />
          <Checkbox defaultChecked disabled aria-label={K("sample.checkbox.label")} />
          <CheckboxField id="cb-remember" label={t("login.remember.label")} defaultChecked />
        </Row>
      
    </>
  )
}

const LOW_STOCK_SKU = mock.skus.items.find((k) => k.lowStock) ?? mock.skus.items[0]
const SYNC_CHANNEL = channelLabel("douyin")
const SHIPPED_TOAST_N = mock.ordersAll.filter((o) => o.status === "shipped").length

function StaticToast({ role = "status", icon, title, description, action, close }: { role?: "status" | "alert"; icon?: React.ReactNode; title: string; description?: string; action?: string; close?: boolean }) {
  return (
    <div role={role} className="flex min-h-control-lg w-fit max-w-full items-center gap-3 rounded-lg border bg-surface-raised py-2 pr-2 pl-4 text-role-label text-fg shadow-lg">
      {icon}
      <span className="flex min-w-0 flex-col wrap-anywhere">
        {title}
        {description ? <span className="text-role-caption text-fg-muted">{description}</span> : null}
      </span>
      {action ? (
        <Button variant="ghost" size="sm" className="ml-2">
          {action}
        </Button>
      ) : null}
      {close ? (
        <IconButton label={K("sample.toast.close")} className="[&_svg]:size-icon-sm">
          <XIcon />
        </IconButton>
      ) : null}
    </div>
  )
}

export function AlertDemo({ set }: Pick<OverlayProps, "set">) {
  return (
    <div className={GRID_2}>
      <StageCol>
        <Alert variant="info" appearance="soft" role="status" closeLabel={K("sample.toast.close")} onClose={() => {}}>
          <AlertTitle>{K("sample.alert.title.info")}</AlertTitle>
          <AlertDescription>{mock.notifications.items.find((n) => n.type === "announcement")?.title}</AlertDescription>
        </Alert>
        <Alert variant="success" appearance="soft" role="status" closeLabel={K("sample.toast.close")} onClose={() => {}}>
          <AlertTitle>{K("sample.alert.title.success")}</AlertTitle>
          <AlertDescription>{K("sample.alert.prefsSaved")}</AlertDescription>
        </Alert>
        <Alert
          variant="warning"
          appearance="soft"
          role="status"
          action={
            <Button variant="ghost" size="sm">
              {K("sample.alert.restock")}
            </Button>
          }
        >
          <AlertTitle>{K("sample.alert.title.warning")}</AlertTitle>
          <AlertDescription>{K("sample.alert.lowStock", { name: LOW_STOCK_SKU.name, n: LOW_STOCK_SKU.stock })}</AlertDescription>
        </Alert>
        <Alert
          variant="danger"
          appearance="soft"
          action={
            <Button variant="ghost" size="sm">
              {K("sample.alert.reauth")}
            </Button>
          }
        >
          <AlertTitle>{K("sample.alert.title.danger")}</AlertTitle>
          <AlertDescription>{K("sample.alert.syncFailed", { channel: SYNC_CHANNEL })}</AlertDescription>
        </Alert>
        <Alert variant="neutral" appearance="soft" role="status">
          <AlertTitle>{K("sample.alert.title.neutral")}</AlertTitle>
          <AlertDescription>{mock.chat.assistant.disclaimer}</AlertDescription>
        </Alert>
      </StageCol>
      <StageCol>
        <StaticToast icon={<CircleCheckIcon className="size-icon-md shrink-0 text-success" />} title={K("sample.alert.prefsSaved")} close />
        <StaticToast icon={<InfoIcon className="size-icon-md shrink-0 text-primary" />} title={K("code.copied")} />
        <StaticToast icon={<CircleCheckIcon className="size-icon-md shrink-0 text-success" />} title={K("sample.toast.shipped", { n: SHIPPED_TOAST_N })} description={K("sample.toast.shippedDesc")} action={K("sample.toast.undo")} close />
        <StaticToast role="alert" icon={<CircleAlertIcon className="size-icon-md shrink-0 text-danger" />} title={K("sample.toast.syncFailed")} description={K("sample.toast.syncFailedDesc", { channel: SYNC_CHANNEL })} action={K("sample.toast.retry")} close />
        <StaticToast icon={<Spinner />} title={K("sample.toast.exporting", { n: formatInteger(TABLE_TOTAL) })} />
        <Stage>
          <Button variant="secondary" onClick={() => set({ toast: "1" })}>
            {K("sample.toast.open")}
          </Button>
          <span className="text-role-caption text-fg-muted">{K("sample.toast.hint")}</span>
        </Stage>
      </StageCol>
    </div>
  )
}

export function TagDemo() {
  return (
    <>
        <Row label="Tag · order status">
          {Object.entries(orderStatus).map(([status, { label, tone }]) => (
            <Tag key={status} tone={tone}>
              {label}
            </Tag>
          ))}
        </Row>
        <Row label="Tag · no dot">
          {(["info", "warning", "danger", "success", "neutral", "muted"] as Tone[]).map((tone) => (
            <Tag key={tone} tone={tone} dot={false}>
              {tone}
            </Tag>
          ))}
        </Row>
        <Row label="CountBadge" cols={["neutral", "warning", "alert"]}>
          <CountBadge>{mock.notifications.items.length}</CountBadge>
          <CountBadge tone="warning">{statFor(period, "lowStock").value}</CountBadge>
          <CountBadge tone="alert">{mock.notifications.unreadCount}</CountBadge>
        </Row>
        <Row label="Delta" cols={["success", "danger", "neutral"]}>
          <Delta tone="success" direction="up">
            {t("dashboard.delta.up", { n: formatPercent(gmv.delta) })}
          </Delta>
          <Delta tone="danger" direction="down">
            {t("dashboard.delta.down", { n: formatPercent(gmv.delta) })}
          </Delta>
          <Delta tone="neutral" direction="flat">
            {t("dashboard.delta.flat")}
          </Delta>
        </Row>
      
    </>
  )
}

export function AvatarDemo() {
  return (
    <>
        <Row label="Avatar" cols={["md", "sm", "system"]}>
          <div className="flex gap-2">
            {mock.team.map((m) => (
              <Avatar key={m.id} initial={m.initial} hue={m.avatarHue} name={m.name} />
            ))}
          </div>
          <div className="flex gap-2">
            {mock.team.map((m) => (
              <Avatar key={m.id} size="sm" initial={m.initial} hue={m.avatarHue} name={m.name} />
            ))}
          </div>
          <Avatar system initial="A" name={K("sample.timeline.system")} />
        </Row>
      
    </>
  )
}

export function CardDemo({ part }: { part: "card" | "stat" | "state" }) {
  return (
    <>
        {part === "card" && (
          <>
        <Row label="Card">
          <Card className="w-full">
            <CardHeader>
              <div>
                <CardTitle>{t("dashboard.orders.title")}</CardTitle>
                <CardDescription>{t("dashboard.chart.subtitle")}</CardDescription>
              </div>
              <CardAction>
                <Button variant="ghost" size="sm">
                  {t("dashboard.orders.viewAll")}
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>{t("dashboard.empty.body")}</CardContent>
          </Card>
        </Row>
          </>
        )}
        {part === "stat" && (
          <>
        <Row label="StatCard">
          <div className="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-4">
            {mock.stats.cards.map((card) => {
              const m = statFor(period, card.key)
              const up = m.delta > 0
              const tone = card.deltaTone === "neutral" ? "neutral" : (up ? !card.invertDelta : card.invertDelta) ? "success" : "danger"
              const text =
                card.deltaFormat === "percent"
                  ? t(up ? "dashboard.delta.up" : "dashboard.delta.down", { n: formatPercent(m.delta) })
                  : t("dashboard.delta.count", { sign: up ? "+" : "−", n: formatInteger(Math.abs(m.delta)) })
              return (
                <StatCard
                  key={card.key}
                  label={card.label}
                  value={card.format === "currency" ? formatCurrency(m.value) : formatInteger(m.value)}
                  unit={card.format === "currency" ? undefined : card.unit}
                  long={card.format === "currency"}
                  delta={{ tone, direction: up ? "up" : "down", text }}
                  trend={m.trend}
                />
              )
            })}
          </div>
        </Row>
        <Row label="StatCard · loading">
          <div className="grid w-full gap-4 md:grid-cols-2">
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        </Row>
          </>
        )}
        {part === "state" && (
          <>
        <Row label="StateCard" cols={[K("state.empty"), K("state.error")]}>
          <StateCard
            kind="empty"
            title={t("dashboard.empty.title")}
            body={t("dashboard.empty.body")}
            actions={
              <>
                <Button>{t("dashboard.empty.primary")}</Button>
                <Button variant="secondary">{t("dashboard.empty.secondary")}</Button>
              </>
            }
          />
          <StateCard
            kind="error"
            title={t("dashboard.error.title")}
            body={t("dashboard.error.body")}
            actions={<Button>{t("dashboard.error.retry")}</Button>}
            help={
              <>
                {t("dashboard.error.help")}
                <Button variant="link" size="sm" aria-disabled>
                  {K("sample.state.helpLink")}
                </Button>
              </>
            }
          />
        </Row>
          </>
        )}
      
    </>
  )
}

export function TabsDemo() {
  return (
    <>
        <StateMatrix
          label="Tabs"
          states={["default", "hover", "focus", "disabled"]}
          render={(s) => (
            <Tabs defaultValue="month">
              <TabsList aria-label={K("sample.tabs.aria")}>
                {periods.map((p) => (
                  <TabsTrigger key={p} value={p} data-demo={p === "day" ? demo(s) : undefined} disabled={s === "disabled"}>
                    {t(`dashboard.period.${p}`)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {periods.map((p) => (
                <TabsContent key={p} value={p} forceMount className="sr-only">
                  {t(`dashboard.period.${p}`)}
                </TabsContent>
              ))}
            </Tabs>
          )}
        />
      
    </>
  )
}

const TABLE_IDS = ["SO-20260906-0043", "SO-20260906-0108", "SO-20260906-0104", "SO-20260906-0107"]
const TABLE_ROWS = TABLE_IDS.flatMap((id) => mock.ordersAll.filter((o) => o.id === id))

const navItem = (key: string) => mock.nav.flatMap((g): NavItemDef[] => g.items).find((i) => i.key === key)
const NAV_ITEMS = [
  { item: navItem("dashboard"), icon: LayoutDashboardIcon, active: true, state: "default" },
  { item: navItem("orders"), icon: ReceiptTextIcon, active: false, state: "hover" },
  { item: navItem("inventory"), icon: WarehouseIcon, active: false, state: "focus" },
  { item: navItem("purchasing"), icon: TruckIcon, active: false, state: "disabled" },
  { item: navItem("settings"), icon: SettingsIcon, active: false, state: "default" },
].flatMap(({ item, ...rest }) => (item ? [{ item, ...rest }] : []))
const navGroupOf = (key: string) => mock.nav.find((g) => g.items.some((i) => i.key === key))
const NAV_GROUPS = [
  { group: navGroupOf("dashboard"), items: NAV_ITEMS.slice(0, 4) },
  { group: navGroupOf("settings"), items: NAV_ITEMS.slice(4) },
].flatMap(({ group, items }) => (group ? [{ group, items }] : []))

function DemoNavItem({ item, icon, active, state, rail }: (typeof NAV_ITEMS)[number] & { rail?: boolean }) {
  return (
    <NavItem
      href="#navigation"
      icon={icon}
      label={item.label}
      active={active}
      rail={rail}
      count={navBadge(item)}
      countTone={navBadgeTone(item)}
      countLabel={navBadgeLabel(item)}
      disabledTip={state === "disabled" ? t("shell.nav.disabled.tip") : undefined}
      data-demo={state === "hover" || state === "focus" ? demo(state) : undefined}
    />
  )
}

export function NavDemo() {
  return (
    <div className={GRID_3}>
      <DemoBox caption={K("sample.nav.expanded")}>
        <nav aria-label={K("sample.nav.aria")} className="flex w-full flex-col">
          {NAV_GROUPS.map(({ group, items }) => (
            <React.Fragment key={group.group}>
              <NavGroupLabel>{group.groupLabel}</NavGroupLabel>
              {items.map((n) => (
                <DemoNavItem key={n.item.key} {...n} />
              ))}
            </React.Fragment>
          ))}
        </nav>
      </DemoBox>
      <DemoBox caption={K("sample.nav.rail")}>
        <nav aria-label={K("sample.nav.railAria")} className="flex w-sidebar-rail flex-col items-center">
          {NAV_ITEMS.map((n) => (
            <DemoNavItem key={n.item.key} {...n} rail state={n.state === "focus" ? "default" : n.state} />
          ))}
        </nav>
      </DemoBox>
      <DemoBox caption={K("sample.nav.crumbs")}>
        <Breadcrumb aria-label={K("sample.pageHeader.crumbs")}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#navigation">{t("orders.title")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#navigation" data-demo="hover">
                {orderStatus.pending_shipment?.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-mono">{TABLE_IDS[0]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb aria-label={K("sample.crumb.settingsAria")}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#navigation">{t("settings.title")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#navigation">{t("settings.team.title")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{K("sample.crumb.invite", { workspace: user.workspace.name })}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DemoBox>
    </div>
  )
}

const overlayLabel = { dialog: "Tooltip", menu: "Popover / DropdownMenu", sheet: "Sheet" } as const
const overlayCols: Record<keyof typeof overlayLabel, string[]> = { dialog: ["Tooltip"], menu: ["Popover", "DropdownMenu"], sheet: ["Sheet"] }

export function OverlayDemo({ open, set, part }: OverlayProps & { part: "dialog" | "menu" | "sheet" }) {
  return (
    <>
        <Row label={overlayLabel[part]} cols={overlayCols[part]}>
          {part === "dialog" && (
          <Tooltip open={open === "tooltip" || undefined}>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="sm">
                {mock.nav[2].items[0].label}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{K("sample.tooltip")}</TooltipContent>
          </Tooltip>
          )}

          {part === "menu" && (
          <Popover open={open === "popover" || undefined} onOpenChange={(o) => (o ? set({ open: "popover" }) : set({ open: null }))}>
            <PopoverTrigger asChild>
              <IconButton label={t("shell.notifications.aria")} count={mock.notifications.unreadCount}>
                <BellIcon />
              </IconButton>
            </PopoverTrigger>
            <PopoverContent aria-label={t("shell.notifications.title")}>
              <PopoverHeader>
                <strong className="text-role-label">{t("shell.notifications.title")}</strong>
                <Button variant="ghost" size="sm">
                  {t("shell.notifications.markAll")}
                </Button>
              </PopoverHeader>
              <div className="flex flex-col">
                {mock.notifications.items.slice(0, 3).map((n) => (
                  <NotificationItem key={n.id} kind={n.type} title={n.title} time={n.relative} unread={n.unread} />
                ))}
              </div>
              <PopoverFooter className="text-center">
                <Button variant="link" size="sm" aria-disabled>
                  {t("shell.notifications.viewAll")}
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
          )}

          {part === "menu" && (
          <DropdownMenu open={open === "menu" || undefined} onOpenChange={(o) => (o ? set({ open: "menu" }) : set({ open: null }))}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" aria-label={t("shell.account.aria")}>
                <Avatar size="sm" initial={user.initial} hue={user.avatarHue} name={user.name} />
                {user.shortName}
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuHeader>
                <Avatar aria-hidden initial={user.initial} hue={user.avatarHue} />
                <div className="min-w-0 leading-none">
                  <strong className="block truncate text-role-label">{user.name}</strong>
                  <span className="block truncate text-role-caption text-fg-muted">{user.email}</span>
                </div>
              </DropdownMenuHeader>
              <DropdownMenuItem>
                <UserIcon /> {t("shell.account.menu.profile")}
              </DropdownMenuItem>
              <DropdownMenuItem data-highlighted={open === "menu" ? "" : undefined}>
                <ShieldIcon /> {t("shell.account.menu.security")}
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <HelpCircleIcon /> {t("shell.account.menu.help")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="danger">
                <LogOutIcon /> {t("shell.account.menu.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          )}

          {part === "sheet" && (
          <Sheet open={open === "sheet" || undefined} onOpenChange={(o) => (o ? set({ open: "sheet" }) : set({ open: null }))}>
            <SheetTrigger asChild>
              <IconButton label={K("sample.sheet.open")}>
                <MenuIcon />
              </IconButton>
            </SheetTrigger>
            <SheetContent title={K("sample.sheet.title")} closeLabel={K("sample.sheet.close")}>
              <div className="flex h-topbar items-center gap-3 px-4">
                <BrandMark />
                <strong className="text-role-label">{t("shell.brand")}</strong>
              </div>
              <nav className="flex flex-col gap-1 px-2">
                {mock.nav.map((g) => (
                  <React.Fragment key={g.group}>
                    <NavGroupLabel>{g.groupLabel}</NavGroupLabel>
                    {g.items.map((it) => (
                      <NavItem
                        key={it.key}
                        href="#overlay"
                        icon={it.key === "dashboard" ? LayoutDashboardIcon : g.group === "goods" ? BoxIcon : PackageIcon}
                        label={it.label}
                        active={it.key === "dashboard"}
                        count={navBadge(it)}
                        disabledTip={it.implemented ? undefined : t("shell.nav.disabled.tip")}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          )}
        </Row>

      
    </>
  )
}

const DENSITY_ROW = mock.ordersAll.find((o) => o.id === "SO-20260906-0099") ?? mock.ordersAll[0]

function DensityTable({ density }: { density: "default" | "compact" }) {
  const st = orderStatus[DENSITY_ROW.status]
  return (
    <Table density={density} className="w-auto min-w-[calc(var(--size-content-max)/4)]">
      <TableBody>
        <TableRow>
          <TableCell className="font-mono text-role-caption">{DENSITY_ROW.id}</TableCell>
          <TableCell>{DENSITY_ROW.customer.name}</TableCell>
          <TableCell className="text-right tabular-nums">{formatCurrency(DENSITY_ROW.amount)}</TableCell>
          <TableCell>{st ? <Tag tone={st.tone}>{st.label}</Tag> : DENSITY_ROW.status}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

const byId = (id: string) => mock.ordersAll.find((o) => o.id === id)
/** hifi 三张卡：default / hover / selected + 加急（chat 屏「SO-20260903-0087 改加急」后的状态） */
const ORDER_CARDS = [
  { order: byId("SO-20260906-0108"), state: "default", urgent: false },
  { order: byId("SO-20260906-0043"), state: "hover", urgent: false },
  { order: byId("SO-20260903-0087"), state: "selected", urgent: true },
].flatMap(({ order, ...rest }) => (order ? [{ order, ...rest }] : []))

const PO = mock.purchaseForm.draft
const [PO_QTY_MIN, PO_QTY_MAX] = mock.purchaseForm.validation.qtyRange
/** 最后一行数量置 0 演示 qtyRange 校验错误 */
const PURCHASE_ROWS = PO.items.map((item, i) => ({ item, qty: i === PO.items.length - 1 ? 0 : item.qty }))

export function TableDemo({ part }: { part: "table" | "order" }) {
  return (
    <>
        {part === "table" && (
          <>
            <MatrixWrap label={K("sample.table.caption")} kind="table-wrap">
              <Table>
                <caption className="sr-only">{K("sample.table.caption")}</caption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-hit">
                      <span className="sr-only">{t("orders.col.select")}</span>
                    </TableHead>
                    <TableHead>{t("dashboard.orders.col.id")}</TableHead>
                    <TableHead>{t("dashboard.orders.col.customer")}</TableHead>
                    <TableHead>{t("dashboard.orders.col.items")}</TableHead>
                    <TableHead className="text-right">
                      <button type="button" aria-pressed aria-label={K("sample.table.sortAmount")} className="inline-flex h-hit items-center gap-1 rounded-sm text-fg hover:text-primary">
                        {t("dashboard.orders.col.amount")}
                        <ArrowDownIcon aria-hidden className="size-icon-sm" />
                      </button>
                    </TableHead>
                    <TableHead>{t("dashboard.orders.col.status")}</TableHead>
                    <TableHead>{t("dashboard.orders.col.time")}</TableHead>
                    <TableHead>
                      <span className="sr-only">{t("dashboard.orders.col.actions")}</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TABLE_ROWS.map((o, i) => {
                    const st = orderStatus[o.status]
                    return (
                      <TableRow key={o.id} aria-selected={i === 0 || undefined} data-demo={i === 1 ? "hover" : undefined}>
                        <TableCell>
                          <Checkbox checked={i === 0} aria-label={t("orders.col.selectRow", { id: o.id })} />
                        </TableCell>
                        <TableCell className="font-mono text-role-caption">{o.id}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <Avatar size="sm" initial={o.customer.initial} hue={o.customer.avatarHue} name={o.customer.name} />
                            {o.customer.name}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-form-max truncate text-fg-muted">{o.items.map((it) => `${it.name} ×${it.qty}`).join("、")}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatCurrency(o.amount)}</TableCell>
                        <TableCell>{st ? <Tag tone={st.tone}>{st.label}</Tag> : o.status}</TableCell>
                        <TableCell className="tabular-nums whitespace-nowrap text-fg-muted">{formatFullDateTime(o.placedAt)}</TableCell>
                        <TableCell className="text-right">
                          <IconButton label={t("dashboard.orders.action.menu")}>
                            <MoreHorizontalIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </MatrixWrap>
            <p className="hidden text-role-caption text-fg-muted mobile:block">{K("sample.table.mobileHint")}</p>
            <Matrix
              caption={K("sample.table.density")}
              head={K("matrix.density")}
              cols={["example"] as const}
              colLabel={() => K("matrix.example")}
              wide
              rows={(["default", "compact"] as const).map((d) => ({
                label: d,
                mono: K(`sample.table.density.${d}`),
                render: () => <DensityTable density={d} />,
              }))}
            />
          </>
        )}
        {part === "order" && (
          <div className={GRID_3}>
            <DemoBox caption={K("sample.orderCard.caption")}>
              {ORDER_CARDS.map(({ order: o, state, urgent }) => {
                const st = orderStatus[o.status]
                const isToday = o.placedAt.slice(0, 10) === mock.meta.asOf.slice(0, 10)
                return (
                  <div
                    key={o.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={state === "selected"}
                    aria-label={K("sample.orderCard.aria", { id: o.id })}
                    data-demo={state === "hover" ? "hover" : undefined}
                    className="flex w-full max-w-form-max flex-col gap-2 rounded-md border bg-surface py-3 pr-3 pl-4 text-left transition-[border-color,box-shadow] duration-(--motion-fast) ease-std hover:border-border-strong hover:shadow-sm aria-pressed:border-primary aria-pressed:shadow-[inset_0_0_0_var(--border-width-hairline)_var(--color-role-primary)]"
                  >
                    <span className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate font-mono">{o.id}</span>
                      {urgent ? (
                        <span className="inline-flex shrink-0 items-center gap-1 text-role-caption font-medium whitespace-nowrap text-danger">
                          <ZapIcon aria-hidden className="size-icon-sm" />
                          {t("orders.urgent")}
                        </span>
                      ) : null}
                      {st ? (
                        <Tag tone={st.tone} dot className="shrink-0">
                          {st.label}
                        </Tag>
                      ) : null}
                    </span>
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="max-w-3/5 shrink-0 truncate text-role-label">{o.customer.name}</span>
                      <span className="min-w-0 truncate text-fg-muted">{o.items.map((it) => `${it.name} ×${it.qty}`).join("、")}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="shrink-0 text-role-title tabular-nums">{formatCurrency(o.amount)}</span>
                      <span className="ml-auto min-w-0 truncate text-right text-role-caption text-fg-muted">
                        {[channelLabel(o.channel), isToday ? formatTime(o.placedAt) : formatDateTime(o.placedAt), o.stockout ? t("orders.stockout") : null].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </div>
                )
              })}
            </DemoBox>
            <DemoBox caption={K("sample.purchase.caption", { id: PO.poNumber })} className="col-span-2 mobile:col-span-1">
              <div role="list" aria-label={K("sample.purchase.aria")} className="flex w-full flex-col">
                {PURCHASE_ROWS.map(({ item, qty }) => {
                  const invalid = qty < PO_QTY_MIN
                  const errId = invalid ? `pi-err-${item.sku}` : undefined
                  return (
                    <div key={item.sku} role="listitem" className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto_var(--size-hit)] items-center gap-3 border-b border-border py-2 last:border-b-0 mobile:grid-cols-[minmax(0,1fr)_var(--size-hit)] mobile:[&>*]:col-span-full mobile:[&>:first-child]:col-span-1 mobile:[&>:first-child]:col-start-1 mobile:[&>:first-child]:row-start-1 mobile:[&>[data-slot=remove]]:col-span-1 mobile:[&>[data-slot=remove]]:col-start-2 mobile:[&>[data-slot=remove]]:row-start-1">
                      <span className="flex min-w-0 flex-col">
                        <strong className="truncate text-role-label">{item.name}</strong>
                        <span className="font-mono text-role-caption text-fg-muted">{item.sku}</span>
                      </span>
                      <NumberInput
                        value={qty}
                        min={PO_QTY_MIN}
                        max={PO_QTY_MAX}
                        onChange={() => {}}
                        aria-label={t("form.items.col.qty")}
                        aria-invalid={invalid || undefined}
                        aria-describedby={errId}
                        decrementLabel={K("sample.number.dec")}
                        incrementLabel={K("sample.number.inc")}
                      />
                      <span className="relative w-[calc(var(--size-hit)*2.5)] mobile:w-full">
                        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-fg-muted">
                          {currencySymbol}
                        </span>
                        <Input value={formatAmount(item.unitPrice)} onChange={() => {}} inputMode="decimal" aria-label={t("form.items.col.unitPrice")} className="pl-8 tabular-nums" />
                      </span>
                      <span className="min-w-[calc(var(--size-hit)*2.5)] text-right text-role-label tabular-nums whitespace-nowrap mobile:text-left">{formatCurrency(qty * item.unitPrice)}</span>
                      <IconButton data-slot="remove" label={K("sample.purchase.remove", { name: item.name })}>
                        <Trash2Icon />
                      </IconButton>
                      {invalid ? (
                        <FieldError id={errId} className="col-span-full">
                          {K("sample.purchase.qtyMin")}
                        </FieldError>
                      ) : null}
                    </div>
                  )
                })}
              </div>
              <Stage end>
                <span className="text-role-caption text-fg-muted">{K("sample.purchase.total")}</span>
                <span className="text-role-title tabular-nums">{formatCurrency(PURCHASE_ROWS.reduce((sum, r) => sum + r.qty * r.item.unitPrice, 0))}</span>
              </Stage>
            </DemoBox>
          </div>
        )}
        {part === "table" && <TableExtras />}
      
    </>
  )
}

export function ListDemo() {
  return (
    <>
        <ListExtras />
        <Row label="Timeline" wide cols={[K("state.default"), K("state.loading")]}>
          <Timeline className="w-full">
            {mock.activity.slice(0, 3).map((a) => {
              const member = mock.team.find((m) => m.id === a.actor)
              return (
                <TimelineItem
                  key={a.id}
                  actor={member ? { initial: member.initial, hue: member.avatarHue, name: member.name } : { initial: a.actorName.slice(-1), name: a.actorName, system: true }}
                  time={formatTime(a.at)}
                  detail={a.detail}
                >
                  <b className="font-medium">{a.actorName}</b> {a.text}
                </TimelineItem>
              )
            })}
          </Timeline>
          <div className="w-full">
            <TimelineSkeleton rows={3} />
          </div>
        </Row>
        <Row label="TaskItem">
          <div className="flex w-full flex-col gap-4">
            {mock.tasks.slice(0, 3).map((task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                status={task.status as TaskStatus}
                percent={task.percent}
                ariaLabel={t("dashboard.tasks.aria", { title: task.title, percent: task.percent })}
                meta={
                  <>
                    <Avatar size="sm" initial={task.ownerName.slice(-1)} hue={mock.team.find((m) => m.id === task.owner)?.avatarHue} name={task.ownerName} />
                    <span data-due="">{t("dashboard.tasks.due", { date: formatMonthDay(task.dueDate) })}</span>
                  </>
                }
                count={
                  <>
                    <b>{task.done}</b>/{task.total} {task.unit}
                  </>
                }
              />
            ))}
          </div>
        </Row>
        <Row label="NotificationItem">
          <div className="w-full max-w-popover">
            {mock.notifications.items.slice(0, 3).map((n, i) => (
              <NotificationItem key={n.id} kind={n.type} title={n.title} time={n.relative} unread={n.unread} data-demo={i === 1 ? "hover" : undefined} />
            ))}
          </div>
        </Row>
      
    </>
  )
}

export function ChartDemo() {
  return (
    <>
        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{t("dashboard.chart.title")}</CardTitle>
                <CardDescription>{t("dashboard.chart.subtitle")}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <TrendChart
                title={K("sample.chart.trend")}
                data={series.points}
                labels={{ gmv: K("sample.chart.gmv"), orders: K("sample.chart.orders") }}
                formatGmv={formatCurrency}
                formatOrders={formatInteger}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{t("dashboard.donut.title")}</CardTitle>
                <CardDescription>{t("dashboard.donut.subtitle", { periodLabel: mock.meta.periods[period].label })}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <DonutChart
                title={K("sample.chart.donut")}
                items={donut}
                total={formatCurrency(total)}
                totalLabel={K("sample.chart.total")}
                formatValue={formatCurrency}
                formatShare={(n) => `${formatPercent(n)}%`}
              />
            </CardContent>
          </Card>
        </div>
      
    </>
  )
}

export function FeedbackDemo() {
  return (
    <>
        <Row label="Skeleton / Spinner" cols={["Skeleton", "Spinner", "Separator"]}>
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-8 w-2/5" />
          </div>
          <div className="flex items-center gap-4 text-fg-muted">
            <Spinner />
            <Spinner className="size-icon-md" />
          </div>
          <Separator className="w-full" />
        </Row>
        <Row label="Progress" cols={["primary", "warning", "success"]}>
          <Progress value={45} aria-label={K("sample.progress.aria")} />
          <Progress value={20} tone="warning" aria-label={K("sample.progress.aria")} />
          <Progress value={100} tone="success" aria-label={K("sample.progress.aria")} />
        </Row>
      
    </>
  )
}

