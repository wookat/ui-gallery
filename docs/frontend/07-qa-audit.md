# 07 QA + 合规/安全审计：Acme Console 参考应用（阶段 7）

> 阶段 7 产物（frontend-0to1-ai 步骤 7，角色 qa/qa-engineer 兼合规与安全审计，CHARTER 四道把关中的第 1 与第 4 道）。
> 审计对象：`fe01/integration` @ `c7e47e6f3dabfba441ecf95ed8ef4aa316c2490e`（2026-09-08，第二轮；上一轮对象 `0b3c2e7`，其 QA-01「缺 dashboard」已随 `175686a` 合入解除）。输入：`docs/frontend/00-brief.md`。
> 本文只写报告，不改产品代码；所有结论均来自本机实跑或生产实查，命令与原始输出摘录见 §3。每条都标明「实跑 / 实查 / 代码核对」三种证据等级，未验证项见 §5。

## 0. 结论

**verdict = fix（1 项 P1，0 项 P0）。**

被审计提交上 `apps/reference` 的两屏（login `/login`、dashboard `/`）代码质量、可访问性、许可证、资产来源、secrets、供应链策略、mock 数据**全部通过**；上一轮 QA-01 与体验官走查的 P0-1 / P1-1 / P1-2 经 Playwright 复现脚本确认**已修复**（§3.7）。唯一 P1 不在两屏代码内，而在**部署契约**：brief §7 要求「部署沿用 `wrangler.jsonc`」，该配置 `not_found_handling: "none"` 且 `vite build` 只产出一份 `index.html`，因此上线后 `/apps/reference/login`（登录页——产品入口）直达 / 刷新 / 后退前进会 **404**；本地门禁全绿是因为 `tools/_shared.mjs` 的静态服务自带 index.html 回退，掩盖了这个差异。已用同配置已上线的 `apps/antd` 在 `ui.zalize.com` 实查复现（§1）。修复量约十行、属 release 阶段（阶段 7 后半）职责，但按 SKILL 阶段 7「无 P0/P1 → 合 main 部署」的口径，不能带着一个上线即 404 的入口路由过门。

| 级别 | 数量 | 编号 |
|---|---|---|
| P0 | 0 | — |
| P1 | 1 | QA-01 |
| P2 | 3 | QA-02 ~ QA-04 |
| P3 | 9 | QA-05 ~ QA-13 |

## 1. P0 / P1

### QA-01（P1）生产托管下 `/apps/reference/login` 与 `/kitchen-sink` 直达 / 刷新返回 404（登录页为产品入口）
- 证据（代码核对）：`wrangler.jsonc` → `"assets": { "directory": "./dist", "not_found_handling": "none", "html_handling": "auto-trailing-slash" }`；`apps/reference/vite.config.ts` `base: "/apps/reference/"`，`pnpm build` 产物只有 `dist/index.html`（无 `login.html` / `login/index.html`）；`src/app.tsx` 用 `createBrowserRouter`（history 路由），路由匹配全在客户端。Cloudflare Workers 静态资产 `not_found_handling: "none"` 对不存在的路径直接 404，不回退 SPA 入口。
- 证据（生产实查，2026-09-08）：同一 `wrangler.jsonc`、同样 `createBrowserRouter` 的已上线应用 `apps/antd`：`curl -o /dev/null -w '%{http_code}' https://ui.zalize.com/apps/antd/` → **200**；`…/apps/antd/login` → **404**；`…/apps/antd/dashboard` → **404**；`…/apps/antd` → 307（尾斜杠重定向）。`gallery/src/pages/index.astro` L54 生成的卡片链接恰为 `/apps/${slug}${route}`（如 `/apps/antd/login`），即画廊现有 login 卡片在生产上已是 404——这是**平台既有缺陷**，不是本轮引入，但参考应用是第一个把 `/login` 当产品入口而非画廊示例的 app，影响等级不同。
- 为什么本地门禁发现不了：`apps/reference/tools/_shared.mjs` `serveDist()` L83 `if (!existsSync(file) || !extname(file)) file = join(dist, "index.html")` —— 本地静态服务对任何无扩展名路径回退 `index.html`，`a11y.mjs` / `shoot.mjs` / 本报告 §3.7 走查脚本都跑在它上面，所以 `/login` 全绿；生产托管没有这条回退。
- 用户后果：① 收藏 / 分享 / 地址栏直接打开 `/apps/reference/login` → 404；② 在登录页刷新 → 404；③ dashboard「退出登录」`navigate("/login")` 后刷新 → 404；④ 登录成功后落地 `/apps/reference/?toast=login`（根路径，200）正常，所以「先到根再点」的路径不受影响。brief §3 核心任务 1「用工作邮箱进入自己的团队空间」的入口 URL 在生产上不可直达。
- 定级理由：入口路由在目标托管上不可达，属「上线即坏」；虽为托管配置层问题、修复量小，但阶段 7 = 集成 **上线**，QA/审计正是要在合 main 前拦下此类只在生产暴露的问题。
- 修复建议（不在本报告职责内执行，交 release 阶段 / 项目负责人）：任选其一，都不改设计稿与令牌——
  1. **推荐**：`apps/reference` 构建后为每个客户端路由生成同内容 HTML：`dist/login/index.html`、`dist/kitchen-sink/index.html`（Vite 小插件 `closeBundle` 里 `cpSync`，或 `build` 脚本追加一行 node 脚本）。配合 `html_handling: "auto-trailing-slash"`，`/apps/reference/login` → 307 → `/apps/reference/login/` → 200；react-router 对尾斜杠路径按同一路由匹配（需复走一次 §3.7 脚本确认 `/login/` 行为）。只影响 `apps/reference`，不动 `wrangler.jsonc` 与其他 app。
  2. 在 `wrangler.jsonc` 加 `not_found_handling: "single-page-application"`：**不可行**——它对所有 404 回退到站点根 `/index.html`（画廊首页），`/apps/reference/login` 会渲染画廊页而非登录页。
  3. 改为 hash 路由：违背 brief §4 的路径约定（`/login`、`/`）与 `content/*.md` 的 URL 文案，不建议。
- 修复后复验：`pnpm build && node tools/assemble.mjs` 后 `ls dist/apps/reference/login/index.html`；部署后 `curl -I https://ui.zalize.com/apps/reference/login` 期望 307→200；重跑 §3.2 三屏 a11y（无变化即可）。

## 2. P2 / P3

| 编号 | 级别 | 项 | 证据 | 建议 |
|---|---|---|---|---|
| QA-02 | P2 | `tools/assemble.mjs` 会自动把参考应用纳入 `dist/manifest.json`，画廊首页会出现「Acme Console（参考应用）」卡片，与 brief §6「画廊首页本轮不接入参考应用」冲突；且卡片链接 `/apps/reference/login` 撞上 QA-01 | 代码核对：`tools/assemble.mjs` L9–15 遍历 `apps/*`，只要 `dist/index.html` 存在就 `manifest.push(gallery.json)`；`gallery/src/pages/index.astro` L61 `fetch("/manifest.json")` 渲染全部条目，L53 截图路径 `/shots/reference/login__desktop__light.png`（`shots/` 不入库，部署机不 shoot 则显示「截图待生成」）。未实跑 assemble（需先 build gallery） | release 阶段二选一并写进 04-adr：接受接入（则须先解 QA-01 并把 `shots/reference` 纳入部署产物流程），或在 assemble 里按 `gallery.json` 加 `hidden: true` 过滤 |
| QA-03 | P2 | `/login?state=success` 仍停留在登录页（表单锁定 + 常驻 Toast），未按 `content/login.md` L52「success = 立即跳转 `/?toast=login`」执行；体验官 P2-1 仍开放 | 代码核对：`src/pages/login/index.tsx` L160 `locked = busy \|\| state === "success"`，L176–182 `state === "success"` → `toast.success(..., { duration: Infinity })`，无 `navigate`。真实提交路径（§3.7）不经过该态，只影响 `?state=success` 直达与截图矩阵 | 与 login 实现者、体验官对齐：要么 `?state=success` 直接 `<Navigate to="/?toast=login" replace>`（`shots.json` 的 success 条目改指 dashboard `success-toast`），要么在 content/login.md 把它改定义为「截图专用静态态」 |
| QA-04 | P2 | 登录页第三方登录三键、dashboard 顶栏 375 搜索键点击零反馈（无 `aria-disabled`、无 Tooltip / Toast），与同屏「忘记密码？」「免费注册」的 `aria-disabled + cursor-not-allowed` 表现不一致；体验官 P2-3 / P2-4 仍开放 | 代码核对：`login/index.tsx` L326–331 `<Button type="button" variant="secondary" block disabled={locked}>` 无 onClick；`dashboard/shell.tsx` L217 `mobile:inline-flex` 的搜索 `IconButton` 无 onClick、无 `aria-disabled` | 统一 AGENTS「可聚焦 aria-disabled + fg-muted + cursor-not-allowed」契约，并复用 `shell.nav.disabled.tip` 的 Tooltip 模式（文案已在 content/dashboard.md） |
| QA-05 | P3 | `/apps/reference`（无尾斜杠）在非 Cloudflare 托管 / 本地静态服务下渲染空白且无任何报错 | 实跑：`serveDist()` 打开 `${origin}/apps/reference` → `h1` 0 个、`#main` 0 个、console 0 条（§3.7 脚本 FAIL 1 项即此）。原因：`basename` 保留尾斜杠 `/apps/reference/`（`app.tsx` L33 注释已说明取舍），react-router 对 `/apps/reference` 视为 basename 外路径。生产上 `html_handling: "auto-trailing-slash"` 会 307 到 `/apps/reference/`（antd 实查 307），故生产不受影响 | 可接受；建议 `app.tsx` 对 `location.pathname === basename.slice(0,-1)` 做一次 `history.replaceState` 补斜杠，或在 `_shared.mjs` 静态服务里也做 307，让本地行为与生产一致 |
| QA-06 | P3 | `vite` / `tailwindcss` / `@tailwindcss/vite` 放在 `dependencies` 而非 `devDependencies` | `apps/reference/package.json`；`pnpm --filter reference licenses list --prod` 因而把构建链（lightningcss MPL-2.0、less、stylus 等）算进「生产依赖」 | 迁到 `devDependencies`（`vite build` 产物不含这些包，不改行为），使生产依赖清单与审计口径干净 |
| QA-07 | P3 | 第三方登录用 simple-icons（CC0-1.0）单色 Google / GitHub / 微信 路径 | `login/index.tsx` L72–91；brief §4.1 L38 / §5 L63 明示允许（CC0 单色 simple-icons），且不接真实 OAuth | 合规可接受（图标代码 CC0，商标归各持有者，「使用 X 继续」属指示性使用）。接真实 OAuth 时须按各家品牌指南（Google Sign-In branding、GitHub Logos and Usage、微信开放平台按钮规范）调整 |
| QA-08 | P3 | `tools/a11y.mjs` 只跑 1440 / 375；dashboard `shots.json` 声明的 `tablet`（1024）/ `tabletSm`（768）视口未进 a11y 矩阵 | 实跑：`a11y-dashboard` 输出 212 行全为 `desktop/` 106 + `mobile/` 106，`tablet` 0 行；`_shared.mjs` `viewports = { desktop, mobile }`，`extraViewports` 仅 shoot 用 | 375 / 1440 是 brief 定的验收视口，门禁口径正确；建议 a11y 也读 `shots.json` 的 `viewports` 字段（dashboard 768 的表格横滚 + 滑动提示、订单菜单断点正是 f221e98 修过的区域） |
| QA-09 | P3 | `apps/reference/gallery.json` `routes: ["/kitchen-sink"]` 过时，未列 `/login`、`/` | 文件本身；`gallery/src/pages/index.astro` 目前用 `packages/spec/contract.json` 而非 `gallery.json.routes` 渲染 tab，故无用户可见影响 | 随 QA-02 的决定一并更新为 `["/login", "/", "/kitchen-sink"]` 或删掉该字段 |
| QA-10 | P3 | 虚构邮箱域 `qimu-home.cn` 用了真实可注册 TLD | 实查：`dig +short qimu-home.cn` 无记录、`curl https://qimu-home.cn/` 000（不可达）；`content/README.md` L6 已声明虚构。当前无归属风险，但域名可被他人注册后产生「指向真实主体」的观感 | 下轮内容修订时改用 RFC 2606 / 6761 保留域（`qimu-home.example`），与 `name@example.com` 占位一致 |
| QA-11 | P3 | `pnpm build` 告警：`vite.config.ts:13` 使用 `__dirname`，与 Vite 未来默认 `configLoader: 'native'` 不兼容 | 实跑 §3.1 build 输出 `(!) Your Vite config uses features that are unsupported by configLoader: 'native' … Use import.meta.dirname instead` | 改 `import.meta.dirname`（Node 22 支持），一行 |
| QA-12 | P3 | `design/hifi/login/index.html` 从 `cdn.jsdelivr.net` 加载 Inter / Noto Sans SC | 该文件 L32–34；`design/hifi/dashboard/index.html` 用本地 `apps/shadcn-ui/node_modules/@fontsource-variable/*` | 设计稿不进生产（产物 grep 零外部字体 / 脚本请求）；建议两稿字体来源统一为本地，离线可复现 |
| QA-13 | P3 | 集成分支相对 `main` 改了 `apps/shadcn-ui/package.json`（+`@fontsource-variable/jetbrains-mono@5.3.0`） | `git diff main...HEAD -- apps/shadcn-ui`；来源 5d302ba，为 hifi/dashboard 基准图可复现借用该 app 的 node_modules；`0b3c2e7...HEAD` 无新增其他 app 改动 | brief §6「不改动现有 `apps/<其他库>/`」的技术性例外，一行 OFL 依赖、已在 04-adr 记录，可接受；下轮解耦 |

体验官走查（`07-ux-walkthrough.md`）其余开放项状态：P2-2 未知路径已改为回退 `/`（§3.7 PASS，关闭）；P2-5 改字段不清 Alert、P3-1 375 Toast 位置（c7e47e6 已调 offset，未逐像素复核）、P3-3 记住我无持久化、P3-4 `document.title` 恒为「Acme Console」（`index.html` L6，`src` 内无 `document.title`）—— 均仍开放，属体验优化不在 QA/审计定级内，交项目负责人排期。

## 3. 门禁与检查实跑记录

环境：Ubuntu，Node 22.23.2，pnpm 11.9.0，`pnpm install --frozen-lockfile` 成功，无 `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`；Playwright 1.62.1（`tools/shoot`）+ `pnpm exec playwright install chromium`（headless shell 1234）。所有命令在 `apps/reference/` 下执行，除特别说明。

### 3.1 lint / typecheck / build（检查项 ①）
| 命令 | 结果 |
|---|---|
| `pnpm lint`（`eslint . && node tools/no-hardcode.mjs`） | exit 0；eslint 0 error / 0 warning；`no-hardcode: 47 个文件通过` |
| `pnpm typecheck`（`tsc --noEmit -p tsconfig.app.json`） | exit 0 |
| `pnpm build`（`tsc -b && vite build`） | exit 0，`✓ built in 606ms`；产物 `index-*.css` 165.81 kB（gzip 59.86）、`react-*.js` 271.62 kB（gzip 86.61）、`charts-*.js` 381.99 kB（gzip 111.14）、`index-*.js` 247.37 kB（gzip 68.20）、`radix-*.js` 107.48 kB（gzip 34.75）+ 三字体 woff2；**无** chunk > 500 kB 告警（上一轮 QA-03 已随 f221e98 拆包消除）；唯一告警为 `__dirname`（QA-11） |

### 3.2 每屏 `node tools/a11y.mjs <screen>`（检查项 ②）
矩阵：视口 1440×900 / 375×812 × 主题 light / dark × `shots.json` 全部状态；每格 4 项断言（axe-core 4.13.0 `wcag2a / wcag2aa / wcag21aa / best-practice` serious+critical = 0；`scrollWidth ≤ 视口宽`；可点击件 `elementFromPoint` 实测热区 ≥ 40×40；Tab 焦点环可见）+ 每视口×主题 console error = 0。

| 屏 | 状态数 | PASS | FAIL | axe minor/moderate | 结果 |
|---|---|---|---|---|---|
| `login` | 7（default / invalid / loading / error / error-locked / error-network / success） | 116 | 0 | 无 | **ALL PASS**，exit 0，console error 0 |
| `dashboard` | 13（success / loading / empty / error / success-toast / -notifications / -account / -order-menu / -week / -day / -rail / -expanded / -drawer） | 212 | 0 | 无 | **ALL PASS**，exit 0，console error 0 |
| `kitchen-sink` | 6（default / popover / menu / sheet / tooltip / toast） | 100 | 0 | 无 | **ALL PASS**，exit 0，console error 0 |

补充（仓库根）：`node design/check-contrast.mjs` → **PASS**（正文 110 组最小 4.58:1 ≥ 4.5，light `fg-muted / neutral-soft`；图形 70 组最小 3.08:1 ≥ 3）。`node tools/compare.mjs` 像素对照属阶段 6 视觉 QA 职责，本报告未跑（c7e47e6 提交说明记录 login 28/28 ≥ 98.36%、dashboard 56/56 ≥ 98.41%，未复核）。

### 3.3 依赖许可证（检查项 ③）
`pnpm --filter reference licenses list --prod --json`（`apps/reference` 生产依赖树，210 个包）：

| 许可证 | 包数 | 备注 |
|---|---|---|
| MIT | 172 | react / react-dom / react-router / radix-ui / recharts / sonner / cn（shadcn-ui 官方包）/ tailwindcss / vite … |
| ISC | 23 | lucide-react、d3-* |
| OFL-1.1 | 3 | `@fontsource-variable/inter@5.3.0`、`@fontsource-variable/noto-sans-sc@5.3.0`、`@fontsource-variable/jetbrains-mono@5.3.0` |
| Apache-2.0 | 3 | class-variance-authority、detect-libc、less |
| BSD-3-Clause | 3 | d3-ease、source-map、source-map-js |
| MPL-2.0 | 2 | lightningcss、lightningcss-linux-x64-gnu（Tailwind v4 构建链，文件级弱 copyleft；不进浏览器产物，见 QA-06） |
| BlueOak-1.0.0 / 0BSD / MIT AND ISC / (MIT OR Apache-2.0) | 1 / 1 / 1 / 1 | sax / tslib / victory-vendor / atob |

结论：**无 GPL / AGPL / LGPL / SSPL / CC-BY / 商业或未知许可证**进入生产依赖（全 workspace `licenses list` 多出的 `CC-BY-4.0` 为 `caniuse-lite`，属其他 app 构建链）。字体三者均 OFL-1.1、随包自托管（`dist/assets/*.woff2`），产物 CSS/JS grep 无外部字体 / 脚本 URL。
`pnpm audit --prod`（exit 1，3 条：1 low / 2 moderate）：`echarts` ← `apps/ant-design-vue`；`decode-uri-component` ← `apps/daisyui`（`pnpm why` 归属 `@ui-gallery/gallery`）；`cookie` ← `apps/shadcn-svelte`（`naive-ui` 等）。三条路径均**不经过 `apps/reference`**（`pnpm why` 在 apps/reference 下逐一确认），reference 运行时与构建链 0 条 advisory。上一轮记录的 reference 构建链 `decode-uri-component` 路径本轮已不存在。

### 3.4 第三方文案 / 图片 / 商标（检查项 ④）
- 位图 / 字体文件：`git ls-files` 在 `apps/reference/`、`content/`、`mock/`、`design/`、`docs/frontend/` 内无任何 png/jpg/gif/webp/svg/woff/ttf 文件（`design/hifi/*/ref/*.png` 84 张基准图除外，允许）。
- 文案：`grep -rniE 'lorem|ipsum|placeholder\.com|unsplash|pravatar|randomuser|picsum|gravatar'` 在 `apps/reference/src`、`content`、`mock` 内仅命中 `content/README.md` 的禁令原文；`name@example.com` 为 RFC 2606 保留域示例。
- 商标 / 竞品：按 brief §8 提到的参考品牌（Linear / Vercel / Stripe / Notion / Figma / Shopify …）grep `src`、`content`、`mock`：命中仅 CSS `linear-gradient` 与「使用 GitHub 继续」OAuth 文案（QA-07）；品牌标 `src/components/composed/brand.tsx` 为自绘几何 SVG；界面图标只用 lucide-react（ISC）。
- 运行时外部请求（实跑，§3.7 脚本）：Playwright 监听 `/`、`/login`、`/kitchen-sink` 全部请求，**非本地 origin 请求 0 条**。

### 3.5 secrets / 供应链策略 / GitHub Actions（检查项 ⑤）
- `git ls-files` 无 `.env*`、`*.pem`、`*.key`、credential / secret / token 命名文件；对 `apps/reference`、`design`、`content`、`mock`、`docs/frontend`、`.devin` 全部跟踪文件按 `AKIA…|ghp_…|sk-…|-----BEGIN … PRIVATE KEY|api[_-]?key=|secret=|password=` 扫描 **0 命中**（排除 `passwordRule` 规则文字与校验文案 key）。`mock/user.json.demoCredentials.passwordRule = "任意 ≥ 8 位"`，非口令。
- `minimumReleaseAge`：`pnpm-workspace.yaml`、`.npmrc`、根/子 `package.json` 中均无该项，`git log main..HEAD -- pnpm-workspace.yaml .npmrc package.json` 0 条提交，即沿用与 `main` 相同的 pnpm 默认，未放宽；`pnpm install --frozen-lockfile` 无 `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`。
- 生成物：`git ls-files` 无 `dist/`、`node_modules/`、`shots/` 路径入库。
- GitHub Actions：仓库无 `.github/` 目录。
- `index.html` 含一段内联主题脚本（首帧防闪白）：当前 `wrangler.jsonc` 无 CSP 头，不构成问题；若日后加 CSP 需 nonce 或外置。

### 3.6 mock 数据个人信息（检查项 ⑥）
- `node mock/check.mjs` → `mock ok (2026-09-06T17:30:00+08:00)`。
- 人名 / 公司 / 邮箱：团队 5 人与订单客户均为虚构，`content/README.md` L6 已声明；邮箱域只有 `@qimu-home.cn`（DNS 无记录，QA-10）与 `@example.com`。
- 电话 / 证件 / 地址：订单只有 `phoneMasked`（`138****2046` 形式）；`grep -E '1[3-9][0-9]{9}|[0-9]{17}[0-9Xx]|出生日期式 8 位'` 在 `mock`、`content` **0 命中**；无 `phone` / `address` 明文字段。
- 头像：全部 `initial + avatarHue`，零图片。

### 3.7 回归与流程走查（Playwright 1.62.1，`serveDist()` 静态服务，脚本 24 项断言）
覆盖 `07-ux-walkthrough.md` 的 P0-1 / P1-1 / P1-2 / P2-2 与 c7e47e6 提交说明声称的修复；1440×900 鼠标 + 375×812 触屏（`hasTouch + isMobile`）：

| 项 | 结果 |
|---|---|
| `/` 渲染 dashboard（h1「仪表盘」，title「Acme Console」）；`/login` 渲染表单（1 form + 1 password） | PASS |
| 未知路径 `/nope/deep` → 回退 `/`（走查 P0-1 / P2-2 关闭） | PASS |
| `/apps/reference`（无尾斜杠）本地渲染 | **FAIL**（空白、无报错；生产 307 兜底，定 P3 = QA-05） |
| 登录首击：`ruolin.shen@qimu-home.cn` + 8 位密码，desktop `click` / mobile `tap` 一次即 `disabled` 进 loading，落地 `/?toast=login`（走查 P1-1 关闭） | PASS ×2 |
| 落地后出现「欢迎回来」Toast（`[data-sonner-toast]` 1 个） | PASS ×2 |
| 浏览器后退回 `/login`，按钮不再锁 loading（走查 P1-2 关闭；loading 已改为组件内 `submitting` 瞬态） | PASS ×2 |
| 错误账号 → `role=alert`「邮箱或密码不正确。连续 5 次失败后账号将锁定 15 分钟。」且停留 `/login`；`setOffline(true)` 提交 → 「网络异常，请检查连接后重试。」 | PASS ×2 |
| dashboard 账户菜单「退出登录」→ `/login` | PASS |
| 375 `scrollWidth ≤ 375`：`/`、`/login`、`/?state=error`、`/?state=empty`、`/?state=loading`、`/kitchen-sink` | PASS ×6（均 = 375） |
| 以上全部流程 console error / pageerror / requestfailed = 0；非本地 origin 请求 0 | PASS ×5 |

合计 **24 PASS / 1 FAIL**（唯一 FAIL 即 QA-05）。

## 4. 需求逐条对照（brief §4 / §5 / §6 / §7 与本审计相关项）
| brief 条目 | 结果 |
|---|---|
| §4 屏幕清单 2 屏（login + dashboard） | 两屏均在集成分支，路由 `/login`、`/`（§3.7） |
| §4.1 login 5 态 + `?alert=` 变体；成功跳 `/?toast=login` 由 dashboard 渲染 Toast | 真实提交路径通过（§3.7）；`?state=success` 直达仍停留 login（QA-03，P2） |
| §4.2 dashboard 13 个截图态 | a11y 212/0（§3.2） |
| §5 零位图 / OFL 字体 / Lucide / simple-icons CC0 | 通过（§3.3、§3.4） |
| §5 人名公司邮箱域虚构、无真实个人信息 | 通过（§3.6；QA-10 建议换保留域） |
| §6 不启用 Actions、不放宽 minimumReleaseAge、无 secrets | 通过（§3.5） |
| §6 不改其他 `apps/*`、`gallery/`、`packages/spec/` | 一行技术性例外（QA-13，P3）；`0b3c2e7...HEAD` 无新增 |
| §6 画廊首页本轮不接入参考应用 | assemble 会自动纳入（QA-02，P2） |
| §7 WCAG 2.2 AA：对比度 / 热区 ≥ 40 / 键盘 / 焦点环 | 通过（§3.2 三屏 428 项断言 0 FAIL；check-contrast PASS） |
| §7 375 无横向溢出、0 console error | 通过（§3.2、§3.7） |
| §7 lint / typecheck / build 全绿 | 通过（§3.1） |
| §7 部署沿用 `wrangler.jsonc` | **`/login` 直达 404（QA-01，P1）** |

## 5. 未验证项（如实声明）
- 未跑 `tools/shoot.mjs` + `tools/compare.mjs` 像素对照（阶段 6 视觉 QA 职责）；c7e47e6 提交说明的 compare 数字未复核。
- 未真机 / 真实浏览器手工走查（体验官职责）；§3.7 是 Playwright headless 复现，触屏用 `hasTouch + isMobile` 模拟。
- 768 / 1024 视口未做 a11y（QA-08）。
- 未实跑 `tools/assemble.mjs` 与 `wrangler deploy`（QA-01 / QA-02 的生产结论基于 `wrangler.jsonc` 代码核对 + 同配置已上线 app 的 `curl` 实查，未部署参考应用本身）。
- 未审计 `apps/<其他库>/`、`gallery/`、`packages/spec/` 内部（brief §6 非本轮范围），仅在 QA-01 / QA-02 涉及其与参考应用的接口处引用。
