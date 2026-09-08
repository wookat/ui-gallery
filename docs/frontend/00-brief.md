# 00 Brief：Acme Console（UI Gallery 参考应用）

> 阶段 0 产物（frontend-0to1-ai 步骤 0）。写给后续所有 AI 会话看的唯一需求源；每一行都要能被审查员核对。禁止 lorem ipsum、随机数字、占位头像名。
> 老板原话逐条对照见 §9；本文对原话的解释与取舍见 §10（如无异议按此执行）。
> 文案唯一源：`content/*.md`；数据唯一源：`mock/*.json`；两者均在仓库根。

## 1. 一句话
中小家居/零售品牌的**运营人员与团队管理员**用 Acme Console 在桌面和手机上**看今天的生意、盯待发货与库存预警、处理退款**，替代在天猫/抖音/京东多个商家后台之间来回切换和手工汇总 Excel。

对 UI Gallery 而言：Acme Console 是「同一套页面、几十个组件库各做一遍」的**唯一视觉标准**——先按本 Brief 出信息架构 → 设计令牌 → 高保真定稿 → `apps/reference/` 按稿实现，之后各组件库只做「按稿还原」。

## 2. 目标用户与场景
| 用户 | 场景 | 设备（桌面/移动占比） | 一次使用时长 |
|---|---|---|---|
| 运营主管 / 团队管理员（示例：沈若琳，`mock/user.json`） | 早上到岗先看昨日与今日销售额、订单数、待发货、库存预警；决定当天补货与人力；管理团队成员 | 桌面 70% / 手机 30%（通勤、周末在家抬手看） | 桌面 5–15 分钟；手机 1–2 分钟 |
| 运营专员（蒋一鸣） | 盯大促 / 直播期间的实时销量与渠道占比；上架任务进度 | 桌面 80% / 手机 20% | 全天多次，每次 1–3 分钟 |
| 仓储主管（何嘉豪） | 看待发货数与库存预警，打印面单，跟进采购到货 | 桌面 50% / 手机 50%（仓内走动用手机） | 每次 2–5 分钟 |
| 客服主管（唐雨薇） | 看退款中订单与售后待处理数，从动态时间线定位同事操作 | 桌面 90% / 手机 10% | 每次 1–3 分钟 |
| 财务（郭文博，只读） | 月度对账后核对销售额趋势与渠道占比 | 桌面 100% | 每次 5–10 分钟 |

## 3. 核心任务（按频率排序，≤5 条）
1. **登录进入自己的团队空间**（每天 1 次；记住我 30 天后免登录）。
2. **看当前周期经营概况**：销售额 / 订单数 / 待发货 / 库存预警 4 个数字与「较上期」变化，并切换日 / 周 / 月。
3. **判断趋势与渠道结构**：销售额折线 + 订单数柱状、渠道占比环形图。
4. **处理最近订单**：从最近 5 单看状态，对待发货单「标记发货 / 打印面单」，对待付款单「取消订单」。
5. **感知团队在做什么**：团队动态时间线、任务进度、通知铃铛（退款申请 / 库存预警 / 同步结果）。

## 4. 屏幕清单（本轮 2 屏）
| id | 路由 | 目的（用户来这里做什么） | 关键信息（按优先级） | 必备状态 |
|---|---|---|---|---|
| login | `/login` | 用工作邮箱进入团队空间 | ① 邮箱 + 密码 + 登录按钮 ② 30 天内记住我 / 忘记密码 ③ Google / GitHub / 微信 第三方登录 ④ 免费注册入口 ⑤ 品牌标与一句话价值 | default（= 空表单，即本屏的 empty） / invalid（字段校验错误） / loading（提交中） / error（登录失败 Alert） / success（跳转 `/?toast=login` + Toast，由 dashboard 渲染） |
| dashboard | `/` | 打开即知今天生意如何、有什么要处理 | ① 4 张统计卡（数字 / 较上期 / 7 点迷你趋势） ② 日 / 周 / 月 Tabs ③ 销售趋势（折线 + 柱）与渠道占比（环形） ④ 最近订单 5 行（状态 Tag、操作菜单） ⑤ 团队动态时间线 ⑥ 任务进度列表 ⑦ 应用壳：侧边栏 4 组 8 项可折叠、顶栏面包屑 / 全局搜索 / 通知铃铛 Popover / 主题切换 / 头像菜单 5 项 | loading（骨架屏，与成功态同布局） / empty（新账号无数据） / error（加载失败 + 重试） / success |

### 4.1 login 细则
- 表单：邮箱（`type=email`，`autocomplete=username`）、密码（`autocomplete=current-password`，可见性切换按钮 ≥40px 热区）、「30 天内记住我」复选、「忘记密码？」链接（不可达）、主按钮「登录」。
- 校验时机：字段失焦或提交时校验；错误文案内联显示在字段下方并 `aria-describedby` 关联；规则与文案见 `content/login.md`「校验与反馈」。
- 提交：按钮进入 loading（禁用 + spinner + 「登录中…」），全表单只读；失败时表单顶部 Alert（error），聚焦到 Alert；成功跳 `/?toast=login`，由 dashboard 在 success 态上叠加 Toast「欢迎回来，若琳」（login 的 success 态截图即取该 URL）。
- 第三方登录：3 个次级按钮等宽；图标用 CC0 单色图标（如 simple-icons）或纯文字，**不得**使用官方彩色位图 Logo；点击本轮只做视觉，不接真实 OAuth。
- 布局：1440 为左右分栏（左品牌区 + 一句话价值，右表单卡 ≤ 400px）或居中卡；375 表单全宽、无横向滚动、键盘弹起时主按钮仍可达。阶段 1 定。
- 演示账号规则与 `?state=default|invalid|loading|error|success` 切换：`content/login.md` 末节、`mock/user.json.demoCredentials`；`success` 立即跳 `/?toast=login`。

### 4.2 dashboard 细则
- 应用壳
  - 侧边栏：品牌标 + 团队空间名「栖木家居」；导航 `mock/nav.json`（概览 1 / 交易 2 / 货品 3 / 经营 2 = 8 项，订单 / 售后 / 库存带数字角标）；可折叠为 icon rail（Tooltip 显示文案）；1440 默认展开，1024 默认折叠，≤768 为抽屉（顶栏汉堡按钮打开）。`implemented:false` 的项渲染为 `aria-disabled` + Tooltip「后续轮次提供」，不得 404。
  - 顶栏：面包屑「栖木家居 / 仪表盘」；全局搜索框（placeholder + `⌘K`，375 缩为图标按钮）；通知铃铛（未读角标 3，Popover 列 `mock/notifications.json` 5 条 + 「全部标为已读」+「查看全部通知」）；主题切换（亮 / 暗，持久化到 `localStorage`，同时响应 `?theme=`）；头像（姓名末字 + 色相，无图片）下拉 5 项。
- 概览内容（顺序即 375 下的纵向顺序）
  1. 问候 + 「数据更新于 今天 17:30」+ 日 / 周 / 月 Tabs（默认 月）。Tabs 切换同时驱动统计卡、趋势图、环形图（`mock/stats.json.byPeriod`、`mock/series.json`）。
  2. 4 张统计卡：销售额（¥1,186,420，较上期 +9.4%）、订单数（2,964 单，+5.1%）、待发货（63 单，−21，中性色）、库存预警（12 SKU，+4，红为差）。每卡：标签、主数字、较上期（带方向图标；语义色按 `mock/stats.json.cards[].deltaTone` / `invertDelta`）、7 点迷你趋势（sparkline，口径见 `mock/README.md`「统计卡口径」：末点 = 当前值，倒数第 2 点 = 上期）。1440 一行 4 卡，768 两行两卡，375 单列或 2×2。
  3. 图表行：销售趋势卡（折线 = 销售额，柱 = 订单数，双 Y 轴；月 30 点、周 7 点、日 18 点）占 2/3；渠道占比环形图（5 渠道，中心显示合计）占 1/3；375 上下堆叠。图表库允许 Recharts（已在仓库使用），配色只用令牌。
  4. 最近订单表：5 行，列 = 订单号 / 客户 / 商品 / 金额（右对齐） / 渠道 / 状态 Tag / 下单时间 / 操作（更多菜单：查看详情 / 标记发货 / 打印面单 / 取消订单，按状态禁用）；375 横向滚动（首列吸附）或卡片化，阶段 1 定。
  5. 团队动态时间线（6 条，头像 + 人名 + 动作 + 详情 + 相对时间）与任务进度列表（5 条，标题 + 负责人 + 进度条 + `done/total` + 截止日；`at_risk` 用 warning 色，`done` 用 success 色）；1440 左右并排，375 堆叠。
- 状态
  - loading：骨架屏形状与成功态同布局（卡、图表矩形、5 行表格、6 条时间线），容器 `aria-busy=true`；不出现 spinner 覆盖全屏。
  - empty：应用壳照常；内容区居中空态（标题 / 说明 / 主按钮「接入销售渠道」/ 次按钮「导入历史订单」），团队空间名「未命名团队」，铃铛无角标，侧边栏订单 / 售后 / 库存的数字角标亦不显示（`mock/nav.json.badge` 不读取）；不显示任何统计卡数字。
  - error：应用壳照常；内容区错误块（标题 / 含错误码 503 的说明 / 「重试」主按钮 / 辅助链接）；点重试 → loading → success。
  - success：默认。
  - 切换：`?state=loading|empty|error|success`，`?period=day|week|month`，`?theme=light|dark`，`?toast=login`（success 态叠加登录成功 Toast，充当 login success 态）；截图矩阵与审查按此取图。

## 5. 真实内容
- 文案：`content/login.md`、`content/dashboard.md`（含应用壳），每条带 key，全部人写；设计稿与实现按 key 引用，不得另写。
- 数据：`mock/*.json`（说明与校验脚本见 `mock/README.md`）。示例租户「栖木家居」（杭州栖木家居有限公司，实木家具 / 软装），客单价约 ¥400，近 30 天销售额 ¥1,186,420 / 2,964 单；5 个渠道（天猫旗舰店 / 抖音小店 / 京东旗舰店 / 微信小程序 / 线下门店）；订单号 `SO-YYYYMMDD-NNNN`，商品为家居 SKU（北欧白橡木餐桌 1.4m ¥2,680、胡桃木床头柜（双抽）¥899、亚麻遮光窗帘 2.5m ¥459、藤编收纳篓三件套 ¥168、云朵羊羔绒抱枕 45×45 ¥89 …）；团队 5 人（沈若琳 / 蒋一鸣 / 何嘉豪 / 唐雨薇 / 郭文博）；所有合计、分项、趋势末点与上期点、较上期百分比、周↔月逐日加总、同一订单的下单 / 退款申请 / 受理时序均由 `node mock/check.mjs` 断言（改数据必重跑）。
- 旧 `packages/spec/mock/*` 仅供字段结构参考，本轮**不引用**（其内容为 SaaS 订阅品，与本产品定位不符）。
- 图片：**零位图**。头像 = 姓名末字 + 色相索引；Logo = 文字标 + 简单几何图形（阶段 2 用 SVG 绘制，自有资产）；空态插图 = 令牌色几何图或不用图；第三方登录图标 = CC0 单色（simple-icons，https://github.com/simple-icons/simple-icons ，CC0-1.0）或纯文字。
- 界面图标：`mock/nav.json.icon` 及顶栏 / 操作菜单 / 状态图标统一用 Lucide（https://lucide.dev ，ISC 许可；仓库 `packages/icons-react` 已依赖 `lucide-react`），图标名即 Lucide 名（`layout-dashboard`、`receipt-text`、`rotate-ccw`、`package`、`warehouse`、`truck`、`chart-column`、`settings`）；不混用其它图标集。
- 字体：仅 OFL —— 中文 Noto Sans SC（`@fontsource-variable/noto-sans-sc`，OFL-1.1），西文 / 数字 Inter（`@fontsource-variable/inter`，OFL-1.1）或 Geist（`geist`，OFL-1.1），数字列启用 `font-variant-numeric: tabular-nums`；两者均已在 `apps/shadcn-ui` 使用，阶段 2 在 `design/tokens.json` 定稿。
- 人名、公司、邮箱域名（`qimu-home.cn`）、供应商（安吉林语木业）均为虚构。

## 6. 非目标
- 本轮不做：订单列表 / 表单 / 设置 / 组件全集 / 落地页 / 对话页（后续轮次）；侧边栏对应导航项保留但不可达。
- 不接真实后端、OAuth、支付；无网络请求，数据只读 `mock/`。
- 不改动现有 `apps/<其他库>/`、`gallery/`、`packages/spec/`；画廊首页本轮不接入参考应用。
- 不做多租户切换、权限差异化视图（「切换团队空间」菜单项仅视觉）。
- 不做国际化（仅简体中文，人民币）。
- 不启用 GitHub Actions；不放宽 pnpm `minimumReleaseAge`。

## 7. 约束
- 技术栈：pnpm + turbo monorepo，参考应用新建于 `apps/reference/`：**React 19 + Vite + TypeScript + Tailwind v4 + shadcn/ui（作无样式 / 低样式基座，令牌注入 shadcn CSS 变量与 Tailwind `@theme`）**；图表 Recharts；路由 react-router（文件式或单文件路由表均可，阶段 4 定）；Playwright 固定 1.62.1（复用 `tools/shoot`）；须被 `tools/assemble.mjs` 组装进 `dist/apps/reference/`（需 `gallery.json`，`slug: "reference"`）；部署沿用 `wrangler.jsonc`。
- 品牌：无现成令牌 / Logo，阶段 2 新建 `design/tokens.json`（W3C DTCG）→ `design/tokens.css`：1 主色 + 中性灰阶 + 语义色（success / warning / danger / info），暗色映射；字阶 3–5 级；8pt 网格；圆角 / 阴影 / 边框。视觉方向：现代、克制的 SaaS 后台（对标 Linear / Vercel Dashboard / Stripe Dashboard 的克制感），**不复制**其文案、图片、商标与图标。
- 无障碍：WCAG 2.2 AA —— 正文对比度 ≥4.5:1、大字 / 图标 ≥3:1；全部可点击热区 ≥40×40；键盘可达且焦点环可见；Tabs / Popover / Menu / Dialog 符合 WAI-ARIA APG；图表提供文字替代（表格或 `aria-label` 摘要）；`prefers-reduced-motion` 下关闭动效。
- 断点：375 / 768 / 1024 / 1440；亮 / 暗两态；375 与 1440 为截图与验收视口（`packages/spec/contract.json` 的 375×812 / 1440×900）。
- 禁止项：硬编码颜色 / 字号 / 间距（一律来自令牌）；lorem ipsum / 随机数 / 占位人名头像；页面层出现 `#hex` 或裸 `px`。
- 门禁：每阶段按 `.devin/skills/frontend-0to1-ai/SKILL.md` 表格执行；实现阶段 `pnpm lint / typecheck / build` 于 `apps/reference/` 全绿、375 无横向溢出、0 console error；公司规则不依赖 CI，本地全绿即合。

## 8. 参考（SOP-10）
- 主标尺：Linear（https://linear.app ）、Vercel Dashboard（https://vercel.com/dashboard ）、Stripe Dashboard（https://dashboard.stripe.com ）——只参考「克制感」：低饱和主色、单层次边框、少阴影、紧凑字阶；**不做逐屏图鉴、不复制任何素材**。
- 方法论：`.devin/skills/frontend-0to1-ai/SKILL.md`（源 company-os）。

## 9. 老板原话逐条对照
| # | 原话要点 | 落点 |
|---|---|---|
| 1 | Acme Console = UI Gallery 参考应用，作为后续所有组件库「按稿还原」的唯一标准 | §1 第二段；§7 门禁 |
| 2 | 虚构公司 Acme，做在线订单 / 库存管理 SaaS；用户是运营人员与团队管理员，桌面与手机都用 | §2 全表；§10-A（租户视角） |
| 3 | login：邮箱 + 密码、记住我、忘记密码、Google / GitHub / 微信、注册入口 | §4 login 行；§4.1；`content/login.md` |
| 4 | login 状态：字段校验错误、提交 loading、登录失败 Alert、成功跳转 | §4 login「必备状态」5 态；`content/login.md`「校验与反馈」 |
| 5 | dashboard 应用壳：侧边栏 8 项分组导航可折叠 + 顶栏面包屑 / 全局搜索 / 通知铃铛 Popover / 主题切换 / 头像菜单 | §4.2 应用壳；`mock/nav.json`（4 组 8 项）；`content/dashboard.md`「应用壳」 |
| 6 | 概览：4 统计卡（数字 / 同比 / 迷你趋势）、折线 + 柱状 / 环形图、最近订单表 5 行（状态 Tag、操作菜单）、团队动态时间线、任务进度列表、日 / 周 / 月 Tabs | §4.2 概览内容 1–5；`mock/stats.json`、`series.json`、`orders.json`、`activity.json`、`tasks.json` |
| 7 | dashboard 状态：loading 骨架屏、empty（新账号无数据）、error（加载失败 + 重试）、success | §4.2 状态；`content/dashboard.md`「状态语」 |
| 8 | 真实内容：订单号 / 商品名 / 金额 / 时间 / 人名与动态像真实订单库存 SaaS 公司数据，中文语境、人民币，量级与字段合理；不得 lorem / 随机数 / 占位人名头像 | §5；`mock/check.mjs` 校验脚本（合计 / 分项 / 同比 / 周月逐日 / 订单时序互验，清单见 `mock/README.md`） |
| 9 | 现有 `packages/spec/mock/*.json` 可参考字段结构，内容重写到根 `content/` 与 `mock/` | §5 第 3 条；目录已建于仓库根 |
| 10 | 桌面 1440 与移动 375、亮 / 暗、WCAG 2.2 AA（≥4.5:1、热区 ≥40px、键盘可达） | §7 无障碍 / 断点 |
| 11 | 视觉：现代、克制 SaaS 后台（Linear / Vercel / Stripe 克制感，不复制），1 主色 + 中性灰阶 + 语义色，字阶 3–5 级，8pt 网格 | §7 品牌；§8 |
| 12 | 技术栈：pnpm + turbo；`apps/reference/` React 19 + Vite + TS + Tailwind v4 + shadcn/ui，令牌注入 shadcn CSS 变量；Playwright 1.62.1；不放宽 minimumReleaseAge | §7 技术栈；§6 最后一条 |
| 13 | 非目标：不做订单 / 表单 / 设置 / 组件全集 / 落地页 / 对话页；不接后端与支付；不改其他 apps 与 gallery | §6 |
| 14 | 部署：`pnpm exec wrangler deploy` 沿用 wrangler.jsonc；被 `tools/assemble.mjs` 组装进 `dist/apps/reference/`；画廊首页可先不接入 | §7 技术栈；§6 第 3 条 |

## 10. 解释与取舍（如无异议按此执行）
- **A. 数据视角**：原话同时出现「SaaS 公司的运营后台」与「订单号 / 商品名 / 金额」。取「Acme 是做订单 / 库存管理的 SaaS，Acme Console 是其交付给商家客户的控制台」，数据以一家示例商家租户（栖木家居）的视角呈现——这样商品名、渠道、仓库、退款等字段才是真实业务字段；若老板要的是 Acme 自身（订阅收入 / 租户数）的内部后台，只需替换 `mock/`，屏幕结构不变。
- **B. 周期口径**：日 = 今日 00:00 至 17:30；周 = 近 7 天；月 = 近 30 天（滚动窗口，避免「本月才 6 天」小于「本周」的观感）；「同比」实现为「较上期」（等长的前一窗口）。
- **C. 4 张统计卡选型**：销售额、订单数为周期累计（上升绿 / 下降红）；待发货、库存预警为快照值（运营每天真正要盯的），其「较上期」用绝对数而非百分比；库存预警上升为负面（红，`invertDelta:true`）；待发货增减为**中性**（`deltaTone:"neutral"`，只显示方向图标与数字，不着语义色：订单多或发货慢都会升高，无法判定好坏）。迷你趋势 7 点 = 连续 7 个等长窗口（日 = 各日同时段，周 = 自然周，月 = 滚动 30 天，非日历月），倒数第 2 点即「上期」。
- **D. 8 项导航**：仪表盘 / 订单 / 售后 / 商品 / 库存 / 采购 / 报表 / 设置，分 4 组；本轮只有仪表盘可达，其余 `aria-disabled` 不 404。旧 `packages/spec/mock/nav.json` 的「新建项目 / AI 助手 / 落地页 / 登录页」不符合运营后台信息架构，弃用。
- **E. 微信 / Google / GitHub**：按原话保留三个第三方入口，文字标签 + CC0 单色图标，不用官方位图 Logo（避免商标素材）。
- **F. 最近订单第 4 行为线下门店订单（下单即完成）**：用于自然地覆盖「已完成」状态，其余 4 行覆盖待发货 / 待付款 / 退款中 / 已发货；「已取消」在枚举中登记但 5 行内不出现。
- **G. 空态账号**：仍以沈若琳登录，团队空间名改为「未命名团队」，表达「新注册、未接渠道」。

---

## 11. 第 2 轮增量：追加 6 屏（阶段 0，2026-09-08）
> 增量轮。§1–§10 为第 1 轮定稿（login / dashboard），**原文不改**；本节只追加。第 1 轮 §6 第一条「本轮不做订单列表 / 表单 / 设置 / 组件全集 / 落地页 / 对话页」自本节起由 §11 覆盖。上线后 Acme Console 共 8 屏（login、dashboard + 本节 6 屏），作为后续所有组件库「按稿还原」的唯一标准。
> 复用不变：IA `01-ia.md` 的应用壳与导航；令牌 `design/tokens.json`（只可追加，不改旧值）；工程地基 `apps/reference/`（React 19 + Vite + TS + Tailwind v4 + shadcn 基座，`AGENTS.md` 为唯一设计系统上下文）；已上线 login / dashboard `compare.mjs` 仍须 ALL PASS。
> 老板原话逐条对照见 §11.9；取舍见 §11.10；本阶段门禁运行结果见 §11.11。

### 11.1 屏幕清单（本轮 6 屏，全部新增）
| id | 路由 | 目的（用户来这里做什么） | 关键信息（按优先级） | 必备状态 |
|---|---|---|---|---|
| orders | `/orders` | 找到一批订单并处理（发货 / 加急 / 取消 / 看物流与备注） | ① 工具栏：搜索、状态筛选、下单日期范围、渠道多选、导出、列显示开关 ② 表格：可排序表头（订单号 / 金额 / 下单时间）、行选择（全选 / 半选）、状态 Tag、金额右对齐、行内操作菜单 ③ 分页（页码 + 每页 10 / 20 / 50） ④ 点行开右侧 Drawer：描述列表 + Tabs 商品 / 物流 / 备注 ⑤ 取消 / 删除 → Dialog 二次确认 → Toast ⑥ 375：表格卡片化、工具栏折叠为「筛选」Sheet | loading（骨架 10 行）/ empty-filtered（筛选无结果 + 清除筛选）/ empty-new（新账号无订单 + 接入渠道）/ error（加载失败 + 重试）/ success；子态：`?open=drawer`、`?open=dialog-cancel`、`?open=dialog-delete`、`?toast=cancelled` |
| form | `/form` | 用 3 步建一张采购单并提交给供应商 | ① Stepper：基本信息 / 商品与配送 / 确认提交 ② 步 1：供应商 Combobox、联系人、电话（国家码 Select）、邮箱、备注 Textarea 字数统计、结算方式 Radio、开票 Checkbox、加急 Switch ③ 步 2：商品行可增删（SKU Combobox、数量 Number、单价、小计自动）、仓库 Select、期望到货 DatePicker、收货时段 TimePicker、运费区间 Slider、附件拖拽区 + 文件列表、标签输入 ④ 步 3：只读摘要 + 合计 + 同意条款 Checkbox + 提交 ⑤ 全字段校验（必填 / 格式 / 范围）内联 ⑥ 提交 loading → Result 成功页（查看采购单 / 再建一张） | default / invalid（字段错误 + 顶部汇总 Alert）/ loading（提交中）/ success（Result）/ error（提交失败 Alert）；子态：`?step=1|2|3`、`?open=terms`、`?open=leave` |
| settings | `/settings` | 管自己（资料 / 安全 / 通知）和团队（成员 / 计费） | ① Tabs（1024+ 左侧竖向，≤768 顶部横向可滚）：个人资料 / 账号安全 / 通知 / 团队 / 计费 ② 个人资料：首字母头像、姓名、职位、简介、语言 Select、时区 Combobox、保存 / 重置 ③ 账号安全：改密码（强度提示）、两步验证 Switch + 纯 CSS/SVG 二维码位 + 手动密钥 + 6 位码、活跃会话列表（设备 / 地点 / 时间 + 注销） ④ 通知：3 分组 Switch 列表 + Segmented（邮件 / 推送 / 站内）+ 免打扰时段 ⑤ 团队：成员表格（首字母头像、角色 Select、移除）+ 邀请 TagInput + 待接受邀请 ⑥ 计费：当前计划卡 + 3 档对比卡（月 / 年 Switch、推荐 badge、功能勾选）+ 发票表格 ⑦ 底部危险区 Card：删除团队空间 → Dialog 需输入「删除 栖木家居」 | default / saving / saved（Toast）/ error（保存失败 Alert）/ 各 Tab 空态：无其他会话、无发票、无待邀请、仅自己一名成员；子态：`?tab=profile|security|notifications|team|billing`、`?open=2fa|remove|danger`、`?cycle=monthly|yearly` |
| components | `/components` | 开发者与审查员核对设计系统全集（取代 `/kitchen-sink`，旧路由重定向） | ① 顶部粘性锚点索引（375 为 Select）+ 搜索 + 亮 / 暗切换即时生效 ② 10 类区块：排版 / 按钮 / 表单控件 / 数据展示 / 反馈 / 导航 / 布局 / 主题 / 引导 / 复合组件 ③ 每个组件矩阵：全部 variant × size × state（默认 / hover / focus / disabled / loading / error / selected / checked / readonly / open / streaming / running / indeterminate …，不适用格显示 —） ④ 每组件「代码片段折叠」：组件名 + props 用法，纯文本等宽字体 + 复制 ⑤ 主题区：语义色板 × 亮暗、字阶、间距、圆角、阴影、动效令牌表 | 无业务 loading / empty / error；状态：`?theme=light|dark`、`?open=code`（全部代码折叠展开）、从 `/kitchen-sink` 跳转时显示一次迁移提示 |
| landing | `/landing` | 潜在客户 3 分钟内看懂 Acme 是什么、值多少钱、去试用 | ① Navbar：Logo、5 链接、登录 / 免费试用 CTA、375 汉堡 Sheet；滚动后吸顶实底 ② Hero：标题 / 副标题 / 双按钮 + 令牌色纯 CSS/SVG 抽象 dashboard 插画 + 首字母头像群「1,200+ 团队在用」 ③ 客户 Logo 云：6 个虚构文字 wordmark ④ 6 特性卡 ⑤ 3 段图文交替分屏（抽象图） ⑥ 数据带 4 大数字 ⑦ 定价 3 档（月 / 年 Switch、推荐 badge、功能列表） ⑧ 6 条虚构客户评价 ⑨ FAQ Accordion 6 项 ⑩ CTA 横幅 ⑪ Footer：4 列链接 + 社交图标 + 版权 + 语言 Select | default / scrolled（Navbar 吸顶实底）/ pricing monthly ↔ yearly / menu-open（375 Sheet）；无业务 loading / empty / error |
| chat | `/chat` | 用一句话查订单库存、让助理替自己改单 | ① 左侧会话列表：搜索、今天 / 本周 / 更早分组、新建、每项标题 / 时间 / 未读点；375 为抽屉 ② 主区消息流：用户 / 助手气泡、助手头像 = 品牌标、时间戳；Markdown 段落 / 列表 / 表格 / 代码块 + 复制；引用来源 Chip（订单号 / 文档 / 数据快照）；流式打字中态；工具调用折叠卡「查询订单 SO-…」「更新订单」 ③ 底部输入区：多行自增 Textarea、附件、模型 Select、发送 / 停止、4 条建议 Chip、「Enter 发送 / Shift+Enter 换行」提示 ④ 内容为真实运营会话（缺货 SKU、待发货超 48 小时、改加急、直播复盘、退款话术），答案数字与 mock 一致 | empty（欢迎 + 4 建议卡）/ streaming / success / error（回复失败 + 重试）/ loading（历史加载骨架）；子态：`?conversation=c_1|c_2|c_3`、`?open=sidebar`（375） |

壳：orders / form / settings / chat 复用 dashboard 的 AppShell（面包屑分别为 订单 / 采购 › 新建采购单 / 设置 / 智能助理）；landing 无壳；components 轻壳（仅顶部工具条 + 主题切换）。`mock/nav.json` 的 `orders` 与 `settings` 在实现阶段置 `implemented: true` 并去掉「后续轮次提供」禁用态；`form` / `chat` / `components` / `landing` 不在侧边栏 8 项内（form 从「采购」组进入的路径本轮不做，直接路由可达；chat 入口为顶栏助理按钮，阶段 1 定；landing / components 为独立入口）。

### 11.2 orders 细则
- 数据源：`mock/orders-all.json`（50 单，含第 1 轮 `orders.json` 5 单原样在内；时间跨 08-31 ~ 09-06，状态 待发货 15 / 待付款 2 / 已发货 13 / 已完成 13 / 退款中 4 / 已取消 3，5 渠道均有），每单在第 1 轮字段之上追加 `warehouse|store`、`address`、`paidAt|expiresAt|shippedAt|completedAt|cancelledAt|refundRequestedAt`、`carrier` + `trackingNo` + `logistics[]`（物流 Tab）、`remarks[]`（备注 Tab，作者为 team 成员）、`urgent`、`stockout`、`refundReason|cancelReason`。列表页默认按 `placedAt` 倒序，与 dashboard「最近订单」前 5 行完全一致。
- 工具栏：搜索匹配订单号 / 买家名 / 商品名；状态 Select（全部 + 6 态，标签复用 `dashboard.status.*`）；日期范围（DateRangePicker，预设 今天 / 近 7 天 / 近 30 天）；渠道多选 Popover（5 项 Checkbox，触发文案「渠道 · n」）；导出（Toast「正在导出 n 单…」）；列显示 Popover（每列 Checkbox，订单号 / 状态 / 操作不可隐藏）。有任一筛选时显示「清除筛选」与「筛选出 n 单，共 50 单」。
- 表格：列 = 选择 / 订单号（mono，旁带「加急」「缺货」小 Tag）/ 买家（姓名 + 脱敏手机）/ 商品（首件名 + 等 n 件）/ 渠道 / 状态 Tag / 金额（右对齐 tabular-nums）/ 下单时间 / 操作。可排序：订单号、金额、下单时间（三态 aria-sort）。全选 Checkbox 半选态；选中 ≥1 行显示批量操作条（批量发货 / 导出所选 / 取消选择）。行菜单按状态出项（见 `content/orders.md` rowMenu.*）。
- 分页：每页 10 / 20 / 50（默认 20 → 50 单共 3 页），页码 + 上一页 / 下一页 + 「第 1–20 条，共 50 条」。
- Drawer（右侧，1440 宽 `size.drawer`，375 全宽底部上滑）：标题「订单 SO-…」+ 关闭；描述列表（状态 / 渠道 / 买家 / 手机号 / 收货地址或门店 / 发货仓 / 下单 / 付款或付款截止 / 金额）；Tabs 商品（行 + 小计 + 合计 = amount）/ 物流（承运商 + 运单号复制 + 事件时间线；未发货显示空态；退款中 / 已取消在顶部显示原因）/ 备注（列表 + 添加 Textarea ≤200 字；无备注空态）；底部操作按钮随状态。焦点圈定、Esc 关闭、关闭后焦点回到触发行。
- Dialog：取消订单（说明退款金额 + 取消原因 Select + 危险按钮「确认取消」）；删除订单（仅已取消）。确认后 Toast（success，删除含「撤销」）；模拟失败 → Toast danger「操作失败，请重试」。
- 375：每单一张卡（订单号 + 状态 Tag / 买家 / 商品 / 金额 / 时间 / ⋯），无横向滚动；工具栏收成 搜索 + 「筛选」按钮（Sheet 内含状态 / 日期 / 渠道，底部「查看 n 单」）。
- 状态切换：`?state=loading|empty-filtered|empty-new|error|success`、`?open=drawer|dialog-cancel|dialog-delete|filter-sheet`、`?toast=cancelled|deleted|shipped|copied|export`、`?theme=`。

### 11.3 form 细则
- 数据源：`mock/purchase-form.json`（步骤、国家码、结算方式、仓库、时段、运费区间、标签建议、附件样例与错误样例、全部校验文案、示例草稿 `draft`、成功页 `success`）、`mock/suppliers.json`（6 家虚构供应商，含联系人 / 电话 / 邮箱 / 默认结算 / 常规交期）、`mock/skus.json`（18 个 SKU，采购单价 = `cost`，选项副文案显示库存 / 安全线并标「库存预警」）。
- 步骤 1：选供应商后自动填入联系人 / 电话 / 邮箱 / 结算方式（可改，helper 提示）。电话 = 国家码 Select（+86 默认）+ 11 位；邮箱格式；备注 ≤200 字计数，超限变 danger；结算方式 5 选 1（Radio，带 hint）；开票 Checkbox；加急 Switch（hint 说明可早于常规交期）。
- 步骤 2：商品行 ≥1（默认 1 空行），每行 SKU Combobox（搜索 SKU 或名称）/ 数量 1–9999 整数 / 单价 > 0（默认 `cost`）/ 小计只读；表尾「商品合计」与「n 种商品，m 件」。仓库 Select（选中显示地址）；期望到货 DatePicker（不早于明天；早于「今天 + 供应商交期」时 warning 提示但不阻断）；收货时段 Select 3 项；运费预算双滑块 0–2000 步 50，默认 200–600；附件拖拽区（PDF / XLSX / JPG / PNG，≤10 MB，≤5 个；文件行含上传中进度 / 完成 / 失败重试 / 移除）；标签输入（回车添加 + 建议 Chip）。
- 步骤 3：只读摘要三区块（各带「修改」跳回），合计 = 商品合计 + 运费预算区间（预计总额取上限）；「我已阅读并同意《采购条款》」（书名号打开 Dialog，4 条条款来自 mock）；未勾选提交按钮禁用 + 内联提示。
- 校验：失焦 + 「下一步」时校验当前步；错误内联 `aria-describedby`，步顶 Alert「还有 n 项需要修正」并可定位首个错误；不能跳到未完成步骤。
- 提交：按钮 loading「提交中…」，全表单只读 → success：Result（图形 + 「采购单已提交」+ 说明含 PO 号 / 供应商 / 到货日 + 「查看采购单」「再建一张」）；error：顶部 Alert（`validation.submitError`）+ 「重新提交」，表单保留。示例草稿即 `draft`（东阳樟里木艺，床头柜 60 + 落地灯 20 + 置物架 8，商品合计 ¥40,760.00，PO-20260906-003）。
- 有未保存改动时切换导航弹「离开页面？」Dialog。
- 状态切换：`?state=default|invalid|loading|success|error`、`?step=1|2|3`（invalid 默认落在步 1，`?step=2&state=invalid` 展示步 2 错误）、`?open=terms|leave|supplier|sku`、`?theme=`。

### 11.4 settings 细则
- 数据源：`mock/settings.json`（5 Tab 全部数据、随附 Toast / 空态 / 危险区文案）；`profile` 与 `mock/user.json` 同源（id / name / email / avatarHue 校验一致）；`team.members[].id` 全部来自 `mock/team.json`；`billing.plan` = `user.workspace.plan`（专业版），发票金额 = 计划价；`landing.json.pricing` 与 `billing.plans` 同价。
- 布局：1024+ 左侧竖向 Tabs（宽 `size.sidebar.rail×N`，阶段 1 定）+ 右侧内容 ≤ `content-max`；≤768 顶部横向可滚 Tabs；URL `?tab=` 同步；每个 Tab 独立表单，有改动时底部粘性条「有未保存的修改 · 保存 / 重置」。
- 个人资料：首字母头像（不可上传，hint 说明）、姓名（必填 ≤20）、邮箱只读、职位、简介 ≤160 计数、语言 Select 4 项、时区 Combobox 7 项可搜。保存 → saving → Toast「个人资料已保存」；失败 → Alert。
- 账号安全：改密码（当前 / 新 / 确认；强度条 弱 / 一般 / 强 + 3 条规则逐条打勾；两次不一致内联）；两步验证（Switch 开启 → 面板：纯 CSS/SVG 二维码位 `role=img` + 手动密钥折叠 + 6 位 OTP 输入 + 「验证并启用」；关闭 → Dialog 确认）；活跃会话 3 条（当前设备 Tag、注销按钮、「注销其他所有会话」），空态「没有其他活跃会话」。
- 通知：Segmented 邮件 / 推送 / 站内 切换当前列；3 分组 8 项 Switch（每项 label + description）；分组「全部开启 / 关闭」；免打扰 22:00–08:00。保存 → Toast。
- 团队：席位「已用 5 / 10」；邀请 TagInput（邮箱格式、重复检测）+ 角色 Select + 发送；待接受邀请 1 条（重新发送 / 撤回）；成员表 5 行（头像 + 姓名 + 邮箱 / 角色 Select（自己禁用）/ 加入时间 / 最近活动 / 移除）；移除 → Dialog（正文 `removeConfirm`）→ Toast。
- 计费：当前计划卡（专业版 · 年付、下次续费 2027-03-12、10 席位、支付宝企业账户）；月 / 年 Switch（年付 Tag「省 2 个月」，价格与「折合 ¥n / 月」随切换）；3 档卡（入门 ¥99 / 990、专业 ¥299 / 2,990 推荐 + 当前、企业 ¥899 / 8,990 联系销售），6 条功能勾 / 叉；发票表 4 行（编号 / 日期 / 说明 / 金额右对齐 / 状态 Tag / 下载），空态「还没有发票…」。
- 危险区：页面底部（所有 Tab 下都显示，或仅团队 / 计费 Tab，阶段 1 定）danger 边框 Card「删除团队空间」→ Dialog 需输入「删除 栖木家居」完全匹配才可点「永久删除」→ Toast warning。
- 状态切换：`?tab=`、`?state=default|saving|saved|error|empty`（empty = 当前 Tab 空态：security 无其他会话、team 仅自己且无邀请、billing 无发票、notifications 当前渠道无项）、`?open=2fa|2fa-disable|remove|danger|leave`、`?cycle=monthly|yearly`、`?theme=`。

### 11.5 components 细则
- 取代 `/kitchen-sink`：路由 `/kitchen-sink` → `/components`（静态站点用客户端 `<Navigate replace>` + `_redirects`/Worker 301 二选一，阶段 4 定；两者都要保证旧链接不 404）。`content/kitchen-sink.md` 的 key 迁入 `content/components.md`（前缀改 `components.`，文案不变），实现阶段删除旧文件与旧页面目录。
- 结构：页头（标题 / 副标题 / 令牌版本与组件数 / 搜索 / 主题 亮 · 暗 · 跟随系统）→ 粘性锚点导航（10 类；375 折叠为 Select「跳转到类别」）→ 10 个区块 → 回到顶部按钮。每个组件一张卡：名称 + 来源标记（shadcn / composed）+ 状态矩阵（行 = variant × size，列 = state；不适用格「—」`aria-hidden` + 视觉隐藏「不适用」）+ 右上「代码」折叠按钮（`aria-expanded`）→ 展开等宽纯文本 `tsx` 用法 + Props 表（属性 / 类型 / 默认值）+ 复制按钮。
- 覆盖面（= `04-components.md` §1 §2 全部 + 本轮新增）：新增控件 Textarea、NumberInput、Select、Combobox、RadioGroup、Switch、Slider（双滑块）、DatePicker / DateRangePicker、TimePicker、TagInput、OTPInput、FileDropzone + FileItem、Pagination、Dialog、Drawer（右侧）、Accordion、Segmented、Stepper、DescriptionList、Result、Markdown（含表格 / 代码块）、CodeBlock、SourceChip、ToolCallCard、ChatBubble、Composer、ConversationItem、PlanCard、PricingToggle、AnchorNav、Hero 抽象图。每件都在本页出现全部状态后才允许在业务页使用（AGENTS.md 规则）。
- 主题区：语义色板（每个 token 名 + 亮 / 暗两格 + 对比度数值）、字阶样张、间距标尺、圆角 / 阴影样张、动效时长表——全部读取 `design/tokens.css` 变量渲染，不写死值。
- 状态切换：`?theme=light|dark|system`、`?open=code`（全部代码折叠展开，供截图）、`?section=<key>`（滚动到区块）。无业务 loading / empty / error。

### 11.6 landing 细则
- 数据源：`mock/landing.json`（导航、CTA、Hero、6 客户 wordmark、6 特性、3 分屏、4 数字、定价 3 档、6 评价、6 FAQ、CTA 横幅、Footer 4 列 + 社交 + 语言 + 版权）；结构文案 `content/landing.md`。
- 无应用壳，移动优先。Navbar：顶部透明 → 滚动 > 1 屏高 `hero` 后吸顶实底（`surface` + hairline + `shadow.sm`）；1440 显示 5 链接 + 登录 / 免费试用；375 只留 Logo + 试用 + 汉堡（Sheet 内 5 链接 + 两个 CTA）。
- Hero：eyebrow / h1 / 副标题 / 主次按钮 / 「无需绑卡 · 5 分钟接入」；右侧（375 下方）令牌色纯 CSS/SVG 抽象 dashboard（顶栏 + 4 卡 + 面积图 + 3 行表格，`role=img` aria-label），不放截图位图；头像群 5 个首字母头像 + 「1,200+ 团队在用」。
- 客户 Logo 云：6 个文字 wordmark（`fg-muted`，统一字重），无图片。特性 6 卡（Lucide 图标 + 标题 + 描述，1440 三列 / 768 两列 / 375 单列）。3 段分屏左右交替（eyebrow / 标题 / 描述 / 3 bullets / 「了解更多」+ 抽象图），375 图在上文在下。数据带 4 数字（`typography.display`）+ 脚注。定价：月 / 年 Switch（年付 Tag「省 2 个月」）、3 卡（推荐档抬高 + badge「最受欢迎」+ primary 边框）、功能列表勾选、脚注。评价 6 卡（首字母头像 + 姓名 / 职位 / 公司 + 引文，1440 三列）。FAQ Accordion 6 项（单开或多开，阶段 1 定）。CTA 横幅（primary 面积，允许更大字阶）。Footer：品牌 + 说明 / 4 列链接（`aria-disabled` + Tooltip「演示站点，链接不可用」）/ 社交图标 4 个 / 语言 Select / 版权。
- 视觉：允许更大字阶与更强主色面积，但仍只用令牌；如需新增字阶（如 `typography.hero`）只追加令牌不改旧值，阶段 2 决定。
- 状态切换：`?state=default|scrolled`、`?cycle=monthly|yearly`、`?open=menu`（375 Sheet）、`?theme=`。

### 11.7 chat 细则
- 数据源：`mock/chat.json`：7 个会话（今天 3 / 本周 2 / 更早 2，1 个未读），5 个会话有完整消息（c_1 缺货 SKU 表 + CSV 代码块；c_2 改加急，两次工具调用；c_3 待发货超 48 小时表；c_4 直播复盘；c_5 退款话术），`streamingSample`（正在创建采购单草稿的半截回复 + running 工具卡），4 条建议，2 个模型，空态 / 错误文案。所有数字可回溯：缺货表 = `skus.json.weekStockoutOrders`（6 SKU 合计 40）、库存 / 安全线 = `skus.json`；订单表与来源 Chip 的订单号均存在于 `orders-all.json` 且金额一致；直播复盘 ¥52,310 / 134 单 与 09-02 ¥39,760 / 101 单 = `series.month`；改加急的对象为真实存在的待发货缺货单 SO-20260903-0087（见 §11.10-D）。
- 布局：应用壳内；主区 = 左栏会话列表（1440 宽 `size.sidebar.expanded`，1024 可折叠，≤768 为左侧 Sheet，顶部「打开会话列表」按钮）+ 右侧消息流 + 底部输入区。会话列表：搜索、「新建会话」主按钮、分组标题、每项标题 / 相对时间 / 未读点 / 悬停 ⋯（重命名 / 删除 → Dialog）。
- 消息流 `role=log aria-live=polite`：日期分隔（今天 / 昨天 / 09-04）；用户气泡右对齐 primary-soft，助手气泡左对齐 surface + 品牌标头像 + 「Acme 助理」+ 时间戳；助手消息下方操作（复制 / 重新生成 / 有帮助 / 没帮助）；Markdown 渲染：段落 / 列表 / 引用 / 表格（375 横向滚动 + 提示）/ 代码块（语言标签 + 复制）；来源 Chip 组（订单 → `/orders/SO-…`，文档，数据快照）；工具调用折叠卡（名称 + 参数摘要 + 状态 running / done / failed + 耗时；展开显示参数 / 结果）；流式态：文字逐段出现 + 光标 + `aria-busy`，输入区发送按钮变「停止生成」。
- 输入区：Textarea 自增至 8 行；附件按钮（CSV / XLSX / PDF / PNG / JPG ≤10 MB，已选文件 Chip 可移除，超限内联错误）；模型 Select（标准 / 深度分析）；发送（空内容禁用）；建议 Chip 4 条（有历史时横向一行，375 可滚）；提示「Enter 发送，Shift + Enter 换行」（375 隐藏）；接近 2000 字显示计数。
- 状态：empty = 新会话（欢迎「你好，若琳」+ 说明 + 4 建议卡，无消息）；loading = 会话切换时历史骨架（3 组气泡）+ 左栏骨架；streaming = c_1 末尾追加 `streamingSample`；success = c_1 完整；error = 最后一条助手消息替换为 Alert「回复失败：…（504）」+ 重试 / 忽略；工具调用成功后 Toast「已把 SO-20260903-0087 标记为加急」（c_2）。
- 状态切换：`?state=empty|loading|streaming|success|error`、`?conversation=c_1|c_2|c_3|c_4|c_5`、`?open=sidebar|delete`、`?toast=urgent`、`?theme=`。

### 11.8 真实内容与数据资产（本轮新增文件）
| 文件 | 用途 | 与已有口径的关系 |
|---|---|---|
| `mock/orders-all.json` | orders 全量 50 单；chat 引用 | 含 `orders.json` 5 单原样；同 `SO-YYYYMMDD-NNNN`、同 6 状态 5 渠道、金额 = Σ qty × unitPrice、`placedAt ≤ asOf`、倒序；单日序号 ≤ `series.month` 当日订单数（09-06 108、09-05 115、09-04 96、09-03 134、09-02 101、09-01 85、08-31 由 series 给出） |
| `mock/skus.json` | orders 商品行、form SKU 选项、chat 缺货表 | 18 个 SKU，名称 / 售价与 `orders.json` 完全一致；`lowStock` 6 个 ⊂ `stats.lowStock` 12；床头柜 `stock 18 / safetyStock 40` 与 `notifications.json` n_2「剩余 18 件」、抱枕 `safetyStock 200` 与 `activity.json` act_3「150 → 200」一致 |
| `mock/suppliers.json` | form 供应商 Combobox；chat 补货建议 | 6 家虚构公司，含第 1 轮已出现的安吉林语木业；每个 SKU 的 `supplier` 均在其中 |
| `mock/purchase-form.json` | form 全部选项 / 校验 / 草稿 / 成功页 | 仓库 = `meta.tenant.warehouses` + 门店；草稿单价 = `skus.cost`，合计可验算 |
| `mock/settings.json` | settings 5 Tab | profile = `user.json`；members = `team.json` 5 人；plan = `user.workspace.plan`；发票金额 = 计划价 |
| `mock/landing.json` | landing 全部内容 | 客户 / 评价人 / 公司均虚构（含栖木家居 沈若琳 一条评价，引用 9/3 直播 134 单）；定价与 `settings.billing.plans` 同价；平台数字（1,200+ 团队等）为 Acme 平台口径，与租户经营数据无关 |
| `mock/chat.json` | chat 会话 / 消息 / 建议 / 模型 | 见 §11.7；订单号 / 金额 / 库存 / 趋势全部由 `check.mjs` 交叉断言 |
| `content/orders.md` `form.md` `settings.md` `components.md` `landing.md` `chat.md` | 六屏文案（结构标签 / aria / 状态语） | 内容型文案（标题、说明、评价、FAQ、校验语、Toast 语）放在对应 mock 的随附字段，一处维护；`components.md` 吸收 `kitchen-sink.md` 全部 key |
- `mock/meta.json` 只追加 `carriers`（承运商枚举）与本轮 notes，不改旧字段；`mock/nav.json` 本阶段不改（`implemented` 在实现阶段翻转）。
- 校验：`node mock/check.mjs` 在第 1 轮断言之上追加 orders-all（含首 5 单 = orders.json、序号 ≤ 当日订单数、状态 ↔ 时间字段、物流 / 备注引用）、skus（售价 ↔ orders、库存 ↔ 通知 / 动态、lowStock ≤ stats）、suppliers ↔ skus、purchase-form 草稿合计、settings ↔ user / team、landing ↔ settings 定价、chat 来源订单号存在 / 缺货表 ↔ skus / 复盘数字 ↔ series。
- 零位图、Lucide 图标、OFL 字体、虚构人名 / 公司 / 域名：与 §5 相同。二维码位、Hero 插画、分屏示意图全部为令牌色纯 CSS/SVG。

### 11.9 老板原话逐条对照（第 2 轮）
| # | 原话要点 | 落点 |
|---|---|---|
| 1 | 增量轮：复用 Brief / IA / 令牌 / 工程地基，只追加 6 屏；最终 8 屏齐全，作为「按稿还原」唯一标准 | §11 导语；§11.1 |
| 2 | 已有实体与文案口径必须沿用，不得重造第二套人名 / 订单号 / 金额 | §11.8 全表；`mock/check.mjs` 交叉断言；chat / form / settings 只引用 `team.json` / `user.json` / `orders.json` 已有人物与订单 |
| 3 | orders：工具栏 6 件、表格（排序 / 全选半选 / Tag / 金额右对齐 / 行菜单）、分页（页码 + 每页条数）、行点开右侧 Drawer（描述列表 + 商品 / 物流 / 备注 Tabs）、删除 / 取消 Dialog → Toast、移动端卡片化、4 类状态含两种 empty、数据 ≥40 单 | §11.1 orders 行；§11.2；`mock/orders-all.json`（50 单）；`content/orders.md` |
| 4 | form：3 步；步 1 供应商 Combobox / 联系人 / 电话国家码 / 邮箱 / 备注计数 / 结算单选 / 开票复选 / 加急 Switch；步 2 商品行增删（SKU / 数量 / 单价 / 小计）/ 仓库 / 到货日期 / 时段 / 运费 Slider / 附件拖拽 + 列表 / 标签；步 3 摘要 + 合计 + 条款 + 提交；全字段校验内联；提交 loading → Result；5 态 | §11.1 form 行；§11.3；`mock/purchase-form.json` `suppliers.json` `skus.json`；`content/form.md` |
| 5 | settings：左侧（375 顶部）5 Tabs；个人资料（首字母头像 / 姓名 / 简介 / 语言 / 时区 / 保存重置）；账号安全（改密码强度 / 两步验证 Switch + CSS/SVG 二维码位 / 会话列表 + 注销）；通知（分组 Switch + Segmented）；团队（成员表 + 邀请）；计费（当前计划 + 3 档月 / 年 + 推荐 + 发票表）；危险区输入确认；4 态 + 各 Tab 空态 | §11.1 settings 行；§11.4；`mock/settings.json`；`content/settings.md` |
| 6 | components：设计系统全集页，10 类别，全部 variant × size × state，锚点索引，亮 / 暗即时切换，取代 /kitchen-sink（301），无业务状态，有代码片段折叠（纯文本等宽） | §11.1 components 行；§11.5；`content/components.md` |
| 7 | landing：无壳移动优先；Navbar（5 链接 + CTA + 375 Sheet）；Hero（纯 CSS/SVG 抽象 dashboard + 首字母头像群「1,200+」）；6 文字 wordmark 客户；6 特性卡；3 分屏；4 数字；定价 3 档月 / 年；6 评价；FAQ 6；CTA；Footer 4 列 + 社交 + 版权 + 语言；状态 default / 吸顶 / 月年切换 | §11.1 landing 行；§11.6；`mock/landing.json`；`content/landing.md` |
| 8 | chat：应用壳内；左会话列表（搜索 / 分组 / 新建 / 未读点，375 抽屉）；消息流（气泡 / 品牌标头像 / 时间戳 / Markdown 表格代码块复制 / 来源 Chip / 流式 / 工具调用卡）；输入区（自增 Textarea / 附件 / 模型 / 发送 / 4 建议 / Enter 提示）；内容为真实运营会话且数字与 mock 一致；5 态 | §11.1 chat 行；§11.7；`mock/chat.json`；`content/chat.md`；示例订单号取舍见 §11.10-D |
| 9 | 真实内容：订单号 / SKU / 商品 / 供应商 / 金额 / 时间 / 人名 / 公司沿用或扩展；中文人民币量级合理；禁 lorem / 随机数 / 占位 / 真实品牌 | §11.8；`mock/check.mjs`；landing 客户与评价全部虚构 |
| 10 | 1440 与 375（表格 / 表单类另加 768 / 1024）、亮 / 暗、WCAG 2.2 AA，Drawer / Dialog / Sheet 焦点圈禁 + Esc + 焦点归位 | §11.1 各行状态列；§11.2 Drawer；§11.10-B（截图矩阵扩展）；第 1 轮 §7 无障碍照用 |
| 11 | 视觉方向不变；landing 允许更大字阶与更强主色面积但只用令牌；令牌只追加不改旧值 | §11.6 视觉；§11 导语 |
| 12 | 技术栈不变；Playwright 1.62.1；每屏 `src/pages/<id>/`；orders / settings / chat / form 用壳，landing / components 无壳或轻壳；nav.json 对应项 implemented → true；文案进 `content/<id>.md` | §11.1 壳说明；§11.8；实现阶段执行 |
| 13 | 已上线 login / dashboard 不得回退：compare.mjs ALL PASS | §11 导语；阶段 6–7 门禁 |
| 14 | 非目标：不接真实后端 / AI / 支付；不改其他 apps 与 gallery | §11.10-G |
| 15 | 部署：`pnpm assemble && pnpm exec wrangler deploy` | 阶段 7；本阶段不部署 |

### 11.10 解释与取舍（第 2 轮，如无异议按此执行）
- **A. 订单量与 mock 规模**：orders 列表数据 50 单（≥40），放在新文件 `mock/orders-all.json` 而非直接扩充 `orders.json`——dashboard 的「最近订单 5 行」与其 hifi / compare 基准图依赖 `orders.json` 恰好 5 条，扩充会造成已上线屏回退。`check.mjs` 断言 `orders-all` 前 5 条与 `orders.json` 逐字段相同（追加字段除外），保证同一口径。
- **B. 截图与审查矩阵**：orders / form / settings 属表格 / 表单类，视觉 QA 视口在 1440 / 375 之外加 768 / 1024（`shots.json` 4 视口）；其余 3 屏 1440 / 375。
- **C. 华东仓 = 杭州仓**：租户目前只有一个仓（`meta.tenant.warehouses`），chat 里「华东仓」按用户口语理解为杭州仓，助理回答中写「杭州仓（华东）」，不新增第二个仓。
- **D. 老板示例订单号 `SO-20260903-0412`**：9/3 全天 134 单（`series.month`），序号 0412 超出当日订单数，与「订单号 = 当日序号」口径冲突；改用真实存在的待发货缺货单 `SO-20260903-0087`（抖音、苏婉婷、床头柜 ×2、¥1,798.00）作为「改加急」示例，其余场景不变。
- **E. form 入口**：采购单属于「采购」导航项，但本轮不做 `/purchasing` 列表；`/form` 直接路由可达，面包屑「采购 › 新建采购单」中「采购」不可点。chat 入口为顶栏助理按钮（新增 IconButton），阶段 1 IA 定位置；landing / components 不进应用壳导航。
- **F. 会话 / 发票 / 成员的「空态」**：settings 用 `?state=empty` 在当前 Tab 上模拟（不另造第二套账号数据）；orders 的 `empty-new` 复用第 1 轮 dashboard 空态约定（团队空间名「未命名团队」，铃铛无角标）。
- **G. 非目标**：不接真实后端 / AI / 支付（chat 的流式与工具调用均为 mock 播放；form 提交为本地模拟；settings 保存为本地模拟）；不做订单详情独立页（`/orders/:id` 仅作为来源 Chip 与通知 link 的目标，实现为打开 `/orders?open=drawer&id=…`）；不做 `/purchasing` `/after-sales` `/products` `/inventory` `/reports`；不改其他 `apps/<库>/` 与 `gallery/`；不做国际化（语言 Select 仅视觉）。
- **H. components 的「代码片段」**：纯文本（`<pre><code>` 等宽），不引入语法高亮库，避免新依赖与 minimumReleaseAge 风险。
- **I. landing 定价与 settings 计费同价**：避免同一产品两套价格；平台统计（1,200+ 团队、3,800 万订单等）为 Acme 平台口径，与栖木家居经营数据分层，脚注注明。

### 11.11 阶段 0 门禁与交付说明（2026-09-08）
- 起点：`git fetch && git checkout fe01/integration && git merge --ff-only origin/main` → `Already up to date`（集成分支已含 main 已发布内容，基线 `e2ab886`）。
- 本阶段门禁：`node mock/check.mjs`（扩展后）——运行结果见本节末尾「运行记录」；Brief 逐条对照 §11.9 / 独立门禁（一句话 / 用户表 / 核心任务 / 屏幕表 / 状态 / 非目标 / 真实内容）已在本节自查。本阶段不改实现代码，但因新增 `content/*.md` 会被现有构建急切加载，额外跑了 `pnpm lint / typecheck / build` 作回归确认；shoot / compare / a11y 未运行。
- 未做（留给后续阶段）：`01-ia.md` 六屏 IA 与线框（阶段 1）；令牌追加（阶段 2，预计需 `size.drawer`、可能的 `typography.hero`）；hifi（阶段 3）；`04-components.md` 新增控件行（阶段 4）；`mock/nav.json` implemented 翻转与 `/kitchen-sink` 重定向（阶段 5）。
- 运行记录（2026-09-08，仓库根 / `apps/reference/`）：
  - `node mock/check.mjs` → `mock ok (2026-09-06T17:30:00+08:00) — orders.json 5 · orders-all 50 · skus 18 · suppliers 6 · chat 7 会话`（第 1 轮全部断言 + §11.8 新增断言全部通过；中途修正 4 处数据口径：orders-all 首 5 单与 orders.json 一字不差、chat c_3「超 48 小时」表按消息时间复算为 2 单、c_4「峰值」改为「第二高，仅次于 8/19 七夕 ¥52,380」、采购草稿备注安全线 30 → 40）。
  - `pnpm install --frozen-lockfile` 后 `pnpm lint && pnpm typecheck && pnpm build`（`apps/reference/`）→ eslint 0 问题、`no-hardcode: 47 个文件通过`、tsc 无错误、vite 构建成功。运行原因：`src/data/content.ts` 以 `import.meta.glob` 急切加载 `content/*.md`，新增 6 份文案会进入现有构建，须确认不破坏已上线页；未改任何 `src/` 文件，`dist/` 不入库。
  - 未运行：`shoot / compare / a11y`（无实现改动、hifi 未出）。
