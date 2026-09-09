# 06 实现阶段 notes（按稿实现 → 交回设计侧的问题）

> 阶段 5/6 产物。实现阶段不改 `design/hifi/*` 与令牌；实现方发现的设计稿问题在此记录，交回设计侧修正后重生成 `ref/*.png` 并复跑 `node tools/compare.mjs <screen>`。每条标明证据来源（浏览器实测 / 代码核对）。

## settings（分支 `fe01/screen-settings`，基线 a302bc0 → 84d6afc → 4b48e3e → 第三轮 tech-lead 升级修复）

### -1. 第三轮升级修复（4b48e3e 之后，合入 `origin/fe01/integration`，2026-09-08）

**先复现再修**：接手时阻塞清单引用的是 a302bc0 的数据（compare 最低 78.97%、a11y 14 FAIL、Combobox 固定 search 图标、CharCounter 格式）。在 4b48e3e 上实跑：`compare settings` 124/124 最低 **97.18%**（≥ 95%）、`a11y settings` **437 PASS / 0 FAIL**、`no-hardcode` 79 个文件通过——前两轮已把 compare / a11y 两个 blocking 修掉，本轮起点不是清单描述的状态；本轮处理的是仍为真的剩余项 + 与集成分支合并。

**合并 `origin/fe01/integration`**（`git merge --ff-only origin/main` → Already up to date；integration 已含 landing 屏）。冲突 3 处，解决方式：

- `components/composed/pricing-card.tsx`：取两侧并集。landing 侧 `description` / `badgeAlign="center"` / 默认 `gap-6`、header `gap-2`；settings 侧 `excludedIcon="x"`、`data-pricing-badge`、当前计划描边。默认节奏按 landing（landing 页面不传 className 覆盖），settings 用调用方 className 覆盖：`gap-4 p-5 [&_header]:gap-0 [&_header>p:first-of-type]:mt-4 [&>[data-pricing-badge]]:left-5 [&_ul_svg]:mt-[calc(var(--space-1)/2)]`。实测：第一次解冲突用 `[&_header]:gap-4` 让价格与副价之间多出 16px，settings billing 图掉到 88.36%（mobile 375×2644 vs 2692，3 张卡各 +16）；核对 hifi `.plan` 结构是 `h3` + `<div>(.price + .per)</div>`（价格与副价紧贴、与 h3 间距 space-4），改成上面的 `gap-0 + mt-4` 后 billing 恢复 99.2~99.9%，landing 20/20 最低 99.47% 不变。
- `lib/cn.ts`：保留两侧 tailwind-merge 扩展（`font-size` role-*、`w` / `min-h` / `pr` / `pl` 命名类组 + integration 侧的 `theme.spacing` 命名令牌）。
- `docs/frontend/06-impl-notes.md`（add/add）：沿用 integration 的总标题，settings 段在前、landing 段在后，两段内容均未删减。

**本轮修复（已实测）**

- 时区 Combobox 前导图标：共享 `Combobox` 新增可选 `leadingIcon?: React.ReactNode`（默认 `<SearchIcon />`，仅 `variant="input"` 用到），settings 时区传 `<GlobeIcon />`，与 hifi `.combo .lead` globe 一致。form 屏 supplier / SKU Combobox 不传即为原样（见下表回归）。profile 各图 +0.01~0.04%（`mobile-light-profile-default` 98.32% → 98.35%）。
- `security-empty` 12px 高度差（上轮 unfixed「未定位」）：根因是实现 `<EmptyInline className="mt-3">`，而 hifi `.empty-inline` 只有 `padding: var(--space-8) var(--space-4)`、无外边距；去掉 `mt-3` 后 docH mobile 1137/1137、desktop 1018/1018（此前 1149 / 1030），相似度 97.42~97.81% → **99.09~99.34%**。
- 合并后 `mock/settings.json` 2FA 提示文案「…扫描二维码，或手动输入密钥」保持不变（hifi 渲染文本第 956/1081 行即为「扫描二维码」，是 hifi 内联 JSON 落后于渲染文本，见 DESIGN 项）。

**门禁实跑（`apps/reference/`，合并 + 修复之后）**

| 命令 | 结果 |
|---|---|
| `pnpm lint` | exit 0（eslint 0 error；`no-hardcode: 79 个文件通过`） |
| `pnpm typecheck` | exit 0 |
| `pnpm build` | exit 0（Vite 主 chunk > 500 kB 提示同前） |
| `node tools/shoot.mjs settings` → `compare.mjs settings` | 124 张；**124/124 ≥ 95%，最低 97.18%**（`mobile-light-notifications-saving`，与上轮相同） |
| `node tools/a11y.mjs settings` | exit 0，**436 PASS / 0 FAIL / ALL PASS**（上轮 437 PASS；PASS 条目数是脚本按实际命中的检查项计数，未逐条追溯少的 1 条来自哪一项，FAIL 为 0 且 375 scrollWidth / 热区 / console error 全部 PASS） |
| `node tools/a11y.mjs form`（共享 Combobox 改动影响面） | exit 0，**324 PASS / 0 FAIL / ALL PASS** |
| `node design/hifi/settings/check.mjs`（设计侧自检，仅作证据） | 18 项 16 PASS / **2 FAIL**（内联数据 ≠ mock，见 DESIGN 项） |
| 回归 `shoot + compare`（含共享 Combobox / PricingCard / cn.ts 改动的影响面） | 全部 exit 0：login 28/28 最低 98.15%；dashboard 56/56 最低 98.41%；orders 86/86 最低 96.36%；form 84/84 最低 96.85%；chat 88/88 最低 95.99%；landing 20/20 最低 99.47%（与 integration 上 landing notes 一致）；kitchen-sink 44 张 shoot exit 0（无 ref，不做像素对比） |

**unfixed / 交回**

- `DESIGN:` hifi settings 内联 `<script id="data">` 与 `mock/*.json` 不一致，`node design/hifi/settings/check.mjs` 实跑 **2 FAIL**：「内联数据 settings 与 mock/settings.json 一致」「内联数据 nav 与 mock/nav.json 一致」。逐字段 diff：`settings.security.sessions[0..2].deviceType`（上轮按审查意见加进 mock，用于会话图标）与 `settings.note` 说明只在 mock；`settings.security.twoFactor.hint` hifi JSON 为「…验证器应用扫描，或手动输入密钥」而 hifi **渲染文本**（index.html 956/1081 行）与 mock 均为「…扫描二维码，或手动输入密钥」；`nav[1].items[0].implemented` / `nav[3].items[1].implemented` hifi=false、mock=true（settings 已上线）。实现阶段不改稿，需设计侧把内联 JSON 重新同步到 mock（其余 user / team / notifications 内联数据 0 diff，其余 16 项 check PASS）。
- 共享 Input / Textarea / Select / Combobox 边框 `border-border-strong` vs hifi hairline：维持前两轮结论（login/form 已按 strong 上线，不在 settings 页面层覆盖），交组件 / 令牌层统一。
- 保存成功 Toast 图标 hifi circle-check vs 共享 Toast check：`*-saved` 97.4~97.5% 已过线，沿用已上线 shell。
- 审查清单中的「CharCounter 34/160 vs 稿 34 / 160」：4b48e3e 上 settings 已用 `CharCounter` 的 children 覆盖渲染 `{len} / {max}`（与 hifi `' / '` 同格式，共享组件默认 `${value}/${max}` 未改），`mobile-*-profile-*` 98.3%+，不再是差异项。
- 共享壳影响面说明：`AppShell` 账号菜单「个人资料 / 账号安全」在 main 上是 `notYet` toast，本分支起改为跳转 `/settings?tab=profile|security`（settings 已实现，`nav.json implemented=true`）；login/dashboard/orders/form/chat/landing 的截图矩阵不含该菜单打开态，视觉回归不受影响，行为变化在此记录。

### 0. 第二轮审查修复（84d6afc 之后，2026-09-08）

独立审查清单：1 blocking + 5 minor。门禁实跑（`apps/reference/`）：

| 命令 | 结果 |
|---|---|
| `pnpm lint` / `pnpm typecheck` / `pnpm build` | 均 exit 0（no-hardcode 78 个文件通过；Vite 主 chunk > 500 kB 提示同前） |
| `node tools/shoot.mjs settings` → `compare.mjs settings` | shoot 124 张 exit 0；**compare exit 0，124/124 ≥ 95%，最低 97.18%**（`mobile-light-notifications-saving`）；`mobile-light-profile-account` 94.69% → **98.83%** |
| `node tools/a11y.mjs settings` | exit 0，**437 PASS / 0 FAIL / ALL PASS** |
| `node tools/no-hardcode.mjs` | exit 0（78 个文件通过） |
| 回归 `shoot + compare` login / dashboard / orders / form | 全部 exit 0：login 28/28 最低 98.15%；dashboard 56/56 最低 98.41%；orders 86/86 最低 96.36%；form 84/84 最低 96.85% |

**blocking（已修）**

- 共享壳账号菜单当前项高亮：`AppShell` 新增可选 `accountCurrent?: "profile" | "security"`，对应菜单项渲染 `aria-current="page"` 并跳转 `/settings?tab=profile|security`（当前项点击不导航，非当前项先过 `beforeLeave` 离开拦截，与 hifi `#acctPop [data-tab]` 行为一致）；`DropdownMenuItem` 增加 `aria-[current=page]:bg-primary-soft aria-[current=page]:text-on-primary-soft`（hifi `.menu-item[aria-current="page"]`）。不传 `accountCurrent` 的屏（login/dashboard/orders/form/chat）无 aria-current、样式不变——上表回归 compare 证明无回退。settings 的 `beforeLeave` 对 `/settings?tab=` 目标直接 `requestTab`（走脏表单确认），不再弹「离开页面」。

**minor（已修）**

- 免打扰 `<input type=time>` 12/24 小时制：Chromium 的原生 time 输入只跟随浏览器**进程** LANG（context `locale: zh-CN`、`--lang=zh-CN`、`LC_TIME` 实测均无效，只有 `LANG`/`LC_ALL` 生效）。`_shared.mjs launch({ lang })` 支持把 lang 写入进程 env；shots.json 条目可声明 `"lang": "zh_CN.UTF-8"`，shoot.mjs 按 lang 分组各起一个浏览器。settings 6 条 notifications-* 条目已声明，截图渲染 `22:00 / 08:00`。**没有做成全局默认**：实测全局 LANG=zh_CN 会让 dashboard `?open=order-menu` 的 tablet/tabletSm/desktop 图跌到 94.69%——进程区域改变了 webfont 就绪前的回退字体度量，dashboard 首帧 `scrollIntoView` 的横向滚动量从 35px 变成 0，而其 ref（无 LANG 基准）编码的是 35px；改成按条目声明后 dashboard 回到 98.41%。
- notifications 提交中态：`<fieldset disabled>` 改为 `inert`（仅阻断指针/键盘/焦点，不触发 `:disabled` 的 disabled-look），Switch / Segmented / 「全部开启/关闭」保持原色，与 hifi `form[aria-busy] .form-grid{pointer-events:none}` 一致；免打扰时间框只按 `quiet.enabled` 决定 disabled。`*-notifications-saving` 95.87%/96.03% → 97.18%/97.30%（mobile）、99.34%/99.36%（desktop）。
- 2FA Dialog 说明换行 / 二维码偏小：根因是 `DIALOG_HEAD = "gap-4 pr-0"` 里的 `pr-0` 没能覆盖 `DialogHeader` 默认的 `pr-hit`（tailwind-merge 不认识命名间距 `pr-hit`，两者并存且 `pr-hit` 胜出），标题/描述区被压窄 40px。`src/lib/cn.ts` 追加 `pr` / `pl` 类组识别（与已有 `w` / `min-h` 同法，仅影响同组类合并去重），说明文字恢复单行、QR 按 `size-sparkline*5` 排满。`desktop-*-security-2fa` 96.95%/97.14% → 99.61%/99.89%。
- 会话图标：`mock/settings.json` `sessions[]` 新增 `deviceType: "mobile" | "laptop" | "desktop"`（mock note 已注明），`index.tsx` 改为 `SESSION_ICONS[deviceType]`（smartphone / laptop / monitor，兜底 monitor），删除 `device.includes("移动")` 文案匹配。

**minor（unfixed）**

- 共享 Input / Textarea / Select / Combobox 边框 `border-border-strong` vs hifi hairline：审查结论与上一轮一致——属共享组件 / 令牌层分歧（login/form 已按 strong 上线），不在 settings 页面层覆盖，交设计与组件层统一（见 §5）。

### 1. 门禁实跑（第一轮，`apps/reference/`，2026-09-08）

| 命令 | 结果 |
|---|---|
| `pnpm lint` | exit 0（eslint 0 error；`no-hardcode: 78 个文件通过`） |
| `pnpm typecheck` | exit 0 |
| `pnpm build` | exit 0；Vite 仍提示主 chunk > 500 kB（与 07-qa-audit QA-20 一致，未处理，见 §4） |
| `node tools/shoot.mjs settings` | exit 0，124 张 |
| `node tools/compare.mjs settings` | **exit 1**：124/124 对比，**123 张 ≥ 95%**，最低 `mobile-light-profile-account` **94.69%**（基线 a302bc0 为 124 张全部低于阈值、最低 78.97%）；次低 `mobile-light-notifications-saving` 95.87%、`desktop-light-security-2fa` 96.95% |
| `node tools/a11y.mjs settings` | exit 0，**436 PASS / 0 FAIL / ALL PASS**（基线 14 FAIL：`SPAN[data-radix-focus-guard]` 焦点环缺失）；console error = 0，375 scrollWidth ≤ 375，热区不足 0 处 |
| `node tools/no-hardcode.mjs` | exit 0（78 个文件通过） |

仓库根：`pnpm lint` exit 0（turbo 23/23）、`pnpm typecheck` exit 0（25/25）；`pnpm build` 两次实跑均未全绿——`reference:build ✓ built in 5.63s`，但并行的 `tdesign-react#build` 被本机 OOM 杀掉（`Killed`，exit 137，11/24 任务完成后 turbo 中止），该包本次未改动；单独 `pnpm --filter tdesign-react build` exit 0（✓ built）。判定为本机内存限制而非代码回退，需在内存更充裕的机器上复跑根 build 确认。

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
| ~~`mobile-light-profile-account` 94.69%~~ | **第二轮已修**（§0，98.83%）：`AppShell accountCurrent` + `DropdownMenuItem aria-current` 高亮 | — |
| 共享 Input/Textarea/Select/Combobox 边框 `border-border-strong` vs hifi `.input` hairline `--color-role-border` | 各视口 profile/security/team/notifications 输入框边框均比稿深 | 共享件与 settings 稿分歧，login/form 已按 strong 上线，不在本屏自改；交设计侧统一 |
| 保存成功 toast 图标：hifi circle-check，实现共享 Toast 裸 check | `*-saved` 图 97.4~97.5% 已过线 | 沿用已上线 shell，记录不改 |
| `security-empty` 页面高 hifi 1137 / impl 1149（mobile）、1018 / 1030（desktop） | 97.4~97.8% 已过线，12px 差异未定位 | 时间盒内未处理 |
| `pnpm build` 主 chunk > 500 kB | 与 QA-20 相同 | 非本阶段硬指标，未调 `chunkSizeWarningLimit`，不改构建策略 |

### 5. 交回设计侧

- Input 系列边框强度（strong vs hairline）需在 tokens / 04-components 层面统一。
- Toast 图标是否统一为 circle-check（影响已上线屏）。
- settings hifi 账号菜单带 aria-current 高亮与 `?tab=` 跳转：第二轮已按 opt-in 实现（`AppShell accountCurrent`），其它屏不传即无高亮；若要全局采用（如在 dashboard 也把「个人资料 / 账号安全」跳到 settings），需各屏 hifi 同步。
- dashboard `?open=order-menu` ref 编码了 webfont 就绪前回退字体下的 35px 横向滚动量（首帧 `scrollIntoView` 竞态），因此 shoot 工具不能全局设 LANG；建议下一轮 dashboard 稿/实现改为 `document.fonts.ready` 后再滚动并重截 ref。

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
- 同步 `origin/fe01/integration@1afe7d5`（chat 已合入）：仅 `src/lib/cn.ts` 冲突，取两侧并集（landing 侧 spacing 命名刻度 + chat 侧 w 命名宽度组）。合并后复跑：`pnpm lint`（no-hardcode 78 文件）/ `typecheck` / `build` ✔；landing compare 20/20，最低 99.47%（menu-open 三张 99.47–99.51%：integration 侧 `shoot.mjs` 对 overlay 条目截图前 blur 焦点，关闭钮焦点环不再入图，hifi ref 仍带环，差 ≈0.08%，非实现差）；landing a11y ALL PASS；焦点矩阵 12/12 PASS；chat compare 88/88 ≥ 95%（最低 95.99%），cn.ts 并集未造成回退
- 仓库根：`pnpm lint` 23/23 ✔ · `pnpm typecheck` 25/25 ✔ · `pnpm exec turbo run build --concurrency=1` 24/24 ✔（默认并发在 8 GB / 2 核机器上 `tdesign-react:build` 被 OOM kill（exit 137），与本轮改动无关，串行后全过）

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
