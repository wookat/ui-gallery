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

**L-D2 · 三屏品牌图形不一致**

- login hifi 三横线 / dashboard hifi 屋形 / landing hifi「A」形。实现侧 `BrandMark` 已按稿分别提供 `variant="lines" | "house" | "a"`，建议设计侧统一为一个图形后实现侧收敛为单一 variant。

### 本轮修复记录（审查问题清单）

| 问题 | 修法 | 实测证据 |
|---|---|---|
| 缺 `scroll-padding-top: calc(navbar + space.4)`，锚点导航后 section 顶被固定导航遮住 | `#main` 与 `#main > section` 加 `scroll-mt-[calc(var(--size-navbar)+var(--space-4))]`（仅引用令牌变量） | 375 下点「产品」后 `#features.top = 80.3px`，导航底 64px，间距 16px；computed `scroll-margin-top = 80px` |
| Sheet 实测 280px（`w-sidebar-drawer` 与 `w-sheet` 未被 cn 视为同组） | `src/lib/cn.ts` 扩展 `theme.spacing` 校验器，命名令牌（如 `sheet` / `sidebar-drawer` / `hit`）参与冲突合并；后者覆盖前者 | 375 / 768 抽屉 `getBoundingClientRect().width = 320`，class 仅剩 `w-sheet`；login 28/28、dashboard 56/56 compare 仍 ≥ 98.3%，无回归 |
| 品牌标复用 login 三横线 | `BrandMark` 新增 `variant="a"`（hifi 同一 path），landing 全部品牌位改用 | 代码核对 + compare menu-open 99.3–99.7% |
| 抽屉初始焦点落底部主题切换 | `SheetContent` 关闭按钮标 `data-slot="sheet-close"`；landing 用 `onOpenAutoFocus` 把焦点移到该按钮（对应 hifi `.js-close-menu.focus()`） | 375 / 768 打开菜单后 `document.activeElement = BUTTON[关闭菜单]` |

### 门禁实跑结果（commit 见 git log）

- `pnpm lint` ✔（eslint + no-hardcode 73 文件）· `pnpm typecheck` ✔ · `pnpm build` ✔
- `node tools/a11y.mjs landing` → ALL PASS（axe serious/critical 0、375 无溢出、热区 ≥ 40、焦点环缺失 0、console error 0）
- `node tools/shoot.mjs landing && node tools/compare.mjs landing` → 20/20 对比，阈值 95%：
  - mobile-menu-open 4 张：99.33–99.70% ✔（修复前 86.0 / 93.2%）
  - navbar-scrolled 6 张：87.80–94.63%（修复前 84.9–93.5%；剩余差异 = L-D1 眉题字阶/间距导致的整体下移）
  - default / pricing-yearly 整页 10 张：82.96–89.75%，ref 仍比实现高 148–279px（全部为 L-D1）
  - 结论：compare 门禁在 L-D1 修正并重生成 ref 前无法转绿；diff 图见 `shots/reference/landing/diff/`（不入库）
