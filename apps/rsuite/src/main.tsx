import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "rsuite/dist/rsuite.min.css"
import "@fontsource-variable/geist"
import "@fontsource-variable/inter"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/style.css"
import "./index.css"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>)
