import { chromium } from "playwright";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { join, extname } from "node:path";

const root = new URL("../../../", import.meta.url).pathname;
const dist = join(root, "apps/angular-material/dist");
const routes = ["/login", "/", "/orders", "/form", "/settings", "/components", "/landing", "/chat"];
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
  let file = join(dist, (req.url || "/").split("?")[0].replace(/^\/apps\/angular-material/, ""));
  if (!existsSync(file) || !extname(file)) file = join(dist, "index.html");
  res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise(resolve => server.listen(4175, resolve));

const rgb = (value) => {
  const match = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
};
const contrast = (foreground, background) => {
  const toLinear = (channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const fg = rgb(foreground);
  const bg = rgb(background);
  if (!fg || !bg) return null;
  const luminance = ([r, g, b]) => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  const [light, dark] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
};

async function scrollFullPage(page) {
  await page.evaluate(async () => {
    for (let top = 0; top < document.documentElement.scrollHeight; top += Math.max(240, innerHeight - 80)) {
      scrollTo(0, top);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }
    scrollTo(0, 0);
  });
}

async function checkOverflow(page, width) {
  await scrollFullPage(page);
  return page.evaluate((viewportWidth) => {
    const out = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const cs = getComputedStyle(el);
      if (cs.position === "fixed" || cs.visibility === "hidden" || el.closest(".mdc-linear-progress")) continue;
      if (r.right > viewportWidth + 1 || r.left < -1) {
        out.push(`${el.tagName.toLowerCase()}${typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""} right=${Math.round(r.right)}`);
      }
    }
    return { overflow: out.slice(0, 8), count: out.length, scrollWidth: document.documentElement.scrollWidth };
  }, width);
}

async function checkHitAreas(page) {
  return page.evaluate(() => [...document.querySelectorAll("button, a[mat-button], [role='tab'], .mat-mdc-paginator-page-size-select, .mdc-tab")]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
    })
    .map((el) => ({ description: `${el.tagName.toLowerCase()}${typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""}`, height: Math.round(el.getBoundingClientRect().height) }))
    .filter((item) => item.height < 40));
}

async function run() {
  const browser = await chromium.launch();
  const failures = [];
  const reports = [];
  for (const viewport of [{ width: 375, height: 812 }, { width: 1440, height: 900 }]) {
    for (const theme of ["light", "dark"]) {
      for (const route of routes) {
        const context = await browser.newContext({ viewport, colorScheme: theme });
        const page = await context.newPage();
        await page.goto(`http://localhost:4175/apps/angular-material${route}?theme=${theme}`, { waitUntil: "networkidle" });
        await page.waitForTimeout(500);
        const result = await checkOverflow(page, viewport.width);
        reports.push(`overflow ${route} ${viewport.width} ${theme}: ${result.count} elements, scrollWidth=${result.scrollWidth}`);
        if (result.count) failures.push(`${route} ${viewport.width} ${theme}: overflow ${result.count} :: ${result.overflow.join(" | ")}`);

        if (route === "/" && viewport.width === 1440 && theme === "light") {
          await page.locator('button[aria-label="通知"]').click();
          const visible = await page.locator(".mat-mdc-menu-panel").isVisible().catch(() => false);
          reports.push(`notification bell: ${visible ? "visible" : "not visible"}`);
          if (!visible) failures.push("notification bell menu did not become visible");
        }
        if (route === "/orders" && theme === "light") {
          const hitAreas = await checkHitAreas(page);
          reports.push(`hit areas /orders ${viewport.width}: ${hitAreas.length ? hitAreas.map(item => `${item.description}=${item.height}`).join(", ") : "all >=40px"}`);
          if (hitAreas.length) failures.push(`/orders ${viewport.width} hit areas below 40px: ${hitAreas.map(item => `${item.description}=${item.height}`).join(", ")}`);
          const trigger = viewport.width <= 599 ? page.locator(".order-card").first() : page.locator("tr.mat-mdc-row").first();
          await trigger.click();
          await page.waitForTimeout(600);
          const drawerState = await page.evaluate(() => {
            const drawer = document.querySelector(".details-drawer");
            const backdrop = document.querySelector(".mat-drawer-backdrop.mat-drawer-shown");
            const rect = drawer?.getBoundingClientRect();
            return { visible: !!drawer && getComputedStyle(drawer).visibility !== "hidden", height: Math.round(rect?.height ?? 0), backdrop: !!backdrop && getComputedStyle(backdrop).visibility !== "hidden" };
          });
          reports.push(`orders drawer ${viewport.width}: visible=${drawerState.visible} height=${drawerState.height} backdrop=${drawerState.backdrop}`);
          if (!drawerState.visible || drawerState.height <= 400 || !drawerState.backdrop) failures.push(`/orders ${viewport.width} drawer check failed`);
          await page.locator(".details-drawer button").first().click();
          await page.waitForTimeout(600);
          if (await page.locator(".details-drawer.mat-drawer-opened").count()) failures.push(`/orders ${viewport.width} drawer close failed`);
          if (viewport.width === 375) {
            await page.locator('button[aria-label="订单操作"]').first().click();
            await page.getByRole("menuitem", { name: "删除" }).click();
            await page.getByLabel("输入 DELETE 确认").fill("DELETE");
            await page.getByRole("button", { name: "删除订单" }).click();
            const snack = page.locator(".mat-mdc-snack-bar-container");
            await snack.waitFor({ state: "visible", timeout: 2000 });
            const snackLayout = await snack.evaluate((el) => {
              const label = el.querySelector(".mat-mdc-snack-bar-label")?.getBoundingClientRect();
              const action = el.querySelector(".mat-mdc-snack-bar-actions button")?.getBoundingClientRect();
              return { labelTop: Math.round(label?.top ?? 0), actionTop: Math.round(action?.top ?? 0) };
            });
            reports.push(`snackbar /orders 375: labelTop=${snackLayout.labelTop} actionTop=${snackLayout.actionTop}`);
            if (snackLayout.labelTop !== snackLayout.actionTop) failures.push("orders snackbar action wrapped to another line");
          }
        }
        if (route === "/settings" && theme === "light") {
          const hitAreas = await checkHitAreas(page);
          reports.push(`hit areas /settings ${viewport.width}: ${hitAreas.length ? hitAreas.map(item => `${item.description}=${item.height}`).join(", ") : "all >=40px"}`);
          if (hitAreas.length) failures.push(`/settings ${viewport.width} hit areas below 40px: ${hitAreas.map(item => `${item.description}=${item.height}`).join(", ")}`);
        }
        if (route === "/" && viewport.width === 375) {
          const colors = await page.evaluate(() => {
            const muted = document.querySelector(".muted");
            return muted ? { foreground: getComputedStyle(muted).color, background: getComputedStyle(document.body).backgroundColor } : null;
          });
          const result = colors ? contrast(colors.foreground, colors.background) : null;
          reports.push(`contrast / 375 ${theme}: ${result?.toFixed(2) ?? "unavailable"}:1`);
          if (result !== null && result < 4.5) failures.push(`muted contrast below 4.5 on / 375 ${theme}: ${result.toFixed(2)}:1`);
        }
        await context.close();
      }
    }
  }
  await browser.close();
  return { failures, reports };
}

try {
  const { failures, reports } = await run();
  console.log(reports.join("\n"));
  console.log(failures.length ? `probe failures: ${failures.length}\n${failures.join("\n")}` : "probe failures: 0");
  process.exitCode = failures.length ? 1 : 0;
} finally {
  server.close();
}
