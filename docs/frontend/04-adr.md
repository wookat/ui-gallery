# 04 ADR：参考应用基座选择（阶段 4 工程地基）

> 阶段 4 产物（frontend-0to1-ai 步骤 4，角色 orchestrators/tech-lead）。输入：`docs/frontend/00-brief.md` §7 技术栈、`design/tokens.json` / `design/tokens.css`、`design/hifi/{login,dashboard}/index.html`（fe01/integration@19b9ec8）。
> 工程目录 `apps/reference/`；本文只记「为什么选这个基座、怎样注入令牌」，组件级映射见 `04-components.md`。

## 1. 决定

- **基座：shadcn/ui（radix-nova 风格，`radix-ui` 统一包）+ Tailwind v4**。shadcn 不是 npm 依赖而是拷进仓库的源码，因此我们**只保留其 Radix 行为层**（焦点管理、ARIA、键盘、Portal、受控/非受控），**外观全部按 hifi 重写**，令牌通过 `src/styles/theme.css` 一处注入 shadcn CSS 变量与 Tailwind `@theme`。
- 图表 Recharts（brief 指定），图标 lucide-react（ISC），字体仅 OFL：`@fontsource-variable/noto-sans-sc` + `@fontsource-variable/inter`（自托管，不走外部 CDN）。
- 路由 react-router v7，文件式：`src/pages/<id>/index.tsx` 由 `import.meta.glob` 自动注册。
- Playwright 固定 1.62.1（复用仓库 `tools/shoot` 已安装的包与 Chromium，`apps/reference` 不再装第二份）。

## 2. 备选与对照

判断口径：把 hifi 里出现的每种控件形态列出来，看**「保留库默认外观 → 改成 hifi 形态」需要覆盖多少东西**；覆盖越少、越不需要和库的私有 CSS 打架，成本越低。

| hifi 形态（来源 `design/hifi/*/index.html`） | shadcn/ui + Tailwind v4（选） | Radix Themes | Base UI / Ark UI / React Aria（纯无样式） | Mantine / MUI / Ant Design（有样式） |
| --- | --- | --- | --- | --- |
| `.btn`：高 `size.control.md`=40、`radius.md`、`typography.label`、primary/secondary/ghost 三种 + hover/active 用 `*-hover/*-active` 令牌 | 源码在仓库内，CVA 变体表直接写令牌类名；默认样式清零即可 | 变体名/色阶体系（accent scale 1–12）与我们的角色令牌不对应，需逐一映射 | 无外观，全部手写；行为层与 Radix 等价，但无现成 Sheet/Toast/Tooltip 组合 | 需覆盖主题 token + 组件 styleOverrides；`::before` 波纹/阴影等默认行为要关 |
| `.input` / `.field` / `.err`：40 高、`border-strong`、hover→`fg-muted`、focus→primary 描边、invalid 变粗 danger；密码「眼睛」放在输入框内 | 原生 `<input>` + 类名；Field 自组（label / description / error 用 aria-describedby） | TextField 有内建 slot，但 invalid/描边规则与 hifi 不同 | 手写 | InputAdornment/Affix 结构与 hifi DOM 不同，样式覆盖多 |
| `.card`：`surface` / hairline / `radius.lg` / `shadow.sm` / `space.6` 内距 | `<section>` + 类名 | Card 有自己的 variant 与 size 系统 | 手写 | Card 默认阴影/圆角需覆盖 |
| `.tag` 胶囊、`.count-badge`（18 高） | CVA 两套变体 | Badge 色阶不对应 | 手写 | 可用但尺寸需改 |
| `.tabs`（分段控件：`surface-muted` 槽，选中项 `surface` + `shadow.sm`，32 视觉高 + 40 热区） | Radix Tabs 行为 + 类名 | Tabs 是下划线式，改分段需覆盖 | 手写 | Segmented/ToggleButtonGroup 形态接近但 ARIA 不是 tablist |
| `.popover` / `.menu-item` / `.menu-head`、`.toast`、移动端侧栏抽屉、`[data-tip]` 无箭头 Tooltip | Radix Popover/DropdownMenu/Dialog(Sheet)/Tooltip + sonner；Portal、焦点、Esc 全现成 | 现成，但 Portal 层带自己的主题变量 | Portal 与定位需自己接 floating-ui | Popover/Message/Drawer 默认动效与 z-index 体系需覆盖 |
| `.stat` / `.state-card` / `.timeline` / `.task` / `.notif-item` / `.nav-item` / `.avatar`（姓名末字 + 色相） | 任何库都没有，一律自组（composed） | 同 | 同 | 同 |
| 暗色：`<html data-theme="dark">` 切换 tokens.css 变量 | `@theme inline reference` 直接指向 tokens 变量，无需 `dark:` 类 | 自带 appearance 机制，需要与 data-theme 同步 | 同 shadcn | 需 ThemeProvider 双份主题对象 |

结论：

1. **有样式库（Mantine / MUI / antd）成本最高**：形态本身接近，但每个组件都要「先关默认、再补令牌」，而且它们的主题对象是 JS 值，令牌只能二次映射；`design/tokens.css` 的亮/暗切换也要改成 provider 切换。
2. **纯无样式库（Base UI / Ark / React Aria）行为层等价，但组合件少**：Sheet、Toast、Tooltip 位置、命令菜单都要自己搭；hifi 里 8 种浮层全部要手写定位和动效。
3. **Radix Themes 介于两者**：色阶体系（1–12 step）与我们的角色令牌（bg / surface / fg / primary-soft …）不是一一映射，暗色需要与 `data-theme` 双向同步。
4. **shadcn/ui 成本最低**：它本来就是「复制源码 + 自己改类名」，我们只需保留 Radix 行为 + `data-slot` 结构，把所有 Tailwind 类替换成令牌派生的主题类；hifi 中出现的 8 种浮层全部有对应 Radix primitive。缺的 9 种业务组件（见上表最后一行）在任何库里都要自组，不构成差异。

## 3. 令牌注入方式（唯一入口 `apps/reference/src/styles/theme.css`）

```
design/tokens.json ──build-tokens.mjs──▶ design/tokens.css ──theme.css──▶ ① Tailwind @theme  ② shadcn CSS 变量  ③ 组件类名
```

- `@theme inline reference`：清空 Tailwind 默认调色板（`--color-*: initial`），只声明角色令牌别名（`--color-surface: var(--color-role-surface)` …）、字体角色（`text-role-label` 等）、尺寸（`h-control-md`、`size-hit`、`size-icon-md`…）、圆角、阴影、动效。`inline reference` 使工具类直接引用 tokens.css 变量，因此**亮/暗切换只靠 `<html data-theme>`**，组件代码里没有 `dark:`。
- shadcn 兼容变量（`--background` / `--primary` / `--ring` …）同样在 theme.css 中指向角色令牌，保证后续从 shadcn 注册表拷入新组件时开箱即是我们的颜色。
- 自定义变体：`hover` / `focus-visible` / `active` 额外匹配 `[data-demo~="hover|focus|active"]`，供 `/kitchen-sink` 与 `tools/shoot.mjs` 在不真实悬停时截到状态外观；`hit-area` 工具类用 `::before` 把 32px 视觉高的控件热区撑到 `size.hit`=40。
- 唯一允许的字面量是 `@theme` 里的断点（`@media` 无法读 CSS 变量），其值必须与 `tokens.json breakpoint` 一致；`tools/no-hardcode.mjs` 扫描 `src/`（排除 theme.css）拒绝任何色值 / px / 任意值 Tailwind 类。

## 4. 后果与约束

- shadcn 组件是仓库源码，**不再从注册表整包更新**；新增组件按 `04-components.md` 流程：拷入 → 删默认类 → 只用主题类 → 进 kitchen-sink 状态矩阵。
- `asChild` 分支必须只返回调用方的单个 child（Radix `Slot` 限制），Button 的 spinner / 计数角标只在非 `asChild` 时渲染。
- Recharts 颜色通过 `chart.1–5` 令牌变量传入，Tooltip 自绘（`ChartTip`）以对齐 hifi `.chart-tip`。
- 供应链：不放宽 `pnpm minimumReleaseAge`；`pixelmatch` / `pngjs` / `axe-core` 版本写死，Playwright 复用根 `tools/shoot`。
- 画廊首页暂不接入参考应用（brief §7 允许）；`apps/reference/gallery.json` 只提供 `slug: "reference"` 等必需字段供 `tools/assemble.mjs` 组装到 `dist/apps/reference/`。
