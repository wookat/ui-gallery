import { Alert as KobalteAlert } from "@kobalte/core/alert"
import type { ParentProps } from "solid-js"

export function Alert(props: ParentProps<{ level?: "info" | "success" | "warning" | "error"; class?: string }>) {
  const styles = { info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100", success: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100", warning: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100", error: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100" }
  return <KobalteAlert class={`rounded-md border p-4 text-sm ${styles[props.level ?? "info"]} ${props.class ?? ""}`}>{props.children}</KobalteAlert>
}
