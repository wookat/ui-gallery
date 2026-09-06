import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// 组装进 dist/apps/reference/（tools/assemble.mjs），因此固定 base。
export default defineConfig({
  base: "/apps/reference/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // 仓库根的令牌与 mock：只允许通过这两个别名引用，避免复制副本
      "@tokens": path.resolve(__dirname, "../../design"),
      "@mock": path.resolve(__dirname, "../../mock"),
    },
  },
  server: {
    fs: { allow: [path.resolve(__dirname, "../..")] },
  },
})
