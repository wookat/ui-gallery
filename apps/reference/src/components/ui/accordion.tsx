import * as React from "react"
import { cn } from "@/lib/cn"
import { ChevronDownIcon } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

/** 手风琴：hifi .accordion —— 外框 hairline + radius.md，项之间 hairline 分隔 */
function Accordion({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" className={cn("w-full overflow-hidden rounded-md border", className)} {...props} />
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("border-t first:border-t-0", className)} {...props} />
}

/** 触发行：hifi .acc-trigger —— min-h size.hit + space.2、label 字阶、右侧 chevron 展开旋转 180° */
function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex min-h-[calc(var(--size-hit)+var(--space-2))] w-full items-center gap-3 px-4 py-2 text-left text-role-label transition-colors duration-(--motion-fast) ease-std hover:not-disabled:bg-surface-muted disabled:disabled-look [&_svg]:ml-auto [&_svg]:size-icon-md [&_svg]:shrink-0 [&_svg]:text-fg-muted [&_svg]:transition-transform [&_svg]:duration-(--motion-fast) [&[data-state=open]_svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon aria-hidden />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content data-slot="accordion-content" className="overflow-hidden text-role-body text-fg-muted" {...props}>
      <div className={cn("px-4 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
