import * as React from "react"
import { cn } from "@/lib/cn"

type InputSize = "sm" | "md" | "lg"

const inputSizes: Record<InputSize, string> = {
  sm: "h-control-sm text-role-caption",
  md: "h-control-md text-role-body",
  lg: "h-control-lg text-role-body",
}

type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  /** control.sm / md / lg 高（hifi .input-sm / .input-lg）；sm 视觉 32，需包在 InputControl hit 里撑到 size.hit */
  size?: InputSize
}

/** 输入框：hifi .input —— control.md 高、border-strong、hover 转 fg-muted、focus 转 primary、invalid 加粗 danger */
function Input({ className, type, size = "md", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(
        "w-full min-w-0 rounded-md border border-border-strong bg-surface px-3 text-fg transition-colors duration-(--motion-fast) ease-std placeholder:text-fg-muted hover:not-disabled:not-read-only:border-fg-muted focus-visible:border-primary aria-invalid:border-(length:--border-width-accent) aria-invalid:border-danger aria-invalid:pl-[calc(var(--space-3)-var(--border-width-accent)+var(--border-width-hairline))] aria-invalid:focus-visible:outline-danger read-only:bg-surface-muted read-only:text-fg-muted disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-muted",
        inputSizes[size],
        className,
      )}
      {...props}
    />
  )
}

type InputControlProps = React.HTMLAttributes<HTMLElement> & {
  /** 左侧装饰图标（hifi .control.has-icon-l），输入框左内距让出 size.hit */
  leading?: React.ReactNode
  /** 右侧 size.hit 宽的图标按钮 / 装饰（hifi .control.has-icon-r） */
  trailing?: React.ReactNode
  /** 前缀块（hifi .affix），与输入框共享圆角 */
  affix?: React.ReactNode
  /** 渲染为 label：sm 输入框视觉 32，包裹层撑到 size.hit，点空白处也聚焦（hifi .control:has(> .input-sm)） */
  hit?: boolean
}

/** 输入框包裹层：hifi .control —— 相对定位，承载左图标 / 右按钮 / 前缀 */
function InputControl({ leading, trailing, affix, hit, className, children, ...props }: InputControlProps) {
  const Comp: React.ElementType = hit ? "label" : "div"
  return (
    <Comp
      data-slot="input-control"
      className={cn(
        "relative flex w-full min-w-0 items-center",
        hit && "min-h-hit cursor-text",
        leading && "[&_[data-slot=input]]:pl-hit",
        trailing && "[&_[data-slot=input]]:pr-hit",
        affix && "[&_[data-slot=input]]:rounded-l-none",
        className,
      )}
      {...props}
    >
      {affix ? (
        <span data-slot="input-affix" className="inline-flex h-control-md shrink-0 items-center rounded-l-md border border-r-0 border-border-strong bg-surface-muted px-3 text-role-body whitespace-nowrap text-fg-muted">
          {affix}
        </span>
      ) : null}
      {leading ? (
        <span aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted [&_svg]:size-icon-sm">
          {leading}
        </span>
      ) : null}
      {children}
      {trailing ? <span className="absolute inset-y-0 right-0 flex items-center [&_svg]:size-icon-sm">{trailing}</span> : null}
    </Comp>
  )
}

export { Input, InputControl, type InputProps, type InputSize }
