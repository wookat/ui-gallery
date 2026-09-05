import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@radix-ui/themes/styles.css"
import "@fontsource-variable/inter"
import "@fontsource-variable/geist"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/style.css"
import "./index.css"
import App from "./App"
import { ThemeProvider } from "./theme-provider"
import { ToastProvider } from "./toast"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
