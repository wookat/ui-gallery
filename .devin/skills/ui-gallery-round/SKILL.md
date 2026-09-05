---
name: ui-gallery-round
description: 用动态工作流为 docs/libraries.json 中某一轮（round=N）的每个 UI 组件库并行建库→独立视觉审查→修复→串行合入 main 并部署 ui.zalize.com。用 run_workflow 运行 workflow.py（环境变量 UI_GALLERY_ROUND 选轮次，默认 1）。
---

# UI Gallery 建库轮次工作流

- 输入：`docs/libraries.json` 中 `round == UI_GALLERY_ROUND` 的库。
- 每库流水线：build（lib/<slug> 分支）→ review（只审不改，SOP-10）→ fix（最多 2 轮）→ merge（进程内锁串行合 main，重装 lockfile，全量 build/shoot/assemble，wrangler 部署）。
- 运行：`run_workflow(script_path=".devin/skills/ui-gallery-round/workflow.py", workflow_name="ui-gallery-round-N")`；超时或中断后带 `run_id` 重跑即可续跑。
- 新增一轮：在 libraries.json 给新库填 `round: N+1`，导出 `UI_GALLERY_ROUND=N+1` 再运行。
- 前提：main 上已有 apps/shadcn-ui 参考实现与 apps/README.md 模板。
