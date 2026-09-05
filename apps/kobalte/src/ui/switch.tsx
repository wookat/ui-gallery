import { Switch as KobalteSwitch } from "@kobalte/core/switch"

export function Switch(props: { label: string; description?: string; checked?: boolean; disabled?: boolean; onChange?: (checked: boolean) => void }) {
  return <KobalteSwitch checked={props.checked} disabled={props.disabled} onChange={props.onChange} class="flex items-center justify-between gap-3"><span class="grid gap-0.5"><KobalteSwitch.Label class="text-sm font-medium">{props.label}</KobalteSwitch.Label>{props.description ? <KobalteSwitch.Description class="text-xs text-zinc-500 dark:text-zinc-400">{props.description}</KobalteSwitch.Description> : null}</span><KobalteSwitch.Input /><KobalteSwitch.Control class="h-6 w-11 rounded-full bg-zinc-300 p-1 transition-colors data-[checked]:bg-blue-600 dark:bg-zinc-700"><KobalteSwitch.Thumb class="block size-4 rounded-full bg-white transition-transform data-[checked]:translate-x-5" /></KobalteSwitch.Control></KobalteSwitch>
}
