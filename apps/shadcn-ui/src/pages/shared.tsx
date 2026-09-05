import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">ACME CONSOLE</p>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function SectionCard({ title, description, children, className }: { title: string; description?: string; children: ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function StatusBadge({ value }: { value: string }) {
  const variant = ["paid", "shipped", "active"].includes(value) ? "default" : ["pending", "due"].includes(value) ? "secondary" : "destructive"
  return <Badge variant={variant}>{value}</Badge>
}

export function SectionDivider({ label }: { label: string }) {
  return <div className="flex items-center gap-3 text-xs text-muted-foreground"><Separator className="flex-1" /><span>{label}</span><Separator className="flex-1" /></div>
}
