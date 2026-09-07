import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// 组装进 dist/apps/reference/（tools/assemble.mjs），因此固定 base。
export default defineConfig({
  base: "/apps/reference/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // 裸 `cn` → src/lib/utils.ts（带 text-role-* 分组的 createCn）；`cn/config` 等子路径不受影响
      { find: /^cn$/, replacement: path.resolve(__dirname, "./src/lib/utils.ts") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      // 仓库根的令牌与 mock：只允许通过这两个别名引用，避免复制副本
      { find: "@tokens", replacement: path.resolve(__dirname, "../../design") },
      { find: "@mock", replacement: path.resolve(__dirname, "../../mock") },
    ],
  },
  server: {
    fs: { allow: [path.resolve(__dirname, "../..")] },
  },
  build: {
    rolldownOptions: {
      output: {
        // 第三方按职责拆块（框架 / Radix 基座 / 图表），页面代码留在主包，避免单块超 500 kB 警告
        codeSplitting: {
          groups: [
            { name: "charts", test: /node_modules[\\/](recharts|victory-vendor|d3-)/ },
            { name: "radix", test: /node_modules[\\/]@?radix-ui/ },
            { name: "react", test: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/ },
          ],
        },
      },
    },
  },
})
