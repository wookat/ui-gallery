# 07 · QA + 合规安全审计（第 4 轮：orders / form 修复后复查）

> 角色：roles/qa/qa-engineer（兼合规与安全审计，CHARTER 四道把关中的 QA + 审计）。
> 对象：`fe01/integration` @ `01ab5852ddb23d5df21f2e9fa77c2f7e5ccad179`（`git merge --ff-only origin/main` → Already up to date）。
> 性质：**第 2 轮复查**（时间盒 30 分钟）——只复验上轮（对象 `6f4fe2a`，报告见 git 历史 `9be35c8`）的 P0/P1（QA-17 / QA-18 / QA-19）+ 重跑检查项 ①②；③–⑥ 在同一 HEAD 上顺带重跑（成本低）。范围：本轮合入 **orders、form**；已上线回归 **login、dashboard**。`components` / `landing` / `chat` 本轮明确未合入，其缺失**不计** P0/P1（§5）。
> 方法：本机实跑门禁（§3）+ Playwright 1.62.1（`tools/shoot` 的依赖）对 `pnpm build` 产物走查，静态服务用 `tools/_shared.mjs serveDist`（与生产同构：base `/apps/reference/`、目录 `index.html`、`/foo` → 307 `/foo/`、未知路径 404）。脚本在仓库外 `~/qa/reverify.mjs`、`~/qa/form-step.mjs`，截图不入库。**只写报告，不改产品代码。**
> 证据口径：每条标注「实跑」（本轮直接复现）/「代码核对」（读源码推断）/「历史」（上轮报告，本轮未复验）。编号沿用 QA-01 ~ QA-21，新增自 QA-22。

## 0. 结论

**verdict = pass（P0 = 0，P1 = 0）。**

上轮 3 项 P1 在 `01ab585` 中全部修复并经本轮实跑复验关闭（§1）；检查项 ①② 重跑全绿（lint / typecheck / build exit 0；四屏 `a11y.mjs` 1024 PASS / 0 FAIL）；③–⑥ 合规检查复跑无新增问题；dashboard / orders `compare.mjs` 142/142 ≥ 95% 无回退。

| 级别 | 数量 | 编号 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | —（QA-17 / QA-18 / QA-19 本轮关闭） |
| P2 | 2 | QA-02（历史）、QA-20（主包 539 kB，未变） |
| P3 | 12 | QA-03、QA-06、QA-08 ~ QA-12、QA-14 ~ QA-16、QA-21（沿用）、QA-22（新增：form `?step=` 只作初始值） |

按 CHARTER 四道把关口径，QA + 审计两道对 `fe01/integration@01ab585` 放行；P2/P3 全部为非阻塞项，交 release / 下轮处理。

## 1. 上轮 P1 复验（全部关闭）

复验脚本 `~/qa/reverify.mjs`：desktop 1440×900 + mobile 375×812，`reducedMotion: reduce`（与 `a11y.mjs` 同配置）另加一组不带 reducedMotion 的原生动效上下文。**合计 61 PASS / 0 FAIL**（desktop 37 + mobile 24，`~/qa/reverify.log` / `~/qa/reverify-mobile.log`）。

### QA-17 · 侧栏原生 `<a href="/">` 整页跳出 basename → **已关闭（实跑）**
- 修复：`nav-item.tsx` 有 `href` 且未禁用时渲染 `react-router-dom` `<Link to>`；禁用项仍为 `<a>` + `aria-disabled` + Tooltip（`git show 01ab585 -- apps/reference/src/components/composed/nav-item.tsx`）。
- 复验：orders 侧栏「仪表盘」`href=/apps/reference/`（DOM 已带 basename）；`/orders/` 点「仪表盘」→ URL `/apps/reference/`，h1 可见；dashboard 点自身 → 停留 `/apps/reference/`；form 填写后点「仪表盘」→ `/apps/reference/`（本次走的是无草稿路径，离开确认 Dialog 未弹，`dialog=0`——dirty 拦截逻辑上轮已实测，本轮未重复）；整段流程 **console error = 0、404 = 0**（上轮 form / orders 桌面 console 的 `Failed to load resource: 404` 消失）。

### QA-18 · 订单行菜单「查看详情 / 取消订单 / 删除订单」无反应 → **已关闭（实跑）**
- 修复：`screen-state.ts` `set()` 同一导航内连续调用基于前一次结果合并（`pending` ref 以 `location.key` 判定）并支持函数式 patch；`orders/index.tsx` 菜单 `onOpenChange(false)` 仅在 `open` 仍为 `order-menu` 时清空。
- 复验：3 动作 × 鼠标 / 键盘 Enter / 原生动效 × 1440 / 375 = **18/18** 出覆盖层且 URL 含对应 `open=drawer|dialog-cancel|dialog-delete&order=<id>`（查看详情 / 取消订单取首行 `SO-20260906-0108`，删除订单取已取消单 `SO-20260906-0077`）；Esc 后 URL 均回到无 `open=`（18/18）；不写 URL 态的「标记发货」6/6 仍为「关菜单 + Toast」无回退；6 个上下文 console error 均为 0。
- 代码核对（未发现新问题）：`pending` 只在同一 `location.key` 内生效，`setParams(..., { replace: true })` 完成后 key 变化即失效，不会把上一次导航的参数带到下一次；`replace` 历史条目不可回退到旧 key，无陈旧命中路径。

### QA-19 · orders 已合入但导航仍禁用 → **已关闭（实跑）**
- 修复：`mock/nav.json` `orders.implemented: true`；`dashboard/index.tsx` `ViewAll` 按 `nav.json` `implemented` 决定 `<Link>` 还是 `aria-disabled` + Tooltip。
- 复验：orders 页侧栏「订单」`href=/apps/reference/orders`、无 `aria-disabled`、`aria-current=page`；dashboard → 订单 → URL `/apps/reference/orders`；其余 6 项（售后 / 商品 / 库存 / 采购 / 报表 / **设置**）仍 `aria-disabled=true`，与 brief §11.1「settings 未实现保持 false」一致；dashboard「最近订单 → 查看全部」`href=/apps/reference/orders` 可点并到达 orders，「活动 → 查看全部」`href=/activity aria-disabled=true` 保持不可达。`a11y.mjs dashboard / orders` 重跑（`aria-current` / Tooltip 契约变化）0 FAIL。

### 附：体验官 P1-3（form 第 2→3 步预报条款错误）回归（实跑，`~/qa/form-step.mjs`）
`/form/?step=2` 点「下一步」→ 第 3 步 `role=alert` = 0、焦点 `BODY`、`scrollY` = 0，与修复说明一致；第 3 步「提交采购单」在未勾条款时为 `aria-disabled`（可聚焦阻断，符合 AGENTS.md `aria-disabled` 契约；脚本用 Playwright 默认 click 因 not-enabled 超时属脚本侧预期，未计 FAIL）。

## 2. P2 / P3

| 编号 | 级别 | 状态 | 项 | 证据 | 建议 |
|---|---|---|---|---|---|
| QA-02 | P2 | 历史·本轮未复验 | `tools/assemble.mjs` 把参考应用纳入 `dist/manifest.json`，画廊首页出现「Acme Console」卡片，与 brief §6 冲突 | 上上轮实跑；本轮未跑 gallery build | release 阶段二选一并写进 04-adr |
| QA-20 | P2 | 仍开放（实跑） | 主包 `index-*.js` **539.05 kB**（gzip 144.05）触发 Vite `> 500 kB` 告警；较上轮 538.40 +0.65 kB（本轮修复引入 `Link` / `useLocation`） | §3.1 `pnpm build` 输出 | `app.tsx` 路由 `React.lazy` 按屏拆包；不建议只调 `chunkSizeWarningLimit` |
| QA-22 | P3 | **新增**（实跑 + 代码核对） | form `?step=` 只作初始值：从 `?step=2` 点「下一步」进入第 3 步后 URL 仍为 `?step=2`，刷新回到第 2 步（内存表单数据本就不持久，影响仅限「刷新后步骤不对」与分享链接） | `form-step.mjs` 输出 `url=?step=2 stepLabel=3确认提交…当前步骤`；`form/index.tsx` L170–181 `initialStep` → `useState`，`goStep` 只改本地 state | 若要 URL 可分享则 `goStep` 同步 `set({ step })`；否则在 `shots.json` / 06 notes 明示 `?step=` 为截图专用参数 |
| QA-21 | P3 | 历史·本轮未复验 | 订单详情 Drawer 可访问名只有「订单」（`aria-labelledby` 优先于 `aria-label="订单详情"`） | 上轮 `walk.log` | 标题节点包含订单号，或去掉 `aria-labelledby` |
| QA-03 | P3 | 历史·本轮未复验 | `/login?state=success` 停留登录页未跳转 | 代码核对 `login/index.tsx` `locked = busy \|\| state === "success"` | 见前轮 |
| QA-06 | P3 | 仍开放（实跑） | `vite` / `tailwindcss` / `@tailwindcss/vite` 在 `dependencies`，`licenses --prod` 把 lightningcss（MPL-2.0）算进生产依赖 | §3.3 MPL-2.0 两项均为 lightningcss | 迁到 `devDependencies` |
| QA-08 | P3 | 仍开放（实跑） | `a11y.mjs` 只跑 desktop / mobile，1024 / 768 不进 a11y 矩阵 | `a11y-*.log` 全为 `desktop/` `mobile/` | a11y 读 `shots.json` viewports |
| QA-09 | P3 | 历史·本轮未复验 | `gallery.json` `routes` 过时 | — | 随 QA-02 |
| QA-10 | P3 | 仍开放（实跑） | 虚构域名用真实可注册 TLD（`qimu-home.cn` 等 8 个域） | §3.6 邮箱域清单 | 下轮内容修订改用 `.example` |
| QA-11 | P3 | 仍开放（实跑） | `vite.config.ts` `__dirname` 与 Vite `configLoader: 'native'` 不兼容告警 | §3.1 build 输出 | 改 `import.meta.dirname` |
| QA-12 | P3 | 仍开放（实跑） | `design/hifi/login/index.html` L32–34 从 `cdn.jsdelivr.net` 加载字体（设计稿，不进生产） | §3.3 `git grep jsdelivr` 仅此 3 行 | 统一为本地 |
| QA-14 | P3 | 历史·本轮未复验 | 未知路径整页 404 空白（生产 `not_found_handling: none`） | 前轮 `walk.log` | 站点级，记录 |
| QA-15 / QA-16 | P3 | 历史·本轮未复验 | `spaRoutes()` 正则脆弱 / 本地静态服务与生产 `*.html` 平铺差异 | 代码未变 | 见前轮 |

## 3. 门禁与检查实跑记录

环境：Ubuntu，Node 22.23.2，pnpm 11.9.0，`pnpm install --frozen-lockfile` 成功（1m 27s），输出无 `MINIMUM_RELEASE_AGE`。Playwright 1.62.1（`tools/shoot` 依赖，`pnpm exec playwright install chromium` 下载 headless shell 1234 / Chrome 151）。命令在 `apps/reference/` 下执行。

### 3.1 lint / typecheck / build（检查项 ①）
| 命令 | 结果 |
|---|---|
| `pnpm lint`（`eslint . && node tools/no-hardcode.mjs`） | exit 0；eslint 0 error / 0 warning；`no-hardcode: 75 个文件通过` |
| `pnpm typecheck` | exit 0 |
| `pnpm build` | exit 0，`✓ built in 1.00s`；`index-*.css` 205.42 kB、`react` 271.63、`charts` 381.99、`radix` 137.01、**`index-*.js` 539.05 kB（gzip 144.05）→ `> 500 kB` 告警（QA-20）**；`__dirname` 告警（QA-11） |

### 3.2 `tools/a11y.mjs`（检查项 ②）— 四屏全部 EXIT 0，0 FAIL
| 屏 | 结果（light+dark × desktop 1440 + mobile 375；axe serious/critical、375 scrollWidth、热区 ≥ hit、Tab 焦点环、console error） |
|---|---|
| login | 116 PASS / 0 FAIL |
| dashboard | 212 PASS / 0 FAIL |
| orders | 372 PASS / 0 FAIL |
| form | 324 PASS / 0 FAIL |

视觉回归（§6 复验清单第 4 条）`node tools/shoot.mjs <screen> && node tools/compare.mjs <screen>`：dashboard **56/56 最低 98.41%**、orders **86/86 最低 96.36%**，阈值 95%，与上轮数值一致无回退（shots 未入库）。login / form 本轮未重截（修复未触及其渲染；form 仅改 button `key`）。

### 3.3 依赖许可证与字体（检查项 ③）
`pnpm --filter reference licenses list --prod --json`：MIT 172、ISC 23、OFL-1.1 3、Apache-2.0 3、BSD-3-Clause 3、MPL-2.0 2（`lightningcss`、`lightningcss-linux-x64-gnu`，构建链，QA-06）、BlueOak-1.0.0 1、0BSD 1、`(MIT OR Apache-2.0)` 1、`MIT AND ISC` 1。**GPL / AGPL / SSPL / BUSL / CC-BY-NC / UNLICENSED / UNKNOWN：0。** 字体仅 `@fontsource-variable/{inter,noto-sans-sc,jetbrains-mono}`（OFL-1.1）；`git grep fonts.googleapis|jsdelivr|unpkg|cdn.` 在 `src/ content/ mock/ design/` 仅命中 `design/hifi/login/index.html` 3 行（QA-12）。`pnpm-lock.yaml` / `package.json` 相对 `origin/main` 无差异（本轮修复未增删依赖）。

### 3.4 第三方文案 / 图片 / 商标（检查项 ④）
`git grep -i 'lorem|ipsum|unsplash|pravatar|picsum|randomuser'` 于 `content/ mock/ apps/reference/src/ design/hifi/`：9 处命中全部是 `check.mjs` 自检正则与 `content/README.md` 的禁令本身，产品内容 0 命中；`apps/reference/src` 无位图资产（`git ls-files` 无 png/jpg/svg），图标只来自 `lucide-react`。品牌「栖木家居 / Acme Console」与供应商名为虚构，未发现竞品 / 官网真实文案与商标。

### 3.5 secrets 与供应链策略（检查项 ⑤）
- `git ls-files | grep -Ei '\.env|\.pem|id_rsa|credentials|secret'`：0；`git grep` AWS `AKIA…` / `ghp_…` / `sk-…` / Slack `xox…` / 私钥头模式：0。
- 仓库无 `.github/`（GitHub Actions 未启用，符合公司规则）。
- `.npmrc` / `pnpm-workspace.yaml` / 根与 `apps/reference` `package.json` `git grep -i minimumReleaseAge`：0；`git diff --stat origin/main...HEAD` 对这些文件及 `pnpm-lock.yaml` 无输出；install 无策略告警。

### 3.6 mock 个人信息（检查项 ⑥）
`node mock/check.mjs` → `mock ok (2026-09-06T17:30:00+08:00) — orders.json 5 · orders-all 样本 50 / summary 731 · skus 18 · suppliers 6 · chat 7 会话`。手机号：`mock/*.json` 掩码形态 `1xx****xxxx` 62 处；完整号码 6 个（`13700003308` ×2、`15800009042`、`15000007718`、`13900006620`、`13800000157`、`13600002285`）全部为中间 `0000` 的虚构形态；无 18 位身份证号形态；邮箱 16 个全在虚构域（`qimu-home.cn` 等，QA-10：TLD 真实）或 `example.com` / `company.cn` 占位；地址只到区级。**未发现真实个人信息。** 本轮 `mock/` 仅 `nav.json` 一字段变化（`orders.implemented`），不含个人数据。

## 4. 本轮未覆盖（如实标注）
- 复查轮只验上轮 P0/P1 + 门禁：上轮 §3.7 的全量功能走查（筛选 / 排序 / 分页 / 批量 / Drawer 物流 Tab / 撤销 / 导出 / form 三步全流程等）本轮未重跑，仅靠 `a11y.mjs` 四屏状态矩阵与 `compare.mjs` dashboard / orders 覆盖回归。
- form dirty 离开确认 Dialog 与「放弃并离开」路径本轮未触发（脚本填写首个 input 后未进入 dirty 拦截，见 QA-17 复验说明）。
- login / form 未重截 compare；1024 / 768 断点无交互走查；暗色仅靠 a11y + compare。
- 生产站未实查（集成分支未部署）。

## 5. 明确不在本轮范围（不计 P0/P1）
`components`（round2 卡片形态不符）、`landing`（compare 最低 83.67%，hifi 侧 eyebrow 特异性问题）、`chat`（与 orders 的 `shell.tsx` ShellProps 冲突未合入）——均按项目负责人说明未合入 `fe01/integration`，本报告未审计、未计分。

## 6. 交 release 的备注
1. 本报告 verdict = pass，QA + 审计两道放行；体验官侧 P1-1 / P1-2 与 QA-17 / 18 / 19 同源，P1-3 已按 §1 附录回归通过，建议体验官复查报告直接引用。
2. release 前建议顺手处理 QA-20（拆包）与 QA-06（`vite` / `tailwindcss` 迁 devDependencies），两者均不影响功能，可放下轮。
3. chat 合入时 `shell.tsx` 取 ShellProps 并集后，须重跑 `a11y.mjs` 四屏 + `~/qa/reverify.mjs` 同法复验侧栏 Link / 菜单 URL 态不回退。
