import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/cn"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, MessageSquareIcon, TriangleAlertIcon, XIcon } from "lucide-react"

/**
 * 提示条：三列网格（图标 / 正文 / 动作 + 关闭），背景取 *-soft。
 *   - appearance="outlined"（默认，login 稿 .alert）：hairline 语义色边框，正文 fg
 *   - appearance="soft"（components 稿 .alert）：无边框（info 边框同底色、neutral 普通 border），正文与图标同语义色
 * 行内动作可作为子元素（AlertAction，跟在正文下方）或通过 action 放到标题行右侧（hifi components 稿）。
 */
const alertVariants = cva(
  "grid grid-cols-[var(--size-icon-md)_minmax(0,1fr)_auto] items-start gap-x-3 rounded-md border py-3 pr-3 pl-4 text-role-body [&>svg]:mt-hairline [&>svg]:size-icon-md [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        danger: "bg-danger-soft [&>svg]:text-danger focus-visible:outline-danger",
        warning: "bg-warning-soft [&>svg]:text-warning focus-visible:outline-warning",
        success: "bg-success-soft [&>svg]:text-success",
        info: "bg-primary-soft [&>svg]:text-on-primary-soft",
        neutral: "border-border bg-surface-muted text-fg [&>svg]:text-fg-muted [&_[data-slot=alert-description]]:text-fg-muted",
      },
      appearance: {
        outlined: "text-fg",
        soft: "border-transparent [&>[data-slot=alert-body]]:py-2 [&>svg]:mt-[calc(var(--space-2)_+_var(--space-1)_/_2)]",
      },
    },
    compoundVariants: [
      { appearance: "outlined", variant: "danger", className: "border-danger" },
      { appearance: "outlined", variant: "warning", className: "border-warning" },
      { appearance: "outlined", variant: "success", className: "border-success" },
      { appearance: "outlined", variant: "info", className: "border-primary" },
      { appearance: "soft", variant: "danger", className: "text-danger" },
      { appearance: "soft", variant: "warning", className: "text-warning" },
      { appearance: "soft", variant: "success", className: "text-success" },
      { appearance: "soft", variant: "info", className: "border-primary-soft text-on-primary-soft" },
      { appearance: "soft", variant: "neutral", className: "border-border" },
    ],
    defaultVariants: { variant: "danger", appearance: "outlined" },
  },
)

const icons = { danger: CircleAlertIcon, warning: TriangleAlertIcon, success: CircleCheckIcon, info: InfoIcon, neutral: MessageSquareIcon }

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    closeLabel?: string
    onClose?: () => void
    /** 标题行右侧的动作（hifi components 稿：ghost sm 按钮，颜色随提示条） */
    action?: React.ReactNode
  }

function Alert({ className, variant, appearance, closeLabel, onClose, action, children, ...props }: AlertProps) {
  const Icon = icons[variant ?? "danger"]
  return (
    <div
      role="alert"
      data-slot="alert"
      data-variant={variant ?? "danger"}
      data-appearance={appearance ?? "outlined"}
      className={cn(alertVariants({ variant, appearance }), className)}
      {...props}
    >
      <Icon aria-hidden />
      <div data-slot="alert-body" className="grid min-w-0 gap-2 self-center wrap-anywhere [&>[data-slot=alert-title]+[data-slot=alert-description]]:-mt-1">
        {children}
      </div>
      {action || onClose ? (
        <span data-slot="alert-actions" className={cn("flex items-center [&_[data-slot=button]]:text-inherit", appearance !== "soft" && "-my-2")}>
          {action}
          {onClose ? (
            <button
              type="button"
              aria-label={closeLabel}
              onClick={onClose}
              className={cn(
                "grid size-hit place-items-center rounded-sm transition-colors duration-(--motion-fast) ease-std hover:bg-surface [&_svg]:size-icon-md",
                appearance === "soft" ? "text-inherit" : "text-fg-muted hover:text-fg",
              )}
            >
              <XIcon />
            </button>
          ) : null}
        </span>
      ) : (
        <span aria-hidden />
      )}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"strong">) {
  return <strong data-slot="alert-title" className={cn("text-role-label", className)} {...props} />
}

function AlertDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="alert-description" className={cn("m-0", className)} {...props} />
}

/** 提示条正文内的行内动作（login 稿 .alert-action：跟在正文下方） */
function AlertAction({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="alert-action"
      className={cn(
        "-my-1 -ml-3 inline-flex min-h-hit items-center gap-1 justify-self-start rounded-sm px-3 text-role-label transition-colors duration-(--motion-fast) ease-std hover:bg-surface [&_svg]:size-icon-sm [&_svg]:text-warning",
        className,
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction, alertVariants }
