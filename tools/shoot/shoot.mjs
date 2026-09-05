// Screenshot matrix for every built app: routes × viewports × themes.
// Usage: node tools/shoot/shoot.mjs [slug ...]   (defaults to all apps with dist/)
import { chromium } from "playwright";
import { readFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { createServer } from "node:http";
import { join, extname } from "node:path";

const root = new URL("../../", import.meta.url).pathname;
const contract = JSON.parse(readFileSync(join(root, "packages/spec/contract.json"), "utf8"));
const wanted = process.argv.slice(2);
const slugs = readdirSync(join(root, "apps")).filter(
  (s) => existsSync(join(root, "apps", s, "dist/index.html")) && (!wanted.length || wanted.includes(s)),
);

const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png" };
const server = createServer((req, res) => {
  const m = req.url.match(/^\/apps\/([^/]+)(\/.*)?$/);
  if (!m) return res.writeHead(404).end();
  const dist = join(root, "apps", m[1], "dist");
  let file = join(dist, (m[2] || "/").split("?")[0]);
  if (!existsSync(file) || !extname(file)) file = join(dist, "index.html");
  res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(4173, r));

const browser = await chromium.launch();
for (const slug of slugs) {
  const meta = JSON.parse(readFileSync(join(root, "apps", slug, "gallery.json"), "utf8"));
  const themes = meta.theme?.dark === false ? ["light"] : contract.themes;
  const out = join(root, "shots", slug);
  mkdirSync(out, { recursive: true });
  for (const [vp, [width, height]] of Object.entries(contract.viewports)) {
    for (const theme of themes) {
      const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: theme, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      for (const route of contract.routes) {
        const name = route === "/" ? "dashboard" : route.slice(1);
        await page.goto(`http://localhost:4173/apps/${slug}${route}?theme=${theme}`, { waitUntil: "networkidle" });
        await page.waitForTimeout(400);
        await page.screenshot({ path: join(out, `${name}__${vp}__${theme}.png`) });
        if (route === "/components") await page.screenshot({ path: join(out, `${name}__${vp}__${theme}__full.png`), fullPage: true });
      }
      await ctx.close();
    }
  }
  console.log(`shot ${slug}`);
}
await browser.close();
server.close();
