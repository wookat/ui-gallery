# 07 · 体验官走查报告

> 本文件按轮次自上而下叠加：**第 2 轮复查（当前结论）** 在前，第 1 轮全量走查保留在后作为历史与 P2/P3 原始描述。

---

## 第 2 轮 · 复查（P1 修复复验 + 主流程回归）

> 角色：roles/legal-research/user-experience-officer（体验官）。
> 对象：`fe01/integration` @ `01ab5852ddb23d5df21f2e9fa77c2f7e5ccad179`（`git fetch && git checkout fe01/integration && git merge --ff-only origin/main` → Already up to date）。该提交 = 上一版报告（@6f4fe2a）之后的修复提交「fix(reference): 修复走查/QA P1——侧栏与「查看全部」走 react-router Link、订单菜单动作不再被菜单关闭覆盖、form 第 3 步不预报条款错误」。
> 范围（时间盒 30 分钟，按任务只做两件事）：① 逐条复验上轮 P1-1 / P1-2 / P1-3；② 回归 login / dashboard / orders / form 主流程。`components` / `landing` / `chat` 本轮明确未合入，不在范围、不计缺失。**不再全量探索**，上轮 P2/P3 只顺带记录是否仍复现，不新增深挖。
> 方法：`pnpm install --frozen-lockfile`（根）→ `apps/reference`：`pnpm lint && pnpm typecheck && pnpm build` → `pnpm preview --port 4173`（base `/apps/reference/`）。Playwright 1.62.1（复用根 `tools/shoot` 依赖，Chromium headless-shell 1234）以真实用户方式操作：**1440×900 鼠标**（真实坐标 click / hover）与 **375×812 触屏**（`isMobile + hasTouch`，DPR 2，`tap`）× **亮 / 暗**（`prefers-color-scheme`，不带 `?theme=`）= 4 组合，每组合跑同一脚本 `~/ux2/walk.mjs`（仓库外），日志 `~/ux2/run-<viewport>-<theme>.out`；截图 `shots/ux2/<name>-<viewport>-<theme>.png`（**不入库**，共 108 张）。下文「截图」均指该目录。
> 事实分级：✅ 实测通过 · ❌ 实测缺陷 · ⚠️ 未定论 · 「推断」= 读源码得出、未实测。**不改产品代码。**

### 0. 结论

**verdict = pass**（P0 = 0，P1 = 0）。上轮 3 条 P1 在 4 组合下**全部实测已修复**；主流程（登录 → 仪表盘 → 侧栏/「查看全部」进订单 → 筛选/排序/批量/详情/取消/删除/撤销/分页/状态 → 三步建采购单并提交/失败/离开确认）4 组合 **53（1440）/ 50（375）项断言 0 ❌**，console error 4 组合均为 0，375 全程 `scrollWidth = 375`，暗色无白块。

| 级别 | 数量 | 摘要 |
| --- | --- | --- |
| P0 | 0 | — |
| P1 | 0 | 上轮 P1-1 / P1-2 / P1-3 均已修复（§1） |
| P2 | 8 | 上轮 P2-1 ~ P2-7 本轮顺带复测**均仍复现**（未在修复范围，见 §3）+ 新增 P2-8 侧栏可用项与禁用项视觉无差别 |
| P3 | 6 | 上轮 P3-1 ~ P3-5 仍复现 + 新增 P3-6 步骤切换后焦点落 body |

### 1. 上轮 P1 逐条复验（4 组合：1440 亮 / 1440 暗 / 375 亮 / 375 暗）

| 上轮编号 | 现象 | 本轮结果 | 证据 |
| --- | --- | --- | --- |
| P1-1 /orders、/form 应用内无入口，入口说「后续轮次提供」 | ✅ **已修复（orders 部分）**。侧栏「订单 63」`<a href="/apps/reference/orders">`、无 `aria-disabled`，1440 hover **无** Tooltip；点击 / 375 导航抽屉 tap → `/orders`，h1「订单」；/orders 页侧栏「订单」`aria-current=page` 且无 `aria-disabled`。仪表盘「最近订单 → 查看全部」`href=/apps/reference/orders` 可点进订单页；另一处「查看全部」（`/activity`）保持 `aria-disabled` 且 1440 hover 出 Tooltip「后续轮次提供」（上轮是无任何反馈）。从 /orders 点侧栏「仪表盘」留在 `/`、h1「仪表盘」（QA-17 同修）。 | 4 组合日志 `P1-1 *` 6/6 ✅；截图 `dashboard-nav-orders-*`、`orders-default-*` |
| P1-1 中的「/form 无入口」 | ⚠️ **未修，按 brief 视为设计决定**：侧栏「采购」仍 `aria-disabled` + Tooltip「后续轮次提供」；/form 仍只能输 URL 到达。修复提交说明引用 brief §11.10-E「本轮不做 /purchasing」。体验官意见：对用户仍是「找不到新建采购单」，但既是需求侧决定，本轮**降为 P3-7 记录**，不阻塞。 | 截图 `dashboard-nav-orders-*`（采购项灰） |
| P1-2 订单行菜单「查看详情 / 取消订单 / 删除订单」静默无效 | ✅ **已修复**。SO-20260906-0107 菜单 →「查看详情」→ 右侧抽屉（375 底部 Sheet）打开，URL `?open=drawer&order=SO-20260906-0107`；Esc 关闭后 URL 干净，1440 焦点回该行。同单菜单 →「取消订单」→ AlertDialog `?open=dialog-cancel&order=…`；未选原因点「确认取消」→ 下拉 `aria-invalid`；选「买家取消」→ Toast「订单 SO-20260906-0107 已取消」、行状态「已取消」。SO-20260906-0077 菜单 →「删除订单」→ AlertDialog `?open=dialog-delete`，默认焦点「返回」；删除 → 行消失 + Toast「已删除 / 撤销」；「撤销」→ 行回来。菜单 Esc → URL 无 `open=`；「复制订单号」仍出 Toast「已复制」。 | 4 组合日志 `P1-2 *` 3/3 ✅ + 后续 8 项 ✅；截图 `orders-rowmenu-open-*`、`orders-menu-view-drawer-*`、`orders-menu-cancel-dialog-*`、`orders-after-cancel-*`、`orders-menu-delete-dialog-*`、`orders-toast-deleted-*` |
| P1-3 采购单第 3 步一进入就报「还有 1 项需要修正」并滚到底 | ✅ **已修复**。第 1 步「下一步」→ 第 2 步 → 「下一步」进入第 3 步：`role=alert` 0 个、「请先阅读并同意」0 处、`scrollY = 0`，「请核对采购单」核对卡在首屏可见（375 亦是）。未勾条款直接点「提交采购单」→ 2 个 alert（顶部汇总 + 字段）、焦点到 `#terms`——即错误只在用户动作后出现，符合「内联校验」预期。 | 4 组合日志 `P1-3 *` ✅；截图 `form-step3-entry-*`、`form-step3-terms-error-*` |

### 2. 主流程回归（4 组合一致，除注明）

登录 /login：
- ✅ h1「登录」；空提交 → 「请输入邮箱」「请输入密码」，焦点回邮箱；错误账号 → 「登录中…」→ Alert「邮箱或密码不正确。连续 5 次失败后账号将锁定 15 分钟。」；修改邮箱后 Alert 清除；正确账号 → `/?toast=login`，h1「仪表盘」，Toast「欢迎回来，若琳」（**本轮 4 组合成功路径均实测**，补上上轮亮色未测的缺口）。截图 `login-error-*`、`login-success-*`。
- ❌ P3-4 后退回 /login：邮箱空、「记住我」未勾（仍复现）。

仪表盘 /：
- ✅ 无横向溢出；侧栏「订单」可点（§1）；主题按钮切换后 `data-theme` 与 body 背景同步变化，**刷新后保持**（截图 `dashboard-theme-toggled-*`）；「日」→ `?period=day`；通知铃铛 → 弹层含「全部标为已读」。
- ❌ P2-5 仍复现：最近订单行菜单「查看详情」→ Toast「查看详情 / 后续轮次提供」，而 /orders 已可达（1440 两主题实测）。
- ❌ P3-1 仍复现：顶栏全局搜索输入「SO-2026」回车 → URL 不变、无 Toast（1440）。
- ❌ **P2-8（新增）**：侧栏里可用的「订单」与不可用的「售后 / 商品 / 库存 / 采购 / 报表 / 设置」**视觉完全一样**（同为 `fg-muted` 灰字、同图标灰度；徽标也同样式），只有 hover 才知道哪些点得动、375 触屏则完全无法预知（截图 `dashboard-nav-orders-mobile-*` 抽屉 8 项中 2 可用 6 不可用，肉眼不可分）。AGENTS「fg-disabled 只用于不可聚焦 disabled」契约导致 `aria-disabled` 项保持 `fg-muted`，这是令牌层决定——**建议交设计侧**：为 `aria-disabled` 导航项加可感知差异（如更低 opacity 令牌、右侧「即将推出」小标、或直接不渲染未实现项）。不改令牌，故本轮只记 P2。

订单 /orders：
- ✅（1440）搜索「周雅婷」→ 15 单；无结果 → 空态「没有符合条件的订单」+「清除筛选」→ 731；状态「待发货」→ 63；金额排序三态；选行 → 「已选 N 单」批量条；第 2 页 → `?page=2`。截图 `orders-search-empty-*`、`orders-filter-status-*`、`orders-bulk-bar-*`、`orders-pagination-*`。
- ✅（375）卡片 tap → 抽屉 Sheet `?open=drawer&order=SO-20260906-0108`；「筛选」→ Sheet「筛选订单」→ 选「待发货」→ 底部按钮实时「查看 63 单」→ 应用后「筛选出 63 单」+ 按钮「筛选 · 1」→「清除筛选」→ 731；「下一页」→ `?page=2`。截图 `orders-drawer-mobile-*`、`orders-filter-sheet-*`、`orders-filtered-mobile-*`。
- ✅ `?state=loading / empty-filter / empty-new / error` 四态文案正确（截图 `orders-state-*`）。
- ❌ P2-2 仍复现：第 4 页 `aria-disabled=true`，hover 无 `[role=tooltip]`（1440 两主题）。
- ❌ P2-6 仍复现：375 取消订单确认后焦点落 `body`（1440 回行 ✅）。
- ⚠️ P2-1（日期范围文案）/ P2-3（每页 50 下一页）本轮未重跑（不在复查范围，上轮结论沿用）。

新建采购单 /form：
- ✅ 摘要卡 ¥40,760.00 / ¥41,560.00；第 1 步清空联系人 → 「请填写联系人」+ 焦点回字段、停留第 1 步；第 2 步 → 第 3 步无误报（§1）；条款链接「《采购条款》」→ Dialog「采购条款」→「我知道了」关闭；勾选后错误清除；提交 → 「提交中…」→ Result「采购单已提交」，焦点在「查看采购单」；`?step=3&fail=1` 提交 → Alert「提交失败…」，焦点到「重新提交」；「保存草稿」→ Toast「草稿已保存」；改动后点侧栏「仪表盘」→ AlertDialog「离开页面？」→「放弃并离开」→ 仪表盘；375 显示「第 3 步，共 3 步」。截图 `form-step1-*`、`form-step1-invalid-*`、`form-step2-*`、`form-success-*`、`form-error-*`、`form-leave-dialog-*`。
- ❌ P2-6 仍复现：条款 Dialog「我知道了」关闭后焦点落 `body`（4 组合）。
- ❌ P2-7 仍复现：「再建一张」后联系人仍是「吴丽华」。
- ❌ **P3-6（新增）**：「下一步」进入第 3 步后 `document.activeElement = body`（4 组合实测 `focus=body`；进入第 2 步的焦点未单独记录，推断同源），键盘用户需从页首重新 Tab；建议把焦点放到当前步标题或第一个字段（不阻塞鼠标/触屏用户，记 P3）。
- ⚠️ P2-4（附件类型/大小校验）本轮未重跑。

### 3. P2 / P3 汇总（本轮口径）

P2（8）：
- P2-1 日期范围「开始日期 – 结束日期」点击 Toast「自定义日期范围将在实现阶段提供」内部术语泄漏（上轮，未重测，沿用）。
- P2-2 样本外页码无可见 Tooltip（本轮 1440 复现）。
- P2-3 每页 50 时「下一页」可点无效（上轮，未重测）。
- P2-4 附件类型 / 大小 / 数量无校验反馈（上轮，未重测）。
- P2-5 仪表盘最近订单菜单「查看详情」仍 Toast「后续轮次提供」，与已可达的 /orders 矛盾（本轮复现）。
- P2-6 条款 Dialog 关闭 / 375 取消订单确认后焦点落 body（本轮复现）。
- P2-7 「再建一张」仍是同一张草稿（本轮复现）。
- **P2-8（新）** 侧栏可用项与 `aria-disabled` 项视觉无差别，375 触屏无法预知哪些可点。

P3（7）：
- P3-1 顶栏全局搜索回车无反馈；/orders 与 /form 375 顶栏搜索图标显示不一致（/orders 隐藏、/form 显示）。
- P3-2 form 成功页主按钮「查看采购单」仅 Toast「后续轮次提供」。
- P3-3 form 标签数量无上限提示（上轮，未重测）。
- P3-4 登录成功后后退回 /login，邮箱与「记住我」不保留（本轮复现）。
- P3-5 仪表盘与订单页行菜单项目不一致（上轮，未重测）。
- **P3-6（新）** form 步骤切换后焦点落 body。
- **P3-7（新，由上轮 P1-1 降级）** /form 在应用内仍无入口（侧栏「采购」按 brief §11.10-E 保持禁用），仅可直输 URL；建议下一轮在「采购」实现或至少给仪表盘 / 订单页一个「新建采购单」入口时一并解决。

### 4. 未覆盖（untested，如实标注）
- 上轮 P2-1 / P2-3 / P2-4 / P3-3 / P3-5 本轮未重跑（复查时间盒只覆盖 P1 与主流程）。
- 键盘全程 Tab 顺序 / 焦点环未单独走查，依赖 `a11y.mjs`（§5）。
- 768 / 1024 视口；真实 iOS / Android 浏览器（本轮为 Chromium 触屏模拟）。
- 订单「标记加急 / 打印面单 / 修改地址」、抽屉备注添加、form 附件拖放、日期 Picker 手指操作等次要动作。

### 5. 门禁实跑结果（`apps/reference/`，`~/gates.log`、`~/ux2/a11y-*.log`）
- `pnpm lint` ✅（eslint + no-hardcode：75 个文件通过）
- `pnpm typecheck` ✅
- `pnpm build` ✅（vite 构建成功，仅 chunk > 500 kB warning）
- `node tools/a11y.mjs dashboard` ✅ ALL PASS；`node tools/a11y.mjs form` ✅ ALL PASS（185 PASS / 0 FAIL）；`node tools/a11y.mjs orders` **首跑 2 FAIL**（`mobile/light|dark/success-drawer-logistics 键盘可达 0 个元素`），**复跑 ALL PASS**。独立探针（375 触屏直开 `?open=drawer&order=SO-20260906-0095&tab=logistics`，连按 Tab）实测 Sheet 内依次聚焦「关闭详情 → 物流 → 复制运单号」3 个元素且焦点环均可见，items / remarks 同样可达；结合 a11y.mjs 在 Tab 前先 `mouse.click(1,1)`（375 下会点到 Sheet 遮罩、触发关闭动画）判断首跑 FAIL 为工具时序抖动，**不是产品缺陷**，但写明以便复核（`~/ux2/a11y-orders.log` L214/L307，`~/ux2/a11y-orders-rerun.log`）。
- 说明：本轮未重跑 shoot / compare（像素门禁与本次 P1 行为修复无关，修复提交自述 dashboard 56/56、orders 86/86、form 84/84 ≥ 95%，**此为转述、本轮未复核**）。

本报告只新增/覆写本文件，未改任何产品代码、令牌、hifi、content、mock。

---


## 第 1 轮 · 全量走查（@6f4fe2a，历史存档）


> 角色：roles/legal-research/user-experience-officer（体验官）。
> 对象：`fe01/integration` @ `6f4fe2a50296086d5fae9b6d828a651b7ccdf53c`（`git fetch && git checkout fe01/integration && git merge --ff-only origin/main` → Already up to date，即集成分支已含 main）。
> 范围：本轮合入的 `orders`、`form` 全部核心任务 + 已上线屏 `login`、`dashboard` 回归。`components` / `landing` / `chat` 本轮明确未合入，**不在范围、不计缺失**。
> 方法：`pnpm install --frozen-lockfile && cd apps/reference && pnpm build && pnpm preview --port 4173`（vite preview，base `/apps/reference/`）；Playwright Chromium 1.62.1（复用 `tools/shoot` 锁定版本）以真实用户方式操作：**1440×900 鼠标**（真实坐标 click / hover）与 **375×812 触屏**（`isMobile + hasTouch`，DPR 2，`tap`）× **亮 / 暗**（`prefers-color-scheme`，不带 `?theme=`）= 4 组合。每个组合各跑一遍全部任务；仪表盘上另做一次手动切主题 + 刷新。
> 证据：脚本与日志在仓库外 `~/ux/`（`walk.mjs` 全量走查 → `walk-<combo>.log`；`mprobe.mjs` / `mprobe2.mjs` 375 卡片 / 筛选 Sheet / 分页 / 导航抽屉 → `mprobe*.log`；`probe*.mjs`、`form*.mjs`、`orders.mjs`、`q.mjs` 定向复核）。截图输出到 `shots/ux/<name>-<viewport>-<theme>.png`（**不入库**）。下文「截图」均指该目录。
> 事实分级：✅ 实测通过 · ❌ 实测缺陷 · ⚠️ 未定论 · 「推断」= 读源码得出、未实测。**不改产品代码。**

## 0. 结论

**verdict = fix**（P0 = 0，P1 = 3）。4 组合 console error 均为 0，375 全程 `scrollWidth = 375`，暗色无白块；核心任务（登录、看仪表盘、筛选/排序/批量/详情/取消/删除/撤销订单、三步建采购单并提交）在**直接输入 URL 的前提下**全部可完成，因此无 P0。但存在 3 处明显误导：合入的两屏在应用内**无入口**（侧栏/仪表盘仍说「后续轮次提供」）；订单行菜单里「查看详情 / 取消订单 / 删除订单」点了**静默无反应**；采购单第 3 步一进入就**报错并自动滚到底**。

| 级别 | 数量 | 摘要 |
| --- | --- | --- |
| P0 | 0 | — |
| P1 | 3 | P1-1 orders/form 应用内不可达且提示误导；P1-2 订单行菜单「查看详情/取消订单/删除订单」静默无效；P1-3 form 第 3 步进入即报「还有 1 项需要修正」并自动滚到条款处 |
| P2 | 7 | 自定义日期范围文案泄漏内部术语；样本外分页无可见 Tooltip；每页 50 时「下一页」可点无效；附件类型/大小/数量无校验反馈；仪表盘最近订单菜单「查看详情」仍 stub；条款 Dialog 关闭 / 取消订单 Toast 后焦点丢到 body；「再建一张」仍是同一张草稿 |
| P3 | 5 | 见 §6 |

上一版报告（@aa1a164）的 P2-A「第三方登录静默」与 P2-B「错误 Alert 修改邮箱不清除」**本轮实测已修复**（4 组合：Google/GitHub/微信点击出 Toast「使用 Google 继续 / 后续轮次提供」；修改邮箱后 Alert 清除）。P3「后退回 login 邮箱/记住我不保留」仍复现（见 P3-4）。

## 1. P1（明显粗糙或误导）

### P1-1 已合入的 /orders 与 /form 在应用内没有任何入口，且现有入口都说「后续轮次提供」
- 现象（4 组合一致）：侧栏「订单 63」`aria-disabled=true`、`cursor: not-allowed`，1440 hover Tooltip「后续轮次提供」，点击不跳转；375 导航抽屉里同样禁用，tap 只出 Tooltip「后续轮次提供」（截图 `dashboard-nav-orders-*`、`dashboard-mobile-nav-orders-tap-mobile-*`）。仪表盘「最近订单 → 查看全部」`<a href="/orders" aria-disabled="true">`，点击被 `preventDefault`，hover **无 Tooltip**（什么都不发生，截图 `dashboard-nav-orders-*`）。侧栏「采购」同样禁用；/form 无任何入口。
- 但 `/orders`、`/form` 直接输 URL 均可正常使用，且 /orders 页面里侧栏「订单」高亮为 `aria-current=page` 却仍 `aria-disabled=true`（截图 `orders-default-*`）。
- 影响：真实用户从仪表盘出发**找不到**本轮交付的两个屏幕；「后续轮次提供」对已存在的页面是错误信息。00-brief §导航契约要求实现阶段把已实现项翻为 `implemented: true`；`mock/nav.json` 中 `orders.implemented` 仍为 `false`（推断根因，读 mock 得出）。
- 建议：nav.json 翻 `orders` / `采购`（或 form 所属项）为 implemented；仪表盘 `ViewAll` 改为真实 Link；行菜单「查看详情」跳 `/orders?open=drawer&order=<id>`。

### P1-2 订单行「更多操作」菜单里「查看详情 / 取消订单 / 删除订单」点击后菜单关闭、什么都不发生
- 现象（4 组合，真实坐标 click / tap）：SO-20260906-0107（待付款）菜单 → 「取消订单」：菜单关闭、焦点回「更多操作」，**无 AlertDialog、无 Toast、URL 回到 `/orders`**；「查看详情」同样无抽屉；SO-20260906-0077（已取消）→「删除订单」同样无对话框。「复制订单号」出 Toast「已复制」、「标记发货」正常（说明不是菜单整体失效）。截图 `orders-rowmenu-open-*`、`orders-rowmenu-cancel-result-*`、`orders-menu-cancel-noop-*`。
- 对照：同一订单从**抽屉底部**「取消订单」能正常打开对话框并完成取消；`?open=dialog-cancel&order=…` 深链也正常（§3）。所以取消/删除/详情功能本身存在，只是从行菜单进不去。
- 推断根因（读 `pages/orders/index.tsx`，未改代码验证）：菜单项 `onSelect → doAction → set({open:"dialog-cancel"})` 之后，Radix 菜单关闭触发 `onOpenChange(false) → set({open:null, order:null})` 把刚写入的 overlay 状态覆盖掉；「复制/发货」不写 `open` 所以不受影响。
- 影响：行内三个最常用的深操作全部失效，用户会反复点、怀疑「是不是我没点到」。

### P1-3 采购单第 3 步一进入就出现「还有 1 项需要修正 · 请先阅读并同意《采购条款》」并自动滚到页尾
- 现象（4 组合，1440 与 375 一致；无论从第 2 步点「下一步」进入还是直接 `/form?step=2` 再「下一步」）：进入第 3 步瞬间顶部出现红色 Alert「还有 1 项需要修正 / 查看」，条款复选框下方出现「请先阅读并同意《采购条款》」，焦点被放到 `#terms`，页面 `scrollY` 直接跳到 661（1440）/ 1000（375）——用户**没看到「请核对采购单」的核对内容就被带到底部**并被告知「有错」（截图 `form-step3-entry-*`、`form-step3-full-*`）。深链 `/form?step=3` 直达时则**没有**该 Alert，两种进入方式行为不一致。
- 推断根因：`advance()` 对目标步 `validate(model, 3)` 把 `terms` 标 touched 并 `focusFirstError`。
- 影响：把「尚未做」当「做错了」提示，第 3 步的核对区被跳过；与 brief「全字段内联校验」（用户操作后再报错）不符。

## 2. 登录 /login 回归（4 组合一致）
- ✅ 首焦点邮箱、主题跟随系统、375 无横向溢出；空提交 →「请输入邮箱」「请输入密码」，焦点回邮箱；密码显隐 `aria-pressed` 正确；「30 天内记住我」整行可点。
- ✅ 错误账号：按钮「登录中…」禁用 → Alert「邮箱或密码不正确。连续 5 次失败后账号将锁定 15 分钟。」获焦（截图 `login-error-*`）；**修改邮箱后 Alert 立即清除**（上一版 P2-B 已修）。
- ✅ 第三方按钮点击 → Toast「使用 Google 继续 / 后续轮次提供」（上一版 P2-A 已修）。
- ✅ 正确账号（`ruolin.shen@qimu-home.cn` + 任意 ≥8 位）→ `/?toast=login`，h1「仪表盘」，Toast「欢迎回来，若琳」（截图 `login-success-dashboard-desktop-dark`；亮色组合脚本误用了错误邮箱，成功路径只在暗色 1440 实测，亮色按 mock 规则推断一致）。
- ❌ P3-4 后退回 /login：邮箱为空、「记住我」未勾选。

## 3. 仪表盘 / 回归（4 组合一致）
- ✅ 4 张指标卡（¥1,186,420 …）、图表渲染；切「日」→ `?period=day`，卡片变 ¥42,380；375 无溢出。
- ✅ 顶栏主题按钮 aria-label「切换为暗色 / 亮色」，切换后 `<html data-theme>` 与背景色同步变化，**刷新后保持**（截图 `dashboard-theme-toggled-*`）。
- ✅ 通知铃铛 → 弹层「通知 / 全部标为已读」+ 5 条真实业务通知（截图 `dashboard-notifications-*`）。
- ❌ P1-1（侧栏「订单」、「查看全部」禁用），见 §1。
- ❌ P2-5 最近订单行菜单「查看详情」→ Toast「查看详情 / 后续轮次提供」（1440）；订单屏已合入，该 stub 过期。
- ❌ P3-1 顶栏全局搜索输入「SO-2026」回车：URL 不变、无 Toast、无结果面板（1440）。
- 375：汉堡「打开导航」→ 导航抽屉 8 项，仅「仪表盘」可用（截图 `dashboard-mobile-nav-mobile-*`）。

## 4. 订单 /orders（1440 亮/暗 + 375 亮/暗触屏）

工具栏与列表（1440）：
- ✅ 搜索「周雅婷」→ 「筛选出 15 单，共 731 单」+ 样本 1 行；无结果 → 「筛选出 0 单」+ 空态「没有符合条件的订单 / 试试放宽筛选条件或更换关键词 / 清除筛选」，清除后回 731（截图 `orders-search-empty-*`）。
- ✅ 状态「待发货」→ 63 单；渠道多选 +天猫 → 23 单、触发器变「渠道 · 1」；日期 Popover 三预设带计数，「今天」→ 4 单；「清除筛选」复位全部（截图 `orders-filters-3-*`）。
- ✅ 金额排序 desc → asc → none 三态，`aria-sort` 正确；列显示隐藏「买家」+「恢复默认」。
- ✅ 选 2 单 → 「已选 2 单 / 批量发货 / 导出所选 / 取消选择」，表头复选 `mixed`；批量发货 → Toast「订单 SO-…-0108 已标记发货」（截图 `orders-bulk-bar-*`）；「导出」→ Toast「正在导出 731 单，完成后发送到 ruolin.shen@qimu-home.cn」。
- ❌ P2-1 日期 Popover / 375 Sheet 里「开始日期 – 结束日期」按钮 `cursor: default`、无禁用态，点击 → Toast「**自定义日期范围将在实现阶段提供**」——对最终用户泄漏内部流程术语，且现在就是实现阶段，读起来像已过期（截图 `orders-date-range-click-desktop-light`、`orders-filter-range-mobile-*`）。

抽屉（4 组合）：
- ✅ 点行 / 375 tap 卡片 → 右侧 480px 抽屉（375 底部 Sheet 占 715px，带拖柄）`?open=drawer&order=…`，焦点进抽屉；商品 / 物流 / 备注 Tab；「物流」待发货显示「尚未发货，暂无物流信息」，发货后「物流信息同步中」；「备注」空态「还没有备注」，空文本时「添加备注」禁用，输入后添加 → Toast「已添加备注」、列表出现「沈若琳 09-06 17:30 …」、输入框清空；底部「标记发货 / 标记加急 / 取消订单」375 下固定可见（截图 `orders-drawer-goods-*`、`orders-drawer-mobile-mobile-*`、`orders-drawer-remark-added-*`）。
- ✅ 抽屉「标记发货」→ Toast + 抽屉内状态即时变「已发货」；Esc 关闭后焦点回到对应行（1440）；深链 `?open=drawer&order=SO-…-0095&tab=logistics` 直接打开并选中「物流」，「复制」单号 → Toast「已复制」（截图 `orders-drawer-deeplink-*`）。
- ⚠️ 375 关闭抽屉后焦点落在 `body`（1440 回行）——触屏无键盘影响小，不计缺陷。

对话框 / Toast（4 组合）：
- ✅ 取消订单 Dialog：未选原因点「确认取消」→ 下拉 `aria-invalid` 红边、焦点留在下拉；选原因后 → Toast「订单 SO-…-0107 已取消」、行状态变「已取消」、1440 焦点回该行（截图 `orders-dialog-cancel-*`、`orders-dialog-cancel-invalid-*`、`orders-after-cancel-*`）。
- ✅ 删除订单 Dialog：文案「删除后订单将从列表与报表中移除，不可恢复。仅已取消订单可删除。」默认焦点「返回」；删除 → 行消失 + Toast「订单 SO-…-0077 已删除 / 撤销」；点「撤销」→ 行回来（截图 `orders-toast-deleted-*`、`orders-after-undo-*`）。
- ❌ P1-2 行菜单入口失效（§1）。
- ❌ P2-6 取消/删除确认后焦点落到 `body`（375 两组合；1440 删除后同样落 body，取消后回行）。

分页（4 组合）：
- ✅ 「第 1–20 条，共 731 条」、每页 10/20/50、页码 1 2 3 4 … 37；第 2 页 → `?page=2` 数据换页并滚到表头；第 4 页与第 37 页 `aria-disabled`、`cursor: not-allowed`、aria-label「第 4 页，演示样本只包含前 3 页」（读屏可知）；375 只显示范围 + 上一页/下一页 40×40，下一页 → `?page=2` 正常（截图 `orders-pagination-*`、`orders-mobile-pagination-mobile-*`）。
- ❌ P2-2 样本外页码 hover / focus / 点击均**无可见 Tooltip、无 Toast**（1440 两主题实测 `[role=tooltip]` 为空），明眼用户只看到「灰掉点不动」不知为何；brief 要求 Tooltip `orders.pagination.sampleOnly`（截图 `orders-p4-hover-*`、`orders-p4-tap-*`）。
- ❌ P2-3 每页 50 → 「1 2 … 15」，「下一页」未禁用，点击后 URL/范围不变。

375 卡片化：
- ✅ 卡片 = 复选（16px 视觉、伪元素热区 40×40，`elementFromPoint` 五点实测均命中）+ 主体按钮 245×108（aria-label「订单 SO-…，待发货，¥4,276.00，查看详情」）+ 更多 40×40；选 1 单出现批量条（截图 `orders-mobile-bulk-mobile-light`）。
- ✅ 「筛选」→ 全屏 Sheet「筛选订单」：状态单选（带计数）/ 日期单选 / 渠道多选，底部「清除筛选 / 查看 N 单」随选择实时变 63 → 9 → 4；应用后 Sheet 关闭、按钮变「筛选 · 3」、列表 4 张卡（截图 `orders-filter-sheet-filled-mobile-*`、`orders-filtered-mobile-mobile-*`）。
- ⚠️ 375 无排序、无全选入口（brief 未要求，仅记录）。

状态（4 组合，`?state=`）：
- ✅ loading「正在加载订单」骨架；empty-filtered 保留筛选条 + 「筛选出 0 单，共 108 单」+ 清除筛选；empty-new「还没有订单 / 接入销售渠道后，订单会每 15 分钟自动同步到这里 / 接入渠道（aria-disabled + Tooltip 后续轮次提供）」；error「订单加载失败 / 网络连接异常，请检查网络后重试 / 重试」→ 点重试进 loading（`aria-busy`）→ success 出数据（截图 `orders-state-*`）。
- ✅ 「新建订单」`aria-disabled` + Tooltip「后续轮次提供」（与 brief 一致，不计）。

## 5. 新建采购单 /form（1440 亮/暗 + 375 亮/暗触屏）
- ✅ 三步 Stepper「基本信息 / 商品与配送 / 确认提交」+「第 N 步，共 3 步」；右侧（375 顶部）摘要卡 PO-20260906-003 · 商品合计 ¥40,760.00 · 运费预算 ¥400–¥800 · 预计总额 ¥41,560.00（截图 `form-step1-*`）。
- ✅ 第 1 步清空联系人点「下一步」→ 顶部 Alert「还有 1 项需要修正 / 查看」+ 字段「请填写联系人」，焦点回该字段，停在第 1 步；备注 205 字失焦 →「备注不超过 200 字」（截图 `form-step1-invalid-*`、`form-remark-overflow-*`）。
- ✅ 第 2 步商品行数量 60→61 → 小计与「预计总额」即时复算 ¥42,040.00；删除行按钮 40×40；SKU Combobox 可搜；日期 Picker 弹出（1440 320px / 375 298px 居中），选早于常规交期出黄色提示「早于供应商常规交期（18 天），请确认已与供应商沟通」（非阻塞，合理）；运费区间双滑块拇指 24px；标签 Chip 可增删（截图 `form-step2-*`、`form-date-open-*`）。
- ✅ 第 3 步：核对卡 4 块各带「修改」；条款链接 → Dialog「采购条款」→「我知道了」关闭；勾选后 Alert 消失、「提交采购单」可点 → 「提交中…」`aria-busy` → 成功 Result「采购单已提交 / PO-20260906-003 已发送给 东阳樟里木艺（吴丽华），预计 2026-09-24 上午到达杭州仓 / 已发送至 sales@zhangli-wood.cn / 查看采购单 · 再建一张」，焦点在「查看采购单」（截图 `form-terms-dialog-*`、`form-loading-*`、`form-success-*`）。
- ✅ `?fail=1` 提交 → Alert「提交失败：网络超时，采购单已保存为草稿，请重试 / 重新提交」，焦点到「重新提交」（截图 `form-error-*`）。
- ✅ 有改动离开（点侧栏「仪表盘」）→ AlertDialog「离开页面？ 采购单尚未提交，离开后填写内容将丢失 / 继续填写 · 放弃并离开」→ 放弃后到 `/`（截图 `form-leave-dialog-*`）。
- ✅ 「保存草稿」→ Toast「草稿已保存」。
- ❌ P1-3 第 3 步进入即报错（§1）。
- ❌ P2-4 附件：提示「支持 PDF / XLSX / JPG / PNG，单个不超过 10 MB，最多 5 个」，但拖入 `evil.exe` 与 11 MB `big.pdf` 均显示「已上传」，第 6 个文件被静默丢弃无提示（1440 亮实测，`form-files-*`）。原生 `accept` 只约束文件选择器，拖放绕过；源码 `addFiles` 无类型/大小校验、超量只 `slice` 不提示（推断）。mock 里预置的「整柜装箱视频.mp4 不支持的文件类型」说明设计上有该错误态，但真实操作触发不到。
- ❌ P2-7 「再建一张」回到第 1 步，但联系人等字段仍是刚提交的那张草稿（吴丽华…），标题仍「PO-20260906-003 将在提交后生成」——「新建」与「上一张」无法区分。
- ❌ P2-6 条款 Dialog「我知道了」关闭后焦点落到 `body`（4 组合），键盘用户丢位。
- ❌ P3-2 成功页「查看采购单」→ Toast「后续轮次提供」（可接受，但主按钮做成 primary 显得可点）。
- ❌ P3-3 标签输入无上限/去重反馈：连续加到 10 个标签无任何提示（brief 未定上限，记 P3）。
- ⚠️ 375 全页截图里中段出现「跳到主内容」浮层与吸底操作条（`form-step3-full-mobile-light`）——为 fullPage 截图对 fixed 元素的绘制方式所致，视口内实操未见，不计缺陷。

## 6. P3 汇总
- P3-1 仪表盘顶栏全局搜索回车无任何反馈；且 /orders 页顶栏搜索框被隐藏，两页顶栏不一致。
- P3-2 form 成功页主按钮「查看采购单」仅 Toast「后续轮次提供」。
- P3-3 form 标签数量无上限提示。
- P3-4 登录成功后后退回 /login，邮箱与「记住我」不保留。
- P3-5 仪表盘最近订单行菜单（查看详情 / 标记发货 / 打印面单 / 取消订单）与订单页行菜单（查看详情 / 复制订单号 / 取消订单）项目不一致。

## 7. 未覆盖（untested，如实标注）
- 1440 亮色组合的登录**成功**路径（脚本误用邮箱，只在 1440 暗色实测成功；375 两组合同样只测了失败路径）。
- 键盘全程走查（Tab 顺序 / 焦点环）本轮未单独做，仅依赖 `a11y.mjs` 门禁结果（§8）。
- 768 / 1024 视口（任务只要求 1440 / 375）。
- 订单「标记加急」「打印面单」、抽屉内「修改地址」等次要动作；form「修改」按钮回跳到对应步的行为；`?state=invalid` 直达态；375 下 form 的日期 Picker 手指操作细节。
- 真实 iOS/Android 浏览器（本轮为 Chromium 触屏模拟）。

## 8. 门禁实跑结果（`apps/reference/`，`~/ux/gates.log`）
- `pnpm lint` ✅（eslint + no-hardcode：75 个文件通过）
- `pnpm typecheck` ✅
- `pnpm build` ✅（vite 构建成功，仅 chunk 体积 warning）
- `node tools/no-hardcode.mjs` ✅ 75 文件通过
- `node tools/shoot.mjs / compare.mjs / a11y.mjs`：
  - login：shoot 28 张；compare 28/28 最低 98.15% ≥ 95%；a11y ALL PASS
  - dashboard：shoot 58 张；compare 56/56 最低 98.41%；a11y ALL PASS
  - orders：shoot 86 张；compare 86/86 最低 96.36%；a11y ALL PASS
  - form：shoot 84 张；compare 84/84 最低 96.85%；a11y ALL PASS
- 说明：门禁全绿与本报告 P1 并不矛盾——门禁只覆盖像素相似度 / axe / 热区 / 焦点环 / console，不覆盖「入口是否可达」「点击后是否有结果」「进入步骤时是否误报错」这类行为，需体验走查补足。

本报告只新增/覆写本文件，未改任何产品代码、令牌、hifi、content、mock。
