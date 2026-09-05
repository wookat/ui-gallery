import { createApp } from "vue"
import PrimeVue from "primevue/config"
import Aura from "@primeuix/themes/aura"
import ToastService from "primevue/toastservice"
import ConfirmationService from "primevue/confirmationservice"
import Tooltip from "primevue/tooltip"
import Ripple from "primevue/ripple"
import "primeicons/primeicons.css"
import "@fontsource-variable/inter"
import "@fontsource-variable/geist"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/style.css"
import "./styles.css"
import App from "./App.vue"
import { router } from "./router"
import { applyUrlSettings } from "./settings"

applyUrlSettings()

createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: { prefix: "p", darkModeSelector: ".dark", cssLayer: false },
    },
    ripple: false,
  })
  .use(ToastService)
  .use(ConfirmationService)
  .use(router)
  .directive("tooltip", Tooltip)
  .directive("ripple", Ripple)
  .mount("#app")
