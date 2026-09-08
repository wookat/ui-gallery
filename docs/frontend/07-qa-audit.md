# 07 QA + 合规/安全审计：Acme Console 参考应用（阶段 7）

> 阶段 7 产物（frontend-0to1-ai 步骤 7，角色 qa/qa-engineer 兼合规与安全审计，CHARTER 四道把关中的第 1 与第 4 道）。
> 审计对象：`fe01/integration` @ `aa1a1643cef490696c0440d74765e053afaa92e1`（2026-09-08，第三轮；上两轮对象 `0b3c2e7` → `c7e47e6`）。输入：`docs/frontend/00-brief.md`。
> 本文只写报告，不改产品代码；所有结论均来自本机实跑或生产实查，命令与原始输出摘录见 §3。每条都标明「实跑 / 实查 / 代码核对」三种证据等级，未验证项见 §5。

## 0. 结论

**verdict = pass（0 项 P0，0 项 P1）。**

`aa1a164` 相对上一轮审计对象 `c7e47e6` 只改了 3 个文件（`vite.config.ts` / `tools/_shared.mjs` / `pages/dashboard/index.tsx`），针对的是上一轮 QA-01（P1，生产托管下 `/apps/reference/login` 直达 404）与体验官 P1-新1（订单菜单选项不关闭、无反馈）。本轮实跑确认两项**均已修复**：

- **QA-01 关闭**：`pnpm build` 现在为每条非根路由落盘 `dist/login/index.html`、`dist/kitchen-sink/index.html`（与 `dist/index.html` 逐字节相同，资源路径为 `/apps/reference/assets/*` 绝对路径）；`tools/_shared.mjs` 静态服务已对齐 `wrangler.jsonc` 语义（目录缺尾斜杠 307 补斜杠并保留查询串、缺失 404、不再回退 SPA 入口），本地门禁不再掩盖路由落盘问题。Playwright 复现（§3.7）：`/apps/reference/login` → 307 → `/apps/reference/login/` → 200 渲染表单；`/login?state=error&theme=dark` 307 后查询串完整保留并渲染 `role=alert`；在 `/login/` 上刷新、退出登录后刷新均 200；`tools/assemble.mjs` 实跑后 `dist/apps/reference/login/index.html` 存在。生产侧 Cloudflare `auto-trailing-slash` 对「有 index.html 的目录」的 307 + 查询串保留行为用已上线的 `apps/antd` 实查复核（`/apps/antd?x=1` → 307 `/apps/antd/?x=1`）。
- **P1-新1 关闭**：`OrderMenu` 改为始终受控（`open: boolean`，去掉 `|| undefined`），四个菜单项 `onSelect` 关菜单并 `toast.info(<动作>, { description: 后续轮次提供 })`，文案 key 均在 `content/dashboard.md`（L17 / L73–77），时长取令牌 `--timing-toast-stay`。1440 鼠标 / 键盘 Enter / 375 触屏均复现「关菜单 + Toast」，禁用项点击不触发、同一菜单可重开、Escape 关闭（§3.7）。

其余检查项（lint / typecheck / build、三屏 a11y、许可证、资产来源、secrets、供应链策略、mock 个人信息）**全部通过**，与上一轮一致。上一轮 P2/P3 中 QA-05 随本次 `_shared.mjs` 改动一并关闭；其余仍开放并沿用编号，新增 3 条 P3（QA-14 ~ QA-16）。

| 级别 | 数量 | 编号 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 2 | QA-02、QA-04 |
| P3 | 12 | QA-03、QA-06 ~ QA-16 |

## 1. P0 / P1

无。上一轮 QA-01（P1）的关闭证据见 §0 与 §3.7 第 1–2 组、§3.8。

## 2. P2 / P3

| 编号 | 级别 | 状态 | 项 | 证据 | 建议 |
|---|---|---|---|---|---|
| QA-02 | P2 | 仍开放 | `tools/assemble.mjs` 自动把参考应用纳入 `dist/manifest.json`，画廊首页会出现「Acme Console（参考应用）」卡片，与 brief §6「画廊首页本轮不接入参考应用」冲突 | **本轮实跑**：`pnpm --filter @ui-gallery/gallery build && node tools/assemble.mjs` → `assembled 1 apps`，`manifest.json` 含 `reference`（本机其他 app 无 dist 故只有 1 条；生产机会与其他 app 并列）。`gallery/src/pages/index.astro` L54 卡片链接 `/apps/reference${routeOf(route)}`：`/login`、`/` 现已可达（QA-01 关闭），但 tab 切到 `/orders` 等 6 条 `contract.json` 路由时链到 `/apps/reference/orders` → 生产 404 空白（QA-14）；截图 `/shots/reference/*.png` 不入库，部署机不 shoot 则显示「截图待生成」 | release 阶段二选一并写进 04-adr：接受接入（补 `gallery.json.routes`（QA-09）、把 `shots/reference` 纳入部署产物），或在 assemble 里按 `gallery.json` 加 `hidden: true` 过滤 |
| QA-04 | P2 | 仍开放 | 登录页第三方登录三键、dashboard 顶栏 375 搜索键、头像菜单 4 项点击零反馈（无 `aria-disabled` / Tooltip / Toast），与同屏「忘记密码？」「免费注册」的 `aria-disabled + cursor-not-allowed` 契约及本次订单菜单的 Toast 反馈不一致；体验官 P2-新1 / P2-新2 / P2-新3 同题 | 代码核对：`login/index.tsx` L326–331 三个 `<Button variant="secondary" block disabled={locked}>` 无 onClick；`dashboard/shell.tsx` L217 搜索 `IconButton` 无 onClick、无 `aria-disabled`；L272–281 四个 `DropdownMenuItem` 无 onSelect | 复用本次 `orderAction` 的模式（`toast.info(<项>, { description: t("shell.nav.disabled.tip") })`），一处工具函数三处调用；文案已在 content |
| QA-03 | P3（↓自 P2） | 仍开放 | `/login?state=success` 停留在登录页（表单锁定 + 常驻 Toast），未按 `content/login.md` L52「success = 立即跳转 `/?toast=login`」执行 | 代码核对：`login/index.tsx` L160 `locked = busy \|\| state === "success"`，L176–182 无 `navigate`。真实提交路径（§3.7）不经过该态，只影响 `?state=success` 直达与截图矩阵；体验官第 2 轮已按此降为 P3-新5，本报告随之降级 | 二选一：`?state=success` → `<Navigate to="/?toast=login" replace>`（`shots.json` success 条目改指 dashboard `success-toast`），或在 content/login.md 把它改定义为「截图专用静态态」 |
| QA-06 | P3 | 仍开放 | `vite` / `tailwindcss` / `@tailwindcss/vite` 放在 `dependencies` 而非 `devDependencies` | `apps/reference/package.json`；`licenses list --prod` 因而把构建链（lightningcss MPL-2.0、less、stylus 等）算进「生产依赖」 | 迁到 `devDependencies`，使生产依赖清单与审计口径干净 |
| QA-07 | P3 | 可接受 | 第三方登录用 simple-icons（CC0-1.0）单色 Google / GitHub / 微信 路径 | `login/index.tsx` L72–91；brief §4.1 / §5 明示允许 | 接真实 OAuth 时按各家品牌指南调整 |
| QA-08 | P3 | 仍开放 | `tools/a11y.mjs` 只跑 1440 / 375；dashboard `shots.json` 的 `tablet`（1024）/ `tabletSm`（768）未进 a11y 矩阵 | 实跑：`a11y dashboard` 212 行全为 `desktop/` + `mobile/` | a11y 也读 `shots.json` 的 `viewports` |
| QA-09 | P3 | 仍开放 | `apps/reference/gallery.json` `routes: ["/kitchen-sink"]` 过时 | 文件本身；画廊目前用 `contract.json` 渲染 tab，无用户可见影响 | 随 QA-02 更新为 `["/login", "/", "/kitchen-sink"]` |
| QA-10 | P3 | 仍开放 | 虚构邮箱域 `qimu-home.cn` 为真实可注册 TLD | `mock/team.json` / `user.json` 共 10 处 `@qimu-home.cn`（§3.6） | 下轮内容修订改用 `.example` 保留域 |
| QA-11 | P3 | 仍开放（面扩大） | `vite.config.ts` 使用 `__dirname`，与 Vite 未来默认 `configLoader: 'native'` 不兼容 | 实跑 §3.1 build 告警 `(!) … __dirname (vite.config.ts:13:33)`；本次新增的 `spaRoutes()` 又加一处，现共 6 处（L13 / 44 / 45 / 47 / 48 / 52） | 全部改 `import.meta.dirname`（Node 22 支持） |
| QA-12 | P3 | 仍开放 | `design/hifi/login/index.html` 从 `cdn.jsdelivr.net` 加载字体 | 该文件 L32–34；设计稿不进生产 | 两稿字体来源统一为本地 |
| QA-13 | P3 | 可接受 | 集成分支相对 `main` 改了 `apps/shadcn-ui/package.json`（+`@fontsource-variable/jetbrains-mono`） | `git diff --stat main...HEAD`：`apps/reference`、`design`、`content`、`mock`、`docs/frontend`、`.devin`、`AGENTS.md`、`pnpm-lock.yaml` 之外仅此 1 行；`c7e47e6..HEAD` 无新增其他 app 改动 | 已在 04-adr 记录；下轮解耦 |
| QA-14 | P3 | 新增 | 生产托管下参考应用的**未知路径**（如 `/apps/reference/orders`、手误 URL）返回 Cloudflare 空体 404（`content-length: 0`），用户看到纯白页；本地静态服务对齐生产后同样 404。`src/app.tsx` 的 `path: "*" → Navigate("/")` 只对客户端导航生效 | 实查：`curl -D - https://ui.zalize.com/apps/antd/login` → `HTTP/2 404`、`content-length: 0`（同配置）；本地 `/apps/reference/nope`、`/nope/deep` → 404（§3.7）。属 `not_found_handling: "none"` 的站点级行为，`c7e47e6` 之前在生产上就是如此，本次只是让本地也暴露 | release 阶段站点级决定：`wrangler.jsonc` 改 `not_found_handling: "404-page"` 并在 `gallery/public/404.html` 放一页令牌色的「页面不存在 → 回画廊 / 回参考应用」（影响全站，非参考应用单独可修）；或接受现状 |
| QA-15 | P3 | 新增 | `spaRoutes()` 用正则 `^export const path = "([^"]+)"` 读页面路径覆盖，只认双引号、行首、单空格；写法稍有出入（单引号 / `as const` / 多空格）会静默回退到 `/<id>`，落盘目录与实际路由不一致且无告警 | 代码核对：`vite.config.ts` L26；当前仅 dashboard 用 `export const path = "/"`（`src/pages/dashboard/index.tsx` L29），格式匹配，本轮无实际影响 | 与 `src/app.tsx` 共用一个解析函数，或正则放宽为 `^export\s+const\s+path\s*=\s*["']([^"']+)["']` 并在不匹配但含 `export const path` 时抛错 |
| QA-16 | P3 | 新增 | 本地静态服务（`_shared.mjs serveDist`）与生产的差异仍剩一条：生产 `auto-trailing-slash` 对 `/foo` 且存在 `/foo.html` 时会直接服务，本地无此分支；参考应用没有 `*.html` 平铺文件，当前无影响 | 代码核对：`_shared.mjs` L85–93 | 记录即可，新增平铺 HTML 时再补 |

体验官走查（`07-ux-walkthrough.md` 第 2 轮）其余开放项状态：P1-新1 关闭（§3.7）；P2-新1 / P2-新2 / P2-新3 并入 QA-04；P2-新4（改邮箱后 Alert 停留）、P2-新5（`?theme=` 链接下手动切主题刷新被弹回）、P3-新1 ~ P3-新6 均仍开放，属体验优化不在 QA/审计定级内，交项目负责人排期。

## 3. 门禁与检查实跑记录

环境：Ubuntu，Node 22.23.2，pnpm 11.9.0，`pnpm install --frozen-lockfile` 成功（1m01s），输出中 `MINIMUM_RELEASE_AGE` 0 次命中；Playwright 1.62.1（`tools/shoot`）+ `pnpm exec playwright install chromium`（headless shell 1234）。所有命令在 `apps/reference/` 下执行，除特别说明。

### 3.1 lint / typecheck / build（检查项 ①）
| 命令 | 结果 |
|---|---|
| `pnpm lint`（`eslint . && node tools/no-hardcode.mjs`） | exit 0；eslint 0 error / 0 warning；`no-hardcode: 47 个文件通过` |
| `pnpm typecheck`（`tsc --noEmit -p tsconfig.app.json`） | exit 0 |
| `pnpm build`（`tsc -b && vite build`） | exit 0，`✓ built in 636ms`；产物 `index-*.css` 165.81 kB（gzip 59.86）、`react-*.js` 271.62 kB（gzip 86.61）、`charts-*.js` 381.99 kB（gzip 111.14）、`index-*.js` 247.58 kB（gzip 68.26）、`radix-*.js` 107.48 kB（gzip 34.75）+ 字体 woff2；**无** chunk > 500 kB 告警；唯一告警为 `__dirname`（QA-11）。`find dist -name index.html` → `dist/index.html`、`dist/login/index.html`、`dist/kitchen-sink/index.html`；`diff dist/index.html dist/login/index.html` → 相同 |

### 3.2 每屏 `node tools/a11y.mjs <screen>`（检查项 ②）
矩阵：视口 1440×900 / 375×812 × 主题 light / dark × `shots.json` 全部状态；每格 4 项断言（axe-core 4.13.0 `wcag2a / wcag2aa / wcag21aa / best-practice` serious+critical = 0；`scrollWidth ≤ 视口宽`；可点击件 `elementFromPoint` 实测热区 ≥ 40×40；Tab 焦点环可见）+ 每视口×主题 console error = 0。本轮 a11y 跑在已对齐生产语义的静态服务上（`pageUrl` 生成的 `/login?…` 经 307 → `/login/?…`）。

| 屏 | 状态数 | PASS | FAIL | axe minor/moderate | 结果 |
|---|---|---|---|---|---|
| `login` | 7（default / invalid / loading / error / error-locked / error-network / success） | 116 | 0 | 0 行 | **ALL PASS**，exit 0，console error 0 |
| `dashboard` | 13（success / loading / empty / error / success-toast / -notifications / -account / -order-menu / -week / -day / -rail / -expanded / -drawer） | 212 | 0 | 0 行 | **ALL PASS**，exit 0，console error 0 |
| `kitchen-sink` | 6（default / popover / menu / sheet / tooltip / toast） | 100 | 0 | 0 行 | **ALL PASS**，exit 0，console error 0 |

补充（仓库根）：`node design/check-contrast.mjs` → **PASS**（正文 110 组最小 4.58:1 ≥ 4.5；图形 70 组最小 3.08:1 ≥ 3；exempt 6）。`node tools/compare.mjs` 像素对照属阶段 6 视觉 QA 职责，本报告未跑（`aa1a164` 提交说明记录 dashboard 56/56 ≥ 98.41%、login 28/28 ≥ 98.36%，未复核）。

### 3.3 依赖许可证（检查项 ③）
`pnpm --filter reference licenses list --prod --json`（`apps/reference` 生产依赖树，210 个包，与上一轮完全一致——本次提交未改依赖）：

| 许可证 | 包数 | 备注 |
|---|---|---|
| MIT | 172 | react / react-dom / react-router / radix-ui / recharts / sonner / cn / tailwindcss / vite … |
| ISC | 23 | lucide-react、d3-* |
| OFL-1.1 | 3 | `@fontsource-variable/inter@5.3.0`、`@fontsource-variable/noto-sans-sc@5.3.0`、`@fontsource-variable/jetbrains-mono@5.3.0` |
| Apache-2.0 | 3 | class-variance-authority、detect-libc、less |
| BSD-3-Clause | 3 | d3-ease、source-map、source-map-js |
| MPL-2.0 | 2 | lightningcss、lightningcss-linux-x64-gnu（Tailwind v4 构建链，不进浏览器产物，见 QA-06） |
| BlueOak-1.0.0 / 0BSD / MIT AND ISC / (MIT OR Apache-2.0) | 1 / 1 / 1 / 1 | sax / tslib / victory-vendor / atob |

结论：**无 GPL / AGPL / LGPL / SSPL / CC-BY / 商业或未知许可证**进入生产依赖。字体三者均 OFL-1.1、随包自托管（`dist/assets/*.woff2`）；产物 CSS/JS 中出现的外部 URL 仅为 W3C 命名空间、react.dev / reactrouter.com 错误说明链接、tailwindcss.com 版权注释，**无运行时外部字体 / 脚本请求**（§3.7 亦实测 0 条）。
`pnpm audit --prod`（exit 1，3 条：1 low / 2 moderate）：`echarts` ← `apps/ant-design-vue`；`decode-uri-component` ← `apps/daisyui` / `heroui` / `kobalte` 构建链；`cookie` ← `apps/shadcn-svelte`。三条路径均**不经过 `apps/reference`**，reference 运行时与构建链 0 条 advisory。

### 3.4 第三方文案 / 图片 / 商标（检查项 ④）
- 位图 / 字体文件：`git ls-files` 在 `apps/reference/`、`content/`、`mock/`、`design/`、`docs/frontend/`、`.devin/` 内无任何 png/jpg/gif/webp/svg/woff/ttf/ico 文件（`design/hifi/*/ref/*.png` 84 张基准图除外，允许）。
- 文案：`grep -rniE 'lorem|ipsum|placeholder\.com|unsplash|pravatar|randomuser|picsum|gravatar|faker'` 在 `apps/reference/src`、`content`、`mock`、`design/hifi`、`design/wireframes` 内仅命中 `content/README.md` 的禁令原文与两份 hifi `check.mjs` 的检测正则；`name@example.com` 为 RFC 2606 保留域示例。
- 商标 / 竞品：按 brief §8 参考品牌（Linear / Vercel / Stripe / Notion / Figma / Shopify / antd / Material …）grep `src`、`content`、`mock`：命中仅 CSS `linear infinite` 动画与 Recharts `type="linear"`；品牌标 `src/components/composed/brand.tsx` 为自绘几何 SVG；界面图标只用 lucide-react（ISC）。
- 运行时外部请求（实跑，§3.7 脚本）：Playwright 监听 `/`、`/login/`、`/kitchen-sink/` 及全部流程请求，**非本地 origin 请求 0 条**。

### 3.5 secrets / 供应链策略 / GitHub Actions（检查项 ⑤）
- `git ls-files` 无 `.env*`、`*.pem`、`*.key`、credential / secret 命名文件（文件名含 `token` 的仅 `design/tokens.json` / `tokens.css` / `build-tokens.mjs` / 模板 `tokens.json`，为设计令牌）；对 `apps/reference`、`design`、`content`、`mock`、`docs/frontend`、`.devin` 全部跟踪文件按 `AKIA…|ghp_…|sk-…|-----BEGIN … PRIVATE KEY|api[_-]?key=|secret=|password=` 扫描，唯一命中为 `login/index.tsx` L154 的文案 key `password: "login.error.password.short"`，非口令。
- `minimumReleaseAge`：`pnpm-workspace.yaml`、`.npmrc`、根/子 `package.json` 中均无该项；`git log main..HEAD -- pnpm-workspace.yaml .npmrc package.json` 0 条提交，即沿用与 `main` 相同的 pnpm 默认，未放宽；`pnpm install --frozen-lockfile` 无 `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`。
- 生成物：`git ls-files` 无 `dist/`、`node_modules/`、`shots/` 路径入库；本轮 build / assemble 产物已在本机清理，`git status` 干净。
- GitHub Actions：仓库无 `.github/` 目录。
- `index.html`（及其两份路由副本）含一段内联主题脚本（首帧防闪白）：当前 `wrangler.jsonc` 无 CSP 头，不构成问题；若日后加 CSP 需 nonce 或外置。
- 本地静态服务 `serveDist()` 仅监听 `127.0.0.1` 随机端口，属开发工具；对 `/apps/reference/../../package.json` 与 `%2e%2e` 编码变体实测均 404，无目录穿越。

### 3.6 mock 数据个人信息（检查项 ⑥）
- `node mock/check.mjs` → `mock ok (2026-09-06T17:30:00+08:00)`。
- 人名 / 公司 / 邮箱：团队 5 人与订单客户均为虚构（`content/README.md` L6 声明）；邮箱域只有 `@qimu-home.cn` 10 处（QA-10）与 `@example.com` 2 处。
- 电话 / 证件 / 长数字：`grep -E '1[3-9][0-9]{9}|[0-9]{17}[0-9Xx]|[0-9]{15,19}'` 在 `mock`、`content` **0 命中**（排除 `138****2046` 形式的 `phoneMasked`）；无 `phone` / `address` / `idCard` 明文字段。
- 头像：全部 `initial + avatarHue`，零图片。

### 3.7 回归与流程走查（Playwright 1.62.1，`serveDist()` 静态服务，脚本 55 项断言）
覆盖 `aa1a164` 提交说明声称的三项修复（路由落盘 / 静态服务对齐生产 / 订单菜单）、上一轮 QA-01 / QA-05、体验官 P1-新1 与前两轮已关闭项的回归；1440×900 鼠标 + 375×812 触屏（`hasTouch + isMobile`）：

| 组 | 项 | 结果 |
|---|---|---|
| HTTP 契约 | `/apps/reference` → 307 `/apps/reference/`；`/apps/reference/` → 200；`/login` → 307 `/login/`；`/login?state=error&theme=dark` → 307 `/login/?state=error&theme=dark`（查询串保留）；`/login/` → 200；`/kitchen-sink` → 307 → 200；`/login/index.html` → 200；`/nope`、`/nope/deep`、`/apps/other/`、`/apps/referencex/` → 404 | PASS ×12 |
| 直达渲染 | `/login` 直达 → 地址栏补斜杠并渲染 1 form + 1 password；`/login?state=error` 直达 → `role=alert` ≥ 1；`/login/?state=error` 刷新仍渲染；`/kitchen-sink` 直达 → 307 → h1 | PASS ×4 ×2 视口 |
| 登录流程（自 `/login/` 出发） | `ruolin.shen@qimu-home.cn` + 8 位密码首击即 `disabled` 进 loading，落地 `/?toast=login`；「欢迎回来」Toast；后退回 `/login/` 按钮未锁 | PASS ×3 ×2 视口 |
| 订单菜单（P1-新1） | 可见触发器 5 个；点开 → `role=menu` 可见；选「查看详情」→ 菜单关闭 + Toast「查看详情 / 后续轮次提供」；同一菜单可再次打开；Escape 关闭；第 2 行 2 个禁用项 `force` 点击不触发 Toast、不关菜单 | PASS ×6 ×2 视口 |
| 键盘（仅 1440） | 触发器聚焦 + Enter 打开；ArrowDown + Enter 选中 → 菜单关闭 + Toast | PASS ×2 |
| 退出登录 + 刷新（QA-01） | 账号菜单「退出登录」→ `/login`；在 `/login` 刷新 → 307 → 200 渲染表单 | PASS ×2 ×2 视口 |
| 375 `scrollWidth ≤ 375` | `/`、`/login/`、`/?state=error`、`/?state=empty`、`/?state=loading`、`/kitchen-sink/` | PASS ×6（均 = 375） |
| 洁净度 | 两视口 console error / pageerror / requestfailed = 0；非本地 origin 请求 = 0 | PASS ×3 |

合计 **55 PASS / 0 FAIL**。上一轮的唯一 FAIL（QA-05 `/apps/reference` 无尾斜杠本地空白）本轮变为 307 → 200，关闭。

### 3.8 组装与生产契约（brief §7「须被 assemble 组装」「部署沿用 wrangler.jsonc」）
- 实跑（仓库根）：`pnpm --filter @ui-gallery/gallery build`（astro，1.6s）→ `node tools/assemble.mjs` → `assembled 1 apps`；`dist/apps/reference/{index,login/index,kitchen-sink/index}.html` 三份俱在；`dist/manifest.json` 含 `reference`（QA-02）。随后 `rm -rf dist`，未入库。
- 生产实查（2026-09-08）：`ui.zalize.com` 上同一 `wrangler.jsonc` 的 `apps/antd`：`/apps/antd` → 307 `/apps/antd/`；`/apps/antd?x=1` → 307 `/apps/antd/?x=1`（查询串保留）；`/apps/antd/` → 200；`/apps/antd/login` → 404 空体。据此推断部署后 `/apps/reference/login` 将 307 → `/apps/reference/login/` → 200；**参考应用本身尚未部署**（`/apps/reference/` 当前 404），最终以部署后 `curl -I https://ui.zalize.com/apps/reference/login` 为准（release 阶段复验项）。

## 4. 需求逐条对照（brief §4 / §5 / §6 / §7 与本审计相关项）
| brief 条目 | 结果 |
|---|---|
| §4 屏幕清单 2 屏（login + dashboard） | 两屏均在集成分支，路由 `/login`、`/`；直达 / 刷新路径已落盘（§3.7） |
| §4.1 login 5 态 + `?alert=` 变体；成功跳 `/?toast=login` 由 dashboard 渲染 Toast | 真实提交路径通过（§3.7）；`?state=success` 直达仍停留 login（QA-03，P3） |
| §4.2 dashboard 13 个截图态；订单操作菜单 | a11y 212/0（§3.2）；菜单选项关闭 + 反馈（§3.7） |
| §5 零位图 / OFL 字体 / Lucide / simple-icons CC0 | 通过（§3.3、§3.4） |
| §5 人名公司邮箱域虚构、无真实个人信息 | 通过（§3.6；QA-10 建议换保留域） |
| §6 不启用 Actions、不放宽 minimumReleaseAge、无 secrets | 通过（§3.5） |
| §6 不改其他 `apps/*`、`gallery/`、`packages/spec/` | 一行技术性例外（QA-13，P3）；`c7e47e6..HEAD` 无新增 |
| §6 画廊首页本轮不接入参考应用 | assemble 会自动纳入（QA-02，P2，release 阶段决定） |
| §7 WCAG 2.2 AA：对比度 / 热区 ≥ 40 / 键盘 / 焦点环 | 通过（§3.2 三屏 428 项断言 0 FAIL；check-contrast PASS） |
| §7 375 无横向溢出、0 console error | 通过（§3.2、§3.7） |
| §7 lint / typecheck / build 全绿 | 通过（§3.1） |
| §7 被 `tools/assemble.mjs` 组装进 `dist/apps/reference/` | 通过（§3.8 实跑） |
| §7 部署沿用 `wrangler.jsonc` | 路由落盘后与 `auto-trailing-slash` + `not_found_handling: none` 兼容（§3.7 本地对齐 + §3.8 同配置生产实查）；未知路径空 404 为站点级既有行为（QA-14，P3） |

## 5. 未验证项（如实声明）
- 未跑 `tools/shoot.mjs` + `tools/compare.mjs` 像素对照（阶段 6 视觉 QA 职责）；`aa1a164` 提交说明的 compare 数字未复核。
- 未真机 / 真实浏览器手工走查（体验官职责）；§3.7 是 Playwright headless 复现，触屏用 `hasTouch + isMobile` 模拟。
- 768 / 1024 视口未做 a11y（QA-08）。
- 未实跑 `wrangler deploy`；生产 307 / 404 行为基于同配置已上线 `apps/antd` 的 `curl` 实查外推，参考应用本身部署后需复验 `/apps/reference/login`（§3.8）。
- 未审计 `apps/<其他库>/`、`gallery/`、`packages/spec/` 内部（brief §6 非本轮范围），仅在 QA-02 / QA-14 涉及其与参考应用的接口处引用。
