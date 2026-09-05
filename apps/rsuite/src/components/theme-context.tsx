import { createContext, useContext } from "react"

export type ThemeContextValue = { theme: "light" | "dark"; icons: string | null; setTheme: (theme: "light" | "dark") => void }
export const ThemeContext = createContext<ThemeContextValue>({ theme: "light", icons: null, setTheme: () => undefined })
export const useTheme = () => useContext(ThemeContext)
