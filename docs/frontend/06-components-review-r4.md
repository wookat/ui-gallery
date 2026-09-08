# /components 第 4 轮独立审查修复 notes（impl 产出者）

基线：`fe01/screen-components` @ 5708fe2。原则同 r3：先按 hifi `design/hifi/components/index.html` 逐段核对再修；hifi 手写值与 `mock/` / `content/` 不一致的项不改设计稿也不造数据，列入 unfixed 并附证据。

## 1. blocking 逐条修复（实现侧）

### 1.1 卡片「Tabs · Segmented · Stepper」缺 line / vertical / 计费周期 / 垂直 Stepper
- `ui/tabs.tsx` 新增 `variant: "pill" | "line" | "vertical"`（context 下发到 `TabsList` / `TabsTrigger`，只用主题类：line = 底边 `border-b` + 选中 `border-primary`；vertical = 列向、选中 `bg-primary-soft text-primary`、图标 `size-icon-md`）。
- `round2.tsx` NavExtras 新增行「Tabs line / vertical」：
  - line：`全部 234 / 待发货 63 / 退款中 4`（退款中 `data-demo="focus"`）。数值口径：234 = 既有 Pagination 演示常量 `TABLE_TOTAL`（hifi 孤立演示口径，与 `mock/orders-summary.json` 的 731 不同）；63 = `ordersSummary.byStatus.pending_shipment`；4 = `mock/orders-all.json` 样本内 `status === "refunding"` 行数。全部来自仓库现有数据，不新造。
  - vertical：`mock/settings.json` `tabs` 四项 + lucide `User / Bell / Shield / CreditCard`。标签取 mock 真值 `个人资料 / 通知 / 账号安全 / 计费`（hifi 第四项写 `账单`，见 §2.2）。
- Segmented 行新增第 4 列「计费周期」：`按月 / 按年 + Tag success「省 17%」`；17 = `round((1 − 2990 / (299 × 12)) × 100)`，按 `mock/settings.json` 推荐套餐 monthly/yearly 现算，不写死。
- `composed/stepper.tsx` 新增 `orientation="vertical"`、`description` 描述行、done/error 图标（Check / X）、连接线、`aria-current="step"`；Stepper 行新增第 4 列 vertical：`已付款`（描述 = `formatFullDateTime(paidAt)`）/ error `发货失败`（描述 `面单打印异常，请重试`）/ todo `已签收`。文案在 `content/components.md` `sample.stepper.*`。

### 1.2 卡片「PricingCard · MemberRow · SessionRow」
- `composed/pricing-card.tsx` 新增 `description` 描述行；年付副文案由调用方传 `note`：`/ 年 · 约 ¥83 / 月`、`/ 年 · 约 ¥249 / 月 · 省 2 个月`、`/ 年 · 约 ¥749 / 月`（`约 ¥{n} / 月` = `yearly / 12` 取整；`省 2 个月` = 既有 `landing.pricing.save` 文案）。描述来自 `mock/landing.json` `刚起步的独立品牌 / 多渠道运营的成长团队 / 多仓多店的成熟品牌`。
- 新建 `composed/member-row.tsx`：头像 / 名字 + meta / 角色原生 `Select`（当前用户 disabled + 「你」）/ 状态 Tag / 尾部动作；`data-pending` 待接受邀请态（邮件图标头像）。示例三行：当前用户、普通成员（`formatRelativeToAsOf` → `2 小时前活跃`，取 `mock/settings.json team.members` 中首个有 ≥1h 相对时间的非 admin 成员）、`pendingInvites[0]`（撤回邀请）。
- 新建 `composed/session-row.tsx`：设备图标（`Smartphone` / `Monitor`）/ 设备 + Tag / 位置 · IP · 时间 / 尾部（当前会话「刚刚」、其他会话「注销」、最后一行演示 loading「注销中」）+「注销其他所有会话」danger 按钮；数据 `mock/settings.json security.sessions`。
- `composed/avatar.tsx` 新增 `children`（图标头像），供上两者复用。

### 1.3 卡片「Sheet · Drawer · Anchor」
- Drawer 触发器 + 浮层从 Dialog 卡移出（`overlayCols.dialog` 现只含 Tooltip 列；Dialog / AlertDialog 仍在原行），`demos.tsx` overlay row `sheet` 改为三列 `Sheet / Drawer / AnchorNav`，Drawer 为 `round2.tsx` 导出的 `DrawerExample`（仍绑 `?open=drawer`）。
- 新建 `composed/anchor-nav.tsx`：左侧 `border-width-focus` 竖线、当前项 primary 竖线 + primary 文字、行高 `min-h-hit`、`aria-current`；`AnchorExample` 五项 `基本信息 / 通知偏好 / 安全 / 账单与计划 / 危险操作`（`content/components.md` `sample.anchor.*`）。
- `shots.json` `drawer` 条目 `scrollTo` 由 `#comp-dialog` 改为 `#comp-sheet`。

### 1.4 Tabs forceMount 回归
- 新增的 line / vertical Tabs 同样 `TabsContent forceMount hidden className="hidden"`。修后实测（Playwright，1440 / 375）：`[role=tabpanel]` 19 个全部 `hidden`，隐藏面板内可聚焦元素 0，`aria-controls` 悬空 0；`a11y.mjs` 356 PASS / 0 FAIL（含「焦点环缺失 0」）。
- 顺手：新行 region 标签改为「Tabs line / vertical」，避免与既有「Tabs」矩阵触发 axe `landmark-unique`（minor，仍留 1 处 breadcrumb 与既有 r3 一致）。

### 1.5 /kitchen-sink 重定向与 mock/nav.json
- 本分支已含 a0ea7a6；实测 `GET /apps/reference/kitchen-sink?theme=light` → `/apps/reference/components?…&from=kitchen-sink` 且显示「/kitchen-sink 已迁移到 /components」，console error 0。
- `mock/nav.json`：本分支自 merge-base 431524a 起**未改动**该文件；`origin/fe01/integration` 侧仅改 orders `implemented: false → true`。在临时 worktree 试合 `origin/fe01/integration`：`mock/nav.json`、`gallery/`、`apps/reference/gallery.json` 均自动合并（取集成分支版本），无冲突；冲突只在 §2.4 两文件。

## 2. unfixed（附证据）

1. **compare 门禁 exit 1：48/48 已对比，最低 86.83%，9/48 < 95%**（r3 为 10/48）。9 张全部为 r3 §2 第 1/2/3 条已记录的基准侧 / 数据侧原因（mobile button 86.83/88.23、form-controls 92.5–93.1 ×4、mobile data-display 94.74/94.28）加本轮新出现 `mobile-light-section-layout` 94.32%（dark 96.73%）。后者实测：`#layout` 在 375 顶部落在 19251.53px（亚像素，与 r3 §2.5 同机理），叠加 AppShell 迷你预览侧栏比例与 hifi 本有差异；未改 layout 区任何代码。mobile composed 由 r3 的 92.1/93.2 回升到 96.82/95.90。
2. **hifi 手写值 ≠ mock**（不造数据，按 mock 渲染）：垂直 Stepper 已付款时间 hifi `2026-09-06 12:04`，`mock/orders-all.json` 无该时间（示例单 paidAt 为 17:27 等）；vertical Tabs 第四项 hifi `账单` vs `mock/settings.json` `计费`；SessionRow 当前会话徽标 hifi `当前` vs content `当前设备`；MemberRow 待接受邀请 hifi `zhangyue.finance@… / 财务 / 3 天前过期`，mock 只有 `xinyi.lu@… / 成员`，且 roles 无「财务」、无过期字段；hifi 第二成员 `何嘉豪 · 仓管`，mock 角色枚举为 管理员 / 成员 / 只读。
3. **hifi 该卡片为 grid-3 demo-box 排布，实现沿用页内既有状态矩阵（Row）排布**：375 下 vertical Tabs / vertical Stepper 落在横滚矩阵第二列（有「左右滑动」提示），与 hifi 竖向堆叠不同。三张卡片不在 48 张基准图取景内（基准只截各区首屏），不影响 compare；如需与 hifi 同排布需整卡改为 DemoBox 栅格，未在本轮时间盒内。
4. **未把 `origin/fe01/integration` 合回本分支**：试合冲突 2 处均为双侧 API 演进——`ui/alert.tsx`（本分支 `action` + `appearance` vs 集成分支 orders/form 的 `actions` + `wrapActions`）、`ui/file-dropzone.tsx`（本分支 `dragoverTitle` / `dragover` vs 集成分支图标 `UploadCloud → Upload`）。建议集成阶段取并集（Alert 同时支持 `action`/`actions`/`wrapActions`/`appearance`；Dropzone 用 `UploadIcon` + 保留 `dragoverTitle`），并重跑 orders / form / components 三屏门禁。已按要求核对 `fe01/integration` 已含 `origin/main`。
5. 根目录 `pnpm lint`（turbo 全 workspace）在本机因其他 `apps/<库>/` 无 node_modules 失败，同 r3 §2.6；本轮门禁在 `apps/reference/` 下跑。

## 3. 门禁实跑结果（修后，apps/reference）

| 命令 | 结果 |
|---|---|
| `pnpm lint` | exit 0（eslint + no-hardcode 79 文件通过） |
| `pnpm typecheck` | exit 0 |
| `pnpm build` | exit 0（chunk > 500 kB 警告，既有） |
| `node tools/shoot.mjs components` | exit 0，92 张 |
| `node tools/compare.mjs components` | exit 1：48/48 已对比，最低 86.83%，9/48 < 95%（明细见 §2.1） |
| `node tools/a11y.mjs components` | exit 0，ALL PASS（356 PASS / 0 FAIL；info 级 landmark-unique / heading-order 与 r3 相同） |
| `node tools/no-hardcode.mjs` | exit 0 |

< 95% 明细：desktop-{light,dark}-form-controls 92.58/92.52；mobile-{light,dark}-button 86.83/88.23；mobile-{light,dark}-form-controls 93.11/92.73；mobile-{light,dark}-data-display 94.74/94.28；mobile-light-layout 94.32。
