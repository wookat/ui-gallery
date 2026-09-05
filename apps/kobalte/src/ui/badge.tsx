import { Badge as KobalteBadge } from "@kobalte/core/badge"
import type { ParentProps } from "solid-js"

export function Badge(props: ParentProps<{ variant?: "default" | "secondary" | "destructive" | "outline"; class?: string }>) {
  const styles = { default: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", secondary: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", destructive: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300", outline: "border border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300" }
  return <KobalteBadge class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[props.variant ?? "default"]} ${props.class ?? ""}`}>{props.children}</KobalteBadge>
}
