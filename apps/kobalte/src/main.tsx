import { ColorModeProvider, ColorModeScript } from "@kobalte/core/color-mode"
import { Toast } from "@kobalte/core/toast"
import { render } from "solid-js/web"
import App from "./App"
import "./index.css"
import { colorModeStorage, useUrlSettings } from "./theme"

useUrlSettings()

function ToastRegion() {
  return (
    <Toast.Region>
      <Toast.List />
    </Toast.Region>
  )
}

render(
  () => (
    <>
      <ColorModeScript storageKey="kobalte-color-mode" />
      <ColorModeProvider storageManager={colorModeStorage}>
        <App />
        <ToastRegion />
      </ColorModeProvider>
    </>
  ),
  document.getElementById("root")!,
)
