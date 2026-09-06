import { chromium } from "playwright"
import { readFileSync, existsSync } from "node:fs"
import { createServer } from "node:http"
import { join, extname } from "node:path"

const root = new URL("../../../", import.meta.url).pathname
const dist = join(root, "apps/kobalte/dist")
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml" }
const server = createServer((req, res) => {
  const m = req.url.match(/^\/apps\/kobalte(\/.*)?$/)
  if (!m) return res.writeHead(404).end()
  let file = join(dist, (m[1] || "/").split("?")[0])
  if (!existsSync(file) || !extname(file)) file = join(dist, "index.html")
  res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" })
  res.end(readFileSync(file))
})
await new Promise((r) => server.listen(4174, r))
const base = "http://localhost:4174/apps/kobalte"
const routes = ["/login", "/", "/orders", "/form", "/settings", "/components", "/landing", "/chat"]
const browser = await chromium.launch()
const errors = []
for (const [w, h] of [[1440, 900], [375, 812]]) {
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } })
    const page = await ctx.newPage()
    page.on("console", (m) => m.type() === "error" && errors.push(`${w}/${theme} ${page.url()}: ${m.text()}`))
    page.on("pageerror", (e) => errors.push(`${w}/${theme} ${page.url()}: ${e.message}`))
    for (const r of routes) {
      await page.goto(`${base}${r}?theme=${theme}`, { waitUntil: "networkidle" })
      const sw = await page.evaluate(() => document.documentElement.scrollWidth)
      if (sw > w) console.log(`OVERFLOW ${w}/${theme} ${r}: ${sw}`)
    }
    await ctx.close()
  }
}
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.goto(`${base}/landing?theme=dark`, { waitUntil: "networkidle" })
console.log("landing nav color dark:", await page.evaluate(() => getComputedStyle(document.querySelector("header nav a")).color))
await page.goto(`${base}/components?theme=dark`, { waitUntil: "networkidle" })
console.log("rating stars dark:", await page.evaluate(() => [...document.querySelectorAll("[role=radiogroup] [data-checked], [data-half]")].slice(0, 6).map((e) => getComputedStyle(e).color)))
console.log("rating star count checked:", await page.evaluate(() => document.querySelectorAll("[data-checked]").length))
await page.goto(`${base}/?font=lxgw-wenkai`, { waitUntil: "networkidle" })
await page.evaluate(() => document.fonts.ready)
console.log("lxgw loaded:", await page.evaluate(() => [...document.fonts].filter((f) => f.family.includes("LXGW") && f.status === "loaded").length), "body font:", await page.evaluate(() => getComputedStyle(document.body).fontFamily))
const m = await browser.newContext({ viewport: { width: 375, height: 812 } })
const mp = await m.newPage()
await mp.goto(`${base}/orders`, { waitUntil: "networkidle" })
console.log("orders mobile hint visible:", await mp.evaluate(() => [...document.querySelectorAll("p")].some((p) => p.textContent.includes("左右滑动") && p.offsetParent !== null)))
await browser.close()
server.close()
console.log("console errors:", errors.length, errors.slice(0, 5))
