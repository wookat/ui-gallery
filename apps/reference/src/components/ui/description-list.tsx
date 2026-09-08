import * as React from "react"
import { cn } from "@/lib/cn"

/** 描述列表：hifi .dl —— 两列网格（dt 自适应 / dd 撑满），cols=2 时四列（≤768 回落两列） */
function DescriptionList({ className, cols = 1, ...props }: React.ComponentProps<"dl"> & { cols?: 1 | 2 }) {
  return (
    <dl
      data-slot="description-list"
      className={cn(
        "grid w-full gap-x-6 gap-y-2",
        cols === 2 ? "grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)] mobile:grid-cols-[auto_minmax(0,1fr)]" : "grid-cols-[auto_minmax(0,1fr)]",
        className,
      )}
      {...props}
    />
  )
}

function DescriptionTerm({ className, ...props }: React.ComponentProps<"dt">) {
  return <dt data-slot="description-term" className={cn("pt-1 text-role-caption whitespace-nowrap text-fg-muted", className)} {...props} />
}

function DescriptionDetails({ className, ...props }: React.ComponentProps<"dd">) {
  return <dd data-slot="description-details" className={cn("min-h-6 text-role-body wrap-anywhere", className)} {...props} />
}

export { DescriptionList, DescriptionTerm, DescriptionDetails }
