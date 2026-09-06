import {
  createLocalStorageManager,
  type ColorMode,
} from "@kobalte/core/color-mode"

const storageKey = "kobalte-color-mode"
export const colorModeStorage = createLocalStorageManager(storageKey)

export function useUrlSettings() {
  const params = new URLSearchParams(window.location.search)
  const requestedTheme = params.get("theme")
  const theme: ColorMode =
    requestedTheme === "dark" || requestedTheme === "light"
      ? requestedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"

  if (requestedTheme === "dark" || requestedTheme === "light") {
    colorModeStorage.set(theme)
  }

  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.classList.toggle("light", theme === "light")

  const fonts: Record<string, string> = {
    inter: "'Inter Variable', sans-serif",
    geist: "'Geist Variable', sans-serif",
    "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
    "lxgw-wenkai": "'LXGW WenKai Screen', serif",
  }
  document.documentElement.style.setProperty(
    "--font-sans",
    fonts[params.get("font") ?? ""] ?? "ui-sans-serif, system-ui, sans-serif",
  )
}
