/**
 * 数据层：唯一来源是仓库根 mock/*.json（`@mock/*` 别名，见 vite.config.ts / tsconfig paths）。
 * 页面通过 useScreenData() 拿到按 ?state= 切换后的结果；成功态才有 data。
 * 类型直接由 JSON 推导（resolveJsonModule），新增字段无需手写接口。
 */
import activity from "@mock/activity.json"
import meta from "@mock/meta.json"
import nav from "@mock/nav.json"
import notifications from "@mock/notifications.json"
import orders from "@mock/orders.json"
import series from "@mock/series.json"
import stats from "@mock/stats.json"
import tasks from "@mock/tasks.json"
import team from "@mock/team.json"
import user from "@mock/user.json"

export const mock = { activity, meta, nav, notifications, orders, series, stats, tasks, team, user }
export type Mock = typeof mock

export type Period = keyof typeof meta.periods
export type Order = (typeof orders)[number]
export type NavGroup = (typeof nav)[number]
export type NavItem = NavGroup["items"][number]
export type TeamMember = (typeof team)[number]
export type Task = (typeof tasks)[number]
export type Activity = (typeof activity)[number]
export type Notification = (typeof notifications.items)[number]
export type StatCardDef = (typeof stats.cards)[number]
export type SeriesPoint = (typeof series.day.points)[number]

export const periods = Object.keys(meta.periods) as Period[]
export const isPeriod = (v: string | null): v is Period => !!v && periods.includes(v as Period)

/** 某周期下一张统计卡的数值（value / previous / delta / trend） */
export function statFor(period: Period, key: StatCardDef["key"]) {
  const byPeriod = stats.byPeriod[period]
  const metric = byPeriod[key as keyof typeof byPeriod]
  if (typeof metric !== "object" || metric === null || !("value" in metric)) {
    throw new Error(`mock/stats.json 缺少 ${period}.${key}`)
  }
  return metric as { value: number; previous: number; delta: number; trend: number[] }
}

export const seriesFor = (period: Period) => series[period]
export const channelLabel = (key: string) => meta.channels.find((c) => c.key === key)?.label ?? key

/** 侧栏角标：nav.json 中仅部分项带 badge */
export const navBadge = (item: NavItem) => ("badge" in item && typeof item.badge === "number" ? item.badge : 0)
/** 角标语义色：nav.json badgeTone（缺省中性） */
export const navBadgeTone = (item: NavItem): "warning" | "neutral" => ("badgeTone" in item && item.badgeTone === "warning" ? "warning" : "neutral")
/** 角标可访问名（hifi aria-label="badgeMeaning badge"）：如「库存预警 SKU 12」 */
export const navBadgeLabel = (item: NavItem) => ("badgeMeaning" in item && typeof item.badgeMeaning === "string" ? `${item.badgeMeaning} ${navBadge(item)}` : undefined)
