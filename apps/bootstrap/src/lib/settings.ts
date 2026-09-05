import type { IconFamily } from "./icon-map"

export const BASENAME = "/apps/bootstrap"

const FONTS: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

export const params = () => new URLSearchParams(window.location.search)

export function iconFamily(): IconFamily {
  const v = params().get("icons") ?? params().get("icon") ?? "native"
  if (v === "lucide" || v === "tabler" || v === "phosphor" || v === "heroicons") return v
  return "bootstrap"
}

export function isDark(): boolean {
  return document.documentElement.getAttribute("data-bs-theme") === "dark"
}

export function setTheme(theme: "light" | "dark") {
  document.documentElement.setAttribute("data-bs-theme", theme)
  const url = new URL(window.location.href)
  url.searchParams.set("theme", theme)
  window.history.replaceState(null, "", url)
}

export function applyUrlSettings() {
  const p = params()
  const explicit = p.get("theme")
  const dark = explicit === "dark" || (!explicit && window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.setAttribute("data-bs-theme", dark ? "dark" : "light")
  const font = FONTS[p.get("font") ?? ""]
  if (font) document.documentElement.style.setProperty("--bs-font-sans-serif", font)
  else document.documentElement.style.removeProperty("--bs-font-sans-serif")
}
