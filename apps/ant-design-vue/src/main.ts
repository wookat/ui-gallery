import { createApp } from "vue"
import Antd from "ant-design-vue"
import "ant-design-vue/dist/reset.css"
import "@fontsource-variable/inter"
import "@fontsource-variable/geist"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/style.css"
import "./style.css"
import App from "./App.vue"
import router from "./router"

createApp(App).use(Antd).use(router).mount("#app")
