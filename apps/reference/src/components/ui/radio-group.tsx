import * as React from "react"
import { cn } from "@/lib/cn"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("flex flex-col gap-1", className)} {...props} />
}

/** 单选圆点：hifi .radio .dot —— icon.md 圆、border-strong；选中转 primary 加粗边 + size.dot 内点 */
function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "peer hit-area grid size-icon-md shrink-0 place-items-center rounded-full border border-border-strong bg-surface transition-colors duration-(--motion-fast) ease-std hover:not-disabled:border-primary data-[state=checked]:border-(length:--border-width-focus) data-[state=checked]:border-primary disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-muted aria-invalid:border-danger",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="size-dot rounded-full bg-primary" />
    </RadioGroupPrimitive.Item>
  )
}

/** 带文字与说明的单选项：整行可点，min-h = size.hit（hifi .radio / .radio-text .hint） */
function RadioField({
  id,
  label,
  hint,
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupItem> & { id: string; label: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <label
      htmlFor={id}
      data-slot="radio-field"
      className={cn(
        "inline-flex min-h-hit cursor-pointer items-start gap-3 py-2 text-role-body select-none has-disabled:cursor-not-allowed has-disabled:text-fg-muted",
        className,
      )}
    >
      <RadioGroupItem id={id} className="mt-[calc((var(--font-size-md)*var(--font-line-height-body)-var(--size-icon-md))/2)]" {...props} />
      <span className="flex flex-col">
        <span>{label}</span>
        {hint ? <span className="text-role-caption text-fg-muted">{hint}</span> : null}
      </span>
    </label>
  )
}

export { RadioGroup, RadioGroupItem, RadioField }
