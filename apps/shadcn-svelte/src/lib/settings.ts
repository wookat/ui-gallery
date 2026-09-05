const fonts: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

export function applyUrlSettings() {
  const params = new URLSearchParams(window.location.search)
  const explicitTheme = params.get("theme")
  const dark =
    explicitTheme === "dark" ||
    (!explicitTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)

  document.documentElement.classList.toggle("dark", dark)
  document.documentElement.classList.toggle("light", !dark)

  const font = fonts[params.get("font") ?? ""]
  if (font) document.documentElement.style.setProperty("--font-sans", font)
  else document.documentElement.style.removeProperty("--font-sans")
}

export function currentTheme(): "dark" | "light" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}
