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

### 第 2 轮追加（orders / form / settings / landing / chat，Brief §11）
| 文件 | 用途 | 关键约束 |
|---|---|---|
| `orders-summary.json` | `/orders` 的**唯一计数来源**（服务端计数）：默认范围「近 7 天」共 731 单，`byRange`（今天 108 / 近 7 天 731 / 近 30 天 2,964）、`byDay`、`byStatus`（待发货 63）、`byChannel`、`flags`（缺货 40 / 缺货待发货 5 / 超 48h 3）、分页参数 | 逐项 = `stats.json` / `series.week` / `skus.weekStockoutOrders` / `nav` 角标；各分组合计 = total；页面上任何「n 单 / n 条」（`count`、`countFiltered`、`pagination.range.total`、「查看 n 单」、页码总数）只能取自本文件 |
| `orders-all.json` | `/orders` 近 7 天列表的 **50 单服务端分页样本**（不是全量；只用于渲染表格行 / 卡片 / Drawer），覆盖 6 状态 × 5 渠道；前 5 单与 `orders.json` 逐字段相同（追加字段除外）；样本填不满的页码 `aria-disabled` + `orders.pagination.sampleOnly`，不伪造行 | 在第 1 轮字段上追加 `warehouse|store`、`address`、`paidAt|expiresAt|shippedAt|completedAt|cancelledAt|refundRequestedAt`、`carrier`+`trackingNo`+`logistics[]`（Drawer 物流 Tab）、`remarks[]`（备注 Tab，作者 = team 成员）、`urgent`、`stockout`、`refundReason|cancelReason`；订单号序号 ≤ `series.month` 当日订单数；状态 ↔ 时间字段必须自洽；样本内任一日 / 状态 / 渠道分组行数 ≤ summary 对应计数；缺货且待发货（5）与待发货超 48h（3）两组在样本中是全集（chat c_1 / c_3 / 采购草稿备注由此复算），但样本里的缺货单数（5）/ 床头柜缺货单（3）**不替代** `skus.weekStockoutOrders`（40 / 14） |
| `skus.json` | 18 个 SKU（`/form` SKU 选项、`/chat` 缺货表、orders 商品行） | `name` / `unitPrice` 与订单商品行一致；`cost` 为采购价（< 售价）；`lowStock` = stock < safetyStock，`lowStock` 数 ≤ `stats.lowStock`；床头柜库存 = 通知 n_2「剩余 18 件」，抱枕安全线 = 动态「调整为 200」；`weekStockoutOrders` 为近 7 天缺货订单数 |
| `suppliers.json` | 6 家虚构供应商（含第 1 轮已出现的安吉林语木业）；樟里 `inTransit` = 在途单 PO-20260822-001（08-22 下单，40 件床头柜，预计 **09-09** 到杭州仓） | 每个 SKU 的 `supplier` 在此登记且品类匹配；`settlement` 在 `purchase-form.settlementMethods` 登记；`phoneMasked` 与 `phoneDemo` 首 3 末 4 一致；`inTransit.expectedAt` = `placedAt` + `leadTimeDays`，`placedAt` = `lastOrderAt`；orders-all / chat 里所有「预计 MM-DD」都指这张在途单；`purchase-form.draft`（PO-20260906-003，09-06 新建，常规交期 18 天 → **09-24**）是第二张新采购单，两个日期不冲突，hifi / 实现不得“纠正”为同一张 |
| `purchase-form.json` | `/form` 步骤、国家码、结算方式、仓库、时段、运费区间、标签建议、附件样例、校验文案、示例草稿 `draft`、成功页 | `draft`：联系人 / 电话 / 邮箱 = 供应商；每行 `unitPrice` = `skus.cost` 且 SKU 属该供应商；`subtotal` = Σ qty×unitPrice；`poNumber` = `poNumberNext` = asOf 当日 `PO-YYYYMMDD-NNN`；备注中的库存 / 安全线 / 待发货缺货单数与 skus / orders-all 一致 |
| `settings.json` | `/settings` 5 Tab：个人资料 / 账号安全 / 通知 / 团队 / 计费 + 危险区 | `profile` = `user.json`；`team.members` = `team.json` 5 人，`seats.used` = 成员数；`billing.plan` = `user.workspace.plan`，年付 = 月付 × 10，恰 1 个推荐档；发票一律为计划价发票，说明格式固定「计划 · 年付|月付（起 ~ 止）」，金额 = 对应计划价，服务期 = 开票日起整 1 年 / 1 个月（无席位加购等未定价项，不匹配即 FAIL）；当前会话 / 当前用户 `lastActiveAt` = asOf；危险区确认文字含空间名；全文无真实品牌词（2FA 提示 = 「任意支持 TOTP 的验证器应用」，支付方式 = 企业对公转账；渠道名只允许在通知描述 / 简介这类引用租户经营数据的字段） |
| `landing.json` | `/landing` 全部内容：导航 5、Hero、客户 6、特性 6、分屏 3、数字 4、定价 3、评价 6、FAQ 6、CTA、Footer 4 列 | 定价与 `settings.billing.plans` 同价；客户 / 评价人 / 公司全部虚构且评价公司 ∈ 客户名单；Hero 头像群取自 team；沈若琳评价与 user.json 身份一致；版权注明虚构；Hero / 特性 / FAQ / Footer 社交不得出现真实平台 · 产品品牌（写「主流电商平台 / 直播电商」，社交入口 = 公众号 / 用户社区 / 开源仓库），渠道名仅允许在分屏案例与评价（引用租户经营数据） |
| `chat.json` | `/chat` 会话 7 个（今天 / 本周 / 更早）、5 个会话完整消息（`historyAvailable: true`），c_6 / c_7 只有会话头（`historyAvailable: false`：列表可点，点后主区骨架 → 「历史消息未包含在演示数据中」空态，文案 `chat.history.unavailable.*`）、`streamingSample`、4 建议、2 模型、空态 / 错误文案 | 会话分组由 `updatedAt` 决定且组内倒序；消息正序、末条 = `updatedAt`；来源 Chip 与正文的订单号必须存在于 orders-all；c_1 缺货表 / CSV = `skus.weekStockoutOrders` 降序；c_2 买家 / 金额 = orders-all；c_3 超 48h 表由 orders-all 复算；c_4 复盘数字 = `series.month`；`streamingSample` = `purchase-form.draft` |

`meta.json` 第 2 轮只追加 `carriers`（承运商枚举）与 notes；`nav.json` 的 `implemented` 在实现阶段翻转，本阶段不改。

`content/kitchen-sink.md` 与 `content/components.md` 并存是阶段 5 前的过渡态：阶段 5 实现 `/components` 时同一提交删 `content/kitchen-sink.md` + `src/pages/kitchen-sink/` 并落地 `/kitchen-sink` → `/components` 重定向（Brief §11.5）。

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

第 2 轮追加断言：
- orders-all：≥40、倒序、无重复；前 5 单 = `orders.json`；金额 / 状态 / 渠道 / 日期与第 1 轮同规则；序号 ≤ 当日订单数；`initial` = 姓名末字；商品名 / 售价 = skus；线下单有 `store`、线上单有 `warehouse`；6 状态各自的时间字段自洽（待付款 `expiresAt > asOf`、已发货有承运商 + 运单号、已完成 `shippedAt < completedAt`、退款中有原因 + 申请时间、已取消有原因 + 时间）；`carrier` 在 meta 登记；`logistics` 以 `shippedAt` 开头、正序、末条 = `completedAt`；备注作者在 team、≤200 字；6 状态与 5 渠道全覆盖；含 `urgent` 与 `stockout` 样例，`stockout` 单至少含 1 个 lowStock SKU 且其 `weekStockoutOrders` ≥ 涉及单数。
- skus / suppliers：`lowStock` 口径、供应商存在且品类匹配、`cost < unitPrice`、lowStock 数 ≤ stats；床头柜库存 = 通知、抱枕安全线 = 动态；供应商结算方式已登记、`lastOrderAt ≤ asOf`、脱敏电话一致。
- purchase-form：草稿联系人 = 供应商、采购价 = `skus.cost`、SKU 属该供应商、`subtotal` 复算、仓库 / 时段登记、到货日 > asOf、运费区间在范围内、附件为已上传样例、备注 ≤ `noteMax` 且库存 / 安全线 / 缺货单数一致、创建人在 team、成功页含 PO 号 / 供应商 / 到货日、PO 号格式。
- settings：profile = user（含 `timezone` = meta）；恰 1 个当前会话且 = asOf；通知项对每个渠道给布尔值；团队空间 = user.workspace、成员 = team、席位、待邀请合法、角色标签 = team `roleLabel`；计费当前计划 = `user.workspace.plan`、恰 1 推荐、年付 = 月付 × 10、按价格升序、发票倒序且金额 = 计划价、`renewsAt` 在未来；危险区确认文字；5 个 Tab。
- landing：定价 = settings；各区块条数（5 / 6 / 6 / 3 / 4 / 6 / 6 / 4）；含示例租户；评价 `initial` = 姓名末字且公司 ∈ 客户；沈若琳评价 = user 身份；Hero 头像群 ⊂ team；「1,200+」= `stats[0]`；版权注明虚构。
- chat：分组 / 倒序 / 消息时序 / `messageCount`；来源与正文订单号存在且 `href` = `/orders/<id>`；toolCall 状态合法；4 条建议含改加急示例；空态称呼当前用户；c_1 缺货表与 CSV = skus（降序）+ 供应商名、合计 40、床头柜待发货缺货单号；c_2 订单为待发货 + 缺货 + 未加急、买家 / 金额一致、操作人 = 当前用户；c_3 超 48h 表 = orders-all 复算；c_4 = `series.month`（9/3 第二高、仅次于 8/19）；`streamingSample` = 采购草稿 + 供应商交期，工具卡 running。
