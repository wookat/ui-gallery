import { createApp } from "vue"
import "@fontsource-variable/geist"
import "@fontsource-variable/inter"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/lxgwwenkaiscreen.css"
import "./styles.css"
import App from "./App.vue"
import { router } from "./router"

createApp(App).use(router).mount("#app")
