# 06 · 实现 notes（impl 阶段）

> 每屏一节：门禁实跑结果（只写本机实际输出）、对稿修复清单、未修项及原因、交回设计侧的问题。

## settings（分支 `fe01/screen-settings`，基线 a302bc0 → 本次修复）

### 1. 门禁实跑（`apps/reference/`，2026-09-08）

| 命令 | 结果 |
|---|---|
| `pnpm lint` | exit 0（eslint 0 error；`no-hardcode: 78 个文件通过`） |
| `pnpm typecheck` | exit 0 |
| `pnpm build` | exit 0；Vite 仍提示主 chunk > 500 kB（与 07-qa-audit QA-20 一致，未处理，见 §4） |
| `node tools/shoot.mjs settings` | exit 0，124 张 |
| `node tools/compare.mjs settings` | **exit 1**：124/124 对比，**123 张 ≥ 95%**，最低 `mobile-light-profile-account` **94.69%**（基线 a302bc0 为 124 张全部低于阈值、最低 78.97%）；次低 `mobile-light-notifications-saving` 95.87%、`desktop-light-security-2fa` 96.95% |
| `node tools/a11y.mjs settings` | exit 0，**436 PASS / 0 FAIL / ALL PASS**（基线 14 FAIL：`SPAN[data-radix-focus-guard]` 焦点环缺失）；console error = 0，375 scrollWidth ≤ 375，热区不足 0 处 |
| `node tools/no-hardcode.mjs` | exit 0（78 个文件通过） |

仓库根：`pnpm lint` exit 0（turbo 23/23）、`pnpm typecheck` exit 0（25/25）、`pnpm build` 见提交信息（写 notes 时仍在跑，结果以提交信息为准）。

### 2. blocking 项处理

1. **截图策略（shoot.mjs）**：`tools/shoot.mjs` 之前对非 overlay 图用 `fullPage`，而 `design/hifi/settings/check.mjs` 是「viewport 高度撑到 `document.documentElement.scrollHeight` → 普通截图 → 恢复」；sticky SaveBar 因此落点不同，页面高普遍差 20~96px。现在 `shots.json` 条目可加 `"stretch": true`，shoot.mjs 对其采用与 check.mjs 相同的撑高策略（settings 17 条非 overlay 条目已全部标记）；其它屏未标记，行为不变。
2. **a11y 焦点链路（combobox.tsx）**：`Combobox` 增加 `contentRef`，输入框 `onBlur` 仅当焦点既不在 anchor 也不在浮层内容时关闭浮层；`<ul role=listbox>` 加 `tabIndex={-1}`，溢出滚动的列表不再进入 Tab 序列，Radix focus-guard 不再成为 Tab 落点。form 屏 supplier / SKU Combobox 走同一代码路径（未溢出），a11y 逻辑不变；本轮只实跑了 settings 的 a11y（436 PASS），form 屏未重跑。
3. **compare 过线**：从 124 张全挂修到 123/124（见 §3 修复清单）；剩余 1 张见 §4。

### 3. 对稿修复清单（已实测生效）

- 通知渠道分段：`Segmented` 新增 `variant="soft"`（surface-muted 容器 + 选中项 surface/shadow-sm/radius-sm），默认 `outline` 不变；settings 用 soft。
- Switch：`size="sm"`（36×20、thumb 16，全部由 `--size-icon-*`/`--space-*` 推导）；默认 `md` 不变；settings 全部开关用 sm。
- 通知矩阵 / 团队成员表 / 发票表：表头 `h-table-header`、行 `h-table-row`、单元格 `py-1`/`py-2` 对齐 hifi `td` 内距；成员头像 `Avatar size="sm"`、「你」标签改 neutral plain；发票编号改 body 号等宽、下载按钮去掉 `-my-2`；tablet 下发票单元格允许折行（hifi `.itable td{white-space:normal}`）。实测 docH：desktop team 1115/1115、desktop billing 1442/1442、tablet billing 1466/1466、mobile team-empty 1271/1271（hifi/impl）。
- 页头：`PageHeader` 标题行加 `data-slot="page-header-title"`，settings 局部 `min-h-0` 去掉 375 下多出的 16px；为让局部 `min-h-0` 能覆盖共享 `min-h-hit`，`src/lib/cn.ts` 的 tailwind-merge 配置扩展了 `w`/`min-h`/`font-size` 类组识别（仅影响同组类的合并去重，不改类语义）。
- 两步验证 Dialog：不再传 `closeLabel`（无右上角 ✕，与 hifi 一致）；描述改为 mock `security.twoFactor.hint`「…扫描二维码，或手动输入密钥」；QR 容器 160（`size-sparkline*5`），`QrFigure` 改为 hifi 同款 25×25 定位/定时图案 + xorshift 伪随机；手动密钥改 `text-role-code text-sm`。实测 mobile 2fa docH 1323/1323。
- Dialog/AlertDialog（settings 内 5 处）：标题与描述间距 `gap-4 pr-0`（hifi `.dialog` gap space-4、无 ✕ 预留），去掉之前错误的 `rounded-lg border-0`（hifi 为 radius-xl + hairline 边框，≤768 radius-lg）。实测 team-danger / profile-leave / 2fa 三个弹层文字坐标全部对齐。
- SaveBar：提交中 / 有改动两种提示都用 `InfoIcon`（hifi `.savebar .msg`），新增文案 key `settings.actions.savingMsg`（content/settings.md）；重置按钮禁用态改 `disabled-look` + surface 底。
- 团队：邀请表单改 `mb-5` 承担卡内间距（去掉外层 gap 的 20px 重复）；待处理邀请操作按钮 `-mr-3`（hifi 幽灵按钮负边距）。
- 个人资料错误 Alert：正文 gap-1、操作区垂直居中、重试按钮带 RefreshCw 图标。
- 计费：`PricingCard` 重写为 hifi `.plan` 结构（推荐角标、`excludedIcon="x"`、当前计划描边）；当前计划摘要与发票移动卡片重排。

### 4. 未修项（unfixed）与原因

| 项 | 实测 | 原因 / 建议 |
|---|---|---|
| `mobile-light-profile-account` 94.69%（compare 唯一未过线） | 差异集中在账号菜单「个人资料」项：hifi `.menu-item[aria-current="page"]` 为 primary-soft 高亮，实现的账号菜单来自已上线 shell（`pages/dashboard/shell.tsx`），菜单项无 aria-current，且个人资料/账号安全项目前为 notYet 而非跳转 `?tab=`；其余差异为共享 Input 边框深浅（见下） | 需给 `AppShell` 增加向后兼容的 `account={{ current }}` 之类 props 并让两项跳到 settings tab；涉及已上线壳层，时间盒内未做，交下一轮。同图 dark 版 98.75% 已过线 |
| 共享 Input/Textarea/Select/Combobox 边框 `border-border-strong` vs hifi `.input` hairline `--color-role-border` | 各视口 profile/security/team/notifications 输入框边框均比稿深 | 共享件与 settings 稿分歧，login/form 已按 strong 上线，不在本屏自改；交设计侧统一 |
| 保存成功 toast 图标：hifi circle-check，实现共享 Toast 裸 check | `*-saved` 图 97.4~97.5% 已过线 | 沿用已上线 shell，记录不改 |
| `security-empty` 页面高 hifi 1137 / impl 1149（mobile）、1018 / 1030（desktop） | 97.4~97.8% 已过线，12px 差异未定位 | 时间盒内未处理 |
| `pnpm build` 主 chunk > 500 kB | 与 QA-20 相同 | 非本阶段硬指标，未调 `chunkSizeWarningLimit`，不改构建策略 |

### 5. 交回设计侧

- Input 系列边框强度（strong vs hairline）需在 tokens / 04-components 层面统一。
- Toast 图标是否统一为 circle-check（影响已上线屏）。
- settings hifi 账号菜单带 aria-current 高亮与 `?tab=` 跳转，而 dashboard/orders/form 稿的账号菜单无此行为，需明确是否全局采用。
