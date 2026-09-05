import { createApp } from "vue"
import "@fontsource-variable/geist"
import "@fontsource-variable/inter"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/style.css"
import "./styles.css"
import App from "./App.vue"
import { router } from "./router"
import { vuetify } from "./plugins/vuetify"
import { applyUrlFont } from "./composables/settings"

applyUrlFont()
createApp(App).use(router).use(vuetify).mount("#app")
