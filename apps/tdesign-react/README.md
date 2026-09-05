# TDesign React Gallery

## 运行

从仓库根目录执行：

```bash
pnpm --filter tdesign-react dev
```

应用基路径为 `/apps/tdesign-react/`，支持 `?theme=dark`、`?icons=lucide|tabler|phosphor|heroicons` 与 `?font=inter|geist|noto-sans-sc|lxgw-wenkai`。

`/components` 是 TDesign React 组件全集与合同组件的组合示例。`Resizable` 在 TDesign React 1.18.2 中没有原生拆分器，因此以 CSS resize 占位并在 coverage 标记为 `missing`；其它无法一一对应的模式使用 TDesign 组合组件实现。
