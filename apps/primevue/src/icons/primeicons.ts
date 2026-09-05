import type { IconName } from "./names"

const map: Record<IconName, string> = {
  "layout-dashboard": "th-large", "shopping-cart": "shopping-cart", "file-plus": "file-plus", "message-square": "comment",
  boxes: "box", globe: "globe", settings: "cog", "log-in": "sign-in",
  search: "search", bell: "bell", sun: "sun", moon: "moon", menu: "bars", "chevron-down": "chevron-down", "chevron-right": "chevron-right",
  "chevron-left": "chevron-left", "chevron-up": "chevron-up", "chevrons-up-down": "sort-alt",
  user: "user", "log-out": "sign-out", mail: "envelope", lock: "lock", eye: "eye", "eye-off": "eye-slash", github: "github", chrome: "google", apple: "apple",
  plus: "plus", download: "download", filter: "filter", "columns-3": "objects-column", "more-horizontal": "ellipsis-h", "trash-2": "trash", pencil: "pencil",
  check: "check", x: "times", copy: "copy", "refresh-cw": "refresh", "alert-circle": "exclamation-circle", "alert-triangle": "exclamation-triangle",
  info: "info-circle", "check-circle-2": "check-circle", "loader-2": "spinner", calendar: "calendar", clock: "clock",
  upload: "upload", image: "image", paperclip: "paperclip", send: "send", sparkles: "sparkles", bot: "microchip-ai", "file-text": "file", link: "link",
  star: "star", heart: "heart", "trending-up": "arrow-up-right", "trending-down": "arrow-down-right", users: "users", "credit-card": "credit-card",
  shield: "shield", smartphone: "mobile", monitor: "desktop", zap: "bolt", "arrow-right": "arrow-right", "arrow-up-right": "arrow-up-right", "arrow-left": "arrow-left",
  home: "home", package: "box", inbox: "inbox", layers: "clone", "grid-2x2": "th-large", wrench: "wrench", "help-circle": "question-circle",
  "external-link": "external-link", keyboard: "desktop", "qr-code": "qrcode", palette: "palette", type: "language", "bar-chart": "chart-line", plug: "link",
}

export const primeIconClass = (name: IconName) => `pi pi-${map[name]}`
