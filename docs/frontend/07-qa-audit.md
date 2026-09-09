# 07 · QA + 合规安全审计（第 5 轮：settings / landing / chat 合入后全量审计）

> 角色：roles/qa/qa-engineer（兼合规与安全审计，CHARTER 四道把关中的 QA + 审计）。
> 对象：`fe01/integration` @ `39016c710a4b70c89fcb255d05b60a539fcd78d0`（= `origin/fe01/integration` HEAD；`git fetch && git checkout fe01/integration && git merge --ff-only origin/main` → Already up to date，`origin/main@a32171b` 已包含）。
> 关于指派的 `1afe7d5`：该提交是 **chat 合入点**，其后集成分支又合入了 landing（`e85f0f2`）与 settings（`39016c7`）。任务范围写明「本轮已合入 settings / landing / chat」，只有 HEAD `39016c7` 同时包含三屏，故本轮以 HEAD 为审计对象（`1afe7d5` 在其祖先链中，`git log 1afe7d5..HEAD` 共 21 个提交，全部为 landing / settings 屏幕与其 hifi / notes）。
> 范围：本轮合入 **settings、landing、chat**（全量走查）；已上线回归 **login、dashboard、orders、form**。`components` 本轮明确未合入（a11y 4 FAIL 交集成阶段），**不在范围、不计 P0/P1**（§5）。
> 方法：本机实跑门禁（§3）+ Playwright 1.62.1（`tools/shoot` 的依赖）对 `pnpm build` 产物走查，静态服务用 `tools/_shared.mjs serveDist`（与生产同构：base `/apps/reference/`、目录 `index.html`、未知路径 404）。脚本在仓库外 `~/qa/walk.mjs`（188 断言）、`~/qa/probe.mjs`（定点复现），日志 `~/qa/*.log`，截图 / shots 不入库。**只写报告，不改产品代码。**
> 证据口径：每条标注「实跑」（本轮直接复现）/「代码核对」（读源码推断）/「历史」（前轮报告，本轮未复验）。编号沿用 QA-01 ~ QA-22，新增自 QA-23。

## 0. 结论

**verdict = pass（P0 = 0，P1 = 0）。**

检查项 ①–⑥ 全部实跑通过：lint / typecheck / build exit 0；七屏 `a11y.mjs` **1884 PASS / 0 FAIL**；三新屏 `compare.mjs` 232/232 ≥ 95%；生产依赖无 GPL / AGPL / 非开源许可，字体全为 OFL-1.1；无第三方文案 / 位图，商标仅 login 三个 brief 批准的单色第三方登录标识（QA-27 记录边界）；无 secrets 入库、无 `minimumReleaseAge` 放宽、无 `.github/`；`mock/check.mjs` 通过且无真实个人信息。功能走查 188 断言中 178 PASS；10 条 FAIL 经逐条复现，**无一为 P0/P1**：4 条是脚本对 URL 态的预期与实现的「本地态」策略不一致（QA-26，P3）、1 条为 375 主导航收进 Sheet 的脚本误判（不计）、其余 5 条归为 3 个新发现（QA-23 / QA-24 P2，QA-25 P3）。

| 级别 | 数量 | 编号 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 4 | QA-20（主包 **659.71 kB**，较上轮 +120 kB）、QA-23（chat 来源 Chip 订单链接不可达却无禁用态）、QA-24（chat 无站内入口：其余壳页顶栏无「智能助理」按钮）、QA-02（历史） |
| P3 | 17 | QA-25（chat 发送丢弃输入文本，重放固定 streamingSample——与 hifi 一致）、QA-26（settings 用户触发的弹层不写 `?open=`）、QA-27（login 第三方登录用 Google / GitHub / 微信品牌标识，brief 已批准的单色 CC0 路径，记录商标使用边界）、QA-22、QA-21、QA-03、QA-06、QA-08 ~ QA-12、QA-14 ~ QA-16 |

按 CHARTER 四道把关口径，QA + 审计两道对 `fe01/integration@39016c7` **放行**；P2/P3 全部为非阻塞项，建议 release 前处理 QA-23 / QA-24（均为 chat 屏可达性，改动面小，见 §6）。

## 1. 新屏功能走查（实跑，`~/qa/walk.mjs`）

配置：desktop 1440×900 + mobile 375×812，`reducedMotion: reduce`、`locale zh-CN`（与 `a11y.mjs` 同配置），对 `pnpm build` 产物。**合计 178 PASS / 10 FAIL**；每段结束断言 `console error = 0`，七段（settings / landing / chat / 回归 × 2 视口）**全部 0 error**。

### 1.1 settings（`/settings`，brief §11.4）— 72 断言，68 PASS
PASS：h1；`tablist[设置分类]` 5 Tab，点击 → `?tab=security` 且 `aria-selected` 同步；2FA Switch 开启 → 二维码位 `role=img` + 「验证并启用」；个人资料：邮箱只读、无改动「重置」禁用、改动后粘性条「有未保存的修改」+「重置」可用、保存 → Toast「个人资料已保存」+ 粘性条消失、姓名清空 → 内联「请填写姓名」、重置恢复已保存值；脏表单切 Tab → 离开确认 Dialog（URL 仍 `?tab=profile`）；团队：席位「已用 5 / 10」、成员「移除」×4 → Dialog、Esc 关闭；危险区：未输入「永久删除」禁用、输入完全匹配后可点；计费：年付 ¥2,990 ↔ 月付 ¥299，切换写 `?cycle=monthly`；通知：Switch 25 个、免打扰 `#quietFrom=22:00 / #quietTo=08:00`；`?state=empty` security 空态文案；`?state=error` Alert「保存失败」。
FAIL ×4（desktop + mobile 各 2）：点「移除」/ 危险区按钮后 URL 保持 `?tab=team`，不出现 `open=remove` / `open=danger` → **QA-26（P3）**，弹层本身正常打开，功能无损。

### 1.2 landing（`/landing`，brief §11.6）— 34 断言，33 PASS
PASS：h1；桌面 `nav[主导航]`；Hero 抽象图 `role=img`、无 `<img>` 位图；「1,200+ 团队」社证；header「登录」`href=/apps/reference/login`（带 basename）；375 汉堡 → `?open=menu` + Sheet，Esc 关闭；滚动后 Navbar 背景 `rgba(0,0,0,0)` → `rgb(255,255,255)`（sticky 生效）；定价 Switch → `?cycle=yearly`，¥2,990 从 0 → 1 处；FAQ Accordion `aria-expanded` 切换；Footer `aria-disabled` 链接 21 个（本轮不可达页保持禁用态）+ 语言 Select；试用 CTA `href=…/login`。
FAIL ×1（mobile）：`nav[主导航]` 在 375 不在文档流（收进 Sheet）——脚本误判，Sheet 内导航已由「菜单 Sheet 出现」覆盖，**不计**。

### 1.3 chat（`/chat`，brief §11.7）— 52 断言，49 PASS
PASS：消息流 `role=log`、助手名「Acme 助理」；c_1 代码块复制按钮；Composer 空内容发送禁用 / 有内容可用；Enter 发送后输入框清空 → `?state=streaming` 出现「停止」按钮 → 点停止回到发送；会话列表含「9/3 抖音直播复盘」，点击 → `?conversation=c_4` 且 ¥52,310 渲染；c_6（`historyAvailable=false`）→ 骨架 → 「历史不可用」空态 + 「返回今天的会话」→ `c_1`；`?state=empty` 欢迎「你好，若琳」+ 建议 4 条，点建议填入 Composer；`?state=error` Alert + 「重试」；`?open=delete` Dialog，Esc 关闭；c_2 `SO-20260903-0087` 加急 toast / 消息；375「打开会话列表」→ `?open=sidebar`。
FAIL ×3：
- 「Enter 发送 → 用户气泡出现」×2（desktop / mobile）：输入「测试消息 ABC」发送后，消息流不含该文本；`send()` 只 `setDraft("")` 后 `go(convId, "streaming")`，追加的是 `mock/chat.json.streamingSample`（固定采购单草稿）。hifi `design/hifi/chat/index.html` L1256 `submit` 同样 `ta.value=''; setState('streaming')`，实现与设计一致 → **QA-25（P3，设计侧）**。
- 「来源 Chip 链接 orders」×1：`~/qa/probe.mjs` 定点复现——c_3 三个订单 `SourceChip` 渲染为 `<a href="/orders/SO-…">`（**无 basename、路由不存在**），`onClick` 一律 `preventDefault()`，**无 `aria-disabled`、无 Tooltip**；点击后 URL 不变、dialog 0、tooltip 0，hover 也无提示 → **QA-23（P2）**。

### 1.4 已上线屏回归（login / dashboard / orders / form）— 29 断言，27 PASS
PASS：dashboard h1；侧栏「设置」已启用（`nav.json settings.implemented` 随本轮翻 true）→ `/apps/reference/settings` 且 `aria-current=page`；侧栏「订单」→ `/apps/reference/orders`；orders 侧栏「仪表盘」`href` 带 basename（QA-17 不回退）；orders 表格渲染，行菜单「查看详情」→ `?open=drawer&order=SO-20260906-0108`（QA-18 不回退）；`/form?step=2` 渲染 → 「下一步」进入第 3 步；`?state=success` Result；login 邮箱 / 密码 / OAuth 按钮；未知路径 `/nope/` → 404（QA-14 沿用）。
FAIL ×2（desktop / mobile）：「顶栏助理入口存在」——dashboard 顶栏无指向 `/chat` 的链接；`probe.mjs` 复测 `/`、`/orders`、`/settings`、`/form` 四页 `header a[href*="/chat"]` 均为 0。`shell.tsx` 已支持 `assistant` prop，但仅 `pages/chat/index.tsx` L688 传入；01-ia §11-A 决议「顶栏图标区新增智能助理 IconButton，在 /chat 时 aria-current=page」隐含其余壳页也应有该入口，而 `design/hifi/{dashboard,orders,settings,form}` 均无 `#assistBtn`（`grep assistBtn design/hifi/*/index.html` 仅 chat）——实现忠实各自 hifi，缺口在设计稿间不一致 → **QA-24（P2）**。除此之外已上线四屏无回退。

## 2. P2 / P3

| 编号 | 级别 | 状态 | 项 | 证据 | 建议 |
|---|---|---|---|---|---|
| QA-23 | P2 | **新增**（实跑 + 代码核对） | chat 来源 Chip 订单链接（`/orders/SO-…`）不可达却呈现为普通链接：`href` 无 basename、应用无 `/orders/:id` 路由，`chat/index.tsx` L149 用 `onClick preventDefault` 吞掉点击；无 `aria-disabled` / Tooltip，违反 AGENTS.md「本轮不可达链接保持 aria-disabled + Tooltip」契约；IA §9.6 写「SO-… 可达」 | §1.3；`probe.mjs` 输出 `dis:null tip:null`，点击后 URL 不变 | 二选一：改为 `<Link to={"/orders?open=drawer&order=" + id}>` 复用订单 Drawer（数据已在 orders-all 中）；或按契约加 `aria-disabled` + Tooltip「订单详情页本轮不可达」并写进 06 notes |
| QA-24 | P2 | **新增**（实跑 + 代码核对） | chat 无站内入口：dashboard / orders / settings / form 顶栏均未渲染「智能助理」IconButton，用户只能靠直达 URL 进入 `/chat`；侧栏 `nav.json` 8 项亦无 chat（IA 决议不进侧栏） | §1.4；`grep -n 'assistant=' src/pages` 仅 chat 一处 | 实现侧一行：各壳页 `<Shell assistant={{ label: t("chat.title"), href: "/chat" }}>`；同时设计侧需补 dashboard / orders / settings / form hifi 顶栏按钮并重截 ref（否则 compare 回退），建议记 design notes 转交 |
| QA-20 | P2 | 仍开放·**恶化**（实跑） | 主包 `index-*.js` **659.71 kB（gzip 172.67）**，上轮 539.05（gzip 144.05），+120 kB 来自本轮三屏 + markdown 渲染同步打进主包；Vite `> 500 kB` 告警 | §3.1 build 输出 | `app.tsx` `import.meta.glob` 改惰性 `React.lazy` 按屏拆包；不建议只调 `chunkSizeWarningLimit` |
| QA-02 | P2 | 历史·本轮未复验 | `tools/assemble.mjs` 把参考应用纳入 `dist/manifest.json`，画廊首页出现「Acme Console」卡片，与 brief §6 冲突 | 前轮实跑；本轮未跑 gallery build | release 阶段二选一并写进 04-adr |
| QA-25 | P3 | **新增**（实跑 + 代码核对，设计侧） | chat 发送后用户输入被丢弃，不进消息流，`?state=streaming` 固定重放 `streamingSample`（采购单草稿）；hifi 同样行为，属演示型设计决策，但用户观感为「我发的话没了、助理答的是别的」 | §1.3 | 设计侧决定：发送时把 draft 作为用户气泡追加到 log 再进入 streaming（mock 不变）；或 Composer hint 明示演示 |
| QA-26 | P3 | **新增**（实跑 + 代码核对） | settings 用户触发的 2FA / 移除 / 危险区 / 离开弹层走 `openLocal()` 本地态，不写 `?open=`；`?open=…` 只作初始值（brief §11.4 把它们列为状态切换参数）。与 QA-22（form `?step=`）同模式 | §1.1；`settings/index.tsx` `overlay()` / `openLocal()` / `closeLocal()` | 与 form 一致处理：要么 `set({ open })` 同步 URL，要么在 shots.json / 06 notes 明示 `?open=` 为截图专用 |
| QA-27 | P3 | **新增**（代码核对，合规记录） | `login/index.tsx` L73–93 内联 Google / GitHub / 微信单色标识（simple-icons 路径，代码 CC0）；brief §11.10-E 明确批准「文字标签 + CC0 单色图标，不用官方位图 Logo」，且本轮无真实 OAuth。但标识本身仍是第三方商标，simple-icons 许可只覆盖 SVG 代码不覆盖商标权；若产品真实上线并接入登录，需按各提供方品牌指引（Google 要求官方按钮样式）呈现或改纯文字 | §3.4 | 现阶段维持；release / 接入真实 OAuth 时改官方指引样式或纯文字，写进 04-adr |
| QA-22 | P3 | 仍开放（实跑） | form `?step=` 只作初始值，「下一步」后 URL 不变 | 本轮回归 `?step=2` → 第 3 步 URL 仍 `?step=2` | 见上轮 |
| QA-21 | P3 | 历史·本轮未复验 | 订单详情 Drawer 可访问名只有「订单」 | 前轮 | 标题节点含订单号 |
| QA-03 | P3 | 历史·本轮未复验 | `/login?state=success` 停留登录页 | 代码未变 | 见前轮 |
| QA-06 | P3 | 仍开放（实跑） | `vite` / `tailwindcss` / `@tailwindcss/vite` 在 `dependencies`，`licenses --prod` 把 lightningcss（MPL-2.0）算进生产依赖 | §3.3 | 迁 `devDependencies` |
| QA-08 | P3 | 仍开放（实跑） | `a11y.mjs` 只跑 desktop / mobile，1024 / 768 不进 a11y 矩阵 | `a11y-*.log` 全为 `desktop/` `mobile/` | a11y 读 `shots.json` viewports |
| QA-09 | P3 | 历史·本轮未复验 | `gallery.json` `routes` 过时 | — | 随 QA-02 |
| QA-10 | P3 | 仍开放（实跑） | 虚构域名用真实可注册 TLD（`qimu-home.cn` 等） | §3.6 | 改 `.example` |
| QA-11 | P3 | 仍开放（实跑） | `vite.config.ts:13` `__dirname` 与 Vite native config loader 告警 | §3.1 | 改 `import.meta.dirname` |
| QA-12 | P3 | 仍开放（实跑） | `design/hifi/login/index.html` L32–34 从 `cdn.jsdelivr.net` 加载字体（设计稿，不进生产） | §3.3 `git grep jsdelivr` 仅此 3 行 | 统一本地 |
| QA-14 | P3 | 仍开放（实跑） | 未知路径整页 404 空白 | §1.4 `/nope/` → 404 | 站点级，记录 |
| QA-15 / QA-16 | P3 | 历史·本轮未复验 | `spaRoutes()` 正则脆弱 / 本地静态服务与生产 `*.html` 平铺差异 | 代码未变 | 见前轮 |

## 3. 门禁与检查实跑记录

环境：Ubuntu，Node 22.23.2，pnpm 11.9.0，`pnpm install --frozen-lockfile` 成功，输出无 `MINIMUM_RELEASE_AGE`。Playwright 1.62.1（`pnpm exec playwright install chromium`）。命令在 `apps/reference/` 下执行。

### 3.1 lint / typecheck / build（检查项 ①）
| 命令 | 结果 |
|---|---|
| `pnpm lint`（`eslint . && node tools/no-hardcode.mjs`） | exit 0；eslint 0 error / 0 warning；`no-hardcode: 79 个文件通过` |
| `pnpm typecheck` | exit 0 |
| `pnpm build` | exit 0，`✓ built in 1.32s`；`index-*.css` 233.64 kB、`react` 271.63、`charts` 381.99、`radix` 137.01、**`index-*.js` 659.71 kB（gzip 172.67）→ `> 500 kB` 告警（QA-20）**；`__dirname` 告警（QA-11） |

### 3.2 `tools/a11y.mjs`（检查项 ②）— 七屏全部 EXIT 0，0 FAIL
| 屏 | 结果（light+dark × desktop 1440 + mobile 375 × shots.json 状态；axe WCAG 2A/AA serious/critical、375 scrollWidth、热区 ≥ hit、Tab 焦点环、console error） |
|---|---|
| settings（新） | 436 PASS / 0 FAIL |
| landing（新） | 68 PASS / 0 FAIL |
| chat（新） | 356 PASS / 0 FAIL |
| login | 116 PASS / 0 FAIL |
| dashboard | 212 PASS / 0 FAIL |
| orders | 372 PASS / 0 FAIL |
| form | 324 PASS / 0 FAIL |

视觉回归 `node tools/shoot.mjs <screen> && node tools/compare.mjs <screen>`（阈值 95%，shots 不入库）：**landing 20/20 最低 99.47%、chat 88/88 最低 95.99%、settings 124/124 最低 97.18%**，与各屏 notes 记录一致。login / dashboard / orders / form 本轮未重截（06 notes 记录 settings 合入前复跑 login 28/28 98.15%、dashboard 56/56 98.41%、orders 86/86 96.36%、form 84/84 96.85%，属「历史」证据；本轮以 a11y 七屏 + §1.4 功能回归覆盖）。

### 3.3 依赖许可证与字体（检查项 ③）
`pnpm --filter reference licenses list --prod --json`（`~/qa/licenses.json`）：MIT 172、ISC 23、OFL-1.1 3、Apache-2.0 3、BSD-3-Clause 3、MPL-2.0 2（`lightningcss` 构建链，QA-06）、BlueOak-1.0.0 1、0BSD 1、`(MIT OR Apache-2.0)` 1、`MIT AND ISC` 1。**GPL / AGPL / SSPL / BUSL / CC-BY-NC / UNLICENSED / UNKNOWN：0。** 字体仅 `@fontsource-variable/{inter,noto-sans-sc,jetbrains-mono}`（OFL-1.1，theme.css 本地导入）；`git grep fonts.googleapis|jsdelivr|unpkg|cdn.` 于 `src/ content/ mock/ design/` 仅命中 `design/hifi/login/index.html` 3 行（QA-12）。`pnpm-lock.yaml` / `package.json` 相对 `origin/main` 无差异。

### 3.4 第三方文案 / 图片 / 商标（检查项 ④）
`git grep -i 'lorem|ipsum|unsplash|pravatar|picsum|randomuser'` 于 `content/ mock/ apps/reference/src/ design/hifi/`：命中全部是 `check.mjs` 自检正则与 `content/README.md` 禁令本身，产品内容 0 命中；`apps/reference/src` 与 `public` 无位图（`git ls-files` 无 png/jpg），landing Hero 为 inline SVG 抽象图，图标来自 `lucide-react`；唯一例外是 login 三个第三方登录按钮的 Google / GitHub / 微信单色 simple-icons 路径（brief §11.10-E 批准的形态，商标边界见 QA-27）。品牌「栖木家居 / Acme Console」、供应商、人名为虚构（`mock/meta.notes` 声明）；landing 文案来自 `content/landing.md`，未发现竞品 / 官网真实文案与商标；「抖音小店 / 天猫 / 京东 / 微信小程序」仅作为渠道枚举文字出现，无 logo。

### 3.5 secrets 与供应链策略（检查项 ⑤）
- `git ls-files | grep -Ei '\.env|\.pem|id_rsa|credentials|secret'`：0；`git grep` AWS `AKIA…` / `ghp_…` / `sk-…` / Slack `xox…` / 私钥头：0。`mock/settings.json` 的 `otpauth://…secret=DEMO-NOT-A-REAL-SECRET` 为明示的演示串，非凭据。
- 仓库无 `.github/`（Actions 未启用）。
- `git grep -i minimumReleaseAge` 于 `.npmrc` / `pnpm-workspace.yaml` / 各 `package.json`：0；`git diff --stat origin/main...HEAD` 对策略文件与 `pnpm-lock.yaml` 无输出；install 无策略告警。

### 3.6 mock 个人信息（检查项 ⑥）
`node mock/check.mjs` → exit 0，`mock ok (2026-09-06T17:30:00+08:00) — orders.json 5 · orders-all 样本 50 / summary 731 · skus 18 · suppliers 6 · chat 7 会话`。手机号：掩码形态 `1xx****xxxx` 为主；完整号码均为中间 `0000` 的虚构形态（`13700003308`、`15800009042`、`13900006620`、`13800000157` 等）；无 18 位身份证形态；邮箱全在虚构域（`qimu-home.cn` 等，QA-10）或 `example.com` / `company.cn`；地址只到区级；settings 团队成员 / 会话设备 / 发票均为虚构。**未发现真实个人信息。**

## 4. 本轮未覆盖（如实标注）
- 1024 / 768 断点：只有 compare（三新屏）与 hifi 静态图覆盖，无交互走查；a11y 矩阵不含（QA-08）。
- 暗色主题只靠 a11y + compare 覆盖，功能走查均在 light。
- settings：邀请成员、更换套餐 / 发票下载、`?open=2fa-disable|leave`、通知渠道切换的持久化未逐项走；landing：分屏锚点滚动定位、语言 Select 切换效果未验证；chat：附件上传 `?attach=`、模型切换 `?open=model`、消息「复制 / 重新生成 / 有帮助」按钮反馈、Markdown 表格 375 横向滚动未逐项走。
- login / dashboard / orders / form 未重截 compare；orders 筛选 / 分页 / 批量、form 三步全流程与 dirty 拦截沿用前轮结论。
- QA-02 / QA-09（gallery 组装）本轮未跑根 `node tools/assemble.mjs`。
- 生产站未实查（集成分支未部署）。

## 5. 明确不在本轮范围（不计 P0/P1）
`components`：项目负责人说明其分支 `fe01/screen-components` 同步集成分支后 `a11y components` 4 FAIL（`ui/combobox.tsx` `#cb-hover` 20×20、`ui/tag-input.tsx` 移除按钮 20×20 / input 93×17）、`compare components` 9/48 < 95%，按时限未修，未合入集成分支。本报告未审计 `/components`，其缺失不计分；但注意这 4 项热区 FAIL 源自**集成分支上的** `ui/combobox.tsx` / `ui/tag-input.tsx`（settings / form 共用件），本轮七屏 a11y 未触发（settings 未使用受影响状态），合入 components 时需先修再合。

## 6. 交 release 的备注
1. verdict = pass，QA + 审计两道放行 `39016c7`；无 P0/P1。
2. release 前建议顺手处理 QA-23（chat 来源 Chip：改指向 `/orders?open=drawer&order=` 或加 `aria-disabled` + Tooltip）与 QA-24（其余壳页传 `assistant` prop；需设计侧同步补 hifi 顶栏按钮并重截 ref，否则 compare 回退）——两者均为 chat 可达性，属体验缺口而非故障，可放下轮但不建议拖过两轮。
3. QA-20 主包已到 659.71 kB，再合 components 会继续增长，建议在 components 合入同轮做 `React.lazy` 按屏拆包。
4. QA-25 / QA-26 转设计 / 实现 notes 定策略（URL 态一致性：orders 写 URL、form / settings 只读 URL 为初值），统一后再决定是否改。
