# UI Gallery — 交接上下文

更新：2026-09-08（fe01 第 1 轮 release）

## 仓库 / 服务
- 代码：https://github.com/wookat/ui-gallery （直接提交 main；无 GitHub Actions，验收 = 本地 lint/typecheck/build 全绿即合）
- 线上：https://ui.zalize.com （Cloudflare Workers 静态资产，`wrangler.jsonc`，`pnpm assemble && pnpm exec wrangler deploy`，账号 ddff52d24ee44e21a021c15eaffcc86d；Pages 项目创建被 Cloudflare 拦截「Subdomain is blocked」，故用 Workers）
  - 部署凭据：会话 secret `CLOUDFLARE_WORKERS_API_TOKEN`（`CLOUDFLARE_ADMIN_API_TOKEN` 对 `workers/services` 返回 10000 认证错误，不可用）
  - 参考应用：https://ui.zalize.com/apps/reference/ （dashboard）、https://ui.zalize.com/apps/reference/login/ 、https://ui.zalize.com/apps/reference/kitchen-sink/
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
