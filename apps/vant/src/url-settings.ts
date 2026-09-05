import { reactive } from "vue"

export type Theme = "dark" | "light"
export type IconSet = "native" | "lucide" | "tabler" | "phosphor" | "heroicons"

const params = new URLSearchParams(window.location.search)
const explicitTheme = params.get("theme")
const initialTheme: Theme = explicitTheme === "dark" || (!explicitTheme && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"
const fontFamilies: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}
const requestedIcon = params.get("icon") ?? params.get("icons")

export const urlSettings = reactive({
  theme: initialTheme,
  font: params.get("font") ?? "default",
  iconSet: (["native", "lucide", "tabler", "phosphor", "heroicons"].includes(requestedIcon ?? "") ? requestedIcon : "native") as IconSet,
})

export function applyUrlSettings(): void {
  document.documentElement.classList.toggle("dark", urlSettings.theme === "dark")
  document.documentElement.classList.toggle("light", urlSettings.theme === "light")
  const family = fontFamilies[urlSettings.font]
  if (family) document.documentElement.style.setProperty("--van-base-font", family)
  else document.documentElement.style.removeProperty("--van-base-font")
}

export function toggleTheme(): void {
  urlSettings.theme = urlSettings.theme === "dark" ? "light" : "dark"
  applyUrlSettings()
}
