import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/apps/semi-design/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("@douyinfe/semi-ui") || id.includes("@douyinfe/semi-icons") || id.includes("@douyinfe/semi-illustrations")) return "semi"
          if (id.includes("recharts")) return "charts"
          if (id.includes("react-markdown") || id.includes("remark-gfm")) return "markdown"
          return undefined
        },
      },
    },
  },
})
