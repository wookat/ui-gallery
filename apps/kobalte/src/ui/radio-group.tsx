/* eslint-disable solid/prefer-for */
import { RadioGroup as KobalteRadioGroup } from "@kobalte/core/radio-group"

export function RadioGroup(props: { label: string; options: { value: string; label: string }[]; value?: string; onChange?: (value: string) => void }) {
  return <KobalteRadioGroup value={props.value} onChange={props.onChange}><KobalteRadioGroup.Label class="mb-2 block text-sm font-medium">{props.label}</KobalteRadioGroup.Label><div class="grid gap-2 sm:grid-cols-3">{props.options.map((option) => <KobalteRadioGroup.Item value={option.value} class="flex items-center gap-2 rounded-md border border-zinc-200 p-3 text-sm data-[checked]:border-blue-600 dark:border-zinc-700"><KobalteRadioGroup.ItemInput /><KobalteRadioGroup.ItemControl class="grid size-4 place-items-center rounded-full border border-zinc-400 data-[checked]:border-blue-600"><KobalteRadioGroup.ItemIndicator class="size-2 rounded-full bg-blue-600" /></KobalteRadioGroup.ItemControl><KobalteRadioGroup.ItemLabel>{option.label}</KobalteRadioGroup.ItemLabel></KobalteRadioGroup.Item>)}</div></KobalteRadioGroup>
}
