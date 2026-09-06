import { reactive } from "vue"
import { iconSets, type IconSet } from "@/icons"

export type Theme = "light" | "dark"
export type Font = "default" | "inter" | "geist" | "noto-sans-sc" | "lxgw-wenkai"

const fontFamilies: Record<Font, string | null> = {
  default: null,
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

const params = new URLSearchParams(window.location.search)
const explicitTheme = params.get("theme")
const iconParam = params.get("icons") ?? params.get("icon")

export const settings = reactive({
  theme: (explicitTheme === "dark" || explicitTheme === "light"
    ? explicitTheme
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light") as Theme,
  font: ((params.get("font") ?? "default") in fontFamilies ? (params.get("font") ?? "default") : "default") as Font,
  icons: (iconSets.includes(iconParam as IconSet) ? iconParam : "native") as IconSet,
})

export function applySettings() {
  const root = document.documentElement
  if (settings.theme === "dark") root.setAttribute("theme-mode", "dark")
  else root.removeAttribute("theme-mode")
  root.style.colorScheme = settings.theme
  const family = fontFamilies[settings.font]
  if (family) { root.style.setProperty("--td-font-family", family); root.style.setProperty("--td-font-family-medium", family) }
  else { root.style.removeProperty("--td-font-family"); root.style.removeProperty("--td-font-family-medium") }
}

export function toggleTheme() {
  settings.theme = settings.theme === "dark" ? "light" : "dark"
  applySettings()
  const next = new URLSearchParams(window.location.search)
  next.set("theme", settings.theme)
  history.replaceState(null, "", `${window.location.pathname}?${next.toString()}`)
}
