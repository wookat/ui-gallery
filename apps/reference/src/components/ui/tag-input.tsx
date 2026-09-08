import * as React from "react"
import { cn } from "@/lib/cn"
import { XIcon } from "lucide-react"

/** 可移除的标签片：hifi .chip —— h size.chip、neutral-soft、右侧 size.hit 热区的 × */
function Chip({ children, onRemove, removeLabel, disabled, className, ...props }: React.ComponentProps<"span"> & { onRemove?: () => void; removeLabel?: string; disabled?: boolean }) {
  return (
    <span data-slot="chip" className={cn("inline-flex h-chip max-w-full items-center gap-1 rounded-full bg-neutral-soft pl-3 text-role-caption font-medium text-on-neutral-soft", onRemove ? "pr-1" : "pr-3", className)} {...props}>
      <span className="truncate">{children}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label={removeLabel}
          disabled={disabled}
          onClick={onRemove}
          className="hit-area grid size-icon-md place-items-center rounded-full text-fg-muted transition-colors duration-(--motion-fast) ease-std hover:not-disabled:bg-surface hover:not-disabled:text-fg disabled:disabled-look [&_svg]:size-icon-sm"
        >
          <XIcon />
        </button>
      ) : null}
    </span>
  )
}

type TagInputProps = Omit<React.ComponentProps<"input">, "value" | "onChange"> & {
  value: readonly string[]
  onChange: (next: string[]) => void
  /** 「移除 {tag}」的可访问名 */
  removeLabel: (tag: string) => string
  max?: number
  invalid?: boolean
}

/** 标签输入：hifi .taginput —— 与 Input 同边框，chip 换行 + 内联输入；Enter / 逗号确认，Backspace 删末项 */
function TagInput({ value, onChange, removeLabel, max, invalid, className, disabled, placeholder, ...props }: TagInputProps) {
  const [draft, setDraft] = React.useState("")
  const full = max !== undefined && value.length >= max
  const commit = () => {
    const tag = draft.trim().replace(/,$/, "")
    if (tag && !value.includes(tag) && !full) onChange([...value, tag])
    setDraft("")
  }
  return (
    <div
      data-slot="tag-input"
      aria-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "flex min-h-control-md w-full flex-wrap items-center gap-1 rounded-md border border-border-strong bg-surface px-2 py-1 transition-colors duration-(--motion-fast) ease-std has-focus-visible:border-primary aria-invalid:border-(length:--border-width-accent) aria-invalid:border-danger data-disabled:cursor-not-allowed data-disabled:bg-surface-muted",
        className,
      )}
    >
      {value.map((tag) => (
        <Chip key={tag} removeLabel={removeLabel(tag)} disabled={disabled} onRemove={() => onChange(value.filter((v) => v !== tag))}>
          {tag}
        </Chip>
      ))}
      <label className="-my-1 flex min-h-hit min-w-[calc(var(--size-hit)*2)] flex-1 items-center">
        <input
          type="text"
          value={draft}
          disabled={disabled || full}
          placeholder={value.length === 0 ? placeholder : undefined}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault()
              commit()
            } else if (e.key === "Backspace" && draft === "" && value.length) {
              onChange(value.slice(0, -1))
            }
          }}
          className="h-full w-full min-w-0 border-0 bg-transparent text-role-body text-fg outline-none placeholder:text-fg-muted disabled:cursor-not-allowed"
          {...props}
        />
      </label>
    </div>
  )
}

export { TagInput, Chip, type TagInputProps }
