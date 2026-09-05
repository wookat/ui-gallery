import { createApp } from "vue"
import TDesign from "tdesign-vue-next"
import "tdesign-vue-next/es/style/index.css"
import "@fontsource-variable/geist"
import "@fontsource-variable/inter"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/lxgwwenkaiscreen.css"
import "@/styles/app.css"
import App from "@/App.vue"
import { router } from "@/router"
import { applySettings } from "@/settings"

applySettings()
createApp(App).use(TDesign).use(router).mount("#app")
