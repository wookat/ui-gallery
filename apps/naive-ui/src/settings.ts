// Shared URL controls: ?theme=light|dark, ?font=..., ?icons=... (icons handled in icons.ts)
import { computed, ref } from "vue"
import { darkTheme, type GlobalThemeOverrides } from "naive-ui"

const params = new URLSearchParams(window.location.search)
const explicit = params.get("theme")
export const isDark = ref(explicit === "dark" || (!explicit && window.matchMedia("(prefers-color-scheme: dark)").matches))
export const naiveTheme = computed(() => (isDark.value ? darkTheme : null))

export function toggleTheme() {
  isDark.value = !isDark.value
  const next = new URLSearchParams(window.location.search)
  next.set("theme", isDark.value ? "dark" : "light")
  history.replaceState(null, "", `${window.location.pathname}?${next.toString()}`)
}

const fonts: Record<string, string> = {
  inter: "'Inter Variable', v-sans, system-ui, sans-serif",
  geist: "'Geist Variable', v-sans, system-ui, sans-serif",
  "noto-sans-sc": "'Noto Sans SC Variable', v-sans, system-ui, sans-serif",
  "lxgw-wenkai": "'LXGW WenKai Screen', v-sans, serif",
}
const font = fonts[params.get("font") ?? ""]
// Only the font family is overridden (never colors); `default` keeps Naive UI's own v-sans stack.
export const themeOverrides: GlobalThemeOverrides | undefined = font ? { common: { fontFamily: font } } : undefined
if (font) document.documentElement.style.setProperty("--font-sans", font)
