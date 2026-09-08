import * as React from "react"
import { cn } from "@/lib/cn"
import { Switch as SwitchPrimitive } from "radix-ui"

/**
 * 开关：hifi .switch —— 轨道 icon.lg 高 × 1.5 宽、border-strong；选中 primary；滑块 surface + shadow.sm；外层 .switch-hit 撑到 size.hit。
 * size="sm"：settings 稿 .switch —— 轨道 icon.md 高（20）× 36 宽，滑块 icon.sm（16）；稿中轨道居中于 size.hit 方框，横向各留 space.1/2 外距凑齐 40 宽，热区由 hit-area 保证。
 */
function Switch({ className, size = "md", ...props }: React.ComponentProps<typeof SwitchPrimitive.Root> & { size?: "md" | "sm" }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer hit-area inline-flex shrink-0 cursor-pointer items-center rounded-full bg-border-strong transition-colors duration-(--motion-fast) ease-std hover:not-disabled:bg-fg-muted data-[state=checked]:bg-primary data-[state=checked]:hover:not-disabled:bg-primary-hover disabled:disabled-look",
        size === "sm" ? "mx-[calc(var(--space-1)/2)] h-icon-md w-[calc(var(--size-icon-md)*2-var(--space-1))]" : "h-icon-lg w-[calc(var(--size-icon-lg)*1.5)]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "block rounded-full bg-surface shadow-sm transition-transform duration-(--motion-fast) ease-std",
          size === "sm"
            ? "size-icon-sm translate-x-[calc(var(--space-1)/2)] data-[state=checked]:translate-x-[calc(var(--space-1)/2+var(--size-icon-sm))]"
            : "size-[calc(var(--size-icon-lg)-var(--space-2))] translate-x-1 data-[state=checked]:translate-x-[calc(var(--size-icon-lg)*0.5+var(--space-1))]",
        )}
      />
    </SwitchPrimitive.Root>
  )
}

/** 开关行：hifi .switch-row —— 左侧标题 + 说明，右侧开关；整行 min-h size.hit */
function SwitchField({
  id,
  label,
  hint,
  className,
  ...props
}: React.ComponentProps<typeof Switch> & { id: string; label: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div data-slot="switch-field" className={cn("flex min-h-hit w-full items-center gap-3", className)}>
      <label htmlFor={id} className="flex min-w-0 flex-1 cursor-pointer flex-col text-role-body select-none">
        <span className="text-role-label">{label}</span>
        {hint ? <span className="text-role-caption text-fg-muted">{hint}</span> : null}
      </label>
      <span className="inline-grid size-hit shrink-0 place-items-center">
        <Switch id={id} {...props} />
      </span>
    </div>
  )
}

export { Switch, SwitchField }
