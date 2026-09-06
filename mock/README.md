# mock/ — Acme Console 参考应用唯一数据源

示例租户「栖木家居」（杭州栖木家居有限公司，实木家具 / 软装，1 个杭州仓 + 1 家门店，5 个销售渠道）的经营快照，时间点 `meta.json.asOf` = 2026-09-06 17:30（东八区）。所有金额人民币、单位「元」，JSON 中金额为数值（`4276` = ¥4,276.00），展示层再格式化。

| 文件 | 用途 | 关键约束 |
|---|---|---|
| `meta.json` | 租户、时间点、周期定义、渠道枚举、状态枚举、数据规律说明 | 其它文件的枚举必须在此登记 |
| `user.json` | 当前登录用户（沈若琳，管理员）+ 演示账号规则 | login 成功 Toast 用 `shortName` |
| `nav.json` | 侧边栏 4 组 8 项；`implemented:false` 的项本轮渲染为 `aria-disabled` + Tooltip | 恰好 8 项 |
| `stats.json` | 4 张统计卡 × 日/周/月：`value`、`previous`、`delta`、7 点 `trend`（最后一点 = value） | `delta` 可由 value/previous 验算 |
| `series.json` | 折线（销售额）+ 柱（订单数）三周期数据；`channels` 为环形图 | 各周期 gmv/orders 合计 = stats 对应 value；渠道合计 = 周期销售额 |
| `orders.json` | 最近订单 5 行（按下单时间倒序），覆盖 5 种状态与 5 个渠道 | `amount` = Σ qty × unitPrice |
| `team.json` | 5 名团队成员（时间线与任务负责人从这里引用 id） | 无头像图片，`initial` + `avatarHue` |
| `activity.json` | 团队动态时间线 6 条（含 1 条系统） | 与订单/通知交叉引用同一订单号 |
| `tasks.json` | 任务进度 5 条 | `percent` = round(done/total) |
| `notifications.json` | 铃铛 Popover 5 条，3 条未读 | `unreadCount` = 未读条数 |

## 状态与周期切换
- 页面通过 `?state=loading|empty|error|success` 与 `?period=day|week|month` 切换（默认 `success` / `month`），供截图矩阵与审查使用；空态不读取本目录数据（除 `user.json`）。
- 与旧的 `packages/spec/mock/*` 无关：旧目录只服务第 1 轮「原生默认主题样板」，本目录服务参考应用及后续「按稿还原」。

## 校验（阶段 0 门禁）
```bash
node -e '
const r=(f)=>JSON.parse(require("fs").readFileSync("mock/"+f,"utf8"));
const s=r("stats.json"),se=r("series.json"),o=r("orders.json"),t=r("tasks.json"),n=r("notifications.json"),nav=r("nav.json");
for(const p of ["day","week","month"]){const sum=(k)=>se[p].points.reduce((a,x)=>a+x[k],0);
 console.assert(sum("gmv")===s.byPeriod[p].gmv.value&&sum("orders")===s.byPeriod[p].orders.value,p+" series≠stats");
 console.assert(se[p].channels.total===s.byPeriod[p].gmv.value,p+" channels≠gmv");
 for(const c of ["gmv","orders","pendingShipment","lowStock"]){const x=s.byPeriod[p][c];console.assert(x.trend.at(-1)===x.value,p+" "+c+" trend tail");
  const d=s.cards.find(k=>k.key===c).deltaFormat==="percent"?Math.round((x.value/x.previous-1)*1000)/10:x.value-x.previous;console.assert(d===x.delta,p+" "+c+" delta")}}
for(const x of o)console.assert(Math.abs(x.items.reduce((a,i)=>a+i.qty*i.unitPrice,0)-x.amount)<0.01,x.id);
for(const x of t)console.assert(Math.round(x.done/x.total*100)===x.percent,x.id);
console.assert(n.items.filter(i=>i.unread).length===n.unreadCount,"unread");
console.assert(nav.flatMap(g=>g.items).length===8,"nav≠8");
console.log("mock ok")'
```
