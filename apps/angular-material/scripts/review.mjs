import { chromium } from "playwright";
import { existsSync, readFileSync, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { join, extname } from "node:path";

const root = new URL("../../../", import.meta.url).pathname;
const dist = join(root, "apps/angular-material/dist");
const out = "/home/ubuntu/am-shots";
mkdirSync(out, { recursive: true });
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
  let file = join(dist, (req.url || "/").split("?")[0].replace(/^\/apps\/angular-material/, ""));
  if (!existsSync(file) || !extname(file)) file = join(dist, "index.html");
  res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise(resolve => server.listen(4175, resolve));
const browser = await chromium.launch();
const captures = [
  ["components-light-1440", "/components?theme=light", 1440, 900],
  ["components-dark-1440", "/components?theme=dark", 1440, 900],
  ["components-light-375", "/components?theme=light", 375, 812],
  ["components-dark-375", "/components?theme=dark", 375, 812],
  ["dashboard", "/?theme=light", 1440, 900],
  ["orders", "/orders?theme=light", 1440, 900],
  ["form", "/form?theme=light", 1440, 900],
  ["landing", "/landing?theme=light", 1440, 900],
  ["chat", "/chat?theme=dark", 1440, 900],
];
for (const [name, route, width, height] of captures) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`http://localhost:4175/apps/angular-material${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(450);
  await page.screenshot({ path: join(out, `${name}.png`), fullPage: name.startsWith("components") });
  await page.close();
}
await browser.close();
server.close();
console.log(`saved ${captures.length} review screenshots to ${out}`);
