import { Skeleton as KobalteSkeleton } from "@kobalte/core/skeleton"

export function Skeleton(props: { class?: string }) {
  return <KobalteSkeleton class={`animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800 ${props.class ?? ""}`} />
}
