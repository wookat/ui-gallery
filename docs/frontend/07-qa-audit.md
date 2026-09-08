# 07 · QA + 合规安全审计（第 3 轮：orders / form 合入后）

> 角色：roles/qa/qa-engineer（兼合规与安全审计，CHARTER 四道把关中的 QA + 审计）。
> 对象：`fe01/integration` @ `6f4fe2a50296086d5fae9b6d828a651b7ccdf53c`（`origin/main` e2ab886 已包含，`git merge --ff-only origin/main` 无变化）。
> 范围：本轮合入 **orders、form**；已上线回归 **login、dashboard**。`components` / `landing` / `chat` 本轮明确未合入，其缺失**不计** P0/P1（§5）。
> 方法：本机实跑门禁（§3）+ Playwright 1.62.1 对 `pnpm build` 产物走查（`tools/_shared.mjs serveDist`，与生产同构：base `/apps/reference/`、目录 `index.html`、`/foo` → 307 `/foo/`、未知路径 404），脚本在仓库外 `~/qa/walk.mjs`、`~/qa/menu.mjs`，截图不入库。**只写报告，不改产品代码。**
> 证据口径：每条标注「实跑」（本轮直接复现）/「代码核对」（读源码推断）/「历史」（上轮报告，本轮未复验）。上一轮报告（对象 `aa1a164`）的编号 QA-01 ~ QA-16 沿用，新增自 QA-17。

## 0. 结论

**verdict = fix（P0 = 0，P1 = 3）。**

合规与安全六项检查（lint/typecheck/build、四屏 a11y、许可证与字体、第三方文案商标、secrets 与供应链策略、mock 个人信息）**全部通过**；四屏 `compare.mjs` 254/254 ≥ 95%。阻塞项全部是**功能/集成**缺陷，且都集中在「新屏与外壳的连接」上：

| 级别 | 数量 | 编号 |
|---|---|---|
| P0 | 0 | — |
| P1 | 3 | QA-17（侧栏原生 `<a>` 跳出 basename）、QA-18（订单行菜单「查看详情 / 取消订单 / 删除订单」不生效）、QA-19（orders 未在导航放开） |
| P2 | 2 | QA-02（历史）、QA-20（主包 538 kB） |
| P3 | 11 | QA-03、QA-06、QA-08 ~ QA-12、QA-14 ~ QA-16（历史沿用）、QA-21（Drawer 可访问名） |

三项 P1 修法都很小（一个组件、一个函数、一个 JSON 字段），建议一并交 frontend-engineer 在同一分支修复后按 §6 复验清单回归。

## 1. P0 / P1

### QA-17 · P1 · 侧栏导航是原生 `<a href="/">`，从 orders / form 点「仪表盘」整页跳出 `/apps/reference/`（实跑）

- **现象**：在 `/apps/reference/orders/` 或 `/apps/reference/form/`（未 dirty 或已保存草稿）点击侧栏「仪表盘」，浏览器向 **站点根 `/`** 发起整页请求：本地同构静态服务返回 **404**（`~/qa/menu.mjs`：`侧栏首项 href="/" → 点击后 url = http://127.0.0.1:<port>/ 响应 = 404`；`walk.log` L85 / L99 / L100 同）。生产站根路径是画廊首页（非参考应用），用户会被踢出应用。这也是 form / orders 桌面 console 出现 `Failed to load resource: 404` 的唯一来源——其余走查 console error 均为 0。
- **代码核对**：`src/components/composed/nav-item.tsx` L27 渲染裸 `<a>`，`shell.tsx` L102 传 `href={it.path}`（`/`、`/orders`…），点击未 `preventDefault` 也未 `navigate()`；`react-router` `basename: import.meta.env.BASE_URL`（`app.tsx` L34）只对 `<Link>`/`navigate` 生效。同一 `<a>` 在 dashboard 页自身（`aria-current=page`）按代码同理也会整页刷新到 `/`，本轮未单独实测。
- **未受影响的路径**（实跑）：form dirty 时侧栏点击被 `beforeLeave` 拦截，「放弃并离开」走 `navigate(leaveTo)` → 正确到 `/apps/reference/`（`walk.log` L83）；login 提交 → `/apps/reference/?toast=login`（L93）。
- **影响**：orders / form 与 dashboard 之间**没有可用的应用内返回路径**（只能浏览器后退）。上一轮 login/dashboard 两屏因侧栏只有当前项可点，问题被掩盖；本轮 orders 合入后首次暴露。
- **建议**：`NavItem` 改用 `react-router-dom` `<Link>`（或 `<a>` 上 `onClick` → `preventDefault` + `navigate(path)`），保留 `aria-disabled` 分支；`dashboard/index.tsx` L129 `ViewAll` 的 `<a href>` 同改。修后复验：orders → 仪表盘、form（草稿已保存）→ 仪表盘、dashboard 点自身，URL 均停留在 `/apps/reference/…`，console 404 = 0。

### QA-18 · P1 · 订单行菜单「查看详情 / 取消订单 / 删除订单」点了没反应（实跑，稳定复现）

- **现象**：1440 成功态，打开任一行「更多操作」菜单，点「查看详情」或「取消订单」→ 菜单关闭、**无抽屉 / 无对话框 / URL 不变 / 无 Toast / 无 console error**。`~/qa/menu.mjs` 鼠标 × 4、键盘 Enter × 4、reducedMotion × 4 全部 `overlay=0 url=(空)`（12/12）；「删除订单」（已取消订单菜单内）同样 `alertdialogs=0`（`walk.log` L39）。对照：直达 `?open=drawer&order=…` / `?open=dialog-cancel&order=…` / `?open=dialog-delete&order=…` 均正常打开（`menu.mjs` 末三行 1/1/1），点行开抽屉、抽屉底部「取消订单」→ AlertDialog → 选原因 → 确认 → Toast「已取消」→ 行状态变更全链路正常（L24–37）。
- **不受影响**：同一菜单的「标记发货」「加急」「复制订单号」正常（L21、`menu.mjs` 复制项预期无覆盖层），因为它们不写 URL 态。
- **代码核对（根因推断，高置信）**：`orders/index.tsx` L1070 `OrderMenu` 受控于 URL（`open=order-menu&order=<id>`），`onOpenChange(false)` → `set({ open: null, order: null })`；菜单项 `onSelect` → `doAction` → `openDrawer`/`openDialog` → `set({ open: "drawer" | "dialog-cancel", … })`。两次 `set` 在同一事件循环内各自基于**闭包里同一份旧 `params`** 构造 `URLSearchParams`（`data/screen-state.ts` `set`），Radix 关菜单的那次后执行、以 `replace` 覆盖，最终 `open` 被删掉。写 URL 态的三个动作因此全部失效，改本地 state 的动作不受影响。
- **影响**：菜单里 3 个动作有 2 个有替代路径（点行 / 抽屉底部），但「删除订单」**只有菜单一个入口**，等于 UI 上删不了订单；对键盘/读屏用户「查看详情」也失去了菜单入口。上一轮 dashboard 菜单是「关菜单 + Toast 占位」所以没暴露。
- **建议**：`set` 改为函数式合并（`setParams(prev => …)`）或 `doAction` 里合并成一次 `set({ open: "drawer", order: id })`（该写法本身已隐含关菜单，`onOpenChange(false)` 可在 `open` 已非 `order-menu` 时跳过）。修后按 `menu.mjs` 三输入方式 × 3 动作复验。

### QA-19 · P1 · orders 已合入，但导航仍按「未实现」禁用：brief 要求本轮翻 `implemented: true`（实跑 + 代码核对）

- **现象**：dashboard 与 orders 页侧栏「订单」项 `href=null aria-disabled=true role=link`，hover Tooltip「后续轮次提供」（`walk.log` L14 / L95 / L96）；dashboard「最近订单 → 查看全部」`href=/orders aria-disabled=true`，点击无跳转（L97 / L98）。orders 只能靠手输 URL 进入。
- **依据**：`docs/frontend/00-brief.md` §11.1 / 需求 #12：「`mock/nav.json` 的 `orders` 与 `settings` 在实现阶段置 `implemented: true` 并去掉『后续轮次提供』禁用态」。当前 `mock/nav.json` `orders.implemented` 仍为 `false`（该文件最后改动仍是阶段 0 提交 `36bedc9`）；`dashboard/index.tsx` L129 `ViewAll` 无条件 `aria-disabled="true"`，注释仍写「指向本轮不可达路径」。`settings` 本轮无实现，保持 `false` 正确。
- **影响**：本轮交付的核心屏用户发现不了；需求逐条对照表上该条为「未满足」。
- **建议**：`mock/nav.json` `orders.implemented: true`；`ViewAll` 按 `mock.nav` 中目标路径的 `implemented` 决定是否禁用。**注意**：单独翻 `true` 后侧栏「订单」会变成 `<a href="/orders">` → 整页跳到站点根 `/orders` 同样 404（QA-17 同源），必须与 QA-17 一起修。修后复验 dashboard → 订单 → 仪表盘往返，`a11y.mjs dashboard/orders` 重跑（`aria-current` / Tooltip 契约变化）。

## 2. P2 / P3

| 编号 | 级别 | 状态 | 项 | 证据 | 建议 |
|---|---|---|---|---|---|
| QA-02 | P2 | 历史·本轮未复验 | `tools/assemble.mjs` 把参考应用纳入 `dist/manifest.json`，画廊首页出现「Acme Console」卡片，与 brief §6 冲突 | 上轮实跑；本轮未跑 gallery build | release 阶段二选一并写进 04-adr（见上轮） |
| QA-20 | P2 | 新增 | 主包 `index-*.js` **538.40 kB**（gzip 143.80）触发 Vite `> 500 kB` 告警；上轮 `aa1a164` 为 247.58 kB，orders + form 合入后 +117%，四屏全部打进同一个 chunk | 实跑 §3.1 `pnpm build` 输出 `(!) Some chunks are larger than 500 kB` | `app.tsx` 路由 `React.lazy` 按屏拆包（或 `manualChunks` 按 pages 拆），目标单屏首包回到 ≤ 300 kB；不建议只调 `chunkSizeWarningLimit` 压掉告警 |
| QA-21 | P3 | 新增 | 订单详情 Drawer 可访问名只有「订单」：`DrawerContent` 同时有 `aria-label="订单详情"` 与 `aria-labelledby`→标题，后者优先，标题里的订单号又是独立节点，读屏只听到「订单 对话框」 | 实跑 `walk.log` L23 / L25（`aria-label=订单详情 labelledby→订单`）；axe 无违规（有名字即通过） | 标题节点包含订单号，或去掉 `aria-labelledby` 让 `aria-label` 生效并带 `{id}` |
| QA-03 | P3 | 历史·本轮未复验 | `/login?state=success` 停留登录页未跳转 | 代码核对 `login/index.tsx` L160 `locked = busy \|\| state === "success"` 仍在 | 见上轮 |
| QA-06 | P3 | 仍开放（实跑） | `vite` / `tailwindcss` / `@tailwindcss/vite` 在 `dependencies`，`licenses --prod` 把 lightningcss（MPL-2.0）算进生产依赖 | `package.json` L20 / L30 / L31；§3.3 MPL-2.0 两项均为 lightningcss | 迁到 `devDependencies` |
| QA-08 | P3 | 仍开放（实跑） | `a11y.mjs` 只跑 desktop / mobile，1024 / 768 不进 a11y 矩阵 | `a11y-orders.log` 372 行全为 `desktop/` `mobile/`，`tablet` 0 次 | a11y 读 `shots.json` viewports |
| QA-09 | P3 | 历史·本轮未复验 | `gallery.json` `routes` 过时 | — | 随 QA-02 |
| QA-10 | P3 | 仍开放（面扩大） | 虚构域名用真实可注册 TLD：`qimu-home.cn` 16 处（mock + content），本轮 suppliers / purchase-form 新增 `zhangli-wood.cn`、`linyu-wood.cn`、`nuanzhu-scent.cn`、`zhuli-craft.cn`、`yunzhi-textile.cn`、`keqiao-linen.cn` | §3.6 | 下轮内容修订改用 `.example` |
| QA-11 | P3 | 仍开放（实跑） | `vite.config.ts` `__dirname` 与 Vite `configLoader: 'native'` 不兼容 | §3.1 build 告警 `(vite.config.ts:13:33)` | 改 `import.meta.dirname` |
| QA-12 | P3 | 仍开放（实跑） | `design/hifi/login/index.html` L32–34 从 `cdn.jsdelivr.net` 加载字体（设计稿，不进生产） | `grep jsdelivr design content mock src` 仅此 3 行；orders / form hifi 无远程资源 | 统一为本地 |
| QA-14 | P3 | 仍开放（实跑） | 未知路径整页 404 空白（生产 `not_found_handling: none`） | `walk.log` L7 `/after-sales/` → 404，与上轮一致 | 站点级，记录 |
| QA-15 / QA-16 | P3 | 历史·本轮未复验 | `spaRoutes()` 正则脆弱 / 本地静态服务与生产 `*.html` 平铺差异 | 代码未变（实跑 `git diff --stat aa1a164..HEAD -- vite.config.ts tools/_shared.mjs` 无输出） | 见上轮 |

**已关闭**：QA-04（P2，登录第三方三键 / 顶栏搜索 / 头像菜单零反馈）——代码核对 `login/index.tsx` L330、`shell.tsx` L268 / L324–333 均已接 `notYet()` Toast；本轮走查未逐个点击，标注「代码核对关闭，待体验官复验」。QA-07 / QA-13 维持「可接受」。

## 3. 门禁与检查实跑记录

环境：Ubuntu，Node 22.23.2，pnpm 11.9.0，`pnpm install --frozen-lockfile` 成功，输出无 `MINIMUM_RELEASE_AGE`。Playwright 1.62.1（`tools/shoot`，`pnpm exec playwright install chromium` 装 headless shell 1234）。命令在 `apps/reference/` 下执行。

### 3.1 lint / typecheck / build（检查项 ①）
| 命令 | 结果 |
|---|---|
| `pnpm lint`（`eslint . && node tools/no-hardcode.mjs`） | exit 0；eslint 0 error / 0 warning；`no-hardcode: 75 个文件通过`（上轮 47） |
| `pnpm typecheck` | exit 0 |
| `pnpm build` | exit 0，`✓ built in 727ms`；`index-*.css` 205.42 kB、`react` 271.62、`charts` 381.99、`radix` 137.01、**`index-*.js` 538.40 kB（gzip 143.80）→ `> 500 kB` 告警（QA-20）**；`__dirname` 告警（QA-11） |

### 3.2 `tools/a11y.mjs`（检查项 ②）— 全部 EXIT 0，0 FAIL
| 屏 | 结果（light+dark × desktop 1440 + mobile 375；axe serious/critical、375 scrollWidth、热区 ≥ hit、Tab 焦点环、console error） |
|---|---|
| login | 116 PASS / 0 FAIL |
| dashboard | 212 PASS / 0 FAIL |
| orders | 372 PASS / 0 FAIL |
| form | 324 PASS / 0 FAIL |
| kitchen-sink（回归） | 180 PASS / 0 FAIL |

视觉回归 `node tools/shoot.mjs <screen> --build && node tools/compare.mjs <screen>`：login 28/28 最低 98.15%、dashboard 56/56 最低 98.41%、orders 86/86 最低 96.36%、form 84/84 最低 96.85%，阈值 95%，全部通过（shots 未入库）。

### 3.3 依赖许可证与字体（检查项 ③）
`pnpm --filter reference licenses list --prod --json`：MIT 172、ISC 23、OFL-1.1 3、Apache-2.0 3、BSD-3-Clause 3、MPL-2.0 2（lightningcss，构建链，QA-06）、BlueOak-1.0.0 1、0BSD 1、`(MIT OR Apache-2.0)` 1、`MIT AND ISC` 1。**GPL / AGPL / SSPL / BUSL / UNLICENSED / UNKNOWN：0。** 字体仅 `@fontsource-variable/{inter,noto-sans-sc,jetbrains-mono}`（OFL-1.1），`theme.css` 本地 `@import`，`src/` 与 `dist/` 无远程字体 / 图片 URL；hifi 仅 login 稿引用 jsdelivr（QA-12）。

### 3.4 第三方文案 / 图片 / 商标（检查项 ④）
`content/*.md`、`mock/*.json`、`src/` grep `lorem|ipsum|placeholder|unsplash|pravatar|picsum|randomuser`：0 命中。品牌为虚构「栖木家居 / Acme Console」，供应商名（张力木业、林语木作…）为虚构；第三方登录仅 simple-icons CC0 单色路径（QA-07，brief 允许）。未发现竞品 / 官网真实文案。

### 3.5 secrets 与供应链策略（检查项 ⑤）
- `git ls-files | grep -Ei '\.env|\.pem|id_rsa|credentials|secret'`：0；`git grep` AWS/GitHub/OpenAI/Slack token 与私钥头模式：0。
- 仓库无 `.github/`（GitHub Actions 未启用，符合公司规则）。
- `.npmrc` / `pnpm-workspace.yaml` / `package.json` 无 `minimumReleaseAge` 改动（`git diff --stat origin/main...HEAD` 对这三文件无输出），install 无策略告警。

### 3.6 mock 个人信息（检查项 ⑥）
`node mock/check.mjs` → `mock ok (2026-09-06T17:30:00+08:00) — orders.json 5 · orders-all 样本 50 / summary 731 · skus 18 · suppliers 6 · chat 7 会话`。手机号：`orders*.json` 55 处全部 `1xx****xxxx` 掩码；`suppliers.json` / `purchase-form.json` 6 个完整号码均为 `13x0000xxxx` 形态（中间 0000，非真实号段分配）；地址只到区级（「浙江省杭州市 西湖区」）；快递单号 / 订单号为规律生成；邮箱 15 个全在虚构域（QA-10：TLD 真实）。**未发现真实个人信息。**

### 3.7 功能走查（`~/qa/walk.mjs` 76 PASS / 8 FAIL / 14 INFO；FAIL 全部归入 QA-17 / 18 / 19）
- **路由**：`/orders` → 307 `/orders/`；`/orders/`、`/form/`、`/login/`、`/`、`/kitchen-sink/` → 200；`/after-sales/` → 404（QA-14）。
- **orders（1440）**：默认 success、计数 731、每页 20（`summary.defaultPageSize`）、下单时间倒序、页码 37 且样本外页 `aria-disabled`；金额排序 + URL `sort=amount&dir=desc`；搜索无结果 → 空态 → 清除恢复；状态=待发货 → 63 单；全选 → 「已选 20 单」；行菜单「标记发货」→ Toast，关菜单焦点回触发器；点行开 Drawer → 物流 Tab → 添加备注 Toast → Esc 关闭 → 焦点回表格行；Drawer 底部取消 → 未选原因阻断（`aria-invalid`）→ 确认 → Toast → 行变已取消；删除（直达 URL）→ Toast + 撤销 → 行恢复；导出 Toast；每页 10 / 第 3 页 range；error 态重试、loading `aria-busy`、empty-new；console error 0（除 QA-17 的 404）。
- **orders（375 触屏）**：20 张卡片、scrollWidth 375、筛选 Sheet → 「查看 63 单」→ 「筛选 · 1」、卡片开 Drawer、console 0。
- **form（1440）**：第 1 步校验阻断 + Alert「还有 1 项需要修正」+ 首错聚焦；第 2 步加行 / 未选 SKU 行内错误；第 3 步条款默认未勾、未同意 `aria-disabled` 阻断；《采购条款》Dialog；提交 → success「采购单已提交」副文案用当前邮箱；「再建一张」回第 1 步；`?state=loading` 「提交中…」；`?fail=1` → error 且焦点在「重新提交」；dirty 离开 → 确认 Dialog → 继续填写 / 放弃并离开（→ dashboard 正确）；保存草稿 Toast → 之后离开无确认（但整页跳出，QA-17）。reducedMotion 下 `--motion-slow=0ms` loading 瞬时结束属预期。
- **form（375）**：「第 1 步，共 3 步」、无溢出、三步走通、提交成功、console 0。
- **login → dashboard**：提交 → `/?toast=login` 欢迎 Toast，h1 可见。

## 4. 本轮未覆盖（如实标注）
- form 供应商联想 / SKU 联想浮层的键盘导航、附件上传、日期选择器交互（只验证了校验与步进）。
- orders 375 行菜单（卡片模式菜单同组件，QA-18 按代码同理，未实测）；批量操作条的批量发货 / 批量取消；键盘 Tab 全表遍历。
- dashboard 图表 / 日周月切换 / 通知面板回归（上轮体验官已测，本轮仅 h1 + 侧栏 + 查看全部）。
- 1024 / 768 断点仅靠 compare.mjs 像素对比，无交互走查。
- 暗色主题仅靠 a11y.mjs + compare.mjs 覆盖，未手动走查。
- 生产站（ui.zalize.com）未实查：集成分支未部署，QA-17 在生产的表现（跳到画廊首页）为按站点结构推断。

## 5. 明确不在本轮范围（不计 P0/P1）
`components`（round2 卡片形态不符）、`landing`（compare 最低 83.67%，hifi 侧 eyebrow 特异性问题）、`chat`（与 orders 的 `shell.tsx` ShellProps 冲突未合入）——均按项目负责人说明未合入 `fe01/integration`，本报告未审计、未计分；`fe01/integration@6f4fe2a` 的 `shell.tsx` 已是 orders + form 属性并集，chat 合入时按其 merge 说明取并集即可。

## 6. 复验清单（交 gates-fix 后 QA 复查用，时间盒 30 分钟）
1. QA-17：orders → 仪表盘、form（保存草稿后）→ 仪表盘、dashboard 点自身、（QA-19 修后）dashboard → 订单：URL 始终 `/apps/reference/…`，console 404 = 0。
2. QA-18：`~/qa/menu.mjs` 同法——鼠标 / 键盘 / reducedMotion × 「查看详情 / 取消订单 / 删除订单」12/12 出覆盖层且 URL 含 `open=`；「标记发货 / 复制订单号」不回退。
3. QA-19：侧栏「订单」`href=/orders`、无 `aria-disabled`、当前页 `aria-current=page`；「查看全部」可点。`settings` 仍禁用。
4. 回归：`pnpm lint && pnpm typecheck && pnpm build`，`a11y.mjs` 四屏 0 FAIL，`compare.mjs` dashboard / orders ≥ 95%。
