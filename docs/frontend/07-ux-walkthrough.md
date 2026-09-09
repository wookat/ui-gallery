# 07 · 体验官走查报告

> 本文件按轮次自上而下叠加：**第 4 轮复查（当前结论）** 在前，第 3 轮全量走查、第 2 轮复查、第 1 轮全量走查保留在后作为历史与原始描述。

---

## 第 4 轮 · 复查（第 3 轮 P1×4 修复复验 + 主流程回归）

> 角色：roles/legal-research/user-experience-officer（体验官）。
> 对象：`fe01/integration` @ `9fed979`（`git fetch && git checkout fe01/integration && git merge --ff-only origin/main` → Already up to date）。该提交 = 第 3 轮报告之后的修复提交「fix(frontend): 体验官第 3 轮走查 P1×4——顶栏助理入口全局默认渲染、更新密码三段校验、联系销售不可达 + 降级二次确认、来源 Chip 可达跳转」。
> 范围（时间盒 30 分钟，按任务只做两件事）：① 逐条复验第 3 轮 P1-1 ~ P1-4；② 回归主流程（登录 → 仪表盘 → 订单 → 采购单 → settings 五 Tab → landing → chat）。`components` 本轮明确未合入，不在范围、不计缺失。**不再全量探索**，上轮 P2/P3 只顺带记录是否仍复现。
> 方法：`pnpm install --frozen-lockfile`（根，exit 0）→ `apps/reference`：`pnpm lint && pnpm typecheck && pnpm build`（均 exit 0）→ `pnpm preview --port 4173`（base `/apps/reference/`）。Playwright 1.62.1（复用根 `tools/shoot` 依赖，Chromium headless-shell 1234）以真实用户方式操作：**1440×900 鼠标**（真实坐标 click / hover）与 **375×812 触屏**（`isMobile + hasTouch`，DPR 2，`tap`）× **亮 / 暗**（`prefers-color-scheme`）= 4 组合，每组合跑同一脚本 `~/ux4/walk.mjs`（仓库外），日志 `~/ux4/run-<viewport>-<theme>.{out,log}`；定向复核 `~/ux4/probe.mjs`（375 触屏禁用态提示对照）、`~/ux4/probe2.mjs`（「联系销售」各状态计算色）。截图 `~/ux4/shots/<viewport>-<theme>/<序号>-<name>.png`，4 组合共 84 张 + probe 1 张（**不入库**）。下文「截图」均指该目录。
> 事实分级：✅ 实测通过 · ❌ 实测缺陷 · ⚠️ 未定论 · 「推断」= 读源码得出、未实测。**不改产品代码。**

### 0. 结论

**verdict = fix**（P0 = 0，**P1 = 1**）。第 3 轮 4 条 P1 的**行为**在 4 组合下均已修复：/、/orders、/settings、/form 顶栏都有 40×40 的「智能助理」入口且可达 /chat；更新密码三段校验（当前密码必填 → 三条规则 → 两次一致）逐段拦截、只在全过时 Toast；「联系销售」不再改套餐、「降级」有二次确认且 Toast 改为「周期结束后生效」；来源 Chip 点击落到 `/orders?open=drawer&order=…` 并打开抽屉，不可达来源（库存快照）`aria-disabled` + Tooltip。但 P1-3 的修复**引入一处明显视觉缺陷**：「联系销售」按钮 hover / active 时背景色与文字色完全相同（亮 `rgb(21,92,86)` / 暗 `rgb(123,200,187)`），**按钮文字消失成一块色块**；375 触屏 tap 后 `:hover` 粘住，按钮持续无字、且 Tooltip 不出现——用户点了一个空色块、得不到任何反馈。主流程 4 组合回归 0 ❌，console error 0，375 全程无横向溢出，`a11y.mjs settings / chat` ALL PASS。

| 级别 | 数量 | 摘要 |
| --- | --- | --- |
| P0 | 0 | — |
| P1 | 1 | **P1-5（新，由 P1-3 修复引入）**「联系销售」hover / active / 375 tap 后文字不可见（bg = fg），375 tap 亦无 Tooltip |
| P2 | 3 项本轮实测仍复现 + 1 新增 | 上轮 P2-9（新会话发送被带回 c_1、用户消息不回显）仍复现；P2-13 焦点丢失新增两处（降级对话框「取消」/「确认降级」后焦点落 `body`）；P2-8 侧栏可用/禁用无差别仍在；**P2-16（新）** 用户点「降级」打开的确认框不写入 `?open=downgrade`（直开 URL 可用，刷新/分享后丢失） |
| P3 | 1 新增 | **P3-14（新）** 顶栏 5 个纯图标按钮（含新增的「智能助理」）hover 均无 Tooltip，仅靠 aria-label；上轮 P3 系列未重测、沿用 |

### 1. 上轮 P1 逐条复验（4 组合：1440 亮 / 1440 暗 / 375 亮 / 375 暗）

| 上轮编号 | 现象 | 本轮结果 | 证据 |
| --- | --- | --- | --- |
| P1-1 应用内无「智能助理」入口 | ✅ **已修复**。`/`、`/orders`、`/settings`、`/form` 顶栏均有 `a[href=/chat]`（`aria-label=智能助理`）、可见、热区 40×40，位于搜索与通知之间（与 IA §11-A 一致）；点击 → `/chat`，/chat 页该按钮 `aria-current=page`。/form 有未保存改动时点它 → 「离开页面？」AlertDialog，「放弃并离开」→ /chat（`beforeLeave` 已接上）。 | 4 组合日志 `P1-1 *` 6/6 ✅；截图 `02-topbar-assistant`、`03-chat-from-topbar` |
| P1-2 更新密码不校验就报成功 | ✅ **已修复**。① 三字段全空 → 无 Toast，当前密码 `aria-invalid=true` + 内联「请输入当前密码」，焦点到 `#pwCur`；② `oldpass123` / `a` / `a` → 无 Toast，新密码 `aria-invalid` + 「新密码需满足下方全部密码要求」，焦点 `#pwNew`；③ `Abcdef12!` / `Abcdef12?` → 「两次输入的密码不一致」；④ 三项合规 → 「保存中」→ Toast「密码已更新，其他设备需重新登录」。输入后对应错误即时清除（`aria-invalid` 去掉、错误文案消失）。 | 4 组合 `P1-2 *` 4/4 ✅；截图 `07-pw-empty` ~ `10-pw-ok` |
| P1-3 「联系销售」直接换套餐；降级无确认且说「升级即时生效」 | ⚠️ **行为已修复，但引入 P1-5**。行为：「联系销售」`aria-disabled=true`、`cursor: not-allowed`、1440 hover Tooltip「企业版由销售顾问定制报价，后续轮次提供在线联系」，force 点击后无 Toast、专业版仍是「当前计划」；「降级到入门版」→ AlertDialog「降级到入门版？／当前专业版（年付）将在本周期结束后切换为入门版，超出入门版限额的成员与功能届时停用。」默认焦点「取消」；「确认降级」→ Toast「已安排降级到入门版（年付），于当前周期结束后生效」，当前套餐不变（入门版卡按钮仍是「降级到入门版」）；`?open=downgrade` 直开可用。**视觉**：见 §2 P1-5。 | 4 组合 `P1-3 *` 3/3 ✅（行为）；截图 `11-billing-default`、`12-billing-contact-tip`（❌ 色块）、`13-billing-downgrade-dialog`、`14-billing-after-downgrade`、`15-billing-open-downgrade-direct` |
| P1-4 来源 Chip 像链接但点不动 | ✅ **已修复**。c_1 五个 Chip：3 个订单 Chip `href=/orders?open=drawer&order=SO-…`、无 `aria-disabled`；点「SO-20260905-0115」→ URL `/orders?open=drawer&order=SO-20260905-0115`，右侧抽屉（375 Sheet）打开且首行即该订单号 / 待发货 / 马晓彤。2 个「库存快照 09-06 17:30」→ `/inventory` 未实现 → `aria-disabled=true`、`cursor: not-allowed`、hover / 375 tap 均出 Tooltip「后续轮次提供」、URL 不变。c_2 / c_3 的 4 个订单 Chip 同样全部改写为可达路径。 | 4 组合 `P1-4 *` 4/4 ✅；截图 `04-chat-sources`、`05-orders-drawer-from-chip`、`06-chat-source-disabled-tip` |

### 2. P0 / P1（新增）

**P1-5 「联系销售」按钮 hover / active 时文字消失（背景色 = 文字色）；375 触屏 tap 后持续无字且无任何提示** ❌
- 路由 `/settings?tab=billing`；1440 + 375；亮 + 暗（4 组合一致）。
- 步骤（1440）：滚到「更换计划」→ 鼠标移到企业版卡「联系销售」→ 按钮从浅绿底深绿字变成**整块深绿色、看不到任何字**（Tooltip 同时出现）；按住鼠标更深一档，仍无字。（375）tap 该按钮 → 按钮变成整块深绿色块、**无字**、无 Tooltip、无 Toast、套餐不变；`:hover` 在触屏上粘住，直到点别处才恢复。
- 实测计算色（`probe2.mjs`）：亮色 default `bg rgb(213,239,234) / fg rgb(21,92,86)` → hover `bg rgb(21,92,86) / fg rgb(21,92,86)`（对比度 1:1）→ active `bg rgb(19,74,70) / fg rgb(21,92,86)`；暗色 default `bg rgb(8,35,31) / fg rgb(123,200,187)` → hover `bg rgb(123,200,187) / fg rgb(123,200,187)` → active `bg rgb(173,223,214) / fg rgb(123,200,187)`。375 tap 后 `matches(':hover')=true`，`bg=fg=rgb(21,92,86)`。
- 影响：计费页是付费决策路径，一个「按钮悬停即变成无字色块」是明显粗糙；375 上还叠加「点了没有任何反馈」——同页的侧栏禁用项、landing 不可达 CTA 在 375 tap 都会出 Tooltip（`probe.mjs` 对照 ✅），只有这个按钮不出，且它长得是 primary 强调样式。定 P1（明显粗糙），不是 P0（不影响任何任务完成，套餐未被改动）。
- 推断（源码）：修复提交给该 Button 传了 `className="… bg-primary-soft text-on-primary-soft hover:bg-primary-soft active:bg-primary-soft …"` 试图覆盖 primary 变体，但 `ui/button.tsx` primary 变体写的是 `hover:not-disabled:bg-primary-hover` / `active:not-disabled:bg-primary-active`（变体不同、特异性更高，页面层的 `hover:bg-primary-soft` 覆盖不了），背景仍走 primary 深色，而文字色被改成 `on-primary-soft`（= primary 色阶本身），于是 bg = fg。建议改用 `variant="secondary"` 或 `primary-soft` 变体（若存在），不要在页面层用 className 拼一套按钮外观（AGENTS「屏幕实现只组合这些件，不在页面里重写控件外观」）；375 tap 出 Tooltip 的行为可参照 landing `TipLink`（`<a>` 触发器在触屏聚焦即开）。
- 证据：截图 `*/12-billing-contact-tip.png`（4 组合，深绿无字色块），`probe-contact-tap.png`；日志 `run-mobile-*.log` `联系销售 … tooltip=[]`、`probe2.mjs` 输出。

### 3. P2 / P3（本轮口径）

P2：
- **P2-9 仍复现**（4 组合）：`/chat?state=empty` 输入「杭州仓现在还有多少件床头柜？」→ 发送 → URL `?state=streaming&conversation=c_1`，气泡 6 条、用户消息出现 0 次（截图 `20-chat-sent`）。
- **P2-13 新增两处**（4 组合）：降级 AlertDialog「取消」后焦点落 `body`（`跳到主内容` 链接之前）；「确认降级」后焦点亦落 `body`——与上轮「继续编辑 / 移除成员 / 危险区确认」同源。
- **P2-8 仍在**：侧栏可用（订单 / 设置）与 `aria-disabled` 项视觉同灰（截图 `01-dashboard`）。
- **P2-16（新）**：用户点「降级到入门版」打开的确认框只存在本地状态，URL 保持 `/settings?tab=billing`（不写 `?open=downgrade`）；直开 `?open=downgrade` 可用。刷新即丢失、无法分享。推断与 settings 其他浮层（`openLocal`）同一实现，故只记 P2、建议统一在 06 notes 说明「?open= 仅作入口」或全部同步。
- 上轮 P2-10 / P2-11 / P2-12 / P2-14 / P2-15 及 P2-5 ~ P2-7 本轮未重跑（复查时间盒只覆盖 P1 与主流程）。

P3：
- **P3-14（新）**：1440 顶栏 5 个纯图标按钮（打开导航 / 智能助理 / 通知 / 切换主题 / 账号）hover 均无 Tooltip（`hover tooltip=[]`），新增的「智能助理」入口对首次用户只有一个星形图标、无法得知含义；建议给顶栏 IconButton 统一加 Tooltip（landing Footer 社交 IconButton 已有此做法）。
- 上轮 P3-8 ~ P3-13 未重测、沿用。

### 4. 主流程回归（4 组合一致，除注明）
- ✅ 登录 `ruolin.shen@qimu-home.cn` / 任意 ≥ 8 位 → `/?toast=login`，h1「仪表盘」，Toast「欢迎回来，若琳」。
- ✅ 仪表盘周期「日」→ `?period=day`；主题按钮 `data-theme` 切换（light↔dark）。
- ✅ /orders h1「订单」；1440 搜索「周雅婷」→ 「筛选出 15 单，共 731 单」；首行菜单「查看详情」→ `?open=drawer&order=SO-20260906-0108`，Esc 后 URL 干净；375 「筛选」Sheet 打开。
- ✅ /form 第 1 → 2 → 3 步 `role=alert` 0、当前步「3 确认提交」；未勾条款提交 → alert 2、焦点 `#terms`；勾选后提交 → 「采购单已提交」。（P3-6 进入第 3 步焦点 `body` 仍在。）
- ✅ settings：profile 改名 → Toast「个人资料已保存」；notifications 25 个 Switch；team 5 行；`?open=2fa` Dialog。
- ✅ landing h1「把全渠道订单和库存，装进一个后台」；滚动后 header `data-state=scrolled`；`?cycle=yearly` 价格 ¥990 / ¥2,990（折合 ¥82.50 / ¥249.17 / 月）。
- ✅ chat：375 「打开会话列表」→ `?open=sidebar`。
- ✅ 375 全程 `scrollWidth = 375`；4 组合 console error = 0。

### 5. 未覆盖（untested，如实标注）
- 「联系销售」**键盘聚焦**是否出 Tooltip：`probe2.mjs` 程序化 `focus()` 后 400 ms 内 `[role=tooltip]` 为 0（⚠️ 可能是 Radix 对程序化聚焦的判定，未用真实 Tab 键复核）。
- 上轮 P2-10 ~ P2-15、P3-8 ~ P3-13 未重跑；orders 取消 / 删除 / 撤销、form 失败态 / 草稿 / 离开确认、settings 团队邀请 / 危险区、landing FAQ / 汉堡菜单、chat 流式 / 错误态 本轮未重走（第 3 轮已覆盖、本轮修复未触及）。
- 768 / 1024 视口；真实 iOS / Android 浏览器；读屏软件。
- 未重跑 shoot / compare（像素门禁与本次行为修复无关；修复提交自述 compare 五屏 ≥ 95%，**此为转述、本轮未复核**）。

### 6. 门禁实跑结果（`apps/reference/`，`~/gates.log`、`~/ux4/a11y-*.out`）
- `pnpm install --frozen-lockfile` ✅ exit 0
- `pnpm lint` ✅ exit 0（eslint + no-hardcode：79 个文件通过）
- `pnpm typecheck` ✅ exit 0
- `pnpm build` ✅ exit 0
- `node tools/a11y.mjs settings` ✅ ALL PASS；`node tools/a11y.mjs chat` ✅ ALL PASS（对比度检查基于静态态，未覆盖 hover 态，故未捕获 P1-5）。

本报告只新增本文件的本节，未改任何产品代码、令牌、hifi、content、mock；脚本、截图与日志留在 `~/ux4/`，不入库。

---

## 第 3 轮 · 全量走查（settings / landing / chat 新屏 + login / dashboard / orders / form 回归）

> 角色：roles/legal-research/user-experience-officer（体验官）。
> 对象：`fe01/integration` @ `39016c7`（任务指定的 `1afe7d577d4aebbec8eb7910404befeb01c46801` 在分支历史内；起点 `git fetch && git checkout fe01/integration && git merge --ff-only origin/main` → Already up to date）。
> 范围：本轮合入的 `settings` / `landing` / `chat` 全部核心任务 + 已上线屏 `login` / `dashboard` / `orders` / `form` 回归。`components` 本轮明确未合入，**不在范围、不计缺失**。
> 方法：`pnpm install --frozen-lockfile`（根）→ `apps/reference`：`pnpm lint && pnpm typecheck && pnpm build` → `pnpm preview --port 4173`（base `/apps/reference/`）。Playwright（复用根 `tools/shoot` 锁定版本，Chromium headless-shell）以真实用户方式操作：**1440×900 鼠标**（真实坐标 click / hover / 键盘）与 **375×812 触屏**（`isMobile + hasTouch`，DPR 2，`tap`）× **亮 / 暗** = 4 组合，每屏每组合各跑一遍全部任务。脚本与日志在仓库外 `~/ux-walk/`（`settings.mjs` + `settings2.mjs` → `settings*.out`；`landing.mjs` → `landing.out`；`chat.mjs` → `chat.out`；`regress.mjs` → `regress.out`；`probe.mjs` 定向复核 → `probe.out`；结构化日志 `walk.log`）。截图 `~/ux-walk/shots/<screen>/<viewport>-<theme>-<序号>-<name>.png`，共 384 张（**不入库**）。下文「截图」均指该目录。
> 事实分级：✅ 实测通过 · ❌ 实测缺陷 · ⚠️ 未定论 · 「推断」= 读源码得出、未实测。**不改产品代码。**

### 0. 结论

**verdict = fix**（P0 = 0，**P1 = 4**）。三个新屏的核心任务在 4 组合下均能走通（无 P0），375 全程无横向溢出，console error 除剪贴板权限（环境因素，见 §5）外为 0，`a11y.mjs settings / landing / chat` 三屏 ALL PASS。但有 4 处**明显误导用户**的问题：应用内根本找不到「智能助理」入口；空/弱密码也提示「密码已更新」；点「联系销售」直接把套餐改成企业版并宣称「升级即时生效」；来源 Chip 长得像链接、有 href 却点不动。

| 级别 | 数量 | 摘要 |
| --- | --- | --- |
| P0 | 0 | — |
| P1 | 4 | P1-1 /chat 应用内无入口；P1-2 改密码不校验就报成功；P1-3 「联系销售」= 直接换套餐 + 降级也说「升级」；P1-4 来源 Chip 不可点 |
| P2 | 8 | 新会话发送被带回 c_1、375 会话落在最旧消息、附件第二次点报「超过 10 MB」、语言 Select 无效、继续编辑/移除成员焦点丢失、重复保存 Toast 叠加、危险区确认后焦点落 body、上轮 P2-5/P2-6/P2-7/P2-8 仍复现 |
| P3 | 6 | 375 Tab 条被裁无滚动提示、Toast 关闭按钮英文 aria-label、375 邀请需点两次、撤回邀请无二次确认、停止生成无「已停止」提示、上轮 P3 系列 |

### 1. P0 / P1（每条：路由 · 视口 · 主题 · 复现步骤 · 证据）

**P1-1 应用内没有任何「智能助理」入口，/chat 只能手输 URL** ❌
- 路由 `/`、`/orders`、`/settings`、`/form`；1440 + 375；亮 + 暗（4 组合一致）。
- 步骤：登录 → 仪表盘顶栏逐个数可点元素 → 只有「打开导航 / 全局搜索 / 通知 / 切换主题 / 账号菜单」，**无**「智能助理」；侧栏 8 项也没有；/orders、/settings 顶栏同样为 0。只有已经在 `/chat` 页时顶栏才出现高亮的助理图标（`aria-current=page`）。
- 影响：brief §11.10-E / IA §11-A 明确「chat 入口 = 顶栏助理 IconButton，放在搜索与通知之间」，brief 核心任务「用一句话查订单库存」的起点不可达。真实用户完全不知道有助理。参照第 1 轮 P1-1（/orders 无入口）同口径定 P1。
- 推断（源码）：`pages/dashboard/shell.tsx` 仅当传入 `assistant` prop 时渲染该按钮，而只有 `pages/chat/index.tsx` 传了它。
- 证据：`regress.out` 4 组合 `[issue] 仪表盘顶栏「智能助理」入口数=0；顶栏可点元素=[…]`；`settings2.out` / `chat.out` 同类 issue；截图 `regress/*-dashboard-topbar.png`。

**P1-2 「更新密码」不校验：三个字段全空 / 新密码「a」也提示「密码已更新，其他设备需重新登录」** ❌
- 路由 `/settings?tab=security`；1440 + 375；亮 + 暗（4 组合一致）。
- 步骤：① 三个密码框都不填 → 点「更新密码」→ 转「保存中」→ 绿色 Toast「密码已更新，其他设备需重新登录」。② 当前密码 `old`、新密码 `a`、确认 `a` → 「密码要求」三条规则全部是未满足的空圈 → 点「更新密码」→ 仍 Toast「密码已更新」，焦点落 `body`。
- 影响：成功反馈与页面上「至少 8 位 / 包含大小写字母 / 包含数字或符号」的规则自相矛盾，用户会以为改成了一个不合规的密码；也没有「当前密码必填」的提示。settings 保存虽是本地模拟，但校验是前端职责。
- 推断（源码）：`submitPassword` 只比对 `next !== confirm`，表单 `noValidate`，字段无 `required` 分支；规则列表仅作展示。
- 证据：`settings.out` 4 组合 `[issue] 密码表单全空直接提交 → toast=["密码已更新…"]`；`probe.out` `弱密码 a/a：规则=[…:x,…:x,…:x] → toast=["密码已更新…"]`；截图 `probe/desktop-light-02-weak-password-toast.png`、`probe/mobile-light-04-weak-password-toast.png`、`settings/*-security-*.png`。

**P1-3 计费：点「联系销售」直接把当前套餐改成企业版；「降级」无二次确认，且 Toast 一律写「升级即时生效」** ❌
- 路由 `/settings?tab=billing`；1440 + 375；亮 + 暗（4 组合一致）。
- 步骤：① 当前「专业版 · 年付」→ 切到月付 → 企业版卡按钮「联系销售」→ 点击 → Toast「已切换到企业版（月付），升级即时生效」，卡片按钮立刻变成「当前计划」，专业版卡变「降级到专业版」。② 再点入门版「降级到入门版」→ **无确认框**，直接 Toast「已切换到入门版（月付），升级即时生效」。
- 影响：文案说「联系销售」，行为却是改计费方案并声称即时生效——对付费操作是最严重的一类误导；「降级」用「升级」文案是明显粗糙。content/settings.md 只定义 `billing.plan.toast = 已切换到{plan}（{cycle}），升级即时生效` 一条，IA §10 写「联系销售 → 本轮不可达」，实现与 IA 不一致。
- 证据：`settings.out` 4 组合 `[issue] 点「联系销售」→ toast=["已切换到企业版（月付），升级即时生效"…]`、`[issue] 点「降级」→ 无二次确认…`；截图 `settings/*-billing-*.png`。

**P1-4 助手消息下的来源 Chip「订单 SO-20260905-0115」像链接（有 href、cursor: pointer）但点了没有任何反应** ❌
- 路由 `/chat?conversation=c_1`；1440 + 375；亮 + 暗（4 组合一致）。
- 步骤：滚到 c_1 最后一条助手消息 → 「来源」行的 Chip → click / tap → URL 不变、无 Tooltip、无 Toast、无抽屉；`aria-disabled` 也没有。
- 影响：IA §11 写「来源 Chip SO-… → /orders?open=drawer&id=… ✔ 可达」，brief §11.10-G 也把 `/orders/:id` 定义为来源 Chip 的目标。这是「问助理 → 顺手去改单」链路的关键一跳，现在是死链但没有任何禁用反馈（对比 landing / 侧栏的 `aria-disabled` + Tooltip 约定）。
- 推断（源码）：`Sources` 里 `onClick={(e) => e.preventDefault()}`；另 `href=/orders/SO-…` 直开会落到 `/`，而 `/orders?open=drawer&order=SO-…` 实测能打开抽屉——即目标本身可达，只差没接上。
- 证据：`chat.out` 4 组合 `[issue] 来源 Chip「订单 SO-20260905-0115」href=/orders/SO-20260905-0115 点击后 URL 变化=false tooltip=0 toast=[] aria-disabled=null cursor=pointer`；`直开 /orders/SO-20260903-0087 → 落到 /apps/reference/`；截图 `chat/*-sources-*.png`。

### 2. P2 / P3

P2（8）：
- **P2-9 chat 新会话发送后被带回 c_1，且自己刚打的话没出现在消息流**（`/chat?state=empty`，4 组合）：点「新建会话」→ 输入「杭州仓现在还有多少件床头柜？」→ 发送 → URL 变 `?conversation=c_1&state=streaming`，消息流显示的是「上周缺货最多的 SKU」那 6 条旧消息 + 半截流式回复，**用户消息 0 条**。IA §11 把「发送 → streaming（c_1 回放）」定义为 mock，故只记 P2；但至少应把用户消息回显，否则像发错了会话。证据 `chat.out` `[issue] 新会话发送…我的消息出现在消息流=0；气泡数=6`；截图 `chat/*-sent-*.png`。
- **P2-10 375 打开会话落在最早一条消息，最新回复与输入框在首屏下方 ~1000px，没有「回到底部」**（`/chat`，375 亮/暗）：IA 决定 I「375 输入区随内容流末尾」，但进入会话后页面 `scrollY=0`，最后一条气泡 top=1350px、输入区 top=1870px；1440 有的「回到底部」按钮在 375 从不出现。推断：`stick()` 对 375 下 `overflow-visible` 的消息容器调 `scrollTo` 无效。证据 `probe.out` `375 chat 首屏…`；截图 `probe/mobile-light-05-chat-mobile-first-screen.png`。
- **P2-11 chat「添加附件」第二次点直接报「文件超过 10 MB」**（4 组合）：没有选任何文件就出现大小错误，是把演示错误态绑在了第二次点击上。证据 `chat.out` `[issue] 再点一次「添加附件」→ …=1`。
- **P2-12 landing Footer 语言 Select 切「繁體中文」无任何变化**（4 组合）：value 变 zh-TW，页面 `lang`/文案仍 zh-CN，无 Toast，也没像其他不可达链接那样 `aria-disabled` + 提示。证据 `landing.out` `切换语言 → value=zh-TW toast=[] 页面语言变化=zh-CN`。
- **P2-13 settings 焦点丢失**（4 组合）：改姓名后切 Tab → 「有未保存的更改」→「继续编辑」→ 焦点落 `body`；团队「移除成员」确认后焦点落 `body`；危险区输入确认后焦点落 `body`（页面仍在；是否有 Toast 脚本未记录 ⚠️）。证据 `settings.out` / `settings2.out` `继续编辑后焦点=body`、`移除后焦点=body`、`危险区确认后焦点=body…页面仍在=true`。
- **P2-14 无改动重复点「保存」Toast 叠加**（4 组合）：个人资料无任何改动连点保存 → 两条「个人资料已保存」同时挂着；团队页连续操作后右上角最多 4 条 Toast 叠成一列（截图 `settings/*-team-*.png`）。
- **P2-15 「管理订阅」滚动落点被顶栏遮住**（1440 + 375）：点「管理订阅」→ 页面滚到「更换套餐」标题 top=0，而顶栏高 56px，标题被吸顶顶栏遮住半截，焦点还留在「管理订阅」按钮上。证据 `probe.out` `管理订阅 2.5s 后：套餐标题 top=0 顶栏高=56`；截图 `probe/*-manage-plan-landing.png`。
- 上轮 **P2-5**（仪表盘最近订单「查看详情」Toast「后续轮次提供」）、**P2-6**（条款 Dialog 关闭后焦点 body，本轮 375 亮/暗复现）、**P2-7**（「再建一张」联系人仍是吴丽华，375 复现）、**P2-8**（侧栏可用/禁用项视觉无差别，`设置` 已可点后仍是同一灰）本轮回归**仍复现**。

P3（6）：
- **P3-8 375 settings 顶部 Tab 条被裁切且无滚动提示**：tablist `scrollWidth=564 > 375`，「账号安全」左侧被切一半，没有渐隐/箭头暗示可横滑（活动 Tab 会自动滚入视口 ✅）。截图 `probe/mobile-light-06-invite-tap-once.png`。
- **P3-9 Toast 关闭按钮 aria-label 为英文「Close toast」**（sonner 默认，全站）：读屏用户听到英文。
- **P3-10 375 邀请成员：输入邮箱后直接 tap「发送邀请」要点两次**：第一次只把输入转成 Chip、不发送、无 Toast；第二次才发送（1440 一次即可）。证据 `probe.out` `375 邀请输入不回车 tap 发送 → toast=[] 待接受含 newbie=0`→`再 tap 一次…toast=["已向 1 位成员发送邀请"]`。
- **P3-11 撤回邀请无二次确认、无撤销**（4 组合）：与「移除成员」有确认框不一致。
- **P3-12 chat 点「停止生成」后没有「已停止生成」之类提示**（4 组合）：按钮变回「发送」、URL 去掉 `state=streaming`，无任何文字说明刚才的生成被中止。
- **P3-13 landing 定价三卡 CTA、Hero「免费试用 14 天 / 预约演示」全部 `aria-disabled`**：IA 定义为「本轮不可达」，hover / tap 均有 Tooltip「演示站点，链接不可用」✅，仅记录为演示站的体验断点；上轮 P3-1 ~ P3-7 未重测、沿用。

### 3. 已走通的核心任务（✅，4 组合一致，除注明）

settings：5 个 Tab（1024+ 竖向 `aria-orientation=vertical`、375 横向可滚）与 `?tab=` 同步；个人资料改名 → 「保存中」→ Toast「个人资料已保存」；改动后切 Tab → 「有未保存的更改」→「放弃并离开」焦点回目标 Tab；两步验证 `?open=2fa` 6 格 OTP（活跃会话「退出该设备」按钮仅看截图、未点击）；通知 25 个 Switch + 4 项接收方式 Segmented（`?channel=email` 只留 2 列）+ 免打扰开关联动时间字段禁用；团队邀请（重复邮箱提示、角色变更 Toast、重新发送、撤回、席位进度条、`?state=empty` 席位 1）；计费 `切换计费周期` Switch ↔ `?cycle=`、三卡价格随周期变化、发票「下载」Toast「后续轮次提供」；危险区输入不匹配时确认按钮禁用；`?state=error` Alert「保存失败：网络超时，请重试 / 重试」；侧栏「设置」已可点、`/settings` 页 `aria-current=page`；账号菜单「个人资料 / 账号安全」分别落到对应 Tab。Switch 视觉 36×20 但热区扩展实测有效（375 在视觉框外 8px tap 仍切换），**不计缺陷**。

landing：header 滚动后吸顶（`data-state=scrolled`，亮 `#fff` / 暗 `rgb(23,28,28)`）；5 个导航锚点落点 top=80 未被 header 遮挡；1440 header 主题按钮即时切换；定价 Switch 月 ¥99/¥299/¥899 ↔ 年 ¥990/¥2,990/¥8,990（折合 ¥82/¥249/¥749，「省 2 个月」）与 `?cycle=` 同步，点「按月付」文字也能切；FAQ 6 项单开、可全收起、键盘 Enter 可展开且焦点环可见；375 汉堡 40×40 → Sheet 焦点到「关闭菜单」、菜单含 7 链接 + 主题切换、点「定价」自动关 Sheet 并落到 #pricing、关闭后焦点回「打开菜单」；Footer 链接 `aria-disabled` + Tooltip；375 无横向溢出。

chat：`?state=empty` 空态 4 张建议卡点击后填入输入框并聚焦；会话 7 个（今天 3 / 本周 2 / 更早 2、1 未读）、搜索「退款」1 条 / 无结果文案、c_1↔c_2 切换（URL 同步）、会话菜单「重命名 / 删除会话」；`c_6` 历史不可用态 + 「回到最近会话」；`?state=loading` 骨架；成功态工具卡展开/收起、表格 375 卡内横滚 + 「左右滑动查看更多」、代码块复制按钮；`?state=streaming` 光标 + running 工具卡 + 「停止生成」；`?state=error` Alert「回复失败 / 重试 / 忽略」，忽略清除、重试进 streaming；模型 Select（button `aria-haspopup=listbox`）两项可切；Shift+Enter 换行；2000 字上限时发送禁用并提示「消息不超过 2000 字」；`/加急/` 消息触发「已发送」Toast；375 「打开会话列表」Sheet + `?open=sidebar`；删除会话确认框文案完整、删除当前会话后落到 c_1；1440 composer Tab 顺序到「发送」。

回归（login / dashboard / orders / form）：登录空提交/错误账号/成功 → Toast「欢迎回来，若琳」；周期「日」→ `?period=day`；通知弹层「全部标为已读」+ 5 条通知；主题切换；最近订单「查看全部」→ /orders；1440 搜索「周雅婷」15 单 / 无结果空态 / 金额排序 / 行菜单查看详情抽屉 + Esc 焦点回行 / 取消订单（未选原因 `aria-invalid`）/ 已取消行「删除订单」→ 删除 + 撤销 ✅ / 下一页；375 筛选 Sheet「查看 63 单」/ 卡片 tap 抽屉 / 下一页；form 第 1 步联系人必填 → 第 2 → 第 3 无误报 → 未勾条款 2 alert 焦点到 `#terms` → 条款 Dialog → 提交成功焦点「查看采购单」→ `?fail=1` 失败 Alert 焦点「重新提交」→ 保存草稿 Toast → 改动后离开确认框 → 放弃并离开；settings 有未保存改动时点侧栏「仪表盘」有「离开页面？」确认（375 亮）。

### 4. 未覆盖（untested，如实标注）
- **1440 form 回归只走到「未勾条款提交 → alert=2」**：脚本 force-click 条款链接误点导致后续 6 步（条款 Dialog / 提交成功 / 失败 / 草稿 / 再建 / 离开确认）1440 亮暗**未走查**（375 亮暗已走完；第 2 轮 1440 结论沿用，非产品缺陷）。
- **375 暗色**最后一步「settings 未保存改动 → 跨页离开确认」未走到（脚本旧选择器超时）；375 亮已验证。
- 上轮 P2-1 / P2-2 / P2-3 / P2-4 / P3-1 ~ P3-5 未重跑。
- landing 6 评价、数据带、CTA 横幅只看截图无交互；chat 「重新生成 / 有帮助 / 没帮助」反馈按钮、会话重命名；settings 头像上传、活跃会话「退出其他所有设备」的 Toast 文案未逐字核对。
- 768 / 1024 视口；真实 iOS / Android 浏览器；读屏软件。

### 5. 门禁实跑结果（`apps/reference/`）
- `pnpm install --frozen-lockfile` ✅ exit 0
- `pnpm lint` ✅ exit 0（eslint + no-hardcode：79 个文件通过）
- `pnpm typecheck` ✅ exit 0
- `pnpm build` ✅ exit 0（仅既有 dynamic-import / chunk > 500 kB warning）
- `node tools/a11y.mjs settings` ✅ ALL PASS（437 PASS）；`node tools/a11y.mjs landing` ✅ ALL PASS（69 PASS）；`node tools/a11y.mjs chat` ✅ ALL PASS（357 PASS）——日志 `~/ux-walk/a11y-{settings,landing,chat}.out`。
- console error：4 组合全程仅 chat 复制按钮触发 `NotAllowedError: Failed to execute 'writeText' on 'Clipboard': Write permission denied.`（headless 环境未授剪贴板权限，**判为环境因素、非产品缺陷**；但按钮同时弹「已复制」Toast，真实环境若权限被拒也会误报成功——记入 P3 备查，未单列）。其余 0。
- 375 全程 `document.documentElement.scrollWidth = 375`，无横向溢出（`walk.log` 无 overflow 记录）。
- 本轮未重跑 shoot / compare（像素门禁与体验走查无关）。

本报告只新增本文件的本节，未改任何产品代码、令牌、hifi、content、mock；截图与日志留在 `~/ux-walk/`，不入库。

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
