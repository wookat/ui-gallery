import { applyMode, Mode } from "@cloudscape-design/global-styles"
import { applyTheme } from "@cloudscape-design/components/theming"

export type IconFamily = "native" | "lucide" | "tabler" | "phosphor" | "heroicons"

const FONTS: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

export function readParams() {
  return new URLSearchParams(window.location.search)
}

export function isDarkFromUrl() {
  const explicit = readParams().get("theme")
  if (explicit === "dark") return true
  if (explicit === "light") return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function iconFamilyFromUrl(): IconFamily {
  const params = readParams()
  const raw = params.get("icons") ?? params.get("icon") ?? "native"
  if (raw === "lucide" || raw === "tabler" || raw === "phosphor" || raw === "heroicons") return raw
  return "native"
}

export function applyUrlSettings() {
  applyMode(isDarkFromUrl() ? Mode.Dark : Mode.Light)
  const font = FONTS[readParams().get("font") ?? ""]
  if (font) {
    applyTheme({ theme: { tokens: { fontFamilyBase: font } } })
  }
}

export function toggleThemeInUrl() {
  const params = readParams()
  params.set("theme", isDarkFromUrl() ? "light" : "dark")
  const url = `${window.location.pathname}?${params.toString()}`
  window.history.replaceState(null, "", url)
  applyMode(isDarkFromUrl() ? Mode.Dark : Mode.Light)
}
