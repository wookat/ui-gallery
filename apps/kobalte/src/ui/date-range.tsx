import { Popover } from "@kobalte/core/popover"
import { createSignal, For, Show } from "solid-js"
import { Icon } from "@/icons"

export type DateRange = { start: string | null; end: string | null }

type DateRangePickerProps = {
  label?: string
  value?: DateRange
  onChange?: (value: DateRange) => void
  month?: string
  class?: string
}

const weekdays = ["一", "二", "三", "四", "五", "六", "日"]

function pad(value: number) {
  return String(value).padStart(2, "0")
}

function iso(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

export function DateRangePicker(props: DateRangePickerProps) {
  // eslint-disable-next-line solid/reactivity
  const initialValue = props.value ?? { start: null, end: null }
  // eslint-disable-next-line solid/reactivity
  const initialMonth = (props.month ?? "2026-09").split("-").map(Number)
  const [inner, setInner] = createSignal<DateRange>(initialValue)
  const [open, setOpen] = createSignal(false)
  const [cursor, setCursor] = createSignal({ year: initialMonth[0], month: initialMonth[1] - 1 })
  const range = () => props.value ?? inner()
  const update = (value: DateRange) => {
    setInner(value)
    props.onChange?.(value)
  }
  const pick = (date: string) => {
    const current = range()
    if (!current.start || current.end) return update({ start: date, end: null })
    if (date < current.start) return update({ start: date, end: current.start })
    update({ start: current.start, end: date })
  }
  const shift = (delta: number) => {
    const next = new Date(cursor().year, cursor().month + delta, 1)
    setCursor({ year: next.getFullYear(), month: next.getMonth() })
  }
  const days = () => {
    const year = cursor().year
    const month = cursor().month
    const offset = (new Date(year, month, 1).getDay() + 6) % 7
    const count = new Date(year, month + 1, 0).getDate()
    const result: (string | null)[] = Array.from({ length: offset }, () => null)
    for (let day = 1; day <= count; day += 1) result.push(iso(year, month, day))
    return result
  }
  const inRange = (date: string) => {
    const current = range()
    return !!current.start && !!current.end && date > current.start && date < current.end
  }
  const isEdge = (date: string) => date === range().start || date === range().end
  const text = () => {
    const current = range()
    if (!current.start) return "选择日期范围"
    return `${current.start} → ${current.end ?? "…"}`
  }
  return (
    <div class={props.class}>
      <Show when={props.label}><span class="mb-1.5 block text-sm font-medium">{props.label}</span></Show>
      <Popover open={open()} onOpenChange={setOpen} gutter={4}>
        <Popover.Trigger class="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-zinc-300 bg-white px-3 text-left text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" aria-label={props.label ?? "日期范围"}>
          <span class={range().start ? "" : "text-zinc-500 dark:text-zinc-400"}>{text()}</span>
          <Icon name="calendar" size={16} />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content class="z-50 w-72 rounded-md border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
            <div class="mb-2 flex items-center justify-between">
              <button type="button" class="grid size-10 place-items-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="上个月" onClick={() => shift(-1)}>‹</button>
              <Popover.Title class="text-sm font-medium">{cursor().year} 年 {cursor().month + 1} 月</Popover.Title>
              <button type="button" class="grid size-10 place-items-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="下个月" onClick={() => shift(1)}>›</button>
            </div>
            <Popover.Description class="sr-only">先点开始日期，再点结束日期</Popover.Description>
            <div class="grid grid-cols-7 gap-y-1 text-center text-xs">
              <For each={weekdays}>{(day) => <span class="py-1 font-medium text-zinc-500 dark:text-zinc-400">{day}</span>}</For>
              <For each={days()}>{(date) => (
                <Show when={date} fallback={<span />}>
                  {(value) => (
                    <button
                      type="button"
                      aria-pressed={isEdge(value())}
                      class={`h-9 w-full rounded ${isEdge(value()) ? "bg-blue-600 text-white" : inRange(value()) ? "bg-blue-100 dark:bg-blue-900/50" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                      onClick={() => pick(value())}
                    >
                      {Number(value().slice(-2))}
                    </button>
                  )}
                </Show>
              )}</For>
            </div>
            <div class="mt-2 flex justify-end">
              <button type="button" class="h-10 rounded-md px-3 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800" onClick={() => update({ start: null, end: null })}>清除</button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover>
    </div>
  )
}
