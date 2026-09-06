import { mock } from "@/data/mock"

const zone = mock.meta.timezone
const currency = mock.meta.currency

const money = new Intl.NumberFormat("zh-CN", { style: "currency", currency, minimumFractionDigits: 2 })
const integer = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 })
const compact = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 })

/** ¥1,234.00 */
export const formatCurrency = (n: number) => money.format(n)
/** 1,234 */
export const formatInteger = (n: number) => integer.format(n)
/** 6.8（百分比数值本体，正负号由调用方决定） */
export const formatPercent = (n: number) => compact.format(Math.abs(n))

/** 09-06 16:42（Asia/Shanghai，与 mock 时间点同时区） */
export function formatDateTime(iso: string) {
  const d = new Date(iso)
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: zone,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d)
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? ""
  return `${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`
}

/** 09-12 */
export function formatMonthDay(iso: string) {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00+08:00` : iso)
  const parts = new Intl.DateTimeFormat("zh-CN", { timeZone: zone, month: "2-digit", day: "2-digit" }).formatToParts(d)
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? ""
  return `${get("month")}-${get("day")}`
}

/** 17:30 */
export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("zh-CN", { timeZone: zone, hour: "2-digit", minute: "2-digit", hour12: false }).format(
    new Date(iso),
  )
}

/** 按 meta.asOf 小时段问候（content/dashboard.md dashboard.greeting 规则） */
export function greetingKey(iso: string) {
  const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "numeric", hour12: false }).format(new Date(iso)))
  if (hour >= 5 && hour < 11) return "morning"
  if (hour >= 11 && hour < 13) return "noon"
  if (hour >= 13 && hour < 18) return "afternoon"
  return "evening"
}
