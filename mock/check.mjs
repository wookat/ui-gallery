// 阶段 0 门禁：mock/*.json 交叉校验。用法：node mock/check.mjs（仓库根）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
const meta = read("meta.json");
const stats = read("stats.json");
const series = read("series.json");
const orders = read("orders.json");
const tasks = read("tasks.json");
const notifications = read("notifications.json");
const nav = read("nav.json");
const activity = read("activity.json");
const team = read("team.json");
const user = read("user.json");

const failures = [];
const check = (cond, msg) => { if (!cond) failures.push(msg); };
const sum = (arr, k) => arr.reduce((a, x) => a + x[k], 0);
const asOf = meta.asOf;
const year = asOf.slice(0, 4);
const mmdd = (iso) => iso.slice(5, 10);
const addDays = (ymd, n) => {
  const d = new Date(ymd + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

// ---- stats × series：合计、趋势末点、delta、previous
for (const p of ["day", "week", "month"]) {
  const sp = stats.byPeriod[p];
  const pts = series[p].points;
  check(sum(pts, "gmv") === sp.gmv.value, `${p}: Σ series.gmv ≠ stats.gmv.value`);
  check(sum(pts, "orders") === sp.orders.value, `${p}: Σ series.orders ≠ stats.orders.value`);
  check(series[p].channels.total === sp.gmv.value, `${p}: channels.total ≠ gmv.value`);
  check(sum(series[p].channels.items, "gmv") === series[p].channels.total, `${p}: Σ channels.gmv ≠ total`);
  for (const it of series[p].channels.items) {
    check(Math.round((it.gmv / series[p].channels.total) * 1000) / 10 === it.share, `${p}: channel ${it.key} share`);
    check(meta.channels.some((c) => c.key === it.key && c.label === it.label), `${p}: channel ${it.key} 未在 meta 登记`);
  }
  for (const card of stats.cards) {
    const x = sp[card.key];
    check(x.trend.length === 7 && sp.trendLabels.length === 7, `${p} ${card.key}: trend 须 7 点`);
    check(x.trend.at(-1) === x.value, `${p} ${card.key}: trend 末点 ≠ value`);
    check(x.trend.at(-2) === x.previous, `${p} ${card.key}: trend 倒数第 2 点 ≠ previous（较上期口径）`);
    const d = card.deltaFormat === "percent" ? Math.round((x.value / x.previous - 1) * 1000) / 10 : x.value - x.previous;
    check(d === x.delta, `${p} ${card.key}: delta 应为 ${d}`);
  }
}
for (const card of stats.cards) {
  check(["semantic", "neutral"].includes(card.deltaTone ?? "semantic"), `cards.${card.key}: deltaTone 非法`);
  check(!(card.deltaTone === "neutral" && card.invertDelta), `cards.${card.key}: neutral 与 invertDelta 互斥`);
}

// ---- day：同时段 7 点 ≤ series.week 各整日值（今日为半日，两处应相等）
{
  const d = stats.byPeriod.day;
  series.week.points.forEach((pt, i) => {
    check(d.trendLabels[i] === pt.label, `day trendLabels[${i}] ≠ series.week[${i}]`);
    check(d.gmv.trend[i] <= pt.gmv && d.orders.trend[i] <= pt.orders, `day trend[${i}] 同时段值超过整日值`);
  });
  check(d.gmv.trend.at(-1) === series.week.points.at(-1).gmv, "day: 今日同时段 ≠ series.week 今日");
}

// ---- week：自然周合计可由 series.month 逐日验算（08-10 周起）
{
  const w = stats.byPeriod.week;
  const byDate = Object.fromEntries(series.month.points.map((pt) => [pt.date, pt]));
  w.trendLabels.forEach((label, i) => {
    const mon = `${year}-${label.slice(0, 5)}`;
    const days = Array.from({ length: 7 }, (_, k) => byDate[addDays(mon, k)]);
    if (!days.every(Boolean)) return; // 窗口不在近 30 天内
    check(sum(days, "gmv") === w.gmv.trend[i], `week ${label}: Σ series.month gmv = ${sum(days, "gmv")} ≠ trend ${w.gmv.trend[i]}`);
    check(sum(days, "orders") === w.orders.trend[i], `week ${label}: Σ series.month orders = ${sum(days, "orders")} ≠ trend ${w.orders.trend[i]}`);
  });
  const [prevStart] = meta.periods.week.compareWith.match(/\d\d-\d\d/);
  const prev = Array.from({ length: 7 }, (_, k) => byDate[addDays(`${year}-${prevStart}`, k)]);
  check(prev.every(Boolean) && sum(prev, "gmv") === w.gmv.previous && sum(prev, "orders") === w.orders.previous, "week.previous ≠ Σ series.month[上期 7 天]");
  check(series.week.points.every((pt, i) => JSON.stringify(pt) === JSON.stringify(series.month.points.at(i - 7))), "series.week 与 series.month 末 7 天不一致");
}

// ---- month：逐日不得出现整周重复、每日都在 asOf 窗口内
{
  const pts = series.month.points;
  check(pts.length === 30, "series.month 须 30 点");
  check(pts[0].date === meta.periods.month.range[0] && pts.at(-1).date === meta.periods.month.range[1], "series.month 日期范围 ≠ meta.periods.month");
  const weeks = [];
  for (let i = 0; i + 7 <= pts.length; i += 7) weeks.push(pts.slice(i, i + 7).map((p) => p.gmv).join(","));
  check(new Set(weeks).size === weeks.length, "series.month 存在逐日完全重复的整周");
  check(!pts.some((p, i) => i && p.gmv === pts[i - 1].gmv), "series.month 相邻两日 gmv 完全相同");
}

// ---- orders / tasks / notifications / nav / team
for (const o of orders) {
  check(Math.abs(o.items.reduce((a, i) => a + i.qty * i.unitPrice, 0) - o.amount) < 0.01, `${o.id}: amount ≠ Σ qty×unitPrice`);
  check(meta.orderStatuses.includes(o.status), `${o.id}: status 未登记`);
  check(meta.channels.some((c) => c.key === o.channel), `${o.id}: channel 未登记`);
  check(o.placedAt <= asOf, `${o.id}: placedAt 晚于 asOf`);
  check(o.id.startsWith(`SO-${asOf.slice(0, 10).replaceAll("-", "")}-`) === (o.placedAt.slice(0, 10) === asOf.slice(0, 10)), `${o.id}: 订单号日期 ≠ placedAt`);
}
check(orders.every((o, i) => !i || o.placedAt < orders[i - 1].placedAt), "orders 须按 placedAt 倒序");
for (const t of tasks) {
  check(Math.round((t.done / t.total) * 100) === t.percent, `${t.id}: percent`);
  check(team.some((m) => m.id === t.owner && m.name === t.ownerName), `${t.id}: owner 不在 team`);
  check((t.status === "done") === (t.done === t.total), `${t.id}: status 与 done/total 不符`);
}
check(notifications.items.filter((i) => i.unread).length === notifications.unreadCount, "unreadCount");
check(notifications.items.every((n, i) => n.at <= asOf && (!i || n.at <= notifications.items[i - 1].at)), "notifications 须倒序且不晚于 asOf");
const navItems = nav.flatMap((g) => g.items);
check(navItems.length === 8, "nav ≠ 8 项");
check(navItems.find((i) => i.key === "orders").badge === stats.byPeriod.month.pendingShipment.value, "nav.orders.badge ≠ 待发货");
check(navItems.find((i) => i.key === "inventory").badge === stats.byPeriod.month.lowStock.value, "nav.inventory.badge ≠ 库存预警");
check(team.some((m) => m.id === user.id && m.name === user.name), "user 不在 team");

// ---- activity：倒序、不晚于 asOf、人员存在、同一订单 下单 < 退款申请 < 受理
check(activity.every((a, i) => a.at <= asOf && (!i || a.at < activity[i - 1].at)), "activity 须按时间倒序且不晚于 asOf");
for (const a of activity) {
  check(a.actor === "system" || team.some((m) => m.id === a.actor && m.name === a.actorName), `${a.id}: actor 不在 team`);
  const orderId = a.link?.match(/SO-\d{8}-\d{4}/)?.[0];
  if (a.type === "refund" && orderId) {
    const o = orders.find((x) => x.id === orderId);
    const n = notifications.items.find((x) => x.type === "refund" && x.title.includes(orderId));
    check(o && o.status === "refunding", `${a.id}: 订单 ${orderId} 不存在或非退款中`);
    check(o && n && o.placedAt < n.at && n.at < a.at, `${a.id}: 同一订单须 下单(${o?.placedAt}) < 退款申请(${n?.at}) < 受理(${a.at})`);
  }
}

if (failures.length) {
  for (const f of failures) console.error("FAIL", f);
  process.exit(1);
}
console.log(`mock ok (${asOf})`);
