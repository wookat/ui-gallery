import { ref, type Ref } from "vue"
import { currentIconSet, type IconSet } from "@/icons"

const iconSet = ref<IconSet>(currentIconSet())
export function useIconSet(): Ref<IconSet> {
  return iconSet
}

export type FontKey = "default" | "inter" | "geist" | "noto-sans-sc" | "lxgw-wenkai"
const fonts: Record<FontKey, string> = {
  default: "Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif",
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

export function readUrlTheme(): "light" | "dark" {
  const explicit = new URLSearchParams(window.location.search).get("theme")
  if (explicit === "dark" || explicit === "light") return explicit
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function applyUrlFont() {
  const key = (new URLSearchParams(window.location.search).get("font") ?? "default") as FontKey
  const family = fonts[key] ?? fonts.default
  document.documentElement.style.setProperty("--app-font", family)
}
