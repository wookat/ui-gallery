import type { IconName } from "./icons"

// Heroicons 24/outline SVG sources, imported as raw strings and rendered inline by HeroIcon.svelte.
const modules = import.meta.glob<string>("/node_modules/heroicons/24/outline/*.svg", { query: "?raw", import: "default", eager: true })

const names: Record<IconName, string> = {
  activity: "chart-bar", "alert-circle": "exclamation-circle", archive: "archive-box", "arrow-down": "arrow-down",
  "arrow-left": "arrow-left", "arrow-right": "arrow-right", "arrow-up": "arrow-up", "bar-chart": "chart-bar", bell: "bell",
  bot: "sparkles", boxes: "rectangle-group", calendar: "calendar-days", check: "check", "chevron-down": "chevron-down",
  "chevron-left": "chevron-left", "chevron-right": "chevron-right", "chevron-up": "chevron-up", "circle-help": "question-mark-circle",
  clipboard: "clipboard", clock: "clock", copy: "document-duplicate", download: "arrow-down-tray", "ellipsis-horizontal": "ellipsis-horizontal",
  "file-plus": "document-plus", filter: "funnel", globe: "globe-alt", grid: "squares-2x2", heart: "heart", home: "home", inbox: "inbox",
  info: "information-circle", "layout-dashboard": "squares-2x2", link: "link", list: "list-bullet", loader: "arrow-path", lock: "lock-closed",
  "log-in": "arrow-right-end-on-rectangle", "log-out": "arrow-left-start-on-rectangle", menu: "bars-3", "message-circle": "chat-bubble-oval-left",
  "message-square": "chat-bubble-left", mic: "microphone", minus: "minus", moon: "moon", paperclip: "paper-clip", pencil: "pencil", play: "play",
  plug: "puzzle-piece", plus: "plus", refresh: "arrow-path", search: "magnifying-glass", send: "paper-airplane", settings: "cog-6-tooth",
  shield: "shield-check", "shopping-cart": "shopping-cart", sliders: "adjustments-horizontal", sparkles: "sparkles", star: "star", sun: "sun",
  tag: "tag", trash: "trash", upload: "arrow-up-tray", user: "user", users: "user-group", x: "x-mark", zap: "bolt", eye: "eye", "eye-off": "eye-slash",
  mail: "envelope", "credit-card": "credit-card", folder: "folder", file: "document", "circle-check": "check-circle",
  "triangle-alert": "exclamation-triangle", "chevrons-up-down": "chevron-up-down", "arrow-up-down": "arrows-up-down",
  smartphone: "device-phone-mobile", bold: "bold", italic: "italic", underline: "underline", image: "photo", maximize: "arrows-pointing-out",
  wrench: "wrench",
}

export function heroSvg(name: IconName): string {
  const file = names[name] ?? names["circle-help"]
  return modules[`/node_modules/heroicons/24/outline/${file}.svg`] ?? ""
}
