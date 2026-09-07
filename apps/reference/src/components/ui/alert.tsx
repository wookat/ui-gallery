import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/cn"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react"

/** 提示条：hifi .alert —— 三列（图标 / 正文 / 关闭），border 与图标取语义色，背景取 *-soft */
const alertVariants = cva(
  "grid grid-cols-[var(--size-icon-md)_1fr_auto] items-start gap-x-3 rounded-md border py-3 pr-3 pl-4 text-role-body text-fg [&>svg]:mt-hairline [&>svg]:size-icon-md",
  {
    variants: {
      variant: {
        danger: "border-danger bg-danger-soft [&>svg]:text-danger focus-visible:outline-danger",
        warning: "border-warning bg-warning-soft [&>svg]:text-warning focus-visible:outline-warning",
        success: "border-success bg-success-soft [&>svg]:text-success",
        info: "border-primary bg-primary-soft [&>svg]:text-on-primary-soft",
      },
    },
    defaultVariants: { variant: "danger" },
  },
)

const icons = { danger: CircleAlertIcon, warning: TriangleAlertIcon, success: CircleCheckIcon, info: InfoIcon }

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    closeLabel?: string
    onClose?: () => void
  }

function Alert({ className, variant, closeLabel, onClose, children, ...props }: AlertProps) {
  const Icon = icons[variant ?? "danger"]
  return (
    <div role="alert" data-slot="alert" data-variant={variant ?? "danger"} className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon aria-hidden />
      <div data-slot="alert-body" className="grid gap-2 self-center">
        {children}
      </div>
      {onClose ? (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="-my-2 grid size-hit place-items-center rounded-sm text-fg-muted transition-colors duration-(--motion-fast) ease-std hover:bg-surface hover:text-fg [&_svg]:size-icon-md"
        >
          <XIcon />
        </button>
      ) : (
        <span aria-hidden />
      )}
    </div>
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="alert-description" className={cn("m-0", className)} {...props} />
}

/** 提示条内的行内动作（hifi .alert-action） */
function AlertAction({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="alert-action"
      className={cn(
        "-my-1 -ml-3 inline-flex min-h-hit items-center gap-1 justify-self-start rounded-sm px-3 text-role-label text-fg transition-colors duration-(--motion-fast) ease-std hover:bg-surface [&_svg]:size-icon-sm [&_svg]:text-warning",
        className,
      )}
      {...props}
    />
  )
}

export { Alert, AlertDescription, AlertAction, alertVariants }
