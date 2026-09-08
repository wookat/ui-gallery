import * as React from "react"

export type Theme = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  resolved: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggle: () => void
}

const STORAGE_KEY = "theme"
const QUERY = "(prefers-color-scheme: dark)"
const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

const isResolved = (v: string | null): v is ResolvedTheme => v === "light" || v === "dark"
const systemTheme = (): ResolvedTheme => (window.matchMedia(QUERY).matches ? "dark" : "light")

/** 初始主题：?theme= > localStorage > system。index.html 内联脚本已在首帧前写入 data-theme，此处只需保持一致。 */
function initialTheme(): Theme {
  const q = new URLSearchParams(window.location.search).get("theme")
  if (isResolved(q)) return q
  const stored = localStorage.getItem(STORAGE_KEY)
  if (isResolved(stored)) return stored
  return "system"
}

/**
 * 主题只通过 <html data-theme="light|dark"> 表达；design/tokens.css 据此切换角色令牌，
 * 组件无需 dark: 变体。?theme= 用于截图矩阵，优先级最高且不写回 localStorage。
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(initialTheme)
  const [resolved, setResolved] = React.useState<ResolvedTheme>(() =>
    theme === "system" ? systemTheme() : theme,
  )

  React.useEffect(() => {
    const apply = () => {
      const next = theme === "system" ? systemTheme() : theme
      document.documentElement.setAttribute("data-theme", next)
      setResolved(next)
    }
    apply()
    if (theme !== "system") return
    const mql = window.matchMedia(QUERY)
    mql.addEventListener("change", apply)
    return () => mql.removeEventListener("change", apply)
  }, [theme])

  const setTheme = React.useCallback((next: Theme) => {
    if (next === "system") localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
  }, [])

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolved,
      setTheme,
      toggle: () => setTheme(resolved === "dark" ? "light" : "dark"),
    }),
    [theme, resolved, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>")
  return ctx
}
