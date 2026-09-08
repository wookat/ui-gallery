import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

/**
 * 客户端路由落盘：静态托管（wrangler.jsonc `not_found_handling: "none"`）不回退 SPA 入口，
 * 所以为 src/pages/<id>/index.tsx 的每条非根路由再落一份 dist/<route>/index.html（`export const path` 可覆盖路径，与 src/app.tsx 同一约定），
 * 配合 `html_handling: "auto-trailing-slash"`，/apps/reference/login → 307 → /apps/reference/login/ → 200。
 */
function spaRoutes(): Plugin {
  const pagesDir = path.resolve(__dirname, "./src/pages")
  let outDir = "dist"
  return {
    name: "reference:spa-routes",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const entry = path.join(outDir, "index.html")
      if (!existsSync(entry)) return
      for (const dir of readdirSync(pagesDir, { withFileTypes: true })) {
        const file = path.join(pagesDir, dir.name, "index.tsx")
        if (!dir.isDirectory() || !existsSync(file)) continue
        const route = readFileSync(file, "utf8").match(/^export const path = "([^"]+)"/m)?.[1] ?? `/${dir.name}`
        if (route === "/") continue
        const target = path.join(outDir, ...route.split("/").filter(Boolean))
        mkdirSync(target, { recursive: true })
        copyFileSync(entry, path.join(target, "index.html"))
      }
    },
  }
}

// 组装进 dist/apps/reference/（tools/assemble.mjs），因此固定 base。
export default defineConfig({
  base: "/apps/reference/",
  plugins: [react(), tailwindcss(), spaRoutes()],
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
