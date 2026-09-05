import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { Provider } from "@/components/provider"
import { Toaster } from "@/components/toaster"

const params = new URLSearchParams(window.location.search)
// packages/icons-react reads ?icons=; accept ?icon= as an alias before the first render.
if (params.get("icon") && !params.get("icons")) {
  params.set("icons", params.get("icon")!)
  window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`)
}
const explicit = params.get("theme")
const defaultTheme = explicit === "dark" || explicit === "light" ? explicit : "system"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider defaultTheme={defaultTheme}>
      <App />
      <Toaster />
    </Provider>
  </StrictMode>
)
