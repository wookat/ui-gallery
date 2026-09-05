export type IconFamily = "lucide" | "tabler" | "phosphor" | "heroicons"

const FONTS: Record<string, string> = {
  default: "system-ui, sans-serif",
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

export function params(): URLSearchParams {
  return new URLSearchParams(window.location.search)
}

export function isDark(): boolean {
  return document.documentElement.classList.contains("dark")
}

export function setDark(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark)
  document.documentElement.classList.toggle("light", !dark)
}

export function iconFamily(): IconFamily {
  const value = params().get("icons") ?? params().get("icon")
  return value === "tabler" || value === "phosphor" || value === "heroicons" ? value : "lucide"
}

export function applyUrlSettings() {
  const p = params()
  const explicit = p.get("theme")
  const dark = explicit === "dark" || (!explicit && window.matchMedia("(prefers-color-scheme: dark)").matches)
  setDark(dark)
  const font = FONTS[p.get("font") ?? "default"] ?? FONTS.default
  document.documentElement.style.setProperty("--typo-base--font-family", font)
}
