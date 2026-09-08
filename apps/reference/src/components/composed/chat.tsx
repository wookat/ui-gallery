import * as React from "react"
import { cn } from "@/lib/cn"
import { ArrowUpIcon, ChevronDownIcon, CircleAlertIcon, CheckIcon, DatabaseIcon, FileTextIcon, LinkIcon, PaperclipIcon, ReceiptTextIcon, SquareIcon, TriangleAlertIcon, XIcon } from "lucide-react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"

import { Avatar } from "@/components/composed/avatar"
import { BrandMark } from "@/components/composed/brand"
import { IconButton } from "@/components/ui/icon-button"
import { Spinner } from "@/components/ui/spinner"

/* ---------------- ChatBubble ---------------- */

type ChatBubbleProps = React.ComponentProps<"article"> & {
  role: "user" | "assistant"
  /** 头像：user 传 Avatar props，assistant 用 BrandMark */
  avatar?: { initial: string; hue?: number; name?: string }
  /** 气泡上方的发送者名（assistant；≤768 隐藏） */
  name?: string
  /** 已格式化时间（formatTime） */
  time?: string
  streaming?: boolean
  /** 流式态视觉隐藏文字 / 光标字符（content chat.streaming.*） */
  streamingLabel?: string
  cursor?: string
  error?: string
  /** 气泡上方的工具调用卡组 */
  tools?: React.ReactNode
  /** 气泡下方动作行（复制 / 重新生成 / 反馈） */
  actions?: React.ReactNode
  /** 气泡内、正文下方的来源 Chip 组 */
  footer?: React.ReactNode
}

/**
 * 消息：hifi .msg / .who / .bubble —— grid「avatar.md | 1fr」（user 镜像），头行 caption 时间（assistant 另有 label 名）；
 * assistant 气泡 surface + hairline + shadow.sm、radius.lg、space.4/5 内距；user 气泡 primary-soft、无边框、max-w size.bubble.max；
 * streaming 时 aria-busy + 描边 primary-soft；error 时 danger 描边 + 提示行。
 */
function ChatBubble({ role, avatar, name, time, streaming, streamingLabel, cursor, error, tools, actions, footer, className, children, ...props }: ChatBubbleProps) {
  const own = role === "user"
  return (
    <article
      data-slot="chat-bubble"
      data-role={role}
      aria-busy={streaming || undefined}
      className={cn("grid w-full items-start gap-3", own ? "grid-cols-[minmax(0,1fr)_var(--size-avatar-md)]" : "grid-cols-[var(--size-avatar-md)_minmax(0,1fr)]", className)}
      {...props}
    >
      {own ? (
        avatar ? <Avatar aria-hidden initial={avatar.initial} hue={avatar.hue} name={avatar.name} className="col-start-2 row-start-1" /> : <span aria-hidden className="col-start-2 row-start-1" />
      ) : (
        <BrandMark variant="house" />
      )}
      <div className={cn("flex min-w-0 flex-col gap-2", own && "col-start-1 items-end")}>
        <div className="flex min-h-avatar-md items-center gap-2 text-role-caption text-fg-muted">
          {name ? <span className="text-role-label text-fg mobile:hidden">{name}</span> : null}
          {streaming ? <span>{streamingLabel}</span> : time ? <time>{time}</time> : null}
        </div>
        {tools}
        <div
          className={cn(
            "relative min-w-0 max-w-full rounded-lg border bg-surface px-5 py-4 text-role-body text-fg shadow-sm wrap-anywhere mobile:px-4 mobile:py-3",
            own && "max-w-bubble-max border-transparent bg-primary-soft shadow-none mobile:max-w-full",
            streaming && "border-primary-soft",
            error && "border-danger",
          )}
        >
          {children}
          {streaming && cursor ? (
            <span aria-hidden className="ml-1 inline-block animate-blink text-primary">
              {cursor}
            </span>
          ) : null}
          {streaming ? <span className="sr-only">{streamingLabel}</span> : null}
          {footer}
        </div>
        {error ? (
          <p role="alert" className="flex items-center gap-1 text-role-caption text-danger [&_svg]:size-icon-sm">
            <CircleAlertIcon aria-hidden />
            {error}
          </p>
        ) : null}
        {actions ? <div className={cn("-mt-1 flex items-center", own ? "-mr-2 justify-end" : "-ml-2")}>{actions}</div> : null}
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
  /** 头行标题（content chat.tool.running / done / failed 已插值） */
  summary: string
  /** 头行右侧摘要（caption、单行截断），一般为 result */
  brief?: string
  labels: { aria: string; args: string; result: string; expand: string; collapse: string }
  defaultOpen?: boolean
}

/** 工具调用卡：hifi .tool —— surface + hairline + radius.md；summary 行 size.hit 高（状态图标 / label 名 / caption 摘要 / chevron）；展开为 dl「参数 / 结果」 */
function ToolCall({ name, args, status, result, summary, brief, labels, defaultOpen = false, className, ...props }: ToolCallProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <CollapsiblePrimitive.Root open={open} onOpenChange={setOpen} asChild>
      <div data-slot="tool-call" data-status={status} className={cn("w-full rounded-md border bg-surface", status === "error" && "border-danger", className)} {...props}>
        <CollapsiblePrimitive.Trigger
          aria-label={labels.aria}
          title={open ? labels.collapse : labels.expand}
          className="flex min-h-hit w-full items-center gap-2 rounded-md pr-2 pl-3 text-left transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted data-[state=open]:rounded-b-none data-[state=open]:border-b [&>svg:last-child]:size-icon-sm [&>svg:last-child]:shrink-0 [&>svg:last-child]:text-fg-muted [&>svg:last-child]:transition-transform [&>svg:last-child]:duration-(--motion-fast) [&[data-state=open]>svg:last-child]:rotate-180"
        >
          <span aria-hidden className={cn("grid size-icon-md shrink-0 place-items-center [&_svg]:size-icon-sm", status === "running" ? "text-primary" : status === "done" ? "text-success" : "text-danger")}>
            {status === "running" ? <Spinner /> : status === "done" ? <CheckIcon /> : <TriangleAlertIcon />}
          </span>
          <span className="whitespace-nowrap text-role-label text-fg">{summary}</span>
          <span className="min-w-0 flex-1 truncate text-role-caption text-fg-muted">{brief}</span>
          <ChevronDownIcon aria-hidden />
        </CollapsiblePrimitive.Trigger>
        <CollapsiblePrimitive.Content>
          <span className="sr-only">{name}</span>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 px-4 py-3 text-role-body">
            <dt className="pt-1 text-role-caption text-fg-muted">{labels.args}</dt>
            <dd className="font-mono text-sm wrap-anywhere">{args}</dd>
            {result ? (
              <>
                <dt className="pt-1 text-role-caption text-fg-muted">{labels.result}</dt>
                <dd className="wrap-anywhere">{result}</dd>
              </>
            ) : null}
          </dl>
        </CollapsiblePrimitive.Content>
      </div>
    </CollapsiblePrimitive.Root>
  )
}

/* ---------------- SourceChip / SuggestionChip ---------------- */

/** hifi .chip：元素热区 size.hit（上下 space.1 内距），视觉胶囊 .chip-body 高 size.control.sm、hairline、label 字体 */
const chipOuter = "group/chip inline-flex max-w-full shrink-0 items-center rounded-full py-1 text-fg focus-visible:-outline-offset-(--border-focus-offset)"
const chipBody =
  "inline-flex h-control-sm max-w-full items-center gap-2 truncate rounded-full border bg-surface px-3 text-role-label whitespace-nowrap transition-colors duration-(--motion-fast) ease-std group-hover/chip:border-border-strong group-hover/chip:bg-surface-muted [&_svg]:size-icon-sm [&_svg]:shrink-0 [&_svg]:text-fg-muted [&>span]:truncate"

type SourceChipProps = React.ComponentProps<"a"> & { type: "order" | "snapshot" | "doc" | "link"; label: string }

const SOURCE_ICON = { order: ReceiptTextIcon, snapshot: DatabaseIcon, doc: FileTextIcon, link: LinkIcon }

/** 来源 Chip：hifi .chip（.is-order 为 mono） */
function SourceChip({ type, label, className, ...props }: SourceChipProps) {
  const Icon = SOURCE_ICON[type]
  return (
    <a data-slot="source-chip" data-type={type} className={cn(chipOuter, "no-underline", className)} {...props}>
      <span className={cn(chipBody, type === "order" && "font-mono text-sm font-medium")}>
        <Icon aria-hidden />
        <span>{label}</span>
      </span>
    </a>
  )
}

type SuggestionChipProps = React.ComponentProps<"button"> & {
  /** chip：chat hifi .chip.is-suggest（单行、size.control.sm 胶囊 + 热区外层）；suggestion：components hifi .suggestion（min-height size.hit、可换行、hover primary-soft） */
  appearance?: "chip" | "suggestion"
}

/** 建议 Chip：hifi .chip.is-suggest —— 图标 primary */
function SuggestionChip({ appearance = "chip", className, children, ...props }: SuggestionChipProps) {
  if (appearance === "suggestion") {
    return (
      <button
        type="button"
        data-slot="suggestion-chip"
        data-appearance="suggestion"
        className={cn(
          "inline-flex min-h-hit max-w-full items-center gap-2 rounded-full border bg-surface px-4 text-left text-role-label text-fg transition-colors duration-(--motion-fast) ease-std hover:not-disabled:border-primary hover:not-disabled:bg-primary-soft hover:not-disabled:text-on-primary-soft disabled:disabled-look [&_svg]:size-icon-sm [&_svg]:shrink-0 [&_svg]:text-primary",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
  return (
    <button type="button" data-slot="suggestion-chip" className={cn(chipOuter, "text-left disabled:disabled-look", className)} {...props}>
      <span className={cn(chipBody, "[&_svg]:text-primary")}>{children}</span>
    </button>
  )
}

/* ---------------- Composer ---------------- */

type ComposerProps = Omit<React.ComponentProps<"form">, "onSubmit" | "onChange"> & {
  value: string
  onChange: (next: string) => void
  onSubmit: () => void
  onStop?: () => void
  onAttach?: () => void
  placeholder: string
  hint?: string
  streaming?: boolean
  disabled?: boolean
  /** 字数上限：超出时不可发送（计数显示由调用方通过 counter 传入） */
  max?: number
  labels: { send: string; stop: string; attach?: string; input?: string; attachTip?: string }
  /** 输入框上方的附件行（AttachmentChip 等） */
  attachments?: React.ReactNode
  /** 工具行：附件按钮之后的附加控件（模型选择等） */
  tools?: React.ReactNode
  /** 工具行右侧计数（hifi .counter，调用方决定显隐/超限色） */
  counter?: React.ReactNode
  /** 输入框下方 hint 行右侧的内联错误（附件超限等）；有错误时 ≤768 也显示该行 */
  error?: string
  /** 输入框上方（.box 之前）的内容：建议 Chip 行等 */
  above?: React.ReactNode
  maxRows?: number
}

/**
 * 输入区：hifi .composer / .box —— surface + hairline + radius.lg + shadow.sm，focus-within primary 描边 + primary-soft 外环；
 * 附件行 → 自增高 textarea（size.hit 起、≤ maxRows 行）→ 工具行（附件 / 模型 / 计数 … 发送圆钮；流式态变 bg-inverse 停止钮）；框外 hint 行 caption。
 * Enter 发送，Shift+Enter 换行。
 */
function Composer({ value, onChange, onSubmit, onStop, onAttach, placeholder, hint, streaming, disabled, max, labels, attachments, tools, counter, error, above, maxRows = 8, className, ...props }: ComposerProps) {
  const ref = React.useRef<HTMLTextAreaElement>(null)
  const inputId = React.useId()
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    const cs = getComputedStyle(el)
    const line = parseFloat(cs.lineHeight) || 0
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
    const hit = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-hit")) || 0
    el.style.height = `${Math.max(hit, Math.min(el.scrollHeight, line * maxRows + pad))}px`
  }, [value, maxRows])
  const over = max !== undefined && value.length > max
  const canSend = value.length > 0 && !over && !disabled && !streaming
  return (
    <form
      data-slot="composer"
      className={cn("flex w-full flex-col gap-2", className)}
      onSubmit={(e) => {
        e.preventDefault()
        if (canSend) onSubmit()
      }}
      {...props}
    >
      {above}
      <div className="flex flex-col gap-1 rounded-lg border bg-surface py-2 pr-2 pl-4 shadow-sm transition-[border-color,box-shadow] duration-(--motion-fast) ease-std focus-within:border-primary focus-within:shadow-[0_0_0_var(--border-width-focus)_var(--color-role-primary-soft)] has-[textarea:disabled]:bg-surface-muted">
        {attachments ? <div className="flex flex-wrap gap-2 pt-2">{attachments}</div> : null}
        <label htmlFor={inputId} className="sr-only">
          {labels.input ?? placeholder}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          rows={1}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              if (canSend) onSubmit()
            }
          }}
          className="block min-h-hit w-full resize-none border-0 bg-transparent py-[calc((var(--size-hit)-var(--font-size-sm)*var(--font-line-height-body))/2)] text-role-body text-fg placeholder:text-fg-muted focus-visible:outline-transparent disabled:cursor-not-allowed"
        />
        <div className="-ml-2 flex items-center gap-1">
          {labels.attach ? (
            <IconButton label={labels.attach} title={labels.attachTip} disabled={disabled} onClick={onAttach}>
              <PaperclipIcon />
            </IconButton>
          ) : null}
          {tools}
          {counter ? <span className="ml-auto px-2 text-role-caption whitespace-nowrap text-fg-muted tabular-nums">{counter}</span> : <span className="flex-1" />}
          {streaming ? (
            <IconButton type="button" label={labels.stop} onClick={onStop} className="bg-bg-inverse text-fg-inverse hover:not-disabled:bg-fg-muted hover:not-disabled:text-fg-inverse [&_svg]:size-icon-sm">
              <SquareIcon />
            </IconButton>
          ) : (
            <IconButton type="submit" label={labels.send} disabled={!canSend} className="bg-primary text-on-primary hover:not-disabled:bg-primary-hover hover:not-disabled:text-on-primary disabled:disabled-look">
              <ArrowUpIcon />
            </IconButton>
          )}
        </div>
      </div>
      {hint || error ? (
        <div className={cn("flex justify-between gap-3 px-1 text-role-caption text-fg-muted", !error && "mobile:hidden")}>
          <span className="mobile:hidden">{hint}</span>
          {error ? (
            <span role="alert" className="text-danger">
              {error}
            </span>
          ) : null}
        </div>
      ) : null}
    </form>
  )
}

/** 附件胶囊：hifi .att-chip —— size.hit 高、surface-muted、caption；右侧圆形移除钮 */
function AttachmentChip({ name, size, removeLabel, onRemove, className, ...props }: React.ComponentProps<"span"> & { name: string; size: string; removeLabel: string; onRemove: () => void }) {
  return (
    <span data-slot="attachment-chip" className={cn("inline-flex h-hit max-w-full items-center gap-2 rounded-full bg-surface-muted pl-3 text-role-caption text-fg [&>svg]:size-icon-sm [&>svg]:shrink-0 [&>svg]:text-fg-muted", className)} {...props}>
      <FileTextIcon aria-hidden />
      <span className="min-w-0 truncate">{name}</span>
      <span className="whitespace-nowrap text-fg-muted tabular-nums">· {size}</span>
      <IconButton label={removeLabel} shape="round" onClick={onRemove} className="[&_svg]:size-icon-sm">
        <XIcon />
      </IconButton>
    </span>
  )
}

/* ---------------- ConversationItem ---------------- */

type ConversationItemProps = React.ComponentProps<"a"> & {
  title: string
  /** 第二行元信息（已格式化时间 · 条数） */
  time: string
  active?: boolean
  unread?: boolean
  /** 右侧悬浮操作（更多菜单），hover / focus-within / active 时可见 */
  action?: React.ReactNode
}

/** 会话项：hifi .citem-link —— 两行（label 标题 + caption 元信息）、min-h size.control.lg、radius.md、hover surface-muted、当前 primary-soft；未读为标题后 size.dot 圆点 + 半粗 */
function ConversationItem({ title, time, active, unread, action, className, ...props }: ConversationItemProps) {
  return (
    <div data-slot="conversation-item" data-active={active || undefined} data-unread={unread || undefined} className="group/conv relative">
      <a
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-control-lg w-full flex-col gap-1 rounded-md py-2 pr-hit pl-3 text-left text-fg no-underline transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted aria-[current=page]:bg-primary-soft aria-[current=page]:text-on-primary-soft aria-[current=page]:[&_time]:text-on-primary-soft",
          className,
        )}
        {...props}
      >
        <span className={cn("flex min-w-0 items-center gap-2 text-role-label", unread && "font-semibold")}>
          <span className="min-w-0 truncate">{title}</span>
          {unread ? <i aria-hidden className="size-dot shrink-0 rounded-full bg-primary" /> : null}
        </span>
        <time className="truncate text-role-caption text-fg-muted tabular-nums">{time}</time>
      </a>
      {action ? (
        <span className="absolute top-1/2 right-1 -translate-y-1/2 opacity-0 transition-opacity duration-(--motion-fast) group-hover/conv:opacity-100 group-focus-within/conv:opacity-100 has-[[aria-expanded=true]]:opacity-100">
          {action}
        </span>
      ) : null}
    </div>
  )
}

export {
  ChatBubble,
  ToolCall,
  SourceChip,
  SuggestionChip,
  Composer,
  AttachmentChip,
  ConversationItem,
  type ChatBubbleProps,
  type ToolCallProps,
  type SourceChipProps,
  type ComposerProps,
  type ConversationItemProps,
}
