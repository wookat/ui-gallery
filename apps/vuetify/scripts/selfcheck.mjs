/* global URL, document, console, process */
import { createRequire } from "node:module"
import { readFileSync, existsSync } from "node:fs"
import { createServer } from "node:http"
import { join, extname } from "node:path"

const require = createRequire(import.meta.url)
const { chromium } = require("../../../tools/shoot/node_modules/playwright")
const executablePath = "/home/ubuntu/.local/bin/google-chrome"
const root = new URL("../../..", import.meta.url).pathname
const dist = join(root, "apps/vuetify/dist")
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2" }
const server = createServer((req, res) => {
  const filePath = join(dist, (req.url?.replace(/^\/apps\/vuetify/, "").split("?")[0] || "/"))
  const file = existsSync(filePath) && extname(filePath) ? filePath : join(dist, "index.html")
  res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" })
  res.end(readFileSync(file))
})
await new Promise((resolve) => server.listen(4174, resolve))

const routes = ["/login", "/", "/orders", "/form", "/settings", "/components", "/landing", "/chat"]
const sizes = [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 375, height: 812 }]
const failures = []
let checks = 0
const browser = await chromium.launch({ executablePath: existsSync(executablePath) ? executablePath : undefined })
for (const route of routes) {
  for (const theme of ["light", "dark"]) {
    for (const size of sizes) {
      const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, colorScheme: theme })
      const page = await context.newPage()
      const errors = []
      page.on("console", (message) => {
        if (message.type() === "error" || (message.type() === "warning" && message.text().includes("[Vue warn]"))) errors.push(message.text())
      })
      page.on("pageerror", (error) => errors.push(error.message))
      const url = `http://localhost:4174/apps/vuetify${route}?theme=${theme}`
      await page.goto(url, { waitUntil: "networkidle" })
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      checks += 1
      if (scrollWidth > size.width) failures.push(`${route} ${theme} ${size.name}: horizontal overflow ${scrollWidth}`)
      if (errors.length) failures.push(`${route} ${theme} ${size.name}: ${errors.join(" | ")}`)
      await context.close()
    }
  }
}
for (const route of ["/", "/orders", "/chat"]) {
  for (const state of ["loading", "empty", "error"]) {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } })
    const page = await context.newPage()
    const errors = []
    page.on("console", (message) => { if (message.type() === "error" || (message.type() === "warning" && message.text().includes("[Vue warn]"))) errors.push(message.text()) })
    page.on("pageerror", (error) => errors.push(error.message))
    await page.goto(`http://localhost:4174/apps/vuetify${route}?state=${state}`, { waitUntil: "networkidle" })
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    checks += 1
    if (scrollWidth > 375) failures.push(`${route} state=${state}: horizontal overflow ${scrollWidth}`)
    if (errors.length) failures.push(`${route} state=${state}: ${errors.join(" | ")}`)
    await context.close()
  }
}
for (const route of ["/", "/components"]) {
  for (const icons of ["lucide", "tabler", "phosphor", "heroicons"]) {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } })
    const page = await context.newPage()
    const errors = []
    page.on("console", (message) => { if (message.type() === "error" || (message.type() === "warning" && message.text().includes("[Vue warn]"))) errors.push(message.text()) })
    page.on("pageerror", (error) => errors.push(error.message))
    await page.goto(`http://localhost:4174/apps/vuetify${route}?icons=${icons}`, { waitUntil: "networkidle" })
    checks += 1
    if (errors.length) failures.push(`${route} icons=${icons}: ${errors.join(" | ")}`)
    await context.close()
  }
}
await browser.close()
server.close()
console.log(`selfcheck: ${checks} checks`)
if (failures.length) {
  console.log(`FAILURES: ${failures.length}`)
  failures.forEach((failure) => console.log(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log("FAILURES: 0")
}
