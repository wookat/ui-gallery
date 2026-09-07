import { CheckIcon, CircleAlertIcon, InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react"
import { Toaster as Sonner, toast, type ToasterProps } from "sonner"

import { Spinner } from "@/components/ui/spinner"
import { useTheme } from "@/components/theme-provider"

/**
 * Toast：hifi .toast —— surface-raised、hairline、radius.lg、shadow.lg、label 字体；成功 toast 的图标与关闭「×」均为 success 色（hifi .toast .icon），其余类型「×」为 fg-muted；
 * 宽度随内容（图标 + 文字 + 关闭），关闭紧随文案，右对齐于顶栏下，最宽不超出容器；≤600 sonner 自身把 toast 拉到通栏。
 * 采用 sonner unstyled，所有外观由 classNames 中的令牌工具类给出；关闭按钮 bg / color 加 `!` 压过 sonner 暗色主题对 [data-close-button] 的默认色。
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
        success: <CheckIcon className="size-icon-md text-success" />,
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
            "flex w-fit max-w-full items-center gap-3 rounded-lg border bg-surface-raised py-2 pr-2 pl-4 text-role-label text-fg shadow-lg",
          content: "min-w-0",
          title: "text-role-label",
          description: "text-role-caption text-fg-muted",
          icon: "shrink-0",
          closeButton:
            "static order-last grid size-hit shrink-0 place-items-center rounded-sm border-0 bg-transparent! text-fg-muted! [[data-type=success]_&]:text-success! transition-colors duration-(--motion-fast) ease-std hover:bg-surface-muted!",
          actionButton: "inline-flex h-control-sm items-center rounded-md bg-primary px-3 text-role-label text-on-primary",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
