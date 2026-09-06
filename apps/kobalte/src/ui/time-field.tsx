import { TimeField as KobalteTimeField } from "@kobalte/core/time-field"

export function TimeField(props: { label?: string; defaultValue?: { hour?: number; minute?: number }; disabled?: boolean }) {
  return (
    <KobalteTimeField defaultValue={props.defaultValue ?? { hour: 9, minute: 30 }} hourCycle={24} granularity="minute" forceLeadingZeros disabled={props.disabled} class="grid gap-1.5">
      <KobalteTimeField.Label class="text-sm font-medium">{props.label ?? "时间"}</KobalteTimeField.Label>
      <KobalteTimeField.Input class="flex h-10 items-center rounded-md border border-zinc-300 bg-white px-3 text-sm shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900">
        {(segment) => <KobalteTimeField.Segment segment={segment()} class="min-w-5 rounded px-0.5 outline-none focus:bg-blue-100 focus:text-blue-900 dark:focus:bg-blue-950 dark:focus:text-blue-100" />}
      </KobalteTimeField.Input>
      <KobalteTimeField.HiddenInput />
    </KobalteTimeField>
  )
}
