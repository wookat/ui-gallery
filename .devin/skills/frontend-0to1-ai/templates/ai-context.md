# AGENTS.md（阶段 4 产物模板；同内容可复制为 CLAUDE.md / .cursor/rules）

> 给后续每个 AI 实现会话读的设计系统上下文。目的：让 AI 拿到的是「我们的设计系统」而不是「组件库默认值」。

## 事实源（按优先级）
1. `design/hifi/<screen>/index.html` 与 `ref/*.png` —— 每屏的定稿；实现以此为准，不自由发挥。
2. `design/tokens.json` → 生成 `src/styles/tokens.css` —— 唯一允许的颜色/字号/间距/圆角/阴影来源。
3. `docs/frontend/04-components.md` —— 组件映射表：设计稿中的每种控件 ↔ 代码组件与变体。
4. `docs/frontend/00-brief.md` / `01-ia.md` —— 需求与信息架构；内容来自 `content/` 与 `mock/`。

## 硬规则
- 禁止硬编码色值/字号/间距；只用 token 变量或由 token 生成的 Tailwind 主题类。
- 禁止改组件库默认主题以外的方式"调色"：主题只在 `src/styles/theme.css` 一处从 token 注入。
- 新增屏幕 = 新增 `src/pages/<id>/` 目录（文件式路由自动发现），不要改公共注册表。
- 所有状态必做：loading / empty / error / success / disabled / hover / focus-visible；断点 375 / 768 / 1024 / 1440；亮/暗。
- 图标只用 `<图标库>`；字体只用仓库自托管 OFL 字体；不引入新依赖前先查 `package.json` 与 `pnpm-workspace.yaml` 的策略（minimumReleaseAge 不放宽）。
- 数据只从 `mock/*.json` 读；不要编造文案。

## 可执行检查（完成前必须全部跑过）
```bash
pnpm lint && pnpm typecheck && pnpm build
node tools/shoot.mjs <screen>          # 产出 shots/<screen>/{desktop,mobile}-{light,dark}.png
node tools/compare.mjs <screen>        # 与 design/hifi/<screen>/ref 对比，输出 diff 与相似度
node tools/a11y.mjs <screen>           # axe-core：对比度、热区、焦点
```
375px 下 `document.documentElement.scrollWidth <= 375`；console error = 0。

## 提交
- 每屏一个分支 `fe01/screen-<id>`，从 `<集成分支>` 切出；不开 PR，不推 main；commit 前后各一次 checkpoint。
