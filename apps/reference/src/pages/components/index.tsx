import * as React from "react"
import { useSearchParams } from "react-router-dom"
import { cn } from "@/lib/cn"
import { ArrowUpIcon, ChartPieIcon, ChevronDownIcon, ClockAlertIcon, ClockIcon, MonitorIcon, MoonIcon, PackageSearchIcon, SearchXIcon, SparklesIcon, SunIcon, ZapIcon } from "lucide-react"

import { BrandMark } from "@/components/composed/brand"
import { CodeBlock } from "@/components/composed/code-block"
import { SearchInput } from "@/components/composed/search-input"
import { SuggestionChip } from "@/components/composed/chat"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Segmented, SegmentedItem } from "@/components/ui/segmented"
import { Select } from "@/components/ui/select"
import { toast } from "@/components/ui/sonner"
import { Switch } from "@/components/ui/switch"
import { useTheme, type Theme } from "@/components/theme-provider"
import { t } from "@/data/content"
import { channelLabel, mock } from "@/data/mock"
import { formatCurrency, formatCurrencyWhole, formatDateTime, formatTime } from "@/lib/format"
import { tokenMs, useBelowWidth } from "@/lib/media"

import { AlertDemo, AvatarDemo, ButtonDemo, CardDemo, ChartDemo, CheckboxDemo, FeedbackDemo, IconButtonDemo, InputDemo, ListDemo, NavDemo, OverlayDemo, TabsDemo, TableDemo, TagDemo } from "./demos"
import { DemoBox, GRID_2, GRID_3, MATRIX_ROW, MATRIX_ROW_TH, MATRIX_TD, MATRIX_TH, MATRIX_WRAP, Stage, StageCol } from "./kit"
import { ComposedSection, FormControlsSection, LayoutSection, NavExtras, OverlayExtras } from "./round2"
import { snippets, type Snippet } from "./snippets"

export const title = "components"

const K = (key: string, vars?: Record<string, string | number>) => t(`components.${key}`, vars)

/** 类别顺序 = content/components.md「类别」表 = hifi 10 个 <section class="cat"> */
const CATS = [
  { id: "typography", key: "typography" },
  { id: "button", key: "button" },
  { id: "form-controls", key: "formControls" },
  { id: "data-display", key: "dataDisplay" },
  { id: "feedback", key: "feedback" },
  { id: "navigation", key: "navigation" },
  { id: "layout", key: "layout" },
  { id: "theme", key: "theme" },
  { id: "onboarding", key: "onboarding" },
  { id: "composed", key: "composed" },
] as const

const THEMES: { value: Theme; label: string; Icon: typeof SunIcon }[] = [
  { value: "light", label: K("theme.toLight"), Icon: SunIcon },
  { value: "dark", label: K("theme.toDark"), Icon: MoonIcon },
  { value: "system", label: K("theme.system"), Icon: MonitorIcon },
]

const componentCount = snippets.reduce((n, s) => n + s.name.split("·").length, 0)

/* ---------------- 主题类：字阶 / 色板 / 间距圆角阴影动效 ---------------- */

const TYPE_ROLES = [
  ["hero", "text-role-hero"],
  ["display-lg", "text-role-display-lg tabular-nums"],
  ["display", "text-role-display tabular-nums"],
  ["heading", "text-role-heading"],
  ["title", "text-role-title"],
  ["lead", "text-role-lead text-fg-muted"],
  ["body", "text-role-body"],
  ["label", "text-role-label"],
  ["caption", "text-role-caption text-fg-muted"],
  ["eyebrow", "text-role-eyebrow text-primary"],
  ["code", "font-mono text-role-code"],
] as const

const HIERARCHY_ORDER = mock.ordersAll[14]
const TYPE_SAMPLES: Record<(typeof TYPE_ROLES)[number][0], string> = {
  hero: mock.landing.hero.title,
  "display-lg": formatCurrency(mock.series.month.channels.total),
  display: formatCurrencyWhole(mock.series.month.channels.total),
  heading: t("dashboard.greeting"),
  title: t("dashboard.chart.title"),
  lead: mock.landing.hero.subtitle.split("，")[0],
  body: mock.activity[0].text,
  label: K("sample.input.label"),
  caption: K("sample.input.description"),
  eyebrow: K("type.sample.eyebrow"),
  code: `${mock.orders[0].id} · ${mock.purchaseForm.poNumberNext}`,
}

function TypographyDemo() {
  return (
    <>
      <div className={MATRIX_WRAP} tabIndex={0} role="region" aria-label={K("type.caption")}>
        <table className="w-full border-collapse">
          <caption className="pb-3 text-left text-role-caption text-fg-muted">{K("type.caption")}</caption>
          <thead>
            <tr>
              <th scope="col" className={MATRIX_TH}>{K("type.col.token")}</th>
              <th scope="col" className={MATRIX_TH}>{K("type.col.sample")}</th>
              <th scope="col" className={MATRIX_TH}>{K("type.col.usage")}</th>
            </tr>
          </thead>
          <tbody>
            {TYPE_ROLES.map(([role, cls]) => (
              <tr key={role} className={MATRIX_ROW}>
                <th scope="row" className={MATRIX_ROW_TH}>
                  {role}
                  <span className="block font-mono text-role-caption font-regular text-fg-muted">typography.{role}</span>
                </th>
                <td className={cn(MATRIX_TD, "w-full min-w-[calc(var(--size-content-max)/5)]")}>
                  <span className={cn("block max-w-[calc(var(--size-content-max)/2)] truncate mobile:max-w-[calc(var(--size-content-max)/6)]", cls)}>{TYPE_SAMPLES[role]}</span>
                </td>
                <td className={cn(MATRIX_TD, "text-role-caption text-fg-muted")}>{K(`type.usage.${role}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DemoBox caption={K("type.hierarchy")} className="gap-2 self-stretch">
        <p className="text-role-title">{HIERARCHY_ORDER.items[0].name}</p>
        <p className="text-role-body">
          {HIERARCHY_ORDER.items.map((it) => `${it.name} ×${it.qty}`).join("、")} — {formatCurrency(HIERARCHY_ORDER.amount)}
        </p>
        <p className="text-role-caption text-fg-muted">
          {formatDateTime(HIERARCHY_ORDER.placedAt)} · {channelLabel(HIERARCHY_ORDER.channel)} · {HIERARCHY_ORDER.warehouse}
        </p>
      </DemoBox>
    </>
  )
}

const SWATCH_GROUPS = [
  {
    key: "base",
    items: [
      ["bg", "bg-bg"],
      ["surface", "bg-surface"],
      ["surface-muted", "bg-surface-muted"],
      ["surface-raised", "bg-surface-raised"],
      ["surface-brand", "bg-surface-brand"],
      ["border", "bg-border"],
      ["border-strong", "bg-border-strong"],
      ["fg", "bg-fg"],
      ["fg-muted", "bg-fg-muted"],
      ["fg-disabled", "bg-fg-disabled"],
      ["bg-inverse", "bg-bg-inverse"],
      ["fg-inverse", "bg-fg-inverse"],
    ],
  },
  {
    key: "semantic",
    items: [
      ["primary", "bg-primary"],
      ["primary-hover", "bg-primary-hover"],
      ["primary-active", "bg-primary-active"],
      ["primary-soft", "bg-primary-soft"],
      ["on-primary", "bg-on-primary"],
      ["on-primary-soft", "bg-on-primary-soft"],
      ["success", "bg-success"],
      ["success-soft", "bg-success-soft"],
      ["warning", "bg-warning"],
      ["warning-soft", "bg-warning-soft"],
      ["danger", "bg-danger"],
      ["danger-soft", "bg-danger-soft"],
      ["info", "bg-info"],
      ["neutral-soft", "bg-neutral-soft"],
      ["link", "bg-link"],
      ["focus-ring", "bg-focus-ring"],
      ["skeleton", "bg-skeleton"],
      ["overlay", "bg-overlay"],
      ["chart-1", "bg-chart-1"],
      ["chart-2", "bg-chart-2"],
      ["chart-3", "bg-chart-3"],
      ["chart-4", "bg-chart-4"],
      ["chart-5", "bg-chart-5"],
      ["chart-line", "bg-chart-line"],
      ["chart-bar", "bg-chart-bar"],
      ["chart-grid", "bg-chart-grid"],
    ],
  },
] as const

const CHART_KEYS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] as const
const swatchUsage = (name: string) => {
  const i = CHART_KEYS.indexOf(name as (typeof CHART_KEYS)[number])
  return i > -1 ? (mock.meta.channels[i]?.label ?? name) : K(`swatch.${name}`)
}

const SWATCH = "h-[calc(var(--size-hit)+var(--space-2))]"
const SCROLL_MT = "scroll-mt-[calc(var(--size-topbar)+var(--size-hit)+var(--space-8))] mobile:scroll-mt-[calc(var(--size-hit)*2+var(--size-control-md)+var(--space-8)+var(--space-4))]"

function ColorDemo() {
  return (
    <>
      {SWATCH_GROUPS.map((g) => (
        <DemoBox key={g.key} caption={K(`swatch.group.${g.key}`)}>
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(calc(var(--size-content-max)/8),1fr))] gap-3 mobile:grid-cols-3">
            {g.items.map(([name, cls]) => (
              <div key={name} className="flex min-w-0 flex-col gap-2">
                <i aria-hidden className={cn("block rounded-md border border-border", SWATCH, cls)} />
                <b className="truncate font-mono text-role-caption font-regular text-fg">{name}</b>
                <span className="truncate text-role-caption text-fg-muted">{swatchUsage(name)}</span>
              </div>
            ))}
          </div>
        </DemoBox>
      ))}
    </>
  )
}

const SPACES = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20] as const
const RADII = { xs: "rounded-xs", sm: "rounded-sm", md: "rounded-md", lg: "rounded-lg", xl: "rounded-xl", full: "rounded-full" } as const
const SHADOWS = { sm: "shadow-sm", md: "shadow-md", lg: "shadow-lg" } as const
const MOTIONS = ["fast", "base", "slow"] as const

function ScaleDemo() {
  return (
    <div className="grid w-full gap-6 lg:grid-cols-2">
      <div className={MATRIX_WRAP} tabIndex={0} role="region" aria-label={K("scale.space.caption")}>
        <table className="w-full border-collapse">
          <caption className="pb-3 text-left text-role-caption text-fg-muted">{K("scale.space.caption")}</caption>
          <thead>
            <tr>
              <th scope="col" className={MATRIX_TH}>{K("type.col.token")}</th>
              <th scope="col" className={MATRIX_TH}>{K("scale.col.demo")}</th>
              <th scope="col" className={MATRIX_TH}>{K("type.col.usage")}</th>
            </tr>
          </thead>
          <tbody>
            {SPACES.map((n) => (
              <tr key={n} className={MATRIX_ROW}>
                <th scope="row" className={cn(MATRIX_ROW_TH, "font-mono font-regular")}>space-{n}</th>
                <td className={cn(MATRIX_TD, "w-full")}>
                  <i aria-hidden className="block h-3 rounded-xs bg-primary" style={{ width: `var(--space-${n})` }} />
                </td>
                <td className={cn(MATRIX_TD, "text-role-caption text-fg-muted")}>{K(`scale.space.${n}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-md border border-border bg-bg p-4">
          <span className="text-role-caption text-fg-muted">{K("scale.radius")}</span>
          <div className="flex flex-wrap gap-4">
            {Object.entries(RADII).map(([r, cls]) => (
              <div key={r} className="flex flex-col items-center gap-2">
                <i aria-hidden className={cn("block w-[calc(var(--size-hit)+var(--space-2))] border border-border-strong bg-surface-muted", SWATCH, cls)} />
                <b className="font-mono text-role-caption font-regular text-fg-muted">{r}</b>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-md border border-border bg-bg p-4">
          <span className="text-role-caption text-fg-muted">{K("scale.shadow")}</span>
          <div className="flex flex-wrap gap-6">
            {Object.entries(SHADOWS).map(([sh, cls]) => (
              <div key={sh} className="flex flex-col items-center gap-2">
                <i aria-hidden className={cn("block w-[calc((var(--size-hit)+var(--space-2))*2)] rounded-md bg-surface", SWATCH, cls)} />
                <b className="font-mono text-role-caption font-regular text-fg-muted">{K(`scale.shadow.${sh}`)}</b>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-md border border-border bg-bg p-4">
          <span className="text-role-caption text-fg-muted">{K("scale.motion")}</span>
          {MOTIONS.map((m) => (
            <div key={m} className="group flex items-center gap-3">
              <b className="w-hit font-mono text-role-caption font-regular text-fg-muted">{m}</b>
              <i aria-hidden className="block size-icon-lg rounded-full bg-primary transition-transform ease-std group-hover:translate-x-8" style={{ transitionDuration: `var(--motion-${m})` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const SUGGESTION_ICONS: Record<string, typeof SunIcon> = {
  "package-search": PackageSearchIcon,
  "clock-alert": ClockAlertIcon,
  zap: ZapIcon,
  "chart-pie": ChartPieIcon,
}
const SUGGESTION_STATES = ["default", "hover", "focus", "disabled"] as const

function QuietRow({ hint, checked, state }: { hint: string; checked: boolean; state: "default" | "hover" | "disabled" }) {
  const title = t("settings.notifications.quiet.title")
  return (
    <div aria-disabled={state === "disabled" || undefined} className="grid w-full max-w-form-max grid-cols-[var(--size-avatar-md)_minmax(0,1fr)_auto] items-center gap-3 rounded-md bg-surface-muted px-4 py-3 mobile:grid-cols-[var(--size-avatar-md)_minmax(0,1fr)]">
      <span aria-hidden className="inline-flex size-avatar-md shrink-0 items-center justify-center rounded-full bg-neutral-soft text-on-neutral-soft">
        <MoonIcon className="size-icon-md" />
      </span>
      <span className="flex min-w-0 flex-col">
        <strong className="text-role-label font-medium">{title}</strong>
        <span className="text-role-caption text-fg-muted tabular-nums">{hint}</span>
      </span>
      <Switch defaultChecked={checked} aria-label={title} disabled={state === "disabled"} data-demo={state === "hover" ? "hover" : undefined} className="mobile:col-start-2 mobile:justify-self-start" />
    </div>
  )
}

function OnboardingDemo() {
  const quiet = mock.settings.notifications.quietHours
  const asOf = formatTime(mock.meta.asOf)
  return (
    <div className={GRID_2}>
      <DemoBox>
        <div className="flex w-full flex-col items-center gap-3 px-6 py-8 text-center">
          <span aria-hidden className="inline-flex size-control-lg shrink-0 items-center justify-center rounded-full bg-neutral-soft text-on-neutral-soft">
            <SparklesIcon className="size-icon-md" />
          </span>
          <h4 className="text-role-heading">{K("sample.welcome.title", { name: mock.user.name })}</h4>
          <p className="max-w-form-max text-fg-muted">{K("sample.welcome.body", { time: asOf })}</p>
          <div aria-label={K("sample.welcome.suggestionsAria")} className="mt-2 flex flex-wrap justify-center gap-2">
            {mock.chat.suggestions.map((sg, i) => {
              const Icon = SUGGESTION_ICONS[sg.icon]
              const st = SUGGESTION_STATES[i] ?? "default"
              return (
                <SuggestionChip key={sg.key} disabled={st === "disabled"} data-demo={st === "hover" || st === "focus" ? st : undefined} className="[&_svg]:text-primary">
                  {Icon ? <Icon aria-hidden /> : null}
                  {sg.label}
                </SuggestionChip>
              )
            })}
          </div>
        </div>
      </DemoBox>
      <StageCol>
        <DemoBox caption={K("sample.quiet.caption", { from: quiet.from, to: quiet.to })}>
          <QuietRow hint={K("sample.quiet.on", { from: quiet.from, to: quiet.to })} checked state="default" />
          <QuietRow hint={K("sample.quiet.off")} checked={false} state="hover" />
          <QuietRow hint={K("sample.quiet.locked")} checked state="disabled" />
        </DemoBox>
        <DemoBox caption={K("sample.timePicker.caption")}>
          <Stage>
            {(["from", "to"] as const).map((k) => (
              <Field key={k}>
                <FieldLabel htmlFor={`quiet-${k}`}>{K(`sample.timePicker.${k}`)}</FieldLabel>
                <span className="relative w-[calc(var(--size-content-max)/10)]">
                  <Input id={`quiet-${k}`} defaultValue={quiet[k]} inputMode="numeric" className="pr-10 tabular-nums" />
                  <ClockIcon aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-icon-md -translate-y-1/2 text-fg-muted" />
                </span>
              </Field>
            ))}
          </Stage>
        </DemoBox>
      </StageCol>
    </div>
  )
}

/* ---------------- 卡片 demo 映射：snippets.id → 演示 ---------------- */

type Overlay = { open: string | null; set: (patch: Record<string, string | null>) => void }

function Demo({ id, overlay }: { id: string; overlay: Overlay }) {
  switch (id) {
    case "typography":
      return <TypographyDemo />
    case "button":
      return <ButtonDemo />
    case "iconbutton":
      return <IconButtonDemo />
    case "input":
      return (
        <>
          <InputDemo part="input" />
          <FormControlsSection part="input" {...overlay} />
        </>
      )
    case "field":
      return <InputDemo part="field" />
    case "select":
      return <FormControlsSection part="select" {...overlay} />
    case "choice":
      return (
        <>
          <CheckboxDemo />
          <FormControlsSection part="choice" {...overlay} />
        </>
      )
    case "date":
      return <FormControlsSection part="date" {...overlay} />
    case "misc-input":
      return <FormControlsSection part="misc" {...overlay} />
    case "table":
      return <TableDemo part="table" />
    case "tag":
      return (
        <>
          <TagDemo />
          <AvatarDemo />
        </>
      )
    case "dl":
      return (
        <>
          <ListDemo />
          <CardDemo part="card" />
        </>
      )
    case "chart":
      return (
        <>
          <CardDemo part="stat" />
          <ChartDemo />
        </>
      )
    case "md":
      return <ComposedSection part="md" />
    case "alert":
      return (
<AlertDemo set={overlay.set} />
      )
    case "loading":
      return <FeedbackDemo />
    case "state":
      return (
        <>
          <CardDemo part="state" />
          <ComposedSection part="state" />
        </>
      )
    case "dialog":
      return (
        <>
          <OverlayExtras {...overlay} />
          <OverlayDemo part="dialog" {...overlay} />
        </>
      )
    case "nav":
      return <NavDemo />
    case "tabs":
      return (
        <>
          <TabsDemo />
          <NavExtras part="tabs" />
        </>
      )
    case "menu":
      return (
        <>
          <OverlayDemo part="menu" {...overlay} />
          <NavExtras part="menu" />
        </>
      )
    case "sheet":
      return <OverlayDemo part="sheet" {...overlay} />
    case "shell":
      return <ShellDemo />
    case "layout":
      return (
        <>
          <LayoutSection />
          <InputDemo part="divider" />
        </>
      )
    case "color":
      return <ColorDemo />
    case "scale":
      return <ScaleDemo />
    case "onboarding":
      return <OnboardingDemo />
    case "order":
      return <TableDemo part="order" />
    case "pricing":
      return <ComposedSection part="pricing" />
    case "chat":
      return <ComposedSection part="chat" />
    case "hero":
      return <HeroDemo />
    default:
      return null
  }
}

/** AppShell 三档缩略（hifi .mini-shell）：expanded / rail / drawer */
function ShellDemo() {
  const modes = [
    { key: "appShell.desktop", aria: "appShell.aria.expanded", side: "w-[calc(var(--size-sidebar-expanded)*0.6)] tablet:w-[calc(var(--size-sidebar-expanded)*0.45)]", drawer: false },
    { key: "appShell.tablet", aria: "appShell.aria.rail", side: "w-sidebar-rail", drawer: false },
    { key: "appShell.mobile", aria: "appShell.aria.drawer", side: "w-[calc(var(--size-sidebar-drawer)*0.6)]", drawer: true },
  ]
  const item = "block size-6 rounded-sm bg-neutral-soft"
  return (
    <div className={GRID_3}>
      {modes.map((m) => (
        <DemoBox key={m.key} caption={K(m.key)}>
          <div role="img" aria-label={K(m.aria)} className="relative flex h-[calc(var(--size-chart-trend)*3/4)] w-full overflow-hidden rounded-lg border bg-bg">
            <div
              className={cn(
                "flex shrink-0 flex-col gap-2 border-r bg-surface p-3",
                m.side,
                m.drawer ? "absolute inset-y-0 left-0 z-10 shadow-lg [&>i]:w-auto" : "items-center",
                m.key === "appShell.desktop" && "items-stretch [&>i]:w-auto",
              )}
            >
              <i aria-hidden className={cn(item, "mb-2 bg-primary")} />
              <i aria-hidden className={cn(item, "bg-primary-soft")} />
              <i aria-hidden className={item} />
              <i aria-hidden className={item} />
              <i aria-hidden className={item} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex h-control-lg items-center gap-2 border-b bg-surface px-3">
                <i aria-hidden className="block h-3 w-16 rounded-full bg-neutral-soft" />
                <i aria-hidden className="ml-auto block size-6 rounded-full bg-neutral-soft" />
              </div>
              <div className={cn("grid content-start gap-2 p-3", m.drawer ? "grid-cols-2" : "grid-cols-4 tablet:grid-cols-2")}>
                <i aria-hidden className="block h-12 rounded-md border bg-surface" />
                <i aria-hidden className="block h-12 rounded-md border bg-surface" />
                <i aria-hidden className="block h-12 rounded-md border bg-surface" />
                <i aria-hidden className="block h-12 rounded-md border bg-surface" />
                <i aria-hidden className="col-span-full block h-20 rounded-md border bg-surface" />
              </div>
            </div>
            {m.drawer ? <span aria-hidden className="absolute inset-0 bg-overlay" /> : null}
          </div>
        </DemoBox>
      ))}
    </div>
  )
}

/** HeroArt：landing 稿的几何插画（纯 SVG 线条，无位图） */
function HeroDemo() {
  return (
    <div className="grid w-full place-items-center rounded-md border border-dashed border-border-strong p-4">
      <svg viewBox="0 0 240 120" className="h-empty-figure w-full text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <rect x="16" y="16" width="208" height="88" rx="12" className="fill-surface-brand" stroke="var(--color-role-border)" />
        <path d="M40 80 L80 52 L112 68 L152 40 L200 60" />
        <circle cx="80" cy="52" r="4" className="fill-primary" />
        <circle cx="152" cy="40" r="4" className="fill-primary" />
        <path d="M40 92h160" stroke="var(--color-role-border-strong)" />
      </svg>
    </div>
  )
}

/* ---------------- 组件卡 ---------------- */

function ComponentCard({ s, expanded, onToggle, overlay }: { s: Snippet; expanded: boolean; onToggle: () => void; overlay: Overlay }) {
  const panelId = `code-${s.id}`
  return (
    <article id={`comp-${s.id}`} data-name={`${s.name} ${s.keywords}`} className="flex min-w-0 flex-col gap-4 rounded-lg border bg-surface p-6 shadow-sm mobile:p-4">
      <header className="flex min-h-hit items-center gap-2">
        <h3 className="min-w-0 truncate text-role-title">{s.name}</h3>
        <span
          className={cn(
            "inline-flex h-5 shrink-0 items-center rounded-xs px-2 font-mono text-role-caption whitespace-nowrap",
            s.src === "composed" ? "bg-primary-soft text-on-primary-soft" : s.src === "tokens" ? "bg-success-soft text-success" : "text-fg-muted shadow-[inset_0_0_0_var(--border-width-hairline)_var(--color-role-border)]",
          )}
        >
          {s.src}
        </span>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={K("code.toggleAria", { component: s.primary })}
          onClick={onToggle}
          className="ml-auto inline-flex h-hit shrink-0 items-center gap-1 rounded-md px-3 text-role-label text-link transition-colors duration-(--motion-fast) ease-std hover:bg-primary-soft hover:text-on-primary-soft [&_svg]:size-icon-sm"
        >
          {K("code.toggle")}
          <ChevronDownIcon aria-hidden className={cn("transition-transform duration-(--motion-fast) ease-std", expanded && "rotate-180")} />
        </button>
      </header>
      <div className="flex flex-col gap-6">
        <Demo id={s.id} overlay={overlay} />
      </div>
      <div id={panelId} hidden={!expanded} className={cn("flex flex-col gap-3 border-t pt-4", SCROLL_MT)}>
        <p className="sr-only">{K("code.hint")}</p>
        <CodeBlock code={s.code} language={K("code.language")} labels={{ copy: K("code.copy"), copied: K("code.copied") }} />
        {s.props.length ? (
          <>
            <h4 className="text-role-label">{K("props.title")}</h4>
            <div className={MATRIX_WRAP} tabIndex={0} role="region" aria-label={K("props.title")}>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {[K("props.name"), K("props.type"), K("props.default")].map((h) => (
                      <th key={h} scope="col" className="border-b px-3 py-2 text-left text-role-caption font-medium text-fg-muted first:pl-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.props.map((row) => (
                    <tr key={row[0]} className="[&:last-child>td]:border-b-0">
                      {row.map((cell, i) => (
                        <td key={i} className={cn("border-b px-3 py-2 align-top text-role-caption first:pl-0", i === 0 ? "text-fg" : "font-mono text-fg-muted [overflow-wrap:anywhere]")}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="ml-auto hit-area" aria-controls={panelId} onClick={onToggle}>
            {K("code.hide")}
          </Button>
        </div>
      </div>
    </article>
  )
}

/* ---------------- 页面 ---------------- */

export default function ComponentsPage() {
  const [params, setParams] = useSearchParams()
  const { theme, setTheme } = useTheme()
  const mobile = useBelowWidth("--breakpoint-md")

  const q = params.get("q") ?? ""
  const openAll = params.get("open") === "code"
  const fromKitchenSink = params.get("from") === "kitchen-sink"
  const [noticeClosed, setNoticeClosed] = React.useState(false)

  const set = React.useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params)
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "") next.delete(k)
        else next.set(k, v)
      }
      setParams(next, { replace: true })
    },
    [params, setParams],
  )
  const overlay: Overlay = { open: params.get("open"), set }

  const toastQ = params.get("toast")
  const hold = params.get("hold") === "1"
  React.useEffect(() => {
    if (toastQ !== "1") return
    const clear = () =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.delete("toast")
          next.delete("hold")
          return next
        },
        { replace: true },
      )
    const id = toast.success(K("sample.alert.prefsSaved"), {
      duration: hold ? Infinity : tokenMs("--timing-toast-stay"),
      onDismiss: clear,
      onAutoClose: clear,
    })
    return () => {
      toast.dismiss(id)
    }
  }, [toastQ, hold, setParams])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target instanceof HTMLElement ? e.target : null
      if (el && (el.closest("input, textarea, select, [contenteditable=true]") || el.isContentEditable)) return
      e.preventDefault()
      document.getElementById("searchInput")?.focus()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})
  const isExpanded = (id: string) => expanded[id] ?? openAll
  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !isExpanded(id) }))

  const needle = q.trim().toLowerCase()
  const match = (s: Snippet) => !needle || `${s.name} ${s.keywords} ${s.id}`.toLowerCase().includes(needle)
  const visibleCats = CATS.map((c) => ({ ...c, items: snippets.filter((s) => s.cat === c.id && match(s)) })).filter((c) => c.items.length)

  const [current, setCurrent] = React.useState<string>(CATS[0].id)
  React.useEffect(() => {
    const sections = CATS.map((c) => document.getElementById(c.id)).filter((el): el is HTMLElement => !!el)
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setCurrent(hit.target.id)
      },
      { rootMargin: "-40% 0% -55% 0%" },
    )
    sections.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [visibleCats.length])

  const [showTop, setShowTop] = React.useState(false)
  React.useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const jump = (id: string) => {
    setCurrent(id)
    document.getElementById(id)?.scrollIntoView({ block: "start" })
  }

  return (
    <div id="top" className="min-h-screen bg-bg text-fg">
      <header data-slot="topbar" className="sticky top-0 z-20 border-b bg-surface">
        <div className="mx-auto flex min-h-topbar max-w-content-max items-center gap-4 px-6 mobile:min-h-0 mobile:flex-wrap mobile:gap-x-3 mobile:gap-y-2 mobile:px-4 mobile:py-2">
          <div className="flex min-w-0 items-center gap-3 mobile:min-h-hit">
            <BrandMark variant="house" />
            <h1 className="text-role-title whitespace-nowrap">{K("title")}</h1>
          </div>
          <span className="inline-flex h-chip items-center gap-1 rounded-full bg-surface-muted px-3 text-role-caption whitespace-nowrap text-fg-muted mobile:hidden">
            {K("version")
              .split(/(\{version\}|\{count\})/)
              .map((part, i) =>
                part === "{version}" || part === "{count}" ? (
                  <span key={i} className="font-mono text-fg">
                    {part === "{version}" ? K("versionValue") : componentCount}
                  </span>
                ) : (
                  part
                ),
              )}
          </span>
          <SearchInput
            id="searchInput"
            value={q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder={K("search.placeholder")}
            aria-label={K("search.placeholder")}
            shortcut={K("search.shortcut")}
            className="w-[calc(var(--size-content-max)/4)] tablet:w-[calc(var(--size-content-max)/6)] mobile:order-3 mobile:w-full mobile:basis-full"
          />
          <div className="ml-auto flex items-center gap-2">
            <Segmented type="single" value={theme} onValueChange={(v) => v && setTheme(v as Theme)} aria-label={K("theme.aria")}>
              {THEMES.map(({ value, label, Icon }) => (
                <SegmentedItem key={value} value={value} data-icon aria-label={label} title={label}>
                  <Icon aria-hidden />
                </SegmentedItem>
              ))}
            </Segmented>
          </div>
        </div>
      </header>

      <nav aria-label={K("nav.aria")} className="sticky top-topbar z-10 border-b bg-bg mobile:top-[calc(var(--size-hit)+var(--space-4)+var(--size-control-md)+var(--space-2))]">
        <div className="mx-auto flex max-w-content-max items-center gap-1 overflow-x-auto px-6 py-2 [scrollbar-width:none] mobile:px-4 [&::-webkit-scrollbar]:hidden">
          {mobile ? (
            <Select aria-label={K("nav.select")} value={current} onChange={(e) => jump(e.target.value)} className="h-hit">
              {CATS.map((c, i) => (
                <option key={c.id} value={c.id}>
                  {String(i + 1).padStart(2, "0")} {K(`section.${c.key}`)}
                </option>
              ))}
            </Select>
          ) : (
            CATS.map((c, i) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                aria-current={current === c.id ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  jump(c.id)
                }}
                className="inline-flex h-hit items-center gap-2 rounded-md px-3 text-role-label whitespace-nowrap text-fg-muted transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted hover:text-fg aria-[current=true]:bg-primary-soft aria-[current=true]:text-on-primary-soft"
              >
                {K(`section.${c.key}`)}
                <span className="text-role-caption tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              </a>
            ))
          )}
        </div>
      </nav>

      <main className="mx-auto flex max-w-content-max flex-col gap-12 p-6 mobile:gap-10 mobile:p-4">
        <section className="flex flex-col gap-4">
          <p className="max-w-prose-max text-role-lead text-fg-muted">{K("subtitle")}</p>
          {fromKitchenSink && !noticeClosed ? (
            <Alert variant="info" closeLabel={K("sample.dialog.close")} onClose={() => setNoticeClosed(true)}>
              <AlertDescription>{K("redirectNotice")}</AlertDescription>
            </Alert>
          ) : null}
        </section>

        {visibleCats.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center text-fg-muted">
            <SearchXIcon aria-hidden className="size-icon-lg" />
            <p>{K("search.empty", { q })}</p>
          </div>
        ) : null}

        {visibleCats.map((c) => (
          <section key={c.id} id={c.id} className={cn("flex flex-col gap-4", SCROLL_MT)}>
            <div className="flex flex-wrap items-baseline gap-3 border-b pb-3">
              <h2 className="text-role-heading">{K(`section.${c.key}`)}</h2>
              <span className="font-mono text-role-caption text-fg-muted">#{c.id}</span>
              <p className="max-w-prose-max basis-full text-fg-muted">{K(`sectionDesc.${c.key}`)}</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {c.items.map((s) => (
                <ComponentCard key={s.id} s={s} expanded={isExpanded(s.id)} onToggle={() => toggle(s.id)} overlay={overlay} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <a
        href="#top"
        aria-label={K("backToTop")}
        onClick={(e) => {
          e.preventDefault()
          window.scrollTo({ top: 0 })
        }}
        className={cn(
          "fixed right-6 bottom-6 z-30 grid size-hit place-items-center rounded-full border bg-surface-raised text-fg-muted shadow-md transition-[opacity,transform] duration-(--motion-fast) ease-std hover:bg-surface-muted hover:text-fg [&_svg]:size-icon-md mobile:right-4 mobile:bottom-4",
          showTop ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <ArrowUpIcon aria-hidden />
      </a>
    </div>
  )
}
