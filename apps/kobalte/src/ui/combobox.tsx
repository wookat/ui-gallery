import { Combobox as KobalteCombobox } from "@kobalte/core/combobox"
import { type SelectOption } from "./select"

export function Combobox(props: { label?: string; options: SelectOption[] | string[]; placeholder?: string; value?: string; onChange?: (value: string | null) => void }) {
  const options = (values: SelectOption[] | string[]) => values.map((option) => typeof option === "string" ? { value: option, label: option } : option)
  return (
    <KobalteCombobox options={options(props.options)} optionValue="value" optionLabel="label" optionTextValue="label" value={props.value ? options(props.options).find((item) => item.value === props.value) : null} onChange={props.onChange as never} itemComponent={(item) => <KobalteCombobox.Item item={item.item} class="rounded px-2 py-1.5 text-sm data-[highlighted]:bg-zinc-100 dark:data-[highlighted]:bg-zinc-800">{item.item.rawValue.label}</KobalteCombobox.Item>}>
      {props.label ? <label class="mb-1.5 block text-sm font-medium">{props.label}</label> : null}
      <KobalteCombobox.Control class="flex h-9 items-center rounded-md border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-900">
        <KobalteCombobox.Input class="min-w-0 flex-1 bg-transparent text-sm outline-none dark:text-zinc-100" placeholder={props.placeholder ?? "搜索并选择"} aria-label={props.label} />
        <KobalteCombobox.Trigger aria-label="打开选项">⌄</KobalteCombobox.Trigger>
      </KobalteCombobox.Control>
      <KobalteCombobox.Portal><KobalteCombobox.Content class="z-50 mt-1 max-h-72 overflow-auto rounded-md border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"><KobalteCombobox.Listbox /></KobalteCombobox.Content></KobalteCombobox.Portal>
    </KobalteCombobox>
  )
}
