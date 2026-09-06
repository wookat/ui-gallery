// 本地质量门：8 路由 × 2 视口 × 2 主题，检查横向溢出、console error、移动端主要按钮热区。
import { createRequire } from "node:module"
const { chromium } = createRequire(new URL("../../../tools/shoot/", import.meta.url))("playwright")
import { readFileSync, existsSync } from "node:fs"
import { createServer } from "node:http"
import { join, extname } from "node:path"

const root = new URL("../../../", import.meta.url).pathname
const contract = JSON.parse(readFileSync(join(root, "packages/spec/contract.json"), "utf8"))
const dist = join(root, "apps/tdesign-react/dist")
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png" }
const server = createServer((req, res) => {
  const m = req.url.match(/^\/apps\/tdesign-react(\/.*)?$/)
  if (!m) return res.writeHead(404).end()
  let file = join(dist, (m[1] || "/").split("?")[0])
  if (!existsSync(file) || !extname(file)) file = join(dist, "index.html")
  res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" })
  res.end(readFileSync(file))
})
await new Promise((r) => server.listen(4174, r))
const browser = await chromium.launch()
const problems = []
for (const [vp, [width, height]] of Object.entries(contract.viewports)) {
  for (const theme of contract.themes) {
    const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: theme })
    const page = await ctx.newPage()
    const errors = []
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()))
    page.on("pageerror", (err) => errors.push(String(err)))
    for (const route of contract.routes) {
      await page.goto(`http://localhost:4174/apps/tdesign-react${route}?theme=${theme}`, { waitUntil: "networkidle" })
      await page.waitForTimeout(400)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      if (overflow > 0) problems.push(`${route} ${vp} ${theme}: 横向溢出 ${overflow}px`)
      if (vp === "mobile") {
        const small = await page.evaluate(() =>
          [...document.querySelectorAll("button.t-button:not(.t-size-s)")]
            .filter((b) => b.closest(".t-input, .t-table, .chat-code, .t-dialog, .t-drawer, .component-demo-panel") === null)
            .map((b) => ({ text: b.textContent.trim().slice(0, 12) || b.getAttribute("aria-label") || "icon", r: b.getBoundingClientRect() }))
            .filter(({ r }) => r.width > 0 && (Math.round(r.height) < 40 || Math.round(r.width) < 40))
            .map(({ text, r }) => `${text} ${Math.round(r.width)}×${Math.round(r.height)}`),
        )
        if (small.length) problems.push(`${route} ${vp} ${theme}: 热区<40px → ${small.join(", ")}`)
      }
    }
    if (errors.length) problems.push(`${vp} ${theme}: console errors → ${[...new Set(errors)].join(" | ")}`)
    await ctx.close()
  }
}
await browser.close()
server.close()
if (problems.length) {
  console.log(problems.join("\n"))
  process.exit(1)
}
console.log("audit ok: 无横向溢出、0 console error、移动端主要按钮 ≥40px")
