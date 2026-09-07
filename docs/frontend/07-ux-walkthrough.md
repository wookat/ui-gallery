# 07 · 体验官走查（UX Walkthrough）

走查对象：`fe01/integration` @ `0b3c2e7e425d2a2f301df8b7bf03589ca0d20f91`（merge: fe01/screen-login → fe01/integration）
角色：roles/legal-research/user-experience-officer（体验官）　只走不改：本报告不含任何产品代码改动。
日期：2026-09-07　运行方式：`apps/reference/` 下 `pnpm install --frozen-lockfile && pnpm build && pnpm preview --port 4173 --host 127.0.0.1`，Chromium（Playwright 1.62.1，复用根 `tools/shoot`）以真实用户路径逐步点按，1440×900 鼠标 + 375×812 触屏模拟（`isMobile + hasTouch`，DPR 2），亮 / 暗各一遍。

## 0. 结论

**verdict：fix**（存在 P0）

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 1 | dashboard（`/`）在本提交不存在：`/`、`/?state=*`、`/?toast=login`、登录成功后全部落到组件总览 `/kitchen-sink`。brief 两条核心任务之一（「打开即知今天生意如何」）无法完成，登录任务也无法闭环。 |
| P1 | 2 | ① 邮箱为空时首次点「登录」被吞掉（布局位移把按钮从手指下移开），375 触屏 100% 复现。② 登录成功后按浏览器「后退」回到 `/login?state=loading`，表单永久锁死在「登录中…」。 |
| P2 | 5 | 见 §3 |
| P3 | 4 | 见 §3 |

login 屏本身（表单、校验、五态、亮暗、375、键盘、热区、文案）质量高，`node tools/a11y.mjs login` 全绿，console error = 0。阻塞项集中在「集成」而非「实现」：dashboard 屏的实现已存在于 `fe01/screen-dashboard@f221e98` 但**尚未合回集成分支**；本报告 §5 附了对该分支的预检，供合入后的复走参考（不计入本次 verdict）。

## 1. 走查矩阵

| 屏 | 任务 / 状态 | 1440 亮 | 1440 暗 | 375 亮 | 375 暗 |
|---|---|---|---|---|---|
| login | 默认态渲染、文案、层级 | ✅ | ✅ | ✅ | ✅ |
| login | 空表单提交 → 双字段错误 + 焦点到邮箱 | ⚠ P1-1（按钮上半部无效） | ⚠ P1-1 | ❌ P1-1（首次点按无效） | ❌ P1-1 |
| login | 失焦校验（格式 / 长度） | ✅ | ✅ | ✅ | ✅ |
| login | 密码显隐（40×40，aria-pressed，标签切换） | ✅ | ✅ | ✅ | ✅ |
| login | 30 天记住我 | ✅ 可勾选（P3-3：无任何持久化） | ✅ | ✅ | ✅ |
| login | 忘记密码 / 免费注册 / 服务条款 / 隐私政策 | 点击 & Enter 均不跳转（brief 定义不可达；P2-4 缺解释） | 同 | 同 | 同 |
| login | Google / GitHub / 微信 | 点击零反馈（P2-3） | 同 | 同 | 同 |
| login | 提交中（禁用 + spinner + 只读） | ✅ 900ms | ✅ | ✅ | ✅ |
| login | 密码错误 → Alert 聚焦、文案 | ✅ | ✅ | ✅ | ✅ |
| login | 锁定账号 `locked@qimu-home.cn` | ✅ | ✅ | ✅ | ✅ |
| login | 断网提交 → 网络 Alert + 「重试」 | ✅ 重试可用 | ✅ | ✅ | ✅ |
| login | `?state=success` | ⚠ P2-1：停留在 login，未按 brief 跳 `/?toast=login` | 同 | 同 | 同 |
| login → dashboard | 正确账号登录 → 仪表盘 + Toast「欢迎回来，若琳」 | ❌ P0-1（落到 /kitchen-sink，无 Toast） | ❌ | ❌ | ❌ |
| login | 登录后浏览器后退 | ❌ P1-2 | ❌ | ❌ | ❌ |
| dashboard | 默认 / loading / empty / error / success / period / toast | ❌ P0-1（路由不存在） | ❌ | ❌ | ❌ |
| 通用 | 375 横向溢出（scrollWidth ≤ 375） | — | — | ✅ 375 | ✅ 375 |
| 通用 | console error | 0 | 0 | 0 | 0 |
| 通用 | Tab 顺序 / 焦点环 | ✅ 品牌→邮箱→密码→显隐→记住我→忘记密码→登录→3 OAuth→注册→条款→隐私 | ✅ | ✅ | ✅ |

## 2. 走查脚本与证据（不入库）

- 走查日志：`shots/ux/walk-log.txt`（每一步的 URL、DOM 断言、热区实测）；复现脚本 `~/ux/walk.mjs`、`~/ux/repro.mjs`、`~/ux/repro2.mjs`（仓库外，不入库）。
- 截图目录：`shots/ux/`（`.gitignore` 已排除 `shots/**/*.png`），命名 `<屏>-<状态>-<desktop|mobile>-<light|dark>.png`：
  - `login-default-*.png` 五态 × 4 组合：`login-{default,invalid,loading,error,error-locked,error-network,success}-{desktop,mobile}-{light,dark}.png`
  - 真实交互：`flow-empty-submit-*`（空提交）、`flow-blur-invalid-*`（失焦校验）、`flow-loading-live-*`（真实提交中）、`flow-error-invalid-live-*`、`flow-error-network-live-*`、`flow-focus-ring-*`（键盘焦点环）、`flow-after-login-*`（**登录成功后的落点，即组件总览页**）
  - dashboard 路由：`dashboard-{default,loading,empty,error,login,day,week}-*`（全部为 `/kitchen-sink` 组件总览的截图，证明路由缺失）
  - 复现专用：`repro-mobile-first-tap-1.png`（375 首次点「登录」后：只出现邮箱错误、按钮呈按下态、未提交）、`repro-back-after-login.png`（后退后卡死的「登录中…」）、`repro-landing-mobile.png`（375 访问 `/?toast=login` 的落点）

## 3. 问题清单

### P0

**P0-1 · dashboard 屏在本提交不存在，`/` 及所有仪表盘状态回退到 `/kitchen-sink` 组件总览**
- 现象：访问 `/`、`/?state=loading|empty|error|success`、`/?period=day|week`、`/?toast=login`，以及用正确账号 `ruolin.shen@qimu-home.cn` 登录成功后，浏览器地址均变为 `/apps/reference/kitchen-sink`，页面 h1 = 「组件总览」，没有 Toast「欢迎回来，若琳」。四个视口 × 主题组合 100% 复现。对不存在的路径（`/orders`、`/dashboard`、`/nope`）同样回退到 kitchen-sink，用户无法从 URL 判断发生了什么。
- 影响：brief 的两条核心任务，「用工作邮箱进入团队空间」在最后一步落到一个内部组件清单页，「打开即知今天生意如何」完全不可达；真实用户会认为登录跳错页或产品未上线。
- 根因（源码核对，非猜测）：`apps/reference/src/app.tsx` 用 `import.meta.glob("./pages/*/index.tsx")` 自动注册路由，`fallback = pages.find(p => p.path === "/") ?? pages[0]`；本提交 `src/pages/` 下只有 `kitchen-sink/` 与 `login/`，没有 `dashboard/`，于是 `pages[0]`（kitchen-sink）成为兜底。`git log origin/fe01/screen-dashboard` 显示 dashboard 实现已在 `f221e98`，但未合入 `fe01/integration`。
- 建议（交项目负责人）：把 `fe01/screen-dashboard` 合回 `fe01/integration` 后**重新走查**；同时为「未知路径」提供明确 404 或跳 `/`，而不是静默落到 kitchen-sink（kitchen-sink 应只作内部基准，不应成为终端用户可见的兜底页）。
- 截图：`shots/ux/flow-after-login-desktop-light.png`、`shots/ux/dashboard-default-mobile-light.png`、`shots/ux/repro-landing-mobile.png`

### P1

**P1-1 · 邮箱为空时首次点「登录」无效（375 触屏必现；1440 点按钮上半部亦复现）**
- 步骤：打开 `/login`（邮箱自动聚焦，两字段为空）→ 直接点「登录」。
- 现象：邮箱下方出现「请输入邮箱」，按钮短暂呈按下态，但**没有提交**：密码字段无错误、焦点未移到邮箱、URL 无变化；再点一次才正常。375 触屏两轮（自动聚焦 / 手动聚焦）均复现；1440 鼠标点按钮垂直中心可成功，点按钮上沿 8px 处失败。
- 根因：邮箱 `onBlur` 即校验并插入一行 `FieldError`（约 25px），整张表单向下位移，`pointerup`/`touchend` 落点已不在按钮上，`click` 未触发。这是「失焦校验 + 无预留错误行高度」的典型交互缺陷。
- 影响：手机用户第一次点登录「没反应」，是明显的粗糙感；误导用户以为按钮坏了。
- 建议：三选一——错误行预留固定高度（`min-height`）避免位移；或对「从未输入过的空字段」不在 blur 时报必填、只在提交时报；或在 blur 时若 `relatedTarget` 是提交按钮则延后校验。
- 截图：`shots/ux/repro-mobile-first-tap-1.png`

**P1-2 · 登录成功后按「后退」回到 `/login?state=loading`，表单永久锁死**
- 步骤：正确账号登录（成功跳转）→ 浏览器后退。
- 现象：地址为 `/apps/reference/login?state=loading`，按钮显示「登录中…」且禁用，所有字段只读，spinner 永远转，没有任何方式恢复（只能手改 URL）。
- 根因：`submit()` 用 `set({ state: "loading" })` 把 loading 写进 URL（`replace: true` 覆盖了干净的 `/login` 记录），随后 `navigate("/?toast=login")` push 新记录；后退时 URL 携带的 `state=loading` 被 `useScreenState` 当作真实状态渲染，而并没有正在进行的提交。
- 建议：loading 只作组件内瞬态（不写 URL），或成功跳转时对 login 记录 `navigate(..., { replace: true })`；同时 `?state=loading` 进入时若无进行中的提交应自动回落 default。
- 截图：`shots/ux/repro-back-after-login.png`

### P2

**P2-1 · `?state=success` 未按 brief「立即跳 `/?toast=login`」**：停留在 `/login?state=success`，表单置灰 + 右上 Toast「欢迎回来，若琳」。brief §3 与 `content/login.md` 都定义 success = 跳转仪表盘由 dashboard 叠加 Toast；当前更像一个「假成功态」。与 P0-1 同源（dashboard 缺失），合入后应改为跳转。截图：`login-success-desktop-light.png`

**P2-2 · 未知 / 不可达路径静默落到组件总览**（见 P0-1 描述）：`/orders`、`/forgot-password`、`/signup` 都显示「组件总览」及「映射表 docs/frontend/04-components.md…」这类开发者文案，终端用户完全看不懂。建议 404 页或重定向 `/`。截图：`dashboard-default-desktop-light.png`

**P2-3 · 第三方登录三个按钮点击零反馈**：`cursor: default`、无 `aria-disabled`、无 Toast、无提示。brief 允许「只做视觉」，但从用户视角这是三个「坏掉的按钮」。同屏的「忘记密码？」「免费注册」至少有 `aria-disabled + cursor-not-allowed`，两种不可达表现不一致。建议统一：`aria-disabled` + Tooltip / Toast「演示环境暂不支持第三方登录」。

**P2-4 · 「忘记密码？」「免费注册」「服务条款」「隐私政策」不可点但没有解释**：hover 只有 `not-allowed` 光标，键盘 Enter 无反应，屏幕阅读器只听到 disabled。dashboard 侧文案已有 `shell.nav.disabled.tip = 后续轮次提供` 的 Tooltip 模式，login 侧应复用同一模式。

**P2-5 · 密码错误 Alert 在用户修改邮箱后仍常驻**：`?state=error` 下改邮箱、改密码，「邮箱或密码不正确…」不消失，直到再次提交。可接受但偏粗糙，建议字段变更即清除 Alert（保留字段级错误）。

### P3

**P3-1 · 375 上成功 Toast 盖住品牌头**（`login-success-mobile-light.png`）：Toast 从顶部弹出，正好覆盖「Acme Console」标识；1440 上在右上角不遮挡。建议 375 用底部或在头部下方留位。

**P3-2 · 未输入即失焦就报「请输入邮箱」**：Tab 跳过空邮箱立刻变红，对刚打开页面的用户略显急躁；常见做法是「脏字段 blur 才报，干净字段提交时才报」。修 P1-1 时可一并处理。

**P3-3 · 「30 天内记住我」勾选后没有任何持久化**：再次访问 `/login` 邮箱为空、复选框未勾，`localStorage` 为空。演示环境可接受，但文案许诺了 30 天，建议至少记住邮箱。

**P3-4 · `document.title` 恒为「Acme Console」**：login 与 kitchen-sink 标签页标题相同，多标签时无法区分；建议「登录 · Acme Console」。同时缺 `<meta name="description">`。

### 通过项（无需处理，记录以便复走）
- 亮 / 暗主题在 login 全部元素上正确映射，无白块、无硬编码残留（`node tools/no-hardcode.mjs` 通过）。
- 375 无横向溢出；字段、按钮、OAuth 按钮全宽；错误文案不截断。
- 密码显隐按钮 40×40，`aria-pressed` + 标签「显示 / 隐藏密码」随状态切换；loading 时禁用。
- 复选框视觉 20×20，但 `label` 热区实测 ±19px 四向均命中 → 满足 ≥40（早期自写探针误报为 20×20，以 `tools/a11y.mjs` 的 elementFromPoint 实测为准）。
- 提交中：按钮禁用 + spinner + 「登录中…」，全表单只读，`prefers-reduced-motion` 下 spinner 动画时长 0s。
- 失败：Alert `role=alert tabindex=-1`，提交后焦点确实落到 Alert；文案与 `content/login.md` 完全一致（含锁定 / 网络两种）。
- Enter 键在密码框可提交；Tab 顺序合理，焦点环全部可见（a11y 脚本「焦点环缺失 0」）。
- 自动填充语义正确：`autocomplete=username / current-password`；`<html lang="zh-CN">`。

## 4. 本阶段门禁运行结果（`apps/reference/` 下实跑）

| 命令 | 结果 |
|---|---|
| `pnpm lint` | ✅ eslint 0 问题；`no-hardcode: 43 个文件通过` |
| `pnpm typecheck` | ✅ |
| `pnpm build` | ✅（Vite 提示单 chunk > 500 kB，非阻塞；`fe01/screen-dashboard` 已拆 charts chunk） |
| `node tools/no-hardcode.mjs` | ✅ |
| `node tools/a11y.mjs login` | ✅ ALL PASS：4 视口/主题 × 7 状态，axe serious/critical = 0、scrollWidth ≤ 375、热区 ≥ 40×40（0 处不足）、焦点环缺失 0、console error = 0 |
| `node tools/a11y.mjs dashboard` / `shoot` / `compare` | ⛔ 本提交无 `pages/dashboard/`，无法运行（对应 P0-1） |
| 体验官走查脚本（`~/ux/walk.mjs`） | 4 组合全部跑完；console error 0 / 0 / 0 / 0；375 scrollWidth 375 |

本报告只新增 `docs/frontend/07-ux-walkthrough.md`，未改动 `apps/reference/src/**`、`design/**`、`content/**`、`mock/**`；门禁结果与走查前一致。

## 5. 附：`fe01/screen-dashboard@f221e98` 预检（非本次验收对象，供合入后复走）

为缩短下一轮，在独立 worktree 构建了尚未合入的 dashboard 分支（`pnpm preview --port 4174`），用同一套 1440/375 × 亮/暗路径走了一遍。该分支**不含 login 屏**（从 login 合入前切出），所以两屏只有合入集成分支后才能一起验证。截图在 `shots/ux/dash-preview/`。

整体：成功态 1440/375 亮暗四张图布局、层级、数据、语义色均到位（`dash-success-*.png`）；loading 骨架与成功态同布局；empty 有两个 CTA「接入销售渠道 / 导入历史订单」；error 有「重试」且约 2s 内（经 loading 骨架）恢复成功态；日/周/月切换同步统计卡、图表、环形图副标题（今日 / 近 7 天 / 近 30 天）；通知 Popover 5 条 + 全部标为已读（角标随之消失）+ Esc 关闭并回焦铃铛；账号菜单 5 项；侧边栏折叠到 64px 轨道，悬停有「订单 · 后续轮次提供」Tooltip；375 抽屉 280px、8 项、可关闭；订单 375 卡片化 5 张、操作菜单 4 项按状态禁用；`/?toast=login` 正确出「欢迎回来，若琳」；Tab 首焦点「跳到主内容」。

合入后需要注意的预检发现（按合入后严重度预估）：

| 预估 | 现象 | 证据 |
|---|---|---|
| P1 | **切换日/周/月或任何写 URL 的操作后，地址从 `/apps/reference/?…` 变成 `/apps/reference?…`（丢尾斜杠）；此时刷新 / 分享链接得到 Vite 的「public base URL」404 白页**。1440/375 × 亮/暗全部复现。生产托管若不自动补斜杠，收藏 / 分享链接会失效 | `dash-reload-after-tabs-*.png`；日志「刷新前 URL: /apps/reference?theme=light&period=month → rendered:false」 |
| P1 | 头像菜单「退出登录」点击后仍停留在 `/`，未回 `/login`（`content/dashboard.md` 定义「点击回 /login」）| 日志「退出登录 → /apps/reference/?theme=light」 |
| P1 | 375 顶栏「全局搜索」图标按钮点按无任何反应（不展开输入框、不弹层）| `dash-search-mobile-*.png`；日志「点搜索按钮后 inputVisible:false」 |
| P2 | 1440 搜索框输入「SO-2026」无任何结果 / 提示 / 状态；Ctrl K 能聚焦但仅此而已 | `dash-search-desktop-*.png` |
| P2 | 订单菜单「查看详情」、空态 CTA、「查看全部」点击均无反馈（`aria-disabled` 链接尚可，菜单项应给 Toast「后续轮次提供」）| 日志「查看详情 → / toasts=[]」 |
| P2 | 主题切换写入 `localStorage`，但只要 URL 还带 `?theme=`，刷新后被 URL 覆盖回原主题（用户「切了又弹回」）| 日志「主题切换 light → dark … 刷新后 theme:light」 |
| P3 | 375 抽屉 `role=dialog` 无 `aria-label`（应为「主导航」），关闭按钮 aria-label 为「收起侧边栏」而非「关闭导航」；点抽屉内禁用项后按 Esc 一次未关闭（疑被 Tooltip 消费，需复核）| `dash-drawer-mobile-*.png` |
| P3 | console 出现 1 条 404（即上文尾斜杠刷新所致），其余交互 console error = 0 | 日志 |

## 6. 下一步建议（如无异议将按此进入修复轮）

1. 项目负责人合入 `fe01/screen-dashboard` → `fe01/integration`，解 P0-1；合入后按 §5 复核尾斜杠 / 退出登录 / 375 搜索三项 P1 预估。
2. login 实现者修 P1-1（错误行占位或脏字段校验）与 P1-2（loading 不入 URL / 成功跳转 replace），同时顺手处理 P2-1、P2-3、P2-4、P3-2。
3. 修复后体验官按本文件 §1 矩阵复走一遍（含 375），更新本报告 §0 verdict。
