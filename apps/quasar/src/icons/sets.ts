import type { Component } from "vue"
import * as Lucide from "lucide-vue-next"
import * as Tabler from "@tabler/icons-vue"
import * as Phosphor from "@phosphor-icons/vue"
import * as Heroicons from "@heroicons/vue/24/outline"

type Namespace = Record<string, Component>
const L = Lucide as unknown as Namespace
const T = Tabler as unknown as Namespace
const P = Phosphor as unknown as Namespace
const H = Heroicons as unknown as Namespace
const pick = (namespace: Namespace, ...names: string[]) => names.map((name) => namespace[name]).find(Boolean) ?? L.Activity
const map = (namespace: Namespace, names: Record<string, string[]>) => Object.fromEntries(Object.entries(names).map(([key, aliases]) => [key, pick(namespace, ...aliases)]))

const names = {
  activity: ["Activity", "ChartBar"], "alert-circle": ["AlertCircle", "InfoCircle"], archive: ["Archive"], "arrow-down": ["ArrowDown"],
  "arrow-left": ["ArrowLeft"], "arrow-right": ["ArrowRight"], "arrow-up": ["ArrowUp"], "bar-chart": ["BarChart3", "ChartBar"],
  bell: ["Bell"], bot: ["Bot", "Sparkles"], boxes: ["Boxes", "Box"], calendar: ["CalendarDays", "Calendar"], check: ["Check"],
  "chevron-down": ["ChevronDown", "CaretDown"], "chevron-left": ["ChevronLeft", "CaretLeft"], "chevron-right": ["ChevronRight", "CaretRight"],
  "chevron-up": ["ChevronUp", "CaretUp"], "circle-help": ["CircleHelp", "InfoCircle"], clipboard: ["Clipboard"], clock: ["Clock3", "Clock"],
  copy: ["Copy"], download: ["Download"], edit: ["Edit3", "Edit"], "ellipsis-horizontal": ["Ellipsis", "Dots"], "file-plus": ["FilePlus"],
  filter: ["Filter"], globe: ["Globe"], github: ["Github", "Globe"], grid: ["Grid2X2", "Grid3x3"], heart: ["Heart"], home: ["Home", "House"],
  inbox: ["Inbox", "Archive"], "layout-dashboard": ["LayoutDashboard"], link: ["Link2", "Link"], list: ["List"], loader: ["LoaderCircle", "Loader2"],
  lock: ["Lock", "LockClosed"], "log-in": ["LogIn", "Login"], "log-out": ["LogOut", "Logout"], menu: ["Menu", "Menu2"],
  "message-circle": ["MessageCircle", "ChatCircle"], "message-square": ["MessageSquare", "Message"], mic: ["Mic", "Microphone"], minus: ["Minus"],
  "more-horizontal": ["MoreHorizontal", "Dots"], moon: ["Moon"], paperclip: ["Paperclip"], pencil: ["Pencil"], play: ["Play", "PlayerPlay"],
  plus: ["Plus"], plug: ["Plug", "Plugs"], refresh: ["RefreshCw", "Refresh"], search: ["Search", "MagnifyingGlass"], send: ["Send"],
  settings: ["Settings", "Cog6Tooth"], shield: ["Shield"], "shopping-cart": ["ShoppingCart"], sliders: ["SlidersHorizontal", "AdjustmentsHorizontal"],
  sparkles: ["Sparkles", "Sparkle"], star: ["Star"], sun: ["Sun"], tag: ["Tag"], trash: ["Trash2", "Trash"], upload: ["Upload"],
  user: ["User"], users: ["Users"], x: ["X"], zap: ["Zap", "Lightning"], eye: ["Eye"], "eye-off": ["EyeOff"], mail: ["Mail"],
  phone: ["Phone"], image: ["Image"], "credit-card": ["CreditCard"], info: ["Info", "InformationCircle"], "check-circle": ["CheckCircle"],
  "alert-triangle": ["AlertTriangle", "Warning"], "x-circle": ["XCircle"],
}

export const componentSets = {
  lucide: map(L, names),
  tabler: map(T, Object.fromEntries(Object.entries(names).map(([key, aliases]) => [key, aliases.map((name) => `Icon${name}`)]))),
  phosphor: map(P, Object.fromEntries(Object.entries(names).map(([key, aliases]) => [key, aliases.map((name) => `Ph${name}`)]))),
  heroicons: map(H, Object.fromEntries(Object.entries(names).map(([key, aliases]) => [key, aliases.map((name) => `${name}Icon`)]))),
} as Record<string, Namespace>

export const materialNames: Record<string, string> = {
  activity: "analytics", "alert-circle": "error_outline", archive: "archive", "arrow-down": "arrow_downward", "arrow-left": "arrow_back",
  "arrow-right": "arrow_forward", "arrow-up": "arrow_upward", "bar-chart": "bar_chart", bell: "notifications", bot: "smart_toy",
  boxes: "view_module", calendar: "calendar_month", check: "check", "chevron-down": "expand_more", "chevron-left": "chevron_left",
  "chevron-right": "chevron_right", "chevron-up": "expand_less", "circle-help": "help_outline", clipboard: "content_paste", clock: "schedule",
  copy: "content_copy", download: "download", edit: "edit", "ellipsis-horizontal": "more_horiz", "file-plus": "note_add", filter: "filter_alt",
  globe: "language", github: "code", grid: "grid_view", heart: "favorite_border", home: "home", inbox: "inbox", "layout-dashboard": "dashboard",
  link: "link", list: "list", loader: "progress_activity", lock: "lock", "log-in": "login", "log-out": "logout", menu: "menu",
  "message-circle": "chat_bubble_outline", "message-square": "chat", mic: "mic", minus: "remove", "more-horizontal": "more_horiz", moon: "dark_mode",
  paperclip: "attach_file", pencil: "edit", play: "play_arrow", plus: "add", plug: "extension", refresh: "refresh", search: "search", send: "send",
  settings: "settings", shield: "shield", "shopping-cart": "shopping_cart", sliders: "tune", sparkles: "auto_awesome", star: "star_border",
  sun: "light_mode", tag: "sell", trash: "delete", upload: "upload", user: "person", users: "group", x: "close", zap: "bolt", eye: "visibility",
  "eye-off": "visibility_off", mail: "mail", phone: "phone", image: "image", "credit-card": "credit_card", info: "info",
  "check-circle": "check_circle", "alert-triangle": "warning", "x-circle": "cancel",
}
