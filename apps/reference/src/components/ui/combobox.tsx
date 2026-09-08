import * as React from "react"
import { cn } from "@/lib/cn"
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"

type ComboboxOption = { value: string; label: string; hint?: string; disabled?: boolean }

type ComboboxProps = {
  id?: string
  options: readonly ComboboxOption[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder: string
  searchPlaceholder: string
  emptyText: string
  disabled?: boolean
  invalid?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
} & Pick<React.ComponentProps<"button">, "aria-label" | "aria-labelledby" | "aria-describedby">

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
  disabled,
  invalid,
  open: openProp,
  onOpenChange,
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
  const [active, setActive] = React.useState(0)
  const listId = React.useId()
  const selected = options.find((o) => o.value === value) ?? null
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()))
  const pick = (o: ComboboxOption) => {
    if (o.disabled) return
    onChange(o.value === value ? null : o.value)
    setOpen(false)
    setQuery("")
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((i) => Math.min(filtered.length - 1, i + 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filtered[active]) pick(filtered[active])
    } else if (e.key === "Escape") {
      setOpen(false)
    }
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
          <ul id={listId} role="listbox" aria-label={placeholder} className="flex max-h-[calc(var(--size-hit)*6)] flex-col overflow-y-auto">
            {filtered.length === 0 ? (
              <li data-slot="combobox-empty" className="px-3 py-6 text-center text-fg-muted">
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
                  onClick={() => pick(o)}
                  className="flex min-h-hit w-full cursor-pointer items-center gap-3 rounded-sm px-3 text-left text-role-body select-none data-active:bg-surface-muted aria-selected:bg-primary-soft aria-selected:text-on-primary-soft aria-disabled:disabled-look [&_svg]:size-icon-md"
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{o.label}</span>
                    {o.hint ? <span className="text-role-caption text-fg-muted">{o.hint}</span> : null}
                  </span>
                  {o.value === value ? <CheckIcon aria-hidden className="ml-auto text-primary" /> : null}
                </li>
              ))
            )}
          </ul>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { Combobox, type ComboboxOption, type ComboboxProps }
