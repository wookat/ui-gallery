import * as React from "react"
import { cn } from "@/lib/cn"

/** 骨架：hifi .sk —— skeleton 色 + 微光；尺寸由调用方用间距工具类给定（sk-text=h-3、sk-label=h-4、sk-value=h-8、sk-pill=h-6 rounded-full） */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div aria-hidden data-slot="skeleton" className={cn("skeleton-shine rounded-sm", className)} {...props} />
}

export { Skeleton }
