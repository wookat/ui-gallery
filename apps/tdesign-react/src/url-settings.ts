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

function readTokens(names: readonly string[]) {
  const style = getComputedStyle(document.documentElement)
  return Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()]))
}

export function useThemeTokens(names: readonly string[]) {
  const key = names.join("|")
  const [tokens, setTokens] = useState<Record<string, string>>({})
  useEffect(() => {
    const update = () => setTokens(readTokens(key.split("|")))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["theme-mode"] })
    return () => observer.disconnect()
  }, [key])
  return tokens
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
