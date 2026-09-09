import * as React from "react"
import { cn } from "@/lib/cn"
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"

type ComboboxOption = {
  value: string
  label: string
  /** 副文案（选项第二行） */
  hint?: React.ReactNode
  /** 右侧附加内容（价格 / 标签） */
  trailing?: React.ReactNode
  /** 额外可搜索文本（SKU 编码、法定名等），不显示 */
  keywords?: string
  disabled?: boolean
}

type ComboboxProps = {
  id?: string
  options: readonly ComboboxOption[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder: string
  searchPlaceholder: string
  emptyText: string
  /** button：触发器同 Select，面板顶部搜索行；input：hifi .ctl.combo —— 搜索图标 + 可输入框，面板紧贴其下 */
  variant?: "button" | "input"
  /** input 变体的前导图标（默认 search；settings 时区稿为 globe） */
  leadingIcon?: React.ReactNode
  disabled?: boolean
  invalid?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onBlur?: React.FocusEventHandler<HTMLElement>
  className?: string
} & Pick<React.ComponentProps<"button">, "aria-label" | "aria-labelledby" | "aria-describedby">

const matches = (o: ComboboxOption, q: string) => {
  const s = q.trim().toLowerCase()
  if (!s) return true
  return o.label.toLowerCase().includes(s) || (o.keywords?.toLowerCase().includes(s) ?? false)
}

/**
 * 搜索选择：hifi .select + .listbox / .combobox-head —— 触发器同 Select，面板顶部搜索行（size.hit 高、底部 hairline），
 * 选项 role=option、aria-selected；无匹配显示 .listbox-empty。APG combobox 模式：↑↓ 移动、Enter 选中、Esc 关闭。
 */
function Combobox({
  id,
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  variant = "button",
  leadingIcon = <SearchIcon />,
  disabled,
  invalid,
  open: openProp,
  onOpenChange,
  onBlur,
  className,
  ...aria
}: ComboboxProps) {
  const [openState, setOpenState] = React.useState(false)
  const open = openProp ?? openState
  const setOpen = (o: boolean) => {
    setOpenState(o)
    onOpenChange?.(o)
  }
  const [query, setQuery] = React.useState("")
  const [editing, setEditing] = React.useState(false)
  const inline = variant === "input"
  /** hifi form .option.is-active：内联搜索框打开时不预选，方向键/悬停后才高亮；按钮式下拉保留预选首项 */
  const initialActive = inline ? -1 : 0
  const [active, setActive] = React.useState(initialActive)
  const listId = React.useId()
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value) ?? null
  const filtered = options.filter((o) => matches(o, query))
  const close = () => {
    setOpen(false)
    setQuery("")
    setEditing(false)
    setActive(initialActive)
  }
  const pick = (o: ComboboxOption) => {
    if (o.disabled) return
    onChange(inline || o.value !== value ? o.value : null)
    close()
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (!open) setOpen(true)
      setActive((i) => Math.min(filtered.length - 1, i + 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === "Enter") {
      if (!open) return
      e.preventDefault()
      if (filtered[active]) pick(filtered[active])
    } else if (e.key === "Escape") {
      if (open) e.preventDefault()
      close()
    }
  }

  const list = (
    <ul id={listId} role="listbox" aria-label={placeholder} tabIndex={-1} className="max-h-[calc(var(--size-hit)*6+var(--space-2))] overflow-y-auto">
      {filtered.length === 0 ? (
        <li data-slot="combobox-empty" className={cn("text-center text-fg-muted", inline ? "flex min-h-hit items-center justify-center px-3 text-role-caption" : "px-3 py-6")}>
          {emptyText}
        </li>
      ) : (
        filtered.map((o, i) => (
          <li
            key={o.value}
            id={`${listId}-${o.value}`}
            role="option"
            aria-selected={o.value === value}
            aria-disabled={o.disabled || undefined}
            data-active={i === active ? "" : undefined}
            onMouseEnter={() => setActive(i)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => pick(o)}
            className="flex min-h-hit w-full cursor-pointer items-center justify-between gap-3 rounded-sm px-3 py-2 text-left text-role-body select-none data-active:bg-surface-muted aria-selected:bg-primary-soft aria-selected:text-on-primary-soft aria-disabled:disabled-look [&_svg]:size-icon-md"
          >
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate">{o.label}</span>
              {o.hint ? <span className="flex flex-wrap items-center gap-2 text-role-caption text-fg-muted">{o.hint}</span> : null}
            </span>
            {o.trailing ? <span className="flex shrink-0 items-center gap-2 text-role-label tabular-nums">{o.trailing}</span> : null}
            {o.value === value ? <CheckIcon aria-hidden className="shrink-0 text-primary [&]:size-icon-sm" /> : null}
          </li>
        ))
      )}
    </ul>
  )

  if (inline) {
    return (
      <PopoverPrimitive.Root open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
        <PopoverPrimitive.Anchor asChild>
          <div ref={anchorRef} data-slot="combobox-input" className={cn("relative flex w-full min-w-0 items-center text-fg-muted [&_svg]:pointer-events-none", className)}>
            <span aria-hidden className="absolute inset-y-0 left-0 grid w-hit place-items-center [&_svg]:size-icon-sm">
              {leadingIcon}
            </span>
            <input
              id={id}
              type="text"
              role="combobox"
              autoComplete="off"
              aria-expanded={open}
              aria-controls={listId}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              aria-activedescendant={open && filtered[active] ? `${listId}-${filtered[active].value}` : undefined}
              aria-invalid={invalid || undefined}
              disabled={disabled}
              placeholder={placeholder}
              value={editing ? query : (selected?.label ?? "")}
              onChange={(e) => {
                setEditing(true)
                setQuery(e.target.value)
                setActive(initialActive)
                if (!open) setOpen(true)
              }}
              onClick={() => {
                if (!open) setOpen(true)
              }}
              onFocus={() => {
                if (!open) setOpen(true)
              }}
              onBlur={(e) => {
                // 键盘 Tab 离开（relatedTarget 为面板外元素）时收起面板；程序化 blur / 点在非可聚焦处（null）不处理，交给 onInteractOutside
                const to = e.relatedTarget
                if (open && to instanceof Node && !anchorRef.current?.contains(to) && !contentRef.current?.contains(to)) close()
                onBlur?.(e)
              }}
              onKeyDown={onKeyDown}
              className="h-control-md w-full min-w-0 rounded-md border border-border-strong bg-surface pl-hit pr-hit text-role-body text-fg transition-colors duration-(--motion-fast) ease-std placeholder:text-fg-muted hover:not-disabled:border-fg-muted focus-visible:border-primary aria-expanded:border-primary aria-invalid:border-(length:--border-width-accent) aria-invalid:border-danger aria-invalid:focus-visible:outline-danger disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-muted"
              {...aria}
            />
            <span aria-hidden className="absolute inset-y-0 right-0 grid w-hit place-items-center [&_svg]:size-icon-md">
              <ChevronDownIcon />
            </span>
          </div>
        </PopoverPrimitive.Anchor>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            ref={contentRef}
            data-slot="combobox-content"
            align="start"
            sideOffset={4}
            avoidCollisions={false}
            hideWhenDetached
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (e.target instanceof Node && anchorRef.current?.contains(e.target)) e.preventDefault()
            }}
            aria-label={aria["aria-label"] ?? placeholder}
            className="z-40 flex w-(--radix-popover-trigger-width) flex-col rounded-md border bg-surface-raised p-1 text-fg shadow-lg outline-none"
          >
            {list}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    )
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-haspopup="listbox"
          aria-invalid={invalid || undefined}
          disabled={disabled}
          onBlur={onBlur}
          data-slot="combobox-trigger"
          data-placeholder={selected ? undefined : ""}
          className={cn(
            "flex h-control-md w-full min-w-0 items-center justify-between gap-2 rounded-md border border-border-strong bg-surface pl-3 text-left text-role-body text-fg transition-colors duration-(--motion-fast) ease-std data-[placeholder]:text-fg-muted hover:not-disabled:border-fg-muted focus-visible:border-primary aria-expanded:border-primary aria-invalid:border-(length:--border-width-accent) aria-invalid:border-danger disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-muted",
            className,
          )}
          {...aria}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <span aria-hidden className="grid size-hit shrink-0 place-items-center text-fg-muted [&_svg]:size-icon-md">
            <ChevronDownIcon />
          </span>
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="combobox-content"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          aria-label={aria["aria-label"] ?? placeholder}
          className="z-40 flex w-(--radix-popover-trigger-width) flex-col rounded-md border bg-surface-raised p-1 text-fg shadow-lg outline-none"
        >
          <div className="mb-1 flex min-h-hit items-center gap-2 border-b px-2 text-fg-muted [&_svg]:size-icon-sm">
            <SearchIcon aria-hidden />
            <input
              autoFocus
              type="text"
              role="searchbox"
              aria-label={searchPlaceholder}
              aria-controls={listId}
              aria-activedescendant={filtered[active] ? `${listId}-${filtered[active].value}` : undefined}
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActive(0)
              }}
              onKeyDown={onKeyDown}
              className="h-hit min-w-0 flex-1 border-0 bg-transparent text-fg outline-none placeholder:text-fg-muted"
            />
          </div>
          {list}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { Combobox, type ComboboxOption, type ComboboxProps }
