import activity from "@ui-gallery/spec/mock/activity.json"
import chat from "@ui-gallery/spec/mock/chat.json"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import landing from "@ui-gallery/spec/mock/landing.json"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import series from "@ui-gallery/spec/mock/series.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import tasks from "@ui-gallery/spec/mock/tasks.json"
import team from "@ui-gallery/spec/mock/team.json"

export { activity, chat, invoices, landing, nav, notifications, orders, plans, series, sessions, stats, tasks, team }

export type Order = (typeof orders)[number]
export type Plan = (typeof plans)[number]
export type Member = (typeof team)[number]
export type ChatMessage = (typeof chat.messages)[number]

export const STATUS_LABEL: Record<string, string> = { paid: "已支付", pending: "待支付", refunded: "已退款", failed: "失败", due: "待付款", shipped: "已发货", cancelled: "已取消" }
export const STATUS_COLOR: Record<string, string> = { paid: "success", pending: "warning", refunded: "secondary", failed: "danger", due: "warning", shipped: "info", cancelled: "dark" }
export const ROLE_LABEL: Record<string, string> = { owner: "所有者", admin: "管理员", member: "成员", viewer: "只读" }
