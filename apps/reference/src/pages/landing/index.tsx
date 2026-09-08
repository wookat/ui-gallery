import * as React from "react"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import {
  ArrowRightIcon,
  CheckIcon,
  CodeIcon,
  GlobeIcon,
  LinkIcon,
  MailIcon,
  MenuIcon,
  MessageCircleIcon,
  MoonIcon,
  QuoteIcon,
  ReceiptTextIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  TruckIcon,
  UsersIcon,
  WarehouseIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/cn"
import { orderStatus, t } from "@/data/content"
import { mock } from "@/data/mock"
import { useScreenState } from "@/data/screen-state"
import { formatCurrencyWhole } from "@/lib/format"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Card } from "@/components/ui/card"
import { Tag } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select } from "@/components/ui/select"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar } from "@/components/composed/avatar"
import { BrandMark } from "@/components/composed/brand"
import { PricingCard } from "@/components/composed/pricing-card"

/**
 * /landing —— 营销落地页（无应用壳）。
 * 状态（hifi check.mjs）：?state=default|scrolled（不传则按 scrollY 自动）· ?cycle=monthly|yearly · ?open=menu · ?theme=light|dark。
 * 文案：结构性标签 content/landing.md（landing.*），内容数据 mock/landing.json；价格与 mock/settings.json billing.plans 同源。
 */
const STATES = ["default", "scrolled"] as const
type Cycle = "monthly" | "yearly"

const landing = mock.landing
/** 套餐文案来自 landing.json，价格来自 settings.json billing.plans */
const plans = landing.pricing.plans.map((p) => {
  const billing = mock.settings.billing.plans.find((b) => b.key === p.key)
  return { ...p, monthly: billing?.monthly ?? p.monthly, yearly: billing?.yearly ?? p.yearly }
})
const FEATURE_ICON: Record<string, LucideIcon> = {
  "refresh-cw": RefreshCwIcon,
  "receipt-text": ReceiptTextIcon,
  warehouse: WarehouseIcon,
  truck: TruckIcon,
  sparkles: SparklesIcon,
  "shield-check": ShieldCheckIcon,
}
const SOCIAL_ICON: Record<string, LucideIcon> = {
  "message-circle": MessageCircleIcon,
  users: UsersIcon,
  code: CodeIcon,
  mail: MailIcon,
}
/** 分屏①订单表示意：状态文案与语义色取 content/dashboard.md 订单状态表 */
const ORDER_ROWS: readonly { key: string; w: readonly [string, string, string] }[] = [
  { key: "pending_shipment", w: ["w-4/5", "w-3/5", "w-7/10"] },
  { key: "shipped", w: ["w-3/5", "w-7/10", "w-1/2"] },
  { key: "refunding", w: ["w-7/10", "w-1/2", "w-3/5"] },
  { key: "completed", w: ["w-1/2", "w-3/5", "w-7/10"] },
]
/** 分屏②库存条形图：6 条相对高度（mock/landing.json solutions[1].visual「6 条，2 条为 warning 色」），低于安全线（45%）的为 warning，预警 Tag 计数由此得出 */
const INVENTORY_BARS: readonly { h: string; ratio: number }[] = [
  { h: "h-22/25", ratio: 22 / 25 },
  { h: "h-16/25", ratio: 16 / 25 },
  { h: "h-2/5", ratio: 2 / 5 },
  { h: "h-18/25", ratio: 18 / 25 },
  { h: "h-7/25", ratio: 7 / 25 },
  { h: "h-14/25", ratio: 14 / 25 },
]
const SAFETY_RATIO = 0.45
const isLowStockBar = (b: { ratio: number }) => b.ratio < SAFETY_RATIO
const twoDecimals = new Intl.NumberFormat("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** 不可达链接（hifi aria-disabled + data-tip）：保留 href 供语义，点击不跳转，hover / focus 出 Tooltip */
const blockNav = (e: React.MouseEvent) => e.preventDefault()

function TipLink({ tip, children, className, ...props }: React.ComponentProps<"a"> & { tip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a aria-disabled="true" onClick={blockNav} className={cn("cursor-not-allowed", className)} {...props}>
          {children}
        </a>
      </TooltipTrigger>
      <TooltipContent>{tip}</TooltipContent>
    </Tooltip>
  )
}

const disabledTip = () => t("shell.nav.disabled.tip")

/** 锚点滚动偏移：hifi `html { scroll-padding-top: calc(navbar + space.4) }` —— 固定导航下 #main 与每个锚点 section 顶边距导航底 space.4 */
const anchorOffset = "scroll-mt-[calc(var(--size-navbar)+var(--space-4))] [&>section]:scroll-mt-[calc(var(--size-navbar)+var(--space-4))]"

/** Sheet 打开时初始焦点落在右上关闭按钮（hifi openMenu → .js-close-menu.focus()） */
const focusSheetClose = (e: Event) => {
  const close = e.currentTarget instanceof HTMLElement ? e.currentTarget.querySelector<HTMLButtonElement>("[data-slot=sheet-close]") : null
  if (close) {
    e.preventDefault()
    close.focus()
  }
}

/** 品牌：hifi .brand —— mark space.8 + title 字阶，min-h hit */
function Brand({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      href="#top"
      aria-label={t("landing.nav.home")}
      className={cn("inline-flex min-h-hit items-center gap-2 rounded-sm text-role-title whitespace-nowrap text-fg", className)}
      {...props}
    >
      <BrandMark variant="a" className="size-8" />
      <span>{landing.brand.name}</span>
    </a>
  )
}

function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-role-eyebrow text-primary", className)} {...props} />
}

/** 区块头：hifi .sec-head —— prose-max 居中，display-lg 标题（<768 display），lead 副标题 */
function SectionHead({ id, eyebrow, title, subtitle }: { id: string; eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-prose-max text-center max-md:mb-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="mt-3 text-role-display-lg max-md:text-role-display">
        {title}
      </h2>
      {subtitle ? <p className="mt-4 text-role-lead text-fg-muted">{subtitle}</p> : null}
    </div>
  )
}

/** 容器：hifi .wrap —— marketing-max + 两侧 space.6（<768 space.4） */
function Wrap({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[calc(var(--size-marketing-max)+var(--space-6)*2)] px-6 max-md:px-4", className)} {...props} />
}

/** 骨架条：hifi .bar / .bar-strong / .bar-accent */
function Bar({ className, tone = "soft" }: { className?: string; tone?: "soft" | "strong" | "accent" }) {
  return (
    <i
      className={cn(
        "block rounded-full",
        tone === "soft" && "h-2 bg-surface-muted",
        tone === "strong" && "h-3 bg-fg-muted",
        tone === "accent" && "h-3 bg-primary",
        className,
      )}
    />
  )
}

/** Hero 抽象 dashboard（纯 CSS/SVG，令牌色）：顶栏 + 侧栏 + 4 统计卡 + 面积图 + 3 行表格 */
function HeroArt() {
  return (
    <div className="relative before:absolute before:inset-[10%_-8%_-10%_10%] before:rounded-full before:bg-radial-[closest-side] before:from-primary-soft before:to-transparent before:opacity-(--opacity-skeleton-shine) max-md:before:inset-[10%_0_-6%_0]">
      <div role="img" aria-label={t("landing.hero.illustration.aria")} className="relative grid aspect-4/3 grid-rows-[auto_1fr] overflow-hidden rounded-xl border bg-surface shadow-lg max-md:aspect-auto">
        <div aria-hidden className="flex h-10 items-center gap-2 border-b bg-surface px-4">
          <i className="size-dot rounded-full bg-neutral-soft" />
          <i className="size-dot rounded-full bg-neutral-soft" />
          <i className="size-dot rounded-full bg-neutral-soft" />
          <i className="mx-auto h-4 max-w-2/5 flex-1 rounded-full bg-surface-muted" />
        </div>
        <div aria-hidden className="grid min-h-0 grid-cols-[var(--space-12)_1fr]">
          <div className="grid auto-rows-max gap-2 border-r bg-bg px-2 py-3">
            {Array.from({ length: 6 }, (_, i) => (
              <i key={i} className={cn("block h-8 rounded-sm", i === 0 ? "bg-primary-soft" : "bg-surface-muted")} />
            ))}
          </div>
          <div className="grid min-h-0 grid-rows-[auto_1fr_auto] gap-3 bg-bg p-3">
            <div className="grid grid-cols-4 gap-2 max-md:grid-cols-2">
              {(
                [
                  ["w-1/2", "w-7/10", "strong"],
                  ["w-2/5", "w-3/5", "strong"],
                  ["w-1/2", "w-4/5", "accent"],
                  ["w-2/5", "w-1/2", "strong"],
                ] as const
              ).map(([a, b, tone], i) => (
                <div key={i} className="grid gap-2 rounded-md border bg-surface p-3">
                  <Bar className={a} />
                  <Bar className={b} tone={tone} />
                </div>
              ))}
            </div>
            <div className="relative grid min-h-0 grid-rows-[auto_1fr] gap-2 rounded-md border bg-surface p-3">
              <Bar className="w-3/10" />
              <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="block size-full min-h-0 max-md:min-h-20">
                <g className="stroke-chart-grid" strokeWidth="1">
                  <line x1="0" y1="30" x2="400" y2="30" />
                  <line x1="0" y1="60" x2="400" y2="60" />
                  <line x1="0" y1="90" x2="400" y2="90" />
                </g>
                <path className="fill-chart-line-fill" d="M0 92 C 40 88, 60 70, 100 74 S 160 96, 200 60 S 260 40, 300 48 S 360 30, 400 18 V 120 H 0 Z" />
                <path className="fill-none stroke-chart-line" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" d="M0 92 C 40 88, 60 70, 100 74 S 160 96, 200 60 S 260 40, 300 48 S 360 30, 400 18" />
              </svg>
            </div>
            <div className="grid gap-2 rounded-md border bg-surface p-3">
              {(
                [
                  ["w-4/5", "w-3/5", "w-7/10", "bg-warning-soft"],
                  ["w-3/5", "w-7/10", "w-1/2", "bg-primary-soft"],
                  ["w-7/10", "w-1/2", "w-3/5", "bg-success-soft"],
                ] as const
              ).map(([a, b, c, pill], i) => (
                <div key={i} className="grid grid-cols-[3fr_2fr_2fr_auto] items-center gap-3">
                  <Bar className={a} tone="strong" />
                  <Bar className={b} />
                  <Bar className={c} />
                  <i className={cn("block h-4 w-10 rounded-full", pill)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** 分屏视觉面板：hifi .panel（bg + hairline + radius.xl，5/4）> .panel-card（surface + shadow.md） */
function Panel({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div role="img" aria-label={label} className="grid aspect-5/4 overflow-hidden rounded-xl border bg-bg p-8 max-md:aspect-[4/3.6] max-md:p-4">
      <div aria-hidden className={cn("grid min-h-0 content-center gap-3 rounded-lg border bg-surface p-5 shadow-md", className)}>
        {children}
      </div>
    </div>
  )
}

const tblRow = "grid min-h-table-row-compact grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,2fr)_auto] items-center gap-4 border-b last:border-b-0"

function OrdersPanel({ label }: { label: string }) {
  return (
    <Panel label={label}>
      <div className="grid gap-2">
        <div className={cn(tblRow, "min-h-table-header")}>
          <Bar className="w-2/5" />
          <Bar className="w-1/2" />
          <Bar className="w-2/5" />
          <Bar className="w-2/5" />
        </div>
        {ORDER_ROWS.map((r) => (
          <div key={r.key} className={tblRow}>
            <Bar className={r.w[0]} tone="strong" />
            <Bar className={r.w[1]} />
            <Bar className={r.w[2]} />
            <Tag tone={orderStatus[r.key]?.tone} dot={false} className="justify-self-end">
              {orderStatus[r.key]?.label}
            </Tag>
          </div>
        ))}
      </div>
    </Panel>
  )
}

/** 分屏②库存：预警 Tag 文案 = 图中低于安全线的柱数（hifi「2 个 SKU 低于安全线」） */
function InventoryPanel({ label: panelLabel }: { label: string }) {
  const label = t("landing.solutions.inventory.lowStock", { n: INVENTORY_BARS.filter(isLowStockBar).length })
  return (
    <Panel label={panelLabel} className="grid-rows-[auto_1fr_auto]">
      <div className={cn(tblRow, "min-h-table-header")}>
        <Bar className="w-1/2" />
        <Bar className="w-3/10" />
        <i />
        <Tag tone="warning" dot={false}>
          {label}
        </Tag>
      </div>
      <div className="relative grid h-full min-h-0 grid-cols-6 items-end gap-3 pt-4">
        <span className="absolute inset-x-0 border-t border-dashed border-warning" style={{ bottom: `${SAFETY_RATIO * 100}%` }} />
        {INVENTORY_BARS.map((b, i) => (
          <b key={i} className={cn("block rounded-t-sm", b.h, isLowStockBar(b) ? "bg-warning" : "bg-chart-bar")} />
        ))}
      </div>
      <div className="grid grid-cols-6 gap-3">
        {INVENTORY_BARS.map((_, i) => (
          <Bar key={i} />
        ))}
      </div>
    </Panel>
  )
}

/** 分屏③对话：提问与来源取 mock/chat.json c_1 首轮；答复按 content 模板填 skus.json 缺货最多项（名称 / 编码 / 缺货单数 / 库存 / 安全线，与 hifi 同源数字） */
function AssistantPanel({ label }: { label: string }) {
  const thread = mock.chat.messages.c_1
  const ask = thread.find((m) => m.role === "user")
  const answer = thread.find((m) => m.role === "assistant")
  const topSku = [...mock.skus.items].sort((a, b) => b.weekStockoutOrders - a.weekStockoutOrders)[0]
  const [beforeSku, afterSku] = t("landing.solutions.assistant.answer", { name: topSku.name, n: topSku.weekStockoutOrders, stock: topSku.stock, safety: topSku.safetyStock }).split("{sku}")
  const source = answer && "sources" in answer ? answer.sources?.filter((s) => s.type === "order").at(-1) : undefined
  return (
    <Panel label={label} className="content-center">
      <div className="max-w-[85%] justify-self-end rounded-lg rounded-br-xs bg-primary px-4 py-3 text-role-body text-on-primary">{ask && "text" in ask ? ask.text : null}</div>
      <div className="max-w-[85%] justify-self-start rounded-lg rounded-bl-xs bg-surface-muted px-4 py-3 text-role-body text-fg">
        {beforeSku}
        <span className="font-mono">{topSku.sku}</span>
        {afterSku}
      </div>
      {source ? (
        <span className="inline-flex h-chip items-center gap-1 justify-self-start rounded-full border bg-surface px-3 text-role-code text-fg-muted [&_svg]:size-icon-sm [&_svg]:text-primary">
          <LinkIcon />
          {source.label}
        </span>
      ) : null}
    </Panel>
  )
}

const navLink = "inline-flex min-h-hit items-center rounded-md px-3 text-role-label whitespace-nowrap text-fg-muted transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted hover:text-fg aria-[current=true]:text-fg"

export default function LandingPage() {
  const { state, open, set } = useScreenState(STATES)
  const [params] = useSearchParams()
  const { hash } = useLocation()
  const { resolved, toggle } = useTheme()
  const forced = params.has("state")
  const cycle: Cycle = params.get("cycle") === "yearly" ? "yearly" : "monthly"
  const yearly = cycle === "yearly"
  const urlMenuOpen = open === "menu"
  /** 菜单开关镜像到本地 state：路由 setSearchParams 走 transition，否则 Sheet 关闭会被后续键盘事件拖延 */
  const [menu, setMenuState] = React.useState({ url: urlMenuOpen, value: urlMenuOpen })
  if (menu.url !== urlMenuOpen) setMenuState({ url: urlMenuOpen, value: urlMenuOpen })
  const menuOpen = menu.value
  const [autoScrolled, setAutoScrolled] = React.useState(false)
  const scrolled = forced ? state === "scrolled" : autoScrolled

  React.useEffect(() => {
    if (forced) return
    const onScroll = () => setAutoScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [forced])

  React.useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-state", scrolled ? "scrolled" : "default")
    root.setAttribute("data-cycle", cycle)
    if (menuOpen) root.setAttribute("data-open", "menu")
    else root.removeAttribute("data-open")
    return () => {
      root.removeAttribute("data-state")
      root.removeAttribute("data-cycle")
      root.removeAttribute("data-open")
    }
  }, [scrolled, cycle, menuOpen])

  const setCycle = (c: Cycle) => set({ cycle: c === "monthly" ? null : c })
  const setMenu = (o: boolean) => {
    setMenuState({ url: urlMenuOpen, value: o })
    set({ open: o ? "menu" : null })
  }
  const themeLabel = resolved === "dark" ? t("shell.theme.toLight") : t("shell.theme.toDark")
  const ThemeIcon = resolved === "dark" ? SunIcon : MoonIcon
  const isCurrent = (href: string) => (hash === href ? true : undefined)
  const [featuresTitle, solutionsTitle, pricingTitle, testimonialsTitle, faqTitle] = ["features-title", "solutions-title", "pricing-title", "testimonials-title", "faq-title"]

  return (
    <div data-slot="landing" className="min-h-dvh bg-surface text-fg">
      <a
        href="#main"
        className="absolute top-2 left-2 z-50 inline-flex min-h-hit -translate-y-[200%] items-center rounded-md bg-surface px-4 py-2 text-role-label text-link shadow-md focus-visible:translate-y-0"
      >
        {t("landing.skip")}
      </a>

      {/* ① Navbar：默认透明覆盖在 Hero 渐变上；scrolled → surface 实底 + hairline + shadow.sm */}
      <header
        data-slot="landing-nav"
        data-state={scrolled ? "scrolled" : "default"}
        className={cn(
          "fixed inset-x-0 top-0 z-20 h-navbar border-b border-transparent bg-transparent transition-[background-color,border-color,box-shadow] duration-(--motion-base) ease-std",
          scrolled && "border-border bg-surface shadow-sm",
        )}
      >
        <Wrap className="flex h-full items-center gap-6 max-lg:gap-3">
          <Brand />
          <nav aria-label={t("landing.nav.aria")} className="mx-auto flex items-center gap-1 max-lg:hidden">
            {landing.nav.map((n) => (
              <a key={n.key} href={n.href} aria-current={isCurrent(n.href)} className={navLink}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 max-lg:ml-auto">
            <IconButton label={themeLabel} onClick={toggle} className="max-lg:hidden">
              <ThemeIcon />
            </IconButton>
            <Button variant="ghost" className="text-fg-muted hover:not-disabled:bg-surface-muted hover:not-disabled:text-fg max-lg:hidden" asChild>
              <Link to={landing.cta.loginHref}>{t("landing.nav.login")}</Link>
            </Button>
            <Button asChild>
              <TipLink href={landing.cta.trialHref} tip={disabledTip()}>
                {t("landing.nav.trial")}
              </TipLink>
            </Button>
            <IconButton label={t("landing.nav.menu.open")} aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenu(true)} className="hidden max-lg:inline-flex">
              <MenuIcon />
            </IconButton>
          </div>
          {scrolled ? <span className="sr-only">{t("landing.nav.sticky")}</span> : null}
        </Wrap>
      </header>

      <main id="main" className={anchorOffset}>
        {/* ② Hero */}
        <section id="top" aria-labelledby="hero-title" className="relative overflow-clip bg-linear-to-b from-surface-brand from-0% to-surface to-85% pt-[calc(var(--size-navbar)+var(--space-16))] pb-20 max-lg:pt-[calc(var(--size-navbar)+var(--space-12))] max-lg:pb-16 max-md:pt-[calc(var(--size-navbar)+var(--space-10))] max-md:pb-12">
          <Wrap className="grid grid-cols-[minmax(0,6fr)_minmax(0,6fr)] items-center gap-16 max-lg:grid-cols-[minmax(0,1fr)] max-lg:gap-12 max-md:gap-10">
            <div>
              <Eyebrow>{t("landing.hero.eyebrow")}</Eyebrow>
              <h1 id="hero-title" className="mt-4 text-role-hero wrap-anywhere break-keep text-balance max-xl:text-role-display-lg max-md:wrap-normal max-md:break-normal">
                {landing.hero.title}
              </h1>
              <p className="mt-6 max-w-prose-max text-lg leading-body text-fg-muted max-md:text-md">{landing.hero.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3 max-md:[&>*]:flex-[1_1_100%]">
                <Button size="lg" asChild>
                  <TipLink href={landing.cta.trialHref} tip={disabledTip()}>
                    {landing.hero.primary}
                  </TipLink>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <TipLink href="#faq" tip={disabledTip()}>
                    {landing.hero.secondary}
                  </TipLink>
                </Button>
              </div>
              <p className="mt-3 text-role-caption text-fg-muted">{t("landing.hero.noCard")}</p>
              <div className="mt-8 flex items-center gap-3">
                <ul aria-label={t("landing.hero.avatars.aria")} className="flex">
                  {landing.hero.socialProof.avatars.map((a, i) => (
                    <li key={a.initial} className={cn(i > 0 && "-ml-2")}>
                      <Avatar initial={a.initial} hue={a.hue} aria-hidden className="border-(length:--border-width-focus) border-surface shadow-sm" />
                    </li>
                  ))}
                </ul>
                <span className="text-role-label text-fg-muted tabular-nums">{landing.hero.socialProof.label}</span>
              </div>
            </div>
            <HeroArt />
          </Wrap>
        </section>

        {/* ③ 客户 */}
        <section id="customers" aria-labelledby="customers-title" className="border-y py-12 max-md:py-8">
          <Wrap>
            <h2 id="customers-title" className="text-center text-role-label text-fg-muted">
              {t("landing.customers.title")}
            </h2>
            <ul aria-label={t("landing.customers.aria")} className="mt-8 grid grid-cols-6 gap-6 max-lg:grid-cols-3 max-md:mt-6 max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-2">
              {landing.customers.map((c) => (
                <li key={c.name} className="flex min-h-control-lg items-center justify-center text-center text-role-heading tracking-wide whitespace-nowrap text-fg-muted max-md:min-h-hit max-md:text-role-title">
                  {c.wordmark === c.name ? (
                    c.name
                  ) : (
                    <>
                      <span aria-hidden>{c.wordmark}</span>
                      <span className="sr-only">{c.name}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </Wrap>
        </section>

        {/* ④ 特性 */}
        <section id="features" aria-labelledby={featuresTitle} className="py-20 max-md:py-12">
          <Wrap>
            <SectionHead id={featuresTitle} eyebrow={t("landing.features.eyebrow")} title={t("landing.features.title")} subtitle={t("landing.features.subtitle")} />
            <ul className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
              {landing.features.map((f) => {
                const Icon = FEATURE_ICON[f.icon] ?? SparklesIcon
                return (
                  <li key={f.title} className="flex">
                    <Card className="w-full mobile:p-6">
                      <span aria-hidden className="inline-grid size-control-md place-items-center rounded-md bg-primary-soft text-on-primary-soft [&_svg]:size-icon-md">
                        <Icon />
                      </span>
                      <h3 className="mt-5 text-role-heading">{f.title}</h3>
                      <p className="mt-2 text-role-body text-fg-muted">{f.description}</p>
                    </Card>
                  </li>
                )
              })}
            </ul>
          </Wrap>
        </section>

        {/* ⑤ 分屏 */}
        <section id="solutions" aria-labelledby={solutionsTitle} className="bg-bg py-20 max-md:py-12">
          <Wrap>
            <SectionHead id={solutionsTitle} eyebrow={t("landing.solutions.eyebrow")} title={t("landing.solutions.title")} />
            <div className="grid gap-20 max-md:gap-12">
              {landing.solutions.map((s, i) => {
                const label = t("landing.solutions.visual.aria", { title: s.title })
                const visual = i === 0 ? <OrdersPanel label={label} /> : i === 1 ? <InventoryPanel label={label} /> : <AssistantPanel label={label} />
                return (
                  <article key={s.title} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-16 max-lg:gap-12 max-md:grid-cols-[minmax(0,1fr)] max-md:gap-6">
                    <div>{visual}</div>
                    <div className={cn(i % 2 === 0 && "-order-1 max-md:order-none")}>
                      <Eyebrow>{s.eyebrow}</Eyebrow>
                      <h3 className="mt-3 text-role-display max-md:text-role-heading">{s.title}</h3>
                      <p className="mt-4 text-role-lead text-fg-muted max-md:text-role-body">{s.description}</p>
                      <ul className="mt-6 grid gap-3">
                        {s.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-3 text-role-lead max-md:text-role-body [&_svg]:mt-1 [&_svg]:size-icon-sm [&_svg]:shrink-0 [&_svg]:text-primary">
                            <CheckIcon aria-hidden />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                      <a href="#faq" className="mt-6 inline-flex min-h-hit items-center gap-1 rounded-xs text-role-label text-link hover:underline hover:underline-offset-4 [&_svg]:size-icon-sm">
                        {t("landing.solutions.learnMore")}
                        <ArrowRightIcon aria-hidden />
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>
          </Wrap>
        </section>

        {/* ⑥ 数据带 */}
        <section aria-label={t("landing.stats.aria")} className="border-y py-16 max-md:py-12">
          <Wrap>
            <ul className="grid grid-cols-4 gap-8 max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-8">
              {landing.stats.map((s) => (
                <li key={s.label} className="text-center">
                  <strong className="block text-role-display-lg text-fg tabular-nums max-md:text-role-display">{s.value}</strong>
                  <span className="mt-2 block text-role-label text-fg-muted">{s.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center text-role-caption text-fg-muted">{t("landing.stats.footnote")}</p>
          </Wrap>
        </section>

        {/* ⑦ 定价：月付 / 年付切换，价格来自 settings.json billing.plans */}
        <section id="pricing" aria-labelledby={pricingTitle} className="py-20 max-md:py-12">
          <Wrap>
            <SectionHead id={pricingTitle} eyebrow={t("landing.pricing.eyebrow")} title={t("landing.pricing.title")} subtitle={t("landing.pricing.subtitle")} />
            <div className="-mt-4 mb-12 flex items-center justify-center gap-2 max-md:-mt-2 max-md:mb-8 max-md:flex-wrap">
              <button type="button" aria-pressed={!yearly} onClick={() => setCycle("monthly")} className={cn(navLink, "aria-pressed:text-fg")}>
                {landing.pricing.toggle.monthly}
              </button>
              <Switch aria-label={t("landing.pricing.toggle.aria")} checked={yearly} onCheckedChange={(v) => setCycle(v ? "yearly" : "monthly")} />
              <button type="button" aria-pressed={yearly} onClick={() => setCycle("yearly")} className={cn(navLink, "gap-2 aria-pressed:text-fg")}>
                {landing.pricing.toggle.yearly}
                <Tag tone="success" dot={false}>
                  {landing.pricing.toggle.yearlyBadge}
                </Tag>
              </button>
            </div>
            <ul className="grid grid-cols-3 items-stretch gap-6 pt-3 max-lg:grid-cols-2 max-lg:[&>li:last-child:nth-child(odd)]:col-span-full max-lg:[&>li:last-child:nth-child(odd)]:w-[calc(50%-var(--space-3))] max-lg:[&>li:last-child:nth-child(odd)]:justify-self-center max-md:grid-cols-1 max-md:gap-8 max-md:[&>li:last-child:nth-child(odd)]:w-auto max-md:[&>li:last-child:nth-child(odd)]:justify-self-stretch">
              {plans.map((p) => (
                <li key={p.key} data-plan={p.key} className={cn("flex", p.recommended && "max-md:-order-1")}>
                  <PricingCard
                    name={p.label}
                    description={p.description}
                    badgeAlign="center"
                    price={formatCurrencyWhole(yearly ? p.yearly : p.monthly)}
                    suffix={yearly ? t("landing.pricing.perYear") : t("landing.pricing.perMonth")}
                    note={<span className="block min-h-[calc(var(--font-size-xs)*var(--font-line-height-snug))] tabular-nums">{yearly ? t("landing.pricing.yearlyPerMonth", { n: twoDecimals.format(p.yearly / 12) }) : null}</span>}
                    features={p.features.map((label) => ({ label, included: true }))}
                    featureLabels={{ included: t("landing.pricing.included"), excluded: t("landing.pricing.included") }}
                    recommended={p.recommended}
                    recommendedLabel={t("landing.pricing.recommended")}
                    className={cn("w-full p-8 mobile:p-8 mobile:max-md:p-6 [&_h3]:text-role-heading [&_header_.text-role-display]:text-role-display-lg [&_header]:gap-1 [&_header>p:nth-of-type(2)]:mt-5 [&>ul]:mb-6 [&_ul]:gap-3 [&_ul_svg]:text-primary", p.recommended && "shadow-lg")}
                    action={
                      <Button variant={p.recommended ? "primary" : "secondary"} block asChild>
                        <TipLink href={p.key === "business" ? "#faq" : landing.cta.trialHref} tip={disabledTip()}>
                          {p.cta}
                        </TipLink>
                      </Button>
                    }
                  />
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center text-role-body text-fg-muted">
              {landing.pricing.footnote}
              <TipLink href="#pricing" tip={disabledTip()} className="ml-2 inline-flex min-h-hit items-center gap-1 rounded-xs text-role-label text-link hover:underline hover:underline-offset-4">
                {t("landing.pricing.compare")}
              </TipLink>
            </p>
          </Wrap>
        </section>

        {/* ⑧ 评价 */}
        <section id="testimonials" aria-labelledby={testimonialsTitle} className="bg-bg py-20 max-md:py-12">
          <Wrap>
            <SectionHead id={testimonialsTitle} eyebrow={t("landing.testimonials.eyebrow")} title={t("landing.testimonials.title")} />
            <ul aria-label={t("landing.testimonials.aria")} className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
              {landing.testimonials.map((q) => (
                <li key={q.name} aria-label={t("landing.testimonials.quote.aria", { name: q.name, company: q.company, title: q.title })} className="flex">
                  <Card className="grid w-full grid-rows-[auto_1fr_auto] gap-4 mobile:p-6">
                    <QuoteIcon aria-hidden className="size-icon-md text-primary" />
                    <blockquote className="text-role-lead text-fg">{q.quote}</blockquote>
                    <footer className="flex items-center gap-3 border-t pt-4">
                      <Avatar initial={q.initial} hue={q.hue} aria-hidden />
                      <span>
                        <span className="block text-role-label">{q.name}</span>
                        <span className="mt-1 block text-role-caption text-fg-muted">
                          {q.title} · {q.company}
                        </span>
                      </span>
                    </footer>
                  </Card>
                </li>
              ))}
            </ul>
          </Wrap>
        </section>

        {/* ⑨ FAQ：单开手风琴，默认展开第一项 */}
        <section id="faq" aria-labelledby={faqTitle} className="py-20 max-md:py-12">
          <Wrap>
            <SectionHead id={faqTitle} eyebrow={t("landing.faq.eyebrow")} title={t("landing.faq.title")} />
            <Accordion type="single" collapsible defaultValue="faq-0" aria-label={t("landing.faq.aria")} className="mx-auto max-w-[calc(var(--size-prose-max)+var(--space-20)*2)] rounded-none border-x-0 border-t border-b-0">
              {landing.faq.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`} className="border-t-0 border-b">
                  <AccordionTrigger className="min-h-[calc(var(--size-hit)+var(--space-4))] gap-4 rounded-md px-2 py-3 text-role-title hover:not-disabled:bg-transparent hover:not-disabled:text-primary [&_svg]:duration-(--motion-base)">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-prose-max px-2 pb-5 text-role-lead">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-6 flex justify-center">
              <TipLink href="#faq" tip={disabledTip()} className="inline-flex min-h-hit items-center gap-1 rounded-xs text-role-label text-link hover:underline hover:underline-offset-4 [&_svg]:size-icon-sm">
                {t("landing.faq.more")}
                <ArrowRightIcon aria-hidden />
              </TipLink>
            </div>
          </Wrap>
        </section>

        {/* ⑩ CTA */}
        <section aria-label={t("landing.cta.aria")} className="bg-primary text-on-primary [&_:focus-visible]:outline-focus-ring-on-primary">
          <Wrap className="grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] items-center gap-12 py-16 max-lg:grid-cols-[minmax(0,1fr)] max-lg:gap-8 max-lg:py-12">
            <div>
              <h2 className="text-role-display-lg wrap-anywhere break-keep max-md:text-role-display max-md:wrap-normal max-md:break-normal">{landing.ctaBanner.title}</h2>
              <p className="mt-3 text-role-lead text-on-primary-muted">{landing.ctaBanner.subtitle}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-3 max-lg:justify-start max-md:justify-stretch max-md:[&>*]:flex-[1_1_100%]">
              <Button size="lg" className="border-on-primary bg-on-primary text-primary hover:not-disabled:border-primary-soft hover:not-disabled:bg-primary-soft hover:not-disabled:text-on-primary-soft" asChild>
                <TipLink href={landing.cta.trialHref} tip={disabledTip()}>
                  {landing.ctaBanner.primary}
                </TipLink>
              </Button>
              <Button size="lg" variant="ghost" className="border-on-primary-muted px-6 text-on-primary hover:not-disabled:border-on-primary hover:not-disabled:bg-on-primary/12 hover:not-disabled:text-on-primary" asChild>
                <TipLink href="#faq" tip={disabledTip()}>
                  {landing.ctaBanner.secondary}
                </TipLink>
              </Button>
            </div>
          </Wrap>
        </section>
      </main>

      {/* ⑪ Footer */}
      <footer aria-label={t("landing.footer.aria")} className="border-t bg-bg pt-16 pb-8 max-md:pt-12 max-md:pb-6">
        <Wrap>
          <div className="grid grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))] gap-8 max-lg:grid-cols-[repeat(4,minmax(0,1fr))] max-lg:gap-x-6 max-lg:gap-y-8 max-md:grid-cols-[repeat(2,minmax(0,1fr))] max-md:gap-x-4 max-md:gap-y-6">
            <div className="max-lg:col-span-full">
              <Brand />
              <p className="mt-2 text-role-label text-fg">{landing.brand.tagline}</p>
              <p className="mt-4 max-w-[calc(var(--size-prose-max)/2)] text-role-body text-fg-muted">{t("landing.footer.brand.description")}</p>
            </div>
            {landing.footer.columns.map((col, i) => (
              <nav key={col.title} aria-labelledby={`fc-${i}`}>
                <h3 id={`fc-${i}`} className="flex min-h-hit items-center text-role-label text-fg">
                  {col.title}
                </h3>
                <ul>
                  {col.links.map((l) => (
                    <li key={l}>
                      <TipLink href="#top" tip={t("landing.footer.links.disabled")} className="inline-flex min-h-hit min-w-hit items-center rounded-xs text-role-body text-fg-muted transition-colors duration-(--motion-fast) ease-std hover:text-fg">
                        {l}
                      </TipLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6 max-md:mt-8 max-md:flex-col max-md:items-start">
            <p className="text-role-caption text-fg-muted">{landing.footer.copyright}</p>
            <div className="flex flex-wrap items-center gap-4 max-md:w-full max-md:justify-between">
              <ul aria-label={t("landing.footer.social.aria")} className="flex gap-1">
                {landing.footer.social.map((s) => {
                  const Icon = SOCIAL_ICON[s.icon] ?? LinkIcon
                  return (
                    <li key={s.key}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <IconButton label={s.label} asChild>
                            <a href="#top" aria-disabled="true" onClick={blockNav} className="cursor-not-allowed">
                              <Icon />
                            </a>
                          </IconButton>
                        </TooltipTrigger>
                        <TooltipContent>{t("landing.footer.links.disabled")}</TooltipContent>
                      </Tooltip>
                    </li>
                  )
                })}
              </ul>
              <label className="inline-flex items-center">
                <span className="sr-only">{t("landing.footer.language.label")}</span>
                <Select name="lang" defaultValue={landing.footer.languages[0].key} leading={<GlobeIcon className="size-icon-sm" />} wrapClassName="w-auto" className="text-role-label">
                  {landing.footer.languages.map((l) => (
                    <option key={l.key} value={l.key}>
                      {l.label}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
          </div>
        </Wrap>
      </footer>

      {/* Sheet（375 / 768 菜单；?open=menu）：Radix Dialog 提供 Esc / 遮罩关闭、焦点圈定与归还 */}
      <Sheet open={menuOpen} onOpenChange={setMenu}>
        <SheetContent
          side="right"
          title={t("landing.nav.menu.title")}
          closeLabel={t("landing.nav.menu.close")}
          className="w-sheet max-w-full [&_[data-slot=sheet-close]]:top-[calc((var(--size-navbar)-var(--size-hit))/2)] [&_[data-slot=sheet-close]]:right-3"
          onOpenAutoFocus={focusSheetClose}
        >
          <div className="flex h-navbar items-center border-b pr-3 pl-4">
            <span aria-hidden className="inline-flex min-h-hit items-center gap-2 text-role-title whitespace-nowrap text-fg">
              <BrandMark variant="a" className="size-8" />
              <span>{landing.brand.name}</span>
            </span>
          </div>
          <nav aria-label={t("landing.nav.aria")} className="flex-1 overflow-y-auto px-2 py-3">
            {landing.nav.map((n) => (
              <a
                key={n.key}
                href={n.href}
                aria-current={isCurrent(n.href)}
                onClick={() => setMenu(false)}
                className="flex min-h-control-lg items-center rounded-md px-3 text-role-title text-fg transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted aria-[current=true]:text-primary"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="grid gap-3 border-t p-4">
            <Button size="lg" block asChild>
              <TipLink href={landing.cta.trialHref} tip={disabledTip()}>
                {landing.cta.trial}
              </TipLink>
            </Button>
            <Button size="lg" variant="secondary" block asChild>
              <Link to={landing.cta.loginHref}>{landing.cta.login}</Link>
            </Button>
            <button
              type="button"
              aria-label={themeLabel}
              onClick={toggle}
              className="flex min-h-hit items-center justify-between gap-3 rounded-md px-3 text-role-label text-fg-muted transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted hover:text-fg [&_svg]:size-icon-md"
            >
              <span>{themeLabel}</span>
              <ThemeIcon aria-hidden />
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
