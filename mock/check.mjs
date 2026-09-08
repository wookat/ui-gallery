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

// ======== 第 2 轮（orders / form / settings / landing / chat）========
const ordersAll = read("orders-all.json");
const ordersSummary = read("orders-summary.json");
const skus = read("skus.json");
const suppliers = read("suppliers.json");
const purchaseForm = read("purchase-form.json");
const settings = read("settings.json");
const landing = read("landing.json");
const chat = read("chat.json");
const skuById = Object.fromEntries(skus.items.map((s) => [s.sku, s]));
const supplierById = Object.fromEntries(suppliers.items.map((s) => [s.id, s]));
const orderById = Object.fromEntries(ordersAll.map((o) => [o.id, o]));
const dayOrders = Object.fromEntries(series.month.points.map((p) => [p.date, p.orders]));
const money = (n) => `¥${n.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ---- orders-all：服务端分页样本 ≥40、倒序、首 5 单 = orders.json、与第 1 轮同口径、状态 ↔ 时间字段、序号 ≤ 当日订单数
check(ordersAll.length >= 40, `orders-all 样本须 ≥ 40 单（现 ${ordersAll.length}）`);
check(ordersAll.every((o, i) => !i || o.placedAt < ordersAll[i - 1].placedAt), "orders-all 须按 placedAt 倒序");
check(new Set(ordersAll.map((o) => o.id)).size === ordersAll.length, "orders-all 订单号重复");
orders.forEach((o, i) => {
  const a = ordersAll[i];
  check(a && Object.keys(o).every((k) => JSON.stringify(a[k]) === JSON.stringify(o[k])), `orders-all[${i}] 与 orders.json[${i}]（${o.id}）字段不一致`);
});
for (const o of ordersAll) {
  check(Math.abs(o.items.reduce((a, i) => a + i.qty * i.unitPrice, 0) - o.amount) < 0.01, `${o.id}: amount ≠ Σ qty×unitPrice`);
  check(meta.orderStatuses.includes(o.status), `${o.id}: status 未登记`);
  check(meta.channels.some((c) => c.key === o.channel), `${o.id}: channel 未登记`);
  check(o.placedAt <= asOf, `${o.id}: placedAt 晚于 asOf`);
  const [, ymd, seq] = o.id.match(/^SO-(\d{8})-(\d{4})$/) ?? [];
  check(ymd === o.placedAt.slice(0, 10).replaceAll("-", ""), `${o.id}: 订单号日期 ≠ placedAt`);
  const date = o.placedAt.slice(0, 10);
  if (dayOrders[date] != null) check(Number(seq) >= 1 && Number(seq) <= dayOrders[date], `${o.id}: 序号超过当日订单数 ${dayOrders[date]}`);
  check(o.customer.initial === o.customer.name.at(-1), `${o.id}: customer.initial ≠ 姓名末字`);
  for (const it of o.items) {
    const s = skuById[it.sku];
    check(s && s.name === it.name && s.unitPrice === it.unitPrice, `${o.id}: 商品 ${it.sku} 与 skus.json 名称/售价不一致`);
  }
  check(o.channel === "offline" ? !!o.store && meta.tenant.stores.includes(o.store) : !!o.warehouse && meta.tenant.warehouses.includes(o.warehouse), `${o.id}: 线下单须有 store / 线上单须有 warehouse`);
  const t = (k) => (o[k] == null || (o[k] <= asOf && o[k] >= o.placedAt)) || failures.push(`${o.id}: ${k} 须在 placedAt ~ asOf 内`);
  ["paidAt", "shippedAt", "completedAt", "cancelledAt", "refundRequestedAt"].forEach(t);
  switch (o.status) {
    case "pending_payment": check(!o.paidAt && o.expiresAt > asOf, `${o.id}: 待付款须无 paidAt 且 expiresAt > asOf`); break;
    case "pending_shipment": check(o.paidAt && !o.shippedAt && !!o.address, `${o.id}: 待发货须有 paidAt/address、无 shippedAt`); break;
    case "shipped": check(o.paidAt && o.shippedAt && !o.completedAt && o.carrier && o.trackingNo, `${o.id}: 已发货须有 paidAt/shippedAt/carrier/trackingNo、无 completedAt`); break;
    case "completed": check(o.completedAt && (o.channel === "offline" || (o.shippedAt && o.shippedAt < o.completedAt)), `${o.id}: 已完成须有 completedAt（线上单还需 shippedAt < completedAt）`); break;
    case "refunding": check(o.paidAt && o.refundReason && o.refundRequestedAt, `${o.id}: 退款中须有 paidAt/refundReason/refundRequestedAt`); break;
    case "cancelled": check(o.cancelledAt && o.cancelReason, `${o.id}: 已取消须有 cancelledAt/cancelReason`); break;
  }
  if (o.carrier) check(meta.carriers.includes(o.carrier), `${o.id}: carrier 未在 meta 登记`);
  if (o.shippedAt) {
    check(Array.isArray(o.logistics) && o.logistics[0]?.at === o.shippedAt && o.logistics.every((e, i) => !i || e.at >= o.logistics[i - 1].at), `${o.id}: logistics 须以 shippedAt 开头且正序`);
    if (o.completedAt) check(o.logistics.at(-1).at === o.completedAt, `${o.id}: logistics 末条 ≠ completedAt`);
  }
  check(Array.isArray(o.remarks), `${o.id}: remarks 须为数组`);
  for (const r of o.remarks ?? []) {
    check(team.some((m) => m.id === r.by && m.name === r.byName), `${o.id}: 备注作者 ${r.by} 不在 team`);
    check(r.at >= o.placedAt && r.at <= asOf && r.text.length <= 200, `${o.id}: 备注时间越界或超 200 字`);
  }
}
const statusCount = Object.fromEntries(meta.orderStatuses.map((s) => [s, ordersAll.filter((o) => o.status === s).length]));
check(Object.values(statusCount).every((n) => n > 0), `orders-all 须覆盖全部 6 种状态：${JSON.stringify(statusCount)}`);
check(meta.channels.every((c) => ordersAll.some((o) => o.channel === c.key)), "orders-all 须覆盖全部 5 个渠道");
check(ordersAll.some((o) => o.urgent) && ordersAll.some((o) => o.stockout), "orders-all 须含 urgent 与 stockout 样例");

// ---- orders-summary：/orders 的唯一计数来源，全部 = 第 1 轮 stats / series / skus / nav；样本任一分组 ≤ 计数；缺货待发货 / 超 48h 在样本中是全集
{
  const S = ordersSummary;
  const weekRange = meta.periods.week.range;
  check(S.scope.key === "week" && S.scope.range[0] === weekRange[0] && S.scope.range[1] === weekRange[1], "orders-summary.scope 须 = meta.periods.week");
  check(S.total === stats.byPeriod.week.orders.value && S.byRange.week === S.total, `orders-summary.total 须 = stats.week.orders ${stats.byPeriod.week.orders.value}`);
  check(S.byRange.today === stats.byPeriod.day.orders.value && S.byRange.month === stats.byPeriod.month.orders.value, "orders-summary.byRange today / month ≠ stats");
  check(S.byStatus.pending_shipment === stats.byPeriod.month.pendingShipment.value && S.byStatus.pending_shipment === navItems.find((n) => n.key === "orders").badge, "orders-summary 待发货 ≠ stats.pendingShipment / nav 角标");
  const weekPts = series.week.points;
  check(weekPts.length === 7 && weekPts.every((p) => S.byDay[p.date] === p.orders) && Object.keys(S.byDay).length === 7, "orders-summary.byDay ≠ series.week");
  check(Object.values(S.byDay).reduce((a, n) => a + n, 0) === S.total, "orders-summary.byDay 合计 ≠ total");
  check(meta.orderStatuses.every((k) => Number.isInteger(S.byStatus[k]) && S.byStatus[k] > 0) && Object.keys(S.byStatus).length === meta.orderStatuses.length && Object.values(S.byStatus).reduce((a, n) => a + n, 0) === S.total, "orders-summary.byStatus 须覆盖 6 状态且合计 = total");
  check(meta.channels.every((c) => Number.isInteger(S.byChannel[c.key]) && S.byChannel[c.key] > 0) && Object.keys(S.byChannel).length === meta.channels.length && Object.values(S.byChannel).reduce((a, n) => a + n, 0) === S.total, "orders-summary.byChannel 须覆盖 5 渠道且合计 = total");
  const gmvRank = series.week.channels.items.map((c) => c.key);
  check(gmvRank.every((k, i) => !i || S.byChannel[k] <= S.byChannel[gmvRank[i - 1]]), "orders-summary.byChannel 单量排序须与 series.week.channels GMV 排序一致");
  check(S.flags.stockout === sum(skus.items, "weekStockoutOrders"), `orders-summary.flags.stockout 须 = Σ skus.weekStockoutOrders ${sum(skus.items, "weekStockoutOrders")}`);
  for (const k of meta.orderStatuses) check(statusCount[k] <= S.byStatus[k], `样本 ${k} ${statusCount[k]} 单 > summary ${S.byStatus[k]}`);
  for (const c of meta.channels) { const n = ordersAll.filter((o) => o.channel === c.key).length; check(n <= S.byChannel[c.key], `样本渠道 ${c.key} ${n} 单 > summary ${S.byChannel[c.key]}`); }
  for (const o of ordersAll) check(o.placedAt.slice(0, 10) >= weekRange[0] && o.placedAt.slice(0, 10) <= weekRange[1], `${o.id}: 样本单须落在近 7 天窗口内`);
  for (const [d, n] of Object.entries(S.byDay)) { const m = ordersAll.filter((o) => o.placedAt.slice(0, 10) === d).length; check(m <= n, `样本 ${d} ${m} 单 > summary ${n}`); }
  check(ordersAll.filter((o) => o.stockout).length <= S.flags.stockout, "样本缺货单数 > summary.flags.stockout");
  check(ordersAll.filter((o) => o.stockout && o.status === "pending_shipment").length === S.flags.stockoutPending, "summary.flags.stockoutPending 须 = 样本中缺货且待发货单数（样本为全集）");
  const cutoffAsOf = new Date(new Date(asOf).getTime() - 48 * 3600e3).toISOString();
  check(ordersAll.filter((o) => o.status === "pending_shipment" && new Date(o.placedAt).toISOString() < cutoffAsOf).length === S.flags.pendingOver48h, "summary.flags.pendingOver48h 须 = 样本中 asOf 时待发货超 48h 单数（样本为全集）");
  check(S.pagination.pageSizes.includes(S.pagination.defaultPageSize) && S.sample.file === "orders-all.json" && S.sample.size === ordersAll.length, "orders-summary.pagination / sample 与 orders-all 不符");
}

// ---- skus：lowStock 口径、供应商存在、与通知 / 动态 / stats 一致
for (const s of skus.items) {
  check(s.lowStock === s.stock < s.safetyStock, `${s.sku}: lowStock ≠ stock < safetyStock`);
  check(!!supplierById[s.supplier], `${s.sku}: supplier ${s.supplier} 不在 suppliers`);
  check(supplierById[s.supplier]?.categories.includes(s.category), `${s.sku}: 供应商品类不含 ${s.category}`);
  check(skus.categories.some((c) => c.key === s.category), `${s.sku}: category 未登记`);
  check(s.cost < s.unitPrice, `${s.sku}: 采购价须低于售价`);
}
check(skus.items.filter((s) => s.lowStock).length <= stats.byPeriod.month.lowStock.value, "skus lowStock 数超过 stats.lowStock");
{
  const ns = skus.items.find((s) => s.sku === "QM-NS-WAL-2D");
  const n2 = notifications.items.find((n) => n.type === "inventory");
  check(ns && n2 && n2.title.includes(`剩余 ${ns.stock} 件`), "床头柜库存 ≠ notifications n_2「剩余 n 件」");
  const pl = skus.items.find((s) => s.sku === "QM-PL-CLD-45");
  const act = activity.find((a) => a.type === "inventory" && a.text.includes("安全库存"));
  check(pl && act && act.text.includes(`调整为 ${pl.safetyStock}`), "抱枕安全库存 ≠ activity 调整值");
  // 缺货订单：标 stockout 的单至少含 1 个 lowStock SKU；该 SKU 的 weekStockoutOrders 须 ≥ 涉及单数
  const bySku = {};
  for (const o of ordersAll.filter((o) => o.stockout)) {
    const low = o.items.filter((it) => skuById[it.sku]?.lowStock);
    check(low.length > 0, `${o.id}: 标 stockout 但无 lowStock SKU`);
    for (const it of low) bySku[it.sku] = (bySku[it.sku] ?? 0) + 1;
  }
  for (const [sku, n] of Object.entries(bySku)) check(skuById[sku]?.weekStockoutOrders >= n, `${sku}: weekStockoutOrders < orders-all 中缺货单数 ${n}`);
}

// ---- suppliers
for (const s of suppliers.items) {
  check(purchaseForm.settlementMethods.some((m) => m.key === s.settlement), `${s.id}: settlement 未登记`);
  check(s.lastOrderAt <= asOf, `${s.id}: lastOrderAt 晚于 asOf`);
  check(/^\d{3}\*{4}\d{4}$/.test(s.phoneMasked) && s.phoneDemo.length === 11 && s.phoneDemo.startsWith(s.phoneMasked.slice(0, 3)) && s.phoneDemo.endsWith(s.phoneMasked.slice(-4)), `${s.id}: phoneMasked 与 phoneDemo 不一致`);
}
check(suppliers.items.some((s) => s.name === "安吉林语木业"), "suppliers 须含第 1 轮已出现的安吉林语木业");
// 在途单：樟里 PO-20260822-001 是「预计 09-09 到仓」的唯一出处（与 purchase-form 草稿 09-24 为两张 PO）
{
  const zl = supplierById.sup_zhangli;
  const it = zl?.inTransit;
  check(zl && zl.openPurchaseOrders >= 1 && it, "樟里须有 inTransit 在途单（openPurchaseOrders ≥ 1）");
  if (it) {
    const placedYmd = it.placedAt.slice(0, 10);
    check(new RegExp(`^PO-${placedYmd.replaceAll("-", "")}-\\d{3}$`).test(it.poNumber), "inTransit.poNumber 须为下单日的 PO-YYYYMMDD-NNN");
    check(zl.lastOrderAt === it.placedAt && it.placedAt <= asOf, "inTransit.placedAt 须 = lastOrderAt 且不晚于 asOf");
    check(it.expectedAt === addDays(placedYmd, zl.leadTimeDays) && it.expectedAt > asOf.slice(0, 10), `inTransit.expectedAt 须 = 下单日 + 交期 ${zl.leadTimeDays} 天且晚于 asOf`);
    check(it.expectedAt < purchaseForm.draft.arrivalDate, "在途单到仓日须早于新草稿到货日");
    check(purchaseForm.warehouses.some((w) => w.key === it.warehouse), "inTransit.warehouse 未登记");
    check(it.items.length > 0 && it.items.every((x) => skuById[x.sku]?.name === x.name && skuById[x.sku]?.supplier === zl.id && x.qty > 0), "inTransit.items 须为樟里供货的 SKU");
    check(it.items.some((x) => x.sku === "QM-NS-WAL-2D"), "在途单须含缺货的床头柜");
    const eta = mmdd(it.expectedAt);
    const texts = [...ordersAll.flatMap((o) => o.remarks.map((r) => `${o.id}: ${r.text}`)), ...Object.values(chat.messages).flat().map((m) => `chat: ${m.markdown ?? m.text ?? ""}`)];
    const mentions = texts.filter((t) => /预计 \d{2}-\d{2}/.test(t));
    check(mentions.length >= 2 && mentions.every((t) => t.includes(`预计 ${eta}`)), `所有「预计 MM-DD」须 = 在途单 expectedAt ${eta}`);
    check(texts.some((t) => t.includes(it.poNumber)), "orders-all 备注须引用在途单 PO 号");
  }
}

// ---- purchase-form：草稿可验算
{
  const d = purchaseForm.draft;
  const sup = supplierById[d.supplierId];
  check(sup && sup.contact === d.contact && sup.phoneDemo === d.phone && sup.email === d.email, "draft 联系人/电话/邮箱 ≠ suppliers");
  check(Math.abs(d.items.reduce((a, i) => a + i.qty * i.unitPrice, 0) - d.subtotal) < 0.01, "draft.subtotal ≠ Σ qty×unitPrice");
  for (const it of d.items) {
    const s = skuById[it.sku];
    check(s && s.name === it.name && s.cost === it.unitPrice && s.supplier === d.supplierId, `draft 商品 ${it.sku} 名称/采购价/供应商不一致`);
  }
  check(purchaseForm.warehouses.some((w) => w.key === d.warehouse), "draft.warehouse 未登记");
  check(purchaseForm.deliverySlots.some((s) => s.key === d.slot), "draft.slot 未登记");
  check(d.arrivalDate > asOf.slice(0, 10), "draft.arrivalDate 须晚于 asOf 当日");
  check(d.freightRange[0] >= purchaseForm.freight.min && d.freightRange[1] <= purchaseForm.freight.max && d.freightRange[0] < d.freightRange[1], "draft.freightRange 越界");
  check(d.attachments.every((n) => purchaseForm.attachments.samples.some((s) => s.name === n && s.status === "done")), "draft.attachments 须为已上传样例");
  check(d.note.length <= purchaseForm.validation.noteMax, "draft.note 超过 noteMax");
  check(team.some((m) => m.id === d.createdBy && m.name === d.createdByName), "draft.createdBy 不在 team");
  check(purchaseForm.success.description.includes(d.poNumber) && purchaseForm.success.description.includes(sup?.name ?? "") && purchaseForm.success.description.includes(d.arrivalDate), "success.description 须含 PO 号 / 供应商 / 到货日");
  check(purchaseForm.poNumberNext === d.poNumber && new RegExp(`^PO-${asOf.slice(0, 10).replaceAll("-", "")}-\\d{3}$`).test(d.poNumber), "poNumber 须为 asOf 当日的 PO-YYYYMMDD-NNN");
  const draftSkuLow = skuById["QM-NS-WAL-2D"];
  const nsPending = ordersAll.filter((o) => o.stockout && o.status === "pending_shipment" && o.items.some((i) => i.sku === "QM-NS-WAL-2D")).length;
  check(d.note.includes(`库存 ${draftSkuLow.stock}`) && d.note.includes(`安全线 ${draftSkuLow.safetyStock}`) && d.note.includes(`${nsPending} 单待发货缺货`), "draft.note 中床头柜库存/安全线/待发货缺货单数 ≠ skus / orders-all");
}

// ---- settings：profile = user、members = team、plan = workspace.plan、发票金额 = 计划价
{
  const p = settings.profile;
  check(p.userId === user.id && p.name === user.name && p.initial === user.initial && p.avatarHue === user.avatarHue && p.email === user.email && p.title === user.title, "settings.profile ≠ user.json");
  check(p.languages.some((l) => l.key === p.language) && p.timezones.some((t) => t.key === p.timezone), "settings.profile 语言/时区未登记");
  check(p.timezone === meta.timezone, "settings.profile.timezone ≠ meta.timezone");
  check(p.bio.length <= p.bioMax, "profile.bio 超长");
  const sec = settings.security;
  check(sec.sessions.filter((s) => s.current).length === 1 && sec.sessions.every((s) => s.lastActiveAt <= asOf), "sessions 须恰有 1 个 current 且不晚于 asOf");
  check(sec.sessions.find((s) => s.current).lastActiveAt === asOf, "当前会话 lastActiveAt 应 = asOf");
  check(sec.passwordUpdatedAt <= asOf, "passwordUpdatedAt 晚于 asOf");
  const ch = settings.notifications.channels.map((c) => c.key);
  for (const g of settings.notifications.groups) for (const it of g.items) check(ch.every((k) => typeof it[k] === "boolean"), `notifications.${g.key}.${it.key}: 须对每个 channel 给布尔值`);
  const tm = settings.team;
  check(tm.workspaceId === user.workspace.id && tm.workspaceName === user.workspace.name, "settings.team 工作空间 ≠ user.workspace");
  check(tm.members.length === team.length && tm.members.every((m) => team.some((t) => t.id === m.id)), "settings.team.members ≠ team.json");
  check(tm.seats.used === tm.members.length && tm.seats.total === settings.billing.seatsIncluded, "seats.used ≠ 成员数 或 seats.total ≠ 计划席位");
  check(tm.members.every((m) => m.lastActiveAt <= asOf && m.joinedAt <= asOf.slice(0, 10)), "team.members 时间越界");
  check(tm.members.find((m) => m.id === user.id).lastActiveAt === asOf, "当前用户 lastActiveAt 应 = asOf");
  check(tm.pendingInvites.every((i) => i.invitedAt <= asOf && team.some((t) => t.id === i.invitedBy) && tm.roles.some((r) => r.key === i.role) && !team.some((t) => t.email === i.email)), "pendingInvites 非法");
  check(tm.roles.every((r) => team.some((t) => t.role === r.key && t.roleLabel === r.label)), "settings.team.roles 标签 ≠ team.json roleLabel");
  const b = settings.billing;
  const cur = b.plans.find((pl) => pl.key === b.plan);
  check(cur && cur.label === b.planLabel && cur.label === user.workspace.plan && cur.seats === b.seatsIncluded, "billing 当前计划 ≠ user.workspace.plan");
  check(b.plans.filter((pl) => pl.recommended).length === 1, "billing.plans 须恰有 1 个推荐档");
  for (const pl of b.plans) check(pl.yearly === pl.monthly * 10 && pl.features.length === b.plans[0].features.length, `${pl.key}: 年付须 = 月付 × 10，功能条数一致`);
  check(b.plans.every((pl, i) => !i || pl.monthly > b.plans[i - 1].monthly), "billing.plans 须按价格升序");
  check(b.invoices.every((inv, i) => (!i || inv.issuedAt <= b.invoices[i - 1].issuedAt) && inv.issuedAt <= asOf.slice(0, 10) && b.invoiceStatuses.some((s) => s.key === inv.status)), "invoices 须倒序、不晚于 asOf、状态登记");
  const periodEnd = (start, cycle) => {
    const d = new Date(start + "T00:00:00Z");
    if (cycle === "年付") d.setUTCFullYear(d.getUTCFullYear() + 1); else d.setUTCMonth(d.getUTCMonth() + 1);
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  };
  for (const inv of b.invoices) {
    const m = inv.description.match(/^(.+?) · (年付|月付)（(\d{4}-\d{2}-\d{2}) ~ (\d{4}-\d{2}-\d{2})）$/);
    check(!!m, `${inv.id}: 发票说明须为「计划 · 年付|月付（起 ~ 止）」，不允许席位加购等未定价项（现「${inv.description}」）`);
    if (!m) continue;
    const pl = b.plans.find((x) => x.label === m[1]);
    check(pl && inv.amount === (m[2] === "年付" ? pl.yearly : pl.monthly), `${inv.id}: 金额 ≠ ${m[1]}${m[2]}价`);
    check(m[3] === inv.issuedAt && m[4] === periodEnd(m[3], m[2]), `${inv.id}: 服务期须从开票日起整 1 年 / 1 个月`);
  }
  check(b.renewsAt > asOf.slice(0, 10) && b.invoices[0].description.includes(b.planLabel) && b.invoices[0].description.includes(b.cycle === "yearly" ? "年付" : "月付"), "renewsAt / 最新发票与当前计划周期不符");
  check(settings.dangerZone.confirmHint.includes(settings.dangerZone.confirmPhrase) && settings.dangerZone.confirmPhrase.includes(user.workspace.name), "dangerZone 确认文字须含空间名");
  check(settings.tabs.length === 5, "settings.tabs ≠ 5");
}

// ---- landing：定价与 settings 同价、客户/评价虚构一致、计数
{
  for (const pl of landing.pricing.plans) {
    const s = settings.billing.plans.find((x) => x.key === pl.key);
    check(s && s.label === pl.label && s.monthly === pl.monthly && s.yearly === pl.yearly && s.recommended === pl.recommended, `landing.pricing.${pl.key} ≠ settings.billing.plans`);
  }
  check(landing.customers.length === 6 && landing.features.length === 6 && landing.solutions.length === 3 && landing.stats.length === 4 && landing.testimonials.length === 6 && landing.faq.length === 6 && landing.footer.columns.length === 4 && landing.nav.length === 5, "landing 各区块条数 ≠ Brief（5 链接 / 6 客户 / 6 特性 / 3 分屏 / 4 数字 / 6 评价 / 6 FAQ / 4 列）");
  check(landing.customers.some((c) => c.name === meta.tenant.name), "landing.customers 须含示例租户");
  for (const t of landing.testimonials) check(t.initial === t.name.at(-1) && landing.customers.some((c) => c.name === t.company), `评价 ${t.name}: initial ≠ 姓名末字 或 公司不在客户名单`);
  const ruolin = landing.testimonials.find((t) => t.name === user.name);
  check(ruolin && ruolin.company === user.workspace.name && ruolin.title === user.title, "沈若琳评价 ≠ user.json 身份");
  check(landing.hero.socialProof.avatars.every((a) => team.some((m) => m.initial === a.initial && m.avatarHue === a.hue)), "hero 头像群须取自 team.json");
  check(landing.hero.socialProof.label.startsWith(landing.stats[0].value), "hero「1,200+」≠ stats[0]");
  check(landing.footer.copyright.includes("虚构"), "footer.copyright 须注明虚构");
}

// ---- 真实品牌词（brief §11.10-K）：settings / landing 全文禁非渠道品牌；渠道名只允许在引用租户经营数据的字段
{
  const banned = /Google|1Password|Authy|Microsoft|Apple|GitHub|微博|淘宝|支付宝|微信|拼多多|小红书|快手|得物|Shopify|Slack|Notion/i;
  const channelWords = /天猫|抖音|京东/;
  const walk = (v, p, fn) => (typeof v === "string" ? fn(v, p) : v && typeof v === "object" && Object.entries(v).forEach(([k, x]) => walk(x, `${p}.${k}`, fn)));
  const tenantDataFields = ["landing.solutions", "landing.testimonials", "settings.profile.bio", "settings.notifications.groups"];
  for (const [name, data] of [["settings", settings], ["landing", landing]]) {
    walk(data, name, (s, p) => check(!banned.test(s), `${p}: 含真实品牌词「${s.match(banned)?.[0]}」`));
    walk(data, name, (s, p) => check(!channelWords.test(s) || tenantDataFields.some((f) => p.startsWith(f)), `${p}: 营销 / 提示文案不得出现平台名「${s.match(channelWords)?.[0]}」`));
  }
  check(landing.footer.social.every((s) => !/github|twitter|weibo|wechat|facebook|linkedin/i.test(`${s.key} ${s.icon}`)), "footer.social 不得用品牌 key / 图标");
}

// ---- chat：会话倒序、消息时序、来源订单存在、缺货表 = skus、复盘数字 = series、待发货表 = orders-all
{
  const groupOf = (iso) => (iso.slice(0, 10) === asOf.slice(0, 10) ? "today" : iso.slice(0, 10) >= meta.periods.week.range[0] ? "week" : "earlier");
  const groupKeys = chat.groups.map((g) => g.key);
  for (const c of chat.conversations) {
    check(groupKeys.includes(c.group) && groupOf(c.updatedAt) === c.group && c.updatedAt <= asOf, `${c.id}: group 与 updatedAt 不符`);
    const msgs = chat.messages[c.id];
    check(typeof c.historyAvailable === "boolean" && c.historyAvailable === !!msgs, `${c.id}: historyAvailable 须与是否有消息体一致`);
    if (!msgs) check(c.group === "earlier" && c.messageCount >= 2 && !c.unread, `${c.id}: 无消息体的会话只能在「更早」分组、不得未读`);
    if (msgs) {
      check(msgs.length === c.messageCount, `${c.id}: messageCount ≠ 实际条数`);
      check(msgs.every((m, i) => m.at <= asOf && (!i || m.at >= msgs[i - 1].at)), `${c.id}: 消息须正序且不晚于 asOf`);
      check(msgs.at(-1).at === c.updatedAt, `${c.id}: updatedAt ≠ 最后一条消息时间`);
      for (const m of msgs) {
        for (const s of m.sources ?? []) if (s.type === "order") check(!!orderById[s.label] && s.href === `/orders/${s.label}`, `${c.id}/${m.id}: 来源订单 ${s.label} 不存在或 href 不符`);
        for (const id of (m.markdown ?? m.text ?? "").match(/SO-\d{8}-\d{4}/g) ?? []) check(!!orderById[id], `${c.id}/${m.id}: 正文订单号 ${id} 不存在`);
        for (const tc of m.toolCalls ?? []) check(["done", "running", "failed"].includes(tc.status) && (tc.status !== "done" || typeof tc.durationMs === "number"), `${c.id}/${m.id}: toolCall ${tc.name} 状态非法`);
      }
    }
  }
  check(chat.conversations.every((c, i) => !i || c.updatedAt <= chat.conversations[i - 1].updatedAt || c.group !== chat.conversations[i - 1].group), "同组会话须按 updatedAt 倒序");
  check(chat.suggestions.length === 4 && chat.suggestions.some((s) => s.label.includes("SO-20260903-0087")), "chat.suggestions 须 4 条且含改加急示例");
  check(chat.emptyState.title.includes(user.shortName), "chat.emptyState 须称呼当前用户");
  // c_1 缺货表：行 = skus 中 weekStockoutOrders > 0 的 SKU，按降序；合计 40
  const m2 = chat.messages.c_1[1].markdown;
  const rows = [...m2.matchAll(/^\| (QM-[A-Z0-9-]+) \| (.+?) \| (\d+) \| (\d+) \/ (\d+) \|$/gm)].map((r) => ({ sku: r[1], name: r[2], n: +r[3], stock: +r[4], safety: +r[5] }));
  const expect = skus.items.filter((s) => s.weekStockoutOrders > 0).sort((a, b) => b.weekStockoutOrders - a.weekStockoutOrders);
  check(rows.length === expect.length && rows.every((r, i) => r.sku === expect[i].sku && r.name === expect[i].name && r.n === expect[i].weekStockoutOrders && r.stock === expect[i].stock && r.safety === expect[i].safetyStock), "chat c_1 缺货表 ≠ skus.weekStockoutOrders（降序）/ stock / safetyStock");
  const total = expect.reduce((a, s) => a + s.weekStockoutOrders, 0);
  check(m2.includes(`**${total} 单**`) && chat.messages.c_1[1].toolCalls[0].result.includes(`合计 ${total} 单`), `chat c_1 缺货合计应为 ${total}`);
  const stockoutPending = ordersAll.filter((o) => o.stockout && o.status === "pending_shipment" && o.items.some((i) => i.sku === "QM-NS-WAL-2D")).map((o) => o.id);
  check(stockoutPending.every((id) => m2.includes(id)) && m2.includes(`${stockoutPending.length} 单待发货`), "chat c_1 床头柜待发货缺货单号/数量 ≠ orders-all");
  // c_1 CSV 与表一致
  const csv = chat.messages.c_1[3].markdown.match(/```csv\n([\s\S]+?)```/)[1].trim().split("\n").slice(1);
  check(csv.length === expect.length && csv.every((line, i) => { const [sku, name, n, stock, safety, sup] = line.split(","); return sku === expect[i].sku && name === expect[i].name && +n === expect[i].weekStockoutOrders && +stock === expect[i].stock && +safety === expect[i].safetyStock && sup === supplierById[expect[i].supplier].name; }), "chat c_1 CSV ≠ skus / suppliers");
  // c_2 改加急：订单存在、待发货、缺货、金额 / 买家一致
  const o87 = orderById["SO-20260903-0087"];
  const m6 = chat.messages.c_2[1];
  check(o87 && o87.status === "pending_shipment" && o87.stockout && !o87.urgent, "SO-20260903-0087 须为待发货、缺货、未加急（助理执行前状态）");
  check(o87 && m6.markdown.includes(o87.customer.name) && m6.markdown.includes(o87.customer.phoneMasked) && m6.markdown.includes(money(o87.amount)) && m6.toolCalls[0].result.includes(money(o87.amount)), "chat c_2 买家/金额 ≠ orders-all");
  check(m6.toolCalls[1].result.includes(user.name), "chat c_2 更新订单操作人须为当前用户");
  // c_3 待发货超 48h 表 = orders-all 中 pending_shipment 且 placedAt < 消息时间 − 48h
  const m9 = chat.messages.c_3[1];
  const cutoff = new Date(new Date(m9.at).getTime() - 48 * 3600e3).toISOString();
  const overdue = ordersAll.filter((o) => o.status === "pending_shipment" && new Date(o.placedAt).toISOString() < cutoff).map((o) => o.id);
  const tableIds = [...m9.markdown.matchAll(/^\| (SO-\d{8}-\d{4}) \|.*\| (¥[\d,]+\.\d{2}) \|$/gm)].map((r) => [r[1], r[2]]);
  check(tableIds.length === overdue.length && tableIds.every(([id, amt]) => overdue.includes(id) && amt === money(orderById[id].amount)), `chat c_3 超 48h 表 ≠ orders-all（应为 ${overdue.join(", ")}）`);
  check(m9.markdown.includes(`**${overdue.length} 单**`) && m9.toolCalls[0].result === `${overdue.length} 单`, "chat c_3 单数不一致");
  // c_4 直播复盘 = series.month
  const d3 = series.month.points.find((p) => p.date === "2026-09-03");
  const d2 = series.month.points.find((p) => p.date === "2026-09-02");
  const m11 = chat.messages.c_4[1].markdown;
  const growth = Math.round((d3.gmv / d2.gmv - 1) * 1000) / 10;
  const sorted = [...series.month.points].sort((a, b) => b.gmv - a.gmv);
  check(m11.includes(`¥${d3.gmv.toLocaleString("en-US")} / ${d3.orders} 单`) && m11.includes(`¥${d2.gmv.toLocaleString("en-US")} / ${d2.orders} 单`) && m11.includes(`**${growth}%**`), `chat c_4 复盘数字 ≠ series.month（应 ${d3.gmv}/${d3.orders}、${d2.gmv}/${d2.orders}、${growth}%）`);
  check(sorted[1].date === "2026-09-03" && sorted[0].date === "2026-08-19" && m11.includes(`¥${sorted[0].gmv.toLocaleString("en-US")} / ${sorted[0].orders} 单`), "c_4「近 30 天第二高，仅次于 8/19」须与 series.month 排序及数字一致");
  // streamingSample：与 draft 一致
  const ss = chat.streamingSample;
  const d = purchaseForm.draft;
  const row = d.items.find((i) => i.sku === "QM-NS-WAL-2D");
  check(chat.conversations.some((c) => c.id === ss.conversationId) && ss.partialMarkdown.includes(`${row.qty} 件 × ${money(row.unitPrice)} = ${money(row.qty * row.unitPrice)}`) && ss.partialMarkdown.includes(d.arrivalDate) && ss.partialMarkdown.includes(`${supplierById[d.supplierId].leadTimeDays} 天`), "chat.streamingSample ≠ purchase-form.draft / suppliers");
  check(ss.toolCalls.every((t) => t.status === "running"), "streamingSample 工具卡须为 running");
}

if (failures.length) {
  for (const f of failures) console.error("FAIL", f);
  process.exit(1);
}
console.log(`mock ok (${asOf}) — orders.json ${orders.length} · orders-all 样本 ${ordersAll.length} / summary ${ordersSummary.total} · skus ${skus.items.length} · suppliers ${suppliers.items.length} · chat ${chat.conversations.length} 会话`);
