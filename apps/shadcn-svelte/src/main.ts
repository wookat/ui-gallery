import { mount } from "svelte"
import App from "./App.svelte"
import "./app.css"
import { applyUrlSettings } from "$lib/settings"

applyUrlSettings()
mount(App, { target: document.getElementById("app")! })
