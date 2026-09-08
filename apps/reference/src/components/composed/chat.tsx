import * as React from "react"
import { cn } from "@/lib/cn"
import { ArrowUpIcon, ChevronDownIcon, CircleAlertIcon, CircleCheckIcon, FileTextIcon, LinkIcon, PaperclipIcon, ReceiptTextIcon, SquareIcon } from "lucide-react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"

import { Avatar } from "@/components/composed/avatar"
import { BrandMark } from "@/components/composed/brand"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Spinner } from "@/components/ui/spinner"

/* ---------------- ChatBubble ---------------- */

type ChatBubbleProps = React.ComponentProps<"article"> & {
  role: "user" | "assistant"
  /** 头像：user 传 Avatar props，assistant 用 BrandMark */
  avatar?: { initial: string; hue?: number; name?: string }
  /** 已格式化时间（formatTime） */
  time?: string
  streaming?: boolean
  /** 流式态视觉隐藏文字 / 光标字符（content chat.streaming.*） */
  streamingLabel?: string
  cursor?: string
  error?: string
  /** 气泡下方动作行（复制 / 重新生成） */
  actions?: React.ReactNode
  /** 气泡外、正文下方的来源 Chip 组 */
  footer?: React.ReactNode
}

/**
 * 消息气泡：hifi .msg / .bubble —— max-w size.bubble.max；user 右对齐 primary 实底 + on-primary、radius.lg 且右上角 radius.xs；
 * assistant 左对齐 surface + hairline；streaming 时 aria-busy + 末尾 blink 光标；error 时 danger 描边 + 提示行。
 */
function ChatBubble({ role, avatar, time, streaming, streamingLabel, cursor, error, actions, footer, className, children, ...props }: ChatBubbleProps) {
  const own = role === "user"
  return (
    <article data-slot="chat-bubble" data-role={role} aria-busy={streaming || undefined} className={cn("flex w-full gap-3", own && "flex-row-reverse", className)} {...props}>
      {own ? avatar ? <Avatar size="sm" initial={avatar.initial} hue={avatar.hue} name={avatar.name} className="mt-1" /> : null : <BrandMark variant="house" className="mt-1 size-avatar-sm [&_svg]:size-icon-sm" />}
      <div className={cn("flex min-w-0 max-w-bubble-max flex-col gap-2", own ? "items-end" : "items-start")}>
        <div
          className={cn(
            "min-w-0 rounded-lg px-4 py-3 text-role-body wrap-anywhere",
            own ? "rounded-tr-xs bg-primary text-on-primary" : "rounded-tl-xs border bg-surface text-fg",
            error && "border-danger",
          )}
        >
          {children}
          {streaming ? (
            <>
              <span aria-hidden className="ml-px inline-block animate-blink text-primary">
                {cursor}
              </span>
              <span className="sr-only">{streamingLabel}</span>
            </>
          ) : null}
        </div>
        {error ? (
          <p role="alert" className="flex items-center gap-1 text-role-caption text-danger [&_svg]:size-icon-sm">
            <CircleAlertIcon aria-hidden />
            {error}
          </p>
        ) : null}
        {footer}
        <div className={cn("flex min-h-hit flex-wrap items-center gap-1 text-role-caption text-fg-muted", own && "flex-row-reverse")}>
          {time ? <time className="px-1 tabular-nums">{time}</time> : null}
          {actions}
        </div>
      </div>
    </article>
  )
}

/* ---------------- ToolCall ---------------- */

type ToolCallProps = React.ComponentProps<"div"> & {
  name: string
  args: string
  status: "running" | "done" | "error"
  result?: string
  /** 头行文案（content chat.tool.running / done / failed 已插值）与展开区标签 */
  summary: string
  labels: { aria: string; args: string; result: string; expand: string; collapse: string }
  defaultOpen?: boolean
}

/** 工具调用卡：hifi .toolcall —— surface-muted、radius.md、grid icon.md / 1fr / auto；running Spinner、done success 勾、error danger；Collapsible 展开参数 / 结果 */
function ToolCall({ name, args, status, result, summary, labels, defaultOpen = false, className, ...props }: ToolCallProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <CollapsiblePrimitive.Root open={open} onOpenChange={setOpen} asChild>
      <div data-slot="tool-call" data-status={status} className={cn("w-full max-w-bubble-max rounded-md border bg-surface-muted text-role-caption", status === "error" && "border-danger", className)} {...props}>
        <CollapsiblePrimitive.Trigger
          aria-label={labels.aria}
          className="grid min-h-hit w-full grid-cols-[var(--size-icon-md)_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-3 text-left text-fg transition-colors duration-(--motion-fast) ease-std hover:bg-neutral-soft [&_svg]:size-icon-md [&>svg:last-child]:text-fg-muted [&>svg:last-child]:transition-transform [&[data-state=open]>svg:last-child]:rotate-180"
        >
          <span aria-hidden className="grid place-items-center">
            {status === "running" ? <Spinner /> : status === "done" ? <CircleCheckIcon className="text-success" /> : <CircleAlertIcon className="text-danger" />}
          </span>
          <span className="truncate font-medium">{summary}</span>
          <ChevronDownIcon aria-hidden />
        </CollapsiblePrimitive.Trigger>
        <CollapsiblePrimitive.Content className="flex flex-col gap-2 border-t px-3 py-2">
          <p className="text-fg-muted">{labels.args}</p>
          <p className="font-mono text-fg wrap-anywhere">{args}</p>
          {result ? (
            <>
              <p className="text-fg-muted">{labels.result}</p>
              <p className="text-fg wrap-anywhere">{result}</p>
            </>
          ) : null}
          <span className="sr-only">{name}</span>
        </CollapsiblePrimitive.Content>
      </div>
    </CollapsiblePrimitive.Root>
  )
}

/* ---------------- SourceChip / SuggestionChip ---------------- */

type SourceChipProps = React.ComponentProps<"a"> & { type: "order" | "snapshot" | "doc" | "link"; label: string }

const SOURCE_ICON = { order: ReceiptTextIcon, snapshot: FileTextIcon, doc: FileTextIcon, link: LinkIcon }

/** 来源 Chip：hifi .source —— h size.chip、hairline、fg-muted 图标 + caption 文本；min-h size.hit 热区靠 hit-area */
function SourceChip({ type, label, className, ...props }: SourceChipProps) {
  const Icon = SOURCE_ICON[type]
  return (
    <a
      data-slot="source-chip"
      data-type={type}
      className={cn(
        "hit-area inline-flex h-chip max-w-full items-center gap-1 rounded-full border bg-surface px-3 text-role-caption text-fg-muted no-underline transition-colors duration-(--motion-fast) ease-std hover:border-border-strong hover:text-fg [&_svg]:size-icon-sm [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      <Icon aria-hidden />
      <span className="truncate">{label}</span>
    </a>
  )
}

/** 建议 Chip：hifi .suggestion —— 可点按钮、min-h size.hit、hairline + radius.full；hover primary-soft */
function SuggestionChip({ className, children, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="suggestion-chip"
      className={cn(
        "inline-flex min-h-hit max-w-full items-center gap-2 rounded-full border bg-surface px-4 text-left text-role-label text-fg transition-colors duration-(--motion-fast) ease-std hover:not-disabled:border-primary hover:not-disabled:bg-primary-soft hover:not-disabled:text-on-primary-soft disabled:disabled-look [&_svg]:size-icon-sm [&_svg]:shrink-0 [&_svg]:text-fg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/* ---------------- Composer ---------------- */

type ComposerProps = Omit<React.ComponentProps<"form">, "onSubmit" | "onChange"> & {
  value: string
  onChange: (next: string) => void
  onSubmit: () => void
  onStop?: () => void
  placeholder: string
  hint?: string
  streaming?: boolean
  disabled?: boolean
  labels: { send: string; stop: string; attach?: string }
  /** 左下角附加控件（模型 Select 等） */
  tools?: React.ReactNode
  maxRows?: number
}

/**
 * 输入区：hifi .composer —— max-w size.thread.max、surface + hairline、radius.lg、聚焦整框 primary 描边；
 * 上方自增高 textarea（≤ maxRows 行），下方工具行：附件 / 模型 … 右侧 primary 圆形发送（流式态变为 stop）。Enter 发送，Shift+Enter 换行。
 */
function Composer({ value, onChange, onSubmit, onStop, placeholder, hint, streaming, disabled, labels, tools, maxRows = 8, className, ...props }: ComposerProps) {
  const ref = React.useRef<HTMLTextAreaElement>(null)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    const line = parseFloat(getComputedStyle(el).lineHeight) || 0
    el.style.height = `${Math.min(el.scrollHeight, line * maxRows)}px`
  }, [value, maxRows])
  const canSend = value.trim().length > 0 && !disabled && !streaming
  return (
    <form
      data-slot="composer"
      className={cn("flex w-full max-w-thread-max flex-col rounded-lg border bg-surface p-2 transition-colors duration-(--motion-fast) ease-std has-focus-visible:border-primary has-disabled:bg-surface-muted", className)}
      onSubmit={(e) => {
        e.preventDefault()
        if (canSend) onSubmit()
      }}
      {...props}
    >
      <textarea
        ref={ref}
        rows={1}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            if (canSend) onSubmit()
          }
        }}
        className="max-h-[calc(var(--font-size-md)*var(--font-line-height-body)*8)] min-h-hit w-full resize-none border-0 bg-transparent px-2 py-2 text-role-body text-fg outline-none placeholder:text-fg-muted disabled:cursor-not-allowed"
      />
      <div className="flex items-center gap-2">
        {labels.attach ? (
          <IconButton label={labels.attach} disabled={disabled}>
            <PaperclipIcon />
          </IconButton>
        ) : null}
        {tools}
        {hint ? <span className="ml-auto hidden text-role-caption text-fg-muted md:inline">{hint}</span> : <span className="ml-auto" />}
        {streaming ? (
          <Button type="button" variant="secondary" size="sm" onClick={onStop} className="rounded-full">
            <SquareIcon />
            {labels.stop}
          </Button>
        ) : (
          <IconButton type="submit" label={labels.send} shape="round" disabled={!canSend} className="bg-primary text-on-primary hover:not-disabled:bg-primary-hover hover:not-disabled:text-on-primary disabled:bg-neutral-soft disabled:text-on-neutral-soft disabled:opacity-100">
            <ArrowUpIcon />
          </IconButton>
        )}
      </div>
    </form>
  )
}

/* ---------------- ConversationItem ---------------- */

type ConversationItemProps = React.ComponentProps<"a"> & {
  title: string
  /** 已格式化时间（formatMonthDay / formatTime） */
  time: string
  active?: boolean
  unread?: boolean
  /** 右侧悬浮操作（更多菜单），active / hover 时可见 */
  action?: React.ReactNode
}

/** 会话项：hifi .conv —— min-h size.hit、radius.md、hover surface-muted、当前 primary-soft；未读 size.dot 圆点；标题 truncate + caption 时间 */
function ConversationItem({ title, time, active, unread, action, className, ...props }: ConversationItemProps) {
  return (
    <div data-slot="conversation-item" data-active={active || undefined} className="group/conv relative flex min-h-hit items-center">
      <a
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-hit min-w-0 flex-1 items-center gap-2 rounded-md px-3 text-role-body text-fg no-underline transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted aria-[current=page]:bg-primary-soft aria-[current=page]:text-on-primary-soft",
          action && "pr-hit",
          className,
        )}
        {...props}
      >
        {unread ? <i aria-hidden className="size-dot shrink-0 rounded-full bg-primary" /> : null}
        <span className={cn("min-w-0 flex-1 truncate", unread && "font-medium")}>{title}</span>
        <time className="shrink-0 text-role-caption text-fg-muted tabular-nums">{time}</time>
      </a>
      {action ? <span className="absolute right-0 opacity-0 transition-opacity duration-(--motion-fast) group-hover/conv:opacity-100 group-focus-within/conv:opacity-100 data-active:opacity-100 mobile:opacity-100">{action}</span> : null}
    </div>
  )
}

export {
  ChatBubble,
  ToolCall,
  SourceChip,
  SuggestionChip,
  Composer,
  ConversationItem,
  type ChatBubbleProps,
  type ToolCallProps,
  type SourceChipProps,
  type ComposerProps,
  type ConversationItemProps,
}
