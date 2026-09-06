import { Progress as KobalteProgress } from "@kobalte/core/progress"

export function Progress(props: { value: number; label?: string }) {
  return <KobalteProgress value={props.value} class="grid gap-1.5"><div class="flex justify-between text-xs"><KobalteProgress.Label>{props.label}</KobalteProgress.Label><KobalteProgress.ValueLabel /></div><KobalteProgress.Track class="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"><KobalteProgress.Fill class="h-full rounded-full bg-blue-600 transition-all" /></KobalteProgress.Track></KobalteProgress>
}
