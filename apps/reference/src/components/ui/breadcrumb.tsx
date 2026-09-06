import * as React from "react"
import { cn } from "cn"
import { ChevronRightIcon } from "lucide-react"
import { Slot } from "radix-ui"

/** 面包屑：hifi .crumbs —— label 字体，根节点 fg-muted、分隔符 fg-disabled、当前页 fg */
function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="breadcrumb" className={cn("min-w-0", className)} {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="breadcrumb-list" className={cn("m-0 flex list-none items-center gap-2 p-0 text-role-label", className)} {...props} />
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center", className)} {...props} />
}

function BreadcrumbLink({ className, asChild, ...props }: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("inline-flex min-h-hit items-center rounded-sm text-fg-muted transition-colors duration-(--motion-fast) ease-std hover:text-fg hover:no-underline", className)}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span aria-current="page" data-slot="breadcrumb-page" className={cn("truncate text-fg", className)} {...props} />
}

function BreadcrumbSeparator({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li role="presentation" aria-hidden data-slot="breadcrumb-separator" className={cn("inline-flex text-fg-disabled [&_svg]:size-icon-sm", className)} {...props}>
      <ChevronRightIcon />
    </li>
  )
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator }
