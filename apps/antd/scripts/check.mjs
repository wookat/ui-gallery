import { chromium } from "../../../tools/shoot/node_modules/playwright/index.mjs"
import { createServer } from "node:http"
import { existsSync, readFileSync } from "node:fs"
import { extname, join } from "node:path"
const root = new URL("../../../", import.meta.url).pathname
const routes = ["/login", "/", "/orders", "/form", "/settings", "/components", "/landing", "/chat"]
const themes = ["light", "dark"]
const viewports = [{ name: "mobile", width: 375, height: 812 }, { name: "desktop", width: 1440, height: 900 }]
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2" }
const server = createServer((req, res) => {
  const requested = new URL(req.url, "http://localhost").pathname
  let file = join(root, "apps/antd/dist", requested.replace(/^\/apps\/antd\/?/, "") || "index.html")
  if (!existsSync(file) || !extname(file)) file = join(root, "apps/antd/dist/index.html")
  res.writeHead(200, { "content-type": mime[extname(file)] ?? "application/octet-stream" })
  res.end(readFileSync(file))
})
await new Promise((resolve) => server.listen(4174, "127.0.0.1", resolve))
const browser = await chromium.launch({ headless: true })
const rows = []
for (const route of routes) for (const theme of themes) for (const viewport of viewports) {
  const page = await browser.newPage({ viewport })
  const errors = []
  page.on("console", (msg) => { if (msg.type() === "error" || msg.type() === "warning") errors.push(msg.text()) })
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto(`http://127.0.0.1:4174/apps/antd${route}?theme=${theme}`, { waitUntil: "networkidle" })
  const width = await page.evaluate(() => document.documentElement.scrollWidth)
  rows.push({ route, theme, viewport: viewport.name, width, errors: errors.length })
  if (viewport.name === "mobile" && width > 375) rows.at(-1).overflow = true
  if (errors.length) rows.at(-1).errorMessages = errors
  await page.close()
}
console.table(rows)
await browser.close()
server.close()
const failures = rows.filter((row) => row.overflow || row.errors)
if (failures.length) {
  for (const failure of failures) console.error(`${failure.route} ${failure.theme} ${failure.viewport}: ${failure.overflow ? `overflow ${failure.width}` : failure.errorMessages.join("; ")}`)
  process.exitCode = 1
}
