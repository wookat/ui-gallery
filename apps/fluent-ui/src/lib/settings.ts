export type ThemeMode = "light" | "dark"
export type FontKey = "default" | "inter" | "geist" | "noto-sans-sc" | "lxgw-wenkai"
export type IconFamily = "native" | "lucide" | "tabler" | "phosphor" | "heroicons"

const fontStacks: Record<Exclude<FontKey, "default">, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

function params() {
  return new URLSearchParams(typeof window === "undefined" ? "" : window.location.search)
}

export function readTheme(): ThemeMode {
  const explicit = params().get("theme")
  if (explicit === "dark" || explicit === "light") return explicit
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function readFont(): FontKey {
  const value = params().get("font")
  return value && value in fontStacks ? (value as FontKey) : "default"
}

export function fontFamily(font: FontKey): string | undefined {
  return font === "default" ? undefined : fontStacks[font]
}

export function readIconFamily(): IconFamily {
  const value = params().get("icons") ?? params().get("icon")
  return value === "lucide" || value === "tabler" || value === "phosphor" || value === "heroicons" ? value : "native"
}
