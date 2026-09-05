const fonts: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', serif",
}

export function applyUrlSettings() {
  const params = new URLSearchParams(window.location.search)
  const explicit = params.get("theme")
  const dark = explicit === "dark" || (!explicit && window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", dark)
  document.documentElement.classList.toggle("light", !dark)
  const font = fonts[params.get("font") ?? ""]
  if (font) document.documentElement.style.setProperty("--el-font-family", font)
  return dark
}

export function setTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.classList.toggle("light", theme !== "dark")
}
