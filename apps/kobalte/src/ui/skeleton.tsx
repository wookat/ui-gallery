import { Skeleton as KobalteSkeleton } from "@kobalte/core/skeleton"

export function Skeleton(props: { class?: string }) {
  return <div class={`overflow-hidden rounded-md ${props.class ?? ""}`}><KobalteSkeleton style={{ height: "100%" }} class="block h-full w-full animate-pulse rounded-[inherit] bg-zinc-200 dark:bg-zinc-800" /></div>
}
