# kitchen-sink（/kitchen-sink）文案

> 引用方式：`kitchen-sink.<key>`。开发者用组件总览页，不是产品屏幕；只放区块标题、状态列名与示例控件的可见文案。示例数据仍来自 `../mock/`，业务文案复用 `login.md` / `dashboard.md` 的 key。

## 页面
| key | 文案 | 说明 |
|---|---|---|
| title | 组件总览 | h1 |
| subtitle | 映射表 docs/frontend/04-components.md 中每个组件 × 变体 × 状态；外观只来自 design/tokens.json。 | h1 下方 |
| nav.aria | 组件区块导航 | 顶部锚点导航 aria-label |
| theme.toLight | 切换为亮色 | 主题按钮 aria-label |
| theme.toDark | 切换为暗色 | |
| state.default | 默认 | 状态列 |
| state.hover | 悬停 | |
| state.focus | 焦点 | |
| state.disabled | 禁用 | |
| state.loading | 加载中 | |
| state.error | 错误 | |
| state.active | 选中 | Tabs / 导航当前项 |
| state.checked | 已勾选 | 复选框 |
| state.readonly | 只读 | 输入框 |
| state.open | 展开 | Popover / 菜单 / 抽屉 |
| state.empty | 空态 | |
| state.success | 成功 | Alert / Toast |
| state.warning | 警告 | |
| state.info | 信息 | |

## 区块
| key | 文案 | 说明 |
|---|---|---|
| section.typography | 排版 | typography.* 六级 |
| section.button | 按钮 | primary / secondary / ghost / danger / link / icon |
| section.input | 输入 | Input / PasswordInput / SearchInput / Field |
| section.checkbox | 复选框 | |
| section.alert | 提示条 | danger / warning / success / info |
| section.tag | 标签与角标 | Tag（订单状态六色）/ CountBadge / Delta |
| section.avatar | 头像 | sm / md / system |
| section.card | 卡片 | Card / StatCard / StateCard |
| section.tabs | 分段切换 | |
| section.nav | 导航 | NavItem 展开 / 图标栏 / Breadcrumb |
| section.overlay | 浮层 | Tooltip / Popover / DropdownMenu / Sheet / Toast |
| section.table | 表格 | 桌面表格 + 375 订单卡 |
| section.list | 列表 | Timeline / TaskItem / NotificationItem |
| section.chart | 图表 | TrendChart / DonutChart |
| section.feedback | 反馈 | Skeleton / Spinner / Progress |
| section.form-controls | 表单控件 | 第 2 轮：Textarea / NumberInput / Select / Combobox / Radio / Switch / Slider / DatePicker / TagInput / OTP / FileDropzone |
| section.layout | 布局 | 第 2 轮：PageHeader / Toolbar |
| section.composed | 复合组件 | 第 2 轮：Stepper / Result / PricingCard / ChatBubble / ToolCall / SourceChip / SuggestionChip / Composer / ConversationItem / CodeBlock |

## 示例控件文案
| key | 文案 | 说明 |
|---|---|---|
| sample.button.primary | 保存更改 | 按钮示例 |
| sample.button.secondary | 取消 | |
| sample.button.soft | 联系销售 | 可聚焦 aria-disabled「本轮不可达」主操作（settings 计费 / orders 新建订单） |
| sample.button.ghost | 查看全部 | |
| sample.button.danger | 删除订单 | |
| sample.button.link | 忘记密码？ | |
| sample.button.loading | 保存中… | |
| sample.icon.more | 更多操作 | 图标按钮 aria-label |
| sample.icon.notifications | 通知 | |
| sample.input.label | 仓库名称 | Field 示例 |
| sample.input.placeholder | 例如：杭州仓 | |
| sample.input.value | 杭州仓 | |
| sample.input.error | 仓库名称不能为空 | |
| sample.input.description | 用于发货单与库存报表的显示名 | |
| sample.checkbox.label | 发货后自动通知客户 | |
| sample.tabs.aria | 统计周期示例 | |
| sample.tooltip | 后续轮次提供 | |
| sample.popover.open | 打开通知 | 触发按钮 |
| sample.menu.open | 打开账号菜单 | |
| sample.sheet.open | 打开导航抽屉 | |
| sample.sheet.title | 导航 | 抽屉可访问标题 |
| sample.sheet.close | 关闭导航 | |
| sample.toast.open | 弹出 Toast | 触发按钮 |
| sample.toast.close | 关闭 | Toast 关闭按钮 |
| sample.progress.aria | 任务进度示例 | |
| sample.state.helpLink | 查看服务状态 | 错误态辅助链接 |
| sample.table.mobileHint | 左右滑动查看更多 | |
| sample.chart.trend | 销售趋势示例 | 图表可访问名 |
| sample.chart.donut | 渠道占比示例 | |
| sample.chart.orders | 订单数 | 图例 |
| sample.chart.gmv | 销售额 | 图例 |
| sample.chart.total | 合计 | 环中心 |
| sample.timeline.system | 系统 | 系统动态的 actor 名 |
| sample.calendar.prev | 上个月 | Calendar 月份切换 aria-label（阶段 5 迁入 form.md） |
| sample.calendar.next | 下个月 | |
| sample.number.dec | 减少数量 | NumberInput 步进 aria-label |
| sample.number.inc | 增加数量 | |
| sample.dialog.close | 关闭对话框 | Dialog 右上角 |
| sample.segmented.list | 列表 | Segmented 视图切换 |
| sample.segmented.cards | 卡片 | |
| sample.toolbar.aria | 订单工具条示例 | Toolbar aria-label |
