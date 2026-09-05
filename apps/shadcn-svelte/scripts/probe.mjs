// 本地质量门探针：静态服务 dist，逐路由检查 console/page error、375 溢出、图标切换、点击热区。
// 用法：node scripts/probe.mjs  （需先 pnpm build）
import { createRequire } from "node:module"
const { chromium } = createRequire(new URL("../../../tools/shoot/package.json", import.meta.url))(
  "playwright"
)
import { readFileSync, existsSync } from "node:fs"
import { createServer } from "node:http"
import { join, extname } from "node:path"

const root = new URL("../", import.meta.url).pathname
const slug = "shadcn-svelte"
const dist = join(root, "dist")
const routes = ["/login", "/", "/orders", "/form", "/settings", "/components", "/landing", "/chat"]
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
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

for (const [vp, w, h] of [
  ["desktop", 1440, 900],
  ["mobile", 375, 812],
]) {
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme })
    const page = await ctx.newPage()
    const errors = []
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()))
    page.on("pageerror", (e) => errors.push(String(e)))
    for (const route of routes) {
      await page.goto(`${base}${route}?theme=${theme}`, { waitUntil: "networkidle" })
      await page.waitForTimeout(300)
      const sw = await page.evaluate(() => document.documentElement.scrollWidth)
      if (sw > w) fail(`${route} ${vp} ${theme} scrollWidth=${sw}>${w}`)
      const small = await page.evaluate(() => {
        const out = []
        for (const el of document.querySelectorAll(
          "button, a[href], input, select, [role=button]"
        )) {
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) continue
          if (el.closest("[data-slot=badge]")) continue
          if (r.height < 40 && !el.closest("[data-probe-ignore]"))
            out.push(
              `${el.tagName}.${(el.className || "").toString().slice(0, 40)} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 20)}"`
            )
        }
        return out
      })
      if (small.length)
        console.log(
          `  info ${route} ${vp} ${theme} <40px targets: ${small.length}\n    ` +
            small.slice(0, 8).join("\n    ")
        )
      if (route === "/login" && theme === "light" && vp === "desktop") {
        await page.getByRole("button", { name: "登录", exact: true }).click()
        const invalid = await page.locator('[aria-invalid="true"]').count()
        const alert = await page.getByText("请修正表单中的错误", { exact: true }).count()
        if (invalid < 2 || alert !== 1) fail(`login empty submit invalid=${invalid} alert=${alert}`)
      }
      if (route === "/orders" && theme === "light" && vp === "desktop") {
        const before = Number(
          (await page.getByText(/显示 \d+ 条订单/).innerText()).match(/\d+/)?.[0]
        )
        await page.locator('[aria-label="订单操作"]').first().click()
        await page.getByText("删除", { exact: true }).click()
        await page.getByText("确认删除", { exact: true }).click()
        await page.waitForTimeout(600)
        const after = Number(
          (await page.getByText(/显示 \d+ 条订单/).innerText()).match(/\d+/)?.[0]
        )
        const toast = await page.locator("[data-sonner-toast]").count()
        if (after !== before - 1 || toast < 1)
          fail(`orders delete before=${before} after=${after} toast=${toast}`)
      }
      if (route === "/" && theme === "light" && vp === "desktop") {
        const inside = await page.evaluate(() => {
          const button = document.querySelector('button[aria-label="通知"]')
          const dot = button?.querySelector('[data-slot="badge"]')
          if (!button || !dot) return false
          const b = button.getBoundingClientRect()
          const d = dot.getBoundingClientRect()
          return d.left >= b.left && d.right <= b.right && d.top >= b.top && d.bottom <= b.bottom
        })
        if (!inside) fail("notification dot is outside notification button")
      }
    }
    if (errors.length) fail(`${vp} ${theme} console/page errors:\n  ${errors.join("\n  ")}`)
    await ctx.close()
  }
}

// 图标切换检查
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  for (const route of ["/", "/orders", "/components"]) {
    const counts = {}
    for (const fam of ["lucide", "tabler", "phosphor", "heroicons"]) {
      await page.goto(`${base}${route}?icons=${fam}`, { waitUntil: "networkidle" })
      counts[fam] = await page.evaluate(() => {
        const svgs = [...document.querySelectorAll("svg")]
        const appLucide = svgs.filter(
          (s) => s.classList.contains("lucide") && !s.closest("[data-slot]")
        )
        return {
          total: svgs.length,
          lucide: svgs.filter((s) => s.classList.contains("lucide")).length,
          appLucide: appLucide.length,
        }
      })
    }
    console.log(`icons ${route}`, JSON.stringify(counts))
    for (const fam of ["tabler", "phosphor", "heroicons"]) {
      console.log(`  app-owned lucide ${route} ${fam}: ${counts[fam].appLucide}`)
      if (counts[fam].appLucide > 0)
        fail(`${route} ?icons=${fam} still has ${counts[fam].appLucide} app lucide svgs`)
    }
  }
  await ctx.close()
}

await browser.close()
server.close()
console.log(failures ? `${failures} failures` : "probe OK")
process.exit(failures ? 1 : 0)
