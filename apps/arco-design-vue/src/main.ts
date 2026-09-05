import { createApp } from "vue"
import ArcoVue from "@arco-design/web-vue"
import "@arco-design/web-vue/dist/arco.css"
import "@fontsource-variable/geist"
import "@fontsource-variable/inter"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/style.css"
import "./index.css"
import App from "./App.vue"
import { router } from "./router"
import { initSettings } from "./lib/settings"

initSettings()
createApp(App).use(ArcoVue).use(router).mount("#app")
