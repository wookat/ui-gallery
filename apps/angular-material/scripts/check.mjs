import { chromium } from "playwright";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { join, extname } from "node:path";

const root = new URL("../../../", import.meta.url).pathname;
const dist = join(root, "apps/angular-material/dist");
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
  let file = join(dist, (req.url || "/").split("?")[0].replace(/^\/apps\/angular-material/, ""));
  if (!existsSync(file) || !extname(file)) file = join(dist, "index.html");
  res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise(resolve => server.listen(4174, resolve));

const browser = await chromium.launch();
const errors = [];
const cases = [
  ...["/login", "/", "/orders", "/form", "/settings", "/components", "/landing", "/chat"].flatMap(route => ["light", "dark"].map(theme => ({ route, theme, width: 375, height: 812 }))),
  ...["/login", "/", "/orders", "/form", "/settings", "/components", "/landing", "/chat"].map(route => ({ route, theme: "light", width: 1440, height: 900 })),
  { route: "/orders", theme: "light", width: 375, height: 812, state: "empty" },
  { route: "/orders", theme: "light", width: 375, height: 812, state: "loading" },
  { route: "/orders", theme: "light", width: 375, height: 812, state: "error" },
  { route: "/chat", theme: "light", width: 375, height: 812, state: "empty" },
  { route: "/", theme: "light", width: 375, height: 812, state: "loading" },
  ...["lucide", "tabler", "phosphor", "heroicons"].map(icons => ({ route: "/components", theme: "light", width: 375, height: 812, icons })),
  { route: "/", theme: "light", width: 375, height: 812, font: "inter" },
];
for (const test of cases) {
  const context = await browser.newContext({ viewport: { width: test.width, height: test.height }, colorScheme: test.theme });
  const page = await context.newPage();
  const localErrors = [];
  page.on("console", message => { if (message.type() === "error") localErrors.push(`console: ${message.text()}`); });
  page.on("pageerror", error => localErrors.push(`pageerror: ${error.message}`));
  const params = new URLSearchParams({ theme: test.theme });
  if (test.state) params.set("state", test.state);
  if (test.icons) params.set("icons", test.icons);
  if (test.font) params.set("font", test.font);
  await page.goto(`http://localhost:4174/apps/angular-material${test.route}?${params}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(450);
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  if (test.width === 375 && scrollWidth > 375) localErrors.push(`horizontal overflow: ${scrollWidth}`);
  if (localErrors.length) errors.push(`${test.route} ${params}: ${localErrors.join(" | ")}`);
  await context.close();
}
await browser.close();
server.close();
console.log(`checked ${cases.length} cases`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("console errors: 0");
  console.log("page errors: 0");
  console.log("mobile horizontal overflow: 0");
}
