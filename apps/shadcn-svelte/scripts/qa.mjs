// Local QA gate for apps/shadcn-svelte: serves dist/, checks console errors,
// 375px horizontal overflow, interactive hit areas (>=40px) and a few review items.
// Usage: node apps/shadcn-svelte/scripts/qa.mjs
import { createRequire } from "node:module"
const { chromium } = createRequire(new URL("../../../tools/shoot/package.json", import.meta.url))(
  "playwright"
)
import { readFileSync, existsSync } from "node:fs"
import { createServer } from "node:http"
import { join, extname } from "node:path"

const root = new URL("../../../", import.meta.url).pathname
const slug = "shadcn-svelte"
const dist = join(root, "apps", slug, "dist")
const routes = ["/login", "/", "/orders", "/form", "/settings", "/components", "/landing", "/chat"]
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
}
const server = createServer((req, res) => {
  const m = req.url.match(/^\/apps\/([^/]+)(\/.*)?$/)
  if (!m) return res.writeHead(404).end()
  let file = join(dist, (m[2] || "/").split("?")[0])
  if (!existsSync(file) || !extname(file)) file = join(dist, "index.html")
  res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" })
  res.end(readFileSync(file))
})
await new Promise((r) => server.listen(4174, r))
const base = `http://localhost:4174/apps/${slug}`

const browser = await chromium.launch()
let failures = 0
const fail = (msg) => {
  failures++
  console.log("FAIL", msg)
}

const hitSelector = '[data-qa="hit"]'

for (const [vp, [width, height]] of Object.entries({ desktop: [1440, 900], mobile: [375, 812] })) {
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: theme })
    const page = await ctx.newPage()
    const errors = []
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()))
    page.on("pageerror", (e) => errors.push(String(e)))
    for (const route of routes) {
      await page.goto(`${base}${route}?theme=${theme}`, { waitUntil: "networkidle" })
      await page.waitForTimeout(300)
      const label = `${route} ${vp} ${theme}`
      const sw = await page.evaluate(() => document.documentElement.scrollWidth)
      if (sw > width) fail(`${label}: scrollWidth ${sw} > ${width}`)
      const small = await page.evaluate((sel) => {
        const out = []
        for (const el of document.querySelectorAll(sel)) {
          if (el.closest("[data-qa-skip]")) continue
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) continue
          const cs = getComputedStyle(el)
          if (cs.visibility === "hidden" || cs.pointerEvents === "none") continue
          if (el.tagName === "INPUT" && el.type === "range") continue
          if (r.height < 40 || r.width < 40)
            out.push(
              `${el.tagName.toLowerCase()}${el.getAttribute("aria-label") ? `[${el.getAttribute("aria-label")}]` : ""} "${(el.textContent || "").trim().slice(0, 12)}" ${Math.round(r.width)}x${Math.round(r.height)}`
            )
        }
        return out
      }, hitSelector)
      if (small.length)
        fail(`${label}: hit<40px ${small.length}: ${small.slice(0, 12).join(" | ")}`)
      if (route === "/form") {
        const checked = await page.evaluate(
          () =>
            document.querySelectorAll('[data-qa="project-type"] [role=radio][aria-checked="true"]')
              .length
        )
        const total = await page.evaluate(
          () => document.querySelectorAll('[data-qa="project-type"] [role=radio]').length
        )
        console.log(`${label}: radios ${checked}/${total} checked`)
        if (checked > 1) fail(`${label}: ${checked} radios checked in project type group`)
      }
      if (route === "/chat") {
        const ok = await page.evaluate(
          () => [...document.querySelectorAll('[data-slot="bubble"][data-align="end"]')].length > 0
        )
        if (!ok) fail(`${label}: no user bubble (data-slot=bubble align=end)`)
      }
      if (route === "/orders" && vp === "desktop") {
        const raw = await page.evaluate(() =>
          [...document.querySelectorAll('[data-slot="badge"]')]
            .map((b) => b.textContent.trim())
            .filter((t) => /^(paid|pending|shipped|refunded|failed)$/.test(t))
        )
        if (raw.length) fail(`${label}: raw status keys ${raw.join(",")}`)
      }
    }
    if (errors.length) fail(`${vp} ${theme}: console errors ${JSON.stringify(errors.slice(0, 5))}`)
    await ctx.close()
  }
}

// font loading check
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  for (const font of ["inter", "geist", "noto-sans-sc", "lxgw-wenkai"]) {
    await page.goto(`${base}/?font=${font}`, { waitUntil: "networkidle" })
    await page.waitForTimeout(500)
    const info = await page.evaluate(async () => {
      await document.fonts.ready
      const family = getComputedStyle(document.body).fontFamily
      const loaded = [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family)
      const check = document.fonts.check(`16px ${family.split(",")[0]}`)
      return { family, loaded: [...new Set(loaded)], check }
    })
    console.log(`font=${font}: ${info.family} loaded=${info.loaded.join(",")} check=${info.check}`)
    if (!info.loaded.length) fail(`font=${font}: no loaded font faces`)
  }
  // ?icon= alias
  await page.goto(`${base}/?icon=tabler`, { waitUntil: "networkidle" })
  const tabler = await page.evaluate(
    () => document.querySelectorAll("svg.tabler-icon, svg[class*=tabler]").length
  )
  console.log(`?icon=tabler svg count=${tabler}`)
  if (!tabler) fail("?icon=tabler not applied")
  await ctx.close()
}

await browser.close()
server.close()
console.log(failures ? `QA: ${failures} failure(s)` : "QA: all checks passed")
process.exit(failures ? 1 : 0)
