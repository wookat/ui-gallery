import { createContext, useContext } from "react"
import { useComputedColorScheme, type MantineColorScheme } from "@mantine/core"

export const ThemeContext = createContext<{ scheme: MantineColorScheme; setScheme: (scheme: MantineColorScheme) => void }>({
  scheme: "auto",
  setScheme: () => {},
})

export function useThemeToggle() {
  const { setScheme } = useContext(ThemeContext)
  const computed = useComputedColorScheme("light")
  const toggle = () => {
    const next = computed === "dark" ? "light" : "dark"
    setScheme(next)
    const params = new URLSearchParams(window.location.search)
    params.set("theme", next)
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`)
  }
  return { computed, toggle }
}
