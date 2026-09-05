# Radix Themes 参考应用

UI Gallery 的 Radix Themes（`@radix-ui/themes`）参考实现，React + Vite，basename `/apps/radix-themes`。

- 8 条路由与 `?theme=` / `?font=` / `?icons=`（兼容 `?icon=`）参数约定见 `docs/page-spec.md`。
- 使用 Radix Themes 官方默认主题（未设置 accentColor / grayColor / radius / scaling）。
- 默认图标为 `@radix-ui/react-icons`，可切换到 `@ui-gallery/icons-react` 的 lucide / tabler / phosphor / heroicons。
- 数据全部来自 `@ui-gallery/spec` 的 `mock/*.json`。

```bash
pnpm --filter radix-themes dev
pnpm --filter radix-themes lint && pnpm --filter radix-themes typecheck && pnpm --filter radix-themes build
```

`gallery.json` 由 `scripts/sync-gallery.mjs` 根据 `src/coverage.ts` 生成。
