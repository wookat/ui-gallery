import { Switch as KobalteSwitch } from "@kobalte/core/switch"

export function Switch(props: { label: string; checked?: boolean; onChange?: (checked: boolean) => void }) {
  return <KobalteSwitch checked={props.checked} onChange={props.onChange} class="flex items-center justify-between gap-3"><KobalteSwitch.Label class="text-sm font-medium">{props.label}</KobalteSwitch.Label><KobalteSwitch.Input /><KobalteSwitch.Control class="h-6 w-11 rounded-full bg-zinc-300 p-1 transition-colors data-[checked]:bg-blue-600 dark:bg-zinc-700"><KobalteSwitch.Thumb class="block size-4 rounded-full bg-white transition-transform data-[checked]:translate-x-5" /></KobalteSwitch.Control></KobalteSwitch>
}
