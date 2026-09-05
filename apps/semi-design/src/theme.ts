import { createContext, useContext } from "react"

export type ThemeMode = "light" | "dark"

export function initialTheme(): ThemeMode {
  const explicit = new URLSearchParams(window.location.search).get("theme")
  if (explicit === "dark" || explicit === "light") return explicit
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function applyTheme(mode: ThemeMode) {
  if (mode === "dark") document.body.setAttribute("theme-mode", "dark")
  else document.body.removeAttribute("theme-mode")
  document.documentElement.style.colorScheme = mode
}

export const ThemeContext = createContext<{ theme: ThemeMode; setTheme: (mode: ThemeMode) => void }>({ theme: "light", setTheme: () => {} })
export const useTheme = () => useContext(ThemeContext)
