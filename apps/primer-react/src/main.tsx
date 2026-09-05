import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@primer/primitives/dist/css/primitives.css"
import "@primer/primitives/dist/css/functional/themes/light.css"
import "@primer/primitives/dist/css/functional/themes/dark.css"
import "@fontsource-variable/inter"
import "@fontsource-variable/geist"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/lxgwwenkaiscreen.css"
import "./index.css"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
