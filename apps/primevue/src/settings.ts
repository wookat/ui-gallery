export type IconFamily = "native" | "lucide" | "tabler" | "phosphor" | "heroicons"

const params = () =>
  typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search)

export function iconFamily(): IconFamily {
  const p = params()
  const value = p.get("icons") ?? p.get("icon")
  return value === "lucide" || value === "tabler" || value === "phosphor" || value === "heroicons"
    ? value
    : "native"
}

export function isDark(): boolean {
  const explicit = params().get("theme")
  if (explicit === "dark") return true
  if (explicit === "light") return false
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
}

const fonts: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

export function applyUrlSettings() {
  const dark = isDark()
  const root = document.documentElement
  root.classList.toggle("dark", dark)
  root.classList.toggle("light", !dark)
  root.style.colorScheme = dark ? "dark" : "light"
  const font = fonts[params().get("font") ?? ""]
  if (font) root.style.setProperty("--font-sans", font)
  else root.style.removeProperty("--font-sans")
  root.dataset.icons = iconFamily()
}

export function toggleTheme() {
  const dark = !document.documentElement.classList.contains("dark")
  const url = new URL(window.location.href)
  url.searchParams.set("theme", dark ? "dark" : "light")
  window.history.replaceState(null, "", url)
  applyUrlSettings()
}
