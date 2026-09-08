import * as React from "react"
import { cn } from "@/lib/cn"
import { ChevronDownIcon } from "lucide-react"

type SelectProps = Omit<React.ComponentProps<"select">, "placeholder"> & {
  invalid?: boolean
  /** 占位项文案：渲染为 value="" 的禁用 option；选中时触发器文字 fg-muted */
  placeholder?: string
  /** 左侧装饰图标（hifi .ctl.select > .icon） */
  leading?: React.ReactNode
  wrapClassName?: string
}

/**
 * 下拉选择：hifi .ctl.select —— 原生 <select>（各稿均为原生控件，移动端用系统选择器），
 * 与 Input 同高同边框、右侧 size.hit 宽的 chevron 装饰；占位态 fg-muted、aria-invalid 强调边框。
 */
function Select({ className, wrapClassName, invalid, placeholder, leading, children, value, defaultValue, onChange, disabled, ...props }: SelectProps) {
  const [empty, setEmpty] = React.useState(() => !(value ?? defaultValue))
  const isEmpty = value === undefined ? empty : value === ""
  return (
    <span data-slot="select-wrap" data-disabled={disabled || undefined} className={cn("relative inline-flex w-full min-w-0 items-center text-fg-muted [&_svg]:pointer-events-none [&_svg]:size-icon-md", wrapClassName)}>
      {leading ? (
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 grid w-hit place-items-center">
          {leading}
        </span>
      ) : null}
      <select
        data-slot="select"
        data-placeholder={isEmpty ? "" : undefined}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        value={value}
        defaultValue={placeholder && defaultValue === undefined && value === undefined ? "" : defaultValue}
        onChange={(e) => {
          setEmpty(e.target.value === "")
          onChange?.(e)
        }}
        className={cn(
          "h-control-md w-full min-w-0 cursor-pointer appearance-none truncate rounded-md border border-border-strong bg-surface pr-hit text-role-body text-fg transition-colors duration-(--motion-fast) ease-std data-placeholder:text-fg-muted hover:not-disabled:border-fg-muted focus-visible:border-primary aria-invalid:border-(length:--border-width-accent) aria-invalid:border-danger disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-muted",
          leading ? "pl-hit" : "pl-3",
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 grid w-hit place-items-center">
        <ChevronDownIcon />
      </span>
    </span>
  )
}

export { Select, type SelectProps }
