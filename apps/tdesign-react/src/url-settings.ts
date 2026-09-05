import { useEffect, useState } from "react"

export type ThemeMode = "light" | "dark"

const fonts: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

export function readTheme(): ThemeMode {
  const explicit = new URLSearchParams(window.location.search).get("theme")
  if (explicit === "dark" || explicit === "light") return explicit
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function applyTheme(mode: ThemeMode) {
  document.documentElement.setAttribute("theme-mode", mode)
  document.documentElement.style.colorScheme = mode
}

export function applyFont() {
  const font = fonts[new URLSearchParams(window.location.search).get("font") ?? ""]
  if (font) document.documentElement.style.setProperty("--td-font-family", font)
  else document.documentElement.style.removeProperty("--td-font-family")
}

export function useThemeMode() {
  const [theme, setThemeState] = useState<ThemeMode>(() => readTheme())
  useEffect(() => {
    applyTheme(theme)
  }, [theme])
  const setTheme = (next: ThemeMode) => {
    setThemeState(next)
    const url = new URL(window.location.href)
    url.searchParams.set("theme", next)
    window.history.replaceState(null, "", url)
  }
  return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") }
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)")
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])
  return isMobile
}
