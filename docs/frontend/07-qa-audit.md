# 07 QA + 合规/安全审计：Acme Console 参考应用（阶段 7）

> 阶段 7 产物（frontend-0to1-ai 步骤 7，角色 qa/qa-engineer 兼合规与安全审计，CHARTER 四道把关中的第 1 与第 4 道）。
> 审计对象：`fe01/integration` @ `0b3c2e7e425d2a2f301df8b7bf03589ca0d20f91`（2026-09-07）。输入：`docs/frontend/00-brief.md`。
> 本文只写报告，不改产品代码；所有结论均来自本机实跑，命令与原始输出摘录见 §3。

## 0. 结论

**verdict = fix（1 项 P1，0 项 P0）。**

被审计提交上 `apps/reference` 的代码质量、可访问性、许可证、资产来源、secrets、供应链策略、mock 数据均**无缺陷**；唯一 P1 是**集成分支缺 brief 屏幕清单中的 `dashboard` 屏**（`fe01/screen-dashboard` 尚未合回），导致 login 提交成功后的目标路由 `/?toast=login` 落到 `/kitchen-sink`。合入 dashboard 后本报告 §3 的门禁需重跑一次（对 `fe01/screen-dashboard@f221e98` 的预跑结果已附在 §3.7，全部通过）。

| 级别 | 数量 | 编号 |
|---|---|---|
| P0 | 0 | — |
| P1 | 1 | QA-01 |
| P2 | 0 | — |
| P3 | 6 | QA-02 ~ QA-07 |

## 1. P0 / P1

### QA-01（P1）集成分支缺 dashboard 屏，login 成功跳转落到 kitchen-sink
- 证据：`apps/reference/src/pages/` 只有 `kitchen-sink/`、`login/`；`git merge-base --is-ancestor origin/fe01/screen-dashboard origin/fe01/integration` → **NOT_MERGED**（`fe01/screen-dashboard@f221e98` 基于 `46d33b8`，比集成分支的 login 合入更早，未合回）。brief §4 屏幕清单要求本轮 2 屏（login + dashboard）。
- 后果：`src/app.tsx` 无 `/` 页面时 `fallback = pages[0]`（按路径排序为 `/kitchen-sink`），因此 login 页真实提交（`ruolin.shen@qimu-home.cn` + ≥8 位密码）后 `navigate("/?toast=login")` 落到组件基准页并弹「欢迎回来」Toast；brief §4.1「成功跳 `/?toast=login`，由 dashboard 渲染 Toast」在集成分支上不成立。
- 定级理由：不是代码缺陷，是集成完整性缺口；但按 SKILL 阶段 7「两份报告无 P0/P1 → 合 main」的口径，缺一屏不得进 release，故为 P1。
- 修复建议（不在本报告职责内执行）：合并 `fe01/screen-dashboard` → `fe01/integration`（注意该分支不含 login 合入，合并涉及 53 个文件，含 `src/app.tsx` / `vite.config.ts` / `content/login.md` 等两侧都改过的文件，需人工核对冲突），随后重跑 §3.1–3.2 全部门禁与 `node tools/a11y.mjs dashboard`。§3.7 已给出 dashboard 分支单独门禁结果供参考。

## 2. P2 / P3

| 编号 | 级别 | 项 | 证据 | 建议 |
|---|---|---|---|---|
| QA-02 | P3 | `vite` / `tailwindcss` / `@tailwindcss/vite` 放在 `dependencies` 而非 `devDependencies` | `apps/reference/package.json`；因此 `pnpm --filter reference licenses list --prod` 与 `pnpm audit --prod` 把构建链（`vite>stylus>css>source-map-resolve>decode-uri-component@0.2.2`，GHSA moderate，仅构建期）算进「生产依赖」 | 迁到 `devDependencies`（不改行为，`vite build` 产物不含这些包），使生产依赖清单与审计口径干净 |
| QA-03 | P3 | 单 chunk 975 kB（gzip 291 kB），Vite 构建告警「chunks larger than 500 kB」 | §3.1 build 输出 | `fe01/screen-dashboard@f221e98` 已做 `charts` 拆包（build 输出 `charts-*.js` 382 kB），合入后自然消除；无需单独修 |
| QA-04 | P3 | `design/hifi/login/index.html` 从 `cdn.jsdelivr.net` 加载 Inter / Noto Sans SC | 该文件第 32–34 行 `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/...">`；`design/hifi/dashboard/index.html` 则用本地 `apps/shadcn-ui/node_modules/@fontsource-variable/*` | 设计稿不进生产（`apps/reference` 产物经 grep 确认零外部字体/脚本请求），不影响门禁；建议下轮把两稿字体来源统一为本地，离线可复现 |
| QA-05 | P3 | 集成分支改了 `apps/shadcn-ui/package.json`（+`@fontsource-variable/jetbrains-mono@5.3.0`） | `git diff main origin/fe01/integration -- apps/shadcn-ui`；来源 5d302ba，为 hifi/dashboard 基准图可复现而借用该 app 的 node_modules | brief §6「不改动现有 `apps/<其他库>/`」的技术性例外，一行 OFL 依赖、已在提交说明与 04-adr 记录，可接受；建议下轮把设计稿字体依赖放到 `design/` 自己的 package 或复用 `apps/reference` 的 node_modules，解除耦合 |
| QA-06 | P3 | 第三方登录用 simple-icons（CC0-1.0）单色 Google / GitHub / 微信 路径 | `apps/reference/src/pages/login/index.tsx` L72–91；brief §4.1 / §10-E 明示允许，且不接真实 OAuth | 合规上可接受（simple-icons 代码 CC0，商标归各自持有者；「使用 X 继续」属指示性使用）。接真实 OAuth 时须按各家品牌指南（Google Sign-In branding、GitHub Logos and Usage、微信开放平台按钮规范）调整按钮样式 |
| QA-07 | P3 | `tools/a11y.mjs` 只跑 1440 / 375 两个视口 | `apps/reference/tools/_shared.mjs` `viewports = { desktop, mobile }`；brief §7 断点 375 / 768 / 1024 / 1440 | 375 与 1440 是 brief 定的验收视口，门禁口径正确；建议后续把 768 / 1024 加进 a11y 矩阵（dashboard 的 `shots.json` 已声明 `tablet` / `tabletSm`） |

## 3. 门禁与检查实跑记录

环境：Ubuntu，Node 22，pnpm 11，`pnpm install --frozen-lockfile` 成功，无 `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`；Playwright 1.62.1（`tools/shoot`）+ `pnpm exec playwright install chromium` 装的 headless shell。所有命令在 `apps/reference/` 下执行，除特别说明。

### 3.1 lint / typecheck / build（检查项 ①）
| 命令 | 结果 |
|---|---|
| `pnpm lint`（`eslint . && node tools/no-hardcode.mjs`） | exit 0；eslint 0 error / 0 warning；`no-hardcode: 43 个文件通过` |
| `pnpm typecheck`（`tsc --noEmit -p tsconfig.app.json`） | exit 0 |
| `pnpm build`（`tsc -b && vite build`） | exit 0，`✓ built in 709ms`；产物 `index-*.js` 975.23 kB（gzip 291.45 kB）、`index-*.css` 160.54 kB，另 Noto Sans SC / Inter / JetBrains Mono woff2 分包；告警 chunk > 500 kB（QA-03） |

### 3.2 每屏 `node tools/a11y.mjs <screen>`（检查项 ②）
矩阵：视口 1440×900 / 375×812 × 主题 light / dark × `shots.json` 全部状态；每格 4 项断言（axe-core 4.13.0 `wcag2a / wcag2aa / wcag21aa / best-practice` serious+critical = 0；`scrollWidth ≤ 视口宽`；可点击件实测热区 ≥ 40×40；Tab 焦点环可见）+ 每视口×主题 console error = 0。

| 屏 | 状态数 | PASS | FAIL | axe minor/moderate | 结果 |
|---|---|---|---|---|---|
| `login` | 7（default / invalid / loading / error / error-locked / error-network / success） | 117 | 0 | 无 | **ALL PASS**，console error 0（4/4 组） |
| `kitchen-sink` | 6（default / popover / menu / sheet / tooltip / toast） | 101 | 0 | 无 | **ALL PASS**，console error 0（4/4 组） |
| `dashboard` | — | — | — | — | 集成分支上不存在（QA-01）；分支预跑见 §3.7 |

补充：`node design/check-contrast.mjs` → PASS（正文 110 组最小 4.58:1 ≥ 4.5；图形 70 组最小 3.08:1 ≥ 3；`fg-disabled` 6 组按契约豁免）。`node tools/compare.mjs login` 需先 `shoot`，属阶段 6 视觉 QA 职责，本报告未跑。

### 3.3 依赖许可证（检查项 ③）
`pnpm --filter reference licenses list --prod --json`（`apps/reference` 生产依赖树，210 个包）：

| 许可证 | 包数 | 备注 |
|---|---|---|
| MIT | 172 | react / react-dom / react-router / radix-ui / recharts / sonner / cn（shadcn-ui 官方包）/ tailwindcss / vite … |
| ISC | 23 | lucide-react、d3-* |
| OFL-1.1 | 3 | `@fontsource-variable/inter@5.3.0`、`@fontsource-variable/noto-sans-sc@5.3.0`、`@fontsource-variable/jetbrains-mono@5.3.0` |
| Apache-2.0 | 3 | class-variance-authority、detect-libc、less |
| BSD-3-Clause | 3 | d3-ease、source-map、source-map-js |
| MPL-2.0 | 2 | lightningcss、lightningcss-linux-x64-gnu（Tailwind v4 构建链，弱 copyleft、文件级；不进浏览器产物） |
| BlueOak-1.0.0 / 0BSD / MIT AND ISC / (MIT OR Apache-2.0) | 1 / 1 / 1 / 1 | sax / tslib / victory-vendor / atob |

结论：**无 GPL / AGPL / LGPL / SSPL / 商业或未知许可证**；字体三者均为 OFL-1.1 且随包自托管（构建产物 `dist/assets/*.woff2`，grep 产物 CSS/JS 无任何外部字体或脚本 URL）。`pnpm audit --prod`：3 条 advisory 全部来自其他 workspace（`apps/shadcn-svelte` cookie、`apps/ant-design-vue` echarts、`apps/daisyui`/`apps/heroui` 构建链）以及 reference 的**构建期**链 `decode-uri-component`（QA-02），`apps/reference` 运行时依赖 0 条。

### 3.4 第三方文案 / 图片 / 商标（检查项 ④）
- 位图：`git ls-tree` 集成分支，`apps/reference/`、`content/`、`mock/`、`design/`（除 `design/hifi/*/ref/*.png` 基准图，允许）无任何 png/jpg/svg/ico/字体文件；`src` 与 hifi 无 `<img>` / `url()`。
- 文案：`content/login.md`、`content/dashboard.md`、`content/kitchen-sink.md` 全部为中文原创、带 key；`grep -rniE 'lorem|ipsum|张三|李四|John Doe|placehold|unsplash|pravatar|randomuser|Math.random|faker'` 在 content / mock / design / src / docs 内 0 命中（`name@example.com` 为 RFC 2606 保留域示例，`sample.input.placeholder` 为 key 名）。
- 商标：品牌标 `src/components/composed/brand.tsx` 为自绘 3 线几何 SVG；第三方登录图标为 simple-icons CC0 单色路径（QA-06）；界面图标只用 lucide-react（ISC）。brief §8 的 Linear / Vercel / Stripe 仅作「克制感」参考，仓库内无其素材、文案或商标字样。

### 3.5 secrets / 供应链策略 / GitHub Actions（检查项 ⑤）
- `git ls-tree -r origin/fe01/integration` 无 `.env*`、`*.pem`、`*.key`、credential 类文件；`git diff main..fe01/integration`（排除 lockfile 与 png）按 `api[_-]?key|secret|token|AKIA|sk-|ghp_|-----BEGIN|Bearer` 扫描，命中全部为 `password` 字段/组件命名（`PasswordInput`、`autocomplete=current-password`、校验文案），**无凭据**。`mock/user.json.demoCredentials.passwordRule` 为规则文字「任意 ≥ 8 位」，非口令。
- `minimumReleaseAge`：`pnpm-workspace.yaml`、`.npmrc`、根/子 `package.json` 与 `main` 一致，集成分支未新增或放宽该项（`git log -S minimumReleaseAge` 0 条；`pnpm config get minimumReleaseAge` = undefined，即沿用 pnpm 默认，与 main 相同）。新增依赖版本（`axe-core 4.13.0`、`pixelmatch 7.2.0`、`pngjs 7.0.0` 写死；fontsource 5.3.0 为 2026-07-19 发布）均通过 `pnpm install --frozen-lockfile`，无 `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`。
- 生成物：`.gitignore` 含 `dist`、`node_modules`、`shots/**/*.png`、`.turbo`；分支内无 `dist/`、`shots/` 入库。
- GitHub Actions：仓库无 `.github/` 目录。
- 运行时网络：产物 grep 仅有 React / Redux / react-router 错误说明链接与 SVG 命名空间字串，无 fetch / CDN / 埋点。

### 3.6 mock 数据个人信息（检查项 ⑥）
- `node mock/check.mjs` → `mock ok (2026-09-06T17:30:00+08:00)`（合计 / 分项 / 趋势 / 同比 / 订单时序断言全部通过）。
- 人名：团队 5 人（沈若琳 / 蒋一鸣 / 何嘉豪 / 唐雨薇 / 郭文博）与订单客户（周雅婷 等）均为虚构；邮箱域 `qimu-home.cn` 经 DNS 查询不存在（`getent hosts` 无解析），无真实归属；`mock/meta.json.notes` 已声明虚构。
- 电话：订单只含 `phoneMasked`（`138****2046` 形式），无完整手机号；`grep -E '1[3-9][0-9]{9}|\+86|[0-9]{17}[0-9Xx]'` 0 命中（无手机号、无身份证号）；无地址字段。
- 头像：全部 `initial + avatarHue`，零图片。

### 3.7 预跑：`fe01/screen-dashboard@f221e98`（供 QA-01 修复参考，非本次审计对象）
在独立 worktree 上 `pnpm install --frozen-lockfile` 后于 `apps/reference/`：
| 命令 | 结果 |
|---|---|
| `pnpm lint` | exit 0，`no-hardcode: 46 个文件通过` |
| `pnpm typecheck` | exit 0 |
| `pnpm build` | exit 0，`✓ built in 671ms`，已拆 `charts-*.js`（381.99 kB） |
| `node tools/a11y.mjs dashboard` | 13 个状态 × 2 视口 × 2 主题：**213 PASS / 0 FAIL**，axe minor 0，console error 0 |

该分支不含 login 合入（分叉点 `46d33b8`），合回集成分支后需重跑 §3.1–3.2（login / kitchen-sink / dashboard 三屏）。

## 4. 需求逐条对照（brief §4 / §5 / §7 与本审计相关项）
| brief 条目 | 结果 |
|---|---|
| §4 屏幕清单 2 屏 | login 在；dashboard 缺（QA-01） |
| §4.1 login 5 态 + `?alert=` 变体 | 7 个状态截图态全部 a11y 通过 |
| §5 零位图 / OFL 字体 / Lucide / simple-icons CC0 | 通过（§3.3、§3.4） |
| §5 人名公司邮箱域虚构 | 通过（§3.6） |
| §6 不启用 Actions、不放宽 minimumReleaseAge | 通过（§3.5） |
| §6 不改其他 `apps/*` | 一行技术性例外（QA-05，P3） |
| §7 WCAG 2.2 AA：对比度 / 热区 ≥40 / 键盘 / 焦点环 | 通过（§3.2，login 28 格 + kitchen-sink 24 格） |
| §7 375 无横向溢出、0 console error | 通过（§3.2） |
| §7 lint / typecheck / build 全绿 | 通过（§3.1） |

## 5. 未验证项（如实声明）
- 未跑 `tools/shoot.mjs` + `tools/compare.mjs` 像素对照（阶段 6 视觉 QA 职责）。
- 未在真机 / 真实浏览器手工走查（阶段 7 体验官 `07-ux-walkthrough.md` 职责）。
- 768 / 1024 视口未做 a11y（工具矩阵仅 375 / 1440，QA-07）。
- 未审计 `apps/<其他库>/`、`gallery/`、`packages/spec/`（brief §6 非本轮范围）。
