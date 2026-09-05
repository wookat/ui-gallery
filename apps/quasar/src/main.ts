import "@quasar/extras/material-icons/material-icons.css"
import "quasar/src/css/index.sass"
import { createApp } from "vue"
import { BottomSheet, Dialog, Dark, Loading, Notify, Quasar } from "quasar"
import App from "./App.vue"
import router from "./router"
import "./styles.css"

const theme = new URLSearchParams(window.location.search).get("theme")
const app = createApp(App)
  .use(Quasar, { plugins: { BottomSheet, Dialog, Dark, Loading, Notify } })
Dark.set(theme === "dark" ? true : theme === "light" ? false : "auto")
app.use(router).mount("#app")
