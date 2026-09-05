/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select as KobalteSelect } from "@kobalte/core/select"
import type { CollectionNode } from "@kobalte/core"
const SelectRoot = KobalteSelect as any
export type SelectOption = { value: string; label: string }
type SelectProps = {
  label?: string
  options: SelectOption[]
  value?: string | string[]
  placeholder?: string
  multiple?: boolean
  onChange?: (value: string | string[] | null) => void
  class?: string
}

export function Select(props: SelectProps) {
  const selectedLabel = () => {
    if (Array.isArray(props.value)) return props.value.map((value) => props.options.find((option) => option.value === value)?.label ?? value).join("、")
    return props.options.find((option) => option.value === props.value)?.label
  }
  return (
    <SelectRoot
      options={props.options}
      optionValue="value"
      optionTextValue="label"
      value={props.value}
      multiple={props.multiple}
      onChange={props.onChange}
      itemComponent={(item: { item: CollectionNode<SelectOption> }) => <KobalteSelect.Item item={item.item} class="cursor-pointer rounded px-2 py-1.5 text-sm data-[highlighted]:bg-zinc-100 dark:data-[highlighted]:bg-zinc-800"><KobalteSelect.ItemLabel>{item.item.rawValue.label}</KobalteSelect.ItemLabel><KobalteSelect.ItemIndicator class="ml-auto">✓</KobalteSelect.ItemIndicator></KobalteSelect.Item>}
    >
      {props.label ? <KobalteSelect.Label class="mb-1.5 block text-sm font-medium">{props.label}</KobalteSelect.Label> : null}
      <KobalteSelect.Trigger class={`flex h-9 w-full items-center justify-between gap-2 rounded-md border border-zinc-300 bg-white px-3 text-left text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 ${props.class ?? ""}`}>
        <KobalteSelect.Value>{selectedLabel() || props.placeholder || "请选择"}</KobalteSelect.Value>
        <KobalteSelect.Icon>⌄</KobalteSelect.Icon>
      </KobalteSelect.Trigger>
      <KobalteSelect.Portal>
        <KobalteSelect.Content class="z-50 mt-1 max-h-72 min-w-[12rem] overflow-auto rounded-md border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <KobalteSelect.Listbox />
        </KobalteSelect.Content>
      </KobalteSelect.Portal>
    </SelectRoot>
  )
}
