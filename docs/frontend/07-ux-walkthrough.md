# 07 · 体验官走查报告（第 3 轮复查）

> 角色：roles/legal-research/user-experience-officer（体验官）。
> 对象：`fe01/integration` @ `aa1a1643cef490696c0440d74765e053afaa92e1`（第 2 轮 P1-新1「订单菜单不关闭无反馈」修复 + 客户端路由 index.html 落盘）。
> 目的：**复查第 2 轮 P0/P1 是否修复**，不做全量探索（项目负责人明确缩小范围、限时 10 分钟出结果）。**不改产品代码。**
> 方法：`pnpm install --frozen-lockfile && pnpm build && pnpm preview --port 4173`（vite preview，base `/apps/reference/`），Playwright Chromium 1.62.1（`tools/shoot` 锁定版本，另 `npx playwright install chromium` 补装了 headless shell）模拟真实用户：1440×900 鼠标 / 375×812 触屏（`isMobile+hasTouch`，DPR 2）× 亮/暗（`prefers-color-scheme`，不带 `?theme=`）。脚本与日志在仓库外：`~/ux/recheck.mjs`（P1 定向复查，`~/ux/recheck.log`）、`~/ux/walk.mjs`（全量脚本，本轮只跑到任务 2，`~/ux/run1.log`）；截图输出 `shots/ux/*.png`（不入库）。

## 0. 结论

**verdict = pass**（本轮范围内 P0 = 0、P1 = 0；第 2 轮唯一 P1 已在 4 组合 × 鼠标/触屏/键盘下验证修复）。

| 级别 | 数量 | 摘要 |
| --- | --- | --- |
| P0 | 0 | — |
| P1 | 0 | 第 2 轮 P1-新1 已修（§1） |
| P2 | 2（本轮实测复现） | 第三方登录按钮静默无响应（cursor=default、无 Toast/禁用态）；登录错误 Alert 在修改邮箱后不清除（字段错误会即时清除，行为不一致） |
| P3 | 2（本轮实测复现） | `document.title` 两页均为「Acme Console」；后退回 login 后邮箱/「记住我」不保留 |

第 2 轮其余 P2/P3（全局搜索无反应、头像菜单前 4 项静默关闭、`?theme=` 下手动切主题刷新弹回、抽屉关闭按钮文案、跳到主内容焦点、`?state=success` 直达行为、品牌链接多余 Tab 停靠）**本轮未复验（untested）**，按第 2 轮结论沿用，不重新计数。

## 1. 第 2 轮 P1 复查（核心）

第 2 轮现象：订单「更多操作」菜单里点任一项（如「标记发货」）菜单仍打开、无 Toast/状态变化（鼠标/触屏/键盘均复现）。

本轮实测（`~/ux/recheck.log`，每组合从 `/` success 态开始）：

| 组合 | 单 1（待发货）4 项逐个点选 | 单 2（待付款）「取消订单」 | 键盘 Enter 选项 | Esc 关菜单回焦 | 单 2 禁用项 | console error |
| --- | --- | --- | --- | --- | --- | --- |
| 1440 亮 | 4/4 菜单关闭 + Toast「〈项名〉／后续轮次提供」，焦点回「更多操作」 | 同上 | 关闭 + Toast「查看详情」 | 关闭，焦点回按钮 | 标记发货/打印面单 `aria-disabled`，查看详情/取消订单可用 | 0 |
| 1440 暗 | 4/4 | ✅ | ✅ | ✅ | ✅ | 0 |
| 375 亮（tap） | 4/4 | ✅ | —（触屏不测键盘） | — | ✅ | 0 |
| 375 暗（tap） | 4/4 | ✅ | — | — | ✅ | 0 |

**结论：P1-新1 已修复。** 截图：`shots/ux/p1-order-menu-open-<combo>.png`（菜单打开）、`shots/ux/p1-order-action-toast-<combo>.png`（点「标记发货」后菜单已关、顶栏下方出现 info Toast「标记发货 / 后续轮次提供」；375 下 Toast 通栏落在顶栏之下，不遮汉堡/铃铛）。

源码对照（推断，非实测）：`SuccessView` 改为 `open={menu === key}` 固定受控，`orderAction(key)` 统一 `toast.info(...)`，与第 2 轮建议一致。

## 2. 本轮顺带实测到的项（`~/ux/walk.mjs`，4 组合均跑到任务 2「切日/周/月」后脚本因图表选择器写错中断）

登录任务 1（4 组合一致）：
- ✅ 打开 `/login` 主题跟随系统、首焦点邮箱、375 无横向溢出（scrollWidth=375）。
- ✅ 空表单点「登录」→「请输入邮箱」「请输入密码」、焦点回邮箱；失焦格式校验「邮箱格式不正确，例如 name@example.com」「密码至少 8 位」；输入即清除字段错误。
- ✅ 密码显隐按钮热区 ≥40、`aria-pressed` 正确；「记住我」整行可点。
- ✅ 忘记密码 / 免费注册 / 服务条款 / 隐私政策：`aria-disabled`、`cursor: not-allowed`、真实坐标点按不跳转不 404。
- ✅ 错误账号：按钮「登录中…」禁用 + 字段只读 → Alert「邮箱或密码不正确」并获焦；锁定账号 → 「账号已锁定」；断网 → 「网络异常」+「重试」，恢复网络点「重试」直接登录成功。
- ✅ 登录成功 → `/apps/reference/?toast=login`，h1「仪表盘」，Toast「欢迎回来，若琳」约 3 s 后消失；后退回 login 不锁死（按钮「登录」、字段可编辑），前进回仪表盘。
- ✅ 1440 Tab 顺序：邮箱 → 密码 → 显示密码 → 记住我 → 忘记密码 → 登录 → Google → GitHub → 微信 → 免费注册 → 品牌 → 服务条款 → 隐私政策；焦点环 `outline 2px solid`。
- ❌ **P2-A** 第三方登录按钮：`cursor=default`、无 `aria-disabled`、点击无 Toast/跳转（4 组合）。brief 说「仅视觉」，但对用户是「点了没反应」。截图 `shots/ux/login-default-<combo>.png`。
- ❌ **P2-B** 错误 Alert 出现后修改邮箱，Alert 仍在（`[data-slot=alert]` count=1，4 组合）；而字段级错误会即时清除，两套反馈节奏不一致。截图 `shots/ux/login-error-live-<combo>.png`。
- ❌ **P3-A** `document.title` 在 `/login` 与 `/` 均为「Acme Console」，多标签页无法区分（4 组合）。
- ❌ **P3-B** 后退回 login：邮箱为空、「记住我」未勾选（刚勾选过），「30 天记住我」对用户无可感知效果。截图 `shots/ux/flow-back-after-login-<combo>.png`。
- ⚠️ 未定论（untested）：375 登录成功瞬间截帧 `shots/ux/flow-after-login-mobile-*.png` 里 Toast 半透明压在顶栏上（y=26.8 < 汉堡底 47.5）——人工看图为 Toast 入场动画中间帧，稍后截的 `p1-order-action-toast-mobile-*.png` Toast 已正确落在顶栏下；未做动画结束后的复测，不计缺陷。另「Alert 关闭按钮」检查因脚本未等待 URL 更新即断言，结果无效（untested）。
- ✅ 375×420（模拟键盘弹起）：「登录」按钮可滚入视口（底边超出 0.4px 为取整误差，不计）。

仪表盘任务 2（4 组合一致）：
- ✅ 月默认 4 卡：¥1,186,420 / +9.4%、2,964 单 / +5.1%、待发货 63 / −21、库存预警 12 SKU / +4；问候「下午好，若琳」+「数据更新于 今天 17:30」；1440/375 无横向溢出。
- ✅ Tabs 热区 40 高；切「日」→ 42,380 / 108 + 副标题「今日」+ URL `period=day`；切「周」→ 286,940 / 731「近 7 天」；刷新保持「周」；1440 方向键 周→月。
- ✅ 折线柱状图 + 环形图均渲染（`svg.recharts-surface` = 2，`~/ux/recheck.log`）。

## 3. 未走到（untested，如实标注）

任务 3 图表 tooltip（hover/触摸/键盘漫游）、环形图图例合计；任务 4 「查看全部」；任务 5 通知 Popover（5 条、全部标为已读、Esc 回焦）、团队动态/任务进度、主题切换与持久化、头像菜单前 4 项反馈、侧栏 rail/展开与禁用项 Tooltip、375 抽屉/放大镜/顶栏热区、全局搜索、`?state=loading|empty|error` 与重试、未知路径回退、退出登录；768/1024 视口；真实 iOS Safari / Android Chrome；屏幕阅读器。以上均以第 2 轮结论为准，本轮未复验。

## 4. 门禁

- `pnpm install --frozen-lockfile`：✅（无 `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`）。
- `pnpm build`（apps/reference）：✅，产出 `dist/index.html`、`dist/login/index.html`、`dist/kitchen-sink/index.html`；Vite 警告 `vite.config.ts` 使用 `__dirname`（非阻塞，写入 notes 不改代码）。
- `pnpm preview --port 4173`：✅。
- 4 组合走查 console error = 0（`~/ux/recheck.log`）。
- `pnpm lint` / `pnpm typecheck` / `node tools/a11y.mjs`：本轮限时未运行（untested），以 `07-qa-audit.md` 为准。

## 5. 交回实现侧的建议（不在本轮改）

1. P2-A：第三方按钮加 `aria-disabled` + `cursor-not-allowed` 或点击 Toast「后续轮次提供」，与导航禁用项一致。
2. P2-B：`update("email"|"password")` 时若 `state === "error"` 同步 `set({ state: null, alert: null })`。
3. P3-A：按路由设置 `document.title`（「登录 · Acme Console」「仪表盘 · Acme Console」）。
4. P3-B：勾选「记住我」后把邮箱写入 `localStorage` 并在 login 初始化回填。
