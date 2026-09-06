import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  base: "/apps/element-plus/",
  plugins: [vue()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          echarts: ["echarts"],
          "element-plus": ["element-plus"],
          "icon-lucide": ["lucide-vue-next"],
          "icon-tabler": ["@tabler/icons-vue"],
          "icon-phosphor": ["@phosphor-icons/vue"],
          "icon-heroicons": ["@heroicons/vue"],
        },
      },
    },
  },
})
