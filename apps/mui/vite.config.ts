import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/apps/mui/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("@mui/icons-material")) return "icons"
          if (
            id.includes("@mui/x-charts") ||
            id.includes("@mui/x-data-grid") ||
            id.includes("@mui/x-date-pickers") ||
            id.includes("@mui/x-tree-view")
          )
            return "mui-x"
          if (
            id.includes("@mui/material") ||
            id.includes("@emotion/react") ||
            id.includes("@emotion/styled")
          )
            return "mui"
          return undefined
        },
      },
    },
  },
})
