import * as React from "react"
import { cn } from "@/lib/cn"
import { XIcon } from "lucide-react"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"

import { buttonVariants } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"

/**
 * 确认对话框：与 Dialog 同一外观（hifi .dialog），点遮罩不关闭、Cancel 默认聚焦（Radix AlertDialog 语义）。
 * 缺省无关闭按钮；传 closeLabel 时在右上渲染一个 Cancel 语义的 ×（表单稿「离开页面？」），页面可用 onOpenAutoFocus 把初始焦点给它。
 */
function AlertDialog(props: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger(props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

function AlertDialogContent({ className, children, closeLabel, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content> & { closeLabel?: string }) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay data-slot="alert-dialog-overlay" className="fixed inset-0 z-40 bg-overlay" />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-40 flex w-[calc(100vw-var(--space-4)*2)] max-w-dialog -translate-1/2 flex-col gap-4 rounded-xl border bg-surface-raised p-6 text-fg shadow-lg outline-none mobile:top-auto mobile:bottom-0 mobile:left-0 mobile:w-full mobile:max-w-none mobile:translate-0 mobile:rounded-b-none mobile:pb-8",
          className,
        )}
        {...props}
      >
        {closeLabel ? (
          <AlertDialogPrimitive.Cancel asChild>
            <IconButton data-slot="alert-dialog-close-icon" label={closeLabel} className="absolute top-2 right-2">
              <XIcon />
            </IconButton>
          </AlertDialogPrimitive.Cancel>
        ) : null}
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-header" className={cn("flex flex-col gap-2", className)} {...props} />
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return <AlertDialogPrimitive.Title data-slot="alert-dialog-title" className={cn("text-role-heading wrap-anywhere", className)} {...props} />
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return <AlertDialogPrimitive.Description data-slot="alert-dialog-description" className={cn("text-role-body text-fg-muted", className)} {...props} />
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-footer" className={cn("mt-2 flex flex-wrap justify-end gap-3", className)} {...props} />
}

/** 确认动作：默认 danger（删除 / 取消订单 / 移除成员），通过 variant 覆盖 */
function AlertDialogAction({
  className,
  variant = "danger",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> & { variant?: "primary" | "danger" }) {
  return <AlertDialogPrimitive.Action data-slot="alert-dialog-action" className={cn(buttonVariants({ variant }), className)} {...props} />
}

function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return <AlertDialogPrimitive.Cancel data-slot="alert-dialog-cancel" className={cn(buttonVariants({ variant: "secondary" }), className)} {...props} />
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
}
