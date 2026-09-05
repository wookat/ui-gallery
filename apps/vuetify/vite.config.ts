import { fileURLToPath, URL } from "node:url"
import vue from "@vitejs/plugin-vue"
import vuetify from "vite-plugin-vuetify"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/apps/vuetify/",
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: { chunkSizeWarningLimit: 1500 },
})
