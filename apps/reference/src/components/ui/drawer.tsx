import * as React from "react"
import { cn } from "@/lib/cn"
import { XIcon } from "lucide-react"
import { Dialog as DrawerPrimitive } from "radix-ui"

import { IconButton } from "@/components/ui/icon-button"

/**
 * 详情抽屉：hifi .drawer —— 右侧、宽 size.drawer（≤768 全宽）、surface、shadow.lg、左侧 hairline；
 * 头 = size.topbar 高 + title 字阶；体 = space.4 内距可滚动；脚 = 右对齐动作 + 顶部 hairline。
 * 与 Sheet（导航抽屉，宽 size.sidebar.drawer）区分：Drawer 承载订单详情 / 成员详情等业务内容。
 */
function Drawer(props: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger(props: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerClose(props: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerContent({
  className,
  children,
  title,
  description,
  closeLabel,
  headerExtra,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  title: React.ReactNode
  description?: string
  closeLabel: string
  /** 标题右侧附加内容（状态 Tag 等） */
  headerExtra?: React.ReactNode
}) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay data-slot="drawer-overlay" className="fixed inset-0 z-30 bg-overlay" />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn("fixed inset-y-0 right-0 z-30 flex w-drawer max-w-full flex-col border-l bg-surface text-fg shadow-lg outline-none mobile:w-full", className)}
        {...props}
      >
        <header data-slot="drawer-header" className="flex h-topbar shrink-0 items-center gap-3 border-b pr-2 pl-4">
          <DrawerPrimitive.Title className="min-w-0 flex-1 truncate text-role-title">{title}</DrawerPrimitive.Title>
          {headerExtra}
          <DrawerPrimitive.Close asChild>
            <IconButton label={closeLabel}>
              <XIcon />
            </IconButton>
          </DrawerPrimitive.Close>
        </header>
        {description ? <DrawerPrimitive.Description className="sr-only">{description}</DrawerPrimitive.Description> : null}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  )
}

function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-body" className={cn("flex flex-1 flex-col gap-4 overflow-y-auto p-4", className)} {...props} />
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-footer" className={cn("flex shrink-0 flex-wrap justify-end gap-3 border-t px-4 py-3", className)} {...props} />
}

export { Drawer, DrawerTrigger, DrawerClose, DrawerContent, DrawerBody, DrawerFooter }
