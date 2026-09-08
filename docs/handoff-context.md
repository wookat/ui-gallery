# UI Gallery — 交接上下文

更新：2026-09-08（fe01 第 2 轮 release：orders + form 上线；components / landing / chat / settings 未合入）

## 仓库 / 服务
- 代码：https://github.com/wookat/ui-gallery （直接提交 main；无 GitHub Actions，验收 = 本地 lint/typecheck/build 全绿即合）
- 线上：https://ui.zalize.com （Cloudflare Workers 静态资产，`wrangler.jsonc`，`pnpm assemble && pnpm exec wrangler deploy`，账号 ddff52d24ee44e21a021c15eaffcc86d；Pages 项目创建被 Cloudflare 拦截「Subdomain is blocked」，故用 Workers）
  - 部署凭据：会话 secret `CLOUDFLARE_WORKERS_API_TOKEN`（`CLOUDFLARE_ADMIN_API_TOKEN` 对 `workers/services` 返回 10000 认证错误，不可用）
  - 参考应用：https://ui.zalize.com/apps/reference/ （dashboard）、https://ui.zalize.com/apps/reference/login/ 、https://ui.zalize.com/apps/reference/orders/ 、https://ui.zalize.com/apps/reference/form/ 、https://ui.zalize.com/apps/reference/kitchen-sink/
- 研究数据来源：https://github.com/wookat/frontend-libs-research （round1 §1、round4 §35–39 为组件库清单）

## 结构
- `docs/one-pager.md` 立项一页纸；`docs/page-spec.md` 8 页规格（所有库实现的契约）；`docs/libraries.json` 建库清单与状态
- `packages/spec` 契约 + mock 数据（框架无关）；`packages/icons-react` React 图标适配（lucide/tabler/phosphor/heroicons）
- `apps/<slug>` 每库一个独立应用（官方默认主题，原生框架）；`apps/shadcn-ui` 为参考模板；`apps/README.md` 复制说明
- `apps/reference/` **Acme Console 参考应用**（fe01 产物：React 19 + Vite + Tailwind v4 + shadcn 低样式基座，外观全部由 `design/tokens.json` → `design/tokens.css` → `src/styles/theme.css` 注入）；根 `AGENTS.md` 是它的设计系统上下文（后续 AI 会话必读）
- `gallery/` Astro 画廊站（读 `dist/manifest.json` + `dist/shots/`）
- `tools/shoot/shoot.mjs` Playwright 截图矩阵；`tools/assemble.mjs` 组装 `dist/`
- `.devin/skills/ui-gallery-round/workflow.py` 动态工作流：build → review → fix → merge(串行) → deploy（各库「原生默认主题样板」）
- `.devin/skills/frontend-0to1-ai/` （副本，源为 company-os/skills/frontend-0to1-ai）：AI 前端从 0 到 1 八阶段 skill + `workflow.py`（Brief → IA/线框 → 令牌 → 高保真 → 地基 → 按稿实现 → 视觉 QA → 集成上线）

## fe01 第 2 轮（增量：orders + form 上线；六屏设计资产合入）

### 本轮八阶段产物索引
| 阶段 | 产物路径 |
|---|---|
| 0 Brief（增量） | `docs/frontend/00-brief.md` §11（6 屏清单 / 细则 / 老板原话对照 / 取舍 / 门禁）；文案 `content/{orders,form,settings,components,landing,chat}.md`；数据 `mock/{orders-all,orders-summary,purchase-form,skus,suppliers,settings,landing,chat}.json`（`node mock/check.mjs`） |
| 1 IA + 线框（增量） | `docs/frontend/01-ia.md`；`design/wireframes/{orders,form,settings,components,landing,chat}.html` + `check.mjs` |
| 2 设计令牌（增量） | `design/tokens.json` 追加六屏令牌（`f37ffb6`，旧值零改动）→ `design/tokens.css` |
| 3 高保真 | 已合入集成分支：`design/hifi/{orders(86 张),form(84),components(48),landing(20),chat(88)}/`（`index.html` + `check.mjs` + `ref/*.png`）；**settings 高保真只在 `fe01/hifi-settings`@`3435d29`（3 次提交，审查第 2 轮修复后重截 ref），未合入集成分支**（见「未合入屏幕」） |
| 4 工程地基（第 2 轮） | `431524a`：新增 18 个基础控件 + 12 个组合件，`/kitchen-sink` 状态矩阵与 `docs/frontend/04-components.md` 映射表扩展 |
| 5 按稿实现 | `apps/reference/src/pages/{orders,form}/`（`index.tsx` + `shots.json`）；AppShell `src/pages/dashboard/shell.tsx` 取 orders + form 属性并集（`current / currentLabel / navOpenKey / search / breadcrumb`） |
| 6 视觉 QA | 记录在 07-qa-audit 第 4 轮 §3：dashboard / orders `compare.mjs` 142/142 ≥ 95% 无回退；form 三审后 compare 最低 96.85%（`9c1ab27`）；未单独成文 |
| 7 集成上线 | `docs/frontend/07-ux-walkthrough.md`（体验官第 2 轮复查 @01ab585，verdict=pass，P0=0 P1=0）；`docs/frontend/07-qa-audit.md`（QA + 合规审计第 4 轮 @01ab585，verdict=pass）；本文 |

### 分支 / commit / 部署
- 集成分支 `fe01/integration`：代码定稿 `01ab5852ddb23d5df21f2e9fa77c2f7e5ccad179`（修复走查/QA P1：侧栏与「查看全部」走 react-router Link、订单菜单动作不被菜单关闭覆盖、form 第 3 步不预报条款错误）；分支头 `77d40ec` = 代码 + QA 第 4 轮报告 `4009718` + 体验官第 2 轮报告 `77d40ec`
- 已合入集成分支的屏幕分支：`fe01/screen-orders`@`9ab4c7d`（合并 `f486160`）、`fe01/screen-form`@`9c1ab27`（合并 `6f4fe2a`）；高保真分支 `fe01/hifi-{orders,form,components,landing,chat}` 均已合入
- main 合并 commit：`1d6d66fd322ec3ec793bd48569838a5a58ecbec9`（`git merge --no-ff origin/fe01/integration`，无冲突，416 文件 +25586/−286）
- release 门禁实跑（2026-09-08，Node 22.23.2 / pnpm 11.9.0，8 GB / 2 核）：`pnpm install --frozen-lockfile` ✅（无 MINIMUM_RELEASE_AGE 违规）；`apps/reference`：`pnpm lint` ✅（eslint 0 错，`no-hardcode: 75 个文件通过`）、`pnpm typecheck` ✅、`pnpm build` ✅（仅 chunk > 500 kB 既有告警 = QA-20）；仓库根 turbo `--concurrency=1`：`pnpm lint` ✅ 23/23、`pnpm typecheck` ✅ 25/25、`pnpm build` ✅ 24/24（3m52s）
- 部署：`pnpm assemble`（23 apps，`dist/apps/reference/{login,orders,form,kitchen-sink}/index.html`，shots 792 张）→ `CLOUDFLARE_API_TOKEN=$CLOUDFLARE_WORKERS_API_TOKEN pnpm exec wrangler deploy` → Version `9377da54-fbe4-4237-b439-412528d3e601`。生产复验：`/` 200、`manifest.json` 200（23 库）、`/apps/reference/` 200、`/login/` 200、`/orders/` 200（`?state=empty` 200；无斜杠 307 → 带斜杠）、`/form/` 200（`?step=2` 200）、`/kitchen-sink/` 200、旧库截图抽样 30/30 200。**注意**：新目录 `/orders/`、`/form/` 部署后约 30 s 内返回 404（资产边缘传播延迟），复验需等待后重试
- shots 处理同上轮：fresh clone 先用 `~/mirror-shots.mjs`（按 `packages/spec/contract.json` routes × viewports × themes 枚举，从线上 `/shots/<slug>/<route>__<vp>__<theme>.png` 回拉）792/792 命中再 assemble（脚本未入库，逻辑见「已知问题」）

### 未合入屏幕（不计 P0/P1；下一轮从这里接）
| 屏 | 分支 @ commit | 阻塞问题 | 建议 |
|---|---|---|---|
| **chat** | `fe01/screen-chat`@`acbbf06`（实现已过审查 2 轮 + tech-lead 升级修复 hifi 代码块 `1de1b8f`，compare 88/88 过线） | 合入集成分支时 `apps/reference/src/pages/dashboard/shell.tsx` **内容冲突**（已 `merge --abort`，未 push）。根因：screen-chat 从 `431524a` 切出，之后 orders / form 各自扩展 `ShellProps`：integration 侧新增 `current / currentLabel / navOpenKey / search / breadcrumb`（orders `currentLabel={t("orders.title")} navOpenKey="nav" search={false}`；顶栏搜索按 `search` 条件渲染）；chat 侧新增 `current / title / assistant{label,href,current} / flush`（面包屑 `title ?? t("shell.breadcrumb.current")`；顶栏搜索后追加 assistant IconButton+Link；`flush` 时内容列 `h-svh` 锁高）。三处冲突块：① `ShellProps` 类型 ② `AppShell` 签名/默认值 ③ 面包屑当前项 + 顶栏右侧 | frontend-engineer 在 `fe01/screen-chat` 上 `git merge origin/fe01/integration`：`ShellProps` 取并集 `current / currentLabel / breadcrumb / navOpenKey / search / assistant / flush`；面包屑统一用 `currentLabel`（chat 页 `title` → `currentLabel`）；顶栏右侧保留 `search` 条件渲染再追加 assistant 块；默认值合并（`current="dashboard"`, `currentLabel=t(...)`, `navOpenKey="drawer"`, `search=true`, `flush=false`）。解完跑 `pnpm lint && pnpm typecheck && pnpm build` + shoot/compare login / dashboard / orders / form / chat 五屏不回退，再派发合入 |
| **components** | `fe01/screen-components`@`5708fe2`（第 3 轮升级修复） | 实现未过审（组件形态与布局骨架不符 hifi）：① `round2.tsx` 卡片「Tabs · Segmented · Stepper」缺 Tabs line 变体（全部 234 / 待发货 63 / 退款中 4）、Tabs vertical（设置四项带图标）、Segmented 计费周期（按年 + 省 17% 徽标）、Stepper vertical（含 error 步）——现有只有 Tabs pill 矩阵、Segmented 列表/卡片、横向 Stepper（步名截断「商品与…」无描述行）；源码 `Tabs orientation/vertical` 0 处 ② 卡片「PricingCard · MemberRow · SessionRow」只渲染 PricingCard（`MemberRow` / `SessionRow` grep 0 处），PricingCard 缺套餐描述行与「/ 年 · 约 ¥83 / 月 · 省 2 个月」副文案 ③ `demos.tsx` 卡片「Sheet · Drawer · Anchor」只有 Sheet 触发器；`AnchorNav`（brief §11 覆盖面列为本轮新增）在 `src/components` 与 `pages/components` 均不存在，Drawer 静态示例放在 Dialog 卡 | 按 hifi `design/hifi/components/` 补齐 Tabs line/vertical、竖向 Stepper、带徽标 Segmented、MemberRow / SessionRow、AnchorNav，`compare.mjs components` 48 张 ≥ 95% 后重审；同时 `/kitchen-sink` → `/components` 重定向（`a0ea7a6`）随之上线 |
| **landing** | `fe01/screen-landing`@`04455ad`（实现侧门禁全过：lint/typecheck/build、`a11y.mjs landing` ALL PASS、文案 `content/landing.md`、数据 `mock/landing.json` + `mock/settings.json`） | **阻塞在设计侧 hifi**：`compare.mjs landing` 20/20 生成但最低 83.67%（desktop 89.4–94.6、tablet 87.4–87.9、tabletSm 85.5–86.1、mobile 83.7–89.3；仅 mobile-menu-open 99.6%+）。官方 ref 比实现整页高 124–199 px。独立复现根因：hifi `design/hifi/landing/index.html` 的 `.sec-head p`、`.sol-text > p` 及 767px 媒体规则 `.sol-text > p, .bullets li` 以更高特异性覆盖 `<p class=eyebrow>`（06-impl-notes L-D1）；仅将三处改 `:not(.eyebrow)` 后重截 hifi 再比对，20/20 达 99.68–99.99%。实现按 eyebrow 意图渲染正确 | ui-designer 在 `fe01/hifi-landing` 修三处选择器并重生成 `ref/*.png`（20 张）→ 合入集成分支 → screen-landing 重跑 compare 转绿 → 合入。属「实现阶段不得改 hifi」规则下的正常回流，不是实现缺陷 |
| **settings** | 仅 `fe01/hifi-settings`@`3435d29`（hifi 审查第 2 轮修复后重截 ref）；无 `fe01/screen-settings` 分支 | 高保真未合入集成分支，实现未启动；本轮 hifi-merge 合入的是 orders / form / components / landing / chat 五屏（`0eca3ea`…`11d9a59`），settings 未在其中，本 release 任务书也未列其状态。brief §11.1 要求实现阶段将 `mock/nav.json` `settings.implemented: true`，目前仍 `false`（侧栏「设置」`aria-disabled`） | 下一轮先核 `fe01/hifi-settings` 的独立审查结论（`git log origin/fe01/hifi-settings`）：通过则合入集成分支并派发 screen-settings；未通过则补一轮审查 |

### 体验官 / QA 遗留（第 2 轮复查 @01ab585，0 P0 / 0 P1；release 阶段未改代码）
体验官 P2（8）：
- P2-1 orders 日期范围「开始日期 – 结束日期」点击 Toast「自定义日期范围将在实现阶段提供」——内部术语泄漏（上轮，未重测）
- P2-2 orders 样本外页码 `aria-disabled` 但 hover/focus 无可见 Tooltip（brief 要求 `orders.pagination.sampleOnly`）
- P2-3 orders 每页 50 时「下一页」可点无效（上轮，未重测）
- P2-4 form 附件类型 / 大小 / 数量无校验反馈（`evil.exe`、11 MB 均「已上传」，第 6 个静默丢弃；`addFiles` 无校验，拖放绕过 `accept`）（上轮，未重测）
- P2-5 dashboard 最近订单行菜单「查看详情」仍 Toast「后续轮次提供」，与已可达的 `/orders` 矛盾
- P2-6 form 条款 Dialog 关闭 / 375 取消订单确认后焦点落 `body`
- P2-7 form 「再建一张」仍是同一张草稿（联系人等字段未清）
- **P2-8（新）** 侧栏可用项与 `aria-disabled` 项视觉无差别（同 `fg-muted`），375 触屏无法预知哪些可点——令牌层决定，**交设计侧**（更低 opacity 令牌 / 「即将推出」小标 / 不渲染未实现项）

体验官 P3（7）：P3-1 顶栏全局搜索回车无反馈 + `/orders` 与 `/form` 375 顶栏搜索图标显示不一致；P3-2 form 成功页主按钮「查看采购单」仅 Toast；P3-3 form 标签无上限提示；P3-4 登录成功后后退回 `/login` 邮箱与「记住我」不保留；P3-5 dashboard 与 orders 行菜单项目不一致；**P3-6（新）** form 步骤切换后焦点落 `body`；**P3-7（新，由上轮 P1-1 降级）** `/form` 应用内无入口（侧栏「采购」按 brief §11.10-E 保持禁用，只能直输 URL）

QA P2（2）：
- **QA-02**（历史，仍开放）：`assemble.mjs` 把参考应用纳入 `manifest.json`，画廊首页出现「Acme Console」卡片（本次部署 manifest 23 库仍含 `reference`），与 brief §6 / `04-adr` §4「画廊首页暂不接入」冲突；`gallery.json.routes` 仍只有 `/kitchen-sink`（QA-09）。**下轮开工第一件事二选一并写进 04-adr**：接受接入（补 routes + `shots/reference` 纳入部署）或 assemble 按 `gallery.json.hidden` 过滤
- **QA-20**：主包 `index-*.js` 539.05 kB（gzip 144）触发 Vite > 500 kB 告警；建议 `app.tsx` 路由 `React.lazy` 按屏拆包

QA P3（12）：QA-22（新：form `?step=` 只作初始值，「下一步」不同步 URL）；QA-21 订单详情 Drawer 可访问名只有「订单」；QA-03 `/login?state=success` 不跳转；QA-06 vite/tailwind 在 `dependencies`（lightningcss MPL-2.0 进 `licenses --prod`）；QA-08 a11y 未跑 768/1024；QA-09 `gallery.json.routes` 过时；QA-10 mock 邮箱域用真实可注册 TLD（8 个，应改 `.example`）；QA-11 `vite.config.ts` `__dirname` → `import.meta.dirname`；QA-12 hifi login 字体走 jsdelivr；QA-14 站点级空体 404；QA-15 `spaRoutes()` 正则过窄；QA-16 本地静态服务与生产 `auto-trailing-slash` 差异

### 下一轮建议
1. **先解 chat 的 shell.tsx 冲突并合入**（方案见上表，纯工程合并，无设计依赖，预计半个会话）
2. **landing 回流设计侧**：`fe01/hifi-landing` 三处选择器 `:not(.eyebrow)` + 重截 20 张 ref → 合入 → screen-landing compare 转绿即可合入（实现已全绿）
3. components 按 hifi 补齐缺失组件形态（Tabs line/vertical、竖向 Stepper、带徽标 Segmented、MemberRow/SessionRow、AnchorNav）后重审
4. settings：核 `fe01/hifi-settings` 审查结论 → 合入 hifi → 启动 screen-settings（同时 `nav.json settings.implemented: true`）
5. 开工先决 QA-02（画廊是否接入参考应用，写 04-adr），并顺手清 P2-5（stub 过期）、P2-6 / P3-6（焦点管理，几行）、P2-7（重置表单）、P2-2（Tooltip）、QA-22（`goStep` 同步 URL）
6. P2-8 / P3-7 交设计与产品侧：`aria-disabled` 导航项的可感知差异需要令牌或 IA 决定；`/form` 入口随「采购」实现或在 dashboard / orders 加「新建采购单」入口
7. release 流程固化未变：shots 持久化（R2 或 release 阶段 `pnpm shoot`）、根 `pnpm build --concurrency=1`、部署 token `CLOUDFLARE_WORKERS_API_TOKEN`、新目录部署后等 ≥30 s 再复验

## fe01 第 1 轮（login + dashboard）产物索引
| 阶段 | 产物路径 |
|---|---|
| 0 Brief | `docs/frontend/00-brief.md`；文案 `content/{login,dashboard,kitchen-sink}.md`；数据 `mock/*.json`（`node mock/check.mjs` 校验） |
| 1 IA + 线框 | `docs/frontend/01-ia.md`；`design/wireframes/{login,dashboard}.html` + `check.mjs` |
| 2 设计令牌 | `design/tokens.json`（DTCG）→ `node design/build-tokens.mjs` → `design/tokens.css`；`node design/check-contrast.mjs` 对比度门禁 |
| 3 高保真 | `design/hifi/{login,dashboard}/index.html` + `check.mjs` + `ref/*.png`（login 28 张、dashboard 56 张基准图） |
| 4 工程地基 | `apps/reference/`（`/kitchen-sink`）；`docs/frontend/04-components.md` 组件映射；`docs/frontend/04-adr.md` 基座选型；根 `AGENTS.md` |
| 5 按稿实现 | `apps/reference/src/pages/{login,dashboard,kitchen-sink}/`（`index.tsx` + `shots.json`）；门禁脚本 `apps/reference/tools/{shoot,compare,a11y,no-hardcode}.mjs` |
| 6 视觉 QA | 像素对照结果记录在 `aa1a164` 提交说明（dashboard 56/56 ≥ 98.41%、login 28/28 ≥ 98.36%），未单独成文 |
| 7 集成上线 | `docs/frontend/07-ux-walkthrough.md`（体验官第 3 轮，pass）；`docs/frontend/07-qa-audit.md`（QA + 合规/安全审计第 3 轮，pass）；本文 |

- 分支：`fe01/integration`（代码定稿 `aa1a1643cef490696c0440d74765e053afaa92e1`，分支头 `cb78fce`= 代码 + 两份第 3 轮报告）；屏幕分支 `fe01/screen-login`、`fe01/screen-dashboard`、高保真分支 `fe01/hifi-login`、`fe01/hifi-dashboard` 均已合入集成分支
- main 合并 commit：`29d7c4218e1f0ab4341c6ea8fd35c316495640ee`（`git merge --no-ff origin/fe01/integration`，无冲突）
- release 门禁实跑（2026-09-08，仓库根，Node 22.23.2 / pnpm 11.9.0）：`pnpm install --frozen-lockfile` ✅（无 MINIMUM_RELEASE_AGE 违规）；`pnpm lint` ✅ 23/23（reference `no-hardcode: 47 个文件通过`）；`pnpm typecheck` ✅ 25/25；`pnpm build` ✅ 24/24（**需 `--concurrency=1`**，8 GB / 2 核机器默认并发会被 OOM kill，exit 137，非代码问题）
- 部署：wrangler Version `6eabecd3-b4fa-40af-a1e0-da38fd5b802f`；生产复验 `/apps/reference/` 200、`/apps/reference/login` 307 → `/apps/reference/login/` 200（查询串保留）、`/apps/reference/kitchen-sink/` 200、画廊 `/` 200、`manifest.json` 23 库、旧库截图 792 张 200

## 已知问题
- Playwright 固定 1.62.1、wrangler 4.127.1（minimumReleaseAge 策略，不得放宽）
- 非 React 框架的图标/字体切换允许标 n/a
- **部署机的 `shots/` 不入库**：`tools/assemble.mjs` 只拷本机存在的 `shots/<slug>`，fresh clone 直接 assemble+deploy 会把画廊 792 张截图删光。本轮做法：部署前从线上 `https://ui.zalize.com/shots/<slug>/<route>__<vp>__<theme>.png` 全量镜像回 `shots/`（792/792 命中）再 assemble。长期应把 shots 放到 R2 或在 release 阶段实跑 `pnpm shoot`
- 根 `pnpm build` 在小内存机器上需 `--concurrency=1`（见上）

## 体验官 / QA 遗留（第 3 轮报告，0 P0 / 0 P1；release 阶段未改代码）
P2：
- **QA-02**：`assemble.mjs` 自动把参考应用纳入 `manifest.json`，画廊首页出现「Acme Console（参考应用）」卡片（生产实查已出现），截图位显示「截图待生成」；tab 切到 `/orders` 等 6 条未实现路由时链到 `/apps/reference/orders` → 生产空体 404（QA-14）。与 brief §6「画廊首页本轮不接入」冲突。**下轮开工第一件事二选一并写进 `04-adr`**：接受接入（补 `gallery.json.routes`（QA-09）+ 把 `shots/reference` 纳入部署）或 assemble 按 `gallery.json.hidden` 过滤
- **QA-04 / UX P2-A**：登录页第三方登录三键、dashboard 375 搜索键、头像菜单 4 项点击零反馈；应复用 `orderAction` 的 `toast.info(<项>, { description: t("shell.nav.disabled.tip") })` 模式
- **UX P2-B**：登录错误 Alert 在修改邮箱后不清除（字段级错误会即时清除，节奏不一致）；建议 `update()` 时 `state === "error"` 则清 alert
- UX 第 2 轮 P2-新5（`?theme=` 链接下手动切主题刷新被弹回）第 3 轮未复验，沿用
P3：
- UX P3-A `document.title` 两页均「Acme Console」；P3-B 「记住我」后退回 login 不回填邮箱
- QA-03 `/login?state=success` 停留登录页不跳转；QA-06 vite/tailwind 在 `dependencies`；QA-08 a11y 未跑 768/1024；QA-09 `gallery.json.routes` 过时；QA-10 mock 邮箱域 `qimu-home.cn` 应改 `.example`；QA-11 `vite.config.ts` 6 处 `__dirname` → `import.meta.dirname`；QA-12 hifi login 字体走 jsdelivr；QA-13 集成分支改了 `apps/shadcn-ui/package.json` 一行；QA-14 站点级空体 404（可改 `not_found_handling: "404-page"` + `gallery/public/404.html`）；QA-15 `spaRoutes()` 正则过窄；QA-16 本地静态服务与生产 `auto-trailing-slash` 的 `/foo.html` 分支差异
- UX 第 2 轮 P3-新1 ~ P3-新6（全局搜索无反应、头像菜单前 4 项静默关闭、抽屉关闭按钮文案、跳到主内容焦点、`?state=success` 直达、品牌链接多余 Tab 停靠）第 3 轮未复验，沿用

## 下一轮建议
1. 先决 QA-02（画廊是否接入参考应用），再开新屏；决定写 `docs/frontend/04-adr.md`
2. 第 2 轮屏幕（brief §6 列出的后续轮次）：orders / form / settings / components / landing / chat，按 frontend-0to1-ai 流水线从阶段 0 增补 brief 屏幕清单开始，`FE01_APP_DIR=apps/reference`，每轮 ≤ `FE01_MAX_SCREENS`
3. 新一轮开始前顺手清掉 P2（QA-04 / UX P2-A / P2-B 均为几行 onClick / toast 改动）与 P3 中 QA-11、QA-10、UX P3-A/P3-B
4. release 流程固化：shots 持久化（R2 或 release 阶段 `pnpm shoot`）、`pnpm build --concurrency=1`、部署 token 用 `CLOUDFLARE_WORKERS_API_TOKEN`
5. 老库第 1 轮（libraries.json round=1，34 库）续跑 run `wfr-594bde6cabe04eed854f119c06bc78b6` 未结束，不再追加轮次；现有 `apps/*` 仅作原生样板留档
