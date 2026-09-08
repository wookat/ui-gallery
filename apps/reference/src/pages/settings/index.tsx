import * as React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import {
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleIcon,
  CopyIcon,
  CreditCardIcon,
  DownloadIcon,
  LaptopIcon,
  LoaderCircleIcon,
  MailIcon,
  MonitorIcon,
  RefreshCwIcon,
  SendIcon,
  ShieldIcon,
  SmartphoneIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"

import { AppShell } from "@/pages/dashboard/shell"
import { mock } from "@/data/mock"
import { t } from "@/data/content"
import { useScreenState } from "@/data/screen-state"
import { formatCurrency, formatCurrencyWhole } from "@/lib/format"
import { tokenMs, useMaxWidth } from "@/lib/media"
import { cn } from "@/lib/cn"

import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea, CharCounter } from "@/components/ui/textarea"
import { PasswordInput } from "@/components/ui/password-input"
import { Select } from "@/components/ui/select"
import { Combobox } from "@/components/ui/combobox"
import { Switch } from "@/components/ui/switch"
import { Segmented, SegmentedItem } from "@/components/ui/segmented"
import { TagInput } from "@/components/ui/tag-input"
import { OTPInput } from "@/components/ui/otp-input"
import { Alert, AlertDescription, AlertAction } from "@/components/ui/alert"
import { Tag, type Tone } from "@/components/ui/badge"
import { Table, TableWrap, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Avatar } from "@/components/composed/avatar"
import { PageHeader } from "@/components/composed/page-header"
import { PricingCard } from "@/components/composed/pricing-card"

export const path = "/settings"

const STATES = ["default", "saving", "saved", "error", "empty"] as const
const TABS = ["profile", "security", "notifications", "team", "billing"] as const
type Tab = (typeof TABS)[number]
/** 有「保存栏」的三个表单；security 的表单是「修改密码」 */
type FormKey = "profile" | "password" | "notifications"
const TAB_FORM: Partial<Record<Tab, FormKey>> = { profile: "profile", security: "password", notifications: "notifications" }
const CHANNELS = ["all", "email", "push", "inapp"] as const
type Channel = (typeof CHANNELS)[number]
type ChannelKey = Exclude<Channel, "all">
const CYCLES = ["monthly", "yearly"] as const
type Cycle = (typeof CYCLES)[number]
type TwoFA = "off" | "setup" | "on"
type Overlay = "2fa" | "2fa-disable" | "remove" | "danger" | "leave"
type Local = Overlay | null

const S = mock.settings
const TAB_ICON: Record<Tab, React.ComponentType<React.SVGProps<SVGSVGElement>>> = { profile: UserIcon, security: ShieldIcon, notifications: BellIcon, team: UsersIcon, billing: CreditCardIcon }
const TEAM_BY_ID = new Map(mock.team.map((m) => [m.id, m]))
const SELF_ID = mock.user.id

type Profile = { name: string; title: string; bio: string; language: string; timezone: string }
type Prefs = Record<string, Record<ChannelKey, boolean>>
type Invite = (typeof S.team.pendingInvites)[number]
type Plan = (typeof S.billing.plans)[number]
/** hifi INV_TONE：发票状态 → 语义色 */
const INV_TONE: Record<string, Tone> = { paid: "success", pending: "warning", failed: "danger" }
const invoiceStatus = (key: string) => ({ label: S.billing.invoiceStatuses.find((s) => s.key === key)?.label ?? key, tone: INV_TONE[key] ?? "neutral" })

const pick = <T extends string>(v: string | null, list: readonly T[], fallback: T): T => (list as readonly string[]).includes(v ?? "") ? (v as T) : fallback

const initialProfile = (): Profile => ({ name: S.profile.name, title: S.profile.title, bio: S.profile.bio, language: S.profile.language, timezone: S.profile.timezone })
const initialPrefs = (): Prefs => Object.fromEntries(S.notifications.groups.flatMap((g) => g.items.map((it) => [it.key, { email: it.email, push: it.push, inapp: it.inapp }])))
const samePrefs = (a: Prefs, b: Prefs) => Object.keys(a).every((k) => (["email", "push", "inapp"] as const).every((c) => a[k][c] === b[k][c]))

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** hifi strength：长度 ≥ 8 +1、大小写 +1、数字/符号 +1 */
const strengthOf = (pw: string) => (pw ? (pw.length >= 8 ? 1 : 0) + (/[a-z]/.test(pw) && /[A-Z]/.test(pw) ? 1 : 0) + (/[\d\W_]/.test(pw) ? 1 : 0) : 0)
const roleLabel = (key: string) => S.team.roles.find((r) => r.key === key)?.label ?? key
const ruleOk = (pw: string, i: number) => (i === 0 ? pw.length >= 8 : i === 1 ? /[a-z]/.test(pw) && /[A-Z]/.test(pw) : /[\d\W_]/.test(pw))

const relative = new Intl.RelativeTimeFormat("zh-CN", { numeric: "always" })
/** 相对 meta.asOf 的时间（hifi relTime） */
function formatRelative(iso: string) {
  const min = (new Date(mock.meta.asOf).getTime() - new Date(iso).getTime()) / 60000
  if (min < 1) return t("settings.security.sessions.now")
  if (min < 60) return relative.format(-Math.round(min), "minute")
  if (min < 60 * 24) return relative.format(-Math.round(min / 60), "hour")
  return relative.format(-Math.round(min / 60 / 24), "day")
}

/** hifi qrSvg：由 otpauth 文本确定性生成的 21×21 示意码（纯矢量，不是可扫描二维码） */
function QrFigure({ seed, label, className }: { seed: string; label: string; className?: string }) {
  const n = 21
  const cells: React.ReactNode[] = []
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619) >>> 0
  const finder = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7)
  const finderOn = (x: number, y: number) => {
    const fx = x >= n - 7 ? x - (n - 7) : x
    const fy = y >= n - 7 ? y - (n - 7) : y
    return fx === 0 || fy === 0 || fx === 6 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4)
  }
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let on: boolean
      if (finder(x, y)) on = finderOn(x, y)
      else if ((x === 7 && y < 8) || (y === 7 && x < 8) || (x === n - 8 && y < 8) || (y === 7 && x >= n - 8) || (x === 7 && y >= n - 8) || (y === n - 8 && x < 8)) on = false
      else {
        h = (Math.imul(h, 1103515245) + 12345) >>> 0
        on = ((h >>> 16) & 1) === 1
      }
      if (on) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />)
    }
  }
  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${n} ${n}`} shapeRendering="crispEdges" className={cn("block size-full fill-current", className)}>
      {cells}
    </svg>
  )
}

const CENTERED_DIALOG =
  "rounded-lg border-0 mobile:top-1/2 mobile:bottom-auto mobile:left-1/2 mobile:w-[calc(100vw-var(--space-4)*2)] mobile:max-w-dialog mobile:-translate-1/2 mobile:rounded-lg mobile:px-4 mobile:py-5"
const DIALOG_ACTS = "mobile:flex-col-reverse mobile:[&>*]:w-full"

/** 卡片头：hifi .card-head —— 标题 + 说明 左、动作 右；≤768 动作换行到底部 */
function SectionHead({ title, description, actions, className }: { title: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode; className?: string }) {
  return (
    <CardHeader className={cn("flex flex-row flex-wrap items-start justify-between gap-4 mobile:mb-4", className)}>
      <div className="flex min-w-0 flex-col gap-1">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription className="text-role-body">{description}</CardDescription> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2 mobile:w-full mobile:justify-start">{actions}</div> : null}
    </CardHeader>
  )
}

/** 保存栏：hifi .savebar —— 未保存提示左、重置 + 保存右；≤768 吸底 */
function SaveBar({ dirty, busy, onReset, saveLabel, resetDisabled }: { dirty: boolean; busy: boolean; onReset: () => void; saveLabel?: string; resetDisabled?: boolean }) {
  return (
    <div
      data-slot="savebar"
      data-dirty={dirty || undefined}
      className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t pt-5 mobile:sticky mobile:bottom-0 mobile:z-10 mobile:-mx-4 mobile:-mb-4 mobile:mt-4 mobile:rounded-b-lg mobile:bg-surface mobile:px-4 mobile:py-3"
    >
      {busy ? (
        <span className="mr-auto inline-flex items-center gap-1 text-role-caption text-fg-muted mobile:mr-0 mobile:w-full">
          <LoaderCircleIcon aria-hidden className="size-icon-sm animate-spin" />
          {t("settings.actions.saving")}
        </span>
      ) : dirty ? (
        <span className="mr-auto inline-flex items-center gap-1 text-role-caption text-warning mobile:mr-0 mobile:w-full">
          <CircleIcon aria-hidden className="size-icon-sm fill-current" />
          {t("settings.actions.unsaved")}
        </span>
      ) : null}
      <Button type="button" variant="secondary" disabled={busy || resetDisabled || !dirty} onClick={onReset} className="mobile:flex-1">
        {t("settings.actions.reset")}
      </Button>
      <Button type="submit" disabled={busy} aria-busy={busy || undefined} className="mobile:flex-1">
        {busy ? (
          <>
            <LoaderCircleIcon aria-hidden className="animate-spin" />
            {t("settings.actions.saving")}
          </>
        ) : (
          (saveLabel ?? t("settings.actions.save"))
        )}
      </Button>
    </div>
  )
}

function EmptyInline({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("rounded-md border border-dashed px-4 py-8 text-center text-role-body text-fg-muted", className)}>{children}</p>
}

const focusDialogClose = (e: Event) => {
  const close = e.currentTarget instanceof HTMLElement ? e.currentTarget.querySelector<HTMLElement>("[data-slot=dialog-close-icon],[data-slot=alert-dialog-close-icon]") : null
  if (close) {
    e.preventDefault()
    close.focus()
  }
}

/**
 * /settings —— hifi design/hifi/settings/index.html。
 * ?tab=profile|security|notifications|team|billing &state=default|saving|saved|error|empty
 * &open=2fa|2fa-disable|remove|danger|leave|notifications|account|drawer &twofa=setup|on &cycle=monthly|yearly
 * &channel=all|email|push|inapp &sidebar=rail|expanded &hold。
 */
export default function SettingsPage() {
  const { state, open, hold, set } = useScreenState(STATES)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const mobile = useMaxWidth("--breakpoint-md")
  const empty = state === "empty"
  const stay = hold ? Infinity : tokenMs("--timing-toast-stay")

  const tab = pick(params.get("tab"), TABS, "profile")
  const cycle = pick(params.get("cycle"), CYCLES, S.billing.cycle === "yearly" ? "yearly" : "monthly")
  const channel = pick(params.get("channel"), CHANNELS, "all")
  const sidebar = params.get("sidebar")
  const activeForm = TAB_FORM[tab] ?? "profile"

  /* ---------- 浮层：?open= 与本地打开合流（form 屏同款） ---------- */
  const [local, setLocal] = React.useState<Local>(null)
  const [dismissed, setDismissed] = React.useState<Local>(null)
  const overlay = (key: Overlay) => ({
    open: (open === key && dismissed !== key) || local === key,
    onOpenChange: (o: boolean) => {
      if (o) {
        setLocal(key)
        setDismissed(null)
      } else {
        setLocal(null)
        if (open === key) {
          setDismissed(key)
          set({ open: null })
        }
      }
    },
  })
  const openLocal = (key: Overlay) => {
    setLocal(key)
    setDismissed(null)
  }
  const closeLocal = () => {
    setLocal(null)
    if (open && (["2fa", "2fa-disable", "remove", "danger", "leave"] as string[]).includes(open)) {
      setDismissed(open as Overlay)
      set({ open: null })
    }
  }

  /* ---------- 保存流转：saving（本地或 ?state=saving）→ saved/error ---------- */
  const [busyKey, setBusyKey] = React.useState<FormKey | null>(null)
  const [errorKey, setErrorKey] = React.useState<FormKey | null>(state === "error" ? activeForm : null)
  const busyOf = (k: FormKey) => busyKey === k || (state === "saving" && k === activeForm)
  const errorOf = (k: FormKey) => errorKey === k
  const clearUrlState = () => {
    if (state === "error" || state === "saving") set({ state: null })
  }
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])
  const runSave = (key: FormKey, commit: () => void, message: string) => {
    clearUrlState()
    setErrorKey(null)
    setBusyKey(key)
    timer.current = setTimeout(() => {
      setBusyKey(null)
      commit()
      toast.success(message, { duration: tokenMs("--timing-toast-stay") })
    }, tokenMs("--motion-skeleton"))
  }

  /* ---------- 个人资料 ---------- */
  const [profile, setProfile] = React.useState<Profile>(initialProfile)
  const [savedProfile, setSavedProfile] = React.useState<Profile>(initialProfile)
  const profileDiff = JSON.stringify(profile) !== JSON.stringify(savedProfile)
  const nameError = profile.name.trim() === "" ? t("settings.profile.name.required") : profile.name.length > 20 ? t("settings.profile.name.max") : null
  const [nameTouched, setNameTouched] = React.useState(false)
  const initial = profile.name.trim().slice(-1) || S.profile.initial

  /* ---------- 账号安全 ---------- */
  const [pw, setPw] = React.useState({ current: "", next: "", confirm: "" })
  const [pwError, setPwError] = React.useState<"mismatch" | null>(null)
  const confirmRef = React.useRef<HTMLInputElement>(null)
  const pwDirty = Boolean(pw.current || pw.next || pw.confirm)
  const strength = strengthOf(pw.next)
  const strengthLabel = S.security.strengthLevels.find((l) => l.score === strength)?.label ?? t("settings.security.password.strengthNone")

  const [twofa, setTwofa] = React.useState<TwoFA>(() => pick(params.get("twofa"), ["setup", "on"] as const, S.security.twoFactor.enabled ? "on" : "off"))
  const [otp, setOtp] = React.useState("")
  const [otpDlg, setOtpDlg] = React.useState("")
  const [otpInvalid, setOtpInvalid] = React.useState(false)
  const [verifying, setVerifying] = React.useState(false)
  const verify = (code: string, done: () => void) => {
    if (code.length < S.security.twoFactor.codeLength) {
      setOtpInvalid(true)
      return
    }
    setOtpInvalid(false)
    setVerifying(true)
    timer.current = setTimeout(() => {
      setVerifying(false)
      setTwofa("on")
      setOtp("")
      setOtpDlg("")
      done()
      toast.success(t("settings.security.2fa.toast"), { duration: tokenMs("--timing-toast-stay") })
    }, tokenMs("--motion-skeleton"))
  }
  const copyKey = () => {
    void navigator.clipboard?.writeText(S.security.twoFactor.manualKey)
    toast(t("settings.security.2fa.copied"), { duration: tokenMs("--timing-toast-stay") })
  }

  const [sessions, setSessions] = React.useState(() => S.security.sessions)
  const visibleSessions = empty ? sessions.filter((s) => s.current) : sessions
  const others = visibleSessions.filter((s) => !s.current)

  /* ---------- 通知偏好 ---------- */
  const [prefs, setPrefs] = React.useState<Prefs>(initialPrefs)
  const [savedPrefs, setSavedPrefs] = React.useState<Prefs>(initialPrefs)
  const [quiet, setQuiet] = React.useState(S.notifications.quietHours)
  const [savedQuiet, setSavedQuiet] = React.useState(S.notifications.quietHours)
  const prefsDiff = !samePrefs(prefs, savedPrefs) || JSON.stringify(quiet) !== JSON.stringify(savedQuiet)
  const visibleChannels = S.notifications.channels.filter((c) => channel === "all" || c.key === channel)
  const setGroup = (g: (typeof S.notifications.groups)[number], on: boolean) =>
    setPrefs((p) => {
      const next = { ...p }
      for (const it of g.items) {
        next[it.key] = { ...next[it.key] }
        for (const c of visibleChannels) next[it.key][c.key as ChannelKey] = on
      }
      return next
    })

  /* ---------- 团队 ---------- */
  const [members, setMembers] = React.useState(() => S.team.members)
  const [invites, setInvites] = React.useState<Invite[]>(() => S.team.pendingInvites)
  const [roles, setRoles] = React.useState<Record<string, string>>(() => Object.fromEntries(mock.team.map((m) => [m.id, m.role])))
  const [emails, setEmails] = React.useState<string[]>([])
  const [inviteRole, setInviteRole] = React.useState("member")
  const [inviteError, setInviteError] = React.useState<string | null>(null)
  const [sending, setSending] = React.useState(false)
  const [removeId, setRemoveId] = React.useState<string | null>(null)
  const visibleMembers = empty ? members.filter((m) => m.id === SELF_ID) : members
  const visibleInvites = empty ? [] : invites
  const seatsUsed = empty ? 1 : visibleMembers.length
  const seatsFull = seatsUsed + visibleInvites.length >= S.team.seats.total
  const removeTarget = TEAM_BY_ID.get(removeId ?? [...members].reverse().find((m) => m.id !== SELF_ID)?.id ?? "")
  const onEmailsChange = (next: string[]) => {
    const added = next.filter((v) => !emails.includes(v))
    for (const e of added) {
      if (!EMAIL_RE.test(e)) {
        setInviteError(t("settings.team.invite.invalid"))
        return
      }
      if (mock.team.some((m) => m.email === e && members.some((x) => x.id === m.id)) || invites.some((i) => i.email === e)) {
        setInviteError(t("settings.team.invite.duplicate", { email: e }))
        return
      }
    }
    setInviteError(null)
    setEmails(next)
  }
  const sendInvites = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emails.length || inviteError) return
    setSending(true)
    timer.current = setTimeout(() => {
      setSending(false)
      setInvites((list) => [...list, ...emails.map((email) => ({ email, role: inviteRole, invitedAt: mock.meta.asOf, invitedBy: SELF_ID }))])
      toast.success(t("settings.team.invite.toast", { n: emails.length }), { duration: tokenMs("--timing-toast-stay") })
      setEmails([])
    }, tokenMs("--motion-skeleton"))
  }

  /* ---------- 计费 ---------- */
  const [plan, setPlan] = React.useState(S.billing.plan)
  const [planCycle, setPlanCycle] = React.useState<Cycle>(cycle)
  const setCycle = (c: Cycle) => set({ cycle: c })
  const current = S.billing.plans.find((p) => p.key === plan) ?? S.billing.plans[1]
  const invoices = empty ? [] : S.billing.invoices
  const cycleLabel = (c: Cycle) => t(`settings.billing.cycle.${c}Short`)
  const choosePlan = (p: Plan) => {
    setPlan(p.key)
    setPlanCycle(cycle)
    toast.success(t("settings.billing.plan.toast", { plan: p.label, cycle: cycleLabel(cycle) }), { duration: tokenMs("--timing-toast-stay") })
  }

  /* ---------- 危险区 ---------- */
  const [phrase, setPhrase] = React.useState("")
  const [phraseTouched, setPhraseTouched] = React.useState(false)
  const phraseOk = phrase === S.dangerZone.confirmPhrase

  /* ---------- 脏态 / 离开保护 ---------- */
  const forced = (k: FormKey) => (state === "error" || state === "saving") && k === activeForm
  const dirty: Record<FormKey, boolean> = {
    profile: profileDiff || forced("profile"),
    password: pwDirty || forced("password"),
    notifications: prefsDiff || forced("notifications"),
  }
  const anyDirty = dirty.profile || dirty.password || dirty.notifications
  const [leaveTo, setLeaveTo] = React.useState<{ tab?: Tab; href?: string } | null>(null)
  const resetAll = () => {
    setProfile(savedProfile)
    setPw({ current: "", next: "", confirm: "" })
    setPwError(null)
    setPrefs(savedPrefs)
    setQuiet(savedQuiet)
    setErrorKey(null)
    set({ state: null })
  }
  const tabsRef = React.useRef<HTMLDivElement>(null)
  const bootedRef = React.useRef(false)
  React.useEffect(() => {
    const list = tabsRef.current
    const btn = list?.querySelector<HTMLElement>(`[data-tab="${tab}"]`)
    if (mobile && list && btn) list.scrollTo({ left: btn.offsetLeft + btn.offsetWidth / 2 - list.clientWidth / 2, behavior: bootedRef.current ? "smooth" : "instant" })
    bootedRef.current = true
  }, [tab, mobile])
  const goTab = (next: Tab, focus?: boolean) => {
    set({ tab: next })
    if (focus) requestAnimationFrame(() => tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${next}"]`)?.focus())
  }
  const requestTab = (next: Tab, focus?: boolean) => {
    if (next === tab) return
    if (anyDirty) {
      setLeaveTo({ tab: next })
      openLocal("leave")
      return
    }
    goTab(next, focus)
  }
  const beforeLeave = (href: string) => {
    if (!anyDirty) return true
    setLeaveTo({ href })
    openLocal("leave")
    return false
  }
  const confirmLeave = () => {
    resetAll()
    closeLocal()
    if (leaveTo?.href) navigate(leaveTo.href)
    else if (leaveTo?.tab) goTab(leaveTo.tab, true)
    setLeaveTo(null)
  }
  const onTabsKeyDown = (e: React.KeyboardEvent) => {
    const i = TABS.indexOf(tab)
    const j =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (i + 1) % TABS.length
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (i - 1 + TABS.length) % TABS.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? TABS.length - 1
              : -1
    if (j < 0) return
    e.preventDefault()
    requestTab(TABS[j], true)
  }

  /* ---------- ?state=saved：进入即提示 ---------- */
  React.useEffect(() => {
    if (state !== "saved") return
    const msg = activeForm === "notifications" ? S.notifications.savedToast : activeForm === "password" ? t("settings.security.password.toast") : S.profile.savedToast
    toast.success(msg, { duration: stay })
  }, [state, activeForm, stay])

  /* ---------- 提交 ---------- */
  const submitProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setNameTouched(true)
    if (nameError) return
    runSave("profile", () => setSavedProfile(profile), S.profile.savedToast)
  }
  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw.next !== pw.confirm) {
      setPwError("mismatch")
      confirmRef.current?.focus()
      return
    }
    setPwError(null)
    runSave("password", () => setPw({ current: "", next: "", confirm: "" }), t("settings.security.password.toast"))
  }
  const submitNotifications = (e: React.FormEvent) => {
    e.preventDefault()
    runSave(
      "notifications",
      () => {
        setSavedPrefs(prefs)
        setSavedQuiet(quiet)
      },
      S.notifications.savedToast,
    )
  }
  const retry = () => {
    if (activeForm === "profile") runSave("profile", () => setSavedProfile(profile), S.profile.savedToast)
    else if (activeForm === "password") runSave("password", () => setPw({ current: "", next: "", confirm: "" }), t("settings.security.password.toast"))
    else
      runSave(
        "notifications",
        () => {
          setSavedPrefs(prefs)
          setSavedQuiet(quiet)
        },
        S.notifications.savedToast,
      )
  }

  const formKey = TAB_FORM[tab]
  const errorAlert =
    formKey && errorOf(formKey) ? (
      <Alert
        variant="danger"
        icon={TriangleAlertIcon}
        actions={
          <AlertAction onClick={retry} className="text-danger">
            <RefreshCwIcon aria-hidden className="size-icon-sm" />
            {t("settings.error.retry")}
          </AlertAction>
        }
      >
        <strong className="text-role-label">{t("settings.error.title")}</strong>
        <AlertDescription>{S.profile.errorMessage}</AlertDescription>
      </Alert>
    ) : null

  const sessionIcon = (device: string) => (device.includes("iPhone") || device.includes("移动") ? SmartphoneIcon : device.includes("macOS") ? LaptopIcon : MonitorIcon)

  const tabPanelId = (k: Tab) => `settings-pane-${k}`
  const tabId = (k: Tab) => `settings-tab-${k}`

  return (
    <AppShell current="settings" currentLabel={t("settings.title")} sidebar={sidebar} open={open} setOpen={(o) => set({ open: o })} beforeLeave={beforeLeave}>
      <PageHeader
        title={t("settings.title")}
        description={`${mock.user.workspace.name} · ${mock.user.workspace.plan} · ${mock.user.roleLabel}`}
        className="[&_h1]:text-role-display [&_p]:text-role-caption mobile:[&_h1]:text-role-heading"
      />

      <div className="grid grid-cols-[var(--size-settings-tabs)_minmax(0,1fr)] items-start gap-8 tablet:grid-cols-[calc(var(--size-settings-tabs)*0.75)_minmax(0,1fr)] tablet:gap-6 mobile:flex mobile:flex-col mobile:items-stretch mobile:gap-4">
        {/* Tabs：1024+ 竖向粘性；≤768 顶部横向可滚动 */}
        <div
          ref={tabsRef}
          role="tablist"
          aria-label={t("settings.tabs.aria")}
          aria-orientation={mobile ? "horizontal" : "vertical"}
          onKeyDown={onTabsKeyDown}
          className="sticky top-[calc(var(--size-topbar)+var(--space-6))] flex flex-col gap-1 mobile:top-topbar mobile:z-10 mobile:-mx-4 mobile:flex-row mobile:gap-1 mobile:overflow-x-auto mobile:bg-bg mobile:px-4 mobile:py-2 mobile:[scrollbar-width:none]"
        >
          {S.tabs.map((it) => {
            const key = it.key as Tab
            const on = key === tab
            const dot = TAB_FORM[key] ? dirty[TAB_FORM[key]] : false
            const Icon = TAB_ICON[key]
            return (
              <button
                key={key}
                type="button"
                role="tab"
                id={tabId(key)}
                data-tab={key}
                aria-selected={on}
                aria-controls={tabPanelId(key)}
                tabIndex={on ? 0 : -1}
                onClick={() => requestTab(key)}
                className={cn(
                  "flex h-hit w-full items-center gap-3 rounded-md px-3 text-left text-role-label whitespace-nowrap transition-colors duration-(--motion-fast) ease-std focus-visible:outline-focus focus-visible:outline-focus-ring mobile:w-auto mobile:flex-none mobile:px-4",
                  on ? "bg-primary-soft text-on-primary-soft" : "text-fg-muted hover:bg-surface-muted hover:text-fg",
                )}
              >
                <Icon aria-hidden className={cn("size-icon-md shrink-0", on && "text-primary")} />
                <span className="flex-1 mobile:flex-none">{t(`settings.tab.${key}`)}</span>
                {dot ? <CircleIcon aria-hidden className="size-dot fill-warning text-warning" /> : null}
              </button>
            )
          })}
        </div>

        <div className="flex min-w-0 flex-col gap-6 mobile:gap-4">
          {errorAlert}
          {/* ---------------- 个人资料 ---------------- */}
          {tab === "profile" ? (
            <section role="tabpanel" id={tabPanelId("profile")} aria-labelledby={tabId("profile")} className="flex flex-col gap-6 mobile:gap-4">
              <Card className="mobile:p-4">
                <SectionHead title={t("settings.profile.title")} description={t("settings.profile.description")} />
                <CardContent>
                  <form onSubmit={submitProfile} aria-busy={busyOf("profile") || undefined} noValidate>
                    <fieldset disabled={busyOf("profile")} className="min-w-0 border-0 p-0">
                      <div className="mb-6 flex items-center gap-5 mobile:mb-5 mobile:gap-4">
                        <Avatar initial={initial} hue={S.profile.avatarHue} name={t("settings.profile.avatar.aria", { name: profile.name })} className="[&]:size-16 [&]:text-role-heading" />
                        <div className="flex min-w-0 flex-col gap-1">
                          <strong className="text-role-title wrap-anywhere">{t("settings.profile.avatar.label")}</strong>
                          <span className="text-role-body text-fg-muted">{t("settings.profile.avatar.hint")}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-5 tablet:gap-4 mobile:grid-cols-1">
                        <Field>
                          <FieldLabel htmlFor="sName">{t("settings.profile.name.label")}</FieldLabel>
                          <Input
                            id="sName"
                            value={profile.name}
                            maxLength={20}
                            autoComplete="name"
                            aria-invalid={nameTouched && nameError ? true : undefined}
                            aria-describedby={nameTouched && nameError ? "sNameErr" : "sNameHint"}
                            onBlur={() => setNameTouched(true)}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          />
                          {nameTouched && nameError ? <FieldError id="sNameErr">{nameError}</FieldError> : <FieldDescription id="sNameHint">{t("settings.profile.name.max")}</FieldDescription>}
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="sEmail">{t("settings.profile.email.label")}</FieldLabel>
                          <Input id="sEmail" type="email" value={S.profile.email} readOnly aria-describedby="sEmailHint" className="bg-surface-muted text-fg-muted" />
                          <FieldDescription id="sEmailHint">{t("settings.profile.email.hint")}</FieldDescription>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="sTitle">{t("settings.profile.title.label")}</FieldLabel>
                          <Input id="sTitle" value={profile.title} autoComplete="organization-title" aria-describedby="sTitleHint" onChange={(e) => setProfile({ ...profile, title: e.target.value })} />
                          <FieldDescription id="sTitleHint">{t("settings.profile.title.hint")}</FieldDescription>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="sLang">{t("settings.profile.language.label")}</FieldLabel>
                          <Select id="sLang" value={profile.language} aria-describedby="sLangHint" onChange={(e) => setProfile({ ...profile, language: e.target.value })}>
                            {S.profile.languages.map((l) => (
                              <option key={l.key} value={l.key}>
                                {l.label}
                              </option>
                            ))}
                          </Select>
                          <FieldDescription id="sLangHint">{t("settings.profile.language.hint")}</FieldDescription>
                        </Field>
                        <Field className="col-span-full">
                          <FieldLabel htmlFor="sBio">{t("settings.profile.bio.label")}</FieldLabel>
                          <Textarea
                            id="sBio"
                            value={profile.bio}
                            maxLength={S.profile.bioMax}
                            placeholder={t("settings.profile.bio.placeholder")}
                            aria-describedby="sBioHint"
                            className="min-h-[calc(var(--size-control-md)*2+var(--space-2))]"
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          />
                          <div className="flex justify-between gap-3">
                            <FieldDescription id="sBioHint">{t("settings.profile.bio.max", { n: S.profile.bioMax })}</FieldDescription>
                            <CharCounter value={profile.bio.length} max={S.profile.bioMax} />
                          </div>
                        </Field>
                        <Field className="col-span-full">
                          <FieldLabel id="sTzLabel" htmlFor="sTz">
                            {t("settings.profile.timezone.label")}
                          </FieldLabel>
                          <Combobox
                            id="sTz"
                            variant="input"
                            aria-labelledby="sTzLabel"
                            aria-describedby="sTzHint"
                            value={profile.timezone}
                            onChange={(v) => setProfile({ ...profile, timezone: v ?? profile.timezone })}
                            placeholder={t("settings.profile.timezone.placeholder")}
                            searchPlaceholder={t("settings.profile.timezone.placeholder")}
                            emptyText={t("settings.profile.timezone.empty")}
                            options={S.profile.timezones.map((z) => ({ value: z.key, label: z.label, keywords: z.key, trailing: <span className="font-mono text-role-caption text-fg-muted">{z.key}</span> }))}
                          />
                          <FieldDescription id="sTzHint">{t("settings.profile.timezone.hint")}</FieldDescription>
                        </Field>
                      </div>
                    </fieldset>
                    <SaveBar dirty={dirty.profile} busy={busyOf("profile")} onReset={() => setProfile(savedProfile)} />
                  </form>
                </CardContent>
              </Card>
            </section>
          ) : null}

          {/* ---------------- 账号安全 ---------------- */}
          {tab === "security" ? (
            <section role="tabpanel" id={tabPanelId("security")} aria-labelledby={tabId("security")} className="flex flex-col gap-6 mobile:gap-4">
              <Card className="mobile:p-4">
                <SectionHead title={t("settings.security.password.title")} description={t("settings.security.password.updatedAt", { date: S.security.passwordUpdatedAt.slice(0, 10) })} />
                <CardContent>
                  <form onSubmit={submitPassword} aria-busy={busyOf("password") || undefined} noValidate>
                    <fieldset disabled={busyOf("password")} className="min-w-0 border-0 p-0">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-5 tablet:gap-4 mobile:grid-cols-1">
                        <Field className="col-span-full">
                          <FieldLabel htmlFor="pwCur">{t("settings.security.password.current")}</FieldLabel>
                          <PasswordInput
                            id="pwCur"
                            value={pw.current}
                            autoComplete="current-password"
                            showLabel={t("login.password.show")}
                            hideLabel={t("login.password.hide")}
                            onChange={(e) => setPw({ ...pw, current: e.target.value })}
                          />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="pwNew">{t("settings.security.password.new")}</FieldLabel>
                          <PasswordInput
                            id="pwNew"
                            value={pw.next}
                            autoComplete="new-password"
                            aria-describedby="pwStrength"
                            showLabel={t("login.password.show")}
                            hideLabel={t("login.password.hide")}
                            onChange={(e) => {
                              setPw({ ...pw, next: e.target.value })
                              setPwError(null)
                            }}
                          />
                          <div data-level={strength} className="flex flex-col gap-2">
                            <div className="grid grid-cols-3 gap-1" aria-hidden>
                              {[1, 2, 3].map((i) => (
                                <span
                                  key={i}
                                  className={cn(
                                    "h-track rounded-full bg-surface-muted transition-colors duration-(--motion-fast) ease-std",
                                    strength >= i && (strength === 1 ? "bg-danger" : strength === 2 ? "bg-warning" : "bg-success"),
                                  )}
                                />
                              ))}
                            </div>
                            <p id="pwStrength" className="flex justify-between gap-3 text-role-caption text-fg-muted">
                              <span>{t("settings.security.password.strength", { level: "" })}</span>
                              <span className={cn(strength === 1 && "text-danger", strength === 2 && "text-warning", strength === 3 && "text-success")}>{strengthLabel}</span>
                            </p>
                          </div>
                          <ul aria-label={t("settings.security.password.rules")} className="flex flex-wrap gap-x-4 gap-y-2 text-role-caption text-fg-muted">
                            {S.security.passwordRules.map((r, i) => {
                              const ok = ruleOk(pw.next, i)
                              return (
                                <li key={r} data-ok={ok || undefined} className={cn("inline-flex items-center gap-1", ok && "text-success")}>
                                  {ok ? <CheckIcon aria-hidden className="size-icon-sm" /> : <CircleIcon aria-hidden className="size-icon-sm" />}
                                  {r}
                                </li>
                              )
                            })}
                          </ul>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="pwConfirm">{t("settings.security.password.confirm")}</FieldLabel>
                          <PasswordInput
                            id="pwConfirm"
                            ref={confirmRef}
                            value={pw.confirm}
                            autoComplete="new-password"
                            aria-invalid={pwError ? true : undefined}
                            aria-describedby={pwError ? "pwConfirmErr" : "pwConfirmHint"}
                            showLabel={t("login.password.show")}
                            hideLabel={t("login.password.hide")}
                            onChange={(e) => {
                              setPw({ ...pw, confirm: e.target.value })
                              setPwError(null)
                            }}
                          />
                          {pwError ? <FieldError id="pwConfirmErr">{t("settings.security.password.mismatch")}</FieldError> : <FieldDescription id="pwConfirmHint">{t("settings.security.password.confirmHint")}</FieldDescription>}
                        </Field>
                      </div>
                    </fieldset>
                    <SaveBar dirty={dirty.password} busy={busyOf("password")} saveLabel={t("settings.security.password.submit")} onReset={() => setPw({ current: "", next: "", confirm: "" })} />
                  </form>
                </CardContent>
              </Card>

              <Card className="mobile:p-4">
                <SectionHead
                  className={cn(twofa !== "setup" && "mb-0")}
                  title={t("settings.security.2fa.title")}
                  description={t("settings.security.2fa.description")}
                  actions={
                    <span className="flex min-h-hit items-center gap-3">
                      {twofa === "on" ? (
                        <Tag tone="success">{t("settings.security.2fa.status.on")}</Tag>
                      ) : twofa === "setup" ? (
                        <Tag tone="warning">{t("settings.security.2fa.status.pending")}</Tag>
                      ) : (
                        <Tag tone="neutral">{t("settings.security.2fa.status.off")}</Tag>
                      )}
                      <span className="inline-grid size-hit place-items-center">
                        <Switch
                          id="twofaSwitch"
                          aria-label={t("settings.security.2fa.switch")}
                          checked={twofa !== "off"}
                          onCheckedChange={(on) => {
                            if (twofa === "on") openLocal("2fa-disable")
                            else if (twofa === "setup") {
                              setTwofa("off")
                              setOtp("")
                              setOtpInvalid(false)
                            } else if (on) setTwofa("setup")
                          }}
                        />
                      </span>
                    </span>
                  }
                />
                {twofa === "setup" ? (
                  <CardContent className="mt-5 grid grid-cols-[calc(var(--size-sparkline)*5)_minmax(0,1fr)] gap-6 border-t pt-5 mobile:grid-cols-1 mobile:justify-items-center">
                    <div className="size-[calc(var(--size-sparkline)*5)] rounded-md border bg-(--color-role-scan-bg) p-2 text-(--color-role-scan-fg)">
                      <QrFigure seed={S.security.twoFactor.otpauth} label={t("settings.security.2fa.qr.aria")} />
                    </div>
                    <div className="flex w-full min-w-0 flex-col gap-4">
                      <p className="text-role-body text-fg-muted">{S.security.twoFactor.hint}</p>
                      <details className="group">
                        <summary className="inline-flex min-h-hit cursor-pointer list-none items-center gap-1 rounded-sm text-role-label text-link [&::-webkit-details-marker]:hidden">
                          {t("settings.security.2fa.manual")}
                          <ChevronDownIcon aria-hidden className="size-icon-sm transition-transform duration-(--motion-fast) ease-std group-open:rotate-180" />
                        </summary>
                        <div className="flex items-center gap-2 rounded-md bg-surface-muted py-2 pr-2 pl-3">
                          <code className="min-w-0 flex-1 font-mono text-role-caption tracking-wide wrap-anywhere">{S.security.twoFactor.manualKey}</code>
                          <IconButton label={t("settings.security.2fa.copy")} onClick={copyKey}>
                            <CopyIcon />
                          </IconButton>
                        </div>
                      </details>
                      <Field>
                        <span id="otpLabel" className="text-role-label">
                          {t("settings.security.2fa.code.label")}
                        </span>
                        <OTPInput
                          length={S.security.twoFactor.codeLength}
                          value={otp}
                          onChange={(v) => {
                            setOtp(v)
                            setOtpInvalid(false)
                          }}
                          invalid={otpInvalid && local !== "2fa"}
                          aria-labelledby="otpLabel"
                          cellLabel={(i) => `${t("settings.security.2fa.code.label")} ${i + 1}`}
                          className="flex-wrap"
                        />
                        <FieldError>{otpInvalid && local !== "2fa" ? t("settings.security.2fa.code.invalid") : null}</FieldError>
                      </Field>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button type="button" disabled={verifying} aria-busy={verifying || undefined} onClick={() => verify(otp, () => undefined)} className="mobile:flex-1">
                          {verifying ? (
                            <>
                              <LoaderCircleIcon aria-hidden className="animate-spin" />
                              {t("settings.security.2fa.verifying")}
                            </>
                          ) : (
                            t("settings.security.2fa.verify")
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setTwofa("off")
                            setOtp("")
                            setOtpInvalid(false)
                          }}
                          className="mobile:flex-1"
                        >
                          {t("settings.security.2fa.dialog.back")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                ) : null}
              </Card>

              <Card className="mobile:p-4">
                <SectionHead
                  title={t("settings.security.sessions.title")}
                  description={t("settings.security.sessions.description")}
                  actions={
                    empty ? null : (
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={others.length === 0}
                      onClick={() => {
                        setSessions((list) => list.filter((s) => s.current))
                        toast.success(t("settings.security.sessions.revokeAll.toast"), { duration: tokenMs("--timing-toast-stay") })
                      }}
                    >
                      {t("settings.security.sessions.revokeAll")}
                    </Button>
                    )
                  }
                />
                <CardContent>
                  <ul className="flex flex-col">
                    {visibleSessions.map((s) => {
                      const Icon = sessionIcon(s.device)
                      return (
                        <li key={s.id} className="grid min-h-table-row grid-cols-[var(--size-avatar-md)_minmax(0,1fr)_auto] items-center gap-3 border-b py-2 last:border-b-0 mobile:grid-cols-[var(--size-avatar-md)_minmax(0,1fr)]">
                          <span className="grid size-avatar-md place-items-center rounded-md bg-surface-muted text-fg-muted">
                            <Icon aria-hidden className="size-icon-md" />
                          </span>
                          <div className="flex min-w-0 flex-col gap-1">
                            <span className="flex flex-wrap items-center gap-2 text-role-label">
                              {s.device}
                              {s.current ? (
                                <Tag tone="success" dot={false}>
                                  {t("settings.security.sessions.current")}
                                </Tag>
                              ) : null}
                            </span>
                            <span className="text-role-caption text-fg-muted wrap-anywhere">
                              {s.location} · {s.ip} · {t("settings.security.sessions.lastActive", { time: formatRelative(s.lastActiveAt) })}
                            </span>
                          </div>
                          {s.current ? null : (
                            <div className="flex items-center mobile:col-start-2">
                              <Button
                                type="button"
                                variant="ghost"
                                aria-label={t("settings.security.sessions.revokeAria", { device: s.device })}
                                className="-mr-3 mobile:mr-0 mobile:-ml-3"
                                onClick={() => {
                                  setSessions((list) => list.filter((x) => x.id !== s.id))
                                  toast.success(t("settings.security.sessions.toast", { device: s.device }), { duration: tokenMs("--timing-toast-stay") })
                                }}
                              >
                                {t("settings.security.sessions.revoke")}
                              </Button>
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                  {others.length === 0 ? <EmptyInline className="mt-3">{t("settings.security.sessions.empty")}</EmptyInline> : null}
                </CardContent>
              </Card>
            </section>
          ) : null}

          {/* ---------------- 通知 ---------------- */}
          {tab === "notifications" ? (
            <section role="tabpanel" id={tabPanelId("notifications")} aria-labelledby={tabId("notifications")} className="flex flex-col gap-6 mobile:gap-4">
              <Card className="mobile:p-4">
                <SectionHead
                  title={t("settings.notifications.title")}
                  description={t("settings.notifications.description")}
                  actions={
                    <Segmented type="single" value={channel} aria-label={t("settings.notifications.channel.aria")} onValueChange={(v) => v && set({ channel: v === "all" ? null : v })}>
                      <SegmentedItem value="all">{t("settings.notifications.channel.all")}</SegmentedItem>
                      {S.notifications.channels.map((c) => (
                        <SegmentedItem key={c.key} value={c.key}>
                          {c.label}
                        </SegmentedItem>
                      ))}
                    </Segmented>
                  }
                />
                <CardContent>
                  <form onSubmit={submitNotifications} aria-busy={busyOf("notifications") || undefined} noValidate>
                    <fieldset disabled={busyOf("notifications")} className="min-w-0 border-0 p-0">
                      <TableWrap className="mobile:-mx-4 mobile:px-4">
                        <Table className="table-fixed mobile:table-auto">
                          <caption className="sr-only">{t("settings.notifications.title")}</caption>
                          <TableHeader>
                            <TableRow className="hover:[&>td]:bg-transparent">
                              <TableHead scope="col">{t("settings.notifications.col.event")}</TableHead>
                              {visibleChannels.map((c) => (
                                <TableHead key={c.key} scope="col" className="w-[calc(var(--size-hit)*2)] text-center mobile:w-[calc(var(--size-hit)+var(--space-3))] mobile:px-1">
                                  {c.label}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {S.notifications.groups.map((g) => (
                              <React.Fragment key={g.key}>
                                <TableRow className="hover:[&>td]:bg-bg">
                                  <TableCell colSpan={visibleChannels.length + 1} className="rounded-sm bg-bg px-3 py-1 first:pl-3 last:pr-3 mobile:px-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <strong className="mr-auto text-role-label text-fg-muted">{g.label}</strong>
                                      <Button type="button" variant="ghost" size="sm" className="min-h-hit" onClick={() => setGroup(g, true)}>
                                        {t("settings.notifications.enableAll")}
                                      </Button>
                                      <Button type="button" variant="ghost" size="sm" className="min-h-hit" onClick={() => setGroup(g, false)}>
                                        {t("settings.notifications.disableAll")}
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                                {g.items.map((it) => (
                                  <TableRow key={it.key}>
                                    <TableCell className="whitespace-normal">
                                      <div className="flex flex-col gap-1 py-1">
                                        <strong className="text-role-label wrap-anywhere">{it.label}</strong>
                                        <span className="text-role-caption text-fg-muted wrap-anywhere">{it.description}</span>
                                      </div>
                                    </TableCell>
                                    {visibleChannels.map((c) => {
                                      const ck = c.key as ChannelKey
                                      return (
                                        <TableCell key={c.key} className="px-0 text-center">
                                          <span className="inline-grid size-hit place-items-center">
                                            <Switch
                                              aria-label={t("settings.notifications.item.aria", { item: it.label, channel: c.label })}
                                              checked={prefs[it.key][ck]}
                                              onCheckedChange={(on) => setPrefs((p) => ({ ...p, [it.key]: { ...p[it.key], [ck]: on } }))}
                                            />
                                          </span>
                                        </TableCell>
                                      )
                                    })}
                                  </TableRow>
                                ))}
                              </React.Fragment>
                            ))}
                          </TableBody>
                        </Table>
                      </TableWrap>

                    </fieldset>
                    <SaveBar
                      dirty={dirty.notifications}
                      busy={busyOf("notifications")}
                      onReset={() => {
                        setPrefs(savedPrefs)
                        setQuiet(savedQuiet)
                      }}
                    />
                  </form>
                </CardContent>
              </Card>

              <Card className="mobile:p-4">
                <SectionHead
                  title={t("settings.notifications.quiet.title")}
                  description={t("settings.notifications.quiet.description")}
                  actions={
                    <span className="inline-grid size-hit place-items-center">
                      <Switch id="quietSwitch" aria-label={t("settings.notifications.quiet.title")} aria-controls="quietBody" checked={quiet.enabled} disabled={busyOf("notifications")} onCheckedChange={(on) => setQuiet({ ...quiet, enabled: on })} />
                    </span>
                  }
                />
                <CardContent id="quietBody" aria-disabled={!quiet.enabled || undefined} className={cn("grid max-w-form-max grid-cols-2 gap-x-6 gap-y-5 mobile:max-w-none mobile:gap-3", !quiet.enabled && "opacity-(--opacity-disabled)")}>
                    <Field>
                      <FieldLabel htmlFor="quietFrom">{t("settings.notifications.quiet.from")}</FieldLabel>
                      <Input id="quietFrom" type="time" value={quiet.from} disabled={!quiet.enabled || busyOf("notifications")} className="tabular-nums" onChange={(e) => setQuiet({ ...quiet, from: e.target.value })} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="quietTo">{t("settings.notifications.quiet.to")}</FieldLabel>
                      <Input id="quietTo" type="time" value={quiet.to} disabled={!quiet.enabled || busyOf("notifications")} className="tabular-nums" onChange={(e) => setQuiet({ ...quiet, to: e.target.value })} />
                    </Field>
                  </CardContent>
              </Card>
            </section>
          ) : null}

          {/* ---------------- 团队 ---------------- */}
          {tab === "team" ? (
            <section role="tabpanel" id={tabPanelId("team")} aria-labelledby={tabId("team")} className="flex flex-col gap-6 mobile:gap-4">
              <Card className="mobile:p-4">
                <SectionHead
                  title={t("settings.team.title")}
                  description={S.team.workspaceName}
                  actions={
                    <p className="flex items-center gap-3 text-role-caption whitespace-nowrap text-fg-muted mobile:w-full" aria-live="polite">
                      <span>{t("settings.team.seats", { used: seatsUsed, total: S.team.seats.total })}</span>
                      <span
                        role="progressbar"
                        aria-label={t("settings.team.seats.aria")}
                        aria-valuenow={seatsUsed}
                        aria-valuemin={0}
                        aria-valuemax={S.team.seats.total}
                        className="h-2 w-32 overflow-hidden rounded-full bg-surface-muted mobile:w-auto mobile:flex-1"
                      >
                        <span className="block h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.round((seatsUsed / S.team.seats.total) * 100))}%` }} />
                      </span>
                    </p>
                  }
                />
                <CardContent className="flex flex-col gap-5">
                  <form onSubmit={sendInvites} noValidate className="grid grid-cols-[minmax(0,1fr)_calc(var(--size-settings-tabs)*0.75)_auto] items-start gap-4 rounded-md bg-bg p-5 mobile:grid-cols-1 mobile:p-4">
                    <Field>
                      <FieldLabel htmlFor="inviteInput">{t("settings.team.invite.label")}</FieldLabel>
                      <TagInput
                        id="inviteInput"
                        type="email"
                        value={emails}
                        onChange={onEmailsChange}
                        invalid={Boolean(inviteError)}
                        disabled={sending}
                        placeholder={t("settings.team.invite.placeholder")}
                        removeLabel={(e) => t("settings.team.invite.removeAria", { email: e })}
                        aria-describedby={inviteError ? "inviteErr" : "inviteHint"}
                        chipTone="primary"
                        onInput={() => setInviteError(null)}
                      />
                      {inviteError ? <FieldError id="inviteErr">{inviteError}</FieldError> : <FieldDescription id="inviteHint">{S.team.inviteHint}</FieldDescription>}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="inviteRole">{t("settings.team.invite.role")}</FieldLabel>
                      <Select id="inviteRole" value={inviteRole} disabled={sending} onChange={(e) => setInviteRole(e.target.value)}>
                        {S.team.roles.map((r) => (
                          <option key={r.key} value={r.key}>
                            {r.label}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <div className="pt-[calc(var(--font-size-sm)*var(--font-line-height-snug)+var(--space-2))] mobile:pt-0">
                      <Button type="submit" disabled={sending || seatsFull} aria-busy={sending || undefined} className="mobile:w-full">
                        {sending ? (
                          <>
                            <LoaderCircleIcon aria-hidden className="animate-spin" />
                            {t("settings.team.invite.sending")}
                          </>
                        ) : (
                          <>
                            <SendIcon aria-hidden />
                            {t("settings.team.invite.submit")}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* 成员表（≥768） */}
                  <TableWrap className="mobile:hidden">
                    <Table aria-label={t("settings.team.table.aria")}>
                      <TableHeader>
                        <TableRow className="hover:[&>td]:bg-transparent">
                          <TableHead scope="col">{t("settings.team.col.member")}</TableHead>
                          <TableHead scope="col" className="w-[calc(var(--size-settings-tabs)*0.75)] tablet:w-auto">
                            {t("settings.team.col.role")}
                          </TableHead>
                          <TableHead scope="col">
                            {t("settings.team.col.joinedAt")}
                            <span className="hidden tablet:block">{t("settings.team.col.lastActive")}</span>
                          </TableHead>
                          <TableHead scope="col" className="tablet:hidden">
                            {t("settings.team.col.lastActive")}
                          </TableHead>
                          <TableHead scope="col" className="w-hit text-right">
                            <span className="sr-only">{t("settings.team.col.actions")}</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visibleMembers.map((m) => {
                          const who = TEAM_BY_ID.get(m.id)
                          if (!who) return null
                          const self = m.id === SELF_ID
                          return (
                            <TableRow key={m.id}>
                              <TableCell className="py-1 whitespace-normal tablet:px-2">
                                <div className="flex min-w-0 items-center gap-3">
                                  <Avatar initial={who.initial} hue={who.avatarHue} name={who.name} />
                                  <div className="flex min-w-0 flex-col gap-1">
                                    <span className="flex flex-wrap items-center gap-2 text-role-label wrap-anywhere">
                                      {who.name}
                                      {self ? (
                                        <Tag tone="info" dot={false}>
                                          {t("settings.team.you")}
                                        </Tag>
                                      ) : null}
                                    </span>
                                    <span className="text-role-caption text-fg-muted wrap-anywhere">
                                      {who.email}
                                      <span className="tablet:hidden"> · </span>
                                      <span className="tablet:block whitespace-nowrap">{who.title}</span>
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-1 tablet:px-2">
                                {self ? (
                                  <Tag tone="info" dot={false} title={t("settings.team.roleSelf")}>
                                    {roleLabel(roles[m.id])}
                                  </Tag>
                                ) : (
                                <Select
                                  aria-label={t("settings.team.role.aria", { name: who.name })}
                                  value={roles[m.id]}
                                  wrapClassName="min-w-[calc(var(--size-settings-tabs)*0.6)] tablet:min-w-[calc(var(--size-settings-tabs)*0.5)]"
                                  onChange={(e) => {
                                    const role = S.team.roles.find((r) => r.key === e.target.value)
                                    setRoles({ ...roles, [m.id]: e.target.value })
                                    if (role) toast.success(t("settings.team.role.toast", { name: who.name, role: role.label }), { duration: tokenMs("--timing-toast-stay") })
                                  }}
                                >
                                  {S.team.roles.map((r) => (
                                    <option key={r.key} value={r.key}>
                                      {r.label}
                                    </option>
                                  ))}
                                </Select>
                                )}
                              </TableCell>
                              <TableCell className="py-1 text-fg-muted tabular-nums tablet:px-2 tablet:whitespace-normal">
                                <span className="whitespace-nowrap">{m.joinedAt}</span>
                                <span className="hidden text-role-caption whitespace-nowrap tablet:block">{self ? t("settings.security.sessions.now") : formatRelative(m.lastActiveAt)}</span>
                              </TableCell>
                              <TableCell className="py-1 text-fg-muted tabular-nums tablet:hidden">{self ? t("settings.security.sessions.now") : formatRelative(m.lastActiveAt)}</TableCell>
                              <TableCell className="py-1 text-right tablet:px-2">
                                {self ? (
                                  <span aria-hidden className="inline-block size-hit" />
                                ) : (
                                  <IconButton
                                    label={t("settings.team.remove.aria", { name: who.name })}
                                    title={t("settings.team.remove")}
                                    className="-mr-2"
                                    onClick={() => {
                                      setRemoveId(m.id)
                                      openLocal("remove")
                                    }}
                                  >
                                    <Trash2Icon />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableWrap>

                  {/* 成员卡（≤768） */}
                  <ul className="hidden flex-col gap-3 mobile:flex" aria-label={t("settings.team.table.aria")}>
                    {visibleMembers.map((m) => {
                      const who = TEAM_BY_ID.get(m.id)
                      if (!who) return null
                      const self = m.id === SELF_ID
                      return (
                        <li key={m.id} className="grid grid-cols-[var(--size-avatar-md)_minmax(0,1fr)] gap-x-3 gap-y-2 rounded-md border px-4 py-3">
                          <Avatar initial={who.initial} hue={who.avatarHue} name={who.name} />
                          <div className="flex min-w-0 flex-col gap-1">
                            <span className="flex flex-wrap items-center gap-2 text-role-label">
                              {who.name}
                              {self ? (
                                <Tag tone="info" dot={false}>
                                  {t("settings.team.you")}
                                </Tag>
                              ) : null}
                            </span>
                            <span className="text-role-caption text-fg-muted wrap-anywhere">{who.email}</span>
                            <span className="text-role-caption text-fg-muted wrap-anywhere tabular-nums">
                              {who.title} · <span className="whitespace-nowrap">{t("settings.team.joinedAt", { date: m.joinedAt })}</span> ·{" "}
                              <span className="whitespace-nowrap">{t("settings.team.lastActive", { time: self ? t("settings.security.sessions.now") : formatRelative(m.lastActiveAt) })}</span>
                            </span>
                          </div>
                          <div className="col-start-2 flex items-center gap-2">
                            {self ? (
                              <Tag tone="info" dot={false} title={t("settings.team.roleSelf")}>
                                {roleLabel(roles[m.id])}
                              </Tag>
                            ) : (
                            <Select
                              aria-label={t("settings.team.role.aria", { name: who.name })}
                              value={roles[m.id]}
                              wrapClassName="flex-1"
                              onChange={(e) => {
                                const role = S.team.roles.find((r) => r.key === e.target.value)
                                setRoles({ ...roles, [m.id]: e.target.value })
                                if (role) toast.success(t("settings.team.role.toast", { name: who.name, role: role.label }), { duration: tokenMs("--timing-toast-stay") })
                              }}
                            >
                              {S.team.roles.map((r) => (
                                <option key={r.key} value={r.key}>
                                  {r.label}
                                </option>
                              ))}
                            </Select>
                            )}
                            {self ? null : (
                              <Button
                                type="button"
                                variant="ghost"
                                aria-label={t("settings.team.remove.aria", { name: who.name })}
                                className="-mr-3 text-danger hover:text-danger"
                                onClick={() => {
                                  setRemoveId(m.id)
                                  openLocal("remove")
                                }}
                              >
                                {t("settings.team.remove")}
                              </Button>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                  {visibleMembers.length <= 1 ? <EmptyInline>{t("settings.team.empty")}</EmptyInline> : null}
                </CardContent>
              </Card>

              <Card className="mobile:p-4">
                <SectionHead title={t("settings.team.pending.title")} description={t("settings.team.pending.description")} />
                <CardContent>
                  {visibleInvites.length === 0 ? (
                    <EmptyInline>{t("settings.team.pending.empty")}</EmptyInline>
                  ) : (
                    <ul className="flex flex-col">
                      {visibleInvites.map((inv) => {
                        const by = TEAM_BY_ID.get(inv.invitedBy)
                        const role = S.team.roles.find((r) => r.key === inv.role)
                        return (
                          <li key={inv.email} className="grid min-h-table-row grid-cols-[var(--size-avatar-md)_minmax(0,1fr)_auto] items-center gap-3 border-b py-2 last:border-b-0 mobile:grid-cols-[var(--size-avatar-md)_minmax(0,1fr)]">
                            <span className="grid size-avatar-md place-items-center rounded-md bg-surface-muted text-fg-muted">
                              <MailIcon aria-hidden className="size-icon-md" />
                            </span>
                            <div className="flex min-w-0 flex-col gap-1">
                              <span className="flex flex-wrap items-center gap-2 text-role-label wrap-anywhere">
                                {inv.email}
                                <Tag tone="warning">{t("settings.team.pending.status")}</Tag>
                              </span>
                              <span className="text-role-caption text-fg-muted wrap-anywhere tabular-nums">
                                {role?.label} · {t("settings.team.pending.invitedAt", { date: inv.invitedAt.slice(0, 10), name: by?.name ?? inv.invitedBy })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mobile:col-start-2 mobile:-ml-3">
                              <Button type="button" variant="ghost" size="sm" className="min-h-hit" onClick={() => toast.success(t("settings.team.pending.resend.toast", { email: inv.email }), { duration: tokenMs("--timing-toast-stay") })}>
                                {t("settings.team.pending.resend")}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="-mr-3 min-h-hit text-danger hover:text-danger mobile:mr-0"
                                onClick={() => {
                                  setInvites((list) => list.filter((x) => x.email !== inv.email))
                                  toast(t("settings.team.pending.revoke.toast", { email: inv.email }), { duration: tokenMs("--timing-toast-stay") })
                                }}
                              >
                                {t("settings.team.pending.revoke")}
                              </Button>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </section>
          ) : null}

          {/* ---------------- 计费 ---------------- */}
          {tab === "billing" ? (
            <section role="tabpanel" id={tabPanelId("billing")} aria-labelledby={tabId("billing")} className="flex flex-col gap-6 mobile:gap-4">
              <Card className="mobile:p-4">
                <SectionHead title={t("settings.billing.current.title")} />
                <CardContent className="flex items-start justify-between gap-4 mobile:flex-col mobile:items-stretch">
                  <div className="flex min-w-0 flex-col gap-2">
                    <p className="flex flex-wrap items-center gap-2 text-role-heading">
                      {current.label}
                      <Tag tone="success">{cycleLabel(planCycle)}</Tag>
                    </p>
                    <p className="text-role-body text-fg-muted wrap-anywhere tabular-nums">
                      {formatCurrencyWhole(planCycle === "yearly" ? current.yearly : current.monthly)} {t(`settings.billing.plan.unit.${planCycle}`)} ·{" "}
                      {t("settings.billing.current.seats", { n: current.seats })}{" "}
                      · {t("settings.billing.current.renews", { date: "" })}
                      <b className="font-medium text-fg">{S.billing.renewsAt}</b>
                    </p>
                    <p className="text-role-body text-fg-muted wrap-anywhere">
                      {t("settings.billing.current.payment")}：{S.billing.paymentMethod.label}（{S.billing.paymentMethod.account}）·{" "}
                      <a href="#" aria-disabled="true" onClick={(e) => e.preventDefault()} title={t("shell.nav.disabled.tip")} className="-my-3 inline-flex min-h-hit cursor-not-allowed items-center rounded-xs px-1 text-link">
                        {t("settings.billing.current.change")}
                      </a>{" "}
                      ·{" "}
                      <a href="#" aria-disabled="true" onClick={(e) => e.preventDefault()} title={t("shell.nav.disabled.tip")} className="-my-3 inline-flex min-h-hit cursor-not-allowed items-center rounded-xs px-1 text-danger">
                        {t("settings.billing.current.cancel")}
                      </a>
                    </p>
                  </div>
                  <Button type="button" variant="secondary" className="shrink-0 mobile:self-start" onClick={() => document.getElementById("settings-change-plan")?.scrollIntoView({ block: "start", behavior: "smooth" })}>
                    {t("settings.billing.current.manage")}
                  </Button>
                </CardContent>
              </Card>

              <Card className="mobile:p-4">
                <SectionHead
                  title={<span id="settings-change-plan">{t("settings.billing.change.title")}</span>}
                  description={t("settings.billing.change.description")}
                  actions={
                    <>
                      <button
                        type="button"
                        aria-pressed={cycle === "monthly"}
                        onClick={() => setCycle("monthly")}
                        className={cn("min-h-hit rounded-sm px-2 text-role-label focus-visible:outline-focus focus-visible:outline-focus-ring", cycle === "monthly" ? "text-fg" : "text-fg-muted")}
                      >
                        {t("settings.billing.cycle.monthly")}
                      </button>
                      <Switch checked={cycle === "yearly"} aria-label={t("settings.billing.cycle.aria")} onCheckedChange={(v) => setCycle(v ? "yearly" : "monthly")} />
                      <button
                        type="button"
                        aria-pressed={cycle === "yearly"}
                        onClick={() => setCycle("yearly")}
                        className={cn("min-h-hit rounded-sm px-2 text-role-label focus-visible:outline-focus focus-visible:outline-focus-ring", cycle === "yearly" ? "text-fg" : "text-fg-muted")}
                      >
                        {t("settings.billing.cycle.yearly")}
                      </button>
                      <Tag tone="success" dot={false}>
                        {t("settings.billing.cycle.saveBadge")}
                      </Tag>
                    </>
                  }
                />
                <CardContent className="grid grid-cols-3 gap-4 mobile:grid-cols-1">
                {S.billing.plans.map((p) => {
                  const isCurrent = p.key === plan && planCycle === cycle
                  const idx = S.billing.plans.findIndex((x) => x.key === p.key)
                  const curIdx = S.billing.plans.findIndex((x) => x.key === plan)
                  const price = cycle === "yearly" ? p.yearly : p.monthly
                  const up = idx > curIdx || (p.key === plan && cycle === "yearly" && planCycle === "monthly")
                  const actionLabel = isCurrent
                    ? t("settings.billing.plan.current")
                    : p.key === plan
                      ? t(cycle === "yearly" ? "settings.billing.plan.toYearly" : "settings.billing.plan.toMonthly")
                      : p.key === "business" && up
                        ? t("settings.billing.plan.contact")
                        : up
                          ? t("settings.billing.plan.upgrade", { plan: p.label })
                          : t("settings.billing.plan.downgrade", { plan: p.label })
                  return (
                    <PricingCard
                      key={p.key}
                      name={p.label}
                      price={formatCurrencyWhole(price)}
                      suffix={t(`settings.billing.plan.unit.${cycle}`)}
                      note={cycle === "yearly" ? `${t("settings.billing.plan.price.yearlyPerMonth", { n: Math.round(p.yearly / 12) })} · ${S.billing.yearlyDiscountLabel}` : t("settings.billing.plan.yearlyNote", { n: p.yearly })}
                      features={p.features}
                      featureLabels={{ included: t("settings.billing.plan.included"), excluded: t("settings.billing.plan.excluded") }}
                      recommended={p.recommended}
                      recommendedLabel={t("settings.billing.plan.recommended")}
                      current={isCurrent}
                      className={cn("p-5 mobile:p-4", isCurrent && "border-primary shadow-[0_0_0_var(--border-width-hairline)_var(--color-role-primary)]")}
                      action={
                        <Button type="button" variant={!isCurrent && up ? "primary" : "secondary"} disabled={isCurrent} onClick={() => choosePlan(p)}>
                          {actionLabel}
                        </Button>
                      }
                    />
                  )
                })}
                </CardContent>
              </Card>

              <Card className="mobile:p-4">
                <SectionHead title={t("settings.billing.invoices.title")} description={t("settings.billing.invoices.description")} />
                <CardContent>
                  {invoices.length === 0 ? (
                    <EmptyInline>{t("settings.billing.invoices.empty")}</EmptyInline>
                  ) : (
                    <>
                      <TableWrap className="mobile:hidden">
                        <Table>
                          <caption className="sr-only">{t("settings.billing.invoices.title")}</caption>
                          <TableHeader>
                            <TableRow className="hover:[&>td]:bg-transparent">
                              <TableHead scope="col">{t("settings.billing.invoices.col.id")}</TableHead>
                              <TableHead scope="col">{t("settings.billing.invoices.col.date")}</TableHead>
                              <TableHead scope="col" className="min-w-[calc(var(--size-settings-tabs)+var(--space-8))] tablet:min-w-0">
                                {t("settings.billing.invoices.col.description")}
                              </TableHead>
                              <TableHead scope="col" className="text-right">
                                {t("settings.billing.invoices.col.amount")}
                              </TableHead>
                              <TableHead scope="col">{t("settings.billing.invoices.col.status")}</TableHead>
                              <TableHead scope="col" className="w-hit text-right">
                                <span className="sr-only">{t("settings.billing.invoices.download")}</span>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {invoices.map((inv) => {
                              const st = invoiceStatus(inv.status)
                              return (
                                <TableRow key={inv.id}>
                                  <TableCell className="font-mono text-role-caption">{inv.id}</TableCell>
                                  <TableCell className="tabular-nums">{inv.issuedAt}</TableCell>
                                  <TableCell className="whitespace-normal tablet:whitespace-normal">{inv.description}</TableCell>
                                  <TableCell className="text-right tabular-nums">{formatCurrency(inv.amount)}</TableCell>
                                  <TableCell>
                                    <Tag tone={st.tone}>{st.label}</Tag>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button type="button" variant="ghost" aria-label={t("settings.billing.invoices.downloadAria", { id: inv.id })} className="-my-2 -mr-3" onClick={() => toast(t("shell.nav.disabled.tip"), { duration: tokenMs("--timing-toast-stay") })}>
                                      <DownloadIcon aria-hidden />
                                      {t("settings.billing.invoices.download")}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </TableWrap>
                      <ul className="hidden flex-col gap-3 mobile:flex" aria-label={t("settings.billing.invoices.title")}>
                        {invoices.map((inv) => {
                          const st = invoiceStatus(inv.status)
                          return (
                            <li key={inv.id} className="flex flex-col gap-2 rounded-md border py-3 pr-3 pl-4">
                              <div className="flex items-center gap-2">
                                <span className="flex-1 font-mono text-role-caption">{inv.id}</span>
                                <Tag tone={st.tone}>{st.label}</Tag>
                              </div>
                              <p className="text-role-body wrap-anywhere">{inv.description}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-role-title tabular-nums">{formatCurrency(inv.amount)}</span>
                                <span className="mr-auto text-role-caption text-fg-muted tabular-nums">{inv.issuedAt}</span>
                                <Button type="button" variant="ghost" aria-label={t("settings.billing.invoices.downloadAria", { id: inv.id })} className="-my-2" onClick={() => toast(t("shell.nav.disabled.tip"), { duration: tokenMs("--timing-toast-stay") })}>
                                  <DownloadIcon aria-hidden />
                                  {t("settings.billing.invoices.downloadShort")}
                                </Button>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>
            </section>
          ) : null}

          {/* ---------------- 危险区（team / billing） ---------------- */}
          {tab === "team" || tab === "billing" ? (
            <Card className="border-danger mobile:p-4">
              <h2 className="mb-4 text-role-title text-danger">{t("settings.danger.title")}</h2>
              <div className="flex items-center justify-between gap-4 mobile:flex-col mobile:items-stretch">
                <p className="text-role-body text-fg-muted wrap-anywhere">
                  <b className="font-medium text-fg">{S.dangerZone.title}</b>
                  {S.dangerZone.description}
                </p>
                <Button type="button" variant="secondary" className="shrink-0 border-danger text-danger hover:not-disabled:border-danger hover:not-disabled:bg-danger-soft mobile:self-start" onClick={() => openLocal("danger")}>
                  <Trash2Icon aria-hidden />
                  {t("settings.danger.delete.button")}
                </Button>
              </div>
            </Card>
          ) : null}
        </div>
      </div>

      {/* ---------------- 浮层 ---------------- */}
      <Dialog {...overlay("2fa")}>
        <DialogContent closeLabel={t("settings.dialog.closeAria")} onOpenAutoFocus={focusDialogClose} className={CENTERED_DIALOG}>
          <DialogHeader>
            <DialogTitle>{t("settings.security.2fa.title")}</DialogTitle>
            <DialogDescription>{S.security.twoFactor.hint}</DialogDescription>
          </DialogHeader>
          <div className="mx-auto size-[calc(var(--size-sparkline)*5)] rounded-md border bg-(--color-role-scan-bg) p-2 text-(--color-role-scan-fg)">
            <QrFigure seed={S.security.twoFactor.otpauth} label={t("settings.security.2fa.qr.aria")} />
          </div>
          <div className="flex flex-col gap-4">
            <details className="group">
              <summary className="inline-flex min-h-hit cursor-pointer list-none items-center gap-1 rounded-sm text-role-label text-link [&::-webkit-details-marker]:hidden">
                {t("settings.security.2fa.manual")}
                <ChevronDownIcon aria-hidden className="size-icon-sm transition-transform duration-(--motion-fast) ease-std group-open:rotate-180" />
              </summary>
              <div className="flex items-center gap-2 rounded-md bg-surface-muted py-2 pr-2 pl-3">
                <code className="min-w-0 flex-1 font-mono text-role-caption tracking-wide wrap-anywhere">{S.security.twoFactor.manualKey}</code>
                <IconButton label={t("settings.security.2fa.copy")} onClick={copyKey}>
                  <CopyIcon />
                </IconButton>
              </div>
            </details>
            <Field>
              <span id="otpLabelDlg" className="text-role-label">
                {t("settings.security.2fa.code.label")}
              </span>
              <OTPInput
                length={S.security.twoFactor.codeLength}
                value={otpDlg}
                onChange={(v) => {
                  setOtpDlg(v)
                  setOtpInvalid(false)
                }}
                invalid={otpInvalid && local === "2fa"}
                aria-labelledby="otpLabelDlg"
                cellLabel={(i) => `${t("settings.security.2fa.code.label")} ${i + 1}`}
                className="flex-wrap justify-center"
              />
              <FieldError>{otpInvalid && local === "2fa" ? t("settings.security.2fa.code.invalid") : null}</FieldError>
            </Field>
          </div>
          <DialogFooter className={DIALOG_ACTS}>
            <Button type="button" variant="secondary" onClick={closeLocal}>
              {t("settings.security.2fa.dialog.back")}
            </Button>
            <Button type="button" disabled={verifying} aria-busy={verifying || undefined} onClick={() => verify(otpDlg, closeLocal)}>
              {verifying ? (
                <>
                  <LoaderCircleIcon aria-hidden className="animate-spin" />
                  {t("settings.security.2fa.verifying")}
                </>
              ) : (
                t("settings.security.2fa.verify")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog {...overlay("2fa-disable")}>
        <AlertDialogContent closeLabel={t("settings.dialog.closeAria")} onOpenAutoFocus={focusDialogClose} className={CENTERED_DIALOG}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("settings.security.2fa.disable.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("settings.security.2fa.disable.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={DIALOG_ACTS}>
            <AlertDialogCancel>{t("settings.security.2fa.dialog.back")}</AlertDialogCancel>
            <AlertDialogAction
              variant="danger"
              onClick={() => {
                setTwofa("off")
                toast(t("settings.security.2fa.disable.toast"), { duration: tokenMs("--timing-toast-stay") })
              }}
            >
              {t("settings.security.2fa.disable.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog {...overlay("remove")}>
        <AlertDialogContent closeLabel={t("settings.dialog.closeAria")} onOpenAutoFocus={focusDialogClose} className={CENTERED_DIALOG}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("settings.team.remove.title", { name: removeTarget?.name ?? "" })}</AlertDialogTitle>
            <AlertDialogDescription>{S.team.removeConfirm.replace("{name}", removeTarget?.name ?? "")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={DIALOG_ACTS}>
            <AlertDialogCancel>{t("settings.team.remove.back")}</AlertDialogCancel>
            <AlertDialogAction
              variant="danger"
              onClick={() => {
                if (!removeTarget) return
                setMembers((list) => list.filter((m) => m.id !== removeTarget.id))
                toast.success(t("settings.team.remove.toast", { name: removeTarget.name }), { duration: tokenMs("--timing-toast-stay") })
                setRemoveId(null)
              }}
            >
              {t("settings.team.remove.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        {...overlay("danger")}
        onOpenChange={(o) => {
          overlay("danger").onOpenChange(o)
          if (!o) {
            setPhrase("")
            setPhraseTouched(false)
          }
        }}
      >
        <AlertDialogContent closeLabel={t("settings.dialog.closeAria")} onOpenAutoFocus={focusDialogClose} className={CENTERED_DIALOG}>
          <form
            noValidate
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              setPhraseTouched(true)
              if (!phraseOk) return
              closeLocal()
              toast.warning(t("settings.danger.toast"), { duration: tokenMs("--timing-toast-stay") })
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>{t("settings.danger.dialog.title", { workspace: S.team.workspaceName })}</AlertDialogTitle>
              <AlertDialogDescription>{t("settings.danger.dialog.description")}</AlertDialogDescription>
            </AlertDialogHeader>
            <Field>
              <FieldLabel htmlFor="dzInput">{t("settings.danger.dialog.input", { phrase: S.dangerZone.confirmPhrase })}</FieldLabel>
              <Input
                id="dzInput"
                value={phrase}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={phraseTouched && !phraseOk ? true : undefined}
                aria-describedby={phraseTouched && !phraseOk ? "dzErr" : "dzHint"}
                onChange={(e) => setPhrase(e.target.value)}
                onBlur={() => setPhraseTouched(phrase.length > 0)}
              />
              {phraseTouched && !phraseOk ? <FieldError id="dzErr">{t("settings.danger.dialog.mismatch")}</FieldError> : <FieldDescription id="dzHint">{t("settings.danger.dialog.hint")}</FieldDescription>}
            </Field>
            <AlertDialogFooter className={DIALOG_ACTS}>
              <AlertDialogCancel type="button">{t("settings.danger.dialog.back")}</AlertDialogCancel>
              <Button type="submit" variant="danger" disabled={!phraseOk}>
                {t("settings.danger.dialog.confirm")}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        {...overlay("leave")}
        onOpenChange={(o) => {
          overlay("leave").onOpenChange(o)
          if (!o) setLeaveTo(null)
        }}
      >
        <AlertDialogContent closeLabel={t("settings.leave.closeAria")} onOpenAutoFocus={focusDialogClose} className={CENTERED_DIALOG}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("settings.leave.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("settings.leave.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={DIALOG_ACTS}>
            <AlertDialogCancel>{t("settings.leave.stay")}</AlertDialogCancel>
            <AlertDialogAction variant="danger" onClick={confirmLeave}>
              {t("settings.leave.leave")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  )
}
