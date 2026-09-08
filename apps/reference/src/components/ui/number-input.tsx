import * as React from "react"
import { cn } from "@/lib/cn"
import { MinusIcon, PlusIcon } from "lucide-react"

import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"

type NumberInputProps = Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> & {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  step?: number
  /** 两侧步进按钮的可访问名 */
  decrementLabel: string
  incrementLabel: string
}

/** 数字步进：hifi .number —— 左右 size.hit 图标按钮 + 居中 tabular 输入框，三段共享圆角 */
function NumberInput({ value, onChange, min, max, step = 1, decrementLabel, incrementLabel, className, disabled, ...props }: NumberInputProps) {
  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n))
  return (
    <div data-slot="number-input" className={cn("inline-flex items-stretch", className)}>
      <IconButton
        label={decrementLabel}
        disabled={disabled || (min !== undefined && value <= min)}
        onClick={() => onChange(clamp(value - step))}
        className="rounded-r-none border border-r-0 bg-surface"
      >
        <MinusIcon />
      </IconButton>
      <Input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="w-[calc(var(--size-hit)+var(--space-6))] rounded-none text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        {...props}
      />
      <IconButton
        label={incrementLabel}
        disabled={disabled || (max !== undefined && value >= max)}
        onClick={() => onChange(clamp(value + step))}
        className="rounded-l-none border border-l-0 bg-surface"
      >
        <PlusIcon />
      </IconButton>
    </div>
  )
}

export { NumberInput, type NumberInputProps }
