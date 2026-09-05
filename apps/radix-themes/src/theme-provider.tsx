import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { Theme } from "@radix-ui/themes"

export type Appearance = "light" | "dark"
type ThemeContextValue = { appearance: Appearance; toggle: () => void }
const ThemeContext = createContext<ThemeContextValue | null>(null)

function initialAppearance(): Appearance {
  const value = new URLSearchParams(window.location.search).get("theme")
  if (value === "dark" || value === "light") return value
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearance] = useState<Appearance>(initialAppearance)
  const [font, setFont] = useState(() => new URLSearchParams(window.location.search).get("font"))

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", appearance === "dark")
    root.classList.toggle("light", appearance === "light")
    if (font && ["inter", "geist", "noto-sans-sc", "lxgw-wenkai"].includes(font)) {
      root.dataset.font = font
    } else {
      delete root.dataset.font
    }
    const params = new URLSearchParams(window.location.search)
    const icon = params.get("icon")
    if (icon && !params.get("icons")) {
      params.set("icons", icon)
      window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`)
    }
  }, [appearance, font])

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search)
      const next = params.get("theme")
      setAppearance(next === "dark" || next === "light" ? next : initialAppearance())
      setFont(params.get("font"))
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  const toggle = useCallback(() => {
    const next = appearance === "dark" ? "light" : "dark"
    setAppearance(next)
    const params = new URLSearchParams(window.location.search)
    params.set("theme", next)
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`)
  }, [appearance])

  return (
    <ThemeContext.Provider value={{ appearance, toggle }}>
      <Theme appearance={appearance}>{children}</Theme>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error("useTheme must be used inside ThemeProvider")
  return value
}
