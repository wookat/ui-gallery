# AGENTS.md —— Acme Console 参考应用（`apps/reference/`）的设计系统上下文

> 给每个 AI 实现会话读。目的：拿到的是「我们的设计系统」，不是组件库默认值。
> 范围：本文约束 `apps/reference/`、`design/`、`content/`、`mock/`、`docs/frontend/`。`gallery/` 有自己的 `gallery/AGENTS.md`；其他 `apps/<库>/` 不在本轮范围，不要改。

## 事实源（按优先级）
1. `design/hifi/<screen>/index.html` 与 `design/hifi/<screen>/ref/*.png` —— 每屏定稿；实现以此为准，不自由发挥。`?state= / ?period= / ?open= / ?toast= / ?theme=` 的取值见各稿 `check.mjs`。
2. `design/tokens.json` →（`node design/build-tokens.mjs`）→ `design/tokens.css` —— 唯一允许的颜色 / 字号 / 间距 / 圆角 / 阴影 / 尺寸 / 动效来源。生成文件不手改。
3. `docs/frontend/04-components.md` —— 设计稿控件 ↔ 代码组件 + 变体 + 尺寸；缺的标 composed / todo。基座选型理由见 `docs/frontend/04-adr.md`。
4. `docs/frontend/00-brief.md` / `01-ia.md` —— 需求与信息架构；文案来自 `content/*.md`（`src/data/content.ts` 的 `t(key)`），数据来自 `mock/*.json`（`src/data/mock.ts`）。

## 硬规则
- 禁止硬编码色值 / 字号 / 间距 / 任意值 Tailwind 类（`bg-[#…]`、`w-[320px]`）；只用 `apps/reference/src/styles/theme.css` 暴露的主题类（`bg-surface`、`text-role-label`、`h-control-md`、`size-hit`、`rounded-md`、`shadow-sm` …）或 `var(--token)`。`node tools/no-hardcode.mjs` 会拒绝违规。
- 主题只在 `apps/reference/src/styles/theme.css` 一处从 tokens.css 注入（Tailwind `@theme` + shadcn CSS 变量）；不得在别处声明 `--primary` 等变量，不得写 `dark:` 类（亮暗由 `<html data-theme>` 切换令牌变量）。改外观 = 改 `design/tokens.json` 重新生成；实现阶段发现令牌问题写进 notes，不自行改令牌与 hifi。
- 新增屏幕 = 新增 `apps/reference/src/pages/<id>/index.tsx`（默认导出组件）+ 同目录 `shots.json`（截图状态表）；`src/app.tsx` 用 `import.meta.glob` 自动注册路由，不要改公共注册表。屏幕状态统一用 `useScreenState()` 读 URL 查询串。
- 组件先查 `04-components.md`：有就用；没有先从 shadcn 注册表拷入 `src/components/ui/`，删掉默认类、只用主题类、加进 `/kitchen-sink` 状态矩阵，再在映射表补一行。业务组合件放 `src/components/composed/`。
- 所有状态必做：loading / empty / error / success / disabled / hover / focus-visible；视口 375 / 768 / 1024 / 1440；亮 / 暗。任何可点击件实际热区 ≥ `size.hit`（40）；视觉高 32 的控件加 `hit-area`。
- 图标只用 `lucide-react`；字体只用仓库自托管 OFL（`@fontsource-variable/noto-sans-sc`、`@fontsource-variable/inter`）；不引入位图、商标、竞品文案。新增依赖前查 `package.json` 与根 `pnpm-workspace.yaml`：不放宽 `minimumReleaseAge`，遇 `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` 降版本。Playwright 固定 1.62.1，复用根 `tools/shoot`，不在 `apps/reference` 另装。
- 禁止 lorem ipsum / 随机数字 / 占位人名头像；数据只从 `mock/*.json` 读，文案只从 `content/*.md` 读。
- 不启用 GitHub Actions；验收 = 本地门禁全绿。

## 可执行检查（完成前必须全部跑过，在 `apps/reference/` 下）
```bash
pnpm lint && pnpm typecheck && pnpm build   # eslint + no-hardcode；tsc；tsc -b && vite build
node tools/shoot.mjs <screen> [--build]     # 1440×900 / 375×812 × 亮/暗 × shots.json 状态 → ../../shots/reference/<screen>/
node tools/compare.mjs <screen>             # 与 design/hifi/<screen>/ref 同名图 pixelmatch → 相似度表 + diff/*.png + compare.json（--threshold 0.95）
node tools/a11y.mjs <screen>                # axe-core WCAG 2A/AA：对比度、热区（elementFromPoint 实测 ≥ size.hit）、Tab 焦点环、375 scrollWidth、console error
node tools/no-hardcode.mjs                  # src/ 内禁止色值 / px / 任意值类（theme.css 除外）
```
仓库根：`pnpm lint && pnpm typecheck && pnpm build`（turbo 跑全部 workspace）；`node tools/assemble.mjs` 组装 `dist/apps/reference/`（需 `apps/reference/gallery.json`）。
375 下 `document.documentElement.scrollWidth <= 375`；console error = 0；`/kitchen-sink` 是组件外观基准，改组件后先看它。

## 分支与提交
- 集成分支 `fe01/integration`；每屏一个分支 `fe01/screen-<id>` 从它切出，完成后合回集成分支。不开 PR、不推 main（release 阶段除外）、不 force push。
- 显式列文件提交（不用 `git add .`）；`dist/`、`node_modules/`、`shots/**/*.png` 不入库，`design/hifi/*/ref/*.png` 允许。
- 宣称完成前实际运行上面的检查并把结果写进汇报。
