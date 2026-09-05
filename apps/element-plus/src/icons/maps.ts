import * as Native from "@element-plus/icons-vue"
import * as Lucide from "lucide-vue-next"
import * as Tabler from "@tabler/icons-vue"
import * as Phosphor from "@phosphor-icons/vue"
import * as Hero from "@heroicons/vue/24/outline"

const names: Record<string, string> = {
  search: "Search", bell: "Bell", moon: "Moon", sun: "Sunny", menu: "Menu", user: "User", settings: "Setting",
  "shopping-cart": "ShoppingCart", "file-plus": "DocumentAdd", "message-square": "ChatDotSquare", boxes: "Grid",
  "layout-dashboard": "Monitor", plus: "Plus", trash: "Delete", edit: "Edit", "more-horizontal": "More",
  download: "Download", upload: "Upload", lock: "Lock", send: "Promotion", sparkles: "MagicStick", copy: "CopyDocument",
  calendar: "Calendar", clock: "Clock", link: "Link", "alert-circle": "Warning", info: "InfoFilled", "circle-help": "QuestionFilled",
  check: "Check", x: "Close", refresh: "Refresh", loader: "Loading", star: "Star", filter: "Filter", paperclip: "Paperclip",
  "arrow-down": "ArrowDown", "arrow-up": "ArrowUp", "arrow-left": "ArrowLeft", "arrow-right": "ArrowRight",
  home: "House", globe: "Compass", zap: "Lightning", shield: "Lock", bot: "ChatDotRound", "bar-chart": "TrendCharts",
  plug: "Connection", list: "List", tag: "CollectionTag", heart: "HeartFilled", activity: "DataLine", archive: "Files",
  "message-circle": "ChatLineRound", mic: "Microphone", minus: "Minus", pencil: "EditPen", play: "VideoPlay",
  "log-in": "SwitchButton", "log-out": "SwitchButton", sliders: "Operation", type: "Document", users: "UserFilled",
}
const familyNames: Record<string, Record<string, string>> = {
  native: { google: "ChromeFilled", github: "Link", wechat: "ChatDotRound" },
  lucide: { google: "Chrome", github: "Github", wechat: "MessageCircle" },
  tabler: { google: "IconBrandGoogle", github: "IconBrandGithub", wechat: "IconBrandWechat" },
  phosphor: { google: "PhGoogleLogo", github: "PhGithubLogo", wechat: "PhWechatLogo" },
  heroicons: { google: "GlobeAltIcon", github: "CodeBracketIcon", wechat: "ChatBubbleOvalLeftIcon" },
}
const warned = new Set<string>()

function warnMissing(family: string, key: string) {
  const warning = `${family}:${key}`
  if (warned.has(warning)) return
  warned.add(warning)
  console.warn(`[Icon] Missing icon "${key}" for family "${family}"`)
}

function pascal(key: string) {
  return key.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("")
}

export function getIcon(family: string, key: string) {
  const requested = familyNames[family]?.[key] ?? (family === "native" ? names[key] : family === "lucide" ? pascal(key) : family === "tabler" ? `Icon${pascal(key)}` : family === "phosphor" ? `Ph${pascal(key)}` : `${pascal(key)}Icon`)
  const source = family === "native" ? Native : family === "lucide" ? Lucide : family === "tabler" ? Tabler : family === "phosphor" ? Phosphor : Hero
  const fallback = family === "native" ? Native.QuestionFilled : family === "lucide" ? Lucide.CircleHelp : family === "tabler" ? Tabler.IconHelpCircle : family === "phosphor" ? Phosphor.PhQuestion : Hero.QuestionMarkCircleIcon
  const result = (source as Record<string, unknown>)[requested]
  if (result) return result
  warnMissing(family, key)
  return fallback
}
