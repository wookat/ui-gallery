import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { PrimeReactProvider } from "primereact/api"
import "./index.css"
import App, { applySettings } from "./App"

const params = new URLSearchParams(window.location.search)
if (params.get("icon") && !params.get("icons")) { params.set("icons", params.get("icon")!); history.replaceState(null, "", `${location.pathname}?${params.toString()}${location.hash}`) }
applySettings()
createRoot(document.getElementById("root")!).render(<StrictMode><PrimeReactProvider value={{ ripple: false }}><App /></PrimeReactProvider></StrictMode>)
