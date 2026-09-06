// Ad-hoc audit against the visual review checklist. Run after `pnpm --filter primevue build`
// with the shooter's static server pattern: node apps/primevue/scripts/audit-check.mjs
import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import { extname, join } from "node:path"
import { chromium } from "playwright"

const dist = new URL("../dist/", import.meta.url).pathname
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".woff": "font/woff", ".svg": "image/svg+xml" }
const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://x")
  let file = join(dist, url.pathname.replace(/^\/apps\/primevue/, ""))
  try { if ((await stat(file)).isDirectory()) throw 0 } catch { file = join(dist, "index.html") }
  try { res.setHeader("content-type", types[extname(file)] ?? "application/octet-stream"); res.end(await readFile(file)) } catch { res.statusCode = 404; res.end() }
}).listen(4174)

const lum = (c) => { const [r, g, b] = c.match(/\d+/g).map(Number).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return ((l1 + 0.05) / (l2 + 0.05)).toFixed(2) }

const browser = await chromium.launch()
const out = []
for (const theme of ["light", "dark"]) for (const [vw, vh] of [[1440, 900], [375, 812]]) {
  const page = await browser.newPage({ viewport: { width: vw, height: vh } })
  const errors = []
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()))
  page.on("pageerror", (e) => errors.push(String(e)))
  const go = async (route) => { await page.goto(`http://localhost:4174/apps/primevue${route}?theme=${theme}`, { waitUntil: "networkidle" }); await page.waitForTimeout(600) }
  const bg = (sel) => page.$eval(sel, (el) => { let n = el; while (n) { const b = getComputedStyle(n).backgroundColor; if (b && b !== "rgba(0, 0, 0, 0)") return b; n = n.parentElement } return "rgb(255, 255, 255)" })
  const fg = (sel) => page.$eval(sel, (el) => getComputedStyle(el).color)
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  const tag = `${theme}/${vw}`

  await go("/components")
  out.push(`${tag} /components inline code contrast ${ratio(await fg(".typography-demo code"), await bg(".typography-demo code"))} overflow ${await overflow()} inlineCalendar ${await page.$$eval(".p-datepicker-panel-inline", (n) => n.length)}`)
  await go("/chat")
  const pre = await page.$(".markdown pre code")
  if (pre) out.push(`${tag} /chat code contrast ${ratio(await fg(".markdown pre code"), await bg(".markdown pre code"))} pre.scrollW>clientW ${await page.$eval(".markdown pre", (el) => `${el.scrollWidth}>${el.clientWidth} overflowX=${getComputedStyle(el).overflowX}`)} stream.scrollW-clientW ${await page.$eval(".message-stream", (el) => el.scrollWidth - el.clientWidth)} overflow ${await overflow()} copy ${JSON.stringify(await page.$eval(".copy-code", (el) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)] }))}`)
  else out.push(`${tag} /chat NO PRE FOUND`)
  await go("/landing")
  out.push(`${tag} /landing logo contrast ${ratio(await fg(".logo-cloud span"), await bg(".logo-cloud span"))} logoBg ${await bg(".logo-cloud span")} nav ${JSON.stringify(await page.$$eval(".landing-links a", (ns) => ns.map((n) => Math.round(n.getBoundingClientRect().height))))} overflow ${await overflow()}`)
  await go("/orders")
  out.push(`${tag} /orders amount align ${await page.$eval("td.amount-col", (el) => getComputedStyle(el).textAlign)} header ${await page.$eval("th.amount-col", (el) => getComputedStyle(el).textAlign)} hintVisible ${await page.$eval(".scroll-hint", (el) => getComputedStyle(el).display)} overflow ${await overflow()}`)
  await go("/login")
  out.push(`${tag} /login links ${JSON.stringify(await page.$$eval(".inline-link", (ns) => ns.map((n) => { const r = n.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)] })))} linkContrast ${ratio(await fg(".inline-link"), await bg(".inline-link"))} overflow ${await overflow()}`)
  await go("/form")
  out.push(`${tag} /form step ${JSON.stringify(await page.$$eval(".p-step-header", (ns) => ns.map((n) => Math.round(n.getBoundingClientRect().height))))} overflow ${await overflow()}`)
  for (const r of ["/", "/settings"]) { await go(r); out.push(`${tag} ${r} overflow ${await overflow()}`) }
  out.push(`${tag} console errors: ${errors.length} ${errors.slice(0, 3).join(" | ")}`)
  await page.close()
}
console.log(out.join("\n"))
await browser.close(); server.close()
