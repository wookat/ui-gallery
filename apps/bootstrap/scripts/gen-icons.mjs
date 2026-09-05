// Generates src/lib/icon-map.ts: one raw-SVG import per icon name × family.
// Families: bootstrap (native), lucide, tabler, phosphor, heroicons.
// Usage: node scripts/gen-icons.mjs
import { existsSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const nm = fileURLToPath(new URL("../node_modules/", import.meta.url))
const pkgDir = (name) => join(nm, name)
const roots = {
  bootstrap: join(pkgDir("bootstrap-icons"), "icons"),
  lucide: join(pkgDir("lucide-static"), "icons"),
  tabler: join(pkgDir("@tabler/icons"), "icons/outline"),
  phosphor: join(pkgDir("@phosphor-icons/core"), "assets/regular"),
  heroicons: join(pkgDir("heroicons"), "24/outline"),
}
const spec = {
  bootstrap: "bootstrap-icons/icons",
  lucide: "lucide-static/icons",
  tabler: "@tabler/icons/outline",
  phosphor: "@phosphor-icons/core/assets/regular",
  heroicons: "heroicons/24/outline",
}

// name: [bootstrap, lucide, tabler, phosphor(-regular suffix added), heroicons]
const icons = {
  activity: ["activity", "activity", "activity", "pulse", "chart-bar"],
  "alert-circle": ["exclamation-circle", "circle-alert", "alert-circle", "warning-circle", "exclamation-circle"],
  archive: ["archive", "archive", "archive", "archive", "archive-box"],
  "arrow-down": ["arrow-down", "arrow-down", "arrow-down", "arrow-down", "arrow-down"],
  "arrow-left": ["arrow-left", "arrow-left", "arrow-left", "arrow-left", "arrow-left"],
  "arrow-right": ["arrow-right", "arrow-right", "arrow-right", "arrow-right", "arrow-right"],
  "arrow-up": ["arrow-up", "arrow-up", "arrow-up", "arrow-up", "arrow-up"],
  "bar-chart": ["bar-chart", "chart-column", "chart-bar", "chart-bar", "chart-bar"],
  bell: ["bell", "bell", "bell", "bell", "bell"],
  bot: ["robot", "bot", "robot", "robot", "cpu-chip"],
  boxes: ["boxes", "boxes", "box", "cube", "rectangle-group"],
  calendar: ["calendar3", "calendar-days", "calendar", "calendar", "calendar-days"],
  check: ["check-lg", "check", "check", "check", "check"],
  "check-circle": ["check-circle", "circle-check", "circle-check", "check-circle", "check-circle"],
  "chevron-down": ["chevron-down", "chevron-down", "chevron-down", "caret-down", "chevron-down"],
  "chevron-left": ["chevron-left", "chevron-left", "chevron-left", "caret-left", "chevron-left"],
  "chevron-right": ["chevron-right", "chevron-right", "chevron-right", "caret-right", "chevron-right"],
  "chevron-up": ["chevron-up", "chevron-up", "chevron-up", "caret-up", "chevron-up"],
  "circle-help": ["question-circle", "circle-question-mark", "help-circle", "question", "question-mark-circle"],
  clipboard: ["clipboard", "clipboard", "clipboard", "clipboard", "clipboard"],
  clock: ["clock", "clock-3", "clock", "clock", "clock"],
  copy: ["copy", "copy", "copy", "copy", "document-duplicate"],
  "credit-card": ["credit-card", "credit-card", "credit-card", "credit-card", "credit-card"],
  download: ["download", "download", "download", "download-simple", "arrow-down-tray"],
  edit: ["pencil-square", "square-pen", "edit", "pencil-simple-line", "pencil-square"],
  eye: ["eye", "eye", "eye", "eye", "eye"],
  "eye-off": ["eye-slash", "eye-off", "eye-off", "eye-slash", "eye-slash"],
  "file-plus": ["file-earmark-plus", "file-plus", "file-plus", "file-plus", "document-plus"],
  filter: ["funnel", "funnel", "filter", "funnel", "funnel"],
  github: ["github", "code-xml", "brand-github", "github-logo", "code-bracket"],
  globe: ["globe", "globe", "world", "globe", "globe-alt"],
  google: ["google", "at-sign", "brand-google", "google-logo", "at-symbol"],
  grid: ["grid", "grid-2x2", "layout-grid", "grid-four", "squares-2x2"],
  heart: ["heart", "heart", "heart", "heart", "heart"],
  home: ["house", "house", "home", "house", "home"],
  inbox: ["inbox", "inbox", "inbox", "tray", "inbox"],
  "layout-dashboard": ["speedometer2", "layout-dashboard", "layout-dashboard", "squares-four", "squares-2x2"],
  link: ["link-45deg", "link-2", "link", "link", "link"],
  list: ["list-ul", "list", "list", "list", "list-bullet"],
  loader: ["arrow-repeat", "loader-circle", "loader-2", "circle-notch", "arrow-path"],
  lock: ["lock", "lock", "lock", "lock", "lock-closed"],
  "log-in": ["box-arrow-in-right", "log-in", "login", "sign-in", "arrow-right-on-rectangle"],
  "log-out": ["box-arrow-right", "log-out", "logout", "sign-out", "arrow-left-on-rectangle"],
  mail: ["envelope", "mail", "mail", "envelope-simple", "envelope"],
  menu: ["list", "menu", "menu-2", "list", "bars-3"],
  "message-circle": ["chat", "message-circle", "message-circle", "chat-circle", "chat-bubble-oval-left"],
  "message-square": ["chat-square-text", "message-square", "message", "chat-text", "chat-bubble-left"],
  mic: ["mic", "mic", "microphone", "microphone", "microphone"],
  minus: ["dash-lg", "minus", "minus", "minus", "minus"],
  moon: ["moon-stars", "moon", "moon", "moon", "moon"],
  "more-horizontal": ["three-dots", "ellipsis", "dots", "dots-three", "ellipsis-horizontal"],
  paperclip: ["paperclip", "paperclip", "paperclip", "paperclip", "paper-clip"],
  pencil: ["pencil", "pencil", "pencil", "pencil", "pencil"],
  play: ["play", "play", "player-play", "play", "play"],
  plug: ["plug", "plug", "plug", "plugs", "bolt"],
  plus: ["plus-lg", "plus", "plus", "plus", "plus"],
  refresh: ["arrow-clockwise", "refresh-cw", "refresh", "arrows-clockwise", "arrow-path"],
  search: ["search", "search", "search", "magnifying-glass", "magnifying-glass"],
  send: ["send", "send", "send", "paper-plane-tilt", "paper-airplane"],
  settings: ["gear", "settings", "settings", "gear", "cog-6-tooth"],
  shield: ["shield-check", "shield", "shield", "shield", "shield-check"],
  "shopping-cart": ["cart", "shopping-cart", "shopping-cart", "shopping-cart", "shopping-cart"],
  sliders: ["sliders", "sliders-horizontal", "adjustments-horizontal", "sliders-horizontal", "adjustments-horizontal"],
  sparkles: ["stars", "sparkles", "sparkles", "sparkle", "sparkles"],
  star: ["star", "star", "star", "star", "star"],
  "star-fill": ["star-fill", "star", "star", "star", "star"],
  sun: ["sun", "sun", "sun", "sun", "sun"],
  tag: ["tag", "tag", "tag", "tag", "tag"],
  trash: ["trash", "trash-2", "trash", "trash", "trash"],
  upload: ["cloud-upload", "upload", "upload", "upload-simple", "cloud-arrow-up"],
  user: ["person", "user", "user", "user", "user"],
  users: ["people", "users", "users", "users", "user-group"],
  wechat: ["wechat", "message-circle", "brand-wechat", "wechat-logo", "chat-bubble-left-right"],
  x: ["x-lg", "x", "x", "x", "x-mark"],
  zap: ["lightning-charge", "zap", "bolt", "lightning", "bolt"],
}

const families = Object.keys(roots)
const ident = (s) => s.replace(/[^a-zA-Z0-9]/g, "_")
let out = "// Generated by scripts/gen-icons.mjs — do not edit by hand.\n"
const missing = []
const tables = Object.fromEntries(families.map((f) => [f, []]))
for (const [name, files] of Object.entries(icons)) {
  files.forEach((file, i) => {
    const family = families[i]
    const fileName = `${file}.svg`
    if (!existsSync(join(roots[family], fileName))) { missing.push(`${family}: ${fileName} (for ${name})`); return }
    const id = `${family}_${ident(name)}`
    out += `import ${id} from "${spec[family]}/${fileName}?raw"\n`
    tables[family].push(`  "${name}": ${id},`)
  })
}
if (missing.length) { console.error(missing.join("\n")); process.exit(1) }
out += `\nexport type IconName = ${Object.keys(icons).map((n) => `"${n}"`).join(" | ")}\n`
out += `export type IconFamily = ${families.map((f) => `"${f}"`).join(" | ")}\n`
out += `export const iconMap: Record<IconFamily, Record<IconName, string>> = {\n`
for (const f of families) out += `  ${f}: {\n${tables[f].join("\n")}\n  },\n`
out += "}\n"
writeFileSync(new URL("../src/lib/icon-map.ts", import.meta.url), out)
console.log(`wrote ${Object.keys(icons).length} icons × ${families.length} families`)
