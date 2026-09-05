# HeroUI · UI Gallery 参考应用

基于 [HeroUI v3](https://github.com/heroui-inc/heroui)（`@heroui/react` + `@heroui/styles`，React 19 + Tailwind CSS v4 + React Aria）实现的 Acme Console 参考应用。

## 初始化方式

按 HeroUI 官方 quick-start 手工初始化（Vite + React）：

```css
@import "tailwindcss";
@import "@heroui/styles";
```

使用官方默认主题，不自定义配色 token；暗色模式按官方约定在 `<html>` 上切换 `.dark` / `.light`。

## 约定

- 路由：`/login` `/` `/orders` `/form` `/settings` `/components` `/landing` `/chat`，basename `/apps/heroui`
- `?theme=light|dark`（默认跟随系统）
- `?font=default|inter|geist|noto-sans-sc|lxgw-wenkai`（仓库自托管 OFL 字体）
- `?icon=` / `?icons=` `lucide|tabler|phosphor|heroicons`（HeroUI 无自带图标库，走 `@ui-gallery/icons-react`）
- 所有数据来自 `@ui-gallery/spec/mock/*.json`

## 脚本

```bash
pnpm --filter heroui dev
pnpm --filter heroui lint
pnpm --filter heroui typecheck
pnpm --filter heroui build
pnpm --filter heroui sync-gallery   # 由 src/coverage.ts 生成 gallery.json.coverage
```
