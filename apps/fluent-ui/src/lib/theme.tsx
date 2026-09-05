import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { FluentProvider, Toaster, webDarkTheme, webLightTheme, type Theme } from "@fluentui/react-components"
import { fontFamily, readFont, readTheme, type ThemeMode } from "./settings"

export const TOASTER_ID = "acme-toaster"

type ThemeContextValue = { mode: ThemeMode; setMode: (mode: ThemeMode) => void }
const ThemeContext = createContext<ThemeContextValue>({ mode: "light", setMode: () => {} })

export function useThemeMode() {
  return useContext(ThemeContext)
}

export function GalleryThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => readTheme())
  const font = readFont()

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark")
    document.documentElement.classList.toggle("light", mode === "light")
    document.documentElement.style.colorScheme = mode
  }, [mode])

  const theme = useMemo<Theme>(() => {
    const base = mode === "dark" ? webDarkTheme : webLightTheme
    const family = fontFamily(font)
    return family ? { ...base, fontFamilyBase: family } : base
  }, [mode, font])

  const value = useMemo(() => ({ mode, setMode }), [mode])

  return (
    <ThemeContext.Provider value={value}>
      <FluentProvider theme={theme}>
        {children}
        <Toaster toasterId={TOASTER_ID} position="top-end" />
      </FluentProvider>
    </ThemeContext.Provider>
  )
}
