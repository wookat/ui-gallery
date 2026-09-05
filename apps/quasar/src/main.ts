import "@quasar/extras/material-icons/material-icons.css"
import "quasar/src/css/index.sass"
import { createApp } from "vue"
import { Dialog, Dark, Loading, Notify, Quasar } from "quasar"
import App from "./App.vue"
import router from "./router"
import "./styles.css"

createApp(App)
  .use(Quasar, { plugins: { Dialog, Dark, Loading, Notify } })
  .use(router)
  .mount("#app")
