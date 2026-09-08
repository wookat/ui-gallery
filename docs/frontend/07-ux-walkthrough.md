# 07 · 体验官走查报告（第 2 轮复查）

> 角色：roles/legal-research/user-experience-officer（体验官）。
> 对象：`fe01/integration` @ `c7e47e6f3dabfba441ecf95ed8ef4aa316c2490e`（login + dashboard 合入后、第 1 轮 P1 修复后）。
> 目的：复验第 1 轮（对 `0b3c2e7e`）的 1 个 P0 / 2 个 P1 是否修复，并记录本轮新发现。**不改产品代码。**
> 方法：`pnpm install --frozen-lockfile && pnpm build && pnpm preview --port 4173`，以 Playwright Chromium（`tools/shoot` 固定的 1.62.1）**模拟真实用户**：1440×900 鼠标 / 375×812 触屏（`isMobile+hasTouch`，DPR 2，一次 tap）× 亮/暗（走 `prefers-color-scheme`，不带 `?theme=`），每组合从 `/login` 开始按 brief 5 个核心任务走一遍。共 4 组合 × 约 70 个检查点；另做 2 个补充探针脚本核对可疑项。脚本与日志在仓库外 `~/ux/walk.mjs`、`~/ux/probe*.mjs`，截图输出 `shots/ux/*.png`（不入库）。

## 0. 结论

**verdict = fix**（有 1 个 P1）。

| 级别 | 数量 | 摘要 |
| --- | --- | --- |
| P0 | 0 | 第 1 轮 P0（登录后落到 kitchen-sink）已修：4 组合登录成功均落 `/?toast=login` 仪表盘 |
| P1 | 1 | **P1-新1** 订单「更多操作」菜单里点任一项（如「标记发货」）菜单不关闭、无任何反馈（鼠标/触屏/键盘 Enter 三种输入均复现） |
| P2 | 5 | 第三方登录按钮静默无响应；全局搜索（1440 输入回车 / Ctrl K、375 放大镜）无任何反应但顶栏展示 `Ctrl K` 快捷键提示；头像菜单前 4 项静默关闭；错误 Alert 在改邮箱后不清除；`?theme=` 链接下手动切主题刷新被弹回 |
| P3 | 6 | 详见 §3 |

第 1 轮遗留复验：

| 第 1 轮编号 | 现象 | 本轮结果 |
| --- | --- | --- |
| P0-1 | 登录成功落到 `/kitchen-sink` | **已修**。4 组合均 `→ /apps/reference/?toast=login`，h1「仪表盘」，Toast「欢迎回来，若琳」约 3 s 后消失 |
| P1-1 | 空表单首次点「登录」无反应 | **已修**。4 组合首次 click/tap 即出「请输入邮箱」「请输入密码」并回焦邮箱（`onMouseDown preventDefault` 生效） |
| P1-2 | 登录后浏览器后退，login 停在「登录中…」锁死 | **已修**。后退回 `/login` 按钮为「登录」、字段可编辑；前进回仪表盘正常 |
| 上轮预检 P1（dashboard 分支） | 刷新丢尾斜杠导致静态托管 404 | **未复现**。切周后刷新 `/apps/reference/?period=week` 仍渲染仪表盘且保持「周」 |

## 1. 走查矩阵与覆盖

| 组合 | login 任务 1 | dashboard 任务 2–5 | 状态 | 备注 |
| --- | --- | --- | --- | --- |
| 1440 亮 | ✅ | ✅ | login default/invalid/loading/error(invalid/locked/network)/success；dashboard success/loading/empty/error + 重试 | 键盘 Tab 顺序、焦点环、Tabs 方向键、rail/expanded、Ctrl K、跳到主内容 |
| 1440 暗 | ✅ | ✅ | 同上 | 同上 |
| 375 亮（触屏） | ✅ | ✅ | 同上 | 抽屉开关/遮罩/Esc、放大镜、订单卡、Toast 与顶栏关系、375×420 键盘弹起 |
| 375 暗（触屏） | ✅ | ✅ | 同上 | 同上 |

未走到（如实标 untested）：768/1024 视口；真实 iOS Safari / Android Chrome（仅 Chromium 触屏模拟）；屏幕阅读器实际朗读；`?state=success` 之外的 login 截图状态 URL 直达（用户路径不经过）。

## 2. 核心任务逐条结果

### 任务 1 · 用工作邮箱进入团队空间（login）
- 打开即聚焦邮箱、主题跟随系统偏好（4/4）。375 `scrollWidth = 375`。
- 空表单点登录 → 两字段错误 + 焦点回邮箱（P1-1 已修）。失焦校验文案「邮箱格式不正确，例如 name@example.com」「密码至少 8 位」，输入即清除（4/4）。
- 密码显隐 40×40 热区、`aria-pressed` 正确；「30 天内记住我」整行 label 热区 ≥40（4/4）。
- 「忘记密码？」「免费注册」「服务条款」「隐私政策」：`aria-disabled` + `cursor: not-allowed`，点击不跳转不 404（4/4）。
- 错误账号 → 按钮「登录中…」禁用、字段只读，URL 不带 `state=loading`（P1-2 根因已除）→ Alert「邮箱或密码不正确。连续 5 次失败后账号将锁定 15 分钟。」并把焦点移到 Alert（4/4）。锁定账号 / 断网 → 对应 Alert；断网 Alert 带「重试」，恢复网络点重试 → 登录中 → 成功（4/4）。
- 成功 → `/?toast=login` 仪表盘 + Toast，3 s 自动消失；375 下 Toast 位于顶栏之下（y≈70，汉堡 y 8–48）不遮挡（2/2）。
- 后退不锁死（P1-2 已修）。
- 1440 Tab 顺序：邮箱 → 密码 → 显示密码 → 记住我 → 忘记密码？ → 登录 → Google → GitHub → 微信 → 免费注册 → 品牌 → 服务条款 → 隐私政策；焦点环可见。

### 任务 2 · 看经营概览并切日/周/月
- 默认「月」：¥1,186,420 / 2,964 单 / 待发货 63 / 库存预警 12，较上期 +9.4% / +5.1% / −21 / +4；问候「下午好，若琳」与「数据更新于 今天 17:30」一致（4/4）。
- 切「日」→ 副标题「按销售额，今日」，统计卡 ¥42,380 / 108；「周」→「近 7 天」¥286,940 / 731；URL `?period=` 同步，刷新保持（4/4）。Tabs 热区 1440 64×40、375 109×40 四向全命中。1440 方向键可切换。

### 任务 3 · 判断趋势与渠道结构
- 折线+柱状趋势图与环形图在 4 组合均渲染，375 不溢出；环形图副标题随周期变化。sr-only 数据表 30 行可供读屏。
- **untested**：图表 hover / 触摸 tooltip 与键盘漫游（探针脚本在此项前中断，未拿到一手结果，不下结论）。

### 任务 4 · 处理最近订单
- 5 行订单（1440 表格 / 375 卡片）；首单「待发货」菜单 4 项全可用，第 2 单「待付款」正确禁用「标记发货」「打印面单」（4/4）。「更多操作」按钮 40×40 热区，菜单 Esc 关闭并回焦按钮。
- ❌ **P1-新1**：点「标记发货」（或任何一项）后菜单仍打开（`data-state=open`、触发器 `aria-expanded=true`）、无 Toast/状态变化/确认；键盘 Enter 选择同样；再点触发器才关闭。见 §3。
- 「查看全部」`aria-disabled` 不跳转（4/4）。

### 任务 5 · 团队动态、任务进度、通知
- 团队动态、任务进度卡片渲染。
- 铃铛 `aria-label`「通知，3 条未读」；Popover 5 条 + 「全部标为已读」+ 「查看全部通知」；标为已读后角标消失；Esc 关闭并回焦铃铛；375 Popover 不出视口（4/4）。
- 头像菜单：沈若琳 / 邮箱 + 5 项；「退出登录」→ `/login`（4/4）。
- 状态：loading 骨架 `aria-busy` + 视觉隐藏「正在加载仪表盘数据」，应用壳照常；empty「还没有经营数据」+ 2 个 CTA、铃铛无角标、侧边栏无角标、工作区「未命名团队」；error「数据加载失败」+ 错误码 503 + 「重试」→ loading → success 并把焦点交给当前 Tab（4/4）。
- 未知路径 `/orders`、`/nope` 落回仪表盘不 404。
- console error / HTTP ≥400 = 0（4/4）。

## 3. 问题清单

### P1

**P1-新1 · 订单操作菜单选项点击后菜单不关闭、无任何反馈**
- 复现：`/` → 首单「更多操作」→ 点「标记发货」（或「查看详情」「打印面单」「取消订单」）。鼠标 1440、触屏 375、键盘（Enter 打开 → ↓ → Enter）三种方式均复现，亮/暗一致。
- 现象：菜单保持 `open`，触发器 `aria-expanded=true`，焦点停在菜单项 `div`；无 Toast、无行状态变化、无确认对话；用户会认为「点不动」。再点一次触发器才关闭；Esc 可关闭。
- 影响：核心任务 4「订单状态操作」的唯一交互出口给用户错误信号；与 brief「操作菜单」的预期不符（即使本轮不做真实业务，也应关闭菜单并给「后续轮次提供」类反馈）。
- 疑似根因（供实现者核对，未改代码）：`SuccessView` 中 `open={menu === key || undefined}` 让同一 `DropdownMenu` 在受控 / 非受控间切换；选项 `onSelect` 触发 Radix 关闭时 `onOpenChange(false)` 把 `menu` 置 `null` 后 `open` 变回 `undefined`（非受控），Radix 内部状态仍为 open。建议改成 `open={menu === key}` 固定受控，并给 4 个选项加与「后续轮次提供」一致的反馈。
- 截图：`shots/ux/dash-order-menu-{desktop,mobile}-{light,dark}.png`（菜单打开态）、`shots/ux/probe-order-after-select-D.png`（点「标记发货」750 ms 后菜单仍开）。

### P2

**P2-新1 · 第三方登录 3 个按钮完全静默**
- Google / GitHub / 微信按钮为可用态（`cursor: default`、无 `aria-disabled`），点击无 Toast、无提示、无跳转（4/4）。同页其他「本轮不可达」项都给了 `not-allowed` 光标；这三个看起来能点却什么都不发生，最容易被当作 bug。brief 说「本轮只做视觉」，建议至少统一为 `aria-disabled + not-allowed` 或给「后续轮次提供」Toast。
- 截图：`shots/ux/login-default-*.png`。

**P2-新2 · 全局搜索是「死」控件，却展示 `Ctrl K` 快捷键**
- 1440：输入「SO-2026」回车无任何结果/提示；按 `Ctrl+K` 焦点仍在 body（4/4 桌面组合）。375：放大镜 IconButton 点按无反应（无输入框、无弹层）。顶栏 `Kbd` 提示 `Ctrl K` 暗示可用，属误导。建议：隐藏快捷键提示或接一个「后续轮次提供」反馈；375 放大镜同理。
- 截图：`shots/ux/dash-search-desktop-*.png`、`shots/ux/dash-search-mobile-mobile-*.png`。

**P2-新3 · 头像菜单「个人资料 / 账号安全 / 切换团队空间 / 帮助中心」静默关闭**
- 4 项均为可用态，点击只关闭菜单、无反馈（「个人资料」4/4 验证；其余 3 项按同源代码路径推断，未逐项实测 → untested）。与导航项的 Tooltip「后续轮次提供」不一致。
- 截图：`shots/ux/dash-account-*.png`。

**P2-新4 · 登录错误 Alert 在用户修改邮箱后仍停留**
- 密码错误 Alert 出现后改邮箱，Alert 不清除（4/4）；字段级错误是「输入即清除」，两者行为不一致，用户可能以为新输入仍是错的。需点「关闭」或再提交才消失。
- 截图：`shots/ux/login-error-live-*.png`。

**P2-新5 · 带 `?theme=` 的链接下手动切主题，刷新被弹回**
- 打开 `/?theme=light` → 点主题切换变暗 → 刷新 → 回到亮（4/4）。`?theme=` 优先级高于 localStorage 是设计约定（截图用），但用户从带参数的分享链接进入后会遇到「切了又变回来」。建议手动切换时把 `?theme=` 从 URL 移除。
- 截图：`shots/ux/dash-theme-toggled-*.png`。

### P3

- **P3-新1** `document.title` 恒为「Acme Console」，login / dashboard 无页面名，标签页与历史记录无法区分（4/4）。
- **P3-新2** 「30 天内记住我」勾选后登录，后退回 login 邮箱为空、复选未勾（4/4）；mock 阶段可接受，但与文案承诺不一致。
- **P3-新3** 375 抽屉的关闭按钮 `aria-label` 为「收起侧边栏」（抽屉语境应为「关闭导航」）；抽屉内点禁用项弹出 Tooltip 后需按两次 Esc 才关抽屉（首次关 Tooltip）。纯净抽屉 Esc 一次即关（untested：仅 tooltip 场景实测 2/2）。
- **P3-新4** 「跳到主内容」按 Enter 后 `location.hash = #main` 但 `document.activeElement` 仍为 body（`main` 无 `tabindex=-1`），键盘用户下一 Tab 不从主内容开始（2/2 桌面）。
- **P3-新5** login `?state=success` 直达 URL 停留在 login 显示成功态，而 brief 定义 success = 跳 `/?toast=login`；仅影响截图/联调，用户路径不经过（4/4）。
- **P3-新6** 1440 Tab 顺序里品牌 Link 可聚焦但指向 `/login` 自身，多一个无意义停靠点（2/2）。

## 4. 门禁运行结果（`apps/reference/`，本机实跑）

| 命令 | 结果 |
| --- | --- |
| `pnpm install --frozen-lockfile` | 通过（pnpm 11.9.0） |
| `pnpm build` | 通过（`tsc -b && vite build`，✓ built） |
| `pnpm lint` | 通过（eslint 0 错；`no-hardcode: 47 个文件通过`） |
| `pnpm typecheck` | 通过 |
| `node tools/a11y.mjs login` | ALL PASS |
| `node tools/a11y.mjs dashboard` | ALL PASS（含 success-drawer 等状态，console error = 0） |
| `node tools/shoot.mjs` / `compare.mjs` | 未跑（本轮为体验走查，视觉回归由 06 负责；截图用自有脚本输出到 `shots/ux/`） |

## 5. 截图索引（`shots/ux/`，不入库；`{combo}` = `desktop-light | desktop-dark | mobile-light | mobile-dark`）

- login：`login-default-{combo}.png`、`login-empty-submit-{combo}.png`（P1-1 复验）、`login-invalid-live-{combo}.png`、`login-loading-live-{combo}.png`、`login-error-live-{combo}.png`、`login-error-locked-live-{combo}.png`、`login-error-network-live-{combo}.png`、`login-state-success-{combo}.png`、`login-focus-ring-desktop-*.png`
- 流程：`flow-after-login-{combo}.png`（P0 复验）、`flow-back-after-login-{combo}.png`（P1-2 复验）
- dashboard：`dash-success-{combo}.png`、`dash-success-full-{combo}.png`、`dash-week-{combo}.png`、`dash-notifications-{combo}.png`、`dash-theme-toggled-{combo}.png`、`dash-account-{combo}.png`、`dash-rail-desktop-*.png`、`dash-search-desktop-*.png`、`dash-skip-link-desktop-*.png`、`dash-drawer-mobile-*.png`、`dash-search-mobile-mobile-*.png`、`dash-order-menu-{combo}.png`、`dash-loading-{combo}.png`、`dash-empty-{combo}.png`、`dash-error-{combo}.png`
- 探针：`probe-order-after-select-D.png`（P1-新1）
- 日志：`shots/ux/walk-log.txt`（每检查点 PASS/FAIL + 实测值）

## 6. 建议下一步

1. 修 P1-新1（订单菜单受控态 + 选项反馈），回归时用键盘 Enter 与 375 tap 各验一次。
2. 统一「本轮不可达」交互反馈策略：第三方登录、全局搜索、头像菜单前 4 项、订单菜单项 → 同一种（`aria-disabled + not-allowed` 或 Toast「后续轮次提供」）。
3. P2-新4 / P2-新5 为小改；P3 可并入下一轮。
