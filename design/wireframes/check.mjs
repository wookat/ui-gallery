// 阶段 1 门禁：用 Playwright（tools/shoot 的 1.62.1）打开每个线框 × 状态，1440×900 与 375×812 截图到 shots/wireframes/（不入库），
// 断言 375 下 document.documentElement.scrollWidth <= 375，且无 console error。
// 用法：node design/wireframes/check.mjs   （仓库根执行；先 pnpm install --filter @ui-gallery/shoot）
import { chromium } from "../../tools/shoot/node_modules/playwright/index.mjs";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = new URL("../../", import.meta.url).pathname;
const out = join(root, "shots", "wireframes");
mkdirSync(out, { recursive: true });

const screens = {
  login: ["default", "invalid", "loading", "error"],
  dashboard: ["success", "loading", "empty", "error", "success&toast=login"],
};
const viewports = { 1440: [1440, 900], 375: [375, 812] };

const browser = await chromium.launch();
let fail = 0;
for (const [screen, states] of Object.entries(screens)) {
  for (const [vp, [width, height]] of Object.entries(viewports)) {
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    for (const state of states) {
      const url = pathToFileURL(join(root, "design/wireframes", `${screen}.html`)).href + `?state=${state}`;
      await page.goto(url, { waitUntil: "load" });
      const name = `${screen}-${state.replace(/[^a-z]+/g, "-")}-${vp}.png`;
      await page.screenshot({ path: join(out, name), fullPage: true });
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      const bodySw = await page.evaluate(() => document.body.scrollWidth);
      const ok = sw <= width && bodySw <= width && errors.length === 0;
      if (!ok) fail++;
      console.log(`${ok ? "ok  " : "FAIL"} ${name.padEnd(44)} scrollWidth=${sw}/${bodySw} (viewport ${width}) errors=${errors.length}`);
    }
    await ctx.close();
  }
}
await browser.close();
console.log(fail ? `\n${fail} FAIL` : "\nwireframes ok");
process.exit(fail ? 1 : 0);
