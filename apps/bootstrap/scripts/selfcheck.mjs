// Local QA: for every route × viewport × theme, assert 0 console errors and no horizontal overflow at 375px.
import { createRequire } from "node:module"
const { chromium } = createRequire(new URL("../../../tools/shoot/shoot.mjs", import.meta.url))("playwright")
import { readFileSync, existsSync } from "node:fs"
import { createServer } from "node:http"
import { join, extname } from "node:path"

const root = new URL("../../../", import.meta.url).pathname
const contract = JSON.parse(readFileSync(join(root, "packages/spec/contract.json"), "utf8"))
const dist = join(root, "apps/bootstrap/dist")
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2" }
const server = createServer((req, res) => {
  let file = join(dist, (req.url.replace(/^\/apps\/bootstrap/, "") || "/").split("?")[0])
  if (!existsSync(file) || !extname(file)) file = join(dist, "index.html")
  res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" }).end(readFileSync(file))
})
await new Promise((r) => server.listen(4174, r))

const browser = await chromium.launch()
let failures = 0
for (const [vp, [width, height]] of Object.entries(contract.viewports)) {
  for (const theme of contract.themes) {
    const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: theme })
    const page = await ctx.newPage()
    const errors = []
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()))
    page.on("pageerror", (e) => errors.push(e.message))
    for (const route of contract.routes) {
      errors.length = 0
      await page.goto(`http://localhost:4174/apps/bootstrap${route}?theme=${theme}`, { waitUntil: "networkidle" })
      await page.waitForTimeout(300)
      const sw = await page.evaluate(() => document.documentElement.scrollWidth)
      const ok = errors.length === 0 && sw <= width
      if (!ok) failures++
      console.log(`${ok ? "ok  " : "FAIL"} ${vp}/${theme} ${route.padEnd(12)} scrollWidth=${sw} errors=${errors.length}${errors.length ? " " + errors.join(" | ").slice(0, 300) : ""}`)
    }
    await ctx.close()
  }
}
await browser.close()
server.close()
process.exit(failures ? 1 : 0)
