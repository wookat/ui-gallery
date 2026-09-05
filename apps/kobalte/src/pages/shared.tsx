import type { JSX, ParentProps } from "solid-js"
import { Badge } from "@/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"
import { Separator } from "@/ui/separator"

export function PageHeader(props: ParentProps<{ title: string; description?: string; action?: JSX.Element }>) {
  return <div class="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div class="min-w-0 space-y-1"><p class="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">ACME CONSOLE</p><h1 class="text-3xl font-semibold tracking-tight">{props.title}</h1>{props.description ? <p class="text-sm text-zinc-500 dark:text-zinc-400">{props.description}</p> : null}</div>{props.action}</div>
}

export function SectionCard(props: ParentProps<{ title: string; description?: string; class?: string }>) {
  return <Card class={props.class}><CardHeader><CardTitle>{props.title}</CardTitle>{props.description ? <CardDescription>{props.description}</CardDescription> : null}</CardHeader><CardContent>{props.children}</CardContent></Card>
}

export function StatusBadge(props: { value: string }) {
  const variant = ["paid", "shipped", "active"].includes(props.value) ? "default" : ["pending", "due"].includes(props.value) ? "secondary" : "destructive"
  return <Badge variant={variant}>{props.value}</Badge>
}

export function SectionDivider(props: { label: string }) {
  return <div class="flex items-center gap-3 text-xs text-zinc-500"><Separator class="flex-1" /><span>{props.label}</span><Separator class="flex-1" /></div>
}
