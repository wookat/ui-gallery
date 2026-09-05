import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const sourcePath = resolve(root, "src/icons/generated.ts")
const source = readFileSync(sourcePath, "utf8")
const iconBlock = source.match(/const iconNames:[\s\S]*?=\s*\{([\s\S]*?)\n\}/)?.[1] ?? ""
const iconNames = [...iconBlock.matchAll(/["']?([a-z0-9-]+)["']?\s*:/g)].map((match) => match[1])

const aliases = {
  tabler: {
    "circle-help": "help-circle", github: "brand-github", "bar-chart": "chart-bar", grid: "layout-grid",
    "layout-dashboard": "layout-dashboard", zap: "bolt", "more-horizontal": "dots", "ellipsis-horizontal": "dots",
    sliders: "adjustments-horizontal", edit: "pencil", image: "photo", refresh: "refresh",
    trash: "trash", "panel-left": "layout-sidebar",
  },
  phosphor: {
    activity: "pulse", boxes: "squares-four", "circle-help": "question", "alert-circle": "warning-circle", "bar-chart": "chart-bar",
    grid: "squares-four", "layout-dashboard": "squares-four", "more-horizontal": "dots-three",
    "ellipsis-horizontal": "dots-three", sliders: "sliders", edit: "pencil", image: "image",
    refresh: "arrow-clockwise", trash: "trash", "panel-left": "sidebar", home: "house",
    settings: "gear", search: "magnifying-glass", menu: "list", "external-link": "arrow-square-out",
    "chevron-down": "caret-down", "chevron-left": "caret-left", "chevron-right": "caret-right", "chevron-up": "caret-up",
    filter: "funnel", github: "github-logo", inbox: "tray", loader: "spinner", "log-in": "sign-in", "log-out": "sign-out",
    "message-circle": "chat-circle", "message-square": "chat", send: "paper-plane-tilt", "trending-up": "trend-up",
    "trending-down": "trend-down", sparkles: "sparkle", upload: "upload-simple", mail: "envelope-simple",
    phone: "phone-call", "eye-off": "eye-slash", "alert-triangle": "warning",
  },
  heroicons: {
    activity: "chart-bar", archive: "archive-box", bot: "cpu-chip", boxes: "squares-2x2", copy: "document-duplicate", "circle-help": "question-mark-circle", zap: "bolt", "alert-circle": "exclamation-circle", "bar-chart": "chart-bar",
    grid: "squares-2x2", "layout-dashboard": "squares-2x2", "more-horizontal": "ellipsis-horizontal",
    "ellipsis-horizontal": "ellipsis-horizontal", sliders: "adjustments-horizontal", edit: "pencil",
    image: "photo", refresh: "arrow-path", trash: "trash", "panel-left": "rectangle-group",
    home: "home", settings: "cog-6-tooth", search: "magnifying-glass", menu: "bars-3",
    "external-link": "arrow-top-right-on-square",
  },
}

const families = {
  tabler: { directory: resolve(root, "node_modules/@tabler/icons/icons/outline"), aliases: aliases.tabler, fallback: "help-circle" },
  phosphor: { directory: resolve(root, "node_modules/@phosphor-icons/core/assets/regular"), aliases: aliases.phosphor, fallback: "question" },
  heroicons: { directory: resolve(root, "node_modules/heroicons/24/outline"), aliases: aliases.heroicons, fallback: "question-mark-circle" },
}

function findSvg(family, name) {
  const commonAliases = {
    bot: "robot", boxes: "box-multiple-2", calendar: "calendar", clipboard: "clipboard",
    clock: "clock", copy: "copy", download: "download", filter: "filter", globe: "globe",
    heart: "heart", inbox: "inbox", link: "link", list: "list", loader: "loader",
    lock: "lock", "log-in": "login", "log-out": "logout", mic: "microphone",
    paperclip: "paperclip", plug: "plug", search: "search", send: "send", shield: "shield",
    "shopping-cart": "shopping-cart", sparkles: "sparkles", star: "star", upload: "upload",
    user: "user", users: "users", zap: "lightning", eye: "eye", "eye-off": "eye-off",
    mail: "mail", phone: "phone", file: "file", "message-square": "message", play: "player-play", info: "info-circle", "check-circle": "circle-check",
    "alert-triangle": "alert-triangle", "trending-up": "trending-up", "trending-down": "trending-down",
    plus: "plus", minus: "minus", x: "x", check: "check", "arrow-down": "arrow-down",
    "arrow-left": "arrow-left", "arrow-right": "arrow-right", "arrow-up": "arrow-up",
    "chevron-down": "chevron-down", "chevron-left": "chevron-left", "chevron-right": "chevron-right",
    "chevron-up": "chevron-up", home: "home", menu: "menu", moon: "moon", sun: "sun",
  }
  const candidates = [family.aliases[name], commonAliases[name], name, name.replace("circle-help", "help-circle"), family.fallback]
    .filter(Boolean)
    .map((candidate) => `${candidate}.svg`)
  const file = candidates.find((candidate) => existsSync(resolve(family.directory, candidate)))
  if (!file) throw new Error(`Missing ${name} icon for ${family.directory}; tried ${candidates.join(", ")}`)
  return resolve(family.directory, file)
}

function normalizeSvg(file, family) {
  let svg = readFileSync(file, "utf8")
  svg = svg.replace(/<svg\b([^>]*)>/, (_match, attrs) => {
    const viewBox = attrs.match(/viewBox="[^"]+"/)?.[0] ?? 'viewBox="0 0 24 24"'
    const fill = family === "phosphor" ? 'fill="currentColor"' : 'fill="none"'
    const stroke = family === "phosphor" ? "" : ' stroke="currentColor" stroke-width="1.8"'
    return `<svg ${viewBox} ${fill}${stroke}>`
  })
  return svg.replace(/<!--[\s\S]*?-->/g, "").trim()
}

const iconMaps = {}
for (const [familyName, family] of Object.entries(families)) {
  iconMaps[familyName] = Object.fromEntries(iconNames.map((name) => [name, normalizeSvg(findSvg(family, name), familyName)]))
}

mkdirSync(resolve(root, "src/icons"), { recursive: true })
const lucideMap = source.match(/const iconNames:[\s\S]*?=\s*\{[\s\S]*?\n\}/)?.[0] ?? "const iconNames = {}"
const lucideImports = source.slice(0, source.indexOf("const iconNames"))
writeFileSync(sourcePath, `${lucideImports}${lucideMap}

const familyIcons: Record<string, Record<string, string>> = ${JSON.stringify(iconMaps, null, 2)}

export function rawIcon(name: string, family: string, size: number): string {
  if (family === "lucide") {
    const node = (lucideIcons as Record<string, unknown>)[iconNames[name] ?? "CircleHelp"]
    if (Array.isArray(node)) return createElement(node as never).outerHTML.replace("<svg", \`<svg width="\${size}" height="\${size}"\`)
  }
  return familyIcons[family]?.[name] ?? familyIcons[family]?.["circle-help"] ?? familyIcons.tabler["circle-help"]
}
`)
