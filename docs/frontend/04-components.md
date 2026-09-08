# 04 组件映射表：设计稿控件 ↔ 代码组件（阶段 4 工程地基）

> 阶段 4 产物。左列取自 `design/hifi/login/index.html`、`design/hifi/dashboard/index.html` 的 class / 形态；右列是 `apps/reference/src/components/` 里的实现。每一行都在 `/kitchen-sink` 有 default / hover / focus / disabled / loading / error 六态（不适用的状态在页面上显示 `—`），亮/暗由 `?theme=light|dark` 切换。
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

## 3. hifi 未出现、后续屏幕可能需要（todo）

Select / Combobox、Radio、Switch、Textarea、DatePicker、Pagination、Dialog（居中模态）、Accordion、Command Palette。补法：从 shadcn 注册表拷入 → 删掉默认 Tailwind 类 → 只用 `theme.css` 暴露的主题类 → 加入 `/kitchen-sink` 状态矩阵 → `tools/no-hardcode.mjs` 与 `tools/a11y.mjs kitchen-sink` 通过。

## 4. 通用约定

- 组件文件顶部注释写明对应的 hifi class（`hifi .xxx`），便于回查定稿。
- 每个组件都有 `data-slot`；变体同时输出 `data-variant` / `data-size`，供 `tools/shoot.mjs`、`tools/a11y.mjs` 与后续视觉 QA 定位。
- 演示态：hover / focus 外观可用 `data-demo="hover|focus"` 强制显示（只用于 kitchen-sink 与截图，不用于业务页）。
- 任何视觉高度 < `size.hit` 的可点击件必须带 `hit-area`（或外层 label / 内距）把实际点击区撑到 40；`tools/a11y.mjs` 用 `elementFromPoint` 实测。
