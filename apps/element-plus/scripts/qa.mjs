/* global URL, console, process */
// Quality gate for apps/element-plus: horizontal overflow, console errors, contrast, hit-target size.
// Usage (from repo root, after `pnpm --filter element-plus build`):
//   node apps/element-plus/scripts/qa.mjs
// Uses the same static server contract as tools/shoot/shoot.mjs (port 4174).
import { chromium } from "../../../tools/shoot/node_modules/playwright/index.mjs"
import { readFileSync, existsSync } from "node:fs"
import { createServer } from "node:http"
import { join, extname } from "node:path"

const root = new URL("../../../", import.meta.url).pathname
const slug = "element-plus"
const contract = JSON.parse(readFileSync(join(root, "packages/spec/contract.json"), "utf8"))
const dist = join(root, "apps", slug, "dist")
if (!existsSync(join(dist, "index.html"))) { console.error("dist missing, run build first"); process.exit(1) }

const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".png": "image/png" }
const server = createServer((req, res) => {
  const m = req.url.match(/^\/apps\/([^/]+)(\/.*)?$/)
  if (!m) return res.writeHead(404).end()
  let file = join(dist, (m[2] || "/").split("?")[0])
  if (!existsSync(file) || !extname(file)) file = join(dist, "index.html")
  res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" })
  res.end(readFileSync(file))
})
await new Promise((r) => server.listen(4174, r))

const browser = await chromium.launch()
const failures = []
const note = (level, msg) => { (level === "FAIL" ? failures : []).push(msg); console.log(`${level} ${msg}`) }

// Runs in the page: returns overflow, contrast and hit-target findings.
const audit = `(() => {
  const vw = window.innerWidth
  const out = { scrollWidth: document.documentElement.scrollWidth, overflow: [], contrast: [], palette: [], small: [] }
  const parse = (c) => { const m = c.match(/[\\d.]+/g)?.map(Number) ?? [0,0,0,1]; return m.length === 3 ? [...m, 1] : m }
  const lum = ([r,g,b]) => { const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4 }; return .2126*f(r)+.7152*f(g)+.0722*f(b) }
  const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + .05) / (l2 + .05) }
  const bgOf = (el) => { let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c[3] > 0) return c; n = n.parentElement } return [255,255,255,1] }
  // Official Element Plus palette text (links, active tabs/menu, typed el-text/tags) is reported separately:
  // changing it would mean a custom palette, which the gallery contract forbids.
  const rootStyle = getComputedStyle(document.documentElement)
  const paletteHex = ["primary", "success", "warning", "danger", "info"].map((k) => rootStyle.getPropertyValue("--el-color-" + k).trim().toLowerCase())
  const toHex = ([r, g, b]) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")
  const isPalette = (c) => paletteHex.includes(toHex(c))
  const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.opacity !== "0" }
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el)) continue
    const r = el.getBoundingClientRect()
    // ignore elements inside scroll containers (their own overflow is intended) and fixed/popper layers
    let n = el.parentElement, clipped = false
    while (n) { const o = getComputedStyle(n).overflowX; if (o === "auto" || o === "scroll" || o === "hidden") { clipped = true; break } n = n.parentElement }
    if (!clipped && r.right > vw + 1 && !el.closest(".el-popper, .el-overlay, .el-drawer, .el-message, .el-notification")) out.overflow.push(el.tagName.toLowerCase() + "." + [...el.classList].slice(0,2).join(".") + " right=" + Math.round(r.right))
  }
  // horizontally scrollable regions: allowed only when explicitly marked with [data-scroll-x] (intentional, visible affordance)
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el) || el.closest(".el-popper, .el-overlay, .el-drawer")) continue
    const ox = getComputedStyle(el).overflowX
    const diff = el.scrollWidth - el.clientWidth
    const scrolls = ox === "auto" || ox === "scroll"
    if (!scrolls && diff <= 8) continue
    if (!scrolls && el.scrollHeight > el.clientHeight && getComputedStyle(el).overflowY !== "visible") continue
    if (diff > 2 && el.clientWidth > 0 && !el.closest("[data-scroll-x], .el-badge, .el-step, .el-rate, .el-table-v2, .el-segmented, .el-tabs__nav-scroll, .el-carousel, .el-scrollbar, .el-slider, .el-progress, .el-switch, .el-skeleton, .el-table__body-wrapper, .el-table__inner-wrapper, .el-table__header-wrapper, .el-table__footer-wrapper, textarea, .el-input__wrapper, .el-select__wrapper")) {
      out.overflow.push(el.tagName.toLowerCase() + "." + [...el.classList].slice(0,2).join(".") + " scrollWidth=" + el.scrollWidth + ">" + el.clientWidth + " (" + ox + ")")
    }
  }
  // el-table wider than its container without an explicit [data-scroll-x] wrapper
  for (const t of document.querySelectorAll(".el-table")) {
    if (!visible(t) || t.closest("[data-scroll-x]")) continue
    const body = t.querySelector(".el-table__body")
    if (body && body.getBoundingClientRect().width > t.getBoundingClientRect().width + 2) out.overflow.push("el-table body " + Math.round(body.getBoundingClientRect().width) + " > " + Math.round(t.getBoundingClientRect().width))
  }
  // text contrast on direct text nodes
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const seen = new Set()
  while (walker.nextNode()) {
    const t = walker.currentNode; if (!t.textContent.trim()) continue
    const el = t.parentElement; if (!el || !visible(el) || el.closest(".el-popper, .el-overlay, script, style")) continue
    const s = getComputedStyle(el); if (s.opacity === "0") continue
    if (el.closest("[disabled], .is-disabled, [aria-disabled='true'], .el-segmented")) continue
    const fg = parse(s.color); if (fg[3] === 0) continue
    const bg = bgOf(el)
    const r = ratio(fg, bg)
    const key = el.tagName + "|" + el.className + "|" + s.color + "|" + bg.join()
    if (r < 4.5 && !seen.has(key)) { seen.add(key); (isPalette(fg) && !isPalette(bg) ? out.palette : out.contrast).push({ text: t.textContent.trim().slice(0, 24), el: el.tagName.toLowerCase() + "." + [...el.classList].slice(0,2).join("."), ratio: +r.toFixed(2), fg: s.color, bg: "rgb(" + bg.slice(0,3).join(",") + ")" }) }
  }
  // placeholders
  for (const inp of document.querySelectorAll("input[placeholder], textarea[placeholder]")) {
    if (!visible(inp) || inp.value) continue
    const fg = parse(getComputedStyle(inp, "::placeholder").color); const bg = bgOf(inp); const r = ratio(fg, bg)
    if (r < 4.5) out.contrast.push({ text: "placeholder:" + inp.placeholder.slice(0, 16), ratio: +r.toFixed(2), fg: getComputedStyle(inp, "::placeholder").color, bg: "rgb(" + bg.slice(0,3).join(",") + ")" })
  }
  // hit targets: buttons, links, inputs, checkbox/radio/switch wrappers, tabs, pagination items
  for (const el of document.querySelectorAll("button, a[href], input:not([type=hidden]), textarea, .el-checkbox, .el-radio, .el-switch, .el-tabs__item, .el-pager li, .el-menu-item, .el-select__wrapper, .el-tag.is-closable, .el-anchor__link")) {
    if (!visible(el) || el.closest(".el-popper, .el-overlay")) continue
    const r = el.getBoundingClientRect()
    if (Math.min(r.width, r.height) < 40) out.small.push(el.tagName.toLowerCase() + "." + [...el.classList].slice(0,2).join(".") + " " + Math.round(r.width) + "x" + Math.round(r.height))
  }
  return out
})()`

for (const [vp, [width, height]] of Object.entries(contract.viewports)) {
  for (const theme of contract.themes) {
    const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: theme, deviceScaleFactor: 1 })
    const page = await ctx.newPage()
    const errors = []
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()) })
    page.on("pageerror", (e) => errors.push(String(e)))
    for (const route of contract.routes) {
      errors.length = 0
      await page.goto(`http://localhost:4174/apps/${slug}${route}?theme=${theme}`, { waitUntil: "networkidle" })
      await page.waitForTimeout(900)
      const r = await page.evaluate(audit)
      const tag = `${route} ${vp} ${theme}`
      if (r.scrollWidth > width) note("FAIL", `${tag}: document scrollWidth ${r.scrollWidth} > ${width}`)
      if (r.overflow.length) note("FAIL", `${tag}: ${r.overflow.length} element(s) past viewport: ${r.overflow.slice(0, 6).join("; ")}`)
      if (errors.length) note("FAIL", `${tag}: console errors: ${errors.slice(0, 3).join(" | ")}`)
      if (r.contrast.length) note("FAIL", `${tag}: ${r.contrast.length} text contrast < 4.5: ${r.contrast.slice(0, 6).map((c) => `${c.el ?? ""}"${c.text}" ${c.ratio} ${c.fg} on ${c.bg}`).join("; ")}`)
      if (r.palette.length) note("WARN", `${tag}: ${r.palette.length} official-palette text < 4.5 (kept, see gallery.json notes): ${r.palette.slice(0, 4).map((c) => `${c.el ?? ""}"${c.text}" ${c.ratio}`).join("; ")}`)
      if (r.small.length) note("WARN", `${tag}: ${r.small.length} hit target(s) < 40px: ${r.small.slice(0, 8).join("; ")}`)
      if (!r.overflow.length && !errors.length && !r.contrast.length && r.scrollWidth <= width) note("OK", tag)
    }
    await ctx.close()
  }
}
await browser.close()
server.close()
console.log(failures.length ? `\n${failures.length} FAIL` : "\nALL GATES PASSED")
process.exit(failures.length ? 1 : 0)
