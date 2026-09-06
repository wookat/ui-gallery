# Quasar

这是基于 Vue 3、Vite 与 Quasar 2 的 Acme Console 适配器，使用 Quasar 官方默认主题和 Material Icons。数据全部来自 `@ui-gallery/spec/mock/*.json`。

支持的 URL 参数：

- `?theme=light|dark`：切换亮色或暗色主题；不传时跟随系统。
- `?icons=native|lucide|tabler|phosphor|heroicons`（也支持 `?icon=`）：切换图标集。
- `?font=default|inter|geist|noto-sans-sc|lxgw-wenkai`：切换字体。
- `?state=loading|empty|error`：查看页面状态。

质量门（复审重跑，2026-09-06）：`lint` / `typecheck` / `build` / 根 `pnpm build` 全部通过；`node tools/shoot/shoot.mjs quasar` 产出 36 张截图；8 路由 × 亮/暗在 375×812 下 `scrollWidth=375` 无横向溢出；16 次页面加载 0 console error / pageerror。
