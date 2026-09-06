import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"

// 兼容 ?icon= 与 ?icons= 两种写法：@ui-gallery/icons-react 只读 icons
const params = new URLSearchParams(window.location.search)
if (params.get("icon") && !params.get("icons")) {
  params.set("icons", params.get("icon")!)
  window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`)
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
