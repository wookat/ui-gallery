# 04 组件映射表：设计稿控件 ↔ 代码组件（阶段 4 工程地基）

> 阶段 4 产物。左列取自 `design/hifi/login|dashboard/index.html`（第 1 轮）与 `design/hifi/orders|form|components|landing|chat/index.html`（第 2 轮，标 **R2**）的 class / 形态；右列是 `apps/reference/src/components/` 里的实现。每一行都在 `/kitchen-sink` 有 default / hover / focus / disabled / loading / error 六态（不适用的状态在页面上显示 `—`），亮/暗由 `?theme=light|dark` 切换。
> 来源标记：**shadcn** = 从 shadcn/ui 拷入并按令牌重写外观（保留 Radix 行为）；**composed** = 自组（库无对应件）；**todo** = 本轮 hifi 未出现、后续屏幕需要时再补。
> 尺寸全部是令牌名（`design/tokens.json`），不写像素。
> 输入：`design/hifi/*`、`design/tokens.json`（fe01/integration@917be73）。`fg-disabled` 使用契约（tokens ef05fe8）：只用于不可聚焦的 disabled 控件（`PasswordInput` 眼睛、禁用且勾选的 `Checkbox` 底色）与 `aria-hidden` 装饰（`BreadcrumbSeparator`、kitchen-sink 的占位破折号）；可聚焦的 `aria-disabled` 项（`NavItem` 未实现导航、`Button variant="link"` 本轮不可达链接）一律保持 `fg-muted` / `link`（≥4.5:1）+ `cursor:not-allowed`。

## 1. 基础控件（`src/components/ui/`）

| 设计稿控件 | 代码组件 | 变体 | 尺寸 | 状态 | 来源 |
| --- | --- | --- | --- | --- | --- |
| `.btn-primary` / `.btn-secondary` / `.btn-ghost` / 危险按钮（订单菜单「取消订单」）/ 文本链接（忘记密码、免费注册、查看全部） | `Button` | `variant`: primary · secondary · ghost · danger · link；`block` | `size`: sm（`control.sm` 视觉高 + `hit-area` 撑到 `size.hit`）· md（`control.md`）· lg（`control.lg`） | hover / active 用 `*-hover` `*-active` 令牌；`loading` 渲染 `Spinner` + `aria-busy`（primary 保持全色）；primary / secondary disabled 不降透明度，转 `neutral-soft` / `surface-muted`（login hifi）；ghost / danger disabled 用 `disabled-look`（dashboard hifi 菜单项）；link `aria-disabled` 保持 link 色 + `cursor:not-allowed`；`asChild` 仅透传单个 child | shadcn |
| `.iconbtn`（铃铛、主题切换、汉堡、行内更多、头像按钮） | `IconButton` | `shape`: square · round；`count`（右上 `CountBadge alert`）；`aria-expanded` 转 `surface-muted` | 固定 `size.hit` 正方形；图标 `icon.md` | hover / focus-visible / disabled；必填 `label`（aria-label） | shadcn（由 Button 派生） |
| `.input`（邮箱 / 搜索 / 只读） | `Input` | 原生 `type`；`aria-invalid` 转 danger 加粗描边 | 高 `control.md`，内距 `space.3`，圆角 `radius.md` | hover→`fg-muted` 描边，focus→primary，disabled→`surface-muted`，readonly | shadcn |
| `.control.has-eye` + `.eye`（密码可见性） | `PasswordInput` | — | 同 Input；眼睛按钮 `size.hit` | 同 Input；切换按钮有 aria-label / aria-pressed | composed |
| `.field` + `.err`（标签 / 说明 / 错误） | `Field` `FieldLabel` `FieldDescription` `FieldError` | — | 标签 `typography.label`，错误 `caption` + danger | error 通过 `aria-describedby` 关联、`aria-invalid` 下传 | composed |
| `.search`（顶栏全局搜索，含 `kbd`） | `SearchInput` + `Kbd` | — | 高 `control.md`，槽 `surface-muted` | hover 出 hairline，focus-within 转 `surface`；disabled | composed |
| `.check .box`（记住我） | `Checkbox` / `CheckboxField` | — | 方框 `icon.md`，`radius.xs`；外层 `hit-area` 至 `size.hit` | checked → primary；hover / focus-visible / disabled | shadcn |
| `.alert`（登录锁定 / 网络错误 / 提示） | `Alert` `AlertDescription` `AlertAction` | `variant`: danger · warning · success · info | 三列网格 `icon.md / 1fr / auto`，`radius.md` | 关闭按钮 `size.hit`；`role="alert"` | shadcn |
| `.tag` + `.tag-*`（订单状态、渠道） | `Tag` | `tone`: info · warning · danger · success · neutral · muted；`dot` | 高 `space.6`，`caption` medium，胶囊 | — | shadcn（Badge 重写） |
| `.count-badge`（导航未读数 / 铃铛红点） | `CountBadge` | `tone`: neutral · warning · alert | 高 `size.badge`，最小宽 `size.badge` | — | composed |
| `.card` / `.card-head` | `Card` `CardHeader` `CardTitle` `CardDescription` `CardAction` `CardContent` | — | `surface` + hairline + `radius.lg` + `shadow.sm`，内距 `space.6`（375 移动端由页面收窄） | — | shadcn |
| `.tabs` / `.tab`（日 / 周 / 月分段） | `Tabs` `TabsList` `TabsTrigger` `TabsContent` | — | 触发器 `control.sm` 视觉高 + `hit-area`；槽 `surface-muted`，选中 `surface` + `shadow.sm` | hover / focus-visible / disabled；键盘左右切换（Radix） | shadcn |
| `[data-tip]`（无箭头黑底提示） | `Tooltip` `TooltipTrigger` `TooltipContent` `TooltipProvider` | — | 反色底、`caption`、`radius.sm` | 悬停 / 焦点触发；`?open=tooltip` 强制显示 | shadcn |
| `.popover`（通知面板） | `Popover` `PopoverTrigger` `PopoverContent` `PopoverHeader` `PopoverFooter` | — | `surface-raised` + `radius.lg` + `shadow.lg`，宽 `content-max/4` | `?open=popover`；需给 `aria-label` | shadcn |
| `.menu-head` / `.menu-item` / `.menu-sep`（账号菜单、订单行内菜单） | `DropdownMenu` `DropdownMenuTrigger` `DropdownMenuContent` `DropdownMenuHeader` `DropdownMenuLabel` `DropdownMenuItem` `DropdownMenuSeparator` | Item `tone`: default · danger | 项高 `size.hit`，内距 `space.3` | highlighted → `surface-muted`；disabled；默认非模态（不给页面加 aria-hidden） | shadcn |
| 移动端侧栏抽屉（`?open=drawer`） | `Sheet` `SheetTrigger` `SheetClose` `SheetContent` | `side`: left（默认）· right | 宽 `size.sidebar.drawer`，遮罩 `overlay` 令牌 | Esc / 遮罩关闭；焦点圈定（Radix Dialog） | shadcn |
| `.toast`（登录成功） | `Toaster` + `toast()`（sonner） | success · info · error 图标取语义色 | `surface-raised` + hairline + `radius.lg` + `shadow.lg` | `?toast=1&hold` 保持显示供截图 | shadcn（sonner） |
| `.crumbs`（栖木家居 / 仪表盘） | `Breadcrumb*` | — | `label` 字体；根 `fg-muted`、分隔符 `fg-disabled`、当前页 `fg` | — | shadcn |
| `table`（最近订单） | `TableWrap` `Table` `TableHeader` `TableBody` `TableRow` `TableHead` `TableCell` | — | th `caption`/`fg-muted`，td `space.3`，hairline 行线；订单号列 `font-mono`（`font.family.mono` = JetBrains Mono Variable，随包），金额 / 时间 `tabular-nums` | 行 hover 底色；`TableWrap` 在 375 横向滚动（页面 scrollWidth 不溢出） | shadcn |
| `.sk-*`（骨架） | `Skeleton` | 尺寸由调用方类名给：`h-3`=sk-text · `h-4`=sk-label · `h-8`=sk-value · `h-6 rounded-full`=sk-pill | — | 微光动画 `skeleton-shine` | shadcn |
| `.spinner` | `Spinner` | — | `icon.md`；转速 `motion.slow×3` | `role="status"` | composed |
| `.bar` / `.track`（任务进度条） | `Progress` | `tone`: primary · warning · success | 高 `space.2`，槽 `surface-muted` | — | shadcn |
| `.divider`（「或」） | `Separator` / `TextDivider` | 横 / 竖 | hairline | — | shadcn |
| `kbd`（搜索快捷键） | `Kbd` | — | `caption`，hairline 边 | — | composed |
| **R2** `.textarea` + `.counter`（备注 / 消息） | `Textarea` `CharCounter` | — | 最小高 `control.md × 2.5`，内距 `space.3`，`radius.md`；纵向可拉伸 | hover / focus / disabled / `aria-invalid`；`CharCounter` 超限转 danger | shadcn |
| **R2** `.number`（数量步进） | `NumberInput` | `min` / `max` / `step` | 左右 `size.hit` `IconButton` + 居中 `tabular-nums` 输入框，三段共享 `radius.md` | 到界禁用对应按钮；disabled / invalid；步进按钮必填 aria-label | composed（Input + IconButton） |
| **R2** `.ctl.select`（时段 / 仓库 / 取消原因 / 状态筛选 / 每页条数） | `Select` | `placeholder`（value="" 禁用项）；`leading` 图标 | 高 `control.md`，右侧 `size.hit` 宽 chevron，`pr-hit` | **原生 `<select>`**（各 hifi 均为原生控件，移动端用系统选择器，无自绘面板）；占位 `fg-muted`、hover / focus / disabled / `invalid` | shadcn（native-select） |
| **R2** `.combo` + `.listbox` / `.listbox-empty`（供应商搜索） | `Combobox` | `options[{value,label,hint,disabled}]` | 触发器同 Select；面板 `surface-raised` + `radius.md` + `shadow.lg`，宽随触发器，搜索行 `size.hit` 高，列表最高 `size.hit × 6` | APG combobox：↑↓ / Enter / Esc；`aria-activedescendant`；空匹配 `emptyText`；`?open=combobox`；必填 `aria-label` 或 `aria-labelledby`（面板 dialog 同名） | composed（Radix Popover） |
| **R2** `.radio` / `.dot` / `.radio-text .hint`（结算方式） | `RadioGroup` `RadioGroupItem` `RadioField` | `RadioField` 带 `label` + `hint` | 圆点 `icon.md`，选中内点 `size.dot`；整行 `min-h size.hit` | checked → primary 粗边；hover / focus-visible / disabled；键盘方向键（Radix） | shadcn |
| **R2** `.switch` / `.switch-row`（加急、通知开关） | `Switch` `SwitchField` | `SwitchField` 带 `label` + `hint`（右侧开关） | 轨道 `icon.lg` 高 × 1.5 宽，滑块 `surface` + `shadow.sm`；外层 `hit-area` 撑到 `size.hit` | checked → primary；disabled；`role="switch"` | shadcn |
| **R2** `.slider` / `.slider-values`（运费区间） | `Slider` `SliderValues` | 单值 / 区间（多 thumb）；`thumbLabels` | 可拖区 `size.hit` 高、轨道 `size.track`、滑块 `icon.lg` | disabled；键盘方向键 / Home / End（Radix） | shadcn |
| **R2** `.calendar` / `.datepicker`（到货日期、订单日期筛选） | `Calendar` `DatePicker` | 单日 / 区间显示（`value` 为 `[start, end]`）；`min` / `max` / `today` | 单元格 `size.hit` 网格，今日 hairline primary 环，选中 primary，区间 `primary-soft` | 触发器同 Input；`?open=date`；月份切换按钮必填 `labels.prevMonth/nextMonth`；ISO 日期字符串，不做时区换算 | composed（Radix Popover） |
| **R2** `.taginput` / `.chip`（标签） | `TagInput` `Chip` | `max`；`removeLabel(tag)` | 容器同 Input 边框、`min-h control.md`；chip 高 `size.chip`、`neutral-soft`；内联输入由 label 撑到 `size.hit` | Enter / 逗号确认、Backspace 删末项；满额禁输；invalid / disabled | composed |
| **R2** `.otp`（两步验证码） | `OTPInput` | `length`（默认 6） | 每格 `size.hit` 宽 × `control.lg` 高，等宽 `tabular-nums` | 自动前进 / Backspace 回退 / 粘贴分发；focus primary、invalid danger、disabled；`cellLabel(i)` 必填 | composed |
| **R2** `.dropzone` / `.file`（附件） | `FileDropzone` `FileItem` | FileItem `status`: done · uploading（`progress`）· error | 虚线 `border-strong` + `radius.lg`；文件行图标 `icon.md`、进度用 `Progress` | dragover → primary 边 + `primary-soft` 底；invalid / disabled；整块 label 包住 `input[type=file]`；移除按钮 `size.hit` | composed |
| **R2** `.dialog` / `.dialog-actions`（取消订单原因、编辑资料） | `Dialog` `DialogTrigger` `DialogClose` `DialogContent` `DialogHeader` `DialogTitle` `DialogDescription` `DialogFooter` | — | 宽 `size.dialog`，`surface-raised` + `radius.lg` + `shadow.lg`；≤768 贴底 | 遮罩 `overlay` 令牌；Esc / 遮罩 / 右上 `size.hit` 关闭按钮（`closeLabel`）；焦点圈定；`?open=dialog` | shadcn |
| **R2** 确认对话框（删除 / 取消订单 / 移除成员） | `AlertDialog*` `AlertDialogAction` `AlertDialogCancel` | Action 默认 `danger`，可传 `variant` | 同 Dialog | 无关闭按钮、点遮罩不关闭、Cancel 默认聚焦（Radix AlertDialog）；`?open=alert` | shadcn |
| **R2** `.drawer`（订单详情） | `Drawer` `DrawerTrigger` `DrawerClose` `DrawerContent` `DrawerBody` `DrawerFooter` | `headerExtra`（标题旁状态 Tag） | 宽 `size.drawer`，≤768 全宽；头 / 脚固定，`DrawerBody` 滚动 | `title` / `description` / `closeLabel` 必填；`?open=drawer`；基于 Sheet（Radix Dialog）右侧 | shadcn（Sheet 派生） |
| **R2** `.accordion` / `.acc-trigger`（FAQ） | `Accordion` `AccordionItem` `AccordionTrigger` `AccordionContent` | `type="single" collapsible` / `multiple` | 外框 hairline + `radius.md`，触发行 `min-h size.hit`，chevron 展开旋转 | hover / focus-visible / disabled；内容高度动画 `motion.base` | shadcn |
| **R2** `.pagination`（订单列表） | `Pagination` | `siblings`（默认 1）；`range` 文案；`isPageDisabled` | 页码 `size.hit` 方块，当前页 primary，省略号 `fg-muted`；≤768 range 换行 | `labels.{prev,next,page(n)}` 必填；`aria-current="page"`；首尾禁用 | composed |
| **R2** `.segmented`（列表 / 卡片视图切换） | `Segmented` `SegmentedItem` | 文本项 / `data-icon` 图标项（必填 aria-label） | 外框 hairline + `radius.md`，项 `min-h control.sm` + `hit-area`，项间 hairline 竖线 | 选中 `primary-soft`；hover / focus-visible / disabled；基于 Radix ToggleGroup single | shadcn（ToggleGroup 重写） |
| **R2** `.dl`（抽屉详情、表单汇总） | `DescriptionList` `DescriptionTerm` `DescriptionDetails` | `cols`: 1 · 2（≤768 回落 1） | dt `caption` `fg-muted` / dd `body`，行距 `space.3` | — | composed |

## 2. 业务组合件（`src/components/composed/`）

| 设计稿控件 | 代码组件 | 变体 | 尺寸 | 状态 | 来源 |
| --- | --- | --- | --- | --- | --- |
| `.avatar` / `.avatar-sm` / `.avatar-system`（姓名末字 + 色相） | `Avatar` | `size`: md · sm；`system` | `size.avatar.md` / `size.avatar.sm` | hue 来自 mock `avatarHue`，饱和/明度用 `color.avatar.*` 令牌；`role="img"` | composed |
| `.brand-mark` / `.brand-name`（栖木家居） | `BrandMark` | — | `size.brand` | 纯几何 SVG，无位图 | composed |
| `.nav-item` / `.nav-group-label`（侧栏 4 组 8 项；rail 模式） | `NavItem` `NavGroupLabel` | `rail`；`count` / `tone` 角标；`disabled`（aria-disabled + Tooltip） | 高 `size.hit`，`radius.md` | active → `primary-soft` / `on-primary-soft`；rail 模式补 `aria-label` | composed |
| `.stat` / `.delta` / `.sparkline`（4 统计卡） | `StatCard` `StatCardSkeleton` `Delta` `Sparkline` | Delta `tone`: success · danger · neutral；`direction`: up · down · flat | 主数字 `typography.display` | loading 用 `StatCardSkeleton` | composed |
| `.state-card`（空态 / 错误态） | `StateCard` `EmptyFigure` | `kind`: empty · error | 插图 `size.empty-figure` | 动作区放 `Button` | composed |
| `.timeline`（团队动态） | `Timeline` `TimelineItem` `TimelineSkeleton` | — | 节点 `avatar.sm`，连接线 hairline | loading | composed |
| `.task` / `.task-progress`（任务进度） | `TaskItem` | `status`: on_track · at_risk · done | — | at_risk → warning、done → success（透传 Progress tone） | composed |
| `.notif-item` / `.notif-dot`（通知） | `NotificationItem` | `kind`: refund · inventory · sync · order · member · security → 语义 tone | 图标圆 `control.md` | 未读蓝点 | composed |
| `.area` / `.line`（销售趋势）、`.donut` / `.donut-legend`（渠道占比）、`.chart-tip` | `TrendChart` `DonutChart` `ChartTip` | — | 高 `size.chart.trend`（375 用 `chart.trend-mobile`） | 颜色仅 `chart.1–5` / `chart.line` 令牌；Recharts | composed（Recharts） |
| `.order-card`（375 最近订单卡片） | `Card` + `Tag` 组合（见 kitchen-sink「OrderCard (375)」） | — | 内距 `space.4` | — | composed（页面内组合，未抽独立组件） |
| `.theme`（主题切换） | `IconButton` + `useTheme()`（`ThemeProvider`） | light · dark · system | `size.hit` | `?theme=` 覆写、localStorage 记忆、跟随系统 | composed |
| **R2** `.stepper` / `.step`（采购单三步） | `Stepper` | `steps[{key,label}]`、`current`、`errorAt`；`compactLabel`（375 只显示「第 n 步」） | 步号圆 `size.step`，连接线 hairline | done → primary 勾、current → primary 实心、todo → `border-strong`、error → danger；`statusLabels` 供读屏 | composed |
| **R2** `.page-header`（各屏页头） | `PageHeader` | `breadcrumb` / `description` / `actions` / `extra` 插槽 | 标题 `heading`，描述 `caption`；375 纵向堆叠 | — | composed |
| **R2** `.toolbar`（筛选 / 搜索 / 视图切换） | `Toolbar` `ToolbarGroup` `ToolbarSpacer` | — | 一行排布 `space.3` 间距，375 换行；`ToolbarSpacer` 把后续项推到右侧 | `role="toolbar"` + 必填 aria-label | composed |
| **R2** `.result`（提交成功 / 失败页） | `Result` | `status`: success · error · warning · info | 居中 `control.lg` 圆形语义底 + `icon.lg`，标题 `heading`，摘要区可放 `DescriptionList` | 与 `StateCard` 同骨架 | composed |
| **R2** `.plan`（定价卡） | `PricingCard` | `recommended`（primary 描边 + 顶部角标）· `current`；`features[{label,included}]` | 价格 `display` 字阶；`Card` 骨架 | 不含项 `fg-muted` + 横杠；`featureLabels` 读屏；动作插槽 `action` 全宽 | composed |
| **R2** `.code`（聊天代码块） | `CodeBlock` | `language` | `surface-muted` + `radius.md`，mono `caption`；`pre` 可聚焦横向滚动 | 复制按钮 `size.hit`，复制后短暂勾 + `role="status"` 播报 `labels.copied` | composed |
| **R2** `.bubble`（用户 / 助手消息） | `ChatBubble` | `role`: user（primary-soft 右对齐）· assistant（surface 左对齐 + Avatar）；`streaming`（光标）· `error` | 最大宽 `size.bubble-max`，内距 `space.3/4`，`radius.lg` | `actions` / `footer` 插槽；`time` caption；streaming 用 `aria-busy` + `streamingLabel` | composed |
| **R2** `.toolcall`（工具调用卡） | `ToolCall` | `status`: running · done · error | `surface-muted` + `radius.md`，grid `icon.md / 1fr / auto` | running → `Spinner`、done → success 勾、error → danger；参数 / 结果 mono 可展开（Radix Collapsible）；`labels` 必填 | composed |
| **R2** `.source`（引用来源） | `SourceChip` | `type`: order · snapshot · doc · link（图标） | 高 `size.chip` + `hit-area`，hairline 胶囊 | `<a>`；容器换行时用 `gap-y-3` 保证相邻热区不重叠 | composed |
| **R2** `.suggestion`（建议提问） | `SuggestionChip` | — | `min-h size.hit`，hairline + `radius.full` | hover `primary-soft`；disabled | composed |
| **R2** `.composer`（输入区） | `Composer` | `tools` 插槽（附件 / 模型）；`streaming` 时发送键变停止 | 自增高 textarea（`maxRows`），发送键 `size.hit` | Enter 发送 / Shift+Enter 换行；空内容或 disabled 不可发；`hint` caption；`labels.{send,stop,attach}` | composed |
| **R2** `.conv`（会话列表项） | `ConversationItem` | `active` · `unread`；`action` 插槽（更多） | `min-h size.hit`，`radius.md`，未读点 `size.dot` | hover `surface-muted`；active `primary-soft`；标题 truncate + caption 时间 | composed |

## 3. hifi 未出现、后续屏幕可能需要（todo）

Command Palette、Toast 之外的全局通知中心、Data Table 列设置（`?open=columns` 用 Popover + Checkbox 组合即可）、日期区间选择器的双面板（当前 `Calendar` 只做区间显示，区间选择由页面用两个 `DatePicker` 组合）。补法：从 shadcn 注册表拷入 → 删掉默认 Tailwind 类 → 只用 `theme.css` 暴露的主题类 → 加入 `/kitchen-sink` 状态矩阵 → `tools/no-hardcode.mjs` 与 `tools/a11y.mjs kitchen-sink` 通过。

## 4. 通用约定

- 组件文件顶部注释写明对应的 hifi class（`hifi .xxx`），便于回查定稿。
- 每个组件都有 `data-slot`；变体同时输出 `data-variant` / `data-size`，供 `tools/shoot.mjs`、`tools/a11y.mjs` 与后续视觉 QA 定位。
- 演示态：hover / focus 外观可用 `data-demo="hover|focus"` 强制显示（只用于 kitchen-sink 与截图，不用于业务页）。
- 任何视觉高度 < `size.hit` 的可点击件必须带 `hit-area`（或外层 label / 内距）把实际点击区撑到 40；`tools/a11y.mjs` 用 `elementFromPoint` 实测。`hit-area` 靠 `::before` 外扩，相邻可换行的小件（`SourceChip` / `Chip`）容器纵向间距 ≥ `space.3`，否则下一行的热区会盖住上一行。
- 浮层一律走 `useScreenState()` 的 `?open=<id>` 受控开合（`open` / `onOpenChange`），并在屏幕 `shots.json` 加 `overlay: true` 条目；Radix Popover 内容（Combobox / DatePicker 面板）必须有 `aria-label`（role=dialog 需可访问名）。
- 下拉选择用原生 `<select>`（`Select`），不自绘面板：与 hifi 一致，移动端体验最佳，也避免 Radix Select 的 `aria-hidden` 焦点圈定在 axe `aria-hidden-focus` 下报错；需要搜索 / 副文案的场景用 `Combobox`。
- 文案 / 可访问名一律由调用方通过 props 传入（`labels` / `closeLabel` / `removeLabel` / `statusLabels` …），组件内不写任何字面文案，保证全部来自 `content/*.md`。
- 第 2 轮 kitchen-sink 区块在 `src/pages/kitchen-sink/round2.tsx`（`FormControlsSection` / `OverlayExtras` / `NavExtras` / `TableExtras` / `ListExtras` / `LayoutSection` / `ComposedSection`），由 `index.tsx` 挂到对应 section；示例数据取 `mock.purchaseForm / suppliers / ordersSummary / ordersAll / settings / landing / chat`。
