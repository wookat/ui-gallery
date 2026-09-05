import { createContext, useContext } from "react"

export type ColorMode = "light" | "dark"

export const ColorModeContext = createContext<{ mode: ColorMode; setMode: (mode: ColorMode) => void }>({
  mode: "light",
  setMode: () => {},
})

export const useColorMode = () => useContext(ColorModeContext)
