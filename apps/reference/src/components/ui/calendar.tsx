import * as React from "react"
import { cn } from "@/lib/cn"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { IconButton } from "@/components/ui/icon-button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

/** ISO 日期（YYYY-MM-DD）↔ 本地日历；mock 时间点为东八区，日历只做日粒度，不涉及时区换算 */
const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
const parse = (s: string) => {
  const [y, m, d] = s.split("-").map(Number)
  return { y, m: m - 1, d }
}
const monthFmt = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long" })
const weekdayFmt = new Intl.DateTimeFormat("zh-CN", { weekday: "narrow" })
const WEEKDAYS = Array.from({ length: 7 }, (_, i) => weekdayFmt.format(new Date(Date.UTC(2024, 0, 7 + i))))

type CalendarProps = {
  /** 选中日期（单选）或区间 [start, end]（end 可为 null 表示只选了起点） */
  value: string | null | readonly [string, string | null]
  onChange: (next: string) => void
  /** 初始显示月份，默认取 value / today */
  month?: string
  today: string
  min?: string
  max?: string
  labels: { prevMonth: string; nextMonth: string }
  className?: string
}

/**
 * 月历：hifi .calendar —— 7 列 size.hit 方格网格、表头 caption fg-muted、今天描边 primary、选中 primary 实底、
 * 区间内 primary-soft；越界 / 非本月日期 fg-muted 且不可选。键盘：Grid 内方向键移动（native tab 到按钮即可）。
 */
function Calendar({ value, onChange, month, today, min, max, labels, className }: CalendarProps) {
  const range = Array.isArray(value) ? (value as readonly [string, string | null]) : null
  const single = typeof value === "string" ? value : null
  const start = parse(month ?? range?.[0] ?? single ?? today)
  const [view, setView] = React.useState({ y: start.y, m: start.m })
  const first = new Date(view.y, view.m, 1)
  const offset = (first.getDay() + 6) % 7
  const days = new Date(view.y, view.m + 1, 0).getDate()
  const cells: (string | null)[] = [...Array<null>(offset).fill(null), ...Array.from({ length: days }, (_, i) => iso(view.y, view.m, i + 1))]
  while (cells.length % 7) cells.push(null)
  const inRange = (d: string) => range?.[1] && d > range[0] && d < range[1]
  const isSelected = (d: string) => (range ? d === range[0] || d === range[1] : d === single)
  const disabled = (d: string) => (min !== undefined && d < min) || (max !== undefined && d > max)
  const shift = (delta: number) => setView(({ y, m }) => ({ y: y + Math.floor((m + delta) / 12), m: (((m + delta) % 12) + 12) % 12 }))

  return (
    <div data-slot="calendar" className={cn("flex w-[calc(var(--size-hit)*7)] max-w-full flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <IconButton label={labels.prevMonth} onClick={() => shift(-1)}>
          <ChevronLeftIcon />
        </IconButton>
        <span aria-live="polite" className="text-role-label">
          {monthFmt.format(first)}
        </span>
        <IconButton label={labels.nextMonth} onClick={() => shift(1)}>
          <ChevronRightIcon />
        </IconButton>
      </div>
      <div role="grid" className="grid grid-cols-7">
        <div role="row" className="contents">
          {WEEKDAYS.map((w) => (
            <span key={w} role="columnheader" className="grid h-8 place-items-center text-role-caption text-fg-muted">
              {w}
            </span>
          ))}
        </div>
        {Array.from({ length: cells.length / 7 }, (_, r) => (
          <div key={r} role="row" className="contents">
            {cells.slice(r * 7, r * 7 + 7).map((d, i) =>
              d ? (
                <button
                  key={d}
                  type="button"
                  role="gridcell"
                  aria-selected={isSelected(d) || undefined}
                  aria-current={d === today ? "date" : undefined}
                  disabled={disabled(d)}
                  onClick={() => onChange(d)}
                  data-in-range={inRange(d) || undefined}
                  className="grid size-hit place-items-center rounded-md text-role-body tabular-nums transition-colors duration-(--motion-fast) ease-std hover:not-disabled:bg-surface-muted aria-[current=date]:shadow-[inset_0_0_0_var(--border-width-hairline)_var(--color-role-primary)] data-in-range:rounded-none data-in-range:bg-primary-soft data-in-range:text-on-primary-soft aria-selected:bg-primary aria-selected:text-on-primary disabled:text-fg-disabled disabled:cursor-not-allowed"
                >
                  {parse(d).d}
                </button>
              ) : (
                <span key={`e${i}`} role="gridcell" aria-hidden className="size-hit" />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

type DatePickerProps = Omit<CalendarProps, "value" | "onChange" | "className"> & {
  id?: string
  value: string | null
  onChange: (next: string | null) => void
  placeholder: string
  /** 显示格式化（默认原样 ISO） */
  format?: (isoDate: string) => string
  disabled?: boolean
  invalid?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
} & Pick<React.ComponentProps<"button">, "aria-label" | "aria-labelledby" | "aria-describedby">

/** 日期选择：触发器与 Input 同高同边框、右侧 CalendarIcon；面板为 Popover + Calendar */
function DatePicker({ id, value, onChange, placeholder, format = (d) => d, disabled, invalid, open, onOpenChange, className, today, min, max, month, labels, ...aria }: DatePickerProps) {
  const [openState, setOpenState] = React.useState(false)
  const isOpen = open ?? openState
  const setOpen = (o: boolean) => {
    setOpenState(o)
    onOpenChange?.(o)
  }
  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          data-slot="date-picker-trigger"
          data-placeholder={value ? undefined : ""}
          className={cn(
            "flex h-control-md w-full min-w-0 items-center justify-between gap-2 rounded-md border border-border-strong bg-surface pl-3 text-left text-role-body text-fg tabular-nums transition-colors duration-(--motion-fast) ease-std data-[placeholder]:text-fg-muted hover:not-disabled:border-fg-muted focus-visible:border-primary aria-expanded:border-primary aria-invalid:border-(length:--border-width-accent) aria-invalid:border-danger disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-muted",
            className,
          )}
          {...aria}
        >
          <span className="truncate">{value ? format(value) : placeholder}</span>
          <span aria-hidden className="grid size-hit shrink-0 place-items-center text-fg-muted [&_svg]:size-icon-md">
            <CalendarIcon />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" aria-label={aria["aria-label"] ?? placeholder} className="w-auto mobile:w-auto p-2">
        <Calendar
          value={value}
          today={today}
          min={min}
          max={max}
          month={month}
          labels={labels}
          onChange={(d) => {
            onChange(d)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { Calendar, DatePicker, type CalendarProps, type DatePickerProps }
