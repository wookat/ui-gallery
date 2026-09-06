import { Separator as KobalteSeparator } from "@kobalte/core/separator"

export function Separator(props: { class?: string; orientation?: "horizontal" | "vertical" }) {
  const orientation = () => props.orientation ?? "horizontal"
  return <KobalteSeparator orientation={orientation()} class={`${orientation() === "vertical" ? "w-px h-full" : "h-px w-full"} border-0 bg-zinc-200 dark:bg-zinc-800 ${props.class ?? ""}`} />
}
