import { ChakraProvider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"
import { ThemeProvider, useTheme } from "next-themes"
import type { ReactNode } from "react"

// Official default theme; only the font token is routed through a CSS variable so ?font= can switch it.
const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--ug-font, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif)" },
        body: { value: "var(--ug-font, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif)" },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)

export function Provider({ children, defaultTheme }: { children: ReactNode; defaultTheme: "light" | "dark" | "system" }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange defaultTheme={defaultTheme} enableSystem storageKey="chakra-ui-theme">
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme()
  const colorMode = (resolvedTheme === "dark" ? "dark" : "light") as "light" | "dark"
  return { colorMode, setColorMode: setTheme, toggleColorMode: () => setTheme(colorMode === "dark" ? "light" : "dark") }
}
