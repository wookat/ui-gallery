export const iconNames = [
  "activity", "alert-circle", "archive", "arrow-down", "arrow-left", "arrow-right", "arrow-up",
  "bar-chart", "bell", "bot", "boxes", "calendar", "check", "chevron-down", "chevron-left",
  "chevron-right", "chevron-up", "circle-help", "clipboard", "clock", "copy", "download", "edit",
  "ellipsis-horizontal", "file-plus", "filter", "globe", "github", "grid", "heart", "home",
  "inbox", "layout-dashboard", "link", "list", "loader", "lock", "log-in", "log-out", "menu",
  "message-circle", "message-square", "mic", "minus", "more-horizontal", "moon", "paperclip",
  "pencil", "play", "plus", "plug", "refresh", "search", "send", "settings", "shield",
  "shopping-cart", "sliders", "sparkles", "star", "sun", "tag", "trash", "upload", "user", "users",
  "x", "zap", "eye", "eye-off", "mail", "phone", "image", "credit-card", "info", "check-circle",
  "alert-triangle", "x-circle",
] as const

export type IconName = (typeof iconNames)[number]
export type IconSet = "native" | "lucide" | "tabler" | "phosphor" | "heroicons"

export function useQuerySettings() {
  const params = new URLSearchParams(window.location.search)
  return {
    iconSet: (params.get("icons") ?? params.get("icon") ?? "native") as IconSet,
    state: params.get("state") ?? "",
  }
}
