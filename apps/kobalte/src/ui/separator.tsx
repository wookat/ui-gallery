import { Separator as KobalteSeparator } from "@kobalte/core/separator"

export function Separator(props: { class?: string }) {
  return <KobalteSeparator orientation="horizontal" class={`h-px w-full bg-zinc-200 dark:bg-zinc-800 ${props.class ?? ""}`} />
}
