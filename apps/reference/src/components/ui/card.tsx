import * as React from "react"
import { cn } from "@/lib/cn"

/** 卡片：hifi .card —— surface / 1px border / radius.lg / shadow.sm / space.6 内距 */
function Card({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="card"
      className={cn("min-w-0 rounded-lg border bg-surface p-6 text-fg shadow-sm mobile:p-4", className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="card-header"
      className={cn("mb-4 flex min-h-hit items-center justify-between gap-4", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="card-title" className={cn("text-role-title", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("mt-1 text-role-caption text-fg-muted", className)} {...props} />
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("-mr-3 shrink-0", className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("min-w-0", className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent }
