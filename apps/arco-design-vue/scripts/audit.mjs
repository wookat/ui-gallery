/* global document, getComputedStyle, location */
// 本地质量门：375/1440 × light/dark × 8 路由 → 横向溢出元素、console/page error、<40px 图标按钮
// Usage: node apps/arco-design-vue/scripts/audit.mjs   (需先 pnpm --filter arco-design-vue build)
import { createServer } from "node:http"
import { readFileSync, existsSync } from "node:fs"
import { join, extname } from "node:path"

const root = new URL("../../../", import.meta.url).pathname
const { chromium } = await import(join(root, "tools/shoot/node_modules/playwright/index.mjs"))
const slug = "arco-design-vue"
const contract = JSON.parse(readFileSync(join(root, "packages/spec/contract.json"), "utf8"))
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2" }
const server = createServer((req, res) => {
  const m = req.url.match(/^\/apps\/([^/]+)(\/.*)?$/)
  if (!m) return res.writeHead(404).end()
  const dist = join(root, "apps", m[1], "dist")
  let file = join(dist, (m[2] || "/").split("?")[0])
  if (!existsSync(file) || !extname(file)) file = join(dist, "index.html")
  res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" })
  res.end(readFileSync(file))
})
await new Promise((r) => server.listen(4174, r))

const browser = await chromium.launch()
let problems = 0
for (const [vp, [width, height]] of Object.entries(contract.viewports)) {
  for (const theme of contract.themes) {
    const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: theme })
    const page = await ctx.newPage()
    const errors = []
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()))
    page.on("pageerror", (err) => errors.push(String(err)))
    for (const route of contract.routes) {
      await page.goto(`http://localhost:4174/apps/${slug}${route}?theme=${theme}`, { waitUntil: "networkidle" })
      await page.waitForTimeout(500)
      const report = await page.evaluate((vw) => {
        const out = { overflow: [], small: [] }
        const seen = new Set()
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) continue
          const style = getComputedStyle(el)
          if (style.position === "fixed" || el.closest(".arco-trigger-popup, .arco-modal-container, .arco-drawer-container, .arco-overlay, .arco-tabs-content-item:not(.arco-tabs-content-item-active)")) continue
          if (r.right > vw + 1 && !el.closest(".arco-table, .scroll-x, pre, .arco-tabs-nav-tab, .arco-carousel, .arco-scrollbar-container")) {
            const key = el.className?.toString().slice(0, 60) + el.tagName
            if (!seen.has(key)) {
              seen.add(key)
              out.overflow.push(`${el.tagName}.${key} right=${Math.round(r.right)} w=${Math.round(r.width)}`)
            }
          }
        }
        // 图标类按钮（无文字的 .arco-btn / Alert 关闭按钮）热区须 ≥40×40；/components 展示区按 size 演示不计
        if (!location.pathname.endsWith("/components")) {
          for (const el of document.querySelectorAll("button.arco-btn, .arco-alert-close-btn")) {
            const r = el.getBoundingClientRect()
            if (r.width === 0 || r.height === 0) continue
            if (el.closest(".arco-trigger-popup, .arco-modal-container, .arco-drawer-container, .arco-tabs-content-item:not(.arco-tabs-content-item-active)")) continue
            const text = (el.textContent || "").trim()
            if (text.length > 0) continue
            if (r.width < 40 || r.height < 40) out.small.push(`${el.tagName}.${el.className.toString().slice(0, 60)} ${Math.round(r.width)}×${Math.round(r.height)}`)
          }
        }
        return out
      }, width)
      const sw = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.querySelector(".shell-content")?.scrollWidth ?? 0))
      const bad = report.overflow.length || report.small.length || sw > width
      if (bad) problems++
      console.log(`${route} ${vp} ${theme} scrollWidth=${sw}${bad ? " ✗" : " ✓"}`)
      for (const o of report.overflow) console.log("   overflow:", o)
      for (const s of report.small.slice(0, 40)) console.log("   small:", s)
    }
    if (errors.length) {
      problems++
      console.log(`console errors ${vp} ${theme}:`, errors.slice(0, 10))
    }
    await ctx.close()
  }
}
await browser.close()
server.close()
console.log(problems ? `\n${problems} problem group(s)` : "\nall clean")
process.exit(problems ? 1 : 0)
