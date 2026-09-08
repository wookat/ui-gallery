import * as React from "react"
import { useSearchParams } from "react-router-dom"
import { cn } from "@/lib/cn"
import {
  ArrowDownIcon,
  ChartPieIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockAlertIcon,
  CopyIcon,
  EllipsisIcon,
  MessageSquareDashedIcon,
  PackageSearchIcon,
  PanelLeftIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  SparklesIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
  TriangleAlertIcon,
  ZapIcon,
} from "lucide-react"

import { BrandMark } from "@/components/composed/brand"
import { AttachmentChip, ChatBubble, Composer, ConversationItem, SourceChip, SuggestionChip, ToolCall } from "@/components/composed/chat"
import { SearchInput } from "@/components/composed/search-input"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconButton } from "@/components/ui/icon-button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { notYet, toast } from "@/components/ui/sonner"
import { t } from "@/data/content"
import { mock } from "@/data/mock"
import { useScreenState } from "@/data/screen-state"
import { formatMonthDay, formatTime } from "@/lib/format"
import { tokenMs, tokenPx, useMaxWidth } from "@/lib/media"

import { AppShell } from "../dashboard/shell"
import { Markdown, REF_ID, withRefIds } from "./markdown"

export const path = "/chat"

const states = ["success", "streaming", "error", "empty", "loading"] as const
type State = (typeof states)[number]

const C = mock.chat
type Conversation = (typeof C.conversations)[number]
type ToolCallData = { name: string; args: string; status: string; durationMs?: number; result?: string }
type Source = { type: string; label: string; href: string }
type Message = { id: string; role: string; at: string; text?: string; markdown?: string; toolCalls?: ToolCallData[]; sources?: Source[] }
const MESSAGES: Record<string, Message[]> = C.messages
type SourceType = React.ComponentProps<typeof SourceChip>["type"]
type ModelKey = (typeof C.models)[number]["key"]

const MAX_CHARS = 2000
const COUNTER_FROM = MAX_CHARS - 200
const MINUTE = 60000

/* 演示用附件 / 追问：文案来自 content/chat.md，时间从当前会话末条消息派生（mock 不单列，与 hifi 内联数据保持一致） */
const DEMO_ATTACHMENT = { name: t("chat.composer.attach.demo.name"), size: t("chat.composer.attach.demo.size") }
const followUpOf = (last: Message | undefined): { id: string; at: string; text: string } => ({
  id: "m_follow",
  at: new Date(new Date(last?.at ?? mock.meta.asOf).getTime() + MINUTE).toISOString(),
  text: t("chat.streaming.followUp"),
})

const SUGGESTION_ICON: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "package-search": PackageSearchIcon,
  "clock-alert": ClockAlertIcon,
  zap: ZapIcon,
  "chart-pie": ChartPieIcon,
}

/* ---------- 时间（相对快照 meta.asOf，Asia/Shanghai 日序号，与 hifi 一致） ---------- */
const DAY = 86400000
const asOf = new Date(mock.meta.asOf)
const dayIndex = (d: Date) => Math.floor((d.getTime() + 8 * 3600000) / DAY)
const todayIdx = dayIndex(asOf)
const dayOffset = (iso: string) => todayIdx - dayIndex(new Date(iso))

const dateLabel = (iso: string) => {
  const off = dayOffset(iso)
  return off === 0 ? t("chat.thread.today") : off === 1 ? t("chat.thread.yesterday") : formatMonthDay(iso)
}
const listTime = (c: Conversation) => {
  const off = dayOffset(c.updatedAt)
  if (off === 0) return formatTime(c.updatedAt)
  if (off === 1) return t("chat.sidebar.item.yesterday", { time: formatTime(c.updatedAt) })
  if (c.group === "week") return `${formatMonthDay(c.updatedAt)} ${formatTime(c.updatedAt)}`
  return formatMonthDay(c.updatedAt)
}
const daysAgo = (iso: string) => t("chat.history.unavailable.daysAgo", { n: Math.floor((asOf.getTime() - new Date(iso).getTime()) / DAY) })
const duration = (ms: number) => (Math.round(ms / 100) / 10).toFixed(1)

const byId = new Map(C.conversations.map((c) => [c.id, c]))
const messagesOf = (id: string): Message[] => MESSAGES[id] ?? []
const sourceType = (s: Source): SourceType => (s.type === "order" || s.type === "snapshot" || s.type === "doc" ? s.type : "link")
const sourceAria = (s: Source) => (s.type === "order" ? t("chat.sources.order", { id: s.label }) : s.type === "snapshot" ? t("chat.sources.snapshot", { label: s.label }) : t("chat.sources.doc", { label: s.label }))

/* ---------- 消息 ---------- */
const toolLabels = { aria: "", args: t("chat.tool.args"), result: t("chat.tool.result"), expand: t("chat.tool.expand"), collapse: t("chat.tool.collapse") }

function ToolCards({ tools, streaming }: { tools: ToolCallData[]; streaming?: boolean }) {
  return (
    <div className="flex w-full flex-col gap-2">
      {tools.map((tc, i) => {
        const status = tc.status === "running" ? "running" : tc.status === "failed" ? "error" : "done"
        const summary = status === "running" ? t("chat.tool.running", { name: tc.name }) : status === "error" ? t("chat.tool.failed", { name: tc.name }) : t("chat.tool.done", { name: tc.name, duration: t("chat.tool.duration", { n: duration(tc.durationMs ?? 0) }) })
        return (
          <ToolCall
            key={`${tc.name}-${i}`}
            name={tc.name}
            args={tc.args}
            status={status}
            result={status === "running" ? undefined : tc.result}
            summary={summary}
            brief={status === "running" ? undefined : tc.result}
            labels={{ ...toolLabels, aria: t("chat.tool.aria", { name: tc.name }) }}
            defaultOpen={!streaming && tools.length > 1 && i === tools.length - 1}
          />
        )
      })}
    </div>
  )
}

function Sources({ list }: { list: Source[] }) {
  if (!list.length) return null
  return (
    <div role="group" aria-label={t("chat.sources.aria")} className="mt-1 flex flex-wrap items-center gap-x-2">
      <span className="text-role-caption text-fg-muted">{t("chat.sources.title")}</span>
      {list.map((s) => (
        <SourceChip key={`${s.type}-${s.label}`} type={sourceType(s)} label={s.label} href={s.href} aria-label={sourceAria(s)} onClick={(e) => e.preventDefault()} />
      ))}
    </div>
  )
}

function UserMessage({ m }: { m: { at: string; text: string } }) {
  const time = formatTime(m.at)
  return (
    <ChatBubble
      role="user"
      time={time}
      aria-label={t("chat.message.user.aria", { time })}
      avatar={{ initial: mock.user.initial, hue: mock.user.avatarHue }}
      actions={
        <IconButton label={t("chat.message.edit")} onClick={() => notYet(t("chat.message.edit"))} className="[&_svg]:size-icon-sm">
          <PencilIcon />
        </IconButton>
      }
    >
      {withRefIds(m.text)}
    </ChatBubble>
  )
}

function AssistantMessage({ m }: { m: Message }) {
  const [copied, setCopied] = React.useState(false)
  const [vote, setVote] = React.useState<"up" | "down" | null>(null)
  const time = formatTime(m.at)
  const copy = () => {
    void navigator.clipboard?.writeText(m.markdown ?? "").catch(() => undefined)
    setCopied(true)
    window.setTimeout(() => setCopied(false), tokenMs("--motion-slow") * 4)
  }
  return (
    <ChatBubble
      role="assistant"
      name={C.assistant.name}
      time={time}
      aria-label={t("chat.message.assistant.aria", { time })}
      tools={m.toolCalls?.length ? <ToolCards tools={m.toolCalls} /> : undefined}
      footer={m.sources?.length ? <Sources list={m.sources} /> : undefined}
      actions={
        <>
          <IconButton label={copied ? t("chat.message.copied") : t("chat.message.copy")} aria-pressed={copied} onClick={copy} className="[&_svg]:size-icon-sm aria-pressed:text-primary">
            {copied ? <CheckIcon /> : <CopyIcon />}
          </IconButton>
          <IconButton label={t("chat.message.regenerate")} onClick={() => notYet(t("chat.message.regenerate"))} className="[&_svg]:size-icon-sm">
            <RefreshCwIcon />
          </IconButton>
          <IconButton label={t("chat.message.feedback.up")} aria-pressed={vote === "up"} onClick={() => setVote((v) => (v === "up" ? null : "up"))} className="[&_svg]:size-icon-sm aria-pressed:text-primary">
            <ThumbsUpIcon />
          </IconButton>
          <IconButton label={t("chat.message.feedback.down")} aria-pressed={vote === "down"} onClick={() => setVote((v) => (v === "down" ? null : "down"))} className="[&_svg]:size-icon-sm aria-pressed:text-primary">
            <ThumbsDownIcon />
          </IconButton>
          {copied ? <span role="status" className="sr-only">{t("chat.message.copied")}</span> : null}
        </>
      }
    >
      <Markdown source={m.markdown ?? ""} />
    </ChatBubble>
  )
}

function StreamingMessage() {
  const s = C.streamingSample
  return (
    <ChatBubble
      role="assistant"
      name={C.assistant.name}
      streaming
      streamingLabel={t("chat.streaming.aria")}
      aria-label={t("chat.streaming.aria")}
      tools={s.toolCalls.length ? <ToolCards tools={s.toolCalls} streaming /> : undefined}
    >
      <Markdown
        source={s.partialMarkdown}
        trailing={
          <span aria-hidden className="ml-1 inline-block h-(--font-size-sm) w-(--border-width-focus) animate-blink rounded-(--border-width-hairline) bg-primary align-text-bottom" />
        }
      />
    </ChatBubble>
  )
}

function DateSeparator({ label }: { label: string }) {
  return (
    <div role="separator" aria-label={label} className="flex items-center gap-3 text-role-caption text-fg-muted before:flex-1 before:border-t after:flex-1 after:border-t">
      {label}
    </div>
  )
}

/* ---------- 视图 ---------- */
function LoadingView() {
  const rows: { me?: boolean; lines: string[] }[] = [
    { me: true, lines: ["w-full", "w-3/5"] },
    { lines: ["w-full", "w-4/5", "w-full", "w-2/5"] },
    { me: true, lines: ["w-4/5"] },
    { lines: ["w-full", "w-3/5", "w-4/5"] },
    { me: true, lines: ["w-full", "w-2/5"] },
    { lines: ["w-4/5", "w-full"] },
  ]
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-6">
      <span className="sr-only">{t("chat.loading.aria")}</span>
      {rows.map((r, i) => (
        <div key={i} aria-hidden className={cn("grid items-start gap-3", r.me ? "grid-cols-[minmax(0,1fr)_var(--size-avatar-md)]" : "grid-cols-[var(--size-avatar-md)_minmax(0,1fr)]")}>
          {r.me ? null : <Skeleton className="size-avatar-md rounded-full" />}
          <div className={cn("flex flex-col gap-3 rounded-lg px-5 py-4", r.me ? "w-[45%] justify-self-end bg-skeleton" : "w-[85%] border bg-surface")}>
            {r.lines.map((w, j) => (
              <Skeleton key={j} className={cn("h-3", w)} />
            ))}
          </div>
          {r.me ? <Skeleton className="size-avatar-md rounded-full" /> : null}
        </div>
      ))}
    </div>
  )
}

function EmptyView({ onPick }: { onPick: (label: string) => void }) {
  return (
    <section aria-label={t("chat.empty.aria")} className="my-auto flex w-full flex-col gap-2 py-8 mobile:py-6">
      <BrandMark variant="house" className="mb-4 size-control-lg rounded-lg [&_svg]:size-icon-lg" />
      <h2 className="text-role-display mobile:text-role-heading">{C.emptyState.title}</h2>
      <p className="max-w-prose-max text-role-lead text-fg-muted">{C.emptyState.description}</p>
      <p className="mt-6 text-role-caption font-medium text-fg-muted">{t("chat.suggestions.title")}</p>
      <div role="group" aria-label={t("chat.suggestions.aria")} className="mt-2 grid grid-cols-2 gap-3 mobile:grid-cols-1">
        {C.suggestions.map((s) => {
          const Icon = SUGGESTION_ICON[s.icon] ?? SparklesIcon
          return (
            <Card
              key={s.key}
              asChild
              className="flex min-h-control-lg flex-row items-center gap-3 p-4 text-left text-role-body text-fg transition-[border-color,box-shadow,background-color] duration-(--motion-fast) ease-std hover:border-border-strong hover:bg-surface-raised hover:shadow-sm"
            >
              <button type="button" onClick={() => onPick(s.label)}>
                <span aria-hidden className="grid size-avatar-md shrink-0 place-items-center rounded-md bg-primary-soft text-on-primary-soft [&_svg]:size-icon-sm">
                  <Icon />
                </span>
                <span className="min-w-0 wrap-anywhere">{withRefIds(s.label)}</span>
              </button>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

function UnavailableView({ conv, onBack }: { conv: Conversation; onBack: () => void }) {
  const titleId = React.useId()
  return (
    <Card asChild className="my-auto flex w-full flex-col items-center gap-2 px-6 py-16 text-center mobile:px-4 mobile:py-12">
      <section aria-labelledby={titleId}>
        <span aria-hidden className="mb-4 grid size-control-lg place-items-center rounded-full bg-neutral-soft text-on-neutral-soft [&_svg]:size-icon-md">
          <MessageSquareDashedIcon />
        </span>
        <h2 id={titleId} className="text-role-heading">{t("chat.history.unavailable.title")}</h2>
        <p className="max-w-[calc(var(--size-form-max)+var(--size-sidebar-rail))] text-fg-muted">
          {t("chat.history.unavailable.description", { n: conv.messageCount, time: daysAgo(conv.updatedAt) })}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button variant="secondary" onClick={onBack}>
            {t("chat.history.unavailable.back")}
          </Button>
        </div>
      </section>
    </Card>
  )
}

/* ---------- 会话列表 ---------- */
type ListProps = {
  conversations: Conversation[]
  current: string | null
  query: string
  onQuery: (q: string) => void
  onSelect: (id: string) => void
  onNew: () => void
  menu: string | null
  onMenu: (id: string | null) => void
  onDelete: (id: string) => void
  inSheet?: boolean
  loading?: boolean
}

const LIST_SKELETON: string[][] = [["w-1/4"], ["w-4/5", "w-2/5"], ["w-3/5", "w-2/5"], ["w-4/5", "w-1/4"], ["w-1/4"], ["w-3/5", "w-2/5"], ["w-4/5", "w-2/5"]]

function ConversationList({ conversations, current, query, onQuery, onSelect, onNew, menu, onMenu, onDelete, inSheet, loading }: ListProps) {
  const f = query.trim().toLowerCase()
  const groups = C.groups
    .map((g) => ({ ...g, items: conversations.filter((c) => c.group === g.key && (!f || c.title.toLowerCase().includes(f))) }))
    .filter((g) => g.items.length)
  return (
    <>
      <div className={cn("flex shrink-0 items-center justify-between gap-2 py-3 pr-3 pl-4", inSheet && "min-h-topbar py-2 pr-hit pl-4")}>
        <h1 className="text-role-title">{t("chat.title")}</h1>
        {inSheet ? null : (
          <Button onClick={onNew}>
            <PlusIcon /> {t("chat.sidebar.new")}
          </Button>
        )}
      </div>
      {inSheet ? (
        <div className="px-3 pb-2">
          <Button block onClick={onNew}>
            <PlusIcon /> {t("chat.sidebar.new")}
          </Button>
        </div>
      ) : null}
      <SearchInput
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder={t("chat.sidebar.search.placeholder")}
        aria-label={t("chat.sidebar.search.aria")}
        className="mx-3 mb-2 h-hit w-auto"
      />
      {loading ? (
        <div role="status" aria-busy="true" aria-label={t("chat.loading.sidebar")} className="flex flex-col gap-3 px-2 py-3">
          {LIST_SKELETON.map((lines, i) => (
            <div key={i} className="flex flex-col gap-2 px-3 py-2">
              {lines.map((w, j) => (
                <Skeleton key={j} className={cn(j === 0 ? "h-4" : "h-3", w)} />
              ))}
            </div>
          ))}
        </div>
      ) : null}
      <nav aria-label={t("chat.sidebar.aria")} className={cn("min-h-0 flex-1 overflow-y-auto px-2 pb-4", loading && "hidden")}>
        {groups.length ? (
          groups.map((g) => (
            <div key={g.key}>
              <span id={`cg-${g.key}${inSheet ? "-m" : ""}`} className="flex items-center gap-1 px-2 pt-3 pb-1 text-role-caption font-medium text-fg-muted">
                {t(`chat.sidebar.group.${g.key}`)}
                <span className="font-regular tabular-nums">（{g.items.length}）</span>
              </span>
              <ul aria-labelledby={`cg-${g.key}${inSheet ? "-m" : ""}`} className="flex flex-col gap-1">
                {g.items.map((c) => {
                  const time = listTime(c)
                  const key = `${c.id}${inSheet ? "-m" : ""}`
                  return (
                    <li key={c.id} data-conversation={c.id}>
                      <ConversationItem
                        href={`?conversation=${c.id}`}
                        title={c.title}
                        time={t("chat.sidebar.item.meta", { time, n: c.messageCount })}
                        active={c.id === current}
                        unread={c.unread}
                        aria-label={t("chat.sidebar.item.aria", { title: c.title, time, unread: c.unread ? `，${t("chat.sidebar.item.unread")}` : "" })}
                        onClick={(e) => {
                          e.preventDefault()
                          onSelect(c.id)
                        }}
                        action={
                          <DropdownMenu open={menu === key} onOpenChange={(o) => onMenu(o ? key : null)}>
                            <DropdownMenuTrigger asChild>
                              <IconButton label={t("chat.sidebar.item.menu")} aria-haspopup="menu" data-conversation-menu={c.id}>
                                <EllipsisIcon />
                              </IconButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent compact aria-label={t("chat.sidebar.item.menu")}>
                              <DropdownMenuItem onSelect={() => notYet(t("chat.sidebar.item.rename"))}>
                                <PencilIcon /> {t("chat.sidebar.item.rename")}
                              </DropdownMenuItem>
                              <DropdownMenuItem variant="danger" onSelect={() => onDelete(c.id)}>
                                <Trash2Icon /> {t("chat.sidebar.item.delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        }
                      />
                    </li>
                  )
                })}
              </ul>
            </div>
          ))
        ) : (
          <p className="px-4 py-8 text-center text-role-body text-fg-muted">{f ? t("chat.sidebar.search.empty") : t("chat.sidebar.empty")}</p>
        )}
      </nav>
    </>
  )
}

/* ---------- 模型选择（hifi .model-btn + listbox 浮层） ---------- */
function ModelPicker({ value, onChange, open, onOpenChange }: { value: ModelKey; onChange: (k: ModelKey) => void; open: boolean; onOpenChange: (o: boolean) => void }) {
  const current = C.models.find((m) => m.key === value) ?? C.models[0]
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-label={t("chat.composer.model.aria")}
          className="inline-flex h-hit items-center gap-1 rounded-md pr-2 pl-3 text-role-label text-fg-muted transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted hover:text-fg aria-expanded:bg-surface-muted aria-expanded:text-fg [&_svg]:size-icon-sm [&>svg:first-child]:text-primary"
        >
          <SparklesIcon aria-hidden />
          <span>{current.label}</span>
          <ChevronDownIcon aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" side="top" role="listbox" aria-label={t("chat.composer.model.label")} className="w-auto min-w-popover p-2">
        {C.models.map((m) => (
          <button
            key={m.key}
            type="button"
            role="option"
            aria-selected={m.key === value}
            onClick={() => {
              onChange(m.key)
              onOpenChange(false)
            }}
            className="grid min-h-hit w-full grid-cols-[minmax(0,1fr)_var(--size-icon-md)] items-center gap-3 rounded-md px-3 py-2 text-left text-fg transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted aria-selected:[&_svg]:visible [&_svg]:invisible [&_svg]:size-icon-md [&_svg]:text-primary"
          >
            <span>
              <strong className="block text-role-label font-medium">{m.label}</strong>
              <span className="text-role-caption text-fg-muted">{m.description}</span>
            </span>
            <CheckIcon aria-hidden />
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

/* ---------- 页面 ---------- */
export default function Chat() {
  const { state, open, toast: toastQ, hold, set } = useScreenState(states)
  const [params] = useSearchParams()
  const sidebar = params.get("sidebar")
  const mobile = useMaxWidth("--breakpoint-md")

  const [deleted, setDeleted] = React.useState<Set<string>>(() => new Set())
  const conversations = React.useMemo(() => C.conversations.filter((c) => !deleted.has(c.id)), [deleted])

  const requested = params.get("conversation")
  const convId = state === "empty" ? null : requested && byId.has(requested) && !deleted.has(requested) ? requested : (conversations[0]?.id ?? null)
  const conv = convId ? byId.get(convId) : undefined

  const go = React.useCallback(
    (id: string | null, st: State = "success") => set({ conversation: st === "empty" ? null : id, state: st === "success" ? null : st, scrolled: null, open: null }),
    [set],
  )

  /* c_6 / c_7：骨架 motion.slow 后停留为「历史未包含」 */
  const [unavailable, setUnavailable] = React.useState(false)
  React.useEffect(() => {
    setUnavailable(false)
    if (!conv || conv.historyAvailable || state === "loading") return
    const id = window.setTimeout(() => setUnavailable(true), tokenMs("--motion-slow"))
    return () => window.clearTimeout(id)
  }, [conv, state])

  const view: "empty" | "loading" | "unavailable" | "thread" = state === "empty" || !conv ? "empty" : state === "loading" || (!conv.historyAvailable && !unavailable) ? "loading" : !conv.historyAvailable ? "unavailable" : "thread"

  /* 输入区 */
  const [draft, setDraft] = React.useState("")
  const [model, setModel] = React.useState<ModelKey>(C.models[0].key)
  const [attachment, setAttachment] = React.useState<{ name: string; size: string } | null>(() => (params.has("attach") ? DEMO_ATTACHMENT : null))
  const [attachError, setAttachError] = React.useState(false)
  const modelOpen = open === "model"
  const [query, setQuery] = React.useState("")

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setDraft("")
    setAttachment(null)
    if (/加急/.test(text)) {
      const id = text.match(REF_ID)?.[0] ?? ""
      toast.success(t("chat.sent.toast", { id }))
    }
    go(convId ?? conversations[0]?.id ?? C.conversations[0].id, "streaming")
  }
  const pick = (label: string) => {
    setDraft(label)
    requestAnimationFrame(() => document.querySelector<HTMLTextAreaElement>("[data-slot=composer] textarea")?.focus())
  }
  const attach = () => {
    if (attachment) {
      setAttachError(true)
      window.setTimeout(() => setAttachError(false), tokenMs("--timing-toast-stay"))
      return
    }
    setAttachment(DEMO_ATTACHMENT)
  }

  /* 会话菜单 / 删除：?open=menu|delete 作用于当前会话 */
  const [menu, setMenu] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState<string | null>(null)
  const menuQuery = open === "menu" && convId
  React.useEffect(() => {
    if (!menuQuery) return
    const key = `${convId}${mobile ? "-m" : ""}`
    const id = requestAnimationFrame(() => setMenu(key))
    return () => cancelAnimationFrame(id)
  }, [menuQuery, convId, mobile])
  const deleteId = open === "delete" ? convId : deleting
  const closeDelete = () => {
    setDeleting(null)
    if (open === "delete") set({ open: null })
  }
  const confirmDelete = () => {
    if (!deleteId) return
    const next = new Set(deleted)
    next.add(deleteId)
    setDeleted(next)
    closeDelete()
    if (deleteId === convId) {
      const rest = C.conversations.filter((c) => !next.has(c.id))
      go(rest[0]?.id ?? null, rest.length ? "success" : "empty")
    }
  }

  /* 移动端会话列表 Sheet：?open=sidebar（menu / delete 在 ≤768 也需先打开列表；菜单关闭时回退到 sidebar，列表保持打开） */
  const convsOpen = mobile && (open === "sidebar" || open === "menu")
  const setConvsOpen = (o: boolean) => set({ open: o ? "sidebar" : null })
  const onMenu = (k: string | null) => {
    setMenu(k)
    if (!k && open === "menu") set({ open: mobile ? "sidebar" : null })
  }

  /* toast=urgent（改加急成功） */
  React.useEffect(() => {
    if (toastQ !== "urgent") return
    const id = toast.success(t("chat.sent.toast", { id: C.suggestions.find((s) => s.key === "urgent")?.label.match(REF_ID)?.[0] ?? "" }), {
      duration: hold ? Infinity : tokenMs("--timing-toast-stay"),
    })
    return () => {
      toast.dismiss(id)
    }
  }, [toastQ, hold])

  /* 贴底 / 回到最新 */
  const threadRef = React.useRef<HTMLDivElement>(null)
  const pinned = React.useRef(true)
  const [showToBottom, setShowToBottom] = React.useState(false)
  const scrolledUp = params.get("scrolled") === "up"
  const atBottom = (el: HTMLElement) => el.scrollHeight - el.clientHeight - el.scrollTop < tokenPx("--space-20")
  const stick = React.useCallback(() => {
    const el = threadRef.current
    if (!el) return
    if (pinned.current) el.scrollTo({ top: el.scrollHeight, behavior: "instant" })
    setShowToBottom(view === "thread" && !atBottom(el))
  }, [view])
  React.useEffect(() => {
    pinned.current = !scrolledUp
    if (scrolledUp) threadRef.current?.scrollTo({ top: 0, behavior: "instant" })
    stick()
    void document.fonts.ready.then(stick)
  }, [convId, state, view, scrolledUp, stick])

  const messages = conv && view === "thread" ? messagesOf(conv.id) : []
  const thread: React.ReactNode[] = []
  let lastDay: string | null = null
  const pushDate = (iso: string) => {
    const d = dateLabel(iso)
    if (d !== lastDay) {
      thread.push(<DateSeparator key={`d-${iso}`} label={t("chat.thread.date", { date: d })} />)
      lastDay = d
    }
  }
  for (const m of messages) {
    pushDate(m.at)
    thread.push(m.role === "user" ? <UserMessage key={m.id} m={{ at: m.at, text: m.text ?? "" }} /> : <AssistantMessage key={m.id} m={m} />)
  }
  if (view === "thread" && (state === "streaming" || state === "error")) {
    const followUp = followUpOf(messages[messages.length - 1])
    pushDate(followUp.at)
    thread.push(<UserMessage key={followUp.id} m={followUp} />)
  }

  const composer = (
    <Composer
      aria-label={t("chat.composer.aria")}
      value={draft}
      onChange={setDraft}
      onSubmit={send}
      onStop={() => go(convId, "success")}
      onAttach={attach}
      placeholder={C.composer.placeholder}
      hint={C.composer.hint}
      streaming={state === "streaming"}
      max={MAX_CHARS}
      maxRows={C.composer.maxRows}
      labels={{ send: t("chat.composer.send"), stop: t("chat.streaming.stop"), attach: t("chat.composer.attach"), input: t("chat.composer.label"), attachTip: t("chat.composer.attach.accept") }}
      attachments={attachment ? <AttachmentChip name={attachment.name} size={attachment.size} removeLabel={t("chat.composer.attach.remove", { name: attachment.name })} onRemove={() => setAttachment(null)} /> : undefined}
      tools={<ModelPicker value={model} onChange={setModel} open={modelOpen} onOpenChange={(o) => set({ open: o ? "model" : null })} />}
      counter={draft.length >= COUNTER_FROM ? <span className={cn(draft.length > MAX_CHARS && "text-danger")}>{t("chat.composer.counter", { n: draft.length })}</span> : undefined}
      error={attachError ? t("chat.composer.attach.tooLarge") : draft.length > MAX_CHARS ? t("chat.composer.max") : undefined}
      above={
        view === "thread" ? (
          <div role="group" aria-label={t("chat.suggestions.aria")} className="flex flex-wrap gap-x-2 mobile:-mx-4 mobile:flex-nowrap mobile:overflow-x-auto mobile:px-4 mobile:[scrollbar-width:none]">
            {C.suggestions.map((s) => {
              const Icon = SUGGESTION_ICON[s.icon] ?? SparklesIcon
              return (
                <SuggestionChip key={s.key} onClick={() => pick(s.label)}>
                  <Icon aria-hidden />
                  <span>{withRefIds(s.label)}</span>
                </SuggestionChip>
              )
            })}
          </div>
        ) : undefined
      }
    />
  )

  const list = (inSheet: boolean) => (
    <ConversationList
      conversations={conversations}
      current={state === "empty" ? null : convId}
      query={query}
      onQuery={setQuery}
      onSelect={(id) => go(id)}
      onNew={() => {
        setDraft("")
        go(null, "empty")
      }}
      menu={menu}
      onMenu={onMenu}
      onDelete={(id) => setDeleting(id)}
      inSheet={inSheet}
      loading={state === "loading"}
    />
  )

  return (
    <AppShell
      sidebar={sidebar}
      open={open}
      setOpen={(v) => set({ open: v })}
      current="chat"
      title={t("chat.title")}
      assistant={{ label: t("chat.title"), href: "/chat", current: true }}
      flush
    >
      <div className="flex min-h-0 w-full flex-1 mobile:flex-col">
        {mobile ? (
          <Sheet open={convsOpen} onOpenChange={setConvsOpen}>
            <SheetContent title={t("chat.sidebar.aria")} closeLabel={t("chat.sidebar.close")} className="w-sheet max-w-[calc(100vw-var(--space-12))]">
              {list(true)}
            </SheetContent>
          </Sheet>
        ) : (
          <aside aria-label={t("chat.sidebar.aria")} className="flex w-conversation-list shrink-0 flex-col border-r bg-surface">
            {list(false)}
          </aside>
        )}

        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
          {mobile ? (
            <div className="flex items-center gap-2 px-4 pt-2">
              <Button variant="secondary" aria-expanded={convsOpen} onClick={() => setConvsOpen(true)} className="px-3">
                <PanelLeftIcon /> {t("chat.sidebar.open")}
              </Button>
              <span className="min-w-0 flex-1 truncate text-role-label text-fg-muted">{conv && state !== "empty" ? conv.title : ""}</span>
            </div>
          ) : null}
          <div
            ref={threadRef}
            onScroll={(e) => {
              pinned.current = atBottom(e.currentTarget)
              setShowToBottom(view === "thread" && !pinned.current)
            }}
            className="flex min-h-0 flex-1 flex-col overflow-y-auto scroll-smooth px-6 pt-6 pb-4 mobile:flex-none mobile:overflow-visible mobile:p-4"
          >
            <div className={cn("mx-auto flex w-full max-w-thread-max flex-1 flex-col gap-6 mobile:gap-5", (view === "empty" || view === "unavailable") && "justify-center")}>
              {view === "empty" ? <EmptyView onPick={pick} /> : null}
              {view === "loading" ? <LoadingView /> : null}
              {view === "unavailable" && conv ? <UnavailableView conv={conv} onBack={() => go(C.conversations[0].id)} /> : null}
              {view === "thread" ? (
                <section role="log" aria-label={t("chat.thread.aria")} aria-live="polite" aria-busy={state === "streaming"} className="flex flex-col gap-6">
                  {thread}
                  {state === "streaming" ? <StreamingMessage /> : null}
                  {state === "error" ? (
                    <Alert variant="danger" icon={TriangleAlertIcon} className="rounded-lg px-5 py-4 [&>svg]:mt-1">
                      <div className="grid gap-1">
                        <strong className="text-role-label text-danger">{t("chat.error.title")}</strong>
                        <AlertDescription>{C.errorState.message}</AlertDescription>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button variant="secondary" onClick={() => go(convId, "streaming")}>
                          <RefreshCwIcon /> {C.errorState.retry}
                        </Button>
                        <Button variant="ghost" onClick={() => go(convId, "success")} className="text-fg-muted hover:text-fg">
                          {t("chat.error.dismiss")}
                        </Button>
                      </div>
                    </Alert>
                  ) : null}
                  <p className="text-center text-role-caption text-fg-muted">{C.assistant.disclaimer}</p>
                </section>
              ) : null}
            </div>
          </div>
          {showToBottom && !mobile ? (
            <Button
              variant="secondary"
              onClick={() => {
                pinned.current = true
                stick()
              }}
              className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 shadow-md"
            >
              <ArrowDownIcon /> {t("chat.thread.scrollToBottom")}
            </Button>
          ) : null}
          <div className="shrink-0 bg-bg px-6 pt-2 pb-4 mobile:px-4 mobile:pt-0">
            <div className="mx-auto w-full max-w-thread-max">{composer}</div>
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => (o ? undefined : closeDelete())}>
        {/* hifi chat .dialog：≤768 仍居中浮层（宽 = 100vw - space.8、radius-lg），不用组件默认的贴底样式 */}
        <AlertDialogContent className="gap-3 rounded-lg mobile:top-1/2 mobile:bottom-auto mobile:left-1/2 mobile:w-[calc(100vw-var(--space-8))] mobile:max-w-dialog mobile:-translate-1/2 mobile:rounded-lg mobile:pb-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-role-title">{t("chat.sidebar.delete.title", { title: deleteId ? (byId.get(deleteId)?.title ?? "") : "" })}</AlertDialogTitle>
            <AlertDialogDescription>{t("chat.sidebar.delete.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-3 gap-2">
            <AlertDialogCancel>{t("chat.sidebar.delete.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>{t("chat.sidebar.delete.confirm")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  )
}
