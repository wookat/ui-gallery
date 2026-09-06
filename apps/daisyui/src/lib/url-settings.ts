import { useEffect, useState } from "react"

export type Theme = "light" | "dark"

const FONTS: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

const DEFAULT_FONT = "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"

export function readTheme(): Theme {
  const explicit = new URLSearchParams(window.location.search).get("theme")
  if (explicit === "dark" || explicit === "light") return explicit
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

// `?icon=` is the spec alias for `?icons=` consumed by @ui-gallery/icons-react.
// Must run before the first render because the icon adapter reads the URL synchronously.
export function normalizeIconParam() {
  const params = new URLSearchParams(window.location.search)
  const alias = params.get("icon")
  if (alias && !params.get("icons")) {
    params.set("icons", alias)
    params.delete("icon")
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`)
  }
}

export function useUrlSettings() {
  const [theme, setThemeState] = useState<Theme>(() => readTheme())
  useEffect(() => {
    const font = new URLSearchParams(window.location.search).get("font") ?? "default"
    document.documentElement.style.setProperty("--app-font", FONTS[font] ?? DEFAULT_FONT)
  }, [])
  useEffect(() => {
    applyTheme(theme)
  }, [theme])
  const setTheme = (next: Theme) => {
    setThemeState(next)
    const params = new URLSearchParams(window.location.search)
    params.set("theme", next)
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`)
  }
  return { theme, setTheme }
}
