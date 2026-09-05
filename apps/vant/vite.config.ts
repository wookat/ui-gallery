import path from "node:path"
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/apps/vant/",
  plugins: [vue()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
})
