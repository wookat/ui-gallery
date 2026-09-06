import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/apps/shadcn-vue/",
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
