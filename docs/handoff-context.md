# UI Gallery — 交接上下文

更新：2026-09-06

## 仓库 / 服务
- 代码：https://github.com/wookat/ui-gallery （直接提交 main；无 GitHub Actions，验收 = 本地 lint/typecheck/build/shoot 全绿）
- 线上：https://ui.zalize.com （Cloudflare Workers 静态资产，`wrangler.jsonc`，`pnpm exec wrangler deploy`，账号 ddff52d24ee44e21a021c15eaffcc86d；Pages 项目创建被 Cloudflare 拦截「Subdomain is blocked」，故用 Workers）
- 研究数据来源：https://github.com/wookat/frontend-libs-research （round1 §1、round4 §35–39 为组件库清单）

## 结构
- `docs/one-pager.md` 立项一页纸；`docs/page-spec.md` 8 页规格（所有库实现的契约）；`docs/libraries.json` 建库清单与状态
- `packages/spec` 契约 + mock 数据（框架无关）；`packages/icons-react` React 图标适配（lucide/tabler/phosphor/heroicons）
- `apps/<slug>` 每库一个独立应用（官方默认主题，原生框架）；`apps/shadcn-ui` 为参考模板；`apps/README.md` 复制说明
- `gallery/` Astro 画廊站（读 `dist/manifest.json` + `dist/shots/`）
- `tools/shoot/shoot.mjs` Playwright 截图矩阵；`tools/assemble.mjs` 组装 `dist/`
- `.devin/skills/ui-gallery-round/workflow.py` 动态工作流：build → review → fix → merge(串行) → deploy（各库「原生默认主题样板」）
- `.devin/skills/frontend-0to1-ai/` （副本，源为 company-os/skills/frontend-0to1-ai）：AI 前端从 0 到 1 八阶段 skill + `workflow.py`（Brief → IA/线框 → 令牌 → 高保真 → 地基 → 按稿实现 → 视觉 QA → 集成上线）；依据 https://github.com/wookat/frontend-libs-research/blob/main/docs/frontend-0to1-with-ai-2026.md

## 已知问题
- Playwright 固定 1.62.1、wrangler 4.127.1（minimumReleaseAge 策略，不得放宽）
- 非 React 框架的图标/字体切换允许标 n/a

## 进行中
- 第 1 轮 34 库（见 libraries.json round=1）由工作流推进；合并后需全量重截图再部署；续跑 run `wfr-594bde6cabe04eed854f119c06bc78b6`（修 24 库）未结束，不再追加轮次
- 老板判定当前页面「太粗糙」：根因是跳过了设计系统/真实内容/逐屏定稿。下一轮用 frontend-0to1-ai 工作流先出 Brief/令牌/高保真，再让各库按稿还原；现有 apps/* 仅作原生样板留档
