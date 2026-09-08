# orders（/orders）文案

> 引用方式：`orders.<key>`。应用壳文案复用 `dashboard.md` 的 `shell.*`；订单状态标签复用 `dashboard.status.*`；渠道标签来自 `mock/meta.json.channels`。表格行 / Drawer 数据来自 `mock/orders-all.json`（近 7 天列表的 50 单服务端分页样本）；所有计数（`count.n`、`countFiltered.n/total`、`pagination.range.total`、`mobile.filter.apply.n`）来自 `mock/orders-summary.json`（默认「近 7 天」共 731 单、待发货 63、今日 108），不得用样本行数（brief §11.10-A）。此处只有标签与状态语。

## 页面与工具栏
| key | 文案 | 说明 |
|---|---|---|
| title | 订单 | h1 / 面包屑当前项 |
| subtitle | 全渠道订单，数据更新于 {time} | `{time}` 形如「今天 17:30」 |
| count | 共 {n} 单 | 工具栏右侧 / 表头上方；n = `orders-summary.byRange[当前日期预设]`（默认 731） |
| countFiltered | 筛选出 {n} 单，共 {total} 单 | 有筛选条件时；n = summary 对应分组数（待发货 63 / 天猫 262 / 今天 108），total 同 count |
| search.placeholder | 搜索订单号、买家、商品 | 搜索框 |
| search.aria | 搜索订单 | |
| filter.status | 状态 | 筛选 Select，含「全部状态」 |
| filter.status.all | 全部状态 | |
| filter.dateRange | 下单时间 | DateRangePicker 触发按钮 |
| filter.dateRange.placeholder | 开始日期 – 结束日期 | |
| filter.dateRange.preset.today | 今天 | 预设 |
| filter.dateRange.preset.week | 近 7 天 | |
| filter.dateRange.preset.month | 近 30 天 | |
| filter.channel | 渠道 | 多选 Popover 触发 |
| filter.channel.selected | 渠道 · {n} | 已选 n 个时的触发文案 |
| filter.clear | 清除筛选 | 有筛选时显示 |
| export | 导出 | 次级按钮；点击 Toast `toast.exportStarted` |
| columns | 列显示 | 图标按钮 aria-label；Popover 内每列一个 Checkbox |
| columns.title | 显示的列 | Popover 标题 |
| columns.reset | 恢复默认 | |
| create | 新建订单 | 主按钮（本轮不可达，`aria-disabled` + Tooltip `shell.nav.disabled.tip`） |

## 表格
| key | 文案 | 说明 |
|---|---|---|
| table.aria | 订单列表 | table aria-label |
| col.select | 选择 | 全选 Checkbox aria-label；半选状态 aria-label `col.selectSome` |
| col.selectSome | 已选择部分订单 | |
| col.selectRow | 选择订单 {id} | 行 Checkbox aria-label |
| col.id | 订单号 | 可排序 |
| col.customer | 买家 | 姓名 + 脱敏手机号 |
| col.items | 商品 | 首件商品名 + 「等 {n} 件」 |
| col.itemsMore | 等 {n} 件 | 商品数 > 1 时 |
| col.channel | 渠道 | |
| col.status | 状态 | Tag，颜色见 `dashboard.status.*` |
| col.amount | 金额 | 右对齐，可排序，`¥1,234.00` |
| col.placedAt | 下单时间 | 可排序，默认倒序；`09-06 17:27`，非本年份补年 |
| col.actions | 操作 | 表头视觉隐藏 |
| sort.asc | 升序排列 | 表头按钮 aria-label 后缀 |
| sort.desc | 降序排列 | |
| sort.none | 点击排序 | |
| urgent | 加急 | 订单号旁小 Tag（`urgent: true`） |
| stockout | 缺货 | 订单号旁 warning Tag（`stockout: true`） |
| rowMenu.aria | 订单 {id} 的更多操作 | 行内 ⋯ 按钮 |
| rowMenu.view | 查看详情 | 菜单 1 |
| rowMenu.ship | 标记发货 | 仅待发货 |
| rowMenu.urgent | 标记加急 | 仅待发货且未加急 |
| rowMenu.unurgent | 取消加急 | |
| rowMenu.copyId | 复制订单号 | Toast `toast.copied` |
| rowMenu.cancel | 取消订单 | 仅待付款 / 待发货，危险色 → `dialog.cancel.*` |
| rowMenu.delete | 删除订单 | 仅已取消，危险色 → `dialog.delete.*` |
| selection.count | 已选 {n} 单 | 批量操作条 |
| selection.ship | 批量发货 | |
| selection.export | 导出所选 | |
| selection.clear | 取消选择 | |

## 分页
| key | 文案 | 说明 |
|---|---|---|
| pagination.aria | 分页 | nav aria-label |
| pagination.range | 第 {from}–{to} 条，共 {total} 条 | total = summary 计数（默认 731 → 37 页）；to = 本页实际末行序号 |
| pagination.sampleOnly | 演示样本只包含前 {n} 页 | 样本填不满的页码 `aria-disabled` + Tooltip；n = ceil(样本匹配行数 ÷ 每页) |
| pagination.pageSize | 每页 {n} 条 | Select：10 / 20 / 50 |
| pagination.prev | 上一页 | |
| pagination.next | 下一页 | |
| pagination.page | 第 {n} 页 | 页码按钮 aria-label |
| pagination.current | 当前页，第 {n} 页 | |

## 详情 Drawer
| key | 文案 | 说明 |
|---|---|---|
| drawer.aria | 订单详情 | dialog aria-label |
| drawer.title | 订单 {id} | |
| drawer.close | 关闭详情 | |
| drawer.field.status | 状态 | 描述列表项 |
| drawer.field.channel | 渠道 | |
| drawer.field.customer | 买家 | |
| drawer.field.phone | 手机号 | |
| drawer.field.address | 收货地址 | 线下单显示门店 `drawer.field.store` |
| drawer.field.store | 门店 | |
| drawer.field.warehouse | 发货仓 | |
| drawer.field.placedAt | 下单时间 | |
| drawer.field.paidAt | 付款时间 | |
| drawer.field.expiresAt | 付款截止 | 仅待付款 |
| drawer.field.amount | 订单金额 | |
| drawer.tab.items | 商品 | Tabs 1 |
| drawer.tab.logistics | 物流 | Tabs 2 |
| drawer.tab.remarks | 备注 | Tabs 3，标题带条数 `备注 · {n}` |
| drawer.items.qty | × {n} | 商品行数量 |
| drawer.items.subtotal | 小计 | |
| drawer.items.total | 合计 | |
| drawer.logistics.carrier | 承运商 | |
| drawer.logistics.tracking | 运单号 | 带复制按钮 |
| drawer.logistics.copy | 复制运单号 | |
| drawer.logistics.empty | 尚未发货，暂无物流信息 | 待付款 / 待发货 / 已取消 |
| drawer.logistics.refund | 退款原因：{reason} | 退款中订单在物流 Tab 顶部显示 |
| drawer.logistics.cancel | 取消原因：{reason} | |
| drawer.remarks.empty | 还没有备注 | |
| drawer.remarks.placeholder | 添加内部备注，仅团队可见 | Textarea |
| drawer.remarks.submit | 添加备注 | |
| drawer.remarks.max | 备注不超过 200 字 | |
| drawer.action.ship | 标记发货 | Drawer 底部按钮，条件同行菜单 |
| drawer.action.urgent | 标记加急 | |
| drawer.action.cancel | 取消订单 | |

## Dialog 与 Toast
| key | 文案 | 说明 |
|---|---|---|
| dialog.cancel.title | 取消订单 {id}？ | |
| dialog.cancel.description | 已付款订单会原路退回 ¥{amount}，买家将收到取消通知。此操作不可撤销。 | 待付款订单省略退款句 |
| dialog.cancel.reason | 取消原因 | Select：买家取消 / 缺货无法发出 / 重复下单 / 其他 |
| dialog.cancel.confirm | 确认取消 | 危险按钮 |
| dialog.cancel.back | 返回 | |
| dialog.delete.title | 删除订单 {id}？ | |
| dialog.delete.description | 删除后订单将从列表与报表中移除，不可恢复。仅已取消订单可删除。 | |
| dialog.delete.confirm | 删除 | 危险按钮 |
| dialog.delete.back | 返回 | |
| toast.cancelled | 订单 {id} 已取消 | success |
| toast.deleted | 订单 {id} 已删除 | success，含「撤销」按钮 `toast.undo` |
| toast.undo | 撤销 | |
| toast.shipped | 订单 {id} 已标记发货 | |
| toast.urgent | 订单 {id} 已标记加急 | |
| toast.copied | 已复制 | |
| toast.exportStarted | 正在导出 {n} 单，完成后发送到 {email} | `{email}` = `mock/user.json.email` |
| toast.error | 操作失败，请重试 | danger |

## 状态
| key | 文案 | 说明 |
|---|---|---|
| loading.aria | 正在加载订单 | 骨架屏 aria-busy 区域 |
| empty.filtered.title | 没有符合条件的订单 | 筛选无结果 |
| empty.filtered.description | 试试放宽筛选条件或更换关键词 | |
| empty.filtered.action | 清除筛选 | |
| empty.new.title | 还没有订单 | 新账号无订单 |
| empty.new.description | 接入销售渠道后，订单会每 15 分钟自动同步到这里 | |
| empty.new.action | 接入渠道 | 主按钮（本轮不可达） |
| error.title | 订单加载失败 | |
| error.description | 网络连接异常，请检查网络后重试 | |
| error.retry | 重试 | |
| mobile.card.aria | 订单 {id}，{status}，{amount} | 375 卡片可点击区域 aria-label |
| mobile.filter | 筛选 | 375 工具栏折叠为「筛选」按钮 → Sheet |
| mobile.filter.title | 筛选订单 | Sheet 标题 |
| mobile.filter.apply | 查看 {n} 单 | Sheet 底部主按钮；n 同 countFiltered，取 summary |
