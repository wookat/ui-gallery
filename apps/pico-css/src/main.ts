import "@picocss/pico/css/pico.min.css"
import "@fontsource-variable/inter"
import "@fontsource-variable/geist"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/style.css"
import "./styles.css"
import { setIconFamily } from "./icons"
import { applyUrlSettings } from "./settings"
import { startRouter } from "./router"

const settings = applyUrlSettings()
setIconFamily(settings.icons)
startRouter()
