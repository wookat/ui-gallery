import { ref } from "vue"

export type Theme = "light" | "dark"
export const FONTS: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

export const theme = ref<Theme>("light")

export function applyTheme(next: Theme) {
  theme.value = next
  document.documentElement.classList.toggle("dark", next === "dark")
  document.documentElement.classList.toggle("light", next === "light")
  if (next === "dark") document.body.setAttribute("arco-theme", "dark")
  else document.body.removeAttribute("arco-theme")
}

export function initSettings() {
  const params = new URLSearchParams(window.location.search)
  const explicit = params.get("theme")
  const dark = explicit === "dark" || (!explicit && window.matchMedia("(prefers-color-scheme: dark)").matches)
  applyTheme(dark ? "dark" : "light")
  const font = FONTS[params.get("font") ?? ""]
  document.documentElement.style.setProperty("--gallery-font", font ?? "var(--arco-default-font)")
}

export function toggleTheme(): Theme {
  const next: Theme = theme.value === "dark" ? "light" : "dark"
  applyTheme(next)
  const url = new URL(window.location.href)
  url.searchParams.set("theme", next)
  window.history.replaceState(null, "", url)
  return next
}
