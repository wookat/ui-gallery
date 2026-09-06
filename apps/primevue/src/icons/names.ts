// lucide-style icon names used across the app (nav.json uses the same names)
export const iconNames = [
  "layout-dashboard", "shopping-cart", "file-plus", "message-square", "boxes", "globe", "settings", "log-in",
  "search", "bell", "sun", "moon", "menu", "chevron-down", "chevron-right", "chevron-left", "chevron-up", "chevrons-up-down",
  "user", "log-out", "mail", "lock", "eye", "eye-off", "github", "chrome", "apple",
  "plus", "download", "filter", "columns-3", "more-horizontal", "trash-2", "pencil", "check", "x", "copy",
  "refresh-cw", "alert-circle", "alert-triangle", "info", "check-circle-2", "loader-2", "calendar", "clock",
  "upload", "image", "paperclip", "send", "sparkles", "bot", "file-text", "link", "star", "heart",
  "trending-up", "trending-down", "users", "credit-card", "shield", "smartphone", "monitor", "zap", "arrow-right", "arrow-up-right", "arrow-left",
  "home", "package", "inbox", "layers", "grid-2x2", "wrench", "help-circle", "external-link", "keyboard", "qr-code", "palette", "type", "bar-chart", "plug",
  "more-vertical", "maximize", "x-circle", "chevrons-left", "chevrons-right", "truck", "move-horizontal", "messages-square",
] as const
export type IconName = (typeof iconNames)[number]
