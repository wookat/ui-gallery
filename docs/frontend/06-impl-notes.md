# 06 实现阶段 notes（按稿实现 → 交回设计侧的问题）

> 阶段 5/6 产物。实现阶段不改 `design/hifi/*` 与令牌；实现方发现的设计稿问题在此记录，交回设计侧修正后重生成 `ref/*.png` 并复跑 `node tools/compare.mjs <screen>`。每条标明证据来源（浏览器实测 / 代码核对）。

## landing（分支 `fe01/screen-landing`）

### 交回设计侧（未修，属 hifi 缺陷）

**L-D1 · `.sec-head p` / `.sol-text > p` 特异性覆盖 `.eyebrow`**

- 位置：`design/hifi/landing/index.html`
  - `.sec-head p { margin-top: var(--space-4); font: var(--typography-lead); color: var(--color-role-fg-muted); }`（特异性 0,1,1）
  - `.sol-text > p { margin-top: var(--space-4); font: var(--typography-lead); color: var(--color-role-fg-muted); }`（0,1,1）
  - `.eyebrow { font: var(--typography-eyebrow); color: var(--color-role-primary); text-transform: uppercase; }`（0,1,0）
- 现象（Playwright 对 hifi 实测 computed style）：5 个 section-head 与 3 个 solution 的 `<p class="eyebrow">` 实际渲染为 16px/25.6px（solution 内 14px/22.4px）fg-muted + margin-top 16px；仅 hero eyebrow 为意图中的 12px primary。ref PNG 因此比按 `.eyebrow` 意图实现的页面高 148–279px。
- 实现侧处理：按 `.eyebrow` 意图渲染（`text-role-eyebrow text-primary`），不复制缺陷。
- 建议修正：给 `.eyebrow` 提特异性（如 `.sec-head .eyebrow` / `.sol-text > .eyebrow`），或把 `.sec-head p` / `.sol-text > p` 改为 `.sec-head > p:not(.eyebrow)`，然后重生成 `ref/*.png`。在此之前 `compare.mjs landing` 整页状态（default / pricing-yearly 各视口亮暗）与 navbar-scrolled 状态无法过 95%。
- 第 3 处（第 3 轮补充，第 385 行）：`@media (max-width: 767px)` 内 `.sol-text > p, .bullets li { font: var(--typography-body); }` 同样命中 3 个 solution 眉题（375 下眉题 14px/22.4px 而非 12px/16.8px，`#solutions` 因此比实现高 42.4px，三个 `.sol` 各 +15.2 / +12 / +15.2）。只修前两处、不修这一处时，375 整页仍差 42px（临时修正 hifi 对比 ≈ 89–90%）；三处一起改为 `:not(.eyebrow)` 后，实现与 hifi 在 375 / 768 / 1024 / 1440 各 section top/height 逐项一致（见下方第 3 轮门禁结果）。

**L-D2 · 三屏品牌图形不一致**

- login hifi 三横线 / dashboard hifi 屋形 / landing hifi「A」形。实现侧 `BrandMark` 已按稿分别提供 `variant="lines" | "house" | "a"`，建议设计侧统一为一个图形后实现侧收敛为单一 variant。

### 本轮修复记录（审查问题清单）

| 问题 | 修法 | 实测证据 |
|---|---|---|
| 缺 `scroll-padding-top: calc(navbar + space.4)`，锚点导航后 section 顶被固定导航遮住 | `#main` 与 `#main > section` 加 `scroll-mt-[calc(var(--size-navbar)+var(--space-4))]`（仅引用令牌变量） | 375 下点「产品」后 `#features.top = 80.3px`，导航底 64px，间距 16px；computed `scroll-margin-top = 80px` |
| Sheet 实测 280px（`w-sidebar-drawer` 与 `w-sheet` 未被 cn 视为同组） | `src/lib/cn.ts` 扩展 `theme.spacing` 校验器，命名令牌（如 `sheet` / `sidebar-drawer` / `hit`）参与冲突合并；后者覆盖前者 | 375 / 768 抽屉 `getBoundingClientRect().width = 320`，class 仅剩 `w-sheet`；login 28/28、dashboard 56/56 compare 仍 ≥ 98.3%，无回归 |
| 品牌标复用 login 三横线 | `BrandMark` 新增 `variant="a"`（hifi 同一 path），landing 全部品牌位改用 | 代码核对 + compare menu-open 99.3–99.7% |
| 抽屉初始焦点落底部主题切换 | `SheetContent` 关闭按钮标 `data-slot="sheet-close"`；landing 用 `onOpenAutoFocus` 把焦点移到该按钮（对应 hifi `.js-close-menu.focus()`） | 375 / 768 打开菜单后 `document.activeElement = BUTTON[关闭菜单]` |

### 第 2 轮审查修复记录（a5fd68e 审查清单）

| 问题 | 修法 | 实测证据 |
|---|---|---|
| blocking · 年付副价「折合 ¥82.50 / 月」被 `[&_header_.tabular-nums]:text-role-display-lg` 命中，渲染成 display-lg | 选择器改为 `[&_header_.text-role-display]:text-role-display-lg`，只命中 PricingCard 价格 span（其自带 `text-role-display`）；不改 PricingCard 组件与设计稿 | 1440 / 375 / 768 / 1024 × 亮暗 `?cycle=yearly`：价格 span 36px（display-lg），副价 span 12px + fg-muted（hifi `.price-sub` caption）；三卡等高（1440 486.7px） |
| minor · Sheet 关闭钮贴顶右（中心 y≈27），hifi 与品牌行同行居中（y≈32、右距 space.3） | landing 给 `SheetContent` 追加 `[&_[data-slot=sheet-close]]:top-[calc((var(--size-navbar)-var(--size-hit))/2)] [&_[data-slot=sheet-close]]:right-3`（只引令牌变量；组件默认值不动，login/dashboard 不受影响） | 375 / 768 `?open=menu`：关闭钮中心 y = 32、距抽屉右边 12px；初始焦点仍在关闭钮 |
| minor · 分屏②预警 Tag 取 stats.lowStock（12 SKU 库存预警），hifi「2 个 SKU 低于安全线」 | `INVENTORY_BARS` 带相对高度比，低于 `SAFETY_RATIO` 的柱既着 warning 色也计入 Tag 数（mock/landing.json `solutions[1].visual`「6 条，2 条为 warning 色」）；文案新增 content key `solutions.inventory.lowStock`（`{n} 个 SKU 低于安全线`） | 全部视口渲染「2 个 SKU 低于安全线」，与图中 2 根 warning 柱一致 |
| minor · 分屏③助理答复取 chat.json c_1 markdown 首段，hifi 为床头柜一句 | 新增 content key `solutions.assistant.answer`（`{name}{sku}，近 7 天因缺货延迟发货 {n} 单，当前库存 {stock} / 安全线 {safety}。`），字段全部取 mock/skus.json 缺货最多项（QM-NS-WAL-2D：14 单、18 / 40）；提问与来源 Chip 仍取 chat.json c_1 | 渲染「胡桃木床头柜（双抽）QM-NS-WAL-2D，近 7 天因缺货延迟发货 14 单，当前库存 18 / 安全线 40。」+ 来源 SO-20260903-0087，与 hifi 逐字一致（数字与 chat.json c_1 表格同源） |

### 第 3 轮审查修复记录（0027e3e 审查清单，tech-lead 接手）

| 问题 | 修法 | 实测证据 |
|---|---|---|
| blocking · 定价卡特性列表→按钮间距：hifi `.plan` 为 grid `auto auto auto 1fr auto` + 空 `<span>` 撑位行，列表与按钮最小间距 = 2×space.6 = 48px；实现 `PricingCard` 为 `flex-col gap-6` 仅 24px，每卡矮 24px，其后 quotes / faq / cta / footer 整体上移 | 只改 `pages/landing/index.tsx` 的 `PricingCard className`：追加 `[&>ul]:mb-6`（列表下 margin 24 + gap 24 = 48，等价 hifi 撑位行）；同时 `mobile:p-6` 改为 `mobile:p-8 mobile:max-md:p-6`（hifi 768 下 `.plan` padding 仍是 space.8，375 才降到 space.6；原实现 768 下多矮 16px）。不改 `composed/pricing-card.tsx`（kitchen-sink / settings 同用），不改 hifi 与令牌 | 复现（修前，Playwright 对 hifi vs 实现 `getBoundingClientRect`）：1440 卡高 510.7 vs 486.7、list→btn 48 vs 24；768 卡高 476.3/476.3/510.7 vs 436.3/436.3/470.7；375 卡高 425.9/460.3/494.7 vs 401.9/436.3/470.7。修后三视口 × 亮暗 × 月付/年付：卡高、list→btn（48px）、`#pricing` 高度（1440 988.7 / 768 1489.4 / 375 1847.4）与 hifi 逐项相等；对比 L-D1 临时修正后的 hifi（本地 `shots/`，不入库），20 张全部 ≥ 99.55%（详见门禁结果） |
| 06-impl-notes 第 54 行「全部为 L-D1」「年付定价卡区域…与 ref 一致」结论有误 | 已改写为下方第 3 轮门禁结果，区分「L-D1 造成的差」与「定价卡实现差」 | 修前 ref−实现 高差 148 / 261 / 279 / 148（1440 / 375 / 768 / 1024），其中定价卡贡献 24 / 72 / 80 / 24（1440 一行 3 卡 24；375 三卡竖排 3×24；768 两行 40+40）；修后剩 124 / 189 / 199 / 124，逐 section 核对全部落在 L-D1 三处眉题 |

未修（非实现分支可改）：

- blocking · `compare.mjs landing` 对官方 `ref/*.png` 仍未达 95%：定价卡实现差已修完，剩余 ref 比实现高 124–199px 全部为 L-D1（含第 385 行 mobile 媒体查询那一处）。实现阶段不改 `design/hifi/*`；待设计侧三处一起修正并重生成 `ref/*.png` 后复跑即可转绿（用本地临时修正的 hifi 重生成 20 张 ref 对比，最低 99.55%）。
- minor · L-D2 三屏品牌图形不一致：跨屏设计侧遗留，实现按 landing hifi 的 A 形绘制，待设计统一。
- 本轮新增 content key 只追加在 `content/landing.md`，不影响已上线 login / dashboard 文案；未改 `design/` 与 `mock/`。

### 第 4 轮审查修复记录（0a5e2c3 审查清单，tech-lead 升级修复）

| 问题 | 修法 | 实测证据 |
|---|---|---|
| 交互反馈 · 375 / 768 × 亮暗：移动菜单 Sheet 关闭后焦点未归还汉堡（Escape / 关闭钮 / 菜单内锚链接三种关闭方式后 `document.activeElement = body`），违反 hifi `check.mjs` L301「Escape 关闭 Sheet，焦点回汉堡」 | 根因确认：汉堡是普通 `IconButton onClick=setMenu(true)`，不在 `<Sheet>` 子树内、未用 `SheetTrigger`，Radix Dialog 默认 `onCloseAutoFocus` 去聚焦 `triggerRef.current`（null）→ 无归还。修法：汉堡挂 `burgerRef`，`SheetContent` 传 `onCloseAutoFocus={focusBurger}`（`preventDefault` 后 `burgerRef.current?.focus()`），对应 hifi `closeMenu → lastFocus.focus()`；L750 注释改为如实描述。不改 `components/ui/sheet.tsx`（login / dashboard / chat 同用）、不改 hifi 与令牌 | 复现（修前，Playwright 对 dist 实测，`~/repro-landing-focus.mjs` 不入库）：375 / 768 × 亮 / 暗 × Escape / 关闭钮 / 锚链接 12 组，Tab 到「打开菜单」→ Enter（焦点落「关闭菜单」）→ 关闭后 `activeElement` 全部为 `body`，12/12 FAIL。修后同一矩阵 12/12 PASS：关闭后 `activeElement = button[aria-label=打开菜单]`，URL 已清除 `open`，console error 0 |

### 门禁实跑结果（第 4 轮，commit 见 git log）

- `apps/reference/`：`pnpm lint` ✔（eslint + no-hardcode 76 文件）· `pnpm typecheck` ✔ · `pnpm build` ✔
- `node tools/shoot.mjs landing && node tools/compare.mjs landing` → 20/20 ≥ 95%，最低 99.55%（tabletSm-light-mobile-menu-open），最高 99.91%；L-D1 已由设计侧在 e389b5a 修正并重截 ref，compare 门禁转绿
- `node tools/a11y.mjs landing` → ALL PASS（axe serious/critical 0、375 无溢出、热区 ≥ 40、焦点环缺失 0、console error 0）
- 焦点归还矩阵（上表）12/12 PASS

### 门禁实跑结果（第 3 轮，commit 见 git log）

- `apps/reference/`：`pnpm lint` ✔（eslint + no-hardcode 73 文件）· `pnpm typecheck` ✔ · `pnpm build` ✔ · `node tools/no-hardcode.mjs` ✔
- `node tools/a11y.mjs landing` → ALL PASS（axe serious/critical 0、375 无溢出、热区 ≥ 40、焦点环缺失 0、console error 0；20 个状态×视口×主题）
- `node tools/shoot.mjs landing && node tools/compare.mjs landing`（对官方 ref）→ 20/20 对比，阈值 95%，最低 83.67%，未过：
  - mobile-menu-open 4 张：99.55–99.80% ✔
  - navbar-scrolled 6 张：87.80–94.63%（视口内差异 = L-D1 眉题字阶/间距导致的整体下移）
  - default / pricing-yearly 整页 10 张：83.67–89.84%，ref 比实现高 124–199px（1440 6793 vs 6669、375 10805 vs 10616、768 8294 vs 8095、1024 6649 vs 6525）；较第 2 轮实现高度分别 +24 / +72 / +80 / +24 = 定价卡修复量，剩余差全部为 L-D1
  - 结论：compare 门禁在设计侧修 L-D1（三处）并重生成 ref 前无法转绿；diff 图见 `shots/reference/landing/diff/`（不入库）
- 佐证（本地临时产物，不入库）：把 hifi 复制到 `shots/hifi-landing-ld1/` 并只把 L-D1 三处改为 `:not(.eyebrow)`，按 `check.mjs` 同一矩阵重生成 20 张 ref 与实现截图 pixelmatch：desktop 99.80–99.98%、tablet 99.71%、tabletSm 99.55–99.80%、mobile 99.60–99.91%，最低 99.55%，20/20 ≥ 95%；各视口整页高度与实现完全一致（1440 6669、1024 6525、768 8095、375 10616）

### 第 2 轮门禁结果（a5fd68e / 0027e3e，供对照）

- compare 20/20，最低 82.87%：default / pricing-yearly 10 张 82.87–88.89%，ref 比实现高 148–279px（1440 6793 vs 6645、375 10805 vs 10544、768 8294 vs 8015、1024 6649 vs 6501）。当时记为「全部为 L-D1」有误：其中 24 / 72 / 80 / 24px 是定价卡 list→btn 24px（应 48px）与 768 下 padding 24px（应 32px）的实现差，已在第 3 轮修正。
