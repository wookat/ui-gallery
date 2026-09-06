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
| login | `/login` | 用工作邮箱进入团队空间 | ① 邮箱 + 密码 + 登录按钮 ② 30 天内记住我 / 忘记密码 ③ Google / GitHub / 微信 第三方登录 ④ 免费注册入口 ⑤ 品牌标与一句话价值 | default / invalid（字段校验错误） / loading（提交中） / error（登录失败 Alert） / success（跳转 `/` + Toast） |
| dashboard | `/` | 打开即知今天生意如何、有什么要处理 | ① 4 张统计卡（数字 / 较上期 / 7 点迷你趋势） ② 日 / 周 / 月 Tabs ③ 销售趋势（折线 + 柱）与渠道占比（环形） ④ 最近订单 5 行（状态 Tag、操作菜单） ⑤ 团队动态时间线 ⑥ 任务进度列表 ⑦ 应用壳：侧边栏 4 组 8 项可折叠、顶栏面包屑 / 全局搜索 / 通知铃铛 Popover / 主题切换 / 头像菜单 5 项 | loading（骨架屏，与成功态同布局） / empty（新账号无数据） / error（加载失败 + 重试） / success |

### 4.1 login 细则
- 表单：邮箱（`type=email`，`autocomplete=username`）、密码（`autocomplete=current-password`，可见性切换按钮 ≥40px 热区）、「30 天内记住我」复选、「忘记密码？」链接（不可达）、主按钮「登录」。
- 校验时机：字段失焦或提交时校验；错误文案内联显示在字段下方并 `aria-describedby` 关联；规则与文案见 `content/login.md`「校验与反馈」。
- 提交：按钮进入 loading（禁用 + spinner + 「登录中…」），全表单只读；失败时表单顶部 Alert（error），聚焦到 Alert；成功跳 `/` 并显示 Toast「欢迎回来，若琳」。
- 第三方登录：3 个次级按钮等宽；图标用 CC0 单色图标（如 simple-icons）或纯文字，**不得**使用官方彩色位图 Logo；点击本轮只做视觉，不接真实 OAuth。
- 布局：1440 为左右分栏（左品牌区 + 一句话价值，右表单卡 ≤ 400px）或居中卡；375 表单全宽、无横向滚动、键盘弹起时主按钮仍可达。阶段 1 定。
- 演示账号规则与 `?state=` 切换：`content/login.md` 末节、`mock/user.json.demoCredentials`。

### 4.2 dashboard 细则
- 应用壳
  - 侧边栏：品牌标 + 团队空间名「栖木家居」；导航 `mock/nav.json`（概览 1 / 交易 2 / 货品 3 / 经营 2 = 8 项，订单 / 售后 / 库存带数字角标）；可折叠为 icon rail（Tooltip 显示文案）；1440 默认展开，1024 默认折叠，≤768 为抽屉（顶栏汉堡按钮打开）。`implemented:false` 的项渲染为 `aria-disabled` + Tooltip「后续轮次提供」，不得 404。
  - 顶栏：面包屑「栖木家居 / 仪表盘」；全局搜索框（placeholder + `⌘K`，375 缩为图标按钮）；通知铃铛（未读角标 3，Popover 列 `mock/notifications.json` 5 条 + 「全部标为已读」+「查看全部通知」）；主题切换（亮 / 暗，持久化到 `localStorage`，同时响应 `?theme=`）；头像（姓名末字 + 色相，无图片）下拉 5 项。
- 概览内容（顺序即 375 下的纵向顺序）
  1. 问候 + 「数据更新于 今天 17:30」+ 日 / 周 / 月 Tabs（默认 月）。Tabs 切换同时驱动统计卡、趋势图、环形图（`mock/stats.json.byPeriod`、`mock/series.json`）。
  2. 4 张统计卡：销售额（¥1,186,420，较上期 +9.4%）、订单数（2,964 单，+5.1%）、待发货（63 单，−21）、库存预警（12 SKU，+4，红为差）。每卡：标签、主数字、较上期（带方向图标与语义色）、7 点迷你趋势（sparkline）。1440 一行 4 卡，768 两行两卡，375 单列或 2×2。
  3. 图表行：销售趋势卡（折线 = 销售额，柱 = 订单数，双 Y 轴；月 30 点、周 7 点、日 18 点）占 2/3；渠道占比环形图（5 渠道，中心显示合计）占 1/3；375 上下堆叠。图表库允许 Recharts（已在仓库使用），配色只用令牌。
  4. 最近订单表：5 行，列 = 订单号 / 客户 / 商品 / 金额（右对齐） / 渠道 / 状态 Tag / 下单时间 / 操作（更多菜单：查看详情 / 标记发货 / 打印面单 / 取消订单，按状态禁用）；375 横向滚动（首列吸附）或卡片化，阶段 1 定。
  5. 团队动态时间线（6 条，头像 + 人名 + 动作 + 详情 + 相对时间）与任务进度列表（5 条，标题 + 负责人 + 进度条 + `done/total` + 截止日；`at_risk` 用 warning 色，`done` 用 success 色）；1440 左右并排，375 堆叠。
- 状态
  - loading：骨架屏形状与成功态同布局（卡、图表矩形、5 行表格、6 条时间线），容器 `aria-busy=true`；不出现 spinner 覆盖全屏。
  - empty：应用壳照常；内容区居中空态（标题 / 说明 / 主按钮「接入销售渠道」/ 次按钮「导入历史订单」），团队空间名「未命名团队」，铃铛无角标；不显示任何统计卡数字。
  - error：应用壳照常；内容区错误块（标题 / 含错误码 503 的说明 / 「重试」主按钮 / 辅助链接）；点重试 → loading → success。
  - success：默认。
  - 切换：`?state=loading|empty|error|success`，`?period=day|week|month`，`?theme=light|dark`；截图矩阵与审查按此取图。

## 5. 真实内容
- 文案：`content/login.md`、`content/dashboard.md`（含应用壳），每条带 key，全部人写；设计稿与实现按 key 引用，不得另写。
- 数据：`mock/*.json`（说明与校验脚本见 `mock/README.md`）。示例租户「栖木家居」（杭州栖木家居有限公司，实木家具 / 软装），客单价约 ¥400，近 30 天销售额 ¥1,186,420 / 2,964 单；5 个渠道（天猫旗舰店 / 抖音小店 / 京东旗舰店 / 微信小程序 / 线下门店）；订单号 `SO-YYYYMMDD-NNNN`，商品为家居 SKU（北欧白橡木餐桌 1.4m ¥2,680、胡桃木床头柜（双抽）¥899、亚麻遮光窗帘 2.5m ¥459、藤编收纳篓三件套 ¥168、云朵羊羔绒抱枕 45×45 ¥89 …）；团队 5 人（沈若琳 / 蒋一鸣 / 何嘉豪 / 唐雨薇 / 郭文博）；所有合计、分项、趋势末点、较上期百分比可相互验算（脚本已跑通）。
- 旧 `packages/spec/mock/*` 仅供字段结构参考，本轮**不引用**（其内容为 SaaS 订阅品，与本产品定位不符）。
- 图片：**零位图**。头像 = 姓名末字 + 色相索引；Logo = 文字标 + 简单几何图形（阶段 2 用 SVG 绘制，自有资产）；空态插图 = 令牌色几何图或不用图；第三方登录图标 = CC0 单色（simple-icons，https://github.com/simple-icons/simple-icons ，CC0-1.0）或纯文字。
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
| 8 | 真实内容：订单号 / 商品名 / 金额 / 时间 / 人名与动态像真实订单库存 SaaS 公司数据，中文语境、人民币，量级与字段合理；不得 lorem / 随机数 / 占位人名头像 | §5；`mock/README.md` 校验脚本（合计 / 分项 / 同比互验） |
| 9 | 现有 `packages/spec/mock/*.json` 可参考字段结构，内容重写到根 `content/` 与 `mock/` | §5 第 3 条；目录已建于仓库根 |
| 10 | 桌面 1440 与移动 375、亮 / 暗、WCAG 2.2 AA（≥4.5:1、热区 ≥40px、键盘可达） | §7 无障碍 / 断点 |
| 11 | 视觉：现代、克制 SaaS 后台（Linear / Vercel / Stripe 克制感，不复制），1 主色 + 中性灰阶 + 语义色，字阶 3–5 级，8pt 网格 | §7 品牌；§8 |
| 12 | 技术栈：pnpm + turbo；`apps/reference/` React 19 + Vite + TS + Tailwind v4 + shadcn/ui，令牌注入 shadcn CSS 变量；Playwright 1.62.1；不放宽 minimumReleaseAge | §7 技术栈；§6 最后一条 |
| 13 | 非目标：不做订单 / 表单 / 设置 / 组件全集 / 落地页 / 对话页；不接后端与支付；不改其他 apps 与 gallery | §6 |
| 14 | 部署：`pnpm exec wrangler deploy` 沿用 wrangler.jsonc；被 `tools/assemble.mjs` 组装进 `dist/apps/reference/`；画廊首页可先不接入 | §7 技术栈；§6 第 3 条 |

## 10. 解释与取舍（如无异议按此执行）
- **A. 数据视角**：原话同时出现「SaaS 公司的运营后台」与「订单号 / 商品名 / 金额」。取「Acme 是做订单 / 库存管理的 SaaS，Acme Console 是其交付给商家客户的控制台」，数据以一家示例商家租户（栖木家居）的视角呈现——这样商品名、渠道、仓库、退款等字段才是真实业务字段；若老板要的是 Acme 自身（订阅收入 / 租户数）的内部后台，只需替换 `mock/`，屏幕结构不变。
- **B. 周期口径**：日 = 今日 00:00 至 17:30；周 = 近 7 天；月 = 近 30 天（滚动窗口，避免「本月才 6 天」小于「本周」的观感）；「同比」实现为「较上期」（等长的前一窗口）。
- **C. 4 张统计卡选型**：销售额、订单数为周期累计；待发货、库存预警为快照值（运营每天真正要盯的），其「较上期」用绝对数而非百分比，库存预警上升为负面（红）。
- **D. 8 项导航**：仪表盘 / 订单 / 售后 / 商品 / 库存 / 采购 / 报表 / 设置，分 4 组；本轮只有仪表盘可达，其余 `aria-disabled` 不 404。旧 `packages/spec/mock/nav.json` 的「新建项目 / AI 助手 / 落地页 / 登录页」不符合运营后台信息架构，弃用。
- **E. 微信 / Google / GitHub**：按原话保留三个第三方入口，文字标签 + CC0 单色图标，不用官方位图 Logo（避免商标素材）。
- **F. 最近订单第 4 行为线下门店订单（下单即完成）**：用于自然地覆盖「已完成」状态，其余 4 行覆盖待发货 / 待付款 / 退款中 / 已发货；「已取消」在枚举中登记但 5 行内不出现。
- **G. 空态账号**：仍以沈若琳登录，团队空间名改为「未命名团队」，表达「新注册、未接渠道」。
