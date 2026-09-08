import * as React from "react"
import { cn } from "@/lib/cn"
import { CheckIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

/** 复选框：hifi .check .box —— icon.md 方框、radius.xs、勾选转 primary；外层 label 提供 size.hit 热区 */
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer hit-area grid size-icon-md shrink-0 place-items-center rounded-xs border border-border-strong bg-surface text-on-primary transition-colors duration-(--motion-fast) ease-std hover:not-disabled:border-fg-muted data-[state=checked]:border-primary data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-muted disabled:data-[state=checked]:border-fg-disabled disabled:data-[state=checked]:bg-fg-disabled aria-invalid:border-danger",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-content-center [&_svg]:size-icon-sm">
        <CheckIcon strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

/** 带文字的复选项：整行可点，min-h = size.hit */
function CheckboxField({
  id,
  label,
  className,
  ...props
}: React.ComponentProps<typeof Checkbox> & { id: string; label: React.ReactNode }) {
  return (
    <label
      htmlFor={id}
      data-slot="checkbox-field"
      className={cn(
        "inline-flex min-h-hit cursor-pointer items-center gap-2 text-role-body select-none has-disabled:cursor-not-allowed has-disabled:text-fg-muted",
        className,
      )}
    >
      <Checkbox id={id} {...props} />
      <span>{label}</span>
    </label>
  )
}

export { Checkbox, CheckboxField }
