import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/cn"
import { Slot } from "radix-ui"

import { Spinner } from "@/components/ui/spinner"

/**
 * 按钮：形态对齐 design/hifi（.btn / .btn-primary / .btn-secondary / .btn-ghost / .iconbtn）。
 * 高度 = size.control.*，最小热区 = size.hit，圆角 = radius.md，字体 = typography.label。
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent text-role-label whitespace-nowrap select-none transition-colors duration-(--motion-fast) ease-std disabled:cursor-not-allowed aria-disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-icon-sm",
  {
    variants: {
      variant: {
        primary:
          "bg-primary border-primary text-on-primary hover:not-disabled:bg-primary-hover hover:not-disabled:border-primary-hover active:not-disabled:bg-primary-active active:not-disabled:border-primary-active disabled:not-aria-busy:bg-neutral-soft disabled:not-aria-busy:border-neutral-soft disabled:not-aria-busy:text-on-neutral-soft aria-busy:cursor-progress",
        secondary:
          "bg-surface border-border text-fg hover:not-disabled:bg-surface-muted hover:not-disabled:border-border-strong active:not-disabled:bg-neutral-soft disabled:bg-surface-muted disabled:text-fg-muted [&_svg]:text-fg-muted",
        ghost:
          "px-3 text-link hover:not-disabled:bg-primary-soft hover:not-disabled:text-on-primary-soft aria-expanded:bg-primary-soft aria-expanded:text-on-primary-soft disabled:disabled-look",
        danger:
          "bg-danger border-danger text-on-danger hover:not-disabled:opacity-90 disabled:disabled-look",
        link: "h-auto min-h-hit px-1 text-link underline-offset-4 hover:not-disabled:underline",
      },
      size: {
        sm: "hit-area h-control-sm px-3",
        md: "h-control-md min-w-hit px-4",
        lg: "h-control-lg px-6",
      },
      block: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** 提交中：aria-busy + 禁用 + 前置 spinner，文案由调用方切换（content 的 submit.loading） */
    loading?: boolean
  }

function Button({ className, variant, size, block, asChild = false, loading = false, disabled, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? "primary"}
      data-size={size ?? "md"}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading ? <Spinner /> : null}
          {children}
        </>
      )}
    </Comp>
  )
}

export { Button, buttonVariants, type ButtonProps }
