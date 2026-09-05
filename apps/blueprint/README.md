# Acme Console · Blueprint

`apps/blueprint` 是 UI Gallery 的 Blueprint（`@blueprintjs/core` 6）参考应用，
遵循 `docs/page-spec.md` 的 8 路由契约，所有数据来自 `@ui-gallery/spec/mock/*.json`。

- 主题：Blueprint 官方亮/暗色（`Classes.DARK`），`?theme=light|dark`
- 图标：默认 Blueprint 原生图标（`nativeIcons: true`），`?icons=lucide|tabler|phosphor|heroicons` 切换到 `@ui-gallery/icons-react`
- 字体：默认 Blueprint 系统字体栈，`?font=inter|geist|noto-sans-sc|lxgw-wenkai`
- 图表：Recharts（external）
