import * as React from "react"
import { cn } from "@/lib/cn"
import { XIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { IconButton } from "@/components/ui/icon-button"

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/** 遮罩：overlay 令牌；≤768 时对话框贴底（hifi .live-overlay 移动端规则） */
function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <DialogPrimitive.Overlay data-slot="dialog-overlay" className={cn("fixed inset-0 z-40 bg-overlay", className)} {...props} />
}

/**
 * 居中模态：hifi .dialog —— max-w size.dialog、surface-raised、radius.xl、shadow.lg、space.6 内距、垂直 space.4 间距；
 * ≤768 变为底部弹层（顶部圆角、底部内距 space.8）。closeLabel 提供右上角关闭按钮的可访问名；不传则不渲染关闭按钮（AlertDialog 语义）。
 */
function DialogContent({
  className,
  children,
  closeLabel,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { closeLabel?: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-40 flex w-[calc(100vw-var(--space-4)*2)] max-w-dialog -translate-1/2 flex-col gap-4 rounded-xl border bg-surface-raised p-6 text-fg shadow-lg outline-none mobile:top-auto mobile:bottom-0 mobile:left-0 mobile:w-full mobile:max-w-none mobile:translate-0 mobile:rounded-b-none mobile:pb-8",
          className,
        )}
        {...props}
      >
        {children}
        {closeLabel ? (
          <DialogPrimitive.Close asChild>
            <IconButton label={closeLabel} className="absolute top-2 right-2">
              <XIcon />
            </IconButton>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-2 pr-hit", className)} {...props} />
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-role-heading wrap-anywhere", className)} {...props} />
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn("text-role-body text-fg-muted", className)} {...props} />
}

/** 动作区：hifi .dialog-actions —— 右对齐、space.3 间距、可换行 */
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-footer" className={cn("mt-2 flex flex-wrap justify-end gap-3", className)} {...props} />
}

export { Dialog, DialogTrigger, DialogClose, DialogOverlay, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
