# /components 第 3 轮升级修复 notes（tech-lead 接手）

基线：`fe01/screen-components` @ 4773be6。原则：每条先用 Playwright 脚本实测复现再修；判定为 hifi/基准侧缺陷的项不改 `design/`，列入 unfixed 并附实测证据。

## 1. 复现 → 修复（实现侧）

### 1.1 TabsDemo forceMount 面板可 Tab 到且无焦点环（a11y）
- 复现（基线）：`#navigation` 内 `[role=tabpanel]` 12 个，均 1×1、`tabindex=0`、`sr-only`；从 month 触发器按 Tab 依次落到 `-content-day/week/month`，`:focus-visible` 无 ring。官方 `a11y.mjs` 基线 3 跑 2 FAIL（与审查一致）。
- 修：`demos.tsx` TabsContent 改为 `forceMount hidden className="hidden"`（保留 DOM 以满足触发器 `aria-controls` 引用，`hidden` 使其不可聚焦、不占布局）。
- 修后实测：Tab 顺序不再经过任何 tabpanel；`a11y.mjs components` 全部状态 PASS（356 条 PASS，0 FAIL）。

### 1.2 CodeBlock 三色语法着色缺失（snippet-expanded 1440/375）
- 复现：hifi `.k/.s/.a` 计算色 rgb(23,115,106)/rgb(17,115,63)/rgb(92,104,104)，实现 `pre code` 单色 fg。
- 修：`code-block.tsx` 新增可选 `highlight?: "jsx"` + 本地 tokenizer（标签 → `text-primary`，字串/`{}` 值 → `text-success`，`//` 注释 → `text-fg-muted`），不引依赖；components 展开片段传 `highlight="jsx"`，chat 等调用方不受影响。
- 修后实测：三类 token 计算色与 hifi 逐一相等；snippet-expanded 4 图 90.2–94.6% → 97.2–98.8%。

### 1.3 Typography 矩阵列宽/下移
- 复现：1440 列宽 hifi [196,796,190] vs 实现 [159,890,133]；caption 下边距 hifi 25px vs 实现 28px；hifi `.comp` gap = space.4 而实现卡片内 gap-6。
- 修：`index.tsx` 示例列加 `MATRIX_TD_WIDE`（min-width = content-max/5，同 hifi）、caption `pb-3→pb-2`、层级示例去掉 `gap-2` 覆盖、卡片内 gap-6→gap-4；`kit.tsx` `MATRIX_TH` 加 `box-content` 使表头渲染高 41px（= hifi `height: size.table-header` 的 content-box 语义）。
- 修后实测：typography 4 图 93.9–94.2% → 96.0–96.6%；default 2 图 94.9% → 97.2%。

### 1.4 Table 示例：订单号字号 / 商品列颜色 / 表头高
- 复现：`#data-display .table` 表头 57px vs hifi 41px；订单号 12px vs hifi 14px mono；商品列 fg-muted vs hifi fg；首列 hifi 52px（40 热区 + 12 padding）vs 实现 40/32px。
- 修：`demos.tsx` 表头 `h-table-header`；订单号（含密度表）`font-mono text-sm`；商品列去 `text-fg-muted`；复选框包 `size-hit` 居中容器（= hifi `.check.solo`），首列自然宽 52；375 下"左右滑动查看更多"加 `mt-3`（= hifi `.table-hint`）。
- 修后实测：表头 41/41、订单号 14px mono、商品列 fg 与 hifi 一致；desktop data-display 94.2/95.0% → 96.6/96.4%。

### 1.5 附带按 hifi 修正（审查未列、实测差异）
- `SuggestionChip` `text-role-body → text-role-label`（hifi `.suggestion font: typography-label`）：mobile onboarding 92.8/93.6% → 95.7/95.7%。
- NavDemo 列表加 `gap-1`（hifi `.nav-list gap: space.1`）：mobile navigation 94.5/95.7% → 96.0/96.9%。

## 2. unfixed（基准侧 / 数据侧，附实测证据，不改设计稿）

1. **10 张 mobile 基准图为横滚中间态**：`design/hifi/components/check.mjs` 截图前对所有控件 `scrollIntoView({inline:'center'})`，只还原了截图前已有滚动量的元素，嵌套 `.matrix-wrap/.table-wrap` 初始 scrollLeft=0 不在还原名单。实测探测后 wrap scrollLeft：button 385/540/173，form-controls 1143/285/1039/709，data-display 878/0/0/0/0。用 hifi 默认态重渲染与入库 ref 对比：mobile-*-button 88.7/90.1%，form-controls 95.7/95.6%，data-display 96.1/96.5%；模拟探测滚动后 91.7/91.4%、97.5/97.5%、100/100%。实现按默认态截图，无法达到 95%。
2. **hifi form-controls 示例值不在 mock**：hifi 40 / 1280.00 / -1 / 5374.00 / "到货请先送 B 区质检台…"；`mock/purchase-form.json` `.draft.items[0].qty=60`、`.unitPrice=480`、备注为 `draft.note`。实现取 mock 真值正确，desktop/mobile form-controls 4 图 92.5–93.1%。
3. **hifi Table/OrderCard/层级示例数据与 mock 不一致**：hifi SO-20260906-0043 商品含第 3 项"新西兰羊毛地毯 1.6×2.3m ×1"、头像 hue-45、手机 136****5527；`mock/orders-all.json` 该单仅 2 项、`avatarHue: 280`、150****6624。hifi 层级示例文案（胡桃木床头柜/合计 ¥5,374.00/17:26·天猫旗舰店·杭州仓）亦为手写。实现按 mock 渲染，mobile data-display 94.3/94.7%。
4. **hifi 导航示例分组与 mock/nav.json 不一致**：hifi 分组"经营/系统"、库存徽标 3；mock 为"概览/交易/货品…"、库存徽标 12。实现按 mock。
5. **mobile composed 92.1/93.2%（本轮由 97–98% 回落）**：非结构差异——1.5 修后 `#composed` 顶部落在 24870.5px（亚像素），段落第 2–4 行整体上移 1px 触发全文字抗锯齿差异；hifi 与实现均存在分数高度（typography-label 14×1.4=19.6），无法在不改 hifi/令牌前提下对齐取整。
6. 根目录 `pnpm lint`（turbo 全 workspace）在本机因其他 `apps/<库>/` 未安装 node_modules 报 `eslint: not found`（非本轮范围，AGENTS.md 明示不改）；改用 `--filter=reference` 跑通。

## 3. 门禁实跑结果（修后，apps/reference）

| 命令 | 结果 |
|---|---|
| `pnpm lint` | exit 0（eslint + no-hardcode 76 文件通过） |
| `pnpm typecheck` | exit 0 |
| `pnpm build` | exit 0 |
| `node tools/shoot.mjs components` | exit 0，92 张 |
| `node tools/compare.mjs components` | exit 1：48/48 已对比，最低 86.83%，10/48 < 95%（基线 21/48，最低 85.92%）；低于阈值的 10 张全部为 §2 第 1/2/3/5 条 |
| `node tools/a11y.mjs components` | exit 0，ALL PASS（356 PASS / 0 FAIL） |
| `node tools/no-hardcode.mjs` | exit 0 |

仓库根：`pnpm turbo run lint typecheck build --filter=reference` 3/3 successful；`pnpm turbo run build --filter=@ui-gallery/gallery && node tools/assemble.mjs` → `assembled 1 apps`；完整 `pnpm lint` 见 §2 第 6 条。

< 95% 明细：desktop-{light,dark}-form-controls 92.58/92.52；mobile-{light,dark}-button 86.83/88.23；mobile-{light,dark}-form-controls 93.11/92.73；mobile-{light,dark}-data-display 94.74/94.28；mobile-{light,dark}-composed 93.18/92.12。
