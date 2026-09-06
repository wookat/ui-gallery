# dashboard（/）文案 + 应用壳文案

> 引用方式：`shell.<key>` / `dashboard.<key>`。数据字段（数字、订单、时间线）见 `../mock/`，此处只有标签与状态语。

## 应用壳（侧边栏 + 顶栏）
| key | 文案 | 说明 |
|---|---|---|
| shell.brand | Acme Console | 侧边栏顶部；折叠时只剩图形标 |
| shell.workspace | 栖木家居 | 当前团队空间名，品牌下方；来自 `mock/user.json` |
| shell.nav.collapse | 收起侧边栏 | 折叠按钮 aria-label |
| shell.nav.expand | 展开侧边栏 | |
| shell.nav.open | 打开导航 | 375 顶栏汉堡按钮 aria-label |
| shell.nav.group.overview | 概览 | 分组标题 |
| shell.nav.group.trade | 交易 | |
| shell.nav.group.goods | 货品 | |
| shell.nav.group.manage | 经营 | |
| shell.nav.disabled.tip | 后续轮次提供 | 非本轮路由 hover Tooltip；导航项文案在 `mock/nav.json` |
| shell.breadcrumb.root | 栖木家居 | 面包屑首项（不可点） |
| shell.breadcrumb.current | 仪表盘 | 面包屑当前项 |
| shell.search.placeholder | 搜索订单号、商品、客户 | 输入框；右侧显示快捷键 `⌘K` / `Ctrl K`（375 下只显示放大镜按钮） |
| shell.search.aria | 全局搜索 | |
| shell.notifications.aria | 通知，3 条未读 | 铃铛 aria-label（数字来自 mock） |
| shell.notifications.title | 通知 | Popover 标题 |
| shell.notifications.markAll | 全部标为已读 | Popover 标题右侧链接按钮 |
| shell.notifications.viewAll | 查看全部通知 | Popover 底部（不可达） |
| shell.notifications.empty | 暂无新通知 | Popover 空态 |
| shell.theme.toLight | 切换为亮色 | 主题按钮 aria-label（当前为暗色时） |
| shell.theme.toDark | 切换为暗色 | |
| shell.account.aria | 账号菜单 | 头像按钮 |
| shell.account.menu.profile | 个人资料 | 菜单 1 |
| shell.account.menu.security | 账号安全 | 菜单 2 |
| shell.account.menu.switch | 切换团队空间 | 菜单 3 |
| shell.account.menu.help | 帮助中心 | 菜单 4 |
| shell.account.menu.logout | 退出登录 | 菜单 5，危险色，点击回 `/login` |

## 概览页
| key | 文案 | 说明 |
|---|---|---|
| dashboard.title | 仪表盘 | h1（375 显示；1440 由面包屑承担，h1 视觉可弱化但保留语义） |
| dashboard.greeting | 下午好，若琳 | 按 `mock/meta.json.asOf` 小时段：5–11 早上好 / 11–13 中午好 / 13–18 下午好 / 其它 晚上好 |
| dashboard.asOf | 数据更新于 {time} | `{time}` 形如「今天 17:30」 |
| dashboard.period.day | 日 | Tabs 项 |
| dashboard.period.week | 周 | |
| dashboard.period.month | 月 | 默认选中 |
| dashboard.period.aria | 统计周期 | Tabs aria-label |
| dashboard.delta.up | 较上期 +{n}% | 统计卡同比，正向 |
| dashboard.delta.down | 较上期 −{n}% | 统计卡同比，负向 |
| dashboard.delta.flat | 与上期持平 | |
| dashboard.delta.count | 较上期 {sign}{n} | 数量型指标（待发货、库存预警）用绝对数；语义色按 `mock/stats.json.cards[].deltaTone` / `invertDelta`（待发货中性色，库存预警上升为红） |
| dashboard.stats.title | 经营概览 | 4 卡区块标题（可视觉隐藏，保留语义） |
| dashboard.chart.title | 销售趋势 | 折线 + 柱状图卡片标题 |
| dashboard.chart.subtitle | 销售额（折线）与订单数（柱） | |
| dashboard.chart.legend.gmv | 销售额 | |
| dashboard.chart.legend.orders | 订单数 | |
| dashboard.donut.title | 渠道占比 | 环形图卡片标题 |
| dashboard.donut.subtitle | 按销售额，{periodLabel} | `{periodLabel}` = 今日 / 近 7 天 / 近 30 天 |
| dashboard.donut.total | 合计 | 环中心标签 |
| dashboard.orders.title | 最近订单 | 表格卡标题 |
| dashboard.orders.viewAll | 查看全部 | 卡标题右侧链接（指向 `/orders`，不可达） |
| dashboard.orders.col.id | 订单号 | |
| dashboard.orders.col.customer | 客户 | |
| dashboard.orders.col.items | 商品 | 「商品名 ×数量」，多件显示「等 {n} 件」 |
| dashboard.orders.col.amount | 金额 | 右对齐，`¥1,234.00` |
| dashboard.orders.col.channel | 渠道 | |
| dashboard.orders.col.status | 状态 | Tag |
| dashboard.orders.col.time | 下单时间 | `09-06 16:42` |
| dashboard.orders.col.actions | 操作 | 表头视觉隐藏 |
| dashboard.orders.action.menu | 更多操作 | 操作按钮 aria-label |
| dashboard.orders.action.view | 查看详情 | 菜单项 |
| dashboard.orders.action.ship | 标记发货 | 仅待发货可用 |
| dashboard.orders.action.print | 打印面单 | |
| dashboard.orders.action.cancel | 取消订单 | 危险色；仅待付款/待发货可用 |
| dashboard.orders.mobileHint | 左右滑动查看更多 | 375 下表格横向滚动提示（可视觉弱化） |
| dashboard.activity.title | 团队动态 | 时间线卡标题 |
| dashboard.activity.viewAll | 查看全部 | 不可达 |
| dashboard.tasks.title | 任务进度 | 进度列表卡标题 |
| dashboard.tasks.due | 截止 {date} | `09-12` |
| dashboard.tasks.progress | {done}/{total} | 进度条右侧 |
| dashboard.tasks.aria | {title}，完成 {percent}% | 进度条 aria-label |

## 订单状态（Tag 文案与语义色）
| status | 文案 | 语义色 |
|---|---|---|
| pending_payment | 待付款 | warning |
| pending_shipment | 待发货 | info（主色调） |
| shipped | 已发货 | neutral |
| completed | 已完成 | success |
| refunding | 退款中 | danger |
| cancelled | 已取消 | neutral（弱） |

## 状态语
| key | 文案 | 说明 |
|---|---|---|
| dashboard.loading.aria | 正在加载仪表盘数据 | 骨架屏容器 `aria-busy` + 视觉隐藏文字；骨架块与成功态同布局 |
| dashboard.empty.title | 还没有经营数据 | 新账号空态标题（插图用 tokens 色绘制的简单几何图，或不用图） |
| dashboard.empty.body | 接入第一个销售渠道后，销售额、订单和库存会在这里实时汇总。 | |
| dashboard.empty.primary | 接入销售渠道 | 主按钮（不可达） |
| dashboard.empty.secondary | 导入历史订单 | 次按钮（不可达） |
| dashboard.empty.workspace | 未命名团队 | 空态下侧边栏团队空间名 |
| dashboard.empty.greeting | 你好，若琳 | 空态下问候语 |
| dashboard.error.title | 数据加载失败 | 错误态标题 |
| dashboard.error.body | 服务暂时不可用（错误码 503）。已为你保留上次的筛选条件，稍后重试即可。 | |
| dashboard.error.retry | 重试 | 主按钮；点击进入 loading → success |
| dashboard.error.help | 若持续失败，请联系管理员或查看服务状态。 | 辅助文字，「服务状态」链接不可达 |

## 状态切换（供截图/审查）
- `?state=loading|empty|error|success`（默认 success）；`?period=day|week|month`（默认 month）。
- `?toast=login`（仅 success 态）：右上角叠加 `login.toast.success`「欢迎回来，若琳」，充当 login 屏 `success` 态的可复现截图。
- 空态与错误态下应用壳（侧边栏/顶栏）保持可用，只有内容区变化；空态下通知铃铛无角标，侧边栏订单 / 售后 / 库存的数字角标亦不显示（`mock/nav.json.badge` 不读取）。
