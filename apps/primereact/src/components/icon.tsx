import { Icon as GalleryIcon } from "@ui-gallery/icons-react"

const map: Record<string, string> = {
  "layout-dashboard": "th-large", "shopping-cart": "shopping-cart", "file-plus": "file", "message-square": "comments",
  boxes: "box", globe: "globe", settings: "cog", search: "search", bell: "bell", moon: "moon", sun: "sun", menu: "bars",
  "log-out": "sign-out", plus: "plus", user: "user", users: "users", lock: "lock", check: "check", x: "times",
  "chevron-down": "chevron-down", "chevron-left": "chevron-left", "chevron-right": "chevron-right", "chevron-up": "chevron-up",
  trash: "trash", pencil: "pencil", edit: "pencil", copy: "copy", download: "download", upload: "upload", paperclip: "paperclip",
  send: "send", sparkles: "sparkles", zap: "bolt", shield: "shield", "bar-chart": "chart-bar", star: "star", heart: "heart",
  clock: "clock", calendar: "calendar", filter: "filter", refresh: "refresh", "more-horizontal": "ellipsis-h", "ellipsis-horizontal": "ellipsis-h",
  inbox: "inbox", "alert-circle": "exclamation-circle", "circle-help": "question-circle", github: "github", mic: "microphone", home: "home",
  list: "list", link: "link", play: "play", minus: "minus", loader: "spinner", "log-in": "sign-in", bot: "prime", grid: "th-large",
  activity: "chart-line", tag: "tag", mail: "envelope", eye: "eye", "eye-slash": "eye-slash", plug: "plug", arrow: "arrow-right",
  "arrow-right": "arrow-right", "arrow-left": "arrow-left", "message-circle": "comment", info: "info-circle",
}

export function Icon({ name, size, className }: { name: string; size?: number; className?: string }) {
  const family = new URLSearchParams(window.location.search).get("icons")
  if (family && family !== "native") return <GalleryIcon name={name} size={size} className={className} />
  return <i className={`pi pi-${map[name] ?? name} ${className ?? ""}`} style={size ? { fontSize: size } : undefined} aria-hidden />
}
