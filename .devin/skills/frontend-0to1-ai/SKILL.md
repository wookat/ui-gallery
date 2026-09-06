---
name: frontend-0to1-ai
description: 用 AI 从 0 到 1 做前端产品的八步流程（Brief → 信息架构/线框 → 设计令牌 → 高保真稿 → 工程地基 → 按稿实现 → 视觉 QA → 集成上线）。当要新建一个前端产品/站点/后台，或现有前端"太粗糙"需要按正规设计流程重做时使用；配套 workflow.py 用 run_workflow 跑完整流水线。
---

# 用 AI 从 0 到 1 做前端（frontend-0to1-ai）

> 一句话：**先设计系统，后组件库；先可看的稿，后可跑的码；每一步都有独立审查和可执行的检查。**
> 组件库只解决"零件长什么样"，页面粗糙是因为缺了零件之上的三层：设计令牌 / 真实内容与信息架构 / 逐屏定稿。本 skill 把这三层做成前置阶段，任何前端项目都不允许跳过。

## 依据（一手来源，2026-09-06 实查，摘录见 wookat/frontend-libs-research `docs/frontend-0to1-with-ai-2026.md`）

| 步骤 | 来源原文（节选） |
|---|---|
| 先写清目标与上下文 | GitHub Copilot Spaces："Add the relevant code, a product specification, and any supporting materials"；github/spec-kit（Spec-Driven Development） |
| 先探索规划再写码 | Anthropic Claude Code best practices："Explore first, then plan, then code" |
| 先做可观察的界面 | v0 docs："Create high-fidelity UIs from your wireframes or mockups"；HN 实践："design the frontend first as pure HTML until happy with it" |
| 令牌是唯一事实源 | Material 3："Use design tokens instead of hardcoded values… a single source of truth"；Atlassian："Design tokens are the single source of truth" |
| 喂设计系统上下文 | Vercel："Working with Figma and custom design systems in v0"；Figma MCP："Get design context and code from your Figma designs" |
| 组件 → 页面小步迭代 | v0 blog："Start by focusing on individual components… Gradually build up to complete landing pages" |
| 可执行的检查 | Anthropic："Give Claude a check it can run: tests, a build, a screenshot to compare… iterates until the check passes" |
| Checkpoint 与 PR 收敛 | OpenAI Codex quickstart："creating Git checkpoints before and after each task"；Copilot coding agent 以 PR 交付 |
| 设计流程 | Google Design Sprint（Understand/Define/Sketch/Decide/Prototype/Validate）、Double Diamond、NN/g、Refactoring UI："Start with a feature, not a layout / Detail comes later" |

## 八步流程与门禁

每步 = 一个角色会话产出 + 一个**独立**审查会话（审改分离，SOP-10 §2）。产物全部落仓库 `docs/frontend/` 与 `design/`，用 git 作为 checkpoint。

| # | 阶段 | 角色（roles/） | 产物 | 通过门（必须可执行/可核验） |
|---|---|---|---|---|
| 0 | Brief | product/product-manager | `docs/frontend/00-brief.md`（模板 templates/brief.md）：目标用户、核心任务、屏幕清单（路由/目的/状态）、**真实内容**（禁止 lorem/随机数）、非目标、基础技术栈约束 | 屏幕清单每屏含 loading/empty/error；内容全部真实；审查员逐条核对 |
| 1 | IA + 线框 | design/ux-researcher | `docs/frontend/01-ia.md` + `design/wireframes/<screen>.html`（灰度、无色、无组件库，1440 与 375 各一份） | 每屏线框可在浏览器打开；层级/流程与 brief 一致；375 无横向滚动 |
| 2 | 设计令牌 | design/ui-designer | `design/tokens.json`（W3C DTCG 格式，模板 templates/tokens.json）+ 生成的 `design/tokens.css`：字阶（3–5 级）、8pt 间距、色板（1 主色 + 中性灰阶 + 语义色 + 暗色映射）、圆角/阴影/边框 | 所有正文/背景组合对比度 ≥4.5:1（脚本实测）；无硬编码色值 |
| 3 | 高保真稿 | design/ui-designer | `design/hifi/<screen>/index.html`（只用 tokens.css，全部状态，1440/375，亮/暗）+ `design/hifi/<screen>/ref/*.png` 基准截图 | 独立视觉审查：对齐/留白/层级/文案长度/热区 ≥40px；≤2 轮修 |
| 4 | 工程地基 | orchestrators/tech-lead | 选基座（无样式/低样式优先：Radix、Base UI、shadcn、Ark；或 brief 指定），把令牌注入主题（shadcn CSS 变量 / Tailwind `@theme`）；`docs/frontend/04-components.md` 组件映射表；`/kitchen-sink` 路由；`AGENTS.md`（模板 templates/ai-context.md）作为后续 AI 会话的设计系统上下文；文件式路由（新增屏幕 = 新增文件，避免注册表冲突） | lint/typecheck/build 绿；kitchen-sink 每个组件外观来自令牌而非库默认 |
| 5 | 按稿实现 | engineering/frontend-engineer（每屏 1 实例并行） | `src/pages/<screen>/`，仅读 mock 数据；实现全部状态、断点、亮暗；每屏产出「设计稿 vs 实现」并排图 | lint/typecheck/build；375 无溢出；0 console error |
| 6 | 视觉 QA | design/ui-designer（独立实例，非阶段 3/5 的会话） | 逐屏对照 `design/hifi/<screen>/ref` 与实现截图（pixelmatch 或并排肉眼），六项打分：布局骨架/间距/字阶/色彩/组件形态/交互反馈 | 全部 PASS；硬指标：无溢出、热区 ≥40px、对比度 ≥4.5:1、暗色无白块、0 console error；≤2 轮修 |
| 7 | 集成上线 | orchestrators/project-lead + legal-research/user-experience-officer + qa/qa-engineer | 串行合入集成分支 → 体验官走完整流程（含 375，`docs/frontend/07-ux-walkthrough.md`）‖ QA + 合规/安全审计（a11y、许可证、资产来源、secrets，`07-qa-audit.md`）→ 修 P0/P1 → 合 main → 部署 → `docs/handoff-context.md` | 两份报告无 P0/P1（CHARTER 四道把关）；本地全绿即合（公司规则：不依赖 CI） |

### 不允许的做法
- 跳过 0–3 直接"选组件库 + 让 AI 生成页面"。
- 用组件库默认主题当产品视觉（默认主题只用于「原生样板」对比，如 ui-gallery）。
- 假数据 / lorem ipsum / 随机数字进入任何设计稿或页面。
- 审与改为同一会话；未跑可执行检查就宣称"完成"。
- 复制竞品文案/图片/商标/未授权字体。

## 模板
- `templates/brief.md` — 阶段 0 Brief
- `templates/tokens.json` — 阶段 2 W3C DTCG 令牌骨架（值需按品牌重定，不照抄）
- `templates/ai-context.md` — 阶段 4 AGENTS.md / CLAUDE.md
- `templates/visual-qa.md` — 阶段 3/6 审查单

## 运行流水线

```bash
# 必填
export FE01_REPO_SLUG=wookat/<repo>          # 目标仓库（须已存在，main 可写）
export FE01_BRIEF_INPUT="<一段话或文件路径>"   # 老板/CEO 的需求原话，作为阶段 0 输入
# 可选
export FE01_BASE_BRANCH=main
export FE01_INTEGRATION_BRANCH=fe01/integration
export FE01_STACK_HINT="React 19 + Vite + Tailwind v4 + shadcn（无样式基座）"
export FE01_DEPLOY_CMD="pnpm exec wrangler deploy"   # 留空则不部署
export FE01_MAX_CONCURRENT=12                        # 组织并发上限 100，勿设太高
export FE01_MAX_SCREENS=12                           # 单轮最多屏数；更多屏分轮
export FE01_SKILL_URL=https://github.com/wookat/company-os/tree/main/skills/frontend-0to1-ai  # 子会话读模板的位置
```

会话数量：基础 12 个（阶段 0/1/2/4 各产出+审查，hifi-merge，ux/qa/release）+ 每屏 5 个（hifi、hifi-review、impl、impl-review、merge）+ 修复轮次；8 屏约 52 个。建议先用 `FE01_MAX_SCREENS=2` 在测试仓跑通。

环境变量也可写进 `~/.fe01/config.json`（同名 key；env 优先），run_workflow 不传 env 时从此读取。

```text
run_workflow(script_path="<company-os>/skills/frontend-0to1-ai/workflow.py", workflow_name="fe01-<repo>-r1")
```

- 断点续跑：同一 `run_id` 重跑即可，已完成阶段自动回放。
- 每阶段 prompt 内嵌上一阶段结构化输出（屏幕清单、令牌路径、分支名），不要手工粘贴。
- 429（组织并发上限）由 `run_agent()` 指数退避重试，不视为代码失败。

## 与其他 SOP 的关系
- SOP-01 阶段 2「ui-designer + ux-researcher 先出设计稿，前端照稿实现」= 本 skill 的 0–3 步细化。
- SOP-10 一比一对标：当存在主标尺竞品时，阶段 1–3 的线框/令牌/高保真以竞品逐屏图鉴为输入；本 skill 提供门禁与流水线。
- dept-design / dept-engineering / dept-qa-audit 提供角色；本 skill 只定义顺序、产物与门禁。
