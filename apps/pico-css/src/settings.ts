export type IconFamily = "lucide" | "tabler" | "phosphor" | "heroicons"
export type Theme = "light" | "dark"

export function applyUrlSettings(): { theme: Theme; icons: IconFamily } {
  const params = new URLSearchParams(window.location.search)
  const requestedTheme = params.get("theme")
  const theme: Theme = requestedTheme === "light" || requestedTheme === "dark"
    ? requestedTheme
    : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  document.documentElement.dataset.theme = theme

  const fonts: Record<string, string> = {
    inter: "'Inter Variable', sans-serif",
    geist: "'Geist Variable', sans-serif",
    "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
    "lxgw-wenkai": "'LXGW WenKai Screen', serif",
  }
  const font = params.get("font")
  if (font && fonts[font]) document.documentElement.style.setProperty("--pico-font-family", fonts[font])
  else document.documentElement.style.removeProperty("--pico-font-family")

  const requestedIcons = params.get("icons") ?? params.get("icon")
  const icons: IconFamily = requestedIcons === "tabler" || requestedIcons === "phosphor" || requestedIcons === "heroicons"
    ? requestedIcons
    : "lucide"
  return { theme, icons }
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}
