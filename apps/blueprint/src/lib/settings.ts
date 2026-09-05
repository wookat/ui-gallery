import { Classes } from "@blueprintjs/core"

export type IconFamily = "native" | "lucide" | "tabler" | "phosphor" | "heroicons"

const FONTS: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

export function params() {
  return new URLSearchParams(typeof window === "undefined" ? "" : window.location.search)
}

export function iconFamily(): IconFamily {
  const value = params().get("icons") ?? params().get("icon")
  return value === "lucide" || value === "tabler" || value === "phosphor" || value === "heroicons" ? value : "native"
}

export function resolveDark(): boolean {
  const explicit = params().get("theme")
  if (explicit === "dark") return true
  if (explicit === "light") return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle(Classes.DARK, dark)
  document.body.classList.toggle(Classes.DARK, dark)
  document.documentElement.style.colorScheme = dark ? "dark" : "light"
}

export function applyFont() {
  const font = FONTS[params().get("font") ?? ""]
  if (font) document.documentElement.style.setProperty("--font-sans", font)
  else document.documentElement.style.removeProperty("--font-sans")
}

/** Keep theme/icons/font params when navigating between routes. */
export function withParams(path: string) {
  const search = params().toString()
  return search ? `${path}?${search}` : path
}
