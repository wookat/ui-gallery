import { mount } from "svelte"
import "./app.css"
import App from "./App.svelte"
import { applyUrlSettings } from "./lib/settings"

applyUrlSettings()

const app = mount(App, { target: document.getElementById("app")! })

export default app
