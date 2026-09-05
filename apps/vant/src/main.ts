import "@vant/touch-emulator"
import "@fontsource-variable/geist"
import "@fontsource-variable/inter"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont"
import { createApp } from "vue"
import Vant from "vant"
import "vant/lib/index.css"
import App from "./App.vue"
import { router } from "./router"
import "./style.css"
import { applyUrlSettings } from "./url-settings"

applyUrlSettings()
createApp(App).use(router).use(Vant).mount("#app")
