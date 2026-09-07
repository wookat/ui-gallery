import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react"
import { Toaster as Sonner, toast, type ToasterProps } from "sonner"

import { Spinner } from "@/components/ui/spinner"
import { useTheme } from "@/components/theme-provider"

/**
 * Toast：hifi .toast —— surface-raised、hairline、radius.md、shadow.lg、label 字体；成功图标 success 色。
 * 采用 sonner unstyled，所有外观由 classNames 中的令牌工具类给出。
 * 宽度：hifi width max-content（w-max，靠右）；<600px 时 sonner 自行铺满 mobileOffset 以内。
 * 关闭按钮：sonner 在 data-sonner-theme=dark 下仍用无 layer 的选择器写 background/border/color（不受 unstyled 控制），当前不同主题，相应工具类需 `!` 压过。
 */
function Toaster(props: ToasterProps) {
  const { resolved } = useTheme()
  return (
    <Sonner
      theme={resolved}
      position="top-right"
      offset="var(--space-6)"
      mobileOffset="var(--space-4)"
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
            "flex w-max max-w-full items-center gap-3 rounded-md border bg-surface-raised py-3 pr-2 pl-4 text-role-label text-fg shadow-lg",
          content: "flex-1 min-w-0",
          title: "text-role-label",
          description: "text-role-caption text-fg-muted",
          icon: "shrink-0",
          closeButton:
            "static order-last -my-2 grid size-hit shrink-0 place-items-center rounded-sm bg-transparent! border-0! text-fg-muted! transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted! hover:text-fg!",
          actionButton: "inline-flex h-control-sm items-center rounded-md bg-primary px-3 text-role-label text-on-primary",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
