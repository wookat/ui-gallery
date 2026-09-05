# 项目一页纸：UI Gallery（开源组件库视觉画廊）

| 项 | 内容 |
|---|---|
| 项目名 | UI Gallery（仓库 `wookat/ui-gallery`，站点拟 `ui.zalize.com`） |
| 一句话目标 | 让老板/设计/前端不看代码、不看性能，只看**视觉**：同一套 8 个页面，用每一个免费/开源 UI 组件库各做一遍（官方默认主题），桌面 1440 + 移动 375、亮/暗四态截图并排；点任意一格进入真实可交互页面。目标是**囊括全部**免费/开源组件库（含 React/Vue/Svelte/Solid/Angular/Web Components/纯 CSS），并可切换图标库与字体。 |
| 范围（本期 = 第 1 轮） | ① 页面规格 `docs/page-spec.md`（8 页，覆盖组件库的全部组件、复合组合与状态）；② 库清单 `docs/library-inventory.md`（来源：frontend-libs-research 实查数据 + 本轮新实查）；③ 每库一个独立 Vite 应用 `apps/<slug>/`（用该库原生框架）；④ 画廊站 `gallery/`：并排网格 × 页面 × 视口 × 主题 × 图标库 × 字体；⑤ Playwright 自动截图 `tools/shoot`；⑥ Cloudflare Pages 部署；⑦ 动态工作流：蜂群并行建库 → 独立视觉审查（一审一改）→ 合并 → 重截图 → 部署，每轮增库。 |
| 非目标 | 不比性能/bundle/代码质量（已有 js-framework-benchmark 与 frontend-libs-research 承担）；不做主题定制（第 1 轮只用官方默认主题）；不做后端与真实数据（全 mock）；不做商业库（AG Grid Enterprise、MUI X Pro、tldraw、GSAP 等许可受限项只在清单中标注，不实现）；不做登录/支付。 |
| 里程碑 | M1 骨架可跑：spec + 画廊站 + 首个参考实现（shadcn/ui）+ 截图管线 + 部署上线（1 个会话）；M2 第 1 轮蜂群：React 16 + Vue 10 + 其他框架 8 ≈ 34 库全部上线（1–2 个会话，20+ 并行）；M3 四道把关 + 图标/字体切换维度；M4 持续轮次：每轮从研究仓库差集拉新库，直至清单穷尽。 |
| 组队名单 | project-lead ×1（本会话兼任，出规格与选型）；frontend-engineer ×N（每库 1 实例，蜂群）；ui-designer ×N（独立审查，与建库实例不同会话，一审一改）；qa-engineer ×1；user-experience-officer ×1；devops-engineer ×1（部署/域名）。 |
| 技术选型 | pnpm + Turborepo monorepo；每库应用用其原生框架的 Vite 模板（React 19 / Vue 3.5 / Svelte 5 / Solid / Angular CLI / Lit）；画廊站 Astro（静态，读各应用 `gallery.json` 清单 + 截图）；截图 Playwright；部署 Cloudflare Pages（单项目，`dist/` 下 `/` 为画廊、`/apps/<slug>/` 为各库）；不启用 GitHub Actions（公司规则），本地 lint/typecheck/build 全绿即合并。 |
| 外部资源清单 | ① **GitHub 仓库 `wookat/ui-gallery`**：Devin 的 GitHub App 无 createRepository 权限（实测 403），需老板手动创建空仓并授权 Devin App——缺口期：本地 monorepo 先建，规格/清单/骨架就绪后一次推送；② 域名 `ui.zalize.com` DNS：已有 Cloudflare token，可自行配置，无需老板；③ 无付费依赖。 |
| 竞品对标对象 | The Component Gallery（component.gallery，组件级截图，无页面级）；shadcn Blocks / Mantine UI（单库页面级）；TodoMVC / RealWorld（多实现同规格，但比代码不比视觉）。达标口径：任取一库，8 页 × 4 态截图齐全、无横向溢出、暗色不缺态；画廊可在 3 秒内把 ≥30 个库同一页面并排看完。 |
| 主要风险 | ① 库数量大、质量参差：用工作流 + 结构化输出强制每库交付「组件覆盖清单」勾选表，缺项即审查不过；② 各库默认主题下同一规格实现差异导致「不公平」：规格只约束信息结构与组件类型，不约束像素，差异本身就是要展示的东西；③ 非 React 框架的 mock/路由需各自实现：spec 用框架无关的 JSON 定义数据与路由，每框架只写一次薄壳；④ 并发 100 会话上限与 429：串行创建、重试、落盘登记（adapters/devin.md）；⑤ 图标/字体切换在部分库（如 MUI 内置图标）不适用：允许标 `n/a`。 |
| 获客 / 分发 / 变现 | 分发：站点开源（MIT）+ GitHub README 长图；每新增一库向该库官方仓库 Discussions/Showcase 投稿链接（各库社区天然导流）；提交至 awesome-react-components / awesome-vue / component.gallery 等目录；X/掘金/V2EX 发「同一页面 30 个组件库长什么样」对比长图。获客指标：GitHub star、周 UV、被引用次数。变现：前期完全免费不接支付（公司规则）；后续可选设计师/团队向「主题定制对比」「私有设计系统接入」增值服务，本轮不做。 |
| 迭代方式 | 短周期：每轮 = 增一批库 → 审查 → 合并部署 → 体验官线上走查 → 修 P0/P1 → 下一轮；不做长期规划，不等老板逐轮确认。 |
