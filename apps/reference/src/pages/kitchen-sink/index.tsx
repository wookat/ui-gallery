import * as React from "react"
import { cn } from "cn"
import {
  BellIcon,
  BoxIcon,
  ChevronDownIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PackageIcon,
  ShieldIcon,
  SunIcon,
  UserIcon,
} from "lucide-react"

import { Avatar } from "@/components/composed/avatar"
import { BrandMark } from "@/components/composed/brand"
import { DonutChart, TrendChart } from "@/components/composed/charts"
import { NavGroupLabel, NavItem } from "@/components/composed/nav-item"
import { NotificationItem } from "@/components/composed/notification-item"
import { SearchInput } from "@/components/composed/search-input"
import { StatCard, StatCardSkeleton, Delta } from "@/components/composed/stat-card"
import { StateCard } from "@/components/composed/state-card"
import { TaskItem, type TaskStatus } from "@/components/composed/task-item"
import { Timeline, TimelineItem, TimelineSkeleton } from "@/components/composed/timeline"
import { useTheme } from "@/components/theme-provider"
import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert"
import { CountBadge, Tag, type Tone } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox, CheckboxField } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuHeader, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { PasswordInput } from "@/components/ui/password-input"
import { Popover, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Separator, TextDivider } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/sonner"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableWrap } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { orderStatus, t } from "@/data/content"
import { channelLabel, mock, navBadge, periods, seriesFor, statFor } from "@/data/mock"
import { useScreenState } from "@/data/screen-state"
import { formatCurrency, formatInteger, formatMonthDay, formatPercent, formatTime } from "@/lib/format"

/**
 * /kitchen-sink —— docs/frontend/04-components.md 映射表中每个组件 × 变体 × 状态。
 * 状态列固定为 default / hover / focus / disabled / loading / error（不适用的列留空并标 —）。
 * hover / focus 通过 data-demo 属性驱动（见 theme.css @custom-variant），截图脚本无需真正移动鼠标。
 * URL：?theme=light|dark、?open=popover|menu|sheet|tooltip（展开浮层）、?toast=1（弹出 Toast）。
 */
const K = (key: string, vars?: Record<string, string | number>) => t(`kitchen-sink.${key}`, vars)

const STATES = ["default", "hover", "focus", "disabled", "loading", "error"] as const
type State = (typeof STATES)[number]

const sections = [
  "typography",
  "button",
  "input",
  "checkbox",
  "alert",
  "tag",
  "avatar",
  "card",
  "tabs",
  "nav",
  "overlay",
  "table",
  "list",
  "chart",
  "feedback",
] as const

function Section({ id, children, className }: { id: (typeof sections)[number]; children: React.ReactNode; className?: string }) {
  return (
    <Card id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-6", className)}>
      <CardHeader>
        <CardTitle id={`${id}-title`}>{K(`section.${id}`)}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">{children}</CardContent>
    </Card>
  )
}

/** 一行 = 一个组件变体；列 = 状态 */
function Matrix({ label, states = STATES, render }: { label: string; states?: readonly State[]; render: (state: State) => React.ReactNode }) {
  return (
    <div data-slot="matrix" className="flex flex-col gap-3">
      <span className="text-role-label text-fg-muted">{label}</span>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(calc(var(--size-sidebar-expanded)*0.75),1fr))] gap-4">
        {states.map((s) => (
          <div key={s} data-state-col={s} className="flex min-w-0 flex-col gap-2">
            <span className="text-role-caption text-fg-muted">{K(`state.${s}`)}</span>
            <div className="flex min-h-hit items-center [&>*]:min-w-0">{render(s)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Row({ label, children, cols, wide }: { label: string; children: React.ReactNode; cols?: string[]; wide?: boolean }) {
  return (
    <div data-slot="row" className="flex flex-col gap-3">
      <span className="text-role-label text-fg-muted">{label}</span>
      {cols ? (
        <div
          className={cn(
            "grid gap-4",
            wide
              ? "grid-cols-[repeat(auto-fit,minmax(calc(var(--size-sidebar-expanded)*1.25),1fr))]"
              : "grid-cols-[repeat(auto-fill,minmax(calc(var(--size-sidebar-expanded)*0.75),1fr))]",
          )}
        >
          {React.Children.map(children, (child, i) => (
            <div className="flex min-w-0 flex-col gap-2">
              <span className="text-role-caption text-fg-muted">{cols[i]}</span>
              <div className="flex min-h-hit items-center [&>*]:min-w-0">{child}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-4">{children}</div>
      )}
    </div>
  )
}

const demo = (s: State) => (s === "hover" || s === "focus" ? s : undefined)

export default function KitchenSink() {
  const { resolved, toggle } = useTheme()
  const { open, toast: toastQ, set } = useScreenState(["default"] as const)
  const period = "month"
  const user = mock.user
  const series = seriesFor(period)
  const gmv = statFor(period, "gmv")
  const total = series.channels.total
  const donut = series.channels.items.map((c) => ({ key: c.key, label: channelLabel(c.key), value: c.gmv, share: c.share }))

  React.useEffect(() => {
    if (!toastQ) return
    const id = toast.success(t("login.toast.success", { name: user.shortName }), { duration: Infinity })
    return () => {
      toast.dismiss(id)
    }
  }, [toastQ, user.shortName])

  return (
    <main className="mx-auto flex w-full max-w-content-max flex-col gap-6 p-6 max-md:p-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-role-heading">{K("title")}</h1>
          <p className="mt-1 text-fg-muted">{K("subtitle")}</p>
        </div>
        <IconButton label={resolved === "dark" ? K("theme.toLight") : K("theme.toDark")} onClick={toggle}>
          {resolved === "dark" ? <SunIcon /> : <MoonIcon />}
        </IconButton>
      </header>

      <nav aria-label={K("nav.aria")} className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <Button key={s} asChild variant="secondary" size="sm">
            <a href={`#${s}`}>{K(`section.${s}`)}</a>
          </Button>
        ))}
      </nav>

      {/* ---------- 排版 ---------- */}
      <Section id="typography">
        <div className="grid gap-3 md:grid-cols-2">
          <p className="text-role-display">{formatCurrency(gmv.value)}</p>
          <p className="text-role-heading">{t("dashboard.stats.title")}</p>
          <p className="text-role-title">{t("dashboard.chart.title")}</p>
          <p className="text-role-label">{t("dashboard.chart.subtitle")}</p>
          <p className="text-role-body">{t("dashboard.empty.body")}</p>
          <p className="text-role-caption text-fg-muted">{t("dashboard.asOf", { time: formatTime(mock.meta.asOf) })}</p>
          <p className="font-mono text-role-caption text-fg-muted">{mock.orders[0].id}</p>
          <p>
            <a href="#typography">{t("login.forgot.link")}</a> · <Kbd>⌘K</Kbd>
          </p>
        </div>
      </Section>

      {/* ---------- 按钮 ---------- */}
      <Section id="button">
        {(["primary", "secondary", "ghost", "danger", "link"] as const).map((variant) => (
          <Matrix
            key={variant}
            label={variant}
            render={(s) =>
              s === "error" ? (
                <Dash />
              ) : (
                <Button variant={variant} data-demo={demo(s)} disabled={s === "disabled"} loading={s === "loading"}>
                  {s === "loading" ? K("sample.button.loading") : K(`sample.button.${variant}`)}
                </Button>
              )
            }
          />
        ))}
        <Row label="size" cols={["sm", "md", "lg", "block"]}>
          <Button size="sm">{K("sample.button.primary")}</Button>
          <Button size="md">{K("sample.button.primary")}</Button>
          <Button size="lg">{K("sample.button.primary")}</Button>
          <Button block>{t("login.submit")}</Button>
        </Row>
        <Matrix
          label="icon"
          render={(s) =>
            s === "error" ? (
              <Dash />
            ) : s === "loading" ? (
              <IconButton label={K("sample.icon.more")} disabled>
                <Spinner />
              </IconButton>
            ) : (
              <IconButton label={K("sample.icon.notifications")} count={mock.notifications.unreadCount} data-demo={demo(s)} disabled={s === "disabled"}>
                <BellIcon />
              </IconButton>
            )
          }
        />
        <Row label="icon · round / expanded / more">
          <IconButton label={t("shell.account.aria")} shape="round">
            <Avatar initial={user.initial} hue={user.avatarHue} name={user.name} />
          </IconButton>
          <IconButton label={t("shell.nav.open")} aria-expanded>
            <MenuIcon />
          </IconButton>
          <IconButton label={t("dashboard.orders.action.menu")}>
            <MoreHorizontalIcon />
          </IconButton>
        </Row>
      </Section>

      {/* ---------- 输入 ---------- */}
      <Section id="input">
        <Matrix
          label="Input"
          render={(s) => (
            <Input
              aria-label={K("sample.input.label")}
              placeholder={K("sample.input.placeholder")}
              defaultValue={s === "default" ? undefined : K("sample.input.value")}
              data-demo={demo(s)}
              disabled={s === "disabled"}
              readOnly={s === "loading"}
              aria-invalid={s === "error" || undefined}
            />
          )}
        />
        <Row label="Input · states" cols={[K("state.readonly"), "type=email", "type=search"]}>
          <Input readOnly defaultValue={user.email} aria-label={t("login.email.label")} />
          <Input type="email" placeholder={t("login.email.placeholder")} aria-label={t("login.email.label")} />
          <SearchInput placeholder={t("shell.search.placeholder")} aria-label={t("shell.search.aria")} shortcut="⌘K" />
        </Row>
        <Matrix
          label="PasswordInput"
          states={["default", "hover", "focus", "disabled", "error"]}
          render={(s) => (
            <PasswordInput
              aria-label={t("login.password.label")}
              placeholder={t("login.password.placeholder")}
              defaultValue={s === "default" ? undefined : user.demoCredentials.passwordRule}
              showLabel={t("login.password.show")}
              hideLabel={t("login.password.hide")}
              data-demo={demo(s)}
              disabled={s === "disabled"}
              aria-invalid={s === "error" || undefined}
            />
          )}
        />
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
        <Row label="TextDivider">
          <TextDivider className="w-full">{t("login.divider")}</TextDivider>
        </Row>
      </Section>

      {/* ---------- 复选框 ---------- */}
      <Section id="checkbox">
        <Matrix
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
      </Section>

      {/* ---------- 提示条 ---------- */}
      <Section id="alert">
        <Row label="Alert" wide cols={[K("state.error"), K("state.warning"), K("state.success"), K("state.info")]}>
          <Alert variant="danger" closeLabel={K("sample.toast.close")} onClose={() => {}}>
            <AlertDescription>{t("login.alert.invalid")}</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertDescription>{t("login.alert.network")}</AlertDescription>
            <AlertAction>{t("dashboard.error.retry")}</AlertAction>
          </Alert>
          <Alert variant="success">
            <AlertDescription>{t("login.toast.success", { name: user.shortName })}</AlertDescription>
          </Alert>
          <Alert variant="info">
            <AlertDescription>{t("dashboard.error.help")}</AlertDescription>
          </Alert>
        </Row>
      </Section>

      {/* ---------- 标签与角标 ---------- */}
      <Section id="tag">
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
      </Section>

      {/* ---------- 头像 ---------- */}
      <Section id="avatar">
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
      </Section>

      {/* ---------- 卡片 ---------- */}
      <Section id="card">
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
      </Section>

      {/* ---------- 分段切换 ---------- */}
      <Section id="tabs">
        <Matrix
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
      </Section>

      {/* ---------- 导航 ---------- */}
      <Section id="nav">
        <Matrix
          label="NavItem"
          states={["default", "hover", "focus", "disabled"]}
          render={(s) => (
            <div className="w-full">
              {s === "disabled" ? (
                <NavItem href="#nav" icon={BoxIcon} label={mock.nav[2].items[0].label} disabledTip={t("shell.nav.disabled.tip")} />
              ) : (
                <NavItem href="#nav" icon={PackageIcon} label={mock.nav[1].items[0].label} count={navBadge(mock.nav[1].items[0])} data-demo={demo(s)} />
              )}
            </div>
          )}
        />
        <Row label="NavItem · active / rail / group" cols={[K("state.active"), "rail", "rail · active", "group"]}>
          <div className="w-full">
            <NavItem href="#nav" icon={LayoutDashboardIcon} label={mock.nav[0].items[0].label} active />
          </div>
          <NavItem href="#nav" icon={PackageIcon} label={mock.nav[1].items[0].label} count={navBadge(mock.nav[1].items[0])} rail />
          <NavItem href="#nav" icon={LayoutDashboardIcon} label={mock.nav[0].items[0].label} active rail />
          <div className="w-full">
            <NavGroupLabel>{mock.nav[0].groupLabel}</NavGroupLabel>
            <NavItem href="#nav" icon={LayoutDashboardIcon} label={mock.nav[0].items[0].label} />
          </div>
        </Row>
        <Row label="Brand">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div className="leading-none">
              <strong className="block text-role-label">{t("shell.brand")}</strong>
              <span className="text-role-caption text-fg-muted">{user.workspace.name}</span>
            </div>
          </div>
        </Row>
        <Row label="Breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#nav">{t("shell.breadcrumb.root")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("shell.breadcrumb.current")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Row>
      </Section>

      {/* ---------- 浮层 ---------- */}
      <Section id="overlay">
        <Row label="Tooltip / Popover / DropdownMenu / Sheet / Toast" cols={["Tooltip", "Popover", "DropdownMenu", "Sheet", "Toast"]}>
          <Tooltip open={open === "tooltip" || undefined}>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="sm">
                {mock.nav[2].items[0].label}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{K("sample.tooltip")}</TooltipContent>
          </Tooltip>

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

          <Button variant="secondary" size="sm" onClick={() => toast.success(t("login.toast.success", { name: user.shortName }))}>
            {K("sample.toast.open")}
          </Button>
        </Row>
      </Section>

      {/* ---------- 表格 ---------- */}
      <Section id="table">
        <Row label="Table">
          <TableWrap className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("dashboard.orders.col.id")}</TableHead>
                  <TableHead>{t("dashboard.orders.col.customer")}</TableHead>
                  <TableHead>{t("dashboard.orders.col.items")}</TableHead>
                  <TableHead className="text-right">{t("dashboard.orders.col.amount")}</TableHead>
                  <TableHead>{t("dashboard.orders.col.channel")}</TableHead>
                  <TableHead>{t("dashboard.orders.col.status")}</TableHead>
                  <TableHead>{t("dashboard.orders.col.time")}</TableHead>
                  <TableHead>
                    <span className="sr-only">{t("dashboard.orders.col.actions")}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mock.orders.slice(0, 4).map((o, i) => {
                  const st = orderStatus[o.status]
                  return (
                    <TableRow key={o.id} data-demo={i === 1 ? "hover" : undefined}>
                      <TableCell className="font-mono text-role-caption">{o.id}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <Avatar size="sm" initial={o.customer.initial} hue={o.customer.avatarHue} name={o.customer.name} />
                          {o.customer.name}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-form-max truncate whitespace-normal">
                        {o.items[0].name} ×{o.items[0].qty}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(o.amount)}</TableCell>
                      <TableCell>{channelLabel(o.channel)}</TableCell>
                      <TableCell>{st ? <Tag tone={st.tone}>{st.label}</Tag> : o.status}</TableCell>
                      <TableCell className="tabular-nums text-fg-muted">
                        {formatMonthDay(o.placedAt)} {formatTime(o.placedAt)}
                      </TableCell>
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
          </TableWrap>
        </Row>
        <Row label="Table · loading">
          <div className="flex w-full flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-4">
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </Row>
        <Row label="OrderCard (375)">
          <div className="grid w-full gap-3 md:grid-cols-2">
            {mock.orders.slice(0, 2).map((o) => {
              const st = orderStatus[o.status]
              return (
                <Card key={o.id} className="grid grid-cols-[1fr_auto] gap-y-2 p-4">
                  <span className="font-mono text-role-caption text-fg-muted">{o.id}</span>
                  {st ? <Tag tone={st.tone}>{st.label}</Tag> : null}
                  <span className="flex items-center gap-2 text-role-label">
                    <Avatar size="sm" initial={o.customer.initial} hue={o.customer.avatarHue} name={o.customer.name} />
                    {o.customer.name}
                  </span>
                  <strong className="text-role-label tabular-nums">{formatCurrency(o.amount)}</strong>
                  <span className="col-span-full truncate text-fg-muted">
                    {o.items[0].name} ×{o.items[0].qty}
                  </span>
                  <span className="col-span-full flex items-center justify-between text-role-caption text-fg-muted">
                    {channelLabel(o.channel)} · {formatMonthDay(o.placedAt)} {formatTime(o.placedAt)}
                    <IconButton label={t("dashboard.orders.action.menu")} className="-mr-2">
                      <MoreHorizontalIcon />
                    </IconButton>
                  </span>
                </Card>
              )
            })}
          </div>
        </Row>
      </Section>

      {/* ---------- 列表 ---------- */}
      <Section id="list">
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
      </Section>

      {/* ---------- 图表 ---------- */}
      <Section id="chart">
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
      </Section>

      {/* ---------- 反馈 ---------- */}
      <Section id="feedback">
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
      </Section>
    </main>
  )
}

function Dash() {
  return <span aria-hidden className="text-fg-disabled">—</span>
}
