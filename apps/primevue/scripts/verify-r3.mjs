import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import { extname, join } from "node:path"
import { chromium } from "../../../tools/shoot/node_modules/playwright/index.mjs"

const dist = new URL("../dist/", import.meta.url).pathname
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".woff": "font/woff", ".svg": "image/svg+xml" }
const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://x")
  let file = join(dist, url.pathname.replace(/^\/apps\/primevue/, ""))
  try { if ((await stat(file)).isDirectory()) throw 0 } catch { file = join(dist, "index.html") }
  try { res.setHeader("content-type", types[extname(file)] ?? "application/octet-stream"); res.end(await readFile(file)) } catch { res.statusCode = 404; res.end() }
}).listen(4175)

const browser = await chromium.launch()
for (const theme of ["light", "dark"]) for (const [vw, vh] of [[1440, 900], [375, 812]]) {
  const page = await browser.newPage({ viewport: { width: vw, height: vh } })
  const errors = []
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()))
  page.on("pageerror", (e) => errors.push(String(e)))
  const go = async (route) => { await page.goto(`http://localhost:4175/apps/primevue${route}?theme=${theme}`, { waitUntil: "networkidle" }); await page.waitForTimeout(600) }
  const rect = (sel) => page.$$eval(sel, (ns) => ns.map((n) => { const r = n.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right), Math.round(r.width)] }))
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  const tag = `${theme}/${vw}`
  await go("/components")
  console.log(tag, "dataview", await page.$$eval(".p-dataview", (n) => n.length), "carousel items", JSON.stringify(await rect(".p-carousel-item")), "galleria item", JSON.stringify(await rect(".p-galleria-item")), "galleria", JSON.stringify(await rect(".p-galleria")), "overflow", await overflow())
  await page.click("button:has-text('ConfirmPopup')")
  await page.waitForTimeout(500)
  console.log(tag, "popup", await page.$$eval(".p-confirmpopup", (n) => n.length), "dialog", await page.$$eval(".p-confirmdialog", (n) => n.length))
  await go("/chat")
  console.log(tag, "chips", JSON.stringify(await rect(".suggestion-chip")), "overflow", await overflow())
  for (const r of ["/", "/orders", "/form", "/settings", "/landing", "/login"]) { await go(r); const o = await overflow(); if (o) console.log(tag, r, "OVERFLOW", o) }
  console.log(tag, "console errors:", errors.length, errors.slice(0, 3).join(" | "))
  await page.close()
}
await browser.close(); server.close()
