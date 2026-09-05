import { createContext, useContext } from "react"
import type { PaletteMode } from "@mui/material"

export const ThemeModeContext = createContext<{
  mode: PaletteMode
  toggle: () => void
}>({
  mode: "light",
  toggle: () => {},
})

export function useThemeMode() {
  return useContext(ThemeModeContext)
}
