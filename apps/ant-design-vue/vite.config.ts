import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  base: "/apps/ant-design-vue/",
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/zrender")) return "zrender"
          if (id.includes("node_modules/echarts") || id.includes("node_modules/vue-echarts")) return "echarts"
          if (id.includes("node_modules/@ant-design/icons")) return "antd-icons"
          if (id.includes("node_modules/ant-design-vue") || id.includes("node_modules/@ant-design")) return "antd"
          if (id.includes("node_modules/lucide-vue-next") || id.includes("node_modules/@tabler") || id.includes("node_modules/@phosphor-icons") || id.includes("node_modules/@heroicons")) return "icons"
        },
      },
    },
  },
})
