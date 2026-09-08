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
