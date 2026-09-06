import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { FocusStyleManager, HotkeysProvider } from "@blueprintjs/core"
import { Icons } from "@blueprintjs/icons"
import "./index.css"
import App from "./App"
import { applyFont, applyTheme, resolveDark } from "./lib/settings"

FocusStyleManager.onlyShowFocusOnTabs()
applyTheme(resolveDark())
applyFont()

await Icons.loadAll()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HotkeysProvider>
      <App />
    </HotkeysProvider>
  </StrictMode>,
)
