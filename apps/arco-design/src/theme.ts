import { createContext, useCallback, useContext, useEffect, useState } from "react"

export type Theme = "light" | "dark"

const fonts: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

export function applyTheme(theme: Theme) {
  if (theme === "dark") document.body.setAttribute("arco-theme", "dark")
  else document.body.removeAttribute("arco-theme")
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
}

export function initialTheme(): Theme {
  const explicit = new URLSearchParams(window.location.search).get("theme")
  if (explicit === "dark" || explicit === "light") return explicit
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function applyFont() {
  const font = new URLSearchParams(window.location.search).get("font") ?? "default"
  const family = fonts[font]
  if (family) {
    document.documentElement.style.setProperty("--gallery-font", family)
    document.documentElement.classList.add("gallery-font")
  } else {
    document.documentElement.style.removeProperty("--gallery-font")
    document.documentElement.classList.remove("gallery-font")
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => initialTheme())
  useEffect(() => {
    applyTheme(theme)
  }, [theme])
  useEffect(() => {
    applyFont()
  }, [])
  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    const params = new URLSearchParams(window.location.search)
    params.set("theme", next)
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`)
  }, [])
  return { theme, setTheme, toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark") }
}

export type ThemeState = ReturnType<typeof useTheme>

export const ThemeContext = createContext<ThemeState>({ theme: "light", setTheme: () => {}, toggleTheme: () => {} })

export function useThemeContext() {
  return useContext(ThemeContext)
}
