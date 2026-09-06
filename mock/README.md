# mock/ — Acme Console 参考应用唯一数据源

示例租户「栖木家居」（杭州栖木家居有限公司，实木家具 / 软装，1 个杭州仓 + 1 家门店，5 个销售渠道）的经营快照，时间点 `meta.json.asOf` = 2026-09-06 17:30（东八区）。所有金额人民币、单位「元」，JSON 中金额为数值（`4276` = ¥4,276.00），展示层再格式化。

| 文件 | 用途 | 关键约束 |
|---|---|---|
| `meta.json` | 租户、时间点、周期定义、渠道枚举、状态枚举、数据规律说明 | 其它文件的枚举必须在此登记 |
| `user.json` | 当前登录用户（沈若琳，管理员）+ 演示账号规则 | login 成功 Toast 用 `shortName` |
| `nav.json` | 侧边栏 4 组 8 项；`implemented:false` 的项本轮渲染为 `aria-disabled` + Tooltip | 恰好 8 项 |
| `stats.json` | 4 张统计卡 × 日/周/月：`value`、`previous`、`delta`、7 点 `trend`（末点 = value，倒数第 2 点 = previous） | `delta` 可由 value/previous 验算；趋势口径见下节 |
| `series.json` | 折线（销售额）+ 柱（订单数）三周期数据；`channels` 为环形图 | 各周期 gmv/orders 合计 = stats 对应 value；渠道合计 = 周期销售额；`month` 内每个自然周合计 = `stats.week.trend` 对应点 |
| `orders.json` | 最近订单 5 行（按下单时间倒序），覆盖 5 种状态与 5 个渠道 | `amount` = Σ qty × unitPrice |
| `team.json` | 5 名团队成员（时间线与任务负责人从这里引用 id） | 无头像图片，`initial` + `avatarHue` |
| `activity.json` | 团队动态时间线 6 条（含 1 条系统），按时间倒序 | 与订单/通知交叉引用同一订单号，且 下单 < 买家申请退款（通知） < 客服受理（动态） |
| `tasks.json` | 任务进度 5 条 | `percent` = round(done/total) |
| `notifications.json` | 铃铛 Popover 5 条，3 条未读 | `unreadCount` = 未读条数 |

## 统计卡口径（`stats.json`）
- `previous` = 等长的前一窗口（`meta.periods.*.compareWith`）；`trend` 7 点 = 连续 7 个等长窗口，故 `trend[-2] === previous`、`trend[-1] === value`，每个周期都成立。
  - `day`：7 点为 08-31~09-06 各日 **00:00–17:30 同时段**值（与「昨日同时段」同口径，今日不会因半日而显得偏低）；整日值看 `series.week`。
  - `week`：7 点为连续 7 个自然周（周一~周日）合计，标签为周一日期；落在近 30 天内的周（08-10 / 08-17 / 08-24 / 08-31 周）可由 `series.month` 逐日加总验算。
  - `month`：7 点为连续 7 个滚动 30 天窗口（**不是日历月**），标签为日期区间；快照类卡（待发货 / 库存预警）取窗口末日值。
- `cards[].deltaFormat`：`percent`（销售额 / 订单数）或 `count`（快照类，显示 `+9` / `−21`）。
- `cards[].deltaTone`（默认 `semantic`）：`semantic` = 上升绿 / 下降红，`invertDelta:true` 时反转（库存预警上升为红）；`neutral` = 不着语义色、只显示方向（待发货：订单多或发货慢都会升高，无法判定好坏）。

## 状态与周期切换
- 页面通过 `?state=loading|empty|error|success` 与 `?period=day|week|month` 切换（默认 `success` / `month`），供截图矩阵与审查使用；空态不读取本目录数据（除 `user.json`），侧边栏角标与铃铛角标均不显示。
- `/?toast=login`：在 success 态上叠加登录成功 Toast（`content/login.md` 的 `toast.success`），供 login `success` 态截图。
- 与旧的 `packages/spec/mock/*` 无关：旧目录只服务第 1 轮「原生默认主题样板」，本目录服务参考应用及后续「按稿还原」。

## 校验（阶段 0 门禁）
```bash
node mock/check.mjs   # 仓库根执行；通过输出 `mock ok (<asOf>)`，失败逐条打印 FAIL 并退出码 1
```
`check.mjs` 断言清单（改任一 JSON 后必须重跑）：
- 三周期 Σ series.gmv/orders = stats.value；channels.total = gmv.value，Σ 渠道 = total，`share` = round(gmv/total, 0.1%)，渠道 key/label 在 meta 登记。
- 每卡每周期：trend 7 点、`trend[-1] = value`、`trend[-2] = previous`、`delta` 由 value/previous 复算一致；`deltaTone` 合法且与 `invertDelta` 互斥。
- day：7 点标签与 `series.week` 逐日对齐，同时段值 ≤ 整日值，今日两处相等。
- week：近 30 天内每个自然周合计 = `week.trend` 对应点；`week.previous` = Σ `series.month[08-24..08-30]`；`series.week` = `series.month` 末 7 天。
- month：30 点、日期范围 = `meta.periods.month`、不存在逐日完全重复的整周、相邻两日 gmv 不相同。
- orders：`amount` = Σ qty×unitPrice、状态/渠道已登记、按 placedAt 倒序、不晚于 asOf、订单号日期 = 下单日期。
- tasks：`percent` = round(done/total)、owner 在 team、`done` ⇔ done = total。notifications：`unreadCount`、倒序、不晚于 asOf。
- nav：8 项；订单角标 = 待发货、库存角标 = 库存预警。user 在 team。
- activity：倒序、不晚于 asOf、actor 在 team；退款类动态所引用订单须满足 **下单 < 买家申请退款（通知）< 受理（动态）**。
