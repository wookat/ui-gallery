// node tools/shoot.mjs <screen> [--build]
// 1440/375 × 亮/暗 × 状态（src/pages/<screen>/shots.json，默认 ?state=default|loading|empty|error）
// 输出 shots/reference/<screen>/<viewport>-<theme>-<name>.png，命名与 design/hifi/<screen>/ref 一致，供 compare.mjs 配对。
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium, openPage, pageUrl, screenArg, serveDist, settle, shotList, shotsRoot, themes, viewports } from "./_shared.mjs";

const screen = screenArg();
const list = shotList(screen);
const out = join(shotsRoot, screen);
mkdirSync(out, { recursive: true });

const { origin, close } = await serveDist();
const browser = await chromium.launch();
let n = 0;
const errors = [];
for (const [vpName, vp] of Object.entries(viewports)) {
  for (const theme of themes) {
    const { ctx, page, errors: errs } = await openPage(browser, vp, theme);
    for (const { name, query, overlay, scrollTo } of list) {
      await page.goto(pageUrl(origin, screen, query, theme), { waitUntil: "networkidle" });
      await settle(page);
      if (scrollTo) {
        await page.locator(scrollTo).first().evaluate((el) => el.scrollIntoView({ block: "start" }));
        await page.waitForTimeout(200);
      }
      // 浮层（fixed 抽屉/菜单/Toast）截视口；其余整页
      await page.screenshot({ path: join(out, `${vpName}-${theme}-${name}.png`), fullPage: !overlay });
      n++;
    }
    if (errs.length) errors.push(`${vpName}/${theme}: ${errs.join(" | ")}`);
    await ctx.close();
  }
}
await browser.close();
close();
console.log(`shot ${n} → ${out}`);
if (errors.length) {
  console.error(`console error ${errors.length}:\n${errors.join("\n")}`);
  process.exit(1);
}
