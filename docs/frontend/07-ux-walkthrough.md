# 07 · 体验官走查报告（orders + form 合入后全量走查）

> 角色：roles/legal-research/user-experience-officer（体验官）。
> 对象：`fe01/integration` @ `6f4fe2a50296086d5fae9b6d828a651b7ccdf53c`（`git fetch && git checkout fe01/integration && git merge --ff-only origin/main` → Already up to date，即集成分支已含 main）。
> 范围：本轮合入的 `orders`、`form` 全部核心任务 + 已上线屏 `login`、`dashboard` 回归。`components` / `landing` / `chat` 本轮明确未合入，**不在范围、不计缺失**。
> 方法：`pnpm install --frozen-lockfile && cd apps/reference && pnpm build && pnpm preview --port 4173`（vite preview，base `/apps/reference/`）；Playwright Chromium 1.62.1（复用 `tools/shoot` 锁定版本）以真实用户方式操作：**1440×900 鼠标**（真实坐标 click / hover）与 **375×812 触屏**（`isMobile + hasTouch`，DPR 2，`tap`）× **亮 / 暗**（`prefers-color-scheme`，不带 `?theme=`）= 4 组合。每个组合各跑一遍全部任务；仪表盘上另做一次手动切主题 + 刷新。
> 证据：脚本与日志在仓库外 `~/ux/`（`walk.mjs` 全量走查 → `walk-<combo>.log`；`mprobe.mjs` / `mprobe2.mjs` 375 卡片 / 筛选 Sheet / 分页 / 导航抽屉 → `mprobe*.log`；`probe*.mjs`、`form*.mjs`、`orders.mjs`、`q.mjs` 定向复核）。截图输出到 `shots/ux/<name>-<viewport>-<theme>.png`（**不入库**）。下文「截图」均指该目录。
> 事实分级：✅ 实测通过 · ❌ 实测缺陷 · ⚠️ 未定论 · 「推断」= 读源码得出、未实测。**不改产品代码。**

## 0. 结论

**verdict = fix**（P0 = 0，P1 = 3）。4 组合 console error 均为 0，375 全程 `scrollWidth = 375`，暗色无白块；核心任务（登录、看仪表盘、筛选/排序/批量/详情/取消/删除/撤销订单、三步建采购单并提交）在**直接输入 URL 的前提下**全部可完成，因此无 P0。但存在 3 处明显误导：合入的两屏在应用内**无入口**（侧栏/仪表盘仍说「后续轮次提供」）；订单行菜单里「查看详情 / 取消订单 / 删除订单」点了**静默无反应**；采购单第 3 步一进入就**报错并自动滚到底**。

| 级别 | 数量 | 摘要 |
| --- | --- | --- |
| P0 | 0 | — |
| P1 | 3 | P1-1 orders/form 应用内不可达且提示误导；P1-2 订单行菜单「查看详情/取消订单/删除订单」静默无效；P1-3 form 第 3 步进入即报「还有 1 项需要修正」并自动滚到条款处 |
| P2 | 7 | 自定义日期范围文案泄漏内部术语；样本外分页无可见 Tooltip；每页 50 时「下一页」可点无效；附件类型/大小/数量无校验反馈；仪表盘最近订单菜单「查看详情」仍 stub；条款 Dialog 关闭 / 取消订单 Toast 后焦点丢到 body；「再建一张」仍是同一张草稿 |
| P3 | 5 | 见 §6 |

上一版报告（@aa1a164）的 P2-A「第三方登录静默」与 P2-B「错误 Alert 修改邮箱不清除」**本轮实测已修复**（4 组合：Google/GitHub/微信点击出 Toast「使用 Google 继续 / 后续轮次提供」；修改邮箱后 Alert 清除）。P3「后退回 login 邮箱/记住我不保留」仍复现（见 P3-4）。

## 1. P1（明显粗糙或误导）

### P1-1 已合入的 /orders 与 /form 在应用内没有任何入口，且现有入口都说「后续轮次提供」
- 现象（4 组合一致）：侧栏「订单 63」`aria-disabled=true`、`cursor: not-allowed`，1440 hover Tooltip「后续轮次提供」，点击不跳转；375 导航抽屉里同样禁用，tap 只出 Tooltip「后续轮次提供」（截图 `dashboard-nav-orders-*`、`dashboard-mobile-nav-orders-tap-mobile-*`）。仪表盘「最近订单 → 查看全部」`<a href="/orders" aria-disabled="true">`，点击被 `preventDefault`，hover **无 Tooltip**（什么都不发生，截图 `dashboard-nav-orders-*`）。侧栏「采购」同样禁用；/form 无任何入口。
- 但 `/orders`、`/form` 直接输 URL 均可正常使用，且 /orders 页面里侧栏「订单」高亮为 `aria-current=page` 却仍 `aria-disabled=true`（截图 `orders-default-*`）。
- 影响：真实用户从仪表盘出发**找不到**本轮交付的两个屏幕；「后续轮次提供」对已存在的页面是错误信息。00-brief §导航契约要求实现阶段把已实现项翻为 `implemented: true`；`mock/nav.json` 中 `orders.implemented` 仍为 `false`（推断根因，读 mock 得出）。
- 建议：nav.json 翻 `orders` / `采购`（或 form 所属项）为 implemented；仪表盘 `ViewAll` 改为真实 Link；行菜单「查看详情」跳 `/orders?open=drawer&order=<id>`。

### P1-2 订单行「更多操作」菜单里「查看详情 / 取消订单 / 删除订单」点击后菜单关闭、什么都不发生
- 现象（4 组合，真实坐标 click / tap）：SO-20260906-0107（待付款）菜单 → 「取消订单」：菜单关闭、焦点回「更多操作」，**无 AlertDialog、无 Toast、URL 回到 `/orders`**；「查看详情」同样无抽屉；SO-20260906-0077（已取消）→「删除订单」同样无对话框。「复制订单号」出 Toast「已复制」、「标记发货」正常（说明不是菜单整体失效）。截图 `orders-rowmenu-open-*`、`orders-rowmenu-cancel-result-*`、`orders-menu-cancel-noop-*`。
- 对照：同一订单从**抽屉底部**「取消订单」能正常打开对话框并完成取消；`?open=dialog-cancel&order=…` 深链也正常（§3）。所以取消/删除/详情功能本身存在，只是从行菜单进不去。
- 推断根因（读 `pages/orders/index.tsx`，未改代码验证）：菜单项 `onSelect → doAction → set({open:"dialog-cancel"})` 之后，Radix 菜单关闭触发 `onOpenChange(false) → set({open:null, order:null})` 把刚写入的 overlay 状态覆盖掉；「复制/发货」不写 `open` 所以不受影响。
- 影响：行内三个最常用的深操作全部失效，用户会反复点、怀疑「是不是我没点到」。

### P1-3 采购单第 3 步一进入就出现「还有 1 项需要修正 · 请先阅读并同意《采购条款》」并自动滚到页尾
- 现象（4 组合，1440 与 375 一致；无论从第 2 步点「下一步」进入还是直接 `/form?step=2` 再「下一步」）：进入第 3 步瞬间顶部出现红色 Alert「还有 1 项需要修正 / 查看」，条款复选框下方出现「请先阅读并同意《采购条款》」，焦点被放到 `#terms`，页面 `scrollY` 直接跳到 661（1440）/ 1000（375）——用户**没看到「请核对采购单」的核对内容就被带到底部**并被告知「有错」（截图 `form-step3-entry-*`、`form-step3-full-*`）。深链 `/form?step=3` 直达时则**没有**该 Alert，两种进入方式行为不一致。
- 推断根因：`advance()` 对目标步 `validate(model, 3)` 把 `terms` 标 touched 并 `focusFirstError`。
- 影响：把「尚未做」当「做错了」提示，第 3 步的核对区被跳过；与 brief「全字段内联校验」（用户操作后再报错）不符。

## 2. 登录 /login 回归（4 组合一致）
- ✅ 首焦点邮箱、主题跟随系统、375 无横向溢出；空提交 →「请输入邮箱」「请输入密码」，焦点回邮箱；密码显隐 `aria-pressed` 正确；「30 天内记住我」整行可点。
- ✅ 错误账号：按钮「登录中…」禁用 → Alert「邮箱或密码不正确。连续 5 次失败后账号将锁定 15 分钟。」获焦（截图 `login-error-*`）；**修改邮箱后 Alert 立即清除**（上一版 P2-B 已修）。
- ✅ 第三方按钮点击 → Toast「使用 Google 继续 / 后续轮次提供」（上一版 P2-A 已修）。
- ✅ 正确账号（`ruolin.shen@qimu-home.cn` + 任意 ≥8 位）→ `/?toast=login`，h1「仪表盘」，Toast「欢迎回来，若琳」（截图 `login-success-dashboard-desktop-dark`；亮色组合脚本误用了错误邮箱，成功路径只在暗色 1440 实测，亮色按 mock 规则推断一致）。
- ❌ P3-4 后退回 /login：邮箱为空、「记住我」未勾选。

## 3. 仪表盘 / 回归（4 组合一致）
- ✅ 4 张指标卡（¥1,186,420 …）、图表渲染；切「日」→ `?period=day`，卡片变 ¥42,380；375 无溢出。
- ✅ 顶栏主题按钮 aria-label「切换为暗色 / 亮色」，切换后 `<html data-theme>` 与背景色同步变化，**刷新后保持**（截图 `dashboard-theme-toggled-*`）。
- ✅ 通知铃铛 → 弹层「通知 / 全部标为已读」+ 5 条真实业务通知（截图 `dashboard-notifications-*`）。
- ❌ P1-1（侧栏「订单」、「查看全部」禁用），见 §1。
- ❌ P2-5 最近订单行菜单「查看详情」→ Toast「查看详情 / 后续轮次提供」（1440）；订单屏已合入，该 stub 过期。
- ❌ P3-1 顶栏全局搜索输入「SO-2026」回车：URL 不变、无 Toast、无结果面板（1440）。
- 375：汉堡「打开导航」→ 导航抽屉 8 项，仅「仪表盘」可用（截图 `dashboard-mobile-nav-mobile-*`）。

## 4. 订单 /orders（1440 亮/暗 + 375 亮/暗触屏）

工具栏与列表（1440）：
- ✅ 搜索「周雅婷」→ 「筛选出 15 单，共 731 单」+ 样本 1 行；无结果 → 「筛选出 0 单」+ 空态「没有符合条件的订单 / 试试放宽筛选条件或更换关键词 / 清除筛选」，清除后回 731（截图 `orders-search-empty-*`）。
- ✅ 状态「待发货」→ 63 单；渠道多选 +天猫 → 23 单、触发器变「渠道 · 1」；日期 Popover 三预设带计数，「今天」→ 4 单；「清除筛选」复位全部（截图 `orders-filters-3-*`）。
- ✅ 金额排序 desc → asc → none 三态，`aria-sort` 正确；列显示隐藏「买家」+「恢复默认」。
- ✅ 选 2 单 → 「已选 2 单 / 批量发货 / 导出所选 / 取消选择」，表头复选 `mixed`；批量发货 → Toast「订单 SO-…-0108 已标记发货」（截图 `orders-bulk-bar-*`）；「导出」→ Toast「正在导出 731 单，完成后发送到 ruolin.shen@qimu-home.cn」。
- ❌ P2-1 日期 Popover / 375 Sheet 里「开始日期 – 结束日期」按钮 `cursor: default`、无禁用态，点击 → Toast「**自定义日期范围将在实现阶段提供**」——对最终用户泄漏内部流程术语，且现在就是实现阶段，读起来像已过期（截图 `orders-date-range-click-desktop-light`、`orders-filter-range-mobile-*`）。

抽屉（4 组合）：
- ✅ 点行 / 375 tap 卡片 → 右侧 480px 抽屉（375 底部 Sheet 占 715px，带拖柄）`?open=drawer&order=…`，焦点进抽屉；商品 / 物流 / 备注 Tab；「物流」待发货显示「尚未发货，暂无物流信息」，发货后「物流信息同步中」；「备注」空态「还没有备注」，空文本时「添加备注」禁用，输入后添加 → Toast「已添加备注」、列表出现「沈若琳 09-06 17:30 …」、输入框清空；底部「标记发货 / 标记加急 / 取消订单」375 下固定可见（截图 `orders-drawer-goods-*`、`orders-drawer-mobile-mobile-*`、`orders-drawer-remark-added-*`）。
- ✅ 抽屉「标记发货」→ Toast + 抽屉内状态即时变「已发货」；Esc 关闭后焦点回到对应行（1440）；深链 `?open=drawer&order=SO-…-0095&tab=logistics` 直接打开并选中「物流」，「复制」单号 → Toast「已复制」（截图 `orders-drawer-deeplink-*`）。
- ⚠️ 375 关闭抽屉后焦点落在 `body`（1440 回行）——触屏无键盘影响小，不计缺陷。

对话框 / Toast（4 组合）：
- ✅ 取消订单 Dialog：未选原因点「确认取消」→ 下拉 `aria-invalid` 红边、焦点留在下拉；选原因后 → Toast「订单 SO-…-0107 已取消」、行状态变「已取消」、1440 焦点回该行（截图 `orders-dialog-cancel-*`、`orders-dialog-cancel-invalid-*`、`orders-after-cancel-*`）。
- ✅ 删除订单 Dialog：文案「删除后订单将从列表与报表中移除，不可恢复。仅已取消订单可删除。」默认焦点「返回」；删除 → 行消失 + Toast「订单 SO-…-0077 已删除 / 撤销」；点「撤销」→ 行回来（截图 `orders-toast-deleted-*`、`orders-after-undo-*`）。
- ❌ P1-2 行菜单入口失效（§1）。
- ❌ P2-6 取消/删除确认后焦点落到 `body`（375 两组合；1440 删除后同样落 body，取消后回行）。

分页（4 组合）：
- ✅ 「第 1–20 条，共 731 条」、每页 10/20/50、页码 1 2 3 4 … 37；第 2 页 → `?page=2` 数据换页并滚到表头；第 4 页与第 37 页 `aria-disabled`、`cursor: not-allowed`、aria-label「第 4 页，演示样本只包含前 3 页」（读屏可知）；375 只显示范围 + 上一页/下一页 40×40，下一页 → `?page=2` 正常（截图 `orders-pagination-*`、`orders-mobile-pagination-mobile-*`）。
- ❌ P2-2 样本外页码 hover / focus / 点击均**无可见 Tooltip、无 Toast**（1440 两主题实测 `[role=tooltip]` 为空），明眼用户只看到「灰掉点不动」不知为何；brief 要求 Tooltip `orders.pagination.sampleOnly`（截图 `orders-p4-hover-*`、`orders-p4-tap-*`）。
- ❌ P2-3 每页 50 → 「1 2 … 15」，「下一页」未禁用，点击后 URL/范围不变。

375 卡片化：
- ✅ 卡片 = 复选（16px 视觉、伪元素热区 40×40，`elementFromPoint` 五点实测均命中）+ 主体按钮 245×108（aria-label「订单 SO-…，待发货，¥4,276.00，查看详情」）+ 更多 40×40；选 1 单出现批量条（截图 `orders-mobile-bulk-mobile-light`）。
- ✅ 「筛选」→ 全屏 Sheet「筛选订单」：状态单选（带计数）/ 日期单选 / 渠道多选，底部「清除筛选 / 查看 N 单」随选择实时变 63 → 9 → 4；应用后 Sheet 关闭、按钮变「筛选 · 3」、列表 4 张卡（截图 `orders-filter-sheet-filled-mobile-*`、`orders-filtered-mobile-mobile-*`）。
- ⚠️ 375 无排序、无全选入口（brief 未要求，仅记录）。

状态（4 组合，`?state=`）：
- ✅ loading「正在加载订单」骨架；empty-filtered 保留筛选条 + 「筛选出 0 单，共 108 单」+ 清除筛选；empty-new「还没有订单 / 接入销售渠道后，订单会每 15 分钟自动同步到这里 / 接入渠道（aria-disabled + Tooltip 后续轮次提供）」；error「订单加载失败 / 网络连接异常，请检查网络后重试 / 重试」→ 点重试进 loading（`aria-busy`）→ success 出数据（截图 `orders-state-*`）。
- ✅ 「新建订单」`aria-disabled` + Tooltip「后续轮次提供」（与 brief 一致，不计）。

## 5. 新建采购单 /form（1440 亮/暗 + 375 亮/暗触屏）
- ✅ 三步 Stepper「基本信息 / 商品与配送 / 确认提交」+「第 N 步，共 3 步」；右侧（375 顶部）摘要卡 PO-20260906-003 · 商品合计 ¥40,760.00 · 运费预算 ¥400–¥800 · 预计总额 ¥41,560.00（截图 `form-step1-*`）。
- ✅ 第 1 步清空联系人点「下一步」→ 顶部 Alert「还有 1 项需要修正 / 查看」+ 字段「请填写联系人」，焦点回该字段，停在第 1 步；备注 205 字失焦 →「备注不超过 200 字」（截图 `form-step1-invalid-*`、`form-remark-overflow-*`）。
- ✅ 第 2 步商品行数量 60→61 → 小计与「预计总额」即时复算 ¥42,040.00；删除行按钮 40×40；SKU Combobox 可搜；日期 Picker 弹出（1440 320px / 375 298px 居中），选早于常规交期出黄色提示「早于供应商常规交期（18 天），请确认已与供应商沟通」（非阻塞，合理）；运费区间双滑块拇指 24px；标签 Chip 可增删（截图 `form-step2-*`、`form-date-open-*`）。
- ✅ 第 3 步：核对卡 4 块各带「修改」；条款链接 → Dialog「采购条款」→「我知道了」关闭；勾选后 Alert 消失、「提交采购单」可点 → 「提交中…」`aria-busy` → 成功 Result「采购单已提交 / PO-20260906-003 已发送给 东阳樟里木艺（吴丽华），预计 2026-09-24 上午到达杭州仓 / 已发送至 sales@zhangli-wood.cn / 查看采购单 · 再建一张」，焦点在「查看采购单」（截图 `form-terms-dialog-*`、`form-loading-*`、`form-success-*`）。
- ✅ `?fail=1` 提交 → Alert「提交失败：网络超时，采购单已保存为草稿，请重试 / 重新提交」，焦点到「重新提交」（截图 `form-error-*`）。
- ✅ 有改动离开（点侧栏「仪表盘」）→ AlertDialog「离开页面？ 采购单尚未提交，离开后填写内容将丢失 / 继续填写 · 放弃并离开」→ 放弃后到 `/`（截图 `form-leave-dialog-*`）。
- ✅ 「保存草稿」→ Toast「草稿已保存」。
- ❌ P1-3 第 3 步进入即报错（§1）。
- ❌ P2-4 附件：提示「支持 PDF / XLSX / JPG / PNG，单个不超过 10 MB，最多 5 个」，但拖入 `evil.exe` 与 11 MB `big.pdf` 均显示「已上传」，第 6 个文件被静默丢弃无提示（1440 亮实测，`form-files-*`）。原生 `accept` 只约束文件选择器，拖放绕过；源码 `addFiles` 无类型/大小校验、超量只 `slice` 不提示（推断）。mock 里预置的「整柜装箱视频.mp4 不支持的文件类型」说明设计上有该错误态，但真实操作触发不到。
- ❌ P2-7 「再建一张」回到第 1 步，但联系人等字段仍是刚提交的那张草稿（吴丽华…），标题仍「PO-20260906-003 将在提交后生成」——「新建」与「上一张」无法区分。
- ❌ P2-6 条款 Dialog「我知道了」关闭后焦点落到 `body`（4 组合），键盘用户丢位。
- ❌ P3-2 成功页「查看采购单」→ Toast「后续轮次提供」（可接受，但主按钮做成 primary 显得可点）。
- ❌ P3-3 标签输入无上限/去重反馈：连续加到 10 个标签无任何提示（brief 未定上限，记 P3）。
- ⚠️ 375 全页截图里中段出现「跳到主内容」浮层与吸底操作条（`form-step3-full-mobile-light`）——为 fullPage 截图对 fixed 元素的绘制方式所致，视口内实操未见，不计缺陷。

## 6. P3 汇总
- P3-1 仪表盘顶栏全局搜索回车无任何反馈；且 /orders 页顶栏搜索框被隐藏，两页顶栏不一致。
- P3-2 form 成功页主按钮「查看采购单」仅 Toast「后续轮次提供」。
- P3-3 form 标签数量无上限提示。
- P3-4 登录成功后后退回 /login，邮箱与「记住我」不保留。
- P3-5 仪表盘最近订单行菜单（查看详情 / 标记发货 / 打印面单 / 取消订单）与订单页行菜单（查看详情 / 复制订单号 / 取消订单）项目不一致。

## 7. 未覆盖（untested，如实标注）
- 1440 亮色组合的登录**成功**路径（脚本误用邮箱，只在 1440 暗色实测成功；375 两组合同样只测了失败路径）。
- 键盘全程走查（Tab 顺序 / 焦点环）本轮未单独做，仅依赖 `a11y.mjs` 门禁结果（§8）。
- 768 / 1024 视口（任务只要求 1440 / 375）。
- 订单「标记加急」「打印面单」、抽屉内「修改地址」等次要动作；form「修改」按钮回跳到对应步的行为；`?state=invalid` 直达态；375 下 form 的日期 Picker 手指操作细节。
- 真实 iOS/Android 浏览器（本轮为 Chromium 触屏模拟）。

## 8. 门禁实跑结果（`apps/reference/`，`~/ux/gates.log`）
- `pnpm lint` ✅（eslint + no-hardcode：75 个文件通过）
- `pnpm typecheck` ✅
- `pnpm build` ✅（vite 构建成功，仅 chunk 体积 warning）
- `node tools/no-hardcode.mjs` ✅ 75 文件通过
- `node tools/shoot.mjs / compare.mjs / a11y.mjs`：
  - login：shoot 28 张；compare 28/28 最低 98.15% ≥ 95%；a11y ALL PASS
  - dashboard：shoot 58 张；compare 56/56 最低 98.41%；a11y ALL PASS
  - orders：shoot 86 张；compare 86/86 最低 96.36%；a11y ALL PASS
  - form：shoot 84 张；compare 84/84 最低 96.85%；a11y ALL PASS
- 说明：门禁全绿与本报告 P1 并不矛盾——门禁只覆盖像素相似度 / axe / 热区 / 焦点环 / console，不覆盖「入口是否可达」「点击后是否有结果」「进入步骤时是否误报错」这类行为，需体验走查补足。

本报告只新增/覆写本文件，未改任何产品代码、令牌、hifi、content、mock。
