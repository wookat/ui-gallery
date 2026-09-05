import "@fontsource-variable/geist"
import "@fontsource-variable/inter"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/style.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "./style.css"
import { createApp } from "vue"
import ElementPlus from "element-plus"
import App from "./App.vue"
import { router } from "./router"
import { applyUrlSettings } from "./lib/url-settings"

applyUrlSettings()
createApp(App).use(router).use(ElementPlus).mount("#app")
