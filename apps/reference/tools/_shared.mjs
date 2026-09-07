// shoot / compare / a11y 共用：静态服务、视口、状态清单、Playwright（复用 tools/shoot 固定的 1.62.1）
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

export const appDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const repo = resolve(appDir, "../..");
export const shotsRoot = join(repo, "shots", "reference");
export const BASE = "/apps/reference";

const requireShoot = createRequire(join(repo, "tools/shoot/package.json"));
export const { chromium } = requireShoot("playwright");

const tokens = JSON.parse(readFileSync(join(repo, "design/tokens.json"), "utf8"));
const bp = (k) => tokens.breakpoint[k].$value.value;
// 与 design/hifi/<screen>/check.mjs 一致：desktop 1440×900、mobile 375×812；宽度取自 tokens.breakpoint（xl / sm）
export const viewports = {
  desktop: { width: bp("xl"), height: 900 },
  mobile: { width: bp("sm"), height: 812 },
};
/** 附加视口（tablet 1024×900 / tabletSm 768×1024）：仅 shots.json 条目显式列出 `viewports: ["tablet"]` 时截图，与 hifi check.mjs 命名一致 */
export const extraViewports = {
  tablet: { width: bp("lg"), height: 900 },
  tabletSm: { width: bp("md"), height: 1024 },
};
export const themes = ["light", "dark"];
/** 热区下限：tokens.size.hit（40） */
export const hitMin = tokens.size.hit.$value.value;

export function listScreens() {
  return readdirSync(join(appDir, "src/pages"), { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(appDir, "src/pages", d.name, "index.tsx")))
    .map((d) => d.name);
}

export function screenArg() {
  const screen = process.argv.find((a) => !a.startsWith("-") && a !== process.argv[0] && a !== process.argv[1]);
  const screens = listScreens();
  if (!screen || !screens.includes(screen)) {
    console.error(`用法：node tools/<tool>.mjs <screen>  可选：${screens.join(" | ")}`);
    process.exit(2);
  }
  return screen;
}

export const routeOf = (screen) => (screen === "dashboard" ? "/" : `/${screen}`);

/**
 * 状态清单：src/pages/<id>/shots.json —— [{ name, query, overlay? }]
 * 未提供时默认 default / loading / empty / error（?state=）。
 */
export function shotList(screen) {
  const file = join(appDir, "src/pages", screen, "shots.json");
  if (existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));
  return ["default", "loading", "empty", "error"].map((s) => ({ name: s, query: `state=${s}` }));
}

const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".md": "text/markdown",
};

/** 静态服务 apps/reference/dist（缺失或 --build 时先 pnpm build） */
export async function serveDist() {
  const dist = join(appDir, "dist");
  if (!existsSync(join(dist, "index.html")) || process.argv.includes("--build")) {
    console.log("building apps/reference …");
    execFileSync("pnpm", ["build"], { cwd: appDir, stdio: "inherit" });
  }
  const server = createServer((req, res) => {
    const path = decodeURIComponent(req.url.split("?")[0]);
    if (!path.startsWith(BASE)) return res.writeHead(404).end();
    let file = join(dist, path.slice(BASE.length) || "/");
    if (!existsSync(file) || !extname(file)) file = join(dist, "index.html");
    res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" });
    res.end(readFileSync(file));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const origin = `http://127.0.0.1:${server.address().port}`;
  return { origin, close: () => server.close() };
}

export function pageUrl(origin, screen, query, theme) {
  const q = [query, `theme=${theme}`].filter(Boolean).join("&");
  return `${origin}${BASE}${routeOf(screen)}?${q}`;
}

export async function openPage(browser, vp, theme) {
  const ctx = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: 1,
    colorScheme: theme,
    locale: "zh-CN",
    timezoneId: "Asia/Shanghai",
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  return { ctx, page, errors };
}

export async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
}
