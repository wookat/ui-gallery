import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react"
import { Toaster as Sonner, toast, type ToasterProps } from "sonner"

import { Spinner } from "@/components/ui/spinner"
import { useTheme } from "@/components/theme-provider"

/**
 * Toast：hifi .toast —— surface-raised、hairline、radius.lg、shadow.lg、label 字体；成功图标 success 色。
 * 采用 sonner unstyled，所有外观由 classNames 中的令牌工具类给出。
 */
function Toaster(props: ToasterProps) {
  const { resolved } = useTheme()
  return (
    <Sonner
      theme={resolved}
      position="top-right"
      offset={{ top: "calc(var(--size-topbar) + var(--space-4))", right: "var(--space-6)" }}
      mobileOffset={{ top: "calc(var(--size-topbar) + var(--space-4))", left: "var(--space-4)", right: "var(--space-4)" }}
      gap={8}
      closeButton
      icons={{
        success: <CircleCheckIcon className="size-icon-md text-success" />,
        info: <InfoIcon className="size-icon-md text-on-primary-soft" />,
        warning: <TriangleAlertIcon className="size-icon-md text-warning" />,
        error: <CircleAlertIcon className="size-icon-md text-danger" />,
        loading: <Spinner className="size-icon-md text-fg-muted" />,
        close: <XIcon className="size-icon-md" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center gap-3 rounded-lg border bg-surface-raised py-2 pr-2 pl-4 text-role-label text-fg shadow-lg",
          content: "flex-1 min-w-0",
          title: "text-role-label",
          description: "text-role-caption text-fg-muted",
          icon: "shrink-0",
          closeButton:
            "static order-last grid size-hit shrink-0 place-items-center rounded-sm bg-transparent border-0 text-fg-muted transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted hover:text-fg",
          actionButton: "inline-flex h-control-sm items-center rounded-md bg-primary px-3 text-role-label text-on-primary",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
