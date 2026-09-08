# components（/components）文案 —— Acme 设计系统全集页

> 引用方式：`components.<key>`。取代 `kitchen-sink.md`（`/kitchen-sink` 301 → `/components`）：`kitchen-sink.state.*`、`kitchen-sink.sample.*` 全部迁入并在此续用（key 前缀改为 `components.`，文案不变，见 §状态列 / §示例控件）；旧文件在实现阶段删除。不是产品屏幕，无业务 loading / empty / error；示例数据来自 `../mock/`，业务文案复用各屏 `content/*.md`。

## 页面
| key | 文案 | 说明 |
|---|---|---|
| title | Acme 设计系统 | h1 |
| subtitle | apps/reference 全部 ui / composed 组件 × 变体 × 尺寸 × 状态；外观只来自 design/tokens.json，映射表见 docs/frontend/04-components.md。 | h1 下方 |
| version | 令牌 {version} · 组件 {count} 个 | 副标题右侧；`{version}` = `design/tokens.json` 的 version 字段，`{count}` 由页面统计 |
| nav.aria | 组件类别导航 | 顶部粘性锚点导航 aria-label（375 折叠为 Select `nav.select`） |
| nav.select | 跳转到类别 | 375 Select aria-label |
| theme.toLight | 切换为亮色 | 主题按钮 aria-label |
| theme.toDark | 切换为暗色 | |
| theme.system | 跟随系统 | 主题菜单第三项 |
| search.placeholder | 搜索组件名 | 顶部搜索，过滤区块（客户端） |
| search.empty | 没有名为「{q}」的组件 | |
| backToTop | 回到顶部 | 右下角浮动按钮 aria-label |
| redirectNotice | /kitchen-sink 已迁移到 /components | 从旧路由跳转来时显示一次的 info Alert |

## 类别（区块标题，顺序即页面顺序）
| key | 文案 | 说明 |
|---|---|---|
| section.typography | 排版 | display / h1–h3 / body / label / caption / mono |
| section.button | 按钮 | Button 全部 variant × size × state；IconButton |
| section.formControls | 表单控件 | Input / PasswordInput / SearchInput / Textarea / Number / Select / Combobox / Radio / Checkbox / Switch / Slider / DatePicker / DateRangePicker / TimePicker / TagInput / OTP / FileDropzone / Field |
| section.dataDisplay | 数据展示 | Table / Pagination / Tag / CountBadge / Avatar / Delta / DescriptionList / Timeline / Card / StatCard / TrendChart / DonutChart / Markdown / CodeBlock / SourceChip |
| section.feedback | 反馈 | Alert / Toast / Skeleton / Spinner / Progress / StateCard / Result / Dialog / Tooltip |
| section.navigation | 导航 | NavItem / Breadcrumb / Tabs / Segmented / Stepper / Accordion / DropdownMenu / Popover / Sheet / Drawer / Anchor |
| section.layout | 布局 | AppShell / PageHeader / Toolbar / Separator / TextDivider / Kbd |
| section.theme | 主题 | 色板（语义色 × 亮暗）/ 字阶 / 间距 / 圆角 / 阴影 / 动效令牌表 |
| section.onboarding | 引导 | EmptyFigure / 欢迎卡 / 建议 Chip / 免打扰提示 |
| section.composed | 复合组件 | OrderCard / OrderDrawer / PurchaseItemRow / PlanCard / PricingToggle / MemberRow / SessionRow / ChatBubble / ToolCallCard / Composer / ConversationItem / Hero 抽象图 |

## 矩阵表头与状态列
| key | 文案 | 说明 |
|---|---|---|
| matrix.variant | 变体 | 矩阵行头 |
| matrix.size | 尺寸 | |
| matrix.state | 状态 | 矩阵列头 |
| matrix.na | — | 不适用的格（`aria-hidden`，视觉隐藏文字 `matrix.naText`） |
| matrix.naText | 不适用 | |
| state.default | 默认 | 以下与 `kitchen-sink.state.*` 一致 |
| state.hover | 悬停 | |
| state.focus | 焦点 | |
| state.disabled | 禁用 | |
| state.loading | 加载中 | |
| state.error | 错误 | |
| state.active | 选中 | |
| state.checked | 已勾选 | |
| state.readonly | 只读 | |
| state.open | 展开 | |
| state.empty | 空态 | |
| state.success | 成功 | |
| state.warning | 警告 | |
| state.info | 信息 | |
| state.streaming | 流式 | 新增：ChatBubble |
| state.running | 执行中 | 新增：ToolCallCard |
| state.indeterminate | 半选 | 新增：Checkbox |
| state.dragover | 拖入中 | 新增：FileDropzone |
| state.uploading | 上传中 | 新增：文件行 |

## 代码片段
| key | 文案 | 说明 |
|---|---|---|
| code.toggle | 代码 | 每个组件卡右上角折叠按钮（`aria-expanded`） |
| code.toggleAria | 显示 {component} 的用法 | |
| code.hide | 收起代码 | |
| code.copy | 复制 | 代码块右上角 |
| code.copied | 已复制 | Toast / 按钮短暂替换文字 |
| code.language | tsx | 代码块语言标记 |
| code.hint | 组件名与 props 用法，等宽字体纯文本，不含样式类 | 区块说明（可视觉隐藏） |
| props.title | Props | 折叠内第二段标题 |
| props.name | 属性 | 表头 |
| props.type | 类型 | |
| props.default | 默认值 | |

## 示例控件文案（沿用 kitchen-sink.sample.*，新增在下方）
| key | 文案 | 说明 |
|---|---|---|
| sample.button.primary | 保存更改 | |
| sample.button.secondary | 取消 | |
| sample.button.ghost | 查看全部 | |
| sample.button.danger | 删除订单 | |
| sample.button.link | 忘记密码？ | |
| sample.button.loading | 保存中… | |
| sample.icon.more | 更多操作 | |
| sample.icon.notifications | 通知 | |
| sample.input.label | 仓库名称 | |
| sample.input.placeholder | 例如：杭州仓 | |
| sample.input.value | 杭州仓 | |
| sample.input.error | 仓库名称不能为空 | |
| sample.input.description | 用于发货单与库存报表的显示名 | |
| sample.checkbox.label | 发货后自动通知客户 | |
| sample.tabs.aria | 统计周期示例 | |
| sample.tooltip | 后续轮次提供 | |
| sample.popover.open | 打开通知 | |
| sample.menu.open | 打开账号菜单 | |
| sample.sheet.open | 打开导航抽屉 | |
| sample.sheet.title | 导航 | |
| sample.sheet.close | 关闭导航 | |
| sample.toast.open | 弹出 Toast | |
| sample.toast.close | 关闭 | |
| sample.progress.aria | 任务进度示例 | |
| sample.state.helpLink | 查看服务状态 | |
| sample.table.mobileHint | 左右滑动查看更多 | |
| sample.chart.trend | 销售趋势示例 | |
| sample.chart.donut | 渠道占比示例 | |
| sample.chart.orders | 订单数 | |
| sample.chart.gmv | 销售额 | |
| sample.chart.total | 合计 | |
| sample.timeline.system | 系统 | |
| sample.textarea.label | 备注 | 新增 |
| sample.textarea.placeholder | 工艺要求、包装方式… | |
| sample.select.label | 收货仓库 | |
| sample.select.placeholder | 选择仓库 | |
| sample.combobox.label | 供应商 | |
| sample.combobox.placeholder | 搜索供应商名称 | |
| sample.combobox.empty | 没有匹配的供应商 | |
| sample.radio.label | 结算方式 | |
| sample.switch.label | 加急采购 | |
| sample.slider.label | 运费预算区间 | |
| sample.date.label | 期望到货日期 | |
| sample.date.placeholder | 选择日期 | |
| sample.time.label | 收货时段 | |
| sample.tagInput.label | 标签 | |
| sample.tagInput.placeholder | 输入后回车添加 | |
| sample.otp.label | 输入 6 位验证码 | |
| sample.dropzone | 拖拽文件到此处，或点击选择 | |
| sample.dialog.open | 打开对话框 | |
| sample.dialog.title | 取消订单 SO-20260906-0107？ | 示例数据取 mock 首个待付款单 |
| sample.dialog.confirm | 确认取消 | |
| sample.dialog.back | 返回 | |
| sample.drawer.open | 打开订单详情 | |
| sample.accordion.open | 展开 | |
| sample.stepper.aria | 步骤示例 | |
| sample.pagination.aria | 分页示例 | |
| sample.result.title | 采购单已提交 | |
| sample.markdown.aria | Markdown 渲染示例 | 内容取 `mock/chat.json` m_2 |
| sample.code.copy | 复制代码 | |
| sample.source.aria | 来源 | SourceChip 组 aria-label |
| sample.toolCall.name | 查询订单 | |
| sample.composer.placeholder | 问问订单、库存或采购… | |
| sample.segmented.aria | 接收方式 | |
| sample.anchor.aria | 页内导航 | |
| sample.hero.aria | 产品界面示意图 | Hero 抽象图 aria-label |
| sample.calendar.prev | 上个月 | 阶段 5 自 kitchen-sink.md 迁入（原文未列出）：Calendar 月份切换 aria-label |
| sample.calendar.next | 下个月 | |
| sample.number.dec | 减少数量 | NumberInput 步进 aria-label |
| sample.number.inc | 增加数量 | |
| sample.dialog.close | 关闭对话框 | Dialog 右上角 |
| sample.segmented.list | 列表 | Segmented 视图切换 |
| sample.segmented.cards | 卡片 | |
| sample.toolbar.aria | 订单工具条示例 | Toolbar aria-label |
| appShell.desktop | ≥1440 · sidebar expanded | AppShell 卡三档说明 |
| appShell.tablet | 1024 · sidebar rail | |
| appShell.mobile | ≤768 · 抽屉（Sheet） | |
| appShell.aria.expanded | 应用壳示意：左侧展开侧栏，顶栏，内容三列 | mini-shell role=img aria-label |
| appShell.aria.rail | 应用壳示意：左侧图标栏，顶栏，内容三列 | |
| appShell.aria.drawer | 应用壳示意：抽屉覆盖内容区 | |
| search.shortcut | / | 顶部搜索右侧 kbd；按「/」聚焦搜索框 |
| matrix.type | 类型 | 表单控件矩阵行头 |
| matrix.tone | tone | Tag 矩阵行头 |
| matrix.usage | 用途 | Tag 矩阵末列 |
| matrix.textOnly | 纯文字 | Tag 矩阵列 |
| matrix.withDot | 带圆点 | |
| matrix.density | 密度 | 行密度矩阵行头 |
| matrix.example | 示例 | 单列矩阵列头 |
| matrix.sample | 示例 | 行密度矩阵列 |
| matrix.iconButton | IconButton | Button 矩阵行 |
| matrix.shape | 形状 | IconButton 矩阵行头 |
| matrix.withIcon | 带图标 | Button 尺寸矩阵列 |
| matrix.block | block | |
| matrix.expanded | 展开 | IconButton 矩阵列（`aria-expanded`） |
| matrix.badge | 角标 | IconButton 矩阵列（CountBadge） |
| matrix.withPrefix | 带前缀 | 表单控件矩阵行（`prefix="¥"`） |
| caption.input.matrix | 类型 × 状态（size = md） | Input 矩阵 caption |
| sample.workspaceId | 工作区 ID | Input 只读格 aria-label，值取 mock/settings.json workspaceId |
| sample.dropzone.dragover | 松开即上传 | FileDropzone 拖入中主文案 |
| caption.button.matrix | 变体 × 状态（size = md） | Button 矩阵 caption |
| caption.button.size | 尺寸（sm 视觉高 32，hit-area 撑到 40） | |
| caption.iconButton.matrix | 形状 × 状态（固定 size.hit 正方形，必填 aria-label） | |
| sample.button.export | 导出 | 带图标按钮 |
| sample.alert.title.info | 信息 | Alert 标题行 |
| sample.alert.title.success | 成功 | |
| sample.alert.title.warning | 警告 | |
| sample.alert.title.danger | 错误 | |
| sample.alert.title.neutral | 中性 | |
| sample.alert.prefsSaved | 通知偏好已保存 | success Alert / Toast 正文 |
| sample.alert.restock | 去补货 | warning Alert 行内动作 |
| sample.spinner.syncing | 正在同步… | 按钮内 Spinner |
| sample.spinner.loadingOrders | 正在加载订单… | 页面级 Spinner |
| sample.alert.syncFailed | 渠道同步失败：{channel}授权已过期，请重新授权后再同步 | danger Alert 正文；`{channel}` 取 mock/orders-all 渠道名 |
| sample.alert.reauth | 重新授权 | |
| sample.alert.lowStock | 「{name}」库存低于安全线，剩余 {n} 件 | warning Alert 正文；取 mock/skus.json lowStock 项 |
| sample.toast.undo | 撤销 | 静态 Toast（带操作）行内动作 |
| sample.toast.retry | 重试 | 静态 Toast（danger）行内动作 |
| caption.toast.static | 静态示例（Toast 变体） | Toast 列 caption |
| sample.toast.shipped | 已发货 {n} 单 | 静态 Toast（带操作） |
| sample.toast.shippedDesc | 面单已推送到打印队列 | |
| sample.toast.syncFailed | 渠道同步失败 | 静态 Toast（danger 重试） |
| sample.toast.syncFailedDesc | {channel} · 授权已过期 | |
| sample.toast.exporting | 正在导出 {n} 条订单… | 静态 Toast（loading） |
| sample.toast.hint | 右下角浮出，4 秒后自动消失；aria-live=polite | 「弹出 Toast」按钮旁说明 |
| sample.table.caption | 最近订单示例（mock/orders-all.json） | Table 视觉隐藏 caption |
| sample.table.sortAmount | 按金额排序，当前降序 | 金额列排序按钮 aria-label |
| sample.table.density | 行密度 | 密度矩阵 caption |
| sample.table.density.default | table.row 56 | |
| sample.table.density.compact | table.row-compact 44 | |
| sample.table.selected | 已选中 | 已选行的视觉隐藏说明 |
| sample.nav.expanded | expanded（mock/nav.json） | NavItem 演示框 caption |
| sample.nav.rail | rail（size.sidebar-rail 64，Tooltip 显示名称） | |
| sample.nav.crumbs | Breadcrumb（长单号 + 折行） | |
| sample.nav.railAria | 主导航图标栏示例 | |
| sample.nav.aria | 主导航示例 | |
| sample.welcome.title | 下午好，{name} | 助理空态问候（hifi） |
| sample.welcome.body | 问我订单、库存或渠道销售的任何问题，我会基于今日 {time} 的数据快照回答。 | |
| sample.welcome.suggestionsAria | 建议问题 | |
| sample.quiet.caption | QuietHours（默认开启 {from}–{to} / 关闭 / 禁用） | |
| sample.quiet.on | {from}–{to} 仅保留紧急告警 | |
| sample.quiet.off | 已关闭，全天推送 | |
| sample.quiet.locked | 由管理员统一设置 | |
| sample.timePicker.caption | 时段选择（TimePicker × 2） | |
| sample.timePicker.from | 开始 | |
| sample.timePicker.to | 结束 | |
| sample.crumb.settingsAria | 面包屑（设置） | |
| sample.crumb.invite | 邀请成员加入{workspace}工作区 | 长文案折行示例 |
| sample.pageHeader.title | 待发货订单 | PageHeader 演示 |
| sample.pageHeader.meta | {n} 单 · 数据更新于 {time} | |
| sample.pageHeader.print | 批量打印面单 | 主按钮 |
| sample.toolbar.channel | 渠道 | 工具条 Select aria-label |
| sample.toolbar.channelAll | 全部渠道 | |
| sample.toolbar.filter | 筛选 | 带 CountBadge |
| sample.toolbar.density | 密度 | Segmented aria-label |
| sample.toolbar.density.default | 默认 | |
| sample.toolbar.density.compact | 紧凑 | |
| sample.toolbar.markShip | 标记发货 | 工具条右侧 ghost 按钮 |
| sample.pageHeader.crumbs | 面包屑（页头） | PageHeader 演示面包屑 nav aria-label |
| sample.separator.caption | Separator（水平 / 垂直） | |
| sample.separator.labels | 张面单 | 「{n} 张面单」 |
| sample.textDivider.today | 今天 | |
| sample.kbd.search | 搜索 | Kbd 行说明 |
| sample.kbd.send | 发送 | |
| sample.kbd.newline | 换行 | |
| sample.kbd.close | 关闭 | |
| sample.kbd.plus | + | |
| sample.orderCard.caption | OrderCard 375 列表卡（default / hover / selected / 加急） | |
| sample.orderCard.aria | 订单 {id} | OrderCard role=button aria-label |
| sample.purchase.caption | PurchaseItemRow（mock/purchase-form.json 草稿 {id}：数量 × 单价 = 小计，含校验错误） | |
| sample.purchase.aria | 采购商品行 | 列表 aria-label |
| sample.purchase.qtyMin | 数量至少为 1 | 数量 0 的校验错误 |
| sample.purchase.remove | 删除 {name} | 行删除按钮 aria-label |
| sample.purchase.total | 合计 | |
| sample.spinner.caption | Spinner 尺寸 / 按钮内 / 页面级 | |
| sample.skeleton.caption | Skeleton：统计卡 / 列表行 | |
| sample.progress.caption | Progress（mock/tasks.json） | |
| sample.tabs.orders.aria | 订单状态 | Tabs line 示例 aria-label；三项为「全部 / 待发货 / 退款中」，计数：全部 = 孤立演示口径 234（与 Pagination 示例同源），待发货取 mock/orders-summary.json byStatus，退款中 = mock/orders-all.json 样本内计数 |
| sample.tabs.orders.all | 全部 | Tabs line 首项；其余两项文案取 orders 状态表 |
| sample.tabs.settings.aria | 设置分区 | Tabs vertical 示例 aria-label；项目取 mock/settings.json tabs（带图标） |
| sample.stepper.verticalAria | 步骤示例（垂直） | 垂直 Stepper ol aria-label |
| sample.stepper.paid | 已付款 | 垂直 Stepper done 步；描述行为 mock 订单 paidAt 全量时间 |
| sample.stepper.shipFailed | 发货失败 | 垂直 Stepper error 步 |
| sample.stepper.shipFailedHint | 面单打印异常，请重试 | error 步描述行 |
| sample.stepper.delivered | 已签收 | 垂直 Stepper todo 步 |
| sample.segmented.savePercent | 省 {n}% | 计费周期 Segmented 年付侧 Tag；n = round((1 − yearly / (monthly × 12)) × 100)，按推荐套餐算得 17 |
| sample.pricing.caption | PricingCard（mock/landing.json · 按年付，专业版推荐） | 演示框 caption |
| sample.pricing.perMonthApprox | 约 ¥{n} / 月 | 年付副文案；n = yearly / 12 四舍五入 |
| sample.member.caption | MemberRow（mock/team.json：角色 Select、待接受邀请、移除） | 演示框 caption |
| sample.member.roleAria | {name} 的角色 | 角色 Select aria-label |
| sample.member.inviteRoleAria | 邀请 {email} 的角色 | |
| sample.member.pending | 待接受 | 待接受邀请行 Tag |
| sample.member.lastActive | {time} 活跃 | 成员行最近活动 caption |
| sample.member.inviteSent | 邀请已发送 · {date} 由 {name} 邀请 | 待接受邀请行副文案 |
| sample.member.revokeInvite | 撤回邀请 {email} | 撤回 IconButton aria-label |
| sample.session.caption | SessionRow（mock/settings.json 登录会话：当前 / 其他 / 注销中） | 演示框 caption |
| sample.session.justNow | 刚刚 | 当前会话相对时间（lastActiveAt = meta.asOf） |
| sample.session.revoking | 注销中 | aria-busy 注销按钮文案 |
| sample.anchor.caption | Anchor 页内导航（设置分区） | 演示框 caption |
| sample.anchor.profile | 基本信息 | AnchorNav 项 |
| sample.anchor.notifications | 通知偏好 | |
| sample.anchor.security | 安全 | |
| sample.anchor.billing | 账单与计划 | |
| sample.anchor.danger | 危险操作 | |
| sample.sheet.caption | Sheet 示例（打开导航抽屉） | 演示框 caption |
| sample.drawer.caption | Drawer 示例（打开订单详情） | |
| sectionDesc.typography | display / h1–h3 / body / label / caption / mono — 全部字阶来自 typography.* 复合令牌；字体 Inter Variable + Noto Sans SC Variable，等宽 JetBrains Mono Variable。 | 类别说明（cat-head） |
| sectionDesc.button | Button 全部 variant × size × state；IconButton。primary / secondary 禁用不降透明度，转 neutral-soft / surface-muted；ghost / danger 禁用用 opacity.disabled；link aria-disabled 保持 link 色 + cursor:not-allowed。 |  |
| sectionDesc.formControls | Input / PasswordInput / SearchInput / NumberInput / Textarea / Select / Combobox / Checkbox / Radio / Switch / Slider / DatePicker / DateRangePicker / TimePicker / TagInput / OTPInput / FileDropzone / Field。示例数据取 mock/purchase-form.json、suppliers.json、settings.json。 |  |
| sectionDesc.dataDisplay | Table / Pagination / Tag / CountBadge / Avatar / Delta / DescriptionList / Timeline / Card / StatCard / TrendChart / DonutChart / Markdown / CodeBlock / SourceChip。数据取 mock/orders-all.json、team.json、stats.json、series.json、activity.json、chat.json。 |  |
| sectionDesc.feedback | Alert / Toast / Skeleton / Spinner / Progress / StateCard / Result / Dialog / Tooltip。语义色四档（info / success / warning / danger）+ neutral；Toast 在 surface-raised 上。 |  |
| sectionDesc.navigation | NavItem / Breadcrumb / Tabs / Segmented / Stepper / Accordion / DropdownMenu / Popover / Sheet / Drawer / Anchor。未实现导航项 aria-disabled + Tooltip「后续轮次提供」，保持 fg-muted 与可聚焦。 |  |
| sectionDesc.layout | AppShell / PageHeader / Toolbar / Separator / TextDivider / Kbd。AppShell：1440 侧栏 expanded 240，1024 rail 64，≤768 抽屉 280；内容区 max size.content-max 1200。 |  |
| sectionDesc.theme | 色板（语义色 × 亮暗，切换右上角主题按钮即时对照）/ 字阶 / 间距 / 圆角 / 阴影 / 动效令牌表。所有值来自 design/tokens.json → tokens.css；本页不出现字面值。 |  |
| sectionDesc.onboarding | Welcome / SuggestionChips / QuietHours：助理空态首屏与设置项。文案取 mock/chat.json emptyState、suggestions 与 mock/settings.json。 |  |
| sectionDesc.composed | OrderCard / PurchaseItemRow / PricingCard / MemberRow / SessionRow / ChatBubble / ToolCall / Composer / ConversationList / HeroArt。业务组合件，放 src/components/composed/。 |  |
| versionValue | f37ffb6 | tokens.json 无 version 字段：沿用 hifi 的令牌提交号（交回 tokens 阶段追加 version） |
| theme.aria | 主题 | 主题分段控件 role=group aria-label |
| type.caption | 字阶 × 用途（示例文案取自各屏 content） | Typography 矩阵 caption |
| type.col.token | 令牌 | |
| type.col.sample | 示例 | |
| type.col.usage | 用途 | |
| type.usage.hero | landing 首屏标题 | |
| type.usage.display-lg | 营销页统计数字 | |
| type.usage.display | 统计卡主数字、计划价 | |
| type.usage.heading | 页面标题 / Dialog 标题 | |
| type.usage.title | 卡片标题 / 金额 | |
| type.usage.lead | 副标题 / 引言 | |
| type.usage.body | 正文、表格单元 | |
| type.usage.label | 表单标签、按钮、导航 | |
| type.usage.caption | 辅助说明、时间、表头 | |
| type.usage.eyebrow | 营销页小标 | |
| type.usage.code | 订单号 / 单号 / 代码 | |
| type.sample.eyebrow | Acme Console | 营销页小标示例 |
| type.hierarchy | 层级示例：标题 / 正文 / 辅助三级；最长商品行折行 | |
| swatch.group.base | 背景 / 表面 / 边框 / 前景 | 色板分组 |
| swatch.group.semantic | 品牌 / 语义 / 图表 | |
| swatch.bg | 页面底色 | 色板用途 |
| swatch.surface | 卡片 | |
| swatch.surface-muted | 次级面 | |
| swatch.surface-raised | 浮层 | |
| swatch.surface-brand | 品牌面 | |
| swatch.border | 分隔 | |
| swatch.border-strong | 控件边 | |
| swatch.fg | 正文 | |
| swatch.fg-muted | 辅助 | |
| swatch.fg-disabled | 仅 disabled | |
| swatch.bg-inverse | Tooltip | |
| swatch.fg-inverse | Tooltip 文字 | |
| swatch.primary | 主按钮 | |
| swatch.primary-hover | 悬停 | |
| swatch.primary-active | 按下 | |
| swatch.primary-soft | 选中底 | |
| swatch.on-primary | 主按钮文字 | |
| swatch.on-primary-soft | 选中文字 | |
| swatch.success | 已完成 | |
| swatch.success-soft | 底 | |
| swatch.warning | 待发货 | |
| swatch.warning-soft | 底 | |
| swatch.danger | 退款 / 删除 | |
| swatch.danger-soft | 底 | |
| swatch.info | 待付款 | |
| swatch.neutral-soft | 已发货底 | |
| swatch.link | 链接 | |
| swatch.focus-ring | 焦点环 | |
| swatch.skeleton | 骨架 | |
| swatch.overlay | 遮罩 | |
| swatch.chart-line | 销售额折线 | |
| swatch.chart-bar | 订单数柱 | |
| swatch.chart-grid | 网格 | |
| scale.space.caption | space.*（8pt 网格，4 为半步） | |
| scale.col.demo | 示意 | |
| scale.space.1 | 图标与文字间 | |
| scale.space.2 | 紧凑组内 | |
| scale.space.3 | 控件内边距 | |
| scale.space.4 | 卡片网格间距 | |
| scale.space.5 | 卡片内边距 | |
| scale.space.6 | 页面左右 | |
| scale.space.8 | 区块间 | |
| scale.space.10 | 空态内边距 | |
| scale.space.12 | 大区块间 | |
| scale.space.16 | 营销页段间 | |
| scale.space.20 | 营销页首屏 | |
| scale.radius | radius.* | |
| scale.shadow | shadow.*（暗色下阴影更深、表面更亮） | |
| scale.shadow.sm | sm 卡片 | |
| scale.shadow.md | md 菜单 | |
| scale.shadow.lg | lg 抽屉 | |
| scale.motion | motion.*（悬停此行查看：fast 120 / base 200 / slow 320；prefers-reduced-motion 时关闭） | |
