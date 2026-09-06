import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@arco-design/web-react/es/_util/react-19-adapter"
import "@arco-design/web-react/dist/css/arco.css"
import "@fontsource-variable/inter"
import "@fontsource-variable/geist"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/style.css"
import "./index.css"
import App from "./App.tsx"

// The shared icon adapter (@ui-gallery/icons-react) reads `?icons=`; accept `?icon=` as an alias.
const params = new URLSearchParams(window.location.search)
if (params.has("icon") && !params.has("icons")) {
  params.set("icons", params.get("icon")!)
  window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`)
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
