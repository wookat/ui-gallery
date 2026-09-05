import { useCallback, useMemo, useState, type ReactNode } from "react"
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  type PaletteMode,
} from "@mui/material"
import { ThemeModeContext } from "./theme-context"

const FONTS: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}
const DEFAULT_FONT = "'Roboto Variable', 'Helvetica', 'Arial', sans-serif"

function initialMode(): PaletteMode {
  const explicit = new URLSearchParams(window.location.search).get("theme")
  if (explicit === "dark" || explicit === "light") return explicit
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export function AppTheme({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(initialMode)
  const font =
    new URLSearchParams(window.location.search).get("font") ?? "default"
  const fontFamily = FONTS[font] ?? DEFAULT_FONT

  const theme = useMemo(
    () => createTheme({ palette: { mode }, typography: { fontFamily } }),
    [mode, fontFamily]
  )

  const toggle = useCallback(() => {
    setMode((m) => {
      const next = m === "dark" ? "light" : "dark"
      const url = new URL(window.location.href)
      url.searchParams.set("theme", next)
      window.history.replaceState(null, "", url)
      return next
    })
  }, [])

  document.documentElement.classList.toggle("dark", mode === "dark")
  document.documentElement.classList.toggle("light", mode !== "dark")
  document.documentElement.style.setProperty("--font-sans", fontFamily)

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}
